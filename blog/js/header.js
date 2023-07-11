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
		document.querySelector('.page-header').appendChild(header);
		window.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onWheel);
		toggleHeader();
	}
}

function onWheel() {
	// event.preventDefault();
	toggleHeader(isFirefox ? -event.detail*50 : event.wheelDelta);
}

function toggleHeader(delta) {
	// When the user scrolls down from the top of the document, show header
	let isScrollDown = document.body.scrollTop > 0.3*document.documentElement.clientHeight || 
		document.documentElement.scrollTop > 0.3*document.documentElement.clientHeight;
	if ((delta > 0 || !delta) && isScrollDown) {
		document.querySelector('.page-header').classList.add('show-header');
	}
	else {
		document.querySelector('.page-header').classList.remove('show-header');
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