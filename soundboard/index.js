//--DEFAULT SETTINGS--//
const config = {};
const example = [
	{
		"audio":"https://res.cloudinary.com/klassicnote/video/upload/soundboard/shoushimin01_ichigo_tart.mp3",
		"quote":"\"ichigo taruto\"",
		"fav":true
	}
];

//--DOM NODE REFERENCES--//
const pageDiv = document.querySelector('.page');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

function onFileUpload(event) {
	let id = document.querySelector('#' + event.target.id);
	let file = event.target.files[0];
	let audio = id.closest('.sound').querySelector('.audio');
	audio.src = URL.createObjectURL(file);
	audio.play();
	console.log(file);
}

function onControl(event) {
	switch(event.target.innerText)
	{
		case 'add_link':
		default:
			let url = prompt('Insert URL:');
			if(url) {
				let audio = event.target.closest('.sound').querySelector('.audio');
				audio.src = url;
				audio.play();
				save();
			}
			break;
	}
}

function onAction(event) {
	switch(event.target.innerText)
	{
		case 'favorite':
			event.target.closest('.sound').classList.remove('fav');
			event.target.innerText = 'favorite_border';
			break;
		case 'favorite_border':
		default:
			event.target.closest('.sound').classList.add('fav');
			event.target.innerText = 'favorite';
			break;
	}
	save();
}

function onQuote(event) {
	save();
}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
function load() {
	let store = JSON.parse(localStorage.getItem('soundboard-data') || '[]');
	let counter = 0;
	for(let item of store)
	{
		let sound = document.querySelectorAll('.sound')[counter];
		sound.querySelector('.audio').src = item.audio;
		sound.querySelector('.quote').value = item.quote || '';
		sound.querySelector('.action').innerText = item.fav ? 'favorite' : 'favorite_border';
	}
}

function loadExample() {
	localStorage.setItem('soundboard-data', JSON.stringify(example));
	load();
}

function save() {
	let store = [];
	for(let item of document.querySelectorAll('.sound'))
	{
		store.push({
			audio: item.querySelector('.audio').src,
			quote: item.querySelector('.quote').value,
			fav: item.querySelector('.action').innerText == 'favorite',
		});
	}
	localStorage.setItem('soundboard-data', JSON.stringify(store));
	
}

//--INITIAL--//
function startup() {
	load();
}
