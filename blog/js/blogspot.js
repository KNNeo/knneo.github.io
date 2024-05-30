window['light-theme'] = '#f4f6ff';
window['dark-theme'] = '#001114';
window['dark-name'] = 'blog-theme';
// Single onLoad event control: put all functions in sequence
window.addEventListener('load', postLoadSequence);

function postLoadSequence() {
	// Window Events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	window.addEventListener('popstate', windowOnHistoryChange);
	
	// Asynchronous Events
	setTimeout(addHashtags, 0); // generateHeader, generateReadTime
	setTimeout(resizeImages, 0);
	setTimeout(displayFAB, 0);
	setTimeout(setExpander, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(renderLabelIcon, 0);
	setTimeout(toggleEmojiDisplay, 0);
	setTimeout(scrollToSectionByUrl, 200);
	setTimeout(function() {
		addSwipeEvents();
		removeLinkExtensions();
		if(typeof generateViewer == 'function') generateViewer();
	}, 0);
}

function windowOnResize() {
	// sidebar content on blogger must show on larger screens
	displayFAB();
	closePopups();
}

// allow toggle of emoji display
function toggleEmojiDisplay() {
	if(event?.target != null)
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
	document.querySelector('.post-body.entry-content').addEventListener('touchend', onTouchEnd);
}

function onTouchStart() {
	// console.log('onTouchStart', event.changedTouches[0]);
	window['touchY'] = event.changedTouches[0].clientY;
	window['touchX'] = event.changedTouches[0].clientX;
}

function onTouchMove() {
	// console.log('onTouchMove', event.changedTouches[0]);
	let swipeDown = event.changedTouches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.changedTouches[0].clientY;
	let swipeLeft = window['touchX'] - event.changedTouches[0].clientX;
	let swipeRight = event.changedTouches[0].clientX - window['touchX'];
	// console.log('up', 'down', 'left', 'right');
	// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
	document.querySelector('.next').style.backgroundColor = '';
	document.querySelector('.prev').style.backgroundColor = '';
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight && swipeUp > 100) {
		// ignore
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight && swipeDown > 100) {
		// ignore
		return;
	}
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown && swipeLeft > 100) {
		//newer post
		document.querySelector('.next').style.backgroundColor = 'rgb(var(--secondary))';
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown && swipeRight > 100) {
		//older post
		document.querySelector('.prev').style.backgroundColor = 'rgb(var(--secondary))';
		return;
	}
}

function onTouchEnd() {
	// console.log('onTouchEnd', event.changedTouches[0]);
	let swipeDown = event.changedTouches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - event.changedTouches[0].clientY;
	let swipeLeft = window['touchX'] - event.changedTouches[0].clientX;
	let swipeRight = event.changedTouches[0].clientX - window['touchX'];
	// console.log('up', 'down', 'left', 'right');
	// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
	document.querySelector('.next').style.backgroundColor = '';
	document.querySelector('.prev').style.backgroundColor = '';
	//--SWIPE UP--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight && swipeUp > 100) {
		// ignore
		return;
	}
	//--SWIPE DOWN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight && swipeDown > 100) {
		// ignore
		return;
	}
	//--SWIPE LEFT--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown && swipeLeft > 100) {
		//newer post
		document.querySelector('.next')?.click();
		return;
	}
	//--SWIPE RIGHT--//
	if(swipeRight > swipeUp && swipeRight > swipeDown && swipeRight > 100) {
		//older post
		document.querySelector('.prev')?.click();
		return;
	}
}


// remove .html extensions, facilitate static site routing
function removeLinkExtensions() {
	if(!window.location.href.startsWith('file:///')) {
		for(let a of document.querySelectorAll('a')) {
			let ref = a.getAttribute('href');
			if(ref && (ref.includes('knneo.github.io') || ref.includes('knwebreports.onrender.com')))
				a.href = ref.replace('index.html', '').replace('.html', '');
		}
	}
}
