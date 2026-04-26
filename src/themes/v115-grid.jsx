// src/themes/v115-grid.jsx — Grid 方格紙: engineering grid background with Swiss type
const V115_BG_TONES = {
  grid:      { bg: '#FAFAF7', line: 'rgba(74,107,142,0.14)', size: 22, ink: '#1A1F28' },
  graph:     { bg: '#FBFAEF', line: 'rgba(120,90,20,0.14)',  size: 22, ink: '#1A1408' },
  isometric: { bg: '#F8F6F2', line: 'rgba(60,80,120,0.12)',  size: 28, ink: '#1A1F28' },
  dotted:    { bg: '#FAFAF7', line: 'rgba(74,107,142,0.22)', size: 22, ink: '#1A1F28', dot: true },
  engineer:  { bg: '#F4F4ED', line: 'rgba(40,60,90,0.16)',   size: 18, ink: '#0F1828' },
  blueprint: { bg: '#EAF2F8', line: 'rgba(40,80,140,0.18)',  size: 22, ink: '#0F2848' },
  gridcream: { bg: '#FBF6E4', line: 'rgba(120,90,20,0.16)',  size: 22, ink: '#1A1408' },
  fineline:  { bg: '#FAFAF7', line: 'rgba(74,107,142,0.08)', size: 14, ink: '#1A1F28' },
  plain:     { bg: '#FAFAF7', line: 'transparent',           size: 22, ink: '#1A1F28' },
};

function V115Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V115_BG_TONES[settings.themeColors.v115.bgTone] || V115_BG_TONES.grid;
  const { bg, line, size, ink, dot } = tone;
  const accent = settings.themeColors.v115.accent;
  const total = book.chaptersMeta.length;
  const gridBg = dot
    ? `radial-gradient(${line} 1px, transparent 1px) 0 0/${size}px ${size}px, ${bg}`
    : `linear-gradient(0deg, transparent ${size - 1}px, ${line} ${size - 1}px) 0 0/100% ${size}px,
       linear-gradient(90deg, transparent ${size - 1}px, ${line} ${size - 1}px) 0 0/${size}px 100%,
       ${bg}`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: gridBg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700, color: accent,
          letterSpacing: '0.3em', marginBottom: 12, textTransform: 'uppercase',
        }}>
          {String(chapterIdx + 1).padStart(2, '0')} · METHOD
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 12px', lineHeight: 1.18, letterSpacing: '-0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 64, height: 4, background: accent, marginBottom: 32 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `2px solid ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}`, borderRadius: 0, fontFamily: 'var(--sans)', fontWeight: 700, letterSpacing: '0.18em' }}>← PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `1px solid ${ink}`, borderRadius: 0, fontFamily: 'var(--sans)', fontWeight: 700, letterSpacing: '0.18em' }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V115Footer({ book, chapterIdx, settings }) {
  const tone = V115_BG_TONES[settings.themeColors.v115.bgTone] || V115_BG_TONES.grid;
  const accent = settings.themeColors.v115.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span>{String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V115Reader = V115Reader;
window.V115Footer = V115Footer;
