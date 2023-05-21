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

function preloadSequence() {
    //initial URL visit fix
    if (window.location.href.includes("/search/label/The%20Entertainment%20News"))
		document.getElementById("hashtags").remove();
	
	if(typeof addSearchBar == 'function') addSearchBar();
	if(typeof addMetadata == 'function') addMetadata();
	if(typeof reduceResults == 'function') reduceResults();
	if(typeof fixLabelResults == 'function') fixLabelResults();
	if(typeof fixNavigationResults == 'function') fixNavigationResults();
	if(typeof olderNewerTextToIcon == 'function') olderNewerTextToIcon();
	if(typeof addLabelForNavigation == 'function') addLabelForNavigation();
	if(typeof fixLightbox == 'function') fixLightbox();
	if(typeof addHoverOnExpander == 'function') addHoverOnExpander();

	//open body if no other fixes
	document.body.style.display = 'block';
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

	if(true) // all use thumbnail, no more reduced pages
	// if(!window.location.href.startsWith(window.location.origin + '/search') && 
		// !window.location.href.startsWith(window.location.origin + '/20'))
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
			if(snippet.getElementsByTagName('style').length > 0)
				snippet.removeChild(snippet.childNodes[0]); //remove style
			let statement = snippet.getElementsByTagName('b');
			let thumb = snippet.getElementsByClassName('post-thumbnail');
			if(thumb.length > 0) {
				thumb = snippet.getElementsByClassName('post-thumbnail')[0].getAttribute('data-src');
			}
			else if (snippet.getElementsByTagName('img').length > 0) {
				thumb = snippet.getElementsByTagName('img')[0].src;
			}
				
			//generate thumb
			let latestPost = document.createElement('div');
			latestPost.classList.add('latest-post');
							
			let innerPostLink = document.createElement('a');
			innerPostLink.href = link?.href ?? './search/label/The%20Statement';
			
			let latestPostTitle = document.createElement('h3');
			latestPostTitle.innerText = title?.getElementsByTagName('a')[0]?.innerText ?? statement[0].innerText;
			
			let thumbDiv = document.createElement('div');
			if(counter > 0) thumbDiv.style.float = 'left';
			
			if(thumb.length > 0)
			{
				let homeThumb = document.createElement('div');
				homeThumb.classList.add('home-thumb');
				if(counter == 0) {
					homeThumb.style.margin = '5px auto';
					homeThumb.style.width = '180px';
					homeThumb.style.height = '180px';
				}
				homeThumb.style.backgroundImage = 'url(\'' + (thumb || '') + '\')';
				
				thumbDiv.appendChild(homeThumb);
			}
			
			let latestPostSummary = document.createElement('div');
			if(thumb.length > 0)
				latestPostSummary.classList.add('latest-post-summary');
			let excerpt = snippet.innerText.trim();
			latestPostSummary.innerHTML = (title == undefined ? '' : excerpt.substring(0, excerpt.substring(380, 450).indexOf(' ') + 380) + '...');
			
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
			
			counter++;
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

function fixExternalFrame(thumbnail) {
	if(window.location.href.includes("knneo.github.io")) return;
	//fix iframes in thumbnails that don't fit content width
	if(thumbnail.getElementsByTagName('iframe').length > 0) {
		let thumbnailTable = closestTag(thumbnail, 'TABLE');
		if (thumbnailTable != thumbnail)
			thumbnailTable.style.width = '100%';
	}
}