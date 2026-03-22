//--DEFAULT SETTINGS--//
const config = {};
const DB_NAME = "gacha";
const STORE_NAME = "surugacha";
const FILE_KEY = "app_db";
const SQL = await initSqlJs({
	locateFile: file => `https://knneo.github.io/games/gacha/sql-wasm.wasm`
});

//--DOM NODE REFERENCES--//


//--DOM FUNCTIONS--//


//--EVENT HANDLERS--//


//--FUNCTIONS--//
function getIDB() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function createDb(SQL) {
	console.log("Creating a fresh database...");
	return new SQL.Database();
}

async function saveDb() {
	try {
		const binaryData = config.db.export();
		const idb = await getIDB();
		const tx = idb.transaction(STORE_NAME, "readwrite");
		tx.objectStore(STORE_NAME).put(binaryData, FILE_KEY);

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

async function loadDb(SQL) {
	try {
		const idb = await getIDB();
		const tx = idb.transaction(STORE_NAME, "readonly");
		const request = tx.objectStore(STORE_NAME).get(FILE_KEY);

		request.onsuccess = () => {
			const data = request.result;
			if (data) {
				console.log("Existing database found and loaded.");
				config.db = new SQL.Database(data);
			} else {
				console.log("No saved database found. Creating new.");
				config.db = createDb(SQL);
			}
		};
	} catch (err) {
		console.error("Error loading database:", err);
	}
}

async function queryDb(query) {

}

async function writeDb(statement) {

}

//--INITIAL--//
window.addEventListener('load', function () {
	loadDb(SQL);
	startup();
});

function startup() {
	console.log('complete');
}