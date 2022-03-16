//--DEFAULT SETTINGS--//


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
	renderList();
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
	table.classList.add('box');
	table.classList.add('shadowed');
	
	let tbody = document.createElement('tbody');
	
	for(m = 0; m < 5; m++)
	{
		let tr = document.createElement('tr');
	
		for(n = 0; n < 5; n++)
		{
			let td = document.createElement('td');
			td.classList.add('square');
			td.innerText = numbers[m*5+n];
			td.addEventListener('click', function() {
				this.style.backgroundColor = this.style.backgroundColor == '' ? 'lightgray' : '';
			});
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	document.querySelector('.list').appendChild(table);	
}