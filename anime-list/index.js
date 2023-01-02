let currentYear = 2023;
let currentSeason = 'Winter';
window.addEventListener('load', startup);

function startup() {
	window['filter'] = '';
	window['genre'] = '';
	generateAnimeList();
	addImagesError();
	// document.getElementById("showAll").click();
}

function generateAnimeList() {
	document.getElementById('anime-list').innerHTML = '';
	
	let currentList = showsArray.filter(s => s.type == 'TV' && s.year == currentYear && s.season == currentSeason);
	document.getElementById('anime-list').appendChild(generateAnimeCurrent(currentList));
	
	let calendarBlock = generateAnimeCalendar(showsArray.filter(s => s.type == 'TV' && s.year >= 2008 && s.season.length > 0 && s.MAL > 0));
	document.getElementById('anime-list').appendChild(calendarBlock);
	
	let archiveList = showsArray.filter(s => s.type == 'TV' && (s.year != currentYear || s.season != currentSeason)).sort((a, b) => b.sortOrder - a.sortOrder);
	document.getElementById('anime-list').appendChild(generateAnimeArchive(archiveList));
	
	let moviesList = showsArray.filter(s => s.type == 'Movie');
	document.getElementById('anime-list').appendChild(generateOVAMovies(moviesList));
	
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
		filter.classList.add('filter');
		filter.placeholder = 'Filter show name..';
		filter.value = window['filter'] || '';
		filter.addEventListener('input', function() {
			window['filter'] = this.value.toLowerCase() || '';
			window['genre'] = window['genre'] || '';
			generateCalendarBox(showsArray.map(ca => {
					let ref = showsRef.filter(s => s.id == ca.MAL);
					return {
						...ca,
						handle: ref[0].seriesURL,
						imgURL: ref[0].seriesImage,
						genres: ref[0].seriesGenre,
					}
				}).filter(s => 
				s.type == 'TV' && 
				s.year >= 2008 && 
				s.season.length > 0 && 
				(window['filter'].length == 0 || s.title.toLowerCase().includes(window['filter'])) && 
				(window['genre'].length == 0 || s.genres.includes(window['genre']))
			));
		});
		
	block.appendChild(filter);
	
		let listGenres = showsArray.filter(sr => sr.season.length > 0).map(sa => sa.MAL);
		let genres = showsRef.filter(sr => listGenres.includes(sr.id)).reduce((total, current, index, arr) => {
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
	
		let genreSelect = document.createElement('select');
		genreSelect.classList.add('filter');
		genreSelect.placeholder = 'Genre';
		genreSelect.value = window['genre'] || '';
		genreSelect.addEventListener('input', function() {
			window['filter'] = window['filter'] || '';
			window['genre'] = this.value || '';
			generateCalendarBox(showsArray.map(ca => {
					let ref = showsRef.filter(s => s.id == ca.MAL);
					return {
						...ca,
						handle: ref[0].seriesURL,
						imgURL: ref[0].seriesImage,
						genres: ref[0].seriesGenre,
					}
				}).filter(s => 
				s.type == 'TV' && 
				s.year >= 2008 && 
				s.season.length > 0 && 
				(window['filter'].length == 0 || s.title.toLowerCase().includes(window['filter'])) && 
				(window['genre'].length == 0 || s.genres.includes(window['genre']))
			));
		});
		
		let genreOption = document.createElement('option');
		genreOption.innerText = '==Genre==';
		genreOption.value = '';
		genreSelect.appendChild(genreOption);
			
		for(let g of genres.filter(g => g.count > 2))
		{
			let genreOption = document.createElement('option');
			genreOption.innerText = g.genre + ' (' + g.count + ')';
			genreOption.value = g.genre;
			genreSelect.appendChild(genreOption);
		}
		
	block.appendChild(genreSelect);
	
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
				let ref = showsRef.filter(r => r.id == show.MAL);
				// console.log(show, ref);
				
				let i = document.createElement('div');
				if(ref.length > 0) i.classList.add('calendar-cell');
				if(show.title) i.classList.add('highlight');
				if(show.title || (window['filter'] == '' && window['genre'] == ''))
				{
					i.style.margin = '1px';
					i.style.padding = '2px';
				}
				i.addEventListener('click', function() { window.open(ref[0].seriesURL, '_blank'); });
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
			if(item.circular)
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