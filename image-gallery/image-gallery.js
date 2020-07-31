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

//--COMMON CODE--//
//should add in here only if common; reconcile all differences via settings
let body = document.getElementsByTagName('body')[0];
let frame = document.createElement('div');
frame.id = 'bromide-gallery';

let viewer = document.createElement('div');
viewer.id = 'viewer';
viewer.style.display = 'none';
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
	newLink.href = link;
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

let filter = document.createElement('div');
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
landscapeCheckbox.value = 'Landscape';
landscapeCheckbox.checked = true;
landscape.appendChild(landscapeCheckbox);
let landscapeText = document.createElement('span');
landscapeText.innerText = 'landscape';
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

let ssDiv
let ssStartSpan
let ssStopSpan
let fullscreen
let fullscreenCheckbox

let imgGallery = document.createElement('div');
imgGallery.id = 'imgGallery';
//profile-category
frame.appendChild(imgGallery);
body.appendChild(frame);

//--FUNCTIONS--//
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
let pageName = window.location.pathname.split('/').pop().replace('.html','');
function loadStyle(url) {
	let css = document.createElement('link');
	css.id = url ?? pageName;
	css.href = (url ?? pageName) + '.css';
	css.type = 'text/css';
	css.rel = 'stylesheet'
	document.getElementsByTagName('head')[0].appendChild(css);
}

function unloadStyle() {
	document.getElementById(url).parentNode.removeChild(document.getElementById(url));
}


//temp code
window.onload = loadStyle('bromide-gallery');