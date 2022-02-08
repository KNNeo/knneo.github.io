//--NOTES--//
//Filenames of images to be in the format of <tag>_<tag>_...jpg
//Thumbnails filenames to start with "thumbnail_"
//--VARIABLES--//
let presetWidths = [160, 320, 480]; // small, medium, large; subject to alignment of columns
let minColumns = 3;			  // minimum columns to show thumbnails, will override minWidth
let enableDarkMode = true;	  // displays dark mode toggle
let isDarkMode = true;		  // initial value if enableDarkMode is false, ignored if enableDarkMode is true
let folderName = 'file://C:/Users/KAINENG/OneDrive/Pictures/DOAX-VenusVacation/Bromides/';
let buttonArray = true;		  // displays tag array based on underscore separated filename eg. image_item.jpg has 2 tags: image, item
let debugMode = false;		  // shows console log values on render
let mosaicArray = 
['いたずらキューピッド_マリー・ローズ.jpg','いなば_ルナ.jpg','うすかわたけのこ_あやね.jpg','うすかわたけのこ_みさき.jpg','うすかわたけのこ_エレナ.jpg','うすかわたけのこ_マリー・ローズ.jpg','うすかわたけのこ_ルナ.jpg','おせちのあさり_ヒトミ.jpg','おつまみシュリンプ_あやね.jpg','おつまみシュリンプ_みさき.jpg','おつまみシュリンプ_パティ.jpg','おつまみシュリンプ_フィオナ.jpg','おつまみピンチョス_なぎさ.jpg','おつまみピンチョス_みさき.jpg','おつまみピンチョス_みさき_覚醒.jpg','おつまみピンチョス_カンナ.jpg','おつまみピンチョス_フィオナ.jpg','おまつりきんぎょ_こころ.jpg','おまつりきんぎょ_カンナ.jpg','おまつりきんぎょ_フィオナ.jpg','くつろぎニット_あやね.jpg','くつろぎニット_かすみ.jpg','けごん_如天狗.jpg','けごん_如天狗_覚醒.jpg','こもれびハミング_こころ.jpg','こもれびハミング_みさき.jpg','こもれびハミング_みさき_覚醒.jpg','こもれびハミング_フィオナ.jpg','こもれびハミング_モニカ.jpg','しらゆきのあさり_こころ.jpg','しろほおずき_かすみ.jpg','すずかぜロマンチカ_かすみ.jpg','すずかぜロマンチカ_さゆり.jpg','すずかぜロマンチカ_なぎさ.jpg','すずかぜロマンチカ_ロベリア.jpg','せとか_こころ.jpg','せとか_こころ_覚醒.jpg','そよかぜのロンド_ヒトミ.jpg','そよかぜのロンド_マリー・ローズ.jpg','そよかぜロンド_カンナ.jpg','たまゆら花火_みさき.jpg','たんけん用サイクルウェア_ルナ.jpg','ぬくもりマフラー_こころ.jpg','のりまき_レイファン.jpg','はいからブルーマー_フィオナ.jpg','はいからブルーマー_紅葉.jpg','はいからブロッサム_カンナ.jpg','はいからブロッサム_紅葉.jpg','はいからプロッザム_フィオナ.jpg','はじけるチャップス_つくし.jpg','はじけるチャップス_ほのか.jpg','ひので_紅葉.jpg','ひので_紅葉_覚醒.jpg','ふわもこフォーム_フィオナ.jpg','ふわもこフォーム_如天狗.jpg','ふわものフォーム_ほのか.jpg','ほしぞらきんぎょ_マリー・ローズ.jpg','ほしぞらきんぎょ_如天狗.jpg','ほほえみ日和_さゆり.jpg','ほやほやエプロン_マリー・ローズ.jpg','まじかるヴィーナス_こころ.jpg','もふもふクマちゃん_なぎさ.jpg','もふもふクマちゃん_ヒトミ.jpg','やわらかエンジンTシャツ_ほのか.jpg','ゆうづきのあさり_紅葉.jpg','ゆるふわパーカー_ほのか.jpg','ゆるふわパーカー_フィオナ.jpg','ゆるふわパーカー_如天狗.jpg','ゆるふわパーカー_紅葉.jpg','よむ・オフィスウエア_さゆり.jpg','よむ・オフィスウエア_つくし.jpg','よむ・オフィスウエア_ななみ.jpg','よむ・オフィスウエア_ほのか.jpg','アクア・キャビア_かすみ.jpg','アクア・キャビア_みさき.jpg','アクア・キャビア_ヒトミ.jpg','アルマス・キャビア_ほのか.jpg','ウィズ・ユー_マリー・ローズ.jpg','ウィズ・ユー_モニカ.jpg','エンシェントオアシス_フィオナ.jpg','エンドルフィン・スカイ_みさき.jpg','エンドルフィン・ハート_パティ.jpg','カラフルウイット_ヒトミ.jpg','カラフルウイット_レイファン.jpg','キャンディーポップ_ヒトミ.jpg','クリムゾン・フェザー_あやね.jpg','ゲットシー_あやね.jpg','コード・ルージュ_エレナ.jpg','コード・ルージュ_パティ.jpg','サンセットフィッシュ_なぎさ.jpg','サンセットフィッシュ_エレナ.jpg','サンセットフィッシュ_ヒトミ.jpg','サンセットフィッシュ_レイファン.jpg','シクレット・レポート_エレナ.jpg','シクレット・レポート_ロベリア.jpg','シノマス水着・春花_エレナ.jpg','シノマス水着・雲雀_ほのか.jpg','シャドウイリス_あやね.jpg','シャノワール_なぎさ.jpg','シャルトリュー_エレナ.jpg','シルバーソーン・リーフ_なぎさ.jpg','シークレットクラス_たまき.jpg','シークレットクラス_なぎさ.jpg','シークレットクラス_モニカ.jpg','スイートスポット_フィオナ.jpg','スイートビターベリー_マリー・ローズ.jpg','スイート・シュコラティエ_マリー・ローズ.jpg','スネグールか_ルナ.jpg','スパークリングブルー_ななみ.jpg','スパークリングブルー_ヒトミ.jpg','スマイルポップ_ほのか.jpg','ゼラニウム_かすみ.jpg','ソレイユクーシャン_エレナ.jpg','ソレイユクーシャン_ルナ.jpg','ダークプリズン_みさき.jpg','テルライトリズム_エレナ.jpg','ディア・コンチェルト_エレナ.jpg','デルフィニウム_ほのか.jpg','デルフィニウム_ほのか_覚醒.jpg','トワイライトフィッシュ_こころ.jpg','トワイライトフィッシュ_マリー・ローズ.jpg','ネイキッドサマー_かすみ.jpg','ネイキッドサマー_こころ.jpg','ネイキッドサマー_こころ_覚醒.jpg','ネイキッドサマー_フィオナ.jpg','ネモフィラ_かすみ.jpg','ネモフィラ_かすみ_覚醒.jpg','ノエル・シャルマン_モニカ.jpg','ハッピーエッグ_ほのか.jpg','ハーフセイル_こころ.jpg','ハーフセイル_如天狗.jpg','パステルスイート_つくし.jpg','パステルスイート_ルナ.jpg','パピヨンダンス_あやね.jpg','パラレルライン_紅葉.jpg','ピュア・コンチェルト_フィオナ.jpg','ピンキー・プラム_パティ.jpg','ピンキー・プラム_レイファン.jpg','ピーチシロップ_ほのか.jpg','フィルギャ_あやね.jpg','フィルギャ_あやね_覚醒.jpg','フォー・ユー_ほのか.jpg','フォー・ユー_エレナ.jpg','フォー・ユー_ヒトミ.jpg','フレーズノエル_あやね.jpg','フレーズノエル_フィオナ.jpg','フレーズノエル_マリー・ローズ.jpg','フレーズノエル_紅葉.jpg','ブルーハワイ_こころ.jpg','ブロッサム・フェザー_かすみ.jpg','ブロッサム・フェザー_みさき.jpg','プラチナ・スターパーカー_みさき.jpg','プラチナ・フィズ_エレナ.jpg','プラチナ・フィズ_エレナ_覚醒.jpg','プラチナ・リープラ_ヒトミ.jpg','プルミエ・ランデブー_ルナ.jpg','プルミエ・ランデブー_紅葉.jpg','プレイスユアベット_モニカ.jpg','プレミア・ナイト_パティ.jpg','ベルベットタイム・ローズ_さゆり.jpg','ベルベットタイム・ローズ_ほのか.jpg','ベルベットタイム・ローズ_エレナ.jpg','ホライズン_ほのか.jpg','ホーリースノウ_なぎさ.jpg','ホーリースノウ_ほのか.jpg','ホーリースノウ_ヒトミ.jpg','ホーリースノウ_フィオナ.jpg','ホーリースノウ_レイファン.jpg','ホーリースノウ_如天狗.jpg','マルガリータ_かすみ.jpg','ミスティック・フォレスト_ルナ.jpg','ミステー・リリー_あやね.jpg','ミステー・リリー_つくし.jpg','ミヌエット_マリー・ローズ.jpg','ミヌエット_マリー・ローズ_覚醒.jpg','ミルキー・プラム_みさき.jpg','メヂィカル・エックス_ほのか.jpg','メルテー・ハート_こころ.jpg','メルテー・ハート_フィオナ.jpg','メルテー・ハート_マリー・ローズ.jpg','モーモーデニム_ほのか.jpg','ラビットショーカー_かすみ.jpg','ラビットジョーカー_如天狗.jpg','リコリス・リーフ_如天狗.jpg','リナライトプリズム_たまき.jpg','リベルテ_エレナ.jpg','リープラ_ヒトミ.jpg','リープラ_ヒトミ_覚醒.jpg','ルミナス・プリュム_あやね.jpg','ルミネイトチュープ_たまき.jpg','ルミネス・ベル_ヒトミ.jpg','ルミネス・ベル_フィオナ.jpg','レイズザセイル_ほのか.jpg','レイズザセイル_みさき.jpg','レイズザセイル_エレナ.jpg','レイズザセイル_ヒトミ.jpg','レイズザセイル_フィオナ.jpg','レイズザセイル_レイファン.jpg','レイニーフロッグ_みさき.jpg','レイニーフロッグ_ヒトミ.jpg','レッド・キャビア_如天狗.jpg','ロイヤル・リーフ_エレナ.jpg','ロゼライトプリズム_紅葉.jpg','ロゼライトプリズム_紅葉_覚醒.jpg','ローズホイップ_マリー・ローズ.jpg','ワイルドウインド_なぎさ.jpg','ワイルドウインド_パティ.jpg','ワイルドウインド_マリー・ローズ.jpg','ワンダーランド_ルナ.jpg','ヴァイオレットフィズ_エレナ.jpg','ヴァイオレットフィズ_エレナ_覚醒.jpg','ヴィーナス・ケージ_かすみ.jpg','ヴィーナス・ヴァルキリー_ほのか.jpg','ヴィーナス・ヴァルキリー_レイファン.jpg','天使のほほえみ_ほのか.jpg','小悪魔のささやき_マリー・ローズ.jpg','巫女舞_みさき.jpg','巫女舞_ヒトミ.jpg','巫女舞_ルナ.jpg','幻燈朱雀_みさき.jpg','幻燈黒竜_たまき.jpg','幻燈黒竜_如天狗.jpg','恋色いろは_紅葉.jpg','恋風天舞・緋_あやね.jpg','振袖・墨彩_なぎさ.jpg','振袖・山瑠璃_たまき.jpg','振袖・桃吹雪_こころ.jpg','振袖・綾目蝶_あやね.jpg','振袖・綾錦_紅葉.jpg','振袖・花浅葱_かすみ.jpg','振袖・薔薇舞_マリー・ローズ.jpg','旗袍・玄武_エレナ.jpg','旗袍・玄武_ルナ.jpg','旗袍・白虎_こころ.jpg','旗袍・白虎_ほのか.jpg','旗袍・白虎_みさき.jpg','旗袍・青龍_たまき.jpg','旗袍・青龍_マリー・ローズ.jpg','星砂のスリットワンピ_こころ.jpg','星砂のスリットワンピ_つくし.jpg','星砂のスリットワンピ_ほのか.jpg','星砂のスリットワンピ_みさき.jpg','星砂のスリットワンピ_カンナ.jpg','星砂のスリットワンピ_ヒトミ.jpg','春彩のスクールウェア_あやね.jpg','春彩のスクールウェア_なぎさ.jpg','春彩のスクールウェア_カンナ.jpg','月影_たまき.jpg','月影_ななみ.jpg','来光神楽_かすみ.jpg','来光神楽_レイファン.jpg','桃宴桜舞_あやね.jpg','桃宴桜舞_こころ.jpg','桃宴桜舞_たまき.jpg','桃宴桜舞_なぎさ.jpg','桃宴桜舞_ほのか.jpg','桃宴桜舞_みさき.jpg','桃宴桜舞_ヒトミ.jpg','桃宴桜舞_フィオナ.jpg','桃宴桜舞_マリー・ローズ.jpg','桃宴桜舞_ルナ.jpg','桃宴桜舞_ロベリア.jpg','永遠のクラテル_ヒトミ.jpg','深紅のスリットワンピ_たまき.jpg','深紅のスリットワンピ_エレナ.jpg','深紅のスリットワンピ_レイファン.jpg','瑞雲の千早_カンナ.jpg','秋麗のスクールウェア_こころ.jpg','秋麗のスクールウェア_つくし.jpg','秋麗のスクールウェア_みさき.jpg','秋麗のスクールウェア_パティ.jpg','秋麗のスクールウェア_フィオナ.jpg','秋麗のスクールウェア_ルナ.jpg','空色のスリットワンピ_あやね.jpg','空色のスリットワンピ_かすみ.jpg','空色のスリットワンピ_さゆり.jpg','空色のスリットワンピ_フィオナ.jpg','空色のスリットワンピ_ロベリア.jpg','空色のスリットワンピ_紅葉.jpg','純白のスリットワンピ_かすみ.jpg','純白のスリットワンピ_たまき.jpg','純白のスリットワンピ_たまき_覚醒.jpg','純白のスリットワンピ_なぎさ.jpg','純白のスリットワンピ_ななみ.jpg','純白のスリットワンピ_みさき.jpg','純白のスリットワンピ_みさき_覚醒.jpg','純白のスリットワンピ_エレナ.jpg','純白のスリットワンピ_パティ.jpg','純白のスリットワンピ_マリー・ローズ.jpg','藍孔雀_たまき.jpg','黒炎のラビリンス_つくし.jpg','黒炎のラビリンス_ほのか.jpg'
]; //list of filenames with extension
//--SYSTEM VARIABLES: DO NOT EDIT--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);

function startup() {
	initializeVariables();
	generateLayout();
	generateMosaic();
	document.getElementById('mosaic').addEventListener('scroll', onScroll);
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

function onScroll() {
	let main = document.getElementById('main');
	let mosaic = document.getElementById('mosaic');
	let threshold = 300;
	
	main.style.display = mosaic.scrollTop > threshold ? 'none' : '';
	mosaic.style.height = mosaic.scrollTop > threshold ? window.innerHeight + 'px' : (window.innerHeight - 300) + 'px';
}

function togglePreset() {
	switch(this.innerText)
	{	
	  case 'photo_size_select_actual':
		document.getElementById('preset').innerText = 'photo_size_select_small';
		window['thumbWidth'] = presetWidths[0];
		break
	  case 'photo_size_select_small':
		document.getElementById('preset').innerText = 'photo_size_select_large';
		window['thumbWidth'] = presetWidths[1];
		break;
	  case 'photo_size_select_large':
		document.getElementById('preset').innerText = 'photo_size_select_actual';
		window['thumbWidth'] = presetWidths[2];
		break;
	  default:
		break;
	}
	
	window['preset'] = document.getElementById('preset').innerText;
	
	let grid = generateGrid();		
	document.getElementById('mosaic').innerHTML = '';
	document.getElementById('mosaic').appendChild(grid);
	
	generateMosaic();	
}

function initializeVariables() {
	if(!window['searchCriteria']) window['searchCriteria'] = '';
	if(!window['excluded']) window['excluded'] = [];
	if(!window['preset']) window['preset'] = 'photo_size_select_small';
	if(!window['thumbWidth']) window['thumbWidth'] = presetWidths[0];
}

function generateLayout() {
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
	description.innerText = 'サムネをタップすると拡大画像が表示されます';
	
	let disclaimer = document.createElement('h6');
	disclaimer.innerHTML += '<div>Powered by <a href="https://masonry.desandro.com/">Masonry JS</a></div>';
	disclaimer.innerHTML += '<div>©コーエーテクモゲームス All rights reserved.</div>';
	
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
		window['searchCriteria'] = document.getElementById('search').value;
		
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
			if(window['searchCriteria'].includes(this.value)) {
				window['searchCriteria'] = window['searchCriteria'].replace('|' + this.value,'').replace(this.value,'');
				if(window['searchCriteria'].startsWith('|')) window['searchCriteria'] = window['searchCriteria'].substring(1);
				this.style.border = '';
				this.style.color = '';
			}
			else {
				window['searchCriteria'] += (window['searchCriteria'].length > 0 ? '|' : '') + this.value;
				this.style.border = '1px solid gray';
				this.style.color = 'gray';
			}
			document.getElementById('search').value = window['searchCriteria'];
			
			let grid = generateGrid();		
			document.getElementById('mosaic').innerHTML = '';
			document.getElementById('mosaic').appendChild(grid);
			
			generateMosaic();
		});
		tag.addEventListener('contextmenu',function() {
			event.preventDefault();
			window['searchCriteria'] = this.value;
			
			document.getElementById('search').value = window['searchCriteria'];
			
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
		darkmode.style.padding = '0 5px';
		darkmode.classList.add('material-icons');
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		settings.appendChild(darkmode);		
	}
	
	if(presetWidths && presetWidths.length == 3)
	{
		let preset = document.createElement('a');
		preset.id = 'preset';
		preset.style.padding = '0 5px';
		preset.classList.add('material-icons');
		preset.href = 'javascript:void(0);';
		preset.innerText = window['preset'];
		preset.addEventListener('click', togglePreset);
		settings.appendChild(preset);
	}

	let back = document.createElement('a');
	back.style.padding = '0 5px';
	back.style.verticalAlign = 'top';
	back.href = '../index.html';
	back.innerText = 'Back';
	settings.appendChild(back);
	
	
	mainTableRow3Cell1.appendChild(settings);
	
	let counter = document.createElement('h6');
	let count = document.createElement('span');
	count.id = 'counter';
	count.innerText = 0;
	counter.appendChild(count);
	
	let suffix = document.createElement('span');
	suffix.innerText = ' 画像';
	counter.appendChild(suffix);
	
	mainTableRow3Cell1.appendChild(counter);
	
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
	if(debugMode) console.log(buttonArray);
}

function generateLayoutJukebox() {
	let bodyTableJukeboxCell = document.createElement('td');
	// bodyTableJukeboxCell.classList.add('jukebox-cell');

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
	
	let searchArray = window['searchCriteria'].split('|');
	let excludeArray = window['excluded'];
	if(debugMode) console.log(searchArray);
	let filterArray = mosaicArray
	.filter(m => (window['searchCriteria'].length == 0 || 
	searchArray.filter(s => m.includes(s)).length == searchArray.length) && 
	!excludeArray.includes(m))
	.sort(function(a,b) {
		return a.localeCompare(b, 'ja');
	});
	
	let thumbnailSize = calculateThumbnailSize();
	if(debugMode) console.log('thumbnailSize', thumbnailSize);
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
		gridImage.id = imageUrl;
		gridImage.tabIndex = 0;
		gridImage.classList.add('grid-image');
		gridImage.title = imageUrl.replace('.jpg','');
		gridImage.style.width = thumbnailSize + 'px';
		gridImage.style.height = (thumbnailSize*9/16) + 'px';
		gridImage.style.backgroundSize = gridImage.style.width;
		gridImage.addEventListener('mouseover',function() {
			this.style.backgroundSize = (1.2*this.offsetWidth) + 'px';
		});
		gridImage.addEventListener('mouseout',function() {
			this.style.backgroundSize = this.offsetWidth + 'px';
		});
		gridImage.addEventListener('click', function() {
			openViewer(this);
		});
		gridImage.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			exclude(this);
			return false;
		}, false);
		let fullImageUrl = addUrlClause(folderName + (window['preset'] == 'small' ? 'thumbnail_' : '') + imageUrl);
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

	return grid;
}

function calculateThumbnailSize() {		
	let screenWidth = window.innerWidth - 15;
	let minThreshold = window['thumbWidth'];
	let maxThreshold = screenWidth;
	
	let columns = 0;
	let remainder = screenWidth;
	while(remainder > window['thumbWidth'])
	{
		remainder -= window['thumbWidth'];
		columns++;
		if(debugMode) console.log('remainder', remainder);
		if(debugMode) console.log('columns', columns);
	}

	let defaultRemainder = 20;
	if(columns < minColumns)
	{
		return screenWidth / minColumns;
	}
	if(remainder > defaultRemainder)
	{
		window['thumbWidth'] = window['thumbWidth'] + 1;
		return calculateThumbnailSize();
	}
	
	if(debugMode) console.log('calculateThumbnailSize', window['thumbWidth']);
	return window['thumbWidth'];
}

function addUrlClause(url) {
	return "url('" + url + "')";
}

function removeUrlClause(property) {
	return property.replace('url("','').replace('")','');
}

function exclude(image) {
	if(!window['excluded'].includes(image.id))
		window['excluded'].push(image.id);

	if(debugMode) console.log('exclude', window['excluded']);
	let grid = generateGrid();		
	document.getElementById('mosaic').innerHTML = '';
	document.getElementById('mosaic').appendChild(grid);
		
	generateMosaic();
}

var msnry;
function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		document.getElementById('counter').innerText = mosaic.getElementsByClassName('grid-image').length;
		
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
	// let linkable = document.createElement('a');
	// linkable.tabIndex = 1000;
	// linkable.href = 'javascript:void(0);';
	let img = document.createElement('img');
	img.id = thumbnail.id;
	// img.classList = thumbnail.classList;
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
	// linkable.appendChild(img);
	viewer.appendChild(img);
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
	img.addEventListener('click', closeViewer);
	
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