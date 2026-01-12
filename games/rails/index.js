//--DEFAULT SETTINGS--//
const config = {
	debug: true,
	id: 'idle-on-rails',
	date: '20260112',
	diagram: {
		// width: 1400,
		// height: 840,
	},
	node: {
		curve: 8,
		width: 100,
		height: 60,
		border: 5
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
				x: 620,
				y: -140,
				links: ['station-1','station-3']
			},
			{
				id: 'station-3',
				name: 'Mountain View',
				x: 535,
				y: 200,
				links: ['station-1','station-2']
			},
			{
				id: 'station-4',
				name: 'West Annex',
				x: -350,
				y: 100,
				links: ['station-1']
			},
		]
	},
	game: {
		time: new Date(),
		cost: {
			travel: 20,
			wait: 1,
		}
	}
};

//--HTML DOM NODE REFERENCES--//
const logDiv = document.querySelector("div.log");
const logListDiv = document.querySelector("div.log-list");
const diagramSvg = document.querySelector("svg.diagram");
const settingsDiv = document.querySelector("div.settings");
const settingsMenuDiv = settingsDiv.querySelector("div.menu");

//--HTML DOM FUNCTIONS--//
function idle() {
	// record time in order to calculate time passed when load in
	window.data.game.time = new Date();
	save();
}

//--EVENT HANDLERS--//
function toggleSettings() {
	settingsMenuDiv.classList.toggle('hidden');
}

function toggleLog() {
	let icon = logDiv.querySelector('.bi');
	icon.classList.toggle('bi-list');
	icon.classList.toggle('bi-list-columns-reverse');
	logListDiv.classList.toggle('hidden');
	if(!logListDiv.classList.contains('hidden'))
		logListDiv.scrollTo(0, logListDiv.scrollHeight);
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
	logListDiv.innerHTML += (logListDiv.innerHTML ? '<br>' : '') + '[' + new Date().toLocaleTimeString() + '] ' + input;
	if(!logListDiv.classList.contains('hidden'))
		logListDiv.scrollTo(0, logListDiv.scrollHeight);
}

function updateConfig() {
	// window.data vs config
	if(!window.data.date || window.data.date != config.date) {
		window.data.date = config.date;
		// only allow add
		if(config.map.stations.length > window.data.map.stations.length)
			window.data.map.stations = config.map.stations;
		save();
	}
}

function drawBoard() {
	diagramSvg.innerHTML = "";
	drawResources();
	drawLines();
	drawNodes();
	drawTrain();
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
	let diagWidth = parseInt(diagramSvg.getAttribute("width"));
	let diagHeight = parseInt(diagramSvg.getAttribute("height"));
	// add train into stations
	for (let item of window.data.map.stations) {
		// 1st rect is center, else based on coordinates
		// center of 1st node top left corner + coordinate * no of nodes (min 2)
		let rect1X = 0.5*diagWidth + item.x - window.data.node.width;
		let rect1Y = 0.5*diagHeight + item.y - window.data.node.height;
		// draw rect
		let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		rect.id = item.id;
		rect.classList.add("node");
		rect.setAttribute("data-id", item.id);
		rect.setAttribute("x", rect1X);
		rect.setAttribute("y", rect1Y);
		rect.setAttribute("width", window.data.node.width);
		rect.setAttribute("height", window.data.node.height);
		rect.setAttribute("rx", window.data.node.curve);
		rect.setAttribute("fill", "var(--background)");
		if (window.data.palette)
			rect.setAttribute("fill", window.data.palette[0]);
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
			img.title = item.name;
			img.setAttribute("data", item.image);
			if(item.image.startsWith("data:") && item.image.includes(';')) {
				let pieces = item.image.split(';');
				img.setAttribute("type", pieces[0].replace("data:",""));
				img.setAttribute("data", item.image);
			}
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
			textDiv.title = item.name;
			textDiv.innerText = item.name;
			textDiv.style.color = "var(--foreground)";
			textDiv.style.background = "var(--background)";
			textDiv.style.borderRadius =
				window.data.curve - 0.5 * window.data.node.border + "px";
			if (window.data.palette)
				textDiv.style.background = window.data.palette[0];
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
	for (let node of window.data.map.stations) {
		if(node.links)
			points.push(
				...node.links.map(function (r) {
					return {
						source: node.id,
						destination: r
					};
				})
			);
	}
	let diagWidth = parseInt(diagramSvg.getAttribute("width"));
	let diagHeight = parseInt(diagramSvg.getAttribute("height"));
	// plot lines
	for (let point of points) {
		let { source, destination, label } = point;
		if(document.querySelector("#" + source + "_" + destination) || document.querySelector("#" + destination + "_" + source))
			continue;
		// find start end points from center of node to another
		// excludes marker size
		let sourceStation = window.data.map.stations.find(s => s.id == source);
		let destStation = window.data.map.stations.find(s => s.id == destination);
		let rect1X = 0.5*diagWidth + sourceStation.x - window.data.node.width;
		let rect1Y = 0.5*diagHeight + sourceStation.y - window.data.node.height;
		let rect2X = 0.5*diagWidth + destStation.x - window.data.node.width;
		let rect2Y = 0.5*diagHeight + destStation.y - window.data.node.height;
		let sourceX =
			rect1X +
			0.5 * window.data.node.width;
		let sourceY =
			rect1Y +
			0.5 * window.data.node.height;
		let destX =
			rect2X +
			0.5 * window.data.node.width;
		let destY =
			rect2Y +
			0.5 * window.data.node.height;
		let deltaX = destX - sourceX;
		let deltaY = destY - sourceY;
		let angle = Math.atan2(deltaY, deltaX);
		let threshold1 = Math.atan2(window.data.node.height, window.data.node.width);
		let threshold2 = Math.atan2(
			window.data.node.height,
			-1 * window.data.node.width
		);
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
		line.id = source + "_" + destination;
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

function drawTrain() {
	let lastPos = window.data.last || { x: 0, y: 0, id: 'station-1' };
	let train = {
		image: "data:image/svg+xml;utf8,%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%201024%201024%22%20class%3D%22icon%22%20%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M232.2%20927.5m-79.5%200a79.5%2079.5%200%201%200%20159%200%2079.5%2079.5%200%201%200-159%200Z%22%20fill%3D%22%238599A4%22%20%2F%3E%3Cpath%20d%3D%22M232.2%201015.9c-48.8%200-88.5-39.7-88.5-88.5s39.7-88.5%2088.5-88.5%2088.5%2039.7%2088.5%2088.5-39.7%2088.5-88.5%2088.5z%20m0-158.9c-38.9%200-70.5%2031.6-70.5%2070.5s31.6%2070.5%2070.5%2070.5%2070.5-31.6%2070.5-70.5-31.6-70.5-70.5-70.5z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M391.2%20927.5m-79.5%200a79.5%2079.5%200%201%200%20159%200%2079.5%2079.5%200%201%200-159%200Z%22%20fill%3D%22%238599A4%22%20%2F%3E%3Cpath%20d%3D%22M391.2%201015.9c-48.8%200-88.5-39.7-88.5-88.5s39.7-88.5%2088.5-88.5%2088.5%2039.7%2088.5%2088.5-39.7%2088.5-88.5%2088.5z%20m0-158.9c-38.9%200-70.5%2031.6-70.5%2070.5s31.6%2070.5%2070.5%2070.5%2070.5-31.6%2070.5-70.5S430%20857%20391.2%20857z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M550.1%20927.5m-79.5%200a79.5%2079.5%200%201%200%20159%200%2079.5%2079.5%200%201%200-159%200Z%22%20fill%3D%22%238599A4%22%20%2F%3E%3Cpath%20d%3D%22M550.1%201015.9c-48.8%200-88.5-39.7-88.5-88.5s39.7-88.5%2088.5-88.5%2088.5%2039.7%2088.5%2088.5-39.7%2088.5-88.5%2088.5z%20m0-158.9c-38.9%200-70.5%2031.6-70.5%2070.5s31.6%2070.5%2070.5%2070.5%2070.5-31.6%2070.5-70.5S589%20857%20550.1%20857z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M709%20927.5m-79.5%200a79.5%2079.5%200%201%200%20159%200%2079.5%2079.5%200%201%200-159%200Z%22%20fill%3D%22%238599A4%22%20%2F%3E%3Cpath%20d%3D%22M709%201015.9c-48.8%200-88.5-39.7-88.5-88.5S660.3%20839%20709%20839s88.5%2039.7%2088.5%2088.5-39.7%2088.4-88.5%2088.4z%20m0-158.9c-38.9%200-70.5%2031.6-70.5%2070.5S670.1%20998%20709%20998s70.5-31.6%2070.5-70.5S747.9%20857%20709%20857z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M996%20722.2c0-62.2-50.4-112.6-112.6-112.6H826l-13.2-73.9%2039.7-83.9H700.2l39.7%2083.9-13.2%2073.9H479.5v-44.1h53v-71.1c0-33.9-27.5-61.3-61.3-61.3h-385c-33.9%200-61.3%2027.5-61.3%2061.3v71.1h70.6v339.9h796.8l-24.1-70.6h15.3c62.1%200%20112.5-50.4%20112.5-112.6z%22%20fill%3D%22%23C1E7D8%22%20%2F%3E%3Cpath%20d%3D%22M892.3%20914.4H95.4c-5%200-9-4-9-9V574.5H24.7c-5%200-9-4-9-9v-71.1c0-38.8%2031.6-70.3%2070.3-70.3h385c38.8%200%2070.3%2031.6%2070.3%2070.3v71.1c0%205-4%209-9%209h-44v26.1H719l11.4-63.7-38.5-81.3c-1.3-2.8-1.1-6.1%200.5-8.7%201.7-2.6%204.5-4.2%207.6-4.2h152.3c3.1%200%206%201.6%207.6%204.2%201.6%202.6%201.8%205.9%200.5%208.7l-38.5%2081.3%2011.4%2063.7h49.9c67%200%20121.6%2054.5%20121.6%20121.6s-54.5%20121.6-121.6%20121.6h-2.7l20.1%2058.7c0.9%202.7%200.5%205.8-1.2%208.1s-4.2%203.8-7.1%203.8z%20m-787.9-18h775.3l-20.1-58.7c-0.9-2.7-0.5-5.8%201.2-8.1s4.4-3.8%207.3-3.8h15.3c57.1%200%20103.6-46.5%20103.6-103.6s-46.5-103.6-103.6-103.6H826c-4.4%200-8.1-3.1-8.9-7.4l-13.2-73.9c-0.3-1.8-0.1-3.7%200.7-5.4l33.6-71H714.4l33.6%2071c0.8%201.7%201.1%203.6%200.7%205.4l-13.2%2073.9c-0.8%204.3-4.5%207.4-8.9%207.4H479.5c-5%200-9-4-9-9v-44.1c0-5%204-9%209-9h44v-62.1c0-28.9-23.5-52.3-52.3-52.3h-385c-28.9%200-52.3%2023.5-52.3%2052.3v62.1h61.6c5%200%209%204%209%209v330.9z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M391.2%20710.6H181.6V558.8h209.6z%22%20fill%3D%22%239B5C77%22%20%2F%3E%3Cpath%20d%3D%22M391.2%20719.6H181.6c-5%200-9-4-9-9V558.8c0-5%204-9%209-9h209.5c5%200%209%204%209%209v151.8c0.1%205-4%209-8.9%209z%20m-200.6-18h191.5V567.8H190.6v133.8z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M286.4%20719.6c-5%200-9-4-9-9V558.8c0-5%204-9%209-9s9%204%209%209v151.8c0%205-4%209-9%209zM614.1%20618.6c-5%200-9-4-9-9v-63.2c0-5%204-9%209-9s9%204%209%209v63.2c0%205-4%209-9%209z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M641.7%20551.3h-55.2c-5%200-9-4-9-9s4-9%209-9h55.2c5%200%209%204%209%209s-4%209-9%209z%22%20fill%3D%22%233E4152%22%20%2F%3E%3Cpath%20d%3D%22M788.3%20184.5c0-0.7%200.2-1.4%200.2-2%200-39.6-53.4-71.7-119.2-71.7-14.2%200-27.8%201.6-40.4%204.3%200.4-3.2%200.7-6.5%200.7-9.8%200-49.4-47.2-89.4-105.4-89.4-36.9%200-69.3%2016.1-88.1%2040.4-21.4-17-48.5-27.2-78-27.2-69.5%200-125.8%2056.3-125.8%20125.8s56.3%20125.8%20125.8%20125.8c21%200%2040.7-5.2%2058.1-14.3%2023.5%2027.6%2058.4%2045.2%2097.5%2045.2%2046.9%200%2087.7-25.3%20110.1-62.8%2012%203%2025%204.8%2038.6%205.2-1.2%206.5-1.8%2013.2-1.8%2020.1%200%2054.9%2040%2099.3%2089.4%2099.3s89.4-44.5%2089.4-99.3c-0.1-39.6-21-73.6-51.1-89.6z%22%20fill%3D%22%23ACD8CB%22%20%2F%3E%3Cpath%20d%3D%22M749.9%20382.4c-54.3%200-98.4-48.6-98.4-108.3%200-3.9%200.2-7.8%200.6-11.7-8.3-0.7-16.3-1.8-24.1-3.5-11.6%2017.6-27.3%2032.4-45.5%2043.1-20.8%2012.1-44.6%2018.6-68.8%2018.6-37.9%200-73.8-15.6-99.7-43.1-17.6%208.1-36.4%2012.2-55.9%2012.2-74.3%200-134.8-60.5-134.8-134.8S283.7%2020.1%20358.1%2020.1c27.7%200%2054%208.2%2076.6%2023.9%2021.6-23.4%2054.4-37.2%2089.5-37.2%2062.7%200%20113.7%2043.5%20114.4%2097.3%2010.1-1.6%2020.4-2.4%2030.7-2.4%2033.5%200%2065%207.9%2088.9%2022.3%2024.1%2014.5%2037.9%2034.1%2039.2%2055.3%2014.4%208.8%2026.6%2021.3%2035.5%2036.6%2010.1%2017.3%2015.4%2037.5%2015.4%2058.1%200%2059.8-44.2%20108.4-98.4%20108.4zM623.7%20239.8c0.7%200%201.5%200.1%202.2%200.3%2011.4%202.9%2023.8%204.5%2036.7%205%202.6%200.1%205.1%201.3%206.7%203.4%201.6%202%202.3%204.7%201.8%207.3-1.1%206-1.7%2012.2-1.7%2018.4%200%2049.8%2036.1%2090.3%2080.4%2090.3s80.4-40.5%2080.4-90.3c0-34.7-18.1-66.7-46.2-81.6-3.1-1.6-4.9-4.9-4.8-8.4%200-0.5%200.1-1%200.1-1.5v-0.2c-0.1-15.8-10.9-31.1-30.6-42.9-21.1-12.7-49.4-19.7-79.6-19.7-13%200-25.9%201.4-38.5%204.1-2.9%200.6-5.8-0.2-8-2.2s-3.2-4.9-2.8-7.8c0.4-3.1%200.6-5.9%200.6-8.7%200-44.3-43.2-80.4-96.4-80.4-32.8%200-63.1%2013.8-81%2036.9-1.5%201.9-3.6%203.1-6%203.4-2.4%200.3-4.8-0.4-6.7-1.9-20.9-16.5-45.9-25.2-72.4-25.2-64.4%200-116.8%2052.4-116.8%20116.8s52.4%20116.8%20116.8%20116.8c18.9%200%2037.1-4.5%2053.9-13.3%203.7-1.9%208.3-1.1%2011%202.1%2022.7%2026.7%2055.8%2042%2090.7%2042%2021%200%2041.7-5.6%2059.7-16.1%2017.5-10.2%2032.2-24.9%2042.6-42.3%201.8-2.7%204.8-4.3%207.9-4.3z%22%20fill%3D%22%233E4152%22%20%2F%3E%3C%2Fsvg%3E",
		id: "train",
		x: lastPos.x,
		y: lastPos.y,
	};
	let trainSize = Math.min(window.data.node.width, window.data.node.height);
	let diagWidth = parseInt(diagramSvg.getAttribute("width"));
	let diagHeight = parseInt(diagramSvg.getAttribute("height"));
	let rect1X = 0.5*diagWidth + train.x - 0.5*trainSize - 0.5*window.data.node.width;
	let rect1Y = 0.5*diagHeight + train.y - 0.5*trainSize - 0.5*window.data.node.height;
	let textArea = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"foreignObject"
	);
	textArea.id = train.id;
	textArea.setAttribute("x", rect1X);
	textArea.setAttribute("y", rect1Y);
	textArea.setAttribute("width", trainSize);
	textArea.setAttribute("height", trainSize);
	let img = document.createElement("object");
	img.setAttribute("data", train.image);
	if(train.image.startsWith("data:") && train.image.includes(';')) {
		let pieces = train.image.split(';');
		img.setAttribute("type", pieces[0].replace("data:",""));
		img.setAttribute("data", train.image);
	}
	img.setAttribute("width", trainSize);
	img.setAttribute("height", trainSize);
	textArea.appendChild(img);
	diagramSvg.appendChild(textArea);
}

function chartProgress() {
	if(!window.data.last?.id) window.data.last = { x: 0, y: 0, id: 'station-1' };
	log("train at (" + window.data.last.x.toFixed(0) + "," + window.data.last.y.toFixed(0) + ")");
	let timeDiffSec = Math.floor((new Date() - new Date(window.data.game.time)) / 1000);
	let tries = 10;
	let trainMoved = false;
	let station = window.data.map.stations.find(s => s.id == window.data.last.id);
	if(station) {
		log("train moving towards " + station.name);
		while(timeDiffSec > 0 && tries > 0) {
			tries--; // prevent endless loop
			if(config.debug) console.log('chartProgress', timeDiffSec);
			let distance = findDistance(window.data.last, station);
			if(config.debug) console.log('distance', distance);
			// if at station, set new station
			if(window.data.last.x == station.x && window.data.last.y == station.y) {
				let links = window.data.map.stations.find(s => s.links.includes(window.data.last.id))?.links.filter(l => l != window.data.last.id);
				if(config.debug) console.log(links);
				let nextStation = links[Math.floor(Math.random()*links.length)];
				window.data.last.id = nextStation;
				log("train at station " + nextStation);
				continue;
			}
			// if can reach station, new position at station, calc again
			else if(timeDiffSec - distance * window.data.game.cost.travel > 0) {
				// set new position
				window.data.last = { x: station.x, y: station.y, id: station.id };
				timeDiffSec -= distance * window.data.game.cost.travel;
				trainMoved = true;
				continue;
			}
			// if en route, calculate newest position
			else {
				let distance = Math.floor(timeDiffSec / window.data.game.cost.travel);
				timeDiffSec = 0;
				if(distance > 0) {
					let newPos = pointAtDistance(window.data.last, station, distance);
					// set new position
					window.data.last = { ...newPos, id: station.id };
					trainMoved = true;
				}
				continue;
			}
		}
	}
	if(!tries)
		return console.error('max retry reached');
	// update train position
	let train = document.querySelector("#train");
	if(train) {
		let trainSize = Math.min(window.data.node.width, window.data.node.height);
		let diagWidth = parseInt(diagramSvg.getAttribute("width"));
		let diagHeight = parseInt(diagramSvg.getAttribute("height"));
		let rect1X = 0.5*diagWidth + window.data.last.x - 0.5*trainSize - 0.5*window.data.node.width;
		let rect1Y = 0.5*diagHeight + window.data.last.y - 0.5*trainSize - 0.5*window.data.node.height;
		let station = window.data.map.stations.find(s => s.id == window.data.last.id);
		train.querySelector('object').style.transform = station.x < window.data.last.x ? 'scale(-1,1)' : '';
		train.setAttribute("x", rect1X);
		train.setAttribute("y", rect1Y);
		train.scrollIntoView({ block: 'center', inline: 'center' });
		if(trainMoved)
			log("train moved to (" + window.data.last.x.toFixed(0) + "," + window.data.last.y.toFixed(0) + ")");
	}
	// update last run time
	idle();
}

function nearestPoint(points, ref) {
  // find in array of points which is closer to ref
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

function findDistance(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.hypot(dx, dy);
}

function pointAtDistance(a, b, dist) {
  // find where in straight line between a and b, by dist from a
  let D = findDistance(a, b);

  if (D === 0) return { ...a };

  const t = dist / D;
  const dx = b.x - a.x;
  const dy = b.y - a.y;

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

	let dialogListDiv = createDialog(input);
	dialog.innerHTML = '';
	dialog.appendChild(dialogListDiv);
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
	localStorage.setItem(window.data.id, JSON.stringify(window.data));
}

function clear() {
	localStorage.removeItem(window.data.id);
	window.location.reload();
}

//--INITIAL--//
function startup() {
	load();
	sizeDiagram();
	updateConfig();
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
		// determine by furthest station
		let parent = diagramSvg.parentElement.getBoundingClientRect();
		let diagWidth = parent.width;
		let diagHeight = parent.height;
		if(window.data.map.stations) {
			let maxX = Math.max(...window.data.map.stations.map(s => Math.abs(s.x)));
			diagWidth = 2 * (maxX + 2 * window.data.node.width);
			let maxY =  Math.max(...window.data.map.stations.map(s => Math.abs(s.y)));
			diagHeight = 2 * (maxY + 2 * window.data.node.height);
		}
		diagramSvg.setAttribute("width", diagWidth);
		diagramSvg.setAttribute("height", diagHeight);
		console.log("autosize svg", diagWidth, diagHeight);
	}
}
