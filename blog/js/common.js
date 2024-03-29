//constants
const isBlogger = function() {
	return window.location.href.includes('.blogspot.com'); //if false, is blogger
};
const isSmallWidth = function() {
	return window.innerWidth <= 500;
}
const isMediumWidth = function () {
	return window.innerWidth <= 1024;
}

// Single onLoad event control: put all functions in sequence
window.addEventListener('load', startup);

function startup() {
	// Synchronous Functions
	if(typeof preloadSequence == 'function') preloadSequence();
	if(typeof toggleEmojiDisplay == 'function') toggleEmojiDisplay();
	if(typeof generateViewer == 'function') setTimeout(generateViewer, 0);
	// if(typeof addSwipeEvents == 'function') setTimeout(addSwipeEvents, 0);

	// Window events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	
	// Asynchronous Events
	setTimeout(addHashtags, 0); // generateHeader, generateReadTime
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(setExpander, 0);
	setTimeout(displayFAB, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(resizeImages, 0);
	setTimeout(olderNewerTextToIcon, 0);
	setTimeout(scrollToSectionByUrl, 200);
}

//==FUNCTIONS==//
// Convert text to icon for footer next previous posts and labels
function olderNewerTextToIcon() {
    if (document.getElementById("blog-pager-newer-link") != null)
		document.getElementById("blog-pager-newer-link").getElementsByTagName("a")[0].innerHTML = 
		"<i class='material-icons latest-post' style='padding:0;'>arrow_back</i>";
    if (document.getElementById("blog-pager-older-link") != null)
		document.getElementById("blog-pager-older-link").getElementsByTagName("a")[0].innerHTML = 
		"<i class='material-icons latest-post' style='padding:0;'>arrow_forward</i>";
	if (document.getElementsByClassName('home-link').length > 0) {
		document.getElementsByClassName('home-link')[0].classList.add('display-none');
	}
	
	for(let label of document.querySelectorAll('#Label1 li a, .post-tags a'))
	{
		label.innerHTML = '<span class="material-icons small-icons">' + labelTextToIcon(label.innerText) + '</span>' + label.innerText + '</a>';
	}
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


// Add hashtags for Entertainment News posts with anchors
function addHashtags() {
	// empty hashtags if any content
	let tags = document.querySelector(".hashtags") || document.querySelector("#hashtags");
	if(tags != null)
	{
		tags.innerHTML = '';
		
		//ignore old id and if is search result
		if(window.location.href.includes("/search/")) {
			for(let element of document.querySelectorAll("[id='hashtags']")) {
				element.style.display = 'none';
			}
			return;
		}
		
		// recreate hashtags
		var hashtags = [];		
		// add anything with anchor
		let sections = document.querySelectorAll(".post-body [id]:not(#hashtags):not(#news-thumbnail):not(.twitter-tweet iframe[id]):not(#table):not(#music):not(.list):not(audio):not(video):not(object)");
		if(sections.length > 0)
		{
			for(let section of sections) {
				if(section.id.length > 1 && section.id.length <= 64)
					hashtags.push({
						tag: section.id, 
						target: section.id
					});
				else {
					console.error('hashtag length too long: ' + section.id);
					return;
				}
			}
		}
		// special case: klassic note
		for(let span of document.querySelectorAll(".post-body span")) {
			if(span.innerText == "This Week on Klassic Note") {
				//set id on class
				span.id = "KlassicNote";
				hashtags.push({
					tag: "ThisWeekOnKlassicNote", 
					target: span.id
				});
				break;
			}
		}
		
		// render
		if(hashtags.length > 0) {
			for(let item of hashtags)
			{
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

function scrollToSectionByUrl() {
	if(window.location.hash.length > 0)
	{
		scrollToElement(document.getElementById(window.location.hash.substring(1)));
		// setTimeout(scrollToSectionByUrl, 500);
	}
}

function scrollToElement(elem) {
	if(elem != null)
	{
		let newPos = document.documentElement.scrollTop + (elem?.getBoundingClientRect().top || 0) - (document.querySelector('.page-header')?.getBoundingClientRect().height || 0) - 5;
		// console.log(window['pos'], newPos);
		if(window['pos'] != parseInt(newPos)) // detect final position of section on render
			window['pos'] = parseInt(newPos);
		if(document.documentElement.scrollTop != newPos) // then, check against scrollTop
			document.documentElement.scrollTop = newPos;
		if(typeof toggleHeader === 'function') // for github page
			toggleHeader(true);
	}
}

// Abbreviation to show as dialog if not using mouse to hover
// Exception for published field in github site
function showAbbrAsDialog() {
	for(let abbr of document.querySelectorAll('.published, abbr[title]'))
	{
		abbr.addEventListener('click', function() {
			event.preventDefault();
			popupText(event.target.title);
		});
	}
}

// Fineprint component, click to toggle show full text or condensed
function focusOnExpandFineprint() {
	for(let fp of document.querySelectorAll('.fineprint'))
	{
		fp.addEventListener('click', function() {
			fp.classList.toggle('show');
			fp.scrollIntoView({ block: 'center' });
		});
	}
}

// Accordion component, click to toggle show extra text or just header
function setExpander() {
	for(let accordion of document.querySelectorAll('.accordion'))
	{
		accordion.querySelector('.header')?.addEventListener('click', toggleExpander);
		accordion.querySelector('.footer')?.addEventListener('click', toggleExpander);
	}
}
function toggleExpander() {
	let parent = event.target.closest('.accordion');
	parent.classList.toggle('show');
	parent.querySelector('.header').scrollIntoView({ block: 'center' });
}

////DIALOG////
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null)
	{
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
	// node in dialog will not have events!
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object')
	{
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
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv != null)
	{
		dialogDiv.remove();
	}	
}

// Popup element, based on content type
function addHoverForLinks() {
	if(document.querySelector('.post-body.entry-content') == null) return;
    for (let link of document.querySelector('.post-body.entry-content').querySelectorAll('a')) {
		if(link.target)
			link.addEventListener('mouseover', renderPopup);
    }
}

function addHoverForPopups() {
    for (let popup of document.querySelectorAll('.post-body.entry-content .new-t')) {
		popup.querySelector('.new-thumbnail-initial').href = popup.getAttribute('data-url');
		popup.addEventListener('contextmenu', togglePopup);
		let dataUrl = popup.getAttribute('data-url').toLowerCase();
		if(dataUrl.includes('.jpg') || dataUrl.includes('.png') || dataUrl.includes('.gif') || dataUrl.includes('blogger.googleusercontent.com'))
			popup.addEventListener('click', togglePopup);
		else
			popup.querySelector('.new-thumbnail-focus').addEventListener('click', closePopups);
    }
}

function togglePopup() {
	event.preventDefault();
	if(document.querySelector('#PopupBtn') != null && document.querySelector('#PopupBtn').innerText == 'launch')
	{
		window.open(this.getAttribute('data-url'), '_blank');
	}
    else if (this.classList.contains('new-thumbnail')) {
		//hide
        this.classList.remove('new-thumbnail');
		// switchToButton('GoToTopBtn');
		if(document.getElementById('CloseBtn') != null) document.getElementById('CloseBtn').style.display = 'none';
		toggleOverlay(false);
	}
    else {
		//display
        for (let page of document.getElementsByClassName('post-body entry-content')) {
            for (let popup of page.getElementsByClassName('new-thumbnail')) {
                popup.classList.remove('new-thumbnail');
            }
        }
        this.classList.add('new-thumbnail');
		// switchToButton('CloseBtn');
		toggleOverlay(false);
		if(typeof fixExternalFrame == 'function') fixExternalFrame(this);
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
	if(document.getElementById('Overlay')?.style.display != 'none' && 
		document.querySelector('.fab.close') != null && !document.querySelector('.fab.close').classList.contains('hidden'))
		return; // prevent kill if from sidebar
	// kill youtube videos playing
	for(let video of document.querySelectorAll('.yt-video'))
	{
		video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
	}
	
	for (let page of document.getElementsByClassName('post-body entry-content')) {
		for (let popup of page.getElementsByClassName('new-thumbnail')) {
			popup.classList.remove('new-thumbnail');
		}
	}
	if(document.getElementById('CloseBtn') != null)
		document.getElementById('CloseBtn').style.display = 'none';
	
	displayFAB();
	
	//remove overlay if
	if(document.getElementById('SidebarBtn') != null && document.getElementById('Overlay') != null && 
	document.getElementById('Overlay').style.backgroundColor == 'black')
		document.getElementById('SidebarBtn').click(); //from sidebar
	else {
		toggleOverlay(false);
		displayFAB();
	}
}

function renderPopup() {
    event.preventDefault();
	let processLink = this.href;
	
	//exclusion for blogger	images
    if ((processLink.includes('blogspot.com') || processLink.includes('blogger.googleusercontent.com')) && this.target == '') return;
	//exclusion for if target is not _blank
    if (this.target == '') return;
	//exclusion class, if any
    if (this.classList.contains('opt-out')) return;
	//if not compatible for any design
    let newContent = generatePopupContent(processLink);
    if (newContent == null) return;
    let thumbnail = document.createElement('div');
    thumbnail.classList.add('new-t');

    let initial = document.createElement('a');
    initial.classList.add('new-thumbnail-initial');
    initial.innerHTML = this.innerHTML;

    let focus = document.createElement('div');
    focus.classList.add('new-thumbnail-focus');
    focus.classList.add('fadeIn');
	if(!processLink.includes('twitter.com') && !processLink.includes('/status/'))
		focus.style.paddingTop = '10px';
    focus.innerHTML = newContent;
	focus.addEventListener('click', closePopups);

    thumbnail.appendChild(initial);
    thumbnail.appendChild(focus);
	thumbnail.setAttribute('data-url', processLink);
	
	renderEmbedProcess();

    this.outerHTML = thumbnail.outerHTML;
    addHoverForPopups();

	//FAB to close
	let closeButton = document.createElement('a');
	closeButton.id = 'CloseBtn';
	closeButton.classList.add('material-icons');
	closeButton.title = 'Close Popup';
	closeButton.innerText = 'close';
	closeButton.addEventListener('click', closePopups);
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	document.body.appendChild(closeButton);
	
	return thumbnail;
}

function renderEmbedProcess() {
	try
	{
		if(document.querySelector('#tweet') == null)
		{
			let tweet = document.createElement('script');
			tweet.id = 'tweet';
			tweet.src = 'https://platform.twitter.com/widgets.js';
			tweet.type = 'text/javascript';
			tweet.charset = 'utf-8';
			tweet.async = 'async';
			document.head.appendChild(tweet);
		}
		
		if(document.querySelector('#insta') == null)
		{
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
		return true;
	}
	catch(err)
	{
		console.error(err);
		return false;
	}
}

function generatePopupContent(url) {
	if (!url) return null;
	let testUrl = url.toLowerCase();
    if (testUrl.includes('.jpg') || testUrl.includes('.png') || testUrl.includes('.gif') || testUrl.includes('blogger.googleusercontent.com')) {
        //process image
        return '<div class="separator"><img style="max-height: 360px; max-width: 100%;" src="' + url + '" /></div>';
    }
    if (testUrl.includes('music.apple.com')) {
        //process itunes embed
		let isTrack = testUrl.includes('i=');
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ (!isTrack ? 450 : 170) +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: ' + (isSmallWidth() && !isTrack ? 290 : 660) + 'px; overflow: hidden; width: 100%;"></iframe>';
    }
    if (testUrl.includes('twitter.com') || testUrl.includes('x.com')) {
        //process twitter embed
		//data-height for timeline is max width
		if(testUrl.includes('/status/')) {
			return '<div style="display: flex;"><blockquote class="twitter-tweet tw-align-center" data-conversation="none" ' + (isBlogger() || document.querySelector('html').classList.contains('darked') ? 'data-theme="dark"' : '') + ' data-height="' + 0.6*window.innerHeight + '"><a href="' +
				url.replace('x.com', 'twitter.com') +
				'"></a></blockquote><script async="async" charset="utf-8" src="https://platform.twitter.com/widgets.js"></script></div>';
		}
    }
    if (testUrl.includes('youtube.com/watch')) {
        //process youtube embed
        let id = url.substring(url.indexOf('?v=') + 3);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '?enablejsapi=1"></iframe>';
    }
    if (testUrl.includes('youtu.be/')) {
        //process youtube embed
        let id = url.substring(url.indexOf('youtu.be/') + 9);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '?enablejsapi=1"></iframe>';
    }
    if (testUrl.includes('instagram.com/p/') || testUrl.includes('instagram.com/reel/')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" style="' + (!isSmallWidth() ? 'width:550px;' : '') + '" data-instgrm-permalink="' +
            url + '" data-instgrm-version="14" style="padding:0;"></blockquote></center><script async="async" src="//www.instagram.com/embed.js"></script>';
    }
    if (testUrl.includes('jisho.org/search/')) {
        //process page as iframe
        return '<iframe id="jisho-frame" src="' +
            url + '" style="height:min(50vh,450px);width:min(98%,760px);"></iframe>';
    }
    return null;
}

function toggleOverlay(fromSidebar) {
	let body = document.body;
	let overlay = document.querySelector('.overlay');
	// if no overlay
    if (overlay == undefined) {
		overlay = document.createElement('div');
		overlay.className = 'overlay hide';
		overlay.addEventListener('click', closePopups);
		overlay.addEventListener('contextmenu', function() {
			event.preventDefault();
		});
		body.appendChild(overlay);
	}
	
	// set overlay
	overlay.classList.toggle('hide');
	// overlay.style.backgroundColor = fromSidebar ? 'black' : '';
	// overlay.style.zIndex = fromSidebar ? '8' : '';
	
	// change buttons
	document.querySelector('.action-menu.bottom-left')?.classList.toggle('hide');
	document.querySelector('.action-menu.bottom-right')?.classList.toggle('hide');
}

function toggleDisplay(element, defaultValue) {
	return element.style.display == '' ? defaultValue : '';
}

// Floating action button events
function displayFAB() {
	// for initial state
	if(document.querySelector('#Overlay') != null && document.querySelector('#Overlay').style.display != 'none')
		return;
	if(!navigator.share) {
		document.querySelector('.fab.share')?.remove();
	}
	if(isBlogger()) {
		toggleActions(['.fab.share', '.fab.search'], '.action-menu.bottom-right');
		if(isMediumWidth()) toggleActions(['.fab.sidebar'], '.action-menu.bottom-left');
		else toggleActions([], '.action-menu.bottom-left');
	}
}

function toggleActionsOnScroll() {
	// position of buttons on scroll
	let pageDown = document.body.scrollTop > 0.3 * document.documentElement.clientHeight || 
	document.documentElement.scrollTop > 0.3 * document.documentElement.clientHeight;
	if(!isBlogger()) {
		if (pageDown) {
			toggleActions(['.fab.share', '.fab.search', '.fab.top'], '.action-menu.bottom-right');
		}
		else {
			toggleActions(['.fab.share', '.fab.search', '.fab.theme'], '.action-menu.bottom-right');
		}
	}
	else {
		if (pageDown) {
			toggleActions(['.fab.share', '.fab.top'], '.action-menu.bottom-right');
		}
		else {
			toggleActions(['.fab.share', '.fab.search'], '.action-menu.bottom-right');
		}
		if(isMediumWidth()) toggleActions(['.fab.sidebar'], '.action-menu.bottom-left');
		else toggleActions([], '.action-menu.bottom-left');
	}
	
	// works with header, when scroll down/up, hide/show buttons
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	let scrollDown = st > 0.3 * document.documentElement.clientHeight && diff <= 0.1;
	if(scrollDown || !pageDown) {
		document.querySelector('.action-menu.bottom-left')?.classList.remove('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.remove('hide');
	}
	else if(isSmallWidth()) {
		document.querySelector('.action-menu.bottom-left')?.classList.add('hide');
		document.querySelector('.action-menu.bottom-right')?.classList.add('hide');
	}
}

function toggleActions(showElements, parentElement) {
	if(!showElements || !parentElement) return;
	if(typeof(parentElement) == 'string') parentElement = document.querySelector(parentElement);
	
	// hide all in parent element: assume has fab class children
	for(let fab of parentElement.querySelectorAll('.fab'))
	{
		fab.classList.add('hidden');
	}
	
	// show button(s) specified
	if(Array.isArray(showElements)) {
		for(let elem of showElements)
		{
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

function hideImagesOnError() {
	for(let image of document.getElementsByTagName('img')) {
		image.style.display = image.complete ? '' : 'none';
		image.addEventListener('error', function() {
			image.parentElement.parentElement.style.display = 'none';
			image.classList.add('failed');
		});
		image.src = 'https://knneo.github.io/resources/spacer.gif';
	}
}

function windowOnResize() {
	if (!isMediumWidth()) {
		if(document.getElementById('LinkList1') != null) document.getElementById('LinkList1').style.display = '';
		if(document.getElementById('BlogArchive1') != null) document.getElementById('BlogArchive1').style.display = '';	
		let outer = document.getElementsByClassName('column-left-outer')[0];
		if(outer != null)
			outer.style.position = '';
	}
	if(document.getElementById('Overlay') != null && document.getElementById('Overlay').style.display != 'none')
		closePopups();
	
	displayFAB();
	resizeImages();
};

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
	if(thumbImagesWithLinks.length > 0)
	{
		console.error("Thumbnail has image with link: Will prevent switchThumbnails assignment");
		console.log(thumbImagesWithLinks);
		return;
	}
	// check thumbnail class names logic violation
	let thumbInitials = Array.from(document.querySelectorAll('.thumbnail')).filter(i => i.querySelectorAll('.thumbnail-initial:not(.thumbnail-pop)').length != 1);
	if(thumbInitials.length > 0) // no of thumbnails with initial class not exactly 1
	{
		console.error("Thumbnail classList definition error: Will prevent switchThumbnails assignment");
		console.log(thumbInitials);
		return;
	}
	
    for (let thumbnail of document.querySelectorAll('.thumbnail')) {
	    // ignore new borders if span width
	    // if(Array.from(thumbnail.querySelectorAll('tr')).filter(tr => tr.querySelectorAll('td').length > 1).length > 0)
		    // thumbnail.classList.add('ignore');
		// set height for first thumbnail content
		thumbnail.style.height = thumbnail.querySelector('.thumbnail-initial:not(.thumbnail-pop)').offsetHeight + 'px';
		// add click event for first thumbnail content
        let allThumbImages = thumbnail.querySelectorAll('img');
		// show if loaded first content
		if(allThumbImages.length > 0 && allThumbImages[0].complete) {
			thumbnail.classList.add('show');
		}
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
		// if text only (experimental)
		if(allThumbImages.length < 1 &&
		thumbnail.querySelectorAll('.thumbnail-initial').length > 0 &&
		thumbnail.querySelectorAll('.thumbnail-pop').length > 0)
		{
			thumbnail.style.display = 'inline';
			
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

function switchThumbnails(tn, index) {
    let tc = tn.getElementsByClassName('thumbnail-initial');
	// identify current active
	let active = Array.from(tc).findIndex(t => !t.classList.contains('thumbnail-pop'));
	if(active == null) return;
	// to reset before setting new active
	for(let t of tc) {
		if(!t.classList.contains('thumbnail-pop'))
			t.classList.add('thumbnail-pop');
	}
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
			tn.style.height = nextActive.offsetHeight + 'px';
	}, tn.classList.contains('fastscroll') && !isSmallWidth() ? 0 : 200);
}

function showAllThumbnails(tn) {
	if(typeof openImagesInViewer == 'function' && document.querySelector('.viewer') != null)
		openImagesInViewer(tn.querySelectorAll('.thumbnail-initial'));
}

// Responsive image resizing based on screen dimensions
function resizeImages() {
    //current issues
    /*
    ~Exclusion list for class lists to avoid on parent element eg. when parent element in post div
    ~Consider writing in whitelist case then with blacklist case
    ~Images that always resize to 100% instead of retaining original size which can fit screen, consider putting back original size if no overflow
    ~Consluion: Consider redo whole list based on stricter requirements, and clearer ranges/lists to maintain exclusions
    */
    for (var p of document.querySelectorAll("img"))
	{
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
	if ((isBlogger() && (imgWidth < 20 || imgHeight < 20)) || 
		p.id == 'news-thumbnail')
	{
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
			let max = Math.max(...Array.from(table.querySelectorAll('tr')).map(tr => tr.querySelectorAll('img').length > 1 ? Array.from(tr.querySelectorAll('img')).reduce((imgs, img) => imgs + img.width, 0) : 0)); // with more than 1 column of images
			if(!table.style.width && !table.style.maxWidth && max) {
				table.style.width = '100%';
				table.style.maxWidth = max + 'px';
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
		}
		else if (p.width + 20 >= bodyWidth)
			p.classList.add('img-width-fit');
		else
			p.classList.add('img-width-auto');
			
		// special case: to avoid resize issue on reload
		if(p.classList && p.classList.contains('img-width-fit') && p.classList.contains('img-width-auto'))
			p.classList.remove('img-width-auto');
	
		// special case: separator class
		if (p.parentElement.className == 'separator' ||
			p.parentElement.parentElement.className == 'separator') {
			p.parentElement.classList.add('img-separator');
			if(showLog) console.log('separator', p.style.marginLeft, p.style.marginRight);
		}
		if(p.parentElement.tagName == 'A' &&
		p.parentElement.marginLeft != '' &&
		p.parentElement.marginRight != '')
		{
			p.parentElement.style.marginLeft = null;
			p.parentElement.style.marginRight = null;
			p.parentElement.classList.add('img-separator');
		}
	}

	// set thumbnails again after adjusted
    setThumbnails();
}