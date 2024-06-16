//constants
const isBlogger = function() {
	return window.location.href.includes('.blogspot.com'); //if false, is blogger
};
const isSmallWidth = function() {
	return window.innerWidth <= 880;
}
const isMediumWidth = function () {
	return window.innerWidth <= 1024;
}

function windowOnHistoryChange() {
	// if viewer open, close and return
	if(document.querySelector('.viewer')?.classList.contains('open')) {
		console.log('close viewer');
		// event.preventDefault();
		closeViewer();
	}
	// if dialog open, close and return
	else if(document.querySelector('.dialog') != null) {
		console.log('close dialog');
		// event.preventDefault();
		removeDialog();
	}
	// if popup open, close and return
	else if(document.querySelector('.overlay') != null) {
		console.log('close popup overlay');
		// event.preventDefault();
		closePopups();
	}
	if(window.location.hash.length > 2) // with delay to prevent hashchange
		setTimeout(function() {
			scrollToElement(document.getElementById(window.location.hash.substring(1)));
		}, 0);
}

//==FUNCTIONS==//
// Add hashtags for Entertainment News posts with anchors
function addHashtags() {
	let tags = document.querySelector('#hashtags, .hashtags');
	if (tags != null)
	{
		// empty hashtags if any content
		tags.innerHTML = '';		
		// if is search result, remove all old hashtags
		if(window.location.href.includes("/search/")) {
			for(let element of document.querySelectorAll("[id='hashtags']"))
				element.style.display = 'none';
			return;
		}		
		// create hashtags
		var hashtags = [];		
		// add any tag with anchor
		let sections = document.querySelectorAll(".post-body [id]:not(#hashtags):not(#news-thumbnail):not(#disclaimer):not(.twitter-tweet iframe[id]):not(#table):not(#music):not(.list):not(audio):not(video):not(object)");
		if(sections.length > 0)
		{
			for(let section of sections) {
				if(section.id.length > 1 && section.id.length <= 64) // set max id length
					hashtags.push({ tag: section.id, target: section.id });
				else {
					console.error('hashtag length too long: ' + section.id);
					return;
				}
			}
		}
		// special case for klassic note: one per post, inner text is 'This Week on Klassic Note'
		for(let span of document.querySelectorAll('.post-body span')) {
			if(span.innerText == 'This Week on Klassic Note') {
				//set id on class
				span.id = 'KlassicNote';
				hashtags.push({ tag: 'ThisWeekOnKlassicNote', target: span.id });
				break;
			}
		}
		// render hashtag
		if(hashtags.length > 0) {
			for(let item of hashtags) {
				let newItem = document.createElement('a');
				newItem.innerText = '#' + item.tag;
				newItem.title = item.tag;
				newItem.href = '#' + item.target;
				tags.appendChild(newItem);
			}
		}
	}
	if(typeof generateHeader == 'function') generateHeader();
	if(typeof generateReadTime == 'function') generateReadTime();
}

// Set initial scroll if current page url has hash
function scrollToSectionByUrl() {
	if(window.location.hash.length > 2) // not triggered via windowOnHistoryChange
		scrollToElement(document.getElementById(window.location.hash.substring(1)));
}

function scrollToElement(elem) {
	// helper function to scroll to any element, assuming header is present
	if(elem != null) {
		let newPos = document.documentElement.scrollTop + (elem?.getBoundingClientRect().top || 0) - (document.querySelector('.page-header')?.getBoundingClientRect().height || 0) - 5;
		console.log(newPos);
		// check against scrollTop
		if(document.documentElement.scrollTop != newPos)
			document.documentElement.scrollTop = newPos;
	}
}

function showAbbrAsDialog() {
	// Abbreviation to show as dialog if not using mouse to hover
	// Exception: published field in github site
	for(let abbr of document.querySelectorAll('.published, abbr[title]')) {
		abbr.addEventListener('click', function() {
			event.preventDefault();
			popupText(event.target.title);
		});
	}
}

function focusOnExpandFineprint() {
	// Fineprint component, click to toggle show full text or condensed
	for(let fp of document.querySelectorAll('.fineprint')) {
		fp.addEventListener('click', function() {
			fp.classList.toggle('show');
			fp.scrollIntoView({ block: 'center' });
		});
	}
}

function setExpander() {
	// Accordion component, click to toggle show extra text or just header
	for(let expander of document.querySelectorAll('.accordion .header, .accordion .footer'))
		expander?.addEventListener('click', toggleExpander);
}

function toggleExpander() {
	let parent = event.target.closest('.accordion');
	parent.classList.toggle('show');
	parent.querySelector('.header').scrollIntoView({ block: 'center' });
}

// Dialog element, to show popup content
function popupText(input) {
	// Dialog component
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null) {
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// Helper function to create dialog with content
	// Note: Node in dialog will not have events! Manual add back or write as attribute!
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
	dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		if(event.target.parentElement == document.querySelector('.dialog'))
			removeDialog();
	});
	dialog.addEventListener('keyup', function() {
		// event.preventDefault();
	});
	return dialog;
}

function removeDialog() {
	if(event) event.preventDefault(); // Prevent the default form submission
	document.querySelector('.dialog')?.remove();
}

// Popup element, based on content type
function addHoverForLinks() {
    for (let link of document.querySelectorAll('.post-body.entry-content a[target]'))
		link.addEventListener('mouseover', renderPopup);
}

function addPopupEvents() {
    for (let popup of document.querySelectorAll('.post-body.entry-content .new-t')) {
		popup.querySelector('.new-thumbnail-initial').href = popup.getAttribute('data-url');
		popup.addEventListener('contextmenu', togglePopup);
		let dataUrl = popup.getAttribute('data-url').toLowerCase();
		if(dataUrl.includes('.jpg') || dataUrl.includes('.png') || dataUrl.includes('.gif') || dataUrl.includes('blogger.googleusercontent.com')){
			popup.classList.add('image-pop');
			popup.addEventListener('click', togglePopup);			
		}
		else
			popup.querySelector('.new-thumbnail-focus').addEventListener('click', closePopups);
    }
}

function togglePopup() {
	// show or hide content popup
	event.preventDefault();
	if(document.querySelector('#PopupBtn') != null && document.querySelector('#PopupBtn').innerText == 'launch')
		window.open(this.getAttribute('data-url'), '_blank');
    else if (this.classList.contains('new-thumbnail')) {
		// hide thumbnails
        this.classList.remove('new-thumbnail');
		// must hide overlay
		hideOverlay();
	}
    else {
		// display
        for (let popup of document.querySelectorAll('.post-body.entry-content .new-thumbnail'))
			popup.classList.remove('new-thumbnail');
        this.classList.add('new-thumbnail');
		// switchToButton('CloseBtn');
		// must show overlay
		showOverlay();
		if(typeof fixExternalFrame == 'function') fixExternalFrame(this);
		// manual render social embed scripts, not the same as when it's loaded already
		renderEmbedProcess();
		// if below threshold height scroll up, else open popup without scroll
		let thresholdHeight = 0.4*window.innerHeight;
		window.scrollTo({
			top: document.querySelector('html').scrollTop + this.getBoundingClientRect().top - (this.getBoundingClientRect().top >= thresholdHeight ? thresholdHeight : this.getBoundingClientRect().top), 
			behavior: 'smooth'
		});
    }
}

function closePopups() {
	let overlay = document.getElementById('Overlay');
	// prevent kill if from sidebar
	if(overlay?.style.display != 'none' && 
		document.querySelector('.fab.close') != null && !document.querySelector('.fab.close').classList.contains('hidden'))
		return;
	// kill youtube videos playing
	for(let video of document.querySelectorAll('.yt-video'))
		video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
	// hide all popup content
	for (let popup of document.querySelectorAll('.post-body.entry-content .new-thumbnail'))
		popup.classList.remove('new-thumbnail');
	// update fabs and overlay
	displayFAB();
	hideOverlay();
}

function renderPopup() {
    event.preventDefault();
	let url = this.href;	
	//exclusion for blogger	images
    if ((url.includes('blogspot.com') || url.includes('blogger.googleusercontent.com')) && this.target == '') return;
	// exclusion for if not open in new tab
    if (this.target == '') return;
	// exclusion class, if any
    if (this.classList.contains('opt-out')) return;
	// if not compatible for any design
    let newContent = generatePopupContent(url);
    if (newContent == null) return;
    let thumbnail = document.createElement('div');
    thumbnail.classList.add('new-t');
	// clone popup content
    let initial = document.createElement('a');
    initial.classList.add('new-thumbnail-initial');
    initial.innerHTML = this.innerHTML;
	// minor fixes for thumbnail display and layout
    let focus = document.createElement('div');
    focus.classList.add('new-thumbnail-focus');
    focus.classList.add('fadeIn');
	if(!url.includes('twitter.com') && !url.includes('/status/'))
		focus.style.paddingTop = '10px';
    focus.innerHTML = newContent;
	focus.addEventListener('click', closePopups);
	// bring it all together
    thumbnail.appendChild(initial);
    thumbnail.appendChild(focus);
	thumbnail.setAttribute('data-url', url);
	// update (illegally) thumbnail popup with embed content
    this.outerHTML = thumbnail.outerHTML;
    addPopupEvents();	
	return thumbnail;
}

function renderEmbedProcess() {
	try {
		if(document.querySelector('#tweet') == null) {
			let tweet = document.createElement('script');
			tweet.id = 'tweet';
			tweet.src = 'https://platform.twitter.com/widgets.js';
			tweet.type = 'text/javascript';
			tweet.charset = 'utf-8';
			tweet.async = 'async';
			document.head.appendChild(tweet);
		}
		
		if(document.querySelector('#insta') == null) {
			let insta = document.createElement('script');
			insta.id = 'insta';
			insta.src = 'https://www.instagram.com/embed.js';
			insta.type = 'text/javascript';
			insta.charset = 'utf-8';
			insta.async = 'async';
			document.head.appendChild(insta);
		}
		
		if(typeof twttr != 'undefined') twttr.widgets.load(); // to render twitter embed
		if(typeof instgrm != 'undefined') window.instgrm.Embeds.process(); // to render instagram embed
	}
	catch(err) {
		console.error(err);
	}
}

function generatePopupContent(content) {
	if (!content) return null;
	let url = content.toLowerCase();
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('blogger.googleusercontent.com')) {
        //process image
        return '<div class="separator"><img style="max-height: 360px; max-width: 100%;" src="_url_" /></div>'.replace('_url_', content);
    }
    if (url.includes('music.apple.com')) {
        //process itunes embed
		let isTrack = url.includes('i=');
        return '<iframe allow="autoplay; encrypted-media;" frameborder="0" height="_height_" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="_url_" style="background: transparent; max-width: _width_px; overflow: hidden; width: 100%;"></iframe>'
		.replace('_height_', isTrack ? 170 : 450)
		.replace('_width_' , isTrack ? 660 : 290)
		.replace('_url_', content.replace('music.apple.com', 'embed.music.apple.com'));
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
        //process twitter embed
		//data-height for timeline is max width
		if (url.includes('/status/')) {
			return '<div style="display: flex;"><blockquote class="twitter-tweet tw-align-center" data-conversation="none" _data_theme_ data-height="_height_"><a href="_url_"></a></blockquote></div>'
			.replace('_data_theme_', document.querySelector('html').classList.contains('darked') ? 'data-theme="dark"' : '')
			.replace('_url_', content.replace('x.com', 'twitter.com'))
			.replace('_height_', 0.5*window.innerHeight);
		}
    }
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/') || url.includes('youtube.com/shorts')) {
        //process youtube embed
        let id = content.substring(content.indexOf('?v=') + 3);
		let altDomain = url.includes('youtu.be/');
		let isShorts = url.includes('youtube.com/shorts');
		if (altDomain) id = content.substring(content.indexOf('youtu.be/') + 9);
		if (isShorts) id = content.substring(content.indexOf('youtube.com/shorts/') + 19, url.length);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media; web-share;" allowfullscreen="" frameborder="0" style="_style_" src="https://www.youtube.com/embed/_id_?enablejsapi=1"></iframe>'
		.replace('_id_', id)
		.replace('_style_', isShorts ? 'min-height: 360px;' : 'max-height: 360px;');
    }
    if (url.includes('instagram.com/p/') || url.includes('instagram.com/reel/')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" style="_style_" data-instgrm-permalink="_url_" data-instgrm-version="14" style="padding:0;"></blockquote></center>'
		.replace('_style_', window.innerWidth >= 550 ? 'width:550px;' : '')
		.replace('_url_', content);
    }
    if (url.includes('jisho.org/search/')) {
        //process page as iframe
        return '<iframe id="jisho-frame" src="_url_" style="height:min(50vh,450px);width:min(98%,640px);"></iframe>'
		.replace('_url_', content);
    }
    if (url.includes('myanimelist.net/')) {
		//courtesy of jikan.moe, process custom div from api
		let result = '<div class="mal-frame {type}"></div>';
        //process page as iframe
		if(url.includes('/anime/')) { // myanimelist.net/anime/54233/Sasayaku_You_ni_Koi_wo_Utau
			result = result.replace('{type}', 'anime');
			let id = content.substring(content.indexOf('/anime/')+1+6, content.lastIndexOf('/'));
			getJson('https://api.jikan.moe/v4/anime/{id}'.replace('{id}', id), createMalElementFromJson);
			return result;
		}
		if(url.includes('/character/')) { // myanimelist.net/character/199341/Aki_Mizuguchi
			result = result.replace('{type}', 'character');
			let id = content.substring(content.indexOf('/character/')+1+10, content.lastIndexOf('/'));
			getJson('https://api.jikan.moe/v4/characters/{id}/full'.replace('{id}', id), createMalElementFromJson);
			return result;
		}
		if(url.includes('/people/')) { // myanimelist.net/people/10071/Mikako_Komatsu
			result = result.replace('{type}', 'people');
			let id = content.substring(content.indexOf('/people/')+1+7, content.lastIndexOf('/'));
			getJson('https://api.jikan.moe/v4/people/{id}/full'.replace('{id}', id), createMalElementFromJson);
			return result;
		}
    }
    return null;
}

function createMalElementFromJson(response) {
	if(response && response.data) {
		// assume json is flat unless specially traversed
		// console.log(response.data);
		// get url to find back parent container
		let url = response.data.url;
		// render container
		let containerDiv = document.createElement('div');
		containerDiv.classList.add('mal-container');
		// render sections
		let contentDiv = document.createElement('div');
		contentDiv.classList.add('mal-content');
		let associatedDiv = document.createElement('div');
		associatedDiv.classList.add('mal-associated');
		let descriptionDiv = document.createElement('div');
		descriptionDiv.classList.add('mal-description');
		let relatedDiv = document.createElement('div');
		relatedDiv.classList.add('mal-related');
		// render fields from response data
		for(let key of Object.keys(response.data))
		{
			if(typeof(key) == 'string' && key == 'voices' && url.includes('/people/')) {
				let contentTitle = document.createElement('div');
				contentTitle.innerText = 'Appears On';
				associatedDiv.appendChild(contentTitle);
				// remove duplicates
				// console.log(response.data[key]);
				let list = response.data[key].reduce(function(total, current, index, arr) {
					if(arr.map(a => a.anime.mal_id).includes(current.anime.mal_id))
						total.push(current);
					return total;
				}, []);
				// for featured, show one main role from own list
				let mains = list.filter(d => window['shows-list'].includes(d.anime.mal_id) && d.role == 'Main');
				let selection = mains.sort(r => 2*Math.random()-1)[0];
				// console.log(mains);
				let contentImg = document.createElement('img');
				contentImg.src = selection.anime.images.jpg.image_url;
				associatedDiv.appendChild(contentImg);
				
				let contentBlock = document.createElement('div');
				contentBlock.innerText = selection.anime.title;
				associatedDiv.appendChild(contentBlock);
				
				let contentHeader = document.createElement('div');
				contentHeader.innerText = 'Also Appears On';
				relatedDiv.appendChild(contentHeader);
				
				// for related, show other roles from own list
				mains = list.filter(d => window['shows-list'].includes(d.anime.mal_id) && d.anime.mal_id != selection.anime.mal_id);
				// if not enough, show everything else
				if(mains.length < 5) mains = list.filter(d => d.role == 'Main');
				// if still not enough, show remaining
				let related = mains.length > 5 ? mains.sort(r => 2*Math.random()-1).slice(0,5) : mains.sort(r => 2*Math.random()-1);
				// console.log(mains);
				for(let anime of related) {
					let contentRow = document.createElement('div');
					
					let contentTitle = document.createElement('div');
					contentTitle.innerText = 'Appears On';
					if(!url.includes('/people/')) contentRow.appendChild(contentTitle);
					
					let contentImg = document.createElement('img');
					contentImg.src = anime.anime.images.jpg.image_url;
					contentRow.appendChild(contentImg);
					
					let contentBlock = document.createElement('div');
					contentBlock.innerText = anime.anime.title;
					contentRow.appendChild(contentBlock);
					
					relatedDiv.appendChild(contentRow);
				}
			} // associated and related block for people
			if(typeof(key) == 'string' && key == 'anime' && url.includes('/character/')) {
				// console.log(response.data[key][0]);
				let contentHeader = document.createElement('div');
				contentHeader.innerText = 'Appears On';
				associatedDiv.appendChild(contentHeader);
				
				let contentImg = document.createElement('img');
				contentImg.src = response.data[key][0].anime.images.jpg.image_url;
				associatedDiv.appendChild(contentImg);
				
				let contentBlock = document.createElement('div');
				contentBlock.innerText = response.data[key][0].anime.title;
				associatedDiv.appendChild(contentBlock);
			} // associated block for character
			if(typeof(key) == 'string' && key == 'images') {
				let contentRow = document.createElement('img');
				contentRow.src = response.data[key]['jpg']['image_url'];
				contentDiv.appendChild(contentRow);
			} // image source
			if(typeof(key) == 'string' && key == 'birthday') {
				let contentRow = document.createElement('div');
				contentRow.innerText = new Date(response.data[key]).toLocaleDateString();
				contentDiv.appendChild(contentRow);
			} // date treatment
			if(typeof(key) == 'string' && key == 'aired') {
				let contentRow = document.createElement('div');
				contentRow.innerText = response.data[key].string;
				contentDiv.appendChild(contentRow);
			} // date period treatment
			if(typeof(key) == 'string' && ['about','synopsis'].includes(key)) {
				let contentRow = document.createElement('div');
				contentRow.innerText = response.data[key];
				descriptionDiv.appendChild(contentRow);
			} // specific fields as specified by key
			if(typeof(key) == 'string' && ['name','score','title','type'].includes(key)) {
				let contentRow = document.createElement('div');
				contentRow.innerText = response.data[key];
				contentDiv.appendChild(contentRow);
			} // for all other fields as specified by key
		}
		// append sections to container
		containerDiv.appendChild(contentDiv);
		if(associatedDiv.childElementCount > 0) containerDiv.appendChild(associatedDiv);
		containerDiv.appendChild(descriptionDiv);
		if(relatedDiv.childElementCount > 0) containerDiv.appendChild(relatedDiv);
		// replace html of initial container
		document.querySelector('.new-t[data-url="_url_"] .new-thumbnail-focus .mal-frame'.replace('_url_', url)).innerHTML = containerDiv.outerHTML;
	}
}

// overlay element for popups
function showOverlay() {
	let overlay = document.createElement('div');
	overlay.className = 'overlay';
	overlay.addEventListener('click', closePopups);
	overlay.addEventListener('contextmenu', function() {
		event.preventDefault();
	});
	document.body.appendChild(overlay);
}

function hideOverlay() {
	document.querySelector('.overlay')?.remove();
}

// Floating action button events
function displayFAB() {
	// initial state assume all menus hidden
	if(document.querySelector('#Overlay') != null && document.querySelector('#Overlay').style.display != 'none')
		return;
	if(!navigator.share)
		document.querySelector('.fab.share')?.remove();
	document.querySelector('.action-menu.bottom-left')?.classList.add('show');
	document.querySelector('.action-menu.bottom-right')?.classList.add('show');
	if(isBlogger()) {
		toggleActions(['.fab.share', '.fab.search'], '.action-menu.bottom-right');
		if(isMediumWidth()) toggleActions(['.fab.sidebar'], '.action-menu.bottom-left');
		else toggleActions([], '.action-menu.bottom-left');
	}
}

function toggleActionsOnScroll() {
	// toggle button display on scroll
	let pageDown = document.body.scrollTop > 0.3 * document.documentElement.clientHeight || 
	document.documentElement.scrollTop > 0.3 * document.documentElement.clientHeight;
	if (pageDown)
		toggleActions(['.fab.share', '.fab.search', '.fab.top'], '.action-menu.bottom-right');
	else
		toggleActions(['.fab.share', '.fab.search', '.fab.theme'], '.action-menu.bottom-right');
	// calculate scroll difference and scroll from top
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - (window['scrollTop'] || 0);
	let scrollDown = st > 0.3 * document.documentElement.clientHeight && diff >= 0.1;
	// toggle action menus display on scroll
	if(!scrollDown || !pageDown) {
		document.querySelector('.action-menu.bottom-left')?.classList.remove('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.remove('hide');
	}
	else if(isSmallWidth()) { // on smaller screens hide when scroll down
		document.querySelector('.action-menu.bottom-left')?.classList.add('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.add('hide');
	}
	// toggle page header
	if(typeof toggleHeaderByOffset == 'function')
		toggleHeaderByOffset(st > 0.3 * document.documentElement.clientHeight, diff <= 0.1);
	// set scroll state
	window['scrollTop'] = st;
	// hide viewer if open and use wants to scroll
	if(document.querySelector('.viewer.open') != null)
		closeViewer();
}

function toggleActions(showElements, parentElement) {
	// allow toggle button from menu type
	if(!showElements || !parentElement) return;
	if(typeof(parentElement) == 'string') parentElement = document.querySelector(parentElement);
	
	// hide all in parent element: assume has fab class children
	for(let fab of parentElement.querySelectorAll('.fab'))
		fab.classList.add('hidden');
	
	// show button(s) specified
	if(Array.isArray(showElements)) {
		for(let elem of showElements) {
			if(typeof(elem) == 'string') elem = document.querySelector(elem);
			if(elem != null) elem.classList.remove('hidden');
		}
	}
	else if(typeof(showElements) == 'string') {
		showElements = document.querySelector(showElements);
		if(showElements != null) showElements.classList.remove('hidden');
	}
	else if(showElements != null)
		showElements.classList.remove('hidden');
}

function goToTop() {
	// reset history
	history.replaceState(null, null, ' ');
	// scroll to top of DOM
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;
}

async function sharePage() {
  try {
	let pageTitle = document.querySelector('.post-title.entry-title')?.innerText || document.querySelector('.title')?.innerText;
	let pageText = 'From Klassic Note Web Reports' + (!isBlogger() ? ' Archive' : '');
	if(navigator.share)
		await navigator.share({
			title: pageTitle,
			text: pageTitle + ' - ' + pageText,
			url: window.location.href,
		});
  } catch (err) {
    console.error(err);
  }
}

// Multi-image thumbnail: Define max caption height, onclick event
function setThumbnails() {
	// check thumbnail images with links
	let thumbImagesWithLinks = Array.from(document.querySelectorAll('.thumbnail img')).filter(i => i.parentElement.tagName.toLowerCase() === 'a');
	if(thumbImagesWithLinks.length > 0) {
		console.error('Thumbnail has image with link: Will prevent switchThumbnails assignment');
		console.error(thumbImagesWithLinks);
		disableThumbnails();
		return;
	}
	// check thumbnail class names logic violation
	let thumbInitials = Array.from(document.querySelectorAll('.thumbnail')).filter(i => i.querySelectorAll('.thumbnail-initial:not(.thumbnail-pop)').length != 1);
	// no of thumbnails with initial class not exactly 1
	if(thumbInitials.length > 0) {
		console.error("Thumbnail classList definition error: Will prevent switchThumbnails assignment");
		console.log(thumbInitials);
		disableThumbnails();
		return;
	}
	// process thumbnail logic
    for (let thumbnail of document.querySelectorAll('.thumbnail')) {
	    // ignore new borders if span width
	    // if(Array.from(thumbnail.querySelectorAll('tr')).filter(tr => tr.querySelectorAll('td').length > 1).length > 0)
		    // thumbnail.classList.add('ignore');
		// set height for first thumbnail content
		thumbnail.style.height = thumbnail.querySelector('.thumbnail-initial:not(.thumbnail-pop)').offsetHeight + 'px';
		// add click event for first thumbnail content
        let allThumbImages = thumbnail.querySelectorAll('td > img');
		// show if loaded first content
		if(allThumbImages.length > 0 && allThumbImages[0].complete)
			thumbnail.classList.add('show');
        for (let thumbImage of allThumbImages) {
            thumbImage.onclick = function() {
                switchThumbnails(event.target.closest('.thumbnail'));
            };
			if(allThumbImages.length > 6 && typeof generateViewer == 'function')
				thumbImage.oncontextmenu = function() {
					event.preventDefault();
					showAllThumbnails(thumbnail);
				};
        }
		// text only (experimental)
		if(allThumbImages.length < 1 &&
		thumbnail.querySelectorAll('.thumbnail-initial').length > 0 &&
		thumbnail.querySelectorAll('.thumbnail-pop').length > 0)
		{
			let textElement = document.createElement('span');
			textElement.classList.add('thumbnail-text');
			textElement.innerHTML = thumbnail.querySelectorAll('.thumbnail-initial')[0].innerHTML;
			let popupText = thumbnail.querySelectorAll('.thumbnail-pop')[0].innerHTML;
			textElement.onclick = function() {
				let dialogElement = document.querySelector('.thumbnail-dialog') ?? document.createElement('dialog');
				dialogElement.className = 'thumbnail-dialog';
				dialogElement.onclick = function() {
					this.close();
				};
				dialogElement.innerHTML = popupText;
				if(document.querySelector('.thumbnail-dialog') == null)
					document.body.appendChild(dialogElement);
				dialogElement.showModal();
			};			
			thumbnail.style.display = 'inline';
			thumbnail.replaceWith(textElement);
		}		
		// add indices
		let counter = 1;
        let items = thumbnail.querySelectorAll('.thumbnail-initial');
        for (let item of items) {
			if(!item.hasAttribute('data-index')) {
				item.setAttribute('data-index', counter++);
				item.setAttribute('data-length', items.length);
			}
        }
    }
}

function disableThumbnails() {
	for(let thumb of document.querySelectorAll('.thumbnail-initial'))
		thumb.classList.toggle('thumbnail-initial');
	for(let thumb of document.querySelectorAll('.thumbnail-pop'))
		thumb.classList.toggle('thumbnail-pop');
}

function switchThumbnails(tn, index) {
	// helper function to switch thumbnail content, in order and loop
    let tc = tn.getElementsByClassName('thumbnail-initial');
	// identify current active
	let active = Array.from(tc).findIndex(t => !t.classList.contains('thumbnail-pop'));
	if(active == null) return;
	// to reset before setting new active
	for(let t of Array.from(tc).filter(c => !c.classList.contains('thumbnail-pop')))
		t.classList.add('thumbnail-pop');
	// show next active
	let nextActive = tc[active].nextElementSibling;
	if(nextActive == null) nextActive = tn.firstElementChild;
	if(index != null) nextActive = tc[index];
	nextActive.classList.remove('thumbnail-pop');
	// fastscroll: transition disabled if click/tap fast enough
	if(new Date() - window['tn'] < 200) 
		tn.classList.add('fastscroll');
	else 
		window['tn'] = new Date();
	// set height change delay due to transition
	setTimeout(function() {
		let activeHeight = parseInt(tn.style.height.replace('px',''));
		if(Math.abs(activeHeight - nextActive.offsetHeight) > 10)
			tn.style.height = nextActive.offsetHeight + 'px';
	}, tn.classList.contains('fastscroll') ? 0 : 200);
}

function showAllThumbnails(tn) {
	// when thumbnails count exceed max no, right click thumbnail to show all in viewer
	if(typeof openImagesInViewer == 'function' && document.querySelector('.viewer') != null)
		openImagesInViewer(tn.querySelectorAll('.thumbnail-initial'));
}

// Responsive image resizing based on screen dimensions
function resizeImages() {
    /* Current assumptions:
    ~Images that always resize to 100% instead of retaining original size which can fit screen, consider putting back original size if no overflow
	~Images need to have width and height attribute, especially if tr has multiple td/img
    */
    for (var p of document.querySelectorAll('img')) {
		resizeImage(p);
		p.addEventListener('load', function() {
			resizeImage(p);
		}); // redundancy for slow networks
    }
}

function resizeImage(p) {
	// Conditions that cannot fix - workaround
	// Multiple table cells with caption row - set width style for caption row in %
	// let p = event?.target || img;
	let showLog = false;
	if(showLog) console.log(p);
	var imgWidth = p.width;
	var imgHeight = p.height;
	if(showLog) console.log('width x height', imgWidth, imgHeight);
	// exclusion list
	if ((isBlogger() && (imgWidth < 20 || imgHeight < 20)) || p.id == 'news-thumbnail') {
		if(showLog) console.log('exclusion', p, p.parentElement);
		p.classList.add('img-unchanged');
		return;
	}	
	// if(showLog)	console.log('orientation: ' + (imgWidth >= imgHeight ? 'landscape' : 'portrait'));	
	// adjust dimensions
	if(p.parentElement && p.parentElement.parentElement) {
		let bodyWidth = document.querySelector('.post-body.entry-content')?.clientWidth;
		if(!bodyWidth) return;
		// if (p.parentElement.parentElement.tagName == 'TR' && 
			// p.parentElement.parentElement.getElementsByTagName('td').length > 1 &&
			// !p.parentElement.parentElement.style.width) //in table
			// p.classList.add('img-width-fit');
		// else if (p.parentElement.parentElement.parentElement.tagName == 'TR' && 
			// p.parentElement.parentElement.parentElement.getElementsByTagName('td').length > 1 && 
			// p.parentElement.tagName == 'A' &&
			// !p.parentElement.parentElement.style.width) //in table, with link
			// p.classList.add('img-width-fit');
		if(p.closest('table')) { // table
			let table = p.closest('table');
			let maxImgWidth = Math.max(...Array.from(table.querySelectorAll('tr')).map(tr => tr.querySelectorAll('img').length > 1 ? Array.from(tr.querySelectorAll('img')).reduce((imgs, img) => imgs + img.width, 0) : 0)); // with more than 1 column of images
			if(!table.style.width && !table.style.maxWidth && maxImgWidth) {
				table.style.width = '100%';
				table.style.maxWidth = maxImgWidth + 'px';
			}
			if(showLog)
				console.log(table, parseInt(table.style.maxWidth), parseInt(table.style.maxWidth) + 20 >= bodyWidth);
			// set all images in table
			if(table.style.maxWidth && parseInt(table.style.maxWidth) + 20 >= bodyWidth) {
				table.querySelectorAll('img').forEach(img => img.classList.remove('img-width-auto'));
				table.querySelectorAll('img').forEach(img => img.classList.add('img-width-fit'));
			}
			if(table.style.maxWidth && parseInt(table.style.maxWidth) + 20 < bodyWidth) {
				table.querySelectorAll('img').forEach(img => img.classList.remove('img-width-fit'));
				table.querySelectorAll('img').forEach(img => img.classList.add('img-width-auto'));
			}
			// for even smaller width screens, single image column
			if (p.width + 20 >= bodyWidth && p.closest('tr').querySelectorAll('img').length < 2)
				p.classList.add('img-width-fit');
		}
		else if (p.width + 20 >= bodyWidth)
			p.classList.add('img-width-fit');
		else
			p.classList.add('img-width-auto');
		// special case: to avoid resize issue on reload
		if (p.classList && p.classList.contains('img-width-fit') && p.classList.contains('img-width-auto'))
			p.classList.remove('img-width-auto');	
		// special case: separator class
		if (p.parentElement.className == 'separator' ||
			p.parentElement.parentElement.className == 'separator') {
			p.parentElement.classList.add('img-separator');
			if(showLog) console.log('separator', p.style.marginLeft, p.style.marginRight);
		}
		// special case: image with links, fix margins
		if (p.parentElement.tagName == 'A' && p.parentElement.marginLeft != '' && p.parentElement.marginRight != '') {
			p.parentElement.style.marginLeft = null;
			p.parentElement.style.marginRight = null;
			p.parentElement.classList.add('img-separator');
		}
	}
	// set thumbnails again after adjusted image size
    setThumbnails();
}

async function getJson(source, callback) {
	try	{
		const response = await fetch(source);
		if(response.ok && response.status == 200) {
			const result = await response.json();
			callback(result);
		} else {
			console.error('getJson: ' + response);
			callback(null);
		}
	}
	catch(e) {
		console.error('getJson: ' + e.message);
		callback(null);
	}
}
