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
defaultTag = '夏川椎菜'; //if empty string will select all; can be string OR integer based on sorting
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
while(Array.from(items).filter(item => item.getElementsByClassName('condition')[0].innerText.includes('コレクションカード') ||
	item.getElementsByTagName('img')[0].getBoundingClientRect().width == item.getElementsByTagName('img')[0].getBoundingClientRect().height).length > 0) {
	for(let item of items) {
		let image = item.getElementsByTagName('img')[0];
		if(item.getElementsByClassName('condition')[0].innerText.includes('コレクションカード') ||
		image.getBoundingClientRect().width == image.getBoundingClientRect().height) {
			item.parentElement.removeChild(item);
		}
	}
	items = document.getElementsByClassName('item');
}

for(let item of items) {
	let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
	if(url.includes('?')) url = url.substring(0,url.indexOf('?'));
	let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://cdn.suruga-ya.jp/database/pics_light/game/').toLowerCase();
	let tag = item.getElementsByClassName('title')[0].innerText.substring(0,item.getElementsByClassName('title')[0].innerText.indexOf('/'));
	let date = item.getElementsByClassName('release_date')[0].innerText.replace('発売日：','');
	let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
	list+= ("["+(counter++)+",'"+newurl+".jpg','portrait','"+tag+"','"+detail+"','"+date+"'],") + '\n';
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
[0,'FILENAME','ORIENTATION','TAG','DETAIL','DATE'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765931.jpg','portrait','茅野愛衣','雑誌「声優グランプリ2021年4月号」アニメイト特典ブロマイド','2021/03/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765933.jpg','portrait','茅野愛衣','雑誌「声優グランプリ2021年4月号」特典ブロマイド','2021/03/10'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736861.jpg','portrait','TrySail','集合(3人)/Blu-ray「TrySail 5th Anniversary”Go for a Sail”STUDIO LIVE」アニメイト特典ブロマイド','2021/01/20'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736849.jpg','portrait','夏川椎菜','CD「クラクトリトルプライド」アニメイト特典ブロマイド','2021/01/06'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg781103.jpg','portrait','上坂すみれ','フォトブック「すみぺのAtoZ」ゲーマーズオンランショップ限定特典ブロマイド','2020/12/19'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736845.jpg','portrait','夏川椎菜','フォトブック「夏川椎菜、なんとなく、くだらなく。」HMV＆BOOKS特典ブロマイド','2020/12/18'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736844.jpg','portrait','夏川椎菜','フォトブック「夏川椎菜、なんとなく、くだらなく。」とらのあな特典ブロマイド','2020/12/18'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679212.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2021年1月号」アニメイト特典ブロマイド','2020/12/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679214.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2021年1月号」セブンネット、ヨドバシ.com、メロンブックス特典ブロマイド','2020/12/10'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg732192.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「Starlight Museum」Neowing特典ブロマイド','2020/12/02'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg732191.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「Starlight Museum」HMV特典ブロマイド','2020/12/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679208.jpg','portrait','麻倉もも','上半身/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679209.jpg','portrait','麻倉もも','バストアップ/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657800.jpg','portrait','麻倉もも','膝上・印刷サイン・メッセージ入り/CD「僕だけに見える星」LAWSON presents 麻倉もも Live 2020 ”Agapanthus”開催記念 会場CD即売ブース・対象期間限定アニメイト通販特典ブロマイド','2020/11/13'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657807.jpg','portrait','麻倉もも','CD「僕だけに見える星」アニメイト特典ブロマイド','2020/11/11'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657808.jpg','portrait','麻倉もも','CD「僕だけに見える星」ゲーマーズ特典ブロマイド','2020/11/11'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657804.jpg','portrait','麻倉もも','バストアップ・印刷サイン・メッセージ入り/アニメイト限定フェア「LAWSON presents 麻倉もも Live 2020 ”Agapanthus”応援フェア」特典ブロマイド','2020/11/10'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg629657.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「キミのとなりで」ゲーマーズ特典ブロマイド','2020/10/28'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg629660.jpg','portrait','鬼頭明里','CD「キミのとなりで」TOWER RECORDS特典ブロマイド','2020/10/28'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg607965.jpg','portrait','鬼頭明里','雑誌「月刊ドラゴンエイジ 2020年 10月号増刊 ヤングドラゴンエイジ Vol.4」アニメイト特典ブロマイド','2020/09/28'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg607966.jpg','portrait','鬼頭明里','雑誌「月刊ドラゴンエイジ 2020年 10月号増刊 ヤングドラゴンエイジ Vol.4」ゲーマーズ特典ブロマイド','2020/09/28'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679325.jpg','portrait','鬼頭明里','横型・上半身/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット A','2020/09/19'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679330.jpg','portrait','鬼頭明里','横型・バストアップ/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679329.jpg','portrait','鬼頭明里','横型・全身/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679328.jpg','portrait','鬼頭明里','バストアップ/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679326.jpg','portrait','鬼頭明里','膝上/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット A','2020/09/19'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576075.jpg','portrait','夏川椎菜','横型・全身・膝立ち・衣装白・左向き/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576076.jpg','portrait','夏川椎菜','横型・バストアップ・衣装紫・両手曲げ/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589441.jpg','portrait','雨宮天 ','CD「Paint it，BLUE」アニメイト特典ブロマイド','2020/09/02'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548877.jpg','portrait','高橋李依','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548881.jpg','portrait','高橋李依','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548875.jpg','portrait','悠木碧','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548879.jpg','portrait','悠木碧','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548876.jpg','portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548880.jpg','portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548874.jpg','portrait','雨宮天','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548878.jpg','portrait','雨宮天','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565930.jpg','portrait','東山奈央','印刷サイン、メッセージ入り/CD「Special Thanks!」楽天ブックス特典ブロマイド','2020/08/05'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565923.jpg','portrait','東山奈央','印刷サイン、メッセージ入り・2Lサイズ/CD「Special Thanks!」通常盤 アニメイト特典ブロマイド','2020/08/05'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538102.jpg','portrait','高橋李依','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538100.jpg','portrait','悠木碧','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538101.jpg','portrait','東山奈央','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538099.jpg','portrait','雨宮天','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg609044.jpg','portrait','高野麻里佳','高野麻里佳/印刷サイン・メッセージ入り/CD「Theory of evolution」KING e-SHOP特典ブロマイド','2020/07/22'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg753284.jpg','portrait','豊田萌絵','豊田萌絵/ライブフォト/「IDOL舞SHOWト2ndシングル発売記念トーク＆ライブ!～ドルショウ夏の陣2020～」ライブL判ブロマイド グループセット','2020/07/12'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg753301.jpg','portrait','豊田萌絵','豊田萌絵/ライブフォト・2Lサイズ/「IDOL舞SHOWト2ndシングル発売記念トーク＆ライブ!～ドルショウ夏の陣2020～」ライブ 2L ソロブロマイド','2020/07/12'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522955.jpg','portrait','雨宮天','雑誌「声優グランプリ2020年8月号」アニメイト限定特典ブロマイド','2020/07/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522957.jpg','portrait','雨宮天','雑誌「声優グランプリ2020年8月号」HMV＆BOOKS限定特典ブロマイド','2020/07/10'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg603165.jpg','portrait','雨宮天','ライブフォト/Blu-ray「雨宮天 LIVE 2020 The Clearest SKY」発売応援CP第一弾 アニメイトチェーンWEB抽選企画 参加賞ブロマイド','2020/07/08'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg511118.jpg','portrait','Pyxis','豊田萌絵/雑誌「月刊ドラゴンエイジ 2020年 7月号増刊 ヤングドラゴンエイジ Vol.3」ゲーマーズ特典ブロマイド','2020/06/25'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533718.jpg','portrait','水瀬いのり','上半身・衣装黒・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533717.jpg','portrait','水瀬いのり','全身・座り・衣装オレンジ・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533716.jpg','portrait','水瀬いのり','バストアップ・衣装白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533713.jpg','portrait','水瀬いのり','バストアップ・衣装オレンジ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533714.jpg','portrait','水瀬いのり','全身・しゃがみ・衣装白・青/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533715.jpg','portrait','水瀬いのり','膝上・衣装白・水色・左手上げ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg540831.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「STYLE」アニメイト特典ブロマイド','2020/06/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg540835.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「STYLE」とらのあな特典ブロマイド','2020/06/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg519708.jpg','portrait','和氣あず未','バストアップ・衣装黒・背景白・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516387.jpg','portrait','和氣あず未','横型・バストアップ・衣装ピンク・ナース服・左向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516388.jpg','portrait','和氣あず未','横型・バストアップ・衣装赤・白・右向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516389.jpg','portrait','和氣あず未','横型・上半身・衣装白・背景緑・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477504.jpg','portrait','鬼頭明里','雑誌「声優グランプリ 2020年6月号」ゲーマーズ特典ブロマイド','2020/05/09'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477503.jpg','portrait','鬼頭明里','雑誌「声優グランプリ 2020年6月号」アニメイト特典ブロマイド','2020/05/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477505.jpg','portrait','鬼頭明里','雑誌「声優グランプリ 2020年6月号」とらのあな・HMV＆BOOKS特典ブロマイド','2020/05/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477506.jpg','portrait','鬼頭明里','雑誌「声優グランプリ 2020年6月号」セブンネット・アニメガ×ソフマップ・マルサン書店・書泉ブックタワー・星野書店近鉄パッセ店特典ブロマイド','2020/05/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg518235.jpg','portrait','麻倉もも','雑誌「B.L.T. VOICE GIRLS Vol.42」先着購入者特典 アニメイト/ゲーマーズ Ver.','2020/05/02'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg597730.jpg','portrait','渕上舞','印刷サイン・メッセージ入り/CD「Crossing Road」アニメイト特典ブロマイド','2020/04/29'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516381.jpg','portrait','和氣あず未','上半身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516382.jpg','portrait','和氣あず未','膝上/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516383.jpg','portrait','和氣あず未','全身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589453.jpg','portrait','麻倉もも','CD「Agapanthus」アニメイト特典ブロマイド','2020/04/08'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589463.jpg','portrait','麻倉もも','CD「Agapanthus」ANIPLEX+特典ブロマイド','2020/04/08'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427050.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・左手胸・背景赤/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427051.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・体右向き・背景黒/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427053.jpg','portrait','上坂すみれ','上半身・衣装オレンジ・飲み物/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463258.jpg','portrait','上坂すみれ','バストアップ・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463264.jpg','portrait','上坂すみれ','上半身・衣装ピンク・両手胸・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427052.jpg','portrait','上坂すみれ','横型・バストアップ・衣装青.黒・両手頬/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463265.jpg','portrait','上坂すみれ','上半身・衣装ピンク・右手人差し指顎・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463270.jpg','portrait','上坂すみれ','全身・衣装青.白.赤・両手ハサミ・背景オレンジ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463266.jpg','portrait','上坂すみれ','膝上・衣装ピンク・左手頬・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463274.jpg','portrait','上坂すみれ','バストアップ・衣装黒・左手上げ・右向き/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463257.jpg','portrait','上坂すみれ','バストアップ・衣装白・右向き・背景青/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463272.jpg','portrait','上坂すみれ','全身・座り・衣装黒.青.白・両手交差/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463263.jpg','portrait','上坂すみれ','膝上・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463259.jpg','portrait','上坂すみれ','バストアップ・衣装赤茶・左手壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463275.jpg','portrait','上坂すみれ','バストアップ・衣装黒・両手髪・顔傾げ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463276.jpg','portrait','上坂すみれ','バストアップ・衣装黒・両手前・体傾け/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427055.jpg','portrait','上坂すみれ','横型・上半身・衣装オレンジ・振り返り/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463271.jpg','portrait','上坂すみれ','全身・座り・衣装青.白.赤・左手首元・背景オレンジ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463269.jpg','portrait','上坂すみれ','全身・座り・衣装青・右手膝上・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463261.jpg','portrait','上坂すみれ','全身・座り・衣装赤茶・壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463262.jpg','portrait','上坂すみれ','膝上・衣装赤・両手弓・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463268.jpg','portrait','上坂すみれ','膝上・衣装青.白・右手扇子・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463273.jpg','portrait','上坂すみれ','膝上・衣装黒.青.白・両手重ね・右向き/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463260.jpg','portrait','上坂すみれ','バストアップ・背景赤茶・左手胸・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463267.jpg','portrait','上坂すみれ','膝上・衣装青.白・右手傘・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427054.jpg','portrait','上坂すみれ','バストアップ・衣装オレンジ・体右向き/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778864.jpg','portrait','上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778865.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778866.jpg','portrait','上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778867.jpg','portrait','上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778868.jpg','portrait','上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423548.jpg','portrait','花澤香菜','花澤香菜写真集「How to go?」先着購入特典 アニメイト/書泉グランデ/書泉ブックタワー/芳林堂書店高田馬場店 Ver.','2020/03/16'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423549.jpg','portrait','花澤香菜','花澤香菜写真集「How to go?」先着購入特典 ゲーマーズ Ver.','2020/03/16'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423550.jpg','portrait','花澤香菜','花澤香菜写真集「How to go?」先着購入特典 セブンネットショッピング Ver.','2020/03/16'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400372.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」とらのあな特典ブロマイド','2020/03/11'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400371.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」ゲーマーズ特典ブロマイド','2020/03/11'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400370.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」アニメイト特典ブロマイド','2020/03/11'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400379.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」ANIPLEX+特典ブロマイド','2020/03/11'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg400373.jpg','portrait','TrySail','集合(3人)/CD「ごまかし/うつろい」ソフマップ・アニメガ特典ブロマイド','2020/03/11'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg394963.jpg','portrait','TrySail','集合(3人)/雑誌「声優アニメディア 2020年4月号」アニメイト・ゲーマーズ・とらのあな特典ブロマイド','2020/03/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397639.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」ゲーマーズ特典ブロマイド','2020/02/26'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397651.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り・2Lサイズ/CD「Desire Again」きゃにめ特典ブロマイド','2020/02/26'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397642.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」とらのあな特典ブロマイド','2020/02/26'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397644.jpg','portrait','鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」TOWER RECORDS特典ブロマイド','2020/02/26'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351934.jpg','portrait','水瀬いのり','雑誌「声優グランプリ 2020年 3月号」とらのあな・HMV特典ブロマイド','2020/02/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351932.jpg','portrait','水瀬いのり','雑誌「声優グランプリ 2020年 3月号」アニメイト特典ブロマイド','2020/02/10'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351935.jpg','portrait','水瀬いのり','雑誌「声優グランプリ 2020年 3月号」複数店舗共通特典ブロマイド','2020/02/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351933.jpg','portrait','水瀬いのり','雑誌「声優グランプリ 2020年 3月号」ゲーマーズ特典ブロマイド','2020/02/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352076.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」HMV特典ブロマイド','2020/02/05'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352074.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」とらのあな特典ブロマイド','2020/02/05'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352075.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」TOWER RECORDS特典ブロマイド','2020/02/05'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352077.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」Neowing特典ブロマイド','2020/02/05'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361098.jpg','portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」とらのあな特典ブロマイド','2020/02/05'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361093.jpg','portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」アニメイト特典ブロマイド','2020/02/05'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361096.jpg','portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」TSUTAYA特典ブロマイド','2020/02/05'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361101.jpg','portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」楽天ブックス特典ブロマイド','2020/02/05'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg484405.jpg','portrait','TrySail','集合(3人)/CD「TrySailのTRYangle harmony RADIO FANDISK 11」アニメイト特典ブロマイド','2020/01/31'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346545.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346544.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346543.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346542.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357555.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357559.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」アニメイト特典ブロマイド','2020/01/31'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357550.jpg','portrait','鬼頭明里','鬼頭明里1st写真集「Love Route」ヨドバシ特典ブロマイド','2020/01/31'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357548.jpg','portrait','鬼頭明里','鬼頭明里1st写真集「Love Route」HMV特典ブロマイド','2020/01/31'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357556.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346546.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357557.jpg','portrait','鬼頭明里','5 ： 鬼頭明里/鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453329.jpg','portrait','和氣あず未','CD「ふわっと/シトラス」(通常盤)とらのあな特典ブロマイド','2020/01/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453333.jpg','portrait','和氣あず未','うつ伏せ・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念アニメイト限定フェア 応援メッセージキャンペーン特典ブロマイド','2020/01/28'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453334.jpg','portrait','和氣あず未','全身・座り・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/01/28'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328178.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」ゲーマーズ特典ブロマイド','2020/01/22'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328186.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」ANIPLEX+特典ブロマイド','2020/01/22'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328179.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」とらのあな特典ブロマイド','2020/01/22'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328177.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」アニメイト特典ブロマイド','2020/01/22'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328188.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」TOWER RECORDS特典ブロマイド','2020/01/22'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328187.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」楽天ブックス特典ブロマイド','2020/01/22'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328181.jpg','portrait','TrySail','集合(3人)/CD「Free Turn」Amazon特典ブロマイド','2020/01/22'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328029.jpg','portrait','上坂すみれ','KGサイズ(ポストカードサイズ)/CD「NEO PROPAGANDA」Neowing特典ポートレート','2020/01/22'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328020.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」アニメイト特典ブロマイド','2020/01/22'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328023.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」ゲーマーズ特典ブロマイド','2020/01/22'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328027.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」多売特典ブロマイド','2020/01/22'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328030.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」TOWER RECORDS特典ブロマイド','2020/01/22'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg740539.jpg','portrait','立花理香','CD「Heart Shaker」ゲーマーズ特典ブロマイド','2020/01/22'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328024.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」TSUTAYA特典ブロマイド','2020/01/22'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328021.jpg','portrait','上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」とらのあな特典ブロマイド','2020/01/22'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329048.jpg','portrait','悠木碧','CD「Unbreakable」とらのあな特典ブロマイド','2020/01/15'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329054.jpg','portrait','悠木碧','CD「Unbreakable」楽天ブックス特典ブロマイド','2020/01/15'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329052.jpg','portrait','悠木碧','CD「Unbreakable」TSUTAYA特典ブロマイド','2020/01/15'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329049.jpg','portrait','悠木碧','CD「Unbreakable」ソフマップ・アニメガ特典ブロマイド','2020/01/15'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329051.jpg','portrait','悠木碧','CD「Unbreakable」HMV特典ブロマイド','2020/01/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329053.jpg','portrait','悠木碧','CD「Unbreakable」WonderGOO・新星堂特典ブロマイド','2020/01/15'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329055.jpg','portrait','悠木碧','CD「Unbreakable」ネオ・ウィング特典ブロマイド','2020/01/15'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329050.jpg','portrait','悠木碧','CD「Unbreakable」タワーレコード特典ブロマイド','2020/01/15'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329056.jpg','portrait','悠木碧','CD「Unbreakable」コロムビアミュージックショップ特典ブロマイド','2020/01/15'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329037.jpg','portrait','雨宮天','CD「PARADOX」ゲーマーズ特典ブロマイド','2020/01/15'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329047.jpg','portrait','雨宮天','CD「PARADOX」Amazon.co.jp特典ブロマイド','2020/01/15'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329038.jpg','portrait','雨宮天','CD「PARADOX」とらのあな特典ブロマイド','2020/01/15'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329036.jpg','portrait','雨宮天','CD「PARADOX」アニメイト特典ブロマイド','2020/01/15'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329045.jpg','portrait','雨宮天','CD「PARADOX」ANIPLEX+特典ブロマイド','2020/01/15'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329040.jpg','portrait','雨宮天','CD「PARADOX」TOWER RECORDS特典ブロマイド','2020/01/15'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329046.jpg','portrait','雨宮天','CD「PARADOX」楽天ブックス特典ブロマイド','2020/01/15'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg413110.jpg','portrait','雨宮天','印刷サイン・メッセージ入り/雨宮天「PARADOX」楽曲・MVヘビロテ応援店舗キャンペーン アニメイト開催店舗限定 対象商品購入特典ブロマイド','2020/01/14'],



];
