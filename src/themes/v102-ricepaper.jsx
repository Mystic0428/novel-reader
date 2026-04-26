// src/themes/v102-ricepaper.jsx — Rice Paper 宣紙: traditional ink-painting paper
const V102_BG_TONES = {
  xuan:     { bg: '#F2EAD8', ink: '#1A1208' },
  rice:     { bg: '#F5EEDC', ink: '#1A1208' },
  mulberry: { bg: '#EEE2C8', ink: '#1F1408' },
  hemp:     { bg: '#E8DEC4', ink: '#1A1208' },
  cotton:   { bg: '#F4ECDC', ink: '#1F1408' },
  ash:      { bg: '#DCD4C0', ink: '#1A1208' },
  ivory:    { bg: '#F8F0DC', ink: '#1F1408' },
  oat:      { bg: '#EBE2C8', ink: '#1A1208' },
  dawn:     { bg: '#F0E4CC', ink: '#1A1208' },
};

function V102Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V102_BG_TONES[settings.themeColors.v102.bgTone] || V102_BG_TONES.xuan;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v102.accent;
  const total = book.chaptersMeta.length;
  const fiberTexture = settings.tweaks.texture
    ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='xn'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='9'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23xn)'/></svg>")`
    : 'none';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: bg, backgroundImage: fiberTexture,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: ink, opacity: 0.55, marginBottom: 12, fontFamily: 'var(--serif)' }}>
          第 {chapterIdx + 1} 卷 · 共 {total} 卷
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 12px', lineHeight: 1.22, letterSpacing: '0.04em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 56, height: 1.5, background: accent, marginBottom: 36, opacity: 0.85 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, letterSpacing: '0.03em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', letterSpacing: '0.15em' }}>← 前卷</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', letterSpacing: '0.15em' }}>後卷 →</button>
        </div>
      </div>
    </main>
  );
}

function V102Footer({ book, chapterIdx, settings }) {
  const tone = V102_BG_TONES[settings.themeColors.v102.bgTone] || V102_BG_TONES.xuan;
  const accent = settings.themeColors.v102.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ opacity: 0.7 }}>第 {chapterIdx + 1} / {total} 卷</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}1F`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V102Reader = V102Reader;
window.V102Footer = V102Footer;
