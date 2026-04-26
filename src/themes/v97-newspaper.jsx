// src/themes/v97-newspaper.jsx — Newspaper 晨報: clean editorial newsprint typography
const V97_BG_TONES = {
  morningprint: { bg: '#F0E8D0', ink: '#1A1408' },
  rotogravure:  { bg: '#E8DDB8', ink: '#1A1408' },
  broadsheet:   { bg: '#F4ECCA', ink: '#1A1408' },
  tabloid:      { bg: '#ECE0B8', ink: '#1A1408' },
  gazette:      { bg: '#F0E5C8', ink: '#1A1408' },
  editorial:    { bg: '#ECE5CC', ink: '#1A1408' },
  foxed:        { bg: '#E8D8AC', ink: '#1A1408' },
  classifieds:  { bg: '#F4E8C0', ink: '#1A1408' },
  masthead:     { bg: '#E8DCB0', ink: '#1A1408' },
};

function V97Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V97_BG_TONES[settings.themeColors.v97.bgTone] || V97_BG_TONES.morningprint;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v97.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '60px 24px',
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 700, color: accent,
          letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 10,
        }}>
          VOL.{String(chapterIdx + 1).padStart(2, '0')} · {String(total).padStart(2, '0')} TOTAL
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 12px', lineHeight: 1.18, letterSpacing: '-0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: '60%', height: 3, background: accent, marginBottom: 36 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: 1.85,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 18, borderTop: `1px solid ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 600, letterSpacing: '0.18em' }}>← PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `1px solid ${ink}`, borderRadius: 0, fontFamily: 'var(--serif)', fontWeight: 600, letterSpacing: '0.18em' }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V97Footer({ book, chapterIdx, settings }) {
  const tone = V97_BG_TONES[settings.themeColors.v97.bgTone] || V97_BG_TONES.morningprint;
  const accent = settings.themeColors.v97.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--mono)', fontSize: 11,
      letterSpacing: '0.12em',
    }}>
      <span>{String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V97Reader = V97Reader;
window.V97Footer = V97Footer;
