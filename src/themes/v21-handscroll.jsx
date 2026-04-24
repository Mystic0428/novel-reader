// src/themes/v21-handscroll.jsx — Song handscroll: brass caps, ink mountains, cinnabar seals
const V21_BG_TONES = {
  silk:    { bg: '#E9DFC6', bg2: '#DCCFA9', ink: '#2A2418' },
  rice:    { bg: '#F1EBD6', bg2: '#E5DCBB', ink: '#2A2418' },
  hemp:    { bg: '#DCD1B2', bg2: '#CFC097', ink: '#2A2418' },
  moss:    { bg: '#D9D8BC', bg2: '#C7C5A2', ink: '#1F2418' },
  cloud:   { bg: '#EFE9D8', bg2: '#E2D9BF', ink: '#231F18' },
  tea:     { bg: '#E2D6B8', bg2: '#D3C59C', ink: '#2D2318' },
};

function V21FarMountains({ color, opacity = 0.22 }) {
  return (
    <svg viewBox="0 0 1280 220" width="100%" height="220" preserveAspectRatio="none" style={{ display: 'block' }}>
      <g fill={color} opacity={opacity}>
        <path d="M0,180 C60,120 120,150 180,110 C240,70 300,140 380,90 C460,40 520,130 600,100 C680,70 760,150 860,110 C960,70 1040,140 1120,100 C1200,60 1260,130 1280,110 L1280,220 L0,220 Z"/>
      </g>
      <g fill={color} opacity={opacity * 0.6}>
        <path d="M0,200 C80,160 160,190 260,170 C360,150 440,200 560,180 C680,160 780,200 900,180 C1020,160 1140,200 1280,180 L1280,220 L0,220 Z"/>
      </g>
    </svg>
  );
}

function V21Seal({ text, size = 44, color = '#A43828', white = false }) {
  return (
    <div style={{
      width: size, height: size, background: white ? '#fff' : color,
      color: white ? color : '#fff',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--serif)', fontWeight: 700, fontSize: size * 0.3,
      lineHeight: 1, border: white ? `1.5px solid ${color}` : 'none',
      writingMode: 'vertical-rl', textOrientation: 'upright',
      transform: 'rotate(-2deg)', padding: 4, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.15)',
    }}>{text}</div>
  );
}

function V21Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V21_BG_TONES[settings.themeColors.v21.bgTone] || V21_BG_TONES.silk;
  const accent = settings.themeColors.v21.accent;
  const { bg, bg2, ink } = tone;
  const mute = 'rgba(42,36,24,0.55)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: `linear-gradient(180deg, ${bg2} 0%, ${bg} 35%, ${bg} 65%, ${bg2} 100%)`,
      color: ink, position: 'relative', fontFamily: 'var(--serif)',
      padding: 0, overflow: 'auto',
    }}>
      {/* top brass cap */}
      <div style={{
        position: 'sticky', top: 0, height: 26,
        background: 'linear-gradient(180deg, #5E4A2E 0%, #8B6B3E 40%, #4A3B24 100%)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 0 rgba(255,255,255,0.15)',
        borderBottom: '2px solid #2E2413', zIndex: 2,
      }}/>

      <div style={{ position: 'relative', padding: '48px 48px 32px', maxWidth: 820, margin: '0 auto' }}>
        {/* far mountains decoration */}
        <div style={{ position: 'absolute', left: -40, right: -40, top: '38%', pointerEvents: 'none', opacity: 0.45 }}>
          <V21FarMountains color="#5a6b65" opacity={0.22}/>
        </div>

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.5em', color: mute, fontWeight: 500 }}>
            {book.title} · 卷 {chapterIdx + 1}
          </div>
          <h1 style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 500, margin: '14px 0 0', letterSpacing: '0.18em', color: ink }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, alignItems: 'center' }}>
            <div style={{ width: 60, height: 0.5, background: ink, opacity: 0.5 }}/>
            <V21Seal text="卷" size={26} color={accent}/>
            <div style={{ width: 60, height: 0.5, background: ink, opacity: 0.5 }}/>
          </div>
        </div>

        <div className="reading-body" style={{ position: 'relative', zIndex: 1, ...(book.preserveOriginalCss ? {} : {
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          fontSize: settings.tweaks.fontSize + 1,
          lineHeight: settings.tweaks.lineHeight,
          color: ink, letterSpacing: '0.04em',
        }) }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* seal group at end */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 44, display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'flex-end' }}>
          <V21Seal text="藏書" size={36} color={accent}/>
          <V21Seal text="閱畢" size={32} color={accent} white/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 20, borderTop: '0.5px solid rgba(42,36,24,0.3)' }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${accent}`, fontFamily: 'var(--serif)' }}>← 前卷</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${accent}`, fontFamily: 'var(--serif)' }}>次卷 →</button>
        </div>
      </div>

      {/* bottom brass cap */}
      <div style={{
        height: 26,
        background: 'linear-gradient(0deg, #5E4A2E 0%, #8B6B3E 40%, #4A3B24 100%)',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
        borderTop: '2px solid #2E2413',
      }}/>
    </main>
  );
}

function V21Footer({ book, chapterIdx, settings }) {
  const tone = V21_BG_TONES[settings.themeColors.v21.bgTone] || V21_BG_TONES.silk;
  const accent = settings.themeColors.v21.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, borderTop: `0.5px solid ${tone.ink}44`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)',
      fontSize: 11, color: tone.ink, letterSpacing: '0.2em',
    }}>
      <span>卷 {chapterIdx + 1}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>之 {total}</span>
    </div>
  );
}

window.V21Reader = V21Reader;
window.V21Footer = V21Footer;
