//timestamp display for audio player
let tableID = '2019';
let playerID = tableID + 'Player';
let domain = 'https://klassicnoteawards.webs.com/';
let timer;
let timestamps = new Array();
//title_string,table_row,time_in_seconds,rank_till_time
//for ranks with more than 1 result, order is same as order of push not table_row
timestamps.push(['2019', 24,    0, 20, 'Numakura Manami', 'irodori -color-']);
timestamps.push(['2019', 23,   45, 19, 'sphere', 'Sign']);
timestamps.push(['2019', 22,   94, 18, 'miwa', 'Reboot']);
timestamps.push(['2019', 20,  135, 17, 'Asakura Momo', 'Smash Drop']); //17-1
timestamps.push(['2019', 21,  179, 17, 'Natsukawa Shiina', 'Shimaeba Ii']); //17-2
timestamps.push(['2019', 19,  219, 16, 'Takigawa Arisa', 'Wagamama']);
timestamps.push(['2019', 17,  262, 15, 'Cocoro Auction', 'RUN']); //15-1
timestamps.push(['2019', 18,  303, 15, 'AyumiKurikaMaki', 'Bokura no Uta']); //15-2
timestamps.push(['2019', 16,  347, 14, 'SIX LOUNGE', 'Tenshi no Suitcase']);
timestamps.push(['2019', 15,  385, 13, 'Fuchigami Mai', 'Love Summer!']);
timestamps.push(['2019', 14,  429, 12, 'Yuuki Aoi', 'Shisenjou no Hana']);
timestamps.push(['2019', 13,  478, 11, 'Horie Yui', 'Asagao']);
timestamps.push(['2019', 12,  521, 10, 'Mrs. GREEN APPLE', 'Romanticism']);
timestamps.push(['2019', 11,  562,  9, 'TrySail', 'TryAgain']);
timestamps.push(['2019', 10,  606,  8, 'FIVE NEW OLD', 'What\'s Gonna Be?']);
timestamps.push(['2019',  9,  654,  7, 'Mrs. GREEN APPLE', 'Boku no Koto']);
timestamps.push(['2019',  7,  703,  6, 'Polkadot Stingray', 'DENKOUSEKKA']);
timestamps.push(['2019',  8,  747,  6, 'Ghost Sense', 'Mikansei no Shoudou']);
timestamps.push(['2019',  6,  793,  5, 'MaRuRi to Ryuga', 'Shiawase ni Natte']);
timestamps.push(['2019',  5,  844,  4, 'Yoru no Honki Dance', 'Take it back']);
timestamps.push(['2019',  3,  888,  3, 'Ryokuoushoku Shakai', 'sabotage']); //3-1
timestamps.push(['2019',  4,  932,  3, 'SHE\'S', 'Masquerade']); //3-2
timestamps.push(['2019',  2,  975,  2, 'cinema staff', 'Shiroi Sabaku no March']);
timestamps.push(['2019',  1, 1019,  1, 'Minase Inori', 'Catch The Rainbow!']);

timestamps.push(['2018', 22,    0, 20, 'YUKI', 'Traumerei']);
timestamps.push(['2018', 21,   41, 19, 'Sunrise In My Attache Case', 'Light The Fire']);
timestamps.push(['2018', 20,   90, 18, 'Numakura Manami', 'Desires']);
timestamps.push(['2018', 18,  135, 17, 'Amamiya Sora', 'Lilas']); //17-1
timestamps.push(['2018', 19,  175, 17, 'Asakura Momo', 'Fanfare!']); //17-2
timestamps.push(['2018', 17,  220, 16, 'nano.RIPE', 'Polaris']);
timestamps.push(['2018', 16,  269, 15, 'SECONDWALL', 'Beautiful Lie']);
timestamps.push(['2018', 15,  316, 14, 'Tsuji Shion', 'Oukan']);
timestamps.push(['2018', 14,  366, 13, 'Iwasaki Ai', 'HAGANE']);
timestamps.push(['2018', 13,  411, 12, 'Cider Girl', 'Evergreen']);
timestamps.push(['2018', 12,  460, 11, 'Ryokuoushoku Shakai', 'Little Singer']);
timestamps.push(['2018', 11,  506, 10, 'ORESAMA', 'Hi-Fi TRAIN']);
timestamps.push(['2018', 10,  550,  9, 'Polkadot Stingray', 'Telecaster Stripe']);
timestamps.push(['2018',  9,  596,  8, 'Yogee New Waves', 'Bluemin\' Days']);
timestamps.push(['2018',  8,  637,  7, 'THE ORAL CIGARETTES', 'Youshitenrei na Uso']);
timestamps.push(['2018',  7,  676,  6, 'LuckLife', 'Bokura']);
timestamps.push(['2018',  5,  721,  5, 'SHE\'S', 'The Everglow']); //5-1
timestamps.push(['2018',  6,  766,  5, 'wacci', 'Saijoukyuu']); //5-2
timestamps.push(['2018',  4,  810,  4, 'Sambomaster', 'Kagayaki Dashite Hasshiteku']);
timestamps.push(['2018',  3,  856,  3, 'GLIM SPANKY', 'Orokamono Tachi']);
timestamps.push(['2018',  2,  905,  2, 'Aqua Timez', 'over and over']);
timestamps.push(['2018',  1,  950,  1, 'Yoru no Honki Dance', 'Magical Feelin\'']);

// timestamps.push(['2017', 22,   41, 20, '', '']);
// timestamps.push(['2017', 21,   90, 19, '', '']);
// timestamps.push(['2017', 20,  135, 18, '', '']);
// timestamps.push(['2017', 18,  175, 17, '', '']);
// timestamps.push(['2017', 19,  220, 17, '', '']);
// timestamps.push(['2017', 17,  269, 16, '', '']);
// timestamps.push(['2017', 16,  316, 15, '', '']);
// timestamps.push(['2017', 15,  366, 14, '', '']);
// timestamps.push(['2017', 14,  411, 13, '', '']);
// timestamps.push(['2017', 13,  460, 12, '', '']);
// timestamps.push(['2017', 12,  506, 11, '', '']);
// timestamps.push(['2017', 11,  550, 10, '', '']);
// timestamps.push(['2017', 10,  596,  9, '', '']);
// timestamps.push(['2017',  9,  637,  8, '', '']);
// timestamps.push(['2017',  8,  676,  7, '', '']);
// timestamps.push(['2017',  7,  721,  6, '', '']);
// timestamps.push(['2017',  5,  766,  5, '', '']);
// timestamps.push(['2017',  6,  810,  5, '', '']);
// timestamps.push(['2017',  4,  856,  4, '', '']);
// timestamps.push(['2017',  3,  905,  3, '', '']);
// timestamps.push(['2017',  2,  950,  2, '', '']);
// timestamps.push(['2017',  1, 1029,  1, '', '']);


//--FUNCTIONS--//
window.onload = startup();

function startup() {
	generateSidemenu();
	hideIrrelevant();
	generateTable(tableID);
	generatePlayer(tableID);
	createDarkMode();
}

function generateTable(tableID) {
	document.getElementById('table').innerHTML = '';
	
	let table = document.createElement('table');
	table.id = tableID;
	table.classList.add('list');
	table.classList.add('centered');
	
	let tbody = document.createElement('tbody');
	
	//header
	let th = document.createElement('tr');
		
		let td1 = document.createElement('td');
		td1.width = 30;
		td1.innerText = 'Rank';			
		th.appendChild(td1);
		
		let td2 = document.createElement('td');
		td2.width = 270;
		td2.innerText = 'Song Title';			
		th.appendChild(td2);
		
		let td3 = document.createElement('td');
		td3.width = 270;
		td3.innerText = 'Contributing Artist(s)';			
		th.appendChild(td3);
		
	tbody.appendChild(th);
	
	for(let rank = 1; rank <= 20; rank++)
	{
		let stamps = timestamps.filter(function(n) {
			return n[0] == tableID && n[3] == rank;
		})
		
		if(stamps.length > 1)
		{
			let tr = document.createElement('tr');
			tr.style.cursor = 'pointer';
			tr.setAttribute('seek',stamps[0][2]);
			tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
			
				let td1 = document.createElement('td');
				td1.style.textAlign = 'right';
				td1.setAttribute('rowspan', 2);
				td1.innerText = stamps[0][3];
				tr.appendChild(td1);
				
				let td2 = document.createElement('td');
				td2.innerText = stamps[0][5];
				tr.appendChild(td2);
				
				let td3 = document.createElement('td');
				td3.innerText = stamps[0][4];
				tr.appendChild(td3);
			
			tbody.appendChild(tr);
			
			tr = document.createElement('tr');
			tr.style.cursor = 'pointer';
			tr.setAttribute('seek',stamps[1][2]);
			tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
							
				td2 = document.createElement('td');
				td2.innerText = stamps[1][5];
				tr.appendChild(td2);
				
				td3 = document.createElement('td');
				td3.innerText = stamps[1][4];
				tr.appendChild(td3);
			
			tbody.appendChild(tr);
		}
		else
		{
			let tr = document.createElement('tr');
			tr.style.cursor = 'pointer';
			tr.setAttribute('seek',stamps[0][2]);
			tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
			
				let td1 = document.createElement('td');
				td1.style.textAlign = 'right';
				td1.innerText = stamps[0][3];
				tr.appendChild(td1);
				
				let td2 = document.createElement('td');
				td2.innerText = stamps[0][5];
				tr.appendChild(td2);
				
				let td3 = document.createElement('td');
				td3.innerText = stamps[0][4];
				tr.appendChild(td3);
			
			tbody.appendChild(tr);
		}
	}
	
	//footer
	while(tbody.getElementsByTagName('tr').length < 25)
	{
		let tf = document.createElement('tr');
		tf.style.visibility = 'hidden';
		
		let td = document.createElement('td');
		td.setAttribute('colspan', 3);
		td.innerText = '_';			
		tf.appendChild(td);
		
		tbody.appendChild(tf);
	}
		
	table.appendChild(tbody);
	document.getElementById('table').appendChild(table);
}

function generateSeek(time) {
	let player = document.getElementById('music').getElementsByClassName('player')[0];
	player.currentTime = time;
	player.play();
	runTimestamp();
}

function generatePlayer(tableID) {
	document.getElementById('music').innerHTML = '';
		
	let audio = document.createElement('audio');
	audio.id = tableID + 'Player';
	audio.classList.add('player');
	audio.addEventListener('playing', runTimestamp);
	audio.addEventListener('seeking', clearTimestamp);
	audio.controls = true;
	audio.volume = 0.5;
	
	let source = document.createElement('source');
	if(tableID == '2019') source.src = domain + 'awardrankings2019.mp3';
	if(tableID == '2018') source.src = domain + 'awardrankings2018-1.mp3';
	if(tableID == '2017') source.src = domain + 'awardrankings2017.mp3';
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
			tableID = this.innerText;
			playerID = this.innerText + 'Player';
			//for(let player of document.getElementsByClassName('player'))
			//{
			//	player.load();
			//}
			generateTable(tableID);
			generatePlayer(tableID);
            clearInterval(timer);
			clearTimestamp();
			hideIrrelevant();
		});
		document.getElementById('sidebar').appendChild(item);
	}
}

function hideIrrelevant() {
/* 	for(let table of document.getElementsByClassName('list'))
	{
		table.style.display = table.id != tableID ? 'none' : '';
	}
	for(let player of document.getElementsByClassName('player'))
	{
		player.style.display = player.id != playerID ? 'none' : '';
	}
 */	for(let year of document.getElementsByClassName('year'))
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
    for (let pair of timestamps.filter(time => time[0] == tableID).sort((a,b) => b[2] - a[2])) {
        if (pair[2] <= currentTime) {
            currentPos = pair[1];
            break;
        }
        prevPos = pair;
    }
    //only change when time of next has passed: current to normal, next to bold
    if (currentPos == undefined) clearInterval(timer);
    else {
        if (prevPos != undefined && currentTime <= prevPos[2]) clearTimestamp();
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