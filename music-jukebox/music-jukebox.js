//--VARIABLES--//
let playerHeight = 400;
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
	main.style.height = '90vh';
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
	player.style.height = '400px';
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
	if(0.5*window.innerHeight < playerHeight)
		playerHeight = 0.5*window.innerHeight;
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ playerHeight +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: 660px; overflow: hidden; width: 100%;"></iframe>';
    }
	if(url.includes('open.spotify.com')) {
		return '<iframe src="' + url + '" width="' + (window.innerWidth < 660 ? window.innerWidth-50 : 660) +'" height="' + playerHeight + '" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
