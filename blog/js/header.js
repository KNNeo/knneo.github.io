//--HEADER--//
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const pageHeader = document.querySelector('.page-header');

function generateHeader() {
	if(pageHeader != null) {
		let header = document.createElement('div');
		
		//clone element to put in header
		if(document.querySelector('.published') != null)
			header.appendChild(document.querySelector('.published').cloneNode(true));
		
		//clone element to put in header
		if(document.querySelector('.title') != null)
			header.appendChild(document.querySelector('.title').cloneNode(true));
		
		let tags = document.querySelector(".hashtags") || document.querySelector("#hashtags");
		if(tags != null)
		{
			//clone element to put in header
			let hashtags = document.createElement('div');
			hashtags.classList.add('hashtags');
			for(let hashtag of tags.querySelectorAll('a'))
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
		pageHeader.innerHTML = '';
		pageHeader.appendChild(header);
		window.addEventListener('scroll', headerOnScroll);
	}
}

function headerOnScroll() {
	// event.preventDefault();
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	// console.log(st, window['scrollTop'], diff);
	// diff == 1 is for initial load if navigate to section (chrome)
	toggleHeader(st > 0.3 * document.documentElement.clientHeight, diff <= 0.1);
	window['scrollTop'] = st;
}

function toggleHeader(minYOffset, minScrollDiff) {
	let minCoverHeight = 0.4*window.innerHeight;
	// console.log(minYOffset, minScrollDiff);
	if (minYOffset) {
		// exclusion: hide if scroll down minCoverHeight
		if(pageHeader.getBoundingClientRect().height >= minCoverHeight)
			pageHeader.querySelector('.hashtags').classList.remove('show');
		// exclusion: hide if header is larger than minCoverHeight
		if(pageHeader.height >= minCoverHeight)
			pageHeader.classList.remove('show');
		
		pageHeader.classList.add('show');
	}
	else {
		pageHeader.classList.remove('show');
		if (!isSmallWidth() && minYOffset)
			pageHeader.classList.add('show');
	}
}

function generateReadTime() {
	let contents = document.querySelector('#contents');
	if(contents != null)
	{
		let text = contents.innerText;
		let wpm = text.trim().split(/\s+/).length / 250;
		let ipm = calculateIpmSeconds(12, 5) / 60;
		let time = Math.ceil(wpm + ipm);
		// console.log(wpm, ipm, time);
		
		if(document.querySelector('.published') != null && time > 1)
			document.querySelector('.published').innerText += ' - ' + time + ' min read';
	}
}

function calculateIpmSeconds(highest, lowest) {
	 // according to blog site Medium: initial time for image is high, subsequent drop to low
	return Array.from(document.querySelectorAll('img'))
		.reduce(function(total, current, index) { 
			return total + Math.max(highest - index, lowest); 
		}, 0);
}