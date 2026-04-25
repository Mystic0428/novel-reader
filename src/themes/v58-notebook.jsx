// src/themes/v58-notebook.jsx — Moleskine pocket notebook: black canvas cover + cream page + elastic strap + ribbon bookmark
const V58_BG_TONES = {
  black:    { cover: '#1A1A1A', cover2: '#0E0E0E', paper: '#F5EDD8', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  forest:   { cover: '#1A2A1A', cover2: '#0E1A0E', paper: '#F0E5D0', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  navy:     { cover: '#0F1828', cover2: '#080F18', paper: '#F0E5D0', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  cognac:   { cover: '#3E2418', cover2: '#241408', paper: '#F4E8C8', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  oxblood:  { cover: '#2E0E14', cover2: '#180608', paper: '#F0E5D0', ink: '#1F1F1F', ruled: 'rgba(80,90,140,0.18)' },
  graphite: { cover: '#2A2E36', cover2: '#1A1E26', paper: '#F0E5D0', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  cream:    { cover: '#D8C8A0', cover2: '#A89058', paper: '#FAF2DC', ruled: 'rgba(80,90,140,0.20)', ink: '#1F1F1F' },
  ink:      { cover: '#0A0A0A', cover2: '#000000', paper: '#F8F0D8', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
  jade:     { cover: '#0F2A28', cover2: '#081A18', paper: '#F0E5D0', ruled: 'rgba(80,90,140,0.18)', ink: '#1F1F1F' },
};

function V58Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V58_BG_TONES[settings.themeColors.v58.bgTone] || V58_BG_TONES.black;
  const { cover, cover2, paper, ruled, ink } = tone;
  const ribbon = settings.themeColors.v58.accent;
  const total = book.chaptersMeta.length;
  // Ruled paper background — horizontal lines like a notebook
  const rules = `repeating-linear-gradient(0deg, transparent 0 ${settings.tweaks.fontSize * 1.6 - 1}px, ${ruled} ${settings.tweaks.fontSize * 1.6 - 1}px ${settings.tweaks.fontSize * 1.6}px)`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, fontFamily: 'var(--serif)', padding: 0, position: 'relative', color: '#F5EDD8',
      background: `linear-gradient(135deg, ${cover} 0%, ${cover2} 100%)`,
    }}>
      {/* canvas weave on cover */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.5, zIndex: 0,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='c'><feTurbulence baseFrequency='1.2' numOctaves='1' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0'/></filter><rect width='100%25' height='100%25' filter='url(%23c)'/></svg>")`,
      }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '48px 32px 50px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          {/* spine label / cover stamp */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              display: 'inline-block', padding: '6px 18px',
              border: `1px solid ${ribbon}`, color: ribbon,
              fontSize: 10, letterSpacing: '0.4em', fontWeight: 700, textTransform: 'uppercase',
            }}>
              ✦ Notebook · Vol. {chapterIdx + 1} ✦
            </div>
          </div>

          {/* paper card — held inside the cover */}
          <div style={{ position: 'relative', paddingBottom: 8 }}>
            {/* elastic strap — diagonal across right side, behind paper */}
            <div style={{
              position: 'absolute', right: -8, top: -16, bottom: -16, width: 14,
              background: `linear-gradient(180deg, ${ink} 0%, #2E2E36 50%, ${ink} 100%)`,
              borderRadius: 4, zIndex: 0,
              boxShadow: `inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.4), 2px 0 4px rgba(0,0,0,0.4)`,
            }}/>

            <div style={{
              position: 'relative', zIndex: 1,
              background: paper, color: ink,
              padding: '40px 40px 36px', borderRadius: '2px 2px 8px 8px',
              boxShadow: `
                0 16px 40px rgba(0,0,0,0.55),
                0 2px 6px rgba(0,0,0,0.3),
                inset 0 1px 0 rgba(255,255,255,0.45)
              `,
              backgroundImage: rules,
              backgroundPosition: `0 ${settings.tweaks.fontSize * 0.4}px`,
            }}>
              {/* ribbon bookmark — comes out from top */}
              <div style={{
                position: 'absolute', right: 50, top: -2, width: 14, height: 50,
                background: ribbon, transform: 'translateY(-2px)',
                clipPath: 'polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)',
                boxShadow: `inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.3)`,
              }}/>

              {/* date stamp — handwritten feel */}
              <div style={{
                fontFamily: '"Caveat","Marker Felt","Brush Script MT",cursive',
                fontSize: 16, color: ribbon, marginBottom: 4, letterSpacing: '0.05em',
              }}>
                Entry № {String(chapterIdx + 1).padStart(2, '0')}
              </div>
              <h1 style={{
                fontFamily: '"Caveat","Marker Felt","Noto Serif TC",cursive',
                fontSize: settings.tweaks.fontSize + 16, fontWeight: 600,
                margin: '0 0 18px', lineHeight: 1.15, letterSpacing: '0.02em', color: ink,
                borderBottom: `1.5px solid ${ribbon}`, paddingBottom: 8,
              }}>{stripChapterPrefix(chapterTitle)}</h1>

              <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
                fontFamily: 'var(--serif)', color: ink,
                fontSize: settings.tweaks.fontSize, lineHeight: 1.6,
                '--accent': ribbon,
              }} dangerouslySetInnerHTML={{ __html: html }}/>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 16, borderTop: `1px dashed ${ink}33` }}>
                <button onClick={onPrev} disabled={!canPrev} style={{
                  ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 14px', borderRadius: 6,
                  background: 'transparent', color: ink, border: `1px solid ${ink}66`,
                  fontFamily: '"Caveat","Marker Felt",cursive', fontSize: 16, fontStyle: 'italic',
                }}>‹ earlier entry</button>
                <button onClick={onNext} disabled={!canNext} style={{
                  ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 14px', borderRadius: 6,
                  background: ribbon, color: paper, border: `1px solid ${ribbon}`,
                  fontFamily: '"Caveat","Marker Felt",cursive', fontSize: 16, fontStyle: 'italic', fontWeight: 600,
                }}>next entry ›</button>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 10, color: ribbon, letterSpacing: '0.4em', fontStyle: 'italic', opacity: 0.7 }}>
            "in case of loss, please return to {(book.author || 'the bearer')}"
          </div>
        </div>
      </div>
    </main>
  );
}

function V58Footer({ book, chapterIdx, settings }) {
  const tone = V58_BG_TONES[settings.themeColors.v58.bgTone] || V58_BG_TONES.black;
  const ribbon = settings.themeColors.v58.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.cover2, color: '#F5EDD8',
      borderTop: `1px solid ${ribbon}33`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat","Marker Felt",cursive', fontSize: 14, fontStyle: 'italic',
    }}>
      <span style={{ color: ribbon }}>entry {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${ribbon}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: ribbon }}/>
      </div>
      <span style={{ color: ribbon }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V58Reader = V58Reader;
window.V58Footer = V58Footer;
