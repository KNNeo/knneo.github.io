for (var image of document.getElementsByTagName("img")) {
    image.src = image.alt;
    image.alt = "";
}
var animeImgList = document.getElementsByTagName("img");
for (var i = 0; i < animeImgList.length; i++) {
    animeImgList[i].addEventListener("error", function() {
        this.onerror = null;
        this.src = 'https://knneo.github.io/resources/spacer.gif';
        this.style.border = '0px white solid';
        this.style.backgroundColor = 'transparent';
    });
}
var animeLineList = document.getElementsByClassName("anime-line");
for (var j = 0; j < animeLineList.length; j++) {
    var animeLine = animeLineList[j];
    var animeDetail = animeLineList[j].getElementsByClassName("anime-details-box")[0];
    animeLine.addEventListener("dblclick", function() {
        animeDetail.style.display = "block";
    });
    animeDetail.addEventListener("dblclick", function() {
        animeDetail.style.display = "none";
    });
}
var animeYearList = document.getElementsByClassName("year-display");
for (var i = 0; i < animeYearList.length; i++) {
    animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = i == animeYearList.length - 1 ? '400px' : 0;
    animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.visibility = i == animeYearList.length - 1 ? 'visible' : 'collapse';
    animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.transition = 'max-height 0.5s ease-in-out';
    animeYearList[i].addEventListener("click", function() {
      	//turn off show all
      if(document.getElementById("showAll").checked)
      document.getElementById("showAll").click();
        //close all
        for (var openList of document.getElementsByClassName("anime-year")) {
            openList.style.maxHeight = 0;
            openList.style.visibility = 'collapse';
        }
        //open one
        this.parentElement.getElementsByClassName("anime-year")[0].style.visibility = 'visible';
        this.parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = '400px';
    });
}
document.getElementById("showAll").addEventListener("click", function() {
  let checked = this.checked;
  for (var openList of document.getElementsByClassName("anime-year")) {
    		if(!checked) {
            openList.style.maxHeight = 0;
            openList.style.visibility = 'collapse';
            }
    		else {
            openList.style.maxHeight = '';
            openList.style.visibility = 'visible';
            }
        }
  
	let animeYearList = document.getElementsByClassName("year-display");
        for (var openList of animeYearList) {
    		if(!checked) {
            openList.classList.remove('text-expanded');
            }
    		else {
            openList.classList.add('text-expanded');
            }
        }
	let latestYear = animeYearList[animeYearList.length-1];
    latestYear.parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = '400px';
    latestYear.parentElement.getElementsByClassName("anime-year")[0].style.visibility = 'visible';
});
document.getElementById("showAll").click();