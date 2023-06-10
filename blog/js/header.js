//--HEADER--//
function generateHeader() {
	if(document.querySelector('.header') != null) {
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
		document.querySelector('.header').appendChild(header);
		window.addEventListener('scroll', toggleHeader);
		toggleHeader();
	}
}

function toggleHeader() {
	// When the user scrolls down from the top of the document, show header
	if (document.body.scrollTop > 0.2*document.documentElement.clientHeight || 
		document.documentElement.scrollTop > 0.2*document.documentElement.clientHeight) {
		document.querySelector('.header').style.opacity = 1;
		document.querySelector('.header').style.zIndex = '';
	}
	else {
		document.querySelector('.header').style.opacity = 0;
		document.querySelector('.header').style.zIndex = -1;
	}
}

function generateReadTime() {
	let contents = document.querySelector('#contents-main');
	if(contents != null)
	{
		let text = contents.innerText;
		let wpm = 200;
		let words = text.trim().split(/\s+/).length;
		let time = Math.ceil(words / wpm);
		
		if(document.querySelector('.published') != null)
			document.querySelector('.published').innerText += ' - ' + time + ' min read';
	}
}