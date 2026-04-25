// src/themes/v13-typewriter.jsx — Mid-century typewriter manuscript: aged paper, Courier mono, red/black ribbon, page-number stamp
const V13_BG_TONES = {
  paper:     { bg: '#F5EAC8', ink: '#1A1408', stamp: 'rgba(26,20,8,0.18)' },
  oat:       { bg: '#F0E2B8', ink: '#1A0E04', stamp: 'rgba(26,14,4,0.20)' },
  manila:    { bg: '#E8D8A0', ink: '#1A0E04', stamp: 'rgba(26,14,4,0.22)' },
  ivory:     { bg: '#FAF0D8', ink: '#1A1408', stamp: 'rgba(26,20,8,0.16)' },
  cream:     { bg: '#F8E8C8', ink: '#1A1408', stamp: 'rgba(26,20,8,0.18)' },
  hemp:      { bg: '#DCCEA0', ink: '#1A0E04', stamp: 'rgba(26,14,4,0.25)' },
  yellowed:  { bg: '#E8D098', ink: '#1A1004', stamp: 'rgba(26,16,4,0.28)' },
  bone:      { bg: '#FAF2E0', ink: '#1A1408', stamp: 'rgba(26,20,8,0.14)' },
  smoke:     { bg: '#DCD2BC', ink: '#15100A', stamp: 'rgba(21,16,10,0.22)' },
};

function V13Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V13_BG_TONES[settings.themeColors.v13.bgTone] || V13_BG_TONES.paper;
  const { bg, ink, stamp } = tone;
  const ribbon = settings.themeColors.v13.accent;
  const total = book.chaptersMeta.length;
  // baseline rules — typewriter line spacing
  const ruled = `repeating-linear-gradient(0deg, transparent 0 32px, rgba(26,20,8,0.06) 32px 33px)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg, color: ink,
      fontFamily: '"JetBrains Mono","Courier New",monospace', padding: 0,
      backgroundImage: ruled,
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 60px 36px' }}>
        {/* page header — ribbon edge + page number */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${ink}`, paddingBottom: 6, marginBottom: 18, fontSize: 11, letterSpacing: '0.2em' }}>
          <span style={{ color: ink, opacity: 0.7 }}>{(book.author || 'ANONYMOUS').toUpperCase()}</span>
          <span style={{ color: ribbon, fontWeight: 700 }}>— DRAFT —</span>
          <span style={{ color: ink, opacity: 0.7 }}>{book.title.toUpperCase().slice(0, 28)}</span>
        </div>

        {/* page-number rubber stamp */}
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-block', padding: '6px 14px',
            border: `2px solid ${ribbon}`, color: ribbon, fontSize: 13, fontWeight: 700,
            letterSpacing: '0.3em', transform: 'rotate(-4deg)',
            opacity: 0.85, fontFamily: 'inherit',
          }}>
            CHAPTER {String(chapterIdx + 1).padStart(2, '0')}
          </div>
        </div>

        <h1 style={{
          fontFamily: 'inherit', fontSize: settings.tweaks.fontSize + 8, fontWeight: 700,
          margin: '0 0 28px', lineHeight: 1.4, letterSpacing: '0.04em', color: ink,
          textAlign: 'center', textTransform: 'uppercase',
          textDecoration: 'underline', textDecorationStyle: 'double', textUnderlineOffset: 6,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* body — typewriter mono with subtle red emphasis on accent */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"JetBrains Mono","Courier New",monospace', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'left',
          '--accent': ribbon,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end-of-page mark */}
        <div style={{ textAlign: 'center', marginTop: 28, fontSize: 12, letterSpacing: '0.4em', color: ink, opacity: 0.55 }}>
          — END OF PAGE {chapterIdx + 1} —
        </div>

        {/* footer with carriage-return arrow nav buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${ink}66`, fontFamily: 'inherit' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '6px 12px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, fontSize: 11,
          }}>◄ PREV PAGE</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '6px 12px', borderRadius: 0,
            background: ribbon, color: bg, border: `1.5px solid ${ribbon}`,
            fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, fontSize: 11,
          }}>NEXT PAGE ►</button>
        </div>
      </div>

      {/* page-corner stamp — appears as a faded watermark at bottom right */}
      <div style={{
        position: 'fixed', right: 24, bottom: 60, color: stamp, pointerEvents: 'none', zIndex: 1,
        border: `4px double currentColor`, padding: '8px 16px',
        fontSize: 22, fontWeight: 800, letterSpacing: '0.3em', fontFamily: '"JetBrains Mono",monospace',
        transform: 'rotate(-12deg)',
      }}>
        PAGE {String(chapterIdx + 1).padStart(3, '0')}
      </div>
    </main>
  );
}

function V13Footer({ book, chapterIdx, settings }) {
  const tone = V13_BG_TONES[settings.themeColors.v13.bgTone] || V13_BG_TONES.paper;
  const ribbon = settings.themeColors.v13.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"JetBrains Mono",monospace', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700,
    }}>
      <span>PG. {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: ribbon }}/>
      </div>
      <span style={{ color: ribbon }}>{Math.round(progress * 100).toString().padStart(2, '0')}%</span>
    </div>
  );
}

window.V13Reader = V13Reader;
window.V13Footer = V13Footer;
