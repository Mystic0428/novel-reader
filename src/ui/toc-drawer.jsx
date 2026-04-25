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
                <span style={{ fontSize: 12.5, lineHeight: 1.4 }}>{stripChapterPrefix(c.title)}</span>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
window.TocDrawer = TocDrawer;
