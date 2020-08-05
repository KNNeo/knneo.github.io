//--SETTINGS--//
let enableViewer = true; //images smaller than screen will not resize up
let enableOrientation = true; //assume has values in orientation column
let enableSlideshow = true; //enable slideshow button
let enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
let enableShadows = 'boolean'; //removes shadows and borders in images

let pageTitle = 'GALLERY'; //for tab, and top of page
let pageDescription = 'Use this page to create your own private image gallery!\n(Add to array in image-gallery.js)'; //hides on load with images loaded
let pageCredit = ''; //does not hide, and will hide if empty
let theme = 'white'; //do up shadow for white theme {white, black}
let tagTitle = 'Girls';
let defaultTag = ''; //if empty will select first tag in list, follow surugaya-gallery

//--COMMON LOADER--//
//should add in here only if common; reconcile all differences via settings
function renderPage() {
	document.getElementsByTagName('head')[0].getElementsByTagName('title')[0].innerText = pageTitle;
	
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
	navigationPara.style.paddingBottom = '20px';
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
	options.id = 'description';
	options.style.textAlign = 'center';
	options.style.margin = 'auto';
		let description = document.createElement('div');
		//description.id = 'description';
		let descriptionText = document.createElement('h5');
		descriptionText.innerText = pageDescription;
		description.appendChild(descriptionText);
		options.appendChild(description);
		let loader = writeLoadedCount();
		options.appendChild(loader);
	frame.appendChild(options);
	
	let credit = document.createElement('div');
	credit.id = 'credit';
	credit.style.textAlign = 'center';
	credit.style.margin = 'auto';
	credit.innerText = pageCredit;
	frame.appendChild(credit);
	
	let toggler = document.createElement('div');
	toggler.style.textAlign = 'center';
	toggler.style.position = enableOrientation ? 'absolute' : 'inherit';
	toggler.style.left = '0';
	toggler.style.right = '0';
	toggler.style.backgroundColor = 'transparent';
	let togglerButton = document.createElement('i');
	togglerButton.classList.add('material-icons');
	togglerButton.id = 'toggler';
	togglerButton.style.cursor = 'pointer';
	togglerButton.style.fontSize = '32px';
	togglerButton.innerText = 'blur_linear';
	togglerButton.addEventListener('click', function() { 
		this.innerText = this.innerText == 'blur_linear' ? 'maximize': 'blur_linear'; 
		if(enableOrientation) this.parentElement.style.position = this.parentElement.style.position == 'absolute' ? 'inherit' : 'absolute';
		toggleFilter();
	} );
	toggler.appendChild(togglerButton);
	frame.appendChild(toggler);
	
	let filter = document.createElement('div');
	filter.id = 'filter';
	toggler.style.textAlign = 'center';
	filter.style.maxWidth = '1040px';
	filter.style.margin = 'auto';
	filter.style.paddingTop = '10px';
		let orientation = document.createElement('div');
		orientation.id = 'orientation';
		orientation.style.display = enableOrientation ? '' : 'none';
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
	midline.id = 'midline';
	frame.appendChild(midline);
	
	let ssDiv = document.createElement('div');
	ssDiv.style.textAlign = 'center';
	ssDiv.style.padding = '10px';
		let ssStartSpan = document.createElement('span');
		ssStartSpan.id = 'ssstart';
		ssStartSpan.style.display = enableSlideshow ? '' : 'none';
		ssStartSpan.innerText = 'Slideshow';
		ssStartSpan.addEventListener('click', startSlideshow);
		ssDiv.appendChild(ssStartSpan);
		let ssStopSpan = document.createElement('span');
		ssStopSpan.id = 'ssstop';
		ssStopSpan.style.display = 'none';
		ssStopSpan.innerText = 'Stop';
		ssStopSpan.addEventListener('click', stopSlideshow);
		ssDiv.appendChild(ssStopSpan);
		let inViewer = document.createElement('label');
		inViewer.style.display = enableViewer ? '' : 'none';
		inViewer.innerText = 'In Viewer';
			let inViewerCheckbox = document.createElement('input');
			inViewerCheckbox.id = 'inViewer';
			inViewerCheckbox.type = 'checkbox';
			inViewerCheckbox.name = 'inViewer';
		inViewer.insertBefore(inViewerCheckbox, inViewer.childNodes[0]);
		ssDiv.appendChild(inViewer);
		let fullscreen = document.createElement('label');
		fullscreen.style.display = enableSlideshow && enableFullscreenSlideshow ? '' : 'none';
		fullscreen.innerText = 'Fullscreen';
			let fullscreenCheckbox = document.createElement('input');
			fullscreenCheckbox.id = 'isFullscreen';
			fullscreenCheckbox.type = 'checkbox';
			fullscreenCheckbox.name = 'fullscreen';
		fullscreen.insertBefore(fullscreenCheckbox, fullscreen.childNodes[0]);
	ssDiv.appendChild(fullscreen);
	
	frame.appendChild(ssDiv);

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
	
	let darkmodeDiv = document.createElement('div');
	darkmodeDiv.title = 'Toggle Dark Mode';
	darkmodeDiv.style.textAlign = 'center';
	let darkmode = document.createElement('i');
	darkmode.classList.add('material-icons');
	darkmode.id = 'darkmode';
	darkmode.style.cursor = 'pointer';
	darkmode.innerText = 'brightness_high';
	darkmodeDiv.appendChild(darkmode);
	frame.appendChild(darkmodeDiv);
	
	body.innerHTML = '';
	body.appendChild(frame);
}

//--COMMON EVENTS--//
//temp code
window.onload = loadPage('bromide-gallery'); //default

//viewer
function openViewer(image) {
	if(!enableViewer) return;
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
	adjustViewerMargin();
}

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
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

//slideshow
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').classList.add('closed');
	switchButtons();
	openFullscreen();
	let imgNo = randomImg();
	if(document.getElementById('inViewer').checked) openViewer(document.getElementsByTagName('img')[imgNo]);
}
//stop slideshow
function stopSlideshow() {
	closeFullscreen();
	switchButtons();
	clearTimeout(runSlideshow);
}

function switchButtons() {
	document.getElementById('ssstart').style.display = document.getElementById('ssstart').style.display == 'none' ? '' : 'none';
	document.getElementById('ssstop').style.display = document.getElementById('ssstop').style.display == 'none' ? '' : 'none';
	document.getElementById('inViewer').disabled = document.getElementById('inViewer').disabled ? false : true;
	document.getElementById('isFullscreen').disabled = document.getElementById('isFullscreen').disabled ? false : true;
}

function randomImg() {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
	let images = document.getElementsByClassName('profile-box');
	let select = Math.floor(Math.random()*images.length);
	let selected = images[select];
	selected.scrollIntoView();
	if(viewer.style.display == 'block') openImageInViewer(selected.getElementsByTagName('img')[0]);
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	runSlideshow = setTimeout(randomImg, 3000);
	return select;
}

//allow document to fullscreen
function openFullscreen() {
if(!document.getElementById('isFullscreen').checked) return;
let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
let elem = document.documentElement;
if(document.fullscreenElement == null) return;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE/Edge */
    document.msExitFullscreen();
  }
}

function toggleFilter() {
	document.getElementById('filter').style.display = document.getElementById('filter').style.display == 'none' ? '' : 'none';
	document.getElementById('midline').style.display = document.getElementById('midline').style.display == 'none' ? '' : 'none';
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