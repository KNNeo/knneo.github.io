function getXml(source, callback) {
	try
	{
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				let parser = new DOMParser();
				callback(parser.parseFromString(this.responseText, 'text/xml'));			
			}
			else if(this.status != 0 && this.status != 200) {
				console.error('getJson:', this.status);
				callback(null);
			}
		};
		xmlhttp.open("GET", source, true);
		xmlhttp.send();
	}
	catch(e)
	{
		console.error('getJson: ' + e.message);
		callback(null);
	}
}

function processXml(doc)
{
	// console.log(doc);
	window['doc'] = doc;
	createIndex();
	generateHomepage();
}

function generateHomepage() {
	let home = document.createElement('div');
	home.classList.add('home');
	home.classList.add('block');
	document.body.appendChild(home);
	
	let homeTitle = document.createElement('h1');
	homeTitle.innerText = document.title;
	document.querySelector('.home').appendChild(homeTitle);
	
	let prelude = document.createElement('p');
	prelude.classList.add('prelude');
	
	let preText = document.createElement('span');
	preText.innerText = 'This is an archive of ';
	
	let preLink = document.createElement('a');
	preLink.href = 'https://knwebreports.blogspot.com/';
	preLink.innerText = 'Klassic Note Web Reports';
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
	for(let post of window['doc'].getElementsByTagName('entry'))
	{
		// draft
		if(post.getElementsByTagName('app:control').length > 0 &&
		post.getElementsByTagName('app:control')[0].getElementsByTagName('app:draft')[0].textContent == 'yes')
		{
			// console.log('draft found', post.querySelector('title'));
			continue;
		}
		// published post
		if(post.querySelector('category') && 
		post.querySelector('category').getAttribute('term').includes('#post') &&
		post.querySelector('title').textContent.length > 0)
		{
			// console.log('post found', post.querySelector('title').textContent);
			
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
			postLink.setAttribute('data-link', url);
			postLink.addEventListener('click', function() {
				let index = window['list'].find(l => l.url == this.getAttribute('data-link'))?.id;
				createFrame(window['doc'].getElementsByTagName('entry')[index]);
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
}

function createIndex() {
	window['list'] = [];
	let list = window['doc'].getElementsByTagName('entry');
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

function createFrame(entry) {
	// console.log('loading post', entry);
	document.querySelector('.content').innerHTML = '';
	document.querySelector('#contents-left')?.remove();
	document.querySelector('#contents-right')?.remove();
	
	let index = window['list'].find(l => l.url == entry.querySelector('link[rel=alternate]').getAttribute('href').replace('https://knwebreports.blogspot.com/', './blog/'))?.id;
	
	let listIndex = window['list'].map(l => l.id).indexOf(index);
	console.log('listIndex', listIndex);
	
	//outside div
	let contentContainer = document.createElement('div');
	contentContainer.id = 'contents-container';
	// contentContainer.style.display = 'flex';
	contentContainer.style.height = '100vh';
	
	
	if(window.innerWidth >= 760 + 640 && listIndex - 1 >= 0)
		document.body.appendChild(renderEntry(window['doc'].getElementsByTagName('entry')[index-1], index, 'left'));
	
	contentContainer.appendChild(renderEntry(entry, index, 'main'));
	
	if(window.innerWidth >= 760 + 640 && listIndex + 1 < window['list'].length)
		document.body.appendChild(renderEntry(window['doc'].getElementsByTagName('entry')[index+1], index, 'right'));
		
	document.querySelector('.content').appendChild(contentContainer);
	
	if(document.querySelector('.home').classList.contains('inactive'))
		toggleFrame();
	toggleFrame();
	
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
	
	setTimeout(startup, 1000);
	
	//FABs
	let back = document.createElement('a');
	back.id = 'BackBtn';
	back.title = 'Back';
		let backIcon = document.createElement('i');
		backIcon.classList.add('material-icons');
		backIcon.innerText = 'arrow_back';
		back.addEventListener('click', toggleFrame);
		back.appendChild(backIcon);
	if(document.getElementById('BackBtn') != undefined) document.getElementById('BackBtn').remove();
	document.body.appendChild(back);	
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
			createFrame(window['doc'].getElementsByTagName('entry')[position == 'left' ? index-1 : index+1]);
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

		let published = document.createElement('small');
		published.classList.add('published');
		published.innerText =  new Date(entry.querySelector('published')?.textContent).toDateString();
		contentMain.appendChild(published);
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
	for(let block of document.querySelectorAll('.block'))
	{
		block.classList.toggle('inactive');
	}
	goToTop();
	if(document.getElementById('BackBtn') != undefined) {
		
		document.querySelector('#contents-left')?.remove();
		document.querySelector('#contents-right')?.remove();
		document.getElementById('BackBtn').remove();
	}
}

window.onload = getXml('https://knneo.github.io/blogspot/blog.xml', processXml);
