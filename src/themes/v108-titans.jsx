// src/themes/v108-titans.jsx — Wall of Titans 巨人之壁: military report aesthetic
const V108_BG_TONES = {
  wall:     { from: '#2A2620', to: '#1A1714', ink: '#D8CFB8' },
  mortar:   { from: '#2C2A26', to: '#1A1916', ink: '#D4CCB4' },
  rampart:  { from: '#28241E', to: '#16140F', ink: '#D8CCB0' },
  iron:     { from: '#1F1F1F', to: '#0F0F0F', ink: '#D0CCB8' },
  soot:     { from: '#181614', to: '#0A0908', ink: '#C8C0AC' },
  ash:      { from: '#2A2A26', to: '#161614', ink: '#D4D0C0' },
  midnight: { from: '#14161A', to: '#08090C', ink: '#C8CCD0' },
  rust:     { from: '#28201C', to: '#14100E', ink: '#E0CFB8' },
  bone:     { from: '#3A3528', to: '#1F1C14', ink: '#F0E4C8' },
};

function V108Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V108_BG_TONES[settings.themeColors.v108.bgTone] || V108_BG_TONES.wall;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v108.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          display: 'inline-block', padding: '4px 12px', marginBottom: 16,
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: accent,
          letterSpacing: '0.4em', textTransform: 'uppercase', border: `1px solid ${accent}`,
        }}>
          REPORT · {String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 12px', lineHeight: 1.18, letterSpacing: '0.02em', textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: '100%', height: 3, background: accent, marginBottom: 32 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `1px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}55`, borderRadius: 0, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.2em' }}>◀ PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.2em' }}>NEXT ▶</button>
        </div>
      </div>
    </main>
  );
}

function V108Footer({ book, chapterIdx, settings }) {
  const tone = V108_BG_TONES[settings.themeColors.v108.bgTone] || V108_BG_TONES.wall;
  const accent = settings.themeColors.v108.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span>{String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V108Reader = V108Reader;
window.V108Footer = V108Footer;
