// src/themes/v68-rpg-textbox.jsx — JRPG dialogue: thick blue border textbox, name tag, HP/MP bars
const V68_BG_TONES = {
  finalfantasy: { bg: '#0A1638', surface: '#102050', ink: '#FFFFFF', mute: '#A0B0D0', rule: '#3858A8', accent2: '#FFD24A' },
  darkrealm:    { bg: '#1A0A2A', surface: '#240F3A', ink: '#FFFFFF', mute: '#A090B8', rule: '#5A2A7A', accent2: '#C040FF' },
  dq:           { bg: '#0A1A1F', surface: '#102830', ink: '#F8F8E0', mute: '#90B0B0', rule: '#306060', accent2: '#FFC848' },
  pokemon:      { bg: '#F0F0F0', surface: '#FFFFFF', ink: '#1A1A1A', mute: '#7C7C7C', rule: '#404040', accent2: '#E63946' },
  mother:       { bg: '#FF8048', surface: '#FFA068', ink: '#0A0A0A', mute: '#6B3818', rule: '#1A0A08', accent2: '#0A4ABC' },
  chrono:       { bg: '#0A2010', surface: '#143020', ink: '#F8F8E0', mute: '#90B098', rule: '#306040', accent2: '#FFC848' },
  snow:         { bg: '#F8F8FA', surface: '#E0E0E8', ink: '#0A1638', mute: '#5878A8', rule: '#3858A8', accent2: '#E63946' },
  sepia:        { bg: '#1F1408', surface: '#2A1F10', ink: '#F8E8C8', mute: '#B89058', rule: '#4A2A18', accent2: '#FFC848' },
  midnight:     { bg: '#08081A', surface: '#101028', ink: '#F0F0F8', mute: '#9090B0', rule: '#2A2A4A', accent2: '#5878FF' },
};

function V68Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V68_BG_TONES[settings.themeColors.v68.bgTone] || V68_BG_TONES.finalfantasy;
  const accent = settings.themeColors.v68.accent;
  const { bg, surface, ink, mute, rule, accent2 } = tone;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Press Start 2P","Courier New",monospace',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '30px 40px 50px' }}>
        {/* status bar — HP / MP / EXP */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
          marginBottom: 20, fontFamily: '"Courier New",monospace', fontSize: 11,
        }}>
          <V68StatBar label="HP" current={chapterIdx + 1} max={total} color={accent} ink={ink} mute={mute} rule={rule}/>
          <V68StatBar label="MP" current={Math.min(chapterIdx + 1, 99)} max={99} color={accent2} ink={ink} mute={mute} rule={rule}/>
          <V68StatBar label="EXP" current={Math.round(progress * 100)} max={100} color={accent} ink={ink} mute={mute} rule={rule}/>
        </div>

        {/* speaker name tag */}
        <div style={{
          display: 'inline-block', padding: '6px 14px',
          background: surface, border: `2px solid ${accent}`,
          borderBottom: 'none', borderRadius: '4px 4px 0 0',
          fontFamily: '"Courier New",monospace', fontSize: 12, fontWeight: 700,
          color: accent, letterSpacing: '0.15em', position: 'relative', top: 2, zIndex: 2,
        }}>
          ▶ CHAPTER {String(chapterIdx + 1).padStart(2, '0')}
        </div>

        {/* main textbox */}
        <div style={{
          background: surface, border: `2px solid ${accent}`,
          padding: '20px 22px',
          boxShadow: `inset 0 0 0 2px ${bg}, inset 0 0 0 4px ${accent}`,
          position: 'relative',
        }}>
          {/* title */}
          <h1 style={{
            fontFamily: '"Courier New",monospace', fontSize: settings.tweaks.fontSize + 6, fontWeight: 700,
            margin: '0 0 10px', color: accent, textTransform: 'uppercase', letterSpacing: '0.06em',
            textShadow: `2px 2px 0 ${bg}`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            height: 0.5, background: accent, opacity: 0.5, margin: '0 0 16px',
          }}/>

          {/* body — readable serif/sans, NOT pixel font (would be unreadable) */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--sans)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* blinking continue triangle */}
          <div style={{
            textAlign: 'right', marginTop: 14, color: accent, fontSize: 16,
            animation: 'v68blink 1s steps(1) infinite',
          }}>▼</div>
        </div>
        <style>{`@keyframes v68blink { 0%,50%{opacity:1;} 51%,100%{opacity:0;} }`}</style>

        {/* nav buttons styled as RPG menu items */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12,
        }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: surface, color: ink, border: `2px solid ${ink}`,
            boxShadow: `inset 0 0 0 1px ${bg}, inset 0 0 0 2px ${ink}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>◀ PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: bg, border: `2px solid ${accent}`,
            boxShadow: `inset 0 0 0 1px ${bg}, inset 0 0 0 2px ${accent}`,
            fontFamily: '"Courier New",monospace', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>NEXT ▶</button>
        </div>
      </article>
    </main>
  );
}

function V68StatBar({ label, current, max, color, ink, mute, rule }) {
  const pct = max ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
        <span style={{ color: color, fontWeight: 700 }}>{label}</span>
        <span style={{ color: mute, fontVariantNumeric: 'tabular-nums' }}>{current}/{max}</span>
      </div>
      <div style={{ height: 8, background: rule, border: `1px solid ${ink}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: color }}/>
      </div>
    </div>
  );
}

function V68Footer({ book, chapterIdx, settings }) {
  const tone = V68_BG_TONES[settings.themeColors.v68.bgTone] || V68_BG_TONES.finalfantasy;
  const accent = settings.themeColors.v68.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  // Pixel hearts: filled vs empty based on progress
  const totalHearts = 10;
  const filled = Math.round(progress * totalHearts);
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `2px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Courier New",monospace', fontSize: 11, color: tone.ink, letterSpacing: '0.18em', fontWeight: 700,
    }}>
      <span style={{ color: accent }}>LV.{Math.min(chapterIdx + 1, 99)}</span>
      <span style={{ color: tone.ink, fontSize: 13, letterSpacing: '0.1em' }}>
        {Array.from({ length: totalHearts }).map((_, i) => (
          <span key={i} style={{ color: i < filled ? accent : tone.rule }}>♥</span>
        ))}
      </span>
      <div style={{ flex: 1 }}/>
      <span style={{ color: tone.mute }}>{chapterIdx + 1}/{total}</span>
    </div>
  );
}

window.V68Reader = V68Reader;
window.V68Footer = V68Footer;
