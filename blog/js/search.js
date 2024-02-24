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
		window['search-results'] = searchIndex.posts.filter((current, index, arr) => postIds.includes(index));
		showResults(window['search-results'].length > 10 ? window['search-results'].slice(0,10) : window['search-results']);
		
		// add more results display
		let resultTally = document.createElement('div');
		if(window['search-results'].length > 10)
			resultTally.innerText = '+ ' + (window['search-results'].length - 10) + ' more results';
		else if(window['search-results'].length < 1)
			resultTally.innerText = 'No results';
		else
			resultTally.innerText = window['search-results'].length + ' results';
		document.querySelector('.input-result').appendChild(resultTally);
		
		event.target.blur();
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
