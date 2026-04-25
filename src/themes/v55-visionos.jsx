// src/themes/v55-visionos.jsx — Apple Vision Pro / spatial UI: deep blurred ambient bg, translucent depth-layered cards, ambient blobs
const V55_BG_TONES = {
  cosmos:    { ambient1: '#1A0F2E', ambient2: '#2A1F4E', blob1: '#7C3AED', blob2: '#06B6D4', ink: '#F5F5FA' },
  ocean:     { ambient1: '#0A1F3D', ambient2: '#0F2E5A', blob1: '#0EA5E9', blob2: '#22D3EE', ink: '#F0F8FF' },
  forest:    { ambient1: '#0A1F1A', ambient2: '#0F2E26', blob1: '#10B981', blob2: '#84CC16', ink: '#F0FAF0' },
  sunset:    { ambient1: '#2A0F1A', ambient2: '#4E1F2A', blob1: '#F97316', blob2: '#FBBF24', ink: '#FFF8E8' },
  rose:      { ambient1: '#2A0F1F', ambient2: '#4E1F38', blob1: '#EC4899', blob2: '#F472B6', ink: '#FFF0F8' },
  graphite:  { ambient1: '#0A0A0A', ambient2: '#1A1A1A', blob1: '#525252', blob2: '#A3A3A3', ink: '#F5F5F5' },
  ember:     { ambient1: '#1A0A0A', ambient2: '#2E1414', blob1: '#DC2626', blob2: '#F59E0B', ink: '#FFF0E8' },
  arctic:    { ambient1: '#1A2030', ambient2: '#2A3040', blob1: '#A5F3FC', blob2: '#DDD6FE', ink: '#F0F8FF' },
  void:      { ambient1: '#000000', ambient2: '#0A0A14', blob1: '#1E1B4B', blob2: '#3730A3', ink: '#E0E0FF' },
};

function V55Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V55_BG_TONES[settings.themeColors.v55.bgTone] || V55_BG_TONES.cosmos;
  const { ambient1, ambient2, blob1, blob2, ink } = tone;
  const accent = settings.themeColors.v55.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, position: 'relative', padding: 0,
      fontFamily: '"SF Pro Display","Inter","Noto Sans TC",system-ui,-apple-system,sans-serif',
      background: `radial-gradient(ellipse at 50% 30%, ${ambient2} 0%, ${ambient1} 100%)`,
    }}>
      {/* Ambient blob 1 — drifting blue/purple haze */}
      <div style={{
        position: 'fixed', left: '-15%', top: '10%', width: '60%', height: '60%',
        borderRadius: '50%', background: blob1, filter: 'blur(120px)', opacity: 0.45,
        pointerEvents: 'none', zIndex: 0, animation: 'v55-blob1 22s ease-in-out infinite alternate',
      }}/>
      {/* Ambient blob 2 — drifting from right */}
      <div style={{
        position: 'fixed', right: '-10%', bottom: '5%', width: '55%', height: '55%',
        borderRadius: '50%', background: blob2, filter: 'blur(120px)', opacity: 0.40,
        pointerEvents: 'none', zIndex: 0, animation: 'v55-blob2 26s ease-in-out infinite alternate',
      }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '48px 32px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Floating chapter pill (inner layer — slight shadow for depth) */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 18px', marginBottom: 24,
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            backdropFilter: 'blur(40px) saturate(180%)', WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: blob1, boxShadow: `0 0 10px ${blob1}aa` }}/>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.16em', color: ink, opacity: 0.92, textTransform: 'uppercase' }}>
              Chapter {chapterIdx + 1} of {total}
            </span>
          </div>

          {/* Title — floating in deeper layer */}
          <h1 style={{
            fontFamily: '"SF Pro Display","Inter",sans-serif',
            fontSize: settings.tweaks.fontSize + 30, fontWeight: 600,
            margin: '0 0 40px', lineHeight: 1.08, letterSpacing: '-0.025em', color: ink,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          {/* Body card — frontmost layer, heavy blur, subtle border */}
          <div style={{
            padding: '36px 40px', borderRadius: 28,
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(60px) saturate(180%)', WebkitBackdropFilter: 'blur(60px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: `
              0 24px 48px rgba(0,0,0,0.45),
              0 4px 12px rgba(0,0,0,0.25),
              inset 0 1px 0 rgba(255,255,255,0.15),
              inset 0 -1px 0 rgba(0,0,0,0.2)
            `,
          }}>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'inherit',
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.10)' }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                opacity: canPrev ? 1 : 0.3, padding: '11px 22px', borderRadius: 999,
                background: 'rgba(255,255,255,0.10)', color: ink,
                border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 13, letterSpacing: '0.04em',
                cursor: canPrev ? 'pointer' : 'default',
                boxShadow: '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}>← Previous</button>
              <button onClick={onNext} disabled={!canNext} style={{
                opacity: canNext ? 1 : 0.3, padding: '11px 22px', borderRadius: 999,
                background: `linear-gradient(135deg, ${blob1}cc, ${blob2}cc)`, color: '#FFFFFF',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
                cursor: canNext ? 'pointer' : 'default',
                boxShadow: `0 6px 24px ${blob1}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
              }}>Next →</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes v55-blob1 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(8%,-3%) scale(1.05); } }
        @keyframes v55-blob2 { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(-6%,4%) scale(0.95); } }
      `}</style>
    </main>
  );
}

function V55Footer({ book, chapterIdx, settings }) {
  const tone = V55_BG_TONES[settings.themeColors.v55.bgTone] || V55_BG_TONES.cosmos;
  const accent = settings.themeColors.v55.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.ambient1, color: tone.ink,
      borderTop: '1px solid rgba(255,255,255,0.10)',
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"SF Pro Display","Inter",system-ui,sans-serif', fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ letterSpacing: '0.16em', opacity: 0.85, textTransform: 'uppercase' }}>Ch {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 3, borderRadius: 999, background: 'rgba(255,255,255,0.10)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(90deg, ${tone.blob1}, ${tone.blob2})`, boxShadow: `0 0 8px ${tone.blob1}88` }}/>
      </div>
      <span style={{ fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V55Reader = V55Reader;
window.V55Footer = V55Footer;
