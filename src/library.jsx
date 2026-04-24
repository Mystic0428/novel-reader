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
    out = out.filter((b) => (b.tags || []).includes(settings.filterTag));
  }
  if (settings.filterCollection) {
    out = out.filter((b) => (b.collections || []).includes(settings.filterCollection));
  }
  // Sort (Task 12 extends this). All comparators return natural ascending; `order` flips
  // to descending when sortOrder === 'desc' (the default).
  const order = settings.sortOrder === 'asc' ? 1 : -1;
  out = [...out].sort((a, b) => {
    switch (settings.sortBy) {
      case 'title': return a.title.localeCompare(b.title) * order;
      case 'author': return (a.author || '').localeCompare(b.author || '') * order;
      case 'addedAt': return (a.addedAt - b.addedAt) * order;
      case 'lastRead':
      default:
        return ((a.lastReadAt || a.addedAt) - (b.lastReadAt || b.addedAt)) * order;
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
  const [busy, setBusy] = React.useState(null);   // { current, total, name } | null
  const supported = 'showDirectoryPicker' in window;

  async function addRoot() {
    if (busy || !supported) return;
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
      {books.map((b) => <BookCard key={b.id} book={b} dispatch={dispatch}/>)}
    </div>
  );
}

function BookCard({ book, dispatch }) {
  const [hover, setHover] = React.useState(false);
  const progress = bookProgress(book);
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
          width: `${progress * 100}%`,
          height: '100%', background: book.accent || '#8C3A2E',
        }}/>
      </div>
      {book.tags && book.tags.length > 0 && hover && (
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
  const keptBefore = existingPaths.size;
  let added = 0;
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
      added++;
    } catch (err) {
      console.warn('Failed to parse', relPath, err);
    }
  }

  // 3) mark root scanned. bookCount is indexed-books, not files-found, so parse failures
  // aren't hidden as phantom entries in the sidebar.
  await rootsStore.update(root.id, {
    lastScannedAt: Date.now(),
    bookCount: keptBefore + added,
  });
  setBusy(null);

  // 4) refresh state
  const [newBooks, newRoots] = await Promise.all([booksStore.list(), rootsStore.list()]);
  dispatch({ type: 'SET_BOOKS', books: newBooks });
  dispatch({ type: 'SET_ROOTS', roots: newRoots });
}

// Fraction in [0, 1]. Returns 0 for unread, stale (chapter not in current TOC), or empty-meta books.
function bookProgress(b) {
  const meta = b.chaptersMeta || [];
  if (!b.lastChapterId || meta.length === 0) return 0;
  const idx = meta.findIndex((c) => c.id === b.lastChapterId);
  if (idx === -1) return 0;
  const raw = (idx + (b.lastScroll || 0)) / meta.length;
  return Math.max(0, Math.min(1, raw));
}
