//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'','',''],
[1,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAA-USZ-F0(0)001.png','portrait','Isabelle','Isabelle'],
[2,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAB-USZ-F0(0)002.png','portrait','Tom Nook','Tom Nook'],
[3,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAC-USZ-F0(0)003.png','portrait','DJ KK','DJ KK'],
[4,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAD-USZ-F0(0)004.png','portrait','Sable','Sable'],
[5,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAE-USZ-F0(0)005.png','portrait','Kapp\'n','Kapp\'n'],
[6,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAF-USZ-F0(0)006.png','portrait','Resetti','Resetti'],
[7,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAG-USZ-F0(0)007.png','portrait','Joan','Joan'],
[8,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAH-USZ-F0(0)008.png','portrait','Timmy','Timmy'],
[9,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAJ-USZ-F0(0)009.png','portrait','Digby','Digby'],
[10,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAK-USZ-F0(0)010.png','portrait','Pascal','Pascal'],
[11,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAL-USZ-F0(0)011.png','portrait','Harriet','Harriet'],
[12,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAM-USZ-F0(0)012.png','portrait','Redd','Redd'],
[13,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAN-USZ-F0(0)013.png','portrait','Saharah','Saharah'],
[14,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAP-USZ-F0(0)014.png','portrait','Luna','Luna'],
[15,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAQ-USZ-F0(0)015.png','portrait','Tortimer','Tortimer'],
[16,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAR-USZ-F0(0)016.png','portrait','Lyle','Lyle'],
[17,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAS-USZ-F0(0)017.png','portrait','Lottie','Lottie'],
[18,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAT-USZ-F0(0)018.png','portrait','Bob','Bob'],
[19,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAU-USZ-F0(0)019.png','portrait','Fauna','Fauna'],
[20,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAV-USZ-F0(0)020.png','portrait','Curt','Curt'],
[21,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAW-USZ-F0(0)021.png','portrait','Portia','Portia'],
[22,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAX-USZ-F0(0)022.png','portrait','Leonardo','Leonardo'],
[23,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAY-USZ-F0(0)023.png','portrait','Cheri','Cheri'],
[24,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAAZ-USZ-F0(0)024.png','portrait','Kyle','Kyle'],
[25,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABA-USZ-F0(0)025.png','portrait','Al','Al'],
[26,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABB-USZ-F0(0)026.png','portrait','Renée','Renée'],
[27,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABC-USZ-F0(0)027.png','portrait','Lopez','Lopez'],
[28,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABD-USZ-F0(0)028.png','portrait','Jambette','Jambette'],
[29,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABE-USZ-F0(0)029.png','portrait','Rasher','Rasher'],
[30,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABF-USZ-F0(0)030.png','portrait','Tiffany','Tiffany'],
[31,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABG-USZ-F0(0)031.png','portrait','Sheldon','Sheldon'],
[32,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABH-USZ-F0(0)032.png','portrait','Bluebear','Bluebear'],
[33,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABJ-USZ-F0(0)033.png','portrait','Bill','Bill'],
[34,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABK-USZ-F0(0)034.png','portrait','Kiki','Kiki'],
[35,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABL-USZ-F0(0)035.png','portrait','Deli','Deli'],
[36,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABM-USZ-F0(0)036.png','portrait','Alli','Alli'],
[37,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABN-USZ-F0(0)037.png','portrait','Kabuki','Kabuki'],
[38,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABP-USZ-F0(0)038.png','portrait','Patty','Patty'],
[39,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABQ-USZ-F0(0)039.png','portrait','Jitters','Jitters'],
[40,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABR-USZ-F0(0)040.png','portrait','Gigi','Gigi'],
[41,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABS-USZ-F0(0)041.png','portrait','Quillson','Quillson'],
[42,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABT-USZ-F0(0)042.png','portrait','Marcie','Marcie'],
[43,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABU-USZ-F0(0)043.png','portrait','Puck','Puck'],
[44,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABV-USZ-F0(0)044.png','portrait','Shari','Shari'],
[45,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABW-USZ-F0(0)045.png','portrait','Octavian','Octavian'],
[46,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABX-USZ-F0(0)046.png','portrait','Winnie','Winnie'],
[47,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABY-USZ-F0(0)047.png','portrait','Knox','Knox'],
[48,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MABZ-USZ-F0(0)048.png','portrait','Sterling','Sterling'],
[49,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACA-USZ-F0(0)049.png','portrait','Bonbon','Bonbon'],
[50,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACB-USZ-F0(0)050.png','portrait','Punchy','Punchy'],
[51,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACC-USZ-F0(0)051.png','portrait','Opal','Opal'],
[52,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACD-USZ-F0(0)052.png','portrait','Poppy','Poppy'],
[53,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACE-USZ-F0(0)053.png','portrait','Limberg','Limberg'],
[54,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACF-USZ-F0(0)054.png','portrait','Deena','Deena'],
[55,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACG-USZ-F0(0)055.png','portrait','Snake','Snake'],
[56,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACH-USZ-F0(0)056.png','portrait','Bangle','Bangle'],
[57,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACJ-USZ-F0(0)057.png','portrait','Phil','Phil'],
[58,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACK-USZ-F0(0)058.png','portrait','Monique','Monique'],
[59,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACL-USZ-F0(0)059.png','portrait','Nate','Nate'],
[60,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACM-USZ-F0(0)060.png','portrait','Samson','Samson'],
[61,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACN-USZ-F0(0)061.png','portrait','Tutu','Tutu'],
[62,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACP-USZ-F0(0)062.png','portrait','T-Bone','T-Bone'],
[63,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACQ-USZ-F0(0)063.png','portrait','Mint','Mint'],
[64,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACR-USZ-F0(0)064.png','portrait','Pudge','Pudge'],
[65,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACS-USZ-F0(0)065.png','portrait','Midge','Midge'],
[66,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACT-USZ-F0(0)066.png','portrait','Gruff','Gruff'],
[67,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACU-USZ-F0(0)067.png','portrait','Flurry','Flurry'],
[68,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACV-USZ-F0(0)068.png','portrait','Clyde','Clyde'],
[69,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACW-USZ-F0(0)069.png','portrait','Bella','Bella'],
[70,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACX-USZ-F0(0)070.png','portrait','Biff','Biff'],
[71,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACY-USZ-F0(0)071.png','portrait','Yuka','Yuka'],
[72,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MACZ-USZ-F0(0)072.png','portrait','Lionel','Lionel'],
[73,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADA-USZ-F0(0)073.png','portrait','Flo','Flo'],
[74,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADB-USZ-F0(0)074.png','portrait','Cobb','Cobb'],
[75,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADC-USZ-F0(0)075.png','portrait','Amelia','Amelia'],
[76,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADD-USZ-F0(0)076.png','portrait','Jeremiah','Jeremiah'],
[77,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADE-USZ-F0(0)077.png','portrait','Cherry','Cherry'],
[78,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADF-USZ-F0(0)078.png','portrait','Roscoe','Roscoe'],
[79,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADG-USZ-F0(0)079.png','portrait','Truffles','Truffles'],
[80,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADH-USZ-F0(0)080.png','portrait','Eugene','Eugene'],
[81,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADJ-USZ-F0(0)081.png','portrait','Eunice','Eunice'],
[82,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADK-USZ-F0(0)082.png','portrait','Goose','Goose'],
[83,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADL-USZ-F0(0)083.png','portrait','Annalisa','Annalisa'],
[84,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADM-USZ-F0(0)084.png','portrait','Benjamin','Benjamin'],
[85,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADN-USZ-F0(0)085.png','portrait','Pancetti','Pancetti'],
[86,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADP-USZ-F0(0)086.png','portrait','Chief','Chief'],
[87,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADQ-USZ-F0(0)087.png','portrait','Bunnie','Bunnie'],
[88,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADR-USZ-F0(0)088.png','portrait','Clay','Clay'],
[89,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADS-USZ-F0(0)089.png','portrait','Diana','Diana'],
[90,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADT-USZ-F0(0)090.png','portrait','Axel','Axel'],
[91,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADU-USZ-F0(0)091.png','portrait','Muffy','Muffy'],
[92,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADV-USZ-F0(0)092.png','portrait','Henry','Henry'],
[93,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADW-USZ-F0(0)093.png','portrait','Bertha','Bertha'],
[94,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADX-USZ-F0(0)094.png','portrait','Cyrano','Cyrano'],
[95,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADY-USZ-F0(0)095.png','portrait','Peanut','Peanut'],
[96,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MADZ-USZ-F0(0)096.png','portrait','Cole','Cole'],
[97,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEA-USZ-F0(0)097.png','portrait','Willow','Willow'],
[98,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEB-USZ-F0(0)098.png','portrait','Roald','Roald'],
[99,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAEC-USZ-F0(0)099.png','portrait','Molly','Molly'],
[100,'https://animal-crossing.com/amiibo/assets/img/cards/NVL-C-MAED-USZ-F0(0)100.png','portrait','Walker','Walker'],

[999,'','','']
];

//to generate in website https://animal-crossing.com/amiibo/collections/series-1-4-amiibo-cards/
/*
for(counter = 0; counter < 25; counter++)
{
    let image = document.getElementsByClassName('ember-view amiibo-card idle')[counter].getElementsByTagName('img')[0];
    let label = document.getElementsByClassName('ember-view amiibo-card idle')[counter].getElementsByClassName('controls')[0].getElementsByTagName('h3')[0];
    console.log("[" + (counter+1) + ",'" + image.src + "','portrait','" + label.innerText + "','" + label.innerText + "'],");
}
*/


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
		imgHTML.setAttribute('alt', img[1]);
		imgHTML.setAttribute('src', 'https://knneo.github.io/resources/spacer.gif');
		imgHTML.title = img[4] == "" ? img[3] : img[4];
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
	/*for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}*/
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
var scrollList = new Array();
document.getElementById("imgGallery").addEventListener("wheel", function(e) {
    e.preventDefault();
	//get relative positions of all images
	
	scrollList = new Array();
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
			posDelta = position/2;
			break;
		}
		if(e.wheelDelta > 0 && position <= -0.5*window.innerWidth)
		{
			posDelta = position/2;
			break;
		}
	}
	//optimise scroll
	//console.log(e.wheelDelta);
	if ((e.wheelDelta < 5 || e.wheelDelta > -5) && Math.floor(Math.random()*10)>0) return;
	if(e.wheelDelta > 50 || e.wheelDelta < -50) return;
	//scroll
	//console.log(posDelta);
	document.getElementsByClassName('profile-category')[0].scrollLeft += + posDelta;
	//console.log(document.getElementsByClassName('profile-category')[0].scrollLeft);
	return;
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
	if(document.getElementById('description') != null) document.getElementById('description').remove();
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
	let images = document.getElementsByClassName('profile-box');
	let selected = images[Math.floor(Math.random()*images.length)];
	selected.scrollIntoView();
	if(viewer.style.display == 'block') openImageInViewer(selected.getElementsByTagName('img')[0]);
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