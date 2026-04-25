// src/themes/v41-riso.jsx — Risograph print: duotone, halftone dots, slight misregistration
const V41_BG_TONES = {
  oat:        { bg: '#FAF6E5', ink: '#1A1A1A' },
  newsprint:  { bg: '#F0E8D5', ink: '#1A1A1A' },
  mint:       { bg: '#E8F5EA', ink: '#1A1A1A' },
  peach:      { bg: '#FFE4D8', ink: '#1A1A1A' },
  coral:      { bg: '#FFD9D2', ink: '#1A1A1A' },
  lavender:   { bg: '#EAE4F4', ink: '#1A1A1A' },
  bone:       { bg: '#F5F2E8', ink: '#1A1A1A' },
  sage:       { bg: '#DFE5D8', ink: '#1A1A1A' },
  bubblegum:  { bg: '#FFD0E5', ink: '#1A1A1A' },
};

function V41Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V41_BG_TONES[settings.themeColors.v41.bgTone] || V41_BG_TONES.oat;
  const { bg, ink } = tone;
  const ink1 = settings.themeColors.v41.accent;       // primary print color
  const ink2 = '#2E5BFF';                              // secondary print (riso blue)
  const total = book.chaptersMeta.length;
  const rawTitle = stripChapterPrefix(chapterTitle);
  // Halftone dot SVG as background — gives the riso "imperfect ink coverage" feel
  const halftone = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><circle cx='2' cy='2' r='0.8' fill='%23000' opacity='0.06'/></svg>")`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '40px 0',
      backgroundImage: halftone, backgroundSize: '6px 6px',
      fontFamily: 'var(--ui)',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 50px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', marginBottom: 14 }}>
          <span style={{ background: ink1, color: bg, padding: '3px 8px' }}>ISSUE {String(chapterIdx + 1).padStart(2, '0')}</span>
          <span style={{ background: ink2, color: bg, padding: '3px 8px' }}>OF {String(total).padStart(2, '0')}</span>
          <span style={{ flex: 1, height: 2, background: ink, opacity: 0.85 }}/>
        </div>
        {/* Duotone misregistered title — pink layer offset 3px down-right, blue layer offset 3px up-left, ink layer crisp on top */}
        <div style={{ position: 'relative', marginBottom: 36, lineHeight: 1.05 }}>
          <h1 style={{ position: 'absolute', inset: 0, color: ink1, fontWeight: 900, fontSize: settings.tweaks.fontSize + 22, letterSpacing: '-0.02em', margin: 0, transform: 'translate(3px, 3px)', mixBlendMode: 'multiply', opacity: 0.85 }}>{rawTitle}</h1>
          <h1 style={{ position: 'absolute', inset: 0, color: ink2, fontWeight: 900, fontSize: settings.tweaks.fontSize + 22, letterSpacing: '-0.02em', margin: 0, transform: 'translate(-3px, -3px)', mixBlendMode: 'multiply', opacity: 0.7 }}>{rawTitle}</h1>
          <h1 style={{ position: 'relative', color: ink, fontWeight: 900, fontSize: settings.tweaks.fontSize + 22, letterSpacing: '-0.02em', margin: 0 }}>{rawTitle}</h1>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--ui)',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': ink1,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        {/* Halftone "stamp" footer */}
        <div style={{ marginTop: 50, padding: 16, border: `2px solid ${ink}`, position: 'relative', background: bg }}>
          <div style={{ position: 'absolute', top: -10, left: 14, padding: '0 8px', background: bg, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em', color: ink2 }}>END OF ISSUE</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 6 }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: ink2, color: bg, border: 'none', borderRadius: 0, fontWeight: 900, letterSpacing: '0.18em', fontFamily: 'inherit' }}>‹ BACK</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink1, color: bg, border: 'none', borderRadius: 0, fontWeight: 900, letterSpacing: '0.18em', fontFamily: 'inherit' }}>NEXT ›</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V41Footer({ book, chapterIdx, settings }) {
  const tone = V41_BG_TONES[settings.themeColors.v41.bgTone] || V41_BG_TONES.oat;
  const ink1 = settings.themeColors.v41.accent;
  const ink2 = '#2E5BFF';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', borderTop: `2px solid ${tone.ink}`, background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--ui)', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em',
    }}>
      <span style={{ color: ink1 }}>#{String(chapterIdx + 1).padStart(3, '0')}</span>
      <span style={{ opacity: 0.5 }}>/</span>
      <span style={{ color: ink2 }}>{String(total).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 6, background: 'transparent', position: 'relative', border: `1.5px solid ${tone.ink}` }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: ink1, mixBlendMode: 'multiply' }}/>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: ink2, opacity: 0.55, transform: 'translate(2px, 1px)', mixBlendMode: 'multiply' }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V41Reader = V41Reader;
window.V41Footer = V41Footer;
