//--DEFAULT SETTINGS--//
const config = {
    hide: {
        code: true,
        clear: true
    }
};
const emojiRegex = /(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\p{Extended_Pictographic})+/gv;

//--DOM NODE REFERENCES--//
const selectionDiv = document.querySelector('#selection');
const sfxAudio = document.querySelector('.sfx');

//--DOM FUNCTIONS--//
function onKeyDown() {
}

//--EVENT HANDLERS--//
function selectConversation() {
	hideAllConversations();
	if (event.target.value) {
		document.querySelector('#' + event.target.value).classList.remove('hidden');
		document.querySelector('#' + event.target.value).firstElementChild.click();
        document.querySelector('#' + event.target.value + ' .messages').style.height = '';
		event.target.blur();
	}
}

function showMessages() {
	let conversation = event.target.closest('.conversation');
	for (let view of document.querySelectorAll('#' + conversation.id + ' .view')) {
		view.classList.add('hidden');
	}
	if (conversation.id) {
		document.querySelector('#' + conversation.id + ' .messages').innerHTML = document.querySelector('#' + conversation.id + ' .editor textarea').value;
		processConversations();
		document.querySelector('#' + conversation.id + ' .messages').classList.remove('hidden');
		document.querySelector('#' + conversation.id + ' .messages .footer')?.scrollIntoView();
	}
	disableRunMessages(conversation);
}

function showEditor() {
	let conversation = event.target.closest('.conversation');
	for (let view of document.querySelectorAll('#' + conversation.id + ' .view')) {
		view.classList.add('hidden');
	}
	if (conversation.id) {
		document.querySelector('#' + conversation.id + ' .editor').classList.remove('hidden');
		updateSenderOptions(conversation);
		let sender = conversation.querySelector('.messages').getAttribute('data-sender');
		if (sender != null)
			conversation.querySelector('.sender option[value=' + sender + ']').selected = sender;
	}
	disableRunMessages(conversation);
	document.querySelector('#' + conversation.id + ' .messages').innerHTML = '';
}

function saveEditor(event) {
	if(event.target.classList.contains('bi-floppy')) {
		let conversation = event.target.closest('.conversation');
		window['conversation-messages'][conversation.id].content = conversation.querySelector('.editor textarea').value;
		saveToLocalStorage();
		updateSenderOptions(conversation);
		// change icon
		event.target.classList.toggle('bi-floppy');
		event.target.classList.toggle('bi-check2-circle');
		setTimeout(function() {
			event.target.classList.toggle('bi-floppy');
			event.target.classList.toggle('bi-check2-circle');
		}, 500);
	}
}

function updateEditor(event) {
	saveEditor(event);
	allowRunMessages(event.target.closest('.conversation'));
}

function saveToLocalStorage() {
	localStorage.setItem('conversation-messages', JSON.stringify(window['conversation-messages'] || ''));
}

function updateSenderOptions(conversation) {
	let selection = conversation.querySelector('.sender');
	let separator = conversation.querySelector('.messages').getAttribute('data-separator') || ':';
	if (!window['conversation-messages'][conversation.id])
		return;
	let lines = (window['conversation-messages'][conversation.id]?.content || '').split('\n');
	if (!lines || lines.length < 2)
		return;
	let value = selection.value;
	// reset and render
	selection.innerHTML = '<option value="">=====</option>';
	let senders = lines.reduce(function (total, line) {
		let isUrl = line.startsWith('https://') || line.startsWith('http://');
		let name = isUrl ? '' : line.trim().substring(0, line.indexOf(separator)).trim();
		if (name && !total.includes(name))
			total.push(name);
		return total;
	}, []);

	for (let sender of senders) {
		let newOpt = document.createElement('option');
		newOpt.value = sender;
		newOpt.innerText = sender;
		newOpt.onchange = 'updateSender()';
		selection.appendChild(newOpt);
	}
	if(value)
		selection.value = value;
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

function updateNames() {
    let conversation = event.target.closest('.conversation');
    window['conversation-messages'][conversation.id].names = event.target.checked;
    if(event.target.checked)
        conversation.querySelector('.messages').setAttribute('data-names', '');
    else
        conversation.querySelector('.messages').removeAttribute('data-names');
    saveToLocalStorage();
}

function addConversation(name) {
	let newOpt = document.createElement('option');
	if (!name || !typeof (name) == 'string')
		name = prompt('Key in name:');
	if (name) {
		newOpt.innerText = name;
		let newId = 'text' + selectionDiv.childElementCount;
		newOpt.value = newId;
		selectionDiv.appendChild(newOpt);

		let template = document.querySelector('.template-message');
		let conversation = template.content.cloneNode(true);
		conversation.firstElementChild.id = newId;
		document.querySelector('.container').appendChild(conversation);

		if (!window['conversation-messages'][newId])
			window['conversation-messages'][newId] = {
				name
			};
		saveToLocalStorage();
	}
}

function renameConversation() {
	let newName = prompt('Key in new name:', window['conversation-messages'][selectionDiv.value].name);
	if (newName != null) {
		window['conversation-messages'][selectionDiv.value].name = newName;
		saveToLocalStorage();
		window.location.reload();
	}
}

function deleteConversation() {
	if(confirm('Confirm delete current conversation? This action cannot be reversed.')) {
		// empty current item
		delete window['conversation-messages'][selectionDiv.value];
		// shift keys
		let keys = Object.keys(window['conversation-messages']);
		for (let i = 1; i <= keys.length; i++) {
			if (!window['conversation-messages']['text' + i]) {
				window['conversation-messages']['text' + i] = window['conversation-messages']['text' + (1 + i)];
				delete window['conversation-messages']['text' + (1 + i)];
			}
		}
		// empty last item
		delete window['conversation-messages']['text' + (1 + keys.length)];
	
		// save and reload
		saveToLocalStorage();
		window.location.reload();
	}
}

function clearConversations() {
	if (confirm('Delete all conversations? This action cannot be reversed!')) {
		window['conversation-messages'] = {};
		saveToLocalStorage();
		window.location.reload();
	}
}

function setReaction() {
	let message = event.target.closest('.message');
	if (message.querySelector('.reactions') != null) {
		let reaction = event.target.cloneNode(true);
		reaction.setAttribute('onclick', 'event.target.remove()');
		message.querySelector('.reactions').setAttribute('data-selected', '');
		message.querySelector('.reactions').innerHTML = '';
		message.querySelector('.reactions').appendChild(reaction);
	}
}

function toggleReactions() {
	let message = event.target.closest('.message');
	if (!message) return;
	if (message.querySelector('.reactions') != null) {
		message.querySelector('.reactions').remove();
		message.removeAttribute('data-selected');
	} else {
		let template = document.querySelector('.template-reactions');
		let reactions = template.content.cloneNode(true);
		message.querySelector('.container').appendChild(reactions);
	}
}

function toggleAudio() {
	switch (event.target.className) {
		case 'audio bi bi-volume-up':
			event.target.className = 'audio bi bi-volume-mute';
			window.ping = false;
			break;
		case 'audio bi bi-volume-mute':
			event.target.className = 'audio bi bi-volume-up';
			window.ping = true;
            sfxAudio.play();
		default:
			break;
	}
}

function showData() {
	popupText('<textarea id="data" name="data" rows="8" cols="40" style="max-width: 90%;">' + (localStorage.getItem('conversation-messages') || '') + '</textarea>' +
		'<div><a class="add bi bi-copy" href="javascript:void(0);" title="Copy Data" onclick="navigator.clipboard.writeText(document.querySelector(\'#data\').value);"></a>' +
		'<a class="add bi bi-x-square" href="javascript:void(0);" title="Save/Close Data" onclick="updateData()"></a></div>');
}

function updateData() {
	if (localStorage.getItem('conversation-messages') != document.querySelector('#data').value) // update if different
	{
		if (document.querySelector('#data').value.length < 1) // set empty
			document.querySelector('#data').value = '{}';
		localStorage.setItem('conversation-messages', document.querySelector('#data').value);
		startup();
	}
	removeDialog();
}

function toggleFullscreen() {
    let pageDiv = document.querySelector('.page');
    if(pageDiv.getAttribute('data-fullscreen') == null) {
        pageDiv.setAttribute('data-fullscreen', '');
		let doc = document.documentElement;
		if (doc.requestFullscreen)
			doc.requestFullscreen();
		else if (doc.mozRequestFullScreen) //Firefox 
			doc.mozRequestFullScreen();
		else if (doc.webkitRequestFullscreen) //Chrome, Safari, Opera
			doc.webkitRequestFullscreen();
		else if (doc.msRequestFullscreen) //IE,Edge
			doc.msRequestFullscreen();
	}
    else {
        pageDiv.removeAttribute('data-fullscreen');
        document.querySelector('.conversation:not(.hidden) .messages').style.height = '';
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if (document.mozCancelFullScreen) //Firefox
			document.mozCancelFullScreen();
		else if (document.webkitExitFullscreen) //Chrome, Safari, Opera
			document.webkitExitFullscreen();
		else if (document.msExitFullscreen) //IE, Edge
			document.msExitFullscreen();
    }
    event.target.classList.toggle('bi-phone');
    event.target.classList.toggle('bi-circle');
}

//--FUNCTIONS--//
function processConversations() {
	for (let converse of document.querySelectorAll('.conversation .messages'))
		processConversation(converse);
}

function processConversation(converse) {
	let lineSeparator = converse.getAttribute('data-separator') || ':';
	let choiceSeparator = '|';
	let systemMessagePrefixSuffix = '===';
	let lines = converse.innerText.split('\n');
	if (lines.length < 2) {
		converse.innerHTML = 'Click on Editor to create a conversation list';
		return;
	} else
		converse.innerHTML = '';
	// render lines
	let prevName = '';
	for (let line of lines) {
		let isSystem = line.startsWith(systemMessagePrefixSuffix) && line.endsWith(systemMessagePrefixSuffix);
		let isUrl = line.startsWith('https://') || line.startsWith('http://');
		// render messages
		let lineDiv = document.createElement('div');
		lineDiv.classList.add('message');
		converse.appendChild(lineDiv);
		for (let message of line.trim().substring(line.indexOf(lineSeparator) + 1).trim().split(choiceSeparator)) {
			let messageDiv = document.createElement('div');
			messageDiv.classList.add('container');
			// change size if only contains emoji
			let emojiMatch = message.trim().match(emojiRegex);
			if (emojiMatch && emojiMatch.length == 1 && message.replace(emojiMatch[0], '').length < 1) {
				messageDiv.classList.add('emoji');
				message += `\uFE0F`; // variation selector, can only fix single character
			}
			// actual message
			let messageText = document.createElement('span');
			let senderDefined = line.includes(lineSeparator);
			if (!isSystem) // for non-system, if line has no sender, use previous
            lineDiv.setAttribute('aria-label', !isUrl && senderDefined ? line.trim().substring(0, line.indexOf(lineSeparator)).trim() : prevName);
        if (senderDefined)
            lineDiv.setAttribute('data-first', '');
			prevName = lineDiv.getAttribute('aria-label');
			// check sender type
			if (converse.getAttribute('data-sender') != null) {
				if (isSystem)
					lineDiv.setAttribute('data-system', '');
				else {
					if (isUrl)
						lineDiv.setAttribute('data-url', '');
					if (converse.getAttribute('data-sender').toLowerCase() == lineDiv.getAttribute('aria-label').toLowerCase())
						lineDiv.setAttribute('data-sender', '');
					else {
						lineDiv.setAttribute('data-recipient', '');
						lineDiv.setAttribute('onclick', 'toggleReactions()');
					}
				}
			}
			// extract text after sender name identified
			messageText.innerText = message;
			if (isSystem)
				messageText.innerText = line.replace(/===/g,'').trim();
			messageDiv.appendChild(messageText);
			if (isUrl) {
				messageDiv.innerHTML = '';
				// change to link tag
				let messageLink = document.createElement('a');
				messageLink.href = line.trim();
				messageLink.innerText = line.trim();
				messageDiv.appendChild(messageLink);
				// try render image
				let messageImg = document.createElement('img');
				messageImg.src = line.trim();
				messageImg.alt = '';
				messageImg.setAttribute('onload', 'event.target.previousElementSibling.remove()');
				messageImg.setAttribute('onerror', 'event.target.remove()');
				messageImg.setAttribute('oncontextmenu', 'return false');
				messageDiv.appendChild(messageImg);
			}
			lineDiv.appendChild(messageDiv);
		}
	}
    // footer
	let footer = document.createElement('div');
	footer.className = 'footer message';
	footer.innerText = '🔁';
	footer.title = 'Replay Conversation';
	footer.setAttribute('onclick', 'startConversation()');
	converse.appendChild(footer);
}

function startConversation() {
	let conversation = event.target.closest('.conversation');
	let messages = conversation.querySelector('.messages');
	// hide all lines
	let lines = messages.querySelectorAll('.message');
	if (Array.from(lines).filter(l => l.classList.contains('hide')).length > 0)
		return; // should not start if still have lines hidden, means is running
	for (let line of lines)
		line.classList.add('hide');
	// show all choices
	for(let choice of messages.querySelectorAll('.container.hidden'))
		choice.classList.remove('hidden');
	// create manual next message trigger
	let footer = messages.querySelector('.footer');
	footer.innerText = '🔽';
	footer.title = 'Play Next Message';
	footer.setAttribute('onclick', 'nextMessage()');
	// start run
    toggleConversation(conversation);
}

function nextMessage() {
	// read lines
	let conversation = document.querySelector('.conversation:not(.hidden)');
	let messages = conversation.querySelector('.messages');
	let lines = messages.querySelectorAll('.message');
	let l = Array.from(lines).indexOf(conversation.querySelector('.message.hide'));
	// if multiple messages found on line
	if (lines[l].querySelectorAll('.container').length > 1) {
		// choice not made
		if (!window.choice) {
			if (lines[l].getAttribute('data-sender') == null)
				// not from sender, choose at random
				window.choice = Math.ceil(lines[l].querySelectorAll('.container').length * Math.random());
			else {
				// from sender, show choices and wait
				disableRunMessages(conversation);
				setChoices(lines[l].querySelectorAll('.container'));
				// console.log('wait for reply');
				setTimeout(waitForSender, 500);
			}
		}
		// choice made, hide other messages on line and continue
		if (window.choice) {
			allowRunMessages(conversation);
			for (let choice of lines[l].querySelectorAll('.container:not(:nth-child(' + window.choice + '))'))
				choice.classList.add('hidden');
		}
		// exclusion: if not sender, choose first option
		if (lines[l].getAttribute('data-sender') == null)
			window.choice = 0;
	} else {
		// set choice if no alternate choices found
		window.choice = 0;
	}
	// not recipient, show message directly
	if (l == 0 || lines[l].getAttribute('data-loaded') != null || lines[l].getAttribute('data-recipient') == null || lines[l].getAttribute('data-first') == null) {
        // play sound effect on each message
        if (window.ping && !lines[l].classList.contains('footer') && lines[l].getAttribute('data-system') == null)
            sfxAudio.play();
		// unhide first hidden message
		lines[l].classList.remove('hide');
		// calculate scroll to show next message
		let currentHeight = lines[l].getBoundingClientRect().height;
		let heightAboveItem = Array.from(lines).slice(0, l).reduce(function (total, current, index) {
			return total + current.getBoundingClientRect().height;
		}, 0);
		let diff = heightAboveItem + currentHeight - conversation.querySelector('.messages').clientHeight; // delta to fix item height rounding
		// console.log(heightAboveItem + currentHeight, conversation.clientHeight);
		if (diff > 0) {
			// newest message is not aligned to bottom of container
			if (diff < currentHeight)
				conversation.querySelector('.messages').scrollBy({
					top: diff,
					behavior: 'smooth'
				});
			else
				conversation.querySelector('.messages').scrollBy({
					top: currentHeight,
					behavior: 'smooth'
				});
		} else
			// newest message is not at or beyond bottom of container
			conversation.querySelector('.messages').scrollTo({
				top: 0
			});
	}
	else if (lines[l].getAttribute('data-loading') != null) {
        if(messages.querySelector('.loader')) {
			// do not calculate next message pop time
			setTimeout(function () {
                // loading, remove loader and trigger again
                messages.removeChild(messages.querySelector('.loader'));
                // scroll back up
                conversation.querySelector('.messages').scrollBy({
                    top: -1*window['loader'],
                    behavior: 'smooth'
                });
				// console.log('call loader');
				conversation.querySelector('.footer')?.click();
			}, 500);
			return;
        }
		// if still running, call next message
		if (conversation.getAttribute('data-running') != null) {
            // current line is now same as next line without loader
            if (l < lines.length - 1)
                lines[l].setAttribute('data-loaded', '');
			// do not calculate next message pop time, set minimum delay
			setTimeout(function () {
				// console.log('hide loader');
				conversation.querySelector('.footer')?.click();
			}, 500);
			return;
		}
	}
	else {
		// add loader, calculate scroll dist
		let loader = document.createElement('div');
		loader.className = 'message loader';
		loader.innerText = '• • •';
		messages.insertBefore(loader, lines[l]);
        // scroll down
		// calculate scroll to show next message
		let currentHeight = 16 + loader.getBoundingClientRect().height;
		let heightAboveItem = Array.from(lines).slice(0, l).reduce(function (total, current, index) {
			return total + current.getBoundingClientRect().height;
		}, 0);
		let diff = heightAboveItem + currentHeight - conversation.querySelector('.messages').clientHeight; // delta to fix item height rounding
		// console.log(heightAboveItem + currentHeight, conversation.clientHeight);
		if (diff > 0) {
            window['loader'] = currentHeight;
			// newest message is not aligned to bottom of container
			if (diff < currentHeight)
				conversation.querySelector('.messages').scrollBy({
					top: diff,
					behavior: 'smooth'
				});
			else
				conversation.querySelector('.messages').scrollBy({
					top: currentHeight,
					behavior: 'smooth'
				});
		} else
			// newest message is not at or beyond bottom of container
			conversation.querySelector('.messages').scrollTo({
				top: 0
			});
		// if still running, call next message
		if (conversation.getAttribute('data-running') != null) {
            lines[l].setAttribute('data-loading', '');
            window['next'] = calculateWriteTime(lines[l + 1]?.innerText);
			// do not calculate next message pop time
			setTimeout(function () {
				// console.log('call loader');
				conversation.querySelector('.footer')?.click();
			}, window['next']);
			return;
		}
	}
	// if end of conversation, allow replay
	if (l >= lines.length - 1) {
		let footer = conversation.querySelector('.footer');
		footer.className = 'footer message';
		footer.innerText = '🔁';
		footer.title = 'Replay Conversation';
		footer.setAttribute('onclick', 'startConversation()');
		// check if need to continue
		toggleConversation(conversation);
		return;
	}
	// avoid run if prompt to choose
	if (lines[l].querySelectorAll('.container').length > 1 && !window.choice)
		return;
	// if still running, call next message (after loader)
	if (conversation.getAttribute('data-running') != null) {
        let writeTime = calculateWriteTime(lines[l + 1]?.innerText) + (lines[l + 1].getAttribute('data-sender') == null ? 0 : 1000);
		setTimeout(function () {
			// console.log('call next');
			conversation.querySelector('.footer')?.click();
		}, writeTime);
	}
}

function calculateWriteTime(text) {
    // calculate next message pop time
    let writeLength = text && text.length || 1;
    let writeTime = 1000;
    let isEmoji = text.trim().match(emojiRegex);
    if(isEmoji && writeLength < 5)
        return writeTime;
    if(writeLength > 3)
        writeTime = 1500;
    if(writeLength > 12)
        writeTime += writeLength / 12 * 1500;
    if (!writeTime)
        writeTime = 1500;
    return writeTime;
}

function setChoices(choices) {
	// add event listeners
	for (let c = 0; c < choices.length; c++) {
		choices[c].setAttribute('onclick', 'window.choice=' + (1 + c));
		choices[c].setAttribute('oncontextmenu', 'popupText(this.innerText);return false');
	}
}

function waitForSender() {
	// console.log('await reply');
	if (window.choice) {
		let conversation = document.querySelector('.conversation:not(.hidden)');
		let lines = conversation.querySelectorAll('.message');
		let l = Array.from(lines).indexOf(conversation.querySelector('.message.hide'));
		// update choice now on previous line with respect to nextMessage
		for (let choice of lines[l - 1].querySelectorAll('.container:not(:nth-child(' + window.choice + '))'))
			choice.classList.add('hidden');
		for (let choice of lines[l - 1].querySelectorAll('.container'))
			choice.removeAttribute('onclick');
		setTimeout(function () {
			// console.log('call next');
			conversation.querySelector('.footer')?.click();
		}, calculateWriteTime(lines[l + 1]?.innerText));
	}
	else
		setTimeout(waitForSender, 1000);
}

function toggleConversation(conversation) {
    if (!conversation) return;
	if (conversation.getAttribute('data-running') != null)
		disableRunMessages(conversation);
	else
		allowRunMessages(conversation);
}

function allowRunMessages(conversation) {
	// console.log('allow run messages');
	if (!conversation) return;
	// set status
	conversation.setAttribute('data-running', '');
	if (conversation.querySelector('.footer') != null)
		conversation.querySelector('.footer').click();
	// disable scroll capture
	conversation.setAttribute('onwheel', 'return false');
	conversation.setAttribute('onmousewheel', 'return false');
	conversation.setAttribute('ontouchstart', 'return false');
}

function disableRunMessages(conversation) {
	// console.log('disable run messages');
	if (!conversation) return;
	// remove status
	conversation.removeAttribute('data-running');
	// remove scroll capture
	conversation.removeAttribute('onwheel');
	conversation.removeAttribute('onmousewheel');
	conversation.removeAttribute('ontouchstart');
}

function togglePause(conversation) {
    if(!conversation)
        conversation = document.querySelector('.conversation:not(.hidden)');
    let footer = conversation.querySelector('.footer');
    if(conversation && conversation.getAttribute('data-paused') != null) {
        footer.style.opacity = 0;
        footer.style.height = '';
        conversation.removeAttribute('data-paused');
        footer.setAttribute('onclick', 'nextMessage()');
	    allowRunMessages(conversation);
    }
    else {
        footer.style.opacity = 1;
        footer.style.height = 'calc(100% - 50px)';
        conversation.setAttribute('data-paused', '');
        footer.setAttribute('onclick', 'togglePause()');
        disableRunMessages(conversation);
    }
}

//--DIALOG--//
function popupText(input) {
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv == null) {
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
	if (!dialog.classList.contains('box'))
		dialog.classList.add('box');
	if (typeof node == 'string')
		dialog.innerHTML = node;
	if (typeof node == 'object') {
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function () {
		if (event.target.parentElement == document.querySelector('.dialog'))
			removeDialog();
	});
	dialog.addEventListener('keyup', function () {
		if (event.key === 'Enter')
			this.remove();
	});
	return dialog;
}

function removeDialog() {
	if (event)
		event.preventDefault(); // Prevent the default form submission
	let dialogDiv = document.querySelector('.dialog');
	if (dialogDiv != null) {
		dialogDiv.remove();
	}
}

//--INITIAL--//
function startup() {
	readFromLocalStorage();
	hideAllConversations();
    initializeWindow();
}

function readFromLocalStorage() {
	window['conversation-messages'] = JSON.parse(localStorage.getItem('conversation-messages') || '{}');
	let keys = Object.keys(window['conversation-messages']);
	for (let i = 1; i <= keys.length; i++) { // to avoid sorting if deleted any conversation
		let key = 'text' + i;
		let item = window['conversation-messages'][key];
		if (item && item.name) {
			addConversation(item.name);
			let conversation = document.querySelector('#' + key);
			if (item.content) // editor content
				conversation.querySelector('.editor textarea').value = item.content;
			if (item.separator) { // separator input
				conversation.querySelector('.messages').setAttribute('data-separator', item.separator);
				conversation.querySelector('.editor .separator').value = item.separator;
			}
			if (item.sender) { // sender input
				conversation.querySelector('.messages').setAttribute('data-sender', item.sender);
				updateSenderOptions(conversation);
			}
            if(item.names) {
                conversation.querySelector('.messages').setAttribute('data-names', '');
                conversation.querySelector('.editor .names').checked = item.names;
			}
		}
	}
}

function hideAllConversations() {
	for (let conv of document.querySelectorAll('.conversation')) {
		conv.querySelector('.messages').removeAttribute('data-running');
		conv.classList.add('hidden');
		clearInterval(window['timer']);
	}
}

function initializeWindow() {
    // pause current conversation on blur
    window.addEventListener('blur', function() {
        let conversation = document.querySelector('.conversation:not(.hidden)');
        if(conversation && conversation.getAttribute('data-running') != null)
            togglePause(conversation);
    });
    // hide setting icons where specified in config, default show all in DOM
    for(let key of Object.keys(config.hide)) {
        let setting = document.querySelector('.settings .' + key);
        let value = config.hide[key];
        if(setting && value)
            setting.classList.add('hidden');
    }
}