var datesOfBirth = document.getElementsByClassName("DOB");
var years = 1000 * 60 * 60 * 24 * 365;
for (var i = 0; i < datesOfBirth.length; i++) {
    var age = parseInt(getAge(datesOfBirth[i].innerHTML));
    if (age > 0) datesOfBirth[i].innerHTML = datesOfBirth[i].innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
}

function getAge(DOB) {
    var birthDateStr = DOB.replace(".", "-");;
    var birthDate = Date.parse(birthDateStr.replace(".", "-").substring(0, 10));
    return Math.floor((new Date().getTime() - birthDate) / years);
}
var childDivs = document.getElementById("wantedList").getElementsByTagName("li");
for (var childDiv of childDivs) {
    childDiv.firstChild.href = "#" + childDiv.innerText.replace(" ", "");
    if (document.getElementById(childDiv.innerText.replace(" ", "")) == null)
        childDiv.innerHTML = childDiv.innerText;
}
var listOfDOB = new Array();
listOfDOB.push({
    date: "1993-02-19",
    name: "Me"
});
for (var wanted of document.getElementById("wantedList").getElementsByTagName("a")) {
    var targetId = wanted.innerText;
    var targetDOB = document.getElementById(targetId.replace(" ", "")).getElementsByTagName("table")[0].getElementsByClassName("DOB");
    if (targetDOB.length > 0) {
        var birthDate = new Date(Date.parse(targetDOB[0].innerText.replace(".", "-").replace(".", "-").substring(0, 10)));
        var age = parseInt(getAge(targetDOB[0].innerText));
        if (!birthDate.toUTCString().includes(NaN))
            listOfDOB.push({
                date: targetDOB[0].innerText.replace(".", "-").replace(".", "-").substring(0, 10),
                name: targetId,
                currentAge: age
            });
    }
}
listOfDOB.sort(function(a, b) {
    return Date.parse(a.date) - Date.parse(b.date)
});
window.addEventListener("load", function() {
    TimeKnots.draw("#timeline", listOfDOB, {
        horizontalLayout: true,
        width: 5000,
        height: 100,
        dateFormat: "%Y.%m.%d",
        showLabels: true,
        labelFormat: "%Y"
    });
    adjustKnots();
});

function toggleTimeline() {
    if (document.getElementById("timeline").style.display == "" || document.getElementById("timeline").style.display == "none") {
        document.getElementById("timeline").style.display = "block";
        document.getElementById("timeline").scrollTo(5000, 0);
    } else
        document.getElementById("timeline").style.display = "none";
}
var currentMonth = createCalendar(new Date().getMonth());

function createCalendar(monthNo) {
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var calendarArray = new Array();
    var dayOfMonth = 1;
    for (var week = 0; week < 6; week++) {
        var weekList = ["", "", "", "", "", "", ""];
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
    for (var item of listOfDOB) {
        var birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date).getMonth(), new Date(item.date).getDate());
        if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && htmlString.indexOf("<td>" + birthdayInYear.getDay() + "</td>") > -1 && item.name != "Me")
            htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", "<td style=\"color: #00e4ff;\"><div class=\"popitem\" style=\"height: 25px; display:none;\">" + item.name + " turns " + item.currentAge + "! (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
    }
    document.getElementById("calendar").innerHTML = htmlString;
    /*for(var today of document.getElementById("calendar").getElementsByTagName("td"))
    {
       if(today.outerText == new Date().getDate()) today.style.border = "1px solid white";
    }*/
    document.getElementById("calendar").addEventListener("mouseover", function(event) {
        if (event.target.style.color == "rgb(0, 228, 255)")
            event.target.getElementsByClassName("popitem")[0].style.display = "block";
        else {
            for (var display of document.getElementById("calendar").getElementsByClassName("popitem"))
                display.style.display = "none";
        }
    });
    currentMonth = monthNo;
    document.getElementById("prevMonth").style.opacity = 1;
    document.getElementById("nextMonth").style.opacity = 1;
    if (currentMonth >= 1) document.getElementById("prevMonth").addEventListener("click", function() {
        createCalendar(--currentMonth);
    });
    else document.getElementById("prevMonth").style.opacity = 0;
    if (currentMonth <= 10) document.getElementById("nextMonth").addEventListener("click", function() {
        createCalendar(++currentMonth);
    });
    else document.getElementById("nextMonth").style.opacity = 0;
    return monthNo;
}

function toggleCalendar() {
    if (document.getElementById("calendar").style.display == "" || document.getElementById("calendar").style.display == "none")
        document.getElementById("calendar").style.display = "block";
    else
        document.getElementById("calendar").style.display = "none";
}
window.addEventListener("scroll", function() {
    document.getElementById("timeline").getElementsByTagName("div")[0].style.opacity = "0";
    document.getElementById("calendar").getElementsByTagName("div")[0].style.display = "none";
    //document.getElementById("timeline").style.display = "none";
    //document.getElementById("calendar").style.display = "none";
});
document.getElementById("timeline").addEventListener("wheel", function(e) {
    e.preventDefault();
	if(window.innerWidth < 540) document.getElementById("timeline").scrollLeft -= e.wheelDelta/2;
	else
	{
		    var origWidth = document.getElementById("timeline").getElementsByTagName("svg")[0].width.baseVal.value + e.wheelDelta;
		if (origWidth >= document.getElementById("timeline").offsetWidth && origWidth <= 10000) {
			document.getElementById("timeline").innerHTML = "";
			TimeKnots.draw("#timeline", listOfDOB, {
				horizontalLayout: true,
				width: origWidth,
				height: 100,
				dateFormat: "%Y.%m.%d",
				showLabels: true,
				labelFormat: "%Y"
			});
			adjustKnots();
		} else if (origWidth < document.getElementById("timeline").offsetWidth) {
			document.getElementById("timeline").innerHTML = "";
			TimeKnots.draw("#timeline", listOfDOB, {
				horizontalLayout: true,
				width: document.getElementById("timeline").offsetWidth,
				height: 100,
				dateFormat: "%Y.%m.%d",
				showLabels: true,
				labelFormat: "%Y"
			});
			adjustKnots();
		} else if (origWidth > 10000) {
			document.getElementById("timeline").innerHTML = "";
			TimeKnots.draw("#timeline", listOfDOB, {
				horizontalLayout: true,
				width: 48000,
				height: 100,
				dateFormat: "%Y.%m.%d",
				showLabels: true,
				labelFormat: "%Y"
			});
			adjustKnots();
		}
	}
});
for (var profBox of document.getElementsByClassName("profile-box")) profBox.addEventListener("dblclick", function() {
    document.getElementById("wantedList").scrollIntoView();
});

function adjustKnots() {
    var circleList = document.getElementsByTagName("circle");
    for (var i = 0; i < circleList.length - 1; i++) {
        var oldCX = parseInt(circleList[i].getAttribute("cx"));
        if (circleList[i + 1].getAttribute("cx") - oldCX <= 20) circleList[i + 1].setAttribute("cx", oldCX + 20);
    }
}