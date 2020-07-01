function getResultFromNames(module) {
	let categoryName = module.innerHTML;
    let text = document.getElementById("nameInput").value.trim();
	let nameList = text.split("\n");
	let result = document.getElementById("result1");
	result.innerHTML = "";
	if(document.getElementById("nameInput").name !== "Load People Name Preset") result.innerHTML = "Wrong list loaded!";
	else if(text.length > 0)
	{
		let name1 = nameList[Math.floor(Math.random() * nameList.length)];
		let name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		let name3 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name3 == name2 || name3 == name1)
			name3 = nameList[Math.floor(Math.random() * nameList.length)];
		if(categoryName == "Dating")	
			result.innerHTML = "Would you rather go on a date with \"" + name1 + "\" or \"" + name2 + "\"?";
		else if(categoryName == "F**k Marry Kill")
			result.innerHTML = "Who would you rather f**k, marry or kill: \"" + name3 + "\", \"" + name1 + "\" or \"" + name2 + "\"?";
		else if(categoryName == "Save")	
			result.innerHTML = "Who would you rather save first when both of them fell into the river \"" + name1 + "\" or \"" + name2 + "\"? (*Assume both cannot swim)";
		else if(categoryName == "Mirror")
		{
			let mirrorFeatures = ["cutest","coolest","most beautiful","funniest","sexiest"];
			let mirrorFeature = mirrorFeatures[Math.floor(Math.random() * mirrorFeatures.length)];
			result.innerHTML = "Mirror, mirror, on the wall; Who is the " + mirrorFeature + " of them all? \"" + name1 + "\" or \"" + name2 + "\" or \"" + name3 + "\"?";
		}
		else if (categoryName == "Messager")
			result.innerHTML = "Would you rather exchange numbers and message every day with \"" + name1 + "\" or \"" + name2 + "\"?";
		else if (categoryName == "Hair")
			result.innerHTML = "Would you prefer long-haired \"" + name1 + "\" or short-haired \"" + name2 + "\"?";
		else if (categoryName == "Last Round")
			result.innerHTML = "It's the last round of a board game. Who would you rather let win? \"" + name1 + "\" or \"" + name2 + "\"? (Assume both are tied)";
		else if (categoryName == "Bump")
			result.innerHTML = "Would you rather do a chest bump with \"" + name1 + "\" or \"" + name2 + "\"?";
		else if (categoryName == "Sweet Talk")
			result.innerHTML = "Would you rather say sweet nothings all day with \"" + name1 + "\" or \"" + name2 + "\"?";
		else if (categoryName == "Sweet Talk")
			result.innerHTML = "Would you rather say sweet nothings all day with \"" + name1 + "\" or \"" + name2 + "\"?";
		else if (categoryName == "Meal")
			result.innerHTML = "Would you rather treat \"" + name1 + "\" to a meal at the restaurant or have a cheap takeaway meal with \"" + name2 + "\"? (Or vice versa?)";
		else if (categoryName == "Housewife")
			result.innerHTML = "If " + name1 + " came to you after your work from home and asked \"Would you rather have dinner, have a bath or me?\", what would you prefer?";
		else if (categoryName == "Day/Night")
			result.innerHTML = "Would you rather spend the day with " + name1 + " or spend the night with " + name2 + "?";
		else if (categoryName == "Minutes/Seconds")
			result.innerHTML = "Would you rather have 2 minutes with " + name1 + " or spend 2 seconds with " + name2 + "?";
	}
	else
		result.innerHTML = "Please key in something!";
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
