function generateMiniCalendar(elem, year, month, list, headerFunction, showLegend = false) {
	// TODO: allow start from monday
	// generate calendar array
	let calendarArray = generateCalendarArray(year, month);
	// console.log(calendarArray);
	// generate calendar HTML
	let table = generateMiniCalendarTable(year, month, calendarArray);	
	elem.innerHTML = table;	
	// change variable to match current calendar
	config.calendar.year = year;
	config.calendar.month = month;
	// add marked items on expanded calendar
	addEventsToMiniCalendar(year, table, list || []);
	// to allow custom select month
	elem.querySelector('.header').addEventListener('click', showCalendarMonths);
	// show categories
	if(showLegend) addCalendarLegend();
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

function generateMiniCalendarTable(year, month, array) {
	// render table
	let htmlString = '<table class="box"><tbody><tr><th>' + 
	'<i class="inverted prev-month bi bi-arrow-left"></i>' + 
	'</th><th colspan="5"><span class="header">' + 
	config.calendar.months[month] + ' ' + year + 
	'</span></th><th>' + 
	'<i class="inverted next-month bi bi-arrow-right"></i>' + 
	'</th></tr><tr>' + 
	config.calendar.daysOfWeek.map(w => '<td>' + w + '</td>').join('') + '</tr>';
	
	for (let week = 0; week < 6; week++) {
		htmlString += '<tr>';
		let weekDays = array[week];
		for (let day = 0; day < 7; day++) {
			htmlString += '<td>' + weekDays[day] + '</td>';
		}
		htmlString += '</tr>';
	}
	htmlString += '</tbody></table>';
	return htmlString;
}

function addEventsToMiniCalendar(year, htmlString, DOBlist) {
	// replace cells in table with relevant dates
	for (let item of DOBlist) {
		// calculate if birthday this year has passed
		let currentYear = new Date().getFullYear();
		let birthdayInYear = new Date(year, new Date(item.date.replace('????', year)).getMonth(), new Date(item.date.replace('????', year)).getDate());
		
		let thisAge;
		// update age is passed current date
		if (item.currentAge <= 1) thisAge = '??';
		else if ((year + item.date.substring(4)).isAfterToday()) thisAge = item.currentAge;
		else thisAge = item.currentAge + (year - currentYear + 1);
		// console.log(item.category + '|' + item.name + '|' + item.currentAge);
		if (config.calendar.category == null) continue;
		
		// replace html based on age on calendar year
		let dateCell = '<td>' + birthdayInYear.getDate() + '</td>';
		let monthId = config.calendar.months[birthdayInYear.getMonth()];
		let message = '<b onclick="generateProfileFromJSON(this)" class="calendar-name color" data-id="' + item.category + '">' + item.name + '</b> turns ' + thisAge + '</b> (' + birthdayInYear.getDate() + ' ' + monthId.substring(0, 3) + ')';
		if (thisAge == '??')
			message = 'Happy Birthday <b onclick="generateProfileFromJSON(this)" class="calendar-name color" data-id="' + item.category + '">' + item.name + '</b>!!';
		
		if (thisAge == '??' && htmlString.indexOf(monthId) > -1 && htmlString.indexOf(dateCell) > -1 && item.name != 'Me') //no age
			htmlString = htmlString.replace(dateCell, 
			'<td onclick="popupContent(this.querySelector(\'.calendar-popitem\'))" class="bg" data-id="' + item.category + '"><div class="calendar-popitem">' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (htmlString.indexOf(monthId) > -1 && htmlString.indexOf(dateCell) > -1 && item.name != "Me") //with age
			htmlString = htmlString.replace(dateCell, 
			'<td onclick="popupContent(this.querySelector(\'.calendar-popitem\'))" class="bg" data-id="' + item.category + '"><div class="calendar-popitem">' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (thisAge == '??' && htmlString.indexOf(monthId) > -1) //append DOB, no age
			htmlString = htmlString.replace('</div>' + birthdayInYear.getDate() + '</td>', 
			'<br>' + message + '</div>' + birthdayInYear.getDate() + '</td>');
		else if (htmlString.indexOf(monthId) > -1) //append DOB, with age
			htmlString = htmlString.replace('</div>' + birthdayInYear.getDate() + '</td>', 
			'<br>' + message + '</div>' + birthdayInYear.getDate() + '</td>');
	}
	
	document.querySelector('.calendar').innerHTML = htmlString;

	// copy popup content to title
	for(let cell of document.querySelectorAll('.calendar td')) {
		let popup = cell.querySelector('.calendar-popitem')?.innerHTML;
		if(popup) {
			let elem = document.createElement('div');
			elem.innerHTML = popup.replace('<br>','\n');
			cell.title = elem.innerText || '';
		}
	}
	
	// add today, stackable to day with events
	let today = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone});
	for(let date of document.querySelectorAll('.calendar td')) {
		if(today.year == year && 1+config.calendar.month == today.month && date.innerText.endsWith(today.day.toString()))
			today = date;
	}
	if(today.classList)
		today.classList.add('today');
	
	// events for month buttons using global variables for navigation
	document.querySelector('.prev-month').addEventListener('click', function() {
		let toPrevYear = --config.calendar.month < 0;
		let prevMonth = toPrevYear ? 11 : config.calendar.month;
		let prevYear = toPrevYear ? --config.calendar.year : config.calendar.year;
		generateMiniCalendar(calendarDiv, prevYear, prevMonth, config.list.calendar);
	});
	document.querySelector('.next-month').addEventListener('click', function() {
		let toNextYear = ++config.calendar.month > 11;
		let nextMonth = toNextYear ? 0 : config.calendar.month;
		let nextYear = toNextYear ? ++config.calendar.year : config.calendar.year;
		generateMiniCalendar(calendarDiv, nextYear, nextMonth, config.list.calendar);
	});
}

function addCalendarLegend() {
	if(document.querySelector('.calendar-legend') == null) return;
	let categories = config.calendar.category.reverse() ?? config.list.calendar.filter((val, index, arr) => arr.map(a => a.category).indexOf(val.category) === index).map(p => p.category);
	// console.log(categories);
	let calendarLegend = document.querySelector('.calendar-legend');
	if(calendarLegend.childElementCount > 1)
		calendarLegend.innerHTML = '';
	// add checkbox toggle
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
			box.classList.add('calendar-legend-box');
			box.classList.add('bg');
			box.setAttribute('data-id', category);
			box.addEventListener('click', function() {
				this.classList.toggle('disabled');	
				setTimeout(function() {
					filterCalendarList();
					generateMiniCalendar(
						calendarDiv,
						luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone}).year,
						config.calendar.month, 
						config.list.calendar
					);
				}, 10);
			});
			label.appendChild(box);
					
			let description = document.createElement('span');
			description.style.padding = '0 5px';
			description.title = category;
			description.addEventListener('click', function() {
				this.previousElementSibling.classList.toggle('disabled');			
				setTimeout(function() {
					filterCalendarList();
					generateMiniCalendar(
						calendarDiv,
						config.calendar.year,
						config.calendar.month, 
						config.list.calendar
					);
				}, 10);
			});
			description.innerText = category;
			label.appendChild(description);
		
		calendarLegend.insertBefore(label, calendarLegend.childNodes[0]); // before export button
	}
	// add css styles
	let lightStyleTemplate = ' .bg[data-id="{name}"] { background-color: {value}; color: white; } .bg:hover { background-color: var(--foreground); color: var(--background); }';
    let darkStyleTemplate = ' .darked .bg[data-id="{name}"] { background-color: {value}; color: black; } .darked .bg:hover { background-color: var(--foreground); color: var(--background); }';
	config.calendar.category.reverse(); // flip back
	for(let c = 0; c < categories.length; c++) {
		let categoryIndex = config.calendar.category.indexOf(categories[c]);
		let styleSheet = document.createElement('style');
        // light theme
		styleSheet.innerText = lightStyleTemplate.replace(/{name}/g, config.calendar.category[categoryIndex]).replace(/{value}/g, (config.calendar.categoryLightColor || config.calendar.categoryColor)[categoryIndex]);
		document.head.appendChild(styleSheet);
        
        // dark theme
        if(config.calendar.categoryDarkColor) {
            styleSheet = styleSheet.cloneNode(true);
            styleSheet.innerText = darkStyleTemplate.replace(/{name}/g, config.calendar.category[categoryIndex]).replace(/{value}/g, config.calendar.categoryDarkColor[categoryIndex]);
            document.head.appendChild(styleSheet);
        }
	}
}

function filterCalendarList() {
	let checkedCategories = Array
		.from(document.querySelectorAll('.calendar-legend input'))
		.filter(i => i.checked == true)
		.map(i => i.name);
	let calendarList = config.data.filter(n => !(n.inactive === true) && config.calendar.include(n));
	config.list.calendar = createDOBlist(calendarList, 0, 50).filter(c => c.name != 'Me' && (checkedCategories.indexOf(c.category) >= 0));
}

function exportCalendar() {
	if(confirm('Confirm export calendar? It will be exported to Google Calendar-formatted CSV.')) {
		let textOutput = '"Subject","Start date","All Day Event","Description","Private"';
		let nowYear = luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: config.timezone}).year;
		for(let profile of config.list.calendar) {
			textOutput += '\n';
			let formatDate = profile.date.substring(5,7) + '/' + profile.date.substring(8,10) + '/' + nowYear;
			
			//follow wanted-list-v2.js
			let birthdayInYear = new Date(new Date().getFullYear(), new Date(profile.date.replace('????', nowYear)).getMonth(), new Date(profile.date.replace('????', nowYear)).getDate());
			let DOB = nowYear + profile.date.substring(4);
			let IsBirthdayOver = DOB.isAfterToday();
			
			// title, MM/dd/yyyy, true, description, true
			let line = '"'+profile.name+'\'s Birthday'+(profile.date.includes('?') ? '' : ' ('+(IsBirthdayOver ? profile.date.getAge() : profile.date.getAge()+1)+')')+'","'+formatDate+'","true","'+(profile.date.includes('?') ? '' : ('Born ' + profile.date))+'","true"';
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
	}
}
