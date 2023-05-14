//--DEFAULT SETTINGS--//
const timezone = 'Asia/Tokyo';
const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const data = [
	{
		name: '長江里加の“じゅうななへんげ”',
		startDayNo: 1,
		startTime: 2200,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'シーサイドチャンネル',
		url: 'https://www.youtube.com/@SeasideChannel',
		format: 'Audio Premiere',
	},
	{
		name: '本気出せ！#大空直美',
		startDayNo: 1,
		startTime: 2200,
		lengthMinutes: 30,
		recurringWeeks: [2,4],
		channel: 'ニコニコチャンネル',
		url: 'https://ch.nicovideo.jp/onetone',
		format: 'Audio Live',
	},
	{
		name: '東山奈央のラジオ＠リビング',
		startDayNo: 1,
		startTime: 2300,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'http://www.joqr.co.jp/naoliving/',
		format: 'Audio Live',
	},
	{
		name: '菅野真衣のマイペースマイワールド',
		startDate: '2023-01-02',
		startDayNo: 1,
		startTime: 2430,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコチャンネル',
		url: 'https://ch.nicovideo.jp/maimild',
		format: 'Audio Live',
	},
	{
		name: '夏川椎菜のCultureZ',
		startDayNo: 1,
		startTime: 2500,
		endDate: '2023-03-20',
		lengthMinutes: 120,
		recurringWeeks: [1,2,3,4,5],
		channel: 'YouTube',
		url: 'https://www.youtube.com/@CultureZ_',
		format: 'Video Live',
	},
	{
		name: 'Lynnのおしゃべりんらじお',
		startDayNo: 1,
		startTime: 2530,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/lynn/',
		format: 'Audio Live',
	},
	{
		name: '会沢紗弥のエンディングは上機嫌で',
		startDayNo: 2,
		startTime: 2100,
		lengthMinutes: 30,
		recurringWeeks: [2,4],
		channel: 'ニコニコチャンネル',
		url: 'https://ch.nicovideo.jp/voicegarage/blomaga/ar1898536',
		format: 'Video Live',
	},
	{
		name: 'TrySailのTRYangle harmony',
		startDayNo: 2,
		startTime: 2200,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコチャンネル',
		url: 'http://try.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: '佐倉としたい大西',
		startDayNo: 2,
		startTime: 2330,
		endDate: '2023-03-28',
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/toshitai/',
		format: 'Video Live',
	},
	{
		name: '鬼頭明里のsmiley pop',
		startDayNo: 3,
		startTime: 1930,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'http://smp.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: 'たかみなと大西のたかにしや',
		startDayNo: 3,
		startTime: 2200,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコ動画',
		url: 'http://takanishi.secondshot.jp/',
		format: 'Video Live',
	},
	{
		name: 'Pyxisのキラキラ大作戦！',
		startDayNo: 3,
		startTime: 2230,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコ動画',
		url: 'http://pyxis.secondshot.jp/',
		format: 'Video Live',
	},
	{
		name: '戸松遥のココロ☆ハルカス',
		startDate: '2023-02-02',
		startDayNo: 4,
		startTime: 2130,
		lengthMinutes: 30,
		recurringWeeks: 'alternate',
		channel: 'ニコニコ動画',
		url: 'http://harukas.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: '寿美菜子のラフラフ',
		startDate: '2023-02-09',
		startDayNo: 4,
		startTime: 2130,
		lengthMinutes: 30,
		recurringWeeks: 'alternate',
		channel: 'ニコニコ動画',
		url: 'http://laugh-rough.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: '豊崎愛生のおかえりらじお',
		startDayNo: 4,
		startTime: 2200,
		lengthMinutes: 60,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'http://okaeri.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: '花澤香菜のひとりでできるかな？',
		startDayNo: 4,
		startTime: 2300,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/dekirukana/',
		format: 'Audio Live',
	},
	{
		name: '上田麗奈のひみつばこ',
		startDayNo: 4,
		startTime: 2330,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/himi2/',
		format: 'Audio Live',
	},
	{
		name: '竹達・沼倉の初ラジ！',
		startDayNo: 6,
		startDate: '2023-04-01',
		startTime: 1900,
		endDate: '2023-06-30',
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/wiwi/',
		format: 'Audio Live',
	},
	{
		name: '小原好美のココロおきなく',
		startDayNo: 7,
		startTime: 2000,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/kokoradi/',
		format: 'Audio Live',
	},
	{
		name: '水瀬いのり MELODY FLAG',
		startDayNo: 7,
		startTime: 2200,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: '文化放送',
		url: 'http://melody-flag.com',
		format: 'Audio Live',
	},
];

//--COMMON EVENTS--//
window['mode'] = 'week'; // change html for default icon (ends with _week or _month)
window.addEventListener('load', startup);

//--FUNCTIONS--//
function startup() {
	generateCalendar(new Date().getFullYear(), new Date().getMonth(), window['mode'] == 'week' ? new Date().getDate() : null); // month is zero-based
}

function generateCalendar(year, month, day) {
	// add class or id to each cell, easier to add content
	// use table tag, don't use css grid
	// console.log(year, month);
	
	let calendar = document.createElement('div');
	
	//TODO: allow start from monday
	// generate calendar array
	let [calendarArray, week, noOfWeeks] = generateCalendarArray(year, month, day);
	window['week-count'] = noOfWeeks;
	// console.log(calendarArray);
	
	// generate calendar HTML
	let table = typeof week == 'number' ? generateCalendarWeekTable(year, month, week, day, calendarArray) : generateCalendarMonthTable(year, month, calendarArray);	
	calendar.appendChild(table);
	
	document.querySelector('.list').innerHTML = '';
	document.querySelector('.list').appendChild(calendar);
	
	// populate with summary on expanded calendar
	if(week)
		addDetailedEventsToCalendar();
	else
		addSummaryEventsToCalendar();
	
	// add marked items on expanded calendar
	if(week)
		addMarkedEventsToWeekCalendar();
	else
		addMarkedEventsToMonthCalendar();
	
	// show events, per day, can include upcoming
	let events = document.createElement('div');
	events.classList.add('events');
	
}

function generateCalendarArray(year, month, day) {
	let calendarArray = new Array();
	let dayOfMonth = 1;
	let currentWeekNo = null;
	let noOfWeeks = null;
	for (let weekNo = 0; weekNo < 6; weekNo++) {
		if(noOfWeeks) continue;
		let emptyDays = ['', '', '', '', '', '', ''];
		for (let dayNo = 0; dayNo < 7; dayNo++) {
			if (new Date(year, month, dayOfMonth).getDay() == dayNo) {
				if (dayOfMonth > new Date(year, month+1, 0).getDate()) { //if hit max day no of month, stop
					noOfWeeks = weekNo;
					break;
				}
				emptyDays[dayNo] = dayOfMonth++;
			}
		}
		if(day && emptyDays.includes(day))
			currentWeekNo = weekNo;
		calendarArray.push(emptyDays);
	}
	return [calendarArray, currentWeekNo, noOfWeeks];
}

function generateCalendarMonthTable(year, month, array) {
	let table = document.createElement('div');
	
	let body = document.createElement('div');
	body.classList.add('calendar');
	body.classList.add('full');
	window['year'] = year;
	window['month'] = month;
	
	let row = document.createElement('div');
	row.classList.add('header');
	row.classList.add('row');
	
	let prev = document.createElement('div');
	prev.classList.add('prev');
	prev.classList.add('material-icons');
	prev.style.gridColumn = 'span 2';
	prev.innerText = 'arrow_back_ios';
	prev.title = 'Previous Month';
	prev.addEventListener('click', function() {
		if(window['month'] - 1 < 0) {
			generateCalendar(window['year'] - 1, 11);
			return;
		}
		// console.log(window['year'], window['month']-1);
		generateCalendar(window['year'], window['month']-1);
	});
	row.appendChild(prev);
	
	let title = document.createElement('div');
	title.style.gridColumn = 'span 3';
	title.innerText = monthsOfYear[month] + ' ' + year;
	row.appendChild(title);
	
	let next = document.createElement('div');
	next.classList.add('next');
	next.classList.add('material-icons');
	next.style.gridColumn = 'span 2';
	next.innerText = 'arrow_forward_ios';
	next.title = 'Next Month';
	next.addEventListener('click', function() {
		if(window['month'] + 1 > 11) {
			generateCalendar(window['year'] + 1, 0);
			return;
		}
		// console.log(window['year'], window['month']+1);
		generateCalendar(window['year'], window['month']+1);
	});
	row.appendChild(next);
	
	body.appendChild(row);
	
	row = document.createElement('div');
	row.classList.add('header');
	row.classList.add('row');
	
	for(let day of daysOfWeek)
	{
		let dayDiv = document.createElement('div');
		dayDiv.innerText = day;
		row.appendChild(dayDiv);
	}
	
	body.appendChild(row);
	
	for (let week = 0; week < array.length; week++) {
		let rowHeader = document.createElement('div');
		rowHeader.classList.add('row');
		
		row = document.createElement('div');
		row.classList.add('row');
		for (let day = 0; day < 7; day++) {
			let cellHeader = document.createElement('div');
			cellHeader.innerHTML = '<div class="number">' + array[week][day] + '</div>';
			rowHeader.appendChild(cellHeader);
			
			let cell = document.createElement('div');
			if(array[week][day] > 0) {
				cell.classList.add('day');
				cell.classList.add('cell');
				cell.setAttribute('data-id', array[week][day]);			// day of month
				cell.setAttribute('data-day', day == 0 ? 7 : day);		// day of week (0 is sunday)
				cell.setAttribute('data-month', monthsOfYear[month]);	// month
				cell.setAttribute('data-year', window['year']);			// year
				cell.setAttribute('data-date', 10000*window['year'] + 100*(month + 1) + array[week][day]); // date as number
			}
			row.appendChild(cell);
		}
		body.appendChild(rowHeader);
		body.appendChild(row);
	}
	
	let foot = document.createElement('div');
	foot.classList.add('footer');
	foot.style.gridColumn = 'span 7';	
	foot.innerText = '';
	
	body.appendChild(foot);
	
	table.appendChild(body);
	
	return table;
}

function generateCalendarWeekTable(year, month, week, day, array) {
	let table = document.createElement('div');
	
	let body = document.createElement('div');
	body.classList.add('calendar');
	body.classList.add('full');
	body.classList.add('expanded');
	window['year'] = year;
	window['month'] = month;
	window['week'] = week;
	window['day'] = day;
	
	let row = document.createElement('div');
	row.classList.add('header');
	row.classList.add('row');
	
	let prev = document.createElement('div');
	prev.classList.add('prev');
	prev.classList.add('material-icons');
	prev.style.gridColumn = 'span 2';
	prev.innerText = 'arrow_back_ios';
	prev.title = 'Previous Week';
	prev.addEventListener('click', function() {
		if(window['week'] - 1 == 0) { // if hit first week
			generateCalendar(window['year'], window['month'], 1);
			return;
		}
		if(window['day'] - 7 < 0) { // if hit previous month
			if(window['month'] - 1 < 0) { // if hit previous year
				generateCalendar(window['year'] - 1, 11, getLastDayOfMonth(11, window['year']-1));
				return;
			}
			generateCalendar(window['year'], window['month'] - 1, getLastDayOfMonth(window['month']-1, window['year']));
			return;
		}
		// console.log(window['year'], window['month']-1);
		generateCalendar(window['year'], window['month'], window['day'] - 7);
	});
	row.appendChild(prev);
	
	let title = document.createElement('div');
	title.style.gridColumn = 'span 3';
	title.innerText = monthsOfYear[month] + ' ' + year;
	row.appendChild(title);
	
	let next = document.createElement('div');
	next.classList.add('next');
	next.classList.add('material-icons');
	next.style.gridColumn = 'span 2';
	next.innerText = 'arrow_forward_ios';
	next.title = 'Next Week';
	next.addEventListener('click', function() {
		if(window['week'] + 1 == window['week-count'] - 1) { // if hit final week
			generateCalendar(window['year'], window['month'], getLastDayOfMonth(window['month'], window['year']));
			return;
		}
		if(window['day'] + 7 > getLastDayOfMonth(window['month'], window['year'])) { // if hit next month
			if(window['month'] + 1 > 11) { // if hit next year
				generateCalendar(window['year'] + 1, 0, 1);
				return;
			}
			generateCalendar(window['year'], window['month'] + 1, 1);
			return;
		}
		// console.log(window['year'], window['month']+1);
		generateCalendar(window['year'], window['month'], window['day']+7);
	});
	row.appendChild(next);
	
	body.appendChild(row);
	
	row = document.createElement('div');
	row.classList.add('header');
	row.classList.add('row');
	
	for(let day of daysOfWeek)
	{
		let dayDiv = document.createElement('div');
		dayDiv.innerText = day;
		row.appendChild(dayDiv);
	}
	
	body.appendChild(row);
	
	for (let weekNo = 0; weekNo < 6; weekNo++) {
		if(typeof week == 'number' && weekNo != week) continue;
		let rowHeader = document.createElement('div');
		rowHeader.classList.add('row');
		
		row = document.createElement('div');
		row.classList.add('row');
		for (let dayNo = 0; dayNo < 7; dayNo++) {
			let cellHeader = document.createElement('div');
			cellHeader.innerHTML = '<div class="number">' + array[weekNo][dayNo] + '</div>';
			rowHeader.appendChild(cellHeader);
			
			let cell = document.createElement('div');
			if(array[weekNo][dayNo] > 0) {
				cell.classList.add('day');
				cell.classList.add('cell');
				cell.setAttribute('data-id', array[weekNo][dayNo]);			// day of month
				cell.setAttribute('data-day', dayNo == 0 ? 7 : dayNo);		// day of week (0 is sunday)
				cell.setAttribute('data-month', monthsOfYear[month]);		// month
				cell.setAttribute('data-year', window['year']);				// year
				cell.setAttribute('data-date', 10000*window['year'] + 100*(month + 1) + array[weekNo][dayNo]); // date as number
			}
			row.appendChild(cell);
		}
		body.appendChild(rowHeader);
		body.appendChild(row);
	}
	
	let foot = document.createElement('div');
	foot.classList.add('footer');
	foot.style.gridColumn = 'span 7';	
	foot.innerText = '';
	
	body.appendChild(foot);
	
	table.appendChild(body);
	
	return table;
}

function addDetailedEventsToCalendar() {
	for(let single of data)
	{
		// assume events must have weeks defined
		if(typeof single.recurringWeeks == 'object')
		{
			let weekdays = document.querySelectorAll('div[data-day="' + single.startDayNo + '"]');
			for(let weekNo of single.recurringWeeks)
			{
				let date = weekdays[weekNo-1];
				let fullDate = parseInt(date?.getAttribute('data-date'));
				if(date &&
				(!single.startDate || fullDate >= parseInt(single.startDate.replace(/-/g,''))) &&
				(!single.endDate || fullDate <= parseInt(single.endDate.replace(/-/g,''))))
				{
					if(!date.classList.contains('expanded'))
						date.classList.add('expanded');
					createDetailedEvent(date, single);
				}
			}
		}
		
		// special case: alternating weeks independent of week no
		if(single.recurringWeeks == 'alternate' && single.startDate)
		{
			let start = new Date(single.startDate);
			//needs each month last day, check if hit eg. 31st day
			let end = new Date(single.endDate ?? '' + (window['month'] + 2 >= 12 ? window['year'] + 1 : window['year']) + '-' + (window['month'] + 2) + '-01');
			// console.log(start, end);
			let date = start;
			let count = 1;
			do {
				// console.log(window['year'],date.getFullYear(),window['month'],date.getMonth());
				if(window['year'] == date.getFullYear() && window['month'] == date.getMonth() && count % 2 > 0)
				{
					let day = document.querySelector('div[data-id="' + date.getDate() + '"]');
					// console.log(day);
					if(day) {
						createDetailedEvent(day, single);
						if(!day.classList.contains('expanded'))
							day.classList.add('expanded');
					}
				}
				// console.log(date);
				// console.log(count % 2 > 0);
				date = addDays(date, 7);
				count++;
			} while (date <= end || count > 100); // fallback			
		}
	}
	
}

function addSummaryEventsToCalendar() {
	for(let single of data)
	{
		// assume events must have weeks defined
		if(typeof single.recurringWeeks == 'object')
		{
			let weekdays = document.querySelectorAll('div[data-day="' + single.startDayNo + '"]');
			for(let weekNo of single.recurringWeeks)
			{
				let date = weekdays[weekNo-1];
				let fullDate = parseInt(date?.getAttribute('data-date'));
				if(date &&
				(!single.startDate || fullDate >= parseInt(single.startDate.replace(/-/g,''))) &&
				(!single.endDate || fullDate <= parseInt(single.endDate.replace(/-/g,''))))
				{
					if(date.classList.contains('expanded'))
						date.classList.remove('expanded');
					createSummaryEvent(date, single);
				}
			}
		}
		
		// special case: alternating weeks independent of week no
		if(single.recurringWeeks == 'alternate' && single.startDate)
		{
			let start = new Date(single.startDate);
			//needs each month last day, check if hit eg. 31st day
			let end = new Date(single.endDate ?? '' + (window['month'] + 2 >= 12 ? window['year'] + 1 : window['year']) + '-' + (window['month'] + 2) + '-01');
			// console.log(start, end);
			let date = start;
			let count = 1;
			do {
				// console.log(window['year'],date.getFullYear(),window['month'],date.getMonth());
				if(window['year'] == date.getFullYear() && window['month'] == date.getMonth() && count % 2 > 0)
				{
					let day = document.querySelector('div[data-id="' + date.getDate() + '"]');
					// console.log(day);
					if(day) {
						createSummaryEvent(day, single);
						if(day.classList.contains('expanded'))
							day.classList.remove('expanded');
					}
				}
				// console.log(date);
				// console.log(count % 2 > 0);
				date = addDays(date, 7);
				count++;
			} while (date <= end || count > 100); // fallback			
		}
	}
}

function createDetailedEvent(elem, single) {
	let content = document.createElement('div');
	content.classList.add('content');
	content.classList.add('expanded');
	content.tabIndex = '-1';
	content.title = single.name;
	content.innerHTML = single.name + '<br>' + 
	single.format + '<br>' + 
	single.channel + '<br>' +
	daysOfWeek[single.startDayNo == 7 ? 0 : single.startDayNo] + ', ' + 
	elem.getAttribute('data-month') + ' ' + elem.getAttribute('data-id') + ', ' + 
	single.startTime + '-' + getEndTime(single.startTime, single.lengthMinutes) + '<br>' +
	convertTextToHTML(single.url, [single.url]);
	content.addEventListener('click', function() {
		document.querySelector('.footer').innerHTML = convertTextToHTML(content.innerHTML, []);
	});
	content.addEventListener('contextmenu', function() {
		event.preventDefault();
		this.classList.add('marked');
		addToMarked({
			date: elem.getAttribute('data-id'),
			month: elem.getAttribute('data-month'),
			year: elem.getAttribute('data-year'),
			id: single.name
		});
	});
	elem.appendChild(content);
}

function createSummaryEvent(elem, single) {
	let content = document.createElement('div');
	content.classList.add('content');
	content.tabIndex = '-1';
	content.innerText = single.name;
	content.title = single.name + '\n' + 
	single.format + '\n' + 
	single.channel + '\n' +
	daysOfWeek[single.startDayNo == 7 ? 0 : single.startDayNo] + ', ' + 
	elem.getAttribute('data-month') + ' ' + elem.getAttribute('data-id') + ', ' + 
	single.startTime + '-' + getEndTime(single.startTime, single.lengthMinutes) + '\n' +
	single.url;
	content.addEventListener('click', function() {
		document.querySelector('.footer').innerHTML = convertTextToHTML(this.title, [single.url]);
	});
	content.addEventListener('contextmenu', function() {
		event.preventDefault();
		this.classList.add('marked');
		addToMarked({
			date: elem.getAttribute('data-id'),
			month: elem.getAttribute('data-month'),
			year: elem.getAttribute('data-year'),
			id: single.name
		});
	});
	elem.appendChild(content);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function addMarkedEventsToWeekCalendar() {
	let list = JSON.parse(localStorage.getItem('calendar-marked') ?? '[]');
	for(let item of list)
	{
		let box = document.querySelector('div[data-id="' + item.date + '"][data-month="' + item.month + '"][data-year="' + item.year + '"]');
		if(box != null) {
			for(let cell of box.querySelectorAll('div'))
			{
				// console.log(cell);
				if(cell.title == item.id)
				{
					cell.classList.add('marked');
				}
			}
		}
	}
}

function addMarkedEventsToMonthCalendar() {
	let list = JSON.parse(localStorage.getItem('calendar-marked') ?? '[]');
	for(let item of list)
	{
		let box = document.querySelector('div[data-id="' + item.date + '"][data-month="' + item.month + '"][data-year="' + item.year + '"]');
		if(box != null) {
			for(let cell of box.querySelectorAll('div'))
			{
				// console.log(cell);
				if(cell.innerText == item.id)
				{
					cell.classList.add('marked');
				}
			}
		}
	}
}

function addToMarked(item) {
	let current = JSON.parse(localStorage.getItem('calendar-marked') ?? '[]');
	current.push(item);
	localStorage.setItem('calendar-marked', JSON.stringify(current));
}

function clearMarked() {
	if(confirm('Confirm to clear marked? This action is irreversible.'))
	{
		localStorage.removeItem('calendar-marked');
		for(let marked of document.querySelectorAll('.marked'))
		{
			marked.classList.remove('marked');
		}
	}
}

function convertTextToHTML(html, urls) {
	// all newlines to be line break tag
	html = html.replace(/\n/g, '<br>');
	
	// all links provided will to be in link tag
	for(let url of urls)
	{
		html = html.replace(url, '<a target="_blank" href="' + url + '">' + url + '</a>');
	}
	
	return html;
}

function getEndTime(start, minutes) {
	minutes += start%100;
	let hours = 0;
	while(minutes >= 60) {
		hours += 1;
		minutes -=60;
	}
	
	start = start - start%100;
	return start + (hours*100) + minutes;
}

function getLastDayOfMonth(monthNo, yearNo) {
	if([0,2,4,6,7,9,11].includes(monthNo))
		return 31;
	if([3,5,8,10].includes(monthNo))
		return 30;
	if([1].includes(monthNo)) {
		if(yearNo % 4 == 0)
			return 29;
		return 28;
	}
}

function toggleWeekMode() {
	if(window['mode'] == 'month') {
		window['mode'] = 'week';
		document.querySelector('.mode').innerText = 'calendar_view_week';
	}
	else {
		window['mode'] = 'month';
		document.querySelector('.mode').innerText = 'calendar_view_month';
	}
	
	generateCalendar(new Date().getFullYear(), new Date().getMonth(), window['mode'] == 'week' ? new Date().getDate() : null); // month is zero-based
}