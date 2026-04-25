// src/storage/roots.js — roots CRUD + permission helpers
(function () {
  function uuid() { return crypto.randomUUID(); }

  async function add({ name, dirHandle, excludeDirs }) {
    const root = {
      id: uuid(),
      name,
      dirHandle,
      addedAt: Date.now(),
      lastScannedAt: null,
      bookCount: 0,
      excludeDirs: excludeDirs || [],
    };
    await idb.put('roots', root);
    return root;
  }

  async function list() {
    const all = await idb.list('roots');
    return all.sort((a, b) => a.addedAt - b.addedAt);
  }

  async function remove(id) {
    await idb.del('roots', id);
  }

  async function update(id, patch) {
    const r = await idb.get('roots', id);
    if (!r) return null;
    const merged = { ...r, ...patch };
    await idb.put('roots', merged);
    return merged;
  }

  // File System Access permission helper. Returns true if permission is (or can be) granted.
  async function ensurePermission(dirHandle, mode = 'read') {
    if (!dirHandle || !dirHandle.queryPermission) return false;
    const state = await dirHandle.queryPermission({ mode });
    if (state === 'granted') return true;
    const req = await dirHandle.requestPermission({ mode });
    return req === 'granted';
  }

  window.rootsStore = { add, list, remove, update, ensurePermission };
})();
