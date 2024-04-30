window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
window['urls'] = [];
window['search-results'] = [];
window.addEventListener('load', addServiceWorker);
window.addEventListener('load', removeLinkExtensions);
window.addEventListener('load', hideDescription);
window.addEventListener('load', hideHomeButton);
window.addEventListener('scroll', toggleActionsOnScroll);
window.addEventListener('hashchange', filterByTag);

// service worker implementation
function addServiceWorker() {
	if (navigator && 'serviceWorker' in navigator) {
	  navigator.serviceWorker.register('sw.js', {
		  sync: {
			tags: [
			  { name: 'update-cache', maxPeriod: 60 }, // Update cache every minute
			],
		  },
		})
		.then(function(registration) {
			console.log('Service worker registered:', registration.scope);
		}, function(err) {
			console.log('Service worker registration failed:', err);
		});
	}
}

// remove .html extensions, facilitate static site routing
function removeLinkExtensions() {
	if(!window.location.href.startsWith('file:///')) {
		for(let a of document.querySelectorAll('a')) {
			if(a.href.includes('knneo.github.io') || a.href.includes('knwebreports'))
				a.href = a.href.replace('index.html', '').replace('.html', '/');
		}
	}
}

// hide description if hosted
function hideDescription() {
	if(!window.location.href.includes('knneo.github.io'))
		document.querySelector('.home-header h6')?.classList.add('hidden');
}

// hide home button if at root
function hideHomeButton() {
	if(window.location.pathname == '/')
		document.querySelector('.back')?.classList.add('hidden');
}

// when click on button tags, will filter by tag on each post
function filterByTag() {
	let tag = event.target.id || window.location.hash.replace('#','');
	let isAll = tag == 'All' || tag == '';
	// update browser location hash
	window.location.hash = isAll ? '' : '#' + tag;
	// update filter buttons
	for(let filter of document.querySelector('.post-tags.filters').querySelectorAll('a')) {
		if(filter.href.endsWith('#All') || !filter.href.endsWith('#' + tag))
			filter.classList.remove('selected');
		else
			filter.classList.add('selected');
	}
	// update post visibility
	for(let post of (document.querySelectorAll('.post') ?? [])) {
		let tags = post.getAttribute('data-tags')?.split(',') || [];
		if(isAll || tags.includes(tag))
			post.classList.remove('hidden');
		else
			post.classList.add('hidden');
	}
	// update post count
	let posts = document.querySelectorAll('.post:not(.hidden)');
	if(posts.length > 0)
		document.querySelector('.count').innerText = 'Showing ' + posts.length + ' published posts' + (isAll ? '' : ' (' + window.location.hash + ')');
}

// selects random post from filtered
function randomPost() {
	let urls = Array.from(document.querySelectorAll('.post:not(.hidden)')).map(p => p.querySelector('a').href);
	window.location.href = urls[Math.floor(Math.random() * urls.length)];
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function toggleThumbnailDesign() {
	event.target.innerText = event.target.innerText == 'checklist' ? 'checklist_rtl' : 'checklist';
	document.querySelector('.archive-list').classList.toggle('flip');
}

// Floating action button events
function toggleActionsOnScroll() {
	// position of buttons
	let pageDown = document.body.scrollTop > 0.3 * document.documentElement.clientHeight || 
	document.documentElement.scrollTop > 0.3 * document.documentElement.clientHeight;
	if (pageDown)
		toggleActions(['.fab.search', '.fab.top'], '.action-menu.bottom-right');
	else
		toggleActions(['.fab.thumb-design', '.fab.search', '.fab.theme'], '.action-menu.bottom-right');
}

function toggleActions(showElements, parentElement) {
	if(!showElements || !parentElement) return;
	if(typeof(parentElement) == 'string') parentElement = document.querySelector(parentElement);
	
	// hide all in parent element: assume has fab class children
	for(let fab of parentElement.querySelectorAll('.fab'))
		fab.classList.add('hidden');
	
	// show button(s) specified
	if(Array.isArray(showElements)) {
		for(let elem of showElements) {
			if(typeof(elem) == 'string') elem = document.querySelector(elem);
			if(elem) elem.classList.remove('hidden');
		}
	}
	else if(typeof(showElements) == 'string') {
		showElements = document.querySelector(showElements);
		if(showElements) showElements.classList.remove('hidden');
	}
}

////DIALOG////
function popupText(input) {
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
	// node in dialog will not have events!
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
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv != null)
		dialogDiv.remove();
}
