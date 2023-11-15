//--HELPERS--//
function scrollToItem(itemNo) {
	if(document.querySelectorAll('.gallery img').length > 0) {
		document.querySelectorAll('.gallery img')[itemNo || 0].scrollIntoView({
			inline: 'center', behavior: 'smooth'
		});
		window.variables.selected = itemNo || 0;
	}
}

function dupeCheck() {
	return window.variables.base.filter((obj, index) => {
	  return window.variables.base.findIndex((item, i) => item.filename === obj.filename && i !== index) > -1;
	});
}

//--CONSTANTS--//
// see data file, under data folder
const isFirefox = (/Firefox/i.test(navigator.userAgent));

//--DOM NODE REFERENCES--//
let titleDiv = document.querySelector('.title h2');
let subtitleDiv = document.querySelector('.subtitle');
let galleryDiv = document.querySelector('.gallery');
let overviewDiv = document.querySelector('.overview');
let noticeDiv = document.querySelector('.details .info');
let detailsDiv = document.querySelector('.details');
let filtersDiv = document.querySelector('.filters');
let settingsDiv = document.querySelector('.settings');
let progressDiv = document.querySelector('.progress');

//--DOM FUNCTIONS--//
function generateTagClouds() {
	let allTags = [];
	
	// dependent on list of filter containers in html
	for(let filter of document.querySelectorAll('.filters div'))
	{
		// generate unique tags
		let filterList = window.variables.items
		.map(i => i[filter.className])
		.reduce(function(total, current, index, arr) {
			if(!total.map(m => m.value).includes(current))
				total.push({
					value: current,
					category: filter.className,
					count: arr.filter(f => f == current).length
				});
			return total;
		}, [])
		.sort(function(a,b) {
			return b.count - a.count;
		});
		allTags = allTags.concat(filterList);
	}
	
	return allTags;
}

function generateOrientationValues() {
	for(let item of window.variables.items)
	{
		let itemDiv = document.querySelector('.gallery img[src="' + item.filename + '"]');
		item.orientation = (itemDiv?.naturalWidth >= itemDiv?.naturalHeight && window.variables.orientation.landscape) 
			|| (itemDiv?.naturalWidth < itemDiv?.naturalHeight && window.variables.orientation.portrait) 
			|| null;
	}
}

//--EVENT HANDLERS--//
function onKeyDown() {
	if (['PageUp','PageDown','End','Home','ArrowLeft','ArrowRight'].indexOf(event.key) >= 0)
		event.preventDefault();
	
	switch(event.key) {
	  case 'PageUp':
		galleryDiv.scrollTo(galleryDiv.scrollLeft-window.innerWidth*.9, 0);
		break;
	  case 'PageDown':
		galleryDiv.scrollTo(galleryDiv.scrollLeft+window.innerWidth*.9, 0);
		break;
	  case 'End':
		galleryDiv.lastElementChild.scrollIntoView({
			inline: 'center'
		});
		break;
	  case 'Home':
		galleryDiv.firstElementChild.scrollIntoView({
			inline: 'center'
		});
		break;
	  case 'ArrowLeft':
		if(window.variables.selected >= 0 && window.variables.selected - 1 >= 0)
			scrollToItem(--window.variables.selected);
		break;
	  case 'ArrowRight':
		if(window.variables.selected >= 0 && window.variables.selected + 1 < window.variables.base.length)
			scrollToItem(++window.variables.selected);
		break;
	  default:
		break;
	}
}

function onWheel() {
	event.preventDefault();
	let scrollDelta = isFirefox ? -event.detail*50 : event.wheelDelta;
	galleryDiv.scrollLeft -= scrollDelta;
}

function onMouseDown() {
	// console.log('onMouseDown');
	window.variables.touchY = event.offsetX;
	window.variables.touchX = event.offsetY;
	window.variables.mousedown = true;
}

function onMouseMove() {
	// console.log('onMouseMove');
	if(window.variables.mousedown)
	{
		let delta = 10;
		let swipeDown = event.offsetY - window.variables.touchY;
		let swipeUp = window.variables.touchY - event.offsetY;
		let swipeLeft = window.variables.touchX - event.offsetX;
		let swipeRight = event.offsetX - window.variables.touchX;
		// console.log(event.offsetX, event.offsetY);
		// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
		
		//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
		if(swipeLeft > delta) {
			// console.log('swipeLeft');
			if(window.variables.selected >= galleryDiv.childElementCount - 1)
				window.variables.selected = galleryDiv.childElementCount - 2;
			if(window.variables.selected < galleryDiv.childElementCount - 1) {
				document.querySelectorAll('.gallery img')[++window.variables.selected].scrollIntoView({
					inline: 'center'
				});
				window.variables.selected++;
			}
			return;
		}
		//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
		if(swipeRight > delta) {
			// console.log('swipeRight');
			if(window.variables.selected <= 0)
				window.variables.selected = 1;
			if(window.variables.selected > 0) {
				document.querySelectorAll('.gallery img')[--window.variables.selected].scrollIntoView({
					inline: 'center'
				});
				window.variables.selected--;
			}
			return;
		}
		//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
		if(swipeDown > delta) {
			// console.log('swipeDown');
			return;
		}
		//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
		if(swipeUp > delta) {
			// console.log('swipeUp');
			return;
		}
		
		window.variables.mousedown = false;
	}
}

function onMouseUp() {	
	window.variables.mousedown = false;
}

function onTouchStart() {
	window.variables.touchY = event.touches[0].clientY;
	window.variables.touchX = event.touches[0].clientX;
	window.variables.touchdown = new Date();
}

function onTouchMove() {
	event.preventDefault();
	// fast response: normal scroll
	if(window.variables.touchdown && Math.floor(new Date() - window.variables.touchdown) < 1000) {
		galleryDiv.scrollLeft += 0.5*(window.variables.touchX - event.touches[0].clientX);
		return;
	}
	
	let swipeDown = event.touches[0].clientY - window.variables.touchY;
	let swipeUp = window.variables.touchY - event.touches[0].clientY;
	let swipeLeft = window.variables.touchX - event.touches[0].clientX;
	let swipeRight = event.touches[0].clientX - window.variables.touchX;
	// console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	
	//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		// console.log('swipeLeft');
		if(window.variables.selected >= galleryDiv.childElementCount - 1)
			window.variables.selected = galleryDiv.childElementCount - 2;
		if(window.variables.selected < galleryDiv.childElementCount - 1) {
			document.querySelectorAll('.gallery img')[++window.variables.selected].scrollIntoView({
				inline: 'center'
			});
			window.variables.selected++;
		}
		return;
	}
	//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		// console.log('swipeRight');
		if(window.variables.selected <= 0)
			window.variables.selected = 1;
		if(window.variables.selected > 0) {
			document.querySelectorAll('.gallery img')[--window.variables.selected].scrollIntoView({
				inline: 'center'
			});
			window.variables.selected--;
		}
		return;
	}
	//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		// console.log('swipeDown');
		return;
	}
	//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		// console.log('swipeUp');
		return;
	}
}

function showDetails() {
	if(detailsDiv.classList.contains('hidden'))
		detailsDiv.classList.remove('hidden');
}

function hideDetails() {
	if(!detailsDiv.classList.contains('hidden'))
		detailsDiv.classList.add('hidden');	
}

function showFilters() {
	 // if no orientation mapped, create map; does not work if all items not loaded
	if(window.variables.items[0].orientation == null)
		generateOrientationValues();
	let allTags = generateTagClouds();
	renderFilters(allTags);
	
	if(filtersDiv.classList.contains('hidden'))
		filtersDiv.classList.remove('hidden');
}

function hideFilters() {
	if(!filtersDiv.classList.contains('hidden'))
		filtersDiv.classList.add('hidden');	
}

function resetFilters() {
	window.variables.base = window.variables.items;
	hideFilters();
	renderGallery();
}

function toggleAutoScroll() {
	if(window.variables.autoscroll.run) {
		clearInterval(window.variables.autoscroll.run);
		window.variables.autoscroll.run = null;
		event.target.innerText = 'pause';
	}
	else {
		window.variables.autoscroll.run = setInterval(scrollGallery, window.variables.autoscroll.timeout);
		event.target.innerText = 'play_arrow';
	}
}

function scrollGallery() {
	if(window.variables.autoscroll.run) {
		galleryDiv.scrollBy(window.variables.autoscroll.delta * (window.variables.autoscroll.direction == 'left' ? -1 : 1), 0);
		if(window.variables.autoscroll.direction == 'right' && galleryDiv.scrollLeft + window.innerWidth >= galleryDiv.scrollWidth)
			galleryDiv.scrollTo(0, 0);
		if(window.variables.autoscroll.direction == 'left' && galleryDiv.scrollLeft <= 0)
			galleryDiv.scrollTo(galleryDiv.scrollWidth, 0);
		if(window.variables.autoscroll.direction == 'next' && window.variables.selected + window.variables.autoscroll.delta < galleryDiv.childElementCount)
			scrollToItem(window.variables.selected + window.variables.autoscroll.delta);
		else if(window.variables.autoscroll.direction == 'next' && window.variables.selected + window.variables.autoscroll.delta >= galleryDiv.childElementCount)
			scrollToItem(0);
		if(window.variables.autoscroll.direction == 'previous' && window.variables.selected - window.variables.autoscroll.delta >= 0)
			scrollToItem(window.variables.selected - window.variables.autoscroll.delta);
		else if(window.variables.autoscroll.direction == 'previous' && window.variables.selected - window.variables.autoscroll.delta < 0)
			scrollToItem(galleryDiv.childElementCount - window.variables.autoscroll.delta);
	}
}

//--FUNCTIONS--//
function renderFilters(tags) {
	// clear all tags
	for(let tag of filtersDiv.querySelectorAll('div'))
	{
		tag.innerHTML = '';
		
		// add tag title
		let tagDiv = document.createElement('h3');
		tagDiv.style.textTransform = 'uppercase';
		tagDiv.innerText = tag.className;
		tag.appendChild(tagDiv);
	}
	
	//render tags
	for(let tag of tags)
	{
		let filterDiv = filtersDiv.querySelector('.' + tag.category);
		if(filterDiv != null)
		{
			let tagDiv = document.createElement('a');
			tagDiv.href = 'javascript:void(0);';
			tagDiv.title = tag.value + '(' + tag.count + ')';
			tagDiv.innerText = tag.value;
			tagDiv.addEventListener('click', function() {
				window.variables.base = window.variables.items.filter(i => i[tag.category] == tag.value);
				hideFilters();
				renderGallery();
			});
			filterDiv.appendChild(tagDiv);
		}
	}
	
	//allow change source
	// filtersDiv.querySelector('.close').addEventListener('contextmenu', changeData);
}

function renderDisplay() {
	// hide all components by config
	for(let setting of Object.keys(window.variables.display ?? []))
	{
		// setting must be false
		// if setting is true or null, will display
		if(window.variables?.display[setting] == false &&
		!document.querySelector('.' + setting)?.classList.contains('hidden'))
			document.querySelector('.' + setting)?.classList.add('hidden');
	}
}

function renderGallery() {
	progressDiv.style.top = '0';
	galleryDiv.innerHTML = '';
	// render all items
	for(let [index, value] of window.variables.base.entries())
	{
		let itemDiv = document.createElement('img');
		itemDiv.setAttribute('data-id', index);
		if(value.link) itemDiv.setAttribute('data-link', value.link);
		if(value.blur) itemDiv.setAttribute('data-effect', 'blur');
		itemDiv.src = value.thumbnail || value.filename;
		itemDiv.title = value.description || '';
		itemDiv.alt = value.description || '';
		itemDiv.draggable = false;
		itemDiv.addEventListener('load', function() {
			event.target.classList.add('loaded');
		});
		itemDiv.addEventListener('click', function() {
			let inOverview = galleryDiv.classList.contains('overview');
			galleryDiv.classList.remove('overview');
			settingsDiv.classList.remove('hidden');
			if(window.variables.selected != parseInt(this.getAttribute('data-id'))) {
				scrollToItem(parseInt(this.getAttribute('data-id')));
			}
			else if(!inOverview && this.hasAttribute('data-link')) {
				window.open(this.getAttribute('data-link'), '_blank');
			}
		});
		itemDiv.addEventListener('dblclick', function() {
			if(this.hasAttribute('data-effect') && this.getAttribute('data-effect') == 'blur')
				this.classList.removeAttribute('data-effect');
		});
		itemDiv.addEventListener('contextmenu', function() {
			event.preventDefault();
		}, false);
		galleryDiv.appendChild(itemDiv);
	}
	
	setTimeout(checkComplete, 0);
	galleryDiv.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onWheel);
	galleryDiv.addEventListener('touchstart', onTouchStart);
	galleryDiv.addEventListener('touchmove', onTouchMove, false);
	if(window.variables.display.overview)
		galleryDiv.addEventListener('contextmenu', function() {
			galleryDiv.classList.add('overview');
			settingsDiv.classList.add('hidden');
			if(window.variables.selected)
				document.querySelectorAll('.gallery img')[parseInt(window.variables.selected)].scrollIntoView({ inline: 'center' });
		});
}

function checkComplete() {
	let total = window.variables.base.length;
	let loaded = document.querySelectorAll('.loaded').length;
	// console.log(loaded, total);
	
	// render progress bar
	progressDiv.style.width = 100*loaded/total + '%';
	
	// continue or stop
	if(loaded < total)
		setTimeout(checkComplete, 1000);
	else {
		scrollToItem();
		setTimeout(function() {
			progressDiv.style.top = '';
		}, 1000);
	}
}

function changeSource(dest) {
	// assume all same URL prefix for filename
	for(let img of window.variables.items)
	{
		let name = img.filename;
		img.filename = name.replace(name.substring(0, name.lastIndexOf('/')), dest);
	}
	renderGallery();
}

function changeData() {
	event.preventDefault();
	let input = prompt('Datafile location:', document.getElementById('data-id').src);
	if (input != null)
		changeDataFile(input);
}

function changeDataFile(dest) {
	document.getElementById('data-id').src = dest.endsWith('.json') ? dest : window.location.href.replace('index.html', 'data/' + dest + '.json');
	hideFilters();
	startup();
}

//--INITIAL--//
function startup() {
	getJson(
		document.getElementById('data-id').src,
		function(content) {
			window.variables = content;
			window.variables.base = window.variables.items
				.filter(i => window.variables.filter ? i[window.variables.filter.category].includes(window.variables.filter.value) : true)
				.sort(function(a,b) {
					if(window.variables.sort && window.variables.sort.order && window.variables.sort.value)
					{
						if(window.variables.sort.order.toLowerCase() == 'asc')
							return a[window.variables.sort.value] - b[window.variables.sort.value];
						if(window.variables.sort.order.toLowerCase() == 'desc')
							return b[window.variables.sort.value] - a[window.variables.sort.value];
						if(window.variables.sort.order.toLowerCase() == 'random')
							return (2*Math.random()) - 1;
					}
					return 0;
				});
			document.title = window.variables.title;
			titleDiv.innerText = window.variables.title;
			noticeDiv.innerText = window.variables.notice;
			
			renderDisplay();
			renderGallery();
		}
	);
}
