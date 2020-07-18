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
[1,'https://www.suruga-ya.jp/database/pics/game/gg062395.jpg','portrait','水瀬いのり','雑誌「声優アニメディア 2019年5月号」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg290722.jpg','portrait','水瀬いのり','印刷サイン入り/Blu-ray「Inori Minase LIVE TOUR 2019 Catch the Rainbow!」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg031054.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg031052.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg031055.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3846576.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「TRUST IN ETERNITY」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345803.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「Innocent flower」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3908054.jpg','portrait','水瀬いのり','横型・顔アップ・衣装青・左手胸元/「KING SUPER LIVE 2018」ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3908056.jpg','portrait','水瀬いのり','全身・衣装青・両手合わせ/「KING SUPER LIVE 2018」ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3908055.jpg','portrait','水瀬いのり','膝上・衣装青・両手髪/「KING SUPER LIVE 2018」ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3726654.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「BLUE COMPASS」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3685963.jpg','portrait','水瀬いのり','Blu-ray「Inori Minase 1st LIVE Ready Steady Go!」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3726659.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「BLUE COMPASS」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg009988.jpg','portrait','水瀬いのり','上半身・右手上げ・背景白・印刷サイン・メッセージ入り/「水瀬いのり 1st LIVE Ready Steady Go!」会場限定CD・DVD購入特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571127.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「きみと手をつなごう」/CD「Ready Steady Go!」TOWER RECORD特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3466780.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「楽しい夏になりますように!」/CD「アイマイモコ」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571131.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「ぎゅっと 離れないように」/CD「Ready Steady Go!」ソフマップ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3466782.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「ひとつひとつ言葉にしよう!」/CD「アイマイモコ」TOWER RECORD特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3466783.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「たくさん聴いてケローツ!」/CD「アイマイモコ」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571133.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「Fly High!」/CD「Ready Steady Go!」セブンネット・Neowing特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571126.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「Be All right!」/CD「Ready Steady Go!」新星堂・WonderGOO特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3211208.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り・「僕が開けてみせる」/CD「Starry Wish」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3345809.jpg','portrait','水瀬いのり','印刷サイン・メッセージ入り/CD「Innocent flower」KING e-shop特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3033695.jpg','portrait','水瀬いのり','CD「harmony ribbon」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3033698.jpg','portrait','水瀬いのり','CD「harmony ribbon」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/bg031054.jpg','portrait','水瀬いのり','印刷サイン入り/CD「Catch the Rainbow!」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326614.jpg','portrait','竹達彩奈','全身・衣装白・左手曲げ・右手スカート・顔左向き・背景オレンジ/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg315613.jpg','portrait','竹達彩奈','雑誌「月刊ドラゴンエイジ 2020年1月号増刊 ヤングドラゴンエイジ VOL.1」メロンブックス特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326610.jpg','portrait','竹達彩奈','横型・バストアップ・衣装黒・白・チェック柄・右手上げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg277138.jpg','portrait','竹達彩奈','DVD・BD「LIVE HOUSE TOUR 2019「A」」AR動画付きL判ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326612.jpg','portrait','竹達彩奈','横型・顔アップ・衣装白・右手口元・左向き・背景白/「竹達彩奈 LIVE HOUSE TOUR 2019『A』-Analyze-/-Another-」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326608.jpg','portrait','竹達彩奈','横型・バストアップ・衣装黒・右手曲げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326613.jpg','portrait','竹達彩奈','顔アップ・衣装白・右手頬・顔左向き・背景白/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326609.jpg','portrait','竹達彩奈','全身・衣装黒・白・チェック柄・体左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326611.jpg','portrait','竹達彩奈','横型・全身・座り・衣装黒・白・チェック柄・右手曲げ・左向き/「竹達彩奈 LIVE HOUSE TOUR　2019『A』-Analyze-／-Another-」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326615.jpg','portrait','竹達彩奈','顔アップ・衣装白・両手頭・首傾げ・背景オレンジ/「竹達彩奈 LIVE HOUSE TOUR 2019『A』-Analyze-/-Another-」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326607.jpg','portrait','竹達彩奈','横型・印刷サイン・メッセージ入り・全身・座り・衣装白・黒・両手交差・右向き・「HEAVEN’S ROCK さいたま新都心VJ-3」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 埼玉公演ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326604.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・全身・衣装黒・白・右手壁・左足上げ・左向き・「Hiroshima CAVE-BE」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 広島公演ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131822.jpg','portrait','竹達彩奈','バストアップ・衣装白・両手髪/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326603.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・全身・衣装白・黒・左手上げ・左向き・「UMEDA CLUB QUATTRO」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 大阪公演ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131824.jpg','portrait','竹達彩奈','横型・顔アップ・衣装白・両手下げ/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131828.jpg','portrait','竹達彩奈','全身・座り・衣装白・黒・腕組み/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131829.jpg','portrait','竹達彩奈','横型・顔アップ・衣装白・黒・体右向き/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967525.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」Neowing特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967514.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131827.jpg','portrait','竹達彩奈','膝上・座り・衣装白・黒・両手下げ/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967518.jpg','portrait','竹達彩奈','CD「Innocent Notes」きゃにめ特典AR動画付きブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131826.jpg','portrait','竹達彩奈','横型・衣装白・黒・両手下げ/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3969559.jpg','portrait','竹達彩奈','CD「Innocent Notes」初回封入特典 竹達彩奈×三田製麺所 コラボカード'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg023635.jpg','portrait','竹達彩奈','上半身・衣装紺・両手カップ/「竹達彩奈×富士急ハイランド『あやちハイランド』」コラボフード特典 オリジナルブロマイドカード'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326606.jpg','portrait','竹達彩奈','横型・印刷サイン・メッセージ入り・バストアップ・衣装白・黒・左手曲げ・背景赤・「新宿ReNY」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 東京公演ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326598.jpg','portrait','竹達彩奈','上半身・衣装ベージュ・黒・右手曲げ・顔左向き・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg131823.jpg','portrait','竹達彩奈','横型・バストアップ・衣装白・両手耳元/「竹達彩奈 LIVE HOUSE TOUR 2019 A」ブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326602.jpg','portrait','竹達彩奈','横型・上半身・衣装紺・白・ストライプ・帽子・左手顔・左向き・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967517.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326601.jpg','portrait','竹達彩奈','上半身・衣装白・赤・帽子・右手壁・首傾げ・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326605.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・膝上・座り・衣装白・黒・左向き・首傾げ・「NAGOYA ReNY limited」/「竹達彩奈 LIVE HOUSE TOUR 2019 A」会場限定CD・Blu-ray・DVD購入特典 愛知公演ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967515.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」Amazon特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326597.jpg','portrait','竹達彩奈','膝上・衣装茶色・赤・帽子・座り・左向き・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326599.jpg','portrait','竹達彩奈','横型・上半身・衣装黒・ベージュ・右手胸元・首傾げ・野外/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットA'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg023633.jpg','portrait','竹達彩奈','膝上・衣装水色・両手髪/「竹達彩奈×富士急ハイランド『あやちハイランド』」アトラクションラリー特典 オリジナルブロマイドカード'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967519.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・2Lサイズ/CD「Innocent Notes」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3967524.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/CD「Innocent Notes」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg023634.jpg','portrait','竹達彩奈','膝上・衣装水色・左手曲げ・観覧車/「竹達彩奈×富士急ハイランド『あやちハイランド』」アトラクションラリー特典 オリジナルブロマイドカード'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3964223.jpg','portrait','竹達彩奈','雑誌「Pick-up Voice 2019年3月号 vol.132」公式オンラインストア(EMTG STORE)特典フォト'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3800669.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/Blu-ray・DVD「竹達彩奈 BESTLIVE”apple feuille”」キャラアニ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg326600.jpg','portrait','竹達彩奈','上半身・衣装赤・座り・両手顎・右向き/「竹達彩奈ひみつのラジオ～あやラジ～」公開録音 オリジナルブロマイドセットB'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3772085.jpg','portrait','竹達彩奈','「竹達彩奈 バースデーイベント 2018」37card～Pamphlet Commentary ver.～'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3800667.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/Blu-ray・DVD「竹達彩奈 BESTLIVE”apple feuille”」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3666093.jpg','portrait','竹達彩奈','全身・衣装白・座り・両手ブランケット/「竹達彩奈 BEST LIVE“apple feuille”」ブロマイドセット(おうちver.)'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3800668.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り/Blu-ray・DVD「竹達彩奈 BESTLIVE”apple feuille”」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3630737.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「キリッ!!」/CD「OH MY シュガーフィーリング!!」セブンネット特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3630738.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「おすまし」/CD「OH MY シュガーフィーリング!!」キャラアニ.com特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3747358.jpg','portrait','竹達彩奈','フォトブック「stone～いしからはじまるものがたり～」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571137.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「あやなーあやなーあやなー!」/CD「apple feuille【CD+BD盤】・【CD+DVD盤】」キャラアニ.com特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3630733.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「ちょこあげるー!」/CD「OH MY シュガーフィーリング!!」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3630739.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「あー早くこないかなー」/CD「OH MY シュガーフィーリング!!」Neowing特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg151517.jpg','portrait','竹達彩奈','上半身/Blu-ray「AYANA HOLIDAY in Hawaii」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3666098.jpg','portrait','竹達彩奈','横型・顔アップ・右手マフラー赤・左向き/「竹達彩奈 BEST LIVE“apple feuille”」ブロマイドセット(おでかけver.)'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571138.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「とぅるっとゆーるー」・2Lサイズ/CD「apple feuille【CD+BD盤】・【CD+DVD盤】」げっちゅ屋特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3571136.jpg','portrait','竹達彩奈','印刷サイン・メッセージ入り・「すきなんだもん!」/CD「apple feuille」きゃにめ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3606636.jpg','portrait','竹達彩奈','膝上・衣装白紺・帽子赤・両手重ね・首傾げ・窓/CD「apple feuille」発売記念イベント きゃにめ回特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3666099.jpg','portrait','竹達彩奈','横型・上半身・衣装ベージュ・マフラー赤・左向き/「竹達彩奈 BEST LIVE“apple feuille”」ブロマイドセット(おでかけver.)'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3666095.jpg','portrait','竹達彩奈','横型・バストアップ・衣装白・両手フード/「竹達彩奈 BEST LIVE“apple feuille”」ブロマイドセット(おうちver.)'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3666092.jpg','portrait','竹達彩奈','上半身・衣装白・左向き・左手ボウル/「竹達彩奈 BEST LIVE“apple feuille”」ブロマイドセット(おうちver.)'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3606633.jpg','portrait','竹達彩奈','「P’s LIVE!05 Go! Love＆Passion!!」CD・DVD物販購入特典パンフレットアザーカットブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3655214.jpg','portrait','竹達彩奈','顔アップ・衣装黒.白・左向き/「P’s LIVE!05 Go! Love＆Passion!!」竹達彩奈セット同梱ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3606635.jpg','portrait','竹達彩奈','膝上・衣装白・前屈み・右寄り・植物/CD「apple feuille」発売記念イベント ゲーマーズ・とらのあな・タワーレコード渋谷店、新宿店・SHIBUYA TSUTAYA回特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3655215.jpg','portrait','竹達彩奈','上半身・衣装黒.白・右手顎/「P’s LIVE!05 Go! Love＆Passion!!」竹達彩奈セット同梱ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3655216.jpg','portrait','竹達彩奈','バストアップ・衣装黒.白・両手顎/「P’s LIVE!05 Go! Love＆Passion!!」竹達彩奈セット同梱ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204945.jpg','portrait','竹達彩奈','CD「Lyrical Concerto」きゃにめ.jp特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204953.jpg','portrait','竹達彩奈','CD「Lyrical Concerto」TOWER RECORD特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204949.jpg','portrait','竹達彩奈','CD「Lyrical Concerto」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3089722.jpg','portrait','竹達彩奈','CD「Miss.Revolutionist」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204947.jpg','portrait','竹達彩奈','CD「Lyrical Concerto」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3373124.jpg','portrait','竹達彩奈','「竹達彩奈フォトブック Flower Garden」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3373127.jpg','portrait','竹達彩奈','「竹達彩奈フォトブック Flower Garden」文教堂・アニメガ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4472923.jpg','portrait','竹達彩奈','CD「Hey!カロリーQueen」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5378504.jpg','portrait','竹達彩奈','写真集「竹達彩奈フォトブック Ayana in Fairy Tales」福家書店限定特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3089717.jpg','portrait','竹達彩奈','CD「Miss.Revolutionist」きゃにめ.jp特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3089718.jpg','portrait','竹達彩奈','CD「Miss.Revolutionist」アニメガ・文教堂特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4472917.jpg','portrait','竹達彩奈','CD「Hey!カロリーQueen[初回盤]」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4454120.jpg','portrait','竹達彩奈','CD「Little*Lion*Heart」きゃにめ.jp特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4454123.jpg','portrait','竹達彩奈','CD「Little*Lion*Heart」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4472911.jpg','portrait','竹達彩奈','CD「Hey!カロリーQueen」アニメガ・文教堂特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4454125.jpg','portrait','竹達彩奈','CD「Little*Lion*Heart」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4454131.jpg','portrait','竹達彩奈','CD「Little*Lion*Heart」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4454129.jpg','portrait','竹達彩奈','CD「Little*Lion*Heart」タワーレコード特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455657.jpg','portrait','竹達彩奈','ライブフォト・全身・衣装ピンク・白・右向き・右手腰・左足曲げ/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455646.jpg','portrait','竹達彩奈','ライブフォト・横型・上半身・衣装白・青・右手人差し指立て/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893617.jpg','portrait','竹達彩奈','「わんだふるワールド」(初回限定盤)ソフマップ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455639.jpg','portrait','竹達彩奈','ライブフォト・膝上・衣装赤・白・花・トナカイのカチューシャ・右向き・右手パー/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455663.jpg','portrait','竹達彩奈','ライブフォト・横型・膝上・衣装緑・白・右手上げ・目線右/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455649.jpg','portrait','竹達彩奈','ライブフォト・膝上・衣装ピンク・白・右向き・右手胸元・目線右/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455640.jpg','portrait','竹達彩奈','ライブフォト・横型・膝上・衣装赤・白・花・トナカイのカチューシャ・左向き/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455645.jpg','portrait','竹達彩奈','ライブフォト・横型・上半身・衣装白・左向き・左手耳元/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455667.jpg','portrait','竹達彩奈','ライブフォト・全身・衣装緑・白・左向き・両手曲げ・左手マイク/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455651.jpg','portrait','竹達彩奈','ライブフォト・全身・衣装ピンク・白・両手上げ・目線左/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455662.jpg','portrait','竹達彩奈','ライブフォト・横型・膝上・衣装緑・後ろ向き・右手スマートフォン上げ/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg455652.jpg','portrait','竹達彩奈','ライブフォト・横型・全身・衣装ピンク・白・右手グー・足広げ/「竹達彩奈 Live Tour 2014“Colore Serenata”」フォトチョイス'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5385637.jpg','portrait','竹達彩奈','CD「齧りかけの林檎」TOWER RECORD(タワーレコード)特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4335563.jpg','portrait','竹達彩奈','横型・膝上・衣装白・両手顎・印刷サイン・メッセージ入り・「12月のライブで会おうね」・2Lサイズ/CD「Colore Serenata[完全限定盤/初回盤]」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5378503.jpg','portrait','竹達彩奈','写真集「竹達彩奈フォトブック Ayana in Fairy Tales」ゲーマーズ限定特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893615.jpg','portrait','竹達彩奈','「わんだふるワールド」(初回限定盤)ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893610.jpg','portrait','竹達彩奈','「わんだふるワールド」アニメガ・JBOOK・文教堂特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3010798.jpg','portrait','竹達彩奈','膝上・衣装白・ピンク・黒・印刷サイン・メッセージ入り・「週末シンデレラだがや～」/CD『週末シンデレラ』発売記念イベント「あやちの週末in名古屋」特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893613.jpg','portrait','竹達彩奈','「わんだふるワールド」きゃにめ.jp特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893620.jpg','portrait','竹達彩奈','「わんだふるワールド」Neowing特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g5893612.jpg','portrait','竹達彩奈','「わんだふるワールド」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224766.jpg','portrait','竹達彩奈','CD「週末シンデレラ」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224757.jpg','portrait','竹達彩奈','CD「週末シンデレラ」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224760.jpg','portrait','竹達彩奈','CD「週末シンデレラ」HMV特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224762.jpg','portrait','竹達彩奈','CD「週末シンデレラ」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224758.jpg','portrait','竹達彩奈','CD「週末シンデレラ」アニメガ・JBOOK・文教堂特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224763.jpg','portrait','竹達彩奈','CD「週末シンデレラ」セブンネットショッピング特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224761.jpg','portrait','竹達彩奈','CD「週末シンデレラ」きゃにめ.jp特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6224765.jpg','portrait','竹達彩奈','CD「週末シンデレラ」タワーレコード特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6469394.jpg','portrait','竹達彩奈','CD「apple symphony」全形態 TSUTAYA RECORDS特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6469393.jpg','portrait','竹達彩奈','横型/CD「apple symphony」全形態 タワーレコード特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6675553.jpg','portrait','竹達彩奈','CD「apple symphony」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6469390.jpg','portrait','竹達彩奈','CD「apple symphony」スペシャル盤・初回限定盤 ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6490268.jpg','portrait','竹達彩奈','CD「時空ツアーズ」その他法人特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g6677810.jpg','portrait','竹達彩奈','CD「時空ツアーズ」HMV特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3982186.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「アイ」TOWER RECORDS特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3982188.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「アイ」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3996272.jpg','portrait','沼倉愛美','雑誌「Pick-up Voice 2019年4月号 vol.133」公式オンラインストア(EMTG STORE)特典フォト'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3982189.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「アイ」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3293641.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「Climber’s High!」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3409982.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り・「歌詞も書いてます。」/CD「My LIVE」TOWER RECORD特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3416172.jpg','portrait','沼倉愛美','全身・座り・衣装白・両手合わせ/雑誌「声優アニメディア 2017年7月号」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204986.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「叫べ」HMV特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/gg483720.jpg','portrait','沼倉愛美','雑誌「Pick-up Voice 2017年3月号 vol.108」公式オンラインストア(EMTG STORE)特典フォト'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204981.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「叫べ」ビクターエンタテインメントオンラインショップ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204982.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「叫べ」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3293643.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「Climber’s High!」とらのあな特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3204989.jpg','portrait','沼倉愛美','印刷サイン・メッセージ入り/CD「叫べ」ソフマップ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3494176.jpg','portrait','沼倉愛美','沼倉愛美/横型・全身・衣装白・うつ伏せ・右手頬杖・背景ピンク/Trident Artist Book「Blue Memory」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3494181.jpg','portrait','沼倉愛美','沼倉愛美/膝上・座り・衣装白・両手クッション・背景ピンク/Trident Artist Book「Blue Memory」通販予約特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3964143.jpg','portrait','渕上舞','印刷サイン・メッセージ入り・2Lサイズ/CD「Journey ＆ My music」アニメイト特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3609178.jpg','portrait','渕上舞','雑誌「声優アニメディア 2018年2月号」アニメイト特典生写真'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3686792.jpg','portrait','渕上舞','膝上・ぶたの乗り物・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」ゲーマーズ特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3686790.jpg','portrait','渕上舞','横型・上半身・両手絵馬・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」とらのあな特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3686789.jpg','portrait','渕上舞','バストアップ・右手鳥・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」アニメイト特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3686793.jpg','portrait','渕上舞','横型・バストアップ・口開け・印刷サイン、メッセージ入り/DVD「声優散歩～渕上舞～」ショップ.学研特典'],
[1,'https://www.suruga-ya.jp/database/pics/game/g3494175.jpg','portrait','渕上舞','渕上舞/上半身・衣装白・両手タンス・背景青/Trident Artist Book「Blue Memory」ゲーマーズ特典ブロマイド'],
[1,'https://www.suruga-ya.jp/database/pics/game/g4237193.jpg','portrait','茅野愛衣','写真集「LETTERS」ゲーマズ特典'],
[2,'https://www.suruga-ya.jp/database/pics/game/g4237192.jpg','portrait','茅野愛衣','写真集「LETTERS」アニメイト特典'],
];

//from site: https://www.suruga-ya.jp/
//create array based on item box info
/*
let list = '\n';
for(let item of document.getElementsByClassName('item')) {
    let url = item.getElementsByTagName('p')[0].getElementsByTagName('a')[0].href;
    if(url.includes('?')) url = url.substring(0,url.indexOf('?'));
	let newurl = url.replace('https://www.suruga-ya.jp/product/detail/','https://www.suruga-ya.jp/database/pics/game/').toLowerCase();
    let tag = item.getElementsByClassName('title')[0].innerText.substring(0,item.getElementsByClassName('title')[0].innerText.indexOf('/'));
    let detail = item.getElementsByClassName('title')[0].innerText.substring(item.getElementsByClassName('title')[0].innerText.indexOf('/')+1);
    list+= ("[1,'"+newurl+".jpg','portrait','"+tag+"','"+detail+"'],") + '\n';
	
}
*/

let spacerURL = 'https://knneo.github.io/resources/spacer.gif';
let lowestHeight = 9999;
let highestHeight = 0;
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
	lowestHeight = 9999;
	highestHeight = 0;
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
		
		if(window.innerWidth >= 640)
		{
			if(image.height > highestHeight && image.height > 1) //resize to highest height
				highestHeight = image.height;
			else
				image.style.height = '50vh';
		}
		else {
			if(image.height < lowestHeight && image.height > 1) //resize to lowest height
				lowestHeight = image.height;
			else
				image.height = lowestHeight;
		}
		
	}
	if(loadedImages < imgArray.length-1) setTimeout(reloadImages,500);
	if(loadedImages >= imgArray.length-1) setTimeout(function () { document.getElementById('description').style.display = 'none'; }, 2000);
	checkImageHeights();
}

function checkImageHeights() {
	for(var image of document.getElementsByTagName("img"))
	{
		if(image.height < highestHeight)
		{
			setTimeout(reloadImages,500);
			return;
		}
			
	}
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
	if(tickbox.innerText == '全選') continue;
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
	
	if((new Date() - time < 500 && (e.wheelDelta > 50 || e.wheelDelta < -50))
		) //conditions to prevent immediate snap
	{
		reSnap();
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

function reSnap() {
	setTimeout( function() { 
		//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','x proximity');
		document.getElementsByClassName('profile-category')[0].classList.add('snap');
	}, 500);
	setTimeout( function() { 
		//document.getElementsByClassName('profile-category')[0].style.setProperty('scroll-snap-type','none');
		document.getElementsByClassName('profile-category')[0].classList.remove('snap');
	}, 600);
}

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

//prevent right click events on filters
document.getElementById('filter').addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
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