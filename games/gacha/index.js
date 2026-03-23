//--DEFAULT SETTINGS--//
const config = {
	debug: true,
	id: '20260322',
	idb: {
		name: 'gacha',
		store: 'surugacha',
		key: 'app_db'
	}
};

//--DOM NODE REFERENCES--//


//--DOM FUNCTIONS--//


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

async function loadDb(SQL) {
	if (!config.db)
		return console.error('saveDb: Database not found.');

	try {
		const idb = await getIDB();
		const tx = idb.transaction(config.idb.store, "readonly");
		const request = tx.objectStore(config.idb.store).get(config.idb.key);

		request.onsuccess = () => {
			const data = request.result;
			if (data) {
				console.log("Existing database found and loaded.");
				config.db = new SQL.Database(data);
			} else {
				console.log("No saved database found. Creating new.");
				config.db = createDb(SQL);
				console.log("Fresh database loaded.");
			}
		};
	} catch (err) {
		console.error("Error loading database:", err);
	}
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

async function queryDb(query, callback) {
	if (!config.db)
		return console.error('saveDb: Database not found.');

	try {
		let content = config.db.run(query);
		if (callback) callback(content);
	} catch (err) {
		console.error("Query database failed:", err);
	}
}

async function writeDb(statement) {
	if (!config.db)
		return console.error('saveDb: Database not found.');

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
	await loadDb(SQL);
	await saveDb();
	if (config.id != localStorage.getItem('gacha_ver_id')) {
		await migrateDb(SQL);
		localStorage.setItem('gacha_ver_id', config.id);
	}
	startup();
});

function startup() {
	console.log('Initialization complete.');
	queryDb('SELECT * FROM card', function (content) {
		config.cards = processQueryResult(content);
	});
}

function processQueryResult(content) {
	let columns = content[0].columns;
	let rows = content[0].values;
	let list = [];
	for (let col of columns) {
		let colIndex = columns.indexOf(col);
		for (let row of rows)
			list[col] = row[colIndex];
	}
	return list;
}