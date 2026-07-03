//--STATE--//
function addHistoryState(property) {
	// add to history state to allow browser back action
	if (history.state && history.state[property]) {
		let currentState = history.state || {};
		currentState[property] = true;
		history.replaceState(currentState, null, ' ');
	}
	else {
		let newState = {};
		newState[property] = true;
		history.pushState(newState, null, ' ');
	}
}

function resetHistoryState() {
	history.replaceState(null, null, ' ');
}

//--SNACKBAR--//
function showSnackbar(messageText, actionText, onClose = null) {
	// find element
	let active = document.querySelector('.snackbar') ?? document.createElement('div');
	if (active.childElementCount > 0) active.replaceChildren();
	active.classList.add('snackbar', 'hide');
	// message as per input
	let message = document.createElement('div');
	message.innerText = messageText;
	active.appendChild(message);
	// action button for snackbar
	let action = document.createElement('button');
	action.classList.add('action');
	action.href = 'javascript:void(0)';
	action.innerText = actionText || 'Close';
	action.onclick = function() {
		removeSnackbar();
		if(onClose && typeof onClose == 'function')
			onClose();
	};
		
	active.appendChild(action);
	document.body.appendChild(active);
	setTimeout(function() {
		document.querySelector('.snackbar')?.classList.remove('hide');
	}, 100);
}

function removeSnackbar() {
	event.target.closest('.snackbar')?.classList.add('hide');
}

//--SCRIM--//
function generateScrim() {
	let scrim = document.querySelector('.scrim');
	if (!scrim) {
		scrim = document.createElement('div');
		scrim.classList.add('scrim', 'hide');
		scrim.addEventListener('click', function () {
			if (history.state)
				history.back();
		});
		scrim.addEventListener('contextmenu', function () {
			event.preventDefault();
		});
		document.body.insertBefore(scrim, document.body.childNodes[0]);
	}
	else {
		delete document.querySelector('.scrim').dataset.message;
	}
}

function showScrim() {
	generateScrim();
	document.querySelector('.scrim')?.classList.remove('hide');
	let meta = document.querySelector('meta[name="theme-color"]');
	// let highContrast = getThemeOption().includes('high-contrast');
	if (meta) {
		// read from active css variable
		let rootStyle = getComputedStyle(document.documentElement);
		let accentRgb = rootStyle.getPropertyValue('--accent').split(',').map(s => parseInt(s));
		let backgroundRgb = rootStyle.getPropertyValue('--background').split(',').map(s => parseInt(s));
		// if(highContrast) { // high contrast, assume default dark color
		// 	accentRgb = [69, 69, 69];
		// 	backgroundRgb = [0, 0, 0];
		// }
		// flatten rgba to hex value (since meta cannot be 8 digits)
		if (accentRgb.length == 3 && backgroundRgb.length == 3)
			// fixed alpha value, follow css
			meta.content = rgbaToHex(accentRgb, 0.5, backgroundRgb);
	}
}

function rgbaToHex(rgb, alpha, bg) {
	let flattened = rgb.map((channel, i) => {
		let result = (channel * alpha) + (bg[i] * (1 - alpha));
		return Math.round(result);
	});
	// write as hex
	return "#" + flattened.map(c => c.toString(16).padStart(2, '0').toUpperCase()).join('');
}

function hideScrim() {
	document.querySelector('.scrim')?.classList.add('hide');
	let meta = document.querySelector('meta[name="theme-color"]');
	if (meta) {
		meta.content = document.documentElement.classList.contains('darked') ? 'black' : 'white';
	}
	if (document.querySelector('.sheet:not(.hide)'))
		hideSheets();
}

//-- SHEET --//
function showSheet(sheet, options) {
	let { draggable, delay, origin } = options || {};
	if (sheet) {
		sheet.classList.add('loading');
		sheet.style.height = '';
		addHistoryState('popup');
		// initial load of sheet depends on content render time
		if (delay)
			setTimeout(function () {
				window.loadStart = new Date();
				checkLoading(sheet);
			}, window.matchMedia('(prefers-reduced-motion: reduce)')?.matches ? 0 : 200);
		else {
			sheet.classList.remove('hide');
			sheet.focus();
			addHistoryState('popup');
		}
	}
	else {
		return console.error('sheet not found, add in DOM before showing');
	}
	if (draggable) {
		// drag handle to adjust height and dismiss
		sheet.dataset.loader = 'drag_handle';
		sheet.onmousedown = startDragSheet;
		sheet.ontouchstart = startDragSheet;
		// use global events to detect pointer position (split by type, pointer events KIV)
		window.onmousemove = onDragSheet;
		window.ontouchmove = onDragSheet;
		window.onmouseup = stopDragSheet;
		window.ontouchend = stopDragSheet;
		window.ontouchcancel = stopDragSheet;
	}
	if (origin)
		window.sheetTarget = origin;
}

function checkLoading(sheet) {
	if (checkLoaded(sheet)) {
		window.loadStart = null;
		console.log('frame loaded!');
		if (typeof stopLoader == 'function')
			stopLoader();
		if(document.querySelector('.scrim.hide'))
			return;
		sheet.classList.remove('hide', 'loading');
		sheet.classList.add('loaded');
		sheet.focus();
	}
	else if (window.loadStart && new Date() - window.loadStart > 5000 && document.querySelector('.scrim')) {
		// took too long to load, show warning
		document.querySelector('.scrim').dataset.message = 'Took too long?\u000AClick or tap to close and retry';
	}
	else if (!sheet?.classList.contains('loaded') && !document.querySelector('.scrim.hide')) {
		if (!document.querySelector('.loader')) {
			createLoader(function () {
				history.back();
			});
			setTimeout(function () {
				startLoader('sheet');
			}, 0);
		}
		setTimeout(function () {
			checkLoading(sheet);
			console.log('frame loading...');
		}, 350);
	}
}

function checkLoaded(sheet) {
	return sheet &&
		(sheet.querySelector('img')?.complete ||
			sheet.querySelector(`iframe[data-tweet-id],
				div.twitter-timeline.twitter-timeline-rendered,
				iframe.instagram-media.instagram-media-rendered,
				iframe.yt-video,
				iframe.yt-shorts,
				iframe.takoboto-frame,
				iframe.jisho-frame,
				iframe[src*=apple]`)
		);
}

function hideSheets() {
	for (let sheet of document.querySelectorAll('.sheet')) {
		sheet.classList.add('hide');
		sheet.classList.remove('loaded');
		sheet.style.removeProperty('--sheet-height');
	}
	// remove text if showed to load too long
	if (document.querySelector('.scrim'))
		document.querySelector('.scrim').replaceChildren();
	// focus on initial element
	if (window.sheetTarget)
		window.sheetTarget.focus();
}

function startDragSheet(event) {
	// console.log(event.target);
	if (event.target && event.target.classList.contains('sheet')) {
		window.dragging = true;
		window.sheet = { initial: event.target.getBoundingClientRect().height };
		event.target.classList.add('dragging');
		window['touchY'] = event.changedTouches[0].clientY;
		window['touchX'] = event.changedTouches[0].clientX;
	}
}

function onDragSheet(event) {
	// detect pointer, move sheet
	if (window.dragging) {
		if (event.type == 'touchmove')
			event = event.touches[0];
		// console.log(event.clientX, event.clientY);
		let buffer = 2;
		if (event.clientX <= buffer || event.clientY <= buffer ||
			event.clientX >= window.innerWidth - buffer || event.clientY >= window.innerHeight - buffer)
			return stopDragSheet(event);
		// stagger as integer multiple to prevent constant render
		if (event.screenY % 1 == 0) {
			window.sheet.height = (event.clientY - (window.innerHeight - window.sheet.initial));
			// console.log(window.sheet);
			// hide sheet if height is too small
			if (window.innerHeight - event.clientY < 0.3 * window.innerHeight) {
				hideScrim();
				hideSheets();
			}
			else
				requestAnimationFrame(adjustSheetHeight);
		}
	}
}

function adjustSheetHeight() {
	// console.log('adjustSheetHeight');
	if (window.sheet?.height > 0) {
		let sheet = document.querySelector('.sheet:not(.hide), .sheet.loading');
		if (sheet) sheet.style.setProperty('--sheet-height', window.sheet.height + 'px');
	}
}

function stopDragSheet(event) {
	// hide sheet if on content top
	let sheet = document.querySelector('.sheet:not(.hide), .sheet.loading');
	if (event.changedTouches && sheet && sheet.scrollHeight > sheet.clientHeight && sheet.scrollTop <= 0 && event.target != sheet) {
		// see onTouchEnd()
		// console.log(event.changedTouches);
		let delta = 50;
		let swipeDown = event.changedTouches[0].clientY - window['touchY'];
		let swipeLeft = window['touchX'] - event.changedTouches[0].clientX;
		let swipeRight = event.changedTouches[0].clientX - window['touchX'];
		// console.log(swipeDown, swipeLeft, swipeRight);
		if (swipeDown > swipeLeft && swipeDown > swipeRight && swipeDown > delta) {
			if (typeof onSwipeDown == 'function') {
				hideScrim();
				hideSheets();
			}
		}
	}
	delete window.dragging;
	delete window.sheet;
	if (event.target)
		event.target.classList.remove('dragging');
}