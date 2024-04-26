window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';

function postLoadSequence() {
	setTimeout(function() {
		if(typeof generateViewer == 'function') generateViewer();
		addSwipeEvents();
		removeLinkExtensions();
		addServiceWorker();
	}, 0);
}
// allow toggle of emoji display
function toggleEmojiDisplay() {
	if(event.target != null)
		event.target.innerText = event.target.innerText == 'mood' ? 'sentiment_neutral' : 'mood';
	for(let emoji of document.querySelectorAll('.emoji')) {
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
	// console.log('up', 'down', 'left', 'right');
	// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown && swipeLeft > 150) {
		//newer post
		document.querySelector('.next')?.click();
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown && swipeRight > 150) {
		//older post
		document.querySelector('.prev')?.click();
		return;
	}
}

// remove .html extensions, facilitate static site routing
function removeLinkExtensions() {
	if(!window.location.href.startsWith('file:///')) {
		for(let a of document.querySelectorAll('a')) {
			if(a.href.includes('knneo.github.io') || a.href.includes('knwebreports'))
				a.href = a.href.replace('.html', '');
		}
	}
}

// service worker implementation
function addServiceWorker() {
	if (navigator && 'serviceWorker' in navigator) {
	  window.addEventListener('load', function() {
		navigator.serviceWorker.register('../../../js/sw.js')
		  .then(function(registration) {
			console.log('Service worker registered:', registration.scope);
			startup();
		  }, function(err) {
			console.log('Service worker registration failed:', err);
		  });
	  });
	}
}