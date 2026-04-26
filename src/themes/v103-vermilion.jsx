// src/themes/v103-vermilion.jsx — Vermilion 朱砂: thread-bound book with cinnabar seal
const V103_BG_TONES = {
  vermilion: { bg: '#F0E4C8', ink: '#2A1A0E' },
  cinnabar:  { bg: '#EEDEBC', ink: '#2A1A0E' },
  ochre:     { bg: '#E8D8B0', ink: '#2A1A0E' },
  dusk:      { bg: '#E0CFAA', ink: '#1F1408' },
  ash:       { bg: '#DCD4C0', ink: '#1F1408' },
  ink:       { bg: '#1A1208', ink: '#E8DCC0' },
  bone:      { bg: '#F2EAD0', ink: '#2A1A0E' },
  snow:      { bg: '#F8F2DC', ink: '#1F1408' },
  plum:      { bg: '#E8D0C8', ink: '#2A1A0E' },
};

function V103Seal({ accent, n }) {
  return (
    <div style={{
      width: 56, height: 56, border: `2.5px solid ${accent}`, borderRadius: 4,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: accent, fontFamily: 'var(--serif)', fontWeight: 700,
      fontSize: 22, letterSpacing: '0.02em',
      transform: 'rotate(-4deg)',
    }}>
      {n}
    </div>
  );
}

function V103Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V103_BG_TONES[settings.themeColors.v103.bgTone] || V103_BG_TONES.vermilion;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v103.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -10, right: 0 }}>
          <V103Seal accent={accent} n={chapterIdx + 1}/>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: ink, opacity: 0.6, marginBottom: 14, fontFamily: 'var(--serif)' }}>
          線裝書 · 第 {chapterIdx + 1} 篇
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.04em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, color: accent }}>
          <span style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 700 }}>朱印</span>
          <span style={{ flex: 1, height: 2, background: accent }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, letterSpacing: '0.03em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `1px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}55`, borderRadius: 0, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>◀ 前篇</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FAF0DC', border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.2em' }}>後篇 ▶</button>
        </div>
      </div>
    </main>
  );
}

function V103Footer({ book, chapterIdx, settings }) {
  const tone = V103_BG_TONES[settings.themeColors.v103.bgTone] || V103_BG_TONES.vermilion;
  const accent = settings.themeColors.v103.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.ink}33`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.15em' }}>第 {chapterIdx + 1} 篇 / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V103Reader = V103Reader;
window.V103Footer = V103Footer;
