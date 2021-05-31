//To add gallery:
// Copy and fill in image-gallery-data, rename file to end with \'-data\'
// Fill in links variable in image-gallery.js
// Tada!


//--REINITIALISE SETTINGS--//
enableViewer = true; //images smaller than screen will not resize up
enableOrientation = false; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = window.innerWidth <= 640;; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = true; //removes shadows and borders in images
enableDarkMode = true; //no button to toggle, when load always white background

//localization
pageTitle = 'Alternative Girls Art Gallery'; //for tab, and top of page
pageCredit = '[Source：https://twitter.com/alterna_girls]'; //does not hide, and will hide if empty
tagTitle = 'Girls';
selectAllTag = 'Select All';
defaultTag = ''; //if empty string will select all; can be string OR integer based on sorting
closeIconTitle = 'Close';
collapseFilterIconTitle = 'Collapse Filters';
expandFilterIconTitle = 'Expand Filters';
orientationTitle = 'Orientation';
portraitTitle = 'Portrait';
landscapeTitle = 'Landscape';
tagRightClickTitle = 'Right Click to Select This Only';
loaderTextPrefix = 'Images Loaded: ';

//array containing all gallery info, tags delimiter "|"
if(birthdayListJson != null) 
	preProcessProfileList();

function preProcessProfileList() {
	let inputList = birthdayListJson;
	
	imgArray = [
	[0,'FILENAME','ORIENTATION','TAG','DETAIL']
	];
	
	//processing to fit image-gallery
	let profiles = inputList.filter( function(n) {
					return n.category == 'alterna';
				});
	for(let profile of profiles)
	{
		for(let image of profile.images)
		{
			let profileNames = [profile.name];
			let imageUrl = 'https://pbs.twimg.com/media/' + image + '?format=jpg&name=small';
			imgArray.push([1, imageUrl, 'portrait', profileNames.join("|"), '']);
		}
	}
}