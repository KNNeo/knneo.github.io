// For knneo.github.io and knwebreports.onrender.com
window['light-theme'] = '#f5f5ff';
window['dark-theme'] = '#001414';
window['dark-name'] = 'blog-theme';
window['shows-list'] = [2593,6280,9333,16528,16782,34537,36098,41168,39728,40787,49590,269,189,1606,4224,4898,5150,5680,1722,3958,355,6773,6802,7791,6956,7785,6707,8675,8769,9314,1589,10163,9776,10165,10521,2787,12531,12119,12189,13535,11887,13333,14227,14921,13659,12291,16498,18119,16009,9479,17895,16067,19365,20847,18139,21405,21327,21561,22145,23079,24031,23273,23209,24629,24833,27775,28617,25879,29163,28619,28621,30654,31043,31636,31478,31952,33341,33094,31646,33337,33988,34822,32901,25777,34350,34881,34902,34280,35639,34618,35557,35180,36049,35540,35860,36470,37188,35968,35821,37171,35760,36654,36649,37722,36317,37982,37999,38778,38003,38295,38759,38524,38753,38993,38619,38276,37525,35252,39534,38992,39017,40716,39710,40591,40052,41226,40839,41389,40571,40028,42897,42250,41103,40938,43007,43969,47257,48849,46471,48926,45055,42351,49721,48736,48583,43470,49520,43608,50631,45613,42963,50709,51417,49470,51923,42962,41467,50590,52865,50330,44204,50739,51815,51535,50416,50307,50796,51815,54856,54234,53050,53998,49858,54898,55651,53040,54714,49766,51535,55129,52816,56838,54233,53407,55855,54233];
// Single onLoad event control: put all functions in sequence
window.addEventListener('load', onLoad);

function onLoad() {
	// Window Events
	window.addEventListener('scroll', toggleActionsOnScroll);
	window.addEventListener('resize', windowOnResize);
	window.addEventListener('hashchange', scrollToSectionByUrl);
	window.addEventListener('popstate', windowOnHistoryChange);	
	// Asynchronous Events
	setTimeout(resizeImages, 0);
	setTimeout(toggleEmojiDisplay, 0);
	setTimeout(addHoverForLinks, 0);
	setTimeout(showAbbrAsDialog, 0);
	setTimeout(setExpander, 0);
	setTimeout(addSwipeEvents, 0);
	setTimeout(generateHeader, 0); // generateHashtags, generateReadTime
	setTimeout(generateViewer, 0);
	setTimeout(scrollToSectionByUrl, 200);
}

//--EMOJI--//
function toggleEmojiDisplay() {
	if(event?.target != null)
		event.target.innerText = event.target.innerText == 'mood' ? 'sentiment_neutral' : 'mood';
	for(let emoji of document.querySelectorAll('.emoji')) {
		let temp = emoji.textContent;
		emoji.innerText = emoji.title;
		emoji.title = temp;
	}
}

//--SWIPE EVENTS--//
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
	// prevent navigation when with mal popup
	if(event.target.closest('.mal-frame') != null)
		return;
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
	// prevent navigation when with mal popup
	if(event.target.closest('.mal-frame') != null)
		return;
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