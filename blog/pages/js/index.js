//--CHECKS--//
function isMobile() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
}

function smallScreenWidth() {
	return window.innerWidth <= 800;
}

function mediumScreenWidth() {
	return window.innerWidth <= 1200;
}

function largeScreenWidth() {
	return window.innerWidth >= 1600;
}

function smallScreenHeight() {
	return getScreenHeight() <= 800;
}

function getScreenHeight() {
	return window.innerHeight < window.screen.height ? window.screen.height : window.innerHeight;
}

//--EVENTS--//
function scrollToNextPage() {
	event.preventDefault();
	event.stopPropagation();
	if(event.key && event.key.toLowerCase() != ' ' && event.key.toLowerCase() != 'enter')
		return;
	let nextPage = event.target.closest('.section').nextElementSibling;
	if(nextPage != null)
		scrollToPage(nextPage.getAttribute('data-section'));
}

function scrollToPrevPage() {
	event.preventDefault();
	event.stopPropagation();
	if(event.key && event.key.toLowerCase() != ' ' && event.key.toLowerCase() != 'enter')
		return;
	let prevPage = event.target.closest('.section').previousElementSibling;
	if(prevPage != null)
		scrollToPage(prevPage.getAttribute('data-section'));
}

function scrollToPage(sectionNo) {
	if(window['main'].isSinglePage) {
		for(let section of document.querySelectorAll('.section'))
			section.classList.add('hidden');
		document.querySelectorAll('.section')[sectionNo].classList.remove('hidden');
	}
	else
		document.querySelectorAll('.section')[sectionNo].scrollIntoView({ inline: 'center', behavior: 'smooth' });
}

function scrollToMainPage(el, onLoad) {
	let mainPage = document.querySelector('.main');
	if(mainPage != null)
		scrollToPage(mainPage.getAttribute('data-section'));
	else // scroll to first page
		document.querySelector('.section').scrollIntoView({ inline: 'center', behavior: 'smooth' });
}

function toggleGoToTop() {
	// When the user scrolls down to viewport from the top of the document, change floating action button
	document.querySelector('.button-top').style.visibility = document.querySelector('.page').scrollTop >= document.body.clientHeight ? 'visible' : '';
}

//--RENDER FUNCTIONS--//
function renderBody() {
	document.querySelector('.page').innerHTML = '';	
	// render sections
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(window['elements'][sectionNo].isMain) {
			let newMain = document.createElement('section');
			newMain.classList.add('main');
			newMain.classList.add('section');
			newMain.setAttribute('data-section', sectionNo);
			newMain.addEventListener('click', function() {
				event.stopPropagation();
				scrollToPage(sectionNo);
			});
			document.querySelector('.page').appendChild(newMain);
		}
		else {
			let newSection = document.createElement('section');
			newSection.classList.add('section');
			newSection.classList.add('focusable');
			newSection.setAttribute('data-section', sectionNo);
			newSection.addEventListener('click', function() {
				event.stopPropagation();
				scrollToPage(sectionNo);
			});
			document.querySelector('.page').appendChild(newSection);
		}
	}	
	// set page by type
	document.body.className = '';
	if(window['main']?.isSinglePage) {
		document.body.classList.add('single');
		
		let menu = document.createElement('div');
		menu.classList.add('menu');
		document.body.appendChild(menu);
		
		scrollToPage(window['main'].sectionNo);
	}
	else {
		document.body.classList.add('one');
		for(let section of document.querySelectorAll('.one .section'))
			section.style.height = window.innerHeight + 'px';
	}
	// render page elements
	renderMain();
	renderMenu();
	// render content in sections
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(!window['elements'][sectionNo].isMain)
			renderSection(sectionNo);
	}
	// render buttons
	renderButtons();
	renderFooter();
	// if single page, calculate section height
	if(window['main']?.isSinglePage) {
		for(let section of document.querySelectorAll('.section'))
			section.style.height = 'calc(100% - ' + ((document.querySelector('.menu').getBoundingClientRect().height + document.querySelector('.footer').getBoundingClientRect().height) + 'px') + ')';
	}
	// add focus events
	for(let focusable of document.querySelectorAll('.focusable')) {
		focusable.tabIndex = 0;
		focusable.addEventListener('keyup', function() {
			if(event.keyCode == 13)
				this.click();
		});
	}
	// remove .html extensions, facilitate static site routing
	removeLinkExtensions();
}

function renderMain() {
	let content = window['main'];
	
	if(document.querySelector('.main') != null) {
		let main = document.querySelector('.main');
		main.classList.add('focusable');
		
		if(content.sectionNo > 0) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			prevDiv.classList.add('not-selectable');
			let prevButton = document.createElement('a');
			prevButton.classList.add('focusable');
			prevButton.title = 'Previous';
			if(main.previousElementSibling == null)
				nextButton.style.opacity = '0';
			else
				nextButton.href = 'javascript:void(0)';
			prevButton.addEventListener('click', scrollToPrevPage);
			prevButton.addEventListener('keyup', scrollToPrevPage);
			let prevButtonIcon = renderGoogleIcon(content.isSinglePage ? 'arrow_left' : 'arrow_drop_up');
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		}
		
		if(content.prefix) {
			let mainPre = document.createElement('h3');
			mainPre.classList.add('title');
			mainPre.innerText = content.prefix;
			main.appendChild(mainPre);
		}
		
		let mainTitle = document.createElement('h1');
		mainTitle.classList.add('title');
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		if(content.suffix) {
			let mainPost = document.createElement('h5');
			mainPost.classList.add('title');
			mainPost.innerText = content.suffix;
			main.appendChild(mainPost);
		}
		
		if(!content.isSinglePage) {
			let menu = document.createElement('div');
			menu.classList.add('menu');
			main.appendChild(menu);
		}
		
		if(window['elements'].length > 1) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			nextDiv.classList.add('not-selectable');
			let nextButton = document.createElement('a');
			nextButton.classList.add('focusable');
			nextButton.title = 'Next';
			if(main.nextElementSibling == null)
				nextButton.style.opacity = '0';
			else
				nextButton.href = 'javascript:void(0)';
			nextButton.addEventListener('click', scrollToNextPage);
			nextButton.addEventListener('keyup', scrollToNextPage);
			let nextButtonIcon = renderGoogleIcon(content.isSinglePage ? 'arrow_right' : 'arrow_drop_down');
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		}
	}
}

function renderSection(sectionNo) {
	let section = document.querySelectorAll('.section')[sectionNo];// > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let main = window['main'];
	let content = window['elements'][sectionNo];
	
	let prevDiv = document.createElement('div');
	prevDiv.classList.add('page-prev');
	prevDiv.classList.add('not-selectable');
	let prevButton = document.createElement('a');
	prevButton.classList.add('focusable');
	prevButton.title = 'Previous';
	if(section.previousElementSibling == null || !section.previousElementSibling.classList.contains('section')) {
		prevButton.style.visibility = 'hidden';
		prevButton.style.opacity = '0';
	}
	else
		prevButton.href = 'javascript:void(0)';
	prevButton.addEventListener('click', scrollToPrevPage);
	prevButton.addEventListener('keyup', scrollToPrevPage);
	let prevButtonIcon = renderGoogleIcon(main?.isSinglePage ? 'arrow_left' : 'arrow_drop_up');
	prevButton.appendChild(prevButtonIcon);
	prevDiv.appendChild(prevButton);
	section.appendChild(prevDiv);
	
	if(content.title) {
		let title = document.createElement('h2');
		title.classList.add('page-title');
		title.innerText = content.title;
		section.appendChild(title);
	}
	
	if(content.description) {
		let description = document.createElement('h6');
		description.classList.add('page-description');
		description.innerText = content.description;
		section.appendChild(description);
	}
	
	if(content.type == 'chart' && content.chartData) {
		let canvas = document.createElement('div');
		canvas.id = 'section' + sectionNo;
		canvas.classList.add('box');
		canvas.classList.add('focusable');
		section.appendChild(canvas);
		
		renderChart(sectionNo, content);
	}
	
	if(content.type == 'grid' && content.cData)	{
		let component = document.createElement('div');
		component.id = 'section' + sectionNo;
		section.appendChild(component);
		
		renderGrid(sectionNo, content);
	}
	
	let nextDiv = document.createElement('div');
	nextDiv.classList.add('page-next');
	nextDiv.classList.add('not-selectable');
	let nextButton = document.createElement('a');
	nextButton.classList.add('focusable');
	nextButton.title = 'Next';
	if(section.nextElementSibling == null || !section.nextElementSibling.classList.contains('section')) {
		nextButton.style.visibility = 'hidden';
		nextButton.style.opacity = '0';
	}
	else
		nextButton.href = 'javascript:void(0)';
	nextButton.addEventListener('click', scrollToNextPage);
	nextButton.addEventListener('keyup', scrollToNextPage);
	let nextButtonIcon = renderGoogleIcon(main?.isSinglePage ? 'arrow_right' : 'arrow_drop_down');
	nextButton.appendChild(nextButtonIcon);
	nextDiv.appendChild(nextButton);
	section.appendChild(nextDiv);
}

function renderMenu() {
	let content = window['main'];
	if(window['elements'].filter(el => el.type == 'grid').length > 0) {
		let contentList = document.querySelector('.menu');
		if(contentList == null) return;
		contentList.innerHTML = '';
		// add home icon
		if(content?.isSinglePage)
		{
			let contentItem = renderGoogleIcon('home', ['home','focusable','not-selectable']);
			contentItem.title = 'Main Page';
			contentItem.href = 'javascript:void(0)';
			contentItem.addEventListener('keyup', function() {
				event.stopPropagation();
				event.preventDefault();
				if(event.key == 'Enter')
					event.target.click();
			});
			contentItem.addEventListener('click', function() {
				event.stopPropagation();
				scrollToPage(content.sectionNo);
				if(content.isSinglePage)
					event.target.scrollIntoView({ inline: 'center' });
			});
			contentList.appendChild(contentItem);
		}
		
		// add elements to menu
		let elements = window['elements'].filter(el => !el.isMain && el.type == 'grid');		
		if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.image && el.image.length > 0).length)
		{
			//image icons
			for(let section = 0; section < window['elements'].length; section++)
			{
				if(section == content?.sectionNo)
					continue;
				let contentItem = document.createElement('div');
				contentItem.className = 'icon focusable';
				contentItem.title = window['elements'][section].text || '';
				contentItem.style.backgroundImage = addBackgroundUrlClause(window['elements'][section].image);
				contentItem.addEventListener('keyup', function() {
					event.stopPropagation();
					event.preventDefault();
					if(event.key == 'Enter')
						event.target.click();
				});
				contentItem.addEventListener('click', function() {
					event.stopPropagation();
					scrollToPage(section);
					if(content?.isSinglePage)
						event.target.scrollIntoView({ inline: 'center', behavior: 'smooth' });
				});
				if(window['elements'][section].text)
					contentItem.title = window['elements'][section].text;
				contentList.appendChild(contentItem);
			}
		}
		else if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.text && el.text.length > 0).length)
		{
			//text icons
			for(let section = 0; section < window['elements'].length; section++)
			{
				if(section == content?.sectionNo)
					continue;
				let contentItem = document.createElement('div');
				contentItem.className = 'box text focusable';
				if(window['elements'][section].highlight)
					contentItem.classList.add('highlight');
				contentItem.innerText = window['elements'][section].text;
				contentItem.title = contentItem.innerText || '';
				contentItem.addEventListener('keyup', function() {
					event.stopPropagation();
					event.preventDefault();
					if(event.key == 'Enter')
						event.target.click();
				});
				contentItem.addEventListener('click', function() {
					event.stopPropagation();
					scrollToPage(section);
					if(content?.isSinglePage)
						event.target.scrollIntoView({ inline: 'center', behavior: 'smooth' });
				});
				contentList.appendChild(contentItem);
			}
		}		
		// spacer
		if(content?.isSinglePage) {
			let contentItem = document.createElement('div');
			contentItem.style.padding = '4px';
			contentList.appendChild(contentItem);
		}
	}
}

function renderButtons() {
	// go to top button
	let topButtonIcon = renderGoogleIcon('keyboard_double_arrow_up', ['button','button-top','not-selectable']);
	topButtonIcon.title = 'Back To Top';
	topButtonIcon.href = 'javascript:void(0)';
	if (document.querySelector('.button-top') == null) {
		document.body.appendChild(topButtonIcon);
		document.querySelector('.button-top').addEventListener('click', scrollToMainPage);
		document.querySelector('.page').addEventListener('scroll', toggleGoToTop);
	}
	else if (document.querySelector('.button-top') != null) {
		if(window['main']?.isSinglePage || isMobile())
			document.querySelector('.button-top').style.right = '10px';
		else 
			document.querySelector('.button-top').style.right = null;		
	}
	// exit button
	let closeButtonIcon = renderGoogleIcon('close', ['button','button-close','not-selectable']);
	closeButtonIcon.title = 'Close Popup';
	if (window['main']?.isSinglePage || isMobile()) 
		closeButtonIcon.style.right = '10px';
	if (window['main']?.hasExit && document.querySelector('.button-close') == null) {
		closeButtonIcon.href = processLinkExtensions(window['main']?.exitUrl);
		document.body.appendChild(closeButtonIcon);
	}
	else if (document.querySelector('.button-close') != null) {
		if(window['main']?.isSinglePage || isMobile()) 
			document.querySelector('.button-close').style.right = '10px';
		else 
			document.querySelector('.button-close').style.right = null;
	}
}

function renderFooter() {
	if(window['main']?.footer) {
		// footer text
		let footer = document.createElement('div');
		footer.classList.add('footer');
		footer.innerText = window['main']?.footer ?? '';
		document.querySelector('.page').appendChild(footer);
	}
	// set nav buttons on footer settings, based on single page bottom menu
	if(window['main']?.isSinglePage) {
		let menuHeight = document.querySelector('.menu').getBoundingClientRect().height + 'px';
		document.querySelector('.footer').style.bottom = menuHeight;
		for(let pagePrev of document.querySelectorAll('.page-prev'))
			pagePrev.style.bottom = menuHeight;
		for(let pageNext of document.querySelectorAll('.page-next'))
			pageNext.style.bottom = menuHeight;
	}
}

//--HELPER FUNCTIONS--//
function addBackgroundUrlClause(url) { return "url('" + url + "')"; }

function closestClass(inputElement, targetClassName) {
	// defunct, can use closest() now
    while ((inputElement.classList.length == 0 || !inputElement.classList.contains(targetClassName)) 
		&& inputElement.parentElement.tagName.toUpperCase() != "BODY") {
        inputElement = inputElement.parentElement;
    }
    return inputElement;
}

function renderBootstrapIcon(iconClass, addClass = []) {
	let newIcon = document.createElement('a');
	newIcon.className = 'bi ' + iconClass;
	for(let extra of addClass)
		newIcon.classList.add(extra);
	return newIcon;
}

function renderGoogleIcon(iconName, addClass = []) {
	let newIcon = document.createElement('a');
	newIcon.className = 'material-icons';
	for(let extra of addClass)
		newIcon.classList.add(extra);
	newIcon.innerText = iconName;
	return newIcon;
}

function removeLinkExtensions() {
	for(let a of document.querySelectorAll('a'))
		a.href = processLinkExtensions(a.href);
}

function processLinkExtensions(url) {
	if(!window.location.href.startsWith('file:///') && 
		(url.includes('knneo.github.io') || url.includes('knwebreports')))
		return url.replace('index.html', '').replace('.html', '');
	return url;
}

//--STARTUP FUNCTIONS--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);
function startup() {
	// load data
	if (document.querySelector('#data')?.textContent != null) { // script json in HTML DOM
		let testJson = JSON.parse(document.querySelector('#data')?.textContent || []);
		console.log('using inline html embedded json');
		localStorage.setItem('elements', JSON.stringify(testJson, null, '\t'));
	}
	else if(typeof pageElements != 'undefined') { // if not tied to js file with pageElements
		console.log('using js object pageElements');
		localStorage.setItem('elements', JSON.stringify(pageElements, null, '\t'));
	}
	else
		console.error('no data source found');
	// if stored, render
	if(localStorage.getItem('elements') != null)
		renderPage();
}

function renderPage() {
	// assume data at local storage
	renderVariables();
	renderBody();
	scrollToMainPage(this, true);
	if(typeof closeViewer == 'function') closeViewer();
}

function renderVariables() {
	// load from local storage
	window['elements'] = JSON.parse(localStorage.getItem('elements'));
	// filter items based on availability of js files
	if(typeof renderChart != 'function') // if no chart.js
		window['elements'] = window['elements'].filter(pe => pe.type != 'chart');
	if(typeof renderGrid != 'function') // if no grid.js
		window['elements'] = window['elements'].filter(pe => pe.type != 'grid');	
	// to allow multiple instances of charts based on data, in format 'container<no>'
	for(i = 0; i < window['elements'].length; i++)
		window['container'+i] = + i;	
	// define base values
	let mainSectionNo = window['elements'].findIndex(pe => pe.isMain);
	if(mainSectionNo >= 0) {
		window['main'] = window['elements'][mainSectionNo];
		window['main']['sectionNo'] = mainSectionNo;
	}
}