//--VARIABLES--//
let minWidth = 160;
let enableDarkMode = false;	// displays dark mode toggle
let isDarkMode = true;		// initial value if enableDarkMode is false, ignored if enableDarkMode is true
let folderName = 'file://C:/Users/KAINENG/OneDrive/Pictures/DOAX-VenusVacation/Bromides/';
let buttonArray = true;
let mosaicArray = 
['うすかわたけのこ（あやね）.jpg','うすかわたけのこ（ルナ）.jpg','おせちのあさり（ヒトミ）.jpg','おつまみシュリンプ（あやね）.jpg','おつまみシュリンプ（パティ）.jpg','おつまみシュリンプ（フィオナ）.jpg','おまつりきんぎょ（こころ）.jpg','くつろぎニット（あやね）.jpg','こもれびハミング（モニカ）.jpg','すずかぜロマンチカ（さゆり）.jpg','すずかぜロマンチカ（ロベリア）.jpg','そよかぜのロンド（マリー・ローズ）.jpg','そよかぜロンド（カンナ）.jpg','たまゆら花火（みさき）.jpg','ぬくもりマフラー（こころ）.jpg','のりまき（レイファン）.jpg','はいからブルーマー（紅葉）.jpg','はいからプロッザム（フィオナ）.jpg','はじけるチャップス（つくし）.jpg','はじけるチャップス（ほのか）.jpg','ふわものフォーム（ほのか）.jpg','ほしぞらきんぎょ（如天狗）.jpg','まじかるヴィーナス（こころ）.jpg','ゆるふわパーカー（ほのか）.jpg','ゆるふわパーカー（フィオナ）.jpg','アクア・キャビア（かすみ）.jpg','アクア・キャビア（ヒトミ）.jpg','エンドルフィン・スカイ（みさき）.jpg','エンドルフィン・ハート（パティ）.jpg','コード・ルージュ（パティ）.jpg','サンセットフィッシュ（なぎさ）.jpg','サンセットフィッシュ（ヒトミ）.jpg','サンセットフィッシュ（レイファン）.jpg','シクレット・レポート（エレナ）.jpg','シクレット・レポート（ロベリア）.jpg','シャノワール（なぎさ）.jpg','シークレットクラス（たまき）.jpg','シークレットクラス（なぎさ）.jpg','シークレットクラス（モニカ）.jpg','スイートスポット（フィオナ）.jpg','スイートビターベリー（マリー・ローズ）.jpg','スネグールか（ルナ）.jpg','スパークリングブルー（ななみ）.jpg','スパークリングブルー（ヒトミ）.jpg','スマイルポップ（ほのか）.jpg','ソレイユクーシャン（エレナ）.jpg','ソレイユクーシャン（ルナ）.jpg','ダークプリズン（みさき）.jpg','トワイライトフィッシュ（こころ）.jpg','トワイライトフィッシュ（マリー・ローズ）.jpg','ネイキッドサマー（フィオナ）.jpg','ノエル・シャルマン（モニカ）.jpg','パステルスイート（つくし）.jpg','パステルスイート（ルナ）.jpg','ピュア・コンチェルト（フィオナ）.jpg','ピンキー・プラム（パティ）.jpg','プラチナ・スターパーカー（みさき）.jpg','プラチナ・リープラ（ヒトミ）.jpg','プルミエ・ランデブー（ルナ）.jpg','プルミエ・ランデブー（紅葉）.jpg','プレミア・ナイト（パティ）.jpg','ベルベットタイム・ローズ（ほのか）.jpg','ベルベットタイム・ローズ（エレナ）.jpg','ホライズン（ほのか）.jpg','ミスティック・フォレスト（ルナ）.jpg','ミステー・リリー（あやね）.jpg','ミステー・リリー（つくし）.jpg','メヂィカル・エックス（ほのか）.jpg','ラビットショーカー（かすみ）.jpg','リナライトプリズム（たまき）.jpg','レイズザセイル（みさき）.jpg','レイズザセイル（エレナ）.jpg','レイズザセイル（ヒトミ）.jpg','レイズザセイル（フィオナ）.jpg','レイズザセイル（レイファン）.jpg','レイニーフロッグ（みさき）.jpg','ロゼライトプリズム（紅葉）.jpg','ワイルドウインド（パティ）.jpg','ワイルドウインド（マリー・ローズ）.jpg','ヴィーナス・ケージ（かすみ）.jpg','巫女舞（みさき）.jpg','巫女舞（ヒトミ）.jpg','幻燈朱雀（みさき）.jpg','恋風天舞・緋（あやね）.jpg','振袖・墨彩（なぎさ）.jpg','旗袍・青龍（たまき）.jpg','星砂のスリットワンピ（こころ）.jpg','星砂のスリットワンピ（つくし）.jpg','星砂のスリットワンピ（ほのか）.jpg','星砂のスリットワンピ（みさき）.jpg','星砂のスリットワンピ（カンナ）.jpg','星砂のスリットワンピ（ヒトミ）.jpg','春彩のスクールウェア（あやね）.jpg','春彩のスクールウェア（カンナ）.jpg','桃宴桜舞（こころ）.jpg','桃宴桜舞（なぎさ）.jpg','桃宴桜舞（ほのか）.jpg','桃宴桜舞（みさき）.jpg','桃宴桜舞（フィオナ）.jpg','桃宴桜舞（マリー・ローズ）.jpg','桃宴桜舞（ロベリア）.jpg','永遠のクラテル（ヒトミ）.jpg','深紅のスリットワンピ（たまき）.jpg','深紅のスリットワンピ（エレナ）.jpg','深紅のスリットワンピ（レイファン）.jpg','秋麗のスクールウェア（こころ）.jpg','秋麗のスクールウェア（つくし）.jpg','秋麗のスクールウェア（みさき）.jpg','秋麗のスクールウェア（パティ）.jpg','秋麗のスクールウェア（フィオナ）.jpg','秋麗のスクールウェア（ルナ）.jpg','空色のスリットワンピ（あやね）.jpg','空色のスリットワンピ（かすみ）.jpg','空色のスリットワンピ（さゆり）.jpg','空色のスリットワンピ（ロベリア）.jpg','純白のスリットワンピ（たまき）.jpg','純白のスリットワンピ（たまき）（覚醒）.jpg','純白のスリットワンピ（なぎさ）.jpg','純白のスリットワンピ（パティ）.jpg','純白のスリットワンピ（マリー・ローズ）.jpg','黒炎のラビリンス（つくし）.jpg','黒炎のラビリンス（ほのか）.jpg'];

//--SYSTEM VARIABLES: DO NOT EDIT--//
let isWidescreen = false;
let searchCriteria = '';
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
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
	title.innerText = 'Image Collage';
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
	.replace(/.jpg/g,'')
	.replace(/）/g,'（')
	.replace(/ /g,'')
	.split('（')
	.reduce(function(total, current, index, array) {
		let updated = total;
		if(total.filter(a => a.value == current).length > 0) {
			let nonUpdated = total.filter(a => a.value == current)[0];
			let oldCount = nonUpdated.count;
			
			updated = total.filter(a => a.value != current);
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
	console.log(searchArray);
	for(let item of mosaicArray
	.filter(m => searchCriteria == '' || searchArray.filter(s => m.includes(s)).length == searchArray.length)
	.sort(function(a,b) {
		return a.localeCompare(b, 'ja');
	})) {
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
		let fullImageUrl = addUrlClause((folderName + imageUrl)).replace('.jpg','_thumbnail.jpg');
		gridImage.style.backgroundImage = fullImageUrl || 'https://knneo.github.io/resources/spacer.gif';
		
		//pre-loading
		let preload = new Image();
		preload.src = folderName + imageUrl;
		preloads.push(preload);
		
		gridItem.appendChild(gridImage);
		grid.appendChild(gridItem);		
	}
	console.log('screenWidth',screenWidth);
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
	return url.replace('_thumbnail','');
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