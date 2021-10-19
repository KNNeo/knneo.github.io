//--CONFIG--//
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/'; //for audio player, in {directory}/{knyear}/{filename}.mp3


//----------------------------//
//--VARIABLES: DO NOT TOUCH!--//
let timer;


//--STARTUP--//
window.addEventListener('load', startup);

//--FUNCTIONS--//
async function queryDb(query, callback) {
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
}

async function startup() {
	// timestamps = timestamps.sort((a,b) => a[1] - b[1]);
	// if(document.getElementById('sidebar') != undefined) 
	// {
		// generateSidemenu();
		// hideIrrelevant();
	// }
	// generateTable(tableID);
	
	generateFilters();
	if(!isMobile())
		queryDb("SELECT * FROM Song", updateOptions);
}

function generateFilters() {
	let filters = document.getElementById('filters');
	filters.classList.add('centered');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.placeholder = 'Song Title, Artist Title, KNYEAR';
	search.addEventListener('input', function() {
		// update options
		// console.log('querySelect', document.getElementById('search').value);
		let query = "SELECT * FROM Song WHERE SongTitle LIKE '%" + document.getElementById('search').value + "%'";
		query += " OR ArtistTitle LIKE '%" + document.getElementById('search').value + "%'";
		query += " OR KNYEAR LIKE '%" + document.getElementById('search').value + "%'";
		// console.log('query', query);
		queryDb(query, updateOptions);
	});
	filters.appendChild(search);
	
	let options = document.createElement('select');
	options.id = 'options';
	options.addEventListener('change', function() {
		//update tables
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
		optionString: '===' + (contents?.values?.length || 0) + ' options==='
	});
	
	if(contents.values && contents.values.length > 0)
	{
		let columnIndexKNID = contents.columns.indexOf('KNID');
		let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
		let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
		let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
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
	// console.log('newOptions', newOptions);
}

let random = document.getElementById('random');
random.addEventListener('click', async function() {
	document.getElementById('search').value = '';
	let query = "SELECT * FROM Song";
	// console.log('query', query);
	await queryDb(query, updateOptions);
	let total = document.getElementById('options').length - 1;
	let random = Math.floor((Math.random() * total));
	setTimeout(function() {
		document.getElementById('options').value = random;
		document.getElementById('options').dispatchEvent(new Event('change'));
	}, 200);
});

async function generateLayout(contents) {
	// console.log('generateLayout', contents);
	generatePlayer(contents);
	// generateCoverArt();
	setTimeout(generateSongInfo(contents), 100);
	setTimeout(generateRelated(contents), 100);
	scrollToTop();
}

function scrollToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
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


function generateRelated(contents) {
	let columns = contents.columns;
	let rows = contents.values;
	let row = rows[0];
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	//max 5 related to artist, rest same KNYEAR
	let query = "SELECT * FROM (SELECT * FROM Song WHERE KNID <> " + row[columnIndexKNID] + " AND ArtistTitle = '" + row[columnIndexArtistTitle] + "'";
	query += " ORDER BY DateCreated DESC LIMIT 5)";
	query += " UNION ALL SELECT * FROM (SELECT * FROM Song WHERE KNYEAR = '" + row[columnIndexKNYEAR] + "'";
	query += " AND KNID <> " + row[columnIndexKNID] + " AND KNID NOT IN (SELECT KNID FROM Song WHERE ArtistTitle = '" + row[columnIndexArtistTitle] + "')";
	query += " ORDER BY DateCreated DESC) LIMIT 10";
	// console.log('generateRelated', query);
	queryDb(query, generateRelatedSongs);
}

async function generateRelatedSongs(contents) {
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
			let query = "SELECT * FROM Song";
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

function hoverOnRow() {
	if(false) {
		let cells = this.getElementsByTagName('td');
		let prevCells = this.previousSibling.getElementsByTagName('td');
		if(prevCells.length == 3 && cells.length == 2 && prevCells[0].rowSpan != undefined)
			toggleHover(prevCells[0]);//.style.visibility = 'hidden';
		toggleHover(cells[0]);//.style.visibility = 'hidden';
		toggleHover(cells[1]);//.style.visibility = 'hidden';
		if(cells.length > 2) toggleHover(cells[2]);//.style.visibility = 'hidden';
	}
	toggleHover(this);
}

function toggleHover(cell) {
	let supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	let isDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	let cellColor = 'transparent';
	cellColor = isDarked ? 'gray' : 'lightgray';
	cell.style.backgroundColor = cell.style.backgroundColor == cellColor ? '' : cellColor;
}

function generateSeek(time) {
	let player = document.getElementById('music').getElementsByClassName('player')[0];
	player.currentTime = time;
	player.play();
}

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
	audio.controls = true;
	audio.autoplay = true;
	audio.volume = 0.5;
	audio.controlsList = 'nodownload';
	
	let source = document.createElement('source');
	source.src = directory + knyear + '/' + filename + '.mp3';
	source.type = 'audio/mpeg';
	source.innerText = '[You\'ll need a newer browser that supports HTML5 to listen to this.]';
	
	audio.appendChild(source);
	document.getElementById('music').appendChild(audio);
}

//for side menu, add all tables to have list class, use ids to generate
function generateSidemenu() {
	let years = [];
	timestamps.map(function(n) {
		if(years.indexOf(n[0]) < 0) years.push(n[0]);
	});
	for(let year of years)
	{
		let item = document.createElement('span');
		item.classList.add('year');
		item.innerText = year;
		item.addEventListener('click', function() {
			window.location.hash = '#' + this.innerText;
			tableID = this.innerText;
			playerID = this.innerText + 'Player';
			generateTable(tableID);
			generatePlayer(tableID);
            clearInterval(timer);
			clearTimestamps();
			hideIrrelevant();
		});
		document.getElementById('sidebar').appendChild(item);
	}
	
	//if location has anchor, click on year (eg. "?year=2020")
	if(years.indexOf(window.location.hash.slice(1)) >= 0)
	{
			tableID = window.location.hash.slice(1);
			playerID = window.location.hash.slice(1) + 'Player';
			generateTable(tableID);
			generatePlayer(tableID);
            clearInterval(timer);
			clearTimestamps();
			hideIrrelevant();
	}
}

function hideIrrelevant() {
	for(let year of document.getElementsByClassName('year'))
	{
		year.style.fontWeight = year.innerText != tableID ? 'normal' : 'bold';
	}
}

//actual timestamp run event when playing - NOT IN USE HERE//
function runTimestamp() {
    timer = setInterval(checkTimestamps, 1000);
}

function checkTimestamps() {
    //get player, table
    let audioPlayer = document.getElementById(playerID);
    let audioTable = document.getElementById(tableID);
	//if(audioPlayer == null || audioTable == null) return;
    //find current supposed highlighted based on time on player
    let currentTime = Math.floor(audioPlayer.currentTime);
    let currentPos;
    let prevPos;
    for (let pair of timestamps.filter(time => time[0] == tableID).sort((a,b) => b[2] - a[2])) {
        prevPos = pair;
        if (pair[2] <= currentTime) {
            currentPos = pair[1];
            break;
        }
    }
    //only change when time of next has passed: current to normal, next to bold
    if (currentPos == undefined) clearInterval(timer);
    else {
        if (prevPos != undefined && prevPos[2] <= currentTime) clearTimestamps();
        if (!audioPlayer.paused) {
			//if has colspan on column 0 ensure on second row cell on first row is highlighted
            if(audioTable.getElementsByTagName("tr")[currentPos].cells.length == 2)
				setTimestamp(audioTable.getElementsByTagName("tr")[currentPos-1].cells[0]);//.style.fontWeight = "bold";
            setTimestamp(audioTable.getElementsByTagName("tr")[currentPos]);//.style.fontWeight = "bold";
        }
        else {
			clearTimestamps();
            //audioTable.getElementsByTagName("tr")[currentPos].style.fontWeight = "normal";
            clearInterval(timer);
        }
    }
	//console.log(currentTime, currentPos, prevPos);
}

function setTimestamp(cell) {
	cell.style.fontWeight = "bold";
}

function clearTimestamps() {
    for (let row of document.getElementById(tableID).getElementsByTagName("tr")) {
        if(row.cells.length == 3) row.cells[0].style.fontWeight = null;
        row.style.fontWeight = "normal";
    }
}