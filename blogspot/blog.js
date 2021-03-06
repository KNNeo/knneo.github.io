// Single onLoad event control: put all functions in sequence
window.onpageshow = function() {
	// To be in sequence unless otherwise
	loadExternal();
	addObjects();
    preloadSequence();
    reduceResults();
    // fixPopup();
    setThumbnails();
    resizeImg();
    fixLabelResults();
	fixNavigationResults();
    olderNewerTextToIcon();
    addLabelForNavigation();
	fixLightbox();
    addHoverForLinks();
    addHoverOnExpander();
    addHashtags();
	// hideImagesOnError();
	// videoifyGIFs();

	// Window events
	window.onscroll = displayFAB;
	window.onresize = windowOnResize;
};

// FUNCTIONS, in above order //
// Add custom scripts to only add this script on layout
function loadExternal() {
	let viewport = document.createElement('meta');
	viewport.setAttribute('name','viewport');
	viewport.setAttribute('content','width=device-width,initial-scale=1.0');
	document.head.appendChild(viewport);

	let apple = document.createElement('meta');
	apple.setAttribute('name','apple-mobile-web-app-capable');
	apple.setAttribute('content','yes');
	document.head.appendChild(apple);

	let mobile = document.createElement('meta');
	mobile.setAttribute('name','mobile-web-app-capable');
	mobile.setAttribute('content','yes');
	document.head.appendChild(mobile);
	
	let theme = document.createElement('meta');
	theme.name = 'theme-color';
	theme.content = 'black';
	document.head.appendChild(theme);
	
	let fontCss = document.createElement('link');
	fontCss.href = 'https://fonts.googleapis.com/css?family=Open Sans';
	// fontCss.type = 'text/css';
	fontCss.rel = 'stylesheet'
	document.head.appendChild(fontCss);
	
	let iconCss = document.createElement('link');
	iconCss.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
	// iconCss.type = 'text/css';
	iconCss.rel = 'stylesheet'
	document.head.appendChild(iconCss);
	
	let twScript = document.createElement('script');
	twScript.src = 'https://platform.twitter.com/widgets.js';
	twScript.type = 'text/javascript';
	twScript.charset = 'utf-8';
	twScript.async = 'async';
	document.head.appendChild(twScript);
	
	let inScript = document.createElement('script');
	inScript.src = 'https://www.instagram.com/embed.js';
	inScript.type = 'text/javascript';
	inScript.charset = 'utf-8';
	inScript.async = 'async';
	document.head.appendChild(inScript);
}

// Add search bar, floating action buttons
function addObjects() {
	//search bar
	if(!window.location.href.includes("knneo.github.io")) {
		let search = document.createElement('div');
		search.id = 'CustomBlogSearch';
		search.innerHTML = '<div class="widget-content"><div id="_form"><form action="' + window.location.origin + '/search" class="gsc-search-box" target="_top"><div cellpadding="0" cellspacing="0" class="gsc-search-box"><div><div><span class="gsc-input"><input id="BlogSearch" autocomplete="off" class="gsc-input" name="q" size="10" title="search" type="text" value=""></span><span class="gsc-search-button" style="display: none;"><input class="gsc-search-button" name="max-results" title="search" type="submit" value="5"></span></div></div></div></form></div></div>';
		
		if(document.getElementById('CustomBlogSearch') != null) document.getElementById('CustomBlogSearch').remove();
		if(document.getElementsByClassName('header-outer').length > 0)
			document.getElementsByClassName('header-outer')[0].appendChild(search);
	}
	
	//FABs
	let topButton = document.createElement('a');
	topButton.id = 'GoToTopBtn';
	topButton.title = 'Back To Top';
		let topButtonIcon = document.createElement('i');
		topButtonIcon.classList.add('material-icons');
		topButtonIcon.innerText = 'arrow_upward';
		topButton.appendChild(topButtonIcon);
	if(document.getElementById('GoToTopBtn') != undefined) document.getElementById('GoToTopBtn').remove();
	document.body.appendChild(topButton);
	
	if(!window.location.href.includes("knneo.github.io"))
	{
		let searchButton = document.createElement('a');
		searchButton.id = 'SearchBtn';
		searchButton.title = 'Search Blog';
			let searchButtonIcon = document.createElement('i');
			searchButtonIcon.classList.add('material-icons');
			searchButtonIcon.innerText = 'search';
			searchButton.appendChild(searchButtonIcon);
		if(document.getElementById('SearchBtn') != undefined) document.getElementById('SearchBtn').remove();
		document.body.appendChild(searchButton);
	}
	
	let sidebarButton = document.createElement('a');
	sidebarButton.id = 'SidebarBtn';
	sidebarButton.title = 'Toggle Sidebar';
		let sidebarButtonIcon = document.createElement('i');
		sidebarButtonIcon.classList.add('material-icons');
		sidebarButtonIcon.innerText = 'menu';
		sidebarButton.appendChild(sidebarButtonIcon);
	if(document.getElementById('SidebarBtn') != undefined) document.getElementById('SidebarBtn').remove();
	document.body.appendChild(sidebarButton);
		
	document.getElementById('GoToTopBtn').addEventListener('click', goToTop);
	if(!window.location.href.includes("knneo.github.io")) document.getElementById('SearchBtn').addEventListener('click', toggleSearch);
	document.getElementById('SidebarBtn').addEventListener('click', toggleSidebar);
}

// Reload based on first visit: if no 'm=0/1' add, if m=0 edit older posts and newer posts URL
function preloadSequence() {
    //initial URL visit fix
    var firstVisit = window.location.href;
    if (firstVisit.includes("/search/label/The%20Entertainment%20News"))
		document.getElementById("hashtags").remove();
	
	//open body if no other fixes
	document.body.style.display = 'block';
	if(!window.location.href.includes("knneo.github.io")) document.getElementById("SearchBtn").style.display = 'block';
	if (window.innderWidth < 1040)
		document.getElementById("SidebarBtn").style.display = 'block';
}

// For search, collapse all results
function reduceResults() {
	//Exceptions in order: single posts, previews, pages, linqpad
    if ((window.location.href.includes(window.location.origin + '/20') && window.location.href.includes('.html')) || 
		window.location.href.includes(window.location.origin + '/b/blog-preview') || 
		window.location.href.includes(window.location.origin + '/p/') ||
		window.location.href.includes('knneo.github.io'))
		return;
	//Remove content
	for (var footer of document.getElementsByClassName('post-footer-line-2')) {
		footer.innerHTML = '<hr>';
	}
	while (document.getElementsByClassName('date-header')[0] != undefined) {
		document.getElementsByClassName('date-header')[0].remove(); //remove header
	}
	while (document.getElementsByClassName('blog-feeds')[0] != undefined) {
		document.getElementsByClassName('blog-feeds')[0].remove(); //remove feed
	}

	if(!window.location.href.startsWith(window.location.origin + '/search') && 
		!window.location.href.startsWith(window.location.origin + '/20'))
	{
		let columnCenterInner = document.getElementsByClassName('column-center-inner')[0];
		columnCenterInner.classList.add('homepage-column-center-inner');
		
		if(document.getElementById('hashtags') != undefined)
			document.getElementById('hashtags').parentElement.removeChild(document.getElementById('hashtags'));
		let posts = document.getElementsByClassName('post');
		for (var post of posts)
		{
			//definition and preprocessing
			let footer = post.getElementsByClassName('post-footer')[0];
			footer.parentElement.removeChild(footer);
			let title = post.getElementsByClassName('post-title')[0];
			let link = title != undefined ? title.getElementsByTagName('a')[0] : undefined;
			let snippet = post.getElementsByClassName('post-body')[0];
			if(snippet.getElementsByTagName('style').length > 0)
				snippet.removeChild(snippet.childNodes[0]); //remove style
			let statement = snippet.getElementsByTagName('b');
			let thumb = snippet.getElementsByTagName('img')[0];
				
			//generate thumb
			let latestPost = document.createElement('div');
			latestPost.classList.add('latest-post');
							
			let innerPostLink = document.createElement('a');
			innerPostLink.href = link != undefined ? link.href : './search/label/The%20Statement';
			
			let latestPostTitle = document.createElement('h3');
			latestPostTitle.innerText = title != undefined ? title.innerText : statement[0].innerText;
			
			let thumbDiv = document.createElement('div');
			if(posts.length > 1) thumbDiv.style.float = 'left';
				let homeThumb = document.createElement('div');
				homeThumb.classList.add('home-thumb');
				if(posts.length == 1) {
					homeThumb.style.margin = 'auto';
					homeThumb.style.width = '240px';
					homeThumb.style.height = '240px';
				}
				homeThumb.style.backgroundImage = 'url(\'' + (thumb != undefined ? thumb.src : '') + '\')';
			thumbDiv.appendChild(homeThumb);
			
			let latestPostSummary = document.createElement('div');
			latestPostSummary.classList.add('latest-post-summary');
			latestPostSummary.innerHTML = (title == undefined ? '' : snippet.innerText.trim().substring(0,380));
			
			let contents = document.createElement('div');
			if(link != undefined && thumb != undefined) contents.appendChild(thumbDiv);
			if(title != undefined) contents.appendChild(latestPostSummary);
			
			let innerWrapper = document.createElement('div');
			innerWrapper.appendChild(latestPostTitle);
			innerWrapper.appendChild(contents);
			
			innerPostLink.appendChild(innerWrapper);
			
			post.innerHTML = '';
			latestPost.appendChild(innerPostLink);
			post.appendChild(latestPost);
		}
	}
	else
	{
		for (var content of document.getElementsByClassName('post-body entry-content'))
		{
			if (content.parentElement.getElementsByTagName('h3').length > 0)
				content.style.display = 'none';
		}
		
		//add button to expand/collapse
		for (var titleBar of document.getElementsByClassName('post-title entry-title')) {
			titleBar.innerHTML = '<table><tbody><tr><td><div class="search-expander"><i class="material-icons">unfold_less</i></div></td><td>' + titleBar.innerHTML + '</td></tr></tbody></table>';
		}
		//add click logic
		for (var i = 0; i < document.getElementsByClassName('post-title entry-title').length; i++) {
			document.getElementsByClassName('search-expander')[i].addEventListener("click", function() {
				var titleBar = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				if (titleBar.getElementsByClassName('entry-content')[0].style.display == 'none') {
					titleBar.getElementsByClassName('entry-content')[0].style.display = '';
					this.getElementsByTagName('i')[0].innerText = 'unfold_more';
				} else {
					titleBar.getElementsByClassName('entry-content')[0].style.display = 'none';
					//this.style.color = 'white';
					this.getElementsByTagName('i')[0].innerText = 'unfold_less';
				}
				setThumbnails();
			});
		}
		//fix table cell border depending on content type due to mix of post contents
		for (var table of document.getElementsByTagName('td')) {
			if (table.getElementsByTagName('img').length > 0 || table.className == 'tr-caption') {
				table.style.border = 'none';
				table.style.padding = '0';
			}
		}
	}
}

// Fix only all old thumbnail div with images, not for span
function fixPopup() {
    for (let popup of document.getElementsByClassName('popup')) {
        if (popup.getElementsByTagName('table').length < 2) continue;

        let newInitial = document.createElement('DIV');
        newInitial.className = 'thumbnail-initial hover-hidden';
        newInitial.innerHTML = popup.getElementsByClassName('initial')[0].innerHTML;
        let newPop = document.createElement('DIV');
        newPop.className = 'thumbnail-initial thumbnail-pop hover-visible';
        newPop.innerHTML = popup.getElementsByClassName('pop')[0].innerHTML;
        popup.innerHTML = '';
        popup.appendChild(newInitial);
        popup.appendChild(newPop);

        popup.className = 'thumbnail';
    }
}

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
		
		let [, maxHeight] = calcMinMaxThumbHeight(allThumbnails[i], true);
		if(maxHeight)
			allThumbnails[i].style.height = maxHeight + 'px';
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
	let [min, max] = calcMinMaxThumbHeight(tn, false);
	if(max - min > 50)
		tn.style.height = nextActive.offsetHeight + 'px';
    return;
}

function calcMinMaxThumbHeight(thumbnailClass, isFirstLoad) {
    let tc = thumbnailClass.getElementsByClassName("thumbnail-initial");
    let heights = Array.from(tc).map(t => t.offsetHeight);
	let minHeight = Math.min(...heights);
	let maxHeight = Math.max(...heights);
	if(isFirstLoad && maxHeight - minHeight > 50)
		return [null, tc[0].offsetHeight];
	return [minHeight, maxHeight] || [tc[0].offsetHeight, tc[0].offsetHeight];
}

// Responsive image resizing based on screen dimensions
function resizeImg() {
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
                p.classList.add('img-width-fit');
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
                p.classList.add('img-width-fit');
            else if (p.width + 20 >= window.outerWidth) //see #main and .separator
                p.classList.add('img-width-fit');
            else if (p.width >= imgWidth)
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

// Fix search results to return 5 results instead of 1
function fixLabelResults() {
	if(document.getElementById("Label1") == undefined) return;
    for (var link of document.getElementById("Label1").getElementsByTagName("a")) {
        link.href = link.href += link.href.includes("?") ? "&max-results=5" : "?max-results=5";
    }
}

// Fix number of pages to display on older and newer links
function fixNavigationResults() {
    if (document.getElementsByClassName('blog-pager-older-link').length > 0) {
        var pagerLink = document.getElementsByClassName('blog-pager-older-link')[0].href;
        if (pagerLink.includes('&max-results=5') || pagerLink.includes('&max-results=20'))
            pagerLink = pagerLink.replace('&max-results=5', '&max-results=1');
        else
            pagerLink += '&max-results=1';

        if (document.getElementsByClassName('blog-pager-newer-link').length > 0) {
            pagerLink = document.getElementsByClassName('blog-pager-newer-link')[0].href;
            if (pagerLink.includes('&max-results=5'))
                pagerLink = pagerLink.replace('&max-results=5', '&max-results=1');
            else
                pagerLink += '&max-results=1';
        }
    }
}

// Convert text to icon for footer next previous posts
function olderNewerTextToIcon() {
    if (document.getElementById("blog-pager-newer-link") != null) document.getElementById("blog-pager-newer-link").getElementsByTagName("a")[0].innerHTML = "<i class='material-icons flip-arrow'>arrow_right_alt</i>";
    if (document.getElementById("blog-pager-older-link") != null) document.getElementById("blog-pager-older-link").getElementsByTagName("a")[0].innerHTML = "<i class='material-icons'>arrow_right_alt</i>";
	if (document.getElementsByClassName('home-link').length > 0) {
		let homeLink = document.getElementsByClassName('home-link')[0];
		if(window.innerHeight*2 < document.body.getBoundingClientRect().height) 
			homeLink.innerHTML = "<i class='material-icons'>home</i>";
		else
			homeLink.classList.add('display-none');
	}		
}

// Add arrows for search labels when in smaller screens
function addLabelForNavigation() {
	if(document.getElementById("Label1") == undefined) return;
    document.getElementById("Label1").innerHTML = '<i class="material-icons bar-left" style="font-size: 48px;">arrow_left</i><i class="material-icons bar-right" style="font-size: 48px;">arrow_right</i>' + document.getElementById("Label1").innerHTML;
    document.getElementById("Label1").getElementsByClassName("bar-right")[0].addEventListener("click", function() {
        document.getElementById("Label1").getElementsByTagName("ul")[0].scrollLeft += 100;
    });
    document.getElementById("Label1").getElementsByClassName("bar-left")[0].addEventListener("click", function() {
        document.getElementById("Label1").getElementsByTagName("ul")[0].scrollLeft -= 100;
    });
}

// To fix lightbox gallery not covering screen on Chrome mobile, run only once per refresh
function fixLightbox() {
	if(document.getElementById("Blog1") != null)
		document.getElementById("Blog1").addEventListener("click", cleanupLightbox);
}

function cleanupLightbox() {
    if (document.body.parentElement.className != "v2") {
        var browseContainer = document.getElementsByClassName("CSS_LIGHTBOX_PHOTO_BROWSE_CONTAINER")[0];
        var attributeContainerHolder = document.getElementsByClassName("CSS_LAYOUT_COMPONENT CSS_LIGHTBOX_ATTRIBUTION_INDEX_CONTAINER")[0].firstChild;
        attributeContainerHolder.firstChild.remove();
        attributeContainerHolder.firstChild.style.width = "100%";
        attributeContainerHolder.style.width = "100%";
        document.getElementsByClassName("CSS_LIGHTBOX_BG_MASK_TRANSPARENT")[0].style.height = "120%";
    }
	document.getElementById("Blog1").removeEventListener("click", cleanupLightbox);
}

// Popup element, based on content type
function addHoverForLinks() {
	if(document.getElementsByClassName('post-body entry-content').length == 0) return;
    for (let link of document.getElementsByClassName('post-body entry-content')[0].getElementsByTagName('a')) {
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
		if(document.getElementById('CloseBtn') != null) document.getElementById('CloseBtn').style.visibility = 'hidden';
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
		fixExternalFrame(this);
    }
	
	toggleOverlay(false);
}

function closePopups() {
	for (let page of document.getElementsByClassName('post-body entry-content')) {
		for (let popup of page.getElementsByClassName('new-thumbnail')) {
			popup.classList.remove('new-thumbnail');
		}
	}
	if(document.getElementById('CloseBtn') != null)
		document.getElementById('CloseBtn').style.visibility = 'hidden';
	
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
    if (this.href.includes('blogspot.com') && this.target == '') return; //exclusion for blogger
    //if(link.childElementCount > 0) return; //exclusion class
    if (this.classList.contains('opt-out')) return; //exclusion class
    let newContent = generatePopupContent(this.href);
    if (newContent == null) {
        return; //if not compatible for any design
    }
    let thumbnail = document.createElement('div');
    //thumbnail.classList.add('new-thumbnail');
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

    this.outerHTML = thumbnail.outerHTML;
    twttr.widgets.load(); //special case
    window.instgrm.Embeds.process(); //special case
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
}

function generatePopupContent(url) {
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.gif')) {
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
        return '<iframe allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '"></iframe>';
    }
    if (url.includes('instagram.com/p/')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" data-instgrm-permalink="' +
            url + '" data-instgrm-version="13" style="max-width:540px; min-width:326px; padding:0; width:100%;"></blockquote></center><script async="async" src="//www.instagram.com/embed.js">\</script\>';
    }
    if (url.includes('jisho.org/search/')) {
        //process page as iframe
        return '<iframe id="myFrame" src="' +
            url + '" style="height:60vh;width:98%"></iframe>';
    }
    return null;
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
	for(var topic of document.getElementsByClassName("anime"))
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
	for(let span of document.body.getElementsByTagName("span")) {
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
		newItem.style.paddingRight = '3px';
		newItem.innerText = '#' + item.tag;
		newItem.href = item.target.includes("/search") && !window.location.href.includes("knneo.github.io") ? item.target : 'javascript:void(0);';
		if(!item.target.includes("/search"))
			newItem.addEventListener('click', function() {
				document.getElementById(this.title).scrollIntoView();
			});
		hashTag.appendChild(newItem);
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
	else {
		document.getElementById('SidebarBtn').style.display = toggleDisplay(document.getElementById('SidebarBtn'), 'none');
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
	
    if (window.innerHeight <= 480)
		document.getElementById('LinkList1').style.display = toggleDisplay(document.getElementById('LinkList1'), 'none');
    if (window.innerHeight <= 960)
		document.getElementById('BlogArchive1').style.display = toggleDisplay(document.getElementById('BlogArchive1'), 'none');
}

function toggleDisplay(element, defaultValue) {
	return element.style.display == '' ? defaultValue : '';
}

function switchToButton(id) {
	if(id == '') return;
	let buttons = ['GoToTopBtn','SearchBtn'];
	for(let button of buttons)
	{
		if(document.getElementById(button) != null) document.getElementById(button).style.visibility = 'hidden';
	}
	if(id != 'SearchBtn') document.getElementById(id).style.visibility = 'visible';
	else if (window.location.href.includes("knwebreports.blogspot")) document.getElementById('SearchBtn').style.visibility = 'visible';
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	window.location.hash = "";
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

function displayFAB() {
	if(document.getElementById('Overlay') != null &&
	document.getElementById('Overlay').style.display != 'none')
		return;
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.body.scrollTop > document.documentElement.clientHeight || 
		document.documentElement.scrollTop > document.documentElement.clientHeight) {
		switchToButton('GoToTopBtn');
	} else {
		switchToButton('SearchBtn');
	}
}

function windowOnResize() {
	if (window.innerWidth >= 1040) {
		if(document.getElementById('LinkList1') != null) document.getElementById('LinkList1').style.display = '';
		if(document.getElementById('BlogArchive1') != null) document.getElementById('BlogArchive1').style.display = '';	
		let outer = document.getElementsByClassName('column-left-outer')[0];
		if(outer != null)
			outer.style.position = '';
	}
	document.body.style.visibility = window.innerWidth <= 320 ? 'hidden' : '';
	
	if(document.getElementById('Overlay') != null && document.getElementById('Overlay').style.display != 'none')
		closePopups();
};

function fixExternalFrame(thumbnail) {
	//fix iframes in thumbnails that don't fit content width
	if(thumbnail.getElementsByTagName('iframe').length > 0) {
		let thumbnailTable = closestTag(thumbnail, 'TABLE');
		if (thumbnailTable != thumbnail)
			thumbnailTable.style.width = '100%';
	}
}

//removed due to compatibility issue and having to do up cross origin support
async function videoifyGIFs() {
	if(!window.location.href.includes("https://knneo.github.io")) return; //reject file://
	for(let gif of document.getElementsByTagName('img')) {
		if(gif.src.endsWith('gif')) {
			await videoifyGIF(gif);
		}
	}
	setThumbnails();
}

//requires download of ffmpeg.js to work: permissions may be needed for cross origin use
async function videoifyGIF(gif) {
	const { createFFmpeg, fetchFile } = FFmpeg;
	const ffmpeg = createFFmpeg({ log: false });
	await ffmpeg.load();
	ffmpeg.FS('writeFile', 'input.gif', await fetchFile(gif.src));
	await ffmpeg.run('-f', 'gif', '-i', 'input.gif', 'output.mp4');
	const data = ffmpeg.FS('readFile', 'output.mp4');
	const video = document.createElement('video');
	video.setAttribute('autoplay','');
	video.setAttribute('loop','');
	video.src = URL.createObjectURL(
	  new Blob([data.buffer], { type: 'video/mp4' }),
	);
	// video.onclick = function(e) {
		// e.preventDefault();
		// switchThumbnails(closestClass(this, "thumbnail"));
	// };
	let td = gif.parentElement;
	td.innerHTML = '';
	td.appendChild(video);
}