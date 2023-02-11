//--DEFAULT SETTINGS--//
let list = [
'A&W Restaurants',
'Arby\'s',
'Burger King',
'Carl\'s Jr.',
'Chipotle Mexican Grill',
'Domino\'s Pizza',
'Dunkin\' Donuts',
'Five Guys',
'Jollibee',
'KFC',
'Little Caesars',
'Long John Silver\'s',
'McDonald\'s',
'Panda Express',
'Papa John\'s Pizza',
'Pizza Hut',
'Popeyes',
'Quiznos',
'Red Lobster',
'Red Robin',
'Sbarro',
'Shake Shack',
'Smoothie King',
'Starbucks',
'Subway',
'Taco Bell',
'Tim Hortons',
'Wendy\'s',
'Wingstop',
];
let emptyText = '>>No Data<<';

//--FUNCTIONS--//
window.addEventListener('load', function() {
	document.getElementById('locations').value = localStorage.getItem('list') ?? list.join('\n');
	document.getElementById('results').style.display = 'none';
	document.getElementById('result1').style.display = 'none';
	document.getElementById('history').innerText = localStorage.getItem('history') != null ? localStorage.getItem('history') : emptyText;
});

function loadPreset(textbox) {
	document.getElementById(textbox.name).value = list.join('\n');
	localStorage.setItem('list', document.getElementById(textbox.name).value); 
}

function generate(button) {
	localStorage.setItem('list', document.getElementById('locations').value); 
	
    let input = document.getElementById(button.name).value;
	let list = input.split('\n');
	let histories = document.getElementById('history').innerText.split('\n');
	if(histories.length == list.length)
		document.getElementById('history').innerText = emptyText;
	if(document.getElementById('history').innerText == emptyText)
		histories = [];
	
	let selected = list[Math.floor(list.length * Math.random())];
	
	while (histories.indexOf(selected) >= 0)
	{
		selected = list[Math.floor(list.length * Math.random())]
	}

	document.getElementById('result1').innerText = selected;
	document.getElementById('result1').style.display = document.getElementById('result1').innerText.length > 0 ? '' : 'none';
	let newVal = document.getElementById('history').innerText == emptyText 
	? document.getElementById('result1').innerText 
	: document.getElementById('result1').innerText + '\n' + document.getElementById('history').innerText;
	document.getElementById('history').innerText = newVal;
	localStorage.setItem('history', newVal);
}

function reset(button) {
	document.getElementById('history').innerText = emptyText;
	localStorage.setItem('history', document.getElementById('history').innerText);
	document.getElementById('locations').value = '';
}