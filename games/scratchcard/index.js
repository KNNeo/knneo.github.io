//--DEFAULT SETTINGS--//
const config = {
    card: {
        active: {},
        example: () => { return config.card.list[0] },
        list: [{
                type: 'match',
                width: 400,
                height: 600,
                logo: '🍒',
                title: 'FRUITPICKER',
                subtitle: 'Win up to $100!!',
                matches: ['🍒','🍌','🥝','🍇','🍑','🍎','🍋','🍍','🍈','🍊'],
                minMatch: 3,
                maxMatch: 5,
                gridSize: 25,
                winRate: 0.1,
                footer: 'Match 3 of any fruits shown on the top row to win\nMatch 3: $1, Match 4: $10, Match 5: $100!'
            },{
                type: 'match',
                width: 300,
                height: 300,
                background: 'red',
                logo: '🧨',
                title: 'FIRECRACKER',
                subtitle: 'Win $888!!',
                matches: ['🧨'],
                minMatch: 3,
                gridSize: 3,
                winRate: 0.1,
                footer: 'Scratch to find out if you won!'
            },
        ]
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
    },
    storage: {
        id: 'scratchcard-v1'
    }
};

//--DOM NODE REFERENCES--//
const scratcherSvg = document.querySelector('svg#scratcher');

//--EVENT HANDLERS--//
function skipScratch() {
    let viewBox = scratcherSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
    config.scratch.overlay = new Array(viewBox[2] * viewBox[3]).fill(true);
    updateProgress();
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

//--FUNCTIONS--//
function loadCard() {
    config.card.active = JSON.parse(localStorage.getItem(config.storage.id));
    if(!config.card.active)
        setDailyCard();
}

function selectCard() {
    let container = document.createElement('div');
    for(let opt of config.card.list) {
        let option = document.createElement('button');
        option.innerText = opt.title;
        option.addEventListener('click', onSelectCard);
        container.appendChild(option);
    }
    popupContent(container);
}

function onSelectCard() {
    let card = config.card.list.find(c => c.title == event.target.innerText);
    config.card.active = copyCard(card);
    renderCard();
}

function setDailyCard() {
    config.card.active = copyCard(config.card.example());
}

function saveCard() {
    config.card.active.complete = 1;
    localStorage.setItem(config.storage.id, JSON.stringify(config.card.active));
}

function copyCard(card) {
    return JSON.parse(JSON.stringify(card));
}

function renderCard() {
    // reset card
    scratcherSvg.innerHTML = '';
    scratcherSvg.removeAttribute('data-complete');
    // render by type
    if(config.card.active.type == 'match')
        renderMatchCard();
    if(config.card.active.complete) {
        config.scratch.overlay = new Array(activeCard.width * activeCard.height).fill(true);
        updateProgress();
    }
}

function renderMatchCard() {
    let activeCard = config.card.active;
    // set dimensions and card odds
    scratcherSvg.style.setProperty('--width', activeCard.width + 'px');
    if(!activeCard.match)
        activeCard.match = activeCard.matches[Math.floor(activeCard.matches.length*Math.random())];
    let mismatches = activeCard.matches.filter(m => m != activeCard.match);
    activeCard.grid = new Array(activeCard.gridSize).fill(false).reduce((total, current, idx, arr) => {
        if(total.filter(a => a).length < activeCard.maxMatch && Math.random() < activeCard.winRate)
            total.push(activeCard.match);
        else
            total.push(mismatches[Math.floor(mismatches.length*Math.random())]);
        return total;
    }, []);
    config.scratch.overlay = new Array(activeCard.width * activeCard.height).fill(false);
    // set view and overlay for svg
    let viewBox = [0, 0, activeCard.width, activeCard.height];
    scratcherSvg.setAttribute('viewBox', viewBox.join(' '));
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
    logoDiv.innerText = activeCard.logo;
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
    nameDiv.innerText = activeCard.title;
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
    punchlineDiv.innerText = activeCard.subtitle;
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
    let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    gridArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    gridArea.setAttribute('y', blockPos);
    gridArea.setAttribute('width', 0.9 * viewBox[2]);
    gridArea.setAttribute('height', 0.1 * viewBox[3]);
        let gridAreaDiv = document.createElement('div');
        gridAreaDiv.classList.add('lineup');
        gridAreaDiv.innerText = activeCard.match;
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
    for(let i = 0; i < 25; i++) {
        if(activeCard.grid.length < i) continue;
        let item = activeCard.grid[i];
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', 0.125 * viewBox[2] + (i % 5) * 0.15 * viewBox[2]);
        gridArea.setAttribute('y', blockPos + Math.floor(i / 5) * 0.1 * viewBox[3]);
        gridArea.setAttribute('width', 0.15 * viewBox[2]);
        gridArea.setAttribute('height', 0.1 * viewBox[3]);
            let gridAreaDiv = document.createElement('div');
            gridAreaDiv.classList.add('prize');
            gridAreaDiv.innerText = item;
            if(item == activeCard.match)
                gridAreaDiv.classList.add('win');
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
    footerDiv.innerText = activeCard.footer;
    footerDiv.classList.add('footer');
    footerArea.appendChild(footerDiv);
    scratcherSvg.appendChild(footerArea);
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
    let matches = config.card.active.grid.filter(g => g == config.card.active.match).length;
    if(matches >= config.card.active.minMatch && matches <= config.card.active.maxMatch)
        popupContent(config.message.win);
    else
        popupContent(config.message.lose);
    saveCard();
}

//--DIALOG--//
function popupContent(input) {
	if (!input) {
		alert('No content found');
		return;
	}
	// create dialog component if missing
	let dialog = document.querySelector('.dialog');
	if (!dialog) {
		dialog = document.createElement('dialog');
		dialog.tabIndex = 0;
		dialog.addEventListener('click', function () {
			if (event.target == document.querySelector('dialog'))
				removeDialog();
		});
		dialog.addEventListener('keyup', function () {
			if (event.key != 'Space' || event.key != 'Enter') return;
			if (event.target.closest('.content')) return;
			event.preventDefault();
			removeDialog();
		});
		document.body.appendChild(dialog);
	}
	dialog.className = 'dialog';

	let dialogListDiv = createDialog(input);
	dialog.innerHTML = '';
	dialog.appendChild(dialogListDiv);
	dialog.showModal();
	setTimeout(function () {
		document.querySelector('.dialog').classList.add('open');
	}, 0);
}

function createDialog(node) {
	// Helper function to create dialog with content
	// Note: Node in dialog will not have events! Manual add back or write as attribute!
	let box = document.createElement('div');
	if (typeof node == 'string') {
		box.classList.add('box');
		box.innerHTML = node;
	}
	if (typeof node == 'object') {
		box.classList.add('content');
		let clonedNode = node.cloneNode(true);
		box.appendChild(clonedNode);
	}
	return box;
}

function removeDialog() {
	document.querySelector('.dialog')?.classList.remove('open');
	setTimeout(function () {
		document.querySelector('.dialog')?.close();
	}, 250);
}

//--INITIAL--//
function startup() {
    loadCard();
    renderCard();
}
