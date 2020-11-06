//timestamp display for audio player
let tableID = '2019';
let playerID = tableID + 'Player';
let timer;
let timestamps = new Array();
//title_string,table_row,time_in_seconds,rank_till_time
timestamps.push(['2019', 24,   45, 20]);
timestamps.push(['2019', 23,   94, 19]);
timestamps.push(['2019', 22,  135, 18]);
timestamps.push(['2019', 20,  179, 17-1]);
timestamps.push(['2019', 21,  219, 17-2]); //17th has two places, so order is same as order of play
timestamps.push(['2019', 19,  262, 16]);
timestamps.push(['2019', 17,  303, 15-1]);
timestamps.push(['2019', 18,  347, 15-2]);
timestamps.push(['2019', 16,  385, 14]);
timestamps.push(['2019', 15,  429, 13]);
timestamps.push(['2019', 14,  478, 12]);
timestamps.push(['2019', 13,  521, 11]);
timestamps.push(['2019', 12,  562, 10]);
timestamps.push(['2019', 11,  606, 9]);
timestamps.push(['2019', 10,  654, 8]);
timestamps.push(['2019',  9,  703, 7]);
timestamps.push(['2019',  7,  747, 6-1]);
timestamps.push(['2019',  8,  793, 6-2]);
timestamps.push(['2019',  6,  844, 5]);
timestamps.push(['2019',  5,  888, 4]);
timestamps.push(['2019',  3,  932, 3-1]);
timestamps.push(['2019',  4,  975, 3-2]);
timestamps.push(['2019',  2, 1019, 2]);
timestamps.push(['2019',  1, 1109, 1]);

timestamps.push(['2018', 22,   41, 20]);
timestamps.push(['2018', 21,   90, 19]);
timestamps.push(['2018', 20,  135, 18]);
timestamps.push(['2018', 18,  175, 17-1]);
timestamps.push(['2018', 19,  220, 17-2]);
timestamps.push(['2018', 17,  269, 16]);
timestamps.push(['2018', 16,  316, 15]);
timestamps.push(['2018', 15,  366, 14]);
timestamps.push(['2018', 14,  411, 13]);
timestamps.push(['2018', 13,  460, 12]);
timestamps.push(['2018', 12,  506, 11]);
timestamps.push(['2018', 11,  550, 10]);
timestamps.push(['2018', 10,  596, 9]);
timestamps.push(['2018',  9,  637, 8]);
timestamps.push(['2018',  8,  676, 7]);
timestamps.push(['2018',  7,  721, 6]);
timestamps.push(['2018',  5,  766, 5-1]);
timestamps.push(['2018',  6,  810, 5-2]);
timestamps.push(['2018',  4,  856, 4]);
timestamps.push(['2018',  3,  905, 3]);
timestamps.push(['2018',  2,  950, 2]);
timestamps.push(['2018',  1, 1029, 1]);


window.onload = startup();

function startup() {
	generateSidemenu();
	hideIrrelevant();
	createDarkMode();
}

//for side menu, add all tables to have list class, use ids to generate
function generateSidemenu() {	
	for(let table of document.getElementsByClassName('list'))
	{
		let item = document.createElement('span');
		item.classList.add('year');
		item.innerText = table.id;
		item.addEventListener('click', function() {
			tableID = this.innerText;
			playerID = this.innerText + 'Player';
			for(let player of document.getElementsByClassName('player'))
			{
				player.load();
			}
            clearInterval(timer);
			clearTimestamp();
			hideIrrelevant();
		});
		document.getElementById('sidebar').appendChild(item);
	}
}

function hideIrrelevant() {
	for(let table of document.getElementsByClassName('list'))
	{
		table.style.display = table.id != tableID ? 'none' : '';
	}
	for(let player of document.getElementsByClassName('player'))
	{
		player.style.display = player.id != playerID ? 'none' : '';
	}
	for(let year of document.getElementsByClassName('year'))
	{
		year.style.fontWeight = year.innerText != tableID ? 'normal' : 'bold';
	}
}

function createDarkMode() {
	if(document.getElementById('darkmode') != undefined)
		document.getElementById('darkmode').addEventListener('click', function() {
			if(document.getElementsByTagName('html')[0].classList.contains('darked'))
				document.getElementsByTagName('html')[0].classList.remove('darked');
			else
				document.getElementsByTagName('html')[0].classList.add('darked');
		} );
}


function runTimestamp() {
    timer = setInterval(setTimestamp, 1000);
}

function setTimestamp() {
    //get player, table
    let audioPlayer = document.getElementById(playerID);
    let audioTable = document.getElementById(tableID);
	//if(audioPlayer == null || audioTable == null) return;
    //find current supposed highlighted based on time on player
    let currentTime = Math.floor(audioPlayer.currentTime);
    let currentPos;
    let prevPos;
    for (let pair of timestamps.filter(time => time[0] == tableID)) {
        if (pair[2] >= currentTime) {
            currentPos = pair[1];
            break;
        }
        prevPos = pair;
    }
    //only change when time of next has passed: current to normal, next to bold
    if (currentPos == undefined) clearInterval(timer);
    else {
        if (prevPos != undefined && currentTime >= prevPos[2]) clearTimestamp();
        if (!audioPlayer.paused) {
			//if has colspan on column 0 ensure on second row cell on first row is highlighted
            if(audioTable.getElementsByTagName("tr")[currentPos].cells.length == 2)
				audioTable.getElementsByTagName("tr")[currentPos-1].cells[0].style.fontWeight = "bold";
            audioTable.getElementsByTagName("tr")[currentPos].style.fontWeight = "bold";
        }
        else {
            audioTable.getElementsByTagName("tr")[currentPos].style.fontWeight = "normal";
            clearInterval(timer);
        }
    }
}

function clearTimestamp() {
    for (let row of document.getElementById(tableID).getElementsByTagName("tr")) {
        if(row.cells.length == 3) row.cells[0].style.fontWeight = null;
        row.style.fontWeight = "normal";
    }
}