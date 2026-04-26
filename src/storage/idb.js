// src/storage/idb.js — thin IndexedDB wrapper, no deps
(function () {
  const DB_NAME = 'novel-reader';
  const DB_VERSION = 3;
  // Per-store config so we can mix keyPath stores (most things) with
  // autoIncrement append-only stores (readingEvents).
  const STORE_CONFIG = {
    roots:         { keyPath: 'id' },
    books:         { keyPath: 'id' },
    settings:      { keyPath: 'id' },
    kv:            { keyPath: 'id' },
    readingEvents: { keyPath: 'id', autoIncrement: true, indexes: [['byDate', 'date'], ['byBook', 'bookId']] },
  };

  let _dbPromise = null;

  function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const [name, cfg] of Object.entries(STORE_CONFIG)) {
          if (db.objectStoreNames.contains(name)) continue;
          const opts = cfg.autoIncrement
            ? { keyPath: cfg.keyPath, autoIncrement: true }
            : { keyPath: cfg.keyPath };
          const store = db.createObjectStore(name, opts);
          for (const [idxName, idxKey] of (cfg.indexes || [])) {
            store.createIndex(idxName, idxKey);
          }
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => {
        _dbPromise = null;
        reject(req.error);
      };
    });
    return _dbPromise;
  }

  function wrap(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  // For readwrite ops we wait for tx.oncomplete — req.onsuccess fires during the
  // transaction, so a follow-up read opened right after can see stale state.
  function waitTx(txObj) {
    return new Promise((resolve, reject) => {
      txObj.oncomplete = () => resolve();
      txObj.onerror = () => reject(txObj.error);
      txObj.onabort = () => reject(txObj.error);
    });
  }

  async function get(storeName, id) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readonly');
    return wrap(txObj.objectStore(storeName).get(id));
  }

  async function put(storeName, value) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readwrite');
    txObj.objectStore(storeName).put(value);
    await waitTx(txObj);
    return value;
  }

  // Append a record to an autoIncrement store. Returns the assigned key.
  async function add(storeName, value) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readwrite');
    const req = txObj.objectStore(storeName).add(value);
    const key = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    await waitTx(txObj);
    return key;
  }

  async function del(storeName, id) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readwrite');
    txObj.objectStore(storeName).delete(id);
    await waitTx(txObj);
  }

  async function list(storeName) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readonly');
    return wrap(txObj.objectStore(storeName).getAll());
  }

  // Query an index for a single key (returns all matching records).
  async function listByIndex(storeName, indexName, key) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readonly');
    const idx = txObj.objectStore(storeName).index(indexName);
    return wrap(idx.getAll(key));
  }

  async function clear(storeName) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readwrite');
    txObj.objectStore(storeName).clear();
    await waitTx(txObj);
  }

  window.idb = { openDB, get, put, add, del, list, listByIndex, clear };
})();
