//generate from json file
const useTestJson = false; //false: from actual json, true: from profile-list-json.js
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let isExternal = window.location.href.includes('://knneo.github.io');
let profileList;
let friendList = [];
if(!useTestJson) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileList = JSON.parse(this.responseText);
			//code here
			//if(profileList != null && generateProfileListFromJSON(profileList)) renderWantedList();
			if(profileList != null) initialiseWantedList();
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	if(profileListJson != null) {
		profileList = profileListJson;
		initialiseWantedList();
	}
}

function friendCheck() {
	console.log('Friend check!');
	for(let profile of profileList)
	{
		if(profile.friends == undefined) continue;
		for(let friend of profile.friends)
		{
			friendList.push({
				friend1: friend.id,
				friend2: profile.id
			});
		}
	}
	
	for(let pair of friendList)
	{
		let pairs = friendList.filter( function(n) {
			return n.friend1 == pair.friend2 && pair.friend1 == n.friend2;
		});
		
		if(pairs.length == 0)
			console.log(pair.friend2 + ' missing in ' + pair.friend1);
	}
	
	console.log('Done.');
}

function generateProfileFromJSON(profileName) {
	let friendMode = false;
	let profile = profileList.filter( function(n) {
        return n.id == profileName;
    })[0];
	let currentProfile;
	
	if(profile == null || profile.length == 0) return;
	
	if(document.getElementById('profile').childElementCount > 0)
	{
		let currentProfileName = document.getElementById('profile').getElementsByTagName('div')[0].id;
		currentProfile = profileList.filter( function(n) {
			return n.id == currentProfileName;
		})[0];
		
		let friendFound = friendList.filter( function(n) {
			return n.friend1 == currentProfile.id && n.friend2 == profile.id;
		}).length > 0;
		
		//if(friendFound)
		//	console.log('Friend found! ' + currentProfile.name + ' x ' + profile.name);
		
		//update based on friend found, desktop only for now
		friendMode = friendFound && window.innerWidth > 480;
		//IN FRIEND MODE: left is profile, right is currentProfile
	}
	
	document.getElementById('profile').innerHTML = '';
	
	//console.log(profile);
	
	let idBox = document.createElement('div');
	idBox.id = profile.name.replace(' ','');
	idBox.style.padding = '20px 0';
	
		let profileBox = document.createElement('div');
		profileBox.classList.add('profile-box');
	
			let profileBoxImg = document.createElement('div');
			profileBoxImg.classList.add('profile-box-img');
			profileBoxImg.style.clear = 'both';
			profileBoxImg.style.textAlign = 'center';
			
				//pre processing for friend image to flip profiles order
				let friendImage = '';
				if(friendMode)
				{
					let friend = currentProfile.friends.find( function(p) {
						return p.id == profile.id
					});
					
					friendImage = friend.image;
					
					if(friend.imageId !== (profile.id + '-' + currentProfile.id))
					{
						let tempProfile = currentProfile;
						currentProfile = profile;
						profile = tempProfile;
					}
				}
					
				let image1 = document.createElement('img');
				image1.src = spacer;
				image1.src = friendMode ? friendImage : profile.images[0];
				profileBoxImg.appendChild(image1);
				
				if(profile.images.length > 1 && !friendMode)
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
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Name (Nickname)';
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						let cellDiv = document.createElement('div');
						if(friendMode) cellDiv.style.textAlign = 'left';
						if(friendMode) cellDiv.style.position = 'absolute';
						cellDiv.innerText = ' (' + profile.nickname + ')';
						
							let span = document.createElement('span');
							span.classList.add('profile-name');
							span.innerText = profile.name;
							cellDiv.insertBefore(span, cellDiv.childNodes[0]);
							
						cell.appendChild(cellDiv);
						row.appendChild(cell);
						
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							cellDiv.innerText = ' (' + currentProfile.nickname + ')';
							
								span = document.createElement('span');
								span.classList.add('profile-name');
								span.innerText = currentProfile.name;
								cellDiv.insertBefore(span, cellDiv.childNodes[0]);
								
							cell.appendChild(cellDiv);
						}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
						
						cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Date Of Birth';
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						
							cellDiv = document.createElement('div');
							if(friendMode) cellDiv.style.textAlign = 'left';
							if(friendMode) cellDiv.style.position = 'absolute';
							
								let DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = profile.dob + (!isExternal && profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							if(friendMode)
							{
								cellDiv = document.createElement('div');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = currentProfile.dob + (!isExternal && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
								cell.appendChild(cellDiv);
							}
						
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
				
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Profile';
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						
							cellDiv = document.createElement('div');
							if(friendMode) cellDiv.style.textAlign = 'left';
							if(friendMode) cellDiv.style.position = 'absolute';
							cellDiv.innerText = profile.profile;
							cell.appendChild(cellDiv);
							
							if(friendMode)
							{
								cellDiv = document.createElement('div');
								cellDiv.innerText = profile.profile;
								cell.appendChild(cellDiv);
							}
							
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						cell.classList.add('tr-caption');
						cell.classList.add('turning-point');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Status (Singer Debut|Swimsuit Photobook|Married)';
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
				
					row = document.createElement('tr');
						
						cell = document.createElement('td');
							
							cellDiv = document.createElement('div');
							if(friendMode) cellDiv.style.textAlign = 'left';
							if(friendMode) cellDiv.style.position = 'absolute';
								if(!isExternal && !friendMode) 
									cellDiv.innerText = profile.turningPointStr.singerDebutStr + "|" + profile.turningPointStr.swimsuitPhotobookStr + "|" + profile.turningPointStr.isMarriedStr;
								else
									cellDiv.innerText = removeAsterisks(profile.turningPointStr.singerDebutStr)+ "|" + removeAsterisks(profile.turningPointStr.swimsuitPhotobookStr) + "|" + removeAsterisks(profile.turningPointStr.isMarriedStr);
								
						cell.appendChild(cellDiv);
									
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							
							if(!isExternal && !friendMode) 
								cellDiv.innerText = currentProfile.turningPointStr.singerDebutStr + "|" + currentProfile.turningPointStr.swimsuitPhotobookStr + "|" + currentProfile.turningPointStr.isMarriedStr;
							else
								cellDiv.innerText = removeAsterisks(currentProfile.turningPointStr.singerDebutStr)+ "|" + removeAsterisks(currentProfile.turningPointStr.swimsuitPhotobookStr) + "|" + removeAsterisks(currentProfile.turningPointStr.isMarriedStr);
								
							cell.appendChild(cellDiv);
						}
					
						row.appendChild(cell);
						
					profileTableBody.appendChild(row);
					
					if(!friendMode)
					{
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
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			if(!friendMode)
			{
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = addBrackets(profile.comments.join(')<br/>('),false);
				if(commentBox.innerHTML.includes('1976.09.20'))
					commentBox.innerHTML = commentBox.innerHTML.replace('1976.09.20', '<span id=\'HocchanAge\' class=\'DOB\'>1976.09.20</span>');
				
				profileBox.appendChild(commentBox);
			}
	
		idBox.appendChild(profileBox);
	
	document.getElementById('profile').appendChild(idBox);
	
	return true;
}

function getWantedLevelComment(profile) { return console.log(profile.name + '\n' + profile.wantedLevel + '\n' + profile.wantedLevelComment); }
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function isYesNo(option) { return option ? 'Yes' : 'No'; }
function removeAsterisks(option) {
	while(option.includes('*')){
		option = option.replace('*','');
	}
	return option;
}