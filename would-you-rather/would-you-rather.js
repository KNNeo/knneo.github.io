function searchFunction() {
	// Declare starting variables 
	var input = document.getElementById("dbInput");
	var filter = input.value.toUpperCase();
	var table = document.getElementById("dbTable");
	var trs = table.tBodies[0].getElementsByTagName("tr");
	// Loop through rows
	for (var i = 1; i < trs.length; i++) {
		// Define the cells
		var tds = trs[i].getElementsByTagName("td");
		// hide the row
		trs[i].style.display = "none";
		// loop through row cells
		for (var i2 = 0; i2 < tds.length; i2++) {
			// if there's a match
			if (tds[i2].innerHTML.toUpperCase().indexOf(filter) > -1) {
			// show the row
			trs[i].style.display = "";
			// skip to the next row
			continue;
			}
		}
	}
}

function getResult(module) {
	var categoryName = module.innerHTML;
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result = document.getElementById("result1");
	result.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		var name3 = nameList[Math.floor(Math.random() * nameList.length)];
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
			var mirrorFeatures = ["cutest","coolest","most beautiful","funniest","sexiest"];
			var mirrorFeature = mirrorFeatures[Math.floor(Math.random() * mirrorFeatures.length)];
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
	}
	else
		result.innerHTML = "Please key in something!";
}

function getResult2() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result = document.getElementById("result2");
	result.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		result.innerHTML = "What would you rather watch for the rest of your life: \"" + name1 + "\" or \"" + name2 + "\"?";
	}
	else
		result.innerHTML = "Please key in something!";
}

function getResult3() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result = document.getElementById("result1");
	result.innerHTML = "";
	if(text.length > 0 && nameList.length >= 5)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		var name3 = nameList[Math.floor(Math.random() * nameList.length)];
		var name4 = nameList[Math.floor(Math.random() * nameList.length)];
		var name5 = nameList[Math.floor(Math.random() * nameList.length)];		
		result.innerHTML = "Hair from \"" + name1 + "\", face from \"" + name2 + "\", chest from \"" + name3 + "\", hips and waist from \"" + name4 + "\", legs from \"" + name5 + "\"";
	}
	else if (text.length <= 0)
		result.innerHTML = "Please key in something!";
	else
		result.innerHTML = "Minimum 5 names!";
}

function loadPreset(module) {
	var categoryName = module.innerHTML;
    var text = document.getElementById("nameInput");
	var loadedText = "";
	
	if(categoryName == "Load People Name Preset")
		loadedText = document.getElementById("namesPreset").innerText;
	else if (categoryName == "Load Show Titles Preset")
		loadedText = document.getElementById("showsPreset").innerText;
	else if (categoryName == "Load People Sort Ranking")
		window.location.href = "seiyuu-sort-utf8.html";
	
	text.innerHTML = loadedText.split(",");
}