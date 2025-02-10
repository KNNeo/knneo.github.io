//--ROUTING--//
function removeLinkExtensions() {
	for(let a of document.querySelectorAll('a'))
		a.setAttribute('href', processLinkExtensions(a.getAttribute('href')));
}

function processLinkExtensions(url) {
	if(url && url.length > 0 && !url.startsWith('http') && !window.location.href.startsWith('file:///'))
		return url.replace('index.html', '').replace('.html', '');
	return url;
}

setTimeout(removeLinkExtensions, 0);