const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};

let isDarked = false;
function onDarkModeToggle() {
	toggleDarkMode();
	isDarked = !isDarked;
	localStorage.setItem('darkMode', isDarked);
}
function toggleDarkMode() {
	if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		document.getElementsByTagName('html')[0].classList.remove('darked');
	else
		document.getElementsByTagName('html')[0].classList.add('darked');
}
function loadDarkMode() {
	isDarked = localStorage.getItem("darkMode") == "true";
	if(isDarked == null) localStorage.setItem("darkMode", false);
	if(isDarked == true) toggleDarkMode();
}

let keys = [
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

window.onload = function() {
	loadDarkMode();
	loadChecklist();
};

function loadChecklist() {
	let initialCount = 0;
	let checkList = new Array();
	for(let key of keys)
	{
		let value = localStorage.getItem(key) == "true";
		if(value == null) value = false;
		else initialCount++;
		checkList.push({
			key: key,
			value: value
		});
	}
	
	if(checkList.filter(c => c.value == true).length == 0)
		document.getElementById('resetLink').disabled = true;

	buildChecklistHTML(checkList);
}

function buildChecklistHTML(list) {
	let checklistDiv = document.createElement('div');
	
	let sortedList = list.sort(function (a, b) {return b.value - a.value});
	//console.log(sortedList);
	
	for(let value of sortedList)
	{
		let checkboxDiv = document.createElement('div');
		checkboxDiv.style.padding = '10px 10px';
		
		let label = document.createElement('label');
		
		let labelSpan = document.createElement('span');
		labelSpan.innerText = value.key;
		label.appendChild(labelSpan);
		
		let checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.checked = value.value ?? false;
		checkbox.addEventListener('click', function () {
			localStorage.setItem(this.previousElementSibling.innerText, this.checked);
			document.getElementById('resetLink').disabled = false;
			loadChecklist();
		});
		label.appendChild(checkbox);
		
		checkboxDiv.appendChild(label);
		
		checklistDiv.appendChild(checkboxDiv);		
	}
	
	document.getElementById('checklist').innerHTML = '';
	document.getElementById('checklist').appendChild(checklistDiv);
}

function resetList() {
	var reply = confirm('Do you want to reset? The checklist will be downloaded');
	if(reply == true) {
		//create download file		
		let checkList = new Array();
		for(let key of keys)
		{
			let value = localStorage.getItem(key) == "true";
			if(value == null) value = false;
			checkList.push({
				name: key,
				checked: value
			});
		}
		let downloadLink = document.createElement('a');
		downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(checkList));
		downloadLink.target = '_blank';
		downloadLink.download = 'checklist.txt';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		
		//clear
		localStorage.clear();
		document.getElementById('resetLink').disabled = true;
		loadChecklist();
	}
}
