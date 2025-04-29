//--DEFAULT SETTINGS--//
const config = {
	version: '20250429',
	title: 'Video Playlist',
	playlist: {
		id: 'PL_jWj0Wl8TG-UlSmo4HG3kDtTJYBO4UgB',
	},
	api: {
		url: 'https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50'
	},
	list: {
		temp: [],
		active: [],
		inactive: []
	},
	loading: true,
	connected: false,
	refresh: false
};
const apiKey = function() {
	// contains method to obtain YouTube API v3 key to query
	return localStorage.getItem('videolist-key');
};

//--EVENT LISTENERS--//
window.addEventListener('load', openRequest);
window.addEventListener('scroll', fadeIn); 

//--EVENT HANDLERS--//
function toggleSort(event) {
	config.list.temp = Array.from(config.list.active);
	switch(event.target.innerText) {
		case 'swap_vert':
			event.target.innerText = 'south';
			config.list.temp.sort(function(a,b) {
				return a.video.title.localeCompare(b.video.title, 'ja');
			});
			break;
		case 'south':
			event.target.innerText = 'north';
			config.list.temp.sort(function(a,b) {
				return b.video.title.localeCompare(a.video.title, 'ja');
			});
			break;
		case 'north':
			event.target.innerText = 'swap_vert';
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
	window.open(random.video.url + (localStorage.getItem('videolist-with-playlist') == 'true' ? '&list=' + config.playlist.id : ''));
}

//--FUNCTIONS--//
function openRequest() {
	checkVer();
	renderMenu();
	runLoader();
	getJson(config.api.url + '&playlistId=' + config.playlist.id + '&key=' + apiKey(), onLoadJson);
}

function checkVer(override) {
	//for any changes to local storage, can wipe remotely if number not tally
	if(override || localStorage.getItem('videolist-ver') != config.version)
	{
		localStorage.removeItem('videolist-list');
		localStorage.removeItem('videolist-deleted');
		localStorage.removeItem('videolist-search');
		localStorage.removeItem('videolist-with-playlist');
		localStorage.removeItem('videolist-etag');
		localStorage.setItem('videolist-ver', config.version);
	}
}

function isPlaylistUpdated(newTag) {
	// console.log(check, localStorage.getItem('videolist-etag'));
	let lastTag = localStorage.getItem('videolist-etag') || '';
	return lastTag != newTag;
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
			if(isPlaylistUpdated(response.etag) && (config.refresh || confirm('new data found on playlist! replace current data?')))
			{
				config.refresh = true;
				//set tag, load response, get next response via token
				if(!config.connected)
					localStorage.setItem('videolist-etag', response.etag);
				
				// console.log(items);
				config.list.active = config.list.active.concat(items);
				config.list.inactive = config.list.inactive.concat(response.items.filter(l => l.snippet.thumbnails.default == null));
				config.connected = true;
				getJson(config.api.url + '&pageToken=' + response.nextPageToken +  
					'&playlistId=' + config.playlist.id + '&key=' + apiKey(), onLoadJson);
			}
			else 
			{
				console.log('no change to playlist: load from storage');
				config.list.active = JSON.parse(localStorage.getItem('videolist-list'));
				config.list.inactive = JSON.parse(localStorage.getItem('videolist-deleted'));
				startup();
			}
		}
		else //load last response, start render
		{
			// console.log(items);
			config.list.active = config.list.active.concat(items);
			config.list.inactive = config.list.inactive.concat(response.items.filter(l => l.snippet.thumbnails.default == null));
			config.list.active = config.list.active.map(res => {
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
			// console.log('done', config.list.active, config.list.inactive);
			localStorage.setItem('videolist-list', JSON.stringify(config.list.active));
			localStorage.setItem('videolist-deleted', JSON.stringify(config.list.inactive));
			startup();
		}
	}
	else
	{
		stopLoader();
		document.querySelector('#key').innerText = 'key_off';
	}
}

//--RENDER--//
function startup() {
	config.refresh = false;
	config.list.temp = Array.from(config.list.active);
	stopLoader();
	renderList();
	window.scrollTo(0,0);
	if(config.list.inactive.length > 0)
		console.log(config.list.inactive.length + ' deleted video(s) detected');
}

function renderMenu() {
	let title = document.createElement('h3');
	title.classList.add('title');
	title.innerText = config.title;
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
		descriptionSource.href = 'https://www.youtube.com/playlist?list=' + config.playlist.id;
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

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	for(let v of config.list.temp.filter(l => 
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
            songLabel.textContent = "Song Title";
            let songInput = document.createElement('input');
            songInput.value = v.mapping?.song || v.video.title;
            songInput.addEventListener('input', function() {
                let vid = config.list.temp.find(l => l.video.id == v.video.id);
                if(!vid.mapping) vid.mapping = {};
                vid.mapping.song = this.value;
                localStorage.setItem('videolist-list', JSON.stringify(config.list.temp));
            });
			songLabel.appendChild(songInput);
			mapping.appendChild(songLabel);

            let artistLabel = document.createElement('label');
            artistLabel.classList.add('artist');
            artistLabel.textContent = "Artist Title";
            let artistInput = document.createElement('input');
            artistInput.value = v.mapping?.artist || v.channel.title;
            artistInput.addEventListener('input', function() {
                let vid = config.list.temp.find(l => l.video.id == v.video.id);
                if(!vid.mapping) vid.mapping = {};
                vid.mapping.artist = this.value;
                localStorage.setItem('videolist-list', JSON.stringify(config.list.temp));
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
				titleLink.href = v.video.url + (localStorage.getItem('videolist-with-playlist') == 'true' ? '&list=' + config.playlist.id : '');
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

//--LOADER--//
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
	if(config.loading) setTimeout(runLoader, 500);
}

function stopLoader() {
	config.loading = false;
	document.querySelector('.loader').classList.add('hidden');
}

//--INPUT--//
function setInput(id) {
	let input = prompt('Enter ' + id);

	if (input != null) {
		localStorage.setItem('videolist-key', input);
		location.reload();
	}
}

function exportMappingData() {
	let textOutput = '"Id","Date Added","Title","Channel","Thumbnail","Url","Song Title","Artist Title"';
	for(let v of config.list.temp)
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
