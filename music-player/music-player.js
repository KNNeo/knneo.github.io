window.onload = createDarkMode();

function createDarkMode() {
	if(document.getElementById('darkmode') != undefined)
		document.getElementById('darkmode').addEventListener('click', function() {
			if(document.getElementsByTagName('html')[0].classList.contains('darked'))
				document.getElementsByTagName('html')[0].classList.remove('darked');
			else
				document.getElementsByTagName('html')[0].classList.add('darked');
		} );
}

//timestamp display for audio player
let timer;
let timestamps = new Array();
timestamps.push([24, 45, 20]); //position,time, rank: time is when current position ends
timestamps.push([23, 94, 19]);
timestamps.push([22, 135, 18]);
timestamps.push([20, 179, 17-1]);
timestamps.push([21, 219, 17-2]); //17th has two places, 2nd order to place before 1st
timestamps.push([19, 262, 16]);
timestamps.push([17, 303, 15-1]);
timestamps.push([18, 347, 15-2]);
timestamps.push([16, 385, 14]);
timestamps.push([15, 429, 13]);
timestamps.push([14, 478, 12]);
timestamps.push([13, 521, 11]);
timestamps.push([12, 562, 10]);
timestamps.push([11, 606, 9]);
timestamps.push([10, 654, 8]);
timestamps.push([9, 703, 7]);
timestamps.push([7, 749, 6-1]);
timestamps.push([8, 793, 6-2]);
timestamps.push([6, 844, 5]);
timestamps.push([5, 888, 4]);
timestamps.push([3, 932, 3-1]);
timestamps.push([4, 975, 3-2]);
timestamps.push([2, 1019, 2]);
timestamps.push([1, 1109, 1]);

function runTimestamp() {
    timer = setInterval(setTimestamp, 1000);
}

let playerID = 'Top20Audio';
let tableID = 'Top20';
function setTimestamp() {
    //get player, table
    let audioPlayer = document.getElementById(playerID);
    let audioTable = document.getElementById(tableID);
	//if(audioPlayer == null || audioTable == null) return;
    //find current supposed highlighted based on time on player
    let currentTime = Math.floor(audioPlayer.currentTime);
    let currentPos;
    let prevPos;
    for (let pair of timestamps) {
        if (pair[1] >= currentTime) {
            currentPos = pair[0];
            break;
        }
        prevPos = pair;
    }
    //only change when time of next has passed: current to normal, next to bold
    if (currentPos == undefined) clearInterval(timer);
    else {
        if (prevPos != undefined && currentTime >= prevPos[1]) clearTimestamp();
        if (!audioPlayer.paused) {
            if(audioTable.getElementsByTagName("tr")[currentPos].cells.length == 2) audioTable.getElementsByTagName("tr")[currentPos-1].getElementsByTagName("td")[0].style.fontWeight = "bold";
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
        if(row.cells.length == 3) row.getElementsByTagName("td")[0].style.fontWeight = null;
        row.style.fontWeight = "normal";
    }
}