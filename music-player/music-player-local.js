//timestamp display for audio player
let tableID = '2020';
let playerID = tableID + 'Player';
let domain = 'https://klassicnoteawards.webs.com/';
let timer;
let directory = 'file://C:/Users/KAINENG/OneDrive/Music/';
let musicList = [
//{'category','directory','title','artist','album','genre','date'},
//{'KNYEAR','filename','SISSOU','Yogee New Waves','WINDORGAN','JRock','2021-10-13'},

];
let timestamps = new Array();
//title_string,table_row,time_in_seconds,rank_till_time
//for ranks with more than 1 result, order is same as order of push not table_row


//--BASE--//
// timestamps.push(['year', 20,  0, 20, '', '']);
// timestamps.push(['year', 18,  0, 19, '', '']);
// timestamps.push(['year', 19,  0, 18, '', '']);
// timestamps.push(['year', 17,  0, 17, '', '']);
// timestamps.push(['year', 16,  0, 16, '', '']);
// timestamps.push(['year', 15,  0, 15, '', '']);
// timestamps.push(['year', 14,  0, 14, '', '']);
// timestamps.push(['year', 13,  0, 13, '', '']);
// timestamps.push(['year', 12,  0, 12, '', '']);
// timestamps.push(['year', 11,  0, 11, '', '']);
// timestamps.push(['year', 10,  0, 10, '', '']);
// timestamps.push(['year',  9,  0,  9, '', '']);
// timestamps.push(['year',  8,  0,  8, '', '']);
// timestamps.push(['year',  7,  0,  7, '', '']);
// timestamps.push(['year',  5,  0,  6, '', '']);
// timestamps.push(['year',  6,  0,  5, '', '']);
// timestamps.push(['year',  4,  0,  4, '', '']);
// timestamps.push(['year',  3,  0,  3, '', '']);
// timestamps.push(['year',  2,  0,  2, '', '']);
// timestamps.push(['year',  1,  0,  1, '', '']);
//--------//


//--FUNCTIONS--//
let pageContent;
window.addEventListener('load', startup);

async function queryDb(query, callback) {
	//for webassembly file
	const SQL = await initSqlJs({
	  // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
	  // You can omit locateFile completely when running in node
	  locateFile: file => `https://knneo.github.io/music-player/sql-wasm.wasm`
	});

	// for sqlite db
	const xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://knneo.github.io/klassic-note-table/db/KlassicNote.db', true);
	xhr.responseType = 'arraybuffer';

	xhr.onload = e => {
	  const uInt8Array = new Uint8Array(xhr.response);
	  const db = new SQL.Database(uInt8Array);
	  const contents = db.exec(query);
	  if(contents && contents.length > 0)
	  {
		  callback(contents[0]);
	  }
	  // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
	  
		// generateTable(tableID, contents[0]);
	};
	xhr.send();
}

function startup() {	

	// queryDb("SELECT * from Song WHERE KNYEAR = '2021'");
	// queryDb("SELECT * from Song WHERE KNYEAR = '2008'");
	
	// timestamps = timestamps.sort((a,b) => a[1] - b[1]);
	// if(document.getElementById('sidebar') != undefined) 
	// {
		// generateSidemenu();
		// hideIrrelevant();
	// }
	// generateTable(tableID);
	
	generateFilters();
}

function generateFilters() {
	let filters = document.getElementById('filters');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.placeholder = 'Search by Song Title';
	search.addEventListener('input', async function() {
		// update options
		console.log('querySelect', document.getElementById('search').value);
		await queryDb("SELECT * FROM Song WHERE SongTitle LIKE '%" + document.getElementById('search').value + "%'", updateOptions);
	});
/* 	search.addEventListener('keyup', function () {
		//update options
		if (event.keyCode === 13) { // "Enter"
			event.preventDefault();
			document.getElementById("submit").click();
		}
	}); */
	filters.appendChild(search);
	
/* 	let submitBtn = document.createElement('button');
	submitBtn.type = 'submit';
	submitBtn.id = 'submitBtn';
	submitBtn.innerText = 'Submit';
	submitBtn.addEventListener('click ', async function() {
		//update options
		console.log('query',document.getElementById('search').value);
		await queryDb("SELECT * FROM Song WHERE SongTitle LIKE '%" + document.getElementById('search').value + "%'", updateOptions);
	});
	filters.appendChild(submitBtn); */
	
	let options = document.createElement('select');
	options.id = 'options';
	options.addEventListener('change', async function() {
		//update tables
		console.log('queryOption', document.getElementById('options').value);
		if(document.getElementById('options').value > 0)
			await queryDb("SELECT * FROM Song WHERE KNID = " + document.getElementById('options').value, generateLayout);
		//probably can multiple query for multiple tables, by semicolon
	});	
	filters.appendChild(options);
}

function updateOptions(contents) {
	console.log('updateOptions', contents);
	let options = document.getElementById('options');
	let newOptions = [];
	
	let columnIndexKNID = contents.columns.indexOf('KNID');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let columnIndexSongTitle = contents.columns.indexOf('SongTitle');
	let columnIndexArtistTitle = contents.columns.indexOf('ArtistTitle');
	//default empty
	newOptions.push({
		id: 0,
		optionString: '===' + contents.values.length + ' options==='
	});
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
	
	options.innerHTML = '';
	for(let newOption of newOptions)
	{
		let opt = document.createElement('option');
		opt.value = newOption.id;
		opt.innerText = newOption.optionString;
		
		options.appendChild(opt);
	}
}

function generateLayout(contents) {
	generatePlayer(contents);
	generateTable(contents);
}

function generateTable(contents) {
	document.getElementById('table').innerHTML = '';
	
	let columns = contents.columns;
	let rows = contents.values;
	
	let table = document.createElement('table');
	// table.id = 'table';
	table.classList.add('list');
	table.classList.add('centered');
	
	let tbody = document.createElement('tbody');
	
	//header
	let th = document.createElement('tr');
	for(let column of columns) 
	{
		
		let td1 = document.createElement('th');
		// td1.width = 35;
		td1.innerText = column;
		th.appendChild(td1);
		
	}
	tbody.appendChild(th);
	
	for(let row of rows)
	{
		let tr = document.createElement('tr');
		tr.style.cursor = 'pointer';
		// tr.setAttribute('seek',stamps[0][2]);
		tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
		tr.addEventListener('mouseover', hoverOnRow);
		tr.addEventListener('mouseout', hoverOnRow);
		for(let rowVal of row)
		{
			let td1 = document.createElement('td');
			// td1.style.textAlign = 'right';
			// td1.setAttribute('rowspan', 2);
			td1.innerText = rowVal;
			tr.appendChild(td1);			
		}
		tbody.appendChild(tr);
	}
	
	//footer
	// while(tbody.getElementsByTagName('tr').length < 25)
	// {
		// let tf = document.createElement('tr');
		// tf.classList.add('empty');
		// tf.style.visibility = 'hidden';
		
		// let td = document.createElement('td');
		// td.setAttribute('colspan', 3);
		// td.innerText = '_';			
		// tf.appendChild(td);
		
		// tbody.appendChild(tf);
	// }
		
	table.appendChild(tbody);
	document.getElementById('table').appendChild(table);
}

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

function generateSeek(time) {
	let player = document.getElementById('music').getElementsByClassName('player')[0];
	player.currentTime = time;
	player.play();
}

function generatePlayer(contents) {
	if(contents.values.length > 1) return;
	let row = contents.values[0];
	
	let columnIndexFilename = contents.columns.indexOf('Filename');
	let columnIndexKNYEAR = contents.columns.indexOf('KNYEAR');
	let filename = row[columnIndexFilename];
	let knyear = row[columnIndexKNYEAR];
	
	document.getElementById('music').innerHTML = '';
		
	let audio = document.createElement('audio');
	audio.id = tableID + 'Player';
	audio.classList.add('player');
	// audio.addEventListener('playing', runTimestamp);
	// audio.addEventListener('seeking', clearTimestamps);
	audio.controls = true;
	audio.volume = 0.5;
	audio.controlsList = 'nodownload';
	
	let source = document.createElement('source');
	// if(tableID == '2018') source.src = domain + 'awardrankings2018-1.mp3';
	// else source.src = domain + 'awardrankings' + tableID + '.mp3';
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

//actual timestamp run event when playing
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