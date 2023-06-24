//constants
const notBlogger = function() {
	return window.location.href.includes('knneo.github.io'); //if false, is blogger
};
const isSmallWidth = function() {
	return window.innerWidth <= 500;
}

// Single onLoad event control: put all functions in sequence
window.addEventListener('load', startup);

function startup() {
	// To be run async unless otherwise, dependents in with parent functions
	addHashtags();
	resizeImages();
	if(typeof preloadSequence == 'function') preloadSequence();
	if(typeof addFloatingActionButtons == 'function') addFloatingActionButtons();
	if(typeof generateViewer == 'function') generateViewer();
	if(typeof generateHeader == 'function') generateHeader();
	if(typeof generateReadTime == 'function') generateReadTime();
	if(typeof toggleEmojiDisplay == 'function') toggleEmojiDisplay();

	// Window events
	window.addEventListener('scroll', displayFAB);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('resize', resizeImages);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	setTimeout(displayFAB, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(resizeImages, 500);
	setTimeout(scrollToSectionByUrl, 500);
}

//==FUNCTIONS==//

// Add hashtags for Entertainment News posts with anchors
function addHashtags() {
	// empty hashtags if any content
	let hashTag = document.getElementById("hashtags");
	if(hashTag == null) return;
	hashTag.innerHTML = '';
	
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
	if(hashtags.length == 0) return;
	for(let item of hashtags)
	{
		let newItem = document.createElement('a');
		newItem.title = item.target;
		newItem.innerText = '#' + item.tag;
		newItem.href = 'javascript:void(0);';
		newItem.addEventListener('click', function() {
			window.location.hash = this.title;
		});
		hashTag.appendChild(newItem);
	}
}

function scrollToSectionByUrl() {
	if(window.location.hash.length > 0)
	{
		let newPos = document.documentElement.scrollTop + (document.querySelector(window.location.hash)?.getBoundingClientRect().top || 0) - (document.querySelector('.header')?.getBoundingClientRect().height || 0) - 5;
		document.documentElement.scrollTop = newPos;
	}
}

// Popup element, based on content type
function addHoverForLinks() {
	if(document.getElementsByClassName('post-body entry-content').length == 0) return;
    for (let link of document.getElementsByClassName('post-body entry-content')[0].getElementsByTagName('a')) {
		if(link.target != '')
			link.addEventListener('mouseover', renderPopup);
    }
}

function addHoverForPopups() {
    for (let page of document.getElementsByClassName('post-body entry-content')) {
        for (let popup of page.getElementsByClassName('new-t')) {
            popup.addEventListener('click', togglePopup);
        }
    }
}

function togglePopup() {
    if (this.classList.contains('new-thumbnail')) {
		//hide
        this.classList.remove('new-thumbnail');
		switchToButton('GoToTopBtn');
		if(document.getElementById('CloseBtn') != null) document.getElementById('CloseBtn').style.display = 'none';
	}
    else {
		//display
        for (let page of document.getElementsByClassName('post-body entry-content')) {
            for (let popup of page.getElementsByClassName('new-thumbnail')) {
                popup.classList.remove('new-thumbnail');
            }
        }
        this.classList.add('new-thumbnail');
		switchToButton('CloseBtn');
		if(typeof fixExternalFrame == 'function') fixExternalFrame(this);
		renderEmbedProcess();
		// if below threshold height scroll up, else open popup without scroll
		let thresholdHeight = 0.4*window.innerHeight;
		window.scrollTo({
			top: document.querySelector('html').scrollTop + this.getBoundingClientRect().top - (this.getBoundingClientRect().top >= thresholdHeight ? thresholdHeight : this.getBoundingClientRect().top), 
			behavior: 'smooth'
		});
    }
	
	toggleOverlay(false);
}

function closePopups() {
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
	
	//exclusion for blogger	images
    if ((this.href.includes('blogspot.com') || this.href.includes('blogger.googleusercontent.com')) && this.target == '') return;
	//exclusion for if target is not _blank
    if (this.target == '') return;
	//exclusion class, if any
    if (this.classList.contains('opt-out')) return;
	//if not compatible for any design
    let newContent = generatePopupContent(this.href);
    if (newContent == null) return;
    let thumbnail = document.createElement('div');
    thumbnail.classList.add('new-t');

    let initial = document.createElement('div');
    initial.classList.add('new-thumbnail-initial');
    initial.innerHTML = this.innerHTML;

    let focus = document.createElement('div');
    focus.classList.add('new-thumbnail-focus');
    focus.classList.add('fadeIn');
	if(!this.href.includes('twitter.com') && !this.href.includes('/status/'))
		focus.style.paddingTop = '10px';
    focus.innerHTML = newContent;

    thumbnail.appendChild(initial);
    thumbnail.appendChild(focus);
	
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
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('blogger.googleusercontent.com')) {
        //process image
        return '<div class="separator"><img style="max-height: 360px; max-width: 100%;" src="' + url + '" /></div>';
    }
    if (url.includes('music.apple.com')) {
        //process itunes embed
		let isTrack = url.includes('i=');
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ (!isTrack ? 450 : 170) +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: ' + (isSmallWidth() && !isTrack ? 290 : 660) + 'px; overflow: hidden; width: 100%;"></iframe>';
    }
    if (url.includes('twitter.com')) {
        //process twitter embed
		//data-height for timeline is max width
		if(url.includes('/status/')) {
			return '<blockquote class="twitter-tweet tw-align-center" data-conversation="none" data-height="' + 0.6*window.innerHeight + '"><a href="' +
				url +
				'"></a></blockquote><script async="async" charset="utf-8" src="https://platform.twitter.com/widgets.js"></script>';
		}
    }
    if (url.includes('youtube.com/watch')) {
        //process youtube embed
        let id = url.substring(url.indexOf('?v=') + 3);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '?enablejsapi=1"></iframe>';
    }
    if (url.includes('youtu.be/')) {
        //process youtube embed
        let id = url.substring(url.indexOf('youtu.be/') + 9);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '?enablejsapi=1"></iframe>';
    }
    if (url.includes('instagram.com/p/')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" style="' + (window.innerWidth >= 576 ? 'width:550px;' : '') + '" data-instgrm-permalink="' +
            url + '" data-instgrm-version="14" style="padding:0;"></blockquote></center><script async="async" src="//www.instagram.com/embed.js"></script>';
    }
    if (url.includes('jisho.org/search/')) {
        //process page as iframe
        return '<iframe id="jisho-frame" src="' +
            url + '" style="height:min(50vh,450px);width:min(98%,760px);"></iframe>';
    }
    return null;
}

function toggleOverlay(fromSidebar) {
	let body = document.body;
	let overlay = document.getElementById('Overlay');
	// if no overlay
    if (overlay == undefined) {
		overlay = document.createElement('div');
		overlay.id = 'Overlay';
		overlay.style.display = 'none';
		overlay.style.cursor = 'pointer';
		overlay.addEventListener('click', closePopups);
		body.appendChild(overlay);
	}
	
	// set overlay
	overlay.style.display = toggleDisplay(overlay, 'none');
	overlay.style.backgroundColor = fromSidebar ? 'black' : '';
	overlay.style.zIndex = fromSidebar ? '8' : '';
	
	// change buttons by force
	if(document.getElementById('BackBtn') != null) {
		document.getElementById('BackBtn').style.display = toggleDisplay(document.getElementById('BackBtn'), 'none');
		if(document.getElementById('RightBtn') != null)
			document.getElementById('RightBtn').style.display = toggleDisplay(document.getElementById('RightBtn'), 'none');
	}
}

function toggleDisplay(element, defaultValue) {
	return element.style.display == '' ? defaultValue : '';
}

// Floating action button events
function displayFAB() {
	if(document.querySelector('#Overlay') != null && document.querySelector('#Overlay').style.display != 'none')
		return;
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.body.scrollTop > document.documentElement.clientHeight || 
		document.documentElement.scrollTop > document.documentElement.clientHeight) {
		switchToButton('GoToTopBtn');
	} else {
		if(window.location.href.includes("knneo.github.io")) switchToButton('DarkModeBtn');
		else switchToButton('SearchBtn');
	}
}

function switchToButton(id) {
	if(id == '') return;
	
	// to hide
	let buttons = ['GoToTopBtn','SearchBtn','DarkModeBtn','EmojiBtn'];
	for(let button of buttons)
	{
		if(document.getElementById(button) != null) document.getElementById(button).style.display = 'none';
	}
	
	// to show
	if(document.getElementById(id) != null) // destination id by default
		document.getElementById(id).style.display = 'block';
	else if (window.location.href.includes("knwebreports.blogspot"))
		document.getElementById('SearchBtn').style.display = 'block';
	if (['GoToTopBtn','SearchBtn','DarkModeBtn'].includes(id) && document.getElementById('EmojiBtn') != null)
		document.getElementById('EmojiBtn').style.display = 'block';
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
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
	if (window.innerWidth >= 1025) {
		if(document.getElementById('LinkList1') != null) document.getElementById('LinkList1').style.display = '';
		if(document.getElementById('BlogArchive1') != null) document.getElementById('BlogArchive1').style.display = '';	
		let outer = document.getElementsByClassName('column-left-outer')[0];
		if(outer != null)
			outer.style.position = '';
	}
	document.body.style.visibility = window.innerWidth <= 320 ? 'hidden' : '';
	
	if(document.getElementById('Overlay') != null && document.getElementById('Overlay').style.display != 'none')
		closePopups();
	
	resizeImages();
};

// Multi-image thumbnail: Define max caption height, onclick event
function setThumbnails() {
	// check if thumbnail violate features
	if(Array.from(document.querySelectorAll('.thumbnail img')).filter(i => i.parentElement.tagName.toLowerCase() === 'a').length > 0)
	{
		console.error("Thumbnail has image with link: Will prevent switchThumbnails from image click");
		return;
	}
	
    for (let thumbnail of document.querySelectorAll(".thumbnail")) {
		// set height for first thumbnail content
		thumbnail.style.height = thumbnail.getElementsByClassName("thumbnail-initial")[0].offsetHeight + 'px';
		// add click event for first thumbnail content
        let allThumbImages = thumbnail.getElementsByTagName("img");
        let allThumbVideos = thumbnail.getElementsByTagName("video");
        for (j = 0; j < allThumbImages.length; j++) {
            allThumbImages[j].onclick = function() {
                switchThumbnails(closestClass(this, "thumbnail"));
            };
        }
        for (k = 0; k < allThumbVideos.length; k++) {
            allThumbVideos[k].onclick = function() {
                switchThumbnails(closestClass(this, "thumbnail"));
            };
        }
		// if text only (experimental)
		if(allThumbImages.length < 1 && allThumbVideos.length < 1 &&
		thumbnail.getElementsByClassName("thumbnail-initial").length > 0 &&
		thumbnail.getElementsByClassName("thumbnail-pop").length > 0)
		{
			let textElement = document.createElement('span');
			textElement.classList.add('thumbnail-text');
			textElement.innerHTML = thumbnail.getElementsByClassName("thumbnail-initial")[0].innerHTML;
			let popupText = thumbnail.getElementsByClassName("thumbnail-pop")[0].innerHTML;
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
    }
}

function closestClass(inputElement, targetClassName) {
    while (inputElement.className != targetClassName && inputElement.parentNode.tagName.toUpperCase() != "BODY") {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function closestTag(inputElement, targetTagName) {
    while (inputElement.tagName != targetTagName.toUpperCase() && inputElement.parentNode.tagName.toUpperCase() != "BODY") {
		inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function switchThumbnails(tn) {
    let tc = tn.getElementsByClassName('thumbnail-initial');
	// identify active
	let active = tn.getAttribute('active');
	if(active == null)
		active = Array.from(tc).findIndex(t => !t.classList.contains('thumbnail-pop'));
	// to reset before setting new active
	for(let t of tc) {
		if(!t.classList.contains('thumbnail-pop'))
			t.classList.add('thumbnail-pop');
	}
	if(active == null) return;
	let nextActive = tc[active].nextElementSibling;
	if(nextActive == null) nextActive = tn.firstElementChild;
	nextActive.classList.remove('thumbnail-pop');
	// set height with transition delay
	setTimeout(function() {
			tn.style.height = nextActive.offsetHeight + 'px';
	}, 200);
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
    var images = document.getElementsByTagName("img");
    for (var p of images)
	{
		resizeImage(p);
		p.onload = function() {
			resizeImage(this);
		};
    }
	
	// set thumbnails again after adjusted
    setThumbnails();
}

function resizeImage(p) {
	// Conditions that cannot fix - workaround
	// Multiple table cells with caption row - set width style for caption row in %
	let showLog = false;
	if(showLog) console.log(p);
	var imgWidth = p.width;
	var imgHeight = p.height;
	if(showLog) console.log('width x height', imgWidth, imgHeight);
	// exclusion list: by image size, class, tag name, or by id
	if ((!notBlogger && (imgWidth < 20 || imgHeight < 20)) || 
		p.id == "news-thumbnail" || 
		p.classList.contains('img-unchanged') ||
		p.parentElement.tagName == "ABBR" || 
		p.parentElement.className == "anime-row" ||
		p.parentElement.className == "profile-box-img" || 
		p.parentElement.parentElement.className == "popup" || 
		p.parentElement.parentElement.className == "new-anime-row" ||
		p.parentElement.parentElement.parentElement.id == "anime-list" ||
		p.parentElement.parentElement.parentElement.className == "anime-year") 
	{
		if(showLog) console.log('exclusion', p, p.parentElement);
		p.classList.add('img-unchanged');
		return;
	}
	
	if(showLog)	console.log('orientation: ' + (imgWidth >= imgHeight ? 'landscape' : 'portrait'));
			
	// adjust dimensions
	p.removeAttribute("height");
	p.removeAttribute("width");
	if (p.parentElement.parentElement.tagName == "TR" && 
		p.parentElement.parentElement.getElementsByTagName("td").length > 1) //in table
		p.classList.add('img-width-fit');
	else if (p.parentElement.parentElement.parentElement.tagName == "TR" && 
		p.parentElement.parentElement.parentElement.getElementsByTagName("td").length > 1 && 
		p.parentElement.tagName == "A" &&
		!p.parentElement.parentElement.style.width) //in table, with link
		p.classList.add('img-width-fit');
	else if (p.width + 20 >= window.outerWidth)
		p.classList.add('img-width-fit');
	else if(!p.classList.contains('img-width-fit'))
		p.classList.add('img-width-auto');
	
	// special case: separator class
	if (p.parentElement.className == "separator" ||
		p.parentElement.parentElement.className == "separator") {
		p.parentElement.classList.add('img-separator');
		if(showLog) console.log('separator', p.style.marginLeft, p.style.marginRight);
	}
	if(p.parentElement.tagName == "A" &&
	p.parentElement.marginLeft != "" &&
	p.parentElement.marginRight != "")
	{
		p.parentElement.style.marginLeft = null;
		p.parentElement.style.marginRight = null;
		p.parentElement.classList.add('img-separator');
	}
}