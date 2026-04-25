// src/themes/v47-marbled.jsx — Marbled endpapers: Turkish-style swirling marble + ivory body card
const V47_BG_TONES = {
  peacock:   { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#1A2028', accentInk: '#1C4A4E' },
  rose:      { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#3A1A20', accentInk: '#7A2A48' },
  forest:    { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#1A2818', accentInk: '#2A5A38' },
  midnight:  { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#0F1828', accentInk: '#1A3D7A' },
  amber:     { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#3A2818', accentInk: '#A0682A' },
  plum:      { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#2A1A2E', accentInk: '#6A3A6A' },
  sage:      { ivory: '#F4EEDC', ivory2: '#EAE2CA', ink: '#1F2820', accentInk: '#3E6B4E' },
  ochre:     { ivory: '#F2EAD2', ivory2: '#E8DCB4', ink: '#2A1A0C', accentInk: '#A85828' },
  charcoal:  { ivory: '#F0EEE5', ivory2: '#E0DDD0', ink: '#1A1A1A', accentInk: '#3A3A3A' },
};

function V47Marbled({ ink }) {
  // SVG marbled background — Turkish swirl pattern
  return `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><defs><filter id='m'><feTurbulence type='turbulence' baseFrequency='0.008 0.02' numOctaves='3' seed='7'/><feColorMatrix values='0 0 0 0 0.11  0 0 0 0 0.29  0 0 0 0 0.30  0 0 0 1.4 -0.2'/><feComposite in2='SourceGraphic' operator='in'/></filter><filter id='m2'><feTurbulence type='fractalNoise' baseFrequency='0.02' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.79  0 0 0 0 0.66  0 0 0 0 0.29  0 0 0 0.8 -0.3'/></filter></defs><rect width='800' height='600' fill='${encodeURIComponent('#1A3B6B')}'/><rect width='800' height='600' filter='url(%23m)'/><rect width='800' height='600' filter='url(%23m2)' opacity='0.55'/></svg>")`;
}

function V47Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V47_BG_TONES[settings.themeColors.v47.bgTone] || V47_BG_TONES.peacock;
  const { ivory, ivory2, ink, accentInk } = tone;
  const gold = settings.themeColors.v47.accent;
  const mute = 'rgba(26,32,40,0.55)', soft = 'rgba(26,32,40,0.85)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: ivory, color: ink, fontFamily: '"Noto Serif TC",serif', padding: 0, position: 'relative',
    }}>
      {/* marbled top band */}
      <div style={{
        height: 80, position: 'relative',
        background: V47Marbled({ ink: accentInk }), backgroundSize: 'cover',
        borderBottom: `1px solid ${gold}`,
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 30% 50%, ${accentInk}66 0%, transparent 35%), radial-gradient(circle at 75% 50%, ${gold}55 0%, transparent 30%)`,
          mixBlendMode: 'screen', opacity: 0.7,
        }}/>
        <div style={{
          position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
          padding: '8px 24px', background: ivory, border: `2px solid ${gold}`,
          fontSize: 11, color: mute, letterSpacing: '0.5em', fontWeight: 700, textAlign: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
        }}>
          ❦ EX LIBRIS · MARBLED ❦
        </div>
      </div>

      <div style={{ padding: '40px 50px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1, height: 1, background: accentInk }}/>
          <span style={{ color: accentInk, fontSize: 13 }}>❦</span>
          <div style={{ flex: 1, height: 1, background: accentInk }}/>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 3, background: accentInk }}/>
          <span style={{ fontSize: 11, color: accentInk, letterSpacing: '0.5em', fontWeight: 700 }}>
            CAPUT · {chapterIdx + 1}
          </span>
          <div style={{ flex: 1, height: 3, background: accentInk }}/>
        </div>
        <div style={{ textAlign: 'center', margin: '10px 0 22px' }}>
          <div style={{ fontSize: settings.tweaks.fontSize + 16, color: accentInk, letterSpacing: '0.1em', fontWeight: 500 }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: mute, letterSpacing: '0.15em', marginTop: 4 }}>
            Vol. {chapterIdx + 1} of {total}
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Noto Serif TC",serif', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': gold,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
          <div style={{ flex: 1, height: 1, background: accentInk }}/>
          <span style={{ color: accentInk, fontSize: 12 }}>❦ · {chapterIdx + 1} · ❦</span>
          <div style={{ flex: 1, height: 1, background: accentInk }}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: ivory2, color: accentInk, border: `1px solid ${accentInk}`, fontFamily: 'var(--serif)', letterSpacing: '0.16em' }}>‹ Prev</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accentInk, color: ivory, border: `1px solid ${accentInk}`, fontFamily: 'var(--serif)', letterSpacing: '0.16em', fontWeight: 600 }}>Next ›</button>
        </div>
      </div>

      {/* marbled bottom band */}
      <div style={{
        height: 28, position: 'relative',
        background: V47Marbled({ ink: accentInk }), backgroundSize: 'cover',
        borderTop: `1px solid ${gold}`, marginTop: 12,
      }}/>
    </main>
  );
}

function V47Footer({ book, chapterIdx, settings }) {
  const tone = V47_BG_TONES[settings.themeColors.v47.bgTone] || V47_BG_TONES.peacock;
  const gold = settings.themeColors.v47.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.ivory, color: tone.ink, borderTop: `1px solid ${tone.accentInk}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: tone.accentInk, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.3em' }}>VOL. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.accentInk}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span style={{ color: tone.accentInk, fontWeight: 700, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V47Reader = V47Reader;
window.V47Footer = V47Footer;
