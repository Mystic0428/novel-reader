// src/themes/v7-diner.jsx — 50s American Diner: turquoise+coral neon, red checkered floor, chrome trim
const V7_BG_TONES = {
  cream:     { bg: '#FAF0DC', ink: '#1A1A1A', check1: '#E8443A', check2: '#FAF0DC', chrome: '#D8D8DC' },
  ivory:     { bg: '#F8F2DA', ink: '#1A1A1A', check1: '#1AB5C2', check2: '#F8F2DA', chrome: '#D8D8DC' },
  butter:    { bg: '#FFEFB0', ink: '#1A1A1A', check1: '#E8443A', check2: '#FFEFB0', chrome: '#D8D8DC' },
  mint:      { bg: '#D8F0E0', ink: '#1A1A1A', check1: '#FF6B6B', check2: '#D8F0E0', chrome: '#D8D8DC' },
  peach:     { bg: '#FFE0CC', ink: '#1A1A1A', check1: '#1AB5C2', check2: '#FFE0CC', chrome: '#D8D8DC' },
  sky:       { bg: '#D0EAF0', ink: '#1A1A1A', check1: '#FF8C42', check2: '#D0EAF0', chrome: '#D8D8DC' },
  bubblegum: { bg: '#FFD8E5', ink: '#1A1A1A', check1: '#1AB5C2', check2: '#FFD8E5', chrome: '#D8D8DC' },
  midnight:  { bg: '#1F1F2E', ink: '#FAEFE0', check1: '#FF1F4F', check2: '#1F1F2E', chrome: '#A8A8B0' },
  neon:      { bg: '#0F0F1A', ink: '#F8E8C8', check1: '#FF2D9E', check2: '#0F0F1A', chrome: '#A8A8B0' },
};

function V7Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V7_BG_TONES[settings.themeColors.v7.bgTone] || V7_BG_TONES.cream;
  const { bg, ink, check1, check2, chrome } = tone;
  const turq = settings.themeColors.v7.accent;
  const isDark = ink === '#FAEFE0' || ink === '#F8E8C8';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink,
      fontFamily: '"Inter","Helvetica Neue","Noto Sans TC",sans-serif', padding: 0, position: 'relative',
    }}>
      {/* checkered floor band at top */}
      <div style={{
        height: 28,
        background: `repeating-conic-gradient(${check1} 0% 25%, ${check2} 0% 50%) 50% / 28px 28px`,
        borderBottom: `2px solid ${chrome}`,
        boxShadow: `0 1px 0 ${chrome} inset, 0 -1px 0 ${ink}33`,
      }}/>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 40px 60px' }}>
        {/* neon sign chapter title */}
        <div style={{ textAlign: 'center', marginBottom: 36, position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.4em', color: check1, marginBottom: 8 }}>
            ★ TODAY'S SPECIAL · CH {String(chapterIdx + 1).padStart(2, '0')} ★
          </div>
          <div style={{
            fontSize: settings.tweaks.fontSize + 18, fontWeight: 800, letterSpacing: '0.04em',
            color: turq, fontStyle: 'italic',
            textShadow: `0 0 8px ${turq}88, 0 0 16px ${turq}44, 2px 2px 0 ${ink}, 4px 4px 0 ${chrome}`,
            lineHeight: 1.15,
          }}>{stripChapterPrefix(chapterTitle)}</div>
          <div style={{ fontSize: 11, color: isDark ? `${ink}aa` : `${ink}88`, letterSpacing: '0.3em', marginTop: 10, fontStyle: 'italic' }}>
            ~ {(book.author || 'ANONYMOUS')} · since 1955 ~
          </div>
        </div>

        {/* body in a "menu card" */}
        <div style={{
          padding: '28px 32px', background: isDark ? `${bg}` : '#FFFFFF',
          border: `2px solid ${ink}`, borderRadius: 6,
          boxShadow: `4px 4px 0 ${chrome}, 8px 8px 0 ${check1}55`,
          position: 'relative',
        }}>
          {/* chrome corners */}
          <div style={{ position: 'absolute', top: -6, left: -6, width: 14, height: 14, background: chrome, borderRadius: 7, boxShadow: 'inset 0 1px 1px #fff, inset 0 -1px 1px rgba(0,0,0,0.2)' }}/>
          <div style={{ position: 'absolute', top: -6, right: -6, width: 14, height: 14, background: chrome, borderRadius: 7, boxShadow: 'inset 0 1px 1px #fff, inset 0 -1px 1px rgba(0,0,0,0.2)' }}/>
          <div style={{ position: 'absolute', bottom: -6, left: -6, width: 14, height: 14, background: chrome, borderRadius: 7, boxShadow: 'inset 0 1px 1px #fff, inset 0 -1px 1px rgba(0,0,0,0.2)' }}/>
          <div style={{ position: 'absolute', bottom: -6, right: -6, width: 14, height: 14, background: chrome, borderRadius: 7, boxShadow: 'inset 0 1px 1px #fff, inset 0 -1px 1px rgba(0,0,0,0.2)' }}/>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': check1,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, gap: 12 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
            background: chrome, color: '#1A1A1A',
            border: `2px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`,
            fontFamily: 'inherit', fontWeight: 800, letterSpacing: '0.18em', fontStyle: 'italic',
          }}>◄ ORDER UP</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
            background: check1, color: check2,
            border: `2px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`,
            fontFamily: 'inherit', fontWeight: 800, letterSpacing: '0.18em', fontStyle: 'italic',
          }}>NEXT PLEASE ►</button>
        </div>
      </div>

      {/* checkered floor band at bottom */}
      <div style={{
        height: 28,
        background: `repeating-conic-gradient(${check1} 0% 25%, ${check2} 0% 50%) 50% / 28px 28px`,
        borderTop: `2px solid ${chrome}`,
      }}/>
    </main>
  );
}

function V7Footer({ book, chapterIdx, settings }) {
  const tone = V7_BG_TONES[settings.themeColors.v7.bgTone] || V7_BG_TONES.cream;
  const turq = settings.themeColors.v7.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `2px solid ${tone.chrome}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter","Helvetica Neue",sans-serif', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', fontStyle: 'italic',
    }}>
      <span style={{ color: tone.check1 }}>★ ORDER {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 6, background: `${tone.ink}22`, position: 'relative', border: `1px solid ${tone.ink}`, borderRadius: 3 }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: turq, borderRadius: 2, boxShadow: `0 0 6px ${turq}88` }}/>
      </div>
      <span style={{ color: turq }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V7Reader = V7Reader;
window.V7Footer = V7Footer;
