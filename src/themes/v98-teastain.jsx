// src/themes/v98-teastain.jsx — Tea Stained 茶漬本: aged book with uneven warm gradients
const V98_BG_TONES = {
  teastain:   { from: '#F0E0BC', to: '#D4B888', ink: '#3E2418' },
  oolong:     { from: '#ECD8A8', to: '#C8A878', ink: '#3E2418' },
  darjeeling: { from: '#F4DCB0', to: '#D8B888', ink: '#3E2418' },
  matcha:     { from: '#E0D8B0', to: '#B0B888', ink: '#2E2818' },
  'pu-erh':   { from: '#D8B888', to: '#8C6038', ink: '#2A180C' },
  chamomile:  { from: '#F4E8C8', to: '#DCC898', ink: '#3E2818' },
  oxidation:  { from: '#E8C898', to: '#B88848', ink: '#2A180C' },
  foxing:     { from: '#E8D8B0', to: '#D0B888', ink: '#3E2418' },
  inkbleed:   { from: '#E8D8B0', to: '#C8A888', ink: '#2A180C' },
};

function V98Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V98_BG_TONES[settings.themeColors.v98.bgTone] || V98_BG_TONES.teastain;
  const { from, to, ink } = tone;
  const accent = settings.themeColors.v98.accent;
  const total = book.chaptersMeta.length;
  const stainOverlay = `radial-gradient(ellipse at 78% 88%, ${ink}10 0%, transparent 22%), radial-gradient(circle at 18% 22%, ${ink}0c 0%, transparent 14%)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `${stainOverlay}, radial-gradient(ellipse at 30% 40%, ${from} 0%, ${to} 80%)`,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.3em', color: ink, opacity: 0.55, fontFamily: 'var(--serif)', fontStyle: 'italic', marginBottom: 12 }}>
          chapter {String(chapterIdx + 1).padStart(2, '0')} · {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 56, height: 1.5, background: accent, marginBottom: 36, opacity: 0.85 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: 1.95,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 22, borderTop: `0.5px solid ${ink}26` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.1em' }}>← 前章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.1em' }}>後章 →</button>
        </div>
      </div>
    </main>
  );
}

function V98Footer({ book, chapterIdx, settings }) {
  const tone = V98_BG_TONES[settings.themeColors.v98.bgTone] || V98_BG_TONES.teastain;
  const accent = settings.themeColors.v98.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11,
    }}>
      <span style={{ opacity: 0.7, letterSpacing: '0.1em' }}>第 {chapterIdx + 1} / {total} 章</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}1F`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V98Reader = V98Reader;
window.V98Footer = V98Footer;
