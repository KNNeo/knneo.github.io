//--DEFAULT SETTINGS--//
const enableAI = false;

//--COMMON EVENTS--//
window.onload = startup();
window.onresize = adjustViewerMargin();

//--FUNCTIONS--//
function startup() {
	window['shake-1'] = false; // player
	window['shake-2'] = false; // opponent
	generateViewer();
}

function start() { // from trigger, start game	
	// remove headers
	for(let header of document.querySelectorAll('.header'))
	{
		header.classList.add('hidden');
	}
	
	// clear all cells of dice
	for(let content of document.querySelectorAll('.content.bi'))
	{
		content.className = 'content bi bi-dice-';
		content.removeAttribute('data-id');
	}
	// all scores to reset
	for(let score of document.querySelectorAll('.score'))
	{
		score.innerText = 0;
	}
	// remove disabled from dice (player first)
	for(let dice of document.querySelectorAll('.player.dice[data-status="disabled"]'))
	{
		dice.removeAttribute('data-status');
	}
	
	event.target.onclick = null;
	event.target.innerHTML = '';
	let score = document.createElement('strong');
	score.className = 'opponent total flipped';
	score.innerText = 0;
	event.target.appendChild(score);
	event.target.appendChild(document.createElement('hr'));
	score = document.createElement('strong');
	score.className = 'player total';
	score.innerText = 0;
	event.target.appendChild(score);
}

function end() { // from trigger, end game
	// disable dice
	for(let dice of document.querySelectorAll('.dice'))
	{
		dice.setAttribute('data-status', 'disabled');
	}
	
	// record score
	let wins = JSON.parse(localStorage.getItem('dice-game-wins') ?? '[]');
	let scores = JSON.parse(localStorage.getItem('dice-game-scores') ?? '[]');
	
	let playerScore = parseInt(document.querySelector('.player.total').innerText);
	let opponentScore = parseInt(document.querySelector('.opponent.total').innerText);
	console.log('game ended: ' + opponentScore + ' / ' + playerScore);
	
	let whoWins = 'draw';
	if(playerScore > opponentScore) {
		whoWins = 'player';
		document.querySelector('.player.dice').innerText = '✌️';
	}
	if(opponentScore > playerScore) {
		whoWins = 'opponent';
		document.querySelector('.opponent.dice').innerText = '✌️';
	}
	
	let playerWins = (wins[0] ?? 0) + (whoWins == 'player' ? 1 : 0);
	let opponentWins = (wins[1] ?? 0) + (whoWins == 'opponent' ? 1 : 0);
	
	scores.unshift({ player: playerScore, opponent: opponentScore, win: whoWins });
	
	localStorage.setItem('dice-game-wins',JSON.stringify([playerWins, opponentWins]));
	localStorage.setItem('dice-game-scores',JSON.stringify(scores));
}

function shake(number) {
	if(event.target.parentElement.getAttribute('data-status') == 'disabled' ||
	event.target.parentElement.getAttribute('data-status') == 'rolled') return;
	window['shake-' + number] = 0;
	shaking(number);
}

function shaking(number) {
	let rand = Math.floor(Math.random()*6) + 1;
	window['shake-' + number] = window['shake-' + number] + 1;
	if(number == 1)
		document.querySelector('.player.dice').querySelector('.bi').className = 'bi bi-dice-' + rand;
	if(number == 2)
		document.querySelector('.opponent.dice').querySelector('.bi').className = 'bi bi-dice-' + rand;
	
	// how to show rolling simulation? maybe on hover?
	roll(number, rand);
	// prevent rolling
	// event.target.onclick = null;
	
	// show dice as rolled
	event.target.parentElement.setAttribute('data-status', 'rolled');
	
	// light up board
	let classes = '.' + Array.from(event.target.parentElement.classList).join('.');
	for(let cell of document.querySelectorAll(classes.replace('dice', 'cell')))
	{
		if(cell.getAttribute('data-id') == null)
			cell.classList.add('highlight');
	}
}

function roll(elem, number) {
	window['roll-' + elem] = number;
}

function onCellSelect(number) {
	if(window['roll-' + number] && event.target.getAttribute('data-id') == null) {
		// update cell
		event.target.setAttribute('data-id', window['roll-' + number]);
		if(event.target.querySelector('.content') == null) // has dice on cell
			return;
		event.target.querySelector('.content').className = 'content bi bi-dice-' + window['roll-' + number];
		
		// remove other board's dice, if any
		if(number == 1) {
			if(event.target.classList.contains('col1')) {
				for(let cell of document.querySelectorAll('.opponent.cell.col1'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
			if(event.target.classList.contains('col2')) {
				for(let cell of document.querySelectorAll('.opponent.cell.col2'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
			if(event.target.classList.contains('col3')) {
				for(let cell of document.querySelectorAll('.opponent.cell.col3'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
		}
		if(number == 2) {
			if(event.target.classList.contains('col1')) {
				for(let cell of document.querySelectorAll('.player.cell.col1'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
			if(event.target.classList.contains('col2')) {
				for(let cell of document.querySelectorAll('.player.cell.col2'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
			if(event.target.classList.contains('col3')) {
				for(let cell of document.querySelectorAll('.player.cell.col3'))
				{
					if(cell.getAttribute('data-id') == window['roll-' + number]) {
						cell.removeAttribute('data-id');
						cell.querySelector('.content').className = 'content bi bi-dice-';
					}
				}
			}
			
		}
		
		// update scores
		updateColumnScores();	// for each column
		updateTotalScores();	// for each player
		
		// empty roll
		window['roll-' + number] = null;
		
		// allow rolling
		if(number == 1) {
			document.querySelector('.opponent.dice').removeAttribute('data-status');
			document.querySelector('.player.dice').setAttribute('data-status', 'disabled');
		}
		if(number == 2) {
			document.querySelector('.player.dice').removeAttribute('data-status');
			document.querySelector('.opponent.dice').setAttribute('data-status', 'disabled');
		}
		
		// remove light up board
		for(let cell of document.querySelectorAll('.highlight'))
		{
			cell.classList.remove('highlight');
		}
		
		// check if game should end
		// end if all cells in player board is filled, OR all cells in opponent board is filled
		if(Array.from(document.querySelectorAll('.opponent.cell'))
			.reduce((total, current) => total + (current.getAttribute('data-id') != null ? 1 : 0), 0) >= 9
		|| 
		Array.from(document.querySelectorAll('.player.cell'))
		.reduce((total, current) => total + (current.getAttribute('data-id') != null ? 1 : 0), 0) >= 9)
			end();
	}
}

function resetCell() {
	
}

function updateColumnScores() {
	for(let player = 1; player < 3; player++)
	{
		for(let col = 1; col < 4; col++)
		{
			//collate dice scores
			let classes = (player == 1 ? '.player' : '.opponent') + '.cell.col' + col;
			let datas = Array.from(document.querySelectorAll(classes))
			.map(cell => parseInt(cell.getAttribute('data-id') ?? '0'));
			
			// find out how many of each die number in total	
			let counts = [
				null,
				datas.reduce((total, dice) => dice == 1 ? total + 1 : total, 0),
				datas.reduce((total, dice) => dice == 2 ? total + 1 : total, 0),
				datas.reduce((total, dice) => dice == 3 ? total + 1 : total, 0),
				datas.reduce((total, dice) => dice == 4 ? total + 1 : total, 0),
				datas.reduce((total, dice) => dice == 5 ? total + 1 : total, 0),
				datas.reduce((total, dice) => dice == 6 ? total + 1 : total, 0)
			];
			let score = datas
			.reduce((sum, current, index, array) => {
				// add multiplier to sum
				return sum + current*counts[current];
			}, 0);
			// update column score
			document.querySelector(classes.replace('cell', 'score')).innerText = score;
		}
	}
	
}

function updateTotalScores() {
	document.querySelector('.player.total').innerText = Array.from(document.querySelectorAll('.player.score'))
	.reduce((total, current) => total + parseInt(current.innerText), 0);
	document.querySelector('.opponent.total').innerText = Array.from(document.querySelectorAll('.opponent.score'))
	.reduce((total, current) => total + parseInt(current.innerText), 0);
}

function showRules() {
	let board = document.createElement('div');
	board.classList.add('board');
	board.classList.add('rotated');
	board.innerText = rulesText;
	
	openItemInViewer(board);
}

function showScores() {
	let board = document.createElement('div');
	board.classList.add('board');
	board.classList.add('rotated');
	board.style.fontSize = '2em';
	
	// show matches score, show list of scores
	// wins array: [playerWins, opponentWins]
	// scores object: { player: x, opponent: y, win: player }
	let wins = JSON.parse(localStorage.getItem('dice-game-wins') ?? '[]');
	let scores = JSON.parse(localStorage.getItem('dice-game-scores') ?? '[]');
	// console.log(wins, scores);
	
	let header = document.createElement('h5');
	header.style.textAlign = 'center';
	header.innerText = 'MATCHES';
	board.appendChild(header);
	
	let winsDiv = document.createElement('div');
	winsDiv.style.textAlign = 'center';
	
		let playerWins = document.createElement('div');
		playerWins.innerText = wins[1] ?? 0;
		winsDiv.appendChild(playerWins);
		
		let separator = document.createElement('hr');
		winsDiv.appendChild(separator);
	
		let opponentWins = document.createElement('div');
		opponentWins.innerText = wins[0] ?? 0;
		winsDiv.appendChild(opponentWins);
	
	board.appendChild(winsDiv);
	
	separator = document.createElement('div');
	separator.classList.add('separator');
	separator.style.height = '5vh';
	board.appendChild(separator);
	
	header = document.createElement('h5');
	header.style.textAlign = 'center';
	header.innerText = 'BREAKDOWN';
	board.appendChild(header);
	
	let scoresDiv = document.createElement('div');
	scoresDiv.classList.add('scores');

	for(let score of scores) // opponent only
	{
		let scoreTr = document.createElement('tr');
		
				let scoreTd = document.createElement('td');
				
				let playerWin2 = document.createElement('span');
				playerWin2.classList.add('win');
				playerWin2.innerText = score.win == 'opponent' ? '✌️' : '';
				scoreTd.appendChild(playerWin2);
				
				let playerWin1 = document.createElement('span');
				playerWin1.classList.add('score');
				playerWin1.innerText = score.opponent;
				scoreTd.appendChild(playerWin1);
				
				scoreTr.appendChild(scoreTd);
				
				separator = document.createElement('hr');
				scoreTr.appendChild(separator);
			
				scoreTd = document.createElement('td');
				scoreTd.style.position = 'relative';
				
				let opponentWin2 = document.createElement('span');
				opponentWin2.classList.add('win');
				opponentWin2.innerText = score.win == 'player' ? '✌️' : '';
				scoreTd.appendChild(opponentWin2);
				
				let opponentWin1 = document.createElement('span');
				opponentWin1.classList.add('score');
				opponentWin1.innerText = score.player;
				scoreTd.appendChild(opponentWin1);
				
				scoreTr.appendChild(scoreTd);
				
		scoresDiv.appendChild(scoreTr);
	}				
	
	board.appendChild(scoresDiv);
	
	separator = document.createElement('div');
	separator.classList.add('separator');
	separator.style.height = '5vh';
	board.appendChild(separator);
	
	let resetter = document.createElement('div');
	resetter.classList.add('reset');
	resetter.innerText = 'Reset';
	resetter.addEventListener('click', function() {
		alert('scores reset');
		resetScores();
	});
	board.appendChild(resetter);
	
	openItemInViewer(board);	
}

function resetScores() {
	localStorage.setItem('dice-game-wins',JSON.stringify([]));
	localStorage.setItem('dice-game-scores',JSON.stringify([]));
	location.reload();
}

//--RULES--//
const rulesText = `
* The game consists of two 3x3 boards, each belonging to their respective player.
* Each player rolls a die, higher value goes first.
* The players take turns. On a player's turn, they roll a single 6-sided die, and must place it in a column on their board. A filled column does not accept any more dice.
* Each player has a score, which is the sum of all the dice values on their board. The score awarded by each column is also displayed.
* If a player places multiple dice of the same value in the same column, the score awarded for each of those dice is multiplied by the number of dice of the same value in that column. e.g. if a column is 4-1-4, then the score is 4x2 + 1x1 + 4x2 = 17. 
* Calculation applies to number of nice in each column eg. if a column is 4-4-4, then the score is 4x3 + 4x3 + 4x3 = 36.
* When a player places a die, all dice of the same value in the corresponding column of the opponent's board gets destroyed.
* The game ends when either player completely fills up their 3x3 board. The player with the higher score wins.
`;