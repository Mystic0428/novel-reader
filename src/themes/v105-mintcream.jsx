// src/themes/v105-mintcream.jsx — Mint Cream 薄荷奶霜: healing pastel green
const V105_BG_TONES = {
  mint:       { bg: '#EEF6F0', ink: '#2C4438' },
  sage:       { bg: '#EEF1EA', ink: '#384438' },
  eucalyptus: { bg: '#E8F0EC', ink: '#2C4438' },
  sky:        { bg: '#EAF1F4', ink: '#2C4050' },
  cream:      { bg: '#F4F1E8', ink: '#3F4438' },
  pearl:      { bg: '#EFF1F2', ink: '#384048' },
  lemon:      { bg: '#F4F1E0', ink: '#3F4428' },
  basil:      { bg: '#E0E8DA', ink: '#283828' },
  fog:        { bg: '#EAEEEC', ink: '#384038' },
};

function V105Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V105_BG_TONES[settings.themeColors.v105.bgTone] || V105_BG_TONES.mint;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v105.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', color: accent, fontWeight: 600, marginBottom: 12, textTransform: 'uppercase' }}>
          ❋ Chapter {String(chapterIdx + 1).padStart(2, '0')}
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 12, color: ink,
          margin: '0 0 14px', lineHeight: 1.28,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 48, height: 3, background: accent, borderRadius: 2, marginBottom: 32 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}22` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 999, padding: '6px 14px', fontFamily: 'var(--sans)' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FFF', border: `0.5px solid ${accent}`, borderRadius: 999, padding: '6px 14px', fontFamily: 'var(--sans)', fontWeight: 600 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V105Footer({ book, chapterIdx, settings }) {
  const tone = V105_BG_TONES[settings.themeColors.v105.bgTone] || V105_BG_TONES.mint;
  const accent = settings.themeColors.v105.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--sans)', fontSize: 11,
    }}>
      <span>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 4, background: `${tone.ink}1A`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, borderRadius: 2 }}/>
      </div>
      <span style={{ color: accent, fontWeight: 600 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V105Reader = V105Reader;
window.V105Footer = V105Footer;
