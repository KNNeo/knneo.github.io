let showsArray = [

{ sortOrder:1, year:2009, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kara no Kyoukai', altTitle:'空の境界', handle:'', imgURL:'' },
{ sortOrder:2, year:2011, season: '', length:0, seriesTitle: '', type:'Movie', title:'Cat Shit One – THE ANIMATED SERIES', altTitle:'', handle:'', imgURL:'' },
{ sortOrder:3, year:2011, season: '', length:0, seriesTitle: '', type:'Movie', title:'Koi*Sento', altTitle:'コイ☆セント', handle:'', imgURL:'' },
{ sortOrder:4, year:2013, season: '', length:0, seriesTitle: '', type:'Movie', title:'Hal', altTitle:'ハル', handle:'', imgURL:'' },
{ sortOrder:5, year:2013, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kotonoha no Niwa', altTitle:'言の葉の庭', handle:'', imgURL:'' },
{ sortOrder:6, year:2017, season: '', length:0, seriesTitle: '', type:'Movie', title:'Yoru wa Mijikashi, Arukeyo Otome', altTitle:'夜は短し歩けよ乙女', handle:'otome_movie', imgURL:'https://pbs.twimg.com/profile_images/824234081672007680/dRIzESlX.jpg' },
{ sortOrder:7, year:2019, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kimi no Suizou wo Tabetai', altTitle:'君の膵臓をたべたい', handle:'kimisui_anime', imgURL:'https://pbs.twimg.com/profile_images/952554383174021121/YIXzh_IK.jpg' },
{ sortOrder:8, year:2020, season: '', length:0, seriesTitle: '', type:'Movie', title:'Nakitai Watashi wa Neko wo Kaburu', altTitle:'泣きたい私は猫をかぶる', handle:'nakineko_movie', imgURL:'https://pbs.twimg.com/profile_images/1221927862279667712/X9VsQDhl.jpg' },
{ sortOrder:9, year:2021, season: '', length:0, seriesTitle: '', type:'Movie', title:'Eden', altTitle:'エデン', handle:'', imgURL:'' },
{ sortOrder:10, year:2022, season: '', length:0, seriesTitle: '', type:'Movie', title:'Josee to Tora to Sakana-tachi', altTitle:'ジョゼと虎と魚たち', handle:'joseetora_movie', imgURL:'https://pbs.twimg.com/profile_images/1201574758883741696/Bi73xBlm.jpg' },
{ sortOrder:1, year:2008, season: '', length:16, seriesTitle: '', type:'TV', title:'BLEACH', altTitle:'ブリーチー', handle:'BLEACHanimation', imgURL:'' },
{ sortOrder:2, year:2008, season: '', length:0, seriesTitle: '', type:'TV', title:'Love Hina', altTitle:'ラブ　ひな', handle:'', imgURL:'' },
{ sortOrder:3, year:2008, season: '', length:0, seriesTitle: '', type:'TV', title:'Kekkaishi', altTitle:'結界師', handle:'', imgURL:'' },
{ sortOrder:4, year:2008, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Toradora!', altTitle:'とらドラ！', handle:'', imgURL:'' },
{ sortOrder:5, year:2008, season: 'Autumn', length:2, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji', altTitle:'黒執事', handle:'kuroshitsuji2', imgURL:'' },
{ sortOrder:6, year:2009, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Hatsukoi Limited.', altTitle:'初恋限定。', handle:'', imgURL:'' },
{ sortOrder:7, year:2009, season: 'Spring', length:1, seriesTitle: 'K-ON!', type:'TV', title:'K-ON!', altTitle:'けいおん！', handle:'', imgURL:'' },
{ sortOrder:8, year:2009, season: '', length:0, seriesTitle: '', type:'TV', title:'Nagarasete Airantou', altTitle:'ながされて愛蘭島', handle:'', imgURL:'' },
{ sortOrder:9, year:2009, season: '', length:0, seriesTitle: '', type:'TV', title:'Kannagi', altTitle:'かんなぎ', handle:'', imgURL:'' },
{ sortOrder:10, year:2009, season: '', length:0, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana', altTitle:'灼眼のシャナ', handle:'', imgURL:'' },
{ sortOrder:11, year:2009, season: '', length:0, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana Second', altTitle:'灼眼のシャナII', handle:'', imgURL:'' },
{ sortOrder:12, year:2010, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'So.Ra.No.Wo.To', altTitle:'ソ．ラ．ノ．ヲ．ト', handle:'', imgURL:'' },
{ sortOrder:13, year:2010, season: 'Spring', length:2, seriesTitle: 'K-ON!', type:'TV', title:'K-ON!!', altTitle:'けいおん！！', handle:'', imgURL:'' },
{ sortOrder:14, year:2010, season: 'Spring', length:1, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg' },
{ sortOrder:15, year:2010, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yojouhan Shinwa Taikei', altTitle:'四畳半神話大系', handle:'', imgURL:'' },
{ sortOrder:16, year:2010, season: 'Summer', length:1, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji II', altTitle:'黒執事II', handle:'kuroshitsuji2', imgURL:'https://pbs.twimg.com/profile_images/459199935506677760/RfFVR915.png' },
{ sortOrder:17, year:2010, season: 'Summer', length:1, seriesTitle: 'Seitokai Yakuindomo', type:'TV', title:'Seitokai Yakuindomo', altTitle:'生徒会役員共', handle:'seitokai0428', imgURL:'https://pbs.twimg.com/profile_images/1202785307428417536/k0CYX9kO.jpg' },
{ sortOrder:18, year:2010, season: 'Autumn', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai', altTitle:'俺の妹がこんなに可愛いわけがない', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg' },
{ sortOrder:19, year:2011, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Fractale', altTitle:'フラクタル', handle:'fractale_system', imgURL:'https://pbs.twimg.com/profile_images/1185917529/fractalesystem.jpg' },
{ sortOrder:20, year:2011, season: '', length:0, seriesTitle: '', type:'TV', title:'Bartender', altTitle:'バーテンダー', handle:'', imgURL:'' },
{ sortOrder:21, year:2011, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'[C] - CONTROL: THE MONEY OF SOUL AND POSSIBILITY', altTitle:'', handle:'', imgURL:'' },
{ sortOrder:22, year:2011, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'A Channel', altTitle:'Aチャンネル', handle:'A_CH_anime', imgURL:'https://pbs.twimg.com/profile_images/1267528750/a_ch_logo_reasonably_small.gif' },
{ sortOrder:23, year:2011, season: 'Summer', length:2, seriesTitle: '', type:'TV', title:'Nichijou', altTitle:'日常', handle:'shinonome_lab', imgURL:'https://pbs.twimg.com/profile_images/1294157199/nichijou0.jpg' },
{ sortOrder:24, year:2011, season: 'Autumn', length:0, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING\'!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg' },
{ sortOrder:25, year:2011, season: 'Autumn', length:2, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana Final', altTitle:'灼眼のシャナIII -FINAL-', handle:'', imgURL:'' },
{ sortOrder:26, year:2012, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sakamichi no Apollon', altTitle:'坂道のアポロン', handle:'apollon_anime', imgURL:'https://pbs.twimg.com/profile_images/1832775581/kaoru.jpg' },
{ sortOrder:27, year:2012, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Natsuiro Kiseki ', altTitle:'夏色キセキ', handle:'', imgURL:'' },
{ sortOrder:28, year:2012, season: 'Spring', length:2, seriesTitle: '', type:'TV', title:'Hyouka ', altTitle:'氷菓', handle:'', imgURL:'' },
{ sortOrder:29, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Binbougami ga! ', altTitle:'貧乏神が！', handle:'binbogamiga', imgURL:'https://pbs.twimg.com/profile_images/2276698026/lwnbo23caaa8j8mlzwcu.png' },
{ sortOrder:30, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kokoro Connect ', altTitle:'ココロコネクト', handle:'kokoroco_anime', imgURL:'https://pbs.twimg.com/profile_images/2309214867/o2i5vtew5lijp697yu7c.png' },
{ sortOrder:31, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'TARI TARI', altTitle:'', handle:'taritarianime', imgURL:'https://pbs.twimg.com/profile_images/877893755419975680/_bhhuzqS.jpg' },
{ sortOrder:32, year:2012, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Tonari no Kaibutsu-kun ', altTitle:'となりの怪物くん', handle:'tk_anime', imgURL:'https://pbs.twimg.com/profile_images/2427248339/jr2693xm66xypq2bn20d_reasonably_small.gif' },
{ sortOrder:33, year:2013, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'RDG: Red Data Girl', altTitle:'', handle:'', imgURL:'' },
{ sortOrder:34, year:2013, season: 'Spring', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai.', altTitle:'俺の妹がこんなに可愛いわけがない。', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg' },
{ sortOrder:35, year:2013, season: '', length:0, seriesTitle: '', type:'TV', title:'Acchi Kocchi ', altTitle:'あっちこっち', handle:'ackc_anime', imgURL:'https://pbs.twimg.com/profile_images/537215428385202177/TM13Pwi7.jpeg' },
{ sortOrder:36, year:2013, season: 'Spring', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg' },
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
{ sortOrder:64, year:2016, season: 'Spring', length:2, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg' },
{ sortOrder:65, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kono Bijutsubu ni wa Mondai ga Aru!', altTitle:'この美術部には問題がある！', handle:'konobi_anime', imgURL:'https://pbs.twimg.com/profile_images/708865198296162304/QRsNybbW.jpg' },
{ sortOrder:66, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Time Travel Shoujo', altTitle:'タイムトラベル少女～マリ・ワカと8人の科学者たち～', handle:'mariwaka_anime', imgURL:'https://pbs.twimg.com/profile_images/737133362410754049/mJn-rdrk.jpg' },
{ sortOrder:67, year:2016, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'WWW.WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg' },
{ sortOrder:68, year:2016, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://pbs.twimg.com/profile_images/836077469446754304/dsaXnj0l.jpg' },
{ sortOrder:69, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'ACCA 13-ku Kansatsu-ka ', altTitle:'ACCA13区監察課', handle:'ACCA_anime', imgURL:'https://pbs.twimg.com/profile_images/767598431820914688/xSqk1nJu.jpg' },
{ sortOrder:70, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Demi-chan wa Kataritai ', altTitle:'亜人ちゃんは語りたい', handle:'demichan_anime', imgURL:'https://pbs.twimg.com/profile_images/772024004647407617/JmQfO1Oe.jpg' },
{ sortOrder:71, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tsuki ga Kirei ', altTitle:'月がきれい', handle:'tsukigakirei_tv', imgURL:'https://pbs.twimg.com/profile_images/832160318113488896/2B4ipy5I.jpg' },
{ sortOrder:72, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Eromanga-sensei ', altTitle:'エロマンガ先生', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg' },
{ sortOrder:73, year:2017, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg' },
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
{ sortOrder:90, year:2018, season: 'Summer', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg' },
{ sortOrder:91, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsukumogami Kashimasu ', altTitle:'つくもがみ貸します', handle:'tsukumogami_tv', imgURL:'https://pbs.twimg.com/profile_images/1007425308939599873/lqWVfmWI.jpg' },
{ sortOrder:92, year:2018, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'BANANA FISH', altTitle:'', handle:'bananafish_tv', imgURL:'https://pbs.twimg.com/profile_images/922115202962751493/cO_HIANw.jpg' },
{ sortOrder:93, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Uchi no Maid ga Uzasugiru! ', altTitle:'うちのメイドがウザすぎる！', handle:'uzamaid_a', imgURL:'https://pbs.twimg.com/profile_images/1054700812411133952/_BYrHrby.jpg' },
{ sortOrder:94, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Gaikotsu Shoten\'in Honda-san ', altTitle:'ガイコツ書店員 本田さん', handle:'gai_honda', imgURL:'' },
{ sortOrder:95, year:2019, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Domestic na Kanojo ', altTitle:'ドメスティックな彼女', handle:'domekano_anime', imgURL:'https://pbs.twimg.com/profile_images/1017227499162558464/EhnROqJ4.jpg' },
{ sortOrder:96, year:2019, season: 'Winter', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg' },
{ sortOrder:97, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Midara na Ao-chan wa Benkyou ga Dekinai', altTitle:'みだらな青ちゃんは勉強ができない', handle:'aochan_anime', imgURL:'https://pbs.twimg.com/profile_images/1069773132867629057/cxgqUXNx.jpg' },
{ sortOrder:98, year:2019, season: 'Spring', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Season 3 ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg' },
{ sortOrder:99, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Joshikausei ', altTitle:'女子かう生', handle:'joshikau_anime', imgURL:'https://pbs.twimg.com/profile_images/1087530080383848448/cePswUM_.jpg' },
{ sortOrder:100, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sewayaki Kitsune no Senko-san ', altTitle:'世話やきキツネの仙狐さん', handle:'sewayakisenko', imgURL:'https://pbs.twimg.com/profile_images/1069426820297056256/QOiBUxly.jpg' },
{ sortOrder:101, year:2019, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 Part.2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1051513792851398657/NHhP8E_7.jpg' },
{ sortOrder:102, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Araburu Kisetsu no Otome-domo yo. ', altTitle:'荒ぶる季節の乙女どもよ。', handle:'araotoproject', imgURL:'https://pbs.twimg.com/profile_images/1280458570878738432/FuX3aQoL.jpg' },
{ sortOrder:103, year:2019, season: 'Summer', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san 2 ', altTitle:'からかい上手の高木さん２', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1112369519815610368/nu7-t3KS.png' },
{ sortOrder:104, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Joshikousei no Mudazukai ', altTitle:'女子高生の無駄づかい', handle:'jyoshimuda', imgURL:'https://pbs.twimg.com/profile_images/1147082271309963264/Zb8wBjrF.png' },
{ sortOrder:105, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houkago Saikoro Club ', altTitle:'放課後さいころ倶楽部', handle:'saikoro_club', imgURL:'https://pbs.twimg.com/profile_images/1126680950245445634/3gnEQ7_p.png' },
{ sortOrder:106, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Babylon ', altTitle:'バビロン', handle:'babylon_anime', imgURL:'https://pbs.twimg.com/profile_images/1196458113538199554/qzwOiPi5.jpg' },
{ sortOrder:107, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Hatena Illusion', altTitle:'はてな☆イリュージョン', handle:'hatena_anime', imgURL:'https://pbs.twimg.com/profile_images/1189449630188101632/Q9mwXAAL.jpg' },
{ sortOrder:108, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Jibaku Shounen Hanako-kun', altTitle:'地縛少年花子くん', handle:'hanakokun_info', imgURL:'https://pbs.twimg.com/profile_images/1245365315334103041/xqyY3x9k.png' },
{ sortOrder:109, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:'理系が恋に落ちたので証明してみた。', handle:'rikeigakoini', imgURL:'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg' },
{ sortOrder:110, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Kyokou Suiri', altTitle:'虚構推理', handle:'kyokou_suiri', imgURL:'https://pbs.twimg.com/profile_images/1115453678771523584/Vpeq5eJ1.png' },
{ sortOrder:111, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Kakushigoto', altTitle:'かくしごと', handle:'kakushigoto_pr', imgURL:'https://pbs.twimg.com/profile_images/1392857421580693507/JAHZS0bW.jpg' },
{ sortOrder:112, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yesterday wo Utatte', altTitle:'イエスタデイをうたって', handle:'anime_yesterday', imgURL:'https://pbs.twimg.com/profile_images/1219731464255758336/eEqosTW9.jpg' },
{ sortOrder:113, year:2020, season: 'Spring', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai?', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦？～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg' },
{ sortOrder:114, year:2020, season: 'Summer', length:2, seriesTitle: '', type:'TV', title:'GREAT PRETENDER', altTitle:'', handle:'GrePre_anime', imgURL:'https://pbs.twimg.com/profile_images/1220648780011167745/QMKboWCS.jpg' },
{ sortOrder:115, year:2020, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Uzaki-chan wa Asobitai!', altTitle:'宇崎ちゃんは遊びたい！', handle:'uzakichan_asobi', imgURL:'https://pbs.twimg.com/profile_images/1147099341858824192/pL6QoWt7.png' },
{ sortOrder:116, year:2020, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kanojo, Okarishimasu', altTitle:'彼女、お借りします', handle:'kanokari_anime', imgURL:'https://pbs.twimg.com/profile_images/1264535167755931648/AUajKJKz.jpg' },
{ sortOrder:117, year:2020, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Tonikaku Kawaii', altTitle:'トニカクカワイイ', handle:'tonikawa_anime', imgURL:'https://pbs.twimg.com/profile_images/1289486194414256128/8N9U_U-A.jpg' },
{ sortOrder:118, year:2020, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Majou no Tabitabi', altTitle:'魔女の旅々', handle:'majotabi_PR', imgURL:'https://pbs.twimg.com/profile_images/1185540696037421056/njCjSwao.png' },
{ sortOrder:119, year:2020, season: 'Autumn', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin The Final Season', altTitle:'進撃の巨人 The Final Season', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg' },
{ sortOrder:120, year:2021, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Horimiya', altTitle:'ホリミヤ', handle:'horimiya_anime', imgURL:'https://pbs.twimg.com/profile_images/1306608160363261955/m8MflVId.png' },
{ sortOrder:121, year:2021, season: 'Winter', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Wan!', altTitle:'文豪ストレイドッグス わん！', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg' },
{ sortOrder:122, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Koi to Yobu ni wa Kimochi Warui', altTitle:'恋と呼ぶには気持ち悪い', handle:'koikimo_anime', imgURL:'https://pbs.twimg.com/profile_images/1311825458665644032/qQdVyDYR.jpg' },
{ sortOrder:123, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Hige wo Soru. Soshite Joshikousei wo Hirou.', altTitle:'ひげを剃る。そして女子高生を拾う。', handle:'higehiro_anime', imgURL:'https://pbs.twimg.com/profile_images/1311599822730715141/l39MahWA.jpg' },
{ sortOrder:124, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Osananajimi ga Zettai ni Makenai Love Comedy', altTitle:'幼なじみが絶対に負けないラブコメ', handle:'osamake_project', imgURL:'https://pbs.twimg.com/profile_images/1312352077423636482/WoxK7ZKO.jpg' },
{ sortOrder:125, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kanojo mo Kanojo', altTitle:'カノジョも彼女', handle:'kanokano_anime', imgURL:'https://pbs.twimg.com/profile_images/1378523649842454529/Iltf_L5Y.jpg' },
{ sortOrder:126, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Shinigami Bocchan to Kuro Maid', altTitle:'死神坊ちゃんと黒メイド', handle:'bocchan_anime', imgURL:'https://pbs.twimg.com/profile_images/1377637066184351750/EDzqxnRR_400x400.jpg' },
{ sortOrder:127, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Sonny Boy', altTitle:'', handle:'sonnyboy_anime', imgURL:'https://pbs.twimg.com/profile_images/1415738208835407872/qdHMoMo3.jpg' },
{ sortOrder:128, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tantei wa Mou, Shindeiru.', altTitle:'探偵はもう、死んでいる。', handle:'tanteiwamou_', imgURL:'https://pbs.twimg.com/profile_images/1245369835896229889/JDG3Y_Wo.png' },
{ sortOrder:129, year:2021, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Komi-san wa, Komyushou Desu.', altTitle:'古見さんは、コミュ症です。', handle:'comisanvote', imgURL:'https://pbs.twimg.com/profile_images/1383659174643470342/CllYIDt4.jpg' },
{ sortOrder:130, year:2021, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Taishou Otome Otogibanashi', altTitle:'大正オトメ御伽話', handle:'otome_otogi', imgURL:'https://pbs.twimg.com/profile_images/1430472102310596612/2GvhVjP-.jpg' },
{ sortOrder:131, year:2021, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Senpai ga Uzai Kouhai no Hanashi', altTitle:'先輩がうざい後輩の話', handle:'uzai_anime', imgURL:'https://pbs.twimg.com/profile_images/1425399770781130753/aE3OW1Lt.jpg' },
{ sortOrder:132, year:2022, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Karakai Jouzu no Takagi-san 3', altTitle:'からかい上手の高木さん３', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1468958582213283841/vvU-lWWO.jpg' },
{ sortOrder:133, year:2022, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Sono Bisque Doll wa Koi wo Suru', altTitle:'その着せ替え人形は恋をする', handle:'kisekoi_anime', imgURL:'https://pbs.twimg.com/profile_images/1448810796130004993/nlkBB4Ph.png' },
{ sortOrder:134, year:2022, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Shingeki no Kyojin The Final Season Part 2', altTitle:'進撃の巨人 The Final Season', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1459830616351178757/IGExRnNj.jpg' },



];

let currentYear = 2022;
let currentSeason = 'Winter';
window.addEventListener('load', startup);

function startup() {
	generateAnimeList();
	addImagesError();
	// document.getElementById("showAll").click();
}

function generateAnimeList() {
	document.getElementById('anime-list').innerHTML = '';
	
	let currentList = showsArray.filter(s => s.type == 'TV' && s.year == currentYear && s.season == currentSeason);
	document.getElementById('anime-list').appendChild(generateAnimeCurrent(currentList));
	
	let archiveList = showsArray.filter(s => s.type == 'TV' && (s.year != currentYear || s.season != currentSeason)).sort((a, b) => b.sortOrder - a.sortOrder);
	document.getElementById('anime-list').appendChild(generateAnimeArchive(archiveList));
	
	let moviesList = showsArray.filter(s => s.type == 'Movie');
	document.getElementById('anime-list').appendChild(generateOVAMovies(moviesList));
	
	let calendarBlock = generateAnimeCalendar(showsArray.filter(s => s.type == 'TV' && s.year >= 2008 && s.season.length > 0));
	document.getElementById('anime-list').appendChild(calendarBlock);
}

function generateAnimeCalendar(list) {	
	let calendarBlock = document.createElement('div');
	
	let block = document.createElement('h4');
	block.classList.add('tr_bq');
	// block.style.gridColumn = '1 / span 5';
	
		let title = document.createElement('span');
		title.classList.add('category-title');
		title.innerText = 'Directory';
	
	block.appendChild(title);
	
		let filter = document.createElement('input');
		filter.style.marginLeft = '10px';
		filter.placeholder = 'Filter show name..';
		filter.value = window['filter'] || '';
		filter.addEventListener('input', function() {
			generateCalendarBox(showsArray.filter(s => s.type == 'TV' && s.year >= 2008 && s.season.length > 0 && s.title.toLowerCase().includes(this.value.toLowerCase())));
		});
		
	block.appendChild(filter);
	
	calendarBlock.appendChild(block);
	
	calendarBlock.appendChild(generateCalendarBox(list));
	
	return calendarBlock;
}

function generateCalendarBox(list) {
	let calendarDiv = document.getElementById('calendar');
	if(document.getElementById('calendar') == null)
	{
		calendarDiv = document.createElement('div');
		calendarDiv.id = 'calendar';
		calendarDiv.classList.add('calendar');
		calendarDiv.style.gridTemplateColumns = 'auto auto auto auto auto';	
	}
	else
	{
		calendarDiv.innerHTML = '';
	}
	
	//headers
	let seasons = [
		{
			title:'Winter',
			altTitle:''
		},
		{
			title:'Spring',
			altTitle:''
		},
		{
			title:'Summer',
			altTitle:''
		},
		{
			title:'Autumn',
			altTitle:''
		},
	];
	
	let z = document.createElement('div');
	z.classList.add('calendar-header');
	z.innerText = 'Year';
	calendarDiv.appendChild(z);
	
	for(let season of seasons)
	{
		let s = document.createElement('div');
		s.classList.add('calendar-header');
		s.innerText = season.title;
		calendarDiv.appendChild(s);
	}
	
	//cells
	for(let y = 2008; y <= 2022; y++)
	{
		let t = document.createElement('div');
		t.classList.add('year');
		t.style.paddingRight = '3px';
		t.style.gridRow = (2+((y-2008)*5)) + '/ span 5';
		t.innerText = y;
		calendarDiv.appendChild(t);
		
		let yearShows = {};
		yearShows['Winter'] = list.filter(l => l.year == y && l.season == 'Winter');
		yearShows['Spring'] = list.filter(l => l.year == y && l.season == 'Spring');
		yearShows['Summer'] = list.filter(l => l.year == y && l.season == 'Summer');
		yearShows['Autumn'] = list.filter(l => l.year == y && l.season == 'Autumn');
		
		for(let s of seasons)
		{
			while(yearShows[s.title].length < 5)
			{
				yearShows[s.title].push({ year: y, season: s.title, title: '' });
			}
		}
		// console.log(yearShows);
		
		for(let count = 0; count < 5; count++)
		{
			for(let s of seasons)
			{
				let show = yearShows[s.title][count];
				// console.log(show);
				
				let i = document.createElement('div');
				if(show.title) i.classList.add('highlight');
				if(show.title) i.style.border = '1px solid';
				i.style.margin = '1px';
				i.style.padding = '2px';
				i.innerText = show.title;
				calendarDiv.appendChild(i);
			}
		}
		
	}
	
	//content
	for(let item of list)
	{
		let i = document.createElement('div');
		calendarDiv.appendChild(i);
	}
	
	return calendarDiv;
}

function generateAnimeArchive(filterList) {
	let id = 'archiveList';
	let title = 'TV Series';
	return generateList(id, title, filterList);	
}

function generateAnimeCurrent(filterList) {
	let id = 'currentList';
	let title = 'Currently Watching (As of '  + currentSeason + ' ' + currentYear + ')';
	return generateList(id, title, filterList);	
}

function generateOVAMovies(filterList) {
	let id = 'movieList';
	let title = 'Standalone OVA/Movies';
	return generateList(id, title, filterList);
}

function generateList(categoryId, categoryTitle, filterList) {
	let currentList = document.createElement('div');
	currentList.id = categoryId;
	currentList.classList.add('category');
	
		let block = document.createElement('h4');
		block.classList.add('tr_bq');
		
			let title = document.createElement('span');
			title.classList.add('category-title');
			title.innerText = categoryTitle;
		
		block.appendChild(title);
		
	currentList.appendChild(block);
	
	for(let item of filterList)
	{
		currentList.appendChild(generateAnimeRow(item));
	}
	
	return currentList;
}

function generateAnimeRow(item) {
	let row = document.createElement('div');
	row.classList.add('new-anime-row');
	
	if(item.handle && item.handle.length > 0)
	{
		let handler = document.createElement('a');
		handler.href = 'https://twitter.com/' + item.handle;
		handler.title = '@' + item.handle;
		handler.setAttribute('target', '_blank');
		
		if(item.imgURL && item.imgURL.length > 0)
		{
			let img = document.createElement('img');
			img.src = 'https://knneo.github.io/resources/spacer.gif';
			img.alt = item.imgURL;
			if(item.year > 2017 ||
			(item.year == 2017 && ['Autumn', 'Winter'].indexOf(item.season) >= 0))
				img.style.borderRadius = '50%';
				
			handler.appendChild(img);
		}
		row.appendChild(handler);
	}
	
	let rowText = document.createElement('span');
	rowText.innerText = formatRowText(item.title, item.altTitle);
	row.appendChild(rowText);
	
	return row;
}

function formatRowText(title, altTitle) {
	if(altTitle && altTitle.length > 0)
		return title + ' [' + altTitle + ']';
	return title;
}

function addImagesError() {
	for (let image of document.getElementsByTagName("img")) {
	}
	let animeImgList = document.getElementsByTagName("img");
	for (let i = 0; i < animeImgList.length; i++) {
		animeImgList[i].src = animeImgList[i].alt;
		animeImgList[i].alt = "";
		animeImgList[i].addEventListener("error", function() {
			this.onerror = null;
			this.src = 'https://knneo.github.io/resources/spacer.gif';
			this.style.border = '0px white solid';
			this.style.backgroundColor = 'transparent';
		});
	}
}