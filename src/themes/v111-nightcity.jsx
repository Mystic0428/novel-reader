// src/themes/v111-nightcity.jsx — Night City 夜城: cyberpunk neon advertising
const V111_BG_TONES = {
  nightcity: { from: '#1A0830', to: '#0A0418', ink: '#FFE848', accentAlt: '#FF2A6D' },
  neonpink:  { from: '#1F0A28', to: '#0E0414', ink: '#FFD8E8', accentAlt: '#FF2A6D' },
  tokyo:     { from: '#180A1F', to: '#08040E', ink: '#FFE848', accentAlt: '#00F0FF' },
  matrix:    { from: '#081A0A', to: '#040A04', ink: '#39FF88', accentAlt: '#FFE848' },
  voltage:   { from: '#0A1438', to: '#04081F', ink: '#5AC8FF', accentAlt: '#FFE848' },
  plasma:    { from: '#1F0A1F', to: '#0E040E', ink: '#F0D8FF', accentAlt: '#FF2A6D' },
  cyberred:  { from: '#28080A', to: '#140404', ink: '#FFD8E8', accentAlt: '#FFE848' },
  darkrose:  { from: '#1F0814', to: '#0E0408', ink: '#FFC8D8', accentAlt: '#FF2A6D' },
  midnight:  { from: '#06081A', to: '#020408', ink: '#88E0FF', accentAlt: '#00F0FF' },
};

function V111Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V111_BG_TONES[settings.themeColors.v111.bgTone] || V111_BG_TONES.nightcity;
  const { from, to, ink, accentAlt } = tone;
  const accent = settings.themeColors.v111.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: accent,
          letterSpacing: '0.3em', marginBottom: 14, textTransform: 'uppercase',
          textShadow: `0 0 12px ${accent}`,
        }}>
          // FILE_{String(chapterIdx + 1).padStart(3, '0')} · {String(total).padStart(3, '0')}_TOTAL
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 800,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.18, letterSpacing: '-0.01em',
          textShadow: `0 0 24px ${accent}88, 2px 0 ${accentAlt}`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <span style={{ width: 32, height: 3, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
          <span style={{ width: 16, height: 3, background: accentAlt, boxShadow: `0 0 8px ${accentAlt}` }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `1px solid ${accent}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}55`, borderRadius: 0, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.2em', textShadow: `0 0 6px ${ink}` }}>◀ PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--mono)', fontWeight: 800, letterSpacing: '0.2em', boxShadow: `0 0 16px ${accent}88` }}>NEXT ▶</button>
        </div>
      </div>
    </main>
  );
}

function V111Footer({ book, chapterIdx, settings }) {
  const tone = V111_BG_TONES[settings.themeColors.v111.bgTone] || V111_BG_TONES.nightcity;
  const accent = settings.themeColors.v111.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accent}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent, textShadow: `0 0 6px ${accent}` }}>{String(chapterIdx + 1).padStart(3, '0')} / {String(total).padStart(3, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 12px ${accent}` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V111Reader = V111Reader;
window.V111Footer = V111Footer;
