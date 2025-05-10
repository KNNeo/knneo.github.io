//--DEFAULT SETTINGS--//
const config = {
    keepLinks: false
};

//--DOM NODE REFERENCES--//
let sourceTextArea = document.querySelector('textarea#source');
let destTextArea = document.querySelector('textarea#dest');
let messageSpan = document.querySelector('span.message');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function toggleKeepLinks() {
    switch(event.target.innerText) {
        case 'insert_link':
            event.target.innerText = 'link_off';
            event.target.title = 'Remove Links In Tables';
            config.keepLinks = false;
            break;
        default:
            event.target.innerText = 'insert_link';
            event.target.title = 'Keep Links In Tables';
            config.keepLinks = true;
            break;
    }
}

function onButtonClick(event) {
    switch(event.target.title) {
        case 'Convert':
            onConvert();
            break;
        case 'Copy':
            onCopy();
            break;
        default:
            alert('Invalid Command!');
            break;
    }
}

function onConvert() {
    if(!sourceTextArea.value)
        alert('Fill in something for source HTML!');
    else if(!sourceTextArea.value.includes('<table'))
        alert('No table tag found! This will only detect tables!');
    else if(sourceTextArea.value.includes('class="carousel"'))
        alert('Carousel already set! Remove if meant to create new!');
    else
        destTextArea.value = createCarousel(sourceTextArea.value);
}

function onCopy() {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(destTextArea.value);
        messageSpan.innerText = 'Copied to clipboard!';
        destTextArea.value = '';
        setTimeout(function() {
            messageSpan.innerText = '';
        }, 1000);
    }
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
            if(!config.keepLinks) {
                let elem = removeLinksInImages(link);
                if(elem) {
                    link.parentElement.appendChild(elem);
                    link.parentElement.removeChild(link);
                }
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
