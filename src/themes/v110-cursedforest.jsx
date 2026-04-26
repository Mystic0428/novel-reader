// src/themes/v110-cursedforest.jsx — Cursed Forest 詛咒森林: dark fairy tale fog with bioluminescent moss
const V110_BG_TONES = {
  forest:   { from: '#1A2A1F', to: '#0A1410', ink: '#C8D4B8' },
  moss:     { from: '#1F2A1F', to: '#0E1408', ink: '#D0DCB8' },
  fern:     { from: '#1A2818', to: '#0A140A', ink: '#C8D4A8' },
  pine:     { from: '#0F2820', to: '#040E0A', ink: '#C0D4C0' },
  thicket:  { from: '#1A1F14', to: '#080A05', ink: '#C8C8A8' },
  mire:     { from: '#1F2418', to: '#0E0F08', ink: '#C8C4A8' },
  midnight: { from: '#0A1410', to: '#040808', ink: '#A8C0A8' },
  fog:      { from: '#28302A', to: '#14181A', ink: '#D8DCC8' },
  rot:      { from: '#1F1814', to: '#0A0808', ink: '#C0B898' },
};

function V110Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V110_BG_TONES[settings.themeColors.v110.bgTone] || V110_BG_TONES.forest;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v110.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `radial-gradient(ellipse at 40% 60%, ${from} 0%, ${to} 80%)`,
    }}>
      {/* Floating moss-glow particles */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="v110glow"><feGaussianBlur stdDeviation="0.8"/></filter>
        </defs>
        {[[18,28,1.4],[72,18,1.0],[48,72,1.6],[30,84,1.2],[88,52,0.9],[12,62,1.1]].map(([x,y,r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={accent} opacity="0.55" filter="url(#v110glow)"/>
        ))}
      </svg>
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.32em', color: accent, fontWeight: 500, marginBottom: 14, fontStyle: 'italic' }}>
          ❀ 第 {chapterIdx + 1} 夜 · 共 {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.02em',
          textShadow: `0 0 20px ${accent}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 64, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)`, marginBottom: 36, boxShadow: `0 0 8px ${accent}` }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}22` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 4, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>← 前夜</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 4, fontFamily: 'var(--serif)', fontWeight: 600, fontStyle: 'italic' }}>後夜 →</button>
        </div>
      </div>
    </main>
  );
}

function V110Footer({ book, chapterIdx, settings }) {
  const tone = V110_BG_TONES[settings.themeColors.v110.bgTone] || V110_BG_TONES.forest;
  const accent = settings.themeColors.v110.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.15em' }}>第 {chapterIdx + 1} 夜 / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 6px ${accent}` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V110Reader = V110Reader;
window.V110Footer = V110Footer;
