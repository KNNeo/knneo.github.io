//ADD LINKS TO FILENAMES HERE, IN ORDER//
// id: file ending with '-data.js'
// title: name to put on navigation bar
// isLocal: if gallery items point to local directory, can be hidden if online domain
const galleries = [
	{ id: 'bromide-gallery', title: 'GALLERY', isLocal: true },
	{ id: 'surugaya-gallery', title: 'ギャラリー' },
	{ id: 'amiiboCards-gallery', title: 'amiibo Cards' },
	{ id: 'profile-gallery', title: 'Profiles' },
	{ id: 'alterna-gallery', title: 'オルタナ' },
];


//--DEFAULT SETTINGS--//
let enableViewer = false; //images smaller than screen will not resize up
let enableOrientation = true; //assume has values in orientation column
let enableSlideshow = true; //enable slideshow button
let enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
let enableShadows = true; //removes shadows and borders in images
let enableDarkMode = true; //no button to toggle, when load always white background
let enableCollapseFilterOnSelect = window.innerWidth <= 640; //right click any tag will collapse filter
let defaultDirectory = null;
let pageDescription = 'To add gallery:\n- Copy and fill in image-gallery-data, filename to end with \'-data.js\'\n- Add to links variable in image-gallery.js new filename\n- Tada!\n\n(Note: Loading speed dependent on size and number of images; To avoid slowness, set defaultTag)'; //hides on load with images loaded

//localization
let pageTitle = 'GALLERY'; //for tab, and top of page
let pageCredit = ''; //does not hide, and will hide if empty
let tagTitle = 'Girls';
let selectAllTag = 'Select All';
let defaultTag = ''; //if empty or not in tags in array, will show all
let closeIconTitle = 'Close';
let collapseFilterIconTitle = 'Collapse Filters';
let expandFilterIconTitle = 'Expand Filters';
let orientationTitle = 'Orientation';
let portraitTitle = 'Portrait';
let landscapeTitle = 'Landscape';
let tagRightClickTitle = 'Right Click to Select This Only';
let loaderTextPrefix = 'Images Loaded: ';
let excludedPopupText = 'Image will be excluded. Proceed for all?';



//--VARIABLES--//
let body = document.querySelector('#contents');
let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let isFirefox = (/Firefox/i.test(navigator.userAgent));
let isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches);
};
let imgArray = [];
let runSlideshow = null;
let descriptionClosed = false;
let settingsLoaded = false;
let slideshowInterval = 3; //in seconds

//--COMMON EVENTS--//
//on startup
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
window.addEventListener('load', loadPage('surugaya-gallery'));
window.addEventListener('resize',function () {
	if(window.innerHeight == windowHeight || window.innerWidth != windowWidth) renderFilter(undefined);
	else {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth
	}
	if(document.querySelector('#filter').classList.contains('closed')) toggleFilter();
	// closeViewer();
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
	
	body.id = pageName;
	let frame = document.createElement('div');
	//frame.id = pageName;

	let viewer = document.createElement('div');
	viewer.classList.add('viewer');
	//viewer.addEventListener('click', closeViewer);
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);		
	viewer.addEventListener('keyup', function(e) {
		if (event.keyCode === 37 && document.querySelector('.viewer-prev') != null) {
			document.querySelector('.viewer-prev').click();
		}
		if (event.keyCode === 39 && document.querySelector('.viewer-next') != null) {
			document.querySelector('.viewer-next').click();
		}
		return false;
	}, false);
	
	frame.appendChild(viewer);

	//navigation
	let navigation = document.createElement('div');
	navigation.id = 'navigation';
	navigation.style.textAlign = 'center';
	navigation.style.paddingBottom = '10px';
	navigation.style.lineHeight = '2';

	for(let link of galleries)
	{
		if(link.isLocal && !window.location.href.startsWith('file://')) continue;
		
		if(pageName.includes(link.id)) continue;
		let newLink = document.createElement('a');
		// newLink.href = 'javascript:void(0);';
		newLink.classList.add('navigation-item');
		newLink.classList.add('shadowed');
		newLink.addEventListener('click', function() { loadPage(link.id); });
		newLink.innerText = link.title;
		
		navigation.appendChild(newLink);
	}
	
	frame.appendChild(navigation);
	
	let title = document.createElement('h1');
	title.id = 'title';
	title.innerText = pageTitle;
	title.addEventListener('click', function() {
		setLocalSetting('excludedImages', '[]');
		deleteLocalSetting('excludedPopupDecision');
		loadPage(pageName);
	});
	frame.appendChild(title);
	
	let description = document.createElement('div');
	description.classList.add('description');
	descriptionClosed = localStorage.getItem("descriptionClosed") == "true";
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
	options.classList.add('options');
	
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
		let isClosed = document.querySelector('#filter').classList.contains('closed');
		this.title = isClosed ? collapseFilterIconTitle : expandFilterIconTitle; 
		//this.innerText = isClosed ? 'maximize': 'blur_linear'; 
		if(enableOrientation)
			this.parentElement.style.position = this.parentElement.style.position == 'absolute' ? 'inherit' : 'absolute';
		toggleFilter();
		resizeImageHeights();
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
		ssStartSpan.id = 'ss-start';
		ssStartSpan.type = 'button';
		ssStartSpan.style.display = enableSlideshow ? '' : 'none';
		ssStartSpan.innerText = 'Slideshow';
		ssStartSpan.addEventListener('click', startSlideshow);
		ssDiv.appendChild(ssStartSpan);
		let ssStopSpan = document.createElement('button');
		ssStopSpan.id = 'ss-stop';
		ssStartSpan.type = 'button';
		ssStopSpan.style.display = 'none';
		ssStopSpan.innerText = 'Stop';
		ssStopSpan.addEventListener('click', stopSlideshow);
		ssDiv.appendChild(ssStopSpan);
		let inViewer = document.createElement('label');
		inViewer.style.display = getLocalSetting("enableViewer") == "true" ? '' : 'none';
		inViewer.innerText = 'In Viewer';
			let inViewerCheckbox = document.createElement('input');
			inViewerCheckbox.id = 'ss-viewer';
			inViewerCheckbox.type = 'checkbox';
			inViewerCheckbox.name = 'inViewer';
		inViewer.insertBefore(inViewerCheckbox, inViewer.childNodes[0]);
		ssDiv.appendChild(inViewer);
		let fullscreen = document.createElement('label');
		fullscreen.style.display = getLocalSetting("enableViewer") == "true" && enableFullscreenSlideshow ? '' : 'none';
		fullscreen.innerText = 'Fullscreen';
			let fullscreenCheckbox = document.createElement('input');
			fullscreenCheckbox.id = 'ss-fullscreen';
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
	
	let settingsDiv = document.querySelector('.settings');
		
		let darkmode = document.querySelector('.darkmode');
		if(darkmode == null) {
			darkmode = document.createElement('i');
			darkmode.classList.add('darkmode');
			darkmode.classList.add('material-icons');
			darkmode.title = 'Toggle Dark Mode';
			darkmode.innerText = 'brightness_high';
			darkmode.addEventListener('click', toggleDarkMode);
			settingsDiv.appendChild(darkmode);
		}
		if(darkmode != null) {
			darkmode.style.display = '';
			if(getLocalSetting("enableDarkMode") == "true")
			{
				document.getElementsByTagName('html')[0].classList.add('darked');
				
				let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
				let themeColor = theme[0];
				themeColor.content = 'black';
			}
		}
		if(!enableDarkMode && darkmode != null) {
			darkmode.style.display = 'none';
		}
		// if(!settingsLoaded && darkmode != null)
			// darkmode.addEventListener('click', toggleDarkMode);
		
		let viewing = document.querySelector('.enable-viewer');
		if(viewing == null) {
			viewing = document.createElement('i');
			viewing.classList.add('enable-viewer');
			viewing.classList.add('material-icons');
			viewing.title = 'Toggle Viewer';
			viewing.innerText = getLocalSetting("enableViewer") == "true" ? 'view_carousel' : 'view_column';
			viewing.addEventListener('click', function() {
				setLocalSetting("enableViewer", getLocalSetting("enableViewer") == "true" ? false : true);
				viewing.innerText = getLocalSetting("enableViewer") == "true" ? 'view_carousel' : 'view_column';
				document.querySelector('#ss-viewer').parentElement.style.display = getLocalSetting("enableViewer") == "true" ? '' : 'none';
				document.querySelector('#ss-fullscreen').parentElement.style.display = getLocalSetting("enableViewer") == "true" && enableFullscreenSlideshow ? '' : 'none';
				// loadPage(body.id);
				// for(let image of document.querySelectorAll('#imgGallery img'))
				// {
					// if(getLocalSetting("enableViewer") == "true")
						// image.parentElement.parentElement.classList.add('shadowed');
					// else
						// image.parentElement.parentElement.classList.remove('shadowed');
				// }
			});
			settingsDiv.appendChild(viewing);
		}
		if(viewing != null) {
			viewing.style.display = '';
			viewing.innerText = getLocalSetting("enableViewer") == "true" ? 'view_carousel' : 'view_column';
		}
		if(!enableViewer && viewing != null) {
			viewing.style.display = 'none';
		}
		// if(!settingsLoaded && viewing != null)
			// viewing.addEventListener('click', function() {
				// setLocalSetting("enableViewer", getLocalSetting("enableViewer") == "true" ? false : true);
				// loadPage(body.id);
			// });
		
		let shadows = document.querySelector('.enable-shadows');
		if(shadows == null) {
			shadows = document.createElement('i');
			shadows.classList.add('enable-shadows');
			shadows.classList.add('material-icons');
			shadows.title = 'Toggle Shadows';
			shadows.style.transform = 'scaleX(-1)';
			shadows.innerText = getLocalSetting("enableShadows") == "true" ? 'filter' : 'crop_original';
			shadows.addEventListener('click', function() {
				setLocalSetting("enableShadows", getLocalSetting("enableShadows") == "true" ? false : true);
				shadows.innerText = getLocalSetting("enableShadows") == "true" ? 'filter' : 'crop_original';
				// loadPage(body.id);
				for(let box of document.querySelectorAll('.profile-box'))
				{
					box.classList.remove('shadowed');
					box.classList.remove('unshadowed');
					if(getLocalSetting("enableShadows") == "true")
						box.classList.add('shadowed');
					else
						box.classList.add('unshadowed');
				}
			});
			settingsDiv.appendChild(shadows);
		}
		if(shadows != null) {
			shadows.style.display = '';
			shadows.innerText = getLocalSetting("enableShadows") == "true" ? 'filter' : 'crop_original';
		}
		if(!enableShadows && shadows != null) {
			shadows.style.display = 'none';
			// if(getLocalSetting("enableShadows") == "true") {
				// setLocalSetting("enableShadows", false);
				// loadPage(body.id);
			// }
		}
		// if(!settingsLoaded && shadows != null)
			// shadows.addEventListener('click', function() {
				// setLocalSetting("enableShadows", getLocalSetting("enableShadows") == "true" ? false : true);
				// loadPage(body.id);
			// });
	
	settingsLoaded = true;
	// frame.appendChild(settingsDiv);
	
	let back = document.querySelector('.back');
	if(back == null) {
		let spacer = document.createElement('div');
		spacer.style.height = '15px';
		settingsDiv.appendChild(spacer);
	
		let back = document.createElement('a');
		back.classList.add('back');
		back.href = '../index.html';
		back.innerText = 'Back';
		settingsDiv.appendChild(back);
	}	
	
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
	if(getLocalSetting("enableViewer") != "true") return;
	document.querySelector('.viewer').style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {	
	let imgNo = updateImageNo(image);
	
	let viewer = document.querySelector('.viewer');
	viewer.tabIndex = 999;
	if(viewer.style.display != 'block') viewer.style.display = 'block';
	let viewerPrev = document.createElement('a');
	viewerPrev.classList.add('viewer-prev');
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('a');
	viewerNext.classList.add('viewer-next');
	viewerNext.classList.add('viewer-nav');
	let thumbnail = image.cloneNode(true);
	let linkable = document.createElement('a');
	linkable.tabIndex = 1000;
	// linkable.href = 'javascript:void(0);';
	linkable.style.cursor = 'pointer';
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = processImageSourceForViewer(thumbnail.src);
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
	linkable.appendChild(img);
	viewer.appendChild(linkable);
	viewer.focus();
	
	if(imgNo-1 >= 0) {
		document.querySelector('.viewer-prev').addEventListener('click', function(e) {
			if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo-1]);
			linkedImgList[imgNo-1].scrollIntoView({ inline: 'center' });
			return false;
		}, false);
	}
	if(imgNo+1 < linkedImgList.length) {
		document.querySelector('.viewer-next').addEventListener('click', function(e) {
			if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo+1]);
			linkedImgList[imgNo+1].scrollIntoView({ inline: 'center' });
			return false;
		}, false);
	}
	linkable.addEventListener('click', closeViewer);
	
	adjustViewerMargin();
	
	setSessionSetting('focused', image.id);
}

function processImageSourceForViewer(url) {
	if(url.includes('pbs.twimg.com')) {
		return url.replace('small','large');
	}
	if(url.includes('obs.line-scdn.net')) {
		return url.replace('/small','');
	}
	
	return url;
}

function adjustViewerMargin() {
	let viewer = document.querySelector('.viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.getElementsByTagName('img')[0];
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.querySelector('.viewer');
	viewer.style.display = 'none';
	viewer.innerHTML = '';
	stopSlideshow();
}

//--FUNCTIONS--//
function loadPage(pageName) {
	if(runSlideshow != null) stopSlideshow();
	//unloadCurrentStyle();
	//loadStyle(pageName);
	unloadCurrentScripts();
	loadDataScript(pageName); //will trigger rest of setup
	// loadSettings();
}

function loadSettings() {
	descriptionClosed = getLocalSetting("descriptionClosed") == "true";
	if(descriptionClosed == null) setLocalSetting("descriptionClosed", false);
	
	if(!enableDarkMode) setLocalSetting("enableDarkMode", enableDarkMode);
	else {
		enableDarkMode = getLocalSetting("enableDarkMode") == "true";
		if(enableDarkMode == null) setLocalSetting("enableDarkMode", enableDarkMode);		
	}
	
	if(!enableViewer) setLocalSetting("enableViewer", enableViewer);
	else {
		enableViewer = getLocalSetting("enableViewer") == "true";
		if(enableViewer == null) setLocalSetting("enableViewer", enableViewer);		
	}
	
	if(!enableShadows) setLocalSetting("enableShadows", enableShadows);
	else {
		enableShadows = getLocalSetting("enableShadows") == "true";
		if(enableShadows == null) setLocalSetting("enableShadows", enableShadows);
	}
}

function calculateGalleryHeight() {
	let baseItems = ['navigation','title','credit','toggle','filter','midline','slideshow','settings'];//,'footer'];
	let result = 0;
	let filterHeight = 0;
	for(let item of baseItems) {
		// console.log(item, document.getElementById(item).getBoundingClientRect().height);
		// if(item == 'filter') filterHeight = document.getElementById(item).getBoundingClientRect().height;
		if(item == 'filter')
			filterHeight = document.getElementById(item).getBoundingClientRect().height;
		else if(item != 'toggle')
			result += document.getElementById(item).getBoundingClientRect().height;
		else if(document.getElementById(item).style.position != 'absolute')
			result += document.getElementById(item).getBoundingClientRect().height;
		// console.log(result);
	}
	// console.log(window.innerHeight, result);
	return window.innerHeight - result - (filterHeight > 0 ? 105 : 90) - filterHeight;
	// return window.innerHeight - result < 200 ? window.innerHeight - result - 150 + filterHeight : window.innerHeight - result - 150;
}

function loadData(pageName) {
	for(let img of imgArray) {
		if(defaultDirectory) img[1] = img[1].replace('{domain}', defaultDirectory);
		if(img[2] == null || img[2].length < 1) img[2] = 'portrait';
	}
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
	let currentPageName = body.id + '-css';
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
	// if(!enableDarkMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	// {
		// toggleDarkMode();
	// }
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
	let currentPageName = body.id;
	let currentDataScript = currentPageName + '-data';
	let currentProcessScript = currentPageName + '-temp';
	if(document.getElementById(currentDataScript) != null)
		document.getElementById(currentDataScript).parentNode.removeChild(document.getElementById(currentDataScript));
	if(document.getElementById(currentProcessScript) != null)
		document.getElementById(currentProcessScript).parentNode.removeChild(document.getElementById(currentProcessScript));
}

function setupGallery() {
	var labelArray = generateNameLabels(imgArray);
	var noneSelected = generateTickboxFilter(labelArray);
	generateTickboxAction(noneSelected);
	renderGalleryScroll();
	renderFilter(undefined);
	//renderGallery(imgArray);
}

//generate profile category based on array
function renderGallery(array) {
	//disable relevant elements
	document.querySelector('#options').classList.remove('closed');
	document.querySelector('#ss-start').setAttribute('disabled','');
	document.querySelector('#ss-viewer').setAttribute('disabled','');
	document.querySelector('#ss-fullscreen').setAttribute('disabled','');
	
	let totalCount = 0;
	let profileCategoryHTML = document.createElement('div');
	profileCategoryHTML.classList.add('profile-category');
	// if(isFirefox) profileCategoryHTML.classList.add('snap');
	for(let img of array)
	{
		if(img[0] == 0 || img[0] == 999) continue;
		let profileBoxHTML = document.createElement('div');
		profileBoxHTML.classList.add('profile-box');
		if(enableShadows && getLocalSetting("enableShadows") == "true") profileBoxHTML.classList.add('shadowed');
		else if(getLocalSetting("enableShadows") != "true") profileBoxHTML.classList.add('unshadowed');
			let profileBoxImgHTML = document.createElement('div');
			profileBoxImgHTML.classList.add('profile-box-img');
				let imgWrapHTML = document.createElement('a');
				// imgWrapHTML.href = 'javascript:void(0);';
				imgWrapHTML.style.cursor = 'pointer';
					let imgHTML = document.createElement('img');
					imgHTML.id = img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg','');
					imgHTML.classList.add(img[2]);
					imgHTML.setAttribute('alt', img[1]);
					imgHTML.setAttribute('src', spacerURL);
					imgHTML.title = img[4] == "" ? img[3] : img[4];
					imgHTML.addEventListener('click', function() { setSessionSetting('focused', this.id); });
					imgWrapHTML.appendChild(imgHTML);
				profileBoxImgHTML.appendChild(imgWrapHTML);
			profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
		totalCount++;
	}
	if(document.querySelector('#imgGallery').childNodes.length > 0) document.querySelector('#imgGallery').innerHTML = '';
	document.querySelector('#imgGallery').appendChild(profileCategoryHTML);
	
	let excludes = [];
	if(getLocalSetting('excludedImages') != null) excludes = JSON.parse(getLocalSetting('excludedImages'));
	for(let image of document.querySelector('#imgGallery').getElementsByTagName('img'))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
		image.parentElement.addEventListener('focus', function() {
			// if(getLocalSetting("enableViewer") != "true")
				this.scrollIntoView({
					behavior: "smooth",
					inline: "center"
				});
		});
		image.parentElement.addEventListener('click', function() {
			if(getLocalSetting("enableViewer") == "true")
				openViewer(image);
			this.scrollIntoView({
				behavior: "smooth",
				inline: "center"
			});
		});
		// image.addEventListener('contextmenu', excludeSelectedImage);
		image.addEventListener('error', function() {
			image.parentElement.parentElement.parentElement.style.display = 'none';
			image.classList.add('failed');
		});
		
		if(excludes.includes(image.id)) excludeImage(image);
	}
	
	document.querySelector('.loader-count').innerText = 0;
	// window['min-height'] = 9999;
	// window['max-height'] = 0;
	setTimeout( function() { reloadImages(array); }, 500);
	
	//update linked list for viewer
	createLinkedList();
	console.log(totalCount + ' rows detected');
}

function excludeSelectedImage() {
	if(this.tagName.toLowerCase() != 'img') return;
	if(getLocalSetting('excludedPopupDecision') == null)
		setLocalSetting('excludedPopupDecision', confirm(excludedPopupText));
	if(getLocalSetting('excludedPopupDecision') == 'false')  {
		setLocalSetting('excludedImages', '[]');
		return;
	}
	//get list
	let excludes = [];
	if(getLocalSetting('excludedImages') != null) excludes = JSON.parse(getLocalSetting('excludedImages'));
	if(!excludes.includes(this.id)) excludes.push(this.id);
	excludeImage(this);
	
	//push back list
	setLocalSetting('excludedImages', JSON.stringify(excludes));
}

function excludeImage(image) {
	image.parentElement.parentElement.parentElement.style.display = 'none';
	image.classList.add('excluded');
}

function reloadImages(array) {
	if(!window['min-height']) window['min-height'] = 9999;
	if(!window['max-height']) window['max-height'] = 0;

	let loadedImages = 0;
	let failedImages = 0;
	for(var img of array)
	{
		let image = document.getElementById(img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg',''));
		if(image == null) continue;
		if(image.classList.contains('failed'))
		{
			++failedImages;
			continue;
		}
		if(image.complete)
		{
			document.querySelector('.loader-count').innerText = ++loadedImages;
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
		if(window.innerWidth >= 640 && image.height > window['max-height'] && image.height > 1)
			window['max-height'] = image.height;
		else if (image.height < window['min-height'] && image.height > 1)
			window['min-height'] = image.height;
	}
	recoverOrientationIfEmpty(array);
	resizeImageHeights();
	let totalImages = loadedImages + failedImages;
	if(totalImages < array.length - 1) setTimeout( function() { reloadImages(array); },500);
	if(totalImages >= array.length - 1) 
	{
		resizeImageHeights();
		document.querySelector('#ss-start').removeAttribute('disabled');
		document.querySelector('#ss-viewer').removeAttribute('disabled');
		document.querySelector('#ss-fullscreen').removeAttribute('disabled');
		setTimeout(function () { document.querySelector('#options').classList.add('closed') }, 1000);
	}
}

function resizeImageHeights() {
	let galleryHeight = calculateGalleryHeight();
	for(var image of document.querySelector('#imgGallery').getElementsByTagName('img'))
	{
		if(image.height <= 10) continue;
		if(window.innerWidth > 1040) //resize to lowest height
			image.style.height = galleryHeight + 'px'; //fallback to default if height too low
		else //if(image.height > window['min-height'])
			image.height = window['min-height']; //if small screen hit css maxHeight
	}
	
	if(getSessionSetting('focused'))
		document.getElementById(getSessionSetting('focused'))
			.scrollIntoView({
				behavior: "smooth",
				inline: "center"
			});
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
	let noneSelected = false;
	//generate tickboxes
	for(let label of labelArray)
	{
		let labelHTML = document.createElement('label');
		labelHTML.title = tagRightClickTitle;
		labelHTML.innerText = label;
		let inputHTML = document.createElement('input');
		inputHTML.type = 'checkbox';
		inputHTML.name = 'column' + label.replace(' ','');
		inputHTML.value = label;
		inputHTML.innerText = label;
		inputHTML.checked = false;
		if(typeof defaultTag == 'number' && defaultTag >= 0 && defaultTag < labelArray.length)
			inputHTML.checked = label == labelArray[defaultTag];
		else if(typeof defaultTag == 'string') {
			if(defaultTag.length == 0)
				inputHTML.checked = true;
			else
				inputHTML.checked = label == defaultTag;
		}
		if(inputHTML.checked) noneSelected = true;
		labelHTML.insertBefore(inputHTML,labelHTML.childNodes[0]);
		document.querySelector('#name').appendChild(labelHTML);
	}
	
	return noneSelected;	
}

function generateTickboxAction(noneSelected) {
	//add event listeners to tickboxes
	document.querySelector('#SelectAll').addEventListener('click', function () {
		if(document.querySelector('#SelectAll').checked == true)
		{
			for (let label of document.querySelector('#name').getElementsByTagName('input'))
			{
				label.checked = true;
			}
		}
		else
		{
			for (let label of document.querySelector('#name').getElementsByTagName('input'))
			{
				label.checked = false;
			}
		}
		renderFilter();
	});
	for (let tickbox of document.querySelector('#filter').getElementsByTagName('label'))
	{
		tickbox.addEventListener('click', function() { 
			if(runSlideshow == null) renderFilter(undefined); 
		});
		if(tickbox.innerText == selectAllTag) continue;
		if(tickbox.parentElement.id == 'orientation') continue;
		tickbox.addEventListener('contextmenu', function(e) { 
			e.preventDefault();
			if(runSlideshow == null) renderFilter(this);
			if(enableCollapseFilterOnSelect) document.querySelector('#toggler').click();
		});
	}
	if(!noneSelected && !document.querySelector('#SelectAll').checked) {
		console.error('defaultTag is not in list or in specified format: All is selected');
		document.querySelector('#SelectAll').click();
	}
}

function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.querySelector('#orientation').getElementsByTagName('input'))
	{
		if(label.checked == true || element != null)
			orientationArray.push(label.value);
		if(element != null)
			label.checked = true;
	}
	
	let nameArray = new Array();
	if(element != undefined) //select all
	{
		for (let label of document.querySelector('#name').getElementsByTagName('input'))
		{
			label.checked = false;
			if(element.innerText == label.parentElement.innerText) label.checked = true;
		}
	}
	for (let label of document.querySelector('#name').getElementsByTagName('input'))
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
	
	if(newArray[0].length > 5 && imgArray[0][5] == 'DATE') { // As in yyyy/MM/dd
		newArray.sort(function (a, b) {
			let aDate = new Date(a[5]);
			let bDate = new Date(b[5]);
			return bDate - aDate;
		});
	}
	
	renderGallery(newArray);
}

function recoverOrientationIfEmpty(array) {
	//to write back orientation if found no values
	//find in array, if at least one empty, update
	let orientationArray = new Array();
	for (let label of document.querySelector('#orientation').getElementsByTagName('input'))
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
	// let scrollList = new Array();
	// let time = new Date();
	document.getElementById("imgGallery").addEventListener(mousewheelEvent, function(e) {
		e.preventDefault();
		//document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		//console.log(new Date() - time);
		// time = new Date();
		let scrollDelta = isFirefox ? -e.detail*100 : e.wheelDelta
		document.getElementsByClassName('profile-category')[0].scrollLeft -= scrollDelta;
		
		// if(new Date() - time < 400 && ((scrollDelta/2) > 30 || (scrollDelta/2) < -30)) //conditions to prevent immediate snap
		// {
			// reSnap();
		// }
	});
	
	// document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
	if(isMobile() && document.getElementsByClassName('profile-category').length > 0)
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
	// });
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
	let theme = Array.from(document.getElementsByTagName('meta')).filter(m => m.name == 'theme-color');
	let themeColor = theme[0];
	if(document.getElementsByTagName('html')[0].classList.contains('darked')) //parent class of each page
	{
		document.getElementsByTagName('html')[0].classList.remove('darked');
		themeColor.content = 'white';
	}
	else
	{
		document.getElementsByTagName('html')[0].classList.add('darked');
		themeColor.content = 'black';
	}
	toggleLocalSetting("enableDarkMode");
}

function writeLoadedCount(number) {	
	let oldNumber = document.querySelector('.loader-count') == undefined ? -1 : parseInt(document.querySelector('.loader-count').innerText);
	if(oldNumber >= 0 && number < oldNumber) return document.querySelector('.loader');

	let loader = document.createElement('h5');
	loader.classList.add('loader');
	let loaderPrefix = document.createElement('span');
	loaderPrefix.innerText = '[' + loaderTextPrefix;
	loader.appendChild(loaderPrefix);
	let loaderSpan = document.createElement('span');
	loaderSpan.classList.add('loader-count');
	loaderSpan.innerText = number ?? 0;
	loader.appendChild(loaderSpan);
	let loaderSuffix = document.createElement('span');
	loaderSuffix.innerText = ']';
	loader.appendChild(loaderSuffix);

	return loader;
}

//start slideshow
function startSlideshow() {
	//document.querySelector('#description').classList.add('closed');
	switchButtons(true);
	setTimeout(openFullscreen, 200);
	let selected = randomImg();
	if(document.querySelector('#ss-viewer').checked)
		setTimeout(function() {
			openViewer(selected);
		}, 500);
	else
		selected.scrollIntoView({ inline: 'center' });
}
//stop slideshow
function stopSlideshow() {
	closeFullscreen();
	switchButtons(false);
	clearTimeout(runSlideshow);
	runSlideshow = null;
}

function switchButtons(slideshow) {
	document.querySelector('#ss-start').style.display = !slideshow ? '' : 'none';
	document.querySelector('#ss-stop').style.display = slideshow ? '' : 'none';
	document.querySelector('#ss-viewer').disabled = slideshow;
	document.querySelector('#ss-fullscreen').disabled = slideshow;
	
	for(let checkbox of document.querySelectorAll("input[type='checkbox']"))
	{
		checkbox.disabled = slideshow;
	}
}

function preventDefault() {
	e.preventDefault();
}


function randomImg() {
	// document.getElementsByClassName('profile-category')[0].classList.add('snap');
	let images = document.querySelectorAll('.profile-box img');
	let index = Math.floor(Math.random()*images.length);
	let selected = images[index];
	selected.scrollIntoView({ inline: 'center' });
	if(document.querySelector('.viewer').style.display == 'block') openImageInViewer(selected);
	// document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	runSlideshow = setTimeout(randomImg, slideshowInterval * 1000);
	return selected;
}

//allow document to fullscreen
function openFullscreen() {
if(!document.querySelector('#ss-fullscreen').checked) return;
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
	if(document.querySelector('#filter').classList.contains('closed')) document.querySelector('#filter').classList.remove('closed');
	else document.querySelector('#filter').classList.add('closed');
	if(document.querySelector('#midline').classList.contains('closed')) document.querySelector('#midline').classList.remove('closed');
	else document.querySelector('#midline').classList.add('closed');
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

function hashString(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

//settings
function getLocalSetting(settingName) {
	return localStorage.getItem(body.id + "_" + settingName);
}

function setLocalSetting(settingName, settingValue) {
	localStorage.setItem(body.id + "_" + settingName, settingValue);
}

function deleteLocalSetting(settingName) {
	localStorage.removeItem(body.id + "_" + settingName);
}

function toggleLocalSetting(settingName, settingValue) {
	localStorage.setItem(body.id + "_" + settingName, localStorage.getItem(body.id + "_" + settingName) == "true" ? false : true);
}

function getSessionSetting(settingName) {
	return sessionStorage.getItem(body.id + "_" + settingName);
}

function setSessionSetting(settingName, settingValue) {
	sessionStorage.setItem(body.id + "_" + settingName, settingValue);
}