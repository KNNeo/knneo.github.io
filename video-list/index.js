//--DEFAULT SETTINGS--//

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';

//--FUNCTIONS--//
let list = [];

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		window['list'] = JSON.parse(this.responseText);
		//code here
		if(window['list'] != null) startup();
	}
};
xmlhttp.open("GET", "https://knneo.github.io/video-list/list.json", true);
xmlhttp.send();

function startup() {
	list = Array.from(window['list']);
	renderMenu();
	renderList();
	window.addEventListener('scroll', fadeIn); 
}

function fadeIn() {
	let boxes = document.querySelectorAll(".tile");
    for (let elem of boxes) {
        // let elem = boxes[i]
        let distInViewFromTop = elem.getBoundingClientRect().top - window.innerHeight + 20;
        if (distInViewFromTop < 0) {
            elem.classList.add("tile-view");
            setTimeout(function() { elem.classList.add("no-delay"); }, 500);
        }
		else {
            elem.classList.remove("tile-view");
            elem.classList.remove("no-delay");
        }
    }
}

function renderMenu() {
	document.querySelector('.menu').innerHTML = '';
	
	let sort = document.createElement('a');
	sort.classList.add('material-icons');
	sort.title = 'Sort by Video Title';
	sort.innerText = 'swap_vert';
	sort.addEventListener('click', toggleSort);
		
	document.querySelector('.menu').appendChild(sort);
	
	let shuffle = document.createElement('a');
	shuffle.classList.add('material-icons');
	shuffle.title = 'Play Random Video';
	shuffle.innerText = 'shuffle';
	shuffle.addEventListener('click', randomVideo);
		
	document.querySelector('.menu').appendChild(shuffle);
}

function toggleSort(event) {
	switch(event.target.innerText) {
		case 'swap_vert':
			event.target.innerText = 'south';
			list.sort(function(a,b) {
				return a.title.localeCompare(b.title, 'ja');
			});
			break;
		case 'south':
			event.target.innerText = 'north';
			list.sort(function(a,b) {
				return b.title.localeCompare(a.title, 'ja');
			});
			break;
		case 'north':
			event.target.innerText = 'swap_vert';
			list = Array.from(window['list']);
			break;
		default:
			break;
	}
	renderList();
}

function randomVideo(event) {
	let random = list[Math.floor(Math.random() * list.length)];
	window.open(random.link);
}

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	for(let v of list)
	{
		let video = document.createElement('div');
		video.classList.add('box');
		video.classList.add('tile');
		video.classList.add('shadowed');
		video.id = v.id;
		
			let thumbnail = document.createElement('img');
			thumbnail.classList.add('thumbnail');
			thumbnail.setAttribute('data-image', v.thumbnail);
			thumbnail.style.backgroundSize = 'contain';
			thumbnail.style.backgroundRepeat = 'no-repeat';
			thumbnail.style.backgroundPosition = 'center';
			// thumbnail.style.backgroundImage = addUrlClause(v.thumbnail);
			thumbnail.style.width = '120px';
			// thumbnail.style.height = '150px';
			thumbnail.addEventListener('click', function() {
				window.open(v.link);
			});
			
			video.appendChild(thumbnail);
			
			let title = document.createElement('div');
			
				let titleLink = document.createElement('a');
				titleLink.href = v.link;
				titleLink.innerText = v.title;			
				titleLink.setAttribute('target','_blank');
			
				title.appendChild(titleLink);
				
				let channel = document.createElement('div');
				channel.innerText = v.channel;
				
				title.appendChild(channel);
				
			video.appendChild(title);			
		
		document.querySelector('.list').appendChild(video);
	}
	
	setTimeout(loadImages, 200);
	fadeIn();
}

function loadImages() {
	for(let image of document.querySelectorAll('.thumbnail'))
	{
		image.src = image.getAttribute('data-image');
	}
}

function addUrlClause(url) {
	return "url('" + url + "')";
}
