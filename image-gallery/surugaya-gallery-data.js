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
defaultTag = ''; //if empty string will select all; can be string OR integer based on sorting
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
	item.getElementsByClassName('title')[0].innerText.includes('チェキ') ||
	item.getElementsByClassName('title')[0].innerText.includes('サイン入りポラ') ||
	item.getElementsByTagName('img')[0].getBoundingClientRect().width == item.getElementsByTagName('img')[0].getBoundingClientRect().height).length > 0) {
	for(let item of items) {
		let image = item.getElementsByTagName('img')[0];
		if(item.getElementsByClassName('condition')[0].innerText.includes('コレクションカード') ||
		item.getElementsByClassName('title')[0].innerText.includes('チェキ') ||
	item.getElementsByClassName('title')[0].innerText.includes('サイン入りポラ') ||
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
	let date;
	if(item.getElementsByClassName('release_date').length > 0)
		date = item.getElementsByClassName('release_date')[0].innerText.replace('発売日：','');
	let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
	list+= ("["+(counter++)+",'"+newurl+".jpg' ,'portrait','"+tag+"','"+detail+"','"+date+"'],") + '\n';
}
console.log(list);


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

from cart: 'https://www.suruga-ya.com/ja/cart/detail'
let dict = new Array();
for(let item of document.getElementsByClassName('table-active')) {
	let link = item.getElementsByTagName('h5')[0];
	if(link != undefined) {
		let tag = link.innerText.substring(0,link.innerText.indexOf('/')).replace('A ： ','').replace('B ： ','').replace('C ： ','');
		if(dict.map(d => d.tag).includes(tag)) {
			let selected = dict.filter(d => d.tag == tag);
			if(selected.length > 0) {
				selected[0].count += 1;
			}
		}
		else {
			dict.push({ tag:tag, count:1 });
		}
	}
}
console.log(dict.sort((a,b) => b.count - a.count));
*/

//array containing all gallery info, tags delimiter "|"
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL','DATE'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg799405.jpg' ,'portrait','雨宮天','雑誌「声優グランプリ 2021年5月号」アニメイト特典ブロマイド','2021/04/09'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589441.jpg' ,'portrait','雨宮天','CD「Paint it，BLUE」アニメイト特典ブロマイド','2020/09/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548874.jpg' ,'portrait','雨宮天','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548878.jpg' ,'portrait','雨宮天','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538099.jpg' ,'portrait','雨宮天','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522955.jpg' ,'portrait','雨宮天','雑誌「声優グランプリ2020年8月号」アニメイト限定特典ブロマイド','2020/07/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522957.jpg' ,'portrait','雨宮天','雑誌「声優グランプリ2020年8月号」HMV＆BOOKS限定特典ブロマイド','2020/07/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg603165.jpg' ,'portrait','雨宮天','ライブフォト/Blu-ray「雨宮天 LIVE 2020 The Clearest SKY」発売応援CP第一弾 アニメイトチェーンWEB抽選企画 参加賞ブロマイド','2020/07/08'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329036.jpg' ,'portrait','雨宮天','CD「PARADOX」アニメイト特典ブロマイド','2020/01/15'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329047.jpg' ,'portrait','雨宮天','CD「PARADOX」Amazon.co.jp特典ブロマイド','2020/01/15'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329038.jpg' ,'portrait','雨宮天','CD「PARADOX」とらのあな特典ブロマイド','2020/01/15'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329037.jpg' ,'portrait','雨宮天','CD「PARADOX」ゲーマーズ特典ブロマイド','2020/01/15'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329040.jpg' ,'portrait','雨宮天','CD「PARADOX」TOWER RECORDS特典ブロマイド','2020/01/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329045.jpg' ,'portrait','雨宮天','CD「PARADOX」ANIPLEX+特典ブロマイド','2020/01/15'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329046.jpg' ,'portrait','雨宮天','CD「PARADOX」楽天ブックス特典ブロマイド','2020/01/15'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg413110.jpg' ,'portrait','雨宮天','印刷サイン・メッセージ入り/雨宮天「PARADOX」楽曲・MVヘビロテ応援店舗キャンペーン アニメイト開催店舗限定 対象商品購入特典ブロマイド','2020/01/14'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368125.jpg' ,'portrait','雨宮天','2Lサイズ/写真集「High Tension!」HMV＆BOOKS特典ブロマイド','2019/12/25'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/bg368125.jpg' ,'portrait','雨宮天','2Lサイズ/写真集「High Tension!」HMV＆BOOKS特典ブロマイド','2019/12/25'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284085.jpg' ,'portrait','雨宮天','CD「Regeneration」アニメイト特典ブロマイド','2019/11/06'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284096.jpg' ,'portrait','雨宮天','CD「Regeneration」Amazon特典ブロマイド','2019/11/06'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284087.jpg' ,'portrait','雨宮天','CD「Regeneration」とらのあな特典ブロマイド','2019/11/06'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284086.jpg' ,'portrait','雨宮天','CD「Regeneration」ゲーマーズ特典ブロマイド','2019/11/06'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg284089.jpg' ,'portrait','雨宮天','CD「Regeneration」TOWER RECORDS特典ブロマイド','2019/11/06'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453057.jpg' ,'portrait','雨宮天','LAWSON presents 第2回 雨宮天 音楽で彩るリサイタル・印刷サイン入り/CD「Regeneration」会場予約特典ブロマイド','2019/11/06'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679208.jpg' ,'portrait','麻倉もも','上半身/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679209.jpg' ,'portrait','麻倉もも','バストアップ/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657800.jpg' ,'portrait','麻倉もも','膝上・印刷サイン・メッセージ入り/CD「僕だけに見える星」LAWSON presents 麻倉もも Live 2020 ”Agapanthus”開催記念 会場CD即売ブース・対象期間限定アニメイト通販特典ブロマイド','2020/11/13'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657807.jpg' ,'portrait','麻倉もも','CD「僕だけに見える星」アニメイト特典ブロマイド','2020/11/11'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657808.jpg' ,'portrait','麻倉もも','CD「僕だけに見える星」ゲーマーズ特典ブロマイド','2020/11/11'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657804.jpg' ,'portrait','麻倉もも','バストアップ・印刷サイン・メッセージ入り/アニメイト限定フェア「LAWSON presents 麻倉もも Live 2020 ”Agapanthus”応援フェア」特典ブロマイド','2020/11/10'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg518235.jpg' ,'portrait','麻倉もも','雑誌「B.L.T. VOICE GIRLS Vol.42」先着購入者特典 アニメイト/ゲーマーズ Ver.','2020/05/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589453.jpg' ,'portrait','麻倉もも','CD「Agapanthus」アニメイト特典ブロマイド','2020/04/08'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589463.jpg' ,'portrait','麻倉もも','CD「Agapanthus」ANIPLEX+特典ブロマイド','2020/04/08'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208488.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」アニメイト特典ブロマイド','2019/09/04'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208489.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」ゲーマーズ特典ブロマイド','2019/09/04'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208499.jpg' ,'portrait','麻倉もも','バストアップ・クッション抱きしめ・体左向き/写真集「ただいま、おかえり」・CD「ユメシンデレラ」アニメイト連動購入キャンペーン特典ブロマイド','2019/09/04'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208498.jpg' ,'portrait','麻倉もも','横型・バストアップ・目線右/写真集「ただいま、おかえり」・CD「ユメシンデレラ」アニメイト連動購入キャンペーン特典ブロマイド','2019/09/04'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208492.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」TOWER RECORDS特典ブロマイド','2019/09/04'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208493.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」HMV特典ブロマイド','2019/09/04'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208497.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」Amazon特典ブロマイド','2019/09/04'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg208490.jpg' ,'portrait','麻倉もも','CD「ユメシンデレラ」とらのあな特典ブロマイド','2019/09/04'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg215038.jpg' ,'portrait','麻倉もも','写真集「ただいま、おかえり」AKIHABARAゲーマーズ本店特典ブロマイド','2019/08/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg215036.jpg' ,'portrait','麻倉もも','写真集「ただいま、おかえり」アニメイト秋葉原本館特典ブロマイド','2019/08/30'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg239660.jpg' ,'portrait','麻倉もも','A5サイズ/写真集「ただいま、おかえり」HMV・Loppi特典大判フォトカード','2019/08/30'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg215037.jpg' ,'portrait','麻倉もも','写真集「ただいま、おかえり」アニメイト渋谷特典ブロマイド','2019/08/30'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg182404.jpg' ,'portrait','麻倉もも','横型・膝上・衣装青・チェック柄・左手頬・印刷サイン・メッセージ入り「かわいい素敵な曲～」/「LAWSON presents TrySail Live Tour 2019 The TrySail Odyssey」千葉会場4日限定 CD「ユメシンデレラ」予約特典ブロマイド','2019/08/04'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109024.jpg' ,'portrait','麻倉もも','CD「スマッシュ・ドロップ」ゲーマーズ特典ブロマイド','2019/05/22'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109023.jpg' ,'portrait','麻倉もも','CD「スマッシュ・ドロップ」アニメイト特典ブロマイド','2019/05/22'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109025.jpg' ,'portrait','麻倉もも','CD「スマッシュ・ドロップ」とらのあな特典ブロマイド','2019/05/22'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109030.jpg' ,'portrait','麻倉もも','CD「スマッシュ・ドロップ」新星堂・WonderGOO特典ブロマイド','2019/05/22'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg109028.jpg' ,'portrait','麻倉もも','CD「スマッシュ・ドロップ」HMV特典ブロマイド','2019/05/22'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622729.jpg' ,'portrait','小松未可子','「浴衣」/フォトブック「ちょっとそこまで」アニメイト特典ブロマイド','2018/01/26'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622732.jpg' ,'portrait','小松未可子','「ちょいワル」/フォトブック「ちょっとそこまで」アニメガ・文教堂特典ブロマイド','2018/01/26'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553215.jpg' ,'portrait','小松未可子','CD「Swing heart direction」ゲーマーズ特典ブロマイド','2017/11/08'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553214.jpg' ,'portrait','小松未可子','CD「Swing heart direction」HMV特典ブロマイド','2017/11/08'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553212.jpg' ,'portrait','小松未可子','CD「Swing heart direction」Amazon特典ブロマイド','2017/11/08'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553216.jpg' ,'portrait','小松未可子','CD「Swing heart direction」とらのあな特典ブロマイド','2017/11/08'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553217.jpg' ,'portrait','小松未可子','CD「Swing heart direction」楽天ブックス特典ブロマイド','2017/11/08'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3553219.jpg' ,'portrait','小松未可子','CD「Swing heart direction」Neowing特典ブロマイド','2017/11/08'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466796.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」Amazon特典ブロマイド','2017/08/09'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466797.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」TSUTAYA特典ブロマイド','2017/08/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466798.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」HMV特典ブロマイド','2017/08/09'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466800.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」とらのあな特典ブロマイド','2017/08/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466801.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」楽天ブックス特典ブロマイド','2017/08/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466802.jpg' ,'portrait','小松未可子','CD「Maybe the next waltz」アニメガ・文教堂特典ブロマイド','2017/08/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3466803.jpg' ,'portrait','小松未可子','2Lサイズ/CD「Maybe the next waltz」Neowing特典ポートレート','2017/08/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3375351.jpg' ,'portrait','小松未可子','CD「Blooming Maps」アニメイト特典ブロマイド','2017/05/10'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3375352.jpg' ,'portrait','小松未可子','2Lサイズ/CD「Blooming Maps」Neowing特典ポートレイト','2017/05/10'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185956.jpg' ,'portrait','小松未可子','膝上・衣装白・体左向き・右手頭/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185963.jpg' ,'portrait','小松未可子','上半身・衣装花柄・右手頭・体傾け/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185958.jpg' ,'portrait','小松未可子','膝上・衣装赤・背中向け・左手壁触り/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185957.jpg' ,'portrait','小松未可子','上半身・衣装茶・首傾げ・左手髪/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185959.jpg' ,'portrait','小松未可子','膝上・衣装赤・両手下・顔左向き/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185960.jpg' ,'portrait','小松未可子','上半身・衣装黒・緑・左向き・右手帽子/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185961.jpg' ,'portrait','小松未可子','膝上・衣装白・右向き・両手壁触り/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185962.jpg' ,'portrait','小松未可子','膝上・衣装黒・緑・黄・両手帽子/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg185964.jpg' ,'portrait','小松未可子','膝上・衣装茶・左向き・両手髪/「ハピこし!ライブ2016 “Imagine day. Imagine life!”」ブロマイド','2016/11/20'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/g3357212.jpg' ,'portrait','小松未可子','「STARCHILD presents LIVE NEXUS 2015」ブロマイド','2015/09/26'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/g3357213.jpg' ,'portrait','小松未可子','「STARCHILD presents LIVE NEXUS 2015」ブロマイド','2015/09/26'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/g3357214.jpg' ,'portrait','小松未可子','「STARCHILD presents LIVE NEXUS 2015」ブロマイド','2015/09/26'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/g4379889.jpg' ,'portrait','小松未可子','CD「群青サバイバル」多売特典','2015/08/26'],

[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3858282.jpg' ,'portrait','豊崎愛生','CD「AT living」アニメイト特典ブロマイド','2018/10/24'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3858283.jpg' ,'portrait','豊崎愛生','CD「AT living」ゲーマーズ特典ブロマイド','2018/10/24'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg356588.jpg' ,'portrait','豊崎愛生','CD「AT living」アニメイト渋谷・アニメイト秋葉原 発売記念フェア参加賞オリジナルブロマイド','2018/10/23'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3468430.jpg' ,'portrait','豊崎愛生','膝上・衣装白・ピンク・左手頭・印刷サイン・メッセージ入り・「お手にとって下さって」/スフィア全国ツアー『LAWSON presents Sphere live tour 2017 “We are SPHERE!!!!”』会場CD物販「love your Best」購入特典','2017/07/23'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445470.jpg' ,'portrait','豊崎愛生','CD「love your Best」TOWER RECORD特典ブロマイド','2017/07/19'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445467.jpg' ,'portrait','豊崎愛生','CD「love your Best」ゲーマーズ特典ブロマイド','2017/07/19'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445468.jpg' ,'portrait','豊崎愛生','CD「love your Best」ソフマップ特典ブロマイド','2017/07/19'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445466.jpg' ,'portrait','豊崎愛生','CD「love your Best」アニメイト特典ブロマイド','2017/07/19'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445471.jpg' ,'portrait','豊崎愛生','CD「love your Best」HMV特典ブロマイド','2017/07/19'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3445473.jpg' ,'portrait','豊崎愛生','CD「love your Best」応援店特典ブロマイド','2017/07/19'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3468427.jpg' ,'portrait','豊崎愛生','膝上・衣装黄色・オレンジ・印刷サイン・メッセージ入り・「”プリプリダンス”一緒におどりましょう～」/スフィア全国ツアー『LAWSON presents Sphere live tour 2017 “We are SPHERE!!!!”』会場CD物販「ハニーアンドループス」購入特典','2017/06/03'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3395272.jpg' ,'portrait','豊崎愛生','CD「ハニーアンドループス」ゲーマーズ特典ブロマイド','2017/05/31'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3395271.jpg' ,'portrait','豊崎愛生','CD「ハニーアンドループス」アニメイト特典ブロマイド','2017/05/31'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3395274.jpg' ,'portrait','豊崎愛生','CD「ハニーアンドループス」とらのあな特典ブロマイド','2017/05/31'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/g3395275.jpg' ,'portrait','豊崎愛生','CD「ハニーアンドループス」TOWER RECORD特典ブロマイド','2017/05/31'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3149879.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」アニメイト特典ブロマイド','2016/08/31'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3149882.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」とらのあな特典ブロマイド','2016/08/31'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3149880.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」ゲーマーズ特典ブロマイド','2016/08/31'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3149883.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」TOWER RECORD特典ブロマイド','2016/08/31'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3149884.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」HMV特典ブロマイド','2016/08/31'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/b3149883.jpg' ,'portrait','豊崎愛生','CD「walk on Believer♪」TOWER RECORD特典ブロマイド','2016/08/31'],

[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605580.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」特典ブロマイド','2019/04/29'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605562.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605550.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605538.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605567.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605577.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605571.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605540.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605533.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605543.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605536.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605539.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605565.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605547.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605557.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605568.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605581.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」特典ブロマイド','2019/04/29'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605531.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605570.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605548.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605564.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605574.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605530.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605532.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605534.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605535.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605537.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605541.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605542.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605544.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605545.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605546.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605549.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605551.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605552.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605553.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605554.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605555.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605556.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605558.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605559.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605560.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605561.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605563.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605566.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605569.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605572.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605573.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605575.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605576.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605578.jpg' ,'portrait','木戸衣吹','横型/「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg605579.jpg' ,'portrait','木戸衣吹','「木戸衣吹 1stソロフォトブック『breath』発売記念イベント」ブロマイド','2019/04/29'],

[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg609044.jpg' ,'portrait','高野麻里佳','印刷サイン・メッセージ入り/CD「Theory of evolution」KING e-SHOP特典ブロマイド','2020/07/22'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg599048.jpg' ,'portrait','高野麻里佳','印刷サイン・メッセージ入り/CD「チュラタ チュラハ」KING e-SHOP特典ブロマイド','2019/07/03'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792553.jpg' ,'portrait','高野麻里佳','膝上・衣装白・タンクトップ・体左向き・座り・両手頭・岩場/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3803334.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」とらのあな特典ブロマイド','2018/07/30'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3782971.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」ゲーマーズ特典ブロマイド','2018/07/30'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792551.jpg' ,'portrait','高野麻里佳','バストアップ・衣装白・タンクトップ・帽子・左手サングラス外し/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792548.jpg' ,'portrait','高野麻里佳','全身・衣装白・肩にタオル・座り・両手膝・目線左上・室内/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792552.jpg' ,'portrait','高野麻里佳','バストアップ・衣装白・座り・両手スイカ・噛り付き・室内/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792554.jpg' ,'portrait','高野麻里佳','全身・衣装白・タンクトップ・座り・振り向き・岩場/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792562.jpg' ,'portrait','高野麻里佳','膝上・衣装白・ワンピース・右手帽子・座り/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792567.jpg' ,'portrait','高野麻里佳','バストアップ・衣装白・首傾げ・右手髪・左手上げ・2Lサイズ/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792555.jpg' ,'portrait','高野麻里佳','全身・衣装白・制服・体左向き・両手壁・野外/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3879990.jpg' ,'portrait','高野麻里佳','膝上・しゃがみ・衣装白・タンクトップ・座り・両手交差・肩・岩場・2Lサイズ/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792558.jpg' ,'portrait','高野麻里佳','膝上・衣装白・制服・スイカぶら下げ・浜辺/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792571.jpg' ,'portrait','高野麻里佳','上半身・衣装白・キャミソール・座り・体左向き・2Lサイズ/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3795778.jpg' ,'portrait','高野麻里佳','膝上・しゃがみ・体右向き・衣装青・黒・膝抱え/写真集「まりん夏」初版限定封入ブロマイド','2018/07/30'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792563.jpg' ,'portrait','高野麻里佳','横型・バストアップ・衣装白・紫・仰向け/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3795777.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」アニメイト特典ブロマイド','2018/07/30'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3782974.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」アニメガ・文教堂特典ブロマイド','2018/07/30'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3782972.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」HMV特典ブロマイド','2018/07/30'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792547.jpg' ,'portrait','高野麻里佳','横型・全身・衣装白・座り・体左向き・腕伸ばし・畳/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3782977.jpg' ,'portrait','高野麻里佳','写真集「まりん夏」メロンブックス特典ブロマイド','2018/07/30'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792564.jpg' ,'portrait','高野麻里佳','横型・顔アップ・目細め・歯見せ・寝そべり/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792559.jpg' ,'portrait','高野麻里佳','膝上・衣装青・浴衣・体右向き・両手てすり/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792561.jpg' ,'portrait','高野麻里佳','膝上・衣装白・ワンピース・両手傘差し・路上/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792549.jpg' ,'portrait','高野麻里佳','バストアップ・衣装青・浴衣・両手重ね顎・野外・階段/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3792557.jpg' ,'portrait','高野麻里佳','膝上・衣装青・浴衣・両手後方・石橋触り/ブロマイド専用印刷機「コンテンツラッシュ」 写真集「まりん夏」発売記念プレミアムブロマイド','2018/07/30'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/b3792548.jpg' ,'portrait','高野麻里佳','全身・衣装白・肩にタオル・座り・両手膝・目線左上・室内/写真集「まりん夏」初版封入特典ブロマイド','2018/07/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/b3795778.jpg' ,'portrait','高野麻里佳','膝上・しゃがみ・体右向き・衣装青・黒・膝抱え/写真集「まりん夏」初版限定封入ブロマイド','2018/07/30'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg836964.jpg' ,'portrait','高野麻里佳','雑誌「声優パラダイスR vol.24」お渡し会特典ブロマイド','2018/05/27'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3833226.jpg' ,'portrait','高野麻里佳','雑誌「声優パラダイスR vol.24」アニメイト特典ブロマイド','2018/05/17'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3833231.jpg' ,'portrait','高野麻里佳','雑誌「声優パラダイスR vol.24」BOOK EXPRESS特典ブロマイド','2018/05/17'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg067504.jpg' ,'portrait','高野麻里佳','全身・右手口元・左手スカート・背景白/「天才!カラーズTV!!出張所 ～カラーズ☆ミュージアム」ブロマイド','2018/04/22'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg067503.jpg' ,'portrait','高野麻里佳','上半身・両手頬・背景白/「天才!カラーズTV!!出張所 ～カラーズ☆ミュージアム」ブロマイド','2018/04/22'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg067502.jpg' ,'portrait','高野麻里佳','膝上・左手腰・背景赤・青・黄/「天才!カラーズTV!!出張所 ～カラーズ☆ミュージアム」ブロマイド','2018/04/22'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736849.jpg' ,'portrait','夏川椎菜','CD「クラクトリトルプライド」アニメイト特典ブロマイド','2021/01/06'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736845.jpg' ,'portrait','夏川椎菜','フォトブック「夏川椎菜、なんとなく、くだらなく。」HMV＆BOOKS特典ブロマイド','2020/12/18'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736844.jpg' ,'portrait','夏川椎菜','フォトブック「夏川椎菜、なんとなく、くだらなく。」とらのあな特典ブロマイド','2020/12/18'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576075.jpg' ,'portrait','夏川椎菜','横型・全身・膝立ち・衣装白・左向き/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576076.jpg' ,'portrait','夏川椎菜','横型・バストアップ・衣装紫・両手曲げ/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576078.jpg' ,'portrait','夏川椎菜','雑誌「声優グランプリ 2020年10月号」ゲーマーズ特典ブロマイド','2020/09/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589429.jpg' ,'portrait','夏川椎菜','CD「アンチテーゼ」アニメイト特典ブロマイド','2020/09/09'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589433.jpg' ,'portrait','夏川椎菜','CD「アンチテーゼ」TOWER RECORDS特典ブロマイド','2020/09/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229661.jpg' ,'portrait','夏川椎菜','CD「Ep01」アニメイト特典ブロマイド','2019/09/25'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229662.jpg' ,'portrait','夏川椎菜','CD「Ep01」ゲーマーズ特典ブロマイド','2019/09/25'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229672.jpg' ,'portrait','夏川椎菜','CD「Ep01」Amazon特典ブロマイド','2019/09/25'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229663.jpg' ,'portrait','夏川椎菜','CD「Ep01」とらのあな特典ブロマイド','2019/09/25'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg229671.jpg' ,'portrait','夏川椎菜','CD「Ep01」楽天ブックス特典ブロマイド','2019/09/25'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189333.jpg' ,'portrait','夏川椎菜','横型・バストアップ・印刷サイン・メッセージ入り「あなたにピッタリはまる曲が絶対みつかる!よ!」/「LAWSON presents TrySail Live Tour 2019 ”The TrySail Odyssey”」神戸会場7日限定 CD「ログライン」購入特典ブロマイド','2019/07/07'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg056096.jpg' ,'portrait','夏川椎菜','CD「ログライン」ゲーマーズ特典ブロマイド','2019/04/17'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg056095.jpg' ,'portrait','夏川椎菜','CD「ログライン」アニメイト特典ブロマイド','2019/04/17'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189334.jpg' ,'portrait','夏川椎菜','横型・全身・背景グレー・印刷サイン・メッセージ入り/CD「ログライン」アニメイト千葉エリア限定フェア特典ブロマイド','2019/04/17'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg056097.jpg' ,'portrait','夏川椎菜','CD「ログライン」とらのあな特典ブロマイド','2019/04/17'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189337.jpg' ,'portrait','夏川椎菜','横型・上半身・体右向き・印刷サイン・メッセージ入り/CD「ログライン」特典ブロマイド','2019/04/17'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589426.jpg' ,'portrait','夏川椎菜','CD「ログライン」発売記念ミュージアム AKIHABARAゲーマーズ本店会場限定ガラポン抽選会参加賞 ブロマイド','2019/04/16'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189336.jpg' ,'portrait','夏川椎菜','横型・バストアップ・衣装白・首かしげ・背景グレー/CD「ログライン」発売記念 アニメイト渋谷・秋葉原本館店頭抽選会参加賞ブロマイド','2019/04/16'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189320.jpg' ,'portrait','夏川椎菜','全身・座り・テレビの上・印刷サイン・メッセージ入り/「LAWSON presents TrySail Live Tour 2019 ”The TrySail Odyssey”」大阪会場限定 CD「ログライン」予約特典ブロマイド','2019/03/23'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3665453.jpg' ,'portrait','大久保瑠美','DVDブック「るみがた。」とらのあな特典生写真','2018/03/14'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3665448.jpg' ,'portrait','大久保瑠美','DVDブック「るみがた。」ゲーマーズ特典生写真','2018/03/14'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3665447.jpg' ,'portrait','大久保瑠美','DVDブック「るみがた。」アニメイト特典生写真','2018/03/14'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3707416.jpg' ,'portrait','大久保瑠美','膝上・衣装茶白・両手腹・手重ね/DVD「声優シェアハウス 大久保瑠美のるみるみる～む Vol.3」発売記念イベント会場限定撮り下ろしブロマイド','2016/12/18'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3707415.jpg' ,'portrait','大久保瑠美','膝上・衣装茶白・座り・両手ぬいぐるみ/DVD「声優シェアハウス 大久保瑠美のるみるみる～む Vol.3」発売記念イベント会場限定撮り下ろしブロマイド','2016/12/18'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3707417.jpg' ,'portrait','大久保瑠美','全身・衣装茶・トナカイ・座り・両手頭/DVD「声優シェアハウス 大久保瑠美のるみるみる～む Vol.3」発売記念イベント会場限定撮り下ろしブロマイド','2016/12/18'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3707418.jpg' ,'portrait','大久保瑠美','膝上・衣装茶・トナカイ・両手上げ・首傾げ/DVD「声優シェアハウス 大久保瑠美のるみるみる～む Vol.3」発売記念イベント会場限定撮り下ろしブロマイド','2016/12/18'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3707419.jpg' ,'portrait','大久保瑠美','全身・衣装茶・トナカイ・右手上げ・左手膝/DVD「声優シェアハウス 大久保瑠美のるみるみる～む Vol.3」発売記念イベント会場限定撮り下ろしブロマイド','2016/12/18'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3163511.jpg' ,'portrait','大久保瑠美','MESV-0099/DVD「大久保瑠美・原紗友里 青春学園 Girls High↑↑ファンディスク Vol.2 課外授業 ～なつのおもいで～」豪華盤封入特典','2016/08/11'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3577947.jpg' ,'portrait','大久保瑠美','膝上・背景黄色・右手顔・首傾げ/「A＆G NEXT GENERATION Lady Go!! 卒業アルバム」楽天ブックス特典ブロマイド','2016/03/09'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g4383597.jpg' ,'portrait','大久保瑠美','上半身/DVD「大久保瑠美・原紗友里 青春学園 Girls High↑↑ファンディスク 修学旅行 in 沖縄」特典生写真','2015/09/02'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/g3573428.jpg' ,'portrait','大久保瑠美','CD「Progression」ゲーマーズ特典生写真','2015/06/03'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/g4275755.jpg' ,'portrait','大久保瑠美','バストアップ・衣装赤白ボーダー・両手合わせ/写真集 「イるみネーションクローゼット」とらのあな特典','2015/04/21'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/g4275756.jpg' ,'portrait','大久保瑠美','上半身・衣装白黒・ドット柄・両手頬/写真集 「イるみネーションクローゼット」アニメイト特典','2015/04/21'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/g4275754.jpg' ,'portrait','大久保瑠美','全身・しゃがみ・衣装黒赤紫・体左向き/写真集 「イるみネーションクローゼット」ゲーマーズ特典','2015/04/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g4275757.jpg' ,'portrait','大久保瑠美','上半身・衣装白・両手合わせ/写真集 「イるみネーションクローゼット」アニメガ特典','2015/04/21'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g4235237.jpg' ,'portrait','大久保瑠美','DVD「声優 ゆめ日記 ～大久保瑠美～」アニメイト特典','2014/02/14'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g4235234.jpg' ,'portrait','大久保瑠美','DVD「声優 ゆめ日記 ～大久保瑠美～」とらのあな特典','2014/02/14'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g4235235.jpg' ,'portrait','大久保瑠美','DVD「声優 ゆめ日記 ～大久保瑠美～」学研オンラインショップ特典','2014/02/14'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg740539.jpg' ,'portrait','立花理香','CD「Heart Shaker」ゲーマーズ特典ブロマイド','2020/01/22'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg023345.jpg' ,'portrait','立花理香','雑誌「声優パラダイスR Vol.29」ゲーマーズ特典ブロマイド','2019/03/22'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg042355.jpg' ,'portrait','立花理香','横型・バストアップ・衣装ピンク・両手帽子・背景白/CD「カラフルパサージュ」立花理香 2nd LIVE ～colorful mixer～開催記念スペシャルセット会場購入特典ブロマイド','2019/02/16'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975826.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」とらのあな特典ブロマイド','2019/02/13'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975823.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」ゲーマーズ特典ブロマイド','2019/02/13'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975824.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」アニメイト特典ブロマイド','2019/02/13'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975828.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」TOWER RECORDS特典ブロマイド','2019/02/13'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975829.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」HMV特典ブロマイド','2019/02/13'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3975827.jpg' ,'portrait','立花理香','CD「カラフルパサージュ」Amazon特典ブロマイド','2019/02/13'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg012758.jpg' ,'portrait','立花理香','「ゲーマーズ秋の本まつり2018」10ポイント景品ブロマイドセット 声優パラダイスR vol.26','2018/09/28'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg042356.jpg' ,'portrait','立花理香','上半身・衣装白・右手頬杖・左手膝/CD「LIFE」発売記念イベント特典ブロマイド','2018/09/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806240.jpg' ,'portrait','立花理香','CD「LIFE」とらのあな特典ブロマイド','2018/08/29'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806237.jpg' ,'portrait','立花理香','CD「LIFE」ゲーマーズ特典ブロマイド','2018/08/29'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806238.jpg' ,'portrait','立花理香','CD「LIFE」アニメイト特典ブロマイド','2018/08/29'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806242.jpg' ,'portrait','立花理香','CD「LIFE」TOWER RECORDS特典ブロマイド','2018/08/29'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806239.jpg' ,'portrait','立花理香','CD「LIFE」ソフマップ特典ブロマイド','2018/08/29'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806241.jpg' ,'portrait','立花理香','CD「LIFE」Amazon特典ブロマイド','2018/08/29'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3806243.jpg' ,'portrait','立花理香','CD「LIFE」HMV特典ブロマイド','2018/08/29'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3803344.jpg' ,'portrait','立花理香','「井澤詩織・立花理香 ノルカソルカ トレーディングカード」ゲーマーズ限定BOX購入特典ブロマイド','2018/08/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3821280.jpg' ,'portrait','立花理香','すきすき りっかさまプレミアムフォトブロマイドゲーマーズ限定版5/雑誌「声優パラダイスR vol.25」ゲーマーズ特典ブロマイド','2018/07/17'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg415356.jpg' ,'portrait','立花理香','雑誌「声優パラダイスR vol.25」アニメイト特典ブロマイド','2018/07/17'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3821278.jpg' ,'portrait','立花理香','すきすき りっかさまプレミアムフォトブロマイドゲーマーズ限定版3/雑誌「声優パラダイスR vol.25」ゲーマーズ特典ブロマイド','2018/07/17'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3821276.jpg' ,'portrait','立花理香','すきすき りっかさまプレミアムフォトブロマイドゲーマーズ限定版1/雑誌「声優パラダイスR vol.25」ゲーマーズ特典ブロマイド','2018/07/17'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg530197.jpg' ,'portrait','立花理香','上半身・衣装白・左向き・右手上げ/「声優パラダイスR 立花理香」プレミアムブロマイドLサイズ','2018/07/17'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg530198.jpg' ,'portrait','立花理香','上半身・衣装白・左向き・両手曲げ/「声優パラダイスR 立花理香」プレミアムブロマイドLサイズ','2018/07/17'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3821277.jpg' ,'portrait','立花理香','すきすき りっかさまプレミアムフォトブロマイドゲーマーズ限定版2/雑誌「声優パラダイスR vol.25」ゲーマーズ特典ブロマイド','2018/07/17'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3821279.jpg' ,'portrait','立花理香','すきすき りっかさまプレミアムフォトブロマイドゲーマーズ限定版4/雑誌「声優パラダイスR vol.25」ゲーマーズ特典ブロマイド','2018/07/17'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3824227.jpg' ,'portrait','立花理香','雑誌「声優パラダイスR vol.25」HMV特典ブロマイド','2018/07/17'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg189012.jpg' ,'portrait','立花理香','雑誌「声優パラダイスR vol.23」ゲーマーズ特典ブロマイド','2018/03/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589422.jpg' ,'portrait','立花理香','バストアップ・衣装黒・体左向き/CD「Flora」発売記念イベント AKIHABARAゲーマーズ本店会場限定お渡し会特典ブロマイド','2018/02/28'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg415349.jpg' ,'portrait','立花理香','CD「Flora」アニメイト特典ブロマイド','2018/02/28'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg415348.jpg' ,'portrait','立花理香','CD「Flora」ゲーマーズ特典ブロマイド','2018/02/28'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/bg415349.jpg' ,'portrait','立花理香','CD「Flora」アニメイト特典ブロマイド','2018/02/28'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3659821.jpg' ,'portrait','立花理香','雑誌「アニメディア 2018年3月号」アニメイト特典生写真','2018/02/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg558616.jpg' ,'portrait','立花理香','雑誌「アニメディア 2018年3月号」ゲーマーズ特典ブロマイド','2018/02/10'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548876.jpg' ,'portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548880.jpg' ,'portrait','東山奈央','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565930.jpg' ,'portrait','東山奈央','印刷サイン、メッセージ入り/CD「Special Thanks!」楽天ブックス特典ブロマイド','2020/08/05'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565923.jpg' ,'portrait','東山奈央','印刷サイン、メッセージ入り・2Lサイズ/CD「Special Thanks!」通常盤 アニメイト特典ブロマイド','2020/08/05'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538101.jpg' ,'portrait','東山奈央','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361093.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」アニメイト特典ブロマイド','2020/02/05'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361098.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」とらのあな特典ブロマイド','2020/02/05'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361096.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」TSUTAYA特典ブロマイド','2020/02/05'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361101.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」楽天ブックス特典ブロマイド','2020/02/05'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg743843.jpg' ,'portrait','東山奈央','印刷サイン入り/Blu-ray「1st TOUR”LIVE Infinity”at パシフィコ横浜」HMV特典ブロマイド','2019/12/18'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg062399.jpg' ,'portrait','東山奈央','雑誌「声優グランプリ 2019年5月号」ゲーマーズ特典ブロマイド','2019/04/10'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031036.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」ゲーマーズ特典ブロマイド','2019/04/03'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031035.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」アニメイト特典ブロマイド','2019/04/03'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031037.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」TOWER RECORDS特典ブロマイド','2019/04/03'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031042.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」アニメガ・文教堂特典ブロマイド','2019/04/03'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031038.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」TSUTAYA特典ブロマイド','2019/04/03'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031040.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」とらのあな特典ブロマイド','2019/04/03'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031044.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・2Lサイズ/CD「群青インフィニティ」Neowing特典ポートレイト','2019/04/03'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031039.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」HMV特典ブロマイド','2019/04/03'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/bg031038.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り/CD「群青インフィニティ」TSUTAYA特典ブロマイド','2019/04/03'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031020.jpg' ,'portrait','東山奈央','雑誌「Pick-up Voice 2019年5月号 vol.134」ゲーマーズ/アニメガ・文教堂特典フォト','2019/03/26'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg031013.jpg' ,'portrait','東山奈央','雑誌「Pick-up Voice 2019年5月号 vol.134」公式オンラインストア(EMTG STORE)特典フォト','2019/03/26'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730836.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「虹のむこうへ」/CD「灯火のまにまに」アニメイト特典ブロマイド','2018/05/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3802334.jpg' ,'portrait','東山奈央','横型・印刷サイン・メッセージ入り「わちゃわちゃと...」/Blu-ray「1st LIVE 『Rainbow』 at 日本武道館」ゲーマーズ特典ブロマイド','2018/05/30'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730846.jpg' ,'portrait','東山奈央','印刷サイン入り/Blu-ray「1st LIVE 『Rainbow』 at 日本武道館」とらのあな特典ブロマイド','2018/05/30'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730839.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「あなたの未来に」/CD「灯火のまにまに」とらのあな特典ブロマイド','2018/05/30'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730837.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「うららかな春の」/CD「灯火のまにまに」TSUTAYA特典ブロマイド','2018/05/30'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730835.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「あなたの心に/CD「灯火のまにまに」ビクターエンタテインメント オンラインショップ特典ブロマイド','2018/05/30'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730838.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「この歌声が」/CD「灯火のまにまに」HMV特典ブロマイド','2018/05/30'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730840.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「心躍る 今この瞬間」/CD「灯火のまにまに」ソフマップ特典ブロマイド','2018/05/30'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730841.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「私の大好きで大切な」/CD「灯火のまにまに」Neowing特典ブロマイド','2018/05/30'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730842.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「この春、あなたにステキなことが」/CD「灯火のまにまに」TOWER RECORDS特典ブロマイド','2018/05/30'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3730847.jpg' ,'portrait','東山奈央','印刷サイン入り・2Lサイズ/Blu-ray「1st LIVE 『Rainbow』 at 日本武道館」Neowing特典ポートレイト','2018/05/30'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3726719.jpg' ,'portrait','東山奈央','衣装黒/雑誌「別冊CD＆DLでーた My Girl vol.22 “VOICE ACTRESS EDITION”」ゲーマーズ特典生写真','2018/05/29'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3726718.jpg' ,'portrait','東山奈央','衣装白/雑誌「別冊CD＆DLでーた My Girl vol.22 “VOICE ACTRESS EDITION”」ゲーマーズ特典生写真','2018/05/29'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3642414.jpg' ,'portrait','東山奈央','横型・印刷サイン・メッセージ入り/ゲーマーズ限定フェア「2018年は戌年だよ!フライングドッグまつり」','2018/01/01'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3606661.jpg' ,'portrait','東山奈央','横型・膝上・衣装白・右手人差し指口元・印刷サイン・メッセージ入り/CD「Rainbow」発売記念 抽選会特典ブロマイド','2017/10/25'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3542275.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「一人じゃない 大丈夫さ。」/CD「Rainbow」とらのあな特典ブロマイド','2017/10/25'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/g3542276.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「せーの、レインボーポーズ」/CD「Rainbow」セブンネット特典ブロマイド','2017/10/25'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/g3542270.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「虹色の未来に向かって!」/CD「Rainbow」ビクターエンタテインメント オンラインショップ特典ブロマイド','2017/10/25'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/g3542271.jpg' ,'portrait','東山奈央','印刷サイン・メッセージ入り・「まごころたっぷりのアルバム」/CD「Rainbow」TSUTAYA特典ブロマイド','2017/10/25'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg803405.jpg' ,'portrait','和氣あず未','1stフォトブック「AZU YOU」アニメイト特典ブロマイド','2021/02/14'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg519708.jpg' ,'portrait','和氣あず未','バストアップ・衣装黒・背景白・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516387.jpg' ,'portrait','和氣あず未','横型・バストアップ・衣装ピンク・ナース服・左向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516388.jpg' ,'portrait','和氣あず未','横型・バストアップ・衣装赤・白・右向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516389.jpg' ,'portrait','和氣あず未','横型・上半身・衣装白・背景緑・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516381.jpg' ,'portrait','和氣あず未','上半身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516382.jpg' ,'portrait','和氣あず未','膝上/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516383.jpg' ,'portrait','和氣あず未','全身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453329.jpg' ,'portrait','和氣あず未','CD「ふわっと/シトラス」(通常盤)とらのあな特典ブロマイド','2020/01/29'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453333.jpg' ,'portrait','和氣あず未','うつ伏せ・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念アニメイト限定フェア 応援メッセージキャンペーン特典ブロマイド','2020/01/28'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453334.jpg' ,'portrait','和氣あず未','全身・座り・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/01/28'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368085.jpg' ,'portrait','和氣あず未','全身/「少女☆歌劇 レヴュースタァライト 3rdスタァライブ”Starry Diamond”」ブロマイド','2019/11/03'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368087.jpg' ,'portrait','和氣あず未','背景黒/「少女☆歌劇 レヴュースタァライト 3rdスタァライブ”Starry Diamond”」ブロマイド','2019/11/03'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg368086.jpg' ,'portrait','和氣あず未','膝上/「少女☆歌劇 レヴュースタァライト 3rdスタァライブ”Starry Diamond”」ブロマイド','2019/11/03'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857039.jpg' ,'portrait','和氣あず未','バストアップ・衣装青白・両手合わせ・笑顔・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857040.jpg' ,'portrait','和氣あず未','上半身・衣装白青・両手組み・口閉じ・顔左向き・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857041.jpg' ,'portrait','和氣あず未','上半身・衣装白青・両手合わせ・顔斜め左向き・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857042.jpg' ,'portrait','和氣あず未','上半身・衣装青白・両手組み・目線左上/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857043.jpg' ,'portrait','和氣あず未','膝上・衣装青白・両手組み・体正面・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857044.jpg' ,'portrait','和氣あず未','膝上・衣装青白・左手胸元・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857045.jpg' ,'portrait','和氣あず未','膝上・衣装白青・左手上げ・口閉じ・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3857046.jpg' ,'portrait','和氣あず未','膝上・衣装青白・左手肩・背景グレー/爆走おとな小学生 第三回特別授業「ヲトメ噺～女学生見聞録鍵奇譚～」キャストブロマイド','2017/12/13'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg597730.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Crossing Road」アニメイト特典ブロマイド','2020/04/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg658331.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Love Summer!」楽天ブックス特典ブロマイド','2019/08/28'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg658328.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Love Summer!」ゲーマーズ特典ブロマイド','2019/08/28'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964143.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・2Lサイズ/CD「Journey ＆ My music」アニメイト特典ブロマイド','2019/01/23'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964144.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Journey ＆ My music【通常盤】」とらのあな特典ブロマイド','2019/01/23'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964146.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Journey ＆ My music」TSUTAYA特典ブロマイド','2019/01/23'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964147.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り/CD「Journey ＆ My music」Amazon特典ブロマイド','2019/01/23'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3964148.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・2Lサイズ/CD「Journey ＆ My music」L-MART/A!SMART/BVC特典ブロマイド','2019/01/23'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3863433.jpg' ,'portrait','渕上舞','CD「リベラシオン」とらのあな特典ブロマイド','2018/10/24'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/g3863435.jpg' ,'portrait','渕上舞','CD「リベラシオン」TSUTAYA特典ブロマイド','2018/10/24'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/g3863432.jpg' ,'portrait','渕上舞','CD「リベラシオン」アニメイト特典ブロマイド','2018/10/24'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3863434.jpg' ,'portrait','渕上舞','CD「リベラシオン」ソフマップ特典ブロマイド','2018/10/24'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3787036.jpg' ,'portrait','渕上舞','CD「Rainbow Planet」TOWER RECORDS特典ブロマイド','2018/08/08'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/g3787034.jpg' ,'portrait','渕上舞','CD「Rainbow Planet」アニメイト特典ブロマイド','2018/08/08'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/g3787035.jpg' ,'portrait','渕上舞','CD「Rainbow Planet」とらのあな特典ブロマイド','2018/08/08'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/g3782964.jpg' ,'portrait','渕上舞','雑誌「Pick-up Voice 2018年9月号 vol.126」公式オンラインストア(EMTG STORE)特典フォト','2018/07/26'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622675.jpg' ,'portrait','渕上舞','2Lサイズ・印刷サイン・メッセージ入り・「気に入ってもらえる曲がありますように...」/CD「Fly High Myway!」アニメイト特典ブロマイド','2018/01/24'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622676.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・「買ってくれてありがとう」/CD「Fly High Myway!」とらのあな特典ブロマイド','2018/01/24'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622677.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・「渕上舞だよー」/CD「Fly High Myway!」ソフマップ特典ブロマイド','2018/01/24'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622678.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・「羽ばたけ!!!」/CD「Fly High Myway!」TOWER RECORD特典ブロマイド','2018/01/24'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3622680.jpg' ,'portrait','渕上舞','印刷サイン・メッセージ入り・「Fly High Myway!」/CD「Fly High Myway!」Amazon特典ブロマイド','2018/01/24'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3609180.jpg' ,'portrait','渕上舞','雑誌「声優アニメディア 2018年2月号」ゲーマーズ特典生写真','2018/01/10'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3609178.jpg' ,'portrait','渕上舞','雑誌「声優アニメディア 2018年2月号」アニメイト特典生写真','2018/01/10'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3646109.jpg' ,'portrait','渕上舞','雑誌「Pick-up Voice 2月号 vol.119」ゲーマーズ特典フォト','2017/12/26'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/g3593890.jpg' ,'portrait','渕上舞','Debut Album 「Fly High Myway!」 1.24 Release!!/雑誌「Pick-up Voice 2018年2月号 vol.119」公式オンラインストア(EMTG STORE)特典フォト','2017/12/26'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/g3494175.jpg' ,'portrait','渕上舞','上半身・衣装白・両手タンス・背景青/Trident Artist Book「Blue Memory」ゲーマーズ特典ブロマイド','2016/07/01'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/g3494180.jpg' ,'portrait','渕上舞','上半身・座り・衣装白・右手顎・左手伸ばし・パー・背景青/Trident Artist Book「Blue Memory」通販予約特典ブロマイド','2016/07/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686794.jpg' ,'portrait','渕上舞','上半身・衣装白・両手広げ・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」お渡し会特典','2016/03/05'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686789.jpg' ,'portrait','渕上舞','バストアップ・右手鳥・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」アニメイト特典','2016/02/18'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686790.jpg' ,'portrait','渕上舞','横型・上半身・両手絵馬・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」とらのあな特典','2016/02/18'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686793.jpg' ,'portrait','渕上舞','横型・バストアップ・口開け・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」ショップ.学研特典','2016/02/18'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686791.jpg' ,'portrait','渕上舞','全身・車・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」アニメガ特典','2016/02/18'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/g3686792.jpg' ,'portrait','渕上舞','膝上・ぶたの乗り物・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」ゲーマーズ特典','2016/02/18'],






];
//first 3 pages of each tag
