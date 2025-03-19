//--DEFAULT SETTINGS--//
const config = {
	storage: {
		cols: 'item-shuffle-no-of-cols',
		rows: 'item-shuffle-no-of-rows',
		list: 'item-shuffle-list',
		history: 'item-shuffle-history'
	},
	placeholder: 'No Data'
};

//--FUNCTIONS--//
window.addEventListener('load', function() {
	document.getElementById('input1').value = parseInt(localStorage.getItem(config.storage.cols));
	document.getElementById('input2').value = parseInt(localStorage.getItem(config.storage.rows));
	document.getElementById('result1').style.display = 'none';
	document.getElementById('history').innerText = localStorage.getItem(config.storage.history) != null ? localStorage.getItem(config.storage.history) : config.placeholder;
});

function loadPreset(textbox) {
	document.getElementById(textbox.name).value = list.join('\n');
	localStorage.setItem(config.storage.list, document.getElementById(textbox.name).value); 
}

function generate() {
	// localStorage.setItem(config.storage.list, document.getElementById('locations').value); 
	
    let columns = parseInt(document.getElementById('input1')?.value ?? 0);
    let rows = parseInt(document.getElementById('input2')?.value ?? 0);
	if(columns != parseInt(localStorage.getItem(config.storage.cols)) || rows != parseInt(localStorage.getItem(config.storage.rows))) reset();
	localStorage.setItem(config.storage.cols, columns);
	localStorage.setItem(config.storage.rows, rows);
	
	if(columns <= 1 || rows <= 1) return;
	let histories = document.getElementById('history').innerText.split('\n');
	if(document.getElementById('history').innerText == config.placeholder)
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
	let newVal = document.getElementById('history').innerText == config.placeholder 
	? document.getElementById('result1').innerText 
	: document.getElementById('result1').innerText + '\n' + document.getElementById('history').innerText;
	document.getElementById('history').innerText = newVal;
	localStorage.setItem(config.storage.history, newVal);
}

function reset() {
	document.getElementById('history').innerText = config.placeholder;
	localStorage.setItem(config.storage.history, document.getElementById('history').innerText);
}