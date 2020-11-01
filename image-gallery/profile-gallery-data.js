//To add gallery:
// Copy and fill in image-gallery-data, rename file to end with \'-data\'
// Fill in links variable in image-gallery.js
// Tada!


//--REINITIALISE SETTINGS--//
enableViewer = false; //images smaller than screen will not resize up
enableOrientation = false; //assume has values in orientation column
enableSlideshow = true; //enable slideshow button
enableFullscreenSlideshow = false; //enable fullscreen button for slideshow, for browser only not viewer
enableShadows = true; //removes shadows and borders in images
enableDarkMode = true; //no button to toggle, when load always white background

//localization
pageTitle = 'Profile List'; //for tab, and top of page
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

//json deserialisation based on profile-list
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let isExternal = window.location.href.includes('://knneo.github.io');
let smallScreen = window.innerWidth <= 640;
let profileList;
let friendList = [];
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		profileList = JSON.parse(this.responseText);
		//code here
		//if(profileList != null && generateProfileListFromJSON(profileList)) renderProfileBox();
		//if(profileList != null) initialiseWantedList();
		
	}
};
xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", false);
xmlhttp.send();

//array containing all gallery info
imgArray = [
[0,'FILENAME','ORIENTATION','TAG','DETAIL']
];

//processing to fit image-gallery
let smallCounter = 1;
for(let profile of profileList)
{
	for(let image of profile.images)
	{
		if(image.includes('.blogspot.com')) continue;
		imgArray.push([smallCounter, image, 'portrait', profile.name, '']);
	}
}