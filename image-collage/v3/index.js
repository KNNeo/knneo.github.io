//--CONSTANTS--//
const isHorizontalLayout = function() { 
	return matchMedia('all and (orientation:landscape)').matches; 
}
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const spacer = 'https://knneo.github.io/resources/spacer.gif';

//--REFERENCES--//
const title = document.querySelector('.title');
const description = document.querySelector('.description');
const collage = document.querySelector('.collage');
const grid = document.querySelector('.grid');
const tags = document.querySelector('.tags');
const sidebar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu');
const settings = document.querySelector('.settings');
const viewer = document.querySelector('.viewer');
const include = document.querySelector('#include');
const exclude = document.querySelector('#exclude');
const callback = (entries, observer) => {
	entries.forEach((elem) => {
		let thumbnail = elem.target;
		thumbnail.src = thumbnail.getAttribute('data-image');
	});
};
const observer = new IntersectionObserver(callback, {
	root: collage,
	rootMargin: '10px',
	threshold: 0,
})

//--FUNCTIONS--//
function startup() {
    if (document.getElementById('data-id').textContent)
		initializeVariables(JSON.parse(document.getElementById('data-id').textContent));
	else if(document.getElementById('data-id').src)
		getJson(document.getElementById('data-id').src, initializeVariables);
}

function setData() {
    event.preventDefault();
	let source = prompt('Enter source url/key', document.getElementById('data-id')?.src || '');
	if(source) {
        if(source.startsWith('https://')) // full address
            document.getElementById('data-id').src = source;
        else if(source.endsWith('.json')) // assume home directory at data folder
            document.getElementById('data-id').src = 'data/' + source;
        else // assume home directory at data folder & file format json
            document.getElementById('data-id').src = 'data/' + source + '.json';
		startup();
	}
}

function initializeVariables(data) {
	window.data = data;
	window.include = '';
	window.exclude = '';
	window.preset = settings.querySelector('.size')?.innerText || 'photo_size_select_small';
	window.slideshow = { run: null, history: [] };
	menu.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onScrollSidebar);
	window.addEventListener('mousemove', hideMouseInViewer);
	initializeCollage();
}

function initializeCollage() {
	generateTags();
	generateSidebar();
	generateTagsList();
	generateGrid();
	generateViewer();
}

function generateTags() {
	if(typeof window.data.setting.filter == 'boolean') {
		window['buttonArray'] = [];
		if(!window.data.setting.filter) return;
	}
	
	// generate tags by design
	window['buttonArray'] = generateFiltered()
	.map(function(file) {
        let filenameIndex = file.nm && file.nm.includes('/') ? file.nm.lastIndexOf('/') : -1;
		return getFilenameInfo(file.nm).filename;
	})
	.reduce(function(total, current, _, _) {
		let updated = total || [];
		if(current && current.length > 0)
			current.split(window.data.separator).forEach(function(tag, index, _) {
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
					category: window.data.tag.category ? index : null,
				});
			});
		return updated;
	},[])
	.filter(function(item) {
		return item.count >= window.data.tag.min && item.count <= window.data.tag.max && window.data.tag.hidden.filter(t => item.value.includes(t)).length < 1;
	})
	.sort(function(a,b) {
		// based on values in reduce function: value/count/category
		let prop = window.data.tag?.sort?.property;
		if(!a[prop] || !b[prop])
			return 0;
		if(typeof a[prop] == 'number' && typeof b[prop] == 'number')
			return window.data.tag?.sort?.order == 'desc' ? b[prop] - a[prop] : a[prop] - b[prop];
		// else string
		if(window.data.tag?.sort?.order == 'desc')
			return b[prop].localeCompare(a[prop], window.data.tag?.sort?.locale);
		return a[prop].localeCompare(b[prop], window.data.tag?.sort?.locale);
	});
	if(window.data.debug) console.log(window['buttonArray']);

    // update style
    tags.style.setProperty('--border', (window.data.tag?.border || 0) + 'px');
    tags.style.setProperty('--radius', (window.data.tag?.radius || 0) + 'px');
}

function generateSidebar() {
	menu.style.setProperty('--max-width', (window.data.menu.width || 400) + 'px');
	if(menu.closest('.content'))
		menu.closest('.content').style.setProperty('--menu-height', (menu.getBoundingClientRect()?.height || 0) + 'px');
	if(window.data.menu.display && window.data.menu.display == 'hidden') {
		menu.classList.add(window.data.menu.display);
		if(sidebar) sidebar.innerText = 'menu';
	}
	else if (menu.classList.contains(window.data.menu.display)) {
		menu.classList.remove(window.data.menu.display);
		if(sidebar) sidebar.innerText = 'menu_open';
	}
	
	document.title = window.data.title ? window.data.title + ' - Image Collage' : 'Image Collage';

	if(window.data.title && window.data.title.length > 0)
		title.innerText = window.data.title;
	
	if(window.data.description && window.data.description.length > 0)
        description.innerHTML = window.data.description.startsWith('http') ? '<a href="' + window.data.description + '" target="_blank">' + window.data.description.substring(window.data.description.indexOf('://')+3) + '</a>' : window.data.description;

	if(typeof window.data.setting.filter == 'boolean' && window.data.setting.filter) {
		let include = document.querySelector('#include');
		include.classList.add('filter');
		include.placeholder = window.data.placeholder.include;
		include.addEventListener('input', function() {
			window.include = event.target.value;
			generateGrid();
		});
		
		let exclude = document.querySelector('#exclude');
		exclude.classList.add('filter');
		exclude.placeholder = window.data.placeholder.exclude;
		exclude.addEventListener('input', function() {
			window.exclude = event.target.value;
			generateGrid();
		});
	}
	
	for(let [key, value] of Object.entries(window.data.setting)) {
		if(key == 'expand' && isHorizontalLayout())
			document.querySelector('.' + key).classList.add('hidden');			
		else if(value)
			document.querySelector('.' + key).classList.remove('hidden');
		else
			document.querySelector('.' + key).classList.add('hidden');
	}
}

function generateTagsList() {
	tags.innerHTML = '';
	tags.style.setProperty('--categories', window.data.tag.category.ratio.reduce((total, r) => total + r) || window.data.tag.category.groups.length);
	
	if(window.data.tag.category && window.data.tag.category.groups) {
		let sections = window.data.tag.category.ratio.reduce((sum, r) => sum + r, 0);
		window.data.tag.category.groups.forEach(function(current, index, _) {
			let tag = document.createElement('div');
			tag.classList.add('tags-category');
			tag.style.setProperty('--ratio', window.data.tag.category.ratio[index]);
			if(isHorizontalLayout()) tag.style.maxHeight = (100 / sections * window.data.tag.category.ratio[index]) + '%';
			
				let title = document.createElement('h4');
				title.classList.add('category-title');
                title.title = 'Click to clear all tags in category';
				title.innerText = current;
                title.setAttribute('onclick', 'onClearCategory()');
				tag.appendChild(title);
				
			tags.appendChild(tag);
		});
	}
	else {
		let tag = document.createElement('div');
		tag.classList.add('tags-category');
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
					toggleVariable('exclude', filter.value);
					toggleVariable('include', filter.value);
					filter.setAttribute('filter', 'include');
					break;
				case 'include':
					toggleVariable('include', filter.value);
					filter.removeAttribute('filter');
					break;
				default:
					toggleVariable('include', filter.value);
					filter.setAttribute('filter', 'include');
					break;
			}
			include.value = window.include;
			exclude.value = window.exclude;
			filter.scrollIntoView({ block: "center" });
			generateGrid();
		});
		tag.addEventListener('contextmenu',function() {
			let filter = event.target;
			// to exclude or reset
			event.preventDefault();
			switch(filter.getAttribute('filter')) {
				case 'include':
					toggleVariable('include', filter.value);
					toggleVariable('exclude', filter.value);
					filter.setAttribute('filter', 'exclude');
					break;
				case 'exclude':
					toggleVariable('exclude', filter.value);
					filter.removeAttribute('filter');
					break;
				default:
					toggleVariable('exclude', filter.value);
					filter.setAttribute('filter', 'exclude');
					break;
			}
			include.value = window.include;
			exclude.value = window.exclude;
			filter.scrollIntoView({ block: "center" });
			generateGrid();
		});
		
		if(window.include.split(window.data.separator).includes(button.value))
			tag.setAttribute('filter', 'include');
		if(window.exclude.split(window.data.separator).includes(button.value))
			tag.setAttribute('filter', 'exclude');
        if(button.category > window.data.tag.category.groups.length-1)
			tags.childNodes[window.data.tag.category.groups.length-1].appendChild(tag);
		else if(button.category)
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
	let filtered = generateFiltered(window.data.data)
	.reduce(function(total, current, arr) {
		let names = getFilenameInfo(current.nm).filename.split(window.data.separator);
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
		if(window.data.debug) console.log(filtered[item]);
		if(filtered[item] >= window.data.tag.min && 
			filtered[item] <= window.data.tag.max &&
			!window.data.tag.hidden.includes(item))
			countArray.push([item, filtered[item]]);
	}
	
	popupText(countArray.sort(function(a,b) { return b[1] - a[1]; }).map(m => m[0] + ' - ' + m[1]).join('<br>'));
}

function generateGrid() {
	let prevValue = '';
	grid.innerHTML = '';
	
	let filterArray = generateFiltered().sort(function(a,b) {
		let prop = window.data.sort?.property;
        // if property not found, sort list as is
		if(!prop || !a[prop] || !b[prop]) {
			if(!window.data.sort?.order)
				return 0;
			return window.data.sort.order == 'desc' ? -1 : 1;
		}
        if(new Date(a[prop]) != 'Invalid Date' && new Date(b[prop]) != 'Invalid Date') {
            // convert dates to int string
            a[prop] = new Date(a[prop]).getTime();
            b[prop] = new Date(b[prop]).getTime();
            return window.data.sort.order == 'desc' ? b[prop] - a[prop] : a[prop] - b[prop];
        }
        // sort string by locale if any
		if(window.data.sort.order == 'desc')
			return b[prop].localeCompare(a[prop], window.data.sort?.locale || '');
		return a[prop].localeCompare(b[prop], window.data.sort?.locale || '');
	});
	
	let [thumbWidth, thumbHeight] = calculateThumbnailSize();
	for(let item of filterArray) {
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		gridItem.style.width = thumbWidth + 'px';
		gridItem.style.height = thumbHeight + 'px';
        gridItem.style.setProperty('--border', (window.data.grid?.thumbnail?.border || 1) + 'px');
        gridItem.style.setProperty('--radius', (window.data.grid?.thumbnail?.radius || 0) + 'px');
		
		if(window.data.grid?.banner) {
			// as property, or if not object, as string
            let prefix = item[window.data.grid.banner.property] || (item.nm || '').substring(0, window.data.grid.banner.length);
            if(prevValue != prefix) {
                let overlay = document.createElement('div');
                overlay.classList.add('banner');
                overlay.classList.add('prefix');
                overlay.innerText = prefix;
                overlay.title = prefix;
				if(item[window.data.grid?.banner?.property]) {
					overlay.classList.add('grid-item');
					grid.appendChild(overlay);
				}
				else 
					gridItem.appendChild(overlay);
                prevValue = prefix;
            }
		}
		
		if(window.data.grid?.star && item[window.data.grid.star.property]) {
			let itemVal = item[window.data.grid.star.property];
			// universal tag (boolean)
			let highlight = document.createElement('div');
			highlight.classList.add('banner');
			highlight.classList.add('star');
			highlight.innerText = window.data.grid.star.text;
			highlight.title = window.data.grid.star.tooltip || itemVal;

			if(typeof itemVal == 'string') {
				// item remark (string)
				if(itemVal.startsWith('https://') || itemVal.startsWith('http://')) {
					// url
					let highlight = document.createElement('a');
					highlight.classList.add('banner');
					highlight.classList.add('star');
					highlight.setAttribute('href', itemVal);
					highlight.setAttribute('target', '_blank');
			        highlight.innerText = window.data.grid.star.text;
					highlight.title = window.data.grid.star.tooltip || itemVal;
			        gridItem.appendChild(highlight);
				}
			}
            else
			gridItem.appendChild(highlight);
		}
		
		let gridItemImage = document.createElement('img');
		gridItemImage.alt = item.ds || '';
		gridItemImage.title = getFilenameInfo(item.nm || '').filename.split(window.data.separator).join('\n');
		let thumbnail = getThumbnailSizeBySetting(item);
		if(thumbnail == spacer)
			console.error('thumbnail not found', item);
		gridItemImage.setAttribute('data-image', thumbnail);
		gridItemImage.setAttribute('data-src', item['og'] || item['lg'] || item['md'] || item['sm'] || spacer);
		gridItemImage.setAttribute('data-caption', item.ct || '');
		gridItemImage.setAttribute('loading', 'lazy');
		gridItemImage.addEventListener('click', function() {
			openViewer(event.target.parentElement);
		});
		gridItemImage.addEventListener('contextmenu', function() {
			event.preventDefault();
			let keywords = event.target.title.split('\n');
			if(window.data.tag.category.groups?.length) {
				if(keywords.filter(k => window.include.includes(k)).length < 1) // if no keywords in filter
					toggleVariable('include', keywords[0]); // toggle first keyword
				else { // toggle next keyword
					let includeArray = window.include.split('|');
					let inFilterIndex = keywords.findIndex(k => includeArray.includes(k)); // assume unique tags
					let notFilterIndex = 1 + inFilterIndex < keywords.length ? 1 + inFilterIndex : 0; // loop around if include last keyword
					// console.log(inFilterIndex, notFilterIndex);
					// assume tags length do not need to be same as groups length
					toggleVariable('include', keywords[inFilterIndex]);
					toggleVariable('include', keywords[notFilterIndex]);
				}
				include.value = window.include;
				generateTagsList();
				generateGrid();
			}
			else {
				console.error('tag category groups do not exist, edit in config');
			}
			return false;
		}, false);
		gridItemImage.addEventListener('error', function() {
			event.preventDefault();
			console.log(event.target.getAttribute('data-image'));
		});
		gridItem.appendChild(gridItemImage);
		observer.observe(gridItemImage);
			
		grid.appendChild(gridItem);
	}

	if(document.querySelector('.counter') != null)
		document.querySelector('.counter').innerText = filterArray.length;
	if(!filterArray.length)
		grid.innerText = 'No Data';
}

function generateFiltered() {
	if(typeof window.data.data != 'object') return [];
	let includeArray = window.include.split('|');
	let excludeArray = window.exclude.split('|');
	if(window.data.debug) console.log('included', includeArray);
	if(window.data.debug) console.log('excluded', excludeArray);
    if(!window.data?.tag?.join) window.data.tag.join = 'and'; // default join method
	return window.data.data.filter(m => {
        let tagsIncluded = includeArray.filter(s => 
                (m.nm && !m.nm.includes(window.data.separator) && m.nm.toLowerCase().includes(s.toLowerCase())) 
                || (m.nm && m.nm.toLowerCase().includes(s.toLowerCase() + window.data.separator)) 
                || (m.nm && m.nm.toLowerCase().includes(window.data.separator + s.toLowerCase()))
            );
        let tagsExcluded = excludeArray.filter(s => 
                !m.nm.toLowerCase().includes(s.toLowerCase() + window.data.separator) 
                && !m.nm.toLowerCase().includes(window.data.separator + s.toLowerCase())
            );
        return (window.include.length == 0 || (window.data?.tag?.join?.toLowerCase() == 'and' && tagsIncluded.length == includeArray.length) || (window.data?.tag?.join?.toLowerCase() == 'or' && tagsIncluded.length > 0))
        && (window.exclude.length == 0 || (tagsExcluded.length == excludeArray.length)) 
        && (window.data.tag.exclude ?? []).filter(f => m.nm.includes(f)).length < 1
        && (!window.data.search || !m.ct || m.ct.toLowerCase().includes(window.data.search));   
    });
}

function generateOrientationValues() {
	let values = generateFiltered();
	for(let item of values)	{
        let source = item['og'] || item['lg'] || item['md'] || item['sm'];
		let itemDiv = collage.querySelector('img[data-src="' + source + '"]');
        if(!itemDiv || !itemDiv.complete) {
            alert('all images not fully loaded, cannot determine orientation!\nscroll down all the way to load all images')
            console.error('generateOrientationValues: image not loaded!', source);
            return;
        }
        let tags = item.nm.split(window.data.separator);
        if(!tags.includes('Portrait') && itemDiv?.naturalWidth < itemDiv?.naturalHeight)
            tags.push('Portrait');
        if(!tags.includes('Landscape') && itemDiv?.naturalWidth >= itemDiv?.naturalHeight)
            tags.push('Landscape');
        item.nm = tags.join(window.data.separator);
	}
	return values;
}

function toggleVariable(variable, value) {
	if(window[variable].includes(value)) {
		window[variable] = window[variable].replace('|' + value,'').replace(value,'');
		if(window[variable].startsWith('|')) window[variable] = window[variable].substring(1);
	}
	else
		window[variable] += (window[variable].length > 0 ? '|' : '') + value;
}

function getThumbnailSizeBySetting(item) {
	switch(window.preset) {
	  case 'photo_size_select_small':
		return item['sm'] || spacer;
	  case 'photo_size_select_large':
		return item['md'] || item['sm'] || spacer;
	  case 'photo_size_select_actual':
		return item['lg'] || item['md'] || item['sm'] || spacer;
	  default:
		return spacer;
	}
}

function calculateThumbnailSize() {
	let gridWidth = grid.getBoundingClientRect().width;
	let columns = calculateColumns(gridWidth);
	let thumbWidth = gridWidth / columns;
	let thumbHeight = thumbWidth * (window.data.grid?.thumbnail?.ratio || 1);
	
	if(window.data.debug) {
		console.log('gridWidth', gridWidth);
		console.log('columns', columns);
		console.log('calculateThumbnailSize', thumbWidth, thumbHeight);
	}
	return [thumbWidth, thumbHeight];
}

function calculateColumns(gridWidth) {
	let columns = 0;
	switch(window.preset) {
	  case 'photo_size_select_small':
		columns = window.data.tag.size[0];
		break;
	  case 'photo_size_select_large':
		columns = window.data.tag.size[1];
		break;
	  case 'photo_size_select_actual':
		columns = window.data.tag.size[2];
	  default:
		break;
	}
	columns = Math.round(gridWidth / columns);
	return columns < window.data.grid.column.min ? window.data.grid.column.min : columns;
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

//--EVENTS--//
function toggle() {
    //console.log(event.key);
    let elem = document.querySelector('[onclick][data-key=' + event.key + ']');
    if(elem) elem.click();
}

function resize() {
	//resize grid
	document.querySelector('.expand').innerText = 'unfold_more';
	tags.classList.remove('expanded');
	//resize images
	let [thumbWidth, thumbHeight] = calculateThumbnailSize();
	for(let gridItem of document.querySelectorAll('.grid-item')) {
		gridItem.style.width = thumbWidth + 'px';
		gridItem.style.height = thumbHeight + 'px';
	}
	setTimeout(setMenuHeight, 300);
}

function onToggleSize() {
	switch(event.target.innerText) {
	  case 'photo_size_select_actual':
		event.target.innerText = 'photo_size_select_small';
		break
	  case 'photo_size_select_small':
		event.target.innerText = 'photo_size_select_large';
		break;
	  case 'photo_size_select_large':
		event.target.innerText = 'photo_size_select_actual';
		break;
	  default:
		break;
	}
	
	window.preset = event.target.innerText;
	generateGrid();
}

function onToggleExpander() {
	switch(event.target.innerText) {
	  case 'unfold_more':
		event.target.innerText = 'unfold_less';
		event.target.title = 'Close Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
			tag.tabIndex = 0;
		break
	  case 'unfold_less':
		event.target.innerText = 'unfold_more';
		event.target.title = 'Expand Tags';
		tags.classList.toggle('expanded');
		for(let tag of document.querySelectorAll('.tag'))
			tag.tabIndex = -1;
		break;
	  default:
		break;
	}
	setTimeout(setMenuHeight, 300);
}

function onScrollSidebar() {
	if(event.target == event.target.closest('.menu'))
		collage.scrollTop -= isFirefox ? -event.detail*20 : event.wheelDelta;
	if(!isHorizontalLayout() && event.target.closest('.tags')) {
		event.preventDefault();
		// scroll with respect to category element
		let categoryDiv = event.target.closest('.tags-category');
		if(categoryDiv) {
			// calc with respect to title element
			let height = categoryDiv.querySelector('h4')?.getBoundingClientRect().height;
			let scrollDelta = event.wheelDelta < 0 ? -height : height;
			categoryDiv.scrollTop -= scrollDelta;
		}
	}
}

function onClearCategory() {
    let title = event.target.innerText;
    if(title) {
        let filteredTags = event.target.parentElement.querySelectorAll('.tag[filter]');
        if(filteredTags.length) {
            // to ensure all included
            filteredTags.forEach(tag => tag.click());
            // to ensure all removed due to exclusions
            event.target.parentElement.querySelectorAll('.tag[filter]').forEach(tag => tag.click());
            generateGrid();
        }
    }
}

function onClearAll() {
	for(let button of document.querySelectorAll('.button-active'))
		button.classList.remove('button-active');
	for(let tag of document.querySelectorAll('.tag'))
		tag.removeAttribute('filter');
	window.include = '';
	include.value = window.include;
	window.exclude = '';
	exclude.value = window.exclude;
	generateGrid();
}

function onToggleSidebar() {
	event.target.innerText = event.target.innerText == 'menu' ? 'menu_open' : 'menu';
	document.querySelector('.menu').classList.toggle('hidden');
	//resize images
	let [thumbWidth, thumbHeight] = calculateThumbnailSize();
	for(let gridItem of document.querySelectorAll('.grid-item')) {
		gridItem.style.width = thumbWidth + 'px';
		gridItem.style.height = thumbHeight + 'px';
	}
	setTimeout(setMenuHeight, 300);
}

function onToggleCaptions() {
	event.target.innerText = event.target.innerText == 'subtitles' ? 'subtitles_off' : 'subtitles';
	viewer.classList.toggle('captions');
}

function onToggleRatio() {
    let ratioSetting = document.querySelector('.ratio');
    if(!window.data.grid)
        window.data.grid = {};
    if(!window.data.grid?.thumbnail) 
        window.data.grid.thumbnail = {};
	switch(window.data.grid?.thumbnail?.ratio) {
		case 1:
			window.data.grid.thumbnail.ratio = 5/4;
            ratioSetting.innerText = 'crop_5_4';
            ratioSetting.classList.add('rotate-90');
			generateGrid();
			break;
		case 5/4:
			window.data.grid.thumbnail.ratio = 7/5;
            ratioSetting.innerText = 'crop_16_9'; // icon error
            ratioSetting.classList.add('rotate-90');
			generateGrid();
			break;
		case 7/5:
			window.data.grid.thumbnail.ratio = 16/9;
            ratioSetting.innerText = 'crop_7_5'; // icon error
            ratioSetting.classList.add('rotate-90');
			generateGrid();
			break;
		case 16/9:
			window.data.grid.thumbnail.ratio = 9/16;
            ratioSetting.innerText = 'crop_7_5'; // icon error
            ratioSetting.classList.remove('rotate-90');
			generateGrid();
			break;
		case 9/16:
			window.data.grid.thumbnail.ratio = 5/7;
            ratioSetting.innerText = 'crop_16_9'; // icon error
            ratioSetting.classList.remove('rotate-90');
			generateGrid();
			break;
		case 5/7:
			window.data.grid.thumbnail.ratio = 4/5;
            ratioSetting.innerText = 'crop_5_4';
            ratioSetting.classList.remove('rotate-90');
			generateGrid();
			break;
		default:
			window.data.grid.thumbnail.ratio = 1;
            ratioSetting.innerText = 'crop_square';
            ratioSetting.classList.remove('rotate-90');
			generateGrid();
			break;
	}
}

function onToggleSearch() {
    switch(event.target.innerText) {
        case 'saved_search':
            event.target.innerText = 'search';
            event.target.title = 'Search by Caption';
            window.data.search = '';
            generateGrid();
            break;
        case 'search':
            let result = prompt('Key in search term (case-insensitive):');
            if(result) {
                event.target.innerText = 'saved_search';
                event.target.title = 'Search by Caption (' + result + ')';
                window.data.search = result.toLowerCase();
                generateGrid();
            }
        default:
            break;
    }
}

function setMenuHeight() {
	if(menu.closest('.content'))
		menu.closest('.content').style.setProperty('--menu-height', (menu.getBoundingClientRect()?.height || 0) + 'px');
}

//--VIEWER--//
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
	viewer.style.setProperty('--fit', window.data?.slideshow?.cover ? 'cover' : 'contain');
	
	let viewerPrev = document.createElement('a');
	viewerPrev.classList.add('prev');
	viewerPrev.classList.add('viewer-nav');
	if(imgNo-1 >= 0 && window.slideshow?.run == null)
		viewerPrev.addEventListener('click', onClickViewerPrev, false);
	
	let viewerNext = document.createElement('a');
	viewerNext.classList.add('next');
	viewerNext.classList.add('viewer-nav');
	if(imgNo+1 < window['viewer-list'].length && window.slideshow?.run == null)
		viewerNext.addEventListener('click', onClickViewerNext, false);
	
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
	if(img.src == spacer)
		console.error('source image not found', img);
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
            if(window.slideshow?.run != null)
                window.slideshow.run = setTimeout(runSlideshow, (window.data?.slideshow?.duration || 5) * 1000);
		}, 250);
	});
	img.addEventListener('click', closeViewer);
	img.addEventListener('mouseup', onZoomViewer);
	img.addEventListener('mousemove', onMouseMoveViewer);

	let caption = document.createElement('div');
	caption.classList.add('caption');
    if(window.data.grid?.caption?.align)
        caption.style.setProperty('--align', window.data.grid.caption.align);
	caption.innerText = image.getAttribute('data-caption');
	
	if(viewer.childNodes.length > 0)
		viewer.innerHTML = '';
	if(imgNo-1 >= 0 && window.slideshow?.run == null)
		viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length && window.slideshow?.run == null)
		viewer.appendChild(viewerNext);
	viewer.appendChild(loader);
	viewer.appendChild(img);
	viewer.appendChild(caption);
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

function onTouchStart() {
	window['touchX'] = event.touches[0].clientX;
	window['touchY'] = event.touches[0].clientY;
}

function onTouchMoveViewer() {
	let swipeDown = event.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.touches[0].clientY;
	let swipeLeft = window['touchX'] - event.touches[0].clientX;
	let swipeRight = event.touches[0].clientX - window['touchX'];
	if(window.data.debug)
		console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
	    viewer.removeAttribute('ontouchmove');
		onClickViewerNext();
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
	    viewer.removeAttribute('ontouchmove');
		onClickViewerPrev();
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
	    viewer.removeAttribute('ontouchmove');
		closeViewer();
		return;
	}
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
	    viewer.removeAttribute('ontouchmove');
		closeViewer();
		return;
	}
}

function onMouseMoveViewer() {
	if(window.data.debug) console.log(event.clientX, event.clientY);
	if(window.data.debug) console.log(viewer.clientWidth, viewer.clientHeight);
	let normalizeX = event.clientX / viewer.clientWidth * 100;
	let normalizeY = event.clientY / viewer.clientHeight * 100;
	event.target.style.setProperty('--horizontal', normalizeX.toFixed(2) + '%');
	event.target.style.setProperty('--vertical', normalizeY.toFixed(2) + '%');
}

function hideMouseInViewer() {
	if(viewer.classList.contains('open')) {
		viewer.style.setProperty('--cursor', '');
		viewer.getBoundingClientRect(); // for style refresh
		setTimeout(function() {
			// auto hide based on config
			if((window.data?.cursor || window.data?.slideshow?.cursor) != 'hide') return;
			viewer.style.setProperty('--cursor', 'none');
			viewer.getBoundingClientRect();
		}, 5000);
	}
}

function closeViewer() {
    if(window.slideshow.run) {
        stopSlideshow();
        let gridImage = grid.querySelector('img[data-src="' + (event.target?.src || '') + '"');
        if(gridImage)
            // scroll image to top of screen when close viewer
            gridImage.scrollIntoView();
    }
	viewer.classList.remove('zoom');
	viewer.classList.remove('open');
}

function onZoomViewer() {
	if(event.button == 2) {
		if(window.slideshow?.run != null) return;
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

//--SLIDESHOW--//
function startSlideshow() {
	createLinkedList('.grid-item img');
	window.slideshow.run = -1;
	runSlideshow();
}

function runSlideshow() {
	if(window.slideshow?.run != null) {
		let history = window.slideshow.history.map(h => h['og'] || h['lg'] || h['md'] || h['sm']);
		let images = generateFiltered().filter(i => !history.includes(i['og'] || i['lg'] || i['md'] || i['sm']));
		let item = images[Math.floor(Math.random()*images.length)];
        let image = document.querySelector('img[data-src="' + (item['og'] || item['lg'] || item['md'] || item['sm']) + '"]');
        if(!image) {
			console.error('unable to run slideshow: image not found', item);
			return closeViewer(); // which will stop slideshow
		}
		// add to history
		window.slideshow.history.push(image);
		// calculate new history list based on max
		let defaultMax = 5;
		if(!window.data?.slideshow?.history)
			window.data.slideshow.history = defaultMax;
		if(typeof window.data?.slideshow?.history == 'string' && window.data?.slideshow?.history.endsWith('%')) {
			// if percentage, convert to number
			let percentNumber = parseInt(window.data?.slideshow?.history);
			if(percentNumber != NaN) {
				window.data.slideshow.history = Math.floor(percentNumber/100*images.length);
				if(window.data?.slideshow?.history >= images.length)
					window.data.slideshow.history -= 1;
			}
			else
				window.data.slideshow.history = defaultMax;
		}
		// slice if exceeded
		if(window.slideshow.history.length > window.data?.slideshow?.history)
			window.slideshow.history = window.slideshow.history.slice(-1*window.data?.slideshow?.history);
		openImageInViewer(image);
		runLoader();
	}
}

function stopSlideshow() {
	clearTimeout(window.slideshow.run);
	window.slideshow.run = null;
}

//--LOADER--//
function runLoader() {
	for(let loader of document.querySelectorAll('.loader'))	{
		switch(document.querySelector('.loader').innerText) {
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
	else {
		for(let loader of document.querySelectorAll('.loader'))
			loader.parentElement.removeChild(loader);
	}
}

//--DIALOG--//
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null) {
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
