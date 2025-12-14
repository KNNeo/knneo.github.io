//--DEFAULT SETTINGS--//
const config = {
	auto: {
		fullscreen: true
	},
	storage: {
		messages: 'conversation-messages-v2',
	},
    hide: {
        code: true,
        clear: true
    },
	separator: {
		line: ':',
		choice: '|'
	},
	wrapper: {
		system: '===',
		section: '---'
	},
	debug: false
};
const emojiRegex = /(\p{Emoji}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\p{Extended_Pictographic})+/gv;

//--DOM NODE REFERENCES--//
const pageDiv = document.querySelector('.page');
const selectionDiv = document.querySelector('#selection');
const sfxAudio = document.querySelector('.sfx');
const settingsSection = document.querySelector('.settings .section');
const footerInput = document.querySelector('.footer .input');

//--DOM FUNCTIONS--//
function onKeyDown() {
}

//--EVENT HANDLERS--//
function selectConversation() {
	let conversations = Array.from(selectionDiv.querySelectorAll('div[data-id]'))
					.map(conv => '<button data-id="' + conv.getAttribute('data-id') + '" onclick="onSelectConversation()">' + conv.innerText + '</button>');
	popupText('<div class="sections">' + conversations.join('') + '</div>');
}

function onSelectConversation() {
	hideAllConversations();
	// if(pageDiv.getAttribute('data-fullscreen') != null)
	// 	toggleFullscreen();
	if (event.target.getAttribute('data-id')) {
		let id = event.target.getAttribute('data-id');
		let elem = document.querySelector('#' + id);
		if(elem) {
			elem.classList.remove('hidden');
			elem.firstElementChild.click();
			elem.querySelector('.messages').style.height = '';
		}
		selectionDiv.setAttribute('data-value', id);
		for(let conv of selectionDiv.querySelectorAll('div[data-id]')) {
			conv.classList.add('hidden');
			if(conv.getAttribute('data-id') == id)
				conv.classList.remove('hidden');
		}
		pageDiv.querySelector('.header span').innerText = selectionDiv.querySelector('[data-id="' + selectionDiv.getAttribute('data-value') + '"')?.innerText;
		event.target.blur();
	}
	removeDialog();
}

function showMessages() {
	let conversation = event.target.closest('.conversation');
	if (conversation.id) {
		if(!conversation.querySelector('.message') || conversation.querySelector('.editor:not(.hidden)')) {
			document.querySelector('#' + conversation.id + ' .messages').innerHTML = document.querySelector('#' + conversation.id + ' .editor textarea').value;
			processConversation(document.querySelector('#' + conversation.id + ' .messages'));
		}
		document.querySelector('#' + conversation.id + ' .messages').classList.remove('hidden');
		document.querySelector('#' + conversation.id + ' .messages .action')?.scrollIntoView();
	}
	if(settingsSection != null) {
		settingsSection.classList.remove('bi-file-earmark-break-fill');
		settingsSection.classList.add('bi-file-break');
	}
	for (let view of document.querySelectorAll('#' + conversation.id + ' .view:not(.messages)')) {
		view.classList.add('hidden');
	}
	disableRunMessages(conversation);
}

function showEditor() {
	let conversation = event.target.closest('.conversation');
	if (conversation.id) {
		document.querySelector('#' + conversation.id + ' .editor').classList.remove('hidden');
		updateSenderOptions(conversation);
		let sender = conversation.querySelector('.messages').getAttribute('data-sender');
		if (sender != null)
			conversation.querySelector('.sender option[value=' + sender + ']').selected = sender;
	}
	for (let view of document.querySelectorAll('#' + conversation.id + ' .view:not(.editor)')) {
		view.classList.add('hidden');
	}
	disableRunMessages(conversation);
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

function saveToLocalStorage() {
	localStorage.setItem(config.storage.messages, JSON.stringify(window['conversation-messages'] || ''));
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
	selection.innerHTML = '<option value="">======</option>';
	let senders = lines.reduce(function (total, line) {
		let isUrl = line.startsWith('https://') || line.startsWith('http://');
		let name = isUrl ? '' : line.trim().substring(0, line.indexOf(separator)).trim();
		if (name && !total.includes(name))
			total.push(name);
		return total;
	}, []);
	conversation.querySelector('.messages').setAttribute('data-senders', senders.join(','));
	if(!senders.length)
		alert('no senders found! are you using a different separator?');

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
	let newOpt = document.createElement('div');
	if (!name || !typeof (name) == 'string')
		name = prompt('Key in name:');
	if (name) {
		newOpt.innerText = name;
		let newId = 'text' + selectionDiv.childElementCount;
		newOpt.classList.add('hidden');
		newOpt.setAttribute('data-id', newId);
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
	let newName = prompt('Key in new name:', window['conversation-messages'][selectionDiv.getAttribute('data-value')].name);
	if (newName != null) {
		window['conversation-messages'][selectionDiv.getAttribute('data-value')].name = newName;
		saveToLocalStorage();
		window.location.reload();
	}
}

function deleteConversation() {
	if(confirm('Confirm delete current conversation? This action cannot be reversed.')) {
		// empty current item
		delete window['conversation-messages'][selectionDiv.getAttribute('data-value')];
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
		reaction.setAttribute('onclick', 'toggleReactions()');
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
		message.appendChild(reactions);
	}
}

function clearReactions() {
	// clear those that have not been set ie. more than 1 child
	for(let message of document.querySelectorAll('.message:has(.reactions .reaction:nth-child(2))')) {
		if(message == event.target.closest('.message')) continue;
		message.querySelector('.reactions').remove();
		message.removeAttribute('data-selected');
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
	popupText('<textarea id="data" name="data" rows="8" cols="40" style="max-width: 90%;">' + (localStorage.getItem(config.storage.messages) || '') + '</textarea>' +
		'<div><a class="add bi bi-copy" href="javascript:void(0);" title="Copy Data" onclick="navigator.clipboard.writeText(document.querySelector(\'#data\').value);"></a>' +
		'<a class="add bi bi-x-square" href="javascript:void(0);" title="Save/Close Data" onclick="updateData()"></a></div>');
}

function updateData() {
	if (localStorage.getItem(config.storage.messages) != document.querySelector('#data').value) // update if different
	{
		if (document.querySelector('#data').value.length < 1) // set empty
			document.querySelector('#data').value = '{}';
		localStorage.setItem(config.storage.messages, document.querySelector('#data').value);
		startup();
	}
	removeDialog();
}

function toggleFullscreen() {
	if(pageDiv.querySelector('.editor:not(.hidden)'))
		return console.error('unable to fullscreen, still in editor');
    if(pageDiv.getAttribute('data-fullscreen') == null) {
        pageDiv.setAttribute('data-fullscreen', '');
		pageDiv.querySelector('.header span').innerText = selectionDiv.querySelector('[data-id="' + selectionDiv.getAttribute('data-value') + '"')?.innerText;
		if(event?.type != 'click') {
			try {
				let doc = document.documentElement;
				if (doc.requestFullscreen)
					doc.requestFullscreen();
				else if (doc.mozRequestFullScreen) // Firefox 
					doc.mozRequestFullScreen();
				else if (doc.webkitRequestFullscreen) // Chrome, Safari, Opera
					doc.webkitRequestFullscreen();
				else if (doc.msRequestFullscreen) // IE,Edge
					doc.msRequestFullscreen();
			}
			catch(e) {
				// Expected: programatic call of fullscreen API not allowed
				console.error(e);
			}
		}
		else
			event.preventDefault();
	}
    else {
        pageDiv.removeAttribute('data-fullscreen');
        if(document.querySelector('.conversation:not(.hidden)'))
            document.querySelector('.conversation:not(.hidden) .messages').style.height = '';
		if (document.exitFullscreen)
			document.exitFullscreen();
		else if (document.mozCancelFullScreen) // Firefox
			document.mozCancelFullScreen();
		else if (document.webkitExitFullscreen) // Chrome, Safari, Opera
			document.webkitExitFullscreen();
		else if (document.msExitFullscreen) // IE, Edge
			document.msExitFullscreen();
    }
    // update icon
    if(document.querySelector('.fullscreen')) {
        document.querySelector('.fullscreen').classList.toggle('bi-phone');
        document.querySelector('.fullscreen').classList.toggle('bi-circle');
    }
}

function selectSection() {
	if(!pageDiv.querySelector('.conversation:not(.hidden)'))
		return console.error('unable to select section, no conversation selected');
	if(settingsSection.classList.contains('bi-file-break')) {
		// show sections
		if(pageDiv.querySelector('.editor:not(.hidden)'))
			return console.error('unable to select section, still in editor');
		let conversation = pageDiv.querySelector('.conversation:not(.hidden)');
		if(!conversation.querySelector('.message[data-section]'))
			return alert('no sections detected, add in editor');
		let sections = Array.from(conversation.querySelectorAll('.message[data-section]'))
						.map(section => '<button onclick="onSelectSection()">' + section.getAttribute('data-section') + '</button>');
		popupText('<div class="sections">' + sections.join('') + '</div>');
	}
	if(settingsSection.classList.contains('bi-file-earmark-break-fill')) {
		footerInput.innerText = '';
		// reset sections
		let conversation = pageDiv.querySelector('.conversation:not(.hidden)');
		conversation.querySelector('.messages').innerHTML = conversation.querySelector('.editor textarea').value;
		conversation.querySelector('a').click();
	}
}

function onSelectSection() {
	settingsSection.classList.remove('bi-file-break');
	settingsSection.classList.add('bi-file-earmark-break-fill');
	let sectionName = event.target.innerText;
	footerInput.innerText = sectionName || '';
	// stop current running conversation
	let conversation = pageDiv.querySelector('.conversation:not(.hidden)');
	disableRunMessages(conversation);
	// find out which lines are in section
	let lines = conversation.querySelectorAll('.messages .message');
	let sectionLine = Array.from(lines).indexOf(conversation.querySelector('.messages .message[data-section="' + sectionName + '"]')); // assume section names unique
	// console.log(sectionLine);
	// mark and remove lines not in range
	for(l = 0; l < sectionLine; l++) {
		let line = lines[l];
		if(line)
			line.setAttribute('data-range', '');
	}
	for(let line of conversation.querySelectorAll('.messages .message[data-range]'))
		line.remove();
	// find out which lines are in next section onwards (if not last)
	lines = conversation.querySelectorAll('.messages .message');
	sectionName = Array.from(lines).indexOf(conversation.querySelector('.messages .message:not([data-section]) + .message[data-section]')); // assume section names unique
	// console.log(sectionName);
	if(sectionName < 0)
		sectionName = lines.length - 1;
	// mark and remove lines not in range
	for(l = sectionName; l < lines.length - 1; l++) {
		let line = lines[l];
		if(line)
			line.setAttribute('data-range', '');
	}
	for(let line of conversation.querySelectorAll('.messages .message[data-range]'))
		line.remove();
	removeDialog();
}

//--FUNCTIONS--//
function processConversations() {
	for (let messages of document.querySelectorAll('.conversation .messages'))
		processConversation(messages);
}

function processConversation(conversation) {
	let lineSeparator = conversation.getAttribute('data-separator') || config.separator.line;
	let lines = conversation.innerHTML.split('\n');
	if (lines.length < 2) {
		conversation.innerHTML = 'Click on Editor to create a conversation list';
		return;
	} else
		conversation.innerHTML = '';
	// render lines
	let prevName = '';
	let sectionName = '';
	for (let line of lines) {
		// render message container
		let lineDiv = document.createElement('div');
		lineDiv.classList.add('message');
		// find start of section, skip and put on next message
		if(line.startsWith(config.wrapper.section) && line.endsWith(config.wrapper.section)) {
			sectionName = line.replace(new RegExp(config.wrapper.section, 'g'),'').trim();
			continue;
		}
		if(sectionName) {
			lineDiv.setAttribute('data-section', sectionName);
			sectionName = '';
			prevName = '';
		}
		conversation.appendChild(lineDiv);
		// render messages
		let isSystem = line.startsWith(config.wrapper.system) && line.endsWith(config.wrapper.system);
		for (let message of line.trim().substring(line.indexOf(lineSeparator) + 1).trim().split(config.separator.choice)) {
			let isUrl = message.startsWith('https://') || line.startsWith('http://');
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
            	lineDiv.setAttribute('aria-label', senderDefined ? line.trim().substring(0, line.indexOf(lineSeparator)).trim() : prevName);
			if (senderDefined)
				lineDiv.setAttribute('data-first', '');
			prevName = lineDiv.getAttribute('aria-label');
			// check sender type
			if (conversation.getAttribute('data-sender') != null) {
				if (isSystem)
					lineDiv.setAttribute('data-system', '');
				else {
					if (isUrl)
						lineDiv.setAttribute('data-url', '');
					if (conversation.getAttribute('data-sender').toLowerCase() == lineDiv.getAttribute('aria-label').toLowerCase())
						lineDiv.setAttribute('data-sender', '');
					else {
						lineDiv.setAttribute('data-recipient', '');
						lineDiv.setAttribute('onclick', 'toggleReactions()');
					}
				}
			}
			// extract text after sender name identified
			if (isSystem) // system message
				messageText.innerText = line.replace(new RegExp(config.wrapper.system, 'g'),'').trim();
			else if(message.includes('@') || message.includes('\uff20')) { // detect ampersand （ascii, unicode)
				// check for all senders
				let senders = conversation.getAttribute('data-senders')?.split(',') ?? [];
				senders.forEach(sender => {
					message = message.replace('@' + sender, '@' + sender + ' ')
									.replace('\uff20' + sender, '\uff20' + sender + ' ');
				});
				for(let ref of message.split(' ')) {
					let isRef = ref.startsWith('@') || ref.startsWith('\uff20');
					let section = document.createElement('span');
					if(isRef) section.classList.add('sender-ref');
					section.innerText = (ref == message.split(' ')[0] ? '' : ' ') + ref;
					messageText.appendChild(section);
				}
			}
			else if (isUrl) {
				let url = document.createElement('a');
				url.setAttribute('target', '_blank');
				url.href = message;
				url.innerText = message;
				messageText.appendChild(url);
			}
			else
				messageText.innerText = message;
			messageDiv.appendChild(messageText);
			if (isUrl) {
				messageDiv.innerHTML = '';
				// change to link tag
				let messageLink = document.createElement('a');
				messageLink.href = message.trim();
				messageLink.innerText = message.trim();
				messageDiv.appendChild(messageLink);
				// try render image
				let messageImg = document.createElement('img');
				messageImg.src = message.trim();
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
	footer.className = 'action message';
	footer.innerText = '🔁';
	footer.title = 'Replay Conversation';
	footer.setAttribute('onclick', 'startConversation()');
	conversation.appendChild(footer);
}

function startConversation() {
	let conversation = event.target.closest('.conversation');
	let messages = conversation.querySelector('.messages');
	// hide all lines from last section, if any
	let lines = Array.from(messages.querySelectorAll('.message'));
	if (lines.filter(l => l.classList.contains('hide')).length > 0)
		return; // should not start if still have lines hidden, means is running
	let sections = messages.querySelectorAll('.message[data-section]');
	let lastSectionIndex = sections.length > 0 ? lines.indexOf(sections[sections.length - 1]) : 0;
	for (let line of lines.slice(lastSectionIndex))
		line.classList.add('hide');
	// show all choices
	for(let choice of messages.querySelectorAll('.container.hidden'))
		choice.classList.remove('hidden');
	// clear all reactions
	for(let reactions of messages.querySelectorAll('.reactions'))
		reactions.remove();
	// create manual next message trigger
	let footer = messages.querySelector('.action');
	footer.innerText = '🔽';
	footer.title = 'Play Next Message';
	footer.setAttribute('onclick', 'nextMessage()');
	// start run
    allowRunMessages(conversation);
}

function nextMessage() {
	let conversation = document.querySelector('.conversation:not(.hidden)');
	// check if running status
	if (conversation.getAttribute('data-running') != null && conversation.getAttribute('data-paused') != null)
		return;
	let messages = conversation.querySelector('.messages');
	let lines = messages.querySelectorAll('.message');
	// read lines
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
				setTimeout(waitForSender, 200);
			}
		}
		// choice made, hide other messages on line and continue
		if (window.choice) {
			for(let choice of lines[l].querySelectorAll('.container'))
				choice.classList.remove('hidden');
			for (let choice of lines[l].querySelectorAll('.container:not(:nth-child(' + window.choice + '))'))
				choice.classList.add('hidden');
		}
	} else {
		// reset choice if no alternate choices found
		window.choice = 0;
	}
	// not recipient, show message directly
	if (l == 0 || 
		lines[l].getAttribute('data-section') != null || 
		lines[l].getAttribute('data-loaded') != null || 
		lines[l].getAttribute('data-recipient') == null || 
		lines[l].getAttribute('data-first') == null) {
		if(config.debug) console.log('show message ' + (1+l));
        // play sound effect on each message
        if (window.ping && !lines[l].classList.contains('action') && lines[l].getAttribute('data-system') == null)
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
		if(lines[l].getAttribute('data-section') != null)
			// scroll to beginning of section at bottom
			conversation.querySelector('.messages').scrollTo({
				top: diff
			});
		else if (diff > 0) {
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
				if(config.debug) console.log('show loader');
				conversation.querySelector('.action')?.click();
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
				if(config.debug) console.log('hide loader');
				conversation.querySelector('.action')?.click();
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
				if(config.debug) console.log('create loader');
				conversation.querySelector('.action')?.click();
			}, window['next']);
			return;
		}
	}
	// if end of conversation, allow replay
	if (l >= lines.length - 1) {
		let footer = conversation.querySelector('.action');
		footer.className = 'action message';
		footer.innerText = '🔁';
		footer.title = 'Replay Conversation';
		footer.setAttribute('onclick', 'startConversation()');
		disableRunMessages(conversation);
		return;
	}
	// avoid run if prompt to choose
	if (lines[l].querySelectorAll('.container').length > 1 && !window.choice)
		return;
	// if still running, call next message (after loader)
	if (conversation.getAttribute('data-running') != null && conversation.getAttribute('data-paused') == null) {
        let writeTime = calculateWriteTime(lines[l + 1]?.innerText) + (lines[l + 1].getAttribute('data-sender') == null ? 0 : 1000);
		setTimeout(function () {
			if(conversation.getAttribute('data-running') != null && conversation.getAttribute('data-paused') == null)
				conversation.querySelector('.action')?.click();
		}, writeTime);
	}
}

function calculateWriteTime(text) {
    // calculate next message pop time
    let writeLength = text && text.length || 1;
    let writeTime = 1500;
    let isEmoji = text.trim().match(emojiRegex);
    if(isEmoji && writeLength < 5)
        return writeTime;
	if(text.startsWith('http://') || text.startsWith('https://'))
        return writeTime;
    if(writeLength > 12)
        return writeLength / 6 * writeTime;
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
	if(config.debug) console.log('await reply');
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
			if(config.debug) console.log('reply selected, call next');
			allowRunMessages(conversation);
		}, calculateWriteTime(lines[l + 1]?.innerText));
	}
	else
		setTimeout(waitForSender, 1000);
}

function allowRunMessages(conversation) {
	if(config.debug) console.log('allow run messages');
	if (!conversation) return;
	// set status
	conversation.setAttribute('data-running', '');
	if (conversation.querySelector('.action') != null)
		conversation.querySelector('.action').click();
	// disable scroll capture
	conversation.setAttribute('onwheel', 'return false');
	conversation.setAttribute('onmousewheel', 'return false');
	conversation.setAttribute('ontouchstart', 'return false');
}

function disableRunMessages(conversation) {
	if(config.debug) console.log('disable run messages');
	if (!conversation) return;
	// remove status
	conversation.removeAttribute('data-running');
	// remove scroll capture
	conversation.removeAttribute('onwheel');
	conversation.removeAttribute('onmousewheel');
	conversation.removeAttribute('ontouchstart');
}

function pauseConversation(conversation) {
	if(config.debug) console.log('pause');
    if(!conversation)
        conversation = document.querySelector('.conversation:not(.hidden)');
	if(conversation.getAttribute('data-running') == null || conversation.getAttribute('data-paused') != null)
		return;
    let footer = conversation.querySelector('.action');
	footer.style.opacity = 1;
	conversation.setAttribute('data-paused', '');
	footer.setAttribute('onclick', 'resumeConversation()');
	disableRunMessages(conversation);
}

function resumeConversation(conversation) {
	if(config.debug) console.log('resume');
    if(!conversation)
        conversation = document.querySelector('.conversation:not(.hidden)');
	if(conversation.getAttribute('data-paused') == null)
		return;
    let footer = conversation.querySelector('.action');
	footer.style.opacity = '';
	conversation.removeAttribute('data-paused');
	footer.setAttribute('onclick', 'nextMessage()');
	allowRunMessages(conversation);
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
	let initial = document.querySelector('.conversation[id]');
	initial.classList.remove('hidden');
	initial.firstElementChild.click();
	initial.querySelector('.messages').style.height = '';
}

function readFromLocalStorage() {
	window['conversation-messages'] = JSON.parse(localStorage.getItem(config.storage.messages) || '{}') || {};
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
	window.addEventListener('click', clearReactions);
    window.addEventListener('blur', function() {
        let conversation = document.querySelector('.conversation:not(.hidden)');
        if(conversation && conversation.getAttribute('data-running') != null)
            pauseConversation(conversation);
    });
    // hide setting icons where specified in config, default show all in DOM
    for(let key of Object.keys(config.hide)) {
        let setting = document.querySelector('.settings .' + key);
        let value = config.hide[key];
        if(setting && value)
            setting.classList.add('hidden');
    }
	// auto fullscreen, will not work with fullscreen API but does not break logic
	if(config.auto.fullscreen)
		toggleFullscreen();
}