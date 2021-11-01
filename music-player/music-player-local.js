//--CONFIG--//
let defaultTitle = 'Klassic Note Web';
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3
let debugMode = false; //will show all available logging on console
let altMode = false; //will switch between titles and alt titles [TODO]

//--STARTUP--//
window.addEventListener('load', startup);
window.addEventListener('resize', setTabs);
window.addEventListener('keyup', setKeyUp);
window.addEventListener('keydown', setKeyDown);

//--EVENTS--//
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
		}while(songsToQueue > 0);
		// console.log('playlist',window['playlist']);
		updateQueueCount();
		let optQuery = "SELECT * FROM Song WHERE KNID = " + window['playlist'][0];
		// console.log('optQuery', optQuery);
		if(document.getElementById('player') == null || document.getElementById('player').paused)
			queryDb(optQuery, updateOptions);
	});
};

function clearQueue() {
	event.preventDefault();
	window['playlist'] = [];
	document.getElementById('random-count').innerText = 'Queue cleared';
	setTimeout(function() {
		document.getElementById('random-count').innerText = '';
	}, 2000);
}

function hoverOnRankingRow() {
	let cells = this.getElementsByTagName('td');
	let prevCells = this.previousSibling.getElementsByTagName('td');
	if(prevCells.length == 3 && cells.length == 2 && prevCells[0].rowSpan != undefined)
		toggleHover(prevCells[0]);
	toggleHover(cells[0]);
	toggleHover(cells[1]);
	if(cells.length > 2) toggleHover(cells[2]);
}

function toggleHover(cell) {
	// let supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	// let isDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	// let cellColor = 'transparent';
	if(cell.classList.contains('highlight'))
		cell.classList.remove('highlight');
	else
		cell.classList.add('highlight');
		
	// cell.style.backgroundColor = cell.style.backgroundColor == cellColor ? '' : cellColor;
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
}

function setTabs() {
	let totalModules = 0;
	let isWidescreen = window.innerWidth >= 960;
	for(let tab of document.getElementsByClassName('tab'))
	{
		let hasModules = Array.from(tab.childNodes).filter(c => c.childNodes.length > 0).length > 0;
		let tabButton = document.getElementById('button-' + tab.id);
		if(tabButton != null)
		{
			tabButton.style.cursor = hasModules ? 'pointer' : '';
			tabButton.disabled = !hasModules;
			if(hasModules) totalModules++;
		}
	}
	
	// console.log('totalModules', totalModules);
	document.getElementById('tab-buttons').style.display = isWidescreen ? 'none' : '';
	for(let tab of document.getElementsByClassName('tab'))
	{
		if(isWidescreen && !tab.classList.contains('tab-view')) tab.classList.add('tab-view');
		if(!isWidescreen && tab.classList.contains('tab-view')) tab.classList.remove('tab-view');
		
		tab.style.display = isWidescreen ? 'inline-block' : '';
		tab.style.width = isWidescreen ? ((window.innerWidth / totalModules) - 45) + 'px' : '';
	}
	if(!isWidescreen) showTab('tab-info');
	
	document.getElementById('tab-list').style.height = window.innerHeight - Array.from(document.getElementsByClassName('calc')).reduce((total, current) => { return total + current.offsetHeight; }, 40) + 'px';
	if (debugMode) console.log('containerHeight', document.getElementById('tab-list').style.height);
}

function showTab(activeTab) {
	for(let tab of document.getElementsByClassName('tab'))
	{
		tab.style.display = tab.id == activeTab ? 'block' : 'none';
		if(tab.classList.contains('tab-view')) tab.style.display = 'inline-block';
	}
}

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

//--FUNCTIONS--//
function startup() {
	document.getElementById('title').innerText = defaultTitle;
	document.title = defaultTitle;
	renderVariables();
	generateFilters();
	window['playlist'] = [];
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
}

function renderVariables() {
	// to allow multiple instances of charts based on data, in format 'container<no>'
	window['db'] = null;
}

async function callDb(query, callback) {
	const time = Date.now();
	//for webassembly file
	const SQL = await initSqlJs({
	  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
	  // You can omit locateFile completely when running in node
	  locateFile: file => 'https://knneo.github.io/music-player/sql-wasm.wasm'
	});

	// for sqlite db
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://knneo.github.io/klassic-note-table/db/KlassicNote.db', true);
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

function generateTabs() {
	document.getElementById('tab-buttons').innerHTML = '';
	
	let tabs = document.getElementsByClassName('tab');
	for(let tab of tabs)
	{
		let tabItem = document.createElement('button');
		tabItem.id = 'button-' + tab.id;
		tabItem.innerText = tab.getAttribute('data-name');
		// tabItem.style.cursor = 'pointer';
		tabItem.addEventListener('click', function() {
			showTab(tab.id);
		});
		
		document.getElementById('tab-buttons').appendChild(tabItem);
	}	
}

function generateFilters() {
	let filters = document.getElementById('filters');
	filters.classList.add('centered');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.placeholder = 'Song Title, Artist Title, KNYEAR';
	search.addEventListener('input', function() {
		// console.log('querySelect', document.getElementById('search').value);
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE SongTitle LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR ArtistTitle LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		query += " OR KNYEAR LIKE '%" + reduceQueryInString(document.getElementById('search').value) + "%'";
		// console.log('query', query);
		queryDb(query, updateOptions);
	});
	filters.appendChild(search);
	
	let options = document.createElement('select');
	options.id = 'options';
	options.addEventListener('change', function() {
		// console.log('queryOption', document.getElementById('options').value);
		if(document.getElementById('options').value > 0)
			queryDb("SELECT * FROM Song WHERE KNID = " + document.getElementById('options').value, generateLayout);
		//probably can multiple query for multiple tables, by semicolon
	});
	
		let opt = document.createElement('option');
		opt.innerText = '===';		
		options.appendChild(opt);
		
	filters.appendChild(options);
}

function updateOptions(contents) {
	// console.log('updateOptions', contents);
	let criteria = document.getElementById('search').value;
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
			opt.innerHTML = newOption.optionString.replace(criteria, '<span style="font-weight: bold;">' + criteria + '</span>');
			
			options.appendChild(opt);
		}
		if(newOptions.length == 2) //1 result with default
		{
			document.getElementById('search').blur();
			setTimeout(function() {
				document.getElementById('options').value = contents.values[0][columnIndexKNID];
				document.getElementById('options').dispatchEvent(new Event('change'));
			},200);
		}
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

//load layout
function generateLayout(contents) {
	// console.log('generateLayout', contents);
	updateSearch(contents);
	generatePlayer(contents);
	// generateCoverArt();
	generateTabs();
	generateSongInfo(contents);
	queryRelated(contents);
	queryRanking(contents);
	setTimeout(function() {
		setTabs();
		showTab('tab-info');
	}, 100);
	scrollToTop();
}

function updateSearch(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	
	document.getElementById('search').value = row[columnIndexArtistTitle] + ' - ' + row[columnIndexSongTitle];
}

function generatePlayer(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexFilename = contents.columns.indexOf('Filename');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexReleaseTitle = contents.columns.indexOf('ReleaseTitle');
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
		document.getElementById('overlay').classList.add('hidden');
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
	audio.autoplay = true;
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
}

function generateSongInfo(contents) {
	document.getElementById('song-info').innerHTML = '';
	
	if(debugMode) console.log('generateSongInfo', contents);
	if(!contents.columns || !contents.values) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Info';
	document.getElementById('song-info').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('no-highlight');
	
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

function queryRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexReleaseYear = contents.columns.indexOf('ReleaseYear');
	let columnIndexReleaseTitle = contents.columns.indexOf('ReleaseTitle');
	let columnIndexReleaseArtistTitle = contents.columns.indexOf('ReleaseArtistTitle');
	let columnIndexReleaseDateCreated = contents.columns.indexOf('DateCreated');

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

function queryRanking(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('KNID');
	//select ranking of that year of song
	let query = "SELECT s.KNID, r.KNYEAR, r.RankNo, r.SortOrder, s.SongTitle, s.ArtistTitle FROM Ranking r JOIN Song s on r.KNID = s.KNID WHERE r.KNYEAR = (SELECT KNYEAR FROM Ranking WHERE KNID = " + row[columnIndexKNID] + ") ORDER BY r.KNYEAR, r.RankNo, r.SortOrder";
	// console.log('queryRelated', query);
	queryDb(query, generateRanking);
}

function generateRanking(contents) {
	document.getElementById('year-ranking').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Rankings';
	document.getElementById('year-ranking').appendChild(header);	
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	table.classList.add('content-box');
	table.classList.add('not-selectable');
	
	let tbody = document.createElement('tbody');
	
	//header
	let tr = document.createElement('tr');
	for(let column of columns)
	{
		if(['RankNo','SongTitle','ArtistTitle'].indexOf(column) >= 0)
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
		let columnIndexRankNo = contents.columns.indexOf('RankNo');
		let columnIndexSortOrder = contents.columns.indexOf('SortOrder');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
		
		let tr = document.createElement('tr');
		let selected = document.getElementById('options').value;
		tr.setAttribute('data-id', row[columnIndexKNID]);
		if(selected == row[columnIndexKNID]) {
			tr.classList.add('not-selectable');
			tr.addEventListener('active', hoverOnRankingRow);
		}
		else {
			tr.style.cursor = 'pointer';
			tr.addEventListener('click', updateSong);
			tr.addEventListener('mouseover', hoverOnRankingRow);
			tr.addEventListener('mouseout', hoverOnRankingRow);
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
	document.getElementById('year-ranking').appendChild(table);
	
	for(let selected of document.getElementsByClassName('not-selectable'))
	{
		selected.dispatchEvent(new Event('active'));
	}
}


//unavailable: requires base64 image store in db
function generateCoverArt() {
	//base64 string of jpg image
	var imageString = "";
	let audio = document.getElementById('music');
	let audioHeight = audio.offsetHeight || 100;
	audio.style.paddingLeft = (audioHeight + 5) + 'px';
	console.log('audioHeight',audioHeight);
	let cover = document.getElementById("cover");
	cover.style.position = 'absolute';
	cover.style.width  = audioHeight + 'px';
	cover.style.height = audioHeight + 'px';
	cover.style.backgroundImage = 'url(data:image/jpg;base64,' + imageString + ')';
	cover.style.backgroundSize = audioHeight + 'px';
}

//--HELPER FUNCTIONS--//

function updateSong() {
	let id = this.getAttribute('data-id');
	let query = "SELECT * FROM Song WHERE KNID = " + id;
	// console.log('query', query);
	queryDb(query, updateOptions);
	
	document.getElementById('options').value = id;
	document.getElementById('options').dispatchEvent(new Event('change'));
	
	document.getElementById('search').value = '';
	// setTimeout(function() {
	// }, 200);
}

function reduceQueryInString(query) {
	//fix query in single quotes contains single quotes, see also reduceReleaseTitle
	return query.replace("'","''");
}

function reduceReleaseTitle(release) {
	//exception list to group multiple disc releases (data consistency required in db)
	return release.replace("'","''").replace('Disc 1','').replace('Disc 2','').replace('Disc 3','').trim();
}