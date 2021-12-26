//--DEFAULT SETTINGS--//


//--VARIABLES--//
let startTime;
let endTime;
let timer;


//--COMMON EVENTS--//
//on startup
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;
//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let smallScreen = window.innerWidth <= 640;
let list = [];
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		list = JSON.parse(this.responseText);
		//code here
		if(list != null) renderList();
		
	}
};
xmlhttp.open("GET", "https://knneo.github.io/video-list/list.json", true);
xmlhttp.send();


//--FUNCTIONS--//
function renderList() {
	let videoList = document.getElementById('list');
		
	for(let v of videoList)
	{
		let video = document.createElement('div');
		video.classList.add('shadowed');
		video.id = v.id;
		
			let thumbnail = document.createElement('div');
			thumbnail.style.backgroundSize = 'contain';
			thumbnail.style.backgroundRepeat = 'no-repeat';
			thumbnail.style.backgroundPosition = 'center';
			thumbnail.style.backgroundImage = addUrlClause(v.thumbnail);
			
			let title = document.createElement('div');
			
				let titleLink = document.createElement('a');
				titleLink.href = v.link;
				titleLink.innerText = v.title;			
				titleLink.setAttribute('target','_blank');
			
				title.appendChild(titleLink);
				
			video.appendChild(title);
			
			let channel = document.createElement('div');
			channel.innerText = v.channel;
			
			video.appendChild(channel);
		
		videoList.appendChild(video);
		
	}
}
function addUrlClause(url) {
	return "url('" + url + "')";
}
