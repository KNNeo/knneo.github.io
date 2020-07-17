//array containing all gallery info
//[sortOrder,directory,orientation,name]
let imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427055.jpg','portrait','上坂すみれ','横型・上半身・衣装オレンジ・振り返り/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427051.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・体右向き・背景黒/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427052.jpg','portrait','上坂すみれ','横型・バストアップ・衣装青.黒・両手頬/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427053.jpg','portrait','上坂すみれ','上半身・衣装オレンジ・飲み物/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-B'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg427050.jpg','portrait','上坂すみれ','バストアップ・衣装青.黒・左手胸・背景赤/「上坂すみれのPROPAGANDA CITY 2020」どっちかにしなさいよ!生写真 TYPE-A'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034304.jpg','portrait','上坂すみれ','上半身・衣装紫・左手サングラス・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034303.jpg','portrait','上坂すみれ','横型・上半身・衣装紫・右手銃・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034305.jpg','portrait','上坂すみれ','横型・顔アップ・衣装紫・体右向き・背景黒/「上坂すみれのノーフューチャーダイアリー2019」生写真セットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034306.jpg','portrait','上坂すみれ','横型・バストアップ・衣装ピンク・右手パー・背景水色/「上坂すみれのノーフューチャーダイアリー2019」生写真セットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034308.jpg','portrait','上坂すみれ','膝上・衣装ピンク・体左向き・背景水色/「上坂すみれのノーフューチャーダイアリー2019」生写真セットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034309.jpg','portrait','上坂すみれ','上半身・衣装白・黒・ピンク・両手棒・口元・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277820.jpg','portrait','上坂すみれ','バストアップ・衣装白・黒・左向き・背景ピンク・印刷サイン入り/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277821.jpg','portrait','上坂すみれ','膝上・衣装白・黒・両手下・首傾げ・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277815.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・目線左上・背景白・印刷サイン入り/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277813.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・左手指差し・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277817.jpg','portrait','上坂すみれ','全身・衣装白・黒・両手棒・右足曲げ・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277819.jpg','portrait','上坂すみれ','バストアップ・衣装白・黒・右手曲げ・右向き・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277816.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・左手腰・顔左向き・口開け・背景ピンク/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277814.jpg','portrait','上坂すみれ','膝上・衣装白・黒・両手棒・口開け・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277818.jpg','portrait','上坂すみれ','上半身・衣装白・黒・右手棒・顔右向き・背景白/上坂すみれファンクラブ「コルホーズの玉ねぎ畑」イベント「義・バレンタイン」生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3609175.jpg','portrait','上坂すみれ','衣装ピンク・右手髪の毛/雑誌「声優グランプリ 2018年2月号」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg062401.jpg','portrait','上坂すみれ','雑誌「B.L.T. VOICE GIRLS Vol.38」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3643823.jpg','portrait','上坂すみれ','雑誌「B.L.T. VOICE GIRLS Vol.33」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg229662.jpg','portrait','夏川椎菜','CD「Ep01」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg189336.jpg','portrait','夏川椎菜','横型・バストアップ・衣装白・首かしげ・背景グレー/CD「ログライン」発売記念 アニメイト渋谷・秋葉原本館店頭抽選会参加賞ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg056095.jpg','portrait','夏川椎菜','CD「ログライン」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg056096.jpg','portrait','夏川椎菜','CD「ログライン」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3778061.jpg','portrait','夏川椎菜','CD「パレイド」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3778062.jpg','portrait','夏川椎菜','CD「パレイド」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3566551.jpg','portrait','夏川椎菜','全身・衣装白・背景黄/CD「フワリ、コロリ、カラン、コロン」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345811.jpg','portrait','夏川椎菜','CD「グレープフルーツムーン」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3374140.jpg','portrait','夏川椎菜','ゲーマーズ限定フェア「春の声優まつり」'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345812.jpg','portrait','夏川椎菜','CD「グレープフルーツムーン」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3062848.jpg','portrait','TrySail','麻倉もも・雨宮天・夏川椎菜/横型/CD「High Free Spirits」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3062850.jpg','portrait','TrySail','麻倉もも・雨宮天・夏川椎菜/CD「High Free Spirits」とらのあな特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4312153.jpg','portrait','TrySail','集合(3人)/麻倉もも・雨宮天・夏川椎菜/CD「Youthful Dreamer」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4312159.jpg','portrait','TrySail','集合(3人)/麻倉もも・雨宮天・夏川椎菜/CD「Youthful Dreamer」ANIPLEX+特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg215035.jpg','portrait','TrySail','集合(3人)/座り/BD「TrySail Music Video Collection 2015-2019」 雑誌「声優グランプリplus femme vol.1」アニメイト連動購入特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg215034.jpg','portrait','TrySail','集合(3人)/横型/BD「TrySail Music Video Collection 2015-2019」 雑誌「声優グランプリplus femme vol.1」アニメイト連動購入特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg215033.jpg','portrait','TrySail','集合(3人)/雑誌「声優グランプリplus femme vol.1」アニメイト渋谷＆アニメイト秋葉原本館限定特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3869143.jpg','portrait','TrySail','集合(3人)/CD「azure」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3869144.jpg','portrait','TrySail','集合(3人)/CD「azure」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3756057.jpg','portrait','TrySail','集合(3人)/写真集「TrySail Live Photobook on a journey」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3756056.jpg','portrait','TrySail','集合(3人)/写真集「TrySail Live Photobook on a journey」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3665428.jpg','portrait','TrySail','集合(3人)/CD「WANTED GIRL」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3391716.jpg','portrait','TrySail','集合(3人)/CD「adrenaline!!!」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3391715.jpg','portrait','TrySail','集合(3人)/CD「adrenaline!!!」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034319.jpg','portrait','TrySail','集合(3人)/横型・印刷サイン・メッセージ入り/CD「オリジナル。」LAWSON premium event Music Rainbow 04公演会場限定予約特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3024392.jpg','portrait','TrySail','集合(3人)/CD「whiz」HMV特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3330451.jpg','portrait','TrySail','集合(3人)/ラジオCD「TrySailのTRYangle harmony RADIO FANDISK 3」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3024399.jpg','portrait','TrySail','集合(3人)/「リスアニ! LIVE 2016[SUNDAY STAGE]」/この冬をTrySailと一緒に過ごそう!「whiz」予約キャンペーン'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3024397.jpg','portrait','TrySail','集合(3人)/「LAWSON premium event TrySailのMusic Rainbow 03」/この冬をTrySailと一緒に過ごそう!「whiz」予約キャンペーン'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4498292.jpg','portrait','TrySail','集合(3人)/ラジオCD「TrySailのTRYangle harmony RADIO FAN DISC2」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4338874.jpg','portrait','TrySail','集合(3人)/CD「コバルト」ANIPLEX+特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3024387.jpg','portrait','TrySail','集合(3人)/CD「whiz」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4338869.jpg','portrait','TrySail','集合(3人)/CD「コバルト」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3024391.jpg','portrait','TrySail','集合(3人)/CD「whiz」タワーレコード特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3363331.jpg','portrait','TrySail','集合(3人)/ラジオCD「TrySailのTRYangle harmony RADIO FANDISK」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3021528.jpg','portrait','TrySail','集合(3人)/ラジオCD「TrySailのTRYangle harmony RADIO FAN DISC3」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3220201.jpg','portrait','TrySail','集合(3人)/横型・印刷サイン入り/CD「TRYangle harmony RADIO FANDISK」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3220200.jpg','portrait','TrySail','集合(3人)/印刷サイン入り/CD「TRYangle harmony RADIO FANDISK」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg208488.jpg','portrait','麻倉もも','CD「ユメシンデレラ」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg239660.jpg','portrait','麻倉もも','A5サイズ/写真集「ただいま、おかえり」HMV・Loppi特典大判フォトカード'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg208489.jpg','portrait','麻倉もも','CD「ユメシンデレラ」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg109028.jpg','portrait','麻倉もも','CD「スマッシュ・ドロップ」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg070330.jpg','portrait','麻倉もも','雑誌「声優アニメディア 2019年6月号」アニメイト/ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg109022.jpg','portrait','麻倉もも','CD「365×LOVE」発売記念 アニメイト店頭抽選会D賞 オリジナルブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg109023.jpg','portrait','麻倉もも','CD「スマッシュ・ドロップ」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3975831.jpg','portrait','麻倉もも','CD「365×LOVE」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3838740.jpg','portrait','麻倉もも','CD「Peachy!」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034315.jpg','portrait','麻倉もも','上半身・衣装赤・青・両手下げ・体左向き・背景海/雑誌「声優アニメディア2018年10月号」応募者全員サービス 特製ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3800635.jpg','portrait','麻倉もも','CD「パンプキン・ミート・パイ」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3838743.jpg','portrait','麻倉もも','CD「Peachy!」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034313.jpg','portrait','麻倉もも','全身・座り・衣装白・黒・右手床・左手髪/雑誌「声優アニメディア2018年10月号」応募者全員サービス 特製ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3547120.jpg','portrait','麻倉もも','CD「カラフル」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3547119.jpg','portrait','麻倉もも','CD「カラフル」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3404733.jpg','portrait','麻倉もも','CD「トクベツいちばん!!」とらのあな特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3404732.jpg','portrait','麻倉もも','CD「トクベツいちばん!!」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204936.jpg','portrait','麻倉もも','CD「明日は君と。」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204937.jpg','portrait','麻倉もも','CD「明日は君と。」ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg329037.jpg','portrait','雨宮天','CD「PARADOX」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg329038.jpg','portrait','雨宮天','CD「PARADOX」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg329046.jpg','portrait','雨宮天','CD「PARADOX」楽天ブックス特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg329036.jpg','portrait','雨宮天','CD「PARADOX」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg329040.jpg','portrait','雨宮天','CD「PARADOX」TOWER RECORDS特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284089.jpg','portrait','雨宮天','CD「Regeneration」TOWER RECORDS特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284086.jpg','portrait','雨宮天','CD「Regeneration」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284087.jpg','portrait','雨宮天','CD「Regeneration」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg189340.jpg','portrait','雨宮天','CD「VIPER」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg109021.jpg','portrait','雨宮天','雨宮天ミュージアム in アニメイト渋谷2019 “The Animate SKY” 応援店舗 「オリジナルブロマイド」プレゼントキャンペーン'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3944912.jpg','portrait','雨宮天','CD「Defiance」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3944917.jpg','portrait','雨宮天','CD「Defiance」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3944914.jpg','portrait','雨宮天','CD「Defiance」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3944913.jpg','portrait','雨宮天','CD「Defiance」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg284973.jpg','portrait','雨宮天','CD「The Only BLUE」発売記念アニメイト渋谷店・秋葉原店キャンペーン 抽選会参加賞ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3768927.jpg','portrait','雨宮天','CD「The Only BLUE」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034311.jpg','portrait','雨宮天','上半身・衣装水色・麦藁帽子・両手髪・歯見せ・顔左向き/雑誌「声優アニメディア2018年7月号」応募者全員サービス 特製ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3716291.jpg','portrait','雨宮天','CD「誓い」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034312.jpg','portrait','雨宮天','バストアップ・衣装黒・右手頭・左手髪・背景黒・紫/雑誌「声優アニメディア2018年7月号」応募者全員サービス 特製ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg034310.jpg','portrait','雨宮天','横型・バストアップ・衣装グレー・左手耳元・背景ベージュ/雑誌「声優アニメディア2018年7月号」応募者全員サービス 特製ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3595178.jpg','portrait','雨宮天','雑誌「声優グランプリ 2018年1月号」アニメイト・ゲーマーズ特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3564149.jpg','portrait','雨宮天','フォトブック「雨宮天の有頂天・纏」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3580668.jpg','portrait','雨宮天','CD「Eternal」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3580667.jpg','portrait','雨宮天','CD「Eternal」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3716299.jpg','portrait','雨宮天','CD「誓い」ANIPLEX+特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453849.jpg','portrait','雨宮天','CD「irodori」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453848.jpg','portrait','雨宮天','CD「irodori」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453852.jpg','portrait','雨宮天','CD「irodori」TOWER RECORD特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3374129.jpg','portrait','雨宮天','ゲーマーズ限定フェア「春の声優まつり」'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3453853.jpg','portrait','雨宮天','CD「irodori」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3151121.jpg','portrait','雨宮天','横型/CD「Various BLUE」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3151126.jpg','portrait','雨宮天','横型/CD「Various BLUE」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4455920.jpg','portrait','雨宮天','「雨宮天ファースト写真集ソライロ～青と旅する～」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4388537.jpg','portrait','雨宮天','CD「Velvet Rays」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4388536.jpg','portrait','雨宮天','CD「Velvet Rays」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4388538.jpg','portrait','雨宮天','CD「Velvet Rays」ソフマップ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5372537.jpg','portrait','雨宮天','バストアップ・衣装白・正面・両手合わせ・胸元・背景白/CD「月灯り」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5372539.jpg','portrait','雨宮天','バストアップ・衣装白・体斜め・背景青/CD「月灯り」タワーレコード特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4478368.jpg','portrait','雨宮天','2Lサイズ/「雨宮天ファースト写真集ソライロ～青と旅する～」ライブ会場限定特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5311496.jpg','portrait','雨宮天','CD「Skyreach」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5311497.jpg','portrait','雨宮天','CD「Skyreach」ゲーマーズ特典'],
];

//from site: https://www.suruga-ya.jp/
//create array based on item box info
/*
let list = '\n';
for(let item of document.getElementsByClassName('item')) {
    let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
    if(url.includes('?')) continue;
	let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://www.suruga-ya.jp/database/pics/game/').toLowerCase();
    let tag = item.getElementsByClassName('title')[0].innerText.substring(0,item.getElementsByClassName('title')[0].innerText.indexOf('/'));
    let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
    list+= ("[1,'"+newurl+".jpg','portrait','"+tag+"','"+detail+"'],") + '\n';
	
}
*/

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
//generate profile category based on array
function renderGallery(array) {
	let profileCategoryHTML = document.createElement('DIV');
	profileCategoryHTML.classList.add('profile-category');
	for(let img of array)
	{
		if(img[0] == 0) continue;
		let profileBoxHTML = document.createElement('DIV');
		profileBoxHTML.classList.add('profile-box');
		let profileBoxImgHTML = document.createElement('DIV');
		profileBoxImgHTML.classList.add('profile-box-img');
		let imgHTML = document.createElement('IMG');
		imgHTML.classList.add(img[2]);
		imgHTML.setAttribute('alt', img[1]);
		imgHTML.setAttribute('src', spacerURL);
		imgHTML.title = img[4] == "" ? img[3] : img[4];
		profileBoxImgHTML.appendChild(imgHTML);
		profileBoxHTML.appendChild(profileBoxImgHTML);
		profileCategoryHTML.appendChild(profileBoxHTML);
	}
	if(document.getElementById('imgGallery').childNodes.length > 0) document.getElementById('imgGallery').innerHTML = '';
	document.getElementById('imgGallery').appendChild(profileCategoryHTML);
	
	for(let image of document.getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.removeAttribute('alt');
	}
	
	document.getElementById('loadedCount').innerText = 0;
	setTimeout(reloadImages,500);
	
	//add event listener when click on image
	/*for (let i = 0 ; i < document.getElementsByTagName('img').length ; i++)
	{
		document.getElementsByTagName('img')[i].addEventListener('click', function() { openViewer(document.getElementsByTagName('img')[i]); });
	}*/
}

function reloadImages() {
	let loadedImages = 0;
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.complete)
		{
			document.getElementById('loadedCount').innerText = ++loadedImages;
			if(image.width >= image.height) //if landscape
			{
				image.classList.remove('portrait');
				image.classList.add('landscape');
			}
		}
		else {
			let source = image.src;
			image.src = spacerURL;
			image.src = source;
			
		}
	}
	if(loadedImages < imgArray.length-1) setTimeout(reloadImages,500);
	if(loadedImages >= imgArray.length-1) setTimeout(function () { document.getElementById('description').style.display = 'none'; }, 2000);
}

//generate name labels
var labelArray = new Array();
for(let label of imgArray)
{
	if(label[0] == 0) continue;
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
	tickbox.addEventListener('click', function() { renderFilter(undefined); });
	if(tickbox.innerText == 'Select All') continue;
	tickbox.addEventListener('contextmenu', function() { renderFilter(this); });
}

function renderFilter(element) {
	let orientationArray = new Array();
	for (let label of document.getElementById('orientation').getElementsByTagName('input'))
	{
		if(label.checked == true)
			orientationArray.push(label.value);
	}
	
	let nameArray = new Array();
	if(element != undefined)
	{
		for (let label of document.getElementById('name').getElementsByTagName('input'))
		{
			label.checked = false;
			if(element.innerText == label.parentElement.innerText) label.checked = true;
		}
	}
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
	
	if(new Date() - time < 300 && (e.wheelDelta > 5 || e.wheelDelta < -5)) //conditions to prevent immediate snap
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
    //e.preventDefault();
    //return false;
}, false);

//"lazy load" on window load
window.onload = function () {
	renderGallery(imgArray);
}

function obtainArray() {
	//imgArray.push([]);
	return imgArray.filter(function(image) {
		return image[1];
	});
}

//slideshow event
let runSlideshow;
//start slideshow
function startSlideshow() {
	document.getElementById('description').style.display = 'none';
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