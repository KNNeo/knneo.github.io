//--DEFAULT SETTINGS--//
const pageTitle = 'Video Playlist';
const playlistId = 'PL_jWj0Wl8TG-UlSmo4HG3kDtTJYBO4UgB';
const apiKey = function() {
	// contains method to obtain YouTube API v3 key to query
	return localStorage.getItem('videolist-key');
};
const version = '20250429';

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
const baseUrl = 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50';
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
		let thumbnail = elem.querySelector('.thumbnail');
        if (thumbnail.complete && inView) {
			thumbnail.src = thumbnail.getAttribute('data-image');	
            elem.classList.add('tile-view');
            setTimeout(function() { elem.classList.add('no-delay'); }, 500);
        }
		else {
            elem.classList.remove('tile-view');
            elem.classList.remove('no-delay');
        }
    }
}

function checkLastUpdated(check) {
	// console.log(check, localStorage.getItem('videolist-etag'));
	let lastTag = localStorage.getItem('videolist-etag') || '';
	let nowTag = check;
	return lastTag == nowTag;
}

function checkVer(override) {
	//for any changes to local storage, can wipe remotely if number not tally
	if(override || localStorage.getItem('videolist-ver') != version)
	{
		localStorage.removeItem('videolist-list');
		localStorage.removeItem('videolist-deleted');
		localStorage.removeItem('videolist-search');
		localStorage.removeItem('videolist-with-playlist');
		localStorage.removeItem('videolist-etag');
		localStorage.setItem('videolist-ver', version);
	}
}

function openRequest() {
	checkVer();
	initializeVariables();
	renderMenu();
	runLoader();
	getJson(baseUrl + '&playlistId=' + playlistId + '&key=' + apiKey(), onLoadJson);
}

function onLoadJson(response) {
	if(response != null) 
	{
		// console.log('response available', response);
		//process the rest
		let items = response.items.filter(l => l.snippet.thumbnails.default != null);
		if(response.nextPageToken)
		{
			// console.log('next token available', response.nextPageToken);
			//if fetch same tag, then take from storage, skip load response
			if(checkLastUpdated(response.etag))
			{
				console.log('no change to playlist: load from storage');
				window['list'] = JSON.parse(localStorage.getItem('videolist-list'));
				window['deleted'] = JSON.parse(localStorage.getItem('videolist-deleted'));
				startup();
			}
			else //load response, get next response via token
			{
				if(!window['connected'])
					localStorage.setItem('videolist-etag', response.etag);
				
				// console.log(items);
				window['list'] = window['list'].concat(items);
				window['deleted'] = window['deleted'].concat(response.items.filter(l => l.snippet.thumbnails.default == null));
				window['connected'] = true;
				getJson(baseUrl + '&pageToken=' + response.nextPageToken +  
					'&playlistId=' + playlistId + '&key=' + apiKey(), onLoadJson);
			}
		}
		else //load last response, start render
		{
			// console.log(items);
			window['list'] = window['list'].concat(items);
			window['deleted'] = window['deleted'].concat(response.items.filter(l => l.snippet.thumbnails.default == null));
			window['list'] = window['list'].map(res => {
				return {
					video: {
						id: res.snippet.resourceId.videoId,
						title: res.snippet.title,
						thumbnail: res.snippet.thumbnails.default.url,
						date: res.snippet.publishedAt,
						url: 'https://www.youtube.com/watch?v='
						+ res.snippet.resourceId.videoId,
					},
					channel: {
						id: res.snippet.videoOwnerChannelId,
						title: res.snippet.videoOwnerChannelTitle,
						url: 'https://www.youtube.com/channel/'
						+ res.snippet.videoOwnerChannelId,
					}
				};
			});
			// console.log('done', window['list']);
			localStorage.setItem('videolist-list', JSON.stringify(window['list']));
			localStorage.setItem('videolist-deleted', JSON.stringify(window['deleted']));
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
	window['deleted'] = [];
	window['loading'] = true;
	window['connected'] = false;
	window['response'] = [];
}

function startup() {
	list = Array.from(window['list']);
	stopLoader();
	renderList();
	window.scrollTo(0,0);
	if(window['deleted'].length > 0)
		console.log(window['deleted'].length + ' deleted video(s) detected');
}

function renderMenu() {
	let title = document.createElement('h3');
	title.classList.add('title');
	title.innerText = pageTitle;
	title.style.cursor = 'pointer';
	title.addEventListener('click', startup);
	
	document.querySelector('.menu').appendChild(title);
	
	let loader = document.createElement('div');
	loader.classList.add('loader');
	loader.classList.add('material-icons');
	
	document.querySelector('.menu').appendChild(loader);
	
	let description = document.createElement('h6');
	description.classList.add('title');
	
		let descriptionSource = document.createElement('a');
		descriptionSource.href = 'https://www.youtube.com/playlist?list=' + playlistId;
		descriptionSource.innerText = 'Go To YouTube Playlist';
		descriptionSource.setAttribute('target','_blank');
		
		description.appendChild(descriptionSource);
	
	document.querySelector('.menu').appendChild(description);

	let search = document.createElement('a');
	search.classList.add('search');
	search.classList.add('material-icons');
	search.title = 'Search Video/Channel';
	search.innerText = 'search';
	if(localStorage.getItem('videolist-search')?.length > 0) {
		search.innerText = 'saved_search';
		search.style.color = 'var(--foreground)';
	}
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
	
	let withPlaylist = document.createElement('a');
	withPlaylist.classList.add('material-icons');
	withPlaylist.title = localStorage.getItem('videolist-with-playlist') == 'true' ? 'Playing Video with Playlist' : 'Playing Video Only';
	withPlaylist.innerText =  localStorage.getItem('videolist-with-playlist') == 'true' ? 'queue_music' : 'music_note';
	withPlaylist.addEventListener('click', toggleWithPlaylist);
	document.querySelector('.menu').appendChild(withPlaylist);

	let showMapping = document.createElement('a');
	showMapping.classList.add('material-icons');
	showMapping.title = localStorage.getItem('videolist-show-mapping') == 'true' ? 'Showing Video Mapping' : 'Showing Original Tags';
	showMapping.innerText =  localStorage.getItem('videolist-show-mapping') == 'true' ? 'nat' : 'hdr_strong';
	showMapping.addEventListener('click', toggleShowMapping);
	document.querySelector('.menu').appendChild(showMapping);
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
	switch(event.target.innerText) {
		case 'search':
			let input = prompt('Enter search term (case-insensitive):\n[Empty to reset, stored in memory]');
			if (input != null) {
				event.target.innerText = 'saved_search';
				event.target.style.color = 'var(--foreground)';
				localStorage.setItem('videolist-search', input || '');
			}
			break;
		case 'saved_search':
			event.target.innerText = 'search';
			event.target.style.color = '';
			localStorage.setItem('videolist-search', '');
			break;
		default:
			break;
	}
	renderList();
}

function toggleWithPlaylist(event) {
	switch(event.target.innerText) {
		case 'queue_music':
			event.target.innerText = 'music_note';
			event.target.title = 'Playing Video Only';
			localStorage.setItem('videolist-with-playlist', false);
			break;
		case 'music_note':
			event.target.innerText = 'queue_music';
			event.target.title = 'Playing Video with Playlist';
			localStorage.setItem('videolist-with-playlist', true);
			break;
		default:
			break;
	}
	renderList();
}

function toggleShowMapping(event) {
	switch(event.target.innerText) {
		case 'hdr_strong':
			event.target.innerText = 'nat';
			event.target.title = 'Showing Video Mapping';
			localStorage.setItem('videolist-show-mapping', true);
			break;
		case 'nat':
			event.target.innerText = 'hdr_strong';
			event.target.title = 'Showing Original Tags';
			localStorage.setItem('videolist-show-mapping', false);
			break;
		default:
			break;
	}
	renderList();
}

function randomVideo() {
	let random = list[Math.floor(Math.random() * list.length)];
	window.open(random.video.url + (localStorage.getItem('videolist-with-playlist') == 'true' ? '&list=' + playlistId : ''));
}

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	for(let v of list.filter(l => 
		l.video.title.toLowerCase()
		.includes((localStorage.getItem('videolist-search') || '').toLowerCase()) ||
		l.channel.title.toLowerCase()
		.includes((localStorage.getItem('videolist-search') || '').toLowerCase())
		))
	{
		let video = document.createElement('div');
		video.id = v.video.id;
		video.classList.add('box');
		video.classList.add('tile');
		video.classList.add('shadowed');
        video.addEventListener('contextmenu', function() {
            event.preventDefault();
            this.classList.toggle('overlay');
        });

            let mapping = document.createElement('div');
            mapping.classList.add('mapping');
			video.appendChild(mapping);

            let songLabel = document.createElement('label');
            songLabel.classList.add('song');
            songLabel.textContent = "Song Title:";
            let songInput = document.createElement('input');
            songInput.value = v.mapping?.song || v.video.title;
            songInput.addEventListener('input', function() {
                let vid = list.find(l => l.video.id == v.video.id);
                if(!vid.mapping) vid.mapping = {};
                vid.mapping.song = this.value;
                localStorage.setItem('videolist-list', JSON.stringify(window['list']));
            });
			songLabel.appendChild(songInput);
			mapping.appendChild(songLabel);

            let artistLabel = document.createElement('label');
            artistLabel.classList.add('artist');
            artistLabel.textContent = "Artist Title:";
            let artistInput = document.createElement('input');
            artistInput.value = v.mapping?.artist || v.channel.title;
            artistInput.addEventListener('input', function() {
                let vid = list.find(l => l.video.id == v.video.id);
                if(!vid.mapping) vid.mapping = {};
                vid.mapping.artist = this.value;
                localStorage.setItem('videolist-list', JSON.stringify(window['list']));
            });
			artistLabel.appendChild(artistInput);
			mapping.appendChild(artistLabel);


            let closeMapping = document.createElement('button');
            closeMapping.innerText = 'Close';
            closeMapping.addEventListener('click', function() {
                event.stopPropagation();
                video.classList.remove('overlay');
            });
            mapping.appendChild(closeMapping);
		
			let thumbnail = document.createElement('img');
			thumbnail.classList.add('thumbnail');
			thumbnail.setAttribute('data-image', v.video.thumbnail);
			thumbnail.title = v.video.title;
			thumbnail.addEventListener('click', function() {
				window.open(v.video.url);
			});
			video.appendChild(thumbnail);
			
			let title = document.createElement('div');
			
				let titleLink = document.createElement('a');
				titleLink.classList.add('video-link');
				titleLink.href = v.video.url + (localStorage.getItem('videolist-with-playlist') == 'true' ? '&list=' + playlistId : '');
				titleLink.innerText = localStorage.getItem('videolist-show-mapping') == 'true' ? (v.mapping?.song || v.video.title) : v.video.title;
				titleLink.setAttribute('target','_blank');
			
				title.appendChild(titleLink);
								
			video.appendChild(title);	
			
			let channel = document.createElement('div');

				let channelLink = document.createElement('a');
				channelLink.classList.add('channel-link');
				channelLink.href = v.channel.url;
				channelLink.innerText = localStorage.getItem('videolist-show-mapping') == 'true' ? (v.mapping?.artist || v.channel.title) : v.channel.title;
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
		localStorage.setItem('videolist-key', input);
		location.reload();
	}
}

function exportMappingData() {
	let textOutput = '"Id","Date Added","Title","Channel","Thumbnail","Url","Song Title","Artist Title"';
	for(let v of window['list'])
	{
		textOutput += '\n';

		let line = '"' + v.video.id + '","' + v.video.date + '","' + v.video.title + '","' + v.channel.title + '","' + v.video.thumbnail + '","' + v.video.url + '","' + (v.mapping?.song || '') +  '","' + (v.mapping?.artist || '') + '"';
		textOutput += line;
	}
	
	//create download file
	let downloadLink = document.createElement('a');
	downloadLink.href = 'data:text/plain;charset=utf-16,' + encodeURIComponent(textOutput);
	downloadLink.target = '_blank';
	downloadLink.download = 'videos.csv';
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	
	console.log('Export done');
}
