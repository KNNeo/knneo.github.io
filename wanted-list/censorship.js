/*Objective: To create a seaprate function to run on Github to censor all unrelated data to display*/

//remove all content besides first four rows of each profile box table
let profileBoxes = document.getElementsByClassName("profile-box");
for(var profileBox of profileBoxes)
{
	while(profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[4] != undefined) {
		profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[4].remove();
	}
}
//document.getElementsByClassName("profile-box")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[4].remove();
//while [4] is not undefined, remove

//remove all nicknames, if any
for(var profileBox of profileBoxes)
{
	profileBox.getElementsByClassName("profile-name")[0].parentElement.innerHTML = profileBox.getElementsByClassName("profile-name")[0].innerHTML;
}
//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].innerHTML;
//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].parentElement.innerHTML;
//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].parentElement.innerHTML = //document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].innerHTML;

//remove comments
for(var profileBox of profileBoxes)
{
	profileBox.innerHTML = profileBox.getElementsByClassName("profile-box-img")[0].outerHTML + profileBox.getElementsByTagName("table")[0].outerHTML;
}
//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-box-img")[0].innerHTML;
//document.getElementsByClassName("profile-box")[0].getElementsByTsgName("table")[0].innerHTML;
//document.getElementsByClassName("profile-box")[0].innerHTML = document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-box-img")[0].outerHTML + document.getElementsByClassName("profile-box")[0].getElementsByTagName("table")[0].outerHTML;

//END