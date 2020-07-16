//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],
/*
[1,'https://www.suruga-ya.jp/database/pics/game/g3013821.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204936.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3238850.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204937.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3238851.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4494725.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4494727.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3040713.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3040714.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3242327.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4494723.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3013817.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6235275.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6235276.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6235279.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g8603998.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284089.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284086.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284087.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg208488.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg208489.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg189340.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg189336.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284973.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3768927.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3716291.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3711225.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3778061.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3580668.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3580667.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3716299.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3711221.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3614262.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3778062.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453849.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3532448.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453848.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453852.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3445470.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3566551.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453853.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3532449.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345811.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3445466.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3614261.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3445467.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3458434.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3458433.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3458435.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3445468.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3395275.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3087480.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3087468.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345812.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3087475.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3087473.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3030374.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5802449.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5802448.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5802446.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5802444.jpg','portrait','tag','detail'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5802443.jpg','portrait','tag','detail'],
*/
[1,'https://www.suruga-ya.jp/database/pics/game/gg427055.jpg','portrait','上坂すみれ','横型・上半身・衣装オレンジ・振り返り/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427051.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・体右向き・背景黒/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427052.jpg','portrait','上坂すみれ','横型・バストアップ・衣装青.黒・両手頬/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427053.jpg','portrait','上坂すみれ','上半身・衣装オレンジ・飲み物/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427050.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・左手胸・背景赤/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034304.jpg','portrait','上坂すみれ','上半身・衣装紫・左手サングラス・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034303.jpg','portrait','上坂すみれ','横型・上半身・衣装紫・右手銃・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034305.jpg','portrait','上坂すみれ','横型・顔アップ・衣装紫・体右向き・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034306.jpg','portrait','上坂すみれ','横型・バストアップ・衣装ピンク・右手パー・背景水色/「上坂すみれのノーフューチャーダイアリー2019」生写真セットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034308.jpg','portrait','上坂すみれ','膝上・衣装ピンク・体左向き・背景水色/「上坂すみれのノーフューチャーダイアリー2019」生写真セットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034309.jpg','portrait','上坂すみれ','上半身・衣装白・黒・ピンク・両手棒・口元・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277820.jpg','portrait','上坂すみれ','バストアップ・衣装白・黒・左向き・背景ピンク・印刷サイン入り/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277821.jpg','portrait','上坂すみれ','膝上・衣装白・黒・両手下・首傾げ・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277815.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・目線左上・背景白・印刷サイン入り/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277813.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・左手指差し・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277817.jpg','portrait','上坂すみれ','全身・衣装白・黒・両手棒・右足曲げ・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277819.jpg','portrait','上坂すみれ','バストアップ・衣装白・黒・右手曲げ・右向き・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277816.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・左手腰・顔左向き・口開け・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277814.jpg','portrait','上坂すみれ','膝上・衣装白・黒・両手棒・口開け・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277818.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・顔右向き・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3609175.jpg','portrait','上坂すみれ','衣装ピンク・右手髪の毛/雑誌「声優グランプリ 2018年2月号」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg062401.jpg','portrait','上坂すみれ','雑誌「B.L.T. VOICE GIRLS Vol.38」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3643823.jpg','portrait','上坂すみれ','雑誌「B.L.T. VOICE GIRLS Vol.33」アニメイト特典生写真'],

];

//from site: https://www.suruga-ya.jp/
//create array based on item box info
/*
let list = '';
for(let item of document.getElementsByClassName('item')) {
    let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
    if(url.includes('?')) continue;
	let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://www.suruga-ya.jp/database/pics/game/').toLowerCase() + '.jpg';
    list+= ("[1,'"+newurl+".jpg','portrait','tag','detail'],") + '\n';
}
*/


function obtainArray() {
	//imgArray.push([]);
}

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
//generate profile category based on array
function renderGallery(array) {
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
	setTimeout(reloadImages,500);
	
	//add event listener when click on image
	/*for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}*/
}

function reloadImages() {
	let loadedImages = 0;
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.complete) document.getElementById('loadedCount').innerText = ++loadedImages;
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;
			
		}
	}
	if(loadedImages < imgArray.length-1) setTimeout(reloadImages,500);
	if(loadedImages >= imgArray.length-1) setTimeout(function () { document.getElementById('description').style.display = 'none'; }, 2000);
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
	inputHTML.checked = true;
	labelHTML.insertBefore(inputHTML,labelHTML.childNodes[0]);
	document.getElementById('name').appendChild(labelHTML);
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
for (let tickbox of document.getElementsByTagName('label'))
{
	tickbox.addEventListener('click', function() { renderFilter(undefined); });
	if(tickbox.innerText == 'Select All') continue;
	tickbox.addEventListener('contextmenu', function() { renderFilter(this); });
}

function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	
	let nameArray = new Array();
	if(element != undefined)
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
	
	if(new Date() - time < 300 && (e.wheelDelta > 50 || e.wheelDelta < -50)) //conditions to prevent immediate snap
	{
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
			document.getElementsByClassName('profile-category')[0].classList.add('snap');
		}, 500);
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
			document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		}, 600);
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
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - viewer.getElementsByTagName('img')[0].height)/2 + 'px';
}

//prevent right click events
document.addEventListener('contextmenu', function(e) {
    //e.preventDefault();
    //return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	obtainArray();
	renderGallery(imgArray);
}
//slideshow event
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').style.display = 'none';
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