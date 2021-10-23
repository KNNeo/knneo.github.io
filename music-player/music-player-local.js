//--CONFIG--//
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3

//----------------------------//
//--VARIABLES: DO NOT TOUCH!--//
let db;
let debugMode = false;

//--STARTUP--//
window.addEventListener('load', startup);

//--EVENTS--//
function randomSong() {
	document.getElementById('search').value = '';
	let query = "SELECT COUNT(*) FROM Song";
	// console.log('query', query);
	queryDb(query, function(content) {
		// console.log('content', content);
		let total = content.values[0][0];
		let random = Math.floor((Math.random() * total));
		let optQuery = "SELECT * FROM Song WHERE KNID = " + random;
		// console.log('optQuery', optQuery);
		queryDb(optQuery, updateOptions);

	});
};

function hoverOnRow() {
	let cells = this.getElementsByTagName('td');
	let prevCells = this.previousSibling.getElementsByTagName('td');
	if(prevCells.length == 3 && cells.length == 2 && prevCells[0].rowSpan != undefined)
		toggleHover(prevCells[0]);//.style.visibility = 'hidden';
	toggleHover(cells[0]);//.style.visibility = 'hidden';
	toggleHover(cells[1]);//.style.visibility = 'hidden';
	if(cells.length > 2) toggleHover(cells[2]);//.style.visibility = 'hidden';
}

function toggleHover(cell) {
	let supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	let isDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	let cellColor = 'transparent';
	cellColor = isDarked ? 'gray' : 'lightgray';
	cell.style.backgroundColor = cell.style.backgroundColor == cellColor ? '' : cellColor;
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
}

function setTabs() {
	for(let tab of document.getElementsByClassName('tab'))
	{
		let hasModules = Array.from(tab.childNodes).filter(c => c.childNodes.length > 0).length > 0;
		let button = document.getElementById('button-' + tab.id);
		button.style.cursor = hasModules ? 'pointer' : '';
		button.disabled = !hasModules;
	}
}

function showTab(activeTab) {
	for(let tab of document.getElementsByClassName('tab'))
	{
		tab.style.display = (tab.id == activeTab ? 'block' : 'none');
	}
}

//--FUNCTIONS--//
function startup() {
	generateFilters();
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	callDb(query, updateOptions);
}

async function callDb(query, callback) {
	let time = Date.now();
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
	  db = new SQL.Database(uInt8Array);
	  const contents = db.exec(query);
	  // console.log('callDb',contents);
	  if(contents && contents.length > 0)
		  callback(contents[0]);
	  else if(contents)
		  callback(contents);
	  // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
	};
	xhr.send();
	// console.log('callDb took', Date.now() - time, 'ms');
}

function queryDb(query, callback) {
	  const contents = db.exec(query);
	  // console.log('queryDb',contents);
	  if(contents && contents.length > 0)
		  return callback(contents[0]);
	  else if(contents)
		  return callback(contents);
	// console.log('callDb took', Date.now() - time, 'ms');
}

function generateTabs() {
	document.getElementById('tab-list').innerHTML = '';
	
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
		
		document.getElementById('tab-list').appendChild(tabItem);
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
		let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song WHERE SongTitle LIKE '%" + document.getElementById('search').value + "%'";
		query += " OR ArtistTitle LIKE '%" + document.getElementById('search').value + "%'";
		query += " OR KNYEAR LIKE '%" + document.getElementById('search').value + "%'";
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

function generatePlayer(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexFilename = contents.columns.indexOf('Filename');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
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
	audio.classList.add('player');
	audio.addEventListener('canplay', function() {
		document.getElementById('overlay').classList.add('hidden');
	});
	audio.addEventListener('volumechange', function() {
		localStorage.setItem('volume', document.getElementById('player').volume);
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
	
	selected = rows[0][columnIndexKNID];
	
	//max 10 related same year
	document.getElementById('songs-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseYear = '" + row[columnIndexReleaseYear] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	// console.log('queryRelated', query);
	queryDb(query, generaterSongsRelated);
	
	//max 10 related to artist
	document.getElementById('artist-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ArtistTitle = '" + row[columnIndexArtistTitle] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	// console.log('queryRelated', query);
	queryDb(query, generateArtistRelated);
	
	//max 10 related to release
	document.getElementById('release-related').innerHTML = '';
	query = "SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID];
	query += " AND ReleaseTitle LIKE '%" + reduceReleaseTitle(row[columnIndexReleaseTitle]) + "%'";
	query += " AND ReleaseArtistTitle = '" + row[columnIndexReleaseArtistTitle] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 10";
	// console.log('queryRelated', query);
	queryDb(query, generateReleaseRelated);
}

function generaterSongsRelated(contents) {
	if(debugMode) console.log('generaterSongsRelated', contents);
	if(!contents.columns || !contents.values) return;
	
	let columns = contents.columns;
	let rows = contents.values;
	
	if(rows.length < 1) return;
	if(rows[0][contents.columns.indexOf('ReleaseYear')].length < 1) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Songs from ' + rows[0][contents.columns.indexOf('ReleaseYear')];
	document.getElementById('songs-related').appendChild(header);	
	
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
	document.getElementById('songs-related').appendChild(table);
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
			tr.classList.add('highlight');
			tr.classList.add('not-selectable');
		}
		else {
			tr.style.cursor = 'pointer';
			tr.addEventListener('click', updateSong);
			tr.addEventListener('mouseover', hoverOnRow);
			tr.addEventListener('mouseout', hoverOnRow);
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
	// setTimeout(function() {
	// }, 200);
}

function reduceReleaseTitle(release) {
	//exception list to group multiple disc releases (data consistency required in db)
	return release.replace('Disc 1','').replace('Disc 2','').replace('Disc 3','').trim();
}