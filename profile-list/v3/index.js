//generate from json file
const spacer = 'https://knneo.github.io/resources/spacer.gif';
let isExternal = window.location.href.includes('://knneo.github.io'); //if not in local
let smallScreen = window.innerWidth <= 640;
let friendList = [];
let profileList = [];
let calendarList = [];
let defaultProfile = {};
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return n.category == 'profile' || n.category == 'seiyuu';
			});
			calendarList = profileList.concat(profileListJson.filter( function(n) {
				return n.category == 'alterna' || n.category == 'doaxvv' || n.category == 'hololive';
			}));
			friendList = profileListJson.filter( function(n) {
				return n.category == 'friends';
			});
			defaultProfile = profileListJson.find( function(n) {
				return n.category == 'default';
			});
			//code here
			if(profileList != null)
				renderWantedList();
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list-new.json", true);
	xmlhttp.send();
}
else {
	console.log('Using test json');
	profileList = profileListJson.filter( function(n) {
		return n.category == 'profile' || n.category == 'seiyuu';
	});
	calendarList = profileList.concat(profileListJson.filter( function(n) {
		return n.category == 'alterna' || n.category == 'doaxvv' || n.category == 'hololive';
	}));
	friendList = profileListJson.filter( function(n) {
		return n.category == 'friends';
	});
	defaultProfile = profileListJson.find( function(n) {
		return n.category == 'default';
	});
	renderWantedList();
}

function friendCheck() {
	console.log('Friend check!');
	
	if(friendList.length == 1 && friendList.length > 0)
	{		
		friendList.sort( function(a,b) {
			return a.id.localeCompare(b.id)
		});
		
		//check duplicate ids
		for(let pair of friendList)
		{
			let result = friendList.filter( function(f) {
				return f.id == pair.id;
			});
			if(result != undefined && result.length > 1)
				console.log(pair.id + " has exact duplicates");
		}
		
		//check ids but of different positions
		for(let pair of friendList)
		{
			let splits = pair.id.split('-');
			let result = friendList.filter( function(f) {
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
		
		
		let friendFound = friendList.find( function(p) {
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
				let friend = friendList.find( function(p) {
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
		
			profileBox.appendChild(profileBoxImg);
			
			let profileTable = document.createElement('table');
			
				let profileTableBody = document.createElement('tbody');
				
					let row = document.createElement('tr');
					
					if(!friendMode)
					{
						let cell = document.createElement('td');
						if(friendMode) cell.style.textAlign = 'center';
						cell.innerText = 'Name ' + (simplified ? '' : '(Nickname)');
						row.appendChild(cell);
					}
					
					profileTableBody.appendChild(row);
					
					row = document.createElement('tr');
					
						cell = document.createElement('td');
						let cellDiv = document.createElement('div');
						if(friendMode) cellDiv.style.textAlign = 'left';
						if(friendMode) cellDiv.style.position = 'absolute';
						if(!friendMode && !simplified) cellDiv.innerHTML = ' (' + superscriptText(profile.nickname) + ')';
						
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
								console.log(profile.dob);
								DOBspan.innerHTML = profile.dob + (!isExternal && !friendMode && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
								if(DOBspan.innerHTML.includes('????')) {
									let dateOnly = new Date(1990,profile.dob.substring(5,2),profile.dob.substring(8,2),0,0,0,0);
									DOBspan.innerHTML = month[parseInt(profile.dob.substring(5,7))-1] + ' ' + parseInt(profile.dob.substring(8,10)) + (!isExternal && !friendMode && !simplified && profile.dobComment ? (' (' + profile.dobComment + ')') : '');
									if(profile.dob.substring(10).length === 3)
										DOBspan.innerHTML += superscriptText(profile.dob.substring(10));
								}
								cellDiv.appendChild(DOBspan);
							
							cell.appendChild(cellDiv);
							
							if(friendMode)
							{
								cellDiv = document.createElement('div');
							
								DOBspan = document.createElement('span');
								DOBspan.classList.add('DOB');
								DOBspan.innerHTML = currentProfile.dob + (!isExternal && !friendMode && !simplified && currentProfile.dobComment != '' ? (' (' + currentProfile.dobComment + ')') : '');
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
									cellDiv.innerHTML = superscriptText(profile.turningPoint.soloDebut)
												+ "|" + superscriptText(profile.turningPoint.swimsuitPhotobook)
												+ "|" + superscriptText(profile.turningPoint.isMarried);
								else
									cellDiv.innerHTML = processTurningPoint(profile.turningPoint.soloDebut, false)
												+ "|" + processTurningPoint(profile.turningPoint.swimsuitPhotobook, false) 
												+ "|" + processTurningPoint(profile.turningPoint.isMarried, false);
									
							cell.appendChild(cellDiv);
										
							if(friendMode)
							{
								cellDiv = document.createElement('div');
								cellDiv.innerHTML = processTurningPoint(currentProfile.turningPoint.soloDebut, false)
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
							cell.innerHTML = superscriptText(profile.description);
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							cell.innerText = 'Wanted Level';
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							// cell.innerText = ratingAsStars(profile.rating, 5);
							cell.appendChild(ratingAsStars(profile.rating, 5));
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
						
						let profileFriendsList = friendList.filter( function(p) {
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
					
					if(profile.social)
					{
						if(!friendMode) {
							row = document.createElement('tr');
							
								cell = document.createElement('td');
								cell.innerText = 'Social Media';
								row.appendChild(cell);
							
							profileTableBody.appendChild(row);
						}
						
						row = document.createElement('tr');
						
							cell = document.createElement('td');
							
								cellDiv = document.createElement('div');
								cellDiv.id = 'profile-social';
								if(friendMode && currentProfile.social) {
									cellDiv.style.textAlign = 'left';
									cellDiv.style.position = 'absolute';
								}
								
								if(profile.social.twitter)
								{
									let twitterSpan = document.createElement('a');
									twitterSpan.href = 'https://twitter.com/' + profile.social.twitter;
									twitterSpan.target = '_blank';
									twitterSpan.title = profile.social.twitter;
									
									let twitterIcon = document.createElement('i');
									twitterIcon.classList.add('bi');
									twitterIcon.classList.add('bi-twitter');
									twitterSpan.appendChild(twitterIcon);
									
									cellDiv.appendChild(twitterSpan);
								}
								
								if(profile.social.instagram)
								{
									let instagramSpan = document.createElement('a');
									instagramSpan.href = 'https://www.instagram.com/' + profile.social.instagram;
									instagramSpan.target = '_blank';
									instagramSpan.title = profile.social.instagram;
									
									let instagramIcon = document.createElement('i');
									instagramIcon.classList.add('bi');
									instagramIcon.classList.add('bi-instagram');
									instagramSpan.appendChild(instagramIcon);
									
									cellDiv.appendChild(instagramSpan);
								}
								
								if(profile.social.youtube)
								{
									let youtubeSpan = document.createElement('a');
									youtubeSpan.href = 'https://www.youtube.com/channel/' + profile.social.youtube;
									youtubeSpan.target = '_blank';
									youtubeSpan.title = profile.social.youtube;
									
									let youtubeIcon = document.createElement('i');
									youtubeIcon.classList.add('bi');
									youtubeIcon.classList.add('bi-youtube');
									youtubeSpan.appendChild(youtubeIcon);
									
									cellDiv.appendChild(youtubeSpan);
								}
								
								cell.appendChild(cellDiv);
								
								if(friendMode && currentProfile.social) {				
									cellDiv = document.createElement('div');
									cellDiv.id = 'currentProfile-social';
									cellDiv.style.textAlign = 'right';
									
									if(currentProfile.social.twitter)
									{
										let twitterSpan = document.createElement('a');
										twitterSpan.href = 'https://twitter.com/' + currentProfile.social.twitter;
										twitterSpan.target = '_blank';
										twitterSpan.title = currentProfile.social.twitter;
										
										let twitterIcon = document.createElement('i');
										twitterIcon.classList.add('bi');
										twitterIcon.classList.add('bi-twitter');
										twitterSpan.appendChild(twitterIcon);
										
										cellDiv.appendChild(twitterSpan);
									}
									
									if(currentProfile.social.instagram)
									{
										let instagramSpan = document.createElement('a');
										instagramSpan.href = 'https://www.instagram.com/' + currentProfile.social.instagram;
										instagramSpan.target = '_blank';
										instagramSpan.title = currentProfile.social.instagram;
										
										let instagramIcon = document.createElement('i');
										instagramIcon.classList.add('bi');
										instagramIcon.classList.add('bi-instagram');
										instagramSpan.appendChild(instagramIcon);
										
										cellDiv.appendChild(instagramSpan);
									}
									
									if(currentProfile.social.youtube)
									{
										let youtubeSpan = document.createElement('a');
										youtubeSpan.href = 'https://www.youtube.com/channel/' + currentProfile.social.youtube;
										youtubeSpan.target = '_blank';
										youtubeSpan.title = currentProfile.social.youtube;
										
										let youtubeIcon = document.createElement('i');
										youtubeIcon.classList.add('bi');
										youtubeIcon.classList.add('bi-youtube');
										youtubeSpan.appendChild(youtubeIcon);
										
										cellDiv.appendChild(youtubeSpan);
									}
									
									cell.appendChild(cellDiv);
								}
								
							row.appendChild(cell);
						
						profileTableBody.appendChild(row);
					}
					
				profileTable.appendChild(profileTableBody);
			
			profileBox.appendChild(profileTable);
			
			if(!friendMode && !simplified)
			{
				let commentBox = document.createElement('div');
				commentBox.classList.add('profile-box-comments');
				commentBox.innerHTML = processComments(profile.comments, profile.links);
				if(window.location.href.includes('knneo.github.io'))
					commentBox.innerHTML = commentBox.innerHTML.replace(/knwebreports.blogspot.com/gi, 'knneo.github.io/blogspot/blog');
				//special case
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

function ratingAsStars(rating, total) {
	let stars = document.createElement('div');
	stars.title = rating + '/' + total;
	for(s = 0; s < total; s++)
	{
		let star = document.createElement('i');
		star.classList.add('bi');
		star.classList.add('bi-star' + (rating - s > 0 ? '-fill' : ''))
		stars.appendChild(star);
		// stars += rating - s > 0 ? '★' : '☆';
	}
	return stars;
}
function addBrackets(content, startWithWhitespace) { return (startWithWhitespace ? ' ' : '') + '(' + content + ')'; }
function processTurningPoint(option, returnBool) {
	if(returnBool)
		return option.includes('Yes') ? true : false;
	return superscriptText(option);
}
function processComments(comments, refs) {
	if(refs && refs.length > 0)
	{
		let commentArr = [];
		for(let comment of comments)
		{
			let added = false;
			for(let ref of refs)
			{
				let refText = ref.substring(0, ref.indexOf('}')+1);
				let refLink = ref.replace(refText, '');
				let replaced = comment.replace(refText, '<a target="_blank" href="' + refLink + '">' + refText + '</a>');
				console.log(replaced, comment);
				if(replaced != comment)
				{
					commentArr.push(replaced.replace('{','').replace('}',''));
					added = true;
				}
			}
			if(!added)
				commentArr.push(comment);
		}
		return superscriptText(commentArr.join('<br/>'));
	}
	return superscriptText(comments.join('<br/>'));
}
function superscriptText(input) {
	return input.replace('[1]',addSuperscript('[1]'))
		.replace('[2]',addSuperscript('[2]'))
		.replace('[3]',addSuperscript('[3]'));
}
function addSuperscript(input) { return '<span class="superscript">' + input + '</span>'; }
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
	friendLink.addEventListener("click", function(e) {		
		e.preventDefault();
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

//Multi-image thumbnail: Define caption height, onclick event
function setThumbnails() {
    let allThumbnails = document.body.getElementsByClassName("thumbnail");
    for (let i = 0; i < allThumbnails.length; i++) {
        let initialHeight = allThumbnails[i].getElementsByClassName('thumbnail-initial')[0].offsetHeight;
        let popHeight = allThumbnails[i].getElementsByClassName('thumbnail-pop')[0].offsetHeight;
        allThumbnails[i].style.height = Math.max(initialHeight, popHeight) + 'px';
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[0].addEventListener('click', function() {
		});
		allThumbnails[i].getElementsByClassName('thumbnail-toggle')[1].addEventListener('click', function() {
		});
    }
}

function closestClass(inputElement, targetClassName) {
    while (inputElement.className != targetClassName) {
        inputElement = inputElement.parentNode;
    }
    return inputElement;
}

function switchThumbnails(tn) {
    let tc = tn.getElementsByClassName("thumbnail-initial");
    let initialVisible = true;
    if (tc[0].style.visibility == "hidden") {
        tc[0].style.visibility = "visible";
        tc[1].style.visibility = "hidden";
    } else if (tc[0].style.visibility == "" || tc[1].style.visibility == "") {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
		initialVisible = false;
    } else {
        tc[0].style.visibility = "hidden";
        tc[1].style.visibility = "visible";
		initialVisible = false;
    }

	document.documentElement.scrollTop = 0;
    return false;
}

function adjustThumbnailHeight(tn) {
	let initialHeight = tn.getElementsByClassName('thumbnail-initial')[0].offsetHeight;
	let popHeight = tn.getElementsByClassName('thumbnail-pop')[0].offsetHeight;
	tn.style.height = (tn.getElementsByClassName('thumbnail-initial')[0].style.visibility == 'hidden' ? popHeight : initialHeight) + 'px';
}

//--not dependent on render--//
function navigateToProfile(e) {
	event.preventDefault();
	for(let link of document.getElementById('wantedList').getElementsByTagName('a'))
	{
		if(link.innerHTML.replace(' ','') == e.title)
		{
			generateProfileFromJSON(link.innerHTML.replace(' ', ''));
			renderProfileBox();
			addStatusPopUp();
			document.getElementById('profile').scrollIntoView();
			document.getElementById('timeline').getElementsByTagName('div')[0].style.opacity = '0';
			return;
		}
	}
	if(document.getElementsByClassName('timeline-popup').length > 0)
		document.getElementsByClassName('timeline-popup')[0].style.opacity = '0';
	
}

//on timeline double click shrink timeline
document.getElementById("timeline").addEventListener("dblclick", function() {
	let origWidth = this.getElementsByTagName("svg")[0].width.baseVal.value / 2;
	this.innerHTML = "";
	loadTimeline(origWidth < 1000 ? 1000 : origWidth);
});

//on timeline wheel scroll adjust timeline length ie. redraw
document.getElementById("timeline").addEventListener("wheel", function(e) {
	e.preventDefault();
	if (!e.shiftKey) {
		this.scrollLeft -= e.wheelDelta / 2;
		return;
	}
	let origWidth = this.getElementsByTagName("svg")[0].width.baseVal.value + e.wheelDelta;
	this.innerHTML = "";
	if (origWidth < 1000) origWidth = 1000;
	else if (origWidth > 10000) origWidth > 10000;
	loadTimeline(origWidth);
});

//refresh images on resize to avoid image fitting errors
window.addEventListener('resize', function () {
	resizeAllProfileBoxImg();
});

function loadTimeline(width) {
	TimeKnots.draw("#timeline", timelineDOBlist, {
		horizontalLayout: true,
		width: width,
		height: 100,
		dateFormat: "%Y.%m.%d",
		showLabels: true,
		labelFormat: "%Y"
	});
	adjustKnots();
}

//on scroll turn off all overlays in timeline and calendar
window.addEventListener("scroll", function() {
	let timeline = document.getElementById("timeline");
	if (timeline.getElementsByTagName("div").length > 0)
		timeline.getElementsByTagName("div")[0].style.opacity = "0";
});

//prevent right click on images
document.getElementById('profile').addEventListener("contextmenu", function(e) {
	e.preventDefault();
});

//--variables--//
let loadedImages = 0;
let timelineDOBlist = [];
let calendarDOBlist = [];
let currentMonth = 0;
let statusPopup = "<div id=\"tp-description\">As answered haphazardly by Uesaka Sumire (and expanded on by me) the three \"turning points\" of a voice actress (but applicable to all):<br/>~ Singer Debut (The exhibition of their unique voices in singing)<br/>~ Swimsuit Photobook (The display of their figure to the extent of being half-naked)<br/>~ Married (The declaration of the end of idolism?)</div>";
let friendMode = false;
let excludeMarried = false;
let timezone = "Asia/Tokyo";
let month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let DateTime = luxon.DateTime;

//--dependent on render, as functions to call on render--//
function renderWantedList() {
	generateWantedList();
	timelineDOBlist = createDOBlist(profileList, 1, 35);
	loadTimeline(2500);
	calendarDOBlist = createDOBlist(calendarList, 0, 50);
	currentMonth = createCalendar(DateTime.fromISO(DateTime.now(), {zone: timezone}).month-1, calendarDOBlist);
	addCalendarLegend();
	setThumbnails();
	initialiseTime();
	friendCheck();
}

function initialiseTime() {
	updateTime();
	setTimeout(updateTime, 1000);
}

function updateTime() {
	var now = DateTime.local().setZone(timezone);
	document.getElementById('time').innerText = now.toFormat("yyyy.MM.dd HH:mm:ss");
	
	setTimeout(updateTime, 1000);
}

function toggleInitialThumbnailLayout() {
	if(!smallScreen)
	{
		let thumbnail = document.getElementsByClassName('thumbnail')[0];
		let thumbnailInitial = thumbnail.getElementsByClassName('thumbnail-initial')[0];
		let thumbnailPop = thumbnail.getElementsByClassName('thumbnail-pop')[0];
		let marriedCouple = document.getElementById('marriedCouple').cloneNode(true);
		document.getElementById('marriedCouple').remove();
		let profile = document.getElementById('profile').cloneNode(true);
		document.getElementById('profile').remove();
		thumbnailPop.appendChild(profile);
		thumbnailInitial.appendChild(marriedCouple);
		document.getElementById('pairSearch').remove();
	}
}

function renderProfileBox() {
	document.getElementById('profile').style.display = '';
	addProfileBoxClick();
	addProfileBoxImgOnError();
	switchProfileBoxImage();
	addAgeAfterDOB();
	openCommentLinksInNew();
	setTimeout(reloadImages, 300);
}

//--functions--//
function daysFromMe() {
	let me = timelineDOBlist.filter(t => t.name == "Me")[0];
	let others = timelineDOBlist.filter(t => t.name != "Me");
	console.log('with respect to ' + me.date + ':');
	let awway = new Array();
	for(let other of others)
	{
		if(other.date.includes('????')) continue;
		let DOB = other.date;
		let myDateStr = me.date.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
		let myDate = myDateStr.substring(0, 10);
		let birthDateStr = DOB.replace(".", "-").replace(".", "-");
		let birthDate = birthDateStr.substring(0, 10);
		let diff = DateTime.fromISO(myDate).setZone(timezone).diff(DateTime.fromISO(birthDate), 'days').days;
		awway.push({
			name: other.name,
			daysAway: Math.abs(diff)
			});
	}
	
	console.log(awway.sort((a,b) => a.daysAway - b.daysAway));
}

//add age after DOB span
function addAgeAfterDOB() {
	if(document.getElementById('profile').classList.contains('friend-mode')) return;
	let profile = profileList.filter(p => p.id === document.getElementById('profile').firstChild.id)[0];
	let DOBspan = document.getElementById(profile.id).getElementsByClassName('DOB')[0];
	let age = profile.dob.includes('????') ? 0 : parseInt(getAge(profile.dob));
	if (age != undefined && age > 0)
		DOBspan.innerHTML = DOBspan.innerHTML.concat(" [").concat(age.toString()).concat(" years ago]");
}

function getAge(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone});
	let today = DateTime.fromISO(DateTime.now(), {zone: timezone});
	// console.log(today.diff(birthDate, ['years','months','days','hours','minutes','seconds']));
	return today.diff(birthDate, 'years').years;
}

function checkBirthdayPassed(DOB) {
	let birthDateStr = DOB.replace(".", "-").replace(".", "-"); //yyyy.MM.dd -> yyyy-MM-dd
	let birthDate = DateTime.fromISO(birthDateStr.substring(0, 10), {zone: timezone}); 
	let today = DateTime.fromISO(DateTime.now(), {zone: timezone});
	return today.diff(birthDate, 'days').days >= 0;
}

//generate wanted list
function generateWantedList(profileLink) {
	let wantedListString = "";
	let wantedList = document.getElementById("wantedList");

	//create name array from static profile boxes
	let profileNamesList = new Array();
	for (let profileName of profileList) {
		if (excludeMarried && processTurningPoint(profileName.turningPoint.isMarried, true)) continue;
		if (friendMode && friendList.filter( function(n) {
					return (n.friend1 == profileName.id) || 
						   (n.friend2 == profileName.id)
				}).length == 0) continue;
		profileNamesList.push(profileName.name);

	}
	profileNamesList.sort();

	//create wanted list from list of names
	let currentProfileName = profileLink != undefined ? profileLink.innerText.replace(' ','') : '';
	for (let profileName of profileNamesList) {
		wantedListString += "<li><a" + 
		(friendMode && friendList.filter( function(n) {
					return (n.friend1 == currentProfileName && n.friend2 == profileName.replace(' ','')) || 
						   (n.friend2 == currentProfileName && n.friend1 == profileName.replace(' ',''))
				}).length == 0
									? " style=\"filter: grayscale(100);\"" 
									: ""
						) + ">" + profileName + "</a></li>";
	}
	wantedList.innerHTML = wantedListString;

	//wanted list processing
	for (let id = 0; id < wantedList.getElementsByTagName("a").length; id++) {
		wantedList.getElementsByTagName("a")[id].style.margin = '5px';
		wantedList.getElementsByTagName("a")[id].addEventListener("click", function() {
			generateProfileFromJSON(this.innerText.replace(" ", ""));
			renderProfileBox();
			addStatusPopUp();
			generateWantedList(this);
			document.getElementById('profile').scrollIntoView();
		});
		wantedList.getElementsByTagName("a")[id].addEventListener("contextmenu", function(e) {
			e.preventDefault();
			isExternal = !isExternal;
			generateProfileFromJSON(this.innerText.replace(" ", ""));
			renderProfileBox();
			generateWantedList(this);
			document.getElementById('profile').scrollIntoView();
			isExternal = !isExternal;
		}, false);
	}
}

function addStatusPopUp() {
	if(statusPopup == '') return;
	if(document.getElementsByClassName("turning-point").length < 1) return;
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseover", function(d) {
		d.target.innerHTML = statusPopup + d.target.innerHTML;
	});
	document.getElementsByClassName("turning-point")[0].addEventListener("mouseout", function() {
		if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
	});
}

function addStatusPopUps() {
	for (let statusPopOut of document.getElementsByClassName("turning-point")) {
		statusPopOut.addEventListener("mouseover", function(d) {
			d.target.innerHTML = statusPopup + d.target.innerHTML;
		});
		statusPopOut.addEventListener("mouseout", function() {
			if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
		});
	}
	document.addEventListener("touchmove", function() {
		if (document.getElementById("tp-description") != null) document.getElementById("tp-description").remove();
	});
}

//create array of objects with DOB info, parameter: age (range inclusive)
function createDOBlist(list, minAge, maxAge) {
	let listOfDOB = new Array();
	if(defaultProfile) {
		listOfDOB.push({
			category: defaultProfile.category,
			date: defaultProfile.dob.replace(".", "-").replace(".", "-").substring(0, 10),
			name: defaultProfile.name
		});
	}
	for(let profile of list) {
		let targetDOB = profile.dob;
		if (targetDOB.length > 0) {
			let birthDate = new Date(Date.parse(targetDOB.replace(".", "-").replace(".", "-").substring(0, 10)));
			let age = targetDOB.includes('?') ? 0 : parseInt(getAge(targetDOB));
			if (!birthDate.toUTCString().includes(NaN) && age >= minAge && age <= maxAge)
				listOfDOB.push({
					category: profile.category,
					date: targetDOB.replace(".", "-").replace(".", "-").substring(0, 10),
					name: profile.name,
					currentAge: age
				});
		}
	}
	//to sort the above so oldest is added first in timeline
	listOfDOB.sort(function(a, b) {
		return Date.parse(a.date) - Date.parse(b.date)
	});
	return listOfDOB;
}

function toggleMarried() {
	excludeMarried = document.getElementById("marriedCheckbox").checked;
	if(excludeMarried && friendMode) 
	{
		document.getElementById("pairsCheckbox").checked = false;
		togglePairs();
	}
	generateWantedList();
	timelineDOBlist = createDOBlist(profileList, 1, 35);
	document.getElementById("timeline").innerHTML = "";
	loadTimeline(2500);
}

function togglePairs() {
	//generate wanted list again, but all disable (grayscale too?), only those who have friends
	//clicking on first link will store first value as variable
	//this variable is then used to light up all wanted list again on generate, to available pair
	//clicking on second link will now go to pair view (call generate profile twice will do)
	//generateWantedList(document.getElementById("marriedCheckbox").checked);
	friendMode = document.getElementById("pairsCheckbox").checked;
	if(document.getElementById('profile').childElementCount > 0) 
	{
		let profileNode = document.createElement('div');
		profileNode.innerText = document.getElementById('profile').childNodes[0].id;
		generateWantedList(profileNode);
	}
}

//generate calendar from profile boxes
function createCalendar(monthNo, DOBlist) {
	let calendarArray = new Array();
	let dayOfMonth = 1;
	// render days of month as fixed array
	for (let week = 0; week < 6; week++) {
		let weekList = ['', '', '', '', '', '', ''];
		for (let day = 0; day < 7; day++) {
			if (new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDay() == day) {
				//add to array
				if (dayOfMonth > new Date(new Date().getFullYear(), monthNo, dayOfMonth).getDate()) break;
				weekList[day] = dayOfMonth;
				dayOfMonth++;
			}
		}
		calendarArray.push(weekList);
	}
	
	let htmlString = "<table><tbody><tr><td>" + 
	(monthNo+1 > 1 ? "<i id=\"prevMonth\" class=\"bi bi-arrow-left\"></i>" : "") + 
	"</td><td colspan=\"5\">" + 
	month[monthNo] + " " + new Date().getFullYear() + 
	"</td><td>" + 
	(monthNo+1 < 12 ? "<i id=\"nextMonth\" class=\"bi bi-arrow-right\"></i>" : "") + 
	"</td></tr><tr><td>Sun</td><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td></tr>";
	
	// render array as table
	for (let week = 0; week < 6; week++) {
		htmlString += "<tr>";
		let weekList = calendarArray[week];
		for (let day = 0; day < 7; day++) {
			htmlString += "<td>" + weekList[day] + "</td>";
		}
		htmlString += "</tr>";
	}
	htmlString += "</tbody></table>";
	
	// replace cells in table with relevant dates
	for (let item of DOBlist) {
		//calculate if birthday this year has passed
		let currentYear = '2021';
		let birthdayInYear = new Date(new Date().getFullYear(), new Date(item.date.replace('????', currentYear)).getMonth(), new Date(item.date.replace('????', currentYear)).getDate());
		
		let DOB = currentYear + item.date.substring(4);
		let IsBirthdayOver = checkBirthdayPassed(DOB);
		// console.log(item.name, timeDiff.days(), timeDiff.hours(), timeDiff.minutes(), timeDiff.seconds(), timeDiff.milliseconds());
		
		let thisAge;
		if (item.currentAge <= 1) thisAge = '??';
		else if (IsBirthdayOver) thisAge = item.currentAge;
		else thisAge = item.currentAge + 1;
		// console.log(item.name + "|" + item.currentAge);
		if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //if no age
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + setCalendarColour(item.category) + "; color: black;\"><div class=\"popitem\">Happy Birthday <b>" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1 && 
		htmlString.indexOf("<td>" + birthdayInYear.getDate() + "</td>") > -1 && 
		item.name != "Me") //normal
			htmlString = htmlString.replace("<td>" + birthdayInYear.getDate() + "</td>", 
			"<td style=\"background-color: " + setCalendarColour(item.category) + "; color: black;\"><div class=\"popitem\"><b>" + item.name + "</b> turns " + thisAge + " (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");	
		else if (thisAge == '??' && 
		htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs, if no age
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br />Happy Birthday <b>" + item.name + "</b>!!</div>" + birthdayInYear.getDate() + "</td>");
		else if (htmlString.indexOf(month[birthdayInYear.getMonth()]) > -1) //overlap DOBs
			htmlString = htmlString.replace("</div>" + birthdayInYear.getDate() + "</td>", 
			"<br /><b>" + item.name + "</b> turns " + thisAge + "</b> (" + birthdayInYear.getDate() + " " + month[birthdayInYear.getMonth()].substring(0, 3) + ")</div>" + birthdayInYear.getDate() + "</td>");
	}
	
	document.getElementById("calendar").innerHTML = htmlString;
	
	//global variable for month navigation
	//events for month buttons
	currentMonth = monthNo;
	if (currentMonth > 0) document.getElementById("prevMonth").addEventListener("click", function() {
		createCalendar(--currentMonth, calendarDOBlist);
	});
	if (currentMonth < 11) document.getElementById("nextMonth").addEventListener("click", function() {
		createCalendar(++currentMonth, calendarDOBlist);
	});
	return monthNo;
}

function setCalendarColour(categoryId) {
	//default list always first, so overlap is default color
	switch(categoryId) {
		case 'alterna':
			return 'pink';
		case 'doaxvv':
			return 'lime';
		case 'hololive':
			return 'gold';
		case 'seiyuu':
			return 'cyan';
		default:
			return 'lightgray';
	}
}

function addCalendarLegend() {
	let categories = calendarList.filter((val, index, arr) => arr.map(a => a.category).indexOf(val.category) === index).map(p => p.category); // ['alterna','doaxvv','seiyuu','vtuber'];
	// console.log(categories);
	let calendarLegend = document.getElementById('calendar-legend');
	calendarLegend.innerHTML = '';
	for(let category of categories) {		
		let id = 'label-' + category;
		let label = document.createElement('label');
		
			let legend = document.createElement('input');
			legend.id = id;
			legend.type = 'checkbox';
			legend.name = category;
			legend.checked = true;
			label.appendChild(legend);
			
			let box = document.createElement('span');
			box.classList.add('legend');
			box.style.backgroundColor = setCalendarColour(category.toLowerCase());
			label.appendChild(box);
					
			let description = document.createElement('span');
			description.style.padding = '0 5px';
			description.title = category;
			description.addEventListener('click',toggleCalendarLegend);
			description.innerText = category.substring(0,1).toUpperCase() + category.substring(1);
			label.appendChild(description);
		
		calendarLegend.appendChild(label);
	}
}

function toggleCalendarLegend() {
	this.previousElementSibling.style.backgroundColor = this.previousElementSibling.previousElementSibling.checked ? 'transparent' :setCalendarColour(this.title.toLowerCase());
	setTimeout(function() {
		filterCalendar();
		createCalendar(DateTime.fromISO(DateTime.now(), {zone: timezone}).month-1, calendarDOBlist);
	}, 10);
}

function filterCalendar() {
	let checkedCategories = Array.from(document.getElementById('calendar-legend').getElementsByTagName('input')).filter(i => i.checked == true).map(i => i.name);
	calendarDOBlist = createDOBlist(calendarList, 0, 50);
	calendarDOBlist = calendarDOBlist.filter(c => c.name != 'Me' && 
	(checkedCategories.indexOf(c.category) >= 0 
	// || (checkedCategories.indexOf('seiyuu') >= 0 && c.category.startsWith('seiyuu'))
	)
	);
}

//to shift position of knots if overlap with previous
function adjustKnots() {
	let circleList = document.getElementsByTagName("circle");
	for (let i = 0; i < circleList.length - 1; i++) {
		let oldCX = parseInt(circleList[i].getAttribute("cx"));
		if (circleList[i + 1].getAttribute("cx") - oldCX <= 20) circleList[i + 1].setAttribute("cx", oldCX + 20);
	}
}

//double click profile box go up to list of names
function addProfileBoxClick() {
	for (let profBox of document.getElementsByClassName("profile-box")) profBox.addEventListener("dblclick", function() {
		document.getElementById("profile").style.display = 'none';
		document.getElementById("profile").innerHTML = '';
		document.body.scrollTop = 0; // For Safari
		document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	});
}

//add event listener for image switch
//consider changing to detect 1st image error, move src or 2nd image up, remove 2nd image, use while loop to allow as many images but only switch 1st two images
function addProfileBoxImgOnError() {
	let profileBoxImg = document.getElementsByTagName("img");
	for (let i = 0; i < profileBoxImg.length; i++) {
		profileBoxImg[i].addEventListener("error", function() {
			if (this.nextElementSibling != null) this.nextElementSibling.style.display = "";
			if (this.nextElementSibling.nextElementSibling != null) this.nextElementSibling.nextElementSibling.style.display = "";
			this.remove();
		});
		if (profileBoxImg[i].previousElementSibling != null)
			profileBoxImg[i].style.display = "none";

	}
};

//add event listener for image switch but through clicking on profile box
function switchProfileBoxImage() {
	let profileBoxImgList = document.getElementsByClassName("profile-box");
	for (let i = 0; i < profileBoxImgList.length; i++) {
		profileBoxImgList[i].addEventListener("click", function() {
			let boxImg = this.getElementsByClassName('profile-box-img')[0];
			if(boxImg.style.backgroundImage == boxImg.getAttribute('alt')) return;
			let temp = boxImg.getAttribute('alt');//boxImg.style.backgroundImage;
			boxImg.setAttribute('alt', boxImg.style.backgroundImage);
			boxImg.style.backgroundImage = temp;
			if(temp.split('url(').length - 1 > 1) 
			{
				boxImg.style.backgroundRepeat = 'no-repeat';
				boxImg.style.backgroundSize = '50% auto';
				boxImg.style.backgroundPosition = 'left, right';
			}
			else
			{
				boxImg.style.backgroundSize = 'contain';
				boxImg.style.backgroundRepeat = 'no-repeat';
				boxImg.style.backgroundPosition = 'center';
			}
		});
	} 
}

//allow reload in case of initial fail, on slower networks
function reloadImages() {
	let profileBoxImg = document.getElementsByTagName("img");
	for (let image of profileBoxImg) {
		if (image.alt != '')
		{
			image.src = image.alt;
			image.removeAttribute('alt');
		}
	}
	for (let i = 0; i < profileBoxImg.length; i++) {
		if (profileBoxImg[i].complete) {
			resizeProfileBoxImg(profileBoxImg[i]);
			loadedImages++;
		}
	}

	if (loadedImages != profileBoxImg.length) setTimeout(reloadImages, 200);
	else resizeAllProfileBoxImg();

}

//resize images on load
function resizeAllProfileBoxImg() {
	loadedImages = 0;
	for(let image of document.getElementsByTagName('img'))
	{
		resizeProfileBoxImg(image);
	}
}

function resizeProfileBoxImg(image) {
	let isPortrait = image.height >= image.width;
	image.style.height = "320px";
	if (smallScreen && !isPortrait) {
		image.style.height = "";
		image.style.maxHeight = "100%";
		image.style.maxWidth = "95%";
	}
}

function openCommentLinksInNew() {
	for(let comments of document.getElementsByClassName('profile-box-comments'))
	{
		for(let link of comments.getElementsByTagName('a'))
		{
			let url = link.href;
			if(!isExternal && url.includes('knwebreports.blogspot')) continue;
			if(url.includes('knneo.github.io')) continue;
			link.href = 'javascript:void(0)';
			link.addEventListener('click', function () { window.open(url, '_blank'); } );
		}
	}
}

function checkDuplicateImages() {
	for(let profile of profileList)
	{
		let duplicates = duplicates(profile.landscapes.concat(profile.portraits));
		if(duplicates.length > 0)
			console.log(profile.id, duplicates);
	}
}

function duplicates(array) {
	let duplicates = [];
	let uniqueIndexes = array.filter((item, index) => array.indexOf(item) == index).map((item, index) => index);
	return array.filter((item, index) => uniqueIndexes.indexOf(index) < 0);
}