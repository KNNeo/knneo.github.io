function generateTimeline(id, data, width, height) {
	if(document.querySelector('#' + id) == null) {
		console.error('generateTimeline: element with id "' + id + '" cannot be found in DOM');	return;
	}
	if(typeof data != 'object') {
		console.error('generateTimeline: data unavailable'); return;		
	}
	if(width == height) {
		console.error('generateTimeline: width cannot be equal to height');	return;
	}
	
	generateVerticalTimeline(id, data, width, height);
}

function generateVerticalTimeline(id, data, width, height) {	
	let timeline = document.querySelector('#' + id);
	timeline.classList.add('block');
	timeline.classList.add('grid');
	if(width) timeline.style.width = width;
	if(width) timeline.style.height = height;
	
	for(let item of data)
	{
		let container = document.createElement('div');
		container.classList.add('container');

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
		show.addEventListener('click', function() {
			generateProfileFromJSON(this);
		});
		container.appendChild(show);
		
		timeline.appendChild(container);
	}

	return;
}

function generateHorizontalTimeline() {
	return;
}