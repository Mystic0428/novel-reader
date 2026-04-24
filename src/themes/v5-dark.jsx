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
