//main function to render detachable component
function renderGrid(sectionNo, content, source) {
	// clean section
	let section = document.querySelector('#section'+sectionNo);
	section.innerHTML = '';
	let table = document.createElement('table');
	table.classList.add('container');
	
	let tbody = document.createElement('tbody');
	// sort by sequence, if any
	content.cData.sort(function(a,b) {
		return a.sortOrder - b.sortOrder;
	});	
	//for mobile, stack all elements in one column
	if(mediumScreenWidth() && content.columns > 1) {
		content.cData = content.cData.filter(cd => cd.type && cd.type != 'spacer');
		let totalCells = content.cData.length;
		content.columns = 1;
		content.rows = totalCells;
		for(let c = 0; c < content.cData.length; c++) {
			content.cData[c].columns = 1;
			content.cData[c].rows = 1;
		}
		content.cData.sort(function(a,b) {
			return a.mobileSortOrder - b.mobileSortOrder;
		});	
	}
	// console.log(content.rows, content.columns);
	
	//render table
	let count = 0;
	let cellSkip = [];
	for(let row = 0; row < (content.rows || 1); row++) {
		let tr = document.createElement('tr');
		for(let col = 0; col < (content.columns || 1); col++) {
			let skip = false;
			for(let cell of cellSkip) {
				if(cell[0] == row && cell[1] == col) {
					skip = true;
					cellSkip.splice(cellSkip.indexOf(cell),1);
					break;
				}
			}
			if(skip) continue;
			
			let td = document.createElement('td');
			td.id = 'section'+sectionNo+'cell'+count;
			td.style.width = content.columns > 1 ? (100 / content.columns) + '%' : '100%';
			td.style.height = content.rows > 1 ? (100 / content.rows) + '%' : '100%';
			
			let item = content.cData[count];
			if(item && item.url)
				td.setAttribute('onclick', 'window.location.href = "' + processLinkExtensions(item.url) + '"');
			if(item && item.rows != undefined) {
				td.setAttribute('rowspan', item.rows);
				for(let r = 1; r < item.rows; r++)
					cellSkip.push([row+r,col]);
			}
			
			if(item && item.columns != undefined) {
				td.setAttribute('colspan', item.columns);
				for(let c = 1; c < item.columns; c++)
					cellSkip.push([row,col+c]);
			}
			
			tr.appendChild(td);
			count++;
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	section.appendChild(table);
	
	//render data: from left to right, top to bottom
	for(let index = 0; index < content.cData.length; index++) {
		let component = content.cData[index];
		if(component.type == 'title')
			renderTitle(sectionNo, index, component);
		if(component.type == 'paragraph')
			renderParagraph(sectionNo, index, component);
		if(component.type == 'image')
			renderImage(sectionNo, index, component, source);
		if(component.type == 'images')
			renderImages(sectionNo, index, component);
		if(component.type == 'gallery')
			renderGallery(sectionNo, index, component);
		if(component.type == 'masonry')
			renderMasonry(sectionNo, index, component);
		if(component.type == 'tags')
			renderTags(sectionNo, index, component);
	}
}

function renderTitle(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	elem.style.textAlign = component.align || 'center';
	
	if(component.prefix) {
		let pre = document.createElement(component.prefixUrl ? 'a' : 'div');
		pre.classList.add('caption');
		if(component.prefixUrl)
			pre.href = component.prefixUrl;
		pre.innerText = component.prefix;
		elem.appendChild(pre);
	}
	if(component.prefixIcon) {
		let icon = document.createElement('img');
		icon.classList.add('caption-icon');
		icon.src = component.prefixIcon;
		elem.appendChild(icon);
	}	
	if(component.title) {
		let title = document.createElement(component.titleUrl ? 'a' : 'div');
		title.classList.add('title');
		title.innerText = component.title;
		if(component.titleUrl)
			title.href = component.titleUrl;
		elem.appendChild(title);
	}	
	if(component.suffix) {
		let post = document.createElement(component.suffixUrl ? 'a' : 'div');
		post.innerText = component.suffix;
		if(component.suffixUrl)
			post.href = component.suffixUrl;
		elem.appendChild(post);	
	}
	if(component.suffixIcon) {
		let icon = document.createElement('img');
		icon.classList.add('caption-icon');
		icon.src = component.suffixIcon;
		elem.appendChild(icon);
	}
}

function renderParagraph(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	elem.style.textAlign = component.align || 'center';
	// render text
	if(component.text) {
		let title = document.createElement(component.italics ? 'em' : 'div');
		title.classList.add(component.type);
		title.classList.add('text');
		title.innerText = component.text;
		if(mediumScreenWidth())
			title.addEventListener('click', function() {
				event.target.classList.toggle('expand');
			});
		elem.appendChild(title);
	}
}

function renderImage(sectionNo, index, component, source) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	if(source == 'masonry') elem.classList.add('image-section');
	// render single image
	let img = document.createElement('img');
	img.classList.add(component.type);
	img.setAttribute('loading', 'lazy');
	if(component.tooltip && component.tooltip.length > 0)
		img.title = component.tooltip;
	img.src = component.source;
	img.addEventListener('load', function() {
		let imgWidth = event.target.clientWidth;
		let imgHeight = event.target.clientHeight;
		event.target.classList.add(imgWidth >= imgHeight ? 'landscape' : 'portrait');
	});
	// wrap with link tag
	if(component.link && component.link.length > 0)	{
		let linkContainer = document.createElement('div');
		linkContainer.style.width = '100%';
		linkContainer.style.height = largeScreenWidth() ? '80%' : '100%';
		linkContainer.style.verticalAlign = 'center';

		let url = document.createElement('a');
		url.href = component.link;
		url.appendChild(img);
			
		linkContainer.appendChild(url);
		elem.appendChild(linkContainer);
	}
	else {
		img.classList.add('focusable');
		elem.appendChild(img);
	}
}

function renderImages(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	if(typeof generateViewer == 'function') generateViewer();
	// render set of images
	let gallery = document.createElement('div');
	gallery.classList.add(component.type);
	for(let data of component.datas) {
		let url = document.createElement('a');
		
		let img = document.createElement('img');
		img.setAttribute('loading', 'lazy');
		if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
		img.src = data.thumbnail;
		img.setAttribute('data-src', data.source);
		img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
		if(component.columns > 0) {
			if(mediumScreenWidth()) // if mobile, all in one row
				img.style.width = (100 / (component.datas.length + 1)) + '%';
			else //if desktop, all in one row
				img.style.width = (100 / (component.columns)) + '%';
		}
		if(component.rows > 0) {
			if(!mediumScreenWidth()) { //if desktop, all in n rows where n = component.rows
				img.style.width = (100 / component.rows) + '%';
				if(largeScreenWidth()) // if large screen, scale more
					img.style.width = (100 / (component.rows + 0.8)) + '%';
				if(component.datas.length == component.rows) // if single column, show as block
					gallery.classList.add('block');
			}
		}
		// wrap with link tag, if any
		if(data.link)
			url.href = data.link;
		else {
			img.classList.add('focusable');	
			img.addEventListener('click', function() {						
				event.stopPropagation();
				openImageUrlInViewer(this.getAttribute('data-src')); 
			});
		}
		// append to DOM
		url.appendChild(img);
		gallery.appendChild(url);
	}
	// add caption, if any
	if(component.caption && component.caption.length > 0) {		
		let caption = document.createElement('div');
		caption.classList.add('caption');
		caption.classList.add('focusable');
		caption.innerText = component.caption;
		gallery.appendChild(caption);
	}	
	elem.appendChild(gallery);
}

function renderGallery(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	if(typeof generateViewer == 'function') generateViewer();
	// render gallery container
	let gallery = document.createElement('div');
	gallery.classList.add(component.type);
	// render images in gallery	
	for(let galleryIndex = 0; galleryIndex < component.datas.length; galleryIndex++) {
		let data = component.datas[galleryIndex];
		let img = document.createElement('img');
		img.classList.add('focusable');
		img.setAttribute('loading', 'lazy');
		if(data.tooltip && data.tooltip.length > 0)
			img.title = data.tooltip;
		img.src = data.thumbnail;
		img.alt = data.tooltip;
		if(data.grid) { // data for recursion render
			img.setAttribute('data-section', sectionNo);
			img.setAttribute('data-component', index);
			img.setAttribute('data-gallery', galleryIndex);
		}
		else
			img.setAttribute('data-src', data.source);
		// large thumbnails
		if (component.size && component.size == 'lg')
			img.classList.add('lg');
		// if have recursion render or source, display in viewer
		if(data.grid || data.source)
			img.addEventListener('click', onClickGalleryImage);
		img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
		gallery.appendChild(img);
	}
	// render caption, if any
	if(component.caption && component.caption.length > 0) {		
		let caption = document.createElement('div');
		caption.classList.add('caption');
		caption.innerText = component.caption;
		gallery.appendChild(caption);
	}	
	elem.appendChild(gallery);
}

function renderMasonry(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	if(typeof generateViewer == 'function') generateViewer();
	// render masonry container
	let gallery = document.createElement('div');
	gallery.classList.add(component.type);
	// fix firefox percentage fail on td child display flex
	gallery.style.height = elem.getBoundingClientRect().height + 'px';
	// total columns: smallest denominator for largest screens or based on screen width
	let totalCol = Math.min(Math.floor(window.innerWidth / 200), 5);
	// sort items before render
	if(component.reverse)
		component.datas.reverse();
	// allow shuffle
	if(component.shuffle && !component.reverse)
		component.datas.sort(function(a, b){return 2*Math.random()-1});
	// create masonry columns
	for(let row = 0; row < totalCol; row++)	{
		let rowDiv = document.createElement('div');
		rowDiv.classList.add('column');
		rowDiv.style.flex = (100 / totalCol) + '%';
		rowDiv.style.maxWidth = rowDiv.style.flex;
		gallery.appendChild(rowDiv);
	}	
	elem.appendChild(gallery);
	// render items to each column, round robin
	for(let d = 0; d < component.datas.length; d++) {
		let galleryIndex = d;
		let data = component.datas[galleryIndex];
		if(data) {
			let img = document.createElement('img');
			img.setAttribute('loading', 'lazy');
			if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
			img.classList.add('focusable');
			img.src = data.thumbnail;
			img.alt = data.tooltip;
			if(data.grid) { // data for recursion render
				img.setAttribute('data-section', sectionNo);
				img.setAttribute('data-component', index);
				img.setAttribute('data-gallery', galleryIndex);
				img.setAttribute('data-type', component.type);
			}
			else
				img.setAttribute('data-src', data.source);
			// if have recursion render or source, display in viewer
			if(data.grid || data.source) {
				img.addEventListener('click', onClickGalleryImage);
				img.addEventListener('load', shiftMasonryItems);
			}
			img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
			gallery.querySelectorAll('.column')[galleryIndex % totalCol].appendChild(img);
		}
	}
}

function onClickGalleryImage() {
	event.stopPropagation();
	if(event.target.getAttribute('data-src') != null && typeof openImageUrlInViewer == 'function')
		return openImageUrlInViewer(event.target.getAttribute('data-src'));
	if(typeof openGridInViewer == 'function')
		return openGridInViewer(event.target.getAttribute('data-section'), event.target.getAttribute('data-component'), event.target.getAttribute('data-gallery'), event.target.getAttribute('data-type'));
}

function shiftMasonryItems() {
	let diff = 200;
	// shift items up if possible
	let gallery = event.target.closest('.masonry');
	// if fully loaded, then continue
	if(gallery && Array.from(gallery.querySelectorAll('img')).filter(i => i.complete).length != gallery.querySelectorAll('img').length)	return;
	// find all column heights
	let columns = gallery?.querySelectorAll('.column');
	if(columns) {
		let columnHeights = Array.from(columns).map(g => g.getBoundingClientRect().height);
		// console.log(columnHeights);
		// if have disparity
		let minHeight = Math.min(...columnHeights);
		let maxHeight = Math.max(...columnHeights);
		if(minHeight < 1) return;
		if(maxHeight - minHeight > diff) {
			// destination: shortest height column
			let destColumn = columns[columnHeights.indexOf(minHeight)];
			// console.log(destColumn);
			// source: column with last item equal or lesser than disparity
			let sourceColumn = Array.from(columns).filter(c => c.querySelectorAll('img')[c.querySelectorAll('img').length-1]?.clientHeight <= diff && c != destColumn);
			if(sourceColumn.length > 0) {
				sourceColumn = sourceColumn[0];
				// console.log(sourceColumn);
				// move image from source to dest column
				let source = sourceColumn.querySelectorAll('img')[sourceColumn.querySelectorAll('img').length-1];
				let clone = source.cloneNode(true);
				clone.addEventListener('click', onClickGalleryImage);
				source.remove();
				destColumn.appendChild(clone);
			}
		}
	}
}

function renderTags(sectionNo, index, component) {
	let elem = document.querySelector('#section'+sectionNo+'cell'+index);
	let tags = document.createElement('div');
	tags.classList.add(component.type);
	if(component.values == 'string')
		tags.innerHTML = component.values;
	else {
		for(let tagValue of component.values) {
			let tagSpan = document.createElement('span');
			tagSpan.classList.add('tags-value');
			tagSpan.innerText = (component.prefix ?? '') + tagValue;
			if(component.filter)
				tagSpan.addEventListener('click', filterMasonryItems);
			tags.appendChild(tagSpan);
		}
	}
	elem.appendChild(tags);	
}

function filterMasonryItems() {
	return;
}

function openGridInViewer(sectionIndex, componentIndex, galleryIndex, source) {
	let viewer = document.querySelector('.viewer');
	viewer.tabIndex = 0;
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	// add viewer container
	let component = document.createElement('div');
	component.id = 'section' + (sectionIndex) + 'viewer';
	component.classList.add('section-viewer');
	component.addEventListener('click', function() {
		event.stopPropagation();
	});
	viewer.appendChild(component);
	viewer.focus();	
	// render grid
	let galleryData = window['elements'][sectionIndex]['cData'][componentIndex]['datas'][galleryIndex].grid;
	renderGrid((sectionIndex) + 'viewer', galleryData, source);	
	adjustViewerMargin();
	// add focusables
	for(let focusable of document.querySelectorAll('.focusable')) {
		if(focusable == document.activeElement)
			window['active'] = focusable;
		focusable.tabIndex = -1;
	}
	// add keyboard events for viewer items only
	for(let focusable of document.querySelectorAll('.viewer .focusable')) {
		focusable.tabIndex = 0;
		focusable.addEventListener('keyup', function() {
			if(event.keyCode == 13)
				this.click();
		});
	}
}

