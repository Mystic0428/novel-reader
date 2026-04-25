// src/themes/v64-mourning.jsx — Victorian mourning card: cameo border, sepia, obit-style header
const V64_BG_TONES = {
  mourning: { bg: '#1A0F18', surface: '#241522', ink: '#D8C4C8', mute: '#8C7080', rule: '#3A2030' },
  jet:      { bg: '#0A0A12', surface: '#14141E', ink: '#D0CCD8', mute: '#7C7C8C', rule: '#22222E' },
  sepia:    { bg: '#1A140A', surface: '#241D14', ink: '#E0D0B0', mute: '#9C8868', rule: '#3A2C18' },
  crimson:  { bg: '#1F0A14', surface: '#2A1220', ink: '#E0CCD0', mute: '#9C7888', rule: '#3A1A28' },
  midnight: { bg: '#0A0F1A', surface: '#141A28', ink: '#D0D0E0', mute: '#7C84A0', rule: '#1F2840' },
  forest:   { bg: '#0A140F', surface: '#141E18', ink: '#D0D8C8', mute: '#7C9080', rule: '#1F2820' },
  pewter:   { bg: '#1A1A1F', surface: '#262630', ink: '#D8D8E0', mute: '#9090A0', rule: '#383848' },
  ash:      { bg: '#28282A', surface: '#383840', ink: '#E0DCD8', mute: '#A0A09C', rule: '#4C4C50' },
  bone:     { bg: '#E4DCD0', surface: '#D4CCBE', ink: '#1A1014', mute: '#5A4848', rule: '#A89890' },
};

function V64Cameo({ accent, mute }) {
  return (
    <svg width="60" height="60" viewBox="0 0 60 60">
      <defs>
        <radialGradient id="v64cm" cx="50%" cy="40%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={mute} stopOpacity="0.1"/>
        </radialGradient>
      </defs>
      <ellipse cx="30" cy="30" rx="22" ry="26" fill="url(#v64cm)" stroke={accent} strokeWidth="0.8"/>
      <ellipse cx="30" cy="30" rx="18" ry="22" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.4"/>
      <path d="M30 14 L34 22 L42 24 L36 30 L38 38 L30 34 L22 38 L24 30 L18 24 L26 22 Z"
        fill="none" stroke={accent} strokeWidth="0.6" opacity="0.5"/>
    </svg>
  );
}

function V64Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V64_BG_TONES[settings.themeColors.v64.bgTone] || V64_BG_TONES.mourning;
  const accent = settings.themeColors.v64.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const isLight = bg === '#E4DCD0';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      {/* lace pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: isLight ? 0.05 : 0.04,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='none' stroke='${encodeURIComponent(accent)}' stroke-width='0.4'><circle cx='20' cy='20' r='6'/><circle cx='60' cy='20' r='6'/><circle cx='20' cy='60' r='6'/><circle cx='60' cy='60' r='6'/><circle cx='40' cy='40' r='10'/><path d='M20 20 L40 40 L60 20 M20 60 L40 40 L60 60'/></g></svg>")`,
      }}/>

      <article style={{ maxWidth: 640, margin: '0 auto', padding: '60px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* mourning cameo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <V64Cameo accent={accent} mute={mute}/>
        </div>

        {/* obit-style header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 11, color: mute, letterSpacing: '0.4em', marginBottom: 8,
          }}>In Memoriam</div>
          <div style={{
            fontSize: 11, color: accent, letterSpacing: '0.3em', fontWeight: 600,
          }}>
            ✠ Chapter the {ordinalEn(chapterIdx + 1)} ✠
          </div>
        </div>

        {/* title in mourning serif */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 14, fontWeight: 500,
          textAlign: 'center', margin: '6px 0 18px', letterSpacing: '0.04em', color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* black armband divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
          <span style={{ color: accent, fontSize: 10, letterSpacing: '0.3em', fontStyle: 'italic' }}>
            ❦ et in arcadia ego ❦
          </span>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end */}
        <div style={{ textAlign: 'center', marginTop: 36, color: mute, fontSize: 14, letterSpacing: '0.5em' }}>
          ✠
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30, paddingTop: 18, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: mute, border: `0.5px solid ${rule}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← lament prior</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: accent, border: `0.5px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>continue mourning →</button>
        </div>
      </article>
    </main>
  );
}

function V64Footer({ book, chapterIdx, settings }) {
  const tone = V64_BG_TONES[settings.themeColors.v64.bgTone] || V64_BG_TONES.mourning;
  const accent = settings.themeColors.v64.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.25em',
    }}>
      <span>✠ ch. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V64Reader = V64Reader;
window.V64Footer = V64Footer;
