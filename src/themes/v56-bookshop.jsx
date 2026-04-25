// src/themes/v56-bookshop.jsx — Cozy bookshop / reading nook: warm wood + brass tungsten lamp glow + leather paper card
const V56_BG_TONES = {
  walnut:    { wood: '#3E2818', wood2: '#2A1A0E', paper: '#F0E2C0', ink: '#2A1A0C' },
  oak:       { wood: '#5A3E22', wood2: '#3E2818', paper: '#F4E8C8', ink: '#2A1A0C' },
  cherry:    { wood: '#3A1814', wood2: '#240A08', paper: '#F0E2C0', ink: '#2A1A0C' },
  cognac:    { wood: '#5A3220', wood2: '#3E1F10', paper: '#F8EDC8', ink: '#2A1A0C' },
  ebony:     { wood: '#1A100A', wood2: '#0E0805', paper: '#EDDFB8', ink: '#1A0E04' },
  espresso:  { wood: '#2A1A10', wood2: '#1A0E08', paper: '#F0E2BC', ink: '#1A0E04' },
  amber:     { wood: '#4A2818', wood2: '#2E1808', paper: '#FAEAC8', ink: '#1A0E04' },
  aged:      { wood: '#48342A', wood2: '#2E1F18', paper: '#F2E2BC', ink: '#1F140A' },
  dusk:      { wood: '#2A1F18', wood2: '#1A100C', paper: '#E8D8B0', ink: '#1A0E04' },
};

function V56Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V56_BG_TONES[settings.themeColors.v56.bgTone] || V56_BG_TONES.walnut;
  const { wood, wood2, paper, ink } = tone;
  const brass = settings.themeColors.v56.accent;
  const total = book.chaptersMeta.length;
  const mute = 'rgba(42,26,12,0.55)';
  const soft = 'rgba(42,26,12,0.78)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, fontFamily: 'var(--serif)', padding: 0, position: 'relative',
      background: `radial-gradient(ellipse at 30% 20%, ${wood} 0%, ${wood2} 70%)`,
    }}>
      {/* tungsten lamp glow — warm radial in top-left corner */}
      <div style={{
        position: 'fixed', left: '-10%', top: '-10%', width: '50%', height: '50%',
        background: `radial-gradient(circle, ${brass}33 0%, ${brass}11 30%, transparent 60%)`,
        pointerEvents: 'none', zIndex: 0,
      }}/>
      {/* wood grain texture — subtle vertical streaks */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.4, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='600'><filter id='g'><feTurbulence baseFrequency='0.02 0.6' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0.30 0'/></filter><rect width='100%25' height='100%25' filter='url(%23g)'/></svg>")`,
      }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px 48px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* brass nameplate header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26,
            padding: '10px 18px',
            background: `linear-gradient(180deg, ${brass}ee 0%, ${brass}cc 60%, ${brass}99 100%)`,
            borderRadius: 4, color: ink,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.3), 0 4px 14px rgba(0,0,0,0.4)`,
            border: `1px solid rgba(0,0,0,0.3)`,
          }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 800, textTransform: 'uppercase' }}>
              ❦ Chapter {String(chapterIdx + 1).padStart(2, '0')} of {String(total).padStart(2, '0')} ❦
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 11, fontStyle: 'italic', opacity: 0.85, letterSpacing: '0.1em' }}>
              {(book.author || 'Anonymous')}
            </div>
          </div>

          {/* leather-bound paper card */}
          <div style={{
            background: paper, color: ink,
            padding: '40px 44px',
            borderRadius: 4,
            boxShadow: `
              0 16px 40px rgba(0,0,0,0.55),
              0 4px 12px rgba(0,0,0,0.35),
              inset 0 1px 0 rgba(255,255,255,0.5),
              inset 0 0 0 1px rgba(0,0,0,0.08)
            `,
          }}>
            {/* chapter heading */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 14 }}>
                <div style={{ width: 60, height: 1, background: brass }}/>
                <div style={{ color: brass, fontSize: 14 }}>❦</div>
                <div style={{ width: 60, height: 1, background: brass }}/>
              </div>
              <h1 style={{
                fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 500,
                margin: 0, lineHeight: 1.25, letterSpacing: '0.04em', color: ink,
              }}>{stripChapterPrefix(chapterTitle)}</h1>
              <div style={{ marginTop: 14, color: brass, fontSize: 12, letterSpacing: '0.5em', fontWeight: 600 }}>
                ✦ ✦ ✦
              </div>
            </div>

            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': brass,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 22, borderTop: `1px solid ${brass}55` }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 18px',
                background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
                fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 500, letterSpacing: '0.12em',
              }}>‹ Earlier</button>
              <button onClick={onNext} disabled={!canNext} style={{
                ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 18px',
                background: `linear-gradient(180deg, ${brass}ee, ${brass}aa)`, color: wood2,
                border: `1.5px solid ${ink}`,
                fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.12em',
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.4)`,
              }}>Onward ›</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function V56Footer({ book, chapterIdx, settings }) {
  const tone = V56_BG_TONES[settings.themeColors.v56.bgTone] || V56_BG_TONES.walnut;
  const brass = settings.themeColors.v56.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.wood2, color: '#F0E2C0', borderTop: `1px solid ${brass}33`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: brass, fontWeight: 700, fontStyle: 'normal', letterSpacing: '0.3em' }}>❦ Ch. {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${brass}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: brass }}/>
      </div>
      <span style={{ color: brass, fontWeight: 700, fontStyle: 'normal' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V56Reader = V56Reader;
window.V56Footer = V56Footer;
