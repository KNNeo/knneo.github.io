//--DEFAULT SETTINGS--//
const config = {
    card: {
        logo: '🍒',
        title: 'FRUITPICKER',
        subtitle: 'Win up to $10,000!',
        matches: ['🍒'], // max 5
        grid: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0], // max 25
        footer: 'Match 3 of any fruits shown on the top row to win'
    }
};

//--DOM NODE REFERENCES--//
const scratcherSvg = document.querySelector('svg.scratcher');


//--DOM FUNCTIONS--//


//--EVENT HANDLERS--//


//--FUNCTIONS--//
function setDailyCard() {
    config.card = {};
}

function renderCard() {
    let viewBox = diagramSvg.getAttribute('viewBox').split(' ').map(v => parseInt(v));
    // header: card logo, name, punchline
    // logo
    let blockPos = viewBox[1];
    let logoArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    logoArea.setAttribute('x', 0.5 * viewBox[2] - 0.15 * viewBox[2]);
    logoArea.setAttribute('y', viewBox[1]);
    logoArea.setAttribute('width', 0.3 * viewBox[2]);
    logoArea.setAttribute('height', 0.1 * viewBox[3]);
    let logoDiv = document.createElement('div');
    logoDiv.innerText = config.card.logo;
    logoDiv.style.color = 'var(--foreground)';
    // logoDiv.style.background = 'var(--background)';
    logoArea.appendChild(logoDiv);
    diagramSvg.appendChild(logoArea);
    // update pos
    blockPos += 0.1 * viewBox[3];
    // name
    let nameArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    nameArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    nameArea.setAttribute('y', blockPos);
    nameArea.setAttribute('width', 0.9 * viewBox[2]);
    nameArea.setAttribute('height', 0.1 * viewBox[3]);
    let nameDiv = document.createElement('div');
    nameDiv.innerText = config.card.name;
    nameDiv.style.color = 'var(--foreground)';
    // nameDiv.style.background = 'var(--background)';
    nameArea.appendChild(nameDiv);
    diagramSvg.appendChild(nameArea);
    // update pos
    blockPos += 0.1 * viewBox[3];
    // name
    let punchlineArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    punchlineArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    punchlineArea.setAttribute('y', blockPos);
    punchlineArea.setAttribute('width', 0.9 * viewBox[2]);
    punchlineArea.setAttribute('height', 0.1 * viewBox[3]);
    let punchlineDiv = document.createElement('div');
    punchlineDiv.innerText = config.card.subtitle;
    punchlineDiv.style.color = 'var(--foreground)';
    // punchlineDiv.style.background = 'var(--background)';
    punchlineArea.appendChild(punchlineDiv);
    diagramSvg.appendChild(punchlineArea);
    // body: scratch grid of prizes
    let grid = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    grid.classList.add('box');
    grid.setAttribute('fill', 'var(--foreground)');
    grid.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    grid.setAttribute('y', blockPos);
    grid.setAttribute('width', 0.9 * viewBox[2]);
    grid.setAttribute('height', 0.6 * viewBox[3]);
    // matches: 1 by 5 grid (0.1 width, 0.15 height)
    for(let match of config.card.matches) {
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', 0.1 * viewBox[2]);
        gridArea.setAttribute('y', (2+(i % 5)) * 0.15 * viewBox[3]);
        gridArea.setAttribute('width', 0.1 * viewBox[2]);
        gridArea.setAttribute('height', 0.15 * viewBox[3]);
            let gridAreaDiv = document.createElement('div');
            gridAreaDiv.innerText = match;
            gridAreaDiv.style.color = 'var(--foreground)';
            // gridAreaDiv.style.background = 'var(--background)';
            gridArea.appendChild(gridAreaDiv);
        grid.appendChild(gridArea);
    }
    // prizes: 5 by 5 grid (0.1 width, 0.15 height)
    for(let i = 0; i < 25; i++) {
        if(config.card.grid.length < i) continue;
        let item = config.card.grid[i];
        let gridArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        gridArea.setAttribute('x', Math.floor(x / 5) * 0.1 * viewBox[2]);
        gridArea.setAttribute('y', (3+(i % 5)) * 0.15 * viewBox[3]);
        gridArea.setAttribute('width', 0.1 * viewBox[2]);
        gridArea.setAttribute('height', 0.15 * viewBox[3]);
            let gridAreaDiv = document.createElement('div');
            gridAreaDiv.innerText = '🍒';
            gridAreaDiv.style.color = 'var(--foreground)';
            // gridAreaDiv.style.background = 'var(--background)';
            gridArea.appendChild(gridAreaDiv);
        grid.appendChild(gridArea);
    }
    let overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    overlay.style.position: 'absolute';
    overlay.setAttribute('fill', 'var(--accent)');
    overlay.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    overlay.setAttribute('y', blockPos);
    overlay.setAttribute('width', 0.9 * viewBox[2]);
    overlay.setAttribute('height', 0.6 * viewBox[3]);
    diagramSvg.appendChild(grid);
    diagramSvg.appendChild(overlay);
    // update pos
    blockPos += 0.6 * viewBox[3];
    // footer: instructions, condition to win
    let footerArea = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    punchlineArea.setAttribute('x', 0.5 * viewBox[2] - 0.45 * viewBox[2]);
    footerArea.setAttribute('y', blockPos);
    footerArea.setAttribute('width', 0.9 * viewBox[2]);
    footerArea.setAttribute('height', 0.1 * viewBox[3]);
    let footerDiv = document.createElement('div');
    footerDiv.innerText = config.card.footer;
    footerDiv.style.color = 'var(--foreground)';
    // footerDiv.style.background = 'var(--background)';
    footerArea.appendChild(footerDiv);
    diagramSvg.appendChild(footerArea);
}

//--INITIAL--//
function startup() {
    renderCard();
}
