//generate from json file
let isExternal = window.location.href.includes('://knneo.github.io');
let spacer = 'https://knneo.github.io/resources/spacer.gif';
let profileList;
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList';
			});
			//code here
			if(profileList != null && generateProfileListFromJSON(profileList)) renderWantedList();
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	console.log('Using test json');
	profileList = profileListJson;
	if(generateProfileListFromJSON(profileList)) renderWantedList();
}

function invertCensor() {
	isExternal = !isExternal;
	//change title
	let title = document.getElementById('title').innerHTML;
	document.getElementById('title').innerHTML = title.includes('<sup>MATOME</sup>') ? title.replace('<sup>MATOME</sup>','') : title + '<sup>MATOME</sup>';
	//re-render profile list
	for(let box of document.getElementsByClassName('profile-category'))
	{
		box.innerHTML = '';
	}
	if(profileListJson.length > 0) {
		generateProfileListFromJSON(profileListJson.filter( function(n) {
				return n.category != 'friendList';
			}));
		profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList';
			});
	}
	else generateProfileListFromJSON(profileList);
	renderWantedList();
}

function generateProfileListFromJSON(profileList) {	
	for(let profile of profileList)
	{
		let idBox = document.createElement('div');
		idBox.id = profile.id;
		
			let profileBox = document.createElement('div');
			profileBox.classList.add('profile-box');
		
				let profileBoxImg = document.createElement('div');
				profileBoxImg.classList.add('profile-box-img');
				profileBoxImg.style.clear = 'both';
				profileBoxImg.style.textAlign = 'center';
				
					let image1 = document.createElement('img');
					image1.src = spacer;
					image1.src = randomProfileImg(profile.images);
					profileBoxImg.appendChild(image1);
					
					if(profile.images.length > 1)
					{
						let image2 = document.createElement('img');
						image2.src = spacer;
						image2.src = profile.images[profile.images.length - 1];
						profileBoxImg.appendChild(image2);
					}
			
				profileBox.appendChild(profileBoxImg);
				
				let profileTable = document.createElement('table');
				
					let profileTableBody = document.createElement('tbody');
					
						let row = document.createElement('tr');
						
							let cell = document.createElement('td');
							cell.innerText = 'Name (Nickname)';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = ' (' + profile.nickname + ')';
							
								let span = document.createElement('span');
								span.classList.add('profile-name');
								span.innerText = profile.name;
								cell.insertBefore(span, cell.childNodes[0]);
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Date Of Birth';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								let DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = profile.dob + (!isExternal && profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
								cell.appendChild(DOBspan);
							
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Profile';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = profile.profile;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.classList.add('tr-caption');
							cell.classList.add('turning-point');
							cell.innerText = 'Status (Singer Debut|Swimsuit Photobook|Married)';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							if(!isExternal) 
								cell.innerText = profile.turningPoint.singerDebut 
										+ "|" + profile.turningPoint.swimsuitPhotobook 
										+ "|" + profile.turningPoint.isMarried;
							else
								cell.innerText = processTurningPoint(profile.turningPoint.singerDebut, false)
										+ "|" + processTurningPoint(profile.turningPoint.swimsuitPhotobook, false) 
										+ "|" + processTurningPoint(profile.turningPoint.isMarried, false);
							
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'How I came to know of her';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = profile.intro;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Why would she be \"wanted\" by me';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = profile.description;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Wanted Level';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = profile.wantedLevel + addBrackets(profile.wantedLevelComment, true);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
					profileTable.appendChild(profileTableBody);
				
				profileBox.appendChild(profileTable);
				
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = addBrackets(profile.comments.join(')<br/>('),false);
				if(commentBox.innerHTML.includes('1976.09.20'))
					commentBox.innerHTML = commentBox.innerHTML.replace('1976.09.20', '<span id=\'HocchanAge\' class=\'DOB\'>1976.09.20</span>');
				
				profileBox.appendChild(commentBox);
		
			idBox.appendChild(profileBox);
		
		document.getElementById(profile.category).appendChild(idBox);
	}
	
	return true;
}

function getWantedLevelComment(profile) { return console.log(profile.name + '\n' + profile.wantedLevel + '\n' + profile.wantedLevelComment); }
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function processTurningPoint(option, returnBool) {
	if(returnBool)
		return option.includes('Yes') ? true : false;
	return option.split('*').join('');
}function randomProfileImg(images) {
	return images[Math.floor(Math.random()*(images.length-1))];
}