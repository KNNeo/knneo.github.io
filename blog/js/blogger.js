// Single onLoad event control: put all functions in sequence
window.addEventListener('load', preLoadSequence);

function preLoadSequence() {
	// Window Events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	window.addEventListener('popstate', windowOnHistoryChange);	
	// Asynchronous Events
	setTimeout(addHashtags, 0); // generateHeader, generateReadTime
	setTimeout(resizeImages, 0);
	setTimeout(displayFAB, 0);
	setTimeout(setExpander, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(renderLabelIcon, 0);
	setTimeout(scrollToSectionByUrl, 200);
	// Blogger Fixes
	addSearchBar();
	addMetadata();
	reduceResults();
	fixLabelResults();
	fixPageNavigation();
	fixNavigationResults();
	fixLabelForNavigation();
	fixLightbox();
	addFloatingActionButtons();
	// Open body if all fixes cleared
	document.body.style.display = 'block';
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

function fixExternalFrame(thumbnail) {
	if(!isBlogger()) return;
	//fix iframes in thumbnails that don't fit content width
	if(thumbnail.getElementsByTagName('iframe').length > 0) {
		let thumbnailTable = thumbnail.closest('table');
		if (thumbnailTable != null && thumbnailTable != thumbnail)
			thumbnailTable.style.width = '100%';
	}
}
