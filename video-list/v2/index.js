//--DEFAULT SETTINGS--//
const channels = [];
const playlistId = 'PL_jWj0Wl8TG-UlSmo4HG3kDtTJYBO4UgB';
const apiKey = function() {
	// contains method to obtain YouTube API v3 key to query
	return localStorage.getItem('apiKey');
};
// to load api, run the following on console: localStorage.setItem('apiKey', 'YOUR_API_KEY');

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
//do not touch
let list = [];
window.addEventListener('load', openRequest);
window.addEventListener('scroll', fadeIn); 

//--FUNCTIONS--//
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

function checkLastUpdated(check) {
	// console.log(check, localStorage.getItem('etag'));
	let lastTag = localStorage.getItem('etag') || '';
	let nowTag = check;
	return lastTag == nowTag;
}

function openRequest() {
	initializeVariables();
	runLoader();
	renderMenu();
	getJson("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50" +
		"&playlistId=" + playlistId + 
		"&key=" + apiKey(), onLoadJson);
}

function onLoadJson(response) {
	if(response != null) 
	{
		// console.log('response available', response);
		if(response.nextPageToken)
		{
			if(checkLastUpdated(response.etag))
			{
				console.log('no change: load from storage');
				window['list'] = JSON.parse(localStorage.getItem('list'));
				startup();
			}
			else
			{
				if(!window['connected'])
					localStorage.setItem('etag', response.etag);
				// console.log('next token available', response.nextPageToken);
				window['list'] = window['list'].concat(response.items);
				// console.log(response.items);
				window['connected'] = true;
				getJson("https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50" +
					"&pageToken=" + response.nextPageToken + 
					"&playlistId=" + playlistId + 
					"&key=" + apiKey(), onLoadJson);
			}
		}
		else 
		{
			window['list'] = window['list'].concat(response.items);
			// console.log(response.items);
			window['list'] = window['list'].map(res => {
				return {
					video: {
						id: res.snippet.resourceId.videoId,
						title: res.snippet.title,
						thumbnail: res.snippet.thumbnails.default.url,
						url: 'https://www.youtube.com/watch?v='
						+ res.snippet.resourceId.videoId,
						
					},
					channel: {
						id: res.snippet.videoOwnerChannelId,
						title: res.snippet.videoOwnerChannelTitle,
						url: 'https://www.youtube.com/channel/'
						+ res.snippet.videoOwnerChannelId,
					},
				};
			});
			// console.log('done', window['list']);
			localStorage.setItem('list', JSON.stringify(window['list']));
			startup();
		}
	}
	else
	{
		stopLoader();
		document.querySelector('#key').innerText = 'key_off';
	}
}

function initializeVariables() {
	window['list'] = [];
	window['loading'] = true;
	window['connected'] = false;
}

function startup() {
	list = Array.from(window['list']);
	stopLoader();
	renderList();
	window.scrollTo(0,0);
}

function renderMenu() {
	let description = document.createElement('h6');
	description.classList.add('title');
	
		let descriptionSource = document.createElement('a');
		descriptionSource.href = 'https://www.youtube.com/playlist?list=' + playlistId;
		descriptionSource.innerText = 'Go To YouTube Playlist';
		descriptionSource.setAttribute('target','_blank');
		
		description.appendChild(descriptionSource);
	
	document.querySelector('.menu').appendChild(description);

	let search = document.createElement('a');
	search.classList.add('material-icons');
	search.title = 'Search Video/Channel';
	search.innerText = 'search';
	search.addEventListener('click', toggleSearch);

	document.querySelector('.menu').appendChild(search);
	
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
				return a.video.title.localeCompare(b.video.title, 'ja');
			});
			break;
		case 'south':
			event.target.innerText = 'north';
			list.sort(function(a,b) {
				return b.video.title.localeCompare(a.video.title, 'ja');
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

function toggleSearch(event) {
	let input = prompt('Enter search term (case-insensitive):\n[Empty to reset, stored in memory]');

	if (input != null) {
		localStorage.setItem('search', input || '');
		renderList();
	}	
}

function randomVideo() {
	let random = list[Math.floor(Math.random() * list.length)];
	window.open(random.video.url);
}

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	for(let v of list.filter(l => 
		l.video.title.toLowerCase()
		.includes((localStorage.getItem('search') || '').toLowerCase()) ||
		l.channel.title.toLowerCase()
		.includes((localStorage.getItem('search') || '').toLowerCase())
		))
	{
		let video = document.createElement('div');
		video.classList.add('box');
		video.classList.add('tile');
		video.classList.add('shadowed');
		video.id = v.video.id;
		
			let thumbnail = document.createElement('img');
			thumbnail.classList.add('thumbnail');
			thumbnail.setAttribute('data-image', v.video.thumbnail);
			// thumbnail.style.backgroundSize = 'contain';
			// thumbnail.style.backgroundRepeat = 'no-repeat';
			// thumbnail.style.backgroundPosition = 'center';
			thumbnail.style.width = '120px';
			thumbnail.addEventListener('click', function() {
				window.open(v.video.url);
			});
			
			video.appendChild(thumbnail);
			
			let title = document.createElement('div');
			
				let titleLink = document.createElement('a');
				titleLink.href = v.video.url;
				titleLink.innerText = v.video.title;
				titleLink.setAttribute('target','_blank');
			
				title.appendChild(titleLink);
								
			video.appendChild(title);	
			
			let channel = document.createElement('div');

				let channelLink = document.createElement('a');
				channelLink.innerText = v.channel.title;
				channelLink.classList.add('video-link');
				channelLink.href = v.channel.url;
				channelLink.setAttribute('target','_blank');
				
				channel.appendChild(channelLink);
				
			video.appendChild(channel);
		
		document.querySelector('.list').appendChild(video);
	}
	
	setTimeout(fadeIn, 200);
}

function runLoader() {
	switch(document.querySelector('.loader').innerText)
	{
		case 'hourglass_full': 
			document.querySelector('.loader').innerText = 'hourglass_empty';
			break;
		case 'hourglass_empty': 
			document.querySelector('.loader').innerText = 'hourglass_bottom';
			break;
		case 'hourglass_bottom': 
			document.querySelector('.loader').innerText = 'hourglass_full';
			break;
		default:
			document.querySelector('.loader').innerText = 'hourglass_empty';
			break;
	}
	if(window['loading']) setTimeout(runLoader, 500);
}

function stopLoader() {
	window['loading'] = false;
	document.querySelector('.loader').classList.add('hidden');
}

function setInput(id) {
	let input = prompt('Enter ' + id);

	if (input != null) {
		localStorage.setItem('apiKey', input);
		location.reload();
	}
}