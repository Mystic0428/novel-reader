// src/themes/v27-firstfolio.jsx — Renaissance First Folio: paper card with inset double border, fraktur drop cap, italic captions
const V27_BG_TONES = {
  paper:     { bg: '#EDE0C4', bg2: '#E2D2AB', ink: '#1A1008' },
  ivory:     { bg: '#F2E5C8', bg2: '#E5D5A8', ink: '#1A1008' },
  cream:     { bg: '#F0E4B8', bg2: '#E0D198', ink: '#1F1408' },
  oat:       { bg: '#E5D8B0', bg2: '#D5C594', ink: '#1A1008' },
  hemp:      { bg: '#DCCEA0', bg2: '#CCBD80', ink: '#1A0E04' },
  ash:       { bg: '#E8DCC0', bg2: '#D5C7A4', ink: '#180C04' },
  bone:      { bg: '#F4E8D0', bg2: '#E5D5B0', ink: '#1A1008' },
  parchment: { bg: '#EBDDB0', bg2: '#DCCB94', ink: '#1A0E04' },
  dusk:      { bg: '#D5C8A0', bg2: '#C5B884', ink: '#180C04' },
};

function V27Foliate({ color, width = 380 }) {
  return (
    <svg viewBox="0 0 380 16" width={width} height={16 * width / 380} style={{ display: 'block' }}>
      <g fill="none" stroke={color} strokeWidth="0.8">
        <path d="M4,8 Q40,2 80,8 Q120,14 160,8 Q200,2 240,8 Q280,14 320,8 Q360,2 376,8"/>
        {[40, 120, 200, 280, 360].map((x, i) => (
          <circle key={i} cx={x} cy="8" r="2" fill={color}/>
        ))}
      </g>
    </svg>
  );
}

function V27Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V27_BG_TONES[settings.themeColors.v27.bgTone] || V27_BG_TONES.paper;
  const { bg, bg2, ink } = tone;
  const accent = settings.themeColors.v27.accent;
  const mute = 'rgba(26,16,8,0.55)', soft = 'rgba(26,16,8,0.8)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg2, color: ink, padding: 18, fontFamily: 'var(--serif)',
    }}>
      <div style={{
        background: bg, boxShadow: `inset 0 0 0 1px ${ink}, 0 2px 8px rgba(0,0,0,0.12)`,
        padding: '32px 40px', position: 'relative', maxWidth: 760, margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <V27Foliate color={ink} width={420}/>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.5em', color: soft, marginTop: 4 }}>
          THE  FIRST  BOOKE
        </div>
        <div style={{ textAlign: 'center', fontSize: 13, letterSpacing: '0.3em', color: ink, marginTop: 6 }}>
          CAPITVLVM · {chapterIdx + 1}
        </div>
        <h1 style={{
          fontFamily: '"Noto Serif TC",serif', fontSize: settings.tweaks.fontSize + 18, color: ink,
          margin: '14px 0 6px', letterSpacing: '0.08em', fontWeight: 500, textAlign: 'center', lineHeight: 1.15,
        }}>
          {stripChapterPrefix(chapterTitle)}
        </h1>
        <div style={{ fontStyle: 'italic', fontSize: settings.tweaks.fontSize - 1, color: soft, letterSpacing: '0.05em', textAlign: 'center', marginBottom: 10 }}>
          A Tragicall Historie · Booke {chapterIdx + 1} of {total}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <V27Foliate color={ink} width={420}/>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11, letterSpacing: '0.4em', color: mute, borderBottom: `1px solid ${ink}`, paddingBottom: 6, marginBottom: 20 }}>
          THE  FIRST  BOOKE · CAPITVLVM  {chapterIdx + 1}
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, color: mute, marginTop: 14, fontStyle: 'italic' }}>
          <span>A iij</span>
          <span>— {chapterIdx + 1} —</span>
          <span>Of the STONE</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, paddingTop: 16, borderTop: `1px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: bg2, color: ink, border: `1px solid ${ink}`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.14em' }}>‹ Præcedens</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `1px solid ${ink}`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.14em' }}>Sequens ›</button>
        </div>
      </div>
    </main>
  );
}

function V27Footer({ book, chapterIdx, settings }) {
  const tone = V27_BG_TONES[settings.themeColors.v27.bgTone] || V27_BG_TONES.paper;
  const accent = settings.themeColors.v27.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `1px solid ${tone.ink}33`, background: tone.bg2, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ letterSpacing: '0.3em' }}>Cap. {chapterIdx + 1} of {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 600, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V27Reader = V27Reader;
window.V27Footer = V27Footer;
