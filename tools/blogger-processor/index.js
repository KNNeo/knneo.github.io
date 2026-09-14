//--DEFAULT SETTINGS--//
const config = {
    keepLinks: false,
    command: 'carousel',
    message: ''
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
    switch (event.target.innerText) {
        case 'insert_link':
            event.target.innerText = 'link_off';
            event.target.title = 'Remove Links In Tables';
            writeMessage(event.target.title);
            config.keepLinks = false;
            break;
        default:
            event.target.innerText = 'insert_link';
            event.target.title = 'Keep Links In Tables';
            writeMessage(event.target.title);
            config.keepLinks = true;
            break;
    }
}

function onOptionClick(event) {
    if (event?.target?.title) {
        config.command = event.target.title.toLowerCase();
        writeMessage('Current Mode: ' + event.target.title, true);
    }
}

function onActionClick(event) {
    switch (event.target.title) {
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
    if (!sourceTextArea.value)
        alert('Fill in something for source HTML!');
    else {
        switch (config.command) {
            case 'carousel':
                if (!sourceTextArea.value.includes('<table'))
                    return alert('No table tag found! This will only process images in tables!');
                if (sourceTextArea.value.includes('class="carousel"'))
                    return alert('Carousel already set! Remove if meant to create new!');
                destTextArea.value = createCarousel(sourceTextArea.value);
                break;
            case 'agenda':
                destTextArea.value = createAgenda(sourceTextArea.value);
                break;
            case 'resize':
                if (!sourceTextArea.value.includes('<img'))
                    return alert('No image tag found! This will only process images!');
                if (sourceTextArea.value.includes('w200-h113"'))
                    return alert('Images already ressized!');
                destTextArea.value = resizeImages(sourceTextArea.value);
                break;
            default:
                alert('Invalid command set!');
                break;
        }
    }
}

function onCopy() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(destTextArea.value);
        destTextArea.value = '';
        writeMessage('Copied to clipboard!');
    }
}

function writeMessage(input, save) {
    messageSpan.innerText = input;
    if(save) config.message = input;
    setTimeout(function () {
        messageSpan.innerText = config.message || '';
    }, 1000);
}

//--FUNCTIONS--//
function createCarousel(input) {
    let temp = document.createElement('div');
    temp.innerHTML = input;
    let output = document.createElement('div');
    output.className = 'carousel';
    let counter = 0;
    for (let table of temp.querySelectorAll('table')) {
        let item = document.createElement('div');
        item.className = 'carousel-item';
        if (counter++ > 0) item.classList.add('hide');
        for (let link of table.querySelectorAll('a')) {
            if (!config.keepLinks) {
                let elem = removeLinksInImages(link);
                if (elem) {
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

function createAgenda(input) {
    let temp = document.createElement('div');
    temp.innerHTML = input;
    let output = document.createElement('div');
    output.className = 'agenda';
    let counter = 0;
    for (let table of temp.querySelectorAll('table, a, img')) {
        let item = document.createElement('div');
        item.className = 'agenda-item';
        for (let link of table.querySelectorAll('a')) {
            if (!config.keepLinks) {
                let elem = removeLinksInImages(link);
                if (elem) {
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

function resizeImages(input) {
    let temp = document.createElement('div');
    temp.innerHTML = input;
    for (let link of temp.querySelectorAll('a')) {
        let image = link.querySelector('img');
        image.src = image.src.replace('s320', 'w200-h113');
        image.setAttribute('width', '200');
        image.setAttribute('height', '113');

        if (!config.keepLinks) {
            let elem = removeLinksInImages(link);
            if (elem) {
                link.parentElement.appendChild(elem);
                link.parentElement.removeChild(link);
            }
        }
    }
    return temp.innerHTML.replace(/\n/g, '');
}

function removeLinksInImages(link) {
    // assume one link one image
    let image = link.querySelector('img');
    return image;
}

//--INITIAL--//
function startup() {
    document.querySelector('.options button').click();
}
