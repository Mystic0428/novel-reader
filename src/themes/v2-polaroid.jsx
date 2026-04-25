// src/themes/v2-polaroid.jsx — Vintage Polaroid: faded sepia, polaroid white frame, light leaks, handwritten captions
const V2_BG_TONES = {
  cream:    { bg: '#F5E6C8', ink: '#3A2A1A', frame: '#FAF2DC', leak: 'rgba(255,180,80,0.22)' },
  sepia:    { bg: '#E8D5A8', ink: '#2A1808', frame: '#F0E2BC', leak: 'rgba(255,160,60,0.25)' },
  honey:    { bg: '#F0DCB0', ink: '#3A2418', frame: '#F8EDC8', leak: 'rgba(255,170,80,0.28)' },
  coral:    { bg: '#F5D5C0', ink: '#3A1F18', frame: '#FBE8DA', leak: 'rgba(255,150,120,0.24)' },
  sage:     { bg: '#DCE0C5', ink: '#2A2E1F', frame: '#EAEED8', leak: 'rgba(180,200,120,0.22)' },
  lilac:    { bg: '#E0D5E5', ink: '#2A1F2E', frame: '#EDE5F0', leak: 'rgba(220,180,240,0.20)' },
  dusk:     { bg: '#C8B8A0', ink: '#1F1810', frame: '#DCC8B0', leak: 'rgba(255,140,80,0.30)' },
  dawn:     { bg: '#F0DCC8', ink: '#3A2418', frame: '#F8EAD8', leak: 'rgba(255,200,120,0.20)' },
  mint:     { bg: '#D8E5DC', ink: '#1F2A20', frame: '#E8F0E5', leak: 'rgba(140,200,160,0.22)' },
};

function V2Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V2_BG_TONES[settings.themeColors.v2.bgTone] || V2_BG_TONES.cream;
  const { bg, ink, frame, leak } = tone;
  const teal = settings.themeColors.v2.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg, color: ink, fontFamily: 'var(--serif)',
      padding: '40px 0', position: 'relative',
    }}>
      {/* film grain */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.4, zIndex: 1,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}/>
      {/* light leak top-right */}
      <div style={{
        position: 'fixed', top: 0, right: 0, width: '40%', height: '50%', pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(ellipse at top right, ${leak} 0%, transparent 60%)`,
      }}/>
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '30%', height: '30%', pointerEvents: 'none', zIndex: 1,
        background: `radial-gradient(ellipse at bottom left, ${leak} 0%, transparent 70%)`, opacity: 0.6,
      }}/>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 660, margin: '0 auto', padding: '0 40px' }}>
        {/* polaroid card with chapter title */}
        <div style={{
          background: frame, padding: '20px 20px 50px', boxShadow: '0 8px 24px rgba(58,42,26,0.25), 0 2px 4px rgba(58,42,26,0.15)',
          transform: 'rotate(-1.2deg)', transformOrigin: 'center', marginBottom: 36,
          border: '0.5px solid rgba(58,42,26,0.08)', position: 'relative',
        }}>
          <div style={{
            background: bg, padding: '32px 24px', position: 'relative',
            backgroundImage: `linear-gradient(135deg, ${leak} 0%, transparent 50%)`,
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.4em', color: ink, opacity: 0.55, fontWeight: 600, textAlign: 'center', marginBottom: 8 }}>
              CH · {String(chapterIdx + 1).padStart(2, '0')}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 500,
              margin: 0, lineHeight: 1.2, letterSpacing: '0.05em', color: ink, textAlign: 'center',
            }}>{stripChapterPrefix(chapterTitle)}</h1>
          </div>
          {/* handwritten caption */}
          <div style={{
            fontFamily: '"Caveat","Brush Script MT","Noto Serif TC",cursive',
            fontSize: 18, color: teal, textAlign: 'center', marginTop: 14, fontStyle: 'italic',
            transform: 'rotate(0.5deg)',
          }}>
            {book.title} · {chapterIdx + 1}/{total}
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          filter: 'sepia(15%)',
          '--accent': teal,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, paddingTop: 20, borderTop: `0.5px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: teal,
            border: `1px solid ${teal}`, fontFamily: '"Caveat","Brush Script MT",cursive', fontSize: 16, fontStyle: 'italic',
          }}>← prev pic</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, background: teal, color: frame,
            border: `1px solid ${teal}`, fontFamily: '"Caveat","Brush Script MT",cursive', fontSize: 16, fontStyle: 'italic',
          }}>next pic →</button>
        </div>
      </div>
    </main>
  );
}

function V2Footer({ book, chapterIdx, settings }) {
  const tone = V2_BG_TONES[settings.themeColors.v2.bgTone] || V2_BG_TONES.cream;
  const teal = settings.themeColors.v2.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Caveat","Brush Script MT",cursive', fontSize: 15, fontStyle: 'italic',
    }}>
      <span style={{ color: teal }}>shot {chapterIdx + 1} of {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: teal }}/>
      </div>
      <span style={{ color: teal }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V2Reader = V2Reader;
window.V2Footer = V2Footer;
