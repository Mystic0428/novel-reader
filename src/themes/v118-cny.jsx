// src/themes/v118-cny.jsx — 農曆新年: red couplet + gilded gold
const V118_BG_TONES = {
  cny:         { bg: '#C8242C', ink: '#FFE8B8', accentAlt: '#3A1408' },
  lantern:     { bg: '#A82018', ink: '#FFE8B8', accentAlt: '#3A1408' },
  firecracker: { bg: '#D03028', ink: '#FFF0C0', accentAlt: '#3A1408' },
  gilded:      { bg: '#9C2418', ink: '#F8DC8C', accentAlt: '#3A1408' },
  plum:        { bg: '#A02830', ink: '#F0D8C8', accentAlt: '#3A1408' },
  tangerine:   { bg: '#D04020', ink: '#FFE8B8', accentAlt: '#3A1408' },
  jade:        { bg: '#1F5238', ink: '#F0E0B8', accentAlt: '#FFE8B8' },
  springbloom: { bg: '#B82420', ink: '#F8E8C0', accentAlt: '#3A1408' },
  ink:         { bg: '#1A1208', ink: '#FFE8B8', accentAlt: '#C8242C' },
};

function V118Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V118_BG_TONES[settings.themeColors.v118.bgTone] || V118_BG_TONES.cny;
  const { bg, ink, accentAlt } = tone;
  const accent = settings.themeColors.v118.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* 春條 — gilded vertical couplet decoration */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
          marginBottom: 22,
        }}>
          <span style={{
            display: 'inline-block', width: 6, height: 36,
            background: `linear-gradient(180deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 0 8px ${accent}66`,
          }}/>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 12, fontWeight: 700,
            color: accent, letterSpacing: '0.5em', textShadow: `0 0 8px ${accent}55`,
          }}>
            福 · 第 {chapterIdx + 1} 章 · {total}
          </div>
          <span style={{
            display: 'inline-block', width: 6, height: 36,
            background: `linear-gradient(180deg, ${accent}, ${accent}cc)`,
            boxShadow: `0 0 8px ${accent}66`,
          }}/>
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.06em', textAlign: 'center',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36, justifyContent: 'center' }}>
          <span style={{ width: 60, height: 2, background: accent }}/>
          <span style={{ color: accent, fontSize: 14 }}>❖</span>
          <span style={{ width: 60, height: 2, background: accent }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, letterSpacing: '0.03em',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `1px solid ${accent}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${accent}88`, borderRadius: 2, fontFamily: 'var(--serif)' }}>← 前章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: accentAlt, border: `1px solid ${accent}`, borderRadius: 2, fontFamily: 'var(--serif)', fontWeight: 700 }}>下章 →</button>
        </div>
      </div>
    </main>
  );
}

function V118Footer({ book, chapterIdx, settings }) {
  const tone = V118_BG_TONES[settings.themeColors.v118.bgTone] || V118_BG_TONES.cny;
  const accent = settings.themeColors.v118.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${accent}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.2em', color: accent }}>福 · {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V118Reader = V118Reader;
window.V118Footer = V118Footer;
