# Novel Reader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first desktop novel reader in a single-directory project (one HTML + JSX/CSS deps) that reads the user's EPUB and TXT library, with three runtime-switchable atmospheric themes (Warm Library / Ambient Glass / Dark Serif), each with a customizable accent color, and a library view with recursive folder scanning via File System Access API.

**Architecture:** Single `novel-reader.html` entry that loads React 18, Babel standalone, and JSZip from CDN — matching the design prototype's loader. All app code in `src/*.jsx`, styles in `styles/*.css`, persistence via IndexedDB. Two views (library + reader) in a single SPA controlled by a `useReducer`-backed `AppContext`. EPUB parsing done in-browser with JSZip + DOMParser; sanitized chapter HTML held in a session-only memory cache.

**Tech Stack:** React 18.3.1, @babel/standalone 7.29.0, JSZip 3.10.1, native IndexedDB, File System Access API, Noto Sans/Serif TC + Inter (Google Fonts).

**Reference docs:**
- Spec: `docs/superpowers/specs/2026-04-24-novel-reader-design.md`
- Design prototype: `C:\dev\` is where this project sits; original prototype bundle was exported from claude.ai/design

**Test strategy:** No automated test framework per spec. Each task ends with a concrete **manual browser-based verification step** using fixture files from `C:\dev\esjzone-scraper\books` and `C:\dev\novelpia-scraper\books`. Parser modules (EPUB, TXT) include small browser-console smoke tests documented in the verification steps.

---

## File Structure

```
C:\dev\novel-reader\
├── novel-reader.html          (Task 1)   Entry HTML, loads deps, mounts <App/>
├── styles/
│   ├── shared.css             (Task 1)   Tokens, fonts, scroll helpers, paper texture
│   ├── v1-warm.css            (Task 16)  Warm Library theme styles
│   ├── v4-glass.css           (Task 17)  Ambient Glass theme styles
│   └── v5-dark.css            (Task 18)  Dark Serif theme styles
├── src/
│   ├── app.jsx                (Task 1)   Root <App/>, AppContext, reducer, view routing
│   ├── library.jsx            (Task 7)   Library view: sidebar + grid
│   ├── reader.jsx             (Task 13)  Reader shell: top bar, content, footer
│   ├── themes/
│   │   ├── v1-warm.jsx        (Task 16)  V1 theme layout
│   │   ├── v4-glass.jsx       (Task 17)  V4 theme layout
│   │   └── v5-dark.jsx        (Task 18)  V5 theme layout
│   ├── ui/
│   │   ├── cover.jsx          (Task 8)   Spine-style book cover
│   │   ├── book-menu.jsx      (Task 11)  Book right-click context menu
│   │   ├── toc-drawer.jsx     (Task 15)  TOC slide-in drawer
│   │   ├── tweaks-panel.jsx   (Task 15)  Font/line/texture tweaks
│   │   ├── theme-switcher.jsx (Task 19)  3-thumb theme switcher
│   │   └── color-picker.jsx   (Task 19)  Per-theme accent picker
│   ├── parsers/
│   │   ├── epub.js            (Tasks 4-5) EPUB parser (JSZip-based)
│   │   └── txt.js             (Task 6)    TXT parser (encoding sniff + chapter split)
│   └── storage/
│       ├── idb.js             (Task 2)   IndexedDB wrapper
│       ├── roots.js           (Task 3)   roots CRUD + permission helper
│       ├── books.js           (Task 3)   books CRUD + query
│       └── settings.js        (Task 3)   settings load/save with defaults
├── docs/
│   └── superpowers/
│       ├── specs/2026-04-24-novel-reader-design.md
│       └── plans/2026-04-24-novel-reader.md
├── .gitignore
└── README.md                  (Task 20)  Brief usage doc
```

Every file has one responsibility. Parsers are pure functions (no React, no DOM-other-than-DOMParser), storage is IDB-only, components are pure presentation + callbacks, `app.jsx` owns state mutation via reducer.

---

## Sample fixtures (used across tasks)

- **EPUB (zh-TW)**: `C:\dev\esjzone-scraper\books\1543764675(迷宮防守)\zh-TW\迷宮防守.epub`
- **EPUB (zh simplified)**: `C:\dev\novelpia-scraper\books\321237\zh\迷宮都市的肉身魔像.epub`
- **EPUB (ko)**: `C:\dev\novelpia-scraper\books\321237\ko\미궁도시의 플레시골렘.epub`
- **Scraper roots for library scan**: `C:\dev\esjzone-scraper\books`, `C:\dev\novelpia-scraper\books`
- **TXT fixture**: create at the start of Task 6 (see that task for content).

Run a local static server throughout development to avoid CORS issues with `type=module`-style loads. The project doesn't actually use ES modules (it uses Babel standalone inline), so **opening `novel-reader.html` via `file://` works**, but for the File System Access API you need a secure context. **Use `python -m http.server 8080` from the project root** and visit `http://localhost:8080/novel-reader.html`.

---

## Task 1: Project bootstrap — HTML entry, shared CSS, app skeleton

**Files:**
- Create: `C:\dev\novel-reader\novel-reader.html`
- Create: `C:\dev\novel-reader\styles\shared.css`
- Create: `C:\dev\novel-reader\src\app.jsx`

- [ ] **Step 1: Create `novel-reader.html`**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8"/>
<title>Novel Reader</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="stylesheet" href="styles/shared.css"/>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" crossorigin="anonymous"></script>
<script src="https://unpkg.com/jszip@3.10.1/dist/jszip.min.js" crossorigin="anonymous"></script>
</head>
<body>
<div id="root"></div>
<script type="text/babel" src="src/storage/idb.js"></script>
<script type="text/babel" src="src/storage/roots.js"></script>
<script type="text/babel" src="src/storage/books.js"></script>
<script type="text/babel" src="src/storage/settings.js"></script>
<script type="text/babel" src="src/parsers/epub.js"></script>
<script type="text/babel" src="src/parsers/txt.js"></script>
<script type="text/babel" src="src/ui/cover.jsx"></script>
<script type="text/babel" src="src/ui/book-menu.jsx"></script>
<script type="text/babel" src="src/ui/toc-drawer.jsx"></script>
<script type="text/babel" src="src/ui/tweaks-panel.jsx"></script>
<script type="text/babel" src="src/ui/theme-switcher.jsx"></script>
<script type="text/babel" src="src/ui/color-picker.jsx"></script>
<script type="text/babel" src="src/themes/v1-warm.jsx"></script>
<script type="text/babel" src="src/themes/v4-glass.jsx"></script>
<script type="text/babel" src="src/themes/v5-dark.jsx"></script>
<script type="text/babel" src="src/library.jsx"></script>
<script type="text/babel" src="src/reader.jsx"></script>
<script type="text/babel" src="src/app.jsx"></script>
</body>
</html>
```

- [ ] **Step 2: Create `styles/shared.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700&family=Noto+Serif+TC:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --serif: "Noto Serif TC", "Source Han Serif TC", "Songti TC", serif;
  --sans: "Noto Sans TC", "PingFang TC", system-ui, sans-serif;
  --ui: "Inter", "Noto Sans TC", system-ui, sans-serif;
  --mono: ui-monospace, monospace;
}

html, body {
  margin: 0; padding: 0; height: 100%; overflow: hidden;
  background: #f0eee9;
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.nr-root, .nr-root * { box-sizing: border-box; }
.nr-root {
  width: 100%; height: 100%;
  line-height: 1.7; text-wrap: pretty;
}

.reading-body p {
  margin: 0 0 1em;
  text-indent: 2em;
  text-align: justify;
  text-justify: inter-ideograph;
}
.reading-body p:first-child { margin-top: 0; }

.scroll { overflow-y: auto; scrollbar-width: thin; }
.scroll-hidden::-webkit-scrollbar { display: none; }
.scroll-hidden { scrollbar-width: none; }
.scroll-thin::-webkit-scrollbar { width: 6px; }
.scroll-thin::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.25); border-radius: 3px; }
.scroll-thin::-webkit-scrollbar-track { background: transparent; }

.nr-root button { font-family: inherit; }
.nr-root button:focus { outline: none; }

.paper-tex {
  background-image:
    radial-gradient(circle at 20% 30%, rgba(139,100,60,0.03) 0, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(139,100,60,0.025) 0, transparent 50%),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.32  0 0 0 0 0.18  0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: auto, auto, 200px 200px;
}

.loading-screen {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--serif);
  color: #5a5147;
  font-size: 14px;
  letter-spacing: 0.3em;
}
```

- [ ] **Step 3: Create `src/app.jsx` skeleton**

```jsx
// src/app.jsx — top-level App with context + router
const AppContext = React.createContext(null);
window.AppContext = AppContext;

const initialState = {
  view: 'library',          // 'library' | 'reader'
  activeBookId: null,
  settings: null,           // loaded async
  books: [],                // loaded async
  roots: [],                // loaded async
  currentBook: null,        // hydrated when entering reader
  ready: false,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, ready: true };
    case 'SET_VIEW':
      return { ...state, view: action.view, activeBookId: action.bookId ?? null };
    case 'SET_SETTINGS':
      return { ...state, settings: action.settings };
    case 'SET_BOOKS':
      return { ...state, books: action.books };
    case 'SET_ROOTS':
      return { ...state, roots: action.roots };
    case 'SET_CURRENT_BOOK':
      return { ...state, currentBook: action.book };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const chapterCacheRef = React.useRef(new Map());

  React.useEffect(() => {
    (async () => {
      await idb.openDB();
      const [settings, roots, books] = await Promise.all([
        settingsStore.load(),
        rootsStore.list(),
        booksStore.list(),
      ]);
      dispatch({ type: 'HYDRATE', payload: { settings, roots, books } });
    })();
  }, []);

  if (!state.ready) {
    return <div className="loading-screen">N O V E L &nbsp; R E A D E R</div>;
  }

  const ctx = { state, dispatch, chapterCacheRef };
  return (
    <AppContext.Provider value={ctx}>
      {state.view === 'library' ? <Library/> : <Reader/>}
    </AppContext.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
```

Note: `Library`, `Reader`, `idb`, `settingsStore`, `rootsStore`, `booksStore` are placeholders filled in by later tasks. Add temporary stubs so the page renders:

```jsx
// At the bottom of app.jsx, ABOVE the ReactDOM.createRoot call, add stubs:
window.idb = window.idb || { openDB: async () => {} };
window.settingsStore = window.settingsStore || { load: async () => ({ activeTheme: 'v1' }) };
window.rootsStore = window.rootsStore || { list: async () => [] };
window.booksStore = window.booksStore || { list: async () => [] };
window.Library = window.Library || function Library() {
  return <div className="nr-root" style={{ padding: 40 }}>Library (stub)</div>;
};
window.Reader = window.Reader || function Reader() {
  return <div className="nr-root" style={{ padding: 40 }}>Reader (stub)</div>;
};
```

Remove each stub as its real implementation lands. Tasks below will delete them in-place.

- [ ] **Step 4: Manual verify**

Run: `cd C:\dev\novel-reader && python -m http.server 8080`
Open: `http://localhost:8080/novel-reader.html`
Expected: loading screen briefly → `Library (stub)` at top-left on beige background.

- [ ] **Step 5: Commit**

```bash
git add novel-reader.html styles/shared.css src/app.jsx
git commit -m "feat: project bootstrap with React/Babel/JSZip loader and app skeleton"
```

---

## Task 2: IndexedDB wrapper

**Files:**
- Create: `C:\dev\novel-reader\src\storage\idb.js`

- [ ] **Step 1: Write `idb.js`**

```js
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
```

- [ ] **Step 2: Remove the `window.idb` stub from `app.jsx`**

In `src/app.jsx`, find and delete:
```jsx
window.idb = window.idb || { openDB: async () => {} };
```

- [ ] **Step 3: Manual verify in browser console**

Open the app; in DevTools console run:
```js
await idb.openDB();
await idb.put('kv', { id: 'hello', value: 'world' });
console.log(await idb.get('kv', 'hello'));  // => {id:'hello', value:'world'}
console.log(await idb.list('kv'));           // => [{id:'hello', value:'world'}]
await idb.del('kv', 'hello');
console.log(await idb.list('kv'));           // => []
```

Also verify in DevTools → Application → IndexedDB → `novel-reader` that all four stores exist: `roots`, `books`, `settings`, `kv`.

- [ ] **Step 4: Commit**

```bash
git add src/storage/idb.js src/app.jsx
git commit -m "feat(storage): add IndexedDB wrapper with four object stores"
```

---

## Task 3: Domain storage modules (roots, books, settings)

**Files:**
- Create: `C:\dev\novel-reader\src\storage\roots.js`
- Create: `C:\dev\novel-reader\src\storage\books.js`
- Create: `C:\dev\novel-reader\src\storage\settings.js`

- [ ] **Step 1: Write `roots.js`**

```js
// src/storage/roots.js — roots CRUD + permission helpers
(function () {
  function uuid() { return crypto.randomUUID(); }

  async function add({ name, dirHandle }) {
    const root = {
      id: uuid(),
      name,
      dirHandle,
      addedAt: Date.now(),
      lastScannedAt: null,
      bookCount: 0,
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
```

- [ ] **Step 2: Write `books.js`**

```js
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
```

- [ ] **Step 3: Write `settings.js`**

```js
// src/storage/settings.js — settings with defaults
(function () {
  const DEFAULTS = {
    id: 'global',
    activeTheme: 'v1',
    themeColors: {
      v1: { accent: '#8C3A2E', paperTone: '#EDE4D2' },
      v4: { accent: '#AD4E3B', gradient: 'dawn' },
      v5: { accent: '#C9A86B', bgTone: 'mogreen' },
    },
    tweaks: { fontSize: 17, lineHeight: 1.9, font: 'sans', texture: true },
    preserveOriginalCssDefault: false,
    sortBy: 'lastRead',
    sortOrder: 'desc',
    filterTag: null,
    filterCollection: null,
    filterStatus: 'all',
  };

  function mergeDeep(base, patch) {
    if (!patch || typeof patch !== 'object') return base;
    const out = { ...base };
    for (const k of Object.keys(patch)) {
      if (patch[k] && typeof patch[k] === 'object' && !Array.isArray(patch[k]) && base[k] && typeof base[k] === 'object') {
        out[k] = mergeDeep(base[k], patch[k]);
      } else {
        out[k] = patch[k];
      }
    }
    return out;
  }

  async function load() {
    const stored = await idb.get('settings', 'global');
    return mergeDeep(DEFAULTS, stored || {});
  }

  async function save(patch) {
    const current = await load();
    const merged = mergeDeep(current, patch);
    merged.id = 'global';
    await idb.put('settings', merged);
    return merged;
  }

  window.settingsStore = { load, save, DEFAULTS };
})();
```

- [ ] **Step 4: Remove storage stubs from `app.jsx`**

In `src/app.jsx`, find and delete:
```jsx
window.settingsStore = window.settingsStore || { load: async () => ({ activeTheme: 'v1' }) };
window.rootsStore = window.rootsStore || { list: async () => [] };
window.booksStore = window.booksStore || { list: async () => [] };
```

- [ ] **Step 5: Manual verify in browser console**

```js
// Settings
const s1 = await settingsStore.load();
console.log(s1);  // => defaults (activeTheme:'v1' etc.)
await settingsStore.save({ activeTheme: 'v4', themeColors: { v4: { accent: '#FF0000' } } });
const s2 = await settingsStore.load();
console.log(s2.activeTheme, s2.themeColors.v4.accent);  // => 'v4' '#FF0000'

// Books
const b = await booksStore.add({ title: 'Test', author: 'Me', sourceType: 'txt' });
console.log(b.id, b.status);  // => <uuid> 'unread'
await booksStore.addTag(b.id, 'test-tag');
const b2 = await booksStore.get(b.id);
console.log(b2.tags);  // => ['test-tag']
await booksStore.remove(b.id);

// Reset settings to defaults for next task
await idb.clear('settings');
```

- [ ] **Step 6: Commit**

```bash
git add src/storage/ src/app.jsx
git commit -m "feat(storage): add roots, books, settings domain modules"
```

---

## Task 4: EPUB parser — metadata, TOC, cover

**Files:**
- Create: `C:\dev\novel-reader\src\parsers\epub.js`

- [ ] **Step 1: Write `epub.js` (metadata + TOC + cover only)**

```js
// src/parsers/epub.js — JSZip-based EPUB parser
(function () {

  // --- helpers ---
  function parseXML(text) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('XML parse error');
    return doc;
  }
  function joinPath(base, rel) {
    // base: 'OEBPS/content.opf', rel: 'Text/Chapter1.xhtml'
    const baseDir = base.includes('/') ? base.slice(0, base.lastIndexOf('/')) : '';
    if (!baseDir) return rel.replace(/^\//, '');
    const parts = (baseDir + '/' + rel).split('/');
    const out = [];
    for (const p of parts) {
      if (p === '' || p === '.') continue;
      if (p === '..') out.pop();
      else out.push(p);
    }
    return out.join('/');
  }
  function firstTextByTag(el, local) {
    const n = el.getElementsByTagName(local);
    return n.length ? (n[0].textContent || '').trim() : null;
  }

  async function parseMetadata(fileOrBlob) {
    const zip = await JSZip.loadAsync(fileOrBlob);

    // 1. find OPF via container.xml
    const containerXml = await zip.file('META-INF/container.xml').async('text');
    const containerDoc = parseXML(containerXml);
    const opfPath = containerDoc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
    const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/')) : '';

    // 2. parse OPF
    const opfXml = await zip.file(opfPath).async('text');
    const opf = parseXML(opfXml);

    // metadata
    const metaEl = opf.getElementsByTagName('metadata')[0];
    const title = firstTextByTag(metaEl, 'dc:title') || firstTextByTag(metaEl, 'title') || 'Untitled';
    const author = firstTextByTag(metaEl, 'dc:creator') || firstTextByTag(metaEl, 'creator');
    const publisher = firstTextByTag(metaEl, 'dc:publisher') || firstTextByTag(metaEl, 'publisher');
    const description = firstTextByTag(metaEl, 'dc:description') || firstTextByTag(metaEl, 'description');

    // manifest: id → {href, mediaType, properties}
    const manifestItems = opf.getElementsByTagName('manifest')[0].getElementsByTagName('item');
    const manifest = {};
    for (const item of manifestItems) {
      manifest[item.getAttribute('id')] = {
        href: item.getAttribute('href'),
        mediaType: item.getAttribute('media-type'),
        properties: item.getAttribute('properties') || '',
      };
    }

    // spine
    const spineItems = opf.getElementsByTagName('spine')[0].getElementsByTagName('itemref');
    const spine = [];
    for (const it of spineItems) {
      const idref = it.getAttribute('idref');
      if (manifest[idref]) spine.push({ idref, href: manifest[idref].href });
    }

    // cover
    let coverBlob = null;
    let coverId = null;
    const metaTags = metaEl.getElementsByTagName('meta');
    for (const m of metaTags) {
      if (m.getAttribute('name') === 'cover') coverId = m.getAttribute('content');
    }
    if (!coverId) {
      for (const [id, item] of Object.entries(manifest)) {
        if ((item.properties || '').includes('cover-image')) { coverId = id; break; }
      }
    }
    if (coverId && manifest[coverId]) {
      const coverPath = joinPath(opfPath, manifest[coverId].href);
      const entry = zip.file(coverPath);
      if (entry) coverBlob = await entry.async('blob');
    }

    // TOC
    const chaptersMeta = await parseTOC(zip, opf, opfPath, manifest, spine);

    return {
      title, author, publisher, description,
      coverBlob,
      chaptersMeta,
      // opaque stuff the chapter-getter needs later:
      _internal: { opfPath, opfDir, manifest, spine, zip: null /* zip not retained; re-open per call */ },
    };
  }

  async function parseTOC(zip, opf, opfPath, manifest, spine) {
    // Prefer EPUB 3 nav
    let navId = null;
    for (const [id, item] of Object.entries(manifest)) {
      if ((item.properties || '').includes('nav')) { navId = id; break; }
    }
    if (navId) {
      const navPath = joinPath(opfPath, manifest[navId].href);
      const navHtml = await zip.file(navPath).async('text');
      const navDoc = new DOMParser().parseFromString(navHtml, 'text/html');
      const tocNav = navDoc.querySelector('nav[*|type="toc"], nav[epub\\:type="toc"], nav[type="toc"], nav');
      if (tocNav) {
        const links = tocNav.querySelectorAll('a[href]');
        const items = [];
        for (const a of links) {
          const href = a.getAttribute('href');
          const title = a.textContent.trim();
          const absHref = joinPath(navPath, href.split('#')[0]);
          items.push({ id: `toc-${items.length}`, title, href: absHref });
        }
        if (items.length) return items;
      }
    }

    // Fallback NCX
    const ncxRef = opf.getElementsByTagName('spine')[0].getAttribute('toc');
    if (ncxRef && manifest[ncxRef]) {
      const ncxPath = joinPath(opfPath, manifest[ncxRef].href);
      const ncxXml = await zip.file(ncxPath).async('text');
      const ncx = parseXML(ncxXml);
      const navPoints = ncx.getElementsByTagName('navPoint');
      const items = [];
      for (const np of navPoints) {
        const labelEl = np.getElementsByTagName('text')[0];
        const contentEl = np.getElementsByTagName('content')[0];
        if (!labelEl || !contentEl) continue;
        const absHref = joinPath(ncxPath, contentEl.getAttribute('src').split('#')[0]);
        items.push({ id: `toc-${items.length}`, title: (labelEl.textContent || '').trim(), href: absHref });
      }
      if (items.length) return items;
    }

    // Final fallback: infer from spine
    return spine.map((s, i) => ({
      id: `spine-${i}`,
      title: `Chapter ${i + 1}`,
      href: joinPath(opfPath, s.href),
    }));
  }

  window.epubParser = { parseMetadata };
})();
```

- [ ] **Step 2: Manual verify in browser console**

Open the app; in console:
```js
// load a file via picker since fetch() can't reach outside the server
const [fh] = await showOpenFilePicker({ types: [{ description: 'EPUB', accept: { 'application/epub+zip': ['.epub'] } }] });
// Pick C:\dev\esjzone-scraper\books\1543764675(迷宮防守)\zh-TW\迷宮防守.epub
const f = await fh.getFile();
const meta = await epubParser.parseMetadata(f);
console.log({
  title: meta.title,
  author: meta.author,
  hasCover: !!meta.coverBlob,
  chapters: meta.chaptersMeta.length,
  firstChapter: meta.chaptersMeta[0],
});
// Expected: title="迷宮防守", author set, hasCover=true, chapters > 0
if (meta.coverBlob) {
  const url = URL.createObjectURL(meta.coverBlob);
  console.log('Cover URL (open in new tab):', url);
}
```

Repeat with a novelpia EPUB and a Korean-title EPUB to confirm non-ASCII works.

- [ ] **Step 3: Commit**

```bash
git add src/parsers/epub.js
git commit -m "feat(parser): EPUB metadata, TOC, and cover extraction"
```

---

## Task 5: EPUB parser — chapter rendering with sanitization

**Files:**
- Modify: `C:\dev\novel-reader\src\parsers\epub.js`

- [ ] **Step 1: Add `getChapter` and the CSS scoper**

Append this inside the IIFE in `src/parsers/epub.js`, BEFORE the `window.epubParser = …` line. Replace the existing `window.epubParser = { parseMetadata };` with the extended version at the end.

```js
  // --- sanitization ---
  const ALLOWED_TAGS = new Set([
    'P','BR','HR','H1','H2','H3','H4','H5','H6','STRONG','B','EM','I',
    'U','S','SMALL','SUP','SUB','BLOCKQUOTE','UL','OL','LI','DL','DT','DD',
    'IMG','FIGURE','FIGCAPTION','SECTION','ARTICLE','DIV','SPAN','A','TABLE',
    'THEAD','TBODY','TR','TH','TD','PRE','CODE',
  ]);
  const ALLOWED_ATTRS = new Set(['href','src','alt','title','width','height','class','id']);
  const STYLE_ATTR = 'style';
  const URL_ATTRS = new Set(['href','src']);

  function safeUrl(value) {
    if (!value) return '';
    const v = String(value).trim();
    if (/^javascript:/i.test(v)) return '';
    if (/^data:(?!image\/)/i.test(v)) return '';  // allow data:image/*
    return v;
  }

  function sanitizeNode(node, { preserveCss, blobUrlMap, chapterDir }) {
    // remove disallowed element
    if (node.nodeType === 1) {
      const tag = node.tagName;
      if (tag === 'SCRIPT' || tag === 'IFRAME' || tag === 'OBJECT' || tag === 'EMBED') {
        node.remove(); return;
      }
      if (!preserveCss && (tag === 'STYLE' || tag === 'LINK')) { node.remove(); return; }
      if (!ALLOWED_TAGS.has(tag) && tag !== 'STYLE') {
        // unwrap: replace with children
        const parent = node.parentNode;
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        parent.removeChild(node);
        return;
      }
      // strip unsafe attrs
      for (const attr of Array.from(node.attributes)) {
        const n = attr.name.toLowerCase();
        if (n.startsWith('on')) { node.removeAttribute(attr.name); continue; }
        if (n === STYLE_ATTR) {
          if (!preserveCss) node.removeAttribute(attr.name);
          continue;
        }
        if (!ALLOWED_ATTRS.has(n)) { node.removeAttribute(attr.name); continue; }
        if (URL_ATTRS.has(n)) {
          const v = safeUrl(attr.value);
          if (!v) { node.removeAttribute(attr.name); continue; }
          if (n === 'src' && tag === 'IMG') {
            // rewrite to blob URL if in zip
            const resolved = joinPath(chapterDir + '/_', v);  // +/_ so the helper treats chapterDir as file
            if (blobUrlMap[resolved]) node.setAttribute('src', blobUrlMap[resolved]);
            else node.setAttribute('src', '');
          }
          if (n === 'href' && tag === 'A') {
            if (/^(https?:)?\/\//i.test(v)) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          }
        }
      }
    }
    for (const child of Array.from(node.childNodes)) sanitizeNode(child, { preserveCss, blobUrlMap, chapterDir });
  }

  function scopeCss(cssText, scopeSelector) {
    // naive CSS scoper: prefix every rule selector with scopeSelector.
    // handles single-level @media by recursing inside block.
    function scopeBlock(block) {
      let out = '';
      let i = 0;
      while (i < block.length) {
        // skip whitespace
        while (i < block.length && /\s/.test(block[i])) { out += block[i]; i++; }
        if (i >= block.length) break;
        // @rules
        if (block[i] === '@') {
          const semi = block.indexOf(';', i);
          const brace = block.indexOf('{', i);
          if (semi !== -1 && (brace === -1 || semi < brace)) {
            out += block.slice(i, semi + 1); i = semi + 1; continue;
          }
          // @media / @supports → recurse
          const close = matchBrace(block, brace);
          const head = block.slice(i, brace + 1);
          const body = block.slice(brace + 1, close);
          out += head + scopeBlock(body) + '}';
          i = close + 1; continue;
        }
        const brace = block.indexOf('{', i);
        if (brace === -1) { out += block.slice(i); break; }
        const close = matchBrace(block, brace);
        const selectors = block.slice(i, brace).trim();
        const body = block.slice(brace + 1, close);
        const scoped = selectors.split(',').map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `${scopeSelector} ${s}`)
          .join(', ');
        out += `${scoped} {${body}}`;
        i = close + 1;
      }
      return out;
    }
    function matchBrace(s, start) {
      let depth = 0;
      for (let i = start; i < s.length; i++) {
        if (s[i] === '{') depth++;
        else if (s[i] === '}') { depth--; if (depth === 0) return i; }
      }
      return s.length - 1;
    }
    return scopeBlock(cssText);
  }

  async function getChapter(fileOrBlob, parsed, chapterId, opts = {}) {
    const zip = await JSZip.loadAsync(fileOrBlob);
    const meta = parsed.chaptersMeta.find((c) => c.id === chapterId);
    if (!meta) throw new Error(`Chapter not found: ${chapterId}`);

    const xhtmlRaw = await zip.file(meta.href).async('text');
    const doc = new DOMParser().parseFromString(xhtmlRaw, 'text/html');
    const body = doc.body || doc.documentElement;

    // build blob URL map for all images referenced in this chapter
    const blobUrlMap = {};
    const chapterDir = meta.href.includes('/') ? meta.href.slice(0, meta.href.lastIndexOf('/')) : '';
    const imgs = body.querySelectorAll('img[src]');
    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (!src || /^(https?:|data:)/i.test(src)) continue;
      const resolved = joinPath(chapterDir + '/_', src);
      const entry = zip.file(resolved);
      if (entry) {
        const blob = await entry.async('blob');
        blobUrlMap[resolved] = URL.createObjectURL(blob);
      }
    }

    // sanitize
    sanitizeNode(body, {
      preserveCss: !!opts.preserveCss,
      blobUrlMap,
      chapterDir,
    });

    // if preserveCss, gather and scope <style> + <link> content
    let extraCss = '';
    if (opts.preserveCss) {
      const styles = body.querySelectorAll('style');
      for (const s of styles) { extraCss += scopeCss(s.textContent || '', '.nr-reading-scope'); s.remove(); }
      const links = body.querySelectorAll('link[rel="stylesheet"][href]');
      for (const l of links) {
        const href = l.getAttribute('href');
        const resolved = joinPath(chapterDir + '/_', href);
        const entry = zip.file(resolved);
        if (entry) {
          const cssText = await entry.async('text');
          extraCss += scopeCss(cssText, '.nr-reading-scope');
        }
        l.remove();
      }
    }

    return { html: body.innerHTML, extraCss, blobUrls: Object.values(blobUrlMap) };
  }
```

Then at the very end of the IIFE:
```js
  window.epubParser = { parseMetadata, getChapter };
```

- [ ] **Step 2: Manual verify in browser console**

```js
const [fh] = await showOpenFilePicker({ types:[{description:'EPUB',accept:{'application/epub+zip':['.epub']}}] });
const f = await fh.getFile();
const meta = await epubParser.parseMetadata(f);
const { html, extraCss } = await epubParser.getChapter(f, meta, meta.chaptersMeta[0].id);
console.log('Extracted HTML length:', html.length);
console.log('First 500 chars:', html.slice(0, 500));
console.log('No <script>:', !/<script/i.test(html));
console.log('Inline styles stripped:', !/style=/i.test(html));

// Preserve mode:
const preserved = await epubParser.getChapter(f, meta, meta.chaptersMeta[0].id, { preserveCss: true });
console.log('With CSS, scoped:', preserved.extraCss.slice(0, 300));
```

Expected: HTML contains `<p>`, `<h1>` etc., no `<script>`, no `style=` attribute in default mode. Preserve mode returns scoped CSS starting with `.nr-reading-scope ...`.

- [ ] **Step 3: Commit**

```bash
git add src/parsers/epub.js
git commit -m "feat(parser): EPUB chapter rendering with sanitization and CSS scoping"
```

---

## Task 6: TXT parser

**Files:**
- Create: `C:\dev\novel-reader\src\parsers\txt.js`
- Create (fixture): `C:\dev\novel-reader\fixtures\sample.txt`

- [ ] **Step 1: Create a TXT fixture for testing**

Create `C:\dev\novel-reader\fixtures\sample.txt` with UTF-8 encoding:

```
測試小說 - 測試作者

第一章　開端

這是第一章的內容。測試用的短文字。

第二行，仍是第一章。

第二章　中途

第二章開始。再多一段。

另一段文字。

第三章　結局

最後一章。
```

Also create an empty gitignored folder to hold private test samples:
```bash
mkdir C:\dev\novel-reader\fixtures
```

- [ ] **Step 2: Write `txt.js`**

```js
// src/parsers/txt.js — TXT novel parser
(function () {
  const CHAPTER_RE = /^[ \t]*第[一二三四五六七八九十百千零〇0-9]+[章回節卷部篇][ \t]*.*$/mu;
  const CHAPTER_RE_GLOBAL = new RegExp(CHAPTER_RE.source, 'gmu');

  function detectAndDecode(buffer) {
    // UTF-8 BOM
    const bytes = new Uint8Array(buffer);
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
      return new TextDecoder('utf-8').decode(buffer.slice(3));
    }
    // Try UTF-8 strict
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Try Big5
    try {
      return new TextDecoder('big5', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Try GB18030
    try {
      return new TextDecoder('gb18030', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Last-resort: UTF-8 replacement mode (will produce � but readable)
    return new TextDecoder('utf-8').decode(buffer);
  }

  function guessTitleAuthor(filename, firstLine) {
    // "書名 - 作者.txt" or "【作者】書名.txt"
    const base = filename.replace(/\.[^.]+$/, '');
    let m = base.match(/^(.+?)\s*[-－─]\s*(.+)$/);
    if (m) return { title: m[1].trim(), author: m[2].trim() };
    m = base.match(/^[【\[](.+?)[】\]]\s*(.+)$/);
    if (m) return { title: m[2].trim(), author: m[1].trim() };
    // Fallback to filename + optional first-line hint
    return { title: base, author: null };
  }

  function splitChapters(text) {
    const headings = [];
    let m;
    while ((m = CHAPTER_RE_GLOBAL.exec(text)) !== null) {
      headings.push({ title: m[0].trim(), index: m.index, end: m.index + m[0].length });
    }
    if (headings.length < 2) {
      return [{ id: 'txt-0', title: '正文', text: text.trim() }];
    }
    const chapters = [];
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].end;
      const stop = i + 1 < headings.length ? headings[i + 1].index : text.length;
      chapters.push({
        id: `txt-${i}`,
        title: headings[i].title,
        text: text.slice(start, stop).trim(),
      });
    }
    return chapters;
  }

  async function parseMetadata(file) {
    const buffer = await file.arrayBuffer();
    const text = detectAndDecode(buffer);
    const { title, author } = guessTitleAuthor(file.name, text.split(/\r?\n/, 1)[0]);
    const chapters = splitChapters(text);
    const chaptersMeta = chapters.map((c) => ({ id: c.id, title: c.title, wordCount: c.text.length }));
    // Retain full chapter text in a parse result (consumed by getChapter).
    return { title, author, coverBlob: null, chaptersMeta, _internal: { chapters } };
  }

  async function getChapter(_file, parsed, chapterId) {
    const chap = parsed._internal.chapters.find((c) => c.id === chapterId);
    if (!chap) throw new Error(`Chapter not found: ${chapterId}`);
    const paragraphs = chap.text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    const html = paragraphs.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
    return { html, extraCss: '', blobUrls: [] };
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  window.txtParser = { parseMetadata, getChapter };
})();
```

- [ ] **Step 3: Append `fixtures/` to `.gitignore`**

Append to `.gitignore`:
```
fixtures/
```

(We want the sample to exist locally but not in the repo — many users will drop their own files into `fixtures/` to test.)

- [ ] **Step 4: Manual verify in browser console**

```js
// Grab the fixture via picker (or via fetch since it's served)
const res = await fetch('fixtures/sample.txt');
const blob = await res.blob();
const file = new File([blob], 'sample.txt');
const meta = await txtParser.parseMetadata(file);
console.log(meta.title, meta.author, meta.chaptersMeta);
// Expected: title=..., 3 chapters

const ch = await txtParser.getChapter(file, meta, meta.chaptersMeta[1].id);
console.log(ch.html);
// Expected: <p>第二章開始...</p><p>另一段文字。</p>
```

Then test with a real Big5-encoded or UTF-8 novel TXT if you have one. The fixture must load without errors.

- [ ] **Step 5: Commit**

```bash
git add src/parsers/txt.js .gitignore
git commit -m "feat(parser): TXT novel parser with encoding detection and chapter split"
```

---

## Task 7: Library shell + sidebar layout

**Files:**
- Create: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Write `library.jsx` with sidebar + empty state**

```jsx
// src/library.jsx — library view: sidebar + grid
function Library() {
  const { state, dispatch } = React.useContext(AppContext);
  const { books, roots, settings } = state;

  const tags = React.useMemo(() => booksStore.allTags(books), [books]);
  const collections = React.useMemo(() => booksStore.allCollections(books), [books]);

  const filtered = React.useMemo(() => filterBooks(books, settings), [books, settings]);

  const hasLibrary = roots.length > 0 || books.length > 0;

  return (
    <div className="nr-root" style={{
      display: 'grid', gridTemplateColumns: '240px 1fr', height: '100vh',
      background: '#F7F5F0', color: '#2B241B',
    }}>
      <LibrarySidebar
        settings={settings}
        tags={tags}
        collections={collections}
        roots={roots}
        books={books}
        dispatch={dispatch}
      />
      <main style={{ overflow: 'auto', padding: '32px 40px' }} className="scroll-thin">
        <LibraryTopbar settings={settings} dispatch={dispatch}/>
        {!hasLibrary ? (
          <LibraryEmpty dispatch={dispatch}/>
        ) : (
          <BookGrid books={filtered} dispatch={dispatch}/>
        )}
      </main>
    </div>
  );
}
window.Library = Library;

function filterBooks(books, settings) {
  let out = books;
  if (settings.filterStatus && settings.filterStatus !== 'all') {
    out = out.filter((b) => b.status === settings.filterStatus);
  }
  if (settings.filterTag) {
    out = out.filter((b) => b.tags.includes(settings.filterTag));
  }
  if (settings.filterCollection) {
    out = out.filter((b) => b.collections.includes(settings.filterCollection));
  }
  // Sort (Task 12 extends this)
  const order = settings.sortOrder === 'asc' ? 1 : -1;
  out = [...out].sort((a, b) => {
    switch (settings.sortBy) {
      case 'title': return a.title.localeCompare(b.title) * order;
      case 'author': return (a.author || '').localeCompare(b.author || '') * order;
      case 'addedAt': return (a.addedAt - b.addedAt) * order;
      case 'lastRead':
      default:
        return ((b.lastReadAt || b.addedAt) - (a.lastReadAt || a.addedAt)) * order;
    }
  });
  return out;
}

function LibrarySidebar({ settings, tags, collections, roots, books, dispatch }) {
  const sec = { fontSize: 10, letterSpacing: '0.2em', color: 'rgba(43,36,27,0.5)', textTransform: 'uppercase', fontWeight: 600, margin: '18px 0 8px' };
  const item = (active) => ({
    padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 13,
    background: active ? 'rgba(43,36,27,0.08)' : 'transparent',
    fontWeight: active ? 600 : 400,
  });

  async function setFilter(patch) {
    const next = await settingsStore.save(patch);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }

  const statusOptions = [
    { key: 'all', label: '全部' },
    { key: 'reading', label: '正在讀' },
    { key: 'finished', label: '已讀完' },
    { key: 'unread', label: '未開始' },
  ];

  return (
    <aside style={{
      borderRight: '0.5px solid rgba(0,0,0,0.08)',
      background: '#EFEBE2', padding: '24px 16px',
      overflowY: 'auto',
    }} className="scroll-thin">
      <div style={{ fontFamily: 'var(--serif)', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Novel Reader</div>
      <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.5)', marginBottom: 18 }}>{books.length} 本書</div>

      <div style={sec}>狀態</div>
      {statusOptions.map((o) => (
        <div key={o.key} style={item(settings.filterStatus === o.key)}
          onClick={() => setFilter({ filterStatus: o.key })}>
          {o.label}
        </div>
      ))}

      {tags.length > 0 && <>
        <div style={sec}>Tags</div>
        {tags.map((t) => (
          <div key={t} style={item(settings.filterTag === t)}
            onClick={() => setFilter({ filterTag: settings.filterTag === t ? null : t })}>
            # {t}
          </div>
        ))}
      </>}

      {collections.length > 0 && <>
        <div style={sec}>Collections</div>
        {collections.map((c) => (
          <div key={c} style={item(settings.filterCollection === c)}
            onClick={() => setFilter({ filterCollection: settings.filterCollection === c ? null : c })}>
            📁 {c}
          </div>
        ))}
      </>}

      <div style={sec}>根目錄</div>
      {roots.map((r) => (
        <div key={r.id} style={{ ...item(false), display: 'flex', alignItems: 'center', gap: 6 }} title={r.name}>
          <span>📂</span>
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</span>
          <span style={{ fontSize: 10, color: 'rgba(43,36,27,0.4)' }}>{r.bookCount}</span>
        </div>
      ))}
    </aside>
  );
}

function LibraryTopbar({ settings, dispatch }) {
  // Search + sort + "+ Root" / "+ File" buttons
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <input placeholder="搜尋書名 / 作者 / tag" style={{
        flex: 1, padding: '8px 14px', border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff',
      }} disabled title="TODO Task 12"/>
      <button style={btnStyle()} disabled title="TODO Task 9">＋ 加根目錄</button>
      <button style={btnStyle()} disabled title="TODO Task 10">＋ 加單檔</button>
    </div>
  );
}

function LibraryEmpty({ dispatch }) {
  return (
    <div style={{
      textAlign: 'center', padding: '80px 0',
      color: 'rgba(43,36,27,0.6)', fontFamily: 'var(--serif)',
    }}>
      <div style={{ fontSize: 28, marginBottom: 14, letterSpacing: '0.2em' }}>書架空無一物</div>
      <div style={{ fontSize: 13, lineHeight: 2 }}>
        點右上「加根目錄」掃描資料夾，或「加單檔」載入一本 EPUB / TXT。
      </div>
    </div>
  );
}

function BookGrid({ books, dispatch }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 28,
    }}>
      {books.map((b) => (
        <div key={b.id} style={{ cursor: 'pointer' }} onClick={() => openBook(b.id, dispatch)}>
          <div style={{
            width: '100%', aspectRatio: '3 / 4',
            background: b.accent || '#8C3A2E',
            borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex', alignItems: 'flex-end', padding: 10, color: '#F5EDE0',
            fontFamily: 'var(--serif)', fontSize: 14,
            writingMode: 'vertical-rl', textOrientation: 'upright',
            letterSpacing: '0.15em',
          }}>{b.title}</div>
          <div style={{ fontSize: 12, fontWeight: 500, marginTop: 10 }}>{b.title}</div>
          <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.55)' }}>{b.author || '—'}</div>
          <div style={{
            marginTop: 6, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              width: `${Math.max(0, Math.min(1, (b.lastChapterId && b.chaptersMeta.length) ? (b.chaptersMeta.findIndex((c) => c.id === b.lastChapterId) + (b.lastScroll || 0)) / b.chaptersMeta.length : 0)) * 100}%`,
              background: b.accent || '#8C3A2E',
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function btnStyle() {
  return {
    padding: '8px 14px', background: '#fff',
    border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 8,
    fontSize: 13, fontFamily: 'inherit', cursor: 'pointer',
  };
}

async function openBook(bookId, dispatch) {
  dispatch({ type: 'SET_VIEW', view: 'reader', bookId });
}
```

- [ ] **Step 2: Remove the `Library` stub from `app.jsx`**

In `src/app.jsx`, find and delete:
```jsx
window.Library = window.Library || function Library() {
  return <div className="nr-root" style={{ padding: 40 }}>Library (stub)</div>;
};
```

- [ ] **Step 3: Manual verify**

Reload. Expected: sidebar on left with "Novel Reader", "0 本書", status section showing "全部/正在讀/已讀完/未開始", "根目錄" section empty. Main area shows "書架空無一物" empty state. Clicking a status option updates the highlight and persists (reload to verify persistence).

- [ ] **Step 4: Commit**

```bash
git add src/library.jsx src/app.jsx
git commit -m "feat(library): sidebar, topbar stub, empty state, book grid skeleton"
```

---

## Task 8: Cover component + polished book card

**Files:**
- Create: `C:\dev\novel-reader\src\ui\cover.jsx`
- Modify: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Write `cover.jsx`**

```jsx
// src/ui/cover.jsx — spine-style vertical-title cover
function Cover({ book, size = 'md' }) {
  const dims = size === 'lg' ? { w: 120, h: 160 } : size === 'sm' ? { w: 44, h: 60 } : { w: 90, h: 120 };
  const [imgUrl, setImgUrl] = React.useState(null);

  React.useEffect(() => {
    let revoke = null;
    if (book.coverBlob) {
      const u = URL.createObjectURL(book.coverBlob);
      setImgUrl(u);
      revoke = u;
    } else {
      setImgUrl(null);
    }
    return () => { if (revoke) URL.revokeObjectURL(revoke); };
  }, [book.coverBlob]);

  if (imgUrl) {
    return (
      <img src={imgUrl} alt={book.title} style={{
        width: dims.w, height: dims.h, objectFit: 'cover',
        borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'block',
      }}/>
    );
  }

  // Fallback: color-block cover with vertical title
  const titleSize = Math.max(10, dims.w * 0.18);
  return (
    <div style={{
      width: dims.w, height: dims.h,
      background: book.accent || '#8C3A2E',
      borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: 10, color: '#F5EDE0', fontFamily: 'var(--serif)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ fontSize: 7, letterSpacing: '0.2em', opacity: 0.65, fontFamily: 'var(--ui)' }}>CLASSIC</div>
      <div style={{
        writingMode: 'vertical-rl', textOrientation: 'upright',
        letterSpacing: '0.12em', fontWeight: 500,
        alignSelf: 'flex-end', lineHeight: 1.1,
        fontSize: titleSize,
      }}>{book.title}</div>
      <div style={{ fontSize: 6.5, letterSpacing: '0.2em', opacity: 0.7, fontFamily: 'var(--ui)' }}>{book.author || ''}</div>
      <div style={{
        content: '', position: 'absolute', inset: 5,
        border: '0.5px solid rgba(245,237,224,0.3)', pointerEvents: 'none',
      }}/>
    </div>
  );
}
window.Cover = Cover;
```

- [ ] **Step 2: Replace `BookGrid` in `library.jsx` to use `Cover`**

Find the `BookGrid` function in `src/library.jsx` and replace its body:

```jsx
function BookGrid({ books, dispatch }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: 28,
    }}>
      {books.map((b) => <BookCard key={b.id} book={b} dispatch={dispatch}/>)}
    </div>
  );
}

function BookCard({ book, dispatch }) {
  const [hover, setHover] = React.useState(false);
  const idx = book.chaptersMeta.length && book.lastChapterId
    ? Math.max(0, book.chaptersMeta.findIndex((c) => c.id === book.lastChapterId))
    : 0;
  const progress = book.chaptersMeta.length
    ? (idx + (book.lastScroll || 0)) / book.chaptersMeta.length
    : 0;
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => openBook(book.id, dispatch)}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Cover book={book}/>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{book.title}</div>
      <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.55)', marginTop: 2 }}>{book.author || '—'}</div>
      <div style={{
        marginTop: 6, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden',
      }}>
        <div style={{
          width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
          height: '100%', background: book.accent || '#8C3A2E',
        }}/>
      </div>
      {book.tags.length > 0 && hover && (
        <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
          {book.tags.slice(0, 4).map((t) => (
            <span key={t} style={{
              fontSize: 9, padding: '2px 6px', borderRadius: 3,
              background: 'rgba(0,0,0,0.06)', color: 'rgba(43,36,27,0.7)',
            }}># {t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Manual verify**

In the console, seed a book with a fake cover blob:
```js
const fakeSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='400'><rect fill='#C9A86B' width='100%' height='100%'/><text x='50%' y='50%' font-size='28' fill='#13201C' text-anchor='middle' dy='0.35em'>測試</text></svg>`;
const blob = new Blob([fakeSvg], { type: 'image/svg+xml' });
await booksStore.add({ title: '測試封面', author: '我', coverBlob: blob, accent: '#C9A86B', chaptersMeta: [{id:'c1',title:'Ch1'}] });
await booksStore.add({ title: '無封面書', author: '別人', accent: '#3B5A6B', chaptersMeta: [{id:'c1',title:'Ch1'}] });
location.reload();
```

Expected: two cards in the grid, one showing the SVG cover, one showing the color-block with vertical title.

Clean up:
```js
for (const b of await booksStore.list()) await booksStore.remove(b.id);
location.reload();
```

- [ ] **Step 4: Commit**

```bash
git add src/ui/cover.jsx src/library.jsx
git commit -m "feat(library): polished book cards with cover blob support and hover tags"
```

---

## Task 9: Add root folder flow — picker, recursive scan, metadata extraction

**Files:**
- Modify: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Add the "+ Root" handler and recursive scan in `library.jsx`**

Replace `LibraryTopbar` and add the scan function at the bottom of `src/library.jsx`:

```jsx
function LibraryTopbar({ settings, dispatch }) {
  const [busy, setBusy] = React.useState(null);   // { current, total, name } | null
  const supported = 'showDirectoryPicker' in window;

  async function addRoot() {
    if (!supported) return;
    let dirHandle;
    try { dirHandle = await window.showDirectoryPicker(); }
    catch (_) { return; }
    const granted = await rootsStore.ensurePermission(dirHandle, 'read');
    if (!granted) { alert('需要讀取權限'); return; }
    const root = await rootsStore.add({ name: dirHandle.name, dirHandle });
    await scanRoot(root, setBusy, dispatch);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <input placeholder="搜尋書名 / 作者 / tag" style={{
        flex: 1, padding: '8px 14px', border: '0.5px solid rgba(0,0,0,0.1)',
        borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff',
      }} disabled title="TODO Task 12"/>
      {supported && <button style={btnStyle()} onClick={addRoot}>＋ 加根目錄</button>}
      <button style={btnStyle()} disabled title="TODO Task 10">＋ 加單檔</button>
      {busy && <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.6)' }}>
        掃描中 {busy.current}/{busy.total}: {busy.name.slice(0, 30)}…
      </div>}
    </div>
  );
}

async function scanRoot(root, setBusy, dispatch) {
  // 1) enumerate all .epub files recursively
  const files = [];
  async function walk(dirHandle, path) {
    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'directory') {
        await walk(handle, path + name + '/');
      } else if (name.toLowerCase().endsWith('.epub')) {
        files.push({ handle, relPath: path + name });
      }
    }
  }
  setBusy({ current: 0, total: 0, name: root.name });
  await walk(root.dirHandle, '');

  // 2) parse metadata per file
  const existing = await booksStore.list();
  const existingPaths = new Set(existing.filter((b) => b.rootId === root.id).map((b) => b.relPath));
  let done = 0;
  for (const { handle, relPath } of files) {
    done++;
    setBusy({ current: done, total: files.length, name: relPath });
    if (existingPaths.has(relPath)) continue;       // already indexed
    try {
      const f = await handle.getFile();
      const meta = await epubParser.parseMetadata(f);
      await booksStore.add({
        rootId: root.id,
        relPath,
        fileHandle: handle,
        sourceType: 'epub',
        title: meta.title,
        author: meta.author,
        coverBlob: meta.coverBlob,
        chaptersMeta: meta.chaptersMeta,
        wordCount: meta.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
      });
    } catch (err) {
      console.warn('Failed to parse', relPath, err);
    }
  }

  // 3) mark root scanned + update book count
  await rootsStore.update(root.id, {
    lastScannedAt: Date.now(),
    bookCount: files.length,
  });
  setBusy(null);

  // 4) refresh state
  const [newBooks, newRoots] = await Promise.all([booksStore.list(), rootsStore.list()]);
  dispatch({ type: 'SET_BOOKS', books: newBooks });
  dispatch({ type: 'SET_ROOTS', roots: newRoots });
}
```

- [ ] **Step 2: Manual verify**

Reload. Click "＋ 加根目錄" → OS picker opens → select `C:\dev\esjzone-scraper\books`. Grant permission.

Expected:
- Status line shows "掃描中 1/N: 1543764675(迷宮防守)/zh-TW/迷宮防守.epub…" progressing.
- After scan completes, grid populates with book covers. At least 10 books visible. "根目錄" sidebar shows `books` with count.
- Reload the page — books should still be there; `rootsStore.list()` in console shows one root with `dirHandle` present.
- Click "＋ 加根目錄" again, pick `C:\dev\novelpia-scraper\books` → second root added, more books visible.

Known limitation to verify: closing the browser and reopening will require re-granting permission on next scan — that is expected (handled in a later task's reader view).

- [ ] **Step 3: Commit**

```bash
git add src/library.jsx
git commit -m "feat(library): recursive EPUB scan via File System Access API"
```

---

## Task 10: Add single file flow (EPUB + TXT)

**Files:**
- Modify: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Enable the "+ 加單檔" button and wire it up**

In `LibraryTopbar`, add and wire an `addFile` handler:

```jsx
async function addFile() {
  let fileHandle;
  if ('showOpenFilePicker' in window) {
    try {
      const [fh] = await window.showOpenFilePicker({
        types: [{
          description: '小說檔',
          accept: { 'application/epub+zip': ['.epub'], 'text/plain': ['.txt'] },
        }],
        excludeAcceptAllOption: false,
      });
      fileHandle = fh;
    } catch (_) { return; }
  } else {
    // fallback: <input type=file>
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.epub,.txt';
    const picked = await new Promise((resolve) => {
      input.onchange = () => resolve(input.files[0]);
      input.click();
    });
    if (!picked) return;
    fileHandle = null;  // no persistent handle
    return addFromFile(picked, null);
  }
  const file = await fileHandle.getFile();
  await addFromFile(file, fileHandle);
}

async function addFromFile(file, fileHandle) {
  const ext = file.name.toLowerCase().split('.').pop();
  const parser = ext === 'txt' ? txtParser : epubParser;
  const meta = await parser.parseMetadata(file);
  await booksStore.add({
    rootId: null,
    relPath: null,
    fileHandle,
    sourceType: ext === 'txt' ? 'txt' : 'epub',
    title: meta.title,
    author: meta.author,
    coverBlob: meta.coverBlob || null,
    chaptersMeta: meta.chaptersMeta,
    wordCount: meta.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
  });
  const newBooks = await booksStore.list();
  dispatch({ type: 'SET_BOOKS', books: newBooks });
}
```

Replace the `disabled` "＋ 加單檔" button with the wired one:
```jsx
<button style={btnStyle()} onClick={addFile}>＋ 加單檔</button>
```

Also add `dispatch` to the destructured args of `LibraryTopbar` if it's not already there:
```jsx
function LibraryTopbar({ settings, dispatch }) {
```

(Already the case from Task 7.)

- [ ] **Step 2: Manual verify**

Reload. Click "＋ 加單檔" → OS picker → select an EPUB from outside any current root, e.g. a fresh EPUB you download. It should appear in the grid. Repeat with `fixtures/sample.txt` → TXT book appears with no cover (color-block fallback) and chapter list from chapter-regex.

- [ ] **Step 3: Commit**

```bash
git add src/library.jsx
git commit -m "feat(library): add single EPUB/TXT file flow"
```

---

## Task 11: Book context menu (tags, collections, remove)

**Files:**
- Create: `C:\dev\novel-reader\src\ui\book-menu.jsx`
- Modify: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Write `book-menu.jsx`**

```jsx
// src/ui/book-menu.jsx — right-click menu for a book card
function BookMenu({ book, anchorPos, onClose, onChanged }) {
  const ref = React.useRef(null);
  const [mode, setMode] = React.useState('main');   // 'main' | 'tag' | 'collection'
  const [inputVal, setInputVal] = React.useState('');

  React.useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) onClose(); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  async function addTag() {
    if (!inputVal.trim()) return;
    await booksStore.addTag(book.id, inputVal.trim());
    setInputVal(''); setMode('main');
    onChanged();
  }
  async function removeTag(t) {
    await booksStore.removeTag(book.id, t); onChanged();
  }
  async function addCollection() {
    if (!inputVal.trim()) return;
    await booksStore.addCollection(book.id, inputVal.trim());
    setInputVal(''); setMode('main');
    onChanged();
  }
  async function removeCollection(c) {
    await booksStore.removeCollection(book.id, c); onChanged();
  }
  async function deleteBook() {
    if (!confirm(`從書庫移除「${book.title}」？（檔案本身不會刪）`)) return;
    await booksStore.remove(book.id);
    onChanged(); onClose();
  }

  const style = {
    position: 'fixed', top: anchorPos.y, left: anchorPos.x,
    background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
    borderRadius: 8, boxShadow: '0 8px 28px rgba(0,0,0,0.15)',
    padding: 6, zIndex: 1000, fontFamily: 'var(--ui)', fontSize: 13, minWidth: 220,
  };
  const row = {
    padding: '8px 12px', borderRadius: 5, cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 8,
  };
  const rowHover = { background: 'rgba(0,0,0,0.05)' };

  function HoverRow({ children, ...rest }) {
    const [h, setH] = React.useState(false);
    return (
      <div {...rest} style={{ ...row, ...(h ? rowHover : null), ...(rest.style || {}) }}
        onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} style={style}>
      {mode === 'main' && <>
        <HoverRow onClick={() => setMode('tag')}># 編輯 Tags</HoverRow>
        <HoverRow onClick={() => setMode('collection')}>📁 加到 Collection</HoverRow>
        <div style={{ height: 0.5, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }}/>
        <HoverRow onClick={deleteBook} style={{ color: '#B3261E' }}>🗑 從書庫移除</HoverRow>
      </>}
      {mode === 'tag' && <>
        <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>TAGS</div>
        {book.tags.length === 0 && <div style={{ padding: '4px 12px 8px', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>還沒有 tag</div>}
        {book.tags.map((t) => (
          <HoverRow key={t}>
            <span style={{ flex: 1 }}># {t}</span>
            <span onClick={(e) => { e.stopPropagation(); removeTag(t); }} style={{ color: '#B3261E', fontSize: 11 }}>✕</span>
          </HoverRow>
        ))}
        <div style={{ padding: 8, display: 'flex', gap: 6 }}>
          <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            placeholder="新 tag…" autoFocus
            style={{ flex: 1, padding: '4px 8px', fontSize: 12, border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 4, fontFamily: 'inherit' }}/>
          <button onClick={addTag} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 12 }}>加</button>
        </div>
        <HoverRow onClick={() => setMode('main')} style={{ color: 'rgba(0,0,0,0.5)' }}>← 返回</HoverRow>
      </>}
      {mode === 'collection' && <>
        <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>COLLECTIONS</div>
        {book.collections.length === 0 && <div style={{ padding: '4px 12px 8px', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>還沒加到任何 collection</div>}
        {book.collections.map((c) => (
          <HoverRow key={c}>
            <span style={{ flex: 1 }}>📁 {c}</span>
            <span onClick={(e) => { e.stopPropagation(); removeCollection(c); }} style={{ color: '#B3261E', fontSize: 11 }}>✕</span>
          </HoverRow>
        ))}
        <div style={{ padding: 8, display: 'flex', gap: 6 }}>
          <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCollection()}
            placeholder="新 collection…" autoFocus
            style={{ flex: 1, padding: '4px 8px', fontSize: 12, border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 4, fontFamily: 'inherit' }}/>
          <button onClick={addCollection} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 12 }}>加</button>
        </div>
        <HoverRow onClick={() => setMode('main')} style={{ color: 'rgba(0,0,0,0.5)' }}>← 返回</HoverRow>
      </>}
    </div>
  );
}
window.BookMenu = BookMenu;
```

- [ ] **Step 2: Wire right-click in `BookCard` (library.jsx)**

Replace `BookCard` in `src/library.jsx`:

```jsx
function BookCard({ book, dispatch }) {
  const [hover, setHover] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState(null);
  const idx = book.chaptersMeta.length && book.lastChapterId
    ? Math.max(0, book.chaptersMeta.findIndex((c) => c.id === book.lastChapterId))
    : 0;
  const progress = book.chaptersMeta.length
    ? (idx + (book.lastScroll || 0)) / book.chaptersMeta.length
    : 0;

  async function refresh() {
    const books = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books });
  }

  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => openBook(book.id, dispatch)}
        onContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.clientX, y: e.clientY }); }}
        style={{ cursor: 'pointer', position: 'relative' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <Cover book={book}/>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 500, lineHeight: 1.4 }}>{book.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.55)', marginTop: 2 }}>{book.author || '—'}</div>
        <div style={{
          marginTop: 6, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden',
        }}>
          <div style={{
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            height: '100%', background: book.accent || '#8C3A2E',
          }}/>
        </div>
        {book.tags.length > 0 && hover && (
          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
            {book.tags.slice(0, 4).map((t) => (
              <span key={t} style={{
                fontSize: 9, padding: '2px 6px', borderRadius: 3,
                background: 'rgba(0,0,0,0.06)', color: 'rgba(43,36,27,0.7)',
              }}># {t}</span>
            ))}
          </div>
        )}
      </div>
      {menuPos && (
        <BookMenu
          book={book}
          anchorPos={menuPos}
          onClose={() => setMenuPos(null)}
          onChanged={refresh}
        />
      )}
    </>
  );
}
```

- [ ] **Step 3: Manual verify**

Reload with at least one book in the library. Right-click a book → menu shows "編輯 Tags / 加到 Collection / 從書庫移除". Click Tags → add `測試tag` → close menu → hover the card → tag chip visible. Sidebar now shows `# 測試tag` under Tags section. Add same book to a collection → sidebar shows it under Collections.

Remove a book → it disappears from grid (confirmation dialog).

- [ ] **Step 4: Commit**

```bash
git add src/ui/book-menu.jsx src/library.jsx
git commit -m "feat(library): right-click context menu for tags, collections, remove"
```

---

## Task 12: Search, sort, and sidebar filter wiring

**Files:**
- Modify: `C:\dev\novel-reader\src\library.jsx`

- [ ] **Step 1: Add search state + sort dropdown to `LibraryTopbar`**

Replace `LibraryTopbar` in `src/library.jsx` (keeping prior handler functions `addRoot`, `addFile`, `addFromFile`, `scanRoot` — they stay where they are):

```jsx
function LibraryTopbar({ settings, dispatch, onSearchChange }) {
  const [busy, setBusy] = React.useState(null);
  const supported = 'showDirectoryPicker' in window;

  async function addRoot() {
    if (!supported) return;
    let dirHandle;
    try { dirHandle = await window.showDirectoryPicker(); }
    catch (_) { return; }
    const granted = await rootsStore.ensurePermission(dirHandle, 'read');
    if (!granted) { alert('需要讀取權限'); return; }
    const root = await rootsStore.add({ name: dirHandle.name, dirHandle });
    await scanRoot(root, setBusy, dispatch);
  }

  async function addFile() {
    let fileHandle, file;
    if ('showOpenFilePicker' in window) {
      try {
        const [fh] = await window.showOpenFilePicker({
          types: [{ description: '小說檔', accept: { 'application/epub+zip': ['.epub'], 'text/plain': ['.txt'] } }],
        });
        fileHandle = fh;
        file = await fh.getFile();
      } catch (_) { return; }
    } else {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.epub,.txt';
      file = await new Promise((resolve) => { input.onchange = () => resolve(input.files[0]); input.click(); });
      if (!file) return;
      fileHandle = null;
    }
    await addFromFile(file, fileHandle, dispatch);
  }

  async function setSort(sortBy) {
    const order = settings.sortBy === sortBy
      ? (settings.sortOrder === 'asc' ? 'desc' : 'asc')
      : 'desc';
    const next = await settingsStore.save({ sortBy, sortOrder: order });
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }

  const sortOptions = [
    { key: 'lastRead', label: '最近讀' },
    { key: 'addedAt', label: '加入時間' },
    { key: 'title', label: '書名' },
    { key: 'author', label: '作者' },
  ];
  const arrow = settings.sortOrder === 'asc' ? '▲' : '▼';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
      <input placeholder="搜尋書名 / 作者 / tag / collection"
        onChange={(e) => onSearchChange(e.target.value)}
        style={{
          flex: 1, minWidth: 240, padding: '8px 14px',
          border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: 8, fontSize: 13, fontFamily: 'inherit', background: '#fff',
        }}/>
      <div style={{ display: 'flex', gap: 4, fontSize: 12 }}>
        {sortOptions.map((o) => (
          <button key={o.key} onClick={() => setSort(o.key)} style={{
            ...btnStyle(),
            background: settings.sortBy === o.key ? 'rgba(0,0,0,0.08)' : '#fff',
            padding: '6px 10px', fontSize: 12,
          }}>{o.label} {settings.sortBy === o.key ? arrow : ''}</button>
        ))}
      </div>
      {supported && <button style={btnStyle()} onClick={addRoot}>＋ 加根目錄</button>}
      <button style={btnStyle()} onClick={addFile}>＋ 加單檔</button>
      {busy && <div style={{ fontSize: 11, color: 'rgba(43,36,27,0.6)', width: '100%' }}>
        掃描中 {busy.current}/{busy.total}: {busy.name.slice(-40)}
      </div>}
    </div>
  );
}
```

- [ ] **Step 2: Update `addFromFile` signature to take `dispatch`**

Replace the free `addFromFile` function at the bottom of `library.jsx`:

```jsx
async function addFromFile(file, fileHandle, dispatch) {
  const ext = file.name.toLowerCase().split('.').pop();
  const parser = ext === 'txt' ? txtParser : epubParser;
  const meta = await parser.parseMetadata(file);
  await booksStore.add({
    rootId: null,
    relPath: null,
    fileHandle,
    sourceType: ext === 'txt' ? 'txt' : 'epub',
    title: meta.title,
    author: meta.author,
    coverBlob: meta.coverBlob || null,
    chaptersMeta: meta.chaptersMeta,
    wordCount: meta.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
  });
  const newBooks = await booksStore.list();
  dispatch({ type: 'SET_BOOKS', books: newBooks });
}
```

- [ ] **Step 3: Add search state + filter in `Library`**

Replace the `Library` component body:

```jsx
function Library() {
  const { state, dispatch } = React.useContext(AppContext);
  const { books, roots, settings } = state;
  const [search, setSearch] = React.useState('');

  const tags = React.useMemo(() => booksStore.allTags(books), [books]);
  const collections = React.useMemo(() => booksStore.allCollections(books), [books]);

  const filtered = React.useMemo(() => {
    let out = filterBooks(books, settings);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q)) ||
        b.collections.some((c) => c.toLowerCase().includes(q))
      );
    }
    return out;
  }, [books, settings, search]);

  const hasLibrary = roots.length > 0 || books.length > 0;

  return (
    <div className="nr-root" style={{
      display: 'grid', gridTemplateColumns: '240px 1fr', height: '100vh',
      background: '#F7F5F0', color: '#2B241B',
    }}>
      <LibrarySidebar
        settings={settings}
        tags={tags}
        collections={collections}
        roots={roots}
        books={books}
        dispatch={dispatch}
      />
      <main style={{ overflow: 'auto', padding: '32px 40px' }} className="scroll-thin">
        <LibraryTopbar settings={settings} dispatch={dispatch} onSearchChange={setSearch}/>
        {!hasLibrary ? (
          <LibraryEmpty dispatch={dispatch}/>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(43,36,27,0.5)' }}>沒有符合條件的書</div>
        ) : (
          <BookGrid books={filtered} dispatch={dispatch}/>
        )}
      </main>
    </div>
  );
}
window.Library = Library;
```

- [ ] **Step 4: Manual verify**

Reload. With several books:
- Type a book title fragment in the search box → list narrows.
- Click "書名 ▼" sort → list re-sorts alphabetically; click again → reverses.
- Click "# 測試tag" in sidebar → only books with that tag.
- Stack filters: click status "正在讀" + a tag → both conditions AND'd.
- Reload → sort + filter state persists.

- [ ] **Step 5: Commit**

```bash
git add src/library.jsx
git commit -m "feat(library): search, sort, and combined sidebar filters"
```

---

## Task 13: Reader shell (top bar, content region, footer, back nav)

**Files:**
- Create: `C:\dev\novel-reader\src\reader.jsx`
- Modify: `C:\dev\novel-reader\src\app.jsx`

- [ ] **Step 1: Write `reader.jsx` with theme-agnostic shell**

```jsx
// src/reader.jsx — reader view shell
function Reader() {
  const { state, dispatch, chapterCacheRef } = React.useContext(AppContext);
  const { activeBookId, settings } = state;
  const [book, setBook] = React.useState(null);
  const [chapterHtml, setChapterHtml] = React.useState('');
  const [chapterExtraCss, setChapterExtraCss] = React.useState('');
  const [currentChapterId, setCurrentChapterId] = React.useState(null);
  const [permIssue, setPermIssue] = React.useState(false);

  // Load book
  React.useEffect(() => {
    (async () => {
      const b = await booksStore.get(activeBookId);
      setBook(b);
      // try to load the file blob via handle
      const blob = await loadBookBlob(b, setPermIssue);
      if (!blob) return;
      const chId = b.lastChapterId || b.chaptersMeta[0]?.id;
      if (chId) openChapter(b, blob, chId);
    })();
    return () => { chapterCacheRef.current.clear(); };
    // eslint-disable-next-line
  }, [activeBookId]);

  async function openChapter(b, blob, chapterId) {
    const key = `${b.id}:${chapterId}`;
    const cache = chapterCacheRef.current;
    if (cache.has(key)) {
      const { html, extraCss } = cache.get(key);
      setChapterHtml(html); setChapterExtraCss(extraCss);
      setCurrentChapterId(chapterId);
      return;
    }
    const parser = b.sourceType === 'txt' ? txtParser : epubParser;
    const parsed = await parser.parseMetadata(blob);
    const res = await parser.getChapter(blob, parsed, chapterId, { preserveCss: b.preserveOriginalCss });
    cache.set(key, res);
    setChapterHtml(res.html); setChapterExtraCss(res.extraCss);
    setCurrentChapterId(chapterId);
  }

  async function backToLibrary() {
    dispatch({ type: 'SET_VIEW', view: 'library' });
  }

  if (!book) return <div className="loading-screen">載入中…</div>;
  if (permIssue) return <PermissionBanner book={book} onRetry={() => window.location.reload()} onBack={backToLibrary}/>;

  const chapterIdx = Math.max(0, book.chaptersMeta.findIndex((c) => c.id === currentChapterId));
  const chapterTitle = book.chaptersMeta[chapterIdx]?.title || '';

  return (
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
    }}>
      {chapterExtraCss && <style>{chapterExtraCss}</style>}
      <ReaderTopBar book={book} chapterTitle={chapterTitle} onBack={backToLibrary}/>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        <ReaderContent
          book={book}
          html={chapterHtml}
          settings={settings}
        />
      </div>
      <ReaderFooter book={book} chapterIdx={chapterIdx}/>
    </div>
  );
}
window.Reader = Reader;

async function loadBookBlob(book, setPermIssue) {
  if (!book.fileHandle && !book.rootId) return null;
  try {
    let handle = book.fileHandle;
    if (!handle && book.rootId) {
      const root = (await rootsStore.list()).find((r) => r.id === book.rootId);
      if (!root) return null;
      const granted = await rootsStore.ensurePermission(root.dirHandle, 'read');
      if (!granted) { setPermIssue(true); return null; }
      // traverse relPath
      const parts = book.relPath.split('/');
      let dir = root.dirHandle;
      for (let i = 0; i < parts.length - 1; i++) dir = await dir.getDirectoryHandle(parts[i]);
      handle = await dir.getFileHandle(parts[parts.length - 1]);
    } else if (handle) {
      const granted = await rootsStore.ensurePermission(handle, 'read');
      if (!granted) { setPermIssue(true); return null; }
    }
    return await handle.getFile();
  } catch (err) {
    console.warn('Failed to open book blob', err);
    setPermIssue(true);
    return null;
  }
}

function ReaderTopBar({ book, chapterTitle, onBack }) {
  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>← 書庫</button>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 500 }}>{book.title}</div>
      <div style={{ opacity: 0.5 }}>·</div>
      <div style={{ opacity: 0.7 }}>{chapterTitle}</div>
      <div style={{ flex: 1 }}/>
    </div>
  );
}

function ReaderContent({ book, html, settings }) {
  // Task 14+ will apply themes; for now use a default layout
  return (
    <main className="scroll scroll-thin" style={{ flex: 1, padding: '56px 0', background: '#FCFBF8' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 60px' }}>
        <div className="reading-body" style={{
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          fontSize: settings.tweaks.fontSize,
          lineHeight: settings.tweaks.lineHeight,
          color: '#2B241B',
        }} dangerouslySetInnerHTML={{ __html: html || '<p style="opacity:0.5">載入章節中…</p>' }}/>
      </div>
    </main>
  );
}

function ReaderFooter({ book, chapterIdx }) {
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 40px', borderTop: '0.5px solid rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--ui)', fontSize: 11, color: 'rgba(0,0,0,0.55)', flexShrink: 0,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: 'rgba(0,0,0,0.08)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: '#8C3A2E' }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

function PermissionBanner({ book, onRetry, onBack }) {
  return (
    <div className="nr-root" style={{
      width: '100%', height: '100vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, background: '#F7F5F0', color: '#2B241B',
    }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>無法讀取「{book.title}」</div>
      <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)', maxWidth: 360, textAlign: 'center', lineHeight: 1.8 }}>
        瀏覽器的權限已失效（重新整理 / 開新分頁時會發生）。點下面的按鈕重新授權，或回書庫。
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onRetry} style={btnStyle()}>重新授權</button>
        <button onClick={onBack} style={btnStyle()}>回書庫</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Remove the `Reader` stub from `app.jsx`**

In `src/app.jsx`, delete:
```jsx
window.Reader = window.Reader || function Reader() {
  return <div className="nr-root" style={{ padding: 40 }}>Reader (stub)</div>;
};
```

- [ ] **Step 3: Manual verify**

Reload with books in the library. Click a book → reader opens → top bar shows title + first chapter title → content area shows first chapter text → footer shows "1 / N" with progress bar. Click "← 書庫" → back to library.

If permission was revoked, you should see the permission banner with "重新授權" + "回書庫" buttons.

- [ ] **Step 4: Commit**

```bash
git add src/reader.jsx src/app.jsx
git commit -m "feat(reader): reader shell with blob loading, permission banner, and default layout"
```

---

## Task 14: Chapter cache, scroll persistence, prev/next navigation

**Files:**
- Modify: `C:\dev\novel-reader\src\reader.jsx`

- [ ] **Step 1: Add scroll tracking + next/prev**

Replace `Reader` and `ReaderContent` in `src/reader.jsx`:

```jsx
function Reader() {
  const { state, dispatch, chapterCacheRef } = React.useContext(AppContext);
  const { activeBookId, settings } = state;
  const [book, setBook] = React.useState(null);
  const [chapterHtml, setChapterHtml] = React.useState('');
  const [chapterExtraCss, setChapterExtraCss] = React.useState('');
  const [currentChapterId, setCurrentChapterId] = React.useState(null);
  const [permIssue, setPermIssue] = React.useState(false);
  const [blob, setBlob] = React.useState(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    (async () => {
      const b = await booksStore.get(activeBookId);
      setBook(b);
      const bl = await loadBookBlob(b, setPermIssue);
      if (!bl) return;
      setBlob(bl);
      const chId = b.lastChapterId || b.chaptersMeta[0]?.id;
      if (chId) await openChapter(b, bl, chId, b.lastScroll || 0);
    })();
    return () => { chapterCacheRef.current.clear(); };
    // eslint-disable-next-line
  }, [activeBookId]);

  async function openChapter(b, bl, chapterId, restoreScroll = 0) {
    const key = `${b.id}:${chapterId}`;
    const cache = chapterCacheRef.current;
    let res = cache.get(key);
    if (!res) {
      const parser = b.sourceType === 'txt' ? txtParser : epubParser;
      const parsed = await parser.parseMetadata(bl);
      res = await parser.getChapter(bl, parsed, chapterId, { preserveCss: b.preserveOriginalCss });
      cache.set(key, res);
    }
    setChapterHtml(res.html); setChapterExtraCss(res.extraCss);
    setCurrentChapterId(chapterId);
    // restore scroll after next paint
    setTimeout(() => {
      if (scrollRef.current) {
        const max = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
        scrollRef.current.scrollTop = max * restoreScroll;
      }
    }, 0);
    await booksStore.update(b.id, { lastChapterId: chapterId, lastScroll: restoreScroll, lastReadAt: Date.now() });
    const fresh = await booksStore.get(b.id);
    setBook(fresh);
  }

  // Debounced scroll save
  const saveTimer = React.useRef(null);
  function onScroll() {
    if (!scrollRef.current || !book) return;
    const max = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    const frac = max > 0 ? scrollRef.current.scrollTop / max : 0;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      booksStore.update(book.id, { lastScroll: frac });
    }, 500);
  }

  async function nextChapter() {
    if (!book || !blob) return;
    const idx = book.chaptersMeta.findIndex((c) => c.id === currentChapterId);
    const next = book.chaptersMeta[idx + 1];
    if (next) await openChapter(book, blob, next.id, 0);
  }
  async function prevChapter() {
    if (!book || !blob) return;
    const idx = book.chaptersMeta.findIndex((c) => c.id === currentChapterId);
    const prev = book.chaptersMeta[idx - 1];
    if (prev) await openChapter(book, blob, prev.id, 0);
  }

  async function backToLibrary() {
    dispatch({ type: 'SET_VIEW', view: 'library' });
    const newBooks = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books: newBooks });
  }

  if (!book) return <div className="loading-screen">載入中…</div>;
  if (permIssue) return <PermissionBanner book={book} onRetry={() => window.location.reload()} onBack={backToLibrary}/>;

  const chapterIdx = Math.max(0, book.chaptersMeta.findIndex((c) => c.id === currentChapterId));
  const chapterTitle = book.chaptersMeta[chapterIdx]?.title || '';

  return (
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
    }}>
      {chapterExtraCss && <style>{chapterExtraCss}</style>}
      <ReaderTopBar book={book} chapterTitle={chapterTitle} onBack={backToLibrary}/>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        <ReaderContent
          book={book}
          html={chapterHtml}
          settings={settings}
          scrollRef={scrollRef}
          onScroll={onScroll}
          onPrev={prevChapter}
          onNext={nextChapter}
          canPrev={chapterIdx > 0}
          canNext={chapterIdx < book.chaptersMeta.length - 1}
        />
      </div>
      <ReaderFooter book={book} chapterIdx={chapterIdx}/>
    </div>
  );
}

function ReaderContent({ book, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  return (
    <main
      ref={scrollRef}
      onScroll={onScroll}
      className="scroll scroll-thin"
      style={{ flex: 1, padding: '56px 0', background: '#FCFBF8' }}
    >
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 60px' }}>
        <div className="reading-body" style={{
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          fontSize: settings.tweaks.fontSize,
          lineHeight: settings.tweaks.lineHeight,
          color: '#2B241B',
        }} dangerouslySetInnerHTML={{ __html: html || '<p style="opacity:0.5">載入章節中…</p>' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 30, borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3 }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Manual verify**

Open a book. Read a few paragraphs, scroll down. Close the browser tab, reopen → library → click the same book → should open at the same chapter + same scroll position.

Click "下一章" → jumps to next chapter with scroll at top. Click "上一章" → back to previous, scroll restored to where we left off.

In console: `await booksStore.get(<bookId>)` → `lastScroll` is a fraction 0-1, `lastChapterId` set, `lastReadAt` recent.

- [ ] **Step 3: Commit**

```bash
git add src/reader.jsx
git commit -m "feat(reader): chapter cache, scroll persistence, prev/next navigation"
```

---

## Task 15: TOC drawer, tweaks panel, keyboard shortcuts

**Files:**
- Create: `C:\dev\novel-reader\src\ui\toc-drawer.jsx`
- Create: `C:\dev\novel-reader\src\ui\tweaks-panel.jsx`
- Modify: `C:\dev\novel-reader\src\reader.jsx`

- [ ] **Step 1: Write `toc-drawer.jsx`**

```jsx
// src/ui/toc-drawer.jsx — slide-in TOC
function TocDrawer({ book, currentChapterId, onJump, open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)', zIndex: 900,
      }}/>
      <aside style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 320, zIndex: 901,
        background: '#FCFBF8', borderRight: '0.5px solid rgba(0,0,0,0.1)',
        padding: '24px 0', display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 18px rgba(0,0,0,0.1)',
      }}>
        <div style={{ padding: '0 22px 16px', borderBottom: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cover book={book} size="sm"/>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 500 }}>{book.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.55)' }}>{book.author || '—'}</div>
          </div>
        </div>
        <div style={{ padding: '14px 22px 8px', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>目錄</div>
        <div className="scroll scroll-thin" style={{ flex: 1, padding: '0 10px' }}>
          {book.chaptersMeta.map((c, i) => {
            const active = c.id === currentChapterId;
            return (
              <div key={c.id} onClick={() => { onJump(c.id); onClose(); }} style={{
                padding: '10px 12px', borderRadius: 5, cursor: 'pointer',
                background: active ? 'rgba(0,0,0,0.06)' : 'transparent',
                fontWeight: active ? 600 : 400,
                display: 'flex', gap: 8, alignItems: 'baseline',
              }}>
                <span style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', fontVariantNumeric: 'tabular-nums', minWidth: 20 }}>{i + 1}</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.4 }}>{c.title}</span>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
window.TocDrawer = TocDrawer;
```

- [ ] **Step 2: Write `tweaks-panel.jsx`**

```jsx
// src/ui/tweaks-panel.jsx — font/line/texture + per-book CSS toggle
function TweaksPanel({ book, settings, onSettingsChange, onBookChange, open, onClose }) {
  if (!open) return null;
  const tw = settings.tweaks;

  function set(patch) { onSettingsChange({ tweaks: patch }); }

  const styleLabel = { fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' };
  const slider = (min, max, step, val, on) => (
    <input type="range" min={min} max={max} step={step} value={val}
      onChange={(e) => on(Number(e.target.value))}
      style={{ flex: 1 }}/>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 800 }}/>
      <div style={{
        position: 'fixed', right: 16, top: 60, width: 300, zIndex: 801,
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
        borderRadius: 12, boxShadow: '0 10px 34px rgba(0,0,0,0.15)',
        padding: 18, fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <div style={styleLabel}>排版</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 36, fontSize: 11 }}>字級</span>
          {slider(12, 22, 1, tw.fontSize, (v) => set({ ...tw, fontSize: v }))}
          <span style={{ width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tw.fontSize}px</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 36, fontSize: 11 }}>行距</span>
          {slider(1.4, 2.4, 0.05, tw.lineHeight, (v) => set({ ...tw, lineHeight: Number(v.toFixed(2)) }))}
          <span style={{ width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tw.lineHeight.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 36, fontSize: 11 }}>字體</span>
          <button onClick={() => set({ ...tw, font: 'sans' })} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11, background: tw.font === 'sans' ? 'rgba(0,0,0,0.08)' : '#fff' }}>黑體</button>
          <button onClick={() => set({ ...tw, font: 'serif' })} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11, background: tw.font === 'serif' ? 'rgba(0,0,0,0.08)' : '#fff' }}>宋體</button>
        </div>

        <div style={styleLabel}>質感</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <input type="checkbox" checked={!!tw.texture} onChange={(e) => set({ ...tw, texture: e.target.checked })}/>
          <span>紙張紋理（僅 V1 風格會顯示）</span>
        </label>

        <div style={{ height: 0.5, background: 'rgba(0,0,0,0.08)', margin: '14px -18px' }}/>

        <div style={styleLabel}>這本書</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={!!book.preserveOriginalCss}
            onChange={(e) => onBookChange({ preserveOriginalCss: e.target.checked })}/>
          <span>保留原始 EPUB 排版</span>
        </label>
      </div>
    </>
  );
}
window.TweaksPanel = TweaksPanel;
```

- [ ] **Step 3: Wire TOC + Tweaks + keyboard in `reader.jsx`**

In `src/reader.jsx`, update `Reader` to manage panel state and bind keyboard. Replace the return block and add handlers:

```jsx
  const [tocOpen, setTocOpen] = React.useState(false);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  async function setSettings(patch) {
    const next = await settingsStore.save(patch);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }
  async function updateBook(patch) {
    const updated = await booksStore.update(book.id, patch);
    setBook(updated);
    // invalidate cache for this book if preserveCss changed
    if ('preserveOriginalCss' in patch) {
      for (const k of Array.from(chapterCacheRef.current.keys())) {
        if (k.startsWith(`${book.id}:`)) chapterCacheRef.current.delete(k);
      }
      if (blob && currentChapterId) {
        // reload current chapter
        await openChapter({ ...book, ...patch }, blob, currentChapterId, 0);
      }
    }
  }

  function pageScroll(delta) {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ top: scrollRef.current.clientHeight * delta * 0.9, behavior: 'smooth' });
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      if (tocOpen || tweaksOpen) {
        if (e.key === 'Escape') { setTocOpen(false); setTweaksOpen(false); }
        return;
      }
      const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (inInput) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); prevChapter(); break;
        case 'ArrowRight': e.preventDefault(); nextChapter(); break;
        case 'PageDown': case ' ': e.preventDefault(); pageScroll(1); break;
        case 'PageUp': e.preventDefault(); pageScroll(-1); break;
        case 'T': case 't': setTocOpen((o) => !o); break;
        case ',': setTweaksOpen((o) => !o); break;
        case 'F': case 'f':
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case 'Escape': backToLibrary(); break;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line
  }, [book, currentChapterId, tocOpen, tweaksOpen]);
```

Update `ReaderTopBar` to include the action buttons; replace the existing one:

```jsx
function ReaderTopBar({ book, chapterTitle, onBack, onOpenToc, onOpenTweaks }) {
  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0,
    }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>← 書庫</button>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 500 }}>{book.title}</div>
      <div style={{ opacity: 0.5 }}>·</div>
      <div style={{ opacity: 0.7 }}>{chapterTitle}</div>
      <div style={{ flex: 1 }}/>
      <button onClick={onOpenToc} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>目錄 (T)</button>
      <button onClick={onOpenTweaks} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>Aa (,)</button>
    </div>
  );
}
```

And in the main `return` of `Reader`, use:
```jsx
<ReaderTopBar book={book} chapterTitle={chapterTitle} onBack={backToLibrary}
  onOpenToc={() => setTocOpen(true)} onOpenTweaks={() => setTweaksOpen(true)}/>
...
<TocDrawer book={book} currentChapterId={currentChapterId}
  open={tocOpen} onClose={() => setTocOpen(false)}
  onJump={(id) => openChapter(book, blob, id, 0)}/>
<TweaksPanel book={book} settings={settings}
  open={tweaksOpen} onClose={() => setTweaksOpen(false)}
  onSettingsChange={setSettings} onBookChange={updateBook}/>
```

(Put `TocDrawer` and `TweaksPanel` at the top level of the returned JSX tree, after `</ReaderFooter>`'s wrapper.)

- [ ] **Step 4: Manual verify**

Open a book. Press `T` → TOC drawer slides in from left, current chapter highlighted. Click another chapter → drawer closes, reader jumps.

Press `,` → tweaks panel opens; move fontSize slider → text size changes live; flip "保留原始 EPUB 排版" → chapter reloads (may look different).

Press `←` / `→` → chapter changes. Press `Space` → page scrolls. Press `F` → fullscreen toggles. Press `Esc` twice (once to close panel, once to go back to library).

- [ ] **Step 5: Commit**

```bash
git add src/ui/toc-drawer.jsx src/ui/tweaks-panel.jsx src/reader.jsx
git commit -m "feat(reader): TOC drawer, tweaks panel, keyboard shortcuts"
```

---

## Task 16: Theme V1 — Warm Library

**Files:**
- Create: `C:\dev\novel-reader\styles\v1-warm.css`
- Create: `C:\dev\novel-reader\src\themes\v1-warm.jsx`
- Modify: `C:\dev\novel-reader\novel-reader.html` (add `<link>`)
- Modify: `C:\dev\novel-reader\src\reader.jsx` (switch content component by theme)

- [ ] **Step 1: Write `styles/v1-warm.css`**

```css
.v1-root { --bg: #EDE4D2; --ink: #2B241B; --mute: rgba(43,36,27,0.55); --rule: rgba(43,36,27,0.12); --accent: #8C3A2E; }
.v1-root { background: var(--bg); color: var(--ink); }
.v1-topbar { padding: 18px 40px; border-bottom: 0.5px solid var(--rule); display: flex; align-items: center; gap: 18px; }
.v1-content { flex: 1; padding: 56px 0; }
.v1-column { max-width: 640px; margin: 0 auto; padding: 0 60px; }
.v1-chaptertitle { text-align: center; margin-bottom: 40px; }
.v1-chaptertitle-caption { font-family: var(--serif); font-size: 14px; color: var(--mute); margin-bottom: 8px; letter-spacing: 0.3em; }
.v1-chaptertitle-heading { font-family: var(--serif); font-weight: 500; margin: 0; letter-spacing: 0.12em; }
.v1-chaptertitle-rule { width: 60px; height: 0.5px; background: var(--ink); opacity: 0.4; margin: 24px auto 0; }
.v1-dropcap { font-family: var(--serif); float: left; line-height: 0.95; margin-right: 6px; margin-top: 6px; color: var(--accent); }
.v1-footer { padding: 12px 40px; border-top: 0.5px solid var(--rule); display: flex; align-items: center; gap: 18px; font-family: var(--ui); font-size: 11px; color: var(--mute); }
.v1-progressbar { flex: 1; height: 1px; background: var(--rule); position: relative; }
.v1-progressbar > div { position: absolute; top: -1px; height: 3px; background: var(--accent); }
```

- [ ] **Step 2: Write `src/themes/v1-warm.jsx`**

```jsx
// src/themes/v1-warm.jsx — Warm Library content + footer
function V1Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v1;
  const idx = chapterIdx + 1;
  const total = book.chaptersMeta.length;
  return (
    <>
      <main ref={scrollRef} onScroll={onScroll}
        className={`v1-root v1-content scroll scroll-hidden ${settings.tweaks.texture ? 'paper-tex' : ''}`}
        style={{ '--accent': colors.accent, '--bg': colors.paperTone }}
      >
        <div className="v1-column">
          <div className="v1-chaptertitle">
            <div className="v1-chaptertitle-caption">{chapterNumberZh(idx)}</div>
            <h1 className="v1-chaptertitle-heading" style={{ fontSize: settings.tweaks.fontSize + 16 }}>{stripChapterPrefix(chapterTitle)}</h1>
            <div className="v1-chaptertitle-rule"/>
          </div>
          <div className="reading-body" style={{
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize,
            lineHeight: settings.tweaks.lineHeight,
          }} dangerouslySetInnerHTML={{ __html: injectDropCap(html, settings.tweaks.fontSize * 2.2) }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 30, borderTop: '0.5px solid var(--rule)' }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3 }}>← 上一章</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3 }}>下一章 →</button>
          </div>
        </div>
      </main>
    </>
  );
}

function V1Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v1;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div className="v1-footer v1-root" style={{ '--accent': colors.accent, '--bg': colors.paperTone }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1}</span>
      <div className="v1-progressbar">
        <div style={{ width: `${progress * 100}%`, left: 0 }}/>
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{total}</span>
    </div>
  );
}

function injectDropCap(html, size) {
  // Replace the first character of the first <p> with a dropcap-wrapped span
  return html.replace(/<p([^>]*)>(.)/, (_m, attrs, ch) =>
    `<p${attrs}><span class="v1-dropcap" style="font-size:${size}px">${ch}</span>`
  );
}
function stripChapterPrefix(title) {
  return (title || '').replace(/^第.+?[　\s]+/, '');
}
function chapterNumberZh(n) {
  const d = ['零','一','二','三','四','五','六','七','八','九','十'];
  if (n <= 10) return `第　${d[n]}　回`;
  return `第 ${n} 回`;
}

window.V1Reader = V1Reader;
window.V1Footer = V1Footer;
```

- [ ] **Step 3: Register the theme CSS + JSX in `novel-reader.html`**

Inside `<head>`, after `styles/shared.css`:
```html
<link rel="stylesheet" href="styles/v1-warm.css"/>
```

The JSX file is already in the script list from Task 1.

- [ ] **Step 4: Swap in V1 from `reader.jsx` based on `settings.activeTheme`**

In `src/reader.jsx`, replace the `ReaderContent` invocation and `ReaderFooter` invocation:

```jsx
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex' }}>
        {renderThemeContent({ book, chapterTitle, chapterIdx, html: chapterHtml, settings, scrollRef, onScroll, onPrev: prevChapter, onNext: nextChapter, canPrev: chapterIdx > 0, canNext: chapterIdx < book.chaptersMeta.length - 1 })}
      </div>
      {renderThemeFooter({ book, chapterIdx, settings })}
```

Add these dispatch helpers outside `Reader`:

```jsx
function renderThemeContent(props) {
  switch (props.settings.activeTheme) {
    case 'v1': return <V1Reader {...props}/>;
    case 'v4': return <V4Reader {...props}/>;
    case 'v5': return <V5Reader {...props}/>;
    default:   return <V1Reader {...props}/>;
  }
}
function renderThemeFooter(props) {
  switch (props.settings.activeTheme) {
    case 'v1': return <V1Footer {...props}/>;
    case 'v4': return <V4Footer {...props}/>;
    case 'v5': return <V5Footer {...props}/>;
    default:   return <V1Footer {...props}/>;
  }
}
```

Add temporary stubs for V4/V5 at the top of the file so the switch doesn't crash:
```jsx
window.V4Reader = window.V4Reader || V1Reader;
window.V4Footer = window.V4Footer || V1Footer;
window.V5Reader = window.V5Reader || V1Reader;
window.V5Footer = window.V5Footer || V1Footer;
```

Delete the old `ReaderContent` and `ReaderFooter` components in `reader.jsx` (they are replaced by the V1 theme).

- [ ] **Step 5: Manual verify**

In console: `await settingsStore.save({ activeTheme: 'v1' }); location.reload();`

Open a book. Expected: warm beige background, centered single column, drop cap (red first character) on the first paragraph, chapter title "第　一　回" + the rest of the chapter title, paper texture visible (if enabled in tweaks).

In tweaks panel toggle "紙張紋理" off/on → texture appears/disappears.

- [ ] **Step 6: Commit**

```bash
git add styles/v1-warm.css src/themes/v1-warm.jsx novel-reader.html src/reader.jsx
git commit -m "feat(theme): Warm Library (V1) theme with drop cap, paper texture, title band"
```

---

## Task 17: Theme V4 — Ambient Glass

**Files:**
- Create: `C:\dev\novel-reader\styles\v4-glass.css`
- Create: `C:\dev\novel-reader\src\themes\v4-glass.jsx`
- Modify: `C:\dev\novel-reader\novel-reader.html`

- [ ] **Step 1: Write `styles/v4-glass.css`**

```css
.v4-bg { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
.v4-bg.dawn     { background: linear-gradient(135deg, #F5DEB3 0%, #E8B6A0 30%, #C9A5D4 65%, #A4B8DC 100%); }
.v4-bg.dusk     { background: linear-gradient(135deg, #2D1B3D 0%, #7B4B6B 35%, #D4857E 65%, #F5C98E 100%); }
.v4-bg.sky      { background: linear-gradient(135deg, #E0F2FF 0%, #B8D8E8 35%, #9EB8D4 65%, #7BA0C4 100%); }
.v4-bg.ink      { background: linear-gradient(135deg, #F4F1EC 0%, #D4CFC4 35%, #A8A198 65%, #6E6A63 100%); }
.v4-blob { position: absolute; border-radius: 50%; pointer-events: none; }
.v4-blob-a { width: 420px; height: 420px; background: rgba(255,220,180,0.55); filter: blur(80px); left: -100px; top: -100px; }
.v4-blob-b { width: 460px; height: 460px; background: rgba(180,200,255,0.5); filter: blur(100px); right: -120px; bottom: -140px; }

.v4-root { position: relative; z-index: 1; font-family: var(--ui); color: #1A1A1C; display: flex; flex-direction: column; width: 100%; height: 100%; }
.v4-topbar-overlay {
  height: 44px; display: flex; align-items: center; padding: 0 16px; gap: 10px;
  background: rgba(255,255,255,0.35); backdrop-filter: blur(30px) saturate(140%);
  border-bottom: 0.5px solid rgba(255,255,255,0.4); flex-shrink: 0;
}
.v4-glass {
  background: rgba(255,253,248,0.72); backdrop-filter: blur(30px) saturate(140%);
  border: 0.5px solid rgba(255,255,255,0.55); border-radius: 18px;
  box-shadow: 0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 40px rgba(90,60,40,0.15);
}
.v4-reading-area { flex: 1; padding: 36px 36px 32px; display: grid; grid-template-columns: 1fr; gap: 28px; min-height: 0; }
.v4-pill {
  display: inline-flex; align-items: center; gap: 14px; padding: 8px 16px;
  background: rgba(255,255,255,0.55); backdrop-filter: blur(24px);
  border: 0.5px solid rgba(255,255,255,0.7); border-radius: 999px;
  font-size: 11px; color: rgba(26,26,28,0.78); box-shadow: 0 4px 14px rgba(0,0,0,0.06);
}
.v4-chaptertitle { text-align: center; margin-bottom: 40px; }
.v4-chaptertitle-caption { font-size: 10px; letter-spacing: 0.4em; font-weight: 600; margin-bottom: 12px; }
.v4-chaptertitle-heading { font-family: var(--serif); font-weight: 500; margin: 0; letter-spacing: 0.08em; }
.v4-chaptertitle-rule { width: 32px; height: 1px; margin: 20px auto 0; opacity: 0.5; }
```

- [ ] **Step 2: Write `src/themes/v4-glass.jsx`**

```jsx
// src/themes/v4-glass.jsx — Ambient Glass reader
function V4Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v4;
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div className={`v4-bg ${colors.gradient || 'dawn'}`}/>
      <div className="v4-blob v4-blob-a"/>
      <div className="v4-blob v4-blob-b"/>
      <div className="v4-root">
        <div className="v4-reading-area">
          <main className="v4-glass scroll scroll-thin" ref={scrollRef} onScroll={onScroll} style={{ overflow: 'auto', minHeight: 0 }}>
            <div style={{ maxWidth: 580, margin: '0 auto', padding: '56px 64px' }}>
              <div className="v4-chaptertitle">
                <div className="v4-chaptertitle-caption" style={{ color: colors.accent }}>CHAPTER {chapterIdx + 1}</div>
                <h1 className="v4-chaptertitle-heading" style={{ fontSize: settings.tweaks.fontSize + 16 }}>{stripChapterPrefix(chapterTitle)}</h1>
                <div className="v4-chaptertitle-rule" style={{ background: colors.accent }}/>
              </div>
              <div className="reading-body" style={{
                fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
                fontSize: settings.tweaks.fontSize,
                lineHeight: settings.tweaks.lineHeight,
              }} dangerouslySetInnerHTML={{ __html: html }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 30, borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
                <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'rgba(255,255,255,0.6)' }}>← 上一章</button>
                <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'rgba(255,255,255,0.6)' }}>下一章 →</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function V4Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v4;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 16, display: 'flex', justifyContent: 'center', pointerEvents: 'none', zIndex: 2 }}>
      <div className="v4-pill" style={{ pointerEvents: 'auto' }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1} / {total}</span>
        <div style={{ width: 120, height: 2, background: 'rgba(0,0,0,0.1)', borderRadius: 1, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: colors.accent, borderRadius: 1 }}/>
        </div>
        <span>{Math.round(progress * 100)}%</span>
      </div>
    </div>
  );
}

window.V4Reader = V4Reader;
window.V4Footer = V4Footer;
```

- [ ] **Step 3: Register CSS**

In `novel-reader.html` `<head>`, after `v1-warm.css`:
```html
<link rel="stylesheet" href="styles/v4-glass.css"/>
```

- [ ] **Step 4: Make Reader's root container non-clipping for V4 blobs**

In `reader.jsx`, the main wrapper already uses `height: 100vh`. Make sure the V4 theme's gradient bg covers behind the top bar: wrap the top bar + content + footer in a single positioned container when theme is v4. The simplest change is to let V4 render its own top bar overlay; but since the shell top bar is separate, we'll leave the shell top bar visible — its semi-opaque background will layer naturally over the gradient.

Update the Reader's outer wrapper so it doesn't set a hard background — remove any explicit background from `.nr-root` inline style for the reader:

```jsx
    <div className="nr-root nr-reading-scope" style={{
      width: '100%', height: '100vh', display: 'flex', flexDirection: 'column',
      background: settings.activeTheme === 'v4' ? 'transparent' : undefined,
      position: 'relative',
    }}>
```

Also wrap the `{renderThemeContent(...)}` section in a `relative` div so the V4 footer's `position:absolute` anchors correctly. Replace the content div:

```jsx
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', position: 'relative' }}>
        {renderThemeContent({ book, chapterTitle, chapterIdx, html: chapterHtml, settings, scrollRef, onScroll, onPrev: prevChapter, onNext: nextChapter, canPrev: chapterIdx > 0, canNext: chapterIdx < book.chaptersMeta.length - 1 })}
        {settings.activeTheme === 'v4' && renderThemeFooter({ book, chapterIdx, settings })}
      </div>
      {settings.activeTheme !== 'v4' && renderThemeFooter({ book, chapterIdx, settings })}
```

This places the V4 pill inside the scrollable content area (as a floating overlay).

- [ ] **Step 5: Manual verify**

Switch theme in console: `await settingsStore.save({ activeTheme: 'v4' }); location.reload();`

Open a book. Expected: peach→lavender→blue gradient background, glass reading panel centered, frosted appearance, floating pill progress indicator at bottom. Text readable through the glass. Chapter title with accent-colored "CHAPTER N" caption.

Cycle gradient preset in console:
```js
await settingsStore.save({ themeColors: { v4: { gradient: 'dusk' } } }); location.reload();
```
Expected: dark purple-pink sunset gradient.

- [ ] **Step 6: Commit**

```bash
git add styles/v4-glass.css src/themes/v4-glass.jsx novel-reader.html src/reader.jsx
git commit -m "feat(theme): Ambient Glass (V4) theme with gradient wallpaper and glass panels"
```

---

## Task 18: Theme V5 — Dark Serif

**Files:**
- Create: `C:\dev\novel-reader\styles\v5-dark.css`
- Create: `C:\dev\novel-reader\src\themes\v5-dark.jsx`
- Modify: `C:\dev\novel-reader\novel-reader.html`

- [ ] **Step 1: Write `styles/v5-dark.css`**

```css
.v5-root { --bg:#13201C; --bg2:#1A2925; --ink:#ECE3CF; --mute: rgba(236,227,207,0.5); --soft: rgba(236,227,207,0.75); --gold:#C9A86B; --rule: rgba(236,227,207,0.12); background: var(--bg); color: var(--ink); }
.v5-root.mogreen { --bg:#13201C; --bg2:#1A2925; }
.v5-root.xuanhei { --bg:#12100E; --bg2:#1A1816; }
.v5-root.zhehe   { --bg:#211612; --bg2:#2A1E18; }
.v5-column { max-width: 640px; margin: 0 auto; padding: 20px 80px; }
.v5-decor-rule { position: absolute; height: 0.5px; background: var(--gold); opacity: 0.3; }
.v5-chaptertitle { text-align: center; margin-bottom: 44px; }
.v5-chaptertitle-caption { font-family: var(--serif); font-size: 13px; color: var(--gold); letter-spacing: 0.5em; margin-bottom: 12px; }
.v5-chaptertitle-heading { font-family: var(--serif); font-weight: 400; margin: 0; letter-spacing: 0.15em; color: var(--ink); }
.v5-chaptertitle-sub { font-family: var(--serif); font-weight: 400; margin: 10px 0 0; letter-spacing: 0.15em; color: var(--soft); }
.v5-diamond-rule { display: flex; justify-content: center; align-items: center; gap: 10px; margin: 24px 0 0; }
.v5-diamond-rule span.line { width: 40px; height: 0.5px; background: var(--gold); opacity: 0.5; }
.v5-diamond-rule span.gem  { width: 4px; height: 4px; background: var(--gold); transform: rotate(45deg); }
```

- [ ] **Step 2: Write `src/themes/v5-dark.jsx`**

```jsx
// src/themes/v5-dark.jsx — Dark Serif reader
function V5Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v5;
  const tone = colors.bgTone || 'mogreen';
  return (
    <main ref={scrollRef} onScroll={onScroll}
      className={`v5-root ${tone} scroll scroll-thin`}
      style={{ flex: 1, padding: '56px 0', position: 'relative' }}
    >
      <div className="v5-decor-rule" style={{ left: 80, right: 80, top: 30 }}/>
      <div className="v5-decor-rule" style={{ left: 80, right: 80, bottom: 30 }}/>
      <div className="v5-column">
        <div className="v5-chaptertitle">
          <div className="v5-chaptertitle-caption" style={{ color: colors.accent }}>{chapterNumberZhSpaced(chapterIdx + 1)}</div>
          <h1 className="v5-chaptertitle-heading" style={{ fontSize: settings.tweaks.fontSize + 14 }}>{spaceChars(stripChapterPrefix(chapterTitle))}</h1>
          <div className="v5-diamond-rule">
            <span className="line" style={{ background: colors.accent }}/>
            <span className="gem" style={{ background: colors.accent }}/>
            <span className="line" style={{ background: colors.accent }}/>
          </div>
        </div>
        <div className="reading-body" style={{
          fontFamily: 'var(--serif)',
          fontSize: settings.tweaks.fontSize,
          lineHeight: settings.tweaks.lineHeight,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 30, borderTop: '0.5px solid var(--rule)' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '0.5px solid rgba(255,255,255,0.15)' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'rgba(255,255,255,0.06)', color: 'inherit', border: '0.5px solid rgba(255,255,255,0.15)' }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V5Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v5;
  const tone = colors.bgTone || 'mogreen';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div className={`v5-root ${tone}`} style={{
      padding: '12px 40px', borderTop: '0.5px solid var(--rule)',
      display: 'flex', alignItems: 'center', gap: 18,
      fontFamily: 'var(--ui)', fontSize: 11, color: 'var(--mute)',
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{chapterIdx + 1}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--rule)', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -1, left: 0, width: `${progress * 100}%`, height: 3, background: colors.accent }}/>
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{total}</span>
    </div>
  );
}

function chapterNumberZhSpaced(n) {
  const d = ['零','一','二','三','四','五','六','七','八','九','十'];
  const s = n <= 10 ? d[n] : String(n);
  return `第 　 ${s} 　 回`;
}
function spaceChars(s) {
  return (s || '').split('').join('　');
}

window.V5Reader = V5Reader;
window.V5Footer = V5Footer;
```

- [ ] **Step 3: Register CSS**

In `novel-reader.html` `<head>`, after `v4-glass.css`:
```html
<link rel="stylesheet" href="styles/v5-dark.css"/>
```

- [ ] **Step 4: Remove V5 stub in `reader.jsx`**

At the top of `reader.jsx`, delete:
```jsx
window.V5Reader = window.V5Reader || V1Reader;
window.V5Footer = window.V5Footer || V1Footer;
```

Also at this point V4 stubs were removed in Task 17 implicitly (they're defined before use in the order of `<script>` tags). If they weren't, remove them now:
```jsx
window.V4Reader = window.V4Reader || V1Reader;
window.V4Footer = window.V4Footer || V1Footer;
```

- [ ] **Step 5: Manual verify**

In console: `await settingsStore.save({ activeTheme: 'v5' }); location.reload();`

Open a book. Expected: dark green background `#13201C`, gold `#C9A86B` accents, serif body, chapter caption "第 　 一 　 回" spaced out, chapter title with each character spaced by `　`, thin gold rules at top and bottom of content area, diamond divider below title. Entire page dark with gold highlights.

Switch tone: `await settingsStore.save({ themeColors: { v5: { bgTone: 'xuanhei' } } }); location.reload();` → nearly black background.

- [ ] **Step 6: Commit**

```bash
git add styles/v5-dark.css src/themes/v5-dark.jsx novel-reader.html src/reader.jsx
git commit -m "feat(theme): Dark Serif (V5) theme with gold accents and decorative rules"
```

---

## Task 19: Theme switcher + per-theme color picker

**Files:**
- Create: `C:\dev\novel-reader\src\ui\theme-switcher.jsx`
- Create: `C:\dev\novel-reader\src\ui\color-picker.jsx`
- Modify: `C:\dev\novel-reader\src\reader.jsx`

- [ ] **Step 1: Write `theme-switcher.jsx`**

```jsx
// src/ui/theme-switcher.jsx — 3-thumbnail theme picker in top bar
function ThemeSwitcher({ settings, onChange }) {
  const themes = [
    { key: 'v1', label: 'Warm', swatch: { bg: '#EDE4D2', accent: settings.themeColors.v1.accent } },
    { key: 'v4', label: 'Glass', swatch: { bg: 'linear-gradient(135deg,#F5DEB3,#C9A5D4)', accent: settings.themeColors.v4.accent } },
    { key: 'v5', label: 'Dark',  swatch: { bg: '#13201C', accent: settings.themeColors.v5.accent } },
  ];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {themes.map((t) => {
        const active = settings.activeTheme === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 10px 4px 4px',
            borderRadius: 14, fontFamily: 'var(--ui)', fontSize: 11,
            border: `0.5px solid ${active ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
            background: active ? 'rgba(0,0,0,0.05)' : 'transparent',
            cursor: 'pointer',
          }}>
            <span style={{
              display: 'inline-block', width: 18, height: 18, borderRadius: 10,
              background: t.swatch.bg,
              boxShadow: `inset 0 0 0 2px ${t.swatch.accent}`,
            }}/>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
window.ThemeSwitcher = ThemeSwitcher;
```

- [ ] **Step 2: Write `color-picker.jsx`**

```jsx
// src/ui/color-picker.jsx — per-theme accent + preset picker
function ColorPicker({ settings, onChange, open, onClose }) {
  if (!open) return null;
  const theme = settings.activeTheme;
  const themeColors = settings.themeColors[theme];

  const presetsByTheme = {
    v1: {
      accentPresets: ['#8C3A2E', '#B34740', '#5A4A2A', '#4A5D3A', '#2D2D2D', '#6B4A5D'],
      tonePresets: [
        { key: '#EDE4D2', label: '羊皮紙' },
        { key: '#F5F1E8', label: '月白' },
        { key: '#E8DFCC', label: '棉紙' },
        { key: '#E0D4B8', label: '古書' },
        { key: '#F0EBDC', label: '霜白' },
        { key: '#E5DBB9', label: '竹黃' },
      ],
      toneKey: 'paperTone',
    },
    v4: {
      accentPresets: ['#AD4E3B', '#3D5AFE', '#5D4AAD', '#4A5D3A', '#B88A3A', '#2D5D55'],
      tonePresets: [
        { key: 'dawn', label: '晨曦' },
        { key: 'dusk', label: '薄暮' },
        { key: 'sky', label: '青空' },
        { key: 'ink', label: '墨染' },
      ],
      toneKey: 'gradient',
    },
    v5: {
      accentPresets: ['#C9A86B', '#D4C396', '#B8804A', '#9B6B3A', '#A4B8DC', '#8C3A2E'],
      tonePresets: [
        { key: 'mogreen', label: '墨綠' },
        { key: 'xuanhei', label: '玄黑' },
        { key: 'zhehe',   label: '赭褐' },
      ],
      toneKey: 'bgTone',
    },
  };
  const presets = presetsByTheme[theme];

  function setAccent(hex) { onChange({ themeColors: { [theme]: { accent: hex } } }); }
  function setTone(key) { onChange({ themeColors: { [theme]: { [presets.toneKey]: key } } }); }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 800 }}/>
      <div style={{
        position: 'fixed', right: 16, top: 60, width: 280, zIndex: 801,
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
        borderRadius: 12, boxShadow: '0 10px 34px rgba(0,0,0,0.15)',
        padding: 18, fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>主題色</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {presets.accentPresets.map((hex) => (
            <button key={hex} onClick={() => setAccent(hex)} style={{
              width: 28, height: 28, borderRadius: 14, background: hex,
              border: themeColors.accent === hex ? '2px solid #000' : '0.5px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }} title={hex}/>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <input type="color" value={themeColors.accent} onChange={(e) => setAccent(e.target.value)}
            style={{ width: 40, height: 28, border: 'none', padding: 0, background: 'transparent' }}/>
          <input type="text" value={themeColors.accent} onChange={(e) => setAccent(e.target.value)}
            style={{ flex: 1, padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 11,
              border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 4 }}/>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {theme === 'v1' ? '紙張底色' : theme === 'v4' ? '漸層壁紙' : '深色底'}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.tonePresets.map((p) => {
            const active = themeColors[presets.toneKey] === p.key;
            return (
              <button key={p.key} onClick={() => setTone(p.key)} style={{
                padding: '6px 10px', borderRadius: 6, fontSize: 11,
                background: active ? 'rgba(0,0,0,0.08)' : '#fff',
                border: '0.5px solid rgba(0,0,0,0.1)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{p.label}</button>
            );
          })}
        </div>
      </div>
    </>
  );
}
window.ColorPicker = ColorPicker;
```

- [ ] **Step 3: Wire both into `ReaderTopBar` and `Reader` in `reader.jsx`**

Replace `ReaderTopBar`:

```jsx
function ReaderTopBar({ book, chapterTitle, onBack, onOpenToc, onOpenTweaks, onOpenColor, settings, onThemeChange }) {
  return (
    <div style={{
      height: 44, padding: '0 16px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: '0.5px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.6)',
      fontFamily: 'var(--ui)', fontSize: 12, flexShrink: 0, zIndex: 5, position: 'relative',
    }}>
      <button onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, padding: '4px 8px' }}>← 書庫</button>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 500 }}>{book.title}</div>
      <div style={{ opacity: 0.5 }}>·</div>
      <div style={{ opacity: 0.7 }}>{chapterTitle}</div>
      <div style={{ flex: 1 }}/>
      <ThemeSwitcher settings={settings} onChange={onThemeChange}/>
      <button onClick={onOpenToc} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>目錄 (T)</button>
      <button onClick={onOpenTweaks} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>Aa (,)</button>
      <button onClick={onOpenColor} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11 }}>🎨</button>
    </div>
  );
}
```

In `Reader`, add color-picker open state and wire handlers:

```jsx
  const [colorOpen, setColorOpen] = React.useState(false);

  async function changeTheme(key) {
    await setSettings({ activeTheme: key });
  }

  // In the return JSX, replace ReaderTopBar invocation:
  // ...
  <ReaderTopBar
    book={book} chapterTitle={chapterTitle} onBack={backToLibrary}
    onOpenToc={() => setTocOpen(true)} onOpenTweaks={() => setTweaksOpen(true)}
    onOpenColor={() => setColorOpen(true)}
    settings={settings} onThemeChange={changeTheme}
  />
  // ...
  // And after TweaksPanel in the returned JSX, add:
  <ColorPicker settings={settings} open={colorOpen} onClose={() => setColorOpen(false)}
    onChange={async (patch) => { await setSettings(patch); }}/>
```

- [ ] **Step 4: Manual verify**

Open a book. In the top bar, three theme chips visible (Warm / Glass / Dark). Click each → theme swaps live (gradient / paper / dark).

Click `🎨`:
- Under V1: six round accent swatches (赭紅, 朱, 橄欖, 墨, etc.) + color input + tone presets (羊皮紙/月白/...). Click a preset → the reader updates.
- Switch to V4 → picker shows gradient presets (晨曦/薄暮/青空/墨染).
- Switch to V5 → picker shows dark tones (墨綠/玄黑/赭褐) + gold-family accents.

Each theme's accent persists independently: set V1 accent to blue, switch to V4, back to V1 → blue still there.

- [ ] **Step 5: Commit**

```bash
git add src/ui/theme-switcher.jsx src/ui/color-picker.jsx src/reader.jsx
git commit -m "feat(reader): theme switcher and per-theme accent/tone color picker"
```

---

## Task 20: Firefox/Safari fallback banner, error polish, README

**Files:**
- Modify: `C:\dev\novel-reader\src\library.jsx`
- Modify: `C:\dev\novel-reader\src\app.jsx` (error boundary)
- Create: `C:\dev\novel-reader\README.md`

- [ ] **Step 1: Add compatibility banner to `library.jsx`**

At the top of `Library`'s return, after the grid container opens, insert a compatibility banner when unsupported:

Replace the beginning of the `<aside>` in `LibrarySidebar`:

```jsx
  const supportsFS = 'showDirectoryPicker' in window;
  // ...
  return (
    <aside style={{
      borderRight: '0.5px solid rgba(0,0,0,0.08)',
      background: '#EFEBE2', padding: '24px 16px',
      overflowY: 'auto',
    }} className="scroll-thin">
      {/* existing content */}
      {!supportsFS && (
        <div style={{
          margin: '14px 0', padding: '10px 12px', background: 'rgba(179,38,30,0.08)',
          borderRadius: 6, fontSize: 11, lineHeight: 1.6, color: '#7A1D14',
        }}>
          目前瀏覽器不支援「加根目錄」功能。請改用 Chrome / Edge / Brave 取得書庫掃描能力。你還是可以用「加單檔」逐本載入。
        </div>
      )}
      {/* ...existing sections below */}
    </aside>
  );
```

Make sure `supportsFS` is declared inside `LibrarySidebar` (before the `return`).

- [ ] **Step 2: Error boundary in `app.jsx`**

At the top of `src/app.jsx`, above `function App`, add:

```jsx
class AppErrorBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: null }; }
  static getDerivedStateFromError(err) { return { err }; }
  componentDidCatch(err, info) { console.error(err, info); }
  render() {
    if (this.state.err) {
      return (
        <div className="nr-root" style={{
          width: '100%', height: '100vh', display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 14, background: '#F7F5F0', color: '#2B241B', padding: 20,
        }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 18 }}>出錯了</div>
          <pre style={{ fontSize: 11, maxWidth: 520, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', padding: 14, overflow: 'auto', borderRadius: 6 }}>{String(this.state.err && (this.state.err.stack || this.state.err.message))}</pre>
          <button onClick={() => window.location.reload()} style={{ padding: '6px 14px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 6, cursor: 'pointer' }}>重新整理</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

Wrap `<App/>` in the mount call:
```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
  <AppErrorBoundary><App/></AppErrorBoundary>
);
```

- [ ] **Step 3: Write `README.md`**

```markdown
# Novel Reader

A local-first desktop novel reader for EPUB and TXT. Three runtime-switchable atmospheric themes (Warm Library, Ambient Glass, Dark Serif), library view with recursive folder scanning, and per-book reading position.

## Requirements

- **Chromium browser** (Chrome, Edge, Brave) for full functionality — the library scan uses the File System Access API.
- Firefox and Safari work in single-file mode only (no folder scanning).
- The app is client-side and offline once the CDN deps are cached.

## Usage

```sh
cd C:\dev\novel-reader
python -m http.server 8080
```

Then open <http://localhost:8080/novel-reader.html>.

The `http://` URL is required for the File System Access API; `file://` disables it.

### Adding books

- **＋ 加根目錄**: pick a folder like `C:\dev\esjzone-scraper\books` — all `.epub` files under it (recursive) are indexed.
- **＋ 加單檔**: pick a single `.epub` or `.txt` file.

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `←` / `→` | Previous / next chapter |
| `PgUp` / `PgDn` / `Space` | Page scroll |
| `T` | Toggle TOC drawer |
| `,` | Toggle tweaks panel |
| `F` | Toggle fullscreen |
| `Esc` | Back to library |

### Themes

Top-right chips: **Warm** / **Glass** / **Dark**. Click to switch. The `🎨` button opens a per-theme color picker (accent + background preset).

### Per-book settings

The tweaks panel (`,` or `Aa` button) includes "保留原始 EPUB 排版" — enable if a specific book has important embedded styling (e.g., poetry, manga).

## Architecture

See `docs/superpowers/specs/2026-04-24-novel-reader-design.md`.

## Stack

React 18 + Babel standalone (CDN), JSZip for EPUB parsing, IndexedDB for persistence, File System Access API for folder handles.
```

- [ ] **Step 4: Manual verify**

Open in Chrome → no banner in sidebar.
Open in Firefox → banner visible: "目前瀏覽器不支援「加根目錄」功能…". "加根目錄" button is hidden. "加單檔" works.

Intentionally break something (e.g. `throw new Error('test')` in a component) to verify the error boundary shows the crash screen. Revert.

- [ ] **Step 5: Commit**

```bash
git add src/library.jsx src/app.jsx README.md
git commit -m "feat: Firefox/Safari fallback banner, error boundary, README"
```

---

## Completion checklist

After all 20 tasks land, verify the full test matrix from the spec (`Testing strategy` section):

- [ ] 1. Open scraper-produced EPUB → TOC + chapter 1 render
- [ ] 2. Open novelpia EPUB with Korean title → non-ASCII fine
- [ ] 3. Add `esjzone-scraper/books` as root → ≥10 books scanned
- [ ] 4. Add a second root → both visible
- [ ] 5. Switch themes V1→V4→V5 → scroll preserved
- [ ] 6. Change V4 accent to `#4A90E2` → only V4 affected; persists after reload
- [ ] 7. Change fontSize 17→20 → no layout jumps
- [ ] 8. Toggle "preserve original EPUB CSS" on a book → rendering changes
- [ ] 9. Close + reopen browser → library visible; re-grant permission → opens at remembered scroll
- [ ] 10. Load a TXT → chapters detected, readable
- [ ] 11. Firefox/Safari → single-file open works; root button hidden

If all pass → v1 complete.

---

## Self-review notes (for the plan author)

- **Spec coverage**: Task 1 bootstraps; Tasks 2-3 cover the IDB schema (roots/books/settings/kv); Tasks 4-6 cover EPUB (metadata+TOC+cover+chapter) + TXT parsers; Task 7-12 cover the library view (sidebar/grid/add-root/add-file/context-menu/search-sort); Tasks 13-15 cover reader shell + cache + TOC/tweaks/keyboard; Tasks 16-18 cover the three themes; Task 19 covers theme switching + color picker; Task 20 covers Firefox fallback + error boundary + README. The only spec item not explicitly tasked is "reveal in file manager" (listed as out-of-scope).
- **Placeholder scan**: No "TBD" / "implement later" left. Every step has concrete code or a concrete command.
- **Type consistency**: `booksStore` signature matches throughout (add/get/list/update/remove/addTag/removeTag/addCollection/removeCollection). `epubParser.parseMetadata` → `{ title, author, coverBlob, chaptersMeta, _internal }`; `epubParser.getChapter(blob, parsed, chapterId, opts)` → `{ html, extraCss, blobUrls }`. Same shape for `txtParser`. Theme components all accept `{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }`.
- **Minor lint**: Task 7's original `BookGrid` is superseded by Task 8's `BookCard`-based version and then Task 11's right-click-enabled version — the final `BookCard` is what ships. The plan does the replacement in each task so the engineer always has the current code.
