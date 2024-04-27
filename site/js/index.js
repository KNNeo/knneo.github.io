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
	event.stopPropagation();
	let nextPage = this.closest('.section').nextElementSibling;
	if(nextPage != null)
		if(document.body.classList.contains('single'))
			scrollToPage(nextPage.getAttribute('data-section'));
		nextPage.focus();
}

function scrollToPrevPage() {
	event.stopPropagation();
	let prevPage = this.closest('.section').previousElementSibling;
	if(prevPage != null) {
		if(document.body.classList.contains('single'))
			scrollToPage(prevPage.getAttribute('data-section'));
		prevPage.focus();
	}
}

function scrollToPage(sectionNo) {
	if(window['main'].isSinglePage) {
		for(let section of document.querySelectorAll('.section'))
			section.classList.add('hidden');
		document.querySelectorAll('.section')[sectionNo].classList.remove('hidden');
	}
	else
		document.querySelectorAll('.section')[sectionNo].focus();
}

function scrollToMainPage(el, onLoad) {
	// console.log(firstLoad);
	if(!window['loaded'] || !onLoad)
	{
		if(document.querySelector('.main') != null)
			document.querySelector('.main').focus();
		else
			document.querySelector('.page').firstElementChild.focus();
	}
}

function toggleGoToTop() {
	// When the user scrolls down to viewport from the top of the document, change floating action button
	if (document.querySelector('.page').scrollTop >= document.body.clientHeight)
		document.querySelector('.button-top').style.visibility = 'visible';
	else
		document.querySelector('.button-top').style.visibility = '';
}

function toggleEditor() {
	if(document.querySelector('.editor') != null) {
		let editorText = document.querySelector('.editor-area').value;
		let isClosing = document.querySelector('.editor').style.display == 'block'; //previous state	
		document.querySelector('.editor').style.display = isClosing ? 'none' : 'block';
		localStorage.setItem('elements', editorText);
		document.querySelector('.editor').value = isClosing ? '' : localStorage.getItem('elements');
		if(isClosing) {
			// if(editorText.trim().startsWith('http') && editorText.trim().endsWith('.json')) // if address of json is in editor
				// getJson(editorText, setPageElements);
			// else // raw json text
			setPageElements();
		}
	}
	else {
		let editor = document.createElement('div');
		// editor.id = 'editor';
		editor.classList.add('editor');
		// editor.style.height = '100%';
		// editor.style.width = '100%';
		// editor.style.display = 'block';
		// editor.style.position = 'absolute';
		// editor.style.border = '0';
		// editor.style.top = '0';
		// editor.style.zIndex = 10;
		
		let editorArea = document.createElement('textarea');
		// editorArea.id = 'editor-area';
		editorArea.classList.add('editor-area');
		// editorArea.style.height = '95%';
		// editorArea.style.width = '90%';
		// editorArea.style.display = 'block';
		// editorArea.style.marginLeft = 'auto';
		// editorArea.style.marginRight = 'auto';
		editorArea.value = localStorage.getItem('elements');
		editor.appendChild(editorArea);
		
		document.body.appendChild(editor);
	}
}

//--RENDER FUNCTIONS--//
function renderPage() {
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
	if(window['main'].isSinglePage) {
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
	// add focus events
	for(let focusable of document.querySelectorAll('.focusable')) {
		focusable.tabIndex = 0;
		focusable.addEventListener('keyup', function() {
			if(event.keyCode == 13)
				this.click();
		});
	}
}

function renderMain() {
	let content = window['main'];
	
	if(document.querySelector('.main') != null) {
		let main = document.querySelector('.main');
		main.classList.add('focusable');
		if(content.isSinglePage)
			main.style.height = 'calc(100% - ' + ((document.querySelector('.menu').getBoundingClientRect().height + 35) + 'px') + ')';
		
		if(content.sectionNo > 0) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			prevDiv.classList.add('not-selectable');
			let prevButton = document.createElement('a');
			prevButton.classList.add('focusable');
			prevButton.title = 'Previous';
			if(main.previousElementSibling == null)	nextButton.style.opacity = '0';
			else nextButton.href = 'javascript:void(0)';
			prevButton.addEventListener('click', scrollToPrevPage);
			let prevButtonIcon = document.createElement('a');
			prevButtonIcon.className = content.isSinglePage ? 'bi bi-caret-left-fill' : 'bi bi-caret-up-fill';
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
			if(main.nextElementSibling == null) nextButton.style.opacity = '0';
			else nextButton.href = 'javascript:void(0)';
			nextButton.addEventListener('click', scrollToNextPage);
			let nextButtonIcon = document.createElement('a');
			nextButtonIcon.className = content.isSinglePage ? 'bi bi-caret-right-fill' : 'bi bi-caret-down-fill';
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
	if(main.isSinglePage)
		section.style.height = 'calc(100% - ' + ((document.querySelector('.menu').getBoundingClientRect().height + 35) + 'px') + ')';
	
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
	prevButton.addEventListener('click',scrollToPrevPage);
	let prevButtonIcon = document.createElement('a');
	prevButtonIcon.className = main.isSinglePage ? 'bi bi-caret-left-fill' : 'bi bi-caret-up-fill';
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
	
	if(content.type == 'grid' && content.componentData)	{
		let component = document.createElement('div');
		component.id = 'section' + sectionNo;
		section.appendChild(component);
		
		renderGrid(sectionNo, content, main.isSinglePage);
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
	nextButton.addEventListener('click',scrollToNextPage);
	let nextButtonIcon = document.createElement('a');
	nextButtonIcon.className = main.isSinglePage ? 'bi bi-caret-right-fill' : 'bi bi-caret-down-fill';
	nextButton.appendChild(nextButtonIcon);
	nextDiv.appendChild(nextButton);
	section.appendChild(nextDiv);
}

function renderMenu() {
	let content = window['main'];
	if(window['elements'].filter(el => el.type == 'grid').length > 0) {
		let contentList = document.createElement('div');
		contentList.classList.add('contents');
		// define icon size by configuration
		// let iconSize = '10vw';
		// let maxIconSize = '120px';
		// let iconFontSize = '1.5rem';
		// let drawerHeight = '15vh';
		// let homeIconSize = '90px';
		// if (content.isSinglePage) {
			// iconFontSize = '1rem';
			// maxIconSize = '90px';
		// }
		// if (smallScreenWidth()) {
			// iconSize = '19vw';
			// maxIconSize = '80px';
			// drawerHeight = '30px';
			// iconFontSize = '1rem';
			// homeIconSize = '80px';
		// }
		// document.querySelector('.menu').style.minHeight = content.isSinglePage && smallScreenWidth() ? drawerHeight : '';
		// document.querySelector('.menu').style.maxHeight = content.isSinglePage && smallScreenWidth() ? drawerHeight : '';
		//drawer, home icon
		if(content.isSinglePage)
		{
			// add drag handle if mobile, or low screen height
			// if(smallScreenWidth() || smallScreenHeight())
			// {
				// let contentItem = document.createElement('div');
				// contentItem.classList.add('handle');
				// contentItem.classList.add('material-icons');
				// contentItem.classList.add('focusable');
				// contentItem.innerText = 'drag_handle';
				// contentItem.addEventListener('click', function() {
					// event.stopPropagation();
					// document.querySelector('.menu').style.maxHeight = document.querySelector('.menu').style.maxHeight == 'initial' ? drawerHeight : 'initial';
				// });
				// contentItem.addEventListener('touchmove', function() {
					// event.stopPropagation();
					// document.querySelector('.menu').style.maxHeight = (getScreenHeight() - event.touches[0].clientY + 20) + 'px';
				// });
				// contentList.appendChild(contentItem);
				
				// if(getScreenHeight() < 760)
					// document.querySelector('.menu').style.maxHeight = drawerHeight;
			// }
			// add home icon
			let contentItem = document.createElement('div');
			// contentItem.classList.add('material-icons');
			contentItem.className = 'home focusable bi bi-house-fill';
			// contentItem.style.fontSize = homeIconSize;
			// contentItem.innerText = 'home';
			contentItem.addEventListener('keyup', function() {
				event.stopPropagation();
				event.preventDefault();
				if(event.key == 'Enter')
					event.target.click();
			});
			contentItem.addEventListener('click', function() {
				event.stopPropagation();
				// document.querySelector('.menu').style.maxHeight = document.querySelector('.menu').style.maxHeight == 'initial' ? drawerHeight : 'initial';
				scrollToPage(content.sectionNo);
				if(content.isSinglePage)
					event.target.scrollIntoView({ inline: 'center' });
			});
			// contentItem.addEventListener('touchstart', function() {
				// event.stopPropagation();
				// scrollToPage(content.sectionNo);
			// });
			contentList.appendChild(contentItem);
		}
		
		// add elements to menu
		let elements = window['elements'].filter(el => !el.isMain && el.type == 'grid');		
		if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.image && el.image.length > 0).length)
		{
			//image icons
			for(let section = 0; section < window['elements'].length; section++)
			{
				if(section == content.sectionNo)
					continue;
				let contentItem = document.createElement('div');
				contentItem.classList.add('icon');
				contentItem.classList.add('focusable');
				// contentItem.style.width = iconSize;
				// contentItem.style.height = iconSize;
				// contentItem.style.maxWidth = maxIconSize;
				// contentItem.style.maxHeight = maxIconSize;
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
					// if(smallScreenWidth() || smallScreenHeight())
						// document.querySelector('.menu').style.maxHeight = drawerHeight;
					if(content.isSinglePage)
						event.target.scrollIntoView({ inline: 'center', behavior: 'smooth' });
				});
				// contentItem.addEventListener('touchstart', function() {
					// event.stopPropagation();
					// scrollToPage(section, content.isSinglePage);
					// document.querySelector('.menu').style.maxHeight = drawerHeight;
				// });
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
				if(section == content.sectionNo)
					continue;
				let contentItem = document.createElement('div');
				contentItem.classList.add('box');
				contentItem.classList.add('text');
				contentItem.classList.add('focusable');
				if(window['elements'][section].highlight)
					contentItem.classList.add('highlight');
				// contentItem.style.width = iconSize;
				// contentItem.style.height = iconSize;
				// contentItem.style.maxWidth = maxIconSize;
				// contentItem.style.maxHeight = maxIconSize;
				// contentItem.style.fontSize = iconFontSize;
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
					// if(smallScreenWidth() || smallScreenHeight())
						// document.querySelector('.menu').style.maxHeight = drawerHeight;
					if(content.isSinglePage)
						event.target.scrollIntoView({ inline: 'center', behavior: 'smooth' });
				});
				// contentItem.addEventListener('touchstart', function() {
					// event.stopPropagation();
					// contentItem.style.boxShadow = '1px 1px';
					// contentItem.style.transform = 'translate(2px, 2px)';
					// scrollToPage(section);
					// document.querySelector('.menu').style.maxHeight = drawerHeight;
				// });
				// contentItem.addEventListener('touchend', function() {
					// event.stopPropagation();
					// contentItem.style.boxShadow = '';
					// contentItem.style.transform = '';
					// scrollToPage(section);
					// document.querySelector('.menu').style.maxHeight = drawerHeight;
				// });
				contentList.appendChild(contentItem);
			}
		}		
		// drawer, spacer
		if(content.isSinglePage) {
			let contentItem = document.createElement('div');
			contentItem.style.padding = '4px';
			contentList.appendChild(contentItem);
		}
		// add into DOM
		document.querySelector('.menu').innerHTML = '';
		document.querySelector('.menu').appendChild(contentList);
	}
}

function renderButtons() {
	// go to top button
	let topButtonIcon = document.createElement('a');
	topButtonIcon.className = 'button button-top not-selectable bi bi-arrow-up';
	topButtonIcon.title = 'Back To Top';
	if (document.querySelector('.button-top') == null) {
		document.body.appendChild(topButtonIcon);
		document.querySelector('.button-top').addEventListener('click', scrollToMainPage);
		document.querySelector('.page').addEventListener('scroll', toggleGoToTop);
	}
	else if (document.querySelector('.button-top') != null) {
		if(window['main'].isSinglePage || isMobile())
			document.querySelector('.button-top').style.right = '10px';
		else 
			document.querySelector('.button-top').style.right = null;		
	}
	// editor button (depreceated)
	// let editorButtonIcon = document.createElement('a');
	// editorButtonIcon.classList.add('button');
	// editorButtonIcon.classList.add('button-editor');
	// editorButtonIcon.classList.add('material-icons');
	// editorButtonIcon.classList.add('not-selectable');
	// editorButtonIcon.title = 'Toggle Editor';
	// editorButtonIcon.innerText = 'code';
	// if(document.querySelector('.button-editor') == null) {
		// document.body.appendChild(editorButtonIcon);
		// document.querySelector('.button-editor').addEventListener('click', toggleEditor);
	// }
	// else {
		// if(window['main'].isSinglePage || isMobile()) 
			// document.querySelector('.button-editor').style.right = '10px';
		// else 
			// document.querySelector('.button-editor').style.right = null;
	// }
	// exit button
	let closeButtonIcon = document.createElement('a');
	closeButtonIcon.className = 'button button-close not-selectable bi bi-x-lg';
	closeButtonIcon.title = 'Close Popup';
	// closeButtonIcon.innerText = 'close';
	if (window['main'].isSinglePage || isMobile()) 
		closeButtonIcon.style.right = '10px';
	if (window['main'].hasExit && document.querySelector('.button-close') == null) {
		document.body.appendChild(closeButtonIcon);
		document.querySelector('.button-close').addEventListener('click', function() {
			window.location.href = window['main'].exitUrl;
		});
		// document.querySelector('.button-close').addEventListener('contextmenu', function() {
			// event.preventDefault();
			// window['single'] = window['single'] != undefined ? !window['single'] : true;
			// getJson(document.querySelector('#data-id').src, setPageElements);
		// });
	}
	else if (document.querySelector('.button-close') != null) {
		if(window['main'].isSinglePage || isMobile()) 
			document.querySelector('.button-close').style.right = '10px';
		else 
			document.querySelector('.button-close').style.right = null;
	}
}

function renderFooter() {
	// footer text
	let footer = document.createElement('div');
	footer.classList.add('footer');
	footer.innerText = window['main'].footer ?? '';
	document.querySelector('.page').appendChild(footer);
	// set nav buttons on footer settings, based on single page bottom menu
	if(window['main'].isSinglePage) {
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

//--STARTUP FUNCTIONS--//
window.addEventListener('load', startup);
window.addEventListener('resize', startup);
function startup() {
	// block page if cannot fit screen width (see statistics.html)
	if(document.body.getBoundingClientRect().width <= 400 && document.querySelector('.landing') != null) {
		document.querySelector('.landing').style.display = 'block';
		localStorage.removeItem('elements');
		return;
	}
	// load data
	if (document.querySelector('#data')?.textContent != null) { // script json in HTML DOM
		let testJson = JSON.parse(document.querySelector('#data')?.textContent || []);
		console.log('using inline html embedded json');
		setPageElements(testJson);
	}
	else if(typeof pageElements != 'undefined') { // if not tied to js file with pageElements
		window['editor'] = true;
		setPageElements(pageElements);
	}
	// else if(localStorage.getItem('elements') != null) // if have storage
		// setPageElements();
	// else if(typeof getJson == 'function' && document.querySelector('#data-id') != null) // if #data-id exists pointing to json file
		// getJson(document.querySelector('#data-id').src, setPageElements);
	else
		console.error('no data source found');
	
	// set first load flag
	let firstLoad = window['loaded'] != true;
	window['loaded'] = true;
	// close viewer if open
	if(typeof closeViewer == 'function') closeViewer();
}

function setPageElements(content) {
	// if items exist, save into localstorage
	if(content != null) {
		localStorage.setItem('elements', JSON.stringify(content, null, '\t'));
		if(document.querySelector('.editor-area') != null)
			document.querySelector('.editor-area').value = localStorage.getItem('elements');
	}
	// if no editor, reset localstorage
	if(!window['editor'] && document.querySelector('.button-editor') != null) {
		document.querySelector('.button-editor').style.display = 'none';
		localStorage.removeItem('elements');
	}
	// render elements
	renderVariables();
	setTimeout(renderPage, 1);
	setTimeout(function () {
		scrollToMainPage(this, true);
	}, 500); // after load page, scroll to main section
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
	window['main'] = window['elements'][mainSectionNo];
	window['main']['sectionNo'] = mainSectionNo;
}