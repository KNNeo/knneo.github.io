const list = document.querySelector('.contents');
const counter = document.querySelector('.counter');
const callback = (entries, observer) => {
	entries.forEach((elem) => {
		elem.target.classList.add('tile-view');
		let thumbnail = elem.target.querySelector('img');
		thumbnail.src = thumbnail.getAttribute('data-image');
	});
};
const observer = new IntersectionObserver(callback, {
	root: document.querySelector('.contents'),
	rootMargin: '10px',
	threshold: 0,
});

function unique(current, index, all) {
  return all.map(a => a.imgUrl).indexOf(current.imgUrl) === index;
}

function onFilterKeyUp() {
	// console.log(event.keyCode);
	// "Enter" key
	if (event.keyCode === 13) {
		window['filter'] = event.target.value.toLowerCase().replace('*','');
		event.target.blur();
		generateArchive();
	}
	// "Escape" key
	if (event.keyCode === 27) {
		window['filter'] = '';
		event.target.value = '';
		generateArchive();
	}
}

function generateArchive() {
	if(typeof imageIndex == 'object') {
		list.innerHTML = '';
		for(let post of imageIndex.posts.slice(0, 3))
			window['id'] = generateArchiveGroup(post, window['id']);
		removeLinkExtensions();
	}
}

function generateArchiveGroup(post, check) {
	if(check != post.id) {
		let titleContainer = document.createElement('a');
		titleContainer.classList.add('title');
		titleContainer.href = post.url;
		
		let titleDiv = document.createElement('h4');
		titleDiv.innerText = post.title;				
		titleContainer.appendChild(titleDiv);	
		
		list.appendChild(titleContainer);
	}
	
	for(let item of imageIndex.images.filter(m => m.id == post.id))
	{
		let imageDiv = document.createElement('div');
		imageDiv.classList.add('tile');
		
			let imageSpan = document.createElement('img');
			imageSpan.classList.add('tile-image');
			imageSpan.title = getImageFilename(item.url);
			imageSpan.setAttribute('loading', 'lazy');
			imageSpan.setAttribute('data-image', item.url);
			imageSpan.addEventListener('click', function() {
				for(let fit of document.querySelectorAll('.fit')) {
					if(fit != event.target.parentElement)
						fit.classList.remove('fit');
				}
				event.target.parentElement.classList.toggle('fit');
				event.target.src = event.target.src.replace('/s320/', '/s640/');
			});
			imageSpan.addEventListener('load', function() {
				if(!event.target.classList.contains('loaded'))
					counter.innerText = 1 + parseInt(counter.innerText);
				event.target.classList.add('loaded');
			});
			
			imageDiv.appendChild(imageSpan);
		
		list.appendChild(imageDiv);
		observer.observe(imageDiv);
	}
	
	return post.id;
}

function generateNext() {
	for(let post of imageIndex.posts.slice(window['id'], window['id'] + 3))
		window['id'] = generateArchiveGroup(post, window['id']);
	removeLinkExtensions();
}

//get filename from image url
function getImageFilename(url) {
	return url.substring(url.lastIndexOf('/') + 1);
}

//add back button to each page
function goBack() {
	window.history.back();
}

// remove .html extensions, facilitate static site routing
function removeLinkExtensions() {
	if(!window.location.href.startsWith('file:///')) {
		for(let a of document.querySelectorAll('a')) {
			if(a.href.includes('knneo.github.io') || a.href.includes('knwebreports'))
				a.href = a.href.replace('index.html', '').replace('.html', '');
		}
	}
}