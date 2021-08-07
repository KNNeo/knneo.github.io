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
		title: 'Song Appetite Survey',
		description: 'FROM KLASSIC NOTE SONG AWARDS “SONG APPETITE SURVEY”, OR FROM TOTAL NUMBER OF SONGS IN PREVIOUS MONTHS',
		chartTitle: 'Total Song Count by Year',
		chartLabel: [
			"2008",
			"2009",
			"2010",
			"2011",
			"2012",
			"2013",
			"2014",
			"2015",
			"2016",
			"2017",
			"2018",
			"2019",
			"2020",
			"2021",
			"Total"
		],
		chartData: [
			["miwa",null,null,null,5,15,23,32,37,44,46,49,51,54,55,null,55  ],
			["Aqua Timez",3,11,19,23,26,32,33,38,43,47,47,50,null,null,null,50  ],
			["Chatmonchy",2,7,15,22,26,37,37,39,43,44,46,49,null,null,null,49  ],
			["YUI",10,22,27,36,45,49,null,null,null,null,null,null,null,null,null,49  ],
			["SCANDAL",null,null,3,9,15,20,29,37,40,43,45,46,48,51,null,51  ],
			["sphere",null,null,5,10,18,25,28,33,39,40,43,43,46,null,null,46  ],
			["Toyosaki Aki",null,null,2,6,13,19,27,33,35,41,44,null,null,null,null,44  ],
			["Tomatsu Haruka",null,null,1,8,10,16,21,23,28,37,38,40,null,null,null,40  ],
			["ASIAN KUNG-FU GENERATION",1,4,6,13,16,21,23,26,29,30,31,39,39,40,null,40  ],
			["Rie fu",3,6,11,11,15,17,21,28,28,33,36,36,38,null,null,38  ],
			["ClariS",null,null,null,2,5,9,14,20,23,26,30,33,null,null,null,33  ],
			["Kotobuki Minako",null,null,null,4,5,13,17,24,28,29,29,32,33,null,null,33  ],
			["Kalafina",null,null,7,10,14,19,24,27,30,30,31,32,null,null,null,32  ],
			["SID",null,1,7,11,15,18,22,25,25,26,28,29,31,null,null,31  ],
			["SPECIAL OTHERS",null,1,4,11,19,25,30,33,37,37,39,43,43,48,null,48  ],
			["Sambomaster",null,3,6,10,13,17,19,21,23,23,26,27,27,28,null,28  ],
			["Hanazawa Kana",null,null,null,null,null,4,8,11,16,19,20,23,26,null,null,26  ],
			["Tsuji Shion",null,null,4,11,13,16,16,16,19,23,23,26,null,null,null,26  ],
			["VELTPUNCH",null,3,4,6,10,17,17,17,19,24,24,24,24,29,null,29  ],
			["fumika",null,null,null,null,1,5,12,14,16,18,22,22,24,null,null,24  ],
			["NEGOTO",null,null,null,null,1,5,7,11,12,14,20,20,23,null,null,23  ],
			["Porno Graffitti",null,2,6,10,12,15,17,17,17,20,22,23,null,null,null,23  ],
			["STEREOPONY",null,3,12,17,20,23,null,null,null,null,null,null,null,null,null,23  ],
			["Taketatsu Ayana",null,null,null,null,null,4,10,14,16,21,21,22,23,null,null,23  ],
			["cinema staff",null,null,null,null,null,null,3,5,8,12,16,16,23,null,null,23  ],
			["nano.RIPE",null,null,null,null,null,null,null,6,11,17,18,22,22,25,null,25  ],
			["yanaginagi",null,null,null,null,null,null,2,14,14,15,17,18,22,25,null,25  ],
			["Lil'B",null,4,11,13,18,18,20,null,null,null,null,null,null,null,null,20  ],
			["Neat's",null,null,null,null,null,null,9,19,19,19,19,19,19,null,null,19  ],
			["TrySail",null,null,null,null,null,null,null,null,4,10,14,17,19,21,null,21  ],
			["Yoru no Honki Dance",null,null,null,null,null,null,null,null,3,9,15,16,19,20,null,20  ],
			["THE ORAL CIGARETTES",null,null,null,null,null,null,null,null,3,5,11,14,17,21,null,21  ],
			["Amamiya Sora",null,null,null,null,null,null,null,2,null,5,8,12,14,18,null,18  ],
			["Komatsu Mikako",null,null,null,null,null,null,1,8,8,11,15,17,17,17,18,18  ]
		]
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
		
		// if(main.previousElementSibling != null) {
			let prevDiv = document.createElement('div');
			prevDiv.classList.add('page-prev');
			let prevButton = document.createElement('a');
			prevButton.title = 'Previous';
			prevButton.style.visibility = main.previousElementSibling != null ? 'visible' : 'hidden';
			prevButton.addEventListener('click',scrollToPrevPage);
			let prevButtonIcon = document.createElement('i');
			prevButtonIcon.classList.add('material-icons');
			prevButtonIcon.innerText = 'keyboard_arrow_up';
			prevButton.appendChild(prevButtonIcon);
			prevDiv.appendChild(prevButton);
			main.appendChild(prevDiv);
		// }
		
		let mainPre = document.createElement('h3');
		mainPre.innerText = content.prefix;
		main.appendChild(mainPre);
		
		let mainTitle = document.createElement('h1');
		mainTitle.innerText = content.title;
		main.appendChild(mainTitle);
		
		let mainPost = document.createElement('h5');
		mainPost.innerText = content.suffix;
		main.appendChild(mainPost);
		
		// if(main.nextElementSibling != null) {
			let nextDiv = document.createElement('div');
			nextDiv.classList.add('page-next');
			let nextButton = document.createElement('a');
			nextButton.title = 'Next';
			nextButton.style.visibility = main.nextElementSibling != null ? 'visible' : 'hidden';
			nextButton.addEventListener('click',scrollToNextPage);
			let nextButtonIcon = document.createElement('i');
			nextButtonIcon.classList.add('material-icons');
			nextButtonIcon.innerText = 'keyboard_arrow_down';
			nextButton.appendChild(nextButtonIcon);
			nextDiv.appendChild(nextButton);
			main.appendChild(nextDiv);
		// }
	}

}

function renderSection(sectionNo, mainSectionNo) {
	let section = document.getElementsByClassName('section')[sectionNo > mainSectionNo ? sectionNo - mainSectionNo : sectionNo];
	let content = pageElements[sectionNo];
	
	// if(section.previousElementSibling != null) {
		let prevDiv = document.createElement('div');
		prevDiv.classList.add('page-prev');
		let prevButton = document.createElement('a');
		prevButton.title = 'Previous';
		prevButton.style.visibility = section.previousElementSibling != null ? 'visible' : 'hidden';
		prevButton.addEventListener('click',scrollToPrevPage);
		let prevButtonIcon = document.createElement('i');
		prevButtonIcon.classList.add('material-icons');
		prevButtonIcon.innerText = 'keyboard_arrow_up';
		prevButton.appendChild(prevButtonIcon);
		prevDiv.appendChild(prevButton);
		section.appendChild(prevDiv);
	// }
			
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
	
	// if(section.nextElementSibling != null) {
		let nextDiv = document.createElement('div');
		nextDiv.classList.add('page-next');
		let nextButton = document.createElement('a');
		nextButton.title = 'Next';
		nextButton.style.visibility = section.nextElementSibling != null ? 'visible' : 'hidden';
		nextButton.addEventListener('click',scrollToNextPage);
		let nextButtonIcon = document.createElement('i');
		nextButtonIcon.classList.add('material-icons');
		nextButtonIcon.innerText = 'keyboard_arrow_down';
		nextButton.appendChild(nextButtonIcon);
		nextDiv.appendChild(nextButton);
		section.appendChild(nextDiv);
	// }
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
			maintainAspectRatio: false,
			aspectRatio: 0.5,
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