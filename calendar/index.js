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
		startDayNo: 4,
		startTime: 2130,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
		channel: 'ニコニコ動画',
		url: 'http://harukas.secondshot.jp/',
		format: 'Audio Live',
	},
	{
		name: '寿美菜子のラフラフ',
		startDayNo: 4,
		startTime: 2130,
		lengthMinutes: 30,
		recurringWeeks: [1,2,3,4,5],
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
		startTime: 1900,
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
window.addEventListener('load', startup);

//--FUNCTIONS--//
function startup() {
	generateCalendar(new Date().getFullYear(), new Date().getMonth());
}

function generateCalendar(year, month, list) {
	// add class or id to each cell, easier to add content
	// use table tag, don't use css grid
	console.log(year, month);
	
	let calendar = document.createElement('div');
	
	//TODO: allow start from monday
	// generate calendar array
	let calendarArray = generateCalendarArray(year, month);
	console.log(calendarArray);
	
	// generate calendar HTML
	let table = generateCalendarTable(year, month, calendarArray);	
	calendar.appendChild(table);
	
	document.querySelector('.list').innerHTML = '';
	document.querySelector('.list').appendChild(calendar);
	
	// populate with summary, on expanded calendar
	addSummaryEventsToCalendar();
	
	// show events, per day, can include upcoming
	let events = document.createElement('div');
	events.classList.add('events');
	
}

function generateCalendarArray(year, month) {
	let calendarArray = new Array();
	let dayOfMonth = 1;
	for (let week = 0; week < 6; week++) {
		let emptyDays = ['', '', '', '', '', '', ''];
		for (let day = 0; day < 7; day++) {
			if (new Date(year, month, dayOfMonth).getDay() == day) {
				if (dayOfMonth > new Date(year, month+1, 0).getDate()) break;
				emptyDays[day] = dayOfMonth++;
			}
		}
		calendarArray.push(emptyDays);
	}
	return calendarArray;
}

function generateCalendarTable(year, month, array) {
	let table = document.createElement('div');
	
	let body = document.createElement('div');
	body.classList.add('calendar');
	body.classList.add('expanded');
	window['year'] = year;
	window['month'] = month;
	
	let row = document.createElement('div');
	row.classList.add('header');
	row.style.display = 'contents';
	
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
		console.log(window['year'], window['month']-1);
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
	prev.title = 'Next Month';
	next.addEventListener('click', function() {
		if(window['month'] + 1 > 11) {
			generateCalendar(window['year'] + 1, 0);
			return;
		}
		console.log(window['year'], window['month']+1);
		generateCalendar(window['year'], window['month']+1);
	});
	row.appendChild(next);
	
	body.appendChild(row);
	
	row = document.createElement('div');
	row.classList.add('header');
	row.style.display = 'contents';
	
	for(let day of daysOfWeek)
	{
		let dayDiv = document.createElement('div');
		dayDiv.innerText = day;
		row.appendChild(dayDiv);
	}
	
	body.appendChild(row);
	
	for (let week = 0; week < 6; week++) {
		let rowHeader = document.createElement('div');
		rowHeader.style.display = 'contents';
		
		row = document.createElement('div');
		row.style.display = 'contents';
		for (let day = 0; day < 7; day++) {
			let cellHeader = document.createElement('div');
			cellHeader.innerHTML = '<div class="number">' + array[week][day] + '</div>';
			rowHeader.appendChild(cellHeader);
			
			let cell = document.createElement('div');
			if(array[week][day] > 0) {
				cell.classList.add('day');
				cell.classList.add('cell');
				cell.setAttribute('data-id', array[week][day]);		// day of month
				cell.setAttribute('data-day', day == 0 ? 7 : day);	// day of week (0 is sunday)
				cell.setAttribute('data-month', monthsOfYear[month]);	// month
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

function addSummaryEventsToCalendar() {
	for(let single of data)
	{
		if(single.recurringWeeks)
		{
			let dates = document.querySelectorAll('div[data-day="' + single.startDayNo + '"]');			
			for(let weekNo of single.recurringWeeks)
			{
				let date = dates[weekNo-1];
				if(date)
				{
					let content = document.createElement('div');
					content.classList.add('content');
					content.tabIndex = '-1';
					content.innerText = single.name;
					content.title = single.name + '\n' + 
					single.format + '\n' + 
					single.channel + '\n' +
					daysOfWeek[single.startDayNo == 7 ? 0 : single.startDayNo] + ', ' + 
					date.getAttribute('data-month') + ' ' + date.getAttribute('data-id') + ', ' + 
					single.startTime + '-' + getEndTime(single.startTime, single.lengthMinutes) + '\n' +
					single.url;
					content.addEventListener('click', function() {
						document.querySelector('.footer').innerHTML = convertTextToHTML(this.title, [single.url]);
					});
					date.appendChild(content);
				}
			}
			
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

function addDetailEventsList(day) {	
}
