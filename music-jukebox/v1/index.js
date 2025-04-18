//--VARIABLES--//
let playerWidth = 660;		// in px only
let playerHeight = 660;		// in px only
let maxImageSize = 300;		// in px only
let enableDarkMode = true;	// displays dark mode toggle
let isDarkMode = true;		// initial value if enableDarkMode is false, ignored if enableDarkMode is true

//--SYSTEM VARIABLES: DO NOT EDIT--//
let isWidescreen = false;
let mosaicArray = [];
window.addEventListener('load', loadPage('jukebox'));
window.addEventListener('resize', startup);

function startup() {
	generateLayout();
	generateMosaic();
	if(!enableDarkMode) {
		if(isDarkMode) {
			document.getElementsByTagName('html')[0].classList.add('darked');
		}
		else {
			document.getElementsByTagName('html')[0].classList.remove('darked');
		}
	}
	if(enableDarkMode && document.getElementById('darkmode') != null) {
		isDarkMode = document.getElementsByTagName('html')[0].classList.contains('darked');
		document.getElementById('darkmode').addEventListener('click', toggleDarkMode);
		document.getElementById('darkmode').addEventListener('click', function() { isDarkMode = !isDarkMode; });
		document.getElementById('darkmode').addEventListener('click', startup);
	}
}

function generateLayout() {
	isWidescreen = window.innerWidth > 800;
	if(isWidescreen)
		generateHorizontalLayout(); // left player and menu, right covers
	else
		generateVerticalLayout(); // top player and menu, bottom covers
}

function generateVerticalLayout() {
	let bodyTable = document.createElement('table');
	bodyTable.style.width = '100%';
	
	let bodyTableBody = document.createElement('tbody');
	
	let bodyTableRow1 = document.createElement('tr');
	bodyTableRow1.appendChild(generateLayoutPlayer());
	
	let bodyTableRow2 = document.createElement('tr');
	bodyTableRow2.appendChild(generateLayoutJukebox());
	
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
	bodyTableRow1.appendChild(generateLayoutPlayer());
	bodyTableRow1.appendChild(generateLayoutJukebox());
	
	bodyTableBody.appendChild(bodyTableRow1);
	
	bodyTable.appendChild(bodyTableBody);
	document.body.innerHTML = '';
	document.body.appendChild(bodyTable);
}

function generateLayoutPlayer() {
	let bodyTablePlayerCell = document.createElement('td');
	bodyTablePlayerCell.classList.add('jukebox-cell');
	bodyTablePlayerCell.style.width = playerWidth + 'px';
	bodyTablePlayerCell.style.verticalAlign = 'baseline';
	bodyTablePlayerCell.style.textAlign = 'center';
	
	let main = document.createElement('div');
	main.id = 'main';
	main.style.height = isWidescreen ? '99vh' : '90vh';
	let mainTable = document.createElement('table');
	mainTable.style.width = '100%';
	mainTable.style.height = '100%';
	
	let mainTableBody = document.createElement('tbody');
	
	let mainTableRow1 = document.createElement('tr');
	
	let mainTableRow1Cell1 = document.createElement('td');
	mainTableRow1Cell1.classList.add('jukebox-cell');
	
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
	mainTableRow2Cell1.classList.add('jukebox-cell');
	
	let player = document.createElement('div');
	player.id = 'player';
	// player.style.height = playerHeight + 'px';
	mainTableRow2Cell1.appendChild(player);
	
	let mainTableRow3 = document.createElement('tr');
	
	let mainTableRow3Cell1 = document.createElement('td');
	mainTableRow3Cell1.classList.add('jukebox-cell');
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
	
	if(enableDarkMode) {
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.classList.add('darkmode');
		darkmode.classList.add('material-icons');
		darkmode.href = 'javascript:void(0);';
		darkmode.innerText = 'brightness_high';
		settings.appendChild(darkmode);		
	}
	
	let viewmode = document.createElement('a');
	viewmode.id = 'viewmode';
	viewmode.classList.add('viewmode');
	viewmode.classList.add('material-icons');
	viewmode.href = 'javascript:void(0);';
	switch(document.body.id) {
			case 'collections':
				viewmode.innerText = 'collections_bookmark';
				viewmode.addEventListener('click', function() {
					enableDarkMode = true;
					isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
					if(!isDarkMode) document.getElementsByTagName('html')[0].classList.remove('darked');
					loadPage('jukebox');
				});
				break;
			default:
				viewmode.innerText = 'library_music';
				viewmode.addEventListener('click', function() {
					enableDarkMode = false;
					isDarkMode = true;
					loadPage('collections');
				});
				break;
		}
	
	settings.appendChild(viewmode);		

	let back = document.createElement('a');
	back.classList.add('back');
	back.style.verticalAlign = 'top';
	back.href = 'https://knneo.github.io/';
	back.innerText = 'knneo.github.io';
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
	bodyTablePlayerCell.appendChild(main);

	return bodyTablePlayerCell;	
}

function generateLayoutJukebox() {
	let bodyTableJukeboxCell = document.createElement('td');
	bodyTableJukeboxCell.classList.add('jukebox-cell');

	let mosaic = document.createElement('div');
	mosaic.id = 'mosaic';
	
	let grid = generateGrid();
	mosaic.appendChild(grid);
	bodyTableJukeboxCell.appendChild(mosaic);

	return bodyTableJukeboxCell;
}

function generateGrid() {
	let year = 0;
	let grid = document.createElement('div');
	grid.classList.add('grid');	
	
	for(let item of mosaicArray.sort(function(a,b){return a[3]-b[3]})) {
		let imageUrl = item[0];
		let appleMusicId = item[1];
		let spotifyId = item[2];
		
		let gridItem = document.createElement('div');
		gridItem.id = isDarkMode ? appleMusicId : spotifyId;
		if(gridItem.id == '') continue;
		gridItem.classList.add('grid-item');
		
		if(item[3] > 0 && year != item[3]) {
			let overlay = document.createElement('div');
			overlay.classList.add('static-banner');
			overlay.innerText = item[3];
			gridItem.appendChild(overlay);
			year = item[3];
		}
		
		let gridImage = document.createElement('div');
		gridImage.classList.add('grid-image');
		let imageSize = (isWidescreen ? 0.15*window.innerWidth : 0.3*window.innerWidth) + 'px';
		if(imageSize > maxImageSize) imageSize = maxImageSize + 'px';
		gridImage.style.width = imageSize;
		gridImage.style.height = imageSize;
		gridImage.style.backgroundSize = imageSize;
		gridImage.style.backgroundImage = addUrlClause(imageUrl || 'https://knneo.github.io/resources/spacer.gif');
		gridImage.addEventListener('mouseout',function() {
			this.style.backgroundSize = this.offsetWidth + 'px';
		});
		gridImage.addEventListener('mouseover',function() {
			this.style.backgroundSize = (1.2*this.offsetWidth) + 'px';
		});
		
		gridItem.appendChild(gridImage);
		grid.appendChild(gridItem);
		
	}
	return grid;
}

function addUrlClause(url) {
	return "url('" + url + "')";
}

function generateMosaic() {
	// build grid
	let mosaic = document.getElementById('mosaic');
	if(mosaic != null) {
		let images = mosaic.getElementsByClassName('grid-image');
		for(let image of images) {
			image.addEventListener('click', function() {
				for(let image of document.getElementById('mosaic').getElementsByClassName('grid-image')) {
					image.style.visibility = '';
				}
				this.style.visibility = 'hidden';
				let releaseId = this.parentElement.id;
				let url = (isDarkMode ? "https://music.apple.com/jp/" + (releaseId.includes('pl.u') ? 'playlist' : 'album') + "/" : "https://open.spotify.com/embed/album/") + releaseId;
				
				let code = generatePlayerByURL(url);
				document.getElementById('player').innerHTML = code;
				document.getElementById('player').title = releaseId;
				if(!isWidescreen)
					goToTop();
			});
		}
		
		// Generated by Mansonry JS //
		var grid = document.querySelector('.grid');
		var msnry = new Masonry( grid, {
		  // options
		  itemSelector: '.grid-item'
		  // percentPosition: true
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
	let embedHeight = 450;
	if(0.75*window.innerHeight < embedHeight)
		embedHeight = 0.5*window.innerHeight;
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ embedHeight +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; max-width: ' + (playerWidth-10) + 'px; overflow: hidden; width: 100%;"></iframe>';
    }
	if(url.includes('open.spotify.com')) {
		return '<iframe src="' + url + '" width="' + (window.innerWidth < playerWidth ? window.innerWidth-50 : playerWidth-10) +'" height="' + embedHeight + '" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//--SCRIPT LOADER--//
function loadPage(pageName) {
	unloadCurrentScripts();
	loadDataScript(pageName);
}

function loadData(pageName) {
	// reloadDarkmodeStyle();
	document.body.id = pageName;
	startup();
}

function reloadDarkmodeStyle() {
	let url = 'darkmode';
	for(let darked of document.getElementsByClassName('darked'))
	{
		darked.classList.remove('darked');
	}
	if(document.getElementById(url + '-css') != null)
		document.getElementById(url + '-css').parentNode.removeChild(document.getElementById(url + '-css'));
	let css = document.createElement('link');
	css.id = url + '-css';
	css.href = '../' + url + '.css';
	css.type = 'text/css';
	css.rel = 'stylesheet'
	document.head.appendChild(css);
	
	//if dark mode is disabled, defaults to light
	// if(!enableDarkMode && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	// {
		// toggleDarkMode();
	// }
}

function loadDataScript(pageName) {
	let dataScript = document.createElement('script');
	dataScript.id = pageName + '-array'
	dataScript.src = '../' + dataScript.id + '.js';
	dataScript.type = "text/javascript";
	dataScript.charset = 'utf-8';
	dataScript.onreadystatechange = function() { loadData(pageName); };
    dataScript.onload = function() { loadData(pageName); };
	document.head.appendChild(dataScript);
}

function unloadCurrentScripts() {
	let currentPageName = document.body.id;
	let currentDataScript = currentPageName + '-array';
	let currentProcessScript = currentPageName + '-temp';
	if(document.getElementById(currentDataScript) != null)
		document.getElementById(currentDataScript).parentNode.removeChild(document.getElementById(currentDataScript));
	if(document.getElementById(currentProcessScript) != null)
		document.getElementById(currentProcessScript).parentNode.removeChild(document.getElementById(currentProcessScript));
}