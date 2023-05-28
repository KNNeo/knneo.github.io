//--HELPERS--//
function scrollToItem(itemNo) {
	if(document.querySelectorAll('.gallery img').length > 0)
		document.querySelectorAll('.gallery img')[itemNo || 0].scrollIntoView({
			inline: 'center', behavior: 'smooth'
		});
}

//--VARIABLES--//
// see data file, under data folder
const isFirefox = (/Firefox/i.test(navigator.userAgent));

//--DOM NODE REFERENCES--//
let titleDiv = document.querySelector('.title');
let subtitleDiv = document.querySelector('.subtitle');
let galleryDiv = document.querySelector('.gallery');
let noticeDiv = document.querySelector('.notice');
let filtersDiv = document.querySelector('.filters');

//--DOM FUNCTIONS--//
function generateTagClouds() {
	let allTags = [];
	
	// dependent on list of filter containers in html
	for(let filter of document.querySelectorAll('.filters div'))
	{
		//generate unique tags
		let filterList = window.variables.items
		.map(i => i[filter.className])
		.reduce(function(total, current, index, arr) {
			if(!total.includes(current))
				total.push(current);
			return total;
		}, [])
		.map(t => ({ value: t, category: filter.className })); // must correspond to json object key
		allTags = allTags.concat(filterList);
	}
	
	return allTags;
}

function generateOrientationValues() {
	for(let item of window.variables.base)
	{
		let itemDiv = document.querySelector('.gallery img[src="' + item.filename + '"]');
		let isLandscape = itemDiv?.naturalWidth >= itemDiv?.naturalHeight ?? false;
		item.orientation = isLandscape ? window.variables.orientation.landscape : window.variables.orientation.portrait;
	}
}

//--EVENT HANDLERS--//
function onWheel(e) {
	e.preventDefault();
	let scrollDelta = isFirefox ? -e.detail*75 : e.wheelDelta;
	galleryDiv.scrollLeft -= scrollDelta;
}

function onMouseDown(e) {
	// console.log('onMouseDown');
	window.variables.touchY = e.offsetX;
	window.variables.touchX = e.offsetY;
	window.variables.mousedown = true;
}

function onMouseMove(e) {
	// console.log('onMouseMove');
	if(window.variables.mousedown)
	{
		let delta = 10;
		let swipeDown = e.offsetY - window.variables.touchY;
		let swipeUp = window.variables.touchY - e.offsetY;
		let swipeLeft = window.variables.touchX - e.offsetX;
		let swipeRight = e.offsetX - window.variables.touchX;
		// console.log(e.offsetX, e.offsetY);
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

function onMouseUp(e) {	
	window.variables.mousedown = false;
}

function onTouchStart(e) {
	window.variables.touchY = e.touches[0].clientY;
	window.variables.touchX = e.touches[0].clientX;
}

function onTouchMove(e) {
	let swipeDown = e.touches[0].clientY - window.variables.touchY;
	let swipeUp = window.variables.touchY - e.touches[0].clientY;
	let swipeLeft = window.variables.touchX - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window.variables.touchX;
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

function showFilters() {
	if(window.variables.base[0].orientation == null) // if no orientation mapped, create map
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

//--FUNCTIONS--//
function renderGallery() {
	galleryDiv.innerHTML = '';
	// render all items
	for(let [index, value] of window.variables.base.entries())
	{
		let itemDiv = document.createElement('img');
		itemDiv.setAttribute('data-id', index);
		itemDiv.src = value.filename;
		itemDiv.title = value.description;
		itemDiv.alt = value.description;
		itemDiv.draggable = false;
		itemDiv.addEventListener('load', function() {
			setTimeout(scrollToItem, 200);
		});
		itemDiv.addEventListener('click', function() {
			this.scrollIntoView({
				inline: 'center', behavior: 'smooth',
			});
		});
		itemDiv.addEventListener('contextmenu', function() {
			event.preventDefault();
		}, false);
		galleryDiv.appendChild(itemDiv);
	}
	
	// touch events
	window.variables.selected = 0;
	// galleryDiv.addEventListener('mousedown', onMouseDown);
	// galleryDiv.addEventListener('mousemove', onMouseMove, false);
	// galleryDiv.addEventListener('mouseup', onMouseUp);
	galleryDiv.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onWheel);
	galleryDiv.addEventListener('touchstart', onTouchStart);
	galleryDiv.addEventListener('touchmove', onTouchMove, false);
}

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
		let filterDiv = document.querySelector('.filters .' + tag.category);
		if(filterDiv != null)
		{
			let tagDiv = document.createElement('a');
			tagDiv.href = 'javascript:void(0);';
			tagDiv.innerText = tag.value;
			tagDiv.addEventListener('click', function() {
				window.variables.base = window.variables.items.filter(i => i[tag.category] == tag.value);
				hideFilters();
				renderGallery();
			});
			filterDiv.appendChild(tagDiv);
		}
	}
}

//--INITIAL--//
function startup() {
	getJson(
		document.getElementById('data-id').src,
		function(content) {
			window.variables = content;
			window.variables.base = window.variables.items;
			document.title = window.variables.title;
			titleDiv.innerText = window.variables.title;
			noticeDiv.innerText = window.variables.notice;
			
			renderGallery();
		}
	);
}