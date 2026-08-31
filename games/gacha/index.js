//--DEFAULT SETTINGS--//
const config = {
	debug: true,
	id: '20260831_1',
	idb: {
		name: 'gacha',
		store: 'surugacha',
		key: 'app_db'
	},
	card: {
		separator: /\u3000|\//g  // u3000 = Ideographic Space
	},
	options: {
		sort: [
			{
				value: 'Date Added (Descending)',
				func: function(a, b) {
					return b.added - a.added;
				}
			},
			{
				value: 'Date Added (Ascending)',
				func: function(a, b) {
					return a.added - b.added;
				}
			},
			{
				value: 'Id (Descending)',
				func: function(a, b) {
					return b.cardId - a.cardId;
				}
			},
			{
				value: 'Id (Ascending)',
				func: function(a, b) {
					return a.cardId - b.cardId;
				}
			}
		]
	}
};

//--DOM NODE REFERENCES--//
const cardView = document.querySelector('div.card-view');
const libraryView = document.querySelector('div.library-view');
const statsView = document.querySelector('div.stats-view');

//--DOM FUNCTIONS--//
function selectView() {
	let className = 'card-view';
	if (event?.target?.dataset?.id)
		className = event.target.dataset.id;
	for (let view of document.querySelectorAll('.view')) {
		if (view.classList.contains(className))
			view.classList.remove('hidden');
		else
			view.classList.add('hidden');
	}
	if (className == 'library-view')
		initLibrary();
	if (className == 'stats-view')
		initStats();
}

function generateCard(card, onclick) {
	let cardDiv = document.createElement('div');
	cardDiv.classList.add('card', 'box');
	cardDiv.dataset.id = card.id;
	if (onclick) cardDiv.onclick = onclick;

	let cardImgDiv = document.createElement('div');
	let cardImg = document.createElement('img');
	cardImg.src = card.image;
	cardImgDiv.appendChild(cardImg);
	cardDiv.appendChild(cardImgDiv);

	let cardText = document.createElement('h5');
	cardText.textContent = card.desc.split(config?.card?.separator || '/').join('\n');
	cardText.title = cardText.innerText;
	cardDiv.appendChild(cardText);

	if (card.value) {
		let cardPrice = document.createElement('p');
		cardPrice.textContent = card.value;
		cardDiv.appendChild(cardPrice);
	}

	let cardLike = document.createElement('a');
	cardLike.classList.add('bi', 
		config.library.find(s => s.cardId == card.id)?.like ? 'bi-star' : 'bi-star-fill');
	cardLike.onclick = toggleLikeCard;
	cardDiv.appendChild(cardLike);

	return cardDiv;
}

function toggleLikeCard() {
	// TODO: update db
	if(event?.target?.classList.contains('bi-star-fill'))
		event?.target.classList.replace('bi-star-fill', 'bi-star');
	else
		event?.target.classList.replace('bi-star', 'bi-star-fill');
}

function saveCardToLibrary(id) {
	if(config.library.find(l => l.cardId == id))
		return console.error('cardId in library', id);
	let now = new Date();
	let nowInt = parseInt(`${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`);
	writeDb(`INSERT INTO library (cardId, added) VALUES ('${id}', ${nowInt});`);
	saveDb();
	initLibrary();
}

function hideCard() {
	if (event?.target?.onclick) return;
	else this.remove();
}

function generateLibrary() {
	let filterDiv = document.createElement('input');
	filterDiv.classList.add('filter');
	filterDiv.placeholder = 'Filter by description...';
	filterDiv.oninput = generateLibraryList;

	let sortDiv = document.createElement('select');
	sortDiv.classList.add('sort');
	sortDiv.onchange = generateLibraryList;
	for (let opt of config.options.sort) {
		let optDiv = document.createElement('option');
		optDiv.innerText = opt.value;
		optDiv.value = opt.value;
		sortDiv.appendChild(optDiv);
	}

	let statsDiv = document.createElement('div');
	statsDiv.innerText = `${config.cards?.length || 0} cards\n${config.library?.length || 0} in library`;

	let headerDiv = document.createElement('div');
	headerDiv.classList.add('filter-sort');
	headerDiv.appendChild(filterDiv);
	headerDiv.appendChild(sortDiv);
	headerDiv.appendChild(statsDiv);

	let listDiv = document.createElement('div');
	listDiv.classList.add('list');

	if (config.library.length)
		libraryView.replaceChildren(headerDiv, listDiv, document.createElement('hr'));
	else
		libraryView.replaceChildren(headerDiv, document.createTextNode('Library is empty, draw some cards!'));
	
	generateLibraryList();
}

function generateLibraryList() {
	let filterVal = libraryView.querySelector('.filter')?.value || '';
	let sortVal = libraryView.querySelector('.sort')?.value || config.options?.sort[0]?.value || '';
	let sortFunc = config.options?.sort?.find(s => s.value == sortVal)?.func;
	if (!sortVal || !sortFunc) return console.error('sort func not found!');

	let listDiv = libraryView.querySelector('.list');
	if (!listDiv) return console.error('library element not found!');

	if (config.library.length) {
		let newList = [];
		for (let item of config.library
					.filter(f => !filterVal || config.cards.find(c => c.id == f.cardId)?.value.includes(filterVal))
					.sort(sortFunc)) {
			let card = config.cards.find(c => c.id === item.cardId);
			if (card)
				newList.push(generateCard(card, function() {
					if (event?.target?.onclick) return;
					cardView.replaceChildren(generateCard(card, hideCard));
					selectView();
				}));
			else
				console.warn('card in library missing in card list', item.cardId);
		}
		listDiv.replaceChildren(...newList);
	}
}

function generateStats() {
	let elems = [];
	for (let pack of config.stats) {
		let container = document.createElement('div');
		let title = document.createElement('h5');
		title.innerText = pack.value;
		container.appendChild(title);
		
		let progress = document.createElement('progress');
		progress.min = 0;
		progress.max = 100;
		progress.value = parseInt(pack.count) / parseInt(pack.total) * progress.max;
		container.appendChild(progress);

		let label = document.createElement('label');
		label.innerText = pack.count + ' / ' + pack.total;
		container.appendChild(label);

		elems.push(container);
	}
	statsView.replaceChildren(...elems);
}

//--DOM EVENT LISTENERS--//
function generateRandomCard() {
	let cards = config.cards
		.filter(c => !config?.library?.length || !config.library.find(l => c.id == l.cardId))
		.sort(r => 2*Math.random()-1);
	if (cards.length) {
		selectView();
		cardView.replaceChildren(generateCard(cards[0], hideCard));
		saveCardToLibrary(cards[0].id);
	}
	else
		alert('no more cards to draw, update library!');
}

function resetData() {
	if (confirm('Confirm reset data? This action cannot be undone.')) {
		writeDb('DELETE FROM library');
		saveDb();
		window.location.reload();
	}
}

//--DB FUNCTIONS--//
function getIDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(config.idb.name, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(config.idb.store);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

async function createDb(SQL) {
	try {
		console.log("Creating a fresh database...");
		const response = await fetch('https://knneo.github.io/games/gacha/gacha.db');
		if (response.ok && response.status == 200) {
			//initialize db
			const result = await response.arrayBuffer();
			const uInt8Array = new Uint8Array(result);
			return new SQL.Database(uInt8Array);
		}
		else
			console.error('Failed to find base database:' + response);
	}
	catch (err) {
		console.error('Failed to create database:' + err);
	}
}

async function loadDb(SQL, callback) {
	const idb = await getIDB();
	const tx = idb.transaction(config.idb.store, "readonly");
	const request = tx.objectStore(config.idb.store).get(config.idb.key);

	request.onsuccess = async () => {
		const data = request.result;
		if (data) {
			console.log("Existing database found and loaded.");
			config.db = new SQL.Database(data);
		} else {
			console.log("No saved database found. Creating new.");
			config.db = await createDb(SQL);
			console.log("Fresh database loaded.");
		}
		if (callback) setTimeout(callback, 0);
	};
}

async function saveDb() {
	if (!config.db)
		return console.error('saveDb: Database not found.');

	try {
		const binaryData = config.db.export();
		const idb = await getIDB();
		const tx = idb.transaction(config.idb.store, "readwrite");
		tx.objectStore(config.idb.store).put(binaryData, config.idb.key);

		return new Promise((res) => {
			tx.oncomplete = () => {
				console.log("Database saved successfully.");
				res();
			};
		});
	} catch (err) {
		console.error("Failed to save database:", err);
	}
}

function queryDb(query, callback) {
	if (!config.db)
		return console.error('queryDb: Database not found.');

	try {
		let content = config.db.exec(query);
		if (callback) callback(content);
	} catch (err) {
		console.error("Query database failed:", err);
	}
}

function writeDb(statement) {
	if (!config.db)
		return console.error('writeDb: Database not found.');

	try {
		config.db.run("BEGIN TRANSACTION");
		config.db.run(statement);
		config.db.run("COMMIT");
		saveDb();
	} catch (err) {
		config.db.run("ROLLBACK");
		console.error("Write to database failed:", err);
	}
}

async function migrateDbCards(SQL, callback) {
	if (!config.db)
		return console.error('Database not found.');

	try {
		console.log('Version change detected! Updating database...');
		let newDb = await createDb(SQL);
		let newDbCards = newDb.exec("SELECT * FROM card");

		if (newDbCards.length === 0 || !newDbCards[0].values.length)
			return console.error("No data found in the card table.");

		config.db.run("BEGIN TRANSACTION");

		let columns = newDbCards[0].columns;
		let rows = newDbCards[0].values;
		let colNames = columns.join(", ");
		let placeholders = columns.map(() => "?").join(", ");
		let updateExclusion = columns
			.filter(col => col !== 'id') // 'id' is primary key
			.map(col => `${col} = excluded.${col}`)
			.join(", ");
		let upsertSql = `
				INSERT INTO card (${colNames}) 
				VALUES (${placeholders})
				ON CONFLICT(id) DO UPDATE SET ${updateExclusion}
				`;

		let stmt = config.db.prepare(upsertSql);
		for (let row of rows)
			stmt.run(row);

		config.db.run("COMMIT");
		stmt.free();
		newDb.close();

		await saveDb();
		localStorage.setItem('gacha_ver_id', config.id);
		console.log(`Successfully migrated ${rows.length} cards.`);
		if (callback) callback();
	} catch (err) {
		config.db.run("ROLLBACK");
		console.error("Database migration failed:", err);
	}
}

//--INITIAL--//
window.addEventListener('load', async function () {
	config.sql = await initSqlJs({
		locateFile: file => `https://knneo.github.io/games/gacha/sql-wasm.wasm`
	});
	await loadDb(config.sql, startup);
	await saveDb();
});

function startup() {
	if (config.id != localStorage.getItem('gacha_ver_id'))
		migrateDbCards(config.sql, startup);
	selectView();
	initCards();
	initLibrary();
}

function initCards() {
	queryDb('SELECT * FROM card', function (content) {
		if (!content || !content.length)
			return console.error('Card list empty');
		config.cards = processQueryResult(content);
		console.log('Card list init complete.');
	});
}

function initLibrary() {
	queryDb('SELECT * FROM library', function (content) {
		config.library = processQueryResult(content);
		generateLibrary();
		console.log('Library init complete.');
	});
}

function initStats() {
	initCards();
	queryDb('SELECT p.id, p.value, COUNT(c.id) AS \'total\', COUNT(l.cardId) AS \'count\' FROM pack p JOIN pack_card pc on p.id = pc.packId JOIN card c on pc.cardId = c.id LEFT JOIN library l ON c.id = l.cardId GROUP BY p.id, p.value', function (content) {
		if (!content || !content.length)
			return console.error('Stats empty');
		config.stats = processQueryResult(content);
		generateStats();
		console.log('Stats init complete.');
	});
}

function processQueryResult(content) {
	if (!content || !content.length) return [];
	let columns = content[0].columns;
	let rows = content[0].values;
	let list = [];
	let item = {};
	for (let row of rows) {
		for (let col of columns) {
			let colIndex = columns.indexOf(col);
			item[col] = row[colIndex];
		}
		list.push(item);
		item = {};
	}
	return list;
}