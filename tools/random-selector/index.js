//--DEFAULT SETTINGS--//
let config = {
	id: {
		list: 'random-selector-list',
		history: 'random-selector-history',
	},
	template: [
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
	],
	placeholder: '>>No Data<<'
};

//--FUNCTIONS--//
window.addEventListener('load', function() {
	document.getElementById('locations').value = localStorage.getItem(config.id.list) ?? config.template.join('\n');
	document.getElementById('results').style.display = 'none';
	document.getElementById('result1').style.display = 'none';
	document.getElementById('history').innerText = localStorage.getItem(config.id.history) != null ? localStorage.getItem(config.id.history) : emptyText;
});

function loadPreset(textbox) {
	document.getElementById(textbox.name).value = config.template.join('\n');
	localStorage.setItem(config.id.list, document.getElementById(textbox.name).value); 
}

function generate(button) {
	localStorage.setItem(config.id.list, document.getElementById('locations').value); 
	
    let input = document.getElementById(button.name).value;
	let list = input.split('\n');
	let histories = document.getElementById('history').innerText.split('\n');
	if(histories.length == list.length)
		document.getElementById('history').innerText = config.placeholder;
	if(document.getElementById('history').innerText == config.placeholder)
		histories = [];
	
	let selected = list[Math.floor(list.length * Math.random())];
	
	while (histories.indexOf(selected) >= 0)
	{
		selected = list[Math.floor(list.length * Math.random())]
	}

	document.getElementById('result1').innerText = selected;
	document.getElementById('result1').style.display = document.getElementById('result1').innerText.length > 0 ? '' : 'none';
	let newVal = document.getElementById('history').innerText == config.placeholder 
	? document.getElementById('result1').innerText 
	: document.getElementById('result1').innerText + '\n' + document.getElementById('history').innerText;
	document.getElementById('history').innerText = newVal;
	localStorage.setItem(config.id.history, newVal);
}

function reset(button) {
	document.getElementById('history').innerText = emptyText;
	localStorage.setItem(config.id.history, document.getElementById('history').innerText);
	document.getElementById('locations').value = '';
}