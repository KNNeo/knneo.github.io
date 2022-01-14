//--DEFAULT SETTINGS--//


//--VARIABLES--//
let startTime;
let endTime;
let timer;


//--COMMON EVENTS--//
//on startup
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;


//--FUNCTIONS--//
function startTimer() {
    timer = setInterval(updateTimer, 1000);
	startTime = new Date();
	document.getElementById('xp').innerText = '-';
	document.getElementById('cash').innerText = '-';
	document.getElementById('gold').innerText = '-';
	document.getElementById('minute').innerText = '00';
	document.getElementById('second').innerText = '00';
	document.getElementById('start').disabled = true;
	document.getElementById('stop').disabled = false;
}

function updateTimer() {
	endTime = new Date();
	let diff = endTime - startTime;
	let diffMinutes = Math.floor(diff/60000);
	let diffSeconds = Math.floor((diff - (diffMinutes*60000))/1000);
	document.getElementById('minute').innerText = diffMinutes < 10 ? '0' + diffMinutes : diffMinutes;
	document.getElementById('second').innerText = diffSeconds < 10 ? '0' + diffSeconds : diffSeconds;
	showResults();
	if(diffMinutes >= 30) stopTimer();
}

function stopTimer() {
	clearInterval(timer);
	endTime = new Date();
	document.getElementById('start').disabled = false;
	document.getElementById('stop').disabled = true;
}

function showResults() {
	let diffMinutes = Math.floor((endTime - startTime)/60000);
	
	//get from inputs
	let targets = document.getElementById('targets').value;
	let tier1checked = document.getElementById('tier1').checked;
	let tier2checked = document.getElementById('tier2').checked;
	let tier3checked = document.getElementById('tier3').checked
	let condition1checked = document.getElementById('condition1').checked;
	let condition2checked = document.getElementById('condition2').checked;
	let condition3checked = document.getElementById('condition3').checked;
	
	//derived
	let targetsMultiplier = targets;
	
	let tierMultiplier;
	if(tier1checked) tierMultiplier = 1;
	if(tier2checked) tierMultiplier = 1.25;
	if(tier3checked) tierMultiplier = 1.5;
	
	let conditionMultiplier;
	if(condition1checked) conditionMultiplier = 0;
	if(condition2checked) conditionMultiplier = 0.5;
	if(condition3checked) conditionMultiplier = 1;
	
	let timeMultiplier;
	if(diffMinutes <= 10)
		timeMultiplier = diffMinutes*0.05;
	else
		timeMultiplier = 0.5 + ((diffMinutes-10)*0.025);

	let timeGoldMultiplier;
	if(diffMinutes < 3)
		timeGoldMultiplier = 0;
	else if(diffMinutes < 6)
		timeGoldMultiplier = 0.08;
	else if(diffMinutes < 9)
		timeGoldMultiplier = 0.16;
	else if(diffMinutes < 12)
		timeGoldMultiplier = 0.24;
	else if(diffMinutes < 15)
		timeGoldMultiplier = 0.32;
	else if(diffMinutes < 20)
		timeGoldMultiplier = 0.36;
	else if(diffMinutes < 25)
		timeGoldMultiplier = 0.4;
	else if(diffMinutes < 30)
		timeGoldMultiplier = 0.44;
	else
		timeGoldMultiplier = 0.48;

	//update
	console.log(targetsMultiplier, tierMultiplier, conditionMultiplier, timeMultiplier);
	document.getElementById('xp').innerText = 600*targetsMultiplier*tierMultiplier*conditionMultiplier*timeMultiplier;
	document.getElementById('cash').innerText = 30*targetsMultiplier*tierMultiplier*conditionMultiplier*timeMultiplier;
	document.getElementById('gold').innerText = timeGoldMultiplier;
}
