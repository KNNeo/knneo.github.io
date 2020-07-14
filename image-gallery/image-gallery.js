//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'','',''],
[1,'SELFSCAN_20140111_0002','portrait','Kotobuki Minako','CD "pretty fever" Animate Bonus'],
[2,'SELFSCAN_20140111_0005','portrait','Hikasa Youko','CD "Seek Diamonds" Animate Bonus'],
[3,'SELFSCAN_20140111_0007','landscape','Tomatsu Haruka','CD "Yume Sekai" ver.6 Bonus'],
[5,'SELFSCAN_20140111_0009','landscape','Taketatsu Ayana','CD "Sinfonia! Sinfonia!!!" Bonus'],
[6,'SELFSCAN_20140111_0010','portrait','Taketatsu Ayana','CD "Onpu no Kuni no Alice" Bonus'],
[7,'SELFSCAN_20140111_0011','portrait','Taketatsu Ayana','CD "Jikuu Tours" Bonus'],
[8,'SELFSCAN_20140307_0001','portrait','Horie Yui','CD "Golden Time" Bonus'],
[11,'SELFSCAN_20140311_0002','landscape','Satou Satomi','CD "Mirai Night" Neowing Bonus'],
[12,'SELFSCAN_20140324_0001','portrait','Horie Yui','CD "The World\'s End" Bonus'],
[13,'SELFSCAN_20140324_0002','portrait','Toyosaki Aki','CD "Delight" Tower Records Bonus'],
[15,'SELFSCAN_20140424_0002','portrait','Kotobuki Minako','CD "Believe x" Sony Music Shop Bonus'],
[16,'SELFSCAN_20140529_0001','landscape','sphere','CD "Kasuka na Hisoka na Tashika na Mirai" Bonus'],
[20,'SELFSCAN_20140719_0001','portrait','Toyosaki Aki','CD "Kanae Tamae" Toranoana Bonus'],
[23,'SELFSCAN_20140823_0001','portrait','Amamiya Sora','CD "Skyreach" Aniplex+ Bonus'],
[24,'IMG_20141029_0001','landscape','Taketatsu Ayana','CD "Kajirikake no Ringo" Tower Records Bonus'],
[25,'SELFSCAN_20141117_0001','portrait','Toyosaki Aki','CD "Portrait" Animate Bonus'],
[30,'SELFSCAN_20150228_0005','landscape','sphere','CD "sphere" HMV Japan Bonus'],
[31,'SELFSCAN_20150415_0001','portrait','Kotobuki Minako','CD "black hole" Animate Bonus'],
[32,'SELFSCAN_20150526_0001','portrait','TrySail','CD "Youthful Dreamer" Toranoana Bonus'],
[34,'SELFSCAN_20150625_0002','portrait','Toyosaki Aki','CD "Uh-LaLa" HMV Japan Bonus'],
[35,'SELFSCAN_20150925_0001','portrait','Kotobuki Minako','CD "Candy Color Pop" Tower Records Bonus'],
[36,'SELFSCAN_20151001_0001','portrait','Tomatsu Haruka','CD "STEP A GO! GO!" HMV Japan Bonus'],
[38,'SELFSCAN_20160204_0001','portrait','Taketatsu Ayana','CD "Hey! Calorie Queen" HMV Japan Bonus'],

[41,'SELFSCAN_20160227_0005','portrait','Tomatsu Haruka','CD "Cinderella Symphony" Toranoana Bonus'],
[42,'SELFSCAN_20160402_0001','portrait','Toyosaki Aki','CD "all time Lovin\'" HMV Japan Bonus'],
[45,'SELFSCAN_20160531_0001','landscape','TrySail','CD "whiz" HMV Japan Bonus'],
[48,'SELFSCAN_20160602_0003','portrait','TrySail','CD "High Free Spirits" Aniplex+ Bonus'],
[51,'SELFSCAN_20160629_0003','portrait','Kotobuki Minako',''],
[52,'SELFSCAN_20160629_0004','landscape','Toyosaki Aki',''],

[54,'SELFSCAN_20160629_0006','portrait','Toyosaki Aki',''],
[55,'SELFSCAN_20160629_0007','landscape','Toyosaki Aki',''],
[56,'SELFSCAN_20160629_0008','landscape','Toyosaki Aki',''],
[57,'IMG_20160629_0009','portrait','Toyosaki Aki',''],
[58,'SELFSCAN_20160629_0010','portrait','Toyosaki Aki',''],
[59,'SELFSCAN_20160629_0011','portrait','Toyosaki Aki',''],
[60,'SELFSCAN_20160905_0001','portrait','Toyosaki Aki',''],
[61,'IMG_20170107_0001','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[62,'IMG_20170107_0002','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[63,'IMG_20170107_0003','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[64,'IMG_20170107_0004','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[65,'IMG_20170107_0005','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[66,'IMG_20170107_0006','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[67,'IMG_20170107_0007','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[68,'IMG_20170107_0008','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[69,'IMG_20170107_0009','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[70,'SELFSCAN_20170510_0001','portrait','Natsukawa Shiina','CD "Grapefruit Moon" Animate Bonus'],
[71,'SELFSCAN_20170602_0002','portrait','TrySail','CD "adrenaline!!!" Animate Bonus'],
[72,'SELFSCAN_20170610_0001','portrait','Toyosaki Aki','CD "Honey to Lupus" Gamers Bonus'],
[73,'SELFSCAN_20170720_0001','portrait','Toyosaki Aki','CD "love your Best" HMV Japan Bonus'],
[77,'SELFSCAN_20170728_0005','portrait','Uesaka Sumire','CD "Odore! Kyuukyoku Tetsugaku" Tower Records Bonus'],
[79,'SELFSCAN_20170728_0008','portrait','TrySail','CD "Original." Gamers Bonus'],
[80,'SELFSCAN_20170908_0001','landscape','Natsukawa Shiina','CD "Fuwari, Korori, Karan, Koron" Gamers Bonus'],
[81,'CCI20180102_0001','portrait','Amamiya Sora','CD "Eternal" Aniplex+ Bonus'],

[83,'CCI20180331_0001','landscape','TrySail','CD "WANTED GIRL" Tower Records Bonus'],
[84,'CCI20180930-1','portrait','Minase Inori',''],
[85,'CCI20180930-2','portrait','Minase Inori','Book "Seiyuu Animedia 2017 December" Animate Bonus'],
[86,'CCI20180930-3','portrait','Minase Inori','CD "Aimaimoko" Animate Bonus'],
[87,'CCI20180930-4','portrait','Minase Inori','CD "Aimaimoko" Sofmap Bonus'],







[95,'CCI20181231_0000-1','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[96,'CCI20181231_0000-2','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[97,'CCI20181231_0001-1','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[98,'CCI20181231_0001-2','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[99,'CCI20181231_0002-1','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[100,'CCI20181231_0002-2','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[101,'CCI20181231_0003-1','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[102,'CCI20181231_0003-2','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[103,'CCI20190502_001','portrait','Kouno Marika','Book "Marinka" Amazon Japan Bonus'],
[104,'CCI20190502_002','portrait','Kido Ibuki','Book "breath." Gamers Bonus'],
[105,'CCI20190629_0000_1','portrait','Tomatsu Haruka','CD "courage" Toranoana Bonus'],
[106,'CCI20190629_0000_2','portrait','Minase Inori','Event "Inori Minase 1st LIVE Ready Steady Go!" Bromide'],
[107,'CCI20190629_0000_3','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Animate Bonus'],


[110,'CCI20190629_0001_1','landscape','Asakura Momo','CD "Smash Drop" Animate Bonus'],
[111,'CCI20190629_0001_2','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[112,'CCI20190629_0002_1','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[113,'CCI20190629_0002_2','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[114,'CCI20190629_0002_3','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[115,'CCI20190629_0002_4','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[116,'CCI20190629_0003_1','landscape','Touyama Nao','CD "Gunjou Infinity" Animate Bonus'],
[117,'CCI20190629_0003_2','portrait','Ookubo Rumi','Book "Illumination Closet" Sofmap Animega Bonus'],
[118,'CCI20190629_0003_3','portrait','Ookubo Rumi','Book "Illumination Closet" Gamers Bonus'],
[119,'CCI20190629_0003_4','landscape','Natsukawa Shiina','CD "Log Line" Animate Bonus'],
[120,'CCI20190629_0004_1','portrait','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[121,'CCI20190629_0004_2','landscape','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[122,'CCI20190629_0004_3','portrait','Tomatsu Haruka','CD "COLORFUL GIFT" Animate Bonus'],
[123,'CCI20190629_0005_1','landscape','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[124,'CCI20190629_0005_2','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[125,'CCI20190629_0005_3','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[126,'CCI20190629_0006_1','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[127,'CCI20190629_0006_2','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[128,'CCI20190629_0006_3','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[129,'CCI20190921','landscape','Asakura Momo','CD "Yume Cinderella" Gamers Bonus'],



















[149,'CCI20191026_0001','landscape','Kitou Akari','CD "Swinging Heart" Canime Bonus'],
[150,'CCI20200222_0001_1','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[151,'CCI20200222_0001_2','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[152,'CCI20200222_0001_3','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[153,'CCI20200222_0001_4','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[154,'CCI20200222_0002_1','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[155,'CCI20200222_0002_2','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[156,'CCI20200222_0002_3','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[157,'CCI20200222_0002_4','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[158,'CCI20200222_0003_1','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[159,'CCI20200222_0003_2','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[160,'CCI20200222_0003_3','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[161,'CCI20200222_0003_4','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],

[163,'CCI20200222_0004_2','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[164,'CCI20200613_0000-1','portrait','Toyota Moe',''],
[165,'CCI20200613_0000-2','portrait','Asakura Momo','CD "Agapanthus" Animate Bonus'],
[166,'CCI20200613_0000-3','landscape','Fuchigami Mai','CD "Yosou Funou Days/Valantine Hunter" TSUTAYA Bonud'],
[167,'CCI20200613_0000-4','portrait','Amamiya Sora','CD "PARADOX" TSUTAYA Bonus'],
[168,'CCI20200613_0001-1','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[169,'CCI20200613_0001-2','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[170,'CCI20200613_0001-3','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[171,'CCI20200613_0001-4','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[172,'CCI20200613_0002-1','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[173,'CCI20200613_0002-2','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[174,'CCI20200613_0002-3','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[175,'CCI20200613_0002-4','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[176,'CCI20200613_0003-1','portrait','Tachibana Rika','Book "Seiyuu Paradise R vol.25" Gamers Bonus'],
[177,'CCI20200613_0003-2','landscape','Tachibana Rika','CD "Heart Shaker" Gamers Bonus'],
[178,'CCI20200613_0003-3','landscape','Asakura Momo','CD "365xLOVE" HMV Bonus'],
[179,'CCI20200613_0003-4','landscape','Asakura Momo','CD "365xLOVE" Animate Bonus'],
[180,'CCI20200613_0004-1','portrait','Kouno Marika',''],
[181,'CCI20200613_0004-2','portrait','Kouno Marika',''],
[182,'CCI20200613_0004-3','portrait','Natsukawa Shiina','CD "Ep01" Gamers Bonus'],
[183,'CCI20200613_0004-4','landscape','Hanazawa Kana','Book "Hanazawa Kana Calendar" Type A Bonus'],
[184,'CCI20200613_0005-1','landscape','TrySail','CD "Senpai." Gamers Bonus'],
[185,'CCI20200613_0005-2','landscape','Amamiya Sora','CD "Regeneration" Animate Bonus'],
[186,'CCI20200613_0005-3','portrait','Minase Inori','Book "Seiyuu Grand Prix 2020 March" Animate Bonus'],
[187,'CCI20200613_0005-4','portrait','Minase Inori','Book "Seiyuu Animedia 2019 May" Animate Bonus'],
[188,'CCI20200613_0006-1','portrait','Tomatsu Haruka','CD "Fantastic Soda!!" Tower Records Bonus'],
[189,'CCI20200613_0006-2','portrait','Tomatsu Haruka','CD "Tomatsu Haruka BEST SELECTION -sunshine-" HMV Japan Bonus'],
[190,'CCI20200613_0006-3','landscape','Amamiya Sora','CD "irodori" Animate Bonus'],
[191,'CCI20200613_0007-1','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[192,'CCI20200613_0007-2','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[193,'CCI20200613_0007-3','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[194,'CCI20200613_0007-4','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[195,'CCI20200613_0008-1','landscape','Hanazawa Kana','CD "Opportunity" Animate Bonus'],
[196,'CCI20200613_0008-2','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Kanameguri ~Kouhen~" Toranoana Bonus'],
[197,'CCI20200613_0008-3','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" B Ver. Bonus'],
[198,'CCI20200613_0009-1','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.B Bonus'],
[199,'CCI20200613_0009-2','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.A Bonus'],
[200,'CCI20200613_0009-3','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" C Ver. Bonus'],
[201,'CCI20200613_0009-4','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook How to go?" Gamers Bonus'],
[202,'CCI20200613_0010-1','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" A Ver. Bonus'],
[203,'CCI20200613_0010-2','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Gamers Bonus'],
[204,'CCI20200613_0010-3','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" Event Only Toranoana Bonus'],
[205,'CCI20200613_0010-4','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Tooi Kuchibue" Event Only Toranoana Bonus'],
[206,'CCI20200613_0011-1','portrait','Hanazawa Kana','Event "6/23" Limited Edition Bonus'],
[207,'CCI20200613_0011-2','portrait','Hanazawa Kana','Book "Hanazawa Kana Calendar" C Ver. Bonus'],
[208,'CCI20200613_0011-3','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Animega Bonus'],
[209,'CCI20200613_0011-4','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Toranoana Bonus'],
[210,'CCI20200613_0012-1','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[211,'CCI20200613_0012-2','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[212,'CCI20200613_0012-3','landscape','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[213,'CCI20200613_0013-1','landscape','TrySail','CD "Gomakashi/Utsuroi" Animate Bonus'],
[214,'CCI20200613_0013-2','landscape','Touyama Nao','CD "Aruite Ikou!" Animate Bonus'],
[215,'CCI20200613_0013-3','portrait','Uesaka Sumire','Book "Seiyuu Grand Prix 2018 February" Animate Bonus'],
[216,'CCI20200613_0013-4','portrait','Kitou Akari','CD "Desire Again" Toranoana Bonus'],
[217,'CCI20200613_0014-1','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[218,'CCI20200613_0014-2','landscape','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[219,'CCI20200613_0014-3','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[220,'CCI20200613_0015-1','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[221,'CCI20200613_0015-2','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[222,'CCI20200613_0015-3','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[223,'CCI20200613_0016-1','landscape','Kitou Akari','CD "Desire Again" Canime Bonus'],
[224,'CCI20200613_0017-1','landscape','TrySail','CD "Free Turn" Animate Bonus'],
[225,'CCI20200613_0017-2','landscape','Kitou Akari','Book "Seiyuu Paradise R vol.32" Sofmap Animega Bonus'],
[226,'CCI20200613_0017-3','landscape','TrySail','Book "Seiyuu Animedia 2020 April" Animate/Gamers/Toranoana Bonus'],
[999,'','','']
];

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
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
		imgHTML.setAttribute('alt', 'images/' + img[1] + '.jpg');
		imgHTML.setAttribute('src', spacerURL);
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
	
	document.getElementById('loadedCount').innerText = 0;
	setTimeout(reloadImages,500);
	
	//add event listener when click on image
	for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}
}

function reloadImages() {
	let loadedImages = 0;
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.complete) document.getElementById('loadedCount').innerText = ++loadedImages;
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;
			
		}
	}
	if(loadedImages < document.getElementsByTagName("img").length) setTimeout(reloadImages,500);
	if(loadedImages == document.getElementsByTagName("img").length) setTimeout(function () { document.getElementById('description').remove(); }, 2000);
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
let largestHalfWidth = 0;
let time = new Date();
document.getElementById("imgGallery").addEventListener("wheel", function(e) {
    e.preventDefault();
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	//console.log(new Date() - time);
	time = new Date();
	document.getElementsByClassName('profile-category')[0].scrollLeft -= e.wheelDelta;
	
	if(new Date() - time < 500 && (e.wheelDelta > 100 || e.wheelDelta < -100)) //conditions to prevent immediate snap
	{
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
			document.getElementsByClassName('profile-category')[0].classList.add('snap');
		}, 500);
		setTimeout( function() { 
			//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
			document.getElementsByClassName('profile-category')[0].classList.remove('snap');
		}, 600);
	}
	
	//get relative positions of all images
	/*
	scrollList = new Array();
	for(let img of document.getElementsByClassName('profile-box'))
	{
		scrollList.push(img.getBoundingClientRect().x);
	}
	
	largestHalfWidth = document.getElementsByClassName('landscape')[0].getBoundingClientRect().width/2;
	let halfWidth = window.innerWidth/2;
	let diff = 99999; //closest x
	let imgIndex = -1; //corresponding index
	let x = 0;
	for(let i = 0; i < document.getElementsByClassName('profile-box').length; i++)
	{
		x = document.getElementsByClassName('profile-box')[i].getBoundingClientRect().x;
		if(x < halfWidth && halfWidth - x < diff)
		{
			imgIndex = i;
		}
	}
	//console.log(imgIndex);
	let imgLength = document.getElementsByClassName('profile-box').length;
	let newIndex = -1;
	if(e.wheelDelta < 0) //scroll right
		newIndex = imgIndex + 1;
	if(e.wheelDelta > 0) //scroll left
		newIndex = imgIndex - 1;
	
	let left = document.getElementsByClassName('profile-category')[0].scrollLeft;
	let newX = document.getElementsByClassName('profile-box')[newIndex].getBoundingClientRect().width;
	if(e.wheelDelta > 0) newX = -1*newX;
	//document.getElementsByClassName('profile-category')[0].scrollLeft += newX;
	let newLeft = document.getElementsByClassName('profile-category')[0].scrollLeft;
	//console.log(left + "|" + newLeft + "|" + (newX));
	*/
	
	//if(document.getElementsByClassName('profile-category')[0].scrollLeft < halfWidth)
	//	document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByClassName('profile-box')[2].getBoundingClientRect().x;
		
	//scroll depends on transition from image orientation eg. portrait to landscape
	//but scrollLeft value is always left edge of category box (0 is first img)
	//bountingrect.x for each image is wrt left edge of screen (0 is left edge of screen of category box)
	//document.getElementsByClassName('profile-category')[0].scrollLeft += document.getElementsByTagName('img')[1].getBoundingClientRect().x;

});

document.getElementById("imgGallery").addEventListener("touchmove", function(e) {
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
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
	document.getElementsByClassName('profile-category')[0].classList.add('snap');
	let images = document.getElementsByClassName('profile-box');
	let selected = images[Math.floor(Math.random()*images.length)];
	selected.scrollIntoView();
	if(viewer.style.display == 'block') openImageInViewer(selected.getElementsByTagName('img')[0]);
	document.getElementsByClassName('profile-category')[0].classList.remove('snap');
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