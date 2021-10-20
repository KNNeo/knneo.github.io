//--CONFIG--//
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3

//----------------------------//
//--VARIABLES: DO NOT TOUCH!--//

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

//--FUNCTIONS--//
function startup() {
	generateFilters();
	let query = "SELECT KNID, KNYEAR, SongTitle, ArtistTitle FROM Song";
	if(isMobile())
		query += " LIMIT 100";
	queryDb(query, updateOptions);
}

async function queryDb(query, callback) {
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
	  const db = new SQL.Database(uInt8Array);
	  const contents = db.exec(query);
	  // console.log('queryDb',contents);
	  if(contents && contents.length > 0)
		  callback(contents[0]);
	  else if(contents)
		  callback(contents);
	  // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
	};
	xhr.send();
	// console.log('queryDb took', Date.now() - time, 'ms');
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
			opt.innerText = newOption.optionString;
			
			options.appendChild(opt);
		}
		if(newOptions.length == 2) //1 result with default
		{
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
	setTimeout(generateSongInfo(contents), 100);
	setTimeout(queryRelated(contents), 200);
	setTimeout(queryRanking(contents), 300);
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
	document.getElementById('songinfo').innerHTML = '';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Info';
	document.getElementById('songinfo').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	// table.id = 'table';
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
	document.getElementById('songinfo').appendChild(table);
}

function queryRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	//max 5 related to artist, rest same KNYEAR
	let query = "SELECT * FROM (SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID] + " AND ArtistTitle = '" + row[columnIndexArtistTitle] + "'";
	query += " ORDER BY RANDOM() DESC LIMIT 5)";
	query += " UNION ALL SELECT * FROM (SELECT * FROM Song WHERE KNYEAR = '" + row[columnIndexKNYEAR] + "'";
	query += " AND KNID <> " + row[columnIndexKNID] + " AND KNID NOT IN (SELECT KNID FROM Song WHERE ArtistTitle = '" + row[columnIndexArtistTitle] + "')";
	query += " ORDER BY RANDOM() DESC) LIMIT 10";
	// console.log('queryRelated', query);
	queryDb(query, generateRelatedSongs);
}

function generateRelatedSongs(contents) {
	document.getElementById('relatedsongs').innerHTML = '';
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Related Songs';
	document.getElementById('relatedsongs').appendChild(header);	
	
	let columns = contents.columns;
	let rows = contents.values;
	
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
		tc.addEventListener('click', async function() {
			let id = this.getAttribute('data-id');
			let query = "SELECT * FROM Song WHERE KNID = " + row[columnIndexKNID];
			// console.log('query', query);
			await queryDb(query, updateOptions);
			setTimeout(function() {
				document.getElementById('options').value = id;
				document.getElementById('options').dispatchEvent(new Event('change'));
			}, 200);
			
		});
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
	document.getElementById('relatedsongs').appendChild(table);
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
	document.getElementById('yearranking').innerHTML = '';
	let columns = contents.columns;
	let rows = contents.values;
	if(contents.length == 0) return;
	
	let header = document.createElement('h4');
	header.classList.add('centered');
	header.innerText = 'Song Rankings';
	document.getElementById('yearranking').appendChild(header);	
	
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
		tr.setAttribute('data-id', row[columnIndexKNID]);
		tr.style.cursor = 'pointer';
		tr.addEventListener('click', async function() {
			let id = this.getAttribute('data-id');
			let query = "SELECT * FROM Song WHERE KNID = " + row[columnIndexKNID];
			// console.log('query', query);
			await queryDb(query, updateOptions);
			setTimeout(function() {
				document.getElementById('options').value = id;
				document.getElementById('options').dispatchEvent(new Event('change'));
			}, 200);
			
		});
		tr.addEventListener('mouseover', hoverOnRow);
		tr.addEventListener('mouseout', hoverOnRow);
	
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
	document.getElementById('yearranking').appendChild(table);
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