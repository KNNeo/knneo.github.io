//array containing all gallery info
//[sortOrder,directory,orientation,name]
var imgArray = [
[0,'','',''],
[1,'images/SELFSCAN_20140424_0002.jpg','portrait','Kotobuki Minako'],
[1,'images/SELFSCAN_20140324_0002.jpg','portrait','Toyosaki Aki'],
[1,'images/SELFSCAN_20140111_0007.jpg','landscape','Tomatsu Haruka'],
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
		imgHTML.alt = img[1];
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

//add event listeners to orientation tickboxes
for (let tickbox of document.getElementById('orientation').getElementsByTagName('label'))
{
	tickbox.addEventListener('click',renderOrientationFilter);
}
function renderOrientationFilter() {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	let newArray = new Array();
	for(let img of imgArray)
	{
		if(orientationArray.indexOf(img[2]) > -1)
			newArray.push(img);
	}
	renderGallery(newArray);
}

//add event listeners to name tickboxes
for (let tickbox of document.getElementById('name').getElementsByTagName('label'))
{
	tickbox.addEventListener('click',renderNameFilter);
}
function renderNameFilter() {
	let nameArray = new Array();
	for (let label of document.getElementById('name').getElementsByTagName('input'))
	{
		if(label.checked == true)
			nameArray.push(label.value);
	}
	let newArray = new Array();
	for(let img of imgArray)
	{
		if(nameArray.indexOf(img[3]) > -1)
			newArray.push(img);
	}
	renderGallery(newArray);
}


//prevent right click events
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderGallery(imgArray);
}