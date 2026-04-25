// src/themes/v75-campfire.jsx — outdoor campfire log: warm radial glow, ember sparks, expedition entry
const V75_BG_TONES = {
  ember:    { bg: '#0F0805', surface: '#1A0F08', ink: '#F0D8B0', mute: '#A88458', rule: '#3A2418', glow: '#FF6838' },
  birch:    { bg: '#E8DCC0', surface: '#D8CCB0', ink: '#2A1A10', mute: '#6B4828', rule: '#A88858', glow: '#FF6838' },
  midnight: { bg: '#08081A', surface: '#101028', ink: '#E0DCD8', mute: '#9090A0', rule: '#22223A', glow: '#7080A8' },
  dawn:     { bg: '#28181F', surface: '#3A2030', ink: '#F0D0D8', mute: '#B08090', rule: '#4A2838', glow: '#FF8898' },
  pine:     { bg: '#0F1F1A', surface: '#1A2D24', ink: '#D8E8D8', mute: '#88A898', rule: '#1F3A2A', glow: '#88C078' },
  ash:      { bg: '#181818', surface: '#262626', ink: '#D8D4C8', mute: '#888478', rule: '#383838', glow: '#FFA878' },
  maple:    { bg: '#2A1008', surface: '#3A1A10', ink: '#F8C898', mute: '#B87850', rule: '#4A1F18', glow: '#FF7838' },
  alpine:   { bg: '#0A0F1F', surface: '#141A28', ink: '#E0E4F0', mute: '#90A0B8', rule: '#1F2840', glow: '#A0C0E8' },
  forge:    { bg: '#1A0A0A', surface: '#241010', ink: '#F0C098', mute: '#A07050', rule: '#3A1A1A', glow: '#FF4818' },
};

function V75Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V75_BG_TONES[settings.themeColors.v75.bgTone] || V75_BG_TONES.ember;
  const accent = settings.themeColors.v75.accent;
  const { bg, surface, ink, mute, rule, glow } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      {/* fire glow at bottom */}
      <div style={{
        position: 'fixed', bottom: -100, left: '50%', transform: 'translateX(-50%)',
        width: 700, height: 400, pointerEvents: 'none',
        background: `radial-gradient(ellipse at center bottom, ${glow}40, transparent 70%)`,
      }}/>

      {/* ember sparks scattered */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.7,
        backgroundImage: `radial-gradient(circle at 12% 32%, ${glow}cc 0, transparent 1.5px),
                          radial-gradient(circle at 28% 70%, ${glow}88 0, transparent 1.5px),
                          radial-gradient(circle at 78% 20%, ${glow}aa 0, transparent 2px),
                          radial-gradient(circle at 60% 50%, ${glow}66 0, transparent 1.5px),
                          radial-gradient(circle at 88% 88%, ${glow}99 0, transparent 1.5px),
                          radial-gradient(circle at 18% 82%, ${glow}77 0, transparent 1.5px)`,
      }}/>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '50px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* expedition entry header */}
        <div style={{ textAlign: 'center', marginBottom: 18 }}>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: 11, color: glow, letterSpacing: '0.4em', fontWeight: 700,
            textTransform: 'uppercase',
          }}>
            ▲ Field Camp · Day {chapterIdx + 1} ▲
          </span>
        </div>

        {/* title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 600,
          textAlign: 'center', margin: '0 0 8px', letterSpacing: '0.03em', color: ink,
          textShadow: `0 0 18px ${glow}40`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
          marginBottom: 28, letterSpacing: '0.15em',
        }}>
          ⵙ noted by {book.author || 'the wandering scribe'} ⵙ
        </div>

        {/* twig divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ flex: 1, height: 1, background: rule }}/>
          <span style={{ color: glow, fontSize: 18 }}>🔥</span>
          <div style={{ flex: 1, height: 1, background: rule }}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': glow,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end mark — dying fire */}
        <div style={{
          textAlign: 'center', marginTop: 36, fontSize: 14, color: glow, letterSpacing: '0.6em',
          textShadow: `0 0 8px ${glow}60`,
        }}>
          ▲ · ▲ · ▲
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 18, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: mute, border: `0.5px solid ${rule}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em', fontSize: 12,
          }}>← prior camp</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: glow, border: `0.5px solid ${glow}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em', fontSize: 12, fontWeight: 600,
            textShadow: `0 0 8px ${glow}60`,
          }}>onward →</button>
        </div>
      </article>
    </main>
  );
}

function V75Footer({ book, chapterIdx, settings }) {
  const tone = V75_BG_TONES[settings.themeColors.v75.bgTone] || V75_BG_TONES.ember;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.2em',
    }}>
      <span style={{ color: tone.glow, textShadow: `0 0 6px ${tone.glow}80` }}>▲ day {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.glow, boxShadow: `0 0 4px ${tone.glow}80` }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V75Reader = V75Reader;
window.V75Footer = V75Footer;
