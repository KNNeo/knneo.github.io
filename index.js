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
			var mirrorFeatures = ["cutest","coolest","most beautiful","funniest"];
			var mirrorFeature = mirrorFeatures[Math.floor(Math.random() * mirrorFeatures.length)];
			result.innerHTML = "Mirror, mirror, on the wall; Who is the " + mirrorFeature + " of them all? " + name1 + " or " + name2 + " or " + name3 + "?";
		}
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

/* on how to load csv file, add in here or another external js file
https://stackoverflow.com/questions/24172045/automatically-import-a-local-csv-file-with-javascript-or-jquery/24172885#24172885
*/
window.onload = function () { 
 //Check the support for the File API support 
 if (window.File && window.FileReader && window.FileList && window.Blob) {
    var fileSelected = document.getElementById('txtfiletoread');
    fileSelected.addEventListener('change', function (e) { 
         //Set the extension for the file 
         var fileExtension = /text.*/; 
         //Get the file object 
         var fileTobeRead = fileSelected.files[0];
        //Check of the extension match 
         if (fileTobeRead.type.match(fileExtension)) { 
             //Initialize the FileReader object to read the 2file 
             var fileReader = new FileReader(); 
             fileReader.onload = function (e) { 
                 var fileContents = document.getElementById('filecontents'); 
                 fileContents.innerText = fileReader.result; 
             } 
             fileReader.readAsText(fileTobeRead); 
         } 
         else { 
             alert("Please select text file"); 
         }
 
    }, false);
 } 
 else { 
     alert("Files are not supported"); 
 } 
}