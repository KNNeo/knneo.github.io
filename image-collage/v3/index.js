//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnail filenames to be in format '<prefix>_<filename>' according to preset; original has no prefix
//Data in data.js, variable mosaicArray

//--SETTINGS--//
const config = {
	debug: false,
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
const horizontalMenuWidth = 500;
const horizontalLayout = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
}

//--REFERENCES--//
const content = document.querySelector('.content');
const grid = document.querySelector('.grid');
const collage = document.querySelector('.collage');
const tags = document.querySelector('.tags');
const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');

//--VARIABLES--//
window.addEventListener('load', startup);

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
	window['horizontal'] = horizontalLayout();
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
	.join(config.separator)
	.split(config.separator)
	.reduce(function(total, current, index, array) {
		let updated = total;
		let existing = total.filter(a => a.value == current);
		let existingFirst = existing[0];
		let oldCount = existingFirst?.count;
		if(existingFirst) {
			//remove this tag, add back with new count
			updated = total.filter(a => a.value.toLowerCase() != current.toLowerCase());
		}
		updated.push({
			value: current,
			count: existingFirst ? oldCount + 1 : 1,
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
	document.title = config.title ?? 'Image Collage';
	
	if(window['horizontal']) {
		document.body.setAttribute('layout', 'horizontal');
		menu.style.width = horizontalMenuWidth + 'px';
		if(window.innerHeight > 800) {
			tags.classList.add('expanded');
		}
	}
	else {
		document.body.setAttribute('layout', 'vertical');
	}
		
	if(config.title && config.title.length > 0)
		document.querySelector('.title').innerText = config.title;
	
	if(config.description && config.description.length > 0)
		document.querySelector('.description').innerText = config.description;

	if(typeof config.setting.filter == 'boolean' && config.setting.filter) {
		let include = document.querySelector('#include');
		include.classList.add('filter');
		include.style.fontSize = '1em';
		include.style.maxWidth = '45%';
		include.placeholder = config.placeholder.include;
		include.addEventListener('input', function() {
			window['includeCriteria'] = this.value;
			generateGrid();
		});
		
		let exclude = document.querySelector('#exclude');
		exclude.classList.add('filter');
		exclude.style.fontSize = '1em';
		exclude.style.maxWidth = '45%';
		exclude.placeholder = config.placeholder.exclude;
		exclude.addEventListener('input', function() {
			window['excludeCriteria'] = this.value;
			generateGrid();
		});
	}
	
	if(typeof config.setting.clear == 'boolean')
	{
		let clear = document.createElement('a');
		clear.classList.add('clear');
		clear.classList.add('settings-icon');
		clear.classList.add('material-icons');
		clear.title = 'Clear Search & Tags';
		clear.href = 'javascript:void(0);';
		clear.innerText = 'clear_all';
		clear.addEventListener('click', onClearAll);
		settings.appendChild(clear);
	}
	
	if(typeof config.setting.expand == 'boolean')
	{
		let expander = document.createElement('a');
		expander.classList.add('expander');
		expander.classList.add('settings-icon');
		expander.classList.add('material-icons');
		expander.title = 'Expand Tags';
		expander.href = 'javascript:void(0);';
		expander.innerText = 'unfold_more';
		expander.addEventListener('click', onToggleExpander);
		settings.appendChild(expander);
	}
	
	if(typeof config.setting.darkmode == 'boolean')
	{
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.classList.add('darkmode');
		darkmode.classList.add('settings-icon');
		darkmode.classList.add('material-icons');
		darkmode.title = 'Toggle Dark Mode';
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		darkmode.addEventListener('click', toggleDarkMode);
		settings.appendChild(darkmode);		
	}
	
	if(typeof config.setting.preset == 'boolean' && typeof config.tag.preset == 'object' && config.tag.preset.length == 3)
	{
		let preset = document.createElement('a');
		preset.id = 'preset';
		preset.classList.add('preset');
		preset.classList.add('settings-icon');
		preset.classList.add('material-icons');
		preset.title = 'Toggle Thumbnail Presets';
		preset.href = 'javascript:void(0);';
		preset.innerText = window['preset'];
		preset.addEventListener('click', onTogglePreset);
		settings.appendChild(preset);
	}
	
	if(typeof config.setting.slideshow == 'number' && config.setting.slideshow > 0)
	{
		let slideshow = document.createElement('a');
		slideshow.id = 'slideshow';
		slideshow.classList.add('slideshow');
		slideshow.classList.add('settings-icon');
		slideshow.classList.add('material-icons');
		slideshow.title = 'Start Slideshow';
		slideshow.href = 'javascript:void(0);';
		slideshow.innerText = 'slideshow';
		slideshow.addEventListener('click', startSlideshow);
		settings.appendChild(slideshow);
	}
	
	if(config.setting.stats && typeof mosaicArray == 'object')
	{
		let stats = document.createElement('a');
		stats.id = 'stats';
		stats.classList.add('stats');
		stats.classList.add('settings-icon');
		stats.classList.add('material-icons');
		stats.title = 'Show Statistics';
		stats.href = 'javascript:void(0);';
		stats.innerText = 'analytics';
		stats.addEventListener('click', generateStats);
		settings.appendChild(stats);
		
		let counter = document.createElement('span');
		counter.classList.add('counter');
		counter.title = 'Number of items displayed';
		counter.innerText = 0;
		settings.appendChild(counter);
	}
	
	let back = document.createElement('a');
	back.classList.add('back');
	back.classList.add('menu');
	back.style.padding = '0 5px';
	back.style.verticalAlign = 'top';
	back.href = '../../index.html';
	back.innerText = 'knneo.github.io';
	settings.appendChild(back);
	
	generateTagsList();
	generateLayoutCollage();
	generateGrid();
	if(grid.childElementCount == 0)
		grid.innerText = 'No Data';
}

function generateTagsList() {
	tags.innerHTML = '';
	for(let button of window['buttonArray']) {
		if(button.value == '') continue;
		let tag = document.createElement('button');
		tag.classList.add('tag');
		tag.value = button.value;
		tag.title = button.value + ' (' + button.count + ')';
		tag.innerText = button.value;
		tag.tabIndex = -1;
		tag.addEventListener('click',function() {
			// to toggle
			switch(this.getAttribute('filter'))
			{
				case 'include':
					toggleVariable('includeCriteria', this.value);
					toggleVariable('excludeCriteria', this.value);
					this.setAttribute('filter', 'exclude');
					break;
				case 'exclude':
					toggleVariable('excludeCriteria', this.value);
					this.removeAttribute('filter');
					break;
				default:
					toggleVariable('includeCriteria', this.value);
					this.setAttribute('filter', 'include');
					break;
			}
			document.getElementById('include').value = window['includeCriteria'];
			document.getElementById('exclude').value = window['excludeCriteria'];			
			generateGrid();
		});
		tag.addEventListener('contextmenu',function() {
			// to reset
			event.preventDefault();
			switch(this.getAttribute('filter'))
			{
				case 'include':
					toggleVariable('includeCriteria', this.value);
					this.setAttribute('filter', 'exclude');
					break;
				case 'exclude':
					toggleVariable('excludeCriteria', this.value);
					break;
				default:
					break;
			}
			this.removeAttribute('filter');
			document.getElementById('include').value = window['includeCriteria'];
			document.getElementById('exclude').value = window['excludeCriteria'];			
			generateGrid();
		});
		
		if(window['includeCriteria'].split(config.separator).includes(button.value))
			tag.setAttribute('filter', 'include');
		if(window['excludeCriteria'].split(config.separator).includes(button.value))
			tag.setAttribute('filter', 'exclude');
		tags.appendChild(tag);
	}	
}

function generateViewer() {	
	let viewer = document.createElement('div');
	viewer.id = 'viewer';
	viewer.style.visibility = 'hidden';
	viewer.style.opacity = '0';
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);		
	viewer.addEventListener('keyup', function(e) {
		if (event.keyCode === 37 && document.getElementById('viewer-prev') != null) {
			document.getElementById('viewer-prev').click();
		}
		if (event.keyCode === 39 && document.getElementById('viewer-next') != null) {
			document.getElementById('viewer-next').click();
		}
		return false;
	}, false);
	
	document.body.appendChild(viewer);
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
		collage.style.width = (horizontalMenuWidth >= 0.5*window.innerWidth ? 0.5*window.innerWidth : window.innerWidth - horizontalMenuWidth) + 'px';
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
			gridItemImage.setAttribute('alt', item['og']);
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
				document.getElementById('include').value = window['includeCriteria'];
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
	columns = Math.round((window.innerWidth - (window['horizontal'] ? horizontalMenuWidth : 0)) / columns);
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
	window['horizontal'] = horizontalLayout();
	generateLayoutCollage();
	if(window['horizontal']) {
		document.body.setAttribute('layout', 'horizontal');
		menu.style.width = horizontalMenuWidth + 'px';
		if(window.innerHeight < 800)
			tags.classList.remove('expanded');
		else
			tags.classList.add('expanded');
	}
	else {
		document.body.setAttribute('layout', 'vertical');
		menu.style.width = '';
		tags.classList.remove('expanded');
	}
	
	//resize images again
	let thumbWidth = calculateThumbnailSize();
	let itemWidth = thumbWidth + 'px';
	let itemHeight = (thumbWidth*config.grid.thumbnail.ratio) + 'px';
	for(let gridItem of document.querySelectorAll('.grid-item'))
	{
		gridItem.style.width = itemWidth;
		gridItem.style.height = itemHeight;		
	}
	
	//if viewer on, adjust placement again
	adjustViewerMargin();
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
	switch(this.innerText)
	{
	  case 'photo_size_select_actual':
		document.getElementById('preset').innerText = 'photo_size_select_small';
		break
	  case 'photo_size_select_small':
		document.getElementById('preset').innerText = 'photo_size_select_large';
		break;
	  case 'photo_size_select_large':
		document.getElementById('preset').innerText = 'photo_size_select_actual';
		break;
	  default:
		break;
	}
	
	window['preset'] = document.getElementById('preset').innerText;
	
	generateGrid();
}

function onToggleExpander() {
	switch(this.innerText)
	{
	  case 'unfold_more':
		document.querySelector('.expander').innerText = 'unfold_less';
		document.querySelector('.expander').title = 'Close Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
		{
			tag.tabIndex = 0;
		}
		break
	  case 'unfold_less':
		document.querySelector('.expander').innerText = 'unfold_more';
		document.querySelector('.expander').title = 'Expand Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
		{
			tag.tabIndex = -1;
		}
		break;
	  default:
		break;
	}
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
	document.getElementById('include').value = window['includeCriteria'];
	window['excludeCriteria'] = '';
	document.getElementById('exclude').value = window['excludeCriteria'];
	generateGrid();
}

//VIEWER//
function createLinkedList(selector) {
	window['viewer-list'] = [];
	for(let img of document.querySelectorAll(selector))
	{
		window['viewer-list'].push(img);
	}
}

function updateImageNo(image) {
	let imageNo = -1;
	for(let img of window['viewer-list'])
	{
		imageNo++;
		if(img.src == image.src)
		{
			return imageNo;
		}
	}
	return imageNo;
}

function openViewer(image) {
	createLinkedList('.grid-item img');
	openImageInViewer(image.querySelector('img'));
	runLoader();
}

function openImageInViewer(image) {	
	let imgNo = updateImageNo(image);
	
	let viewer = document.getElementById('viewer');
	viewer.setAttribute('index', imgNo);
	viewer.innerHTML = '';
	viewer.tabIndex = 999;
	let viewerPrev = document.createElement('a');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('a');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	let loader = document.createElement('div');
	loader.classList.add('material-icons');
	loader.classList.add('loader');
	loader.addEventListener('click', function() {
		window['loading'] = false;
		runLoader();
		closeViewer();		
	});
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.src = thumbnail.getAttribute('alt');
	img.title = thumbnail.title;
	if(window.innerHeight > window.innerWidth && img.getBoundingClientRect().width >= window.innerWidth)
		img.style.width = 'inherit'; //portrait
	if(window.innerHeight <= window.innerWidth && img.getBoundingClientRect().height >= window.innerHeight)
		img.style.height = 'inherit'; //landscape
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
	img.addEventListener('load', function() {
		setTimeout(function() {
			img.style.opacity = 1;
			if(img.style.transform != 'scale(1)') img.style.transform = 'scale(1)';
			window['loading'] = false;
			runLoader();
		}, 250);
	});
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	if(imgNo-1 >= 0 && window['slideshow'] == null)
		viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null)
		viewer.appendChild(viewerNext);
	viewer.appendChild(loader);
	viewer.appendChild(img);
	viewer.focus();
	window['loading'] = true;
	
	if(imgNo-1 >= 0 && window['slideshow'] == null) {
		document.getElementById('viewer-prev').addEventListener('click', onClickViewerPrev, false);
	}
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null) {
		document.getElementById('viewer-next').addEventListener('click', onClickViewerNext, false);
	}
	img.addEventListener('touchstart', onTouchStart);
	img.addEventListener('touchmove', onTouchMoveViewer, false);
	img.addEventListener('click', closeViewer);
	img.addEventListener('contextmenu', toggleZoom);
	
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	setTimeout(adjustViewerMargin, 50);
}

function onClickViewerPrev() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))-1]);
	window['loading'] = true;
	runLoader();
	return false;
}

function onClickViewerNext() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))+1]);
	window['loading'] = true;
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

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
	let image = viewer.querySelector('img');
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (window.innerHeight - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	if(viewer.style.display == 'flex') {
		toggleZoom();
		return;
	}
	
	stopSlideshow();
	
	viewer.style.opacity = 0;
	viewer.style.visibility = 'hidden';
	viewer.style.height = '';
	viewer.style.display = '';
	viewer.style.overflow = '';
	
	let img = viewer.querySelector('img');
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
	
}

function toggleZoom() {
	if(window['slideshow'] != null) return;
	
	let viewer = document.getElementById('viewer');
	let viewerPrev = document.getElementById('viewer-prev');
	let viewerNext = document.getElementById('viewer-next');
	let viewerImage = viewer.querySelector('img');
	if(viewer.getBoundingClientRect().width > viewerImage.getBoundingClientRect().width) return;
	
	let value = viewer.style.display == 'flex';

	if(viewerPrev != null) viewerPrev.style.display = value ? '' : 'none';
	if(viewerNext != null) viewerNext.style.display = value ? '' : 'none';
	
	viewer.style.display = value ? '' : 'flex';
	viewer.style.overflow = value ? '' : 'auto';
	viewerImage.style.maxWidth = value ? '100%' : '';
	viewer.style.height = value ? '' : viewer.getBoundingClientRect().height;
	viewer.style.paddingTop = value ? adjustViewerMargin() : 0;
	
	document.getElementById('viewer').scrollLeft = document.querySelector('#viewer img').getBoundingClientRect().width*0.5 - window.innerWidth*0.5;
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
		openImageInViewer(document.querySelector('img[alt="' + image.og + '"]'));
		window['loading'] = true;
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
