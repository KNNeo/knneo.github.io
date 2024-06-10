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

function updateImageNo(image) {
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
	let imgNo = updateImageNo(image);
	let viewer = document.querySelector('.viewer');
	
	let viewerPrev = document.querySelector('.viewer-nav.prev');
	if(!viewerPrev) {
		viewerPrev = document.createElement('div');
		viewerPrev.classList.add('viewer-nav');
		viewerPrev.classList.add('prev');
		viewer.appendChild(viewerPrev);
	}
	if(imgNo-1 >= 0) {
		viewerPrev.classList.add('prev');
		viewerPrev.onclick = function(e) {
			openImageInViewer(window['viewer-list'][imgNo-1]);
			runLoader();
			return false;
		};
	}
	else {
		viewerPrev.classList.remove('prev');
		viewerPrev.onclick = null;
	}
	
	let viewerNext = document.querySelector('.viewer-nav.next');
	if(!viewerNext) {
		viewerNext = document.createElement('div');
		viewerNext.classList.add('viewer-nav');
		viewerNext.classList.add('next');
		viewer.appendChild(viewerNext);
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
		viewerNext.classList.remove('next');
		viewerNext.onclick = null;
	}
	
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
	
	window['loading'] = true;
	viewer.classList.add('open');
	window.location.hash = '_view_';
}

function openImagesInViewer(images) {
	//each object in images should contain [1] position, [2] img src
	// console.log(images);
	let viewer = document.querySelector('.viewer');
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	
	let container = document.createElement('div');
	container.classList.add('overview');
	
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
	
	viewer.appendChild(container);
	viewer.classList.add('open');
	window.location.hash = '_view_';
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	if(viewer != null) {
		viewer.classList.remove('open');
		if(document.getElementById('CloseBtn') != undefined)
			document.getElementById('CloseBtn').remove();	
		document.body.style.overflow = '';
	}
	window.location.hash = '_';
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