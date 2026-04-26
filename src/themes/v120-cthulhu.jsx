// src/themes/v120-cthulhu.jsx — Cthulhu 克蘇魯: deep oceanic dread
const V120_BG_TONES = {
  abyssgreen: { from: '#0F2828', to: '#050F0F', ink: '#A8C8C0' },
  mire:       { from: '#142824', to: '#080F0E', ink: '#A8C8B8' },
  kelp:       { from: '#0F2A20', to: '#04140A', ink: '#A0C8B0' },
  slime:      { from: '#1A2820', to: '#08140A', ink: '#B0C8A8' },
  rlyeh:      { from: '#0A1A28', to: '#040A14', ink: '#A8C0D0' },
  tentacle:   { from: '#1A1A2A', to: '#080814', ink: '#B0B0C8' },
  voidocean:  { from: '#04141A', to: '#020608', ink: '#A0B8C0' },
  fungus:     { from: '#1F2814', to: '#0E1408', ink: '#B8C098' },
  dredge:     { from: '#1A1A14', to: '#0A0A08', ink: '#B0B098' },
};

function V120Tentacle({ accent, x, y, w = 80, h = 60, flip }) {
  return (
    <svg viewBox="0 0 80 60" width={w} height={h}
      style={{ position: 'absolute', left: x, bottom: y, transform: flip ? 'scaleX(-1)' : undefined, opacity: 0.18, pointerEvents: 'none' }}>
      <path d="M0 60 Q10 40 20 50 Q30 30 35 45 Q42 25 50 40 Q60 22 65 38 Q72 28 78 35"
        fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function V120Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V120_BG_TONES[settings.themeColors.v120.bgTone] || V120_BG_TONES.abyssgreen;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v120.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `radial-gradient(ellipse at 30% 70%, ${from} 0%, ${to} 80%)`,
    }}>
      <V120Tentacle accent={accent} x="2%" y="3%" w={140} h={100}/>
      <V120Tentacle accent={accent} x="auto" y="3%" w={140} h={100} flip/>
      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.4em', color: accent, fontWeight: 600, marginBottom: 16, fontStyle: 'italic', textTransform: 'uppercase' }}>
          Ω 深淵記述 · {chapterIdx + 1}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.03em',
          textShadow: `0 0 18px ${accent}55`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          height: 1, marginBottom: 36,
          background: `linear-gradient(90deg, transparent, ${accent}88 50%, transparent)`,
        }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}44`, borderRadius: 0, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em' }}>◁ 前述</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.18em' }}>後述 ▷</button>
        </div>
      </div>
    </main>
  );
}

function V120Footer({ book, chapterIdx, settings }) {
  const tone = V120_BG_TONES[settings.themeColors.v120.bgTone] || V120_BG_TONES.abyssgreen;
  const accent = settings.themeColors.v120.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.2em', color: accent }}>Ω {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V120Reader = V120Reader;
window.V120Footer = V120Footer;
