//--DEFAULT SETTINGS--//
const config = {
	"node": {
		"width": 100,
		"height": 100,
	},
	"palette": ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
	"list": [
		{
			"id": "User1",
			"name": "User 1",
			"relations": [
				{
					"id": "User3",
					"rel": "1 -> 3",
				},
			],
		},
		{
			"id": "User2",
			"name": "User 2",
			"relations": [
				{
					"id": "User1",
					"rel": "2 -> 1",
				},
			],
		},
		{
			"id": "User3",
			"name": "User 3",
			"relations": [
				{
					"id": "User1",
					"rel": "3 -> 1",
				},
			],
		},
		{
			"id": "User4",
			"name": "User 4",
			"relations": [
				{
					"id": "User3",
					"rel": "4 -> 3",
				},
			],
		},
		{
			"id": "User5",
			"name": "User 5",
			"relations": [
				{
					"id": "User1",
					"rel": "5 -> 1",
				},
			],
		},
		{
			"id": "User6",
			"name": "User 6",
			"relations": [
				{
					"id": "User1",
					"rel": "6 -> 1",
				},
			],
		},
		{
			"id": "User7",
			"name": "User 7",
			"relations": [
				{
					"id": "User6",
					"rel": "7 -> 6",
				},
			],
		},
		{
			"id": "User8",
			"name": "User 8",
			"relations": [
				{
					"id": "User6",
					"rel": "8 -> 6",
				},
				{
					"id": "User7",
					"rel": "8 -> 7",
				},
			],
		},
		{
			"id": "User9",
			"name": "User 9",
			"relations": [
				{
					"id": "User8",
					"rel": "9 -> 8",
				},
			],
		},
	]
};

//--HTML DOM NODE REFERENCES--//
const diagramDiv = document.querySelector('.diagram');
const viewerDiv = document.querySelector('.viewer');
const editorTextarea = document.querySelector('.editor');

//--HTML DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function openEditor() {
	viewerDiv.classList.remove('hidden');
	editorTextarea.value = JSON.stringify(window.data.list);
}

function closeEditor() {
	viewerDiv.classList.add('hidden');
}

function onPreview() {
	try {
		window.data = {
			...config,
			"list": JSON.parse(editorTextarea.value),
		};
		drawBoard();
		viewerDiv.classList.add('hidden');
	}
	catch {
		if(confirm('JSON format invalid: Click on OK to reset')) {
			editorTextarea.value = JSON.stringify(window.data.list);
		}
	}
}

//--FUNCTIONS--//
function drawBoard() {
	diagramDiv.innerHTML = '';
	drawResources();
	drawNodes();
	drawLines();
}

function drawResources() {
	// arrow marker
	let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
	arrow.id = 'triangle';
	arrow.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	arrow.setAttribute('viewBox', '0 0 10 10');
	arrow.setAttribute('refX', '0');
	arrow.setAttribute('refY', '5');
	arrow.setAttribute('markerUnits', 'strokeWidth');
	arrow.setAttribute('markerWidth', '4');
	arrow.setAttribute('markerHeight', '3');
	arrow.setAttribute('orient', 'auto');
	arrow.setAttribute('fill', 'var(--foreground)');
	
		let arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
		arrow.appendChild(arrowPath);
		
	diagramDiv.appendChild(arrow);
}

function drawNodes() {
	let coordinates = [];
	for(let i = 0; i < window.data.list.length; i++)
	{
		coordinates = nextCoordinate(coordinates);
		// console.log(coordinates);
		
		// 1st rect is center, else to the right of 1st
		let rect1X = i == 0 ? (diagramDiv.width.baseVal.value - config.node.width) / 2 : parseInt(document.querySelector('#node1').getAttribute('x')) + (coordinates[0]*2*config.node.width);
		let rect1Y = i == 0 ? (diagramDiv.height.baseVal.value - config.node.height) / 2 : parseInt(document.querySelector('#node1').getAttribute('y')) + (coordinates[1]*2*config.node.height);
		
		let item = window.data.list[i];
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.id = 'node' + (1+i);
		rect.setAttribute('data-id', item.id);
		rect.setAttribute('x', rect1X);
		rect.setAttribute('y', rect1Y);
		rect.setAttribute('width', config.node.width);
		rect.setAttribute('height', config.node.height);
		rect.setAttribute('fill', config.palette[i % config.palette.length]);
		rect.setAttribute('stroke', 'var(--foreground)');
		rect.setAttribute('stroke-width', 5);
		diagramDiv.appendChild(rect);
		
		let textBox = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		textBox.setAttribute('fill', 'white');
		textBox.innerHTML = item.name;
		diagramDiv.appendChild(textBox);
		
		textBox.setAttribute('x', rect1X + 0.5*config.node.width - 0.5*textBox.getBoundingClientRect().width);
		textBox.setAttribute('y', rect1Y + 0.5*config.node.height - 0.5*textBox.getBoundingClientRect().height);
	}
}

function drawLines() {
	let points = [];
	for(let node of window.data.list)
	{
		points.push(...node.relations.map(function(r) {
			return {
				source: node.id,
				destination: r.id,
				textVal: r.rel
			};
		}));
	}
	
	for(let point of points)
	{
		let {source, destination} = point;
		
		// Create a line connecting the centers of the rectangles
		let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		let sourceX = parseInt(document.querySelector('[data-id=' + source + ']').getAttribute('x')) + 0.5*config.node.width;
		let sourceY = parseInt(document.querySelector('[data-id=' + source + ']').getAttribute('y')) + 0.5*config.node.height;
		let destX = parseInt(document.querySelector('[data-id=' + destination + ']').getAttribute('x')) + 0.5*config.node.width;
		let destY = parseInt(document.querySelector('[data-id=' + destination + ']').getAttribute('y')) + 0.5*config.node.height;
		// if horizontal line
		if(sourceY == destY) {
			let delta = destX - sourceX;
			sourceX += (delta > 0 ? 1 : -1)*0.5*config.node.width;
			destX += (delta > 0 ? -1 : 1)*0.5*config.node.width + (delta > 0 ? -15 : 15);
		}
		// if vertical line
		else if(sourceX == destX) {
			let delta = destY - sourceY;
			sourceY += (delta > 0 ? 1 : -1)*0.5*config.node.height;
			destY += (delta > 0 ? -1 : 1)*0.5*config.node.height + (delta > 0 ? -15 : 15);
		}
		// if diagonal line
		else {
			let deltaX = destX - sourceX;
			let deltaY = destY - sourceY;
			sourceX += (deltaX > 0 ? 1 : -1)*0.5*config.node.width;
			sourceY += (deltaY > 0 ? 1 : -1)*0.5*config.node.height;
			destX += (deltaX > 0 ? -1 : 1)*0.5*config.node.width + (deltaX > 0 ? -10 : 10);
			destY += (deltaY > 0 ? -1 : 1)*0.5*config.node.height + (deltaY > 0 ? -10 : 10);
		}
		
		let deltaY = sourceX == destX ? config.node.height : 0
		line.setAttribute('x1', sourceX);
		line.setAttribute('y1', sourceY);
		line.setAttribute('x2', destX);
		line.setAttribute('y2', destY);
		line.setAttribute('stroke', 'var(--foreground)');
		line.setAttribute('stroke-width', 5);
		line.setAttribute('marker-end', 'url(#triangle)');
		diagramDiv.appendChild(line);
	}
}

function generateCoordinates(amount) {
	let coordinates = [0,0];
	// console.log(coordinates);
	for(let i = 0; i < amount; i++)
	{
		coordinates = nextCoordinate(coordinates);
		// console.log(coordinates);
	}
}

function nextCoordinate(coordinates) {
	if(!coordinates || coordinates.length != 2) return [0, 0];
	let [x,y] = coordinates;
	x = parseInt(x) || 0;
	y = parseInt(y) || 0;
	
	// grid is by default: 1^2, 3^2, 5^2, coordinates to update always at border where x or y is +/- max val
	// clockwise extend outwards, see diagram below for first 25 values
	/*
	** 21 | 22 | 23 | 24 | 25 
	** 20 |  7 |  8 |  9 | 10
	** 19 |  6 |  1 |  2 | 11
	** 18 |  5 |  4 |  3 | 12
	** 17 | 16 | 15 | 14 | 13
	*/
	
	// exception: if center, move right ie. [++x, y]
	if(x == 0 && y == 0)
		return [++x, y];

	// get largest coordinate value
	let largest = 0;
	if(Math.abs(x) >= Math.abs(y)) largest = Math.abs(x);
	else largest = Math.abs(y);
	
	let borderingTopRight = x == largest && y == -1*largest;
	let borderingBottomRight = x == largest && y == largest;
	let borderingBottomLeft = x == -1*largest && y == largest;
	let borderingTopLeft = x == -1*largest && y == -1*largest;
	
	let borderingRight = x == largest && y != largest && y != -1*largest;
	let borderingBottom = y == largest && x != largest && x != -1*largest;
	let borderingLeft = x == -1*largest && y != -1*largest && y != largest;
	let borderingTop = y == -1*largest && x != -1*largest && x != largest;
	// console.log('top-right bottom-right bottom-left top-left');
	// console.log(borderingTopRight, borderingBottomRight, borderingBottomLeft, borderingTopLeft);
	// console.log('right bottom left top');
	// console.log(borderingRight, borderingBottom, borderingLeft, borderingTop);
	
	// if reach right edge of furthest node, move down
	// if reach bottom edge of furthest node, move left
	// if reach left edge of furthest node, move up
	// if reach top edge of furthest node, move right
	// exception: top right of grid to move out of grid
	if(borderingRight)
		return [x, ++y];
	if(borderingBottomRight || (borderingBottom && !borderingBottomLeft))
		return [--x, y];
	if(borderingBottomLeft || borderingLeft)
		return [x, --y];
	if(borderingTopLeft || borderingTopRight || borderingTop)
		return [++x, y];		
	
	// return error if unidentified
	return alert('INVALID_SEQUENCE');
}

//--INITIAL--//
function startup() {
	window.data = { ...config };
	diagramDiv.setAttribute('width', window.innerWidth);
	diagramDiv.setAttribute('height', parseInt(0.7*window.innerHeight));
	drawBoard();
}
