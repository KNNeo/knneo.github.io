//--DEFAULT SETTINGS--//
const timeline = {
	debug: false,
	dimmed: false,
	orientation: window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
	size: 40,
	scroll: 0.1,
	scale: 1,
	formats: ".jpg|.webp",
	storage: {
		data: "timeline-data-v2",		// json data
		edit: "timeline-edit-data-v2"	// instructions
	},
	filter: "",		// All|Interval|data.group initial value
	sort: "sort",	// left|right|txt|img|sort
	layout: "rtl"	// alternate|start|end|rtl|ltr
};

//--DOM NODE REFERENCES--//
let timelineDiv = document.querySelector('.timeline');

//--DOM FUNCTIONS--//
function clearSelectItems() {
	for (let blob of timelineDiv.querySelectorAll('.blob'))
		blob.parentElement.classList.remove('highlight');
}

function selectItem(container) {
	clearSelectItems();
	container.classList.add('highlight');
	container.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}

function staggerTimeline() {
	// assumption: each set of data is text/image or text only or image only
	// assumption: first detected text element in data will be read position, then rest will follow, with image taking other side
	let content = JSON.parse(document.querySelector('#data').textContent);
	if (content.filter(c =>
		c.data.filter(f => f.txt || f.img).length == 2 ||
		c.data.filter(f => f.txt && !f.img).length == 1 ||
		c.data.filter(f => f.img && !f.txt).length == 1
	).length < content.length) {
		alert('unable to process: each event should have an image, a text field or a set of each');
		return;
	}
	let pos = content[0].data[0].pos;
	for (let elem of content) {
		let textData = elem.data.find(d => d.txt);
		if (textData)
			textData.pos = pos;
		let imgData = elem.data.find(d => d.img);
		if (imgData)
			imgData.pos = invertPosition(textData.pos);
		pos = invertPosition(pos);
	}
	document.querySelector('#data').textContent = JSON.stringify(content);
	saveData();
	startup();
}

function setPosition() {
	timeline.layout = event.target.getAttribute('data-id');
	if (event.target.closest('.layouts'))
		event.target.closest('.layouts').querySelector('.display').innerHTML = event.target.getAttribute('data-description');
	startup();
}

function invertPosition(pos) {
	return pos == 'left' ? 'right' : 'left';
}

//--EVENT HANDLERS--//
function onWheel() {
	event.preventDefault();
	let scrollDelta = (timeline.dimmed ? timeline.scroll : 1) * ((/Firefox/i.test(navigator.userAgent)) ? -event.detail * 50 : event.wheelDelta);
	if (timeline.orientation == 'horizontal')
		timelineDiv.scrollLeft -= scrollDelta;
	if (timeline.orientation == 'vertical')
		timelineDiv.scrollTop -= scrollDelta;
}

function timelineOnScroll() {
	var middleY = (timelineDiv.clientHeight / 2) + timeline.size;
	var middleX = (timelineDiv.clientWidth / 2) - timeline.size;

	var positions = [];
	var selected = null;
	var min = Number.MAX_VALUE;
	for (let item of timelineDiv.querySelectorAll('.blob')) {
		let diffY = Math.abs(item.getBoundingClientRect().y - middleY);
		let diffX = Math.abs(item.getBoundingClientRect().x - middleX);
		if (diffY < min) {
			selected = item;
			min = diffY;
		}
		if (diffX < min) {
			selected = item;
			min = diffX;
		}
	}
	clearSelectItems();
	selected.parentElement.classList.add('highlight');
}

function toggleDimMode() {
	event.target.classList.toggle('bi-lightbulb');
	event.target.classList.toggle('bi-lightbulb-fill');
	timeline.dimmed = timeline.dimmed ? false : true;
	for(let item of document.querySelectorAll('.container :is(div, img)'))
		item.classList.toggle('dimmed');
}

function toggleOrientation() {
	timeline.orientation = timeline.orientation == 'horizontal' ? 'vertical' : 'horizontal';
	timelineDiv.classList.toggle('horizontal');
	timelineDiv.classList.toggle('vertical');
}

function openEditor() {
	popupText('<textarea id="editor" name="editor" rows="8" cols="40" style="max-width: 90%;">' +
		localStorage.getItem(timeline.storage.edit) +
		'</textarea>' +
		'<div><a class="bi bi-stickies" href="javascript:void(0);" title="Load Example" onclick="document.querySelector(\'#editor\').value=loadEdit(document.querySelector(\'#example\').textContent);"></a>' +
		'<a class="bi bi-copy" href="javascript:void(0);" title="Copy Data" onclick="navigator.clipboard.writeText(document.querySelector("#editor").textContent);"></a>' +
		'<a class="bi bi-x-square" href="javascript:void(0);" title="Save/Close Data" onclick="saveEdit()"></a></div>');
}

function loadEdit(content) {
	let json = JSON.parse(content);
	if (json.length < 2) return '';

	let markup = '';
	for (let item of json) {
		markup += 'SKIP ' + (item.skip ?? 0) + '\n';  // find skip if any
		for (let elem of item.data) {
			if (elem.group)
				markup += 'GROUP "' + elem.group + '"\n';
			if (elem.txt)
				markup += (elem.pos == 'left' ? 'LEFT ' : '') + (elem.pos == 'right' ? 'RIGHT ' : '') + '"' + elem.txt + '"\n';
			if (elem.img)
				markup += (elem.pos == 'left' ? 'LEFT ' : '') + (elem.pos == 'right' ? 'RIGHT ' : '') + elem.img + ',' + (elem.url || '') + '\n';
		}
	}
	if(timeline.debug) console.log('parsing json', markup);

	/*
	Example of output:
	================================
	SKIP 4
	LEFT "Description"
	RIGHT image.jpg,https://knneo.github.io/
	GROUP "Name"
	================================
	*/

	return markup;
}

function saveEdit() {
	let markup = document.querySelector("#editor").value.split('\n');
	if (markup.length < 2) {
		document.querySelector("#data").textContent = JSON.stringify([]);
		saveData();
		startup();
		removeDialog();
	}

	localStorage.setItem(timeline.storage.edit, document.querySelector("#editor").value);
	let json = [];
	let newObj = { "id": 0 };
	let obj = JSON.parse(JSON.stringify(newObj));
	for (let line of markup) {
		// interaction instructions
		if (line.startsWith('SKIP')) {
			if (obj.data) {
				json.push(obj);
				newObj.id++;
				obj = JSON.parse(JSON.stringify(newObj));
			}
			let skipVal = parseInt(line.replace('SKIP', '').trim());
			if (skipVal)
				obj.skip = skipVal;
			continue;
		}
		if(line.startsWith('GROUP')) {
			let groupVal = line.replace('GROUP', '').trim();
			if (groupVal.startsWith('"') && groupVal.endsWith('"') && groupVal.length > 0)
				groupVal = groupVal.slice(1, groupVal.length - 1);
			if (groupVal)
				obj.group = groupVal;
			continue;
		}
		// data instructions
		let dataObj = {};
		if (line.startsWith('LEFT'))
			dataObj.pos = 'left';
		if (line.startsWith('RIGHT'))
			dataObj.pos = 'right';
		// read value
		let val = line.replace('LEFT', '').replace('RIGHT', '').trim();
		if (val.startsWith('"') && val.endsWith('"') && val.length > 0) {
			// text value
			dataObj.txt = val.slice(1, val.length - 1);
		}
		let isStaticImage = timeline.formats.split('|').find(f => val.indexOf(f) >= 0); // static images (for now)
		if (isStaticImage && val.indexOf(',') < 0) // image only
			dataObj.img = val;
		if (isStaticImage && val.indexOf(',') >= 0) { // image value with url
			dataObj.img = val.split(',')[0];
			dataObj.url = val.split(',')[1];
		}
		if (Object.keys(dataObj).length > 0) {
			if (!obj.data) obj.data = [];
			obj.data.push(dataObj);
		}
	}
	// push last value if any
	if (obj.data) json.push(obj);
	if(timeline.debug) console.log('parse instructions', json);
	document.querySelector("#data").textContent = JSON.stringify(json);
	saveData();
	startup();
	removeDialog();
}

function showLayouts() {
	var layouts = [
		{
			id: 'start', value: 'start',
			description: 'all text on start of writing style'
		},
		{
			id: 'end', value: 'end',
			description: 'all text on end of writing style'
		},
		{
			id: 'alternate', value: 'alternate',
			description: 'all elements on alternate sides'
		},
		{
			id: 'ltr', value: 'left-to-right',
			description: 'all elements on alternate sides (prefer text on start)'
		},
		{
			id: 'rtl', value: 'right-to-left',
			description: 'all elements on alternate sides (prefer text on end)'
		},
	];
	popupText('<div class="layouts"><div class="display">' + (layouts.find(l => timeline.layout == l.id)?.description || '') + '</div><br>' + layouts.map(l => '<button ' + (timeline.layout == l.id ? 'class="selected"' : '') + ' data-id="' + l.id + '" data-description="' + l.description + '" title="' + l.title + '" onclick="setPosition()">' + l.value + '</button>').join('') + '</div>');
}

//--FUNCTIONS--//
function loadData() {
	// if empty, create
	if (document.querySelector('#data') == null) {
		if(timeline.debug) console.log('no data found, creating');
		let data = document.createElement('script');
		data.id = 'data';
		data.setAttribute('type', 'application/json');
		data.setAttribute('defer', '');
		document.querySelector('head').appendChild(data);
	}
	// if empty inline, load from local storage (inline to override)
	if (document.querySelector('#data').textContent.trim().length < 3)
		document.querySelector('#data').textContent = localStorage.getItem(timeline.storage.data) ?? '[]';
}

function saveData() {
	localStorage.setItem(timeline.storage.data, document.querySelector('#data').textContent);
}

function generateTimeline(querySelector) {
	let list = document.querySelector(querySelector);
	// read element content if any
	try {
		if(list.innerHTML.includes('\n')) { // assume instructions
			document.querySelector("#editor").value = list.innerHTML;
			saveEdit();
		}
		else // assume json
			document.querySelector('#data').textContent = JSON.parse(list.innerHTML);
	}
	catch {
		console.warn('parse json fail in:', list);
	}
	list.innerHTML = '';
	let timelineList = JSON.parse(document.querySelector('#data').textContent);
	list.classList.remove('horizontal');
	list.classList.remove('vertical');
	list.classList.add(timeline.orientation);
	list.onscroll = timelineOnScroll;
	list.onwheel = onWheel;

	let listBlock = document.createElement('div');
	listBlock.classList.add('grid');
	// filter selection
	if(timelineList.filter(x => x.group).length) {
		let groups = timelineList.reduce(function (total, current, index, _) {
			if(current.group && !total.includes(current.group) && current.group != 'Interval') {
				total.push(current.group);
			}
			return total;
		}, []);
		let filterSelect = document.createElement('select');
		filterSelect.title = 'Filter Timeline';
		filterSelect.classList.add('filter');
		filterSelect.onchange = function() {
			timeline.filter = event.target.value;
			startup();
		};

		let filterDefault = document.createElement('option');
		filterDefault.value = 'No filter';
		filterDefault.innerText = filterDefault.value;
		filterSelect.appendChild(filterDefault);

		for(let group of groups.sort(function (a, b) { return a.localeCompare(b); })) {
			let option = document.createElement('option');
			option.value = group;
			option.innerText = option.value;
			if(timeline.filter == group)
				option.setAttribute('selected', '');
			filterSelect.appendChild(option);
		}
		// reset default if no value or first group selected
		if(!timeline.filter || timeline.filter == 'No filter') {
			timeline.filter = '';
			filterDefault.setAttribute('selected', '');
		}
		list.appendChild(filterSelect);
	}
	// filter display list from data
	let spacing = calculateHorizontalSpacing();
	let phase = 1;
	let displayList = timelineList
		.filter(function(f) { return timeline.filter ? (f.group == 'All' || f.group == 'Interval' || f.group == timeline.filter) : true; })
		.sort(function (a, b) { return timeline.sort && a[timeline.sort] && b[timeline.sort] ? a[timeline.sort].localeCompare(b[timeline.sort]) : 0; }) // asc only
		.reduce(function (total, current, index, _) {
			// follow content skip
			if (current.skip) {
				for (s = 0; s < current.skip; s++)
					total.push({});
			}
			// follow calculation based on config or auto
			else if (index > 0 && spacing > 1) {
				for (s = 0; s < spacing; s++)
					total.push({});
			}
			// if any group has interval value, phase cannot be 1
			if(current.group == 'Interval')
				phase++;
			let item = {
				...current,
				sort: index,
			};
			if(phase) item.phase = phase;
			total.push(item);
			return total;
		}, [])
		// filter out all non-phase groups
		.filter(function(f, i, a) { return a.filter(x => x.phase == 1).length || a.filter(x => x.phase == f.phase).length > 1; });
	// clear leading empty spaces
	if(phase > 1)
		displayList = displayList.slice(displayList.findIndex(x => x.id >= 0), displayList.findLastIndex(x => x.id >= 0) + 1);
	// iterate items, with orientation and count
	let count = 0;
	let textPos = ['start', 'alternate', 'ltr'].includes(timeline.layout) ? 'left' : 'right';
	if (timeline.layout == 'alternate' && displayList.length > 1 && displayList[0]?.data && displayList[0]?.data.find(d => d.txt)?.pos)
		textPos = displayList[0]?.data?.txt?.pos;
	if(timeline.debug) console.log('filter list', displayList);
	for (let item of displayList) {
		count++;

		let container = document.createElement('div');
		container.classList.add('container');

		let elems = [];
		let blob = document.createElement('div');
		blob.classList.add('center');
		blob.classList.add('blob');
		if (timeline.dimmed) blob.classList.add('dimmed');
		blob.classList.add('interactive');
		blob.onclick = function() {
			selectItem(event.target.parentElement);
		};
		blob.innerText = '|';
		if (item.empty) blob.style.opacity = 0;
		elems.push(blob);

		if (item.data && item.data.length > 0) {
			if (['alternate', 'ltr', 'rtl'].includes(timeline.layout) && count > 0)
				textPos = invertPosition(textPos);
			if (timeline.layout == 'ltr' && item.data.length == 1 && item.data[0].txt)
				textPos = 'left';
			if (timeline.layout == 'rtl' && item.data.length == 1 && item.data[0].txt)
				textPos = 'right';
			for (let dat of item.data) {
				if (dat.txt) {
					let txt = document.createElement('div');
					txt.classList.add(dat.pos || textPos);
					txt.classList.add('txt');
					if (timeline.dimmed) txt.classList.add('dimmed');
					if (dat.tooltip) {
						txt.classList.add('interactive');
						txt.onclick = function() {
							popupText(dat.tooltip);
						};
					}
					txt.innerText = dat.txt;
					elems.push(txt);
				}

				if (dat.img) {
					let url = document.createElement('a');
					let img = document.createElement('img');
					let position = dat.pos || invertPosition(textPos);
					img.classList.add(position);
					img.classList.add('img');
					if (timeline.dimmed) img.classList.add('dimmed');
					img.src = dat.img;
					img.onload = resizeImage;
					img.title = dat.title ?? '';

					if (dat.url && dat.url.length > 0)
						url.appendChild(img);
					else {
						if (dat.tooltip) {
							img.classList.add('interactive');
							img.onclick = function() {
								popupText(dat.tooltip);
							};
						}
						elems.push(img);
					}

					if (dat.url && dat.url.length > 0) {
						url.classList.add(position);
						img.classList.remove(position);
						url.href = dat.url;
						elems.push(url);
					}
				}

				if (dat.url && dat.url.length > 0 &&
					(dat.url.includes('youtube.com/watch') || dat.url.includes('youtu.be/') || dat.url.includes('youtube.com/shorts'))) {
					let id = content.substring(content.indexOf('?v=') + 3);
					let altDomain = dat.url.includes('youtu.be/');
					let isShorts = dat.url.includes('youtube.com/shorts');
					if (altDomain) id = content.substring(content.indexOf('youtu.be/') + 9);
					if (isShorts) id = content.substring(content.indexOf('youtube.com/shorts/') + 19, dat.url.length);

					let url = document.createElement('div');
					url.classList.add(dat.pos);
					url.innerHTML = '<div style="_div_"><iframe class="yt-video" allow="autoplay; encrypted-media; web-share;" allowfullscreen="" frameborder="0" style="_style_" src="https://www.youtube.com/embed/_id_?enablejsapi=1"></iframe></div>'
						.replace('_id_', id)
						.replace('_div_', isShorts ? '' : 'line-height: 0;')
						.replace('_style_', isShorts
							? 'width: 100%; height: 480px; display: block; margin: auto;'
							: 'width: 100%; aspect-ratio: 16 / 9;'
						);
					elems.push(url);
				}
			}
		}

		let leftElems = elems.filter(e => e.classList.contains('left'));
		if (leftElems.length > 0) {
			container.appendChild(leftElems[0]);
		}
		else {
			let leftElems = document.createElement('div');
			leftElems.classList.add('left');
			container.appendChild(leftElems);
		}
		let centerElems = elems.filter(e => e.classList.contains('center'));
		if (centerElems.length > 0) {
			container.appendChild(centerElems[0]);
		}
		else {
			centerElems = document.createElement('div');
			centerElems.classList.add('center');
			container.appendChild(centerElems);
		}
		let rightElems = elems.filter(e => e.classList.contains('right'));
		if (rightElems.length > 0) {
			container.appendChild(rightElems[0]);
		}
		else {
			rightElems = document.createElement('div');
			rightElems.classList.add('right');
			container.appendChild(rightElems);
		}

		listBlock.appendChild(container);
	}
	if (!displayList.length)
		listBlock.innerText = 'No data found\n\n(Open editor to load example)';

	list.appendChild(listBlock);
}

function calculateHorizontalSpacing() {
	// multiply based on horizontal screen ratio
	if(timeline.scale == 'auto' && config.orientation == 'horizontal')
		return Math.ceil(window.innerWidth / window.innerHeight);
	else if (typeof timeline.scale == 'number')
		return timeline.scale;
	return 1;
}

function resizeImage() {
	let img = event.target;
	let isHorizontal = img.getBoundingClientRect().width >= img.getBoundingClientRect().height;
	if(isHorizontal)
		img.classList.add('horizontal');
	else
		img.classList.add('vertical');
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
	if (!dialog.classList.contains('box')) dialog.classList.add('box');
	if (typeof node == 'string')
		dialog.innerHTML = node;
	if (typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function () {
		if (event.target == document.querySelector('dialog'))
			removeDialog();
	});
	return dialog;
}

function removeDialog() {
	if (event) event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv != null) {
		dialogDiv.remove();
	}
}

//--INITIAL--//
function startup() {
	loadData();
	generateTimeline('.timeline');
	saveData();
}
