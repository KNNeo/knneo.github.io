//--SETTING--//
const debugMode = false; //shows logs
const friendsMode = true; //allows images of friends to be included
const timeChallenge = true; //if true will preload images first, adds timer to quiz
const totalQns = 10; //questions to show, cannot be more than provided list
const instructions = `
Instructions:
- Timed quiz based on profile list, see profile-list.json
`;

//--VARIABLE--//
let friendList = [];
let profileList = [];
//--READ JSON--//
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return n.category == 'seiyuu';
			});
			friendList = profileListJson.filter( function(n) {
				return n.category == 'friendList';
			});

			//code here
			if(profileList != null) {
				defineNameList();
				renderQuiz(true);
			}
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list.json", true);
	xmlhttp.send();
}
else {
	if(debugMode) console.log('Using test json');
	profileList = profileListJson.filter( function(n) {
		return n.category == 'seiyuu';
	});
	friendList = profileListJson.filter( function(n) {
		return n.category == 'friendList';
	});
	defineNameList();
	renderQuiz(true);
}

//--FUNCTION--//
let preloads = [];
let imageList = [];
let nameList = [];
let quiz = [];
let qNo = 0;
let score = 0;
let startTime;
function defineNameList() {
	
	if(friendsMode)
	{
		for(let friend of friendList) {
			let allImages = friend.friends;
			let id = friend.id;
			
			allImages.map(function (i, index, arr) {
				let names = i.id.split('-');
				imageList.push({
					image: i.image,
					name: profileList.filter(pl => names.includes(pl.id)).map(p => p.name),
					id: i.id,
				});
			});
		}	
	}
	
	for(let profile of profileList) {
			let allImages = profile.landscapes.concat(profile.portraits);
			let name = profile.name;
			let id = profile.id;
			
			if(!friendsMode)
				allImages.map(function (i, index, arr) {
					imageList.push({
						image: i,
						name,
						id,
					});
				});
				
			nameList.push(name);
			
	}
	
	if(debugMode) console.log(imageList);
	if(debugMode) console.log(nameList);
}

function renderQuiz(isFirstLoad) {
	if(isFirstLoad)
		document.querySelector('.title').innerText = friendsMode ? '女性プロフィール友達クイズ' : '女性プロフィールクイズ';

	//option2 button is start	
	document.querySelector('#option1').style.display = 'none';
	document.querySelector('#option2').style.display = '';
	document.querySelector('#option2').innerText = isFirstLoad ? 'Start' : 'Restart';
	document.querySelector('#option3').style.display = 'none';
	
	if(isFirstLoad)
		document.querySelector('.instructions').innerText = instructions;
	if(totalQns > profileList.length)
	{
		document.querySelector('#option2').style.display = 'none';
		document.querySelector('.instructions').innerText = 'List provided is more than quiz length';
	}
}

function onOptionClick(mode) {
	//option must have data-id to add score
	let answer = document.querySelector('.question').getAttribute('data-id');
	if(!friendsMode && mode.getAttribute('data-id') != null && mode.getAttribute('data-id') == answer)
	{
		if(debugMode) console.log('score', mode.getAttribute('data-id'), answer);
		score++;
	}
	if(friendsMode && mode.getAttribute('data-id') != null && mode.getAttribute('data-id').includes(answer))
	{
		if(debugMode) console.log('score', mode.getAttribute('data-id'), answer);
		score++;
	}
	
	quizStep(mode.innerText);
}

function quizStep(mode) {
	if(mode.toLowerCase().includes('start'))
	{
		//starts quiz
		qNo = 0;
		score = 0;
		startQuiz();
		return;
	}
	
	//next question
	nextQuestion();

}

function startQuiz() {	
	if(timeChallenge)
	{
		document.querySelector('.instructions').innerText = 'Loading...';
		initialiseTimer();
	}
	
	//populate n questions
	quiz = [];
	let randomArr = [];
	let q = totalQns;
	while(q >= 0)
	{
		let rand = Math.floor(Math.random() * imageList.length);
		if(!randomArr.includes(rand))
		{
			randomArr.push(rand);
			q--;
		}
	}
	
	if(debugMode) console.log('randomArr',randomArr);
	
	for(let index of randomArr)
	{	
		quiz.push(imageList[index]);
		
		if(timeChallenge)
		{
			preloads = [];
			let preload = new Image();
			preload.src = imageList[index].image;
			preloads.push(preload);
		}
	}
	
	nextQuestion();
}

function nextQuestion() {
	showStage();
	
	if(qNo >= totalQns)
	{
		endQuiz();
		return;
	}
	
	//set image
	qNo++;
	
	document.querySelector('.question').innerHTML = '';
	
	let current = quiz[qNo];
	document.querySelector('.question').setAttribute('data-id', current.id);
	
	let image = document.createElement('img');
	image.classList.add('image');
	image.style.height = '100%';
	image.src = current.image;
	// if(debugMode) console.log('current.image',current.image);
	image.addEventListener('error', function() {
		if(debugMode) console.log('image not found, generating new question');
		nextQuestion();
	});
	
	document.querySelector('.question').appendChild(image);
	
	// document.querySelector('.question').style.backgroundSize = 'contain';
	// document.querySelector('.question').style.backgroundRepeat = 'no-repeat';
	// document.querySelector('.question').style.backgroundPosition = 'center';
	// document.querySelector('.question').style.backgroundImage = addUrlClause(current.image);
	
	
	//set options
	document.querySelector('#option1').style.display = '';
	document.querySelector('#option2').style.display = '';
	document.querySelector('#option3').style.display = '';
	let answer = Math.floor(Math.random() * 3) + 1;
	let otherOptions = nameList
	.filter((name) => name != current.name)
	.sort((a,b) => { return (Math.random() * 2) - 1; });
	document.querySelector('#option1').setAttribute('data-id', answer == 1 ? current.id : 0);
	document.querySelector('#option1').innerText = answer == 1 ? current.name : otherOptions[0];
	document.querySelector('#option2').setAttribute('data-id', answer == 2 ? current.id : 0);
	document.querySelector('#option2').innerText = answer == 2 ? current.name : otherOptions[1];
	document.querySelector('#option3').setAttribute('data-id', answer == 3 ? current.id : 0);
	document.querySelector('#option3').innerText = answer == 3 ? current.name : otherOptions[2];
	
	document.querySelector('.friend-question').innerText = friendsMode ? 'Who is in this photo?' : '';
	if(friendsMode)
	{
		let ids = current.id.split('-');
		let options = profileList.filter(pl => ids.includes(pl.id)).map(p => p.name)
		.sort((a,b) => { return (Math.random() * 1) - 1; });
		let otherOptions = nameList
		.filter((name) => !options.includes(name))
		.sort((a,b) => { return (Math.random() * 2) - 1; });
		document.querySelector('#option1').innerText = answer == 1 ? options[0] : otherOptions[0];
		document.querySelector('#option2').innerText = answer == 2 ? options[0] : otherOptions[1];
		document.querySelector('#option3').innerText = answer == 3 ? options[0] : otherOptions[2];		
	}
}
function addUrlClause(url) {
	return "url('" + url + "')";
}

function endQuiz() {
	document.querySelector('.question').setAttribute('data-id', null);
	document.querySelector('.question').style.backgroundImage = '';
	document.querySelector('.friend-question').innerText = '';
	startTime = null;
	
	showResults();
	renderQuiz();
}


function showStage() {
	document.querySelector('.stage').innerText = (qNo+1) + '/' + totalQns;
}

function showResults() {
	document.querySelector('.stage').innerHTML = '';
	
	document.querySelector('.results').innerHTML = '';
	let message = document.createElement('h4');
	message.innerText = 'Your score is:';
	document.querySelector('.results').appendChild(message);
	let result = document.createElement('h1');
	result.innerText = score + '/' + totalQns;
	document.querySelector('.results').appendChild(result);
	if(timeChallenge)
	{
		let timeTaken = parseFloat(document.querySelector('.timer').innerText.replace('s',''));
		
		let time = document.createElement('h5');
		time.innerText = 'in ' + timeTaken + ' seconds';
		document.querySelector('.results').appendChild(time);
		
		if(window['highScore'] && window['highTime'])
		{
			let highScore = document.createElement('h4');
			highScore.innerText = 'High score: ' + window['highScore'] + '/' + totalQns + ' in ' + window['highTime'] + ' seconds';
			document.querySelector('.results').appendChild(highScore);
		}
		
		let newHighScore = document.createElement('h2');
		newHighScore.innerText = 'You beat your high score!';
		if(debugMode) console.log('newHighScore', window['highScore'], score);
		if(debugMode) console.log('highTime', window['highTime'], timeTaken);
		if(window['highScore'] < score || (window['highTime'] > timeTaken && window['highScore'] <= score))
		{
			window['highScore'] = score;
			window['highTime'] = timeTaken;
			document.querySelector('.results').appendChild(newHighScore);
		}
		if(!window['highScore'] || !window['highTime'])
		{
			window['highScore'] = score;
			window['highTime'] = parseFloat(document.querySelector('.timer').innerText.replace('s',''));
		}
	}
	
}

function initialiseTimer() {
	startTime = Date.now();
	updateTimer();
}

function updateTimer() {
	var now = Date.now();
	document.querySelector('.timer').innerText = ((now-startTime) / 1000).toFixed(2) + 's';
	
	if(startTime)
		setTimeout(updateTimer, 200);
	else
		document.querySelector('.timer').innerText = '';
}
