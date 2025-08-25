//--DEFAULT SETTINGS--//
const config = {
    storage: 'timestamp-log-v1',
    times: [],
    options: {  
        year: "numeric", month: "2-digit", day: "2-digit", 
        hour: "2-digit", minute: "2-digit", seconds: "2-digit",
        fractionalSecondDigits: 3
    }
};

//--DOM NODE REFERENCES--//
let tableDiv = document.querySelector('div.table');
let commentInput = document.querySelector('input.comment');

//--DOM FUNCTIONS--//
function onKeyDown() {
	if(event.key == 'Space')
        logTime();
}

function commentOnKeyDown() {
	if(event.key == 'Enter')
        logTime();
}

function logTime() {
    if(!commentInput.value){
        let result = confirm('Insert comment:');
        if(result) {
            commentInput.value = result;
        }
        else return;
    }
    config.times.push({
        time: new Date().toLocaleTimeString([], config.options),
        comment: commentInput.value
    });
    localStorage.setItem(config.storage, JSON.stringify(config.times));
    updateDisplay();
}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
function updateDisplay() {
    tableDiv.innerHTML = '';
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    for(let data of config.times) {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        td1.innerText = data.time;
        tr.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerText = data.comment;
        tr.appendChild(td2);

        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableDiv.appendChild(table);

    tableDiv.querySelector('tr:last-child').scrollIntoView({ behavior: 'smooth', block: 'end' });
}

//--INITIAL--//
function startup() {
    if(localStorage.getItem(config.storage))
        config.times = JSON.parse(localStorage.getItem(config.storage));
    updateDisplay();
}
