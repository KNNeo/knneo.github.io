//--CONSTANTS--//
// for data, see data file, under data folder
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const config = {
	"title": 'QUIZ MAKER',
	"subtitle": '[See (?) icon for rules]',
	"mode": 'quiz',
	"options": {
		"total": 10,
		"each": 3,
	},
	"timer": {
		"each": 0,
	},
	"prompt": {
		"correct": '⭕',
		"wrong": '❌',
	},
	"rules": `RULES<br><br>
			- Press play button to start<br>
			- Select from 3 options, which corresponds to image shown<br>
			- When max questions reached, will show final score<br>
			- Change source data from settings below<br>
			- Click on timer icon for a challenge, default no time limit<br>
			- Click on braces icon for practice mode, attempt will not be recorded<br><br>
			SETUP<br><br>
			- Dataset to have min amount of items as of config.options.total<br>
			- Dataset to have min amount of total tags as of config.options.each`
};

//--DOM NODE REFERENCES--//
let titleDiv = document.querySelector('.title');
let subtitleDiv = document.querySelector('.subtitle');
let topLeftDiv = document.querySelector('.top-left');
let bottomRightDiv = document.querySelector('.bottom-right');
let settingsDiv = document.querySelector('.settings');
let progressDiv = document.querySelector('.progress');

//--DOM FUNCTIONS--//
function generateTagClouds() {
	let allTags = [];
	
	// dependent on list of filter containers in html
	for(let filter of document.querySelectorAll('.filters div'))
	{
		// generate unique tags
		let filterList = window.variables.items
		.map(i => i[filter.className])
		.reduce(function(total, current, index, arr) {
			if(!total.map(m => m.value).includes(current))
				total.push({
					value: current,
					category: filter.className,
					count: arr.filter(f => f == current).length
				});
			return total;
		}, [])
		.sort(function(a,b) {
			return b.count - a.count;
		});
		allTags = allTags.concat(filterList);
	}
	
	return allTags;
}

function generateOrientationValues() {
	for(let item of window.variables.items)
	{
		let itemDiv = document.querySelector('.gallery img[src="' + item.filename + '"]');
		item.orientation = (itemDiv?.naturalWidth >= itemDiv?.naturalHeight && window.variables.orientation.landscape) 
			|| (itemDiv?.naturalWidth < itemDiv?.naturalHeight && window.variables.orientation.portrait) 
			|| null;
	}
}

//--EVENT HANDLERS--//
function onKeyDown() {
	//keyboard access
	// if (['PageUp','PageDown','End','Home','ArrowLeft','ArrowRight'].indexOf(event.key) >= 0)
		// event.preventDefault();
	
	switch(event.key) {
	  case 'PageDown':
		next();
		break;
	  case 'End':
		end();
		break;
	  case 'Enter':
		start();
		break;
	  case '1':
	  case 'ArrowLeft':
		document.querySelectorAll('.bottom-right button')[0].click();
		break;
	  case '2':
	  case 'ArrowDown':
		document.querySelectorAll('.bottom-right button')[1].click();
		break;
	  case '3':
	  case 'ArrowRight':
		document.querySelectorAll('.bottom-right button')[2].click();
		break;
	  default:
		break;
	}
}

function start() {
	// check requirements for start
	if(window.variables.base.length < config.options.total) // min config.options.total number of items
		return alert('dataset is too small: quiz cancelled');
	if(window.variables.base.reduce(function(total, current) {
		if(total.indexOf(current.tags) < 0)
			total.push(current.tags);
		return total;
	}, []).length < config.options.each) // min config.options.each number of tags
		return alert('dataset has too little tags: quiz cancelled');
	
	// start game
	window.variables.total = 0;
	window.variables.correct = 0;
	window.variables.running = true;
	window.variables.practice = config.mode.toLowerCase() == 'practice';
	window.variables.test = [];
	window.variables.timer = null;
	next();
}

function choose() {
	let choiceItems = window.variables.base.filter(b => document.querySelector('.question').src == b.filename);
	
	if(choiceItems[0].tags == event.target.innerText) {
		++window.variables.correct;
		clearTimeout(window.variables.timer);
		if(!window.variables.practice)
			popupTextGoAway(config.prompt.correct);
	}
	else {
		popupTextGoAway(config.prompt.wrong);
		// event.target.remove();
	}
	
	++window.variables.total;
	setTimeout(next, window.variables.practice ? 0 : 500);
}

function next() {
	topLeftDiv.innerHTML = '';
	bottomRightDiv.innerHTML = '';
	
	if(window.variables.total >= config.options.total)
		window.variables.running = false;	
	if(!window.variables.running)
		return end();
	
	let { item, index } = randomItem(window.variables.base, 'index', window.variables.test);
	window.variables.test.push(index);
	let notItem = [];
	notItem.push(randomItem(window.variables.base, 'tags', [item.tags]));
	notItem.push(randomItem(window.variables.base, 'tags', [item.tags, notItem[0].item.tags]));
	// console.log(item, notItem);
	
	// load image
	let questionDiv = document.createElement('img');
	questionDiv.classList.add('question');
	questionDiv.src = item.filename;
	questionDiv.addEventListener('load', function() {
		popupGoAway(config.timer.each);
	});
	topLeftDiv.appendChild(questionDiv);
	
	// set progress
	progressDiv.title = window.variables.total + ' / ' + config.options.total;
	progressDiv.value = window.variables.total + 1;
	progressDiv.max = config.options.total;
	
	// load options
	let choices = [item.tags];
	if(!window.variables.practice) {
		choices.push(notItem[0].item.tags);
		choices.push(notItem[1].item.tags);
		choices.sort(function() {
			return 2*Math.random() - 1;
		});
	}
	
	for(let choice of choices)
	{
		let choiceDiv = document.createElement('button');
		choiceDiv.classList.add('shadowed');
		choiceDiv.innerText = choice;
		choiceDiv.addEventListener('click', choose);
		bottomRightDiv.appendChild(choiceDiv);
	}	
}

function end() {
	topLeftDiv.innerHTML = '';
	bottomRightDiv.innerHTML = '';
	clearTimeout(window.variables.timer);
	
	let choiceDiv = document.createElement('div');
	choiceDiv.innerText = 'Score';
	bottomRightDiv.appendChild(choiceDiv);
	
	let scoreDiv = document.createElement('div');
	scoreDiv.style.fontSize = '2em';
	scoreDiv.innerText = window.variables.correct + ' / ' + window.variables.total;
	bottomRightDiv.appendChild(scoreDiv);
	
	if(!window.variables.practice) {
		window.variables.scores.unshift({
			timestamp: new Date().toLocaleString(), 
			total: window.variables.total, 
			score: window.variables.correct,
			timer: config.timer.each > 0 ? config.timer.each + 's' : 'infinite',
		});
		localStorage.setItem('quiz-history', JSON.stringify(window.variables.scores));
	}
}

function clear() {
	document.title = config.title;
	topLeftDiv.innerHTML = '<h1 class="title">' + config.title + '</h1>';
	bottomRightDiv.innerHTML = '<h5 class="subtitle">' + config.subtitle + '</h1>';
	document.querySelector('.timer').setAttribute('data-timer', config.timer.each);
}

function showRules() {
	popupContent(config.rules);
}

function showScores() {
	let containerDiv = document.createElement('div');	
	let titleDiv = document.createElement('div');
	titleDiv.innerText = 'SCORES';
	containerDiv.appendChild(titleDiv);
	
	let headerDiv = document.createElement('div');
	headerDiv.innerText = 'time | score | timer';
	containerDiv.appendChild(headerDiv);
	
	for(let score of window.variables.scores)
	{
		let scoreDiv = document.createElement('div');
		scoreDiv.innerText = [score.timestamp, score.score + ' / ' + score.total, score.timer].join(' | ');
		containerDiv.appendChild(scoreDiv);
	}
	
	popupContent(containerDiv);
}

function clearScores() {
	localStorage.setItem('quiz-history', '[]');
	alert('Scores cleared!');
	startup();
}

function toggleDataset() {
	let input = prompt('Datafile location:', document.getElementById('data-id').src);
	if (input != null)
		changeDataFile(input);
	startup();
	clear();
}

function changeDataFile(dest) {
	document.getElementById('data-id').src = dest;
	startup();
}

function toggleTimer() {
	let time = parseInt(event.target.getAttribute('data-timer'));
	switch(time) {
		case 2:
			config.timer.each = 0;			
			break;
		case 3:
			config.timer.each = 2;			
			break;
		case 5:
			config.timer.each = 3;
			break;
		case 10:
			config.timer.each = 5;
			break;
		default:
			config.timer.each = 10;
			break;
	}
	event.target.setAttribute('data-timer', config.timer.each);
	popupTextGoAway(config.timer.each > 0 ? config.timer.each + 's' : '♾️');
}

function toggleMode() {
	let mode = event.target.getAttribute('data-mode');
	switch(mode) {
		case 'practice':
			config.mode = 'quiz';
			break;
		default:
			config.mode = 'practice';
			break;
	}
	event.target.classList.toggle('bi-braces');
	event.target.classList.toggle('bi-braces-asterisk');
	event.target.setAttribute('data-mode', config.mode);
	popupTextGoAway(config.mode.toUpperCase());
}

//--FUNCTIONS--//
function checkComplete() {
	let total = window.variables.base.length;
	let loaded = document.querySelectorAll('.loaded').length;
	// console.log(loaded, total);
	
	// render progress bar
	progressDiv.style.width = 100*loaded/total + '%';
	
	// continue or stop
	if(loaded < total)
		setTimeout(checkComplete, 1000);
	else {
		scrollToItem();
		setTimeout(function() {
			progressDiv.style.top = '';
		}, 1000);
	}
}

function randomItem(list, property, exclude) {
	let check = exclude || [];
	let index = Math.floor(list.length*Math.random());
	let item = list[index];
	while(check.includes(item[property]) || (property == 'index' && check.includes(index))) {
		index = Math.floor(list.length*Math.random());
		item = list[index];
	}
	return { item, index };
}

function popupGoAway(textVal) {
	if(textVal) //for initialize
		window.variables.count = textVal;
	else //subsequent calls
		textVal = window.variables.count;
	
	//create popup and show
	if(window.variables.count > 0)
	{
		let popup = document.createElement('div');
		popup.classList.add('go-away');
		popup.innerText = textVal;
		document.querySelector('.go-away')?.remove();
		document.body.appendChild(popup);
		
		//add class to fade
		popup.classList.add('fade');
		
		//add class to hide
		setTimeout(function() {
			popup.classList.add('hide');
		}, 50);
	}
	
	if (--window.variables.count >= 0 && window.variables.running) {
		window.variables.timer = setTimeout(popupGoAway, 1000);
	}
	if (window.variables.count < 0 && window.variables.running) {
		window.variables.count = config.timer.each;
		next();
	}
}

function popupTextGoAway(textVal) {	
	//create popup and show
	let popup = document.createElement('div');
	popup.classList.add('go-away');
	popup.classList.add('text');
	popup.innerText = textVal;
	document.querySelector('.go-away')?.remove();
	document.body.appendChild(popup);
	
	//add class to fade
	popup.classList.add('fade');
	
	//add class to hide
	setTimeout(function() {
		popup.classList.add('hide');
	}, 10);
}

////DIALOG////
function popupContent(input) {
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null)
	{
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// node in dialog will not have events!
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object')
	{
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		this.remove();
	});
	dialog.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			this.remove();
	});
	return dialog;
}

//--INITIAL--//
function startup() {
	getJson(
		document.getElementById('data-id').src,
		function(content) {
			window.variables = content;
			window.variables.base = window.variables.items
				// .filter(i => window.variables.filter ? i[window.variables.filter.category].includes(window.variables.filter.value) : true)
				.sort(function(a,b) {
					if(window.variables.sort && window.variables.sort.order && window.variables.sort.value)
					{
						if(window.variables.sort.order.toLowerCase() == 'asc')
							return a[window.variables.sort.value] - b[window.variables.sort.value];
						if(window.variables.sort.order.toLowerCase() == 'desc')
							return b[window.variables.sort.value] - a[window.variables.sort.value];
						if(window.variables.sort.order.toLowerCase() == 'random')
							return (2*Math.random()) - 1;
					}
					return 0;
				});
			window.variables.scores = JSON.parse(localStorage.getItem('quiz-history') || '[]');
			clear();
		}
	);
}
