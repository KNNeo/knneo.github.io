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
	generateHomepage();
}

function generateHomepage() {
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
			console.log('post found', post.querySelector('title').textContent);
			
			let postDiv = document.createElement('div');
			postDiv.classList.add('Post');
			
			let date = document.createElement('span');
			date.innerText = post.querySelector('published').textContent.substring(0,10); //publish date
			postDiv.appendChild(date);
					
			let postLink = document.createElement('a');
			postLink.href = post.querySelector('link[rel=alternate]')
				.getAttribute('href')
				.replace('https://knwebreports.blogspot.com/', './blog/');
			postDiv.appendChild(postLink);
			
			let container = document.createElement('div');
			
				let title = document.createElement('h4');
				title.innerText = post.querySelector('title').textContent;
				container.appendChild(title);
				
				let home = document.createElement('div');
				
					let thumb = document.createElement('div');
					
						if(count < 4)
						{
							postDiv.classList.add('latest-post');
							let homeThumb = document.createElement('div');
							homeThumb.classList.add('home-thumb');
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
			
			document.body.appendChild(postDiv);
		}
	}
}

window.onload = getXml('https://knneo.github.io/blogspot/blog.xml', processXml);
