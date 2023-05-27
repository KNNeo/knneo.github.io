//--HELPERS--//


//--VARIABLES--//


//--DOM NODE REFERENCES--//
let titleDiv = document.querySelector('.title');
let subtitleDiv = document.querySelector('.subtitle');
let galleryDiv = document.querySelector('.gallery');
let noticeDiv = document.querySelector('.notice');

//--DOM FUNCTIONS--//


//--EVENT HANDLERS--//
function onMouseDown(e) {
	console.log('onMouseDown');
	window.variables.touchY = e.offsetX;
	window.variables.touchX = e.offsetY;
	window.variables.mousedown = true;
}

function onMouseMove(e) {
	// console.log('onMouseMove');
	if(window.variables.mousedown)
	{
		let delta = 10;
		let swipeDown = e.offsetY - window.variables.touchY;
		let swipeUp = window.variables.touchY - e.offsetY;
		let swipeLeft = window.variables.touchX - e.offsetX;
		let swipeRight = e.offsetX - window.variables.touchX;
		// console.log(e.offsetX, e.offsetY);
		// console.log(swipeUp, swipeDown, swipeLeft, swipeRight);
		
		//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
		if(swipeLeft > delta) {
			// console.log('swipeLeft');
			if(window.variables.selected >= galleryDiv.childElementCount - 1)
				window.variables.selected = galleryDiv.childElementCount - 2;
			if(window.variables.selected < galleryDiv.childElementCount - 1) {
				document.querySelectorAll('.gallery img')[++window.variables.selected].scrollIntoView({
					inline: 'center'
				});
				window.variables.selected++;
			}
			return;
		}
		//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
		if(swipeRight > delta) {
			// console.log('swipeRight');
			if(window.variables.selected <= 0)
				window.variables.selected = 1;
			if(window.variables.selected > 0) {
				document.querySelectorAll('.gallery img')[--window.variables.selected].scrollIntoView({
					inline: 'center'
				});
				window.variables.selected--;
			}
			return;
		}
		//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
		if(swipeDown > delta) {
			// console.log('swipeDown');
			return;
		}
		//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
		if(swipeUp > delta) {
			// console.log('swipeUp');
			return;
		}
		
		window.variables.mousedown = false;
	}
}

function onMouseUp(e) {	
	window.variables.mousedown = false;
}

function onTouchStart(e) {
	window.variables.touchY = e.touches[0].clientY;
	window.variables.touchX = e.touches[0].clientX;
}

function onTouchMove(e) {
	let swipeDown = e.touches[0].clientY - window.variables.touchY;
	let swipeUp = window.variables.touchY - e.touches[0].clientY;
	let swipeLeft = window.variables.touchX - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window.variables.touchX;
	// console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	
	//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		// console.log('swipeLeft');
		if(window.variables.selected >= galleryDiv.childElementCount - 1)
			window.variables.selected = galleryDiv.childElementCount - 2;
		if(window.variables.selected < galleryDiv.childElementCount - 1) {
			document.querySelectorAll('.gallery img')[++window.variables.selected].scrollIntoView({
				inline: 'center'
			});
			window.variables.selected++;
		}
		return;
	}
	//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		// console.log('swipeRight');
		if(window.variables.selected <= 0)
			window.variables.selected = 1;
		if(window.variables.selected > 0) {
			document.querySelectorAll('.gallery img')[--window.variables.selected].scrollIntoView({
				inline: 'center'
			});
			window.variables.selected--;
		}
		return;
	}
	//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		// console.log('swipeDown');
		return;
	}
	//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		// console.log('swipeUp');
		return;
	}
}

//--FUNCTIONS--//
function renderGallery() {
	// render all items
	for(let [index, value] of window.variables.items.entries())
	{
		let itemDiv = document.createElement('img');
		itemDiv.setAttribute('data-id', index);
		itemDiv.src = value.filename;
		itemDiv.title = value.description;
		itemDiv.draggable = false;
		itemDiv.addEventListener('click', function() {
			this.scrollIntoView({
				inline: 'center'
			});
		});
		galleryDiv.appendChild(itemDiv);
	}
	
	// touch events
	window.variables.selected = 0;
	galleryDiv.addEventListener('mousedown', onMouseDown);
	galleryDiv.addEventListener('mousemove', onMouseMove, false);
	galleryDiv.addEventListener('mouseup', onMouseUp);
	galleryDiv.addEventListener('touchstart', onTouchStart);
	galleryDiv.addEventListener('touchmove', onTouchMove, false);
	setTimeout(function() {
		document.querySelectorAll('.gallery img')[0].scrollIntoView({
			inline: 'center', behavior: 'smooth'
		});
	}, 200);
}

//--INITIAL--//
function startup() {
	document.title = window.variables.title;
	titleDiv.innerText = window.variables.title;
	noticeDiv.innerText = window.variables.notice;
	
	renderGallery();
}

window.onload = getJson(
	document.getElementById('data-id').src,
	function(content) {
		window.variables = content;
		startup();
	}
);