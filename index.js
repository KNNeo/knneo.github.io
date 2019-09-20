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

function getResult() {
    var text = document.getElementById("nameInput").value.trim();
	if(text.length > 0)
		alert(text);
	else
		alert("Please key in something!");
}