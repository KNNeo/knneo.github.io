//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnail filenames to be in format '<prefix>_<filename>' according to preset; original has no prefix
//Data in data.js, variable mosaicArray

//--SETTINGS--//
const config = {
	debug: false,
	menu: {
		width: 500,
	},
	title: 'VVブロマイド図鑑',
	description: `Gallery based on tag separated filenames\n\n©コーエーテクモゲームス All rights reserved.	`,
	placeholder: {
		include: '以内の…',
		exclude: '以外の…',
	},
	sort: {
		order: 'asc',
		locale: 'ja-JP',
		property: 'filename',
	},
	setting: {
		clear: true,
		expand: true,
		darkmode: true,
		preset: true,
		filter: true,
		slideshow: 5,
		stats: true,
	},
	tag: {
		category: {
			groups: ['衣装', 'キャラクター'],
			ratio: [4, 1],
		},
		preset: [160, 320, 480],
		min: 2,
		max: 9999,
		exclude: ['覚醒'],
		hidden: ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'],
	},
	grid: {
		banner: {
			length: 1,
		},
		column: {
			min: 3,
		},
		thumbnail: {
			ratio: 9/16,
		},
	},
	separator: '_',
};
const isHorizontalLayout = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
}

//--REFERENCES--//
const title = document.querySelector('.title');
const description = document.querySelector('.description');
const content = document.querySelector('.content');
const grid = document.querySelector('.grid');
const collage = document.querySelector('.collage');
const tags = document.querySelector('.tags');
const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');
const viewer = document.querySelector('.viewer');
const preset = document.querySelector('#preset');
const include = document.querySelector('#include');
const exclude = document.querySelector('#exclude');
const prev = document.querySelector('#viewer-prev');
const next = document.querySelector('#viewer-next');

//--FUNCTIONS--//
function startup() {
	initializeVariables();
	generateTags();
	generateLayout();
	generateViewer();
	let mousewheelEvent = isFirefox ? 'DOMMouseScroll' : 'mousewheel';
	collage.addEventListener(mousewheelEvent, onScroll);
	collage.addEventListener('touchstart', onTouchStart);
	collage.addEventListener('touchmove', onTouchMove);
	collage.addEventListener('scroll', fadeIn);
	window.addEventListener('resize', onResize);
	window.addEventListener('resize', fadeIn);
}

function initializeVariables() {
	window['isFirefox'] = (/Firefox/i.test(navigator.userAgent));
	window['includeCriteria'] = '';
	window['excludeCriteria'] = '';
	window['horizontal'] = isHorizontalLayout();
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
		let filenameIndex = file.filename.includes('/') ? file.filename.lastIndexOf('/') : -1;
		return getFilenameInfo(file.filename).filename;
	})
	.reduce(function(total, current, _, _) {
		let updated = total;
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
		return b.count - a.count;
	});
	if(config.debug) console.log(window['buttonArray']);
}

function generateLayout() {
	resetLayout();
	
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
			window['includeCriteria'] = this.value;
			generateGrid();
		});
		
		let exclude = document.querySelector('#exclude');
		exclude.classList.add('filter');
		exclude.placeholder = config.placeholder.exclude;
		exclude.addEventListener('input', function() {
			window['excludeCriteria'] = this.value;
			generateGrid();
		});
	}
	
	for(let [key, value] of Object.entries(config.setting))
	{
		if(key == 'expand' && window['horizontal'])
			document.querySelector('.' + key).classList.add('hidden');			
		else if(value)
			document.querySelector('.' + key).classList.remove('hidden');
		else
			document.querySelector('.' + key).classList.add('hidden');
	}
	
	generateTagsList();
	generateLayoutCollage();
	generateGrid();
	if(grid.childElementCount == 0)
		grid.innerText = 'No Data';
}

function resetLayout() {
	if(window['horizontal']) {
		document.body.setAttribute('layout', 'horizontal');
		menu.style.width = config.menu.width + 'px' || 0;
		if(window.innerHeight > 800)
			tags.classList.add('expanded');
	}
	else {
		document.body.setAttribute('layout', 'vertical');
		menu.style.width = '';
		menu.style.height = config.menu.height + 'px' || '';
	}
	
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
			// to include or reset
			switch(this.getAttribute('filter'))
			{
				case 'include':
					toggleVariable('includeCriteria', this.value);
					this.removeAttribute('filter');
					break;
				default:
					toggleVariable('includeCriteria', this.value);
					this.setAttribute('filter', 'include');
					break;
			}
			include.value = window['includeCriteria'];
			exclude.value = window['excludeCriteria'];			
			generateGrid();
		});
		tag.addEventListener('contextmenu',function() {
			// to exclude or reset
			event.preventDefault();
			switch(this.getAttribute('filter'))
			{
				case 'exclude':
					toggleVariable('excludeCriteria', this.value);
					this.removeAttribute('filter');
					break;
				default:
					toggleVariable('excludeCriteria', this.value);
					this.setAttribute('filter', 'exclude');
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
		else
			tags.childNodes[0].appendChild(tag);
	}	
}

function generateViewer() {	
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);		
	viewer.addEventListener('keyup', function(e) {
		if (event.keyCode === 37 && prev != null)
			prev.click();
		if (event.keyCode === 39 && next != null)
			next.click();
		return false;
	}, false);
}

function generateStats() {
	let filtered = generateFiltered(mosaicArray)
	.reduce(function(total, current, arr) {
		let names = current.filename.substring(0, current.filename.lastIndexOf('.')).split(config.separator);
		for(let name of names)
		{
			if(total[name] == undefined)
				total[name] = 1;
			else
				total[name] += 1;
		}
		return total;
	}, {});
	
	let countArray = [];
	for(let item of Object.keys(filtered))
	{
		// console.log(filtered[item]);
		if(filtered[item] >= config.tag.min && 
			filtered[item] <= config.tag.max &&
			!config.tag.hidden.includes(item))
			countArray.push([item, filtered[item]]);
	}
	
	popupText(countArray.sort(function(a,b) { return b[1] - a[1]; }).map(m => m[0] + ' - ' + m[1]).join('<br>'));
}

function generateLayoutCollage() {
	if(window['horizontal']) 
		collage.style.width = (config.menu.width >= 0.5*window.innerWidth ? 0.5*window.innerWidth : window.innerWidth - config.menu.width) + 'px';
	else
		collage.style.width = '';
	collage.style.height = (window.innerHeight) + 'px';
}

function generateGrid() {
	let prevValue = '';
	let columns = calculateColumns();
	let thumbWidth = calculateThumbnailSize();
	grid.innerHTML = '';
	
	let filterArray = generateFiltered().sort(function(a,b) {
		let prop = config.sort.property;
		if(!a[prop] || !b[prop])
			return 0;
		if(config.sort.order == 'desc')
			return b[prop].localeCompare(a[prop], config.sort.locale);
		return a[prop].localeCompare(b[prop], config.sort.locale);
	});
	
	if(config.debug)
		console.log("thumbWidth", thumbWidth);
	let itemWidth = thumbWidth + 'px';
	let itemHeight = (thumbWidth*config.grid.thumbnail.ratio) + 'px';
	
	for(let item of filterArray) {
		let imageUrl = item.filename;
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.style.width = itemWidth;
		gridItem.style.height = itemHeight;
		
		let prefix = imageUrl.substring(0, config.grid.banner.length);
		if(config.grid.banner.length > 0 && prevValue != prefix) {
			let overlay = document.createElement('div');
			overlay.classList.add('banner');
			overlay.innerText = prefix;
			gridItem.appendChild(overlay);
			prevValue = prefix;
		}
		
			let gridItemImage = document.createElement('img');
		
			gridItemImage.title = getFilenameInfo(imageUrl).filename.split(config.separator).join('\n');
			// gridItemImage.src = item[getThumbnailPrefix()] || 'https://knneo.github.io/resources/spacer.gif';
			gridItemImage.setAttribute('data-image', item[getThumbnailPrefix()] || 'https://knneo.github.io/resources/spacer.gif');
			gridItemImage.setAttribute('data-src', item['og']);
			gridItemImage.addEventListener('click', function() {
				openViewer(this.parentElement);
			});
			gridItemImage.addEventListener('contextmenu', function(e) {
				e.preventDefault();
				let keywords = this.title.split('\n');
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
				return false;
			}, false);			
			gridItemImage.addEventListener('error', function(e) {
				e.preventDefault();
				console.log(this.title);
			});
			gridItem.appendChild(gridItemImage);
			
		grid.appendChild(gridItem);
	}

	setTimeout(fadeIn, 0);
	if(document.querySelector('.counter') != null)
		document.querySelector('.counter').innerText = filterArray.length;
}

function generateFiltered() {
	if(typeof mosaicArray != 'object') return [];
	let includeArray = window['includeCriteria'].split('|');
	let excludeArray = window['excludeCriteria'].split('|');
	if(config.debug) console.log('included', includeArray);
	if(config.debug) console.log('excluded', excludeArray);
	return mosaicArray.filter(m => 
		(window['includeCriteria'].length == 0 || includeArray.filter(s => m.filename.toLowerCase().includes(s.toLowerCase())).length == includeArray.length) && 
		(window['excludeCriteria'].length == 0 || excludeArray.filter(s => !m.filename.toLowerCase().includes(s.toLowerCase())).length == excludeArray.length) &&
		(config.tag.exclude ?? []).filter(f => m.filename.includes(f)).length < 1
	);
}

function toggleVariable(variable, value) {
	if(window[variable].includes(value)) {
		window[variable] = window[variable].replace('|' + value,'').replace(value,'');
		if(window[variable].startsWith('|')) window[variable] = window[variable].substring(1);
	}
	else {
		window[variable] += (window[variable].length > 0 ? '|' : '') + value;
	}
}

function getThumbnailPrefix() {
	let prefix = '';
	
	switch(window['preset'])
	{
	  case 'photo_size_select_small':
		prefix = 'sm';
		break;
	  case 'photo_size_select_large':
		prefix = 'md';
		break;
	  case 'photo_size_select_actual':
		prefix = 'lg';
	  default:
		break;
	}
	
	return prefix;
}

function calculateColumns() {
	let columns = 0;
	switch(window['preset'])
	{
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
	columns = Math.round((window.innerWidth - (window['horizontal'] ? config.menu.width : 0)) / columns);
	return columns < config.grid.column.min ? config.grid.column.min : columns;
}

function calculateThumbnailSize() {
	let columns = calculateColumns();
	grid.style.height = '101%';
	let gridWidth = grid.getBoundingClientRect().width;
	grid.style.height = '';
	let thumbWidth = gridWidth / columns;
	
	if(config.debug) {
		console.log('gridWidth', gridWidth);
		console.log('columns', columns);
		console.log('calculateThumbnailSize', thumbWidth);
	}
	return thumbWidth;
}

function fadeIn() {
	let boxes = document.querySelectorAll('.grid-item:not(.tile-view)');
    for (let elem of boxes) {
        // let elem = boxes[i]
        let distInViewFromTop = elem.getBoundingClientRect().top;
        // let distInViewFromBottom = elem.getBoundingClientRect().bottom;
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
	//size grid again
	window['horizontal'] = isHorizontalLayout();
	document.querySelector('.expand').innerText = 'unfold_more';
	tags.classList.remove('expanded');
	generateLayout();

	//resize images again
	let thumbWidth = calculateThumbnailSize();
	let itemWidth = thumbWidth + 'px';
	let itemHeight = (thumbWidth*config.grid.thumbnail.ratio) + 'px';
	for(let gridItem of document.querySelectorAll('.grid-item'))
	{
		gridItem.style.width = itemWidth;
		gridItem.style.height = itemHeight;		
	}
}

function onScroll(e) {
	if(!window['horizontal'])
	{
		let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta;
		menu.style.height = scrollDelta < 0 ? 0 : '';
		tags.style.height = menu.style.height;
		collage.style.height = scrollDelta < 0 ? window.innerHeight + 'px' : (window.innerHeight - menu.getBoundingClientRect().height) + 'px';
	}
}

function onTouchStart(e) {
	window['touchY'] = e.touches[0].clientY;
	window['touchX'] = e.touches[0].clientX;
}

function onTouchMove(e) {
	let swipeDown = e.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - e.touches[0].clientY;
	let swipeLeft = window['touchX'] - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window['touchX'];
	if(config.debug)
		console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	if(!window['horizontal'])
	{
		menu.style.height = swipeUp > 0 ? 0 : '';
		tags.style.height = menu.style.height;
		collage.style.height = swipeUp > 0 ? window.innerHeight + 'px' : (window.innerHeight - menu.getBoundingClientRect().height) + 'px';
	}
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
	collage.style.height = (window.innerHeight) + 'px';
	setTimeout(fadeIn, 0);
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
	img.id = image.id;
	img.src = image.getAttribute('data-src');
	img.title = image.title;
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
	img.addEventListener('touchstart', onTouchStart);
	img.addEventListener('touchmove', onTouchMoveViewer, false);
	img.addEventListener('click', closeViewer);
	img.addEventListener('contextmenu', toggleZoom);
	
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

function onTouchMoveViewer(e) {
	let swipeDown = e.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - e.touches[0].clientY;
	let swipeLeft = window['touchX'] - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window['touchX'];
	if(config.debug)
		console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		onClickViewerNext();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		onClickViewerPrev();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		closeViewer();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		closeViewer();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
}

function closeViewer() {	
	stopSlideshow();
	viewer.classList.remove('zoom');
	viewer.classList.remove('open');
}

function toggleZoom() {
	if(window['slideshow'] != null) return;
	viewer.classList.toggle('zoom');
}

function getFilenameInfo(url) {
	let filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
	let extension = url.substring(url.lastIndexOf('.')+1);
	return {filename, extension};
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
		this.remove();
	});
	dialog.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			this.remove();
	});
	return dialog;
}
