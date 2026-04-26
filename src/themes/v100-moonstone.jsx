// src/themes/v100-moonstone.jsx — Moonstone 月長石: mystical asymmetric study with crescent + stardust
const V100_BG_TONES = {
  moonstone: { bg: '#141A28', surface: '#1F2738', ink: '#D0D8E8', mute: '#7888A0', rule: '#2A3548' },
  navy:      { bg: '#0E1828', surface: '#162236', ink: '#CFD8E8', mute: '#7088A8', rule: '#243248' },
  twilight:  { bg: '#181E32', surface: '#252E48', ink: '#D4DCEC', mute: '#7C8AA8', rule: '#303A54' },
  midnight:  { bg: '#0A0E1F', surface: '#141A30', ink: '#C8D0E2', mute: '#6878A0', rule: '#1F2A40' },
  slate:     { bg: '#1A2332', surface: '#26303F', ink: '#D0D8E0', mute: '#788090', rule: '#303A48' },
  abyss:     { bg: '#06091A', surface: '#0E1428', ink: '#B8C4D8', mute: '#5C6C8C', rule: '#1A2438' },
  ocean:     { bg: '#08182A', surface: '#102438', ink: '#C0D0E0', mute: '#688098', rule: '#1A2C44' },
  indigo:    { bg: '#10142A', surface: '#1A2040', ink: '#CCD0E8', mute: '#7480A0', rule: '#262C4A' },
  glacier:   { bg: '#1F2A38', surface: '#2A3848', ink: '#DCE4EC', mute: '#8898AC', rule: '#384858' },
};

// Star positions for the faint stardust overlay — fixed seed so layout doesn't reflow
const V100_STARS = [
  { x: 8,  y: 12, r: 1.0, o: 0.6 },
  { x: 22, y: 30, r: 0.7, o: 0.4 },
  { x: 78, y: 18, r: 1.2, o: 0.7 },
  { x: 92, y: 44, r: 0.8, o: 0.45 },
  { x: 16, y: 62, r: 1.1, o: 0.55 },
  { x: 88, y: 78, r: 0.9, o: 0.5 },
  { x: 36, y: 84, r: 0.7, o: 0.4 },
  { x: 62, y: 8,  r: 0.8, o: 0.35 },
];

function V100Crescent({ accent, size = 88 }) {
  return (
    <svg viewBox="0 0 88 88" width={size} height={size} aria-hidden style={{ display: 'block' }}>
      <defs>
        <radialGradient id="v100glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35"/>
          <stop offset="60%" stopColor={accent} stopOpacity="0.08"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0"/>
        </radialGradient>
        <mask id="v100crescent">
          <rect width="88" height="88" fill="black"/>
          <circle cx="44" cy="44" r="32" fill="white"/>
          <circle cx="56" cy="38" r="30" fill="black"/>
        </mask>
      </defs>
      <circle cx="44" cy="44" r="44" fill="url(#v100glow)"/>
      <rect width="88" height="88" fill={accent} mask="url(#v100crescent)" opacity="0.85"/>
    </svg>
  );
}

function V100Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V100_BG_TONES[settings.themeColors.v100.bgTone] || V100_BG_TONES.moonstone;
  const { bg, surface, ink, mute, rule } = tone;
  const accent = settings.themeColors.v100.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '48px 24px', position: 'relative',
      background: `radial-gradient(circle at 18% 12%, ${surface} 0%, ${bg} 60%)`,
    }}>
      {/* Stardust overlay — fixed positions, decorative only */}
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        preserveAspectRatio="none" viewBox="0 0 100 100"
      >
        {V100_STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={ink} opacity={s.o * 0.7}/>
        ))}
      </svg>

      <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', display: 'grid', gridTemplateColumns: '88px 1fr', gap: 28, alignItems: 'start' }}>
        {/* Left margin: crescent + chapter number */}
        <div style={{ paddingTop: 6 }}>
          <V100Crescent accent={accent} size={88}/>
          <div style={{
            marginTop: 14, fontFamily: 'var(--serif)', fontSize: 11, color: mute,
            letterSpacing: '0.32em', fontWeight: 500, textTransform: 'uppercase', writingMode: 'horizontal-tb',
          }}>
            <div style={{ color: accent, fontSize: 22, fontFamily: 'var(--serif)', letterSpacing: 0, lineHeight: 1, marginBottom: 6 }}>{chapterIdx + 1}</div>
            <div>of {total}</div>
          </div>
        </div>

        {/* Right column: title + body */}
        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontFamily: 'var(--serif)', fontWeight: 400,
            fontSize: settings.tweaks.fontSize + 14, color: ink,
            margin: '0 0 18px', lineHeight: 1.22, letterSpacing: '0.005em',
          }}>{stripChapterPrefix(chapterTitle)}</h1>
          <div style={{ position: 'relative', height: 1, marginBottom: 32 }}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${accent} 0%, ${accent}22 60%, transparent 100%)` }}/>
            <div style={{ position: 'absolute', left: -2, top: -3, width: 7, height: 7, borderRadius: 4, background: accent, boxShadow: `0 0 12px ${accent}` }}/>
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${rule}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${rule}`, borderRadius: 4, fontFamily: 'var(--serif)' }}>← 上一章</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: bg, border: `0.5px solid ${accent}`, borderRadius: 4, fontFamily: 'var(--serif)', fontWeight: 600 }}>下一章 →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V100Footer({ book, chapterIdx, settings }) {
  const tone = V100_BG_TONES[settings.themeColors.v100.bgTone] || V100_BG_TONES.moonstone;
  const accent = settings.themeColors.v100.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.surface, color: tone.mute, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.15em',
    }}>
      <span>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
        <div style={{ position: 'absolute', top: -2, left: `calc(${progress * 100}% - 4px)`, width: 5, height: 5, borderRadius: 3, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V100Reader = V100Reader;
window.V100Footer = V100Footer;
