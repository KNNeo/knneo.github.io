//*mobile check*//
const isLocal = window.location.href.includes('file://');
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
};
const isFirefox = (/Firefox/i.test(navigator.userAgent));

//*dark mode check*//
window.addEventListener('load', function() {
	renderElements();
	hideLocal();
	showDimensions();
	// addPreviewOnHover();
});
window.addEventListener('resize', showDimensions);

function renderElements() {
	if(document.querySelector('.data'))
	{
		let pageElements = JSON.parse(document.querySelector('.data').textContent);
		let pageList = document.querySelector('.page-list');
		if(pageList != null)
		{
			pageList.innerHTML = '';
		}
		
		for(let page of pageElements)
		{
			let group = page.group;
			let item = document.getElementById(group);
			// add title
			// if(item == null)
			// {
				// item = document.createElement('h3');
				// item.id = group;
				
			// }
			// else
			// {
				// let group = item.querySelector('.title');
				// if(group == null)
				// {
					// group = document.createElement('span');
					// group.classList.add('title');
					// group.innerText = page.group;
					// item.insertBefore(group, item.children[0]);	
					
					// let spacer = document.createElement('span');
					// spacer.innerText = ' ';
					// item.insertBefore(spacer, item.children[1]);
				// }
				
				// let spacer = document.createElement('span');
				// spacer.innerText = ' ';
				// item.appendChild(spacer);
			// }
			
			// add page
			let url = document.createElement('a');
			url.classList.add('subset');
			url.classList.add('box');
			url.classList.add('shadowed');
			let randomNo = Math.random() + page.version;
			url.style.fontSize = randomNo + 'em';
			if(page.isLocal) 
				url.classList.add('local');
			url.href = page.url;
			url.innerText = page.title;
			
			// item.appendChild(url);
			
			pageList.appendChild(url);
		}
	}
}

function hideLocal() {
	if(!isLocal)
	{
		for(let local of document.getElementsByClassName('local')){
			local.style.display = 'none';
		}
	}
}

function showDimensions() {
	if(document.querySelector('.dimensions') != null)
	{
		document.querySelector('.dimensions').innerText = window.innerWidth + 'px by ' + window.innerHeight + 'px';
	}
}

function addPreviewOnHover() {	
	document.addEventListener('mousemove', function(e) {
		let el = e.target;
		let overlay = document.querySelector('.preview');
		if(overlay != null)
		{
			overlay.style.left = (isFirefox ? (el.getBoundingClientRect().x + e.offsetX) : e.offsetX) + 'px';
			overlay.style.top = (el.getBoundingClientRect().y + e.offsetY) + 'px';
			// console.log(el);
			
			if(el.classList.contains('subset') && window['target'] != el.href)
			{
				window['target'] = el.href;
				overlay.style.display = 'block';
				overlay.src = window['target'];
			}
			else if(!el.classList.contains('subset'))
			{
				window['target'] = '';
				overlay.style.display = 'none';
				overlay.src = window['target'];
			}		
		}
	});
}

//*tracking prevention*//
/*
let keys = 0;
if(new Date().getSeconds() % 10 > 0)
	document.getElementById("landing-cover").style.display = 'none';
//if mobile, tap 10 times
document.addEventListener('touchstart', function(event) {
	console.log(keys++);
	if (keys >= 10) {
		document.getElementById("landing-cover").style.display = 'none';
	}
	
});
//if desktop, hit 10 keys within 1 second
document.addEventListener('keyup', function(event) {
	event.preventDefault();
	console.log(keys++);
	if (keys >= 10) {
		document.getElementById("landing-cover").style.display = 'none';
	}
	
	setTimeout(function() { keys = 0; }, 1000);
});
*/