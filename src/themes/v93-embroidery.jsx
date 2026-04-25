// src/themes/v93-embroidery.jsx — Nordic cross-stitch: linen bg, pixel-grid border, folk pattern, soft fabric feel
const V93_BG_TONES = {
  linen:    { bg: '#E8DCC0', card: '#F0E4C8', ink: '#2A1F10', mute: '#6B5028', rule: '#A88858', accent: '#A82820' },
  navy:     { bg: '#0F1F38', card: '#1A2A48', ink: '#E0DCC0', mute: '#9098B8', rule: '#2A3A5A', accent: '#E8C868' },
  red:      { bg: '#3A0F14', card: '#4A1A20', ink: '#F0DCC0', mute: '#C09858', rule: '#5A2028', accent: '#FFD848' },
  sage:     { bg: '#2A3A28', card: '#384A38', ink: '#E0E8C0', mute: '#9CB088', rule: '#48583A', accent: '#FFB454' },
  plum:     { bg: '#2A1A38', card: '#382A48', ink: '#E0D0E8', mute: '#A088B8', rule: '#3A2A50', accent: '#E8B848' },
  mustard:  { bg: '#28200A', card: '#3A2F18', ink: '#F0DCB0', mute: '#B89058', rule: '#4A3818', accent: '#E84838' },
  slate:    { bg: '#28282E', card: '#383840', ink: '#E0DCC0', mute: '#9090A0', rule: '#48485A', accent: '#FFA838' },
  bone:     { bg: '#F0E8D0', card: '#FFFCEC', ink: '#1A1408', mute: '#5A4828', rule: '#A88858', accent: '#88283A' },
  twilight: { bg: '#1F1828', card: '#2A2438', ink: '#E0D8E0', mute: '#9888A8', rule: '#3A2A48', accent: '#FFA848' },
};

function V93StitchBorder({ accent, opacity }) {
  // 8-bit cross-stitch pattern as repeating SVG
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32'><g fill='${encodeURIComponent(accent)}'><rect x='4' y='4' width='4' height='4'/><rect x='12' y='4' width='4' height='4'/><rect x='20' y='4' width='4' height='4'/><rect x='8' y='12' width='4' height='4'/><rect x='16' y='12' width='4' height='4'/><rect x='4' y='20' width='4' height='4'/><rect x='12' y='20' width='4' height='4'/><rect x='20' y='20' width='4' height='4'/></g></svg>")`,
    }}/>
  );
}

function V93Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V93_BG_TONES[settings.themeColors.v93.bgTone] || V93_BG_TONES.linen;
  const accent = settings.themeColors.v93.accent;
  const { bg, card, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      {/* linen weave texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'overlay',
        backgroundImage: `repeating-linear-gradient(0deg, transparent 0 1px, ${ink}22 1px 2px), repeating-linear-gradient(90deg, transparent 0 1px, ${ink}22 1px 2px)`,
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* embroidery hoop frame */}
        <div style={{
          padding: '40px 36px 36px', background: card, color: ink,
          border: `4px solid ${accent}`, borderRadius: 4,
          boxShadow: `inset 0 0 0 1px ${ink}, 0 8px 24px rgba(0,0,0,0.15)`,
          position: 'relative',
        }}>
          {/* cross-stitch border decoration */}
          <V93StitchBorder accent={accent} opacity={0.12}/>

          {/* embroidered title block */}
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 11, color: accent,
            letterSpacing: '0.5em', fontWeight: 800, textAlign: 'center', marginBottom: 6,
          }}>
            ✿ STITCH № {chapterIdx + 1} of {total} ✿
          </div>

          <h1 style={{
            fontFamily: '"Noto Serif TC","Cormorant Garamond",serif', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
            textAlign: 'center', margin: '4px 0 8px', letterSpacing: '0.04em', color: ink,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
            letterSpacing: '0.2em', marginBottom: 22,
          }}>
            ──── stitched by {book.author || 'unknown hands'} ────
          </div>

          {/* folk pattern divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
            marginBottom: 24, color: accent, fontSize: 14, letterSpacing: '0.1em',
          }}>
            ✦ ❀ ✦ ❀ ✦ ❀ ✦
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* finishing knot */}
          <div style={{
            textAlign: 'center', marginTop: 26, color: accent, fontSize: 16, letterSpacing: '0.5em',
          }}>
            ✦ ❀ ✦
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: ink, border: `2px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12,
          }}>← prev stitch</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: accent, color: card, border: `2px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12, fontWeight: 700,
          }}>next stitch →</button>
        </div>
      </article>
    </main>
  );
}

function V93Footer({ book, chapterIdx, settings }) {
  const tone = V93_BG_TONES[settings.themeColors.v93.bgTone] || V93_BG_TONES.linen;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `2px solid ${tone.accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.3em',
    }}>
      <span style={{ color: tone.accent }}>✿ stitch {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V93Reader = V93Reader;
window.V93Footer = V93Footer;
