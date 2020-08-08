//To add gallery:
// Copy and fill in image-gallery-data, rename file to end with \'-data\'
// Fill in links variable in image-gallery.js
// Tada!


//--REINITIALISE SETTINGS--//
enableViewer = false; //images smaller than screen will not resize up
enableOrientation = false; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = false; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = false; //removes shadows and borders in images
enableDarkMode = false; //no button to toggle, when load always white background

pageTitle = ''; //for tab, and top of page
pageCredit = ''; //does not hide, and will hide if empty
tagTitle = '';
selectAllTag = 'Select All';
defaultTag = ''; //if empty will select all


//array containing all gallery info
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],

[999,'','','','']
];
