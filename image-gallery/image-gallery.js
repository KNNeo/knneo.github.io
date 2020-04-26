//array containing all gallery info
//[sortOrder,directory,orientation,name]
var imgArray = [
[0,'','',''],
[1, 'images/SELFSCAN_20140111_0002','portrait', 'Kotobuki Minako'],
[2, 'images/SELFSCAN_20140111_0005','portrait', 'Hikasa Youko'],
[3, 'images/SELFSCAN_20140111_0007','landscape','Tomatsu Haruka'],
[4, 'images/SELFSCAN_20140111_0009','landscape','Taketatsu Ayana'],
[5, 'images/SELFSCAN_20140111_0010','portrait', 'Taketatsu Ayana'],
[6, 'images/SELFSCAN_20140111_0011','portrait', 'Taketatsu Ayana'],
[7, 'images/SELFSCAN_20140307_0001','portrait', 'Horie Yui'],
[8, 'images/SELFSCAN_20140311_0002','landscape','Satou Satomi'],
[9, 'images/SELFSCAN_20140324_0001','portrait', 'Horie Yui'],
[10,'images/SELFSCAN_20140324_0002','portrait', 'Toyosaki Aki'],
[11,'images/SELFSCAN_20140424_0002','portrait', 'Kotobuki Minako'],
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
		imgHTML.alt = img[1] + '.jpg';
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
		image.alt = '';
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

//prevent right click events
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderGallery(imgArray);
}

