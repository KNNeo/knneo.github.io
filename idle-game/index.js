//--HELPERS--//

//--CONSTANTS--//
// see data file, under data folder
const isFirefox = (/Firefox/i.test(navigator.userAgent));

//--DOM NODE REFERENCES--//
let detailsDiv = document.querySelector('.details');
let settingsDiv = document.querySelector('.settings');
let progressDiv = document.querySelector('.progress');
let displaysDiv = document.querySelectorAll('.display');
let currencyDiv = document.querySelector('.currency');

//--DOM FUNCTIONS--//
function decrementCurrency(decrement) {
	window.game.bank = (window.game.bank ?? 0) - decrement;
	updateCurrency();
	save();
}

function incrementCurrency(multiplier) {
	let increment = window.game.worlds.reduce(function(total, world, index) {
		return total + world.characters.reduce(function(t, c, i) { 
			return t + c.rate; 
		}, 0);
	}, 0);
	window.game.bank = (window.game.bank ?? 0) + ((multiplier ?? 1) * increment);
	updateCurrency();
	save();
	return increment;
}

function updateCurrency() {
	currencyDiv.innerText = 'Bank: ' + asCurrency(window.game.bank ?? 0);
}

//--EVENT HANDLERS--//
function showDetails() {
	let info = event.target.closest('.character');
	if(info.querySelector('.details') != null) {
		info.classList.remove('expanded');
		info.querySelector('.details').remove();
		return;
	}
	else {
		info.classList.add('expanded');
		
		// zero-based ids
		let worldId = parseInt(event.target.closest('.character').getAttribute('data-world'));
		let seqId = parseInt(event.target.closest('.character').getAttribute('data-seq'));
		window.item = window.game.worlds[worldId].characters[seqId];
		
		let detailsDiv = document.createElement('div');
		detailsDiv.classList.add('details');

		let stats = document.createElement('div');
		stats.classList.add('stats');
		stats.innerHTML = 'Level ' + window.item.level + ' | ' + (window.item.percent ?? 0) + '%<br>' + asCurrency(window.item.rate) + '/s';
		detailsDiv.appendChild(stats);
		
		let progress = document.createElement('progress');
		progress.classList.add('progress');
		progress.setAttribute('min', 0);
		progress.setAttribute('max', 100);
		progress.setAttribute('value', window.item.percent ?? 0);
		detailsDiv.appendChild(progress);
		
		let action = document.createElement('div');
		action.classList.add('action');
		// if level 0 unlock, else if bar filled level up, else boost
		action.innerText = window.game.action.unlock + ' - ' + asCurrency(calculateUnlock(worldId, seqId));
		if(window.item.level > 0)
			action.innerText = window.game.action.boost + ' - ' + asCurrency(calculateBoost(worldId, seqId, window.item.level));
		if(window.item.percent > 99)
			action.innerText = window.game.action.up;
		action.setAttribute('data-action', action.innerText.split(' - ')[0]);
		action.addEventListener('click', onAction);
		detailsDiv.appendChild(action);
		
		info.querySelector('.info').appendChild(detailsDiv);
	}
}

function onAction() {
	let worldId = parseInt(event.target.closest('.character').getAttribute('data-world'));
	let seqId = parseInt(event.target.closest('.character').getAttribute('data-seq'));
	window.item = window.game.worlds[worldId].characters[seqId];
	let amt = 0;
	
	//update logic
	switch(event.target.getAttribute('data-action'))
	{
		case window.game.action.unlock: // unlock
			amt = calculateUnlock(worldId, seqId);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.level = 1;
				window.item.percent = 0;
				event.target.innerText = window.game.action.boost + ' - ' + window.game.currency.prefix + calculateBoost(worldId, seqId, window.item.level);
			}
			else
			{
				popupContent('Not enough money!');
			}
			break;
		case window.game.action.boost: // boost
			amt = calculateBoost(worldId, seqId, window.item.level);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.percent += calculateDelta();
				if(window.item.percent > 99)
					event.target.innerText = window.game.action.up;
			}
			else
			{
				popupContent('Not enough money!');
			}
			break;
		case window.game.action.up: // level up
			window.item.level += 1;
			window.item.percent = 0;
			event.target.innerText = window.game.action.boost + ' - ' + asCurrency(calculateBoost(worldId, seqId, window.item.level));
			break;
		default:
			break;
	}
	
	window.item.rate = window.item.level; // should be calculation based
	//update view
	event.target.setAttribute('data-action', event.target.innerText.split(' - ')[0]);
	event.target.closest('.character').setAttribute('data-level', window.item.level);
	event.target.closest('.character').querySelector('.progress').setAttribute('value', window.item.percent);
	event.target.closest('.character').querySelector('.stats').innerHTML = 'Level ' + window.item.level + ' | ' + (window.item.percent ?? 0) + '%<br>' + asCurrency(window.item.rate) + '/s';
	
	// update game
	save();	
}

//--FUNCTIONS--//
function showDisplay(id) {
	// hide all components besides first
	for(let display of displaysDiv)
	{
		display.classList.add('hidden');
	}
	
	displaysDiv[id].classList.remove('hidden');
}

function renderDisplay() {
	showDisplay(0);	
	renderWorld();	
	save();
}

function renderWorld() {
	// each display is one world
	// any world defined more than config, show as not met requirement to unlock
	if(!window.game.worlds) {
		console.error('worlds not found: add in config');
		return;
	}
	
	window.game.worlds.forEach((world, index) => {
		let display = displaysDiv[index];
		if(display == null) {
			console.error('world display not found: add to html');
			return;
		}
		
		let title = document.createElement('h1');
		title.innerText = world.name;
		display.appendChild(title);
		
		let list = [];
		for(let i = 0; i < world.maxAsset; i++)
		{
			if(!world.characters)
				world.characters = [createCharacter(list, i)];
			else if(i >= world.characters.length)
				world.characters.push(createCharacter(list, i));
			
			if(world.characters[i])
				list.push(world.characters[i]);
		}
		
		// console.log('list', list);
		
		let charasDiv = document.createElement('div');
		charasDiv.classList.add('characters');
			
		for(let listItem of list)
		{
			let charaDiv = document.createElement('div');
			charaDiv.classList.add('character');
			charaDiv.classList.add('card');
			charaDiv.setAttribute('data-world', index);
			charaDiv.setAttribute('data-level', listItem.level);
			charaDiv.setAttribute('data-seq', listItem.order);
			
				let charaImage = document.createElement('img');
				charaImage.classList.add('pic');
				charaImage.title = listItem.description;
				charaImage.src = listItem.filename;
				charaImage.addEventListener('click', showDetails);
				charaDiv.appendChild(charaImage);
				
				charaDiv.appendChild(charaImage);
				
				let charaInfo = document.createElement('div');
				charaInfo.classList.add('info');
				
				let charaName = document.createElement('div');
				charaName.classList.add('name');
				charaName.innerText = listItem.tags;
				charaInfo.appendChild(charaName);
			
				charaDiv.appendChild(charaInfo);

			charasDiv.appendChild(charaDiv);
		}
		
		display.appendChild(charasDiv);
	});
}

function createCharacter(list, order) {
	let newId = -1;
	do
	{
		newId = Math.floor(Math.random() * window.game.items.length);
	} while(list.length > 0 && newId >= 0 && list.map(l => l.id).includes(newId));
	
	return {
		...window.game.items[newId],
		"id": newId,
		"order": order,
		"level": 0,
		"rate": 0, // currency per second
	};
}

function renderGame() {
	// game logic here
	// start timer for increment
	window.timer = setInterval(incrementCurrency, 1000);
	
	// calculate idle time in seconds
	let multiplier = Math.floor((new Date() - new Date(window.game.time)) / 1000);
	if(multiplier >= 1) {
		let increment = incrementCurrency(multiplier);
		if(multiplier && increment)
			popupContent('<div>You have been out for ' + multiplier + 's<br>Gain: ' + asCurrency(multiplier * increment) + '</div>'
		+ '<br><button class="bi" onclick="this.closest(\'dialog\').remove();">OK</button>');
	}
	
	updateCurrency();
}

function resetGame() {
	if(confirm('Confirm to reset? Your progress will be lost!')) {
		localStorage.removeItem('idle-game');
		displaysDiv[0].innerHTML = '';
		currencyDiv.innerHTML = 'Refresh to start over';
		window.game = null;
		clearInterval(window.timer);
	}
}

function calculateUnlock(world, seqNo) {
	return (world) + (seqNo >= 1 ? 1000 * Math.pow(10, seqNo) : 0); // first in world unlock always free
}

function calculateBoost(world, seqNo, level) {
	return seqNo >= 1 ? calculateUnlock(world, seqNo) / 10 * level : 10 * level;
}

function calculateDelta(world, seqNo, level, progress) {
	return 10;
}

function calculateLevelUp(world, seqNo, level) {
	return 0;
}

function asCurrency(number) {
	let shift = 0;
	let suffix = '';
	while (!suffix && shift <= number.toString().length - 1) // if suffix empty, find previous in config array
	{
		suffix = window.game.currency.suffix[number.toString().length - ++shift] ?? '';
	}
	
	// if valid prefix, reduce number
	let reduced = (number / Math.pow(10, number.toString().length - shift)) ?? number;
	
	return window.game.currency.prefix + parseInt(reduced) + suffix;
}

function save() {
	//save
	localStorage.setItem('idle-game', JSON.stringify(window.game));
}

////DIALOG////
function popupContent(input) {
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
	{
		let containerDiv = document.createElement('div');
		containerDiv.innerHTML = node;
		dialog.appendChild(containerDiv);
	}
	if(typeof node == 'object')
	{
		let clonedNode = node.cloneNode(true);
		dialog.appendChild(clonedNode);
	}
	dialog.addEventListener('click', function() {
		if(event.target == event.target.closest('dialog'))
			this.remove();
	});
	dialog.addEventListener('keyup', function() {
		if (event.key === ' ' || event.key === 'Enter')
			this.remove();
	});
	return dialog;
}

//--INITIAL--//
function startup() {
	getJson(
		document.getElementById('data-id').src,
		function(content) {
			if(content) {
				window.game = JSON.parse(localStorage.getItem('idle-game')) ?? content;
				// filter by unique tag
				window.game.items = window.game.items
					.reduce(function(total, current, index, arr) {
						if(!total.map(m => m['tags']).includes(current['tags']))
							total.push(current);
						return total;
					}, []);
				
				// DOM level properties
				document.title = window.game.title;
				renderDisplay();
				renderGame();
			}
		}
	);
}

function idle() {
	window.game.time = new Date();
	save();
}
