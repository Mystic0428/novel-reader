// src/themes/v106-twilight.jsx — Twilight 微光: ethereal dream-haze with floating particles
const V106_BG_TONES = {
  twilight: { from: '#2C2438', to: '#15101F', ink: '#D8C8E8' },
  lavender: { from: '#28203C', to: '#13101F', ink: '#D8C8E8' },
  dusk:     { from: '#1F1A30', to: '#0E0A18', ink: '#CFC0DC' },
  midnight: { from: '#15142A', to: '#08081A', ink: '#C8C0D8' },
  plum:     { from: '#28182C', to: '#13081A', ink: '#D4C0D0' },
  ember:    { from: '#2A1820', to: '#15080A', ink: '#E0C8C0' },
  navy:     { from: '#16203A', to: '#08101F', ink: '#C8D0E0' },
  mist:     { from: '#322840', to: '#1A1428', ink: '#DCCCE8' },
  void:     { from: '#0E0E18', to: '#04040A', ink: '#B8B0C8' },
};

// Floating dust particles — fixed positions, decorative
const V106_PARTICLES = [
  { x: 14, y: 22, r: 1.6, blur: 4, o: 0.55 },
  { x: 32, y: 8,  r: 1.0, blur: 3, o: 0.45 },
  { x: 56, y: 18, r: 2.0, blur: 6, o: 0.6 },
  { x: 76, y: 32, r: 1.2, blur: 4, o: 0.5 },
  { x: 88, y: 12, r: 0.9, blur: 3, o: 0.4 },
  { x: 10, y: 64, r: 1.4, blur: 5, o: 0.5 },
  { x: 44, y: 78, r: 1.8, blur: 6, o: 0.55 },
  { x: 70, y: 86, r: 1.1, blur: 4, o: 0.4 },
  { x: 92, y: 58, r: 1.3, blur: 5, o: 0.45 },
];

function V106Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V106_BG_TONES[settings.themeColors.v106.bgTone] || V106_BG_TONES.twilight;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v106.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `radial-gradient(ellipse at 50% 30%, ${from}, ${to} 70%)`,
    }}>
      {/* Heavy top vignette to deepen the haze */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% -20%, ${accent}1A 0%, transparent 40%), radial-gradient(ellipse at 50% 120%, ${to} 0%, transparent 60%)`,
      }}/>
      {/* Floating particle dust */}
      <svg aria-hidden preserveAspectRatio="none" viewBox="0 0 100 100"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <defs>
          <filter id="v106blur"><feGaussianBlur stdDeviation="0.6"/></filter>
        </defs>
        {V106_PARTICLES.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={accent} opacity={p.o} filter="url(#v106blur)"/>
        ))}
      </svg>

      <div style={{ maxWidth: 620, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.42em', color: accent, fontWeight: 400, fontStyle: 'italic', marginBottom: 18, opacity: 0.85, textAlign: 'center' }}>
          ✶ {chapterIdx + 1} of {total} ✶
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 400, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 18, color: ink,
          margin: '0 0 14px', lineHeight: 1.18, letterSpacing: '0.005em',
          textAlign: 'center',
          textShadow: `0 0 28px ${accent}66, 0 0 56px ${accent}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        {/* Gradient fade-out divider — no hard line */}
        <div style={{
          height: 1, marginBottom: 40,
          background: `linear-gradient(90deg, transparent 0%, ${accent}88 50%, transparent 100%)`,
          boxShadow: `0 0 12px ${accent}55`,
        }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        {/* Closing fade */}
        <div style={{
          height: 1, marginTop: 48,
          background: `linear-gradient(90deg, transparent 0%, ${accent}55 50%, transparent 100%)`,
        }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px',
            background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 999,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
          }}>← prior</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px',
            background: 'transparent', color: ink, border: `0.5px solid ${accent}88`, borderRadius: 999,
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            boxShadow: `0 0 16px ${accent}33`,
          }}>onward →</button>
        </div>
      </div>
    </main>
  );
}

function V106Footer({ book, chapterIdx, settings }) {
  const tone = V106_BG_TONES[settings.themeColors.v106.bgTone] || V106_BG_TONES.twilight;
  const accent = settings.themeColors.v106.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.2em' }}>✶ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(90deg, transparent, ${accent} 80%)`, boxShadow: `0 0 10px ${accent}88` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V106Reader = V106Reader;
window.V106Footer = V106Footer;
