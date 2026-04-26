// src/themes/v101-bambooslip.jsx — Bamboo Slip 竹簡: vertical bamboo strips with cinnabar accent
const V101_BG_TONES = {
  bamboo: { stripA: '#D4B782', stripB: '#C8A872', ink: '#2A1808' },
  jade:   { stripA: '#C9C898', ink: '#1F2818', stripB: '#B8B888' },
  oolong: { stripA: '#C4A878', stripB: '#B89868', ink: '#2A1808' },
  fog:    { stripA: '#D4D0C0', stripB: '#C8C4B4', ink: '#1F1F18' },
  ash:    { stripA: '#C0BAB0', stripB: '#B4AFA4', ink: '#1F1F18' },
  sand:   { stripA: '#D8C898', stripB: '#CBB888', ink: '#2A1F0E' },
  willow: { stripA: '#C8C898', stripB: '#B8B888', ink: '#1F2818' },
  tea:    { stripA: '#C8B088', stripB: '#B8A078', ink: '#2A1808' },
  ivory:  { stripA: '#E8DCC0', stripB: '#DCD0B0', ink: '#2A1F0E' },
};

function V101Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V101_BG_TONES[settings.themeColors.v101.bgTone] || V101_BG_TONES.bamboo;
  const { stripA, stripB, ink } = tone;
  const accent = settings.themeColors.v101.accent;
  const total = book.chaptersMeta.length;
  const stripBg = `repeating-linear-gradient(90deg, ${stripA} 0, ${stripA} 22px, ${stripB} 22px, ${stripB} 23px)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: stripBg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', background: `${stripA}E0`, padding: '40px 36px', boxShadow: `0 1px 3px ${ink}33` }}>
        <div style={{ display: 'inline-block', padding: '4px 10px', border: `1px solid ${accent}`, fontSize: 11, letterSpacing: '0.3em', color: accent, fontWeight: 700, marginBottom: 16 }}>
          第 {chapterIdx + 1} 簡 · 共 {total} 簡
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.3, letterSpacing: '0.05em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 80, height: 2, background: accent, marginBottom: 32 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, letterSpacing: '0.04em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 20, borderTop: `0.5px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}55`, borderRadius: 0, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>← 前簡</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FAF4E0', border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.2em' }}>後簡 →</button>
        </div>
      </div>
    </main>
  );
}

function V101Footer({ book, chapterIdx, settings }) {
  const tone = V101_BG_TONES[settings.themeColors.v101.bgTone] || V101_BG_TONES.bamboo;
  const accent = settings.themeColors.v101.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.stripA, color: tone.ink, borderTop: `0.5px solid ${tone.ink}33`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.15em' }}>第 {chapterIdx + 1} 簡 / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V101Reader = V101Reader;
window.V101Footer = V101Footer;
