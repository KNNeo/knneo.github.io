for (var image of document.getElementsByTagName("img"))
{
 image.src = image.alt;
 image.alt = "";
}
var animeImgList = document.getElementsByTagName("img");
for (var i = 0; i < animeImgList.length; i++)
{
animeImgList[i].addEventListener("error", function() { this.onerror=null; this.src='https://knneo.github.io/resources/spacer.gif'; this.style.border = '0px white solid'; this.style.backgroundColor = 'transparent'; });
}
var animeLineList = document.getElementsByClassName("anime-line");
for (var j = 0; j < animeLineList.length; j++)
{
var animeLine = animeLineList[j];
var animeDetail = animeLineList[j].getElementsByClassName("anime-details-box")[0];
animeLine.addEventListener("dblclick", function() { animeDetail.style.display = "block"; } );
animeDetail.addEventListener("dblclick", function() { animeDetail.style.display = "none"; });
}
var animeYearList = document.getElementsByClassName("year-display");
for (var i = 0; i < animeYearList.length; i++)
{
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = i == animeYearList.length - 1 ? '400px' : 0;
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.visibility= i == animeYearList.length - 1 ? 'visible' : 'collapse';
animeYearList[i].parentElement.getElementsByClassName("anime-year")[0].style.transition = 'max-height 0.5s ease-in-out';
animeYearList[i].addEventListener("click", function() {
//close all
for(var openList of document.getElementsByClassName("anime-year")) {openList.style.maxHeight = 0; openList.style.visibility = 'collapse'; }
//open one
this.parentElement.getElementsByClassName("anime-year")[0].style.visibility = 'visible';
this.parentElement.getElementsByClassName("anime-year")[0].style.maxHeight = '400px';
});
}