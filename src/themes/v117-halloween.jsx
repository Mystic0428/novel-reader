// src/themes/v117-halloween.jsx — Halloween 萬聖: pumpkin glow + bat silhouette
const V117_BG_TONES = {
  witchnight: { from: '#1F0F2A', to: '#0E0518', ink: '#F0E8D0', accentAlt: '#9A28D4' },
  pumpkin:    { from: '#2A1408', to: '#140A04', ink: '#FFE8C8', accentAlt: '#9A28D4' },
  spiderweb:  { from: '#181820', to: '#08080A', ink: '#E8E0DC', accentAlt: '#FF7728' },
  cauldron:   { from: '#0A1A1F', to: '#040A0E', ink: '#D8E4D8', accentAlt: '#9A28D4' },
  gravetomb:  { from: '#1A1F28', to: '#0E1014', ink: '#D0D8D0', accentAlt: '#FF7728' },
  bloodmoon:  { from: '#28080A', to: '#140404', ink: '#F0D8C8', accentAlt: '#FF7728' },
  ravenwing:  { from: '#0A0A0A', to: '#020202', ink: '#D8D0C8', accentAlt: '#FF7728' },
  fog:        { from: '#1F1F28', to: '#0F0F18', ink: '#E0DCD0', accentAlt: '#9A28D4' },
  voidpurple: { from: '#14082A', to: '#080414', ink: '#E0D0E8', accentAlt: '#FF7728' },
};

function V117Bat({ accent, x, y, scale = 1, flip }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale * (flip ? -1 : 1)},${scale})`}>
      <path d="M0 0 Q-3 -2 -7 0 Q-9 -3 -12 -2 Q-9 0 -10 4 Q-6 2 -3 4 L0 2 L3 4 Q6 2 10 4 Q9 0 12 -2 Q9 -3 7 0 Q3 -2 0 0 Z"
        fill={accent} opacity="0.5"/>
    </g>
  );
}

function V117Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V117_BG_TONES[settings.themeColors.v117.bgTone] || V117_BG_TONES.witchnight;
  const { from, to, ink, accentAlt } = tone;
  const accent = settings.themeColors.v117.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
    }}>
      {/* Bat silhouettes scattered in the background */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <V117Bat accent={accentAlt} x={14} y={12} scale={0.9}/>
        <V117Bat accent={accentAlt} x={82} y={20} scale={1.1} flip/>
        <V117Bat accent={accentAlt} x={56} y={8} scale={0.7}/>
        <V117Bat accent={accentAlt} x={28} y={84} scale={0.8}/>
        <V117Bat accent={accentAlt} x={92} y={70} scale={0.6} flip/>
      </svg>
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.4em', color: accent, fontWeight: 700, marginBottom: 14, textTransform: 'uppercase', textShadow: `0 0 12px ${accent}66` }}>
          🎃 OCT 31 · 第 {chapterIdx + 1} 夜
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 700, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.18, letterSpacing: '0.02em',
          textShadow: `0 0 24px ${accent}66`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          height: 1, marginBottom: 36,
          background: `linear-gradient(90deg, ${accent}, ${accentAlt} 50%, transparent)`,
          boxShadow: `0 0 8px ${accent}66`,
        }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${accent}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${accentAlt}66`, borderRadius: 0, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>← 前夜</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 700, fontStyle: 'italic', boxShadow: `0 0 12px ${accent}66` }}>後夜 →</button>
        </div>
      </div>
    </main>
  );
}

function V117Footer({ book, chapterIdx, settings }) {
  const tone = V117_BG_TONES[settings.themeColors.v117.bgTone] || V117_BG_TONES.witchnight;
  const accent = settings.themeColors.v117.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accent}44`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.2em', color: accent }}>🎃 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V117Reader = V117Reader;
window.V117Footer = V117Footer;
