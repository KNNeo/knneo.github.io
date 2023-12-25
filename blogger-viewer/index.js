function readFile(file) {
	if(file.name.toLowerCase().endsWith('.xml'))
	{
		reader = new FileReader();
		reader.onload = function (e) {
			let parser = new DOMParser();
			processXml(parser.parseFromString(e.target.result, 'text/xml'));
		};
		reader.readAsText(file);
		if(document.querySelector('.selector') != null)
			document.querySelector('.selector').remove();
	}
	else
	{
		alert('wrong file input');
	}
}

function onSelect(e) {
	runLoader();
	var list = e.target.files;
	// console.log('onSelect', list[0].name, list[0].type);
	if(list && list.length > 0) {
		readFile(list[0]);
	}
}

function processXml(doc) {
	// console.log(doc);
	window['doc'] = doc;
	//filter posts here
	window['posts'] = Array.from(window['doc'].querySelectorAll('entry'))
		.filter(e => e.querySelector('content[type=html]') != null && 
			e.querySelector('link[rel=alternate]') != null &&
			e.querySelector('title') != null);
	window['loading'] = false;
	runLoader();
	generateHomepage();
	window['doc'] = null;
}

function generateHomepage() {
	let home = document.createElement('div');
	home.classList.add('home');
	home.classList.add('block');
	document.body.appendChild(home);
	
	let homeTitle = document.createElement('h1');
	homeTitle.classList.add('title');
	homeTitle.innerText = 'Blogger Viewer';
	document.title = window['doc'].querySelector('title').textContent;
	document.querySelector('.home').appendChild(homeTitle);
	
	let prelude = document.createElement('p');
	prelude.classList.add('prelude');
	
	let preText = document.createElement('span');
	preText.innerText = 'This is an archive of ';
	
	let preLink = document.createElement('a');
	preLink.href = window['doc'].querySelector('link[rel=alternate]').getAttribute('href');
	preLink.innerText = window['doc'].querySelector('title').textContent;
	preLink.setAttribute('target', '_blank');
	
	preText.appendChild(preLink);
	prelude.appendChild(preText);
	document.querySelector('.home').appendChild(prelude);
	
	let content = document.createElement('div');
	content.id = 'contents';
	content.classList.add('content');
	content.classList.add('block');
	content.classList.add('inactive');
	content.classList.add('post-body');
	content.classList.add('entry-content');
	document.body.appendChild(content);
	
	generatePages();
}

function generatePages() {
	let count = 0;
	for(let p = 0; p < window['posts'].length; p++)
	{
		let post =  window['posts'][p];
		
		let postDiv = document.createElement('div');
		postDiv.classList.add('post');
		
		let date = document.createElement('div');
		date.innerText = post.querySelector('published').textContent.substring(0,10).replace(/-/g,'.'); //publish date
		postDiv.appendChild(date);
				
		let postLink = document.createElement('a');
		postLink.href = 'javascript:void(0);';
		postLink.setAttribute('data-index', p);
		postLink.addEventListener('click', function() {
			createFrame(parseInt(this.getAttribute('data-index')));			
			toggleFrame();
		});
		postDiv.appendChild(postLink);
				
		let title = document.createElement('h4');
		let titleContent = post.querySelector('title').textContent;
		title.innerText = titleContent.length > 0 ? titleContent : '<<Unknown Title>>';
		postLink.appendChild(title);
			
		document.querySelector('.home').appendChild(postDiv);
	}
}

function createFrame(postIndex) {
	document.querySelector('.content').innerHTML = '';
	document.querySelector('.side.left')?.remove();
	document.querySelector('.side.right')?.remove();
	
	let entry = window['posts'][postIndex];
	// console.log('loading post', entry);
	
	//outside div
	let contentContainer = document.createElement('div');
	contentContainer.classList.add('content-container');
	
	//FAB to close
	let closeButton = document.createElement('a');
	closeButton.classList.add('close');
	closeButton.title = 'Close Popup';
	closeButton.addEventListener('click', toggleFrame);
	
		let closeButtonIcon = document.createElement('span');
		closeButtonIcon.innerText = '❌ Close';
		closeButton.appendChild(closeButtonIcon);
		
	if(document.querySelector('.close') != undefined) 
		document.querySelector('.close').remove();
	contentContainer.appendChild(closeButton);	
	
	//FAB to to go top
	let topButton = document.createElement('a');
	topButton.classList.add('top');
	topButton.title = 'Go to Top';
	topButton.addEventListener('click', goToTop);
	
		let topButtonIcon = document.createElement('span');
		topButtonIcon.innerText = '🔺 Top';
		topButton.appendChild(topButtonIcon);
		
	if(document.querySelector('.top') != undefined) 
		document.querySelector('.top').remove();
	contentContainer.appendChild(topButton);
	
	if(window['posts'][postIndex-1] != null)
		document.body.appendChild(renderEntry(window['posts'][postIndex-1], postIndex, 'left'));
	
	contentContainer.appendChild(renderEntry(entry, postIndex, 'main'));
	
	if(window['posts'][postIndex+1] != null)
		document.body.appendChild(renderEntry(window['posts'][postIndex+1], postIndex, 'right'));
		
	document.querySelector('.content').appendChild(contentContainer);
	
	window.addEventListener('resize', function() {
		if(document.querySelector('.side.left') != null)
			document.querySelector('.side.left').style.visibility = document.querySelector('.side.left').getBoundingClientRect().width < 320 ? 'hidden' : '';
		if(document.querySelector('.side.right') != null)
			document.querySelector('.side.right').style.visibility = document.querySelector('.side.right').getBoundingClientRect().width < 320 ? 'hidden' : '';
	});
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function renderEntry(entry, index, position) {
	if(entry == null) return;
	
	//actual post
	let contentMain = document.createElement('div');
	contentMain.id = 'contents-' + position;
	contentMain.classList.add('content');
	if(position != 'main')
	{	
		contentMain.classList.add('side');
		contentMain.title = 'Go To ' + (position == 'left' ? 'Newer' : 'Older') + ' Post';
		if(position == 'left')
			contentMain.classList.add('left');
		if(position == 'right')
			contentMain.classList.add('right');
		contentMain.addEventListener('click', function() {
			event.preventDefault();
			createFrame(position == 'left' ? index-1 : index+1);
		});
	}
	
	if(position == 'main')
	{	
		let prelude = document.createElement('p');
		prelude.classList.add('prelude');
		
		let url = entry.querySelector('link[rel=alternate]').getAttribute('href');

		let preText = document.createElement('i');
		preText.innerText = 'This post was imported from ';
		
		let preLink = document.createElement('a');
		preLink.href = url;
		preLink.innerText = 'Blogger';
		preLink.setAttribute('target', '_blank');
		
		preText.appendChild(preLink);
		prelude.appendChild(preText);
		contentMain.appendChild(prelude);

		let publishedDiv = document.createElement('div');
		publishedDiv.classList.add('published');
		let published = document.createElement('small');
		published.innerText =  new Date(entry.querySelector('published')?.textContent).toDateString();
		publishedDiv.appendChild(published);
		contentMain.appendChild(publishedDiv);
		
		let header = document.createElement('div');
		header.classList.add('header');
		contentMain.appendChild(header);
	}
	
	let title = document.createElement('h2');
	title.innerText = entry.querySelector('title')?.textContent;
	contentMain.appendChild(title);

	let content = entry.querySelector('content[type=html]')?.textContent;
	contentMain.innerHTML += content;

	contentMain.innerHTML += '<hr>';

	let disclaimer = document.createElement('h6');
	disclaimer.classList.add('disclaimer');
	disclaimer.innerText = 'Copyright (c) ' + new Date().getFullYear();
	contentMain.appendChild(disclaimer);

	contentMain.innerHTML += '<br><br><br><br>';
	
	return contentMain;
}

function toggleFrame() {
	let homeInactive = document.querySelector('.home')?.classList.contains('inactive');
	for(let block of document.querySelectorAll('.block'))
	{
		block.classList.toggle('inactive');
	}
	goToTop();
	if(homeInactive) {		
		document.querySelector('.side.left')?.remove();
		document.querySelector('.side.right')?.remove();
		document.querySelector('.close').remove();
		document.querySelector('.top').remove();
	}
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function runLoader() {
	if(window['loading'] == undefined) window['loading'] = true;
	for(let loader of document.querySelectorAll('.loader'))
	{
		switch(document.querySelector('.loader').innerText)
		{
			case 'Loading.': 
				document.querySelector('.loader').innerText = 'Loading..';
				break;
			case 'Loading..': 
				document.querySelector('.loader').innerText = 'Loading...';
				break;
			case 'Loading...': 
				document.querySelector('.loader').innerText = 'Loading.';
				break;
			default:
				document.querySelector('.loader').innerText = 'Loading.';
				break;
		}
	}
	if(window['loading'] && document.querySelectorAll('.loader').length > 0)
		setTimeout(runLoader, 500);
	else
	{
		for(let loader of document.querySelectorAll('.loader'))
		{
			loader.remove();
		}
	}
}

window.addEventListener('load', function() {	
	let loader = document.createElement('div');
	loader.classList.add('loader');
	// loader.classList.add('material-icons');
	document.body.appendChild(loader);
	
	let selectorDiv = document.createElement('div');
	selectorDiv.classList.add('selector');
	
		let selector = document.createElement('input');
		selector.type = 'file';
		selector.accept = 'application/xml';
		selector.addEventListener('change', onSelect);
		selectorDiv.appendChild(selector);
		
	document.body.appendChild(selectorDiv);
});

