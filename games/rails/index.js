//--DEFAULT SETTINGS--//
const config = {
	id: 'idle-on-rails',
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
		},
		color: "white"
	},
	map: {
		stations: [
			{
				id: 'station-1',
				name: 'Depot',
				x: 0,
				y: 0,
				links: ['station-2','station-3','station-4']
			},
			{
				id: 'station-2',
				name: 'Seaside End',
				x: 120,
				y: -240,
				links: ['station-1','station-3']
			},
			{
				id: 'station-3',
				name: 'Mountain view',
				x: 135,
				y: 500,
				links: ['station-1','station-2']
			},
			{
				id: 'station-4',
				name: 'West Annex',
				x: -200,
				y: -350,
				links: ['station-1']
			},
		]
	},
	game: {
		time: new Date(),
		rate: {
			travel: 10,
			wait: 1,
		}
	}
};

//--HTML DOM NODE REFERENCES--//
const logP = document.querySelector("p.log");
const diagramSvg = document.querySelector("svg.diagram");
const settingsH3 = document.querySelector("h3.settings");
const settingsMenuDiv = settingsH3.querySelector("div.menu");

//--HTML DOM FUNCTIONS--//
function idle() {
	// record time in order to calculate time passed when load in
	window.game.time = new Date();
	save();
}

//--EVENT HANDLERS--//
function toggleSettings() {
	settingsMenuDiv.classList.toggle('hidden');
}

function selectDestination() {
	let destinations = document.createElement('div');
	for(let station of config.map.stations) {
		let dest = document.createElement('button');
		dest.setAttribute('data-id', station.id);
		dest.onclick = function() {
			log(station.name + ' selected.');
		};
		dest.innerText = station.name;
		destinations.appendChild(dest);
	}
	popupContent(destinations);
}

//--FUNCTIONS--//
function log(input) {
	logP += '[' + new Date().toLocaleTimeString() + ']' + input + "\n";
}

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
	for (let item in window.data.stations) {
		let item = window.data.list[i];
		// 1st rect is center, else based on coordinates
		// center of 1st node top left corner + coordinate * no of nodes (min 2)
		let rect1X =
			i == 0
				? (diagramSvg.width.baseVal.value - window.data.node.width) / 2
				: parseInt(document.querySelector(baseId).getAttribute("x")) +
				  item.x *
						(window.data.node.gap.horizontal + 1) *
						window.data.node.width;
		let rect1Y =
			i == 0
				? (diagramSvg.height.baseVal.value - window.data.node.height) / 2
				: parseInt(document.querySelector(baseId).getAttribute("y")) +
				  item.y *
						(window.data.node.gap.vertical + 1) *
						window.data.node.height;
		// draw rect
		let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.id = item.id;
		rect.classList.add("node");
		rect.setAttribute("data-id", item.id);
		rect.setAttribute("x", rect1X);
		rect.setAttribute("y", rect1Y);
		rect.setAttribute("width", window.data.node.width);
		rect.setAttribute("height", window.data.node.height);
		rect.setAttribute("rx", window.data.curve);
		rect.setAttribute("fill", "var(--background)");
		if (window.data.palette)
			rect.setAttribute(
				"fill",
				typeof window.data.palette == "object"
					? window.data.palette[i % window.data.palette.length]
					: window.data.palette
			);
		if (item.color && item.color.bg) rect.setAttribute("fill", item.color.bg);
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
			textArea.setAttribute(
				"width",
				window.data.node.width - window.data.node.border
			);
			textArea.setAttribute(
				"height",
				window.data.node.height - window.data.node.border
			);
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
			textArea.setAttribute(
				"width",
				window.data.node.width - window.data.node.border
			);
			textArea.setAttribute(
				"height",
				window.data.node.height - window.data.node.border
			);
			let textDiv = document.createElement("div");
			textDiv.innerText = item.name;
			textDiv.style.color = window.data.node.color || "var(--foreground)";
			textDiv.style.background = "var(--background)";
			textDiv.style.borderRadius =
				window.data.curve - 0.5 * window.data.node.border + "px";
			if (window.data.palette)
				textDiv.style.background =
					typeof window.data.palette == "object"
						? window.data.palette[i % window.data.palette.length]
						: window.data.palette;
			if (item.color) {
				textDiv.style.background = item.color.bg;
				textDiv.style.color = item.color.text;
			}
			textArea.appendChild(textDiv);
			diagramSvg.appendChild(textArea);
		}
	}
}

function drawLines() {
	// convert
	let points = [];
	for (let node of window.data.stations) {
		points.push(
			...node.links.map(function (r) {
				return {
					source: node.id,
					destination: r
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
		// adjust for center of nodes and destination border if any
		let adjustNodeCenter = true;
		// adjust for corners of nodes and destination border if any
		let adjustNodeCorner = false;
		let deltaX = destX - sourceX;
		let deltaY = destY - sourceY;
		let angle = Math.atan2(deltaY, deltaX);
		let threshold1 = Math.atan2(window.data.node.height, window.data.node.width);
		let threshold2 = Math.atan2(
			window.data.node.height,
			-1 * window.data.node.width
		);
		// with respect to x plane facing right (absolute angle)
		// 0 radian < (by height) < threshold1 < (by width) < threshold2 < (by height) < 3.14 radian
		// console.log(label, Math.abs(angle), threshold1, threshold2);
		if (adjustNodeCenter && Math.abs(angle) < threshold1) {
			let refWidth = 0.5 * window.data.node.width;
			let refAngle = Math.abs(angle);
			let refLength = refWidth / Math.cos(refAngle);
			let refHeight = Math.sqrt(refLength * refLength - refWidth * refWidth);
			// console.log("by height", refAngle, refWidth, refHeight);
			sourceX += refWidth;
			destX -= refWidth;
			if (deltaY < 0) {
				sourceY -= refHeight;
				destY += refHeight;
			} // 4
			if (deltaY > 0) {
				sourceY += refHeight;
				destY -= refHeight;
			} // 6
		}
		if (
			adjustNodeCenter &&
			Math.abs(angle) >= threshold1 &&
			Math.abs(angle) < threshold2
		) {
			let refHeight = 0.5 * window.data.node.height;
			let refAngle = null;
			if (Math.abs(angle) <= Math.PI / 4) {
				refAngle = Math.PI / 4 - Math.abs(angle);
			} else {
				refAngle = -1 * (Math.PI / 2 - Math.abs(angle));
			}
			let refLength = refHeight / Math.cos(refAngle);
			let refWidth = Math.sqrt(refLength * refLength - refHeight * refHeight);
			if (Math.abs(angle) == threshold1) refWidth = 0.5 * window.data.node.width;
			// console.log("by width", refAngle, refWidth, refHeight);
			if (deltaX > 0 && deltaY < 0) {
				sourceX += refWidth;
				destX -= refWidth;
				sourceY -= refHeight;
				destY += refHeight;
			} // 5
			if (deltaX < 0 && deltaY < 0) {
				sourceX -= refWidth;
				destX += refWidth;
				sourceY -= refHeight;
				destY += refHeight;
			} // 16
			if (deltaX < 0 && deltaY > 0) {
				sourceX -= refWidth;
				destX += refWidth;
				sourceY += refHeight;
				destY -= refHeight;
			} // 12
			if (deltaX > 0 && deltaY > 0) {
				sourceX += refWidth;
				destX -= refWidth;
				sourceY += refHeight;
				destY -= refHeight;
			} // 17
			if (deltaX == 0 && deltaY > 0) {
				sourceY += refHeight;
				destY -= refHeight;
			} // 13
			if (deltaX == 0 && deltaY < 0) {
				sourceY -= refHeight;
				destY += refHeight;
			} // 3
		}
		if (adjustNodeCenter && Math.abs(angle) >= threshold2) {
			let refWidth = 0.5 * window.data.node.width;
			let refAngle = Math.PI / 2 - Math.abs(angle);
			let refLength = refWidth / Math.sin(refAngle);
			let refHeight = Math.sqrt(refLength * refLength - refWidth * refWidth);
			if (Math.abs(angle) == threshold2) refHeight = 0.5 * window.data.node.height;
			// console.log("by height", refAngle, refWidth, refHeight);
			sourceX -= refWidth;
			destX += refWidth;
			if (deltaY > 0) {
				sourceY += refHeight;
				destY -= refHeight;
			} // 11
			if (deltaY < 0) {
				sourceY -= refHeight;
				destY += refHeight;
			}
		}
		if (adjustNodeCorner && sourceX > destX) {
			// left: move source left, move dest right
			sourceX -= 0.5 * window.data.node.width;
			destX += 0.5 * window.data.node.width + 0.5 * window.data.node.border;
		}
		if (adjustNodeCorner && sourceX < destX) {
			// right: move source right, move dest left
			sourceX += 0.5 * window.data.node.width;
			destX -= 0.5 * window.data.node.width + 0.5 * window.data.node.border;
		}
		// vertical line: adjust y
		if (adjustNodeCorner && sourceY > destY) {
			// up: move source up, move dest down
			sourceY -= 0.5 * window.data.node.height;
			destY += 0.5 * window.data.node.height + 0.5 * window.data.node.border;
		}
		if (adjustNodeCorner && sourceY < destY) {
			// down: move source down, move source up
			sourceY += 0.5 * window.data.node.height;
			destY -= 0.5 * window.data.node.height + 0.5 * window.data.node.border;
		}
		// adjust for marker
		let markerViewboxWidth = 16; // 2 * viewBox width
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
		// line.setAttribute("marker-end", "url(#triangle)");
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
			let padding = 10;
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
			wrapper.setAttribute(
				"rx",
				0.5 * (textBox.getBoundingClientRect().height + padding)
			);
			// remove initial box for calculation, render wrapper first
			diagramSvg.removeChild(textBox);
			diagramSvg.appendChild(wrapper);
			diagramSvg.appendChild(textBox);
		}
	}
}

function chartProgress() {
	let lastPos = window.data.last || { x: 0, y: 0, id: 'station-1' };
	let timeDiffSec = Math.floor((new Date() - new Date(window.game.time)) / 1000);
	let tries = 10;
	while(timeDiffSec > 0 && tries > 0) {
		// travel to random destination
		let links = window.data.stations.find(s => s.links.includes(lastPos.id))?.links;
		let id = links[Math.floor(Math.random()*(links.length-1))];
		let station = window.data.stations.find(s => s.id == id);
		if(station) {
			// if on station, new position at station, calc again
			if(timeDiffSec - nextDest.distance * window.game.rate.travel > 0) {
				window.data.last = { x: station.x, y: station.y, id: station.id };
				timeDiffSec -= nextDest.distance * window.game.rate.travel;
				continue;
			}
			// if en route, calculate new position
			else {
				let distance = Math.floor(timeDiffSec / window.game.rate.travel);
				let newPos = {
					x: pointAtDistance(window.data.last.x, station.x, distance),
					y: pointAtDistance(window.data.last.y, station.y, distance),
				};
				window.data.last = newPos;
				timeDiffSec = 0;
				continue;
			}
		}
		// flush array by replacing with new position

		// if all else fails, retry
		tries++;
	}
	if(!tries)
		return console.error('max retry reached');
}

function nearestPoint(points, ref) {
  let best = null;
  let bestDist = 0;

  for (const p of points.filter(f => f.x != ref.x && f.y != ref.y)) {
    const dx = p.x - ref.x;
    const dy = p.y - ref.y;
    const d2 = dx * dx + dy * dy;

    if (d2 < bestDist) {
      bestDist = d2;
      best = p.id;
    }
  }
  if(bestDist)
	return {
		id: best,
		distance: bestDist
	};
}

function pointAtDistance(a, b, dist) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const D = Math.hypot(dx, dy);

  if (D === 0) return { ...a };

  const t = dist / D;

  return {
    x: a.x + dx * t,
    y: a.y + dy * t
  };
}

//--DIALOG--//
function popupContent(input) {
	if(!input) {
		alert('No content found');
		return;
	}
	// create dialog component if missing
	let dialog = document.querySelector('.dialog');
	if(!dialog) {
		dialog = document.createElement('dialog');
		dialog.tabIndex = 0;
		dialog.addEventListener('click', function() {
			if(event.target == document.querySelector('dialog'))
				removeDialog();
		});
		dialog.addEventListener('keyup', function() {
			if(event.key != 'Space' || event.key != 'Enter') return;
			if(event.target.closest('.content')) return;
			event.preventDefault();
			removeDialog();
		});
		document.body.appendChild(dialog);
	}
	dialog.className = 'dialog';

	let dialogDiv = createDialog(input);
	dialog.innerHTML = '';
	dialog.appendChild(dialogDiv);
	dialog.showModal();
	setTimeout(function() {
		document.querySelector('.dialog').classList.add('open');
	}, 0);
}

function createDialog(node) {
	// Helper function to create dialog with content
	// Note: Node in dialog will not have events! Manual add back or write as attribute!
	let box = document.createElement('div');
	if(typeof node == 'string') {
		box.classList.add('box');
		box.innerHTML = node;
	}
	if(typeof node == 'object') {
		box.classList.add('content');
		let clonedNode = node.cloneNode(true);
		box.appendChild(clonedNode);
	}
	return box;
}

function removeDialog() {
	document.querySelector('.dialog')?.classList.remove('open');
	setTimeout(function() {
		document.querySelector('.dialog')?.close();
	}, 250);
}

//--STORAGE--//
function load() {
	// initialize data
	window.data = {
		...config
	};
	// if have storage
	let storage = localStorage.getItem(window.data.id);
	if (storage)
		window.data = {
			...JSON.parse(storage)
		};
}

function save() {
	localStorage.setItem(window.data.id, window.data);
}

//--INITIAL--//
function startup() {
	load();
	sizeDiagram();
	drawBoard();
	chartProgress();
}

function sizeDiagram() {
	// diagram size based on window dimensions if no values provided
	if (window.data.diagram?.width)
		diagramSvg.setAttribute("width", window.data.diagram?.width);
	if (window.data.diagram?.height)
		diagramSvg.setAttribute("height", window.data.diagram?.height);
	if (!window.data.diagram?.width || !window.data.diagram?.height) {
		// determine by parent element
		let parent = diagramSvg.parentElement.getBoundingClientRect();
		diagramSvg.setAttribute("width", parent.width);
		diagramSvg.setAttribute("height", parent.height);
		console.log("autosize svg", parent.width, parent.height);
	}
}
