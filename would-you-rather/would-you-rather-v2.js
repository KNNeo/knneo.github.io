//--CONFIG--//
const headerTitle = 'Would you rather...?';
const situations = [
	{
		moduleId: 'name',
		moduleTitle: 'Load People Name Preset', //used for button to load this as list
		categoryTitle: 'People Names', //to group all category buttons below
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
		],
	},
];
const presets = [
	{
		moduleId: 'name',
		moduleList: [
			"Hikasa Youko",
			"Yoshimura Haruka",
			"Satou Satomi",
			"Toyosaki Aki",
			"Tachibana Rika",
			"Fuchigami Mai",
			"Kayano Ai",
			"Numakura Manami",
			"Nagatsuma Juuri",
			"Komatsu Mikako",
			"Oozora Naomi",
			"Hanazawa Kana",
			"Taketatsu Ayana",
			"Ookubo Rumi",
			"Omigawa Chiaki",
			"Tomatsu Haruka",
			"Anzai Chika",
			"Kotobuki Minako",
			"Uesaka Sumire",
			"Touyama Nao",
			"Yuuki Aoi",
			"Lynn",
			"Kohara Konomi",
			"Oonishi Saori",
			"Koga Aoi",
			"Amamiya Sora",
			"Oono Yuuko",
			"Kouno Marika",
			"Takahashi Rie",
			"Isobe Karin",
			"Hidaka Rina",
			"Asakura Momo",
			"Waki Azumi",
			"Kitou Akari",
			"Tachibana Haru",
			"Toyota Moe",
			"Baba Fumika",
			"Minase Inori",
			"Hondo Kaede",
			"Natsukawa Shiina",
			"Kido Ibuki",
			"Kanno Mai",
			"Tomita Miyu",
			"Sasaki Nao",
			"Horie Yui",
			"Nagae Rika",
		],
	},
];

//--VARIABLES: DO NOT DELETE!--//
let mirrorFeatures = ["cutest","coolest","most beautiful","funniest","sexiest"];
let nameList = [];
let newList = [];

function getResultFromNames(module) {
	let moduleName = module.target.name;
	let categoryName = module.target.innerHTML;
    let text = document.getElementById("inputList").value.trim();
	let result = document.getElementById("nameResultBox");
	nameList = text.split("\n");
	if(!result.innerHTML.includes('flexi-input')) result.innerHTML = "";
	//if(document.getElementById("inputList").name !== "Load People Name Preset") result.innerHTML = "Wrong list loaded!";
	if(nameList.length < 4) result.innerHTML = "List is too short! Minimum 4 names!";
	else if(text.length > 0)
	{
		newList = [];
		if(categoryName == "Custom")
		{
			if(result.innerHTML.includes('flexi-name')) {
				result.getElementsByClassName('flexi-name')[0].innerText = generateName();
				result.getElementsByClassName('flexi-name')[1].innerText = generateName();
			}
			else {				
				let holder = document.createElement('div');
				
				let text1 = document.createElement('span');
				text1.innerText = "Would you rather";
				holder.appendChild(text1);
				
				let input1 = document.createElement('input');
				input1.classList.add('flexi-input');
				holder.appendChild(input1);
				
				let randomName1 = document.createElement('span');
				randomName1.classList.add('flexi-name');
				randomName1.innerText = generateName();
				holder.appendChild(randomName1);
							
				let text2 = document.createElement('span');
				text2.innerText = " or";
				holder.appendChild(text2);
				
				let input2 = document.createElement('input');
				input2.classList.add('flexi-input');
				holder.appendChild(input2);
				
				let randomName2 = document.createElement('span');
				randomName2.classList.add('flexi-name');
				randomName2.innerText = generateName();
				holder.appendChild(randomName2);
				
				let text3 = document.createElement('span');
				text3.innerText = "?";
				holder.appendChild(text3);
				
				result.appendChild(holder);
			}
		}
		else
			result.innerHTML = module.target.value
								.replace("{name}", generateName())
								.replace("{name}", generateName())
								.replace("{name}", generateName())
								.replace("{name}", generateName());
	}
	else
		result.innerHTML = "Please key in something!";
}

function displayOutput(categoryName) {
	switch(categoryName)
	{
		// case "Dating":
			// return "Would you rather go on a date with {name} or {name}?";
		// case "F**k Marry Kill":
			// return "Who would you rather f**k, marry or kill: {name}, {name} or {name}?";
		// case "Save":
			// return "Who would you rather save first when both of them fell into the river {name} or {name}? (Assume both cannot swim)";
		case "Mirror":
			let mirrorFeature = mirrorFeatures[Math.floor(Math.random() * mirrorFeatures.length)];
			return "Mirror, mirror, on the wall; Who is the " + mirrorFeature + " of them all? {name} or {name} or {name}?";
		// case "Messager":
			// return "Would you rather exchange numbers and message every day with {name} or {name}?";
		// case "Hair":
			// return "Would you prefer long-haired {name} or short-haired {name}?";
		case "Last Round":
			return "It the last round of a board game. Who would you rather let win? {name} or {name}? (Assume both are tied)";
		case "Bump":
			return "Would you rather do a chest bump with {name} or {name}?";
		case "Sweet Talk":
			return "Would you rather say sweet nothings all day with {name} or {name}?";
		case "Meal":
			return "Would you rather treat {name} to a meal at the restaurant or have a cheap takeaway meal with {name}?";
		case "Housewife":
			return "If {name} came to you after your work from home and asked \"Would you rather have dinner, have a bath or me?\", what would you prefer?";
		case "Day/Night":
			return "Would you rather spend the day with {name} or spend the night with {name}?";
		case "Minutes/Seconds":
			return "Would you rather have 2 minutes with {name} or spend 2 seconds with {name}?";
		case "BFF":
			return "Would you rather be BFFs with {name} (and never be able to marry her) and/or marry {name} (and let her be your sole partner forever)?";
		case "Kidnap":
			return "Who would you rather be kidnap for 24 hours and do anything with but nothing will be remembered? {name} or {name}?";
		case "Betrayal":
			return "Would you rather stay with your current date {name} or betray her and go date {name}?";
		case "Harem":
			return "It a harem!! Would you rather date {name} who is your childhood friend, or {name} who is your long lost step sibling, or {name} who landed on top of you by accident, or {name} who suddenly asked you out to confess to you?";
		case "Affair":
			return "Would you rather {name} be your wife while you have an affair with {name}? Or vice versa?";
		case "Island":
			return "You and {name} are stuck in an uninhabited island. Would you rather escape in a lifeboat only enough for one, try to call for rescue while waiting together, or procreate and start a new life?";
		case "Hug/Kiss":
			return "Would you rather receive a hug from {name} or receive a kiss on the cheek from {name}?";
		case "Morning":
			return "You were drunk last night and ended up on a bed naked in a hotel room the next morning. Would you rather {name} or {name} to be sleeping beside you?";
		case "Confessed":
			return "Would you rather be more surprised if {name} or {name} ended up liking you in the first place, way before you could've confessed to them?";
		case "BDSM":
			return "You are in a middle of a BDSM situation. Would you rather {name} be the sadist to you and {name} be the masochist or vice versa?";
		default:
			return "{name} or {name}?";
	}
}

function generateName() {
	let newName = nameList[Math.floor(Math.random() * nameList.length)];
	
	while(newList.indexOf(newName) > -1)
	{
		newName = nameList[Math.floor(Math.random() * nameList.length)];
	}
	
	newList.push(newName);
	return "\"" + censor(newName) + "\"";
}

function censor(name) {
	let checkbox = document.getElementById('censorName');
	if(checkbox != null && checkbox.checked) return name[0] + name.slice(1).replace(/.(?=\S)/g, '*');
	return name;
}

function toggleCensor() {
	let checkbox = document.getElementById('censorName');	
}

function getResultFromTitles(module) {
	let categoryName = module.innerHTML;
    let text = document.getElementById("inputList").value.trim();
	nameList = text.split("\n");
	let result = document.getElementById("result2");
	result.innerHTML = "";
	if(document.getElementById("inputList").name !== "Load Show Titles Preset") result.innerHTML = "Wrong list loaded!";
	else if(text.length > 0)
	{
		let name1 = nameList[Math.floor(Math.random() * nameList.length)];
		let name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		if(categoryName == "Forever")
			result.innerHTML = "What show would you rather watch for the rest of your life: \"" + name1 + "\" or \"" + name2 + "\"?";
		else if(categoryName == "Plot")
			result.innerHTML = "Which show has the best plot? \"" + name1 + "\" or \"" + name2 + "\"?";
		else if(categoryName == "Character")
			result.innerHTML = "Which show has the best characters? \"" + name1 + "\" or \"" + name2 + "\"?";
		else if(categoryName == "Cast")
			result.innerHTML = "Which show has the best cast of voice actors? \"" + name1 + "\" or \"" + name2 + "\"?";
	}
	else
		result.innerHTML = "Please key in something!";
}

function loadPreset(module) {
	var categoryName = module.target.id;
    var text = document.getElementById("inputList");
	var loadedText = "";
	
	if(categoryName == "peopleSortRankingInput")
		window.location.href = "seiyuu-sort-utf8.html";
	else 
		loadedText = presets.filter(p => p.moduleId == categoryName.replace('Input',''))[0].moduleList.toString();
	
	text.value = loadedText.replace(/,/g,'\n');
	text.name = module.target.innerText;
}


//--GENERATE HTML--//
window.onload = startup();

function startup() {
	let header = document.createElement('h1');
	header.innerText = headerTitle;
	document.body.appendChild(header);
	
	let inputModule = document.createElement('div');
	inputModule.id = 'input-module';
	
	let inputBox = document.createElement('div');
	inputBox.classList.add('input-box');
	
	let textInput = document.createElement('textarea');
	textInput.id = 'inputList';
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
		button.addEventListener('click', loadPreset);
		inputBox.appendChild(button);
	}
	
	let newline = document.createElement('br');
	inputBox.appendChild(newline);
	
	let button = document.createElement('button');
	button.id = 'peopleSortRankingInput';
	button.type = 'button';
	button.value = 'Submit';
	button.innerText = 'Load People Sort Ranking';
	button.addEventListener('click', loadPreset);
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
			resultCategory.addEventListener('click', getResultFromNames);
			showResult.appendChild(resultCategory);			
		}
		
		let resultBox = document.createElement('span');
		resultBox.id = result.moduleId + 'ResultBox';
		resultBox.classList.add('result-box');
		showResult.appendChild(resultBox);
		
		resultComponent.appendChild(showResult);
	}
	
	
	
	inputModule.appendChild(resultComponent);
	
	document.body.appendChild(inputModule);
	
	let settings = document.createElement('h3');
	settings.id = 'settings';
	settings.classList.add('settings');
		
		let back = document.createElement('a');
		back.href = '../index.html';
		back.innerText = 'Back';
		settings.appendChild(back);
	
		let darkmode = document.createElement('a');
		darkmode.id = 'darkmode';
		darkmode.title = 'Toggle Dark Mode';
		darkmode.classList.add('material-icons');
		darkmode.innerText = 'brightness_high';
		darkmode.href = 'javascript:void(0);';
		darkmode.addEventListener('click', toggleDarkMode);
		settings.appendChild(darkmode);
	
	document.body.appendChild(settings);
}