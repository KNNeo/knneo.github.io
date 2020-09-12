//generate from json file
let isExternal = window.location.href.includes('://knneo.github.io');
let spacer = 'https://knneo.github.io/resources/spacer.gif';
let profileList;
let useTestJson = false; //take from actual json, else from profile-list-json.js
if(!useTestJson) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileList = JSON.parse(this.responseText);
			//code here
			if(profileList != null && generateProfileListFromJSON(profileList)) renderWantedList();
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	if(profileListJson != null && generateProfileListFromJSON(profileListJson)) {
		profileList = profileListJson;
		renderWantedList();
	}
}

function generateProfileListFromJSON(profileList) {	
	for(let profile of profileList)
	{
		let idBox = document.createElement('div');
		idBox.id = profile.name.replace(' ','');
		
			let profileBox = document.createElement('div');
			profileBox.classList.add('profile-box');
		
				let profileBoxImg = document.createElement('div');
				profileBoxImg.classList.add('profile-box-img');
				profileBoxImg.style.clear = 'both';
				profileBoxImg.style.textAlign = 'center';
				
					let image1 = document.createElement('img');
					image1.src = spacer;
					image1.src = profile.images[0];
					profileBoxImg.appendChild(image1);
					
					if(profile.images.length > 1)
					{
						let image2 = document.createElement('img');
						image2.src = spacer;
						image2.src = profile.images[1];
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
								cell.innerText = profile.turningPointStr.singerDebutStr + "|" + profile.turningPointStr.swimsuitPhotobookStr + "|" + profile.turningPointStr.isMarriedStr;
							else
								cell.innerText = isYesNo(profile.turningPoint.singerDebut)+ "|" + isYesNo(profile.turningPoint.swimsuitPhotobook) + "|" + isYesNo(profile.turningPoint.isMarried);
							
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
function isYesNo(option) { return option ? "Yes" : "No"; }