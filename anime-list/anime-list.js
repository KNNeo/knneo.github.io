//[1] array containing all gallery info
let customArray = [
{ sortOrder: 0, year: 0, type: '', title: '', altTitle: '', handle: '', imgURL: '' },
{ sortOrder: 1, year: 2008, type: 'Anime', title: 'BLEACH', altTitle: 'ブリーチー',
handle: '', imgURL: '' },
{ sortOrder: 2, year: 2008, type: 'Anime', title: 'Love Hina', altTitle: 'ラブ　ひな', 
handle: '', imgURL: '' },
{ sortOrder: 3, year: 2008, type: 'Anime', title: 'Kekkaishi', altTitle: '結界師', 
handle: '', imgURL: '' },
{ sortOrder: 4, year: 2008, type: 'Anime', title: 'Toradora!', altTitle: 'とらドラ！', 
handle: '', imgURL: '' },
{ sortOrder: 5, year: 2008, type: 'Anime', title: 'Kuroshitsuji', altTitle: '黒執事', 
handle: '', imgURL: '' },
{ sortOrder: 6, year: 2019, type: 'Anime', title: 'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:  '理系が恋に落ちたので証明してみた。', 
handle: 'rikeigakoini',
imgURL: 'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg' },
{ sortOrder: 999, year: 0, type: '', title: '', altTitle: '', handle: '', imgURL: '' }
];

//[2] generate labels
let labelArray = new Array();
for(let label of customArray)
{
	if(label.year == 0) continue;
	if(labelArray.indexOf(label.year) > -1) continue;
	else labelArray.push(label.year);
}
labelArray.sort();

//[3] generate HTML based on array
renderGallery(customArray);
function renderGallery(array) {
	for(let entry of array)
	{
		if(entry.title == '') continue;
		
		let animeLine = document.createElement('DIV');
		animeLine.classList.add('anime-line');
		
		let animeTitle = document.createElement('DIV');
		animeTitle.classList.add('anime-title');
		animeTitle.innerText = entry.title;
		animeLine.appendChild(animeTitle);
		
		let animeDetailsBox = document.createElement('DIV');
		animeDetailsBox.classList.add('anime-details-box');
		
		let animeAltTitle = document.createElement('DIV');
		animeAltTitle.innerText = entry.altTitle;
		animeDetailsBox.appendChild(animeAltTitle);
		
		let animeAlt2Title = document.createElement('DIV');
		animeAlt2Title.innerText = '"Science Fell in Love, So I Tried to Prove It"';
		animeDetailsBox.appendChild(animeAlt2Title);
		
		if(entry.handle != '' && entry.imgURL != '')
		{
			let animeImgBox = document.createElement('DIV');
			animeImgBox.classList.add('anime-img-box');
			
			let animeImgLink = document.createElement('A');
			animeImgLink.href = 'https://www.teitter.com/' + entry.handle;
			animeImgLink.target = '_blank';
			
			let animeImg = document.createElement('IMG');
			animeImg.title = '@' + entry.handle;
			animeImg.src = 'https://knneo.github.io/resources/spacer.gif';
			animeImg.alt = entry.imgURL;
			animeImgLink.appendChild(animeImg);
			animeImgBox.appendChild(animeImgLink);
			animeDetailsBox.appendChild(animeImgBox);
		}
		
		let animeGenre = document.createElement('DIV');
		animeGenre.innerText = 'Romance Comedy';
		animeDetailsBox.appendChild(animeGenre);
		
		let animeDescription = document.createElement('DIV');
		animeDescription.innerText = 'Comeddy';
		animeDetailsBox.appendChild(animeDescription);
		
		let animeLabels = document.createElement('DIV');
		animeLabels.classList.add('anime-labels');
		let animeLabelSpan = document.createElement('SPAN');
		animeLabelSpan.innerText = '#funny';
		animeLabels.appendChild(animeLabelSpan);
		animeDetailsBox.appendChild(animeLabels);
		
		animeLine.appendChild(animeDetailsBox);
		
		document.getElementById('new-anime-list').appendChild(animeLine);
	}
}

//[4] after adjustments
//switch source for onload
for (var image of document.getElementsByTagName("img"))
{
 image.src = image.alt;
 image.alt = "";
}
//error eventListener
var animeImgList = document.getElementsByTagName("img");
for (var i = 0; i < animeImgList.length; i++)
{
animeImgList[i].addEventListener("error", function() { this.onerror=null; this.src='https://knneo.github.io/resources/spacer.gif'; this.style.border = '0px white solid'; this.style.backgroundColor = 'transparent'; });
}

//expand to see details
var animeLineList = document.getElementsByClassName("anime-line");
for (var j = 0; j < animeLineList.length - 1; j++)
{
	animeLineList[j].addEventListener("click", function() { 
		document.getElementsByClassName("anime-details-box")[j].style.display = "block";
		document.getElementsByClassName("anime-details-box")[j].style.fontSize = "small";
		animeLineList[j].style.fontSize = "1em";
	} );

	document.getElementsByClassName("anime-details-box")[j].addEventListener("dblclick", function() { 
		document.getElementsByClassName("anime-details-box")[j].style.display = "none";
		animeLineList[j].style.fontSize = "";
	});
}

//allow collapse of years and expand when clicked
var animeYearList = document.getElementsByClassName("year-display");
for (var i = 0; i < animeYearList.length; i++)
{
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = i == animeYearList.length - 1 ? '400px' : 0;
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.visibility= i == animeYearList.length - 1 ? 'visible' : 'collapse';
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.transition = 'max-height 0.5s ease-in-out';
animeYearList[i].addEventListener("click", function() {
//close all
for(var openList of document.getElementsByClassName("anime-year")) {openList.style.maxHeight = 0; openList.style.visibility = 'collapse'; }
//open one
this.parentElement.getElementsByClassName("anime-year")[0].style.visibility = 'visible';
this.parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = '400px';
});
}