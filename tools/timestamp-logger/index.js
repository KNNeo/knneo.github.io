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
        let result = prompt('Insert comment:');
        if(result) {
            commentInput.value = result;
        }
        else return;
    }
    config.times.push({
        time: new Date().toLocaleTimeString([], config.options),
        comment: commentInput.value
    });
    updateData();
    commentInput.value = '';
}

//--EVENT HANDLERS--//
function editComment() {
    let result = prompt('Edit comment:', event.target.innerText);
    if(result) {
        let id = parseInt(event.target.closest('tr').getAttribute('data-id'));
        if(id && id >= 0) {
            config.times[id].comment = result;
            updateData();
        }
    }
}

function deleteRow() {
    let row = event.target.closest('tr');
    let date = row.querySelector('td');
    if(date) {
        // chances of multi row delete? if hit 3dp milliseconds
        config.times = config.times.filter(t => t.time != date.innerText);
        updateData();
    }
}

//--FUNCTIONS--//
function updateData() {
    localStorage.setItem(config.storage, JSON.stringify(config.times));
    updateDisplay();
}

function updateDisplay() {
    tableDiv.innerHTML = '';
    let table = document.createElement('table');
    let tbody = document.createElement('tbody');

    config.times.forEach((data, index) => {
        let tr = document.createElement('tr');
        tr.setAttribute('data-id', index);

        let td1 = document.createElement('td');
        td1.innerText = data.time;
        tr.appendChild(td1);

        let td2 = document.createElement('td');
        td2.innerText = data.comment;
        td2.setAttribute('onclick', 'editComment()');
        tr.appendChild(td2);

        let td3 = document.createElement('td');
        td3.className = 'bi bi-trash3';
        td3.setAttribute('onclick', 'deleteRow()');
        tr.appendChild(td3);

        tbody.appendChild(tr);
    });

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
