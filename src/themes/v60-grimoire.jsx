// src/themes/v60-grimoire.jsx — illuminated medieval grimoire: gilt accents, drop cap, sigil ghost
const V60_BG_TONES = {
  ember:    { bg: '#1F1408', surface: '#2D1E10', ink: '#E8D6A8', mute: '#9C8254', rule: '#3A2818' },
  oxblood:  { bg: '#1A0A0E', surface: '#2A1218', ink: '#E8D0A8', mute: '#9C7058', rule: '#3A1A22' },
  midnight: { bg: '#0A1224', surface: '#141E36', ink: '#E0DCB8', mute: '#7088A0', rule: '#1F2A4A' },
  forest:   { bg: '#0A1A12', surface: '#142A1E', ink: '#E0D8A8', mute: '#7C9070', rule: '#1F3A2A' },
  gilt:     { bg: '#241608', surface: '#3A2410', ink: '#F0DCA0', mute: '#A88850', rule: '#4A3018' },
  ash:      { bg: '#181818', surface: '#252525', ink: '#D8D0B8', mute: '#8C8470', rule: '#383838' },
  rust:     { bg: '#1F0F08', surface: '#2A180F', ink: '#E8C8A0', mute: '#9C6852', rule: '#3A2010' },
  bone:     { bg: '#F4ECD8', surface: '#FAF4E4', ink: '#1A1208', mute: '#5A4828', rule: '#C8B898' },
  ink:      { bg: '#0A0A0A', surface: '#161616', ink: '#E8D6A8', mute: '#8C7A50', rule: '#2A2A2A' },
};

function V60SigilLayer({ accent, opacity }) {
  // Faint repeating arcane sigil — magic circle / pentacle silhouette
  const sigil = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320' viewBox='0 0 320 320'><g fill='none' stroke='${encodeURIComponent(accent)}' stroke-width='0.6'><circle cx='160' cy='160' r='120'/><circle cx='160' cy='160' r='100'/><circle cx='160' cy='160' r='70'/><path d='M160 60 L243 197 L77 197 Z'/><path d='M160 260 L77 123 L243 123 Z'/><circle cx='160' cy='160' r='12'/><circle cx='160' cy='40' r='3' fill='${encodeURIComponent(accent)}'/><circle cx='160' cy='280' r='3' fill='${encodeURIComponent(accent)}'/><circle cx='40' cy='160' r='3' fill='${encodeURIComponent(accent)}'/><circle cx='280' cy='160' r='3' fill='${encodeURIComponent(accent)}'/></g></svg>`;
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `url("${sigil}")`,
      backgroundPosition: 'center 40%', backgroundRepeat: 'no-repeat', backgroundSize: '480px 480px',
    }}/>
  );
}

function V60Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V60_BG_TONES[settings.themeColors.v60.bgTone] || V60_BG_TONES.ember;
  const accent = settings.themeColors.v60.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const isLight = bg === '#F4ECD8';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Cormorant Garamond",var(--serif)',
    }}>
      <V60SigilLayer accent={accent} opacity={isLight ? 0.07 : 0.05}/>

      {/* parchment vignette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: isLight
          ? 'radial-gradient(ellipse at center, transparent 50%, rgba(80,50,20,0.18) 100%)'
          : 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)',
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '60px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* manuscript header rubric */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontSize: 11, color: accent, letterSpacing: '0.5em', fontWeight: 700,
            paddingBottom: 10, display: 'inline-block',
          }}>
            ✦ CAPVT · {toRomanV17(chapterIdx + 1)} ✦
          </div>
        </div>

        {/* title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
          textAlign: 'center', margin: '0 0 18px', letterSpacing: '0.04em', color: ink,
          textShadow: isLight ? 'none' : `0 1px 0 rgba(0,0,0,0.4)`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* fleuron divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 0.5, background: accent, opacity: 0.5 }}/>
          <span style={{ color: accent, fontSize: 16, letterSpacing: '0.5em' }}>❦ ✦ ❦</span>
          <div style={{ flex: 1, height: 0.5, background: accent, opacity: 0.5 }}/>
        </div>

        {/* body with illuminated initial */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize + 1, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: book.preserveOriginalCss ? html : injectDropCap(html, settings.tweaks.fontSize * 2.6) }}/>

        {/* end fleuron */}
        <div style={{ textAlign: 'center', marginTop: 36, color: accent, fontSize: 18, letterSpacing: '0.6em' }}>
          ✦ ❦ ✦
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: accent, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>← FOLIO PRIVS</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>FOLIO SEQUENS →</button>
        </div>
      </article>
    </main>
  );
}

function V60Footer({ book, chapterIdx, settings }) {
  const tone = V60_BG_TONES[settings.themeColors.v60.bgTone] || V60_BG_TONES.ember;
  const accent = settings.themeColors.v60.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.18em',
    }}>
      {/* wax seal */}
      <div style={{
        width: 18, height: 18, borderRadius: 9,
        background: `radial-gradient(circle at 35% 30%, ${accent}, ${accent}aa 60%, ${tone.bg} 110%)`,
        boxShadow: `0 0 6px ${accent}40, inset 0 0 0 0.5px rgba(0,0,0,0.3)`,
        display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 900, color: tone.bg,
      }}>✦</div>
      <span>Folio {toRomanV17(chapterIdx + 1)} / {toRomanV17(total)}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V60Reader = V60Reader;
window.V60Footer = V60Footer;
