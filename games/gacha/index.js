//--DEFAULT SETTINGS--//
const config = {
	debug: true,
	id: '20260828',
	idb: {
		name: 'gacha',
		store: 'surugacha',
		key: 'app_db'
	},
	card: {
		separator: /\u3000|\//g  // u3000 = Ideographic Space
	}
};

//--DOM NODE REFERENCES--//
const cardView = document.querySelector('div.card-view');
const libraryView = document.querySelector('div.library-view');

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
}

function generateRandomCard() {
	cardView.replaceChildren(generateCard(config.cards.sort(r => 2*Math.random()-1)[0]));
}

function generateCards() {
	for (let card of config.cards)
		generateCard(card);
}

function generateCard(card) {
	let cardDiv = document.createElement('div');
	cardDiv.classList.add('card', 'box');
	cardDiv.dataset.id = card.id;
	cardDiv.onclick = hideCard;

	let cardImg = document.createElement('img');
	cardImg.src = card.image;
	cardDiv.appendChild(cardImg);

	let cardText = document.createElement('h5');
	cardText.innerText = card.value.split(config?.card?.separator || '/').join('\n');
	cardText.title = cardText.innerText;
	cardDiv.appendChild(cardText);

	let cardPrice = document.createElement('p');
	cardPrice.innerText = card.price;
	cardDiv.appendChild(cardPrice);

	saveCardToLibrary(card.id);

	return cardDiv;
}

function saveCardToLibrary(id) {
	let now = new Date();
	let nowInt = parseInt(`${now.getYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}${now.getSeconds()}${now.getMilliseconds()}`);
	writeDb(`INSERT INTO library (cardId, added) VALUES (${id}, ${nowInt});`);
	saveDb();
}

function hideCard() {
	return this.remove();
}

function generateLibrary() {
	let filterDiv = document.createElement('select');
	sortDiv.value = '===FILTER===';

	let sortDiv = document.createElement('select');
	sortDiv.value = '===SORT===';

	let headerDiv = document.createElement('div');
	headerDiv.classList.add('filter-sort');
	headerDiv.appendChild(filterDiv);
	headerDiv.appendChild(sortDiv);

	let listDiv = document.createElement('div');
	listDiv.classList.add('list');

	if(config.library.length) {
		for (let item of config.library) {
			let card = config.cards.find(c => c.id === item.cardId);
			if(card)
				listDiv.appendChild(generateCard(card));
			else
				console.warn('card in library missing in card list', item.cardId);
		}
		libraryView.replaceChildren(headerDiv, listDiv);
	}
	else
		libraryView.replaceChildren(headerDiv, document.createTextNode('Library is empty, draw some cards!'));

}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
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
	if (!config.db)
		console.error('loadDb: Database not found.');

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
	} catch (err) {
		config.db.run("ROLLBACK");
		console.error("Write to database failed:", err);
	}
}

async function migrateDb(SQL) {
	if (!config.db)
		return console.error('migrateDb: Database not found.');

	try {
		console.log('Version change detected! Updating database...');
		let newDb = createDb(SQL);
		let newDbCards = newDb.exec("SELECT * FROM card");

		if (newDbCards.length === 0 || !newDbCards[0].values.length)
			return console.error("No data found in the card table.");

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
		config.db.run("BEGIN TRANSACTION");

		for (let row of rows)
			stmt.run(row);

		config.db.run("COMMIT");
		stmt.free();
		newDb.close();

		await saveDb();
		console.log(`Successfully migrated ${rows.length} cards.`);
	} catch (err) {
		config.db.run("ROLLBACK");
		console.error("Database migration failed:", err);
	}
}

//--INITIAL--//
window.addEventListener('load', async function () {
	let SQL = await initSqlJs({
		locateFile: file => `https://knneo.github.io/games/gacha/sql-wasm.wasm`
	});
	await loadDb(SQL, startup);
	await saveDb();
	if (config.id != localStorage.getItem('gacha_ver_id')) {
		await migrateDb(SQL);
		localStorage.setItem('gacha_ver_id', config.id);
		startup();
	}
});

function startup() {
	selectView();
	queryDb('SELECT * FROM card', function (content) {
		if (!content || !content.length)
			return console.error('Card list empty');
		config.cards = processQueryResult(content);
		console.log('Card list init complete.');
	});
	queryDb('SELECT * FROM library', function (content) {
		if (!content || !content.length)
			return console.error('Library empty');
		config.library = processQueryResult(content);
		console.log('Library init complete.');
	});
}

function processQueryResult(content) {
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