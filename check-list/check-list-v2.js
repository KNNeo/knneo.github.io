//--CUSTOM VARIABLES AS PRESET LIST--//
const keys = [
	'Academic Painting',
	'Amazing Painting',
	'Ancient Statue',
	'Basic Painting',
	'Beautiful Statue',
	'Calm Painting',
	'Common Painting',
	'Detailed Painting',
	'Dynamic Painting',
	'Familiar Statue',
	'Famous Painting',
	'Flowery Painting',
	'Gallant Statue',
	'Glowing Painting',
	'Graceful Painting',
	'Great Statue',
	'Informative Statue',
	'Jolly Painting',
	'Moody Painting',
	'Motherly Statue',
	'Moving Painting',
	'Mysterious Painting',
	'Mystic Statue',
	'Nice Painting',
	'Perfect Painting',
	'Proper Painting',
	'Quaint Painting',
	'Robust Statue',
	'Rock-Head Statue',
	'Scary Painting',
	'Scenic Painting',
	'Serene Painting',
	'Sinking Painting',
	'Solemn Painting',
	'Tremendous Statue',
	'Twinkling Painting',
	'Valiant Statue',
	'Warm Painting',
	'Warrior Statue',
	'Wild Painting Left Half',
	'Wild Painting Right Half',
	'Wistful Painting',
	'Worthy Painting'
];

//--INITIAL STATE OF CHECKLISTS--//
let initialState = [
	{
		showCheckbox: true,
		title: 'Animal Crossing New Horizons Artworks',
		listKeys: keys,
		listItems: [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0], //if not filled to listKeys length, will be default false
	},
];

//--EVENTS--//
window.addEventListener('load', startup);
window.addEventListener('resize', setContainerHeight);

//--FUNCTIONS--//
function startup() {
	loadPage();
};

function loadPage() {
	generateStorageArrays();
	loadChecklists();
	setContainerHeight();
}

function setContainerHeight() {
	let container = document.getElementById('checklist-box');
	let headerHeight = document.getElementById('header').offsetHeight + 20;
	let settingsHeight = document.getElementById('settings').offsetHeight + 20;
	let remainingHeight = window.innerHeight - headerHeight - settingsHeight - 40;
	container.style.height = remainingHeight + 'px';
}

function generateInitialArrays() {
	localStorage.setItem('checklists','[]');
	for(let w = 0; w < initialState.length; w++)
	{
		window['checklist' + w] = {
			title: initialState[w].title,
			array: initialState[w].listKeys.map((current, index) => {
				// console.log('value', index, initialState[w].listItems[index]);
				return {
					key: current,
					value: initialState[w].listItems[index] > 0,
				}
			}),
		};
	}
}

function generateStorageArrays() {
	let storage = JSON.parse(localStorage.getItem('checklists'));
	if(storage != null && storage.length > 0)
	{
		for(let w = 0; w < storage.length; w++)
		{
			window['checklist' + w] = storage[w];
		}
	}
	else
	{
		console.log('No localStorage, using initialState');
		generateInitialArrays();
	}
}

function loadChecklists() {
	document.getElementById('checklist-box').innerHTML = '';
	for(let w = 0; w < initialState.length; w++)
	{
		let list = window['checklist' + w];
		loadChecklist(w, list.array);
	}
}

function loadChecklist(index, list) {
	let main = document.getElementById('checklist-box');
	
	let checklistDiv = document.createElement('div');
	checklistDiv.id = 'checklist' + index;
	checklistDiv.classList.add('profile-box');
	checklistDiv.classList.add('shadowed');
	
	let sortedList = list;//.sort(function (a, b) {return b.value - a.value});
	//console.log(sortedList);
	
	//list
	for(let v = 0; v < sortedList.length; v++)
	{
		let checkboxDiv = document.createElement('div');
		checkboxDiv.style.padding = '10px 10px';
		
		let label = document.createElement('label');
		
		
		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.value = index + '-' + v; //checklist-item
		checkbox.checked = sortedList[v].value ?? false;
		checkbox.addEventListener('click', updateStorage);
		label.appendChild(checkbox);
		
		let labelSpan = document.createElement('span');
		labelSpan.innerText = sortedList[v].key;
		label.appendChild(labelSpan);
		
		checkboxDiv.appendChild(label);
		
		checklistDiv.appendChild(checkboxDiv);		
	}
	
	let buttonsDiv = document.createElement('div');
	buttonsDiv.classList.add('checklist-actions');
	
	//reset button: exports list as raw, clears values
	let resetButton = document.createElement('button');
	resetButton.innerText = 'Reset';
	resetButton.value = 'checklist' + index;
	resetButton.addEventListener('click', resetList);
	
	buttonsDiv.appendChild(resetButton);
	
	//export button: exports list as readable, keeps values
	let exportButton = document.createElement('button');
	exportButton.innerText = 'Export';
	exportButton.value = 'checklist' + index;
	exportButton.addEventListener('click', exportList);
	
	buttonsDiv.appendChild(exportButton);
	
	checklistDiv.appendChild(buttonsDiv);
	
	main.appendChild(checklistDiv);
	
}

function updateStorage() {
	let variables = this.value.split('-');
	let checklistId = variables[0];
	let itemId = variables[1];
	
	let checklist = window['checklist' + checklistId];
	let item = checklist.array[itemId];
	item.value = this.checked;
	
	let currentStorage = JSON.parse(localStorage.getItem('checklists'));
	currentStorage.splice(checklistId, 1, checklist);
	localStorage.setItem('checklists', JSON.stringify(currentStorage));
	// console.log('localStorage', localStorage.getItem('checklists'));
}

//allows manual update of initial state
function resetList() {
	var reply = confirm('Do you want to reset? The current checklist will be copied to clipboard');
	if(reply == true) {
		//copy to clipboard download file
		navigator.clipboard.writeText(JSON.stringify(window[this.value]));
		alert('Checklist "' + checklist.title + '" in clipboard');
		
		//clear
		let currentStorage = JSON.parse(localStorage.getItem('checklists'));
		let checklistId = this.value.replace('checklist', '');
		let checklist = window['checklist' + checklistId];
		for(let item of checklist.array)
		{
			item.value = false;
		}
		currentStorage.splice(checklistId, 1, checklist);
		localStorage.setItem('checklists', JSON.stringify(currentStorage));
		
		this.disabled = true;
		
		loadChecklists();
	}
}

//user friendly list reading
function exportList() {
	//create download file
	let checklist = window[this.value];
	let checklistString = '';
	for(let item of checklist.array) 
	{
		checklistString += (item.value ? '[x]' : '[ ]') + ' ' + item.key + '\n';
	}
	// let checklist = generateArray(keys);
	let downloadLink = document.createElement('a');
	downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(checklistString);
	downloadLink.target = '_blank';
	downloadLink.download = checklist.title + '.txt';
	downloadLink.click();
}
