// src/themes/v46-leather-gilt.jsx — Limited-edition leather binding: tooled gilt corners, gold debossed wordmark
const V46_BG_TONES = {
  walnut:    { bg1: '#3E1F10', bg2: '#2A1308', bg3: '#5A3020' },
  oxblood:   { bg1: '#3B0F14', bg2: '#220609', bg3: '#5A1A20' },
  midnight:  { bg1: '#1A1A28', bg2: '#0E0E1A', bg3: '#2A2A38' },
  forest:    { bg1: '#1A3A2A', bg2: '#0E2418', bg3: '#2A5A3E' },
  cognac:    { bg1: '#5A3220', bg2: '#3E1F10', bg3: '#7A4A2A' },
  charcoal:  { bg1: '#2A2A2A', bg2: '#1A1A1A', bg3: '#3E3E3E' },
  burgundy:  { bg1: '#4A1A1A', bg2: '#2E0E0E', bg3: '#6B2A2A' },
  ebony:     { bg1: '#1A100A', bg2: '#0E0805', bg3: '#2E1F14' },
  navy:      { bg1: '#1A2A48', bg2: '#0E1828', bg3: '#2A3E5E' },
};

function V46Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V46_BG_TONES[settings.themeColors.v46.bgTone] || V46_BG_TONES.walnut;
  const { bg1, bg2, bg3 } = tone;
  const gold = settings.themeColors.v46.accent;
  const goldL = '#F0D47A', goldD = '#8C6828';
  const cream = '#F4E6C4', ink = '#F0E2B8';
  const mute = 'rgba(240,226,184,0.55)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `radial-gradient(ellipse at 30% 30%, ${bg3} 0%, ${bg1} 45%, ${bg2} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC",serif', position: 'relative', padding: '32px 40px',
    }}>
      {/* leather noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.7,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='0.35' numOctaves='4'/><feColorMatrix values='0 0 0 0 0.2  0 0 0 0 0.05  0 0 0 0 0.02  0 0 0 0.20 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}/>
      {/* gilt frame */}
      <div style={{
        position: 'absolute', inset: 18, border: `2px solid ${gold}`,
        boxShadow: `inset 0 0 0 3px ${bg2}, inset 0 0 0 4px ${goldD}`, pointerEvents: 'none',
      }}/>
      <div style={{ position: 'absolute', inset: 26, border: `0.5px solid ${gold}`, opacity: 0.6, pointerEvents: 'none' }}/>
      {/* corner curls */}
      {[[26, 26, 0], [26, null, 90], [null, 26, -90], [null, null, 180]].map((p, i) => (
        <div key={i} style={{
          position: 'absolute', width: 50, height: 50, transform: `rotate(${p[2]}deg)`, pointerEvents: 'none',
          top: p[0] !== null ? 26 : undefined, bottom: p[0] === null ? 26 : undefined,
          left: p[1] !== null ? 26 : undefined, right: p[1] === null ? 26 : undefined,
        }}>
          <svg viewBox="0 0 50 50" width="50" height="50">
            <g fill={gold} stroke={goldD} strokeWidth="0.5" opacity="0.92">
              <path d="M4,25 Q4,4 25,4 L25,9 Q9,9 9,25 Z"/>
              <path d="M14,25 Q14,14 25,14 L25,18 Q18,18 18,25 Z"/>
              <circle cx="25" cy="25" r="2.5"/>
            </g>
          </svg>
        </div>
      ))}

      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', padding: '20px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: gold, letterSpacing: '0.6em', fontWeight: 700, textShadow: `0 1px 0 ${bg2}` }}>
          ❦ FROM THE LIBRARY ❦
        </div>
        <div style={{
          fontSize: settings.tweaks.fontSize + 32, margin: '12px 0 4px',
          background: `linear-gradient(180deg, ${goldL} 0%, ${gold} 50%, ${goldD} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          letterSpacing: '0.16em', fontWeight: 500,
          filter: `drop-shadow(0 2px 0 ${bg2})`,
        }}>{book.title}</div>
        <div style={{ fontSize: 13, color: goldL, letterSpacing: '0.3em', fontStyle: 'italic' }}>
          {(book.author || 'Anonymous').toUpperCase()}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0' }}>
          <div style={{ width: 60, height: 1, background: gold }}/>
          <span style={{ fontSize: 13, color: gold }}>✦</span>
          <div style={{ width: 60, height: 1, background: gold }}/>
        </div>
        <div style={{ fontSize: 11, color: mute, letterSpacing: '0.3em', fontStyle: 'italic' }}>
          LIMITED EDITION · BOUND IN CALFSKIN
        </div>
      </div>

      <div style={{
        position: 'relative', margin: '14px 50px 30px',
        padding: '24px 32px',
        background: `linear-gradient(180deg, ${bg3}88 0%, ${bg1}88 100%)`,
        border: `1px solid ${goldD}`,
        boxShadow: `inset 0 0 0 2px ${bg2}, 0 4px 12px rgba(0,0,0,0.4)`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 12, borderBottom: `1px solid ${goldD}` }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: `radial-gradient(circle, ${goldL} 0%, ${goldD} 100%)`,
            color: bg1, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14,
            boxShadow: `0 2px 4px rgba(0,0,0,0.5), inset 0 1px 0 ${cream}`,
          }}>{chapterIdx + 1}</div>
          <div style={{ fontSize: settings.tweaks.fontSize + 5, color: goldL, letterSpacing: '0.1em' }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 10, color: mute, letterSpacing: '0.3em' }}>— CAPITVLVM {chapterIdx + 1} / {total} —</div>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Noto Serif TC",serif', color: ink, marginTop: 16,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': gold,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${goldD}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: goldL, border: `1px solid ${gold}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>‹ PRECEDING</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: gold, color: bg1, border: `1px solid ${gold}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 700 }}>FOLLOWING ›</button>
        </div>
      </div>
    </main>
  );
}

function V46Footer({ book, chapterIdx, settings }) {
  const tone = V46_BG_TONES[settings.themeColors.v46.bgTone] || V46_BG_TONES.walnut;
  const gold = settings.themeColors.v46.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#F4E6C4', borderTop: `1px solid ${gold}55`,
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

window.V46Reader = V46Reader;
window.V46Footer = V46Footer;
