//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let isExternal = window.location.href.includes('://knneo.github.io');
let smallScreen = window.innerWidth <= 640;
let friendList = [];
let profileList = [];
let defaultProfile = {};
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList' && n.category != 'default';
			});
			friendList = profileListJson.filter( function(n) {
				return n.category == 'friendList';
			});
			defaultProfile = profileListJson.find( function(n) {
				return n.category == 'default';
			});
			//code here
			//if(profileList != null && generateProfileListFromJSON(profileList)) renderProfileBox();
			if(profileList != null) renderWantedList();
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	console.log('Using test json');
	profileList = profileListJson.filter( function(n) {
				return n.category != 'friendList' && n.category != 'default';
			});
	friendList = profileListJson.filter( function(n) {
		return n.category == 'friendList';
	});
	defaultProfile = profileListJson.find( function(n) {
		return n.category == 'default';
	});
	renderWantedList();
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

function exportCalendar() {
	let textOutput = '"Subject","Start date","All Day Event","Description","Private"';
	// title, MM/dd/yyyy, true, description, true
	for(let profile of calendarDOBlist)
	{
		textOutput += '\n';
		let formatDate = profile.date.substring(5,7) + '/' + profile.date.substring(8,10) + '/' + DateTime.now().year;
		
		//follow wanted-list-v2.js
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(profile.date.replace('????', '2021')).getMonth(), new Date(profile.date.replace('????', '2021')).getDate());
		let DOB = '2021' + profile.date.substring(4);
		let IsBirthdayOver = checkBirthdayPassed(DOB);
		
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
	document.getElementById('exportBtn').setAttribute('disabled','');
}

function generateProfileFromJSON(profileName) {
	let friendMode = false;
	//the profile selected
	let profile = profileList.filter( function(n) {
        return n.id == profileName;
    })[0];
	//for if only mandatory field are filled
	let simplified = profile.intro == undefined || isExternal;

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
	idBox.style.maxWidth = simplified || friendMode ? '440px' : '640px';
	idBox.style.margin = 'auto';
	idBox.style.padding = '3px';
	
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
			
			if(profile.landscapes == undefined) profile.landscapes = [];
			if(profile.portraits == undefined) profile.portraits = [];
			let allImages = profile.landscapes.concat(profile.portraits);
			
			let image1Source = profile.image;
			if(allImages.length > 0) image1Source = randomProfileImg(allImages);
			if(friendMode) image1Source = friendImage;
			
			let image2Source = profile.image;
			if(friendMode)
			{
				if(currentProfile.landscapes == undefined) currentProfile.landscapes = [];
				if(profile.portraits.length == 0) profile.portraits.push(profile.image);
				if(currentProfile.portraits == undefined) currentProfile.portraits = [];
				if(currentProfile.portraits.length == 0) currentProfile.portraits.push(currentProfile.image);
				image2Source = addUrlClause(randomProfileImg(profile.portraits)) + ", " + addUrlClause(randomProfileImg(currentProfile.portraits));
			}
			
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
					
					if(!friendMode)
					{
						let cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Name ' + (!simplified ? '' : '(Nickname)');
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						let cellDiv = document.createElement('div');
						if(friendMode) cellDiv.style.textAlign = 'left';
						if(friendMode) cellDiv.style.position = 'absolute';
						if(!friendMode && !simplified) cellDiv.innerText = ' (' + profile.nickname + ')';
						
							let span = document.createElement(friendMode ? 'a' : 'span');
							span.classList.add('profile-name');
							span.innerText = profile.name;
							if(friendMode) 
							{	
								span.href = 'javascript:void(0)';
								span.addEventListener("click", function() {
									generateProfileFromJSON(this.innerText.replace(" ", ""));
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
								});
								span.addEventListener("contextmenu", function(e) {
									e.preventDefault();
									isExternal = !isExternal;
									generateProfileFromJSON(this.innerText.replace(" ", ""));
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
									isExternal = !isExternal;
								}, false);
							}
							cellDiv.insertBefore(span, cellDiv.childNodes[0]);
							
						cell.appendChild(cellDiv);
						row.appendChild(cell);
						
						if(friendMode)
						{
							cellDiv = document.createElement('div');
							// cellDiv.innerText = ' (' + currentProfile.nickname + ')';
							
								span = document.createElement('a');
								span.classList.add('profile-name');
								span.innerText = currentProfile.name;
								span.href = 'javascript:void(0)';
								span.addEventListener("click", function() {
									generateProfileFromJSON(this.innerText.replace(" ", ""));
									renderProfileBox();
									addStatusPopUp();
									document.getElementById('profile').scrollIntoView();
								});
								cellDiv.insertBefore(span, cellDiv.childNodes[0]);
								
							cell.appendChild(cellDiv);
							row.appendChild(cell);
						}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
						
					if(!friendMode)
					{
						cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Date Of Birth';
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						
							cellDiv = document.createElement('div');
							if(friendMode) cellDiv.style.textAlign = 'left';
							if(friendMode) cellDiv.style.position = 'absolute';
							
								let DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = profile.dob + (!isExternal && !friendMode && !simplified && profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
								if(DOBspan.innerText.includes('????')) {
									let dateOnly = new Date(1990,profile.dob.substring(5,2),profile.dob.substring(8,2),0,0,0,0);
									DOBspan.innerText = month[parseInt(profile.dob.substring(5,7))-1] + ' ' + parseInt(profile.dob.substring(8,10)) + (!isExternal && !friendMode && !simplified && profile.dobComment != '' ? (' (' + profile.dobComment + ')') : '');
								}
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							if(friendMode)
							{
								cellDiv = document.createElement('div');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								//DOBspan.innerText = profile.dob;
								DOBspan.innerText = currentProfile.dob + (!isExternal && !friendMode && !simplified && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
								cellDiv.appendChild(DOBspan);
							
								cell.appendChild(cellDiv);
							}
						
						row.appendChild(cell);
					
					profileTableBody.appendChild(row);
					
					
					if(!friendMode)
					{
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
								if(!isExternal && !friendMode && !simplified) 
									cellDiv.innerText = profile.turningPoint.soloDebut 
												+ "|" + profile.turningPoint.swimsuitPhotobook 
												+ "|" + profile.turningPoint.isMarried;
								else
									cellDiv.innerText = processTurningPoint(profile.turningPoint.soloDebut, false)
												+ "|" + processTurningPoint(profile.turningPoint.swimsuitPhotobook, false) 
												+ "|" + processTurningPoint(profile.turningPoint.isMarried, false);
									
							cell.appendChild(cellDiv);
										
							if(friendMode)
							{
								cellDiv = document.createElement('div');
								cellDiv.innerText = processTurningPoint(currentProfile.turningPoint.soloDebut, false)
											+ "|" + processTurningPoint(currentProfile.turningPoint.swimsuitPhotobook, false) 
											+ "|" + processTurningPoint(currentProfile.turningPoint.isMarried, false);
								cell.appendChild(cellDiv);
							}
						
							row.appendChild(cell);
							
						profileTableBody.appendChild(row);
					}
					
					if(!friendMode && !simplified)
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
							
								cell = document.createElement('td')
								
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
					
					if(!friendMode && profile.socialHandlers)
					{
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Social Media';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								cellDiv.id = 'profile-social';
								
								if(profile.socialHandlers.twitter)
								{
									let twitterSpan = document.createElement('a');
									twitterSpan.href = 'https://twitter.com/' + profile.socialHandlers.twitter;
									twitterSpan.target = '_blank';
									twitterSpan.title = profile.socialHandlers.twitter;
									// twitterSpan.innerText = 'Twitter';
									
									let twitterIcon = document.createElement('i');
									twitterIcon.classList.add('bi');
									twitterIcon.classList.add('bi-twitter');
									twitterSpan.appendChild(twitterIcon);
									
									cellDiv.appendChild(twitterSpan);
								}
								
								if(profile.socialHandlers.instagram)
								{
									let instagramSpan = document.createElement('a');
									instagramSpan.href = 'https://www.instagram.com/' + profile.socialHandlers.instagram;
									instagramSpan.target = '_blank';
									instagramSpan.title = profile.socialHandlers.instagram;
									// instagramSpan.innerText = 'Instagram';
									
									let instagramIcon = document.createElement('i');
									instagramIcon.classList.add('bi');
									instagramIcon.classList.add('bi-instagram');
									instagramSpan.appendChild(instagramIcon);
									
									cellDiv.appendChild(instagramSpan);
								}
								
								if(profile.socialHandlers.youtube)
								{
									let youtubeSpan = document.createElement('a');
									youtubeSpan.href = 'https://www.youtube.com/c/' + profile.socialHandlers.youtube;
									youtubeSpan.target = '_blank';
									youtubeSpan.title = profile.socialHandlers.youtube;
									// youtubeSpan.innerText = 'YouTube';
									
									let youtubeIcon = document.createElement('i');
									youtubeIcon.classList.add('bi');
									youtubeIcon.classList.add('bi-youtube');
									youtubeSpan.appendChild(youtubeIcon);
									
									cellDiv.appendChild(youtubeSpan);
								}
								
								cell.appendChild(cellDiv);
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			if(!friendMode && !simplified)
			{
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = profile.comments.join('<br/>');
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
