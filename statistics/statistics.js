//set elements here
//to generate colors:
//(1) go to https://mdigi.tools/color-shades/, copy into console: Array.from(document.getElementsByClassName('color-shade')).map(color => color.style.backgroundColor);
//(2) from github chartjs-plugin-colorschemes/src/colorschemes/colorschemes.tableau.js:
const Tableau20 = ['#4E79A7', '#A0CBE8', '#F28E2B', '#FFBE7D', '#59A14F', '#8CD17D', '#B6992D', '#F1CE63', '#499894', '#86BCB6', '#E15759', '#FF9D9A', '#79706E', '#BAB0AC', '#D37295', '#FABFD2', '#B07AA1', '#D4A6C8', '#9D7660', '#D7B5A6']
const Classic10 = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf']
const Classic20 = ['#1f77b4', '#aec7e8', '#ff7f0e', '#ffbb78', '#2ca02c', '#98df8a', '#d62728', '#ff9896', '#9467bd', '#c5b0d5', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#7f7f7f', '#c7c7c7', '#bcbd22', '#dbdb8d', '#17becf', '#9edae5']
const BlueTeal20 = ['#bce4d8', '#aedcd5', '#a1d5d2', '#95cecf', '#89c8cc', '#7ec1ca', '#72bac6', '#66b2c2', '#59acbe', '#4ba5ba', '#419eb6', '#3b96b2', '#358ead', '#3586a7', '#347ea1', '#32779b', '#316f96', '#2f6790', '#2d608a', '#2c5985']
const ColorBlind10 = ['#1170aa', '#fc7d0b', '#a3acb9', '#57606c', '#5fa2ce', '#c85200', '#7b848f', '#a3cce9', '#ffbc79', '#c8d0d9']

let pageElements = [
	{
		title: 'POWERED BY CHART.JS',
		description: '(To show main page as after first page: all fields are optional, chart- defined parameters depend on chartData)'		
	},
	{
		isMain: true,
		prefix: 'Klassic Note Song Awards presents',
		title: 'KLASSIC NOTE: HALL OF FAME',
		suffix: 'JAPANESE CATEGORY',
	},
	{
		title: 'List of Japanese Artists',
		description: 'FROM FIRST YEAR ARTIST PARTICIPATION IN KLASSIC NOTE, IN NO PARTICULAR ORDER',
		chartType: 'histogram',
		chartColors: [...Classic20,...Tableau20,...Classic20,...Tableau20,...Classic20,...Tableau20,...Classic20,...Tableau20],
		chartLabel: [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
		chartData: [
			["2007 (26)","UVERworld","Rie fu","Younha","HIGH and MIGHTY COLOR","Horie Yui","YUI","Aqua Timez","Takacha","Kishidan","Koda Kumi","Hoshimura Mai","ASIAN KUNG-FU GENERATION","BEAT CRUSADERS","Chatmonchy","HOME MADE Kazoku","Ikimonogakari","JUNE","ORANGE RANGE","Ore Ska Band","Skoop On Somebody","SunSet Swish","Tsuji Ayano","Hirose Koumi","Kimura Yumi","GUMI","Hayashibara Megumi"  ],
			["2008 (21)","KELUN","KOTOKO","Kawada Mami","Lil’B aka MIE&AILA","Sakamoto Maaya","pe’zmoku","RSP","RYTHEM","Sambomaster","THYME","VELTPUNCH","SID","STEREOPONY","Tainaka Sachi","Porno Graffitti","Aya Kamiki","Gojo Mayumi","Kitahara Aiko","Uura Saeka","Kojima Megumi","SPECIAL OTHERS"  ],
			["2009 (12)","sphere","Flat Three","Kalafina","marble","OGRE YOU ASSHOLE","Primary","SCANDAL","Nakagawa Shoko","Tomatsu Haruka","Asai Kenichi","Toyosaki Aki","Tsuji Shion"  ],
			["2010 (13)","PE’Z","angela","ClariS","Diggy-MO'","miwa","SPYAIR","T.M.Revolution","The GazettE","universe","Kotobuki Minako","Kimura Kaela","Matsushita Yuuya","Tamura Yukari"  ],
			["2011 (18)","Aimer","ALTIMA","fumika","LAMA","LITTLE CREATURES","NICO Touches The Wall","ROOKiEZ is PUNK'D","School Food Punishment","UNLIMITS","ViViD","Tokumaru Shugo","Natural High","NEGOTO","Hyadain","Sasaki Sayaka","Kawano Marina","Isobe Masafumi","AZUMA HITOMI",  ],
			["2012 (22)","ChouCho","Dr.DOWNER","QUATTRO","sunday morning bell","YUKI","Hata Motohiro","Taketatsu Ayana","Hanazawa Kana","Kugimiya Rie","AiRI","Kodama Saori","Piko","HAPPY BIRTHDAY","ALTERNATIVE MEDICINE","SECONDWALL","Team.Nekokan [Neko]","9nine","deepNow","mouse on the keys","PHONO TONES","eufonius"  ],
			["2013 (26)","MINAMI NiNE","room free fall","CLIFF EDGE","Neat’s","yucat","Teshima Aoi","Annabel","Hikasa Youko","Linked Horizon","Komatsu Mikako","Imai Masaki","Iwasaki Ai","Aso Natsuko","Kitamura Eri","cinema staff","Kuso Iinkai","sasakure.UK","tacica","Ray","fhana","earthmind","yanaginagi","Base Ball Bear","Mary days story","mpi","STEREO DIVE FOUNDATION"  ],
			["2014 (27)","[Alexdndros]","FictionJunction","Yuuki Aoi","Goose house","FLOW","tic tac case","Pretaporter","Kon Natsumi","Tsuzuri Zukuri","Gotch","Ai (ex. RSP)","Shiritsu Ebisu Chuugaku","Good Morning America","TOKYO SKA PARADISE ORCHESTRA","iki","BIGNOUN","nano.RIPE","AKIRA","Takagaki Ayahi","FLOWER FLOWER","Larval Stage Planning","wacci",".lady.","d-iZe","Satou Satomi","Takebuchi Kei","Amamiya Sora",  ],
			["2015 (25)","KANA-BOON","moumoon","Coalamode.","7!!","TWEEDEES","THE ORAL CIGARETTES","Sasaki Eri","Imai Asami","AyumiKurikaMaki","Kiriku to Majou","PURPLE HUMPTY","Tokyo Karan Koron","SpecialThanks","Yoru no Honki Dance","Uchuu Club","Earphones","amazarashi","Sayuri","Scenarioart","Bentham","Saitou Johnny","TrySail","SCOTT GOES FOR","Asakamidori","Cocoro Auction"  ],
			["2016 (26)","Silent Siren","Miyawaki Shion","MICHI","metro polica","Takezawa Migiwa","Mrs. GREEN APPLE","GRANRODEO","Minase Inori","Light Palette","titilulu","The Floor","chocol8 syndrome","Sayaka","Mizuki Nana","LILI LIMIT","Shin Rizumu","SHISHAMO","AOP","Cocco","plenty","SWANKY DANK","Fujifabric","SCREEN mode","BUMP of CHICKEN","Numakura Manami","Asakura Momo"  ],
			["2017 (28)","GENNARI","ONE III NOTES","Sangatsu no Phantasia","Yuuki Aira","96neko","Natsukawa Shiina","Shinsei Kamatte-chan","ORESAMA","toi toy toi","Touyama Nao","※-come-","mol-74","vivid undress","Uesaka Sumire","Ogura Yui","UNISON SQUARE GARDEN","Ryokuoushoku Shakai","G-FREAK FACTORY","ADAM at","Frederic","H ZETTRIO","Suchmos","Shishido Kavka","a flood of circle","YURiKA","GLIM SPANKY","Roys","Sunrise in My Attache Case"  ],
			["2018 (23)","Oohara Yuiko","Friends","Awesome City Club","RUANN","Hayami Saori","SOROR","sumika","Endou Yurika","Ooishi Masayoshi","DENIMS","Komagata Yuri","Niitsu Yui","FINLANDS","MIYAVI x Shishido Kavka","Cider Girl","Survive Said The Prophet","Kuraki Mai","King Gnu","SIX LOUNGE","Polkadot Stingray","SHE’S","TWICE","BLUE ENCOUNT"  ],
			["2019 (16)","Fuchigami Mai","halca","Suzuki Masayuki","MaRuRi to Ryuga","Takigawa Alisa","Ghost Sense","FIVE NEW OLD","AIMI","Edoga Sullivan","Spira.Spica","amatsuuni","Nisshoku Natsuko","Kitou Akari","Tomita Miyu","Aoyama Sachiko","ONIGAWARA"  ],
			["2020 (29)","Play.Goose","Liyuu","Tachibana Rika","Waki Azumi","Uso to Chameleon","Suzuki Aina","Nanawo Akari","yourness","MOSHIMO","flumpool","Eve","uminecosounds","Ootaki Eiichi","Fukuhara Haruka","yorushika","YuNi","the peggies","Tsuki no Michikake","Kano","Mishima Souhei","Yunomi","Kanoerana","Pyxis","Ueda Reina","THE BAWDIES","Co shu Nie"  ]
		]
	},
	{
		title: 'Klassic Note Participants (Songs)',
		description: 'FROM NUMBER OF SONGS IN KLASSIC NOTE FROM CIRCA 2007; ALL CHARTS TO FOLLOW “KLASSIC NOTE”)',
		chartType: 'line',
		chartTitle: 'Song Count by Category/Source',
		chartColors: ["#7F7F7F", "#BFBFBF", "#C00000", "#000000"],
		chartLabel: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
		chartData: [
			["KLASSIC NOTE",43,154,322,502,687,889,1094,1314,1493,1733,1966,2171,2411,2616  ],
			["KLASSIC JAPAN",43,138,297,474,641,831,1028,1243,1414,1654,1885,2084,2319,2521  ],
			["KLASSIC J-POP",43,135,264,409,544,718,899,1104,1273,1511,1733,1923,2152,2351  ],
			["APPLE MUSIC",null,null,null,null,null,null,null,null,null,795,1143,1599,2037,2304  ]
		]
	},
	{
		chartType: 'bar',
		chartTitle: 'Song Count by Artist Type',
		chartColors: Classic10,
		chartLabel: [2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
		chartData: [
			["Independent Band",16,53,81,84,61,89,71,86,92,135,117,119,130,130  ],
			["Idol Group",1,4,19,12,20,17,15,17,25,14,15,9,8,8  ],
			["Anime Voice Actor Groups",0,1,8,17,3,3,2,3,0,0,2,4,3,3  ],
			["Anime Voice Actor(s)",0,2,22,16,29,7,12,5,2,2,7,4,3,3  ],
			["Collaboration",0,1,0,3,6,3,2,0,1,2,4,2,2,2  ],
			["Singer-Songwriter",18,17,17,23,33,25,33,31,18,34,19,23,33,33  ],
			["Solo Artist",8,17,12,22,15,45,62,73,33,53,67,37,56,56  ]
		]
	},
	{
		chartType: 'bar',
		chartTitle: 'Klassic Note is...',
		chartColors: ["#C0504D", "#8064A2", "#F79646"],
		chartLabel: [2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
		chartData: [
			["% Mainstream",57.8,51.3,50.1,50.5,50,49.8,50.3,52.3,52.4,53.7,54.7,55.5  ],
			["% Idolism",21.7,20.5,22.5,26.2,28.7,31.2,32.6,32.5,33.2,32.5,32.4,32.5  ],
			["% Anime",20.5,28.2,27.4,23.3,21.3,19,17.1,15.1,14.3,13.8,12.9,12  ]
		],
		chartAsPercentage: true,
		chartAsPercentageAxis: 'x',
	},
	{
		chartType: 'line',
		chartTitle: 'Song of the Day Tally',
		chartColors: ColorBlind10,
		chartLabel: [1,2,3,4,5,6,7,8,9,10,11,12],
		chartData: [
			["2013",32.07,25.00,16.30,11.96,7.07,4.35,2.72,0.54,0.00,0.00,0.00,0.00  ],
			["2014",39.82,20.35,17.70,10.62,5.75,2.21,2.21,0.88,0.00,0.44,0.00,0.00  ],
			["2015",32.86,19.72,15.96,13.62,10.80,4.23,2.35,0.47,0.00,0.00,0.00,0.00  ],
			["2016",41.15,24.23,15.38,6.54,7.31,2.69,1.92,0.00,0.38,0.38,0.00,0.00  ],
			["2017",45.67,26.77,12.60,5.51,1.97,3.54,1.97,0.39,0.79,0.39,0.00,0.39  ],
			["2018",45.13,28.76,13.27,7.08,3.10,0.44,1.33,0.44,0.00,0.44,0.00,0.00  ],
			["2019",49.61,18.75,11.72,8.20,5.86,3.13,1.95,0.00,0.39,0.39,0.00,0.00  ],
			["2020",50.98,19.22,10.98,5.88,5.49,2.75,2.35,0.39,0.78,0.39,0.39,0.39  ],
			["Total",33.58,25.50,17.55,9.85,6.36,3.73,2.08,0.67,0.31,0.18,0.12,0.06  ]
		],
		chartAsPercentage: true,
		chartAsPercentageAxis: 'y',
		xAxisLabel: 'Frequency',
		yAxisLabel: '# of Songs'
	},
	{
		title: 'Klassic Note Participants (Artists)',
		description: 'FROM NUMBER OF ARTISTS REVIEWED IN KLASSIC NOTE CIRCA 2007; INCLUDES LISTED ARTISTS FOR ULTIMATE COLLECTION',
		chartType: 'bar',
		chartTitle: 'Klassic Note Collection Artists',
		chartColors: BlueTeal20,
		chartLabel: ["Ikimonogakari","YUI","Aqua Timez","miwa","Chatmonchy","SCANDAL","Rie fu","sphere","Toyosaki Aki","Tomatsu Haruka","SPECIAL OTHERS","ASIAN KUNG-FU GENERATION","Kalafina","Kotobuki Minako","SID","ClariS","STEREOPONY","VELTPUNCH","Sambomaster","Tsuji Shion","LIL'B aka MIE&AILA","Taketatsu Ayana","Porno Graffitti","Neat's","Hanazawa Kana","fumika","NEGOTO","nano.RIPE","yanaginagi","TrySail","cinema staff","Yoru no Honki Dance","THE ORAL CIGARETTES","Amamiya Sora","Komatsu Mikako"  ],
		chartData: [
			[2007,1,10,2,null,2,null,3,null,null,null,null,1,null,null,null,null,null,null,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null  ],
			[2008,10,12,9,null,5,null,3,null,null,null,1,3,null,null,1,null,3,3,3,null,4,null,2,null,null,null,null,null,null,null,null,null,null,null,null  ],
			[2009,10,5,8,null,8,3,5,5,2,1,3,2,7,null,6,null,9,1,3,4,7,null,4,null,null,null,null,null,null,null,null,null,null,null,null  ],
			[2010,5,9,4,5,7,6,3,5,4,7,7,7,3,4,4,2,5,2,4,7,2,null,4,null,null,null,null,null,null,null,null,null,null,null,null  ],
			[2011,4,9,3,10,4,6,4,8,7,2,8,3,4,1,4,3,5,4,3,2,5,null,2,null,null,1,1,null,null,null,null,null,null,null,null  ],
			[2012,8,4,6,8,11,5,7,7,6,6,6,5,5,8,3,4,3,7,4,3,null,4,3,null,4,4,4,null,null,null,null,null,null,null,null  ],
			[2013,8,null,1,9,null,9,4,3,8,5,5,2,5,4,4,5,null,null,2,null,2,6,2,9,4,7,null,null,2,null,3,null,null,null,1  ],
			[2014,9,null,5,5,2,8,7,5,6,2,3,3,3,7,3,6,null,null,2,null,null,4,null,10,3,2,6,6,12,null,2,null,null,2,7  ],
			[2015,3,null,5,7,4,3,null,6,2,5,4,3,3,4,null,3,null,2,2,3,null,2,null,null,5,2,3,5,null,4,3,3,3,null,null  ],
			[2016,9,null,4,2,1,3,5,2,6,9,null,1,null,1,null,3,null,5,null,4,null,5,3,null,3,2,6,6,1,7,4,6,2,3,3  ],
			[2017,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1,2,5,4,6,6,3,4  ],
			[2018,null,null,3,2,3,1,null,null,null,2,4,8,1,3,1,3,null,null,1,3,null,1,1,null,3,null,null,4,1,3,null,1,3,4,2  ],
			[2019,5,null,null,3,null,2,2,3,null,null,null,null,null,1,2,null,null,null,null,null,null,1,null,null,3,2,3,null,4,2,6,3,3,2,null  ],
			[2020,1,null,null,1,null,3,null,null,null,null,5,1,null,null,null,null,null,5,1,null,null,null,null,null,null,null,null,3,3,2,null,1,4,4,null  ],
			[2021,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,1  ]
		],
		chartMinLine: {
			lineColor: 'red',
			lineWidth: 2,
			lineValue: 18
		}
	},
	{
		chartType: 'line',
		chartTitle: 'Collection Artists (Trend)',
		chartColors: Tableau20,
		chartLabel: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,"Total"],
		chartData: [
			["Ikimonogakari",1,11,21,26,30,38,46,55,58,67,67,67,72,73,73,73  ],
			["miwa",null,null,null,5,15,23,32,37,44,46,49,51,54,55,55,55  ],
			["Aqua Timez",3,11,19,23,26,32,33,38,43,47,47,50,null,null,null,50  ],
			["Chatmonchy",2,7,15,22,26,37,37,39,43,44,46,49,null,null,null,49  ],
			["YUI",10,22,27,36,45,49,null,null,null,null,null,null,null,null,null,49  ],
			["SCANDAL",null,null,3,9,15,20,29,37,40,43,45,46,48,51,51,51  ],
			["sphere",null,null,5,10,18,25,28,33,39,40,43,43,46,null,null,46  ],
			["Toyosaki Aki",null,null,2,6,13,19,27,33,35,41,44,null,null,null,null,44  ],
			["Tomatsu Haruka",null,null,1,8,10,16,21,23,28,37,38,40,null,null,null,40  ],
			["ASIAN KUNG-FU GENERATION",1,4,6,13,16,21,23,26,29,30,31,39,39,40,40,40  ],
			["Rie fu",3,6,11,11,15,17,21,28,28,33,36,36,38,null,null,38  ],
			["ClariS",null,null,null,2,5,9,14,20,23,26,30,33,null,null,null,33  ],
			["Kotobuki Minako",null,null,null,4,5,13,17,24,28,29,29,32,33,null,null,33  ],
			["Kalafina",null,null,7,10,14,19,24,27,30,30,31,32,null,null,null,32  ],
			["SID",null,1,7,11,15,18,22,25,25,26,28,29,31,null,null,31  ],
			["SPECIAL OTHERS",null,1,4,11,19,25,30,33,37,37,39,43,43,48,48,48  ],
			["Sambomaster",null,3,6,10,13,17,19,21,23,23,26,27,27,28,28,28  ],
			["Hanazawa Kana",null,null,null,null,null,4,8,11,16,19,20,23,26,null,null,26  ],
			["Tsuji Shion",null,null,4,11,13,16,16,16,19,23,23,26,null,null,null,26  ],
			["VELTPUNCH",null,3,4,6,10,17,17,17,19,24,24,24,24,29,29,29  ],
			["fumika",null,null,null,null,1,5,12,14,16,18,22,22,24,null,null,24  ],
			["NEGOTO",null,null,null,null,1,5,7,11,12,14,20,20,23,null,null,23  ],
			["Porno Graffitti",null,2,6,10,12,15,17,17,17,20,22,23,null,null,null,23  ],
			["STEREOPONY",null,3,12,17,20,23,null,null,null,null,null,null,null,null,null,23  ],
			["Taketatsu Ayana",null,null,null,null,null,4,10,14,16,21,21,22,23,null,null,23  ],
			["cinema staff",null,null,null,null,null,null,3,5,8,12,16,16,23,null,null,23  ],
			["nano.RIPE",null,null,null,null,null,null,null,6,11,17,18,22,22,25,25,25  ],
			["yanaginagi",null,null,null,null,null,null,2,14,14,15,17,18,22,25,25,25  ],
			["Lil'B",null,4,11,13,18,18,20,null,null,null,null,null,null,null,null,20  ],
			["Neat's",null,null,null,null,null,null,9,19,19,19,19,19,19,null,null,19  ],
			["TrySail",null,null,null,null,null,null,null,null,4,10,14,17,19,21,21,21  ],
			["Yoru no Honki Dance",null,null,null,null,null,null,null,null,3,9,15,16,19,20,20,20  ],
			["THE ORAL CIGARETTES",null,null,null,null,null,null,null,null,3,5,11,14,17,21,21,21  ],
			["Amamiya Sora",null,null,null,null,null,null,null,2,null,5,8,12,14,18,18,18  ],
			["Komatsu Mikako",null,null,null,null,null,null,1,8,8,11,15,17,17,17,18,18  ]
		]
	},
	{
		title: 'Song Appetite Survey',
		description: 'FROM KLASSIC NOTE SONG AWARDS “SONG APPETITE SURVEY”, OR FROM TOTAL NUMBER OF SONGS IN PREVIOUS MONTHS',
		chartType: 'line',
		chartTitle: 'Total Song Count by Year',
		chartColors: Classic20,
		chartLabel: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		chartData: [
			[2009,14,22,34,45,56,75,96,115,121,147,165,175],
			[2010,12,25,40,50,70,80,93,103,122,144,165,180],
			[2011,22,40,56,74,95,104,128,143,164,168,178,190],
			[2012,15,28,35,49,60,70,98,128,160,177,196,203],
			[2013,18,36,57,69,78,99,113,143,157,172,197,205],
			[2014,14,33,55,73,89,113,132,143,162,179,205,220],
			[2015,11,33,42,64,82,96,114,124,137,154,171,180],
			[2016,15,31,63,79,103,114,136,157,171,186,212,240],
			[2017,13,46,74,89,115,133,156,176,188,204,223,233],
			[2018,17,27,44,61,88,106,129,147,160,178,195,205],
			[2019,18,44,70,88,110,129,147,159,185,204,218,240],
			[2020,23,43,56,75,90,100,116,137,161,186,195,205]
		]
	}
];
// convertStringArrayToHistogram();
function convertStringArrayToHistogram(chartData, chartLabel) {
	/*
	input: [
		[axislabel, data1, data2, ...],
		[axislabe2, data3, data4, ...]
		... <dataset>
	] && [labels in which <dataset>.length == thisArray.length]
	output: [
		[data1, 1], //1st row
		[data2, 1],
		[data3, (...array of 1 nulls), 1], //2nd row
		[data4, (...array of 1 nulls), 1],
	]
	objective: to change chartData in above json to fit current flow, data1 is data point, 1 is the bar
	*/

	let nullLabel = chartLabel.map(l => null);
	let histogramData = [];
	for(i = 0; i < chartData.length; i++) {
		for(j = 1; j < chartData[i].length-1; j++) { // or use .forEach
			let item = chartData[i][j];
			// console.log(chartData[i][j]);
			let newItem = [];
			newItem.push(item);
			for(k = 0; k < i; k++) {
				newItem.push(null); //duplicate i-1 times
			}
			newItem.push(1);
			histogramData.push(newItem);
		}
	}
	
	// console.log(histogramData);
	return histogramData;
}

function scrollToNextPage() {
	this.parentElement.parentElement.nextElementSibling.scrollIntoView();
}

function scrollToPrevPage() {
	this.parentElement.parentElement.previousElementSibling.scrollIntoView();
}

function scrollToMainPage(firstLoad) {
	console.log(firstLoad);
	document.getElementsByClassName('page')[0].firstElementChild.scrollIntoView();
	if(firstLoad == true && document.getElementById('main') != null)
		document.getElementById('main').scrollIntoView();
}

function renderVariables() {
	// to allow multiple instances of charts based on data, in format 'container<no>'
	var k = 'container';
	for(i = 0; i < pageElements.length; i++) {
		window[k+i] = + i;
	}
}

function renderMain(sectionNo) {
	let content = pageElements[sectionNo];
	if(document.getElementById('main') != null) {
		let main = document.getElementById('main');
		
		// if(main.previousElementSibling != null) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			let prevButton = document.createElement('a');
			prevButton.title = 'Previous';
			prevButton.style.visibility = main.previousElementSibling != null ? 'visible' : 'hidden';
			prevButton.addEventListener('click',scrollToPrevPage);
			prevButton.addEventListener('touchstart',scrollToPrevPage);
			let prevButtonIcon = document.createElement('i');
			prevButtonIcon.classList.add('material-icons');
			prevButtonIcon.innerText = 'keyboard_arrow_up';
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		// }
		
		let mainPre = document.createElement('h3');
		mainPre.innerText = content.prefix;
		main.appendChild(mainPre);
		
		let mainTitle = document.createElement('h1');
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		let mainPost = document.createElement('h5');
		mainPost.innerText = content.suffix;
		main.appendChild(mainPost);
		
		// if(main.nextElementSibling != null) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			let nextButton = document.createElement('a');
			nextButton.title = 'Next';
			nextButton.style.visibility = main.nextElementSibling != null ? 'visible' : 'hidden';
			nextButton.addEventListener('click',scrollToNextPage);
			nextButton.addEventListener('touchstart',scrollToNextPage);
			let nextButtonIcon = document.createElement('i');
			nextButtonIcon.classList.add('material-icons');
			nextButtonIcon.innerText = 'keyboard_arrow_down';
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		// }
	}

}

function renderSection(sectionNo, mainSectionNo) {
	let section = document.getElementsByClassName('section')[sectionNo > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let content = pageElements[sectionNo];
	
	// if(section.previousElementSibling != null) {
		let prevDiv = document.createElement('div');
		prevDiv.classList.add('page-prev');
		let prevButton = document.createElement('a');
		prevButton.title = 'Previous';
		prevButton.style.visibility = section.previousElementSibling != null ? 'visible' : 'hidden';
		prevButton.addEventListener('click',scrollToPrevPage);
		prevButton.addEventListener('touchstart',scrollToPrevPage);
		let prevButtonIcon = document.createElement('i');
		prevButtonIcon.classList.add('material-icons');
		prevButtonIcon.innerText = 'keyboard_arrow_up';
		prevButton.appendChild(prevButtonIcon);
		prevDiv.appendChild(prevButton);
		section.appendChild(prevDiv);
	// }
			
	if(content.title) {
		let title = document.createElement('h2');
		title.classList.add('page-title');
		title.innerText = content.title;
		section.appendChild(title);
	}
	
	if(content.description) {
		let description = document.createElement('h6');
		description.classList.add('page-description');
		description.innerText = content.description;
		section.appendChild(description);
	}
	
	if(content.chartData) {
		let canvas = document.createElement('div');
		canvas.id = 'section' + sectionNo;
		canvas.classList.add('container');
		section.appendChild(canvas);
		if(!pageElements[sectionNo].chartColors) console.error('chartColors is mandatory');
		let colors = pageElements[sectionNo].chartColors.concat(pageElements[sectionNo].chartColors);
		let fillColors = pageElements[sectionNo].chartFillColors ? pageElements[sectionNo].chartFillColors.concat(pageElements[sectionNo].chartFillColors) : colors;
		
		let chartContents = {
			type: pageElements[sectionNo].chartType,
			title: pageElements[sectionNo].chartTitle,
			labels: pageElements[sectionNo].chartLabel,
			vertical: pageElements[sectionNo].chartMinLine,
			isPercent: pageElements[sectionNo].chartAsPercentage,
			isPercentAxis: pageElements[sectionNo].chartAsPercentageAxis,
			xAxisLabel: pageElements[sectionNo].xAxisLabel,
			yAxisLabel: pageElements[sectionNo].yAxisLabel,
			datasets: content.chartType == 'histogram' ? convertStringArrayToHistogram(pageElements[sectionNo].chartData, pageElements[sectionNo].chartLabel).map((row,index) => {
				return {
					label: row[0],
					data:row.slice(1).map(point => {
						return point == null ? null : 1; //so each dataset is a data point
					}),
					origData: row.slice(1),
					borderColor: colors[index],
					backgroundColor: fillColors[index]
				};
			}) :
			pageElements[sectionNo].chartData.map((row,index) => {
				return {
					label: row[0],
					data: row.slice(1),
					origData: row.slice(1),
					borderColor: colors[index],
					backgroundColor: fillColors[index]
				};
			})
		};
		console.log(chartContents);
		loadTimeline(sectionNo, chartContents);
	}
	else {
		console.warn('chartTitle is empty: ', content);
	}
	
	// if(section.nextElementSibling != null) {
		let nextDiv = document.createElement('div');
		nextDiv.classList.add('page-next');
		let nextButton = document.createElement('a');
		nextButton.title = 'Next';
		nextButton.style.visibility = section.nextElementSibling != null ? 'visible' : 'hidden';
		nextButton.addEventListener('click',scrollToNextPage);
		nextButton.addEventListener('touchstart',scrollToNextPage);
		let nextButtonIcon = document.createElement('i');
		nextButtonIcon.classList.add('material-icons');
		nextButtonIcon.innerText = 'keyboard_arrow_down';
		nextButton.appendChild(nextButtonIcon);
		nextDiv.appendChild(nextButton);
		section.appendChild(nextDiv);
	// }
}

function renderPage() {
	let mainSectionNo = 0;
	for(let sectionNo = 0; sectionNo < pageElements.length; sectionNo++) {
		let content = pageElements[sectionNo];
		if(content.isMain) {
			let newMain = document.createElement('div');
			newMain.id = 'main';
			document.getElementsByClassName('page')[0].appendChild(newMain);
			mainSectionNo = sectionNo;
			// renderMain(sectionNo);
		}
		else {
			let newSection = document.createElement('div');
			newSection.classList.add('section');
			document.getElementsByClassName('page')[0].appendChild(newSection);
			// console.log(mainSectionNo);
			// renderSection(sectionNo, mainSectionNo);
		}
	}
	
	for(let sectionNo = 0; sectionNo < pageElements.length; sectionNo++) {
		let content = pageElements[sectionNo];
		if(content.isMain) {
			renderMain(sectionNo);
		}
		else {
			renderSection(sectionNo, mainSectionNo);
		}
	}
}

const drawVerticalLine = {
  id: 'drawVerticalLine',
  afterDraw(chart, args, options) {
    const {ctx, chartArea: {left, top, bottom, width, height}, scales: {x, y}} = chart;
    const valueY = y.getPixelForValue(options.lineValue);
	const thickness = options.lineWidth || 0;
	if(options.lineValue) {
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = options.lineColor || 'black';
		ctx.lineWidth = thickness;
		ctx.moveTo(valueY,top);
		ctx.lineTo(valueY,bottom);
		ctx.closePath();
		ctx.stroke();		
	}
  }
};

//change below for each chart render
function loadTimeline(sectionNo, chartContents) {
	let timeline = window['container'+sectionNo];
	let identifier = 'section'+sectionNo;
	let charter = 'chart'+sectionNo;
	if(document.getElementById(charter) == undefined) { // canvas
		let canvas = document.createElement('canvas');
		canvas.id = charter;
		canvas.style.border = '1px solid white';
		document.getElementById(identifier).appendChild(canvas); //parent div
	}
	timeline = document.getElementById(charter);
	// console.log(chartContents.datasets);
	let config = chartContents.type == 'histogram' ? {
		type: 'bar',
		data: chartContents,
		options: {
			indexAxis: 'y',
			responsive: true,
			maintainAspectRatio: true,
			// aspectRatio: 0.5,
			datasets: {
				bar: {
					barPercentage: 1
				}
			},
			interaction: {
				mode: 'point',
				intersect: false
			},
			plugins: {
				legend: {
					display: false,
				},
				title: {
					display: true,
					text: chartContents.title,
					font: {
						size: 15
					}
				},
				tooltip: {
					xAlign: 'center',
					callbacks: {
						label: function(context) {
							return context.dataset.label;
						}
					}
				}
			},
			scales: {
				x: {
					stacked: true,
				},
				y: {
					stacked: true,
				}
			}
		}
	} : {
		type: chartContents.type || 'line',
		data: chartContents,
		options: {
			indexAxis: chartContents.type == 'bar' ? 'y' : '',
			responsive: true,
			maintainAspectRatio: true,
			// aspectRatio: 0.5,
			datasets: {
				bar: {
					barPercentage: 1
				}
			},
			interaction: {
				mode: chartContents.type == 'bar' ? 'point' : 'index',
				intersect: false
			},
			plugins: {
				legend: {
					position: chartContents.datasets.length <= 12 ? 'top' : 'right',
					maxWidth: chartContents.datasets.length <= 12 ? 9999 : 240,
					fullSize: false
				},
				title: {
					display: true,
					text: chartContents.title,
					font: {
						size: 15
					}
				},
				tooltip: {
					// position: 'nearest',
					xAlign: chartContents.type == 'bar' ? 'center' : undefined,
					callbacks: {
						label: function(context) {
							return context.dataset.label + ': ' + context.raw + (chartContents.isPercent ? '%' : '');
						}
					}
				},
				drawVerticalLine: chartContents.vertical
			},
			scales: {
				x: {
					title: chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'x' ? chartContents.xAxisLabel : '',
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'x') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				},
				y: {
					title: chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'y' ? chartContents.yAxisLabel : '',
					stacked: chartContents.type == 'bar',
					ticks: {
						callback: function(value, index, values) {
							if(chartContents.isPercent && chartContents.isPercentAxis.toLowerCase() == 'y') return value + '%';
							return this.getLabelForValue(value);
						}
					}
				}
			}
		},
		plugins: [drawVerticalLine]
	};
	
	window['container'+sectionNo] = new Chart(timeline, config);
}

function renderButtons() {
	let topButton = document.createElement('a');
	topButton.id = 'GoToTopBtn';
	topButton.title = 'Back To Top';
	let topButtonIcon = document.createElement('i');
	topButtonIcon.classList.add('material-icons');
	topButtonIcon.innerText = 'arrow_upward';
	topButton.appendChild(topButtonIcon);
	document.body.appendChild(topButton);
	document.getElementById('GoToTopBtn').addEventListener('click', scrollToMainPage);
	document.getElementsByClassName('page')[0].addEventListener('scroll', toggleGoToTopBtn);

	let closeButton = document.createElement('a');
	closeButton.id = 'CloseBtn';
	closeButton.title = 'Close Popup';
	let closeButtonIcon = document.createElement('i');
	closeButtonIcon.classList.add('material-icons');
	closeButtonIcon.innerText = 'close';
	closeButton.appendChild(closeButtonIcon);
	document.body.appendChild(closeButton);
	document.getElementById('CloseBtn').addEventListener('click', goBack);
}


function goBack() {
	window.location.href = '../index.html';
}

function toggleGoToTopBtn() {
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.getElementsByClassName('page')[0].scrollTop >= document.body.clientHeight) {
		document.getElementById('GoToTopBtn').style.visibility = 'visible';
	} else {
		document.getElementById('GoToTopBtn').style.visibility = '';
	}
}

// startup
renderVariables();
renderPage();
renderButtons();
if(document.body.clientWidth > 960) 
	scrollToMainPage(true);