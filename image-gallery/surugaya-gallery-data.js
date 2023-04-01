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
	list+= ("["+(counter++)+",'"+newurl+".jpg' ,null,'"+tag+"','"+detail+"','"+date+"'],") + '\n';
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
    list+= ("["+(counter++)+",'"+newurl+"',null,'"+tag+"','"+detail+"'],") + '\n';
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
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl826262.jpg' ,null,'竹達彩奈','印刷サイン・メッセージ入り/CD「明日のカタチ」アニメイト特典ブロマイド','2023/03/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl802820.jpg' ,null,'長江里加','写真集「Re：color」アニメイト特典ブロマイド','2023/02/22'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl802821.jpg' ,null,'長江里加','写真集「Re：color」ゲーマーズ特典ブロマイド','2023/02/22'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl802822.jpg' ,null,'長江里加','写真集「Re：color」ゲーマーズ大宮店・ゲーマーズオンラインショップ特典ブロマイド','2023/02/22'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800800.jpg' ,null,'水瀬いのり','印刷サイン、メッセージ入り/「いのりまち町民集会2023」会場限定CD・Blu-ray購入特典ブロマイド','2023/02/19'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl793463.jpg' ,null,'鬼頭明里','鬼頭明里写真集「my pace」アニメイト特典ブロマイド','2023/02/13'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gl793465.jpg' ,null,'鬼頭明里','鬼頭明里写真集「my pace」ゲーマーズ特典ブロマイド','2023/02/13'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800775.jpg' ,null,'上坂すみれ','れんぽうのメリークリスマス ～すみぺ三十路大爆発city～ ブックレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800782.jpg' ,null,'上坂すみれ','SUMIRE UESAKA LIVE TOUR 2022 超・革命伝説 パンフレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800783.jpg' ,null,'上坂すみれ','SUMIRE UESAKA LIVE TOUR 2022 超・革命伝説 パンフレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800784.jpg' ,null,'上坂すみれ','SUMIRE UESAKA LIVE TOUR 2022 超・革命伝説 パンフレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800773.jpg' ,null,'上坂すみれ','れんぽうのメリークリスマス ～すみぺ三十路大爆発city～ ブックレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800777.jpg' ,null,'上坂すみれ','ライブフォト/れんぽうのメリークリスマス ～すみぺ三十路大爆発city～ イベント写真/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gl800774.jpg' ,null,'上坂すみれ','れんぽうのメリークリスマス ～すみぺ三十路大爆発city～ ブックレットアザーカット/「革ブロ総決起集会 同盟結成十周年記念祝賀大会-」ランダムブロマイド','2023/02/11'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl793466.jpg' ,null,'鬼頭明里','鬼頭明里写真集「my pace」発売記念パネル展 AKIHABARAゲーマーズ本店・ODAIBAゲーマーズ特典ブロマイド','2023/02/09'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl787576.jpg' ,null,'雨宮天','雑誌「声優グランプリ 2023年3月号」ゲーマーズ特典ブロマイド','2023/02/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl787579.jpg' ,null,'雨宮天','雑誌「声優グランプリ 2023年3月号」セブンネット・楽天特典ブロマイド','2023/02/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl753922.jpg' ,null,'高橋李依','雑誌「声優グランプリ 2023年2月号」セブンネット・楽天特典ブロマイド','2023/01/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl710429.jpg' ,null,'上坂すみれ','2Lサイズ/雑誌「声優グランプリ 2023年1月号」主婦の友インフォスSHOP特典ブロマイド','2022/12/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl710423.jpg' ,null,'上坂すみれ','雑誌「声優グランプリ 2023年1月号」アニメイト特典ブロマイド','2022/12/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl710425.jpg' ,null,'上坂すみれ','雑誌「声優グランプリ 2023年1月号」ゲーマーズ特典ブロマイド','2022/12/09'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gl703371.jpg' ,null,'豊田萌絵','「豊田萌絵 2023カレンダー」アニメイト特典ブロマイド','2022/12/03'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gl715003.jpg' ,null,'夏川椎菜','ライブフォト・横型/Blu-ray「夏川椎菜 2nd Live Tour MAKEOVER」ゲーマーズ特典ブロマイド','2022/11/30'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gl735372.jpg' ,null,'和氣あず未','印刷サイン・メッセージ入り/CD「STAY BEAUTIFUL STAY BEAUTIFUL[通常盤]」アニメイト特典ブロマイド','2022/11/30'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gl735373.jpg' ,null,'和氣あず未','印刷サイン・メッセージ入り/CD「STAY BEAUTIFUL STAY BEAUTIFUL[初回限定盤]」ゲーマーズ特典ブロマイド','2022/11/30'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl735370.jpg' ,null,'和氣あず未','CD「STAY BEAUTIFUL STAY BEAUTIFUL」発売記念ポスタージャックキャンペーン in アニメイト特典ブロマイド','2022/11/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl714993.jpg' ,null,'夏川椎菜','CD「ササクレ」ゲーマーズ特典ブロマイド','2022/11/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl714992.jpg' ,null,'夏川椎菜','CD「ササクレ」アニメイト特典ブロマイド','2022/11/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl695517.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「ANTHOLOGY ＆ DESTINY」ゲーマーズ特典ブロマイド','2022/10/26'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl695516.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「ANTHOLOGY ＆ DESTINY」アニメイト特典ブロマイド','2022/10/26'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl659447.jpg' ,null,'高野麻里佳','印刷サイン入り/CD「LOVE＆MOON[初回限定盤]」アニメイト特典ブロマイド','2022/10/12'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl708864.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Luminous」アニメイト特典ブロマイド','2022/10/12'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl708866.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Luminous」ゲーマーズ特典ブロマイド','2022/10/12'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl626668.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り/CD「Welcome to MY WONDERLAND」アニメイト限定セット特典ブロマイド','2022/09/28'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl592786.jpg' ,null,'東山奈央','雑誌「声優グランプリ 2022年10月号」アニメイト特典ブロマイド','2022/09/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572007.jpg' ,null,'水瀬いのり','膝上/「Inori Minase LIVE TOUR 2022 glow」生写真A','2022/09/03'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572008.jpg' ,null,'水瀬いのり','全身/「Inori Minase LIVE TOUR 2022 glow」生写真A','2022/09/03'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572006.jpg' ,null,'水瀬いのり','横型・バストアップ/「Inori Minase LIVE TOUR 2022 glow」生写真A','2022/09/03'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572010.jpg' ,null,'水瀬いのり','横型・膝上/「Inori Minase LIVE TOUR 2022 glow」生写真B','2022/09/03'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572009.jpg' ,null,'水瀬いのり','バストアップ/「Inori Minase LIVE TOUR 2022 glow」生写真B','2022/09/03'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572011.jpg' ,null,'水瀬いのり','上半身/「Inori Minase LIVE TOUR 2022 glow」生写真B','2022/09/03'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gl529243.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「あの日のことば/Growing」発売記念抽選会 参加賞ブロマイド(ゲーマーズver.)','2022/08/07'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gl529242.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「あの日のことば/Growing」発売記念抽選会 参加賞ブロマイド(アニメイトver.)','2022/08/07'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gl557376.jpg' ,null,'花澤香菜','CD「駆け引きはポーカーフェイス」アニメイト特典ブロマイド','2022/07/20'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl557377.jpg' ,null,'花澤香菜','CD「駆け引きはポーカーフェイス」ゲーマーズ特典ブロマイド','2022/07/20'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl584985.jpg' ,null,'水瀬いのり','印刷サイン、メッセージ入り/CD「glow」アニメイト特典ブロマイド','2022/07/20'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl504524.jpg' ,null,'麻倉もも','雑誌「声優アニメディア 2022年8月号」アニメイト限定版特典ブロマイド','2022/07/08'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl513697.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2022年8月号」アニメイト特典ブロマイド','2022/07/08'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl504523.jpg' ,null,'麻倉もも','雑誌「声優アニメディア 2022年8月号」(通常版)アニメイト特典ブロマイド','2022/07/08'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl529233.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「あの日のことば/Growing」アニメイト特典ブロマイド','2022/06/08'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl529234.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「あの日のことば/Growing」ゲーマーズ特典ブロマイド','2022/06/08'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl476240.jpg' ,null,'富田美憂','印刷サイン・メッセージ入り/CD「OveR」ゲーマーズ特典ブロマイド','2022/04/20'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl476239.jpg' ,null,'富田美憂','印刷サイン・メッセージ入り/CD「OveR」アニメイト特典ブロマイド','2022/04/20'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367769.jpg' ,null,'鬼頭明里','ライブフォト/Blu-ray「鬼頭明里 2nd LIVE『MIRRORS』」アニメイト特典ブロマイド','2022/04/13'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367776.jpg' ,null,'鬼頭明里','ライブフォト・印刷サイン入り/Blu-ray「鬼頭明里 2nd LIVE『MIRRORS』」発売記念店頭抽選会C賞ブロマイド','2022/04/12'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367785.jpg' ,null,'鬼頭明里','横型/ファンクラブイベント「smile giving day vol.2」会場限定 CD・Blu-ray購入特典ブロマイド','2022/04/02'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367783.jpg' ,null,'鬼頭明里','横型/ファンクラブイベント「smile giving day vol.2」会場限定 CD・Blu-ray購入特典ブロマイド','2022/04/02'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367784.jpg' ,null,'鬼頭明里','横型/ファンクラブイベント「smile giving day vol.2」会場限定 CD・Blu-ray購入特典ブロマイド','2022/04/02'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl572562.jpg' ,null,'花澤香菜','上半身/「HANAZAWA KANA Live 2022 “blossom”」ランダムブロマイド','2022/04/01'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl540277.jpg' ,null,'夏川椎菜','雑誌「VOICE BRODY vol.11」ゲーマーズ特典ブロマイド','2022/03/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl347511.jpg' ,null,'麻倉もも','雑誌「声優グランプリ 2022年4月号」アニメイト特典ブロマイド','2022/03/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl347518.jpg' ,null,'麻倉もも','雑誌「声優グランプリ 2022年4月号」とらのあな・楽天ブックス特典ブロマイド','2022/03/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl347513.jpg' ,null,'麻倉もも','雑誌「声優グランプリ 2022年4月号」ゲーマーズ特典ブロマイド','2022/03/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl457368.jpg' ,null,'雨宮天','CD「Love-Evidence」アニメイト特典ブロマイド','2022/03/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367801.jpg' ,null,'麻倉もも','CD「彩色硝子」アニメイト特典ブロマイド','2022/03/02'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl457369.jpg' ,null,'雨宮天','CD「Love-Evidence」ゲーマーズ特典ブロマイド','2022/03/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl299000.jpg' ,null,'高野麻里佳','印刷サイン入り/CD「ひとつ」(通常盤)アニメイト特典ブロマイド','2022/02/23'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl299001.jpg' ,null,'高野麻里佳','印刷サイン入り/CD「ひとつ」(初回限定盤)ゲーマーズ特典ブロマイド','2022/02/23'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl334913.jpg' ,null,'夏川椎菜','横型/CD「コンポジット」アニメイト特典ブロマイド','2022/02/09'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl334911.jpg' ,null,'夏川椎菜','横型/CD「コンポジット」Sony Music Shop特典ブロマイド','2022/02/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl334918.jpg' ,null,'夏川椎菜','横型/CD「コンポジット」HMV特典ブロマイド','2022/02/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl334914.jpg' ,null,'夏川椎菜','横型/CD「コンポジット」ゲーマーズ特典ブロマイド','2022/02/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl350849.jpg' ,null,'高野麻里佳','雑誌「月刊ドラゴンエイジ 2022年3月号」特典生写真','2022/02/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367811.jpg' ,null,'雨宮天','雑誌「My Girl vol.34」アニメイト特典ブロマイド','2022/02/08'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gl367813.jpg' ,null,'雨宮天','雑誌「My Girl vol.34」ゲーマーズ特典ブロマイド','2022/02/08'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344751.jpg' ,null,'TrySail','雨宮天/印刷サイン・メッセージ入り/神戸公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」＜＠Loppi・HMV限定セット＞特典ブロマイド','2022/02/04'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344756.jpg' ,null,'TrySail','麻倉もも/印刷サイン・メッセージ入り/東京公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」アニメイト特典ブロマイド','2022/02/04'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344757.jpg' ,null,'TrySail','雨宮天/印刷サイン・メッセージ入り/東京公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」アニメイト特典ブロマイド','2022/02/04'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344749.jpg' ,null,'TrySail','麻倉もも/横型・印刷サイン・メッセージ入り/神戸公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」＜＠Loppi・HMV限定セット＞特典ブロマイド','2022/02/04'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344753.jpg' ,null,'TrySail','麻倉もも/印刷サイン・メッセージ入り/横浜公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」＠Loppi・HMV/ HMV＆BOOKS online特典ブロマイド','2022/02/04'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344755.jpg' ,null,'TrySail','夏川椎菜/印刷サイン・メッセージ入り/東京公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」アニメイト特典ブロマイド','2022/02/04'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344750.jpg' ,null,'TrySail','夏川椎菜/横型・印刷サイン・メッセージ入り/神戸公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」＜＠Loppi・HMV限定セット＞特典ブロマイド','2022/02/04'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344752.jpg' ,null,'TrySail','夏川椎菜/印刷サイン・メッセージ入り/横浜公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」＠Loppi・HMV/ HMV＆BOOKS online特典ブロマイド','2022/02/04'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl344764.jpg' ,null,'TrySail','麻倉もも/横型・印刷サイン・メッセージ入り/仙台公演/写真集「TrySail LIVE PHOTO BOOK “Re Bon Voyage”」ミュージックレインモール特典ブロマイド','2022/02/04'],

[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl289080.jpg' ,null,'水瀬いのり','雑誌「声優アニメディア 2022年2月号」(通常版)アニメイト特典ブロマイド','2022/01/08'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228673.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」アニメイト特典ブロマイド','2022/01/05'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228684.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」アニメイト限定フェア 2タイプ同時購入特典ブロマイド','2022/01/05'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228674.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」ゲーマーズ特典ブロマイド','2022/01/05'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228683.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」Amazon.co.jp特典ブロマイド','2022/01/05'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228673.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」アニメイト特典ブロマイド','2022/01/05'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl228684.jpg' ,null,'雨宮天','横型/CD「BEST ALBUM - BLUE -/BEST ALBUM - RED -」アニメイト限定フェア 2タイプ同時購入特典ブロマイド','2022/01/05'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl207710.jpg' ,null,'水瀬いのり','全身/「いのりまち町民集会2021-おかわり-」生写真セットB','2021/12/05'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl207706.jpg' ,null,'水瀬いのり','上半身/「いのりまち町民集会2021-おかわり-」生写真セットB','2021/12/05'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl207711.jpg' ,null,'水瀬いのり','バストアップ/「いのりまち町民集会2021-おかわり-」生写真セットB','2021/12/05'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl165067.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「冷めない魔法」アニメイト特典ブロマイド','2021/11/03'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl165068.jpg' ,null,'東山奈央','横型・印刷サイン入り・印刷メッセージ入り/CD「冷めない魔法」ゲーマーズ特典ブロマイド','2021/11/03'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl139632.jpg' ,null,'雨宮天','CD「COVERS-Sora Amamiya favorite songs-」アニメイト特典ブロマイド','2021/10/06'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl139633.jpg' ,null,'雨宮天','CD「COVERS-Sora Amamiya favorite songs-」ゲーマーズ特典ブロマイド','2021/10/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl207071.jpg' ,null,'夏川椎菜','横型・印刷サイン入り/「LAWSON presents TrySail Live Tour 2021 “Re Bon Voyage”」兵庫公演限定 CD「クラクトリトルプライド」購入特典ブロマイド','2021/09/25'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl207069.jpg' ,null,'雨宮天','横型・印刷サイン・メッセージ入り/「LAWSON presents TrySail Live Tour 2021 “Re Bon Voyage”」兵庫公演限定 CD「フリイジア」購入特典ブロマイド','2021/09/25'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl116479.jpg' ,null,'堀江由衣','横型/「黒ネコ集会 Vol.20 消えた黒ネコ 2 ～借りてきたネコ～」配信チケット購入特典生写真','2021/09/12'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gl116478.jpg' ,null,'堀江由衣','「黒ネコ集会 Vol.20 消えた黒ネコ 2 ～借りてきたネコ～」配信チケット購入特典生写真','2021/09/12'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl116480.jpg' ,null,'堀江由衣','横型/「黒ネコ集会 Vol.20 消えた黒ネコ 2 ～借りてきたネコ～」配信チケット購入特典生写真','2021/09/12'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gl109939.jpg' ,null,'花澤香菜','雑誌「声優グランプリ 2021年10月号」アニメイト特典ブロマイド','2021/09/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl109941.jpg' ,null,'花澤香菜','雑誌「声優グランプリ 2021年10月号」ゲーマーズ特典ブロマイド','2021/09/10'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl139623.jpg' ,null,'麻倉もも','CD「ピンキーフック」ゲーマーズ特典ブロマイド','2021/08/18'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg974822.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Kaleidoscope」ゲーマーズ特典ブロマイド','2021/08/04'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg974821.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Kaleidoscope」アニメイト特典ブロマイド','2021/08/04'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gl104150.jpg' ,null,'鬼頭明里','2Lサイズ/CD「Kaleidoscope」発売記念ディスプレイコンテスト 応援店舗先着特典ブロマイド','2021/08/04'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg974829.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Kaleidoscope」Amazon特典ブロマイド','2021/08/04'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gl253798.jpg' ,null,'夏川椎菜','印刷サイン、メッセージ入り/「LAWSON presents 夏川椎菜 Zepp Live Tour 2020-2021 Pre-2nd」ダイバーシティ(東京)公演 開催記念 Blu-ray「417Pちゃんねる うるとらすぺしゃる」アニメイト通販特設ページ購入特典ブロマイド','2021/07/29'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg963013.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「HELLO HORIZON」キンクリ堂特典ブロマイド','2021/07/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg963021.jpg' ,null,'雨宮天','CD「フリイジア」アニメイト特典ブロマイド','2021/07/21'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg963031.jpg' ,null,'雨宮天','CD「フリイジア」楽天ブックス特典ブロマイド','2021/07/21'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg963022.jpg' ,null,'雨宮天','CD「フリイジア」ゲーマーズ特典ブロマイド','2021/07/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919886.jpg' ,null,'高野麻里佳','印刷サイン・メッセージ入り/CD「New story」(通常盤)アニメイト特典ブロマイド','2021/07/14'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919885.jpg' ,null,'高野麻里佳','印刷サイン・メッセージ入り/CD「New story」(初回限定盤)アニメイト特典ブロマイド','2021/07/14'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919887.jpg' ,null,'高野麻里佳','印刷サイン・メッセージ入り/CD「New story」(通常盤)ゲーマーズ特典ブロマイド','2021/07/14'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919895.jpg' ,null,'高野麻里佳','印刷サイン入り/CD「New story」TSUTAYA RECORDS特典ブロマイド','2021/07/14'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919884.jpg' ,null,'高野麻里佳','横型/CD「New story」発売記念 アニメイト ポスタージャックキャンペーン 対象商品購入特典ブロマイド','2021/07/13'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg944191.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2021年8月号」アニメイト特典ブロマイド','2021/07/09'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg944195.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2021年8月号」とらのあな・セブンネット特典ブロマイド','2021/07/09'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg944193.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2021年8月号」ゲーマーズ特典ブロマイド','2021/07/09'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg944197.jpg' ,null,'水瀬いのり','横型/雑誌「声優グランプリ 2021年8月号」HMV・メロンブックス・アニメガ×ソフマップ・他対象店舗特典ブロマイド','2021/07/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gl139591.jpg' ,null,'豊崎愛生','CD「caravan!」アニメイト特典ブロマイド','2021/06/30'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg975325.jpg' ,null,'富田美憂','印刷サイン、メッセージ入り/CD「Prologue」アニメイト特典ブロマイド','2021/06/30'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg975326.jpg' ,null,'富田美憂','印刷サイン、メッセージ入り/CD「Prologue」ゲーマーズ特典ブロマイド','2021/06/30'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg918538.jpg' ,null,'鬼頭明里','雑誌「VOICE+ Vol.1」アニメイト特典ブロマイド','2021/06/29'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg918545.jpg' ,null,'鬼頭明里','雑誌「VOICE+ Vol.1」楽天ブックス特典ブロマイド','2021/06/29'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg960993.jpg' ,null,'富田美憂','雑誌「My Girl ～EJ My Girl Festival 2021 Special Edition～」会場物販特典ブロマイド','2021/06/20'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919860.jpg' ,null,'小松未可子','CD「悔しいことは蹴っ飛ばせ」アニメイト特典ブロマイド','2021/05/26'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919850.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り・2Lサイズ/CD「off」アニメイト特典ブロマイド','2021/05/12'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg861268.jpg' ,null,'雨宮天','CD「永遠のAria」アニメイト特典ブロマイド','2021/05/12'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg919848.jpg' ,null,'東山奈央','横型/CD「off」発売記念店頭抽選会参加賞 アニメイト特典ブロマイド','2021/05/11'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg851815.jpg' ,null,'上坂すみれ','雑誌「声優アニメディア 2021年6月号」HMV特典ブロマイド','2021/05/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg846678.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「EASY LOVE」アニメイト特典ブロマイド','2021/04/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg799405.jpg' ,null,'雨宮天','雑誌「声優グランプリ 2021年5月号」アニメイト特典ブロマイド','2021/04/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg865439.jpg' ,null,'悠木碧','印刷サイン入り/CD「ぐだふわエブリデー」その他拠点店特典ブロマイド','2021/04/07'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg807641.jpg' ,null,'鬼頭明里','雑誌「My Girl vol.32」Amazon特典ブロマイド','2021/03/31'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg807637.jpg' ,null,'鬼頭明里','雑誌「My Girl vol.32」アニメイト特典ブロマイド','2021/03/31'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg807639.jpg' ,null,'鬼頭明里','横型/雑誌「My Girl vol.32」ゲーマーズ特典ブロマイド','2021/03/31'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg790052.jpg' ,null,'水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase 5th ANNIVERSARY LIVE Starry Wishes」アニメイト特典ブロマイド','2021/03/24'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765933.jpg' ,null,'茅野愛衣','雑誌「声優グランプリ2021年4月号」特典ブロマイド','2021/03/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg765931.jpg' ,null,'茅野愛衣','雑誌「声優グランプリ2021年4月号」アニメイト特典ブロマイド','2021/03/10'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg786863.jpg' ,null,'茅野愛衣','印刷サイン・メッセージ入り/10thメモリアル ブック＆ミニアルバム「むすんでひらいて」楽天ブックス特典ブロマイド','2021/03/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg786855.jpg' ,null,'茅野愛衣','印刷サイン・メッセージ入り/10thメモリアル ブック＆ミニアルバム「むすんでひらいて」Amazon特典ブロマイド','2021/03/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg786854.jpg' ,null,'茅野愛衣','印刷サイン・メッセージ入り/10thメモリアル ブック＆ミニアルバム「むすんでひらいて」アニメイト特典ブロマイド','2021/03/10'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg803405.jpg' ,null,'和氣あず未','1stフォトブック「AZU YOU」アニメイト特典ブロマイド','2021/02/14'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg736849.jpg' ,null,'夏川椎菜','CD「クラクトリトルプライド」アニメイト特典ブロマイド','2021/01/06'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/bg679212.jpg' ,null,'水瀬いのり','雑誌「声優アニメディア 2021年1月号」アニメイト特典ブロマイド','2020/12/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg732192.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「Starlight Museum」Neowing特典ブロマイド','2020/12/02'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg732191.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「Starlight Museum」HMV特典ブロマイド','2020/12/02'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679208.jpg' ,null,'麻倉もも','上半身/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679209.jpg' ,null,'麻倉もも','バストアップ/雑誌「VOICE BRODY vol.9」アニメイト特典ブロマイド','2020/12/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657800.jpg' ,null,'麻倉もも','膝上・印刷サイン・メッセージ入り/CD「僕だけに見える星」LAWSON presents 麻倉もも Live 2020 ”Agapanthus”開催記念 会場CD即売ブース・対象期間限定アニメイト通販特典ブロマイド','2020/11/13'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657824.jpg' ,null,'富田美憂','印刷サイン・メッセージ入り/CD「Broken Sky」アニメイト特典ブロマイド','2020/11/11'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657807.jpg' ,null,'麻倉もも','CD「僕だけに見える星」アニメイト特典ブロマイド','2020/11/11'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657808.jpg' ,null,'麻倉もも','CD「僕だけに見える星」ゲーマーズ特典ブロマイド','2020/11/11'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg657804.jpg' ,null,'麻倉もも','バストアップ・印刷サイン・メッセージ入り/アニメイト限定フェア「LAWSON presents 麻倉もも Live 2020 ”Agapanthus”応援フェア」特典ブロマイド','2020/11/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg629657.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「キミのとなりで」ゲーマーズ特典ブロマイド','2020/10/28'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg629660.jpg' ,null,'鬼頭明里','CD「キミのとなりで」TOWER RECORDS特典ブロマイド','2020/10/28'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg683922.jpg' ,null,'富田美憂','雑誌「VOICE Channel vol.13」ゲーマーズ特典ブロマイド','2020/10/28'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg607965.jpg' ,null,'鬼頭明里','雑誌「月刊ドラゴンエイジ 2020年 10月号増刊 ヤングドラゴンエイジ Vol.4」アニメイト特典ブロマイド','2020/09/28'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg607966.jpg' ,null,'鬼頭明里','雑誌「月刊ドラゴンエイジ 2020年 10月号増刊 ヤングドラゴンエイジ Vol.4」ゲーマーズ特典ブロマイド','2020/09/28'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679326.jpg' ,null,'鬼頭明里','膝上/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット A','2020/09/19'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679328.jpg' ,null,'鬼頭明里','バストアップ/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679332.jpg' ,null,'鬼頭明里','膝上/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット C','2020/09/19'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679331.jpg' ,null,'鬼頭明里','横型・顔アップ/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット C','2020/09/19'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679325.jpg' ,null,'鬼頭明里','横型・上半身/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット A','2020/09/19'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679330.jpg' ,null,'鬼頭明里','横型・バストアップ/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679329.jpg' ,null,'鬼頭明里','横型・全身/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット B','2020/09/19'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679327.jpg' ,null,'鬼頭明里','上半身/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット A','2020/09/19'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg679333.jpg' ,null,'鬼頭明里','膝上/「鬼頭明里 1st LIVE TOUR 『Colorful Closet』」ブロマイドセット C','2020/09/19'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576075.jpg' ,null,'夏川椎菜','横型・全身・膝立ち・衣装白・左向き/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576076.jpg' ,null,'夏川椎菜','横型・バストアップ・衣装紫・両手曲げ/雑誌「声優グランプリ 2020年10月号」アニメイト特典ブロマイド','2020/09/10'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg576078.jpg' ,null,'夏川椎菜','雑誌「声優グランプリ 2020年10月号」ゲーマーズ特典ブロマイド','2020/09/10'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589429.jpg' ,null,'夏川椎菜','CD「アンチテーゼ」アニメイト特典ブロマイド','2020/09/09'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589433.jpg' ,null,'夏川椎菜','CD「アンチテーゼ」TOWER RECORDS特典ブロマイド','2020/09/09'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589441.jpg' ,null,'雨宮天','CD「Paint it，BLUE」アニメイト特典ブロマイド','2020/09/02'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548877.jpg' ,null,'高橋李依','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548881.jpg' ,null,'高橋李依','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548879.jpg' ,null,'悠木碧','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548875.jpg' ,null,'悠木碧','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548876.jpg' ,null,'東山奈央','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548880.jpg' ,null,'東山奈央','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548874.jpg' ,null,'雨宮天','雑誌「声優グランプリ 2020年9月号」アニメイト特典ブロマイド','2020/08/06'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg548878.jpg' ,null,'雨宮天','雑誌「声優グランプリ 2020年9月号」ゲーマーズ・とらのあな・HMV＆BOOKS・セブンネット特典ブロマイド','2020/08/06'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565923.jpg' ,null,'東山奈央','印刷サイン、メッセージ入り・2Lサイズ/CD「Special Thanks!」通常盤 アニメイト特典ブロマイド','2020/08/05'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg565930.jpg' ,null,'東山奈央','印刷サイン、メッセージ入り/CD「Special Thanks!」楽天ブックス特典ブロマイド','2020/08/05'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538102.jpg' ,null,'高橋李依','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538100.jpg' ,null,'悠木碧','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538101.jpg' ,null,'東山奈央','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg538099.jpg' ,null,'雨宮天','雑誌「My Girl vol.30」アニメイト特典ブロマイド','2020/08/03'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg609044.jpg' ,null,'高野麻里佳','印刷サイン・メッセージ入り/CD「Theory of evolution」KING e-SHOP特典ブロマイド','2020/07/22'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg753284.jpg' ,null,'豊田萌絵','ライブフォト/「IDOL舞SHOWト2ndシングル発売記念トーク＆ライブ!～ドルショウ夏の陣2020～」ライブL判ブロマイド グループセット','2020/07/12'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg753301.jpg' ,null,'豊田萌絵','ライブフォト・2Lサイズ/「IDOL舞SHOWト2ndシングル発売記念トーク＆ライブ!～ドルショウ夏の陣2020～」ライブ 2L ソロブロマイド','2020/07/12'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522955.jpg' ,null,'雨宮天','雑誌「声優グランプリ2020年8月号」アニメイト限定特典ブロマイド','2020/07/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522946.jpg' ,null,'古賀葵','雑誌「声優アニメディア 2020年8月号」アニメイト限定特典ブロマイド','2020/07/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg522957.jpg' ,null,'雨宮天','雑誌「声優グランプリ2020年8月号」HMV＆BOOKS限定特典ブロマイド','2020/07/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg603165.jpg' ,null,'雨宮天','ライブフォト/Blu-ray「雨宮天 LIVE 2020 The Clearest SKY」発売応援CP第一弾 アニメイトチェーンWEB抽選企画 参加賞ブロマイド','2020/07/08'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg511118.jpg' ,null,'豊田萌絵','雑誌「月刊ドラゴンエイジ 2020年 7月号増刊 ヤングドラゴンエイジ Vol.3」ゲーマーズ特典ブロマイド','2020/06/25'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533714.jpg' ,null,'水瀬いのり','全身・しゃがみ・衣装白・青/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533718.jpg' ,null,'水瀬いのり','上半身・衣装黒・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533715.jpg' ,null,'水瀬いのり','膝上・衣装白・水色・左手上げ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533716.jpg' ,null,'水瀬いのり','バストアップ・衣装白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533717.jpg' ,null,'水瀬いのり','全身・座り・衣装オレンジ・白/「Inori Minase LIVE TOUR 2020 We Are Now」生写真B','2020/06/21'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg533713.jpg' ,null,'水瀬いのり','バストアップ・衣装オレンジ/「Inori Minase LIVE TOUR 2020 We Are Now」生写真A','2020/06/21'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg540831.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「STYLE」アニメイト特典ブロマイド','2020/06/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg540835.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「STYLE」とらのあな特典ブロマイド','2020/06/10'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg519708.jpg' ,null,'和氣あず未','バストアップ・衣装黒・背景白・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516389.jpg' ,null,'和氣あず未','横型・上半身・衣装白・背景緑・印刷サイン・メッセージ入り/「あじゅじゅ2ndシングル発売おめでとう企画!はずれなし抽選会!」ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/06/09'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516387.jpg' ,null,'和氣あず未','横型・バストアップ・衣装ピンク・ナース服・左向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516388.jpg' ,null,'和氣あず未','横型・バストアップ・衣装赤・白・右向き・印刷サイン・メッセージ入り/和氣あず未 2ndシングル「Hurry Love／恋と呼ぶには」発売記念抽選会 とらのあな抽選会 特別賞 特典ブロマイド','2020/06/09'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg497028.jpg' ,null,'富田美憂','印刷サイン入り/CD「翼と告白」コロムビアミュージックショップ特典ブロマイド','2020/06/03'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg497021.jpg' ,null,'富田美憂','印刷サイン入り/CD「翼と告白」とらのあな特典ブロマイド','2020/06/03'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg497020.jpg' ,null,'富田美憂','印刷サイン入り/CD「翼と告白」ゲーマーズ特典ブロマイド','2020/06/03'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg497019.jpg' ,null,'富田美憂','印刷サイン入り/CD「翼と告白」アニメイト特典ブロマイド','2020/06/03'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477503.jpg' ,null,'鬼頭明里','雑誌「声優グランプリ 2020年6月号」アニメイト特典ブロマイド','2020/05/09'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477504.jpg' ,null,'鬼頭明里','雑誌「声優グランプリ 2020年6月号」ゲーマーズ特典ブロマイド','2020/05/09'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477505.jpg' ,null,'鬼頭明里','雑誌「声優グランプリ 2020年6月号」とらのあな・HMV＆BOOKS特典ブロマイド','2020/05/09'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg477506.jpg' ,null,'鬼頭明里','雑誌「声優グランプリ 2020年6月号」セブンネット・アニメガ×ソフマップ・マルサン書店・書泉ブックタワー・星野書店近鉄パッセ店特典ブロマイド','2020/05/09'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg518235.jpg' ,null,'麻倉もも','雑誌「B.L.T. VOICE GIRLS Vol.42」先着購入者特典 アニメイト/ゲーマーズ Ver.','2020/05/02'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg597730.jpg' ,null,'渕上舞','印刷サイン・メッセージ入り/CD「Crossing Road」アニメイト特典ブロマイド','2020/04/29'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516382.jpg' ,null,'和氣あず未','膝上/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516383.jpg' ,null,'和氣あず未','全身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516381.jpg' ,null,'和氣あず未','上半身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516367.jpg' ,null,'悠木碧','膝上/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516368.jpg' ,null,'悠木碧','全身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg516366.jpg' ,null,'悠木碧','上半身/日本コロムビア創立110周年記念『#コロちゃんフェス』フォトセット','2020/04/24'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589453.jpg' ,null,'麻倉もも','CD「Agapanthus」アニメイト特典ブロマイド','2020/04/08'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg589463.jpg' ,null,'麻倉もも','CD「Agapanthus」ANIPLEX+特典ブロマイド','2020/04/08'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463265.jpg' ,null,'上坂すみれ','上半身・衣装ピンク・右手人差し指顎・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463274.jpg' ,null,'上坂すみれ','バストアップ・衣装黒・左手上げ・右向き/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463270.jpg' ,null,'上坂すみれ','全身・衣装青.白.赤・両手ハサミ・背景オレンジ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463269.jpg' ,null,'上坂すみれ','全身・座り・衣装青・右手膝上・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463271.jpg' ,null,'上坂すみれ','全身・座り・衣装青.白.赤・左手首元・背景オレンジ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463263.jpg' ,null,'上坂すみれ','膝上・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463257.jpg' ,null,'上坂すみれ','バストアップ・衣装白・右向き・背景青/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463266.jpg' ,null,'上坂すみれ','膝上・衣装ピンク・左手頬・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463259.jpg' ,null,'上坂すみれ','バストアップ・衣装赤茶・左手壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778865.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427055.jpg' ,null,'上坂すみれ','横型・上半身・衣装オレンジ・振り返り/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463276.jpg' ,null,'上坂すみれ','バストアップ・衣装黒・両手前・体傾け/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463272.jpg' ,null,'上坂すみれ','全身・座り・衣装黒.青.白・両手交差/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463261.jpg' ,null,'上坂すみれ','全身・座り・衣装赤茶・壺・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463268.jpg' ,null,'上坂すみれ','膝上・衣装青.白・右手扇子・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427053.jpg' ,null,'上坂すみれ','上半身・衣装オレンジ・飲み物/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[15,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427050.jpg' ,null,'上坂すみれ','バストアップ・衣装青.黒・左手胸・背景赤/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[16,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778864.jpg' ,null,'上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[17,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463264.jpg' ,null,'上坂すみれ','上半身・衣装ピンク・両手胸・背景ピンク/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[18,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463267.jpg' ,null,'上坂すみれ','膝上・衣装青.白・右手傘・背景グレー/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[19,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463260.jpg' ,null,'上坂すみれ','バストアップ・背景赤茶・左手胸・背景茶色/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[20,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463262.jpg' ,null,'上坂すみれ','膝上・衣装赤・両手弓・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[21,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427051.jpg' ,null,'上坂すみれ','バストアップ・衣装青.黒・体右向き・背景黒/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[22,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463275.jpg' ,null,'上坂すみれ','バストアップ・衣装黒・両手髪・顔傾げ/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[23,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463273.jpg' ,null,'上坂すみれ','膝上・衣装黒.青.白・両手重ね・右向き/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[24,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778868.jpg' ,null,'上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427054.jpg' ,null,'上坂すみれ','バストアップ・衣装オレンジ・体右向き/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B','2020/04/01'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg427052.jpg' ,null,'上坂すみれ','横型・バストアップ・衣装青.黒・両手頬/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A','2020/04/01'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg463258.jpg' ,null,'上坂すみれ','バストアップ・衣装赤・左手髪・背景緑/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778867.jpg' ,null,'上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg778866.jpg' ,null,'上坂すみれ','「上坂すみれのPROPAGANDA CITY 2020」会員限定コル玉セット PROPAGANDA CITYver.','2020/04/01'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg817394.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/「上坂すみれのPROPAGANDA CITY 2020」キャー変態!!!!ブロマイド第16弾','2020/04/01'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423548.jpg' ,null,'花澤香菜','花澤香菜写真集「How to go?」先着購入特典 アニメイト/書泉グランデ/書泉ブックタワー/芳林堂書店高田馬場店 Ver.','2020/03/16'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423549.jpg' ,null,'花澤香菜','花澤香菜写真集「How to go?」先着購入特典 ゲーマーズ Ver.','2020/03/16'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg423550.jpg' ,null,'花澤香菜','花澤香菜写真集「How to go?」先着購入特典 セブンネットショッピング Ver.','2020/03/16'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397651.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り・2Lサイズ/CD「Desire Again」きゃにめ特典ブロマイド','2020/02/26'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397639.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」ゲーマーズ特典ブロマイド','2020/02/26'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397645.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」HMV特典ブロマイド','2020/02/26'],
[13,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397644.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」TOWER RECORDS特典ブロマイド','2020/02/26'],
[14,'https://cdn.suruga-ya.jp/database/pics_light/game/gg397642.jpg' ,null,'鬼頭明里','印刷サイン・メッセージ入り/CD「Desire Again」とらのあな特典ブロマイド','2020/02/26'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351934.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2020年 3月号」とらのあな・HMV特典ブロマイド','2020/02/10'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351932.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2020年 3月号」アニメイト特典ブロマイド','2020/02/10'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351935.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2020年 3月号」複数店舗共通特典ブロマイド','2020/02/10'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg351933.jpg' ,null,'水瀬いのり','雑誌「声優グランプリ 2020年 3月号」ゲーマーズ特典ブロマイド','2020/02/10'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352074.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」とらのあな特典ブロマイド','2020/02/05'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352076.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」HMV特典ブロマイド','2020/02/05'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352075.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」TOWER RECORDS特典ブロマイド','2020/02/05'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg352077.jpg' ,null,'水瀬いのり','印刷サイン・メッセージ入り/CD「ココロソマリ」Neowing特典ブロマイド','2020/02/05'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361098.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」とらのあな特典ブロマイド','2020/02/05'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361093.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」アニメイト特典ブロマイド','2020/02/05'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361096.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」TSUTAYA特典ブロマイド','2020/02/05'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg361101.jpg' ,null,'東山奈央','印刷サイン・メッセージ入り/CD「歩いていこう!」楽天ブックス特典ブロマイド','2020/02/05'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346544.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346545.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346542.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357555.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346543.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357550.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」ヨドバシ特典ブロマイド','2020/01/31'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357559.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」アニメイト特典ブロマイド','2020/01/31'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357557.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357548.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」HMV特典ブロマイド','2020/01/31'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg357556.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」ゲーマーズ特典ブロマイド','2020/01/31'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg346546.jpg' ,null,'鬼頭明里','鬼頭明里1st写真集「Love Route」初回版封入特典プレミアムブロマイド','2020/01/31'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453329.jpg' ,null,'和氣あず未','CD「ふわっと/シトラス」(通常盤)とらのあな特典ブロマイド','2020/01/29'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453334.jpg' ,null,'和氣あず未','全身・座り・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念ゲーマーズ限定フェア 店頭抽選会D賞ブロマイド','2020/01/28'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg453333.jpg' ,null,'和氣あず未','うつ伏せ・背景水色・シトラス・印刷サイン・メッセージ入り/CD「ふわっと/シトラス」発売記念アニメイト限定フェア 応援メッセージキャンペーン特典ブロマイド','2020/01/28'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328020.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」アニメイト特典ブロマイド','2020/01/22'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328029.jpg' ,null,'上坂すみれ','KGサイズ(ポストカードサイズ)/CD「NEO PROPAGANDA」Neowing特典ポートレート','2020/01/22'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328023.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」ゲーマーズ特典ブロマイド','2020/01/22'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328027.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」多売特典ブロマイド','2020/01/22'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg740539.jpg' ,null,'立花理香','CD「Heart Shaker」ゲーマーズ特典ブロマイド','2020/01/22'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328021.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」とらのあな特典ブロマイド','2020/01/22'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328024.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」TSUTAYA特典ブロマイド','2020/01/22'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg328030.jpg' ,null,'上坂すみれ','印刷サイン・メッセージ入り/CD「NEO PROPAGANDA」TOWER RECORDS特典ブロマイド','2020/01/22'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329048.jpg' ,null,'悠木碧','CD「Unbreakable」とらのあな特典ブロマイド','2020/01/15'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329054.jpg' ,null,'悠木碧','CD「Unbreakable」楽天ブックス特典ブロマイド','2020/01/15'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329051.jpg' ,null,'悠木碧','CD「Unbreakable」HMV特典ブロマイド','2020/01/15'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329049.jpg' ,null,'悠木碧','CD「Unbreakable」ソフマップ・アニメガ特典ブロマイド','2020/01/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329050.jpg' ,null,'悠木碧','CD「Unbreakable」タワーレコード特典ブロマイド','2020/01/15'],
[7,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329052.jpg' ,null,'悠木碧','CD「Unbreakable」TSUTAYA特典ブロマイド','2020/01/15'],
[8,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329053.jpg' ,null,'悠木碧','CD「Unbreakable」WonderGOO・新星堂特典ブロマイド','2020/01/15'],
[9,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329055.jpg' ,null,'悠木碧','CD「Unbreakable」ネオ・ウィング特典ブロマイド','2020/01/15'],
[10,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329056.jpg' ,null,'悠木碧','CD「Unbreakable」コロムビアミュージックショップ特典ブロマイド','2020/01/15'],
[11,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329038.jpg' ,null,'雨宮天','CD「PARADOX」とらのあな特典ブロマイド','2020/01/15'],
[12,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329036.jpg' ,null,'雨宮天','CD「PARADOX」アニメイト特典ブロマイド','2020/01/15'],
[1,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329037.jpg' ,null,'雨宮天','CD「PARADOX」ゲーマーズ特典ブロマイド','2020/01/15'],
[2,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329047.jpg' ,null,'雨宮天','CD「PARADOX」Amazon.co.jp特典ブロマイド','2020/01/15'],
[3,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329045.jpg' ,null,'雨宮天','CD「PARADOX」ANIPLEX+特典ブロマイド','2020/01/15'],
[4,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329040.jpg' ,null,'雨宮天','CD「PARADOX」TOWER RECORDS特典ブロマイド','2020/01/15'],
[5,'https://cdn.suruga-ya.jp/database/pics_light/game/gg329046.jpg' ,null,'雨宮天','CD「PARADOX」楽天ブックス特典ブロマイド','2020/01/15'],
[6,'https://cdn.suruga-ya.jp/database/pics_light/game/gg413110.jpg' ,null,'雨宮天','印刷サイン・メッセージ入り/雨宮天「PARADOX」楽曲・MVヘビロテ応援店舗キャンペーン アニメイト開催店舗限定 対象商品購入特典ブロマイド','2020/01/14'],

];
