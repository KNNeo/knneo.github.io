//Multi-image thumbnail: Define caption height, onclick event
function setThumbnails() {
    let allThumbnails = document.body.getElementsByClassName("thumbnail");
    for (let i = 0; i < allThumbnails.length; i++) {
        let initialHeight = allThumbnails[i].getElementsByClassName('thumbnail-initial')[0].offsetHeight;
        let popHeight = allThumbnails[i].getElementsByClassName('thumbnail-pop')[0].offsetHeight;
        allThumbnails[i].style.height = Math.max(initialHeight, popHeight) + 'px';
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[0].addEventListener('click', function() {
			//switchThumbnails(closestClass(this, "thumbnail"));
			setTimeout(switchThumbnails(this.parentElement.parentElement), 200);
		});
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[1].addEventListener('click', function() {
			//switchThumbnails(closestClass(this, "thumbnail"));
			setTimeout(switchThumbnails(this.parentElement.parentElement), 200);
		});
		//document.getElementById('isMarried').style.visibility = 'hidden';
    }
}
let closestClass = function(inputElement, targetClassName) {
    while (inputElement.className != targetClassName) {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function switchThumbnails(tn) {
    let tc = tn.getElementsByClassName("thumbnail-initial");
    let initialVisible = true;
    if (tc[0].style.visibility == "hidden") {
        tc[0].style.visibility = "visible";
        tc[1].style.visibility = "hidden";
    } else if (tc[0].style.visibility == "" || tc[1].style.visibility == "") {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
		initialVisible = false;
    } else {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
		initialVisible = false;
    }

    return false;
}

function adjustThumbnailHeight(tn) {
	let initialHeight = tn.getElementsByClassName('thumbnail-initial')[0].offsetHeight;
	let popHeight = tn.getElementsByClassName('thumbnail-pop')[0].offsetHeight;
	//if(popHeight - initialHeight > 100 || popHeight - initialHeight < -100)
	tn.style.height = (tn.getElementsByClassName('thumbnail-initial')[0].style.visibility == 'hidden' ? popHeight : initialHeight) + 'px';
}

//--right click to toggle censor--//
/*function invertCensor() {
	for(let link of document.getElementById('wantedList').getElementsByTagName('a'))
	{
		link.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			isExternal = !isExternal;
			this.click();
			addStatusPopUp();
			isExternal = !isExternal;
		}, false);
	}
}*/

//--not dependent on render--//
function navigateToProfile(e) {
	event.preventDefault();
	for(let link of document.getElementById('wantedList').getElementsByTagName('a'))
	{
		if(link.innerHTML.replace(' ','') == e.title)
		{
			generateProfileFromJSON(link.innerHTML.replace(' ', ''));
			renderProfileBox();
			addStatusPopUp();
			document.getElementById('profile').scrollIntoView();
			document.getElementById('timeline').getElementsByTagName('div')[0].style.opacity = '0';
			return;
		}
	}
	if(document.getElementsByClassName('timeline-popup').length > 0)
		document.getElementsByClassName('timeline-popup')[0].style.opacity = '0';
	
}

//on timeline double click shrink timeline
document.getElementById("timeline").addEventListener("dblclick", function() {
	let origWidth = this.getElementsByTagName("svg")[0].width.baseVal.value / 2;
	this.innerHTML = "";
	loadTimeline(origWidth < 1000 ? 1000 : origWidth);
});

//on timeline wheel scroll adjust timeline length ie. redraw
document.getElementById("timeline").addEventListener("wheel", function(e) {
	e.preventDefault();
	if (!e.shiftKey) {
		this.scrollLeft -= e.wheelDelta / 2;
		return;
	}
	let origWidth = this.getElementsByTagName("svg")[0].width.baseVal.value + e.wheelDelta;
	this.innerHTML = "";
	if (origWidth < 1000) origWidth = 1000;
	else if (origWidth > 10000) origWidth > 10000;
	loadTimeline(origWidth);
});

//refresh images on resize to avoid image fitting errors
window.addEventListener('resize', function () {
	resizeAllProfileBoxImg();
});

function loadTimeline(width) {
	TimeKnots.draw("#timeline", timelineDOBlist, {
		horizontalLayout: true,
		width: width,
		height: 100,
		dateFormat: "%Y.%m.%d",
		showLabels: true,
		labelFormat: "%Y"
	});
	adjustKnots();
}

//on scroll turn off all overlays in timeline and calendar
window.addEventListener("scroll", function() {
	let timeline = document.getElementById("timeline");
	if (timeline.getElementsByTagName("div").length > 0)
		timeline.getElementsByTagName("div")[0].style.opacity = "0";
});

//--variables--//
let loadedImages = 0;
let timelineDOBlist = [];
let calendarDOBlist = [];
let currentMonth = 0;
let statusPopup = "<div id=\"tp-description\">As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism?)</div>";
let friendMode = false;
let excludeMarried = false;
let timezone = "Asia/Tokyo";
let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//--dependent on render, as functions to call on render--//
function initialiseWantedList() {
	//toggleInitialThumbnailLayout();
	generateWantedList();
	timelineDOBlist = createDOBlist(1, 35);
	loadTimeline(2500);
	calendarDOBlist = createDOBlist(0, 50);
	currentMonth = createCalendar(new Date().getMonth(), calendarDOBlist);
	setThumbnails();
	addStatusPopUps();
	friendCheck();
}

function toggleInitialThumbnailLayout() {
	if(!smallScreen)
	{
		let thumbnail = document.getElementsByClassName('thumbnail')[0];
		let thumbnailInitial = thumbnail.getElementsByClassName('thumbnail-initial')[0];
		let thumbnailPop = thumbnail.getElementsByClassName('thumbnail-pop')[0];
		let marriedCouple = document.getElementById('marriedCouple').cloneNode(true);
		document.getElementById('marriedCouple').remove();
		let profile = document.getElementById('profile').cloneNode(true);
		document.getElementById('profile').remove();
		thumbnailPop.appendChild(profile);
		thumbnailInitial.appendChild(marriedCouple);
		document.getElementById('pairSearch').remove();
	}
}

function renderProfileBox() {
	document.getElementById('profile').style.display = '';
	//reloadImages();
	addProfileBoxClick();
	addProfileBoxImgOnError();
	switchProfileBoxImage();
	addAgeAfterDOB();
	//addStatusPopUps();
	openLinksInNew();
	//invertCensor();
	if(isExternal) censorData(); //ONLY FOR GITHUB
	setTimeout(reloadImages, 300);
}

//--functions--//
//add age after DOB span
function addAgeAfterDOB() {
	for (let dateOfBirth of document.getElementsByClassName("DOB")) {
		let age = dateOfBirth.innerText.includes('????') ? 0 : parseInt(getAge(dateOfBirth.innerHTML));
		if (age != undefined && age > 0)
			dateOfBirth.innerHTML = dateOfBirth.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
	}
}

function getAge(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = birthDateStr.substring(0, 10);
	//return Math.floor((new Date().getTime() - birthDate) / 31556952000);
	let offsetMinutes = moment().utcOffset() - moment.tz(timezone).utcOffset();
	let diff = moment().diff(moment(birthDate));
	return moment.duration(diff).subtract(offsetMinutes, 'minutes').years();
}

//generate wanted list
function generateWantedList(profileLink) {
	let wantedListString = "";
	//let friendMode = document.getElementById("pairsCheckbox").checked;
	//let excludeMarried = document.getElementById("marriedCheckbox").checked;
	let wantedList = document.getElementById("wantedList");

	//create name array from static profile boxes
	let profileNamesList = new Array();
	for (let profileName of profileList) {
		if (excludeMarried && profileName.turningPoint.isMarried) continue;
		if (friendMode && friendList.filter( function(n) {
					return (n.friend1 == profileName.id) || 
						   (n.friend2 == profileName.id)
				}).length == 0) continue;
		profileNamesList.push(profileName.name);

	}
	profileNamesList.sort();

	//create wanted list from list of names
	let currentProfileName = profileLink != undefined ? profileLink.innerText.replace(' ','') : '';
	for (let profileName of profileNamesList) {
		wantedListString += "<li><a" + 
		(friendMode && friendList.filter( function(n) {
					return (n.friend1 == currentProfileName && n.friend2 == profileName.replace(' ','')) || 
						   (n.friend2 == currentProfileName && n.friend1 == profileName.replace(' ',''))
				}).length == 0
									? " style=\"filter: grayscale(100);\"" 
									: ""
						) + ">" + profileName + "</a></li>";
	}
	wantedList.innerHTML = wantedListString;

	//wanted list processing
	for (let id = 0; id < wantedList.getElementsByTagName("a").length; id++) {
		wantedList.getElementsByTagName("a")[id].style.margin = '5px';
		wantedList.getElementsByTagName("a")[id].addEventListener("click", function() {
			generateProfileFromJSON(this.innerText.replace(" ", ""));
			renderProfileBox();
			addStatusPopUp();
			generateWantedList(this);
			document.getElementById('profile').scrollIntoView();
			//if(!smallScreen) switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
		});
		wantedList.getElementsByTagName("a")[id].addEventListener("contextmenu", function(e) {
			e.preventDefault();
			isExternal = !isExternal;
			generateProfileFromJSON(this.innerText.replace(" ", ""));
			renderProfileBox();
			generateWantedList(this);
			document.getElementById('profile').scrollIntoView();
			//if(!smallScreen) switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
			isExternal = !isExternal;
		}, false);
	}
}

function addStatusPopUp() {
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseover", function(d) {
		d.target.innerHTML = statusPopup + d.target.innerHTML;
	});
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseout", function() {
		if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
	});
}

function addStatusPopUps() {
	for (let statusPopOut of document.getElementsByClassName("turning-point")) {
		statusPopOut.addEventListener("mouseover", function(d) {
			d.target.innerHTML = statusPopup + d.target.innerHTML;
		});
		statusPopOut.addEventListener("mouseout", function() {
			if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
		});
	}
	document.addEventListener("touchmove", function() {
		if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
	});
}

//create array of objects with DOB info, parameter: age (range inclusive)
function createDOBlist(minAge, maxAge) {
	let listOfDOB = new Array();
	listOfDOB.push({
		date: "1993-02-19",
		name: "Me"
	});
	for(let profile of profileList) {
		let targetId = profile.name;
		let targetDOB = profile.dob; //document.getElementById(targetId.replace(" ", "")).getElementsByClassName("DOB");
		if (targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB.replace(".", "-").replace(".", "-").substring(0, 10)));
			let age = targetDOB.includes('?') ? 0 : parseInt(getAge(targetDOB)) + 1;
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				listOfDOB.push({
					date: targetDOB.replace(".", "-").replace(".", "-").substring(0, 10),
					name: targetId,
					currentAge: age
				});
		}
	}
	//to sort the above so oldest is added first in timeline
	listOfDOB.sort(function(a, b) {
		return Date.parse(a.date) - Date.parse(b.date)
	});
	return listOfDOB;
}

function toggleMarried() {
	excludeMarried = document.getElementById("marriedCheckbox").checked;
	if(excludeMarried && friendMode) 
	{
		document.getElementById("pairsCheckbox").checked = false;
		togglePairs();
	}
	generateWantedList();
	timelineDOBlist = createDOBlist(1, 35);
	document.getElementById("timeline").innerHTML = "";
	loadTimeline(2500);
}

function togglePairs() {
	//generate wanted list again, but all disable (grayscale too?), only those who have friends
	//clicking on first link will store first value as variable
	//this variable is then used to light up all wanted list again on generate, to available pair
	//clicking on second link will now go to pair view (call generate profile twice will do)
	//generateWantedList(document.getElementById("marriedCheckbox").checked);
	friendMode = document.getElementById("pairsCheckbox").checked;
	if(document.getElementById('profile').childElementCount > 0) 
	{
		let profileNode = document.createElement('div');
		profileNode.innerText = document.getElementById('profile').childNodes[0].id;
		
		generateWantedList(profileNode);
		//document.getElementById("profile").style.display = 'none';
		//document.getElementById("profile").innerHTML = '';
	}
}

//generate calendar from profile boxes
function createCalendar(monthNo, DOBlist) {
	let calendarArray = new Array();
	let dayOfMonth = 1;
	for (let week = 0; week < 6; week++) {
		let weekList = ['', '', '', '', '', '', ''];
		for (let day = 0; day < 7; day++) {
			if (new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDay() == day) {
				//add to array
				if (dayOfMonth > new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDate()) break;
				weekList[day] = dayOfMonth;
				dayOfMonth++;
			}
		}
		calendarArray.push(weekList);
	}
	let htmlString = "<table style=\"margin:auto;border: 1px solid white;\"><tbody><tr><td id=\"prevMonth\">\<\<</td><td colspan=\"5\">" + month[monthNo] + " " + new Date().getFullYear() + "</td><td id=\"nextMonth\">\>\></td></tr><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>";
	for (let week = 0; week < 6; week++) {
		htmlString += "<tr>";
		let weekList = calendarArray[week];
		for (let day = 0; day < 7; day++) {
			htmlString += "<td>" + weekList[day] + "</td>";
		}
		htmlString += "</tr>";
	}
	htmlString += "</tbody></table>";
	for (let item of DOBlist) {
		//calculate if birthday this year has passed
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????', '2020')).getMonth(), new Date(item.date.replace('????', '2020')).getDate());
		//let IsBirthdayOver = (new Date() - birthdayInYear) > 0;
		
		let DOB = '2020' + item.date.substring(4);
		let offsetMinutes = moment().utcOffset() - moment.tz(timezone).utcOffset();
		let diff = moment().diff(moment(DOB));
		let timeDiff = moment.duration(diff).subtract(offsetMinutes, 'minutes');
		let IsBirthdayOver = timeDiff.days() >= 0 && timeDiff.hours() >= 0 && timeDiff.minutes() >= 0 && timeDiff.seconds() >= 0 && timeDiff.milliseconds() >= 0;
		//console.log(item.name, timeDiff.days(), timeDiff.hours(), timeDiff.minutes(), timeDiff.seconds(), timeDiff.milliseconds());
		
		let thisAge;
		if (item.currentAge <= 1) thisAge = '??';
		else if (IsBirthdayOver) thisAge = item.currentAge - 1;
		else thisAge = item.currentAge;
		//console.log(item.name + "|" + birthdayInYear);
		if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && item.name != "Me")
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", "<td style=\"color: #00e4ff;\"><div class=\"popitem\" style=\"padding: 1px;\">" + item.name + " turns " + thisAge + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1)
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", "<br />" + item.name + " turns " + (IsBirthdayOver ? item.currentAge - 1 : item.currentAge) + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
	}
	document.getElementById("calendar").innerHTML = htmlString;
	currentMonth = monthNo;
	document.getElementById("prevMonth").style.opacity = 1;
	document.getElementById("nextMonth").style.opacity = 1;
	if (currentMonth > 0) document.getElementById("prevMonth").addEventListener("click", function() {
		createCalendar(--currentMonth, calendarDOBlist);
	});
	else document.getElementById("prevMonth").style.opacity = 0;
	if (currentMonth < 11) document.getElementById("nextMonth").addEventListener("click", function() {
		createCalendar(++currentMonth, calendarDOBlist);
	});
	else document.getElementById("nextMonth").style.opacity = 0;
	return monthNo;
}

//to shift position of knots if overlap with previous
function adjustKnots() {
	let circleList = document.getElementsByTagName("circle");
	for (let i = 0; i < circleList.length - 1; i++) {
		let oldCX = parseInt(circleList[i].getAttribute("cx"));
		if (circleList[i + 1].getAttribute("cx") - oldCX <= 20) circleList[i + 1].setAttribute("cx", oldCX + 20);
	}
}

//double click profile box go up to list of names
function addProfileBoxClick() {
	for (let profBox of document.getElementsByClassName("profile-box")) profBox.addEventListener("dblclick", function() {
		//if (window.innerWidth < 780) {
			document.getElementById("profile").style.display = 'none';
			document.getElementById("profile").innerHTML = '';
			//return;
		//}
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
		switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
		adjustThumbnailHeight(document.getElementsByClassName('thumbnail')[0]);
	});
}

//add event listener for image switch
//consider changing to detect 1st image error, move src or 2nd image up, remove 2nd image, use while loop to allow as many images but only switch 1st two images
function addProfileBoxImgOnError() {
	let profileBoxImg = document.getElementsByTagName("img");
	for (let i = 0; i < profileBoxImg.length; i++) {
		profileBoxImg[i].addEventListener("error", function() {
			if (this.nextElementSibling != null) this.nextElementSibling.style.display = "";
			if (this.nextElementSibling.nextElementSibling != null) this.nextElementSibling.nextElementSibling.style.display = "";
			this.remove();
		});
		//if (profileBoxImg[i].nextElementSibling == null && profileBoxImg[i].previousElementSibling != null)
		if (profileBoxImg[i].previousElementSibling != null)
			profileBoxImg[i].style.display = "none";

	}
};

//add event listener for image switch but through clicking on profile box
function switchProfileBoxImage() {
	let profileBoxImgList = document.getElementsByClassName("profile-box");
	for (let i = 0; i < profileBoxImgList.length; i++) {
		/* profileBoxImgList[i].addEventListener("click", function() {
			if (this.getElementsByTagName("img")[0] == null && this.getElementsByTagName("img")[1] == null) return;
			if (this.getElementsByTagName("img")[1] == null) return;
			
			for(let image of this.getElementsByTagName("img"))
			{
				if(image != null) image.style.display = image.style.display == "" ? "none" : "";
			}
			
			if(document.getElementsByClassName('profile-box-img')[0].offsetHeight > 325)
			{
				for(let image of this.getElementsByTagName("img"))
				{
					if(image != null) image.style.display = image.style.display == "" ? "none" : "";
				}
			}
		});*/
		
		profileBoxImgList[i].addEventListener("click", function() {
			let boxImg = this.getElementsByClassName('profile-box-img')[0];
			if(boxImg.style.backgroundImage == boxImg.getAttribute('alt')) return;
			let temp = boxImg.getAttribute('alt');//boxImg.style.backgroundImage;
			boxImg.setAttribute('alt', boxImg.style.backgroundImage);
			boxImg.style.backgroundImage = temp;
			if(temp.split('url(').length - 1 > 1) 
			{
				boxImg.style.backgroundRepeat = 'no-repeat';
				if(window.innerWidth > 640) 
				{
					boxImg.style.backgroundSize = '25%, 25%';
					//boxImg.style.backgroundSize = '320px, 320px';
					boxImg.style.backgroundPosition = 'left, right';
				}
				if(window.innerWidth <= 640) 
				{
					boxImg.style.backgroundSize = 'auto 50%, auto 50%';
					boxImg.style.backgroundPosition = 'top, bottom';
				}
			}
			else
			{
				boxImg.style.backgroundSize = 'contain';
				boxImg.style.backgroundRepeat = 'no-repeat';
				boxImg.style.backgroundPosition = 'center';
			}
		});
	} 
}

//allow reload in case of initial fail, on slower networks
function reloadImages() {
	let profileBoxImg = document.getElementsByTagName("img");
	for (let image of profileBoxImg) {
		if (image.alt != '')
		{
			image.src = image.alt;
			image.removeAttribute('alt');
		}
	}
	for (let i = 0; i < profileBoxImg.length; i++) {
		if (profileBoxImg[i].complete) {
			resizeProfileBoxImg(profileBoxImg[i]);
			loadedImages++;
		}
	}

	if (loadedImages != profileBoxImg.length) setTimeout(reloadImages, 200);
	else resizeAllProfileBoxImg();

}

//resize images on load
function resizeAllProfileBoxImg() {
	loadedImages = 0;
	for(let image of document.getElementsByTagName('img'))
	{
		resizeProfileBoxImg(image);
	}
	
	adjustThumbnailHeight(document.getElementsByClassName('thumbnail')[0]);
}

function resizeProfileBoxImg(image) {
	let isPortrait = image.height >= image.width;
	image.style.height = "320px";
	if (window.outerWidth < 640) {
		if (!isPortrait) {
			image.style.height = "";
			image.style.maxHeight = "100%";
			image.style.maxWidth = "95%";
		}
	}
}

function openLinksInNew() {
	for(let comments of document.getElementsByClassName('profile-box-comments'))
	{
		for(let link of comments.getElementsByTagName('a'))
		{
			let url = link.href;
			if(!isExternal && url.includes('knwebreports.blogspot')) continue;
			link.href = 'javascript:void(0)';
			link.addEventListener('click', function () { window.open(url, '_blank'); } );
		}
	}
}

function checkDuplicateImages() {
	for(let profile of profileList)
	{
		let duplicates = checkDuplicates(profile.images);
		if(duplicates.length > 0)
			console.log(profile.id, duplicates);
	}
}

function checkDuplicates(array) {
	let duplicates = [];
	let uniqueIndexes = array.filter((item, index) => array.indexOf(item) == index).map((item, index) => index);
	return array.filter((item, index) => uniqueIndexes.indexOf(index) < 0);
}