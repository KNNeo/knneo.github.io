//[1] array containing all gallery info
let customArray = [
// { sortOrder: 0, year: 0, type: '', title: '', altTitle: '', handle: '', imgURL: '' },
// { sortOrder: 1, year: 2008, type: 'Anime', title: 'BLEACH', altTitle: 'ブリーチー',
// handle: '', imgURL: '' },
// { sortOrder: 2, year: 2008, type: 'Anime', title: 'Love Hina', altTitle: 'ラブ　ひな', 
// handle: '', imgURL: '' },
// { sortOrder: 3, year: 2008, type: 'Anime', title: 'Kekkaishi', altTitle: '結界師', 
// handle: '', imgURL: '' },
// { sortOrder: 4, year: 2008, type: 'Anime', title: 'Toradora!', altTitle: 'とらドラ！', 
// handle: '', imgURL: '' },
// { sortOrder: 5, year: 2008, type: 'Anime', title: 'Kuroshitsuji', altTitle: '黒執事', 
// handle: '', imgURL: '' },
// { sortOrder: 6, year: 2019, type: 'Anime', title: 'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:  '理系が恋に落ちたので証明してみた。', 
// handle: 'rikeigakoini',
// imgURL: 'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg' },
// { sortOrder: 999, year: 0, type: '', title: '', altTitle: '', handle: '', imgURL: '' }
{ sortOrder:33, year:2013, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'RDG: Red Data Girl', altTitle:'', handle:'', imgURL:'' },
{ sortOrder:34, year:2013, season: 'Spring', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai.', altTitle:'俺の妹がこんなに可愛いわけがない。', handle:'oreimo_eromanga', imgURL:'https://twitter.com/oreimo_eromanga' },
{ sortOrder:35, year:2013, season: '', length:0, seriesTitle: '', type:'TV', title:'Acchi Kocchi ', altTitle:'あっちこっち', handle:'ackc_anime', imgURL:'https://twitter.com/ackc_anime' },
{ sortOrder:36, year:2013, season: 'Spring', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://twitter.com/anime_shingeki' },
{ sortOrder:37, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Servant x Service ', altTitle:'サーバント×サービス', handle:'', imgURL:'' },
{ sortOrder:38, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kamisama no Inai Nichiyoubi', altTitle:'神さまのいない日曜日', handle:'', imgURL:'' },
{ sortOrder:39, year:2013, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'COPPELION', altTitle:'', handle:'coppelion_anime', imgURL:'https://twitter.com/coppelion_anime' },
{ sortOrder:40, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Golden Time ', altTitle:'ゴールデンタイム', handle:'golden_time_tv', imgURL:'https://twitter.com/golden_time_tv' },
{ sortOrder:41, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Nagi no Asukara ', altTitle:'凪のあすから', handle:'naginoasukara', imgURL:'https://twitter.com/naginoasukara' },
{ sortOrder:42, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Samurai Flamenco ', altTitle:'サムライフラメンコ', handle:'samumenco', imgURL:'https://twitter.com/samumenco' },
{ sortOrder:43, year:2014, season: 'Winter', length:1, seriesTitle: 'Seitokai Yakuindomo', type:'TV', title:'Seitokai Yakuindomo* ', altTitle:'生徒会役員共＊', handle:'seitokai0428', imgURL:'https://twitter.com/seitokai0428' },
{ sortOrder:44, year:2014, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Tonari no Seki-kun ', altTitle:'となりの関くん', handle:'sekikun_anime', imgURL:'https://twitter.com/sekikun_anime' },
{ sortOrder:45, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Bokura wa Minna Kawaisou ', altTitle:'僕らはみんな河合荘', handle:'anime_kawaisou', imgURL:'https://twitter.com/anime_kawaisou' },
{ sortOrder:46, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Isshuukan Friends. ', altTitle:'一週間フレンズ。', handle:'1weekfriends', imgURL:'https://twitter.com/1weekfriends' },
{ sortOrder:47, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Ryuugajou Nanana no Maizoukin ', altTitle:'龍ヶ嬢七々々の埋蔵金', handle:'nanana_tv', imgURL:'https://twitter.com/nanana_tv' },
{ sortOrder:48, year:2014, season: 'Summer', length:1, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji: Book of Circus ', altTitle:'黒執事 Book of Circus', handle:'kuroshitsuji2', imgURL:'https://twitter.com/kuroshitsuji2' },
{ sortOrder:49, year:2014, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Glasslip ', altTitle:'グラスリップ', handle:'glasslip_anime', imgURL:'https://twitter.com/glasslip_anime' },
{ sortOrder:50, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Denki-gai no Honya-san ', altTitle:'デンキ街の本屋さん', handle:'anime_denkigai', imgURL:'https://twitter.com/anime_denkigai' },
{ sortOrder:51, year:2014, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Shigatsu wa Kimi no Uso ', altTitle:'四月は君の嘘', handle:'shigatsuhakimi', imgURL:'https://twitter.com/shigatsuhakimi' },
{ sortOrder:52, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Sora no Method ', altTitle:'天体のメソッド', handle:'sora_no_method', imgURL:'https://twitter.com/sora_no_method' },
{ sortOrder:53, year:2015, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Koufuku Graffiti ', altTitle:'幸腹グラフィティ', handle:'koufuku_g', imgURL:'https://twitter.com/koufuku_g' },
{ sortOrder:54, year:2015, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu ', altTitle:'暗殺教室', handle:'ansatsu_anime', imgURL:'https://twitter.com/ansatsu_anime' },
{ sortOrder:55, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Plastic Memories ', altTitle:'プラスティック・メモリーズ', handle:'pla_memo', imgURL:'https://twitter.com/pla_memo' },
{ sortOrder:56, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Punch Line ', altTitle:'パンチライン', handle:'punchline_pj', imgURL:'https://twitter.com/punchline_pj' },
{ sortOrder:57, year:2015, season: 'Summer', length:1, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING!!!', altTitle:'', handle:'Wagnaria', imgURL:'https://twitter.com/Wagnaria' },
{ sortOrder:58, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Sore ga Seiyuu! ', altTitle:'それが声優！', handle:'soresei_anime', imgURL:'https://twitter.com/soresei_anime' },
{ sortOrder:59, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Ranpo Kitan Game of Laplace ', altTitle:'乱歩奇譚 Game of Laplace', handle:'rampokitan', imgURL:'https://twitter.com/rampokitan' },
{ sortOrder:60, year:2015, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Subete ga F ni Naru ', altTitle:'すべてがFになる THE PERFECT INSIDER', handle:'f_noitamina', imgURL:'https://twitter.com/f_noitamina' },
{ sortOrder:61, year:2016, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu 2nd Season ', altTitle:'暗殺教第2期', handle:'ansatsu_anime', imgURL:'https://twitter.com/ansatsu_anime' },
{ sortOrder:62, year:2016, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Boku Dake ga Inai Machi ', altTitle:'僕だけがいない街', handle:'bokumachi_anime', imgURL:'https://twitter.com/bokumachi_anime' },
{ sortOrder:63, year:2016, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi ', altTitle:'だがしかし', handle:'anime_dagashi', imgURL:'https://twitter.com/anime_dagashi' },
{ sortOrder:64, year:2016, season: 'Spring', length:2, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://twitter.com/bungosd_anime' },
{ sortOrder:65, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kono Bijutsubu ni wa Mondai ga Aru!', altTitle:'この美術部には問題がある！', handle:'konobi_anime', imgURL:'https://twitter.com/konobi_anime' },
{ sortOrder:66, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Time Travel Shoujo', altTitle:'タイムトラベル少女～マリ・ワカと8人の科学者たち～', handle:'mariwaka_anime', imgURL:'https://twitter.com/mariwaka_anime' },
{ sortOrder:67, year:2016, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'WWW.WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://twitter.com/Wagnaria' },
{ sortOrder:68, year:2016, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://twitter.com/3lion_anime' },
{ sortOrder:69, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'ACCA 13-ku Kansatsu-ka ', altTitle:'ACCA13区監察課', handle:'ACCA_anime', imgURL:'https://twitter.com/ACCA_anime' },
{ sortOrder:70, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Demi-chan wa Kataritai ', altTitle:'亜人ちゃんは語りたい', handle:'demichan_anime', imgURL:'https://twitter.com/demichan_anime' },
{ sortOrder:71, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tsuki ga Kirei ', altTitle:'月がきれい', handle:'tsukigakirei_tv', imgURL:'https://twitter.com/tsukigakirei_tv' },
{ sortOrder:72, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Eromanga-sensei ', altTitle:'エロマンガ先生', handle:'oreimo_eromanga', imgURL:'https://twitter.com/oreimo_eromanga' },
{ sortOrder:73, year:2017, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://twitter.com/anime_shingeki' },
{ sortOrder:74, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Alice to Zouroku ', altTitle:'アリスと蔵六', handle:'alicetozouroku', imgURL:'https://twitter.com/alicetozouroku' },
{ sortOrder:75, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Aho Girl ', altTitle:'アホガール', handle:'ahogirl_anime', imgURL:'https://twitter.com/ahogirl_anime' },
{ sortOrder:76, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsurezure Children ', altTitle:'徒然チルドレン', handle:'tsuredure_anime', imgURL:'https://twitter.com/tsuredure_anime' },
{ sortOrder:77, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Gamers! ', altTitle:'ゲーマーズ！', handle:'gamers_tvanime', imgURL:'https://twitter.com/gamers_tvanime' },
{ sortOrder:78, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Just Because!', altTitle:'', handle:'JustBecause_JP', imgURL:'https://twitter.com/JustBecause_JP' },
{ sortOrder:79, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Blend.S ', altTitle:'ブレンド・S', handle:'blend_s_anime', imgURL:'https://twitter.com/blend_s_anime' },
{ sortOrder:80, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houseki no Kuni ', altTitle:'宝石の国', handle:'houseki_anime', imgURL:'https://twitter.com/houseki_anime' },
{ sortOrder:81, year:2017, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://twitter.com/3lion_anime' },
{ sortOrder:82, year:2018, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi 2 ', altTitle:'だがしかし2', handle:'anime_dagashi', imgURL:'https://twitter.com/anime_dagashi' },
{ sortOrder:83, year:2018, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Slow Start ', altTitle:'スロウスタート', handle:'slosta_anime', imgURL:'https://twitter.com/slosta_anime' },
{ sortOrder:84, year:2018, season: 'Winter', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san ', altTitle:'からかい上手の高木さん', handle:'takagi3_anime', imgURL:'https://twitter.com/takagi3_anime' },
{ sortOrder:85, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tada-kun wa Koi wo Shinai ', altTitle:'多田くんは恋をしない', handle:'tadakoi_anime', imgURL:'https://twitter.com/tadakoi_anime' },
{ sortOrder:86, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Fumikiri Jikan ', altTitle:'踏切時間', handle:'fumikiri_anime', imgURL:'https://twitter.com/fumikiri_anime' },
{ sortOrder:87, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Wotaku ni Koi wa Muzukashii ', altTitle:'ヲタクに恋は難しい', handle:'wotakoi_anime', imgURL:'https://twitter.com/wotakoi_anime' },
{ sortOrder:88, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Chio-chan no Tsuugakuro ', altTitle:'ちおちゃんの通学路', handle:'Chiochan_tv', imgURL:'https://twitter.com/Chiochan_tv' },
{ sortOrder:89, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Asobi Asobase ', altTitle:'あそびあそばせ', handle:'asobiasobase_a', imgURL:'https://twitter.com/asobiasobase_a' },
{ sortOrder:90, year:2018, season: 'Summer', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://twitter.com/anime_shingeki' },
{ sortOrder:91, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsukumogami Kashimasu ', altTitle:'つくもがみ貸します', handle:'tsukumogami_tv', imgURL:'https://twitter.com/tsukumogami_tv' },
{ sortOrder:92, year:2018, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'BANANA FISH', altTitle:'', handle:'bananafish_tv', imgURL:'https://twitter.com/bananafish_tv' },
{ sortOrder:93, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Uchi no Maid ga Uzasugiru! ', altTitle:'うちのメイドがウザすぎる！', handle:'uzamaid_a', imgURL:'https://twitter.com/uzamaid_a' },
{ sortOrder:94, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Gaikotsu Shoten\'in Honda-san ', altTitle:'ガイコツ書店員 本田さん', handle:'gai_honda', imgURL:'https://twitter.com/gai_honda' },
{ sortOrder:95, year:2019, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Domestic na Kanojo ', altTitle:'ドメスティックな彼女', handle:'domekano_anime', imgURL:'https://twitter.com/domekano_anime' },
{ sortOrder:96, year:2019, season: 'Winter', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦～', handle:'anime_kaguya', imgURL:'https://twitter.com/anime_kaguya' },
{ sortOrder:97, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Midara na Ao-chan wa Benkyou ga Dekinai', altTitle:'みだらな青ちゃんは勉強ができない', handle:'aochan_anime', imgURL:'https://twitter.com/aochan_anime' },
{ sortOrder:98, year:2019, season: 'Spring', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Season 3 ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://twitter.com/bungosd_anime' },
{ sortOrder:99, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Joshikausei ', altTitle:'女子かう生', handle:'joshikau_anime', imgURL:'https://twitter.com/joshikau_anime' },
{ sortOrder:100, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sewayaki Kitsune no Senko-san ', altTitle:'世話やきキツネの仙狐さん', handle:'sewayakisenko', imgURL:'https://twitter.com/sewayakisenko' },
{ sortOrder:101, year:2019, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 Part.2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://twitter.com/anime_shingeki' },
{ sortOrder:102, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Araburu Kisetsu no Otome-domo yo. ', altTitle:'荒ぶる季節の乙女どもよ。', handle:'araotoproject', imgURL:'https://twitter.com/araotoproject' },
{ sortOrder:103, year:2019, season: 'Summer', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san 2 ', altTitle:'からかい上手の高木さん２', handle:'takagi3_anime', imgURL:'https://twitter.com/takagi3_anime' },
{ sortOrder:104, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Joshikousei no Mudazukai ', altTitle:'女子高生の無駄づかい', handle:'jyoshimuda', imgURL:'https://twitter.com/jyoshimuda' },
{ sortOrder:105, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houkago Saikoro Club ', altTitle:'放課後さいころ倶楽部', handle:'saikoro_club', imgURL:'https://twitter.com/saikoro_club' },
{ sortOrder:106, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Babylon ', altTitle:'バビロン', handle:'babylon_anime', imgURL:'https://twitter.com/babylon_anime' },
{ sortOrder:107, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Hatena Illusion', altTitle:'はてな☆イリュージョン', handle:'hatena_anime', imgURL:'https://twitter.com/hatena_anime' },
{ sortOrder:108, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Jibaku Shounen Hanako-kun', altTitle:'地縛少年花子くん', handle:'hanakokun_info', imgURL:'https://twitter.com/hanakokun_info' },
{ sortOrder:109, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:'理系が恋に落ちたので証明してみた。', handle:'rikeigakoini', imgURL:'https://twitter.com/rikeigakoini' },
{ sortOrder:110, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Kyokou Suiri', altTitle:'虚構推理', handle:'kyokou_suiri', imgURL:'https://twitter.com/kyokou_suiri' },
{ sortOrder:111, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Kakushigoto', altTitle:'かくしごと', handle:'kakushigoto_pr', imgURL:'https://twitter.com/kakushigoto_pr' },
{ sortOrder:112, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yesterday wo Utatte', altTitle:'イエスタデイをうたって', handle:'anime_yesterday', imgURL:'https://twitter.com/anime_yesterday' },
{ sortOrder:113, year:2020, season: 'Spring', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai?', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦？～', handle:'anime_kaguya', imgURL:'https://twitter.com/anime_kaguya' },

];

let seriesArray = new Array();
function generateSeriesArray() {
	if(isGroupBySeries && seriesArray.length == 0)
	{			
		//unique series
		let allSeries = new Array();
		for(let show of customArray)
		{
			if(allSeries.indexOf(show.seriesTitle == '' ? show.title : show.seriesTitle) < 0)
				allSeries.push(show.seriesTitle == '' ? show.title : show.seriesTitle);
		}
		seriesArray = new Array();
		//empty series list
		for(let show of allSeries)
		{
			seriesArray.push( {
				seriesTitle: show, 
				shows: new Array()
				});
		}
		//add all shows into series
		for(let series of seriesArray)
		{
			for(let show of customArray)
			{
				if(show.seriesTitle == series.seriesTitle || show.title == series.seriesTitle)
					series.shows.push(show);
			}
		}
	}
	
	if(isGroupBySeries)
	{
		
		let animeTable = document.createElement('table');
		let animeTableBody = document.createElement('tbody');
		let animeTableHeader = document.createElement('tr');

		let animeTableHeaderRow = document.createElement('th');
		// animeTableHeaderRow.innerText = 'Series Title';
		// animeTableHeader.appendChild(animeTableHeaderRow);
		// animeTableHeaderRow = document.createElement('th');
		animeTableHeaderRow.innerText = 'Series Title';
		animeTableHeader.appendChild(animeTableHeaderRow);

		let seasons = ['','Winter','Spring','Summer','Autumn'];
		for(let y = 2013; y <= 2020; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == 2020 && seasons[s] == 'Spring') animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}
		
		animeTableBody.appendChild(animeTableHeader);
	
		for(let anime of seriesArray)
		{

			let animeTableRow = document.createElement('tr');
			let count = 0;
			for (let series of anime.shows)
			{
				count += series.length;
			}
			if(count == 0) continue;

			animeTableContent = document.createElement('td');
			animeTableContent.innerText = anime.seriesTitle;
			animeTableRow.appendChild(animeTableContent);
			
			animeTableBody.appendChild(animeTableRow);
						
			let remainder = anime.length;
			for(let y = 2013; y <= 2020; y++)
			{
				for(let s = 1; s <= 4; s++)
				{
					animeTableContent = document.createElement('td');
/* 					if(y*10+s >= anime.year*10+seasons.indexOf(anime.season) && remainder > 0)
					{
						animeTableContent.classList.add('active-period');
						// animeTableContent.style.backgroundColor = 'white';
						// animeTableContent.innerText = 'X';
						remainder--;
					}
					else
 */					animeTableContent.innerText = '';
					if(y == 2020 && seasons[s] == 'Spring' && !animeTableContent.classList.contains('active-period'))
						animeTableContent.style.backgroundColor = '#444444'; //current season
					animeTableRow.appendChild(animeTableContent);
				}
			}
		}
		
		for(let anime of seriesArray)
		{
			for (let series of anime.shows)
			{
				//find series row
				let tableSeries = animeTableBody.getElementsByTagName('tr');
				var rowNo = -1;
				for(let s = 0; s < tableSeries.length; s++)
				{
					if(tableSeries[s].getElementsByTagName('th').length > 0) continue;
					if(tableSeries[s].getElementsByTagName('td')[0].innerText == anime.seriesTitle)
						rowNo = s;
				}
				
				//loop but replace instead of insert
				let remainder = series.length;
				var column = 0;
				for(let y = 2013; y <= 2020; y++)
				{
					for(let s = 1; s <= 4; s++)
					{
						column++;
						if(y*10+s >= series.year*10+seasons.indexOf(series.season) && remainder > 0)
						{
							tableSeries[rowNo].getElementsByTagName('td')[column].classList.add('active-period');
							remainder--;
							break;
						}
					}
				}
			}
		}
		
		animeTable.appendChild(animeTableBody);
		document.getElementById('anime-list').innerHTML = '';
		document.getElementById('anime-list').appendChild(animeTable);
	}
}

//[2] generate labels
//add event for radio buttons
let isGroupBySeries = false;
document.getElementsByClassName('selection')[1].addEventListener('click', function() { inverseRadio(1); });
document.getElementsByClassName('selection')[0].addEventListener('click', function() { inverseRadio(0); });
function inverseRadio(val) {
		document.getElementsByClassName('selection')[1].checked = val==1 ? true : false;
		document.getElementsByClassName('selection')[0].checked = val==0 ? true : false;
		isGroupBySeries = document.getElementsByClassName('selection')[1].checked;
		if(isGroupBySeries) generateSeriesArray();
		else renderSeasonsArray();
}

//[3] generate HTML based on array
//Every row in the form of: title, table of boxes where lit
renderSeasonsArray();
function renderSeasonsArray() {
	let animeTable = document.createElement('table');
	let animeTableBody = document.createElement('tbody');
	let animeTableHeader = document.createElement('tr');

	let animeTableHeaderRow = document.createElement('th');
	// animeTableHeaderRow.innerText = 'Series Title';
	// animeTableHeader.appendChild(animeTableHeaderRow);
	// animeTableHeaderRow = document.createElement('th');
	animeTableHeaderRow.innerText = 'Anime Title';
	animeTableHeader.appendChild(animeTableHeaderRow);

	let seasons = ['','Winter','Spring','Summer','Autumn'];
	for(let y = 2013; y <= 2020; y++)
	{
		for(let s = 1; s <= 4; s++)
		{
			animeTableHeaderRow = document.createElement('th');
			if(y == 2020 && seasons[s] == 'Spring') animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
			animeTableHeaderRow.innerHTML = y + "<br>" + seasons[s];
			animeTableHeader.appendChild(animeTableHeaderRow);
		}
	}

	animeTableBody.appendChild(animeTableHeader);

	if(!isGroupBySeries)
	{
		for(let anime of customArray)
		{
			let animeTableRow = document.createElement('tr');
			
			// let animeTableContent = document.createElement('td');
			// animeTableContent.innerText = anime.seriesTitle;
			// animeTableRow.appendChild(animeTableContent);
			
			
			// if(!isGroupBySeries)
			if(anime.length == 0) continue;
			animeTableContent = document.createElement('td');
			animeTableContent.innerText = anime.title;
			animeTableRow.appendChild(animeTableContent);
			
			animeTableBody.appendChild(animeTableRow);
			
			let remainder = anime.length;
			for(let y = 2013; y <= 2020; y++)
			{
				for(let s = 1; s <= 4; s++)
				{
					animeTableContent = document.createElement('td');
					if(y*10+s >= anime.year*10+seasons.indexOf(anime.season) && remainder > 0)
					{
						animeTableContent.classList.add('active-period');
						// animeTableContent.style.backgroundColor = 'white';
						animeTableContent.innerText = 'X';
						remainder--;
					}
					else
						animeTableContent.innerText = '';
					if(y == 2020 && seasons[s] == 'Spring' && !animeTableContent.classList.contains('active-period'))
						animeTableContent.style.backgroundColor = '#444444'; //current season
					// animeTableContent.style.textAlign = 'center';
					animeTableRow.appendChild(animeTableContent);
				}
			}
		}
		animeTable.appendChild(animeTableBody);
		document.getElementById('anime-list').innerHTML = '';
		document.getElementById('anime-list').appendChild(animeTable);
	}
}


//[4] after adjustments
let h3height = document.getElementsByTagName('h3')[0].getBoundingClientRect().height;
let headerHeight = document.getElementById('header').offsetHeight;
let footerHeight = document.getElementById('footer').offsetHeight;
document.getElementById('anime-list').style.height = (window.innerHeight - h3height - headerHeight - footerHeight - 0.15*window.innerHeight) + 'px';	










/* 
//aechived
//switch source for onload
for (var image of document.getElementsByTagName("img"))
{
 image.src = image.alt;
 image.alt = "";
}
//error eventListener
var animeImgList = document.getElementsByTagName("img");
for (var i = 0; i < animeImgList.length; i++)
{
animeImgList[i].addEventListener("error", function() { this.onerror=null; this.src='https://knneo.github.io/resources/spacer.gif'; this.style.border = '0px white solid'; this.style.backgroundColor = 'transparent'; });
}

//expand to see details
var animeLineList = document.getElementsByClassName("anime-line");
for (var j = 0; j < animeLineList.length - 1; j++)
{
	animeLineList[j].addEventListener("click", function() { 
		document.getElementsByClassName("anime-details-box")[j].style.display = "block";
		document.getElementsByClassName("anime-details-box")[j].style.fontSize = "small";
		animeLineList[j].style.fontSize = "1em";
	} );

	document.getElementsByClassName("anime-details-box")[j].addEventListener("dblclick", function() { 
		document.getElementsByClassName("anime-details-box")[j].style.display = "none";
		animeLineList[j].style.fontSize = "";
	});
}

//allow collapse of years and expand when clicked
var animeYearList = document.getElementsByClassName("year-display");
for (var i = 0; i < animeYearList.length; i++)
{
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = i == animeYearList.length - 1 ? '400px' : 0;
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.visibility= i == animeYearList.length - 1 ? 'visible' : 'collapse';
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.transition = 'max-height 0.5s ease-in-out';
animeYearList[i].addEventListener("click", function() {
//close all
for(var openList of document.getElementsByClassName("anime-year")) {openList.style.maxHeight = 0; openList.style.visibility = 'collapse'; }
//open one
this.parentElement.getElementsByClassName("anime-year")[0].style.visibility = 'visible';
this.parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = '400px';
});
} */