//from site: https://www.suruga-ya.jp/ and search name based on おもちゃ・ホビー category
//create array based on item box info
/*
let list = '\n';
let counter = 1;
for(let item of document.getElementsByClassName('item')) {
    let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
    if(url.includes('?')) url = url.substring(0,url.indexOf('?'));
	let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://www.suruga-ya.jp/database/pics/game/').toLowerCase();
    let tag = item.getElementsByClassName('title')[0].innerText.substring(0,item.getElementsByClassName('title')[0].innerText.indexOf('/'));
    let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
    list+= ("["+(counter++)+",'"+newurl+".jpg','portrait','"+tag+"','"+detail+"'],") + '\n';
}
*/

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let lowestHeight = 9999;
let highestHeight = 0;
//generate profile category based on array
function renderGallery(array) {
	document.getElementById('description').classList.remove('closed');
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	for(let img of array)
	{
		if(img[0] == 0) continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		//imgHTML.id = img[1].replace('https://www.suruga-ya.jp/database/pics/game/','').replace('.jpg','');
		imgHTML.id = img[1].substring(img[1].lastIndexOf('/')+1).replace('.jpg','');
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
	setTimeout( function() { reloadImages(array); },500);
	
	//add event listener when click on image
	/*for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}*/
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
		
		if(window.innerWidth >= 640)
		{
			if(image.height > highestHeight && image.height > 1) //set to highest height
				highestHeight = image.height;
			//else
			//	image.style.height = '50vh';
		}
		else {
			if(image.height < lowestHeight && image.height > 1) //set to lowest height
				lowestHeight = image.height;
			//else
			//	image.height = lowestHeight;
		}
	}
	resizeImageHeights();
	//checkImageHeights(array);
	if(loadedImages < array.length-1) setTimeout( function() { reloadImages(array); },500);
	if(loadedImages >= array.length-1) setTimeout(function () { document.getElementById('description').classList.add('closed') }, 1000);
}

function resizeImageHeights() {
	for(var image of document.getElementsByTagName("img"))
	{
		if(window.innerWidth >= 640 && image.height < highestHeight && image.height > 1)//resize to highest height
			image.style.height = '50vh';
		else if(image.height > lowestHeight && image.height > 1) //resize to lowest height
			image.height = lowestHeight;
	}
}

function checkImageHeights(array) {
	for(var image of document.getElementsByTagName("img"))
	{
		if(window.innerWidth >= 640)
		{
			if(image.height < highestHeight)
			{
				setTimeout( function() { reloadImages(array); },500);
				return;
			}
		}
		else
		{
			if(image.height > lowestHeight)
			{
				setTimeout( function() { reloadImages(array); },500);
				return;
			}
		}
	}
}

//generate name labels
var labelArray = new Array();
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
	inputHTML.checked = label == 'TrySail';
	labelHTML.insertBefore(inputHTML,labelHTML.childNodes[0]);
	document.getElementById('name').appendChild(labelHTML);
}
for (let tickbox of document.getElementsByTagName('label'))
{
	tickbox.addEventListener('click', function() { renderFilter(undefined); });
	if(tickbox.innerText == '全選') continue;
	tickbox.addEventListener('contextmenu', function() { renderFilter(this); });
}

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

//initial viewer state
document.getElementById('viewer').addEventListener('click', function() {
	document.getElementById('viewer').style.display = 'none';
	document.getElementById('viewer').innerHTML = '';
});

//allow scroll on desktop
var scrollList = new Array();
let largestHalfWidth = 0;
let time = new Date();
document.getElementById("imgGallery").addEventListener("wheel", function(e) {
    e.preventDefault();
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	//console.log(new Date() - time);
	time = new Date();
	document.getElementsByClassName('profile-category')[0].scrollLeft -= e.wheelDelta;
	
	if((new Date() - time < 500 && (e.wheelDelta > 50 || e.wheelDelta < -50))
		) //conditions to prevent immediate snap
	{
		reSnap();
	}
	
	//get relative positions of all images
	/*
	scrollList = new Array();
	for(let img of document.getElementsByClassName('profile-box'))
	{
		scrollList.push(img.getBoundingClientRect().x);
	}
	
	largestHalfWidth = document.getElementsByClassName('landscape')[0].getBoundingClientRect().width/2;
	let halfWidth = window.innerWidth/2;
	let diff = 99999; //closest x
	let imgIndex = -1; //corresponding index
	let x = 0;
	for(let i = 0; i < document.getElementsByClassName('profile-box').length; i++)
	{
		x = document.getElementsByClassName('profile-box')[i].getBoundingClientRect().x;
		if(x < halfWidth && halfWidth - x < diff)
		{
			imgIndex = i;
		}
	}
	//console.log(imgIndex);
	let imgLength = document.getElementsByClassName('profile-box').length;
	let newIndex = -1;
	if(e.wheelDelta < 0) //scroll right
		newIndex = imgIndex + 1;
	if(e.wheelDelta > 0) //scroll left
		newIndex = imgIndex - 1;
	
	let left = document.getElementsByClassName('profile-category')[0].scrollLeft;
	let newX = document.getElementsByClassName('profile-box')[newIndex].getBoundingClientRect().width;
	if(e.wheelDelta > 0) newX = -1*newX;
	//document.getElementsByClassName('profile-category')[0].scrollLeft += newX;
	let newLeft = document.getElementsByClassName('profile-category')[0].scrollLeft;
	//console.log(left + "|" + newLeft + "|" + (newX));
	*/
	
	//if(document.getElementsByClassName('profile-category')[0].scrollLeft < halfWidth)
	//	document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByClassName('profile-box')[2].getBoundingClientRect().x;
		
	//scroll depends on transition from image orientation eg. portrait to landscape
	//but scrollLeft value is always left edge of category box (0 is first img)
	//bountingrect.x for each image is wrt left edge of screen (0 is left edge of screen of category box)
	//document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByTagName('img')[1].getBoundingClientRect().x;

});

function reSnap() {
	setTimeout( function() { 
		//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
	}, 500);
	setTimeout( function() { 
		//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
		document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	}, 600);
}

document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
});

//open image to fullscreen
let viewer = document.getElementById('viewer');
function openViewer(image) {
	//document.getElementById('ssstart').style.display = '';
	//document.getElementById('ssstop').style.display = 'none';
	//clearTimeout(runSlideshow);

	viewer.style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {
	let img = image.cloneNode(true);
	img.style.maxHeight = '100vh';
	img.style.maxWidth = '100vw';
	if(viewer.childNodes.length > 0) viewer.innerHTML = '';
	viewer.appendChild(img);
	adjustViewerMargin();
}

function adjustViewerMargin() {
	//let viewer = document.getElementById('viewer');
	viewer.style.paddingTop = '0';
	if(viewer.getBoundingClientRect().height != viewer.getElementsByTagName('img')[0].height)
		viewer.style.paddingTop = (viewer.getBoundingClientRect().height - viewer.getElementsByTagName('img')[0].height)/2 + 'px';
}

//prevent right click events on filters
document.getElementById('filter').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderFilter(undefined);
	//renderGallery(imgArray);
}

let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
window.addEventListener('resize',function () {
	if(window.innerHeight == windowHeight || window.innerWidth != windowWidth) renderFilter(undefined);
	else {
		windowHeight = window.innerHeight;
		windowWidth = window.innerWidth
	}
});

function obtainArray() {
	//imgArray.push([]);
	return imgArray.filter(function(image) {
		return image[1];
	});
}

//slideshow event
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').classList.add('closed');
	switchButtons();
	openFullscreen();
	randomImg();
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
}

function randomImg() {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
	let images = document.getElementsByClassName('profile-box');
	let selected = images[Math.floor(Math.random()*images.length)];
	selected.scrollIntoView();
	if(viewer.style.display == 'block') openImageInViewer(selected.getElementsByTagName('img')[0]);
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	runSlideshow = setTimeout(randomImg, 3000);
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