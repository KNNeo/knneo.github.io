//--DEFAULT SETTINGS--//


//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
const mobile = window.innerWidth < 640;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

//--FUNCTIONS--//
let list = [];
let reader = new FileReader();


function startup() {
	addDragAndDrop();
	resize();
	document.querySelector('#selector').addEventListener('change', onSelect);
	document.querySelector('.screen').addEventListener('click', onClear);
}

function resize() {
	document.querySelector('.dev-spec').innerText = screen.width + ' x ' + screen.height + 'px';
	document.querySelector('.screen').style.backgroundSize = 'auto ' + screen.height + 'px';	
}

function onBrowse(e) {
	document.querySelector('#selector').click();
}

function onSelect(e) {
	list = e.target.files;
	// console.log('onSelect', list[0].name, list[0].type);
	if(list && list.length > 0)
		readFile(list[0]);
}

function onClear(e) {
	reader = new FileReader();
	if(mobile) closeFullscreen();
	document.querySelector('.screen').style.height = '';
	document.querySelector('.screen').src = '';
}

function readFile(file) {
	reader = new FileReader();
    reader.onload = function (e) {
		// console.log('load', e.target.result);
		if(mobile) openFullscreen();
		document.querySelector('.screen').style.height = screen.height + 'px';
		document.querySelector('.screen').src = e.target.result;
	};
    reader.readAsDataURL(file);
}

//drag and drop
function addDragAndDrop() {
	let dropArea = document.createElement('div');
	dropArea.classList.add('drop-area');
	document.body.appendChild(dropArea);

	document.body.addEventListener('dragenter', onDragEnter, false); //show fade
	document.querySelector('.drop-area').addEventListener('dragleave', onDragLeave, false); //revert
	document.querySelector('.drop-area').addEventListener('dragover', onDragEnter, false);
	document.querySelector('.drop-area').addEventListener('drop', onDrop, false); //actual event that does stuff
}

function onDragEnter(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (!dropArea.classList.contains('drop-fade')) dropArea.classList.add('drop-fade');
}

function onDragLeave(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
}

function onDrop(e) {
	e.preventDefault();
	e.stopPropagation();
	let dropArea = document.querySelector('.drop-area');
	if (dropArea.classList.contains('drop-fade')) dropArea.classList.remove('drop-fade');
	
	list = e.dataTransfer.files;
	// console.log('onDrop', list[0].name, list[0].type);
	if(list && list.length > 0)
		readFile(list[0]);
}

//allow document to fullscreen
function openFullscreen() {
	if(!document.querySelector('#fullscreen').checked) return;
	let elem = document.documentElement;
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.mozRequestFullScreen) { //Firefox 
		elem.mozRequestFullScreen();
	} else if (elem.webkitRequestFullscreen) { //Chrome, Safari, Opera
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { //IE,Edge
		elem.msRequestFullscreen();
	}
}

function closeFullscreen() {
	if(!document.querySelector('#fullscreen').checked) return;
	let elem = document.documentElement;
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { //Firefox
		document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { //Chrome, Safari, Opera
		document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { //IE, Edge
		document.msExitFullscreen();
	}
}
