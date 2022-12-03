window.addEventListener('load', startup);

const list = [
{ key: "A", score: 0 },
{ key: "B", score: 0 },
{ key: "C", score: 0 },
{ key: "D", score: 0 },
{ key: "E", score: 0 },
{ key: "F", score: 0 },
{ key: "G", score: 0 },
];

const pairs = [];

function startup() {
	renderPage();
	if(checkKeys())
	{
		setOptions();
	}
	else
		console.error('non unique keys');
}

function checkKeys() {
	for(let item of list)
	{
		let same = list.filter(i => i.key == item.key);
		if(same.length > 1)
			return false;
	}
	return true;
}

function renderPage() {
	let content = document.querySelector('.content');
	
	//title
	let title = document.createElement('h2');
	title.style.textAlign = 'center';
	title.innerText = 'Ranking';
	content.appendChild(title);
	
	//description
	let description = document.createElement('h6');
	description.style.textAlign = 'center';
	description.innerText = 'Click on an option to start';
	content.appendChild(description);
	
	//buttons
	let buttons = document.createElement('div');
	buttons.style.display = 'flex';
	buttons.style.justifyContent = 'center';
	
		let choice1 = document.createElement('button');
		choice1.classList.add('choice');
		choice1.classList.add('left');
		choice1.style.width = '33%';
		choice1.addEventListener('click', function() {
			let option = list.filter(l => l.key == this.innerText)[0];
			option.score += 1;
			setOptions();
		});
		
		buttons.appendChild(choice1);
	
	
		let choice2 = document.createElement('button');
		choice2.classList.add('choice');
		choice2.style.width = '33%';
		choice2.innerText = 'Draw';
		choice2.addEventListener('click', function() {
					
		});
		
		buttons.appendChild(choice2);
	
		let choice3 = document.createElement('button');
		choice3.classList.add('choice');
		choice3.classList.add('right');
		choice3.style.width = '33%';
		choice3.addEventListener('click', function() {
			let option = list.filter(l => l.key == this.innerText)[0];
			option.score += 1;
			setOptions();
		});
		
		buttons.appendChild(choice3);
		
	content.appendChild(buttons);
	
	//results
	let results = document.createElement('div');
	results.classList.add('results');
	results.style.textAlign = 'center';
	results.style.padding = '30px';
	content.appendChild(results);
}

function setOptions() {
	list.sort(function(a,b) {
		return a.score - b.score;
	});
	
	if(canEnd())
		return setResults();
	
	document.querySelector('.left').innerText = list[0].key;
	document.querySelector('.right').innerText = list[1].key;
	pairs.push(list[0].key + '|' + list[1].key);
}

function setResults() {
	list.sort(function(a,b) {
		return b.score - a.score;
	});
	
	document.querySelector('.content').classList.toggle('end');
	
	let results = document.createElement('div');
	results.innerHTML = 'key | score' + '<br>';
	for(let result of list)
	{
		results.innerHTML += result.key + ' | ' + result.score + '<br>';
	}
	
	document.querySelector('.results').appendChild(results);
}

function canEnd() {
	//if all scores in list is unique?
	console.log('list',list);
	let unique = 0;
	for(let item of list)
	{
		let same = list.filter(i => i.score == item.score);
		if(same.length == 1)
			unique++;
	}
	console.log('unique',unique);
	return unique == list.length;
}