window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
window['urls'] = [];
window.addEventListener('scroll', toggleActionsOnScroll);
window.addEventListener('hashchange', filterByTag);

function filterByTag() {
	let tag = event.target.id || window.location.hash.replace('#','');
	let isAll = tag == 'All' || tag == '';
	window.location.hash = !isAll ? '#' + tag : '';
	
	let filters = document.querySelector('.post-tags.filters');
	for(let filter of (filters.querySelectorAll('a') ?? []))
	{
		let hide = !filter.href.endsWith('#All') && !isAll && !filter.href.endsWith('#' + tag);
		if(hide)
			filter.classList.add('hidden');
		else
			filter.classList.remove('hidden');
	}

	if(isAll)
		document.querySelector('a[href="#All"]')?.classList.add('hidden');
	else
		document.querySelector('a[href="#All"]')?.classList.remove('hidden');
	
	for(let post of (document.querySelectorAll('.post') ?? []))
	{
		let tags = post.getAttribute('data-tags')?.split(',') || [];
		let hide = !isAll && !tags.includes(tag) && !post.querySelector('.publish')?.innerText.startsWith(tag);
		if(hide)
			post.classList.add('hidden');
		else
			post.classList.remove('hidden');
	}
	let posts = document.querySelectorAll('.post:not(.hidden)');
	if(posts.length == 0) window.location.hash = '#All';
	if(posts.length > 0)
		document.querySelector('.count').innerText = 'Showing ' + posts.length + ' published posts' + (isAll ? '' : ' (' + window.location.hash + ')');
	// goToTop();
}

function randomPost() {
	let urls = Array.from(document.querySelectorAll('.post:not(.hidden)')).map(p => p.querySelector('a').href);
	window.location.href = urls[Math.floor(Math.random() * urls.length)];
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function goBack() {
	window.location.href = '../index.html';
}

function goToIndex() {
	window.location.href = '../blogger-view/index.html';
}

function toggleThumbnailDesign() {
	event.target.style.transform = event.target.style.transform == '' ? 'rotateY(180deg)' : '';
	document.querySelector('.archive-list').classList.toggle('flip');
}

// Floating action button events
function toggleActionsOnScroll() {
	// position of buttons
	let pageDown = document.body.scrollTop > 0.3 * document.documentElement.clientHeight || 
	document.documentElement.scrollTop > 0.3 * document.documentElement.clientHeight;
	if (pageDown) {
		toggleActions('.fab.go-to-top', '.action-menu.bottom-right');
	}
	else {
		toggleActions('.fab.dark-mode', '.action-menu.bottom-right');
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
			elem.classList.remove('hidden');
		}
	}
	else if(typeof(showElements) == 'string') {
		showElements = document.querySelector(showElements);
		showElements.classList.remove('hidden');
	}
}
