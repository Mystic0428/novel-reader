// src/themes/v62-rune.jsx — Norse rune-stone: carved/embossed text, triangular knots, futhark numerals
const V62_BG_TONES = {
  granite:    { bg: '#2A2D32', surface: '#363A40', ink: '#E8E2D0', mute: '#9098A0', rule: '#4A4E58' },
  fjord:      { bg: '#0A1828', surface: '#142436', ink: '#D8E4F0', mute: '#7090B0', rule: '#1F3050' },
  ice:        { bg: '#1A2530', surface: '#283442', ink: '#E0EAF0', mute: '#90A0B0', rule: '#3A4A5A' },
  ember:      { bg: '#1F1208', surface: '#2D1810', ink: '#F0DCB8', mute: '#A88450', rule: '#3A2418' },
  moss:       { bg: '#0F1F18', surface: '#1A2D24', ink: '#D8E4C8', mute: '#80A088', rule: '#1F3A2A' },
  bloodstone: { bg: '#1F0A14', surface: '#2D1220', ink: '#E8D0D8', mute: '#A07088', rule: '#3A1A28' },
  basalt:     { bg: '#1A1A1A', surface: '#262626', ink: '#D8D4C8', mute: '#8C8478', rule: '#383838' },
  midnight:   { bg: '#0A0A14', surface: '#141420', ink: '#E0E0E8', mute: '#9098B0', rule: '#1F1F2A' },
  bone:       { bg: '#DCD6BC', surface: '#CCC6AC', ink: '#1A1812', mute: '#5A5448', rule: '#A8A294' },
};

const V62_RUNE_DIGITS = ['ᛟ','ᛁ','ᛒ','ᛗ','ᚠ','ᛋ','ᚺ','ᛏ','ᛇ','ᛜ'];
function toV62Rune(n) {
  return String(n).split('').map((c) => V62_RUNE_DIGITS[parseInt(c, 10)] || c).join('');
}

function V62Knot({ color, mirror, vertical }) {
  // simple celtic/norse triskelion-style knot
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" style={{
      transform: `${mirror ? 'scaleX(-1)' : ''} ${vertical ? 'scaleY(-1)' : ''}`.trim() || 'none',
    }}>
      <g fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round">
        <path d="M28 6 L48 38 L8 38 Z"/>
        <path d="M28 14 L40 34 L16 34 Z"/>
        <circle cx="28" cy="28" r="4"/>
        <path d="M28 6 L28 14"/>
        <path d="M48 38 L40 34"/>
        <path d="M8 38 L16 34"/>
      </g>
    </svg>
  );
}

function V62Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V62_BG_TONES[settings.themeColors.v62.bgTone] || V62_BG_TONES.granite;
  const accent = settings.themeColors.v62.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const isLight = bg === '#DCD6BC';
  const carved = isLight
    ? '0 1px 0 rgba(255,255,255,0.5), 0 -1px 0 rgba(0,0,0,0.25)'
    : '0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.12)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, padding: 0, position: 'relative', color: ink,
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
      background: `linear-gradient(180deg, ${surface} 0%, ${bg} 50%, ${surface} 100%)`,
    }}>
      {/* stone-grain noise */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.18, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='r'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' seed='12'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.4 0'/></filter><rect width='100%25' height='100%25' filter='url(%23r)'/></svg>")`,
      }}/>

      {/* corner knots */}
      <div style={{ position: 'absolute', top: 16, left: 16, color: accent, opacity: 0.7 }}>
        <V62Knot color={accent}/>
      </div>
      <div style={{ position: 'absolute', top: 16, right: 16, opacity: 0.7 }}>
        <V62Knot color={accent} mirror/>
      </div>

      <article style={{ maxWidth: 700, margin: '0 auto', padding: '88px 50px 70px', position: 'relative', zIndex: 1 }}>
        {/* runic chapter banner */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            padding: '8px 22px',
            border: `1px solid ${accent}`,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.4em', color: accent,
            textTransform: 'uppercase',
          }}>
            <span style={{ fontSize: 14 }}>{toV62Rune(chapterIdx + 1)}</span>
            <span>RUNESTONE · {String(chapterIdx + 1).padStart(2, '0')}</span>
            <span style={{ fontSize: 14 }}>{toV62Rune(chapterIdx + 1)}</span>
          </div>
        </div>

        {/* embossed title */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 16, fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.15em', color: ink,
          textAlign: 'center', margin: '0 0 16px', textShadow: carved,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* triangular divider */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginBottom: 32, color: accent }}>
          <span style={{ fontSize: 12 }}>▲</span>
          <span style={{ flex: 1, maxWidth: 80, height: 1, background: accent }}/>
          <span style={{ fontSize: 18 }}>◆</span>
          <span style={{ flex: 1, maxWidth: 80, height: 1, background: accent }}/>
          <span style={{ fontSize: 12 }}>▲</span>
        </div>

        {/* body — carved into stone vibe */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textShadow: isLight ? 'none' : '0 1px 0 rgba(0,0,0,0.3)',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 36, color: accent, fontSize: 14, letterSpacing: '0.3em' }}>
          ◆ ▲ ᛟ ▲ ◆
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1px solid ${ink}40`,
            fontFamily: 'var(--serif)', letterSpacing: '0.3em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>◀ Fyrri</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.3em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>Næsta ▶</button>
        </div>
      </article>
    </main>
  );
}

function V62Footer({ book, chapterIdx, settings }) {
  const tone = V62_BG_TONES[settings.themeColors.v62.bgTone] || V62_BG_TONES.granite;
  const accent = settings.themeColors.v62.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontSize: 12, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700,
    }}>
      <span style={{ color: accent, fontSize: 14 }}>{toV62Rune(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
        {/* longship marker */}
        <div style={{
          position: 'absolute', top: -8, left: `${progress * 100}%`,
          transform: 'translateX(-50%)', color: accent, fontSize: 11,
        }}>▲</div>
      </div>
      <span>{toV62Rune(total)}</span>
    </div>
  );
}

window.V62Reader = V62Reader;
window.V62Footer = V62Footer;
