//--NOTES--//
//Default separator is '_' (underscore) unless stated in settings
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnail filenames to be in format '<prefix>_<filename>' according to preset; original has no prefix
//Data in data.js, variable mosaicArray

//--SETTINGS--//
const defaultTitle = 'Music Jukebox';
const defaultDescription = 'Embed music collections from Spotify/Apple Music\n\nAll images, embed sources (c) respective owners';
const showBanner = true;					// will show first character of sort property
const bannerPrefixLength = 4;				// show number of prefix characters
const defaultSortOrder = 'asc';			// options: asc, desc; defaults to asc
const defaultSortLocale = 'ja';				// based on BCP 47 language tag
const presetWidths = [160, 320, 480]; 		// small, medium, large; subject to alignment of columns
const presetPrefix = ['sm', 'md', 'lg']; 	// small, medium, large; property to point to for each object
const filenameSeparator = '_';				// filename to be separator delimited tags excluding file format
const minColumns = 3;			  			// minimum no. of columns to show thumbnails
const enableDarkMode = true;	  			// shows dark mode toggle
const isDarkMode = true;		  			// initial value if enableDarkMode is false, ignored if enableDarkMode is true
const debugMode = false;		  			// shows console log values on render
const menuWidth = '800px'; 					// when in horizontal layout, in [px, vw, vh]
const thumbnailRatio = 1;					// standard thumbnail image ratio, can be math expression or number
const isWidescreen = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
} 											// function to detect wider screen layout

//--VARIABLES--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
	initializeVariables();
	generateLayout();
	generateGrid();
	let mousewheelEvent = isFirefox ? 'DOMMouseScroll' : 'mousewheel';
	let mosaic = document.getElementById('mosaic');
	if(!window['horizontal'] && mosaic != null)
	{
		mosaic.addEventListener(mousewheelEvent, onScroll);
		mosaic.addEventListener('touchstart', onTouchStart);
		mosaic.addEventListener('touchmove', onTouchMove);
	}
	if(!enableDarkMode) {
		if(isDarkMode || window['darkMode'] == true) {
			document.getElementsByTagName('html')[0].classList.add('darked');
		}
		else {
			document.getElementsByTagName('html')[0].classList.remove('darked');
		}
	}
	let darkmode = document.getElementById('darkmode');
	if(enableDarkMode && darkmode != null) {
		window['darkMode'] = document.getElementsByTagName('html')[0].classList.contains('darked');
		darkmode.addEventListener('click', toggleDarkMode);
		darkmode.addEventListener('click', function() { window['darkMode'] = !window['darkMode']; });
	}
	
	window['screenWidth'] = calculateThumbnailSize();
	generateGrid();
}

function initializeVariables() {
	window['isFirefox'] = (/Firefox/i.test(navigator.userAgent));
	window['horizontal'] = isWidescreen();
	window['preset'] = 'photo_size_select_small';
	window['screenWidth'] = null;
	window['thumbWidth'] = presetWidths[0];
}

function generateLayout() {
	document.body.innerHTML = '';
	document.title = defaultTitle;
	if(window['horizontal'])
		generateHorizontalLayout(); // left menu, right grid
	else
		generateVerticalLayout(); // top menu, bottom grid
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
		mainTable.style.width = menuWidth;
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
	mainTableRow2Cell1.style.position = 'relative';
		
	let tags = document.createElement('div');
	tags.classList.add('player');
	if(window['horizontal']) {
		tags.style.height = 'calc(100vh - 260px)';
		tags.style.overflowY = 'auto';
	}
	else {
		tags.style.width = '100vw';
		tags.style.maxHeight = 'calc(100vh - 260px)';
		tags.style.overflowX = 'auto';
		tags.style.whiteSpace = 'nowrap';
	}
	
	//player div
	// for(let button of window['buttonArray']) {
		// if(button.value == '') continue;
		// let tag = document.createElement('button');
		// tag.classList.add('tag');
		// tag.value = button.value;
		// tag.title = button.value + ' (' + button.count + ')';
		// tag.innerText = button.value;
		// tag.addEventListener('click',function() {
			// if(window['includeCriteria'].includes(this.value)) {
				// window['includeCriteria'] = window['includeCriteria'].replace('|' + this.value,'').replace(this.value,'');
				// if(window['includeCriteria'].startsWith('|')) window['includeCriteria'] = window['includeCriteria'].substring(1);
				// this.classList.toggle('button-active');
			// }
			// else {
				// window['includeCriteria'] += (window['includeCriteria'].length > 0 ? '|' : '') + this.value;
				// this.classList.toggle('button-active');
			// }
			// document.getElementById('include').value = window['includeCriteria'];
			// generateGrid();
		// });
		// tag.addEventListener('contextmenu',function() {
			// event.preventDefault();
			// if(window['excludeCriteria'].includes(this.value)) {
				// window['excludeCriteria'] = window['excludeCriteria'].replace('|' + this.value,'').replace(this.value,'');
				// if(window['excludeCriteria'].startsWith('|')) window['excludeCriteria'] = window['excludeCriteria'].substring(1);
				// this.classList.toggle('button-inactive');
			// }
			// else {
				// window['excludeCriteria'] += (window['excludeCriteria'].length > 0 ? '|' : '') + this.value;
				// this.classList.toggle('button-inactive');
			// }
			// document.getElementById('exclude').value = window['excludeCriteria'];
			// generateGrid();
		// });
		// tags.appendChild(tag);
	// }
	
	mainTableRow2Cell1.appendChild(tags);
	
	let mainTableRow3 = document.createElement('div');
	
	let mainTableRow3Cell1 = document.createElement('div');
	mainTableRow3Cell1.classList.add('menu');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	if(enableDarkMode)
	{
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.classList.add('darkmode');
		darkmode.classList.add('settings-icon');
		darkmode.classList.add('material-icons');
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		settings.appendChild(darkmode);		
	}
	
	if(presetWidths && presetWidths.length == 3)
	{
		let preset = document.createElement('a');
		preset.id = 'preset';
		preset.classList.add('preset');
		preset.classList.add('settings-icon');
		preset.classList.add('material-icons');
		preset.href = 'javascript:void(0);';
		preset.innerText = window['preset'];
		preset.addEventListener('click', onTogglePreset);
		settings.appendChild(preset);
	}
		
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

function generateLayoutCollage() {
	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	if(window['horizontal']) 
		mosaic.style.width = (window.innerWidth - (window['horizontal'] ? processCssValue(menuWidth) : 0)) + 'px';
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
		let itemName = item.filename;
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.style.width = itemWidth;
		gridItem.style.height = itemHeight;
		
		let prefix = itemName.substring(0, bannerPrefixLength);
		if(showBanner && prevValue != prefix) {
			let overlay = document.createElement('div');
			overlay.classList.add('static-banner');
			overlay.innerText = prefix;
			gridItem.appendChild(overlay);
			prevValue = prefix;
		}
		
			let gridItemImage = document.createElement('img');
		
			gridItemImage.title = itemName.split(filenameSeparator).join('\n');
			gridItemImage.setAttribute('alt', item['og']);
			gridItemImage.addEventListener('click', onClickGridItem);
			gridItemImage.addEventListener('contextmenu', function(e) {
				e.preventDefault();
				return false;
			}, false);
			// let fullImageUrl = addUrlClause(item[getThumbnailPrefix()]);
			gridItemImage.src = item[getThumbnailPrefix()] || 'https://knneo.github.io/resources/spacer.gif';
			
			gridItem.appendChild(gridItemImage);
			
		grid.appendChild(gridItem);
	}

	// document.querySelector('.counter').innerText = filterArray.length;
	return grid;
}

function generateFiltered() {
	return mosaicArray;
	// return mosaicArray.filter(m => 
		// (window['includeCriteria'].length == 0 || includeArray.filter(s => m.filename.includes(s)).length == includeArray.length) && 
		// (window['excludeCriteria'].length == 0 || excludeArray.filter(s => !m.filename.includes(s)).length == excludeArray.length) &&
		// excludedTags.filter(f => m.filename.includes(f)).length < 1
	// );
}

function getFilenameInfo(url) {
	let filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
	let extension = url.substring(url.lastIndexOf('.')+1);
	return {filename, extension};
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
	let menuWidthValue = processCssValue(menuWidth);
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
	columns = Math.floor((window.innerWidth - (window['horizontal'] ? menuWidthValue : 0)) / columns);
	return columns < minColumns ? minColumns : columns;
}

function processCssValue(val) {
	if(val.includes('vw'))
		return parseInt(val) * window.innerWidth;
	if(val.includes('vh'))
		return parseInt(val) * window.innerHeight;
	return parseInt(val);
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
	// let tags = document.querySelector('.tags');
	let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta
	
	//scrollDelta < 0 => scroll down
	main.style.height = scrollDelta < 0 ? 0 : '';
	// tags.style.height = main.style.height;
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

function onClickGridItem() {
	// add loader
	let player = document.querySelector('.player');
	let loader = document.createElement('div');
	loader.classList.add('material-icons');
	loader.classList.add('loader');
	player.parentElement.appendChild(loader);
	startLoader();
	
	// add player to cover over loader
	let source = this.getAttribute('alt');
	player.innerHTML = generatePlayerByURL(source);
	
	if(!window['horizontal'])
	{
		this.scrollIntoView();
		
		let main = document.getElementById('main');
		let mosaic = document.getElementById('mosaic');
		main.style.height = '';
		// tags.style.height = main.style.height;
		mosaic.style.height = (window.innerHeight - main.getBoundingClientRect().height) + 'px';

	}
}

function generatePlayerByURL(url) {
	let embedHeight = 450;
	// let url = (isDarkMode ? "https://music.apple.com/jp/" + (releaseId.includes('pl.u') ? 'playlist' : 'album') + "/" : "https://open.spotify.com/embed/album/") + releaseId;
	// if(0.75*window.innerHeight < widgetHeight)
		// embedHeight = 0.5*window.innerHeight;
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ embedHeight +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; overflow: hidden; width: 100%; padding: 10px;" onload="stopLoader()"></iframe>';
    }
	if(url.includes('open.spotify.com')) {
        //process spotify embed
		return '<iframe src="' + url + '" height="' + embedHeight + '" frameborder="0" allowtransparency="true" allow="encrypted-media" style="background: transparent; overflow: hidden; width: 100%; padding: 10px;" onload="stopLoader()"></iframe>';
	}
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
	if(window['loading']) setTimeout(runLoader, 500);
	else
	{
		for(let loader of document.querySelectorAll('.loader'))
		{
			loader.parentElement.removeChild(loader);
		}
	}
}

function startLoader() {
	window['loading'] = true;
	runLoader();
}

function stopLoader() {
	window['loading'] = false;
	runLoader();
}

//HELPERS//
function addUrlClause(url) {
	return url ? "url('" + url + "')" : url;
}

function removeUrlClause(property) {
	return property.replace('url("','').replace('")','');
}
