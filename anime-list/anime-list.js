//[1] array containing all gallery info
let customArray = [
{ sortOrder:33, year:2013, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'RDG: Red Data Girl', altTitle:'', handle:'', imgURL:'' },
{ sortOrder:34, year:2013, season: 'Spring', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai.', altTitle:'俺の妹がこんなに可愛いわけがない。', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg' },
{ sortOrder:35, year:2013, season: '', length:0, seriesTitle: '', type:'TV', title:'Acchi Kocchi ', altTitle:'あっちこっち', handle:'ackc_anime', imgURL:'https://pbs.twimg.com/profile_images/537215428385202177/TM13Pwi7.jpeg' },
{ sortOrder:36, year:2013, season: 'Spring', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1145367407931736065/73iF39yV.png' },
{ sortOrder:37, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Servant x Service ', altTitle:'サーバント×サービス', handle:'', imgURL:'' },
{ sortOrder:38, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kamisama no Inai Nichiyoubi', altTitle:'神さまのいない日曜日', handle:'', imgURL:'' },
{ sortOrder:39, year:2013, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'COPPELION', altTitle:'', handle:'coppelion_anime', imgURL:'https://pbs.twimg.com/profile_images/448715908291117057/7-4TgcB-.jpeg' },
{ sortOrder:40, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Golden Time ', altTitle:'ゴールデンタイム', handle:'golden_time_tv', imgURL:'https://pbs.twimg.com/profile_images/378800000533932917/36355310e1a9d9bdf977d75ad146c187.jpeg' },
{ sortOrder:41, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Nagi no Asukara ', altTitle:'凪のあすから', handle:'naginoasukara', imgURL:'https://pbs.twimg.com/profile_images/453794628215402496/jE3KRblj.jpeg' },
{ sortOrder:42, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Samurai Flamenco ', altTitle:'サムライフラメンコ', handle:'samumenco', imgURL:'https://pbs.twimg.com/profile_images/378800000260049097/c27c1ed268ddf73d430d66ab5d1ca728.png' },
{ sortOrder:43, year:2014, season: 'Winter', length:1, seriesTitle: 'Seitokai Yakuindomo', type:'TV', title:'Seitokai Yakuindomo* ', altTitle:'生徒会役員共＊', handle:'seitokai0428', imgURL:'https://pbs.twimg.com/profile_images/1202785307428417536/k0CYX9kO.jpg' },
{ sortOrder:44, year:2014, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Tonari no Seki-kun ', altTitle:'となりの関くん', handle:'sekikun_anime', imgURL:'https://pbs.twimg.com/profile_images/378800000382812058/86c79e12a02ff7c7d99eda657f37fd34.png' },
{ sortOrder:45, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Bokura wa Minna Kawaisou ', altTitle:'僕らはみんな河合荘', handle:'anime_kawaisou', imgURL:'https://pbs.twimg.com/profile_images/451619211400335360/YaEY1Ryu.jpeg' },
{ sortOrder:46, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Isshuukan Friends. ', altTitle:'一週間フレンズ。', handle:'1weekfriends', imgURL:'https://pbs.twimg.com/profile_images/425643414072217600/DL3uunKS.jpeg' },
{ sortOrder:47, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Ryuugajou Nanana no Maizoukin ', altTitle:'龍ヶ嬢七々々の埋蔵金', handle:'nanana_tv', imgURL:'https://pbs.twimg.com/profile_images/378800000863120396/NcgR3u74.jpeg' },
{ sortOrder:48, year:2014, season: 'Summer', length:1, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji: Book of Circus ', altTitle:'黒執事 Book of Circus', handle:'kuroshitsuji2', imgURL:'https://pbs.twimg.com/profile_images/459199935506677760/RfFVR915.png' },
{ sortOrder:49, year:2014, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Glasslip ', altTitle:'グラスリップ', handle:'glasslip_anime', imgURL:'https://pbs.twimg.com/profile_images/922803547514716161/0pZj30Fs.jpg' },
{ sortOrder:50, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Denki-gai no Honya-san ', altTitle:'デンキ街の本屋さん', handle:'anime_denkigai', imgURL:'https://pbs.twimg.com/profile_images/569871960624996352/250Nbmru.jpeg' },
{ sortOrder:51, year:2014, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Shigatsu wa Kimi no Uso ', altTitle:'四月は君の嘘', handle:'shigatsuhakimi', imgURL:'https://pbs.twimg.com/profile_images/496575304811294720/wGuXONlf.jpeg' },
{ sortOrder:52, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Sora no Method ', altTitle:'天体のメソッド', handle:'sora_no_method', imgURL:'https://pbs.twimg.com/profile_images/445515376294502400/mNtCIWAh.png' },
{ sortOrder:53, year:2015, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Koufuku Graffiti ', altTitle:'幸腹グラフィティ', handle:'koufuku_g', imgURL:'https://pbs.twimg.com/profile_images/489062683409281024/vOhgFElc.jpeg' },
{ sortOrder:54, year:2015, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu ', altTitle:'暗殺教室', handle:'ansatsu_anime', imgURL:'https://pbs.twimg.com/profile_images/498033546800279553/SlFtnL3Y.jpeg' },
{ sortOrder:55, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Plastic Memories ', altTitle:'プラスティック・メモリーズ', handle:'pla_memo', imgURL:'https://pbs.twimg.com/profile_images/516603237269393408/CnhRb06K.png' },
{ sortOrder:56, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Punch Line ', altTitle:'パンチライン', handle:'punchline_pj', imgURL:'https://pbs.twimg.com/profile_images/586407884080066560/sK1Y02Y-.jpg' },
{ sortOrder:57, year:2015, season: 'Summer', length:1, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING!!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg' },
{ sortOrder:58, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Sore ga Seiyuu! ', altTitle:'それが声優！', handle:'soresei_anime', imgURL:'https://pbs.twimg.com/profile_images/602762236428353537/VjPrONQo.jpg' },
{ sortOrder:59, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Ranpo Kitan Game of Laplace ', altTitle:'乱歩奇譚 Game of Laplace', handle:'rampokitan', imgURL:'https://pbs.twimg.com/profile_images/609287232319434752/RO3hXvfX.jpg' },
{ sortOrder:60, year:2015, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Subete ga F ni Naru ', altTitle:'すべてがFになる THE PERFECT INSIDER', handle:'f_noitamina', imgURL:'https://pbs.twimg.com/profile_images/598886798668877824/ngMJ6d-w.jpg' },
{ sortOrder:61, year:2016, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu 2nd Season ', altTitle:'暗殺教第2期', handle:'ansatsu_anime', imgURL:'https://pbs.twimg.com/profile_images/498033546800279553/SlFtnL3Y.jpeg' },
{ sortOrder:62, year:2016, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Boku Dake ga Inai Machi ', altTitle:'僕だけがいない街', handle:'bokumachi_anime', imgURL:'https://pbs.twimg.com/profile_images/661558389219065856/5q_QNX-W.png' },
{ sortOrder:63, year:2016, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi ', altTitle:'だがしかし', handle:'anime_dagashi', imgURL:'https://pbs.twimg.com/profile_images/894934393671696384/-MV8qTBZ.jpg' },
{ sortOrder:64, year:2016, season: 'Spring', length:2, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1245365372204670976/HdFBqY6s.jpg' },
{ sortOrder:65, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kono Bijutsubu ni wa Mondai ga Aru!', altTitle:'この美術部には問題がある！', handle:'konobi_anime', imgURL:'https://pbs.twimg.com/profile_images/708865198296162304/QRsNybbW.jpg' },
{ sortOrder:66, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Time Travel Shoujo', altTitle:'タイムトラベル少女～マリ・ワカと8人の科学者たち～', handle:'mariwaka_anime', imgURL:'https://pbs.twimg.com/profile_images/737133362410754049/mJn-rdrk.jpg' },
{ sortOrder:67, year:2016, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'WWW.WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg' },
{ sortOrder:68, year:2016, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://pbs.twimg.com/profile_images/836077469446754304/dsaXnj0l.jpg' },
{ sortOrder:69, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'ACCA 13-ku Kansatsu-ka ', altTitle:'ACCA13区監察課', handle:'ACCA_anime', imgURL:'https://pbs.twimg.com/profile_images/767598431820914688/xSqk1nJu.jpg' },
{ sortOrder:70, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Demi-chan wa Kataritai ', altTitle:'亜人ちゃんは語りたい', handle:'demichan_anime', imgURL:'https://pbs.twimg.com/profile_images/772024004647407617/JmQfO1Oe.jpg' },
{ sortOrder:71, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tsuki ga Kirei ', altTitle:'月がきれい', handle:'tsukigakirei_tv', imgURL:'https://pbs.twimg.com/profile_images/832160318113488896/2B4ipy5I.jpg' },
{ sortOrder:72, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Eromanga-sensei ', altTitle:'エロマンガ先生', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg' },
{ sortOrder:73, year:2017, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1145367407931736065/73iF39yV.png' },
{ sortOrder:74, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Alice to Zouroku ', altTitle:'アリスと蔵六', handle:'alicetozouroku', imgURL:'https://pbs.twimg.com/profile_images/875537037415243776/o5pAqNwi.jpg' },
{ sortOrder:75, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Aho Girl ', altTitle:'アホガール', handle:'ahogirl_anime', imgURL:'https://pbs.twimg.com/profile_images/828435582971842561/3VyMSA2p.jpg' },
{ sortOrder:76, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsurezure Children ', altTitle:'徒然チルドレン', handle:'tsuredure_anime', imgURL:'https://pbs.twimg.com/profile_images/907430679201308672/9WY29qYW.jpg' },
{ sortOrder:77, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Gamers! ', altTitle:'ゲーマーズ！', handle:'gamers_tvanime', imgURL:'https://pbs.twimg.com/profile_images/857105776774717442/NIfomSTq.jpg' },
{ sortOrder:78, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Just Because!', altTitle:'', handle:'JustBecause_JP', imgURL:'https://pbs.twimg.com/profile_images/930398934337454080/Me2wofQb.jpg' },
{ sortOrder:79, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Blend.S ', altTitle:'ブレンド・S', handle:'blend_s_anime', imgURL:'https://pbs.twimg.com/profile_images/902045404405030912/89oD8X9L.jpg' },
{ sortOrder:80, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houseki no Kuni ', altTitle:'宝石の国', handle:'houseki_anime', imgURL:'https://pbs.twimg.com/profile_images/865400178710151168/6WUJV_MB.jpg' },
{ sortOrder:81, year:2017, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://pbs.twimg.com/profile_images/836077469446754304/dsaXnj0l.jpg' },
{ sortOrder:82, year:2018, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi 2 ', altTitle:'だがしかし2', handle:'anime_dagashi', imgURL:'https://pbs.twimg.com/profile_images/894934393671696384/-MV8qTBZ.jpg' },
{ sortOrder:83, year:2018, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Slow Start ', altTitle:'スロウスタート', handle:'slosta_anime', imgURL:'https://pbs.twimg.com/profile_images/947022175218712576/o0B4Ra8F.jpg' },
{ sortOrder:84, year:2018, season: 'Winter', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san ', altTitle:'からかい上手の高木さん', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1112369519815610368/nu7-t3KS.png' },
{ sortOrder:85, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tada-kun wa Koi wo Shinai ', altTitle:'多田くんは恋をしない', handle:'tadakoi_anime', imgURL:'https://pbs.twimg.com/profile_images/979661713669742592/P440J2-j.jpg' },
{ sortOrder:86, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Fumikiri Jikan ', altTitle:'踏切時間', handle:'fumikiri_anime', imgURL:'https://pbs.twimg.com/profile_images/967238700756230144/LL25XX7j.jpg' },
{ sortOrder:87, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Wotaku ni Koi wa Muzukashii ', altTitle:'ヲタクに恋は難しい', handle:'wotakoi_anime', imgURL:'https://pbs.twimg.com/profile_images/946550850020786176/c5SCH5n4.jpg' },
{ sortOrder:88, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Chio-chan no Tsuugakuro ', altTitle:'ちおちゃんの通学路', handle:'Chiochan_tv', imgURL:'https://pbs.twimg.com/profile_images/1031397413322289152/bDEUjD_5.jpg' },
{ sortOrder:89, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Asobi Asobase ', altTitle:'あそびあそばせ', handle:'asobiasobase_a', imgURL:'https://pbs.twimg.com/profile_images/956675821569163265/lTDOMpfm.jpg' },
{ sortOrder:90, year:2018, season: 'Summer', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1145367407931736065/73iF39yV.png' },
{ sortOrder:91, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsukumogami Kashimasu ', altTitle:'つくもがみ貸します', handle:'tsukumogami_tv', imgURL:'https://pbs.twimg.com/profile_images/1007425308939599873/lqWVfmWI.jpg' },
{ sortOrder:92, year:2018, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'BANANA FISH', altTitle:'', handle:'bananafish_tv', imgURL:'https://pbs.twimg.com/profile_images/922115202962751493/cO_HIANw.jpg' },
{ sortOrder:93, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Uchi no Maid ga Uzasugiru! ', altTitle:'うちのメイドがウザすぎる！', handle:'uzamaid_a', imgURL:'https://pbs.twimg.com/profile_images/1054700812411133952/_BYrHrby.jpg' },
{ sortOrder:94, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Gaikotsu Shoten\'in Honda-san ', altTitle:'ガイコツ書店員 本田さん', handle:'gai_honda', imgURL:'' },
{ sortOrder:95, year:2019, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Domestic na Kanojo ', altTitle:'ドメスティックな彼女', handle:'domekano_anime', imgURL:'https://pbs.twimg.com/profile_images/1017227499162558464/EhnROqJ4.jpg' },
{ sortOrder:96, year:2019, season: 'Winter', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg' },
{ sortOrder:97, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Midara na Ao-chan wa Benkyou ga Dekinai', altTitle:'みだらな青ちゃんは勉強ができない', handle:'aochan_anime', imgURL:'https://pbs.twimg.com/profile_images/1069773132867629057/cxgqUXNx.jpg' },
{ sortOrder:98, year:2019, season: 'Spring', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Season 3 ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1112731492734558208/dMMv3Vip.png' },
{ sortOrder:99, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Joshikausei ', altTitle:'女子かう生', handle:'joshikau_anime', imgURL:'https://pbs.twimg.com/profile_images/1087530080383848448/cePswUM_.jpg' },
{ sortOrder:100, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sewayaki Kitsune no Senko-san ', altTitle:'世話やきキツネの仙狐さん', handle:'sewayakisenko', imgURL:'https://pbs.twimg.com/profile_images/1069426820297056256/QOiBUxly.jpg' },
{ sortOrder:101, year:2019, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 Part.2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1051513792851398657/NHhP8E_7.jpg' },
{ sortOrder:102, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Araburu Kisetsu no Otome-domo yo. ', altTitle:'荒ぶる季節の乙女どもよ。', handle:'araotoproject', imgURL:'https://pbs.twimg.com/profile_images/1068437176390578176/cyanMkv2.jpg' },
{ sortOrder:103, year:2019, season: 'Summer', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san 2 ', altTitle:'からかい上手の高木さん２', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1112369519815610368/nu7-t3KS.png' },
{ sortOrder:104, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Joshikousei no Mudazukai ', altTitle:'女子高生の無駄づかい', handle:'jyoshimuda', imgURL:'https://pbs.twimg.com/profile_images/1147082271309963264/Zb8wBjrF.png' },
{ sortOrder:105, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houkago Saikoro Club ', altTitle:'放課後さいころ倶楽部', handle:'saikoro_club', imgURL:'https://pbs.twimg.com/profile_images/1126680950245445634/3gnEQ7_p.png' },
{ sortOrder:106, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Babylon ', altTitle:'バビロン', handle:'babylon_anime', imgURL:'https://pbs.twimg.com/profile_images/1196458113538199554/qzwOiPi5.jpg' },
{ sortOrder:107, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Hatena Illusion', altTitle:'はてな☆イリュージョン', handle:'hatena_anime', imgURL:'https://pbs.twimg.com/profile_images/1189449630188101632/Q9mwXAAL.jpg' },
{ sortOrder:108, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Jibaku Shounen Hanako-kun', altTitle:'地縛少年花子くん', handle:'hanakokun_info', imgURL:'https://pbs.twimg.com/profile_images/1245365315334103041/xqyY3x9k.png' },
{ sortOrder:109, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:'理系が恋に落ちたので証明してみた。', handle:'rikeigakoini', imgURL:'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg' },
{ sortOrder:110, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Kyokou Suiri', altTitle:'虚構推理', handle:'kyokou_suiri', imgURL:'https://pbs.twimg.com/profile_images/1115453678771523584/Vpeq5eJ1.png' },
{ sortOrder:111, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Kakushigoto', altTitle:'かくしごと', handle:'kakushigoto_pr', imgURL:'https://pbs.twimg.com/profile_images/1202602021670375424/UAwiY-ED.jpg' },
{ sortOrder:112, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yesterday wo Utatte', altTitle:'イエスタデイをうたって', handle:'anime_yesterday', imgURL:'https://pbs.twimg.com/profile_images/1219731464255758336/eEqosTW9.jpg' },
{ sortOrder:113, year:2020, season: 'Spring', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai?', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦？～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg' },

];

let isGroupBySeries = false;
let currentYear = 2020;
let currentSeason = 'Spring';
let seasons = ['','Winter','Spring','Summer','Autumn'];
let seriesArray = new Array();

generateAnimeList(false);
function generateAnimeList(isGroupBySeries) {
	//create series array if needed
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
	
	let animeTable = document.createElement('table');
	let animeTableBody = document.createElement('tbody');
	
	//generate table contents
	if(isGroupBySeries)
	{
		let animeTableHeader = document.createElement('tr');

		let animeTableHeaderRow = document.createElement('th');
		animeTableHeaderRow.innerText = 'Series Title';
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = 2013; y <= 2020; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
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
			animeTableContent.classList.add('row-title');
			animeTableContent.innerText = anime.seriesTitle;
			animeTableRow.appendChild(animeTableContent);
			
			animeTableBody.appendChild(animeTableRow);
						
			let remainder = anime.length;
			for(let y = 2013; y <= 2020; y++)
			{
				for(let s = 1; s <= 4; s++)
				{
					animeTableContent = document.createElement('td');
					animeTableContent.innerText = '';
					if(y == currentYear && seasons[s] == currentSeason && !animeTableContent.classList.contains('active-period'))
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
							tableSeries[rowNo].getElementsByTagName('td')[column].style.backgroundColor = 'white';
							tableSeries[rowNo].getElementsByTagName('td')[column].innerText = 'X';
							remainder--;
							
							let animeTableContentOverlay = document.createElement('span');
							animeTableContentOverlay.classList.add('show-overlay');
							animeTableContentOverlay.innerText = series.title + (series.altTitle == '' ? '' : '\n[' + series.altTitle + ']');
					
							if(series.imgURL != '')
							{
								let animeTableContentOverlayImageContainer = document.createElement('div');
								if(series.handle != '')
								{
									let animeTableContentOverlayImageLink = document.createElement('a');
									animeTableContentOverlayImageLink.href = 'https://twitter.com/' + series.handle;
									animeTableContentOverlayImageLink.setAttribute("target", "_blank")
									
										let animeTableContentOverlayImage = document.createElement('img');
										animeTableContentOverlayImage.src = series.imgURL;
										if(y*10+s >= 20174) animeTableContentOverlayImage.style.borderRadius = '50%';
												
										animeTableContentOverlayImageLink.appendChild(animeTableContentOverlayImage);
										
									animeTableContentOverlayImageContainer.appendChild(animeTableContentOverlayImageLink);
								}
																		
								animeTableContentOverlay.insertBefore(animeTableContentOverlayImageContainer, animeTableContentOverlay.childNodes[0]);
							}

							tableSeries[rowNo].getElementsByTagName('td')[column].appendChild(animeTableContentOverlay);

							break;
						}
					}
				}
			}
		}
		
	}
	else
	{
		let animeTableHeader = document.createElement('tr');

		let animeTableHeaderRow = document.createElement('th');
		animeTableHeaderRow.innerText = 'Anime Title';
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = 2013; y <= 2020; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}

		animeTableBody.appendChild(animeTableHeader);
		
		for(let anime of customArray)
		{
			if(anime.length == 0) continue;

			let animeTableRow = document.createElement('tr');
			animeTableContent = document.createElement('td');
			animeTableContent.classList.add('row-title');
			
				// let animeTitleLink = document.createElement('a');
				// animeTitleLink.href = 'https://www.twitter.com/' + anime.handle;
				
					let animeTitleContent = document.createElement('span');
					animeTitleContent.innerText = anime.title;
					// animeTitleLink.appendChild(animeTitleContent);
					
				animeTableContent.appendChild(animeTitleContent);
				
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
						animeTableContent.innerText = 'X';
						remainder--;
					}
					else
						animeTableContent.innerText = '';
					if(y == currentYear && seasons[s] == currentSeason && !animeTableContent.classList.contains('active-period'))
						animeTableContent.style.backgroundColor = '#444444'; //current season
					
					let animeTableContentOverlay = document.createElement('span');
					animeTableContentOverlay.classList.add('show-overlay');
					animeTableContentOverlay.innerText = anime.title + (anime.altTitle == '' ? '' : '\n[' + anime.altTitle + ']');
					
					if(anime.imgURL != '')
					{
						let animeTableContentOverlayImageContainer = document.createElement('div');
						if(anime.handle != '')
						{
							let animeTableContentOverlayImageLink = document.createElement('a');
							animeTableContentOverlayImageLink.href = 'https://twitter.com/' + anime.handle;
							animeTableContentOverlayImageLink.setAttribute("target", "_blank")
							
								let animeTableContentOverlayImage = document.createElement('img');
								animeTableContentOverlayImage.src = anime.imgURL;
								if(y*10+s >= 20174) animeTableContentOverlayImage.style.borderRadius = '50%';
										
								animeTableContentOverlayImageLink.appendChild(animeTableContentOverlayImage);
								
							animeTableContentOverlayImageContainer.appendChild(animeTableContentOverlayImageLink);
						}
							
						animeTableContentOverlay.insertBefore(animeTableContentOverlayImageContainer, animeTableContentOverlay.childNodes[0]);
					}
					
					animeTableContent.appendChild(animeTableContentOverlay);
					
					animeTableRow.appendChild(animeTableContent);
				}
			}
		}
	}
	
	animeTable.appendChild(animeTableBody);
	document.getElementById('anime-list').innerHTML = '';
	document.getElementById('anime-list').appendChild(animeTable);
	enableSelectTitle();
	fixOverlayPosition();
	addImageNotFoundHide();
}

//[2] generate labels
//add event for radio buttons
document.getElementsByClassName('selection')[1].addEventListener('click', function() { inverseRadio(1); });
document.getElementsByClassName('selection')[0].addEventListener('click', function() { inverseRadio(0); });
function inverseRadio(val) {
		document.getElementsByClassName('selection')[1].checked = val==1 ? true : false;
		document.getElementsByClassName('selection')[0].checked = val==0 ? true : false;
		isGroupBySeries = document.getElementsByClassName('selection')[1].checked;
		generateAnimeList(isGroupBySeries);
}

//[3] generate HTML based on array
//Every row in the form of: title, table of boxes where lit
//renderSeasonsArray();
/* function renderSeasonsArray() {
	if(!isGroupBySeries)
	{
		let animeTable = document.createElement('table');
		let animeTableBody = document.createElement('tbody');
		let animeTableHeader = document.createElement('tr');

		let animeTableHeaderRow = document.createElement('th');
		animeTableHeaderRow.innerText = 'Anime Title';
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = 2013; y <= 2020; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}

		animeTableBody.appendChild(animeTableHeader);
		
		for(let anime of customArray)
		{
			if(anime.length == 0) continue;

			let animeTableRow = document.createElement('tr');
			animeTableContent = document.createElement('td');
			animeTableContent.classList.add('row-title');
			
				// let animeTitleLink = document.createElement('a');
				// animeTitleLink.href = 'https://www.twitter.com/' + anime.handle;
				
					let animeTitleContent = document.createElement('span');
					animeTitleContent.innerText = anime.title;
					// animeTitleLink.appendChild(animeTitleContent);
					
				animeTableContent.appendChild(animeTitleContent);
				
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
						animeTableContent.innerText = 'X';
						remainder--;
					}
					else
						animeTableContent.innerText = '';
					if(y == currentYear && seasons[s] == currentSeason && !animeTableContent.classList.contains('active-period'))
						animeTableContent.style.backgroundColor = '#444444'; //current season
					
					let animeTableContentOverlay = document.createElement('span');
					animeTableContentOverlay.classList.add('show-overlay');
					animeTableContentOverlay.innerText = anime.title + (anime.altTitle == '' ? '' : '\n[' + anime.altTitle + ']');
					
					if(anime.imgURL != '')
					{
						let animeTableContentOverlayImageContainer = document.createElement('div');
						if(anime.handle != '')
						{
							let animeTableContentOverlayImageLink = document.createElement('a');
							animeTableContentOverlayImageLink.href = 'https://twitter.com/' + anime.handle;
							animeTableContentOverlayImageLink.setAttribute("target", "_blank")
							
								let animeTableContentOverlayImage = document.createElement('img');
								animeTableContentOverlayImage.src = anime.imgURL;
								if(y*10+s >= 20174) animeTableContentOverlayImage.style.borderRadius = '50%';
										
								animeTableContentOverlayImageLink.appendChild(animeTableContentOverlayImage);
								
							animeTableContentOverlayImageContainer.appendChild(animeTableContentOverlayImageLink);
						}
							
						animeTableContentOverlay.insertBefore(animeTableContentOverlayImageContainer, animeTableContentOverlay.childNodes[0]);
					}
					
					animeTableContent.appendChild(animeTableContentOverlay);
					
					animeTableRow.appendChild(animeTableContent);
				}
			}
		}
		animeTable.appendChild(animeTableBody);
		document.getElementById('anime-list').innerHTML = '';
		document.getElementById('anime-list').appendChild(animeTable);
		enableSelectTitle();
		fixOverlayPosition();
		addImageNotFoundHide();
	}
}
 */
 /* function generateSeriesArray() {
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
		animeTableHeaderRow.innerText = 'Series Title';
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = 2013; y <= 2020; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
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
			animeTableContent.classList.add('row-title');
			animeTableContent.innerText = anime.seriesTitle;
			animeTableRow.appendChild(animeTableContent);
			
			animeTableBody.appendChild(animeTableRow);
						
			let remainder = anime.length;
			for(let y = 2013; y <= 2020; y++)
			{
				for(let s = 1; s <= 4; s++)
				{
					animeTableContent = document.createElement('td');
					animeTableContent.innerText = '';
					if(y == currentYear && seasons[s] == currentSeason && !animeTableContent.classList.contains('active-period'))
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
							tableSeries[rowNo].getElementsByTagName('td')[column].style.backgroundColor = 'white';
							tableSeries[rowNo].getElementsByTagName('td')[column].innerText = 'X';
							remainder--;
							
							let animeTableContentOverlay = document.createElement('span');
							animeTableContentOverlay.classList.add('show-overlay');
							animeTableContentOverlay.innerText = series.title + (series.altTitle == '' ? '' : '\n[' + series.altTitle + ']');
					
							if(series.imgURL != '')
							{
								let animeTableContentOverlayImageContainer = document.createElement('div');
								if(series.handle != '')
								{
									let animeTableContentOverlayImageLink = document.createElement('a');
									animeTableContentOverlayImageLink.href = 'https://twitter.com/' + series.handle;
									animeTableContentOverlayImageLink.setAttribute("target", "_blank")
									
										let animeTableContentOverlayImage = document.createElement('img');
										animeTableContentOverlayImage.src = series.imgURL;
										if(y*10+s >= 20174) animeTableContentOverlayImage.style.borderRadius = '50%';
												
										animeTableContentOverlayImageLink.appendChild(animeTableContentOverlayImage);
										
									animeTableContentOverlayImageContainer.appendChild(animeTableContentOverlayImageLink);
								}
																		
								animeTableContentOverlay.insertBefore(animeTableContentOverlayImageContainer, animeTableContentOverlay.childNodes[0]);
							}

							tableSeries[rowNo].getElementsByTagName('td')[column].appendChild(animeTableContentOverlay);

							break;
						}
					}
				}
			}
		}
		
		animeTable.appendChild(animeTableBody);
		document.getElementById('anime-list').innerHTML = '';
		document.getElementById('anime-list').appendChild(animeTable);
		enableSelectTitle();
		fixOverlayPosition();
		addImageNotFoundHide();
	}
}
 */


//[4] after adjustments

//fix table height such that window scroll is disabled
let h3height = document.getElementsByTagName('h3')[0].getBoundingClientRect().height;
let headerHeight = document.getElementById('header').offsetHeight;
let footerHeight = document.getElementById('footer').offsetHeight;
document.getElementById('anime-list').style.height = (window.innerHeight - h3height - headerHeight - footerHeight - 0.2*window.innerHeight) + 'px';	

//click season/series to scroll to timeline first box
function enableSelectTitle() {
	let windowWidth = document.getElementById('anime-list').getBoundingClientRect().width;
	for(let s = 1; s < document.getElementsByTagName('tr').length; s++)
	{
		document.getElementsByTagName('tr')[s].getElementsByTagName('td')[0].addEventListener('click', function() {
			for(let c = 1; c < document.getElementsByTagName('tr')[s].getElementsByTagName('td').length; c++)
			{
				if(document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].innerText == 'X')
				{
					document.getElementById('anime-list').scrollLeft += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().x-(windowWidth < 800 ? 0.75*window.innerWidth : 0.5*window.innerWidth);
					document.getElementById('anime-list').scrollTop += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().y-(windowWidth < 800 ? 135 : 155);
					console.log(document.getElementById('anime-list').scrollLeft);
					console.log(document.getElementById('anime-list').scrollTop);
					break;
				}
			}			
		});
	}
}

//display overlay on each active period hover
function fixOverlayPosition() {
	for(let s = 0; s < document.getElementsByClassName('active-period').length; s++)
	{
		document.getElementsByClassName('active-period')[s].addEventListener('mouseover', function() {
			let x = this.getBoundingClientRect().x;			
			let y = this.getBoundingClientRect().y;
			let w = this.getElementsByClassName('show-overlay')[0].getBoundingClientRect().width;
			this.getElementsByClassName('show-overlay')[0].style.left = x + 'px';
			if(x + w > window.innerWidth)
				this.getElementsByClassName('show-overlay')[0].style.left = (x - (x+w-window.innerWidth)) + 'px';
			this.getElementsByClassName('show-overlay')[0].style.top = y + 'px';
		});
	}
}

//image on error, hide
function addImageNotFoundHide() {
	for(let i = 0; i < document.getElementsByTagName('img').length; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('error', function() {
			this.style.display = 'none';
		});
	}
}