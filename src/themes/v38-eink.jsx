// src/themes/v38-eink.jsx — E-Ink Paper: pure reading, monochrome, paper grain
const V38_BG_TONES = {
  bone:     { bg: '#FAF8F3', ink: '#1A1A1A', mute: 'rgba(26,26,26,0.55)',   rule: 'rgba(26,26,26,0.18)' },
  cream:    { bg: '#F8F2E2', ink: '#1A1A1A', mute: 'rgba(26,26,26,0.55)',   rule: 'rgba(26,26,26,0.18)' },
  linen:    { bg: '#F2EDE0', ink: '#1A1A1A', mute: 'rgba(26,26,26,0.55)',   rule: 'rgba(26,26,26,0.18)' },
  mist:     { bg: '#EFEFEC', ink: '#2A2A2A', mute: 'rgba(42,42,42,0.55)',   rule: 'rgba(42,42,42,0.18)' },
  ash:      { bg: '#DDD8CD', ink: '#1A1A1A', mute: 'rgba(26,26,26,0.55)',   rule: 'rgba(26,26,26,0.20)' },
  sepia:    { bg: '#F5E8D5', ink: '#3D2818', mute: 'rgba(61,40,24,0.55)',   rule: 'rgba(61,40,24,0.20)' },
  dusk:     { bg: '#E8E5DC', ink: '#1A1A1A', mute: 'rgba(26,26,26,0.55)',   rule: 'rgba(26,26,26,0.20)' },
  night:    { bg: '#1A1A1A', ink: '#F0EDE5', mute: 'rgba(240,237,229,0.55)',rule: 'rgba(240,237,229,0.18)' },
  graphite: { bg: '#2C2C2C', ink: '#E5E2DA', mute: 'rgba(229,226,218,0.55)',rule: 'rgba(229,226,218,0.18)' },
};

function V38Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V38_BG_TONES[settings.themeColors.v38.bgTone] || V38_BG_TONES.bone;
  const { bg, ink, mute, rule } = tone;
  const accent = settings.themeColors.v38.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink,
      padding: '64px 24px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, letterSpacing: '0.3em', color: mute, fontWeight: 600, marginBottom: 14 }}>
          <span>CHAPTER {String(chapterIdx + 1).padStart(2, '0')}</span>
          <span style={{ flex: 1, height: 1, background: rule }}/>
          <span>{String(chapterIdx + 1)} / {total}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14,
          margin: '0 0 40px', lineHeight: 1.2, color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 60, paddingTop: 20, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.25, background: 'transparent', color: ink, border: `0.5px solid ${rule}`, borderRadius: 0, fontFamily: 'var(--serif)' }}>← PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.25, background: 'transparent', color: ink, border: `0.5px solid ${rule}`, borderRadius: 0, fontFamily: 'var(--serif)' }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V38Footer({ book, chapterIdx, settings }) {
  const tone = V38_BG_TONES[settings.themeColors.v38.bgTone] || V38_BG_TONES.bone;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', borderTop: `0.5px solid ${tone.rule}`, background: tone.bg, color: tone.mute,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.08em' }}>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.ink, opacity: 0.65 }}/>
      </div>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V38Reader = V38Reader;
window.V38Footer = V38Footer;
