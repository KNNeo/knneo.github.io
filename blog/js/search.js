window['search-size'] = 10;
window['search-page'] = 0;

function showSearch() {
	let searchContainer = document.createElement('div');
	
	let search = document.createElement('input');
	search.classList.add('search-input');
	search.style.fontSize = '1em';
	search.setAttribute('onkeyup', 'onSearchKeyUp()');
	searchContainer.appendChild(search);
	
	let nextBtn = document.createElement('button');
	nextBtn.classList.add('search-next');
	nextBtn.innerText = 'Next';
	nextBtn.style.fontSize = '1em';
	nextBtn.setAttribute('onclick', 'removeDialog()');
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

function onSearchKeyUp() {
	// console.log(event.keyCode);
	if (event.key === 'Enter') // "Enter" key
	{
		onSearch(event.target.value);
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

function onSearch(val) {
	let inputVal = val.toLowerCase();
	let indexesKeys = Object.keys(searchIndex.indexes).filter(k => inputVal.toLowerCase().split(' ').includes(k));
	// create lists of relevant keywords
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
	
	// filter keywords if appear in all lists
	for(let sublist of postIdLists)
	{
		for(let value of sublist)
		{
			// console.log(value);
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
	document.querySelector('.input-result').innerHTML = '';
	
	// render result page 1
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
		resultTally.innerText = ((window['search-results'].length % window['search-size'])) + ' results';
	document.querySelector('.input-result').appendChild(resultTally);
}

function showNextResults() {
	window['search-page']++;
	showResults(window['search-results'].length > window['search-page']*window['search-size'] 
			? window['search-results'].slice(window['search-page']*window['search-size'], (1+window['search-page'])*window['search-size'])
			: window['search-results'].slice(window['search-page']*window['search-size']));
}