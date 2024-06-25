//--ROUTING--//
function removeLinkExtensions() {
	for(let a of document.querySelectorAll('a'))
		a.setAttribute('href', processLinkExtensions(a.getAttribute('href')));
}

function processLinkExtensions(url) {
	if(!window.location.href.startsWith('file:///') && !url.startsWith('http'))
		return url.replace('index.html', '').replace('.html', '');
	return url;
}