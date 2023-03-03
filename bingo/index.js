//--SETTINGS--//
const debugMode = false;
const cardsGenerated = 3;
const interval = 5000;
const labels = ['B','I','N','G','O'];
//only for single pattern combination ie. can't do any horizontal
const combinations = [
	{
		"name": "W",
		"selected": [1,5,6,10,11,13,15,16,18,20,22,24],
	},
	{
		"name": "E",
		"selected": [2,3,4,7,12,13,14,17,22,23,24],
	},
	{
		"name": "N",
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
];
const smallScreen = function() {
    return window.innerWidth <= 640;
};

//--COMMON EVENTS--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
	window['daub'] = localStorage.getItem('daub');
	window['ended'] = true;
	window['combination'] = null;
	window['cards'] = isMobile() || smallScreen() ? 1 : cardsGenerated;
	renderTitle(true);
	renderDisplay();
	renderCards();
	renderActions();
	generatePattern();
}

//--FUNCTIONS--//
function renderTitle(firstLoad) {
	let maxStyles = 3;
	if(!firstLoad) window['daub'] = (window['daub'] + 1 > maxStyles) ? 1 : window['daub'] + 1;
	document.querySelector('.title').classList = 'title daub' + window['daub'];
	localStorage.setItem('daub', window['daub']);
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
	td2.appendChild(generateBoard());
	
	let td3 = document.createElement('td');
	td3.classList.add('box');
	
	let call = document.createElement('div');
	call.classList.add('box');
	call.classList.add('call');
	
	let latestDiv = document.createElement('div');
	latestDiv.classList.add('shadowed');
	latestDiv.classList.add('square-hg');
	
	let category = document.createElement('b');
	category.classList.add('category');
	latestDiv.appendChild(category);
	
	window['call'] = null;
	let latest = document.createElement('div');
	latest.classList.add('latest');
	latest.classList.add('huge-font');
	latest.innerText = window['call'];
	
	latestDiv.appendChild(latest);
	call.appendChild(latestDiv);
	td3.appendChild(call);
	
	window['call-hist'] = [];
	let hist = document.createElement('div');
	hist.classList.add('history');
	if(isMobile() || smallScreen()) hist.style.display = 'inline-block';
	if(isMobile() || smallScreen()) hist.style.width = '100%';
	hist.appendChild(generateHistory());
	td3.appendChild(hist);
	
	let trX = document.createElement('tr');
	
	if(!isMobile() && !smallScreen()) tr.appendChild(td1);
	if(isMobile() || smallScreen()) td2.setAttribute('colspan', 2);
	tr.appendChild(td2);
	if(!isMobile() && !smallScreen()) tr.appendChild(td3);
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
		let index = combinations.indexOf(window['combination']);
		window['combination'] = combinations[index > combinations.length ? 0 : index + 1];
		generatePattern(window['combination']);
	});
	div.appendChild(header);
	
	let pattern = document.createElement('div');
	pattern.classList.add('pattern-grid');
	let [,selected] = generateMatrix(shape && shape.selected || null);
	if(debugMode) console.log(selected);
	let table = generateCard(null, selected);
	if(isMobile() || smallScreen()) table.style.margin = 'auto';
	pattern.appendChild(table);
	
	div.appendChild(pattern);
	
	let title = document.createElement('div');
	title.classList.add('pattern-title');
	title.innerText = shape && shape.name || '-';
	div.appendChild(title);
	
	document.querySelector('.pattern').innerHTML = '';
	document.querySelector('.pattern').appendChild(div);
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
		label.innerText = labels[m];
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

function generateHistory() {
	let history = document.createElement('div');
	
	for (let h of Array.from(window['call-hist']))
	{
		let hist = document.createElement('div');
		hist.classList.add('hist');
		hist.innerText = h;
		
		history.appendChild(hist);
	}
	
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

function generateMatrix(highlighted) {
	let numbers = [];
	let selected = [];
	for(i = 0; i < 25; i++)
	{
		if(!highlighted && i == 12)
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
		if(highlighted) selected[i] = highlighted.includes(i+1);
	}
	if(debugMode) console.log('numbers', [numbers, selected]);
	return [numbers, selected];
}

function generateCard(numbers, selected) {
	if(debugMode) console.log('card', numbers, selected);
	
	let table = document.createElement('table');
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	if(numbers)
	{
		let first = document.createElement('tr');
		for(let label of labels)
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
	
		for(n = 0; n < 5; n++)
		{
			let td = document.createElement('td');
			td.classList.add('shadowed');
			if(numbers)
			{
				td.classList.add('square-lg');
				td.classList.add('large-font');
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
			else
			{
				td.classList.add('square-sm');
				if(selected[m*5+n] == true)
					td.classList.add('selected');
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
	if(debugMode) console.log(id);
	
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
			{
				endBingo();
			}
			break;
	}
}

function onBingoClicked() {
	switch(this.innerText)
	{
		case 'Start':
			if(startBingo() == true)
			{
				this.style.display = 'none';
				this.innerText = 'Reset';
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
		let selectedIndices = Array.from(card.querySelectorAll('.selected')).map(cell => parseInt(cell.getAttribute('data-id')));
		let patternIndices = window['combination'].selected;
		if(debugMode) console.log('cell', selectedIndices, patternIndices);
		
		let count = window['combination'].selected.length;
		for(let index of patternIndices)
		{
			if(selectedIndices.indexOf(index) >= 0)
				count--;
		}
		
		document.querySelectorAll('.away')[c].innerText = count + ' AWAY';
	}
}

function startBingo() {
	window['ended'] = false;
	window['board'] = [];
	let board = generateBoard();
	document.querySelector('.board').innerHTML = '';
	document.querySelector('.board').appendChild(board);
	
	window['combination'] = combinations[Math.floor((Math.random() * combinations.length))];
	generatePattern(window['combination']);
	
	for(let generate of document.querySelectorAll('.generate'))
	{
		generate.innerText = 'Bingo';
	}
	
	for(let generate of document.querySelectorAll('.away'))
	{
		generate.innerText = window['combination'].selected.length + ' AWAY';
	}
	
	setTimeout(callNumber, 500);
	
	return true;
}

function callNumber() {
	if(window['ended'] == true)
		return;
	
	//generate number
	let rand = 0;
	do
	{
		rand = Math.floor((Math.random() * 75)) + 1;
	} while(window['board'].includes(rand) && window['board'].length < 75);
	if(debugMode) console.log('rand', rand);
	window['board'].push(rand);
	document.querySelector('.board' + rand).classList.add('selected');
	
	//update history
	if(window['call-hist'].length >= 4)
	{
		window['call-hist'].pop();
	}
	window['call-hist'].unshift(window['call']);
	
	let history = document.querySelector('.history');
	history.innerHTML = '';
	history.appendChild(generateHistory());
	
	//update latest
	window['call'] = rand;
	document.querySelector('.latest').innerText = '';
	setTimeout(function() { document.querySelector('.latest').innerText = window['call']; }, 200);
	
	let category = labels[Math.floor((rand-1) / 15)];
	if(debugMode) console.log('category', category);
	window['category'] = category;
	document.querySelector('.category').innerText = '';
	setTimeout(function() { document.querySelector('.category').innerText = window['category']; }, 200);
	
	//call again
	if(window['board'].length < 75 && window['ended'] == false)
		setTimeout(callNumber, interval);
	else
		endBingo();
}

function checkBingo(id) { //from bingo button
	let away = document.querySelectorAll('.away')[id].innerText.replace(' AWAY', '');
	let isBingo = away == '0';
	
	if(isBingo && window['board'].length < window['combination'].selected.length)
	{
		if(debugMode) console.log('pattern has more values than board');
		isBingo = false;
	}
	
	let card = document.querySelectorAll('.card')[id];
	let selectedIndices = Array.from(card.querySelectorAll('.selected')).map(cell => parseInt(cell.getAttribute('data-id')));
	if(debugMode) console.log(card);
	
	if(isBingo && window['board'].length < selectedIndices.length)
	{
		if(debugMode) console.log('card has more values than board');
		isBingo = false;
	}
	
	if(isBingo)
	{
		for(let index of selectedIndices)
		{
			if(isBingo && window['board'].indexOf(index) < 0)
			{
				if(debugMode) console.log('card has values not on board');
				isBingo = false;
			}
		}
	}
	
	if(isBingo)
	{
		if(debugMode) console.log('bingo');
		card.querySelector('.generate').innerText = '✔️';
		// setTimeout(function() { document.querySelectorAll('.card')[id].querySelector('.generate').innerText = 'Generate'; }, 1000);
		return true;
	}
	else
	{
		if(debugMode) console.log('not yet');
		card.querySelector('.generate').innerText = '❌';
		setTimeout(function() { document.querySelectorAll('.card')[id].querySelector('.generate').innerText = 'Bingo'; }, 1000);
		return false;
	}
}

function endBingo() {
	if(debugMode) console.log('end');
	window['ended'] = true;
	document.querySelector('#bingo').style.display = '';
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
	renderCards();
	return true;
}