let mirrorFeatures = ["cutest","coolest","most beautiful","funniest","sexiest"];
let newList = [];

function getResultFromNames(module) {
	let categoryName = module.innerHTML;
    let text = document.getElementById("nameInput").value.trim();
	let nameList = text.split("\n");
	let result = document.getElementById("result1");
	if(!result.innerHTML.includes('flexi-input')) result.innerHTML = "";
	//if(document.getElementById("nameInput").name !== "Load People Name Preset") result.innerHTML = "Wrong list loaded!";
	if(nameList.length < 4) result.innerHTML = "List is too short! Minimum 4 names!";
	else if(text.length > 0)
	{
		newList = [];
		if(categoryName == "Dating")	
			result.innerHTML = "Would you rather go on a date with \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if(categoryName == "F**k Marry Kill")
			result.innerHTML = "Who would you rather f**k, marry or kill: \"" + generateName(nameList) + "\", \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if(categoryName == "Save")	
			result.innerHTML = "Who would you rather save first when both of them fell into the river \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"? (Assume both cannot swim)";
		else if(categoryName == "Mirror")
		{
			let mirrorFeature = mirrorFeatures[Math.floor(Math.random() * mirrorFeatures.length)];
			result.innerHTML = "Mirror, mirror, on the wall; Who is the " + mirrorFeature + " of them all? \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		}
		else if (categoryName == "Messager")
			result.innerHTML = "Would you rather exchange numbers and message every day with \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Hair")
			result.innerHTML = "Would you prefer long-haired \"" + generateName(nameList) + "\" or short-haired \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Last Round")
			result.innerHTML = "It's the last round of a board game. Who would you rather let win? \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"? (Assume both are tied)";
		else if (categoryName == "Bump")
			result.innerHTML = "Would you rather do a chest bump with \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Sweet Talk")
			result.innerHTML = "Would you rather say sweet nothings all day with \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Sweet Talk")
			result.innerHTML = "Would you rather say sweet nothings all day with \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Meal")
			result.innerHTML = "Would you rather treat \"" + generateName(nameList) + "\" to a meal at the restaurant or have a cheap takeaway meal with \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Housewife")
			result.innerHTML = "If \"" + generateName(nameList) + "\" came to you after your work from home and asked \"Would you rather have dinner, have a bath or me?\", what would you prefer?";
		else if (categoryName == "Day/Night")
			result.innerHTML = "Would you rather spend the day with \"" + generateName(nameList) + "\" or spend the night with \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Minutes/Seconds")
			result.innerHTML = "Would you rather have 2 minutes with \"" + generateName(nameList) + "\" or spend 2 seconds with \"" + generateName(nameList) + "\"?";
		else if (categoryName == "BFF")
			result.innerHTML = "Would you rather be BFFs with \"" + generateName(nameList) + "\" (and never be able to marry her) and/or marry \"" + generateName(nameList) + "\" (and let her be your sole partner forever)?";
		else if (categoryName == "Kidnap")
			result.innerHTML = "Who would you rather be kidnap for 24 hours and do anything with but nothing will be remembered? \"" + generateName(nameList) + "\" or \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Betrayal")
			result.innerHTML = "Would you rather stay with your current date \"" + generateName(nameList) + "\" or betray her and go date \"" + generateName(nameList) + "\"?";
		else if (categoryName == "Harem")
			result.innerHTML = "It's a harem!! Would you rather date \"" + generateName(nameList) + "\" who is your childhood friend, or \"" + generateName(nameList) + "\" who is your long lost step sibling, or \"" + generateName(nameList) + "\" who landed on top of you by accident, or \"" + generateName(nameList) + "\" who suddenly asked you out to confess to you?";
		else if(categoryName == "Custom")
		{
			if(result.innerHTML.includes('flexi-name')) {
				result.getElementsByClassName('flexi-name')[0].innerText = generateName(nameList);
				result.getElementsByClassName('flexi-name')[1].innerText = generateName(nameList);
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
				randomName1.innerText = generateName(nameList);
				holder.appendChild(randomName1);
							
				let text2 = document.createElement('span');
				text2.innerText = " or";
				holder.appendChild(text2);
				
				let input2 = document.createElement('input');
				input2.classList.add('flexi-input');
				holder.appendChild(input2);
				
				let randomName2 = document.createElement('span');
				randomName2.classList.add('flexi-name');
				randomName2.innerText = generateName(nameList);
				holder.appendChild(randomName2);
				
				let text3 = document.createElement('span');
				text3.innerText = "?";
				holder.appendChild(text3);
				
				result.appendChild(holder);
			}
			
		}
	}
	else
		result.innerHTML = "Please key in something!";
}

function generateName(nameList) {
	let newName = nameList[Math.floor(Math.random() * nameList.length)];
	
	while(newList.indexOf(newName) > -1)
	{
		newName = nameList[Math.floor(Math.random() * nameList.length)];
	}
	
	newList.push(newName);
	return censor(newName);
}

function censor(name) {
	//return name[0] + '*'.repeat(name.length - 2) + name.slice(-1);
	let checkbox = document.getElementById('censorName');
	if(checkbox.checked) return name[0] + name.slice(1).replace(/.(?=\S)/g, '*');
	return name;
}

function toggleCensor() {
	let checkbox = document.getElementById('censorName');
	
}

function getResultFromTitles(module) {
	let categoryName = module.innerHTML;
    let text = document.getElementById("nameInput").value.trim();
	let nameList = text.split("\n");
	let result = document.getElementById("result2");
	result.innerHTML = "";
	if(document.getElementById("nameInput").name !== "Load Show Titles Preset") result.innerHTML = "Wrong list loaded!";
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
	var categoryName = module.innerText;
    var text = document.getElementById("nameInput");
	var loadedText = "";
	
	if(categoryName == "Load People Name Preset")
		loadedText = document.getElementById("namesPreset").innerText;
	else if (categoryName == "Load Show Titles Preset")
		loadedText = document.getElementById("showsPreset").innerText;
	else if (categoryName == "Load People Sort Ranking")
		window.location.href = "seiyuu-sort-utf8.html";
	
	text.innerHTML = loadedText.split(",");
	text.name = module.innerText;
}
