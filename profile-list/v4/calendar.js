function generateMiniCalendar(year, month, list = [], showLegend = false) {
	// add class or id to each cell, easier to add content
	// use table tag, don't use css grid
	// console.log(year, month);
	
	let calendar = document.createElement('div');
	
	//TODO: allow start from monday
	// generate calendar array
	let calendarArray = generateCalendarArray(year, month);
	// console.log(calendarArray);
	
	// generate calendar HTML
	let table = generateMiniCalendarTable(year, month, calendarArray);	
	// calendar.appendChild(table);
	
	document.querySelector('.calendar').innerHTML = table;
	// document.querySelector('.calendar').appendChild(calendar);
	
	// add marked items on expanded calendar
	window['currentMonth'] = month;
	addEventsToMiniCalendar(table, list);
	
	if(showLegend)
		addCalendarLegend();
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
	let htmlString = '<table><tbody><tr><td>' + 
	(month+1 > 1 ? '<i class="prev-month bi bi-arrow-left"></i>' : '') + 
	'</td><td colspan="5">' + 
	months[month] + ' ' + new Date().getFullYear() + 
	'</td><td>'	+ 
	(month+1 < 12 ? '<i class="next-month bi bi-arrow-right"></i>' : '') + 
	'</td></tr><tr>' + daysOfWeek.map(w => '<td>' + w + '</td>').join('') + '</tr>';
	
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

function addEventsToMiniCalendar(htmlString, DOBlist) {
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
		let monthId = months[birthdayInYear.getMonth()];
		let message = '<b onclick="generateProfileFromJSON(this)" class="calendar-name color-' + item.category + '">' + item.name + '</b> turns ' + thisAge + '</b> (' + birthdayInYear.getDate() + ' ' + monthId.substring(0, 3) + ')';
		if (thisAge == '??')
			message = 'Happy Birthday <b onclick="generateProfileFromJSON(this)" class="calendar-name color-' + item.category + '">' + item.name + '</b>!!';
		
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
	// window['currentMonth'] = monthNo;
	if (window['currentMonth'] > 0) document.querySelector('.prev-month').addEventListener('click', function() {
		generateMiniCalendar(
			luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year,
			--window['currentMonth'], 
			window['calendarDOBlist']
		);
	});
	if (window['currentMonth'] < 11) document.querySelector('.next-month').addEventListener('click', function() {
		generateMiniCalendar(
			luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year,
			++window['currentMonth'], 
			window['calendarDOBlist']
		);
	});
	
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
					filterCalendarList();
					generateMiniCalendar(
						luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year,
						window['currentMonth'], 
						window['calendarDOBlist']
					);
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
					filterCalendarList();
					generateMiniCalendar(
						luxon.DateTime.fromISO(luxon.DateTime.now(), {zone: timezone}).year,
						window['currentMonth'], 
						window['calendarDOBlist']
					);
				}, 10);
			});
			description.innerText = category.substring(0,1).toUpperCase() + category.substring(1);
			label.appendChild(description);
		
		calendarLegend.appendChild(label);
	}
}

function filterCalendarList() {
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
	// document.getElementById('exportBtn').setAttribute('disabled','');
}
