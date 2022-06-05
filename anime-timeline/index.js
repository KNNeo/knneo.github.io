//[1] array containing all gallery info
let customArray = [

{ sortOrder:1, year:2009, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kara no Kyoukai', altTitle:'空の境界', handle:'', imgURL:'', circular:false, MAL:2593 },
{ sortOrder:2, year:2011, season: '', length:0, seriesTitle: '', type:'Movie', title:'Cat Shit One – THE ANIMATED SERIES', altTitle:'', handle:'', imgURL:'', circular:false, MAL:6280 },
{ sortOrder:3, year:2011, season: '', length:0, seriesTitle: '', type:'Movie', title:'Koi*Sento', altTitle:'コイ☆セント', handle:'', imgURL:'', circular:false, MAL:9333 },
{ sortOrder:4, year:2013, season: '', length:0, seriesTitle: '', type:'Movie', title:'Hal', altTitle:'ハル', handle:'', imgURL:'', circular:false, MAL:16528 },
{ sortOrder:5, year:2013, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kotonoha no Niwa', altTitle:'言の葉の庭', handle:'', imgURL:'', circular:false, MAL:16782 },
{ sortOrder:6, year:2017, season: '', length:0, seriesTitle: '', type:'Movie', title:'Yoru wa Mijikashi, Arukeyo Otome', altTitle:'夜は短し歩けよ乙女', handle:'otome_movie', imgURL:'https://pbs.twimg.com/profile_images/824234081672007680/dRIzESlX.jpg', circular:false, MAL:34537 },
{ sortOrder:7, year:2019, season: '', length:0, seriesTitle: '', type:'Movie', title:'Kimi no Suizou wo Tabetai', altTitle:'君の膵臓をたべたい', handle:'kimisui_anime', imgURL:'https://pbs.twimg.com/profile_images/952554383174021121/YIXzh_IK.jpg', circular:true, MAL:36098 },
{ sortOrder:8, year:2020, season: '', length:0, seriesTitle: '', type:'Movie', title:'Nakitai Watashi wa Neko wo Kaburu', altTitle:'泣きたい私は猫をかぶる', handle:'nakineko_movie', imgURL:'https://pbs.twimg.com/profile_images/1221927862279667712/X9VsQDhl.jpg', circular:true, MAL:41168 },
{ sortOrder:9, year:2021, season: '', length:0, seriesTitle: '', type:'Movie', title:'Eden', altTitle:'エデン', handle:'', imgURL:'', circular:true, MAL:39728 },
{ sortOrder:10, year:2022, season: '', length:0, seriesTitle: '', type:'Movie', title:'Josee to Tora to Sakana-tachi', altTitle:'ジョゼと虎と魚たち', handle:'joseetora_movie', imgURL:'https://pbs.twimg.com/profile_images/1201574758883741696/Bi73xBlm.jpg', circular:true, MAL:40787 },
{ sortOrder:1, year:2008, season: '', length:17, seriesTitle: '', type:'TV', title:'BLEACH', altTitle:'ブリーチー', handle:'BLEACHanimation', imgURL:'https://pbs.twimg.com/profile_images/1472136299931119616/8KQcn8-T.jpg', circular:true, MAL:269 },
{ sortOrder:2, year:2008, season: '', length:1, seriesTitle: '', type:'TV', title:'Love Hina', altTitle:'ラブ　ひな', handle:'', imgURL:'', circular:false, MAL:189 },
{ sortOrder:3, year:2008, season: '', length:1, seriesTitle: '', type:'TV', title:'Kekkaishi', altTitle:'結界師', handle:'', imgURL:'', circular:false, MAL:1606 },
{ sortOrder:4, year:2008, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Toradora!', altTitle:'とらドラ！', handle:'', imgURL:'', circular:false, MAL:4224 },
{ sortOrder:5, year:2008, season: 'Autumn', length:2, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji', altTitle:'黒執事', handle:'kuroshitsuji2', imgURL:'', circular:false, MAL:4898 },
{ sortOrder:6, year:2009, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Hatsukoi Limited.', altTitle:'初恋限定。', handle:'', imgURL:'', circular:false, MAL:5150 },
{ sortOrder:7, year:2009, season: 'Spring', length:1, seriesTitle: 'K-ON!', type:'TV', title:'K-ON!', altTitle:'けいおん！', handle:'', imgURL:'', circular:false, MAL:5680 },
{ sortOrder:8, year:2009, season: '', length:0, seriesTitle: '', type:'TV', title:'Nagarasete Airantou', altTitle:'ながされて愛蘭島', handle:'', imgURL:'', circular:false, MAL:1722 },
{ sortOrder:9, year:2009, season: '', length:0, seriesTitle: '', type:'TV', title:'Kannagi', altTitle:'かんなぎ', handle:'', imgURL:'', circular:false, MAL:3958 },
{ sortOrder:10, year:2009, season: '', length:0, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana', altTitle:'灼眼のシャナ', handle:'', imgURL:'', circular:false, MAL:355 },
{ sortOrder:11, year:2009, season: '', length:0, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana Second', altTitle:'灼眼のシャナII', handle:'', imgURL:'', circular:false, MAL:6773 },
{ sortOrder:12, year:2010, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'So.Ra.No.Wo.To', altTitle:'ソ．ラ．ノ．ヲ．ト', handle:'', imgURL:'', circular:false, MAL:6802 },
{ sortOrder:13, year:2010, season: 'Spring', length:2, seriesTitle: 'K-ON!', type:'TV', title:'K-ON!!', altTitle:'けいおん！！', handle:'', imgURL:'', circular:false, MAL:7791 },
{ sortOrder:14, year:2010, season: 'Spring', length:1, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg', circular:false, MAL:6956 },
{ sortOrder:15, year:2010, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yojouhan Shinwa Taikei', altTitle:'四畳半神話大系', handle:'', imgURL:'', circular:false, MAL:7785 },
{ sortOrder:16, year:2010, season: 'Summer', length:1, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji II', altTitle:'黒執事II', handle:'kuroshitsuji2', imgURL:'https://pbs.twimg.com/profile_images/459199935506677760/RfFVR915.png', circular:false, MAL:6707 },
{ sortOrder:17, year:2010, season: 'Summer', length:1, seriesTitle: 'Seitokai Yakuindomo', type:'TV', title:'Seitokai Yakuindomo', altTitle:'生徒会役員共', handle:'seitokai0428', imgURL:'https://pbs.twimg.com/profile_images/1202785307428417536/k0CYX9kO.jpg', circular:false, MAL:8675 },
{ sortOrder:18, year:2010, season: 'Autumn', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai', altTitle:'俺の妹がこんなに可愛いわけがない', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg', circular:false, MAL:8769 },
{ sortOrder:19, year:2011, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Fractale', altTitle:'フラクタル', handle:'fractale_system', imgURL:'https://pbs.twimg.com/profile_images/1185917529/fractalesystem.jpg', circular:false, MAL:9314 },
{ sortOrder:20, year:2011, season: '', length:0, seriesTitle: '', type:'TV', title:'Bartender', altTitle:'バーテンダー', handle:'', imgURL:'', circular:false, MAL:1589 },
{ sortOrder:21, year:2011, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'[C] - CONTROL: THE MONEY OF SOUL AND POSSIBILITY', altTitle:'', handle:'', imgURL:'', circular:false, MAL:10163 },
{ sortOrder:22, year:2011, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'A Channel', altTitle:'Aチャンネル', handle:'A_CH_anime', imgURL:'https://pbs.twimg.com/profile_images/1267528750/a_ch_logo_reasonably_small.gif', circular:false, MAL:9776 },
{ sortOrder:23, year:2011, season: 'Summer', length:2, seriesTitle: '', type:'TV', title:'Nichijou', altTitle:'日常', handle:'shinonome_lab', imgURL:'https://pbs.twimg.com/profile_images/1294157199/nichijou0.jpg', circular:false, MAL:10165 },
{ sortOrder:24, year:2011, season: 'Autumn', length:0, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING\'!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg', circular:false, MAL:10521 },
{ sortOrder:25, year:2011, season: 'Autumn', length:2, seriesTitle: 'Shakugan no Shana', type:'TV', title:'Shakugan no Shana Final', altTitle:'灼眼のシャナIII -FINAL-', handle:'', imgURL:'', circular:false, MAL:2787 },
{ sortOrder:26, year:2012, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sakamichi no Apollon', altTitle:'坂道のアポロン', handle:'apollon_anime', imgURL:'https://pbs.twimg.com/profile_images/1832775581/kaoru.jpg', circular:false, MAL:12531 },
{ sortOrder:27, year:2012, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Natsuiro Kiseki ', altTitle:'夏色キセキ', handle:'', imgURL:'', circular:false, MAL:12119 },
{ sortOrder:28, year:2012, season: 'Spring', length:2, seriesTitle: '', type:'TV', title:'Hyouka ', altTitle:'氷菓', handle:'', imgURL:'', circular:false, MAL:12189 },
{ sortOrder:29, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Binbougami ga! ', altTitle:'貧乏神が！', handle:'binbogamiga', imgURL:'https://pbs.twimg.com/profile_images/2276698026/lwnbo23caaa8j8mlzwcu.png', circular:false, MAL:13535 },
{ sortOrder:30, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kokoro Connect ', altTitle:'ココロコネクト', handle:'kokoroco_anime', imgURL:'https://pbs.twimg.com/profile_images/2309214867/o2i5vtew5lijp697yu7c.png', circular:false, MAL:11887 },
{ sortOrder:31, year:2012, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'TARI TARI', altTitle:'', handle:'taritarianime', imgURL:'https://pbs.twimg.com/profile_images/877893755419975680/_bhhuzqS.jpg', circular:false, MAL:13333 },
{ sortOrder:32, year:2012, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Tonari no Kaibutsu-kun ', altTitle:'となりの怪物くん', handle:'tk_anime', imgURL:'https://pbs.twimg.com/profile_images/2427248339/jr2693xm66xypq2bn20d_reasonably_small.gif', circular:false, MAL:14227 },
{ sortOrder:33, year:2013, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'RDG: Red Data Girl', altTitle:'', handle:'', imgURL:'', circular:false, MAL:14921 },
{ sortOrder:34, year:2013, season: 'Spring', length:1, seriesTitle: 'Ore no Imouto ga Konnani Kawaii Wake ga Nai', type:'TV', title:'Ore no Imouto ga Konnani Kawaii Wake ga Nai.', altTitle:'俺の妹がこんなに可愛いわけがない。', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg', circular:false, MAL:13659 },
{ sortOrder:35, year:2013, season: '', length:0, seriesTitle: '', type:'TV', title:'Acchi Kocchi ', altTitle:'あっちこっち', handle:'ackc_anime', imgURL:'https://pbs.twimg.com/profile_images/537215428385202177/TM13Pwi7.jpeg', circular:false, MAL:12291 },
{ sortOrder:36, year:2013, season: 'Spring', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg', circular:false, MAL:16498 },
{ sortOrder:37, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Servant x Service ', altTitle:'サーバント×サービス', handle:'', imgURL:'', circular:false, MAL:18119 },
{ sortOrder:38, year:2013, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kamisama no Inai Nichiyoubi', altTitle:'神さまのいない日曜日', handle:'', imgURL:'', circular:false, MAL:16009 },
{ sortOrder:39, year:2013, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'COPPELION', altTitle:'', handle:'coppelion_anime', imgURL:'https://pbs.twimg.com/profile_images/448715908291117057/7-4TgcB-.jpeg', circular:false, MAL:9479 },
{ sortOrder:40, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Golden Time ', altTitle:'ゴールデンタイム', handle:'golden_time_tv', imgURL:'https://pbs.twimg.com/profile_images/378800000533932917/36355310e1a9d9bdf977d75ad146c187.jpeg', circular:false, MAL:17895 },
{ sortOrder:41, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Nagi no Asukara ', altTitle:'凪のあすから', handle:'naginoasukara', imgURL:'https://pbs.twimg.com/profile_images/453794628215402496/jE3KRblj.jpeg', circular:false, MAL:16067 },
{ sortOrder:42, year:2013, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Samurai Flamenco ', altTitle:'サムライフラメンコ', handle:'samumenco', imgURL:'https://pbs.twimg.com/profile_images/378800000260049097/c27c1ed268ddf73d430d66ab5d1ca728.png', circular:false, MAL:19365 },
{ sortOrder:43, year:2014, season: 'Winter', length:1, seriesTitle: 'Seitokai Yakuindomo', type:'TV', title:'Seitokai Yakuindomo* ', altTitle:'生徒会役員共＊', handle:'seitokai0428', imgURL:'https://pbs.twimg.com/profile_images/1202785307428417536/k0CYX9kO.jpg', circular:false, MAL:20847 },
{ sortOrder:44, year:2014, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Tonari no Seki-kun ', altTitle:'となりの関くん', handle:'sekikun_anime', imgURL:'https://pbs.twimg.com/profile_images/378800000382812058/86c79e12a02ff7c7d99eda657f37fd34.png', circular:false, MAL:18139 },
{ sortOrder:45, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Bokura wa Minna Kawaisou ', altTitle:'僕らはみんな河合荘', handle:'anime_kawaisou', imgURL:'https://pbs.twimg.com/profile_images/451619211400335360/YaEY1Ryu.jpeg', circular:false, MAL:21405 },
{ sortOrder:46, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Isshuukan Friends. ', altTitle:'一週間フレンズ。', handle:'1weekfriends', imgURL:'https://pbs.twimg.com/profile_images/425643414072217600/DL3uunKS.jpeg', circular:false, MAL:21327 },
{ sortOrder:47, year:2014, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Ryuugajou Nanana no Maizoukin ', altTitle:'龍ヶ嬢七々々の埋蔵金', handle:'nanana_tv', imgURL:'https://pbs.twimg.com/profile_images/378800000863120396/NcgR3u74.jpeg', circular:false, MAL:21561 },
{ sortOrder:48, year:2014, season: 'Summer', length:1, seriesTitle: 'Kuroshitsuji', type:'TV', title:'Kuroshitsuji: Book of Circus ', altTitle:'黒執事 Book of Circus', handle:'kuroshitsuji2', imgURL:'https://pbs.twimg.com/profile_images/459199935506677760/RfFVR915.png', circular:false, MAL:22145 },
{ sortOrder:49, year:2014, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Glasslip ', altTitle:'グラスリップ', handle:'glasslip_anime', imgURL:'https://pbs.twimg.com/profile_images/922803547514716161/0pZj30Fs.jpg', circular:false, MAL:23079 },
{ sortOrder:50, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Denki-gai no Honya-san ', altTitle:'デンキ街の本屋さん', handle:'anime_denkigai', imgURL:'https://pbs.twimg.com/profile_images/569871960624996352/250Nbmru.jpeg', circular:false, MAL:24031 },
{ sortOrder:51, year:2014, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'Shigatsu wa Kimi no Uso ', altTitle:'四月は君の嘘', handle:'shigatsuhakimi', imgURL:'https://pbs.twimg.com/profile_images/496575304811294720/wGuXONlf.jpeg', circular:false, MAL:23273 },
{ sortOrder:52, year:2014, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Sora no Method ', altTitle:'天体のメソッド', handle:'sora_no_method', imgURL:'https://pbs.twimg.com/profile_images/445515376294502400/mNtCIWAh.png', circular:false, MAL:23209 },
{ sortOrder:53, year:2015, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Koufuku Graffiti ', altTitle:'幸腹グラフィティ', handle:'koufuku_g', imgURL:'https://pbs.twimg.com/profile_images/489062683409281024/vOhgFElc.jpeg', circular:false, MAL:24629 },
{ sortOrder:54, year:2015, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu ', altTitle:'暗殺教室', handle:'ansatsu_anime', imgURL:'https://pbs.twimg.com/profile_images/498033546800279553/SlFtnL3Y.jpeg', circular:false, MAL:24833 },
{ sortOrder:55, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Plastic Memories ', altTitle:'プラスティック・メモリーズ', handle:'pla_memo', imgURL:'https://pbs.twimg.com/profile_images/516603237269393408/CnhRb06K.png', circular:false, MAL:27775 },
{ sortOrder:56, year:2015, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Punch Line ', altTitle:'パンチライン', handle:'punchline_pj', imgURL:'https://pbs.twimg.com/profile_images/586407884080066560/sK1Y02Y-.jpg', circular:false, MAL:28617 },
{ sortOrder:57, year:2015, season: 'Summer', length:1, seriesTitle: 'WORKING!!', type:'TV', title:'WORKING!!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg', circular:false, MAL:25879 },
{ sortOrder:58, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Sore ga Seiyuu! ', altTitle:'それが声優！', handle:'soresei_anime', imgURL:'https://pbs.twimg.com/profile_images/602762236428353537/VjPrONQo.jpg', circular:false, MAL:29163 },
{ sortOrder:59, year:2015, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Ranpo Kitan Game of Laplace ', altTitle:'乱歩奇譚 Game of Laplace', handle:'rampokitan', imgURL:'https://pbs.twimg.com/profile_images/609287232319434752/RO3hXvfX.jpg', circular:false, MAL:28619 },
{ sortOrder:60, year:2015, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Subete ga F ni Naru ', altTitle:'すべてがFになる THE PERFECT INSIDER', handle:'f_noitamina', imgURL:'https://pbs.twimg.com/profile_images/598886798668877824/ngMJ6d-w.jpg', circular:false, MAL:28621 },
{ sortOrder:61, year:2016, season: 'Winter', length:2, seriesTitle: 'Ansatsu Kyoushitsu ', type:'TV', title:'Ansatsu Kyoushitsu 2nd Season ', altTitle:'暗殺教第2期', handle:'ansatsu_anime', imgURL:'https://pbs.twimg.com/profile_images/498033546800279553/SlFtnL3Y.jpeg', circular:false, MAL:30654 },
{ sortOrder:62, year:2016, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Boku Dake ga Inai Machi ', altTitle:'僕だけがいない街', handle:'bokumachi_anime', imgURL:'https://pbs.twimg.com/profile_images/661558389219065856/5q_QNX-W.png', circular:false, MAL:31043 },
{ sortOrder:63, year:2016, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi ', altTitle:'だがしかし', handle:'anime_dagashi', imgURL:'https://pbs.twimg.com/profile_images/894934393671696384/-MV8qTBZ.jpg', circular:false, MAL:31636 },
{ sortOrder:64, year:2016, season: 'Spring', length:2, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg', circular:false, MAL:31478 },
{ sortOrder:65, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kono Bijutsubu ni wa Mondai ga Aru!', altTitle:'この美術部には問題がある！', handle:'konobi_anime', imgURL:'https://pbs.twimg.com/profile_images/708865198296162304/QRsNybbW.jpg', circular:false, MAL:31952 },
{ sortOrder:66, year:2016, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Time Travel Shoujo', altTitle:'タイムトラベル少女～マリ・ワカと8人の科学者たち～', handle:'mariwaka_anime', imgURL:'https://pbs.twimg.com/profile_images/737133362410754049/mJn-rdrk.jpg', circular:false, MAL:33341 },
{ sortOrder:67, year:2016, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'WWW.WORKING!!', altTitle:'', handle:'Wagnaria', imgURL:'https://pbs.twimg.com/profile_images/715919741009809409/D_zDV9BH.jpg', circular:false, MAL:33094 },
{ sortOrder:68, year:2016, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://pbs.twimg.com/profile_images/836077469446754304/dsaXnj0l.jpg', circular:false, MAL:31646 },
{ sortOrder:69, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'ACCA 13-ku Kansatsu-ka ', altTitle:'ACCA13区監察課', handle:'ACCA_anime', imgURL:'https://pbs.twimg.com/profile_images/767598431820914688/xSqk1nJu.jpg', circular:true, MAL:33337 },
{ sortOrder:70, year:2017, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Demi-chan wa Kataritai ', altTitle:'亜人ちゃんは語りたい', handle:'demichan_anime', imgURL:'https://pbs.twimg.com/profile_images/772024004647407617/JmQfO1Oe.jpg', circular:true, MAL:33988 },
{ sortOrder:71, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tsuki ga Kirei ', altTitle:'月がきれい', handle:'tsukigakirei_tv', imgURL:'https://pbs.twimg.com/profile_images/832160318113488896/2B4ipy5I.jpg', circular:false, MAL:34822 },
{ sortOrder:72, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Eromanga-sensei ', altTitle:'エロマンガ先生', handle:'oreimo_eromanga', imgURL:'https://pbs.twimg.com/profile_images/782442603639738368/uZqqQNAp.jpg', circular:false, MAL:32901 },
{ sortOrder:73, year:2017, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg', circular:false, MAL:25777 },
{ sortOrder:74, year:2017, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Alice to Zouroku ', altTitle:'アリスと蔵六', handle:'alicetozouroku', imgURL:'https://pbs.twimg.com/profile_images/875537037415243776/o5pAqNwi.jpg', circular:false, MAL:34350 },
{ sortOrder:75, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Aho Girl ', altTitle:'アホガール', handle:'ahogirl_anime', imgURL:'https://pbs.twimg.com/profile_images/828435582971842561/3VyMSA2p.jpg', circular:false, MAL:34881 },
{ sortOrder:76, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsurezure Children ', altTitle:'徒然チルドレン', handle:'tsuredure_anime', imgURL:'https://pbs.twimg.com/profile_images/907430679201308672/9WY29qYW.jpg', circular:false, MAL:34902 },
{ sortOrder:77, year:2017, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Gamers! ', altTitle:'ゲーマーズ！', handle:'gamers_tvanime', imgURL:'https://pbs.twimg.com/profile_images/857105776774717442/NIfomSTq.jpg', circular:false, MAL:34280 },
{ sortOrder:78, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Just Because!', altTitle:'', handle:'JustBecause_JP', imgURL:'https://pbs.twimg.com/profile_images/930398934337454080/Me2wofQb.jpg', circular:true, MAL:35639 },
{ sortOrder:79, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Blend.S ', altTitle:'ブレンド・S', handle:'blend_s_anime', imgURL:'https://pbs.twimg.com/profile_images/902045404405030912/89oD8X9L.jpg', circular:true, MAL:34618 },
{ sortOrder:80, year:2017, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houseki no Kuni ', altTitle:'宝石の国', handle:'houseki_anime', imgURL:'https://pbs.twimg.com/profile_images/865400178710151168/6WUJV_MB.jpg', circular:true, MAL:35557 },
{ sortOrder:81, year:2017, season: 'Autumn', length:2, seriesTitle: 'Sangatsu no Lion ', type:'TV', title:'Sangatsu no Lion ', altTitle:'３月のライオン', handle:'3lion_anime', imgURL:'https://pbs.twimg.com/profile_images/836077469446754304/dsaXnj0l.jpg', circular:true, MAL:35180 },
{ sortOrder:82, year:2018, season: 'Winter', length:1, seriesTitle: 'Dagashi Kashi', type:'TV', title:'Dagashi Kashi 2 ', altTitle:'だがしかし2', handle:'anime_dagashi', imgURL:'https://pbs.twimg.com/profile_images/894934393671696384/-MV8qTBZ.jpg', circular:true, MAL:36049 },
{ sortOrder:83, year:2018, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Slow Start ', altTitle:'スロウスタート', handle:'slosta_anime', imgURL:'https://pbs.twimg.com/profile_images/947022175218712576/o0B4Ra8F.jpg', circular:true, MAL:35540 },
{ sortOrder:84, year:2018, season: 'Winter', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san ', altTitle:'からかい上手の高木さん', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1112369519815610368/nu7-t3KS.png', circular:true, MAL:35860 },
{ sortOrder:85, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Tada-kun wa Koi wo Shinai ', altTitle:'多田くんは恋をしない', handle:'tadakoi_anime', imgURL:'https://pbs.twimg.com/profile_images/979661713669742592/P440J2-j.jpg', circular:true, MAL:36470 },
{ sortOrder:86, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Fumikiri Jikan ', altTitle:'踏切時間', handle:'fumikiri_anime', imgURL:'https://pbs.twimg.com/profile_images/967238700756230144/LL25XX7j.jpg', circular:true, MAL:37188 },
{ sortOrder:87, year:2018, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Wotaku ni Koi wa Muzukashii ', altTitle:'ヲタクに恋は難しい', handle:'wotakoi_anime', imgURL:'https://pbs.twimg.com/profile_images/946550850020786176/c5SCH5n4.jpg', circular:true, MAL:35968 },
{ sortOrder:88, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Chio-chan no Tsuugakuro ', altTitle:'ちおちゃんの通学路', handle:'Chiochan_tv', imgURL:'https://pbs.twimg.com/profile_images/1031397413322289152/bDEUjD_5.jpg', circular:true, MAL:35821 },
{ sortOrder:89, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Asobi Asobase ', altTitle:'あそびあそばせ', handle:'asobiasobase_a', imgURL:'https://pbs.twimg.com/profile_images/956675821569163265/lTDOMpfm.jpg', circular:true, MAL:37171 },
{ sortOrder:90, year:2018, season: 'Summer', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg', circular:true, MAL:35760 },
{ sortOrder:91, year:2018, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tsukumogami Kashimasu ', altTitle:'つくもがみ貸します', handle:'tsukumogami_tv', imgURL:'https://pbs.twimg.com/profile_images/1007425308939599873/lqWVfmWI.jpg', circular:true, MAL:36654 },
{ sortOrder:92, year:2018, season: 'Autumn', length:2, seriesTitle: '', type:'TV', title:'BANANA FISH', altTitle:'', handle:'bananafish_tv', imgURL:'https://pbs.twimg.com/profile_images/922115202962751493/cO_HIANw.jpg', circular:true, MAL:36649 },
{ sortOrder:93, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Uchi no Maid ga Uzasugiru! ', altTitle:'うちのメイドがウザすぎる！', handle:'uzamaid_a', imgURL:'https://pbs.twimg.com/profile_images/1054700812411133952/_BYrHrby.jpg', circular:true, MAL:37722 },
{ sortOrder:94, year:2018, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Gaikotsu Shoten\'in Honda-san ', altTitle:'ガイコツ書店員 本田さん', handle:'gai_honda', imgURL:'', circular:true, MAL:36317 },
{ sortOrder:95, year:2019, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Domestic na Kanojo ', altTitle:'ドメスティックな彼女', handle:'domekano_anime', imgURL:'https://pbs.twimg.com/profile_images/1017227499162558464/EhnROqJ4.jpg', circular:true, MAL:37982 },
{ sortOrder:96, year:2019, season: 'Winter', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg', circular:true, MAL:37999 },
{ sortOrder:97, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Midara na Ao-chan wa Benkyou ga Dekinai', altTitle:'みだらな青ちゃんは勉強ができない', handle:'aochan_anime', imgURL:'https://pbs.twimg.com/profile_images/1069773132867629057/cxgqUXNx.jpg', circular:true, MAL:38778 },
{ sortOrder:98, year:2019, season: 'Spring', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Season 3 ', altTitle:'文豪ストレイドッグス', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg', circular:true, MAL:38003 },
{ sortOrder:99, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Joshikausei ', altTitle:'女子かう生', handle:'joshikau_anime', imgURL:'https://pbs.twimg.com/profile_images/1087530080383848448/cePswUM_.jpg', circular:true, MAL:38295 },
{ sortOrder:100, year:2019, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Sewayaki Kitsune no Senko-san ', altTitle:'世話やきキツネの仙狐さん', handle:'sewayakisenko', imgURL:'https://pbs.twimg.com/profile_images/1069426820297056256/QOiBUxly.jpg', circular:true, MAL:38759 },
{ sortOrder:101, year:2019, season: 'Spring', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin Season 3 Part.2 ', altTitle:'進撃の巨人', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1051513792851398657/NHhP8E_7.jpg', circular:true, MAL:38524 },
{ sortOrder:102, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Araburu Kisetsu no Otome-domo yo. ', altTitle:'荒ぶる季節の乙女どもよ。', handle:'araotoproject', imgURL:'https://pbs.twimg.com/profile_images/1280458570878738432/FuX3aQoL.jpg', circular:true, MAL:38753 },
{ sortOrder:103, year:2019, season: 'Summer', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san 2 ', altTitle:'からかい上手の高木さん２', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1112369519815610368/nu7-t3KS.png', circular:true, MAL:38993 },
{ sortOrder:104, year:2019, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Joshikousei no Mudazukai ', altTitle:'女子高生の無駄づかい', handle:'jyoshimuda', imgURL:'https://pbs.twimg.com/profile_images/1147082271309963264/Zb8wBjrF.png', circular:true, MAL:38619 },
{ sortOrder:105, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Houkago Saikoro Club ', altTitle:'放課後さいころ倶楽部', handle:'saikoro_club', imgURL:'https://pbs.twimg.com/profile_images/1126680950245445634/3gnEQ7_p.png', circular:true, MAL:38276 },
{ sortOrder:106, year:2019, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Babylon ', altTitle:'バビロン', handle:'babylon_anime', imgURL:'https://pbs.twimg.com/profile_images/1196458113538199554/qzwOiPi5.jpg', circular:true, MAL:37525 },
{ sortOrder:107, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Hatena Illusion', altTitle:'はてな☆イリュージョン', handle:'hatena_anime', imgURL:'https://pbs.twimg.com/profile_images/1189449630188101632/Q9mwXAAL.jpg', circular:true, MAL:35252 },
{ sortOrder:108, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Jibaku Shounen Hanako-kun', altTitle:'地縛少年花子くん', handle:'hanakokun_info', imgURL:'https://pbs.twimg.com/profile_images/1245365315334103041/xqyY3x9k.png', circular:true, MAL:39534 },
{ sortOrder:109, year:2020, season: 'Winter', length:1, seriesTitle: 'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', type:'TV', title:'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', altTitle:'理系が恋に落ちたので証明してみた。', handle:'rikeigakoini', imgURL:'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg', circular:true, MAL:38992 },
{ sortOrder:110, year:2020, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Kyokou Suiri', altTitle:'虚構推理', handle:'kyokou_suiri', imgURL:'https://pbs.twimg.com/profile_images/1115453678771523584/Vpeq5eJ1.png', circular:true, MAL:39017 },
{ sortOrder:111, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Kakushigoto', altTitle:'かくしごと', handle:'kakushigoto_pr', imgURL:'https://pbs.twimg.com/profile_images/1392857421580693507/JAHZS0bW.jpg', circular:true, MAL:40716 },
{ sortOrder:112, year:2020, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Yesterday wo Utatte', altTitle:'イエスタデイをうたって', handle:'anime_yesterday', imgURL:'https://pbs.twimg.com/profile_images/1219731464255758336/eEqosTW9.jpg', circular:true, MAL:39710 },
{ sortOrder:113, year:2020, season: 'Spring', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai?', altTitle:'かぐや様は告らせたい～天才たちの恋愛頭脳戦？～', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1082000976964333573/vlZMd2Z7.jpg', circular:true, MAL:40591 },
{ sortOrder:114, year:2020, season: 'Summer', length:2, seriesTitle: '', type:'TV', title:'GREAT PRETENDER', altTitle:'', handle:'GrePre_anime', imgURL:'https://pbs.twimg.com/profile_images/1220648780011167745/QMKboWCS.jpg', circular:true, MAL:40052 },
{ sortOrder:115, year:2020, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Uzaki-chan wa Asobitai!', altTitle:'宇崎ちゃんは遊びたい！', handle:'uzakichan_asobi', imgURL:'https://pbs.twimg.com/profile_images/1147099341858824192/pL6QoWt7.png', circular:true, MAL:41226 },
{ sortOrder:116, year:2020, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kanojo, Okarishimasu', altTitle:'彼女、お借りします', handle:'kanokari_anime', imgURL:'https://pbs.twimg.com/profile_images/1264535167755931648/AUajKJKz.jpg', circular:true, MAL:40839 },
{ sortOrder:117, year:2020, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Tonikaku Kawaii', altTitle:'トニカクカワイイ', handle:'tonikawa_anime', imgURL:'https://pbs.twimg.com/profile_images/1456916236831723520/2j8nUeJQ.jpg', circular:true, MAL:41389 },
{ sortOrder:118, year:2020, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Majou no Tabitabi', altTitle:'魔女の旅々', handle:'majotabi_PR', imgURL:'https://pbs.twimg.com/profile_images/1185540696037421056/njCjSwao.png', circular:true, MAL:40571 },
{ sortOrder:119, year:2020, season: 'Autumn', length:2, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin The Final Season', altTitle:'進撃の巨人 The Final Season', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1309025164139663360/cbRKqHxk.jpg', circular:true, MAL:40028 },
{ sortOrder:120, year:2021, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Horimiya', altTitle:'ホリミヤ', handle:'horimiya_anime', imgURL:'https://pbs.twimg.com/profile_images/1306608160363261955/m8MflVId.png', circular:true, MAL:42897 },
{ sortOrder:121, year:2021, season: 'Winter', length:1, seriesTitle: 'Bungou Stray Dogs ', type:'TV', title:'Bungou Stray Dogs Wan!', altTitle:'文豪ストレイドッグス わん！', handle:'bungosd_anime', imgURL:'https://pbs.twimg.com/profile_images/1377636883807707142/G8S5apfo.jpg', circular:true, MAL:42250 },
{ sortOrder:122, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Koi to Yobu ni wa Kimochi Warui', altTitle:'恋と呼ぶには気持ち悪い', handle:'koikimo_anime', imgURL:'https://pbs.twimg.com/profile_images/1311825458665644032/qQdVyDYR.jpg', circular:true, MAL:41103 },
{ sortOrder:123, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Hige wo Soru. Soshite Joshikousei wo Hirou.', altTitle:'ひげを剃る。そして女子高生を拾う。', handle:'higehiro_anime', imgURL:'https://pbs.twimg.com/profile_images/1311599822730715141/l39MahWA.jpg', circular:true, MAL:40938 },
{ sortOrder:124, year:2021, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Osananajimi ga Zettai ni Makenai Love Comedy', altTitle:'幼なじみが絶対に負けないラブコメ', handle:'osamake_project', imgURL:'https://pbs.twimg.com/profile_images/1312352077423636482/WoxK7ZKO.jpg', circular:true, MAL:43007 },
{ sortOrder:125, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Kanojo mo Kanojo', altTitle:'カノジョも彼女', handle:'kanokano_anime', imgURL:'https://pbs.twimg.com/profile_images/1378523649842454529/Iltf_L5Y.jpg', circular:true, MAL:43969 },
{ sortOrder:126, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Shinigami Bocchan to Kuro Maid', altTitle:'死神坊ちゃんと黒メイド', handle:'bocchan_anime', imgURL:'https://pbs.twimg.com/profile_images/1377637066184351750/EDzqxnRR_400x400.jpg', circular:true, MAL:47257 },
{ sortOrder:127, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Sonny Boy', altTitle:'', handle:'sonnyboy_anime', imgURL:'https://pbs.twimg.com/profile_images/1415738208835407872/qdHMoMo3.jpg', circular:true, MAL:48849 },
{ sortOrder:128, year:2021, season: 'Summer', length:1, seriesTitle: '', type:'TV', title:'Tantei wa Mou, Shindeiru.', altTitle:'探偵はもう、死んでいる。', handle:'tanteiwamou_', imgURL:'https://pbs.twimg.com/profile_images/1245369835896229889/JDG3Y_Wo.png', circular:true, MAL:46471 },
{ sortOrder:129, year:2021, season: 'Autumn', length:1, seriesTitle: 'Komi-san wa, Komyushou Desu.', type:'TV', title:'Komi-san wa, Komyushou Desu.', altTitle:'古見さんは、コミュ症です。', handle:'comisanvote', imgURL:'https://pbs.twimg.com/profile_images/1383659174643470342/CllYIDt4.jpg', circular:true, MAL:48926 },
{ sortOrder:130, year:2021, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Taishou Otome Otogibanashi', altTitle:'大正オトメ御伽話', handle:'otome_otogi', imgURL:'https://pbs.twimg.com/profile_images/1430472102310596612/2GvhVjP-.jpg', circular:true, MAL:45055 },
{ sortOrder:131, year:2021, season: 'Autumn', length:1, seriesTitle: '', type:'TV', title:'Senpai ga Uzai Kouhai no Hanashi', altTitle:'先輩がうざい後輩の話', handle:'uzai_anime', imgURL:'https://pbs.twimg.com/profile_images/1425399770781130753/aE3OW1Lt.jpg', circular:true, MAL:42351 },
{ sortOrder:132, year:2022, season: 'Winter', length:1, seriesTitle: 'Karakai Jouzu no Takagi-san ', type:'TV', title:'Karakai Jouzu no Takagi-san 3', altTitle:'からかい上手の高木さん３', handle:'takagi3_anime', imgURL:'https://pbs.twimg.com/profile_images/1468958582213283841/vvU-lWWO.jpg', circular:true, MAL:49721 },
{ sortOrder:133, year:2022, season: 'Winter', length:1, seriesTitle: '', type:'TV', title:'Sono Bisque Doll wa Koi wo Suru', altTitle:'その着せ替え人形は恋をする', handle:'kisekoi_anime', imgURL:'https://pbs.twimg.com/profile_images/1448810796130004993/nlkBB4Ph.png', circular:true, MAL:48736 },
{ sortOrder:134, year:2022, season: 'Winter', length:1, seriesTitle: 'Shingeki no Kyojin', type:'TV', title:'Shingeki no Kyojin The Final Season Part 2', altTitle:'進撃の巨人 The Final Season', handle:'anime_shingeki', imgURL:'https://pbs.twimg.com/profile_images/1459830616351178757/IGExRnNj.jpg', circular:true, MAL:48583 },
{ sortOrder:135, year:2022, season: 'Spring', length:1, seriesTitle: 'Rikei ga Koi ni Ochita no de Shoumei Shite Mita.', type:'TV', title:'Rikei ga Koi ni Ochita no de Shoumei Shite Mita. Heart', altTitle:'理系が恋に落ちたので証明してみた。r=1-sinθ（ハート）', handle:'rikeigakoini', imgURL:'https://pbs.twimg.com/profile_images/1197753575834652672/ANH_2P3h.jpg', circular:true, MAL:43470 },
{ sortOrder:136, year:2022, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Aharen-san wa Hakarenai', altTitle:'阿波連さんははかれない', handle:'aharen_pr', imgURL:'https://pbs.twimg.com/profile_images/1421485317022883849/tQh5oyb0.jpg', circular:true, MAL:49520 },
{ sortOrder:137, year:2022, season: 'Spring', length:1, seriesTitle: 'Kaguya-sama wa Kokurasetai', type:'TV', title:'Kaguya-sama wa Kokurasetai: Ultra Romantic', altTitle:'かぐや様は告らせたい-ウルトラロマンティック-', handle:'anime_kaguya', imgURL:'https://pbs.twimg.com/profile_images/1509869806001872897/SmQyyzqI.png', circular:true, MAL:43608 },
{ sortOrder:138, year:2022, season: 'Spring', length:1, seriesTitle: 'Komi-san wa, Komyushou Desu.', type:'TV', title:'Komi-san wa, Komyushou Desu. (2022)', altTitle:'古見さんは、コミュ症です。', handle:'comisanvote', imgURL:'https://pbs.twimg.com/profile_images/1383659174643470342/CllYIDt4.jpg', circular:true, MAL:50631 },
{ sortOrder:139, year:2022, season: 'Spring', length:1, seriesTitle: '', type:'TV', title:'Kawaii Dake ja Nai Shikimori-san', altTitle:'可愛いだけじゃない式守さん', handle:'anime_shikimori', imgURL:'https://pbs.twimg.com/profile_images/1512380058589007875/jvo1sVPQ.jpg', circular:true, MAL:45613 },

];

let isGroupBySeries = false;
let isSortByTitleAsc;
let startYear = 2008;
let startSeason = 'Autumn';
let currentYear = 2022;
let currentSeason = 'Spring';
let endYear = 2022;
let seasons = ['','Winter','Spring','Summer','Autumn'];
let seasonArray = new Array();
let seriesArray = new Array();

window.addEventListener('load', function() {
	customArray = customArray.map(ca => {
		let ref = showsRef.filter(s => s.id == ca.MAL);
		return {
			...ca,
			handle: ref[0].seriesURL,
			imgURL: ref[0].seriesImage,
		}
	})
	generateAnimeList(false);
	addGroupByEvents();
});
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
		let counter = 0;
		for(let show of allSeries)
		{
			seriesArray.push( {
				id: ++counter, 
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
		animeTableHeaderRow.id = 'animeTitle';
		animeTableHeaderRow.innerText = 'Series Title' + (isSortByTitleAsc == true ? ' 🔼' : '') + (isSortByTitleAsc == false ? ' 🔽' : '');
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = startYear; y <= endYear; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + formatSeasonText(seasons[s]);
				animeTableHeaderRow.title = y + "\n" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}
		animeTableBody.appendChild(animeTableHeader);
	
		for(let anime of seriesArray.sort(function(a,b) {
			if(isSortByTitleAsc == true)
			{
				if (a.seriesTitle.toLowerCase() < b.seriesTitle.toLowerCase()) return -1;
				if (a.seriesTitle.toLowerCase() > b.seriesTitle.toLowerCase()) return 1;
				return 0;
			}
			if(isSortByTitleAsc == false)
			{
				if (a.seriesTitle.toLowerCase() < b.seriesTitle.toLowerCase()) return 1;
				if (a.seriesTitle.toLowerCase() > b.seriesTitle.toLowerCase()) return -1;
				return 0;
			}
			return a.id - b.id;
		}))
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
			for(let y = startYear; y <= endYear; y++)
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
				for(let y = startYear; y <= endYear; y++)
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
									animeTableContentOverlayImageLink.href = (!series.handle.startsWith('http') ? 'https://twitter.com/' : '') + series.handle;
									animeTableContentOverlayImageLink.setAttribute("target", "_blank")
									
										let animeTableContentOverlayImage = document.createElement('img');
										animeTableContentOverlayImage.src = series.imgURL;
										if(series.circular && !series.handle.startsWith('http'))
											animeTableContentOverlayImage.style.borderRadius = '50%';
												
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
		animeTableHeaderRow.id = 'animeTitle';
		animeTableHeaderRow.innerText = 'Anime Title' + (isSortByTitleAsc == true ? ' 🔼' : '') + (isSortByTitleAsc == false ? ' 🔽' : '');
		animeTableHeader.appendChild(animeTableHeaderRow);

		for(let y = startYear; y <= endYear; y++)
		{
			for(let s = 1; s <= 4; s++)
			{
				animeTableHeaderRow = document.createElement('th');
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.style.backgroundColor = '#444444'; //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + formatSeasonText(seasons[s]);
				animeTableHeaderRow.title = y + "\n" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}

		animeTableBody.appendChild(animeTableHeader);
		
		if(seasonArray.length == 0)
		{
			for(let anime of customArray)
			{
				seasonArray.push(anime);
			}
		}
		
		for(let anime of seasonArray.sort(function(a,b) {
			if(isSortByTitleAsc == true)
			{
				if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
				if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
				return 0;
			}
			if(isSortByTitleAsc == false)
			{
				if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
				if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
				return 0;
			}
			return a.sortOrder - b.sortOrder;
		}))
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
			for(let y = startYear; y <= endYear; y++)
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
							animeTableContentOverlayImageLink.href = (!anime.handle.startsWith('http') ? 'https://twitter.com/' : '') + anime.handle;
							animeTableContentOverlayImageLink.setAttribute("target", "_blank")
							
								let animeTableContentOverlayImage = document.createElement('img');
								animeTableContentOverlayImage.src = anime.imgURL;
								if(anime.circular && !anime.handle.startsWith('http'))
									animeTableContentOverlayImage.style.borderRadius = '50%';
										
								animeTableContentOverlayImageLink.appendChild(animeTableContentOverlayImage);
								
							animeTableContentOverlayImageContainer.appendChild(animeTableContentOverlayImageLink);
						}
						if(window.outerWidth < 960) animeTableContentOverlay.appendChild(animeTableContentOverlayImageContainer);
						else animeTableContentOverlay.insertBefore(animeTableContentOverlayImageContainer, animeTableContentOverlay.childNodes[0]);
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
	addAnimeTitleSort();
}

//[2] generate labels
//add event for radio buttons
function addGroupByEvents() {
	document.getElementsByClassName('selection')[1].addEventListener('click', function() { inverseRadio(1); });
	document.getElementsByClassName('selection')[0].addEventListener('click', function() { inverseRadio(0); });
}

function inverseRadio(val) {
		isGroupBySeries = !isGroupBySeries;
		document.getElementsByClassName('selection')[1].checked = isGroupBySeries;
		document.getElementsByClassName('selection')[0].checked = !isGroupBySeries;
		generateAnimeList(isGroupBySeries);
}

//[3] after adjustments
//fix table height such that window scroll is disabled
let h3height = document.getElementsByTagName('h3')[0].getBoundingClientRect().height;
let headerHeight = document.getElementById('header').offsetHeight;
let footerHeight = document.getElementById('footer').offsetHeight;
document.getElementById('anime-list').style.height = (window.innerHeight - h3height - headerHeight - footerHeight - 0.2*window.innerHeight - 20) + 'px';

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
					document.getElementById('anime-list').scrollLeft += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().x-(windowWidth < 800 ? 0.75*window.outerWidth : 0.5*window.outerWidth);
					document.getElementById('anime-list').scrollTop += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().y-(windowWidth < 800 ? 135 : 155);
					//console.log(document.getElementById('anime-list').scrollLeft);
					//console.log(document.getElementById('anime-list').scrollTop);
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
			if(x + w > window.outerWidth)
				this.getElementsByClassName('show-overlay')[0].style.left = (x - (x+w-window.outerWidth) - 3) + 'px';
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

function addAnimeTitleSort() {
	document.getElementById('animeTitle').addEventListener('click', function() {
		switch(isSortByTitleAsc) {
		  case false:
			isSortByTitleAsc = undefined;
			break;
		  case true:
			isSortByTitleAsc = false;
			break;
		  default:
			isSortByTitleAsc = true;
		}
		generateAnimeList(isGroupBySeries);
	});
}

function formatSeasonText(s) {
	switch(s) {
	  case seasons[1]:
		s = '❄️';
		break;
	  case seasons[2]:
		s = '🌸';
		break;
	  case seasons[3]:
		s = '☀️';
		break;
	  case seasons[4]:
		s = '🍂';
		break;
	  default:
		s = s;
		break;
	}
	return s;
}