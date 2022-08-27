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

//--EVENTS--//
function setKeyUp() {
	// space: play/pause when not focus on player
	if (event.keyCode === 32 && document.getElementById('player') != null 
	&& ['player', 'search'].indexOf(document.activeElement.id) < 0) {
		event.preventDefault();
		if(document.getElementById('player').paused)
			document.getElementById('player').play();
		else
			document.getElementById('player').pause();
	}
	// shift: combine with shuffle to add 10 songs to queue
	if (event.keyCode === 16) {
		event.preventDefault();
		window['shifted'] = false;
	}
	return false;
}

function setKeyDown() {
	// shift: combine with shuffle to add 10 songs to queue
	if (event.keyCode === 16) {
		event.preventDefault();
		window['shifted'] = true;
	}
	// space: play/pause and prevent scroll
	if(event.keyCode === 32 && document.activeElement == document.body)
		event.preventDefault();
		
	return false;
}

function setTabs() {
	let isWidescreen = window.innerWidth >= 960;
	let homePageVisible = document.getElementById('tab-homepage').style.display != 'none';
	
	//responsive module display	
	let totalModules = Math.round(window.innerWidth / widescreenAverageModuleSize);
	if(debugMode) console.log('totalModules', totalModules);
	
	for(let tab of document.getElementsByClassName('tab'))
	{
		let hasModules = Array.from(tab.childNodes).filter(c => c.childNodes.length > 0).length > 0;
		if(debugMode) console.log('hasModules', tab.id, hasModules);
		let tabButton = document.getElementById('button-' + tab.id);
		if(tabButton != null) //button controls on mobile
		{
			tabButton.style.cursor = hasModules ? 'pointer' : '';
			tabButton.disabled = !hasModules;
		}

		for(let module of tab.getElementsByClassName('module')) //remove padding if no elements
		{
			module.style.padding = hasModules ? '' : 0;
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
	
	document.getElementById('tab-buttons').style.display = isWidescreen ? 'none' : '';
	document.getElementById('tab-list').style.height = window.innerHeight - Array.from(document.getElementsByClassName('calc')).reduce((total, current) => { return total + current.offsetHeight; }, 100) + 'px';
	if (debugMode) console.log('containerHeight', document.getElementById('tab-list').style.height);
	
	document.getElementById('search').style.width = homePageVisible ? '100%' : (document.getElementById('options').getBoundingClientRect().width - 40) + 'px';
	document.getElementById('search-buttons').style.display = homePageVisible ? 'none' : '';
	
	hideContextMenus(true);
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
	let search = document.getElementById('search').value.split(' - ');
	if(search.length == 2)
	{
		navigator.clipboard.writeText(search[1] + '\t' + search[0]);
	}
	else
	{
		navigator.clipboard.writeText(search[0]);
	}
	document.getElementById('copy').innerText = 'done';
	document.getElementById('copy').style.cursor = 'none';
	setTimeout( function() { 
		document.getElementById('copy').innerText = 'content_copy'; 
		document.getElementById('copy').style.cursor = '';
	}, 2000);
}

function clearSearch() {
	document.getElementById('music').innerHTML = '';
	document.getElementById('search').value = '';
	document.getElementById('tab-homepage').style.display = '';
	document.getElementById('search-buttons').style.display = 'none';
	document.getElementById('search').style.width = '100%';
	document.getElementById('tab-buttons').innerHTML = '';
	document.getElementById('cover').style.display = 'none';
	for(let tab of document.getElementsByClassName('module'))
	{
		tab.innerHTML = '';
	}
	resetQueueView();
	generateHomepage();
}

function toggleAutoplay() {
	window['autoplay-select'] = !window['autoplay-select'];
	document.querySelector('.autoplay').innerText = window['autoplay-select'] ? 'music_note' : 'music_off';
}

function randomSong(randomSongOnSelect) {
	event.preventDefault();
	
	document.getElementById('search').value = '';
	let query = "SELECT COUNT(*) FROM Song";
	// console.log('query', query);
	if(document.getElementById('player') != null && document.getElementById('player').buffered.length < 1) 
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
		// if(document.getElementById('player') == null || document.getElementById('player').paused)
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
			if(document.getElementById('player') == null || document.getElementById('player').paused)
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
	if(document.getElementById('player') == null)
	{
		let optQuery = "SELECT * FROM Song WHERE KNID = ";
		optQuery += window['playlist'][0];
		if(debugMode) console.log('optQuery', optQuery);
		queryDb(optQuery, updateOptions);
	}
	else// if(document.querySelector('#random-count').innerText.length > 0)
		document.getElementById('player').dispatchEvent(new Event('ended'));
	// updateQueue();
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
	document.getElementById('title').innerText = defaultTitle;
	document.title = defaultTitle;
	renderSettings();
	renderVariables();
	generateFilters();
	generateHomepage();
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
	document.getElementById('award-years').innerHTML = '';
	
	if(debugMode) console.log('generateYears', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Years';
	document.getElementById('award-years').appendChild(header);	
	
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
	
	document.getElementById('award-years').appendChild(table);
}

function generateSearchHistory(contents) {
	document.getElementById('search-history').innerHTML = '';
	
	if(debugMode) console.log('generateSearchHistory', contents);
	if(!contents || !contents.columns || !contents.values) return;
	
	// let headerDiv = document.createElement('h4');
	// headerDiv.classList.add('centered');
	document.getElementById('search-history').style.position = 'relative';
	document.getElementById('search-history').style.maxWidth = '680px';
	document.getElementById('search-history').style.margin = 'auto';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Recently Searched';
	document.getElementById('search-history').appendChild(header);	
	
	let clear = document.createElement('h6');
	clear.classList.add('centered');
	clear.classList.add('clear');
	clear.style.cursor = 'pointer';
	clear.innerText = 'Clear All';
	clear.addEventListener('click', function() {
		localStorage.removeItem('recent');
		generateSearchHistory();
	});
	document.getElementById('search-history').appendChild(clear);	
	
	// document.getElementById('search-history').appendChild(headerDiv);	
	
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
	document.getElementById('search-history').appendChild(table);
}

function generateUpcomingReleases(contents) {
	document.getElementById('upcoming-releases').innerHTML = '';
	
	if(debugMode) console.log('generateUpcomingReleases', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Upcoming Releases';
	document.getElementById('upcoming-releases').appendChild(header);	
	
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
	document.getElementById('upcoming-releases').appendChild(table);
}

function generateTabs() {
	document.getElementById('tab-buttons').innerHTML = '';
	
	let tabNames = [];
	for(let tab of document.getElementsByClassName('tab'))
	{
		//show different info tab
		if(window['mode'] == 'year' && tab.id == 'tab-info') continue;
		if(window['mode'] == 'song' && tab.id == 'tab-year') continue;
		if(window['mode'] == 'artist' && tab.id == 'tab-info') continue;
		//hide unused tabs
		if(window['mode'] == 'year' && tab.id == 'tab-related') continue;
		
		let tabItem = document.createElement('button');
		tabItem.id = 'button-' + tab.id;
		tabItem.classList.add('tab-button');
		tabItem.innerText = tab.getAttribute('data-name');
		// tabItem.style.cursor = 'pointer';
		tabItem.addEventListener('click', function() {
			showTab(tab.id);
		});
		
		document.getElementById('tab-buttons').appendChild(tabItem);
		
		if(tabNames.indexOf(tabItem.innerText) >= 0)
		{
			console.error('duplicate tab name exists: ' + tabItem.innerText);
			break;
		}
		else
			tabNames.push(tabItem.innerText);
	}
	setTabs();
}

function generateFilters() {
	let filters = document.getElementById('filters');
	filters.classList.add('centered');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.disabled = true;
	search.placeholder = 'Song Title, Artist Title, KNYEAR...';
	search.addEventListener('focus', selectAll);
	search.addEventListener('input', function() {
		// console.log('querySelect', document.getElementById('search').value);
		let searchFields = ['SongTitle','ArtistTitle','KNYEAR'].join(" || ");
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE TRUE ";
		query += addQuotationInSQLString(document.getElementById('search').value).split(' ').map(v => "AND " + searchFields + " LIKE '%" + v + "%'").join('');
		
		// query += " LOWER(" + removeCharacterInSQLProperty("SongTitle") + ") LIKE '%" + term + "%'";
		// query += " OR LOWER(" + removeCharacterInSQLProperty("ArtistTitle") + ") LIKE '%" + term + "%'";
		// query += " OR LOWER(" + removeCharacterInSQLProperty("ArtistTitle || ' ' || SongTitle") + ") LIKE '%" + term + "%'";
		// query += " OR LOWER(" + removeCharacterInSQLProperty("SongTitle || ' ' || ArtistTitle") + ") LIKE '%" + term + "%'";
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
	let id = parseInt(document.getElementById('options').value);
	// console.log('queryOption', id);
	if(id > 0)
	{
		// if(window['playlist'].length < 2 || window['playlist'][0] != id)
		// {
			// window['playlist'] = [id];
			// document.querySelector('#random-count').innerText = '';
		// }
		window['mode'] = 'song';
		let query = "SELECT KNID as ID, KNYEAR, Filename, SongTitle as 'Song Title', ArtistTitle as 'Artist Title', ReleaseTitle as 'Release Title', ReleaseArtistTitle as 'Release Artist', ReleaseYear as 'Year', Rating, Genre, DateCreated as 'Date Added', VocalCode as 'Vocal Code', LanguageCode as 'Language', LyricsURL as 'Lyrics', SongTitleAlt as '" + altTitlePrefix + " Song Title', ArtistID, ReleaseID FROM Song WHERE KNID = " + id;
		if(debugMode)
			console.log('query', query);
		queryDb(query, generateLayout);
	}
	//probably can multiple query for multiple tables, by semicolon
}

function selectAll() {
	this.setSelectionRange(0, this.value.length);
}

function updateOptions(contents) {
	// console.log('updateOptions', contents);
	let search = document.getElementById('search');
	let options = document.getElementById('options');
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
			opt.value = newOption.id;
			opt.innerHTML = newOption.optionString.replace(search.value, '<span style="font-weight: bold;">' + search.value + '</span>');
			
			options.appendChild(opt);
		}
		if(newOptions.length == 2) //1 result with default
		{
			search.blur();
			setTimeout(function() {
				document.getElementById('options').value = contents.values[0][columnIndexKNID];
				document.getElementById('options').dispatchEvent(new Event('change'));
				// search.focus();
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
    document.getElementById('tab-list').scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
}

//load layout
//flow is generally generateLayout -> query-prefixed functions -> generate-prefixed functions
function generateLayout(contents) {
	if(debugMode) console.log('generateLayout', contents);
	document.getElementById('tab-homepage').style.display = 'none';
	document.getElementById('search-buttons').style.display = '';
	document.getElementById('music').innerHTML = '';
	document.getElementById('cover').style.display = 'none';
	
	//clear modules
	for(let module of document.getElementsByClassName('module'))
	{
		module.innerHTML = '';
	}
	
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
		queryArtistInfo(contents); //uses same generateArtistInfo
		//related songs: songs within 5, 10, 15 years? songs featured eg. collab
		//awards that artist won? and nominated
		//rankings entered? maybe not list all but summary?
		//compilation: artist collection, if any?
		//sotd? song mentions by group by song?
		//analysis: 
		//*song popularity rank by weight, top 10 max, ?? min
		//*b-side reviews - klassic note reviews?
		//*song count by year
		
	}
	
	generateTabs();
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
	
	document.getElementById('search').value = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
	
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
	
	document.getElementById('music').innerHTML = '';
	// if(!document.getElementById('music').classList.contains('centered'))
		// document.getElementById('music').classList.add('centered');
	
	let audioOverlay = document.createElement('div');
	audioOverlay.id = 'overlay';
	audioOverlay.innerText = 'Preview not available';
	document.getElementById('music').appendChild(audioOverlay);
		document.getElementById('overlay').classList.add('invisible');
	
	let audio = document.createElement('audio');
	audio.id = 'player';
	audio.setAttribute('data-id', row[columnIndexKNID]);
	audio.classList.add('player');
	audio.addEventListener('play', function() {
		document.title = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle] + ' - ' + defaultTitle;
	});
	audio.addEventListener('pause', function() {
		document.title = defaultTitle;
	});
	audio.addEventListener('canplay', function() {
		this.style.display = 'block';
	});
	audio.addEventListener('volumechange', function() {
		localStorage.setItem('volume', document.getElementById('player').volume);
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
	audio.controls = true;
	audio.autoplay = window['autoplay-select']; //for shuffle to work this must be set as true
	audio.volume = localStorage.getItem('volume')|| 0.5;
	audio.controlsList = 'nodownload';
	
	let source = document.createElement('source');
	source.src = directory + knyear + '/' + filename + '.mp3';
	source.type = 'audio/mpeg';
	source.innerText = '[You\'ll need a newer browser that supports HTML5 to listen to this.]';
	
	audio.appendChild(source);
	document.getElementById('music').appendChild(audio);
	
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

function updateQueue(next) {
	// let queued = window['playlist'].length - ((document.getElementById('player') == null) ? 0 : 1);
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

function queryInfo(contents) {
	generateSongInfo(contents);
	
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('Release Artist');
	
	let query = "SELECT ArtistTitle AS 'Name', GROUP_CONCAT(ParentArtist, '<br/>') AS 'Tags (if any)', CASE WHEN ArtistCode = 'BD' THEN 'Independent Band' WHEN ArtistCode = 'ID' THEN 'Idol Group' WHEN ArtistCode = 'AG' THEN 'Anime Voice Actor Group' WHEN ArtistCode = 'AS' THEN 'Anime Voice Actor(s)' WHEN ArtistCode = 'CL' THEN 'Collaboration' WHEN ArtistCode = 'SS' THEN 'Singer-Songwriter' WHEN ArtistCode = 'SL' THEN 'Solo Artist' ELSE 'Unknown' END AS 'Artist Type', DisbandYear AS 'Year Disbaneded (if any)', ArtistTitleAlt AS '" + altTitlePrefix + " Name', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "') AS 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode) 
		console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT KNYEAR, Category, Type, ReleaseTitle AS 'Release Title', ReleaseArtistTitle AS 'Release Artist', TracksSelected || ' / ' || TracksTotal AS 'Tracks In Library', (SELECT COUNT(*) FROM Song s WHERE s.ReleaseTitle = r.ReleaseTitle AND s.ReleaseArtistTitle = r.ReleaseArtistTitle AND s.KNYEAR <= r.KNYEAR) || ' / ' || TracksSelected AS 'New Tracks', ReleaseYear || SUBSTR('0000' || ReleaseDate, -4, 4) AS 'Release Date', ReleaseTitleAlt AS '" + altTitlePrefix + " Release Title', ReleaseArtistTitleAlt AS '" + altTitlePrefix + " Release Artist' FROM Release r WHERE ReleaseID = (SELECT MAX(ReleaseID) FROM Release WHERE ReleaseTitle = '" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "' AND ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexReleaseArtistTitle]) + "')";
	if(debugMode) 
		console.log('generateReleaseInfo', query);
	queryDb(query, generateReleaseInfo);
}

function generateSongInfo(contents) {
	document.getElementById('song-info').innerHTML = '';
	
	if(debugMode) console.log('generateSongInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Information';
	document.getElementById('song-info').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	let excludedColumns = ['ArtistID', 'ReleaseID'];
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
		if(rowVal.toString().includes('://'))
			td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById('song-info').appendChild(table);
}

function generateArtistInfo(contents) {
	document.getElementById('artist-info').innerHTML = '';
	
	if(debugMode) console.log('generateArtistInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Artist Information';
	document.getElementById('artist-info').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	//header
	let row = rows[0];
	for(let r = 0; r < columns.length; r++)
	{
		let rowVal = row[r];
		if(!rowVal || rowVal.length == 0) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = columns[r];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerHTML = rowVal;
		if(rowVal.toString().includes('://'))
			td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		
		if(window['mode'] != 'artist' && columns[r] == 'Name')
		{
			let tda = document.createElement('span');
			tda.style.position = 'relative';
			
				let ta = document.createElement('span');
				ta.title = 'Winner';
				ta.classList.add('material-icons');
				// ta.classList.add('award-winner');
				ta.style.position = 'absolute';
				ta.style.cursor = 'pointer';
				ta.innerText = 'launch';
				ta.setAttribute('data-artist', rowVal);
				ta.addEventListener('click', updateArtist);
				
				tda.appendChild(ta);
				
			td.appendChild(tda);
		}
		
		tr.appendChild(td);
		
		tbody.appendChild(tr);
	}
		
	table.appendChild(tbody);
	document.getElementById('artist-info').appendChild(table);
}

function generateReleaseInfo(contents) {
	document.getElementById('release-info').innerHTML = '';
	
	if(debugMode) console.log('generateReleaseInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Release Information';
	document.getElementById('release-info').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	
	let tbody = document.createElement('tbody');
	
	//header
	let row = rows[0];
	for(let r = 0; r < columns.length; r++)
	{
		let rowVal = row[r];
		if(!rowVal || rowVal.length == 0) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.innerText = columns[r];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.innerText = rowVal;
		if(rowVal.toString().includes('://'))
			td.innerHTML = '<a target="_blank" href="' + rowVal + '">' + rowVal + '</a>';
		tr.appendChild(td);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById('release-info').appendChild(table);
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
	document.getElementById('year-info').innerHTML = '';
	
	if(debugMode) console.log('generateYearInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Awards Information';
	document.getElementById('year-info').appendChild(header);	
	
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
	document.getElementById('year-info').appendChild(table);
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
	
	query = "SELECT KNYEAR as 'Year', Category, Type, ReleaseTitle AS 'Release Title', TracksSelected || ' / ' || TracksTotal AS 'Tracks In Library', (SELECT COUNT(*) FROM Song s WHERE s.ReleaseTitle = r.ReleaseTitle AND s.ReleaseArtistTitle = r.ReleaseArtistTitle AND s.KNYEAR <= r.KNYEAR) || ' / ' || TracksSelected AS 'New Tracks', ReleaseYear || SUBSTR('0000' || ReleaseDate, -4, 4) AS 'Release Date', ReleaseTitleAlt AS '" + altTitlePrefix + " Release Title', ReleaseArtistTitleAlt AS '" + altTitlePrefix + " Release Artist' FROM Release r WHERE ReleaseArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ORDER BY KNYEAR, ReleaseYear || SUBSTR('0000' || ReleaseDate, -4, 4)";
	if(debugMode) 
		console.log('generateReleaseInfo', query);
	queryDb(query, generateArtistReleaseInfo);
}

function generateArtistReleaseInfo(contents) {
	document.getElementById('artist-release').innerHTML = '';
	
	if(debugMode) console.log('generateArtistReleaseInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Artist Releases';
	document.getElementById('artist-release').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	let columnIndexKNYEAR = contents.columns.indexOf('Year');
	let columnIndexCategory = contents.columns.indexOf('Category');
	let columnIndexReleaseTitle = contents.columns.indexOf('Release Title');
	
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
		let rowVal = rows[r];
		if(!rowVal || rowVal.length == 0) continue;
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.classList.add('centered-text');
		tc.innerText = rowVal[columnIndexKNYEAR];
		tr.appendChild(tc);
		
		let td = document.createElement('td');
		td.classList.add('centered-text');
		td.innerText = rowVal[columnIndexCategory];
		tr.appendChild(td);
		
		let te = document.createElement('td');
		te.innerText = rowVal[columnIndexReleaseTitle];
		tr.appendChild(te);
		
		tbody.appendChild(tr);	
	}
		
	table.appendChild(tbody);
	document.getElementById('artist-release').appendChild(table);
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
	document.getElementById('songs-related-date').innerHTML = '';
	let convertDate = "replace(DateCreated,'.','-')";
	let currentDate = "(select date("+convertDate+") from Song where KNID = "+row[columnIndexKNID]+")";
	let dateRange = "date("+convertDate+") between date("+currentDate+",'-1 months') and date("+currentDate+",'+1 months')";
	
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND " + dateRange;
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByDate', query);
	queryDb(query, generateSongRelatedByDate);
	
	//max 10 related same year
	document.getElementById('songs-related-year').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseYear = '" + row[columnIndexReleaseYear] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('generateSongRelatedByYear', query);
	queryDb(query, generateSongRelatedByYear);
	
	//max 10 related to artist
	document.getElementById('artist-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ArtistTitle = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistRelated', query);
	queryDb(query, generateArtistRelated);
	
	//max 10 related to release
	document.getElementById('release-related').innerHTML = '';
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
	document.getElementById('songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ArtistID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + addQuotationInSQLString(row[columnIndexArtistTitle]) + "' ";
	query += "ORDER BY RANDOM() DESC LIMIT 5";
	if(debugMode) console.log('generateSongFeaturedByArtist', query);
	queryDb(query, generateSongFeaturedByArtist);
}

function generateSongRelatedByDate(contents) {
	if(debugMode) console.log('generateSongRelatedByDate', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs within 3 months';
	document.getElementById('songs-related-date').appendChild(header);	
	
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
	document.getElementById('songs-related-date').appendChild(table);
}

function generateSongRelatedByYear(contents) {
	if(debugMode) console.log('generateSongRelatedByYear', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from ' + rows[0][contents.columns.indexOf('ReleaseYear')];
	document.getElementById('songs-related-year').appendChild(header);	
	
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
	document.getElementById('songs-related-year').appendChild(table);
}

function generateArtistRelated(contents) {
	if(debugMode) console.log('generateArtistRelated', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ArtistTitle')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from ' + rows[0][contents.columns.indexOf('ArtistTitle')];
	document.getElementById('artist-related').appendChild(header);	
	
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
		
		let tr = document.createElement('tr');
	
		let tc = document.createElement('td');
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-id', row[columnIndexKNID]);
		tc.setAttribute('context', 'related');
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexSongTitle];
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
	document.getElementById('artist-related').appendChild(table);
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
	document.getElementById('release-related').appendChild(header);	
	
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
	document.getElementById('release-related').appendChild(table);
	
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
	document.getElementById('songs-related-collab').appendChild(header);	
	
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
	document.getElementById('songs-related-collab').appendChild(table);
}

function querySongList(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let year = row[columnIndexKNYEAR];
	
	let query = "SELECT * FROM Song WHERE KNYEAR = " + year + " ORDER BY RANDOM() LIMIT 30";
	if(debugMode) console.log('generateSongList', query);
	queryDb(query, generateSongList);
}

function generateSongList(contents) {
	if(debugMode) console.log('generateSongList', contents);
	if(!contents.columns || !contents.values) return;
	
	document.getElementById('song-list').innerHTML = '';
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from ' + rows[0][contents.columns.indexOf('KNYEAR')];
	document.getElementById('song-list').appendChild(header);	
	
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
	document.getElementById('song-list').appendChild(table);	
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
	document.getElementById('song-awards').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Awards';
	document.getElementById('song-awards').appendChild(header);
	
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
			
			let selected = document.getElementById('options').value;
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
		document.getElementById('song-awards').appendChild(table);
		
		document.getElementById('song-awards').appendChild(document.createElement('br'));
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
	document.getElementById('song-ranking').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Rankings';
	document.getElementById('song-ranking').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('content-table');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	let tr = document.createElement('tr');
	tr.classList.add('no-highlight');
	for(let column of columns)
	{
		if(['Rank #','Song Title','Artist Title'].indexOf(column) >= 0)
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
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexRankNo = contents.columns.indexOf('Rank #');
		let columnIndexSongTitle = contents.columns.indexOf('Song Title');
		let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
		
		let tr = document.createElement('tr');
		tr.setAttribute('data-id', row[columnIndexKNID]);
		if(document.getElementById('options').value == row[columnIndexKNID]) {
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
	
		//rank no
		if(row[columnIndexRankNo] != rank)
		{
			let span = rows.filter(r => r[columnIndexRankNo] == rank + 1).length;
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
	document.getElementById('song-ranking').appendChild(table);
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
	document.getElementById('song-compilation').appendChild(header);	
	
	let columnIndexCompilationTitle = contents.columns.indexOf('CompilationTitle');
	let compilationTitles = rows.map(s => s[columnIndexCompilationTitle]).filter((sa, ind, arr) => arr.indexOf(sa) == ind);
	// console.log('compilationTitles', compilationTitles);
	
	for(let compilationTitle of compilationTitles)
	{
		let compilationRows = rows.filter(r => r[columnIndexCompilationTitle] == compilationTitle);
		// console.log('compilationRows', compilationRows);
		
		let table = document.createElement('table');
		// table.id = 'table';
		table.classList.add('list');
		table.classList.add('centered');
		table.classList.add('content-box');
		table.classList.add('content-table');
		table.classList.add('not-selectable');
		
		let tbody = document.createElement('tbody');
		
		//title
		let ttr = document.createElement('tr');
		
		let th = document.createElement('th');
		th.classList.add('table-title');
		th.setAttribute('colspan', 3);
		th.innerText = compilationTitle;
		ttr.appendChild(th);
		
		tbody.appendChild(ttr);
		
		//header
		let tr = document.createElement('tr');
		for(let column of columns)
		{
			if(['Track #','Song Title','Artist Title'].indexOf(column) >= 0)
			{
				let th = document.createElement('th');
				th.innerText = column;
				tr.appendChild(th);
			}
		}
		tbody.appendChild(tr);
		
		//rows
		for(let row of compilationRows)
		{
			let columnIndexKNID = contents.columns.indexOf('KNID');
			let columnIndexTrackNumber = contents.columns.indexOf('Track #');
			let columnIndexSongTitle = contents.columns.indexOf('Song Title');
			let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
			
			let tr = document.createElement('tr');
			let selected = document.getElementById('options').value;
			tr.setAttribute('data-id', row[columnIndexKNID]);
			// tr.classList.add('not-selectable');
			if(selected == row[columnIndexKNID]) {
				tr.classList.add('not-selectable');
				tr.classList.add('highlight');
			}
			else {
				tr.style.cursor = 'pointer';
				tr.addEventListener('click', updateSong);
			}
		
			//track no
			let tc = document.createElement('td');
			tc.classList.add('centered-text');
			tc.innerText = row[columnIndexTrackNumber];
			tr.appendChild(tc);
			
			//song
			let td = document.createElement('td');
			td.innerText = row[columnIndexSongTitle];
			tr.appendChild(td);
			
			//artist
			let te = document.createElement('td');
			te.innerText = row[columnIndexArtistTitle];
			tr.appendChild(te);
			
			tbody.appendChild(tr);
		}
			
		table.appendChild(tbody);
		document.getElementById('song-compilation').appendChild(table);
		
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
	document.getElementById('song-sotd').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Mentions';
	document.getElementById('song-sotd').appendChild(header);
	
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
	document.getElementById('song-sotd').appendChild(table);
}

function generateTopSOTD(contents) {
	document.getElementById('song-sotd').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song of the Day Top Rankings';
	document.getElementById('song-sotd').appendChild(header);
	
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
	document.getElementById('song-sotd').appendChild(table);

}

function generateSOTM(contents) {
	document.getElementById('song-sotm').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Monthly Mentions';
	document.getElementById('song-sotm').appendChild(header);
	
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
		if(document.getElementById('options').value == rows[r][columnIndexKNID]) {
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
	document.getElementById('song-sotm').appendChild(table);
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
	
	document.getElementById('vocal-popularity').innerHTML = '';
	document.getElementById('vocal-popularity').appendChild(header);
	document.getElementById('vocal-popularity').appendChild(table);
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
	
	document.getElementById('single-bside').innerHTML = '';
	document.getElementById('single-bside').appendChild(header);
	document.getElementById('single-bside').appendChild(table);
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
	
	document.getElementById('song-language').innerHTML = '';
	document.getElementById('song-language').appendChild(header);
	document.getElementById('song-language').appendChild(table);
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
	
	document.getElementById('release-year').innerHTML = '';
	document.getElementById('release-year').appendChild(header);
	document.getElementById('release-year').appendChild(table);
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
	
	document.getElementById('anime-songs').innerHTML = '';
	document.getElementById('anime-songs').appendChild(header);
	document.getElementById('anime-songs').appendChild(table);
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
	
	document.getElementById('song-appetite').innerHTML = '';
	document.getElementById('song-appetite').appendChild(header);
	document.getElementById('song-appetite').appendChild(table);
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
	
	let cover = document.getElementById('cover');
	cover.innerHTML = '';
	cover.style.display = 'initial';
	let coverHeight = document.getElementById('header').getBoundingClientRect().height - 15;
	
	let art = document.createElement('img');
	art.classList.add('content-box');
	art.src = coverArtDirectory + row[columnIndexKNYEAR] + '/' + row[columnIndexCoverArt];
	art.style.height = coverHeight + 'px';
	art.addEventListener('error', function() {
		document.getElementById('cover').style.display = 'none';		
	});
	cover.appendChild(art);
}

//--HELPER FUNCTIONS--//
function updateSong() {
	window['mode'] = 'song';
	hideContextMenus(true);
	for(let tab of document.getElementsByClassName('module'))
	{
		tab.innerHTML = '';
	}
	
	let id = this.getAttribute('data-id');
	let query = "SELECT * FROM Song WHERE KNID = " + id;
	if(debugMode) console.log('updateSong', query);
	queryDb(query, updateOptions);
}

function updateYear() {
	window['mode'] = 'year';
	document.getElementById('search').value = '';
	document.getElementById('options').value = '';
	
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
	document.getElementById('search').value = '';
	document.getElementById('options').value = '';
	
	let artist = this.getAttribute('data-artist');
	let query = "SELECT ArtistTitle AS 'Artist Title' FROM Artist WHERE ArtistTitle = '" + artist + "'";
	if(debugMode) console.log('updateArtist', query);
	queryDb(query, generateLayout);
	
	//initial query for options
	query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE ArtistTitle = '" + artist + "'";
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
	let options = document.getElementById('options');
	window['option_list'] = options.getElementsByTagName('option');
	window['test-total'] = window['option_list'].length - 1;
	
	setTimeout(function () {
		setNextOption(parseInt(window['option_list'][1].value));
	}, 200); //set timeout to where processor comfortable
}

function setNextOption(id) {
	console.log('setNextOption',id);
	document.getElementById('options').value = id;
	document.getElementById('options').dispatchEvent(new Event('change'));

	setTimeout(updateTestPlayer, timeout);
}

function updateTestPlayer() {
	let player = document.getElementById('player');
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
		document.getElementById('search').value = file.name.replace('.mp3','');
		document.getElementById('search').dispatchEvent(new Event('input'));
		
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
		query += " WHERE SongTitle = '" + addQuotationInSQLString(document.getElementById('search').value) + "'";
		// console.log('query', query);
		queryDb(query, updateOptions);
	}
}
