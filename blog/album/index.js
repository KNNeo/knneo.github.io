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
	if(typeof mosaicArray == 'object') {
		list.innerHTML = '';		
		let title = '';
		let filterArray = mosaicArray
			.filter(unique)
			.filter(m => getImageFilename(m.imgUrl).toLowerCase().includes(window['filter'] || ''));
		for(let mosaic of filterArray)
			title = generateArchiveGroup(mosaic, title);
	}
}

function generateArchiveGroup(mosaic, check) {
	if(check != mosaic.title) {
		let titleContainer = document.createElement('a');
		titleContainer.classList.add('title');
		titleContainer.href = mosaic.titleUrl;
		
		let titleDiv = document.createElement('h4');
		titleDiv.innerText = mosaic.title;				
		titleContainer.appendChild(titleDiv);	
		
		list.appendChild(titleContainer);
	}

	let imageDiv = document.createElement('div');
	imageDiv.classList.add('tile');
	
		let imageSpan = document.createElement('img');
		imageSpan.classList.add('tile-image');
		imageSpan.title = getImageFilename(mosaic.imgUrl);
		imageSpan.setAttribute('loading', 'lazy');
		imageSpan.setAttribute('data-image', mosaic.imgUrl);
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
	
	return mosaic.title;
}

//get filename from image url
function getImageFilename(url) {
	return url.substring(url.lastIndexOf('/') + 1);
}

//add back button to each page
function goBack() {
	window.history.back();
}
