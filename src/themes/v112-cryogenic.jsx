// src/themes/v112-cryogenic.jsx — Cryogenic 冷凍艙: spaceship HUD interface
const V112_BG_TONES = {
  cryo:       { from: '#0A1828', to: '#050E18', ink: '#C8E8FF' },
  voidship:   { from: '#0A1422', to: '#050A11', ink: '#C0DCE8' },
  station:    { from: '#0F1A28', to: '#080F18', ink: '#D0E4F0' },
  glacier:    { from: '#1F2A38', to: '#0E141F', ink: '#DCE8F0' },
  arctic:     { from: '#0A1F2A', to: '#040F14', ink: '#C0D8E0' },
  orbital:    { from: '#1A1F2A', to: '#0A0E14', ink: '#C8D0DC' },
  aurora:     { from: '#0A2028', to: '#040F14', ink: '#A8E0E0' },
  deepfreeze: { from: '#04101A', to: '#020608', ink: '#A8C8DC' },
  nullspace:  { from: '#020408', to: '#000204', ink: '#A8B8C8' },
};

function V112Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V112_BG_TONES[settings.themeColors.v112.bgTone] || V112_BG_TONES.cryo;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v112.accent;
  const total = book.chaptersMeta.length;
  // Day counter for HUD log feel
  const dayLog = String(90234 + chapterIdx).padStart(6, '0');
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        {/* HUD frame */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
          fontFamily: 'var(--mono)', fontSize: 10, color: accent, fontWeight: 600, letterSpacing: '0.25em',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
          <span>STATUS · ACTIVE</span>
          <span style={{ flex: 1, height: 1, background: `${accent}44` }}/>
          <span>LOG · DAY {dayLog}</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--mono)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 12, color: ink,
          margin: '0 0 14px', lineHeight: 1.3, letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        {/* HUD bracket-corner divider */}
        <div style={{ position: 'relative', height: 10, marginBottom: 32 }}>
          <span style={{ position: 'absolute', left: 0, top: 0, width: 12, height: 10, borderLeft: `1px solid ${accent}`, borderTop: `1px solid ${accent}` }}/>
          <span style={{ position: 'absolute', right: 0, top: 0, width: 12, height: 10, borderRight: `1px solid ${accent}`, borderTop: `1px solid ${accent}` }}/>
          <span style={{ position: 'absolute', left: 14, right: 14, top: 0, height: 1, background: `${accent}55` }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--mono)', color: ink,
          fontSize: settings.tweaks.fontSize - 1, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `1px solid ${accent}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${accent}55`, borderRadius: 0, fontFamily: 'var(--mono)', letterSpacing: '0.2em' }}>◀ PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--mono)', fontWeight: 700, letterSpacing: '0.2em', boxShadow: `0 0 12px ${accent}66` }}>NEXT ▶</button>
        </div>
      </div>
    </main>
  );
}

function V112Footer({ book, chapterIdx, settings }) {
  const tone = V112_BG_TONES[settings.themeColors.v112.bgTone] || V112_BG_TONES.cryo;
  const accent = settings.themeColors.v112.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accent}33`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent }}>SECT.{String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V112Reader = V112Reader;
window.V112Footer = V112Footer;
