//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnail filenames to be in format '<prefix>_<filename>' according to preset; original has no prefix
//Data in data.js, variable mosaicArray

//--SETTINGS--//
const defaultTitle = 'Image Collage';
const defaultDescription = 'Gallery based on tag separated filenames\n\n©コーエーテクモゲームス All rights reserved.';
const defaultIncludePlaceholder = '以内の…';
const defaultExcludePlaceholder = '以外の…';
const showBanner = true;					// will show first character of sort property
const bannerPrefixLength = 1;				// show number of prefix characters
const defaultSortOrder = 'desc';			// options: asc, desc; defaults to asc
const defaultSortLocale = 'ja';				// based on BCP 47 language tag
const presetWidths = [160, 320, 480]; 		// small, medium, large; subject to alignment of columns
const presetPrefix = ['sm', 'md', 'lg']; 	// small, medium, large; property to point to for each object
const filenameSeparator = '_';				// filename to be separator delimited tags excluding file format
const minColumns = 3;			  			// minimum no. of columns to show thumbnails
const enableDarkMode = true;	  			// shows dark mode toggle
const enableButtonArray = true;				// shows tag array based on filename split by filenameSeparator
const enableSlideshow = true;				// will show random images on viewer
const slideshowInterval = 5;				// only if enableSlideshow is true, in seconds
const debugMode = false;		  			// shows console log values on render
const isWidescreen = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
} 											// function to detect wider screen layout
const horizontalMenuWidth = 500; 			// for not gallery, in pixels
const minTagCount = 2;						// anything more than or equal to this will be included in tags, default 1
const maxTagCount = 9999;					// anything less than or equal to this will be included in tags, default 999
const excludedTags = ['覚醒'];				// tags will be excluded from stats, filenames in data will be filtered
const hiddenTags = ['2013','2014','2015','2016','2017','2018','2019','2020','2021','2022','2023'];
// tags will be hidden from selection, filenames in data will NOT be filtered
const thumbnailRatio = 9/16;				// standard thumbnail image ratio, can be math expression or number

//--VARIABLES--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
	initializeVariables();
	generateButtonArray();
	generateLayout();
	generateGrid();
	generateViewer();
	let mousewheelEvent = isFirefox ? 'DOMMouseScroll' : 'mousewheel';
	let mosaic = document.getElementById('mosaic');
	if(!window['horizontal'] && mosaic != null)
	{
		mosaic.addEventListener(mousewheelEvent, onScroll);
		mosaic.addEventListener('touchstart', onTouchStart);
		mosaic.addEventListener('touchmove', onTouchMove);
	}

	window['screenWidth'] = calculateThumbnailSize();
	generateGrid();
}

function initializeVariables() {
	window['isFirefox'] = (/Firefox/i.test(navigator.userAgent));
	window['includeCriteria'] = '';
	window['excludeCriteria'] = '';
	window['horizontal'] = isWidescreen();
	window['preset'] = 'photo_size_select_small';
	window['screenWidth'] = null;
	window['thumbWidth'] = presetWidths[0];
	window['slideshow'] = null;
}

function generateLayout() {
	document.body.innerHTML = '';
	document.title = defaultTitle;
	if(window['horizontal'])
		generateHorizontalLayout(); // left menu, right grid
	else
		generateVerticalLayout(); // top menu, bottom grid
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

function generateButtonArray() {
	if(typeof enableButtonArray == 'boolean') {
		let val = enableButtonArray;
		window['buttonArray'] = [];
		if(!val) return;
	}
	
	//generate tags by design
	window['buttonArray'] = generateFiltered()
	.map(function(file) {
		let filenameIndex = file.filename.includes('/') ? file.filename.lastIndexOf('/') : -1;
		return getFilenameInfo(file.filename).filename;
	})
	.join(filenameSeparator)
	// .replace(/ /g, '')
	.split(filenameSeparator)
	.reduce(function(total, current, index, array) {
		let updated = total;
		if(total.filter(a => a.value == current).length > 0) {
			let nonUpdated = total.filter(a => a.value == current)[0];
			let oldCount = nonUpdated.count;
			
			updated = total.filter(a => a.value.toLowerCase() != current.toLowerCase());
			updated.push({
				value: current,
				count: oldCount + 1,
			});
		}
		else {
			updated.push({
				value: current,
				count: 1,
			});
		}		
		return updated;
	},[])
	.filter(function(item) {
		return item.count >= minTagCount && item.count <= maxTagCount && hiddenTags.filter(t => item.value.includes(t)).length < 1;
	})
	.sort(function(a,b) {
		return b.count - a.count;
	});
	if(debugMode) console.log(window['buttonArray']);
}

function generateHorizontalLayout() {
	let bodyTable = document.createElement('div');
	bodyTable.classList.add('table');
	bodyTable.style.width = '100%';
	if(!window['horizontal']) bodyTable.style.flexDirection = 'column';
	
	let bodyTableRow1 = document.createElement('div');
	bodyTable.appendChild(generateLayoutMenu());
	bodyTable.appendChild(generateLayoutCollage());

	document.body.appendChild(bodyTable);
}

function generateVerticalLayout() {
	let bodyTable = document.createElement('div');
	bodyTable.classList.add('table');
	bodyTable.style.width = '100%';
	if(!window['horizontal']) bodyTable.style.flexDirection = 'column';
	
	let bodyTableRow1 = document.createElement('div');
	bodyTable.appendChild(generateLayoutMenu());
	
	let bodyTableRow2 = document.createElement('div');
	bodyTable.appendChild(generateLayoutCollage());
	
	document.body.appendChild(bodyTable);
}

function generateLayoutMenu() {
	let bodyTablePlayerCell = document.createElement('div');
	bodyTablePlayerCell.classList.add('menu-div');
	bodyTablePlayerCell.style.textAlign = 'center';
	
	let mainTable = document.createElement('div');
	mainTable.id = 'main';
	mainTable.style.textAlign = 'center';
	if(window['horizontal']) 
		mainTable.style.width = (horizontalMenuWidth >= 0.5*window.innerWidth ? 0.5*window.innerWidth : horizontalMenuWidth) + 'px';
	else 
		mainTable.style.width = '100%';
	if(window['horizontal']) mainTable.style.height = '100%';
	
	let mainTableBody = document.createElement('div');
	
	let mainTableRow1 = document.createElement('div');
	
	let mainTableRow1Cell1 = document.createElement('div');
	mainTableRow1Cell1.classList.add('menu');
	
	let title = document.createElement('h1');
	title.classList.add('title');
	title.innerText = defaultTitle;
	title.addEventListener('click', startup);
	
	let description = document.createElement('h5');
	description.classList.add('description');
	description.innerText = defaultDescription;
	
	mainTableRow1Cell1.appendChild(title);
	mainTableRow1Cell1.appendChild(description);
		
	let mainTableRow2Cell1 = document.createElement('div');
	
	if(typeof enableButtonArray == 'boolean' && enableButtonArray == true) {
		let include = document.createElement('input');
		include.id = 'include';
		include.classList.add('filter');
		include.style.fontSize = '1em';
		include.style.maxWidth = '45%';
		include.placeholder = defaultIncludePlaceholder;
		include.addEventListener('input',function() {
			window['includeCriteria'] = document.getElementById('include').value;
			generateGrid();
		});
		mainTableRow2Cell1.appendChild(include);
		
		let exclude = document.createElement('input');
		exclude.id = 'exclude';
		exclude.classList.add('filter');
		exclude.style.fontSize = '1em';
		exclude.style.maxWidth = '45%';
		exclude.placeholder = defaultExcludePlaceholder;
		exclude.addEventListener('input',function() {
			window['excludeCriteria'] = document.getElementById('exclude').value;			
			generateGrid();
		});
		mainTableRow2Cell1.appendChild(exclude);
	}
	
	let tags = document.createElement('div');
	tags.classList.add('tags');
	if(window['horizontal']) {
		tags.classList.add('horizontal');
		// tags.style.height = 'calc(100vh - 260px)';
		// tags.style.overflowY = 'auto';
	}
	else {
		tags.classList.add('vertical');
		// tags.style.width = '100vw';
		// tags.style.maxHeight = '2em';
		// tags.style.overflowX = 'auto';
		// tags.style.whiteSpace = 'nowrap';
	}
	
	for(let button of window['buttonArray']) {
		if(button.value == '') continue;
		let tag = document.createElement('button');
		tag.classList.add('tag');
		tag.value = button.value;
		tag.title = button.value + ' (' + button.count + ')';
		tag.innerText = button.value;
		tag.addEventListener('click',function() {
			// this.classList.toggle('button-active');
			toggleVariable('includeCriteria', this.value);
			document.getElementById('include').value = window['includeCriteria'];
			generateGrid();
		});
		tag.addEventListener('contextmenu',function() {
			event.preventDefault();
			// this.classList.toggle('button-active');
			toggleVariable('excludeCriteria', this.value);
			document.getElementById('exclude').value = window['excludeCriteria'];
			generateGrid();
		});
		tags.appendChild(tag);
	}
	
	mainTableRow2Cell1.appendChild(tags);
	
	let mainTableRow3 = document.createElement('div');
	
	let mainTableRow3Cell1 = document.createElement('div');
	mainTableRow3Cell1.classList.add('menu');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	let clear = document.createElement('a');
	clear.classList.add('clear');
	clear.classList.add('settings-icon');
	clear.classList.add('material-icons');
	clear.title = 'Clear Search & Tags';
	clear.href = 'javascript:void(0);';
	clear.innerText = 'clear_all';
	clear.addEventListener('click', onClearAll);
	settings.appendChild(clear);		
	
	if(!window['horizontal'])
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
	
	if(enableDarkMode)
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
	
	if(presetWidths && presetWidths.length == 3)
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
	
	if(enableSlideshow)
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
		
	let back = document.createElement('a');
	back.classList.add('back');
	back.style.padding = '0 5px';
	back.style.verticalAlign = 'top';
	back.href = '../../index.html';
	back.innerText = 'knneo.github.io';
	settings.appendChild(back);
		
	mainTableRow3Cell1.appendChild(settings);
	
	mainTable.appendChild(mainTableRow1Cell1);
	mainTable.appendChild(mainTableRow2Cell1);
	mainTable.appendChild(mainTableRow3Cell1);
	bodyTablePlayerCell.appendChild(mainTable);

	return mainTable;	
}

function generateStats() {
	let filtered = generateFiltered(mosaicArray)
	.reduce(function(total, current, arr) {
		let names = current.filename.substring(0, current.filename.lastIndexOf('.')).split(filenameSeparator);
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
		if(filtered[item] >= minTagCount && filtered[item] <= maxTagCount)
			countArray.push([item, filtered[item]]);
	}
	
	alert(countArray.sort(function(a,b) { return b[1] - a[1]; }).map(m => m[0] + ' - ' + m[1]).join('\n'));
}

function generateLayoutCollage() {
	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	if(window['horizontal']) 
		mosaic.style.width = (horizontalMenuWidth >= 0.5*window.innerWidth ? 0.5*window.innerWidth : window.innerWidth - horizontalMenuWidth) + 'px';
	mosaic.style.height = (window.innerHeight) + 'px';

	let grid = document.createElement('div');
	grid.id = 'grid';
	grid.classList.add('grid');
	mosaic.appendChild(grid);

	return mosaic;
}

function generateGrid() {
	let prevValue = '';
	let grid = document.getElementById('grid');
	let columns = calculateColumns();
	calculateThumbnailSize();
	grid.innerHTML = '';
	
	let filterArray = generateFiltered().sort(function(a,b) {
		if(!a.sort || !b.sort)
			return 0;
		if(defaultSortOrder == 'desc')
			return b.sort.localeCompare(a.sort, defaultSortLocale);
		return a.sort.localeCompare(b.sort, defaultSortLocale);
	});
	
	if(debugMode) console.log("window['thumbWidth']", window['thumbWidth']);
	let itemWidth = window['thumbWidth'] + 'px';
	let itemHeight = (window['thumbWidth']*thumbnailRatio) + 'px';
	grid.style.gridTemplateColumns = (itemWidth + ' ').repeat(columns);
	
	for(let item of filterArray) {
		let imageUrl = item.filename;
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.style.width = itemWidth;
		gridItem.style.height = itemHeight;
		
		let prefix = imageUrl.substring(0, bannerPrefixLength);
		if(showBanner && prevValue != prefix) {
			let overlay = document.createElement('div');
			overlay.classList.add('static-banner');
			overlay.innerText = prefix;
			gridItem.appendChild(overlay);
			prevValue = prefix;
		}
		
			let gridItemImage = document.createElement('img');
		
			gridItemImage.title = getFilenameInfo(imageUrl).filename.split(filenameSeparator).join('\n');
			gridItemImage.setAttribute('alt', item['og']);
			// gridItemImage.style.backgroundSize = itemWidth;
			// gridItemImage.style.objectFit = 'cover';
			// gridItemImage.addEventListener('mouseover',function() {
				// this.style.backgroundSize = (1.2*this.offsetWidth) + 'px';
			// });
			// gridItemImage.addEventListener('mouseout',function() {
				// this.style.backgroundSize = this.offsetWidth + 'px';
			// });
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
				generateGrid();
				return false;
			}, false);
			// let fullImageUrl = addUrlClause(item[getThumbnailPrefix()]);
			gridItemImage.src = item[getThumbnailPrefix()] || 'https://knneo.github.io/resources/spacer.gif';
			
			gridItem.appendChild(gridItemImage);
			
		grid.appendChild(gridItem);
	}

	document.querySelector('.counter').innerText = filterArray.length;
	return grid;
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

function generateFiltered() {
	let includeArray = window['includeCriteria'].split('|');
	let excludeArray = window['excludeCriteria'].split('|');
	if(debugMode) console.log('included', includeArray);
	if(debugMode) console.log('excluded', excludeArray);
	return mosaicArray.filter(m => 
		(window['includeCriteria'].length == 0 || includeArray.filter(s => m.filename.toLowerCase().includes(s.toLowerCase())).length == includeArray.length) && 
		(window['excludeCriteria'].length == 0 || excludeArray.filter(s => !m.filename.toLowerCase().includes(s.toLowerCase())).length == excludeArray.length) &&
		excludedTags.filter(f => m.filename.includes(f)).length < 1
	);
}

function getThumbnailPrefix() {
	let prefix = '';
	
	switch(window['preset'])
	{
	  case 'photo_size_select_small':
		prefix = presetPrefix[0];
		break;
	  case 'photo_size_select_large':
		prefix = presetPrefix[1];
		break;
	  case 'photo_size_select_actual':
		prefix = presetPrefix[2];
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
		columns = presetWidths[0];
		break;
	  case 'photo_size_select_large':
		columns = presetWidths[1];
		break;
	  case 'photo_size_select_actual':
		columns = presetWidths[2];
	  default:
		break;
	}
	columns = Math.floor((window.innerWidth - (window['horizontal'] ? horizontalMenuWidth : 0)) / columns);
	return columns < minColumns ? minColumns : columns;
}

function calculateThumbnailSize() {
	let grid = document.getElementById('grid');
	let gridChild = grid?.firstChild;
	let columns = calculateColumns();
	let screenWidth = window['screenWidth'] ?? grid.getBoundingClientRect().width - (2*columns);
	window['thumbWidth'] = screenWidth / columns;
	
	if(debugMode) {
		console.log('screenWidth', screenWidth);
		console.log('columns', columns);
		console.log('calculateThumbnailSize', window['thumbWidth']);
	}
	return screenWidth;
}

//EVENTS//
function onScroll(e) {
	let main = document.getElementById('main');
	let mosaic = document.getElementById('mosaic');
	let tags = document.querySelector('.tags');
	let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta
	
	main.style.height = scrollDelta < 0 ? 0 : '';
	tags.style.height = main.style.height;
	mosaic.style.height = scrollDelta < 0 ? window.innerHeight + 'px' : (window.innerHeight - main.getBoundingClientRect().height) + 'px';
}

function onTouchStart(e) {
	window['touchY'] = e.touches[0].clientY;
}

function onTouchMove(e) {
	let main = document.getElementById('main');
	let mosaic = document.getElementById('mosaic');
	let tags = document.querySelector('.tags');
	
	main.style.height = window['touchY'] > e.touches[0].clientY ? 0 : '';
	tags.style.height = main.style.height;
	mosaic.style.height = window['touchY'] > e.touches[0].clientY ? window.innerHeight + 'px' : (window.innerHeight - main.getBoundingClientRect().height) + 'px';
}

function onTogglePreset() {
	switch(this.innerText)
	{
	  case 'photo_size_select_actual':
		document.getElementById('preset').innerText = 'photo_size_select_small';
		window['thumbWidth'] = presetWidths[0];
		break
	  case 'photo_size_select_small':
		document.getElementById('preset').innerText = 'photo_size_select_large';
		window['thumbWidth'] = presetWidths[1];
		break;
	  case 'photo_size_select_large':
		document.getElementById('preset').innerText = 'photo_size_select_actual';
		window['thumbWidth'] = presetWidths[2];
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
		let toMore = document.querySelector('.vertical');
		toMore.classList.remove('vertical');
		toMore.classList.add('horizontal');
		break
	  case 'unfold_less':
		document.querySelector('.expander').innerText = 'unfold_more';
		document.querySelector('.expander').title = 'Expand Tags';
		let toLess = document.querySelector('.horizontal');
		toLess.classList.remove('horizontal');
		toLess.classList.add('vertical');
		break;
	  default:
		break;
	}
	
	window['preset'] = document.getElementById('preset').innerText;
	
	generateGrid();
}

function onClearAll() {
	for(let button of document.querySelectorAll('.button-active'))
	{
		button.classList.remove('button-active');
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
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo-1]);
			window['loading'] = true;
			runLoader();
			return false;
		}, false);
	}
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null) {
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo+1]);
			window['loading'] = true;
			runLoader();
			return false;
		}, false);
	}
	img.addEventListener('click', closeViewer);
	img.addEventListener('contextmenu', toggleZoom);
	
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	setTimeout(adjustViewerMargin, 50);
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
		window['slideshow'] = setTimeout(runSlideshow, slideshowInterval * 1000);	
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

//HELPERS//
function addUrlClause(url) {
	return url ? "url('" + url + "')" : url;
}

function removeUrlClause(property) {
	return property.replace('url("','').replace('")','');
}
