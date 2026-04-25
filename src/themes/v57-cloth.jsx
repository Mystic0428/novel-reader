// src/themes/v57-cloth.jsx — Hardcover bookcloth: woven cloth weave texture, gold-stamped title, raised cover feel
const V57_BG_TONES = {
  forest:   { cloth: '#1A3A28', cloth2: '#0F2418', paper: '#F0E5D0', ink: '#1A1408' },
  oxblood:  { cloth: '#3A1218', cloth2: '#240608', paper: '#F0E5D0', ink: '#1A1408' },
  navy:     { cloth: '#0F1F38', cloth2: '#0A1428', paper: '#F0E5D0', ink: '#1A1408' },
  walnut:   { cloth: '#3A2818', cloth2: '#241A0E', paper: '#F4E8C8', ink: '#1A1408' },
  graphite: { cloth: '#2A2A2A', cloth2: '#1A1A1A', paper: '#F0E5D0', ink: '#1A1408' },
  burgundy: { cloth: '#4A1A1F', cloth2: '#2E0E0E', paper: '#F4E8C8', ink: '#1A0E04' },
  emerald:  { cloth: '#0F2E2A', cloth2: '#081A17', paper: '#F0E5D0', ink: '#1A1408' },
  sand:     { cloth: '#A89058', cloth2: '#7A6438', paper: '#F8F0D8', ink: '#2A1A0C' },
  ivory:    { cloth: '#D8C8A8', cloth2: '#B0A080', paper: '#FAF2DC', ink: '#2A1A0C' },
};

function V57Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V57_BG_TONES[settings.themeColors.v57.bgTone] || V57_BG_TONES.forest;
  const { cloth, cloth2, paper, ink } = tone;
  const gold = settings.themeColors.v57.accent;
  const total = book.chaptersMeta.length;
  const isDarkCloth = cloth.startsWith('#0') || cloth.startsWith('#1') || cloth.startsWith('#2') || cloth.startsWith('#3') || cloth.startsWith('#4');
  // Bookcloth weave texture: tiny linen-weave pattern — fine grid via repeating gradients
  const weave = `
    repeating-linear-gradient(0deg, transparent 0 1px, rgba(0,0,0,0.10) 1px 2px),
    repeating-linear-gradient(90deg, transparent 0 1px, rgba(0,0,0,0.10) 1px 2px),
    repeating-linear-gradient(45deg, transparent 0 4px, rgba(255,255,255,0.04) 4px 5px)
  `;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, fontFamily: 'var(--serif)', padding: 0, position: 'relative',
      background: `linear-gradient(135deg, ${cloth} 0%, ${cloth2} 100%)`,
      backgroundImage: weave + `, linear-gradient(135deg, ${cloth} 0%, ${cloth2} 100%)`,
      backgroundSize: '4px 4px, 4px 4px, 8px 8px, 100% 100%',
    }}>
      <div style={{ padding: '40px 32px 48px', position: 'relative' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* gold-stamped header — embossed title block */}
          <div style={{ textAlign: 'center', marginBottom: 28, padding: '20px 0' }}>
            <div style={{
              fontSize: 11, letterSpacing: '0.6em', fontWeight: 700, color: gold, textTransform: 'uppercase',
              filter: `drop-shadow(0 1px 0 ${cloth2})`, marginBottom: 10,
            }}>
              ✦ Volume {chapterIdx + 1} ✦
            </div>
            {/* gold rule */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
              <div style={{ width: 80, height: 1, background: gold, boxShadow: `0 1px 0 ${cloth2}` }}/>
              <div style={{ color: gold, fontSize: 14, filter: `drop-shadow(0 1px 0 ${cloth2})` }}>❦</div>
              <div style={{ width: 80, height: 1, background: gold, boxShadow: `0 1px 0 ${cloth2}` }}/>
            </div>
            {/* gold-stamped title */}
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 18, fontWeight: 600,
              margin: 0, lineHeight: 1.2, letterSpacing: '0.08em', color: gold,
              textShadow: `0 1px 0 ${cloth2}, 0 -1px 0 rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.35)`,
              filter: `drop-shadow(0 0 16px ${gold}33)`,
            }}>{stripChapterPrefix(chapterTitle)}</h1>
            <div style={{ marginTop: 16, fontSize: 11, color: gold, letterSpacing: '0.4em', fontStyle: 'italic', opacity: 0.85 }}>
              {(book.author || 'Anonymous')}
            </div>
          </div>

          {/* paper page — debossed into cloth cover */}
          <div style={{
            background: paper, color: ink,
            padding: '36px 40px',
            boxShadow: `
              inset 0 0 0 1px rgba(0,0,0,0.08),
              0 0 0 4px ${cloth2},
              0 0 0 5px ${gold},
              0 12px 32px rgba(0,0,0,0.5)
            `,
          }}>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              textAlign: 'justify',
              '--accent': gold,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: `1px solid ${gold}66` }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
                background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
                fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.14em',
              }}>‹ Foregoing</button>
              <button onClick={onNext} disabled={!canNext} style={{
                ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 18px', borderRadius: 0,
                background: ink, color: paper, border: `1.5px solid ${ink}`,
                fontFamily: 'var(--serif)', letterSpacing: '0.14em', fontWeight: 600,
              }}>Following ›</button>
            </div>
          </div>

          {/* gold-stamped publisher mark */}
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 10, color: gold, letterSpacing: '0.5em', fontWeight: 600, fontStyle: 'italic', filter: `drop-shadow(0 1px 0 ${cloth2})` }}>
            ✦ FIRST EDITION · BOUND IN CLOTH ✦
          </div>
        </div>
      </div>
    </main>
  );
}

function V57Footer({ book, chapterIdx, settings }) {
  const tone = V57_BG_TONES[settings.themeColors.v57.bgTone] || V57_BG_TONES.forest;
  const gold = settings.themeColors.v57.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const isDarkCloth = tone.cloth.startsWith('#0') || tone.cloth.startsWith('#1') || tone.cloth.startsWith('#2') || tone.cloth.startsWith('#3') || tone.cloth.startsWith('#4');
  return (
    <div style={{
      padding: '10px 28px', background: tone.cloth2, color: isDarkCloth ? gold : tone.ink,
      borderTop: `1px solid ${gold}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: gold, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.3em' }}>VOL. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${gold}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span style={{ color: gold, fontWeight: 700, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V57Reader = V57Reader;
window.V57Footer = V57Footer;
