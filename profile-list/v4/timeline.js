function generateVerticalTimeline(id, data, width, height) {
	let base = document.querySelector('#' + id);
    base.style.width = '480px';
	
	let timeline = document.createElement('div');
	timeline.classList.add('block');
	timeline.classList.add('grid');
	if(width) timeline.style.width = width;
	if(height) timeline.style.height = height;
	
	for(let item of data)
	{
		let container = document.createElement('div');
		container.classList.add('container');
		container.addEventListener('click', function() {
			generateProfileFromJSON(show);
		});

		let date = document.createElement('div');
		date.classList.add('thumb');
		date.classList.add('dimmed');
		date.innerText = item.date;
			
		container.appendChild(date);
		
		let blob = document.createElement('div');
		blob.classList.add('blob');
		blob.classList.add('dimmed');
		blob.innerText = '|';
		container.appendChild(blob);
		
		let show = document.createElement('div');
		show.classList.add('description');
		show.classList.add('dimmed');
		show.innerText = item.name;
		container.appendChild(show);
		
		timeline.appendChild(container);
	}

	base.appendChild(timeline);
	
	return;
}

function generateHorizontalTimeline(id, data, width, height) {
	let base = document.querySelector('#' + id);
    base.style.width = '480px';
	
	let timeline = document.createElement('div');
	timeline.classList.add('block');
	timeline.classList.add('grid-horiz');
	if(width) timeline.style.width = width;
	if(height) timeline.style.height = height;
	
	let container = document.createElement('div');
	container.classList.add('container-horiz');

	let date = document.createElement('div');
	date.classList.add('thumb-horiz');
	date.classList.add('dimmed');
	container.appendChild(date);
	
	let blob = document.createElement('div');
	blob.classList.add('blob-horiz');
	blob.classList.add('dimmed');
	container.appendChild(blob);
	
	let show = document.createElement('div');
	show.classList.add('description-horiz');
	show.classList.add('dimmed');
	container.appendChild(show);
	
	timeline.appendChild(container);
		
	let counter = 1;
			
	for(let item of data)
	{
		let blob = document.createElement('div');
		blob.classList.add('blob-horiz');
		blob.classList.add('dimmed');
		blob.innerText = '-';
		blob.setAttribute('data-id', counter++);
		blob.addEventListener('click', function() {
			let description = document.querySelectorAll('.grid-horiz .description-horiz')[parseInt(this.getAttribute('data-id'))];
			description.click();
		});
		blob.addEventListener('mouseover', function() {
			let thumb = document.querySelectorAll('.grid-horiz .thumb-horiz')[parseInt(this.getAttribute('data-id'))];
			thumb.classList.add('selected');
			let description = document.querySelectorAll('.grid-horiz .description-horiz')[parseInt(this.getAttribute('data-id'))];
			description.classList.add('selected');
		});
		blob.addEventListener('mouseout', function() {
			for(let select of document.querySelectorAll('.grid-horiz .selected'))
			{
				select.classList.remove('selected');
			}
		});
		container.appendChild(blob);
	}
	
	timeline.appendChild(container);
	
	container = document.createElement('div');
	container.classList.add('container-horiz');

	for(let item of data)
	{
		let date = document.createElement('div');
		date.classList.add('thumb-horiz');
		date.classList.add('dimmed');
		date.innerText = item.date;
			
		container.appendChild(date);
	}
	
	timeline.appendChild(container);
	
	container = document.createElement('div');
	container.classList.add('container-horiz');
	
	for(let item of data)
	{
		let show = document.createElement('div');
		show.classList.add('description-horiz');
		show.classList.add('dimmed');
		show.innerText = item.name;
		show.addEventListener('click', function() {
			generateProfileFromJSON(this);
		});
		container.appendChild(show);
	}
	
	timeline.appendChild(container);
	
	base.appendChild(timeline);
	
	return;
}