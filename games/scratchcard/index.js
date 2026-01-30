//--DEFAULT SETTINGS--//
const config = {
    card: {
        width: 400,
        height: 600,
        logo: '🍒',
        title: 'FRUITPICKER',
        subtitle: 'Win up to $100!!',
        matches: ['🍒','🍌','🥝','🍇','🍑','🍎','🍋','🍍','🍈','🍊'],
        grid: [], // max 25, to override
        footer: 'Match 3 of any fruits shown on the top row to win\nMatch 3: $1, Match 4: $10, Match 5: $100!'
    },
    scratch: {
        threshold: 70,
        overlay: [],
        height: 50,
        color: 'gray'
    },
    message: {
        win: 'YOU WIN!!',
        lose: 'Better luck next time!'
    }
};

//--DOM NODE REFERENCES--//
const scratcherSvg = document.querySelector('svg#scratcher');


//--DOM FUNCTIONS--//
function skipScratch() {
    let viewBox = scratcherSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
    config.scratch.overlay = new Array(viewBox[2] * viewBox[3]).fill(true);
    updateProgress();
}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
function setDailyCard() {
    config.card = {};
}

function renderCard() {
    // reset card, set dimensions and card odds
    scratcherSvg.innerHTML = '';
    scratcherSvg.removeAttribute('data-complete');
    scratcherSvg.style.setProperty('--width', config.card.width + 'px');
    config.card.grid = new Array(25).fill(false).reduce((total, current, idx, arr) => {
        if(total.filter(a => a).length < 5 && Math.random() < 0.1)
            total.push(1);
        else
            total.push(0);
        return total;
    }, []);
    // set view and overlay for svg
    let viewBox = [0, 0, config.card.width, config.card.height];
    scratcherSvg.setAttribute('viewBox', viewBox.join(' '));
    config.scratch.overlay = new Array(viewBox[2] * viewBox[3]).fill(false);
    // header: card logo, name, punchline
    // logo
    let blockPos = viewBox[1];
    let logoArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    logoArea.setAttribute('x', 0.5 * viewBox[2] - 0.15 * viewBox[2]);
    logoArea.setAttribute('y', viewBox[1]);
    logoArea.setAttribute('width', 0.3 * viewBox[2]);
    logoArea.setAttribute('height', 0.15 * viewBox[3]);
    let logoDiv = document.createElement('div');
    logoDiv.classList.add('logo');
    logoDiv.innerText = config.card.logo;
    logoArea.appendChild(logoDiv);
    scratcherSvg.appendChild(logoArea);
    // update pos
    blockPos += 0.15 * viewBox[3];
    // name
    let nameArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    nameArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    nameArea.setAttribute('y', blockPos);
    nameArea.setAttribute('width', 0.9 * viewBox[2]);
    nameArea.setAttribute('height', 0.1 * viewBox[3]);
    let nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.innerText = config.card.title;
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
    punchlineArea.appendChild(punchlineDiv);
    scratcherSvg.appendChild(punchlineArea);
    // update pos
    blockPos += 0.05 * viewBox[3];
    // body: scratch grid of prizes
    let grid = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    grid.setAttribute('stroke-width', 1);
    grid.setAttribute('stroke', 'var(--foreground)');
    grid.setAttribute('fill', 'var(--background)');
    grid.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    grid.setAttribute('y', blockPos);
    grid.setAttribute('width', 0.9 * viewBox[2]);
    grid.setAttribute('height', 0.6 * viewBox[3]);
    scratcherSvg.appendChild(grid);
    // matches: 1 by 5 grid (0.1 width, 0.1 height)
    let match = config.card.matches[Math.floor(config.card.matches.length*Math.random())];
    let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    gridArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    gridArea.setAttribute('y', blockPos);
    gridArea.setAttribute('width', 0.9 * viewBox[2]);
    gridArea.setAttribute('height', 0.1 * viewBox[3]);
        let gridAreaDiv = document.createElement('div');
        gridAreaDiv.classList.add('lineup');
        gridAreaDiv.innerText = match;
        gridArea.appendChild(gridAreaDiv);
    scratcherSvg.appendChild(gridArea);
    // scratch overlay (canvas)
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
    let mismatches = config.card.matches.filter(m => m != match);
    for(let i = 0; i < 25; i++) {
        if(config.card.grid.length < i) continue;
        let item = config.card.grid[i];
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', 0.125 * viewBox[2] + (i % 5) * 0.15 * viewBox[2]);
        gridArea.setAttribute('y', blockPos + Math.floor(i / 5) * 0.1 * viewBox[3]);
        gridArea.setAttribute('width', 0.15 * viewBox[2]);
        gridArea.setAttribute('height', 0.1 * viewBox[3]);
            let gridAreaDiv = document.createElement('div');
            gridAreaDiv.classList.add('prize');
            gridAreaDiv.innerText = mismatches[Math.floor(mismatches.length*Math.random())];
            if(item) {
                gridAreaDiv.classList.add('win');
                gridAreaDiv.innerText = match;
            }
            gridArea.appendChild(gridAreaDiv);
        scratcherSvg.appendChild(gridArea);
    }
    scratcherSvg.appendChild(overlayArea);
    let ctx = overlay.getContext('2d');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = config.scratch.color;
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
    footerDiv.classList.add('footer');
    footerArea.appendChild(footerDiv);
    scratcherSvg.appendChild(footerArea);
}

function onOverlayClick() {
    config.scratching = event.type == 'mousedown';
}

function onOverlayClickMove() {
    event.preventDefault();
    if(config.scratching) {
        console.log('click', event.offsetX, event.offsetY);
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
    if(config.scratch.height) {
        let w = 15; // fixed width
        let h = config.scratch.height;
        ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.fill();
        // determine area scratched
        let minX = Math.max(0, Math.floor(x - w / 2));
        let maxX = Math.min(viewBox[2], Math.ceil(x + w / 2));
        let minY = Math.max(0, Math.floor(y - h / 2));
        let maxY = Math.min(viewBox[3], Math.ceil(y + h / 2));
        // console.log(minX, maxX, minY, maxY);
        // for each pixel, mark as scratched
        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                config.scratch.overlay[j * viewBox[2] + i] = true;
            }
        }
    }
    if(config.scratch.radius) {
        ctx.arc(x, y, config.scratch.radius, 0, Math.PI * 2);
        ctx.fill();
        // determine circle of scratch radius
        let minX = Math.max(0, Math.floor(x - config.scratch.radius));
        let maxX = Math.min(viewBox[2], Math.ceil(x + config.scratch.radius));
        let minY = Math.max(0, Math.floor(y - config.scratch.radius));
        let maxY = Math.min(viewBox[3], Math.ceil(y + config.scratch.radius));
        // console.log(minX, maxX, minY, maxY);
        // for each pixel, mark as scratched
        for (let i = minX; i < maxX; i++) {
            for (let j = minY; j < maxY; j++) {
                let dx = i - x;
                let dy = j - y;
                if (dx * dx + dy * dy <= config.scratch.radius * config.scratch.radius)
                    config.scratch.overlay[j * viewBox[2] + i] = true;
            }
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
        scratcherSvg.setAttribute('data-complete', '');
        overlay?.getContext('2d').clearRect(0, 0, overlay.width, overlay.height);
        if(document.querySelector('#overlay'))
            document.querySelector('#overlay').classList.add('hidden');
        // console.log('scratch complete!');
        config.scratching = false;
        displayResult();
    }
}

function displayResult() {
    if(config.card.grid.filter(g => g).length >= 3)
        popupText(config.message.win);
    else
        popupText(config.message.lose);
}

//--DIALOG--//
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv == null) {
		dialogDiv = document.createElement('div');
		dialogDiv.classList.add('dialog');
		document.body.appendChild(dialogDiv);
	}
	let dialog = createDialog(input);
	dialogDiv.innerHTML = '';
	dialogDiv.appendChild(dialog);
	dialog.showModal();
}

function createDialog(node) {
	// node in dialog will not have events!
	let dialog = document.createElement('dialog');
	if (!dialog.classList.contains('box'))
		dialog.classList.add('box');
	if (typeof node == 'string')
		dialog.innerHTML = node;
	if (typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function () {
		if (event.target.parentElement == document.querySelector('.dialog'))
			removeDialog();
	});
	dialog.addEventListener('keyup', function () {
		if (event.key === 'Enter')
			this.remove();
	});
	return dialog;
}

function removeDialog() {
	if (event)
		event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv != null) {
		dialogDiv.remove();
	}
}

//--INITIAL--//
function startup() {
    renderCard();
}
