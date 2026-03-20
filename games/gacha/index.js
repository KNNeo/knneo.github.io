//--DEFAULT SETTINGS--//
const config = {};
const DB_NAME = "SqliteStore";
const STORE_NAME = "databases";
const FILE_KEY = "my_app_db";

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

async function saveDb(dbInstance) {
  try {
    const binaryData = dbInstance.export();
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

async function loadDb(SQL, callback) {
  try {
    const idb = await getIDB();
    const tx = idb.transaction(STORE_NAME, "readonly");
    const request = tx.objectStore(STORE_NAME).get(FILE_KEY);

    request.onsuccess = () => {
      const data = request.result;
      let db;
      if (data) {
        console.log("Existing database found and loaded.");
        db = new SQL.Database(data);
      } else {
        console.log("No saved database found. Creating new.");
        db = createDb(SQL);
      }
      callback(db);
    };
  } catch (err) {
    console.error("Error loading database:", err);
  }
}

//--INITIAL--//
function startup() {
}
