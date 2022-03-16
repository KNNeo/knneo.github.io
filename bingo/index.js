//--DEFAULT SETTINGS--//
const combinations = [
	{
		"name": "W",
		"selected": [1,5,6,10,11,13,15,16,18,20,22,24],
	},
	{
		"name": "E",
		"selected": [1,2,3,4,5,6,11,12,13,14,15,16,21,22,23,24,25],
	},
];

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
const smallScreen = window.innerWidth <= 640;


//--FUNCTIONS--//
window.addEventListener('load', startup);

function startup() {
	window['combination'] = 'W';
	renderList();
	renderActions();
}

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	let numbers = [];
	for(i = 0; i < 25; i++)
	{
		if(i == 12)
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
	}
	// console.log('numbers', numbers);
	
	let table = document.createElement('table');
	table.id = 'card';
	table.classList.add('box');
	
	let tbody = document.createElement('tbody');
	
	for(m = 0; m < 5; m++)
	{
		let tr = document.createElement('tr');
	
		for(n = 0; n < 5; n++)
		{
			let td = document.createElement('td');
			td.classList.add('square');
			td.classList.add('large-font');
			td.classList.add('shadowed');
			td.setAttribute('data-id', m*5+n+1);
			td.innerText = numbers[m*5+n];
			td.addEventListener('click', function() {
				this.classList.toggle('selected');
			});
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	document.querySelector('.list').appendChild(table);	
}

function renderActions() {
	let generate = document.createElement('div');
	generate.id = 'generate';
	generate.classList.add('shadowed');
	generate.classList.add('large-font');
	generate.innerText = 'Generate';
	generate.addEventListener('click', renderList);
	document.querySelector('.menu').appendChild(generate);

	let bingo = document.createElement('div');
	bingo.id = 'bingo';
	bingo.classList.add('shadowed');
	bingo.classList.add('large-font');
	bingo.innerText = 'Bingo';
	bingo.addEventListener('click', checkBingo);
	document.querySelector('.menu').appendChild(bingo);
}

function checkBingo() {
	let card = document.querySelector('#card');
	let selectedIndices = Array.from(card.querySelectorAll('.selected')).map(cell => parseInt(cell.getAttribute('data-id')));
	console.log(JSON.stringify(selectedIndices));
	
	let target = combinations.filter(c => c.name == 'W')[0];
	let count = 0;
	for(let number of target.selected)
	{
		if(selectedIndices.indexOf(number) >= 0)
			count++;
	}
	
	if(count == target.selected.length)
	{
		document.querySelector('#bingo').innerText = '✔️';
		// console.log('bingo');
	}
	else
	{
		document.querySelector('#bingo').innerText = '❌';
		// console.log('not yet');
	}
	setTimeout(function() { document.querySelector('#bingo').innerText = 'Bingo'; }, 1000);
}