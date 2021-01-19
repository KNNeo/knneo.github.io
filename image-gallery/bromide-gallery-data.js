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

//array containing all gallery info, tags delimiter "|"
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],
[1,'{domain}/SELFSCAN_20140111_0002.jpg','portrait','Kotobuki Minako','CD "pretty fever" Animate Bonus'],
[2,'{domain}/SELFSCAN_20140111_0005.jpg','portrait','Hikasa Youko','CD "Seek Diamonds" Animate Bonus'],
[3,'{domain}/SELFSCAN_20140111_0007.jpg','landscape','Tomatsu Haruka','CD "Yume Sekai" ver.6 Bonus'],
[5,'{domain}/SELFSCAN_20140111_0009.jpg','landscape','Taketatsu Ayana','CD "Sinfonia! Sinfonia!!!" Bonus'],
[6,'{domain}/SELFSCAN_20140111_0010.jpg','portrait','Taketatsu Ayana','CD "Onpu no Kuni no Alice" Bonus'],
[7,'{domain}/SELFSCAN_20140111_0011.jpg','portrait','Taketatsu Ayana','CD "Jikuu Tours" Bonus'],
[8,'{domain}/SELFSCAN_20140307_0001.jpg','portrait','Horie Yui','CD "Golden Time" Bonus'],
[11,'{domain}/SELFSCAN_20140311_0002.jpg','landscape','Satou Satomi','CD "Mirai Night" Neowing Bonus'],
[12,'{domain}/SELFSCAN_20140324_0001.jpg','portrait','Horie Yui','CD "The World\'s End" Bonus'],
[13,'{domain}/SELFSCAN_20140324_0002.jpg','portrait','Toyosaki Aki','CD "Delight" Tower Records Bonus'],
[15,'{domain}/SELFSCAN_20140424_0002.jpg','portrait','Kotobuki Minako','CD "Believe x" Sony Music Shop Bonus'],
[16,'{domain}/SELFSCAN_20140529_0001.jpg','landscape','sphere','CD "Kasuka na Hisoka na Tashika na Mirai" Bonus'],
[20,'{domain}/SELFSCAN_20140719_0001.jpg','portrait','Toyosaki Aki','CD "Kanae Tamae" Toranoana Bonus'],
[23,'{domain}/SELFSCAN_20140823_0001.jpg','portrait','Amamiya Sora','CD "Skyreach" Aniplex+ Bonus'],
[24,'{domain}/IMG_20141029_0001.jpg','landscape','Taketatsu Ayana','CD "Kajirikake no Ringo" Tower Records Bonus'],
[25,'{domain}/SELFSCAN_20141117_0001.jpg','portrait','Toyosaki Aki','CD "Portrait" Animate Bonus'],
[30,'{domain}/SELFSCAN_20150228_0005.jpg','landscape','sphere','CD "sphere" HMV Japan Bonus'],
[31,'{domain}/SELFSCAN_20150415_0001.jpg','portrait','Kotobuki Minako','CD "black hole" Animate Bonus'],
[32,'{domain}/SELFSCAN_20150526_0001.jpg','portrait','TrySail','CD "Youthful Dreamer" Toranoana Bonus'],
[34,'{domain}/SELFSCAN_20150625_0002.jpg','portrait','Toyosaki Aki','CD "Uh-LaLa" HMV Japan Bonus'],
[35,'{domain}/SELFSCAN_20150925_0001.jpg','portrait','Kotobuki Minako','CD "Candy Color Pop" Tower Records Bonus'],
[36,'{domain}/SELFSCAN_20151001_0001.jpg','portrait','Tomatsu Haruka','CD "STEP A GO! GO!" HMV Japan Bonus'],
[38,'{domain}/SELFSCAN_20160204_0001.jpg','portrait','Taketatsu Ayana','CD "Hey! Calorie Queen" HMV Japan Bonus'],

[41,'{domain}/SELFSCAN_20160227_0005.jpg','portrait','Tomatsu Haruka','CD "Cinderella Symphony" Toranoana Bonus'],
[42,'{domain}/SELFSCAN_20160402_0001.jpg','portrait','Toyosaki Aki','CD "all time Lovin\'" HMV Japan Bonus'],
[45,'{domain}/SELFSCAN_20160531_0001.jpg','landscape','TrySail','CD "whiz" HMV Japan Bonus'],
[48,'{domain}/SELFSCAN_20160602_0003.jpg','portrait','TrySail','CD "High Free Spirits" Aniplex+ Bonus'],
[51,'{domain}/SELFSCAN_20160629_0003.jpg','portrait','Kotobuki Minako',''],
[52,'{domain}/SELFSCAN_20160629_0004.jpg','landscape','Toyosaki Aki',''],

[54,'{domain}/SELFSCAN_20160629_0006.jpg','portrait','Toyosaki Aki',''],
[55,'{domain}/SELFSCAN_20160629_0007.jpg','landscape','Toyosaki Aki',''],
[56,'{domain}/SELFSCAN_20160629_0008.jpg','landscape','Toyosaki Aki',''],
[57,'{domain}/IMG_20160629_0009.jpg','portrait','Toyosaki Aki',''],
[58,'{domain}/SELFSCAN_20160629_0010.jpg','portrait','Toyosaki Aki',''],
[59,'{domain}/SELFSCAN_20160629_0011.jpg','portrait','Toyosaki Aki',''],
[60,'{domain}/SELFSCAN_20160905_0001.jpg','portrait','Toyosaki Aki',''],
[61,'{domain}/IMG_20170107_0001.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[62,'{domain}/IMG_20170107_0002.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[63,'{domain}/IMG_20170107_0003.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[64,'{domain}/IMG_20170107_0004.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[65,'{domain}/IMG_20170107_0005.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[66,'{domain}/IMG_20170107_0006.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[67,'{domain}/IMG_20170107_0007.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[68,'{domain}/IMG_20170107_0008.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[69,'{domain}/IMG_20170107_0009.jpg','portrait','Komatsu Mikako','Event "Komatsu Mikako HAPIKOSHI ! LIVE 2016 "Imagine day, Imagine life!"" Bromide Set'],
[70,'{domain}/SELFSCAN_20170510_0001.jpg','portrait','Natsukawa Shiina','CD "Grapefruit Moon" Animate Bonus'],
[71,'{domain}/SELFSCAN_20170602_0002.jpg','portrait','TrySail','CD "adrenaline!!!" Animate Bonus'],
[72,'{domain}/SELFSCAN_20170610_0001.jpg','portrait','Toyosaki Aki','CD "Honey to Lupus" Gamers Bonus'],
[73,'{domain}/SELFSCAN_20170720_0001.jpg','portrait','Toyosaki Aki','CD "love your Best" HMV Japan Bonus'],
[77,'{domain}/SELFSCAN_20170728_0005.jpg','portrait','Uesaka Sumire','CD "Odore! Kyuukyoku Tetsugaku" Tower Records Bonus'],
[79,'{domain}/SELFSCAN_20170728_0008.jpg','portrait','TrySail','CD "Original." Gamers Bonus'],
[80,'{domain}/SELFSCAN_20170908_0001.jpg','landscape','Natsukawa Shiina','CD "Fuwari, Korori, Karan, Koron" Gamers Bonus'],
[81,'{domain}/CCI20180102_0001.jpg','portrait','Amamiya Sora','CD "Eternal" Aniplex+ Bonus'],

[83,'{domain}/CCI20180331_0001.jpg','landscape','TrySail','CD "WANTED GIRL" Tower Records Bonus'],
[84,'{domain}/CCI20180930-1.jpg','portrait','Minase Inori',''],
[85,'{domain}/CCI20180930-2.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2017 December" Animate Bonus'],
[86,'{domain}/CCI20180930-3.jpg','portrait','Minase Inori','CD "Aimaimoko" Animate Bonus'],
[87,'{domain}/CCI20180930-4.jpg','portrait','Minase Inori','CD "Aimaimoko" Sofmap Bonus'],







[95,'{domain}/CCI20181231_0000-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[96,'{domain}/CCI20181231_0000-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[97,'{domain}/CCI20181231_0001-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[98,'{domain}/CCI20181231_0001-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[99,'{domain}/CCI20181231_0002-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[100,'{domain}/CCI20181231_0002-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[101,'{domain}/CCI20181231_0003-1.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[102,'{domain}/CCI20181231_0003-2.jpg','portrait','Komatsu Mikako','Event "HAPIKOSHI! LIVE 2018" Bromide'],
[103,'{domain}/CCI20190502_001.jpg','portrait','Kouno Marika','Book "Marinka" Amazon Japan Bonus'],
[104,'{domain}/CCI20190502_002.jpg','portrait','Kido Ibuki','Book "breath." Gamers Bonus'],
[105,'{domain}/CCI20190629_0000_1.jpg','portrait','Tomatsu Haruka','CD "courage" Toranoana Bonus'],
[106,'{domain}/CCI20190629_0000_2.jpg','portrait','Minase Inori','Event "Inori Minase 1st LIVE Ready Steady Go!" Bromide'],
[107,'{domain}/CCI20190629_0000_3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Animate Bonus'],


[110,'{domain}/CCI20190629_0001_1.jpg','landscape','Asakura Momo','CD "Smash Drop" Animate Bonus'],
[111,'{domain}/CCI20190629_0001_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[112,'{domain}/CCI20190629_0002_1.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[113,'{domain}/CCI20190629_0002_2.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[114,'{domain}/CCI20190629_0002_3.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[115,'{domain}/CCI20190629_0002_4.jpg','portrait','Kouno Marika','Book "Seiyuu Paradise R vol.24" Kinokuniya Bonus'],
[116,'{domain}/CCI20190629_0003_1.jpg','landscape','Touyama Nao','CD "Gunjou Infinity" Animate Bonus'],
[117,'{domain}/CCI20190629_0003_2.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Sofmap Animega Bonus'],
[118,'{domain}/CCI20190629_0003_3.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Gamers Bonus'],
[119,'{domain}/CCI20190629_0003_4.jpg','landscape','Natsukawa Shiina','CD "Log Line" Animate Bonus'],
[120,'{domain}/CCI20190629_0004_1.jpg','portrait','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[121,'{domain}/CCI20190629_0004_2.jpg','landscape','Fujita Akane','Book "Seiyuu Animedia 2018 January" Bonus'],
[122,'{domain}/CCI20190629_0004_3.jpg','portrait','Tomatsu Haruka','CD "COLORFUL GIFT" Animate Bonus'],
[123,'{domain}/CCI20190629_0005_1.jpg','landscape','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[124,'{domain}/CCI20190629_0005_2.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[125,'{domain}/CCI20190629_0005_3.jpg','portrait','Amamiya Sora','Book "Seiyuu Animedia 2018 July" Bonus'],
[126,'{domain}/CCI20190629_0006_1.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[127,'{domain}/CCI20190629_0006_2.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[128,'{domain}/CCI20190629_0006_3.jpg','portrait','Asakura Momo','Book "Seiyuu Animedia 2018 October" Animate Bonus'],
[129,'{domain}/CCI20190921.jpg','landscape','Asakura Momo','CD "Yume Cinderella" Gamers Bonus'],



















[149,'{domain}/CCI20191026_0001.jpg','landscape','Kitou Akari','CD "Swinging Heart" Canime Bonus'],
[150,'{domain}/CCI20200222_0001_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[151,'{domain}/CCI20200222_0001_2.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[152,'{domain}/CCI20200222_0001_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[153,'{domain}/CCI20200222_0001_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[154,'{domain}/CCI20200222_0002_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[155,'{domain}/CCI20200222_0002_2.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[156,'{domain}/CCI20200222_0002_3.jpg','landscape','Uesaka Sumire','Event "Uesaka Sumire no No Future Diary 2019 LIVE" Bromide'],
[157,'{domain}/CCI20200222_0002_4.jpg','portrait','Kitou Akari','Book "Love route" Gamers Bonus'],
[158,'{domain}/CCI20200222_0003_1.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[159,'{domain}/CCI20200222_0003_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[160,'{domain}/CCI20200222_0003_3.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[161,'{domain}/CCI20200222_0003_4.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],

[163,'{domain}/CCI20200222_0004_2.jpg','portrait','Uesaka Sumire','Event "Uesaka Sumire no Hitori Sumo 2016  ~Saikederikku Junjou~" Bromide'],
[164,'{domain}/CCI20200613_0000-1.jpg','portrait','Toyota Moe',''],
[165,'{domain}/CCI20200613_0000-2.jpg','portrait','Asakura Momo','CD "Agapanthus" Animate Bonus'],
[166,'{domain}/CCI20200613_0000-3.jpg','landscape','Fuchigami Mai','CD "Yosou Funou Days/Valantine Hunter" TSUTAYA Bonud'],
[167,'{domain}/CCI20200613_0000-4.jpg','portrait','Amamiya Sora','CD "PARADOX" TSUTAYA Bonus'],
[168,'{domain}/CCI20200613_0001-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[169,'{domain}/CCI20200613_0001-2.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[170,'{domain}/CCI20200613_0001-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[171,'{domain}/CCI20200613_0001-4.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Ouchi ver. Bromide Set'],
[172,'{domain}/CCI20200613_0002-1.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[173,'{domain}/CCI20200613_0002-2.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[174,'{domain}/CCI20200613_0002-3.jpg','landscape','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[175,'{domain}/CCI20200613_0002-4.jpg','portrait','Taketatsu Ayana','Event "apple feuille" Odekake ver. Bromide Set'],
[176,'{domain}/CCI20200613_0003-1.jpg','portrait','Tachibana Rika','Book "Seiyuu Paradise R vol.25" Gamers Bonus'],
[177,'{domain}/CCI20200613_0003-2.jpg','landscape','Tachibana Rika','CD "Heart Shaker" Gamers Bonus'],
[178,'{domain}/CCI20200613_0003-3.jpg','landscape','Asakura Momo','CD "365xLOVE" HMV Bonus'],
[179,'{domain}/CCI20200613_0003-4.jpg','landscape','Asakura Momo','CD "365xLOVE" Animate Bonus'],
[180,'{domain}/CCI20200613_0004-1.jpg','portrait','Kouno Marika',''],
[181,'{domain}/CCI20200613_0004-2.jpg','portrait','Kouno Marika',''],
[182,'{domain}/CCI20200613_0004-3.jpg','portrait','Natsukawa Shiina','CD "Ep01" Gamers Bonus'],
[183,'{domain}/CCI20200613_0004-4.jpg','landscape','Hanazawa Kana','Book "Hanazawa Kana Calendar" Type A Bonus'],
[184,'{domain}/CCI20200613_0005-1.jpg','landscape','TrySail','CD "Senpai." Gamers Bonus'],
[185,'{domain}/CCI20200613_0005-2.jpg','landscape','Amamiya Sora','CD "Regeneration" Animate Bonus'],
[186,'{domain}/CCI20200613_0005-3.jpg','portrait','Minase Inori','Book "Seiyuu Grand Prix 2020 March" Animate Bonus'],
[187,'{domain}/CCI20200613_0005-4.jpg','portrait','Minase Inori','Book "Seiyuu Animedia 2019 May" Animate Bonus'],
[188,'{domain}/CCI20200613_0006-1.jpg','portrait','Tomatsu Haruka','CD "Fantastic Soda!!" Tower Records Bonus'],
[189,'{domain}/CCI20200613_0006-2.jpg','portrait','Tomatsu Haruka','CD "Tomatsu Haruka BEST SELECTION -sunshine-" HMV Japan Bonus'],
[190,'{domain}/CCI20200613_0006-3.jpg','landscape','Amamiya Sora','CD "irodori" Animate Bonus'],
[191,'{domain}/CCI20200613_0007-1.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[192,'{domain}/CCI20200613_0007-2.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[193,'{domain}/CCI20200613_0007-3.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[194,'{domain}/CCI20200613_0007-4.jpg','portrait','Hanazawa Kana','Event "Kimi ga Inakucha Dame Nanda" Bromide Set'],
[195,'{domain}/CCI20200613_0008-1.jpg','landscape','Hanazawa Kana','CD "Opportunity" Animate Bonus'],
[196,'{domain}/CCI20200613_0008-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Kanameguri ~Kouhen~" Toranoana Bonus'],
[197,'{domain}/CCI20200613_0008-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" B Ver. Bonus'],
[198,'{domain}/CCI20200613_0009-1.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.B Bonus'],
[199,'{domain}/CCI20200613_0009-2.jpg','portrait','Hanazawa Kana','Book "B.L.T.VOICE GIRLS VOL.10" Hanazawa Kana Ver.A Bonus'],
[200,'{domain}/CCI20200613_0009-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" C Ver. Bonus'],
[201,'{domain}/CCI20200613_0009-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook How to go?" Gamers Bonus'],
[202,'{domain}/CCI20200613_0010-1.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" A Ver. Bonus'],
[203,'{domain}/CCI20200613_0010-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 2nd Photobook Tooi Kuchibue" Gamers Bonus'],
[204,'{domain}/CCI20200613_0010-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana 1st Photobook KANA" Event Only Toranoana Bonus'],
[205,'{domain}/CCI20200613_0010-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Photobook Tooi Kuchibue" Event Only Toranoana Bonus'],
[206,'{domain}/CCI20200613_0011-1.jpg','portrait','Hanazawa Kana','Event "6/23" Limited Edition Bonus'],
[207,'{domain}/CCI20200613_0011-2.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana Calendar" C Ver. Bonus'],
[208,'{domain}/CCI20200613_0011-3.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Animega Bonus'],
[209,'{domain}/CCI20200613_0011-4.jpg','portrait','Hanazawa Kana','Book "Hanazawa Kana CALENDAR BOOK 2014.4~2015.3" Toranoana Bonus'],
[210,'{domain}/CCI20200613_0012-1.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[211,'{domain}/CCI20200613_0012-2.jpg','portrait','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[212,'{domain}/CCI20200613_0012-3.jpg','landscape','Minase Inori','Event "KING SUPER LIVE 2018" Minase Inori Bromide Set'],
[213,'{domain}/CCI20200613_0013-1.jpg','landscape','TrySail','CD "Gomakashi/Utsuroi" Animate Bonus'],
[214,'{domain}/CCI20200613_0013-2.jpg','landscape','Touyama Nao','CD "Aruite Ikou!" Animate Bonus'],
[215,'{domain}/CCI20200613_0013-3.jpg','portrait','Uesaka Sumire','Book "Seiyuu Grand Prix 2018 February" Animate Bonus'],
[216,'{domain}/CCI20200613_0013-4.jpg','portrait','Kitou Akari','CD "Desire Again" Toranoana Bonus'],
[217,'{domain}/CCI20200613_0014-1.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[218,'{domain}/CCI20200613_0014-2.jpg','landscape','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[219,'{domain}/CCI20200613_0014-3.jpg','portrait','Horie Yui','Event "KING SUPER LIVE 2018" Horie Yui Bromide Set'],
[220,'{domain}/CCI20200613_0015-1.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[221,'{domain}/CCI20200613_0015-2.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[222,'{domain}/CCI20200613_0015-3.jpg','portrait','Uesaka Sumire','Event "KING SUPER LIVE 2017" Uesaka Sumire Bromide Set'],
[223,'{domain}/CCI20200613_0016-1.jpg','landscape','Kitou Akari','CD "Desire Again" Canime Bonus'],
[224,'{domain}/CCI20200613_0017-1.jpg','landscape','TrySail','CD "Free Turn" Animate Bonus'],
[225,'{domain}/CCI20200613_0017-2.jpg','landscape','Kitou Akari','Book "Seiyuu Paradise R vol.32" Sofmap Animega Bonus'],
[226,'{domain}/CCI20200613_0017-3.jpg','landscape','TrySail','Book "Seiyuu Animedia 2020 April" Animate/Gamers/Toranoana Bonus'],
[231,'{domain}/CCI20200728_0008_1.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[232,'{domain}/CCI20200728_0008_2.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[233,'{domain}/CCI20200728_0008_3.jpg','portrait','Yuuki Aoi','Event "ColoFes 2020" Yuuki Aoi Bromide Set'],
[234,'{domain}/CCI20200728_0009_1.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[235,'{domain}/CCI20200728_0009_2.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[236,'{domain}/CCI20200728_0009_3.jpg','portrait','Waki Azumi','Event "ColoFes 2020" Waki Azumi Bromide Set'],
[237,'{domain}/CCI20200728_0011_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[238,'{domain}/CCI20200728_0011_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[239,'{domain}/CCI20200728_0011_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set A'],
[240,'{domain}/CCI20200728_0012_1.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[241,'{domain}/CCI20200728_0012_2.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[242,'{domain}/CCI20200728_0012_3.jpg','portrait','Minase Inori','Event "Inori Minase LIVE TOUR 2020 We Are Now" Bromide Set B'],
[243,'{domain}/CCI20200728_0013_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[244,'{domain}/CCI20200728_0013_2.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[245,'{domain}/CCI20200728_0013_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[246,'{domain}/CCI20200728_0013_4.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set A'],
[247,'{domain}/CCI20200728_0014_1.jpg','landscape','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[248,'{domain}/CCI20200728_0014_2.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[249,'{domain}/CCI20200728_0014_3.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[250,'{domain}/CCI20200728_0014_4.jpg','portrait','Taketatsu Ayana','Event "Taketatsu Ayana LIVE HOUSE TOUR 2019 A -Analyze-/-Another-" Bromide Set B'],
[251,'{domain}/CCI20200829_0001_1.jpg','portrait','Touyama Nao','Book "Seiyuu Grand Prix 2020 September" Gamers/HMVJapan/Toranoana Bonus'],
[252,'{domain}/CCI20200829_0001_2.jpg','landscape','Amamiya Sora','Book "Seiyuu Grand Prix 2020 September" Gamers/HMVJapan/Toranoana Bonus'],
[253,'{domain}/CCI20200829_0001_3.jpg','landscape','Takahashi Rie','Book "Seiyuu Grand Prix 2020 September" Gamers/HMVJapan/Toranoana Bonus'],
[254,'{domain}/CCI20200829_0001_4.jpg','portrait','Yuuki Aoi','Book "Seiyuu Grand Prix 2020 September" Gamers/HMVJapan/Toranoana Bonus'],
[256,'{domain}/CCI20200829_0002_2.jpg','portrait','Kouno Marika','CD "churata churaha" HMV Japan Bonus'],
[257,'{domain}/CCI20200905.jpg','portrait','Yuuki Aoi','Book "Ayakashi" Gamers Bonus'],
[258,'{domain}/CCI20200905_0001_1.jpg','landscape','sphere','CD "Eternal Tours" Animate Bonus'],
[259,'{domain}/CCI20200905_0001_2.jpg','landscape','sphere','CD "Jounetsu CONTINUE" Animate Bonus'],
[260,'{domain}/CCI20200905_0001_3.jpg','landscape','sphere','CD" Heart to Heart" Gamers Bonus'],
[261,'{domain}/CCI20200905_0001_4.jpg','landscape','sphere','CD "Ippun Ichibyou Kimi to Boku no" Animate Bonus'],
[262,'{domain}/CCI20200905_0002_1.jpg','portrait','Yuuki Aoi','Book "B.L.T. VOICE GIRLS vol.16" Animate Bonus'],
[263,'{domain}/CCI20200905_0002_2.jpg','landscape','Yuuki Aoi','CD "Eien Labyrinth" Toranoana Bonus'],
[264,'{domain}/CCI20200905_0002_3.jpg','portrait','Yuuki Aoi','CD "Petipa" Gamers Bonus'],
[265,'{domain}/CCI20200905_0002_4.jpg','portrait','Yuuki Aoi','Book "Yuuki Aoi Photobook Sugary Fairy ~Kisetsu no Sweets wo Kazoete~" Animate Bonus'],
[266,'{domain}/CCI20200905_0003_1.jpg','landscape','Tachibana Rika','CD "LIFE" Tower Records Bonus'],
[267,'{domain}/CCI20200905_0003_2.jpg','landscape','Tachibana Rika','CD "Colorful Passage" HMV Japan Bonus'],
[268,'{domain}/CCI20200905_0003_3.jpg','portrait','Tachibana Rika','Book "Seiyuu Paradise R vol.23" Gamers Bonus'],
[269,'{domain}/CCI20200905_0003_4.jpg','portrait','Ookubo Rumi','Book "Illumination Closet" Animate Bonus'],
[270,'{domain}/CCI20200905_0005_1.jpg','portrait','Kotobuki Minako','Book "Jiffy" Animate Bonus'],
[271,'{domain}/CCI20200905_0005_2.jpg','portrait','Kotobuki Minako','Book "MINAKO Good Job Hyper -Kotobuki Minako Photobook-" Gamers Bonus'],
[272,'{domain}/CCI20200905_0005_3.jpg','portrait','Kotobuki Minako','CD "emotion" Gamers Bonus'],
[273,'{domain}/CCI20200905_0005_4.jpg','portrait','Kotobuki Minako','CD "Million Futures" Gamers Bonus'],
[274,'{domain}/CCI20200905_0006_1.jpg','portrait','Satou Satomi','DVD "Gekkan Mobakon Satomi Hakkendan August" Pre-order Bonus'],
[275,'{domain}/CCI20200905_0006_2.jpg','portrait','Satou Satomi','CD "Fanfare" Animate Bonus'],
[276,'{domain}/CCI20200905_0006_3.jpg','portrait','Satou Satomi','Event "KING SUPER LIVE 2015" Bromide'],
[277,'{domain}/CCI20200905_0006_4.jpg','portrait','Numakura Manami','Book "Seiyuu Animedia 2017 July" Animate Bonus'],
[278,'{domain}/CCI20200905_0007_1.jpg','portrait','Natsukawa Shiina','Event "Haru no Seiyuu Matsuri" Bromide'],
[279,'{domain}/CCI20200905_0007_2.jpg','portrait','Fuchigami Mai','Book "Seiyuu Animedia 2018 February" Animate Bonus'],
[280,'{domain}/CCI20200905_0007_3.jpg','landscape','Natsukawa Shiina','CD "Ep01" Animate Bonus'],
[281,'{domain}/CCI20200905_0007_4.jpg','landscape','Fuchigami Mai','DVD "Seiyuu Sanpo ~Fuchigami Mai~" Toranoana Bonus'],
[282,'{domain}/CCI20200905_0008_1.jpg','landscape','sphere','CD "vivid brilliant door!" Gamers Bonus'],
[283,'{domain}/CCI20200905_0008_2.jpg','landscape','Kido Ibuki','Book "IMADOKI!!" Pre-order Bonus'],

[285,'{domain}/CCI20201008_0001_2.jpg','portrait','Natsukawa Shiina','CD "Antithese" Toranoana Bonus'],
[286,'{domain}/CCI20201008_0001_3.jpg','portrait','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bonus'],
[287,'{domain}/CCI20201008_0002_1.jpg','landscape','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set A'],
[288,'{domain}/CCI20201008_0002_2.jpg','portrait','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set A'],
[289,'{domain}/CCI20201008_0002_3.jpg','portrait','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set A'],
[290,'{domain}/CCI20201008_0003_1.jpg','portrait','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set B'],
[291,'{domain}/CCI20201008_0003_2.jpg','landscape','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set B'],
[292,'{domain}/CCI20201008_0003_3.jpg','landscape','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set B'],
[293,'{domain}/CCI20201008_0005_1.jpg','landscape','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set C'],
[294,'{domain}/CCI20201008_0005_2.jpg','portrait','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set C'],
[295,'{domain}/CCI20201008_0005_3.jpg','portrait','Kitou Akari','Event "Kitou Akari 1st LIVE TOUR Colorful Closet" Bromide Set C'],
[296,'{domain}/CCI20201008_0006_1.jpg','portrait','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set A'],
[297,'{domain}/CCI20201008_0006_2.jpg','landscape','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set A'],
[298,'{domain}/CCI20201008_0007_1.jpg','portrait','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set A'],
[299,'{domain}/CCI20201008_0007_2.jpg','landscape','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set B'],
[300,'{domain}/CCI20201008_0008_1.jpg','portrait','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set B'],
[301,'{domain}/CCI20201008_0008_2.jpg','portrait','Toyota Moe','Event "Toyota Moe Birthday Party 2020" Bromide Set B'],
[302,'{domain}/CCI20201212_0001_1.jpg','portrait','Ueda Reina','CD "Literature" Animate Bonus'],
[303,'{domain}/CCI20201212_0001_2.jpg','portrait','Hikasa Youko','CD "Utsukushiki Zankoku na Sekai" Gamers Bonus'],
[304,'{domain}/CCI20201212_0001_3.jpg','portrait','Kouno Marika','Book "Marinka" First Press Limited Edition Bonus'],
[305,'{domain}/CCI20201212_0001_4.jpg','portrait','Ookubo Rumi','DVD "Ookubo Rumi Hara Sayuri Seishun Gakuen Girls High Fandisk Vol.2" Bonus'],
[306,'{domain}/CCI20201212_0002_1.jpg','landscape','Waki Azumi','CD "Fuwatto/Citrus" Toranoana Bonus'],
[307,'{domain}/CCI20201212_0002_2.jpg','portrait','Touyama Nao','CD "Aruite Ikou!" Toranoana Bonus'],
[308,'{domain}/CCI20201212_0002_3.jpg','portrait','Touyama Nao','Book "My Girl vol.22" Gamers Bonus'],
[309,'{domain}/CCI20201212_0002_4.jpg','portrait','Touyama Nao','Book "My Girl vol.22" Gamers Bonus'],
[310,'{domain}/CCI20201212_0003_1.jpg','portrait','Kouno Marika','Book "Marinka" First Press Limited Edition Bonus'],
[311,'{domain}/CCI20201212_0003_2.jpg','landscape','Hikasa Youko','CD "EX:FUTURIZE" Toranoana Bonus'],
[312,'{domain}/CCI20201212_0003_3.jpg','landscape','Koga Aoi','Book "Seiyuu Animedia August 2020" Animate Bonus'],
[313,'{domain}/CCI20201212_0003_4.jpg','landscape','Tachibana Rika','CD "LIFE" Gamers Bonus'],
[314,'{domain}/CCI20201212_0004_1.jpg','portrait','Natsukawa Shiina','Book "Seiyuu Grand Prix October 2020" Gamers Bonus'],
[315,'{domain}/CCI20201212_0004_2.jpg','landscape','Natsukawa Shiina','Book "Seiyuu Grand Prix October 2020" Animate Bonus'],
[316,'{domain}/CCI20201212_0004_3.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[317,'{domain}/CCI20201212_0004_4.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[318,'{domain}/CCI20201212_0005_1.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[319,'{domain}/CCI20201212_0005_2.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[320,'{domain}/CCI20201212_0005_3.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[321,'{domain}/CCI20201212_0005_4.jpg','portrait','Kido Ibuki','Book "breath" Release Event Bonus'],
[322,'{domain}/CCI20201212_0006_1.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[323,'{domain}/CCI20201212_0006_2.jpg','landscape','Kido Ibuki','Book "breath" Release Event Bonus'],
[324,'{domain}/CCI20201212_0006_3.jpg','portrait','Kido Ibuki','Book "breath" Release Event Bonus'],

[327,'{domain}/CCI20210116_2.jpg','landscape','Asakura Momo','Event "Asakura Momo Live 2020 Agapanthus" Postcard Set'],
[328,'{domain}/CCI20210116_3.jpg','portrait','Asakura Momo','Event "Asakura Momo Live 2020 Agapanthus" Postcard Set'],
[329,'{domain}/CCI20210116_0002_1.jpg','landscape','Asakura Momo','Event "Asakura Momo Live 2020 Agapanthus" Postcard Set'],
[330,'{domain}/CCI20210116_0002_2.jpg','portrait','Asakura Momo','Event "Asakura Momo Live 2020 Agapanthus" Postcard Set'],
[331,'{domain}/CCI20210116_0003_1.jpg','portrait','Asakura Momo','Event "Asakura Momo Live 2020 Agapanthus" Postcard Set'],
[332,'{domain}/CCI20210116_0004_1.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[333,'{domain}/CCI20210116_0004_2.jpg','landscape','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[334,'{domain}/CCI20210116_0004_3.jpg','landscape','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[335,'{domain}/CCI20210116_0005_1.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[336,'{domain}/CCI20210116_0005_2.jpg','landscape','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[337,'{domain}/CCI20210116_0005_3.jpg','landscape','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[338,'{domain}/CCI20210116_0006_1.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[339,'{domain}/CCI20210116_0006_2.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[340,'{domain}/CCI20210116_0006_3.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[341,'{domain}/CCI20210116_0007_1.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[342,'{domain}/CCI20210116_0007_2.jpg','landscape','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],
[343,'{domain}/CCI20210116_0007_3.jpg','portrait','Toyota Moe','Event "Toyota Moe no Room Share Shimashou" Bromide Set'],




[999,'','','']
];