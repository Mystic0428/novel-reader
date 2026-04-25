// src/themes/v42-classics.jsx — Classics paperback (Penguin-style three-band cover)
const V42_BG_TONES = {
  orange:    { bg: '#F5F0E0', band: '#FF6800', ink: '#1F1F1F' }, // Fiction
  green:     { bg: '#F5F0E0', band: '#006B43', ink: '#1F1F1F' }, // Crime
  darkblue:  { bg: '#F5F0E0', band: '#003F7E', ink: '#1F1F1F' }, // Bio
  pink:      { bg: '#F5F0E0', band: '#E84A8C', ink: '#1F1F1F' }, // Modern
  yellow:    { bg: '#F5F0E0', band: '#F5C618', ink: '#1F1F1F' }, // Reference
  charcoal:  { bg: '#F5F0E0', band: '#2A2A2A', ink: '#1F1F1F' }, // Reference dark
  maroon:    { bg: '#F5F0E0', band: '#6B1A1A', ink: '#1F1F1F' }, // Poetry
  teal:      { bg: '#F5F0E0', band: '#2D6B6B', ink: '#1F1F1F' }, // Nature
  sage:      { bg: '#F5F0E0', band: '#5A6B47', ink: '#1F1F1F' }, // Travel
};

function V42Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V42_BG_TONES[settings.themeColors.v42.bgTone] || V42_BG_TONES.orange;
  const { bg, band, ink } = tone;
  const accent = settings.themeColors.v42.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0,
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
    }}>
      {/* Top color band */}
      <div style={{ background: band, color: bg, padding: '14px 50px', display: 'flex', alignItems: 'center', gap: 14, fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
        <span style={{ width: 24, height: 24, borderRadius: 12, background: bg, color: band, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11 }}>
          🐧
        </span>
        <span>Classics</span>
        <span style={{ flex: 1 }}/>
        <span>Chapter {chapterIdx + 1} / {total}</span>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '52px 50px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.4em', color: 'rgba(31,31,31,0.5)', fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
            № {String(chapterIdx + 1).padStart(3, '0')}
          </div>
          <h1 style={{
            fontFamily: '"Inter","Helvetica Neue",sans-serif',
            fontSize: settings.tweaks.fontSize + 14, fontWeight: 600,
            margin: 0, lineHeight: 1.2, letterSpacing: '-0.005em', color: ink,
          }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 18 }}>
            <span style={{ width: 32, height: 1, background: band }}/>
            <span style={{ width: 5, height: 5, background: band, borderRadius: '50%' }}/>
            <span style={{ width: 32, height: 1, background: band }}/>
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          color: ink,
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : '"Inter","Helvetica Neue",sans-serif',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 22, borderTop: `1px solid ${band}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}`, borderRadius: 2, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'inherit' }}>‹ Previous</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: band, color: bg, border: `1px solid ${band}`, borderRadius: 2, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', fontFamily: 'inherit' }}>Next ›</button>
        </div>
      </div>

      {/* Bottom color band */}
      <div style={{ background: band, color: bg, padding: '8px 50px', fontSize: 10, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', textAlign: 'center', opacity: 0.92 }}>
        ◆◆◆◆◆ {(book.author || 'Anonymous').toUpperCase()} ◆◆◆◆◆
      </div>
    </main>
  );
}

function V42Footer({ book, chapterIdx, settings }) {
  const tone = V42_BG_TONES[settings.themeColors.v42.bgTone] || V42_BG_TONES.orange;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `1px solid ${tone.band}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter","Helvetica Neue",sans-serif', fontSize: 11,
    }}>
      <span style={{ fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: tone.band }}>
        Ch. {chapterIdx + 1} / {total}
      </span>
      <div style={{ flex: 1, height: 2, background: `${tone.band}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.band }}/>
      </div>
      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V42Reader = V42Reader;
window.V42Footer = V42Footer;
