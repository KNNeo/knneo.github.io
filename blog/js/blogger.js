function preloadSequence() {
	if(typeof addSearchBar == 'function') addSearchBar();
	if(typeof addMetadata == 'function') addMetadata();
	if(typeof reduceResults == 'function') reduceResults();
	if(typeof fixLabelResults == 'function') fixLabelResults();
	if(typeof fixNavigationResults == 'function') fixNavigationResults();
	if(typeof addLabelForNavigation == 'function') addLabelForNavigation();
	if(typeof addFloatingActionButtons == 'function') addFloatingActionButtons();
	if(typeof fixLightbox == 'function') fixLightbox();

	//open body if no other fixes
	document.body.style.display = 'block';
}

function addFloatingActionButtons() {
	let [bottomLeftMenu, bottomRightMenu] = addMenus();
	if(navigator.share) addButton(['fab', 'share'], 'Share This Page', 'share', sharePage, bottomRightMenu);
	addButton(['fab', 'search'], 'Search This Blog', 'search', toggleSearch, bottomRightMenu);
	addButton(['fab', 'top'], 'Go To Top', 'arrow_upward', goToTop, bottomRightMenu);
	addButton(['fab', 'sidebar'], 'Toggle Menu', 'menu', toggleSidebar, bottomLeftMenu);
	addButton(['fab', 'close', 'hidden'], 'Close Menu', 'menu_open', toggleSidebar, document.querySelector('.column-left-inner'));
}

function addMenus() {
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

function addSearchBar() {
	let search = document.createElement('div');
	search.id = 'CustomBlogSearch';
	search.innerHTML = '<div class="widget-content"><div id="_form"><form action="' + window.location.origin + '/search" class="gsc-search-box" target="_top"><div cellpadding="0" cellspacing="0" class="gsc-search-box"><div><div><span class="gsc-input"><input id="BlogSearch" autocomplete="off" class="gsc-input" name="q" size="10" title="search" type="text" value=""></span><span class="gsc-search-button" style="display: none;"><input class="gsc-search-button" name="max-results" title="search" type="submit" value="5"></span></div></div></div></form></div></div>';
	
	if(document.getElementById('CustomBlogSearch') != null) document.getElementById('CustomBlogSearch').remove();
	if(document.getElementsByClassName('header-outer').length > 0)
		document.getElementsByClassName('header-outer')[0].appendChild(search);
}

function addMetadata() {	
	let viewport = document.createElement('meta');
	viewport.setAttribute('name','viewport');
	viewport.setAttribute('content','width=device-width,initial-scale=1.0');
	document.head.appendChild(viewport);
}

// For search, collapse all results
function reduceResults() {
	//Exceptions in order: single posts, previews, pages, linqpad
    if ((window.location.href.includes(window.location.origin + '/20') && window.location.href.includes('.html')) || 
		window.location.href.includes(window.location.origin + '/b/blog-preview') || 
		window.location.href.includes(window.location.origin + '/p/'))
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

	if(!window.location.href.includes('The%20Statement')) // if not statement labels
	{
		let columnCenterInner = document.getElementsByClassName('column-center-inner')[0];
		columnCenterInner.classList.add('homepage-column-center-inner');
		
		if(document.getElementById('hashtags') != undefined)
			document.getElementById('hashtags').parentElement.removeChild(document.getElementById('hashtags'));
		let posts = document.getElementsByClassName('post');
		let counter = 0;
		for (var post of posts)
		{
			//definition and preprocessing
			let footer = post.getElementsByClassName('post-footer')[0];
			if(footer) footer.parentElement.removeChild(footer);
			let title = post.getElementsByClassName('post-title')[0];
			let link = title != undefined ? title.getElementsByTagName('a')[0] : undefined;
			let snippet = post.getElementsByClassName('post-body')[0];
			for(let styleDiv of snippet.getElementsByTagName('style'))
			{
				styleDiv.parentElement.removeChild(styleDiv); //remove style
			}
			let statement = snippet.getElementsByTagName('b');
			let thumb = snippet.getElementsByClassName('post-thumbnail');
			if(thumb.length > 0)
				thumb = snippet.getElementsByClassName('post-thumbnail')[0].getAttribute('data-src');
			else if (snippet.getElementsByTagName('img').length > 0)
				thumb = snippet.getElementsByTagName('img')[0].src;
			
			//generate thumb
			let latestPost = document.createElement('div');
			latestPost.classList.add('latest-post');
							
			let innerPostLink = document.createElement('a');
			innerPostLink.href = link?.href ?? '/search/label/The%20Statement?max-results=5';
			
			let latestPostThumb = document.createElement('div');
			// latestPostThumb.style.position = 'relative';
			
			if(thumb.length > 0)
			{
				let homeThumb = document.createElement('img');
				homeThumb.classList.add('latest-post-thumb');
				homeThumb.style.width = '150px';
				homeThumb.style.height = '150px';
				homeThumb.src = thumb;
				latestPostThumb.appendChild(homeThumb);
			}
			
			let tags = post.querySelectorAll(".post-body [id]:not(#hashtags):not(#news-thumbnail):not(.twitter-tweet iframe[id]):not(#table):not(#music):not(.list):not(audio):not(video):not(object)");
			if(false && link?.href && tags.length > 0)
			{
				let tagsDiv = document.createElement('div');
				tagsDiv.classList.add('anchors');
				
				for(let tag of tags)
				{
					let tagDiv = document.createElement('a');
					tagDiv.innerText = '#' + tag.id;
					tagDiv.href = link?.href + tagDiv.innerText;
					tagsDiv.appendChild(tagDiv);
				}
				
				latestPostThumb.appendChild(tagsDiv);
			}
			
			let latestPostTitle = document.createElement('h3');
			latestPostTitle.classList.add(title == undefined ? 'latest-post-statement' : 'latest-post-title');
			latestPostTitle.classList.add('post-title');
			latestPostTitle.innerText = title?.getElementsByTagName('a')[0]?.innerText ?? statement[0].innerText;
			
			let latestPostSummary = document.createElement('div');
			latestPostSummary.classList.add('summary');
			let excerpt = snippet.innerText.trim();
			latestPostSummary.innerHTML = (title == undefined ? '' : excerpt.substring(0, excerpt.substring(280, 350).indexOf(' ') + 280).trim() + '...');
			
			let outerWrapper = document.createElement('div');
			outerWrapper.classList.add('outer');
			if(link != undefined && thumb != undefined) outerWrapper.appendChild(latestPostThumb);
			
			let innerWrapper = document.createElement('div');
			innerWrapper.classList.add('inner');
			innerWrapper.appendChild(latestPostTitle);
			if(title != undefined) innerWrapper.appendChild(latestPostSummary);
			
			outerWrapper.appendChild(innerWrapper);
			innerPostLink.appendChild(outerWrapper);
			
			post.innerHTML = '';
			latestPost.appendChild(innerPostLink);
			post.appendChild(latestPost);
			
			counter++;
		}
	}
	else // show all content
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

// Others, Blogger Only
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
	let collapseSidebarWidth = window.innerWidth < 780;
	let collapseSidebarLinks = window.innerHeight <= 640;
	let collapseSidebarArchive = window.innerHeight <= 960;
	
	// toggle body overlay
    toggleOverlay(true);
	
	// left sidebar element
    let outer = document.getElementsByClassName('column-left-outer')[0];
	outer.style.position = toggleDisplay(outer, 'fixed');
	
	let menuStatus = document.querySelector('.fab.sidebar');
	menuStatus.innerText = menuStatus.innerText == 'menu' ? 'menu_open' : 'menu';
	
    let iconLeft = collapseSidebarWidth ? '0' : '5px';
    outer.style.left = outer.style.left == '' ? iconLeft : '';
	
    let iconBottom = '4px';
    outer.style.bottom = outer.style.bottom == '' ? iconBottom : '';
    outer.style.margin = outer.style.margin == '' ? 'auto' : '';
    outer.style.zIndex = outer.style.zIndex != 9 ? 9 : '';
	
    let aside = outer.getElementsByTagName('aside')[0];
    aside.style.display = toggleDisplay(aside, 'block');
	
	document.querySelector('.fab.close')?.classList.toggle('hidden');
    if (collapseSidebarLinks)
		document.getElementById('LinkList1').style.display = toggleDisplay(document.getElementById('LinkList1'), 'none');
    if (collapseSidebarArchive)
		document.getElementById('BlogArchive1').style.display = toggleDisplay(document.getElementById('BlogArchive1'), 'none');
}

function fixExternalFrame(thumbnail) {
	if(!isBlogger()) return;
	//fix iframes in thumbnails that don't fit content width
	if(thumbnail.getElementsByTagName('iframe').length > 0) {
		let thumbnailTable = thumbnail.closest('table');
		if (thumbnailTable != null && thumbnailTable != thumbnail)
			thumbnailTable.style.width = '100%';
	}
}
