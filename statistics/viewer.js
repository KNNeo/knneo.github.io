function generateViewer() {
	initializeVariablesForViewer();
	
	if(document.querySelector('.viewer') == null)
	{
		let viewer = document.createElement('div');
		viewer.classList.add('viewer');
		viewer.style.visibility = '';
		viewer.style.opacity = '0';
		viewer.addEventListener('click', closeViewer);
		viewer.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			return false;
		}, false);			
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
	viewer.tabIndex = 999;
	if(viewer.style.visibility != 'visible') viewer.style.visibility = 'visible';
	if(viewer.style.opacity != '1') viewer.style.opacity = '1';
	let img = document.createElement('img');
	img.src = url;
	if(window.innerHeight > window.innerWidth && img.getBoundingClientRect().width >= window.innerWidth)
		img.style.width = 'inherit'; //portrait
	if(window.innerHeight <= window.innerWidth && img.getBoundingClientRect().height >= window.innerHeight)
		img.style.height = 'inherit'; //landscape
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	viewer.appendChild(img);
	viewer.focus();	
	adjustViewerMargin();
}

function adjustViewerMargin() {
	let viewer = document.querySelector('.viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.getElementsByTagName('img')[0];
	if(!image.complete) setTimeout(adjustViewerMargin, 100);
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	viewer.style.visibility = '';
	viewer.style.opacity = '0';
	viewer.innerHTML = '';
}