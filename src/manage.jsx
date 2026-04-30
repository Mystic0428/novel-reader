// src/manage.jsx — 書庫管理頁 (view: 'manage')
// Rune-Stone-themed dashboard: left sidebar filter, top bar search/sort/batch,
// center grid of all books, right panel of stat overview or batch tools.

const RUNE = {
  bg: '#1A1816',
  panel: '#252220',
  panelAlt: '#2E2A26',
  border: '#3D3833',
  text: '#E8DFC8',
  textMute: '#9A8E78',
  accent: '#C8A248',
  accent2: '#A88838',
  accentSoft: '#3A332A',
  danger: '#A85838',
};
const RUNE_UI = '"Noto Sans TC", system-ui, sans-serif';
const RUNE_SERIF = '"Cinzel", "Cormorant Garamond", "Noto Serif TC", serif';

// Single source of truth for status buckets — used by both sidebar counts and
// stat overview. A book is "reading" if it's been touched (lastReadAt) but not
// finished; this includes books opened with no scroll progress (p === 0).
function bookStatus(b) {
  const p = bookProgress(b);
  if (p >= 0.99) return 'finished';
  if (b.lastReadAt) return 'reading';
  return 'unread';
}

function ManageView() {
  const { state, dispatch } = React.useContext(AppContext);
  const { books, settings } = state;

  const [search, setSearch] = React.useState('');
  const [batchMode, setBatchMode] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState(() => new Set());
  const [cardBookId, setCardBookId] = React.useState(null);
  const searchInputRef = React.useRef(null);

  const manageFilter = settings.manageFilter || null;
  const manageSortBy = settings.manageSortBy || 'lastRead';
  const manageSortOrder = settings.manageSortOrder || 'desc';
  const gridSize = settings.manageGridSize || 'md';

  async function patch(p) {
    const next = await settingsStore.save(p);
    dispatch({ type: 'SET_SETTINGS', settings: next });
  }

  async function refreshBooks() {
    const next = await booksStore.list();
    dispatch({ type: 'SET_BOOKS', books: next });
  }

  // Expose card opener globally so context menus inside ManageCard can trigger
  // the BookCard modal — same pattern as library.jsx:115-117. Library's handler
  // is unmounted while ManageView is mounted, so we own this for now.
  React.useEffect(() => {
    window.openBookCard = (book) => setCardBookId(book.id);
    return () => { delete window.openBookCard; };
  }, []);

  // Sidebar buckets
  const tags = React.useMemo(() => booksStore.allTags(books), [books]);
  const collections = React.useMemo(() => booksStore.allCollections(books), [books]);

  const statusCounts = React.useMemo(() => {
    let reading = 0, unread = 0, finished = 0;
    for (const b of books) {
      const s = bookStatus(b);
      if (s === 'finished') finished += 1;
      else if (s === 'reading') reading += 1;
      else unread += 1;
    }
    return { reading, unread, finished, all: books.length };
  }, [books]);

  // Filter → search → sort
  const filtered = React.useMemo(() => {
    let out = books;
    if (manageFilter && manageFilter.kind === 'status') {
      out = out.filter((b) => bookStatus(b) === manageFilter.value);
    } else if (manageFilter && manageFilter.kind === 'tag') {
      out = out.filter((b) => (b.tags || []).includes(manageFilter.value));
    } else if (manageFilter && manageFilter.kind === 'collection') {
      out = out.filter((b) => (b.collections || []).includes(manageFilter.value));
    }
    if (search) {
      const q = search.toLowerCase();
      out = out.filter((b) =>
        b.title.toLowerCase().includes(q) ||
        (b.author || '').toLowerCase().includes(q) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q)) ||
        (b.collections || []).some((c) => c.toLowerCase().includes(q))
      );
    }
    return sortBooks(out, { sortBy: manageSortBy, sortOrder: manageSortOrder });
  }, [books, manageFilter, search, manageSortBy, manageSortOrder]);

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e) {
      const inInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (e.key === 'Escape') {
        if (cardBookId) { setCardBookId(null); return; }
        if (batchMode) { setBatchMode(false); setSelectedIds(new Set()); return; }
        if (search) { setSearch(''); return; }
        dispatch({ type: 'SET_VIEW', view: 'library' });
        return;
      }
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [batchMode, search, cardBookId, dispatch]);

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function exitBatch() { setBatchMode(false); setSelectedIds(new Set()); }

  const cardBook = cardBookId ? books.find((b) => b.id === cardBookId) : null;

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex', overflow: 'hidden',
      background: RUNE.bg, color: RUNE.text, fontFamily: RUNE_UI,
    }}>
      <NavSidebar
        books={books} tags={tags} collections={collections}
        statusCounts={statusCounts}
        manageFilter={manageFilter}
        onFilterChange={(f) => patch({ manageFilter: f })}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ManageTopBar
          dispatch={dispatch}
          search={search} onSearchChange={setSearch} searchInputRef={searchInputRef}
          batchMode={batchMode} onToggleBatch={() => { setBatchMode((b) => !b); setSelectedIds(new Set()); }}
          sortBy={manageSortBy} sortOrder={manageSortOrder}
          onSort={(sortBy) => {
            const order = manageSortBy === sortBy
              ? (manageSortOrder === 'asc' ? 'desc' : 'asc')
              : 'desc';
            patch({ manageSortBy: sortBy, manageSortOrder: order });
          }}
          gridSize={gridSize}
          onToggleGrid={() => patch({ manageGridSize: gridSize === 'sm' ? 'md' : 'sm' })}
          totalShown={filtered.length} totalAll={books.length}
        />
        <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
          <BookGrid
            books={filtered} gridSize={gridSize}
            batchMode={batchMode} selectedIds={selectedIds}
            onCardClick={(b) => {
              if (batchMode) toggleSelect(b.id);
              else openBook(b.id, dispatch);
            }}
            onCardContext={(b) => setCardBookId(b.id)}
          />
          <RightPanel
            books={books} batchMode={batchMode} selectedIds={selectedIds}
            tags={tags} collections={collections}
            onChanged={refreshBooks}
            onClearSelection={() => setSelectedIds(new Set())}
            onExitBatch={exitBatch}
          />
        </div>
      </div>
      <BookCard
        book={cardBook} open={!!cardBook}
        onClose={() => setCardBookId(null)}
        onOpenBook={(id) => openBook(id, dispatch)}
        onChanged={refreshBooks}
      />
    </div>
  );
}
window.ManageView = ManageView;

// ============================================================
// NavSidebar — left 220px, sticky-ish; lists status / tags / collections
// ============================================================
function NavSidebar({ books, tags, collections, statusCounts, manageFilter, onFilterChange }) {
  const isActive = (kind, value) =>
    (manageFilter && manageFilter.kind === kind && manageFilter.value === value)
    || (kind === 'all' && !manageFilter);

  function tagCount(t) { return books.filter((b) => (b.tags || []).includes(t)).length; }
  function colCount(c) { return books.filter((b) => (b.collections || []).includes(c)).length; }

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: RUNE.panel,
      borderRight: `1px solid ${RUNE.border}`,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{
        padding: '20px 16px 14px', borderBottom: `1px solid ${RUNE.border}`,
      }}>
        <div style={{
          fontFamily: RUNE_SERIF, fontSize: 18, fontWeight: 600,
          letterSpacing: '0.18em', color: RUNE.accent,
        }}>藏書閣</div>
        <div style={{
          fontFamily: RUNE_UI, fontSize: 10, letterSpacing: '0.25em',
          color: RUNE.textMute, marginTop: 2,
        }}>THE STACKS</div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 8px', scrollbarGutter: 'stable' }} className="scroll-thin">
        <SidebarSection title="狀態">
          <SidebarRow label="全部" count={statusCounts.all}
            active={isActive('all')} onClick={() => onFilterChange(null)}/>
          <SidebarRow label="正在讀" count={statusCounts.reading}
            active={isActive('status', 'reading')} onClick={() => onFilterChange({ kind: 'status', value: 'reading' })}/>
          <SidebarRow label="未開始" count={statusCounts.unread}
            active={isActive('status', 'unread')} onClick={() => onFilterChange({ kind: 'status', value: 'unread' })}/>
          <SidebarRow label="已讀" count={statusCounts.finished}
            active={isActive('status', 'finished')} onClick={() => onFilterChange({ kind: 'status', value: 'finished' })}/>
        </SidebarSection>
        {tags.length > 0 && (
          <SidebarSection title="標籤">
            {tags.map((t) => (
              <SidebarRow key={`t-${t}`} label={`# ${t}`} count={tagCount(t)}
                active={isActive('tag', t)}
                onClick={() => onFilterChange({ kind: 'tag', value: t })}/>
            ))}
          </SidebarSection>
        )}
        {collections.length > 0 && (
          <SidebarSection title="收藏集">
            {collections.map((c) => (
              <SidebarRow key={`c-${c}`} label={`📁 ${c}`} count={colCount(c)}
                active={isActive('collection', c)}
                onClick={() => onFilterChange({ kind: 'collection', value: c })}/>
            ))}
          </SidebarSection>
        )}
      </div>
    </aside>
  );
}

function SidebarSection({ title, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{
        padding: '8px 10px 6px', fontSize: 10, letterSpacing: '0.25em',
        color: RUNE.textMute, textTransform: 'uppercase',
      }}>{title}</div>
      {children}
    </div>
  );
}

function SidebarRow({ label, count, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', width: '100%',
      padding: '8px 10px', borderRadius: 6,
      background: active ? RUNE.accentSoft : 'transparent',
      borderLeft: active ? `3px solid ${RUNE.accent}` : '3px solid transparent',
      color: active ? RUNE.text : RUNE.textMute,
      fontFamily: 'inherit', fontSize: 13,
      fontWeight: active ? 600 : 400,
      cursor: 'pointer', textAlign: 'left', border: 'none',
      borderTop: '0', borderRight: '0', borderBottom: '0',
    }}>
      <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 11, color: RUNE.textMute, marginLeft: 8 }}>{count}</span>
    </button>
  );
}

// ============================================================
// ManageTopBar
// ============================================================
function ManageTopBar({ dispatch, search, onSearchChange, searchInputRef,
  batchMode, onToggleBatch, sortBy, sortOrder, onSort,
  gridSize, onToggleGrid, totalShown, totalAll }) {
  return (
    <div style={{
      height: 56, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 14,
      background: RUNE.panel, borderBottom: `1px solid ${RUNE.border}`,
      flexShrink: 0, fontFamily: RUNE_UI,
    }}>
      <button onClick={() => dispatch({ type: 'SET_VIEW', view: 'library' })} style={runeBtn()}>← 首頁</button>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: RUNE_SERIF, fontSize: 16, color: RUNE.accent, letterSpacing: '0.12em' }}>書庫</span>
        <span style={{ fontSize: 11, color: RUNE.textMute, letterSpacing: '0.18em' }}>LIBRARY</span>
        <span style={{ fontSize: 11, color: RUNE.textMute, marginLeft: 8 }}>
          {totalShown === totalAll ? `${totalAll} 本` : `${totalShown} / ${totalAll} 本`}
        </span>
      </div>
      <div style={{ flex: 1 }}/>
      <div style={{ position: 'relative', width: 280 }}>
        <input ref={searchInputRef} placeholder="🔍 搜尋…  ( / )"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%', boxSizing: 'border-box', height: 32, padding: '0 32px 0 12px',
            background: RUNE.panelAlt, color: RUNE.text,
            border: `1px solid ${RUNE.border}`, borderRadius: 6,
            fontFamily: 'inherit', fontSize: 12, outline: 'none',
          }}/>
        {search && (
          <button onClick={() => { onSearchChange(''); searchInputRef.current?.focus(); }} style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            width: 20, height: 20, borderRadius: 10, border: 'none',
            background: RUNE.accentSoft, color: RUNE.text, cursor: 'pointer',
            fontSize: 10, lineHeight: 1, padding: 0, fontFamily: 'inherit',
          }}>✕</button>
        )}
      </div>
      <ManageSortDropdown sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}/>
      <button onClick={onToggleGrid} style={runeBtn()} title="切換書封大小">
        {gridSize === 'sm' ? '⊟ 小' : '⊞ 大'}
      </button>
      <button onClick={onToggleBatch} style={batchMode ? runeBtnActive() : runeBtn()} title="批次模式">
        ☑ 批次
      </button>
    </div>
  );
}

function ManageSortDropdown({ sortBy, sortOrder, onSort }) {
  const [open, setOpen] = React.useState(false);
  const options = [
    { key: 'lastRead', label: '最近讀' },
    { key: 'addedAt', label: '加入時間' },
    { key: 'title', label: '書名' },
    { key: 'author', label: '作者' },
    { key: 'progress', label: '進度' },
    { key: 'wordCount', label: '字數' },
  ];
  const active = options.find((o) => o.key === sortBy) || options[0];
  const arrow = sortOrder === 'asc' ? '▲' : '▼';
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen((o) => !o)} style={runeBtn()}>
        ↕ {active.label} {arrow}
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 100 }}/>
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, minWidth: 180, zIndex: 101,
            background: RUNE.panel, border: `1px solid ${RUNE.border}`, borderRadius: 6,
            boxShadow: '0 10px 32px rgba(0,0,0,0.6)', padding: 6, fontFamily: RUNE_UI,
          }}>
            {options.map((o) => (
              <button key={o.key} onClick={() => { onSort(o.key); setOpen(false); }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '8px 12px', borderRadius: 4, border: 'none',
                background: sortBy === o.key ? RUNE.accentSoft : 'transparent',
                fontSize: 12, color: RUNE.text, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {o.label} {sortBy === o.key ? arrow : ''}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function runeBtn() {
  return {
    padding: '6px 12px', height: 32,
    background: RUNE.panelAlt, color: RUNE.text,
    border: `1px solid ${RUNE.border}`, borderRadius: 6,
    fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
    lineHeight: 1, display: 'inline-flex', alignItems: 'center', gap: 4,
  };
}
function runeBtnActive() {
  return { ...runeBtn(), background: RUNE.accent, color: '#1A1816', borderColor: RUNE.accent };
}

// ============================================================
// BookGrid + ManageCard
// ============================================================
function BookGrid({ books, gridSize, batchMode, selectedIds, onCardClick, onCardContext }) {
  const cellMin = gridSize === 'sm' ? 130 : 170;
  const gap = gridSize === 'sm' ? 16 : 22;
  const coverSize = gridSize === 'sm' ? 'md' : 'lg';
  return (
    <div style={{
      flex: 1, minWidth: 0, overflowY: 'auto',
      padding: '20px 24px 40px', scrollbarGutter: 'stable',
    }} className="scroll-thin">
      {books.length === 0 ? (
        <div style={{ padding: 60, textAlign: 'center', color: RUNE.textMute, fontSize: 13 }}>
          沒有符合條件的書
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, minmax(${cellMin}px, 1fr))`,
          gap,
        }}>
          {books.map((b) => (
            <ManageCard key={b.id} book={b} coverSize={coverSize}
              batchMode={batchMode} selected={selectedIds.has(b.id)}
              onClick={() => onCardClick(b)}
              onContext={() => onCardContext(b)}/>
          ))}
        </div>
      )}
    </div>
  );
}

function ManageCard({ book, coverSize, batchMode, selected, onClick, onContext }) {
  const [hover, setHover] = React.useState(false);
  const progress = bookProgress(book);
  const newCount = newChapterCount(book);
  const total = (book.chaptersMeta || []).length;
  const lastReadLabel = book.lastReadAt ? relTime(book.lastReadAt) : '尚未開始';
  const wordsLabel = book.wordCount ? `${Math.round(book.wordCount / 1000)}k 字` : '';

  return (
    <div
      onClick={onClick}
      onContextMenu={(e) => { e.preventDefault(); onContext(); }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', cursor: 'pointer',
        padding: 8, borderRadius: 8,
        background: selected ? RUNE.accentSoft : 'transparent',
        border: selected ? `1px solid ${RUNE.accent}` : '1px solid transparent',
        transition: 'background 120ms ease, border-color 120ms ease',
      }}>
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
        <Cover book={book} size={coverSize}/>
        {batchMode && (
          <div style={{
            position: 'absolute', top: 6, left: 6,
            width: 22, height: 22, borderRadius: 4,
            background: selected ? RUNE.accent : 'rgba(26,24,22,0.7)',
            border: `1px solid ${selected ? RUNE.accent : RUNE.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: selected ? '#1A1816' : RUNE.text, fontSize: 13, fontWeight: 700,
          }}>{selected ? '✓' : ''}</div>
        )}
        {newCount > 0 && (
          <div style={{
            position: 'absolute', top: 6, right: 6,
            background: RUNE.accent, color: '#1A1816',
            fontSize: 10, fontWeight: 700, padding: '2px 6px',
            borderRadius: 4, letterSpacing: '0.05em',
          }}>+{newCount}</div>
        )}
        {hover && !batchMode && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(26,24,22,0.92) 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
            padding: 8, borderRadius: 3, fontSize: 10, color: RUNE.text,
            pointerEvents: 'none',
          }}>
            <div>📖 {total} 章 {wordsLabel && `· ${wordsLabel}`}</div>
            <div style={{ color: RUNE.textMute, marginTop: 2 }}>{lastReadLabel}</div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 8, padding: '0 2px' }}>
        <div style={{
          fontFamily: '"Noto Serif TC", serif', fontSize: 13, fontWeight: 500,
          color: RUNE.text, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{book.title}</div>
        <div style={{
          fontSize: 11, color: RUNE.textMute, marginTop: 2,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{book.author || '—'}</div>
        {progress > 0 && progress < 0.99 && (
          <div style={{ height: 2, background: RUNE.accentSoft, borderRadius: 1, marginTop: 6 }}>
            <div style={{ width: `${progress * 100}%`, height: '100%', background: RUNE.accent, borderRadius: 1 }}/>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// RightPanel — stat overview (default) or batch tools
// ============================================================
function RightPanel({ books, batchMode, selectedIds, tags, collections, onChanged, onClearSelection, onExitBatch }) {
  return (
    <aside style={{
      width: 280, flexShrink: 0,
      background: RUNE.panel, borderLeft: `1px solid ${RUNE.border}`,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 18 }} className="scroll-thin">
        {batchMode ? (
          <BatchTools books={books} selectedIds={selectedIds}
            tags={tags} collections={collections}
            onChanged={onChanged} onClearSelection={onClearSelection} onExitBatch={onExitBatch}/>
        ) : (
          <StatOverview books={books}/>
        )}
      </div>
    </aside>
  );
}

// ============================================================
// StatOverview — three big numbers, donut, prose stats
// ============================================================
function StatOverview({ books }) {
  const [stats, setStats] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    readingEventsStore.computeStats().then((s) => { if (!cancelled) setStats(s); });
    return () => { cancelled = true; };
  }, [books.length]);

  const buckets = React.useMemo(() => {
    let reading = 0, finished = 0, unread = 0;
    for (const b of books) {
      const s = bookStatus(b);
      if (s === 'finished') finished += 1;
      else if (s === 'reading') reading += 1;
      else unread += 1;
    }
    return { reading, finished, unread };
  }, [books]);

  const finishedThisYear = React.useMemo(() => {
    const yearStart = new Date(new Date().getFullYear(), 0, 1).getTime();
    return books.filter((b) => bookProgress(b) >= 0.99 && (b.lastReadAt || 0) >= yearStart).length;
  }, [books]);

  return (
    <div>
      <SectionTitle>書庫概覽</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 18 }}>
        <BigNumber value={books.length} label="總藏書"/>
        <BigNumber value={buckets.reading} label="正在讀"/>
        <BigNumber value={buckets.finished} label="已讀"/>
      </div>
      <Donut size={140}
        slices={[
          { value: buckets.finished, color: RUNE.accent, label: '已讀' },
          { value: buckets.reading, color: RUNE.accent2, label: '在讀' },
          { value: buckets.unread, color: RUNE.accentSoft, label: '未讀' },
        ]}/>
      <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${RUNE.border}` }}>
        <SectionTitle>閱讀紀錄</SectionTitle>
        <StatLine label="今年讀完" value={`${finishedThisYear} 本`}/>
        <StatLine label="連續閱讀" value={stats ? `${stats.currentStreak} 天` : '—'}/>
        <StatLine label="累積字數" value={stats ? formatWan(stats.totalWords) : '—'}/>
        <StatLine label="總章節數" value={stats ? `${stats.totalChapters} 章` : '—'}/>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: '0.25em', color: RUNE.textMute,
      textTransform: 'uppercase', marginBottom: 10, fontFamily: RUNE_UI,
    }}>{children}</div>
  );
}

function BigNumber({ value, label }) {
  return (
    <div style={{
      background: RUNE.panelAlt, border: `1px solid ${RUNE.border}`,
      borderRadius: 8, padding: '10px 8px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: RUNE_SERIF, fontSize: 22, fontWeight: 600, color: RUNE.accent, lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 10, color: RUNE.textMute, marginTop: 4, letterSpacing: '0.08em' }}>{label}</div>
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '6px 0', fontSize: 12,
    }}>
      <span style={{ color: RUNE.textMute }}>{label}</span>
      <span style={{ color: RUNE.text, fontFamily: RUNE_SERIF, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function formatWan(words) {
  if (!words) return '0 字';
  if (words < 10000) return `${words.toLocaleString()} 字`;
  return `${(words / 10000).toFixed(1)} 萬字`;
}

// SVG donut — pure (no chart lib). Slices: [{ value, color, label }]
function Donut({ size = 140, slices }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - 8;
  const cx = size / 2, cy = size / 2;
  const stroke = 14;
  if (total === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 12, color: RUNE.textMute, fontSize: 12 }}>
        尚無資料
      </div>
    );
  }
  let acc = 0;
  const arcs = slices.filter((s) => s.value > 0).map((s, i) => {
    const startFrac = acc / total;
    acc += s.value;
    const endFrac = acc / total;
    return { ...s, startFrac, endFrac, key: i };
  });
  function arcPath(startFrac, endFrac) {
    if (endFrac - startFrac >= 0.999) {
      // full circle — render as two half arcs to avoid degenerate path
      return `M ${cx + r},${cy} A ${r} ${r} 0 1 1 ${cx - r},${cy} A ${r} ${r} 0 1 1 ${cx + r},${cy}`;
    }
    const a0 = startFrac * 2 * Math.PI - Math.PI / 2;
    const a1 = endFrac * 2 * Math.PI - Math.PI / 2;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const large = (endFrac - startFrac) > 0.5 ? 1 : 0;
    return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {arcs.map((a) => (
          <path key={a.key} d={arcPath(a.startFrac, a.endFrac)}
            stroke={a.color} strokeWidth={stroke} fill="none" strokeLinecap="butt"/>
        ))}
        <text x={cx} y={cy + 5} textAnchor="middle"
          fontFamily={RUNE_SERIF} fontSize={20} fontWeight={600} fill={RUNE.text}>{total}</text>
      </svg>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, flexShrink: 0 }}/>
            <span style={{ color: RUNE.textMute, flex: 1 }}>{s.label}</span>
            <span style={{ color: RUNE.text, fontFamily: RUNE_SERIF }}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// BatchTools — shown in right panel when batchMode is true
// ============================================================
function BatchTools({ books, selectedIds, tags, collections, onChanged, onClearSelection, onExitBatch }) {
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [colsOpen, setColsOpen] = React.useState(false);
  const [newTag, setNewTag] = React.useState('');
  const [newCol, setNewCol] = React.useState('');
  const selectedBooks = books.filter((b) => selectedIds.has(b.id));
  const n = selectedBooks.length;

  async function applyTag(tag, add) {
    for (const b of selectedBooks) {
      const cur = new Set(b.tags || []);
      if (add) cur.add(tag); else cur.delete(tag);
      await booksStore.update(b.id, { tags: Array.from(cur).sort() });
    }
    onChanged();
  }
  async function applyCollection(col, add) {
    for (const b of selectedBooks) {
      const cur = new Set(b.collections || []);
      if (add) cur.add(col); else cur.delete(col);
      await booksStore.update(b.id, { collections: Array.from(cur).sort() });
    }
    onChanged();
  }
  async function addNewTag() {
    const t = newTag.trim();
    if (!t) return;
    await applyTag(t, true);
    setNewTag('');
  }
  async function addNewCollection() {
    const c = newCol.trim();
    if (!c) return;
    await applyCollection(c, true);
    setNewCol('');
  }
  async function removeAll() {
    if (n === 0) return;
    if (!window.confirm(`確定要從書庫移除這 ${n} 本書嗎？（不會刪除原始檔案）`)) return;
    for (const b of selectedBooks) {
      await booksStore.remove(b.id);
    }
    onClearSelection();
    onChanged();
  }

  // Build a "is every selected book tagged with X?" map for the tag list display
  const tagState = (t) => {
    let any = false, all = selectedBooks.length > 0;
    for (const b of selectedBooks) {
      const has = (b.tags || []).includes(t);
      if (has) any = true;
      if (!has) all = false;
    }
    return all ? 'all' : (any ? 'some' : 'none');
  };
  const colState = (c) => {
    let any = false, all = selectedBooks.length > 0;
    for (const b of selectedBooks) {
      const has = (b.collections || []).includes(c);
      if (has) any = true;
      if (!has) all = false;
    }
    return all ? 'all' : (any ? 'some' : 'none');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <SectionTitle>批次工具</SectionTitle>
        <button onClick={onExitBatch} style={{
          background: 'transparent', border: 'none', color: RUNE.textMute,
          cursor: 'pointer', fontSize: 14, padding: 4,
        }} title="退出批次模式">✕</button>
      </div>
      <div style={{
        background: RUNE.panelAlt, border: `1px solid ${RUNE.border}`,
        borderRadius: 8, padding: 12, marginBottom: 14,
      }}>
        <div style={{ fontFamily: RUNE_SERIF, fontSize: 22, fontWeight: 600, color: RUNE.accent }}>
          已選 {n} 本
        </div>
        <div style={{ fontSize: 11, color: RUNE.textMute, marginTop: 2 }}>
          {n === 0 ? '點選卡片以選取' : '對選中的書套用以下動作'}
        </div>
      </div>

      <BatchSection title="改標籤" open={tagsOpen} onToggle={() => setTagsOpen((o) => !o)} disabled={n === 0}>
        <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }} className="scroll-thin">
          {tags.map((t) => {
            const st = tagState(t);
            return (
              <button key={t} onClick={() => applyTag(t, st !== 'all')}
                style={tagPillStyle(st)}>
                {st === 'all' ? '✓ ' : st === 'some' ? '~ ' : '+ '}# {t}
              </button>
            );
          })}
          {tags.length === 0 && <div style={{ color: RUNE.textMute, fontSize: 11 }}>尚無標籤</div>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input value={newTag} onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewTag()}
            placeholder="新增標籤…"
            style={inlineInputStyle()}/>
          <button onClick={addNewTag} style={runeBtn()} disabled={!newTag.trim()}>＋</button>
        </div>
      </BatchSection>

      <BatchSection title="移到收藏集" open={colsOpen} onToggle={() => setColsOpen((o) => !o)} disabled={n === 0}>
        <div style={{ maxHeight: 180, overflowY: 'auto', marginBottom: 8 }} className="scroll-thin">
          {collections.map((c) => {
            const st = colState(c);
            return (
              <button key={c} onClick={() => applyCollection(c, st !== 'all')}
                style={tagPillStyle(st)}>
                {st === 'all' ? '✓ ' : st === 'some' ? '~ ' : '+ '}📁 {c}
              </button>
            );
          })}
          {collections.length === 0 && <div style={{ color: RUNE.textMute, fontSize: 11 }}>尚無收藏集</div>}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input value={newCol} onChange={(e) => setNewCol(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addNewCollection()}
            placeholder="新增收藏集…"
            style={inlineInputStyle()}/>
          <button onClick={addNewCollection} style={runeBtn()} disabled={!newCol.trim()}>＋</button>
        </div>
      </BatchSection>

      <button onClick={onClearSelection} disabled={n === 0} style={{
        ...runeBtn(), width: '100%', marginTop: 8, justifyContent: 'center',
        opacity: n === 0 ? 0.5 : 1,
      }}>取消選取</button>
      <button onClick={removeAll} disabled={n === 0} style={{
        ...runeBtn(), width: '100%', marginTop: 6, justifyContent: 'center',
        background: 'transparent', borderColor: RUNE.danger, color: RUNE.danger,
        opacity: n === 0 ? 0.5 : 1,
      }}>🗑 移除選中</button>
    </div>
  );
}

function BatchSection({ title, open, onToggle, disabled, children }) {
  return (
    <div style={{
      marginBottom: 10, padding: 10,
      background: RUNE.panelAlt, border: `1px solid ${RUNE.border}`, borderRadius: 8,
      opacity: disabled ? 0.5 : 1,
    }}>
      <button onClick={onToggle} disabled={disabled} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', background: 'transparent', border: 'none',
        color: RUNE.text, fontSize: 12, fontFamily: 'inherit',
        cursor: disabled ? 'default' : 'pointer', padding: 0,
      }}>
        <span style={{ fontWeight: 500 }}>{title}</span>
        <span style={{ color: RUNE.textMute }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}

function tagPillStyle(state) {
  const base = {
    display: 'inline-block', padding: '4px 8px', borderRadius: 4,
    margin: '0 4px 4px 0', fontSize: 11, fontFamily: 'inherit',
    cursor: 'pointer', border: `1px solid ${RUNE.border}`,
  };
  if (state === 'all') return { ...base, background: RUNE.accent, color: '#1A1816', borderColor: RUNE.accent };
  if (state === 'some') return { ...base, background: RUNE.accentSoft, color: RUNE.text, borderColor: RUNE.accent };
  return { ...base, background: 'transparent', color: RUNE.textMute };
}

function inlineInputStyle() {
  return {
    flex: 1, height: 28, padding: '0 8px',
    background: RUNE.bg, color: RUNE.text,
    border: `1px solid ${RUNE.border}`, borderRadius: 4,
    fontFamily: 'inherit', fontSize: 12, outline: 'none',
  };
}
