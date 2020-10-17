//--not dependent on render--//
function navigateToProfile(e) {
}

//show checkbox on hover on wanted list
document.getElementById("marriedCouple").addEventListener("mouseover", function() {
	document.getElementById("isMarried").style.visibility = "visible";
});
document.getElementById("marriedCouple").addEventListener("mouseout", function() {
	document.getElementById("isMarried").style.visibility = "hidden";
});

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
let statusPopup = "<div id=\"tp-description\">As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism)</div>";
let timezone = "Asia/Tokyo";
let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

//--dependent on render, as functions to call on render--//
function renderWantedList() {
	//reloadImages();
	resizeAllProfileBoxImg();
	generateWantedList(false);
	timelineDOBlist = createDOBlist(1, 35);
	loadTimeline(5000);
	calendarDOBlist = createDOBlist(0, 50);
	currentMonth = createCalendar(new Date().getMonth(), calendarDOBlist);
	addProfileBoxClick();
	addProfileBoxImgOnError();
	switchProfileBoxImage();
	addAgeAfterDOB();
	addStatusPopUp();
	openLinksInNew();
	if(isExternal) censorData(); //ONLY FOR GITHUB
	if (loadedImages != document.getElementsByTagName("img").length) setTimeout(function() {
		reloadImages();
	}, 1000);
}

//--functions--//
//add age after DOB span
function addAgeAfterDOB() {
	for (let dateOfBirth of document.getElementsByClassName("DOB")) {
		let age = dateOfBirth.innerText.includes('????') ? 0 : parseInt(getAge(dateOfBirth.innerText));
		if (age != undefined && age > 0)
			dateOfBirth.innerHTML = dateOfBirth.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
	}
}

function getAge(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = Date.parse(birthDateStr.substring(0, 10));
	//return Math.floor((new Date().getTime() - birthDate) / 31556952000);
	let diff = moment().tz(timezone).diff(moment.tz(birthDate, timezone));
	return moment.duration(diff).years();
}

//generate wanted list
function generateWantedList(excludeMarried) {
	let wantedListString = "";
	let wantedList = document.getElementById("wantedList");

	//create name array from static profile boxes
	let profileNamesList = new Array();
	for (let profileName of profileList) {
		if (excludeMarried && profileName.turningPoint.isMarried) continue;
		profileNamesList.push(profileName.name);
	}
	profileNamesList.sort();

	//create wanted list from list of names
	for (let profileName of profileNamesList) {
		wantedListString += "<li><a>" + profileName + "</a></li>";
	}
	wantedList.innerHTML = wantedListString;

	//wanted list processing
	for (let id = 0; id < wantedList.getElementsByTagName("a").length; id++) {
		let boxString = wantedList.getElementsByTagName("a")[id].innerText.replace(" ", "");
		wantedList.getElementsByTagName("a")[id].addEventListener("click", function() {
			document.getElementById(boxString).scrollIntoView();
		});
	}
}

function addStatusPopUp() {
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
	for (let wanted of document.getElementById("wantedList").getElementsByTagName("a")) {
		let targetId = wanted.innerText;
		let targetDOB = document.getElementById(targetId.replace(" ", "")).getElementsByClassName("DOB");
		if (targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB[0].innerText.replace(".", "-").replace(".", "-").substring(0, 10)));
			let age = targetDOB[0].innerText.includes('?') ? 0 : parseInt(getAge(targetDOB[0].innerText)) + 1;
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				listOfDOB.push({
					date: targetDOB[0].innerText.replace(".", "-").replace(".", "-").substring(0, 10),
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
	generateWantedList(document.getElementById("marriedCheckbox").checked);
	timelineDOBlist = createDOBlist(1, 35);
	document.getElementById("timeline").innerHTML = "";
	loadTimeline(5000);
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
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????', '2020')).getMonth(), new Date(item.date.replace('????', '2020')).getDate());
		let IsBirthdayOver = (new Date() - birthdayInYear) > 0;
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
		if (window.innerWidth < 780) {
			document.getElementById("marriedCouple").scrollIntoView();
			return;
		}
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	});
}

//add event listener for image switch
function addProfileBoxImgOnError() {
	let profileBoxImg = document.getElementsByTagName("img");
	for (let i = 0; i < profileBoxImg.length; i++) {
		profileBoxImg[i].addEventListener("error", function() {
			if (this.nextElementSibling != null) this.nextElementSibling.style.display = "";
			this.remove();
		});
		if (profileBoxImg[i].nextElementSibling == null && profileBoxImg[i].previousElementSibling != null)
			profileBoxImg[i].style.display = "none";

	}
};

//add event listener for image switch but through clicking on profile box
function switchProfileBoxImage() {
	let profileBoxImgList = document.getElementsByClassName("profile-box");
	for (let i = 0; i < profileBoxImgList.length; i++) {
		profileBoxImgList[i].addEventListener("click", function() {
			if (this.getElementsByTagName("img")[0] == null && this.getElementsByTagName("img")[1] == null) return;
			if (this.getElementsByTagName("img")[1] == null) return;
			if (this.getElementsByTagName("img")[0] != null) this.getElementsByTagName("img")[0].style.display = this.getElementsByTagName("img")[0].style.display == "" ? "none" : "";
			if (this.getElementsByTagName("img")[1] != null) this.getElementsByTagName("img")[1].style.display = this.getElementsByTagName("img")[1].style.display == "" ? "none" : "";
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
	if (loadedImages != profileBoxImg.length) setTimeout(reloadImages, 300);
}

//resize images on load
function resizeAllProfileBoxImg() {
	for(let image of document.getElementsByTagName('img'))
	{
		resizeProfileBoxImg(image);
	}
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

//generate wanted list array from html
//exception to note from export: (1) nagae rika add dob and dob comment, (2) horie yui dob censor year, comment include fake getAge string
/*function generateWantedListArray() {
	let array = new Array();
	for(let category of document.getElementsByClassName('profile-category'))
	{
		for(let box of category.getElementsByClassName('profile-box'))
		{
			let dobStr = box.getElementsByClassName('DOB').length > 0 ? box.getElementsByClassName('DOB')[0].innerText : '';
            let nicknameStr = box.getElementsByClassName('profile-name')[0].parentElement.outerText;
          	let newBox = box.cloneNode(true);
          	newBox.getElementsByTagName('table')[0].remove();
            let turningPoints = box.getElementsByTagName('td')[7].innerText.replace('*','').replace('*','').replace('*','').replace('*','').split('|');
          	let imgArray = new Array();
	        imgArray.push(box.getElementsByTagName('img')[0].src);
          	if(box.getElementsByTagName('img').length > 1) imgArray.push(box.getElementsByTagName('img')[1].src);
          	let commentsArray = new Array();
          	if(newBox.outerText.includes('(*'))
              commentsArray.push(newBox.outerText.substring(newBox.outerText.indexOf('(*')).substring(1,newBox.outerText.substring(newBox.outerText.indexOf('(*')).indexOf(')')));
          	if(newBox.outerText.includes('(**'))
              commentsArray.push(newBox.outerText.substring(newBox.outerText.indexOf('(**')).substring(1,newBox.outerText.substring(newBox.outerText.indexOf('(**')).indexOf(')')));
          	if(newBox.outerText.includes('(***'))
              commentsArray.push(newBox.outerText.substring(newBox.outerText.indexOf('(***')).substring(1,newBox.outerText.substring(newBox.outerText.indexOf('(***')).indexOf(')')));
			let boxElement = {
				category: category.id,
				id: box.getElementsByClassName('profile-name')[0].innerText.replace(' ',''),
				images: imgArray,
				name: box.getElementsByClassName('profile-name')[0].innerText,
				nickname: nicknameStr.substring(nicknameStr.indexOf('(')+1,nicknameStr.indexOf(')')),
				dob: dobStr.substring(0,10),
				dobComment: dobStr.includes('(') ? dobStr.substring(12, dobStr.indexOf(')')) : '',
				profile: box.getElementsByTagName('td')[5].innerText,
				turningPoint: { singerDebut: turningPoints[0] == 'Yes', swimsuitPhotobook: turningPoints[1] == 'Yes', isMarried: turningPoints[2] == 'Yes' },
				intro: box.getElementsByTagName('td')[9].innerText,
				description: box.getElementsByTagName('td')[11].innerText,
				wantedLevel: box.getElementsByTagName('td')[13].innerText.substring(0,5),
				wantedLevelComment: box.getElementsByTagName('td')[13].innerText.substring(7).replace(')',''),
				comments: commentsArray
			};
          	array.push(boxElement);
		}
	}
	return array;
}*/