//--DEFAULT SETTINGS--//
const config = {
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
    let selector = '[data-id="' + elem.dataset.id + '"][data-category="' + elem.dataset.category + '"]';
    event.dataTransfer.setData('text', selector);
}

function allowDrop() {
    event.preventDefault();
    drawerSection.classList.add('hidden');
}

function dropItem() {
    event.preventDefault();
    var selector = '.item' + event.dataTransfer.getData('text');
    event.target.appendChild(document.querySelector(selector));
    document.querySelector(selector).dataset.category = event.target.dataset.id;
}

function dropIntoIcon() {
    event.preventDefault();
    var selector = '.item' + event.dataTransfer.getData('text');
    drawerSection.appendChild(document.querySelector(selector));
    document.querySelector(selector).dataset.category = 'drawer';
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
    let result = prompt('Key in a name!');
    if(result) {
        let item = {
            id: new Date().toISOString(),
            name: result,
            category: 'drawer'
        };
        // create in ui
        let itemDiv = document.createElement('div');
        itemDiv.className = 'item box';
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

//--FUNCTIONS--//
function getUniqueCategories(list) {
    return list.reduce(function(total, current, index, arr) {
        if(current.category && !total.includes(current.category))
            total.push(current.category);
        return total;
    }, []);
}

//--INITIAL--//
function startup() {
    window.data = window.data?.current || config.presets[0];
    if(!window.data.categories || window.data.categories.length < 1)
        window.data.categories = getUniqueCategories(window.data.list);
    renderCanvas();
    renderDrawer();
    renderPresets();
    renderCategories();
    renderItems();
}

function renderCanvas() {
    pageSection.innerHTML = '';

    let canvasDiv = document.createElement('div');
    canvasDiv.className = 'canvas';
    canvasDiv.id = 'area-' + window.data.id;
    pageSection.appendChild(canvasDiv);
}

function renderCategories() {
    let canvas = document.querySelector('#area-' + window.data.id);
    for(let category of window.data.categories) {
        let categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.setAttribute('data-id', category);
        categoryDiv.setAttribute('ondragover', 'allowDrop()');
        categoryDiv.setAttribute('ondrop', 'dropItem()');
        canvas.appendChild(categoryDiv);
    }
}

function renderItems() {
    for(let item of window.data.list) {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'item box';
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

function renderDrawer() {
    drawerSection.innerHTML = '';
    
    let actions = document.createElement('div');
    actions.className = 'actions';

    let addButton = document.createElement('button');
    addButton.className = 'button bi bi-plus';
    addButton.setAttribute('onclick', 'addItem()');
    addButton.innerText = 'Add Item';
    actions.appendChild(addButton);

    let closeButton = document.createElement('button');
    closeButton.className = 'button bi bi-x';
    closeButton.setAttribute('onclick', 'toggleDrawer()');
    closeButton.innerText = 'Close';
    actions.appendChild(closeButton);

    drawerSection.appendChild(actions);
}

function renderPresets() {
    presetSection.innerHTML = '';

    let actions = document.createElement('div');
    actions.className = 'actions';

    let addButton = document.createElement('button');
    addButton.className = 'button bi bi-plus';
    addButton.setAttribute('onclick', 'addPreset()');
    addButton.innerText = 'Add Preset';
    actions.appendChild(addButton);

    let closeButton = document.createElement('button');
    closeButton.className = 'button bi bi-x';
    closeButton.setAttribute('onclick', 'togglePresets()');
    closeButton.innerText = 'Close';
    actions.appendChild(closeButton);

    presetSection.appendChild(actions);

    for(let preset of config.presets) {
        let selectButton = document.createElement('button');
        selectButton.className = 'item box';
        selectButton.setAttribute('onclick', 'selectPreset()');
        selectButton.dataset.id = preset.id;
        selectButton.innerText = preset.name;
        presetSection.appendChild(selectButton);
    }
}