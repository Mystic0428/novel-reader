// src/themes/v1-warm.jsx — Warm Library content + footer
function V1Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v1;
  const idx = chapterIdx + 1;
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
