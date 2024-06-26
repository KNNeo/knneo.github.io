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
let rateDiv = document.querySelector('.rate');

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
	currencyDiv.innerText = 'Bank: ' + asCurrencyUnits(window.game.bank);
	currencyDiv.title = asCurrencyNumber(window.game.bank);
}

function updateRate() {
	let rate = window.game.worlds.reduce(function(total, world, index) {
		return total + world.characters.reduce(function(t, c, i) { 
			return t + c.rate; 
		}, 0);
	}, 0);
	rateDiv.innerText = asCurrencyUnits(rate) + '/' + window.game.locale.display.seconds;
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
		stats.innerHTML = window.game.locale.display.level + window.item.level + (window.item.level >= window.item.maxLevel ? ' (MAX)' : ' | ' + (window.item.percent ?? 0) + '%') + '<br>' + asCurrencyUnits(window.item.rate) + '/' + window.game.locale.display.seconds;
		detailsDiv.appendChild(stats);
		
		if(window.item.level < window.item.maxLevel) {
			let progress = document.createElement('progress');
			progress.classList.add('progress');
			progress.setAttribute('min', 0);
			progress.setAttribute('max', 100);
			progress.setAttribute('value', window.item.percent ?? 0);
			detailsDiv.appendChild(progress);
			
			let action2 = document.createElement('div');
			action2.classList.add('action');
			if(window.item.level < 10 || window.item.percent > 99)
				action2.classList.add('hidden');
			action2.innerText = window.game.locale.action.maxBoost + ' - ' + asCurrencyUnits(calculateMaxBoost(worldId, seqId, window.item.level, window.item.percent, window.game.worlds[worldId].delta));
			action2.setAttribute('data-action', action2.innerText.split(' - ')[0]);
			action2.addEventListener('click', onAction);
			detailsDiv.appendChild(action2);
			
			let action1 = document.createElement('div');
			action1.classList.add('action');
			// if level 0 unlock, else if bar filled level up, else boost
			action1.innerText = window.game.locale.action.unlock + ' - ' + asCurrencyUnits(calculateUnlock(worldId, seqId));
			if(window.item.level > 0)
				action1.innerText = window.game.locale.action.boost + ' - ' + asCurrencyUnits(calculateBoost(worldId, seqId, window.item.level));
			if(window.item.percent > 99)
				action1.innerText = window.game.locale.action.level_up + ' - ' + asCurrencyUnits(calculateLevelUp(worldId, seqId, window.item.level));
			action1.setAttribute('data-action', action1.innerText.split(' - ')[0]);
			action1.addEventListener('click', onAction);
			if(window.game.worlds[worldId].unlockInOrder) {
				let previous = seqId - 1 > 0 ? window.game.worlds[worldId].characters[seqId-1] : null;
				console.log(previous);
				if(window.item.level > 0 || (window.item.level == 0 && (seqId == 0 || (previous && previous.level == previous.maxLevel))))
					detailsDiv.appendChild(action1);
			}
			if(!window.game.worlds[worldId].unlockInOrder) detailsDiv.appendChild(action1);
		}
		
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
		case window.game.locale.action.unlock: // unlock
			amt = calculateUnlock(worldId, seqId);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.level = 1;
				window.item.percent = 0;
				event.target.innerText = window.game.locale.action.boost + ' - ' + asCurrencyUnits(calculateBoost(worldId, seqId, window.item.level));
				if(window.item.level >= 10 || window.item.percent > 99)
					event.target.previousSibling.classList.remove('hidden');
				event.target.previousSibling.setAttribute('data-action', window.game.locale.action.maxBoost);
				event.target.previousSibling.innerText = window.game.locale.action.maxBoost + ' - ' + asCurrencyUnits(calculateMaxBoost(worldId, seqId, window.item.level, window.item.percent, window.game.worlds[worldId].delta));
			}
			else
			{
				popupContent(window.game.locale.display.no_money);
			}
			break;
		case window.game.locale.action.maxBoost: // boost to 100%
			amt = calculateMaxBoost(worldId, seqId, window.item.level, window.item.percent, window.game.worlds[worldId].delta);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.percent = 100;
				event.target.classList.add('hidden');
				event.target.innerText = window.game.locale.action.level_up + ' - ' + asCurrencyUnits(calculateLevelUp(worldId, seqId, window.item.level));
				event.target.nextSibling.setAttribute('data-action', event.target.innerText.split(' - ')[0]);
				event.target.nextSibling.innerText = window.game.locale.action.level_up + ' - ' + asCurrencyUnits(calculateLevelUp(worldId, seqId, window.item.level));
			}
			else
			{
				popupContent(window.game.locale.display.no_money);
			}
			break;
		case window.game.locale.action.boost: // boost
			amt = calculateBoost(worldId, seqId, window.item.level);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.percent += window.game.worlds[worldId].delta;
				event.target.previousSibling.innerText = window.game.locale.action.maxBoost + ' - ' + asCurrencyUnits(calculateMaxBoost(worldId, seqId, window.item.level, window.item.percent, window.game.worlds[worldId].delta));
				if(window.item.percent > 99) {
					event.target.innerText = window.game.locale.action.level_up + ' - ' + asCurrencyUnits(calculateLevelUp(worldId, seqId, window.item.level));
					event.target.previousSibling.classList.add('hidden');
				}
			}
			else
			{
				popupContent(window.game.locale.display.no_money);
			}
			break;
		case window.game.locale.action.level_up: // level up
			amt = calculateLevelUp(worldId, seqId, window.item.level);
			if(window.game.bank >= amt)
			{
				decrementCurrency(amt);
				window.item.level += 1;
				window.item.percent = 0;
				event.target.innerText = window.game.locale.action.boost + ' - ' + asCurrencyUnits(calculateBoost(worldId, seqId, window.item.level));
				if(window.item.level >= 10 || window.item.percent > 99)
					event.target.previousSibling.classList.remove('hidden');
				if(window.item.level >= window.item.maxLevel) {
					event.target.classList.add('hidden');
					event.target.previousSibling.classList.add('hidden');
					event.target.closest('.character').querySelector('.progress').classList.add('hidden');
				}
				event.target.previousSibling.setAttribute('data-action', window.game.locale.action.maxBoost);
				event.target.previousSibling.innerText = window.game.locale.action.maxBoost + ' - ' + asCurrencyUnits(calculateMaxBoost(worldId, seqId, window.item.level, window.item.percent, window.game.worlds[worldId].delta));
			}
			else
			{
				popupContent(window.game.locale.display.no_money);
			}
			break;
		default:
			break;
	}
	
	//update rate
	window.item.rate = calculateNewRate(worldId, seqId, window.item.level); // currently based on level
	updateRate();
	//update view
	event.target.setAttribute('data-action', event.target.innerText.split(' - ')[0]);
	event.target.closest('.character').setAttribute('data-level', window.item.level);
	event.target.closest('.character').querySelector('.progress').setAttribute('value', window.item.percent);
	event.target.closest('.character').querySelector('.stats').innerHTML = window.game.locale.display.level + window.item.level + (window.item.level >= window.item.maxLevel ? ' (MAX)' : ' | ' + (window.item.percent ?? 0) + '%') + '<br>' + asCurrencyUnits(window.item.rate) + '/' + window.game.locale.display.seconds;
	
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
		for(let i = 0; i < world.maxAsset; i++)	{
			if(!world.characters)
				world.characters = [createCharacter(list, i, world)];
			else if(i >= world.characters.length)
				world.characters.push(createCharacter(list, i, world));			
			if(world.characters[i])
				list.push(world.characters[i]);
		}		
		// console.log('list', list);
		
		let charasDiv = document.createElement('div');
		charasDiv.classList.add('characters');
		
		for(let listItem of list) {
			let charaDiv = document.createElement('div');
			charaDiv.classList.add('character');
			charaDiv.classList.add('card');
			charaDiv.setAttribute('data-world', index);
			charaDiv.setAttribute('data-level', listItem.level);
			charaDiv.setAttribute('data-seq', listItem.order);
			
				let charaImage = document.createElement('img');
				charaImage.classList.add('pic');
				charaImage.src = listItem.fileName;
				charaImage.title = listItem.shortName;
				charaImage.alt = listItem.name;
				charaImage.addEventListener('click', showDetails);
				charaDiv.appendChild(charaImage);
				
				charaDiv.appendChild(charaImage);
				
				let charaInfo = document.createElement('div');
				charaInfo.classList.add('info');

				let charaName = document.createElement('div');
				charaName.classList.add('name');
				charaName.innerText = listItem.shortName;
				charaName.title = listItem.name;
				charaInfo.appendChild(charaName);
			
				let charaFullName = document.createElement('div');
				charaFullName.classList.add('full-name');
				charaFullName.innerText = listItem.name;
				charaInfo.appendChild(charaFullName);
			
				charaDiv.appendChild(charaInfo);

			charasDiv.appendChild(charaDiv);
		}
		
		display.appendChild(charasDiv);
	});
}

function createCharacter(list, order, world) {
	let newId = -1;
	let randomize = window.game.items && (!world.items || world.items.length != world.maxAsset);
	do
	{
		if(randomize) // random by default
			newId = Math.floor(Math.random() * window.game.items.length);
		else // create by order
			newId = world.items.indexOf(world.items.filter(i => i.order-1 == order)[0]);
	} while(list.length > 0 && newId >= 0 && list.map(l => l.id).includes(newId));
	
	if(randomize)
		return {
			...window.game.items[newId],
			"id": newId,
			"order": order,
			"level": 0,
			"rate": 0,
		};
	else
		return {
			...world.items[newId],
			"id": newId,
			"order": order,
			"level": 0,
			"rate": 0,
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
			popupContent('<div>' + window.game.idle.display.offline + ' ' + asCustomDateTime(multiplier) + '<br>' + 
						window.game.idle.display.gain + ' ' + asCurrencyUnits(multiplier * increment) + '</div>'
		+ '<br><button class="bi" onclick="this.closest(\'dialog\').remove();">OK</button>');
	}
	
	updateRate();
	updateCurrency();
}

function resetGame() {
	if(confirm('Confirm to reset? Your progress will be lost!')) {
		localStorage.removeItem('idle-game');
		displaysDiv[0].remove();
		currencyDiv.remove();
		rateDiv.innerHTML = 'Refresh to start over';
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

function calculateMaxBoost(world, seqNo, level, progress, delta) {
	return calculateBoost(world, seqNo, level) * calculateDelta(progress ?? 0, delta);
}

function calculateDelta(progress, delta) {
	return (100 - progress) / delta;
}

function calculateLevelUp(world, seqNo, level) {
	return calculateBoost(world, seqNo, level) * 10;
}

function calculateNewRate(world, seqNo, level) {
	let newRate = 0;
	if(level >= 0) newRate += Math.min(50, 1*(level-0));
	if(level >= 50) newRate += Math.min(100, 2*(level-50));
	if(level >= 100) newRate += Math.min(150, 3*(level-100));
	if(level >= 150) newRate += Math.min(200, 4*(level-150));
	return newRate;
}

function asCustomDateTime(seconds) {
	let display = '';
	
	if(!window.game.idle || !window.game.idle.units) // if null
		return seconds + 's';
	if(seconds >= window.game.idle.max) // limit
		seconds = window.game.idle.max;
	if(Math.floor(seconds / 86400) > 0) // day
		display += Math.floor(seconds / 86400) + window.game.idle.units.day;
	if(seconds / 3600 < 24 && Math.floor(seconds / 3600) > 0) // hour
		display += Math.floor(seconds / 3600) + window.game.idle.units.hour;
	if((seconds % 3600 / 3600) < 1 && Math.floor(((seconds % 3600) / 3600) * 60) > 0) // minute
		display += Math.floor(((seconds % 3600) / 3600) * 60) + window.game.idle.units.minute;
	if(seconds < 60) // second
		display += seconds + window.game.idle.units.second;

	return display;
}

function asCurrencyUnits(number) {
	if(!number) number = 0;
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

function asCurrencyNumber(number) {
	let reduced = '';
	let length = number.toString().length;
	for(let n = 1; n <= length; n++)
	{
		reduced = number.toString()[length-n] + reduced;
		if(n % 3 == 0 && n > 0)
			reduced = ',' + reduced;
	}	
	return window.game.currency.prefix + reduced;
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
	let data = document.getElementById('data');
	if(localStorage.getItem('idle-game') != null) {
		console.log('read from local storage');
		load(JSON.parse(localStorage.getItem('idle-game')));
	}
	else if(data.src) {
		console.log('read from external json');
		getJson(data.src, load);
	}
	else if(data.textContent) {
		console.log('read from inline json');
		load(JSON.parse(data.textContent));
	}
}

function load(content) {
	window.game = content ?? '{}';
	// filter item pool by unique tag
	if(window.game.items)
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

function idle() {
	window.game.time = new Date();
	save();
}
