window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';

// allow toggle of emoji display
function toggleEmojiDisplay() {
	if(event.target != null)
		event.target.innerText = event.target.innerText == 'mood' ? 'sentiment_neutral' : 'mood';
	for(let emoji of document.querySelectorAll('.emoji'))
	{
		let temp = emoji.textContent;
		emoji.innerText = emoji.title;
		emoji.title = temp;
	}
}

// allow toggle of popups to show (supported) embed instead of external link
function toggleInlinePopups() {
	if(event.target != null)
		event.target.innerText = event.target.innerText == 'launch' ? 'crop_din' : 'launch';
}

// back button to each page
function goBack() {
	event.preventDefault();
	closePopups();
	window.history.back();
}

// allow swipe to change pages
function addSwipeEvents() {
	document.querySelector('.post-body.entry-content').addEventListener('touchstart', onTouchStart);
	document.querySelector('.post-body.entry-content').addEventListener('touchmove', onTouchMove);
}

function onTouchStart() {
	window['touchY'] = event.touches[0].clientY;
	window['touchX'] = event.touches[0].clientX;
}

function onTouchMove() {
	let swipeDown = event.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.touches[0].clientY;
	let swipeLeft = window['touchX'] - event.touches[0].clientX;
	let swipeRight = event.touches[0].clientX - window['touchX'];
	console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		//next
		document.querySelector('.next')?.click();
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		//previous
		document.querySelector('.prev')?.click();
		return;
	}
}

// experimental: character count for block of text defined
function countCharacters() {
	for(let paragraph of document.querySelectorAll('.count.characters'))
	{
		let count = paragraph.innerText.length;
		console.log(paragraph.innerText, count);
		paragraph.innerText += ' [' + count + ' characters]';
	}
}

function countWords() {
	for(let paragraph of document.querySelectorAll('.count.words'))
	{
		let count = paragraph.innerText.split(' ').length;
		console.log(paragraph.innerText, count);
		paragraph.innerText += ' [' + count + ' words]';
	}
}

