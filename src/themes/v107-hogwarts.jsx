// src/themes/v107-hogwarts.jsx — Hogwarts 霍格華茲: ancient academy with brass candlelight
const V107_BG_TONES = {
  hogwarts:   { from: '#1F3A2A', to: '#0E1F18', ink: '#E8D7B5' },
  gryffindor: { from: '#3A1818', to: '#1F0808', ink: '#F0DCB8' },
  slytherin:  { from: '#0F2820', to: '#06140E', ink: '#D4E0C8' },
  ravenclaw:  { from: '#0F1F38', to: '#06101F', ink: '#D8DCE8' },
  hufflepuff: { from: '#3A2818', to: '#1F1408', ink: '#F0DCB0' },
  forbidden:  { from: '#0F1A14', to: '#040A08', ink: '#C8D4B8' },
  midnight:   { from: '#14141F', to: '#080812', ink: '#D8D0C0' },
  candle:     { from: '#28201A', to: '#14100E', ink: '#F0DCB0' },
  parchment:  { from: '#3A3024', to: '#1F1A14', ink: '#F0E0C0' },
};

function V107Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V107_BG_TONES[settings.themeColors.v107.bgTone] || V107_BG_TONES.hogwarts;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v107.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `radial-gradient(ellipse at 30% 20%, ${from}, ${to} 70%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: accent, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
          ✧ 第 {chapterIdx + 1} 章 · 共 {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.02em',
          textShadow: `0 0 18px ${accent}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, color: accent }}>
          <span style={{ fontSize: 12 }}>✦</span>
          <span style={{ flex: 1, height: 1, background: accent, opacity: 0.5 }}/>
          <span style={{ fontSize: 12 }}>✦</span>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}44`, borderRadius: 4, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>◀ 前章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 4, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.18em' }}>下章 ▶</button>
        </div>
      </div>
    </main>
  );
}

function V107Footer({ book, chapterIdx, settings }) {
  const tone = V107_BG_TONES[settings.themeColors.v107.bgTone] || V107_BG_TONES.hogwarts;
  const accent = settings.themeColors.v107.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.15em',
    }}>
      <span>第 {chapterIdx + 1} / {total} 章</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 6px ${accent}` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V107Reader = V107Reader;
window.V107Footer = V107Footer;
