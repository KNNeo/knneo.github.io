//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'','',''],
[1,'SELFSCAN_20140111_0002','portrait','Kotobuki Minako'],
[2,'SELFSCAN_20140111_0005','portrait','Hikasa Youko'],
[3,'SELFSCAN_20140111_0007','landscape','Tomatsu Haruka'],
[5,'SELFSCAN_20140111_0009','landscape','Taketatsu Ayana'],
[6,'SELFSCAN_20140111_0010','portrait','Taketatsu Ayana'],
[7,'SELFSCAN_20140111_0011','portrait','Taketatsu Ayana'],
[8,'SELFSCAN_20140307_0001','portrait','Horie Yui'],
[11,'SELFSCAN_20140311_0002','landscape','Satou Satomi'],
[12,'SELFSCAN_20140324_0001','portrait','Horie Yui'],
[13,'SELFSCAN_20140324_0002','portrait','Toyosaki Aki'],
[15,'SELFSCAN_20140424_0002','portrait','Kotobuki Minako'],
[16,'SELFSCAN_20140529_0001','landscape','sphere'],
[20,'SELFSCAN_20140719_0001','portrait','Toyosaki Aki'],
[23,'SELFSCAN_20140823_0001','portrait','Amamiya Sora'],
[25,'SELFSCAN_20141117_0001','portrait','Toyosaki Aki'],
[30,'SELFSCAN_20150228_0005','landscape','sphere'],
[31,'SELFSCAN_20150415_0001','portrait','Kotobuki Minako'],
[32,'SELFSCAN_20150526_0001','portrait','TrySail'],
[34,'SELFSCAN_20150625_0002','portrait','Toyosaki Aki'],
[35,'SELFSCAN_20150925_0001','portrait','Kotobuki Minako'],
[36,'SELFSCAN_20151001_0001','portrait','Tomatsu Haruka'],
[38,'SELFSCAN_20160204_0001','portrait','Taketatsu Ayana'],

[41,'SELFSCAN_20160227_0005','portrait','Tomatsu Haruka'],
[42,'SELFSCAN_20160402_0001','portrait','Toyosaki Aki'],
[45,'SELFSCAN_20160531_0001','landscape','TrySail'],
[48,'SELFSCAN_20160602_0003','portrait','TrySail'],
[51,'SELFSCAN_20160629_0003','portrait','Kotobuki Minako'],
[52,'SELFSCAN_20160629_0004','landscape','Toyosaki Aki'],

[54,'SELFSCAN_20160629_0006','portrait','Toyosaki Aki'],
[55,'SELFSCAN_20160629_0007','landscape','Toyosaki Aki'],
[56,'SELFSCAN_20160629_0008','landscape','Toyosaki Aki'],

[58,'SELFSCAN_20160629_0010','portrait','Toyosaki Aki'],
[59,'SELFSCAN_20160629_0011','portrait','Toyosaki Aki'],
[60,'SELFSCAN_20160905_0001','portrait','Toyosaki Aki'],
[61,'IMG_20170107_0001','portrait','Komatsu Mikako'],
[62,'IMG_20170107_0002','portrait','Komatsu Mikako'],
[63,'IMG_20170107_0003','portrait','Komatsu Mikako'],
[64,'IMG_20170107_0004','portrait','Komatsu Mikako'],
[65,'IMG_20170107_0005','portrait','Komatsu Mikako'],
[66,'IMG_20170107_0006','portrait','Komatsu Mikako'],
[67,'IMG_20170107_0007','portrait','Komatsu Mikako'],
[68,'IMG_20170107_0008','portrait','Komatsu Mikako'],
[69,'IMG_20170107_0009','portrait','Komatsu Mikako'],
[70,'SELFSCAN_20170510_0001','portrait','Natsukawa Shiina'],
[71,'SELFSCAN_20170602_0002','portrait','TrySail'],
[72,'SELFSCAN_20170610_0001','portrait','Toyosaki Aki'],
[73,'SELFSCAN_20170720_0001','portrait','Toyosaki Aki'],
[77,'SELFSCAN_20170728_0005','portrait','Uesaka Sumire'],
[79,'SELFSCAN_20170728_0008','portrait','TrySail'],
[80,'SELFSCAN_20170908_0001','landscape','Natsukawa Shiina'],
[81,'CCI20180102_0001','portrait','Amamiya Sora'],

[83,'CCI20180331_0001','landscape','TrySail'],
[84,'CCI20180930-1','portrait','Minase Inori'],







[92,'CCI20181231_0000-1','portrait','Komatsu Mikako'],
[93,'CCI20181231_0000-2','portrait','Komatsu Mikako'],
[94,'CCI20181231_0001-1','portrait','Komatsu Mikako'],
[95,'CCI20181231_0001-2','portrait','Komatsu Mikako'],
[96,'CCI20181231_0002-1','portrait','Komatsu Mikako'],
[97,'CCI20181231_0002-2','portrait','Komatsu Mikako'],
[98,'CCI20181231_0003-1','portrait','Komatsu Mikako'],
[99,'CCI20181231_0003-2','portrait','Komatsu Mikako'],
[100,'CCI20190502_001','portrait','Kouno Marika'],
[101,'CCI20190502_002','portrait','Kido Ibuki'],
[102,'CCI20190629_0000_1','portrait','Tomatsu Haruka'],
[103,'CCI20190629_0000_2','portrait','Minase Inori'],
[104,'CCI20190629_0000_3','portrait','Hanazawa Kana'],


[107,'CCI20190629_0001_1','portrait','Asakura Momo'],
[108,'CCI20190629_0001_2','portrait','Kouno Marika'],
[109,'CCI20190629_0002_1','portrait','Kouno Marika'],
[110,'CCI20190629_0002_2','portrait','Kouno Marika'],
[111,'CCI20190629_0002_3','portrait','Kouno Marika'],
[112,'CCI20190629_0002_4','portrait','Kouno Marika'],
[113,'CCI20190629_0003_1','landscape','Touyama Nao'],
[114,'CCI20190629_0003_2','portrait','Ookubo Rumi'],
[115,'CCI20190629_0003_3','portrait','Ookubo Rumi'],
[116,'CCI20190629_0003_4','landscape','Natsukawa Shiina'],
[117,'CCI20190629_0004_1','portrait','Fujita Akane'],
[118,'CCI20190629_0004_2','landscape','Fujita Akane'],
[119,'CCI20190629_0004_3','portrait','Tomatsu Haruka'],
[120,'CCI20190629_0005_1','landscape','Amamiya Sora'],
[121,'CCI20190629_0005_2','portrait','Amamiya Sora'],
[122,'CCI20190629_0005_3','portrait','Amamiya Sora'],
[123,'CCI20190629_0006_1','portrait','Asakura Momo'],
[124,'CCI20190629_0006_2','portrait','Asakura Momo'],
[125,'CCI20190629_0006_3','portrait','Asakura Momo'],
[126,'CCI20190921','landscape','Asakura Momo'],



















[146,'CCI20191026_0001','landscape','Kitou Akari'],
[147,'CCI20200222_0001_1','portrait','Uesaka Sumire'],
[148,'CCI20200222_0001_2','landscape','Uesaka Sumire'],
[149,'CCI20200222_0001_3','landscape','Uesaka Sumire'],
[150,'CCI20200222_0001_4','portrait','Uesaka Sumire'],
[151,'CCI20200222_0002_1','portrait','Uesaka Sumire'],
[152,'CCI20200222_0002_2','portrait','Kitou Akari'],
[153,'CCI20200222_0002_3','landscape','Uesaka Sumire'],
[154,'CCI20200222_0002_4','portrait','Kitou Akari'],
[155,'CCI20200222_0003_1','portrait','Uesaka Sumire'],
[156,'CCI20200222_0003_2','portrait','Uesaka Sumire'],
[157,'CCI20200222_0003_3','portrait','Uesaka Sumire'],
[158,'CCI20200222_0003_4','portrait','Uesaka Sumire'],

[160,'CCI20200222_0004_2','portrait','Uesaka Sumire'],
[999,'','','']
];

//generate profile category based on array
function renderGallery(array) {
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	for(let img of array)
	{
		if(img[1] == '') continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		imgHTML.classList.add(img[2]);
		imgHTML.setAttribute('alt', 'images/' + img[1] + '.jpg');
		imgHTML.setAttribute('src', 'https://knneo.github.io/resources/spacer.gif');
		imgHTML.title = img[3];
		profileBoxImgHTML.appendChild(imgHTML);
		profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
	}
	if(document.getElementById('imgGallery').childNodes.length > 0) document.getElementById('imgGallery').innerHTML = '';
	document.getElementById('imgGallery').appendChild(profileCategoryHTML);
	
	for(var image of document.getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
	}
	
	//add event listener when click on image
	for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}
	function openViewer(image) {
		document.getElementById('ssstart').style.display = '';
		document.getElementById('ssstop').style.display = 'none';
		clearTimeout(runSlideshow);

		let viewer = document.getElementById('viewer');
		let holder = document.createElement('DIV');
		holder.classList.add('holder');
		holder.style.textAlign = 'center';
		let img = image.cloneNode(true);
		img.style.maxHeight = '100vh';
		img.style.maxWidth = '100vw';
		holder.appendChild(img);
		if(viewer.childNodes.length > 0) viewer.innerHTML = '';
		viewer.appendChild(holder);
		viewer.style.display = 'block';
	}
}

//generate name labels
var labelArray = new Array();
for(let label of imgArray)
{
	if(label[3] == '') continue;
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
	tickbox.addEventListener('click',renderFilter);
}
function renderFilter() {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	let nameArray = new Array();
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
document.getElementById("imgGallery").addEventListener("wheel", function(e) {
    e.preventDefault();
	//get relative positions of all images
	let scrollList = new Array();
	for(let img of document.getElementsByClassName('profile-box'))
	{
		scrollList.push(img.getBoundingClientRect().x);
	}
    // document.getElementsByClassName('profile-category')[0].scrollLeft -= e.wheelDelta*4;
	let posDelta = 0;
	//sort reverse order if scroll up
	if(e.wheelDelta > 0) scrollList.sort(function(a, b){return b-a});
	//find next closest element
	for(let position of scrollList)
	{
		if(e.wheelDelta < 0 && position >= 0.5*window.innerWidth)
		{
			posDelta = position;
			break;
		}
		if(e.wheelDelta > 0 && position <= -0.5*window.innerWidth)
		{
			posDelta = position;
			break;
		}
	}
	//scroll
	document.getElementsByClassName('profile-category')[0].scrollLeft += + posDelta;
	return;
});

//prevent right click events
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderGallery(imgArray);
}
//slideshow event
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').remove();
	switchButtons();
	randomImg();
}
//stop slideshow
function stopSlideshow() {
	switchButtons();
	clearTimeout(runSlideshow);
}

function switchButtons() {
	document.getElementById('ssstart').style.display = document.getElementById('ssstart').style.display == 'none' ? '' : 'none';
	document.getElementById('ssstop').style.display = document.getElementById('ssstop').style.display == 'none' ? '' : 'none';
}

function randomImg() {
	let images = document.getElementsByClassName('profile-box');
	images[Math.floor(Math.random()*images.length)].scrollIntoView();
	runSlideshow = setTimeout(randomImg, 3000);
}