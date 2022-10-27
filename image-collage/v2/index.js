//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnail filenames to be in format '<prefix>_<filename>' according to preset; original has no prefix
//Data in data.js, variable mosaicArray

//--SETTINGS--//
const title = 'Image Collage';
const presetWidths = [160, 320, 480]; 	// small, medium, large; subject to alignment of columns
const presetPrefix = ['sm', 'md', 'lg']; 	// small, medium, large; property to point to for each object
const filenameSeparator = '_';			// filename to be separator delimited tags excluding file format
const minColumns = 3;			  		// minimum columns to show thumbnails, will override minWidth
const enableDarkMode = true;	  		// shows dark mode toggle
const isDarkMode = true;		  		// initial value if enableDarkMode is false, ignored if enableDarkMode is true
const enableButtonArray = true;		// shows tag array based on underscore separated filename eg. image_item.jpg has tags: image, item
const debugMode = false;		  		// shows console log values on render
const isWidescreen = function() { return window.innerWidth > 1024; } // function to detect wider screen layout
const horizontalMenuWidth = 500; 		// for not gallery, in pixels
const excludedTags = ['覚醒'];			// tags excluded, only if buttonArray is true
const minTagCount = 2;					// anything more than or equal to this will be included in tags

//--VARIABLES--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function generateStats() {
	let filtered = mosaicArray
	.reduce(function(total, current, arr) {
		let names = current.substring(0, current.lastIndexOf('.')).split(filenameSeparator);
		for(let name of names)
		{
			if(excludedTags.includes(name))
				continue;
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
		if(filtered[item] >= minTagCount)
			countArray.push([item, filtered[item]]);
	}
	
	console.log(countArray.sort(function(a,b) { return b[1] - a[1];	}));
}

function startup() {
	if(debugMode) console.log(mosaicArray);
	initializeVariables();	
	generateLayout();
	generateMosaic();
	let mousewheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel";
	if(!isWidescreen() && document.getElementById('mosaic') != null)
	{
		document.getElementById('mosaic').addEventListener(mousewheelEvent, onScroll);
		document.getElementById('mosaic').addEventListener('touchstart', onTouchStart);
		document.getElementById('mosaic').addEventListener('touchmove', onTouchMove);
	}
	if(!enableDarkMode) {
		if(isDarkMode || window['darkMode'] == true) {
			document.getElementsByTagName('html')[0].classList.add('darked');
		}
		else {
			document.getElementsByTagName('html')[0].classList.remove('darked');
		}
	}
	if(enableDarkMode && document.getElementById('darkmode') != null) {
		window['darkMode'] = document.getElementsByTagName('html')[0].classList.contains('darked');
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
		document.getElementById('darkmode').addEventListener('click', function() { window['darkMode'] = !window['darkMode']; });
	}
	setTimeout(setMosaic, 100);
}

function onScroll(e) {
	let main = document.getElementById('main');
	let mosaic = document.getElementById('mosaic');
	let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta
	
	main.style.display = scrollDelta < 0 ? 'none' : '';
	mosaic.style.height = scrollDelta < 0 ? window.innerHeight + 'px' : (window.innerHeight - 300) + 'px';
}

function onTouchStart(e) {
	window['touchY'] = e.touches[0].clientY;
}

function onTouchMove(e) {
	let main = document.getElementById('main');
	let mosaic = document.getElementById('mosaic');
	
	main.style.display = window['touchY'] > e.touches[0].clientY ? 'none' : '';
	mosaic.style.height = window['touchY'] > e.touches[0].clientY ? window.innerHeight + 'px' : (window.innerHeight - 300) + 'px';
}

function togglePreset() {
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
	
	let grid = generateGrid();		
	document.getElementById('mosaic').innerHTML = '';
	document.getElementById('mosaic').appendChild(grid);
	
	generateMosaic();
}

function initializeVariables() {
	window['includeCriteria'] = '';
	window['excludeCriteria'] = '';
	if(!window['isFirefox']) window['isFirefox'] = (/Firefox/i.test(navigator.userAgent));
	if(!window['excluded']) window['excluded'] = [];
	if(!window['preset']) window['preset'] = 'photo_size_select_small';
	if(!window['thumbWidth']) window['thumbWidth'] = presetWidths[0];
}

function generateLayout() {
	document.body.innerHTML = '';
	document.title = title;
	document.querySelector('title').innerText = title;
	generateViewer();
	generateButtonArrayIfEmpty();
	window['isHorizontal'] = isWidescreen() && window['buttonArray'].length > 0
	if(window['isHorizontal'])
		generateHorizontalLayout(); // left player and menu, right covers
	else
		generateVerticalLayout(); // top player and menu, bottom covers
	
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

function generateHorizontalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	bodyTableRow1.appendChild(generateLayoutPlayer());
	bodyTableRow1.appendChild(generateLayoutJukebox());
	
	bodyTableBody.appendChild(bodyTableRow1);
	
	bodyTable.appendChild(bodyTableBody);
	document.body.appendChild(bodyTable);
}

function generateVerticalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	bodyTableRow1.appendChild(generateLayoutPlayer());
	
	let bodyTableRow2 = document.createElement('tr');
	bodyTableRow2.appendChild(generateLayoutJukebox());
	
	bodyTableBody.appendChild(bodyTableRow1);
	bodyTableBody.appendChild(bodyTableRow2);
	
	bodyTable.appendChild(bodyTableBody);
	document.body.appendChild(bodyTable);
}

function generateLayoutPlayer() {
	let bodyTablePlayerCell = document.createElement('td');
	bodyTablePlayerCell.classList.add('jukebox-cell');
	bodyTablePlayerCell.style.textAlign = 'center';
	
	let main = document.createElement('div');
	main.id = 'main';
	let mainTable = document.createElement('table');
	if(window['isHorizontal']) mainTable.style.width = (horizontalMenuWidth) + 'px';
	else mainTable.style.width = '100%';
	if(window['isHorizontal']) mainTable.style.height = '100%';
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-cell');
	
	let title = document.createElement('h1');
	title.classList.add('title');
	title.innerText = 'Image Collage';
	title.addEventListener('click', function() {
		startup();
	});
	
	let description = document.createElement('h5');
	description.innerText = 'サムネをタップすると拡大画像が表示されます';
	
	let disclaimer = document.createElement('h6');
	disclaimer.innerHTML += '<div>Powered by <a href="https://masonry.desandro.com/">Masonry JS</a></div>';
	disclaimer.innerHTML += '<div>©コーエーテクモゲームス All rights reserved.</div>';
	
	mainTableRow1Cell1.appendChild(title);
	mainTableRow1Cell1.appendChild(description);
	mainTableRow1Cell1.appendChild(disclaimer);
	
	let mainTableRow2 = document.createElement('tr');
	
	let mainTableRow2Cell1 = document.createElement('td');
	mainTableRow2Cell1.classList.add('jukebox-cell');
	
	if(typeof enableButtonArray == 'boolean' && enableButtonArray == true) {
		let include = document.createElement('input');
		include.id = 'include';
		include.style.height = '20px';
		include.placeholder = '以内の…';
		include.addEventListener('input',function() {
			window['includeCriteria'] = document.getElementById('include').value;
			
			let grid = generateGrid();		
			document.getElementById('mosaic').innerHTML = '';
			document.getElementById('mosaic').appendChild(grid);
			
			generateMosaic();
		});
		mainTableRow2Cell1.appendChild(include);
		
		let exclude = document.createElement('input');
		exclude.id = 'exclude';
		exclude.style.height = '20px';
		exclude.placeholder = '以外の…';
		exclude.addEventListener('input',function() {
			window['excludeCriteria'] = document.getElementById('exclude').value;
			
			let grid = generateGrid();		
			document.getElementById('mosaic').innerHTML = '';
			document.getElementById('mosaic').appendChild(grid);
			
			generateMosaic();
		});
		mainTableRow2Cell1.appendChild(exclude);
	}
	
	let tags = document.createElement('div');
	tags.classList.add('tags');
	tags.addEventListener('hover', function() { this.focus(); });
	if(window['isHorizontal']) {
		tags.style.height = (0.7 * window.innerHeight) + 'px';
		tags.style.overflowY = 'auto';
	}
	else {
		tags.style.width = '100vw';
		tags.style.maxHeight = '2em';
		tags.style.overflowX = 'auto';
		tags.style.whiteSpace = 'nowrap';
	}
	
	for(let button of window['buttonArray']) {
		if(button == '') continue;
		let tag = document.createElement('button');
		tag.classList.add('tag');
		tag.value = button;
		tag.innerText = button;
		tag.addEventListener('click',function() {
			if(window['includeCriteria'].includes(this.value)) {
				window['includeCriteria'] = window['includeCriteria'].replace('|' + this.value,'').replace(this.value,'');
				if(window['includeCriteria'].startsWith('|')) window['includeCriteria'] = window['includeCriteria'].substring(1);
				this.classList.toggle('button-active');
			}
			else {
				window['includeCriteria'] += (window['includeCriteria'].length > 0 ? '|' : '') + this.value;
				this.classList.toggle('button-active');
			}
			document.getElementById('include').value = window['includeCriteria'];
			
			setTimeout(setMosaic, 100);
		});
		tag.addEventListener('contextmenu',function() {
			event.preventDefault();
			if(window['excludeCriteria'].includes(this.value)) {
				window['excludeCriteria'] = window['excludeCriteria'].replace('|' + this.value,'').replace(this.value,'');
				if(window['excludeCriteria'].startsWith('|')) window['excludeCriteria'] = window['excludeCriteria'].substring(1);
				this.classList.toggle('button-inactive');
				// this.style.border = '';
				// this.style.color = '';
			}
			else {
				window['excludeCriteria'] += (window['excludeCriteria'].length > 0 ? '|' : '') + this.value;
				this.classList.toggle('button-inactive');
				// this.style.border = '1px solid gray';
				// this.style.color = 'gray';
			}
			document.getElementById('exclude').value = window['excludeCriteria'];
			
			setTimeout(setMosaic, 100);
		});
		tags.appendChild(tag);
	}
	
	mainTableRow2Cell1.appendChild(tags);
	
	let mainTableRow3 = document.createElement('tr');
	
	let mainTableRow3Cell1 = document.createElement('td');
	mainTableRow3Cell1.classList.add('jukebox-cell');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	if(enableDarkMode)
	{
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.style.padding = '0 5px';
		darkmode.classList.add('darkmode');
		darkmode.classList.add('material-icons');
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		settings.appendChild(darkmode);		
	}
	
	if(presetWidths && presetWidths.length == 3)
	{
		let preset = document.createElement('a');
		preset.id = 'preset';
		preset.style.padding = '0 5px';
		preset.classList.add('preset');
		preset.classList.add('material-icons');
		preset.href = 'javascript:void(0);';
		preset.innerText = window['preset'];
		preset.addEventListener('click', togglePreset);
		settings.appendChild(preset);
	}
		
	let back = document.createElement('a');
	back.classList.add('back');
	back.style.padding = '0 5px';
	back.style.verticalAlign = 'top';
	back.href = '../../index.html';
	back.innerText = 'Back';
	settings.appendChild(back);
		
	mainTableRow3Cell1.appendChild(settings);
	
	let counter = document.createElement('h6');
	let count = document.createElement('span');
	count.id = 'counter';
	count.innerText = 0;
	counter.appendChild(count);
	
	let suffix = document.createElement('span');
	suffix.innerText = ' 画像';
	counter.appendChild(suffix);
	
	mainTableRow3Cell1.appendChild(counter);
	
	mainTableRow1.appendChild(mainTableRow1Cell1);
	mainTableRow2.appendChild(mainTableRow2Cell1);
	mainTableRow3.appendChild(mainTableRow3Cell1);
	mainTableBody.appendChild(mainTableRow1);
	mainTableBody.appendChild(mainTableRow2);
	mainTableBody.appendChild(mainTableRow3);
	mainTable.appendChild(mainTableBody);
	main.appendChild(mainTable);
	bodyTablePlayerCell.appendChild(main);

	return bodyTablePlayerCell;	
}

function generateButtonArrayIfEmpty() {
	if(typeof enableButtonArray == 'boolean') {
		let val = enableButtonArray;
		window['buttonArray'] = [];
		if(!val) return;
	}
	
	//generate tags by design
	window['buttonArray'] = mosaicArray
	.map(function(file) {
		let filenameIndex = file.filename.includes('/') ? file.filename.lastIndexOf('/') : -1;
		return getFilenameInfo(file.filename).filename;
	})
	.join(filenameSeparator)
	.replace(/ /g, '')
	// .replace(/.jpg/g, filenameSeparator)
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
		return item.count >= minTagCount;
	})
	.sort(function(a,b) {
		return b.count - a.count;
	})
	.map(m => m.value);
	if(debugMode) console.log(window['buttonArray']);
}

function generateLayoutJukebox() {
	let bodyTableJukeboxCell = document.createElement('td');
	// bodyTableJukeboxCell.classList.add('jukebox-cell');

	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	if(window['isHorizontal']) mosaic.style.width = (window.innerWidth - horizontalMenuWidth) + 'px';
	mosaic.style.height = (window.innerHeight) + 'px';
	mosaic.addEventListener('hover', function() { this.focus(); });

	let grid = generateGrid();
	mosaic.appendChild(grid);
	bodyTableJukeboxCell.appendChild(mosaic);

	return bodyTableJukeboxCell;
}

let preloads = [];
function generateGrid() {
	let prevValue = '';
	let grid = document.createElement('div');
	grid.classList.add('grid');	
	
	let gridSizer = document.createElement('div');
	gridSizer.classList.add('grid-sizer');
	grid.appendChild(gridSizer);
	
	let includeArray = window['includeCriteria'].split('|');
	let excludeArray = window['excludeCriteria'].split('|');
	if(debugMode) console.log('included', includeArray);
	if(debugMode) console.log('excluded', excludeArray);
	let filterArray = mosaicArray
	.filter(m => 
		(window['includeCriteria'].length == 0 || includeArray.filter(s => m.filename.includes(s)).length == includeArray.length) && 
		(window['excludeCriteria'].length == 0 || excludeArray.filter(s => !m.filename.includes(s)).length == excludeArray.length)
	)
	.sort(function(a,b) {
		return a.filename.localeCompare(b.filename, 'ja');
	});
	
	calculateThumbnailSize();
	if(debugMode) console.log('thumbnailSize', window['thumbWidth']);
	for(let item of filterArray) {
		let imageUrl = item.filename;
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		
		if(prevValue != imageUrl[0]) {
			let overlay = document.createElement('div');
			overlay.classList.add('static-banner');
			overlay.innerText = imageUrl[0];
			gridItem.appendChild(overlay);
			prevValue = imageUrl[0];
		}
		
		let gridImage = document.createElement('div');
		gridImage.id = Date.now();
		gridImage.tabIndex = 0;
		gridImage.classList.add('grid-image');
		gridImage.title = getFilenameInfo(imageUrl).filename;
		gridImage.setAttribute('alt', item['og']);
		gridImage.style.width = window['thumbWidth'] + 'px';
		gridImage.style.height = (window['thumbWidth']*9/16) + 'px';
		gridImage.style.backgroundSize = gridImage.style.width;
		gridImage.addEventListener('mouseover',function() {
			this.style.backgroundSize = (1.2*this.offsetWidth) + 'px';
		});
		gridImage.addEventListener('mouseout',function() {
			this.style.backgroundSize = this.offsetWidth + 'px';
		});
		gridImage.addEventListener('click', function() {
			openViewer(this);
		});
		gridImage.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			exclude(this);
			return false;
		}, false);
		let fullImageUrl = addUrlClause(item[getThumbnailPrefix()]);
		gridImage.style.backgroundImage = fullImageUrl || 'https://knneo.github.io/resources/spacer.gif';
		
		//pre-loading: will cause animation lag
		// if(preloads.length < mosaicArray.length) {
			// let preload = new Image();
			// preload.src = item['og'];
			// preloads.push(preload);
		// }
		
		gridItem.appendChild(gridImage);
		grid.appendChild(gridItem);		
	}

	return grid;
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

//TODO: create algorithm to determine column size based on image size provided
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
	columns = Math.floor((window.innerWidth - (window['isHorizontal'] ? horizontalMenuWidth : 0)) / columns);
	return columns < minColumns ? minColumns : columns;
}

//ALSO TODO: see if mosaic can be updated for each item width instead of rendering whole grid again
function calculateThumbnailSize() {	
	
	let remainder = 0;//screenWidth;
	// while(remainder > window['thumbWidth'])
	// {
		// remainder -= window['thumbWidth'];
		// columns++;
		// if(debugMode) console.log('remainder', remainder);
		// if(debugMode) console.log('columns', columns);
	// }

	let defaultRemainder = 20;	
	let grid = document.querySelector('#mosaic');
	let gridChild = grid?.firstChild;
	let columns = calculateColumns();
	let screenWidth = window.innerWidth - (grid != null && gridChild != null ? grid.getBoundingClientRect().width - gridChild.getBoundingClientRect().width + (columns*2) : 30) - (window['isHorizontal'] ? horizontalMenuWidth : 0);
	console.log(grid, gridChild);
	window['thumbWidth'] = screenWidth / columns;
	// if(columns < minColumns)
	// {
		// window['thumbWidth'] = screenWidth / minColumns;
		// return;
	// }
	// if(remainder > defaultRemainder)
	// {
		// window['thumbWidth'] = window['thumbWidth'] + 1;
		// return calculateThumbnailSize();
	// }
	
	if(debugMode)
		console.log('calculateThumbnailSize', window['thumbWidth']);
	return;
}

function addUrlClause(url) {
	return url ? "url('" + url + "')" : url;
}

function removeUrlClause(property) {
	return property.replace('url("','').replace('")','');
}

function exclude(image) {
	if(!window['excluded'].includes(image.id))
		window['excluded'].push(image.id);

	if(debugMode) console.log('exclude', window['excluded']);
			
	// only click on grid-items
	if (matchesSelector(image.parentElement, '.grid-item')) {
		// remove clicked element
		window['msnry'].remove(image.parentElement);
		// layout remaining item elements
		window['msnry'].layout();
	}
}

function setMosaic() {
	document.getElementById('mosaic').innerHTML = '';
	document.getElementById('mosaic').appendChild(generateGrid());		
	generateMosaic();
}

function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		document.getElementById('counter').innerText = mosaic.getElementsByClassName('grid-image').length;
		
		var grid = document.querySelector('.grid');
		imagesLoaded( grid, function() {
			// init Isotope after all images have loaded
			window['msnry'] = new Masonry( grid, {
				itemSelector: '.grid-item',
				percentPosition: true
			});
			window['msnry'].layout();
		});
	}
	else
	{
		document.getElementById('counter').parentElement.innerHTML = '';
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//viewer
let imageNo = 0;
let linkedImgList = [];
function createLinkedList() {
	linkedImgList = [];
	for(let img of document.getElementsByClassName('grid-image'))
	{
		linkedImgList.push(img);
	}
}

function updateImageNo(image) {
	imageNo = 0;
	for(let img of linkedImgList)
	{
		if(img.style.backgroundImage == image.style.backgroundImage)
		{
			return imageNo;
		}
		imageNo++;
	}
	return 0;
}

function openViewer(image) {
	createLinkedList();
	openImageInViewer(image);
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
	img.src = removeUrlClause(thumbnail.getAttribute('alt'));
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
	if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
	if(imgNo+1 < linkedImgList.length) viewer.appendChild(viewerNext);
	viewer.appendChild(loader);
	viewer.appendChild(img);
	viewer.focus();
	window['loading'] = true;
	
	if(imgNo-1 >= 0) {
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			openImageInViewer(linkedImgList[imgNo-1]);
			window['loading'] = true;
			runLoader();
			return false;
		}, false);
	}
	if(imgNo+1 < linkedImgList.length) {
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			openImageInViewer(linkedImgList[imgNo+1]);
			window['loading'] = true;
			runLoader();
			return false;
		}, false);
	}
	img.addEventListener('click', closeViewer);
	
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
	viewer.style.opacity = 0;
	viewer.style.visibility = 'hidden';
	
	let img = viewer.querySelector('img');
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
}

function getFilenameInfo(url) {
	let filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
	let extension = url.substring(url.lastIndexOf('.')+1);
	return {filename, extension};
}

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
	if(window['loading']) setTimeout(runLoader, 500);
	else
	{
		for(let loader of document.querySelectorAll('.loader'))
		{
			loader.parentElement.removeChild(loader);
		}
	}
}