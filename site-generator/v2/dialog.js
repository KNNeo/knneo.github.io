//--ABBR OVERRIDE--//
function showAbbrAsDialog() {
	// Exception: published field in github site
	for (let abbr of document.querySelectorAll('abbr[title]')) {
		abbr.tabIndex = 0;
		abbr.setAttribute('onkeyup', 'popupText()');
		abbr.setAttribute('onclick', 'popupText()');
	}
}

function popupText() {
	event.preventDefault();
	if (!event.key || event.key == 'Enter') {
		let content = event.target.closest('[title]');
		if (content)
			popupContent(content.title);
	}
}

function popupContent(input, classNames) {
	if (!input) {
		alert('No content found');
		return;
	}
	// create dialog component if missing
	let dialog = document.querySelector('.dialog');
	if (!dialog) {
		dialog = document.createElement('dialog');
		dialog.tabIndex = 0;
		dialog.addEventListener('click', function () {
			if (event.target == document.querySelector('dialog'))
				removeDialog();
		});
		dialog.addEventListener('keyup', function () {
			// if not triggered by exit or navigation keys
			if (event.key != 'Space' || event.key != 'Enter' || event.key != 'Escape') return;
			// if not wrapped by content ie. use innerHTML
			if (event.target.closest('.content')) return;
			event.preventDefault();
			removeDialog();
		});
		dialog.addEventListener('close', removeDialog);
		document.body.appendChild(dialog);
	}
	dialog.className = 'dialog ';
	if (classNames) {
		// reset classes if any
		if (typeof classNames == 'array')
			for (let name of classNames)
				dialog.classList.add(name);
		if (typeof classNames == 'string')
			dialog.className += classNames;
	}
	let dialogDiv = createDialog(input);
	dialog.innerHTML = '';
	dialog.appendChild(dialogDiv);
	dialog.showModal();
	setTimeout(function () {
		document.querySelector('.dialog').classList.add('open');
		document.querySelector('.dialog').focus();
	}, 0);
}

function popupNotice(title, icon, content, actions) {
	let box = document.createElement('div');
	// header: icon with title
	let header = document.createElement('div');
	header.classList.add('dialog-header');
	if (icon) header.setAttribute('data-name', icon);
	if (title) header.innerText = title;
	box.appendChild(header);
	// actual content, support HTMLNode only for now
	if (content) box.appendChild(content);
	// actions: each object with title and click properties
	let footer = document.createElement('div');
	footer.classList.add('dialog-action');
	if (!actions) actions = [];
	for (let action of actions) {
		let act = document.createElement('button');
		act.classList.add('box');
		act.innerText = action.title;
		act.setAttribute('onclick', action.click);
		footer.appendChild(act);
	}
	box.appendChild(footer);
	popupContent(box);
}

function popupTemplate(selector) {
	let template = document.querySelector(selector);
	let clone = document.importNode(template.content, true);
	if (typeof popupContent == 'function')
		popupContent(clone);
}

function createDialog(node) {
	// Helper function to create dialog with content
	// Note: Node in dialog will not have events! Manual add back or write as attribute!
	let box = document.createElement('div');
	if (typeof node == 'string') {
		box.classList.add('box');
		box.innerHTML = node;
	}
	if (typeof node == 'object') {
		box.classList.add('content');
		let clonedNode = node.cloneNode(true);
		box.appendChild(clonedNode);
	}
	return box;
}

function removeDialog() {
	document.querySelector('.dialog')?.classList.remove('open');
	setTimeout(function () {
		document.querySelector('.dialog')?.close();
	}, 250);
}
