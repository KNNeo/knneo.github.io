//--SETTINGS--//
const config = {
	title: '推し図鑑',
	buttons: {
		random: true,
		all: true,
	},
	rating: {
		max: 5,
		prefix: 'Star Rating:',
		tiers: [
			'',
			'',
			'(Purely Admirable)',
			'(Topic of Interest)',
			'(Deeply Invested)',
			'(Special Relationship)'
		],
	},
	timezone: 'Asia/Tokyo',
	profile: {
		include: function (n) {
			return n.pointers;
		},
	},
	calendar: {
		include: function (n) {
			return config.calendar.category.includes(n.category);
		},
		category: ['アイドル', '女性声優', 'DOAXVV', 'IDOLY PRIDE', 'DayRe:'], // legend, in display order
		categoryLightColor: ['gray', 'blue', 'darkgreen', 'violet', 'orangered'], // (light theme) background color of date, in category order
		categoryDarkColor: ['lightgray', 'cyan', 'chartreuse', 'hotpink', 'orange'], // (dark theme) background color of date, in category order
		daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	},
	labels: {
		ageSuffix: 'years ago',
		turningPoint: 'Singer Debut|Swimsuit Photobook|Married',
		icon: '🎤|👙|💍',
	},
	timeline: {
		include: function (n) {
			return n.dob && config.timeline.category.includes(n.category);
		},
		category: ['Me', '女性声優', 'DayRe:'],
	},
	social: {
		twitter: {
			name: 'Twitter/X',
			template: 'https://twitter.com/{id}'
		},
		instagram: {
			name: 'Instagram',
			template: 'https://www.instagram.com/{id}'
		},
		tiktok: {
			name: 'TikTok',
			template: 'https://www.tiktok.com/@{id}'
		},
		youtube: {
			name: 'YouTube',
			template: 'https://www.youtube.com/@{id}'
		},
		twitch: {
			name: 'Twitch',
			template: 'https://www.twitch.tv/{id}'
		}
	}
};
const isLandscape = function () {
	// follow css conditions
	return window.matchMedia('(orientation:landscape) and (max-height : 640px)')?.matches;
}
const loaderStates = ['bi-hourglass-top', 'bi-hourglass-split', 'bi-hourglass-bottom'];

//--STARTUP--//
window.addEventListener('load', startup);

//--REFERENCES--//
let loaderDiv = document.querySelector('.loader');
let titleDiv = document.querySelector('.title');
let profileDiv = document.querySelector('.profile');
let profileImageDiv = document.querySelector('.profile-image');
let profileDetailsDiv = document.querySelector('.profile-details');
let viewDiv = document.querySelector('.view');
let pageDivs = document.querySelectorAll('.page');
let searchDiv = document.querySelector('#search');
let timelineHorizontalDiv = document.querySelector('#timeline-horiz');
let timelineVerticalDiv = document.querySelector('#timeline-vert');
let calendarDiv = document.querySelector('.calendar');
let timeDiv = document.querySelector('.time');
let wantedListDiv = document.querySelector('.list');

//--FUNCTIONS--//
function startup() {
	initializeVariables();
	ititializePageEvents();
	runLoader();
	loadSources();
}

function initializeVariables() {
	config.debug = false;
	config.loading = true;
	config.data = [];
	config.list = {};
	config.list.profiles = [];
	config.list.friends = [];
	config.list.timeline = [];
	config.list.calendar = [];
	config.search = '';
	config.profiles = [];
	config.multi = false;
}

function ititializePageEvents() {
	// set title
	if (config.title) {
		document.title = config.title;
		if (titleDiv)
			titleDiv.innerText = config.title;
	}
	// add touch events
	for (let box of pageDivs) {
		box.addEventListener('touchstart', onTouchStart);
		box.addEventListener('touchmove', onTouchMove, false);
	}
}

function loadSources() {
	if (document.querySelector('#data')?.textContent && document.querySelector('#data')?.textContent.length > 0) {
		console.log('using inline html embedded json');
		config.data = JSON.parse(document.querySelector('#data')?.textContent || []);
		stopLoader();
		renderPage();
	}
	else if (document.querySelector('#data').src)
		getJson(document.querySelector('#data').src, function (response) {
			console.log('using external json url from config');
			config.data = response;
			stopLoader();
			renderPage();
		});
}

function renderPage() {
	loadData();
	generateWantedList();
	loadTimeline();
	loadCalendar();
	updateTime();
	toggleView(2);
}

function loadData() {
	config.list.profiles = config.data.filter(n => !(n.inactive === true) && config.profile.include(n));
	let calendarList = config.data.filter(n => !(n.inactive === true) && config.calendar.include(n));
	let timelineList = config.data.filter(n => !(n.inactive === true) && config.timeline.include(n));
	config.list.friends = config.data.filter(n => !(n.inactive === true) && n.category == 'friends');
	config.list.timeline = createDOBlist(timelineList, 1, 35, true);
	config.list.calendar = createDOBlist(calendarList, 0, 50);
}

function toggleView(id) {
	//change page
	for (let page of pageDivs)
		page.classList.add('hidden');
	pageDivs[id - 1].classList.remove('hidden');
}

function runLoader() {
	if (!loaderDiv) return;
	let currentState = loaderStates.findIndex(x => loaderDiv.classList.contains(x));
	if (currentState < 0) {
		loaderDiv.classList.toggle(loaderStates[0]);
	}
	else if (currentState < loaderStates.length - 1) {
		loaderDiv.classList.toggle(loaderStates[currentState]);
		loaderDiv.classList.toggle(loaderStates[1 + currentState]);
	}
	else {
		loaderDiv.classList.toggle(loaderStates[currentState]);
		loaderDiv.classList.toggle(loaderStates[0]);
	}
	if (config.loading) setTimeout(runLoader, 500);
	else loaderDiv.classList.add('hidden');
}

function stopLoader() {
	config.loading = false;
}

function updateTime() {
	if (timeDiv != null) {
		let time = document.querySelector('.time');
		var now = luxon.DateTime.local().setZone(config.timezone);
		time.innerText = now.toFormat('yyyy.MM.dd HH:mm:ss');
		if (time.innerText.endsWith('00:00:00'))
			renderPage();
		setTimeout(updateTime, 1000);
	}
}

//--EVENTS--//
function onSearch() {
	// console.log(event.target.value);
	config.search = event.target.value.toLowerCase();
	filterWantedListBySearch();
	if (event.key === 'Enter') // select first result
		wantedListDiv.querySelector('.item')?.click();
}

function filterWantedListBySearch() {
	// no inactive flag, has rating, has no other profile selected or filter by that, then filter by name or nickname
	config.list.profiles = config.data
		.filter(n => !(n.inactive === true) && n.rating &&
			(config.profiles.length == 0 || config.profiles.filter(p => p.id != n.id).length > 0) &&
			(n.name.toLowerCase().includes(config.search) || (n.nickname?.toLowerCase().includes(config.search) ?? false)));
	generateWantedList(true);
}

function clearWantedList() {
	searchDiv.value = '';
	profileDetailsDiv.innerHTML = '';
	profileImageDiv.innerHTML = '<h2 class="title">' + (config.title || '') + '</h2>';
	config.profiles = [];
	config.multi = false;
	loadSources();
	generateWantedList();
}

function selectRandomProfile() {
	let items = wantedListDiv.querySelectorAll('.item');
	generateProfileFromJSON(items[Math.floor(items.length * Math.random())]);
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
	// if(config.debug)
	// console.log(swipeUp > 0, swipeDown > 0, swipeLeft > 0, swipeRight > 0);
	//--SWIPE LEFT IE. FROM RIGHT OF SCREEN--//
	if (swipeLeft > swipeUp && swipeLeft > swipeDown) {
		console.log('swipeLeft');
		return;
	}
	//--SWIPE RIGHT IE. FROM LEFT OF SCREEN--//
	if (swipeRight > swipeUp && swipeRight > swipeDown) {
		console.log('swipeRight');
		return;
	}
	//--SWIPE DOWN IE. FROM TOP OF SCREEN--//
	if (swipeDown > swipeLeft && swipeDown > swipeRight) {
		console.log('swipeDown');
		return;
	}
	//--SWIPE UP IE. FROM BOTTOM OF SCREEN--//
	if (swipeUp > swipeLeft && swipeUp > swipeRight) {
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
	for (let profileName of config.data.filter(n => !(n.inactive === true) && config.profile.include(n)))
		profileNamesList.push(profileName);

	profileNamesList.sort(function (a, b) {
		return a.name.localeCompare(b.name);
	});

	//create wanted list
	for (let profile of profileNamesList)
		wantedList.appendChild(generateWantedListCard(profile.id));

	popupContent(wantedList);
	for (let wanted of document.querySelectorAll('.dialog .item')) {
		wanted.addEventListener('click', function () {
			generateProfileFromJSON(this);
		});
		wanted.addEventListener('keyup', onKeyUpWantedListEntry);
	}
}

////WANTED LIST////
function generateWantedList(addReset) {
	wantedListDiv.innerHTML = '';

	if (config.buttons.all) {
		let list = document.createElement('li');
		list.appendChild(generateWantedListShowAll());
		wantedListDiv.appendChild(list);
	}

	//create array
	let profileNamesList = [];
	for (let profileName of config.list.profiles) {
		profileNamesList.push(profileName);
	}
	profileNamesList.sort(function (a, b) {
		return a.name.localeCompare(b.name);
	});

	//create wanted list
	for (let profile of profileNamesList) {
		let list = document.createElement('li');
		list.appendChild(generateWantedListEntry(profile.id));
		wantedListDiv.appendChild(list);
	}

	generateWantedListButtons(addReset && profileNamesList.length < 1);

	//scroll to front
	wantedListDiv.scrollLeft = 0;
}

function generateWantedListEntry(id, autoAdd = []) {
	let profile = config.data.find(function (n) {
		return n.id == id
	});

	let wanted = document.createElement('a');
	wanted.innerText = profile.name;
	wanted.tabIndex = 0;
	wanted.classList.add('item');
	if (autoAdd.length > 0) wanted.setAttribute('auto-add', autoAdd.join(','));
	wanted.addEventListener('click', function () {
		generateProfileFromJSON(this);
	});
	wanted.addEventListener('keyup', onKeyUpWantedListEntry);

	return wanted;
}

function generateWantedListButtons(showReset) {
	let search = document.querySelector('.search-action');
	search.innerHTML = '';

	if (showReset) {
		let list = document.createElement('span');
		list.appendChild(generateWantedListClear());
		search.appendChild(list);
	}
	else if (config.buttons.random) {
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
	wanted.classList.add('button');
	wanted.classList.add('bi');
	wanted.classList.add('bi-view-list');
	wanted.tabIndex = 0;
	wanted.innerText = ' ALL';
	wanted.addEventListener('click', onClickShowAll);
	wanted.addEventListener('keyup', function () {
		if (event.key === ' ' || event.key === 'Enter')
			onClickShowAll();
	});

	return wanted;
}

function generateWantedListRandom() {
	let wanted = document.createElement('a');
	wanted.classList.add('button');
	wanted.classList.add('bi');
	wanted.classList.add('bi-shuffle');
	wanted.tabIndex = 0;
	wanted.innerText = ' RANDOM';
	wanted.addEventListener('click', selectRandomProfile);
	wanted.addEventListener('keyup', function () {
		if (event.key === ' ' || event.key === 'Enter')
			selectRandomProfile();
	});

	return wanted;
}

function generateWantedListSearch() {
	let wanted = document.createElement('a');
	wanted.classList.add('button');
	wanted.classList.add('bi');
	wanted.classList.add('bi-search');
	wanted.tabIndex = 0;
	wanted.innerText = ' SEARCH';
	wanted.addEventListener('click', function () {
		popupContent('Search by name or nickname');
	});
	wanted.addEventListener('keyup', function () {
		if (event.key === ' ' || event.key === 'Enter')
			popupContent('Search by name or nickname');
	});

	return wanted;
}

function generateWantedListClear() {
	let wanted = document.createElement('a');
	wanted.classList.add('button');
	wanted.classList.add('bi');
	wanted.classList.add('bi-x-lg');
	wanted.tabIndex = 0;
	wanted.innerText = ' CLEAR';
	wanted.addEventListener('click', clearWantedList);
	wanted.addEventListener('keyup', function () {
		if (event.key === ' ' || event.key === 'Enter')
			clearWantedList();
	});

	return wanted;
}

function updateWantedList([profile, currentProfile]) {
	let profileFriendsList = config.list.friends.filter(function (p) {
		return p.id.includes(profile.id) &&
			(currentProfile == null || p.id.includes(currentProfile?.id));
	});
	if (config.debug)
		console.log('profileFriendsList', profileFriendsList);

	filterWantedListByFriends(profileFriendsList, profile, currentProfile);
}

function generateWantedListCard(id) {
	let profile = config.data.find(function (n) {
		return n.id == id
	});

	let wanted = document.createElement('div');
	wanted.classList.add('item');
	wanted.tabIndex = 0;
	wanted.setAttribute('data-name', profile.id);
	wanted.addEventListener('click', function () {
		generateProfileFromJSON(this);
	});
	wanted.addEventListener('keyup', onKeyUpWantedListEntry);

	let card = document.createElement('div');
	card.classList.add('card');

	let left = document.createElement('img');
	left.src = profile.landscapes.concat(profile.portraits)[0];

	let right = document.createElement('div');
	right.classList.add('info');

	let name = document.createElement('div');
	name.innerText = profile.name;

	let date = document.createElement('div');
	date.innerText = profile.dob.startsWith('????') ? '' : profile.dob.removeNumberPrefix();

	let icons = config.labels.icon.split('|');
	let stats = generateProfilePointers(profile, icons);

	let rating = ratingAsStarsDiv(profile.rating, config.rating.max);

	right.appendChild(name);
	//right.appendChild(date);
	right.appendChild(stats);
	//right.appendChild(rating);
	card.appendChild(left);
	card.appendChild(right);
	wanted.appendChild(card);
	return wanted;
}

////TIMELINE////
function loadTimeline(width = 2500) {
	let list = config.list.timeline.filter(prof => !prof.date.startsWith('????'));
	generateVerticalTimeline(timelineVerticalDiv, list, null, 'auto');
	// generateHorizontalTimeline(timelineHorizontalDiv, list, width, '160px');
	// addTimelineEvents();
}

function addTimelineEvents() {
	//on timeline wheel scroll adjust timeline length ie. redraw
	document.querySelector('#timeline .grid-horiz')?.addEventListener('wheel', function (e) {
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
}

////CALENDAR////
function loadCalendar() {
	generateMiniCalendar(
		calendarDiv,
		luxon.DateTime.fromISO(luxon.DateTime.now(), { zone: config.timezone }).year,
		luxon.DateTime.fromISO(luxon.DateTime.now(), { zone: config.timezone }).month - 1, // month is zero-based
		config.list.calendar,
		true);
}

function createDOBlist(profiles, minAge, maxAge, sort = false) {
	//create array with DOB info, age range inclusive
	let list = new Array();
	for (let profile of profiles) {
		let targetDOB = profile.dob;
		if (targetDOB && targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB.replace('.', '-').replace('.', '-').substring(0, 10)));
			let age = targetDOB.getAge();
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
	if (sort)
		list.sort(function (a, b) {
			return Date.parse(a.date) - Date.parse(b.date)
		});
	return list;
}

////GROUP MODE////
function findFriendIdByProfile(friends) {
	if (config.debug) console.log('findFriendIdByProfile', friends[1], friends[2]);
	if (typeof friends == 'object' && friends[1] != undefined)
		return config.list.friends
			.sort(function (a, b) {
				return b.id.split('-').length - a.id.split('-').length;
			})
			.find(function (p) {
				let count = p.id.split('-').length;
				let check0 = (p.id.includes(friends[0].id + '-') || p.id.includes('-' + friends[0].id + '-') || p.id.includes('-' + friends[0].id));
				let check1 = (p.id.includes(friends[1].id + '-') || p.id.includes('-' + friends[1].id + '-') || p.id.includes('-' + friends[1].id));
				let check2 = (friends[2] != undefined && (p.id.includes(friends[2].id + '-') || p.id.includes('-' + friends[2].id + '-') || p.id.includes('-' + friends[2].id)));
				if (config.debug) console.log(p.id, count, check0, check1, check2);
				return (count == 2 && check0 && check1) || (count == 3 && check0 && check1 && check2);
				//if 3 friends then include 3rd in search
			});
	return null;
}

function setProfileOrderByFriend(list, friend) {
	let newList = [];
	if (config.multi && friend) {
		let ids = friend.id.split('-');
		if (config.debug) console.log('members', ids);
		for (let i = 0; i < ids.length; i++) {
			let f = list[list.map(l => l?.id).indexOf(ids[i])];
			if (config.debug) console.log('find', f);
			newList.push(f);
		}
	}
	else
		newList.push(list[0]);

	if (config.debug) console.log('setProfileOrderByFriend', list, newList);
	return newList;
}

////PROFILE////
function generateProfileFromJSON(profileName) {
	//process input to become id
	if (typeof profileName == 'object')
		profileName = profileName.getAttribute('data-name') ?? profileName.innerText;
	if (profileName.indexOf(' ') >= 0)
		profileName = profileName.replace(' ', '');
	if (profileName.indexOf(' ') >= 0)
		profileName = profileName.substring(0, profileName.indexOf(' '));
	//select profile from id
	let source = config.list.profiles;
	config.multi = false;
	let profile = source.find(function (n) {
		return n.id == profileName;
	});
	//if not found, reset list
	if (profile == null) {
		config.profiles = [];
		source = config.data;
		profile = source.filter(n => !(n.inactive === true) && n.rating).find(function (n) {
			return n.id == profileName;
		});
	};
	//if still not found, then ignore; else add to list
	if (profile == null) return;
	else config.profiles.unshift(profile);
	 //check friend mode, first 3 are latest
	let friend = findFriendIdByProfile(config.profiles.slice(0, 3));
	if (friend)
		config.multi = true;

	//layout, in order
	getProfileImage();
	let layout = setProfileOrderByFriend(config.profiles.slice(0, 3), friend);
	if (layout.length > 0)
		profileDetailsDiv.innerHTML = '';
	if (config.multi)
		profileDetailsDiv.classList.add('multi');
	else
		profileDetailsDiv.classList.remove('multi');
	//generate for all profiles detected
	for (let l of layout)
		if (l) profileDetailsDiv.appendChild(generateProfileElement(l, config.multi));
	//update search results and display
	searchDiv.value = '';
	updateWantedList(config.profiles.slice(0, 3));
	toggleView(4);
}

function getProfileImage() {
	//assume single image tag in profile-image element
	let imgDiv = document.createElement('img');
	//find friend image with 3 names
	let friend = findFriendIdByProfile(config.profiles.slice(0, 3));
	if (friend)
		imgDiv.src = getNextFriendImage(friend.id, profileImageDiv.querySelector('img')?.src);
	else {
		//find profile image with 1 name
		let profile = config.profiles[0];
		imgDiv.src = getNextProfileImage(profile.id, profileImageDiv.querySelector('img')?.src);
	}

	profileImageDiv.innerHTML = '';
	profileImageDiv.appendChild(imgDiv);
}

function getNextFriendImage(id, current) {
	let friend = config.data.find(function (n) {
		return n.id == id;
	});
	let allImages = (friend.landscapes ?? []).concat(friend.portraits ?? []) ?? [friend.image];
	let nextIndex = allImages.indexOf(current) + 1;
	return allImages[current && nextIndex < allImages.length ? nextIndex : 0];
}

function getNextProfileImage(id, current) {
	let profile = config.data.find(function (n) {
		return n.id == id;
	});
	let allImages = ((isLandscape() ? (profile.landscapes ?? profile.portraits) : (profile.portraits ?? profile.landscapes)) ?? []) ?? [profile.image];
	let nextIndex = allImages.indexOf(current) + 1;
	return allImages[current && nextIndex < allImages.length ? nextIndex : 0];
}

function generateProfileElement(profile, friendMode) {
	let container = document.createElement('div');
	// all the children ones, in order
	container.appendChild(generateProfileName(profile));
	if (!friendMode) container.appendChild(generateProfileWithInnerHTML(profile, 'profile'));
	container.appendChild(generateProfileDob(profile));
	if (!friendMode) {
		container.appendChild(generateProfilePointers(profile));
		container.appendChild(generateProfileSocial(profile));
	}
	return container;
}

function generateProfileName(profile) {
	if (config.debug) console.log('generateProfileName');

	let cell = document.createElement('div');
	cell.style.display = 'flex';
	cell.style.justifyContent = 'space-evenly';
	//--NAME VALUE--//
	let cellDiv = document.createElement('div');

	// name clickable if friend mode
	let span = document.createElement(config.multi ? 'a' : 'span');
	span.classList.add('profile-name');
	span.title = profile.nickname && profile.nickname.length > 0 ? profile.nickname.removeNumberPrefix() : '';
	span.innerText = profile.name;
	if (config.multi) {
		span.href = 'javascript:void(0)';
		span.addEventListener('click', function () {
			generateProfileFromJSON(this);
		});
		span.addEventListener('keyup', onKeyUpWantedListEntry);
	}
	else if (profile.nickname && profile.nickname.length > 0) {
		span.classList.add('points');
		span.addEventListener('click', function () {
			popupContent(this.title);
		});
	}

	cellDiv.appendChild(span);
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfileDob(profile) {
	if (config.debug) console.log('generateProfileDob');

	let cell = document.createElement('div');
	cell.style.display = 'flex';
	cell.style.justifyContent = 'space-evenly';

	//--DOB VALUE--//
	let cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');

	let dobSpan = document.createElement('span');
	dobSpan.classList.add('DOB');
	dobSpan.innerHTML = profile.dob.removeNumberPrefix();
	// show date, but dialog show age, if parsable
	let age = profile.dob.getAge();
	if (age != undefined && age > 0) {
		dobSpan.classList.add('points');
		dobSpan.title = `${age} ${config.labels.ageSuffix}`;
		dobSpan.addEventListener('click', function () {
			popupContent(this.title);
		});
	}
	//if dob has unkown year, show as [dd MMM]
	if (dobSpan.innerHTML.includes('????'))
		dobSpan.innerHTML = config.calendar.months[parseInt(profile.dob.substring(5, 7)) - 1] + ' ' + parseInt(profile.dob.substring(8, 10));
	
	cellDiv.appendChild(dobSpan);
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfileWithInnerHTML(profile, property) {
	let cell = document.createElement('div');
	if (profile[property] == undefined || profile[property].length == 0) return cell;

	//--VALUE--//
	cellDiv = document.createElement('div');
	cellDiv.classList.add('shift-center');
	cellDiv.innerHTML = profile[property].removeNumberPrefix();
	cell.appendChild(cellDiv);

	return cell;
}

function generateProfilePointers(profile, icons) {
	//map pointers
	let points = profile.pointers.map((item) => {
		let parts = item.split('|');
		return {
			label: parts[0],
			value: parts[1].removeNumberPrefix(),
			bool: parts[1].includes('Yes'),
			comment: parts[1].includes('[') ? findComment(profile, parts[1].substring(parts[1].indexOf('['))) : null,
		}
	});
	if (config.debug) console.log(points);

	let cell = document.createElement('div');
	cell.classList.add('profile-pointers');
	//render pointers
	for (let point of points) {
		let cellContainer = document.createElement('div');

		//--POINTERS LABEL--//
		let cellDiv = document.createElement('div');
		cellDiv.classList.add('profile-box-label');
		cellDiv.classList.add('page-align');
		cellDiv.title = point.label;
		cellDiv.innerText = point.label;
		if (icons) {
			cellDiv.innerText = icons[config.labels.turningPoint.split('|').indexOf(point.label)];
			if (!point.bool) cellDiv.classList.add('inactive');
		}
		cellContainer.appendChild(cellDiv);

		//--POINTERS VALUE--//
		cellDiv = document.createElement('div');
		cellDiv.classList.add('page-align');
		if (point.comment) {
			cellDiv.title = point.comment;
			cellDiv.classList.add('points');
			cellDiv.addEventListener('click', function () {
				popupContent(processComment(point.comment, profile.links));
			});
		}

		cellDiv.innerHTML = point.value;
		if (!icons) cellContainer.appendChild(cellDiv);
		cell.appendChild(cellContainer);

		//--LINE BREAK--//
		if (points.indexOf(point) < points.length - 1 && !icons) {
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
	}).filter(p => !config.profiles.map(p => p.id).includes(p));
	// console.log('friendsSearch', friendsSearch);
	config.list.profiles = config.data.filter(n => !(n.inactive === true) && n.rating && friendsSearch.includes(n.id));
	generateWantedList(true);
}

function generateProfileSocial(profile) {
	if (config.debug) console.log('generateProfileSocial');

	let container = document.createElement('div');
	container.classList.add('profile-socials');

	//--SOCIAL MEDIA--//	
	if (!config.multi && profile.social)
		generateProfileSocialButtons(container, profile.social);

	//--COMMENTS--//
	if (!config.multi && container.childNodes.length > 0 && profile.intro && profile.description && profile.rating)
		generateProfileCommentButton(
			container,
			processComment(profile.intro.removeNumberPrefix(), profile.links),
			processComment(profile.description.removeNumberPrefix(), profile.links),
			config.rating.prefix + '<br>' +
			ratingAsStarsDiv(profile.rating, config.rating.max)?.outerHTML +
			'<small class="tier">' + (config.rating.tiers[profile.rating - 1] ?? '') + '</small>'
		);

	return container;
}

function generateProfileSocialButtons(container, social) {
	for (let item of Object.keys(social)) {
		let span = document.createElement('a');
		span.classList.add('profile-social');
		span.classList.add('button');
		span.target = '_blank';

		let icon = document.createElement('i');
		icon.classList.add('bi');

		if (config.social[item]) {
			span.href = config.social[item].template.replace('{id}', social[item]);
			span.title = config.social[item].name;
			icon.classList.add('bi-' + item);
		}
		else {
			span.href = social[item];
			span.title = item.toLowerCase() != item ? item : 'External Link';
			icon.classList.add('bi-box-arrow-up-right');
		}

		span.appendChild(icon);
		span.appendChild(document.createTextNode(span.title));
		container.appendChild(span);
	}
}

function generateProfileCommentButton(container, header, body, footer) {
	let span = document.createElement('a');
	span.classList.add('profile-social');
	span.classList.add('button');
	span.href = 'javascript:void(0)';
	span.title = 'Comments';
	span.addEventListener('click', function () {
		popupContent(
			header +
			'<p style="font-style: italic;">"' + body + '"</p>' +
			footer
		);
	});

	let icon = document.createElement('i');
	icon.classList.add('bi');
	icon.classList.add('bi-chat-text-fill');
	span.appendChild(icon);
	span.appendChild(document.createTextNode(span.title));

	container.insertBefore(span, container.childNodes[0]);
}

////HELPER FUNCTIONS////
function ratingAsStarsDiv(rating, total) {
	let stars = document.createElement('span');
	stars.classList.add('stars');
	stars.title = rating + '/' + total;
	for (s = 0; s < Math.max(rating, total); s++) {
		let star = document.createElement('i');
		star.classList.add('bi');
		star.classList.add('bi-star' + (rating - s > 0 ? '-fill' : ''));
		if (s + 1 - total > 0) star.classList.add('extra-rating');
		stars.appendChild(star);
	}
	return stars;
}

function findComment(profile, commentIndexStr) {
	return profile.comments.find(c => c.includes(commentIndexStr))?.removeNumberPrefix();
}

function processComment(comment, refs) {
	let commentArr = [];
	let added = false;
	for (let ref of refs) {
		let refText = ref.substring(0, ref.indexOf('}') + 1);
		let refLink = ref.replace(refText, '');
		if (config.data.find(n => !(n.inactive === true) && config.profile.include(n) && n.id == refLink)) {
			// existing profile
			let replaced = comment.replace(refText, '<a target="_blank" onclick="generateProfileFromJSON(this)" data-name="' + refLink + '">' + refText + '</a>');
			if (config.debug) console.log('processComment profileId', replaced, comment);
			if (replaced != comment) {
				commentArr.push(replaced.replace('{', '').replace('}', ''));
				added = true;
			}
		}
		else if (refLink) {
			// url
			let replaced = comment.replace(refText, '<a target="_blank" href="' + refLink + '">' + refText + '</a>');
			if (config.debug) console.log('processComment link', replaced, comment);
			if (replaced != comment) {
				commentArr.push(replaced.replace('{', '').replace('}', ''));
				added = true;
			}
		}
	}
	if (!added)
		commentArr.push(comment);
	return commentArr.join('<br/>');
}

////PRIMITIVE HELPERS////
String.prototype.getAge = function () {
	//support for date types: yyyy.MM.dd, ????.MM.dd, ????.??.??
	if (this.includes('?')) return 0;
	let birthDateStr = this.replace('.', '-').replace('.', '-');
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), { zone: config.timezone });
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), { zone: config.timezone });
	if (config.debug) console.log('getAge', today, birthDate);
	return parseInt(today.diff(birthDate, 'years').years);
}

String.prototype.isAfterToday = function () {
	let birthDateStr = this.replace('.', '-').replace('.', '-'); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = luxon.DateTime.fromISO(birthDateStr.substring(0, 10), { zone: config.timezone });
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), { zone: config.timezone });
	return today.diff(birthDate, 'days').days >= 0;
}

String.prototype.removeNumberPrefix = function () {
	return this.replace(/\[[1-9]\]/, '');
}

////CHECKS////
function daysFromMe() {
	let me = config.list.timeline.filter(t => t.name == 'Me')[0];
	let others = config.list.timeline.filter(t => t.name != 'Me');
	console.log('with respect to ' + me.date + ':');
	let away = new Array();
	for (let other of others) {
		if (other.date.includes('????')) continue;
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

	console.log(away.sort((a, b) => a.days - b.days));
}

function friendCheck() {
	console.log('Friend check!');

	if (config.list.friends.length == 1 && config.list.friends.length > 0) {
		config.list.friends.sort(function (a, b) {
			return a.id.localeCompare(b.id)
		});

		//check duplicate ids
		for (let pair of config.list.friends) {
			let result = config.list.friends.filter(function (f) {
				return f.id == pair.id;
			});
			if (result != undefined && result.length > 1)
				console.log(pair.id + ' has exact duplicates');
		}

		//check ids but of different positions
		for (let pair of config.list.friends) {
			let splits = pair.id.split('-');
			let result = config.list.friends.filter(function (f) {
				return f.id == (splits[1] + '-' + splits[0]);
			});
			if (result != undefined && result.length > 0)
				console.log(pair.id + ' has duplicates of different positions');
		}
	}

	console.log('Done.');
}

function showProfilesImageCount(threshold) {
	if (!threshold) threshold = 10;
	for (let profile of config.list.profiles) {
		if (profile.landscapes.length > threshold || profile.portraits.length > threshold)
			console.log(profile.name, profile.landscapes.length + ' landscapes', profile.portraits.length + ' portraits');
	}
}

////DIALOG////
function popupContent(input) {
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv == null) {
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// node in dialog will not have events!
	let dialog = document.createElement('dialog');
	if (!dialog.classList.contains('box')) dialog.classList.add('box');
	if (typeof node == 'string')
		dialog.innerHTML = node;
	if (typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function () {
		this.remove();
	});
	dialog.addEventListener('keyup', function () {
		if (event.key === ' ' || event.key === 'Enter')
			this.remove();
	});
	return dialog;
}
