// src/themes/v29-exlibris.jsx — Victorian Ex Libris: dark green leather + gold border + griffin crest + fraktur Ex Libris
const V29_BG_TONES = {
  forest:    { bg1: '#1A3A2A', bg2: '#0F2418', accent: '#2A5A3E' }, // 經典深綠皮革
  oxblood:   { bg1: '#3A1A1A', bg2: '#240E0E', accent: '#5A2A2A' },
  midnight:  { bg1: '#0F1A3B', bg2: '#080F22', accent: '#1A2650' },
  burgundy:  { bg1: '#3B0F14', bg2: '#220609', accent: '#5A1A20' },
  walnut:    { bg1: '#2A1A0E', bg2: '#1A100A', accent: '#3E2A1A' },
  navy:      { bg1: '#152A3E', bg2: '#0A1828', accent: '#2A4060' },
  charcoal:  { bg1: '#1A1A1A', bg2: '#0E0E0E', accent: '#2E2E2E' },
  emerald:   { bg1: '#0F2E2A', bg2: '#081A17', accent: '#1A3F3A' },
  inkwell:   { bg1: '#1A1424', bg2: '#0E0A18', accent: '#2A1F38' },
};

function V29Griffin({ size = 100, gold, goldD, leather2 }) {
  return (
    <svg viewBox="0 0 120 150" width={size} height={size * 1.25}>
      <path d="M10,10 L110,10 L110,80 Q110,120 60,145 Q10,120 10,80 Z" fill={leather2} stroke={gold} strokeWidth="1.5"/>
      <line x1="60" y1="10" x2="60" y2="145" stroke={gold} strokeWidth="0.6" opacity="0.5"/>
      <line x1="10" y1="75" x2="110" y2="75" stroke={gold} strokeWidth="0.6" opacity="0.5"/>
      <g fill={gold} stroke={goldD} strokeWidth="0.8">
        <path d="M60,35 Q55,28 48,30 Q42,22 48,18 Q54,14 60,22 Q66,14 72,18 Q78,22 72,30 Q65,28 60,35 Z"/>
        <ellipse cx="60" cy="52" rx="14" ry="10"/>
        <circle cx="57" cy="48" r="1" fill={leather2}/>
        <path d="M52,60 Q44,72 40,86 Q38,100 46,110 L58,100 L72,108 L78,96 Q80,80 74,68 Q68,60 52,60 Z"/>
        <path d="M48,62 Q38,58 30,66 Q28,78 36,82 Q42,70 48,68 Z"/>
        <path d="M72,62 Q82,58 90,66 Q92,78 84,82 Q78,70 72,68 Z"/>
        <path d="M46,110 L42,118 L48,116 Z"/>
        <path d="M58,110 L58,120 L62,118 Z"/>
      </g>
    </svg>
  );
}

function V29Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V29_BG_TONES[settings.themeColors.v29.bgTone] || V29_BG_TONES.forest;
  const { bg1, bg2 } = tone;
  const cream = '#F0E6D2';
  const gold = settings.themeColors.v29.accent;
  const goldL = '#E8CB8C';
  const goldD = '#8C6B2E';
  const ink = '#2A1A0C';
  const mute = 'rgba(240,230,210,0.6)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 100%)`,
      color: cream, fontFamily: 'var(--serif)', position: 'relative', padding: '32px 50px',
    }}>
      {/* leather noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence baseFrequency='0.55' numOctaves='3'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0.05  0 0 0 0 0  0 0 0 0.12 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        mixBlendMode: 'overlay', opacity: 0.6,
      }}/>
      {/* gilt borders */}
      <div style={{ position: 'absolute', inset: 14, border: `2px solid ${gold}`, boxShadow: `inset 0 0 0 3px ${bg2}, inset 0 0 0 4px ${goldD}`, pointerEvents: 'none' }}/>

      {/* Ex Libris card */}
      <div style={{ position: 'relative', padding: '36px 60px 24px', display: 'flex', alignItems: 'center', gap: 30 }}>
        <V29Griffin size={100} gold={gold} goldD={goldD} leather2={bg2}/>
        <div>
          <div style={{
            fontFamily: `'UnifrakturCook','Noto Serif TC',serif`, fontSize: 42, color: gold,
            letterSpacing: '0.08em', lineHeight: 1, textShadow: `1px 1px 0 ${bg2}`,
          }}>
            Ex Libris
          </div>
          <div style={{ fontSize: 11, color: mute, letterSpacing: '0.3em', marginTop: 4 }}>FROM THE LIBRARY OF</div>
          <div style={{
            fontSize: 24, color: cream, fontStyle: 'italic', marginTop: 6,
            borderBottom: `1px solid ${gold}`, paddingBottom: 6, fontFamily: '"Noto Serif TC",serif',
          }}>
            {book.title} · Vol. {chapterIdx + 1}
          </div>
          <div style={{ fontSize: 11, color: mute, letterSpacing: '0.22em', marginTop: 6 }}>
            {(book.author || 'Anonymous')} · Edinburgh Edition
          </div>
        </div>
      </div>

      {/* body */}
      <div style={{
        position: 'relative', margin: '0 8px',
        background: `linear-gradient(180deg, ${tone.accent} 0%, ${bg2} 100%)`,
        border: `1px solid ${goldD}`, boxShadow: `inset 0 0 0 2px ${bg2}, inset 0 0 40px rgba(0,0,0,0.4)`,
        padding: '24px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 12, borderBottom: `1px solid ${goldD}` }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: gold,
            color: bg2, display: 'grid', placeItems: 'center', fontFamily: 'serif',
            fontWeight: 700, fontSize: 14,
          }}>{chapterIdx + 1}</div>
          <div style={{ fontSize: settings.tweaks.fontSize + 3, color: goldL, letterSpacing: '0.1em', fontFamily: '"Noto Serif TC",serif' }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 10, color: mute, letterSpacing: '0.3em' }}>— CH. {chapterIdx + 1} / {total} —</div>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: cream, marginTop: 16,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': gold,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ textAlign: 'center', color: gold, marginTop: 14, letterSpacing: '0.5em', fontSize: 14 }}>
          ❦ ❦ ❦
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, paddingTop: 12, borderTop: `1px solid ${goldD}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: goldL, border: `1px solid ${gold}`, fontFamily: 'var(--serif)', letterSpacing: '0.16em' }}>‹ Previous</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: gold, color: bg2, border: `1px solid ${gold}`, fontFamily: 'var(--serif)', letterSpacing: '0.16em', fontWeight: 600 }}>Next ›</button>
        </div>
      </div>
    </main>
  );
}

function V29Footer({ book, chapterIdx, settings }) {
  const tone = V29_BG_TONES[settings.themeColors.v29.bgTone] || V29_BG_TONES.forest;
  const gold = settings.themeColors.v29.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#F0E6D2',
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
      borderTop: `1px solid ${gold}55`,
    }}>
      <span style={{ color: gold, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.3em' }}>VOL. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${gold}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span style={{ color: gold, fontWeight: 700, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V29Reader = V29Reader;
window.V29Footer = V29Footer;
