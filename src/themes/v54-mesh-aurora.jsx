// src/themes/v54-mesh-aurora.jsx — Stripe/Linear-style mesh aurora: flowing iridescent gradient + frosted glass body card
const V54_BG_TONES = {
  aurora:    { c1: '#7C3AED', c2: '#EC4899', c3: '#06B6D4', c4: '#FBBF24', ink: '#0F0F23', surface: '#FFFFFF' },
  ocean:     { c1: '#0EA5E9', c2: '#22D3EE', c3: '#A78BFA', c4: '#F472B6', ink: '#0A1929', surface: '#FFFFFF' },
  sunrise:   { c1: '#F97316', c2: '#FBBF24', c3: '#EC4899', c4: '#A78BFA', ink: '#1A0F08', surface: '#FFFFFF' },
  emerald:   { c1: '#10B981', c2: '#06B6D4', c3: '#A78BFA', c4: '#FBBF24', ink: '#0A1A14', surface: '#FFFFFF' },
  candy:     { c1: '#F472B6', c2: '#A78BFA', c3: '#22D3EE', c4: '#FBBF24', ink: '#1A0820', surface: '#FFFFFF' },
  twilight:  { c1: '#3B82F6', c2: '#8B5CF6', c3: '#EC4899', c4: '#F59E0B', ink: '#0A0F2A', surface: '#FFFFFF' },
  midnight:  { c1: '#1E1B4B', c2: '#312E81', c3: '#7C3AED', c4: '#EC4899', ink: '#F0F0FF', surface: 'rgba(15,15,40,0.65)' },
  noir:      { c1: '#0F172A', c2: '#1E293B', c3: '#475569', c4: '#94A3B8', ink: '#F8FAFC', surface: 'rgba(15,23,42,0.65)' },
  abyss:     { c1: '#0C0A1F', c2: '#1A1240', c3: '#3A1F70', c4: '#7C3AED', ink: '#F0E8FF', surface: 'rgba(20,12,50,0.7)' },
};

function V54Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V54_BG_TONES[settings.themeColors.v54.bgTone] || V54_BG_TONES.aurora;
  const { c1, c2, c3, c4, ink, surface } = tone;
  const accent = settings.themeColors.v54.accent;
  const isDark = ink === '#F0F0FF' || ink === '#F8FAFC' || ink === '#F0E8FF';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, position: 'relative', padding: 0,
      fontFamily: '"Inter","Noto Sans TC",system-ui,sans-serif',
      background: `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`,
    }}>
      {/* Animated mesh gradient layer */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 25%, ${c3}aa 0%, transparent 55%),
          radial-gradient(ellipse 70% 50% at 80% 70%, ${c4}aa 0%, transparent 55%),
          radial-gradient(ellipse 60% 40% at 70% 20%, ${c2}cc 0%, transparent 50%),
          radial-gradient(ellipse 70% 50% at 20% 80%, ${c1}cc 0%, transparent 55%)`,
        animation: 'v54-drift 18s ease-in-out infinite alternate',
      }}/>

      <div style={{ position: 'relative', zIndex: 1, padding: '40px 32px 60px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* glassy chapter chip */}
          <div style={{
            padding: '12px 20px', marginBottom: 28, borderRadius: 14,
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.5)',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.8)',
            display: 'inline-flex', alignItems: 'center', gap: 12,
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.12)',
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 8,
              background: `linear-gradient(135deg, ${c3}, ${c4})`,
              boxShadow: `0 0 12px ${c3}88`,
            }}/>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 600, color: ink, textTransform: 'uppercase' }}>
              Chapter {String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </div>
          </div>

          {/* huge title */}
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 28, fontWeight: 700,
            margin: '0 0 36px', lineHeight: 1.1, letterSpacing: '-0.02em', color: ink,
            textShadow: isDark ? '0 2px 16px rgba(0,0,0,0.4)' : '0 2px 16px rgba(255,255,255,0.4)',
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          {/* frosted body card */}
          <div style={{
            padding: '36px 40px', borderRadius: 24,
            background: isDark ? 'rgba(15,15,40,0.55)' : 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(24px) saturate(150%)', WebkitBackdropFilter: 'blur(24px) saturate(150%)',
            border: isDark ? '1px solid rgba(255,255,255,0.10)' : '1px solid rgba(255,255,255,0.7)',
            boxShadow: isDark ? '0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 16px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7)',
          }}>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'inherit',
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 24, borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)' }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                opacity: canPrev ? 1 : 0.35, padding: '10px 18px', borderRadius: 12,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)', color: ink,
                border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)',
                fontFamily: 'inherit', fontWeight: 600, fontSize: 13, letterSpacing: '0.06em', cursor: canPrev ? 'pointer' : 'default',
                backdropFilter: 'blur(8px)',
              }}>← Previous</button>
              <button onClick={onNext} disabled={!canNext} style={{
                opacity: canNext ? 1 : 0.35, padding: '10px 18px', borderRadius: 12,
                background: `linear-gradient(135deg, ${c2}, ${c3})`, color: '#FFFFFF',
                border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
                cursor: canNext ? 'pointer' : 'default',
                boxShadow: `0 8px 24px ${c2}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
              }}>Next →</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes v54-drift { 0% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-3%, 2%) rotate(0.5deg); } 100% { transform: translate(2%, -3%) rotate(-0.5deg); } }`}</style>
    </main>
  );
}

function V54Footer({ book, chapterIdx, settings }) {
  const tone = V54_BG_TONES[settings.themeColors.v54.bgTone] || V54_BG_TONES.aurora;
  const accent = settings.themeColors.v54.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const isDark = tone.ink === '#F0F0FF' || tone.ink === '#F8FAFC' || tone.ink === '#F0E8FF';
  return (
    <div style={{
      padding: '10px 28px', background: tone.c1, color: tone.ink,
      backgroundImage: `linear-gradient(90deg, ${tone.c1}, ${tone.c2})`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter",system-ui,sans-serif', fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.15)' }}>Ch {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.25)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(90deg, ${tone.c3}, ${tone.c4})` }}/>
      </div>
      <span style={{ fontWeight: 700, textShadow: isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.15)' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V54Reader = V54Reader;
window.V54Footer = V54Footer;
