//--DEFAULT SETTINGS--//
const config = {
	"dimmed": true
};

//--DOM NODE REFERENCES--//
let timelineDiv = document.querySelector('.timeline');

//--DOM FUNCTIONS--//
function onKeyDown() {
}

function timelineOnScroll() {
	var yValue = timelineDiv.clientHeight / 2;
	
	var positions = [];
	var selected = null;
	var min = Number.MAX_VALUE;
	for(let item of timelineDiv.querySelectorAll('.blob'))
	{
		item.parentElement.classList.remove('highlight');
		let diff = Math.abs(item.getBoundingClientRect().y - yValue);
		if(diff < min) {
			selected = item;
			min = diff;
		}
	}
	selected.parentElement.classList.add('highlight');
}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
function readFromLocalStorage() {
	
}

function generateTimeline(categoryId, categoryTitle, filterList, fold = true) {
	let list = document.createElement('div');
	list.id = categoryId;
	list.classList.add('category');
	
	if(categoryTitle) {
		let block = document.createElement('h4');
		block.classList.add('tr_bq');
		
			let title = document.createElement('span');
			title.classList.add('category-title');
			title.innerText = categoryTitle;
			
		block.appendChild(title);
		list.appendChild(block);
	}
	
	let listBlock = document.createElement('div');
	listBlock.classList.add('block');
	listBlock.classList.add('grid');
	
	let empty = {};
	let count = 0;
	let displayList = filterList
		.sort(function(a,b) { return a.sort - b.sort; })
		.reduce(function(total, current, index, _) {
			if(current.skip) {
				for(s = 0; s < current.skip; s++)
				{
					total.push({});
				}
			}
			else
				total.push({
					...current,
					sort: index,
				});
			return total;
		}, []);
	
	for(let item of displayList)
	{
		let container = document.createElement('div');
		container.classList.add('container');
		if(config.dimmed) {
			container.setAttribute('onmouseenter', 'itemOnMouseEnter()');
			container.setAttribute('onmouseleave', 'itemOnMouseLeave()');
		}

		let elems = [];
		let blob = document.createElement('div');
		blob.classList.add('center');
		blob.classList.add('blob');
		if(config.dimmed) blob.classList.add('dimmed');
		blob.innerText = '|';
		elems.push(blob);
		
		if(item.data && item.data.length >= 2)
		{
			for(let dat of item.data)
			{
				if(dat.txt)
				{
					let txt = document.createElement('div');
					txt.classList.add(dat.key);
					txt.classList.add('txt');
					if(config.dimmed) txt.classList.add('dimmed');
					txt.innerText = dat.txt;
					elems.push(txt);
				}
				
				if(dat.img)
				{		
					let url = document.createElement('a');
					let img = document.createElement('img');
					img.classList.add(dat.key);
					img.classList.add('img');
					if(config.dimmed) img.classList.add('dimmed');
					img.src = dat.img;
					img.setAttribute('oncontextmenu', 'return false');
					// img.title = (item.url.startsWith('http') ? '' : '@') + item.url;
					// if(img.circular)
						// img.style.borderRadius = '50%';
						
					if(dat.url && dat.url.length > 0)
						handler.appendChild(img);
					else
						elems.push(img);

					if(dat.url && dat.url.length > 0)
					{
						handler.href = (dat.url.startsWith('http') ? '' : 'https://twitter.com/') + dat.url;
						handler.setAttribute('target', '_blank');
						elems.push(handler);
					}
				}
			}
		}
		
		let leftElems = elems.filter(e => e.classList.contains('left'));
		if(leftElems.length > 0)
			container.appendChild(leftElems[0]);
		else
			container.appendChild(document.createElement('div'));
		let centerElems = elems.filter(e => e.classList.contains('center'));
		if(centerElems.length > 0)
			container.appendChild(centerElems[0]);
		else
			container.appendChild(document.createElement('div'));
		let rightElems = elems.filter(e => e.classList.contains('right'));
		if(rightElems.length > 0)
			container.appendChild(rightElems[0]);
		else
			container.appendChild(document.createElement('div'));
		
		listBlock.appendChild(container);
	}
	
	list.appendChild(listBlock);
	
	return list;
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
	// dialog.addEventListener('click', function() {
		// this.remove();
	// });
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
	readFromLocalStorage();
	timelineDiv.appendChild(generateTimeline('list', '', JSON.parse(document.querySelector('#data').textContent)));
}
