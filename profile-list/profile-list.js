//generate from json file
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    let profileList = JSON.parse(this.responseText);
    //code here
	if(generateProfileListFromJSON(profileList)) console.log('Load complete.');
  }
};
xmlhttp.open("GET", "profile-list.txt", true);
xmlhttp.send();

function generateProfileListFromJSON(profileList) {
	
}