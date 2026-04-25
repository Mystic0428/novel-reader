// src/ui/book-menu.jsx — right-click menu for a book card
function BookMenu({ book, anchorPos, onClose, onChanged }) {
  // Library mounts `window.openBookCard` so the card can be triggered from any
  // BookMenu instance without threading callbacks through 4 layers of components.
  const openInfo = window.openBookCard;
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
    await onChanged();
    onClose();
  }

  async function clearProgress() {
    if (!confirm(`清除「${book.title}」的閱讀進度？\n會回到第一章、未開始狀態。`)) return;
    await booksStore.update(book.id, { lastChapterId: null, lastScroll: 0, lastReadAt: null });
    await onChanged();
    onClose();
  }

  const style = {
    position: 'fixed', top: anchorPos.y, left: anchorPos.x,
    background: '#fff', color: '#1A1A1A', border: '0.5px solid rgba(0,0,0,0.12)',
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
        {openInfo && (
          <HoverRow onClick={() => { openInfo(book); onClose(); }}>📋 書本資訊</HoverRow>
        )}
        <HoverRow onClick={() => setMode('tag')}># 編輯 Tags</HoverRow>
        <HoverRow onClick={() => setMode('collection')}>📁 加到 Collection</HoverRow>
        {book.lastReadAt && (
          <HoverRow onClick={clearProgress}>↺ 清除閱讀進度</HoverRow>
        )}
        <div style={{ height: 0.5, background: 'rgba(0,0,0,0.08)', margin: '4px 0' }}/>
        <HoverRow onClick={deleteBook} style={{ color: '#B3261E' }}>🗑 從書庫移除</HoverRow>
      </>}
      {mode === 'tag' && <>
        <div style={{ padding: '8px 12px', fontWeight: 600, fontSize: 11, color: 'rgba(0,0,0,0.5)' }}>TAGS</div>
        {(book.tags || []).length === 0 && <div style={{ padding: '4px 12px 8px', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>還沒有 tag</div>}
        {(book.tags || []).map((t) => (
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
        {(book.collections || []).length === 0 && <div style={{ padding: '4px 12px 8px', fontSize: 11, color: 'rgba(0,0,0,0.4)' }}>還沒加到任何 collection</div>}
        {(book.collections || []).map((c) => (
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
