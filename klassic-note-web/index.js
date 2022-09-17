//--CONFIG--//
let defaultTitle = 'Klassic Note Web';
let altTitlePrefix = 'Original';
let databaseFilename = 'https://knneo.github.io/klassic-note-web/db/KlassicNote.db';
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3
let coverArtDirectory = 'file://F:/RBKN/Pictures/ART/ALBUMART/'; //for cover art, in {directory}/{knyear}/{filename}
let debugMode = false; //will show all available logging on console
let altMode = false; //will switch between titles and alt titles [TODO]
let widescreenAverageModuleSize = 480; //on wide screen widths, tab width for content (responsive)
let autoplayOnSelect = false; //disable player autoplay, will affect queue


//--STARTUP--//
window.addEventListener('load', startup);
window.addEventListener('resize', setTabs);
window.addEventListener('keyup', setKeyUp);
window.addEventListener('keydown', setKeyDown);
window.addEventListener('touchstart', setInput);
window.addEventListener('click', setInput);

//--EVENTS--//
function setInput() {
	if(debugMode)
		console.log(event.type, new Date() - window['last-input']);
	let list = document.querySelector('html').classList;
	if(event.type == 'touchstart' && !list.contains('touchable'))
	{
		document.querySelector('html').classList.add('touchable');
	}
	else if(event.type == 'click' && new Date() - window['last-input'] > 200 && list.contains('touchable'))
	{
		document.querySelector('html').classList.remove('touchable');
	}
	window['last-input'] = new Date();
}

function setKeyUp() {
	if (debugMode) 
		console.log(event.keyCode);
	// space: play/pause when not focus on player
	if (event.keyCode === 32 && document.querySelector('#player') != null 
	&& ['player', 'search'].indexOf(document.activeElement.id) < 0) {
		event.preventDefault();
		if(document.querySelector('#player').paused)
			document.querySelector('#player').play();
		else
			document.querySelector('#player').pause();
	}
	if (event.keyCode === 67 && window['ctrled'] && document.querySelector('#copy') != null) {
		event.preventDefault();
		document.querySelector('#copy').click();
	}
	// shift: combine with click playlist to add 10 songs to queue
	if (event.keyCode === 16) {
		event.preventDefault();
		window['shifted'] = false;
	}
	// ctrl: combine with c to copy search content
	if (event.keyCode === 17) {
		event.preventDefault();
		window['ctrled'] = false;
	}
	if (event.keyCode === 38 && document.querySelector('#player').volume < 1) {
		event.preventDefault();
		document.querySelector('#player').volume = document.querySelector('#player').volume + 0.1;
		if(document.querySelector('#player').volume > 0.99) // prevent js rounding issue
			document.querySelector('#player').volume = 1;
	}
	if (event.keyCode === 40 && document.querySelector('#player').volume > 0) {
		event.preventDefault();
		document.querySelector('#player').volume = document.querySelector('#player').volume - 0.1;
		if(document.querySelector('#player').volume < 0.01) // prevent js rounding issue
			document.querySelector('#player').volume = 0;
	}
	return false;
}

function setKeyDown() {
	if (debugMode) 
		console.log(event.keyCode);
	// space: prevent scroll when play/pause
	if(event.keyCode === 32 && document.activeElement == document.body)
		event.preventDefault();
		
	// shift: combine with click playlist to add 10 songs to queue
	if (event.keyCode === 16) {
		event.preventDefault();
		window['shifted'] = true;
	}
	// ctrl: combine with c to copy search content
	if (event.keyCode === 17) {
		event.preventDefault();
		window['ctrled'] = true;
	}
	return false;
}

function setTabs() {
	let isWidescreen = window.innerWidth >= 960;
	let homePageVisible = document.querySelector('#tab-homepage').style.display != 'none';
	
	//responsive module display	
	let totalModules = Math.round(window.innerWidth / widescreenAverageModuleSize);
	if(debugMode) console.log('totalModules', totalModules);
	
	for(let tab of document.getElementsByClassName('tab'))
	{
		let hasModules = Array.from(tab.childNodes).filter(c => c.childNodes.length > 0).length > 0;
		if(debugMode) console.log('hasModules', tab.id, hasModules);
		let tabButton = document.querySelector('#button-' + tab.id);
		if(tabButton != null) //button controls on mobile
		{
			tabButton.style.cursor = hasModules ? 'pointer' : '';
			tabButton.disabled = !hasModules;
		}

		for(let module of tab.getElementsByClassName('module')) //remove padding if no elements
		{
			let hasComponents = Array.from(module.childNodes).filter(c => c.childNodes.length > 0).length > 0;
			module.style.padding = hasComponents ? '' : 0;
		}
		
		//mobile alignments
		if(isWidescreen && !tab.classList.contains('tab-view')) tab.classList.add('tab-view');
		if(!isWidescreen && tab.classList.contains('tab-view')) tab.classList.remove('tab-view');
		
		//hide if homepage
		tab.style.display = homePageVisible ? 'none' : '';
		tab.style.display = isWidescreen ? 'inline-block' : '';
		tab.style.width = isWidescreen && hasModules ? ((window.innerWidth / totalModules) - 20) + 'px' : ''; //exclude horizontal padding
	}
	
	if(!isWidescreen)
	{
		if(window['mode'] == 'song') showTab('tab-info');
		if(window['mode'] == 'year') showTab('tab-year');
		if(window['mode'] == 'artist') showTab('tab-info');
	}
	
	document.querySelector('#tab-buttons').style.display = isWidescreen ? 'none' : '';
	let tabHeight = window.innerHeight - Array.from(document.getElementsByClassName('calc')).reduce((total, current) => { return total + current.offsetHeight; }, 10) + 'px';
	if (debugMode) console.log('containerHeight', document.querySelector('#tab-list').style.height);
	
	document.querySelector('#search').style.width = homePageVisible ? '100%' : (document.querySelector('#options').getBoundingClientRect().width - 48) + 'px';
	document.querySelector('#search-buttons').style.display = homePageVisible ? 'none' : '';
	
	hideContextMenus(true);
	
	//adjust height
	if(debugMode) console.log(tabHeight, document.querySelector('#tab-list').style.height);
	if(tabHeight != document.querySelector('#tab-list').style.height)
	{
		document.querySelector('#tab-list').style.height = tabHeight;
		setTimeout(setTabs, 100);
	}
}

function showTab(activeTab) {
	for(let tab of document.getElementsByClassName('tab'))
	{
		tab.style.display = tab.id == activeTab ? 'block' : 'none';
		if(tab.classList.contains('tab-view')) tab.style.display = 'inline-block';
	}
}

function hoverOnTableRow() {
	let titleCells = this.parentNode.getElementsByClassName('table-title').length;
	let columns = this.parentNode.getElementsByTagName('th').length - (titleCells > 0 ? titleCells : 0); //estimate
	let rowCells = this.getElementsByTagName('td');
	let spanRow = findSpanSibling(this, columns);
	let spanCells = spanRow.getElementsByTagName('td');
	
	if(rowCells.length + 1 == spanCells.length && spanCells[0].rowSpan != undefined && !spanRow.classList.contains('not-selectable'))
		spanCells[0].classList.toggle('highlight');
	
	for(let cell of rowCells)
	{
		cell.classList.toggle('highlight');
	}
}

function findSpanSibling(row, columns) {
	let returnRow = row;
	while(returnRow.childNodes.length < columns && returnRow.childNodes.length <= row.childNodes.length)
	{
		returnRow = returnRow.previousSibling;
	}
	return returnRow;
}

function copySearch() {
	let search = document.querySelector('#search').value.split(' - ');
	if(search.length == 2)
	{
		navigator.clipboard.writeText(search[1] + '\t' + search[0]);
	}
	else
	{
		navigator.clipboard.writeText(search[0]);
	}
	document.querySelector('#copy').innerText = 'done';
	document.querySelector('#copy').style.cursor = 'none';
	setTimeout( function() { 
		document.querySelector('#copy').innerText = 'content_copy'; 
		document.querySelector('#copy').style.cursor = '';
	}, 2000);
}

function clearSearch() {
	document.querySelector('#music').innerHTML = '';
	document.querySelector('#search').value = '';
	document.querySelector('#tab-homepage').style.display = '';
	document.querySelector('#search-buttons').style.display = 'none';
	document.querySelector('#search').style.width = '100%';
	document.querySelector('#tab-buttons').innerHTML = '';
	document.querySelector('#cover').style.display = 'none';
	document.querySelector('#cover').classList = [];
	clearModules();
	resetQueueView();
	generateHomepage();
	setTabs();
}

function toggleAutoplay() {
	window['autoplay-select'] = !window['autoplay-select'];
	document.querySelector('.autoplay').innerText = window['autoplay-select'] ? 'music_note' : 'music_off';
}

function randomSong(randomSongOnSelect) {
	event.preventDefault();
	
	document.querySelector('#search').value = '';
	let query = "SELECT COUNT(*) FROM Song";
	// console.log('query', query);
	if(document.querySelector('#player') != null && document.querySelector('#player').buffered.length < 1) 
	{
		window['playlist'] = [];
		document.querySelector('#random-count').innerText = '';
	}
	
	let content = Array.from(document.querySelectorAll('#options option')).filter(c => c.value > 0).map(val => val.value);
	let total = 10; // content.length;
	// if(randomSongOnSelect && content.length == 1) {
		randomSongOnSelect = false;
	// };
	let songsToQueue = window['shifted'] ? total : 1;
	
	if(randomSongOnSelect)
	{
		let random = '0';
		while (songsToQueue > 0) {
			random = content[Math.floor((Math.random() * total))].toString();
			if(window['playlist'].indexOf(random) < 0)
			{
				window['playlist'].push(random);
				songsToQueue--;
			}
		};
		
		if(debugMode) console.log('playlist',window['playlist']);
		updateQueueButtons();
		// window['playlist'].shift();
		// if(document.querySelector('#player') == null || document.querySelector('#player').paused)
		// {
			// when autoplay is off
			// if(!window['autoplay-select'] && window['playlist'].length == 2)
				// window['playlist'].shift();
			// let optQuery = "SELECT * FROM Song WHERE KNID = ";
			// optQuery += window['playlist'][0];
			// if(debugMode) console.log('optQuery', optQuery);
			// queryDb(optQuery, updateOptions);
		// }
	}
	else
	{
		queryDb(query, function(content) {
			// console.log('content', content);
			let total = content.values[0][0];
			
			let random = '0';
			do {
				random = Math.floor((Math.random() * total)).toString();
				if(window['playlist'].indexOf(random) < 0)
				{
					window['playlist'].push(random);
					songsToQueue--;
				}
			} while (songsToQueue > 0);
			if(debugMode) console.log('playlist', window['playlist']);
			updateQueueButtons();
			/*
			if(document.querySelector('#player') == null || document.querySelector('#player').paused)
			{
				// when autoplay is off
				// if(window['playlist'].length == 2)
					// window['playlist'].shift();
				let optQuery = "SELECT * FROM Song WHERE KNID = ";
				optQuery += window['playlist'][0];
				if(debugMode) console.log('optQuery', optQuery);
				queryDb(optQuery, updateOptions);
			}*/
		});
	}	
};

function skipSong() {
	if(window['playing'] == null) window['playing'] = 0;
	if(document.querySelector('#player') == null)
	{
		let optQuery = "SELECT * FROM Song WHERE KNID = ";
		optQuery += window['playlist'][0];
		if(debugMode) console.log('optQuery', optQuery);
		queryDb(optQuery, updateOptions);
	}
	else// if(document.querySelector('#random-count').innerText.length > 0)
		document.querySelector('#player').dispatchEvent(new Event('ended'));
	// updateQueue();
}

function updateQueue(next) {
	// let queued = window['playlist'].length - ((document.querySelector('#player') == null) ? 0 : 1);
	if(window['playing'] == null) window['playing'] = 0;
	else window['playing'] = next ?? window['playing'] + 1;
	if(debugMode) console.log('queued', queued);
	// let queueText = queued > 0 ? (queued + ' song' + (queued > 1 ? 's' : '') + ' in queue') : '';
	// document.querySelector('#random-count').title = queueText;
	// document.querySelector('#random-count').innerText = queueText;
}

function updateQueueButtons() {
	document.querySelector('#queue-skip').style.display = window['playing'] == null || window['playing'] < window['playlist'].length - 1 ? '' : 'none';
	document.querySelector('#queue-clear').style.display = window['playlist'].length > 0 ? '' : 'none';	
}

function clearQueue() {
	event.preventDefault();
	window['playlist'] = window['playlist'].slice(-1);
	document.querySelector('#random-count').innerText = 'Queue cleared';
	setTimeout(resetQueueView, 1000);
}

function resetQueueView() {
	document.querySelector('#random-count').innerText = '';
	window['playlist'] = [];
	document.querySelector('#queue-skip').style.display = 'none';
	document.querySelector('#queue-clear').style.display = 'none';
}

function runLoader() {
	switch(document.querySelector('.loader').innerText)
	{
		case 'hourglass_full': 
			document.querySelector('.loader').innerText = 'hourglass_empty';
			break;
		case 'hourglass_empty': 
			document.querySelector('.loader').innerText = 'hourglass_bottom';
			break;
		case 'hourglass_bottom': 
			document.querySelector('.loader').innerText = 'hourglass_full';
			break;
		default:
			document.querySelector('.loader').innerText = 'hourglass_empty';
			break;
	}
	if(window['loading']) setTimeout(runLoader, 500);
}

function stopLoader() {
	window['loading'] = false;
	document.querySelector('.loader').classList.add('hidden');
}

//--FUNCTIONS--//
async function callDb(query, callback) {
	const time = Date.now();
	//for webassembly file
	const SQL = await initSqlJs({
	  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
	  // You can omit locateFile completely when running in node
	  locateFile: file => 'https://knneo.github.io/klassic-note-web/sql-wasm.wasm'
	});

	// for sqlite db
	const xhr = new XMLHttpRequest();
	xhr.open('GET', databaseFilename, true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = e => {
	  const uInt8Array = new Uint8Array(xhr.response);
	  window['db'] = new SQL.Database(uInt8Array);
	  const contents = window['db'].exec(query);
	  // console.log('callDb',contents);
	  if(contents && contents.length > 0)
		  callback(contents[0]);
	  else if(contents)
		  callback(contents);
	  // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
	};
	xhr.send();
	
	if(debugMode) console.log('callDb took', Date.now() - time, 'ms');
}

function queryDb(query, callback) {
	const time = Date.now();	
	const contents = window['db'].exec(query);
	// console.log('queryDb',contents);
	if(contents && contents.length > 0)
	  return callback(contents[0]);
	else if(contents)
	  return callback(contents);
  
	if(debugMode) console.log('queryDb took', Date.now() - time, 'ms');
}

function startup() {
	document.querySelector('#title').innerText = defaultTitle;
	document.title = defaultTitle;
	renderSettings();
	renderVariables();
	generateFilters();
	runLoader();
	generateHomepage();
	setTabs();
	addDragAndDrop();
}

function renderSettings() {
	document.querySelector('#queue-skip').style.display = 'none';
	document.querySelector('#queue-clear').style.display = 'none';
	document.querySelector('.autoplay').innerText = window['autoplay-select'] ? 'music_note' : 'music_off';
}

function renderVariables() {
	// set variables here, do not define above
	window['autoplay-select'] = autoplayOnSelect;
	window['db'] = null;
	window['playlist'] = [];
	window['mode'] = 'song';
	window['playing'] = null;
	window['loading'] = true;
}

function generateHomepage() {
	//initial query for options
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
	
	query = "SELECT DISTINCT KNYEAR FROM SongAwardsPeriod";
	if(debugMode) console.log('generateYears', query);
	callDb(query, generateYears);
	
	let recent = localStorage.getItem('recent');
	recent = (recent == null || recent.length == 0) ? JSON.parse('[]') : JSON.parse(recent);
	
	query = "";
	for(let id of recent)
	{
		query += "UNION ALL ";
		if(query == "UNION ALL ") query = "";
		query += "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE KNID = " + id.toString() + " ";
	}
	if(debugMode) console.log('generateSearchHistory', query);
	callDb(query, generateSearchHistory);
	
	query = "SELECT Type, Category, ReleaseTitle, ReleaseArtistTitle, KNYEAR, substr('0000'||ReleaseDate,-4) as ReleaseDate FROM Release ";
	query += "WHERE KNYEAR = strftime('%Y','now') ";
	query += "AND ReleaseDate >= cast(strftime('%m%d','now') as integer) ORDER BY ReleaseDate, ReleaseArtistTitle, ReleaseTitle LIMIT 10";
	if(debugMode) console.log('generateUpcomingReleases', query);
	callDb(query, generateUpcomingReleases);
}

function generateYears(contents) {
	document.querySelector('#award-years').innerHTML = '';
	stopLoader();
	
	if(debugMode) console.log('generateYears', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Years';
	document.querySelector('#award-years').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('div');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('tags');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		
		let tc = document.createElement('span');
		tc.classList.add('content-box');
		tc.classList.add('tag');
		tc.setAttribute('data-year', row[columnIndexKNYEAR]);
		tc.innerText = row[columnIndexKNYEAR];
		tc.addEventListener('click', updateYear);
		table.appendChild(tc);
		
	}
	
	document.querySelector('#award-years').appendChild(table);
}

function generateSearchHistory(contents) {
	document.querySelector('#search-history').innerHTML = '';
	
	if(debugMode) console.log('generateSearchHistory', contents);
	if(!contents || !contents.columns || !contents.values) return;
	
	// let headerDiv = document.createElement('h4');
	// headerDiv.classList.add('centered');
	document.querySelector('#search-history').style.position = 'relative';
	document.querySelector('#search-history').style.maxWidth = '680px';
	document.querySelector('#search-history').style.margin = 'auto';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Recently Searched';
	document.querySelector('#search-history').appendChild(header);	
	
	let clear = document.createElement('h6');
	clear.classList.add('centered');
	clear.classList.add('clear');
	clear.style.cursor = 'pointer';
	clear.innerText = 'Clear All';
	clear.addEventListener('click', function() {
		localStorage.removeItem('recent');
		generateSearchHistory();
	});
	document.querySelector('#search-history').appendChild(clear);	
	
	// document.querySelector('#search-history').appendChild(headerDiv);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');	
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tr.appendChild(tc);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#search-history').appendChild(table);
}

function generateUpcomingReleases(contents) {
	document.querySelector('#upcoming-releases').innerHTML = '';
	
	if(debugMode) console.log('generateUpcomingReleases', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Upcoming Releases';
	document.querySelector('#upcoming-releases').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');	
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexType = contents.columns.indexOf('Type');
		let columnIndexCategory = contents.columns.indexOf('Category');
		let columnIndexReleaseTitle = contents.columns.indexOf('ReleaseTitle');
		let columnIndexReleaseArtistTitle = contents.columns.indexOf('ReleaseArtistTitle');
		let columnIndexReleaseDate = contents.columns.indexOf('ReleaseDate');
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		// tc.style.cursor = 'pointer';
		tc.innerText = row[columnIndexKNYEAR] + row[columnIndexReleaseDate] + ' - [' + row[columnIndexType] + ' ' + row[columnIndexCategory] + '] '+ row[columnIndexReleaseArtistTitle] + ' - ' + row[columnIndexReleaseTitle];
		tr.appendChild(tc);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#upcoming-releases').appendChild(table);
}

function generateTabs() {
	document.querySelector('#tab-buttons').innerHTML = '';
	
	let tabNames = [];
	for(let tab of document.getElementsByClassName('tab'))
	{
		//show different info tab
		if(window['mode'] == 'year' && tab.id == 'tab-info') continue;
		if(window['mode'] == 'song' && tab.id == 'tab-year') continue;
		if(window['mode'] == 'artist' && tab.id == 'tab-year') continue;
		//hide unused tabs
		if(window['mode'] == 'song' && tab.id == 'tab-artist') continue;
		if(window['mode'] == 'year' && tab.id == 'tab-related') continue;
		if(window['mode'] == 'artist' && tab.id == 'tab-related') continue;
		
		let tabItem = document.createElement('button');
		tabItem.id = 'button-' + tab.id;
		tabItem.classList.add('tab-button');
		tabItem.innerText = tab.getAttribute('data-name');
		// tabItem.style.cursor = 'pointer';
		tabItem.addEventListener('click', function() {
			showTab(tab.id);
		});
		
		document.querySelector('#tab-buttons').appendChild(tabItem);
		
		if(tabNames.indexOf(tabItem.innerText) >= 0)
		{
			console.error('duplicate tab name exists: ' + tabItem.innerText);
			break;
		}
		else
			tabNames.push(tabItem.innerText);
	}
}

function generateFilters() {
	let filters = document.querySelector('#filters');
	filters.classList.add('centered');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.disabled = true;
	search.placeholder = 'Song Title, Artist Title, KNYEAR...';
	search.addEventListener('focus', selectAll);
	search.addEventListener('input', function() {
		let searchFields = [].join(" || ");
		let query = "";
		// console.log('querySelect', document.querySelector('#search').value);
		
		searchFields = ['ArtistTitle'].join(" || ");
		query += "SELECT ArtistID AS KNID, '' AS KNYEAR, '' AS SongTitle, ArtistTitle FROM Artist WHERE TRUE "
		query += addQuotationInSQLString(document.querySelector('#search').value).split(' ').map(v => "AND " + searchFields + " LIKE '%" + v + "%'").join('');
		query += " UNION ALL ";
		
		searchFields = ['SongTitle','ArtistTitle','KNYEAR'].join(" || ");
		query += "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE TRUE ";
		query += addQuotationInSQLString(document.querySelector('#search').value).split(' ').map(v => "AND " + searchFields + " LIKE '%" + v + "%'").join('');
		
		if(debugMode) console.log('search', query);
		queryDb(query, updateOptions);
	});
	filters.appendChild(search);
	
	let searchButtons = document.createElement('span');
	searchButtons.id = 'search-buttons';
	searchButtons.style.display = 'none';
	
	let tcl = document.createElement('a');
	tcl.id = 'clear';
	tcl.title = 'Clear Search';
	tcl.classList.add('material-icons');
	tcl.href = 'javascript:void(0);';
	tcl.addEventListener('click', clearSearch);
	tcl.innerText = 'clear';
	searchButtons.appendChild(tcl);
	
	let tc = document.createElement('a');
	tc.id = 'copy';
	tc.title = 'Copy Search as Table';
	tc.classList.add('material-icons');
	tc.href = 'javascript:void(0);';
	tc.addEventListener('click', copySearch);
	tc.innerText = 'content_copy';
	searchButtons.appendChild(tc);
	
	filters.appendChild(searchButtons);
		
	let options = document.createElement('select');
	options.id = 'options';
	options.addEventListener('change', onChangeOption);
	
		let opt = document.createElement('option');
		opt.innerText = '===';
		options.appendChild(opt);
		
	filters.appendChild(options);
}

function onChangeOption() {
	let id = document.querySelector('#options').value;
	if(debugMode) console.log('onChangeOption', id);
	//select by id value format
	if(id.startsWith('A'))
	{
		window['mode'] = 'artist';
		
		let query = "SELECT ArtistTitle AS 'Artist Title' FROM Artist WHERE ArtistID = " + id.replace('A','');
		if(debugMode) console.log('query', query);
		queryDb(query, generateLayout);
		
		query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE ArtistID = " + id.replace('A','');
		if(isMobile())
			query += " LIMIT 100";
		callDb(query, updateOptions);
	}
	else if(parseInt(id) > 0)
	{
		window['mode'] = 'song';
		let query = "SELECT KNID as ID, KNYEAR, Filename, SongTitle as 'Song Title', ArtistTitle as 'Artist Title', ReleaseTitle as 'Release Title', ReleaseArtistTitle as 'Release Artist', ReleaseYear as 'Year', Rating, Genre, DateCreated as 'Date Added', VocalCode as 'Vocal Code', LanguageCode as 'Language', LyricsURL as 'Lyrics', SongTitleAlt as '" + altTitlePrefix + " Song Title', ArtistID, ReleaseID FROM Song WHERE KNID = " + id;
		if(debugMode) console.log('query', query);
		queryDb(query, generateLayout);
	}
}

function selectAll() {
	this.setSelectionRange(0, this.value.length);
}

function updateOptions(contents) {
	// console.log('updateOptions', contents);
	let search = document.querySelector('#search');
	let options = document.querySelector('#options');
	options.innerHTML = '';
	let newOptions = [];
	
	//default
	newOptions.push({
		id: 0,
		optionString: '===' + (contents?.values?.length || 'no') + ' options==='
	});
	
	if(contents.columns) {
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		if(contents.values && contents.values.length > 0)
		{
			for(let row of contents.values) {
				let id = row[columnIndexKNID];
				let knyear = row[columnIndexKNYEAR];
				let title = row[columnIndexSongTitle];
				let artist = row[columnIndexArtistTitle];
				newOptions.push({
					id,
					optionString: knyear + ' - ' + artist +  ' - ' + title
				});
			}
			
		}
		
		for(let newOption of newOptions)
		{
			let opt = document.createElement('option');
			opt.value = (newOption.optionString.startsWith(' - ') ? 'A' : '') + newOption.id;
			opt.innerHTML = newOption.optionString.replace(search.value, '<span style="font-weight: bold;">' + search.value + '</span>');
			
			options.appendChild(opt);
		}
		if(newOptions.length == 2 && window['mode'] != 'artist') //1 result with default
		{
			search.blur();
			setTimeout(function() {
				document.querySelector('#options').value = contents.values[0][columnIndexKNID];
				document.querySelector('#options').dispatchEvent(new Event('change'));
			},200);
		}
		
		options.disabled = newOptions.length == 2;
		search.disabled = false;
	}
	else {
		for(let newOption of newOptions)
		{
			let opt = document.createElement('option');
			opt.value = newOption.id;
			opt.innerText = newOption.optionString;
			
			options.appendChild(opt);
		}		
	}
	// console.log('newOptions', newOptions);
}

function scrollToTop() {
    document.querySelector('#tab-list').scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
}

function generateTableByData(contents, id, title, excludedColumns = []) {
	document.getElementById(id).innerHTML = '';
	
	if(debugMode) console.log('generateTableByData', id);
	if(!id || !contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = title || '';
	document.getElementById(id).appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let row = rows[0];
	for(let r = 0; r < columns.length; r++)
	{
		let rowVal = row[r];
		if(!rowVal || rowVal.length == 0) continue;
		if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = columns[r];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = rowVal;
		if(rowVal.toString().includes('https://') || rowVal.toString().includes('http://'))
			td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById(id).appendChild(table);
}

function generateTableList(contents, id, title, rowFormat, onClick, onContextMenu, context) {
	document.getElementById(id).innerHTML = '';
	
	if(debugMode) console.log('generateTableList', id);
	if(!id || !rowFormat || !contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = title;
	document.getElementById(id).appendChild(header);	
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		if(columnIndexKNID < 0) return;
		
		let parts = [];
		for(let format of rowFormat)
		{
			parts.push(row[contents.columns.indexOf(format)]);
		}
	
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.addEventListener('click', onClick);
		tc.setAttribute('context', context);
		tc.addEventListener('contextmenu', onContextMenu);
		tc.innerText = parts.join(' - ');
		tr.appendChild(tc);

		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById(id).appendChild(table);
}

function generateTableByDataWithHeader(contents, id, skipClear, title, skipTitle, excludedColumns = [], dataId = 'KNID', groupColumn = 'Rank #', titleColumn) {	
	if(!skipClear) document.getElementById(id).innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	if(!skipTitle)
	{
		let header = document.createElement('h4');
		header.classList.add('centered');
		header.innerText = title;
		document.getElementById(id).appendChild(header);
	}
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//title
	if(titleColumn)
	{
		let ttr = document.createElement('tr');
		
		let th = document.createElement('th');
		th.classList.add('table-title');
		th.setAttribute('colspan', columns.length - excludedColumns.length);
		th.innerText = rows[0][contents.columns.indexOf(titleColumn)];
		ttr.appendChild(th);
		
		tbody.appendChild(ttr);
		
	}
	
	//header
	let tr = document.createElement('tr');
	tr.classList.add('no-highlight');
	for(let column of columns)
	{
		if(excludedColumns.indexOf(column) < 0)
		{
			let th = document.createElement('th');
			th.innerText = column;
			tr.appendChild(th);
		}
	}
	tbody.appendChild(tr);	
	
	//rows
	let rank = 0;
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf(dataId);
		let columnIndexRankNo = contents.columns.indexOf(groupColumn);
		
		let tr = document.createElement('tr');
		tr.setAttribute('data-id', row[columnIndexKNID]);
		if(document.querySelector('#options').value == row[columnIndexKNID]) {
			tr.classList.add('highlight');
			tr.classList.add('not-selectable');
			tr.addEventListener('active', hoverOnTableRow);
		}
		else {
			tr.style.cursor = 'pointer';
			tr.addEventListener('click', updateSong);
			tr.addEventListener('mouseover', hoverOnTableRow);
			tr.addEventListener('mouseout', hoverOnTableRow);
		}
		
		for(let col = 0; col < columns.length ; col++)
		{
			let columnName = columns[col];
			if(excludedColumns.indexOf(columnName) < 0)
			{
				// if grouping, need to follow row index
				if(columnName == groupColumn)
				{
					if(row[columnIndexRankNo] != rank)
					{
						let span = rows.filter(r => r[columnIndexRankNo] == rank + 1).length;
						let tc = document.createElement('td');
						tc.classList.add('centered-text');
						tc.setAttribute('rowspan', span);
						tc.innerText = row[contents.columns.indexOf(columnName)];
						tr.appendChild(tc);
					}
				}
				else
				{
					let td = document.createElement('td');
					td.innerText = row[contents.columns.indexOf(columnName)];
					tr.appendChild(td);
				}
			}
		}
		
		tbody.appendChild(tr);
		
		rank = row[columnIndexRankNo];
	}
		
	table.appendChild(tbody);
	document.getElementById(id).appendChild(table);
}

function generateHistogramRow(contents) {
	
}

//load layout
//flow is generally generateLayout -> query-prefixed functions -> generate-prefixed functions
function generateLayout(contents) {
	if(debugMode) console.log('generateLayout', contents);
	document.querySelector('#tab-homepage').style.display = 'none';
	document.querySelector('#search-buttons').style.display = '';
	document.querySelector('#music').innerHTML = '';
	document.querySelector('#cover').style.display = 'none';
	
	//clear modules
	clearModules();	
	if(window['mode'] == 'year')
	{
		queryYearInfo(contents);
		querySongList(contents); //SOTD is here
		queryAwardsByYear(contents);
		queryRankingsByYear(contents);
		queryCompilationsByYear(contents);
		queryAnalysis(contents);
	}
	
	if(window['mode'] == 'song')
	{
		updateSearch(contents);
		generatePlayer(contents);
		queryCoverArt(contents);
		queryInfo(contents);
		queryRelated(contents);
		queryAwards(contents);
		queryRankings(contents);
		queryCompilations(contents);
		querySOTD(contents);	
	}
	
	if(window['mode'] == 'artist')
	{
		document.querySelector('#search').value = contents.values[0][contents.columns.indexOf('Artist Title')];
		queryArtistInfo(contents);
		queryArtistRelated(contents);
		//awards that artist won? and nominated
		//rankings entered? maybe not list all but summary?
		//compilation: artist collection, if any?
		//sotd? song mentions by group by song?
		queryArtistAnalysis(contents);
	}
	
	generateTabs();
	setTabs();
	scrollToTop();
	updateQueueButtons();
	
	for(let selected of document.getElementsByClassName('not-selectable'))
	{
		selected.dispatchEvent(new Event('active'));
	}	
}

function updateSearch(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexSongTitle = contents.columns.indexOf('Song Title');
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	
	document.querySelector('#search').value = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
	
	let recent = localStorage.getItem('recent');
	recent = (recent == null || recent.length == 0) ? JSON.parse('[]') : JSON.parse(recent);
	if(recent.length > 0)
	{
		recent = recent.filter(r => r != row[columnIndexKNID]);
		recent.unshift(row[columnIndexKNID])
		if(recent.length > 10)
			recent = recent.slice(0,10);
	}
	else
	{
		recent.push(row[columnIndexKNID]);
	}
	
	localStorage.setItem('recent', JSON.stringify(recent));
}

function generatePlayer(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexFilename = contents.columns.indexOf('Filename');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('Song Title');
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let filename = row[columnIndexFilename];
	let knyear = row[columnIndexKNYEAR];
	
	document.querySelector('#music').innerHTML = '';
	// if(!document.querySelector('#music').classList.contains('centered'))
		// document.querySelector('#music').classList.add('centered');
	
	let audioOverlay = document.createElement('div');
	audioOverlay.id = 'overlay';
	audioOverlay.innerText = 'Preview not available';
	document.querySelector('#music').appendChild(audioOverlay);
	document.querySelector('#overlay').classList.add('invisible');
	
	let audio = document.createElement('audio');
	audio.id = 'player';
	audio.classList.add('player');
	audio.setAttribute('data-id', row[columnIndexKNID]);
	audio.controls = true;
	audio.autoplay = window['autoplay-select']; //for shuffle to work this must be set as true
	audio.volume = localStorage.getItem('volume')|| 0.5;
	audio.controlsList = 'nodownload';
	audio.addEventListener('play', function() {
		document.title = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle] + ' - ' + defaultTitle;
	});
	audio.addEventListener('pause', function() {
		document.title = defaultTitle;
	});
	audio.addEventListener('canplay', function() {
		this.style.display = 'block';
		setTabs();
	});
	audio.addEventListener('volumechange', function() {
		localStorage.setItem('volume', document.querySelector('#player').volume);
	});
	audio.addEventListener('ended', function() {
		if(window['playlist'] != null)// && window['playlist'].length > 1 && window['playlist'][0] == this.getAttribute('data-id'))
		{
			//find out which is current, query next
			let next = window['playing'] + 1;
			if(next >= window['playlist'].length)
			{
				console.log('End of playlist reached');
				return;
			}
			// console.log('ended', window['playlist']);
			setTimeout(function() {
				let optQuery = "SELECT * FROM Song WHERE KNID = " + (window['playlist'][next]);
				// console.log('optQuery', optQuery);
				queryDb(optQuery, updateOptions);
				updateQueue();
				updateQueueButtons();
			},200);
		}
	});
	
	let source = document.createElement('source');
	source.src = directory + knyear + '/' + filename + '.mp3';
	source.type = 'audio/mpeg';
	source.innerText = '[You\'ll need a newer browser that supports HTML5 to listen to this.]';
	
	audio.appendChild(source);
	document.querySelector('#music').appendChild(audio);
	
	//update MediaSession API
	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: row[columnIndexSongTitle],
			artist: row[columnIndexArtistTitle],
			album: row[columnIndexReleaseTitle]
		});
		if(debugMode) console.log('metadata', navigator.mediaSession.metadata.toString());
	}
}

function queryCoverArt(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexReleaseID = contents.columns.indexOf('ReleaseID');
	if(parseInt(columnIndexReleaseID) > 0)
	{
		let query = "SELECT KNYEAR, CoverArt FROM Release WHERE ReleaseID = " + row[columnIndexReleaseID];
		if(debugMode) 
			console.log('generateCoverArt', query);
		queryDb(query, generateCoverArt);
	}
}

function generateCoverArt(contents) {
	if(contents.values.length < 1) return;
	//position: by title, right hand corner of header
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexCoverArt = contents.columns.indexOf('CoverArt');
	
	let cover = document.querySelector('#cover');
	cover.innerHTML = '';
	cover.style.display = 'none';
	let coverHeight = document.querySelector('#header').getBoundingClientRect().height - 15;
	
	let art = document.createElement('img');
	art.classList.add('content-box');
	art.src = coverArtDirectory + row[columnIndexKNYEAR] + '/' + row[columnIndexCoverArt];
	art.style.height = coverHeight + 'px';
	art.addEventListener('error', function() {
		if(debugMode)
			console.log('cover error');
		document.querySelector('#cover').classList.add('error');
	});
	cover.appendChild(art);
	
	displayCoverIfComplete();
}

function displayCoverIfComplete() {
	let cover = document.querySelector('#cover');
	if(cover.classList.contains('error')) return;
	if(cover.getElementsByTagName('img')[0].complete && !cover.classList.contains('error'))
	{
		if(debugMode)
			console.log('cover loaded');
		cover.style.display = 'initial';
		return;
	}

	if(debugMode)
		console.log('cover loading');
	setTimeout(displayCoverIfComplete, 100);
}

function queryInfo(contents) {
	generateSongInfo(contents);
	
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('Release Artist');
	
	let query = "SELECT ArtistTitle AS 'Name', GROUP_CONCAT(ParentArtist, '<br/>') AS 'Tags (if any)', CASE WHEN ArtistCode = 'BD' THEN 'Independent Band' WHEN ArtistCode = 'ID' THEN 'Idol Group' WHEN ArtistCode = 'AG' THEN 'Anime Voice Actor Group' WHEN ArtistCode = 'AS' THEN 'Anime Voice Actor(s)' WHEN ArtistCode = 'CL' THEN 'Collaboration' WHEN ArtistCode = 'SS' THEN 'Singer-Songwriter' WHEN ArtistCode = 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', DisbandYear AS 'Year Disbanded (if any)', ArtistTitleAlt AS '" + altTitlePrefix + " Name', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "') AS 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode) 
		console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT KNYEAR, Category, Type, ReleaseTitle AS 'Release Title', ReleaseArtistTitle AS 'Release Artist', TracksSelected || ' / ' || TracksTotal AS 'Tracks In Library', (SELECT COUNT(*) FROM Song s WHERE s.ReleaseTitle like r.ReleaseTitle || '%' AND s.ReleaseArtistTitle = r.ReleaseArtistTitle AND s.KNYEAR <= r.KNYEAR) || ' / ' || TracksSelected AS 'New Tracks', ReleaseYear || '.' || SUBSTR('00' || SUBSTR(ReleaseDate, 0, 2), -2, 2) || '.' || SUBSTR('00' || ReleaseDate, -2, 2) AS 'Release Date', ReleaseTitleAlt AS '" + altTitlePrefix + " Release Title', ReleaseArtistTitleAlt AS '" + altTitlePrefix + " Release Artist' FROM Release r WHERE ReleaseID = (SELECT MAX(ReleaseID) FROM Release WHERE ReleaseTitle = '" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "' AND ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexReleaseArtistTitle]) + "')";
	if(debugMode) 
		console.log('generateReleaseInfo', query);
	queryDb(query, generateReleaseInfo);
}

function generateSongInfo(contents) {
	if(debugMode) console.log('generateSongInfo', contents);
	generateTableByData(contents, 'song-info', 'Song Information', ['ArtistID', 'ReleaseID']);
}

function generateArtistInfo(contents) {
	if(debugMode) console.log('generateArtistInfo', contents);
	generateTableByData(contents, 'artist-info', 'Artist Information', []);
}

function generateReleaseInfo(contents) {
	if(debugMode) console.log('generateReleaseInfo', contents);
	generateTableByData(contents, 'release-info', 'Release Information', []);
}

function queryYearInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let year = row[columnIndexKNYEAR];
	
	let query = "SELECT 'KNYEAR' as Category, KNYEAR AS Data FROM SongAwardsPeriod WHERE KNYEAR = " + year + " AND Category = 'SONGLIST' ";
	query += "UNION ALL SELECT 'Song Awards Start Date' as Category, StartDate AS Data FROM SongAwardsPeriod WHERE KNYEAR = " + year + " AND Category = 'SONGLIST' ";
	query += "UNION ALL SELECT 'Song Awards End Date' as Category, EndDate AS Data FROM SongAwardsPeriod WHERE KNYEAR = " + year + " AND Category = 'SONGLIST' ";
	query += "UNION ALL SELECT 'Song Count' as Category, COUNT(SongID) AS Data FROM Song WHERE KNYEAR = " + year + " ";
	query += "UNION ALL SELECT 'Total Artists' as Category, COUNT(DISTINCT ArtistID) AS Data FROM Song WHERE KNYEAR = " + year + " ";
	query += "UNION ALL SELECT 'Total Releases' as Category, COUNT(DISTINCT ReleaseID) AS Data FROM Song WHERE KNYEAR = " + year + " ";
	if(debugMode) console.log('generateYearInfo', query);
	queryDb(query, generateYearInfo);
	queryDb(query, querySOTDByYear);
}

function generateYearInfo(contents) {
	document.querySelector('#year-info').innerHTML = '';
	
	if(debugMode) console.log('generateYearInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Awards Information';
	document.querySelector('#year-info').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexCategory = contents.columns.indexOf('Category');
	let columnIndexData = contents.columns.indexOf('Data');
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let r = 0; r < rows.length; r++)
	{
		let rowVal = rows[r];
		if(!rowVal || rowVal.length == 0) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = rowVal[columnIndexCategory];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = rowVal[columnIndexData];
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#year-info').appendChild(table);
}

function querySongList(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let year = row[columnIndexKNYEAR];
	
	let query = "SELECT * FROM Song WHERE KNYEAR = " + year + " ORDER BY RANDOM() LIMIT 10";
	if(debugMode) console.log('generateSongList', query);
	queryDb(query, generateSongList);
}

function generateSongList(contents) {
	if(debugMode) console.log('generateSongList', contents);
	if(!contents.columns || !contents.values) return;
	
	document.querySelector('#song-list').innerHTML = '';
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from ' + rows[0][contents.columns.indexOf('KNYEAR')];
	document.querySelector('#song-list').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.innerText = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tr.appendChild(tc);
		
		tbody.appendChild(tr);
	}
		
	table.appendChild(tbody);
	document.querySelector('#song-list').appendChild(table);	
}

function queryArtistInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	
	let query = "SELECT ArtistTitle AS 'Name', GROUP_CONCAT(ParentArtist, '<br/>') AS 'Tags (if any)', CASE WHEN ArtistCode = 'BD' THEN 'Independent Band' WHEN ArtistCode = 'ID' THEN 'Idol Group' WHEN ArtistCode = 'AG' THEN 'Anime Voice Actor Group' WHEN ArtistCode = 'AS' THEN 'Anime Voice Actor(s)' WHEN ArtistCode = 'CL' THEN 'Collaboration' WHEN ArtistCode = 'SS' THEN 'Singer-Songwriter' WHEN ArtistCode = 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', DisbandYear AS 'Year Disbaneded (if any)', ArtistTitleAlt AS '" + altTitlePrefix + " Name', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "') AS 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode)
		console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT DISTINCT r.ReleaseYear as 'Year', r.Category, r.Type, r.ReleaseTitle AS 'Release Title', r.ReleaseYear || SUBSTR('0000' || r.ReleaseDate, -4, 4) AS 'Release Date', r.ReleaseTitleAlt AS '" + altTitlePrefix + " Release Title', r.ReleaseArtistTitleAlt AS '" + altTitlePrefix + " Release Artist', w.ReviewID FROM Release r LEFT JOIN Review w ON r.ReleaseID = w.ReleaseID WHERE r.ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' GROUP BY r.ReleaseTitle ORDER BY r.ReleaseYear, SUBSTR('0000' || r.ReleaseDate, -4, 4)";
	if(debugMode)
		console.log('generateReleaseInfo', query);
	queryDb(query, generateArtistReleaseInfo);
}

function generateArtistReleaseInfo(contents) {
	document.querySelector('#artist-release').innerHTML = '';
	
	if(debugMode) console.log('generateArtistReleaseInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Artist Releases';
	document.querySelector('#artist-release').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexKNYEAR = contents.columns.indexOf('Year');
	let columnIndexCategory = contents.columns.indexOf('Category');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReviewID = contents.columns.indexOf('ReviewID');
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('bordered');
	
	let tbody = document.createElement('tbody');
	
	//header
	let tr = document.createElement('tr');
	tr.classList.add('no-highlight');
	for(let column of columns)
	{
		if(['Year','Category','Release Title'].indexOf(column) >= 0)
		{
			let th = document.createElement('th');
			th.innerText = column;
			tr.appendChild(th);
		}
	}
	tbody.appendChild(tr);	
	
	//rows
	for(let r = 0; r < rows.length; r++)
	{
		let row = rows[r];
		if(!row || row.length == 0) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.classList.add('centered-text');
		tc.innerText = row[columnIndexKNYEAR];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.classList.add('centered-text');
		td.innerText = row[columnIndexCategory];
		tr.appendChild(td);
		
		let te = document.createElement('td');
		
			let teDiv = document.createElement('span');
			teDiv.innerText = row[columnIndexReleaseTitle];
			te.appendChild(teDiv);
			
			if(row[columnIndexReviewID] != null)
			{
				let tda = document.createElement('span');
				tda.style.position = 'relative';
				
					let ta = document.createElement('span');
					ta.title = 'Reviewed';
					ta.classList.add('material-icons');
					ta.style.position = 'absolute';
					ta.style.left = '2px';
					ta.innerText = 'reviews';
					
					tda.appendChild(ta);
					
				te.appendChild(tda);
			}
		
		tr.appendChild(te);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#artist-release').appendChild(table);
}

function queryRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	let columnIndexReleaseYear = contents.columns.indexOf('Year');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('Release Artist');
	let columnIndexReleaseDateCreated = contents.columns.indexOf('Date Added');

	//max 10 related within 1 month
	document.querySelector('#songs-related-date').innerHTML = '';
	let convertDate = "replace(DateCreated,'.','-')";
	let currentDate = "(select date("+convertDate+") from Song where KNID = "+row[columnIndexKNID]+")";
	let dateRange = "date("+convertDate+") between date("+currentDate+",'-1 months') and date("+currentDate+",'+1 months')";
	
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND " + dateRange;
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByDate', query);
	queryDb(query, generateSongRelatedByDate);
	
	//max 10 related same year
	document.querySelector('#songs-related-year').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseYear = '" + row[columnIndexReleaseYear] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByYear', query);
	queryDb(query, generateSongRelatedByYear);
	
	//max 10 related to artist
	document.querySelector('#artist-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistRelated', query);
	queryDb(query, generateArtistRelated);
	
	//max 10 related to release
	document.querySelector('#release-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	if(reduceReleaseTitle(row[columnIndexReleaseTitle]).includes('Disc '))
		query += " AND ReleaseTitle LIKE '%" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "%'";
	else
		query += " AND ReleaseTitle = '" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "'";		
	query += " AND ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexReleaseArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryReleaseRelated', query);
	queryDb(query, generateReleaseRelated);
	
	//artist featured in
	document.querySelector('#songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ArtistID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "ORDER BY RANDOM() DESC LIMIT 5";
	if(debugMode) console.log('generateSongFeaturedByArtist', query);
	queryDb(query, generateSongFeaturedByArtist);
}

function generateSongRelatedByDate(contents) {
	if(debugMode) console.log('generateSongRelatedByDate', contents);
	generateTableList(
		contents, 
		'songs-related-date', 
		'Songs within 3 months', 
		['ArtistTitle', 'SongTitle'], 
		updateSong, 
		showContextMenu, 
		'related'
	);
}

function generateSongRelatedByYear(contents) {
	if(debugMode) console.log('generateSongRelatedByYear', contents);
	let rows = contents.values;
	generateTableList(
		contents, 
		'songs-related-year', 
		'Songs from ' + rows[0][contents.columns.indexOf('ReleaseYear')], 
		['ArtistTitle', 'SongTitle'], 
		updateSong, 
		showContextMenu, 
		'related'
	);
}

function generateArtistRelated(contents) {
	if(debugMode) console.log('generateArtistRelated', contents);
	let rows = contents.values;
	generateTableList(
		contents, 
		'artist-related', 
		'Songs from ' + rows[0][contents.columns.indexOf('ArtistTitle')], 
		['KNYEAR', 'SongTitle'], 
		updateSong, 
		showContextMenu, 
		'related'
	);
}

function generateReleaseRelated(contents) {
	if(debugMode) console.log('generateReleaseRelated', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseTitle')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from "' + reduceReleaseTitle(rows[0][contents.columns.indexOf('ReleaseTitle')]) + '"';
	document.querySelector('#release-related').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');

		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tc.addEventListener('contextmenu', showContextMenu);
		tr.appendChild(tc);
		
		//click to play
		// let td = document.createElement('td');
		// td.innerText = rowVal;
		// if(rowVal.toString().includes('://'))
			// td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		// tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#release-related').appendChild(table);
	
}

function generateSongFeaturedByArtist(contents) {
	if(debugMode) console.log('generateSongFeaturedByArtist', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexParentArtist = contents.columns.indexOf('ParentArtist');
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs featuring ' + rows[0][columnIndexParentArtist];
	document.querySelector('#songs-related-collab').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tc.addEventListener('contextmenu', showContextMenu);
		tr.appendChild(tc);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#songs-related-collab').appendChild(table);
}

function queryArtistRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	
	//max 10 related within 5 years
	let convertDate = "replace(DateCreated,'.','-')";
	// let currentDate = "(select date("+convertDate+") from Song where KNID = "+row[columnIndexKNID]+")";
	let dateRange = "date("+convertDate+") between date(date(),'-5 years') and date()";
	
	query = "SELECT * FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += " AND " + dateRange;
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistSongs5Years', query);
	queryDb(query, queryArtistSongs5Years);
	
	//max 10 related within 10 years
	// convertDate = "replace(DateCreated,'.','-')";
	// let currentDate = "(select date("+convertDate+") from Song where KNID = "+row[columnIndexKNID]+")";
	dateRange = "date("+convertDate+") between date(date(),'-10 years') and date(date(),'-5 years')";
	
	query = "SELECT * FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += " AND " + dateRange;
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistSongs10Years', query);
	queryDb(query, queryArtistSongs10Years);
	
	//artist featured in
	document.querySelector('#songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ArtistID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "ORDER BY RANDOM() DESC LIMIT 5";
	if(debugMode) console.log('generateArtistFeatured', query);
	queryDb(query, generateArtistFeatured);
}

function queryArtistSongs5Years(contents) {
	if(debugMode) console.log('queryArtistSongs5Years', contents);
	document.querySelector('#artist-songs-5y').innerHTML = '';
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs within 5 years';
	document.querySelector('#artist-songs-5y').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tc.addEventListener('contextmenu', showContextMenu);
		tr.appendChild(tc);
		
		//click to play
		// let td = document.createElement('td');
		// td.innerText = rowVal;
		// if(rowVal.toString().includes('://'))
			// td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		// tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#artist-songs-5y').appendChild(table);
}

function queryArtistSongs10Years(contents) {
	if(debugMode) console.log('queryArtistSongs10Years', contents);
	document.querySelector('#artist-songs-10y').innerHTML = '';
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs within 10 years';
	document.querySelector('#artist-songs-10y').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tc.addEventListener('contextmenu', showContextMenu);
		tr.appendChild(tc);
		
		//click to play
		// let td = document.createElement('td');
		// td.innerText = rowVal;
		// if(rowVal.toString().includes('://'))
			// td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		// tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#artist-songs-10y').appendChild(table);
}

function generateArtistFeatured(contents) {
	if(debugMode) console.log('generateArtistFeatured', contents);
	document.querySelector('#artist-featured').innerHTML = '';
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexParentArtist = contents.columns.indexOf('ParentArtist');
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs featuring ' + rows[0][columnIndexParentArtist];
	document.querySelector('#artist-featured').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
		tc.addEventListener('contextmenu', showContextMenu);
		tr.appendChild(tc);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.querySelector('#artist-featured').appendChild(table);
}

function queryAwards(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select awards of that song regardless of year
	let query = "SELECT a.* FROM Award a JOIN Song s ON s.KNID = a.KNID JOIN (SELECT ar.* FROM Award ar WHERE ar.KNID = " 
	query += row[columnIndexKNID] + ") aref ON aref.KNYEAR = a.KNYEAR AND aref.AwardCode = a.AwardCode " 
	query += "ORDER BY a.KNYEAR, a.AwardID, a.SortOrder";
	if(debugMode) console.log('queryAwards', query);
	queryDb(query, generateAwards);
}

function generateAwards(contents) {
	document.querySelector('#song-awards').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Awards';
	document.querySelector('#song-awards').appendChild(header);
	
	let columnIndexAwardTitle = contents.columns.indexOf('AwardTitle');
	let awardTitles = rows.map(s => s[columnIndexAwardTitle]).filter((sa, ind, arr) => arr.indexOf(sa) == ind);
	// console.log('awardTitles', awardTitles);
	for(let award of awardTitles)
	{
		let awardRows = rows.filter(r => r[columnIndexAwardTitle] == award);
		// console.log('awardRows', awardRows);
		
		let table = document.createElement('table');
		// table.id = 'table';
		table.classList.add('list');
		table.classList.add('centered');
		table.classList.add('content-box');
		table.classList.add('content-table');
		table.classList.add('not-selectable');
		
		let tbody = document.createElement('tbody');

		//header
		for(let r = 0; r < awardRows.length; r++)
		{
			let columnIndexKNID = contents.columns.indexOf('KNID');
			let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
			let columnIndexRecipientTitle = contents.columns.indexOf('RecipientTitle');
			let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
			let columnIndexIsWinner = contents.columns.indexOf('IsWinner');
			
			let tr = document.createElement('tr');
			
			if(r == 0)
			{
				let tb = document.createElement('th');
				tb.innerText = awardRows[r][columnIndexAwardTitle];
				tr.appendChild(tb);
				tbody.appendChild(tr);
			}
			
			tr = document.createElement('tr');
			tr.style.position = 'relative';
			
			let selected = document.querySelector('#options').value;
			let tc = document.createElement('td');
			if(awardRows[r][columnIndexKNID] == selected)
			{
				tc.classList.add('highlight');
			}
			// tc.style.fontWeight = awardRows[r][columnIndexIsWinner] > 0 ? 'bold' : 'normal';
			tc.setAttribute('data-id', awardRows[r][columnIndexKNID]);
			// tc.innerText = awardRows[r][columnIndexArtistTitle] + ' - ' + awardRows[r][columnIndexRecipientTitle];
			if(awardRows[r][columnIndexKNID] != selected)
			{
				tc.style.cursor = 'pointer';
				tc.addEventListener('click', updateSong);
			}
			
			// tc.classList.add('highlight');
			let tt = document.createElement('span');
			tt.innerText = awardRows[r][columnIndexArtistTitle] + ' - ' + awardRows[r][columnIndexRecipientTitle];
			tc.appendChild(tt);
			
			if(awardRows[r][columnIndexIsWinner] > 0)
			{
				// tc.classList.add('highlight');
				let ta = document.createElement('span');
				ta.title = 'Winner';
				ta.classList.add('material-icons');
				ta.classList.add('award-winner');
				ta.innerText = 'emoji_events';
				tc.appendChild(ta);
			}
			
			tr.appendChild(tc);
						
			tbody.appendChild(tr);
		}
		
		table.appendChild(tbody);
		document.querySelector('#song-awards').appendChild(table);
		
		document.querySelector('#song-awards').appendChild(document.createElement('br'));
	}
}

function queryAwardsByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	
	//select awards of that song regardless of year
	let query = "SELECT a.* FROM Award a JOIN Song s ON s.KNID = a.KNID WHERE a.KNYEAR = " + row[columnIndexKNYEAR] + " "; 
	query += "ORDER BY a.KNYEAR, a.AwardID, a.SortOrder";
	if(debugMode) console.log('queryAwardsByYear', query);
	queryDb(query, generateAwards);
}

function queryRankings(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select ranking of that year of song
	let query = "SELECT s.KNID, r.KNYEAR, r.RankNo AS 'Rank #', r.SortOrder, s.SongTitle AS 'Song Title', s.ArtistTitle AS 'Artist Title' FROM Ranking r JOIN Song s on r.KNID = s.KNID WHERE r.KNYEAR = (SELECT KNYEAR FROM Ranking WHERE KNID = " + row[columnIndexKNID] + ") ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	if(debugMode) console.log('queryRankings', query);
	queryDb(query, generateRanking);
}

function queryRankingsByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	//select ranking of that year of song
	let query = "SELECT s.KNID, r.KNYEAR, r.RankNo AS 'Rank #', r.SortOrder, s.SongTitle AS 'Song Title', s.ArtistTitle AS 'Artist Title' FROM Ranking r JOIN Song s on r.KNID = s.KNID WHERE r.KNYEAR = " + row[columnIndexKNYEAR] + " ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	if(debugMode) console.log('queryRankingsByYear', query);
	queryDb(query, generateRanking);
}

function generateRanking(contents) {
	if(debugMode) console.log('generateRanking', contents);
	generateTableByDataWithHeader(contents, 'song-ranking', false, 'Song Rankings', false, ['KNID', 'SortOrder', 'KNYEAR'], 'KNID', 'Rank #');
}

function queryCompilations(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select compilations of that song regardless of year
	let query = "SELECT c.CompilationTitle, c.TrackNumber AS 'Track #', c.SongTitle AS 'Song Title', c.ArtistTitle AS 'Artist Title', c.KNID FROM Compilation c JOIN Song s ON s.KNID = c.KNID JOIN (SELECT cp.* FROM Compilation cp WHERE cp.KNID = " 
	query += row[columnIndexKNID] + ") cref ON cref.CompilationTitle = c.CompilationTitle " 
	query += "ORDER BY c.KNYEAR, c.CompilationTitle, c.TrackNumber";
	if(debugMode) console.log('queryCompilations', query);
	queryDb(query, generateCompilations);
}

function queryCompilationsByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	//select compilations of that song regardless of year
	let query = "SELECT c.CompilationTitle, c.TrackNumber AS 'Track #', c.SongTitle AS 'Song Title', c.ArtistTitle AS 'Artist Title', c.KNID FROM Compilation c JOIN Song s ON s.KNID = c.KNID WHERE c.KNYEAR = " + row[columnIndexKNYEAR] + " ";
	query += "ORDER BY c.KNYEAR, c.CompilationTitle, c.TrackNumber";
	if(debugMode) console.log('queryCompilationsByYear', query);
	queryDb(query, generateCompilations);
}

function generateCompilations(contents) {
	document.getElementById('song-compilation').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Compilations';
	document.querySelector('#song-compilation').appendChild(header);
	
	let columnIndexCompilationTitle = contents.columns.indexOf('CompilationTitle');
	let compilationTitles = rows.map(s => s[columnIndexCompilationTitle]).filter((sa, ind, arr) => arr.indexOf(sa) == ind);
	// console.log('compilationTitles', compilationTitles);
	
	for(let compilationTitle of compilationTitles)
	{
		let compilationRows = rows.filter(r => r[columnIndexCompilationTitle] == compilationTitle);
		// console.log('compilationRows', { columns, values: compilationRows });
		
		generateTableByDataWithHeader({
			columns,
			values: compilationRows,
		}, 'song-compilation', true, 'Compilations', true, ['CompilationTitle', 'KNID'], 'KNID', 'Track #', 'CompilationTitle');
		
		document.getElementById('song-compilation').appendChild(document.createElement('br'));
	}
}

function querySOTD(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select song of the day mentions of that song regardless of year
	let query = "SELECT t.* FROM SOTD t "
	query += "JOIN Song s ON s.KNID = t.KNID "
	query += "JOIN (SELECT td.* FROM SOTD td WHERE td.KNID = " + row[columnIndexKNID] + ") tref ON tref.SOTDID = t.SOTDID ";
	query += "WHERE t.IsShortPreview = 0 ";
	query += "ORDER BY t.Date, t.TimeOfDay, t.SortOrder";
	if(debugMode) console.log('querySOTD', query);
	queryDb(query, generateSOTD);
	
	//select awards of that song regardless of year
	query = "SELECT m.KNYEAR AS 'Year', m.Month, m.SongTitle AS 'Song Title', m.ArtistTitle AS 'Artist Title', m.Count, m.KNID "
	query += "FROM SOTM m JOIN Song s ON s.KNID = m.KNID "
	query += "JOIN (SELECT tm.* FROM SOTM tm WHERE tm.KNID = " + row[columnIndexKNID] + ") mref ON mref.KNYEAR = m.KNYEAR ";
	if(debugMode) console.log('querySOTM', query);
	queryDb(query, generateSOTM);
}

function querySOTDByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexData = contents.columns.indexOf('Data');
	let KNYEAR = rows[0][columnIndexData];
	let startDate = rows[1][columnIndexData];
	let endDate = rows[2][columnIndexData];
	//select song of the day mentions of that song regardless of year
	let query = "SELECT t.SongTitle AS 'Song Title', t.ArtistTitle AS 'Artist Title', t.KNID, COUNT(*) AS 'Rank' FROM SOTD t JOIN Song s ON s.KNID = t.KNID ";
	query += "WHERE t.Date BETWEEN " + startDate + " AND " + endDate + " AND t.IsShortPreview = 0 ";
	query += "GROUP BY t.SongTitle, t.ArtistTitle, t.KNID ORDER BY COUNT(*) DESC LIMIT 20";
	if(debugMode) console.log('querySOTDByYear', query);
	queryDb(query, generateTopSOTD);
	
	//select awards of that song regardless of year
	query = "SELECT m.KNYEAR AS 'Year', m.Month, m.SongTitle AS 'Song Title', m.ArtistTitle AS 'Artist Title', m.Count, m.KNID "
	query += "FROM SOTM m JOIN Song s ON s.KNID = m.KNID WHERE m.KNYEAR = " + KNYEAR;
	if(debugMode) console.log('querySOTMByYear', query);
	queryDb(query, generateSOTM);
}

function generateSOTD(contents) {
	document.querySelector('#song-sotd').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Mentions';
	document.querySelector('#song-sotd').appendChild(header);
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('centered-text');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');

	//header
	let tr = document.createElement('tr');
	for(let column of ['Year','Time Period','Count'])
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	//rows
	let columnIndexDate = contents.columns.indexOf('Date');
	let years = rows.map(s => s[columnIndexDate].toString().substring(0, 4)).filter((sa, ind, arr) => arr.indexOf(sa) == ind);
	for(let year of years)
	{
		let dateRows = rows.filter(r => r[columnIndexDate].toString().substring(0, 4) == year);
		
		let columnIndexCount = contents.columns.indexOf('Count');
		let earliestDate = dateRows[0][columnIndexDate];
		let latestDate = dateRows[dateRows.length - 1][columnIndexDate];
		
		tr = document.createElement('tr');
		
		let ty = document.createElement('td');
		ty.innerText = earliestDate.toString().substring(0, 4);
		tr.appendChild(ty);	
		
		let td = document.createElement('td');
		td.innerText = earliestDate == latestDate ? earliestDate : earliestDate + ' - ' + latestDate;
		tr.appendChild(td);
		
		let tc = document.createElement('td');
		tc.innerText = dateRows.length;
		tr.appendChild(tc);
		
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	document.querySelector('#song-sotd').appendChild(table);
}

function generateTopSOTD(contents) {
	document.querySelector('#song-sotd').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song of the Day Top Rankings';
	document.querySelector('#song-sotd').appendChild(header);
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('centered-text');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');

	//header
	let tr = document.createElement('tr');
	for(let column of ['Rank', 'Song Title', 'Artist Title'])
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	//rows
	let rank = 0;
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexRankNo = contents.columns.indexOf('Rank');
		let columnIndexSongTitle = contents.columns.indexOf('Song Title');
		let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
		
		let tr = document.createElement('tr');
		tr.setAttribute('data-id', row[columnIndexKNID]);
		tr.style.cursor = 'pointer';
		tr.addEventListener('click', updateSong);
		tr.addEventListener('mouseover', hoverOnTableRow);
		tr.addEventListener('mouseout', hoverOnTableRow);
	
		//rank no
		if(row[columnIndexRankNo] != rank)
		{
			let span = rows.filter(r => r[columnIndexRankNo] == row[columnIndexRankNo]).length;
			let tc = document.createElement('td');
			tc.classList.add('centered-text');
			tc.setAttribute('rowspan', span);
			tc.innerText = row[columnIndexRankNo];
			tr.appendChild(tc);
		}
		
		//song
		let td = document.createElement('td');
		td.innerText = row[columnIndexSongTitle];
		tr.appendChild(td);
		
		//artist
		let te = document.createElement('td');
		te.innerText = row[columnIndexArtistTitle];
		tr.appendChild(te);
		
		tbody.appendChild(tr);
		
		rank = row[columnIndexRankNo];
	}
	
	table.appendChild(tbody);
	document.querySelector('#song-sotd').appendChild(table);

}

function generateSOTM(contents) {
	document.querySelector('#song-sotm').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Monthly Mentions';
	document.querySelector('#song-sotm').appendChild(header);
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('centered-text');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	
	let columnIndexYear = contents.columns.indexOf('Year');
	let ty = document.createElement('th');
	ty.classList.add('table-title');
	ty.setAttribute('colspan', 4);
	ty.style.backgroundColor = 'initial'; //special case
	ty.innerText = rows[0][columnIndexYear];
	tr.appendChild(ty);
	
	tbody.appendChild(tr);

	//header
	tr = document.createElement('tr');
	for(let column of columns)
	{
		if(['Month', 'Song Title', 'Artist Title', 'Count'].indexOf(column) >= 0)
		{
			let th = document.createElement('th');
			th.innerText = column;
			tr.appendChild(th);
		}
	}
	tbody.appendChild(tr);
	
	//rows
	for(let r = 0; r < rows.length; r++)
	{
		let columnIndexMonth = contents.columns.indexOf('Month');
		let columnIndexSongTitle = contents.columns.indexOf('Song Title');
		let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
		let columnIndexCount = contents.columns.indexOf('Count');
		let columnIndexKNID = contents.columns.indexOf('KNID');
		
		let tr = document.createElement('tr');
		tr.setAttribute('data-id', rows[r][columnIndexKNID]);
		if(document.querySelector('#options').value == rows[r][columnIndexKNID]) {
			tr.classList.add('not-selectable');
			tr.addEventListener('active', hoverOnTableRow);
		}
		else {
			tr.style.cursor = 'pointer';
			tr.addEventListener('click', updateSong);
			tr.addEventListener('mouseover', hoverOnTableRow);
			tr.addEventListener('mouseout', hoverOnTableRow);
		}
		
		let tm = document.createElement('td');
		if(r < rows.length-1 && rows[r][columnIndexMonth] == rows[r+1][columnIndexMonth])
			tm.setAttribute('rowspan',2);
		tm.innerText = rows[r][columnIndexMonth];
		if(r == 0 || rows[r][columnIndexMonth] != rows[r-1][columnIndexMonth])
			tr.appendChild(tm);
		
		let ts = document.createElement('td');
		ts.innerText = rows[r][columnIndexSongTitle];
		tr.appendChild(ts);
		
		let ta = document.createElement('td');
		ta.innerText = rows[r][columnIndexArtistTitle];
		tr.appendChild(ta);
		
		let tc = document.createElement('td');
		tc.innerText = rows[r][columnIndexCount];
		tr.appendChild(tc);
		
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	document.querySelector('#song-sotm').appendChild(table);
}

function queryAnalysis(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexData = contents.columns.indexOf('KNYEAR');
	let KNYEAR = rows[0][columnIndexData];

	//Vocal Popularity Survey
	let query = "SELECT 'All' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode <> '' ";
	query += "UNION ALL SELECT 'Male Solo' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'M' ";
	query += "UNION ALL SELECT 'Female Solo' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'F' ";
	query += "UNION ALL SELECT 'Male Duo' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'MM' ";
	query += "UNION ALL SELECT 'Female Duo' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'FF' ";
	query += "UNION ALL SELECT 'Combined Duo' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND (VocalCode = 'MF' or VocalCode = 'FM') ";
	query += "UNION ALL SELECT 'Trio' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND (VocalCode = 'MMM' or VocalCode = 'FFF') ";
	query += "UNION ALL SELECT 'Quartet or More' as 'Category', COUNT(VocalCode) as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND LENGTH(VocalCode) > 3 ";

	if(debugMode) console.log('generateVocalPopularity', query);
	queryDb(query, generateVocalPopularity);
	
	//Singles B-side Survey
	query = "SELECT 'All Singles' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 ";
	query += "UNION ALL SELECT '1 Track' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 1 ";
	query += "UNION ALL SELECT '2 Tracks' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2 ";
	query += "UNION ALL SELECT '3 Tracks' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2 ";
	query += "UNION ALL SELECT '2 Tracks (B-side)' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2 AND TracksSelected > 1 ";
	query += "UNION ALL SELECT '3 Tracks (B-side)' AS 'Category', COUNT(ReleaseID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND Category = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2 AND TracksSelected > 1 ";
	query += "UNION ALL SELECT 'Singles Reviewed' AS 'Category', COUNT(ReviewID) AS 'Count' FROM Review WHERE KNYEAR = " + KNYEAR + " ";

	if(debugMode) console.log('generateBSide', query);
	queryDb(query, generateBSide);
	
	//Song Language Survey
	query = "SELECT 'All' AS 'Language', COUNT(LanguageCode) as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + " ";
	query += "UNION ALL SELECT 'English' AS 'Language', COUNT(LanguageCode) as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'EN' ";
	query += "UNION ALL SELECT 'Chinese' AS 'Language', COUNT(LanguageCode) as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'CH' ";
	query += "UNION ALL SELECT 'Japanese' AS 'Language', COUNT(LanguageCode) as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'JP' ";

	if(debugMode) console.log('generateSongLaguage', query);
	queryDb(query, generateSongLaguage);
	
	//Year of Release Survey
	query = "SELECT 'All' AS 'Release Year', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " ";
	query += "UNION ALL SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'Release Year', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear < " + KNYEAR + " - 3 ";
	query += "UNION ALL SELECT " + KNYEAR + " - 3 AS 'Release Year', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 3 ";
	query += "UNION ALL SELECT " + KNYEAR + " - 2 AS 'Release Year', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 2 ";
	query += "UNION ALL SELECT " + KNYEAR + " - 1 AS 'Release Year', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 1 ";
	query += "UNION ALL SELECT " + KNYEAR + " AS 'Release Year', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " ";

	if(debugMode) console.log('generateYearOfRelease', query);
	queryDb(query, generateYearOfRelease);
	
	//Anime Song Survey
	query = "SELECT 'All' AS 'Song Type', COUNT(s.VocalCode) AS 'Count (%)' FROM Song s WHERE s.KNYEAR = " + KNYEAR + " AND s.VocalCode <> '' ";
	query += "UNION ALL SELECT 'Anime Songs' AS 'Song Type', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') ";
	query += "UNION ALL SELECT 'Anime Theme Songs' AS 'Song Type', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.SongType = 'Opening' OR ts.SongType = 'Ending' OR ts.SongType = 'Theme') ";
	query += "UNION ALL SELECT 'Anime Character/Insert Songs' AS 'Song Type', COUNT(ts.SongType) AS 'Count (%)' FROM Song s JOIN ThemeSong ts on s.KNID = ts.KNID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.SongType <> 'Opening' AND ts.SongType <> 'Ending' AND ts.SongType <> 'Theme') ";

	if(debugMode) console.log('generateAnimeSongs', query);
	queryDb(query, generateAnimeSongs);
	
	//Song Appetite Survey
	query = "SELECT 'Jan' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".01.%' ";
	query += "UNION ALL SELECT 'Feb' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".02.%' ";
	query += "UNION ALL SELECT 'Mar' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".03.%' ";
	query += "UNION ALL SELECT 'Apr' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".04.%' ";
	query += "UNION ALL SELECT 'May' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".05.%' ";
	query += "UNION ALL SELECT 'Jun' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".06.%' ";
	query += "UNION ALL SELECT 'Jul' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".07.%' ";
	query += "UNION ALL SELECT 'Aug' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".08.%' ";
	query += "UNION ALL SELECT 'Sep' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".09.%' ";
	query += "UNION ALL SELECT 'Oct' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".10.%' ";
	query += "UNION ALL SELECT 'Nov' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".11.%' ";
	query += "UNION ALL SELECT 'Dec' AS 'Month', COUNT(SongID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".12.%' ";

	if(debugMode) console.log('generateSongAppetite', query);
	queryDb(query, generateSongAppetite);
}

function generateVocalPopularity(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Vocal Types';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let total = rows[0][1];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r == 0 ? total + ' Songs' : rows[r][1] + ' (' + (100 * rows[r][1] / total).toFixed(2) + '%)';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#vocal-popularity').innerHTML = '';
	document.querySelector('#vocal-popularity').appendChild(header);
	document.querySelector('#vocal-popularity').appendChild(table);
}

function generateBSide(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	let total = rows[0][1];
	if(contents.length == 0 || total == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Singles B-side Reviews';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r == 0 ? total + ' Singles' : rows[r][1];
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#single-bside').innerHTML = '';
	document.querySelector('#single-bside').appendChild(header);
	document.querySelector('#single-bside').appendChild(table);
}

function generateSongLaguage(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Languages';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let total = rows[0][1];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r == 0 ? total + ' Songs' : rows[r][1] + ' (' + (100 * rows[r][1] / total).toFixed(2) + '%)';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#song-language').innerHTML = '';
	document.querySelector('#song-language').appendChild(header);
	document.querySelector('#song-language').appendChild(table);
}

function generateYearOfRelease(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Release Year';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let total = rows[0][1];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		let ranged = rows[r][0].toString().indexOf('-') > 0;
		let start = ranged ? rows[r][0].substring(0,rows[r][0].indexOf('-')) : rows[r][0];
		let end = ranged ? rows[r][0].substring(rows[r][0].indexOf('-') + 1) : rows[r][0];
		tc.innerText = start == end ? start : rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r == 0 ? total + ' Songs' : rows[r][1] + ' (' + (100 * rows[r][1] / total).toFixed(2) + '%)';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#release-year').innerHTML = '';
	document.querySelector('#release-year').appendChild(header);
	document.querySelector('#release-year').appendChild(table);
}

function generateAnimeSongs(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Anime Songs';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let total = rows[0][1];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		let ranged = rows[r][0].toString().indexOf('-') > 0;
		let start = ranged ? rows[r][0].substring(0,rows[r][0].indexOf('-')) : rows[r][0];
		let end = ranged ? rows[r][0].substring(rows[r][0].indexOf('-') + 1) : rows[r][0];
		tc.innerText = start == end ? start : rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r == 0 ? total + ' Songs' : rows[r][1] + ' (' + (100 * rows[r][1] / total).toFixed(2) + '%)';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#anime-songs').innerHTML = '';
	document.querySelector('#anime-songs').appendChild(header);
	document.querySelector('#anime-songs').appendChild(table);
}

function generateSongAppetite(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Count by Month';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let total = rows[0][1];
	let cumulative = 0;
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length == 0) continue;
		// if(excludedColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		let ranged = rows[r][0].toString().indexOf('-') > 0;
		let start = ranged ? rows[r][0].substring(0,rows[r][0].indexOf('-')) : rows[r][0];
		let end = ranged ? rows[r][0].substring(rows[r][0].indexOf('-') + 1) : rows[r][0];
		tc.innerText = start == end ? start : rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = rows[r][1] == 0 ? '-' : cumulative + rows[r][1];
		cumulative += rows[r][1];
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#song-appetite').innerHTML = '';
	document.querySelector('#song-appetite').appendChild(header);
	document.querySelector('#song-appetite').appendChild(table);
}

function queryArtistAnalysis(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexData = contents.columns.indexOf('Artist Title');
	let artist = rows[0][columnIndexData];

	//Song Count by Year
	let query = "select KNYEAR as 'Year', count(*) as 'Count' from Song where ArtistTitle = '"+addQuotationInSQLString(artist)+"' group by KNYEAR";

	if(debugMode) console.log('generateSongCountByYear', query);
	queryDb(query, generateSongCountByYear);
	
	//Most Popular Songs
	query = "select KNID as 'ID', KNYEAR as 'Year', SongTitle as 'Song Title' from ( ";
	query += "select s.KNID, s.SongTitle, s.KNYEAR ";
	query += ", (select count(*) from SOTD where sotd.KNID = s.KNID) as 'SOTD Mentions' ";
	query += ", (select count(*) from SOTM where sotm.KNID = s.KNID) as 'SOTM Mentions' ";
	query += ", (select count(*) from Award aw where aw.KNID = s.KNID) as 'Awards Nominated' ";
	query += ", (select count(*) from Award aw where aw.KNID = s.KNID and aw.isWinner = 1) as 'Awards Won' ";
	query += ", (select count(*) from Ranking r where r.KNID = s.KNID) as 'Ranking Top 20' ";
	query += ", (select count(*) from Ranking r where r.KNID = s.KNID and r.RankNo = 1) as 'Ranking Top 1' ";
	query += ", (select count(*) from Compilation c where c.KNID = s.KNID and c.CompilationTitle <> 'GOLD') as 'Compilations Featured' ";
	query += ", ( ";
	query += "(select count(*) from SOTD where sotd.KNID = s.KNID) + ";
	query += "(select count(*) from SOTM where sotm.KNID = s.KNID) + ";
	query += "(select count(*) from Award aw where aw.KNID = s.KNID) + ";
	query += "(select count(*) from Award aw where aw.KNID = s.KNID and aw.isWinner = 1) + ";
	query += "(select count(*) from Ranking r where r.KNID = s.KNID) + ";
	query += "(select count(*) from Ranking r where r.KNID = s.KNID and r.RankNo = 1) + ";
	query += "(select count(*) from Compilation c where c.KNID = s.KNID and c.CompilationTitle <> 'GOLD') ";
	query += ") as 'Total' ";
	query += "from Song s ";
	query += "where s.ArtistTitle = '"+addQuotationInSQLString(artist)+"' and Total > 0 order by Total desc limit 5 ";
	query += ")";

	if(debugMode) console.log('generatePopularSongs', query);
	queryDb(query, generatePopularSongs);
}

function generatePopularSongs(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Most Popular Songs';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of ['Rank', 'Song Title'])
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexKNYEAR = contents.columns.indexOf('Year');
	let columnIndexSongTitle = contents.columns.indexOf('Song Title');
	for(let r = 0; r < rows.length; r++)
	{
		let tr = document.createElement('tr');
		
		let ty = document.createElement('td');
		ty.classList.add('centered-text');
		ty.innerText = r+1;
		tr.appendChild(ty);
		
		let tc = document.createElement('td');
		tc.classList.add('centered-text');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', rows[r][columnIndexKNID]);
		tc.innerText = rows[r][columnIndexSongTitle] + ' (' + rows[r][columnIndexKNYEAR] + ')';
		tc.addEventListener('click', updateSong);
		tr.appendChild(tc);
		
		tbody.appendChild(tr);
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#popular-songs').innerHTML = '';
	document.querySelector('#popular-songs').appendChild(header);
	document.querySelector('#popular-songs').appendChild(table);
}

function generateSongCountByYear(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Count by Year';
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		let th = document.createElement('th');
		th.innerText = column;
		tr.appendChild(th);
	}
	tbody.appendChild(tr);
	
	let excludedColumns = [];
	let columnIndexKNYEAR = contents.columns.indexOf('Year');
	let columnIndexCount = contents.columns.indexOf('Count');
	for(let r = 0; r < rows.length; r++)
	{
		let tr = document.createElement('tr');
		
		let ty = document.createElement('td');
		ty.classList.add('centered-text');
		ty.innerText = rows[r][columnIndexKNYEAR];
		tr.appendChild(ty);
	
		let tc = document.createElement('td');
		tc.innerHTML = '';
		for(c = 0; c < parseInt(rows[r][columnIndexCount]); c++)
		{
			tc.innerHTML += '<span class="material-icons">music_note</span>';
		}		
		tr.appendChild(tc);	
		
		tbody.appendChild(tr);
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#song-appetite').innerHTML = '';
	document.querySelector('#song-appetite').appendChild(header);
	document.querySelector('#song-appetite').appendChild(table);
}


//--HELPER FUNCTIONS--//
function clearModules() {
	for(let tab of document.getElementsByClassName('module'))
	{
		tab.innerHTML = '';
	}
}

function updateSong() {	
	window['mode'] = 'song';
	hideContextMenus(true);
	clearModules();
	
	let id = parseInt(this.getAttribute('data-id'));
	let query = "SELECT * FROM Song WHERE KNID = " + id;
	if(debugMode) console.log('updateSong', query);
	queryDb(query, updateOptions);
}

function updateYear() {
	window['mode'] = 'year';
	document.querySelector('#search').value = '';
	document.querySelector('#options').value = '';
	
	let year = this.getAttribute('data-year');
	let query = "SELECT DISTINCT KNYEAR FROM SongAwardsPeriod WHERE KNYEAR = " + year;
	if(debugMode) console.log('updateYear', query);
	queryDb(query, generateLayout);
	
	//initial query for options
	query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE KNYEAR = " + year;
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
}

function updateArtist() {
	window['mode'] = 'artist';
	document.querySelector('#search').value = '';
	document.querySelector('#options').value = '';
	
	let artist = this.getAttribute('data-artist');
	let query = "SELECT ArtistTitle AS 'Artist Title' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(artist) + "'";
	if(debugMode) console.log('updateArtist', query);
	queryDb(query, generateLayout);
	
	//initial query for options
	query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(artist) + "'";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
}

function addQuotationInSQLString(query) {
	//fix query in single quotes contains single quotes, see also reduceReleaseTitle
	return query.replace(/'/g,"''");
}

function removeCharacterInSQLProperty(property) {
	//fix query in single quotes contains single quotes, see also reduceReleaseTitle
	return "REPLACE(" + property + ", '.', '')";
}

function reduceReleaseTitle(release) {
	//exception list to group multiple disc releases (data consistency required in db)
	return release.replace(/'/g,"''").replace('Disc 1','').replace('Disc 2','').replace('Disc 3','').trim();
}

function testPlayer() {
	window['test-score'] = 0;
	window['test-count'] = 1;
	window['test-total'] = 0;
	window['test-errors'] = [];
	
	//to test if filename is corresponding to database
	//loop all songs in dropdown trigger event, log player status
	let options = document.querySelector('#options');
	window['option_list'] = options.getElementsByTagName('option');
	window['test-total'] = window['option_list'].length - 1;
	
	setTimeout(function () {
		setNextOption(parseInt(window['option_list'][1].value));
	}, 200); //set timeout to where processor comfortable
}

function setNextOption(id) {
	console.log('setNextOption',id);
	document.querySelector('#options').value = id;
	document.querySelector('#options').dispatchEvent(new Event('change'));

	setTimeout(updateTestPlayer, timeout);
}

function updateTestPlayer() {
	let player = document.querySelector('#player');
	let id = player.getAttribute('data-id');
	let overlay = document.querySelector('.invisible');
	if(overlay != null)
		window['test-score'] += 1;
	else
		errors.push(id);
	
	console.log('updateTestPlayer', id);
	console.log('score', window['test-score'] + '/' + window['test-total']);
	window['test-count'] += 1;
	if(window['test-count'] > window['test-total'])
		endTestPlayer();
	else
	{
		setTimeout(function () {
			setNextOption(parseInt(window['option_list'][window['test-count']].value));
		}, timeout);
	}
}

function endTestPlayer() {	
	console.log('testPlayer', window['test-score'] + '/' + window['test-total'] + ' ok');
	console.log('errors', window['test-errors']);
}

function showContextMenu() {
	event.preventDefault();
	event.stopPropagation();
    document.addEventListener('click', hideContextMenus);
    document.addEventListener('wheel', hideContextMenus);
	
	let box = document.body.getBoundingClientRect();
    let x = event.clientX - box.left;
    let y = event.clientY - box.top;
	
	let menu = document.querySelector('.context');
    menu.style.top = y + 'px';
    menu.style.left = x + 'px';
	menu.classList.remove('hidden');	
	menu.innerHTML = '';
		
	// console.log(event.target.getAttribute('context'));
	switch(event.target.getAttribute('context'))
	{
		case 'related':
			menu.appendChild(showAddQueueContextMenu(this.getAttribute('data-id')));
			break;
		case 'playlist':
			if(document.querySelector('.playlist') != null)
				hideContextMenus(true);
			else
				menu.appendChild(showPlaylist());
			break;
	}
	
	if(y + menu.getBoundingClientRect().height >= window.innerHeight)
	{
		menu.style.top = (y - menu.getBoundingClientRect().height) + 'px';
	}
	
}

function showAddQueueContextMenu(id) {
	let submenu = document.createElement('div');
	
	let playNext = document.createElement('div');
	playNext.classList.add('tag');
	playNext.innerText = 'Play Next';
	playNext.addEventListener('click', function() {
		window['playlist'].splice(window['playing'] + 1, 0, id);
		hideContextMenus(true);
		// updateQueue();
	});
	submenu.appendChild(playNext);
	
	let playLater = document.createElement('div');
	playLater.classList.add('tag');
	playLater.innerText = 'Add To Queue';
	playLater.addEventListener('click', function() {
		window['playlist'].push(id);
		hideContextMenus(true);
		// updateQueue();
	});
	submenu.appendChild(playLater);
		
	return submenu;
}

function showPlaylist() {
	let submenu = document.createElement('div');
	submenu.classList.add('playlist');
	
	if(window['playlist'].length > 0)
	{
		let baseQuery = "SELECT KNID, ArtistTitle || ' - ' || SongTitle AS 'DisplayValue' FROM Song";
		
		let query = '';
		for(let p = 0; p < window['playlist'].length; p++)
		{
			query += baseQuery;
			query += " WHERE KNID = '" + window['playlist'][p] + "'";
			if(p < window['playlist'].length - 1) query += " UNION ALL ";
		}
		if(debugMode) console.log('showPlaylist', query);
		return queryDb(query, renderPlaylistItems);
	}
	else if(window['playlist'].length == 0)
	{
		let item = document.createElement('div');
		item.classList.add('tag');
		item.innerText = 'No items';
		submenu.appendChild(item);
	}
	
	return submenu;
}

function renderPlaylistItems(list) {
	let submenu = document.createElement('div');
	submenu.classList.add('playlist');
	
	for(let listItem of list.values)
	{
		let item = document.createElement('div');
		item.classList.add('tag');
		item.setAttribute('data-id', listItem[0]);
		if(window['playlist'][window['playing']] == listItem[0]) item.style.fontWeight = 'bold';
		item.innerText = listItem[1];
		item.addEventListener('click', updateSong);
		item.addEventListener('click', function() {
			window['playing'] = window['playlist'].indexOf(this.getAttribute('data-id'));
			document.querySelector('.context').classList.add('hidden');
		});
		submenu.appendChild(item);
	}
	return submenu;
}

function hideContextMenus(forced) {
	let menu = document.querySelector('.context');
	if (typeof forced == 'boolean' && forced == true) menu.classList.add('hidden');
    else if (!menu.contains(event.target)) menu.classList.add('hidden');

	document.removeEventListener('click', hideContextMenus);
    document.removeEventListener('wheel', hideContextMenus);	
}

//drag and drop
function addDragAndDrop() {
	let dropArea = document.createElement('div');
	dropArea.classList.add('drop-area');
	document.body.appendChild(dropArea);

	document.body.addEventListener('dragenter', onDragEnter, false); //show fade
	document.querySelector('.drop-area').addEventListener('dragleave', onDragLeave, false); //revert
	document.querySelector('.drop-area').addEventListener('dragover', onDragEnter, false);
	document.querySelector('.drop-area').addEventListener('drop', onDrop, false); //actual event that does stuff
}

function onDragEnter(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (!dropArea.classList.contains('drop-fade')) dropArea.classList.add('drop-fade');
}

function onDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
}

function onDrop(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
	
	var file = e.dataTransfer.files[0];
	// console.log('file', file.name, file.type);
	if(file.type == 'audio/mpeg')
	{
		document.querySelector('#search').value = file.name.replace('.mp3','');
		document.querySelector('#search').dispatchEvent(new Event('input'));
		
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
		query += " WHERE SongTitle = '" + addQuotationInSQLString(document.querySelector('#search').value) + "'";
		// console.log('query', query);
		queryDb(query, updateOptions);
	}
}
