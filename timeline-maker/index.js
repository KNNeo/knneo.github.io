//--DEFAULT SETTINGS--//
const isFirefox = (/Firefox/i.test(navigator.userAgent));
const config = {
	"title": "My Fanfiction Journey",
	"dimmed": true,
	"orientation": window.innerWidth > window.innerHeight ? "horizontal" : "vertical",
	"size": 40,
	"scroll": 0.1
};

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

//--FUNCTIONS--//
function initialize() {
	document.title = config.title;
	timelineDiv.addEventListener(isFirefox ? 'DOMMouseScroll' : 'mousewheel', onWheel);
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
		
		if(item.data && item.data.length > 0)
		{
			for(let dat of item.data)
			{
				if(dat.txt)
				{
					let txt = document.createElement('div');
					txt.classList.add(dat.pos);
					txt.classList.add('txt');
					if(config.dimmed) txt.classList.add('dimmed');
					if(dat.tooltip) {
						txt.classList.add('interactive');	
						txt.setAttribute('onclick', 'popupText("' + dat.tooltip + '")');
					}
					txt.innerText = dat.txt;
					elems.push(txt);
				}
				
				if(dat.img)
				{		
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

					if(dat.url && dat.url.length > 0)
					{
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
	dialog.addEventListener('keyup', function() {
		if (event.key === 'Enter')
			this.remove();
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
	generateTimeline(JSON.parse(document.querySelector('#data').textContent), '.timeline');
}
