//--SETTINGS--//
const config = {
	debug: false,
	autoFill: false,
	interval: 7500,
	cards: {
		playable: 3,
		labels: ['B','I','N','G','O'],
	},
	countdown: {
		turns: 5
	},
	locale: {
		title: "BINGO",
		free: "FREE",
		display: {
			pattern: "PATTERN",
			latest: "LATEST",
		},
		generate: {
			new: "GENERATE",
			check: "BINGO",
			pass: "✔️",
			fail: "❌",
		},
		remainder: "AWAY",
		action: {
			start: "START",
			pause: "PAUSE",
			resume: "RESUME",
			reset: "RESET",
		}
	},
	patterns: [
		{
			name: "Any Horizontal",
			selected: [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
		},
		{
			name: "Any Vertical",
			selected: [[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],[5,10,15,20,25]],
		},
		{
			name: "Any Diagonal",
			selected: [[5,9,13,17,21],[1,7,13,19,25]],
		},
		{
			name: "Letter W",
			selected: [1,5,6,10,11,13,15,16,18,20,22,24],
		},
		{
			name: "Letter E",
			selected: [2,3,4,7,12,13,14,17,22,23,24],
		},
		{
			name: "Letter N",
			selected: [1,5,6,7,10,11,13,15,16,19,20,21,25],
		},
		{
			name: "4 Corners",
			selected: [1,5,21,25],
		},
		{
			name: "4 Stamps",
			selected: [1,2,4,5,6,7,9,10,13,16,17,19,20,21,22,24,25],
		},
		{
			name: "Number 3",
			selected: [1,2,3,4,5,10,11,12,13,14,15,20,21,22,23,24,25],
		},
		{
			name: "Number 5",
			selected: [1,2,3,4,5,6,11,12,13,14,20,21,22,23,24],
		},
		{
			name: "Lucky 13",
			selected: [1,3,4,5,6,10,11,13,14,15,16,20,21,23,24,25],
		},
		{
			name: "Pretzel",
			selected: [1,2,3,6,8,11,12,13,14,15,18,20,23,24,25],
		},
		{
			name: "Pyramid",
			selected: [13,17,18,19,21,22,23,24,25],
		},
		{
			name: "Letter X",
			selected: [1,5,7,9,13,17,19,21,25],
		},
		{
			name: "Letter H",
			selected: [1,5,6,10,11,12,13,14,15,16,20,21,25],
		},
		{
			name: "Blackout",
			selected: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25],
		},
		{
			name: "Full House",
			selected: [1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25],
		},
		{
			name: "Outside Edge",
			selected: [1,2,3,4,5,6,10,11,15,16,20,21,22,23,24,25],
		},
		{
			name: "Number 7",
			selected: [1,2,3,4,5,9,13,17,21],
		},
		{
			name: "Arrow",
			selected: [3,4,5,9,10,13,15,17,21],
		},
		{
			name: "Clock",
			selected: [2,3,4,6,10,11,13,15,16,19,20,22,23,24],
		},
		{
			name: "Wine Glass",
			selected: [1,5,7,9,13,18,21,22,23,24,25],
		},
		{
			name: "Center Row",
			selected: [11,12,13,14,15],
		},
		{
			name: "Kite",
			selected: [4,5,9,10,13,17,21],
		},
		{
			name: "Airplane",
			selected: [4,6,9,11,12,13,14,15,16,19,24],
		},
		{
			name: "Diamond",
			selected: [3,7,8,9,11,12,13,14,15,17,18,19,23],
		},
		{
			name: "4x4 Block",
			selected: [
				[1,2,3,4,6,7,8,9,11,12,13,14,16,17,18,19],
				[2,3,4,5,7,8,9,10,12,13,14,15,17,18,19,20],
				[6,7,8,9,11,12,13,14,16,17,18,19,21,22,23,24],
				[7,8,9,10,12,13,14,15,17,18,19,20,22,23,24,25]
			],
		},
		{
			name: "Checkerboard",
			selected: [1,3,5,7,9,11,13,15,17,19,21,23,25],
		},
		{
			name: "Swatter & Fly",
			selected: [1,2,3,6,7,8,11,12,13,17,22,25],
		},
		{
			name: "Bowtie",
			selected: [1,5,6,7,9,10,11,12,13,14,15,16,17,19,20,21,25],
		},
		{
			name: "Letter Z",
			selected: [1,2,3,4,5,9,13,17,21,22,23,24,25],
		},
		{
			name: "Tic Tac Toe",
			selected: [2,4,6,7,8,9,10,12,14,16,17,18,19,20,22,24],
		},
		{
			name: "Ladder",
			selected: [1,5,6,7,8,9,10,11,15,16,17,18,19,20,21,25],
		},
	],
};
//pattern limited to single outcomes, eg. can't do "any horizontal"
const smallScreen = function() {
    const match = window.matchMedia('(pointer:coarse)');
    const isMobile = match && match.matches;
    return isMobile || window.innerWidth <= 880;
};

//--DOM REFERENCES--//
let titleDiv = document.querySelector('.title');
let displayDiv = document.querySelector('.display');
let listDiv = document.querySelector('.list');
let menuDiv = document.querySelector('.menu');

//--DOM EVENTS--//
function startup() {
	initializeVariables();
	renderTitle();
	renderDisplay();
	renderCards();
	renderActions();
	generatePattern();
	renderCell();
}

function toggleCards() {
	if(!window['ended'])
		return popupTextGoAway('🚫');
	if(smallScreen())
		return popupTextGoAway(window['cards']);
	switch(window['cards']) {
		case 1:
		default:
			window['cards'] = 3;
			break;
		case 3:
			window['cards'] = 5;
			break;
		case 5:
			window['cards'] = 1;
			break;
	}
	if(config.debug) alert('Cards playable is now ' + window['cards']);
	popupTextGoAway(window['cards']);
	renderCards();
}

function toggleInterval() {
	if(!window['ended'])
		return popupTextGoAway(config.interval / 1000 + 's');
	switch(config.interval) {
		case 5000:
		default:
			config.interval = 7500;
			break;
		case 7500:
			config.interval = 10000;
			break;
		case 10000:
			config.interval = 2500;
			break;
		case 2500:
			config.interval = 5000;
			break;
	}
	if(config.debug) alert('Time interval between calls is now ' + config.interval);
	popupTextGoAway(config.interval / 1000 + 's');
}

//--EVENT LISTENERS--//
function onGenerateClicked() {
	let id = Array.from(document.querySelectorAll('.generate')).indexOf(this);
	if(config.debug) console.log(id);	
	switch(this.innerText) {
		case config.locale.generate.new:
			let [a,b] = generateMatrix();
			let newCard = renderCard(a,b);
			document.querySelectorAll('.card')[id].innerHTML = '';
			document.querySelectorAll('.card')[id].appendChild(newCard);
			
			let away = document.createElement('div');
			away.classList.add('away');
			document.querySelectorAll('.card')[id].appendChild(away);
			
			break;
		case config.locale.generate.check:
			if(checkBingo(id) == true)
				endBingo();
			break;
	}
}

function onBingoClicked() {
	switch(this.innerText) {
		case config.locale.action.start:
			if(startBingo())
				this.innerText = config.locale.action.pause;
			break;
		case config.locale.action.resume:
			if(togglePause())
				this.innerText = config.locale.action.pause;
			break;
		case config.locale.action.pause:
			if(togglePause())
				this.innerText = config.locale.action.resume;
			break;
		case config.locale.action.reset:
			if(resetBingo())
				this.innerText = config.locale.action.start;
			break;
	}
}

function onCellClicked() {
	for(c = 0; c < window['cards']; c++) {
		let card = document.querySelectorAll('.card')[c];
		let selected = Array.from(card.querySelectorAll('.selected')).map(function(cell) {
			return {
				value: parseInt(cell.innerText),
				index: parseInt(cell.getAttribute('data-id'))
			};
		});
		let pattern = config.patterns.find(p => p.name == window['combination']).selected;
		let revealed = window['board'];
		if(config.debug) console.log('cell', selected, pattern, revealed);
		//compare against pattern
		let count = isPatternMatch(pattern) ? null : pattern.length;
		if(isPatternMatch(pattern))	{
			//if has combo, check on all then find smallest value
			let counts = [];
			for(let p = 0; p < pattern.length; p++)	{
				counts[p] = pattern[p].length;
				for(let selection of selected)
				{
					//if user selected is in pattern cell and board has pattern cell
					//if free space, don't have to check board
					if(pattern[p].indexOf(selection.index) >= 0 && (selection.index == 13 || revealed.indexOf(selection.value) >= 0))
						counts[p]--; //reduce count
				}
			}
			//console.log(counts);
			count = Math.min(...counts);
		}
		else {
			for(let selection of selected) {
				//if user selected is in pattern cell and board has pattern cell
				//if free space, don't have to check board
				if(pattern.indexOf(selection.index) >= 0 && (selection.index == 13 || revealed.indexOf(selection.value) >= 0))
					count--; //reduce count
			}
		}
		//set remainder text
		document.querySelectorAll('.away')[c].setAttribute('data-away', count);
		document.querySelectorAll('.away')[c].innerText = count + ' ' + config.locale.remainder;
	}
}

function toggleDaub() {
	if(window['ended'])	{
		let maxStyles = 3; //as per css, .daub<no>
		window['daub'] = (window['daub'] + 1 > maxStyles) ? 0 : window['daub'] + 1;
		titleDiv.classList = 'title daub' + window['daub'];
		localStorage.setItem('daub', window['daub']);
	}
}

function togglePause() {
	window['paused'] = !window['paused'];
	event.target.innerText = event.target.innerText == 'pause' ? 'play_arrow' : 'pause';
	listDiv.classList.toggle('hidden');
	return true;
}

function createOrUpdateCustom() {
	if(!window['ended'] || window['combination-set']) return;
	this.classList.toggle('daub' + window['daub']);
	this.classList.toggle('selected');
	let values = Array.from(document.querySelectorAll('.pattern-grid .selected')).map(p => parseInt(p.getAttribute('data-id')));
	window['custom'] = values;	
	document.querySelector('.pattern-title').innerText = 'Custom';
}

function toggleAutoFill() {
	config.autoFill = !config.autoFill;
	popupTextGoAway(config.autoFill ? 'AUTO' : 'MANUAL');
}

function showLatestResult() {
	alert(window['result'] || 'No result in session!');
}

//--FUNCTIONS--//
function generatePattern(shape) {	
	let div = document.createElement('div');
	
	let header = document.createElement('div');
	header.innerText = config.locale.display.pattern;
	header.addEventListener('click', function() {
		if(!window['ended']) return;
		let index = config.patterns.map(p => p.name).indexOf(window['combination']);
		window['combination'] = config.patterns[index > config.patterns.length ? 0 : index + 1];
		if(window['combination']) this.parentElement.parentElement.classList.add('set');
		window['combination-set'] = null;
		window['custom'] = null;
		generatePattern(window['combination']);
	});
	div.appendChild(header);
	
	let pattern = document.createElement('div');
	pattern.classList.add('pattern-grid');
	let [,selected] = generateMatrix(shape && shape.selected || null);
	//for any combinations
	if(shape && shape.selected && isPatternMatch(shape.selected))
	{
		window['combination-set'] = shape.name;
		generatePatternSet(shape);
		return;
	}
	if(config.debug) console.log(selected);
	let table = renderCard(null, selected);
	if(smallScreen()) table.style.margin = 'auto';
	pattern.appendChild(table);
	
	div.appendChild(pattern);
	
	let title = document.createElement('div');
	title.classList.add('pattern-title');
	title.innerText = shape && shape.name || '-';
	div.appendChild(title);
	
	window['combination'] = shape?.name;
	document.querySelector('.pattern').innerHTML = '';
	document.querySelector('.pattern').appendChild(div);
}

function generatePatternSet(shapes) {
	for(let n = 0; n < shapes.selected.length; n++)	{
		let pattern = shapes.selected[n];
		setTimeout(function() {
			//console.log('pattern');
			if(window['combination-set'] != shapes.name) return;
			generatePattern({
				name: shapes.name,
				selected: pattern
			});
		}, 1000 * n);
	}
	setTimeout(function() {
		//console.log('shapes');
		if(window['combination-set'] != shapes.name) return;
		generatePatternSet(shapes);
	}, 1000 * shapes.selected.length);
}

function generateMatrix(set) {
	let numbers = [];
	let selected = [];
	for(i = 0; i < 25; i++) {
		//free cell
		if(!set && i == 12) {
			numbers[i] = config.locale.free;
			continue;
		}
		//randomize
		let rnd = 0;
		do {
			rnd = Math.floor(Math.random() * 15) + ((i % 5) * 15) + 1;
		}
		while (numbers.indexOf(rnd) >= 0)
		numbers[i] = rnd;
		if(set) selected[i] = set.includes(i+1);
	}
	if(config.debug) console.log('numbers', [numbers, selected]);
	return [numbers, selected];
}

function initializeVariables() {
	window['daub'] = localStorage.getItem('daub');
	window['ended'] = true;
	window['paused'] = false;
	window['combination'] = null;
	window['cards'] = smallScreen() ? 1 : config.cards.playable;
	window['bingo'] = [];
	window['countdown'] = 0;
	window['result'] = '';
}

function renderTitle() {
	window['daub'] = 0;
	document.title = config.locale.title;
	titleDiv.classList = 'title daub' + window['daub'];
	titleDiv.innerText = config.locale.title;
	localStorage.setItem('daub', window['daub']);
}

function renderDisplay() {
	displayDiv.innerHTML = '';
	//three sections: pattern, board, call
	//sub sections: -, -, [call, call-history]	
	let table = document.createElement('table');
	table.classList.add('box');
	table.style.margin = 'auto';
	
	let tbody = document.createElement('tbody');
	
	let tr = document.createElement('tr');
	
	let td1 = document.createElement('td');
	td1.classList.add('pattern');
	
	let td2 = document.createElement('td');
	td2.classList.add('board');
	td2.classList.add('padded');
	td2.appendChild(renderBoard());
	
	let td3 = document.createElement('td');
	td3.classList.add('call');
	
	let trX = document.createElement('tr');
	
	if(!smallScreen()) tr.appendChild(td1);
	if(smallScreen()) 
		td2.setAttribute('colspan', 2);
	tr.appendChild(td2);
	if(!smallScreen()) tr.appendChild(td3);
	if(smallScreen()) {
		trX.appendChild(td1);
		td3.style.display = 'flex';
		trX.appendChild(td3);
	}
	
	tbody.appendChild(tr);
	if(smallScreen()) tbody.appendChild(trX);

	table.appendChild(tbody);
	displayDiv.appendChild(table);	
}

function renderCards() {
	listDiv.innerHTML = '';	
	for(c = 0; c < window['cards']; c++) {
		let div = document.createElement('div');
		div.classList.add('card');
		
		let [a,b] = generateMatrix();
		let table = renderCard(a,b);
		div.appendChild(table);	
		
		let away = document.createElement('div');
		away.classList.add('away');
		div.appendChild(away);
		
		listDiv.appendChild(div);
	}
	
}

function renderCard(numbers, selected, latest) {
	if(config.debug) console.log('card', numbers, selected);
	
	let table = document.createElement('table');
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	if(numbers) {
		let first = document.createElement('tr');
		for(let label of config.cards.labels) {
			let th = document.createElement('th');
			th.classList.add('label');
			th.innerText = label;		
			first.appendChild(th);
		}
		tbody.appendChild(first);
	}
	
	for(m = 0; m < 5; m++) {
		let tr = document.createElement('tr');
		if(latest && m > 0)
			continue;	
		for(n = 0; n < 5; n++)
		{
			let td = document.createElement('td');
			td.classList.add('cell');
			if(latest && m == 0 && n > 0)
				continue;
			//if card on board
			if(numbers) {
				td.classList.add('square-card');
				td.setAttribute('data-id', m*5+n+1);
				td.innerText = numbers && numbers[m*5+n] || '';
				td.addEventListener('click', function() {
					if(!window['ended']) {
						this.classList.toggle('daub' + window['daub']);
						this.classList.toggle('selected');
						onCellClicked();
					}
				});
			}
			else if(latest && m == 0 && n == 0) {
				//call box
				td.classList.add('square-call');
				td.setAttribute('colspan', 5);
				td.setAttribute('rowspan', 5);
				
				let category = document.createElement('b');
				category.classList.add('category');
				td.appendChild(category);
				
				window['call'] = null;
				let latestDiv = document.createElement('div');
				latestDiv.classList.add('latest');
				latestDiv.classList.add('huge-font');
				latestDiv.innerText = window['call'];
				td.appendChild(latestDiv);						
			}
			else {
				//create pattern grid
				td.classList.add('square-pattern');
				td.setAttribute('data-id', m*5+n+1);
				td.addEventListener('click', createOrUpdateCustom);
				if(selected[m*5+n] == true) {
					td.classList.toggle('daub' + window['daub']);
					td.classList.add('selected');
				}
			}
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	//create generate button for card
	if(numbers)	{
		let row = document.createElement('tr');
		
		let generate = document.createElement('td');
		generate.classList.add('generate');
		generate.setAttribute('colspan', '5');
		generate.classList.add('cell');
		generate.classList.add('large-font');
		generate.innerText = config.locale.generate.new;
		generate.addEventListener('click', onGenerateClicked);
		
		row.appendChild(generate);
		
		tbody.appendChild(row);
	}
	
	table.appendChild(tbody);
	
	return table;
}

function scoreCard(card) {
	let marked = Array.from(card.querySelectorAll('.selected')).map(cell => parseInt(cell.innerText || '0'));
	let revealed = window['board'];
	let correct = 0;
	let wrong = 0;
	for(let cell of marked) {
		if(cell && revealed.indexOf(cell) >= 0)
			correct++;
		else if (!cell) //is free space
			correct++;
		else
			wrong++;
	}

	return [marked.length, correct, wrong];
}

function renderActions() {
	menuDiv.innerHTML = '';	
	let bingo = document.createElement('div');
	bingo.id = 'bingo';
	bingo.classList.add('cell');
	bingo.classList.add('large-font');
	bingo.innerText = config.locale.action.start;
	bingo.addEventListener('click', onBingoClicked);
	menuDiv.appendChild(bingo);
}

function renderCell() {
	document.querySelector('.call').innerHTML = '';
	
	let div = document.createElement('div');
	
	let header = document.createElement('div');
	header.classList.add('call-count');
	header.innerText = config.locale.display.latest;
	div.appendChild(header);
	
	let [_,b] = generateMatrix();
	div.appendChild(renderCard(null, b, true));
	
	window['call-hist'] = [];
	let hist = document.createElement('div');
	hist.classList.add('history');
	if(smallScreen()) {
		hist.style.display = 'inline-block';
		hist.style.width = '100%';
	}
	hist.appendChild(renderHistory());
	div.appendChild(hist);	
	
	document.querySelector('.call').appendChild(div);
}

function renderHistory() {
	let history = document.createElement('div');
	let historyList = Array.from(window['call-hist']);	
	for (let h of historyList) {
		let hist = document.createElement('span');
		hist.classList.add('box');
		hist.classList.add('square-pattern');
		hist.innerText = ('' + h).padStart(2, ' ');
		
		history.appendChild(hist);
	}
	//if no history
	if(historyList.length < 1) {
		let hist = document.createElement('span');
		hist.innerText = '-';		
		history.appendChild(hist);
	}	
	return history;
}

function renderBoard() {
	let numbers = [];
	for(i = 0; i < 75; i++)
		numbers.push(i+1);
	
	let table = document.createElement('table');
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	for(m = 0; m < 5; m++) {
		let tr = document.createElement('tr');
		
		let label = document.createElement('th');
		label.classList.add('label');
		label.innerText = config.cards.labels[m];
		tr.appendChild(label);
	
		for(n = 0; n < 15; n++) {			
			let td = document.createElement('td');
			td.classList.add('board' + (m*15+n+1));
			td.classList.add('cell');
			td.classList.add('square-board');
			td.setAttribute('data-id', m*15+n+1);
			td.innerText = numbers[m*15+n];
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	
	return table;
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
	//remove after hide
	setTimeout(function() {
		popup.remove();
	}, 1000);
}

//--GAME FUNCTIONS--//
function startBingo() {
	window['countdown'] = 0;
	window['ended'] = false;
	window['board'] = [];
	let board = renderBoard();
	document.querySelector('.board').innerHTML = '';
	document.querySelector('.board').appendChild(board);
	//if custom pattern
	if(window['custom']) {
		window['combination'] = 'Custom';
		//if same as previous set, set again
		let customExist = config.patterns.find(p => p.name == 'Custom');
		if(!customExist || customExist.selected.toString() != window['custom'].toString())
		{
			if(customExist) config.patterns.pop();
			config.patterns.push({
				name: 'Custom',
				selected: window['custom'],
			});
		}
	}
	//if no pattern set before start, random one
	if(!window['combination']) {
		let combination = config.patterns[Math.floor((Math.random() * config.patterns.length))];
		generatePattern(combination);
	}
	//change generate buttons to check
	for(let generate of document.querySelectorAll('.generate'))
		generate.innerText = config.locale.generate.check;
	//set initial remainder text
	for(let generate of document.querySelectorAll('.away')) {
		let combination = config.patterns.find(p => p.name == window['combination']);
		generate.innerText = (isPatternMatch(combination.selected) ? combination.selected[0].length : combination.selected.length) + ' ' + config.locale.remainder;
	}
	//call
	setTimeout(callNumber, 500);
	return true;
}

function pauseBingo() {
	if(window['paused'])
		setTimeout(pauseBingo, 500);
	else
		setTimeout(callNumber, config.interval);
}

function callNumber() {
	if(config.debug) console.log('bingo', window['bingo']);
	if(window['bingo'].filter(b => b && b == 1).length >= window['cards'])
		return;
	if(window['paused']) {
		pauseBingo();
		return;
	}
	let boardFull = window['board'].length > 75;
	//generate number
	let rand = 0;
	do {
		rand = Math.floor((Math.random() * 75)) + 1;
	} while(window['board'].includes(rand) && !boardFull);
	if(config.debug) console.log('rand', rand);
	window['board'].push(rand);
	document.querySelector('.board' + rand).classList.add('selected');
	document.querySelector('.call-count').innerText = ('' + window['board'].length).padStart(2, ' ') + ' / 75';
	//update history
	if(window['call-hist'].length >= 5)
		window['call-hist'].pop();
	if(window['call']) window['call-hist'].unshift(window['call']);
	let history = document.querySelector('.history');
	history.innerHTML = '';
	history.appendChild(renderHistory());	
	//update latest
	window['call'] = rand;
	document.querySelector('.latest').innerText = '';
	setTimeout(function() { document.querySelector('.latest').innerText = window['call']; }, 250);
	setTimeout(function() { if(config.autoFill) autoFillCards(window['call']);	}, 500);
	//set card header columns
	let category = config.cards.labels[Math.floor((rand-1) / 15)];
	if(config.debug) console.log('category', category);
	window['category'] = category;
	document.querySelector('.category').innerText = '';
	setTimeout(function() { document.querySelector('.category').innerText = window['category']; }, 250);
	//if countdown available, end if exceeded
	if(window['countdown'] && window['board'].length > window['countdown'])
		endBingo();
	//call again if has not ended and board not all called
	else if(!boardFull && !window['ended'])
		setTimeout(callNumber, config.interval);
	else if(boardFull)
		endBingo();
}

function autoFillCards(value) {
	//limitations: does not fill free space, does not update again if user clicked it off
	for(let card of document.querySelectorAll('.card'))	{
		for(let cell of card.querySelectorAll('td')) {
			if(cell.innerText == value.toString()) {
				//trigger click event
				if(config.debug) console.log(card, cell, cell.innerText);
				cell.click();
			}
		}
	}
}

function runCountdown() {
	popupTextGoAway('LAST ' + config.countdown.turns);
	window['countdown'] = window['board'].length + config.countdown.turns;
	setTimeout(function() {
		window['ended'] = false;
		callNumber();
	}, config.interval);
}

function checkBingo(id) {
	 //from bingo button
	let away = document.querySelectorAll('.away')[id].getAttribute('data-away');
	let isBingo = away == '0';
	let revealed = window['board'];
	let pattern = config.patterns.find(p => p.name == window['combination']).selected;
	//prevent early call if board not enough to bingo
	if(isBingo && revealed.length < (isPatternMatch(pattern) ? Math.min(...pattern.map(pp => pp.length)) : pattern.length)) {
		if(config.debug) alert('game has not revealed minimum for card to bingo');
		return false;
	}
	let card = document.querySelectorAll('.card')[id];
	let selected = Array.from(card.querySelectorAll('.selected')).map(function(cell) {
		return {
			value: parseInt(cell.innerText),
			index: parseInt(cell.getAttribute('data-id'))
		};
	});
	if(config.debug) console.log(card);
	//prevent early call if board not enough to bingo
	if(isBingo && revealed.length < selected.length) {
		if(config.debug) alert('game has not revealed minimum to fill card');
		return false;
	}
	//actual check
	if(isBingo) {
		if(config.debug) alert('bingo');
		card.querySelector('.generate').innerText = config.locale.generate.pass;
		window['bingo'][id] = 1;
		return true;
	}
	else {
		if(config.debug) alert('not yet');
		card.querySelector('.generate').innerText = config.locale.generate.fail;
		setTimeout(function() { 
			document.querySelectorAll('.card')[id].querySelector('.generate').innerText = config.locale.generate.check; 
		}, 1000);
		return false;
	}
}

function endBingo() {
	if(config.debug) console.log('end');
	window['ended'] = true;
	if(config.countdown.turns && window['cards'] > 1 && !window['countdown'])
		runCountdown();
	else {
		popupTextGoAway(config.countdown.turns ? 'END' : 'BINGO');
		document.querySelector('#bingo').style.display = '';
		document.querySelector('#bingo').innerText = config.locale.action.reset;
		//tally correct and wrong selections
		let result = 'Card scores from left to right:\n';
		for(let c = 0; c < window['cards']; c++) {
			let card = document.querySelectorAll('.card')[c];
			let score = scoreCard(card);
			result += '\nCard ' + (1 + c) + ' - Marked: ' + score[0] + ' Correct: ' + score[1] + '  Wrong: ' + score[2];
			result += ' Bingo: ' + checkBingo(c);
		}
		window['result'] = result;
		showLatestResult();
	}
}

function resetBingo() {
	document.querySelector('.category').innerHTML = '';
	document.querySelector('.latest').innerHTML = '';
	document.querySelector('.history').innerHTML = '';
	document.querySelector('.board').innerHTML = '';
	document.querySelector('.board').appendChild(renderBoard());
	//reset to generate
	for(let generate of document.querySelectorAll('.generate'))
		generate.innerText = config.locale.generate.new;
	initializeVariables();
	generatePattern();
	renderCards();
	return true;
}

function isPatternMatch(pattern) {
	return pattern.filter(a => typeof(a) == 'object').length == pattern.length;
}