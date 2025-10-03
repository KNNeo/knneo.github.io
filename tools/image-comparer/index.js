//--DEFAULT SETTINGS--//
const config = {};

//--DOM NODE REFERENCES--//
const pageDiv = document.querySelector('div.page');
const foregroundImg = document.querySelector('img.foreground');
const backgroundImg = document.querySelector('img.background');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function toggleTransparent() {
    pageDiv.classList.toggle('see-thru');
}

function toggleAction() {
    pageDiv.classList.toggle('toggle');
}

function changeSource() {
    event.preventDefault();
    const newBg = prompt('For background image:', backgroundImg.src);
    if(newBg) backgroundImg.src = newBg;
    const newFg = prompt('For foreground image:', foregroundImg.src);
    if(newFg) foregroundImg.src = newFg;
}

//--FUNCTIONS--//


//--INITIAL--//
function startup() {
}
