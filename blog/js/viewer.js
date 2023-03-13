//--VIEWER--//
function generateViewer() {
	let viewer = document.getElementById('viewer');
	if(viewer != null)
	{
		viewer.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			return false;
		}, false);
	}

	let imageNo = 0;
	window['viewer-list'] = [];
	for(let img of document.getElementsByTagName('img'))
	{
		if(img.parentElement.tagName.toUpperCase() == 'A' && 
		!img.parentElement.href.includes('#') && 
		!img.parentElement.href.includes('knneo.github.io'))
		{
			window['viewer-list'].push(img.parentElement);
		}
	}
	// console.log('viewer-list', window['viewer-list'].length);
	
	//any image with url will open in new tab
	for (let img of document.getElementsByTagName('img'))
	{
		if(img.parentElement.tagName.toUpperCase() == 'A' && 
		!img.parentElement.href.includes('#') && 
		!img.parentElement.href.includes('knneo.github.io'))
		{
			img.parentElement.addEventListener('click', function(e) {
				e.preventDefault();
			});
			img.parentElement.addEventListener('click', openViewer);
		}
	}
}

function updateImageNo(image) {
	imageNo = 0;
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
	document.getElementById('viewer').style.display = 'block';
	openImageInViewer(this);
}

function openItemInViewer(link) {
	if(typeof generatePopupContent != 'function') return;
	//render popup first
	let item = generatePopupContent(link.target.href);
	// console.log(item);
	if(item == null) return;
	event.preventDefault();
	
	//depends on popup, open in viewer, no navigation	
	// let imgNo = updateImageNo(image);
	let viewer = document.getElementById('viewer');
	viewer.style.display = '';
	let thumbnail = link.target.cloneNode(true);
	
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	
	if(item.includes('div class="separator"'))
	{
		let img = document.createElement('img');
		img.id = thumbnail.id;
		img.classList = thumbnail.classList;
		img.src = thumbnail.href;
		img.title = thumbnail.title;
		img.style.maxHeight = '100%';
		img.style.maxWidth = '100%';
		img.onclick = closeViewer();
		// img.style.visibility = 'hidden';
		// if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
		// if(imgNo+1 < window['viewer-list'].length) viewer.appendChild(viewerNext);
		viewer.appendChild(img);
		adjustViewerMargin();
	}
	else
	{
		// let div = document.createElement('div');
		viewer.style.height = '100vh';
		viewer.style.width = '100vw';
		viewer.onclick = closeViewer();
		viewer.innerHTML = item;
		// viewer.appendChild(div);
		renderEmbedProcess();
	}
	
	viewer.style.opacity = 1;
	viewer.style.visibility = 'visible';
	// if(viewer.parentElement) viewer.parentElement.style.overflow = 'hidden';
	
	
	//FAB to close
	let closeButton = document.createElement('a');
	closeButton.id = 'CloseBtn';
	closeButton.title = 'Close Popup';
	closeButton.style.display = 'initial';
	closeButton.addEventListener('click', closeViewer);
		let closeButtonIcon = document.createElement('i');
		closeButtonIcon.classList.add('material-icons');
		closeButtonIcon.innerText = 'close';
		closeButton.appendChild(closeButtonIcon);
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	document.body.appendChild(closeButton);
}

function openImageInViewer(image) {
	let imgNo = updateImageNo(image);
	let viewer = document.getElementById('viewer');
	let viewerPrev = document.createElement('div');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('div');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = thumbnail.href;
	img.title = thumbnail.title;
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	// img.style.visibility = 'hidden';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length) viewer.appendChild(viewerNext);
	viewer.appendChild(img);
	adjustViewerMargin();
	// img.style.visibility = '';
	
	// console.log('imgNo', imgNo);
	if(imgNo-1 >= 0)
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo-1]);
			return false;
		}, false);
	if(imgNo+1 < window['viewer-list'].length)
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo+1]);
			return false;
		}, false);
		
	img.addEventListener('click', closeViewer);
	
	viewer.style.opacity = 1;
	viewer.style.visibility = 'visible';
	// if(viewer.parentElement) viewer.parentElement.style.overflow = 'hidden';
}

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	if(viewer.querySelector('img') != null)
	{
		let image = viewer.querySelector('img');		
		if(!image.complete) setTimeout(adjustViewerMargin, 200);
		else viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
	}
	else if (viewer.querySelector('iframe') != null)
	{
		let iframe = viewer.querySelector('iframe');
		let iframeDoc = iframe.contentWindow;
		if(iframeDoc == null) setTimeout(adjustViewerMargin, 1000);
		else viewer.style.paddingTop = (viewer.getBoundingClientRect().height - viewer.querySelector('div').getBoundingClientRect().height)/2 + 'px';
	}
	
	document.body.style.overflow = 'hidden';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	// viewer.style.display = 'none';
	viewer.style.opacity = '';
	viewer.style.visibility = '';
	viewer.innerHTML = '';
	viewer.onclick = null;
	if(viewer.parentElement) viewer.parentElement.style.overflow = '';
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	
	document.body.style.overflow = '';
}

window.addEventListener('keyup', onKeyUp);

function onKeyUp() {
	// if escape close viewer
	if(event.keyCode == 27 && typeof closeViewer == 'function') closeViewer();
}