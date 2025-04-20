//--DEFAULT SETTINGS--//
const config = {};

//--DOM NODE REFERENCES--//
const inputTextArea = document.querySelector('textarea#input');
const countSpan = document.querySelector('span#count');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//
function textAreaOnInput() {
    countInput(inputTextArea.value);
}


//--FUNCTIONS--//
function countInput(textInput) {
    countSpan.textContent = textInput?.length || 0;
}

//--INITIAL--//
function startup() {
    countInput(inputTextArea.value);
}
