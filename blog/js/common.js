//constants
const notBlogger = function() {
	return window.location.href.includes('knneo.github.io'); //if false, is blogger
};

// Single onLoad event control: put all functions in sequence
window.addEventListener('load', startup);

function startup() {
	// To be run async unless otherwise, dependents in with parent functions
	if(typeof addFloatingActionButtons == 'function') addFloatingActionButtons();
	if(typeof preloadSequence == 'function') preloadSequence();
    addHashtags();
    addHoverForLinks();
	resizeImages();
	displayFAB();
	if(typeof redirectInternalUrls == 'function') redirectInternalUrls();
	if(typeof generateViewer == 'function') generateViewer();
	if(typeof generateHeader == 'function') generateHeader();
	if(typeof generateReadTime == 'function') generateReadTime();

	// Window events
	window.addEventListener('scroll', displayFAB);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('resize', resizeImages);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	setTimeout(scrollToSectionByUrl, 1);
	setTimeout(resizeImages, 500);
}

//==FUNCTIONS==//
function addFloatingActionButtons() {
	addFAB('GoToTopBtn', 'Back To Top', 'arrow_upward', goToTop);
	
	if(!notBlogger())
		addFAB('SearchBtn', 'Search Blog', 'search', toggleSearch);
	
	if(notBlogger())
		addFAB('DarkModeBtn', 'Toggle Dark Mode', 'brightness_high', toggleDarkMode);
	
	if(!notBlogger())
		addFAB('SidebarBtn', 'Toggle Sidebar', 'menu', toggleSidebar);
}

function addFAB(id, title, googleIconName, clickEvent) {
	let fabButton = document.createElement('a');
	fabButton.id = id;
	fabButton.title = title;
	if(clickEvent) fabButton.addEventListener('click', clickEvent);
		let fabButtonIcon = document.createElement('i');
		fabButtonIcon.classList.add('material-icons');
		fabButtonIcon.innerText = googleIconName;
		fabButton.appendChild(fabButtonIcon);
	if(document.getElementById(id) != undefined) document.getElementById(id).remove();
	document.body.appendChild(fabButton);
}

// Add hashtags for Entertainment News posts with anchors
function addHashtags() {
	//ignore old id and if is search result
	let elements = document.querySelectorAll("[id='hashtags']");
	if(elements.length > 1 && window.location.href.includes("/search")) {
		for(let element of elements) {
			element.style.display = 'none';
		}
		return;
	}
	
	var hashtags = [];
	
	let hashTag = document.getElementById("hashtags");
	if(hashTag == null) return;
	if(hashTag.childElementCount > 0 && hashTag.innerHTML.includes("<a>")) {
		//render search href on hashtags list
		let childDivs = hashTag.getElementsByTagName('a');
		for(let tag of childDivs) {
			hashtags.push({
				tag: tag.innerText.substring(1), 
				target: "\"/search?q=" + tag.innerText.substring(1)
			});
		}
	}
	hashTag.innerHTML = '';
	
	//add hiddenTags direct to search
	let hiddenTags = document.querySelectorAll("[id='hiddenTags']");
	if(hiddenTags.length > 0) {
		var topicList = hiddenTags[0].innerText.split(",");
		for(var topic of topicList) {
			// hashtags += "<a href=\"/search?q=" + topic.trim() + "\">#" + topic.trim() + "</a> ";
			// document.getElementById("hashtags").innerHTML = hashtags;
			// document.getElementById("hiddenTags").remove();
			
			hashtags.push({
				tag: topic.trim(), 
				target: "\"/search?q=" + topic.trim()
			});
		}	
	}
	
	//add anime
	for(var topic of document.querySelectorAll(".post-body .anime"))
	{
		//if last 2 characters do not render a number, do not add
		var numeric = parseInt(topic.id.slice(-2)) || -1;
		if(numeric < 0) continue;
		hashtags.push({
			tag: topic.id.substring(0,topic.id.length-2), 
			target: topic.id
		});
	}
	
	//add klassic note
	let klassicNoteSpan = '';
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
	
	//render
	if(hashtags.length == 0) return;
	for(let item of hashtags)
	{
		let newItem = document.createElement('a');
		newItem.title = item.target.includes("/search") ? "" : item.target;
		// newItem.style.paddingRight = '3px';
		newItem.innerText = '#' + item.tag;
		newItem.href = item.target.includes("/search") && !window.location.href.includes("knneo.github.io") ? item.target : 'javascript:void(0);';
		if(!item.target.includes("/search"))
			newItem.addEventListener('click', function() {
				window.location.hash = this.title;
				// scrollToSectionByUrl();
			});
		hashTag.appendChild(newItem);
	}
}

function scrollToSectionByUrl() {
	if(window.location.hash.length > 0)
	{
		// let hash = window.location.hash;
		// let target = hash.length > 0 ? document.querySelector(hash) : null;
		let newPos = document.documentElement.scrollTop + (document.querySelector(window.location.hash)?.getBoundingClientRect().top || 0) - (document.querySelector('.header')?.getBoundingClientRect().height || 0) - 5;
		document.documentElement.scrollTop = newPos;
	}
}

// Popup element, based on content type
function addHoverForLinks() {
	if(document.getElementsByClassName('post-body entry-content').length == 0) return;
    for (let link of document.getElementsByClassName('post-body entry-content')[0].getElementsByTagName('a')) {
		if(typeof generateViewer == 'function' && link.target != '' && 
		(link.href.includes('twitter.com') || link.href.includes('instagram.com')))
			link.addEventListener('click', openItemInViewer);
		else if(link.target != '')
			link.addEventListener('mouseover', renderPopup);
    }
}

function addHoverOnExpander() {
	if (!window.location.href.includes("/search/label/")) return;
    for (let expander of document.getElementsByClassName('search-expander')) {
        expander.addEventListener('click', function() {
            for (let page of document.getElementsByClassName('post-body entry-content')) {
                if (page.style.display == 'none') continue;
                for (let link of page.getElementsByTagName('a')) {
                    link.addEventListener('mouseover', renderPopup);
                }
            }
        });
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
		// if(isMobile()) document.querySelector('html').scrollTop += this.getBoundingClientRect().top;
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
	else
		toggleOverlay(false);
}

function renderPopup() {
    //if(link.childElementCount == 0)
    event.preventDefault();
	
	//exclusion for blogger	images
    if ((this.href.includes('blogspot.com') || this.href.includes('blogger.googleusercontent.com')) && this.target == '') return;
	//exclusion for if target is not _blank
    if (this.target == '') return;
	//exclusion class
    //if(link.childElementCount > 0) return;
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
	closeButton.title = 'Close Popup';
	closeButton.addEventListener('click', closePopups);
		let closeButtonIcon = document.createElement('i');
		closeButtonIcon.classList.add('material-icons');
		closeButtonIcon.innerText = 'close';
		closeButton.appendChild(closeButtonIcon);
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	document.body.appendChild(closeButton);
	
	return thumbnail;
}

function renderEmbedProcess() {
	try {
		
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
		window.instgrm.Embeds.process(); // to render instagram embed
		return true;
	}
	catch(err) {
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
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ (!url.includes('i=') ? '450' : '150') +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: 660px; overflow: hidden; width: 100%;"></iframe>';
    }
    if (url.includes('twitter.com')) {
        //process twitter embed
		//data-height for timeline is max width
		if(url.includes('/status/')) {
			return '<blockquote class="twitter-tweet tw-align-center" data-conversation="none" data-height="' + 0.6*window.innerHeight + '"><a href="' +
				url +
				'"></a></blockquote><script async="async" charset="utf-8" src="https://platform.twitter.com/widgets.js" >\</script\>';
		}
 		/*else {
			return '<a class="twitter-timeline" data-width="568" data-height="' + 0.6*window.innerHeight + '" href="' +
				url +
				'"></a><script async="async" charset="utf-8" src="https://platform.twitter.com/widgets.js" >\</script\>';
		} */
    }
    if (url.includes('youtube.com') && url.includes('/watch')) {
        //process youtube embed
        let id = url.substring(url.indexOf('?v=') + 3);
        return '<iframe class="yt-video" allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '?enablejsapi=1"></iframe>';
    }
    if (url.includes('instagram.com/p/')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" data-instgrm-permalink="' +
            url + '" data-instgrm-version="13" style="max-width:540px; min-width:326px; padding:0; width:100%;"></blockquote></center><script async="async" src="//www.instagram.com/embed.js">\</script\>';
    }
    if (url.includes('jisho.org/search/')) {
        //process page as iframe
        return '<iframe id="myFrame" src="' +
            url + '" style="height:min(50vh,450px);width:min(98%,760px);"></iframe>';
    }
    return null;
}

function toggleOverlay(fromSidebar) {
	let body = document.body;
    if (document.getElementById('Overlay') == undefined) {
		let overlay = document.createElement('div');
		overlay.id = 'Overlay';
		overlay.style.display = 'none';
		overlay.addEventListener('click',closePopups);
		body.appendChild(overlay);
	}
	document.getElementById('Overlay').style.display = toggleDisplay(document.getElementById('Overlay'), 'none');
	document.getElementById('Overlay').style.backgroundColor = fromSidebar ? 'black' : 'transparent';
	document.getElementById('Overlay').style.zIndex = fromSidebar ? '8' : '0';
	
	if(fromSidebar) {
		document.body.style.overflow = document.body.style.overflow == '' ? 'hidden' : '';
	}
	else if(document.getElementById('BackBtn') != null) {
		document.getElementById('BackBtn').style.display = toggleDisplay(document.getElementById('BackBtn'), 'none');
		document.getElementById('RightBtn').style.display = toggleDisplay(document.getElementById('RightBtn'), 'none');
	}
	else if(document.getElementById('SidebarBtn') != null) {
		document.getElementById('SidebarBtn').style.display = toggleDisplay(document.getElementById('SidebarBtn'), 'none');
	}
}

function displayFAB() {
	// if(document.getElementById('Overlay') != null &&
	// document.getElementById('Overlay').style.display != 'none')
		// return;
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.body.scrollTop > document.documentElement.clientHeight || 
		document.documentElement.scrollTop > document.documentElement.clientHeight) {
		switchToButton('GoToTopBtn');
	} else {
		if(window.location.href.includes("knneo.github.io")) switchToButton('DarkModeBtn');
		else switchToButton('SearchBtn');
	}
}

// Floating action button events
function toggleSearch() {
    goToTop();
	if(document.getElementById('CustomBlogSearch') == null) return;
    var barDisp = document.getElementById('CustomBlogSearch').style.display;
    if (barDisp == 'none' || barDisp == '') {
        document.getElementById('CustomBlogSearch').style.display = 'block';
		document.getElementById('BlogSearch').focus();
	}
    else {
        document.getElementById('CustomBlogSearch').style.display = 'none';
		document.getElementById('BlogSearch').innerText = '';
		document.getElementById('BlogSearch').blur();
	}
}

function toggleSidebar() {
	// toggle body overlay
    toggleOverlay(true);
    // document.body.style.position = document.body.style.position == 'fixed' ? '' : 'fixed';
    // document.body.style.left = document.body.style.left == '0' ? '' : '0';
    // document.body.style.right = document.body.style.right == '0' ? '' : '0';
	
	// left sidebar element
    let outer = document.getElementsByClassName('column-left-outer')[0];
	outer.style.position = toggleDisplay(outer, 'fixed');
	
	let menuStatus = document.getElementById('SidebarBtn').getElementsByTagName('i')[0];
	menuStatus.innerText = menuStatus.innerText == 'menu' ? 'menu_open' : 'menu';
	
    let iconLeft = window.innerWidth >= 780 ? '5px' : '0';
    outer.style.left = outer.style.left == '' ? iconLeft : '';
	
    let iconBottom = window.innerWidth >= 780 ? '78px' : '60px';
    outer.style.bottom = outer.style.bottom == '' ? iconBottom : '';
    outer.style.margin = outer.style.margin == '' ? 'auto' : '';
    outer.style.zIndex = outer.style.zIndex != 9 ? 9 : '';
	
    let aside = outer.getElementsByTagName('aside')[0];
    aside.style.display = toggleDisplay(aside, 'block');
	
    if (window.innerHeight <= 640)
		document.getElementById('LinkList1').style.display = toggleDisplay(document.getElementById('LinkList1'), 'none');
    if (window.innerHeight <= 960)
		document.getElementById('BlogArchive1').style.display = toggleDisplay(document.getElementById('BlogArchive1'), 'none');
}

function toggleDisplay(element, defaultValue) {
	return element.style.display == '' ? defaultValue : '';
}

function switchToButton(id) {
	if(id == '') return;
	let buttons = ['GoToTopBtn','SearchBtn','DarkModeBtn'];
	for(let button of buttons)
	{
		if(document.getElementById(button) != null) document.getElementById(button).style.display = 'none';
	}
	if(id != 'SearchBtn') document.getElementById(id).style.display = 'block';
	else if (window.location.href.includes("knwebreports.blogspot")) document.getElementById('SearchBtn').style.display = 'block';
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
    let allThumbnails = document.body.getElementsByClassName("thumbnail");
    for (let i = 0; i < allThumbnails.length; i++) {
/*         var firstElement = allThumbnails[i].getElementsByClassName('thumbnail-initial')[0];
        if (firstElement == undefined) continue;
        var initialHeight = firstElement.offsetHeight;
        var popHeight = allThumbnails[i].getElementsByClassName('thumbnail-pop')[0].offsetHeight;
        allThumbnails[i].style.height = Math.max(initialHeight, popHeight) + 'px';
        if (popHeight - initialHeight > 50 || popHeight - initialHeight < -50)
            allThumbnails[i].style.height = initialHeight + 'px'; */
		
		let [min, max] = calcMinMaxThumbHeight(allThumbnails[i]);
		if(min && max)
			allThumbnails[i].style.height = allThumbnails[i].getElementsByClassName("thumbnail-initial")[0].offsetHeight + 'px';
		if(!min)
			allThumbnails[i].style.height = max + 'px';
        let allThumbImages = allThumbnails[i].getElementsByTagName("img");
        let allThumbVideos = allThumbnails[i].getElementsByTagName("video");
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
		for(let image of allThumbImages) {
			if(image.parentElement.tagName == "A") {
				console.error("Thumbnail has image with link: Will prevent switchThumbnails from image click");
				return;
			}
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
    let tc = tn.getElementsByClassName("thumbnail-initial");
	// to identify active
	let active = tn.getAttribute('active');
	if(active == null)
		active = Array.from(tc).findIndex(t => !t.classList.contains("thumbnail-pop"));
	// to reset before setting new active
	for(let t of tc) {
		if(!t.classList.contains("thumbnail-pop"))
		t.classList.add("thumbnail-pop");
	}
	if(active == null) return;
	let nextActive = tc[active].nextElementSibling;
	if(nextActive == null) nextActive = tn.firstElementChild;
	nextActive.classList.remove("thumbnail-pop");
	// recalculate height if huge difference
    // var initialVisible = true;
    // let heights = Array.from(tc).map(t => t.offsetHeight);
	// let maxHeight = Math.max(...heights);
	// let minHeight = Math.min(...heights);
    /*let tc = tn.getElementsByClassName("thumbnail-initial");
    if (tc[0].style.visibility == "hidden") {
        tc[0].style.visibility = "visible";
        tc[1].style.visibility = "hidden";
    } else if (tc[0].style.visibility == "" || tc[1].style.visibility == "") {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
        initialVisible = false;
    } else {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
        initialVisible = false;
    }

    var initialHeight = tn.getElementsByClassName('thumbnail-initial')[0].offsetHeight;
    var popHeight = tn.getElementsByClassName('thumbnail-pop')[0].offsetHeight;
    if (popHeight - initialHeight > 50 || popHeight - initialHeight < -50)
        tn.style.height = (initialVisible ? initialHeight : popHeight) + 'px';*/
	// if(maxHeight - minHeight > 50)
	let [min, max] = calcMinMaxThumbHeight(tn);
	if(min && max)
		tn.style.height = nextActive.offsetHeight + 'px';
    return;
}

function calcMinMaxThumbHeight(thumbnailClass) {
	//calculation logic:
	/*
	 * if large difference ie. >50, set min and max height
	 * if small difference, set no min, max as max height
	 */
    let tc = thumbnailClass.getElementsByClassName("thumbnail-initial");
    let heights = Array.from(tc).map(t => t.offsetHeight);
	let minHeight = Math.min(...heights);
	let maxHeight = Math.max(...heights);
	if(maxHeight - minHeight <= 50)
		return [null, maxHeight];
	if(minHeight && maxHeight)
		return [minHeight, maxHeight];
	return [null, null];
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
    for (var p of images) {
		let showLog = false;
		if(showLog) console.log(p);
        var imgWidth = p.width;
        var imgHeight = p.height;
		if(showLog) console.log('width x height', imgWidth, imgHeight);
        //process exclusion list
		//by image size, class, tag name, or by id
        if (imgWidth < 20 || imgHeight < 20) continue;
        if (p.id == "news-thumbnail" || 
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
			continue;
		}
        //end of process exclusion list
		
		//process based on parent
        /* if (p.parentElement.tagName == "DIV" && !p.parentElement.classList.contains("post") && !p.parentElement.classList.contains("post-body") && !p.parentElement.classList.contains("post-outer")) {
            p.parentElement.style.maxWidth = imgWidth + 'px';
            p.parentElement.style.maxHeight = imgHeight + 'px';
			if(showLog) console.log('parentElement', p.parentElement.style.maxWidth, p.parentElement.style.maxHeight);
        } else if ((p.parentElement.parentElement.tagName == "TR" ||
                (p.parentElement.parentElement.className == "separator" && p.parentElement.parentElement.tagName != "TR")) &&
            !p.parentElement.parentElement.classList.contains("post") && !p.parentElement.parentElement.classList.contains("post-body") &&
            !p.parentElement.parentElement.classList.contains("post-outer")) {
            p.parentElement.parentElement.style.maxWidth = imgWidth + 'px';
            p.parentElement.parentElement.style.maxHeight = imgHeight + 'px';
			if(showLog) console.log('parentElement.parentElement', p.parentElement.parentElement.style.maxWidth, p.parentElement.parentElement.style.maxHeight);
            p.parentElement.style.width = (100 / (p.parentElement.parentElement.childElementCount)) + '%';
			if(showLog) console.log('parentElement', p.parentElement.style.width);
        } else if (!p.parentElement.parentElement.parentElement.classList.contains("post") &&
            !p.parentElement.parentElement.parentElement.classList.contains("post-body") &&
            !p.parentElement.parentElement.parentElement.classList.contains("post-outer")) {
            p.parentElement.parentElement.parentElement.style.maxWidth = imgWidth + 'px';
            p.parentElement.parentElement.parentElement.style.maxHeight = imgHeight + 'px';
			if(showLog) console.log('parentElement.parentElement.parentElement', p.parentElement.parentElement.parentElement.style.maxWidth, p.parentElement.parentElement.parentElement.style.maxHeight);
        } */
		//end of process based on parent
		
		//process based on dimensions
        if (imgWidth >= imgHeight) //landscape
        {
            p.removeAttribute("height");
            p.removeAttribute("width");
            if (p.parentElement.parentElement.tagName == "TR" && p.parentElement.parentElement.getElementsByTagName("td").length > 1) //in table
                p.classList.add('img-width-fit');
            else if (p.parentElement.parentElement.parentElement.tagName == "TR" && p.parentElement.parentElement.parentElement.getElementsByTagName("td").length > 1 && p.parentElement.tagName == "A") //in table, with link
			{
				if(!p.parentElement.parentElement.style.width)
					p.classList.add('img-width-fit');
			}
            else if (p.width + 20 >= window.outerWidth) //see #main and .separator
                p.classList.add('img-width-fit');
            else if (p.width < imgWidth)
                p.classList.add('img-width-auto');
            else
                p.style.width = imgWidth + 'px';
			if(showLog) console.log('landscape', p.style.width, p.style.height);
        } else //portrait
        {
            p.removeAttribute("width");
            p.removeAttribute("height");
            if (p.parentElement.parentElement.tagName == "TR" && p.parentElement.parentElement.getElementsByTagName("td").length > 1) //in table
                p.classList.add('img-width-fit');
            else if (p.parentElement.parentElement.parentElement.tagName == "TR" && p.parentElement.parentElement.parentElement.getElementsByTagName("td").length > 1 && p.parentElement.tagName == "A") //in table, with link
			{
				if(!p.parentElement.parentElement.style.width)
					p.classList.add('img-width-fit');
			}
            else if (p.width + 20 >= window.outerWidth) //see #main and .separator
                p.classList.add('img-width-fit');
            else if (p.width < imgWidth)
                p.classList.add('img-width-auto');
            else
                p.style.width = imgWidth + 'px';
			if(showLog) console.log('portrait', p.style.width, p.style.height);
        }
		//end of process based on dimensions
		
		//separator special cases
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
		//end of separator special cases
		
        /* if (p.width >= document.getElementsByClassName("post-body")[0].offsetWidth && document.getElementsByClassName("post-body")[0].offsetWidth > 0) {
            p.style.width = '100%';
			if(showLog) console.log('offsetWidth', p.style.width, p.style.height);
        } */
    }
	
    setThumbnails();
}
