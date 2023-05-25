//--SETTINGS--//
const config = {
	title: '日本女優図鑑',
	source: 'https://knneo.github.io/profile-list/v5/profiles.json',
	buttons: {
		random: true,
		all: true,
	},
	rating: {
		max: 5,
	},
	timezone: 'Asia/Tokyo',
	profile: {
		include: function(n) {
			return n.pointers;
		},
	},
	calendar: {
		include: function(n) {
			return config.calendar.category.includes(n.category);
		},
		category: ['アイドル', '女性声優', 'DOAXVV', 'hololive', 'IDOLY PRIDE', 'ミュージックレイン3期生'], // also css attribute, in order
		daysOfWeek: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	},
	labels: {
		ageSuffix: 'years ago',
		turningPoint: 'Singer Debut|Swimsuit Photobook|Married',
	},
	timeline: {
		include: function(n) {
			return n.dob && config.timeline.category.includes(n.category);
		},
		category: ['Me', '女性声優'],
	},
};
const isLandscape = function() {
	return window.matchMedia('(orientation:landscape) and (max-height : 640px)')?.matches;
} //same as css conditions

//--STARTUP--//
window.addEventListener('load', startup);

//--REFERENCES--//
let profileDiv = document.querySelector('.profile');
let profileImageDiv = document.querySelector('.profile-image');
let profileDetailsDiv = document.querySelector('.profile-details');
let viewDiv = document.querySelector('.view');
let pageDivs = document.querySelectorAll('.page');

//--FUNCTIONS--//
function startup() {
	initializeVariables();
	ititializePageEvents();
	runLoader();
	loadSources();
}

function initializeVariables() {
	window['debug'] = false;
	window['loading'] = true;
	window['source'] = [];
	window['profileList'] = [];
	window['calendarList'] = [];
	window['friendList'] = [];
	window['timelineDOBlist'] = [];
	window['calendarDOBlist'] = [];
	window['search'] = '';
	window['profiles'] = [];
	window['friendMode'] = false;
}

function ititializePageEvents() {
	// set title
	if(config.title)
	{
		document.title = config.title;
		document.querySelector('.title').innerText = config.title;
	}
	// add touch events
	for(let box of pageDivs)
	{
		box.addEventListener('touchstart', onTouchStart);
		box.addEventListener('touchmove', onTouchMove, false);
	}
}

function loadSources() {
	getJson(config.source, function(response) {
		window['source'] = response;
		window['profileList'] = window['source'].filter(n => !(n.inactive === true) && config.profile.include(n));
		window['calendarList'] = window['source'].filter(n => !(n.inactive === true) && config.calendar.include(n));
		window['timelineList'] = window['source'].filter(n => !(n.inactive === true) && config.timeline.include(n));
		window['friendList'] = window['source'].filter(n => !(n.inactive === true) && n.category == 'friends');
		window['timelineDOBlist'] = createDOBlist(window['timelineList'], 1, 35, true);
		window['calendarDOBlist'] = createDOBlist(window['calendarList'], 0, 50);
		stopLoader();
		renderPage();
	});
}

function renderPage() {
	generateWantedList();
	loadTimeline();
	loadCalendar();
	updateTime();
	toggleView(2);
}

function toggleView(id) {
	//change page
	let isSelect = typeof pageClass == 'string';
	for(let page of pageDivs)
	{
		page.classList.add('hidden');
	}
	pageDivs[id-1].classList.remove('hidden');
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

//--EVENTS--//
function onSearch() {
	// console.log(event.target.value);
	window['search'] = event.target.value;
	filterWantedListBySearch();
}

function filterWantedListBySearch() {
	window['profileList'] = window['source']
	.filter(n => !(n.inactive === true) 
	&& n.rating 
	&& (n.name.toLowerCase().includes(window['search'].toLowerCase())
	|| (n.nickname?.toLowerCase().includes(window['search'].toLowerCase()) ?? false))
	);
	generateWantedList(true);
}

function clearWantedList() {
	document.getElementById('search').value = '';
	document.querySelector('.profile-details').innerHTML = '';
	document.querySelector('.profile-image').innerHTML = '<h2 class="title">Profile List</h2>';
	window['profiles'] = [];
	window['friendMode'] = false;
	loadSources();
	generateWantedList();
}

function selectRandomProfile() {
	let list = document.querySelectorAll('.list .item');
	generateProfileFromJSON(list[Math.floor(list.length*Math.random())]);
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

function onClickShowAll() {
	let wantedList = document.createElement('div');
	wantedList.classList.add('list');
	//create array
	let profileNamesList = [];
	for (let profileName of window['source'].filter(n => !(n.inactive === true) && config.profile.include(n))) {
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
	
	popupText(wantedList);
}

////WANTED LIST////
function generateWantedList(addReset) {
	let wantedList = document.querySelector('.list');
	wantedList.innerHTML = '';

	generateWantedListButtons(addReset);
	if(config.buttons.all)
	{
		let list = document.createElement('li');
		list.appendChild(generateWantedListShowAll());
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
		list.appendChild(generateWantedListEntry(profile.id));
		wantedList.appendChild(list);
	}
	
	//scroll to front
	wantedList.scrollLeft = 0;
}

function generateWantedListEntry(id, autoAdd = []) {
	let profile = window['source'].find( function(n) {
		return n.id == id
	});
	
	let wanted = document.createElement('a');
	wanted.innerText = profile.name;
	wanted.tabIndex = 0;
	wanted.classList.add('item');
	if(autoAdd.length > 0) wanted.setAttribute('auto-add', autoAdd.join(','));
	wanted.addEventListener('click', function() {
		generateProfileFromJSON(this);
	});
	wanted.addEventListener('keyup', onKeyUpWantedListEntry);
	
	return wanted;
}

function generateWantedListButtons(addReset) {
	let search = document.querySelector('.search');
	search.innerHTML = '';
	
	if(addReset) {
		let list = document.createElement('span');
		list.appendChild(generateWantedListClear());
		search.appendChild(list);
	}
	else if(config.buttons.random) {
		let list = document.createElement('span');
		list.appendChild(generateWantedListRandom());
		search.appendChild(list);
	}
	else {
		let list = document.createElement('span');
		list.appendChild(generateWantedListSearch());
		search.appendChild(list);		
	}
}

function generateWantedListShowAll() {	
	let wanted = document.createElement('a');
	wanted.classList.add('button-sml');
	wanted.classList.add('bi');
	wanted.classList.add('bi-view-list');
	wanted.tabIndex = 0;
	wanted.innerText = ' ALL';
	wanted.addEventListener('click', onClickShowAll);
	wanted.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			onClickShowAll();
	});
	
	return wanted;
}

function generateWantedListRandom() {	
	let wanted = document.createElement('a');
	wanted.classList.add('button-sml');
	wanted.classList.add('bi');
	wanted.classList.add('bi-shuffle');
	wanted.tabIndex = 0;
	wanted.innerText = ' RANDOM';
	wanted.addEventListener('click', selectRandomProfile);
	wanted.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			selectRandomProfile();
	});
	
	return wanted;
}

function generateWantedListSearch() {	
	let wanted = document.createElement('a');
	wanted.classList.add('button-sml');
	wanted.classList.add('bi');
	wanted.classList.add('bi-search');
	wanted.tabIndex = 0;
	wanted.innerText = ' SEARCH';
	wanted.addEventListener('click', function() {
		popupText('Search by name or nickname');
	});
	wanted.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			popupText('Search by name or nickname');
	});
	
	return wanted;
}

function generateWantedListClear() {	
	let wanted = document.createElement('a');
	wanted.classList.add('button-sml');
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

function updateWantedList([profile, currentProfile]) {
	let profileFriendsList = window['friendList'].filter( function(p) {
		return p.id.includes(profile.id) && 
		(currentProfile == null || p.id.includes(currentProfile?.id)
		);
	});
	if(window['debug'])
		console.log('profileFriendsList', profileFriendsList);

	filterWantedListByFriends(profileFriendsList, profile, currentProfile);
}

////TIMELINE////
function loadTimeline(width = 2500) {
	// if(document.querySelector('#timeline') == null) return;
	// document.querySelector('#timeline').innerHTML = '';
	generateVerticalTimeline('timeline-vert', window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), null, 'auto');
	generateHorizontalTimeline('timeline-horiz', window['timelineDOBlist'].filter(prof => !prof.date.startsWith('????')), width, '160px');
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
function loadCalendar() {
	// createCalendar(luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone}).month-1, window['calendarDOBlist'], true);
	generateMiniCalendar(
		luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone}).year,
		luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone}).month-1, // month is zero-based
		window['calendarDOBlist'], 
		true);
}

function createDOBlist(profiles, minAge, maxAge, sort = false) {
	//create array with DOB info, age range inclusive
	let list = new Array();
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
	//process input
	if(typeof profileName == 'object')
		profileName = profileName.innerText;
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.replace(' ', '');
	if(profileName.indexOf(' ') >= 0)
		profileName = profileName.substring(0, profileName.indexOf(' '));
	
	//select profile from id
	let source = window['profileList'];
	window['friendMode'] = false;
	let profile = source.find( function(n) {
        return n.id == profileName;
    });
	if(profile == null) //if not found, means reset list
	{
		window['profiles'] = [];
		source = window['source'];
		profile = source.filter(n => !(n.inactive === true) && n.rating).find( function(n) {
			return n.id == profileName;
		});
	};
	//if still not found, then ignore; else add to list
	if(profile == null) return;
	else window['profiles'].unshift(profile); //first 3 are latest
	
	let friend = findFriendIdByProfile(window['profiles'].slice(0,3));
	if(friend) {
		window['friendMode'] = true;
	}
	
	//layout
	getProfileImage();
	
	//get insert index
	// let index = setProfileInsertOrder(window['profiles'].slice(0,3));
	//insert depending on location of details
	// profileDetailsDiv.insertBefore(generateProfileElement(profile), profileDetailsDiv.children[index]);
	
	let layout = setProfileOrderByFriend(window['profiles'].slice(0,3), friend);
	if(layout.length > 0) profileDetailsDiv.innerHTML = '';
	for(let l of layout)
	{
		if(l)
			profileDetailsDiv.appendChild(generateProfileElement(l, window['friendMode']));
	}
	// profileDiv.style.height = window['friendMode'] ? '' : '100%';
	// viewDiv.style.display = '';
	
	document.getElementById('search').value = '';
	updateWantedList(window['profiles'].slice(0,3));
	toggleView(4);
}

function generateProfileElement(profile, friendMode) {
	let cell = document.createElement('div');
	cell.style.width = '100%';
	
	// all the children ones
	cell.appendChild(generateProfileName(profile));
	if(!friendMode) cell.appendChild(generateProfileWithInnerHTML(profile, 'profile'));
	cell.appendChild(generateProfileDob(profile));
	if(!friendMode) {
		cell.appendChild(generateProfilePointers(profile));
		cell.appendChild(generateProfileSocial(profile));
	}
	
	return cell;
}

function getProfileImage() {
	//assume single image tag in profile-image element
	let imgDiv = document.createElement('img');
	
	//find friend with 3 names
	let friend = findFriendIdByProfile(window['profiles'].slice(0,3));
	if(friend)
		imgDiv.src = getNextFriendImage(friend.id, profileImageDiv.querySelector('img')?.src);
	else
	{
		//find friend withone name
		let profile = profiles[0];
		imgDiv.src = getNextProfileImage(profile.id, profileImageDiv.querySelector('img')?.src);
	}
	
	profileImageDiv.innerHTML = '';
	profileImageDiv.appendChild(imgDiv);
}

function getNextFriendImage(id, current) {
	let friend = window['source'].find( function(n) {
        return n.id == id;
    });
	let allImages = (friend.landscapes ?? []).concat(friend.portraits ?? []) ?? [friend.image];
	let nextIndex = allImages.indexOf(current) + 1;
	return allImages[current && nextIndex < allImages.length ? nextIndex : 0];
}

function getNextProfileImage(id, current) {
	let profile = window['source'].find( function(n) {
        return n.id == id;
    });
	let allImages = ((isLandscape() ? (profile.landscapes ?? profile.portraits) : (profile.portraits ?? profile.landscapes)) ?? []) ?? [profile.image];
	let nextIndex = allImages.indexOf(current) + 1;
	return allImages[current && nextIndex < allImages.length ? nextIndex : 0];
}

function generateProfileName(item) {
	if(window['debug'])
		console.log('generateProfileName');
	
	let cell = document.createElement('div');
	cell.style.display = 'flex';
    cell.style.justifyContent = 'space-evenly';
		
	//--NAME VALUE--//
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
		span.classList.add('points');
		span.addEventListener('click', function() {
			popupText(this.title);
		});
	}
	cellDiv.appendChild(span);
	
	cell.appendChild(cellDiv);	
	
	return cell;
}

function generateProfileDob(item) {
	if(window['debug']) console.log('generateProfileDob');
	
	let cell = document.createElement('div');
	cell.style.display = 'flex';
    cell.style.justifyContent = 'space-evenly';
											
	//--DOB VALUE--//
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');
	
	let DOBspan = document.createElement('span');
	DOBspan.classList.add('DOB');
	
	let age = getAge(item.dob);
	if (age != undefined && age > 0) {
		DOBspan.classList.add('points');
		DOBspan.title = `${age} ${config.labels.ageSuffix}`;
		DOBspan.addEventListener('click', function() {
			popupText(this.title);
		});
	}
	//dob comment only appears if single profile
	DOBspan.innerHTML = processOption(item.dob, false);
	
	//if dob is not in full, show as <dd MMM>
	if(DOBspan.innerHTML.includes('????')) {
		DOBspan.innerHTML = config.calendar.months[parseInt(item.dob.substring(5,7))-1] + ' ' + parseInt(item.dob.substring(8,10));
	}
	cellDiv.appendChild(DOBspan);
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfileWithInnerHTML(profile, property) {
	let cell = document.createElement('div');
	if(profile[property] == undefined || profile[property].length == 0) return cell;
	
	//--VALUE--//
	cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');
	cellDiv.innerHTML = processOption(profile[property], false);
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfilePointers(profile) {
	let points = profile.pointers.map((item, index, arr) => {
		let parts = item.split('|');
		return {
			label: parts[0],
			value: processOption(parts[1], false),
			comment: parts[1].includes('[') ? findComment(profile, parts[1].substring(parts[1].indexOf('['))) : null, 
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

function filterWantedListByFriends(profileFriendsList, profile, currentProfile) {
	//filter as search
	let friendsSearch = profileFriendsList.map(f => {
		// let otherMultiple = f.id.split('-').length > 2;
		return f.id.replace(profile.id, '')
		.replace(currentProfile != null ? currentProfile.id : '', '')
		.replace(/-/g, '');
	}).filter(p => !window['profiles'].map(p => p.id).includes(p));
	// console.log('friendsSearch', friendsSearch);
	window['profileList'] = window['source'].filter(n => !(n.inactive === true) && n.rating && friendsSearch.includes(n.id));
	generateWantedList(true);
}

function generateProfileSocial(profile) {
	if(window['debug']) console.log('generateProfileSocial');
	
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
			popupText(processOption(profile.intro, false) + 
			'<p style="font-style: italic;">"' + processOption(profile.description, false) + 
			'"</p>Star Rating: ' + ratingAsStars(profile.rating, config.rating.max)?.outerHTML);
			let dialog = document.querySelector('.dialog dialog');
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

////HELPER////
function getAge(DOB) {
	//support for date types: yyyy.MM.dd, ????.MM.dd, ????.??.??
	if(DOB.includes('?')) return 0;
	let birthDateStr = DOB.replace('.', '-').replace('.', '-');
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: config.timezone});
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone});
	if(window['debug']) console.log('getAge', today, birthDate);
	return parseInt(today.diff(birthDate, 'years').years);
}
function isBirthdayPassed(DOB) {
	let birthDateStr = DOB.replace('.', '-').replace('.', '-'); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), {zone: config.timezone}); 
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone});
	return today.diff(birthDate, 'days').days >= 0;
}
function updateTime() {
	if(document.querySelector('.time') != null)
	{
		let time = document.querySelector('.time');
		var now = luxon.DateTime.local().setZone(config.timezone);
		time.innerText = now.toFormat('yyyy.MM.dd HH:mm:ss');
		if(time.innerText.endsWith('00:00:00'))
			renderPage();
		setTimeout(updateTime, 1000);
	}
}
function ratingAsStars(rating, total) {
	let stars = document.createElement('div');
	stars.title = rating + '/' + total;
	for(s = 0; s < Math.max(rating, total); s++)
	{
		let star = document.createElement('i');
		star.classList.add('bi');
		star.classList.add('bi-star' + (rating - s > 0 ? '-fill' : ''));
		if(s + 1 - total > 0) star.classList.add('extra-rating');
		stars.appendChild(star);
	}
	return stars;
}
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
		if(window['debug'])
			console.log('processComment', replaced, comment);
		if(replaced != comment)
		{
			commentArr.push(replaced.replace('{','').replace('}',''));
			added = true;
		}
	}
	if(!added)
		commentArr.push(comment);
	return commentArr.join('<br/>');
}
function findComment(profile, commentIndexStr) { 
	return profile.comments.find(c => c.includes(commentIndexStr))?.replace(commentIndexStr,'');
}
function processOption(option, returnBool) { 
	return returnBool ? 
		option.includes('Yes') : 
		option
			.replace('[1]','')
			.replace('[2]','')
			.replace('[3]','')
			.replace('[4]','')
			.replace('[5]','')
			.replace('[6]','')
			.replace('[7]','')
			.replace('[8]','')
			.replace('[9]','');
}
function dupeStringCheck(source, compare) { return source == compare ? source : compare; }

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
		let diff = luxon.DateTime.fromISO(myDate).setZone(config.timezone).diff(luxon.DateTime.fromISO(birthDate), 'days').days;
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
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null)
	{
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		this.remove();
	});
	dialog.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			this.remove();
	});
	return dialog;
}
