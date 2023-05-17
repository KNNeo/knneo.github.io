function getTimeframe(startDate, endDate, gapsPerUnit, unit) {
	let diff = -1;
	if(luxon && config.timezone)
		diff = luxon.DateTime.fromISO(endDate).setZone(config.timezone).diff(luxon.DateTime.fromISO(startDate), unit)[unit];
	// console.log(startDate, endDate, diff);
	return diff * gapsPerUnit;
}

function generateVerticalTimeline(id, data, width, height) {
	let base = document.querySelector('#' + id);
	
	let timeline = document.createElement('div');
	timeline.classList.add('block');
	timeline.classList.add('grid');
	// timeline.classList.add('box');
	if(width) timeline.style.width = width;
	if(height) timeline.style.height = height;
	
	let prev = null;
	for(let item of data)
	{
		if(prev) {
			let gaps = Math.floor(getTimeframe(prev, item.date, 0.5, 'months'));
			if(gaps > 0)
				generateRows(timeline, gaps);
			
		}
		
		generateRow(timeline, function() {
			generateProfileFromJSON(this.querySelector('.description'));
		}, item);
		
		prev = item.date;
	}

	base.appendChild(timeline);
	
	return;
}

function generateRows(parentElem, repeat, onClick, item) {
	for(i = 0; i < parseInt(repeat); i++)
	{
		generateRow(parentElem, onClick, item);
	}
}

function generateRow(parentElem, onClick, item) {
	let container = document.createElement('div');
	container.classList.add('container');
	if(onClick) container.addEventListener('click', onClick);
	
	generateCell(container, 'thumb', item?.date);
	
	generateCell(container, 'blob', '|');
	
	generateCell(container, 'description', item?.name);
	
	parentElem.appendChild(container);
}

function generateCells(parentElem, repeat, className, val) {
	for(i = 0; i < parseInt(repeat); i++)
	{
		generateCell(parentElem, className, val);
	}	
}

function generateCell(parentElem, className, val, onClick, onMouseover, onMouseout) {
	let cell = document.createElement('div');
	cell.classList.add('dimmed');
	if(className) cell.classList.add(className);
	if(val) cell.innerText = val;
	if(onClick) cell.addEventListener('click', onClick);
	if(onMouseover) cell.addEventListener('mouseover', onMouseover);
	if(onMouseout) cell.addEventListener('mouseout', onMouseout);
	if(parentElem) parentElem.appendChild(cell);
}

function generateHorizontalTimeline(id, data, width, height) {
	let base = document.querySelector('#' + id);
	
	let timeline = document.createElement('div');
	timeline.classList.add('block');
	timeline.classList.add('grid-horiz');
	// timeline.classList.add('box');
	if(width) timeline.style.width = width;
	if(height) timeline.style.height = height;
			
	let container = document.createElement('div');
	container.classList.add('container-horiz');
	
	let counter = 0;
	let prev = null;
	for(let item of data)
	{
		if(prev) {
			let gaps = Math.floor(getTimeframe(prev, item.date, 1, 'months'));
			if(gaps > 0) {
				generateCells(container, gaps, 'thumb-horiz', '');
			}			
		}
		
		generateCell(container, 'thumb-horiz', item.date);
		
		prev = item.date;
	}
	
	timeline.appendChild(container);
	
	container = document.createElement('div');
	container.classList.add('container-horiz');

	prev = null;
	for(let item of data)
	{
		if(prev) {
			let gaps = Math.floor(getTimeframe(prev, item.date, 1, 'months'));
			if(gaps > 0) {
				generateCells(container, gaps, 'blob-horiz', '-');
			}			
		}
		
		generateCell(container, 'blob-horiz', '-', 
		function() {
			let index = Array.from(this.parentElement.querySelectorAll('.blob-horiz')).indexOf(this);
			generateProfileFromJSON(document.querySelectorAll('.grid-horiz .description-horiz')[index]);
			
		},
		function() {
			let index = Array.from(this.parentElement.querySelectorAll('.blob-horiz')).indexOf(this);
			document.querySelectorAll('.grid-horiz .thumb-horiz')[index].classList.add('selected');
			document.querySelectorAll('.grid-horiz .description-horiz')[index].classList.add('selected');
		}, 
		function() {
			for(let select of document.querySelectorAll('.grid-horiz .selected'))
			{
				select.classList.remove('selected');
			}			
		});
		
		prev = item.date;
	}
	
	timeline.appendChild(container);
	
	container = document.createElement('div');
	container.classList.add('container-horiz');

	prev = null;
	for(let item of data)
	{
		if(prev) {
			let gaps = Math.floor(getTimeframe(prev, item.date, 1, 'months'));
			if(gaps > 0) {
				generateCells(container, gaps, 'description-horiz', '');
			}			
		}
		
		generateCell(container, 'description-horiz', item.name);
		
		prev = item.date;
	}
	
	timeline.appendChild(container);
	
	base.appendChild(timeline);
	
	return;
}