//--HEADER--//
const isFirefox = (/Firefox/i.test(navigator.userAgent));

function generateHeader() {
	if(document.querySelector('.page-header') != null) {
		let header = document.createElement('div');
		
		//clone element to put in header
		if(document.querySelector('.published') != null)
			header.appendChild(document.querySelector('.published').cloneNode(true));
		
		//clone element to put in header
		if(document.querySelector('.title') != null)
			header.appendChild(document.querySelector('.title').cloneNode(true));
		
		if(document.querySelector('#hashtags') != null)
		{
			//clone element to put in header
			let hashtags = document.createElement('div');
			hashtags.classList.add('hashtags');
			for(let hashtag of document.querySelectorAll('#hashtags a'))
			{
				let clone = hashtag.cloneNode(true);
				// for hashtags, have to add back click event
				clone.addEventListener('click', function() {
					window.location.hash = this.title;
				});
				hashtags.appendChild(clone);
			}
			header.appendChild(hashtags);
		}
		
		//add header to document, add window events	
		document.querySelector('.page-header').innerHTML = '';
		document.querySelector('.page-header').appendChild(header);
		window.addEventListener('scroll', onScrollHeader);
	}
}

function onScrollHeader() {
	// event.preventDefault();
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	// console.log(st, window['scrollTop'], diff);
	// diff == 1 is for initial load if navigate to section (chrome)
	toggleHeader(st > 0.3 * document.documentElement.clientHeight && (!window['scrollTop'] || diff <= 0 || (!isFirefox && diff == 1)));
	window['scrollTop'] = st;
}

function toggleHeader(forced) {
	if (forced) {
		document.querySelector('.page-header').classList.add('opaque-header');
		document.querySelector('.page-header').classList.add('visible-header');
	}
	else {
		document.querySelector('.page-header').classList.remove('opaque-header');
		setTimeout(function() {
			document.querySelector('.page-header').classList.remove('visible-header');
		}, 500);
	}
}

function generateReadTime() {
	let contents = document.querySelector('#contents');
	if(contents != null)
	{
		let text = contents.innerText;
		let wpm = 200;
		let words = text.trim().split(/\s+/).length;
		let time = Math.ceil(words / wpm);
		
		if(document.querySelector('.published') != null && time > 1)
			document.querySelector('.published').innerText += ' - ' + time + ' min read';
	}
}
