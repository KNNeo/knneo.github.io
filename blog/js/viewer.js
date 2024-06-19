//--VIEWER--//
function generateViewer() {
	let viewer = document.querySelector('.viewer');
	if(viewer == null) {
		// create viewer
		viewer = document.createElement('div');
		viewer.classList.add('viewer');
		document.body.appendChild(viewer);
	}
	if(!localStorage.getItem('viewer-hints') || localStorage.getItem('viewer-hints') == 'true')
		toggleViewerHints();
	if(viewer != null) {
		// prevent right click
		viewer.addEventListener('contextmenu', function() {
			event.preventDefault();
			toggleViewerHints();
			return false;
		}, false);
		// if esc key close viewer
		window.addEventListener('keyup', function() {
			if(event.keyCode == 27 && typeof closeViewer == 'function') closeViewer();
		});		
		viewer.addEventListener('touchstart', onViewerTouchStart);
		viewer.addEventListener('touchend', onViewerTouchEnd);
	}

	window['viewer-list'] = [];
	for(let img of document.getElementsByTagName('img')) {
		if(img.parentElement.tagName.toUpperCase() == 'A' && 
		!img.parentElement.href.includes('#'))
			window['viewer-list'].push(img.parentElement);
	}
	
	//any image with url will open in new tab (non-external)
	for (let img of document.getElementsByTagName('img')) {
		let elem = img.parentElement;
		if(elem.tagName.toUpperCase() == 'A' &&
		elem.getAttribute('target') != '_blank') {
			let srcInd = img.src.replace('//','').indexOf('/');
			let srcDomain = srcInd >= 0 ? img.src.substring(0,srcInd) : null;
			let fileInd = elem.href.replace('//','').indexOf('/');
			let fileDomain = fileInd >= 0 ? elem.href.substring(0,fileInd) : null;
			if(srcDomain == fileDomain) { // image src must be in same domain as link href
				elem.addEventListener('click', function(e) {
					e.preventDefault();
				});
				elem.addEventListener('click', openViewer);
			}
		}
	}
}

function toggleViewerHints() {
	let viewer = document.querySelector('.viewer');
	if(viewer != null) {
		viewer.classList.toggle('hints');
		localStorage.setItem('viewer-hints', viewer.classList.contains('hints'));
	}
}

function getImageIndex(image) {
	let imageNo = 0;
	for(let img of window['viewer-list'])
	{
		if(img.href == image.href)
		{
			return imageNo;
		}
		imageNo++;
	}
	return 0;
}

function openViewer() {
	openImageInViewer(this);
	runLoader();
}

function openImageInViewer(image) {
	let viewer = document.querySelector('.viewer');
	// create nav if missing
	let viewerPrev = document.querySelector('.viewer-nav.prev');
	if(!viewerPrev) {
		viewerPrev = document.createElement('div');
		viewerPrev.classList.add('viewer-nav');
		viewerPrev.classList.add('prev');
		viewer.appendChild(viewerPrev);
	}
	let viewerNext = document.querySelector('.viewer-nav.next');
	if(!viewerNext) {
		viewerNext = document.createElement('div');
		viewerNext.classList.add('viewer-nav');
		viewerNext.classList.add('next');
		viewer.appendChild(viewerNext);
	}
	// show nav based on index
	let imgNo = getImageIndex(image);
	if(imgNo-1 >= 0) {
		viewerPrev.classList.add('prev');
		viewerPrev.onclick = function(e) {
			openImageInViewer(window['viewer-list'][imgNo-1]);
			runLoader();
			return false;
		};
	}
	else {
		viewerPrev.remove();
	}
	if(imgNo+1 < window['viewer-list'].length) {
		viewerNext.classList.add('next');
		viewerNext.onclick = function(e) {
			openImageInViewer(window['viewer-list'][imgNo+1]);
			runLoader();
			return false;
		};
	}
	else {
		viewerNext.remove();
	}
	// create loader
	let loader = document.querySelector('.viewer.loader');
	if(!loader) {
		loader = document.createElement('div');
		loader.classList.add('material-icons');
		loader.classList.add('loader');
		viewer.appendChild(loader);
	}
	loader.onclick = function() {
		window['loading'] = false;
		runLoader();
		closeViewer();		
	};
	// render image
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = thumbnail.href;
	img.title = thumbnail.title;
	img.style.height = '100dvh';
	img.style.width = '100dvw';
	img.addEventListener('load', function() {
		window['loading'] = false;
		runLoader();
	});
	img.addEventListener('click', closeViewer);	
	if(viewer.querySelector('img'))
		viewer.querySelector('img').remove();
	viewer.appendChild(img);
	// display viewer and run loader
	window['loading'] = true;
	viewer.classList.add('open');
}

function openImagesInViewer(images) {
	//each object in images should contain [1] position, [2] img src
	// console.log(images);
	let viewer = document.querySelector('.viewer');
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	// create container for images
	let container = document.createElement('div');
	container.classList.add('overview');
	// add images to container (has theoretical limit based on screen)
	images.forEach(function(image, index, array) {
		let imgContainer = document.createElement('div');
		imgContainer.classList.add('item');
		if(!image.classList.contains('thumbnail-pop'))
			imgContainer.classList.add('selected');
		let thumbnail = image.querySelector('img').cloneNode(true);
		thumbnail.onclick = function() {
			if(typeof switchThumbnails == 'function')
				switchThumbnails(image.closest('.thumbnail'), index);
			closeViewer();
		};
		imgContainer.appendChild(thumbnail);
		container.appendChild(imgContainer);
		
	});
	// display viewer
	viewer.appendChild(container);
	viewer.classList.add('open');
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	if(viewer != null) {
		viewer.classList.remove('open');
		if(document.getElementById('CloseBtn') != undefined)
			document.getElementById('CloseBtn').remove();	
		document.body.style.overflow = '';
	}
}

//--LOADER--//
function runLoader() {
	for(let loader of document.querySelectorAll('.loader')) {
		switch(document.querySelector('.loader').innerText)	{
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
	else {
		for(let loader of document.querySelectorAll('.loader'))
			loader.parentElement.removeChild(loader);
	}
}

//--TOUCH EVENTS--//
function onViewerTouchStart(event) {
	// console.log('onTouchStart', event.changedTouches[0]);
	window['touchY'] = event.changedTouches[0].clientY;
	window['touchX'] = event.changedTouches[0].clientX;
}

function onViewerTouchEnd(event) {
	// console.log('onTouchEnd', event.changedTouches[0]);
	let swipeDown = event.changedTouches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.changedTouches[0].clientY;
	let swipeLeft = window['touchX'] - event.changedTouches[0].clientX;
	let swipeRight = event.changedTouches[0].clientX - window['touchX'];
	// console.log('up', 'down', 'left', 'right');
	// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
	document.querySelector('.next').style.backgroundColor = '';
	document.querySelector('.prev').style.backgroundColor = '';
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight && swipeUp > 100) {
		// ignore
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight && swipeDown > 100) {
		// ignore
		return;
	}
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown && swipeLeft > 100) {
		//newer post
		document.querySelector('.viewer-nav.next')?.click();
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown && swipeRight > 100) {
		//older post
		document.querySelector('.viewer-nav.prev')?.click();
		return;
	}
}
