// src/themes/v15-vinyl.jsx — Vinyl LP record: concentric grooves, center label, Side A/B, gold/copper RIAA aesthetic
const V15_BG_TONES = {
  midnight:  { bg: '#0A0A0A', label: '#C8242C', labelInk: '#F8E8C8', wax: '#1A1A1A' },
  amber:     { bg: '#0A0808', label: '#D4A848', labelInk: '#1A0E04', wax: '#181412' },
  ivory:     { bg: '#0E0E0E', label: '#F0E2C0', labelInk: '#1A1408', wax: '#1A1A1A' },
  cream:     { bg: '#F5EAD0', label: '#1A1A1A', labelInk: '#F0E2C0', wax: '#E8D8B0' },
  parchment: { bg: '#E8DCB0', label: '#5A1818', labelInk: '#F0E2C0', wax: '#D8C898' },
  forest:    { bg: '#0E1810', label: '#5E8038', labelInk: '#F0E2C0', wax: '#1A2818' },
  navy:      { bg: '#0A0F1F', label: '#1E3D7A', labelInk: '#F0E2C0', wax: '#15182E' },
  oxblood:   { bg: '#0E0606', label: '#5A1818', labelInk: '#F0E2C0', wax: '#180E0E' },
  smoke:     { bg: '#1A1A1A', label: '#A8A8A8', labelInk: '#1A1A1A', wax: '#252525' },
};

function V15Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V15_BG_TONES[settings.themeColors.v15.bgTone] || V15_BG_TONES.midnight;
  const { bg, label, labelInk, wax } = tone;
  const accent = settings.themeColors.v15.accent;
  const total = book.chaptersMeta.length;
  const sideAB = chapterIdx % 2 === 0 ? 'A' : 'B';
  const isDarkBG = bg === '#0A0A0A' || bg === '#0A0808' || bg === '#0E0E0E' || bg === '#0E1810' || bg === '#0A0F1F' || bg === '#0E0606' || bg === '#1A1A1A';
  const ink = isDarkBG ? '#F0E2C0' : '#1A1408';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: '"Inter","Helvetica Neue",sans-serif',
      padding: 0, position: 'relative',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '36px 32px 40px' }}>
        {/* vinyl LP visual: concentric grooves around a center round label */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
          <div style={{
            width: 360, height: 360, borderRadius: '50%',
            background: `radial-gradient(circle, ${wax} 16%, ${bg === wax ? '#040404' : wax} 17%)`,
            backgroundImage: `repeating-radial-gradient(circle at center, transparent 0 2px, rgba(255,255,255,0.04) 2px 3px)`,
            boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 4px 8px rgba(0,0,0,0.4)`,
            position: 'relative', display: 'grid', placeItems: 'center',
            border: `2px solid rgba(0,0,0,0.5)`,
          }}>
            {/* center label */}
            <div style={{
              width: 150, height: 150, borderRadius: '50%',
              background: label, color: labelInk,
              boxShadow: `0 0 0 2px rgba(0,0,0,0.3), inset 0 0 0 4px ${accent}`,
              display: 'grid', placeItems: 'center',
              padding: 16, textAlign: 'center', position: 'relative',
            }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.4em', fontWeight: 800, marginBottom: 4 }}>SIDE {sideAB}</div>
                <div style={{
                  fontFamily: 'var(--serif)', fontSize: 14, fontWeight: 700, lineHeight: 1.15,
                  letterSpacing: '0.02em', maxWidth: 110, margin: '0 auto',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{stripChapterPrefix(chapterTitle)}</div>
                <div style={{ fontSize: 8, letterSpacing: '0.3em', fontWeight: 700, marginTop: 6, opacity: 0.75 }}>
                  TRK {String(chapterIdx + 1).padStart(2, '0')} · {String(total).padStart(2, '0')}
                </div>
              </div>
              {/* spindle hole */}
              <div style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: bg, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.7)' }}/>
            </div>
          </div>
        </div>

        {/* track listing header */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18,
          paddingBottom: 8, borderBottom: `1px solid ${ink}33`,
          fontFamily: '"Inter","Helvetica Neue",sans-serif',
        }}>
          <span style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 800, color: accent }}>
            ◉ NOW PLAYING
          </span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontSize: 11, letterSpacing: '0.2em', color: ink, opacity: 0.55, fontStyle: 'italic' }}>
            {(book.author || 'V/A')} — {book.title}
          </span>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          color: ink, fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 14, borderTop: `1px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 14px', borderRadius: 999,
            background: 'transparent', color: ink, border: `1.5px solid ${accent}`,
            fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, fontSize: 11,
          }}>◄◄ PREV TRACK</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 14px', borderRadius: 999,
            background: accent, color: bg, border: `1.5px solid ${accent}`,
            fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, fontSize: 11,
          }}>NEXT TRACK ►►</button>
        </div>
      </div>
    </main>
  );
}

function V15Footer({ book, chapterIdx, settings }) {
  const tone = V15_BG_TONES[settings.themeColors.v15.bgTone] || V15_BG_TONES.midnight;
  const accent = settings.themeColors.v15.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const isDarkBG = tone.bg === '#0A0A0A' || tone.bg === '#0A0808' || tone.bg === '#0E0E0E' || tone.bg === '#0E1810' || tone.bg === '#0A0F1F' || tone.bg === '#0E0606' || tone.bg === '#1A1A1A';
  const ink = isDarkBG ? '#F0E2C0' : '#1A1408';
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: ink, borderTop: `1px solid ${ink}33`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Inter","Helvetica Neue",sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accent }}>◉ {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V15Reader = V15Reader;
window.V15Footer = V15Footer;
