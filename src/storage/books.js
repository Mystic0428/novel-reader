// src/storage/books.js — books CRUD + query
(function () {
  function uuid() { return crypto.randomUUID(); }

  async function add(partial) {
    const book = {
      id: uuid(),
      rootId: null,
      relPath: null,
      fileHandle: null,
      sourceType: 'epub',
      title: 'Untitled',
      author: null,
      coverBlob: null,
      accent: '#8C3A2E',
      chaptersMeta: [],
      wordCount: 0,
      lastChapterId: null,
      lastScroll: 0,
      tags: [],
      collections: [],
      status: 'unread',
      preserveOriginalCss: false,
      addedAt: Date.now(),
      lastReadAt: null,
      ...partial,
    };
    await idb.put('books', book);
    return book;
  }

  async function get(id) { return idb.get('books', id); }

  async function list() {
    const all = await idb.list('books');
    return all.sort((a, b) => (b.lastReadAt ?? b.addedAt) - (a.lastReadAt ?? a.addedAt));
  }

  async function update(id, patch) {
    const b = await idb.get('books', id);
    if (!b) return null;
    const merged = { ...b, ...patch };
    // derive status
    if (merged.chaptersMeta.length > 0) {
      const idx = Math.max(0, merged.chaptersMeta.findIndex((c) => c.id === merged.lastChapterId));
      const prog = (idx + (merged.lastScroll || 0)) / merged.chaptersMeta.length;
      if (prog >= 0.95) merged.status = 'finished';
      else if (prog > 0) merged.status = 'reading';
      else merged.status = 'unread';
    }
    await idb.put('books', merged);
    return merged;
  }

  async function remove(id) { await idb.del('books', id); }

  // Add/remove tag, collection. Book is written once per call.
  async function addTag(id, tag) {
    const b = await get(id);
    if (!b) return null;
    const tags = Array.from(new Set([...b.tags, tag]));
    return update(id, { tags });
  }
  async function removeTag(id, tag) {
    const b = await get(id);
    if (!b) return null;
    return update(id, { tags: b.tags.filter((t) => t !== tag) });
  }
  async function addCollection(id, col) {
    const b = await get(id);
    if (!b) return null;
    const collections = Array.from(new Set([...b.collections, col]));
    return update(id, { collections });
  }
  async function removeCollection(id, col) {
    const b = await get(id);
    if (!b) return null;
    return update(id, { collections: b.collections.filter((c) => c !== col) });
  }

  function allTags(books) {
    const s = new Set();
    for (const b of books) for (const t of b.tags) s.add(t);
    return Array.from(s).sort();
  }
  function allCollections(books) {
    const s = new Set();
    for (const b of books) for (const c of b.collections) s.add(c);
    return Array.from(s).sort();
  }

  window.booksStore = {
    add, get, list, update, remove,
    addTag, removeTag, addCollection, removeCollection,
    allTags, allCollections,
  };
})();
