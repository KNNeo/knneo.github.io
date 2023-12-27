//--SETTINGS--//
const config = {
	"debug": false,
	"autoFill": false,
	"interval": 7500,
	"cards": {
		"playable": 3,
		"labels": ['B','I','N','G','O']
	},
	"patterns": [
		{
			"name": "Any Horizontal",
			"selected": [[1,2,3,4,5],[6,7,8,9,10],[11,12,13,14,15],[16,17,18,19,20],[21,22,23,24,25]],
		},
		{
			"name": "Any Vertical",
			"selected": [[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],[5,10,15,20,25]],
		},
		{
			"name": "Letter W",
			"selected": [1,5,6,10,11,13,15,16,18,20,22,24],
		},
		{
			"name": "Letter E",
			"selected": [2,3,4,7,12,13,14,17,22,23,24],
		},
		{
			"name": "Letter N",
			"selected": [1,5,6,7,10,11,13,15,16,19,20,21,25],
		},
		{
			"name": "4 Corners",
			"selected": [1,5,21,25],
		},
		{
			"name": "4 Stamps",
			"selected": [1,2,4,5,6,7,9,10,13,16,17,19,20,21,22,24,25],
		},
		{
			"name": "Number 3",
			"selected": [1,2,3,4,5,10,11,12,13,14,15,20,21,22,23,24,25],
		},
		{
			"name": "Number 5",
			"selected": [1,2,3,4,5,6,11,12,13,14,20,21,22,23,24],
		},
		{
			"name": "Lucky 13",
			"selected": [1,3,4,5,6,10,11,13,14,15,16,20,21,23,24,25],
		},
		{
			"name": "Pretzel",
			"selected": [1,2,3,6,8,11,12,13,14,15,18,20,23,24,25],
		}
	],
};
// pattern limited to single outcomes, eg. can't do "any horizontal"
const smallScreen = function() {
    return window.innerWidth <= 640;
};
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
};

//--DOM REFERENCES--//


//--DOM EVENTS--//
function toggleCards() {
	switch(window['cards'])
	{
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
	alert('Cards playable is now ' + window['cards']);
	renderCards();
}

//--COMMON EVENTS--//
function startup() {
	initializeVariables();
	renderTitle();
	renderDisplay();
	renderCards();
	renderActions();
	generatePattern();
	generateCall();
}

function initializeVariables() {
	window['daub'] = localStorage.getItem('daub');
	window['ended'] = true;
	window['paused'] = false;
	window['combination'] = null;
	window['cards'] = isMobile() || smallScreen() ? 1 : config.cards.playable;
	window['bingo'] = [];	
}

//--FUNCTIONS--//
function renderTitle() {
	window['daub'] = 0;
	document.querySelector('.title').classList = 'title daub' + window['daub'];
	localStorage.setItem('daub', window['daub']);
}

function toggleDaub() {
	if(window['ended'])
	{
		let maxStyles = 3; // as per css, .daub<no>
		window['daub'] = (window['daub'] + 1 > maxStyles) ? 0 : window['daub'] + 1;
		document.querySelector('.title').classList = 'title daub' + window['daub'];
		localStorage.setItem('daub', window['daub']);
	}	
}

function togglePause() {
	window['paused'] = !window['paused'];
	event.target.innerText = event.target.innerText == 'pause' ? 'play_arrow' : 'pause';
	document.querySelector('.list').classList.toggle('hidden');
	return true;
}

function renderDisplay() {
	document.querySelector('.display').innerHTML = '';
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
	td2.appendChild(generateBoard());
	
	let td3 = document.createElement('td');
	td3.classList.add('box');
	td3.classList.add('call');
	
	let trX = document.createElement('tr');
	
	if(!isMobile() || !smallScreen()) tr.appendChild(td1);
	if(isMobile() || smallScreen()) 
		td2.setAttribute('colspan', 2);
	tr.appendChild(td2);
	if(!isMobile() || !smallScreen()) tr.appendChild(td3);
	if(isMobile() || smallScreen()) 
	{
		trX.appendChild(td1);
		td3.style.display = 'flex';
		trX.appendChild(td3);
	}
	
	tbody.appendChild(tr);
	if(isMobile() || smallScreen()) tbody.appendChild(trX);

	table.appendChild(tbody);
	document.querySelector('.display').appendChild(table);	
}

function generatePattern(shape) {	
	let div = document.createElement('div');
	
	let header = document.createElement('div');
	header.innerText = 'PATTERN';
	header.addEventListener('click', function() {
		let index = config.patterns.map(p => p.name).indexOf(window['combination']);
		window['combination'] = config.patterns[index > config.patterns.length ? 0 : index + 1];
		if(window['combination']) this.parentElement.parentElement.classList.add('.set');
		window['combination-set'] = null;
		window['custom'] = null;
		generatePattern(window['combination']);
	});
	div.appendChild(header);
	
	let pattern = document.createElement('div');
	pattern.classList.add('pattern-grid');
	let [,selected] = generateMatrix(shape && shape.selected || null);
	// for any combinations
	if(shape && shape.selected && isAnyBingo(shape.selected))
	{
		window['combination-set'] = shape.name;
		generatePatternSet(shape);
		return;
	}
	if(config.debug) console.log(selected);
	let table = generateCard(null, selected);
	if(isMobile() || smallScreen()) table.style.margin = 'auto';
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
	for(let n = 0; n < shapes.selected.length; n++)
	{
		let pattern = shapes.selected[n];
		setTimeout(function() {
			//console.log('pattern');
			if(window['combination-set'] != shapes.name) return;
			generatePattern({
				"name": shapes.name,
				"selected": pattern
			});
		}, 1000 * n);
	}
	setTimeout(function() {
		// console.log('shapes');
		if(window['combination-set'] != shapes.name) return;
		generatePatternSet(shapes);
	}, 1000 * shapes.selected.length);
}

function generateBoard() {
	let numbers = [];
	for(i = 0; i < 75; i++)
	{
		numbers.push(i+1);
	}
	
	let table = document.createElement('table');
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	for(m = 0; m < 5; m++)
	{
		let tr = document.createElement('tr');
		
		let label = document.createElement('th');
		label.classList.add('label');
		label.innerText = config.cards.labels[m];
		tr.appendChild(label);
	
		for(n = 0; n < 15; n++)
		{			
			let td = document.createElement('td');
			td.classList.add('board' + (m*15+n+1));
			td.classList.add('shadowed');
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

function generateCall() {
	let div = document.createElement('div');
	
	let header = document.createElement('div');
	header.innerText = 'LATEST';
	div.appendChild(header);
	
	let [_,b] = generateMatrix();
	div.appendChild(generateCard(null, b, true));
	
	window['call-hist'] = [];
	let hist = document.createElement('div');
	hist.classList.add('history');
	if(isMobile() || smallScreen()) {
		hist.style.display = 'inline-block';
		hist.style.width = '100%';
	}
	hist.appendChild(generateHistory());
	div.appendChild(hist);	
	
	document.querySelector('.call').innerHTML = '';
	document.querySelector('.call').appendChild(div);
}

function generateHistory() {
	let history = document.createElement('div');
	let historyList = Array.from(window['call-hist']);
	
	for (let h of historyList)
	{
		let hist = document.createElement('span');
		hist.classList.add('box');
		hist.classList.add('shadowed');
		hist.classList.add('square-pattern');
		hist.innerText = h;
		
		history.appendChild(hist);
	}
	if(historyList.length < 1)
	{
		let hist = document.createElement('span');
		hist.innerText = '-';
		
		history.appendChild(hist);
	}
	// let historyList = Array.from(window['call-hist']);
	// let historyText = '';
	// if(historyList.length > 1) historyText = historyList.join(', ');
	// else if(historyList.length == 1) historyText = historyList[0];
	// history.innerText = historyText;
	
	return history;
}

function renderCards() {
	document.querySelector('.list').innerHTML = '';
	
	for(c = 0; c < window['cards']; c++)
	{
		let div = document.createElement('div');
		div.classList.add('card');
		
		let [a,b] = generateMatrix();
		let table = generateCard(a,b);
		div.appendChild(table);	
		
		let away = document.createElement('div');
		away.classList.add('away');
		div.appendChild(away);
		
		document.querySelector('.list').appendChild(div);
	}
	
}

function generateMatrix(set) {
	let numbers = [];
	let selected = [];
	for(i = 0; i < 25; i++)
	{
		if(!set && i == 12)
		{
			numbers[i] = 'FREE';
			continue;
		}
		
		let rnd = 0;
		do
		{
			rnd = Math.floor(Math.random() * 15) + ((i % 5) * 15) + 1;
		}
		while (numbers.indexOf(rnd) >= 0)
		numbers[i] = rnd;
		if(set) selected[i] = set.includes(i+1);
	}
	if(config.debug) console.log('numbers', [numbers, selected]);
	return [numbers, selected];
}

function generateCard(numbers, selected, latest) {
	if(config.debug) console.log('card', numbers, selected);
	
	let table = document.createElement('table');
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	if(numbers)
	{
		let first = document.createElement('tr');
		for(let label of config.cards.labels)
		{
			let th = document.createElement('th');
			th.classList.add('label');
			th.innerText = label;		
			first.appendChild(th);
		}
		tbody.appendChild(first);
	}
	
	for(m = 0; m < 5; m++)
	{
		let tr = document.createElement('tr');
		if(latest && m > 0)
		{
			continue;
		}
	
		for(n = 0; n < 5; n++)
		{
			let td = document.createElement('td');
			td.classList.add('shadowed');
			if(latest && m == 0 && n > 0)
			{
				continue;
			}
			if(numbers) // card on board
			{
				td.classList.add('square-card');
				// td.classList.add('large-font');
				td.setAttribute('data-id', m*5+n+1);
				td.innerText = numbers && numbers[m*5+n] || '';
				td.addEventListener('click', function() {
					if(!window['ended'])
					{
						this.classList.toggle('daub' + window['daub']);
						this.classList.toggle('selected');
						onCellClicked();
					}
				});
			}
			else if(latest && m == 0 && n == 0) // call box
			{
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
			else // pattern grid
			{
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
	
	if(numbers)
	{
		let row = document.createElement('tr');
		
		let generate = document.createElement('td');
		generate.classList.add('generate');
		generate.setAttribute('colspan', '5');
		generate.classList.add('shadowed');
		generate.classList.add('large-font');
		generate.innerText = 'Generate';
		generate.addEventListener('click', onGenerateClicked);
		
		row.appendChild(generate);
		
		tbody.appendChild(row);
	}
	
	table.appendChild(tbody);
	
	return table;
}

function createOrUpdateCustom() {
	if(!window['ended']) return;
	this.classList.toggle('daub' + window['daub']);
	this.classList.toggle('selected');
	let values = Array.from(document.querySelectorAll('.pattern-grid .selected')).map(p => parseInt(p.getAttribute('data-id')));
	window['custom'] = values;
	
	document.querySelector('.pattern-title').innerText = 'Custom';
}

function renderActions() {
	document.querySelector('.menu').innerHTML = '';
	
	let bingo = document.createElement('div');
	bingo.id = 'bingo';
	bingo.classList.add('shadowed');
	bingo.classList.add('large-font');
	bingo.innerText = 'Start';
	bingo.addEventListener('click', onBingoClicked);
	document.querySelector('.menu').appendChild(bingo);
}

function onGenerateClicked() {
	let id = Array.from(document.querySelectorAll('.generate')).indexOf(this);
	if(config.debug) console.log(id);
	
	switch(this.innerText)
	{
		case 'Generate':
			let [a,b] = generateMatrix();
			let newCard = generateCard(a,b);
			document.querySelectorAll('.card')[id].innerHTML = '';
			document.querySelectorAll('.card')[id].appendChild(newCard);
			
			let away = document.createElement('div');
			away.classList.add('away');
			document.querySelectorAll('.card')[id].appendChild(away);
			
			break;
		case 'Bingo':
			if(checkBingo(id) == true)
				endBingo();
			break;
	}
}

function onBingoClicked() {
	switch(this.innerText)
	{
		case 'Start':
			if(startBingo() == true)
			{
				this.innerText = 'Pause';
			}
			break;
		case 'Resume':
			if(togglePause() == true)
			{
				this.innerText = 'Pause';
			}
			break;
		case 'Pause':
			if(togglePause() == true)
			{
				this.innerText = 'Resume';
			}
			break;
		case 'Reset':
			if(resetBingo() == true)
			{
				this.innerText = 'Start';
			}
			break;
	}
}

function onCellClicked() {
	for(c = 0; c < window['cards']; c++)
	{
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
		
		let count = isAnyBingo(pattern) ? null : pattern.length;
		if(isAnyBingo(pattern))
		{
			// if has combo, check on all then find smallest value
			let counts = [];
			for(let p = 0; p < pattern.length; p++)
			{
				counts[p] = pattern[p].length;
				for(let selection of selected)
				{
					// if user selected is in pattern cell and board has pattern cell
					// if free space, don't have to check board
					if(pattern[p].indexOf(selection.index) >= 0 && (selection.index == 13 || revealed.indexOf(selection.value) >= 0))
						counts[p]--; // reduce count
				}
			}
			// console.log(counts);
			count = Math.min(...counts);
		}
		else {
			for(let selection of selected)
			{
				// if user selected is in pattern cell and board has pattern cell
				// if free space, don't have to check board
				if(pattern.indexOf(selection.index) >= 0 && (selection.index == 13 || revealed.indexOf(selection.value) >= 0))
					count--; // reduce count
			}
		}
		
		document.querySelectorAll('.away')[c].setAttribute('data-away', count);
		document.querySelectorAll('.away')[c].innerText = count + ' AWAY';
	}
}

function startBingo() {
	window['ended'] = false;
	window['board'] = [];
	let board = generateBoard();
	document.querySelector('.board').innerHTML = '';
	document.querySelector('.board').appendChild(board);
	
	if(window['custom'])
	{
		window['combination'] = 'Custom';
		// if same as previous set, set again
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
	
	if(!window['combination'])
	{
		let combination = config.patterns[Math.floor((Math.random() * config.patterns.length))];
		generatePattern(combination);
	}
	
	for(let generate of document.querySelectorAll('.generate'))
	{
		generate.innerText = 'Bingo';
	}
	
	for(let generate of document.querySelectorAll('.away'))
	{
		let combination = config.patterns.find(p => p.name == window['combination']);
		if(isAnyBingo(combination.selected))
		{
			generate.innerText = combination.selected[0].length + ' AWAY';
		}
		else
		{
			generate.innerText = combination.selected.length + ' AWAY';
		}
	}
	
	setTimeout(callNumber, 500);
	
	return true;
}

function pauseBingo() {
	if(window['paused'] == true)
		setTimeout(pauseBingo, 500);
	else
		setTimeout(callNumber, config.interval);
}

function callNumber() {
	if(config.debug) console.log('bingo', window['bingo']);
	if(window['ended'] == true || window['bingo'].filter(b => b && b == 1).length == window['cards'].length)
		return;
	if(window['paused'] == true) {
		pauseBingo();
		return;
	}
	
	//generate number
	let rand = 0;
	do
	{
		rand = Math.floor((Math.random() * 75)) + 1;
	} while(window['board'].includes(rand) && window['board'].length < 75);
	if(config.debug) console.log('rand', rand);
	window['board'].push(rand);
	document.querySelector('.board' + rand).classList.add('selected');
	
	//update history
	if(window['call-hist'].length >= 5)
	{
		window['call-hist'].pop();
	}
	if(window['call']) window['call-hist'].unshift(window['call']);
	
	let history = document.querySelector('.history');
	history.innerHTML = '';
	history.appendChild(generateHistory());
	
	//update latest
	window['call'] = rand;
	document.querySelector('.latest').innerText = '';
	setTimeout(function() { document.querySelector('.latest').innerText = window['call']; }, 250);
	setTimeout(function() { if(config.autoFill) autoFillCards(window['call']);	}, 500);
	
	let category = config.cards.labels[Math.floor((rand-1) / 15)];
	if(config.debug) console.log('category', category);
	window['category'] = category;
	document.querySelector('.category').innerText = '';
	setTimeout(function() { document.querySelector('.category').innerText = window['category']; }, 250);
	
	//call again
	if(window['board'].length < 75 && window['ended'] == false)
		setTimeout(callNumber, config.interval);
	else
		endBingo();
}

function autoFillCards(value) {
	//limitation: does not update if user clicked it off
	//limitation: does not auto fill free space
	for(let card of document.querySelectorAll('.card'))
	{
		for(let cell of card.querySelectorAll('td'))
		{
			if(cell.innerText == value.toString()) {
				//trigger click event
				if(config.debug) console.log(card, cell, cell.innerText);
				cell.click();
			}
		}
	}	
}

function checkBingo(id) {
	 //from bingo button
	let away = document.querySelectorAll('.away')[id].getAttribute('data-away');
	let isBingo = away == '0';
	let revealed = window['board'];
	let pattern = config.patterns.find(p => p.name == window['combination']).selected;
	
	if(isBingo && revealed.length < (isAnyBingo(pattern) ? Math.min(...pattern.map(pp => pp.length)) : pattern.length))
	{
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
	
	if(isBingo && revealed.length < selected.length)
	{
		if(config.debug) alert('game has not revealed minimum to fill card');
		return false;
	}
	
	if(isBingo)
	{
		if(config.debug) alert('bingo');
		card.querySelector('.generate').innerText = '✔️';
		// setTimeout(function() { document.querySelectorAll('.card')[id].querySelector('.generate').innerText = 'Generate'; }, 1000);
		window['bingo'][id] = 1;
		return true;
	}
	else
	{
		if(config.debug) alert('not yet');
		card.querySelector('.generate').innerText = '❌';
		setTimeout(function() { document.querySelectorAll('.card')[id].querySelector('.generate').innerText = 'Bingo'; }, 1000);
		return false;
	}
}

function endBingo() {
	if(config.debug) console.log('end');
	window['ended'] = true;
	document.querySelector('#bingo').style.display = '';
	document.querySelector('#bingo').innerText = 'Reset';
}

function resetBingo() {
	document.querySelector('.category').innerHTML = '';
	document.querySelector('.latest').innerHTML = '';
	document.querySelector('.history').innerHTML = '';
	
	let board = generateBoard();
	document.querySelector('.board').innerHTML = '';
	document.querySelector('.board').appendChild(board);
	
	for(let generate of document.querySelectorAll('.generate'))
	{
		generate.innerText = 'Generate';
	}
	initializeVariables();
	generatePattern();
	renderCards();
	return true;
}

function isAnyBingo(pattern) {
	return pattern.filter(a => typeof(a) == 'object').length == pattern.length;
}