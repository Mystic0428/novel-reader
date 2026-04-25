// src/themes/v39-ukiyoe.jsx — Japanese ukiyo-e woodblock: indigo + vermillion on cream
const V39_BG_TONES = {
  paper:    { bg: '#F4ECD8', ink: '#1A1614' }, // 生成 kinari
  rice:     { bg: '#F8F1DD', ink: '#1A1614' }, // 米色
  moss:     { bg: '#D8DEC8', ink: '#1A1614' }, // 抹茶
  sky:      { bg: '#DAE3E8', ink: '#1A1614' }, // 藍染薄
  fuji:     { bg: '#C9CFD3', ink: '#1A1614' }, // 富士藍灰
  peach:    { bg: '#F5D9C5', ink: '#1A1614' }, // 桃色
  pine:     { bg: '#BCC6B5', ink: '#1A1614' }, // 松緑
  sand:     { bg: '#E8DCC0', ink: '#1A1614' }, // 砂色
  storm:    { bg: '#B8B8B0', ink: '#1A1614' }, // 雷雲
};

function V39Wave({ color, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 600 120" width="100%" height="120" preserveAspectRatio="none" style={{ display: 'block' }}>
      <g fill={color} opacity={opacity}>
        <path d="M0,80 Q40,30 80,55 T160,60 Q220,8 280,40 T380,52 Q440,12 500,42 T600,55 L600,120 L0,120 Z"/>
      </g>
      <g fill="none" stroke={color} strokeWidth="1.4">
        <path d="M280,40 Q260,28 240,30 Q220,32 224,42" opacity="0.55"/>
        <path d="M380,52 Q358,40 340,42 Q322,44 326,54" opacity="0.45"/>
      </g>
    </svg>
  );
}

function V39Fuji({ color, fillColor }) {
  return (
    <svg viewBox="0 0 200 80" width={200} height={80} style={{ display: 'block' }}>
      <path d="M10,76 L80,18 Q88,12 96,14 L106,18 Q114,12 122,18 L190,76 Z" fill={fillColor} stroke={color} strokeWidth="1.2"/>
      <path d="M76,28 L84,22 L92,30 L100,24 L108,32 L116,26" stroke={color} strokeWidth="1" fill="none"/>
    </svg>
  );
}

function V39Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V39_BG_TONES[settings.themeColors.v39.bgTone] || V39_BG_TONES.paper;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v39.accent;
  const vermillion = '#D2541E';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, position: 'relative',
      padding: '0 0 40px',
    }}>
      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ position: 'relative', padding: '40px 50px 24px', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, opacity: 0.2 }}>
            <V39Wave color={accent}/>
          </div>
          <div style={{ position: 'absolute', right: 30, top: 24, opacity: 0.3 }}>
            <V39Fuji color={accent} fillColor={tone.bg}/>
          </div>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'baseline', gap: 14, fontSize: 12, color: accent, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 8 }}>
            <span style={{ background: vermillion, color: '#F4ECD8', padding: '4px 10px', fontSize: 11, letterSpacing: '0.3em' }}>第 {chapterIdx + 1} 帖</span>
            <span style={{ flex: 1, height: 1, background: accent, opacity: 0.4 }}/>
            <span style={{ color: ink, opacity: 0.55, fontSize: 11 }}>之 {total}</span>
          </div>
          <h1 style={{
            position: 'relative', fontFamily: 'var(--serif)', fontWeight: 700,
            fontSize: settings.tweaks.fontSize + 16, color: ink,
            margin: 0, lineHeight: 1.15, letterSpacing: '0.04em',
            textShadow: `2px 2px 0 ${vermillion}`,
          }}>{stripChapterPrefix(chapterTitle)}</h1>
        </div>
        <div style={{ padding: '0 50px' }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50, paddingTop: 22, borderTop: `1px solid ${accent}55` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: accent, border: `1.5px solid ${accent}`, fontFamily: 'var(--serif)', fontWeight: 600, letterSpacing: '0.16em' }}>‹ 前 帖</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: bg, border: `1.5px solid ${accent}`, fontFamily: 'var(--serif)', fontWeight: 600, letterSpacing: '0.16em' }}>次 帖 ›</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V39Footer({ book, chapterIdx, settings }) {
  const tone = V39_BG_TONES[settings.themeColors.v39.bgTone] || V39_BG_TONES.paper;
  const accent = settings.themeColors.v39.accent;
  const vermillion = '#D2541E';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', borderTop: `1px solid ${accent}33`, background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: accent, fontWeight: 700, letterSpacing: '0.2em' }}>第 {chapterIdx + 1} / {total} 帖</span>
      <div style={{ flex: 1, height: 2, background: `${accent}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
        {progress > 0 && (
          <div style={{ position: 'absolute', left: `${progress * 100}%`, top: -3, width: 8, height: 8, background: vermillion, transform: 'translateX(-50%) rotate(45deg)' }}/>
        )}
      </div>
      <span style={{ color: vermillion, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V39Reader = V39Reader;
window.V39Footer = V39Footer;
