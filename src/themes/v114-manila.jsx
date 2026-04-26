// src/themes/v114-manila.jsx — Manila 牛皮: aged file folder paper
const V114_BG_TONES = {
  manila:   { bg: '#D4B98C', ink: '#2A1A0F' },
  kraft:    { bg: '#C8A878', ink: '#2A1A0F' },
  envelope: { bg: '#D8BC8C', ink: '#2A1A0F' },
  hemp:     { bg: '#C8B088', ink: '#2A1A0F' },
  tobacco:  { bg: '#B89868', ink: '#1F1208' },
  cognac:   { bg: '#C09668', ink: '#1F1208' },
  walnut:   { bg: '#A88858', ink: '#1A0F08' },
  sand:     { bg: '#E0C898', ink: '#3A2818' },
  bronze:   { bg: '#B89058', ink: '#1F0E08' },
};

function V114Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V114_BG_TONES[settings.themeColors.v114.bgTone] || V114_BG_TONES.manila;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v114.accent;
  const total = book.chaptersMeta.length;
  const fiberTexture = settings.tweaks.texture
    ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='kn'><feTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' seed='4'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23kn)'/></svg>")`
    : 'none';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: bg, backgroundImage: fiberTexture,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', padding: '4px 10px', marginBottom: 16,
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: accent,
          letterSpacing: '0.32em', textTransform: 'uppercase', border: `1px solid ${ink}66`,
        }}>
          FILE · {String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.02em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: '100%', height: 1, background: ink, opacity: 0.4, marginBottom: 32 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `1px solid ${ink}44` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}55`, borderRadius: 2, fontFamily: 'var(--serif)', letterSpacing: '0.15em' }}>← 上一頁</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: bg, border: `1px solid ${accent}`, borderRadius: 2, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.15em' }}>下一頁 →</button>
        </div>
      </div>
    </main>
  );
}

function V114Footer({ book, chapterIdx, settings }) {
  const tone = V114_BG_TONES[settings.themeColors.v114.bgTone] || V114_BG_TONES.manila;
  const accent = settings.themeColors.v114.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.ink}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em',
    }}>
      <span>FILE · {String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V114Reader = V114Reader;
window.V114Footer = V114Footer;
