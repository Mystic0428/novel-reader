// src/themes/v80-silent-film.jsx — silent-era intertitle card: black bg, framed cream card, theatrical serif
const V80_BG_TONES = {
  intertitle: { bg: '#08080A', card: '#E8DCB8', ink: '#1A140A', accent: '#A82820', mute: '#5A4828', rule: '#A88848' },
  nitrate:    { bg: '#000000', card: '#D8C898', ink: '#1A1208', accent: '#C8242C', mute: '#6B5028', rule: '#9C7848' },
  oxford:     { bg: '#1A1208', card: '#E8D8B8', ink: '#1A1408', accent: '#8B1A1A', mute: '#5A4828', rule: '#A88858' },
  bone:       { bg: '#181818', card: '#F4ECD8', ink: '#1A1410', accent: '#5A1818', mute: '#48403A', rule: '#A89860' },
  midnight:   { bg: '#080A14', card: '#E0DCC8', ink: '#0A1228', accent: '#1E3D7A', mute: '#587090', rule: '#9098B0' },
  parchment:  { bg: '#0A0A0A', card: '#F0E4C8', ink: '#1F1810', accent: '#A8302A', mute: '#6B5838', rule: '#B89868' },
  charcoal:   { bg: '#141414', card: '#D8D4C8', ink: '#1A1A14', accent: '#5A1818', mute: '#5A5848', rule: '#A8A498' },
  ink:        { bg: '#040404', card: '#E8D8B8', ink: '#1A140A', accent: '#C8242C', mute: '#5A4828', rule: '#A88858' },
  jade:       { bg: '#0A1A14', card: '#E0E8C8', ink: '#0A1A0A', accent: '#3A6028', mute: '#587848', rule: '#90A878' },
};

function V80Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V80_BG_TONES[settings.themeColors.v80.bgTone] || V80_BG_TONES.intertitle;
  const accent = settings.themeColors.v80.accent;
  const { bg, card, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: '#E8DCB8', padding: '40px 30px 60px', position: 'relative',
      fontFamily: '"EB Garamond","Cormorant Garamond",var(--serif)',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
        {/* the intertitle card */}
        <div style={{
          background: card, color: ink,
          padding: '36px 38px',
          border: `4px double ${ink}`,
          boxShadow: `0 0 0 2px ${bg}, 0 0 0 6px ${ink}, 0 12px 30px rgba(0,0,0,0.7)`,
          position: 'relative',
        }}>
          {/* corner ornament */}
          <div style={{
            position: 'absolute', top: 8, left: 8, right: 8, bottom: 8,
            border: `0.5px solid ${ink}`, pointerEvents: 'none',
          }}/>

          {/* "Chapter the Twelfth" intertitle */}
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 700,
            textAlign: 'center', marginBottom: 8, textTransform: 'uppercase',
          }}>
            ❦ Reel № {String(chapterIdx + 1).padStart(2, '0')} of {String(total).padStart(2, '0')} ❦
          </div>

          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 800,
            textAlign: 'center', margin: '4px 0 10px', letterSpacing: '0.06em', color: ink,
            textTransform: 'uppercase', textShadow: `1px 1px 0 rgba(0,0,0,0.1)`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
            <div style={{ flex: 1, height: 1, background: ink, opacity: 0.4 }}/>
            <span style={{ color: accent, fontSize: 20, letterSpacing: '0.3em' }}>✦ ✦ ✦</span>
            <div style={{ flex: 1, height: 1, background: ink, opacity: 0.4 }}/>
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* dialogue-card style attribution */}
          <div style={{
            textAlign: 'center', marginTop: 32, fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 12, color: mute, letterSpacing: '0.15em',
          }}>
            ── Directed and screened by {book.author || 'Anonymous'} ──
          </div>
        </div>

        {/* subtitle bar at bottom of viewport feel */}
        <div style={{
          marginTop: 22, padding: '8px 16px',
          borderTop: `1px solid #44444C`, borderBottom: `1px solid #44444C`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 11, color: '#A88858', letterSpacing: '0.25em',
        }}>
          <span>◀ {canPrev ? 'PREVIOUS REEL' : '— BEGINNING —'}</span>
          <span style={{ color: accent }}>· INTERMISSION ·</span>
          <span>{canNext ? 'NEXT REEL' : '— END —'} ▶</span>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: 'transparent', color: '#E8DCB8', border: `1.5px solid #E8DCB8`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 11, fontWeight: 700,
          }}>◀ PREV</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: '#E8DCB8', color: bg, border: `1.5px solid #E8DCB8`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 11, fontWeight: 800,
          }}>NEXT ▶</button>
        </div>
      </article>
    </main>
  );
}

function V80Footer({ book, chapterIdx, settings }) {
  const tone = V80_BG_TONES[settings.themeColors.v80.bgTone] || V80_BG_TONES.intertitle;
  const accent = settings.themeColors.v80.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: '#000', borderTop: `1px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: '#A88858', letterSpacing: '0.3em',
    }}>
      <span style={{ color: accent }}>❦ Reel {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: '#222', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V80Reader = V80Reader;
window.V80Footer = V80Footer;
