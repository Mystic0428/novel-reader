// src/storage/idb.js — thin IndexedDB wrapper, no deps
(function () {
  const DB_NAME = 'novel-reader';
  const DB_VERSION = 1;
  const STORES = ['roots', 'books', 'settings', 'kv'];

  let _dbPromise = null;

  function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        for (const name of STORES) {
          if (!db.objectStoreNames.contains(name)) {
            db.createObjectStore(name, { keyPath: 'id' });
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

  async function clear(storeName) {
    const db = await openDB();
    const txObj = db.transaction(storeName, 'readwrite');
    txObj.objectStore(storeName).clear();
    await waitTx(txObj);
  }

  window.idb = { openDB, get, put, del, list, clear };
})();
