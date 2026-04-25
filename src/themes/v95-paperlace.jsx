// src/themes/v95-paperlace.jsx — Chinese paper-cut / lace doily: red-on-white, symmetric cutout silhouettes
const V95_BG_TONES = {
  snow:     { bg: '#FAFAF4', card: '#FFFFFF', ink: '#1A1408', mute: '#787058', rule: '#A8A498', accent: '#C8242C' },
  red:      { bg: '#C8242C', card: '#E8DCC0', ink: '#1A0808', mute: '#5A1818', rule: '#882828', accent: '#FFD848' },
  goldleaf: { bg: '#1A1408', card: '#F8E8C8', ink: '#1A0F08', mute: '#6B5028', rule: '#A88848', accent: '#FFC848' },
  sage:     { bg: '#3A4830', card: '#F0E8D0', ink: '#1A1408', mute: '#5A6848', rule: '#A8B898', accent: '#88283A' },
  midnight: { bg: '#0A0A1A', card: '#F0E8D0', ink: '#0A0814', mute: '#7088A0', rule: '#A8B0C8', accent: '#C8242C' },
  cream:    { bg: '#FFF4DC', card: '#FFFCEC', ink: '#3A2818', mute: '#8B6838', rule: '#B89868', accent: '#C8242C' },
  ivory:    { bg: '#F8F0DC', card: '#FFFFFF', ink: '#1A1408', mute: '#5A4828', rule: '#A88858', accent: '#88283A' },
  crimson:  { bg: '#48141C', card: '#F0E0CC', ink: '#1A0808', mute: '#7A2828', rule: '#A85040', accent: '#FFD848' },
  plum:     { bg: '#28182A', card: '#F0E0E8', ink: '#28083A', mute: '#7858A0', rule: '#A878A0', accent: '#C8242C' },
};

function V95LaceFrame({ accent, opacity }) {
  // Symmetric cut-paper border pattern
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><g fill='${encodeURIComponent(accent)}'><path d='M40 8 Q48 16 56 24 Q48 32 40 40 Q32 32 24 24 Q32 16 40 8 Z'/><circle cx='40' cy='8' r='2'/><circle cx='40' cy='40' r='2'/><circle cx='8' cy='24' r='1.5'/><circle cx='72' cy='24' r='1.5'/><path d='M40 50 L44 56 L40 62 L36 56 Z'/><path d='M20 60 L24 66 L20 72 L16 66 Z'/><path d='M60 60 L64 66 L60 72 L56 66 Z'/></g></svg>")`,
    }}/>
  );
}

function V95Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V95_BG_TONES[settings.themeColors.v95.bgTone] || V95_BG_TONES.snow;
  const accent = settings.themeColors.v95.accent;
  const { bg, card, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","Noto Serif TC",serif',
    }}>
      <V95LaceFrame accent={accent} opacity={0.06}/>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* paper-cut card */}
        <div style={{
          background: card, color: ink, padding: '36px 38px',
          position: 'relative',
          boxShadow: `0 12px 32px rgba(0,0,0,0.18)`,
        }}>
          {/* lace edges along top + bottom */}
          <div style={{
            position: 'absolute', top: -8, left: 0, right: 0, height: 16,
            backgroundImage: `radial-gradient(circle at 8px 8px, transparent 6px, ${card} 7px)`,
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }}/>
          <div style={{
            position: 'absolute', bottom: -8, left: 0, right: 0, height: 16,
            backgroundImage: `radial-gradient(circle at 8px 8px, transparent 6px, ${card} 7px)`,
            backgroundSize: '16px 16px',
            pointerEvents: 'none',
          }}/>

          {/* paper-cut symbol header */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span style={{
              display: 'inline-block', fontSize: 32, color: accent,
              transform: 'scaleY(0.9)', letterSpacing: '0.2em',
            }}>❀ ✿ ❀</span>
          </div>

          <div style={{
            fontSize: 11, color: accent, letterSpacing: '0.5em', fontWeight: 700,
            textAlign: 'center', marginBottom: 6,
          }}>
            ✦ 第 {chapterIdx + 1} 剪 / 共 {total} ✦
          </div>

          <h1 style={{
            fontFamily: '"Noto Serif TC","Songti TC",serif', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
            textAlign: 'center', margin: '4px 0 12px', letterSpacing: '0.06em', color: ink,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
            letterSpacing: '0.25em', marginBottom: 24,
          }}>
            ─ 剪紙 · {book.author || '無名匠'} ─
          </div>

          {/* symmetric lace divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            marginBottom: 26, color: accent, fontSize: 14,
          }}>
            <span>❀</span><span>•</span><span>✦</span><span>•</span><span>❀</span><span>•</span><span>✦</span><span>•</span><span>❀</span>
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: '"Noto Serif TC",serif', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* finishing emblem */}
          <div style={{
            textAlign: 'center', marginTop: 28, color: accent, fontSize: 18, letterSpacing: '0.4em',
          }}>
            ❀
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: 'transparent', color: card, border: `1px solid ${card}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.4em', fontSize: 12,
          }}>← 前 剪</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: card, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.4em', fontSize: 12, fontWeight: 700,
          }}>後 剪 →</button>
        </div>
      </article>
    </main>
  );
}

function V95Footer({ book, chapterIdx, settings }) {
  const tone = V95_BG_TONES[settings.themeColors.v95.bgTone] || V95_BG_TONES.snow;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `1px solid ${tone.accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.3em',
    }}>
      <span style={{ color: tone.accent }}>❀ 剪 {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span style={{ color: tone.accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V95Reader = V95Reader;
window.V95Footer = V95Footer;
