document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
}, false);
window.onload = function () {
	for(var image of document.getElementsByTagName("img"))
	{
		image.src = image.alt;
		image.alt = "";
	}
}