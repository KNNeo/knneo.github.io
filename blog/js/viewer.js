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
		!img.parentElement.href.includes('#'))
		{
			window['viewer-list'].push(img.parentElement);
		}
	}
	
	//any image with url will open in new tab
	for (let img of document.getElementsByTagName('img'))
	{
		if(img.parentElement.tagName.toUpperCase() == 'A' && 
		!img.parentElement.href.includes('#'))
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
	openImageInViewer(this);
}

function openImageInViewer(image) {
	let imgNo = updateImageNo(image);
	let viewer = document.getElementById('viewer');
	
	let viewerPrev = document.createElement('div');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	if(imgNo-1 >= 0)
		viewerPrev.addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo-1]);
			return false;
		}, false);
	let viewerNext = document.createElement('div');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	if(imgNo+1 < window['viewer-list'].length)
		viewerNext.addEventListener('click', function(e) {
			openImageInViewer(window['viewer-list'][imgNo+1]);
			return false;
		}, false);
	
	let thumbnail = image.cloneNode(true);
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = thumbnail.href;
	img.title = thumbnail.title;
	img.style.height = '100dvh';
	img.style.width = '100dvw';
	img.addEventListener('click', closeViewer);
	
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
	if(imgNo+1 < window['viewer-list'].length) viewer.appendChild(viewerNext);
	viewer.appendChild(img);
	
	viewer.style.opacity = 1;
	viewer.style.visibility = 'visible';
	
	document.body.style.overflow = 'hidden';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	viewer.style.opacity = '';
	viewer.style.visibility = '';
	viewer.innerHTML = '';
	viewer.onclick = null;
	if(viewer.parentElement) viewer.parentElement.style.overflow = '';
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	
	document.body.style.overflow = '';
}

window.addEventListener('keyup', function() {
	// if escape close viewer
	if(event.keyCode == 27 && typeof closeViewer == 'function') closeViewer();
});
