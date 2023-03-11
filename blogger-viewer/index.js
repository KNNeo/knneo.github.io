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
	console.log(doc);
	window['doc'] = doc;
	//filter posts here
	window['posts'] = Array.from(window['doc'].querySelectorAll('entry'))
		.filter(e => e.querySelector('content[type=html]') != null && 
			e.querySelector('link[rel=alternate]') != null &&
			e.querySelector('title').textContent.length > 0);
	window['loading'] = false;
	runLoader();
	// createIndex();
	generateHomepage();
	window['doc'] = null;
}

function generateHomepage() {
	let home = document.createElement('div');
	home.classList.add('home');
	home.classList.add('block');
	document.body.appendChild(home);
	
	let homeTitle = document.createElement('h1');
	homeTitle.innerText = 'Blogger Viewer';
	document.title = window['doc'].querySelector('title').textContent;
	document.querySelector('.home').appendChild(homeTitle);
	
	let prelude = document.createElement('p');
	prelude.classList.add('prelude');
	
	let preText = document.createElement('span');
	preText.innerText = 'This is an archive of ';
	
	let preLink = document.createElement('a');
	preLink.href = 'https://knwebreports.blogspot.com/';
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
		
		let date = document.createElement('span');
		date.innerText = post.querySelector('published').textContent.substring(0,10).replace(/-/g,'.'); //publish date
		postDiv.appendChild(date);
				
		let postLink = document.createElement('a');
		let url = post.querySelector('link[rel=alternate]')
			.getAttribute('href')
			.replace('https://knwebreports.blogspot.com/', './blog/');
		postLink.href = 'javascript:void(0);';
		postLink.setAttribute('data-index', p);
		postLink.addEventListener('click', function() {
			createFrame(parseInt(this.getAttribute('data-index')));			
			toggleFrame();
		});
		postDiv.appendChild(postLink);
		
		let container = document.createElement('div');
		
			let title = document.createElement('h4');
			title.innerText = post.querySelector('title').textContent;
			container.appendChild(title);
			
			let home = document.createElement('div');
			
				let thumb = document.createElement('div');
				
					if(count < 4)
					{
						postDiv.classList.add('latest');
						let homeThumb = document.createElement('div');
						homeThumb.classList.add('thumb');
						if(post.getElementsByTagName('media:thumbnail').length > 0)
						{
							let mediaThumbnail = post.getElementsByTagName('media:thumbnail')[0];
							homeThumb.style.backgroundImage = 'url(' + mediaThumbnail.getAttribute('url') + ')';
						}			
						thumb.appendChild(homeThumb);			
						count++;
					}
				
				home.appendChild(thumb);
			
			container.appendChild(home);
		
		postLink.appendChild(container);
		
		document.querySelector('.home').appendChild(postDiv);
	}
}

function createIndex() {
	window['list'] = [];
	let list = window['posts'];
	let counter = 0;
	for(let p = 0; p < list.length; p++)
	{
		let post = list[p];
		
		// draft
		if(post.getElementsByTagName('app:control').length > 0 &&
		post.getElementsByTagName('app:control')[0].getElementsByTagName('app:draft')[0].textContent == 'yes')
		{
			// console.log('draft found', post.querySelector('title'));
			continue;
		}
		if(post.querySelector('category') && 
		post.querySelector('category').getAttribute('term').includes('#post') &&
		post.querySelector('title').textContent.length > 0)
		{
			let url = post.querySelector('link[rel=alternate]')
				.getAttribute('href')
				.replace('https://knwebreports.blogspot.com/', './blog/');
			window['list'].push({
				id: p,
				url,
			});
		}
	}
}

function createFrame(postIndex) {
	document.querySelector('.content').innerHTML = '';
	document.querySelector('#contents-left')?.remove();
	document.querySelector('#contents-right')?.remove();
	
	let entry = window['posts'][postIndex];
	// console.log('loading post', entry);
	
	// let index = postIndex;
	
	// let listIndex = window['posts'].map(l => l.id).indexOf(index);
	// console.log('listIndex', listIndex);
	
	//outside div
	let contentContainer = document.createElement('div');
	contentContainer.id = 'contents-container';
	// contentContainer.style.display = 'flex';
	// contentContainer.style.height = '100vh';
	
	//FAB to close
	let closeButton = document.createElement('a');
	closeButton.id = 'CloseBtn';
	closeButton.title = 'Close Popup';
	closeButton.addEventListener('click', toggleFrame);
		let closeButtonIcon = document.createElement('span');
		closeButtonIcon.classList.add('button');
		// closeButtonIcon.classList.add('material-icons');
		closeButtonIcon.innerText = '❌ Close';
		closeButton.appendChild(closeButtonIcon);
	if(document.getElementById('CloseBtn') != undefined) document.getElementById('CloseBtn').remove();
	contentContainer.appendChild(closeButton);	
	
	//FAB to to go top
	let topButton = document.createElement('a');
	topButton.id = 'TopBtn';
	topButton.title = 'Go to Top';
	topButton.addEventListener('click', goToTop);
		let topButtonIcon = document.createElement('span');
		topButtonIcon.classList.add('button');
		// closeButtonIcon.classList.add('material-icons');
		topButtonIcon.innerText = '🔺 Top';
		topButton.appendChild(topButtonIcon);
	if(document.getElementById('TopBtn') != undefined) document.getElementById('TopBtn').remove();
	contentContainer.appendChild(topButton);	
	
	if(window.innerWidth >= 760 + 640 && postIndex - 1 >= 0)
		document.body.appendChild(renderEntry(window['posts'][postIndex-1], postIndex, 'left'));
	
	contentContainer.appendChild(renderEntry(entry, postIndex, 'main'));
	
	if(window.innerWidth >= 760 + 640 && postIndex + 1 < window['posts'].length)
		document.body.appendChild(renderEntry(window['posts'][postIndex+1], postIndex, 'right'));
		
	document.querySelector('.content').appendChild(contentContainer);
	
	// if(document.querySelector('.home').classList.contains('inactive'))
		// toggleFrame();
	// toggleFrame();
	
	if(document.querySelector('#contents-left #hashtags') != null)
		document.querySelector('#contents-left #hashtags').remove();
	if(document.querySelector('#contents-right #hashtags') != null)
		document.querySelector('#contents-right #hashtags').remove();
	
	window.addEventListener('resize', function() {
		if(document.querySelector('#contents-left') != null)
			document.querySelector('#contents-left').style.visibility = document.querySelector('#contents-left').getBoundingClientRect().width < 320 ? 'hidden' : '';
		if(document.querySelector('#contents-right') != null)
			document.querySelector('#contents-right').style.visibility = document.querySelector('#contents-right').getBoundingClientRect().width < 320 ? 'hidden' : '';
	});
}

function goToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
	history.replaceState(null, null, ' ');
}

function renderEntry(entry, index, position) {
	//actual post
	let contentMain = document.createElement('div');
	contentMain.id = 'contents-' + position;
	contentMain.classList.add('content');
	if(position != 'main')
	{	
		contentMain.classList.add('content');
		contentMain.title = 'Go To ' + (position == 'left' ? 'Newer' : 'Older') + ' Post';
		contentMain.style.overflow = 'hidden';
		contentMain.style.height = '100vh';
		contentMain.style.position = 'fixed';
		contentMain.style.top = 0;
		if(position == 'left') contentMain.style.left = 0;
		if(position == 'right') contentMain.style.right = 0;
		contentMain.style.width = 'calc(0.5*(100vw - 760px))';
		contentMain.style.cursor = 'pointer';
		contentMain.style.filter = 'brightness(25%)';
		contentMain.addEventListener('click', function() {
			event.preventDefault();
			createFrame(position == 'left' ? index-1 : index+1);
		});
	}
	
	if(position == 'main')
	{
		let viewer = document.createElement('div');
		viewer.id = 'viewer';
		viewer.style.display = 'none';
		viewer.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			return false;
		}, false);
		contentMain.appendChild(viewer);
	
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
	}
	
	let title = document.createElement('h2');
	title.classList.add('title');
	title.innerText = entry.querySelector('title')?.textContent;
	contentMain.appendChild(title);
	
	if(position == 'main')
	{
		let header = document.createElement('div');
		header.classList.add('header');
		contentMain.appendChild(header);
	}
	
	let content = entry.querySelector('content[type=html]')?.textContent;
	contentMain.innerHTML += content;
	
	contentMain.innerHTML += '<hr>';
	
	let disclaimer = document.createElement('h6');
	disclaimer.classList.add('disclaimer');
	disclaimer.innerText = 'Copyright (c) 2014-' + new Date().getFullYear() + ' Klassic Note Web Reports';
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
		document.querySelector('#contents-left')?.remove();
		document.querySelector('#contents-right')?.remove();
		document.getElementById('CloseBtn').remove();
		document.getElementById('TopBtn').remove();
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
	
	let selector = document.createElement('input');
	selector.classList.add('selector');
	selector.type = 'file';
	selector.accept = 'application/xml';
	selector.addEventListener('change', onSelect);
	document.body.appendChild(selector);
});

