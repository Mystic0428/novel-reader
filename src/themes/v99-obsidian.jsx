// src/themes/v99-obsidian.jsx — Obsidian 黑曜: dark serif with gold accent
const V99_BG_TONES = {
  obsidian: { bg: '#0A0B0E', surface: '#14161B', ink: '#D8D0B8', mute: '#7A7868', rule: '#2A2A30' },
  basalt:   { bg: '#0E0F12', surface: '#1A1B1F', ink: '#D4CCB4', mute: '#7A7464', rule: '#2A2B2F' },
  jet:      { bg: '#08080A', surface: '#121214', ink: '#D0CCBC', mute: '#706C5C', rule: '#28282A' },
  ink:      { bg: '#0A0E14', surface: '#141A24', ink: '#D8D4C0', mute: '#787868', rule: '#2A3040' },
  charcoal: { bg: '#1A1A1A', surface: '#262626', ink: '#E0DCC4', mute: '#807868', rule: '#383838' },
  ebony:    { bg: '#100A08', surface: '#1C1410', ink: '#D8C8B0', mute: '#806C58', rule: '#2C2018' },
  midnight: { bg: '#0A0A14', surface: '#141420', ink: '#D8D0BC', mute: '#787868', rule: '#1F1F2A' },
  soot:     { bg: '#0E0E0E', surface: '#1A1A1A', ink: '#D0CCB8', mute: '#706C5C', rule: '#2A2A2A' },
  void:     { bg: '#000000', surface: '#0A0A0A', ink: '#C8C0A8', mute: '#686050', rule: '#1A1A1A' },
};

function V99Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V99_BG_TONES[settings.themeColors.v99.bgTone] || V99_BG_TONES.obsidian;
  const { bg, surface, ink, mute, rule } = tone;
  const accent = settings.themeColors.v99.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `linear-gradient(180deg, ${surface} 0%, ${bg} 100%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.32em', color: accent, fontWeight: 700, marginBottom: 14, textTransform: 'uppercase' }}>
          ✦ Chapter {String(chapterIdx + 1).padStart(2, '0')} · {String(total).padStart(2, '0')} ✦
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600, fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.2, letterSpacing: '0.02em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, color: accent }}>
          <span style={{ fontSize: 12 }}>◆</span>
          <span style={{ flex: 1, height: 1, background: accent, opacity: 0.4 }}/>
          <span style={{ fontSize: 12 }}>◆</span>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${rule}`, borderRadius: 0, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>◀ 前 章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: bg, border: `0.5px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.18em' }}>下 章 ▶</button>
        </div>
      </div>
    </main>
  );
}

function V99Footer({ book, chapterIdx, settings }) {
  const tone = V99_BG_TONES[settings.themeColors.v99.bgTone] || V99_BG_TONES.obsidian;
  const accent = settings.themeColors.v99.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.surface, color: tone.mute, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span>{String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V99Reader = V99Reader;
window.V99Footer = V99Footer;
