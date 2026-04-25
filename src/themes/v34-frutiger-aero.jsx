// src/themes/v34-frutiger-aero.jsx — Y2K Frutiger Aero: blue sky + crystal glass bubbles + grass + glossy 3D book
const V34_BG_TONES = {
  sky:        { bg1: '#B8E3FF', bg2: '#E8F4FF', bg3: '#CBEE5A', bg4: '#7BD46B' },
  sunrise:    { bg1: '#FFD0B8', bg2: '#FFEACE', bg3: '#FFC758', bg4: '#FF8C5A' },
  ocean:      { bg1: '#A8D8E8', bg2: '#E0F0F8', bg3: '#7EC0D4', bg4: '#3A8AA8' },
  meadow:     { bg1: '#D8F0B8', bg2: '#F0FAD8', bg3: '#A8D880', bg4: '#5EAA38' },
  twilight:   { bg1: '#A8B8E8', bg2: '#E0E8F8', bg3: '#9CADE0', bg4: '#5878C8' },
  candy:      { bg1: '#FFC0E0', bg2: '#FFE5F4', bg3: '#FF9CC8', bg4: '#E85AB0' },
  forest:     { bg1: '#C0E0C8', bg2: '#E5F2E8', bg3: '#9AD0A4', bg4: '#5EA070' },
  desert:     { bg1: '#F0E0B8', bg2: '#F8F0D8', bg3: '#E0C088', bg4: '#B89058' },
  arctic:     { bg1: '#D0E8F0', bg2: '#EAF4F8', bg3: '#A8C8D8', bg4: '#7898A8' },
};

function V34Bubble({ x, y, r, delay = 0 }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y, width: r * 2, height: r * 2, borderRadius: '50%',
      background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0 8%, rgba(200,230,255,0.6) 25%, rgba(100,170,240,0.4) 60%, rgba(50,120,200,0.2) 100%)',
      boxShadow: 'inset 0 0 12px rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.12)',
      animation: `v34-float ${6 + delay}s ease-in-out infinite`, pointerEvents: 'none',
    }}/>
  );
}

function V34Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V34_BG_TONES[settings.themeColors.v34.bgTone] || V34_BG_TONES.sky;
  const { bg1, bg2, bg3, bg4 } = tone;
  const accent = settings.themeColors.v34.accent;
  const ink = '#1A3B5C', mute = 'rgba(26,59,92,0.55)', soft = 'rgba(26,59,92,0.85)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `linear-gradient(180deg, ${bg1} 0%, ${bg2} 55%, ${bg3} 80%, ${bg4} 100%)`,
      color: ink, fontFamily: '"Inter","Noto Sans TC",system-ui,sans-serif', padding: 0, position: 'relative',
    }}>
      <div style={{ position: 'relative', minHeight: '100%', boxSizing: 'border-box' }}>
        {/* clouds */}
        <div style={{ position: 'absolute', left: 80, top: 40, width: 120, height: 50, background: 'radial-gradient(ellipse, #fff 0%, rgba(255,255,255,0) 70%)', filter: 'blur(2px)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', right: 120, top: 90, width: 160, height: 60, background: 'radial-gradient(ellipse, #fff 0%, rgba(255,255,255,0) 70%)', filter: 'blur(2px)', pointerEvents: 'none' }}/>
        {/* bubbles */}
        <V34Bubble x={40} y={220} r={36}/>
        <V34Bubble x={780} y={140} r={30} delay={1}/>
        <V34Bubble x={120} y={560} r={42} delay={0.5}/>

        <header style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', gap: 14, position: 'relative', zIndex: 2 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: `linear-gradient(135deg, #fff 0%, ${accent} 60%, #3476C8 100%)`,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9), 0 4px 12px rgba(0,0,0,0.2)',
            display: 'grid', placeItems: 'center', fontFamily: '"Noto Serif TC",serif', fontSize: 26, fontWeight: 600, color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>{(book.title || '書').charAt(0)}</div>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 600, letterSpacing: '0.04em',
              background: `linear-gradient(180deg, #fff 0%, ${accent} 100%)`,
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(26,59,92,0.15)',
            }}>{book.title}</div>
            <div style={{ fontSize: 11, color: soft, letterSpacing: '0.2em' }}>
              READ ANYWHERE · ALWAYS FRESH
            </div>
          </div>
        </header>

        <div style={{ padding: '12px 40px 60px', position: 'relative', zIndex: 2 }}>
          <div style={{
            padding: 24, borderRadius: 24, maxWidth: 760, margin: '0 auto',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(220,240,255,0.65) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.95), 0 10px 28px rgba(26,59,92,0.2)',
            border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(14px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{
                padding: '3px 10px', borderRadius: 999,
                background: `linear-gradient(180deg, #fff 0%, ${bg4} 100%)`,
                fontSize: 10, color: '#1A3B12', fontWeight: 700, letterSpacing: '0.2em',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
              }}>CHAPTER · {String(chapterIdx + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: settings.tweaks.fontSize + 6, fontWeight: 600, color: ink, letterSpacing: '0.04em', fontFamily: '"Noto Serif TC",serif' }}>
                {stripChapterPrefix(chapterTitle)}
              </div>
            </div>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
              fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : '"Inter","Noto Sans TC",system-ui,sans-serif',
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22, paddingTop: 16, borderTop: `1px solid rgba(26,59,92,0.15)` }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 999,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(180,220,255,0.55) 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.1)',
                color: ink, border: '1px solid rgba(255,255,255,0.8)', fontFamily: 'inherit', fontWeight: 600,
              }}>‹ Previous</button>
              <button onClick={onNext} disabled={!canNext} style={{
                ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 999,
                background: `linear-gradient(180deg, #fff 0%, ${bg4} 100%)`,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 2px 4px rgba(0,0,0,0.1)',
                color: '#1A3B12', border: '1px solid rgba(255,255,255,0.8)', fontFamily: 'inherit', fontWeight: 700,
              }}>Next ›</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes v34-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }`}</style>
    </main>
  );
}

function V34Footer({ book, chapterIdx, settings }) {
  const tone = V34_BG_TONES[settings.themeColors.v34.bgTone] || V34_BG_TONES.sky;
  const accent = settings.themeColors.v34.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: `linear-gradient(180deg, ${tone.bg2} 0%, ${tone.bg1} 100%)`,
      color: '#1A3B5C', borderTop: '1px solid rgba(255,255,255,0.6)',
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter","Noto Sans TC",sans-serif', fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ letterSpacing: '0.18em' }}>CH {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'rgba(100,170,240,0.2)', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${tone.bg4} 0%, ${tone.bg3} 100%)`, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)' }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V34Reader = V34Reader;
window.V34Footer = V34Footer;
