//--NOTES--//
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnails filenames to start with "thumbnail_"
//--VARIABLES--//
let minWidth = 160;
let enableDarkMode = false;	// displays dark mode toggle
let isDarkMode = true;		// initial value if enableDarkMode is false, ignored if enableDarkMode is true
let folderName = 'file://C:/Users/KAINENG/OneDrive/Pictures/DOAX-VenusVacation/Bromides/';
let buttonArray = true;
let mosaicArray = 
['うすかわたけのこ_あやね.jpg','うすかわたけのこ_ルナ.jpg','おせちのあさり_ヒトミ.jpg','おつまみシュリンプ_あやね.jpg','おつまみシュリンプ_パティ.jpg','おつまみシュリンプ_フィオナ.jpg','おまつりきんぎょ_こころ.jpg','くつろぎニット_あやね.jpg','こもれびハミング_モニカ.jpg','すずかぜロマンチカ_さゆり.jpg','すずかぜロマンチカ_ロベリア.jpg','そよかぜのロンド_マリー・ローズ.jpg','そよかぜロンド_カンナ.jpg','たまゆら花火_みさき.jpg','ぬくもりマフラー_こころ.jpg','のりまき_レイファン.jpg','はいからブルーマー_紅葉.jpg','はいからプロッザム_フィオナ.jpg','はじけるチャップス_つくし.jpg','はじけるチャップス_ほのか.jpg','ふわものフォーム_ほのか.jpg','ほしぞらきんぎょ_如天狗.jpg','まじかるヴィーナス_こころ.jpg','ゆるふわパーカー_ほのか.jpg','ゆるふわパーカー_フィオナ.jpg','アクア・キャビア_かすみ.jpg','アクア・キャビア_ヒトミ.jpg','エンドルフィン・スカイ_みさき.jpg','エンドルフィン・ハート_パティ.jpg','コード・ルージュ_パティ.jpg','サンセットフィッシュ_なぎさ.jpg','サンセットフィッシュ_ヒトミ.jpg','サンセットフィッシュ_レイファン.jpg','シクレット・レポート_エレナ.jpg','シクレット・レポート_ロベリア.jpg','シャノワール_なぎさ.jpg','シークレットクラス_たまき.jpg','シークレットクラス_なぎさ.jpg','シークレットクラス_モニカ.jpg','スイートスポット_フィオナ.jpg','スイートビターベリー_マリー・ローズ.jpg','スネグールか_ルナ.jpg','スパークリングブルー_ななみ.jpg','スパークリングブルー_ヒトミ.jpg','スマイルポップ_ほのか.jpg','ソレイユクーシャン_エレナ.jpg','ソレイユクーシャン_ルナ.jpg','ダークプリズン_みさき.jpg','トワイライトフィッシュ_こころ.jpg','トワイライトフィッシュ_マリー・ローズ.jpg','ネイキッドサマー_フィオナ.jpg','ノエル・シャルマン_モニカ.jpg','パステルスイート_つくし.jpg','パステルスイート_ルナ.jpg','ピュア・コンチェルト_フィオナ.jpg','ピンキー・プラム_パティ.jpg','プラチナ・スターパーカー_みさき.jpg','プラチナ・リープラ_ヒトミ.jpg','プルミエ・ランデブー_ルナ.jpg','プルミエ・ランデブー_紅葉.jpg','プレミア・ナイト_パティ.jpg','ベルベットタイム・ローズ_ほのか.jpg','ベルベットタイム・ローズ_エレナ.jpg','ホライズン_ほのか.jpg','ミスティック・フォレスト_ルナ.jpg','ミステー・リリー_あやね.jpg','ミステー・リリー_つくし.jpg','メヂィカル・エックス_ほのか.jpg','ラビットショーカー_かすみ.jpg','リナライトプリズム_たまき.jpg','レイズザセイル_みさき.jpg','レイズザセイル_エレナ.jpg','レイズザセイル_ヒトミ.jpg','レイズザセイル_フィオナ.jpg','レイズザセイル_レイファン.jpg','レイニーフロッグ_みさき.jpg','ロゼライトプリズム_紅葉.jpg','ワイルドウインド_パティ.jpg','ワイルドウインド_マリー・ローズ.jpg','ヴィーナス・ケージ_かすみ.jpg','巫女舞_みさき.jpg','巫女舞_ヒトミ.jpg','幻燈朱雀_みさき.jpg','恋風天舞・緋_あやね.jpg','振袖・墨彩_なぎさ.jpg','旗袍・青龍_たまき.jpg','星砂のスリットワンピ_こころ.jpg','星砂のスリットワンピ_つくし.jpg','星砂のスリットワンピ_ほのか.jpg','星砂のスリットワンピ_みさき.jpg','星砂のスリットワンピ_カンナ.jpg','星砂のスリットワンピ_ヒトミ.jpg','春彩のスクールウェア_あやね.jpg','春彩のスクールウェア_カンナ.jpg','桃宴桜舞_こころ.jpg','桃宴桜舞_なぎさ.jpg','桃宴桜舞_ほのか.jpg','桃宴桜舞_みさき.jpg','桃宴桜舞_フィオナ.jpg','桃宴桜舞_マリー・ローズ.jpg','桃宴桜舞_ロベリア.jpg','永遠のクラテル_ヒトミ.jpg','深紅のスリットワンピ_たまき.jpg','深紅のスリットワンピ_エレナ.jpg','深紅のスリットワンピ_レイファン.jpg','秋麗のスクールウェア_こころ.jpg','秋麗のスクールウェア_つくし.jpg','秋麗のスクールウェア_みさき.jpg','秋麗のスクールウェア_パティ.jpg','秋麗のスクールウェア_フィオナ.jpg','秋麗のスクールウェア_ルナ.jpg','空色のスリットワンピ_あやね.jpg','空色のスリットワンピ_かすみ.jpg','空色のスリットワンピ_さゆり.jpg','空色のスリットワンピ_ロベリア.jpg','純白のスリットワンピ_たまき.jpg','純白のスリットワンピ_たまき_覚醒.jpg','純白のスリットワンピ_なぎさ.jpg','純白のスリットワンピ_パティ.jpg','純白のスリットワンピ_マリー・ローズ.jpg','黒炎のラビリンス_つくし.jpg','黒炎のラビリンス_ほのか.jpg'];
//--SYSTEM VARIABLES: DO NOT EDIT--//
let isWidescreen = false;
let searchCriteria = '';
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
	searchCriteria = '';
	generateLayout();
	generateMosaic();
	if(!enableDarkMode) {
		if(isDarkMode) {
			document.getElementsByTagName('html')[0].classList.add('darked');
		}
		else {
			document.getElementsByTagName('html')[0].classList.remove('darked');
		}
	}
	if(enableDarkMode && document.getElementById('darkmode') != null) {
		isDarkMode = document.getElementsByTagName('html')[0].classList.contains('darked');
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
		document.getElementById('darkmode').addEventListener('click', function() { isDarkMode = !isDarkMode; });
		document.getElementById('darkmode').addEventListener('click', startup);
	}
}

function generateLayout() {
	isWidescreen = window.innerWidth > 800;
	document.body.innerHTML = '';
	generateViewer();
	generateVerticalLayout();
	
}

function generateViewer() {
	
	let viewer = document.createElement('div');
	viewer.id = 'viewer';
	//viewer.addEventListener('click', closeViewer);
	viewer.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		return false;
	}, false);		
	viewer.addEventListener('keyup', function(e) {
		if (event.keyCode === 37 && document.getElementById('viewer-prev') != null) {
			document.getElementById('viewer-prev').click();
		}
		if (event.keyCode === 39 && document.getElementById('viewer-next') != null) {
			document.getElementById('viewer-next').click();
		}
		return false;
	}, false);
	
	document.body.appendChild(viewer);
}

function generateVerticalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	bodyTableRow1.appendChild(generateLayoutPlayer());
	
	let bodyTableRow2 = document.createElement('tr');
	bodyTableRow2.appendChild(generateLayoutJukebox());
	
	bodyTableBody.appendChild(bodyTableRow1);
	bodyTableBody.appendChild(bodyTableRow2);
	
	bodyTable.appendChild(bodyTableBody);
	document.body.appendChild(bodyTable);
}

function generateLayoutPlayer() {
	let bodyTablePlayerCell = document.createElement('td');
	bodyTablePlayerCell.classList.add('jukebox-cell');
	bodyTablePlayerCell.style.width = '100%';
	bodyTablePlayerCell.style.verticalAlign = 'baseline';
	bodyTablePlayerCell.style.textAlign = 'center';
	
	let main = document.createElement('div');
	main.id = 'main';
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-cell');
	
	let title = document.createElement('h1');
	title.classList.add('title');
	title.innerText = 'Image Collage';
	title.addEventListener('click', startup);
	// title.onclick = startup;
	// title.style.cursor = 'pointer';
	
	let description = document.createElement('h5');
	description.innerText = 'Click on thumbnail to see larger image';
	
	let disclaimer = document.createElement('h6');
	disclaimer.innerText += 'Powered by Masonry JS';
	disclaimer.innerText += '\n©コーエーテクモゲームス All rights reserved.';
	
	mainTableRow1Cell1.appendChild(title);
	mainTableRow1Cell1.appendChild(description);
	mainTableRow1Cell1.appendChild(disclaimer);
	
	let mainTableRow2 = document.createElement('tr');
	
	let mainTableRow2Cell1 = document.createElement('td');
	mainTableRow2Cell1.classList.add('jukebox-cell');
	
	let search = document.createElement('input');
	search.id = 'search';
	search.style.height = '20px';
	search.addEventListener('input',function() {
		searchCriteria += document.getElementById('search').value;
		
		let grid = generateGrid();		
		document.getElementById('mosaic').innerHTML = '';
		document.getElementById('mosaic').appendChild(grid);
		
		generateMosaic();
	});
	mainTableRow2Cell1.appendChild(search);
	
	let tags = document.createElement('div');
	tags.classList.add('tags');
	if(isMobile()) {
		tags.style.width = '100vw';
		tags.style.overflowX = 'auto';
		tags.style.whiteSpace = 'nowrap';
	}
	else {
		tags.style.maxHeight = '2em';
		tags.style.overflowY = 'auto';
	}
	
	generateButtonArrayIfEmpty();
	
	for(let button of buttonArray) {
		if(button == '') continue;
		let tag = document.createElement('button');
		tag.classList.add('tag');
		tag.value = button;
		tag.innerText = button;
		tag.addEventListener('click',function() {
			if(searchCriteria.includes(this.value)) {
				searchCriteria = searchCriteria.replace('|' + this.value,'').replace(this.value,'');
				if(searchCriteria.startsWith('|')) searchCriteria = searchCriteria.substring(1);
				this.style.border = '';
				this.style.color = '';
			}
			else {
				searchCriteria += (searchCriteria.length > 0 ? '|' : '') + this.value;
				this.style.border = '1px solid gray';
				this.style.color = 'gray';
			}
			document.getElementById('search').value = searchCriteria;
			
			let grid = generateGrid();		
			document.getElementById('mosaic').innerHTML = '';
			document.getElementById('mosaic').appendChild(grid);
			
			generateMosaic();
		});
		tag.addEventListener('contextmenu',function() {
			event.preventDefault();
			searchCriteria = this.value;
			
			document.getElementById('search').value = searchCriteria;
			
			let grid = generateGrid();		
			document.getElementById('mosaic').innerHTML = '';
			document.getElementById('mosaic').appendChild(grid);
			
			generateMosaic();
		});
		tags.appendChild(tag);
	}
	
	mainTableRow2Cell1.appendChild(tags);
	
	let mainTableRow3 = document.createElement('tr');
	
	let mainTableRow3Cell1 = document.createElement('td');
	mainTableRow3Cell1.classList.add('jukebox-cell');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	if(enableDarkMode) {
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.classList.add('material-icons');
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		settings.appendChild(darkmode);		
	}

	let back = document.createElement('a');
	back.style.padding = '0 10px';
	back.style.verticalAlign = 'top';
	back.href = '../index.html';
	back.innerText = 'Back';
	settings.appendChild(back);
	
	mainTableRow3Cell1.appendChild(settings);
	
	mainTableRow1.appendChild(mainTableRow1Cell1);
	mainTableRow2.appendChild(mainTableRow2Cell1);
	mainTableRow3.appendChild(mainTableRow3Cell1);
	mainTableBody.appendChild(mainTableRow1);
	mainTableBody.appendChild(mainTableRow2);
	mainTableBody.appendChild(mainTableRow3);
	mainTable.appendChild(mainTableBody);
	main.appendChild(mainTable);
	bodyTablePlayerCell.appendChild(main);

	return bodyTablePlayerCell;	
}

function generateButtonArrayIfEmpty() {
	if(typeof buttonArray == 'boolean') {
		let val = buttonArray;
		buttonArray = [];
		if(!val) return;
	}
	if(buttonArray.length > 0)
		return;
	
	//generate tags by design
	buttonArray = mosaicArray.join('')
	.replace(/ /g,'')
	.replace(/.jpg/g,'_')
	.split('_')
	.reduce(function(total, current, index, array) {
		let updated = total;
		if(total.filter(a => a.value == current).length > 0) {
			let nonUpdated = total.filter(a => a.value == current)[0];
			let oldCount = nonUpdated.count;
			
			updated = total.filter(a => a.value.toLowerCase() != current.toLowerCase());
			updated.push({
				value: current,
				count: oldCount + 1,
			});
		}
		else {
			updated.push({
				value: current,
				count: 1,
			});
		}		
		return updated;
	},[])
	.sort(function(a,b) {
		return b.count - a.count;
	})
	.map(m => m.value);
	// console.log(buttonArray);
}

function generateLayoutJukebox() {
	let bodyTableJukeboxCell = document.createElement('td');
	bodyTableJukeboxCell.classList.add('jukebox-cell');

	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	mosaic.style.height = (window.innerHeight - 300) + 'px';

	let grid = generateGrid();
	mosaic.appendChild(grid);
	bodyTableJukeboxCell.appendChild(mosaic);

	return bodyTableJukeboxCell;
}

let preloads = [];
function generateGrid() {
	let prevValue = '';
	let grid = document.createElement('div');
	grid.classList.add('grid');	
	
	let gridSizer = document.createElement('div');
	gridSizer.classList.add('grid-sizer');
	grid.appendChild(gridSizer);
	
	let screenWidth = window.innerWidth - 15;
	let searchArray = searchCriteria.split('|');
	// console.log(searchArray);
	let filterArray = mosaicArray
	.filter(m => searchCriteria.length == 0 || searchArray.filter(s => m.includes(s)).length == searchArray.length)
	.sort(function(a,b) {
		return a.localeCompare(b, 'ja');
	});
	for(let item of filterArray) {
		let imageUrl = item;
		
		let gridItem = document.createElement('div');
		gridItem.classList.add('grid-item');
		
		if(prevValue != imageUrl[0]) {
			let overlay = document.createElement('div');
			overlay.classList.add('static-banner');
			overlay.innerText = imageUrl[0];
			gridItem.appendChild(overlay);
			prevValue = imageUrl[0];
		}
		
		let gridImage = document.createElement('div');
		gridImage.tabIndex = 0;
		gridImage.classList.add('grid-image');
		gridImage.title = imageUrl.replace('.jpg','');
		while(screenWidth > minWidth) {
			screenWidth = screenWidth - minWidth;
		}
		let defaultWidth = 160;
		if(screenWidth < 0.75*defaultWidth || screenWidth > 0.95*defaultWidth) screenWidth = defaultWidth;
		// let totalWidth = window.innerWidth % screenWidth;
		gridImage.style.width = screenWidth + 'px';
		gridImage.style.height = (screenWidth*9/16) + 'px';
		gridImage.style.backgroundSize = gridImage.style.width;
		gridImage.addEventListener('mouseover',function() {
			this.style.backgroundSize = (1.2*this.offsetWidth) + 'px';
		});
		gridImage.addEventListener('mouseout',function() {
			this.style.backgroundSize = this.offsetWidth + 'px';
		});
		let fullImageUrl = addUrlClause((folderName + 'thumbnail_' + imageUrl));
		gridImage.style.backgroundImage = fullImageUrl || 'https://knneo.github.io/resources/spacer.gif';
		
		//pre-loading: will cause animation lag
		if(preloads.length < mosaicArray.length) {
			let preload = new Image();
			preload.src = folderName + imageUrl;
			preloads.push(preload);
		}
		
		gridItem.appendChild(gridImage);
		grid.appendChild(gridItem);		
	}
	// console.log('screenWidth',screenWidth);
	return grid;
}

function addUrlClause(url) {
	return "url('" + url + "')";
}

function removeUrlClause(property) {
	return property.replace('url("','').replace('")','');
}

var msnry;
function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		let images = mosaic.getElementsByClassName('grid-image');
		for(let image of images) {
			image.addEventListener('click', function() {
				openViewer(this);
			});
		}
		
		// Generated by Mansonry JS //
		var grid = document.querySelector('.grid');
		msnry = new Masonry( grid, {
		  // options
		  itemSelector: '.grid-item',
		  percentPosition: true
		});
		
		imagesLoaded( grid ).on( 'progress', function() {
		  // layout Masonry after each image loads
		  msnry.layout();
		});
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//viewer
let imageNo = 0;
let linkedImgList = [];
function createLinkedList() {
	linkedImgList = [];
	for(let img of document.getElementsByClassName('grid-image'))
	{
		linkedImgList.push(img);
	}
}

function updateImageNo(image) {
	imageNo = 0;
	for(let img of linkedImgList)
	{
		if(img.style.backgroundImage == image.style.backgroundImage)
		{
			return imageNo;
		}
		imageNo++;
	}
	return 0;
}

function openViewer(image) {
	createLinkedList();
	document.getElementById('viewer').style.display = 'block';
	openImageInViewer(image);
}

function openImageInViewer(image) {	
	let imgNo = updateImageNo(image);
	
	let viewer = document.getElementById('viewer');
	viewer.tabIndex = 999;
	if(viewer.style.display != 'block') viewer.style.display = 'block';
	let viewerPrev = document.createElement('a');
	viewerPrev.id = 'viewer-prev';
	viewerPrev.classList.add('viewer-nav');
	let viewerNext = document.createElement('a');
	viewerNext.id = 'viewer-next';
	viewerNext.classList.add('viewer-nav');
	let thumbnail = image.cloneNode(true);
	let linkable = document.createElement('a');
	linkable.tabIndex = 1000;
	linkable.href = 'javascript:void(0);';
	let img = document.createElement('img');
	img.id = thumbnail.id;
	img.classList = thumbnail.classList;
	img.src = processImageSourceForViewer(thumbnail);
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
		document.getElementById('viewer-prev').addEventListener('click', function(e) {
			// if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo-1]);
			return false;
		}, false);
	}
	if(imgNo+1 < linkedImgList.length) {
		document.getElementById('viewer-next').addEventListener('click', function(e) {
			// if(runSlideshow != null) return;
			openImageInViewer(linkedImgList[imgNo+1]);
			return false;
		}, false);
	}
	linkable.addEventListener('click', closeViewer);
	
	adjustViewerMargin();
}

function processImageSourceForViewer(thumbnail) {	
	let url = removeUrlClause(thumbnail.style.backgroundImage);
	return url.replace('thumbnail_','');
}

function adjustViewerMargin() {
	let viewer = document.getElementById('viewer');
	if(viewer.childElementCount == 0) return;
	viewer.style.paddingTop = '0';
	let image = viewer.getElementsByTagName('img')[0];
	if(!image.complete) setTimeout(adjustViewerMargin, 200);
	viewer.style.paddingTop = (viewer.getBoundingClientRect().height - image.height)/2 + 'px';
}

function closeViewer() {
	let viewer = document.getElementById('viewer');
	viewer.style.display = 'none';
	viewer.innerHTML = '';
}