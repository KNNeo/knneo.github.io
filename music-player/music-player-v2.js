//timestamp display for audio player
let tableID = '2019';
let playerID = tableID + 'Player';
let domain = 'https://klassicnoteawards.webs.com/';
let timer;
let timestamps = new Array();
//title_string,table_row,time_in_seconds,rank_till_time
//for ranks with more than 1 result, order is same as order of push not table_row
timestamps.push(['2021', 23,   0, 20, 'Sisters In The Velvet', 'Love, Massacre']);
timestamps.push(['2021', 22,  48, 19, 'Toyosaki Aki', 'TONE']);
timestamps.push(['2021', 21,  86, 18, 'Hanazawa Kana', 'Moonlight Magic']);
timestamps.push(['2021', 19, 126, 17, 'Yoin', 'pandora']);
timestamps.push(['2021', 20, 169, 17, 'No Buses', 'Girl']);
timestamps.push(['2021', 18, 216, 16, 'a flood of circle', 'Hokkyokusei no Melody']);
timestamps.push(['2021', 17, 273, 15, 'Middle Kids', 'R U 4 Me?']);
timestamps.push(['2021', 16, 314, 14, 'FINLANDS', 'Rabusongu']);
timestamps.push(['2021', 15, 345, 13, 'LuckLife', 'Akari']);
timestamps.push(['2021', 14, 383, 12, 'yorushika', 'Matasaburou']);
timestamps.push(['2021', 13, 434, 11, 'SID', 'Star Forest']);
timestamps.push(['2021', 11, 484, 10, 'Takahashi Rie', 'Uutsu']);
timestamps.push(['2021', 12, 527, 10, 'Kitou Akari', 'No Continue']);
timestamps.push(['2021', 10, 567,  9, 'Hoshimachi Suisei', 'Jibun Katte Dazzling']);
timestamps.push(['2021',  9, 611,  8, 'Ryokuoushoku Shakai', 'Kesshou']);
timestamps.push(['2021',  7, 657,  7, 'Tomita Miyu', 'Dilenma']);
timestamps.push(['2021',  8, 692,  7, 'Asakura Momo', 'Pinky Hook']);
timestamps.push(['2021',  6, 733,  6, 'cinema staff', 'Kyokuya']);
timestamps.push(['2021',  5, 775,  5, 'anewhite', 'Gunjougeki ni wa Iranai']);
timestamps.push(['2021',  4, 816,  4, 'vivid undress', 'Original Color']);
timestamps.push(['2021',  3, 861,  3, 'Azuna Riko', 'Chance! & Revenge!']);
timestamps.push(['2021',  2, 908,  2, 'Ueda Reina', 'anemone']);
timestamps.push(['2021',  1, 956,  1, 'FIVE NEW OLD', 'Hallelujah']);

timestamps.push(['2020', 24,    0, 20, 'Sangatsu no Phantasia', 'Kemuri']);
timestamps.push(['2020', 23,   40, 19, 'Kitou Akari', 'Desire Again']);
timestamps.push(['2020', 22,   81, 18, 'ORESAMA', 'Gimmme!']);
timestamps.push(['2020', 21,  126, 17, 'SID', 'Houkiboshi']);
timestamps.push(['2020', 19,  168, 16, 'yourness', 'Kago no Naka ni Tori']);
timestamps.push(['2020', 20,  213, 16, 'SHE\'S', 'Tragicomedy']);
timestamps.push(['2020', 18,  255, 15, 'MOSHIMO', 'Denkousekka Jealousy']);
timestamps.push(['2020', 17,  301, 14, 'VELTPUNCH', 'Suicide King']);
timestamps.push(['2020', 15,  345, 13, 'Natsukawa Shiina', 'Antithesis']);
timestamps.push(['2020', 16,  390, 13, 'Fuchigami Mai', 'Valentine Hunter']);
timestamps.push(['2020', 14,  434, 12, 'Suzuki Aina', 'Hikariiro no Uta']);
timestamps.push(['2020', 13,  481, 11, 'Numakura Manami', 'Minna de!']);
timestamps.push(['2020', 12,  529, 10, 'Polkadot Stingray', 'Megami']);
timestamps.push(['2020', 11,  565,  9, 'Minase Inori', 'Kokoro Somari']);
timestamps.push(['2020', 10,  611,  8, 'SCANDAL', 'A.M.D.K.J.']);
timestamps.push(['2020',  9,  650,  7, 'spira.spica', 'Pop Step Jump!']);
timestamps.push(['2020',  8,  696,  6, 'Aimer', 'SPARK-AGAIN']);
timestamps.push(['2020',  6,  744,  5, 'Asakura Momo', 'Agapanthus']);
timestamps.push(['2020',  7,  785,  5, 'Waki Azumi', 'Fuwatto']);
timestamps.push(['2020',  5,  834,  4, 'tacica', 'aranami']);
timestamps.push(['2020',  4,  879,  3, 'yorushika', 'Shisouhan']);
timestamps.push(['2020',  2,  923,  2, 'Ryokuoushoku Shakai', 'Shout Baby']);
timestamps.push(['2020',  3,  968,  2, 'THE ORAL CIGARETTES', 'Slowly but surely I go on']);
timestamps.push(['2020',  1, 1007,  1, 'Ryokuoushoku Shakai', 'Mela!']);

timestamps.push(['2019', 24,    0, 20, 'Numakura Manami', 'irodori -color-']);
timestamps.push(['2019', 23,   45, 19, 'sphere', 'Sign']);
timestamps.push(['2019', 22,   94, 18, 'miwa', 'Reboot']);
timestamps.push(['2019', 20,  135, 17, 'Asakura Momo', 'Smash Drop']); //17-1
timestamps.push(['2019', 21,  179, 17, 'Natsukawa Shiina', 'Shimaeba Ii']); //17-2
timestamps.push(['2019', 19,  219, 16, 'Takigawa Arisa', 'Wagamama']);
timestamps.push(['2019', 17,  262, 15, 'Cocoro Auction', 'RUN']); //15-1
timestamps.push(['2019', 18,  303, 15, 'AyumiKurikaMaki', 'Bokura no Uta']); //15-2
timestamps.push(['2019', 16,  347, 14, 'SIX LOUNGE', 'Tenshi no Suitcase']);
timestamps.push(['2019', 15,  385, 13, 'Fuchigami Mai', 'Love Summer!']);
timestamps.push(['2019', 14,  429, 12, 'Yuuki Aoi', 'Shisenjou no Hana']);
timestamps.push(['2019', 13,  478, 11, 'Horie Yui', 'Asagao']);
timestamps.push(['2019', 12,  521, 10, 'Mrs. GREEN APPLE', 'Romanticism']);
timestamps.push(['2019', 11,  562,  9, 'TrySail', 'TryAgain']);
timestamps.push(['2019', 10,  606,  8, 'FIVE NEW OLD', 'What\'s Gonna Be?']);
timestamps.push(['2019',  9,  654,  7, 'Mrs. GREEN APPLE', 'Boku no Koto']);
timestamps.push(['2019',  7,  703,  6, 'Polkadot Stingray', 'DENKOUSEKKA']);
timestamps.push(['2019',  8,  747,  6, 'Ghost Sense', 'Mikansei no Shoudou']);
timestamps.push(['2019',  6,  793,  5, 'MaRuRi to Ryuga', 'Shiawase ni Natte']);
timestamps.push(['2019',  5,  844,  4, 'Yoru no Honki Dance', 'Take it back']);
timestamps.push(['2019',  3,  888,  3, 'Ryokuoushoku Shakai', 'sabotage']); //3-1
timestamps.push(['2019',  4,  932,  3, 'SHE\'S', 'Masquerade']); //3-2
timestamps.push(['2019',  2,  975,  2, 'cinema staff', 'Shiroi Sabaku no March']);
timestamps.push(['2019',  1, 1019,  1, 'Minase Inori', 'Catch The Rainbow!']);

timestamps.push(['2018', 22,    0, 20, 'YUKI', 'Traumerei']);
timestamps.push(['2018', 21,   41, 19, 'Sunrise In My Attache Case', 'Light The Fire']);
timestamps.push(['2018', 20,   90, 18, 'Numakura Manami', 'Desires']);
timestamps.push(['2018', 18,  135, 17, 'Amamiya Sora', 'Lilas']); //17-1
timestamps.push(['2018', 19,  175, 17, 'Asakura Momo', 'Fanfare!']); //17-2
timestamps.push(['2018', 17,  220, 16, 'nano.RIPE', 'Polaris']);
timestamps.push(['2018', 16,  269, 15, 'SECONDWALL', 'Beautiful Lie']);
timestamps.push(['2018', 15,  316, 14, 'Tsuji Shion', 'Oukan']);
timestamps.push(['2018', 14,  366, 13, 'Iwasaki Ai', 'HAGANE']);
timestamps.push(['2018', 13,  411, 12, 'Cider Girl', 'Evergreen']);
timestamps.push(['2018', 12,  460, 11, 'Ryokuoushoku Shakai', 'Little Singer']);
timestamps.push(['2018', 11,  506, 10, 'ORESAMA', 'Hi-Fi TRAIN']);
timestamps.push(['2018', 10,  550,  9, 'Polkadot Stingray', 'Telecaster Stripe']);
timestamps.push(['2018',  9,  596,  8, 'Yogee New Waves', 'Bluemin\' Days']);
timestamps.push(['2018',  8,  637,  7, 'THE ORAL CIGARETTES', 'Youshitenrei na Uso']);
timestamps.push(['2018',  7,  676,  6, 'LuckLife', 'Bokura']);
timestamps.push(['2018',  5,  721,  5, 'SHE\'S', 'The Everglow']); //5-1
timestamps.push(['2018',  6,  766,  5, 'wacci', 'Saijoukyuu']); //5-2
timestamps.push(['2018',  4,  810,  4, 'Sambomaster', 'Kagayaki Dashite Hasshiteku']);
timestamps.push(['2018',  3,  856,  3, 'GLIM SPANKY', 'Orokamono Tachi']);
timestamps.push(['2018',  2,  905,  2, 'Aqua Timez', 'over and over']);
timestamps.push(['2018',  1,  950,  1, 'Yoru no Honki Dance', 'Magical Feelin\'']);

timestamps.push(['2017',  1, 0000,  1, 'fumika', 'Anata no Inai, Kono Sekai de.']);
timestamps.push(['2017',  2, 0000,  2, 'NEGOTO', 'Sora mo Toberu Hazu']);
timestamps.push(['2017',  3, 0000,  3, 'ORESAMA', 'Wonder Drive']);
timestamps.push(['2017',  4, 0000,  4, 'Yoru no Honki Dance', 'SHINY']);
timestamps.push(['2017',  5, 0000,  5, 'Ryokuoushoku Shakai', 'Hajimari no Uta']);
timestamps.push(['2017',  6, 0000,  6, 'KANA-BOON', 'Fighter']);
timestamps.push(['2017',  7, 0000,  6, 'SPYAIR', 'Be with']);
timestamps.push(['2017',  8, 0000,  7, 'Primary', 'petit bonheur']);
timestamps.push(['2017',  9, 0000,  7, 'Amamiya Sora', 'irodori']);
timestamps.push(['2017', 10, 0000,  8, 'Uesaka Sumire', 'Odore! Kyuukyoku Tetsugaku']);
timestamps.push(['2017', 11, 0000,  9, 'Scenarioart', 'Sayonara Moon Town']);
timestamps.push(['2017', 12, 0000, 10, 'LILI LIMIT', 'A Short Film']);
timestamps.push(['2017', 13, 0000, 11, 'TrySail', 'adrenaline!!!']);
timestamps.push(['2017', 14, 0000, 12, 'Yonezu Kenshi', 'Flowerwall']);
timestamps.push(['2017', 15, 0000, 13, 'Numakura Manami', 'Climber\'s High!']);
timestamps.push(['2017', 16, 0000, 14, 'Shishido Kavka', 'Tachiagare']);
timestamps.push(['2017', 17, 0000, 15, 'LuckLife', 'Sunny Day']);
timestamps.push(['2017', 18, 0000, 16, 'cinema staff', 'Netsugen']);
timestamps.push(['2017', 19, 0000, 17, 'wacci', 'Ah!Oh!']);
timestamps.push(['2017', 20, 0000, 17, 'Goose house', 'You']);
timestamps.push(['2017', 21, 0000, 18, 'Komatsu Mikako', 'HEARTRAIL']);
timestamps.push(['2017', 22, 0000, 19, 'Touyama Nao', 'Imakoko']);
timestamps.push(['2017', 23, 0000, 20, 'Yogee New Waves', 'Ride On Wave']);

timestamps.push(['2016',  1, 0000,  1, 'TrySail', 'Hikaru Kakera']);
timestamps.push(['2016',  2, 0000,  2, 'SCANDAL', 'Morning sun']);
timestamps.push(['2016',  3, 0000,  3, 'Cocoro Auction', 'Fly Site']);
timestamps.push(['2016',  4, 0000,  3, 'Aqua Timez', 'Juunigatsu no Himawari']);
timestamps.push(['2016',  5, 0000,  4, 'Hanazawa Kana', 'Zarazara']);
timestamps.push(['2016',  6, 0000,  5, 'nano.RIPE', 'Luminary']);
timestamps.push(['2016',  7, 0000,  6, 'miwa', 'Yui']);
timestamps.push(['2016',  8, 0000,  7, '7!!', 'Kimi ga Iru Nara']);
timestamps.push(['2016',  9, 0000,  8, 'LuckLife', 'Hajime no Ippo']);
timestamps.push(['2016', 10, 0000,  8, 'Yoru no Honki Dance', 'Without You']);
timestamps.push(['2016', 11, 0000,  9, 'Miyawaki Shion', 'Nakiyanda Sora']);
timestamps.push(['2016', 12, 0000, 10, 'LILI LIMIT', 'Festa']);
timestamps.push(['2016', 13, 0000, 11, 'VELTPUNCH', 'THE NEWEST ROCK']);
timestamps.push(['2016', 14, 0000, 12, 'Aimer', 'Akanesasu']);
timestamps.push(['2016', 15, 0000, 12, 'plenty', 'Sayonara Yori, Yasashii Kotoba']);
timestamps.push(['2016', 16, 0000, 13, 'Mrs. GREEN APPLE', 'Speaking']);
timestamps.push(['2016', 17, 0000, 14, 'cinema staff', 'Kibou no Zangai']);
timestamps.push(['2016', 18, 0000, 15, 'Tomatsu Haruka', 'Cinderella Symphony']);
timestamps.push(['2016', 19, 0000, 16, 'TrySail', 'High Free Spirits']);
timestamps.push(['2016', 20, 0000, 17, 'titilulu', 'Bed time story']);
timestamps.push(['2016', 21, 0000, 18, 'Porno Graffitti', 'THE DAY']);
timestamps.push(['2016', 22, 0000, 19, 'Toyosaki Aki', 'Clover']);
timestamps.push(['2016', 23, 0000, 19, 'Q-MHz', 'Fureta yo (featuring Komatsu Mikako)']);
timestamps.push(['2016', 24, 0000, 20, 'amazarashi', 'Kyomubyou']);

timestamps.push(['2015',  1, 0000,  1, '7!!', 'Orange']);
timestamps.push(['2015',  2, 0000,  2, 'SECONDWALL', 'Identity']);
timestamps.push(['2015',  3, 0000,  3, 'TWEEDEES', 'KLING! KLANG!!']);
timestamps.push(['2015',  4, 0000,  4, 'VELTPUNCH', 'LET IT DIE (OAO)']);
timestamps.push(['2015',  5, 0000,  5, 'Kotobuki Minako', 'black hole']);
timestamps.push(['2015',  6, 0000,  6, 'Kuso Iinkai', 'Gekiteki Natsu Kakumei']);
timestamps.push(['2015',  7, 0000,  6, 'KANA-BOON', 'Nandemo Nedari']);
timestamps.push(['2015',  8, 0000,  7, 'THE ORAL CIGARETTES', 'Kyouran Hey Kids!!']);
timestamps.push(['2015',  9, 0000,  8, 'Yoru no Honki Dance', 'By My Side']);
timestamps.push(['2015', 10, 0000,  9, 'cinema staff', 'Shadow']);
timestamps.push(['2015', 11, 0000,  9, 'nano.RIPE', 'Kotae Awase']);
timestamps.push(['2015', 12, 0000, 10, 'SpecialThanks', 'Love begets love']);
timestamps.push(['2015', 13, 0000, 11, 'SCANDAL', 'Flashback No.5']);
timestamps.push(['2015', 14, 0000, 11, 'THE ORAL CIGARETTES', 'GET BACK']);
timestamps.push(['2015', 15, 0000, 12, 'Sambomaster', 'Kanousei']);
timestamps.push(['2015', 16, 0000, 13, 'Tsuji Shion', 'Summer Flag!']);
timestamps.push(['2015', 17, 0000, 14, 'SPYAIR', 'I\'M A BELIEVER']);
timestamps.push(['2015', 18, 0000, 15, 'Asakamidori', 'Sabana no Yoru ni Hoshi ga Furu']);
timestamps.push(['2015', 19, 0000, 16, 'Sayuri', 'Mikazuki']);
timestamps.push(['2015', 20, 0000, 17, '.lady.', 'A Little Magic']);
timestamps.push(['2015', 21, 0000, 17, 'Hanazawa Kana', 'We Are So in Love']);
timestamps.push(['2015', 22, 0000, 18, 'TrySail', 'Cobalt']);
timestamps.push(['2015', 23, 0000, 19, 'moumoon', 'Hello, shooting-star']);
timestamps.push(['2015', 24, 0000, 20, 'sphere', 'vivid brilliant door!']);

timestamps.push(['2014',  1, 0000,  1, 'nano.RIPE', 'Toumei na Sekai']);
timestamps.push(['2014',  2, 0000,  2, 'SCANDAL', 'Image']);
timestamps.push(['2014',  3, 0000,  3, 'Aqua Timez', 'Hinayume']);
timestamps.push(['2014',  4, 0000,  4, 'fumika', 'Endless Road']);
timestamps.push(['2014',  5, 0000,  4, 'BIGNOUN', 'FRICTION']);
timestamps.push(['2014',  6, 0000,  5, 'miwa', 'Faith']);
timestamps.push(['2014',  7, 0000,  6, 'Ikimonogakari', 'GOLDEN GIRL']);
timestamps.push(['2014',  8, 0000,  6, 'Neat\'s', 'MOA']);
timestamps.push(['2014',  9, 0000,  7, 'Primary', 'fragile garden']);
timestamps.push(['2014', 10, 0000,  8, 'Chatmonchy', 'Kokoro to Atama']);
timestamps.push(['2014', 11, 0000,  9, 'NEGOTO', 'Tasogare no Rhapsody']);
timestamps.push(['2014', 12, 0000, 10, 'cinema staff', 'borka']);
timestamps.push(['2014', 13, 0000, 11, 'nano.RIPE', 'Zettaichi']);
timestamps.push(['2014', 14, 0000, 11, 'yanaginagi', 'Esse']);
timestamps.push(['2014', 15, 0000, 12, 'TOKYO SKA PARADISE ORCHESTRA', 'Wake Up! feat. ASIAN KUNG-FU GENERATION']);
timestamps.push(['2014', 16, 0000, 13, 'Kon Natsumi', 'Gift']);
timestamps.push(['2014', 17, 0000, 14, 'iki', 'Kansen']);
timestamps.push(['2014', 18, 0000, 15, 'Tsuzuri Zukuri', 'Tsubame']);
timestamps.push(['2014', 19, 0000, 16, 'SID', 'hug']);
timestamps.push(['2014', 20, 0000, 17, 'Toyosaki Aki', 'Kanae Tamae']);
timestamps.push(['2014', 21, 0000, 18, 'Takebuchi Kei', 'MERMAID']);
timestamps.push(['2014', 22, 0000, 19, 'Komatsu Mikako', 'Emerald no Oka wo Koete']);
timestamps.push(['2014', 23, 0000, 19, 'Kotobuki Minako', 'Chiisana Tegami']);
timestamps.push(['2014', 24, 0000, 20, 'fhana', 'Itsuka no, Ikutsuka no Kimi to no Sekai']);

timestamps.push(['2013',  1, 0000,  1, 'Neat\'s', 'Modern Times']);
timestamps.push(['2013',  2, 0000,  2, 'cozy diary', 'Yi Ge Ren Ai Mei']);
timestamps.push(['2013',  3, 0000,  3, 'Ikimonogakari', 'Ashita no Sora']);
timestamps.push(['2013',  4, 0000,  4, 'Hikasa Youko', 'Glamorous days']);
timestamps.push(['2013',  5, 0000,  5, 'sasakure.UK', 'Koi Saite Hana feat. mirto']);
timestamps.push(['2013',  6, 0000,  6, 'fumika', 'Tabidachi no Bell feat. Fukuda Momoyo']);
timestamps.push(['2013',  7, 0000,  7, 'miwa', 'Miracle']);
timestamps.push(['2013',  8, 0000,  8, 'Kotobuki Minako', 'Prism']);
timestamps.push(['2013',  9, 0000,  8, 'Hanazawa Kana', 'melody']);
timestamps.push(['2013', 10, 0000,  9, 'SCANDAL', 'OVER DRIVE']);
timestamps.push(['2013', 11, 0000, 10, 'Kuso Iinkai', 'Hadouhou Girlfriend']);
timestamps.push(['2013', 12, 0000, 11, 'Dr.DOWNER', 'Rainbow']);
timestamps.push(['2013', 13, 0000, 11, 'Hikasa Youko', 'BALLOON']);
timestamps.push(['2013', 14, 0000, 12, 'cinema staff', 'Seiki no Hakken']);
timestamps.push(['2013', 15, 0000, 12, 'sasakure.UK', 'Butterfly Effect feat. ChouCho']);
timestamps.push(['2013', 16, 0000, 13, 'Iwasaki Ai', 'Hanataba']);
timestamps.push(['2013', 17, 0000, 14, 'Aso Natsuko', 'Never Ending Voyage']);
timestamps.push(['2013', 18, 0000, 15, 'yucat', 'Stop Me!']);
timestamps.push(['2013', 19, 0000, 16, 'ClariS', 'Colorful']);
timestamps.push(['2013', 20, 0000, 16, 'Toyosaki Aki', 'Patapa']);
timestamps.push(['2013', 21, 0000, 17, 'Hyadain', 'Warai no Kamisama ga Orite Kita!']);
timestamps.push(['2013', 22, 0000, 18, 'Tomatsu Haruka', 'Tomorrow']);
timestamps.push(['2013', 23, 0000, 19, 'Sambomaster', 'Miracle wo Kimi to Okoshitain desu']);
timestamps.push(['2013', 24, 0000, 20, 'yanaginagi', 'You can count on me']);


//--BASE--//
// timestamps.push(['year', 20,  0, 20, '', '']);
// timestamps.push(['year', 18,  0, 19, '', '']);
// timestamps.push(['year', 19,  0, 18, '', '']);
// timestamps.push(['year', 17,  0, 17, '', '']);
// timestamps.push(['year', 16,  0, 16, '', '']);
// timestamps.push(['year', 15,  0, 15, '', '']);
// timestamps.push(['year', 14,  0, 14, '', '']);
// timestamps.push(['year', 13,  0, 13, '', '']);
// timestamps.push(['year', 12,  0, 12, '', '']);
// timestamps.push(['year', 11,  0, 11, '', '']);
// timestamps.push(['year', 10,  0, 10, '', '']);
// timestamps.push(['year',  9,  0,  9, '', '']);
// timestamps.push(['year',  8,  0,  8, '', '']);
// timestamps.push(['year',  7,  0,  7, '', '']);
// timestamps.push(['year',  5,  0,  6, '', '']);
// timestamps.push(['year',  6,  0,  5, '', '']);
// timestamps.push(['year',  4,  0,  4, '', '']);
// timestamps.push(['year',  3,  0,  3, '', '']);
// timestamps.push(['year',  2,  0,  2, '', '']);
// timestamps.push(['year',  1,  0,  1, '', '']);
//--------//


//--FUNCTIONS--//
startup();

function startup() {
	timestamps = timestamps.sort((a,b) => a[1] - b[1]);
	if(document.getElementById('sidebar') != undefined) 
	{
		generateSidemenu();
		hideIrrelevant();
	}
	
	//read from table div, for blogger
	if(document.getElementById('table').getAttribute('data-id') != null)
	{
		tableID = document.getElementById('table').getAttribute('data-id');
		playerID = tableID + 'Player';
	}
	
	generateTable(tableID);
	generatePlayer(tableID);
}

function generateTable(tableID) {
	document.getElementById('table').innerHTML = '';
	
	let table = document.createElement('table');
	table.id = tableID;
	table.classList.add('list');
	table.classList.add('centered');
	
	let tbody = document.createElement('tbody');
	
	//header
	let th = document.createElement('tr');
		
		let td1 = document.createElement('th');
		td1.width = 35;
		td1.innerText = 'Rank';			
		th.appendChild(td1);
		
		let td2 = document.createElement('th');
		td2.width = 270;
		td2.innerText = 'Song Title';			
		th.appendChild(td2);
		
		let td3 = document.createElement('th');
		td3.width = 270;
		td3.innerText = 'Contributing Artist(s)';			
		th.appendChild(td3);
		
	tbody.appendChild(th);
	
	for(let rank = 1; rank <= 20; rank++)
	{
		let stamps = timestamps.filter(function(n) {
			return n[0] == tableID && n[3] == rank;
		})
		
		let tr = document.createElement('tr');
		tr.style.cursor = 'pointer';
		tr.setAttribute('seek',stamps[0][2]);
		tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
		tr.addEventListener('mouseover', hoverOnRow);
		tr.addEventListener('mouseout', hoverOnRow);
		
		if(stamps.length > 1)
		{
			let td1 = document.createElement('td');
			td1.style.textAlign = 'right';
			td1.setAttribute('rowspan', 2);
			td1.innerText = stamps[0][3];
			tr.appendChild(td1);
			
			let td2 = document.createElement('td');
			td2.innerText = stamps[0][5];
			tr.appendChild(td2);
			
			let td3 = document.createElement('td');
			td3.innerText = stamps[0][4];
			tr.appendChild(td3);
			
			tbody.appendChild(tr);
			
			tr = document.createElement('tr');
			tr.style.cursor = 'pointer';
			tr.setAttribute('seek',stamps[1][2]);
			tr.addEventListener('click', function() { generateSeek(this.getAttribute('seek')); });
			tr.addEventListener('mouseover', hoverOnRow);
			tr.addEventListener('mouseout', hoverOnRow);
							
			td2 = document.createElement('td');
			td2.innerText = stamps[1][5];
			tr.appendChild(td2);
			
			td3 = document.createElement('td');
			td3.innerText = stamps[1][4];
			tr.appendChild(td3);
			
			tbody.appendChild(tr);
		}
		else
		{
			
			let td1 = document.createElement('td');
			td1.style.textAlign = 'right';
			td1.innerText = stamps[0][3];
			tr.appendChild(td1);
			
			let td2 = document.createElement('td');
			td2.innerText = stamps[0][5];
			tr.appendChild(td2);
			
			let td3 = document.createElement('td');
			td3.innerText = stamps[0][4];
			tr.appendChild(td3);
			
			tbody.appendChild(tr);
		}
	}
	
	//footer
	while(tbody.getElementsByTagName('tr').length < 25)
	{
		let tf = document.createElement('tr');
		tf.classList.add('empty');
		tf.style.visibility = 'hidden';
		
		let td = document.createElement('td');
		td.setAttribute('colspan', 3);
		td.innerText = '_';			
		tf.appendChild(td);
		
		tbody.appendChild(tf);
	}
		
	table.appendChild(tbody);
	document.getElementById('table').appendChild(table);
}

function hoverOnRow() {
	let cells = this.getElementsByTagName('td');
	let prevCells = this.previousSibling.getElementsByTagName('td');
	if(prevCells.length == 3 && cells.length == 2 && prevCells[0].rowSpan != undefined)
		toggleHover(prevCells[0]);//.style.visibility = 'hidden';
	toggleHover(cells[0]);//.style.visibility = 'hidden';
	toggleHover(cells[1]);//.style.visibility = 'hidden';
	if(cells.length > 2) toggleHover(cells[2]);//.style.visibility = 'hidden';
}

function toggleHover(cell) {
	let supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
	let isDarked = document.getElementsByTagName('html')[0].classList.contains('darked');
	let cellColor = 'transparent';
	cellColor = isDarked ? 'gray' : 'lightgray';
	cell.style.backgroundColor = cell.style.backgroundColor == cellColor ? '' : cellColor;
}

function generateSeek(time) {
	let player = document.getElementById('music').getElementsByClassName('player')[0];
	player.currentTime = time;
	player.play();
}

function generatePlayer(tableID) {
	document.getElementById('music').innerHTML = '';
		
	let audio = document.createElement('audio');
	audio.id = tableID + 'Player';
	audio.classList.add('player');
	audio.addEventListener('playing', runTimestamp);
	audio.addEventListener('seeking', clearTimestamps);
	audio.controls = true;
	audio.volume = 0.5;
	audio.controlsList = 'nodownload';
	
	let source = document.createElement('source');
	if(tableID == '2018') source.src = domain + 'awardrankings2018-1.mp3';
	else source.src = domain + 'awardrankings' + tableID + '.mp3';
	source.type = 'audio/mpeg';
	source.innerText = '[You\'ll need a newer browser that supports HTML5 to listen to this.]';
	
	audio.appendChild(source);
	document.getElementById('music').appendChild(audio);
}

//for side menu, add all tables to have list class, use ids to generate
function generateSidemenu() {
	let years = [];
	timestamps.map(function(n) {
		if(years.indexOf(n[0]) < 0) years.push(n[0]);
	});
	for(let year of years)
	{
		let item = document.createElement('span');
		item.classList.add('year');
		item.innerText = year;
		item.addEventListener('click', function() {
			window.location.hash = '#' + this.innerText;
			tableID = this.innerText;
			playerID = this.innerText + 'Player';
			generateTable(tableID);
			generatePlayer(tableID);
            clearInterval(timer);
			clearTimestamps();
			hideIrrelevant();
		});
		document.getElementById('sidebar').appendChild(item);
	}
	
	//if location has anchor, click on year (eg. "?year=2020")
	if(years.indexOf(window.location.hash.slice(1)) >= 0)
	{
			tableID = window.location.hash.slice(1);
			playerID = window.location.hash.slice(1) + 'Player';
			generateTable(tableID);
			generatePlayer(tableID);
            clearInterval(timer);
			clearTimestamps();
			hideIrrelevant();
	}
}

function hideIrrelevant() {
	for(let year of document.getElementsByClassName('year'))
	{
		year.style.fontWeight = year.innerText != tableID ? 'normal' : 'bold';
	}
}

//actual timestamp run event when playing
function runTimestamp() {
    timer = setInterval(checkTimestamps, 1000);
}

function checkTimestamps() {
    //get player, table
    let audioPlayer = document.getElementById(playerID);
    let audioTable = document.getElementById(tableID);
	//if(audioPlayer == null || audioTable == null) return;
    //find current supposed highlighted based on time on player
    let currentTime = Math.floor(audioPlayer.currentTime);
    let currentPos;
    let prevPos;
    for (let pair of timestamps.filter(time => time[0] == tableID).sort((a,b) => b[2] - a[2])) {
        prevPos = pair;
        if (pair[2] <= currentTime) {
            currentPos = pair[1];
            break;
        }
    }
    //only change when time of next has passed: current to normal, next to bold
    if (currentPos == undefined) clearInterval(timer);
    else {
        if (prevPos != undefined && prevPos[2] <= currentTime) clearTimestamps();
        if (!audioPlayer.paused) {
			//if has colspan on column 0 ensure on second row cell on first row is highlighted
            if(audioTable.getElementsByTagName("tr")[currentPos].cells.length == 2)
				setTimestamp(audioTable.getElementsByTagName("tr")[currentPos-1].cells[0]);//.style.fontWeight = "bold";
            setTimestamp(audioTable.getElementsByTagName("tr")[currentPos]);//.style.fontWeight = "bold";
        }
        else {
			clearTimestamps();
            //audioTable.getElementsByTagName("tr")[currentPos].style.fontWeight = "normal";
            clearInterval(timer);
        }
    }
	//console.log(currentTime, currentPos, prevPos);
}

function setTimestamp(cell) {
	cell.style.fontWeight = "bold";
}

function clearTimestamps() {
    for (let row of document.getElementById(tableID).getElementsByTagName("tr")) {
        if(row.cells.length == 3) row.cells[0].style.fontWeight = null;
        row.style.fontWeight = "normal";
    }
}