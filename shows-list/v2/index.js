//--SETTINGS--//
const currentYear = 2025;
const currentSeason = 'Summer';
const maxPerSeason = 7;
const seasons = [
	{ title:'Winter', altTitle:'' },
	{ title:'Spring', altTitle:'' },
	{ title:'Summer', altTitle:'' },
	{ title:'Autumn', altTitle:'' },
]; // in order

function startup() {
	initializeVariables();
	generateAnimeList();
	addImagesError();
}

function initializeVariables() {
	window['filter'] = '';
	window['genre'] = '';	
}

function generateAnimeList() {
	let currentList = showsArray.filter(s => s.type == 'TV' && s.year == currentYear && s.season == currentSeason);
	
	let calendarList = generateAnimeCalendar(showsArray.filter(s => s.type == 'TV' && s.year >= 2008 && s.season.length > 0 && s.MAL > 0));
	
	let timelineList = showsArray.filter(s => s.type == 'TV' && (s.year != currentYear || s.season != currentSeason)).sort((a, b) => b.sortOrder - a.sortOrder);
	
	let moviesList = showsArray.filter(s => s.type == 'Movie');
	
	let directoryHTML = document.querySelector('.directory');
	if(directoryHTML != null) {
		directoryHTML.innerHTML = '';
		directoryHTML.appendChild(calendarList);
	}
	
	let showsHtml = document.querySelector('.current');
	if(showsHtml != null) {
		showsHtml.innerHTML = '';
		showsHtml.appendChild(generateAnimeCurrent(currentList));
	}
	
	let moviesHtml = document.querySelector('.movies');
	if(moviesHtml != null) {
		moviesHtml.innerHTML = '';
		moviesHtml.appendChild(generateOVAMovies(moviesList));
	}
	
	let timelineHTML = document.querySelector('.timeline');
	if(timelineHTML != null) {
		timelineHTML.innerHTML = '';
		timelineHTML.appendChild(generateAnimeArchive(timelineList));
	}
	
}

function generateAnimeCalendar(list) {	
	let calendarBlock = document.createElement('div');
	
	let title = document.createElement('h4');
	title.classList.add('tr_bq');
	title.classList.add('category-title');
	title.innerText = 'Directory';
	
	calendarBlock.appendChild(title);
	
	let block = document.createElement('div');
	block.classList.add('filter-bar');
	
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
	
	calendarBlock.appendChild(block);
	
	calendarBlock.appendChild(generateCalendarBox(list));
	
	return calendarBlock;
}

function generateCalendarBox(list) {
	let calendarDiv = document.querySelector('#calendar');
	if(document.querySelector('#calendar') == null)
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
	
	let z = document.createElement('div');
	z.classList.add('calendar-icon');
	
		let icon = document.createElement('i');
		icon.classList.add('material-icons');
		icon.innerText = 'today';
		z.appendChild(icon);
		
	calendarDiv.appendChild(z);
	
	for(let season of seasons)
	{
		let s = document.createElement('div');
		s.classList.add('calendar-header');
		s.innerText = season.title;
		calendarDiv.appendChild(s);
	}
	
	//cells
	for(let y = 2008; y <= currentYear; y++)
	{
		let t = document.createElement('div');
		t.classList.add('calendar-year');
		t.style.gridRow = (2+((y-2008)*maxPerSeason)) + '/ span ' + maxPerSeason;
		
			let tx = document.createElement('span');
			tx.innerText = y;
			t.appendChild(tx);
			
		calendarDiv.appendChild(t);
		
		let yearShows = {};
		yearShows['Winter'] = list.filter(l => l.year == y && l.season == 'Winter');
		yearShows['Spring'] = list.filter(l => l.year == y && l.season == 'Spring');
		yearShows['Summer'] = list.filter(l => l.year == y && l.season == 'Summer');
		yearShows['Autumn'] = list.filter(l => l.year == y && l.season == 'Autumn');
		
		for(let s of seasons)
		{
			while(yearShows[s.title].length < maxPerSeason)
			{
				yearShows[s.title].push({ year: y, season: s.title, title: '' });
			}
		}
		// console.log(yearShows);
		
		for(let count = 0; count < maxPerSeason; count++)
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
	return generateTimeline(id, title, filterList, false);	
}

function generateAnimeCurrent(filterList) {
	let id = 'currentList';
	let title = 'Currently Watching (As of '  + currentSeason + ' ' + currentYear + ')';
	return generateList(id, title, filterList, false);	
}

function generateOVAMovies(filterList) {
	let id = 'movieList';
	let title = 'Standalone OVA/Movies';
	return generateList(id, title, filterList);
}

function generateList(categoryId, categoryTitle, filterList, fold = true) {
	let list = document.createElement('div');
	list.id = categoryId;
	list.classList.add('category');
	list.addEventListener('click', function() {
		if(event.target.classList.contains('category-title') || event.target.classList.contains('icon'))
		{
			document.querySelector('#' + this.id + ' .block').style.height = document.querySelector('#' + this.id + ' .block').style.height == '' ? 0 : '';
			document.querySelector('#' + this.id + ' .icon').innerText = document.querySelector('#' + this.id + ' .icon').innerText == 'expand_more' ? 'expand_less' : 'expand_more';
		}
	}, false);
	
		let block = document.createElement('h4');
		block.classList.add('tr_bq');
		
			let title = document.createElement('span');
			title.classList.add('category-title');
			title.innerText = categoryTitle;
			
		block.appendChild(title);
			
			let icon = document.createElement('i');
			icon.classList.add('material-icons');
			icon.classList.add('icon');
			icon.innerText = fold ? 'expand_more' : 'expand_less';
		
		block.appendChild(icon);
		
	list.appendChild(block);
	
	let listBlock = document.createElement('div');
	listBlock.classList.add('block');
	listBlock.style.height = fold ? 0 : '';
	
	for(let item of filterList)
	{
		listBlock.appendChild(generateAnimeRow(item));
	}
	
	list.appendChild(listBlock);
	
	return list;
}

function generateAnimeRow(item) {
	let row = document.createElement('div');
	row.classList.add('new-anime-row');
	
	if(item.handle && item.handle.length > 0)
	{
		let handler = document.createElement('a');
		handler.href = (item.handle.startsWith('http') ? '' : 'https://twitter.com/') + item.handle;
		handler.setAttribute('target', '_blank');
		
		if(item.imgURL && item.imgURL.length > 0)
		{
			let img = document.createElement('img');
			img.src = 'https://knneo.github.io/resources/spacer.gif';
			img.alt = item.imgURL;
			img.title = (item.handle.startsWith('http') ? '' : '@') + item.handle;
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
	let imgList = document.querySelectorAll('img');
	for (let i = 0; i < imgList.length; i++) {
		imgList[i].src = imgList[i].alt;
		imgList[i].alt = '';
		imgList[i].addEventListener('error', function() {
			if(this.parentElement.parentElement.classList.contains('new-anime-row'))
				console.error('error on thumbnail: ' + this.parentElement.parentElement.innerText);
			this.src = 'https://knneo.github.io/resources/spacer.gif';
			this.style.border = '0px white solid';
			this.style.backgroundColor = 'transparent';
		});
	}
}

function generateTimeline(categoryId, categoryTitle, filterList, fold = true) {
	let list = document.createElement('div');
	list.id = categoryId;
	list.classList.add('category');
	
		let block = document.createElement('h4');
		block.classList.add('tr_bq');
		
			let title = document.createElement('span');
			title.classList.add('category-title');
			title.innerText = categoryTitle;
			
		block.appendChild(title);
		
	list.appendChild(block);
	list.appendChild(document.createElement('br'));
	
	let listBlock = document.createElement('div');
	listBlock.classList.add('block');
	listBlock.classList.add('grid');
	listBlock.style.height = fold ? 0 : '';
	
	for(let item of filterList)
	{
		let container = document.createElement('div');
		container.classList.add('container');
		
		if(item.handle && item.handle.length > 0)
		{
			let handler = document.createElement('a');
			handler.href = (item.handle.startsWith('http') ? '' : 'https://twitter.com/') + item.handle;
			handler.setAttribute('target', '_blank');
			
			if(item.imgURL && item.imgURL.length > 0)
			{
				let img = document.createElement('img');
				img.classList.add('thumb');
				img.classList.add('dimmed');
				img.src = 'https://knneo.github.io/resources/spacer.gif';
				img.alt = item.imgURL;
				img.title = (item.handle.startsWith('http') ? '' : '@') + item.handle;
				if(item.circular)
					img.style.borderRadius = '50%';
					
				handler.appendChild(img);
			}
			container.appendChild(handler);
		}
		
		let blob = document.createElement('div');
		blob.classList.add('blob');
		blob.classList.add('dimmed');
		blob.innerText = '|';
		container.appendChild(blob);
		
		let show = document.createElement('div');
		show.classList.add('description');
		show.classList.add('dimmed');
		show.innerText = formatRowText(item.title, item.altTitle);
		container.appendChild(show);
		
		listBlock.appendChild(container);
	}
	
	list.appendChild(listBlock);
	list.appendChild(document.createElement('br'));
	
	return list;
}

window.onload = startup();