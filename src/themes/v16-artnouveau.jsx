// src/themes/v16-artnouveau.jsx — Art Nouveau French novel: olive green + gold, italic captions, foliate borders
const V16_BG_TONES = {
  parchment: { bg: '#F0E9D6', bg2: '#E7DEC4', ink: '#2A3323', leaf: '#5E6B3E', gold: '#B08A3A' },
  ivory:     { bg: '#F5EFD8', bg2: '#EBE2C5', ink: '#2A3323', leaf: '#5E6B3E', gold: '#B08A3A' },
  sage:      { bg: '#E2E5C8', bg2: '#D4D9B5', ink: '#1F2A1A', leaf: '#3E5A2E', gold: '#A0822A' },
  rose:      { bg: '#F0E2D8', bg2: '#E5D0C0', ink: '#2A1A14', leaf: '#7A4A3A', gold: '#B0844A' },
  sky:       { bg: '#E0E5D8', bg2: '#D2D8C2', ink: '#1F2A24', leaf: '#3A5A4E', gold: '#A8923A' },
  hazel:     { bg: '#E8DEC0', bg2: '#DCD0AC', ink: '#2A1F12', leaf: '#5A4A1E', gold: '#B89030' },
  emerald:   { bg: '#D8E0CC', bg2: '#C8D2B8', ink: '#1A2418', leaf: '#2A5A3A', gold: '#A88A2E' },
  dusk:      { bg: '#D8D0B8', bg2: '#C8C0A4', ink: '#1A1410', leaf: '#3A3018', gold: '#967825' },
  cream:     { bg: '#F6F0DC', bg2: '#EDE5C8', ink: '#2A3323', leaf: '#5E6B3E', gold: '#B08A3A' },
};

function V16Foliate({ stroke, width = 280 }) {
  return (
    <svg viewBox="0 0 280 18" width={width} height={18 * width / 280} style={{ display: 'block' }}>
      <g fill="none" stroke={stroke} strokeWidth="1.2" strokeLinecap="round">
        <path d="M4,9 Q40,2 76,9 Q112,16 148,9 Q184,2 220,9 Q252,16 276,9"/>
        {[40, 112, 184, 252].map((x, i) => (
          <g key={i}>
            <path d={`M${x},9 q-4,-6 -2,-9 q4,3 2,9`} fill={stroke} fillOpacity="0.4"/>
            <path d={`M${x},9 q4,-6 2,-9 q-4,3 -2,9`} fill={stroke} fillOpacity="0.4"/>
          </g>
        ))}
        <circle cx="140" cy="9" r="2.5" fill={stroke}/>
      </g>
    </svg>
  );
}

function V16Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V16_BG_TONES[settings.themeColors.v16.bgTone] || V16_BG_TONES.parchment;
  const { bg, bg2, ink, leaf, gold } = tone;
  const accent = settings.themeColors.v16.accent;
  const soft = 'rgba(42,51,35,0.78)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg, color: ink, padding: '40px 20px', fontFamily: 'var(--serif)',
    }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <V16Foliate stroke={gold} width={300}/>
          <div style={{ fontStyle: 'italic', fontSize: 14, color: gold, letterSpacing: '0.5em', margin: '16px 0 8px' }}>
            Chapitre {chapterIdx + 1}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 500, margin: 0, letterSpacing: '0.2em', color: ink }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
            <V16Foliate stroke={gold} width={300}/>
          </div>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ textAlign: 'center', marginTop: 36, color: gold, fontSize: 14, letterSpacing: '1em' }}>❦ ❦ ❦</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `0.5px dashed ${gold}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: leaf, border: `0.5px solid ${gold}`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.12em' }}>‹ Précédent</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: bg2, color: leaf, border: `0.5px solid ${gold}`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.12em' }}>Suivant ›</button>
        </div>
      </div>
    </main>
  );
}

function V16Footer({ book, chapterIdx, settings }) {
  const tone = V16_BG_TONES[settings.themeColors.v16.bgTone] || V16_BG_TONES.parchment;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `0.5px solid ${tone.gold}`, background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: tone.leaf, letterSpacing: '0.2em' }}>Chap. {chapterIdx + 1} sur {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.gold}55`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.gold }}/>
      </div>
      <span style={{ color: tone.gold, fontWeight: 600 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V16Reader = V16Reader;
window.V16Footer = V16Footer;
