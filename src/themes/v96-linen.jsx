// src/themes/v96-linen.jsx — Linen 亞麻: textured neutral paper with linen weave
const V96_BG_TONES = {
  linen:     { bg: '#EAE3D2', ink: '#2C2418' },
  oatmeal:   { bg: '#E8DEC0', ink: '#2C2418' },
  flax:      { bg: '#DDD2BC', ink: '#2C2418' },
  parchment: { bg: '#E5DCC4', ink: '#2C2418' },
  mushroom:  { bg: '#C9C0AE', ink: '#1F1A14' },
  driftwood: { bg: '#C5B59C', ink: '#1F1A14' },
  stone:     { bg: '#DCD7CB', ink: '#2C2418' },
  tea:       { bg: '#E0D2B6', ink: '#2C2418' },
  fog:       { bg: '#DCD8CC', ink: '#2C2418' },
};

function V96Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V96_BG_TONES[settings.themeColors.v96.bgTone] || V96_BG_TONES.linen;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v96.accent;
  const total = book.chaptersMeta.length;
  const linenTexture = settings.tweaks.texture
    ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='lw'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.045 0'/></filter><rect width='100%25' height='100%25' filter='url(%23lw)'/></svg>")`
    : 'none';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '64px 24px',
      backgroundImage: linenTexture,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: ink, opacity: 0.55, fontFamily: 'var(--serif)', fontWeight: 500, marginBottom: 12, textTransform: 'uppercase' }}>
          chapter {String(chapterIdx + 1).padStart(2, '0')} · {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 16px', lineHeight: 1.22, letterSpacing: '0.01em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 48, height: 2, background: accent, marginBottom: 36 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: 1.95, letterSpacing: '0.01em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 22, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', letterSpacing: '0.1em' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', letterSpacing: '0.1em' }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V96Footer({ book, chapterIdx, settings }) {
  const tone = V96_BG_TONES[settings.themeColors.v96.bgTone] || V96_BG_TONES.linen;
  const accent = settings.themeColors.v96.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ opacity: 0.7, letterSpacing: '0.1em' }}>第 {chapterIdx + 1} / {total} 章</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}1F`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V96Reader = V96Reader;
window.V96Footer = V96Footer;
