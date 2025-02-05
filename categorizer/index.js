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


//--EVENT HANDLERS--//
function onDismissHeader() {
    header.classList.add('hidden');
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
    window.data = config.preset[0];
}
