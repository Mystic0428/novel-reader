// src/themes/v67-bestiary.jsx — antique monster bestiary: woodcut texture, plate label, Latin binomial
const V67_BG_TONES = {
  vellum:    { bg: '#E8DCB8', surface: '#D8CCA8', ink: '#1A140A', mute: '#5A4828', rule: '#A88848' },
  parchment: { bg: '#F0E4C8', surface: '#E0D4B8', ink: '#1F1810', mute: '#6B5838', rule: '#B89868' },
  ochre:     { bg: '#D8B878', surface: '#C8A868', ink: '#1A1008', mute: '#5A3818', rule: '#9C7838' },
  moss:      { bg: '#1A2218', surface: '#262E22', ink: '#D8D8B8', mute: '#909878', rule: '#384028' },
  ink:       { bg: '#0F0F0A', surface: '#1A1A14', ink: '#D8D0B0', mute: '#888068', rule: '#2A2A20' },
  copper:    { bg: '#1F1A14', surface: '#2A241C', ink: '#E0C8A0', mute: '#9C7858', rule: '#3A2A1C' },
  ebony:     { bg: '#0A0F08', surface: '#141A12', ink: '#D8D8B8', mute: '#888868', rule: '#262E1F' },
  lapis:     { bg: '#0F1838', surface: '#1A2348', ink: '#E0D8A8', mute: '#9098B8', rule: '#28336A' },
  quartz:    { bg: '#D8D4C8', surface: '#C8C4B8', ink: '#1A1A14', mute: '#5A5848', rule: '#A8A498' },
};

function V67Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V67_BG_TONES[settings.themeColors.v67.bgTone] || V67_BG_TONES.vellum;
  const accent = settings.themeColors.v67.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const isLight = bg.startsWith('#E') || bg.startsWith('#F') || bg.startsWith('#D');
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Cormorant Garamond",var(--serif)',
    }}>
      {/* cross-hatch woodcut overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px 4px), repeating-linear-gradient(-45deg, ${ink} 0 1px, transparent 1px 4px)`,
      }}/>

      {/* faint creature silhouette */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'><g fill='${encodeURIComponent(ink)}' stroke='${encodeURIComponent(ink)}' stroke-width='1.2' fill-opacity='0.6'><path d='M210 60 Q160 90 130 140 Q100 180 110 230 Q140 220 180 200 Q140 240 130 290 Q150 330 210 340 Q270 330 290 290 Q280 240 240 200 Q280 220 310 230 Q320 180 290 140 Q260 90 210 60 Z'/><circle cx='180' cy='150' r='5' fill='${encodeURIComponent(ink)}'/><circle cx='240' cy='150' r='5' fill='${encodeURIComponent(ink)}'/></g></svg>")`,
        backgroundPosition: 'center 38%', backgroundRepeat: 'no-repeat', backgroundSize: '380px',
      }}/>

      <article style={{ maxWidth: 660, margin: '0 auto', padding: '50px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* plate label corner */}
        <div style={{
          position: 'absolute', top: 30, right: 30, padding: '4px 8px',
          border: `1.5px solid ${ink}`, fontSize: 9, fontWeight: 800, letterSpacing: '0.3em',
          fontFamily: '"Courier New",monospace', color: ink, background: surface,
        }}>
          PLATE № {String(chapterIdx + 1).padStart(2, '0')}
        </div>

        {/* catalog header */}
        <div style={{
          fontSize: 10, color: mute, letterSpacing: '0.4em', fontWeight: 700,
          textTransform: 'uppercase', marginBottom: 6,
          fontFamily: 'var(--serif)',
        }}>
          A Catalogue of Curiosities · Vol. {Math.floor(chapterIdx / 10) + 1}
        </div>
        <div style={{ height: 1.5, background: ink, marginBottom: 14 }}/>

        {/* Latin binomial as italic subtitle */}
        <div style={{
          fontFamily: 'var(--serif)', fontStyle: 'italic',
          fontSize: 12, color: mute, marginBottom: 4, letterSpacing: '0.05em',
        }}>
          fig. {chapterIdx + 1} · specimen colligi anno {1700 + chapterIdx}
        </div>

        {/* title — engraved label style */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
          margin: '4px 0 12px', letterSpacing: '0.06em', color: ink,
          textTransform: 'uppercase', borderBottom: `0.5px solid ${ink}`, paddingBottom: 10,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* description label — like museum tag */}
        <div style={{
          fontSize: 10, color: mute, letterSpacing: '0.3em', fontWeight: 700,
          marginBottom: 22,
        }}>
          DESCRIPTIO ⸻ HABITUS ⸻ MORES
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* curator's note */}
        <div style={{
          marginTop: 32, padding: '14px 16px',
          borderLeft: `3px solid ${accent}`, background: surface,
          fontStyle: 'italic', fontSize: 12, color: mute, lineHeight: 1.6,
        }}>
          <strong style={{ color: ink, fontStyle: 'normal', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 10 }}>
            Curator's Note
          </strong>
          <div style={{ marginTop: 4 }}>
            Specimen {chapterIdx + 1} of {total}. Catalogued by {book.author || 'an unknown taxonomist'}.
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← prior plate</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: ink, color: bg, border: `1px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12, fontWeight: 600,
          }}>next plate →</button>
        </div>
      </article>
    </main>
  );
}

function V67Footer({ book, chapterIdx, settings }) {
  const tone = V67_BG_TONES[settings.themeColors.v67.bgTone] || V67_BG_TONES.vellum;
  const accent = settings.themeColors.v67.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `1.5px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.2em',
    }}>
      <span style={{ color: tone.ink, fontWeight: 700 }}>plate {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule || tone.mute, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>fig. {chapterIdx + 1}</span>
    </div>
  );
}

window.V67Reader = V67Reader;
window.V67Footer = V67Footer;
