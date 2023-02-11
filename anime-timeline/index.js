let isGroupBySeries = false;
let isSortByTitleAsc;
let isSortByGenreCountAsc;
let startYear = 2008;
let startSeason = 'Autumn';
let currentYear = 2023;
let currentSeason = 'Winter';
let endYear = 2023;
let seasons = ['','Winter','Spring','Summer','Autumn'];
let seasonArray = new Array();
let seriesArray = new Array();

window.addEventListener('resize', resize);
window.addEventListener('load', function() {
	let genres = showsRef.reduce((total, current, index, arr) => {
		for(let genre of current.seriesGenre)
		{
			// let key = genre.replace(/ /g,'');
			let item = total.filter(g => g.genre == genre);
			if(item.length > 0)
			{
				item[0].count += 1;
			}
			else
			{
				total.push({
					genre,
					count: 1,
				});
			}
		}
		return total;
	}, []).sort((a,b) => b.count - a.count);
	
	showsArray = showsArray.map(ca => {
		let ref = showsRef.filter(s => s.id == ca.MAL);
		let topGenre = genres.filter(g => ref[0].seriesGenre.includes(g.genre))[0];
		return {
			...ca,
			handle: ref[0].seriesURL,
			imgURL: ref[0].seriesImage,
			genreCount: topGenre.count,
		}
	})
	generateAnimeList(false);
	addGroupByEvents();
	resize();
});
function generateAnimeList(isGroupBySeries) {
	//create series array if needed
	if(isGroupBySeries && seriesArray.length == 0)
	{
		//unique series
		let allSeries = new Array();
		for(let show of showsArray)
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
			for(let show of showsArray)
			{
				if(show.seriesTitle == series.seriesTitle || show.title == series.seriesTitle)
					series.shows.push(show);
			}
		}
	}
	
	let animeTable = document.createElement('table');
	animeTable.classList.add('anime-table');
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
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.classList.add('current-period'); //current season
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
						animeTableContent.classList.add('current-period'); //current season
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
				if(y == currentYear && seasons[s] == currentSeason) animeTableHeaderRow.classList.add('current-period'); //current season
				animeTableHeaderRow.innerHTML = y + "<br>" + formatSeasonText(seasons[s]);
				animeTableHeaderRow.title = y + "\n" + seasons[s];
				animeTableHeader.appendChild(animeTableHeaderRow);
			}
		}

		animeTableBody.appendChild(animeTableHeader);
		
		if(seasonArray.length == 0)
		{
			for(let anime of showsArray)
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
			if(isSortByGenreCountAsc == true)
			{
				return a.genreCount - b.genreCount;
			}
			if(isSortByGenreCountAsc == false)
			{
				return b.genreCount - a.genreCount;				
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
						animeTableContent.classList.add('current-period'); //current season
					
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
	document.querySelector('.anime-list').innerHTML = '';
	document.querySelector('.anime-list').appendChild(animeTable);
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
function resize() {
	let h3height = document.getElementsByTagName('h3')[0].getBoundingClientRect().height;
	let headerHeight = document.querySelector('.header').offsetHeight;
	let footerHeight = document.querySelector('.footer').offsetHeight;
	document.querySelector('.anime-list').style.height = (window.innerHeight - h3height - headerHeight - footerHeight - 0.2*window.innerHeight) + 'px';
}

//click season/series to scroll to timeline first box
function enableSelectTitle() {
	let windowWidth = document.querySelector('.anime-list').getBoundingClientRect().width;
	for(let s = 1; s < document.getElementsByTagName('tr').length; s++)
	{
		document.getElementsByTagName('tr')[s].getElementsByTagName('td')[0].addEventListener('click', function() {
			for(let c = 1; c < document.getElementsByTagName('tr')[s].getElementsByTagName('td').length; c++)
			{
				if(document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].innerText == 'X')
				{
					document.querySelector('.anime-list').scrollLeft += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().x-(windowWidth < 800 ? 0.75*window.outerWidth : 0.5*window.outerWidth);
					document.querySelector('.anime-list').scrollTop += document.getElementsByTagName('tr')[s].getElementsByTagName('td')[c].getBoundingClientRect().y-(windowWidth < 800 ? 135 : 155);
					//console.log(document.querySelector('.anime-list').scrollLeft);
					//console.log(document.querySelector('.anime-list').scrollTop);
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
			this.getElementsByClassName('show-overlay')[0].style.left = (x + 32) + 'px';
			console.log(x, y, w, window.outerWidth);
			if((x + w + 48) >= window.innerWidth)
				this.getElementsByClassName('show-overlay')[0].style.left = (x - w) + 'px';
			this.getElementsByClassName('show-overlay')[0].style.top = (y) + 'px';
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