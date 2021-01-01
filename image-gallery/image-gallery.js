//ADD LINKS TO FILENAMES HERE//
let links = ['bromide-gallery','amiiboCards-gallery','surugaya-gallery','profile-gallery']; 
let linkTitles = ['GALLERY','amiibo Cards','ギャラリー','Profiles']; 


//--DEFAULT SETTINGS--//
let enableViewer = true; //images smaller than screen will not resize up
let enableOrientation = true; //assume has values in orientation column
let enableSlideshow = true; //enable slideshow button
let enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
let enableShadows = true; //removes shadows and borders in images
let enableDarkMode = true; //no button to toggle, when load always white background
let enableCollapseFilterOnSelect = window.innerWidth <= 640; //right click any tag will collapse filter
let pageDescription = 'To add gallery:\n- Copy and fill in image-gallery-data, filename to end with \'-data.js\'\n- Add to links variable in image-gallery.js new filename\n- Tada!\n\n(Note: Loading speed dependent on size and number of images; To avoid slowness, set defaultTag)'; //hides on load with images loaded

//localization
let pageTitle = 'GALLERY'; //for tab, and top of page
let pageCredit = ''; //does not hide, and will hide if empty
let tagTitle = 'Girls';
let selectAllTag = 'Select All';
let defaultTag = 'Portrait'; //if empty or not in tags in array, will show all
let closeIconTitle = 'Close';
let collapseFilterIconTitle = 'Collapse Filters';
let expandFilterIconTitle = 'Expand Filters';
let orientationTitle = 'Orientation';
let portraitTitle = 'Portrait';
let landscapeTitle = 'Landscape';
let tagRightClickTitle = 'Right Click to Select This Only';
let loaderTextPrefix = 'Images Loaded: ';



//--VARIABLES--//
let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let isFirefox = (/Firefox/i.test(navigator.userAgent));
let lowestHeight = 9999;
let highestHeight = 0;
let imgArray = [];
let runSlideshow = null;
let descriptionClosed = false;

//--COMMON EVENTS--//
//on startup
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
window.onload = loadPage('surugaya-gallery');
window.addEventListener('resize',function () {
	if(window.innerHeight == windowHeight || window.innerWidth != windowWidth) renderFilter(undefined);
	else {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth
	}
	if(document.getElementById('filter').classList.contains('closed')) toggleFilter();
	closeViewer();
});
window.addEventListener('keydown', function(event) {
	if ([33,34,35,36].indexOf(event.keyCode) >= 0)
		event.preventDefault();
		
	if (event.keyCode === 33) //"PageUp" key
	{
		let gallery = document.getElementsByClassName("profile-category")[0];
		gallery.scrollTo(gallery.scrollLeft-window.innerWidth*.9,0);
		reSnap();
	}
	if (event.keyCode === 34) //"PageDown" key
	{
		let gallery = document.getElementsByClassName("profile-category")[0];
		gallery.scrollTo(gallery.scrollLeft+window.innerWidth*.9,0);
		reSnap();
	}
	if (event.keyCode === 35) //"End" key
	{
		document.getElementsByClassName("profile-box")[document.getElementsByClassName("profile-box").length-1].scrollIntoView();
	}
	if (event.keyCode === 36) //"Home" key
	{
		document.getElementsByClassName("profile-box")[0].scrollIntoView();
	}
});

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
	//viewer.addEventListener('click', closeViewer);
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);
	frame.appendChild(viewer);

	//navigation
	let navigation = document.createElement('div');
	navigation.id = 'navigation';
	navigation.style.textAlign = 'center';
	navigation.style.paddingBottom = '10px';
	navigation.style.lineHeight = '2';

	for(let link of links)
	{
		if(pageName.includes(link)) continue;
		let newLink = document.createElement('div');
		newLink.classList.add('navigation-item');
		newLink.classList.add('shadowed');
		newLink.addEventListener('click', function() { loadPage(link); });
		
		if(link == links[0] && !window.location.href.includes('//knneo.github.io')) newLink.innerText = 'GALLERY';
		if(link == links[1]) newLink.innerText = 'amiibo Cards';
		if(link == links[2]) newLink.innerText = 'ギャラリー';
		if(link == links[3]) newLink.innerText = 'Profiles';
		
		navigation.appendChild(newLink);
	}
	
	frame.appendChild(navigation);
	
	let title = document.createElement('h1');
	title.id = 'title';
	title.innerText = pageTitle;
	title.addEventListener('click', function() {
		loadPage(pageName);
	});
	frame.appendChild(title);
	
	let description = document.createElement('div');
	description.id = 'description';
	if(descriptionClosed) description.classList.add('closed');
		let descriptionCloser = document.createElement('i');
		descriptionCloser.classList.add('material-icons');
		descriptionCloser.style.float = 'right';
		descriptionCloser.style.padding = '0';
		descriptionCloser.title = closeIconTitle;
		descriptionCloser.innerText = 'close';
		descriptionCloser.addEventListener('click', function() {
			this.parentElement.classList.add('closed');
			descriptionClosed = true;
			localStorage.setItem("descriptionClosed", descriptionClosed);
		});
		description.appendChild(descriptionCloser);	
		let descriptionText = document.createElement('h5');
		descriptionText.innerText = pageDescription;
		description.appendChild(descriptionText);
	frame.appendChild(description);

	let options = document.createElement('div');
	options.id = 'options';	
	
		let loader = writeLoadedCount();
		options.appendChild(loader);
		
	frame.appendChild(options);
	
	let credit = document.createElement('h5');
	credit.id = 'credit';
	credit.innerText = pageCredit;
	frame.appendChild(credit);
	
	let toggler = document.createElement('div');
	toggler.id = 'toggle';
	toggler.style.textAlign = 'center';
	toggler.style.position = enableOrientation ? 'absolute' : 'inherit';
	let togglerButton = document.createElement('i');
	togglerButton.classList.add('material-icons');
	togglerButton.id = 'toggler';
	togglerButton.style.cursor = 'pointer';
	togglerButton.style.fontSize = '32px';
	togglerButton.title = collapseFilterIconTitle;
	togglerButton.innerText = 'blur_linear';
	togglerButton.addEventListener('click', function() { 
		let isClosed = document.getElementById('filter').classList.contains('closed');
		this.title = isClosed ? collapseFilterIconTitle : expandFilterIconTitle; 
		//this.innerText = isClosed ? 'maximize': 'blur_linear'; 
		if(enableOrientation)
			this.parentElement.style.position = this.parentElement.style.position == 'absolute' ? 'inherit' : 'absolute';
		toggleFilter();
	} );
	toggler.appendChild(togglerButton);
	frame.appendChild(toggler);
	
	let filter = document.createElement('div');
	filter.id = 'filter';
		let orientation = document.createElement('div');
		orientation.id = 'orientation';
		if(!enableOrientation) orientation.style.display = 'none';
		let rotationTitle = document.createElement('h4');
		rotationTitle.innerText = orientationTitle;
		orientation.appendChild(rotationTitle);
			let portrait = document.createElement('label');
			let portraitCheckbox = document.createElement('input');
			portraitCheckbox.type = 'checkbox';
			portraitCheckbox.name = 'columnPortrait';
			portraitCheckbox.value = 'portrait';
			portraitCheckbox.checked = true;
			portrait.appendChild(portraitCheckbox);
			let portraitText = document.createElement('span');
			portraitText.innerText = portraitTitle;
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
			landscapeText.innerText = landscapeTitle;
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
			selectAllCheckbox.checked = defaultTag.length == 0
			selectAll.appendChild(selectAllCheckbox);
			let selectAllText = document.createElement('span');
			selectAllText.innerText = selectAllTag;
			selectAll.appendChild(selectAllText);
			name.appendChild(selectAll);
		filter.appendChild(name);
	frame.appendChild(filter);

	let midline = document.createElement('hr');
	midline.id = 'midline';
	frame.appendChild(midline);
	
	let ssDiv = document.createElement('div');
	ssDiv.id = 'slideshow';
		let ssStartSpan = document.createElement('button');
		ssStartSpan.id = 'ssstart';
		ssStartSpan.type = 'button';
		ssStartSpan.style.display = enableSlideshow ? '' : 'none';
		ssStartSpan.innerText = 'Slideshow';
		ssStartSpan.addEventListener('click', startSlideshow);
		ssDiv.appendChild(ssStartSpan);
		let ssStopSpan = document.createElement('button');
		ssStopSpan.id = 'ssstop';
		ssStartSpan.type = 'button';
		ssStopSpan.style.display = 'none';
		ssStopSpan.innerText = 'Stop';
		ssStopSpan.addEventListener('click', stopSlideshow);
		ssDiv.appendChild(ssStopSpan);
		let inViewer = document.createElement('label');
		inViewer.style.display = localStorage.getItem("enableViewer") == "true" ? '' : 'none';
		inViewer.innerText = 'In Viewer';
			let inViewerCheckbox = document.createElement('input');
			inViewerCheckbox.id = 'inViewer';
			inViewerCheckbox.type = 'checkbox';
			inViewerCheckbox.name = 'inViewer';
		inViewer.insertBefore(inViewerCheckbox, inViewer.childNodes[0]);
		ssDiv.appendChild(inViewer);
		let fullscreen = document.createElement('label');
		fullscreen.style.display = localStorage.getItem("enableViewer") == "true" && enableFullscreenSlideshow ? '' : 'none';
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
	
	let settingsDiv = document.createElement('h3');
	settingsDiv.id = 'settings';
		
		if(enableDarkMode)
		{
			let darkmode = document.createElement('i');
			darkmode.id = 'darkmode';
			darkmode.title = 'Toggle Dark Mode';
			darkmode.classList.add('material-icons');
			darkmode.innerText = 'brightness_high';
			darkmode.addEventListener('click', toggleDarkMode);
			settingsDiv.appendChild(darkmode);
		}
		
		if(enableViewer)
		{
			let viewing = document.createElement('i');
			viewing.id = 'enable-viewer';
			viewing.title = 'Toggle Viewer';
			viewing.classList.add('material-icons');
			viewing.innerText = localStorage.getItem("enableViewer") == "true" ? 'view_carousel' : 'view_column';
			viewing.addEventListener('click', function() {
				localStorage.setItem("enableViewer", localStorage.getItem("enableViewer") == "true" ? false : true);
				loadPage(document.body.id);
			});
			settingsDiv.appendChild(viewing);
		}
		
		if(enableShadows)
		{
			let shadows = document.createElement('i');
			shadows.id = 'enable-shadows';
			shadows.title = 'Toggle Shadows';
			shadows.classList.add('material-icons');
			shadows.style.transform = 'scaleX(-1)';
			shadows.innerText = localStorage.getItem("enableShadows") == "true" ? 'filter' : 'crop_original';
			shadows.addEventListener('click', function() {
				localStorage.setItem("enableShadows", localStorage.getItem("enableShadows") == "true" ? false : true);
				loadPage(document.body.id);
			});
			settingsDiv.appendChild(shadows);
		}
	
	frame.appendChild(settingsDiv);
	
	let back = document.createElement('h4');
	back.id = 'footer';
		let backLink = document.createElement('a');
		backLink.href = '../index.html';
		backLink.innerText = 'Back';
	back.appendChild(backLink);
	frame.appendChild(back);
	
	body.innerHTML = '';
	body.appendChild(frame);
}

//viewer
let imageNo = 0;
let linkedImgList = [];
function createLinkedList() {
	linkedImgList = [];
	for(let img of document.getElementsByTagName('img'))
	{
		linkedImgList.push(img);
	}
}

function updateImageNo(image) {
	imageNo = 0;
	for(let img of linkedImgList)
	{
		if(img.src == image.src)
		{
			return imageNo;
		}
		imageNo++;
	}
	return 0;
}

function openViewer(image) {
	if(localStorage.getItem("enableViewer") != "true") return;
	document.getElementById('viewer').style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {	
	let imgNo = updateImageNo(image);
	
	let viewer = document.getElementById('viewer');
	if(viewer.style.display != 'block') viewer.style.display = 'block';
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
	img.src = thumbnail.src;
	img.title = thumbnail.title;
	if(window.innerHeight > window.innerWidth && img.getBoundingClientRect().width >= window.innerWidth)
		img.style.width = 'inherit'; //portrait
	if(window.innerHeight <= window.innerWidth && img.getBoundingClientRect().height >= window.innerHeight)
		img.style.height = 'inherit'; //landscape
	img.style.maxHeight = '100%';
	img.style.maxWidth = '100%';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.style.paddingTop = '0';
	if(imgNo-1 >= 0) viewer.appendChild(viewerPrev);
	if(imgNo+1 < linkedImgList.length) viewer.appendChild(viewerNext);
	viewer.appendChild(img);
	
	if(imgNo-1 >= 0)
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo-1]);
			return false;
		}, false);
	if(imgNo+1 < linkedImgList.length)
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo+1]);
			return false;
		}, false);
		
	img.addEventListener('click', closeViewer);
	
	adjustViewerMargin();
}

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.getElementsByTagName('img')[0];
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	viewer.style.display = 'none';
	viewer.innerHTML = '';
}

//--FUNCTIONS--//
function loadPage(pageName) {
	loadSettings();
	if(runSlideshow != null) stopSlideshow();
	//unloadCurrentStyle();
	//loadStyle(pageName);
	unloadCurrentScripts();
	loadDataScript(pageName); //will trigger rest of setup
}

function loadSettings() {
	descriptionClosed = localStorage.getItem("descriptionClosed") == "true";
	if(descriptionClosed == null) localStorage.setItem("descriptionClosed", false);
	enableViewer = localStorage.getItem("enableViewer") == "true";
	if(enableViewer == null) localStorage.setItem("enableViewer", enableViewer);
	enableShadows = localStorage.getItem("enableShadows") == "true";
	if(enableShadows == null) localStorage.setItem("enableShadows", enableShadows);
}

function calculateGalleryHeight() {
	let baseItems = ['navigation','title','credit','filter','midline','slideshow','settings','footer'];
	let result = 0;
	let filterHeight = 0;
	//console.log(window.innerHeight);
	for(let item of baseItems) {
		//console.log(item, document.getElementById(item).getBoundingClientRect().height);
		result += document.getElementById(item).getBoundingClientRect().height;
		if(item == 'filter') filterHeight = document.getElementById(item).getBoundingClientRect().height;
	}
	return window.innerHeight - result < 200 ? window.innerHeight - result - 100 + filterHeight : window.innerHeight - result - 100;
}

function loadData(pageName) {
	reloadDarkmodeStyle();
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
	let css = document.createElement('link');
	css.id = url + '-css';
	css.href = '../' + url + '.css';
	css.type = 'text/css';
	css.rel = 'stylesheet'
	document.head.appendChild(css);
	
	//if dark mode is disabled, defaults to light
	if(!enableDarkMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	{
		toggleDarkMode();
	}
}

function loadDataScript(pageName) {
	let dataScript = document.createElement('script');
	dataScript.id = pageName + '-data'
	dataScript.src = dataScript.id + '.js';
	dataScript.type = "text/javascript";
	dataScript.charset = 'utf-8';
	dataScript.onreadystatechange = function() { loadData(pageName); };
    dataScript.onload = function() { loadData(pageName); };
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
	var labelArray = generateNameLabels(imgArray);
	generateTickboxFilter(labelArray);
	generateTickboxAction();
	renderGalleryScroll();
	renderFilter(undefined);
	//renderGallery(imgArray);
}

//generate profile category based on array
function renderGallery(array) {
	//disable relevant elements
	document.getElementById('options').classList.remove('closed');
	document.getElementById('ssstart').setAttribute('disabled','');
	document.getElementById('inViewer').setAttribute('disabled','');
	document.getElementById('isFullscreen').setAttribute('disabled','');
	
	let totalCount = 0;
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	if(isFirefox) profileCategoryHTML.classList.add('snap');
	for(let img of array)
	{
		if(img[0] == 0 || img[0] == 999) continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		if(enableShadows && localStorage.getItem("enableShadows") == "true") profileBoxHTML.classList.add('shadowed');
		else if(localStorage.getItem("enableShadows") != "true") profileBoxHTML.classList.add('unshadowed');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		imgHTML.id = img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg','');
		imgHTML.classList.add(img[2]);
		imgHTML.setAttribute('alt', img[1]);
		imgHTML.setAttribute('src', spacerURL);
		imgHTML.title = img[4] == "" ? img[3] : img[4];
		profileBoxImgHTML.appendChild(imgHTML);
		profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
		totalCount++;
	}
	if(document.getElementById('imgGallery').childNodes.length > 0) document.getElementById('imgGallery').innerHTML = '';
	document.getElementById('imgGallery').appendChild(profileCategoryHTML);
	
	for(let image of document.getElementById('imgGallery').getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
		image.addEventListener('click', function() {
			this.scrollIntoView({
				behavior: "smooth",
				inline: "center"
			});
		});
		image.addEventListener('contextmenu', function() {
			this.scrollIntoView({
				behavior: "smooth",
				inline: "center"
			});
		});
	}
	
	document.getElementById('loadedCount').innerText = 0;
	// lowestHeight = 9999;
	// highestHeight = 0;
	setTimeout( function() { reloadImages(array); }, 500);
	
	//add event listener when click on image
	if(localStorage.getItem("enableViewer") == "true")
	{
		for (let i = 0 ; i < document.getElementById('imgGallery').getElementsByTagName('img').length ; i++)
		{
			document.getElementById('imgGallery').getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementById('imgGallery').getElementsByTagName('img')[i]); });
		}
	}
	
	//update linked list for viewer
	createLinkedList();
	console.log(totalCount + ' rows detected');
}

function reloadImages(array) {
	let loadedImages = 0;
	for(var img of array)
	{
		let image = document.getElementById(img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg',''));
		if(image == null) continue;
		if(image.complete)
		{
			document.getElementById('loadedCount').innerText = ++loadedImages;
			if(image.width >= image.height && !image.classList.contains('landscape')) //if landscape
			{
				image.classList.remove('portrait');
				image.classList.add('landscape');
				img[2] = 'landscape';
			}
			
		}
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;	
		}
		
		//benchmarking for resizeImageHeights()
		if(window.innerWidth >= 640 && image.height > highestHeight && image.height > 1)
			highestHeight = image.height;
		else if (image.height < lowestHeight && image.height > 1)
			lowestHeight = image.height;
	}
	recoverOrientationIfEmpty(array);
	resizeImageHeights();
	if(loadedImages < array.length - 1) setTimeout( function() { reloadImages(array); },500);
	if(loadedImages >= array.length - 1) 
	{
		resizeImageHeights();
		document.getElementById('ssstart').removeAttribute('disabled');
		document.getElementById('inViewer').removeAttribute('disabled');
		document.getElementById('isFullscreen').removeAttribute('disabled');
		setTimeout(function () { document.getElementById('options').classList.add('closed') }, 1000);
	}
}

function resizeImageHeights() {
	let galleryHeight = calculateGalleryHeight();
	for(var image of document.getElementById('imgGallery').getElementsByTagName("img"))
	{
		if(window.innerWidth >= 640 && image.height < highestHeight && image.height > 1)//resize to highest height
			image.style.height = galleryHeight + 'px'; //fallback to default if height too low
		else if(image.height > lowestHeight && image.height > 1) //resize to lowest height
			image.height = lowestHeight; //if small screen hit css maxHeight
	}
}


function generateNameLabels(imgArray) {
	let labelArray = new Array();
	//generate name labels
	for(let label of imgArray)
	{
		if(label[0] == 0 || label[0] == 999) continue;
		let labels = label[3].split('|');
		for(let l of labels)
		{
			if(labelArray.indexOf(l) > -1) continue;
			else labelArray.push(l);
		}
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
		labelHTML.title = tagRightClickTitle;
		labelHTML.innerText = label;
		let inputHTML = document.createElement('input');
		inputHTML.type = 'checkbox';
		inputHTML.name = 'column' + label.replace(' ','');
		inputHTML.value = label;
		inputHTML.innerText = label;
		inputHTML.checked = defaultTag.length > 0 ? label == defaultTag : true;
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
		if(tickbox.innerText == selectAllTag) continue;
		if(tickbox.parentElement.id == 'orientation') continue;
		tickbox.addEventListener('contextmenu', function(e) { 
			e.preventDefault();
			renderFilter(this);
			if(enableCollapseFilterOnSelect) document.getElementById('toggler').click();
		});
	}
}

function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true || element != null)
			orientationArray.push(label.value);
		if(element != null)
			label.checked = true;
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
		let labels = img[3].split('|');
		for(let l of labels)
		{
			if(nameArray.indexOf(l) > -1 && orientationArray.indexOf(img[2]) > -1 
			&& newArray.filter( function(n) { return n[1] == img[1]; }).length == 0)
				newArray.push(img);
		}
	}
	renderGallery(newArray);
}

function recoverOrientationIfEmpty(array) {
	//to write back orientation if found no values
	//find in array, if at least one empty, update
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	
	let count = 0;
	for(let img of array) {
		if(orientationArray.indexOf(img[2]) == -1) count++;
		if(count > 0) break;
	}
	
	//update
	for(let img of array) {
		let image = document.getElementById(img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg',''));
		if(image == null) continue;
		img[2] = image.width >= image.height ? 'landscape' : 'portrait';
	}
}

function renderGalleryScroll() {
	//allow scroll on desktop
	let mousewheelEvent = isFirefox ? "DOMMouseScroll" : "mousewheel"
	let scrollList = new Array();
	let time = new Date();
	document.getElementById("imgGallery").addEventListener(mousewheelEvent, function(e) {
		e.preventDefault();
		//document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		//console.log(new Date() - time);
		time = new Date();
		let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta
		document.getElementsByClassName('profile-category')[0].scrollLeft -= scrollDelta;
		
		if(new Date() - time < 400 && ((scrollDelta/2) > 30 || (scrollDelta/2) < -30)) //conditions to prevent immediate snap
		{
			reSnap();
		}
	});
	
	document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
	});
}

function reSnap() {
	setTimeout( function() { 
		//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
			document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		}, 100);
	}, 400);
}

function toggleDarkMode() {
	if(document.getElementsByTagName('html')[0].classList.contains('darked'))
		document.getElementsByTagName('html')[0].classList.remove('darked');
	else
		document.getElementsByTagName('html')[0].classList.add('darked');	
}

function writeLoadedCount(number) {
	let loader = document.createElement('h5');
	let loaderPrefix = document.createElement('span');
	loaderPrefix.innerText = '[' + loaderTextPrefix;
	loader.appendChild(loaderPrefix);
	let loaderSpan = document.createElement('span');
	loaderSpan.id = 'loadedCount';
	loaderSpan.innerText = number ?? 0;
	loader.appendChild(loaderSpan);
	let loaderSuffix = document.createElement('span');
	loaderSuffix.innerText = ']';
	loader.appendChild(loaderSuffix);
	return loader;
}

//start slideshow
function startSlideshow() {
	//document.getElementById('description').classList.add('closed');
	switchButtons();
	setTimeout(openFullscreen, 200);
	if(document.getElementById('inViewer').checked)
		setTimeout(function() {
			openViewer(document.getElementById('imgGallery').getElementsByTagName('img')[randomImg()]);
		}, 500);
	else
		document.getElementById('imgGallery').getElementsByTagName('img')[randomImg()].scrollIntoView();
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
  } else if (elem.mozRequestFullScreen) { //Firefox 
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { //Chrome, Safari, Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { //IE,Edge
    elem.msRequestFullscreen();
  }
}

function closeFullscreen() {
let elem = document.documentElement;
if(document.fullscreenElement == null) return;
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) { //Firefox
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) { //Chrome, Safari, Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { //IE, Edge
    document.msExitFullscreen();
  }
}

function toggleFilter() {
	if(document.getElementById('filter').classList.contains('closed')) document.getElementById('filter').classList.remove('closed');
	else document.getElementById('filter').classList.add('closed');
	if(document.getElementById('midline').classList.contains('closed')) document.getElementById('midline').classList.remove('closed');
	else document.getElementById('midline').classList.add('closed');
}

function checkDuplicates() {
	//based on url
	let uniqueArray = new Array();
	for(let image of imgArray)
	{
		if(uniqueArray.indexOf(image[1]) < 0)
			uniqueArray.push(image[1]);
		else
			console.log('Duplicate URL found: ', image[1]);
	}
}

//settings