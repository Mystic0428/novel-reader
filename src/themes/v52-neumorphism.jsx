// src/themes/v52-neumorphism.jsx — Soft UI: monochrome pastel base, dual highlight+shadow embossed surfaces, no borders
const V52_BG_TONES = {
  pearl:   { bg: '#E8ECF0', light: '#FFFFFF', shadow: '#A3B1C6', ink: '#2A3340' },
  cream:   { bg: '#EFE8DC', light: '#FFF9EE', shadow: '#B8AE9A', ink: '#3A3528' },
  mint:    { bg: '#DCE8E2', light: '#F0F8F2', shadow: '#9AB0A4', ink: '#1F3328' },
  blush:   { bg: '#EDDFDC', light: '#FAF0EE', shadow: '#B89E9A', ink: '#3A2828' },
  lilac:   { bg: '#E2DCEC', light: '#F2EEFA', shadow: '#9E9AB8', ink: '#2A2840' },
  sky:     { bg: '#DAE8F0', bg2: '#E8F0F6', light: '#F0F8FC', shadow: '#9AB0C4', ink: '#1F2E3D' },
  peach:   { bg: '#F2E2D0', light: '#FAEFE2', shadow: '#C0A488', ink: '#3D2A1A' },
  graphite:{ bg: '#2A2E36', light: '#3A3F4A', shadow: '#15181E', ink: '#E0E5EE' },
  midnight:{ bg: '#1F2430', light: '#2E3442', shadow: '#0F1218', ink: '#D8E0EC' },
};

function V52Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V52_BG_TONES[settings.themeColors.v52.bgTone] || V52_BG_TONES.pearl;
  const { bg, light, shadow, ink } = tone;
  const accent = settings.themeColors.v52.accent;
  const isDark = ink === '#E0E5EE' || ink === '#D8E0EC';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  // Convex (raised) shadow stack — light from top-left, shadow bottom-right
  const convex = `-6px -6px 14px ${light}, 6px 6px 14px ${shadow}`;
  // Concave (pressed/inset)
  const concave = `inset -4px -4px 10px ${light}, inset 4px 4px 10px ${shadow}`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: '"Inter","Noto Sans TC",system-ui,sans-serif',
      padding: '40px 32px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* convex chapter pill */}
        <div style={{
          padding: '14px 22px', marginBottom: 24, borderRadius: 22,
          background: bg, boxShadow: convex,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 22,
            background: bg, boxShadow: concave,
            display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 14, color: accent,
          }}>{chapterIdx + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 600, color: ink, opacity: 0.55, textTransform: 'uppercase' }}>
              Chapter {chapterIdx + 1} / {total}
            </div>
            <div style={{ fontSize: settings.tweaks.fontSize + 4, fontWeight: 600, lineHeight: 1.25, marginTop: 2, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
          </div>
        </div>

        {/* concave progress bar */}
        <div style={{
          height: 14, padding: 3, marginBottom: 28, borderRadius: 999,
          background: bg, boxShadow: concave,
        }}>
          <div style={{
            width: `${progress * 100}%`, height: '100%', borderRadius: 999,
            background: `linear-gradient(135deg, ${accent}, ${accent}aa)`,
            boxShadow: `inset 0 1px 0 ${light}88, 0 1px 2px rgba(0,0,0,0.15)`,
            transition: 'width 0.4s ease-out',
          }}/>
        </div>

        {/* convex body card */}
        <div style={{
          padding: '32px 36px', borderRadius: 28,
          background: bg, boxShadow: convex,
        }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'inherit',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32 }}>
            <button onClick={onPrev} disabled={!canPrev} style={{
              opacity: canPrev ? 1 : 0.35, padding: '12px 22px', borderRadius: 18,
              background: bg, color: ink, border: 'none', boxShadow: convex,
              fontFamily: 'inherit', fontWeight: 600, fontSize: 13, letterSpacing: '0.08em', cursor: canPrev ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s ease',
            }}
              onMouseDown={(e) => { if (canPrev) e.currentTarget.style.boxShadow = concave; }}
              onMouseUp={(e) => { if (canPrev) e.currentTarget.style.boxShadow = convex; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = convex; }}
            >← Previous</button>
            <button onClick={onNext} disabled={!canNext} style={{
              opacity: canNext ? 1 : 0.35, padding: '12px 22px', borderRadius: 18,
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`, color: isDark ? '#1F2430' : '#FAFCFF',
              border: 'none', boxShadow: `${convex}, inset 0 1px 0 ${light}66`,
              fontFamily: 'inherit', fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', cursor: canNext ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s ease',
            }}
              onMouseDown={(e) => { if (canNext) e.currentTarget.style.boxShadow = `${concave}, inset 0 1px 0 ${light}66`; }}
              onMouseUp={(e) => { if (canNext) e.currentTarget.style.boxShadow = `${convex}, inset 0 1px 0 ${light}66`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `${convex}, inset 0 1px 0 ${light}66`; }}
            >Next →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V52Footer({ book, chapterIdx, settings }) {
  const tone = V52_BG_TONES[settings.themeColors.v52.bgTone] || V52_BG_TONES.pearl;
  const accent = settings.themeColors.v52.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const concave = `inset -3px -3px 6px ${tone.light}, inset 3px 3px 6px ${tone.shadow}`;
  return (
    <div style={{
      padding: '12px 28px', background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter",system-ui,sans-serif', fontSize: 11, fontWeight: 600,
    }}>
      <span style={{ letterSpacing: '0.18em', opacity: 0.7 }}>CH {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 8, padding: 2, borderRadius: 999, background: tone.bg, boxShadow: concave }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${accent}, ${accent}cc)` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V52Reader = V52Reader;
window.V52Footer = V52Footer;
