//--SETTINGS--//
const showExpanded = function() {
	return !window.location.href.includes('://knneo.github.io');
}; //will only show name, dob, profile, turning point, social media
const smallScreen = window.innerWidth <= 640;
const maxRating = 5;
const calendarCategories = ['profile', 'seiyuu', 'doaxvv', 'hololive', 'idolypride'];
//what to filter for calendar, mapping for category, see profile-list.json
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
const source = 'https://knneo.github.io/profile-list/profile-list-new.json';

//--STARTUP--//
window.addEventListener('load', startup);

//--FUNCTIONS--//
////STARTUP////
function startup() {
	initializeVariables();
	if(profileListJson && profileListJson.length == 0) {
		getJson(source, function(response) {
			profileListJson = response;
			loadProfileLists();
		});
	}
	else {
		console.log('Using test json');
		loadProfileLists();
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
	window['calendarList'] = profileListJson.filter(n => calendarCategories.includes(n.category));
	window['friendList'] = profileListJson.filter(n => n.category == 'friends');
	window['defaultProfile'] = profileListJson.find(n => n.category == 'default');
	window['timelineDOBlist'] = createDOBlist(window['profileList'], 1, 35, true);
	window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50);
	renderWantedList();
}

function renderWantedList() {
	generateWantedList();
	loadTimeline();
	createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, window['calendarDOBlist'], true);
	updateTime();
}

////WANTED LIST////
function generateWantedList() {
	let wantedList = document.querySelector(".list");
	wantedList.innerHTML = '';

	//create array
	let profileNamesList = [];
	for (let profileName of window['profileList']) {
		profileNamesList.push(profileName);
	}
	profileNamesList.sort(function(a,b) {
		return a.name.localeCompare(b.name);
	});

	//create wanted list
	for (let profile of profileNamesList) {
		let list = document.createElement('li');
		list.appendChild(generateWantedListEntry(profile.id));			
		wantedList.appendChild(list);
	}
}

function generateWantedListEntry(id) {
	let profile = window['profileList'].find( function(n) {
		return n.id == id
	});
	let married = window['excludeMarried'] && processOption(profile.turningPoint.isMarried, true);

	let wanted = document.createElement(married ? 'span' : 'a');
	wanted.innerText = profile.name;
	if (married)
		wanted.classList.add('married');
	else
	{
		wanted.classList.add('item');
		wanted.addEventListener("click", function() {
			generateProfileFromJSON(this);
			document.querySelector('#profile').scrollIntoView();
		});
		wanted.addEventListener("contextmenu", function(e) {
			e.preventDefault();
			window['expanded'] = !window['expanded'];
			generateProfileFromJSON(this);
			document.querySelector('#profile').scrollIntoView();
			window['expanded'] = !window['expanded'];
		}, false);
	}
	
	return wanted;
}

////TIMELINE////
function loadTimeline(width = 2500) {
	if(document.querySelector('#timeline') == null) return;
	document.querySelector('#timeline').innerHTML = '';
	TimeKnots.draw('#timeline', window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), {
		horizontalLayout: true,
		width: width,
		height: 100,
		dateFormat: "%Y.%m.%d",
		showLabels: true,
		labelFormat: "%Y"
	});
	adjustKnots(20);
	addTimelineEvents();
}

function adjustKnots(knotSize) {
	//to shift position of knots if overlap with previous
	let circleList = document.querySelectorAll('circle');
	for (let i = 0; i < circleList.length - 1; i++) {
		let oldCX = parseInt(circleList[i].getAttribute('cx'));
		if (circleList[i + 1].getAttribute("cx") - oldCX <= knotSize) circleList[i + 1].setAttribute('cx', oldCX + knotSize);
	}
}

function addTimelineEvents() {
	//on timeline double click shrink timeline
	document.querySelector('#timeline').addEventListener('dblclick', function() {
		let newWidth = this.querySelector('svg').width.baseVal.value / 2;
		if (newWidth < 1000) newWidth = 1000;
		else if (newWidth > 10000) newWidth > 10000;
		else loadTimeline(newWidth);
	});

	//on timeline wheel scroll adjust timeline length ie. redraw
	document.querySelector('#timeline').addEventListener('wheel', function(e) {
		e.preventDefault();
		if (!e.shiftKey) {
			this.scrollLeft -= e.wheelDelta / 2;
			return;
		}
		let newWidth = this.querySelector('svg').width.baseVal.value + e.wheelDelta;
		if (newWidth < 1000) newWidth = 1000;
		else if (newWidth > 10000) newWidth > 10000;
		else loadTimeline(newWidth);
	});
	
	//on scroll turn off all overlays in timeline and calendar
	window.addEventListener('scroll', function() {
		if (document.querySelector('#timeline').querySelectorAll('div').length > 0)
			document.querySelector('#timeline').querySelector('div').style.opacity = "0";
	});
}

////CALENDAR////
function createDOBlist(profiles, minAge, maxAge, sort = false) {
	//create array with DOB info, age range inclusive
	let list = new Array();
	if(window['defaultProfile']) {
		list.push({
			category: window['defaultProfile'].category,
			date: window['defaultProfile'].dob.replace('.', '-').replace('.', '-').substring(0, 10),
			name: window['defaultProfile'].name
		});
	}
	for(let profile of profiles) {
		let targetDOB = profile.dob;
		if (targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB.replace(".", "-").replace(".", "-").substring(0, 10)));
			let age = getAge(targetDOB);
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				list.push({
					category: profile.category,
					date: targetDOB.replace(".", "-").replace(".", "-").substring(0, 10),
					name: profile.name,
					currentAge: age
				});
		}
	}
	//to sort the above so oldest is added first in timeline
	if(sort)
		list.sort(function(a, b) {
			return Date.parse(a.date) - Date.parse(b.date)
		});
	return list;
}

function createCalendar(monthNo, DOBlist, legend = false) {
	//generate calendar from DOBlist
	//monthNo is 0-based, actual is monthNo + 1
	//legend will generate legend, if .calendar-legend is found
	let calendarArray = new Array();
	let dayOfMonth = 1;
	// render days of month as fixed array
	for (let week = 0; week < 6; week++) {
		let weekDays = ['', '', '', '', '', '', ''];
		for (let day = 0; day < 7; day++) {
			if (new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDay() == day) {
				//add to array
				if (dayOfMonth > new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDate()) break;
				weekDays[day] = dayOfMonth;
				dayOfMonth++;
			}
		}
		calendarArray.push(weekDays);
	}
	
	let week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	// render table
	let htmlString = '<table><tbody><tr><td>' + 
	(monthNo+1 > 1 ? '<i id="prevMonth" class="bi bi-arrow-left"></i>' : '') + 
	'</td><td colspan="5">' + 
	month[monthNo] + ' ' + new Date().getFullYear() + 
	'</td><td>'	+ 
	(monthNo+1 < 12 ? '<i id="nextMonth" class="bi bi-arrow-right"></i>' : '') + 
	'</td></tr><tr>' + week.map(w => '<td>' + w + '</td>').join('') + '</tr>';
	
	for (let week = 0; week < 6; week++) {
		htmlString += '<tr>';
		let weekDays = calendarArray[week];
		for (let day = 0; day < 7; day++) {
			htmlString += '<td>' + weekDays[day] + '</td>';
		}
		htmlString += '</tr>';
	}
	htmlString += '</tbody></table>';
	
	// replace cells in table with relevant dates
	for (let item of DOBlist) {
		//calculate if birthday this year has passed
		let currentYear = new Date().getFullYear();
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????', currentYear)).getMonth(), new Date(item.date.replace('????', currentYear)).getDate());
				
		let thisAge;
		//define thisAge
		if (item.currentAge <= 1) thisAge = '??';
		else if (isBirthdayPassed(currentYear + item.date.substring(4))) thisAge = item.currentAge;
		else thisAge = item.currentAge + 1;
		// console.log(item.category + '|' + item.name + '|' + item.currentAge);
		if (calendarCategories == null) continue;
		
		//replace html based on thisAge
		let dateCell = '<td>' + birthdayInYear.getDate() + '</td>';
		let monthId = month[birthdayInYear.getMonth()];
		let message = '<b class="color-' + item.category + '">' + item.name + '</b> turns ' + thisAge + '</b> (' + birthdayInYear.getDate() + ' ' + monthId.substring(0, 3) + ')';
		if (thisAge == '??')
			message = 'Happy Birthday <b class="color-' + item.category + '">' + item.name + '</b>!!';
		
		if (thisAge == '??' && htmlString.indexOf(monthId) > -1 && htmlString.indexOf(dateCell) > -1 && item.name != 'Me') //no age
			htmlString = htmlString.replace(dateCell, 
			'<td class="bg-' + item.category + '"><div class="popitem">' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (htmlString.indexOf(monthId) > -1 && htmlString.indexOf(dateCell) > -1 && item.name != "Me") //with age
			htmlString = htmlString.replace(dateCell, 
			'<td class="bg-' + item.category + '"><div class="popitem">' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (thisAge == '??' && htmlString.indexOf(monthId) > -1) //append DOB, no age
			htmlString = htmlString.replace('</div>' + birthdayInYear.getDate() + '</td>', 
			'<br />' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (htmlString.indexOf(monthId) > -1) //append DOB, with age
			htmlString = htmlString.replace('</div>' + birthdayInYear.getDate() + '</td>', 
			'<br />' + message + '</div>' + birthdayInYear.getDate() + '</td>');
	}
	
	document.querySelector('.calendar').innerHTML = htmlString;
	
	//global variable for month navigation
	//events for month buttons
	window['currentMonth'] = monthNo;
	if (window['currentMonth'] > 0) document.getElementById("prevMonth").addEventListener("click", function() {
		createCalendar(--window['currentMonth'], window['calendarDOBlist']);
	});
	if (window['currentMonth'] < 11) document.getElementById("nextMonth").addEventListener("click", function() {
		createCalendar(++window['currentMonth'], window['calendarDOBlist']);
	});
	
	if(legend)		
		addCalendarLegend();
}

function addCalendarLegend() {
	if(document.querySelector('.calendar-legend') == null) return;
	let categories = window['calendarList'].filter((val, index, arr) => arr.map(a => a.category).indexOf(val.category) === index).map(p => p.category);
	// console.log(categories);
	let calendarLegend = document.querySelector('.calendar-legend');
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
			box.classList.add('bg-' + category.toLowerCase());
			box.setAttribute('data-id', 'bg-' + category.toLowerCase());
			// box.style.backgroundColor = 'lightgray';
			box.addEventListener('click', function() {
				// this.previousElementSibling.style.backgroundColor = this.previousElementSibling.previousElementSibling.checked ? 'transparent' :calendarCategories[this.title.toLowerCase()] || 'lightgray';
				let id = this.getAttribute('data-id');
				if(this.classList.contains(id))
					this.classList.remove(id);
				else
					this.classList.add(id);					
				setTimeout(function() {
					filterCalendar();
					createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, window['calendarDOBlist']);
				}, 10);
			});
			label.appendChild(box);
					
			let description = document.createElement('span');
			description.style.padding = '0 5px';
			description.title = category;
			description.addEventListener('click', function() {
				// this.previousElementSibling.style.backgroundColor = this.previousElementSibling.previousElementSibling.checked ? 'transparent' :calendarCategories[this.title.toLowerCase()] || 'lightgray';
				let id = this.previousElementSibling.getAttribute('data-id');
				if(this.previousElementSibling.classList.contains(id))
					this.previousElementSibling.classList.remove(id);
				else
					this.previousElementSibling.classList.add(id);					
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
		.from(document.querySelectorAll('.calendar-legend input'))
		.filter(i => i.checked == true)
		.map(i => i.name);
	window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50).filter(c => c.name != 'Me' && (checkedCategories.indexOf(c.category) >= 0));
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
		
		let line = '"'+profile.name+'\'s Birthday'+(profile.date.includes('?') ? '' : ' ('+(IsBirthdayOver ? getAge(profile.date) : getAge(profile.date)+1)+')')+'","'+formatDate+'","true","'+(profile.date.includes('?') ? '' : ('Born ' + profile.date))+'","true"';
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
	//check parameter
	if(typeof profileName == 'object')
		profileName = profileName.innerText;
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.replace(' ', '');
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.substring(0, profileName.indexOf(' '));
	
	//select profile from id
	let profile = window['profileList'].find( function(n) {
        return n.id == profileName;
    });
	if(profile == null) return;
	
	let currentProfile = null;
	let profiles = document.querySelectorAll('#profile div');
	if(profiles.length > 0)
	{
		let currentProfileName = profiles[0].id;
		currentProfile = window['profileList'].filter( function(n) {
			return n.id == currentProfileName;
		})[0];

		let friendFound = window['friendList'].find( function(p) {
			return p.id == (currentProfile.id + '-' + profile.id) || p.id == (profile.id + '-' + currentProfile.id);
		}) != undefined;
		
		//if(friendFound)
		//	console.log('Friend found! ' + currentProfile.name + ' x ' + profile.name);
		
		window['friendMode'] = friendFound && window.innerWidth > 360;
		//FRIEND MODE: left is profile, right is currentProfile
	}
	
	//remove friend mode if detected before add class
	if(document.querySelector('#profile').classList.contains('friend-mode'))
		window['friendMode'] = false;
	
	//friend: selected found and has pairing with current
	let friend = window['friendList'].find( function(p) {
		if(currentProfile == null) return false;
		return p.id == (currentProfile.id + '-' + profile.id) || p.id == (profile.id + '-' + currentProfile.id);
	});
				
	document.querySelector('#profile').innerHTML = '';
	
	//if mandatory fields filled or by setting
	let simplified = profile.intro == undefined || !window['expanded'];
	//if friend found
	let friendMode = window['friendMode'];
	
	let idBox = document.createElement('div');
	idBox.id = profile.id;
	idBox.style.width = '90%';
	idBox.style.maxWidth = simplified || friendMode ? '440px' : '640px';
	idBox.style.margin = 'auto';
	idBox.style.padding = '3px';
	
		let profileBox = document.createElement('div');
		profileBox.classList.add('profile-box');
	
			let profileBoxImg = document.createElement('div');
			profileBoxImg.classList.add('profile-box-img');

			let friendImage = '';
			if(friendMode && friend != undefined)
			{
				friendImage = friend.image;
				if(friend.id !== (profile.id + '-' + currentProfile.id))
				{
					//flip profiles order by friend id
					//FRIEND MODE: left is original currentProfile, right is profile
					let tempProfile = currentProfile;
					currentProfile = profile;
					profile = tempProfile;
				}
			}
			
			if(profile.landscapes == undefined) profile.landscapes = [];
			if(profile.portraits == undefined) profile.portraits = [];
			let allImages = profile.landscapes.concat(profile.portraits);
			
			//if one image, either from profileName, or friend if friend mode
			let image1Source = profile.image;
			if(allImages.length > 0) image1Source = randomArrayItem(allImages);
			if(friendMode) image1Source = friendImage;
			
			//second image is friend mode only
			let image2Source = profile.image;
			if(friendMode)
			{
				if(currentProfile.landscapes == undefined) currentProfile.landscapes = [];
				if(profile.portraits.length == 0) profile.portraits.push(profile.image);
				if(currentProfile.portraits == undefined) currentProfile.portraits = [];
				if(currentProfile.portraits.length == 0) currentProfile.portraits.push(currentProfile.image);
				image2Source = addBackgroundUrlClause(randomArrayItem(profile.portraits)) + ', ' + addBackgroundUrlClause(randomArrayItem(currentProfile.portraits));
			}
			
			profileBoxImg.style.backgroundImage = addBackgroundUrlClause(image1Source);
			profileBoxImg.setAttribute('alt', friendMode ? image2Source : addBackgroundUrlClause(image2Source));
		
			profileBox.appendChild(profileBoxImg);
			
			let profileTable = document.createElement('table');
			
				let profileTableBody = document.createElement('tbody');
				
					let row = document.createElement('tr');
					
					//--NAME LABEL--//
					//name label not present in friend mode
					if(!friendMode)
					{
						let cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = simplified ? nameLabel : nameWithNicknameLabel;
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					//--NAME VALUE--//
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						if(friendMode)
							cell.classList.add('profile-friends');
						
							let cellDiv = document.createElement('div');
							//shift first value left in friend mode
							if(friendMode)
								cellDiv.classList.add('shift-left');
							
							//nickname not present in friend mode
							if(!friendMode && !simplified)
								cellDiv.innerHTML = ' (' + superscriptText(profile.nickname) + ')';
								
								//name clickable if friend mode
								let span = document.createElement(friendMode ? 'a' : 'span');
								span.classList.add('profile-name');
								span.innerText = profile.name;
								if(friendMode) 
								{	
									span.href = 'javascript:void(0)';
									span.addEventListener("click", function() {
										generateProfileFromJSON(this);
										document.querySelector('#profile').scrollIntoView();
									});
									span.addEventListener("contextmenu", function(e) {
										e.preventDefault();
										window['expanded'] = !window['expanded'];
										generateProfileFromJSON(this);
										document.querySelector('#profile').scrollIntoView();
										window['expanded'] = !window['expanded'];
									}, false);
								}
								cellDiv.insertBefore(span, cellDiv.childNodes[0]);
								
							cell.appendChild(cellDiv);
							
						row.appendChild(cell);
						
						//shift second value right in friend mode
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							cellDiv.classList.add('shift-right');
							
								span = document.createElement('a');
								span.classList.add('profile-name');
								span.innerText = currentProfile.name;
								span.href = 'javascript:void(0)';
								span.addEventListener('click', function() {
									generateProfileFromJSON(this);
									document.querySelector('#profile').scrollIntoView();
								});
								cellDiv.appendChild(span);
								
							cell.appendChild(cellDiv);
							row.appendChild(cell);
						}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
					//--DOB LABEL--//
					if(!friendMode)
					{
						cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = dobLabel;
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					//--DOB VALUE--//
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						
							cellDiv = document.createElement('div');
							//shift first value left in friend mode
							if(friendMode)
								cellDiv.classList.add('shift-left');
							
								let DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//dob comment only appears if single profile
								DOBspan.innerHTML = (simplified ? processOption(profile.dob, false) : superscriptText(profile.dob)) + (!friendMode && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
								
								//if dob is not in full, show as <dd MMM>
								if(DOBspan.innerHTML.includes('????')) {
									DOBspan.innerHTML = month[parseInt(profile.dob.substring(5,7))-1] + ' ' + parseInt(profile.dob.substring(8,10)) + (!friendMode && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
									if(profile.dob.substring(10).length === 3)
										DOBspan.innerHTML += simplified ? processOption(profile.dob.substring(10), false) : superscriptText(profile.dob.substring(10));
								}
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							//shift second value right in friend mode
							if(friendMode)
							{
								cellDiv = document.createElement('div');
								cellDiv.classList.add('shift-right');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								DOBspan.innerHTML = processOption(currentProfile.dob, false) + (!friendMode && !simplified && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
								cell.appendChild(cellDiv);
							}
						
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					if(!friendMode)
					{
						//--PROFILE LABEL--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							// if(friendMode) cell.style.textAlign = 'center';
							cell.innerText = profileLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--PROFILE VALUE--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								// if(friendMode)
									// cellDiv.classList.add('shift-left');
								cellDiv.innerText = profile.profile;
								cell.appendChild(cellDiv);
								
								// if(friendMode)
								// {
									// cellDiv = document.createElement('div');
									// cellDiv.innerText = profile.profile;
									// cell.appendChild(cellDiv);
								// }
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--POINTERS LABEL--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.classList.add('tr-caption');
							cell.classList.add('points');
							// if(friendMode) cell.style.textAlign = 'center';
							cell.innerText = turningPointLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--POINTERS VALUE--//
						row = document.createElement('tr');
							
							cell = document.createElement('td');
								
								cellDiv = document.createElement('div');
								// if(friendMode)
									// cellDiv.classList.add('shift-left');
								// if(!friendMode && !simplified)
									// cellDiv.innerHTML = Object.keys(profile.turningPoint).map((item, i, arr) => {
										// return superscriptText(profile.turningPoint[item]);
									// }).join('|'); 
								// else
									cellDiv.innerHTML = Object.keys(profile.turningPoint).map((item, arr) => {
										return simplified ? processOption(profile.turningPoint[item], false) : superscriptText(profile.turningPoint[item]);
									}).join('|');
									
							cell.appendChild(cellDiv);
										
							// if(friendMode)
							// {
								// cellDiv = document.createElement('div');
								// cellDiv.innerHTML = processOption(currentProfile.turningPoint.soloDebut, false)
											// + "|" + processOption(currentProfile.turningPoint.swimsuitPhotobook, false) 
											// + "|" + processOption(currentProfile.turningPoint.isMarried, false);
								// cell.appendChild(cellDiv);
							// }
						
							row.appendChild(cell);
							
						profileTableBody.appendChild(row);
					}
					
					if(!friendMode && !simplified)
					{
						//--INTRO LABEL--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = introLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--INTRO VALUE--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerHTML = superscriptText(profile.intro);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--DESCRIPTION LABEL--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = descriptionLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--DESCRIPTION VALUE--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerHTML = superscriptText(profile.description);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--RATING LABEL--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = ratingLabel;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--RATING VALUE--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							// cell.innerText = ratingAsStars(profile.rating, 5);
							cell.appendChild(ratingAsStars(profile.rating, maxRating));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//any friends with one profile from selected
						let profileFriendsList = window['friendList'].filter( function(p) {
							return p.id.endsWith(profile.id) || p.id.startsWith(profile.id);
						});
						if(profileFriendsList.length > 0)
						{
							//--FRIENDS LABEL--//
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								cell.innerText = friendsLabel;
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
							
							//--FRIENDS VALUE--//
							row = document.createElement('tr');
							
								cell = document.createElement('td')
								
									cellDiv = document.createElement('div');
									cellDiv.classList.add('profile-friends');
									
									let profileFriends = [];
									//create name array and sort
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
						
						//--SOCIAL LABEL--//
						if(!friendMode) {
							row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = socialLabel;
							row.appendChild(cell);
							
							profileTableBody.appendChild(row);
						}
						
						//--SOCIAL VALUE--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								//shift first value left in friend mode
								if(friendMode && currentProfile.social)
									cellDiv.classList.add('shift-left');
								
								if(profile.social.twitter)
								{
									let twitterSpan = document.createElement('a');
									twitterSpan.classList.add('profile-social');
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
									instagramSpan.classList.add('profile-social');
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
									youtubeSpan.classList.add('profile-social');
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
								
								//shift second value right in friend mode	
								if(friendMode && currentProfile.social) {		
									cellDiv = document.createElement('div');
									// cellDiv.id = 'currentProfile-social';
									cellDiv.classList.add('shift-right');
									
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
			
			if(!friendMode && !simplified)
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
	
	if(!friendMode)
		document.querySelector('#profile').classList.remove('friend-mode');
	else
		document.querySelector('#profile').classList.add('friend-mode');
	
	document.querySelector('#profile').appendChild(idBox);	
	document.querySelector('#profile').style.display = '';
	
	addProfileEvents();
	addAgeAfterDOB();
	addStatusPopUp();
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
			days: Math.abs(diff),
			dob: other.date,
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
	if(document.querySelector('.points') == null) return;
	document.querySelector('.points').addEventListener('mouseover', function(event) {
		event.target.innerHTML = '<div class=\"points-note\">' + statusPopup + '</div>' + event.target.innerHTML;
	});
	document.querySelector('.points').addEventListener('mouseout', function(event) {
		if (event.target.querySelector('.points-note') != null) event.target.querySelector('.points-note').remove();
	});
}

//add age after DOB span
function addAgeAfterDOB(suffix = 'years ago') {
	if(document.querySelector('#profile').classList.contains('friend-mode')) return;
	let profile = window['profileList'].filter(p => p.id === document.querySelector('#profile').firstChild.id)[0];
	let DOBspan = document.getElementById(profile.id).getElementsByClassName('DOB')[0];
	let age = getAge(profile.dob);
	let simplified = profile.intro == undefined || !window['expanded'];
	if (age != undefined && age > 0 && !simplified)
		DOBspan.innerHTML = DOBspan.innerHTML.concat(' [').concat(age.toString()).concat(' ' + suffix + ']');
}

function getAge(DOB) {
	//support for date types: yyyy.MM.dd, ????.MM.dd, ????.??.??
	if(DOB.includes('?')) return 0;
	let birthDateStr = DOB.replace('.', '-').replace('.', '-');
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone});
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone});
	// console.log(today.diff(birthDate, ['years','months','days','hours','minutes','seconds']));
	return parseInt(today.diff(birthDate, 'years').years);
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
		window['excludeMarried'] = document.querySelector('#cb-married').checked;
		let marriedList = window['profileList'].filter(profile => window['excludeMarried'] ? !processOption(profile.turningPoint.isMarried, true) : true);
		window['timelineDOBlist'] = createDOBlist(marriedList, 1, 35, true);
		renderWantedList();
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