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

//localization
pageTitle = 'GALLERY'; //for tab, and top of page
pageCredit = ''; //does not hide, and will hide if empty
tagTitle = 'Tags';
selectAllTag = 'Select All';
defaultTag = ''; //if empty or not in tags in array, will show all
closeIconTitle = 'Close';
collapseFilterIconTitle = 'Collapse Filters';
expandFilterIconTitle = 'Expand Filters';
orientationTitle = 'Orientation';
portraitTitle = 'Portrait';
landscapeTitle = 'Landscape';
tagRightClickTitle = 'Right Click to Select This Only';
loaderTextPrefix = 'Images Loaded: ';

//array containing all gallery info, tags delimiter "|"
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL'],

[999,'','','','']
];
