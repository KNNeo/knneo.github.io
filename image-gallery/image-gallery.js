//--DEFAULT SETTINGS--//
let enableViewer = true; //images smaller than screen will not resize up
let enableOrientation = true; //assume has values in orientation column
let enableSlideshow = true; //enable slideshow button
let enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
let enableShadows = true; //removes shadows and borders in images
let enableDarkMode = true; //no button to toggle, when load always white background

let pageTitle = 'GALLERY'; //for tab, and top of page
let pageDescription = 'Use this page to create your own private image gallery!\n(Add to array in image-gallery.js)'; //hides on load with images loaded
let pageCredit = ''; //does not hide, and will hide if empty
let theme = 'white'; //do up shadow for white theme {white, black}
let tagTitle = 'Girls';
let defaultTag = ''; //if empty will select first tag in list, follow surugaya-gallery

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let isFirefox = (/Firefox/i.test(navigator.userAgent));
let lowestHeight = 9999;
let highestHeight = 0;
let imgArray = [];

//--COMMON LOADER--//
//should add in here only if common; reconcile all differences via settings
function renderPage(pageName) {
	document.head.getElementsByTagName('title')[0].innerText = pageTitle;
	
	let body = document.body;
	body.id = pageName;
	let frame = document.createElement('div');
	//frame.id = pageName;

	let viewer = document.createElement('div');
	viewer.id = 'viewer';
	viewer.style.paddingTop = '0';
	viewer.style.display = 'none';
	viewer.addEventListener('click', closeViewer);
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);
	frame.appendChild(viewer);

	let title = document.createElement('h1');
	title.innerText = pageTitle;
	frame.appendChild(title);

	//navigation
	let links = ['bromide-gallery','amiiboCards-gallery','surugaya-gallery'];
	let navigation = document.createElement('div');
	navigation.style.textAlign = 'center';
	navigation.style.paddingBottom = '20px';
	//navigation.style.display = 'none';
	for(let link of links)
	{
		let newLink = document.createElement('a');
		//newLink.href = link;
		newLink.addEventListener('click', function() { loadPage(link); });
		if(link == links[0]) newLink.innerText = 'GALLERY';
		if(link == links[1]) newLink.innerText = 'amiibo Cards';
		if(link == links[2]) newLink.innerText = 'ギャラリー';
		navigation.appendChild(newLink);
	}
	frame.appendChild(navigation);

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
	imgGallery.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);
	frame.appendChild(imgGallery);

	let back = document.createElement('div');
	back.style.textAlign = 'center';
		let backLink = document.createElement('a');
		backLink.href = '../index.html';
		backLink.innerText = 'Back';
	back.appendChild(backLink);
	frame.appendChild(back);
	
	if(enableDarkMode)
	{
		let darkmodeDiv = document.createElement('div');
		darkmodeDiv.title = 'Toggle Dark Mode';
		darkmodeDiv.style.textAlign = 'center';
		let darkmode = document.createElement('i');
		darkmode.id = 'darkmode';
		darkmode.classList.add('material-icons');
		darkmode.style.cursor = 'pointer';
		darkmode.innerText = 'brightness_high';
		darkmode.addEventListener('click', toggleDarkMode);
		darkmodeDiv.appendChild(darkmode);
		frame.appendChild(darkmodeDiv);
	}
	
	body.innerHTML = '';
	body.appendChild(frame);
}

//--COMMON EVENTS--//
//on startup (temp)
window.onload = loadPage('bromide-gallery');
window.addEventListener('resize', function() { adjustViewerMargin(); });

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
	unloadCurrentStyle();
	loadStyle(pageName);
	unloadCurrentScripts();
	loadDataScript(pageName);
	renderPage(pageName);
	setupGallery();
}

//load CSS file based on URL
function loadStyle(url) {
	let css = document.createElement('link');
	css.id = url + '-css';
	css.href = url + '.css';
	css.type = 'text/css';
	css.rel = 'stylesheet'
	document.head.appendChild(css);
}

//unload css loaded
function unloadCurrentStyle() {
	//let currentPageName = window.location.pathname.split('/').pop().replace('.html','');
	let currentPageName = document.body.id + '-css';
	if(document.getElementById(currentPageName) != null)
		document.getElementById(currentPageName).parentNode.removeChild(document.getElementById(currentPageName));
}

function reloadDarkmodeStyle() {
	let url = 'darkmode';
	for(let darked of document.getElementsByClassName('darked'))
	{
		darked.classList.remove('darked');
	}
	if(document.getElementById(url + '-css') != null)
		document.getElementById(url + '-css').parentNode.removeChild(document.getElementById(url + '-css'));
	if(enableDarkMode)
	{
		let css = document.createElement('link');
		css.id = url + '-css';
		css.href = '../' + url + '.css';
		css.type = 'text/css';
		css.rel = 'stylesheet'
		document.head.appendChild(css);
	}
}

function loadProcessScript(pageName) {
	let processScript = document.createElement('script');
	processScript.id = pageName + '-temp'
	processScript.src = processScript.id + '.js';
	processScript.type = "text/javascript";
	processScript.charset = 'utf-8';
	processScript.onreadystatechange = function() { loadDataScript(pageName); };
    processScript.onload = function() { loadDataScript(pageName); };
	document.head.appendChild(processScript);
}

function loadDataScript(pageName) {
	let dataScript = document.createElement('script');
	dataScript.id = pageName + '-data'
	dataScript.src = dataScript.id + '.js';
	dataScript.type = "text/javascript";
	dataScript.charset = 'utf-8';
	dataScript.onreadystatechange = function() { 
		reloadDarkmodeStyle();
		renderPage(pageName);
		setupGallery(); 
	};
    dataScript.onload = function() { 
		reloadDarkmodeStyle();
		renderPage(pageName);
		setupGallery(); 
	};
	document.head.appendChild(dataScript);
}

function unloadCurrentScripts() {
	let currentPageName = document.body.id;
	let currentDataScript = currentPageName + '-data';
	let currentProcessScript = currentPageName + '-temp';
	if(document.getElementById(currentDataScript) != null)
		document.getElementById(currentDataScript).parentNode.removeChild(document.getElementById(currentDataScript));
	if(document.getElementById(currentProcessScript) != null)
		document.getElementById(currentProcessScript).parentNode.removeChild(document.getElementById(currentProcessScript));
}

function setupGallery() {
	renderGallery(imgArray);
	var labelArray = generateNameLabels(imgArray);
	generateTickboxFilter(labelArray);
	generateTickboxAction();
	renderGalleryScroll();
}

//generate profile category based on array
function renderGallery(array) {
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	if(isFirefox) profileCategoryHTML.classList.add('snap');
	for(let img of array)
	{
		if(img[0] == 0 || img[0] == 999) continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		if(enableShadows) profileBoxHTML.classList.add('shadowed');
		if(!enableShadows) profileBoxHTML.classList.add('unshadowed');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		imgHTML.classList.add(img[2]);
		imgHTML.setAttribute('alt', img[1]);
		imgHTML.setAttribute('src', spacerURL);
		imgHTML.title = img[4] == "" ? img[3] : img[4];
		profileBoxImgHTML.appendChild(imgHTML);
		profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
	}
	if(document.getElementById('imgGallery').childNodes.length > 0) document.getElementById('imgGallery').innerHTML = '';
	document.getElementById('imgGallery').appendChild(profileCategoryHTML);
	
	for(let image of document.getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
	}
	
	document.getElementById('loadedCount').innerText = 0;
	lowestHeight = 9999;
	highestHeight = 0;
	setTimeout(reloadImages,500);
	
	//add event listener when click on image
	for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}
}

function reloadImages() {
	let loadedImages = 0;
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.complete)
			document.getElementById('loadedCount').innerText = ++loadedImages;
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;
		}
		
		// if(window.innerWidth >= 1040)
		// {
			// if(image.height > highestHeight && image.height > 1) //resize to highest height
				// highestHeight = image.height;
			// else
				// image.style.height = '50vh';
		// }
		// else {
			// if(image.height < lowestHeight && image.height > 1) //resize to lowest height
				// lowestHeight = image.height;
			// else
				// image.height = lowestHeight;
		// }

	}
	if(loadedImages < imgArray.length-2) setTimeout(reloadImages,500);
	if(loadedImages >= imgArray.length-2) setTimeout(function () { document.getElementById('description').style.display = 'none'; }, 2000);
}

function generateNameLabels(imgArray) {
	let labelArray = new Array();
	//generate name labels
	for(let label of imgArray)
	{
		if(label[0] == 0 || label[0] == 999) continue;
		if(labelArray.indexOf(label[3]) > -1) continue;
		else labelArray.push(label[3]);
	}
	labelArray.sort(function (a, b) { 
		if (a.toLowerCase() < b.toLowerCase()) return -1;
		if (a.toLowerCase() > b.toLowerCase()) return 1;
		return 0;
	});
	return labelArray;
}

function generateTickboxFilter(labelArray) {
	//generate tickboxes
	for(let label of labelArray)
	{
		let labelHTML = document.createElement('LABEL');
		labelHTML.innerText = label;
		let inputHTML = document.createElement('input');
		inputHTML.type = 'checkbox';
		inputHTML.name = 'column' + label.replace(' ','');
		inputHTML.value = label;
		inputHTML.innerText = label;
		inputHTML.checked = true;
		labelHTML.insertBefore(inputHTML,labelHTML.childNodes[0]);
		document.getElementById('name').appendChild(labelHTML);
	}
}

function generateTickboxAction() {
	//add event listeners to tickboxes
	document.getElementById('SelectAll').addEventListener('click', function () {
		if(document.getElementById('SelectAll').checked == true)
		{
			for (let label of document.getElementById('name').getElementsByTagName('input'))
			{
				label.checked = true;
			}
		}
		else
		{
			for (let label of document.getElementById('name').getElementsByTagName('input'))
			{
				label.checked = false;
			}
		}
		renderFilter();
	});
	for (let tickbox of document.getElementById('filter').getElementsByTagName('label'))
	{
		tickbox.addEventListener('click', function() { renderFilter(undefined); });
		if(tickbox.innerText == 'Select All') continue;
		tickbox.addEventListener('contextmenu', function(e) { e.preventDefault(); renderFilter(this); });
	}
}

function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	
	let nameArray = new Array();
	if(element != undefined) //select all
	{
		for (let label of document.getElementById('name').getElementsByTagName('input'))
		{
			label.checked = false;
			if(element.innerText == label.parentElement.innerText) label.checked = true;
		}
	}
	for (let label of document.getElementById('name').getElementsByTagName('input'))
	{
		if(label.checked == true)
			nameArray.push(label.value);
	}
	
	let newArray = new Array();
	for(let img of imgArray)
	{
		if(nameArray.indexOf(img[3]) > -1 && orientationArray.indexOf(img[2]) > -1)
			newArray.push(img);
	}
	renderGallery(newArray);
}

function renderGalleryScroll() {
//allow scroll on desktop
	let mousewheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel"
	let scrollList = new Array();
	let time = new Date();
	document.getElementById("imgGallery").addEventListener(isFirefox ? "DOMMouseScroll" : "mousewheel", function(e) {
		e.preventDefault();
		//document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		//console.log(new Date() - time);
		time = new Date();
		document.getElementsByClassName('profile-category')[0].scrollLeft -= isFirefox ? -e.detail*100 : e.wheelDelta;
		
		if(new Date() - time < 500 && (e.wheelDelta > 100 || e.wheelDelta < -100)) //conditions to prevent immediate snap
		{
			setTimeout( function() { 
				//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
				document.getElementsByClassName('profile-category')[0].classList.add('snap');
			}, 500);
			if(!isFirefox)
				setTimeout( function() { 
					//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
					document.getElementsByClassName('profile-category')[0].classList.remove('snap');
				}, 600);
		}
	});
	
	document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
	});
}

function toggleDarkMode() {
	if(document.body.classList.contains('darked'))
		document.body.classList.remove('darked');
	else
		document.body.classList.add('darked');	
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

