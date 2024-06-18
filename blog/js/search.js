window['search-size'] = 10;
window['search-page'] = 0;

function showSearch() {
	let searchContainer = document.createElement('div');
	
	let search = document.createElement('input');
	search.classList.add('search-input');
	search.style.fontSize = '1em';
	search.title = 'Search by word, date in "yyyy" or "MM" or "dd"';
	search.setAttribute('onkeyup', 'onSearchKeyUp()');
	searchContainer.appendChild(search);
	
	let nextBtn = document.createElement('button');
	nextBtn.classList.add('search-next');
	nextBtn.innerText = 'Next';
	nextBtn.style.fontSize = '1em';
	nextBtn.setAttribute('onclick', 'onSearch()');
	searchContainer.appendChild(nextBtn);
	
	let closeBtn = document.createElement('button');
	closeBtn.innerText = 'Close';
	closeBtn.style.fontSize = '1em';
	closeBtn.setAttribute('onclick', 'removeDialog()');
	searchContainer.appendChild(closeBtn);
	
	let results = document.createElement('div');
	results.classList.add('input-result');
	searchContainer.appendChild(results);
	
	popupText(searchContainer);
	document.body.setAttribute('onkeydown', 'onSearchKeyDown()');
}

function onSearch() {
	// check if search index data has been loaded
	if(document.querySelector('#search-index') == null)
		loadScript(searchBlog);
	else
		searchBlog();
}

function onSearchKeyUp() {
	// console.log(event.keyCode);
	if (event.key === 'Enter') // "Enter" key
	{
		onSearch();
		event.target.blur();
	}
	if (event.key === 'Escape') // "Escape" key
	{
		document.querySelector('.input-result').innerHTML = '';
		event.target.value = '';
	}
	if (window['ctrled'] && event.key.toLowerCase === 'a') // "Ctrl+A" keys
	{
		document.querySelector('.search-input')?.focus();
		document.querySelector('.search-input')?.select();
	}
}

function onSearchKeyDown() {
	// console.log(event.keyCode);
	// ctrl: combine with a to select all
	if (event.key === 'Control') {
		event.preventDefault();
		window['ctrled'] = true;
	}
	return false;
}

function searchBlog() {
	// find post ids from input
	let inputVal = document.querySelector('.search-input').value.toLowerCase();
	window['search-input'] = encodeURIComponent(inputVal);
	let indexesKeys = Object.keys(searchIndex.indexes).filter(k => inputVal.toLowerCase().split(' ').includes(k));
	// create lists of relevant keywords
	let postIdLists = [];
	let postIds = [];
	if(indexesKeys.length > 0) {
		for(let key of indexesKeys)	{
			let list = searchIndex.indexes[key];
			postIdLists.push(list);
		}
	}
	
	// filter keywords if appear in all lists
	for(let sublist of postIdLists)	{
		for(let value of sublist) {
			if(postIdLists.filter(l => l.includes(value)).length == indexesKeys.length)
				postIds.push(value);
		}
	}
	
	// update global variable & results div
	window['search-results'] = searchIndex.posts.filter((current, index, arr) => current.date && current.title && postIds.includes(current.id));
	window['search-page'] = 0;
	showResults(window['search-results'].length > window['search-size'] ? window['search-results'].slice(0,window['search-size']) : window['search-results']);
}

function showResults(posts) {
	let result = document.querySelector('.input-result');
	result.innerHTML = '';
	
	// render result page 1
	for(let post of posts) {
		let resultDiv = document.createElement('div');
		resultDiv.classList.add('post');
		
		let publishSpan = document.createElement('span');
		publishSpan.classList.add('publish');
		publishSpan.innerText = post.date + ' ';
		resultDiv.appendChild(publishSpan);
		
		let resultUrl = document.createElement('a');
		resultUrl.href = processLinkExtensions(post.url.replace(window.location.href.includes('knneo.github.io') ? '../' : '__', '../blog/')) + '#:~:text=' + window['search-input'];
		resultUrl.innerText = post.title;
		resultDiv.appendChild(resultUrl);
		
		result.appendChild(resultDiv);
	}
	
	// show more results if not at end
	if(window['search-results'].length > (1+window['search-page'])*window['search-size'])
		document.querySelector('.search-next').setAttribute('onclick', 'showNextResults()');
	
	// show remaining results
	let resultTally = document.createElement('div');
	if(window['search-results'].length > (1+window['search-page'])*window['search-size'])
		resultTally.innerText = '+ ' + (window['search-results'].length - (1+window['search-page'])*window['search-size']) + ' more results';
	else if(window['search-results'].length < 1)
		resultTally.innerText = 'No results';
	else
		resultTally.innerText = 'End of results';
	result.appendChild(resultTally);
}

function showNextResults() {
	window['search-page']++;
	showResults(window['search-results'].length > window['search-page']*window['search-size'] 
			? window['search-results'].slice(window['search-page']*window['search-size'], (1+window['search-page'])*window['search-size'])
			: window['search-results'].slice(window['search-page']*window['search-size']));
}

function loadScript(callback) {
	let indexScript = document.createElement('script');
	indexScript.id = 'search-index';
	indexScript.src = 'js/searchIndex.js';
	indexScript.type = 'application/javascript';
	indexScript.charset = 'utf-8';
	indexScript.onreadystatechange = function() { callback(); };
    indexScript.onload = function() { callback(); };
	document.head.appendChild(indexScript);
}
