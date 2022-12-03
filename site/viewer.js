function generateViewer() {
	initializeVariablesForViewer();
	
	if(document.querySelector('.viewer') == null)
	{
		let viewer = document.createElement('div');
		viewer.classList.add('viewer');
		viewer.tabIndex = 0;
		viewer.style.visibility = '';
		viewer.style.opacity = '0';
		viewer.addEventListener('click', closeViewer);
		viewer.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			return false;
		}, false);
		document.addEventListener('keyup', function() {
			if(event.keyCode == 27)
				closeViewer();
		});
		document.body.appendChild(viewer);
	}
}

function initializeVariablesForViewer() {
	window['singleView'] = false;
	window['imageNo'] = 0;
	window['linkedImgList'] = [];
}

function updateImageNo(image) {
	window['imageNo'] = 0;
	for(let img of window['linkedImgList'])
	{
		if(img.style.backgroundImage == image.style.backgroundImage)
		{
			return window['imageNo'];
		}
		window['imageNo']++;
	}
	return 0;
}

function openViewer(image) {
	if(window['singleView']) createLinkedList();
	openImageInViewer(image);
}

function createLinkedList() {
	window['linkedImgList'] = [];
	for(let img of document.getElementsByClassName('grid-image'))
	{
		window['linkedImgList'].push(img);
	}
}

function openImageUrlInViewer(url) {	
	let viewer = document.querySelector('.viewer');
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	let loader = document.createElement('div');
	loader.classList.add('material-icons');
	loader.classList.add('loader');
	loader.style.background = 'transparent';
	loader.addEventListener('click', function() {
		window['loading'] = false;
		runLoader();
		closeViewer();
	});
	let img = document.createElement('img');
	img.src = url;
	if(window.innerHeight > window.innerWidth && img.getBoundingClientRect().width >= window.innerWidth)
		img.style.width = 'inherit'; //portrait
	if(window.innerHeight <= window.innerWidth && img.getBoundingClientRect().height >= window.innerHeight)
		img.style.height = 'inherit'; //landscape
	img.style.maxHeight = '80vh';
	img.style.maxWidth = '80vw';
	img.style.opacity = 0;
	img.addEventListener('load', function() {
		setTimeout(function() {
			img.style.opacity = 1;
			window['loading'] = false;
			runLoader();
		}, 100);
	});	
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	viewer.appendChild(loader);
	viewer.appendChild(img);
	viewer.focus();
	window['loading'] = true;
	runLoader();
	setTimeout(adjustViewerMargin, 50);
}

function adjustViewerMargin() {
	let viewer = document.querySelector('.viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.querySelector('img');
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (window.innerHeight - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	if(viewer != null)
	{
		viewer.style.visibility = '';
		viewer.style.opacity = '0';
		viewer.innerHTML = '';
	}
	
	for(let focusable of document.querySelectorAll('.focusable'))
	{
		focusable.tabIndex = 0;
	}
	window['active']?.focus();
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
