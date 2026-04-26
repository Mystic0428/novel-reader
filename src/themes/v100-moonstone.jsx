// src/themes/v100-moonstone.jsx — Moonstone 月長石: deep blue night with luminous accent
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

function V100Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V100_BG_TONES[settings.themeColors.v100.bgTone] || V100_BG_TONES.moonstone;
  const { bg, surface, ink, mute, rule } = tone;
  const accent = settings.themeColors.v100.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `linear-gradient(180deg, ${surface} 0%, ${bg} 100%)`,
    }}>
      <div style={{ maxWidth: 660, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: accent, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
          ☾ Chapter {String(chapterIdx + 1).padStart(2, '0')}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.01em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 64, height: 2, background: accent, marginBottom: 36, opacity: 0.7 }}/>
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
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V100Reader = V100Reader;
window.V100Footer = V100Footer;
