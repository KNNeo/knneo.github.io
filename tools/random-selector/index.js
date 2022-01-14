//--DEFAULT SETTINGS--//
let list = [
'Let\'s Eat',
'Tok Lae Dee',
'Food Republic',
'Chef Avenue',
'B.E.D.',
'Nearest Kopitiam',
'Across Bridge Kopitiam',
'Jakk & Co.',
'DongMama Thai',
'Leaf Corner',
'Yu Cun',
'Subway'
];

//--FUNCTIONS--//
window.addEventListener('load', function() {
	document.getElementById('locations').value = localStorage.getItem('list');
	document.getElementById('results').style.display = 'none';
	document.getElementById('result1').style.display = 'none';
	document.getElementById('history').innerText = localStorage.getItem('history') != null ? localStorage.getItem('history') : 'No Data';
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
		document.getElementById('history').innerText = 'No Data';
	if(document.getElementById('history').innerText == 'No Data')
		histories = [];
	
	let selected = list[Math.floor(list.length * Math.random())];
	
	while (histories.indexOf(selected) >= 0)
	{
		selected = list[Math.floor(list.length * Math.random())]
	}

	document.getElementById('result1').innerText = selected;
	document.getElementById('result1').style.display = document.getElementById('result1').innerText.length > 0 ? '' : 'none';
	let newVal = document.getElementById('history').innerText == 'No Data' 
	? document.getElementById('result1').innerText 
	: document.getElementById('result1').innerText + '\n' + document.getElementById('history').innerText;
	document.getElementById('history').innerText = newVal;
	localStorage.setItem('history', newVal);
}

function reset(button) {
	document.getElementById('history').innerText = 'No Data';
	localStorage.setItem('history', document.getElementById('history').innerText);
}