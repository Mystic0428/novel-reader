// src/themes/v106-twilight.jsx — Twilight 微光: misty purple glow, dark fantasy
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

function V106Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V106_BG_TONES[settings.themeColors.v106.bgTone] || V106_BG_TONES.twilight;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v106.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `radial-gradient(ellipse at 50% 30%, ${from}, ${to} 70%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.32em', color: accent, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
          ✶ Chapter {String(chapterIdx + 1).padStart(2, '0')}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.015em',
          textShadow: `0 0 24px ${accent}40`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 64, height: 1.5, background: accent, marginBottom: 36, opacity: 0.7, boxShadow: `0 0 12px ${accent}` }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 4, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>← 前章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `0.5px solid ${accent}`, borderRadius: 4, fontFamily: 'var(--serif)', fontWeight: 600 }}>後章 →</button>
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
      <span style={{ letterSpacing: '0.15em' }}>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V106Reader = V106Reader;
window.V106Footer = V106Footer;
