function closestClass(inputElement, targetClassName) {
    while ((inputElement.classList.length == 0 || !inputElement.classList.contains(targetClassName)) 
		&& inputElement.parentNode.tagName.toUpperCase() != "BODY") {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function scrollToNextPage() {
	event.stopPropagation();
	let nextPage = closestClass(this, 'section').nextElementSibling;
	if(nextPage != null)
		nextPage.scrollIntoView();
}

function scrollToPrevPage() {
	event.stopPropagation();
	let prevPage = closestClass(this, 'section').previousElementSibling;
	if(prevPage != null)
		prevPage.scrollIntoView();
}

function scrollToPage(sectionNo, isSinglePage = false) {
	if(isSinglePage)
	{
		for(let section of document.querySelectorAll('.section'))
		{
			section.style.opacity = 0;
			section.style.zIndex = 0;
		}
		document.querySelectorAll('.section')[sectionNo].style.opacity = 1;
		document.querySelectorAll('.section')[sectionNo].style.zIndex = 1;
	}
	else
	{
		document.querySelectorAll('.section')[sectionNo].scrollIntoView();
		setTimeout(function() {
			document.querySelectorAll('.section')[sectionNo].focus()
		}, 500);
	}
}

function scrollToMainPage(el, onLoad) {
	// console.log(firstLoad);
	if(!window['loaded'] || !onLoad)
	{
		if(document.querySelector('.main') != null)
			document.querySelector('.main').scrollIntoView();
		else
			document.querySelector('.page').firstElementChild.scrollIntoView();
	}
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
	document.querySelector('.page').innerHTML = '';
	
	let type = '';
	let mainSectionNo = 0;
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(window['elements'][sectionNo].isMain) {
			let newMain = document.createElement('div');
			newMain.classList.add('main');
			newMain.classList.add('section');
			newMain.addEventListener('click', function() {
				event.stopPropagation();
				scrollToPage(sectionNo, window['elements'][mainSectionNo].isSinglePage);
			});
			// newMain.style.height = '100vh'; // not in css because of single page
			document.querySelector('.page').appendChild(newMain);
			mainSectionNo = sectionNo;
			// renderMain(sectionNo);
		}
		else {
			let newSection = document.createElement('div');
			newSection.classList.add('section');
			newSection.classList.add('focusable');
			newSection.addEventListener('click', function() {
				event.stopPropagation();
				scrollToPage(sectionNo, window['elements'][mainSectionNo].isSinglePage);
			});
			// newSection.style.height = '100vh';
			document.querySelector('.page').appendChild(newSection);
			// console.log(mainSectionNo);
			// renderSection(sectionNo, mainSectionNo);
		}
	}
	
	renderFooter(window['elements'][mainSectionNo].isSinglePage, window['elements'][mainSectionNo].footer);
	
	for(let sectionNo = 0; sectionNo < window['elements'].length; sectionNo++) {
		if(window['elements'][sectionNo].isMain) {
			document.body.appendChild(renderMenu());
			renderMain(sectionNo);
		}
		else {
			renderSection(sectionNo, mainSectionNo);
		}
	}
	
	document.body.className = '';
	if(window['elements'][mainSectionNo].isSinglePage)
	{
		document.body.classList.add('single');
		scrollToPage(mainSectionNo, window['elements'][mainSectionNo].isSinglePage);
	}
	else
	{
		document.body.classList.add('one');
	}
	
	renderButtons(window['elements'][mainSectionNo].isSinglePage);
	
	for(let focusable of document.querySelectorAll('.focusable'))
	{
		focusable.tabIndex = 0;
		focusable.addEventListener('keyup', function() {
			if(event.keyCode == 13)
				this.click();
		});
	}
}

function renderMain(sectionNo) {
	let content = window['elements'][sectionNo];
	
	if(document.querySelector('.main') != null) {
		let main = document.querySelector('.main');
				
		if(sectionNo > 0) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			prevDiv.classList.add('not-selectable');
			let prevButton = document.createElement('a');
			prevButton.classList.add('focusable');
			prevButton.title = 'Previous';
			if(content.isSinglePage || main.previousElementSibling == null)
				nextButton.style.opacity = '0';
			else
				nextButton.href = 'javascript:void(0)';
			prevButton.addEventListener('click', scrollToPrevPage);
			// prevButton.addEventListener('touchstart', scrollToPrevPage);
			let prevButtonIcon = document.createElement('i');
			prevButtonIcon.classList.add('material-icons');
			prevButtonIcon.innerText = 'arrow_drop_up';
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		}
		
		if(content.prefix)
		{
			let mainPre = document.createElement('h3');
			mainPre.classList.add('title');
			// mainPre.style.padding = '5px';
			mainPre.innerText = content.prefix;
			main.appendChild(mainPre);
		}
		
		let mainTitle = document.createElement('h1');
		mainTitle.classList.add('title');
		// mainTitle.style.padding = '5px';
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		if(content.suffix)
		{
			let mainPost = document.createElement('h5');
			mainPost.classList.add('title');
			// mainPost.style.padding = '5px';
			mainPost.innerText = content.suffix;
			main.appendChild(mainPost);
		}
		
		if(window['elements'].filter(el => el.type == 'grid').length > 0)
		{
			let contentList = document.createElement('div');
			contentList.classList.add('contents');
			
			let iconSize = '6rem';
			let drawerHeight = '15vh';
			if (window.innerHeight < 760) {
				iconSize = '4rem';
				drawerHeight = '30px';
			}
			if (content.isSinglePage) iconSize = '5rem';
			document.querySelector('.menu').style.minHeight = content.isSinglePage && window.innerWidth < 760 ? drawerHeight : '';
			document.querySelector('.menu').style.maxHeight = content.isSinglePage && window.innerWidth < 760 ? drawerHeight : '';

			//drawer, home icon
			if(content.isSinglePage)
			{
				// add drag handle if mobile, or low screen height
				if(window.innerWidth < 760 || window.innerHeight < 760)
				{
					let contentItem = document.createElement('div');
					contentItem.classList.add('handle');
					contentItem.classList.add('material-icons');
					contentItem.classList.add('focusable');
					contentItem.innerText = 'drag_handle';
					contentItem.addEventListener('click', function() {
						event.stopPropagation();
						document.querySelector('.menu').style.maxHeight = document.querySelector('.menu').style.maxHeight == 'initial' ? drawerHeight : 'initial';
					});
					contentItem.addEventListener('touchmove', function() {
						event.stopPropagation();
						document.querySelector('.menu').style.maxHeight = (window.innerHeight - event.touches[0].clientY + 20) + 'px';
					});
					contentList.appendChild(contentItem);
					
					if(window.innerHeight < 760)
						document.querySelector('.menu').style.maxHeight = drawerHeight;
				}
				
				let contentItem = document.createElement('div');
				contentItem.classList.add('material-icons');
				contentItem.classList.add('home');
				contentItem.classList.add('focusable');
				contentItem.style.fontSize = iconSize;
				contentItem.innerText = 'home';
				contentItem.addEventListener('click', function() {
					event.stopPropagation();
						document.querySelector('.menu').style.maxHeight = document.querySelector('.menu').style.maxHeight == 'initial' ? drawerHeight : 'initial';
					scrollToPage(sectionNo, content.isSinglePage);
				});
				// contentItem.addEventListener('touchstart', function() {
					// event.stopPropagation();
					// scrollToPage(sectionNo, content.isSinglePage);
				// });
				contentList.appendChild(contentItem);
			}
			
			let elements = window['elements'].filter(el => !el.isMain && el.type == 'grid');
			
			if(elements.length == window['elements'].filter(el => el.type == 'grid' && el.image && el.image.length > 0).length)
			{
				//image icons
				for(let section = 0; section < window['elements'].length; section++)
				{
					if(section == sectionNo)
						continue;
					let contentItem = document.createElement('div');
					contentItem.classList.add('icon');
					contentItem.classList.add('focusable');
					contentItem.style.width = iconSize;
					contentItem.style.height = iconSize;
					contentItem.title = window['elements'][section].text || '';
					contentItem.style.backgroundImage = addBackgroundUrlClause(window['elements'][section].image);
					contentItem.addEventListener('click', function() {
						event.stopPropagation();
						scrollToPage(section, content.isSinglePage);
						if(window.innerWidth < 760 || window.innerHeight < 760)
							document.querySelector('.menu').style.maxHeight = drawerHeight;
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
					if(section == sectionNo)
						continue;
					let contentItem = document.createElement('div');
					contentItem.classList.add('box');
					contentItem.classList.add('text');
					contentItem.classList.add('focusable');
					contentItem.style.width = iconSize;
					contentItem.style.height = iconSize;
					// contentItem.style.cursor = 'pointer';
					// contentItem.style.margin = '0';
					contentItem.innerText = window['elements'][section].text;
					contentItem.title = contentItem.innerText || '';
					contentItem.addEventListener('click', function() {
						event.stopPropagation();
						scrollToPage(section, content.isSinglePage);
						if(window.innerWidth < 760 || window.innerHeight < 760)
							document.querySelector('.menu').style.maxHeight = drawerHeight;
					});
					// contentItem.addEventListener('touchstart', function() {
						// event.stopPropagation();
						// contentItem.style.boxShadow = '1px 1px';
						// contentItem.style.transform = 'translate(2px, 2px)';
						// scrollToPage(section, content.isSinglePage);
						// document.querySelector('.menu').style.maxHeight = drawerHeight;
					// });
					// contentItem.addEventListener('touchend', function() {
						// event.stopPropagation();
						// contentItem.style.boxShadow = '';
						// contentItem.style.transform = '';
						// scrollToPage(section, content.isSinglePage);
						// document.querySelector('.menu').style.maxHeight = drawerHeight;
					// });
					contentList.appendChild(contentItem);
				}				
			}
			
			if(content.isSinglePage)
			{
				document.querySelector('.menu').innerHTML = '';
				document.querySelector('.menu').appendChild(contentList);
			}
			else
			{
				main.appendChild(contentList);
			}
		}
		
		
		if(window['elements'].length > 1) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			nextDiv.classList.add('not-selectable');
			let nextButton = document.createElement('a');
			nextButton.classList.add('focusable');
			nextButton.title = 'Next';
			if(content.isSinglePage || main.nextElementSibling == null)
				nextButton.style.opacity = '0';
			else
				nextButton.href = 'javascript:void(0)';
			nextButton.addEventListener('click', scrollToNextPage);
			// nextButton.addEventListener('touchstart', scrollToNextPage);
			let nextButtonIcon = document.createElement('i');
			nextButtonIcon.classList.add('material-icons');
			nextButtonIcon.innerText = 'arrow_drop_down';
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		}
	}

}

function renderSection(sectionNo, mainSectionNo) {
	let section = document.querySelectorAll('.section')[sectionNo];// > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let main = window['elements'][mainSectionNo];
	let content = window['elements'][sectionNo];	
		
	if(!main.isSinglePage)
	{
		let prevDiv = document.createElement('div');
		prevDiv.classList.add('page-prev');
		prevDiv.classList.add('not-selectable');
		let prevButton = document.createElement('a');
		prevButton.classList.add('focusable');
		prevButton.title = 'Previous';
		if(main.isSinglePage || section.previousElementSibling == null || !section.previousElementSibling.classList.contains('section'))
			prevButton.style.opacity = '0';
		else
			prevButton.href = 'javascript:void(0)';
		prevButton.addEventListener('click',scrollToPrevPage);
		// prevButton.addEventListener('touchstart',scrollToPrevPage);
		let prevButtonIcon = document.createElement('i');
		prevButtonIcon.classList.add('material-icons');
		prevButtonIcon.innerText = 'arrow_drop_up';
		prevButton.appendChild(prevButtonIcon);
		prevDiv.appendChild(prevButton);
		section.appendChild(prevDiv);
	}
	
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
		
		renderGrid(sectionNo, content);
	}
	
	if(!main.isSinglePage)
	{
		let nextDiv = document.createElement('div');
		nextDiv.classList.add('page-next');
		nextDiv.classList.add('not-selectable');
		let nextButton = document.createElement('a');
		nextButton.classList.add('focusable');
		nextButton.title = 'Next';
		if(main.isSinglePage || section.nextElementSibling == null || !section.nextElementSibling.classList.contains('section')) 	
			nextButton.style.opacity = '0';
		else
			nextButton.href = 'javascript:void(0)';
		nextButton.addEventListener('click',scrollToNextPage);
		// nextButton.addEventListener('touchstart',scrollToNextPage);
		let nextButtonIcon = document.createElement('i');
		nextButtonIcon.classList.add('material-icons');
		nextButtonIcon.innerText = 'arrow_drop_down';
		nextButton.appendChild(nextButtonIcon);
		nextDiv.appendChild(nextButton);
		section.appendChild(nextDiv);
	}
}

function renderMenu() {
	let header = document.createElement('div');
	header.classList.add('menu');
	return header;
}

function renderFooter(isSinglePage, footerText) {
	let footer = document.createElement('div');
	footer.classList.add('footer');
	footer.innerText = footerText ?? '';
	document.querySelector('.page').appendChild(footer);
	if(!isSinglePage) document.querySelector('.page').appendChild(renderMenu());
}

function renderButtons(isSinglePage) {
	let topButton = document.createElement('a');
	topButton.classList.add('button');
	topButton.classList.add('button-top');
	topButton.title = 'Back To Top';
	let topButtonIcon = document.createElement('i');
	topButtonIcon.classList.add('material-icons');
	topButtonIcon.classList.add('not-selectable');
	topButtonIcon.innerText = 'north';
	topButton.appendChild(topButtonIcon);
	if(document.querySelector('.button-top') == null)
	{
		document.body.appendChild(topButton);
		document.querySelector('.button-top').addEventListener('click', scrollToMainPage);
		document.querySelector('.page').addEventListener('scroll', toggleGoToTopBtn);
	}
	else
	{
		if(isSinglePage || isMobile()) 
			document.querySelector('.button-top').style.right = '10px';
		else 
			document.querySelector('.button-top').style.right = null;		
	}

	let editorButton = document.createElement('a');
	editorButton.classList.add('button');
	editorButton.classList.add('button-editor');
	editorButton.title = 'Toggle Editor';
	if(isSinglePage || isMobile())
		editorButton.style.right = '10px';
	let editorButtonIcon = document.createElement('i');
	editorButtonIcon.classList.add('material-icons');
	editorButtonIcon.classList.add('not-selectable');
	editorButtonIcon.innerText = 'code';
	if(document.querySelector('.button-editor') == null)
	{
		editorButton.appendChild(editorButtonIcon);
		document.body.appendChild(editorButton);
		document.querySelector('.button-editor').addEventListener('click', toggleEditor);
	}
	else
	{
		if(isSinglePage || isMobile()) 
			document.querySelector('.button-editor').style.right = '10px';
		else 
			document.querySelector('.button-editor').style.right = null;
		
	}
	
	let closeButton = document.createElement('a');
	closeButton.classList.add('button');
	closeButton.classList.add('button-close');
	closeButton.title = 'Close Popup';
	if(isSinglePage || isMobile()) 
		closeButton.style.right = '10px';
	let closeButtonIcon = document.createElement('i');
	closeButtonIcon.classList.add('material-icons');
	closeButtonIcon.classList.add('not-selectable');
	closeButtonIcon.innerText = 'close';
	closeButton.appendChild(closeButtonIcon);
	if(document.querySelector('.button-close') == null)
	{
		document.body.appendChild(closeButton);
		document.querySelector('.button-close').addEventListener('click', goBack);
		document.querySelector('.button-close').addEventListener('contextmenu', function() {
			event.preventDefault();
			window['single'] = window['single'] != undefined ? !window['single'] : true;
			getJson(document.querySelector('#data-id').src, setPageElements);
		});
	}
	else
	{
		if(isSinglePage || isMobile()) 
			document.querySelector('.button-close').style.right = '10px';
		else 
			document.querySelector('.button-close').style.right = null;
		
	}
}

function goBack() {
	window.location.href = '../index.html';
}

function toggleGoToTopBtn() {
	// When the user scrolls down to viewport from the top of the document, change floating action button
	if (document.querySelector('.page').scrollTop >= document.body.clientHeight) {
		document.querySelector('.button-top').style.visibility = 'visible';
	} else {
		document.querySelector('.button-top').style.visibility = '';
	}
}

function addBackgroundUrlClause(url) { return "url('" + url + "')"; }

function setPageElements(content) {
	if(content != null)
	{
		localStorage.setItem('elements', JSON.stringify(content, null, '\t'));
		if(document.querySelector('.editor-area') != null)
			document.querySelector('.editor-area').value = localStorage.getItem('elements');
		
	}
	window['elements'] = JSON.parse(localStorage.getItem('elements'));

	renderVariables();
	setTimeout(renderPage, 1);
	setTimeout(function () {
		scrollToMainPage(this, true);
	}, 500);
	if(window['no-editor'])
	{
		document.querySelector('.button-editor').style.display = 'none';
		localStorage.removeItem('elements');
	}
}

function toggleEditor() {
	if(document.querySelector('.editor') != null)
	{
		let editorText = document.querySelector('.editor-area').value;
		let isClosing = document.querySelector('.editor').style.display == 'block'; //previous state	
		document.querySelector('.editor').style.display = isClosing ? 'none' : 'block';
		localStorage.setItem('elements', editorText);
		document.querySelector('.editor').value = isClosing ? '' : localStorage.getItem('elements');
		if(isClosing)
		{
			if(editorText.trim().startsWith('http') && editorText.trim().endsWith('.json')) // if address of json is in editor
			{
				getJson(editorText, setPageElements);
			}
			else // raw json text
			{
				setPageElements();
			}
		}
	}
	else
	{
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

// startup
window.addEventListener('load', startup);
window.addEventListener('resize', startup);
function startup() {
	if(document.body.getBoundingClientRect().width <= 400 && document.querySelector('.landing') != null) 
	{
		document.querySelector('.landing').style.display = 'block';
		localStorage.clear();
		return;
	}
	
	if (typeof testJson == 'object' && testJson.length > 0) // test json
	{
		console.log('using test json');
		setPageElements(testJson);
	}
	else if(typeof pageElements != 'undefined') // if not tied to js file with pageElements
	{
		window['no-editor'] = true;
		setPageElements(pageElements);
	}
	// else if(localStorage.getItem('elements') != null) // if have storage
	// {
		// setPageElements();
	// }
	else if(typeof getJson == 'function' && document.querySelector('#data-id') != null) // if index.js exists
	{
		let source = document.querySelector('#data-id').src;
		getJson(source, setPageElements);
	}
	else
	{
		console.error('no data source found');
	}
	let firstLoad = window['loaded'] != true;
	window['loaded'] = true;
	if(firstLoad) startup();
	
	closeViewer();
}