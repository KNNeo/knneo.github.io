//show checkbox on hover on wanted list
document.getElementById("marriedCouple").addEventListener("mouseover", function () { document.getElementById("isMarried").style.visibility = "visible"; });
document.getElementById("marriedCouple").addEventListener("mouseout", function () { document.getElementById("isMarried").style.visibility = "hidden"; });
document.getElementById("isMarried").style.visibility = "hidden";

//on load create timeline using timeknots.js
//window.onload = startWantedList();
//on load create calendar
var calendarDOBlist = createDOBlist(0,50);
var currentMonth = createCalendar(new Date().getMonth(), calendarDOBlist);
var DOBlist = createDOBlist(1,35);
function startWantedList() {
	generateWantedList(false);
	DOBlist = createDOBlist(1,35)
    TimeKnots.draw("#timeline", DOBlist, {
        horizontalLayout: true,
        width: 5000,
        height: 100,
        dateFormat: "%Y.%m.%d",
        showLabels: true,
        labelFormat: "%Y"
    });
	calendarDOBlist = createDOBlist(0,50);
	currentMonth = createCalendar(new Date().getMonth(), calendarDOBlist);
    adjustKnots();
	addProfileBoxClick();
	addStatusPopUp();
	censorData(); //ONLY FOR GITHUB
    reloadImages();
    batchResizeProfileBoxImg();
    switchProfileBoxImage();
    if(loadedImages != document.getElementsByTagName("img").length) setTimeout( function() {reloadImages();}, 1000);
}

//on scroll turn off all overlays in timeline and calendar
window.addEventListener("scroll", function() {
	if(document.getElementById("timeline").getElementsByTagName("div").length > 0)
		document.getElementById("timeline").getElementsByTagName("div")[0].style.opacity = "0";
    //document.getElementById("calendar").getElementsByTagName("div")[0].style.display = "none";
});

//add age after DOB
for (var dateOfBirth of document.getElementsByClassName("DOB")) {
    var age = parseInt(getAge(dateOfBirth .innerHTML));
    if (age != undefined && age > 0) dateOfBirth.innerHTML = dateOfBirth.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
}

function getAge(DOB) {
    var birthDateStr = DOB.replace(".", "-");;
    var birthDate = Date.parse(birthDateStr.replace(".", "-").substring(0, 10));
    return Math.floor((new Date().getTime() - birthDate) / 31556952000);
}

//generate wanted list
function generateWantedList(excludeMarried) {
var wantedListString = "";

//create name array from static profile boxes
var profileNames = document.getElementsByClassName("profile-name");
var profileNamesList = new Array();
for(var profileName of profileNames)
{
 if(excludeMarried && profileName.parentElement.parentElement.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.innerText.replace(/\*/g,"").endsWith("Yes")) continue;
profileNamesList.push(profileName.innerText);
}
profileNamesList.sort();

//create wanted list from list of names
for(var profileName of profileNamesList)
{
 wantedListString += "<li><a>" + profileName + "</a></li>";
}
document.getElementById("wantedList").innerHTML = wantedListString;

//wanted list processing
for(var id = 0; id < document.getElementById("wantedList").getElementsByTagName("a").length; id++)
{
let boxString = document.getElementById("wantedList").getElementsByTagName("a")[id].innerText.replace(" ","");
document.getElementById("wantedList").getElementsByTagName("a")[id].addEventListener("click", function() { document.getElementById(boxString).scrollIntoView(); });
}
}

//on timeline double click shrink timeline
document.getElementById("timeline").addEventListener("dblclick", function() {
    var origWidth = document.getElementById("timeline").getElementsByTagName("svg")[0].width.baseVal.value / 2;
    document.getElementById("timeline").innerHTML = "";
    if (origWidth < 1000)
        TimeKnots.draw("#timeline", DOBlist, {
            horizontalLayout: true,
            width: 1000,
            height: 100,
            dateFormat: "%Y.%m.%d",
            showLabels: true,
            labelFormat: "%Y"
        });
    else
        TimeKnots.draw("#timeline", DOBlist, {
            horizontalLayout: true,
            width: origWidth,
            height: 100,
            dateFormat: "%Y.%m.%d",
            showLabels: true,
            labelFormat: "%Y"
        });
    adjustKnots();
});

//on timeline wheel scroll adjust timeline length ie. redraw
document.getElementById("timeline").addEventListener("wheel", function(e) {
    e.preventDefault();
    if(!e.shiftKey){ document.getElementById('timeline').scrollLeft -= e.wheelDelta/2; return; }
    var origWidth = document.getElementById("timeline").getElementsByTagName("svg")[0].width.baseVal.value + e.wheelDelta;
    document.getElementById("timeline").innerHTML = "";
    if (origWidth >= 1000 && origWidth <= 10000)
        TimeKnots.draw("#timeline", DOBlist, {
            horizontalLayout: true,
            width: origWidth,
            height: 100,
            dateFormat: "%Y.%m.%d",
            showLabels: true,
            labelFormat: "%Y"
        });
    else if (origWidth < 1000)
        TimeKnots.draw("#timeline", DOBlist, {
            horizontalLayout: true,
            width: 1000,
            height: 100,
            dateFormat: "%Y.%m.%d",
            showLabels: true,
            labelFormat: "%Y"
        });
    else if (origWidth > 10000)
        TimeKnots.draw("#timeline", DOBlist, {
            horizontalLayout: true,
            width: 10000,
            height: 100,
            dateFormat: "%Y.%m.%d",
            showLabels: true,
            labelFormat: "%Y"
        });
    adjustKnots();
});

//write pop up into HTML to explain status of wanted list profile
var statusPopup = "<div id=\"tp-description\">As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism)</div>";
function addStatusPopUp() {
  for (var statusPopOut of document.getElementsByClassName("turning-point")) {
  statusPopOut.addEventListener("mouseover", function(d) {
      d.target.innerHTML = statusPopup + d.target.innerHTML;
  });
  statusPopOut.addEventListener("mouseout", function() { if(document.getElementById("tp-description") != null) document.getElementById("tp-description").remove(); });
  }
  document.addEventListener("touchmove", function() { if(document.getElementById("tp-description") != null) document.getElementById("tp-description").remove(); });
}
//functions//

//create array of objects with DOB info, parameter: age (range inclusive)
function createDOBlist(minAge, maxAge) {
var listOfDOB = new Array();
listOfDOB.push({
    date: "1993-02-19",
    name: "Me"
});
for (var wanted of document.getElementById("wantedList").getElementsByTagName("a")) {
    var targetId = wanted.innerText;
    var targetDOB = document.getElementById(targetId.replace(" ", "")).getElementsByClassName("DOB");
    if (targetDOB.length > 0) {
        var birthDate = new Date(Date.parse(targetDOB[0].innerText.replace(".", "-").replace(".", "-").substring(0, 10)));
        var age = targetDOB[0].innerText.includes('?') ? 0 : parseInt(getAge(targetDOB[0].innerText))+1;
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

function toggleMarried(){
//create DOB list must be changed to accept new flag, if checkbox true then remove all entries where married is true
//currently not working because createDOBlist has to read text on a tags in wanted list which is all uppercase not same as div id
//cause: css renders after js so results is always uppercase
//solution: set uppercase via js, undo when have to generate list again, or if have alternative (modularise generate wantedlist)

var excludeMarried = document.getElementById("marriedCheckbox").checked == true;
generateWantedList(excludeMarried);

DOBlist = createDOBlist(1,35);
document.getElementById("timeline").innerHTML = "";
TimeKnots.draw("#timeline", DOBlist, {
        horizontalLayout: true,
        width: 5000,
        height: 100,
        dateFormat: "%Y.%m.%d",
        showLabels: true,
        labelFormat: "%Y"
    });
    adjustKnots();
}

//generate calendar from profile boxes
function createCalendar(monthNo, DOBlist) {
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var calendarArray = new Array();
    var dayOfMonth = 1;
    for (var week = 0; week < 6; week++) {
        var weekList = ['', '', '', '', '', '', ''];
        for (var day = 0; day < 7; day++) {
            if (new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDay() == day) {
                //add to array
                if (dayOfMonth > new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDate()) break;
                weekList[day] = dayOfMonth;
                dayOfMonth++;
            }
        }
        calendarArray.push(weekList);
    }
    var htmlString = "<table style=\"margin:auto;border: 1px solid white;\"><tbody><tr><td id=\"prevMonth\">\<\<</td><td colspan=\"5\">" + month[monthNo] + " " + new Date().getFullYear() + "</td><td id=\"nextMonth\">\>\></td></tr><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>";
    for (var week = 0; week < 6; week++) {
        htmlString += "<tr>";
        var weekList = calendarArray[week];
        for (var day = 0; day < 7; day++) {
            htmlString += "<td>" + weekList[day] + "</td>";
        }
        htmlString += "</tr>";
    }
    htmlString += "</tbody></table>";
    for (var item of DOBlist) {
        var birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????','2020')).getMonth(), new Date(item.date.replace('????','2020')).getDate());
        var IsBirthdayOver = (new Date() - birthdayInYear) > 0;
        let thisAge;
        if(item.currentAge <= 1) thisAge = '??';
        else if(IsBirthdayOver) thisAge = item.currentAge - 1;
        else thisAge = item.currentAge;
        //console.log(item.name + "|" + birthdayInYear);
        if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && item.name != "Me")
            htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", "<td style=\"color: #00e4ff;\"><div class=\"popitem\" style=\"padding: 1px;\">" + item.name + " turns " + thisAge + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
            else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1)
                htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", "<br />" + item.name + " turns " + (IsBirthdayOver ? item.currentAge-1 : item.currentAge) + "! (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
    }    document.getElementById("calendar").innerHTML = htmlString;
    /*document.getElementById("calendar").addEventListener("mouseover", function(event) {
        if (event.target.style.color == "rgb(0, 228, 255)") event.target.getElementsByClassName("popitem")[0].style.display = "block";
        else {
            for (var display of document.getElementById("calendar").getElementsByClassName("popitem")) display.style.display = "none";
        }
    });*/
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
    var circleList = document.getElementsByTagName("circle");
    for (var i = 0; i < circleList.length - 1; i++) {
        var oldCX = parseInt(circleList[i].getAttribute("cx"));
        if (circleList[i + 1].getAttribute("cx") - oldCX <= 20) circleList[i + 1].setAttribute("cx", oldCX + 20);
    }
}

//double click profile box go up to list of names
function addProfileBoxClick() {
for (var profBox of document.getElementsByClassName("profile-box")) profBox.addEventListener("dblclick", function() {
    if (window.innerWidth < 780) {
        document.getElementById("marriedCouple").scrollIntoView();
        return;
    }
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
}

var loadedImages = 0;
//add event listener for image switch
function batchResizeProfileBoxImg() {
var animeImgList = document.getElementsByTagName("img");
for (var i = 0; i < animeImgList.length; i++) {
        animeImgList[i].addEventListener("error", function() {
            if(this.nextElementSibling != null) this.nextElementSibling.style.display = "";
            this.remove();
        });
        /*animeImgList[i].addEventListener("click", function() {
            if(this.nextElementSibling == null && this.previousElementSibling == null) return;
            if(this.style.display == "") this.style.display = "none"; else this.style.display = "";
            if(this.nextElementSibling != null) this.nextElementSibling.style.display = this.nextElementSibling.style.display == "" ? "none" : "";
            if(this.previousElementSibling != null) this.previousElementSibling .style.display = this.previousElementSibling .style.display == "" ? "none" : "";
        });*/
    if(animeImgList[i].nextElementSibling == null && animeImgList[i].previousElementSibling != null) animeImgList[i].style.display = "none";
    
}
};

//add event listener for image switch but through clicking on profile box
function switchProfileBoxImage() {
var profileBoxImgList = document.getElementsByClassName("profile-box");
for (var i = 0; i < profileBoxImgList.length; i++) {
        profileBoxImgList[i].addEventListener("click", function() {
            if(this.getElementsByTagName("img")[0] == null && this.getElementsByTagName("img")[1] == null) return;
if(this.getElementsByTagName("img")[1] == null) return;
            if(this.getElementsByTagName("img")[0] != null) this.getElementsByTagName("img")[0].style.display = this.getElementsByTagName("img")[0].style.display == "" ? "none" : "";
            if(this.getElementsByTagName("img")[1] != null) this.getElementsByTagName("img")[1].style.display = this.getElementsByTagName("img")[1].style.display == "" ? "none" : "";
        });
}
}

function reloadImages() {
var animeImgList = document.getElementsByTagName("img");
for(var image of animeImgList)
{
 if(image.alt != '')
  image.src = image.alt;
 image.removeAttribute('alt');
}
for (var i = 0; i < animeImgList.length; i++) {
if(animeImgList[i].complete) 
{
resizeProfileBoxImg(animeImgList[i]);
loadedImages++;
}
}
if(loadedImages != animeImgList.length) setTimeout(reloadImages, 300);
}

//resize images on load
function resizeProfileBoxImg(dis) {
    var isPortrait = dis.height >= dis.width;
    dis.style.height = "320px";
    if (window.innerWidth < 485) {
        if (!isPortrait) {
            dis.style.height = "";
            dis.style.maxHeight = "100%";
            dis.style.maxWidth = "320px";
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