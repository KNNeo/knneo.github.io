function closestClass(inputElement, targetClassName) {
    while (inputElement.className != targetClassName && inputElement.parentNode.tagName.toUpperCase() != "BODY") {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function scrollToNextPage(e) {
	e.preventDefault();
	let nextPage = closestClass(this, 'section').nextElementSibling;
	if(nextPage != null)
		nextPage.scrollIntoView();
}

function scrollToPrevPage(e) {
	e.preventDefault();
	let prevPage = closestClass(this, 'section').previousElementSibling;
	if(prevPage != null)
		prevPage.scrollIntoView();
}

function scrollToPage(sectionNo, isSinglePage = false) {
	if(isSinglePage)
	{
		for(let section of document.getElementsByClassName('section'))
		{
			section.style.opacity = 0;
		}
		document.getElementsByClassName('section')[sectionNo].style.opacity = 1;
	}
	else
	{
		document.getElementsByClassName('section')[sectionNo].scrollIntoView();
	}
}

function scrollToMainPage(firstLoad) {
	// console.log(firstLoad);
	document.getElementsByClassName('page')[0].firstElementChild.scrollIntoView();
	if(firstLoad == true && document.querySelector('#main') != null)
		document.querySelector('#main').scrollIntoView();
}

function renderVariables() {	
	// window['elements'] = JSON.parse(JSON.stringify(pageElements));
	//check for extension js files here
	if(typeof renderChart != 'function')
	{
		window['elements'] = window['elements'].filter(pe => pe.type != 'chart');
	}
	if(typeof renderGrid != 'function')
	{
		window['elements'] = window['elements'].filter(pe => pe.type != 'grid');
	}
	
	// to allow multiple instances of charts based on data, in format 'container<no>'
	var k = 'container';
	for(i = 0; i < window['elements'].length; i++) {
		window[k+i] = + i;
	}
}

function renderPage() {
	document.getElementsByClassName('page')[0].innerHTML = '';
	// window['elements'] = JSON.parse(JSON.stringify(pageElements));
	
	let mainSectionNo = 0;
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(window['elements'][sectionNo].isMain) {
			let newMain = document.createElement('div');
			newMain.id = 'main';
			newMain.classList.add('section');
			newMain.style.height = '100vh';
			document.getElementsByClassName('page')[0].appendChild(newMain);
			mainSectionNo = sectionNo;
			// renderMain(sectionNo);
		}
		else {
			let newSection = document.createElement('div');
			newSection.classList.add('section');
			newSection.style.height = '100vh';
			document.getElementsByClassName('page')[0].appendChild(newSection);
			// console.log(mainSectionNo);
			// renderSection(sectionNo, mainSectionNo);
		}
	}
	
	renderFooter(window['elements'][mainSectionNo].isSinglePage);

	// if(window['elements'][mainSectionNo].isSinglePage)
	// {
		// setTimeout(function() {
			// let headerHeight = document.querySelector('.header').getBoundingClientRect().height;
			// document.getElementsByClassName('page')[0].style.maxHeight = (window.innerHeight - headerHeight) + 'px';
		// }, 10);
	// }
	
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(window['elements'][sectionNo].isMain) {
			renderMain(sectionNo);
		}
		else {
			renderSection(sectionNo, mainSectionNo);
		}
	}
	
	if(window['elements'][mainSectionNo].isSinglePage)
	{
		scrollToPage(mainSectionNo, window['elements'][mainSectionNo].isSinglePage);
	}
	
	renderButtons(window['elements'][mainSectionNo].isSinglePage);
}

function renderMain(sectionNo) {
	let content = window['elements'][sectionNo];
	
	if(document.querySelector('#main') != null) {
		let main = document.querySelector('#main');
		
		if(content.isSinglePage)
		{
			main.style.position = 'absolute';
			main.style.width = '100%';
			// setTimeout(function() {
				// let headerHeight = document.querySelector('.header').getBoundingClientRect().height;
				// main.style.maxHeight = (window.innerHeight - headerHeight) + 'px';
			// }, 10);
		}
		
		// if(main.previousElementSibling != null) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			prevDiv.classList.add('not-selectable');
			let prevButton = document.createElement('a');
			prevButton.title = 'Previous';
			prevButton.style.visibility = !content.isSinglePage && main.previousElementSibling != null ? 'visible' : 'hidden';
			prevButton.addEventListener('click', scrollToPrevPage);
			prevButton.addEventListener('touchstart', scrollToPrevPage);
			let prevButtonIcon = document.createElement('i');
			prevButtonIcon.classList.add('material-icons');
			prevButtonIcon.innerText = 'keyboard_arrow_up';
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		// }
		
		if(content.prefix)
		{
			let mainPre = document.createElement('h3');
			mainPre.style.padding = '5px';
			mainPre.innerText = content.prefix;
			main.appendChild(mainPre);
		}
		
		let mainTitle = document.createElement('h1');
		mainTitle.style.padding = '5px';
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		if(content.suffix)
		{
			let mainPost = document.createElement('h5');
			mainPost.style.padding = '5px';
			mainPost.innerText = content.suffix;
			main.appendChild(mainPost);
		}
		
		if(window['elements'].filter(el => el.type == 'grid').length > 0)
		{
			let contentList = document.createElement('div');
			contentList.classList.add('contents');
			contentList.style.padding = '5px';
			
			let iconSize = '8vw';
			if(content.isSinglePage || window.innerWidth <= 800) iconSize = '7vh';
			if(content.isSinglePage && window.innerWidth <= 800) iconSize = '11vw';
			
			if(content.isSinglePage)
			{
				let homeSize = '4.5rem';
				if(window.innerWidth <= 800) homeSize = '3.5rem';
				let contentItem = document.createElement('div');
				contentItem.classList.add('material-icons');
				contentItem.style.width = iconSize;
				contentItem.style.height = iconSize;
				contentItem.style.borderRadius = '50%';
				contentItem.style.cursor = 'pointer';
				contentItem.style.backgroundSize = 'contain';
				contentItem.style.backgroundRepeat = 'no-repeat';
				contentItem.style.backgroundPosition = 'center';
				contentItem.style.fontSize = homeSize;
				contentItem.style.padding = '4px 0';
				contentItem.innerText = 'home';
				contentItem.addEventListener('click', function(e) {
					e.preventDefault();
					scrollToPage(sectionNo, content.isSinglePage);
				});
				contentItem.addEventListener('touchstart', function(e) {
					e.preventDefault();
					scrollToPage(sectionNo, content.isSinglePage);
				});
				contentList.appendChild(contentItem);
			}
			
			let elements = window['elements'].filter(el => !el.isMain && el.type == 'grid');
			
			if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.image && el.image.length > 0).length)
			{
				for(let section = 0; section < window['elements'].length; section++)
				{
					if(section == sectionNo)
						continue;
					let contentItem = document.createElement('div');
					contentItem.style.width = iconSize;
					contentItem.style.height = iconSize;
					contentItem.style.borderRadius = '50%';
					contentItem.style.cursor = 'pointer';
					contentItem.style.backgroundSize = 'contain';
					contentItem.style.backgroundRepeat = 'no-repeat';
					contentItem.style.backgroundPosition = 'center';
					contentItem.addEventListener('click', function(e) {
						e.preventDefault();
						scrollToPage(section, content.isSinglePage);
					});
					contentItem.addEventListener('touchstart', function(e) {
						e.preventDefault();
						scrollToPage(section, content.isSinglePage);
					});
					contentItem.style.backgroundImage = addBackgroundUrlClause(window['elements'][section].image);
					if(window['elements'][section].text)
						contentItem.title = window['elements'][section].text;
					contentList.appendChild(contentItem);
				}
			}
			else if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.text && el.text.length > 0).length)
			{
				for(let section = 0; section < window['elements'].length; section++)
				{
					if(section == sectionNo)
						continue;
					let contentItem = document.createElement('div');
					contentItem.classList.add('box');
					contentItem.style.width = iconSize;
					contentItem.style.height = iconSize;
					contentItem.style.cursor = 'pointer';
					contentItem.style.margin = '0';
					contentItem.innerText = window['elements'][section].text;
					contentItem.addEventListener('click', function(e) {
						e.preventDefault();
						scrollToPage(section, content.isSinglePage);
					});
					contentItem.addEventListener('touchstart', function(e) {
						e.preventDefault();
						scrollToPage(section, content.isSinglePage);
					});
					contentList.appendChild(contentItem);
				}				
			}
			
			if(content.isSinglePage)
			{
				document.querySelector('.menu').appendChild(contentList);
			}
			else
			{
				main.appendChild(contentList);
			}
		}
		
		
		// if(main.nextElementSibling != null) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			nextDiv.classList.add('not-selectable');
			let nextButton = document.createElement('a');
			nextButton.title = 'Next';
			nextButton.style.visibility = !content.isSinglePage && main.nextElementSibling != null ? 'visible' : 'hidden';
			nextButton.addEventListener('click', scrollToNextPage);
			nextButton.addEventListener('touchstart', scrollToNextPage);
			let nextButtonIcon = document.createElement('i');
			nextButtonIcon.classList.add('material-icons');
			nextButtonIcon.innerText = 'keyboard_arrow_down';
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		// }
	}

}

function renderSection(sectionNo, mainSectionNo) {
	let section = document.getElementsByClassName('section')[sectionNo];// > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let main = window['elements'][mainSectionNo];
	let content = window['elements'][sectionNo];	
	
	if(main.isSinglePage)
	{
		section.style.position = 'absolute';
		section.style.width = '100%';
		// setTimeout(function() {
			// let headerHeight = document.querySelector('.header').getBoundingClientRect().height;
			// section.style.maxHeight = (window.innerHeight - headerHeight) + 'px';
		// }, 10);
	}
	
	let prevDiv = document.createElement('div');
	prevDiv.classList.add('page-prev');
	prevDiv.classList.add('not-selectable');
	let prevButton = document.createElement('a');
	prevButton.title = 'Previous';
	prevButton.style.visibility = !main.isSinglePage && section.previousElementSibling != null && section.previousElementSibling.classList.contains('section') ? 'visible' : 'hidden';
	prevButton.addEventListener('click',scrollToPrevPage);
	prevButton.addEventListener('touchstart',scrollToPrevPage);
	let prevButtonIcon = document.createElement('i');
	prevButtonIcon.classList.add('material-icons');
	prevButtonIcon.innerText = 'keyboard_arrow_up';
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
		section.appendChild(canvas);
		
		renderChart(sectionNo, content);
	}
	
	if(content.type == 'grid' && content.componentData)	{
		let component = document.createElement('div');
		component.id = 'section' + sectionNo;
		section.appendChild(component);
		
		renderGrid(sectionNo, content);
	}
	
	
	let nextDiv = document.createElement('div');
	nextDiv.classList.add('page-next');
	nextDiv.classList.add('not-selectable');
	let nextButton = document.createElement('a');
	nextButton.title = 'Next';
	nextButton.style.visibility = !main.isSinglePage && section.nextElementSibling != null && section.nextElementSibling.classList.contains('section') ? 'visible' : 'hidden';
	nextButton.addEventListener('click',scrollToNextPage);
	nextButton.addEventListener('touchstart',scrollToNextPage);
	let nextButtonIcon = document.createElement('i');
	nextButtonIcon.classList.add('material-icons');
	nextButtonIcon.innerText = 'keyboard_arrow_down';
	nextButton.appendChild(nextButtonIcon);
	nextDiv.appendChild(nextButton);
	section.appendChild(nextDiv);
}

function renderMenu() {
	let header = document.createElement('div');
	header.classList.add('menu');
	// document.body.insertBefore(header, document.getElementsByClassName('page')[0]);
	// document.body.appendChild(header);
	return header;
}

function renderFooter(isSinglePage) {
	let footer = document.createElement('div');
	footer.classList.add('footer');
	if(isSinglePage)
	{
		footer.style.width = '100%';
		footer.style.position = 'fixed';
		// footer.style.bottom = 0;
		footer.style.justifyContent = 'flex-end';
	}
	footer.innerText = '(c) Klassic Note';
	document.getElementsByClassName('page')[0].appendChild(footer);
	document.getElementsByClassName('page')[0].appendChild(renderMenu());
}

function renderButtons(isSinglePage) {
	if(document.getElementById('GoToTopBtn') == null)
	{
		let topButton = document.createElement('a');
		topButton.id = 'GoToTopBtn';
		topButton.title = 'Back To Top';
		if(isMobile()) topButton.style.right = '10px';
		let topButtonIcon = document.createElement('i');
		topButtonIcon.classList.add('material-icons');
		topButtonIcon.classList.add('not-selectable');
		topButtonIcon.innerText = 'arrow_upward';
		topButton.appendChild(topButtonIcon);
		document.body.appendChild(topButton);
		document.getElementById('GoToTopBtn').addEventListener('click', scrollToMainPage);
		document.getElementById('GoToTopBtn').addEventListener('contextmenu', function(e) {
			e.preventDefault();
			getJson("https://knneo.github.io/statistics/data/books.json", setPageElements);
		});
		document.getElementsByClassName('page')[0].addEventListener('scroll', toggleGoToTopBtn);
	}

	if(document.getElementById('CloseBtn') == null)
	{
		let closeButton = document.createElement('a');
		closeButton.id = 'CloseBtn';
		closeButton.title = 'Close Popup';
		if(isSinglePage || isMobile()) closeButton.style.right = '10px';
		let closeButtonIcon = document.createElement('i');
		closeButtonIcon.classList.add('material-icons');
		closeButtonIcon.classList.add('not-selectable');
		closeButtonIcon.innerText = 'close';
		closeButton.appendChild(closeButtonIcon);
		document.body.appendChild(closeButton);
		document.getElementById('CloseBtn').addEventListener('click', goBack);
	}
}

function goBack() {
	window.location.href = '../index.html';
}

function toggleGoToTopBtn() {
	// When the user scrolls down to viewport from the top of the document, change floating action button
	if (document.getElementsByClassName('page')[0].scrollTop >= document.body.clientHeight) {
		document.getElementById('GoToTopBtn').style.visibility = 'visible';
	} else {
		document.getElementById('GoToTopBtn').style.visibility = '';
	}
}

function addBackgroundUrlClause(url) { return "url('" + url + "')"; }

function setPageElements(content) {
	window['elements'] = JSON.parse(JSON.stringify(content));
	// window['elements'][0].isSinglePage = true;
	renderVariables();
	renderPage();
	scrollToMainPage(true);
}

// startup
window.addEventListener('load', startup);
window.addEventListener('resize', renderPage);
function startup() {
	if(document.body.getBoundingClientRect().width <= 400 && document.querySelector('.landing') != null) 
	{
		document.querySelector('.landing').style.display = 'block';
		return;
	}
	getJson("https://knneo.github.io/statistics/data/gallery.json", setPageElements);
}