// Single onLoad event control: put all functions in sequence
window.addEventListener('load', preLoadSequence);

function preLoadSequence() {
	addSearchBar();
	addMetadata();
	if(typeof reduceResults == 'function') reduceResults();
	if(typeof fixLabelResults == 'function') fixLabelResults();
	if(typeof fixPageNavigation == 'function') fixPageNavigation();
	if(typeof fixNavigationResults == 'function') fixNavigationResults();
	if(typeof addLabelForNavigation == 'function') addLabelForNavigation();
	if(typeof addFloatingActionButtons == 'function') addFloatingActionButtons();
	if(typeof fixLightbox == 'function') fixLightbox();

	// Global Window Events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	window.addEventListener('popstate', windowOnHistoryChange);
	
	// Global Asynchronous Events
	setTimeout(addHashtags, 0); // generateHeader, generateReadTime
	setTimeout(resizeImages, 0);
	setTimeout(displayFAB, 0);
	setTimeout(setExpander, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(renderLabelIcon, 0);
	setTimeout(scrollToSectionByUrl, 200);
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

// collapse search results from full post views
function reduceResults() {
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
				content.style.display = 'none'; // permanently hide
		}
		// change footer to horizontal rule
		for (let footer of document.querySelectorAll('.post-footer-line-2'))
			footer.innerHTML = '<hr>';
		// add button to expand/collapse
		// for (let titleBar of document.getElementsByClassName('post-title entry-title'))
			// titleBar.innerHTML = '<table><tbody><tr><td><div class="search-expander"><i class="material-icons">unfold_less</i></div></td><td>' + titleBar.innerHTML + '</td></tr></tbody></table>';
		// add click logic for expand/collapse
		// for (let i = 0; i < document.getElementsByClassName('post-title entry-title').length; i++) {
			// document.getElementsByClassName('search-expander')[i].addEventListener("click", function() {
				// let titleBar = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
				// if (titleBar.getElementsByClassName('entry-content')[0].style.display == 'none') {
					// titleBar.getElementsByClassName('entry-content')[0].style.display = '';
					// this.getElementsByTagName('i')[0].innerText = 'unfold_more';
				// } else {
					// titleBar.getElementsByClassName('entry-content')[0].style.display = 'none';
					// this.style.color = 'white';
					// this.getElementsByTagName('i')[0].innerText = 'unfold_less';
				// }
				// setThumbnails();
			// });
		// }
		//fix table cell border depending on content type due to mix of post contents
		// for (let table of document.getElementsByTagName('td')) {
			// if (table.getElementsByTagName('img').length > 0 || table.className == 'tr-caption') {
				// table.style.border = 'none';
				// table.style.padding = '0';
			// }
		// }
	}
}

// Fix search results to return 5 results instead of 1
function fixLabelResults() {
	if(document.getElementById("Label1") == undefined) return;
    for (let link of document.getElementById("Label1").getElementsByTagName("a"))
        link.href = link.href += link.href.includes("?") ? "&max-results=5" : "?max-results=5";
}

// Convert text to icon for footer next previous posts
function fixPageNavigation() {
    if (document.getElementById("blog-pager-newer-link") != null)
		document.getElementById("blog-pager-newer-link").getElementsByTagName("a")[0].innerHTML = 
		"<i class='material-icons latest-post' style='padding:0;'>arrow_back</i>";
    if (document.getElementById("blog-pager-older-link") != null)
		document.getElementById("blog-pager-older-link").getElementsByTagName("a")[0].innerHTML = 
		"<i class='material-icons latest-post' style='padding:0;'>arrow_forward</i>";
	if (document.getElementsByClassName('home-link').length > 0)
		document.getElementsByClassName('home-link')[0].classList.add('display-none');	
}

// Fix number of pages to display on older and newer links
function fixNavigationResults() {
    if (document.getElementsByClassName('blog-pager-older-link').length > 0) {
        let pagerLink = document.getElementsByClassName('blog-pager-older-link')[0].href;
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
        let browseContainer = document.getElementsByClassName("CSS_LIGHTBOX_PHOTO_BROWSE_CONTAINER")[0];
        let attributeContainerHolder = document.getElementsByClassName("CSS_LAYOUT_COMPONENT CSS_LIGHTBOX_ATTRIBUTION_INDEX_CONTAINER")[0].firstChild;
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
    let barDisp = document.getElementById('CustomBlogSearch').style.display;
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
    if(document.querySelector('.overlay') != null)
		hideOverlay();
	else
		showOverlay();
	
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

function toggleDisplay(element, defaultValue) {
	return element.style.display == '' ? defaultValue : '';
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
