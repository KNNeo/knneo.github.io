//--DEFAULT SETTINGS--//
const config = {
	id: "relationship-chart",
	diagram: {
		// width: 1400,
		// height: 840,
		border: 5
	},
	node: {
		width: 100,
		height: 60
	},
	arrow: { size: 4 },
	gap: {
		horizontal: 1,
		vertical: 1
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
LINK user1 AS Colleagues

ID RESERVED

ID user5
NAME Janson
LINK user1 AS Bestie

ID user6
NAME Bob
LINK user1 AS Father

ID user7
NAME Peter
LINK user6 AS Brother

ID user8
NAME Justin
LINK user7 AS Cousin

ID user9
NAME Alicia
LINK user8 AS Daughter

ID user10
NAME Jan
LINK user1 AS Acquaintance
LINK user6 AS Friend
LINK user3 AS Friend

ID RESERVED

ID RESERVED

ID user4
NAME Henry
LINK user3 AS Friend

`
};

//--HTML DOM NODE REFERENCES--//
const diagramDiv = document.querySelector(".diagram");
const viewerDiv = document.querySelector(".viewer");
const editorTextarea = document.querySelector(".editor");

//--HTML DOM FUNCTIONS--//
function onKeyDown() {}

//--EVENT HANDLERS--//
function openEditor() {
	viewerDiv.classList.remove("hidden");
	editorTextarea.value = convertToInstructions(window.data.list);
}

function closeEditor() {
	viewerDiv.classList.add("hidden");
}

function onPreview() {
	if (!editorTextarea.value.endsWith("\n\n")) editorTextarea.value += "\n\n";
	try {
		window.data = {
			...config,
			list: convertToConfig(editorTextarea.value)
		};
		drawBoard();
		closeEditor();
		localStorage.setItem(config.id, JSON.stringify(window.data));
	} catch {
		if (confirm("JSON format invalid: Click on OK to reset, or Cancel to fix.")) {
			startup();
			closeEditor();
		}
	}
}

//--FUNCTIONS--//
function drawBoard() {
	diagramDiv.innerHTML = "";
	drawResources();
	drawNodes();
	drawLines();
}

function drawResources() {
	// arrow marker
	let arrow = document.createElementNS("http://www.w3.org/2000/svg", "marker");
	arrow.id = "triangle";
	arrow.setAttribute("xmlns", "http://www.w3.org/2000/svg");
	arrow.setAttribute("viewBox", "0 0 " + 4 * config.arrow.size + " 10");
	arrow.setAttribute("refX", config.arrow.size - 3);
	arrow.setAttribute("refY", "5");
	arrow.setAttribute("markerUnits", "strokeWidth");
	arrow.setAttribute("markerWidth", (config.arrow.size / 3) * 4);
	arrow.setAttribute("markerHeight", config.arrow.size);
	arrow.setAttribute("orient", "auto");
	arrow.setAttribute("fill", "var(--foreground)");
	// arrow path (fixed)
	let arrowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
	// first L is for line, second is for marker
	arrowPath.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
	arrow.appendChild(arrowPath);
	diagramDiv.appendChild(arrow);
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
				? (diagramDiv.width.baseVal.value - config.node.width) / 2
				: parseInt(document.querySelector(baseId).getAttribute("x")) +
				  coordinates[0] * (config.gap.horizontal + 1) * config.node.width;
		let rect1Y =
			i == 0
				? (diagramDiv.height.baseVal.value - config.node.height) / 2
				: parseInt(document.querySelector(baseId).getAttribute("y")) +
				  coordinates[1] * (config.gap.vertical + 1) * config.node.height;
		// draw rect
		let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.id = item.id;
		rect.classList.add("node");
		rect.setAttribute("data-id", item.id);
		rect.setAttribute("x", rect1X);
		rect.setAttribute("y", rect1Y);
		rect.setAttribute("width", config.node.width);
		rect.setAttribute("height", config.node.height);
		rect.setAttribute("fill", config.palette[i % config.palette.length]);
		rect.setAttribute("stroke", "var(--foreground)");
		rect.setAttribute("stroke-width", config.diagram.border);
		if (item.id != "RESERVED") diagramDiv.appendChild(rect);
		if (item.image) {
			let textArea = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"foreignObject"
			);
			textArea.setAttribute("x", rect1X + 0.5 * config.diagram.border);
			textArea.setAttribute("y", rect1Y + 0.5 * config.diagram.border);
			textArea.setAttribute("width", config.node.width - config.diagram.border);
			textArea.setAttribute("height", config.node.height - config.diagram.border);
			let img = document.createElement("object");
			img.setAttribute("data", item.image);
			img.setAttribute("x", rect1X);
			img.setAttribute("y", rect1Y);
			img.setAttribute("width", config.node.width);
			img.setAttribute("height", config.node.height);
			textArea.appendChild(img);
			diagramDiv.appendChild(textArea);
		}
		if (item.name) {
			// draw text box
			let textArea = document.createElementNS(
				"http://www.w3.org/2000/svg",
				"foreignObject"
			);
			textArea.setAttribute("x", rect1X + 0.5 * config.diagram.border);
			textArea.setAttribute("y", rect1Y + 0.5 * config.diagram.border);
			textArea.setAttribute("width", config.node.width - config.diagram.border);
			textArea.setAttribute("height", config.node.height - config.diagram.border);
			let textDiv = document.createElement("div");
			textDiv.innerText = item.name;
			textDiv.style.background = config.palette[i % config.palette.length];
			textArea.appendChild(textDiv);
			diagramDiv.appendChild(textArea);
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
		// create line
		let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
		// find start end points from edge of node to another
		let sourceX =
			parseInt(
				document.querySelector("[data-id=" + source + "]").getAttribute("x")
			) +
			0.5 * config.node.width;
		let sourceY =
			parseInt(
				document.querySelector("[data-id=" + source + "]").getAttribute("y")
			) +
			0.5 * config.node.height;
		let destX =
			parseInt(
				document.querySelector("[data-id=" + destination + "]").getAttribute("x")
			) +
			0.5 * config.node.width;
		let destY =
			parseInt(
				document.querySelector("[data-id=" + destination + "]").getAttribute("y")
			) +
			0.5 * config.node.height;
		// calculate delta
		// horizontal line
		if (sourceY == destY) {
			let delta = destX - sourceX;
			sourceX += (delta > 0 ? 1 : -1) * 0.5 * config.node.width;
			destX +=
				(delta > 0 ? -1 : 1) * 0.5 * config.node.width + (delta > 0 ? -15 : 15);
		}
		// vertical line
		else if (sourceX == destX) {
			let delta = destY - sourceY;
			sourceY += (delta > 0 ? 1 : -1) * 0.5 * config.node.height;
			destY +=
				(delta > 0 ? -1 : 1) * 0.5 * config.node.height + (delta > 0 ? -15 : 15);
		}
		// diagonal line
		else {
			let markerWidth = (config.arrow.size / 3) * 4 + 5;
			let deltaX = destX - sourceX;
			let deltaY = destY - sourceY;
			// for direction out of center of node
			sourceX += (deltaX > 0 ? 1 : -1) * 0.5 * config.node.width;
			sourceY += (deltaY > 0 ? 1 : -1) * 0.5 * config.node.height;
			// for direction out of center of node and marker width
			destX +=
				(deltaX > 0 ? -1 : 1) * 0.5 * config.node.width +
				(deltaX > 0 ? -1 : 1) * markerWidth;
			destY +=
				(deltaY > 0 ? -1 : 1) * 0.5 * config.node.height +
				(deltaY > 0 ? -1 : 1) * markerWidth;
			// for arrows spanning multiple number of nodes
			if (Math.abs(deltaY) > 2 * config.node.height) destX -= 0.5 * markerWidth;
			if (Math.abs(deltaX) > 2 * config.node.width) destY += 0.5 * markerWidth;
		}
		// draw line
		let deltaY = sourceX == destX ? config.node.height : 0;
		line.setAttribute("x1", sourceX);
		line.setAttribute("y1", sourceY);
		line.setAttribute("x2", destX);
		line.setAttribute("y2", destY);
		line.setAttribute("stroke", "var(--foreground)");
		line.setAttribute("stroke-width", 5);
		line.setAttribute("marker-end", "url(#triangle)");
		diagramDiv.appendChild(line);
		// draw textBox
		if (label) {
			let textBox = document.createElementNS("http://www.w3.org/2000/svg", "text");
			textBox.setAttribute("font-size", "0.8em");
			textBox.setAttribute("fill", "var(--background)");
			textBox.innerHTML = label;
			diagramDiv.appendChild(textBox);
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
			diagramDiv.removeChild(textBox);
			diagramDiv.appendChild(wrapper);
			diagramDiv.appendChild(textBox);
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
	let storage = localStorage.getItem(config.id);
	if(storage)
		window.data = JSON.parse(storage);
	// if have initial config
	if (config.command)
		window.data.list = convertToConfig(config.command);
	sizeDiagram();
	drawBoard();
}

function resize() {
	sizeDiagram();
	drawBoard();
}

function sizeDiagram() {
	// diagram size based on window dimensions if no values provided
	if (config.diagram?.width)
		diagramDiv.setAttribute("width", config.diagram?.width);
	if (config.diagram?.height)
		diagramDiv.setAttribute("height", config.diagram?.height);
	if (!config.diagram?.width || !config.diagram?.height) {
		// determine by total elements to render
		let size = window.data.list.length;
		let grid = Math.ceil(Math.sqrt(size)) + 1;
		// console.log(size, grid);
		// [x1,y1] and [x2,y2] be bottom left and top right corner of diagram
		// now dependent on gap and node dimensions
		let x1 = -1 * (config.gap.horizontal + 1 + config.node.width) * grid;
		let y1 = -1 * (config.gap.vertical + 1 + config.node.height) * grid;
		let x2 = 1 * (config.gap.horizontal + 1 + config.node.width) * grid;
		let y2 = 1 * (config.gap.vertical + 1 + config.node.height) * grid;
		// console.log([x1, y1], [x2, y2]);
		diagramDiv.setAttribute("width", x2 - x1);
		diagramDiv.setAttribute("height", y2 - y1);
		console.log("autosize svg", x2 - x1, y2 - y1);
	}
}
