//main function to render detachable component
function renderGrid(sectionNo, content) {
	let section = document.getElementById('section'+sectionNo);
	
	let table = document.createElement('table');
	table.classList.add('container');
	
	let tbody = document.createElement('tbody');
	
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
			if(item.rows != undefined)
			{
				td.setAttribute('rowspan', item.rows);
				for(let r = 1; r < item.rows; r++)
				{
					cellSkip.push([row+r,col]);
				}
			}
			
			if(item.columns != undefined)
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
			comp.style.verticalAlign = 'bottom';
			
			if(component.prefix)
			{
				let pre = document.createElement('h3');
				pre.innerText = component.prefix;
				comp.appendChild(pre);
			}
			
			let title = document.createElement('h1');
			title.innerText = component.title;
			comp.appendChild(title);
			
			if(component.suffix)
			{
				let post = document.createElement('h5');
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
			img.style.height = '80%';
			img.style.margin = 'auto';
			img.style.backgroundSize = 'contain';
			img.style.backgroundRepeat = 'no-repeat';
			img.style.backgroundPosition = 'center';
			comp.appendChild(img);
		}
		else if(component.type == 'gallery')
		{
			let gallery = document.createElement('div');
			gallery.style.width = '80%';
			gallery.style.height = '100%';
			gallery.style.margin = 'auto';
			gallery.style.display = 'flex';
			// gallery.style.flexDirection = 'row';
			gallery.style.justifyContent = 'center';
			gallery.style.alignItems = 'flex-start';
			// gallery.style.alignContent = 'space-between';
			
			for(let data of component.datas)
			{
				let img = document.createElement('div');
				if(data.tooltip && data.tooltip.length > 0) img.title = data.tooltip;
				img.style.backgroundImage = addBackgroundUrlClause(data.source);
				img.style.width = '80%';
				img.style.height = '80%';
				img.style.margin = '5px';
				img.style.backgroundSize = 'contain';
				img.style.backgroundRepeat = 'no-repeat';
				img.style.backgroundPosition = 'center';
				gallery.appendChild(img);
			}
			comp.appendChild(gallery);
		}
	}
	
}

function addBackgroundUrlClause(url) { return "url('" + url + "')"; }
