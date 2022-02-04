//--CONFIG--//
let defaultTitle = 'Klassic Note Web';
let altTitlePrefix = 'Original';
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3
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
	// space: play/pause
	if (event.keyCode === 32 && document.getElementById('player') != null && document.getElementById('search') != document.activeElement) {
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
	}
	
	document.getElementById('tab-buttons').style.display = isWidescreen ? 'none' : '';
	document.getElementById('tab-list').style.height = window.innerHeight - Array.from(document.getElementsByClassName('calc')).reduce((total, current) => { return total + current.offsetHeight; }, 50) + 'px';
	if (debugMode) console.log('containerHeight', document.getElementById('tab-list').style.height);
	
	document.getElementById('search').style.width = homePageVisible ? '100%' : (document.getElementById('options').getBoundingClientRect().width - 40) + 'px';
	document.getElementById('search-buttons').style.display = homePageVisible ? 'none' : '';
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
	document.getElementById('search').value = '';
	document.getElementById('tab-homepage').style.display = '';
	document.getElementById('search-buttons').style.display = 'none';
	document.getElementById('search').style.width = '100%';
	document.getElementById('tab-buttons').innerHTML = '';
	for(let tab of document.getElementsByClassName('module'))
	{
		tab.innerHTML = '';
	}
	generateHomepage();
}

function toggleAutoplay() {
	autoplayOnSelect = !autoplayOnSelect;
	document.getElementById('autoplay').innerText = autoplayOnSelect ? 'music_note' : 'music_off';
}

function randomSong() {
	document.getElementById('search').value = '';
	let query = "SELECT COUNT(*) FROM Song";
	// console.log('query', query);
	if(document.getElementById('player') != null && document.getElementById('player').buffered.length < 1) 
	{
		window['playlist'] = [];
		document.getElementById('random-count').innerText = '';
	}
	queryDb(query, function(content) {
		// console.log('content', content);
		let total = content.values[0][0];
		
		let songsToQueue = window['shifted'] ? 10 : 1;
		let random = 0;
		do {
			random = Math.floor((Math.random() * total));
			if(window['playlist'].indexOf(random) < 0)
			{
				window['playlist'].push(random);
				songsToQueue--;
			}
		} while (songsToQueue > 0);
		if(debugMode) console.log('playlist',window['playlist']);
		updateQueueCount();
		if(document.getElementById('player') == null || document.getElementById('player').paused)
		{
			// when autoplay is off
			if(window['playlist'].length == 2)
				window['playlist'] = window['playlist'].slice(1);
			let optQuery = "SELECT * FROM Song WHERE KNID = ";
			optQuery += window['playlist'][0];
			if(debugMode) console.log('optQuery', optQuery);
			queryDb(optQuery, updateOptions);
		}
	});
};

function skipSong() {
	if(document.getElementById('random-count').innerText.length > 0)
		document.getElementById('player').dispatchEvent(new Event('ended'));
	updateQueueCount();
}

function clearQueue() {
	event.preventDefault();
	window['playlist'] = [];
	document.getElementById('random-count').innerText = 'Queue cleared';
	setTimeout(function() {
		document.getElementById('random-count').innerText = '';
	}, 2000);
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
	xhr.open('GET', 'https://knneo.github.io/klassic-note-web/db/KlassicNote.db', true);
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
}

function renderSettings() {
	document.getElementById('skip').style.display = 'none';
	document.getElementById('autoplay').innerText = autoplayOnSelect ? 'music_note' : 'music_off';
}

function renderVariables() {
	// set variables here, do not define above
	window['db'] = null;
	window['playlist'] = [];
	window['mode'] = 'song';
}

function generateHomepage() {
	//initial query for options
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
	
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
	
	query = "SELECT DISTINCT KNYEAR FROM SongAwardsPeriod";
	if(debugMode) console.log('generateYears', query);
	callDb(query, generateYears);
}

function generateSearchHistory(contents) {
	document.getElementById('search-history').innerHTML = '';
	
	if(debugMode) console.log('generateSearchHistory', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Recently Searched';
	document.getElementById('search-history').appendChild(header);	
	
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
	// table.classList.add('content-box');
	
	
	// let tbody = document.createElement('tbody');
	
	//header
	for(let row of rows)
	{
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		
		// let tr = document.createElement('tr');
	
		let tc = document.createElement('span');
		tc.classList.add('content-box');
		tc.classList.add('tag');
		tc.style.margin = '5px';
		tc.style.cursor = 'pointer';
		tc.setAttribute('data-year', row[columnIndexKNYEAR]);
		tc.innerText = row[columnIndexKNYEAR];
		tc.addEventListener('click', updateYear);
		table.appendChild(tc);
		
		// tbody.appendChild(tr);	
	}
		
	// table.appendChild(tbody);
	document.getElementById('award-years').appendChild(table);
}

function generateTabs() {
	document.getElementById('tab-buttons').innerHTML = '';
	
	let tabNames = [];
	for(let tab of document.getElementsByClassName('tab'))
	{
		//show different info tab
		if(window['mode'] == 'year' && tab.id == 'tab-info') continue;
		if(window['mode'] == 'song' && tab.id == 'tab-year') continue;
		//toggle related tab
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
}

function generateFilters() {
	let filters = document.getElementById('filters');
	filters.classList.add('centered');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.disabled = true;
	search.placeholder = 'Song Title, Artist Title, KNYEAR';
	search.addEventListener('focus', selectAll);
	search.addEventListener('input', function() {
		// console.log('querySelect', document.getElementById('search').value);
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
		query += " WHERE SongTitle LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR ArtistTitle LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR KNYEAR LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR (ArtistTitle || ' ' || SongTitle) LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR (SongTitle || ' ' || ArtistTitle) LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		// console.log('query', query);
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
		if(window['playlist'].length < 2 || window['playlist'][0] != id)
		{
			window['playlist'] = [id];
			document.getElementById('random-count').innerText = '';
		}
		window['mode'] = 'song';
		queryDb("SELECT KNID as ID, KNYEAR, Filename, SongTitle as 'Song Title', ArtistTitle as 'Artist Title', ReleaseTitle as 'Release Title', ReleaseArtistTitle as 'Release Artist', ReleaseYear as 'Year', Rating, Genre, DateCreated as 'Date Added', VocalCode as 'Vocal Code', LanguageCode as 'Language', LyricsURL as 'Lyrics', SongTitleAlt as '" + altTitlePrefix + " Song Title', ArtistID, ReleaseID FROM Song WHERE KNID = " + id, generateLayout);
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
	// console.log('generateLayout', contents);
	document.getElementById('tab-homepage').style.display = 'none';
	document.getElementById('search-buttons').style.display = '';
	
	if(window['mode'] == 'year')
	{
		queryYearInfo(contents);
		querySongList(contents); //SOTD is here
		generateTabs();
		queryAwardsByYear(contents);
		queryRankingsByYear(contents);
		queryCompilationsByYear(contents);
	}
	
	if(window['mode'] == 'song')
	{
		updateSearch(contents);
		generatePlayer(contents);
		// generateCoverArt();
		queryInfo(contents);
		queryRelated(contents);
		generateTabs();
		queryAwards(contents);
		queryRankings(contents);
		queryCompilations(contents);
		querySOTD(contents);
		
	}
	
	setTabs();
	scrollToTop();
	updateQueueCount();
	
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
	if(!document.getElementById('music').classList.contains('centered'))
		document.getElementById('music').classList.add('centered');
	
	let audioOverlay = document.createElement('div');
	audioOverlay.id = 'overlay';
	audioOverlay.innerText = 'Preview not available';
	document.getElementById('music').appendChild(audioOverlay);
	
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
		document.getElementById('overlay').classList.add('invisible');
	});
	audio.addEventListener('volumechange', function() {
		localStorage.setItem('volume', document.getElementById('player').volume);
	});
	audio.addEventListener('ended', function() {
		if(window['playlist'] != null && window['playlist'].length > 1 && window['playlist'][0] == this.getAttribute('data-id'))
		{
			//remove first which is current, query next
			window['playlist'].shift();
			// console.log('ended', window['playlist']);
			setTimeout(function() {
				let optQuery = "SELECT * FROM Song WHERE KNID = " + window['playlist'][0];
				// console.log('optQuery', optQuery);
				queryDb(optQuery, updateOptions);
				updateQueueCount();
			},200);
		}
	});
	audio.controls = true;
	audio.autoplay = autoplayOnSelect; //for shuffle to work this must be set as true
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

function updateQueueCount() {
	let queued = window['playlist'].length - 1;
	document.getElementById('random-count').innerText = queued > 0 ? (queued + ' song' + (queued > 1 ? 's' : '') + ' queued') : '';
	document.getElementById('skip').style.display = queued > 0 ? '' : 'none';
}

function queryInfo(contents) {
	generateSongInfo(contents);
	
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexArtistTitle = contents.columns.indexOf('Artist Title');
	let columnIndexReleaseID = contents.columns.indexOf('ReleaseID');
	
	let query = "SELECT ArtistTitle as 'Name', GROUP_CONCAT(ParentArtist, '<br/>') AS 'Tags (if any)', ArtistCode as 'Artist Type', DisbandYear as 'Year Disbaneded (if any)', ArtistTitleAlt as '" + altTitlePrefix + " Name', (SELECT COUNT(*) FROM Song WHERE ArtistTitle = '" + reduceQueryInString(row[columnIndexArtistTitle]) + "') as 'Songs In Library' FROM Artist WHERE ArtistTitle = '" + reduceQueryInString(row[columnIndexArtistTitle]) + "' ";
	query += "GROUP BY ArtistTitle, ArtistCode, DisbandYear, ArtistTitleAlt";
	if(debugMode) console.log('generateArtistInfo', query);
	queryDb(query, generateArtistInfo);
	
	query = "SELECT KNYEAR, Category, Type, ReleaseTitle as 'Release Title', ReleaseArtistTitle as 'Release Artist', TracksSelected || ' / ' || TracksTotal AS 'Tracks In Library', (SELECT COUNT(*) FROM Song s WHERE s.ReleaseTitle = r.ReleaseTitle) || ' / ' || TracksSelected AS 'New Tracks', ReleaseYear || SUBSTR('0000' || ReleaseDate, -4, 4) AS 'Release Date', ReleaseTitleAlt as '" + altTitlePrefix + " Release Title', ReleaseArtistTitleAlt as '" + altTitlePrefix + " Release Artist' FROM Release r WHERE ReleaseID = " + row[columnIndexReleaseID];
	if(debugMode) console.log('generateReleaseInfo', query);
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
	query += " AND ArtistTitle = '" + reduceQueryInString(row[columnIndexArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryArtistRelated', query);
	queryDb(query, generateArtistRelated);
	
	//max 10 related to release
	document.getElementById('release-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseTitle LIKE '%" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "%'";
	query += " AND ReleaseArtistTitle = '" + reduceQueryInString(row[columnIndexReleaseArtistTitle]) + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	if(debugMode) console.log('queryReleaseRelated', query);
	queryDb(query, generateReleaseRelated);
	
	//artist featured in
	document.getElementById('songs-related-collab').innerHTML = '';
	query = "select a.ParentArtist, s.KNID, s.KNYEAR, s.SongTitle, s.ArtistTitle from Artist a ";
	query += "join Song s on a.ArtistID = s.ArtistID "
	query += "where a.ParentArtist <> a.ArtistTitle and a.ParentArtist = '" + reduceQueryInString(row[columnIndexArtistTitle]) + "' ";
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
		tc.innerText = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
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
		tc.innerText = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
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
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
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
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
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
		tc.innerText = row[columnIndexKNYEAR] + ' - ' + row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
		tc.addEventListener('click', updateSong);
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
	if(debugMode) console.log('generateSongRelatedByYear', contents);
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

//unavailable: requires base64 image store in db
function generateCoverArt() {
	//base64 string of jpg image
	var imageString = "";
	let audio = document.getElementById('music');
	let audioHeight = audio.offsetHeight || 100;
	audio.style.paddingLeft = (audioHeight + 5) + 'px';
	// console.log('audioHeight',audioHeight);
	let cover = document.getElementById("cover");
	cover.style.position = 'absolute';
	cover.style.width  = audioHeight + 'px';
	cover.style.height = audioHeight + 'px';
	cover.style.backgroundImage = 'url(data:image/jpg;base64,' + imageString + ')';
	cover.style.backgroundSize = audioHeight + 'px';
}

//--HELPER FUNCTIONS--//
function updateSong() {
	window['mode'] = 'song';
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

function reduceQueryInString(query) {
	//fix query in single quotes contains single quotes, see also reduceReleaseTitle
	return query.replace("'","''");
}

function reduceReleaseTitle(release) {
	//exception list to group multiple disc releases (data consistency required in db)
	return release.replace(/'/g,"''").replace('Disc 1','').replace('Disc 2','').replace('Disc 3','').trim();
}

let score = 0;
let total = 0;
let errors = [];
let timeout = 200;
function testPlayer() {
	//to test if filename is corresponding to database
	//loop all songs in dropdown trigger event, log player status
	let options = document.getElementById('options');
	let optionList = options.getElementsByTagName('option');
	score = 0;
	total = optionList.length;
	
	setTimeout(function () {
		setNextOption(parseInt(optionList[0].value)+1);
	}, timeout);
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
		score++;
	else
		errors.push(id);
	
	console.log('updateTestPlayer', id);
	console.log('score', score + '/' + total);
	if(id >= total)
		endTestPlayer();
	else
		setTimeout(function () {
			setNextOption(parseInt(id)+1);
		}, timeout);
}

function endTestPlayer() {	
	console.log('testPlayer', score + '/' + total + ' ok');
	console.log('errors', errors);
}