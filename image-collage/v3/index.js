//--CONSTANTS--//
const isHorizontalLayout = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
}

//--REFERENCES--//
const title = document.querySelector('.title');
const description = document.querySelector('.description');
const content = document.querySelector('.content');
const grid = document.querySelector('.grid');
const tags = document.querySelector('.tags');
const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');
const viewer = document.querySelector('.viewer');
const preset = document.querySelector('#preset');
const include = document.querySelector('#include');
const exclude = document.querySelector('#exclude');
const callback = (entries, observer) => {
	entries.forEach((elem) => {
		let thumbnail = elem.target;
		thumbnail.src = thumbnail.getAttribute('data-image');
	});
};
const observer = new IntersectionObserver(callback, {
	root: document.querySelector('.collage'),
	rootMargin: '10px',
	threshold: 0,
})

//--FUNCTIONS--//
function startup() {
	initializeVariables();
	generateTags();
	generateLayout();
	generateViewer();
	grid.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onScroll);
	grid.addEventListener('touchstart', onTouchStart);
	grid.addEventListener('touchmove', onTouchMove);
	window.addEventListener('resize', onResize);
}

function initializeVariables() {
	window['isFirefox'] = (/Firefox/i.test(navigator.userAgent));
	window['includeCriteria'] = '';
	window['excludeCriteria'] = '';
	
	window['preset'] = 'photo_size_select_small';
	window['slideshow'] = null;
}

function generateTags() {
	if(typeof config.setting.filter == 'boolean') {
		window['buttonArray'] = [];
		if(!config.setting.filter) return;
	}
	
	//generate tags by design
	window['buttonArray'] = generateFiltered()
	.map(function(file) {
		let filenameIndex = file.nm && file.nm.includes('/') ? file.nm.lastIndexOf('/') : -1;
		return getFilenameInfo(file.nm).filename;
	})
	.reduce(function(total, current, _, _) {
		let updated = total || [];
		if(current && current.length > 0)
			current.split(config.separator).forEach(function(tag, index, _) {
				let existing = updated.filter(a => a.value == tag);
				// console.log(tag, existing);
				let existingFirst = existing[0];
				if(existingFirst) {
					//remove this tag, add back with new count
					updated = updated.filter(a => a.value.toLowerCase() != tag.toLowerCase());
				}
				updated.push({
					value: tag,
					count: existingFirst?.count ? existingFirst?.count + 1 : 1,
					category: config.tag.category ? index : null,
				});
			});
		return updated;
	},[])
	.filter(function(item) {
		return item.count >= config.tag.min && item.count <= config.tag.max && config.tag.hidden.filter(t => item.value.includes(t)).length < 1;
	})
	.sort(function(a,b) {
		// based on values in reduce function
		let prop = config.tag?.sort?.property;
		if(!a[prop] || !b[prop])
			return 0;
		if(typeof a[prop] == 'number' && typeof b[prop] == 'number')
			return config.tag?.sort?.order == 'desc' ? b[prop] - a[prop] : a[prop] - b[prop];
		// else string
		if(config.tag?.sort?.order == 'desc')
			return b[prop].localeCompare(a[prop], config.tag?.sort?.locale);
		return a[prop].localeCompare(b[prop], config.tag?.sort?.locale);
	});
	if(config.debug) console.log(window['buttonArray']);
}

function generateLayout() {
	menu.style.maxWidth = (config.menu.width || 400) + 'px';
	
	document.title = config.title ?? 'Image Collage';

	if(config.title && config.title.length > 0)
		title.innerText = config.title;
	
	if(config.description && config.description.length > 0)
		description.innerText = config.description;

	if(typeof config.setting.filter == 'boolean' && config.setting.filter) {
		let include = document.querySelector('#include');
		include.classList.add('filter');
		include.placeholder = config.placeholder.include;
		include.addEventListener('input', function() {
			window['includeCriteria'] = event.target.value;
			generateGrid();
		});
		
		let exclude = document.querySelector('#exclude');
		exclude.classList.add('filter');
		exclude.placeholder = config.placeholder.exclude;
		exclude.addEventListener('input', function() {
			window['excludeCriteria'] = event.target.value;
			generateGrid();
		});
	}
	
	for(let [key, value] of Object.entries(config.setting)) {
		if(key == 'expand' && isHorizontalLayout())
			document.querySelector('.' + key).classList.add('hidden');			
		else if(value)
			document.querySelector('.' + key).classList.remove('hidden');
		else
			document.querySelector('.' + key).classList.add('hidden');
	}
	
	generateTagsList();
	generateGrid();
	if(grid.childElementCount == 0)
		grid.innerText = 'No Data';
}

function generateTagsList() {
	tags.innerHTML = '';
	
	if(config.tag.category && config.tag.category.groups) {
		let sections = config.tag.category.ratio.reduce((sum, r) => sum + r, 0);
		config.tag.category.groups.forEach(function(current, index, _) {
			let tag = document.createElement('div');
			if(isHorizontalLayout()) tag.style.maxHeight = (100 / sections * config.tag.category.ratio[index]) + '%';
			
				let title = document.createElement('h4');
				title.classList.add('category-title');
				title.innerText = current;
				tag.appendChild(title);
				
			tags.appendChild(tag);
		});
	}
	else {
		let tag = document.createElement('div');
		tags.appendChild(tag);
	}
	
	for(let button of window['buttonArray']) {
		if(button.value == '') continue;
		let tag = document.createElement('button');
		tag.classList.add('tag');
		tag.value = button.value;
		tag.title = button.value + ' (' + button.count + ')';
		tag.innerText = button.value;
		tag.tabIndex = -1;
		tag.addEventListener('click',function() {
			let filter = event.target;
			// to include or reset
			switch(filter.getAttribute('filter')) {
				case 'exclude':
					toggleVariable('excludeCriteria', filter.value);
					toggleVariable('includeCriteria', filter.value);
					filter.setAttribute('filter', 'include');
					break;
				case 'include':
					toggleVariable('includeCriteria', filter.value);
					filter.removeAttribute('filter');
					break;
				default:
					toggleVariable('includeCriteria', filter.value);
					filter.setAttribute('filter', 'include');
					break;
			}
			include.value = window['includeCriteria'];
			exclude.value = window['excludeCriteria'];			
			generateGrid();
		});
		tag.addEventListener('contextmenu',function() {
			let filter = event.target;
			// to exclude or reset
			event.preventDefault();
			switch(filter.getAttribute('filter')) {
				case 'include':
					toggleVariable('includeCriteria', filter.value);
					toggleVariable('excludeCriteria', filter.value);
					filter.setAttribute('filter', 'exclude');
					break;
				case 'exclude':
					toggleVariable('excludeCriteria', filter.value);
					filter.removeAttribute('filter');
					break;
				default:
					toggleVariable('excludeCriteria', filter.value);
					filter.setAttribute('filter', 'exclude');
					break;
			}
			include.value = window['includeCriteria'];
			exclude.value = window['excludeCriteria'];			
			generateGrid();
		});
		
		if(window['includeCriteria'].split(config.separator).includes(button.value))
			tag.setAttribute('filter', 'include');
		if(window['excludeCriteria'].split(config.separator).includes(button.value))
			tag.setAttribute('filter', 'exclude');
		if(button.category)
			tags.childNodes[button.category].appendChild(tag);
		else if (tags.childNodes.length > 0)
			tags.childNodes[0].appendChild(tag);
	}	
}

function generateViewer() {	
	viewer.addEventListener('contextmenu', function() {
		event.preventDefault();
		return false;
	}, false);		
	document.body.addEventListener('keyup', function() {
		let prev = document.querySelector('.viewer-nav.prev');
		let next = document.querySelector('.viewer-nav.next');
		if (event.key == 'ArrowLeft' && prev != null)
			prev.click();
		if (event.key == 'ArrowRight' && next != null)
			next.click();
		return false;
	}, false);
}

function generateStats() {
	let filtered = generateFiltered(config.data)
	.reduce(function(total, current, arr) {
		let names = getFilenameInfo(current.nm).filename.split(config.separator);
		for(let name of names) {
			if(total[name] == undefined)
				total[name] = 1;
			else
				total[name] += 1;
		}
		return total;
	}, {});
	
	let countArray = [];
	for(let item of Object.keys(filtered)) {
		if(config.debug) console.log(filtered[item]);
		if(filtered[item] >= config.tag.min && 
			filtered[item] <= config.tag.max &&
			!config.tag.hidden.includes(item))
			countArray.push([item, filtered[item]]);
	}
	
	popupText(countArray.sort(function(a,b) { return b[1] - a[1]; }).map(m => m[0] + ' - ' + m[1]).join('<br>'));
}

function generateGrid() {
	let prevValue = '';
	grid.innerHTML = '';
	
	let filterArray = generateFiltered().sort(function(a,b) {
		let prop = config.sort.property;
		if(!a[prop] || !b[prop])
			return 0;
		if(config.sort.order == 'desc')
			return b[prop].localeCompare(a[prop], config.sort.locale);
		return a[prop].localeCompare(b[prop], config.sort.locale);
	});
	
	let [thumbWidth, thumbHeight] = calculateThumbnailSize();
	for(let item of filterArray) {
		let imageUrl = item.nm || '';
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.style.width = thumbWidth + 'px';
		gridItem.style.height = thumbHeight + 'px';
		
		let prefix = imageUrl.substring(0, config.grid.banner.length);
		if(config.grid.banner.length > 0 && prevValue != prefix) {
			let overlay = document.createElement('div');
			overlay.classList.add('banner');
			overlay.classList.add('prefix');
			overlay.innerText = prefix;
			overlay.title = prefix;
			gridItem.appendChild(overlay);
			prevValue = prefix;
		}
		
		if(config.grid.star && item.st) {
			let highlight = document.createElement('div');
			highlight.classList.add('banner');
			highlight.classList.add('star');
			highlight.innerText = config.grid.star.text;
			highlight.title = item[config.grid.star.property] || config.grid.star.tooltip;
			gridItem.appendChild(highlight);
		}
		
		let gridItemImage = document.createElement('img');
		gridItemImage.alt = item.ds || '';
		gridItemImage.title = item.ct || getFilenameInfo(imageUrl).filename.split(config.separator).join('\n');
		gridItemImage.setAttribute('data-image', getThumbnailByPrefix(item));
		gridItemImage.setAttribute('data-src', item['og']);
		gridItemImage.setAttribute('loading', 'lazy');
		gridItemImage.addEventListener('click', function() {
			openViewer(event.target.parentElement);
		});
		gridItemImage.addEventListener('contextmenu', function() {
			event.preventDefault();
			if(config.tag.category.groups.length > 0) {
				let keywords = event.target.title.split('\n');
				if(keywords.filter(k => !window['includeCriteria'].includes(k)).length >= keywords.length) // if no keywords in filter
					toggleVariable('includeCriteria', keywords[0]);
				else {
					let inFilter = keywords.filter(k => window['includeCriteria'].includes(k))[0];
					let notFilter = keywords.filter(k => !window['includeCriteria'].includes(k));
					
					toggleVariable('includeCriteria', inFilter);
					toggleVariable('includeCriteria', notFilter[0]);
				}
				include.value = window['includeCriteria'];
				generateTagsList();
				generateGrid();
			}
			return false;
		}, false);
		gridItemImage.addEventListener('error', function() {
			event.preventDefault();
			console.log(event.target.title);
		});
		gridItem.appendChild(gridItemImage);
		observer.observe(gridItemImage);
			
		grid.appendChild(gridItem);
	}

	if(document.querySelector('.counter') != null)
		document.querySelector('.counter').innerText = filterArray.length;
}

function generateFiltered() {
	if(typeof config.data != 'object') return [];
	let includeArray = window['includeCriteria'].split('|');
	let excludeArray = window['excludeCriteria'].split('|');
	if(config.debug) console.log('included', includeArray);
	if(config.debug) console.log('excluded', excludeArray);
	return config.data.filter(m => 
		(window['includeCriteria'].length == 0 || includeArray.filter(s => m.nm.toLowerCase().includes(s.toLowerCase() + config.separator) || m.nm.toLowerCase().includes(config.separator + s.toLowerCase())).length == includeArray.length) && 
		(window['excludeCriteria'].length == 0 || excludeArray.filter(s => !m.nm.toLowerCase().includes(s.toLowerCase() + config.separator) && !m.nm.toLowerCase().includes(config.separator + s.toLowerCase())).length == excludeArray.length) &&
		(config.tag.exclude ?? []).filter(f => m.nm.includes(f)).length < 1
	);
}

function toggleVariable(variable, value) {
	if(window[variable].includes(value)) {
		window[variable] = window[variable].replace('|' + value,'').replace(value,'');
		if(window[variable].startsWith('|')) window[variable] = window[variable].substring(1);
	}
	else
		window[variable] += (window[variable].length > 0 ? '|' : '') + value;
}

function getThumbnailByPrefix(item) {	
	switch(window['preset']) {
	  case 'photo_size_select_small':
		return item['sm'];
	  case 'photo_size_select_large':
		return item['md'];
		break;
	  case 'photo_size_select_actual':
		return item['lg'];
	  default:
		return 'https://knneo.github.io/resources/spacer.gif';
	}
}

function calculateThumbnailSize() {
	let gridWidth = grid.getBoundingClientRect().width;
	let columns = calculateColumns(gridWidth);
	let thumbWidth = gridWidth / columns;
	let thumbHeight = thumbWidth*config.grid.thumbnail.ratio;
	
	if(config.debug) {
		console.log('gridWidth', gridWidth);
		console.log('columns', columns);
		console.log('calculateThumbnailSize', thumbWidth, thumbHeight);
	}
	return [thumbWidth, thumbHeight];
}

function calculateColumns(gridWidth) {
	let columns = 0;
	switch(window['preset']) {
	  case 'photo_size_select_small':
		columns = config.tag.preset[0];
		break;
	  case 'photo_size_select_large':
		columns = config.tag.preset[1];
		break;
	  case 'photo_size_select_actual':
		columns = config.tag.preset[2];
	  default:
		break;
	}
	columns = Math.round(gridWidth / columns);
	return columns < config.grid.column.min ? config.grid.column.min : columns;
}

function fadeIn() {
	let boxes = document.querySelectorAll('.grid-item:not(.tile-view)');
    for (let elem of boxes) {
        let distInViewFromTop = elem.getBoundingClientRect().top;
		let inView = distInViewFromTop >= 0 && distInViewFromTop <= window.innerHeight;
		let thumbnail = elem.querySelector('img');
        if (thumbnail.complete && inView) {
			thumbnail.src = thumbnail.getAttribute('data-image');
            elem.classList.add('tile-view');
            setTimeout(function() { elem.classList.add('no-delay'); }, 500);
        }
		else {
            elem.classList.remove('tile-view');
            elem.classList.remove('no-delay');
        }
    }
}

//EVENTS//
function onResize() {
	//resize grid
	document.querySelector('.expand').innerText = 'unfold_more';
	tags.classList.remove('expanded');
	generateLayout();	
	//resize images
	let [thumbWidth, thumbHeight] = calculateThumbnailSize();
	for(let gridItem of document.querySelectorAll('.grid-item')) {
		gridItem.style.width = thumbWidth + 'px';
		gridItem.style.height = thumbHeight + 'px';
	}
}

function onScroll(e) {
	if(!isHorizontalLayout()) {
		let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta;
		menu.style.height = scrollDelta < 0 ? 0 : '';
		tags.style.height = menu.style.height;
		grid.style.height = scrollDelta < 0 ? window.innerHeight + 'px' : (window.innerHeight - menu.getBoundingClientRect().height) + 'px';
	}
}

function onTouchStart() {
	window['touchY'] = event.touches[0].clientY;
	window['touchX'] = event.touches[0].clientX;
}

function onTouchMove() {
	let swipeDown = event.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.touches[0].clientY;
	let swipeLeft = window['touchX'] - event.touches[0].clientX;
	let swipeRight = event.touches[0].clientX - window['touchX'];
	if(config.debug) console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	menu.style.height = swipeUp > 0 ? 0 : '';
	tags.style.height = menu.style.height;
}

function onTogglePreset() {
	switch(event.target.innerText)
	{
	  case 'photo_size_select_actual':
		preset.innerText = 'photo_size_select_small';
		break
	  case 'photo_size_select_small':
		preset.innerText = 'photo_size_select_large';
		break;
	  case 'photo_size_select_large':
		preset.innerText = 'photo_size_select_actual';
		break;
	  default:
		break;
	}
	
	window['preset'] = preset.innerText;
	generateGrid();
}

function onToggleExpander() {
	switch(event.target.innerText)
	{
	  case 'unfold_more':
		event.target.innerText = 'unfold_less';
		event.target.title = 'Close Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
		{
			tag.tabIndex = 0;
		}
		break
	  case 'unfold_less':
		event.target.innerText = 'unfold_more';
		event.target.title = 'Expand Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
		{
			tag.tabIndex = -1;
		}
		break;
	  default:
		break;
	}
}

function onClearAll() {
	for(let button of document.querySelectorAll('.button-active'))
	{
		button.classList.remove('button-active');
	}
	for(let tag of document.querySelectorAll('.tag'))
	{
		tag.removeAttribute('filter');
	}
	window['includeCriteria'] = '';
	include.value = window['includeCriteria'];
	window['excludeCriteria'] = '';
	exclude.value = window['excludeCriteria'];
	generateGrid();
}

function onToggleSidebar() {
	event.target.innerText = event.target.innerText == 'menu' ? 'menu_open' : 'menu';
	document.querySelector('.menu').classList.toggle('hidden');
	document.querySelector('.menu').style.maxWidth = document.querySelector('.menu').classList.contains('hidden') ? 0 : config.menu.width + 'px'; // required to render
	generateGrid();
}

//VIEWER//
function createLinkedList(selector) {
	window['viewer-list'] = Array.from(document.querySelectorAll(selector));
}

function openViewer(image) {
	createLinkedList('.grid-item img');
	openImageInViewer(image.querySelector('img'));
	runLoader();
}

function openImageInViewer(image) {	
	let imgNo = window['viewer-list'].findIndex(i => i.src === image.src);	
	viewer.setAttribute('index', imgNo);
	viewer.setAttribute('ontouchstart', 'onTouchStart()');
	viewer.setAttribute('ontouchmove', 'onTouchMoveViewer()');
	
	let viewerPrev = document.createElement('a');
	viewerPrev.classList.add('prev');
	viewerPrev.classList.add('viewer-nav');
	if(imgNo-1 >= 0 && window['slideshow'] == null) {
		viewerPrev.addEventListener('click', onClickViewerPrev, false);
	}
	
	let viewerNext = document.createElement('a');
	viewerNext.classList.add('next');
	viewerNext.classList.add('viewer-nav');
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null) {
		viewerNext.addEventListener('click', onClickViewerNext, false);
	}
	
	let loader = document.createElement('div');
	loader.classList.add('material-icons');
	loader.classList.add('loader');
	loader.addEventListener('click', function() {
		window['loading'] = false;
		runLoader();
		closeViewer();		
	});
	
	let img = document.createElement('img');
	img.nm = image.nm;
	img.src = image.getAttribute('data-src');
	img.alt = '';
	img.title = '';
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
	img.addEventListener('load', function() {
		setTimeout(function() {
			img.style.opacity = 1;
			if(img.style.transform != 'scale(1)')
				img.style.transform = 'scale(1)';
			window['loading'] = false;
			runLoader();
		}, 250);
	});
	img.addEventListener('click', closeViewer);
	img.addEventListener('mouseup', onZoomViewer);
	img.addEventListener('mousemove', onMouseMoveViewer);
	
	if(viewer.childNodes.length > 0)
		viewer.innerHTML = '';
	if(imgNo-1 >= 0 && window['slideshow'] == null)
		viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null)
		viewer.appendChild(viewerNext);
	viewer.appendChild(loader);
	viewer.appendChild(img);
	viewer.focus();
	window['loading'] = true;
	
	viewer.classList.add('open');
}

function onClickViewerPrev() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))-1]);
	runLoader();
	return false;
}

function onClickViewerNext() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))+1]);
	runLoader();
	return false;
}

function onTouchMoveViewer() {
	let swipeDown = event.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.touches[0].clientY;
	let swipeLeft = window['touchX'] - event.touches[0].clientX;
	let swipeRight = event.touches[0].clientX - window['touchX'];
	if(config.debug)
		console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		onClickViewerNext();
		event.target.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		onClickViewerPrev();
		event.target.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		closeViewer();
		event.target.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		closeViewer();
		event.target.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
}

function onMouseMoveViewer() {
	// console.log(event.clientX, event.clientY);
	// console.log(viewer.clientWidth, viewer.clientHeight);
	let normalizeX = event.clientX / viewer.clientWidth * 100;
	let normalizeY = event.clientY / viewer.clientHeight * 100;
	event.target.style.setProperty('--horizontal', normalizeX + '%');
	event.target.style.setProperty('--vertical', normalizeY + '%');
}

function closeViewer() {	
	stopSlideshow();
	viewer.classList.remove('zoom');
	viewer.classList.remove('open');
}

function onZoomViewer() {
	if(event.button == 2) {
		if(window['slideshow'] != null) return;
		viewer.classList.toggle('zoom');
	}
}

function getFilenameInfo(url) {
	if(url && url.lastIndexOf('.') >= 0) { // assume file name with extension
		let filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
		let extension = url.substring(url.lastIndexOf('.')+1);
		return {filename, extension};
	}
	else
		return {filename: url, extension: ''};
}

//SLIDESHOW//
function startSlideshow() {
	createLinkedList('.grid-item img');
	window['slideshow'] = -1;
	runSlideshow();
}

function runSlideshow() {
	if(window['slideshow'] != null)
	{
		let images = generateFiltered();
		let image = images[Math.floor(Math.random()*images.length)];
		openImageInViewer(document.querySelector('img[data-src="' + image.og + '"]'));
		runLoader();
		window['slideshow'] = setTimeout(runSlideshow, config.setting.slideshow * 1000);	
	}
}

function stopSlideshow() {
	clearTimeout(window['slideshow']);
	window['slideshow'] = null;
}

//LOADER//
function runLoader() {
	for(let loader of document.querySelectorAll('.loader'))
	{
		switch(document.querySelector('.loader').innerText)
		{
			case 'hourglass_full': 
				document.querySelector('.loader').innerText = 'hourglass_empty';
				break;
			case 'hourglass_empty': 
				document.querySelector('.loader').innerText = 'hourglass_bottom';
				break;
			case 'hourglass_bottom': 
				document.querySelector('.loader').innerText = 'hourglass_full';
				break;
			default:
				document.querySelector('.loader').innerText = 'hourglass_empty';
				break;
		}
	}
	if(window['loading'] && document.querySelectorAll('.loader').length > 0)
		setTimeout(runLoader, 500);
	else
	{
		for(let loader of document.querySelectorAll('.loader'))
		{
			loader.parentElement.removeChild(loader);
		}
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
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object')
		dialog.appendChild(node);
	dialog.addEventListener('click', function() {
		event.target.remove();
	});
	dialog.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			event.target.remove();
	});
	return dialog;
}
