//VIEWER//
function createLinkedList(selector) {
	window['viewer-list'] = [];
	for(let img of document.querySelectorAll(selector))
	{
		window['viewer-list'].push(img);
	}
}

function updateImageNo(image) {
	let imageNo = -1;
	for(let img of window['viewer-list'])
	{
		imageNo++;
		if(img.src == image.src)
		{
			return imageNo;
		}
	}
	return imageNo;
}

function openViewer(image) {
	createLinkedList('.grid-item img');
	openImageInViewer(image.querySelector('img'));
	runLoader();
}

function openImageInViewer(image) {	
	let imgNo = updateImageNo(image);
	
	let viewer = document.querySelector('.viewer');
	viewer.setAttribute('index', imgNo);
	viewer.innerHTML = '';
	viewer.tabIndex = 999;
	let viewerPrev = document.createElement('a');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('a');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	let loader = document.createElement('div');
	loader.classList.add('material-icons');
	loader.classList.add('loader');
	loader.addEventListener('click', function() {
		window['loading'] = false;
		runLoader();
		closeViewer();		
	});
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.src = thumbnail.getAttribute('alt');
	img.title = thumbnail.title;
	if(window.innerHeight > window.innerWidth && img.getBoundingClientRect().width >= window.innerWidth)
		img.style.width = 'inherit'; //portrait
	if(window.innerHeight <= window.innerWidth && img.getBoundingClientRect().height >= window.innerHeight)
		img.style.height = 'inherit'; //landscape
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
	img.addEventListener('load', function() {
		setTimeout(function() {
			img.style.opacity = 1;
			if(img.style.transform != 'scale(1)') img.style.transform = 'scale(1)';
			window['loading'] = false;
			runLoader();
		}, 250);
	});
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	if(imgNo-1 >= 0 && window['slideshow'] == null)
		viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null)
		viewer.appendChild(viewerNext);
	viewer.appendChild(loader);
	viewer.appendChild(img);
	if(viewer.classList.contains('hidden')) viewer.classList.remove('hidden');
	viewer.focus();
	window['loading'] = true;
	
	if(imgNo-1 >= 0 && window['slideshow'] == null) {
		document.getElementById('viewer-prev').addEventListener('click', onClickViewerPrev, false);
	}
	if(imgNo+1 < window['viewer-list'].length && window['slideshow'] == null) {
		document.getElementById('viewer-next').addEventListener('click', onClickViewerNext, false);
	}
	img.addEventListener('touchstart', onTouchStart);
	img.addEventListener('touchmove', onTouchMoveViewer, false);
	img.addEventListener('click', closeViewer);
	img.addEventListener('contextmenu', toggleZoom);
	
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	setTimeout(adjustViewerMargin, 50);
}

function onClickViewerPrev() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))-1]);
	window['loading'] = true;
	runLoader();
	return false;
}

function onClickViewerNext() {
	openImageInViewer(window['viewer-list'][parseInt(viewer.getAttribute('index'))+1]);
	window['loading'] = true;
	runLoader();
	return false;
}

function onTouchMoveViewer(e) {
	let swipeDown = e.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - e.touches[0].clientY;
	let swipeLeft = window['touchX'] - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window['touchX'];
	if(config.debug)
		console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		onClickViewerNext();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		onClickViewerPrev();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		closeViewer();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		closeViewer();
		this.removeEventListener('touchmove', onTouchMoveViewer);
		return;
	}
}

function adjustViewerMargin() {
	let viewer = document.querySelector('.viewer');
	if(viewer.childElementCount == 0) return;
	let image = viewer.querySelector('img');
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (window.innerHeight - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	if(viewer.style.display == 'flex') {
		toggleZoom();
		return;
	}
	
	stopSlideshow();
	
	if(!viewer.classList.contains('hidden')) viewer.classList.add('hidden');
	viewer.style.height = '';
	viewer.style.display = '';
	viewer.style.overflow = '';
	
	let img = viewer.querySelector('img');
	img.style.transform = 'scale(0.8)';
	img.style.opacity = 0;
	
}

function toggleZoom() {
	if(window['slideshow'] != null) return;
	
	let viewer = document.querySelector('.viewer');
	let viewerPrev = document.getElementById('viewer-prev');
	let viewerNext = document.getElementById('viewer-next');
	let viewerImage = viewer.querySelector('img');
	if(viewer.getBoundingClientRect().width > viewerImage.getBoundingClientRect().width) return;
	
	let value = viewer.style.display == 'flex';

	if(viewerPrev != null) viewerPrev.style.display = value ? '' : 'none';
	if(viewerNext != null) viewerNext.style.display = value ? '' : 'none';
	
	viewer.style.display = value ? '' : 'flex';
	viewer.style.overflow = value ? '' : 'auto';
	viewerImage.style.maxWidth = value ? '100%' : '';
	viewer.style.height = value ? '' : viewer.getBoundingClientRect().height;
	viewer.style.paddingTop = value ? adjustViewerMargin() : 0;
	
	document.querySelector('.viewer').scrollLeft = document.querySelector('#viewer img').getBoundingClientRect().width*0.5 - window.innerWidth*0.5;
}

function getFilenameInfo(url) {
	let filename = url.substring(url.lastIndexOf('/')+1, url.lastIndexOf('.'));
	let extension = url.substring(url.lastIndexOf('.')+1);
	return {filename, extension};
}

//SLIDESHOW//
function startSlideshow() {
	createLinkedList('.gallery img');
	window['slideshow'] = -1;
	runSlideshow();
}

function runSlideshow() {
	if(window['slideshow'] != null)
	{
		let images = document.querySelectorAll('.gallery img');
		let image = images[Math.floor(Math.random()*images.length)];
		openImageInViewer(image);
		window['loading'] = true;
		runLoader();
		window['slideshow'] = setTimeout(runSlideshow, 5 * 1000);
	}
}

function stopSlideshow() {
	clearTimeout(window['slideshow']);
	window['slideshow'] = null;
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
	if(window['loading'] && document.querySelectorAll('.loader').length > 0)
		setTimeout(runLoader, 500);
	else
	{
		for(let loader of document.querySelectorAll('.loader'))
		{
			loader.parentElement.removeChild(loader);
		}
	}
}
