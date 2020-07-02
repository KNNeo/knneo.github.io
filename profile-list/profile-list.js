//generate from json file
let spacer = 'https://knneo.github.io/resources/spacer.gif';
var profileList;
let xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
	profileList = JSON.parse(this.responseText);
	//code here
	if(generateProfileListFromJSON(profileList)) startWantedList();
  }
};
xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
xmlhttp.send();
	
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
					image1.alt = profile.images[0];
					profileBoxImg.appendChild(image1);
					
					if(profile.images.length > 1)
					{
						let image2 = document.createElement('img');
						image2.src = spacer;
						image2.alt = profile.images[1];
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
							cell.innerText = profile.name + '(' + profile.nickname + ')';
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
								DOBspan.innerText = profile.dob;
								//DOBspan.innerText = profile.dob + (profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
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
							cell.innerText = profile.turningPointStr.singerDebutStr + "|" + profile.turningPointStr.singerDebutStr + "|" + profile.turningPointStr.singerDebutStr;
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
					profileTable.appendChild(profileTableBody);
				
				profileBox.appendChild(profileTable);
		
			idBox.appendChild(profileBox);
		
		document.getElementById(profile.category).appendChild(idBox);
	}
	
	return true;
}