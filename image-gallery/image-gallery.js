//--SETTINGS--//
let enableViewer = false; //images smaller than screen will not resize up
let enableOrientation = false; //assume has values in orientation column
let enableSlideshow = false; //enable slideshow button
let enableFullscreenSlideshow = false; //enable fullscreen button for slideshow, for browser only not viewer
let enableShadows = false; //removes shadows and borders in images

let pageTitle = 'GALLERY'; //for tab, and top of page
let pageDescription = 'Use this page to create your own private image gallery!\n(Add to array in image-gallery.js)'; //hides on load with images loaded
let pageCredit = ''; //does not hide, and will hide if empty
let theme = 'white'; //do up shadow for white theme {white, black}
let tagTitle = 'Tags';
let defaultTag = ''; //if empty will select first tag in list

//--COMMON LOADER--//
//should add in here only if common; reconcile all differences via settings
function renderPage() {
	let body = document.getElementsByTagName('body')[0];
	let frame = document.createElement('div');
	frame.id = 'bromide-gallery';

	let viewer = document.createElement('div');
	viewer.id = 'viewer';
	viewer.style.display = 'none';
	viewer.addEventListener('click', closeViewer);
	frame.appendChild(viewer);

	let title = document.createElement('h1');
	title.innerText = pageTitle;
	frame.appendChild(title);

	//navigation
	let links = ['bromide-gallery.html','amiiboCards-gallery.html','surugaya-gallery.html'];
	let navigationPara = document.createElement('div');
	navigationPara.style.textAlign = 'center';
	for(let link of links)
	{
		let newLink = document.createElement('a');
		//newLink.href = link;
		newLink.addEventListener('click', function() { loadPage(link.replace('.html','')); });
		if(link == links[0]) newLink.innerText = 'GALLERY';
		if(link == links[1]) newLink.innerText = 'amiibo Cards';
		if(link == links[2]) newLink.innerText = 'ギャラリー';
		navigationPara.appendChild(newLink);
	}
	frame.appendChild(navigationPara);

	let options = document.createElement('div');
	options.id = 'options';
		let description = document.createElement('div');
		description.id = 'description';
		let descriptionText = document.createElement('h5');
		descriptionText.innerText = pageDescription;
		description.appendChild(descriptionText);
		options.appendChild(description);
		let loader = writeLoadedCount();
		options.appendChild(loader);
	frame.appendChild(options);

	let filter = document.createElement('div');					//MAKE COLLAPSIBLE WITH ICON
	filter.id = 'filter';
		let orientation = document.createElement('div');
		orientation.id = 'orientation';
		let orientationTitle = document.createElement('h4');
		orientationTitle.innerText = 'Orientation';
		orientation.appendChild(orientationTitle);
			let portrait = document.createElement('label');
			let portraitCheckbox = document.createElement('input');
			portraitCheckbox.type = 'checkbox';
			portraitCheckbox.name = 'columnPortrait';
			portraitCheckbox.value = 'portrait';
			portraitCheckbox.checked = true;
			portrait.appendChild(portraitCheckbox);
			let portraitText = document.createElement('span');
			portraitText.innerText = 'Portrait';
			portrait.appendChild(portraitText);
			orientation.appendChild(portrait);
			let landscape = document.createElement('label');
			let landscapeCheckbox = document.createElement('input');
			landscapeCheckbox.type = 'checkbox';
			landscapeCheckbox.name = 'columnLandscape';
			landscapeCheckbox.value = 'landscape';
			landscapeCheckbox.checked = true;
			landscape.appendChild(landscapeCheckbox);
			let landscapeText = document.createElement('span');
			landscapeText.innerText = 'Landscape';
			landscape.appendChild(landscapeText);
		orientation.appendChild(landscape);
	filter.appendChild(orientation);

	let name = document.createElement('div');
	name.id = 'name';
	let nameTitle = document.createElement('h4');
	nameTitle.innerText = tagTitle;
	name.appendChild(nameTitle);
		//checkboxes
		let selectAll = document.createElement('label');
		let selectAllCheckbox = document.createElement('input');
		selectAllCheckbox.id = 'SelectAll';
		selectAllCheckbox.type = 'checkbox';
		selectAllCheckbox.name = 'columnselectAll';
		selectAllCheckbox.value = 'selectAll';
		selectAllCheckbox.checked = true;
		selectAll.appendChild(selectAllCheckbox);
		let selectAllText = document.createElement('span');
		selectAllText.innerText = 'Select All';
		selectAll.appendChild(selectAllText);
		name.appendChild(selectAll);
	filter.appendChild(name);
	frame.appendChild(filter);

	let midline = document.createElement('hr');
	frame.appendChild(midline);

	let ssDiv //ALLOW SLIDESHOW NORMAL, SLIDESHOW IN VIEWER, SLIDESHOW FULLSCREEN, BOTH
	let ssStartSpan
	let ssStopSpan
	let fullscreen
	let fullscreenCheckbox

	let imgGallery = document.createElement('div');
	imgGallery.id = 'imgGallery';
	frame.appendChild(imgGallery);

	let back = document.createElement('div');
	back.style.textAlign = 'center';
		let backLink = document.createElement('a');
		backLink.href = '../index.html';
		backLink.innerText = 'Back';
	back.appendChild(backLink);
	frame.appendChild(back);
	
	body.innerHTML = '';
	body.appendChild(frame);
}

//--COMMON EVENTS--//
//temp code
window.onload = loadPage('bromide-gallery'); //default

//viewer
function openViewer(image) {
	document.getElementById('viewer').style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {
	let viewer = document.getElementById('viewer');
	let img = image.cloneNode(true);
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	viewer.appendChild(img);
	adjustViewerMargin(viewer);
}

function adjustViewerMargin(viewer) {
	if(viewer.getElementsByTagName('img')[0] == null) return;
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - viewer.getElementsByTagName('img')[0].height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	viewer.style.display = 'none';
	viewer.innerHTML = '';
}


//--FUNCTIONS--//
function loadPage(pageName) {
	renderPage();
	unloadCurrentStyle();
	loadStyle(pageName);
}

function writeLoadedCount(number) {
	let loader = document.createElement('h5');
	let loaderPrefix = document.createElement('span');
	loaderPrefix.innerText = '[';
	loader.appendChild(loaderPrefix);
	let loaderSpan = document.createElement('span');
	loaderSpan.id = 'loadedCount';
	loaderSpan.innerText = number ?? 0;
	loader.appendChild(loaderSpan);
	let loaderSuffix = document.createElement('span');
	loaderSuffix.innerText = ' images loaded]';
	loader.appendChild(loaderSuffix);
	return loader;
}

//load CSS file based on URL
function loadStyle(url) {
	let css = document.createElement('link');
	css.id = url + '-css';
	css.href = url + '.css';
	css.type = 'text/css';
	css.rel = 'stylesheet'
	document.getElementsByTagName('head')[0].appendChild(css);
}

function unloadCurrentStyle() {
	//let currentPageName = window.location.pathname.split('/').pop().replace('.html','');
	let currentPageName = document.getElementsByTagName('body')[0].getElementsByTagName('div')[0].id + '-css';
	if(document.getElementById(currentPageName) != null)
		document.getElementById(currentPageName).parentNode.removeChild(document.getElementById(currentPageName));
}