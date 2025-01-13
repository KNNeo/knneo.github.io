//--DEFAULT STATE--//
const config = {
	ids: [2593,6280,9333,16528,16782,34537,36098,41168,39728,40787,49590,269,189,1606,4224,4898,5150,5680,1722,3958,355,6773,6802,7791,6956,7785,6707,8675,8769,9314,1589,10163,9776,10165,10521,2787,12531,12119,12189,13535,11887,13333,14227,14921,13659,12291,16498,18119,16009,9479,17895,16067,19365,20847,18139,21405,21327,21561,22145,23079,24031,23273,23209,24629,24833,27775,28617,25879,29163,28619,28621,30654,31043,31636,31478,31952,33341,33094,31646,33337,33988,34822,32901,25777,34350,34881,34902,34280,35639,34618,35557,35180,36049,35540,35860,36470,37188,35968,35821,37171,35760,36654,36649,37722,36317,37982,37999,38778,38003,38295,38759,38524,38753,38993,38619,38276,37525,35252,39534,38992,39017,40716,39710,40591,40052,41226,40839,41389,40571,40028,42897,42250,41103,40938,43007,43969,47257,48849,46471,48926,45055,42351,49721,48736,48583,43470,49520,43608,50631,45613,42963,50709,51417,49470,51923,42962,41467,50590,52865,50330,44204,50739,51815,51535,50416,50307,50796,51815,54856,54234,53050,53998,49858,54898,55651,53040,54714,49766,51535,55129,52816,56838,54233,53407,55855,54233,54968,52481,57810,57181,57611,56784,52080],
	shows: [],
	voices: [],
	delay: 2500,
	language: 'Japanese',
	locale: 'en-US',
	messages: {
		start: 'Starting...',
		process: 'Processing... "{id}"',
		stop: 'Process cancelled by user.',
		complete: 'Processing complete.',
		restart: 'Save loaded. Restart to fetch again.',
	},
	display: {
		min: 1,
		role: 'Main'
	}
};

//--DOM NODE REFERENCES--//
const inputTextarea = document.querySelector('textarea.input');
const generateButton = document.querySelector('button.generate');
const breakButton = document.querySelector('button.break');
const restartButton = document.querySelector('button.restart');
const outputPre = document.querySelector('pre.output');
const resultsDiv = document.querySelector('div.results');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function generateList() {
	inputTextarea.classList.add('hidden');
	generateButton.classList.add('hidden');
	breakButton.classList.remove('hidden');
	outputPre.innerText = config.messages.start;
	config.ids = inputTextarea.value.split(',').map(v => parseInt(v)).filter(unique);
	config.voices = [];
	config.shows = [];
	config.display.roles = config.display?.role ? (config.display.role || []).split(',') : [];
	// assume config.ids is non empty and is list of ids
	getAllAnimeById();
	// assume config.shows has anime details fetched from API
	getAllAnimeCharactersById();
}

function processState() {
	for(let show of config.shows){
		for(let chars of show?.characters?.filter(s => config.display.roles.length > 0 ? config.display.roles.includes(s.role) : true) || []) {
			let voice = chars.voice_actors?.find(c => c.language == config.language) || {};
			if(voice && voice.person) {
				let state = config.voices.find(s => s.name == voice.person.name);
				if(!state)
					config.voices.push({
						characters: [{...chars.character, role: chars.role, showTitle: show.title, showId: show.mal_id}],
						name: voice.person.name,
						id: voice.person.mal_id
					});
				else {
					let character = state.characters?.find(c => c.name == chars.character.name);
					if(!character)
						state.characters.push({...chars.character, role: chars.role, showTitle: show.title, showId: show.mal_id});
				}
			}
		}
	}
	displayChart(config.voices
		.filter(v => v.characters.length >= config.display.min) 
		.sort(function(a,b) { return b.characters.length - a.characters.length }));
}

function stopProcess() {
	config.error=true;
	breakButton.classList.add('hidden');
	restartButton.classList.remove('hidden');
	outputPre.innerText = config.messages.stop;
}

function restartProcess() {
	inputTextarea.classList.remove('hidden');
	generateButton.classList.remove('hidden');
	restartButton.classList.add('hidden');
}

//--FUNCTIONS--//
function unique(value, index, array) {
  return array.indexOf(value) === index;
}

function getAllAnimeById() {
	staggerGet(config.ids, 'https://api.jikan.moe/v4/anime/{id}/full', processShow, config.delay);
}

function processShow(id, content, time) {
	if(content) {
		if(!config.shows.map(s => s.mal_id).includes(id)) {
			config.shows.push(content.data);
			outputPre.innerText = config.messages.process.replace('{id}', content.data.title) + ' (' + config.shows.length + ' / ' + config.ids.length + ')';
		}
	}
	else {
		config.error = true;
		console.error('Error processing show', id);
	}
	
	if(config.shows.length >= config.ids.length) {
		breakButton.classList.add('hidden');
		restartButton.classList.remove('hidden');
		outputPre.innerText = config.messages.complete;
	}
}

function getAllAnimeCharactersById() {
	staggerGet(config.ids, 'https://api.jikan.moe/v4/anime/{id}/characters', processCharacters, config.delay);
}

function processCharacters(id, content, time) {
	if(content) {
		let show = config.shows.find(s => s.mal_id == id);
		if(show) {
			show.characters = content.data;
			outputPre.innerText = config.messages.process.replace('{id}', show.title) + ' (' + config.shows.length + ' / ' + config.ids.length + ')';
			processState();
		}
	}
	else {
		config.error = true;
		console.error('Error processing characters', id);
	}
	
	if(config.shows.length >= config.ids.length) {
		outputPre.innerText = config.messages.complete;
		save();
	}
}

function staggerGet(list, url, callback, delayMs) {
	if(delayMs < 100)
		delayMs = 100;
	let count = 1;
	for(let item of list){
		if(config.error) return;
		setTimeout(function() {
			try {
				if(config.error) return;
				let time = new Date().getTime();
				getJson(url.replace('{id}', item), function(data) {
					callback(item, data, new Date().getTime() - time);
				});
			}
			catch (err) {
				config.error = true;
				alert(err);
			}
		}, delayMs * count++);
	}
}

function displayChart(voices) {
	// save user sort order before render
	let nameOrder = resultsDiv.querySelector('.header.name')?.getAttribute('data-order');
	let countOrder = resultsDiv.querySelector('.header.count')?.getAttribute('data-order');
	resultsDiv.innerHTML = '';
	
	let search = document.createElement('input');
	search.classList.add('search');
	search.setAttribute('onchange', 'filterNames()');
	resultsDiv.insertBefore(search, resultsDiv.firstElementChild);
	
	let header1 = document.createElement('pre');
	header1.classList.add('header');
	header1.classList.add('name');
	header1.innerText = 'NAME';
	if(nameOrder) header1.setAttribute('data-order', nameOrder);
	header1.setAttribute('onclick', 'sortChart("name")');
	resultsDiv.appendChild(header1);
	
	let header2 = document.createElement('pre');
	header2.classList.add('header');
	header2.classList.add('count');
	header2.innerText = 'COUNT';
	if(countOrder) header2.setAttribute('data-order', countOrder);
	header2.setAttribute('onclick', 'sortChart("count")');
	resultsDiv.appendChild(header2);
	
	for(let voice of voices) {
		let div1 = document.createElement('pre');
		div1.classList.add('name');
		div1.setAttribute('data-id', voice.id);
		div1.title = voice.name;
		div1.innerText = voice.name.replace(',','');
		div1.setAttribute('onclick', 'showPeopleDetails(this.getAttribute("data-id"))');
		resultsDiv.appendChild(div1);
		
		let div2 = document.createElement('pre');
		div2.classList.add('count');
		div2.innerText = voice.characters.length;
		div2.setAttribute('onclick', 'showAllCharacters(this.previousSibling.title)');
		resultsDiv.appendChild(div2);
	}
}

function sortChart(fieldName) {
	// update order attribute
	let order = event.target.getAttribute('data-order');
	if(order == 'asc')
		order = 'desc';
	else if(order == 'desc')
		order = '';
	else
		order = 'asc';
	event.target.setAttribute('data-order', order);
	
	let list = config.voices
		.filter(v => v.characters.length >= config.display.min);
	
	// sort by field name and order
	switch(fieldName) {
		case 'name':
			if(order == 'asc')
				displayChart(list.sort(function(a,b) { return a.name.localeCompare(b.name, config.locale) }));
			else if(order == 'desc')
				displayChart(list.sort(function(a,b) { return b.name.localeCompare(a.name, config.locale) }));
			else
				displayChart(list);
			break;
		case 'count':
			if(order == 'asc')
				displayChart(list.sort(function(a,b) { return a.characters.length - b.characters.length }));
			else if(order == 'desc')
				displayChart(list.sort(function(a,b) { return b.characters.length - a.characters.length }));
			else
				displayChart(list);
			break;
		default:
			displayChart(list);
			break;
	}
}

function showAllCharacters(name) {
	let voice = config.voices.find(v => v.name == name);
	if(voice) {
		let grid = document.createElement('div');
		grid.classList.add('grid');
		
		let header0 = document.createElement('pre');
		header0.classList.add('header');
		header0.innerText = 'ROLE';
		grid.appendChild(header0);
		
		let header1 = document.createElement('pre');
		header1.classList.add('header');
		header1.innerText = 'TITLE';
		grid.appendChild(header1);
		
		let header2 = document.createElement('pre');
		header2.classList.add('header');
		header2.innerText = 'CHARACTER';
		grid.appendChild(header2);
		
		let characters = voice.characters.sort(function(a,b) {
			return (a.role + a.showTitle + a.name).localeCompare((b.role + b.showTitle + b.name), config.locale);
		});
		for(let character of characters) {
			let role = document.createElement('pre');
			role.classList.add('small');
			role.innerText = character.role.slice(0,4);
			role.title = character.role;
			grid.appendChild(role);
			
			let show = document.createElement('pre');
			show.classList.add('small');
			show.innerText = character.showTitle;
			show.title = character.showTitle;
			show.setAttribute('data-id', character.showId);
			show.setAttribute('onclick', 'showAnimeDetails(this.getAttribute("data-id"))');
			grid.appendChild(show);
			
			let name = document.createElement('pre');
			name.classList.add('small');
			name.innerText = character.name.replace(',','');
			name.title = character.name.replace(',','');
			name.setAttribute('data-id', character.mal_id);
			name.setAttribute('onclick', 'showCharacterDetails(this.getAttribute("data-id"))');
			grid.appendChild(name);
		}
		
		popupContent(grid);
	}
}

function showPeopleDetails(id) {
	popupContent('Loading...');
	getJson('https://api.jikan.moe/v4/people/{id}/full'.replace('{id}', id), createMalElementFromJson);
}

function showAnimeDetails(id) {
	popupContent('Loading...');
	getJson('https://api.jikan.moe/v4/anime/{id}/full'.replace('{id}', id), createMalElementFromJson);
}

function showCharacterDetails(id) {
	popupContent('Loading...');
	getJson('https://api.jikan.moe/v4/characters/{id}/full'.replace('{id}', id), createMalElementFromJson);
}

function createMalElementFromJson(response) {
	if(response && response.data && response.data.url) {
		// console.log(response.data);
		// get url to find back parent container (assume initial url is not deformed)
		let url = response.data.url;
		// render container
		let containerDiv = document.createElement('div');
		containerDiv.classList.add('mal-container');
		// render sections
		/* layout
		* ------------------------
		* | content | associated |
		* ------------------------
		* |     _description     |
		* ------------------------
		* |       _related       |
		* ------------------------
		*/
		let contentDiv = document.createElement('div');
		contentDiv.classList.add('mal-content');
		let associatedDiv = document.createElement('div');
		associatedDiv.classList.add('mal-associated');
		let descriptionDiv = document.createElement('div');
		descriptionDiv.classList.add('mal-description');
		let relatedDiv = document.createElement('div');
		relatedDiv.classList.add('mal-related');
		// render fields from response data top level properties
		for(let key of Object.keys(response.data)) {
			try {
				// definitions at the end of each block
				if(typeof(key) == 'string' && key == 'voices' && url.includes('/people/')) {
					let contentTitle = document.createElement('div');
					contentTitle.innerText = 'Appears On';
					associatedDiv.appendChild(contentTitle);
					// remove duplicates
					let list = response.data[key].reduce(function(total, current, index, arr) {
						if(arr.map(a => a.anime.mal_id).includes(current.anime.mal_id))
							total.push(current);
						return total;
					}, []);
					// for featured, show one main role from own list
					let mains = list.filter(d => d.role == 'Main' && ((window['shows-list'] ?? []).includes(d.anime.mal_id)));
					// show any role from own list
					if(mains.length < 1) mains = list.filter(d => (window['shows-list'] ?? []).includes(d.anime.mal_id));
					// show main role from full list
					if(mains.length < 1) mains = list.filter(d => d.role == 'Main');
					let selection = mains.sort(r => 2*Math.random()-1)[0];
					// generate selected anime role
					let contentImg = document.createElement('img');
					contentImg.src = selection.anime.images.jpg.image_url;
					associatedDiv.appendChild(contentImg);				
					let contentBlock = document.createElement('div');
					contentBlock.innerText = selection.anime.title;
					associatedDiv.appendChild(contentBlock);
					// generate related anime roles				
					let contentHeader = document.createElement('div');
					contentHeader.innerText = 'Also Appears On';
					relatedDiv.appendChild(contentHeader);				
					// for related, show other roles from own list
					mains = list.filter(d => (window['shows-list'] ?? []).includes(d.anime.mal_id) && d.anime.mal_id != selection.anime.mal_id);
					// show any main role from full list
					if(mains.length < 5) mains = list.filter(d => d.role == 'Main');
					// cut off at max 5 if too many, else show remainder
					let related = mains.length > 5 ? mains.sort(r => 2*Math.random()-1).slice(0,5) : mains.sort(r => 2*Math.random()-1);
					for(let rel of related) {
						let contentRow = document.createElement('div');
						
						let contentTitle = document.createElement('div');
						contentTitle.innerText = 'Also Appears On';
						if(!url.includes('/people/')) contentRow.appendChild(contentTitle);
						
						let contentImg = document.createElement('img');
						contentImg.src = rel.anime.images.jpg.image_url;
						contentRow.appendChild(contentImg);
						
						let contentBlock = document.createElement('div');
						contentBlock.innerText = rel.anime.title;
						contentRow.appendChild(contentBlock);
						
						relatedDiv.appendChild(contentRow);
					}
				} // associated and related block for people
				if(typeof(key) == 'string' && key == 'voices' && url.includes('/character/')) {
					let actor = response.data[key].filter(l => l.language == 'Japanese');
					if(actor.length > 0) {
						let names = actor[0].person.name.split(',');
						let contentRow = document.createElement('div');
						contentRow.innerText = '(CV: ' + (names.length == 2 ? names.join(' ') : actor[0].person.name) + ')';
						contentDiv.appendChild(contentRow);
					}
				} // display voice actor for character (single,japanese only)
				if(typeof(key) == 'string' && key == 'anime' && url.includes('/character/')) {
					// filter by seasons and PVs
					let list = response.data[key].filter(d => (!d.anime.title.endsWith('PV') || (arr.length > 1 && !d.anime.title.endsWith('Season'))));
					// show full list
					if(list.length < 1) list = response.data[key];
					// console.log(list[0]);
					let contentHeader = document.createElement('div');
					contentHeader.innerText = 'Appears On';
					associatedDiv.appendChild(contentHeader);
					
					let contentImg = document.createElement('img');
					contentImg.src = list[0].anime.images.jpg.image_url;
					associatedDiv.appendChild(contentImg);
					
					let contentBlock = document.createElement('div');
					contentBlock.innerText = response.data[key][0].anime.title;
					associatedDiv.appendChild(contentBlock);
				} // associated block for character
				if(typeof(key) == 'string' && key == 'name_kanji') {
					let contentRow = document.createElement('div');
					contentRow.innerText = response.data[key];
					contentDiv.appendChild(contentRow);					
				} // content block for japanese name
				if(typeof(key) == 'string' && key == 'given_name') {
					let contentRow = document.createElement('div');
					contentRow.innerText = response.data['family_name'] + response.data[key];
					contentDiv.appendChild(contentRow);
				} // content block for native name (default japanese)
				if(typeof(key) == 'string' && key == 'images') {
					let contentRow = document.createElement('img');
					contentRow.src = response.data[key]['jpg']['image_url'];
					contentDiv.appendChild(contentRow);
				} // image source
				if(typeof(key) == 'string' && key == 'birthday' && response.data[key] != null) {
					const date = new Date(response.data[key]);
					if(!date) continue; // if null, skip
					const month = date.toLocaleDateString('en-US', { month: 'short' }); // get month name
					const day = date.getDate();
					const year = date.getFullYear();
					
					let contentRow = document.createElement('div');
					contentRow.innerText = `${month} ${day}, ${year}`;
					contentDiv.appendChild(contentRow);
				} // date treatment in en-US format, can be null
				if(typeof(key) == 'string' && key == 'aired') {
					let contentRow = document.createElement('div');
					contentRow.innerText = response.data[key].string;
					contentDiv.appendChild(contentRow);
				} // date period treatment
				if(typeof(key) == 'string' && ['about','synopsis'].includes(key)) {
					let contentRow = document.createElement('div');
					contentRow.innerText = response.data[key];
					descriptionDiv.appendChild(contentRow);
				} // specific fields supported as specified by key
				if(typeof(key) == 'string' && ['name','score','title','title_japanese','type'].includes(key)) {
					let contentRow = document.createElement('div');
					contentRow.innerText = response.data[key];
					contentDiv.appendChild(contentRow);
				} // for all other supported fields as specified by key
			}
			catch(e) {
				console.error(url, key, e);
			}
		}
		// append sections to container
		containerDiv.appendChild(contentDiv);
		if(associatedDiv.childElementCount > 0) containerDiv.appendChild(associatedDiv);
		containerDiv.appendChild(descriptionDiv);
		if(relatedDiv.childElementCount > 0) containerDiv.appendChild(relatedDiv);
		// replace html of initial container
		popupContent(containerDiv);
	}
}

function filterNames() {
	let search = document.querySelector('.results input');
	for(let name of document.querySelectorAll('.name')) {
		let count = name.nextElementSibling;
		if(!name.innerText.toLowerCase().includes(search.value.toLowerCase())) {
			name.classList.add('hidden');
			count.classList.add('hidden');
		}
		else {
			name.classList.remove('hidden');
			count.classList.remove('hidden');
		}
	}
}

function load() {
	if(localStorage.getItem('anime-details') != null) {
		let ids = JSON.parse(localStorage.getItem('anime-details-ids'));
		if(!ids) ids = config.ids;
		let voices = JSON.parse(localStorage.getItem('anime-details-voices'));
		if(!voices) voices = config.voices;
		// set state
		config.ids = ids;
		config.voices = voices;
		
		inputTextarea.classList.add('hidden');
		generateButton.classList.add('hidden');
		restartButton.classList.remove('hidden');
		
		displayChart(config.voices
			.filter(v => v.characters.length >= config.display.min) 
			.sort(function(a,b) { return b.characters.length - a.characters.length }));
	}
	inputTextarea.value = config.ids;
	outputPre.innerText = config.messages.restart;
}

function clear() {
	if(confirm('This will clear all data fetched, and current view. Confirm?')) {
		localStorage.removeItem('anime-details');
		startup();
	}
}

function save() {
	localStorage.setItem('anime-details', new Date());
	localStorage.setItem('anime-details-ids', JSON.stringify(config.ids));
	localStorage.setItem('anime-details-voices', JSON.stringify(config.voices));
}

//--INITIAL--//
function startup() {
	load();
}

//--DIALOG--//
function popupContent(input) {
	// Dialog component
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null) {
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// Helper function to create dialog with content
	// Note: Node in dialog will not have events! Manual add back or write as attribute!
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object') {
		let closeDiv = document.createElement('button');
		closeDiv.classList.add('close');
		closeDiv.innerText = 'Close';
		closeDiv.setAttribute('onclick', 'removeDialog()');
		dialog.appendChild(closeDiv);
		
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		if(event.target.parentElement == document.querySelector('.dialog'))
			removeDialog();
	});
	dialog.addEventListener('keyup', function() {
		// event.preventDefault();
	});
	return dialog;
}

function removeDialog() {
	document.querySelector('.dialog')?.remove();
}