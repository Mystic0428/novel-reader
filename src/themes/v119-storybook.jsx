// src/themes/v119-storybook.jsx — Storybook 故事書: warm cream picture-book aesthetic
const V119_BG_TONES = {
  cream:    { bg: '#F8EDD4', ink: '#3A2A1A' },
  butter:   { bg: '#FAEFC8', ink: '#3A2A1A' },
  peach:    { bg: '#FBE4D4', ink: '#3A2818' },
  mint:     { bg: '#E8F0E0', ink: '#2C3A28' },
  sky:      { bg: '#E4F0F4', ink: '#2C384A' },
  rose:     { bg: '#FBE0E0', ink: '#3A2A2A' },
  sunshine: { bg: '#FCEFC0', ink: '#3A2A0E' },
  lilac:    { bg: '#EFE4F4', ink: '#3A2A4A' },
  sage:     { bg: '#EAEFDC', ink: '#2C3A28' },
};

function V119Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V119_BG_TONES[settings.themeColors.v119.bgTone] || V119_BG_TONES.cream;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v119.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: accent, fontWeight: 600, marginBottom: 14, fontStyle: 'italic' }}>
          ✿ 第 {chapterIdx + 1} 章 · 共 {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 16px', lineHeight: 1.28, letterSpacing: '0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        {/* Wavy divider — picture-book friendly */}
        <svg viewBox="0 0 200 8" width="200" height="8" aria-hidden style={{ display: 'block', marginBottom: 32 }}>
          <path d="M0 4 Q10 0 20 4 T40 4 T60 4 T80 4 T100 4 T120 4 T140 4 T160 4 T180 4 T200 4"
            fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}22` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}33`, borderRadius: 999, padding: '6px 16px', fontFamily: 'var(--serif)' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FFF', border: `1px solid ${accent}`, borderRadius: 999, padding: '6px 16px', fontFamily: 'var(--serif)', fontWeight: 600 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V119Footer({ book, chapterIdx, settings }) {
  const tone = V119_BG_TONES[settings.themeColors.v119.bgTone] || V119_BG_TONES.cream;
  const accent = settings.themeColors.v119.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: accent }}>✿ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 4, background: `${tone.ink}1A`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, borderRadius: 2 }}/>
      </div>
      <span style={{ color: accent, fontWeight: 600 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V119Reader = V119Reader;
window.V119Footer = V119Footer;
