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
runSlideshow = new XMLHttpRequest();
runSlideshow.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		preProcessProfileList(JSON.parse(this.responseText));		
	}
};
runSlideshow.open("GET", "https://knneo.github.io/profile-list/profile-list.json", false);
runSlideshow.send();
runSlideshow = null;

//array containing all gallery info, tags delimiter "|"
function preProcessProfileList(inputList) {
	
	imgArray = [
	[0,'FILENAME','ORIENTATION','TAG','DETAIL']
	];
	
	//processing to fit image-gallery
	let profiles = inputList.filter( function(n) {
					return n.category != 'friendList';
				});
	for(let profile of profiles)
	{
		for(let image of profile.images)
		{
			//if(image.includes('.blogspot.com')) continue;
			let profileNames = [profile.name];
			imgArray.push([1, image, 'portrait', profileNames.join("|"), '']);
		}
	}
	for(let friendList of inputList.filter( function(n) {
					return n.category == 'friendList';
				}))
	{
		for(let friend of friendList.friends)
		{
			if(friend.image.includes('.blogspot.com')) continue;
			let friendIds = friend.id.split('-');
			let friendNames = ['*Twoshots Only'];
			for(let f of friendIds)
			{
				friendNames.push(profiles.filter( function(n) {
					return f == n.id;
				})[0].name);
			}
			imgArray.push([1, friend.image, 'portrait', friendNames.join("|"), '']);
		}
	}
}