//main function to render detachable component
function renderGrid(sectionNo, content, isSinglePage) {
	let section = document.querySelector('#section'+sectionNo);
	section.style.height = '75%';
	section.innerHTML = '';
	
	let table = document.createElement('table');
	table.classList.add('container');
	
	let tbody = document.createElement('tbody');
	
	content.componentData.sort(function(a,b) {
		return a.sortOrder - b.sortOrder;
	});
	
	//for mobile, stack all elements in one column
	if(mediumScreenWidth() && content.columns > 1)
	{
		content.componentData = content.componentData.filter(cd => cd.type && cd.type != 'spacer');
		let totalCells = content.componentData.length;
		content.columns = 1;
		content.rows = totalCells;
		for(let c = 0; c < content.componentData.length; c++)
		{
			content.componentData[c].columns = 1;
			content.componentData[c].rows = 1;
		}
		content.componentData.sort(function(a,b) {
			return a.mobileSortOrder - b.mobileSortOrder;
		});	
	}
	// console.log(content.rows, content.columns);
	
	//render table
	let count = 0;
	let cellSkip = [];
	for(let row = 0; row < (content.rows || 1); row++)
	{
		let tr = document.createElement('tr');
		for(let col = 0; col < (content.columns || 1); col++)
		{
			let skip = false;
			for(let cell of cellSkip)
			{
				if(cell[0] == row && cell[1] == col)
				{
					skip = true;
					cellSkip.splice(cellSkip.indexOf(cell),1);
					break;
				}
			}
			if(skip)
				continue;
			
			let td = document.createElement('td');
			td.id = 'section'+sectionNo+'cell'+count;
			td.style.width = content.columns > 1 ? (100 / content.columns) + '%' : '100%';
			td.style.height = content.rows > 1 ? (100 / content.rows) + '%' : '100%';
			// if(smallScreenWidth() && content.rows > 1)
				// td.style.height = (100 / content.columns) + '%';
				
			
			let item = content.componentData[count];
			// td.innerText = item.type;
			if(item && item.rows != undefined)
			{
				td.setAttribute('rowspan', item.rows);
				for(let r = 1; r < item.rows; r++)
				{
					cellSkip.push([row+r,col]);
				}
			}
			
			if(item && item.columns != undefined)
			{
				td.setAttribute('colspan', item.columns);
				for(let c = 1; c < item.columns; c++)
				{
					cellSkip.push([row,col+c]);
				}
			}
			
			tr.appendChild(td);
			count++;
		}
		tbody.appendChild(tr);
	}
	
	table.appendChild(tbody);
	section.appendChild(table);
	
	//render data: from left to right, top to bottom
	for(let index = 0; index < content.componentData.length; index++)
	{
		let component = content.componentData[index];
		let elem = document.querySelector('#section'+sectionNo+'cell'+index);
		if(component.type == 'title')
		{
			elem.style.verticalAlign = 'center';
			elem.style.textAlign = component.align || 'center';
			
			if(component.prefix)
			{
				let pre = document.createElement('div');
				pre.classList.add('caption');
				pre.innerText = component.prefix;
				elem.appendChild(pre);
			}
			
			let titleType = 'h1';
			if(smallScreenWidth()) titleType = 'h2';
			if(smallScreenHeight()) titleType = 'h3';
			let title = document.createElement(titleType);
			title.innerText = component.title;
			elem.appendChild(title);
			
			if(component.suffix)
			{
				let post = document.createElement('div');
				post.innerText = component.suffix;
				elem.appendChild(post);
			}
		}
		else if(component.type == 'image')
		{
			let img = document.createElement('div');
			img.classList.add(component.type);
			if(component.tooltip && component.tooltip.length > 0) img.title = component.tooltip;
			img.style.backgroundImage = addBackgroundUrlClause(component.source);
			img.style.width = '100%';//component.rows > 1 ? '80%' : '100%';
			img.style.height = '100%';
			img.style.margin = 'auto';
			img.style.backgroundSize = 'contain';
			img.style.backgroundRepeat = 'no-repeat';
			img.style.backgroundPosition = 'center';
			// img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
			
			if(component.link && component.link.length > 0)
			{
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
			else
			{
				img.classList.add('focusable');
				elem.appendChild(img);
			}			
		}
		else if(component.type == 'images')
		{
			// elem.style.height = '100%';
			if(typeof generateViewer == 'function') generateViewer();
			
			let gallery = document.createElement('div');
			gallery.classList.add(component.type);
			gallery.style.width = '100%';
			
			for(let data of component.datas)
			{
				let url = document.createElement('a');
				
				let img = document.createElement('img');
				if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
				img.src = data.thumbnail;
				img.setAttribute('data-src', data.source);
				if(component.columns > 0) 
				{
					if(mediumScreenWidth()) // if mobile, all in one row
					{
						img.style.width = (100 / (component.datas.length + 1)) + '%';
					}
					else //if desktop, all in one row
					{
						img.style.width = (100 / (component.columns + 1)) + '%';
						img.style.height = (100 / (component.columns + 1)) + '%';
					}
				}
				if(component.rows > 0)
				{
					if(mediumScreenWidth()) // if mobile, all in one row
					{
						img.style.height = (100 / (component.datas.length + 1)) + '%';
					}
					else //if desktop, all in n rows where n = component.rows
					{
						img.style.width = (100 / (component.rows)) + '%';
						img.style.height = (100 / (component.rows)) + '%';
					}
				}
				img.style.margin = '5px';
				img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
				
				if(data.link)
					url.href = data.link;
				else {
					img.classList.add('focusable');	
					img.addEventListener('click', function() {						
						event.stopPropagation();
						openImageUrlInViewer(this.getAttribute('data-src')); 
					});
				}
				
				url.appendChild(img);
				gallery.appendChild(url);
			}
			
			if(component.caption && component.caption.length > 0)
			{		
				let caption = document.createElement('div');
				caption.classList.add('caption');
				caption.classList.add('focusable');
				caption.innerText = component.caption;
				caption.style.width = '100%';
				caption.style.margin = '5px';
				gallery.appendChild(caption);
			}
			
			elem.appendChild(gallery);
		}
		else if(component.type == 'gallery')
		{
			if(typeof generateViewer == 'function') generateViewer();
			
			let gallery = document.createElement('div');
			gallery.classList.add(component.type);
			gallery.style.width = '100%';
			
			for(let galleryIndex = 0; galleryIndex < component.datas.length; galleryIndex++)
			{
				let data = component.datas[galleryIndex];
				let img = document.createElement('img');
				if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
				img.classList.add('focusable');
				img.src = data.thumbnail;
				img.alt = data.tooltip;
				if(data.grid)
				{
					img.setAttribute('data-section', sectionNo);
					img.setAttribute('data-component', index);
					img.setAttribute('data-gallery', galleryIndex);
				}
				else img.setAttribute('data-src', data.source);
				if(smallScreenWidth())
				{
					img.style.height = '20vw';
				}
				else if (component.size && component.size == 'lg') img.style.height = '12vw';
				else img.style.height = '7vw';
				img.style.margin = '5px';
				if(data.source) img.style.cursor = 'pointer';
				if(data.grid || data.source)
					img.addEventListener('click', function() {
						event.stopPropagation();
						if(this.getAttribute('data-src') != null && typeof openImageUrlInViewer == 'function')
							return openImageUrlInViewer(this.getAttribute('data-src'));
						if(typeof openGridInViewer == 'function')
							return openGridInViewer(this.getAttribute('data-section'), this.getAttribute('data-component'), this.getAttribute('data-gallery'));
					});
				img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
				gallery.appendChild(img);
			}
			
			if(component.caption && component.caption.length > 0)
			{		
				let caption = document.createElement('div');
				caption.classList.add('caption');
				caption.innerText = component.caption;
				caption.style.width = '100%';
				// caption.style.height = '20%';
				caption.style.margin = '5px';
				gallery.appendChild(caption);
			}
			
			elem.appendChild(gallery);
		}
		else if(component.type == 'tags')
		{
			let tags = document.createElement('div');
			tags.classList.add(component.type);
			
			tags.innerHTML = typeof component.values == 'string' ? component.values : component.values.map(c => '<span class="tags-value">' + component.prefix + c + '</span>').join('');
			
			elem.appendChild(tags);
		}
	}
	
}

function openGridInViewer(sectionIndex, componentIndex, galleryIndex) {
	let viewer = document.querySelector('.viewer');
	viewer.tabIndex = 0;
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';

		let component = document.createElement('div');
		component.id = 'section' + (sectionIndex) + 'viewer';
		component.classList.add('section-viewer');
		component.addEventListener('click', function() {
			event.stopPropagation();
		});
		viewer.appendChild(component);

	viewer.appendChild(component);
	viewer.focus();	
	
	let galleryData = window['elements'][sectionIndex]['componentData'][componentIndex]['datas'][galleryIndex].grid;
	renderGrid((sectionIndex) + 'viewer', galleryData);	
	adjustViewerMargin();
	
	for(let focusable of document.querySelectorAll('.focusable'))
	{
		if(focusable == document.activeElement)
			window['active'] = focusable;
		focusable.tabIndex = -1;
	}
	
	for(let focusable of document.querySelectorAll('.viewer .focusable'))
	{
		focusable.tabIndex = 0;
		focusable.addEventListener('keyup', function() {
			if(event.keyCode == 13)
				this.click();
		});
	}
}

