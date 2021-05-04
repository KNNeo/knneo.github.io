//--SETTINGS--//
let playerHeight = 400;
let mosaicArray = new Array();
// mosaicArray.push(['imgURL','appleMusicId','spotifyId']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/c7/a1/c7/c7a1c7b8-c697-2509-40a2-23b08a64fbad/PCCG_01967_A.jpg/500x500cc.jpeg','1562664393','32CKhuDhSINttWOAdUNfeT']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/e3/c5/83/e3c58354-4649-7e15-885f-ca4d513898f8/KICM-92079.jpg/500x500cc.jpeg','1558995369','7gLRNCBoLQh8tHb6aeSpl2']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/1c/cc/ce/1cccced5-4824-14ed-7226-6ddee11f997e/4547366490237.jpg/500x500cc.jpeg','1545321704','738yVyo1lZE9Sv1rY5VTqF']);
mosaicArray.push(['https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/bc/c1/e4/bcc1e45a-2600-c28b-4541-b2f497b02f6c/VEATP-32342.jpg/500x500bb.jpg','960571252','0DnWOB5oKeCF2B4x3uKVtp']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/00/bf/ee/00bfee78-d68b-3918-5c17-e135e4c36df6/190296743276.jpg/500x500cc.jpeg','1557238100','3cqeIPIj8gyb9olBEqhC2D']);
mosaicArray.push(['https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/62/ad/b9/62adb92d-1a8e-5a01-79b7-1ad07bffd642/21UMGIM17841.rgb.jpg/500x500cc.jpeg','1559496693','6MUMuN96mU5B0DysdNlkGa']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/1e/0e/4f/1e0e4f03-2fe0-03ca-62ce-a3f2ca27744f/JK_ZMCZ-14784.jpg/500x500bb.jpeg','1561703970','0iyvKg1J7uPr8YgF2pczBD']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/33/93/0d/33930dda-b19c-77d9-e205-d25443f38c6b/4547366506389.jpg/500x500bb.jpg','1559690822','1NCDebxxHejkBOfPURW8dg']);
mosaicArray.push(['https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/48/1d/8b/481d8baf-ddad-26aa-a323-4ef2e2a1fa71/4582169618976.jpg/500x500bb.jpg','1554108196','7D3FVm8lV3Zt2y582AbhcD']);
mosaicArray.push(['https://is1-ssl.mzstatic.com/image/thumb/Music3/v4/ae/f8/54/aef85455-382c-ad4f-7c0f-d85d9e77c179/859751658783_cover.jpg/500x500bb.jpg','933457835','6EFDt2nB8BzmGl2OFTFCnj']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/34/aa/e0/34aae087-daa7-91f0-1a13-f75f065c0399/4547366502305.jpg/500x500bb.jpg','1556622311','1ZKqKNaTjM3yuWYRmv33m4']);
mosaicArray.push(['https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/7e/7e/da/7e7eda2a-9a22-6557-472c-3d57cdbd6d96/00600406634559.rgb.jpg/500x500bb.jpg','1440740509','2NntpzUApyESbWpuylSP31']);
mosaicArray.push(['https://is4-ssl.mzstatic.com/image/thumb/Music/v4/ab/a8/4e/aba84e3d-4105-819f-756e-63aa2454925c/NIW82.jpg/500x500bb.jpg','570854044','19jZH4MZhFvICMKIiaxtiT']);
mosaicArray.push(['https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/94/18/95/9418950e-7872-5b87-b2e2-9baf13ec532a/4570040690074_cover.jpg/500x500bb.jpg','1523850310','2GPY2ETVgdTPla5yHePnKu']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music113/v4/18/89/52/1889520a-cb83-971a-7d7f-a7a850728298/jacket_SECL02567B01A_550.jpg/500x500bb.jpg','1538262078','5UWo44UYwscMLidiMLKe9Q']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/a9/6a/4d/a96a4d3d-260c-0de3-dc19-e6c9cd2cf08b/C970.jpg/500x500bb.jpg','1547792023','5UM0UhgiOw7RIKRgXqwwoC']);
mosaicArray.push(['https://is4-ssl.mzstatic.com/image/thumb/Music114/v4/59/d2/32/59d232c5-a1ca-e8e2-2fd0-f6dd6fb22cac/4571374918308_cover.jpg/500x500bb.jpg','1521642040','3qZM6POAgClovPgT5FwfT9']);
mosaicArray.push(['https://is1-ssl.mzstatic.com/image/thumb/Music2/v4/38/0d/62/380d6285-bb0e-7526-cd1e-182a854a338c/15UMGIM75302.jpg/500x500bb.jpg','1440787736','4seExhof6lZ2yg5dZfengb']);
mosaicArray.push(['https://is2-ssl.mzstatic.com/image/thumb/Music114/v4/f9/f4/aa/f9f4aac6-1849-1baa-6d40-3c1b137c7b5b/jacket_ESCL05129B00Z_550.jpg/500x500bb.jpg','1538134868','7ibkOnS6ApxvZ3R79cualG']);
mosaicArray.push(['https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/62/ec/e0/62ece02f-242a-273a-9912-08f56b66e608/jacket_ESCL05118B00Z_550.jpg/500x500bb.jpg','1538134507','63jw5JmK58auIqM9SoXwWf']);
mosaicArray.push(['https://is2-ssl.mzstatic.com/image/thumb/Music3/v4/74/51/64/745164eb-b896-646b-9663-224f04e970d1/VEATP-32911.jpg/500x500bb.jpg','1044970564','3z5QN0MODTkxGB28VLKuuA']);

//--VARIABLES--//
let isDarkMode = document.getElementsByTagName('html')[0].classList.contains('darked');

window.onload = startup();
window.addEventListener('resize', startup);

function startup() {
	generateLayout();
	generateMosaic();
	if(document.getElementById('darkmode') != null) {
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
		document.getElementById('darkmode').addEventListener('click', startup);
	}
}

function generateLayout() {
	if(window.innerWidth < 800)
		generateVerticalLayout(); // top player and menu, bottom covers
	else
		generateHorizontalLayout(); // left player and menu, right covers
}

function generateVerticalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	
	let bodyTableRow1Cell1 = document.createElement('td');
	bodyTableRow1Cell1.classList.add('jukebox-column');
	bodyTableRow1Cell1.style.width = '50%';
	bodyTableRow1Cell1.style.verticalAlign = 'baseline';
	bodyTableRow1Cell1.style.textAlign = 'center';
	
	let main = document.createElement('div');
	main.id = 'main';
	main.style.height = '99vh';
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';	
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-column');
	
	let title = document.createElement('h1');
	title.innerText = 'Music Jukebox';
	title.onclick = startup;
	title.style.cursor = 'pointer';
	
	let description = document.createElement('h5');
	description.innerText = 'Click on album cover to play preview';
	
	let disclaimer = document.createElement('h6');
	disclaimer.innerText = 'Album covers (c) respective music labels';
	
	mainTableRow1Cell1.appendChild(title);
	mainTableRow1Cell1.appendChild(description);
	mainTableRow1Cell1.appendChild(disclaimer);
	
	let mainTableRow2 = document.createElement('tr');
	
	let mainTableRow2Cell1 = document.createElement('td');
	mainTableRow2Cell1.classList.add('jukebox-column');
	
	let player = document.createElement('div');
	player.id = 'player';
	mainTableRow2Cell1.appendChild(player);
	
	let mainTableRow3 = document.createElement('tr');
	
	let mainTableRow3Cell1 = document.createElement('td');
	mainTableRow3Cell1.classList.add('jukebox-column');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	let darkmode = document.createElement('a');
	darkmode.id = 'darkmode';
	darkmode.classList.add('material-icons');
	darkmode.href = 'javascript:void(0);';
	darkmode.innerText = 'brightness_high';
	settings.appendChild(darkmode);

	let back = document.createElement('a');
	back.style.padding = '0 10px';
	back.style.verticalAlign = 'top';
	back.href = '../index.html';
	back.innerText = 'Back';
	settings.appendChild(back);
	
	mainTableRow3Cell1.appendChild(settings);
	
	mainTableRow1.appendChild(mainTableRow1Cell1);
	mainTableRow2.appendChild(mainTableRow2Cell1);
	mainTableRow3.appendChild(mainTableRow3Cell1);
	mainTableBody.appendChild(mainTableRow1);
	mainTableBody.appendChild(mainTableRow2);
	mainTableBody.appendChild(mainTableRow3);
	mainTable.appendChild(mainTableBody);
	main.appendChild(mainTable);
	bodyTableRow1Cell1.appendChild(main);
	
	let bodyTableRow2 = document.createElement('tr');
	
	let bodyTableRow2Cell1 = document.createElement('td');
	bodyTableRow2Cell1.classList.add('jukebox-column');
	bodyTableRow2Cell1.style.width = '50%';
	
	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	
	let grid = generateGrid();
	mosaic.appendChild(grid);
	
	bodyTableRow2Cell1.appendChild(mosaic);
	bodyTableRow2.appendChild(bodyTableRow2Cell1);
	
	bodyTableRow1.appendChild(bodyTableRow1Cell1);
	bodyTableBody.appendChild(bodyTableRow1);
	bodyTableBody.appendChild(bodyTableRow2);
	bodyTable.appendChild(bodyTableBody);
	document.body.innerHTML = '';
	document.body.appendChild(bodyTable);
}

function generateHorizontalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	
	let bodyTableRowCell1 = document.createElement('td');
	bodyTableRowCell1.classList.add('jukebox-column');
	bodyTableRowCell1.style.width = '50%';
	bodyTableRowCell1.style.verticalAlign = 'baseline';
	bodyTableRowCell1.style.textAlign = 'center';
	
	let main = document.createElement('div');
	main.id = 'main';
	main.style.height = '99vh';
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';	
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-column');
	
	let title = document.createElement('h1');
	title.innerText = 'Music Jukebox';
	title.onclick = startup;
	title.style.cursor = 'pointer';
	
	let description = document.createElement('h5');
	description.innerText = 'Click on album cover to play preview';
	
	let disclaimer = document.createElement('h6');
	disclaimer.innerText += 'Powered by Masonry JS';
	disclaimer.innerText += '\nAlbum covers (c) respective music labels';
	
	mainTableRow1Cell1.appendChild(title);
	mainTableRow1Cell1.appendChild(description);
	mainTableRow1Cell1.appendChild(disclaimer);
	
	let mainTableRow2 = document.createElement('tr');
	
	let mainTableRow2Cell1 = document.createElement('td');
	mainTableRow2Cell1.classList.add('jukebox-column');
	
	let player = document.createElement('div');
	player.id = 'player';
	mainTableRow2Cell1.appendChild(player);
	
	let mainTableRow3 = document.createElement('tr');
	
	let mainTableRow3Cell1 = document.createElement('td');
	mainTableRow3Cell1.classList.add('jukebox-column');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	let darkmode = document.createElement('a');
	darkmode.id = 'darkmode';
	darkmode.classList.add('material-icons');
	darkmode.href = 'javascript:void(0);';
	darkmode.innerText = 'brightness_high';
	settings.appendChild(darkmode);

	let back = document.createElement('a');
	back.style.padding = '0 10px';
	back.style.verticalAlign = 'top';
	back.href = '../index.html';
	back.innerText = 'Back';
	settings.appendChild(back);
	
	mainTableRow3Cell1.appendChild(settings);
	
	mainTableRow1.appendChild(mainTableRow1Cell1);
	mainTableRow2.appendChild(mainTableRow2Cell1);
	mainTableRow3.appendChild(mainTableRow3Cell1);
	mainTableBody.appendChild(mainTableRow1);
	mainTableBody.appendChild(mainTableRow2);
	mainTableBody.appendChild(mainTableRow3);
	mainTable.appendChild(mainTableBody);
	main.appendChild(mainTable);
	bodyTableRowCell1.appendChild(main);
	
	let bodyTableRowCell2 = document.createElement('td');
	bodyTableRowCell2.classList.add('jukebox-column');
	bodyTableRowCell2.style.width = '50%';
	
	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	
	let grid = generateGrid();
	mosaic.appendChild(grid);
	bodyTableRowCell2.appendChild(mosaic);
	
	bodyTableRow1.appendChild(bodyTableRowCell1);
	bodyTableRow1.appendChild(bodyTableRowCell2);
	bodyTableBody.appendChild(bodyTableRow1);
	bodyTable.appendChild(bodyTableBody);
	document.body.innerHTML = '';
	document.body.appendChild(bodyTable);
	
}

function generateGrid() {
	let darked = document.getElementsByTagName('html')[0].classList.contains('darked');
	let grid = document.createElement('div');
	grid.classList.add('grid');
	
	for(let item of mosaicArray) {
		let imageUrl = item[0];
		let appleMusicId = item[1];
		let spotifyId = item[2];
		
		let gridItem = document.createElement('div');
		gridItem.id = darked ? appleMusicId : spotifyId;
		gridItem.classList.add('grid-item');
		
		let image = document.createElement('img');
		image.src = imageUrl || 'https://knneo.github.io/resources/spacer.gif';
		
		gridItem.appendChild(image);
		grid.appendChild(gridItem);
	}
	return grid;
}

function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		let images = mosaic.getElementsByTagName('img');
		for(let image of images) {
			image.addEventListener('click', function() {
				let darked = document.getElementsByTagName('html')[0].classList.contains('darked');
				for(let image of document.getElementById('mosaic').getElementsByTagName('img')) {
					image.style.visibility = '';
				}
				this.style.visibility = 'hidden';
				let releaseId = this.parentElement.id;
				let url = (darked ? "https://music.apple.com/jp/album/" : "https://open.spotify.com/embed/album/") + releaseId;
				
				let code = generatePlayerByURL(url);
				document.getElementById('player').innerHTML = code;
				document.getElementById('player').title = releaseId;
				if(window.innerWidth < 800)
					goToTop();
			});
		}
		
		// Generated by Mansonry JS //
		var grid = document.querySelector('.grid');
		var msnry = new Masonry( grid, {
		  // options
		  itemSelector: '.grid-item',
		  percentPosition: true
		  // columnWidth: 300,
		  // stagger: 100
		});
		
		imagesLoaded( grid ).on( 'progress', function() {
		  // layout Masonry after each image loads
		  msnry.layout();
		});
	}
}

function generatePlayer() {
	generatePlayerByURL();
}

function generatePlayerByURL(url) {
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ playerHeight +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: 660px; overflow: hidden; width: 100%;"></iframe>';
    }
	if(url.includes('open.spotify.com')) {
		return '<iframe src="' + url + '" width="' + (window.innerWidth < 660 ? window.innerWidth-30 : 660) +'" height="' + playerHeight + '" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}