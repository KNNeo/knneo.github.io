//--DEFAULT SETTINGS--//
const config = {
	id: "relationship-chart",
	diagram: {
		// width: 1400,
		// height: 840,
	},
	node: {
		width: 100,
		height: 60,
		border: 5,
		gap: {
			horizontal: 1,
			vertical: 1
		}
	},
	palette: [
		"#1f77b4",
		"#ff7f0e",
		"#2ca02c",
		"#d62728",
		"#9467bd",
		"#8c564b",
		"#e377c2",
		"#7f7f7f",
		"#bcbd22",
		"#17becf"
	],
	command: `
ID user1
NAME James
LINK user3

ID user2
NAME Maria
LINK user1 AS Wife

ID user3
NAME Mary
// LINK user1 AS Colleagues
LINK user5 AS Secret Lover
LINK user2 AS Sister

ID RESERVED

ID user5
NAME Janson
LINK user1 AS Bestie
LINK user8 AS Friend

ID user6
NAME Bob
LINK user3 AS Friend

ID user7
NAME Peter
LINK user6 AS Brother
LINK user8 AS Cousin

ID user8
NAME Justin

ID user9
NAME Alicia
LINK user8 AS Daughter

ID user10
NAME Jan
LINK user1 AS Acquaintance
LINK user6 AS Friend
LINK user3 AS Friend
LINK user4 AS Brother

ID RESERVED

ID RESERVED

ID user4
NAME Henry
// LINK user5 AS Divorced
LINK user3 AS ???

`
};

//--HTML DOM NODE REFERENCES--//
const diagramSvg = document.querySelector("svg.diagram");
const viewerDiv = document.querySelector("div.viewer");
const editTemplate = document.querySelector('template.edit');	
const settingTemplate = document.querySelector('template.setting');	

//--HTML DOM FUNCTIONS--//
function onKeyDown() {}

//--EVENT HANDLERS--//
function openEditor() {
	viewerDiv.innerHTML = '';
	viewerDiv.appendChild(editTemplate.content.cloneNode(true));
	viewerDiv.classList.remove("hidden");
	viewerDiv.querySelector('.editor').value = convertToInstructions(window.data.list);
}

function closeEditor() {
	viewerDiv.classList.add("hidden");
}

function previewEditor() {
	let editorTextarea = viewerDiv.querySelector(".editor");
	if (!editorTextarea.value.endsWith("\n\n")) editorTextarea.value += "\n\n";
	try {
		window.data = {
			...window.data,
			list: convertToConfig(editorTextarea.value),
			command: editorTextarea.value
		};
		drawBoard();
		closeEditor();
		localStorage.setItem(window.data.id, JSON.stringify(window.data));
	} catch {
		if (confirm("JSON format invalid: Click on OK to reset, or Cancel to fix.")) {
			localStorage.removeItem(window.data.id);
			startup();
			closeEditor();
		}
	}
}

function openSettings() {
	viewerDiv.innerHTML = '';
	viewerDiv.appendChild(settingTemplate.content.cloneNode(true));
	loadSettings();
	viewerDiv.classList.remove("hidden");
}

function loadSettings() {
	for(let setting of viewerDiv.querySelectorAll('input')) {
		switch(setting.id) {
			case "node-width":
				setting.value = window.data.node.width;
				setting.parentElement.querySelector('span').innerText = setting.value;
				break;
			case "node-height":
				setting.value = window.data.node.height;
				setting.parentElement.querySelector('span').innerText = setting.value;
				break;
			default:
				break;
		}
	}
}

function closeSettings() {
	viewerDiv.classList.add("hidden");
}

function onSettingChange() {
	switch(event.target.id) {
		case "node-width":
			window.data.node.width = parseInt(event.target.value);
			break;
		case "node-height":
			window.data.node.height = parseInt(event.target.value);
			break;
		default:
			break;
	}
	loadSettings();
}

function saveSettings() {
	sizeDiagram();
	drawBoard();
	closeSettings();
	localStorage.setItem(window.data.id, JSON.stringify(window.data));
}

//--FUNCTIONS--//
function drawBoard() {
	diagramSvg.innerHTML = "";
	drawResources();
	drawNodes();
	drawLines();
}

function drawResources() {
	// arrow marker
	let arrow = document.createElementNS("http://www.w3.org/2000/svg", "marker");
	arrow.id = "triangle";
	arrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	arrow.setAttribute("viewBox", "0 0 8 10");
	arrow.setAttribute("refX", 1);
	arrow.setAttribute("refY", 5);
	arrow.setAttribute("markerUnits", "strokeWidth");
	arrow.setAttribute("markerWidth", 6);
	arrow.setAttribute("markerHeight", 4);
	arrow.setAttribute("orient", "auto");
	arrow.setAttribute("fill", "var(--foreground)");
	// arrow path (fixed)
	let arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	// move to (0,0), draw to (10,5), draw to (0,10), close shape
	arrowPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
	arrow.appendChild(arrowPath);
	diagramSvg.appendChild(arrow);
}

function drawNodes() {
	let coordinates = [];
	let baseId = "#" + window.data.list[0].id;
	for (let i = 0; i < window.data.list.length; i++) {
		let item = window.data.list[i];
		// find next location of node
		coordinates = nextCoordinate(coordinates);
		// console.log(coordinates);
		// 1st rect is center, else based on coordinates
		// center of 1st node top left corner + coordinate * no of nodes (min 2)
		let rect1X =
			i == 0
				? (diagramSvg.width.baseVal.value - window.data.node.width) / 2
				: parseInt(document.querySelector(baseId).getAttribute("x")) +
				  coordinates[0] * (window.data.node.gap.horizontal + 1) * window.data.node.width;
		let rect1Y =
			i == 0
				? (diagramSvg.height.baseVal.value - window.data.node.height) / 2
				: parseInt(document.querySelector(baseId).getAttribute("y")) +
				  coordinates[1] * (window.data.node.gap.vertical + 1) * window.data.node.height;
		// draw rect
		let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.id = item.id;
		rect.classList.add("node");
		rect.setAttribute("data-id", item.id);
		rect.setAttribute("x", rect1X);
		rect.setAttribute("y", rect1Y);
		rect.setAttribute("width", window.data.node.width);
		rect.setAttribute("height", window.data.node.height);
		rect.setAttribute(
			"fill",
			typeof window.data.palette == "object"
				? window.data.palette[i % window.data.palette.length]
				: window.data.palette
		);
		rect.setAttribute("stroke", "var(--foreground)");
		rect.setAttribute("stroke-width", window.data.node.border);
		if (item.id != "RESERVED") diagramSvg.appendChild(rect);
		if (item.image) {
			let textArea = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"foreignObject"
			);
			textArea.setAttribute("x", rect1X + 0.5 * window.data.node.border);
			textArea.setAttribute("y", rect1Y + 0.5 * window.data.node.border);
			textArea.setAttribute("width", window.data.node.width - window.data.node.border);
			textArea.setAttribute("height", window.data.node.height - window.data.node.border);
			let img = document.createElement("object");
			img.setAttribute("data", item.image);
			img.setAttribute("x", rect1X);
			img.setAttribute("y", rect1Y);
			img.setAttribute("width", window.data.node.width);
			img.setAttribute("height", window.data.node.height);
			textArea.appendChild(img);
			diagramSvg.appendChild(textArea);
		}
		if (item.name) {
			// draw text box
			let textArea = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"foreignObject"
			);
			textArea.setAttribute("x", rect1X + 0.5 * window.data.node.border);
			textArea.setAttribute("y", rect1Y + 0.5 * window.data.node.border);
			textArea.setAttribute("width", window.data.node.width - window.data.node.border);
			textArea.setAttribute("height", window.data.node.height - window.data.node.border);
			let textDiv = document.createElement("div");
			textDiv.innerText = item.name;
			textDiv.style.background =
				typeof window.data.palette == "object"
					? window.data.palette[i % window.data.palette.length]
					: window.data.palette;
			textArea.appendChild(textDiv);
			diagramSvg.appendChild(textArea);
		}
	}
}

function drawLines() {
	// convert
	let points = [];
	for (let node of window.data.list) {
		points.push(
			...node.relations.map(function (r) {
				return {
					source: node.id,
					destination: r.id,
					label: r.rel
				};
			})
		);
	}
	// plot lines
	for (let point of points) {
		let { source, destination, label } = point;
		// find start end points from center of node to another
		// excludes marker size
		let sourceX =
			parseInt(
				document.querySelector("[data-id=" + source + "]").getAttribute("x")
			) +
			0.5 * window.data.node.width;
		let sourceY =
			parseInt(
				document.querySelector("[data-id=" + source + "]").getAttribute("y")
			) +
			0.5 * window.data.node.height;
		let destX =
			parseInt(
				document.querySelector("[data-id=" + destination + "]").getAttribute("x")
			) +
			0.5 * window.data.node.width;
		let destY =
			parseInt(
				document.querySelector("[data-id=" + destination + "]").getAttribute("y")
			) +
			0.5 * window.data.node.height;
		// adjust for corners of nodes and destination border if any
		if (sourceX > destX) {
			// left: move source left, move dest right
			sourceX -= 0.5 * window.data.node.width;
			destX += 0.5 * window.data.node.width + 0.5 * window.data.node.border;
		}
		if (sourceX < destX) {
			// right: move source right, move dest left
			sourceX += 0.5 * window.data.node.width;
			destX -= 0.5 * window.data.node.width + 0.5 * window.data.node.border;
		}
		// vertical line: adjust y
		if (sourceY > destY) {
			// up: move source up, move dest down
			sourceY -= 0.5 * window.data.node.height;
			destY += 0.5 * window.data.node.height + 0.5 * window.data.node.border;
		}
		if (sourceY < destY) {
			// down: move source down, move source up
			sourceY += 0.5 * window.data.node.height;
			destY -= 0.5 * window.data.node.height + 0.5 * window.data.node.border;
		}
		// adjust for marker
		let deltaX = destX - sourceX;
		let deltaY = destY - sourceY;
		let markerViewboxWidth = 16;
		let angle = Math.atan2(deltaY, deltaX);
		let offsetX = markerViewboxWidth * Math.cos(angle);
		let offsetY = markerViewboxWidth * Math.sin(angle);
		// console.log(label, deltaX, deltaY);
		if (deltaX < 0 && deltaY == 0) {
			// console.log("left");
			destX += markerViewboxWidth;
		}
		if (deltaY < 0 && deltaX == 0) {
			// console.log("up");
			destY += markerViewboxWidth;
		}
		if (deltaX > 0 && deltaY == 0) {
			// console.log("right");
			destX -= markerViewboxWidth;
		}
		if (deltaY > 0 && deltaX == 0) {
			// console.log("down");
			destY -= markerViewboxWidth;
		}
		if (deltaX != 0 && deltaY != 0) {
			// console.log("diagonal");
			destX -= offsetX;
			destY -= offsetY;
		}
		// create line
		let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		line.setAttribute("x1", sourceX);
		line.setAttribute("y1", sourceY);
		line.setAttribute("x2", destX);
		line.setAttribute("y2", destY);
		line.setAttribute("stroke", "var(--foreground)");
		line.setAttribute("stroke-width", 5);
		line.setAttribute("marker-end", "url(#triangle)");
		diagramSvg.appendChild(line);
		// draw textBox
		if (label) {
			let textBox = document.createElementNS("http://www.w3.org/2000/svg", "text");
			textBox.setAttribute("font-size", "0.8em");
			textBox.setAttribute("fill", "var(--background)");
			textBox.innerHTML = label;
			diagramSvg.appendChild(textBox);
			// position textBox from bottom left corner
			// textBox x: line x (orientation dependent) + half line width - half textBox width
			// textBox y: line y (orientation dependent) + half textBox height - stroke-width * half line height
			textBox.setAttribute(
				"x",
				Math.min(sourceX, destX) +
					0.5 * line.getBoundingClientRect().width -
					0.5 * textBox.getBoundingClientRect().width
			);
			textBox.setAttribute(
				"y",
				Math.min(sourceY, destY) +
					0.5 * textBox.getBoundingClientRect().height -
					5 +
					0.5 * line.getBoundingClientRect().height
			);
			let padding = 8;
			let wrapper = document.createElementNS("http://www.w3.org/2000/svg", "rect");
			wrapper.classList.add("label");
			wrapper.setAttribute("fill", "var(--foreground)");
			wrapper.setAttribute("x", textBox.getAttribute("x") - 0.5 * padding);
			wrapper.setAttribute(
				"y",
				textBox.getAttribute("y") - textBox.getBoundingClientRect().height
			);
			wrapper.setAttribute(
				"width",
				textBox.getBoundingClientRect().width + padding
			);
			wrapper.setAttribute(
				"height",
				textBox.getBoundingClientRect().height + padding
			);
			// remove initial box for calculation, render wrapper first
			diagramSvg.removeChild(textBox);
			diagramSvg.appendChild(wrapper);
			diagramSvg.appendChild(textBox);
		}
	}
}

function nextCoordinate(coordinates) {
	// initial point
	if (!coordinates || coordinates.length != 2) return [0, 0];
	let [x, y] = coordinates;
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
	// exception: if is 1st element, move right ie. [++x, y]
	if (x == 0 && y == 0) return [++x, y];
	// get largest coordinate value
	let largest = 0;
	if (Math.abs(x) >= Math.abs(y)) largest = Math.abs(x);
	else largest = Math.abs(y);
	// if at corners
	let borderingTopRight = x == largest && y == -1 * largest;
	let borderingBottomRight = x == largest && y == largest;
	let borderingBottomLeft = x == -1 * largest && y == largest;
	let borderingTopLeft = x == -1 * largest && y == -1 * largest;
	// otherwise
	let borderingRight = x == largest && y != largest && y != -1 * largest;
	let borderingBottom = y == largest && x != largest && x != -1 * largest;
	let borderingLeft = x == -1 * largest && y != -1 * largest && y != largest;
	let borderingTop = y == -1 * largest && x != -1 * largest && x != largest;
	// console.log('top-right bottom-right bottom-left top-left');
	// console.log(borderingTopRight, borderingBottomRight, borderingBottomLeft, borderingTopLeft);
	// console.log('right bottom left top');
	// console.log(borderingRight, borderingBottom, borderingLeft, borderingTop);
	// if reach right edge of furthest node, move down
	// if reach bottom edge of furthest node, move left
	// if reach left edge of furthest node, move up
	// if reach top edge of furthest node, move right
	// exception: top right of grid to move out of grid
	if (borderingRight) return [x, ++y];
	if (borderingBottomRight || (borderingBottom && !borderingBottomLeft))
		return [--x, y];
	if (borderingBottomLeft || borderingLeft) return [x, --y];
	if (borderingTopLeft || borderingTopRight || borderingTop) return [++x, y];
	// update diagram size if not defined
	// return error if none of the cases above
	return alert("Invalid sequence");
}

function convertToInstructions(list) {
	let inst = "";
	// iterate list
	for (let val of list) {
		inst += "\n\n";
		if (val.id) inst += "ID " + val.id;
		if (val.name) inst += "\nNAME " + val.name;
		if (val.image) inst += "\nIMAGE " + val.image;
		if (val.relations && val.relations.length > 0)
			for (let rel of val.relations) {
				inst += "\nLINK " + rel.id;
				if (rel.rel) inst += " AS " + rel.rel;
			}
	}
	inst = inst.trim() + "\n\n";
	// console.log(inst);
	return inst;
}

function convertToConfig(value) {
	let list = [];
	// split into lines by newline character
	let lines = value.split("\n");
	let item = { relations: [] };
	for (let line of lines) {
		if (!line) {
			// at least one newline
			if (item.id || item.name) list.push(item);
			item = { relations: [] };
			continue;
		}
		if (line.startsWith("ID")) {
			item.id = line.substring(line.indexOf(" ") + 1);
			if (item.id == "RESERVED") continue;
		}
		if (line.startsWith("NAME"))
			item.name = line.substring(line.indexOf(" ") + 1);
		if (line.startsWith("LINK")) {
			let sub = line.substring(line.indexOf(" ") + 1);
			if (sub.includes("AS")) {
				let parts = sub.split("AS");
				let rel = {
					id: parts[0].trim(),
					rel: parts[1].trim()
				};
				item.relations.push(rel);
			} else item.relations.push({ id: sub });
		}
		if (line.startsWith("AT")) {
			let sub = line.substring(line.indexOf(" ") + 1);
			if (sub.includes("BY")) {
				let parts = sub.split("BY");
				item.x = parseInt(parts[0]);
				item.y = parseInt(parts[1]);
			} else item.x = parseInt(sub);
		}
		if (line.startsWith("IMAGE")) {
			let sub = line.substring(line.indexOf(" ") + 1);
			item.image = sub;
		}
	}
	// console.log(list);
	return list;
}

//--INITIAL--//
function startup() {
	// initialize data
	window.data = {
		...config
	};
	// if have storage
	let storage = localStorage.getItem(window.data.id);
	if (storage) window.data = JSON.parse(storage);
	// if have initial config
	if (window.data.command)
		window.data.list = convertToConfig(window.data.command);
	sizeDiagram();
	drawBoard();
}

function sizeDiagram() {
	// diagram size based on window dimensions if no values provided
	if (window.data.diagram?.width)
		diagramSvg.setAttribute("width", window.data.diagram?.width);
	if (window.data.diagram?.height)
		diagramSvg.setAttribute("height", window.data.diagram?.height);
	if (!window.data.diagram?.width || !window.data.diagram?.height) {
		// determine by total elements to render
		let size = window.data.list.length;
		let grid = Math.ceil(Math.sqrt(size)) + 1;
		// console.log(size, grid);
		// [x1,y1] and [x2,y2] be bottom left and top right corner of diagram
		// now dependent on gap and node dimensions
		let x1 = -1 * (window.data.node.gap.horizontal + 1 + window.data.node.width) * grid;
		let y1 = -1 * (window.data.node.gap.vertical + 1 + window.data.node.height) * grid;
		let x2 = 1 * (window.data.node.gap.horizontal + 1 + window.data.node.width) * grid;
		let y2 = 1 * (window.data.node.gap.vertical + 1 + window.data.node.height) * grid;
		// console.log([x1, y1], [x2, y2]);
		diagramSvg.setAttribute("width", x2 - x1);
		diagramSvg.setAttribute("height", y2 - y1);
		console.log("autosize svg", x2 - x1, y2 - y1);
	}
}
