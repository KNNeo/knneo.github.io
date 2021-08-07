//new functions to do:
let pageElements = [
	{
		title: 'Song Appetite Survey',
		description: 'FROM KLASSIC NOTE SONG AWARDS “SONG APPETITE SURVEY”, OR FROM TOTAL NUMBER OF SONGS IN PREVIOUS MONTHS',
		chartTitle: 'Total Song Count by Year',
		chartData: [
			['2009',14,22,34,45,56,75,96,115,121,147,165,175],
			['2010',12,25,40,50,70,80,93,103,122,144,165,180],
			['2011',22,40,56,74,95,104,128,143,164,168,178,190],
			['2012',15,28,35,49,60,70,98,128,160,177,196,203],
			['2013',18,36,57,69,78,99,113,143,157,172,197,205],
			['2014',14,33,55,73,89,113,132,143,162,179,205,220],
			['2015',11,33,42,64,82,96,114,124,137,154,171,180],
			['2016',15,31,63,79,103,114,136,157,171,186,212,240],
			['2017',13,46,74,89,115,133,156,176,188,204,223,233],
			['2018',17,27,44,61,88,106,129,147,160,178,195,205],
			['2019',18,44,70,88,110,129,147,159,185,204,218,240],
			['2020',23,43,56,75,90,100,116,137,161,186,195,205]
		]
	},
	{}
];

let chartContents = {
	title: pageElements[0].chartTitle,
	labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	datasets: pageElements[0].chartData.map(row => {
		return {
			label: row[0],
			data: row.slice(1)
		};
	})
};

function scrollToNextPage() {
	
}

function scrollToPrevPage() {
	
}

function scrollToMainPage() {
	document.getElementById('main').scrollIntoView(true);
}

function renderPage() {
	//h2 or h3 for title, h5/h6 for description, use chart.js for chart
	//use .page-element to put border over chart
	//chart property of each page will be updated using chart.js json format
	//check if chart.js can support multiple charts per page, else find new library
	
	for(let sectionNo = 0; sectionNo < pageElements.length; sectionNo++) {
		let section = document.getElementsByClassName('section')[sectionNo];
		let content = pageElements[sectionNo];
				
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
		}
		else {
			console.warn('chartTitle is empty: ', content);
		}
	}
}

//change below for each chart render
let timelineChart;
renderPage();
loadTimeline();
function loadTimeline() {
	let timeline = timelineChart;
	let identifier = 'section0';
	if(document.getElementById('chart') == undefined) { // canvas
		let canvas = document.createElement('canvas');
		canvas.id = 'chart';
		canvas.style.border = '1px solid white';
		document.getElementById(identifier).appendChild(canvas); //parent div
	}
	timeline = document.getElementById('chart');
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
	
	timelineChart = new Chart(timeline, config);
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