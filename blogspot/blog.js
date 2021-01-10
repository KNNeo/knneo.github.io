// Single onLoad event control: put all functions in sequence
window.onload = function() {
	loadExternal();
	addObjects();
    preloadSequence();
    reduceResults();
    // fixPopup();
    if (document.getElementsByClassName('popup').length > 0) fixPopup();
    setThumbnails();
    resizeImg();
    fixLabelResults();
	fixNavigationResults();
    olderNewerTextToIcon();
    addLabelForNavigation();
	fixLightbox();
    addHoverForLinks();
    if (window.location.href.includes("/search/label/")) addHoverOnExpander();
};

window.onbeforeunload = function() {
	document.body.style.display = 'none';
};

window.onscroll = function() {
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
    if (document.body.scrollTop > document.documentElement.clientHeight || document.documentElement.scrollTop > document.documentElement.clientHeight) {
        document.getElementById('GoToTopBtn').style.visibility = 'visible';
        document.getElementById('SearchBtn').style.visibility = 'hidden';
    } else {
        document.getElementById('GoToTopBtn').style.visibility = 'hidden';
        document.getElementById('SearchBtn').style.visibility = 'visible';
    }
};

window.onresize = function() {
    if (document.getElementById('sidebarOverlay') != null && document.getElementById('sidebarOverlay').style.display != 'none')	
		toggleSidebar();
    if (window.innerWidth >= 1040) {
        document.getElementById('LinkList1').style.display = '';
        document.getElementById('BlogArchive1').style.display = '';
    }
	if(window.innerWidth <= 320) {
		document.body.style.visibility = 'hidden';
	}
};

// FUNCTIONS, in above order
// Add custom scripts to only add this script on layout
function loadExternal() {
	//document.querySelector('meta[name="viewport"]').setAttribute("content", "width=device-width,initial-scale=1.0");
	for(let metadata of document.getElementsByTagName('meta')) {
		if(metadata.name == 'viewport') {
			metadata.content = 'width=device-width,initial-scale=1.0';
			break;
		}
	}

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
	
	// <meta content='width=device-width,initial-scale=1.0' name='viewport'/>
	// <link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet'/>
	// <link href='https://fonts.googleapis.com/icon?family=Material+Icons' rel='stylesheet'/>
	// <script async='async' charset='utf-8' src='https://platform.twitter.com/widgets.js'/>
	// <script async='async' src='//www.instagram.com/embed.js'/>
}

// Add search bar, floating action buttons
function addObjects() {
	//search bar
	if(document.getElementById('CustomBlogSearch') == null) {
		let search = document.createElement('div');
		search.id = 'CustomBlogSearch';
		search.innerHTML = '<div class="widget-content"><div id="_form"><form action="https://knwebreports.blogspot.com/search" class="gsc-search-box" target="_top"><div cellpadding="0" cellspacing="0" class="gsc-search-box"><div><div><span class="gsc-input"><input autocomplete="off" class="gsc-input" name="q" size="10" title="search" type="text" value=""></span><span class="gsc-search-button" style="display: none;"><input class="gsc-search-button" name="max-results" title="search" type="submit" value="5"></span></div></div></div></form></div></div>';
		
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
	
	let searchButton = document.createElement('a');
	searchButton.id = 'SearchBtn';
	searchButton.title = 'Search Blog';
		let searchButtonIcon = document.createElement('i');
		searchButtonIcon.classList.add('material-icons');
		searchButtonIcon.innerText = 'search';
		searchButton.appendChild(searchButtonIcon);
	if(document.getElementById('SearchBtn') != undefined) document.getElementById('SearchBtn').remove();
	document.body.appendChild(searchButton);
	
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
	document.getElementById('SearchBtn').addEventListener('click', toggleSearch);
	document.getElementById('SidebarBtn').addEventListener('click', toggleSidebar);

	// <a id='GoToTopBtn' onclick='goToTop()' title='Back to Top'><i class='material-icons'>arrow_upward</i></a>
	// <a id='SearchBtn' onclick='toggleSearch()' title='Search Blog'><i class='material-icons'>search</i></a>
	// <a id='SidebarBtn' onclick='toggleSidebar()' title='Toggle Sidebar'><i class='material-icons'>menu</i></a>
}

// Reload based on first visit: if no 'm=0/1' add, if m=0 edit older posts and newer posts URL
function preloadSequence() {
    //initial URL visit fix
    var firstVisit = window.location.href;
    var isFixedURL = false;
    if (firstVisit.includes("/search/label/The%20Entertainment%20News")) document.getElementById("hashtags").remove();
    // if (firstVisit.includes("post-preview")) {
        // document.getElementsByTagName("body")[0].style.display = 'block';
        // document.getElementsByClassName("blogger-clickTrap")[0].remove();
        // return;
    // }
    // if (firstVisit.includes("#")) {
        // firstVisit = firstVisit.substring(0, firstVisit.indexOf("#"));
    // }
    // else
        // isFixedURL = true;

    // if (isFixedURL) {
	document.getElementsByTagName("body")[0].style.display = 'block';
	document.getElementById("SearchBtn").style.display = 'block';
	if (window.innderWidth < 1040) document.getElementById("SidebarBtn").style.display = 'block';
    // }
	// else
		// console.log('unable to complete preLoad');
}

// For search, collapse all results
function reduceResults() {
    if (document.getElementsByClassName('post-body entry-content').length > 1) {
		//Remove content
        for (var footer of document.getElementsByClassName('post-footer-line-2')) {
            footer.innerHTML = '<hr>';
        }
        while (document.getElementsByClassName('date-header')[0] != undefined) {
            document.getElementsByClassName('date-header')[0].remove(); //remove header
        }
		
		if(!window.location.href.includes('/search/'))
		{
			//Desktop: allow expand/collapse
			// for (var post of document.getElementsByClassName('post')) {
				// titleBar.innerHTML = '<table><tbody><tr><td><div class="search-expander"><i class="material-icons">unfold_less</i></div></td><td>' + titleBar.innerHTML + '</td></tr></tbody></table>';
			// }
			
			
			//Mobile: remove content, fixed link
			if(document.getElementById('hashtags') != undefined)
				document.getElementById('hashtags').parentElement.removeChild(document.getElementById('hashtags'));
			for (var post of document.getElementsByClassName('post'))
			{
				post.classList.add('latest-post');
				let footer = post.getElementsByClassName('post-footer')[0];
				footer.parentElement.removeChild(footer);
				let title = post.getElementsByClassName('post-title')[0];
				let snippet = post.getElementsByClassName('post-body')[0];
				let thumb = snippet.getElementsByTagName('img')[0];
				if(snippet.getElementsByTagName('style').length > 0)
					snippet.removeChild(snippet.childNodes[0]); //remove style
				post.innerHTML = '<table><tbody>'
				+ (thumb != undefined 
				? ('<tr><td rowspan="2"><div class="homepage-thumb" style="background-image: url(\'' + thumb.src + '\');"></div></td>' + 
				(title != undefined ? '<td>' + title.outerHTML + '</td>' : '') + '</tr>')
				: '')
				+ '<tr><td>' + (title == undefined ? snippet.innerHTML : snippet.innerText.substring(0,380)) + '</td></tr>'
				+ '</tbody></table>';
				if(title != undefined)
					post.removeChild(title); //remove title
			}
		}
		else
		{
			for (var content of document.getElementsByClassName('post-body entry-content')) //[0] != undefined)
			{
				if (content.parentElement.getElementsByTagName('h3').length > 0)
					content.style.display = 'none';
			   //document.getElementsByClassName('post-body entry-content')[0].remove();
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
						//this.style.color = '#00e4ff';
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
    var allThumbnails = document.body.getElementsByClassName("thumbnail");
    for (var i = 0; i < allThumbnails.length; i++) {
        var firstElement = allThumbnails[i].getElementsByClassName('thumbnail-initial')[0];
        if (firstElement == undefined) continue;
        var initialHeight = firstElement.offsetHeight;
        var popHeight = allThumbnails[i].getElementsByClassName('thumbnail-pop')[0].offsetHeight;
        allThumbnails[i].style.height = Math.max(initialHeight, popHeight) + 'px';
        if (popHeight - initialHeight > 50 || popHeight - initialHeight < -50)
            allThumbnails[i].style.height = initialHeight + 'px';
        var allThumbImages = allThumbnails[i].getElementsByTagName("img");
        for (j = 0; j < allThumbImages.length; j++) {
            allThumbImages[j].onclick = function() {
                switchThumbnails(closestClass(this, "thumbnail"));
            };
        }
    }
}

var closestClass = function(inputElement, targetClassName) {
    while (inputElement.className != targetClassName) {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function switchThumbnails(tn) {
    var tc = tn.getElementsByClassName("thumbnail-initial");
    var initialVisible = true;
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
        tn.style.height = (initialVisible ? initialHeight : popHeight) + 'px';

    return false;
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
    for (var p2 of images) {
        var imgWidth = p2.width;
        var imgHeight = p2.height;
        //process exclusion list
        if (imgWidth < 20 || imgHeight < 20) continue; //by image size
        if (p2.parentElement.tagName == "ABBR" || 
			p2.parentElement.parentElement.className == "popup" || 
			p2.parentElement.className == "anime-row") 
				continue; //by any class or tag name
        if (p2.id == "news-thumbnail" || 
			p2.parentElement.parentElement.parentElement.id == "anime-list")
				continue;
        if (p2.parentElement.className == "profile-box-img" || 
			p2.parentElement.parentElement.parentElement.className == "anime-year") 
				continue;
        //if(p2.parentElement.classList.contains("post-body")) continue;
        //end of process exclusion list
		
		//process based on parent
        if (p2.parentElement.tagName == "DIV" && !p2.parentElement.classList.contains("post") && !p2.parentElement.classList.contains("post-body") &&
            !p2.parentElement.classList.contains("post-outer")) {
            p2.parentElement.style.maxWidth = imgWidth + 'px';
            p2.parentElement.style.maxHeight = imgHeight + 'px';
        } else if ((p2.parentElement.parentElement.tagName == "TR" ||
                (p2.parentElement.parentElement.className == "separator" && p2.parentElement.parentElement.tagName != "TR")) &&
            !p2.parentElement.parentElement.classList.contains("post") && !p2.parentElement.parentElement.classList.contains("post-body") &&
            !p2.parentElement.parentElement.classList.contains("post-outer")
        ) {
            p2.parentElement.parentElement.style.maxWidth = imgWidth + 'px';
            p2.parentElement.parentElement.style.maxHeight = imgHeight + 'px';
            p2.parentElement.style.width = (100 / (p2.parentElement.parentElement.childElementCount)) + '%';
        } else if (!p2.parentElement.parentElement.parentElement.classList.contains("post") &&
            !p2.parentElement.parentElement.parentElement.classList.contains("post-body") &&
            !p2.parentElement.parentElement.parentElement.classList.contains("post-outer")) {
            p2.parentElement.parentElement.parentElement.style.maxWidth = imgWidth + 'px';
            p2.parentElement.parentElement.parentElement.style.maxHeight = imgHeight + 'px';
        }
		//end of process based on parent
		
		//process based on dimensions
        if (imgWidth >= imgHeight) //landscape
        {
            p2.removeAttribute("height");
            p2.removeAttribute("width");
            if (p2.parentElement.parentElement.tagName == "TR" && p2.parentElement.parentElement.getElementsByTagName("td").length > 1) //in table
                p2.style.width = '100%';
            else if (p2.parentElement.parentElement.parentElement.tagName == "TR" && p2.parentElement.parentElement.parentElement.getElementsByTagName("td").length > 1 && p2.parentElement.tagName == "A") //in table, with link
                p2.style.width = '100%';
            else if (p2.width >= window.innerWidth)
                p2.style.width = '100%';
            else if (p2.width <= imgWidth)
                p2.style.width = 'auto';
            else
                p2.style.width = imgWidth + 'px';
        } else //portrait
        {
            p2.removeAttribute("width");
            p2.removeAttribute("height");
            if (p2.parentElement.parentElement.tagName == "TR" && p2.parentElement.parentElement.getElementsByTagName("td").length > 1) //in table
                p2.style.width = '100%';
            else if (p2.parentElement.parentElement.parentElement.tagName == "TR" && p2.parentElement.parentElement.parentElement.getElementsByTagName("td").length > 1 && p2.parentElement.tagName == "A") //in table, with link
                p2.style.width = '100%';
            else if (p2.width >= window.innerWidth)
                p2.style.width = '100%';
            else if (p2.width >= imgWidth)
                p2.style.width = 'auto';
            else
                p2.style.width = imgWidth + 'px';
        }
		//end of process based on dimensions
		
		//separator special case
        if (p2.parentElement.className == "separator") {
            p2.parentElement.style.marginLeft = 'auto';
            p2.parentElement.style.marginRight = 'auto';
        }
        if (p2.parentElement.parentElement.className == "separator") {
            p2.parentElement.parentElement.style.marginLeft = 'auto';
            p2.parentElement.parentElement.style.marginRight = 'auto';
        }
		//end of separator special case
		
        if (p2.width >= document.getElementsByClassName("post-body")[0].offsetWidth && document.getElementsByClassName("post-body")[0].offsetWidth > 0) {
            p2.style.width = '100%';
        }
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

//to fix lightbox gallery not covering screen on Chrome mobile, run only once per refresh
function fixLightbox() {
	if(document.getElementById("Blog1") != null)
		document.getElementById("Blog1").addEventListener("click", cleanupLightbox);
}

function cleanupLightbox() {
    if (document.getElementsByTagName("body")[0].parentElement.className != "v2") {
        var browseContainer = document.getElementsByClassName("CSS_LIGHTBOX_PHOTO_BROWSE_CONTAINER")[0];
        var attributeContainerHolder = document.getElementsByClassName("CSS_LAYOUT_COMPONENT CSS_LIGHTBOX_ATTRIBUTION_INDEX_CONTAINER")[0].firstChild;
        attributeContainerHolder.firstChild.remove();
        attributeContainerHolder.firstChild.style.width = "100%";
        attributeContainerHolder.style.width = "100%";
        document.getElementsByClassName("CSS_LIGHTBOX_BG_MASK_TRANSPARENT")[0].style.height = "120%";
    }
	document.getElementById("Blog1").removeEventListener("click", cleanupLightbox);
}

//new popup element, based on content type
function addHoverForLinks() {
    for (let link of document.getElementsByClassName('post-body entry-content')[0].getElementsByTagName('a')) {
        link.addEventListener('mouseover', renderPopup);
    }
}

function addHoverOnExpander() {
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
    if (this.classList.contains('new-thumbnail'))
        this.classList.remove('new-thumbnail');
    else {
        for (let page of document.getElementsByClassName('post-body entry-content')) {
            for (let popup of page.getElementsByClassName('new-thumbnail')) {
                popup.classList.remove('new-thumbnail');
            }
        }
        this.classList.add('new-thumbnail');
    }
}

function renderPopup() {
    //if(link.childElementCount == 0)
    event.preventDefault();
    if (this.href.includes('blogspot.com') && this.childElementCount > 0) return; //exclusion for blogger
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
    focus.innerHTML = newContent;

    thumbnail.appendChild(initial);
    thumbnail.appendChild(focus);

    this.outerHTML = thumbnail.outerHTML;
    twttr.widgets.load(); //special case
    window.instgrm.Embeds.process(); //special case
    addHoverForPopups();
}

function generatePopupContent(url) {
    if (url.includes('.jpg')) {
        //process image
        return '<div class="separator"><img style="max-height: 360px; max-width: 100%;" src="' + url + '" /></div>';
    }
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="450" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: 660px; max-height: 360px; overflow: hidden; width: 100%;"></iframe>';
    }
    if (url.includes('twitter.com') && url.includes('/status/')) {
        //process twitter embed
        return '<blockquote class="twitter-tweet tw-align-center" data-cards="hidden" data-lang="en"><a href="' +
            url +
            '"></a></blockquote><script async="async" charset="utf-8" src="https://platform.twitter.com/widgets.js" >\</script\>';
    }
    if (url.includes('youtube.com') && url.includes('/watch')) {
        //process youtube embed
        let id = url.substring(url.indexOf('?v=') + 3);
        return '<iframe allow="autoplay; encrypted-media" allowfullscreen="" frameborder="0" style="max-height: 360px;" src="' +
            'https://www.youtube.com/embed/' + id +
            '"></iframe>';
    }
    if (url.includes('instagram.com')) {
        //process instagram embed
        return '<center><blockquote class="instagram-media" data-instgrm-permalink="' +
            url + '" data-instgrm-version="13" style="max-width:540px; min-width:326px; padding:0; width:100%;"></blockquote></center><script async="async" src="//www.instagram.com/embed.js">\</script\>';
    }
    return null;
}

//floating action button events
function toggleSearch() {
    goToTop();
    var barDisp = document.getElementById('CustomBlogSearch').style.display;
    if (barDisp == 'none' || barDisp == '')
        document.getElementById('CustomBlogSearch').style.display = 'block';
    else
        document.getElementById('CustomBlogSearch').style.display = 'none';
}

function toggleSidebar() {
    let outer = document.getElementsByClassName('main-inner')[0].getElementsByClassName('column-left-outer')[0];
    if (document.getElementById('sidebarOverlay') == undefined) {
        let sidebarOverlay = document.createElement('div');
        sidebarOverlay.id = 'sidebarOverlay';
        sidebarOverlay.style.display = 'none';
        sidebarOverlay.style.backgroundColor = 'black';
        sidebarOverlay.style.position = 'fixed';
        sidebarOverlay.style.opacity = 0.5;
        sidebarOverlay.style.width = '100%';
        sidebarOverlay.style.height = '120%';
        sidebarOverlay.style.bottom = 0;
        sidebarOverlay.style.top = 0;
        sidebarOverlay.style.left = 0;
        sidebarOverlay.style.zIndex = 8;
        outer.parentElement.appendChild(sidebarOverlay);
    }
    document.getElementById('sidebarOverlay').style.display = document.getElementById('sidebarOverlay').style.display == 'none' ? '' : 'none';
    document.getElementById('SidebarBtn').getElementsByTagName('i')[0].innerText = document.getElementById('SidebarBtn').getElementsByTagName('i')[0].innerText == 'menu' ? 'menu_open' : 'menu';
    let aside = outer.getElementsByClassName('column-left-inner')[0].getElementsByTagName('aside')[0];
    outer.style.position = outer.style.position == '' ? 'fixed' : '';
    let iconLeft = window.innerWidth >= 780 ? '5px' : '0';
    outer.style.left = outer.style.left == '' ? iconLeft : '';
    let iconBottom = window.innerWidth >= 780 ? '78px' : '60px';
    outer.style.bottom = outer.style.bottom == '' ? iconBottom : '';
    outer.style.margin = outer.style.margin == '' ? 'auto' : '';
    outer.style.zIndex = outer.style.zIndex != 9 ? 9 : '';
    aside.style.display = aside.style.display == '' ? 'block' : '';
    if (window.innerHeight <= 480) document.getElementById('LinkList1').style.display = document.getElementById('LinkList1').style.display == '' ? 'none' : '';
    if (window.innerHeight <= 960) document.getElementById('BlogArchive1').style.display = document.getElementById('BlogArchive1').style.display == '' ? 'none' : '';
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
