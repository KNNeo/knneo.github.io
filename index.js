//*mobile check*//
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
};
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const random = function(version) {
	//random is 0 ~ 1
	//version is integer, output is in em
	return 0.6*(0.5*Math.random() + version) + 'em';
};

//*dark mode check*//
window.addEventListener('load', startup);
window.addEventListener('resize', showDimensions);

function startup() {
	renderElements();
	showDimensions();	
}

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
			
			// add page
			let url = document.createElement('a');
			url.classList.add('subset');
			url.classList.add('box');
			url.classList.add('shadowed');
			url.style.fontSize = random(page.priority);
			if(page.isLocal)
				url.classList.add('local');
			url.href = page.url;
			url.innerText = page.title;
			
			pageList.appendChild(url);
		}
	}
}

function showDimensions() {
	if(document.querySelector('.dimensions') != null)
	{
		document.querySelector('.dimensions').innerText = window.innerWidth + 'px by ' + window.innerHeight + 'px';
	}
}
