/* DIFFERENCES FROM IMAGE COLLAGE V3
* change grid click event listener
* on resize all dialogs close
* adjust dialog style in css
*/

//--FUNCTIONS--//
function popupPlayer(url) {
    let playerHtml = generatePlayerByURL(url);
    if(typeof popupContent == 'function')
        popupContent(playerHtml);
}

function generatePlayerByURL(url) {
    let embedWidth = 800; // as per apple documentation, fixed
    let embedHeight = 450; // as per apple documentation, fixed
    if (url.includes('music.apple.com')) {
        //process itunes embed
        return '<iframe allow="autoplay *; encrypted-media *;" frameborder="0" height="'+ embedHeight +'" sandbox="allow-modals allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation" src="' +
            url.replace('music.apple.com', 'embed.music.apple.com') +
            '" style="background: transparent; overflow: hidden; width: ' + (isHorizontalLayout() ? embedWidth + 'px' : '100%') + ';" onload="stopLoader()"></iframe>';
    }
	if(url.includes('open.spotify.com')) {
        //process spotify embed
		return '<iframe src="' + url + '" height="' + embedHeight + '" frameborder="0" allowtransparency="true" allow="encrypted-media" style="background: transparent; overflow: hidden; width: ' + (isHorizontalLayout() ? embedWidth + 'px' : '100%') + ';" onload="stopLoader()"></iframe>';
	}
}