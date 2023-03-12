//--DEFAULT SETTINGS--//
let emptyText = 'No Data';

//--FUNCTIONS--//
window.addEventListener('load', function() {
	document.getElementById('input1').value = parseInt(localStorage.getItem('no-of-cols'));
	document.getElementById('input2').value = parseInt(localStorage.getItem('no-of-rows'));
	document.getElementById('result1').style.display = 'none';
	document.getElementById('history').innerText = localStorage.getItem('history') != null ? localStorage.getItem('history') : emptyText;
});

function loadPreset(textbox) {
	document.getElementById(textbox.name).value = list.join('\n');
	localStorage.setItem('list', document.getElementById(textbox.name).value); 
}

function generate() {
	// localStorage.setItem('list', document.getElementById('locations').value); 
	
    let columns = parseInt(document.getElementById('input1')?.value ?? 0);
    let rows = parseInt(document.getElementById('input2')?.value ?? 0);
	if(columns != parseInt(localStorage.getItem('no-of-cols')) || rows != parseInt(localStorage.getItem('no-of-rows'))) reset();
	localStorage.setItem('no-of-cols', columns);
	localStorage.setItem('no-of-rows', rows);
	
	if(columns <= 1 || rows <= 1) return;
	let histories = document.getElementById('history').innerText.split('\n');
	if(document.getElementById('history').innerText == emptyText)
		histories = [];
	
	let item1 = {
		row: Math.floor(rows * Math.random()) + 1,
		col: Math.floor(columns * Math.random()) + 1
	};
	item1.left = item1.col;
	item1.right = item1.col >= 0.5*columns ? columns - item1.col : null;
	
	let item2 = item1;
	do {
		item2 = {
			row: Math.floor(rows * Math.random()) + 1,
			col: Math.floor(columns * Math.random()) + 1
		};
		item2.left = item2.col;
		item2.right = item2.col > 0.5*columns ? columns - item2.col : null;
	} while (item1.row == item2.row && item1.col == item2.col);

	// show result
	document.getElementById('result1').innerText = (item1.right ? item1.right + ' from right' : item1.left + ' from left') + ' of row ' + item1.row + ' 🔀 ' + (item2.right ? item2.right + ' from right' : item2.left + ' from left') + ' of row ' + item2.row;
	document.getElementById('result1').style.display = document.getElementById('result1').innerText.length > 0 ? '' : 'none';
	
	// add to history
	let newVal = document.getElementById('history').innerText == emptyText 
	? document.getElementById('result1').innerText 
	: document.getElementById('result1').innerText + '\n' + document.getElementById('history').innerText;
	document.getElementById('history').innerText = newVal;
	localStorage.setItem('history', newVal);
}

function reset() {
	document.getElementById('history').innerText = emptyText;
	localStorage.setItem('history', document.getElementById('history').innerText);
}