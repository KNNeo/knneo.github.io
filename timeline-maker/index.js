//--DEFAULT SETTINGS--//
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const config = {
	"title": "My Fanfiction Journey",
	"dimmed": true,
	"orientation": window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
	"size": 40,
	"scroll": 0.1,
	"formats": ".jpg|.webp"
};
const emojiRegex = /(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\p{Extended_Pictographic})+/gv;

//--DOM NODE REFERENCES--//
let timelineDiv = document.querySelector('.timeline');

//--DOM FUNCTIONS--//
function clearSelectItems() {	
	for(let blob of timelineDiv.querySelectorAll('.blob'))
		blob.parentElement.classList.remove('highlight');
}

function selectItem(container) {
	clearSelectItems();
	container.classList.add('highlight');
}

function staggerTimeline() {
	// assumption: each set of data is text/image or text only or image only
	// assumption: first detected text element in data will be read position, then rest will follow, with image taking other side
	let content = JSON.parse(document.querySelector('#data').textContent);
	if(content.filter(c => 
		c.data.filter(f => f.txt || f.img).length == 2 ||
		c.data.filter(f => f.txt && !f.img).length == 1 ||
		c.data.filter(f => f.img && !f.txt).length == 1
	).length < content.length) {
		alert('unable to process: each event should have an image, a text field or a set of each');
		return;
	}
	let pos = content[0].data[0].pos;
	for(let elem of content) {
		let textData = elem.data.find(d => d.txt);
		if(textData)
			textData.pos = pos;
		let imgData = elem.data.find(d => d.img);
		if(imgData)
			imgData.pos = invertPosition(textData.pos);
		pos = invertPosition(pos);
	}
	document.querySelector('#data').textContent = JSON.stringify(content);
	saveData();
	startup();
}

function invertPosition(pos) {
	return pos == 'left' ? 'right' : 'left';
}

//--EVENT HANDLERS--//
function onWheel() {
	event.preventDefault();
	let scrollDelta = (config.dimmed ? config.scroll : 1) * (isFirefox ? -event.detail * 50 : event.wheelDelta);
	if(config.orientation == 'horizontal')
		timelineDiv.scrollLeft -= scrollDelta;
	if(config.orientation == 'vertical')
		timelineDiv.scrollTop -= scrollDelta;
}

function timelineOnScroll() {	
	var middleY = (timelineDiv.clientHeight / 2) + config.size;
	var middleX = (timelineDiv.clientWidth / 2) - config.size;
	
	var positions = [];
	var selected = null;
	var min = Number.MAX_VALUE;
	for(let item of timelineDiv.querySelectorAll('.blob'))
	{
		let diffY = Math.abs(item.getBoundingClientRect().y - middleY);
		let diffX = Math.abs(item.getBoundingClientRect().x - middleX);
		if(diffY < min) {
			selected = item;
			min = diffY;
		}
		if(diffX < min) {
			selected = item;
			min = diffX;
		}
	}
	selectItem(selected.parentElement);	
}

function toggleDimMode() {
	event.target.classList.toggle('bi-lightbulb');
	event.target.classList.toggle('bi-lightbulb-fill');
	config.dimmed = config.dimmed ? false : true;
	startup();
}

function toggleOrientation() {
	config.orientation = config.orientation == 'horizontal' ? 'vertical' : 'horizontal';
	startup();
}

function toggleEditor() {
	popupText('<textarea id="editor" name="editor" rows="8" cols="40" style="max-width: 90%;">' + 
	loadEdit(document.querySelector('#data').textContent) + 
	'</textarea>' + 
	'<div><a class="bi bi-stickies" href="javascript:void(0);" title="Load Example" onclick="document.querySelector(\'#editor\').value=loadEdit(document.querySelector(\'#example\').textContent);"></a>' + 
	'<a class="bi bi-copy" href="javascript:void(0);" title="Copy Data" onclick="navigator.clipboard.writeText(document.querySelector("#editor").textContent);"></a>' + 
	'<a class="bi bi-x-square" href="javascript:void(0);" title="Save/Close Data" onclick="saveEdit()"></a></div>');	
}

function loadEdit(content) {
	let json = JSON.parse(content);
	let markup = '';
	
	for(let item of json)
	{
		markup += 'SKIP ' + (item.skip ?? 0) + '\n';  // find skip if any
		let left = item.data.filter(d => d.pos == 'left')[0];  // find first
		if(left)
			markup += 'LEFT ' + (left.txt ? left.txt : left.img + ',' + (left.url || '')) + '\n';
		let right = item.data.filter(d => d.pos == 'right')[0];  // find first
		if(right)
			markup += 'RIGHT ' + (right.txt ? right.txt : right.img + ',' + (right.url || '')) + '\n';
		markup += '\n';
	}
	
	// console.log(markup);
	
	/*
	Output object example in markup:
	================================
	skip 4
	left text
	right xxx.jpg,https://knneo.github.io/
	================================
	Assumption: Text has no newline characters
	*/
	
	return markup;
}

function saveEdit() {
	let markup = document.querySelector("#editor").value.split('\n\n');
	let json = [];
	
	let counter = 0;
	for(let segment of markup)
	{
		let obj = {
			"id": ++counter
		};
		let items = segment.split('\n');
		for(let item of items)
		{
			if(item.startsWith('SKIP')) {
				let skipVal = parseInt(item.replace('SKIP','').trim());
				if(skipVal)
					obj.skip = skipVal;
				continue;
			}
			
			let dataObj = {};
			if(item.startsWith('LEFT'))
				dataObj.pos = 'left';
			if(item.startsWith('RIGHT'))
				dataObj.pos = 'right';
			
			let val = item.replace('LEFT','').replace('RIGHT','').trim();
			if(val.indexOf(',') < 0 && val.length > 0) // text value
				dataObj.txt = val;
			let isStaticImage = config.formats.split('|').find(f => val.indexOf(f) >= 0); // static images (for now)
			if(isStaticImage && val.indexOf(',') < 0) // image only
				dataObj.img = val;
			if(isStaticImage && val.indexOf(',') >= 0) { // image value with url
				dataObj.img = val.split(',')[0];
				dataObj.url = val.split(',')[1];
			}
			if(Object.keys(dataObj).length > 0) {
				if(!obj.data) obj.data = [];
				obj.data.push(dataObj);
			}
		}
		json.push(obj);
	}
	// clear end padded skips
	while(!json[--counter].data && counter >= 0)
	{
		json = json.filter((item, index) => index != counter);
	}
	// console.log(json);
	document.querySelector("#data").textContent = JSON.stringify(json);
	saveData();
	startup();
	removeDialog();
}

//--FUNCTIONS--//
function initialize() {
	document.title = config.title;
	timelineDiv.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onWheel);
}

function loadData() {
	// if empty, create
	if(document.querySelector('#data') == null) {
		console.log('no data found, creating')
		let data = document.createElement('script');
		data.id = 'data';
		data.setAttribute('type','application/json');
		data.setAttribute('defer','');
		document.querySelector('head').appendChild(data);
	}
	// if empty inline, load from local storage (inline to override)
	if(document.querySelector('#data').textContent.trim().length < 3)
		document.querySelector('#data').textContent = localStorage.getItem('timeline-edit-data') ?? '[]';
}

function saveData() {
	localStorage.setItem('timeline-edit-data', document.querySelector('#data').textContent);
}

function generateTimeline(timelineList, querySelector) {
	let list = document.querySelector(querySelector);
	list.innerHTML = '';
	list.classList.remove('horizontal');
	list.classList.remove('vertical');
	list.classList.add(config.orientation);
	list.setAttribute('onscroll', 'timelineOnScroll()');
	
	let listBlock = document.createElement('div');
	listBlock.classList.add('grid');
	if (config.orientation == 'horizontal')
		listBlock.style.gridAutoColumns = config.size + 'px';
	else
		listBlock.style.gridAutoRows = config.size + 'px';
	
	let spacing = calculateSpacing();
	let displayList = timelineList
		.sort(function(a,b) { return a.sort - b.sort; })
		.reduce(function(total, current, index, _) {
			if(current.skip) {
				for(s = 0; s < current.skip * spacing; s++)
					total.push({});
			}
			else if (index > 0 && spacing > 1) {
				for(s = 0; s < spacing; s++)
					total.push({});
			}
			total.push({
				...current,
				sort: index,
			});
			return total;
		}, []);
	
	if(config.orientation == 'horizontal') {
		for(s = 0; s < Math.floor((timelineDiv.clientWidth / 2) / config.size); s++)
			displayList.push({ "empty": true });
	}
	
	let count = 0;
	for(let item of displayList)
	{
		count++;
		
		let container = document.createElement('div');
		container.classList.add('container');

		let elems = [];
		let blob = document.createElement('div');
		blob.classList.add('center');
		blob.classList.add('blob');
		if(config.dimmed) blob.classList.add('dimmed');
		blob.classList.add('interactive');
		blob.setAttribute('onclick', 'selectItem(event.target.parentElement)');
		blob.innerText = '|';
		if(item.empty) blob.style.opacity = 0;
		elems.push(blob);
		
		if(item.data && item.data.length > 0) {
			for(let dat of item.data) {
				if(dat.txt) {
					let txt = document.createElement('div');
					txt.classList.add(dat.pos);
					txt.classList.add('txt');
					if(dat.txt.match(emojiRegex) && dat.txt.length < 5) txt.classList.add('emoji');
					if(config.dimmed) txt.classList.add('dimmed');
					if(dat.tooltip) {
						txt.classList.add('interactive');	
						txt.setAttribute('onclick', 'popupText("' + dat.tooltip + '")');
					}
					txt.innerText = dat.txt;
					elems.push(txt);
				}
				
				if(dat.img) {
					let url = document.createElement('a');
					let img = document.createElement('img');
					img.classList.add(dat.pos);
					img.classList.add('img');
					if(config.dimmed) img.classList.add('dimmed');
					img.src = dat.img;
					img.setAttribute('oncontextmenu', 'return false');
					img.title = dat.title ?? '';
					
					if(dat.url && dat.url.length > 0)
						url.appendChild(img);
					else {
						if(dat.tooltip) {
							img.classList.add('interactive');	
							img.setAttribute('onclick', 'popupText("' + dat.tooltip + '")');
						}
						elems.push(img);
					}

					if(dat.url && dat.url.length > 0) {
						url.classList.add(dat.pos);
						url.href = dat.url;
						// url.setAttribute('target', '_blank');
						elems.push(url);
					}
				}
			}
		}
		
		let leftElems = elems.filter(e => e.classList.contains('left'));
		if(leftElems.length > 0) {
			if(config.orientation == 'horizontal') 
				leftElems[0].style.gridColumnStart = count;
			container.appendChild(leftElems[0]);
		}
		else {
			let leftElems = document.createElement('div');
			if(config.orientation == 'horizontal') 
				leftElems.style.gridColumnStart = count;
			leftElems.classList.add('left');
			container.appendChild(leftElems);
		}
		let centerElems = elems.filter(e => e.classList.contains('center'));
		if(centerElems.length > 0) {
			if(config.orientation == 'horizontal') 
				centerElems[0].style.gridColumnStart = count;
			container.appendChild(centerElems[0]);
		}
		else {
			centerElems = document.createElement('div');
			if(config.orientation == 'horizontal') 
				centerElems.style.gridColumnStart = count;
			centerElems.classList.add('center');
			container.appendChild(centerElems);
		}
		let rightElems = elems.filter(e => e.classList.contains('right'));
		if(rightElems.length > 0) {
			if(config.orientation == 'horizontal') 
				rightElems[0].style.gridColumnStart = count;
			container.appendChild(rightElems[0]);
		}
		else {
			rightElems = document.createElement('div');
			if(config.orientation == 'horizontal') 
				rightElems.style.gridColumnStart = count;
			rightElems.classList.add('right');
			container.appendChild(rightElems);
		}
		
		listBlock.appendChild(container);
	}
	
	list.appendChild(listBlock);
}

function calculateSpacing() {
	// multiply based on horizontal screen ratio
	if(config.orientation == 'horizontal')
		return Math.ceil(window.innerWidth / window.innerHeight);
	return 1;
}

//--DIALOG--//
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv == null)
	{
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
	if(!dialog.classList.contains('box')) dialog.classList.add('box');
	if(typeof node == 'string')
		dialog.innerHTML = node;
	if(typeof node == 'object')
	{
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		if(event.target.parentElement == document.querySelector('.dialog'))
			removeDialog();
	});
	return dialog;
}

function removeDialog() {
	if(event) event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if(dialogDiv != null)
	{
		dialogDiv.remove();
	}	
}

//--INITIAL--//
function startup() {
	initialize();
	loadData();
	generateTimeline(JSON.parse(document.querySelector('#data').textContent), '.timeline');
	saveData();
}
