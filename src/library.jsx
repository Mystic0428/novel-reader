// src/library.jsx — Netflix-style home
function Library() {
  const { state, dispatch } = React.useContext(AppContext);
  const { books, roots, settings } = state;
  const [search, setSearch] = React.useState('');
  const searchInputRef = React.useRef(null);

  const tags = React.useMemo(() => booksStore.allTags(books), [books]);
  const collections = React.useMemo(() => booksStore.allCollections(books), [books]);

  // `/` shortcut to focus the search box (skipped when already typing).
  React.useEffect(() => {
    function onKey(e) {
      if (e.key !== '/') return;
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      e.preventDefault();
      if (searchInputRef.current) searchInputRef.current.focus();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  async function clearAllFilters() {
    setSearch('');
    if (settings.filterTag || settings.filterCollection) {
      const next = await settingsStore.save({ filterTag: null, filterCollection: null });
      dispatch({ type: 'SET_SETTINGS', settings: next });
    }
  }

  // Auto-scan permitted roots on mount so newly-scraped books appear without
  // manual action. Silent — no busy banner, no permission prompt (skip un-granted).
  React.useEffect(() => {
    if (roots.length === 0) return;
    let cancelled = false;
    (async () => {
      for (const root of roots) {
        if (cancelled) return;
        try {
          if (!root.dirHandle || !root.dirHandle.queryPermission) continue;
          const perm = await root.dirHandle.queryPermission({ mode: 'read' });
          if (perm !== 'granted') continue;
          await scanRoot(root, null, dispatch);
        } catch (err) {
          console.warn('Auto-scan failed for', root.name, err);
        }
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, []);

  const filterActive = !!(settings.filterTag || settings.filterCollection || search.trim());

  const filtered = React.useMemo(() => {
    let out = filterBooks(books, settings);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (b.collections || []).some((c) => c.toLowerCase().includes(q))
      );
    }
    return out;
  }, [books, settings, search]);

  const hasLibrary = roots.length > 0 || books.length > 0;
  const supportsFS = 'showDirectoryPicker' in window;

  // Data slices for Netflix rows. "繼續閱讀" and "有新章節" keep their purpose-specific
  // order (last read / new-chapter count). Other rows follow the user's sort choice.
  // Any book the user has touched stays in 繼續閱讀, including ones at the last
  // chapter — re-readers want quick access regardless of "100% done" math, and
  // the row's lastReadAt-desc sort + 10-item cap means stale books fall off
  // naturally.
  const currentlyReading = React.useMemo(() =>
    books.filter((b) => b.lastReadAt)
      .sort((a, b) => (b.lastReadAt || 0) - (a.lastReadAt || 0)),
  [books]);

  const fresh = React.useMemo(() =>
    books.filter((b) => newChapterCount(b) > 0)
      .sort((a, b) => newChapterCount(b) - newChapterCount(a)),
  [books]);

  const allSorted = React.useMemo(() => sortBooks(books, settings), [books, settings.sortBy, settings.sortOrder]);

  const byCollection = React.useMemo(() => collections
    .map((c) => ({ name: c, books: allSorted.filter((b) => (b.collections || []).includes(c)) }))
    .filter((g) => g.books.length >= 3)
    .slice(0, 6),
  [allSorted, collections]);

  const byTag = React.useMemo(() => tags
    .map((t) => ({ name: t, books: allSorted.filter((b) => (b.tags || []).includes(t)) }))
    .filter((g) => g.books.length >= 3)
    .slice(0, 6),
  [allSorted, tags]);

  const hero = currentlyReading[0] || allSorted[0];

  const [statsOpen, setStatsOpen] = React.useState(false);
  const [cardBookId, setCardBookId] = React.useState(null);
  const cardBook = cardBookId ? books.find((b) => b.id === cardBookId) : null;
  async function refreshBooks() {
    const next = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books: next });
  }
  // Expose card opener globally so BookMenu instances (rendered deep inside
  // RowCards across multiple BookRows / FilteredView) can trigger it without
  // prop-drilling through 4 layers.
  React.useEffect(() => {
    window.openBookCard = (book) => setCardBookId(book.id);
    return () => { delete window.openBookCard; };
  }, []);

  return (
    <div className="nr-root" style={{
      display: 'flex', flexDirection: 'column', height: '100vh',
      background: '#0B0B0E', color: '#F4F4F6',
      fontFamily: '"Inter","Noto Sans TC",sans-serif',
    }}>
      {!supportsFS && (
        <div style={{
          padding: '10px 50px', background: 'rgba(229,9,20,0.14)',
          fontSize: 11, lineHeight: 1.6, color: '#FFB2B2',
          borderBottom: '0.5px solid rgba(229,9,20,0.3)',
        }}>
          目前瀏覽器不支援「加根目錄」功能。請改用 Chrome / Edge / Brave 取得書庫掃描能力。你還是可以用「加單檔」逐本載入。
        </div>
      )}
      <HomeTopBar
        settings={settings} dispatch={dispatch}
        search={search} onSearchChange={setSearch} searchInputRef={searchInputRef}
        books={books} roots={roots}
        onOpenStats={() => setStatsOpen(true)}
      />
      <StatsPanel open={statsOpen} onClose={() => setStatsOpen(false)}
        books={books} onOpenBook={(id) => { setStatsOpen(false); openBook(id, dispatch); }}/>
      <BookCard book={cardBook} open={!!cardBook} onClose={() => setCardBookId(null)}
        onOpenBook={(id) => openBook(id, dispatch)} onChanged={refreshBooks}/>
      <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minHeight: 0, scrollbarGutter: 'stable' }} className="scroll-thin">
        {!hasLibrary ? (
          <HomeEmpty/>
        ) : filterActive ? (
          <FilteredView books={filtered} tags={tags} collections={collections}
            search={search} settings={settings} dispatch={dispatch}
            onClearAll={clearAllFilters}/>
        ) : (
          <>
            {hero && <Hero book={hero} dispatch={dispatch}/>}
            <div style={{ padding: '20px 0 40px' }}>
              {fresh.length > 0 && <BookRow title="🔥 有新章節" tint="#D94A3E" books={fresh.slice(0, 20)} total={fresh.length} dispatch={dispatch}/>}
              {currentlyReading.length > 0 && <BookRow title="繼續閱讀" books={currentlyReading.slice(0, 10)} total={currentlyReading.length} dispatch={dispatch}/>}
              <BookRow title={`全部藏書 · ${sortLabel(settings)}`} books={allSorted.slice(0, 20)} total={allSorted.length} dispatch={dispatch}/>
              {byCollection.map((g) => (
                <BookRow key={`col-${g.name}`} title={`📁 ${g.name}`} books={g.books.slice(0, 16)} total={g.books.length} dispatch={dispatch}/>
              ))}
              {byTag.map((g) => (
                <BookRow key={`tag-${g.name}`} title={`# ${g.name}`} books={g.books.slice(0, 16)} total={g.books.length} dispatch={dispatch}/>
              ))}
              {(tags.length > 0 || collections.length > 0) && (
                <CategoryBrowse tags={tags} collections={collections} books={books} dispatch={dispatch}/>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
window.Library = Library;

function Hero({ book, dispatch }) {
  const [coverUrl, setCoverUrl] = React.useState(null);
  React.useEffect(() => {
    if (!book.coverBlob) { setCoverUrl(null); return; }
    const u = URL.createObjectURL(book.coverBlob);
    setCoverUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [book.coverBlob]);

  const progress = bookProgress(book);
  const chapterIdx = (book.chaptersMeta || []).findIndex((c) => c.id === book.lastChapterId);
  const rawChapterTitle = chapterIdx >= 0 ? (book.chaptersMeta[chapterIdx].title || '') : (book.chaptersMeta?.[0]?.title || '');
  const chapterTitle = stripChapterPrefix(rawChapterTitle);
  const total = (book.chaptersMeta || []).length;
  const current = chapterIdx >= 0 ? chapterIdx + 1 : 0;
  const red = '#E50914', bg = '#0B0B0E';
  const coverBg = coverUrl ? `url(${coverUrl}) center/cover` : (book.accent || '#6B2832');
  const lastReadLabel = book.lastReadAt ? relTime(book.lastReadAt) : '尚未開始';

  return (
    <section style={{ position: 'relative', height: 380, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0, background: coverBg,
        filter: 'blur(24px) brightness(0.45)', transform: 'scale(1.1)',
      }}/>
      <div style={{ position: 'absolute', inset: 0,
        background: `linear-gradient(90deg, ${bg} 0%, rgba(11,11,14,0.55) 50%, transparent 100%),
                     linear-gradient(180deg, transparent 55%, ${bg} 100%)` }}/>
      <div style={{ position: 'relative', padding: '60px 50px', display: 'flex', gap: 40, height: '100%' }}>
        <div style={{ alignSelf: 'center', flexShrink: 0 }}>
          <Cover book={book} size="xl"/>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 760 }}>
          <div style={{ fontSize: 11, color: red, letterSpacing: '0.4em', fontWeight: 700, marginBottom: 10 }}>
            ▶ 繼續閱讀
          </div>
          <div style={{
            fontSize: 56, fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.02em',
            fontFamily: '"Noto Serif TC",serif', textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}>{book.title}</div>
          <div style={{ fontSize: 15, color: 'rgba(244,244,246,0.78)', marginTop: 6 }}>
            {book.author || '—'}{chapterTitle ? ` · ${chapterTitle}` : ''}
          </div>
          <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ flex: 1, maxWidth: 380 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(244,244,246,0.55)', marginBottom: 4 }}>
                <span>{current > 0 ? `${current} / ${total} 章` : `共 ${total} 章`}</span>
                <span>{Math.round(progress * 100)}%</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2 }}>
                <div style={{ width: `${progress * 100}%`, height: '100%', background: red, borderRadius: 2 }}/>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(244,244,246,0.55)' }}>上次閱讀 · {lastReadLabel}</div>
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
            <button onClick={() => openBook(book.id, dispatch)} style={{
              padding: '11px 26px', background: '#F4F4F6', color: bg, border: 'none',
              borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em',
            }}>
              ▶  繼續閱讀
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookRow({ title, books, tint, total, dispatch }) {
  const scrollRef = React.useRef(null);
  const dragRef = React.useRef({
    active: false, startX: 0, startLeft: 0, moved: 0,
    lastX: 0, lastTime: 0, velocity: 0,
  });
  const animRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  function cancelInertia() {
    if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
  }
  React.useEffect(() => () => cancelInertia(), []);

  const scroll = (dir) => {
    cancelInertia();
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 600, behavior: 'smooth' });
  };

  function onPointerDown(e) {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const el = scrollRef.current;
    if (!el) return;
    cancelInertia();
    dragRef.current = {
      active: true, startX: e.pageX, startLeft: el.scrollLeft, moved: 0,
      lastX: e.pageX, lastTime: performance.now(), velocity: 0,
      captured: false,
    };
    // Don't capture pointer or set dragging until movement crosses threshold —
    // otherwise a plain click on a card/menu item would also trigger drag side effects.
  }
  function onPointerMove(e) {
    const d = dragRef.current;
    if (!d.active) return;
    const dx = e.pageX - d.startX;
    d.moved = Math.max(d.moved, Math.abs(dx));
    if (d.moved <= 5) return; // still a click, not a drag
    if (!d.captured) {
      d.captured = true;
      setDragging(true);
      try { scrollRef.current.setPointerCapture(e.pointerId); } catch (_) {}
    }
    scrollRef.current.scrollLeft = d.startLeft - dx;
    const now = performance.now();
    const dt = now - d.lastTime;
    if (dt > 0) {
      const instVel = (e.pageX - d.lastX) / dt; // px/ms
      d.velocity = d.velocity * 0.7 + instVel * 0.3; // low-pass smoothing
    }
    d.lastX = e.pageX;
    d.lastTime = now;
  }
  function onPointerUp(e) {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (!d.captured) return; // was a plain click, leave click event alone
    setDragging(false);
    const el = scrollRef.current;
    try { if (el && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); } catch (_) {}
    if (Math.abs(d.velocity) > 0.05) {
      let vel = -d.velocity * 16;
      const step = () => {
        if (!scrollRef.current) { animRef.current = null; return; }
        scrollRef.current.scrollLeft += vel;
        vel *= 0.95;
        if (Math.abs(vel) > 0.5) animRef.current = requestAnimationFrame(step);
        else animRef.current = null;
      };
      animRef.current = requestAnimationFrame(step);
    }
  }
  function onClickCapture(e) {
    if (dragRef.current.moved > 5) { e.stopPropagation(); e.preventDefault(); }
  }

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, padding: '0 50px' }}>
        <div style={{ fontSize: 19, fontWeight: 700, color: tint || '#F4F4F6', letterSpacing: '-0.01em' }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(244,244,246,0.4)' }}>{total ?? books.length} 本</div>
        <div style={{ flex: 1 }}/>
        <button onClick={() => scroll(-1)} style={rowNavBtn()}>‹</button>
        <button onClick={() => scroll(1)} style={rowNavBtn()}>›</button>
      </div>
      <div ref={scrollRef} className="scroll-hidden"
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
        style={{
          display: 'flex', gap: 16, padding: '12px 50px 16px', overflowX: 'auto', scrollSnapType: 'x proximity',
          cursor: dragging ? 'grabbing' : 'grab', userSelect: 'none',
        }}>
        {books.map((b) => <RowCard key={b.id} book={b} dispatch={dispatch}/>)}
      </div>
    </div>
  );
}

function rowNavBtn() {
  return {
    width: 28, height: 28, borderRadius: 14,
    background: 'rgba(255,255,255,0.08)', color: '#F4F4F6',
    border: '0.5px solid rgba(255,255,255,0.12)', cursor: 'pointer',
    fontSize: 16, lineHeight: 1, padding: 0, fontFamily: 'inherit',
  };
}

function RowCard({ book, dispatch }) {
  const [hover, setHover] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState(null);
  const newCount = newChapterCount(book);
  const progress = bookProgress(book);
  async function refresh() {
    const bs = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books: bs });
  }
  return (
    <>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => openBook(book.id, dispatch)}
        onContextMenu={(e) => { e.preventDefault(); setMenuPos({ x: e.clientX, y: e.clientY }); }}
        style={{
          width: 150, flex: '0 0 auto', cursor: 'pointer', scrollSnapAlign: 'start',
          transition: 'transform 180ms ease',
          transform: hover ? 'translateY(-4px)' : 'translateY(0)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <Cover book={book} size="xl"/>
          {newCount > 0 && (
            <span style={{
              position: 'absolute', top: -6, right: -6,
              minWidth: 24, height: 24, padding: '0 7px',
              background: '#D94A3E', color: '#fff',
              borderRadius: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              boxShadow: '0 2px 8px rgba(217,74,62,0.5)',
            }} title={`${newCount} 章新增`}>+{newCount}</span>
          )}
          {progress > 0 && progress < 1 && (
            <div style={{
              position: 'absolute', left: 6, right: 6, bottom: 6, height: 3,
              background: 'rgba(0,0,0,0.45)', borderRadius: 2, overflow: 'hidden',
            }}>
              <div style={{ width: `${progress * 100}%`, height: '100%', background: '#E50914' }}/>
            </div>
          )}
        </div>
        <div style={{
          fontSize: 13, color: '#F4F4F6', marginTop: 8, fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }} title={book.title}>{book.title}</div>
        <div style={{ fontSize: 11, color: 'rgba(244,244,246,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {book.author || '—'}
        </div>
      </div>
      {menuPos && (
        <BookMenu book={book} anchorPos={menuPos} onClose={() => setMenuPos(null)} onChanged={refresh}/>
      )}
    </>
  );
}

function CategoryBrowse({ tags, collections, books, dispatch }) {
  async function setFilter(patch) {
    const next = await settingsStore.save(patch);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }
  const items = [
    ...collections.map((c) => ({ key: `c-${c}`, label: c, kind: '📁 合集', onClick: () => setFilter({ filterCollection: c, filterTag: null }), count: books.filter((b) => (b.collections || []).includes(c)).length })),
    ...tags.map((t) => ({ key: `t-${t}`, label: t, kind: '# 標籤', onClick: () => setFilter({ filterTag: t, filterCollection: null }), count: books.filter((b) => (b.tags || []).includes(t)).length })),
  ];
  if (items.length === 0) return null;
  const palette = ['#B8302A', '#4A6E7C', '#C84838', '#2E3A4E', '#8C4878', '#2E7E8A', '#6A5838', '#7A3A58'];
  return (
    <div style={{ padding: '10px 50px 0' }}>
      <div style={{ fontSize: 19, fontWeight: 700, marginBottom: 14 }}>分類瀏覽</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
        {items.map((c, i) => (
          <button key={c.key} onClick={c.onClick} style={{
            padding: '18px 16px', background: '#16161C',
            border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 8,
            cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 4,
            textAlign: 'left', fontFamily: 'inherit', color: '#F4F4F6',
          }}>
            <div style={{ fontSize: 26, fontFamily: 'var(--serif)', color: palette[i % palette.length], fontWeight: 700, lineHeight: 1 }}>
              {(c.label || '').slice(0, 1)}
            </div>
            <div style={{ fontSize: 13, color: '#F4F4F6', fontWeight: 600, marginTop: 6 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(244,244,246,0.55)' }}>{c.kind} · {c.count} 本</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function FilteredView({ books, tags, collections, search, settings, dispatch, onClearAll }) {
  async function setFilter(patch) {
    const next = await settingsStore.save(patch);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }
  const hasFilter = !!(settings.filterTag || settings.filterCollection);
  const hasSearch = !!(search && search.trim());
  return (
    <div style={{ padding: '24px 50px 60px' }}>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
        {tags.map((t) => (
          <button key={`t-${t}`} onClick={() => setFilter({ filterTag: settings.filterTag === t ? null : t })} style={chipStyleDark(settings.filterTag === t)}>
            # {t}
          </button>
        ))}
        {collections.map((c) => (
          <button key={`c-${c}`} onClick={() => setFilter({ filterCollection: settings.filterCollection === c ? null : c })} style={chipStyleDark(settings.filterCollection === c)}>
            📁 {c}
          </button>
        ))}
        {hasSearch && (
          <button style={chipStyleDark(true)} onClick={onClearAll}>
            🔍 "{search.trim()}" ✕
          </button>
        )}
        {(hasFilter || hasSearch) && (
          <button style={{ ...chipStyleDark(false), color: '#FF7A6F' }} onClick={onClearAll}>
            ✕ 清除全部
          </button>
        )}
      </div>
      {books.length === 0 ? (
        <div style={{ padding: '80px 20px', textAlign: 'center', color: 'rgba(244,244,246,0.55)' }}>
          <div style={{ fontSize: 28, marginBottom: 14, fontFamily: 'var(--serif)', color: '#F4F4F6' }}>沒有符合的書</div>
          <div style={{ fontSize: 12, marginBottom: 20, color: 'rgba(244,244,246,0.45)' }}>
            {hasSearch && hasFilter && `搜尋「${search.trim()}」+ 套用了篩選條件`}
            {hasSearch && !hasFilter && `搜尋「${search.trim()}」找不到結果`}
            {!hasSearch && hasFilter && '套用了篩選條件，但沒有書符合'}
          </div>
          <button onClick={onClearAll} style={{
            padding: '8px 18px', borderRadius: 4, fontSize: 12, fontFamily: 'inherit',
            background: '#E50914', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
          }}>清除全部條件</button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 24,
        }}>
          {books.map((b) => <RowCard key={b.id} book={b} dispatch={dispatch}/>)}
        </div>
      )}
    </div>
  );
}

function chipStyleDark(active) {
  return {
    padding: '6px 12px', borderRadius: 14, fontSize: 12,
    border: `0.5px solid ${active ? 'rgba(229,9,20,0.6)' : 'rgba(255,255,255,0.14)'}`,
    background: active ? 'rgba(229,9,20,0.14)' : 'rgba(255,255,255,0.03)',
    color: '#F4F4F6', cursor: 'pointer', fontFamily: 'inherit',
  };
}

function HomeEmpty() {
  return (
    <div style={{
      textAlign: 'center', padding: '120px 0', color: 'rgba(244,244,246,0.55)',
      fontFamily: 'var(--serif)',
    }}>
      <div style={{ fontSize: 32, marginBottom: 14, letterSpacing: '0.2em', color: '#F4F4F6' }}>書架空無一物</div>
      <div style={{ fontSize: 13, lineHeight: 2 }}>
        點上方「📁 根目錄」加資料夾掃描，或「＋ 加單檔」載入一本 EPUB / TXT。
      </div>
    </div>
  );
}

function HomeTopBar({ settings, dispatch, search, onSearchChange, searchInputRef, books, roots, onOpenStats }) {
  const [busy, setBusy] = React.useState(null);
  const supported = 'showDirectoryPicker' in window;

  async function addRoot() {
    if (busy || !supported) return;
    let dirHandle;
    try { dirHandle = await window.showDirectoryPicker(); }
    catch (_) { return; }
    const granted = await rootsStore.ensurePermission(dirHandle, 'read');
    if (!granted) { alert('需要讀取權限'); return; }
    const excludeInput = window.prompt(
      `要排除哪些子資料夾名稱？\n用逗號分隔，留空 = 不排除。\n例如：ko, ja, raw, 原文`,
      ''
    );
    if (excludeInput === null) return;
    const excludeDirs = excludeInput.split(',').map((s) => s.trim()).filter(Boolean);
    const root = await rootsStore.add({ name: dirHandle.name, dirHandle, excludeDirs });
    await safeScan(root);
  }

  async function editRootExcludes(root) {
    if (busy) return;
    const current = (root.excludeDirs || []).join(', ');
    const next = window.prompt(
      `排除子資料夾名稱（逗號分隔，留空 = 不排除）：\n例如：ko, ja, raw, 原文`,
      current
    );
    if (next === null) return;
    const excludeDirs = next.split(',').map((s) => s.trim()).filter(Boolean);
    const updated = await rootsStore.update(root.id, { excludeDirs });
    await safeScan(updated);
  }

  async function rescanRoot(root) {
    if (busy) return;
    const granted = await rootsStore.ensurePermission(root.dirHandle, 'read');
    if (!granted) { alert('需要讀取權限'); return; }
    await safeScan(root);
  }

  // Wraps scanRoot so a NotReadableError / permission error / IDB hiccup
  // doesn't leave the busy banner stuck or surface as an "Uncaught (in
  // promise)" in the console with no UI feedback.
  async function safeScan(root) {
    try {
      await scanRoot(root, setBusy, dispatch);
    } catch (err) {
      console.warn('Scan failed:', err);
      setBusy(null);
      alert(`掃描遇到問題：${err.message || err}\n\n部分書可能沒讀進來，可能是檔案被防毒軟體 / 雲端同步 / 爬蟲 lock 住。等一下再點重新掃描試試。`);
    }
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

  async function removeRoot(id) {
    const root = (await rootsStore.list()).find((r) => r.id === id);
    const allBooks = await booksStore.list();
    const fromRoot = allBooks.filter((b) => b.rootId === id);
    const label = root ? `「${root.name}」` : '此根目錄';
    const msg = fromRoot.length > 0
      ? `移除${label}？\n會一併刪除 ${fromRoot.length} 本書（含閱讀進度、tags、collections）。\n磁碟上的檔案不會被刪除。`
      : `移除${label}？`;
    if (!confirm(msg)) return;
    for (const b of fromRoot) {
      await booksStore.remove(b.id);
    }
    await rootsStore.remove(id);
    const [newRoots, newBooks] = await Promise.all([rootsStore.list(), booksStore.list()]);
    dispatch({ type: 'SET_ROOTS', roots: newRoots });
    dispatch({ type: 'SET_BOOKS', books: newBooks });
  }

  async function setSort(sortBy) {
    const order = settings.sortBy === sortBy
      ? (settings.sortOrder === 'asc' ? 'desc' : 'asc')
      : 'desc';
    const next = await settingsStore.save({ sortBy, sortOrder: order });
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10, padding: '16px 50px',
      background: 'linear-gradient(180deg, #0B0B0E 0%, rgba(11,11,14,0.88) 100%)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', gap: 24,
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: '#E50914', letterSpacing: '-0.02em', fontFamily: 'var(--serif)', lineHeight: 1 }}>Novel Reader</span>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(244,244,246,0.5)', lineHeight: 1, transform: 'translateY(4px)' }}>{books.length} 本藏書</span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ position: 'relative', width: 320 }}>
        <input ref={searchInputRef} placeholder="🔍 搜尋書名、作者、標籤…  ( / )"
          value={search || ''}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape' && search) { onSearchChange(''); e.currentTarget.blur(); } }}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '8px 32px 8px 14px',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 4, fontSize: 12, fontFamily: 'inherit',
            background: 'rgba(22,22,28,0.85)', color: '#F4F4F6', outline: 'none',
            cursor: 'text',
          }}/>
        {search && search.length > 0 && (
          <button onClick={() => { onSearchChange(''); searchInputRef.current?.focus(); }} style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            width: 22, height: 22, borderRadius: 11, border: 'none',
            background: 'rgba(255,255,255,0.12)', color: 'rgba(244,244,246,0.7)',
            fontSize: 11, lineHeight: 1, cursor: 'pointer', padding: 0,
            fontFamily: 'inherit',
          }} title="清除搜尋">✕</button>
        )}
      </div>
      <SortDropdown settings={settings} onSort={setSort}/>
      <button onClick={onOpenStats} style={addBtnStyleDark()} title="閱讀統計">📊</button>
      <RootsDropdownDark roots={roots} onAddRoot={addRoot} onRemoveRoot={removeRoot} onEditRoot={editRootExcludes} onRescanRoot={rescanRoot} supported={supported}/>
      <button onClick={addFile} style={addBtnStyleDark()}>＋ 加檔</button>
      {busy && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: -1, padding: '6px 50px',
          fontSize: 11, color: '#FFB2B2', background: 'rgba(229,9,20,0.12)',
          borderBottom: '1px solid rgba(229,9,20,0.3)',
        }}>
          掃描中 {busy.current}/{busy.total}: {busy.name.slice(-60)}
        </div>
      )}
    </header>
  );
}

function SortDropdown({ settings, onSort }) {
  const [open, setOpen] = React.useState(false);
  const options = [
    { key: 'lastRead', label: '最近讀' },
    { key: 'addedAt', label: '加入時間' },
    { key: 'title', label: '書名' },
    { key: 'author', label: '作者' },
  ];
  const active = options.find((o) => o.key === settings.sortBy) || options[0];
  const arrow = settings.sortOrder === 'asc' ? '▲' : '▼';
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={addBtnStyleDark()}>
        ↕ {active.label} {arrow}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 180, zIndex: 101,
            background: '#16161C', border: '0.5px solid rgba(255,255,255,0.14)', borderRadius: 6,
            boxShadow: '0 10px 32px rgba(0,0,0,0.5)', padding: 6, fontFamily: 'var(--ui)',
          }}>
            {options.map((o) => (
              <button key={o.key} onClick={() => { onSort(o.key); setOpen(false); }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 12px', borderRadius: 4, border: 'none',
                background: settings.sortBy === o.key ? 'rgba(255,255,255,0.08)' : 'transparent',
                fontSize: 12, color: '#F4F4F6', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {o.label} {settings.sortBy === o.key ? arrow : ''}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RootsDropdownDark({ roots, onAddRoot, onRemoveRoot, onEditRoot, onRescanRoot, supported }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button style={addBtnStyleDark()} onClick={() => setOpen((o) => !o)}>
        📁 根目錄 {roots.length > 0 && <span style={{ opacity: 0.55, marginLeft: 4 }}>{roots.length}</span>}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 320, zIndex: 101,
            background: '#16161C', border: '0.5px solid rgba(255,255,255,0.14)', borderRadius: 8,
            boxShadow: '0 10px 32px rgba(0,0,0,0.5)', padding: 8, fontFamily: 'var(--ui)', color: '#F4F4F6',
          }}>
            {roots.length === 0 && (
              <div style={{ padding: 14, fontSize: 12, color: 'rgba(244,244,246,0.4)', textAlign: 'center' }}>
                尚未加入任何根目錄
              </div>
            )}
            {roots.map((r) => {
              const excludes = (r.excludeDirs || []).join(', ');
              return (
                <div key={r.id} style={{ padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                  <span>📂</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={r.name}>{r.name}</div>
                    {excludes && (
                      <div style={{ fontSize: 10, color: 'rgba(244,244,246,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={`排除：${excludes}`}>
                        排除：{excludes}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 10, color: 'rgba(244,244,246,0.4)' }}>{r.bookCount}</span>
                  <button onClick={() => onRescanRoot(r)} title="重新掃描此根目錄"
                    style={{
                      width: 20, height: 20, padding: 0, border: 'none', background: 'transparent',
                      color: 'rgba(244,244,246,0.4)', cursor: 'pointer', fontSize: 12,
                    }}>🔄</button>
                  <button onClick={() => onEditRoot(r)} title="編輯排除清單（會重新掃描）"
                    style={{
                      width: 20, height: 20, padding: 0, border: 'none', background: 'transparent',
                      color: 'rgba(244,244,246,0.4)', cursor: 'pointer', fontSize: 12,
                    }}>✎</button>
                  <button onClick={() => onRemoveRoot(r.id)} title="移除此根目錄（不會刪除檔案）"
                    style={{
                      width: 20, height: 20, padding: 0, border: 'none', background: 'transparent',
                      color: 'rgba(244,244,246,0.4)', cursor: 'pointer', fontSize: 14,
                    }}>✕</button>
                </div>
              );
            })}
            {supported && (
              <>
                <div style={{ height: 0.5, background: 'rgba(255,255,255,0.1)', margin: '6px 0' }}/>
                <button onClick={() => { setOpen(false); onAddRoot(); }}
                  style={{ ...addBtnStyleDark(), width: '100%', background: 'transparent', fontSize: 13 }}>
                  ＋ 加根目錄
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function addBtnStyleDark() {
  return {
    padding: '7px 12px', background: 'rgba(255,255,255,0.08)',
    border: '0.5px solid rgba(255,255,255,0.14)', borderRadius: 4,
    fontSize: 12, fontFamily: 'inherit', color: '#F4F4F6', cursor: 'pointer',
  };
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

function filterBooks(books, settings) {
  let out = books;
  if (settings.filterTag) {
    out = out.filter((b) => (b.tags || []).includes(settings.filterTag));
  }
  if (settings.filterCollection) {
    out = out.filter((b) => (b.collections || []).includes(settings.filterCollection));
  }
  return sortBooks(out, settings);
}

function sortBooks(books, settings) {
  const order = settings.sortOrder === 'asc' ? 1 : -1;
  return [...books].sort((a, b) => {
    switch (settings.sortBy) {
      case 'title': return a.title.localeCompare(b.title) * order;
      case 'author': return (a.author || '').localeCompare(b.author || '') * order;
      case 'addedAt': return (a.addedAt - b.addedAt) * order;
      case 'lastRead':
      default:
        return ((a.lastReadAt || a.addedAt) - (b.lastReadAt || b.addedAt)) * order;
    }
  });
}

function sortLabel(settings) {
  const map = { lastRead: '最近讀', addedAt: '加入時間', title: '書名', author: '作者' };
  const arrow = settings.sortOrder === 'asc' ? '↑' : '↓';
  return `${map[settings.sortBy] || '最近讀'} ${arrow}`;
}

async function scanRoot(root, setBusy, dispatch) {
  const excludes = new Set((root.excludeDirs || []).map((s) => s.toLowerCase()));
  const files = [];
  // Each directory walk is wrapped: a NotReadableError on one entry (file lock,
  // antivirus, OneDrive sync, broken symlink) used to throw out of the whole
  // scan because the for-await iterator dies mid-loop. Now it just skips that
  // directory and the parent's iteration continues.
  async function walk(dirHandle, path) {
    try {
      for await (const [name, handle] of dirHandle.entries()) {
        if (handle.kind === 'directory') {
          if (excludes.has(name.toLowerCase())) continue;
          await walk(handle, path + name + '/');
        } else if (name.toLowerCase().endsWith('.epub')) {
          files.push({ handle, relPath: path + name });
        }
      }
    } catch (err) {
      console.warn('Walk failed inside', path || '/', err);
    }
  }
  if (setBusy) setBusy({ current: 0, total: 0, name: root.name });
  await walk(root.dirHandle, '');

  const existing = await booksStore.list();
  const existingForRoot = existing.filter((b) => b.rootId === root.id);
  const existingPaths = new Set(existingForRoot.map((b) => b.relPath));
  const walkedPaths = new Set(files.map((f) => f.relPath));

  // Drop books that are no longer reachable — file moved/deleted on disk OR
  // newly excluded by edited excludeDirs. Keeps IDB in sync with disk state.
  for (const b of existingForRoot) {
    if (!walkedPaths.has(b.relPath)) {
      await booksStore.remove(b.id);
    }
  }

  // Track which single-file (rootId=null) entries we've already promoted in this
  // scan so two scraper-output paths for the same book don't both try to claim
  // the same single-file entry.
  const consumed = new Set();
  let added = 0;
  let done = 0;
  for (const { handle, relPath } of files) {
    done++;
    if (setBusy) setBusy({ current: done, total: files.length, name: relPath });

    // Existing book on this root: re-parse only if file mtime changed since
    // last scan. This is what makes "+N 新章節" badges appear automatically
    // when the scraper rebuilds the EPUB on disk — without this branch the
    // loop used to skip existing entries entirely so chaptersMeta stayed
    // stale until the user manually opened the book.
    if (existingPaths.has(relPath)) {
      const prev = existingForRoot.find((b) => b.relPath === relPath);
      if (!prev) continue;
      try {
        const f = await handle.getFile();
        const sameMtime = prev.fileLastModified != null && f.lastModified === prev.fileLastModified;
        if (sameMtime) continue;
        const meta = await epubParser.parseMetadata(f);
        const lenChanged = meta.chaptersMeta.length !== (prev.chaptersMeta || []).length;
        if (lenChanged) {
          await booksStore.update(prev.id, {
            chaptersMeta: meta.chaptersMeta,
            wordCount: meta.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
            coverBlob: meta.coverBlob || prev.coverBlob,
            fileLastModified: f.lastModified,
          });
        } else {
          // Chapter count unchanged — just persist the new mtime so we
          // skip the parse next scan.
          await booksStore.update(prev.id, { fileLastModified: f.lastModified });
        }
      } catch (err) {
        console.warn('Failed to re-parse', relPath, err);
      }
      continue;
    }

    try {
      const f = await handle.getFile();
      const meta = await epubParser.parseMetadata(f);

      // Promote a matching single-file entry (added via 加單檔) into this root
      // instead of creating a duplicate. Preserves reading state — lastChapterId,
      // lastScroll, lastReadAt, tags, collections, lastKnownChapterCount.
      const promote = existing.find((b) =>
        !consumed.has(b.id) &&
        b.rootId == null &&
        b.title === meta.title &&
        (b.author || null) === (meta.author || null)
      );
      if (promote) {
        consumed.add(promote.id);
        await booksStore.update(promote.id, {
          rootId: root.id,
          relPath,
          fileHandle: handle,
          sourceType: 'epub',
          chaptersMeta: meta.chaptersMeta,
          coverBlob: meta.coverBlob || promote.coverBlob,
          wordCount: meta.chaptersMeta.reduce((s, c) => s + (c.wordCount || 0), 0),
          fileLastModified: f.lastModified,
        });
        continue;
      }

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
        lastKnownChapterCount: meta.chaptersMeta.length,
        fileLastModified: f.lastModified,
      });
      added++;
    } catch (err) {
      console.warn('Failed to parse', relPath, err);
    }
  }

  await rootsStore.update(root.id, {
    lastScannedAt: Date.now(),
    bookCount: walkedPaths.size,
  });
  if (setBusy) setBusy(null);

  const [newBooks, newRoots] = await Promise.all([booksStore.list(), rootsStore.list()]);
  dispatch({ type: 'SET_BOOKS', books: newBooks });
  dispatch({ type: 'SET_ROOTS', roots: newRoots });
}

async function addFromFile(file, fileHandle, dispatch) {
  const ext = file.name.toLowerCase().split('.').pop();
  const parser = ext === 'txt' ? txtParser : epubParser;
  const meta = await parser.parseMetadata(file);
  const existing = await booksStore.list();
  const dup = existing.find((b) =>
    b.title === meta.title && (b.author || null) === (meta.author || null)
  );
  if (dup) {
    const msg = `「${meta.title}」${meta.author ? ` · ${meta.author}` : ''} 已經在書庫裡了。\n\n確定要再加一份嗎？`;
    if (!confirm(msg)) return;
  }
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
    lastKnownChapterCount: meta.chaptersMeta.length,
  });
  const newBooks = await booksStore.list();
  dispatch({ type: 'SET_BOOKS', books: newBooks });
}

function bookProgress(b) {
  const meta = b.chaptersMeta || [];
  if (!b.lastChapterId || meta.length === 0) return 0;
  const idx = meta.findIndex((c) => c.id === b.lastChapterId);
  if (idx === -1) return 0;
  const raw = (idx + (b.lastScroll || 0)) / meta.length;
  return Math.max(0, Math.min(1, raw));
}

function newChapterCount(b) {
  const len = (b.chaptersMeta || []).length;
  if (b.lastKnownChapterCount == null) return 0;
  return Math.max(0, len - b.lastKnownChapterCount);
}
window.newChapterCount = newChapterCount;

function relTime(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return '剛剛';
  if (min < 60) return `${min} 分鐘前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小時前`;
  const d = Math.floor(hr / 24);
  if (d < 7) return `${d} 天前`;
  const w = Math.floor(d / 7);
  if (w < 5) return `${w} 週前`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo} 個月前`;
  return `${Math.floor(d / 365)} 年前`;
}
