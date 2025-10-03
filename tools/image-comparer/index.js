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
    let source = event.target.classList[0];
    switch(source) {
        case 'background':
            prompt('For background image:', backgroundImg.src);
            break;
        case 'foreground':
            prompt('For foreground image:', foregroundImg.src);
            break;
    }
}

//--FUNCTIONS--//


//--INITIAL--//
function startup() {
}
