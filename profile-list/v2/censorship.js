/*Objective: To create a seaprate function to run on Github to censor all unrelated data to display*/
let tableCensorFromRow = 10;
function censorData() {
	//remove all extra content in simplified view
	let profileBoxes = document.getElementsByClassName("profile-box");
	for (var profileBox of profileBoxes) {
		for(let p = tableCensorFromRow; p < profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr").length; p++) {
			profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[p].style.visibility = 'collapse';
		}
	}

	//remove all nicknames, if any
	for (var profileBox of profileBoxes) {
		var realName = profileBox.getElementsByClassName("profile-name")[0].parentElement.getElementsByTagName('span')[0].outerHTML;
		profileBox.getElementsByClassName("profile-name")[0].parentElement.innerHTML = realName;
	}
	
	//remove comments
	for (var profileBox of profileBoxes) {
		profileBox.innerHTML = profileBox.getElementsByClassName("profile-box-img")[0].outerHTML + profileBox.getElementsByTagName("table")[0].outerHTML;
	}
	
	//remove all asterisks
	for (var profileBox of profileBoxes) {
		profileBox.innerHTML = profileBox.innerHTML.replace('*','');
	}
}
//END