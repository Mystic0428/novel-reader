// src/ui/toc-drawer.jsx — slide-in TOC
function TocDrawer({ book, currentChapterId, settings, onJump, open, onClose }) {
  const [query, setQuery] = React.useState('');
  const activeRef = React.useRef(null);

  // Reset search whenever the drawer closes so reopening starts clean.
  React.useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  // Center the active chapter in view when the drawer first opens.
  React.useLayoutEffect(() => {
    if (open && activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'center' });
    }
  }, [open]);

  if (!open) return null;

  const accent = settings?.themeColors?.[settings.activeTheme]?.accent || '#8C3A2E';
  const q = query.trim().toLowerCase();
  const items = book.chaptersMeta
    .map((c, i) => ({ c, i, stripped: stripChapterPrefix(c.title || '') }))
    .filter(({ c, stripped }) =>
      !q ||
      stripped.toLowerCase().includes(q) ||
      (c.title || '').toLowerCase().includes(q));

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
        <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', fontWeight: 600 }}>目錄</div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 10, color: 'rgba(0,0,0,0.4)', fontVariantNumeric: 'tabular-nums' }}>
            {q ? `${items.length} / ${book.chaptersMeta.length}` : `${book.chaptersMeta.length} 章`}
          </div>
        </div>
        <div style={{ padding: '0 16px 8px' }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Escape') { setQuery(''); e.stopPropagation(); } }}
            placeholder="搜尋章節…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '6px 10px', fontSize: 12, fontFamily: 'inherit',
              border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 6,
              background: 'rgba(0,0,0,0.03)', outline: 'none',
              cursor: 'text',
            }}
          />
        </div>
        <div className="scroll scroll-thin" style={{ flex: 1, padding: '0 10px' }}>
          {items.length === 0 && (
            <div style={{ padding: '18px 12px', fontSize: 11, color: 'rgba(0,0,0,0.45)', textAlign: 'center' }}>
              找不到符合的章節
            </div>
          )}
          {items.map(({ c, i, stripped }) => {
            const active = c.id === currentChapterId;
            return (
              <div key={c.id} ref={active ? activeRef : null}
                onClick={() => { onJump(c.id); onClose(); }} style={{
                  position: 'relative',
                  padding: active ? '11px 12px 11px 16px' : '10px 12px',
                  borderRadius: 5, cursor: 'pointer',
                  background: active ? `${accent}14` : 'transparent',
                  fontWeight: active ? 700 : 400,
                  display: 'flex', gap: 8, alignItems: 'baseline',
                }}>
                {active && (
                  <span style={{
                    position: 'absolute', left: 4, top: 6, bottom: 6, width: 3,
                    background: accent, borderRadius: 2,
                  }}/>
                )}
                <span style={{
                  fontSize: 10,
                  color: active ? accent : 'rgba(0,0,0,0.4)',
                  fontVariantNumeric: 'tabular-nums', minWidth: 20,
                  fontWeight: active ? 700 : 400,
                }}>{i + 1}</span>
                <span style={{
                  fontSize: active ? 13.5 : 12.5, lineHeight: 1.4,
                  color: active ? '#1A1A1A' : 'inherit',
                }}>{stripped}</span>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
window.TocDrawer = TocDrawer;
