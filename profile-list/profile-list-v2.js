//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let isExternal = window.location.href.includes('://knneo.github.io');
let smallScreen = window.innerWidth <= 640;
let friendList = [];
let profileList;
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList';
			});
			friendList = profileListJson.filter( function(n) {
				return n.category == 'friendList';
			});
			//code here
			//if(profileList != null && generateProfileListFromJSON(profileList)) renderProfileBox();
			if(profileList != null) initialiseWantedList();
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	console.log('Using test json');
	profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList';
			});
	friendList = profileListJson.filter( function(n) {
		return n.category == 'friendList';
	});
	initialiseWantedList();
}

function friendCheck() {
	console.log('Friend check!');
	
	if(friendList.length == 1 && friendList[0].friends.length > 0)
	{
		
		/* for(let profile of profileList)
		{
			if(profile.friends == undefined) continue;
			for(let friend of profile.friends)
			{
				friendList.push({
					friend1: friend.id,
					friend2: profile.id
				});
			}
		} */
		
		friendList[0].friends.sort( function(a,b) {
			return a.id.localeCompare(b.id)
		});
		
		/* for(let pair of friendList)
		{
			let pairs = friendList.filter( function(n) {
				return n.friend1 == pair.friend2 && pair.friend1 == n.friend2;
			});
			
			if(pairs.length == 0)
				console.log(pair.friend2 + ' missing in ' + pair.friend1);
		} */
		
		//check duplicate ids
		for(let pair of friendList[0].friends)
		{
			let result = friendList[0].friends.filter( function(f) {
				return f.id == pair.id;
			});
			if(result != undefined && result.length > 1)
				console.log(pair.id + " has exact duplicates");
		}
		
		//check ids but of different positions
		for(let pair of friendList[0].friends)
		{
			let splits = pair.id.split('-');
			let result = friendList[0].friends.filter( function(f) {
				return f.id == (splits[1] + '-' + splits[0]);
			});
			if(result != undefined && result.length > 0)
				console.log(pair.id + " has duplicates of different positions");
		}
	}
	
	console.log('Done.');
}

function generateProfileFromJSON(profileName) {
	let friendMode = false;
	//the profile selected
	let profile = profileList.filter( function(n) {
        return n.id == profileName;
    })[0];
	//previous profile
	let currentProfile = null;
	
	if(profile == null || profile.length == 0) return;
	
	if(document.getElementById('profile').childElementCount > 0)
	{
		let currentProfileName = document.getElementById('profile').getElementsByTagName('div')[0].id;
		currentProfile = profileList.filter( function(n) {
			return n.id == currentProfileName;
		})[0];
		
		
		let friendFound = friendList[0].friends.find( function(p) {
					return p.id == currentProfile.id + "-" + profile.id ||
					p.id == profile.id + "-" + currentProfile.id;
		}) != undefined;
		
		//if(friendFound)
		//	console.log('Friend found! ' + currentProfile.name + ' x ' + profile.name);
		
		//update based on friend found, desktop only for now
		friendMode = friendFound && window.innerWidth > 360;
		//IN FRIEND MODE: left is profile, right is currentProfile
	}
	
	if(document.getElementById('profile').classList.contains('friend-mode'))
		friendMode = false;
		
	document.getElementById('profile').innerHTML = '';
	
	//if in friend mode and has friend in next friend call, show single mode first
	//if(friendMode) document.getElementById('profile').classList.add('friend-mode');
	//else if(document.getElementById('profile').classList.contains('friend-mode'))
	//	document.getElementById('profile').classList.remove('friend-mode');
	
	//console.log(profile);
	
	let idBox = document.createElement('div');
	idBox.id = profile.id;
	//idBox.style.padding = '20px 0';
	idBox.style.width = '90%';
	idBox.style.margin = 'auto';
	
		let profileBox = document.createElement('div');
		profileBox.classList.add('profile-box');
	
			let profileBoxImg = document.createElement('div');
			profileBoxImg.classList.add('profile-box-img');
			profileBoxImg.style.clear = 'both';
			profileBoxImg.style.textAlign = 'center';
			profileBoxImg.style.width = '100%';
			profileBoxImg.style.height = '320px';
				
			//pre processing for friend image to flip profiles order
			let friendImage = '';
			if(friendMode)
			{
				let friend = friendList[0].friends.find( function(p) {
					return p.id == currentProfile.id + '-' + profile.id || 
						p.id == profile.id + '-' + currentProfile.id;
				});
				
				if(friend != undefined)
				{
					friendImage = friend.image;
					
					if(friend.id !== (profile.id + '-' + currentProfile.id))
					{
						let tempProfile = currentProfile;
						currentProfile = profile;
						profile = tempProfile;
					}
				}
			}
				
			let image1Source = friendMode ? friendImage : randomProfileImg(profile.images);
			let image2Source = profile.images[profile.images.length-1];
			//if(friendMode) image2Source = image1Source;//currentProfile.images.length > 1 ? currentProfile.images[currentProfile.images.length-1] : randomProfileImg(currentProfile.images);
			if(friendMode) image2Source = addUrlClause(randomProfileImg(profile.images)) + ", " + addUrlClause(randomProfileImg(currentProfile.images));
			
			profileBoxImg.style.backgroundSize = 'contain';
			profileBoxImg.style.backgroundRepeat = 'no-repeat';
			profileBoxImg.style.backgroundPosition = 'center';
			profileBoxImg.style.backgroundImage = addUrlClause(image1Source);
			profileBoxImg.setAttribute('alt', friendMode ? image2Source : addUrlClause(image2Source));			
					
				/* let image1 = document.createElement('img');
				image1.src = spacer;
				image1.src = friendMode ? friendImage : randomProfileImg(profile.images);
				profileBoxImg.appendChild(image1);
				
				if(friendMode)
				{
					//image2 = document.createElement('img');
					//image2.src = spacer;
					//image2.alt = profile.images.length > 1 ? profile.images[profile.images.length-1] : randomProfileImg(profile.images);
					//profileBoxImg.appendChild(image2);
					
					image2 = document.createElement('img');
					image2.src = spacer;
					image2.alt = currentProfile.images.length > 1 ? currentProfile.images[currentProfile.images.length-1] : randomProfileImg(currentProfile.images);
					profileBoxImg.appendChild(image2);
				}
				else if(profile.images.length > 1)
				{
					let image2 = document.createElement('img');
					image2.src = spacer;
					image2.alt = profile.images[profile.images.length-1];
					profileBoxImg.appendChild(image2);
				} */
		
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
						if(!friendMode) cellDiv.innerText = ' (' + profile.nickname + ')';
						
							let span = document.createElement('span');
							span.classList.add('profile-name');
							span.innerText = profile.name;
							cellDiv.insertBefore(span, cellDiv.childNodes[0]);
							
						cell.appendChild(cellDiv);
						row.appendChild(cell);
						
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							// cellDiv.innerText = ' (' + currentProfile.nickname + ')';
							
								span = document.createElement('span');
								span.classList.add('profile-name');
								span.innerText = currentProfile.name;
								cellDiv.insertBefore(span, cellDiv.childNodes[0]);
								
							cell.appendChild(cellDiv);
							row.appendChild(cell);
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
								DOBspan.innerText = profile.dob + (!isExternal && !friendMode && profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							if(friendMode)
							{
								cellDiv = document.createElement('div');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = currentProfile.dob + (!isExternal && !friendMode && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
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
								cellDiv.innerText = profile.turningPoint.singerDebut 
											+ "|" + profile.turningPoint.swimsuitPhotobook 
											+ "|" + profile.turningPoint.isMarried;
							else
								cellDiv.innerText = processTurningPoint(profile.turningPoint.singerDebut, false)
											+ "|" + processTurningPoint(profile.turningPoint.swimsuitPhotobook, false) 
											+ "|" + processTurningPoint(profile.turningPoint.isMarried, false);
								
						cell.appendChild(cellDiv);
									
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							
							if(!isExternal && !friendMode) 
								cellDiv.innerText = currentProfile.turningPoint.singerDebut 
											+ "|" + currentProfile.turningPoint.swimsuitPhotobook 
											+ "|" + currentProfile.turningPoint.isMarried;
							else
								cellDiv.innerText = processTurningPoint(currentProfile.turningPoint.singerDebut, false)
											+ "|" + processTurningPoint(currentProfile.turningPoint.swimsuitPhotobook, false) 
											+ "|" + processTurningPoint(currentProfile.turningPoint.isMarried, false);
								
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
						
						let profileFriendsList = friendList[0].friends.filter( function(p) {
							return p.id.endsWith(profile.id) || p.id.startsWith(profile.id);
						});
						if(profileFriendsList.length > 0)
						{
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								cell.innerText = 'Known Acquaintances';
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
							
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								
									cellDiv = document.createElement('div');
									cellDiv.id = 'profile-friends';
									//sorting only works on firefox
									
									let profileFriends = [];
									for(let friend1 of profileFriendsList)
									{
										let splits = friend1.id.split('-');
										for(let item of splits)
										{
											if(item != profile.id)
												profileFriends.push(item);
										}
									}
									
									for(let friend of profileFriends.sort())
									{
										let span = document.createElement('span');
										span.innerText = ' ';
										cellDiv.appendChild(span);
										cellDiv.appendChild(generateWantedListEntry(friend));
									}
									
									cell.appendChild(cellDiv);
									
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
						}
						
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			if(!friendMode)
			{
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = addBrackets(profile.comments.join(')<br/>('),false);
				commentBox.innerHTML = commentBox.innerHTML.replace('1976.09.20', '<span id=\'HocchanAge\' class=\'DOB\'>1976.09.20</span>');
				
				profileBox.appendChild(commentBox);
			}
	
		idBox.appendChild(profileBox);
	
	if(!friendMode)
		document.getElementById('profile').classList.remove('friend-mode');
	else
		document.getElementById('profile').classList.add('friend-mode')
	document.getElementById('profile').appendChild(idBox);
	
	return true;
}

function getWantedLevelComment(profile) { return console.log(profile.name + '\n' + profile.wantedLevel + '\n' + profile.wantedLevelComment); }
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function processTurningPoint(option, returnBool) {
	if(returnBool)
		return option.includes('Yes') ? true : false;
	return option.split('*').join('');
}
function randomProfileImg(images) {
	return images[Math.floor(Math.random()*(images.length-1))];
}
function generateWantedListEntry(id) {
	let profileFromId = profileList.find( function(n) {
		return n.id == id
	});
	
	let friendLink = document.createElement('a');
	friendLink.classList.add('friend-link');
	friendLink.innerText = profileFromId.name;
	
	//wanted list processing
	friendLink.addEventListener("click", function() {
		generateProfileFromJSON(this.innerText.replace(" ", ""));
		renderProfileBox();
		addStatusPopUp();
		document.getElementById('profile').scrollIntoView();
	});
	friendLink.addEventListener("contextmenu", function(e) {
		e.preventDefault();
		isExternal = !isExternal;
		generateProfileFromJSON(this.innerText.replace(" ", ""));
		renderProfileBox();
		addStatusPopUp();
		document.getElementById('profile').scrollIntoView();
		isExternal = !isExternal;
	}, false);
	
	return friendLink;
}
function addUrlClause(url) {
	return "url('" + url + "')";
}