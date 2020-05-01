//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'','',''],
[1, 'SELFSCAN_20140111_0002','portrait', 'Kotobuki Minako'],
[2, 'SELFSCAN_20140111_0005','portrait', 'Hikasa Youko'],
[3, 'SELFSCAN_20140111_0007','landscape','Tomatsu Haruka'],
[4, 'SELFSCAN_20140111_0009','landscape','Taketatsu Ayana'],
[5, 'SELFSCAN_20140111_0010','portrait', 'Taketatsu Ayana'],
[6, 'SELFSCAN_20140111_0011','portrait', 'Taketatsu Ayana'],
[7, 'SELFSCAN_20140307_0001','portrait', 'Horie Yui'],
[8, 'SELFSCAN_20140311_0002','landscape','Satou Satomi'],
[9, 'SELFSCAN_20140324_0001','portrait', 'Horie Yui'],
[10,'SELFSCAN_20140324_0002','portrait', 'Toyosaki Aki'],
[11,'SELFSCAN_20140424_0002','portrait', 'Kotobuki Minako'],
[12,'SELFSCAN_20140529_0001','landscape','sphere'],
[13,'SELFSCAN_20140719_0001','portrait', 'Toyosaki Aki'],
[14,'SELFSCAN_20140823_0001','portrait', 'Amamiya Sora'],
[15,'SELFSCAN_20141117_0001','portrait', 'Toyosaki Aki'],
[16,'SELFSCAN_20150228_0005','landscape','sphere'],
[17,'SELFSCAN_20150415_0001','portrait', 'Kotobuki Minako'],
[18,'SELFSCAN_20150526_0001','portrait', 'TrySail'],
[19,'SELFSCAN_20150625_0002','portrait', 'Toyosaki Aki'],
[20,'SELFSCAN_20150925_0001','portrait', 'Kotobuki Minako'],
[21,'SELFSCAN_20151001_0001','portrait', 'Tomatsu Haruka'],
[22,'SELFSCAN_20160204_0001','portrait', 'Taketatsu Ayana'],
[23,'SELFSCAN_20160227_0005','portrait', 'Tomatsu Haruka'],
[24,'SELFSCAN_20160402_0001','portrait', 'Toyosaki Aki'],
[25,'SELFSCAN_20160531_0001','landscape','TrySail'],
[26,'SELFSCAN_20160602_0003','portrait', 'TrySail'],
[27,'SELFSCAN_20160629_0003','portrait', 'Kotobuki Minako'],
[28,'SELFSCAN_20160629_0004','landscape','Toyosaki Aki'],
[29,'SELFSCAN_20160629_0006','portrait', 'Toyosaki Aki'],
[30,'SELFSCAN_20160629_0007','landscape','Toyosaki Aki'],
[31,'SELFSCAN_20160629_0008','landscape','Toyosaki Aki'],
[32,'SELFSCAN_20160629_0010','portrait', 'Toyosaki Aki'],
[33,'SELFSCAN_20160629_0011','portrait', 'Toyosaki Aki'],
[34,'SELFSCAN_20160905_0001','portrait', 'Toyosaki Aki'],
[35,'SELFSCAN_20170510_0001','portrait', 'Natsukawa Shiina'],
[36,'SELFSCAN_20170602_0002','portrait', 'TrySail'],
[37,'SELFSCAN_20170610_0001','portrait', 'Toyosaki Aki'],
[38,'SELFSCAN_20170728_0005','portrait', 'Uesaka Sumire'],
[39,'SELFSCAN_20170728_0008','portrait', 'TrySail'],
[40,'SELFSCAN_20170908_0001','landscape','Natsukawa Shiina'],
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
		imgHTML.classList.add('lazyestload');
		imgHTML.setAttribute('alt', 'images/' + img[1] + '.jpg');
		imgHTML.setAttribute('src', 'images/' + img[1] + '_thumb.jpg');
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
labelArray.sort();
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
    document.getElementsByClassName('profile-category')[0].scrollLeft -= e.wheelDelta*4;
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

