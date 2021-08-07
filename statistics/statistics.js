//set elements here
let pageElements = [
	{
		title: 'Song Appetite Survey',
		description: 'FROM KLASSIC NOTE SONG AWARDS “SONG APPETITE SURVEY”, OR FROM TOTAL NUMBER OF SONGS IN PREVIOUS MONTHS',
		chartTitle: 'Total Song Count by Year',
		chartLabel: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		chartData: [
			[2009,14,22,34,45,56,75,96,115,121,147,165,175],
			[2010,12,25,40,50,70,80,93,103,122,144,165,180],
			[2011,22,40,56,74,95,104,128,143,164,168,178,190],
			[2012,15,28,35,49,60,70,98,128,160,177,196,203],
			[2013,18,36,57,69,78,99,113,143,157,172,197,205],
			[2014,14,33,55,73,89,113,132,143,162,179,205,220],
			[2015,11,33,42,64,82,96,114,124,137,154,171,180],
			[2016,15,31,63,79,103,114,136,157,171,186,212,240],
			[2017,13,46,74,89,115,133,156,176,188,204,223,233],
			[2018,17,27,44,61,88,106,129,147,160,178,195,205],
			[2019,18,44,70,88,110,129,147,159,185,204,218,240],
			[2020,23,43,56,75,90,100,116,137,161,186,195,205]
		]
	},
	{
		isMain: true,
		prefix: 'Klassic Note Song Awards presents',
		title: 'KLASSIC NOTE: HALL OF FAME',
		suffix: 'JAPANESE CATEGORY',
	},
	{
		title: 'Klassic Note Participants (Songs)',
		description: 'FROM NUMBER OF SONGS IN KLASSIC NOTE FROM CIRCA 2007; ALL CHARTS TO FOLLOW “KLASSIC NOTE”)',
		chartTitle: 'Song Count by Category/Source',
		chartLabel: [2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020],
		chartData: [
			["KLASSIC JAPAN",138,297,474,641,831,1028,1243,1414,1654,1885,2084,2319,2521],
			["KLASSIC J-POP",135,264,409,544,718,899,1104,1273,1511,1733,1923,2152,2351],
			["APPLE MUSIC",null,null,null,null,null,null,null,null,795,1143,1599,2037,2304]
		]
	}
];

function scrollToNextPage() {
	this.parentElement.parentElement.nextElementSibling.scrollIntoView();
}

function scrollToPrevPage() {
	this.parentElement.parentElement.previousElementSibling.scrollIntoView();
}

function scrollToMainPage() {
	document.getElementsByClassName('section')[0].scrollIntoView();
	if(document.getElementById('main') != null)
		document.getElementById('main').scrollIntoView();
}

function renderVariables() {
	// to allow multiple instances of charts based on data, in format 'container<no>'
	var k = 'container';
	for(i = 0; i < pageElements.length; i++) {
		window[k+i] = + i;
	}
}

function renderMain(sectionNo) {
	let content = pageElements[sectionNo];
	if(document.getElementById('main') != null) {
		let main = document.getElementById('main');
		
		if(main.previousElementSibling != null) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			let prevButton = document.createElement('a');
			prevButton.title = 'Previous';
			prevButton.addEventListener('click',scrollToPrevPage);
			let prevButtonIcon = document.createElement('i');
			prevButtonIcon.classList.add('material-icons');
			prevButtonIcon.innerText = 'keyboard_arrow_up';
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		}
		
		let mainPre = document.createElement('h3');
		mainPre.innerText = content.prefix;
		main.appendChild(mainPre);
		
		let mainTitle = document.createElement('h1');
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		let mainPost = document.createElement('h5');
		mainPost.innerText = content.suffix;
		main.appendChild(mainPost);
		
		if(main.nextElementSibling != null) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			let nextButton = document.createElement('a');
			nextButton.title = 'Next';
			nextButton.addEventListener('click',scrollToNextPage);
			let nextButtonIcon = document.createElement('i');
			nextButtonIcon.classList.add('material-icons');
			nextButtonIcon.innerText = 'keyboard_arrow_down';
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		}
	}

}

function renderSection(sectionNo, mainSectionNo) {
	let section = document.getElementsByClassName('section')[sectionNo > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let content = pageElements[sectionNo];
	
	if(section.previousElementSibling != null) {
		let prevDiv = document.createElement('div');
		prevDiv.classList.add('page-prev');
		let prevButton = document.createElement('a');
		prevButton.title = 'Previous';
		prevButton.addEventListener('click',scrollToPrevPage);
		let prevButtonIcon = document.createElement('i');
		prevButtonIcon.classList.add('material-icons');
		prevButtonIcon.innerText = 'keyboard_arrow_up';
		prevButton.appendChild(prevButtonIcon);
		prevDiv.appendChild(prevButton);
		section.appendChild(prevDiv);
	}
			
	if(content.title) {
		let title = document.createElement('h2');
		title.classList.add('page-title');
		title.innerText = content.title;
		section.appendChild(title);
	}
	
	if(content.description) {
		let description = document.createElement('h6');
		description.classList.add('page-description');
		description.innerText = content.description;
		section.appendChild(description);
	}
	
	if(content.chartTitle) {
		let canvas = document.createElement('div');
		canvas.id = 'section' + sectionNo;
		canvas.classList.add('container');
		section.appendChild(canvas);
		
		let chartContents = {
			title: pageElements[sectionNo].chartTitle,
			labels: pageElements[sectionNo].chartLabel,
			datasets: pageElements[sectionNo].chartData.map(row => {
				return {
					label: row[0],
					data: row.slice(1)
				};
			})
		};
		loadTimeline(sectionNo, chartContents);
	}
	else {
		console.warn('chartTitle is empty: ', content);
	}
	
	if(section.nextElementSibling != null) {
		let nextDiv = document.createElement('div');
		nextDiv.classList.add('page-next');
		let nextButton = document.createElement('a');
		nextButton.title = 'Next';
		nextButton.addEventListener('click',scrollToNextPage);
		let nextButtonIcon = document.createElement('i');
		nextButtonIcon.classList.add('material-icons');
		nextButtonIcon.innerText = 'keyboard_arrow_down';
		nextButton.appendChild(nextButtonIcon);
		nextDiv.appendChild(nextButton);
		section.appendChild(nextDiv);
	}
}

function renderPage() {
	let mainSectionNo = 0;
	for(let sectionNo = 0; sectionNo < pageElements.length; sectionNo++) {
		let content = pageElements[sectionNo];
		if(content.isMain) {
			let newMain = document.createElement('div');
			newMain.id = 'main';
			document.getElementsByClassName('page')[0].appendChild(newMain);
			mainSectionNo = sectionNo;
			// renderMain(sectionNo);
		}
		else {
			let newSection = document.createElement('div');
			newSection.classList.add('section');
			document.getElementsByClassName('page')[0].appendChild(newSection);
			console.log(mainSectionNo);
			// renderSection(sectionNo, mainSectionNo);
		}
	}
	
	for(let sectionNo = 0; sectionNo < pageElements.length; sectionNo++) {
		let content = pageElements[sectionNo];
		if(content.isMain) {
			renderMain(sectionNo);
		}
		else {
			renderSection(sectionNo, mainSectionNo);
		}
	}
}

//change below for each chart render
function loadTimeline(sectionNo, chartContents) {
	let timeline = window['container'+sectionNo];
	let identifier = 'section'+sectionNo;
	let charter = 'chart'+sectionNo;
	if(document.getElementById(charter) == undefined) { // canvas
		let canvas = document.createElement('canvas');
		canvas.id = charter;
		canvas.style.border = '1px solid white';
		document.getElementById(identifier).appendChild(canvas); //parent div
	}
	timeline = document.getElementById(charter);
	let config = {
		type: 'line',
		data: chartContents,
		options: {
			responsive: true,
			plugins: {
				legend: {
					position: 'top'
				},
				title: {
					display: true,
					text: chartContents.title,
				},
				tooltip: {
					borderColor: 'rgb(255, 255, 255)',
				}
			},
			scales: {
			}
		}
	};
	
	window['container'+sectionNo] = new Chart(timeline, config);
}

//copied functions to modify and use:
let topButton = document.createElement('a');
topButton.id = 'GoToTopBtn';
topButton.title = 'Back To Top';
let topButtonIcon = document.createElement('i');
topButtonIcon.classList.add('material-icons');
topButtonIcon.innerText = 'arrow_upward';
topButton.appendChild(topButtonIcon);
document.body.appendChild(topButton);
document.getElementById('GoToTopBtn').addEventListener('click', scrollToMainPage);
document.getElementsByClassName('page')[0].addEventListener('scroll', toggleGoToTopBtn);

let closeButton = document.createElement('a');
closeButton.id = 'CloseBtn';
closeButton.title = 'Close Popup';
let closeButtonIcon = document.createElement('i');
closeButtonIcon.classList.add('material-icons');
closeButtonIcon.innerText = 'close';
closeButton.appendChild(closeButtonIcon);
document.body.appendChild(closeButton);
document.getElementById('CloseBtn').addEventListener('click', goBack);

function goBack() {
	window.location.href = '../index.html';
}

function toggleGoToTopBtn() {
	// When the user scrolls down to half of viewport from the top of the document, change floating action button
	if (document.getElementsByClassName('page')[0].scrollTop >= document.body.clientHeight) {
		document.getElementById('GoToTopBtn').style.visibility = 'visible';
	} else {
		document.getElementById('GoToTopBtn').style.visibility = '';
	}
}

// startup
renderVariables();
renderPage();
scrollToMainPage();