//--DEFAULT SETTINGS--//
const config = {
    card: {
        maxWidth: 400,
        maxHeight: 600,
        active: {},
        example: () => { return config.card.list[0] },
        list: [{
                type: 'prize',
                logo: '🐟',
                title: 'FISHING MANIA',
                subtitle: 'Win up to $2500!!',
                matches: ['🐟','🐠','🐡'],
                matchWins: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500],
                gridSize: 25,
                matchRate: 0.1,
                prizeRate: 0.5,
                footer: 'Match fish shown above to win prize listed\n(Prizes range from $1 to $2500)'
            }, {
                type: 'match',
                logo: '🍒',
                title: 'FRUITPICKER',
                subtitle: 'Win up to $100!!',
                matches: ['🍒', '🍌', '🥝', '🍇', '🍑', '🍎', '🍋', '🍍', '🍈', '🍊'],
                matchWins: [0, 0, 1, 10, 100],
                gridSize: 25,
                matchRate: 0.2,
                footer: 'Match 3 of any fruits shown on the top row to win\nMatch 3: $1, Match 4: $10, Match 5: $100!'
            }, {
                type: 'match',
                background: 'red',
                logo: '🧨',
                title: 'FIRECRACKER',
                subtitle: 'Win $888!!',
                match: '🧨',
                matches: ['🧨', '💥'],
                matchWins: [0, 0, 888],
                gridSize: 3,
                matchRate: 0.1,
                footer: 'Scratch to find out if you won!'
            },
        ]
    },
    scratch: {
        threshold: 60,
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
    if (config.scratching) {
        console.log('click', event.offsetX, event.offsetY);
        scratch(event.offsetX, event.offsetY);
    }
}

function onOverlayTouch() {
    config.scratching = event.type == 'touchstart';
}

function onOverlayTouchMove() {
    event.preventDefault();
    if (config.scratching && document.querySelector('#overlay')) {
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
    if (!config.card.active)
        setDailyCard();
}

function selectCard() {
    let container = document.createElement('div');
    for (let opt of config.card.list) {
        let option = document.createElement('button');
        option.innerText = opt.title;
        option.setAttribute('onclick', 'onSelectCard()');
        container.appendChild(option);
    }
    popupContent(container);
}

function onSelectCard() {
    let card = config.card.list.find(c => c.title == event.target.innerText);
    config.card.active = copyCard(card);
    renderCard();
    removeDialog();
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
    let activeCard = config.card.active;
    // calculate odds by type and render
    if (config.card.active.type == 'match') {   
        if (!activeCard.match)
            activeCard.match = randomize(activeCard.matches);
        let mismatches = activeCard.matches.filter(m => m != activeCard.match);
        if (!activeCard.grid || !activeCard.grid.length) {
            activeCard.grid = new Array(activeCard.gridSize).fill(false).reduce((total, current, idx, arr) => {
                if (total.filter(a => activeCard.match).length < activeCard.matchWins.length && Math.random() < activeCard.matchRate)
                    total.push(activeCard.match);
                else
                    total.push(randomize(mismatches));
                return total;
            }, []);
        }
        renderMatchCard();
    }
    if (config.card.active.type == 'prize') {
        if (!activeCard.match)
            activeCard.match = randomize(activeCard.matches);
        let mismatches = activeCard.matches.filter(m => m != activeCard.match);
        if (!activeCard.grid || !activeCard.grid.length) {
            activeCard.grid = new Array(activeCard.gridSize).fill(false).reduce((total, current, idx, arr) => {
                if (Math.random() < activeCard.matchRate)
                    total.push(activeCard.match + '\n$' + randomizeRate(activeCard.matchWins, activeCard.prizeRate));
                else
                    total.push(randomize(mismatches) + '\n$' + randomizeRate(activeCard.matchWins, activeCard.prizeRate));
                return total;
            }, []);
        }
        renderMatchCard();
    }
    // if load from save, show completed status
    if (config.card.active.complete) {
        let viewBox = scratcherSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
        config.scratch.overlay = new Array(viewBox[2] * viewBox[3]).fill(true);
        updateProgress();
    }
}

function renderMatchCard() {
    let activeCard = config.card.active;
    let viewBox = [0, 0, config.card.maxWidth, config.card.maxHeight];
    // header: card logo, name, punchline
    // logo
    let blockPos = viewBox[1];
    let logoArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    logoArea.setAttribute('x', 0.5 * viewBox[2] - 0.15 * viewBox[2]);
    logoArea.setAttribute('y', blockPos);
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
    grid.setAttribute('height', ((Math.ceil(activeCard.gridSize / 5) * 0.1) + 0.1) * viewBox[3]);
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
    overlayArea.setAttribute('height', ((Math.ceil(activeCard.gridSize / 5) * 0.1) + 0.1) * viewBox[3]);
    let overlay = document.createElement('canvas');
    overlay.id = 'overlay';
    overlay.setAttribute('width', 0.9 * viewBox[2]);
    overlay.setAttribute('height', ((Math.ceil(activeCard.gridSize / 5) * 0.1) + 0.1) * viewBox[3]);
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
    let gridRowCount = 5;
    if(activeCard.gridSize < gridRowCount)
        gridRowCount = activeCard.gridSize;
    for (let i = 0; i < activeCard.gridSize; i++) {
        if (activeCard.grid.length < i) continue;
        let item = activeCard.grid[i];
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', 0.125 * viewBox[2] + (i % gridRowCount) * 0.15 * viewBox[2]);
        gridArea.setAttribute('y', blockPos + Math.floor(i / 5) * 0.1 * viewBox[3]);
        gridArea.setAttribute('width', 0.15 * viewBox[2]);
        gridArea.setAttribute('height', 0.1 * viewBox[3]);
        let gridAreaDiv = document.createElement('div');
        gridAreaDiv.classList.add('prize');
        gridAreaDiv.innerText = item;
        if (item.startsWith(activeCard.match))
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
    blockPos += (Math.ceil(activeCard.gridSize / 5) * 0.1) * viewBox[3];
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
    // update pos for viewBox
    blockPos += 0.1 * viewBox[3];
    if(blockPos > config.card.maxHeight)
        blockPos = config.card.maxHeight;
    config.scratch.overlay = new Array(config.card.maxWidth * blockPos).fill(false);
    // set dimensions and card odds
    scratcherSvg.style.setProperty('--width', config.card.maxWidth + 'px');
    // set view and overlay for svg
    viewBox = [0, 0, config.card.maxWidth, blockPos];
    scratcherSvg.setAttribute('viewBox', viewBox.join(' '));
}

function randomize(list) {
    if(!list) return console.error('list is empty');
    return list[Math.floor(list.length * Math.random())];
}

function randomizeRate(list, rate) {
    if(!list) return console.error('list is empty');
    if(rate < 0 || rate > 1)
        return console.error('rate is not in range, ensure is 0 to 1');
    let idx = list.length - 1;
    let value = list[idx];
    while(value > list[0]) {
        if(Math.random() < Math.pow(rate, idx))
            return value;
        else {
            idx -= 1;
            value = list[idx];
        }
    }
    return value;
}

function scratch(x, y) {
    let viewBox = scratcherSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
    // to hide overlay fill
    let ctx = document.querySelector('#overlay')?.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    if (config.scratch.height) {
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
    if (config.scratch.radius) {
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
        if (document.querySelector('#overlay'))
            document.querySelector('#overlay').classList.add('hidden');
        // console.log('scratch complete!');
        config.scratching = false;
        displayResult();
        saveCard();
    }
}

function displayResult() {
    let matches = config.card.active.grid.filter(g => g.startsWith(config.card.active.match));
    if (!matches.length)
        return popupContent(config.message.lose);
    if(config.card.active.type == 'prize') {
        let amount = matches.reduce((total, current) => {
            let item = current.split('\n');
            if(item.length == 2)
                total += parseInt(item[1]) || 0;
            return total;
        }, 0);
        if(prizes.length && amount)
            return popupContent(config.message.win + ' $' + amount);
    }
    if(config.card.active.type == 'match') {
        for (let w = config.card.active.matchWins.length - 1; w > 0; w--) {
            // find in array, value based on highest no of wins (so if array length = 5, but 6 wins (> 5), is value on array[4])
            if (matches.length >= w + 1 && config.card.active.matchWins[w] > 0)
                return popupContent(config.message.win);
        }
    }
    return popupContent(config.message.lose);
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
