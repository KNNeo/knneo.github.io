//--SETTINGS--//
let playerHeight = 400;
let mosaicArray = new Array();
// mosaicArray.push(['imgURL','appleMusicId']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/c7/a1/c7/c7a1c7b8-c697-2509-40a2-23b08a64fbad/PCCG_01967_A.jpg/500x500cc.jpeg','1562664393']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/e3/c5/83/e3c58354-4649-7e15-885f-ca4d513898f8/KICM-92079.jpg/500x500cc.jpeg','1558995369']);
mosaicArray.push(['https://is3-ssl.mzstatic.com/image/thumb/Music114/v4/1c/cc/ce/1cccced5-4824-14ed-7226-6ddee11f997e/4547366490237.jpg/500x500cc.jpeg','1545321704']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music114/v4/3d/28/49/3d28492e-ae3b-94c3-7348-fc9d20282e2a/COZC-1728.jpg/500x500cc.jpeg','1556000069']);
mosaicArray.push(['https://is5-ssl.mzstatic.com/image/thumb/Music124/v4/00/bf/ee/00bfee78-d68b-3918-5c17-e135e4c36df6/190296743276.jpg/500x500cc.jpeg','1557238100']);
mosaicArray.push(['https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/62/ad/b9/62adb92d-1a8e-5a01-79b7-1ad07bffd642/21UMGIM17841.rgb.jpg/500x500cc.jpeg','1559496693']);

//--VARIABLES--//
let isDarkMode = document.getElementsByTagName('html')[0].classList.contains('darked');

window.onload = startup();
window.addEventListener('resize', startup);

function startup() {
	generateLayout();
	generateMosaic();
	if(document.getElementById('darkmode') != null)
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
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
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';	
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-column');
	
	let title = document.createElement('h1');
	title.innerText = 'Music Jukebox';
	
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
	
	let grid = document.createElement('div');
	grid.classList.add('grid');
	
	for(let item of mosaicArray) {
		let imageUrl = item[0];
		let playerId = item[1];
		
		let gridItem = document.createElement('div');
		gridItem.id = playerId;
		gridItem.classList.add('grid-item');
		
		let image = document.createElement('img');
		image.src = imageUrl;
		
		gridItem.appendChild(image);
		grid.appendChild(gridItem);
	}
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
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';	
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-column');
	
	let title = document.createElement('h1');
	title.innerText = 'Music Jukebox';
	
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
	
	let grid = document.createElement('div');
	grid.classList.add('grid');
	
	for(let item of mosaicArray) {
		let imageUrl = item[0];
		let playerId = item[1];
		
		let gridItem = document.createElement('div');
		gridItem.id = playerId;
		gridItem.classList.add('grid-item');
		
		let image = document.createElement('img');
		image.src = imageUrl;
		
		gridItem.appendChild(image);
		grid.appendChild(gridItem);
	}
	mosaic.appendChild(grid);
	bodyTableRowCell2.appendChild(mosaic);
	
	bodyTableRow1.appendChild(bodyTableRowCell1);
	bodyTableRow1.appendChild(bodyTableRowCell2);
	bodyTableBody.appendChild(bodyTableRow1);
	bodyTable.appendChild(bodyTableBody);
	document.body.innerHTML = '';
	document.body.appendChild(bodyTable);
	
}

function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		let images = mosaic.getElementsByTagName('img');
		for(let image of images) {
			image.addEventListener('click', function() {
				for(let image of document.getElementById('mosaic').getElementsByTagName('img')) {
					image.style.visibility = '';
				}
				this.style.visibility = 'hidden';
				let releaseId = this.parentElement.id;
				let url = "https://music.apple.com/jp/album/" + releaseId;
				
				let code = generatePlayerByURL(url);
				if(document.getElementById('player').title == releaseId)
					document.getElementById('player').innerHTML = '';
				else
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
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}