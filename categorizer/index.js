//--DEFAULT SETTINGS--//
const config = {
    presets: [
        {
            id: 1,
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

//--DOM FUNCTIONS--//
function onDismissHeader() {
    header.classList.add('hidden');
}

//--EVENT HANDLERS--//
function dragItem() {
    let elem = event.target;
    let id = '.item[data-id="' + elem.dataset.id + '"][data=category="' + elem.dataset.category + '"]';
    event.dataTransfer.setData("text", id);
}

function allowDrop() {
    event.preventDefault();
}

function dropItem() {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");
    event.target.appendChild(document.querySelector(data));
}

function toggleDrawer() {
    drawerSection.classList.toggle('hidden');
}

function selectPreset() {

}

//--FUNCTIONS--//
function getUniqueCategories(list) {
    return list.reduce(function(total, current, index, arr) {
        if(!total.includes(current.category))
            total.push(current.category);
    }, []);
}

//--INITIAL--//
function startup() {
    window.data = config.presets[0];
    window.data.categories = getUniqueCategories(window.data.list);
    renderCanvas();
    renderCategories();
    renderItems();
    renderDrawer();
}

function renderCanvas() {
    let canvasDiv = document.createElement('div');
    canvasDiv.className = 'canvas';
    canvasDiv.id = window.data.id;
    pageSection.appendChild(canvasDiv);
}

function renderCategories() {
    let canvas = document.querySelector('#' + window.data.id);
    for(let category of window.data.categories) {
        let categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.setAttribute('data-id', category);
        categoryDiv.setAttribute('ondragover', 'allowDrop()');
        categoryDiv.setAttribute('ondrop', 'dropItem()');
        canvas.appendChild(categoryArea);
    }
}

function renderItems() {
    for(let item of window.data.list) {
        let itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.setAttribute('draggable', 'true');
        itemDiv.setAttribute('ondragstart', 'dragItem()');
        itemDiv.setAttribute('data-id', item.id);
        if(item.category) itemDiv.setAttribute('data-category', item.category);
        itemDiv.innerText = item.name;

        let canvas = document.querySelector('.category[data-id="' + item.category + '"]');
        if(canvas) // put in category
            canvas.appendChild(itemDiv);
        else // put in 
            drawerSection.appendChild(itemDiv);
    }
}

function renderDrawer() {
    let closeButton = document.createElement('button');
    button.setAttribute('onclick', 'toggleDrawer()');

    drawerSection.appendChild(closeButton);
}