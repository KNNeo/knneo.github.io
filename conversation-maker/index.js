//--DEFAULT SETTINGS--//
const config = {};

//--DOM NODE REFERENCES--//
const selectionDiv = document.querySelector('#selection');
const sfxAudio = document.querySelector('.sfx');

//--DOM FUNCTIONS--//
function onKeyDown() {
}

//--EVENT HANDLERS--//
function selectConversation() {
	hideAllConversations();
	if(event.target.value) {
		document.querySelector('#'+event.target.value).classList.remove('hidden');
		document.querySelector('#'+event.target.value).firstElementChild.click();
	}
}

function showMessages() {
	let conversation = event.target.closest('.conversation');
	for(let view of document.querySelectorAll('#'+conversation.id+' .view'))
	{
		view.classList.add('hidden');
	}
	if(conversation.id) {
		let textareaVal = document.querySelector('#'+conversation.id+' .editor textarea').value;
		console.log(textareaVal);
		document.querySelector('#'+conversation.id+' .messages').innerHTML = textareaVal;
		processConversations();
		document.querySelector('#'+conversation.id+' .messages').classList.remove('hidden');
	}	
}

function showEditor() {
	let conversation = event.target.closest('.conversation');
	for(let view of document.querySelectorAll('#'+conversation.id+' .view'))
	{
		view.classList.add('hidden');
	}
	if(conversation.id) {
		document.querySelector('#'+conversation.id+' .editor').classList.remove('hidden');
		updateSenderOptions(conversation);
	}
}

function updateEditor() {
	let conversation = event.target.closest('.conversation');
	window['conversation-messages'][conversation.id].content = conversation.querySelector('.editor textarea').value;
	saveToLocalStorage();
	updateSenderOptions(conversation);
}

function updateSenderOptions(conversation) {
	let selection = conversation.querySelector('.sender');
    let separator = conversation.getAttribute('data-separator') || ':';
	if(!window['conversation-messages'][conversation.id]) return;
    let lines = (window['conversation-messages'][conversation.id]?.content || '').split('\n');
	if(!lines || lines.length < 2) return;
	if(selection.childElementCount > 1) selection.innerHTML = '<option value="">=====</option>';
	let senders = lines.reduce(function(total, current) {
		let name = current.trim().substring(0,current.indexOf(separator)).trim();
		if(name && !total.includes(name))
			total.push(name);
		return total;
	},[]);
	
	for(let sender of senders)
	{
		let newOpt = document.createElement('option');
		newOpt.value = sender;
		newOpt.innerText = sender;
		newOpt.onchange = 'updateSender()';
		selection.appendChild(newOpt);
	}
}

function updateSender() {
	let conversation = event.target.closest('.conversation');
	conversation.querySelector('.messages').setAttribute('data-sender', event.target.value);
	window['conversation-messages'][conversation.id].sender = event.target.value;
	saveToLocalStorage();
}

function addConversation(nameInput) {
	let newOpt = document.createElement('option');
	let name = typeof(nameInput) == 'string' ? nameInput : prompt('Key in name:');
	if(name) {
		newOpt.innerText = name;
		let newId = 'text' + selectionDiv.childElementCount;
		newOpt.value = newId;		
		selectionDiv.appendChild(newOpt);
		
		let template = document.querySelector('.template');
		let conversation = template.content.cloneNode(true);
		conversation.firstElementChild.id = newId;
		document.querySelector('.container').appendChild(conversation);
		
		if(!window['conversation-messages'][newId])
			window['conversation-messages'][newId] = { name };
		saveToLocalStorage();
	}
}

function deleteConversation() {
	window['conversation-messages'][selectionDiv.value] = null;
	saveToLocalStorage();
	window.location.reload();
}

function clearConversations() {
	if(confirm('Delete all conversations? This cannot be reversed!'))
	{
		window['conversation-messages'] = {};
		saveToLocalStorage();
		window.location.reload();
	}
}

function toggleAudio() {
	switch(event.target.className) {
		case 'audio bi bi-volume-up':
			event.target.className = 'audio bi bi-volume-mute';
			window.ping = false;
			break;
		case 'audio bi bi-volume-mute':
			event.target.className = 'audio bi bi-volume-up';
			window.ping = true;
		default:
			break;
	}
}

//--FUNCTIONS--//
function hideAllConversations() {
	for(let conv of document.querySelectorAll('.conversation'))
	{
		conv.classList.add('hidden');
	}
}

function readFromLocalStorage() {
	window['conversation-messages'] = JSON.parse(localStorage.getItem('conversation-messages') || '{}');
	for(let key of Object.keys(window['conversation-messages']))
	{
		if(window['conversation-messages'][key]) {
			let item = window['conversation-messages'][key];
			addConversation(item.name);
			let conversation = document.querySelector('#'+key);
			if(item.content)
				conversation.querySelector('.editor textarea').value = item.content;
			if(item.sender)
				conversation.querySelector('.messages').setAttribute('data-sender', item.sender);
		}
	}
}

function saveToLocalStorage() {
	localStorage.setItem('conversation-messages', JSON.stringify(window['conversation-messages']));
}

function processConversations() {
  for(let converse of document.querySelectorAll('.conversation .messages'))
  {
    let separator = converse.getAttribute('data-separator') || ':';
    let lines = converse.innerText.split('\n');
	if(lines.length < 2) {
		converse.innerHTML = 'Click on Editor to create a conversation list';
		continue;
	}
    else converse.innerHTML = '';
	
	let prevName = '';
    for(let line of lines)
    {
      let lineDiv = document.createElement('div');
      lineDiv.classList.add('message');
      
        let messageDiv = document.createElement('span');
        lineDiv.setAttribute('data-name', line.includes(separator) ? line.trim().substring(0,line.indexOf(separator)).trim() : prevName); // if line has no sender, use previous
		prevName = lineDiv.getAttribute('data-name');
        if(converse.getAttribute('data-sender') != null) {
          if(converse.getAttribute('data-sender').toLowerCase() == lineDiv.getAttribute('data-name').toLowerCase())
            lineDiv.setAttribute('data-sender', '');
          else
            lineDiv.setAttribute('data-recipient', '');
        }
        messageDiv.innerText = line.trim().substring(line.indexOf(separator)+1).trim();
        lineDiv.appendChild(messageDiv);
      
      converse.appendChild(lineDiv);
    }
    if(converse.getAttribute('data-animate') != null) {
      let footer = document.createElement('div');
      footer.className = 'footer message';
      footer.innerText = '🔁';
	  footer.title = 'Replay Conversation';
      footer.setAttribute('onclick', "animateConversation(this.closest('.conversation'))");
      converse.appendChild(footer);
    }
  }
}

function animateConversation() {
	let converse = event.target.closest('.conversation').querySelector('.messages');
	let lines = Array.from(converse.querySelectorAll('.message'));
	if(lines.filter(l => l.classList.contains('hide')).length > 0) return;
	for(let line of lines)
	{
		line.classList.add('hide');
	}
	for(let l = 0; l < lines.length; l++)
	{
		setTimeout(function() {
			if(window.ping && !lines[l].classList.contains('footer')) // play sound effect on each message
				sfxAudio.play();
			lines[l].classList.remove('hide');
			let heightAboveItem = l-1 > 0 ? lines.slice(0,l-1).reduce(function(total, current, index) {
				return total + current.getBoundingClientRect().height;
			}, 0) : 0;
			let currentHeight = lines[l].getBoundingClientRect().height;
			let diff = heightAboveItem + 2*currentHeight - converse.clientHeight; // delta to fix item height rounding
			if(diff > 0) {
				if(diff < currentHeight) // fix container height wrt to message height
					converse.scrollBy({ top: diff, behavior: 'smooth' });
				else
					converse.scrollBy({ top: currentHeight, behavior: 'smooth' });
			}
			else 
				converse.scrollTo({ top: 0, behavior: 'smooth' });
		}, l*1500);
	}
}

//--INITIAL--//
function startup() {
	readFromLocalStorage();
	hideAllConversations();
}
