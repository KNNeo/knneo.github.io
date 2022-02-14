//--SETTING--//
const debugMode = false; //shows logs
const totalQns = 10; //questions to show, cannot be more than provided list
const instructions = `
Instructions:
- Timed quiz based on profile list, see profile-list.json
`;

//--VARIABLE--//
let easyMode = localStorage.getItem('easyMode') == 'true';
let timeChallenge = !easyMode; //if true will preload images first, adds timer to quiz
let profileCategory = localStorage.getItem('profileCategory'); //category to filter profile list
let friendsMode = profileCategory == 'friends'; //allows images of friends to be included
let imageLimit = 10; //max images per profile to include, reads first x images in landscapes, portraits
let friendList = [];
let profileList = [];
//--READ JSON--//
if(profileListJson.length == 0) {
	let xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			profileListJson = JSON.parse(this.responseText);
			profileList = profileListJson.filter( function(n) {
				return friendsMode || n.category == profileCategory;
			});
			friendList = profileListJson.filter( function(n) {
				return n.category == 'friends';
			});

			//code here
			if(profileList != null) {
				defineNameList();
				if(localStorage.getItem('mode') == 'By Name') renderQuiz(true);
				if(localStorage.getItem('mode') == 'By Attributes') renderWordle(true);
			}
			
		}
	};
	xmlhttp.open("GET", "https://knneo.github.io/profile-list/profile-list-new.json", true);
	xmlhttp.send();
}
else {
	if(debugMode) console.log('Using test json');
	profileList = profileListJson.filter( function(n) {
		return n.category == profileCategory;
	});
	friendList = profileListJson.filter( function(n) {
		return n.category == 'friends';
	});
			
	defineNameList();
	if(localStorage.getItem('mode') == 'By Name') renderQuiz(true);
	if(localStorage.getItem('mode') == 'By Attributes') renderWordle(true);
}

//--FUNCTION--//
let preloads = [];
let preloaded = 0;
let imageList = [];
let nameList = [];
let quiz = [];
let qNo = 0;
let score = 0;
let startTime;
function toggleSettings() {
	if(document.querySelector('.settings') != null)
	{
		document.querySelector('.setting-icon').innerText = 'settings';
		let container = document.querySelector('.settings');
		container.classList.remove('settings');
		container.innerHTML = '';
		renderQuiz(true);
	}
	else
	{
		document.querySelector('.setting-icon').innerText = 'home';
		let container = document.querySelector('.instructions');
		container.classList.add('settings');
		container.innerHTML = '';
		
		//easy mode: if true removes time challenge, high score, removes option if wrong answer
		let easyMode = document.createElement('div');
		easyMode.innerText = 'Easy Mode ';
		
		let easyModeCheckbox = document.createElement('input');
		easyModeCheckbox.type = 'checkbox';
		easyModeCheckbox.checked = localStorage.getItem('easyMode') == 'true';
		easyModeCheckbox.onclick = function(e) {
			if(localStorage.getItem('easyMode') == null)
				localStorage.setItem('easyMode', easyMode);
			let val = localStorage.getItem('easyMode') == 'true';
			localStorage.setItem('easyMode', !val);
			
			// easyMode = !val;
			// timeChallenge = !easyMode;
			location.reload();
		};
		
		easyMode.appendChild(easyModeCheckbox);
		container.appendChild(easyMode);
		
		//profile category: selection of dataset
		let profileCategory = document.createElement('div');
		profileCategory.innerText = 'Dataset Category ';
		
		let categories = profileListJson.filter(val => val.image || val.portraits || val.landscapes).filter((val, index, arr) => arr.map(a => a.category).indexOf(val.category) === index).map(p => p.category);
		for(let category of categories)
		{
			let profileCategoryCheckbox = document.createElement('button');
			profileCategoryCheckbox.classList.add('profile-category');
			profileCategoryCheckbox.innerText = category;
			if(localStorage.getItem('profileCategory') == category)
				profileCategoryCheckbox.disabled = true;
			profileCategoryCheckbox.addEventListener('click', function(e) {
				if(localStorage.getItem('profileCategory') == null)
					localStorage.setItem('profileCategory', 'profile');
				localStorage.setItem('profileCategory', this.innerText);
				localStorage.setItem('mode', 'By Name');
				
				location.reload();
			});
			profileCategory.appendChild(profileCategoryCheckbox);
		}

		container.appendChild(profileCategory);
		
		if(localStorage.getItem('profileCategory') == 'seiyuu')
		{
			//mode: identification by profile name, based on profile attributes
			let modeDiv = document.createElement('div');
			modeDiv.innerText = 'Mode ';
			
			let modes = ['By Name', 'By Attributes'];
			for(let mode of modes)
			{
				let profileCategoryCheckbox = document.createElement('button');
				profileCategoryCheckbox.classList.add('profile-category');
				profileCategoryCheckbox.innerText = mode;
				if(localStorage.getItem('mode') == mode)
					profileCategoryCheckbox.disabled = true;
				profileCategoryCheckbox.addEventListener('click', function(e) {
					if(localStorage.getItem('mode') == null)
						localStorage.setItem('mode', 'By Name');
					localStorage.setItem('mode', this.innerText);
					
					location.reload();
				});
				modeDiv.appendChild(profileCategoryCheckbox);
			}

			container.appendChild(modeDiv);
		}
		
	}
	
}

function defineNameList() {
	
	if(friendsMode)
	{
		for(let friend of friendList) {
			let names = friend.id.split('-');
			imageList.push({
				image:friend.image,
				name: profileList.filter(pl => names.includes(pl.id)).map(p => p.name),
				id: friend.id,
			});
		}	
	}
	
	for(let profile of profileList) {
			let landscapes = profile.landscapes ? profile.landscapes.slice(0,imageLimit) : [];
			let portraits = profile.portraits ? profile.portraits.slice(0,imageLimit) : [];
			let allImages = landscapes.concat(portraits);
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
			
			if(allImages.length > 0)
				nameList.push(name);
			
	}
	
	if(debugMode) console.log(imageList);
	if(debugMode) console.log(nameList);
}

//-- QUIZ MODE--//
function renderQuiz(isFirstLoad) {
	if(isFirstLoad)
	{
		document.querySelector('.title').innerText = friendsMode ? '女性プロフィール友達クイズ' : '女性プロフィールクイズ';
	}

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
	if(profileList.length < 1)
	{
		document.querySelector('#option2').style.display = 'none';
		document.querySelector('.instructions').innerText = 'Select a category in settings';
	}
}

function onOptionClick(mode) {
	if(localStorage.getItem('mode') == 'By Attributes')
	{
		onGuessClick(mode);
		return;
	}
	
	if(easyMode)
		mode.style.display = 'none';
	//option must have data-id to add score
	let answer = document.querySelector('.question').getAttribute('data-id');
	if(!friendsMode && mode.getAttribute('data-id') != null && mode.getAttribute('data-id') == answer)
	{
		if(debugMode) console.log('score', mode.getAttribute('data-id'), answer);
		score++;
		if(easyMode)
		{
			quizStep(mode.innerText);
			return;
		}
	}
	if(friendsMode && mode.getAttribute('data-id') != null && mode.getAttribute('data-id').includes(answer))
	{
		if(debugMode) console.log('score', mode.getAttribute('data-id'), answer);
		score++;
		if(easyMode)
		{
			quizStep(mode.innerText);
			return;
		}
	}
	
	if(timeChallenge || mode.innerText.toLowerCase().includes('start'))
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
	if(imageList.length == 0)
	{
		console.error('Unable to start quiz: no values in imageList');
		return;
	}
	if(timeChallenge)
	{
		document.querySelector('.instructions').innerText = 'Loading...';
	}
	
	//populate questions
	preloaded = 0;
	preloads = [];
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
		
		let preload = new Image();
		preload.src = imageList[index].image;
		preload.addEventListener('load', function() {
			preloaded++;
		});
		preloads.push(preload);
	}
	
	awaitNextQuestion();
}

function awaitNextQuestion() {
	if(debugMode) console.log('awaitNextQuestion', preloaded, preloads.length);
	document.querySelector('#option2').disabled = true;
	if(preloaded >= preloads.length)
	{
		document.querySelector('#option2').disabled = false;
		if(timeChallenge)
		{
			initialiseTimer();
		}
		nextQuestion();
	}
	else
	{
		setTimeout(awaitNextQuestion, 200);
	}
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
	
	let image = document.createElement('div');
	image.classList.add('image');
	image.style.height = '100%';
	image.style.backgroundImage = addUrlClause(current.image);
	// image.addEventListener('error', function() {
		// if(debugMode) console.log('image not found, generating new question');
		// nextQuestion();
	// });
	image.style.backgroundSize = 'contain';
	image.style.backgroundRepeat = 'no-repeat';
	image.style.backgroundPosition = 'center';
	
	document.querySelector('.question').appendChild(image);	
	
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

//-- WORDLE MODE --//
function renderWordle(isFirstLoad) {
	if(isFirstLoad)
	{
		document.querySelector('.title').innerText = 'WORDLE';
	}

	//option2 button is start	
	document.querySelector('#option1').style.display = 'none';
	document.querySelector('#option2').style.display = '';
	document.querySelector('#option2').innerText = 'Guess';
	document.querySelector('#option3').style.display = 'none';
	
	// if(isFirstLoad)
		// document.querySelector('.instructions').innerText = instructions;
	
	if(isFirstLoad)
	{
		if(localStorage.getItem('played') != new Date().getDay())
			localStorage.setItem('played', '');
			
		if(localStorage.getItem('played') == '' || localStorage.getItem('answer') == '')
		{
			setAnswer();
			localStorage.setItem('played', new Date().getDay());
		}

	}
	
	if(isFirstLoad && localStorage.getItem('wordle') == '')
	{
		localStorage.setItem('wordle', JSON.stringify([
			['year', 'month', 'singer', 'swimsuit', 'married', 'guess'],
			[null,null,null,null,null,null],
			[null,null,null,null,null,null],
			[null,null,null,null,null,null],
			[null,null,null,null,null,null],
			[null,null,null,null,null,null],
			[null,null,null,null,null,null]
		]));
	}
	
	//generate grid
	let [table, ended] = generateGrid();
	document.querySelector('.question').appendChild(table);
	
	let input = document.createElement('select');
	input.id = 'guess';
	
		let option = document.createElement('option');
		option.value = '';
		
		for(let profile of profileList.sort((a,b) => { return a.name.localeCompare(b.name); }))
		{
			option = document.createElement('option');
			option.value = profile.id;
			option.innerText = profile.name;
			input.appendChild(option);
		}
	
	document.querySelector('.selection').appendChild(input);
	document.querySelector('#guess').value = document.querySelector('option').value;
	
	if(ended)
		endGuess();
}

let statuses = {
	"R": "gray",
	"Y": "yellow",
	"G": "green"
};
function generateGrid() {
	let grid = JSON.parse(localStorage.getItem('wordle'));
	
	let ended = false;
	
	let table = document.createElement('table');
	table.id = 'grid';
	table.style.margin = 'auto';
	table.style.left = '0';
	table.style.right = '0';
	
	let body = document.createElement('tbody');
	
	for(let col = 0; col < 7; col++)
	{
		let tr = document.createElement('tr');
		for(let row = 0; row < 6; row++)
		{
			let td = document.createElement(col > 0 ? 'td' : 'th');
			td.style.width = '60px';
			td.style.height = '35px';
			td.style.border = '1px solid white';
			if(col == 0 || row == 5) td.innerText = grid[col][row];
			else if(col > 0) td.style.backgroundColor = statuses[grid[col][row] || 'transparent'];
			
			tr.appendChild(td);
		}
		body.appendChild(tr);
		
		if(grid[col][0] == 'G' && grid[col][1] == 'G' && grid[col][2] == 'G' && grid[col][3] == 'G' && grid[col][4] == 'G')
			ended = true;
		else if(grid[col][0] != null && col == 6)
			ended = true;
	}
	table.appendChild(body);
	
	return [table, ended];
}

function onGuessClick(mode) {
	// let cells = document.querySelector('#grid').querySelectorAll('td');
	let selection = document.querySelector('#guess').value;
	let selectionProfile = profileList.find(p => p.id == selection);
	let answer = localStorage.getItem('answer');
	let answerProfile = profileList.find(p => p.id == answer);
	//if(debugMode) 
		// console.log(selectionProfile, answerProfile);
	
	let grid = JSON.parse(localStorage.getItem('wordle'));
	let newGrid = grid;
	
	let answered = 0;
	let category = [];
	for(let col = 0; col < 7; col++)
	{
		for(let row = 0; row < 6; row++)
		{
			if(col == 0)
			{
				category.push(grid[col][row]);
				continue;
			}
			if(newGrid[col][row] != null) break;
			if(answered > 0 && answered != col) break;
			
			answered = col;
			
			if(category[row] == 'year')
			{
				if(selectionProfile.dob.substring(0, 4) == answerProfile.dob.substring(0, 4))
					newGrid[col][row] = "G";
				else
					newGrid[col][row] = "R";
					
			}
			
			if(category[row] == 'month')
			{
				if(selectionProfile.dob.substring(5, 7) == answerProfile.dob.substring(5, 7))
					newGrid[col][row] = "G";
				else
					newGrid[col][row] = "R";
					
			}
			
			if(category[row] == 'singer')
			{
				if(processOption(selectionProfile.turningPoint.soloDebut, true) == processOption(answerProfile.turningPoint.soloDebut, true))
					newGrid[col][row] = "G";
				else
					newGrid[col][row] = "R";
			}
			
			if(category[row] == 'swimsuit')
			{
				if(processOption(selectionProfile.turningPoint.swimsuitPhotobook, true) == processOption(answerProfile.turningPoint.swimsuitPhotobook, true))
					newGrid[col][row] = "G";
				else
					newGrid[col][row] = "R";
			}
			
			if(category[row] == 'married')
			{
				if(processOption(selectionProfile.turningPoint.isMarried, true) == processOption(answerProfile.turningPoint.isMarried, true))
					newGrid[col][row] = "G";
				else
					newGrid[col][row] = "R";
			}
			
			if(newGrid[col][row] == null && row == 5) newGrid[col][row] = selectionProfile.name;
			if(newGrid[col][row] == null) newGrid[col][row] = "R";
		}
	}
	
	localStorage.setItem('wordle', JSON.stringify(newGrid));
	
	//generate grid
	document.querySelector('.question').innerHTML = '';
	let [table, ended] = generateGrid();
	document.querySelector('.question').appendChild(table);
	
	if(ended)
		endGuess();
}

function endGuess() {
	// localStorage.setItem('played', new Date().getDay());
	document.querySelector('.stage').innerText = 'Try again tomorrow! Hours remaining: ' + (24 - new Date().getHours());
	document.querySelector('#option2').style.display = 'none';
	document.querySelector('#guess').value = localStorage.getItem('answer');
	document.querySelector('#guess').disabled = true;
}

function setAnswer() {
	let no = Math.floor(Math.random() * profileList.length);
	localStorage.setItem('answer', profileList[no].id);
	localStorage.setItem('wordle', '');
}

function processOption(option, returnBool) {
	if(returnBool)
		return option.includes('Yes') ? true : false;
	return option.replace('[1]','').replace('[2]','').replace('[3]','');
}

function resetGuess() {
	localStorage.removeItem('wordle');
	localStorage.removeItem('played');
	localStorage.removeItem('answer');
	
}
