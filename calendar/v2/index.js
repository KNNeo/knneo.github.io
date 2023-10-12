//--DEFAULT SETTINGS--//
const timezone = 'Asia/Tokyo';
const daysOfWeek = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const templates = [
	{
		name: '高橋李依・上田麗奈 仕事で会えないからラジオはじめました。',
		startDayNo: 1,
		startDate: '2023-07-24',
		startTime: 1300,
		lengthMinutes: 30,
		recurringWeeks: 'alternate',
		channel: 'インターネットラジオステーション＜音泉＞',
		url: 'https://www.onsen.ag/program/shigohaji',
		format: 'Audio Premiere',
	},
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
		name: 'ミュージックレイン3期生 新番組ベータ版',
		startDayNo: 2,
		startTime: 2330,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコチャンネル',
		url: 'http://beta.secondshot.jp/',
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
		name: '麻倉ももの日常系ラジオ',
		startDayNo: 3,
		startTime: 2100,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'Radiotalk',
		url: 'https://radiotalk.jp/program/108065',
		format: 'Audio Live',
	},
	{
		name: 'たかみなと大西のたかにしや',
		startDayNo: 3,
		startTime: 2200,
		endDate: '2023-06-14',
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
	{
		name: 'さやとみはるのさんかくカンケイ',
		startDayNo: 3,
		startDate: '2023-07-05',
		startTime: 1800,
		endDate: '2023-08-02',
		lengthMinutes: 30,
		recurringWeeks: 'alternate',
		channel: 'インターネットラジオステーション＜音泉＞',
		url: 'https://www.onsen.ag/program/sankaku',
		format: 'Video Live',
	},
	{
		name: 'イヤホンズの三平方の定理',
		startDayNo: 2,
		startDate: '2023-06-23',
		lengthMinutes: 30,
		recurringWeeks: [4],
		channel: 'インターネットラジオステーション＜音泉＞',
		url: 'https://www.onsen.ag/program/omimi',
		format: 'Audio Premiere',
	},
	{
		name: '堀江由衣の天使のたまご',
		startDayNo: 5,
		startTime: 2500,
		lengthMinutes: 30,
		channel: '文化放送',
		url: 'https://horie-yui.com/radio/',
		format: 'Audio Live',
	},
	{
		name: 'きどまだSeason2',
		channel: 'OPENREC.tv',
		frequency: 'Monthly',
		url: 'https://www.openrec.tv/user/kido-ibuki',
		format: 'Video Live',
	},
	{
		name: 'MIYU学院 放送部っ！',
		channel: 'ニコニコ動画',
		frequency: 'Monthly',
		url: 'https://ch.nicovideo.jp/miyugaku',
		format: 'Video Live',
	},
	{
		name: '大久保瑠美の◯◯な件',
		channel: 'ニコニコ動画',
		frequency: 'Monthly',
		url: 'https://ch.nicovideo.jp/seigura',
		format: 'Video Live',
	},
	{
		name: '日笠・佐倉は余談を許さない',
		startDayNo: 4,
		startDate: '2023-10-05',
		startTime: 2130,
		lengthMinutes: 30,
		channel: '文化放送『超！A&G＋』',
		url: 'https://www.joqr.co.jp/qr/program/yodan/',
		format: 'Audio Live',
	},
];

//--COMMON EVENTS--//
window['mode'] = 'month'; // change html for default icon (ends with _week or _month)
window.addEventListener('load', startup);
Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

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
	// console.log(day, week);
	
	// generate calendar HTML
	let table = generateCalendarMonthTable(year, month, week, day, calendarArray);
	calendar.appendChild(table);
	window['week-count'] = noOfWeeks + 1; // technically speaking all months have 5 weeks
	
	document.querySelector('.list').innerHTML = '';
	document.querySelector('.list').appendChild(calendar);
	
	// add marked items on expanded calendar
	addMarkedEventsToMonthCalendar();
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

function generateCalendarMonthTable(year, month, _week, day, array) {
	let table = document.createElement('div');
	
	let body = document.createElement('div');
	body.classList.add('calendar');
	body.classList.add('full');
	window['year'] = year;
	window['month'] = month;
	window['week'] = _week;
	if(day)
		window['day'] = day;
	
	let row = document.createElement('div');
	row.classList.add('header');
	row.classList.add('row');
	
	let prev = document.createElement('div');
	prev.classList.add('prev');
	prev.classList.add('material-icons');
	prev.style.gridColumn = 'span 2';
	prev.innerText = 'arrow_back_ios';
	prev.title = 'Previous Month';
	if(typeof _week == 'number')
	{
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
	}
	else
	{
		prev.addEventListener('click', function() {
			if(window['month'] - 1 < 0) {
				generateCalendar(window['year'] - 1, 11);
				return;
			}
			// console.log(window['year'], window['month']-1);
			generateCalendar(window['year'], window['month']-1);
		});
	}
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
	if(typeof _week == 'number')
	{
		next.addEventListener('click', function() {
			console.log(window['day'] + 7 , getLastDayOfMonth(window['month'], window['year']));
			if(window['day'] + 7 > getLastDayOfMonth(window['month'], window['year'])) { // if hit next month
				if(window['month'] + 1 > 11) { // if hit next year
					generateCalendar(window['year'] + 1, 0, 1);
					return;
				}
				generateCalendar(window['year'], window['month'] + 1, 1);
				return;
			}
			if(document.querySelector('.day[data-id="' + getLastDayOfMonth(window['month'], window['year']) + '"]') != null) { // if hit final week
				generateCalendar(window['year'], window['month'], getLastDayOfMonth(window['month'], window['year']));
				return;
			}
			// console.log(window['year'], window['month']+1);
			generateCalendar(window['year'], window['month'], window['day']+7);
		});
	}
	else
	{
		next.addEventListener('click', function() {
			if(window['month'] + 1 > 11) {
				generateCalendar(window['year'] + 1, 0);
				return;
			}
			// console.log(window['year'], window['month']+1);
			generateCalendar(window['year'], window['month']+1);
		});
	}
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
		row.classList.add('week');
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

function addDetailedEventToCalendar() {
	// Clone and append the template content to the container
	let template = document.querySelector('#add-event-template');
	let clone = document.importNode(template.content, true);
	popupText(clone);
	
	// Handle form submission
	let form = document.querySelector('#event-form');
	form.addEventListener('submit', function(event) {
		event.preventDefault(); // Prevent the default form submission

		// Get form data
		let formData = new FormData(form);
		
		// Process and handle the form data as needed
		let newData = {
			id: formData.get('name'),
			name: formData.get('name'),
			date: new Date(formData.get('start_date')).getDate(),
			month: new Date(formData.get('start_date')).getMonth(),
			year: new Date(formData.get('start_date')).getFullYear(),
			time: parseInt(formData.get('start_hour') + formData.get('start_minute')),
			duration: parseInt(formData.get('duration')),
			description: formData.get('description'),
			url: formData.get('link'),
		};
		// console.log(newData);
			
		// After processing, you can optionally display a success message or perform other actions
		setTimeout(removeDialog, 0);
		let date = new Date(newData.startDate);
		addToMarked(newData);
		startup();
	});
	
	// Handle dropdown selection change
	let dropdown = form.querySelector('#event-select');
	let today = parseInt(new Date().toISOString().slice(0,10).replace(/-/g,''));
	for(let templateEvent of templates
		.filter(t => 
			(t.startDate && parseInt(t.startDate.replace(/-/g,'')) <= today) ||  
			(t.endDate && parseInt(t.endDate.replace(/-/g,'')) >= today) || 
			(!t.startDate && !t.endDate))
		.sort((a,b) => a.startDayNo - b.startDayNo)
	)
	{
		let option = document.createElement('option');
		option.value = templateEvent.name;
		option.innerText = templateEvent.name;
		dropdown.appendChild(option);
	}
	dropdown.addEventListener('change', function() {
		populateForm(templates.find(t => t.name == this.value));
	});
}

// Function to populate form fields based on selected event
function populateForm(selectedEvent) {
	const form = document.querySelector('#event-form');
	if (selectedEvent) {
		form.querySelector('#name').value = selectedEvent.name;
		// Find latest date by day of week
		let latestDate = new Date();
		let count = 0;
		if(selectedEvent.startDayNo) {
			while (latestDate.getDay() != (selectedEvent.startDayNo == 7 ? 0 : selectedEvent.startDayNo) && count > -8) {
				latestDate = new Date().addDays(--count);
				// console.log(count, latestDate);
			}			
		}
		
		form.querySelector('#start_date').value = latestDate.toISOString().slice(0,10);
        // Extract time
        var hours = Math.floor(selectedEvent.startTime / 100);
        var minutes = selectedEvent.startTime % 100;
        // Format hours and minutes with a colon
        var formattedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0');
		// Get day from latestDate
		var dayOfWeek = latestDate.getDay();
		form.querySelector('#start_hour').value = hours;
		form.querySelector('#start_minute').value = minutes;
		form.querySelector('#duration').value = selectedEvent.lengthMinutes;
		form.querySelector('#description').value = 
			(dayOfWeek ? daysOfWeek[dayOfWeek == 7 ? 0 : dayOfWeek] + ', ' : '') + 
			monthsOfYear[latestDate.getMonth()] + ' ' + latestDate.getDate() + 
			(selectedEvent.startTime ? ' | ' + selectedEvent.startTime + '-' + getEndTime(selectedEvent.startTime, selectedEvent.lengthMinutes) : '') + '\n' +
			selectedEvent.name + '\n' + 
			selectedEvent.format + '\n' + 
			selectedEvent.channel + '\n' +
			selectedEvent.url;
		form.querySelector('#link').value = selectedEvent.url;
		window.format = selectedEvent.format;
		window.channel = selectedEvent.channel;
	}
	else {
		for(let field of form.querySelectorAll('input[id], textarea[id]'))
		{
			field.value = null;
		}
		// form.querySelector('#name').value = null;
		// form.querySelector('#start_date').value = new Date();
		// form.querySelector('#start_time').value = null;
		// form.querySelector('#duration').value = null;
		// form.querySelector('#description').value = null;
		// form.querySelector('#link').value = null;
	}
}

function generateDescription() {
	const form = document.querySelector('#event-form');
	const latestDate = new Date(form.querySelector('#start_date').value);
	const dayOfWeek = latestDate.getDay();
	const startTime = form.querySelector('#start_hour').value && parseInt(form.querySelector('#start_minute').value && form.querySelector('#start_hour').value + form.querySelector('#start_minute').value);
	const lengthMinutes = parseInt(form.querySelector('#duration').value);
	form.querySelector('#description').value = 
			(dayOfWeek ? daysOfWeek[dayOfWeek == 7 ? 0 : dayOfWeek] + ', ' : '') + // optional field if update via form
			monthsOfYear[latestDate.getMonth()] + ' ' + latestDate.getDate() + 
			(startTime && lengthMinutes ? ' | ' + startTime + '-' + getEndTime(startTime, lengthMinutes) : '') + '\n' +
			form.querySelector('#name').value + '\n' + 
			window.format + '\n' + 
			window.channel + '\n' +
			form.querySelector('#link').value;
}

function createSummaryEvent(elem, single) {
	let content = document.createElement('div');
	content.classList.add('content');
	content.tabIndex = '-1';
	content.innerText = single.name;
	content.title = single.description;
	content.addEventListener('click', function() {
		document.querySelector('.footer').innerHTML = convertTextToHTML(this.title, [single.url]);
	});
	content.addEventListener('contextmenu', function() {
		event.preventDefault();
		document.querySelector('.footer').innerHTML = '';
		removeFromMarked(single);
		startup();
	});
	elem.appendChild(content);
}

function addMarkedEventsToMonthCalendar() {
	let list = JSON.parse(localStorage.getItem('calendar-marked-v2') ?? '[]');
	for(let item of list)
	{
		let box = document.querySelector('div[data-id="' + item.date + '"][data-month="' + monthsOfYear[item.month] + '"][data-year="' + item.year + '"]');
		if(box != null) {
			createSummaryEvent(box, item);
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
	let key = 'calendar-marked-v2';
	let current = JSON.parse(localStorage.getItem(key) ?? '[]');
	current.push(item);
	localStorage.setItem(key, JSON.stringify(current));
	// console.log(JSON.parse(localStorage.getItem(key) ?? '[]'));
}

function removeFromMarked(item) {
	let current = JSON.parse(localStorage.getItem('calendar-marked-v2') ?? '[]');
	// console.log(current);
	if(current.length > 0)
	{
		let updated = current.filter(c => JSON.stringify(c) != JSON.stringify(item));
		// console.log(updated);
		localStorage.setItem('calendar-marked-v2', JSON.stringify(updated));
	}
}

function clearMarked() {
	if(confirm('Confirm to clear marked? This action is irreversible.'))
	{
		localStorage.removeItem('calendar-marked-v2');
		for(let marked of document.querySelectorAll('.marked'))
		{
			marked.classList.remove('marked');
		}
	}
}

function clearEvents() {
	if(confirm('Confirm to clear marked? This action is irreversible.'))
	{
		localStorage.removeItem('calendar-marked-v2');
		startup();
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

function showTemplates() {
	let today = parseInt(new Date().toISOString().slice(0,10).replace(/-/g,''));
	let closeBtn = '<input type="button" value="Close" onclick="removeDialog()"><br>';
	let displayText = closeBtn + templates
		.filter(t => 
			(t.startDate && parseInt(t.startDate.replace(/-/g,'')) <= today) ||  
			(t.endDate && parseInt(t.endDate.replace(/-/g,'')) >= today) || 
			(!t.startDate && !t.endDate))
		.sort((a,b) => a.startDayNo - b.startDayNo)
		.map(t => 
			t.name + '<br><small>' + 
			(t.frequency || '') + ' ' + t.format + '<br>' +
			(t.startDayNo == 7 ? daysOfWeek[0] : daysOfWeek[t.startDayNo] || '') + 
			(t.startTime && t.lengthMinutes ? ', ' + t.startTime + ' - ' + getEndTime(t.startTime, t.lengthMinutes) + '<br>' : '<br>') + 
			'</small>')
		.join('<br><br>') + closeBtn;
	
	popupText(displayText);
}

function showData() {
	popupText('<textarea id="data" name="data" rows="8" cols="40" style="max-width: 90%;">' + localStorage.getItem('calendar-marked-v2') + '</textarea>' + 
	'<input type="submit" value="Copy" onclick="navigator.clipboard.writeText(document.querySelector(\'#data\').value);">' + 
	'<input type="submit" value="Close" onclick="updateData()">');
}

function updateData() {
	if(localStorage.getItem('calendar-marked-v2') != document.querySelector('#data').value) // if different, update
	{
		if(document.querySelector('#data').value.length < 1) // if empty, set empty array
			document.querySelector('#data').value = '[]';
		localStorage.setItem('calendar-marked-v2', document.querySelector('#data').value);
		startup();
	}
	removeDialog();
}

function exportEventsToCalendar() {
	let universalBOM = "\uFEFF"; // byte order mark, to fix url encoding issue
	let textOutput = universalBOM + 
	'"Subject","Start date","Start time","End date","End time","All Day Event","Description","Private"';
	// title, MM/dd/yyyy, HH:mm tt, MM/dd/yyyy, HH:mm tt, false, description, true

	for(let marked of JSON.parse(localStorage.getItem('calendar-marked-v2')))
	{
		//find event
		let details = data.find(function(d) {
			return d.name == marked.id && d.startTime;
		});
		
		if(details)
		{
			textOutput += '\n';
		
			//date formatting
			let monthNo = monthsOfYear.indexOf(marked.month); // zero-based
			
			let startHour = parseInt(details.startTime/100);
			let realStartDate = new Date(marked.year, monthNo, marked.date);
			if(startHour >= 24)
				realStartDate.setDate(realStartDate.getDate() + 1);
			// console.log(startHour);
			// console.log(realStartDate);
			let formatStartDate = (realStartDate.getMonth()+1) + '/' + realStartDate.getDate() + '/' + realStartDate.getFullYear();
			// console.log(formatStartDate);
			
			let endHour = parseInt(getEndTime(details.startTime, details.lengthMinutes)/100);
			let realEndDate = new Date(marked.year, monthNo, marked.date);
			if(endHour >= 24)
				realEndDate.setDate(realEndDate.getDate() + 1);
			let formatEndDate = (realEndDate.getMonth()+1) + '/' + realEndDate.getDate() + '/' + realEndDate.getFullYear();
			// console.log(formatEndDate);
			
			textOutput += '"' + details.name + '",'+ // Subject
						'"' + formatStartDate + '",' + // Start date
						'"' + formatTime(details.startTime) + '",' + // Start time
						'"' + formatEndDate + '",' + // End date
						'"' + formatTime(getEndTime(details.startTime, details.lengthMinutes)) + '",' + // End time
						'"false",' + // All Day Event
						'"' + details.channel + ' ' + details.url + ' ' + details.format + '",'+ // Description
						'"true"'; // Private
		}
	}
	
	//create download file
	let downloadLink = document.createElement('a');
	downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(textOutput);
	downloadLink.target = '_blank';
	downloadLink.download = 'events.csv';
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	
	console.log('Export done');
}

function formatTime(time) {
	if(!time) return;
	//input: (int)HHmm
	//output: HH:mm tt
	let time12h = (time < 1200 ? time : time - 1200);
	if(time > 2359)
		time12h = time - 2400;
	return time12h.toString().padStart(4, '0').substring(0,2) + ':' + time12h.toString().padStart(4, '0').substring(2,4) + ' ' + (time < 1200 || time >= 2400 ? 'AM' : 'PM');
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
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// node in dialog will not have events!
	let dialog = document.createElement('dialog');
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object')
	{
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	// dialog.addEventListener('click', function() {
		// this.remove();
	// });
	dialog.addEventListener('keyup', function() {
		if (event.key === 'Enter')
			this.remove();
	});
	return dialog;
}

function removeDialog() {
	if(event) event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv != null)
	{
		dialogDiv.remove();
	}	
}