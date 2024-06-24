//--HEADER--//

// Add hashtags for posts with anchors
function generateHashtags() {
	let tags = document.querySelector('#hashtags, .hashtags');
	if (tags != null) {
		// empty hashtags if any content
		tags.innerHTML = '';		
		// if is search result, remove all old hashtags
		if(window.location.href.includes("/search/")) {
			for(let element of document.querySelectorAll("[id='hashtags']"))
				element.style.display = 'none';
			return;
		}		
		// create hashtags
		var hashtags = [];		
		// add any tag with anchor
		let sections = document.querySelectorAll(".post-body [id]:not(#hashtags):not(#news-thumbnail):not(#disclaimer):not(.twitter-tweet iframe[id]):not(#table):not(#music):not(.list):not(audio):not(video):not(object)");
		if(sections.length > 0)
		{
			for(let section of sections) {
				if(section.id.length > 1 && section.id.length <= 64) // set max id length
					hashtags.push({ tag: section.id, target: section.id });
				else {
					console.error('hashtag length too long: ' + section.id);
					return;
				}
			}
		}
		// special case for klassic note: one per post, inner text is 'This Week on Klassic Note'
		for(let span of document.querySelectorAll('.post-body span')) {
			if(span.innerText == 'This Week on Klassic Note') {
				//set id on class
				span.id = 'KlassicNote';
				hashtags.push({ tag: 'ThisWeekOnKlassicNote', target: span.id });
				break;
			}
		}
		// render hashtag
		if(hashtags.length > 0) {
			for(let item of hashtags) {
				let newItem = document.createElement('a');
				newItem.innerText = '#' + item.tag;
				newItem.title = item.tag;
				newItem.href = '#' + item.target;
				tags.appendChild(newItem);
			}
		}
	}
}

function generateHeader() {
	if(document.querySelector('#hashtags, .hashtags') != null)
		generateHashtags();
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
		// window.addEventListener('scroll', headerOnScroll);
	}
	if(document.querySelector('.published') != null)
		generateReadTime();
}

function headerOnScroll() {
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let diff = st - window['scrollTop'];
	toggleHeaderByOffset(st > 0.3 * document.documentElement.clientHeight, diff <= 0.1);
	window['scrollTop'] = st;
}

function toggleHeaderByOffset(minYOffset, scrollUp) {
	let pageHeader = document.querySelector('.page-header');
	let minCoverHeight = 0.4*window.innerHeight;
	// console.log(minYOffset, scrollUp);
	if (minYOffset) {
		// exclusion: hide hashtags if scroll down minCoverHeight
		if(pageHeader.getBoundingClientRect().height >= minCoverHeight)
			pageHeader.querySelector('.hashtags').classList.remove('show');
		// exclusion: hide if header is larger than minCoverHeight
		if(pageHeader.height >= minCoverHeight)
			toggleHeader(false);
		// above all else if scroll down, hide header
		if(scrollUp)
			toggleHeader(true);
		else
			toggleHeader(false);
	}
	else // hide header if not read min scroll distance down
		toggleHeader(false);
}

function toggleHeader(forced) {
	let pageHeader = document.querySelector('.page-header');
	if(forced)
		pageHeader.classList.remove('hide');
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
