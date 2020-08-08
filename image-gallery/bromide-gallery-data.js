enableViewer = true; //images smaller than screen will not resize up
enableOrientation = true; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = true; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = 'boolean'; //removes shadows and borders in images

pageTitle = 'GALLERY'; //for tab, and top of page
pageDescription = 'Use this page to create your own private image gallery!\n(Add to array in image-gallery.js)'; //hides on load with images loaded
pageCredit = ''; //does not hide, and will hide if empty
theme = 'white'; //do up shadow for white theme {white, black}
tagTitle = 'Girls';
defaultTag = ''; //if empty will select all

//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'','',''],
[1,'images/SELFSCAN_20140111_0002.jpg','portrait','Kotobuki Minako','CD "pretty fever" Animate Bonus'],
[2,'images/SELFSCAN_20140111_0005.jpg','portrait','Hikasa Youko','CD "Seek Diamonds" Animate Bonus'],
[3,'images/SELFSCAN_20140111_0007.jpg','landscape','Tomatsu Haruka','CD "Yume Sekai" ver.6 Bonus'],
[5,'images/SELFSCAN_20140111_0009.jpg','landscape','Taketatsu Ayana','CD "Sinfonia! Sinfonia!!!" Bonus'],
[6,'images/SELFSCAN_20140111_0010.jpg','portrait','Taketatsu Ayana','CD "Onpu no Kuni no Alice" Bonus'],
[7,'images/SELFSCAN_20140111_0011.jpg','portrait','Taketatsu Ayana','CD "Jikuu Tours" Bonus'],
[8,'images/SELFSCAN_20140307_0001.jpg','portrait','Horie Yui','CD "Golden Time" Bonus'],
[11,'images/SELFSCAN_20140311_0002.jpg','landscape','Satou Satomi','CD "Mirai Night" Neowing Bonus'],
[12,'images/SELFSCAN_20140324_0001.jpg','portrait','Horie Yui','CD "The World\'s End" Bonus'],
[13,'images/SELFSCAN_20140324_0002.jpg','portrait','Toyosaki Aki','CD "Delight" Tower Records Bonus'],
[15,'images/SELFSCAN_20140424_0002.jpg','portrait','Kotobuki Minako','CD "Believe x" Sony Music Shop Bonus'],
[16,'images/SELFSCAN_20140529_0001.jpg','landscape','sphere','CD "Kasuka na Hisoka na Tashika na Mirai" Bonus'],
[20,'images/SELFSCAN_20140719_0001.jpg','portrait','Toyosaki Aki','CD "Kanae Tamae" Toranoana Bonus'],
[23,'images/SELFSCAN_20140823_0001.jpg','portrait','Amamiya Sora','CD "Skyreach" Aniplex+ Bonus'],
[24,'images/IMG_20141029_0001.jpg','landscape','Taketatsu Ayana','CD "Kajirikake no Ringo" Tower Records Bonus'],
[25,'images/SELFSCAN_20141117_0001.jpg','portrait','Toyosaki Aki','CD "Portrait" Animate Bonus'],
[30,'images/SELFSCAN_20150228_0005.jpg','landscape','sphere','CD "sphere" HMV Japan Bonus'],
[31,'images/SELFSCAN_20150415_0001.jpg','portrait','Kotobuki Minako','CD "black hole" Animate Bonus'],
[32,'images/SELFSCAN_20150526_0001.jpg','portrait','TrySail','CD "Youthful Dreamer" Toranoana Bonus'],
[34,'images/SELFSCAN_20150625_0002.jpg','portrait','Toyosaki Aki','CD "Uh-LaLa" HMV Japan Bonus'],
[35,'images/SELFSCAN_20150925_0001.jpg','portrait','Kotobuki Minako','CD "Candy Color Pop" Tower Records Bonus'],
[36,'images/SELFSCAN_20151001_0001.jpg','portrait','Tomatsu Haruka','CD "STEP A GO! GO!" HMV Japan Bonus'],
[38,'images/SELFSCAN_20160204_0001.jpg','portrait','Taketatsu Ayana','CD "Hey! Calorie Queen" HMV Japan Bonus'],

[41,'images/SELFSCAN_20160227_0005.jpg','portrait','Tomatsu Haruka','CD "Cinderella Symphony" Toranoana Bonus'],
[42,'images/SELFSCAN_20160402_0001.jpg','portrait','Toyosaki Aki','CD "all time Lovin\'" HMV Japan Bonus'],
[45,'images/SELFSCAN_20160531_0001.jpg','landscape','TrySail','CD "whiz" HMV Japan Bonus'],
[48,'images/SELFSCAN_20160602_0003.jpg','portrait','TrySail','CD "High Free Spirits" Aniplex+ Bonus'],
[51,'images/SELFSCAN_20160629_0003.jpg','portrait','Kotobuki Minako',''],
[52,'images/SELFSCAN_20160629_0004.jpg','landscape','Toyosaki Aki',''],

[54,'images/SELFSCAN_20160629_0006.jpg','portrait','Toyosaki Aki',''],
[55,'images/SELFSCAN_20160629_0007.jpg','landscape','Toyosaki Aki',''],
[56,'images/SELFSCAN_20160629_0008.jpg','landscape','Toyosaki Aki',''],
[57,'images/IMG_20160629_0009.jpg','portrait','Toyosaki Aki',''],
[58,'images/SELFSCAN_20160629_0010.jpg','portrait','Toyosaki Aki',''],
[59,'images/SELFSCAN_20160629_0011.jpg','portrait','Toyosaki Aki',''],
[60,'images/SELFSCAN_20160905_0001.jpg','portrait','Toyosaki Aki',''],
[61,'images/IMG_20170107_0001.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[62,'images/IMG_20170107_0002.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[63,'images/IMG_20170107_0003.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[64,'images/IMG_20170107_0004.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[65,'images/IMG_20170107_0005.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[66,'images/IMG_20170107_0006.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[67,'images/IMG_20170107_0007.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[68,'images/IMG_20170107_0008.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[69,'images/IMG_20170107_0009.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[70,'images/SELFSCAN_20170510_0001.jpg','portrait','Natsukawa Shiina','CD "Grapefruit Moon" Animate Bonus'],
[71,'images/SELFSCAN_20170602_0002.jpg','portrait','TrySail','CD "adrenaline!!!" Animate Bonus'],
[72,'images/SELFSCAN_20170610_0001.jpg','portrait','Toyosaki Aki','CD "Honey to Lupus" Gamers Bonus'],
[73,'images/SELFSCAN_20170720_0001.jpg','portrait','Toyosaki Aki','CD "love your Best" HMV Japan Bonus'],
[77,'images/SELFSCAN_20170728_0005.jpg','portrait','Uesaka Sumire','CD "Odore! Kyuukyoku Tetsugaku" Tower Records Bonus'],
[79,'images/SELFSCAN_20170728_0008.jpg','portrait','TrySail','CD "Original." Gamers Bonus'],
[80,'images/SELFSCAN_20170908_0001.jpg','landscape','Natsukawa Shiina','CD "Fuwari, Korori, Karan, Koron" Gamers Bonus'],
[81,'images/CCI20180102_0001.jpg','portrait','Amamiya Sora','CD "Eternal" Aniplex+ Bonus'],

[83,'images/CCI20180331_0001.jpg','landscape','TrySail','CD "WANTED GIRL" Tower Records Bonus'],
[84,'images/CCI20180930-1.jpg','portrait','Minase Inori',''],
[85,'images/CCI20180930-2.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2017 December" Animate Bonus'],
[86,'images/CCI20180930-3.jpg','portrait','Minase Inori','CD "Aimaimoko" Animate Bonus'],
[87,'images/CCI20180930-4.jpg','portrait','Minase Inori','CD "Aimaimoko" Sofmap Bonus'],







[95,'images/CCI20181231_0000-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[96,'images/CCI20181231_0000-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[97,'images/CCI20181231_0001-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[98,'images/CCI20181231_0001-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[99,'images/CCI20181231_0002-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[100,'images/CCI20181231_0002-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[101,'images/CCI20181231_0003-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[102,'images/CCI20181231_0003-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[103,'images/CCI20190502_001.jpg','portrait','Kouno Marika','Book "Marinka" Amazon Japan Bonus'],
[104,'images/CCI20190502_002.jpg','portrait','Kido Ibuki','Book "breath." Gamers Bonus'],
[105,'images/CCI20190629_0000_1.jpg','portrait','Tomatsu Haruka','CD "courage" Toranoana Bonus'],
[106,'images/CCI20190629_0000_2.jpg','portrait','Minase Inori','Event "Inori Minase 1st LIVE Ready Steady Go!" Bromide'],
[107,'images/CCI20190629_0000_3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Animate Bonus'],


[110,'images/CCI20190629_0001_1.jpg','landscape','Asakura Momo','CD "Smash Drop" Animate Bonus'],
[111,'images/CCI20190629_0001_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[112,'images/CCI20190629_0002_1.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[113,'images/CCI20190629_0002_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[114,'images/CCI20190629_0002_3.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[115,'images/CCI20190629_0002_4.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[116,'images/CCI20190629_0003_1.jpg','landscape','Touyama Nao','CD "Gunjou Infinity" Animate Bonus'],
[117,'images/CCI20190629_0003_2.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Sofmap Animega Bonus'],
[118,'images/CCI20190629_0003_3.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Gamers Bonus'],
[119,'images/CCI20190629_0003_4.jpg','landscape','Natsukawa Shiina','CD "Log Line" Animate Bonus'],
[120,'images/CCI20190629_0004_1.jpg','portrait','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[121,'images/CCI20190629_0004_2.jpg','landscape','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[122,'images/CCI20190629_0004_3.jpg','portrait','Tomatsu Haruka','CD "COLORFUL GIFT" Animate Bonus'],
[123,'images/CCI20190629_0005_1.jpg','landscape','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[124,'images/CCI20190629_0005_2.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[125,'images/CCI20190629_0005_3.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[126,'images/CCI20190629_0006_1.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[127,'images/CCI20190629_0006_2.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[128,'images/CCI20190629_0006_3.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[129,'images/CCI20190921.jpg','landscape','Asakura Momo','CD "Yume Cinderella" Gamers Bonus'],



















[149,'images/CCI20191026_0001.jpg','landscape','Kitou Akari','CD "Swinging Heart" Canime Bonus'],
[150,'images/CCI20200222_0001_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[151,'images/CCI20200222_0001_2.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[152,'images/CCI20200222_0001_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[153,'images/CCI20200222_0001_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[154,'images/CCI20200222_0002_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[155,'images/CCI20200222_0002_2.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[156,'images/CCI20200222_0002_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[157,'images/CCI20200222_0002_4.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[158,'images/CCI20200222_0003_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[159,'images/CCI20200222_0003_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[160,'images/CCI20200222_0003_3.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[161,'images/CCI20200222_0003_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],

[163,'images/CCI20200222_0004_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[164,'images/CCI20200613_0000-1.jpg','portrait','Toyota Moe',''],
[165,'images/CCI20200613_0000-2.jpg','portrait','Asakura Momo','CD "Agapanthus" Animate Bonus'],
[166,'images/CCI20200613_0000-3.jpg','landscape','Fuchigami Mai','CD "Yosou Funou Days/Valantine Hunter" TSUTAYA Bonud'],
[167,'images/CCI20200613_0000-4.jpg','portrait','Amamiya Sora','CD "PARADOX" TSUTAYA Bonus'],
[168,'images/CCI20200613_0001-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[169,'images/CCI20200613_0001-2.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[170,'images/CCI20200613_0001-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[171,'images/CCI20200613_0001-4.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[172,'images/CCI20200613_0002-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[173,'images/CCI20200613_0002-2.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[174,'images/CCI20200613_0002-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[175,'images/CCI20200613_0002-4.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[176,'images/CCI20200613_0003-1.jpg','portrait','Tachibana Rika','Book "Seiyuu Paradise R vol.25" Gamers Bonus'],
[177,'images/CCI20200613_0003-2.jpg','landscape','Tachibana Rika','CD "Heart Shaker" Gamers Bonus'],
[178,'images/CCI20200613_0003-3.jpg','landscape','Asakura Momo','CD "365xLOVE" HMV Bonus'],
[179,'images/CCI20200613_0003-4.jpg','landscape','Asakura Momo','CD "365xLOVE" Animate Bonus'],
[180,'images/CCI20200613_0004-1.jpg','portrait','Kouno Marika',''],
[181,'images/CCI20200613_0004-2.jpg','portrait','Kouno Marika',''],
[182,'images/CCI20200613_0004-3.jpg','portrait','Natsukawa Shiina','CD "Ep01" Gamers Bonus'],
[183,'images/CCI20200613_0004-4.jpg','landscape','Hanazawa Kana','Book "Hanazawa Kana Calendar" Type A Bonus'],
[184,'images/CCI20200613_0005-1.jpg','landscape','TrySail','CD "Senpai." Gamers Bonus'],
[185,'images/CCI20200613_0005-2.jpg','landscape','Amamiya Sora','CD "Regeneration" Animate Bonus'],
[186,'images/CCI20200613_0005-3.jpg','portrait','Minase Inori','Book "Seiyuu Grand Prix 2020 March" Animate Bonus'],
[187,'images/CCI20200613_0005-4.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2019 May" Animate Bonus'],
[188,'images/CCI20200613_0006-1.jpg','portrait','Tomatsu Haruka','CD "Fantastic Soda!!" Tower Records Bonus'],
[189,'images/CCI20200613_0006-2.jpg','portrait','Tomatsu Haruka','CD "Tomatsu Haruka BEST SELECTION -sunshine-" HMV Japan Bonus'],
[190,'images/CCI20200613_0006-3.jpg','landscape','Amamiya Sora','CD "irodori" Animate Bonus'],
[191,'images/CCI20200613_0007-1.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[192,'images/CCI20200613_0007-2.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[193,'images/CCI20200613_0007-3.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[194,'images/CCI20200613_0007-4.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[195,'images/CCI20200613_0008-1.jpg','landscape','Hanazawa Kana','CD "Opportunity" Animate Bonus'],
[196,'images/CCI20200613_0008-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Kanameguri ~Kouhen~" Toranoana Bonus'],
[197,'images/CCI20200613_0008-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" B Ver. Bonus'],
[198,'images/CCI20200613_0009-1.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.B Bonus'],
[199,'images/CCI20200613_0009-2.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.A Bonus'],
[200,'images/CCI20200613_0009-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" C Ver. Bonus'],
[201,'images/CCI20200613_0009-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook How to go?" Gamers Bonus'],
[202,'images/CCI20200613_0010-1.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" A Ver. Bonus'],
[203,'images/CCI20200613_0010-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Gamers Bonus'],
[204,'images/CCI20200613_0010-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" Event Only Toranoana Bonus'],
[205,'images/CCI20200613_0010-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Tooi Kuchibue" Event Only Toranoana Bonus'],
[206,'images/CCI20200613_0011-1.jpg','portrait','Hanazawa Kana','Event "6/23" Limited Edition Bonus'],
[207,'images/CCI20200613_0011-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Calendar" C Ver. Bonus'],
[208,'images/CCI20200613_0011-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Animega Bonus'],
[209,'images/CCI20200613_0011-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Toranoana Bonus'],
[210,'images/CCI20200613_0012-1.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[211,'images/CCI20200613_0012-2.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[212,'images/CCI20200613_0012-3.jpg','landscape','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[213,'images/CCI20200613_0013-1.jpg','landscape','TrySail','CD "Gomakashi/Utsuroi" Animate Bonus'],
[214,'images/CCI20200613_0013-2.jpg','landscape','Touyama Nao','CD "Aruite Ikou!" Animate Bonus'],
[215,'images/CCI20200613_0013-3.jpg','portrait','Uesaka Sumire','Book "Seiyuu Grand Prix 2018 February" Animate Bonus'],
[216,'images/CCI20200613_0013-4.jpg','portrait','Kitou Akari','CD "Desire Again" Toranoana Bonus'],
[217,'images/CCI20200613_0014-1.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[218,'images/CCI20200613_0014-2.jpg','landscape','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[219,'images/CCI20200613_0014-3.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[220,'images/CCI20200613_0015-1.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[221,'images/CCI20200613_0015-2.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[222,'images/CCI20200613_0015-3.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[223,'images/CCI20200613_0016-1.jpg','landscape','Kitou Akari','CD "Desire Again" Canime Bonus'],
[224,'images/CCI20200613_0017-1.jpg','landscape','TrySail','CD "Free Turn" Animate Bonus'],
[225,'images/CCI20200613_0017-2.jpg','landscape','Kitou Akari','Book "Seiyuu Paradise R vol.32" Sofmap Animega Bonus'],
[226,'images/CCI20200613_0017-3.jpg','landscape','TrySail','Book "Seiyuu Animedia 2020 April" Animate/Gamers/Toranoana Bonus'],
[231,'images/CCI20200728_0008_1.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[232,'images/CCI20200728_0008_2.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[233,'images/CCI20200728_0008_3.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[234,'images/CCI20200728_0009_1.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[235,'images/CCI20200728_0009_2.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[236,'images/CCI20200728_0009_3.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[237,'images/CCI20200728_0011_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[238,'images/CCI20200728_0011_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[239,'images/CCI20200728_0011_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[240,'images/CCI20200728_0012_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[241,'images/CCI20200728_0012_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[242,'images/CCI20200728_0012_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[243,'images/CCI20200728_0013_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[244,'images/CCI20200728_0013_2.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[245,'images/CCI20200728_0013_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[246,'images/CCI20200728_0013_4.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[247,'images/CCI20200728_0014_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[248,'images/CCI20200728_0014_2.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[249,'images/CCI20200728_0014_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[250,'images/CCI20200728_0014_4.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],

[0,'','','']
];