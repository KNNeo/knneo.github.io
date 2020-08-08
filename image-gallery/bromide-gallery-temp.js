spacerURL = 'https://knneo.github.io/resources/spacer.gif';
isFirefox = (/Firefox/i.test(navigator.userAgent));
lowestHeight = 9999;
highestHeight = 0;

//generate profile category based on array
function renderGallery(array) {
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	if(isFirefox) profileCategoryHTML.classList.add('snap');
	for(let img of array)
	{
		if(img[0] == 0) continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
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
		if(label[0] == 0) continue;
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

function setupGallery() {
	renderGallery(imgArray);
	var labelArray = generateNameLabels(imgArray);
	generateTickboxFilter(labelArray);
	generateTickboxAction();
	renderGalleryScroll();
}

//"lazy load" on window load
//window.onload = setupGallery;
