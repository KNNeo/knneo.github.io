//--DEFAULT SETTINGS--//
const config = {};

//--DOM NODE REFERENCES--//
let sourceTextArea = document.querySelector('textarea#source');
let destTextArea = document.querySelector('textarea#dest');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function onButtonClick(event) {
    if(!sourceTextArea.value)
        alert('Fill in something for source HTML!');
    else if(!sourceTextArea.value.includes('<table'))
        alert('No table tag found! This will only detect tables!');
    else if(sourceTextArea.value.includes('class="carousel"'))
        alert('Carousel already set! Remove if meant to create new!');
    else
        destTextArea.value = createCarousel(sourceTextArea.value);
}

//--FUNCTIONS--//
function createCarousel(input) {
    let temp = document.createElement('div');
    temp.innerHTML = input;
    let output = document.createElement('div');
    output.className = 'carousel';
    let counter = 0;
    for(let table of temp.querySelectorAll('table')) {
        let item = document.createElement('div');
        item.className = 'carousel-item';
        if(counter++ > 0) item.classList.add('hide');
        for(let link of table.querySelectorAll('a')) {
            let elem = removeLinksInImages(link);
            if(elem) {
                link.parentElement.appendChild(elem);
                link.parentElement.removeChild(link);
            }
        }
        item.innerHTML = table.outerHTML;
        output.appendChild(item);
    }
    return output.outerHTML.replace(/\n/g, '');
}

function removeLinksInImages(link) {
    // assume one link one image
    let image = link.querySelector('img');
    return image;
}

//--INITIAL--//
function startup() {
}
