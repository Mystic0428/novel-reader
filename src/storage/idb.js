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
      req.onerror = () => reject(req.error);
    });
    return _dbPromise;
  }

  function tx(storeName, mode = 'readonly') {
    return openDB().then((db) => db.transaction(storeName, mode).objectStore(storeName));
  }

  function wrap(req) {
    return new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function get(storeName, id) {
    const store = await tx(storeName);
    return wrap(store.get(id));
  }

  async function put(storeName, value) {
    const store = await tx(storeName, 'readwrite');
    return wrap(store.put(value));
  }

  async function del(storeName, id) {
    const store = await tx(storeName, 'readwrite');
    return wrap(store.delete(id));
  }

  async function list(storeName) {
    const store = await tx(storeName);
    return wrap(store.getAll());
  }

  async function clear(storeName) {
    const store = await tx(storeName, 'readwrite');
    return wrap(store.clear());
  }

  window.idb = { openDB, get, put, del, list, clear };
})();
