//To add gallery:
// Copy and fill in image-gallery-data, rename file to end with \'-data\'
// Fill in links variable in image-gallery.js
// Tada!


//--REINITIALISE SETTINGS--//
enableViewer = true; //images smaller than screen will not resize up
enableOrientation = true; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = true; //removes shadows and borders in images
enableDarkMode = true; //no button to toggle, when load always white background


//localization
pageTitle = 'GALLERY'; //for tab, and top of page
pageCredit = ''; //does not hide, and will hide if empty
tagTitle = 'Girls';
selectAllTag = 'Select All';
defaultTag = ''; //if empty will select all
closeIconTitle = 'Close';
collapseFilterIconTitle = 'Collapse Filters';
expandFilterIconTitle = 'Expand Filters';
orientationTitle = 'Orientation';
portraitTitle = 'Portrait';
landscapeTitle = 'Landscape';
tagRightClickTitle = 'Right Click to Select This Only';
loaderTextPrefix = 'Images Loaded: ';

//array containing all gallery info
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],
[1,'https://knneo.webs.com/SELFSCAN_20140111_0002.jpg','portrait','Kotobuki Minako','CD "pretty fever" Animate Bonus'],
[2,'https://knneo.webs.com/SELFSCAN_20140111_0005.jpg','portrait','Hikasa Youko','CD "Seek Diamonds" Animate Bonus'],
[3,'https://knneo.webs.com/SELFSCAN_20140111_0007.jpg','landscape','Tomatsu Haruka','CD "Yume Sekai" ver.6 Bonus'],
[5,'https://knneo.webs.com/SELFSCAN_20140111_0009.jpg','landscape','Taketatsu Ayana','CD "Sinfonia! Sinfonia!!!" Bonus'],
[6,'https://knneo.webs.com/SELFSCAN_20140111_0010.jpg','portrait','Taketatsu Ayana','CD "Onpu no Kuni no Alice" Bonus'],
[7,'https://knneo.webs.com/SELFSCAN_20140111_0011.jpg','portrait','Taketatsu Ayana','CD "Jikuu Tours" Bonus'],
[8,'https://knneo.webs.com/SELFSCAN_20140307_0001.jpg','portrait','Horie Yui','CD "Golden Time" Bonus'],
[11,'https://knneo.webs.com/SELFSCAN_20140311_0002.jpg','landscape','Satou Satomi','CD "Mirai Night" Neowing Bonus'],
[12,'https://knneo.webs.com/SELFSCAN_20140324_0001.jpg','portrait','Horie Yui','CD "The World\'s End" Bonus'],
[13,'https://knneo.webs.com/SELFSCAN_20140324_0002.jpg','portrait','Toyosaki Aki','CD "Delight" Tower Records Bonus'],
[15,'https://knneo.webs.com/SELFSCAN_20140424_0002.jpg','portrait','Kotobuki Minako','CD "Believe x" Sony Music Shop Bonus'],
[16,'https://knneo.webs.com/SELFSCAN_20140529_0001.jpg','landscape','sphere','CD "Kasuka na Hisoka na Tashika na Mirai" Bonus'],
[20,'https://knneo.webs.com/SELFSCAN_20140719_0001.jpg','portrait','Toyosaki Aki','CD "Kanae Tamae" Toranoana Bonus'],
[23,'https://knneo.webs.com/SELFSCAN_20140823_0001.jpg','portrait','Amamiya Sora','CD "Skyreach" Aniplex+ Bonus'],
[24,'https://knneo.webs.com/IMG_20141029_0001.jpg','landscape','Taketatsu Ayana','CD "Kajirikake no Ringo" Tower Records Bonus'],
[25,'https://knneo.webs.com/SELFSCAN_20141117_0001.jpg','portrait','Toyosaki Aki','CD "Portrait" Animate Bonus'],
[30,'https://knneo.webs.com/SELFSCAN_20150228_0005.jpg','landscape','sphere','CD "sphere" HMV Japan Bonus'],
[31,'https://knneo.webs.com/SELFSCAN_20150415_0001.jpg','portrait','Kotobuki Minako','CD "black hole" Animate Bonus'],
[32,'https://knneo.webs.com/SELFSCAN_20150526_0001.jpg','portrait','TrySail','CD "Youthful Dreamer" Toranoana Bonus'],
[34,'https://knneo.webs.com/SELFSCAN_20150625_0002.jpg','portrait','Toyosaki Aki','CD "Uh-LaLa" HMV Japan Bonus'],
[35,'https://knneo.webs.com/SELFSCAN_20150925_0001.jpg','portrait','Kotobuki Minako','CD "Candy Color Pop" Tower Records Bonus'],
[36,'https://knneo.webs.com/SELFSCAN_20151001_0001.jpg','portrait','Tomatsu Haruka','CD "STEP A GO! GO!" HMV Japan Bonus'],
[38,'https://knneo.webs.com/SELFSCAN_20160204_0001.jpg','portrait','Taketatsu Ayana','CD "Hey! Calorie Queen" HMV Japan Bonus'],

[41,'https://knneo.webs.com/SELFSCAN_20160227_0005.jpg','portrait','Tomatsu Haruka','CD "Cinderella Symphony" Toranoana Bonus'],
[42,'https://knneo.webs.com/SELFSCAN_20160402_0001.jpg','portrait','Toyosaki Aki','CD "all time Lovin\'" HMV Japan Bonus'],
[45,'https://knneo.webs.com/SELFSCAN_20160531_0001.jpg','landscape','TrySail','CD "whiz" HMV Japan Bonus'],
[48,'https://knneo.webs.com/SELFSCAN_20160602_0003.jpg','portrait','TrySail','CD "High Free Spirits" Aniplex+ Bonus'],
[51,'https://knneo.webs.com/SELFSCAN_20160629_0003.jpg','portrait','Kotobuki Minako',''],
[52,'https://knneo.webs.com/SELFSCAN_20160629_0004.jpg','landscape','Toyosaki Aki',''],

[54,'https://knneo.webs.com/SELFSCAN_20160629_0006.jpg','portrait','Toyosaki Aki',''],
[55,'https://knneo.webs.com/SELFSCAN_20160629_0007.jpg','landscape','Toyosaki Aki',''],
[56,'https://knneo.webs.com/SELFSCAN_20160629_0008.jpg','landscape','Toyosaki Aki',''],
[57,'https://knneo.webs.com/IMG_20160629_0009.jpg','portrait','Toyosaki Aki',''],
[58,'https://knneo.webs.com/SELFSCAN_20160629_0010.jpg','portrait','Toyosaki Aki',''],
[59,'https://knneo.webs.com/SELFSCAN_20160629_0011.jpg','portrait','Toyosaki Aki',''],
[60,'https://knneo.webs.com/SELFSCAN_20160905_0001.jpg','portrait','Toyosaki Aki',''],
[61,'https://knneo.webs.com/IMG_20170107_0001.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[62,'https://knneo.webs.com/IMG_20170107_0002.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[63,'https://knneo.webs.com/IMG_20170107_0003.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[64,'https://knneo.webs.com/IMG_20170107_0004.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[65,'https://knneo.webs.com/IMG_20170107_0005.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[66,'https://knneo.webs.com/IMG_20170107_0006.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[67,'https://knneo.webs.com/IMG_20170107_0007.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[68,'https://knneo.webs.com/IMG_20170107_0008.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[69,'https://knneo.webs.com/IMG_20170107_0009.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[70,'https://knneo.webs.com/SELFSCAN_20170510_0001.jpg','portrait','Natsukawa Shiina','CD "Grapefruit Moon" Animate Bonus'],
[71,'https://knneo.webs.com/SELFSCAN_20170602_0002.jpg','portrait','TrySail','CD "adrenaline!!!" Animate Bonus'],
[72,'https://knneo.webs.com/SELFSCAN_20170610_0001.jpg','portrait','Toyosaki Aki','CD "Honey to Lupus" Gamers Bonus'],
[73,'https://knneo.webs.com/SELFSCAN_20170720_0001.jpg','portrait','Toyosaki Aki','CD "love your Best" HMV Japan Bonus'],
[77,'https://knneo.webs.com/SELFSCAN_20170728_0005.jpg','portrait','Uesaka Sumire','CD "Odore! Kyuukyoku Tetsugaku" Tower Records Bonus'],
[79,'https://knneo.webs.com/SELFSCAN_20170728_0008.jpg','portrait','TrySail','CD "Original." Gamers Bonus'],
[80,'https://knneo.webs.com/SELFSCAN_20170908_0001.jpg','landscape','Natsukawa Shiina','CD "Fuwari, Korori, Karan, Koron" Gamers Bonus'],
[81,'https://knneo.webs.com/CCI20180102_0001.jpg','portrait','Amamiya Sora','CD "Eternal" Aniplex+ Bonus'],

[83,'https://knneo.webs.com/CCI20180331_0001.jpg','landscape','TrySail','CD "WANTED GIRL" Tower Records Bonus'],
[84,'https://knneo.webs.com/CCI20180930-1.jpg','portrait','Minase Inori',''],
[85,'https://knneo.webs.com/CCI20180930-2.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2017 December" Animate Bonus'],
[86,'https://knneo.webs.com/CCI20180930-3.jpg','portrait','Minase Inori','CD "Aimaimoko" Animate Bonus'],
[87,'https://knneo.webs.com/CCI20180930-4.jpg','portrait','Minase Inori','CD "Aimaimoko" Sofmap Bonus'],







[95,'https://knneo.webs.com/CCI20181231_0000-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[96,'https://knneo.webs.com/CCI20181231_0000-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[97,'https://knneo.webs.com/CCI20181231_0001-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[98,'https://knneo.webs.com/CCI20181231_0001-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[99,'https://knneo.webs.com/CCI20181231_0002-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[100,'https://knneo.webs.com/CCI20181231_0002-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[101,'https://knneo.webs.com/CCI20181231_0003-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[102,'https://knneo.webs.com/CCI20181231_0003-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[103,'https://knneo.webs.com/CCI20190502_001.jpg','portrait','Kouno Marika','Book "Marinka" Amazon Japan Bonus'],
[104,'https://knneo.webs.com/CCI20190502_002.jpg','portrait','Kido Ibuki','Book "breath." Gamers Bonus'],
[105,'https://knneo.webs.com/CCI20190629_0000_1.jpg','portrait','Tomatsu Haruka','CD "courage" Toranoana Bonus'],
[106,'https://knneo.webs.com/CCI20190629_0000_2.jpg','portrait','Minase Inori','Event "Inori Minase 1st LIVE Ready Steady Go!" Bromide'],
[107,'https://knneo.webs.com/CCI20190629_0000_3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Animate Bonus'],


[110,'https://knneo.webs.com/CCI20190629_0001_1.jpg','landscape','Asakura Momo','CD "Smash Drop" Animate Bonus'],
[111,'https://knneo.webs.com/CCI20190629_0001_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[112,'https://knneo.webs.com/CCI20190629_0002_1.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[113,'https://knneo.webs.com/CCI20190629_0002_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[114,'https://knneo.webs.com/CCI20190629_0002_3.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[115,'https://knneo.webs.com/CCI20190629_0002_4.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[116,'https://knneo.webs.com/CCI20190629_0003_1.jpg','landscape','Touyama Nao','CD "Gunjou Infinity" Animate Bonus'],
[117,'https://knneo.webs.com/CCI20190629_0003_2.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Sofmap Animega Bonus'],
[118,'https://knneo.webs.com/CCI20190629_0003_3.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Gamers Bonus'],
[119,'https://knneo.webs.com/CCI20190629_0003_4.jpg','landscape','Natsukawa Shiina','CD "Log Line" Animate Bonus'],
[120,'https://knneo.webs.com/CCI20190629_0004_1.jpg','portrait','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[121,'https://knneo.webs.com/CCI20190629_0004_2.jpg','landscape','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[122,'https://knneo.webs.com/CCI20190629_0004_3.jpg','portrait','Tomatsu Haruka','CD "COLORFUL GIFT" Animate Bonus'],
[123,'https://knneo.webs.com/CCI20190629_0005_1.jpg','landscape','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[124,'https://knneo.webs.com/CCI20190629_0005_2.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[125,'https://knneo.webs.com/CCI20190629_0005_3.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[126,'https://knneo.webs.com/CCI20190629_0006_1.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[127,'https://knneo.webs.com/CCI20190629_0006_2.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[128,'https://knneo.webs.com/CCI20190629_0006_3.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[129,'https://knneo.webs.com/CCI20190921.jpg','landscape','Asakura Momo','CD "Yume Cinderella" Gamers Bonus'],



















[149,'https://knneo.webs.com/CCI20191026_0001.jpg','landscape','Kitou Akari','CD "Swinging Heart" Canime Bonus'],
[150,'https://knneo.webs.com/CCI20200222_0001_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[151,'https://knneo.webs.com/CCI20200222_0001_2.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[152,'https://knneo.webs.com/CCI20200222_0001_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[153,'https://knneo.webs.com/CCI20200222_0001_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[154,'https://knneo.webs.com/CCI20200222_0002_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[155,'https://knneo.webs.com/CCI20200222_0002_2.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[156,'https://knneo.webs.com/CCI20200222_0002_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[157,'https://knneo.webs.com/CCI20200222_0002_4.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[158,'https://knneo.webs.com/CCI20200222_0003_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[159,'https://knneo.webs.com/CCI20200222_0003_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[160,'https://knneo.webs.com/CCI20200222_0003_3.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[161,'https://knneo.webs.com/CCI20200222_0003_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],

[163,'https://knneo.webs.com/CCI20200222_0004_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[164,'https://knneo.webs.com/CCI20200613_0000-1.jpg','portrait','Toyota Moe',''],
[165,'https://knneo.webs.com/CCI20200613_0000-2.jpg','portrait','Asakura Momo','CD "Agapanthus" Animate Bonus'],
[166,'https://knneo.webs.com/CCI20200613_0000-3.jpg','landscape','Fuchigami Mai','CD "Yosou Funou Days/Valantine Hunter" TSUTAYA Bonud'],
[167,'https://knneo.webs.com/CCI20200613_0000-4.jpg','portrait','Amamiya Sora','CD "PARADOX" TSUTAYA Bonus'],
[168,'https://knneo.webs.com/CCI20200613_0001-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[169,'https://knneo.webs.com/CCI20200613_0001-2.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[170,'https://knneo.webs.com/CCI20200613_0001-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[171,'https://knneo.webs.com/CCI20200613_0001-4.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[172,'https://knneo.webs.com/CCI20200613_0002-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[173,'https://knneo.webs.com/CCI20200613_0002-2.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[174,'https://knneo.webs.com/CCI20200613_0002-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[175,'https://knneo.webs.com/CCI20200613_0002-4.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[176,'https://knneo.webs.com/CCI20200613_0003-1.jpg','portrait','Tachibana Rika','Book "Seiyuu Paradise R vol.25" Gamers Bonus'],
[177,'https://knneo.webs.com/CCI20200613_0003-2.jpg','landscape','Tachibana Rika','CD "Heart Shaker" Gamers Bonus'],
[178,'https://knneo.webs.com/CCI20200613_0003-3.jpg','landscape','Asakura Momo','CD "365xLOVE" HMV Bonus'],
[179,'https://knneo.webs.com/CCI20200613_0003-4.jpg','landscape','Asakura Momo','CD "365xLOVE" Animate Bonus'],
[180,'https://knneo.webs.com/CCI20200613_0004-1.jpg','portrait','Kouno Marika',''],
[181,'https://knneo.webs.com/CCI20200613_0004-2.jpg','portrait','Kouno Marika',''],
[182,'https://knneo.webs.com/CCI20200613_0004-3.jpg','portrait','Natsukawa Shiina','CD "Ep01" Gamers Bonus'],
[183,'https://knneo.webs.com/CCI20200613_0004-4.jpg','landscape','Hanazawa Kana','Book "Hanazawa Kana Calendar" Type A Bonus'],
[184,'https://knneo.webs.com/CCI20200613_0005-1.jpg','landscape','TrySail','CD "Senpai." Gamers Bonus'],
[185,'https://knneo.webs.com/CCI20200613_0005-2.jpg','landscape','Amamiya Sora','CD "Regeneration" Animate Bonus'],
[186,'https://knneo.webs.com/CCI20200613_0005-3.jpg','portrait','Minase Inori','Book "Seiyuu Grand Prix 2020 March" Animate Bonus'],
[187,'https://knneo.webs.com/CCI20200613_0005-4.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2019 May" Animate Bonus'],
[188,'https://knneo.webs.com/CCI20200613_0006-1.jpg','portrait','Tomatsu Haruka','CD "Fantastic Soda!!" Tower Records Bonus'],
[189,'https://knneo.webs.com/CCI20200613_0006-2.jpg','portrait','Tomatsu Haruka','CD "Tomatsu Haruka BEST SELECTION -sunshine-" HMV Japan Bonus'],
[190,'https://knneo.webs.com/CCI20200613_0006-3.jpg','landscape','Amamiya Sora','CD "irodori" Animate Bonus'],
[191,'https://knneo.webs.com/CCI20200613_0007-1.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[192,'https://knneo.webs.com/CCI20200613_0007-2.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[193,'https://knneo.webs.com/CCI20200613_0007-3.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[194,'https://knneo.webs.com/CCI20200613_0007-4.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[195,'https://knneo.webs.com/CCI20200613_0008-1.jpg','landscape','Hanazawa Kana','CD "Opportunity" Animate Bonus'],
[196,'https://knneo.webs.com/CCI20200613_0008-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Kanameguri ~Kouhen~" Toranoana Bonus'],
[197,'https://knneo.webs.com/CCI20200613_0008-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" B Ver. Bonus'],
[198,'https://knneo.webs.com/CCI20200613_0009-1.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.B Bonus'],
[199,'https://knneo.webs.com/CCI20200613_0009-2.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.A Bonus'],
[200,'https://knneo.webs.com/CCI20200613_0009-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" C Ver. Bonus'],
[201,'https://knneo.webs.com/CCI20200613_0009-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook How to go?" Gamers Bonus'],
[202,'https://knneo.webs.com/CCI20200613_0010-1.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" A Ver. Bonus'],
[203,'https://knneo.webs.com/CCI20200613_0010-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Gamers Bonus'],
[204,'https://knneo.webs.com/CCI20200613_0010-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" Event Only Toranoana Bonus'],
[205,'https://knneo.webs.com/CCI20200613_0010-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Tooi Kuchibue" Event Only Toranoana Bonus'],
[206,'https://knneo.webs.com/CCI20200613_0011-1.jpg','portrait','Hanazawa Kana','Event "6/23" Limited Edition Bonus'],
[207,'https://knneo.webs.com/CCI20200613_0011-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Calendar" C Ver. Bonus'],
[208,'https://knneo.webs.com/CCI20200613_0011-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Animega Bonus'],
[209,'https://knneo.webs.com/CCI20200613_0011-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Toranoana Bonus'],
[210,'https://knneo.webs.com/CCI20200613_0012-1.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[211,'https://knneo.webs.com/CCI20200613_0012-2.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[212,'https://knneo.webs.com/CCI20200613_0012-3.jpg','landscape','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[213,'https://knneo.webs.com/CCI20200613_0013-1.jpg','landscape','TrySail','CD "Gomakashi/Utsuroi" Animate Bonus'],
[214,'https://knneo.webs.com/CCI20200613_0013-2.jpg','landscape','Touyama Nao','CD "Aruite Ikou!" Animate Bonus'],
[215,'https://knneo.webs.com/CCI20200613_0013-3.jpg','portrait','Uesaka Sumire','Book "Seiyuu Grand Prix 2018 February" Animate Bonus'],
[216,'https://knneo.webs.com/CCI20200613_0013-4.jpg','portrait','Kitou Akari','CD "Desire Again" Toranoana Bonus'],
[217,'https://knneo.webs.com/CCI20200613_0014-1.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[218,'https://knneo.webs.com/CCI20200613_0014-2.jpg','landscape','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[219,'https://knneo.webs.com/CCI20200613_0014-3.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[220,'https://knneo.webs.com/CCI20200613_0015-1.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[221,'https://knneo.webs.com/CCI20200613_0015-2.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[222,'https://knneo.webs.com/CCI20200613_0015-3.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[223,'https://knneo.webs.com/CCI20200613_0016-1.jpg','landscape','Kitou Akari','CD "Desire Again" Canime Bonus'],
[224,'https://knneo.webs.com/CCI20200613_0017-1.jpg','landscape','TrySail','CD "Free Turn" Animate Bonus'],
[225,'https://knneo.webs.com/CCI20200613_0017-2.jpg','landscape','Kitou Akari','Book "Seiyuu Paradise R vol.32" Sofmap Animega Bonus'],
[226,'https://knneo.webs.com/CCI20200613_0017-3.jpg','landscape','TrySail','Book "Seiyuu Animedia 2020 April" Animate/Gamers/Toranoana Bonus'],
[231,'https://knneo.webs.com/CCI20200728_0008_1.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[232,'https://knneo.webs.com/CCI20200728_0008_2.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[233,'https://knneo.webs.com/CCI20200728_0008_3.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[234,'https://knneo.webs.com/CCI20200728_0009_1.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[235,'https://knneo.webs.com/CCI20200728_0009_2.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[236,'https://knneo.webs.com/CCI20200728_0009_3.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[237,'https://knneo.webs.com/CCI20200728_0011_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[238,'https://knneo.webs.com/CCI20200728_0011_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[239,'https://knneo.webs.com/CCI20200728_0011_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[240,'https://knneo.webs.com/CCI20200728_0012_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[241,'https://knneo.webs.com/CCI20200728_0012_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[242,'https://knneo.webs.com/CCI20200728_0012_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[243,'https://knneo.webs.com/CCI20200728_0013_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[244,'https://knneo.webs.com/CCI20200728_0013_2.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[245,'https://knneo.webs.com/CCI20200728_0013_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[246,'https://knneo.webs.com/CCI20200728_0013_4.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[247,'https://knneo.webs.com/CCI20200728_0014_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[248,'https://knneo.webs.com/CCI20200728_0014_2.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[249,'https://knneo.webs.com/CCI20200728_0014_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[250,'https://knneo.webs.com/CCI20200728_0014_4.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],


[999,'','','']
];