//--SETTINGS--//
const isMobile = function() {
    const match = window.matchMedia('(pointer:coarse)');
    return (match && match.matches && window.innerWidth <= 480);
};
const isLocal = window.location.href.includes('file://');
const maxRating = 5;
const calendarCategories = ['profile', 'seiyuu', 'doaxvv', 'hololive', 'idolypride'];
//what to filter for calendar, mapping for category, see data.json
const labels = {
	name: 'Name',
	nameWithNickname: 'Name (Nickname)',
	dob: 'Date of Birth',
	ageSuffix: 'years ago',
	profile: 'Profile',
	turningPoint: 'Singer Debut|Swimsuit Photobook|Married',
	statusPopup: 'As answered haphazardly by Uesaka Sumire (and expanded on by me) the three "turning points" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism?)',
	intro: 'How I came to know of her',
	description: 'Why would she be "wanted" by me',
	rating: 'Wanted Level',
	friends: 'Known Acquaintances',
	social: 'Social Media',
};
const timezone = 'Asia/Tokyo';
const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const source = 'https://knneo.github.io/profile-list/data.json';

//--STARTUP--//
window.addEventListener('load', startup);

//--FUNCTIONS--//
function startup() {
	initializeVariables();
	runLoader();
	getJson(source, function(response) {
		profileListJson = response;
		loadProfileLists();
	});
}

function initializeVariables() {
	window['debug'] = false;
	window['profiles'] = [];
	window['simple'] = false;
	window['defaultProfile'] = {};	
	window['excludeMarried'] = false;
	window['friendMode'] = false;	
	window['currentMonth'] = 0;	
	window['profileList'] = [];
	window['calendarList'] = [];
	window['friendList'] = [];
	window['timelineDOBlist'] = [];
	window['calendarDOBlist'] = [];
	window['expanded'] = false;
	window['loading'] = true;
	window['search'] = '';
}

function loadProfileLists() {
	window['profileList'] = profileListJson.filter(n => !(n.inactive === true) && n.rating);
	window['calendarList'] = profileListJson.filter(n => !(n.inactive === true) && calendarCategories.includes(n.category));
	window['friendList'] = profileListJson
		.filter(n => !(n.inactive === true) && n.category == 'friends')
		.sort(function(a,b) { 
			return b.id.split('-').length - a.id.split('-').length;
		}); // 3-friend id on top of list regardless of sort order
	window['defaultProfile'] = profileListJson.find(n => n.category == 'default');
	window['timelineDOBlist'] = createDOBlist(window['profileList'], 1, 35, true);
	window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50);
	
	stopLoader();
	renderWantedList();
}

function renderWantedList() {
	generateWantedList();
	loadTimeline();
	// createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, window['calendarDOBlist'], true);
	generateMiniCalendar(
		luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year,
		luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).month-1, // month is zero-based
		window['calendarDOBlist'], 
		true);
	updateTime();
	toggleView(2);
}

function resetProfile() {
	document.querySelector('.profile').innerHTML = '';
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	window['profiles'] = [];
	window['friendMode'] = false;
	toggleView(1);
}

function toggleView(id) {
	//change page
	let isSelect = typeof pageClass == 'string';
	for(let page of document.querySelectorAll('.page'))
	{
		page.classList.add('hidden');
	}
	document.querySelectorAll('.page')[id-1].classList.remove('hidden');
}

function runLoader() {
	if(document.querySelector('.loader').classList.length < 3 ||
		document.querySelector('.loader').classList.contains('bi-hourglass-top'))
	{
		document.querySelector('.loader').classList.remove('bi-hourglass-top');
		document.querySelector('.loader').classList.add('bi-hourglass-split');
	}
	else if(document.querySelector('.loader').classList.contains('bi-hourglass-split'))
	{
		document.querySelector('.loader').classList.remove('bi-hourglass-split');
		document.querySelector('.loader').classList.add('bi-hourglass-bottom');
	}
	else if(document.querySelector('.loader').classList.contains('bi-hourglass-bottom'))
	{
		document.querySelector('.loader').classList.remove('bi-hourglass-bottom');
		document.querySelector('.loader').classList.add('bi-hourglass-top');
	}
	
	if(window['loading']) setTimeout(runLoader, 500);
}

function stopLoader() {
	window['loading'] = false;
	document.querySelector('.loader').classList.add('hidden');
}

function onSearch() {
	// console.log(event.target.value);
	window['search'] = event.target.value;
	filterWantedListBySearch();
}

function filterWantedListBySearch() {
	window['profileList'] = profileListJson
	.filter(n => !(n.inactive === true) 
	&& n.rating 
	&& (n.name.toLowerCase().includes(window['search'].toLowerCase())
	|| (n.nickname?.toLowerCase().includes(window['search'].toLowerCase()) ?? false))
	);
	generateWantedList(true);
}

function clearWantedList() {
	document.getElementById('search').value = '';
	document.querySelector('.profile').innerHTML = '';
	window['profiles'] = [];
	window['friendMode'] = false;
	loadProfileLists();
	generateWantedList();
}

function onTouchStart(e) {
	window['touchY'] = e.touches[0].clientY;
	window['touchX'] = e.touches[0].clientX;
}

function onTouchMove(e) {
	let swipeDown = e.touches[0].clientY - window['touchY'];
	let swipeUp = window['touchY'] - e.touches[0].clientY;
	let swipeLeft = window['touchX'] - e.touches[0].clientX;
	let swipeRight = e.touches[0].clientX - window['touchX'];
	// if(window['debug'])
	// console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
	if(swipeLeft > swipeUp && swipeLeft > swipeDown) {
		console.log('swipeLeft');
		return;
	}
	//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
	if(swipeRight > swipeUp && swipeRight > swipeDown) {
		console.log('swipeRight');
		return;
	}
	//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
	if(swipeDown > swipeLeft && swipeDown > swipeRight) {
		console.log('swipeDown');
		return;
	}
	//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
	if(swipeUp > swipeLeft && swipeUp > swipeRight) {
		console.log('swipeUp');
		return;
	}
}

function onKeyUpWantedListEntry() {
	if (event.key === ' ' || event.key === 'Enter')
		generateProfileFromJSON(this);
}

////WANTED LIST////
function generateWantedList(addReset) {
	let wantedList = document.querySelector('.list');
	wantedList.innerHTML = '';

	if(addReset) {
		let list = document.createElement('li');
		list.appendChild(generateWantedListClear());
		wantedList.appendChild(list);
	}
	
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
		// list.appendChild(generateWantedListIcon(profile.id));
		list.appendChild(generateWantedListEntry(profile.id));
		wantedList.appendChild(list);
	}
	
	//scroll to front
	wantedList.scrollLeft = 0;
}

function generateWantedListIcon(id) {
	let profile = window['profileList'].find( function(n) {
		return n.id == id
	});
	let married = window['excludeMarried'] && processOption(profile.turningPoint.married, true);

	let wanted = document.createElement('span');
	wanted.style.backgroundImage = addBackgroundUrlClause(profile.image);
	wanted.style.backgroundSize = '40px auto';
	wanted.style.backgroundPosition = 'center top';
	wanted.style.backgroundRepeat = 'no-repeat';
	wanted.style.width = '20px';
	wanted.style.height = '20px';
	// wanted.innerText = profile.name;
	if (married)
		wanted.classList.add('married');
	else
	{
		wanted.classList.add('item');
		wanted.addEventListener('click', function() {
			generateProfileFromJSON(this);
			// document.querySelector('.profile').scrollIntoView();
		});
		wanted.addEventListener('contextmenu', function(e) {
			e.preventDefault();
			window['expanded'] = !window['expanded'];
			generateProfileFromJSON(this);
			// document.querySelector('.profile').scrollIntoView();
			window['expanded'] = !window['expanded'];
		}, false);
	}
	
	return wanted;
}

function generateWantedListEntry(id, autoAdd = []) {
	let profile = window['profileList'].find( function(n) {
		return n.id == id
	});
						
	let married = window['excludeMarried'] && processOption(profile.turningPoint.married, true);

	let wanted = document.createElement(married ? 'span' : 'a');
	wanted.innerText = profile.name;
	wanted.tabIndex = 0;
	if (married)
		wanted.classList.add('married');
	else
	{
		wanted.classList.add('item');
		if(autoAdd.length > 0) wanted.setAttribute('auto-add', autoAdd.join(','));
		wanted.addEventListener('click', function() {
			generateProfileFromJSON(this);
			// if(this.getAttribute('auto-add') != null)
				// for(let add of this.getAttribute('auto-add').split(','))
				// {
					// generateProfileFromJSON(add);
				// }
			// document.querySelector('.profile').scrollIntoView();
		});
		wanted.addEventListener('keyup', onKeyUpWantedListEntry);
		// wanted.addEventListener('contextmenu', function(e) {
			// e.preventDefault();
			// window['expanded'] = !window['expanded'];
			// generateProfileFromJSON(this);
			// document.querySelector('.profile').scrollIntoView();
			// window['expanded'] = !window['expanded'];
		// }, false);
	}
	
	return wanted;
}

function generateWantedListClear() {	
	let wanted = document.createElement('a');
	wanted.classList.add('clear');
	wanted.classList.add('bi');
	wanted.classList.add('bi-x-lg');
	wanted.tabIndex = 0;
	wanted.innerText = ' CLEAR';
	wanted.addEventListener('click', clearWantedList);
	wanted.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			clearWantedList();
	});
	
	return wanted;
}

////TIMELINE////
function loadTimeline(width = 2500) {
	if(document.querySelector('#timeline') == null) return;
	document.querySelector('#timeline').innerHTML = '';
	generateVerticalTimeline('timeline', window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), null, '380px');
	// generateHorizontalTimeline('timeline', window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), width, '160px');
	addTimelineEvents(false);
}

function addTimelineEvents(isHorizontal) {
	//on timeline wheel scroll adjust timeline length ie. redraw
	document.querySelector('#timeline .grid-horiz')?.addEventListener('wheel', function(e) {
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
	// window.addEventListener('scroll', function() {
		// if (document.querySelector('#timeline').querySelectorAll('div').length > 0)
			// document.querySelector('#timeline').querySelector('div').style.opacity = '0';
	// });
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
			let birthDate = new Date(Date.parse(targetDOB.replace('.', '-').replace('.', '-').substring(0, 10)));
			let age = getAge(targetDOB);
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				list.push({
					category: profile.category,
					date: targetDOB.replace('.', '-').replace('.', '-').substring(0, 10),
					name: profile.name,
					currentAge: age
				}); //calendar object
		}
	}
	//to sort the above so oldest is added first in timeline
	if(sort)
		list.sort(function(a, b) {
			return Date.parse(a.date) - Date.parse(b.date)
		});
	return list;
}

////GROUP MODE////
function findFriendIdByProfile(friends) {
	if(window['debug']) console.log('findFriendIdByProfile', friends[1], friends[2]);
	if(typeof friends == 'object' && friends[1] != undefined)
		return window['friendList'].find( function(p) {
				let count = p.id.split('-').length;
				let check0 = (p.id.includes(friends[0].id + '-') || p.id.includes('-' + friends[0].id + '-') || p.id.includes('-' + friends[0].id));
				let check1 = (p.id.includes(friends[1].id + '-') || p.id.includes('-' + friends[1].id + '-') || p.id.includes('-' + friends[1].id));
				let check2 = (friends[2] != undefined && (p.id.includes(friends[2].id + '-') || p.id.includes('-' + friends[2].id + '-') || p.id.includes('-' + friends[2].id)));
				if(window['debug']) console.log(p.id, count, check0, check1, check2);
				return (count == 2 && check0 && check1) || (count == 3 && check0 && check1 && check2);
				//if 3 friends then include 3rd in search
			});
	return null;
}

function setProfileOrderByFriend(list, friend) {
	let newList = [];
	if(window['friendMode'] && friend)
	{
		let ids = friend.id.split('-');
		if(window['debug']) console.log('members',ids);
		for(let i = 0; i < ids.length; i++)
		{
			let f = list[list.map(l => l?.id).indexOf(ids[i])];
			if(window['debug']) console.log('find',f);
			newList.push(f);
		}
	}
	else
		newList.push(list[0]);
	
	if(window['debug']) console.log('setProfileOrderByFriend', list, newList);
	return newList;
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
	//if not found, means reset
	if(profile == null) {
		profile = profileListJson.filter(n => !(n.inactive === true) && n.rating).find( function(n) {
			return n.id == profileName;
		});
	};
	//if still not found, then ignore
	if(profile == null) return;
	//remove friend mode if add to history before
	if(window['profiles'].map(p => p.id).includes(profile.id))
		resetProfile();
	//add selected to first in list: array order will be [profile, currentProfile, previousProfile]
	window['profiles'].unshift(profile);
	if(window['profiles'].length > 3) window['profiles'] = window['profiles'].slice(0,3);
	
	let currentProfile = null;
	let profiles = document.querySelectorAll('.profile div[id]');
	if(profiles.length > 0)
	{
		let currentProfileName = profiles[0].id;
		currentProfile = profileListJson.filter( function(n) {
			return n.id == currentProfileName;
		})[0];

		let friendFound = findFriendIdByProfile(window['profiles']) != null;
		window['friendList'].find( function(p) {
			return p.id == (currentProfile.id + '-' + profile.id) || p.id == (profile.id + '-' + currentProfile.id);
		}) != undefined;
		
		if(friendFound && window['debug'])
			console.log('Friend found! ' + findFriendIdByProfile([currentProfile.id, profile.id]).id);
		
		window['friendMode'] = friendFound;// && window.innerWidth > 360;
		//FRIEND MODE: selected profile is (profile), to be replaced profile is (currentProfile)
	}
	
	//friend: selected found and has pairing with current
	let friend = findFriendIdByProfile(window['profiles']);
	if(window['debug']) console.log('friend', friend);
	//if friend found
	let friendMode = window['friendMode'];

	//if mandatory fields filled or by setting
	window['simple'] = profile.intro == undefined || !window['expanded'];
	let simple = window['simple'];

	let idBox = document.createElement('div');
	idBox.id = window['profiles'][0].id;
	idBox.style.width = '100%';
	
		let profileBox = document.createElement('div');
		profileBox.classList.add('profile-box');
		profileBox.classList.add('box');
			
		profileBox.appendChild(generateProfileImage(window['profiles'], friend));
			
			let profileTable = document.createElement('table');
			
				let profileTableBody = document.createElement('tbody');
				
					//--NAME--//
					let row = document.createElement('tr');
					
					let cell = document.createElement('td');
					cell.appendChild(generateProfileName(window['profiles']));
					row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					//--PROFILE--//
					if(!friendMode)
					{
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.appendChild(generateProfileWithInnerHTML(window['profiles'], labels.profile, 'profile'));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					}
					
					//--DOB--//
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						cell.appendChild(generateProfileDob(window['profiles']));
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					//--TURNING POINTS--//
					if(!friendMode)
					{
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.appendChild(generateProfilePointers(window['profiles']));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					}
										
					if(!friendMode && !simple)
					{
						//--INTRO--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.appendChild(generateProfileWithInnerHTML(window['profiles'], labels.intro, 'intro'));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);

						//--DESCRIPTION--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.appendChild(generateProfileWithInnerHTML(window['profiles'], labels.description, 'description'));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						//--RATING--//
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.appendChild(generateProfileRating(window['profiles']));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
					}
					
					//--SOCIAL--//
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						cell.appendChild(generateProfileSocial(window['profiles']));
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);						
					
					//--FRIENDS--//
					//any friends with one profile from selected
					let profileFriendsList = window['friendList'].filter( function(p) {
						return p.id.includes(profile.id) && 
						(currentProfile == null || p.id.includes(currentProfile?.id)
						);
					});
					if(window['debug'])
						console.log('profileFriendsList', profileFriendsList);
					
					if(profileFriendsList.length > 0)
					{
						filterWantedListByFriends(profileFriendsList, profile, currentProfile);
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			// if(!friendMode && !simple)
			// {
				// profileBox.appendChild(generateProfileComments(window['profiles']));
			// }
	
		idBox.appendChild(profileBox);
	
	document.querySelector('.profile').innerHTML = '';
	document.querySelector('.profile').appendChild(idBox);
	document.querySelector('.profile').style.height = simple || friendMode ? '' : '100%';
	document.querySelector('.view').style.display = '';
	
	addProfileEvents();
	toggleView(4);
	
	if(!friendMode)
		document.querySelector('.profile').classList.remove('friend-mode');
	else {
		document.querySelector('.profile').classList.add('friend-mode');
	}
	
	// addAgeAfterDOB(labels.ageSuffix);
	// addStatusPopup(window['simple']);
}

function generateProfileImage([profile, currentProfile, previousProfile]) {
	if(window['debug']) console.log('generateProfileImage');
	let friend = findFriendIdByProfile([profile, currentProfile, previousProfile]);
	[profile, currentProfile, previousProfile] = setProfileOrderByFriend([profile, currentProfile, previousProfile], friend);

	let profileBoxImg = document.createElement('img');
	profileBoxImg.classList.add('profile-box-img');

	//if one image, either from profile, or friend image if friend mode
	//subsequent images are friend mode only, portraits only
	let image1Source = profile.image;
	if(profile.landscapes == undefined) profile.landscapes = [];
	if(profile.portraits == undefined) profile.portraits = [];
	let allImages = window['friendMode'] ? [friend.image] : profile.portraits; //TODO: friend also portraits/landscapes?
	if(allImages.length < 1) allImages = [image1Source];
	profileBoxImg.src = randomArrayItem(allImages);
	//click finds profile images list and shows another (no dupe check)
	//in friend mode click has no effect
	if(!window['friendMode'])
	{
		profileBoxImg.addEventListener('click', function() {
			this.src = dupeStringCheck(this.src, getRandomProfileImage(this.parentElement.parentElement.id));
		});
		profileBoxImg.addEventListener('error', function() {
			this.src = dupeStringCheck(this.src, getRandomProfileImage(this.parentElement.parentElement.id));
		});
	}

	return profileBoxImg;
}

function getRandomProfileImage(id) {
	let profile = profileListJson.find( function(n) {
        return n.id == id;
    });
	return randomArrayItem(profile?.portraits ?? []);
}

function generateProfileName([profile, currentProfile, previousProfile]) {
	if(window['debug']) console.log('generateProfileName');
	let friend = findFriendIdByProfile([profile, currentProfile, previousProfile]);
	let list = setProfileOrderByFriend([profile, currentProfile, previousProfile], friend);
	// console.log(list);
	
	let cell = document.createElement('div');
	cell.style.display = 'flex';
    cell.style.justifyContent = 'space-evenly';
		
	//--NAME VALUE--//
	for(let item of list)
	{
		let cellDiv = document.createElement('div');
		
		// name clickable if friend mode
		let span = document.createElement(window['friendMode'] ? 'a' : 'span');
		span.classList.add('profile-name');
		span.title = item.nickname && item.nickname.length > 0 ? processOption(item.nickname, false) : '';
		span.innerText = item.name;
		if(window['friendMode']) 
		{	
			span.href = 'javascript:void(0)';
			span.addEventListener('click', function() {
				generateProfileFromJSON(this);
			});
			span.addEventListener('keyup', onKeyUpWantedListEntry);
		}
		else if(item.nickname && item.nickname.length > 0)
		{
			span.addEventListener('click', function() {
				popupText(this.title);
			});
		}
		cellDiv.appendChild(span);
		
		cell.appendChild(cellDiv);	
	}
	
	return cell;
}

function generateProfileDob([profile, currentProfile, previousProfile]) {
	if(window['debug']) console.log('generateProfileDob');
	let friend = findFriendIdByProfile([profile, currentProfile, previousProfile]);
	let list = setProfileOrderByFriend([profile, currentProfile, previousProfile], friend);
	
	let cell = document.createElement('div');
	cell.style.display = 'flex';
    cell.style.justifyContent = 'space-evenly';
	
	//--DOB LABEL--//
	// if(!window['friendMode'])
	// {
		// let cellDiv = document.createElement('div');
		// cellDiv.classList.add('profile-box-label');
		// cellDiv.innerText = labels.dob;
		// cell.appendChild(cellDiv);
	// }
										
	//--DOB VALUE--//
	for(let item of list)
	{
		let cellDiv = document.createElement('div');
		cellDiv.classList.add('shift-center');
		//shift first value left in friend mode
		// if(window['friendMode'])
			// cellDiv.classList.add('shift-left');
		// else
			// cellDiv.classList.add('shift-right');
		
		let DOBspan = document.createElement('span');
		DOBspan.classList.add('DOB');
		
		let age = getAge(item.dob);
		if (age != undefined && age > 0) {
			DOBspan.title = `${age} ${labels.ageSuffix}`;
			DOBspan.addEventListener('click', function() {
				popupText(this.title);
			});
		}
		//dob comment only appears if single profile
		DOBspan.innerHTML = (window['simple'] ? processOption(item.dob, false) : superscriptText(item.dob)) + (!window['friendMode'] && !window['simple'] && item.dobComment ? (' (' + item.dobComment + ')') : '');
		
		//if dob is not in full, show as <dd MMM>
		if(DOBspan.innerHTML.includes('????')) {
			DOBspan.innerHTML = months[parseInt(item.dob.substring(5,7))-1] + ' ' + parseInt(item.dob.substring(8,10)) + (!window['friendMode'] && !window['simple'] && item.dobComment ? (' (' + item.dobComment + ')') : '');
			if(item.dob.substring(10).length === 3)
				DOBspan.innerHTML += window['simple'] ? processOption(item.dob.substring(10), false) : superscriptText(item.dob.substring(10));
		}
		cellDiv.appendChild(DOBspan);
		cell.appendChild(cellDiv);
	}
								
	//shift second value right in friend mode
	// if(window['friendMode'])
	// {
		// if((previousProfile || currentProfile) != undefined)
		// {
			// cellDiv = document.createElement('div');
			// cellDiv.classList.add('shift-right');
			// cellDiv.style.position = 'relative';
		
			// DOBspan = document.createElement('span');
			// DOBspan.classList.add('DOB');
			// DOBspan.innerHTML = processOption((previousProfile || currentProfile).dob, false) + (!window['friendMode'] && !window['simple'] && (previousProfile || currentProfile).dobComment != '' ? (' (' + (previousProfile || currentProfile).dobComment + ')') : '');
			// cellDiv.appendChild(DOBspan);
			// cell.appendChild(cellDiv);
		// }
		
		// if(previousProfile != undefined && currentProfile != undefined)
		// {
			// cellDiv = document.createElement('div');
			// cellDiv.style.textAlign = 'center';
			
				// DOBspan = document.createElement('span');
				// DOBspan.classList.add('DOB');
				// DOBspan.style.position = 'absolute';
				// DOBspan.style.left = '0';
				// DOBspan.style.right = '0';
				// DOBspan.innerHTML = processOption(currentProfile.dob, false) + (!window['friendMode'] && !window['simple'] && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
				// cellDiv.appendChild(DOBspan);
				
			// cell.appendChild(cellDiv);
		// }
	
	// }

	return cell;
}

function generateProfileWithInnerHTML([profile], label, property) {
	let cell = document.createElement('div');
	if(profile[property] == undefined || profile[property].length == 0) return cell;
	
	//--LABEL--//
	// let cellDiv = document.createElement('div');
	// cellDiv.classList.add('profile-box-label');
	// cellDiv.innerText = label;
	// cell.appendChild(cellDiv);
	
	//--VALUE--//
	cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');
	cellDiv.innerHTML = superscriptText(profile[property]);
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfilePointers([profile]) {
	let points = Object.keys(profile.turningPoint).map((item, index, arr) => {
		return {
			label: labels.turningPoint.split('|')[index],
			value: processOption(profile.turningPoint[item], false),
			comment: profile.turningPoint[item].includes('[') ? findComment(profile, profile.turningPoint[item].substring(profile.turningPoint[item].indexOf('['))) : null, 
		}
	});
	if(window['debug'])
		console.log(points);
	
	let cell = document.createElement('div');
	cell.classList.add('profile-pointers');
	
	for(let point of points)
	{
		let cellContainer = document.createElement('div');

		//--POINTERS LABEL--//
		let cellDiv = document.createElement('div');
		cellDiv.classList.add('profile-box-label');
		cellDiv.classList.add('page-align');
		cellDiv.classList.add('tr-caption');
		cellDiv.innerText = point.label;
		cellContainer.appendChild(cellDiv);

		//--POINTERS VALUE--//
		cellDiv = document.createElement('div');
		cellDiv.classList.add('page-align');
		// cellDiv.classList.add('shift-right');
		if(point.comment != null) {
			cellDiv.title = point.comment;
			cellDiv.classList.add('points');
			cellDiv.addEventListener('click', function() {
				popupText(processComment(point.comment, profile.links));
			});
		}
		cellDiv.innerHTML = point.value;
		cellContainer.appendChild(cellDiv);
		
		cell.appendChild(cellContainer);
		
		//--LINE BREAK--//
		if(points.indexOf(point) < points.length - 1)
		{
			let hr = document.createElement('hr');
			hr.style.margin = '0.2em';
			cell.appendChild(hr);	
		}	
	}
						
	return cell;		
}

function generateProfileRating([profile]) {
	let cell = document.createElement('div');
	
	//--RATING LABEL--//
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('profile-box-label');
	cellDiv.innerText = labels.rating;
	cell.appendChild(cellDiv);
	
	//--RATING VALUE--//
	cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-right');
	cellDiv.appendChild(ratingAsStars(profile.rating, maxRating));
	cell.appendChild(cellDiv);

	return cell;
}

function filterWantedListByFriends(profileFriendsList, profile, currentProfile) {
	//filter as search
	let friendsSearch = profileFriendsList.map(f => {
		// let otherMultiple = f.id.split('-').length > 2;
		return f.id.replace(profile.id, '')
		.replace(currentProfile != null ? currentProfile.id : '', '')
		.replace(/-/g, '');
	}).filter(p => !window['profiles'].map(p => p.id).includes(p));
	// console.log('friendsSearch', friendsSearch);
	window['profileList'] = profileListJson.filter(n => !(n.inactive === true) && n.rating && friendsSearch.includes(n.id));
	generateWantedList(true);
}

function generateProfileFriends([profile], friends) {
	if(window['debug'])
		console.log('generateProfileFriends');
	let cell = document.createElement('div');
	
	//--FRIENDS LABEL--//
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('profile-box-label');
	cellDiv.innerText = labels.friends;
	cell.appendChild(cellDiv);
	
	//--FRIENDS VALUE--//
	cellDiv = document.createElement('div');
	cellDiv.classList.add('profile-friends');
	cellDiv.classList.add('shift-right');
	
	let friendsList = [];
	//create name array and sort
	for(let friend of friends)
	{
		let splits = friend.id.split('-');
		for(let item of splits)
		{
			if(item != profile.id && friendsList.indexOf(item) < 0)
				friendsList.push(item);
		}
	}
	if(window['debug'])
		console.log('friendsList', friendsList);
	
	for(let friend of friendsList.sort())
	{
		if(window['debug']) console.log('friend', friend);
		let span = document.createElement('span');
		span.style.position = 'relative';
		span.innerText = ' ';
		cellDiv.appendChild(span);
	
		let entry = window['friendList'].filter( function(p) {
			return p.id.includes(profile.id) && p.id.includes(friend);
		});
		if(window['debug']) console.log('entry', entry);
		
		let remaining = [];
		if(entry.length == 1)
			remaining = entry[0].id.replace(profile.id, '').replace(friend, '').split('-').filter( function(p) {
				return p != '';
			}) || [];
		if(window['debug']) console.log('remaining', remaining);

		cellDiv.appendChild(generateWantedListEntry(friend, remaining));
	}
	
	cell.appendChild(cellDiv);
	
	return cell;
}

function generateProfileSocial([profile, currentProfile, previousProfile]) {
	if(window['debug']) console.log('generateProfileSocial');
	// let friend = findFriendIdByProfile([profile, currentProfile, previousProfile]);
	// [profile, currentProfile] = setProfileOrderByFriend([profile, currentProfile, previousProfile], friend);
	
	let cell = document.createElement('div');
	
	//--SOCIAL VALUE--//	
	if(!window['friendMode'] && profile.social)
		cell.appendChild(generateProfileSocialIcons(profile.social));
	
	if(!window['friendMode'] && cell.childNodes.length > 0 && profile.intro && profile.description && profile.rating)
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = 'javascript:void(0)';
		span.title = 'My Comments';
		span.addEventListener('click', function() {
			popupText(profile.intro + 
			'<p style="font-style: italic;">"' + processOption(profile.description, false) + 
			'"</p>Rating: ' + ratingAsStars(profile.rating, maxRating)?.outerHTML);
			let dialog = document.querySelector('.dialog dialog');
			// dialog.style.width = '380px';
			// dialog.style.maxWidth = '360px';
		});
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-chat-heart-fill');
		span.appendChild(icon);
		
		cell.childNodes[0].insertBefore(span, cell.childNodes[0].childNodes[0]);
	}
	
	return cell;
}

function generateProfileSocialIcons(social) {
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');
	
	if(social.twitter)
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = 'https://twitter.com/' + social.twitter;
		span.target = '_blank';
		span.title = 'Twitter';
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-twitter');
		span.appendChild(icon);
		
		cellDiv.appendChild(span);
	}
	
	if(social.instagram)
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = 'https://www.instagram.com/' + social.instagram;
		span.target = '_blank';
		span.title = 'Instagram';
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-instagram');
		span.appendChild(icon);
		
		cellDiv.appendChild(span);
	}
	
	if(social.youtube)
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = 'https://www.youtube.com/' + social.youtube;
		span.target = '_blank';
		span.title = 'YouTube';
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-youtube');
		span.appendChild(icon);
		
		cellDiv.appendChild(span);
	}
	
	if(social.twitch)
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = 'https://www.twitch.tv/' + social.twitch;
		span.target = '_blank';
		span.title = 'Twitch';
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-twitch');
		span.appendChild(icon);
		
		cellDiv.appendChild(span);
	}
	
	for(let page of Object.keys(social).filter(k => !['twitter', 'instagram', 'youtube', 'twitch'].includes(k)))
	{
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.href = social[page];
		span.target = '_blank';
		span.title = 'External Link';
		
		let icon = document.createElement('i');
		icon.classList.add('bi');
		icon.classList.add('bi-file-earmark-fill');
		span.appendChild(icon);
		
		cellDiv.appendChild(span);		
	}
	
	return cellDiv;
}

function generateProfileComments([profile]) {
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('profile-box-comments');
	cellDiv.innerHTML = processComments(profile.comments, profile.links);
	
	//special cases
	cellDiv.innerHTML = cellDiv.innerHTML.replace('1976.09.20', '<span class=\'disguise\' class=\'DOB\'>1976.09.20</span>');
	if(window.location.href.includes('knneo.github.io'))
		cellDiv.innerHTML = cellDiv.innerHTML.replace(/knwebreports.blogspot.com/gi, 'knneo.github.io/blog/pages');
	
	return cellDiv;
}

function addProfileEvents() {
	let profileBox = document.querySelector('.profile-box');
	
	profileBox.addEventListener('touchstart', onTouchStart);
	profileBox.addEventListener('touchmove', onTouchMove, false);
	
	//add event listener for image switch but through clicking on profile box
	// profileBox.addEventListener('click', function() {
		// let boxImg = this.querySelector('.profile-box-img');
		// let temp = boxImg.getAttribute('alt');//boxImg.style.backgroundImage;
		// let count = temp.split('url(').length - 1;
		// if(boxImg.src == temp) return;
		// boxImg.setAttribute('alt', boxImg.src);
		// boxImg.src = temp;
		// if(window['debug']) console.log('addProfileEvents.click',temp);
		// if(count > 1) 
		// {
			// boxImg.style.backgroundRepeat = 'no-repeat';
			// boxImg.style.backgroundSize = Math.floor(100/count) + '% auto';
			// boxImg.style.backgroundPosition = 'left, ' + (count > 2 ? 'center, ' : '') + 'right';
		// }
		// else
		// {
			// boxImg.style.backgroundSize = 'contain';
			// boxImg.style.backgroundRepeat = 'no-repeat';
			// boxImg.style.backgroundPosition = 'center';
		// }
	// });
	
	//double click profile box go up to list of names
	 // profileBox.addEventListener('dblclick', resetProfile);
}

////HELPER////
function addBackgroundUrlClause(url) { return "url('" + url + "')"; }
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function processComment(comment, refs) {
	let commentArr = [];
	let added = false;
	for(let ref of refs)
	{
		let refText = ref.substring(0, ref.indexOf('}')+1);
		let refLink = ref.replace(refText, '');
		if(window.location.href.includes('knneo.github.io'))
			refLink = refLink.replace(/knwebreports.blogspot.com/gi, 'knneo.github.io/blog/pages');
		let replaced = comment.replace(refText, '<a target="_blank" href="' + refLink + '">' + refText + '</a>');
		if(window['debug']) console.log('processComment', replaced, comment);
		if(replaced != comment)
		{
			commentArr.push(replaced.replace('{','').replace('}',''));
			added = true;
		}
	}
	if(!added)
		commentArr.push(comment);
	return superscriptText(commentArr.join('<br/>'));
}
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
				if(window['debug']) console.log('processComments', replaced, comment);
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
function dupeStringCheck(source, compare) { return source == compare ? source : compare; }
function findComment(profile, commentIndexStr) { return profile.comments.find(c => c.includes(commentIndexStr))?.replace(commentIndexStr,''); }
function addStatusPopup(simple) {
	if(simple || labels.statusPopup.length == 0) return;
	if(document.querySelector('.points') == null) return;
	document.querySelector('.points').addEventListener('mouseover', function(event) {
		event.target.innerHTML = '<div class=\"points-note\">' + labels.statusPopup + '</div>' + event.target.innerHTML;
	});
	document.querySelector('.points').addEventListener('mouseout', function(event) {
		if (event.target.querySelector('.points-note') != null) event.target.querySelector('.points-note').remove();
	});
}

////CHECK////
function daysFromMe() {
	let me = window['timelineDOBlist'].filter(t => t.name == 'Me')[0];
	let others = window['timelineDOBlist'].filter(t => t.name != 'Me');
	console.log('with respect to ' + me.date + ':');
	let away = new Array();
	for(let other of others)
	{
		if(other.date.includes('????')) continue;
		let DOB = other.date;
		let myDateStr = me.date.replace('.', '-').replace('.', '-'); //yyyy.MM.dd -> yyyy-MM-dd
		let myDate = myDateStr.substring(0, 10);
		let birthDateStr = DOB.replace('.', '-').replace('.', '-');
		let birthDate = birthDateStr.substring(0, 10);
		let diff = luxon.DateTime.fromISO(myDate).setZone(timezone).diff(luxon.DateTime.fromISO(birthDate), 'days').days;
		away.push({
			name: other.name,
			days: Math.abs(diff),
			dob: other.date,
		});
	}
	
	console.log(away.sort((a,b) => a.days - b.days));
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
				console.log(pair.id + ' has exact duplicates');
		}
		
		//check ids but of different positions
		for(let pair of window['friendList'])
		{
			let splits = pair.id.split('-');
			let result = window['friendList'].filter( function(f) {
				return f.id == (splits[1] + '-' + splits[0]);
			});
			if(result != undefined && result.length > 0)
				console.log(pair.id + ' has duplicates of different positions');
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

////DIALOG////
function popupText(input) {
	let dialog = createOrUpdateDialog(input);
	// dialog.style = '';
	if(document.querySelector('.dialog') == null)
	{
		let dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		dialogDiv.appendChild(dialog);
		document.body.appendChild(dialogDiv);
	}
	dialog.showModal();
}

function createOrUpdateDialog(html) {
	let dialog = document.querySelector('dialog');
	if(dialog == null)
	{
		dialog = document.createElement('dialog');
	}
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	dialog.innerHTML = html;
	dialog.addEventListener('click', closeAllDialogs);
	return dialog;
}

function openDialog(dialog) {
	dialog.showModal();
}

function closeAllDialogs() {
	for(let dialog of document.querySelectorAll('dialog'))
	{
		dialog.close();
	}
}

//add age after DOB span
function addAgeAfterDOB(suffix) {
	if(document.querySelector('.profile').classList.contains('friend-mode')) return;
	let profile = window['profileList'].filter(p => p.id === document.querySelector('.profile').firstChild.id)[0];
	let DOBspan = document.getElementById(profile?.id)?.getElementsByClassName('DOB')[0];
	if(DOBspan != null)
	{
		let age = getAge(profile.dob);
		window['simple'] = profile.intro == undefined || !window['expanded'];
		if (age != undefined && age > 0 && !window['simple'])
			DOBspan.innerHTML = DOBspan.innerHTML.concat(' [').concat(age.toString()).concat(' ' + (suffix || 'years old') + ']');
	}
}

function getAge(DOB) {
	//support for date types: yyyy.MM.dd, ????.MM.dd, ????.??.??
	if(DOB.includes('?')) return 0;
	let birthDateStr = DOB.replace('.', '-').replace('.', '-');
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone});
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone});
	if(window['debug']) console.log('getAge', today, birthDate);
	return parseInt(today.diff(birthDate, 'years').years);
}

function isBirthdayPassed(DOB) {
	let birthDateStr = DOB.replace('.', '-').replace('.', '-'); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone}); 
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone});
	return today.diff(birthDate, 'days').days >= 0;
}

function toggleMarried() {
	if(window['excludeMarried'] != null)
	{
		window['excludeMarried'] = document.querySelector('#cb-married').checked;
		let marriedList = window['profileList'].filter(profile => window['excludeMarried'] ? !processOption(profile.turningPoint.married, true) : true);
		window['timelineDOBlist'] = createDOBlist(marriedList, 1, 35, true);
		renderWantedList();
		loadTimeline();
		resetProfile();
	}
}

function updateTime() {
	if(document.querySelector('.time') != null)
	{
		let time = document.querySelector('.time');
		var now = luxon.DateTime.local().setZone(timezone);
		time.innerText = now.toFormat('yyyy.MM.dd HH:mm:ss');
		if(time.innerText.endsWith('00:00:00'))
			renderWantedList();
		setTimeout(updateTime, 1000);
	}
}
