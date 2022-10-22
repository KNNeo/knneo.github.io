//--DEFAULT SETTINGS--//
const channels = {
"RYTHEMのハモり便":"https://www.youtube.com/channel/UC9I_sHLBPHRK77f0Xir7V-g",
"miwa official YouTube channel":"https://www.youtube.com/channel/UC9cz0t8P3VkTHY7xjbS8zHA",
"MOSHIMO Channel":"https://www.youtube.com/channel/UCuyPn5fn_i7CCBbxfE6MMWA",
"halca Official YouTube Channel":"https://www.youtube.com/channel/UCMiL4aomAhQl1wdT2YlVQ8Q",
"羊文学":"https://www.youtube.com/channel/UCm0qsuAG6RN2FYKZ_r1nPyg",
"GLIM SPANKY":"https://www.youtube.com/channel/UCJ17zOieJYpGYqXIyG1XpEg",
"ポルノグラフィティ Official YouTube Channel":"https://www.youtube.com/channel/UCJeCKqR6uqrdCw6021WuWlA",
"石原夏織 YouTube Official Channel":"https://www.youtube.com/channel/UCMiRnWRzngDpLVrcpcGbM7A",
"CHiCO with HoneyWorks チャンネル":"https://www.youtube.com/c/chicoxxx",
"麻倉もも Official YouTube Channel":"https://www.youtube.com/channel/UCeO-6koTkcLNKLFcCiW1SGQ",
"Kroi":"https://www.youtube.com/channel/UCc9CJVSnJx5WTq8E9T4bIoA",
"cluppo Official YouTube":"https://www.youtube.com/c/cluppoOfficialYouTube",
"水瀬いのり":"https://www.youtube.com/channel/UCYBwKaLwCGY7k3auR_FLanA",
"ナナヲアカリ OFFICIAL":"https://www.youtube.com/channel/UCrrNHoXQ1uTYsR6v41pDalQ",
"fuzzy knot":"https://www.youtube.com/channel/UCUXGH2QGObyKqOCfHqJ0xmQ",
"Cwondo Cwondo":"https://www.youtube.com/channel/UC_-rskCmv9BMgii2ZB-Rz9w",
"A-Sketch MUSIC LABEL":"https://www.youtube.com/c/asketch",
"SCANDAL":"https://www.youtube.com/channel/UCSNX8VGaawLFG_bAZuMyQ3Q",
"Sangatsu No Phantasia Official YouTube Channel":"https://www.youtube.com/channel/UC4lk0Ob-F3ptOQUUq8s0pzQ",
"Yoshinori Sunahara official":"https://www.youtube.com/channel/UC6pdBu6sa8htyojcVIPXANA",
"倖田來未":"https://www.youtube.com/channel/UCCI_DJ1Q-WYGS8bVXsW_V5w",
"シナリオアート公式 [ Scenarioart ]":"https://www.youtube.com/c/TheScenarioart",
"神はサイコロを振らない":"https://www.youtube.com/channel/UCipIkLmhz2DFOL0-Rng_Qog",
"ハンブレッダーズOFFICIAL":"https://www.youtube.com/channel/UCzw-qPteYx693R_hwaBA26w",
"Creepy Nuts":"https://www.youtube.com/channel/UCEc1YzMOSKKtJD7H-q71HgQ",
"SPECIAL OTHERS":"https://www.youtube.com/channel/UCzf8I8bexvhTIPNmecwCopA",
"Nao Toyama":"https://www.youtube.com/channel/UCUqd0xbC7x1xc_T7vERlMYQ",
"TrySail（麻倉もも・雨宮天・夏川椎菜）official YouTube channel":"https://www.youtube.com/channel/UCuI2in6tTAjsaqzdeOeWZkQ",
"鈴木雅之 Official YouTube Channel":"https://www.youtube.com/channel/UCUo8fGx9iLwNhpA0_XSPvfw",
"鈴木愛理":"https://www.youtube.com/c/airisuzukich",
"なすお☆ちゃん寝る。":"https://www.youtube.com/c/%E3%81%AA%E3%81%99%E3%81%8A-%E3%81%A1%E3%82%83%E3%82%93%E5%AF%9D%E3%82%8B",
"The Floor /ザ•フロア":"https://www.youtube.com/channel/UCQp4pb1Ucd-v3VgoJPedxNg",
"ジェニーハイ":"https://www.youtube.com/channel/UCZUm9b2e5w54cQM7MVVR_9A",
"サイダーガール":"https://www.youtube.com/channel/UCwG5cZ1dCYXAbrw_P-dQwiw",
"上野大樹":"https://www.youtube.com/channel/UCq1GFqbDYmEFHCjkJ_U0aXg",
"橋本絵莉子 Official YouTube Channel":"https://www.youtube.com/channel/UCjQm8wE4WQCnUqBWBxDYtzw",
"雨宮天公式YouTubeチャンネル":"https://www.youtube.com/channel/UCc4xpujLxnUBSI1XX-SdldQ",
"THE ORAL CIGARETTES":"https://www.youtube.com/channel/UC2-n_x0Xt_-wLdOilnp2m7A",
"Victor Entertainment":"https://www.youtube.com/c/VictorMusicChannel",
"緑黄色社会":"https://www.youtube.com/channel/UC_1GPhYlXI2ka2ji5gnqWFQ",
"only in dreams / monochro records / SPM":"https://www.youtube.com/user/spmltdjp",
"amazarashi Official YouTube Channel":"https://www.youtube.com/channel/UCjU51lhtpje-r0eF4b0jpbw",
"Sony Music (Japan)":"https://www.youtube.com/sonymusicjapan",
"Cocco":"https://www.youtube.com/channel/UC-JDndHxD9_dQLCeU-Voj0g",
"DYGL":"https://www.youtube.com/channel/UCpolcCaJwW6pYHwMWKmvfHg",
"ASIAN KUNG-FU GENERATION Official YouTube Channel":"https://www.youtube.com/channel/UC3J-txytRWiRtNXrLS95eEw",
"SID":"https://www.youtube.com/channel/UC7jHTm2dDkhckKyOWUavuXg",
"小倉 唯 YouTube OFFICIAL CHANNEL":"https://www.youtube.com/channel/UC32MfqfhidJPaarmKQrUR2Q",
"wacci OFFICIAL YouTube CHANNEL":"https://www.youtube.com/channel/UCNMn4Nhl-E3iaSMab0Y_b4A",
"Sans (KareKorecords)":"https://www.youtube.com/channel/UCWDQBfW-ZhGnjCRvuNyx6Lg",
"ORESKABAND":"https://www.youtube.com/channel/UC0niXveszBBHLFf0jDAYKQA",
"ヒグチアイ Ai Higuchi Official YouTube Channel":"https://www.youtube.com/channel/UCaw0rNYSe89OPzix05flcsg",
"竹達彩奈":"https://www.youtube.com/channel/UCSu7Az1GlqC1Qh9btdPBZrg",
"FlyingDog":"https://www.youtube.com/c/flyingDOGch",
"mol-74":"https://www.youtube.com/channel/UCnBnBkAEbtR1-s87GZhUQtg",
"SHE'S Channel":"https://www.youtube.com/channel/UCvSxOr1GMmFOMgP8EV40Bcw",
"yanaginagi official":"https://www.youtube.com/channel/UCty-AHEQn5dkYr2oq6fd4yw",
"SPYAIR Official YouTube Channel":"https://www.youtube.com/channel/UCvkOJJ9uFi9hto95bD3XO7Q",
"Mami Kawada Officila YouTube Channel":"https://www.youtube.com/channel/UCmOI4iM4HiLhR-Pq9CtttjA",
"あかせ あかり【Akase Akari】":"https://www.youtube.com/channel/UC_7hhYHUWNcabctizf9zn8w",
"YUKI YouTube Official Channel":"https://www.youtube.com/channel/UCwYZk061Aw91ZtIid0fmkQg",
"花澤香菜":"https://www.youtube.com/channel/UC1ACSJY8lvbo-7koOpBtD4w",
"大原ゆい子Official YouTube":"https://www.youtube.com/channel/UCaDjsWqUnBETKJ2NJqwdUeg",
"笹川真生":"https://www.youtube.com/channel/UCd0oSpX1KiQ0pBl8g4XcwOQ",
"夏川椎菜 Official YouTube Channel":"https://www.youtube.com/channel/UCSdVtmKcfuKTJ1C209-VnLA",
"spira spica Official YouTube Channel (SMEJ) ":"https://www.youtube.com/channel/UCcrVKHnn9O3z0Ao6sUPE7nA",
"NO BUSES BAND":"https://www.youtube.com/channel/UCA8Jt9lFX96LcQs5wDDWlUg",
"Aimer Official YouTube Channel":"https://www.youtube.com/channel/UCR1zT1s524Hbc85bdvno_8w",
"E ve":"https://www.youtube.com/channel/UCUXfRsEIJ9xO1DT7TbEWksw",
"a flood of circle Official Channel":"https://www.youtube.com/channel/UCtJMmRK3mHODpEgLYa7UMjg",
"tacica":"https://www.youtube.com/channel/UCKdmVndsDH2cagDZ6s7JvWw",
"BAR official channel":"https://www.youtube.com/user/BARofficialch",
"GARNiDELiA":"https://www.youtube.com/channel/UCAYfguaShVaNDU561_jJoOQ",
"Kitri Official":"https://www.youtube.com/channel/UC0LTDFHV9KdULlc0kQhDi0w",
"鬼頭明里 Official Artist Channel":"https://www.youtube.com/channel/UCU_E2DHcyQu-Toohyd1vzRw",
"Anthony Lazaro Music":"https://www.youtube.com/c/AnthonyLazaroMusic",
"Yogee New Wavesㅤ":"https://www.youtube.com/channel/UCK8yCL7OaVb2PLg2XUh7Xyg",
"Penthouse":"https://www.youtube.com/channel/UC5HwceAVbRH7sKrmucI5onQ",
"Sisters In The Velvet":"https://www.youtube.com/channel/UC85un61lFR-5OyTrlEwkHBw",
"Suisei Channel":"https://www.youtube.com/channel/UC5CwaMl1eIgY8h02uZw7u8A",
"イヤホンズ公式チャンネルEarphones official channel":"https://www.youtube.com/channel/UCJFiq8b262KUx2px_iIjaVw",
"PURPLE HUMPTY 【Official YouTube Channel】":"https://www.youtube.com/channel/UCSRVQMyzVa7q--IZJbWokyg",
"ClariS Official YouTube Channel":"https://www.youtube.com/channel/UC-zeaPnxZHE3EcTyVl1fTdw",
"Lantis Channel":"https://www.youtube.com/c/LantisJp2014",
"カグラナナchannel／ななかぐら":"https://www.youtube.com/channel/UCbfv8uuUXt3RSJGEwxny5Rw",
"never young beach":"https://www.youtube.com/channel/UCQZXPed4sJ6u3MddgTsTc3w",
"NBCUniversal Anime/Music":"https://www.youtube.com/c/NBCUniversalAnimeandMusic",
"GINGNANGBOYZofficial":"https://www.youtube.com/channel/UC1rE0O-tgan8A2NtVSRInxA",
"cinnamon' room":"https://www.youtube.com/channel/UCs3WiGO6L9StZX79KJImqXA",
"富田美憂 Miyu Tomita -Music Channel-":"https://www.youtube.com/channel/UCvLYHd1gVyZP7txA_vL89Ng",
"タイナカ彩智":"https://www.youtube.com/user/tainakasachi0430",
"POLKADOT STINGRAY":"https://www.youtube.com/channel/UCZ9DY_FlqUYh45R0uSmOIgA",
"vivid undress":"https://www.youtube.com/channel/UCImUYkG5UNCW3zEfjZSAEqw",
"高橋李依 / Rie Takahashi Official YouTube Channel":"https://www.youtube.com/channel/UC9xUIUtv3pyt_s_LtCLWP_Q",

};

//--COMMON EVENTS--//
//on startup
const windowHeight = window.innerHeight;
const windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';

//--FUNCTIONS--//
let list = [];

let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		window['list'] = JSON.parse(this.responseText);
		//code here
		if(window['list'] != null) startup();
	}
};
xmlhttp.open("GET", "https://knneo.github.io/video-list/list.json", true);
xmlhttp.send();

function startup() {
	list = Array.from(window['list']);
	renderMenu();
	renderList();
	window.addEventListener('scroll', fadeIn); 
	window.scrollTo(0,0);
}

function fadeIn() {
	let boxes = document.querySelectorAll(".tile");
    for (let elem of boxes) {
        // let elem = boxes[i]
        let distInViewFromTop = elem.getBoundingClientRect().top - window.innerHeight + 20;
        let distInViewFromBottom = elem.getBoundingClientRect().bottom + window.innerHeight - 20;
		let inView = distInViewFromTop <= 0 && distInViewFromBottom > window.innerHeight;
		let thumbnail = elem.querySelector('img');
        if (thumbnail.complete && inView) {
			thumbnail.src = thumbnail.getAttribute('data-image');
            elem.classList.add("tile-view");
            setTimeout(function() { elem.classList.add("no-delay"); }, 500);
        }
		else {
            elem.classList.remove("tile-view");
            elem.classList.remove("no-delay");
        }
    }
}

function renderMenu() {
	// document.querySelector('.menu').innerHTML = '';
	
	let sort = document.createElement('a');
	sort.classList.add('material-icons');
	sort.title = 'Sort by Video Title';
	sort.innerText = 'swap_vert';
	sort.addEventListener('click', toggleSort);
		
	document.querySelector('.menu').appendChild(sort);
	
	let shuffle = document.createElement('a');
	shuffle.classList.add('material-icons');
	shuffle.title = 'Play Random Video';
	shuffle.innerText = 'shuffle';
	shuffle.addEventListener('click', randomVideo);
		
	document.querySelector('.menu').appendChild(shuffle);
}

function toggleSort(event) {
	switch(event.target.innerText) {
		case 'swap_vert':
			event.target.innerText = 'south';
			list.sort(function(a,b) {
				return a.title.localeCompare(b.title, 'ja');
			});
			break;
		case 'south':
			event.target.innerText = 'north';
			list.sort(function(a,b) {
				return b.title.localeCompare(a.title, 'ja');
			});
			break;
		case 'north':
			event.target.innerText = 'swap_vert';
			list = Array.from(window['list']);
			break;
		default:
			break;
	}
	renderList();
}

function randomVideo(event) {
	let random = list[Math.floor(Math.random() * list.length)];
	window.open(random.link);
}

function renderList() {
	document.querySelector('.list').innerHTML = '';
	
	for(let v of list)
	{
		let video = document.createElement('div');
		video.classList.add('box');
		video.classList.add('tile');
		video.classList.add('shadowed');
		video.id = v.id;
		
			let thumbnail = document.createElement('img');
			thumbnail.classList.add('thumbnail');
			thumbnail.setAttribute('data-image', v.thumbnail);
			// thumbnail.style.backgroundSize = 'contain';
			// thumbnail.style.backgroundRepeat = 'no-repeat';
			// thumbnail.style.backgroundPosition = 'center';
			thumbnail.style.width = '120px';
			thumbnail.addEventListener('click', function() {
				window.open(v.link);
			});
			
			video.appendChild(thumbnail);
			
			let title = document.createElement('div');
			
				let titleLink = document.createElement('a');
				titleLink.href = v.link;
				titleLink.innerText = v.title;
				titleLink.setAttribute('target','_blank');
			
				title.appendChild(titleLink);
								
			video.appendChild(title);	
			
			let channel = document.createElement('div');

				let channelLink = document.createElement('a');
				channelLink.innerText = v.channel;
				if(channels[v.channel])
				{
					channelLink.classList.add('video-link');
					channelLink.href = channels[v.channel];
					channelLink.setAttribute('target','_blank');
					// channelLink.style.cursor = 'pointer';
					// channelLink.addEventListener('click', function() {
						// window.open();
					// });
				}
				
				channel.appendChild(channelLink);
				
			video.appendChild(channel);
		
		document.querySelector('.list').appendChild(video);
	}
	
	setTimeout(fadeIn, 200);
}

function loadImages() {
	for(let image of document.querySelectorAll('.thumbnail'))
	{
		image.src = image.getAttribute('data-image');
	}
}

function addUrlClause(url) {
	return "url('" + url + "')";
}
