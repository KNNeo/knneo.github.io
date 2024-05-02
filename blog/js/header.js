//--HEADER--//
const isFirefox = (/Firefox/i.test(navigator.userAgent));

function generateHeader() {
	if(document.querySelector('.page-header') != null) {
		let pageHeader = document.querySelector('.page-header');
		let header = document.createElement('div');		
		// clone date to put in header
		if(document.querySelector('.published') != null)
			header.appendChild(document.querySelector('.published').cloneNode(true));		
		// clone header to put in header
		if(document.querySelector('.title') != null)
			header.appendChild(document.querySelector('.title').cloneNode(true));
		// clone hashtags to put in header
		let hashtags = document.querySelector('.hashtags') || document.querySelector('#hashtags');
		if(hashtags != null) {
			//clone element to put in header
			let tags = document.createElement('div');
			tags.classList.add('hashtags');
			for(let hashtag of hashtags.querySelectorAll('a'))
				tags.appendChild(hashtag.cloneNode(true));
			header.appendChild(tags);
		}
		// add header to document, add window events	
		pageHeader.innerHTML = '';
		pageHeader.classList.add('show');
		pageHeader.classList.add('hide');
		pageHeader.appendChild(header);
		// add scroll event for header
		window.addEventListener('scroll', headerOnScroll);
	}
}

function headerOnScroll() {
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	toggleHeader(st > 0.3 * document.documentElement.clientHeight, diff <= 0.1);
	window['scrollTop'] = st;
}

function toggleHeader(minYOffset, scrollUp) {
	let pageHeader = document.querySelector('.page-header');
	let minCoverHeight = 0.4*window.innerHeight;
	// console.log(minYOffset, scrollUp);
	if (minYOffset) {
		// exclusion: hide if scroll down minCoverHeight
		if(pageHeader.getBoundingClientRect().height >= minCoverHeight)
			pageHeader.querySelector('.hashtags').classList.remove('show');
		// exclusion: hide if header is larger than minCoverHeight
		if(pageHeader.height >= minCoverHeight)
			pageHeader.classList.add('hide');
		
		if(!isSmallWidth() || scrollUp)
			pageHeader.classList.remove('hide');
		else
			pageHeader.classList.add('hide');	
	}
	else
		pageHeader.classList.add('hide');
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
