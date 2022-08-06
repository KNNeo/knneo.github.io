//--SETTINGS--//
const showExpanded = function() {
	return !window.location.href.includes('://knneo.github.io');
}; //will only show name, dob, profile, turning point, social media
const smallScreen = window.innerWidth <= 640;
const maxRating = 5;
const calendarCategoryColors = //what to filter for calendar, mapping for category, see profile-list.json
{
	'profile': 'lightgray',
	'seiyuu': 'cyan',
	'doaxvv': 'lime',
	'hololive': 'gold',
	'idolypride': 'pink',
	// 'alterna': 'pink',
};
const nameLabel = 'Name';
const nameWithNicknameLabel = 'Name (Nickname)';
const dobLabel = 'Date Of Birth';
const profileLabel = 'Profile';
const turningPointLabel = 'Status (Singer Debut|Swimsuit Photobook|Married)';
const introLabel = 'How I came to know of her';
const descriptionLabel = 'Why would she be "wanted" by me';
const ratingLabel = 'Wanted Level';
const friendsLabel = 'Known Acquaintances';
const socialLabel = 'Social Media';
const statusPopup = "As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism?)";
const timezone = 'Asia/Tokyo';
const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


//--STARTUP--//
window.addEventListener('load', startup);

//--FUNCTIONS--//
////STARTUP////
function startup() {
	initializeVariables();
	if(profileListJson && profileListJson.length == 0) {
		let xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				profileListJson = JSON.parse(this.responseText);
				loadProfileLists();
				//code here
				if(window['profileList'] != null)
					renderWantedList();
				
			}
		};
		xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list-new.json", true);
		xmlhttp.send();
	}
	else {
		console.log('Using test json');
		loadProfileLists();
		renderWantedList();
	}
}

function initializeVariables() {
	window['defaultProfile'] = {};	
	window['excludeMarried'] = false;
	window['friendMode'] = false;	
	window['currentMonth'] = 0;	
	window['profileList'] = [];
	window['calendarList'] = [];
	window['friendList'] = [];	
	window['timelineDOBlist'] = [];
	window['calendarDOBlist'] = [];
	window['expanded'] = showExpanded();
}

function loadProfileLists() {
	window['profileList'] = profileListJson.filter(n => n.rating);
	window['calendarList'] = profileListJson.filter(n => Object.keys(calendarCategoryColors).includes(n.category));
	window['friendList'] = profileListJson.filter(n => n.category == 'friends');
	window['defaultProfile'] = profileListJson.find( function(n) {
		return n.category == 'default';
	});
	renderWantedList();
}

function renderWantedList() {
	generateWantedList();
	window['timelineDOBlist'] = createDOBlist(window['profileList'], 1, 35);
	loadTimeline(2500);
	window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50);
	window['currentMonth'] = createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, window['calendarDOBlist']);
	addCalendarLegend();
	updateTime();
}

////TIMELINE////
function loadTimeline(width) {
	if(document.getElementById("timeline") == null) return;
	document.getElementById("timeline").innerHTML = "";
	TimeKnots.draw("#timeline", window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), {
		horizontalLayout: true,
		width: width,
		height: 100,
		dateFormat: "%Y.%m.%d",
		showLabels: true,
		labelFormat: "%Y"
	});
	adjustKnots();
	addTimelineEvents();
}

function addTimelineEvents() {
	//on timeline double click shrink timeline
	document.getElementById("timeline").addEventListener("dblclick", function() {
		let origWidth = this.getElementsByTagName("svg")[0].width.baseVal.value / 2;
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
		if (origWidth < 1000) origWidth = 1000;
		else if (origWidth > 10000) origWidth > 10000;
		else loadTimeline(origWidth);
	});
	
	//on scroll turn off all overlays in timeline and calendar
	window.addEventListener("scroll", function() {
		if (document.getElementById("timeline").getElementsByTagName("div").length > 0)
			document.getElementById("timeline").getElementsByTagName("div")[0].style.opacity = "0";
	});
}

//to shift position of knots if overlap with previous
function adjustKnots() {
	let circleList = document.getElementsByTagName("circle");
	for (let i = 0; i < circleList.length - 1; i++) {
		let oldCX = parseInt(circleList[i].getAttribute("cx"));
		if (circleList[i + 1].getAttribute("cx") - oldCX <= 20) circleList[i + 1].setAttribute("cx", oldCX + 20);
	}
}

////CALENDAR////
//create array of objects with DOB info, parameter: age (range inclusive)
function createDOBlist(list, minAge, maxAge) {
	let listOfDOB = new Array();
	if(window['defaultProfile']) {
		listOfDOB.push({
			category: window['defaultProfile'].category,
			date: window['defaultProfile'].dob.replace(".", "-").replace(".", "-").substring(0, 10),
			name: window['defaultProfile'].name
		});
	}
	for(let profile of list) {
		let targetDOB = profile.dob;
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
		let IsBirthdayOver = isBirthdayPassed(DOB);
		// console.log(item.name, timeDiff.days(), timeDiff.hours(), timeDiff.minutes(), timeDiff.seconds(), timeDiff.milliseconds());
		
		let thisAge;
		if (item.currentAge <= 1) thisAge = '??';
		else if (IsBirthdayOver) thisAge = item.currentAge;
		else thisAge = item.currentAge + 1;
		// console.log(item.name + "|" + item.currentAge);
		if(calendarCategoryColors[item.category] == null) continue;
		if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //if no age
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + calendarCategoryColors[item.category] + "; color: black;\"><div class=\"popitem\">Happy Birthday <b style=\"color: " + calendarCategoryColors[item.category] + ";\">" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //normal
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + calendarCategoryColors[item.category] + "; color: black;\"><div class=\"popitem\"><b style=\"color: " + calendarCategoryColors[item.category] + ";\">" + item.name + "</b> turns " + thisAge + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
		else if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs, if no age
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br />Happy Birthday <b style=\"color: " + calendarCategoryColors[item.category] + ";\">" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br /><b style=\"color: " + calendarCategoryColors[item.category] + ";\">" + item.name + "</b> turns " + thisAge + "</b> (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
	}
	
	document.getElementById("calendar").innerHTML = htmlString;
	
	//global variable for month navigation
	//events for month buttons
	window['currentMonth'] = monthNo;
	if (window['currentMonth'] > 0) document.getElementById("prevMonth").addEventListener("click", function() {
		createCalendar(--window['currentMonth'], window['calendarDOBlist']);
	});
	if (window['currentMonth'] < 11) document.getElementById("nextMonth").addEventListener("click", function() {
		createCalendar(++window['currentMonth'], window['calendarDOBlist']);
	});
	return monthNo;
}

function addCalendarLegend() {
	let categories = window['calendarList'].filter((val, index, arr) => arr.map(a => a.category).indexOf(val.category) === index).map(p => p.category); // ['alterna','doaxvv','seiyuu','vtuber'];
	// console.log(categories);
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
			box.style.backgroundColor = calendarCategoryColors[category.toLowerCase()] || 'lightgray';
			label.appendChild(box);
					
			let description = document.createElement('span');
			description.style.padding = '0 5px';
			description.title = category;
			description.addEventListener('click', function() {
				this.previousElementSibling.style.backgroundColor = this.previousElementSibling.previousElementSibling.checked ? 'transparent' :calendarCategoryColors[this.title.toLowerCase()] || 'lightgray';
				setTimeout(function() {
					filterCalendar();
					createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, window['calendarDOBlist']);
				}, 10);
			});
			description.innerText = category.substring(0,1).toUpperCase() + category.substring(1);
			label.appendChild(description);
		
		calendarLegend.appendChild(label);
	}
}

function filterCalendar() {
	let checkedCategories = Array
		.from(document.getElementById('calendar-legend').getElementsByTagName('input'))
		.filter(i => i.checked == true)
		.map(i => i.name);
	window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50);
	window['calendarDOBlist'] = window['calendarDOBlist'].filter(c => c.name != 'Me' && (checkedCategories.indexOf(c.category) >= 0));
}

function exportCalendar() {
	let textOutput = '"Subject","Start date","All Day Event","Description","Private"';
	let nowYear = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year;
	// title, MM/dd/yyyy, true, description, true
	for(let profile of window['calendarDOBlist'])
	{
		textOutput += '\n';
		let formatDate = profile.date.substring(5,7) + '/' + profile.date.substring(8,10) + '/' + nowYear;
		
		//follow wanted-list-v2.js
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(profile.date.replace('????', nowYear)).getMonth(), new Date(profile.date.replace('????', nowYear)).getDate());
		let DOB = nowYear + profile.date.substring(4);
		let IsBirthdayOver = isBirthdayPassed(DOB);
		
		let line = '"'+profile.name+'\'s Birthday'+(profile.date.includes('?') ? '' : ' ('+(IsBirthdayOver ? parseInt(getAge(profile.date)) : parseInt(getAge(profile.date))+1)+')')+'","'+formatDate+'","true","'+(profile.date.includes('?') ? '' : ('Born ' + profile.date))+'","true"';
		textOutput += line;
	}
	
	//create download file
	let downloadLink = document.createElement('a');
	downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(textOutput);
	downloadLink.target = '_blank';
	downloadLink.download = 'profiles.csv';
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	
	console.log('Export done');
	document.getElementById('exportBtn').setAttribute('disabled','');
}

////PROFILE////
function generateProfileFromJSON(profileName) {
	if(typeof profileName == 'object')
		profileName = profileName.innerText;
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.replace(' ', '');
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.substring(0, profileName.indexOf(' '));
	
	//the profile selected
	let profile = window['profileList'].filter( function(n) {
        return n.id == profileName;
    })[0];
	//for if only mandatory field are filled
	let simplified = profile.intro == undefined || !window['expanded'];

	//previous profile
	let currentProfile = null;
	
	if(profile == null || profile.length == 0) return;
	
	if(document.getElementById('profile').childElementCount > 0)
	{
		let currentProfileName = document.getElementById('profile').getElementsByTagName('div')[0].id;
		currentProfile = window['profileList'].filter( function(n) {
			return n.id == currentProfileName;
		})[0];
		
		
		let friendFound = window['friendList'].find( function(p) {
					return p.id == currentProfile.id + "-" + profile.id ||
					p.id == profile.id + "-" + currentProfile.id;
		}) != undefined;
		
		//if(friendFound)
		//	console.log('Friend found! ' + currentProfile.name + ' x ' + profile.name);
		
		//update based on friend found, desktop only for now
		window['friendMode'] = friendFound && window.innerWidth > 360;
		//IN FRIEND MODE: left is profile, right is currentProfile
	}
	
	if(document.getElementById('profile').classList.contains('friend-mode'))
		window['friendMode'] = false;
		
	document.getElementById('profile').innerHTML = '';
	
	//if in friend mode and has friend in next friend call, show single mode first
	//if(window['friendMode']) document.getElementById('profile').classList.add('friend-mode');
	//else if(document.getElementById('profile').classList.contains('friend-mode'))
	//	document.getElementById('profile').classList.remove('friend-mode');
	
	//console.log(profile);
	
	let idBox = document.createElement('div');
	idBox.id = profile.id;
	idBox.style.width = '90%';
	idBox.style.maxWidth = simplified || window['friendMode'] ? '440px' : '640px';
	idBox.style.margin = 'auto';
	idBox.style.padding = '3px';
	
		let profileBox = document.createElement('div');
		profileBox.classList.add('profile-box');
	
			let profileBoxImg = document.createElement('div');
			profileBoxImg.classList.add('profile-box-img');
			profileBoxImg.style.clear = 'both';
			profileBoxImg.style.textAlign = 'center';
			profileBoxImg.style.width = '100%';
			profileBoxImg.style.height = '320px';
				
			//pre processing for friend image to flip profiles order
			let friendImage = '';
			if(window['friendMode'])
			{
				let friend = window['friendList'].find( function(p) {
					return p.id == currentProfile.id + '-' + profile.id || 
						p.id == profile.id + '-' + currentProfile.id;
				});
				
				if(friend != undefined)
				{
					friendImage = friend.image;
					
					if(friend.id !== (profile.id + '-' + currentProfile.id))
					{
						let tempProfile = currentProfile;
						currentProfile = profile;
						profile = tempProfile;
					}
				}
			}
			
			if(profile.landscapes == undefined) profile.landscapes = [];
			if(profile.portraits == undefined) profile.portraits = [];
			let allImages = profile.landscapes.concat(profile.portraits);
			
			let image1Source = profile.image;
			if(allImages.length > 0) image1Source = randomArrayItem(allImages);
			if(window['friendMode']) image1Source = friendImage;
			
			let image2Source = profile.image;
			if(window['friendMode'])
			{
				if(currentProfile.landscapes == undefined) currentProfile.landscapes = [];
				if(profile.portraits.length == 0) profile.portraits.push(profile.image);
				if(currentProfile.portraits == undefined) currentProfile.portraits = [];
				if(currentProfile.portraits.length == 0) currentProfile.portraits.push(currentProfile.image);
				image2Source = addBackgroundUrlClause(randomArrayItem(profile.portraits)) + ", " + addBackgroundUrlClause(randomArrayItem(currentProfile.portraits));
			}
			
			profileBoxImg.style.backgroundSize = 'contain';
			profileBoxImg.style.backgroundRepeat = 'no-repeat';
			profileBoxImg.style.backgroundPosition = 'center';
			profileBoxImg.style.backgroundImage = addBackgroundUrlClause(image1Source);
			profileBoxImg.setAttribute('alt', window['friendMode'] ? image2Source : addBackgroundUrlClause(image2Source));
		
			profileBox.appendChild(profileBoxImg);
			
			let profileTable = document.createElement('table');
			
				let profileTableBody = document.createElement('tbody');
				
					let row = document.createElement('tr');
					
					if(!window['friendMode'])
					{
						let cell = document.createElement('td');
						if(window['friendMode']) cell.style.textAlign = 'center';
						cell.innerText = simplified ? nameLabel : nameWithNicknameLabel;
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						let cellDiv = document.createElement('div');
						if(window['friendMode']) cellDiv.style.textAlign = 'left';
						if(window['friendMode']) cellDiv.style.position = 'absolute';
						if(!window['friendMode'] && !simplified) cellDiv.innerHTML = ' (' + superscriptText(profile.nickname) + ')';
						
							let span = document.createElement(window['friendMode'] ? 'a' : 'span');
							span.classList.add('profile-name');
							span.innerText = profile.name;
							if(window['friendMode']) 
							{	
								span.href = 'javascript:void(0)';
								span.addEventListener("click", function() {
									generateProfileFromJSON(this);
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
								});
								span.addEventListener("contextmenu", function(e) {
									e.preventDefault();
									window['expanded'] = !window['expanded'];
									generateProfileFromJSON(this);
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
									window['expanded'] = !window['expanded'];
								}, false);
							}
							cellDiv.insertBefore(span, cellDiv.childNodes[0]);
							
						cell.appendChild(cellDiv);
						row.appendChild(cell);
						
						if(window['friendMode'])
						{
							cellDiv = document.createElement('div');
							
								span = document.createElement('a');
								span.classList.add('profile-name');
								span.innerText = currentProfile.name;
								span.href = 'javascript:void(0)';
								span.addEventListener("click", function() {
									generateProfileFromJSON(this);
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
								});
								cellDiv.insertBefore(span, cellDiv.childNodes[0]);
								
							cell.appendChild(cellDiv);
							row.appendChild(cell);
						}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
						
					if(!window['friendMode'])
					{
						cell = document.createElement('td');
						if(window['friendMode']) cell.style.textAlign = 'center';
						cell.innerText = dobLabel;
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						
							cellDiv = document.createElement('div');
							if(window['friendMode']) cellDiv.style.textAlign = 'left';
							if(window['friendMode']) cellDiv.style.position = 'absolute';
							
								let DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								// console.log(profile.dob);
								DOBspan.innerHTML = superscriptText(profile.dob) + (window['expanded'] && !window['friendMode'] && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
								if(DOBspan.innerHTML.includes('????')) {
									let dateOnly = new Date(1990,profile.dob.substring(5,2),profile.dob.substring(8,2),0,0,0,0);
									DOBspan.innerHTML = month[parseInt(profile.dob.substring(5,7))-1] + ' ' + parseInt(profile.dob.substring(8,10)) + (window['expanded'] && !window['friendMode'] && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
									if(profile.dob.substring(10).length === 3)
										DOBspan.innerHTML += superscriptText(profile.dob.substring(10));
								}
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							if(window['friendMode'])
							{
								cellDiv = document.createElement('div');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								DOBspan.innerHTML = processOption(currentProfile.dob, false) + (window['expanded'] && !window['friendMode'] && !simplified && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
								cell.appendChild(cellDiv);
							}
						
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					
					if(!window['friendMode'])
					{
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							if(window['friendMode']) cell.style.textAlign = 'center';
							cell.innerText = profileLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								if(window['friendMode']) cellDiv.style.textAlign = 'left';
								if(window['friendMode']) cellDiv.style.position = 'absolute';
								cellDiv.innerText = profile.profile;
								cell.appendChild(cellDiv);
								
								if(window['friendMode'])
								{
									cellDiv = document.createElement('div');
									cellDiv.innerText = profile.profile;
									cell.appendChild(cellDiv);
								}
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.classList.add('tr-caption');
							cell.classList.add('turning-point');
							if(window['friendMode']) cell.style.textAlign = 'center';
							cell.innerText = turningPointLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					
						row = document.createElement('tr');
							
							cell = document.createElement('td');
								
								cellDiv = document.createElement('div');
								if(window['friendMode']) cellDiv.style.textAlign = 'left';
								if(window['friendMode']) cellDiv.style.position = 'absolute';
								if(window['expanded'] && !window['friendMode'] && !simplified)
									cellDiv.innerHTML = Object.keys(profile.turningPoint).map((item, i, arr) => {
										return superscriptText(profile.turningPoint[item]);
									}).join('|'); 
									// cellDiv.innerHTML = superscriptText(profile.turningPoint.soloDebut)
												// + "|" + superscriptText(profile.turningPoint.swimsuitPhotobook)
												// + "|" + superscriptText(profile.turningPoint.isMarried);
								else
									cellDiv.innerHTML = Object.keys(profile.turningPoint).map((item, arr) => {
										return processOption(profile.turningPoint[item], false);
									}).join('|');
									// cellDiv.innerHTML = processOption(profile.turningPoint.soloDebut, false)
												// + "|" + processOption(profile.turningPoint.swimsuitPhotobook, false) 
												// + "|" + processOption(profile.turningPoint.isMarried, false);
									
							cell.appendChild(cellDiv);
										
							if(window['friendMode'])
							{
								cellDiv = document.createElement('div');
								cellDiv.innerHTML = processOption(currentProfile.turningPoint.soloDebut, false)
											+ "|" + processOption(currentProfile.turningPoint.swimsuitPhotobook, false) 
											+ "|" + processOption(currentProfile.turningPoint.isMarried, false);
								cell.appendChild(cellDiv);
							}
						
							row.appendChild(cell);
							
						profileTableBody.appendChild(row);
					}
					
					if(!window['friendMode'] && !simplified)
					{
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = introLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerHTML = superscriptText(profile.intro);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = descriptionLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerHTML = superscriptText(profile.description);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = ratingLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							// cell.innerText = ratingAsStars(profile.rating, 5);
							cell.appendChild(ratingAsStars(profile.rating, maxRating));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						let profileFriendsList = window['friendList'].filter( function(p) {
							return p.id.endsWith(profile.id) || p.id.startsWith(profile.id);
						});
						if(profileFriendsList.length > 0)
						{
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								cell.innerText = friendsLabel;
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
							
							row = document.createElement('tr');
							
								cell = document.createElement('td')
								
									cellDiv = document.createElement('div');
									cellDiv.id = 'profile-friends';
									
									let profileFriends = [];
									for(let friend1 of profileFriendsList)
									{
										let splits = friend1.id.split('-');
										for(let item of splits)
										{
											if(item != profile.id)
												profileFriends.push(item);
										}
									}
									
									for(let friend of profileFriends.sort())
									{
										let span = document.createElement('span');
										span.innerText = ' ';
										cellDiv.appendChild(span);
										cellDiv.appendChild(generateWantedListEntry(friend));
									}
									
									cell.appendChild(cellDiv);
									
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
						}
						
					}
					
					if(profile.social)
					{
						if(!window['friendMode']) {
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								cell.innerText = socialLabel;
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
						}
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								cellDiv.id = 'profile-social';
								if(window['friendMode'] && currentProfile.social) {
									cellDiv.style.textAlign = 'left';
									cellDiv.style.position = 'absolute';
								}
								
								if(profile.social.twitter)
								{
									let twitterSpan = document.createElement('a');
									twitterSpan.href = 'https://twitter.com/' + profile.social.twitter;
									twitterSpan.target = '_blank';
									twitterSpan.title = profile.social.twitter;
									
									let twitterIcon = document.createElement('i');
									twitterIcon.classList.add('bi');
									twitterIcon.classList.add('bi-twitter');
									twitterSpan.appendChild(twitterIcon);
									
									cellDiv.appendChild(twitterSpan);
								}
								
								if(profile.social.instagram)
								{
									let instagramSpan = document.createElement('a');
									instagramSpan.href = 'https://www.instagram.com/' + profile.social.instagram;
									instagramSpan.target = '_blank';
									instagramSpan.title = profile.social.instagram;
									
									let instagramIcon = document.createElement('i');
									instagramIcon.classList.add('bi');
									instagramIcon.classList.add('bi-instagram');
									instagramSpan.appendChild(instagramIcon);
									
									cellDiv.appendChild(instagramSpan);
								}
								
								if(profile.social.youtube)
								{
									let youtubeSpan = document.createElement('a');
									youtubeSpan.href = 'https://www.youtube.com/channel/' + profile.social.youtube;
									youtubeSpan.target = '_blank';
									youtubeSpan.title = profile.social.youtube;
									
									let youtubeIcon = document.createElement('i');
									youtubeIcon.classList.add('bi');
									youtubeIcon.classList.add('bi-youtube');
									youtubeSpan.appendChild(youtubeIcon);
									
									cellDiv.appendChild(youtubeSpan);
								}
								
								cell.appendChild(cellDiv);
								
								if(window['friendMode'] && currentProfile.social) {				
									cellDiv = document.createElement('div');
									cellDiv.id = 'currentProfile-social';
									cellDiv.style.textAlign = 'right';
									
									if(currentProfile.social.twitter)
									{
										let twitterSpan = document.createElement('a');
										twitterSpan.href = 'https://twitter.com/' + currentProfile.social.twitter;
										twitterSpan.target = '_blank';
										twitterSpan.title = currentProfile.social.twitter;
										
										let twitterIcon = document.createElement('i');
										twitterIcon.classList.add('bi');
										twitterIcon.classList.add('bi-twitter');
										twitterSpan.appendChild(twitterIcon);
										
										cellDiv.appendChild(twitterSpan);
									}
									
									if(currentProfile.social.instagram)
									{
										let instagramSpan = document.createElement('a');
										instagramSpan.href = 'https://www.instagram.com/' + currentProfile.social.instagram;
										instagramSpan.target = '_blank';
										instagramSpan.title = currentProfile.social.instagram;
										
										let instagramIcon = document.createElement('i');
										instagramIcon.classList.add('bi');
										instagramIcon.classList.add('bi-instagram');
										instagramSpan.appendChild(instagramIcon);
										
										cellDiv.appendChild(instagramSpan);
									}
									
									if(currentProfile.social.youtube)
									{
										let youtubeSpan = document.createElement('a');
										youtubeSpan.href = 'https://www.youtube.com/channel/' + currentProfile.social.youtube;
										youtubeSpan.target = '_blank';
										youtubeSpan.title = currentProfile.social.youtube;
										
										let youtubeIcon = document.createElement('i');
										youtubeIcon.classList.add('bi');
										youtubeIcon.classList.add('bi-youtube');
										youtubeSpan.appendChild(youtubeIcon);
										
										cellDiv.appendChild(youtubeSpan);
									}
									
									cell.appendChild(cellDiv);
								}
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			if(!window['friendMode'] && !simplified)
			{
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = processComments(profile.comments, profile.links);
				if(window.location.href.includes('knneo.github.io'))
					commentBox.innerHTML = commentBox.innerHTML.replace(/knwebreports.blogspot.com/gi, 'knneo.github.io/blogspot/blog');
				//special case
				commentBox.innerHTML = commentBox.innerHTML.replace('1976.09.20', '<span id=\'HocchanAge\' class=\'DOB\'>1976.09.20</span>');
				
				profileBox.appendChild(commentBox);
			}
	
		idBox.appendChild(profileBox);
	
	if(!window['friendMode'])
		document.getElementById('profile').classList.remove('friend-mode');
	else
		document.getElementById('profile').classList.add('friend-mode')
	document.getElementById('profile').appendChild(idBox);
	
	return true;
}

function renderProfileBox() {
	document.getElementById('profile').style.display = '';
	addProfileEvents();
	addAgeAfterDOB();
}

function addProfileEvents() {
	let profileBox = document.querySelector('.profile-box');
	
	//add event listener for image switch but through clicking on profile box
	profileBox.addEventListener("click", function() {
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
	
	//double click profile box go up to list of names
	 profileBox.addEventListener("dblclick", function() {
		document.getElementById("profile").style.display = 'none';
		document.getElementById("profile").innerHTML = '';
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	});
}

////WANTED LIST////
function generateWantedList(profileLink) {
	let wantedListString = "";
	let wantedList = document.getElementById("wantedList");
	wantedList.innerHTML = '';

	//create name array from static profile boxes
	let profileNamesList = [];
	for (let profileName of window['profileList']) {
		profileNamesList.push(profileName);
	}
	profileNamesList.sort(function(a,b) {
		return a.name.localeCompare(b.name);
	});

	//create wanted list from list of names
	for (let profile of profileNamesList) {
		let married = window['excludeMarried'] && processOption(profile.turningPoint.isMarried, true);
		
		let list = document.createElement('li');
		
		let wanted = document.createElement((married ? 'span' : 'a'));
		wanted.innerText = profile.name;
		wanted.style.margin = '5px';
		if(married)
			wanted.style.color = 'gray';
		if(!married)
		{
			wanted.addEventListener("click", function() {
				generateProfileFromJSON(this);
				renderProfileBox();
				addStatusPopUp();
				generateWantedList(this);
				document.getElementById('profile').scrollIntoView();
			});
			wanted.addEventListener("contextmenu", function(e) {
				e.preventDefault();
				window['expanded'] = !window['expanded'];
				generateProfileFromJSON(this);
				renderProfileBox();
				generateWantedList(this);
				document.getElementById('profile').scrollIntoView();
				window['expanded'] = !window['expanded'];
			}, false);
		}
		
		list.appendChild(wanted);
		wantedList.appendChild(list);
	}
}

function generateWantedListEntry(id) {
	let profileFromId = window['profileList'].find( function(n) {
		return n.id == id
	});
	
	let friendLink = document.createElement('a');
	friendLink.classList.add('friend-link');
	friendLink.innerText = profileFromId.name;
	
	//wanted list processing
	friendLink.addEventListener("click", function(e) {		
		e.preventDefault();
		generateProfileFromJSON(this);
		renderProfileBox();
		addStatusPopUp();
		document.getElementById('profile').scrollIntoView();
	});
	friendLink.addEventListener("contextmenu", function(e) {
		e.preventDefault();
		window['expanded'] = !window['expanded'];
		generateProfileFromJSON(this);
		renderProfileBox();
		addStatusPopUp();
		document.getElementById('profile').scrollIntoView();
		window['expanded'] = !window['expanded'];
	}, false);
	
	return friendLink;
}

////HELPER////
function addBackgroundUrlClause(url) { return "url('" + url + "')"; }
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function processComments(comments, refs) {
	if(refs && refs.length > 0)
	{
		let commentArr = [];
		for(let comment of comments)
		{
			let added = false;
			for(let ref of refs)
			{
				let refText = ref.substring(0, ref.indexOf('}')+1);
				let refLink = ref.replace(refText, '');
				let replaced = comment.replace(refText, '<a target="_blank" href="' + refLink + '">' + refText + '</a>');
				// console.log(replaced, comment);
				if(replaced != comment)
				{
					commentArr.push(replaced.replace('{','').replace('}',''));
					added = true;
				}
			}
			if(!added)
				commentArr.push(comment);
		}
		return superscriptText(commentArr.join('<br/>'));
	}
	return superscriptText(comments.join('<br/>'));
}
function processOption(option, returnBool) { return returnBool ? option.includes('Yes') : option.replace('[1]','').replace('[2]','').replace('[3]',''); }
function randomArrayItem(array) { return array[Math.floor(Math.random()*(array.length-1))]; }
function ratingAsStars(rating, total) {
	let stars = document.createElement('div');
	stars.title = rating + '/' + total;
	for(s = 0; s < total; s++)
	{
		let star = document.createElement('i');
		star.classList.add('bi');
		star.classList.add('bi-star' + (rating - s > 0 ? '-fill' : ''))
		stars.appendChild(star);
		// stars += rating - s > 0 ? '★' : '☆';
	}
	return stars;
}
function superscriptText(input) { return input.replace('[1]',superscriptHTML('[1]')).replace('[2]',superscriptHTML('[2]')).replace('[3]',superscriptHTML('[3]')); }
function superscriptHTML(input) { return '<span class="superscript">' + input + '</span>'; }

////CHECK////
function daysFromMe() {
	let me = window['timelineDOBlist'].filter(t => t.name == "Me")[0];
	let others = window['timelineDOBlist'].filter(t => t.name != "Me");
	console.log('with respect to ' + me.date + ':');
	let away = new Array();
	for(let other of others)
	{
		if(other.date.includes('????')) continue;
		let DOB = other.date;
		let myDateStr = me.date.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
		let myDate = myDateStr.substring(0, 10);
		let birthDateStr = DOB.replace(".", "-").replace(".", "-");
		let birthDate = birthDateStr.substring(0, 10);
		let diff = luxon.DateTime.fromISO(myDate).setZone(timezone).diff(luxon.DateTime.fromISO(birthDate), 'days').days;
		away.push({
			name: other.name,
			daysAway: Math.abs(diff)
			});
	}
	
	console.log(away.sort((a,b) => a.daysAway - b.daysAway));
}

function friendCheck() {
	console.log('Friend check!');
	
	if(window['friendList'].length == 1 && window['friendList'].length > 0)
	{		
		window['friendList'].sort( function(a,b) {
			return a.id.localeCompare(b.id)
		});
		
		//check duplicate ids
		for(let pair of window['friendList'])
		{
			let result = window['friendList'].filter( function(f) {
				return f.id == pair.id;
			});
			if(result != undefined && result.length > 1)
				console.log(pair.id + " has exact duplicates");
		}
		
		//check ids but of different positions
		for(let pair of window['friendList'])
		{
			let splits = pair.id.split('-');
			let result = window['friendList'].filter( function(f) {
				return f.id == (splits[1] + '-' + splits[0]);
			});
			if(result != undefined && result.length > 0)
				console.log(pair.id + " has duplicates of different positions");
		}
	}
	
	console.log('Done.');
}

function showProfilesImageCount(threshold) {
	if(!threshold) threshold = 10;
	for(let profile of window['profileList'])
	{
		if(profile.landscapes.length > threshold || profile.portraits.length > threshold)
			console.log(profile.name, profile.landscapes.length + ' landscapes', profile.portraits.length + ' portraits');
	}
}

////UNCATEGORIZED////
function addStatusPopUp() {
	if(statusPopup.length == 0) return;
	if(document.getElementsByClassName("turning-point").length < 1) return;
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseover", function(d) {
		d.target.innerHTML = '<div id=\"tp-description\">' + statusPopup + '</div>' + d.target.innerHTML;
	});
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseout", function() {
		if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
	});
}

//add age after DOB span
function addAgeAfterDOB() {
	if(document.getElementById('profile').classList.contains('friend-mode')) return;
	let profile = window['profileList'].filter(p => p.id === document.getElementById('profile').firstChild.id)[0];
	let DOBspan = document.getElementById(profile.id).getElementsByClassName('DOB')[0];
	let age = profile.dob.includes('????') ? 0 : parseInt(getAge(profile.dob));
	if (age != undefined && age > 0)
		DOBspan.innerHTML = DOBspan.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
}

function getAge(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone});
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone});
	// console.log(today.diff(birthDate, ['years','months','days','hours','minutes','seconds']));
	return today.diff(birthDate, 'years').years;
}

function isBirthdayPassed(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone}); 
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone});
	return today.diff(birthDate, 'days').days >= 0;
}

function toggleMarried() {
	if(window['excludeMarried'] != null)
	{
		window['excludeMarried'] = document.getElementById("marriedCheckbox").checked;
		generateWantedList();
		let marriedList = window['profileList'].filter(profile => window['excludeMarried'] ? !processOption(profile.turningPoint.isMarried, true) : true);
		window['timelineDOBlist'] = createDOBlist(marriedList, 1, 35);
		loadTimeline(2500);
	}
}

function updateTime() {
	if(document.getElementById('time') != null)
	{
		var now = luxon.DateTime.local().setZone(timezone);
		document.getElementById('time').innerText = now.toFormat("yyyy.MM.dd HH:mm:ss");	
		setTimeout(updateTime, 1000);
	}
}