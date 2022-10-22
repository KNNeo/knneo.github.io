//--DEFAULT SETTINGS--//
const channels = [];

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';

//--FUNCTIONS--//
let list = [];
let playlistId = 'PL_jWj0Wl8TG-UlSmo4HG3kDtTJYBO4UgB';
let clientId = function() {
	return localStorage.getItem('clientId');
};
let apiKey = function() {
	// contains method to obtain YouTube API v3 key to query
	return localStorage.getItem('apiKey');
};

function authenticate() {
return gapi.auth2.getAuthInstance()
	.signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
	.then(function() { console.log("Sign-in successful"); },
		  function(err) { console.error("Error signing in", err); });
}
function loadClient() {
gapi.client.setApiKey(apiKey);
return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
	.then(function() { console.log("GAPI client loaded for API"); },
		  function(err) { console.error("Error loading GAPI client for API", err); });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute() {
return gapi.client.youtube.playlistItems.list({
  "part": [
	"contentDetails"
  ],
  "playlistId": playlistId,
})
	.then(function(response) {
			// Handle the results here (response.result has the parsed body).
			console.log("Response", response);
			window['list'] = response;
		  },
		  function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
gapi.auth2.init({client_id: clientId});
});

function startup() {
	authenticate().then(loadClient);
	console.log('authenticated');
	list = Array.from(window['list']);
	renderMenu();
	renderList();
	window.addEventListener('scroll', fadeIn); 
	window.scrollTo(0,0);
}

function fadeIn() {
	let boxes = document.querySelectorAll(".tile");
    for (let elem of boxes) {
        // let elem = boxes[i]
        let distInViewFromTop = elem.getBoundingClientRect().top - window.innerHeight + 20;
        let distInViewFromBottom = elem.getBoundingClientRect().bottom + window.innerHeight - 20;
		let inView = distInViewFromTop <= 0 && distInViewFromBottom > window.innerHeight;
		let thumbnail = elem.querySelector('img');
        if (thumbnail.complete && inView) {
			thumbnail.src = thumbnail.getAttribute('data-image');
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
	// document.querySelector('.menu').innerHTML = '';
	
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
			// thumbnail.style.backgroundSize = 'contain';
			// thumbnail.style.backgroundRepeat = 'no-repeat';
			// thumbnail.style.backgroundPosition = 'center';
			thumbnail.style.width = '120px';
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
								
			video.appendChild(title);	
			
			let channel = document.createElement('div');

				let channelLink = document.createElement('a');
				channelLink.innerText = v.channel;
				if(channels[v.channel])
				{
					channelLink.classList.add('video-link');
					channelLink.href = channels[v.channel];
					channelLink.setAttribute('target','_blank');
					// channelLink.style.cursor = 'pointer';
					// channelLink.addEventListener('click', function() {
						// window.open();
					// });
				}
				
				channel.appendChild(channelLink);
				
			video.appendChild(channel);
		
		document.querySelector('.list').appendChild(video);
	}
	
	setTimeout(fadeIn, 200);
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
