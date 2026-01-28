//--DEFAULT SETTINGS--//
const config = {
    card: {
        width: 400,
        height: 600,
        logo: '🍒',
        title: 'FRUITPICKER',
        subtitle: 'Win up to $10,000!',
        matches: ['🍒'], // max 5
        grid: [0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0], // max 25
        footer: 'Match 3 of any fruits shown on the top row to win'
    },
    scratch: {
        threshold: 80,
        overlay: [],
        radius: 20
    }
};

//--DOM NODE REFERENCES--//
const scratcherSvg = document.querySelector('svg#scratcher');


//--DOM FUNCTIONS--//


//--EVENT HANDLERS--//


//--FUNCTIONS--//
function setDailyCard() {
    config.card = {};
}

function renderCard() {
    // set dimensions
    scratcherSvg.style.maxWidth = config.card.width + 'px';
    scratcherSvg.style.border = '2px solid var(--foreground)';
    scratcherSvg.style.borderRadius = '8px';
    let viewBox = [0, 0, config.card.width, config.card.height];
    scratcherSvg.setAttribute('viewBox', viewBox.join(' '));
    config.scratch.overlay = new Array(viewBox[2] * viewBox[3]).fill(false);
    // header: card logo, name, punchline
    // logo
    let blockPos = viewBox[1];
    let logoArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    logoArea.style.fontSize = '4em';
    logoArea.setAttribute('x', 0.5 * viewBox[2] - 0.15 * viewBox[2]);
    logoArea.setAttribute('y', viewBox[1]);
    logoArea.setAttribute('width', 0.3 * viewBox[2]);
    logoArea.setAttribute('height', 0.15 * viewBox[3]);
    let logoDiv = document.createElement('div');
    logoDiv.innerText = config.card.logo;
    logoDiv.style.color = 'var(--foreground)';
    logoArea.appendChild(logoDiv);
    scratcherSvg.appendChild(logoArea);
    // update pos
    blockPos += 0.15 * viewBox[3];
    // name
    let nameArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    nameArea.style.fontSize = '2em';
    nameArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    nameArea.setAttribute('y', blockPos);
    nameArea.setAttribute('width', 0.9 * viewBox[2]);
    nameArea.setAttribute('height', 0.1 * viewBox[3]);
    let nameDiv = document.createElement('div');
    nameDiv.innerText = config.card.title;
    nameDiv.style.color = 'var(--foreground)';
    nameArea.appendChild(nameDiv);
    scratcherSvg.appendChild(nameArea);
    // update pos
    blockPos += 0.1 * viewBox[3];
    // name
    let punchlineArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    punchlineArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    punchlineArea.setAttribute('y', blockPos);
    punchlineArea.setAttribute('width', 0.9 * viewBox[2]);
    punchlineArea.setAttribute('height', 0.05 * viewBox[3]);
    let punchlineDiv = document.createElement('div');
    punchlineDiv.innerText = config.card.subtitle;
    punchlineDiv.style.color = 'var(--foreground)';
    punchlineArea.appendChild(punchlineDiv);
    scratcherSvg.appendChild(punchlineArea);
    // update pos
    blockPos += 0.05 * viewBox[3];
    // body: scratch grid of prizes
    let grid = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    grid.classList.add('box');
    grid.setAttribute('fill', 'var(--foreground)');
    grid.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    grid.setAttribute('y', blockPos);
    grid.setAttribute('width', 0.9 * viewBox[2]);
    grid.setAttribute('height', 0.6 * viewBox[3]);
    scratcherSvg.appendChild(grid);
    // matches: 1 by 5 grid (0.1 width, 0.1 height)
    let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    gridArea.setAttribute('x', 0.1 * viewBox[2]);
    gridArea.setAttribute('y', blockPos);
    gridArea.setAttribute('width', 0.9 * viewBox[2]);
    gridArea.setAttribute('height', 0.1 * viewBox[3]);
    for(let match of config.card.matches) {
        let gridAreaDiv = document.createElement('div');
        gridAreaDiv.style.fontSize = '2em';
        gridAreaDiv.innerText = match;
        gridAreaDiv.style.color = 'var(--foreground)';
        gridArea.appendChild(gridAreaDiv);
    }
    scratcherSvg.appendChild(gridArea);
    let overlayArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    overlayArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    overlayArea.setAttribute('y', blockPos);
    overlayArea.setAttribute('width', 0.9 * viewBox[2]);
    overlayArea.setAttribute('height', 0.6 * viewBox[3]);
    let overlay = document.createElement('canvas');
    overlay.id = 'overlay';
    overlay.setAttribute('width', 0.9 * viewBox[2]);
    overlay.setAttribute('height', 0.6 * viewBox[3]);
    overlay.onmousedown = onOverlayClick;
    overlay.onmousemove = onOverlayClickMove;
    overlay.onmouseup = onOverlayClick;
    overlay.ontouchstart = onOverlayTouch;
    overlay.ontouchmove = onOverlayTouchMove;
    overlay.ontouchend = onOverlayTouch;
    overlayArea.appendChild(overlay);
    // update pos
    blockPos += 0.1 * viewBox[3];
    // prizes: 5 by 5 grid (0.1 width, 0.1 height)
    for(let i = 0; i < 25; i++) {
        if(config.card.grid.length < i) continue;
        let item = config.card.grid[i];
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', 0.1 * viewBox[2] + (i % 5) * 0.15 * viewBox[2]);
        gridArea.setAttribute('y', blockPos + Math.floor(i / 5) * 0.1 * viewBox[3]);
        gridArea.setAttribute('width', 0.15 * viewBox[2]);
        gridArea.setAttribute('height', 0.1 * viewBox[3]);
            let gridAreaDiv = document.createElement('div');
            gridAreaDiv.style.fontSize = '1.5em';
            gridAreaDiv.style.width = '100%';
            gridAreaDiv.style.height = '100%';
            gridAreaDiv.style.placeContent = 'center';
            gridAreaDiv.innerText = item ? '🍒' : '🍌';
            gridAreaDiv.style.color = 'var(--foreground)';
            gridArea.appendChild(gridAreaDiv);
        scratcherSvg.appendChild(gridArea);
    }
    scratcherSvg.appendChild(overlayArea);
    let ctx = overlay.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, 0.9 * viewBox[2], 0.6 * viewBox[3]);
    // update pos
    blockPos += 0.5 * viewBox[3];
    // footer: instructions, condition to win
    let footerArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    footerArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    footerArea.setAttribute('y', blockPos);
    footerArea.setAttribute('width', 0.9 * viewBox[2]);
    footerArea.setAttribute('height', 0.1 * viewBox[3]);
    let footerDiv = document.createElement('div');
    footerDiv.innerText = config.card.footer;
    footerDiv.style.color = 'var(--foreground)';
    footerArea.appendChild(footerDiv);
    scratcherSvg.appendChild(footerArea);
}

function onOverlayClick() {
    config.scratching = event.type == 'mousedown';
}

function onOverlayClickMove() {
    event.preventDefault();
    if(config.scratching) {
        let canvas = scratcherSvg.getBoundingClientRect();
        // console.log('click', event.offsetX, event.offsetY);
        scratch(event.offsetX, event.offsetY);
    }
}

function onOverlayTouch() {
    config.scratching = event.type == 'touchstart';
}

function onOverlayTouchMove() {
    event.preventDefault();
    if(config.scratching && document.querySelector('#overlay')) {
        let overlay = document.querySelector('#overlay').getBoundingClientRect();
        let touch = event.touches[0];
        // position based on screen
        let currentX = touch.clientX - overlay.x;
        let currentY = touch.clientY - overlay.y;
        // console.log('touch', touch, currentX, currentY);
        scratch(currentX, currentY);
    }
}

function scratch(x, y) {
    let viewBox = scratcherSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
    // to hide overlay fill
    let ctx = document.querySelector('#overlay')?.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, config.scratch.radius, 0, Math.PI * 2);
    ctx.fill();
    // determine circle of scratch radius
    let minX = Math.max(0, Math.floor(x - config.scratch.radius));
    let maxX = Math.min(viewBox[2], Math.ceil(x + config.scratch.radius));
    let minY = Math.max(0, Math.floor(y - config.scratch.radius));
    let maxY = Math.min(viewBox[3], Math.ceil(y + config.scratch.radius));
    // for each pixel, mark as scratched
    for (let i = minX; i < maxX; i++) {
        for (let j = minY; j < maxY; j++) {
            let dx = i - x;
            let dy = j - y;
            if (dx * dx + dy * dy <= config.scratch.radius * config.scratch.radius)
                config.scratch.overlay[j * viewBox[2] + i] = true;
        }
    }

    updateProgress();
}

function updateProgress() {
    // check for truthy values
    let scratchCount = config.scratch.overlay.filter(Boolean).length;
    let overlay = document.querySelector('#overlay');
    let percent = (scratchCount / (overlay.width * overlay.height)) * 100;
    console.log('progress', percent.toFixed(2) + '%');
    if (percent >= config.scratch.threshold) {
        // more than the threshold, clear the scratch layer completely
        overlay?.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
        if(document.querySelector('#overlay'))
            document.querySelector('#overlay').style.display = 'none';
        console.log('scratch complete!');
    }
}

//--INITIAL--//
function startup() {
    renderCard();
}
