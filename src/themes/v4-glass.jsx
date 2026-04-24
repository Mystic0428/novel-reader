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
            <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 64px' }}>
              <div className="v4-chaptertitle">
                <div className="v4-chaptertitle-caption" style={{ color: colors.accent }}>CHAPTER {chapterIdx + 1}</div>
                <h1 className="v4-chaptertitle-heading" style={{ fontSize: settings.tweaks.fontSize + 16 }}>{stripChapterPrefix(chapterTitle)}</h1>
                <div className="v4-chaptertitle-rule" style={{ background: colors.accent }}/>
              </div>
              <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
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
