//To add gallery:
// Copy and fill in image-gallery-data, rename file to end with \'-data\'
// Fill in links variable in image-gallery.js
// Tada!


//--REINITIALISE SETTINGS--//
enableViewer = false; //images smaller than screen will not resize up
enableOrientation = true; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = window.innerWidth <= 640; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = true; //removes shadows and borders in images
enableDarkMode = true; //no button to toggle, when load always white background

//localization
pageTitle = 'ギャラリー'; //for tab, and top of page
pageCredit = '[画像提供：https://suruga-ya.com/]'; //does not hide, and will hide if empty
tagTitle = 'タグ';
selectAllTag = '全選';
defaultTag = 2; //if empty string will select all; can be string OR integer based on sorting
closeIconTitle = '閉じる';
collapseFilterIconTitle = 'フィルター崩れる';
expandFilterIconTitle = 'フィルター広げる';
orientationTitle = 'オリエンテーション';
portraitTitle = '縦向き';
landscapeTitle = '横向き';
tagRightClickTitle = '右クリックのはこれだけ選択する';
loaderTextPrefix = '読み込む画像：';

//create array based on item box info
//assumption of image url: thumbnail filename is same as image filename on clicked in page, varying dimensions
//alternate image domains: https://www.suruga-ya.jp/database/pics/game/ https://cdn.suruga-ya.jp/database/pics_light/game/
//alternate search pages: https://www.suruga-ya.com/en/category/501080317
//query string: 上坂すみれ|夏川椎菜|TrySail|麻倉もも|雨宮天|水瀬いのり|竹達彩奈|沼倉愛美|渕上舞|茅野愛衣|堀江由衣|佐藤聡美|高野麻里佳|小松未可子|立花理香|東山奈央|豊田萌絵|悠木碧|豊崎愛生|戸松遥|寿美菜子|木戸衣吹|petit milady|馬場ふみか|鬼頭明里|和氣あず未|花澤香菜|高橋李依|大久保瑠美
/*
from site: https://www.suruga-ya.jp/ and search name based on おもちゃ・ホビー category

let list = '\n';
let counter = 1;
let items = document.getElementsByClassName('item');
for(let item of items) {
    let image = item.getElementsByTagName('img')[0];
    if(image.getBoundingClientRect().width == image.getBoundingClientRect().height) list += '';
	else
	{
		let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
		if(url.includes('?')) url = url.substring(0,url.indexOf('?'));
		let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://cdn.suruga-ya.jp/database/pics_light/game/').toLowerCase();
		let tag = item.getElementsByClassName('title')[0].innerText.substring(0,item.getElementsByClassName('title')[0].innerText.indexOf('/'));
		let date = item.getElementsByClassName('release_date')[0].innerText.replace('発売日：','');
		let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
		list+= ("["+(counter++)+",'"+newurl+".jpg','"+date+"','"+tag+"','"+detail+"'],") + '\n';
	}
}

from page: 'https://www.suruga-ya.com/en/products?category=501080317&keyword='
let list = '\n';
let counter = 1;
for(let item of document.getElementsByClassName('cap_wrap')) {
    let data = JSON.parse(item.getElementsByTagName('a')[0].getAttribute('data-info'));
	let newurl = 'https://cdn.suruga-ya.jp/database/pics_light/game/' + data.id.toLowerCase() + '.jpg';
    let tag = data.name.substring(0,data.name.indexOf('/'));
    let detail = data.name.substring(data.name.indexOf('/')+1);
    list+= ("["+(counter++)+",'"+newurl+"','portrait','"+tag+"','"+detail+"'],") + '\n';
}

*/

//array containing all gallery info, tags delimiter "|"
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765931.jpg','portrait','茅野愛衣','雑誌「声優グランプリ2021年4月号」アニメイト特典ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765933.jpg','portrait','茅野愛衣','雑誌「声優グランプリ2021年4月号」特典ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736845.jpg','portrait','夏川椎菜','フォトブック「夏川椎菜、なんとなく、くだらなく。」HMV＆BOOKS特典ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679212.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2021年1月号」アニメイト特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679208.jpg','portrait','麻倉もも','上半身/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657807.jpg','portrait','麻倉もも','CD「僕だけに見える星」アニメイト特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576075.jpg','portrait','夏川椎菜','横型・全身・膝立ち・衣装白・左向き/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576076.jpg','portrait','夏川椎菜','横型・バストアップ・衣装紫・両手曲げ/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589429.jpg','portrait','夏川椎菜','CD「アンチテーゼ」アニメイト特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589441.jpg','portrait','雨宮天 ','CD「Paint it，BLUE」アニメイト特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548881.jpg','portrait','高橋李依','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548875.jpg','portrait','悠木碧','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548879.jpg','portrait','悠木碧','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548876.jpg','portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548880.jpg','portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548874.jpg','portrait','雨宮天','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565923.jpg','portrait','東山奈央','印刷サイン、メッセージ入り・2Lサイズ/CD「Special Thanks!」通常盤 アニメイト特典ブロマイド'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538102.jpg','portrait','高橋李依','雑誌「My Girl vol.30」アニメイト特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538100.jpg','portrait','悠木碧','雑誌「My Girl vol.30」アニメイト特典ブロマイド'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538101.jpg','portrait','東山奈央','雑誌「My Girl vol.30」アニメイト特典ブロマイド'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538099.jpg','portrait','雨宮天','雑誌「My Girl vol.30」アニメイト特典ブロマイド'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522955.jpg','portrait','雨宮天','雑誌「声優グランプリ2020年8月号」アニメイト限定特典ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg511118.jpg','portrait','Pyxis','豊田萌絵/雑誌「月刊ドラゴンエイジ 2020年 7月号増刊 ヤングドラゴンエイジ Vol.3」ゲーマーズ特典ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533718.jpg','portrait','水瀬いのり','上半身・衣装黒・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533717.jpg','portrait','水瀬いのり','全身・座り・衣装オレンジ・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533716.jpg','portrait','水瀬いのり','バストアップ・衣装白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533713.jpg','portrait','水瀬いのり','バストアップ・衣装オレンジ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533714.jpg','portrait','水瀬いのり','全身・しゃがみ・衣装白・青/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533715.jpg','portrait','水瀬いのり','膝上・衣装白・水色・左手上げ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg540831.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「STYLE」アニメイト特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506894.jpg','portrait','水瀬いのり','バストアップ・衣装白・両手重ね/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506897.jpg','portrait','水瀬いのり','レアカード/顔アップ・衣装白・両手顔/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506896.jpg','portrait','水瀬いのり','上半身・衣装オレンジ・左手上げ/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506892.jpg','portrait','水瀬いのり','横型・全身・衣装オレンジ/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506893.jpg','portrait','水瀬いのり','バストアップ・衣装黒・左向き/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg506895.jpg','portrait','水瀬いのり','上半身・衣装オレンジ・右手頬/「Inori Minase LIVE TOUR 2020 We Are Now」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg518235.jpg','portrait','麻倉もも','雑誌「B.L.T. VOICE GIRLS Vol.42」先着購入者特典 アニメイト/ゲーマーズ Ver.'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg597730.jpg','portrait','渕上舞','印刷サイン・メッセージ入り/CD「Crossing Road」アニメイト特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589453.jpg','portrait','麻倉もも','CD「Agapanthus」アニメイト特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589463.jpg','portrait','麻倉もも','CD「Agapanthus」ANIPLEX+特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427050.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・左手胸・背景赤/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427051.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・体右向き・背景黒/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427053.jpg','portrait','上坂すみれ','上半身・衣装オレンジ・飲み物/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463258.jpg','portrait','上坂すみれ','バストアップ・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463264.jpg','portrait','上坂すみれ','上半身・衣装ピンク・両手胸・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427052.jpg','portrait','上坂すみれ','横型・バストアップ・衣装青.黒・両手頬/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463265.jpg','portrait','上坂すみれ','上半身・衣装ピンク・右手人差し指顎・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463270.jpg','portrait','上坂すみれ','全身・衣装青.白.赤・両手ハサミ・背景オレンジ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463266.jpg','portrait','上坂すみれ','膝上・衣装ピンク・左手頬・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463257.jpg','portrait','上坂すみれ','バストアップ・衣装白・右向き・背景青/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463272.jpg','portrait','上坂すみれ','全身・座り・衣装黒.青.白・両手交差/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463263.jpg','portrait','上坂すみれ','膝上・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463259.jpg','portrait','上坂すみれ','バストアップ・衣装赤茶・左手壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463276.jpg','portrait','上坂すみれ','バストアップ・衣装黒・両手前・体傾け/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463269.jpg','portrait','上坂すみれ','全身・座り・衣装青・右手膝上・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463261.jpg','portrait','上坂すみれ','全身・座り・衣装赤茶・壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463262.jpg','portrait','上坂すみれ','膝上・衣装赤・両手弓・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463268.jpg','portrait','上坂すみれ','膝上・衣装青.白・右手扇子・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463273.jpg','portrait','上坂すみれ','膝上・衣装黒.青.白・両手重ね・右向き/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463260.jpg','portrait','上坂すみれ','バストアップ・背景赤茶・左手胸・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463267.jpg','portrait','上坂すみれ','膝上・衣装青.白・右手傘・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423548.jpg','portrait','花澤香菜','花澤香菜写真集「How to go?」先着購入特典 アニメイト/書泉グランデ/書泉ブックタワー/芳林堂書店高田馬場店 Ver.'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423549.jpg','portrait','花澤香菜','花澤香菜写真集「How to go?」先着購入特典 ゲーマーズ Ver.'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400372.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」とらのあな特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400371.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」ゲーマーズ特典ブロマイド'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400370.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」アニメイト特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg394963.jpg','portrait','TrySail','集合(3人)/雑誌「声優アニメディア 2020年4月号」アニメイト・ゲーマーズ・とらのあな特典ブロマイド'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397639.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」ゲーマーズ特典ブロマイド'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397651.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り・2Lサイズ/CD「Desire Again」きゃにめ特典ブロマイド'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351934.jpg','portrait','水瀬いのり','雑誌「声優グランプリ 2020年 3月号」とらのあな・HMV特典ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352076.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」HMV特典ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352074.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」とらのあな特典ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361093.jpg','portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」アニメイト特典ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346544.jpg','portrait','鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328178.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」ゲーマーズ特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328186.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」ANIPLEX+特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328179.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」とらのあな特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328177.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」アニメイト特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328029.jpg','portrait','上坂すみれ','KGサイズ(ポストカードサイズ)/CD「NEO PROPAGANDA」Neowing特典ポートレート'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328020.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」アニメイト特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328023.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」ゲーマーズ特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329048.jpg','portrait','悠木碧','CD「Unbreakable」とらのあな特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329037.jpg','portrait','雨宮天','CD「PARADOX」ゲーマーズ特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329047.jpg','portrait','雨宮天','CD「PARADOX」Amazon.co.jp特典ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329038.jpg','portrait','雨宮天','CD「PARADOX」とらのあな特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329036.jpg','portrait','雨宮天','CD「PARADOX」アニメイト特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328019.jpg','portrait','petit milady','雑誌「月刊ドラゴンエイジ 2020年1月号増刊 ヤングドラゴンエイジ VOL.1」アニメイト特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326614.jpg','portrait','竹達彩奈','全身・衣装白・左手曲げ・右手スカート・顔左向き・背景オレンジ/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットB'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326610.jpg','portrait','竹達彩奈','横型・バストアップ・衣装黒・白・チェック柄・右手上げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326609.jpg','portrait','竹達彩奈','全身・衣装黒・白・チェック柄・体左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326612.jpg','portrait','竹達彩奈','横型・顔アップ・衣装白・右手口元・左向き・背景白/「竹達彩奈 LIVE HOUSE TOUR 2019『A』-Analyze-/-Another-」ブロマイドセットB'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326611.jpg','portrait','竹達彩奈','横型・全身・座り・衣装黒・白・チェック柄・右手曲げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326608.jpg','portrait','竹達彩奈','横型・バストアップ・衣装黒・右手曲げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg302867.jpg','portrait','上坂すみれ','写真集「すみれいろ」先着購入特典 ゲーマーズ Ver.'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg302866.jpg','portrait','上坂すみれ','写真集「すみれいろ」先着購入特典 アニメイト/書泉グランデ/書泉ブックタワー/芳林堂書店高田馬場店 Ver.'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg302868.jpg','portrait','上坂すみれ','写真集「すみれいろ」先着購入特典 セブンネットショッピング Ver.'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/bg382714.jpg','portrait','TrySail','集合(3人)/Blu-ray・DVD「TrySail Live Tour 2019 ”The TrySail Odyssey”」とらのあな特典ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg281426.jpg','portrait','戸松遥','CD「Resolution」アニメイト特典ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg277138.jpg','portrait','竹達彩奈','DVD・BD「LIVE HOUSE TOUR 2019「A」」AR動画付きL判ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284086.jpg','portrait','雨宮天','CD「Regeneration」ゲーマーズ特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368087.jpg','portrait','和氣あず未','背景黒/「少女☆歌劇 レヴュースタァライト 3rdスタァライブ”Starry Diamond”」ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368085.jpg','portrait','和氣あず未','全身/「少女☆歌劇 レヴュースタァライト 3rdスタァライブ”Starry Diamond”」ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg290722.jpg','portrait','水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」アニメイト特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg290724.jpg','portrait','水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」ゲーマーズ特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241522.jpg','portrait','上坂すみれ','バストアップ・衣装白・Tシャツ・左手頬杖・体傾け・室内/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241519.jpg','portrait','上坂すみれ','バストアップ・衣装白・Tシャツ・右手頬杖・左手机・室内/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241534.jpg','portrait','上坂すみれ','バストアップ・衣装白・ワンピース・右手左肩・正面・背景白/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241538.jpg','portrait','上坂すみれ','膝上・衣装白・ワンピース・左手頬・右手下・背景白/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241526.jpg','portrait','上坂すみれ','全身・衣装紺・うさぎ耳・左指頬・右足広げ・背景白/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241531.jpg','portrait','上坂すみれ','上半身・衣装白・赤・黒・左向き・左手頬・背景グレー/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241525.jpg','portrait','上坂すみれ','膝上・衣装紺・うさぎ耳・左向き・左手上げ・背景白/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241533.jpg','portrait','上坂すみれ','全身・衣装白・赤・黒・両手下・首傾げ・背景グレー/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241536.jpg','portrait','上坂すみれ','バストアップ・衣装白・ワンピース・右向き・右手顎・屋外/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241530.jpg','portrait','上坂すみれ','バストアップ・衣装白・赤・黒・両手首元・正面・背景グレー/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg241521.jpg','portrait','上坂すみれ','膝上・衣装白・Tシャツ・椅子座り・左手口元・室内/「2019 AUTUMN」上坂すみれ ブロマイドセット 第15弾'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg321001.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/Blu-ray「上坂すみれのノーフューチャーダイアリー2019 LIVE Blu-ray」ゲーマーズ特典ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229672.jpg','portrait','夏川椎菜','CD「Ep01」Amazon特典ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229661.jpg','portrait','夏川椎菜','CD「Ep01」アニメイト特典ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208489.jpg','portrait','麻倉もも','CD「ユメシンデレラ」ゲーマーズ特典ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208498.jpg','portrait','麻倉もも','横型・バストアップ・目線右/写真集「ただいま、おかえり」・CD「ユメシンデレラ」アニメイト連動購入キャンペーン特典ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208488.jpg','portrait','麻倉もも','CD「ユメシンデレラ」アニメイト特典ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208499.jpg','portrait','麻倉もも','バストアップ・クッション抱きしめ・体左向き/写真集「ただいま、おかえり」・CD「ユメシンデレラ」アニメイト連動購入キャンペーン特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208492.jpg','portrait','麻倉もも','CD「ユメシンデレラ」TOWER RECORDS特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg239660.jpg','portrait','麻倉もも','A5サイズ/写真集「ただいま、おかえり」HMV・Loppi特典大判フォトカード'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg215034.jpg','portrait','TrySail','集合(3人)/横型/BD「TrySail Music Video Collection 2015-2019」 雑誌「声優グランプリplus femme vol.1」アニメイト連動購入特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg342092.jpg','portrait','TrySail','集合(3人)/DVD・BD「TrySail Music Video Collection 2015-2019」アニメイト特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg342098.jpg','portrait','TrySail','集合(3人)/「『The TrySail Odyssey』ツアー完走記念フェアサーキット」関連商品購入特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg215025.jpg','portrait','TrySail','集合(3人)/雑誌「声優グランプリplus femme vol.1」アニメイト特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg145368.jpg','portrait','堀江由衣','CD「文学少女の歌集」アニメイト特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189339.jpg','portrait','雨宮天','CD「VIPER」ゲーマーズ特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189340.jpg','portrait','雨宮天','CD「VIPER」とらのあな特典ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189338.jpg','portrait','雨宮天','CD「VIPER」アニメイト特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189344.jpg','portrait','雨宮天','CD「VIPER」TSUTAYA特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg150909.jpg','portrait','水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase MUSIC CLIP BOX」ゲーマーズ特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg152303.jpg','portrait','水瀬いのり','Blu-ray「Inori Minase MUSIC CLIP BOX」(KIXM-379)初回特典特製トレカ'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg150907.jpg','portrait','水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase MUSIC CLIP BOX」アニメイト特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139973.jpg','portrait','水瀬いのり','上半身・衣装紫/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」生写真 Aセット'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139971.jpg','portrait','水瀬いのり','上半身・衣装赤・両手にりんご/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」生写真 Aセット'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139972.jpg','portrait','水瀬いのり','上半身・右向き・衣装緑・右手電話/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」生写真 Aセット'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139980.jpg','portrait','水瀬いのり','衣装紫/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139979.jpg','portrait','水瀬いのり','衣装緑/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139982.jpg','portrait','水瀬いのり','衣装青/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139981.jpg','portrait','水瀬いのり','衣装黄色/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139984.jpg','portrait','水瀬いのり','レアカード/衣装赤/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg139983.jpg','portrait','水瀬いのり','衣装オレンジ/「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」グッズ購入特典 水瀬いのり 特製トレカ『MINACA』'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326606.jpg','portrait','竹達彩奈','横型・印刷サイン・メッセージ入り・バストアップ・衣装白・黒・左手曲げ・背景赤・「新宿ReNY」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 東京公演ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg125972.jpg','portrait','悠木碧','印刷サイン入り/CD「ボイスサンプル」ゲーマーズ特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg125973.jpg','portrait','悠木碧','印刷サイン入り/CD「ボイスサンプル」とらのあな特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg439103.jpg','portrait','Pyxis','豊田萌絵・伊藤美来/CD「恋せよみんな、ハイ」ソフマップ特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326604.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・全身・衣装黒・白・右手壁・左足上げ・左向き・「Hiroshima CAVE-BE」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 広島公演ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg131828.jpg','portrait','竹達彩奈','全身・座り・衣装白・黒・腕組み/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg131822.jpg','portrait','竹達彩奈','バストアップ・衣装白・両手髪/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットA'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg131826.jpg','portrait','竹達彩奈','横型・衣装白・黒・両手下げ/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg131829.jpg','portrait','竹達彩奈','横型・顔アップ・衣装白・黒・体右向き/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg131827.jpg','portrait','竹達彩奈','膝上・座り・衣装白・黒・両手下げ/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189008.jpg','portrait','戸松遥','コミックスCD「DELUXE DELUXE HAPPY」アニメイト特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189009.jpg','portrait','戸松遥','コミックスCD「DELUXE DELUXE HAPPY」ゲーマーズ特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109025.jpg','portrait','麻倉もも','CD「スマッシュ・ドロップ」とらのあな特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109024.jpg','portrait','麻倉もも','CD「スマッシュ・ドロップ」ゲーマーズ特典ブロマイド'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109023.jpg','portrait','麻倉もも','CD「スマッシュ・ドロップ」アニメイト特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg151515.jpg','portrait','麻倉もも','横型・膝上・背景水色・印刷サイン・メッセージ入り/CD「スマッシュ・ドロップ」ゲーマーズガラポン抽選会参加賞ブロマイド'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605580.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」特典ブロマイド'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605562.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605550.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605538.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605540.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605565.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605577.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605539.jpg','portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605533.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605536.jpg','portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605543.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605547.jpg','portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605557.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605581.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605570.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605568.jpg','portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605548.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605531.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605564.jpg','portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062401.jpg','portrait','上坂すみれ','雑誌「B.L.T. VOICE GIRLS Vol.38」アニメイト特典生写真'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg056096.jpg','portrait','夏川椎菜','CD「ログライン」ゲーマーズ特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg056095.jpg','portrait','夏川椎菜','CD「ログライン」アニメイト特典ブロマイド'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg043017.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「ボン キュッ ボンは彼のもの」Amazon特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg043020.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「ボン キュッ ボンは彼のもの」ゲーマーズ特典ブロマイド'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg043025.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「ボン キュッ ボンは彼のもの」とらのあな特典ブロマイド'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg043016.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「ボン キュッ ボンは彼のもの」アニメイト特典ブロマイド'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589426.jpg','portrait','夏川椎菜','CD「ログライン」発売記念ミュージアム AKIHABARAゲーマーズ本店会場限定ガラポン抽選会参加賞 ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189336.jpg','portrait','夏川椎菜','横型・バストアップ・衣装白・首かしげ・背景グレー/CD「ログライン」発売記念 アニメイト渋谷・秋葉原本館店頭抽選会参加賞ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg705095.jpg','portrait','竹達彩奈','印刷サイン入り・印刷メッセージ入り/竹達彩奈オフィシャルモバイルファンクラブ「あやな公国」建国2周年記念イベント グッズ付き配信シングル「Rice COMEnication」会場限定購入特典ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062395.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2019年5月号」アニメイト特典ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031054.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」ゲーマーズ特典ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062397.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2019年5月号」ゲーマーズ特典ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031056.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」TOWER RECORDS特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031052.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」アニメイト特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031057.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」HMV特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031060.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」新星堂・WonderGOO特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031053.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」キンクリ堂特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062396.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2019年5月号」とらのあな特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031055.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」とらのあな特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031059.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」TSUTAYA特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/bg062398.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2019年5月号」アニメガ・TSUTAYA特典ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/bg031057.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」HMV特典ブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062399.jpg','portrait','東山奈央','雑誌「声優グランプリ 2019年5月号」ゲーマーズ特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031015.jpg','portrait','上坂すみれ','雑誌「Pick-up Voice 2019年5月号 vol.134」公式オンラインストア(EMTG STORE)特典フォト'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109021.jpg','portrait','雨宮天','雨宮天ミュージアム in アニメイト渋谷2019 “The Animate SKY” 応援店舗 「オリジナルブロマイド」プレゼントキャンペーン'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326602.jpg','portrait','竹達彩奈','横型・上半身・衣装紺・白・ストライプ・帽子・左手顔・左向き・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットB'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326597.jpg','portrait','竹達彩奈','膝上・衣装茶色・赤・帽子・座り・左向き・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットA'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326601.jpg','portrait','竹達彩奈','上半身・衣装白・赤・帽子・右手壁・首傾げ・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットB'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg326599.jpg','portrait','竹達彩奈','横型・上半身・衣装黒・ベージュ・右手胸元・首傾げ・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットA'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg087791.jpg','portrait','petit milady','悠木碧・竹達彩奈/ライブフォト・横型・膝上・衣装白・黒・ピンク・右手人差し指立て/petit milady 5th LIVE「Howling!!」抽選会特典オリジナル絵柄 トレーディングL判ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg087787.jpg','portrait','petit milady','悠木碧・竹達彩奈/膝上・衣装黒・赤・帽子・背景黒/petit milady 5th LIVE「Howling!!」抽選会特典オリジナル絵柄 トレーディングL判ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg087784.jpg','portrait','petit milady','悠木碧・竹達彩奈/全身・衣装黒・赤・帽子・竹達座り・ドラム・背景赤/petit milady 5th LIVE「Howling!!」抽選会特典オリジナル絵柄 トレーディングL判ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg087790.jpg','portrait','petit milady','悠木碧・竹達彩奈/ライブフォト・横型・膝上・衣装白・黒・ピンク・右手上げ・左手マイク/petit milady 5th LIVE「Howling!!」抽選会特典オリジナル絵柄 トレーディングL判ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg087782.jpg','portrait','petit milady','悠木碧・竹達彩奈/全身・衣装青・赤・黒・チェック柄・悠木座り/petit milady 5th LIVE「Howling!!」抽選会特典オリジナル絵柄 トレーディングL判ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/g3997189.jpg','portrait','悠木碧','2Lサイズ/写真集「あやかし」アニメイト秋葉原特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/g3997190.jpg','portrait','悠木碧','A4サイズ/写真集「あやかし」ゲーマーズ特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/g3996332.jpg','portrait','TrySail','集合(3人)/CD「TryAgain」ANIPLEX+特典ブロマイド'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/g3996324.jpg','portrait','TrySail','集合(3人)/CD「TryAgain」アニメイト特典ブロマイド'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/g3982212.jpg','portrait','豊田萌絵','雑誌「声優グランプリNEXT Girls Vol.3」ゲーマーズ特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3982187.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「アイ」TSUTAYA特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg042355.jpg','portrait','立花理香','横型・バストアップ・衣装ピンク・両手帽子・背景白/CD「カラフルパサージュ」立花理香 2nd LIVE ～colorful mixer～開催記念スペシャルセット会場購入特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975826.jpg','portrait','立花理香','CD「カラフルパサージュ」とらのあな特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975823.jpg','portrait','立花理香','CD「カラフルパサージュ」ゲーマーズ特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975824.jpg','portrait','立花理香','CD「カラフルパサージュ」アニメイト特典ブロマイド'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109022.jpg','portrait','麻倉もも','CD「365×LOVE」発売記念 アニメイト店頭抽選会D賞 オリジナルブロマイド'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975831.jpg','portrait','麻倉もも','CD「365×LOVE」アニメイト特典ブロマイド'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034292.jpg','portrait','上坂すみれ','膝上・座り・衣装白・ウサ耳・右手くまのぬいぐるみ・左手髪・顔右傾け・背景水色/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034300.jpg','portrait','上坂すみれ','全身・座り・衣装白・ピンク・両手パー・合わせ・箱の中・両足伸ばし・体右向き/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034295.jpg','portrait','上坂すみれ','全身・座り・衣装ピンク・猫耳・フード被り・両手ベッド・顔右向き/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034299.jpg','portrait','上坂すみれ','上半身・衣装オレンジ・紫・体右向き・背景水色・ピンク/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034293.jpg','portrait','上坂すみれ','上半身・衣装白・ウサ耳・帽子・右手ドア・左手パー・人差し指唇・背景水色・ピンク/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034282.jpg','portrait','上坂すみれ','上半身・衣装白・左手上げ・体右向き・背景茶/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034298.jpg','portrait','上坂すみれ','上半身・座り・衣装黄・チェック柄・ネズミ耳・右手ナイフ・左手フォーク・顔右向き・背景緑/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034291.jpg','portrait','上坂すみれ','バストアップ・衣装ピンク・白・左手頬・背景白/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034288.jpg','portrait','上坂すみれ','上半身・衣装ピンク・白・右手手首・左手曲げ・背景白/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034290.jpg','portrait','上坂すみれ','膝上・衣装ピンク・白・両手合わせ・体左向き・後ろドア/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034296.jpg','portrait','上坂すみれ','膝上・衣装黄・ボーダー柄・両手曲げ・体右向き・背景白/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034285.jpg','portrait','上坂すみれ','バストアップ・衣装白・両手植物/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034308.jpg','portrait','上坂すみれ','膝上・衣装ピンク・体左向き・背景水色/「上坂すみれのノーフューチャーダイアリー2019」生写真セットB'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034287.jpg','portrait','上坂すみれ','膝上・衣装ピンク・白・両手合わせ・首元・背景白/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034286.jpg','portrait','上坂すみれ','膝上・座り・衣装ピンク・白・体右向き・背景白/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg034281.jpg','portrait','上坂すみれ','膝上・衣装白・右手植物・左手棒・顔右向き・背景グレー/「上坂すみれのノーフューチャーダイアリー2019」ブロマイドセット 第14弾'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/g3967519.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・2Lサイズ/CD「Innocent Notes」ゲーマーズ特典ブロマイド'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3967522.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」TOWER RECORDS特典ブロマイド'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3967524.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」とらのあな特典ブロマイド'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3967514.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」アニメイト特典ブロマイド'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3967525.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」Neowing特典ブロマイド'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3969559.jpg','portrait','竹達彩奈','CD「Innocent Notes」初回封入特典 竹達彩奈×三田製麺所 コラボカード'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg023633.jpg','portrait','竹達彩奈','膝上・衣装水色・両手髪/「竹達彩奈×富士急ハイランド『あやちハイランド』」アトラクションラリー特典 オリジナルブロマイドカード'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg023634.jpg','portrait','竹達彩奈','膝上・衣装水色・左手曲げ・観覧車/「竹達彩奈×富士急ハイランド『あやちハイランド』」アトラクションラリー特典 オリジナルブロマイドカード'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964212.jpg','portrait','水瀬いのり','雑誌「別冊CD＆DLでーた My Girl vol.26 “VOICE ACTRESS EDITION”」アニメイト特典ブロマイド'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964213.jpg','portrait','水瀬いのり','雑誌「別冊CD＆DLでーた My Girl vol.26 “VOICE ACTRESS EDITION”」ゲーマーズ特典ブロマイド'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964156.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」TSUTAYA特典ブロマイド'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964154.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」Neowing特典ブロマイド'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3966924.jpg','portrait','水瀬いのり','(KICM-1914)/CD「Wonder Caravan!」初回封入特典特製トレカ'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964152.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」アニメガ・文教堂特典ブロマイド'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964153.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」HMV特典ブロマイド'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964149.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」キンクリ堂特典ブロマイド'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964151.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」TOWER RECORDS特典ブロマイド'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964150.jpg','portrait','水瀬いのり','CD「Wonder Caravan!」とらのあな特典ブロマイド'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/g3944914.jpg','portrait','雨宮天','CD「Defiance」とらのあな特典ブロマイド'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/g3944912.jpg','portrait','雨宮天','CD「Defiance」アニメイト特典ブロマイド'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/g3944917.jpg','portrait','雨宮天','CD「Defiance」HMV特典ブロマイド'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/g3944920.jpg','portrait','雨宮天','CD「Defiance」ANIPLEX+特典ブロマイド'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/g3944913.jpg','portrait','雨宮天','CD「Defiance」ゲーマーズ特典ブロマイド'],



];
