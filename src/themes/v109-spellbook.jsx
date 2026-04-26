// src/themes/v109-spellbook.jsx — Spellbook 咒語書: medieval grimoire with silver star map
const V109_BG_TONES = {
  spellbook:  { from: '#2A1F4E', to: '#14102A', ink: '#E8DCC8' },
  arcane:     { from: '#2C1F40', to: '#15102A', ink: '#E0D4E8' },
  nebula:     { from: '#1F1F4E', to: '#0E0E2A', ink: '#D8D4F0' },
  voidblue:   { from: '#142040', to: '#080F1F', ink: '#D0DCE8' },
  witchhour:  { from: '#28184A', to: '#100A20', ink: '#E0CCE8' },
  incantum:   { from: '#1F285A', to: '#0E1428', ink: '#D8E0F0' },
  ritual:     { from: '#2A1A2A', to: '#140810', ink: '#E0CCD8' },
  gloom:      { from: '#1F1828', to: '#0E0814', ink: '#D0C8D8' },
  silvermoon: { from: '#28283A', to: '#14141F', ink: '#E0E0E8' },
};

function V109Star({ accent, x, y, r }) {
  return <circle cx={x} cy={y} r={r} fill={accent} opacity={0.5}/>;
}

function V109Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V109_BG_TONES[settings.themeColors.v109.bgTone] || V109_BG_TONES.spellbook;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v109.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `radial-gradient(ellipse at 50% 30%, ${from}, ${to} 70%)`,
    }}>
      {/* Silver star map overlay */}
      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <V109Star accent={accent} x={12} y={18} r={0.8}/>
        <V109Star accent={accent} x={84} y={14} r={1.0}/>
        <V109Star accent={accent} x={28} y={62} r={0.6}/>
        <V109Star accent={accent} x={72} y={84} r={0.9}/>
        <V109Star accent={accent} x={56} y={28} r={0.7}/>
        <V109Star accent={accent} x={20} y={88} r={0.8}/>
        <V109Star accent={accent} x={92} y={46} r={0.6}/>
        <V109Star accent={accent} x={48} y={10} r={1.1}/>
      </svg>
      <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.5em', color: accent, fontWeight: 600, marginBottom: 16, textTransform: 'uppercase' }}>
          ✦ Capitulum {chapterIdx + 1} ✦
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.03em',
          textShadow: `0 0 24px ${accent}55`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{
          height: 1, marginBottom: 36,
          background: `linear-gradient(90deg, transparent, ${accent} 50%, transparent)`,
        }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${accent}55`, borderRadius: 0, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em' }}>◀ Prius</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 700, letterSpacing: '0.2em' }}>Sequens ▶</button>
        </div>
      </div>
    </main>
  );
}

function V109Footer({ book, chapterIdx, settings }) {
  const tone = V109_BG_TONES[settings.themeColors.v109.bgTone] || V109_BG_TONES.spellbook;
  const accent = settings.themeColors.v109.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.2em' }}>✦ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V109Reader = V109Reader;
window.V109Footer = V109Footer;
