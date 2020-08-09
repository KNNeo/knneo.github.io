/*Objective: To create a seaprate function to run on Github to censor all unrelated data to display*/
function censorData() {
	//remove all content besides first four rows of each profile box table
	let profileBoxes = document.getElementsByClassName("profile-box");
	for (var profileBox of profileBoxes) {
		// while (profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[8] != undefined) {
			// profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[8].remove();
		// }
		for(let p = 8; p < profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr").length; p++) {
			profileBox.getElementsByTagName("table")[0].getElementsByTagName("tr")[p].style.visibility = 'collapse';
		}
		//add listener for unhide, "See more..."
	}
	//document.getElementsByClassName("profile-box")[0].getElementsByTagName("table")[0].getElementsByTagName("tr")[4].remove();
	//while [4] is not undefined, remove

	//remove all nicknames, if any
	for (var profileBox of profileBoxes) {
		var realName = profileBox.getElementsByClassName("profile-name")[0].parentElement.getElementsByTagName('span')[0].outerHTML;
		profileBox.getElementsByClassName("profile-name")[0].parentElement.innerHTML = realName;
	}
	//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].innerHTML;
	//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].parentElement.innerHTML;
	//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].parentElement.innerHTML = //document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-name")[0].innerHTML;

	//remove comments
	for (var profileBox of profileBoxes) {
		profileBox.innerHTML = profileBox.getElementsByClassName("profile-box-img")[0].outerHTML + profileBox.getElementsByTagName("table")[0].outerHTML;
	}
	
	//remove all asterisks
	for (var profileBox of profileBoxes) {
		profileBox.innerHTML = profileBox.innerHTML.replace('*','');
	}
	
	//document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-box-img")[0].innerHTML;
	//document.getElementsByClassName("profile-box")[0].getElementsByTsgName("table")[0].innerHTML;
	//document.getElementsByClassName("profile-box")[0].innerHTML = document.getElementsByClassName("profile-box")[0].getElementsByClassName("profile-box-img")[0].outerHTML + document.getElementsByClassName("profile-box")[0].getElementsByTagName("table")[0].outerHTML;
	//have to call switch images again
	// var animeImgList = document.getElementsByTagName("img");
	// for (var i = 0; i < animeImgList.length; i++) {
	// animeImgList[i].addEventListener("error", function() {
	// if(this.nextElementSibling != null) this.nextElementSibling.style.display = "";
	// this.remove();
	// });
	// animeImgList[i].addEventListener("click", function() {
	// if(this.nextElementSibling == null && this.previousElementSibling == null) return;
	// if(this.style.display == "") this.style.display = "none"; else this.style.display = "";
	// if(this.nextElementSibling != null) this.nextElementSibling.style.display = this.nextElementSibling.style.display == "" ? "none" : "";
	// if(this.previousElementSibling != null) this.previousElementSibling .style.display = this.previousElementSibling .style.display == "" ? "none" : "";
	// });
	// if(animeImgList[i].nextElementSibling == null && animeImgList[i].previousElementSibling != null) animeImgList[i].style.display = "none";
	//batchResizeProfileBoxImg(animeImgList[i]);
	// }
}


//END