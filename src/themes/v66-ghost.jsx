// src/themes/v66-ghost.jsx — haunted notebook: candle glow, handwritten title, foxed paper, ghost figure
const V66_BG_TONES = {
  candlelight: { bg: '#0F0A05', surface: '#1A1208', ink: '#E0CC9C', mute: '#9C7A48', rule: '#3A2818', glow: '#FFB454' },
  moonlight:   { bg: '#0A0F1F', surface: '#141828', ink: '#D8DCE8', mute: '#7080A0', rule: '#1F2840', glow: '#A0B0D8' },
  dusk:        { bg: '#1A0F1A', surface: '#241828', ink: '#E0D0E0', mute: '#9070A0', rule: '#3A2438', glow: '#C088D0' },
  abyss:       { bg: '#040408', surface: '#0F0F18', ink: '#D0D0D8', mute: '#707080', rule: '#1F1F2A', glow: '#5070A0' },
  foxed:       { bg: '#E8DCB8', surface: '#D8CCA8', ink: '#1A140A', mute: '#5A4A28', rule: '#A89060', glow: '#A85820' },
  emberglow:   { bg: '#1A0F08', surface: '#241408', ink: '#E8C8A0', mute: '#A07050', rule: '#3A2010', glow: '#FF8838' },
  mist:        { bg: '#1A1F22', surface: '#262E32', ink: '#DCE0DC', mute: '#90A098', rule: '#384248', glow: '#B0C0B8' },
  crypt:       { bg: '#0F0F12', surface: '#1A1A22', ink: '#D0D0D8', mute: '#80808C', rule: '#28282E', glow: '#7888A0' },
  hearth:      { bg: '#1A0A0A', surface: '#241010', ink: '#E8C8A8', mute: '#9C6850', rule: '#3A1A1A', glow: '#FF6838' },
};

function V66Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V66_BG_TONES[settings.themeColors.v66.bgTone] || V66_BG_TONES.candlelight;
  const accent = settings.themeColors.v66.accent;
  const { bg, surface, ink, mute, rule, glow } = tone;
  const isLight = bg === '#E8DCB8';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Caveat","Marker Felt",cursive',
    }}>
      {/* candle glow at top */}
      <div style={{
        position: 'fixed', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 400, pointerEvents: 'none',
        background: `radial-gradient(ellipse, ${glow}26, transparent 70%)`,
      }}/>

      {/* foxed paper spots */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'multiply',
        backgroundImage: `radial-gradient(circle at 18% 22%, rgba(120,60,20,0.5) 0, transparent 30px),
                          radial-gradient(circle at 82% 38%, rgba(120,60,20,0.4) 0, transparent 25px),
                          radial-gradient(circle at 30% 70%, rgba(120,60,20,0.5) 0, transparent 35px),
                          radial-gradient(circle at 70% 85%, rgba(120,60,20,0.3) 0, transparent 30px)`,
      }}/>

      {/* faint shadow figure ghost */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: isLight ? 0.06 : 0.04,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600' viewBox='0 0 400 600'><g fill='${encodeURIComponent(ink)}'><ellipse cx='200' cy='180' rx='40' ry='50'/><path d='M160 220 Q140 320 130 480 Q200 520 270 480 Q260 320 240 220 Q200 250 160 220 Z'/></g></svg>")`,
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: '320px',
      }}/>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '60px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* candle + entry mark */}
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <span style={{
            display: 'inline-block', width: 6, height: 12, background: glow,
            borderRadius: '50% 50% 30% 30%', boxShadow: `0 0 16px ${glow}`,
            verticalAlign: 'middle',
          }}/>
        </div>
        <div style={{
          fontFamily: '"Caveat",cursive', fontSize: 18, color: glow,
          textAlign: 'center', marginBottom: 4, letterSpacing: '0.05em',
        }}>
          ~ entry the {ordinalEn(chapterIdx + 1)} ~
        </div>

        {/* handwritten title */}
        <h1 style={{
          fontFamily: '"Caveat","Marker Felt",cursive',
          fontSize: settings.tweaks.fontSize + 22, fontWeight: 600,
          textAlign: 'center', margin: '4px 0 20px', letterSpacing: '0.02em', color: ink,
          textShadow: isLight ? 'none' : `0 0 12px ${glow}40`,
          lineHeight: 1.1,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, color: mute }}>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
          <span style={{ fontFamily: '"Caveat",cursive', fontSize: 14, fontStyle: 'italic' }}>...something walks behind...</span>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
        </div>

        {/* body — keep readable serif (not handwritten — too hard to read whole chapter) */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': glow,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end — flickering candle */}
        <div style={{
          textAlign: 'center', marginTop: 40, fontFamily: '"Caveat",cursive', fontSize: 22,
          color: glow, letterSpacing: '0.4em',
          textShadow: `0 0 14px ${glow}70`,
        }}>
          ✦ ~ ✦
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `0.5px dashed ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '6px 14px', borderRadius: 6,
            background: 'transparent', color: mute, border: `0.5px solid ${rule}`,
            fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic',
          }}>‹ earlier entry</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '6px 14px', borderRadius: 6,
            background: 'transparent', color: glow, border: `0.5px solid ${glow}`,
            fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic',
            textShadow: `0 0 8px ${glow}60`,
          }}>next entry ›</button>
        </div>
      </article>
    </main>
  );
}

function V66Footer({ book, chapterIdx, settings }) {
  const tone = V66_BG_TONES[settings.themeColors.v66.bgTone] || V66_BG_TONES.candlelight;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 14, fontStyle: 'italic', color: tone.mute,
    }}>
      <span style={{ color: tone.glow }}>~ entry {chapterIdx + 1} of {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.glow, boxShadow: `0 0 6px ${tone.glow}80` }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V66Reader = V66Reader;
window.V66Footer = V66Footer;
