//main function to render detachable component
function renderGrid(sectionNo, content) {
	let section = document.querySelector('#section'+sectionNo);
	section.innerHTML = '';
	
	let table = document.createElement('table');
	table.classList.add('container');
	
	let tbody = document.createElement('tbody');
	
	content.componentData.sort(function(a,b) {
		return a.sortOrder - b.sortOrder;
	});
	
	//for mobile, stack all elements in one column
	if(window.innerWidth <= 800 && content.columns > 1)
	{
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
	
	//render data
	for(let index = 0; index < content.componentData.length; index++)
	{
		let component = content.componentData[index];
		let elem = document.querySelector('#section'+sectionNo+'cell'+index);
		if(component.type == 'title')
		{
			elem.style.verticalAlign = 'center';
			
			if(component.prefix)
			{
				let pre = document.createElement('div');
				pre.classList.add('caption');
				pre.innerText = component.prefix;
				elem.appendChild(pre);
			}
			
			let title = document.createElement(window.innerWidth <= 800 ? 'h2' : 'h1');
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
			img.style.width = '100%';
			img.style.height = component.rows > 1 ? '80%' : '100%';
			img.style.margin = 'auto';
			img.style.backgroundSize = 'contain';
			img.style.backgroundRepeat = 'no-repeat';
			img.style.backgroundPosition = 'center';
			// img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
			
			if(component.link && component.link.length > 0)
			{
				let url = document.createElement('a');
				url.href = component.link;
				// url.setAttribute('target', '_blank');
				url.appendChild(img);
				elem.appendChild(url);
			}
			else
			{
				elem.appendChild(img);
			}			
		}
		else if(component.type == 'images')
		{
			elem.style.height = '100%';
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
					if(window.innerWidth < 800)
					{
						img.style.width = (100 / (component.datas.length + 1)) + '%';
					}
					else
					{
						img.style.height = ((window.innerHeight / (content.rows)) - (20 * component.datas.length)) + 'px';
					}
				}
				if(component.rows > 0)
				{
					if(window.innerWidth < 800)
					{
						img.style.width = (100 / (component.datas.length + 1)) + '%';
					}
					else
					{
						gallery.style.width = (window.innerWidth / (content.columns + 1)) + 'px';
						img.style.height = (window.innerHeight * 0.8 / (component.datas.length)) + 'px';
					}
				}
				img.style.margin = '5px';
				img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
				
				if(data.link)
					url.href = data.link;
				else
					img.addEventListener('click', function(e) { openImageUrlInViewer(this.getAttribute('data-src')); });
				
				url.appendChild(img);
				gallery.appendChild(url);
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
		else if(component.type == 'gallery')
		{
			if(typeof generateViewer == 'function') generateViewer();
			
			let gallery = document.createElement('div');
			gallery.classList.add(component.type);
			gallery.style.width = '100%';
			// gallery.style.height = '100%';
			// gallery.style.margin = 'auto';
			// gallery.style.display = 'flex';
			// gallery.style.flexDirection = 'row';
			// gallery.style.justifyContent = 'center';
			// gallery.style.alignItems = 'center';
			
			for(let galleryIndex = 0; galleryIndex < component.datas.length; galleryIndex++)
			{
				let data = component.datas[galleryIndex];
				let img = document.createElement('img');
				if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
				img.src = data.thumbnail;		
				if(data.grid)
				{
					img.setAttribute('data-section', sectionNo);
					img.setAttribute('data-component', index);
					img.setAttribute('data-gallery', galleryIndex);
				}
				else img.setAttribute('data-src', data.source);
				if(window.innerWidth < 800)
				{
					img.style.height = (100 / (component.datas.length + 1)) + 'vw';
					// img.style.maxHeight = '33vw';
				}
				else img.style.height = '7em';
				img.style.margin = '5px';
				img.style.display = 'inline-block';
				img.style.backgroundSize = 'contain';
				img.style.backgroundRepeat = 'no-repeat';
				img.style.backgroundPosition = 'center';
				img.style.cursor = 'pointer';
				if(data.grid || data.source)
					img.addEventListener('click', function(e) {
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
	}
	
}

function openGridInViewer(sectionIndex, componentIndex, galleryIndex) {
	let viewer = document.querySelector('.viewer');
	viewer.tabIndex = 999;
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';

		let component = document.createElement('div');
		component.id = 'section' + (sectionIndex) + 'viewer';
		component.classList.add('section-viewer');
		viewer.appendChild(component);

	viewer.appendChild(component);
	viewer.focus();	
	
	let galleryData = window['elements'][sectionIndex]['componentData'][componentIndex]['datas'][galleryIndex].grid;
	renderGrid((sectionIndex) + 'viewer', galleryData);	
	adjustViewerMargin();
	
}

