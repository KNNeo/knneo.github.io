//Multi-image thumbnail: Define caption height, onclick event
function setThumbnails() {
    let allThumbnails = document.body.getElementsByClassName("thumbnail");
    for (let i = 0; i < allThumbnails.length; i++) {
        let initialHeight = allThumbnails[i].getElementsByClassName('thumbnail-initial')[0].offsetHeight;
        let popHeight = allThumbnails[i].getElementsByClassName('thumbnail-pop')[0].offsetHeight;
        allThumbnails[i].style.height = Math.max(initialHeight, popHeight) + 'px';
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[0].addEventListener('click', function() {
			//switchThumbnails(closestClass(this, "thumbnail"));
			//setTimeout(switchThumbnails(this.parentElement.parentElement), 200);
		});
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[1].addEventListener('click', function() {
			//switchThumbnails(closestClass(this, "thumbnail"));
			//setTimeout(switchThumbnails(this.parentElement.parentElement), 200);
		});
		//document.getElementById('isMarried').style.visibility = 'hidden';
    }
}

function closestClass(inputElement, targetClassName) {
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

	document.documentElement.scrollTop = 0;
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

//prevent right click on images
document.getElementById('profile').addEventListener("contextmenu", function(e) {
	e.preventDefault();
});

//--variables--//
let myDOB = '1993-02-19'; // format: yyyy-MM-dd
let loadedImages = 0;
let timelineDOBlist = [];
let calendarDOBlist = [];
let currentMonth = 0;
let statusPopup = "<div id=\"tp-description\">As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism?)</div>";
let friendMode = false;
let excludeMarried = false;
let timezone = "Asia/Tokyo";
let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let DateTime = luxon.DateTime;

//--dependent on render, as functions to call on render--//
function renderWantedList() {
	//toggleInitialThumbnailLayout();
	generateWantedList();
	timelineDOBlist = createDOBlist(profileList, 1, 35);
	loadTimeline(2500);
	calendarDOBlist = createDOBlist(profileList, 0, 50);
	calendarDOBlist = calendarDOBlist.concat(createDOBlist(birthdayListJson, 0, 50));
	currentMonth = createCalendar(DateTime.fromISO(DateTime.now(), {zone: timezone}).month-1, calendarDOBlist);
	addCalendarLegend();
	setThumbnails();
	// addStatusPopUps();
	initialiseTime();
	friendCheck();
}

function initialiseTime() {
	updateTime();
	setTimeout(updateTime, 1000);
}

function updateTime() {
	// let offsetMinutes = moment().utcOffset() - moment.tz(timezone).utcOffset();
	// document.getElementById('time').innerText = moment().subtract(offsetMinutes, 'minutes').format("yyyy.MM.DD HH:mm:ss");
	var now = DateTime.local().setZone(timezone);
	document.getElementById('time').innerText = now.toFormat("yyyy.MM.dd HH:mm:ss");
	
	setTimeout(updateTime, 1000);
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
	openCommentLinksInNew();
	//invertCensor();
	if(isExternal) censorData(); //ONLY FOR GITHUB
	setTimeout(reloadImages, 300);
}

//--functions--//
function daysFromMe() {
	let me = timelineDOBlist.filter(t => t.name == "Me")[0];
	let others = timelineDOBlist.filter(t => t.name != "Me");
	console.log('with respect to ' + me.date + ':');
	let awway = new Array();
	for(let other of others)
	{
		if(other.date.includes('????')) continue;
		let DOB = other.date;
		let myDateStr = me.date.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
		let myDate = myDateStr.substring(0, 10);
		let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
		let birthDate = birthDateStr.substring(0, 10);
		//return Math.floor((new Date().getTime() - birthDate) / 31556952000);
		// let offsetMinutes = moment().utcOffset() - moment.tz(timezone).utcOffset();
		let diff = DateTime.fromISO(myDate).setZone(timezone).diff(DateTime.fromISO(birthDate), 'days').days;
		awway.push({
			name: other.name,
			daysAway: Math.abs(diff) // Math.abs(Math.round(moment.duration(diff).subtract(offsetMinutes, 'minutes').asDays(),0))
			});
	}
	
	console.log(awway.sort((a,b) => a.daysAway - b.daysAway));
}

//add age after DOB span
function addAgeAfterDOB() {
	if(document.getElementById('profile').classList.contains('friend-mode')) return;
	let profile = profileList.filter(p => p.id === document.getElementById('profile').firstChild.id)[0];
	let DOBspan = document.getElementById(profile.id).getElementsByClassName('DOB')[0];
	let age = profile.dob.includes('????') ? 0 : parseInt(getAge(profile.dob));
	//if(checkBirthdayPassed(profile.dob)) age++;
	if (age != undefined && age > 0)
		DOBspan.innerHTML = DOBspan.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
}

function getAge(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone}); // birthDateStr.substring(0, 10);
	let today = DateTime.fromISO(DateTime.now(), {zone: timezone});
	// console.log(today.diff(birthDate, ['years','months','days','hours','minutes','seconds']));
	return today.diff(birthDate, 'years').years;
}

function checkBirthdayPassed(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone}); 
	let today = DateTime.fromISO(DateTime.now(), {zone: timezone});
	return today.diff(birthDate, 'days').days >= 0;
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
		if (excludeMarried && processTurningPoint(profileName.turningPoint.isMarried, true)) continue;
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
			//document.documentElement.scrollTop = 0;
			document.getElementById('profile').scrollIntoView();
			//if(!smallScreen) switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
		});
		wantedList.getElementsByTagName("a")[id].addEventListener("contextmenu", function(e) {
			e.preventDefault();
			isExternal = !isExternal;
			generateProfileFromJSON(this.innerText.replace(" ", ""));
			renderProfileBox();
			generateWantedList(this);
			//document.documentElement.scrollTop = 0;
			document.getElementById('profile').scrollIntoView();
			//if(!smallScreen) switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
			isExternal = !isExternal;
		}, false);
	}
}

function addStatusPopUp() {
	if(statusPopup == '') return;
	if(document.getElementsByClassName("turning-point").length < 1) return;
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
function createDOBlist(list, minAge, maxAge) {
	let listOfDOB = new Array();
	if(defaultProfile) {
		listOfDOB.push({
			category: defaultProfile.category,
			date: defaultProfile.dob.replace(".", "-").replace(".", "-").substring(0, 10),
			name: defaultProfile.name
		});
	}
	for(let profile of list) {
		let targetDOB = profile.dob; //document.getElementById(targetId.replace(" ", "")).getElementsByClassName("DOB");
		if (targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB.replace(".", "-").replace(".", "-").substring(0, 10)));
			let age = targetDOB.includes('?') ? 0 : parseInt(getAge(targetDOB));
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				listOfDOB.push({
					category: profile.category,
					date: targetDOB.replace(".", "-").replace(".", "-").substring(0, 10),
					name: profile.name,
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
	timelineDOBlist = createDOBlist(profileList, 1, 35);
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
	// render days of month as fixed array
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
	
	let htmlString = "<table><tbody><tr><td>" + 
	(monthNo+1 > 1 ? "<i id=\"prevMonth\" class=\"bi bi-arrow-left\"></i>" : "") + 
	"</td><td colspan=\"5\">" + 
	month[monthNo] + " " + new Date().getFullYear() + 
	"</td><td>" + 
	(monthNo+1 < 12 ? "<i id=\"nextMonth\" class=\"bi bi-arrow-right\"></i>" : "") + 
	"</td></tr><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>";
	
	// render array as table
	for (let week = 0; week < 6; week++) {
		htmlString += "<tr>";
		let weekList = calendarArray[week];
		for (let day = 0; day < 7; day++) {
			htmlString += "<td>" + weekList[day] + "</td>";
		}
		htmlString += "</tr>";
	}
	htmlString += "</tbody></table>";
	
	// replace cells in table with relevant dates
	for (let item of DOBlist) {
		//calculate if birthday this year has passed
		let currentYear = new Date().getFullYear();
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????', currentYear)).getMonth(), new Date(item.date.replace('????', currentYear)).getDate());
		
		let DOB = currentYear + item.date.substring(4);
		// let offsetMinutes = moment().utcOffset() - moment.tz(timezone).utcOffset();
		// let difference = moment().diff(moment(DOB));
		// let timeDiff = moment.duration(difference).subtract(offsetMinutes, 'minutes');
		let IsBirthdayOver = checkBirthdayPassed(DOB);
		// console.log(item.name, timeDiff.days(), timeDiff.hours(), timeDiff.minutes(), timeDiff.seconds(), timeDiff.milliseconds());
		
		let thisAge;
		if (item.currentAge <= 1) thisAge = '??';
		else if (IsBirthdayOver) thisAge = item.currentAge;
		else thisAge = item.currentAge + 1;
		// console.log(item.name + "|" + item.currentAge);
		if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //if no age
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + setCalendarColour(item.category) + "; color: black;\"><div class=\"popitem\">Happy Birthday <b>" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //normal
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + setCalendarColour(item.category) + "; color: black;\"><div class=\"popitem\"><b>" + item.name + "</b> turns " + thisAge + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");	
		else if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs, if no age
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br />Happy Birthday <b>" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br /><b>" + item.name + "</b> turns " + thisAge + "</b> (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
	}
	
	document.getElementById("calendar").innerHTML = htmlString;
	// document.getElementById("prevMonth").style.opacity = 1;
	// document.getElementById("nextMonth").style.opacity = 1;
	
	//global variable for month navigation
	//events for month buttons
	currentMonth = monthNo;
	if (currentMonth > 0) document.getElementById("prevMonth").addEventListener("click", function() {
		createCalendar(--currentMonth, calendarDOBlist);
	});
	// else document.getElementById("prevMonth").style.opacity = 0;
	if (currentMonth < 11) document.getElementById("nextMonth").addEventListener("click", function() {
		createCalendar(++currentMonth, calendarDOBlist);
	});
	// else document.getElementById("nextMonth").style.opacity = 0;
	return monthNo;
}

function setCalendarColour(categoryId) {
	//default list always first, so overlap is default color
	switch(categoryId) {
		case 'alterna':
			return 'pink';
		case 'doaxvv':
			return 'lime';
		case 'vtuber':
			return 'gold';
		default:
			return 'cyan';
	}
}

function addCalendarLegend() {
	let categories = ['alterna','doaxvv','seiyuu','vtuber'];
	let calendarLegend = document.getElementById('calendar-legend');
	calendarLegend.innerHTML = '';
	for(let category of categories) {		
		let id = 'label-' + category;
		let label = document.createElement('label');
		
			let legend = document.createElement('input');
			legend.id = id;
			legend.type = 'checkbox';
			legend.name = category;
			legend.checked = true;
			label.appendChild(legend);
			
			let box = document.createElement('span');
			box.classList.add('legend');
			box.style.backgroundColor = setCalendarColour(category.toLowerCase());
			label.appendChild(box);
					
			let description = document.createElement('span');
			description.style.padding = '0 5px';
			description.title = category;
			description.addEventListener('click',toggleCalendarLegend);
			description.innerText = category.substring(0,1).toUpperCase() + category.substring(1);
			label.appendChild(description);
		
		calendarLegend.appendChild(label);
	}
}

function toggleCalendarLegend() {
	this.previousElementSibling.style.backgroundColor = this.previousElementSibling.previousElementSibling.checked ? 'transparent' :setCalendarColour(this.title.toLowerCase());
	setTimeout(function() {
		filterCalendar();
		createCalendar(DateTime.fromISO(DateTime.now(), {zone: timezone}).month-1, calendarDOBlist);
	}, 10);
}

function filterCalendar() {
	let checkedCategories = Array.from(document.getElementById('calendar-legend').getElementsByTagName('input')).filter(i => i.checked == true).map(i => i.name);
	calendarDOBlist = createDOBlist(profileList, 0, 50);
	calendarDOBlist = calendarDOBlist.concat(createDOBlist(birthdayListJson, 0, 50));
	calendarDOBlist = calendarDOBlist.filter(c => c.name != 'Me' && 
	(checkedCategories.indexOf(c.category) >= 0 || 
	(checkedCategories.indexOf('seiyuu') >= 0 && c.category.startsWith('seiyuu')))
	);
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
		//switchThumbnails(document.getElementsByClassName('thumbnail')[0]);
		//adjustThumbnailHeight(document.getElementsByClassName('thumbnail')[0]);
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
				boxImg.style.backgroundSize = '50% auto';
				boxImg.style.backgroundPosition = 'left, right';
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
	
	//adjustThumbnailHeight(document.getElementsByClassName('thumbnail')[0]);
}

function resizeProfileBoxImg(image) {
	let isPortrait = image.height >= image.width;
	image.style.height = "320px";
	if (smallScreen && !isPortrait) {
		image.style.height = "";
		image.style.maxHeight = "100%";
		image.style.maxWidth = "95%";
	}
}

function openCommentLinksInNew() {
	for(let comments of document.getElementsByClassName('profile-box-comments'))
	{
		for(let link of comments.getElementsByTagName('a'))
		{
			let url = link.href;
			if(!isExternal && url.includes('knwebreports.blogspot')) continue;
			if(url.includes('knneo.github.io')) continue;
			link.href = 'javascript:void(0)';
			link.addEventListener('click', function () { window.open(url, '_blank'); } );
		}
	}
}

function checkDuplicateImages() {
	for(let profile of profileList)
	{
		let duplicates = duplicates(profile.landscapes.concat(profile.portraits));
		if(duplicates.length > 0)
			console.log(profile.id, duplicates);
	}
}

function duplicates(array) {
	let duplicates = [];
	let uniqueIndexes = array.filter((item, index) => array.indexOf(item) == index).map((item, index) => index);
	return array.filter((item, index) => uniqueIndexes.indexOf(index) < 0);
}