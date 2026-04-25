// src/themes/v26-illuminated.jsx — Medieval illuminated manuscript: vellum, drollery margins, illuminated initial
const V26_BG_TONES = {
  vellum:    { bg: '#F0E2B8', bg2: '#E4D29A', ink: '#2A1A0C', red: '#8B1A1A', blue: '#1E3D7A', gold: '#C9A84A', green: '#3E5A2A' },
  parchment: { bg: '#EDE0AE', bg2: '#E0CE94', ink: '#2A1A0C', red: '#8B1A1A', blue: '#1E3D7A', gold: '#C9A84A', green: '#3E5A2A' },
  ivory:     { bg: '#F4E8C0', bg2: '#E8D8A0', ink: '#2A1A0C', red: '#8B1A1A', blue: '#1E3D7A', gold: '#C9A84A', green: '#3E5A2A' },
  hemp:      { bg: '#E5D5A8', bg2: '#D5C088', ink: '#1F140A', red: '#7A1818', blue: '#1A3870', gold: '#B89030', green: '#385020' },
  oat:       { bg: '#EDE0B0', bg2: '#DDCC98', ink: '#1A0E04', red: '#8B1A1A', blue: '#1E3D7A', gold: '#C9A84A', green: '#3E5A2A' },
  linen:     { bg: '#E8DCB0', bg2: '#D8CA98', ink: '#1A0E04', red: '#7E2A1E', blue: '#1A3D70', gold: '#B89244', green: '#3A5424' },
  bone:      { bg: '#F2E8C8', bg2: '#E5D8AC', ink: '#2A1A0C', red: '#8B1A1A', blue: '#1E3D7A', gold: '#C9A84A', green: '#3E5A2A' },
  tea:       { bg: '#D8C898', bg2: '#C8B47C', ink: '#241404', red: '#7E1814', blue: '#1A3868', gold: '#A88030', green: '#34481E' },
  dusk:      { bg: '#D8CCA0', bg2: '#C8BC88', ink: '#180C04', red: '#7A1818', blue: '#1A3868', gold: '#A88030', green: '#324820' },
};

function V26Drollery({ color, size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size}>
      <g fill="none" stroke={color} strokeWidth="0.8">
        <path d="M12,2 Q18,2 18,8 Q18,14 12,14 Q6,14 6,8 Q6,2 12,2 Z" fill={color} fillOpacity="0.3"/>
        <path d="M8,8 q2,-1 4,0 m-4,2 q2,1 4,0"/>
        <path d="M12,14 q-3,4 0,8 q3,-4 0,-8"/>
        <circle cx="9" cy="6.5" r="0.6" fill={color}/>
        <circle cx="15" cy="6.5" r="0.6" fill={color}/>
      </g>
    </svg>
  );
}

function V26InitialT({ red, gold, bg, size = 60 }) {
  return (
    <span style={{
      float: 'left', width: size, height: size, marginRight: 8, marginTop: 4,
      background: bg, border: `2px solid ${red}`, position: 'relative',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: `'UnifrakturCook','Noto Serif TC',serif`, fontSize: size * 0.72, color: red,
      boxShadow: `inset 0 0 0 1px ${gold}`,
    }}>T</span>
  );
}

function V26Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V26_BG_TONES[settings.themeColors.v26.bgTone] || V26_BG_TONES.vellum;
  const { bg, bg2, ink, red, blue, gold, green } = tone;
  const accent = settings.themeColors.v26.accent;
  const mute = 'rgba(42,26,12,0.55)', soft = 'rgba(42,26,12,0.8)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: `radial-gradient(ellipse at center, ${bg} 0%, ${bg2} 100%)`,
      color: ink, fontFamily: 'var(--serif)', position: 'relative', display: 'flex',
    }}>
      {/* parchment stains */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `radial-gradient(circle at 15% 20%, rgba(90,50,20,0.10) 0, transparent 3%), radial-gradient(circle at 82% 75%, rgba(90,50,20,0.08) 0, transparent 4%)`,
        mixBlendMode: 'multiply',
      }}/>

      {/* left drollery margin */}
      <div style={{ width: 60, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, borderRight: `1px solid ${red}33` }}>
        <V26Drollery color={red}/>
        <V26Drollery color={blue}/>
        <V26Drollery color={green}/>
      </div>

      {/* main column */}
      <div style={{ flex: 1, padding: '28px 32px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 12, borderBottom: `1px solid ${red}55`, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: mute, letterSpacing: '0.4em' }}>CAPITULUM · {chapterIdx + 1}</div>
            <div style={{
              fontFamily: `'UnifrakturCook','Noto Serif TC',serif`, fontSize: settings.tweaks.fontSize + 14,
              color: red, letterSpacing: '0.06em', lineHeight: 1.1,
            }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
            <div style={{ fontSize: 11, color: mute, fontStyle: 'italic', marginTop: 4 }}>
              Liber {chapterIdx + 1} de {total}
            </div>
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ marginTop: 18, paddingTop: 8, borderTop: `1px solid ${red}33`, fontSize: 11, color: mute, fontStyle: 'italic' }}>
          <span style={{ color: red, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.2em', marginRight: 8 }}>GLOSSA ·</span>
          通靈 — lapis sentiens, the sentient stone, herein doth dream of red chambers.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 14, borderTop: `1px solid ${red}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: red, border: `1px solid ${red}55`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.16em' }}>‹ præcedens</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: red, color: bg, border: `1px solid ${red}`, fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.16em' }}>sequens ›</button>
        </div>
      </div>

      {/* right drollery margin */}
      <div style={{ width: 60, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, borderLeft: `1px solid ${red}33` }}>
        <V26Drollery color={blue}/>
        <V26Drollery color={red}/>
        <V26Drollery color={gold}/>
      </div>
    </main>
  );
}

function V26Footer({ book, chapterIdx, settings }) {
  const tone = V26_BG_TONES[settings.themeColors.v26.bgTone] || V26_BG_TONES.vellum;
  const accent = settings.themeColors.v26.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `1px solid ${tone.red}55`, background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: tone.red, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.3em' }}>CAP. {chapterIdx + 1} · {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.red}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V26Reader = V26Reader;
window.V26Footer = V26Footer;
