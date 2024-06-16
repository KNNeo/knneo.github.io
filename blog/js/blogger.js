// Single onLoad event control: put all functions in sequence
window.addEventListener('load', function() {
	// Window Events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	// Asynchronous Events
	setTimeout(addHashtags, 0);
	setTimeout(resizeImages, 0);
	setTimeout(displayFAB, 0);
	setTimeout(setExpander, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(scrollToSectionByUrl, 200);
	// Blogger Fixes
	addSearchBar();
	addMetadata();
	reduceResults();
	renderLabelIcon();
	fixLabelResults();
	fixPageNavigation();
	fixNavigationResults();
	fixLabelForNavigation();
	fixLightbox();
	addFloatingActionButtons();
	// Open body if all fixes cleared
	document.body.style.display = 'block';
});
//constants
const isMediumWidth = function () {
	return window.innerWidth <= 1024;
}

function toggleActionsOnScroll() {
	// position of buttons on scroll
	let pageDown = document.body.scrollTop > 0.3 * document.documentElement.clientHeight || 
	document.documentElement.scrollTop > 0.3 * document.documentElement.clientHeight;
	// do not show too many as small screen space
	if (pageDown) toggleActions(['.fab.share', '.fab.top'], '.action-menu.bottom-right');
	else toggleActions(['.fab.share', '.fab.search'], '.action-menu.bottom-right');
	if(isMediumWidth()) toggleActions(['.fab.sidebar'], '.action-menu.bottom-left');
	else toggleActions([], '.action-menu.bottom-left');
	// works with header, when scroll down/up, hide/show buttons
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	let scrollDown = st > 0.3 * document.documentElement.clientHeight && diff <= 0.1;
	if(scrollDown || !pageDown) {
		document.querySelector('.action-menu.bottom-left')?.classList.remove('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.remove('hide');
	}
	else if(window.innerWidth <= 500) {
		document.querySelector('.action-menu.bottom-left')?.classList.add('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.add('hide');
	}
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

function windowOnResize() {
	// sidebar content on blogger must show on larger screens
	if (!isMediumWidth()) {
		if(document.getElementById('LinkList1') != null) document.getElementById('LinkList1').style.display = '';
		if(document.getElementById('BlogArchive1') != null) document.getElementById('BlogArchive1').style.display = '';	
		let outer = document.getElementsByClassName('column-left-outer')[0];
		if(outer != null)
			outer.style.position = '';
	}
	displayFAB();
	closePopups();
}

// Set initial scroll if current page url has hash
function scrollToSectionByUrl() {
	if(window.location.hash.length > 0)
		scrollToElement(document.getElementById(window.location.hash.substring(1)));
	if(window['scroll-top']) { // if popstate triggered, revert hashchange (works only if has selected anchor
		event.preventDefault();
		history.forward();
		window.scrollTo(0, window['scroll-top']);
		window['scroll-top'] = 0;
	}
}

function scrollToElement(elem) {
	// helper function to scroll to any element, assuming header is present
	if(elem != null) {
		let newPos = document.documentElement.scrollTop + (elem?.getBoundingClientRect().top || 0) - (document.querySelector('.page-header')?.getBoundingClientRect().height || 0) - 5;
		// console.log(window['pos'], newPos);
		// detect final position of section on render
		if(window['pos'] != parseInt(newPos))
			window['pos'] = parseInt(newPos);
		// check against scrollTop
		if(document.documentElement.scrollTop != newPos)
			document.documentElement.scrollTop = newPos;
	}
}

function windowOnHistoryChange() {
	// if viewer open, close and return
	if(document.querySelector('.viewer')?.classList.contains('open')) {
		event.preventDefault();
		window['scroll-top'] = window.scrollTop;
		closeViewer();
		scrollToSectionByUrl();
		return;
	}
	// if dialog open, close and return
	if(document.querySelector('.dialog') != null) {
		event.preventDefault();
		window['scroll-top'] = window.scrollTop;
		removeDialog();
		scrollToSectionByUrl();
		return;
	}
	// if popup open, close and return
	if(document.querySelector('.overlay') != null) {
		event.preventDefault();
		window['scroll-top'] = window.scrollTop;
		closePopups();
		scrollToSectionByUrl();
		return;
	}
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
	if ((imgWidth < 20 || imgHeight < 20) || p.id == 'news-thumbnail') {
		if(showLog) console.log('exclusion', p, p.parentElement);
		p.classList.add('img-unchanged');
		return;
	}	
	// if(showLog)	console.log('orientation: ' + (imgWidth >= imgHeight ? 'landscape' : 'portrait'));	
	// adjust dimensions
	if(p.parentElement && p.parentElement.parentElement) {
		let bodyWidth = document.querySelector('.post-body.entry-content')?.clientWidth;
		if(!bodyWidth) return;
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

// Floating action button events
function displayFAB() {
	// initial state assume all menus hidden
	if(document.querySelector('#Overlay') != null && document.querySelector('#Overlay').style.display != 'none')
		return;
	if(!navigator.share)
		document.querySelector('.fab.share')?.remove();
	document.querySelector('.action-menu.bottom-left')?.classList.add('show');
	document.querySelector('.action-menu.bottom-right')?.classList.add('show');
	toggleActions(['.fab.share', '.fab.search'], '.action-menu.bottom-right');
	if(isMediumWidth()) toggleActions(['.fab.sidebar'], '.action-menu.bottom-left');
	else toggleActions([], '.action-menu.bottom-left');
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
	let pageText = 'From Klassic Note Web Reports';
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
		fixExternalFrame(this);
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
				
				let mains = response.data[key].filter(d => d.role == 'Main');
				let selection = mains[0];
				// console.log(selection);
				let contentImg = document.createElement('img');
				contentImg.src = selection.anime.images.jpg.image_url;
				associatedDiv.appendChild(contentImg);
				
				let contentBlock = document.createElement('div');
				contentBlock.innerText = selection.anime.title;
				associatedDiv.appendChild(contentBlock);
				
				let contentHeader = document.createElement('div');
				contentHeader.innerText = 'Also Appears On';
				relatedDiv.appendChild(contentHeader);
				
				let related = mains.slice(1).sort(r => 2*Math.random()-1).slice(0,5);
				// console.log(related);
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

// Abbreviation to show as dialog if not using mouse to hover
function showAbbrAsDialog() {
	for(let abbr of document.querySelectorAll('abbr[title]')) {
		abbr.addEventListener('click', function() {
			event.preventDefault();
			popupText(event.target.title);
		});
	}
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

function addSearchBar() {
	// remove native search bar, add back on page header
	let search = document.createElement('div');
	search.id = 'CustomBlogSearch';
	search.innerHTML = '<div class="widget-content"><div id="_form"><form action="' + window.location.origin + '/search" class="gsc-search-box" target="_top"><div cellpadding="0" cellspacing="0" class="gsc-search-box"><div><div><span class="gsc-input"><input id="BlogSearch" autocomplete="off" class="gsc-input" name="q" size="10" title="search" type="text" value=""></span><span class="gsc-search-button" style="display: none;"><input class="gsc-search-button" name="max-results" title="search" type="submit" value="5"></span></div></div></div></form></div></div>';
	document.getElementById('CustomBlogSearch')?.remove();
	document.querySelector('.header-outer')?.appendChild(search);
}

function addMetadata() {
	// add metadata to allow responsive, not hardcoded in blogger theme
	let viewport = document.createElement('meta');
	viewport.setAttribute('name','viewport');
	viewport.setAttribute('content','width=device-width,initial-scale=1.0');
	document.head.appendChild(viewport);
}

function reduceResults() {
	// collapse search results from full post views
	// exceptions to ignore: single posts, previews, pages, linqpad
    if ((window.location.href.includes(window.location.origin + '/20') && window.location.href.includes('.html')) || 
		window.location.href.includes(window.location.origin + '/b/blog-preview') || 
		window.location.href.includes(window.location.origin + '/p/'))
		return;
	// remove header
	while (document.querySelector('.date-header') != null)
		document.querySelector('.date-header').remove();
	// remove feed
	while (document.querySelector('.blog-feeds') != null)
		document.querySelector('.blog-feeds').remove();
	// if not statement search page, show post thumbnails
	if(!window.location.href.includes('The%20Statement'))
	{
		let columnCenterInner = document.querySelector('.column-center-inner');
		columnCenterInner.classList.add('homepage-column-center-inner');
		// remove all post hashtag ids
		while (document.getElementById('hashtags') != null)
			document.getElementById('hashtags').remove();
		for (let post of document.querySelectorAll('.post'))
		{
			// definition and preprocessing
			// remove footers
			post.querySelector('.post-footer')?.remove();
			let title = post.querySelector('.post-title');
			let link = title?.querySelector('a');
			let snippet = post.querySelector('.post-body');
			// remove page styles
			while (snippet.querySelector('style') != null)
				snippet.querySelector('style').remove();
			//generate page thumbnails
			let latestPost = document.createElement('div');
			latestPost.classList.add('latest-post');
			let innerPostLink = document.createElement('a');
			innerPostLink.href = link?.href ?? '/search/label/The%20Statement?max-results=5';
			//generate page thumbnail image
			let latestPostThumb = document.createElement('div');			
			// find thumbnail image, if any
			let thumb = snippet.querySelector('.post-thumbnail');
			if (thumb != null)
				thumb = snippet.querySelector('.post-thumbnail').getAttribute('data-src');
			else if (snippet.querySelector('img') != null)
				thumb = snippet.querySelector('img').src;			
			if (thumb != null) {
				let homeThumb = document.createElement('img');
				homeThumb.classList.add('latest-post-thumb');
				homeThumb.src = thumb;
				latestPostThumb.appendChild(homeThumb);
			}
			// generate post title
			let latestPostTitle = document.createElement('h3');
			latestPostTitle.classList.add('post-title');
			latestPostTitle.classList.add(title != null ? 'latest-post-title' : 'latest-post-statement');
			latestPostTitle.innerText = title?.querySelector('a')?.innerText ?? snippet.querySelector('b').innerText;
			// generate post summary: first x characters with ellipse
			let latestPostSummary = document.createElement('div');
			latestPostSummary.classList.add('summary');
			let excerpt = snippet.innerText.trim();
			latestPostSummary.innerHTML = (title == undefined ? '' : excerpt.substring(0, excerpt.substring(280, 350).indexOf(' ') + 280).trim() + '...');
			// bringing it all together
			let outerWrapper = document.createElement('div');
			outerWrapper.classList.add('outer');
			if(link != undefined && thumb != undefined) outerWrapper.appendChild(latestPostThumb);
			let innerWrapper = document.createElement('div');
			innerWrapper.classList.add('inner');
			innerWrapper.appendChild(latestPostTitle);
			if(title != undefined) innerWrapper.appendChild(latestPostSummary);			
			outerWrapper.appendChild(innerWrapper);
			innerPostLink.appendChild(outerWrapper);
			// clear current post content and replace
			post.innerHTML = '';
			latestPost.appendChild(innerPostLink);
			post.appendChild(latestPost);
		}
	}
	else // for statement search pages, show all content and hide titles
	{
		// hide titles
		for (let content of document.querySelectorAll('.post-body.entry-content')) {
			if (content.parentElement.querySelector('h3') != null)
				content.remove(); // permanently hide
		}
		// change footer to horizontal rule
		for (let footer of document.querySelectorAll('.post-footer-line-2'))
			footer.innerHTML = '<hr>';
	}
}

// Convert text to icon for footer labels
function renderLabelIcon() {
	for(let label of document.querySelectorAll('#Label1 li a, .post-tags a'))
		label.innerHTML = '<span class="material-icons small-icons">' + labelTextToIcon(label.innerText) + '</span>' + label.innerText + '</a>';	
}

function labelTextToIcon(iconText) {
	switch (iconText)
	{
		case 'The Entertainment News':
			return 'newspaper';
			break;
		case 'The Klassic Note':
			return 'music_note';
			break;
		case 'The Dreams':
			return 'cloud';
			break;
		case 'The Everyday Life':
			return 'nightlife';
			break;
		case 'The Fanfiction':
			return 'category';
			break;
		case 'The Statement':
			return 'campaign';
			break;
		case 'The Welfare Package':
			return 'inventory_2';
			break;
		case 'The Review':
			return 'edit_note';
			break;
		default:
			break;
	}
}

function fixLabelResults() {
	// fix search results to return 5 results instead of 1
    for (let link of document.querySelectorAll('#Label1 a'))
		link.href = link.href += link.href.includes('?') ? '&max-results=5' : '?max-results=5';
}

function fixPageNavigation() {
	// convert text to icon for footer next previous posts
	if(document.querySelector('#blog-pager-newer-link a') != null)
		document.querySelector('#blog-pager-newer-link a').innerHTML = '<i class="material-icons latest-post" style="padding:0;">arrow_back</i>';
	if(document.querySelector('#blog-pager-older-link a') != null)
		document.querySelector('#blog-pager-older-link a').innerHTML = '<i class="material-icons latest-post" style="padding:0;">arrow_forward</i>';
	document.querySelector('.home-link')?.remove();	
}

function fixNavigationResults() {
	// fix number of pages to display on older and newer links
    if (document.querySelector('.blog-pager-older-link') != null) {
        let pagerLink = document.querySelector('.blog-pager-older-link').href;
        if (pagerLink.includes('&max-results=5') || pagerLink.includes('&max-results=20'))
            pagerLink = pagerLink.replace('&max-results=5', '&max-results=1');
        else
            pagerLink += '&max-results=1';

    }
    if (document.querySelector('.blog-pager-newer-link') != null) {
		let pagerLink = document.querySelector('.blog-pager-newer-link').href;
		if (pagerLink.includes('&max-results=5'))
			pagerLink = pagerLink.replace('&max-results=5', '&max-results=1');
		else
			pagerLink += '&max-results=1';
	}
}

function fixLabelForNavigation() {
	// add arrows for post labels when in smaller screens for navigation
	if(document.getElementById('Label1') == undefined) return;
	let labels = document.getElementById('Label1');
    labels.innerHTML = '<i class="material-icons bar-left" style="font-size: 48px;">arrow_left</i><i class="material-icons bar-right" style="font-size: 48px;">arrow_right</i>' + labels.innerHTML;
    labels.querySelector('.bar-right').addEventListener('click', function() {
		if(document.querySelector('#Label1 ul') != null)
			document.querySelector('#Label1 ul').scrollLeft += 100;
    });
    labels.querySelector('.bar-left').addEventListener('click', function() {
		if(document.querySelector('#Label1 ul') != null)
			document.querySelector('#Label1 ul').scrollLeft -= 100;
    });
}

function fixLightbox() {
	// fix lightbox gallery not covering screen on Chrome mobile, run only once per refresh
	document.getElementById('Blog1')?.addEventListener('click', cleanupLightbox);
}

function cleanupLightbox() {
    if (document.body.parentElement.className != 'v2') {
		// set lightbox container to 100% height width
        // let browseContainer = document.querySelector('.CSS_LIGHTBOX_PHOTO_BROWSE_CONTAINER');
        let attributeContainerHolder = document.querySelector('.CSS_LAYOUT_COMPONENT CSS_LIGHTBOX_ATTRIBUTION_INDEX_CONTAINER').firstChild;
		if(attributeContainerHolder != null) {
			attributeContainerHolder.firstChild.remove();
			attributeContainerHolder.firstChild.style.width = '100%';
			attributeContainerHolder.style.width = '100%';
		}
		// set bottom image selection to 120% height, will overflow but don't matter as container cannot scroll
		let lightboxMask = document.querySelector('.CSS_LIGHTBOX_BG_MASK_TRANSPARENT');
		if(lightboxMask != null)
			lightboxMask.style.height = '120%';
		document.getElementById('Blog1')?.removeEventListener('click', cleanupLightbox);
    }
}

function addFloatingActionButtons() {
	// manual add menus and buttons to avoid writing in blogger theme
	let [bottomLeftMenu, bottomRightMenu] = addMenus();
	if(navigator.share) addButton(['fab', 'share'], 'Share This Page', 'share', sharePage, bottomRightMenu);
	addButton(['fab', 'search'], 'Search This Blog', 'search', toggleSearch, bottomRightMenu);
	addButton(['fab', 'top'], 'Go To Top', 'arrow_upward', goToTop, bottomRightMenu);
	addButton(['fab', 'sidebar'], 'Toggle Menu', 'menu', toggleSidebar, bottomLeftMenu);
	addButton(['fab', 'close', 'hidden'], 'Close Menu', 'menu_open', toggleSidebar, document.querySelector('.column-left-inner'));
}

function addMenus() {
	// helper function to create menus
	let menuLeft = document.createElement('div');
	menuLeft.classList.add('action-menu');
	menuLeft.classList.add('bottom-left');
	document.body.appendChild(menuLeft);
	
	let menuRight = document.createElement('div');
	menuRight.classList.add('action-menu');
	menuRight.classList.add('bottom-right');
	document.body.appendChild(menuRight);
	
	return [menuLeft, menuRight];
}

function addButton(classes, title, googleIconName, clickEvent, parentElement) {
	// helper function to create buttons in menu
	let fabButton = document.createElement('a');
	if(Array.isArray(classes)) fabButton.className = classes.join(' ');
	else fabButton.className = classes;
	fabButton.classList.add('material-icons');
	fabButton.title = title;
	fabButton.innerText = googleIconName;
	if(clickEvent) fabButton.onclick = clickEvent;
	if(parentElement) parentElement.appendChild(fabButton);
	else document.body.appendChild(fabButton);
}

function toggleSearch() {
    goToTop();
	// button to toggle search bar
	let customBlogSearch = document.getElementById('CustomBlogSearch');
	let blogSearch = document.getElementById('BlogSearch');
	if(customBlogSearch == null) return;
    let barDisp = customBlogSearch.style.display;
    if (barDisp == 'none' || barDisp == '') {
        customBlogSearch.style.display = 'block';
		blogSearch.focus();
	} else {
        customBlogSearch.style.display = 'none';
		blogSearch.innerText = '';
		blogSearch.blur();
	}
}

function toggleSidebar() {
	// button to toggle left sidebar as hidden in mobile widths
	// define screen widths for sidebar modules
	let collapseSidebarWidth = window.innerWidth < 780;
	let collapseSidebarLinks = window.innerHeight <= 640;
	let collapseSidebarArchive = window.innerHeight <= 960;	
	// toggle body overlay
    if(document.querySelector('.overlay') != null)
		hideOverlay();
	else
		showOverlay();	
	// fix location of left sidebar
	toggleDisplay(document.querySelector('.column-left-outer'), 'fixed');
	// toggle menu open/close icons
	let menuStatus = document.querySelector('.fab.sidebar');
	menuStatus.innerText = menuStatus.innerText == 'menu' ? 'menu_open' : 'menu';
	// icons in mobile widths offset from edge of screen
    let iconLeft = collapseSidebarWidth ? '0' : '5px';
    outer.style.left = outer.style.left == '' ? iconLeft : '';
    outer.style.bottom = outer.style.bottom == '' ? '4px' : '';
    outer.style.margin = outer.style.margin == '' ? 'auto' : '';
    outer.style.zIndex = outer.style.zIndex != 9 ? 9 : '';
	// toggle desktop left sidebar on mobile widths
    toggleDisplay(outer.querySelector('aside'), 'block');
	// hide close button if popup exist
	document.querySelector('.fab.close')?.classList.toggle('hidden');
    if (collapseSidebarLinks)
		toggleDisplay(document.getElementById('LinkList1'), 'none');
    if (collapseSidebarArchive)
		toggleDisplay(document.getElementById('BlogArchive1'), 'none');
}

function toggleDisplay(element, defaultValue) {
	element.style.display = element.style.display == '' ? defaultValue : '';
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

function fixExternalFrame(thumbnail) {
	//fix iframes in thumbnails that don't fit content width
	if(thumbnail.getElementsByTagName('iframe').length > 0) {
		let thumbnailTable = thumbnail.closest('table');
		if (thumbnailTable != null && thumbnailTable != thumbnail)
			thumbnailTable.style.width = '100%';
	}
}
