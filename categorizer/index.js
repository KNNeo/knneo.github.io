//--DEFAULT SETTINGS--//
const config = {
    id: 'categorizer-presets',
    presets: [
        {
            id: 1,
            name: "Gender Sort",
            list: [
                {
                    id: 1,
                    name: "Julia",
                    category: "Female",
                },
                {
                    id: 2,
                    name: "Samson",
                    category: "Male",
                },
                {
                    id: 3,
                    name: "Sam",
                }
            ]
        }
    ],
};

//--DOM NODE REFERENCES--//
let header = document.querySelector('header');
let pageSection = document.querySelector('section.page');
let drawerSection = document.querySelector('section.drawer');
let presetSection = document.querySelector('section.presets');

//--DOM FUNCTIONS--//
function onDismissHeader() {
    header.classList.add('hidden');
}

//--EVENT HANDLERS--//
function dragItem() {
    let elem = event.target;
    let selector = '.item[data-id="' + elem.dataset.id + '"][data-category="' + elem.dataset.category + '"]';
    event.dataTransfer.setData(window.data.id, selector);
}

function allowDrop() {
    event.preventDefault();
    drawerSection.classList.add('hidden');
}

function dropItem() {
    event.preventDefault();
    // update ui
    var selector = event.dataTransfer.getData(window.data.id);
    event.target.appendChild(document.querySelector(selector));
    // update backend
    let elem = document.querySelector(selector);
    elem.dataset.category = event.target.dataset.id;
    // update data
    var item = window.data.list.find(i => i.id == elem.dataset.id);
    if(item)
        item.category = event.target.dataset.id;
    save();
}

function dropDrawerItem() {
    event.preventDefault();
    // update ui
    var selector = event.dataTransfer.getData(window.data.id);
    drawerSection.appendChild(document.querySelector(selector));
    // update backend
    let elem = document.querySelector(selector);
    elem.dataset.category = event.target.dataset.id;
    // update data
    var item = window.data.list.find(i => i.id == elem.dataset.id);
    if(item)
        item.category = event.target.dataset.id;
    save();
    // update icons
    event.target.classList.toggle('bi-folder2-open');
    event.target.classList.toggle('bi-check-circle');
    setTimeout(function() {
        document.querySelector('.settings .drawer').classList.toggle('bi-folder2-open');
        document.querySelector('.settings .drawer').classList.toggle('bi-check-circle');
    }, 1000);
}

function toggleDrawer() {
    drawerSection.classList.toggle('hidden');
}

function addItem() {
    let results = prompt('Key in a name, or comma separated list of names');
    if(results) {
        results = results.split(',').map(r => r.trim());
        for(let value of results) {
            let item = {
                id: new Date().toISOString() + '-' + results.indexOf(value),
                name: value,
                category: 'drawer'
            };
            // create in ui
            let itemDiv = document.createElement('div');
            itemDiv.className = 'item box';
            itemDiv.setAttribute('ontouchmove', 'moveItem()');
            itemDiv.setAttribute('draggable', 'true');
            itemDiv.setAttribute('ondragstart', 'dragItem()');
            itemDiv.setAttribute('data-id', item.id);
            itemDiv.setAttribute('data-category', item.category);
            itemDiv.innerText = item.name;
            drawerSection.appendChild(itemDiv);
            // update data
            window.data.list.push(item);
        }
    }
}

function moveItem() {
    let content = document.createElement('div');
    content.setAttribute('data-id', event.target.dataset.id);
    content.setAttribute('data-source', event.target.dataset.category);

    let title = document.createElement('div');
    title.innerText = 'Select a category';
    content.appendChild(title);

    let allCategories = JSON.parse(JSON.stringify(window.data.categories));
    allCategories.push('[Uncategorized]');
    for(let category of allCategories) {
        let button = document.createElement('button');
        button.className = 'item button';
        button.setAttribute('data-destination', category);
        button.setAttribute('onclick', 'onSelectCategory()');
        button.innerText = category;
        content.appendChild(button);
    }
    popupContent(content);
}

function onSelectCategory() {
    if(event.target && event.target.dataset.destination &&
        event.target.closest('[data-id][data-source]')) {
        let elem = event.target.closest('[data-id][data-source]');
        // remove from current
        let source = document.querySelector('.item[data-id="' + elem.dataset.id + '"][data-category="' + elem.dataset.source + '"]');
        // add to new
        let dest = document.querySelector('.category[data-id="' + event.target.dataset.destination + '"]') ||  document.querySelector('.drawer');
        dest.appendChild(source);
        // update backend
        let newDest = document.querySelector('.item[data-id="' + elem.dataset.id + '"][data-category="' + elem.dataset.source + '"]');
        if(event.target.dataset.destination) event.target.dataset.destination = 'drawer';
        newDest.dataset.category = event.target.dataset.destination;
        // update data
        var item = window.data.list.find(i => i.id == newDest.dataset.id);
        if(item)
            item.category = event.target.dataset.destination;
        save();
        // update icons
        document.querySelector('.settings .drawer').classList.remove('bi-folder2-open');
        document.querySelector('.settings .drawer').classList.add('bi-check-circle');
        setTimeout(function() {
            document.querySelector('.settings .drawer').classList.add('bi-folder2-open');
            document.querySelector('.settings .drawer').classList.remove('bi-check-circle');
        }, 1000);
    }
    else
        alert('Unable to move to category!');
    removeDialog();
}

function togglePresets() {
    presetSection.classList.toggle('hidden');
}

function addPreset() {
    let result = prompt('Key in a name!');
    if(result) {
        let preset = {
            id: 1 + (config.presets.length || 0),
            name: result,
            list: []
        };
        result = prompt('Key in categories comma-separated!');
        if(result) {
            preset.categories = result.split(',').map(r => r.trim());
            // create in ui
            let selectButton = document.createElement('button');
            selectButton.className = 'item box';
            selectButton.setAttribute('onclick', 'selectPreset()');
            selectButton.dataset.id = preset.id;
            selectButton.innerText = preset.name;
            presetSection.appendChild(selectButton);
            // update data
            config.presets.push(preset);
        }
    }
}

function selectPreset() {
    window.data.current = config.presets.find(p => p.id == event.target.dataset.id);
    if(window.data.current)
        startup();
    else
        alert('Preset not found!');
    togglePresets();
}

function addCategory() {
    let category = prompt('Key in a name!');
    if(category)
        renderCategory(category);
}

//--FUNCTIONS--//
function getUniqueCategories(list) {
    return list.reduce(function(total, current, index, arr) {
        if(current.category && !total.includes(current.category))
            total.push(current.category);
        return total;
    }, []);
}

function save() {
    localStorage.setItem(config.id, JSON.stringify(config.presets));
}

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

//--INITIAL--//
function startup() {
    loadData();
    renderCanvas();
    renderPresets();
    renderCategories();
    renderItems();
}

function loadData() {
    // take from storage
    let storage = JSON.parse(localStorage.getItem(config.id));
    if(!window.data?.current && storage && storage.length > 0)
        config.presets = storage;
    // set data
    window.data = (window.data?.current && config.presets.find(p => p.id == window.data.current.id)) || config.presets[0];
    // done, can remove temp set from select preset
    if(window.data.current) delete window.data.current;
    // reset category fields
    window.data.categories = getUniqueCategories(window.data.list).filter(c => c != 'drawer');
}

function renderCanvas() {
    pageSection.innerHTML = '';

    let canvasDiv = document.createElement('div');
    canvasDiv.classList.add('canvas');
    if(config.borderless) canvasDiv.classList.add('borderless');
    canvasDiv.id = 'area-' + window.data.id;
    pageSection.appendChild(canvasDiv);
}

function renderCategories() {
    for(let category of window.data.categories)
        renderCategory(category);
}

function renderCategory(category) {
    let canvas = document.querySelector('#area-' + window.data.id);
    let categoryDiv = document.createElement('div');
    categoryDiv.classList.add('category');
    categoryDiv.setAttribute('data-id', category);
    categoryDiv.setAttribute('ondragover', 'allowDrop()');
    categoryDiv.setAttribute('ondrop', 'dropItem()');
    canvas.appendChild(categoryDiv);
}

function renderItems() {
    for(let item of window.data.list) {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'item box';
        itemDiv.setAttribute('ontouchmove', 'moveItem()');
        itemDiv.setAttribute('draggable', 'true');
        itemDiv.setAttribute('ondragstart', 'dragItem()');
        itemDiv.setAttribute('data-id', item.id);
        itemDiv.setAttribute('data-category', item.category || 'drawer');
        itemDiv.innerText = item.name;

        let canvas = document.querySelector('.category[data-id="' + item.category + '"]');
        if(canvas) // put in category
            canvas.appendChild(itemDiv);
        else // put in 
            drawerSection.appendChild(itemDiv);
    }
}

function renderPresets() {
    for(let preset of config.presets) {
        let selectButton = document.createElement('button');
        selectButton.className = 'item button preset';
        selectButton.setAttribute('onclick', 'selectPreset()');
        selectButton.dataset.id = preset.id;
        selectButton.innerText = preset.name;
        presetSection.appendChild(selectButton);
    }
}