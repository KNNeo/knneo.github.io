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
		event.target.blur();
	}
}

function showMessages() {
	let conversation = event.target.closest('.conversation');
	for(let view of document.querySelectorAll('#'+conversation.id+' .view'))
	{
		view.classList.add('hidden');
	}
	if(conversation.id) {
		document.querySelector('#'+conversation.id+' .messages').innerHTML = document.querySelector('#'+conversation.id+' .editor textarea').value;
		processConversations();
		document.querySelector('#'+conversation.id+' .messages').classList.remove('hidden');
		document.querySelector('#'+conversation.id+' .messages .footer').scrollIntoView();
	}
	disableRunMessages(conversation);
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
		let sender = conversation.querySelector('.messages').getAttribute('data-sender');
		conversation.querySelector('.sender option[value=' + sender + ']').selected = sender;
	}
	disableRunMessages(conversation);
	document.querySelector('#'+conversation.id+' .messages').innerHTML = '';
}

function updateEditor() {
	let conversation = event.target.closest('.conversation');
	window['conversation-messages'][conversation.id].content = conversation.querySelector('.editor textarea').value;
	saveToLocalStorage();
	updateSenderOptions(conversation);
	allowRunMessages(conversation);
}

function updateSenderOptions(conversation) {
	let selection = conversation.querySelector('.sender');
	let separator = conversation.querySelector('.messages').getAttribute('data-separator') || ':';
	if(!window['conversation-messages'][conversation.id]) return;
	let lines = (window['conversation-messages'][conversation.id]?.content || '').split('\n');
	if(!lines || lines.length < 2) return;
	if(selection.childElementCount > 1) selection.innerHTML = '<option value="">=====</option>';
	let senders = lines.reduce(function(total, line) {
		let isUrl = line.startsWith('https://') || line.startsWith('http://');
		let name = isUrl ? '' : line.trim().substring(0,line.indexOf(separator)).trim();
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

function updateSeparator() {
	let conversation = event.target.closest('.conversation');
	conversation.querySelector('.messages').setAttribute('data-separator', event.target.value);
	window['conversation-messages'][conversation.id].separator = event.target.value;
	saveToLocalStorage();
}

function addConversation(name) {
	let newOpt = document.createElement('option');
	if(!name || !typeof(name) == 'string')
		name = prompt('Key in name:');
	if(name) {
		newOpt.innerText = name;
		let newId = 'text' + selectionDiv.childElementCount;
		newOpt.value = newId;		
		selectionDiv.appendChild(newOpt);
		
		let template = document.querySelector('.template-message');
		let conversation = template.content.cloneNode(true);
		conversation.firstElementChild.id = newId;
		document.querySelector('.container').appendChild(conversation);
		
		if(!window['conversation-messages'][newId])
			window['conversation-messages'][newId] = { name };
		saveToLocalStorage();
	}
}

function renameConversation() {
	let newName = prompt('Key in new name:', window['conversation-messages'][selectionDiv.value].name);
	if(newName != null)
		window['conversation-messages'][selectionDiv.value].name = newName;
	saveToLocalStorage();
	window.location.reload();
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

function showData() {
	popupText('<textarea id="data" name="data" rows="8" cols="40" style="max-width: 90%;">' + localStorage.getItem('conversation-messages') + '</textarea>' + 
	'<div><a class="add bi bi-copy" href="javascript:void(0);" title="Copy Data" onclick="navigator.clipboard.writeText(document.querySelector(\'#data\').value);"></a>' + 
	'<a class="add bi bi-x-square" href="javascript:void(0);" title="Save/Close Data" onclick="updateData()"></a></div>');
}

function updateData() {
	if(localStorage.getItem('conversation-messages') != document.querySelector('#data').value) // update if different
	{
		if(document.querySelector('#data').value.length < 1) // set empty
			document.querySelector('#data').value = '{}';
		localStorage.setItem('conversation-messages', document.querySelector('#data').value);
		startup();
	}
	removeDialog();
}

//--FUNCTIONS--//
function hideAllConversations() {
	for(let conv of document.querySelectorAll('.conversation'))
	{
		conv.querySelector('.messages').removeAttribute('data-running');
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
			if(item.content) // editor content
				conversation.querySelector('.editor textarea').value = item.content;
			if(item.separator) { // separator input
				conversation.querySelector('.messages').setAttribute('data-separator', item.separator);
				conversation.querySelector('.editor .separator').value = item.separator;
			}
			if(item.sender) { // sender input
				conversation.querySelector('.messages').setAttribute('data-sender', item.sender);
				updateSenderOptions(conversation);
			}
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
    let systemMessagePrefix = '===';
    let lines = converse.innerText.split('\n');
	if(lines.length < 2) {
		converse.innerHTML = 'Click on Editor to create a conversation list';
		continue;
	}
    else converse.innerHTML = '';
	
	let prevName = '';
    for(let line of lines)
    {
	  let isSystem = line.startsWith(systemMessagePrefix) && line.endsWith(systemMessagePrefix);
	  let isUrl = line.startsWith('https://') || line.startsWith('http://');
      let lineDiv = document.createElement('div');
      lineDiv.classList.add('message');
	  lineDiv.setAttribute('onclick', 'toggleReactions()');
      
        let messageDiv = document.createElement('div');
		messageDiv.classList.add('container');
        let messageText = document.createElement('span');
	if(!isSystem) // for non-system, if line has no sender, use previous
		lineDiv.setAttribute('data-name', !isUrl && line.includes(separator) ? line.trim().substring(0,line.indexOf(separator)).trim() : prevName);
	prevName = lineDiv.getAttribute('data-name');
        if(converse.getAttribute('data-sender') != null) {
	  if (isSystem)
	    lineDiv.setAttribute('data-system', '');
	  else {
		  if (isUrl)
	    lineDiv.setAttribute('data-url', '');
          if(converse.getAttribute('data-sender').toLowerCase() == lineDiv.getAttribute('data-name').toLowerCase())
            lineDiv.setAttribute('data-sender', '');
          else
            lineDiv.setAttribute('data-recipient', '');
	  }
        }
        messageText.innerText = line.trim().substring(line.indexOf(separator)+1).trim();
	if(isSystem)
		messageText.innerText =  line.trim();
	messageDiv.appendChild(messageText);
	if(isUrl) {
	     messageDiv.innerHTML =  '';
	     let messageLink = document.createElement('a');
	     messageLink.href = line.trim();
	     messageLink.innerText =  line.trim();
	     messageDiv.appendChild(messageLink);
		
	     let messageImg = document.createElement('img');
	     messageImg.src = line.trim();
	     messageImg.alt = '';
	     messageImg.setAttribute('onload', "event.target.previousElementSibling.remove();");
	     messageImg.setAttribute('onerror', "event.target.remove();");
	     messageImg.setAttribute('oncontextmenu', "return false;");
	     messageDiv.appendChild(messageImg);
	}
        lineDiv.appendChild(messageDiv);
      
      converse.appendChild(lineDiv);
    }
    if(converse.getAttribute('data-animate') != null) {
      let footer = document.createElement('div');
      footer.className = 'footer message';
      footer.innerText = '🔁';
	  footer.title = 'Replay Conversation';
      footer.setAttribute('onclick', 'animateConversation()');
      converse.appendChild(footer);
    }
  }
}

function toggleReactions() {
	let message = event.target.closest('.message');
	if(message.querySelector('.reactions') != null) {
		message.querySelector('.reactions').remove();	
	}
	else {
		let template = document.querySelector('.template-reactions');
		let reactions = template.content.cloneNode(true);
		message.querySelector('div').appendChild(reactions);
	}
}

function setReaction() {
	let message = event.target.closest('.message');
	if(message.querySelector('.reactions') != null) {
		message.querySelector('.reactions').innerHTML = '';	
	}
	let reaction = event.target.cloneNode(true);
	reaction.setAttribute('onclick', 'event.target.remove()');
	message.querySelector('.reactions').appendChild(reaction);
}

function animateConversation() {
	let conversation = event.target.closest('.conversation').querySelector('.messages');
	allowRunMessages(conversation);
	
	// read lines
	let lines = conversation.querySelectorAll('.message');
	if(Array.from(lines).filter(l => l.classList.contains('hide')).length > 0) return;
	for(let line of lines)
	{
		line.classList.add('hide');
	}
	// set timing to display and scroll
	for(let l = 0; l < lines.length; l++)
	{
		setTimeout(function() {
			if(conversation.getAttribute('data-running') != null) {
				if(window.ping && !lines[l].classList.contains('footer') && lines[l].getAttribute('data-system') == null) // play sound effect on each message
					sfxAudio.play();
				if(lines[l].classList.contains('footer'))
					disableRunMessages(conversation);
				lines[l].classList.remove('hide');
				let heightAboveItem = Array.from(lines).slice(0,l).reduce(function(total, current, index) {
					return total + current.getBoundingClientRect().height;
				}, 0);
				let currentHeight = lines[l].getBoundingClientRect().height;
				let diff = heightAboveItem + currentHeight - conversation.clientHeight; // delta to fix item height rounding
				// console.log(heightAboveItem + currentHeight, conversation.clientHeight);
				if(diff > 0) {
					if(diff < currentHeight) // newest message is not aligned to bottom of container
						conversation.scrollBy({ top: diff, behavior: 'smooth' });
					else
						conversation.scrollBy({ top: currentHeight, behavior: 'smooth' });
				}
				else // newest message is not at or beyond bottom of container
					conversation.scrollTo({ top: 0 });
			}
		}, l*2000);
	}
}

function startConversation() {
	let conversation = event.target.closest('.conversation').querySelector('.messages');
	
	// read lines
	let lines = conversation.querySelectorAll('.message');
	if(Array.from(lines).filter(l => l.classList.contains('hide')).length > 0) return;
	for(let line of lines)
		line.classList.add('hide');
	
	let footer = conversation.querySelector('.footer');
	footer.classList.remove('hide');
	footer.innerText = '🔽';
	footer.title = 'Play Next Message';
	footer.setAttribute('onclick', 'nextMessage()');
	footer.click();
}

function nextMessage() {
	// read lines
	let conversation = event.target.closest('.conversation').querySelector('.messages');
	let lines = conversation.querySelectorAll('.message');
	let l = Array.from(lines).indexOf(conversation.querySelector('.message.hide'));	
	// play sound effect on each message
	if(window.ping && !lines[l].classList.contains('footer') && lines[l].getAttribute('data-system') == null) 
		sfxAudio.play();
	// if(lines[l].classList.contains('footer'))
		// disableRunMessages(conversation);
	lines[l].classList.remove('hide');
	let heightAboveItem = Array.from(lines).slice(0,l).reduce(function(total, current, index) {
		return total + current.getBoundingClientRect().height;
	}, 0);
	let currentHeight = lines[l].getBoundingClientRect().height;
	let diff = heightAboveItem + currentHeight - conversation.clientHeight; // delta to fix item height rounding
	// console.log(heightAboveItem + currentHeight, conversation.clientHeight);
	if(diff > 0) {
		if(diff < currentHeight) // newest message is not aligned to bottom of container
			conversation.scrollBy({ top: diff, behavior: 'smooth' });
		else
			conversation.scrollBy({ top: currentHeight, behavior: 'smooth' });
	}
	else // newest message is not at or beyond bottom of container
		conversation.scrollTo({ top: 0 });
	
	// if end of conversation, allow replay
	if(l >= lines.length - 2) {
		let footer = conversation.querySelector('.footer');
		footer.innerText = '🔁';
		footer.title = 'Replay Conversation';
		footer.setAttribute('onclick', 'startConversation()');
		
		conversation.scrollBy({ 
			top: heightAboveItem + currentHeight + footer.getBoundingClientRect().height, 
			behavior: 'smooth'
		});
		disableRunMessages(conversation);
		return;
	}
}

function allowRunMessages(conversation) {
	// set status
	conversation.setAttribute('data-running', '');
	// disable scroll capture
	conversation.setAttribute('onwheel', 'event.preventDefault()');
	conversation.setAttribute('onmousewheel', 'event.preventDefault()');
	conversation.setAttribute('ontouchstart', 'event.preventDefault()');	
}

function disableRunMessages(conversation) {
	// remove status
	conversation.removeAttribute('data-running');
	// remove scroll capture
	conversation.removeAttribute('onwheel');
	conversation.removeAttribute('onmousewheel');
	conversation.removeAttribute('ontouchstart');
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
	hideAllConversations();
}
