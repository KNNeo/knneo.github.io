//--STARTUP--//
// addServiceWorker();
window.addEventListener('load', startup);
window.addEventListener('resize', onResize);
window.addEventListener('keyup', onKeyUp);
window.addEventListener('keydown', onKeyDown);
window.addEventListener('touchstart', onFeedback);
window.addEventListener('click', onFeedback);

//--EVENTS--//
function startup() {
	onFeedback();
	renderVariables();
	renderSettings();
	renderTitle();
	
	runLoader();
	generateFilters();
	generateHomepage();
	setTabs();
}

function addServiceWorker() {
	if (navigator && 'serviceWorker' in navigator) {
	  window.addEventListener('load', function() {
		navigator.serviceWorker.register('sw.js')
		  .then(function(registration) {
			console.log('Service worker registered:', registration.scope);
			startup();
		  }, function(err) {
			console.log('Service worker registration failed:', err);
		  });
	  });
	}
}

function onResize() {
	setTabs();
}

function onKeyUp() {
	if (debugMode) console.log('onKeyUp', event.key);
	// space: play/pause when not focus on player
	if (event.key === ' ' && document.querySelector('#player') != null 
	&& ['player', 'search'].indexOf(document.activeElement.id) < 0) {
		event.preventDefault();
		let player = document.querySelector('#player');
		if(player.paused)
			player.play();
		else
			player.pause();
	}
	// ctrl + c: copy search content
	if (event.key === 'c' && window['ctrled'] && document.querySelector('#copy') != null
	&& ['search'].indexOf(document.activeElement.id) < 0) {
		event.preventDefault();
		document.querySelector('#copy').click();
	}
	// shift: combine with click playlist to add 10 songs to queue
	if (event.key === 'Shift') {
		event.preventDefault();
		window['shifted'] = false;
	}
	// ctrl: combine with c to copy search content
	if (event.key === 'Control') {
		event.preventDefault();
		window['ctrled'] = false;
	}
	// up: increases volume of player, combine with shift to adjust without player focus
	if (event.key === 'ArrowUp' && document.querySelector('#player') != null 
	&& document.querySelector('#player').volume < 1
	&& (document.querySelector('#player') === document.activeElement || window['shifted'])) {
		event.preventDefault();
		let player = document.querySelector('#player');
		let volume = player.volume + (0.01 * volumeDelta);
		if(volume > 0.99) // prevent js rounding issue
			volume = 1;
		player.volume = volume;
	}
	// down: decreases volume of player, combine with shift to adjust without player focus
	if (event.key === 'ArrowDown' && document.querySelector('#player') != null 
	&& document.querySelector('#player').volume > 0
	&& (document.querySelector('#player') === document.activeElement || window['shifted'])) {
		event.preventDefault();
		let player = document.querySelector('#player');
		let volume = player.volume - (0.01 * volumeDelta);
		if(volume < 0.01) // prevent js rounding issue
			volume = 0;
		player.volume = volume;
	}
	return false;
}

function onKeyDown() {
	if (debugMode) console.log('onKeyDown', event.key);
	// space: prevent scroll when play/pause
	if(event.key === ' ' && ['player', 'search'].indexOf(document.activeElement.id) < 0)
		event.preventDefault();
		
	// shift: combine with click playlist to add 10 songs to queue
	if (event.key === 'Shift') {
		event.preventDefault();
		window['shifted'] = true;
	}
	// ctrl: combine with c to copy search content
	if (event.key === 'Control') {
		event.preventDefault();
		window['ctrled'] = true;
	}
	return false;
}

function onFeedback() {
	if(isMobile())
	{
		document.querySelector('html').classList.add('touchable');
		return;
	}
	if(debugMode)
		console.log(event.type, new Date() - window['last-input']);
	let list = document.querySelector('html').classList;
	if(event.type === 'touchstart' && !list.contains('touchable'))
	{
		document.querySelector('html').classList.add('touchable');
	}
	else if(event.type === 'click' && new Date() - window['last-input'] > 200 && list.contains('touchable'))
	{
		document.querySelector('html').classList.remove('touchable');
	}
	window['last-input'] = new Date();
}

//--FUNCTIONS--//
async function callDb(query, callback) {
	const time = Date.now();
	//for webassembly file
	const sqlPromise = await initSqlJs({
	  locateFile: file => 'https://knneo.github.io/klassic-note-web/sql-wasm.wasm'
	});

	// using xmlhttprequest
	const xhr = new XMLHttpRequest();
	xhr.responseType = 'arraybuffer';
	xhr.open('GET', databaseFilename, true);
	xhr.onload = e => {
	  const uInt8Array = new Uint8Array(xhr.response);
	  window['db'] = new sqlPromise.Database(uInt8Array);
	  const contents = window['db'].exec(query);
	  if(contents && contents.length > 0)
		  callback(contents[0]);
	  else if(contents)
		  callback(contents);
	};
	xhr.send();
	
	if(debugMode)
		console.log('callDb took', Date.now() - time, 'ms');
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

function toggleButton() {
	window[this.id] = !window[this.id];
	
	let temp = document.getElementById(this.id).innerText;
	document.getElementById(this.id).innerText = this.getAttribute('data-alt');
	this.setAttribute('data-alt', temp);
	
	if(this.getAttribute('data-title'))
	{
		let tempTitle = document.getElementById(this.id).title;
		document.getElementById(this.id).title = this.getAttribute('data-title');
		this.setAttribute('data-title', tempTitle);
	}
	updateQueueButtons();
}

function skipSong() {
	//==TEST CASES==//
	// Playlist empty
	// With song selected on homepage
	// With song from search in playlist
	// With playlist, playing is not last song - select next in playlist
	// With playlist, playing is last song

	window['mode'] = 'song'; // assumption: must be in song mode
	 // for startup
	if(window['playing'] === null)
		window['playing'] = -1;
	 // empty playlist
	if(window['playlist'] === null || window['playlist'].length === 0)
		randomSong();
	else if (window['playing'] >= 0 && window['playing'] + 1 < window['playlist'].length)
	{ // if playing something
		let optQuery = "SELECT * FROM Song WHERE KNID = ";
		optQuery += window['playlist'][window['playing'] + 1];
		if(debugMode) console.log('skipSong', optQuery);
		queryDb(optQuery, updateOptions);
	}
	else if(window['shuffle-mode'])
	{ // shuffle mode on
		let nextOption = document.querySelector('#queue-options').value;
		let query = "SELECT KNID FROM Song WHERE KNID NOT IN (" + window['playlist'].join(',') + ")";
		if(nextOption === 'artist') query += " AND ArtistID = " + window['artist-id'] + "";
		if(nextOption === 'release') query += " AND ReleaseID = " + window['release-id'] + "";
		if(nextOption === 'year') query += " AND KNYEAR = " + window['year'] + "";
		if(nextOption === 'genre') query += " AND Genre = '" + window['genre'] + "'";
		if(nextOption === 'past3year') {
			if(!window['years']) window['years'] = window['year'] - 3;
			query += " AND KNYEAR > " + parseInt(window['years']) + "";
		}
		if(debugMode) console.log('shuffle-mode', query);
		queryDb(query, function(content) {
			if(debugMode) console.log('nextOption', window['song-id'], content);
			let total = content.values.length;
			//if next option not available ie. will get random song, reset special shuffle
			if(total < 1)
			{
				randomSong();
				window['years'] = undefined;					
				document.querySelector('#queue-options').value = 'any';
				return;
			}
			let random = content.values[Math.floor((Math.random() * total))][0].toString();
			let optQuery = "SELECT * FROM Song WHERE KNID = " + random;
			if(debugMode) console.log('nextOptionQuery', optQuery);
			queryDb(optQuery, updateOptions);
			window['playlist'].push(random);
			if(debugMode) console.log('playlist', window['playlist']);
			updateQueueButtons();
		});
	}
	else if (event?.target.id != 'player')
	{ // if trigger from ended event
		randomSong();
	}
}

function randomSong() {
	event?.preventDefault();	
	
	let content = Array.from(document.querySelectorAll('#options option')).filter(c => c.value > 0).map(val => val.value);
	let toQueue = parseInt(event?.target.getAttribute('data-count')) || 1;	
	let query = "SELECT COUNT(*) FROM Song";
	queryDb(query, function(content) { // with song count, get random id
		let total = content.values[0][0];			
		let random = Math.floor((Math.random() * total)).toString();
		
		let optQuery = "SELECT * FROM Song WHERE KNID = " + random;
		if(debugMode) console.log('randomSong', optQuery);
		queryDb(optQuery, updateOptions);
		// assume not in playlist
		window['playlist'].push(random);
	});
};

function setTabs() {
	let isWidescreen = window.innerWidth > 1.5*widescreenAverageModuleSize;
	let homePageVisible = document.querySelector('#tab-homepage').style.display != 'none';
	
	//responsive module display	
	let totalModules = Math.round(window.innerWidth / widescreenAverageModuleSize);
	if(debugMode) console.log('totalModules', totalModules);
	
	document.querySelector('#tab-buttons').classList.remove('hidden');
	if(homePageVisible) document.querySelector('#tab-buttons').classList.add('hidden');
	for(let tab of document.querySelectorAll('.tab'))
	{
		let hasModules = Array.from(tab.childNodes).filter(c => c.childNodes.length > 0).length > 0;
		if(debugMode) console.log('hasModules', tab.id, hasModules);
		let tabButton = document.querySelector('#button-' + tab.id);
		//enable tab button controls if have content
		if(tabButton != null)
		{
			tabButton.style.cursor = hasModules ? 'pointer' : '';
			tabButton.disabled = !hasModules;
		}

		//remove padding if no elements
		for(let module of tab.querySelectorAll('.module'))
		{
			module.style.padding = Array.from(module.childNodes).filter(c => c.childNodes.length > 0).length > 0 ? '' : 0;
		}
		
		//mobile alignments
		if(isWidescreen && !tab.classList.contains('tab-view')) tab.classList.add('tab-view');
		if(!isWidescreen && tab.classList.contains('tab-view')) tab.classList.remove('tab-view');
		
		//hide tab if is homepage
		tab.style.display = homePageVisible ? 'none' : '';
		tab.style.display = isWidescreen ? 'inline-block' : '';
		tab.style.width = isWidescreen && hasModules ? ((window.innerWidth / totalModules) - 20) + 'px' : ''; //exclude horizontal padding
	}
	
	//display tab when mobile, depending on mode
	if(!homePageVisible) showTab('tab-info');
	
	//toggle search buttons
	document.querySelector('#search').style.width = homePageVisible ? '100%' : (document.querySelector('#header').getBoundingClientRect().width - 48) + 'px';
	document.querySelector('#search-buttons').style.display = homePageVisible ? 'none' : '';
	document.querySelector('#options').style.width = '';
	// document.querySelector('#tab-buttons').style.display = isWidescreen ? 'none' : '';
	document.querySelector('#tab-list').style.maxWidth = isWidescreen && !homePageVisible ? '' : widescreenAverageModuleSize + 'px';
	
	for(let module of document.querySelectorAll('.centered'))
	{
		if(module.style.maxWidth != widescreenAverageModuleSize)
			module.style.maxWidth = widescreenAverageModuleSize + 'px';
	}
	
	hideContextMenus(true);
	displayCoverIfComplete();
	
	//adjust content height
	let tabHeight = window.innerHeight - Array.from(document.querySelectorAll('.calc')).reduce((total, current) => { return total + current.offsetHeight; }, 15) + 'px';
	if(debugMode) console.log('containerHeight', tabHeight, document.querySelector('#tab-list').style.height);
	if(tabHeight != document.querySelector('#tab-list').style.height)
	{
		document.querySelector('#tab-list').style.height = tabHeight;
		if (tabHeight > 0 && !window['mini-height']) setTimeout(setTabs, 100);
	}
	
	checkIfMiniMode();
}

function showTab(tabId) {
	document.querySelector('#tab-buttons').classList.remove('hidden');
	for(let tab of document.getElementsByClassName('tab'))
	{
		if(tab.id === tabId.replace('button-',''))
			tab.classList.remove('hidden');
		else
			tab.classList.add('hidden');
	}
	document.querySelector('#' + tabId.replace('button-','')).scrollIntoView(); // scroll if on desktop
}

function checkIfMiniMode() {
	let minHeight = 10;
	if(document.querySelector('#player') === null) return;
	
	// console.log('checkIfMiniMode', document.querySelector('#tab-list').getBoundingClientRect().height);
	if (document.querySelector('html').classList.contains('mini') && 
	window.innerHeight > window['mini-height'])
	{
		window['mini-height'] = null;
		document.querySelector('html').classList.remove('mini');
	}
	if (!document.querySelector('html').classList.contains('mini') && 
	document.querySelector('#tab-list').getBoundingClientRect().height <= minHeight)
	{
		window['mini-height'] = window.innerHeight;
		document.querySelector('html').classList.add('mini');
	}
}

function renderVariables() {
	// set variables here, do not define above
	window['autoplay'] = autoplayOnSelect;
	window['db'] = null;
	window['playlist'] = [];
	window['shuffle-mode'] = false;
	window['mode'] = 'song';
	window['playing'] = null;				// index of playing in playlist
	window['loading'] = true;
	window['title'] = defaultTitle;
	window['release-id'] = 0;				// below are info for reference
	window['artist-id'] = 0;
	window['year'] = '';
	window['genre'] = '';
	window['fill'] = 152;					// for coverArtStyle === 'large', how much width on header to take
}

function renderSettings() {
	for(let setting of document.querySelectorAll('.setting'))
	{
		setting.addEventListener('click', toggleButton);
	}
	if(autoplayOnSelect)
		document.getElementById('autoplay').click();
	updateQueueButtons();
}

function renderTitle() {
	document.querySelector('#title').innerText = defaultTitle;
	document.title = window['title'];
}

function generateFilters() {
	let filters = document.querySelector('#filters');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.disabled = true;
	search.setAttribute('autocomplete', 'off');
	search.placeholder = 'Song Title, Artist Title, KNYEAR...';
	search.addEventListener('focus', function() {
		window['searching'] = true;
	});
	search.addEventListener('blur', function() {
		window['searching'] = false;
	});
	search.addEventListener('input', querySelect);
	filters.appendChild(search);
	
	let searchButtons = document.createElement('span');
	searchButtons.id = 'search-buttons';
	searchButtons.classList.add('search-buttons');
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
	options.title = 'Search Results';
	options.addEventListener('focus', function() {
		window['searching'] = true;
	});
	options.addEventListener('blur', function() {
		window['searching'] = false;
	});
	options.addEventListener('change', onChangeOption);
	
		let opt = document.createElement('option');
		opt.innerText = '===';
		options.appendChild(opt);
		
	filters.appendChild(options);
}

function copySearch() {
	let search = document.querySelector('#search').value.split(' - ');
	if(search.length === 2)
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
	document.querySelector('#tab-buttons').classList.add('hidden');
	document.querySelector('#cover').innerHTML = '';
	document.querySelector('#cover').classList = [];
	clearModules();
	generateHomepage();
	setTabs();
}

function querySelect() {
	if(debugMode) console.log('querySelect', this.value);
	if(this.value.length < 3) return;
	let searchFields = [].join(" || ");
	let query = "";
	
	searchFields = ['ArtistTitle'].join(" || ");
	query += "SELECT MIN(ID) AS KNID, '' AS KNYEAR, '' AS SongTitle, ArtistTitle, ID AS ArtistID, null as ReleaseID FROM Artist WHERE TRUE "
	query += addQuotationInSQLString(this.value).split(' ').map(v => "AND " + searchFields + " LIKE '%" + v + "%'").join('');
	query += " GROUP BY ArtistTitle UNION ALL ";
	
	searchFields = ['SongTitle','ArtistTitle','KNYEAR'].join(" || ");
	query += "SELECT ID AS KNID, KNYEAR, SongTitle, ArtistTitle, ArtistID, ReleaseID FROM Song WHERE TRUE ";
	query += addQuotationInSQLString(this.value).split(' ').map(v => "AND " + searchFields + " LIKE '%" + v + "%'").join('');
	
	if(debugMode) 
		console.log('querySelect', query);
	// window['searching'] = true;
	queryDb(query, updateOptions);
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

function selectAll() {
	this.setSelectionRange(0, this.value.length);
}

function updateOptions(contents) {
	if(debugMode) console.log('updateOptions', contents);
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
				
				if(title)
					newOptions.push({
						id: categoryIcons[2] + id,
						optionString: categoryIcons[2] + knyear + ' - ' + artist +  ' - ' + title
					});
				else if (artist)
					newOptions.push({
						id: categoryIcons[0] + id,
						optionString: categoryIcons[0] + artist
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
		if(newOptions.length === 2 && window['mode'] != 'artist') //1 result with default
		{
			// search.blur();
			setTimeout(function() {
				let newId = contents.values[0][columnIndexKNID];
				document.querySelector('#options').value = categoryIcons[2] + newId;
				document.querySelector('#options').dispatchEvent(new Event('change'));
				// if(window['playlist'][window['playlist'].length - 1] != newId)
				// {
					// window['playlist'].push(newId.toString());
				// }
				// updateQueue();
			},200);
		}
		
		options.disabled = newOptions.length === 2;
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

function onChangeOption() {
	let id = document.querySelector('#options').value;
	if(debugMode) console.log('onChangeOption', id);
	// select by id value format
	if(id.startsWith(categoryIcons[2]))
	{
		let input = id.replace(categoryIcons[2], '');
		window['mode'] = 'song';
		// if from search, add to playlist, disable flag, unfocus search
		if(window['searching']) {
			window['playlist'].push(input.toString());
			window['searching'] = null;
			 document.querySelector('#search').blur();
		}
		
		let query = "SELECT ID, KNYEAR, Filename, CASE WHEN SongTitleAlt IS NOT NULL AND SongTitle <> SongTitleAlt THEN SongTitle || '<br/>' || SongTitleAlt ELSE SongTitleAlt END AS 'Song Title', ArtistTitle, CASE WHEN ArtistTitleAlt IS NOT NULL AND ArtistTitle <> ArtistTitleAlt THEN ArtistTitle || '<br/>' || ArtistTitleAlt ELSE ArtistTitle END AS 'Artist Title', ReleaseTitle AS 'Release Title', ReleaseArtistTitle AS 'Release Artist', ReleaseYear AS 'Year', Genre, DateCreated AS 'Date Added', ";
		query += "CASE WHEN VocalCode = 'F' THEN 'Solo Female' WHEN VocalCode = 'M' THEN 'Solo Male' WHEN VocalCode = 'MM' THEN 'Male Duet' WHEN VocalCode = 'FF' THEN 'Female Duet' WHEN VocalCode IN ('MF', 'FM') THEN 'Mixed Duet' WHEN LENGTH(VocalCode) = 3 THEN 'Triplet' WHEN LENGTH(VocalCode) >= 4 THEN 'Quartet or More (' || LENGTH(VocalCode) || ')' END AS 'Vocals', ";
		query += "CASE LanguageCode WHEN 'JP' THEN 'Japanese' WHEN 'EN' THEN 'English' WHEN 'CH' THEN 'Chinese' WHEN 'FR' THEN 'French' END AS 'Language', ";
		query += "LyricsURL AS 'Lyrics', ArtistID, ReleaseID FROM Song WHERE KNID = " + input;
		if(debugMode) console.log('query', query);
		queryDb(query, generateModules);
	}
	else
	{
		window['mode'] = 'artist';
		let input = id.replace(categoryIcons[0], '');
		
		let query = "SELECT ArtistTitle, ArtistTitle AS 'Artist Title' FROM Artist WHERE ID = " + input;
		if(debugMode) console.log('query', query);
		queryDb(query, generateModules);
		
		query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE ID = " + input;
		if(isMobile())
			query += " LIMIT 100";
		queryDb(query, updateOptions);
	}
}

//--HOMEPAGE--//
//flow is generally generateHomepage -> query[Module/Component] -> generate[Module/Component]
function generateHomepage() {	
	//initial query for options
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, function(contents) {
		updateOptions(contents);
		document.querySelector('#options').disabled = true;
		document.querySelector('#search').disabled = false;
	});
	
	query = "SELECT DISTINCT KNYEAR FROM SongAwardsPeriod";
	if(debugMode) console.log('generateYears', query);
	callDb(query, generateYears);
	
	if(hideHomepage) return;
	
	let recent = localStorage.getItem('recent');
	recent = (recent === null || recent.length === 0) ? JSON.parse('[]') : JSON.parse(recent);
	if(recent.length > 10)
		recent = recent.slice(0,10);
	
	query = "";
	for(let id of recent)
	{
		query += "UNION ALL ";
		if(query === "UNION ALL ") query = "";
		query += "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE KNID = " + id.toString() + " ";
	}
	if(debugMode) console.log('generateSearchHistory', query);
	callDb(query, generateSearchHistory);
	
	query = "SELECT ID as KNID, Type, Category, ReleaseTitle, ReleaseArtistTitle, KNYEAR, substr('0000'||ReleaseDate,-4) as ReleaseDate FROM Release ";
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
	if(debugMode) console.log('generateSearchHistory', contents);
	document.querySelector('#search-history').classList.remove('hidden');
	generateTableList(
		contents, {
		id: 'search-history', 
		title: 'Recently Saearched',
		rowFormat: ['KNYEAR', ' - ', 'ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong,
		actionTitle: 'Clear All',
		actionFunc: function() {
			localStorage.removeItem('recent');
			generateSearchHistory();
			document.querySelector('#search-history').classList.add('hidden');
		},
	});
}

function generateUpcomingReleases(contents) {	
	if(debugMode) console.log('generateUpcomingReleases', contents);
	generateTableList(
		contents, {
		id: 'upcoming-releases', 
		title: 'Upcoming Releases',
		rowFormat: ['KNYEAR', 'ReleaseDate', ' - [', 'Type', ' ', 'Category', '] ' , 'ReleaseArtistTitle', ' - ', 'ReleaseTitle'], 
	});
}

//--MODULES--//
//flow is generally generateModules -> query[Module/Component] -> generate[Module/Component]
function generateModules(contents) {
	if(debugMode) console.log('generateModules', contents);
	document.querySelector('#tab-homepage').style.display = 'none';
	document.querySelector('#search-buttons').style.display = '';
	document.querySelector('#music').innerHTML = '';
	document.querySelector('#cover').innerHTML = '';
	updateMediaSession();
	
	//clear modules
	clearModules();
	onFeedback();
	if(window['mode'] === 'year')
	{
		queryYearInfo(contents);
		querySongList(contents); //SOTD is here
		queryAwardsByYear(contents);
		queryRankingsByYear(contents);
		queryCompilationsByYear(contents);
		queryAnalysis(contents);
	}
	
	if(window['mode'] === 'song')
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
	
	if(window['mode'] === 'artist')
	{
		updateSearch(contents);		
		queryArtistInfo(contents);
		queryArtistRelated(contents);
		queryAwardsByArtist(contents);
		queryRankingsByArtist(contents);
		queryCompilationsByArtist(contents);
		queryCollection(contents);
		//sotd? song mentions by group by song?
		queryArtistAnalysis(contents);
	}
	
	// generateTabs();
	setTabs();
	updateQueue();
	updateQueueButtons();
	scrollToTop();
	
	for(let selected of document.getElementsByClassName('not-selectable'))
	{
		selected.dispatchEvent(new Event('active'));
	}
}

function updateSearch(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('Song Title');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexArtistID = contents.columns.indexOf('ArtistID');
	let columnIndexReleaseID = contents.columns.indexOf('ReleaseID');
	let columnIndexGenre = contents.columns.indexOf('Genre');
	
	if(window['mode'] === 'song')
	{
		document.querySelector('#search').value = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle].split('<br/>')[0];
		window['artist-id'] = row[columnIndexArtistID];
		window['release-id'] = row[columnIndexReleaseID];
		window['song-id'] = row[columnIndexKNID];
		window['year'] = row[columnIndexKNYEAR];
		window['genre'] = row[columnIndexGenre];
		
		let recent = localStorage.getItem('recent');
		recent = (recent === null || recent.length === 0) ? JSON.parse('[]') : JSON.parse(recent);
		if(recent.length > 0)
		{
			recent = recent.filter(r => r != row[columnIndexKNID]);
			recent.unshift(row[columnIndexKNID])
			// if(recent.length > 10)
				// recent = recent.slice(0,10);
		}
		else
		{
			recent.push(row[columnIndexKNID]);
		}
		
		localStorage.setItem('recent', JSON.stringify(recent));
	}
	if(window['mode'] === 'artist')
	{
		document.querySelector('#search').value = contents.values[0][columnIndexArtistTitle];
	}
}

function generatePlayer(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexFilename = contents.columns.indexOf('Filename');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('Song Title');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
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
	audio.autoplay = window['autoplay']; //for shuffle to work this must be set as true
	audio.volume = localStorage.getItem('volume')|| 0.5;
	audio.controlsList = 'nodownload';
	audio.addEventListener('play', function() {
		window['title'] = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle].split('<br/>')[0] + ' | ' + defaultTitle;
		renderTitle();
	});
	audio.addEventListener('pause', function() {
		window['title'] = defaultTitle;
		renderTitle();
	});
	audio.addEventListener('canplay', function() {
		this.style.display = 'block';
		setTabs();
	});
	audio.addEventListener('volumechange', function() {
		localStorage.setItem('volume', document.querySelector('#player').volume);
	});
	audio.addEventListener('ended', skipSong);
	
	let source = document.createElement('source');
	source.src = (useDirectoryFormat ? (directory + knyear + '/' + filename) : filename) + '.mp3' ;
	source.type = 'audio/mpeg';
	source.innerText = '[You\'ll need a newer browser that supports HTML5 to listen to this.]';
	
	audio.appendChild(source);
	document.querySelector('#music').appendChild(audio);
	
	updateMediaSession({
		title: row[columnIndexSongTitle].split('<br/>')[0],
		artist: row[columnIndexArtistTitle].split('<br/>')[0],
		album: row[columnIndexReleaseTitle].split('<br/>')[0],
	});
}

function queryCoverArt(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexReleaseID = contents.columns.indexOf('ReleaseID');
	if(parseInt(columnIndexReleaseID) > 0)
	{
		let query = "SELECT KNYEAR, CoverArt FROM Release r WHERE r.ID = " + row[columnIndexReleaseID] + " and r.CoverArt is not null";
		if(debugMode) 
			console.log('generateCoverArt', query);
		queryDb(query, generateCoverArt);
	}
}

function generateCoverArt(contents) {
	let isOverlay = coverArtStyle.toLowerCase() === 'overlay';
	let isFill = coverArtStyle.toLowerCase() === 'large';
	let cover = document.querySelector('#cover');
	cover.className = '';
	cover.innerHTML = '';
	if(contents.values.length < 1) { // if no value
		if(isFill) {
			document.querySelector('#search').style.width = (document.querySelector('#header').getBoundingClientRect().width - 48) + 'px';
			document.querySelector('#options').style.width = '';
		}
		return;
	}
	
	//position: by title, right hand corner of header
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexCoverArt = contents.columns.indexOf('CoverArt');
	let coverArtUrl = useDirectoryFormat ? coverArtDirectory + row[columnIndexKNYEAR] + '/' + row[columnIndexCoverArt] : row[columnIndexCoverArt];

	let coverWidth = 0.45*document.querySelector('#header').getBoundingClientRect().width;// - 15;
	let coverHeight = document.querySelector('#header').getBoundingClientRect().height + (isOverlay ? 8 : 1); // - (isOverlay || isFill ? 0 : 0);// - 15;
	
	let art = document.createElement('img');
	if(isOverlay) art.style.width = coverWidth + 'px';
	art.style.height = coverHeight + 'px';
	
	if (isFill) {
		cover.classList.add('fill-background');
		art.style.width = window['fill'] + 'px';
		art.style.height = window['fill'] + 'px';
	}
	if (isOverlay) {
		cover.classList.add('overlay-background');
	} else {
		cover.classList.add('fill-background');
	}
	art.src = coverArtUrl;
	art.addEventListener('error', function() {
		if(debugMode)
			console.log('cover error');
		document.querySelector('#cover').classList.add('error');
	});
	cover.appendChild(art);
	
	if (navigator && 'mediaSession' in navigator) {
		var meta = navigator.mediaSession.metadata;
		updateMediaSession({
			title: meta.title,
			artist: meta.artist,
			album: meta.album,
			artwork: [
				{ src: coverArtUrl, sizes: '96x96',   type: 'image/png' },
				{ src: coverArtUrl, sizes: '128x128', type: 'image/png' },
				{ src: coverArtUrl, sizes: '192x192', type: 'image/png' },
				{ src: coverArtUrl, sizes: '256x256', type: 'image/png' },
				{ src: coverArtUrl, sizes: '384x384', type: 'image/png' },
				{ src: coverArtUrl, sizes: '512x512', type: 'image/png' },
			]
		});
	}
}

function displayCoverIfComplete() {
	let cover = document.getElementById('cover');
	if(cover.classList.contains('error') || cover.getElementsByTagName('img').length === 0) return;
	if(cover.getElementsByTagName('img').length > 0 && cover.getElementsByTagName('img')[0].complete && !cover.classList.contains('error'))
	{
		cover.style.display = 'initial';
		if(debugMode) console.log('cover loaded');		
		if(coverArtStyle.toLowerCase() === 'large') {
			let headerWidth = document.querySelector('#header').getBoundingClientRect().width;// - 15;
			document.querySelector('#search').style.width = (headerWidth - window['fill'] - 55) + 'px';
			document.querySelector('#options').style.width = (headerWidth - window['fill'] - 8) + 'px';
		}
		return;
	}

	if(debugMode)
		console.log('cover loading');
	setTimeout(displayCoverIfComplete, 100);
}

function queryInfo(contents) {
	generateSongInfo(contents);
	queryYouTubeInfo(contents);
	queryCreditInfo(contents);
	
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('Release Artist');
	
	let query = "SELECT CASE WHEN ArtistTitleAlt IS NOT NULL AND ArtistTitle <> ArtistTitleAlt THEN ArtistTitle || '<br/>' || ArtistTitleAlt ELSE ArtistTitle END AS 'Name', GROUP_CONCAT(ParentArtist, '<br/>') AS 'Tags (if any)', CASE WHEN ArtistCode = 'BD' THEN 'Independent Band' WHEN ArtistCode = 'ID' THEN 'Idol Group' WHEN ArtistCode = 'AG' THEN 'Anime Voice Actor Group' WHEN ArtistCode = 'AS' THEN 'Anime Voice Actor(s)' WHEN ArtistCode = 'CL' THEN 'Collaboration' WHEN ArtistCode = 'SS' THEN 'Singer-Songwriter' WHEN ArtistCode = 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', DisbandYear AS 'Year Disbanded (if any)', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "') AS 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode) console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT KNYEAR, Type || ' ' || Category AS 'Category', CASE WHEN ReleaseTitleAlt IS NOT NULL AND ReleaseTitle <> ReleaseTitleAlt THEN ReleaseTitle || '<br/>' || ReleaseTitleAlt ELSE ReleaseTitle END AS 'Release Title', CASE WHEN ReleaseArtistTitleAlt IS NOT NULL AND ReleaseArtistTitle <> ReleaseArtistTitleAlt THEN ReleaseArtistTitle || '<br/>' || ReleaseArtistTitleAlt ELSE ReleaseArtistTitle END AS 'Release Artist', TracksSelected || ' / ' || TracksTotal AS 'Tracks In Library', (SELECT COUNT(*) FROM Song s WHERE s.ReleaseTitle like r.ReleaseTitle || '%' AND s.ReleaseArtistTitle = r.ReleaseArtistTitle AND s.KNYEAR <= r.KNYEAR) || ' / ' || TracksSelected AS 'New Tracks', ReleaseYear || '.' || SUBSTR('00' || (ReleaseDate / 100), -2, 2) || '.' || SUBSTR('00' || ReleaseDate, -2, 2) AS 'Release Date' FROM Release r WHERE ID = (SELECT MAX(ID) FROM Release WHERE ReleaseTitle = '" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "' AND ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexReleaseArtistTitle]) + "')";
	if(debugMode) console.log('generateReleaseInfo', query);
	queryDb(query, generateReleaseInfo);
}

function generateSongInfo(contents) {
	if(debugMode) console.log('generateSongInfo', contents);
	generateTableAsColumnRows(contents, {
		id: 'song-info', 
		title: 'Song Information', 
		skipColumns: ['ArtistID', 'ReleaseID', 'Filename', 'ArtistTitle', 'Release Title', 'Release Artist'],
	});
}

function queryYouTubeInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexID = contents.columns.indexOf('ID');
	
	let query = "SELECT y.Identifier FROM Song s JOIN YouTube y on s.ID = y.SongID WHERE y.SongID = " + row[columnIndexID];
	if(debugMode) console.log('queryYouTubeInfo', query);
	queryDb(query, generateYouTubeInfo);
}

function generateYouTubeInfo(contents) {
	if(!contents.columns || !contents.values) return;
	let value = 'https://youtu.be/' + contents.values[contents.columns.indexOf('Identifier')];
	let info = document.querySelector('#song-info tbody');
	
	let videoRow = document.createElement('tr');
	
	let videoCell1 = document.createElement('td');
	videoCell1.innerText = 'Music Video';
	videoRow.appendChild(videoCell1);
	
	let videoCell2 = document.createElement('td');
	videoCell2.innerHTML = '<a target="_blank" href="' + value + '">' + getDomainViaUrl(value) + '</a>';
	
	videoRow.appendChild(videoCell2);
		
	info.insertBefore(videoRow, info.children[info.children.length - 1]);
	// info.appendChild(videoRow);
}

function queryCreditInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexID = contents.columns.indexOf('ID');
	
	let query = "SELECT * FROM Credit WHERE SongID = " + row[columnIndexID];
	if(debugMode) console.log('queryCreditInfo', query);
	queryDb(query, generateCreditInfo);
}

function generateCreditInfo(contents) {
	if(!contents.columns || !contents.values) return;
	let columnIndexCategory = contents.columns.indexOf('Category');
	let columnIndexTitle = contents.columns.indexOf('Title');
	let columnIndexType = contents.columns.indexOf('Type');
	let info = document.querySelector('#song-info tbody');
	
	let videoRow = document.createElement('tr');
	
	let videoCell1 = document.createElement('td');
	videoCell1.innerText = 'Credit';
	videoRow.appendChild(videoCell1);
	
	let videoCell2 = document.createElement('td');
	for(let row of contents.values)
	{
		videoCell2.innerHTML += row[columnIndexCategory] + ' "' + row[columnIndexTitle] + '" ' + row[columnIndexType] + ' <br/>';
	}
	
	videoRow.appendChild(videoCell2);
	
	info.insertBefore(videoRow, info.children[info.children.length - 1]);
}

function generateArtistInfo(contents) {
	if(debugMode) console.log('generateArtistInfo', contents);
	generateTableAsColumnRows(contents, {
		id: 'artist-info', 
		title: 'Artist Information', 
		skipColumns: [],
		actionTitle: window['mode'] === 'artist' ? null : 'More Info',
		actionFunc: window['mode'] === 'artist' ? null : function() {
			document.querySelector('#options').value = '';
			
			window['mode'] = 'artist';
			let query = "SELECT ArtistTitle, ArtistTitle AS 'Artist Title' FROM Artist WHERE ID = " + window['artist-id'];
			queryDb(query, generateModules);
		},
	});
}

function generateReleaseInfo(contents) {
	if(debugMode) console.log('generateReleaseInfo', contents);
	generateTableAsColumnRows(contents, {
		id: 'release-info', 
		title: 'Release Information', 
		skipColumns: [],
	});
}

function queryYearInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let year = row[columnIndexKNYEAR];
	
	let query = "SELECT KNYEAR, StartDate AS 'Song Awards Start Date', EndDate AS 'Song Awards End Date', (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + year + ") AS 'Song Count', (SELECT COUNT(DISTINCT ArtistID) FROM Song WHERE KNYEAR = " + year + ") AS 'Total Artists', (SELECT COUNT(DISTINCT ReleaseID) FROM Song WHERE KNYEAR = " + year + ") AS 'Total Releases' FROM SongAwardsPeriod WHERE KNYEAR = " + year + " AND Category = 'SONGLIST' ";
	if(debugMode) console.log('generateYearInfo', query);
	queryDb(query, generateYearInfo);
	queryDb(query, querySOTDByYear);
}

function generateYearInfo(contents) {
	if(debugMode) console.log('generateYearInfo', contents);
	generateTableAsColumnRows(contents, {
		id: 'year-info', 
		title: 'Song Awards Information', 
		skipColumns: [],
	});
}

function querySongList(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let year = row[columnIndexKNYEAR];
	
	let query = "SELECT * FROM Song WHERE KNYEAR = " + year + " ORDER BY SongTitle LIMIT 10";
	if(debugMode) console.log('generateSongList', query);
	queryDb(query, generateSongList);
}

function generateSongList(contents) {
	if(debugMode) console.log('generateSongList', contents);
	generateTableList(
		contents, {
		id: 'year-list', 
		title: 'Songs from ' + contents.values[0][contents.columns.indexOf('KNYEAR')],
		rowFormat: ['ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong,
		actionTitle: 'Refresh',
		actionFunc: function() {
			this.style.maxHeight = this.getBoundingClientRect().height;
			let query = "SELECT * FROM Song WHERE KNYEAR = " + contents.values[0][contents.columns.indexOf('KNYEAR')];
			query += " ORDER BY RANDOM() DESC LIMIT 10";
			if(debugMode) console.log('generateSongList', query);
			queryDb(query, generateSongList);
		},
	});
}

function queryArtistInfo(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	
	let query = "SELECT CASE WHEN ArtistTitleAlt IS NOT NULL AND ArtistTitle <> ArtistTitleAlt THEN ArtistTitle || '<br/>' || ArtistTitleAlt ELSE ArtistTitle END AS 'Name', CASE WHEN ArtistTitle = GROUP_CONCAT(ParentArtist, '<br/>') THEN NULL ELSE GROUP_CONCAT(ParentArtist, '<br/>') END AS 'Tags (if any)', CASE WHEN ArtistCode = 'BD' THEN 'Independent Band' WHEN ArtistCode = 'ID' THEN 'Idol Group' WHEN ArtistCode = 'AG' THEN 'Anime Voice Actor Group' WHEN ArtistCode = 'AS' THEN 'Anime Voice Actor(s)' WHEN ArtistCode = 'CL' THEN 'Collaboration' WHEN ArtistCode = 'SS' THEN 'Singer-Songwriter' WHEN ArtistCode = 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', DisbandYear AS 'Year Disbaneded (if any)', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "') AS 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode)
		console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT DISTINCT r.ReleaseYear as 'Year', r.Category, r.Type, r.ReleaseTitle AS 'Release Title', r.ReleaseYear || SUBSTR('0000' || r.ReleaseDate, -4, 4) AS 'Release Date', CAST(w.ID > 0 as INT) as 'Reviewed' FROM Release r LEFT JOIN Review w ON r.ID = w.ReleaseID WHERE r.ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' GROUP BY r.ReleaseTitle ORDER BY r.ReleaseYear, SUBSTR('0000' || r.ReleaseDate, -4, 4)";
	if(debugMode)
		console.log('generateArtistReleaseInfo', query);
	queryDb(query, generateArtistReleaseInfo);
}

function generateArtistReleaseInfo(contents) {
	if(debugMode) console.log('generateArtistReleaseInfo', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'artist-release', 
		skipClear: false,
		title: 'Artist Releases', 
		skipTitle: false,
		skipColumns: ['Type', 'Release Date', 'Original Release Title', 'Original Release Artist', 'Reviewed'], 
		dataId: null,
		groupColumn: null,
		titleFormat: null,
		centerContent: true,
		iconColumnName: 'Release Title',
		iconValueColumnName: 'Reviewed',
		iconId: 'reviews',
		iconTooltip: 'Reviewed'
	});
}

function queryRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('Release Artist');
	let columnIndexReleaseDateCreated = contents.columns.indexOf('Date Added');

	//max 10 related within 1 month
	// document.querySelector('#songs-related-date').innerHTML = '';
	let convertDate = "replace(DateCreated,'.','-')";
	let currentDate = "(select date("+convertDate+") from Song where KNID = "+row[columnIndexKNID]+")";
	let dateRange = "date("+convertDate+") between date("+currentDate+",'-1 months') and date("+currentDate+",'+1 months')";
	
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND " + dateRange;
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByDate', query);
	queryDb(query, generateSongRelatedByDate);
	
	//max 10 related same year
	// document.querySelector('#songs-related-year').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseYear = '" + row[columnIndexKNYEAR] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByYear', query);
	queryDb(query, generateSongRelatedByYear);
	
	//max 10 related to artist
	// document.querySelector('#artist-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistRelated', query);
	queryDb(query, generateArtistRelated);
	
	//max 10 related to release
	// document.querySelector('#release-related').innerHTML = '';
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
	// document.querySelector('#songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "ORDER BY RANDOM() DESC LIMIT 5";
	if(debugMode) console.log('generateSongFeaturedByArtist', query);
	queryDb(query, generateSongFeaturedByArtist);
}

function generateSongRelatedByDate(contents) {
	if(debugMode) console.log('generateSongRelatedByDate', contents);
	generateTableList(
		contents, {
		id: 'songs-related-date', 
		title: 'Songs within 3 months', 
		rowFormat: ['ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
		actionTitle: 'Refresh',
		actionFunc: function() {
			//max 10 related within 1 month
			let convertDate = "replace(DateCreated,'.','-')";
			let currentDate = "(select date("+convertDate+") from Song where KNID = "+window['song-id']+")";
			let dateRange = "date("+convertDate+") between date("+currentDate+",'-1 months') and date("+currentDate+",'+1 months')";
			
			query = "SELECT * FROM Song WHERE KNID <> " + window['song-id'];
			query += " AND " + dateRange;
			query += " ORDER BY RANDOM() DESC LIMIT 10";
			if(debugMode) console.log('generateSongRelatedByDate', query);
			queryDb(query, generateSongRelatedByDate);
		}
	});
}

function generateSongRelatedByYear(contents) {
	if(debugMode) console.log('generateSongRelatedByYear', contents);
	if(contents.values.length === 0) return;
	generateTableList(
		contents, {
		id: 'songs-related-year', 
		title: 'Songs from ' + contents.values[0][contents.columns.indexOf('KNYEAR')],
		rowFormat: ['ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
		actionTitle: 'Refresh',
		actionFunc: function() {
			//max 10 related same year
			query = "SELECT * FROM Song WHERE KNID <> " + window['song-id'];
			query += " AND KNYEAR = '" + window['year'] + "'";
			query += " ORDER BY RANDOM() DESC LIMIT 10";
			if(debugMode) console.log('generateSongRelatedByYear', query);
			queryDb(query, generateSongRelatedByYear);
		}
	});
}

function generateArtistRelated(contents) {
	if(debugMode) console.log('generateArtistRelated', contents);
	if(contents.values.length === 0) return;
	generateTableList(
		contents, {
		id: 'artist-related', 
		title: 'Songs from ' + contents.values[0][contents.columns.indexOf('ArtistTitle')], 
		rowFormat: ['KNYEAR', ' - ', 'SongTitle'], 
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
		actionTitle: contents.values.length >= 10 ? 'Refresh' : null,
		actionFunc: function() {
			//max 10 related, else show max
			query = "SELECT * FROM Song WHERE KNID <> " + window['song-id'];
			query += " AND ArtistID = '" + window['artist-id'] + "'";
			query += " ORDER BY RANDOM() DESC LIMIT 10";
			if(debugMode) console.log('queryArtistRelated', query);
			queryDb(query, generateArtistRelated);
		}
	});
}

function generateReleaseRelated(contents) {
	if(debugMode) console.log('generateReleaseRelated', contents);
	if(contents.values.length === 0) return;
	generateTableList(
		contents, {
		id: 'release-related', 
		title: 'Songs from "' + reduceReleaseTitle(contents.values[0][contents.columns.indexOf('ReleaseTitle')]) + '"',
		rowFormat: ['ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
	});
}

function generateSongFeaturedByArtist(contents) {
	if(debugMode) console.log('generateSongFeaturedByArtist', contents);
	if(contents.values.length === 0) return;
	generateTableList(
		contents, {
		id: 'artist-featured', 
		title: 'Songs featuring ' + contents.values[0][contents.columns.indexOf('ParentArtist')],
		rowFormat: ['KNYEAR', ' - ', 'ArtistTitle', ' - ', 'SongTitle'],
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
	});
}

function queryArtistRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	
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
	// document.querySelector('#songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "ORDER BY RANDOM() DESC LIMIT 5";
	if(debugMode) console.log('generateArtistFeatured', query);
	queryDb(query, generateArtistFeatured);
}

function queryArtistSongs5Years(contents) {
	if(debugMode) console.log('queryArtistSongs5Years', contents);
	generateTableList(
		contents, {
		id: 'artist-songs-5y', 
		title: 'Songs within 5 years',
		rowFormat: ['KNYEAR', ' - ', 'ArtistTitle', ' - ', 'SongTitle'], 
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
	});
}

function queryArtistSongs10Years(contents) {
	if(debugMode) console.log('queryArtistSongs10Years', contents);
	generateTableList(
		contents, {
		id: 'artist-songs-10y', 
		title: 'Songs within 10 years',
		rowFormat: ['KNYEAR', ' - ', 'ArtistTitle', ' - ', 'SongTitle'],
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
	});
}

function generateArtistFeatured(contents) {
	if(debugMode) console.log('generateArtistFeatured', contents);
	if(contents.values.length === 0) return;
	generateTableList(
		contents, {
		id: 'artist-featured', 
		title: 'Songs featuring ' + contents.values[0][contents.columns.indexOf('ParentArtist')],
		rowFormat: ['KNYEAR', ' - ', 'ArtistTitle', ' - ', 'SongTitle'],
		clickFunc: updateSong, 
		rightClickFunc: showContextMenu, 
		rightClickContext: 'related',
	});
}

function queryAwards(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select awards of that song regardless of year
	let query = "SELECT a.KNYEAR, a.AwardTitle, a.ArtistTitle AS 'Artist Title', a.RecipientTitle AS 'Song Title', a.SongID, a.IsWinner AS 'Won' FROM Award a JOIN Song s ON s.ID = a.SongID JOIN (SELECT ar.* FROM Award ar WHERE ar.SongID = " 
	query += row[columnIndexKNID] + ") aref ON aref.KNYEAR = a.KNYEAR AND aref.AwardCode = a.AwardCode " 
	query += "ORDER BY a.KNYEAR, a.ID, a.SortOrder";
	if(debugMode) console.log('queryAwards', query);
	queryDb(query, generateAwards);
}

function queryAwardsByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	
	//select awards of that song regardless of year
	let query = "SELECT a.KNYEAR, a.AwardType, a.AwardTitle, a.ArtistTitle AS 'Artist Title', CASE WHEN AwardType = 'Release' THEN a.RecipientTitle ELSE NULL END AS 'Release Title', CASE WHEN AwardType = 'Song' THEN a.RecipientTitle ELSE NULL END AS 'Song Title', a.SongID, a.IsWinner AS 'Won' FROM Award a WHERE a.KNYEAR = " + row[columnIndexKNYEAR] + " ORDER BY a.KNYEAR, a.ID, a.SortOrder";
	if(debugMode) console.log('queryAwardsByYear', query);
	queryDb(query, generateAwards);
}

function queryAwardsByArtist(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	
	//select awards of that song regardless of year
	let query = "SELECT a.KNYEAR, a.AwardType, a.AwardTitle, a.ArtistTitle AS 'Artist Title', CASE WHEN AwardType = 'Release' THEN a.RecipientTitle ELSE NULL END AS 'Release Title', CASE WHEN AwardType = 'Song' THEN a.RecipientTitle ELSE NULL END AS 'Song Title', a.SongID, a.IsWinner AS 'Won' FROM Award a WHERE a.ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ORDER BY a.KNYEAR, a.ID, a.SortOrder";
	if(debugMode) console.log('queryAwardsByArtist', query);
	queryDb(query, generateAwards);
}

function generateAwards(contents) {
	if(debugMode) console.log('generateAwards', contents);
	
	document.querySelector('#song-awards').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length === 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Awards';
	document.querySelector('#song-awards').appendChild(header);
	
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexAwardTitle = contents.columns.indexOf('AwardTitle');
	let awardTitles = rows
		.map(s => s[columnIndexKNYEAR] + '|' + s[columnIndexAwardTitle])
		.filter((sa, ind, arr) => arr.indexOf(sa) === ind);
	if(debugMode) console.log('awardTitles', awardTitles);
	for(let award of awardTitles)
	{
		let [year, title] = award.split('|');
		let awardRows = rows.filter(r => r[columnIndexKNYEAR] === parseInt(year) && r[columnIndexAwardTitle] === title);
		let columnIndexAwardType = columns.indexOf('AwardType');
		let type = awardRows[0][columnIndexAwardType];
		if(debugMode) console.log('awardRows', { columns, values: awardRows });
		
		let skipColumns = ['KNYEAR', 'AwardType', 'AwardTitle', 'SongID'];
		if(type === 'Artist' || type === 'Song')
			skipColumns.push('Release Title');
		if(type === 'Artist' || type === 'Release')
			skipColumns.push('Song Title');
		
		generateTableByDataWithHeader(
			{ columns, values: awardRows }, {
			id: 'song-awards', 
			skipClear: true, 
			title: 'Awards', 
			skipTitle: true, 
			skipColumns,
			dataId: 'SongID',
			groupColumn: null, 
			titleFormat: ['KNYEAR', 'AwardTitle'], 
			centerContent: true,
			iconColumnName: 'Won',
			iconValueColumnName: 'Won',
			iconId: 'emoji_events',
			iconTooltip: 'Yes',
		});
		document.querySelector('#song-awards').appendChild(document.createElement('br'));
	}
}

function queryRankings(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select ranking of that year of song
	let query = "SELECT s.ID AS KNID, r.KNYEAR, r.RankNo AS 'Rank #', r.SortOrder, s.SongTitle AS 'Song Title', s.ArtistTitle AS 'Artist Title' FROM Ranking r JOIN Song s on r.SongID = s.ID WHERE r.KNYEAR = (SELECT KNYEAR FROM Ranking WHERE SongID = " + row[columnIndexKNID] + ") ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	if(debugMode) console.log('queryRankings', query);
	queryDb(query, generateRanking);
}

function queryRankingsByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	//select ranking of that year of song
	let query = "SELECT s.ID AS KNID, r.KNYEAR, r.RankNo AS 'Rank #', r.SortOrder, s.SongTitle AS 'Song Title', s.ArtistTitle AS 'Artist Title' FROM Ranking r JOIN Song s on r.SongID = s.ID WHERE r.KNYEAR = " + row[columnIndexKNYEAR] + " ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	if(debugMode) console.log('queryRankingsByYear', query);
	queryDb(query, generateRanking);
}

function queryRankingsByArtist(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	//select ranking of that year of song
	let query = "SELECT s.ID AS KNID, r.KNYEAR, r.RankNo AS 'Rank #', r.SortOrder, s.SongTitle AS 'Song Title', s.ArtistTitle AS 'Artist Title' FROM Ranking r JOIN Song s on r.SongID = s.ID WHERE s.ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	if(debugMode) console.log('queryRankingsByArtist', query);
	queryDb(query, generateRankingByArtist);
}

function generateRanking(contents) {
	if(debugMode) console.log('generateRanking', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'song-ranking', 
		skipClear: false, 
		title: 'Song Rankings', 
		skipTitle: false, 
		skipColumns: ['KNID', 'SortOrder', 'KNYEAR'], 
		dataId: 'KNID', 
		groupColumn: 'Rank #',
		titleFormat: null,
		centerContent: false,
		iconColumnName: null,
		iconValueColumnName: null,
		iconId: null,
		iconTooltip: null,
		actionTitle: 'Play All',
		actionFunc: function() {
			let table = this.parentElement.nextSibling;
			let rows = table.querySelectorAll('tr');
			let ids = Array.from(rows).reduce(function (all, current) {
				let id = current.getAttribute('data-id');
				if(id != null)
					all.push(id);
				return all;
			},[]);
			queueSongs(ids);
		},
	});
}

function generateRankingByArtist(contents) {
	if(debugMode) console.log('generateRankingByArtist', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'song-ranking', 
		skipClear: false, 
		title: 'Song Rankings', 
		skipTitle: false, 
		skipColumns: ['KNID', 'SortOrder', 'Artist Title'],
		dataId: 'KNID', 
		groupColumn: 'KNYEAR',
		titleFormat: null,
		centerContent: true,
	});
}

function queryCompilations(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select compilations of that song regardless of year
	let query = "SELECT c.CompilationTitle, c.TrackNumber AS 'Track #', c.SongTitle AS 'Song Title', c.ArtistTitle AS 'Artist Title', c.KNYEAR, c.SongID AS KNID FROM Compilation c JOIN Song s ON s.ID = c.SongID JOIN (SELECT cp.* FROM Compilation cp WHERE cp.SongID = " 
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
	let query = "SELECT c.CompilationTitle, c.TrackNumber AS 'Track #', c.SongTitle AS 'Song Title', c.ArtistTitle AS 'Artist Title', c.KNYEAR, c.SongID AS KNID FROM Compilation c JOIN Song s ON s.ID = c.SongID WHERE c.KNYEAR = " + row[columnIndexKNYEAR] + " ";
	query += "ORDER BY c.KNYEAR, c.CompilationTitle, c.TrackNumber";
	if(debugMode) console.log('queryCompilationsByYear', query);
	queryDb(query, generateCompilations);
}

function queryCompilationsByArtist(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	//select compilations of that song regardless of year
	let query = "SELECT c.CompilationTitle, c.TrackNumber AS 'Track #', c.SongTitle AS 'Song Title', c.ArtistTitle AS 'Artist Title', c.KNYEAR, c.SongID AS KNID FROM Compilation c JOIN Song s ON s.ID = c.SongID WHERE c.ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += "ORDER BY c.KNYEAR, c.CompilationTitle, c.TrackNumber";
	if(debugMode) console.log('queryCompilationsByArtist', query);
	queryDb(query, generateCompilations);
}

function generateCompilations(contents) {
	document.getElementById('song-compilation').innerHTML = '';
	
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length === 0) return;
	
	// let header = document.createElement('h4');
	// header.classList.add('centered');
	// header.innerText = 'Compilations';
	// document.getElementById('song-compilation').appendChild(header);
	
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexCompilationTitle = contents.columns.indexOf('CompilationTitle');
	let compilationTitles = rows.map(s => s[columnIndexCompilationTitle]).filter((sa, ind, arr) => arr.indexOf(sa) === ind);
	if(debugMode) console.log('compilationTitles', compilationTitles);
	
	let index = 0;
	for(let compilationTitle of compilationTitles)
	{
		let compilationRows = rows.filter(r => r[columnIndexCompilationTitle] === compilationTitle);
		if(debugMode) console.log('compilationRows', { columns, values: compilationRows });
		let isArtist = window['mode'] === 'artist';
		
		generateTableByDataWithHeader(
			{ columns, values: compilationRows }, {
			id: 'song-compilation', 
			skipClear: true, 
			title: 'Compilations', 
			skipTitle: index > 0, 
			skipColumns: ['CompilationTitle', 'KNID', 'KNYEAR'],
			dataId: 'KNID',
			groupColumn: 'Track #', 
			titleFormat: ['KNYEAR', 'CompilationTitle'],
			actionTitle: isArtist ? null : 'Play All',
			actionFunc: isArtist ? null : function() {
				let table = this.parentElement.nextSibling;
				let rows = table.querySelectorAll('tr');
				let ids = Array.from(rows).reduce(function (all, current) {
					let id = current.getAttribute('data-id');
					if(id != null)
						all.push(id);
					return all;
				},[]);
				queueSongs(ids);
			},
			});
		
		document.getElementById('song-compilation').appendChild(document.createElement('br'));
		index++;
	}
}

function queryCollection(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	//select compilations of that song regardless of year
	let query = "SELECT c.CollectionTitle, c.TrackNumber AS 'Track #', s.ID AS KNID, s.SongTitle AS 'Song Title' FROM UltimateCollection c JOIN Song s on c.SongID = s.ID WHERE c.Folder = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ORDER BY c.TrackNumber";
	if(debugMode) console.log('queryCollection', query);
	queryDb(query, generateCollection);
}

function generateCollection(contents) {
	if(debugMode) console.log('generateCollection', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'ultimate-collection', 
		skipClear: false, 
		title: 'Artist Collection', 
		skipTitle: false, 
		skipColumns: ['KNID', 'CollectionTitle'], 
		dataId: 'KNID', 
		groupColumn: null,
		titleFormat: ['CollectionTitle'],
		centerContent: true,
		actionTitle: 'Play All',
		actionFunc: function() {
			let table = this.parentElement.nextSibling;
			let rows = table.querySelectorAll('tr');
			let ids = Array.from(rows).reduce(function (all, current) {
				let id = current.getAttribute('data-id');
				if(id != null)
					all.push(id);
				return all;
			},[]);
			queueSongs(ids);
		},
	});
}

function querySOTD(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('ID');
	//select song of the day mentions of that song regardless of year
	let query = "SELECT SUBSTR(a.Date, 1, 4) AS 'Year', case when MIN(a.Date) = MAX(a.Date) THEN MIN(a.Date) ELSE MIN(a.Date) || ' - ' || MAX(a.Date) END AS 'Time Period', COUNT(*) AS 'Count' FROM (SELECT t.* FROM SOTD t JOIN Song s ON s.ID = t.SongID WHERE t.SongID = " + row[columnIndexKNID] + " AND t.IsShortPreview = 0 ORDER BY t.Date, t.TimeOfDay, t.SortOrder) a GROUP BY SUBSTR(a.Date, 1,4)";
	if(debugMode) console.log('querySOTD', query);
	queryDb(query, generateSOTD);
	
	//select awards of that song regardless of year
	query = "SELECT m.KNYEAR AS 'Year', m.Month, m.SongTitle AS 'Song Title', m.ArtistTitle AS 'Artist Title', m.Count, m.SongID as KNID "
	query += "FROM SOTM m JOIN Song s ON s.ID = m.SongID "
	query += "JOIN (SELECT tm.* FROM SOTM tm WHERE tm.SongID = " + row[columnIndexKNID] + ") mref ON mref.KNYEAR = m.KNYEAR ";

	if(debugMode) console.log('querySOTM', query);
	queryDb(query, generateSOTM);
}

function querySOTDByYear(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexStartDate = contents.columns.indexOf('Song Awards Start Date');
	let columnIndexEndDate = contents.columns.indexOf('Song Awards End Date');
	let KNYEAR = rows[0][columnIndexKNYEAR];
	let startDate = rows[0][columnIndexStartDate];
	let endDate = rows[0][columnIndexEndDate];
	//select song of the day mentions of that song regardless of year
	let query = "SELECT COUNT(*) AS 'Rank', t.SongTitle AS 'Song Title', t.ArtistTitle AS 'Artist Title', t.SongID AS KNID FROM SOTD t JOIN Song s ON s.ID = t.SongID ";
	query += "WHERE t.Date BETWEEN " + startDate + " AND " + endDate + " AND t.IsShortPreview = 0 ";
	query += "GROUP BY t.SongTitle, t.ArtistTitle, t.SongID ORDER BY COUNT(*) DESC LIMIT 20";
	if(debugMode) console.log('querySOTDByYear', query);
	queryDb(query, generateTopSOTD);
	
	//select awards of that song regardless of year
	query = "SELECT m.KNYEAR AS 'Year', m.Month, m.SongTitle AS 'Song Title', m.ArtistTitle AS 'Artist Title', m.Count, m.SongID AS KNID "
	query += "FROM SOTM m JOIN Song s ON s.ID = m.SongID WHERE m.KNYEAR = " + KNYEAR;
	if(debugMode) console.log('querySOTMByYear', query);
	queryDb(query, generateSOTM);
}

function generateSOTD(contents) {
	if(debugMode) console.log('generateSOTD', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'song-sotd', 
		skipClear: false, 
		title: 'Song Mentions', 
		skipTitle: false, 
		skipColumns: ['CompilationTitle', 'KNID'], 
		dataId: 'KNID', 
		groupColumn: 'Year',
		titleFormat: null,
		centerContent: true,
	});
}

function generateTopSOTD(contents) {
	if(debugMode) console.log('generateTopSOTD', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'song-sotd', 
		skipClear: false, 
		title: 'Song of the Day Top Rankings',
		skipTitle: false, 
		skipColumns: ['Year', 'KNID'], 
		dataId: 'KNID', 
		groupColumn: 'Rank',
		titleFormat: null,
		centerContent: true,
	});
}

function generateSOTM(contents) {
	if(debugMode) console.log('generateSOTM', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'song-sotm', 
		skipClear: false, 
		title: 'Monthly Mentions', 
		skipTitle: false, 
		skipColumns: ['Year', 'KNID'], 
		dataId: 'KNID', 
		groupColumn: 'Month',
		titleFormat: null,
		centerContent: true,
	});
}

function queryAnalysis(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexData = contents.columns.indexOf('KNYEAR');
	let KNYEAR = rows[0][columnIndexData];

	//Vocal Popularity Survey
	let query = "SELECT 'All' as 'Category', COUNT(VocalCode) || ' Songs' as 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode <> '' UNION ALL SELECT res.Category, res.Count || ' (' || printf('%.2f', (100.00 * res.Count / (SELECT COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode <> ''))) || '%)' AS 'Count (%)' FROM (SELECT 'Male Solo' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'M' UNION ALL SELECT 'Female Solo' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'F' UNION ALL SELECT 'Male Duo' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'MM' UNION ALL SELECT 'Female Duo' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND VocalCode = 'FF' UNION ALL SELECT 'Combined Duo' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND (VocalCode = 'MF' or VocalCode = 'FM') UNION ALL SELECT 'Trio' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND (VocalCode = 'MMM' or VocalCode = 'FFF') UNION ALL SELECT 'Quartet or More' as 'Category', COUNT(VocalCode) as 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND LENGTH(VocalCode) > 3) res";
	
	if(debugMode) console.log('generateVocalPopularity', query);
	queryDb(query, generateVocalPopularity);
	
	//Singles B-side Survey
	query = "SELECT 'All Singles' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 ";
	query += "UNION ALL SELECT '1 Track' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 1 ";
	query += "UNION ALL SELECT '2 Tracks' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2 ";
	query += "UNION ALL SELECT '3 Tracks' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2 ";
	query += "UNION ALL SELECT '2 Tracks (B-side)' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 AND TracksTotal = 2 AND TracksSelected > 1 ";
	query += "UNION ALL SELECT '3 Tracks (B-side)' AS 'Category', COUNT(ID) AS 'Count' FROM Release WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = KNYEAR AND UPPER(Category) = 'SINGLE' AND IsReviewed = 1 AND TracksTotal > 2 AND TracksSelected > 1 ";
	query += "UNION ALL SELECT 'Singles Reviewed' AS 'Category', COUNT(ID) AS 'Count' FROM Review WHERE KNYEAR = " + KNYEAR + " ";
	
	if(debugMode) console.log('generateBSide', query);
	queryDb(query, generateBSide);
	
	//Song Language Survey
	query = "SELECT 'All' AS 'Language', COUNT(LanguageCode) || ' Songs' as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + " UNION ALL SELECT res.Language, res.Count || ' (' || printf('%.2f', (100.00 * res.Count / (SELECT COUNT(LanguageCode) as 'Count (%)' from Song WHERE KNYEAR = " + KNYEAR + "))) || '%)' as 'Count (%)' FROM (SELECT 'English' AS 'Language', COUNT(LanguageCode) as 'Count' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'EN' UNION ALL SELECT 'Chinese' AS 'Language', COUNT(LanguageCode) as 'Count' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'CH' UNION ALL SELECT 'Japanese' AS 'Language', COUNT(LanguageCode) as 'Count' from Song WHERE KNYEAR = " + KNYEAR + " AND LanguageCode = 'JP') res";

	if(debugMode) console.log('generateSongLaguage', query);
	queryDb(query, generateSongLaguage);
	
	//Year of Release Survey
	query = "SELECT 'All' AS 'Release Year', COUNT(ReleaseYear) || ' Songs' AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " UNION ALL SELECT res.ReleaseYear AS 'Release Year', res.Count || ' (' || printf('%.2f', (100.00 * res.Count / (SELECT COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + "))) || '%)' AS 'Count (%)' FROM (SELECT MIN(ReleaseYear) || '-' || MAX(ReleaseYear) AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear < " + KNYEAR + " - 3 UNION ALL SELECT " + KNYEAR + " - 3 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 3 UNION ALL SELECT " + KNYEAR + " - 2 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 2 UNION ALL SELECT " + KNYEAR + " - 1 AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + " - 1 UNION ALL SELECT " + KNYEAR + " AS 'ReleaseYear', COUNT(ReleaseYear) AS 'Count (%)' FROM Song WHERE KNYEAR = " + KNYEAR + " AND ReleaseYear = " + KNYEAR + ") res";

	if(debugMode) console.log('generateYearOfRelease', query);
	queryDb(query, generateYearOfRelease);
	
	//Anime Song Survey
	query = "SELECT 'All' AS 'Song Type', COUNT(s.VocalCode) || ' Songs' AS 'Count (%)' FROM Song s WHERE s.KNYEAR = " + KNYEAR + " AND s.VocalCode <> '' UNION ALL SELECT res.SongType AS 'Song Type', res.Count || ' (' || printf('%.2f', (100.00 * res.Count / (SELECT COUNT(s.VocalCode) AS 'Count (%)' FROM Song s WHERE s.KNYEAR = " + KNYEAR + " AND s.VocalCode <> ''))) || '%)' AS 'Count (%)' FROM (SELECT 'Anime Songs' AS 'SongType', COUNT(ts.Type) AS 'Count' FROM Song s JOIN Credit ts on s.ID = ts.SongID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') UNION ALL SELECT 'Anime Theme Songs' AS 'SongType', COUNT(ts.Type) AS 'Count' FROM Song s JOIN Credit ts on s.ID = ts.SongID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.Type = 'Opening' OR ts.Type = 'Ending' OR ts.Type = 'Theme') UNION ALL SELECT 'Anime Character/Insert Songs' AS 'SongType', COUNT(ts.Type) AS 'Count' FROM Song s JOIN Credit ts on s.ID = ts.SongID WHERE s.KNYEAR = " + KNYEAR + " AND s.Genre IN ('Anime','Soundtrack','Game') AND (ts.Type <> 'Opening' AND ts.Type <> 'Ending' AND ts.Type <> 'Theme')) res";

	if(debugMode) console.log('generateAnimeSongs', query);
	queryDb(query, generateAnimeSongs);
	
	//Song Appetite Survey
	query = "SELECT 'January' AS 'Month', COUNT(ID) AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0201 UNION ALL SELECT 'February' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".02.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0301 UNION ALL SELECT 'March' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".03.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0401 UNION ALL SELECT 'April' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".04.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0501 UNION ALL SELECT 'May' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".05.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0601 UNION ALL SELECT 'June' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".06.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0701 UNION ALL SELECT 'July' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".07.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0801 UNION ALL SELECT 'August' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".08.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "0901 UNION ALL SELECT 'September' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".09.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "1001 UNION ALL SELECT 'October' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".10.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "1101 UNION ALL SELECT 'November' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".11.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + " AND CAST(REPLACE(DateCreated, '.', '') AS INT) < " + KNYEAR + "1201 UNION ALL SELECT 'December' AS 'Month', COUNT(ID) || ' (+' || (SELECT COUNT(ID) FROM Song WHERE KNYEAR = " + KNYEAR + " AND DateCreated LIKE '" + KNYEAR + ".12.%') || ')' AS 'Count' FROM Song WHERE KNYEAR = " + KNYEAR + "";

	if(debugMode) console.log('generateSongAppetite', query);
	queryDb(query, generateSongAppetite);
	
	//Release by Artist Type
	query = "SELECT DISTINCT CASE ArtistCode WHEN 'BD' THEN 'Independent Band' WHEN 'ID' THEN 'Idol Group' WHEN 'AG' THEN 'Anime Voice Actor Group' WHEN 'AS' THEN 'Anime Voice Actor(s)' WHEN 'CL' THEN 'Collaboration' WHEN 'SS' THEN 'Singer-Songwriter' WHEN 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', Count(a.ArtistCode) AS 'Count' FROM Release s JOIN (SELECT DISTINCT ArtistTitle, ArtistCode from Artist) a ON s.ReleaseArtistTitle = a.ArtistTitle WHERE s.KNYEAR = " + KNYEAR + " AND a.ArtistCode <> '' GROUP BY a.ArtistCode ORDER BY Count(a.ArtistCode) DESC";

	if(debugMode) console.log('generateReleaseByArtistType', query);
	queryDb(query, generateReleaseByArtistType);

	//Release by Release Type
	query = "SELECT r.Type || ' ' || r.Category AS 'Release Type', COUNT(r.Type) AS 'Count' FROM Release r WHERE r.ID IN (SELECT DISTINCT ReleaseID FROM Song WHERE KNYEAR = " + KNYEAR + ") GROUP BY r.Category, r.Type";

	if(debugMode) console.log('generateReleaseByReleaseType', query);
	queryDb(query, generateReleaseByReleaseType);
}

function generateVocalPopularity(contents) {	
	if(debugMode) console.log('generateVocalPopularity', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'vocal-popularity', 
		skipClear: false, 
		title: 'Vocal Types', 
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateBSide(contents) {	
	let columns = contents.columns;
	let rows = contents.values;
	let total = rows[0][1];
	if(contents.length === 0 || total === 0) return;
	
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
	
	let skipColumns = [];
	for(let r = 0; r < rows.length; r++)
	{
		// let rowVal = row[r];
		// if(!rowVal || rowVal.length === 0) continue;
		// if(skipColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = rows[r][0];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = r === 0 ? total + ' Singles' : rows[r][1];
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	
	document.querySelector('#single-bside').innerHTML = '';
	document.querySelector('#single-bside').appendChild(header);
	document.querySelector('#single-bside').appendChild(table);
}

function generateSongLaguage(contents) {
	if(debugMode) console.log('generateSongLaguage', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'song-language', 
		skipClear: false, 
		title: 'Languages', 
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateYearOfRelease(contents) {
	if(debugMode) console.log('generateYearOfRelease', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'release-year', 
		skipClear: false, 
		title: 'Release Year', 
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateAnimeSongs(contents) {	
	if(debugMode) console.log('generateAnimeSongs', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'anime-songs', 
		skipClear: false, 
		title: 'Anime Songs',
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateSongAppetite(contents) {
	if(debugMode) console.log('generateSongAppetite', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'song-appetite',
		skipClear: false, 
		title: 'Song Count by Month',
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateReleaseByArtistType(contents) {
	if(debugMode) console.log('generateReleaseByArtistType', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'release-artisttype', 
		skipClear: false, 
		title: 'Release By Artist Type',
		skipTitle: false, 
		skipColumns: [],
	});
}

function generateReleaseByReleaseType(contents) {
	if(debugMode) console.log('generateReleaseByReleaseType', contents);	
	generateTableByDataWithHeader(
		contents, {
		id: 'release-releasetype', 
		skipClear: false, 
		title: 'Release By Type',
		skipTitle: false, 
		skipColumns: [],
	});
}

function queryArtistAnalysis(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexData = contents.columns.indexOf('ArtistTitle');
	let artist = rows[0][columnIndexData];

	//Song Count by Year
	let query = "select KNYEAR as 'Year', count(*) as 'Count' from Song where ArtistTitle = '"+addQuotationInSQLString(artist)+"' group by KNYEAR";

	if(debugMode) console.log('generateSongCountByYear', query);
	queryDb(query, generateSongCountByYear);
	
	//Most Popular Songs
	query = "select ROW_NUMBER() OVER (ORDER BY Total desc) AS 'Rank', KNYEAR as 'Year', ID, SongTitle as 'Song Title' from ( ";
	query += "select s.ID, s.SongTitle, s.KNYEAR ";
	query += ", (select count(*) from SOTD where sotd.SongID = s.ID) as 'SOTD Mentions (x1)' ";
	query += ", (select 2*count(*) from SOTM where sotm.SongID = s.ID) as 'SOTM Mentions (x2)' ";
	query += ", (select 3*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 0) as 'Awards Nominated (x3)' ";
	query += ", (select 5*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 1) as 'Awards Won (x5)' ";
	query += ", (select 10*count(*) from Ranking r where r.SongID = s.ID) as 'Ranking Top 20 (x10)' ";
	query += ", (select 20*count(*) from Ranking r where r.SongID = s.ID and r.RankNo = 1) as 'Ranking Top 1 (x20)' ";
	query += ", (select 3*count(*) from Compilation c where c.SongID = s.ID and c.SeriesTitle <> 'GOLD') as 'Compilations Featured (x3)' ";
	query += ", ( ";
	query += "(select count(*) from SOTD where sotd.SongID = s.ID) + ";
	query += "(select 2*count(*) from SOTM where sotm.SongID = s.ID) + ";
	query += "(select 3*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 0) + ";
	query += "(select 5*count(*) from Award aw where aw.SongID = s.ID and aw.isWinner = 1) + ";
	query += "(select 10*count(*) from Ranking r where r.SongID = s.ID) + ";
	query += "(select 20*count(*) from Ranking r where r.SongID = s.ID and r.RankNo = 1) + ";
	query += "(select 3*count(*) from Compilation c where c.SongID = s.ID and c.SeriesTitle <> 'GOLD') ";
	query += ") as 'Total' ";
	query += "from Song s ";
	query += "where s.ArtistTitle = '"+addQuotationInSQLString(artist)+"' and Total > 0 order by Total desc, KNYEAR desc limit 5 ";
	query += ")";

	if(debugMode) console.log('generatePopularSongs', query);
	queryDb(query, generatePopularSongs);
}

function generatePopularSongs(contents) {
	if(debugMode) console.log('generatePopularSongs', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'popular-songs', 
		skipClear: false, 
		title: 'Most Popular Songs', 
		skipTitle: false, 
		skipColumns: ['ID'],
		dataId: 'ID',
		groupColumn: null,
		titleFormat: null,
		centerContent: true,
	});
}

function generateSongCountByYear(contents) {
	if(debugMode) console.log('generateArtistReleaseInfo', contents);
	generateTableByDataWithHeader(
		contents, {
		id: 'song-appetite', 
		skipClear: false, 
		title: 'Song Count by Year', 
		skipTitle: false, 
		skipColumns: [],
		dataId: null,
		groupColumn: null,
		titleFormat: null,
		centerContent: true,
		iconColumnName: 'Count',
		iconValueColumnName: 'Count',
		iconId: 'music_note',
	});
}

function generateTabs() {
	document.querySelector('#tab-buttons').innerHTML = '';
	
	let tabNames = [];
	for(let tab of document.getElementsByClassName('tab'))
	{
		let tabItem = document.createElement('button');
		tabItem.id = 'button-' + tab.id;
		tabItem.classList.add('tab-button');
		tabItem.innerText = tab.getAttribute('data-name');
		tabItem.addEventListener('click', function() {
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

function updateQueue(next) {
	if(window['mode'] != 'song') return;
	if(window['playing'] === null) window['playing'] = 0;
	else window['playing'] = next ?? window['playing'] + 1;
	if(window['playlist'].length > 0 && window['playing'] >= window['playlist'].length) window['playing'] = window['playlist'].length - 1;
	if(debugMode) console.log('updateQueue', window['playing']);
}

function updateQueueButtons() {
	document.querySelector('#queue-options').style.display = window['shuffle-mode'] ? '' : 'none';
	window['autoplay'] = document.querySelector('#autoplay').innerText === 'music_note';
}

function scrollToTop() {
    document.querySelector('#tab-list').scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
}

//--QUEUE FUNCTIONS--//
function clearModules() {
	for(let tab of document.getElementsByClassName('module'))
	{
		tab.innerHTML = '';
	}
}

function updateSong() {	
	window['mode'] = 'song';
	let playlistOpen = document.querySelector('#song-queue').innerText === 'format_indent_increase';
	hideContextMenus(true);
	clearModules();
	
	let id = parseInt(this.getAttribute('data-id'));
	let query = "SELECT * FROM Song WHERE ID = " + id;
	if(debugMode) console.log('updateSong', query);
	queryDb(query, updateOptions);
	// window['playlist'].push(id.toString());
	if(playlistOpen) // from playlist selection
	{
		window['playing'] = window['playlist'].indexOf(this.getAttribute('data-id')) - 1;
		if(document.querySelector('#song-queue') != null)
			document.querySelector('#song-queue').innerText = 'format_align_justify';
	}
	else if(!playlistOpen && window['playlist'][window['playlist'].length - 1] != id)
	{
		window['playlist'].push(id.toString());
		updateQueue(window['playlist'].length - 1);
	}
}

function updateYear() {
	window['mode'] = 'year';
	document.querySelector('#search').value = '';
	document.querySelector('#options').value = '';
	
	let year = this.getAttribute('data-year');
	let query = "SELECT DISTINCT KNYEAR FROM SongAwardsPeriod WHERE KNYEAR = " + year;
	if(debugMode) console.log('updateYear', query);
	queryDb(query, generateModules);
	
	//initial query for options
	query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE KNYEAR = " + year;
	// if(isMobile())
		// query += " LIMIT 100";
	queryDb(query, function(contents) {
		updateOptions(contents);
		document.querySelector('#options').disabled = true;
		document.querySelector('#search').disabled = false;
	});
}

function updateArtist() {
	window['mode'] = 'artist';
	document.querySelector('#search').value = '';
	document.querySelector('#options').value = '';
	
	let artist = this.getAttribute('data-artist');
	let query = "SELECT ArtistTitle, ArtistTitle AS 'Artist Title' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(artist) + "'";
	if(debugMode) console.log('updateArtist', query);
	queryDb(query, generateModules);
	
	//initial query for options
	query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(artist) + "'";
	if(isMobile())
		query += " LIMIT 100";
	queryDb(query, updateOptions);
}

function queueSongs(ids) {
	window['playlist'] = ids;
	window['playing'] = -1;
	window['mode'] = 'song;
	if(!window['autoplay']) document.querySelector('.autoplay').click();
	
	let optQuery = "SELECT * FROM Song WHERE KNID = ";
	optQuery += window['playlist'][window['playing'] + 1];
	if(debugMode) console.log('queueSongs', optQuery);
	queryDb(optQuery, updateOptions);
}

//--TABLE FUNCTIONS--//
function generateTableAsColumnRows(contents, parameters) {
	let { 
		id, 
		title, 
		skipTitle,
		skipColumns = [],
		actionTitle, 
		actionFunc = null,
	} = parameters
	document.getElementById(id).innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length === 0) return;
	
	if(debugMode) console.log('generateTableAsColumnRows', id);
	if(!id || !contents.columns || !contents.values) return;
	
	//header
	let headerDiv = document.createElement('div');
	if(!skipTitle || (actionTitle != null && actionTitle.length > 0))
		headerDiv.style.height = '1.4em';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = title || '';
	headerDiv.appendChild(header);
	
	if(actionTitle != null && actionTitle.length > 0)
	{
		let action = document.createElement('h6');
		action.classList.add('centered');
		action.classList.add('action');
		action.style.cursor = 'pointer';
		action.innerText = actionTitle;
		if(actionFunc != null && typeof actionFunc === 'function')
			action.addEventListener('click', actionFunc);
		
		headerDiv.style.position = 'relative';
		headerDiv.classList.add('centered');
		headerDiv.appendChild(action);
	}
	
	document.getElementById(id).appendChild(headerDiv);
	
	//table
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let row = rows[0];
	for(let r = 0; r < columns.length; r++)
	{
		let rowVal = row[r];
		if(!rowVal || rowVal.length === 0) continue;
		if(skipColumns.includes(columns[r])) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerHTML = columns[r];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerHTML = rowVal;
		if(rowVal.toString().includes('https://') || rowVal.toString().includes('http://'))
			td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + getDomainViaUrl(rowVal) + '</a>';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById(id).appendChild(table);
}

function generateTableList(contents, parameters) {
	let { id, title, rowFormat, clickFunc, rightClickFunc, rightClickContext, scrollable, actionTitle, actionFunc } = parameters
	document.getElementById(id).innerHTML = '';
	if(debugMode) console.log('generateTableList', id);
	if(!id || !rowFormat || !contents?.columns || !contents?.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	if(rows.length < 1) return;
	
	//header
	let headerDiv = document.createElement('div');
	if(actionTitle != null && actionTitle.length > 0)
		headerDiv.style.height = '1.4em';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = title;
	headerDiv.appendChild(header);
	
	if(actionTitle != null && actionTitle.length > 0)
	{
		headerDiv.style.position = 'relative';
		headerDiv.style.maxWidth = '680px';
		headerDiv.style.margin = 'auto';
		let action = document.createElement('h6');
		action.classList.add('centered');
		action.classList.add('action');
		action.classList.add('not-selectable');
		action.innerText = actionTitle;
		if(actionFunc != null && typeof actionFunc === 'function')
			action.addEventListener('click', actionFunc);
		
		// if(document.querySelector('#' + id + ' .action') === null)
			headerDiv.appendChild(action);
	}
	
	document.getElementById(id).appendChild(headerDiv);
	
	//table
	let container = document.createElement('div');
	if(scrollable)
		container.classList.add('scrollable');
	container.classList.add('content-box');
	
	let table = document.createElement('table');
	if(!scrollable)
		table.classList.add('list');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	for(let row of rows)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		if(columnIndexKNID < 0) return;
		
		let parts = [];
		for(let format of rowFormat)
		{
			if(contents.columns.indexOf(format) >= 0)
				parts.push(row[contents.columns.indexOf(format)]);
			else
				parts.push(format);
		}
	
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		if(clickFunc) tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.addEventListener('click', clickFunc);
		tc.setAttribute('data-context', rightClickContext);
		tc.addEventListener('contextmenu', rightClickFunc);
		tc.innerText = parts.join('');
		
		tr.appendChild(tc);

		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	container.appendChild(table);
	document.getElementById(id).appendChild(container);
}

function generateTableByDataWithHeader(contents, parameters) {
	let {
		id, 
		skipClear, 
		title, 
		skipTitle, 
		skipColumns = [], 
		dataId = 'KNID',
		groupColumn = 'Rank #', 
		titleFormat = [], 
		centerContent, 
		iconColumnName, 
		iconValueColumnName, 
		iconId, 
		iconTooltip, 
		actionTitle, 
		actionFunc = null, 
	} = parameters
	if(!skipClear) document.getElementById(id).innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length === 0) return;
	
	if(debugMode) console.log('generateTableAsColumnRows', id);
	let headerDiv = document.createElement('div');
	if(!skipTitle || (actionTitle != null && actionTitle.length > 0))
		headerDiv.style.height = '1.4em';
	
	if(!skipTitle) {
		let header = document.createElement('h4');
		header.classList.add('centered');
		header.innerText = skipTitle ? '' : title;
		headerDiv.appendChild(header);
	}
	
	if(actionTitle != null && actionTitle.length > 0)
	{
		let action = document.createElement('h6');
		action.classList.add('centered');
		action.classList.add('action');
		action.style.cursor = 'pointer';
		action.innerText = actionTitle;
		if(actionFunc != null && typeof actionFunc === 'function')
			action.addEventListener('click', actionFunc);
		
		headerDiv.style.position = 'relative';
		headerDiv.classList.add('centered');
		headerDiv.appendChild(action);
	}
	
	document.getElementById(id).appendChild(headerDiv);
	
	//table
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	if(centerContent) table.classList.add('centered-text');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	table.classList.add('bordered');
	
	let tbody = document.createElement('tbody');
	
	//title
	if(titleFormat != null && titleFormat.length > 0)
	{
		let parts = [];
		for(let format of titleFormat)
		{
			if(contents.columns.indexOf(format) >= 0)
				parts.push(rows[0][contents.columns.indexOf(format)]);
		}
		
		let ttr = document.createElement('tr');
		
		let th = document.createElement('th');
		th.classList.add('table-title');
		th.setAttribute('colspan', columns.length - skipColumns.filter(sc => columns.indexOf(sc)).length);
		th.innerText = parts.join(' - ');
		ttr.appendChild(th);
		
		tbody.appendChild(ttr);
		
	}
	
	//header
	let tr = document.createElement('tr');
	tr.classList.add('no-highlight');
	for(let column of columns)
	{
		if(skipColumns.indexOf(column) < 0)
		{
			let th = document.createElement('th');
			th.innerText = column;
			tr.appendChild(th);
		}
	}
	tbody.appendChild(tr);	
	
	//rows
	let rank = undefined;
	for(let row of rows)
	{		
		let columnIndexKNID = contents.columns.indexOf(dataId);
		let columnIndexRankNo = contents.columns.indexOf(groupColumn);
		
		let tr = document.createElement('tr');
		tr.setAttribute('data-id', row[columnIndexKNID] ?? 0);
		if(document.querySelector('#options').value.replace(categoryIcons[2], '') === row[columnIndexKNID]) {
			tr.classList.add('highlight');
			tr.classList.add('not-selectable');
			tr.addEventListener('active', onHoverTableRow);
		}
		else if(row[columnIndexKNID]) {
			tr.style.cursor = 'pointer';
			tr.addEventListener('click', updateSong);
			tr.addEventListener('mouseover', onHoverTableRow);
			tr.addEventListener('mouseout', onHoverTableRow);
		}
		tr.addEventListener('touchstart', onHoverTableRow);
		tr.addEventListener('touchend', onHoverTableRow);
		
		for(let col = 0; col < columns.length ; col++)
		{
			let columnName = columns[col];
			if(skipColumns.indexOf(columnName) < 0)
			{
				// if grouping, need to follow row index
				if(columnName === groupColumn)
				{
					if(row[columnIndexRankNo] != rank)
					{
						let span = rows.filter(r => r[columnIndexRankNo] === row[columnIndexRankNo]).length;
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
					if(iconTooltip) td.title = iconTooltip;
					td.appendChild(columnName === iconColumnName ? generateCellValue(columns, row, columnName, iconValueColumnName, iconId) : generateCellValue(columns, row, columnName));
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

function generateCellValue(columns, row, textColumn, iconColumn, iconId) {	
	let cell = document.createElement('span');
	cell.style.backgroundColor = 'transparent';
	
	let cellValue = row[columns.indexOf(textColumn)];
	let iconValue = row[columns.indexOf(iconColumn)];
	let iconOnly = textColumn === iconColumn;
	
	let textSpan = document.createElement('span');
	textSpan.style.paddingRight = '3px';
	if(!iconOnly) {
		textSpan.innerText = cellValue;	
		textSpan.title = cellValue;
	}
	cell.appendChild(textSpan);
	
	if(parseInt(iconValue))
	{
		let iconSpan = document.createElement('span');
		
		for(let i = 0; i < parseInt(iconValue); i++)
		{
			let icon = document.createElement('span');
			icon.classList.add('material-icons');
			icon.innerText = iconId;
			iconSpan.appendChild(icon);
		}
		
		cell.appendChild(iconSpan);
	}
	
	return cell;
}

function onHoverTableRow() {
	let titleCells = this.parentNode.getElementsByClassName('table-title').length;
	let columns = this.parentNode.getElementsByTagName('th').length - (titleCells > 0 ? titleCells : 0); //estimate
	let rowCells = this.getElementsByTagName('td');
	let spanRow = findTableSiblingRow(this, columns);
	let spanCells = spanRow.getElementsByTagName('td');
	
	if(rowCells.length + 1 === spanCells.length && spanCells[0].rowSpan != undefined && !spanRow.classList.contains('not-selectable'))
		spanCells[0].classList.toggle('highlight');
	
	for(let cell of rowCells)
	{
		cell.classList.toggle('highlight');
	}
}

function findTableSiblingRow(row, columns) {
	let returnRow = row;
	while(returnRow.childNodes.length < columns && returnRow.childNodes.length <= row.childNodes.length)
	{
		returnRow = returnRow.previousSibling;
	}
	return returnRow;
}

//--HELPER FUNCTIONS-//
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

function getDomainViaUrl(url) {
	if(url)
	{
		if(url.toLowerCase().includes('uta-net.com')) return 'Uta-Net';
		if(url.toLowerCase().includes('utaten.com')) return 'UtaTen';
		if(url.toLowerCase().includes('youtube.com')) return 'YouTube';
		if(url.toLowerCase().includes('youtu.be')) return 'YouTube';
	}
	return url;
}

function updateMediaSession(session) {
	if(debugMode) 
		console.log('updateMediaSession', session);
	//update MediaSession API
	try
	{
		if (session && navigator && 'mediaSession' in navigator) {
			var meta = navigator.mediaSession.metadata;
			navigator.mediaSession.metadata = new MediaMetadata(session);
			navigator.mediaSession.setActionHandler("nexttrack", skipSong);
			if(debugMode) 
				console.log('metadata', navigator.mediaSession.metadata.toString());
		}
	}
	catch
	{
		console.error('updateMediaSession: update failed');
	}	
}

//--CONTEXT MENU--//
function showContextMenu() {
	event.preventDefault();
	event.stopPropagation();
    document.addEventListener('click', hideContextMenus);
	
	let box = document.body.getBoundingClientRect();
    let x = event.clientX - box.left;
    let y = event.clientY - box.top - document.querySelector('#song-queue').getBoundingClientRect().height;
	
	let menu = document.querySelector('.context');
    menu.style.top = y + 'px';
    menu.style.left = 0;
	menu.style.margin = 'auto';
	menu.style.right = 0;
	menu.classList.remove('hidden');	
	menu.innerHTML = '';
		
	// console.log(event.target.getAttribute('context'));
	switch(event.target.getAttribute('data-context'))
	{
		case 'related':
			menu.appendChild(showAddQueueContextMenu(this.getAttribute('data-id')));
			break;
		case 'playlist':
			if(event.target.innerText === 'format_indent_increase') {
				hideContextMenus(true);
				event.target.innerText = 'format_align_justify';
			}
			else {
				menu.appendChild(showPlaylist());
				document.querySelector('.playlist .highlight')?.scrollIntoView();
				event.target.innerText = 'format_indent_increase';
			}
			break;
	}
	
	if(y + menu.getBoundingClientRect().height + 80 >= window.innerHeight)
	{
		menu.style.top = (y - menu.getBoundingClientRect().height) + 'px';
		if(y - menu.getBoundingClientRect().height < 0)
			menu.style.top = 0;
	}
	
}

function showAddQueueContextMenu(id) {
	let submenu = document.createElement('div');
	submenu.classList.add('related');
	
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
	else if(window['playlist'].length === 0)
	{
		let item = document.createElement('div');
		item.classList.add('tag');
		item.innerText = 'No items';
		item.addEventListener('click', function() {
			hideContextMenus(true);
		});
		submenu.appendChild(item);
	}
	
	return submenu;
}

function renderPlaylistItems(list) {
	let submenu = document.createElement('div');
	submenu.classList.add('playlist');
	
	let playing = window['playlist'][window['playing']];
	for(let listItem of list.values)
	{
		let item = document.createElement('div');
		item.classList.add('tag');
		if(window['playlist'].indexOf(listItem[0].toString()) === window['playing']) // if playing as ID of item
			item.classList.add('highlight');
		item.setAttribute('data-id', listItem[0]);
		item.innerText = listItem[1];
		item.addEventListener('click', updateSong);
		submenu.appendChild(item);
	}
	return submenu;
}

function clearPlaylist() {
	event.preventDefault();
	
	if(confirm('Clear Playlist?'))
	{
		// clear all but playing
		window['playlist'] = window['playlist'].slice(window['playing'], window['playing'] + 1);
		// assume after clear, only song in playlist
		window['playing'] = 0;
		
		hideContextMenus(true);
	}
}

function hideContextMenus(forced) {
	document.removeEventListener('click', hideContextMenus);
	if(document.querySelector('#song-queue') != null)
		document.querySelector('#song-queue').innerText = 'format_align_justify';	
	
	let contextOpen = false;
	let menu = document.querySelector('.context');
	if (typeof forced === 'boolean' && forced === true) {
		menu.classList.add('hidden');
		contextOpen = true;
	}
    else if (!menu.contains(event.target)) {
		menu.classList.add('hidden');
		contextOpen = true;
	}
	return contextOpen;
}

//--TEST PLAYER-//
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
