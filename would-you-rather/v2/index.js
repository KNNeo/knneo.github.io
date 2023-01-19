//--CONFIG--//
const headerTitle = 'Would you rather...?';
const situations = [
	{
		moduleId: 'name', //unique id, also used to identify term in each queryString in categories
		moduleTitle: 'Load Names Preset', //used for button to load this as list
		moduleList: ['Kasumi','Honoka','Marie Rose','Ayane','Kokoro','Hitomi','Momiji','Helena','Misaki','Luna','Tamaki','Leifan','Fiona','Nagisa','Monica','Sayuri','Patty','Tsukushi','Loberia','Nanami','Elise','Koharu','Tina','Amy','Shandy'], //preloaded list
		categoryTitle: 'Names', //to group all category buttons below
		categories: [
			{
				queryTitle: 'Dating', //button title
				//queryString must correspond with one or more {moduleId} within each module
				queryString: "Would you rather go on a date with {name} or {name}?",
			},
			{
				queryTitle: 'F**k Marry Kill',
				queryString: "Who would you rather f**k, marry or kill: {name}, {name} or {name}?",
			},
			{
				queryTitle: 'Save',
				queryString: "Who would you rather save first when both of them fell into the river {name} or {name}? (Assume both cannot swim)",
			},
			{
				queryTitle: 'Messager',
				queryString: "Would you rather exchange numbers and message every day with {name} or {name}?",
			},
			{
				queryTitle: 'Hair',
				queryString: "Would you prefer long-haired {name} or short-haired {name}?",
			},
			{
				queryTitle: 'Last Round',
				queryString: "It the last round of a board game. Who would you rather let win? {name} or {name}? (Assume the game at this point is a tie)",
			},
			{
				queryTitle: 'Bump',
				queryString: "Would you rather do a chest bump with {name} or {name}?",
			},
			{
				queryTitle: 'Sweet Talk',
				queryString: "Would you rather say sweet nothings all day with {name} or {name}?",
			},
			{
				queryTitle: 'Meal',
				queryString: "Would you rather treat {name} to a meal at a fancy restaurant or have a cheap takeaway meal by the street with {name}?",
			},
			{
				queryTitle: 'Housewife',
				queryString: "You reached home after a day's work, and {name} welcomes you back. Would you rather have a bath, have dinner, or...?",
			},
			{
				queryTitle: 'Day/Night',
				queryString: "Would you rather spend the day with {name} or spend the night with {name}?",
			},
			{
				queryTitle: 'Minutes/Seconds',
				queryString: "Would you rather have 2 minutes with {name} or spend 2 seconds with {name}?",
			},
			{
				queryTitle: 'BFF',
				queryString: "Would you rather be BFFs with {name} (and never be able to marry her) and marry {name} (and let her be your sole partner forever), or vice versa?",
			},
			{
				queryTitle: 'Kidnap',
				queryString: "Who would you rather kidnap for 24 hours and do anything with but nothing will be remembered? {name} or {name}?",
			},
			{
				queryTitle: 'Betrayal',
				queryString: "Would you rather stay with your current date {name} or betray her and go date {name}?",
			},
			{
				queryTitle: 'Harem',
				queryString: "It's a harem!! Would you rather date {name} who is your childhood friend, or {name} who is your long lost step sibling, or {name} who landed on top of you by accident, or {name} who suddenly asked you out to confess to you?",
			},
			{
				queryTitle: 'Affair',
				queryString: "Would you rather {name} be your wife while you have an affair with {name}? Or vice versa?",
			},
			{
				queryTitle: 'Island',
				queryString: "You and {name} are stuck in an uninhabited island. Would you rather escape in a lifeboat only enough for one, try to call for rescue while waiting together, or procreate and start a new life?",
			},
			{
				queryTitle: 'Hug/Kiss',
				queryString: "Would you rather receive a hug from {name} or receive a kiss on the cheek from {name}?",
			},
			{
				queryTitle: 'Morning',
				queryString: "You were drunk last night and ended up on a bed naked in a hotel room the next morning. Would you rather {name} or {name} to be sleeping beside you?",
			},
			{
				queryTitle: 'Confessed',
				queryString: "Would you rather be more surprised if {name} or {name} ended up liking you in the first place, way before you could've confessed to them?",
			},
			{
				queryTitle: 'BDSM',
				queryString: "You are in a middle of a BDSM situation. Would you rather {name} be the sadist to you and {name} be the masochist or vice versa?",
			},
			{
				queryTitle: 'Blanket',
				queryString: "It was a chilly and thunderous night. Would you rather {name} or {name} be sleeping under the same blanket with you on the bed?",
			},
			{
				queryTitle: 'Pick-up',
				queryString: "You were suddenly teleported away into someone's way home. Would you rather {name} or {name} pick you up when you were lost and had no way home?",
			},
			{
				queryTitle: 'Siblings',
				queryString: "Your single parent has remarried with someone else's single parent. Would you rather your new step sibling be {name}, {name} or {name}?",
			},
			{
				queryTitle: 'Food',
				queryString: "You can only afford a single serving of snacks for the you and {name}. Would you rather take a bite first (and watch them take a bite) or later (after they took one)?",
			},
			{
				queryTitle: 'Breakup',
				queryString: "You have been dating with two people right now, it's due time before something happens. Would you rather breakup with {name} or {name}?",
			},
		],
	},
];

//--FUNCTIONS--//
function onInputClick(module) {
	var categoryName = module.target.id;
    var text = document.getElementById('input-list');
	var loadedText = '';
	
	if(categoryName == 'peopleSortRankingInput')
		window.location.href = 'seiyuu-sort-utf8.html';
	else 
		loadedText = situations.filter(p => p.moduleId == categoryName.replace('Input',''))[0].moduleList.toString();
	
	text.value = loadedText.replace(/,/g,'\n');
	text.name = module.target.innerText;
}

function onResultClick(module) {
	let moduleName = module.target.name;
	let categoryName = module.target.innerHTML;
    let text = document.getElementById('input-list').value.trim();
	let result = document.getElementById('nameResultBox');
	window['name-list'] = text.split('\n');
	if(!result.innerHTML.includes('flexi-input')) result.innerHTML = '';
	if(window['name-list'].length < 4) result.innerHTML = 'List is too short! Minimum 4 names!';
	else if(text.length > 0)
	{
		window['temp'] = [];
		if(categoryName == 'Custom')
		{
			if(result.innerHTML.includes('flexi-name')) {
				result.getElementsByClassName('flexi-name')[0].innerText = generateTerm();
				result.getElementsByClassName('flexi-name')[1].innerText = generateTerm();
			}
			else {				
				let holder = document.createElement('div');
				
				let text1 = document.createElement('span');
				text1.innerText = 'Would you rather';
				holder.appendChild(text1);
				
				let input1 = document.createElement('input');
				input1.classList.add('flexi-input');
				holder.appendChild(input1);
				
				let randomName1 = document.createElement('span');
				randomName1.classList.add('flexi-name');
				randomName1.innerText = generateTerm();
				holder.appendChild(randomName1);
							
				let text2 = document.createElement('span');
				text2.innerText = ' or';
				holder.appendChild(text2);
				
				let input2 = document.createElement('input');
				input2.classList.add('flexi-input');
				holder.appendChild(input2);
				
				let randomName2 = document.createElement('span');
				randomName2.classList.add('flexi-name');
				randomName2.innerText = generateTerm();
				holder.appendChild(randomName2);
				
				let text3 = document.createElement('span');
				text3.innerText = '?';
				holder.appendChild(text3);
				
				result.appendChild(holder);
			}
		}
		else
			result.innerHTML = module.target.value
								.replace('{name}', generateTerm())
								.replace('{name}', generateTerm())
								.replace('{name}', generateTerm())
								.replace('{name}', generateTerm());
	}
	else
		result.innerHTML = 'Please key in something!';
}

function generateTerm() {
	let newName = window['name-list'][Math.floor(Math.random() * window['name-list'].length)];
	
	while(window['temp'].indexOf(newName) > -1)
	{
		newName = window['name-list'][Math.floor(Math.random() * window['name-list'].length)];
	}
	
	window['temp'].push(newName);
	return '\"' + newName + '\"';
}

//--STARTUP--//
window.addEventListener('load', function() {
	initializeVariables();
	generateContent();
});

function initializeVariables() {
	window['name-list'] = [];
}

function generateContent() {
	document.querySelector('.content').innerHTML = '';
	
	let header = document.createElement('h1');
	header.innerText = headerTitle;
	document.querySelector('.content').appendChild(header);
	
	let inputModule = document.createElement('div');
	inputModule.id = 'input-module';
	
	let inputBox = document.createElement('div');
	inputBox.classList.add('input-box');
	
	let textInput = document.createElement('textarea');
	textInput.id = 'input-list';
	textInput.rows = 10;
	textInput.cols = 50;
	textInput.placeholder = 'Input list of names here...';
	inputBox.appendChild(textInput);
	
	for(let preset of situations)
	{
		let button = document.createElement('button');
		button.id = preset.moduleId + 'Input';
		button.type = 'button';
		button.value = 'Submit';
		button.innerText = preset.moduleTitle;
		button.addEventListener('click', onInputClick);
		inputBox.appendChild(button);
	}
	
	let newline = document.createElement('br');
	inputBox.appendChild(newline);
	
	let button = document.createElement('button');
	button.id = 'peopleSortRankingInput';
	button.type = 'button';
	button.value = 'Submit';
	button.innerText = 'Load People Sort Ranking';
	button.addEventListener('click', onInputClick);
	inputBox.appendChild(button);
	
	inputModule.appendChild(inputBox);
	
	let resultComponent = document.createElement('div');
	
	for(let result of situations)
	{
		let showResult = document.createElement('div');
		showResult.classList.add('show-result');
		
		let categoryTitle = document.createElement('div');
		categoryTitle.classList.add('category-title');
		categoryTitle.innerText = result.categoryTitle;
		showResult.appendChild(categoryTitle);
			
		for(let situation of result.categories)
		{
			let resultCategory = document.createElement('button');
			resultCategory.name = result.moduleId;
			resultCategory.type = 'button';
			resultCategory.value = 'Submit';
			resultCategory.innerText = situation.queryTitle;
			resultCategory.value = situation.queryString;
			resultCategory.addEventListener('click', onResultClick);
			showResult.appendChild(resultCategory);			
		}
		
		let resultBox = document.createElement('span');
		resultBox.id = result.moduleId + 'ResultBox';
		resultBox.classList.add('result-box');
		showResult.appendChild(resultBox);
		
		resultComponent.appendChild(showResult);
	}
	
	inputModule.appendChild(resultComponent);
	
	document.querySelector('.content').appendChild(inputModule);
}