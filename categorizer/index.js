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

//--INITIAL--//
function startup() {
    loadData();
    renderCanvas();
    renderDrawer();
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
    addButton.className = 'tab button bi bi-plus';
    addButton.setAttribute('onclick', 'addItem()');
    addButton.innerText = 'Add Item';
    actions.appendChild(addButton);

    let closeButton = document.createElement('button');
    closeButton.className = 'tab button bi bi-x';
    closeButton.setAttribute('onclick', 'toggleDrawer()');
    closeButton.innerText = 'Close';
    actions.appendChild(closeButton);

    drawerSection.appendChild(actions);
}

function renderPresets() {
    presetSection.innerHTML = '';

    let actions = document.createElement('div');
    actions.className = 'actions';

    let addPreset = document.createElement('button');
    addPreset.className = 'tab button bi bi-plus';
    addPreset.setAttribute('onclick', 'addPreset()');
    addPreset.innerText = 'Add Preset';
    actions.appendChild(addPreset);

    let addCategory = document.createElement('button');
    addCategory.className = 'tab button bi bi-plus';
    addCategory.setAttribute('onclick', 'addCategory()');
    addCategory.innerText = 'Add Category';
    actions.appendChild(addCategory);

    let closeButton = document.createElement('button');
    closeButton.className = 'tab button bi bi-x';
    closeButton.setAttribute('onclick', 'togglePresets()');
    closeButton.innerText = 'Close';
    actions.appendChild(closeButton);

    presetSection.appendChild(actions);

    for(let preset of config.presets) {
        let selectButton = document.createElement('button');
        selectButton.className = 'item button preset';
        selectButton.setAttribute('onclick', 'selectPreset()');
        selectButton.dataset.id = preset.id;
        selectButton.innerText = preset.name;
        presetSection.appendChild(selectButton);
    }
}