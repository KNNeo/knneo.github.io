window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
window['urls'] = [];
window['search-results'] = [];
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

function showSearch() {
	let searchContainer = document.createElement('div');
	
	let search = document.createElement('input');
	search.classList.add('search-input');
	search.style.fontSize = '1em';
	search.setAttribute('onkeyup', 'onSearchKeyUp()');
	searchContainer.appendChild(search);
	
	let closeBtn = document.createElement('button');
	closeBtn.innerText = 'Close';
	closeBtn.style.fontSize = '1em';
	closeBtn.setAttribute('onclick', 'removeDialog()');
	searchContainer.appendChild(closeBtn);
	
	let results = document.createElement('div');
	results.classList.add('input-result');
	searchContainer.appendChild(results);
	
	popupText(searchContainer);
}

function onSearchKeyUp() {
	// console.log(event.keyCode);
	if (event.keyCode === 13) // "Enter" key
	{
		let inputVal = event.target.value.toLowerCase();
		let indexesKeys = Object.keys(searchIndex.indexes).filter(k => inputVal.toLowerCase().split(' ').includes(k));
		// console.log(indexesKeys);
		let postIdLists = [];
		let postIds = [];
		if(indexesKeys.length > 0) {
			for(let key of indexesKeys)
			{
				let list = searchIndex.indexes[key];
				// console.log(list);				
				postIdLists.push(list);
			}
		}
		
		// console.log(postIdLists);
		for(let sublist of postIdLists)
		{
			for(let value of sublist)
			{
				// console.log(value);
				if(postIdLists.filter(l => l.includes(value)).length == indexesKeys.length)
					postIds.push(value);
			}
		}
		
		// console.log(postIds);
		window['search-results'] = searchIndex.posts.filter((current, index, arr) => postIds.includes(index));
		showResults(window['search-results'].length > 10 ? window['search-results'].slice(0,10) : window['search-results']);

		let resultTally = document.createElement('div');
		if(window['search-results'].length > 10)
			resultTally.innerText = (window['search-results'].length - 10) + ' more results';
		else if(window['search-results'].length < 1)
			resultTally.innerText = 'No results';
		else
			resultTally.innerText = window['search-results'].length + ' results';
		document.querySelector('.input-result').appendChild(resultTally);
	}
	if (event.keyCode === 27) // "Escape" key
	{
		document.querySelector('.input-result').innerHTML = '';
		event.target.value = '';
	}
}

function showResults(posts) {
	document.querySelector('.input-result').innerHTML = '';
	for(let post of posts)
	{
		let resultDiv = document.createElement('div');
		resultDiv.classList.add('post');
		
		let publishSpan = document.createElement('span');
		publishSpan.classList.add('publish');
		publishSpan.innerText = post.date + ' ';
		resultDiv.appendChild(publishSpan);
		
		let resultUrl = document.createElement('a');
		resultUrl.href = post.url;
		resultUrl.innerText = post.title;
		resultDiv.appendChild(resultUrl);
		
		document.querySelector('.input-result').appendChild(resultDiv);
	}
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
		toggleActions(['.fab.thumb-design', '.fab.search', '.fab.dark-mode'], '.action-menu.bottom-right');
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

////DIALOG////
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null)
	{
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
	if(typeof node == 'object')
	{
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	// dialog.addEventListener('click', function() {
		// this.remove();
	// });
	dialog.addEventListener('keyup', function() {
		// event.preventDefault();
	});
	return dialog;
}

function removeDialog() {
	if(event) event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv != null)
	{
		dialogDiv.remove();
	}	
}