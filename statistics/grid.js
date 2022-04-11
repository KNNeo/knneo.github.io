//main function to render detachable component
function renderGrid(sectionNo, content) {
	let section = document.getElementById('section'+sectionNo);
	section.innerHTML = '';
	
	let table = document.createElement('table');
	table.classList.add('container');
	
	let tbody = document.createElement('tbody');
	
	//for mobile, stack all elements in one column
	if(window.innerWidth <= 800)
	{
		let totalComponents = content.rows + content.columns;
		content.columns = 1;
		content.rows = totalComponents;
		for(let c = 0; c < content.componentData.length; c++)
		{
			content.componentData[c].columns = 1;
		}
	}
	// console.log(content);
	
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
			td.style.width = (100 / content.columns) + '%';
			td.style.height = (100 / content.rows) + '%';
			
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
		let comp = document.getElementById('section'+sectionNo+'cell'+index);
		if(component.type == 'title')
		{
			comp.style.verticalAlign = 'center';
			
			if(component.prefix)
			{
				let pre = document.createElement('div');
				pre.classList.add('caption');
				pre.innerText = component.prefix;
				comp.appendChild(pre);
			}
			
			let title = document.createElement('h1');
			title.innerText = component.title;
			comp.appendChild(title);
			
			if(component.suffix)
			{
				let post = document.createElement('div');
				post.innerText = component.suffix;
				comp.appendChild(post);
			}
		}
		else if(component.type == 'image')
		{
			let img = document.createElement('div');
			if(component.tooltip && component.tooltip.length > 0) img.title = component.tooltip;
			img.style.backgroundImage = addBackgroundUrlClause(component.source);
			img.style.width = '100%';
			img.style.height = component.rows > 1 ? '80%' : '100%';
			img.style.margin = 'auto';
			img.style.backgroundSize = 'contain';
			img.style.backgroundRepeat = 'no-repeat';
			img.style.backgroundPosition = 'center';
			comp.appendChild(img);
		}
		else if(component.type == 'gallery')
		{
			let gallery = document.createElement('div');
			gallery.style.width = '100%';
			// gallery.style.height = '100%';
			// gallery.style.margin = 'auto';
			// gallery.style.display = 'flex';
			// gallery.style.flexDirection = 'row';
			// gallery.style.justifyContent = 'center';
			// gallery.style.alignItems = 'center';
			
			for(let data of component.datas)
			{
				let img = document.createElement('div');
				if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
				img.style.backgroundImage = addBackgroundUrlClause(data.source);
				img.style.width = '20%';
				img.style.height = '7em';
				img.style.margin = '5px';
				img.style.display = 'inline-block';
				img.style.backgroundSize = 'contain';
				img.style.backgroundRepeat = 'no-repeat';
				img.style.backgroundPosition = 'center';
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
			
			comp.appendChild(gallery);
		}
	}
	
}

