//Add event listeners


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

function getResult1() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result1 = document.getElementById("result1");
	result1.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		result1.innerHTML = "Would you rather go on a date with \"" + name1 + "\" or \"" + name2 + "\"?";

	}
	else
		result1.innerHTML = "Please key in something!";
}

function getResult2() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result1 = document.getElementById("result2");
	result1.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		result1.innerHTML = "What would you rather watch for the rest of your life: \"" + name1 + "\" or \"" + name2 + "\"?";
	}
	else
		result1.innerHTML = "Please key in something!";
}

function getResult3() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result1 = document.getElementById("result1");
	result1.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		var name3 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name3 == name2 || name3 == name1)
			name3 = nameList[Math.floor(Math.random() * nameList.length)];
		result1.innerHTML = "Who would you rather f**k, marry or kill: \"" + name3 + "\", \"" + name1 + "\" or \"" + name2 + "\"?";
	}
	else
		result1.innerHTML = "Please key in something!";
}

function getResult4() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result1 = document.getElementById("result1");
	result1.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		while(name2 == name1)
			name2 = nameList[Math.floor(Math.random() * nameList.length)];
		result1.innerHTML = "Who would you rather save first when both of them fell into the river \"" + name1 + "\" or \"" + name2 + "\"? (*Assume both cannot swim)";
	}
	else
		result1.innerHTML = "Please key in something!";
}

function getResult5() {
    var text = document.getElementById("nameInput").value.trim();
	var nameList = text.split("\n");
	var result1 = document.getElementById("result1");
	result1.innerHTML = "";
	if(text.length > 0)
	{
		var name1 = nameList[Math.floor(Math.random() * nameList.length)];
		var name2 = nameList[Math.floor(Math.random() * nameList.length)];
		var name3 = nameList[Math.floor(Math.random() * nameList.length)];
		var name4 = nameList[Math.floor(Math.random() * nameList.length)];
		var name5 = nameList[Math.floor(Math.random() * nameList.length)];		
		result1.innerHTML = "Hair from \"" + name1 + "\", face from \"" + name2 + "\", chest from \"" + name3 + "\", hips and waist from \"" + name4 + "\", legs from \"" + name5 + "\"";
	}
	else
		result1.innerHTML = "Please key in something!";
}

/* on how to load csv file, add in here or another external js file
https://stackoverflow.com/questions/24172045/automatically-import-a-local-csv-file-with-javascript-or-jquery/24172885#24172885
*/