// src/themes/v40-sumie.jsx — Sumi-e ink wash: pure black ink + paper + cinnabar seal
const V40_BG_TONES = {
  rice:     { bg: '#F2EBDB', ink: '#18181B' },
  cloud:    { bg: '#ECE5D5', ink: '#18181B' },
  ash:      { bg: '#DCD6C8', ink: '#18181B' },
  bamboo:   { bg: '#DDDFC4', ink: '#1A1F18' },
  ivory:    { bg: '#F5F0E2', ink: '#18181B' },
  mist:     { bg: '#E8E2D2', ink: '#18181B' },
  dawn:     { bg: '#EFE5D0', ink: '#18181B' },
  dusk:     { bg: '#D6D0BE', ink: '#18181B' },
  moon:     { bg: '#ECECDA', ink: '#18181B' },
};

function V40BrushStroke({ color }) {
  return (
    <svg viewBox="0 0 260 24" width={260} height={24} style={{ display: 'block' }}>
      <path d="M4,14 Q30,4 60,12 Q90,18 130,10 Q170,4 210,14 Q240,20 256,12"
            fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.85"/>
      <path d="M10,16 Q40,8 80,14 Q120,18 160,12 Q200,8 240,14"
            fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.4"/>
    </svg>
  );
}

function V40Seal({ size = 48, color }) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size}>
      <rect x="2" y="2" width="46" height="46" fill="none" stroke={color} strokeWidth="2"/>
      <rect x="6" y="6" width="38" height="38" fill="none" stroke={color} strokeWidth="0.5"/>
      <text x="25" y="20" textAnchor="middle" fontSize="11" fill={color} fontFamily="var(--serif)" fontWeight="700">讀</text>
      <text x="25" y="34" textAnchor="middle" fontSize="11" fill={color} fontFamily="var(--serif)" fontWeight="700">書</text>
      <text x="25" y="46" textAnchor="middle" fontSize="9" fill={color} fontFamily="var(--serif)">印</text>
    </svg>
  );
}

function V40Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V40_BG_TONES[settings.themeColors.v40.bgTone] || V40_BG_TONES.rice;
  const { bg, ink } = tone;
  const cinnabar = settings.themeColors.v40.accent;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '52px 0',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -8, right: 60, opacity: 0.85 }}>
          <V40Seal color={cinnabar}/>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.4em', color: ink, opacity: 0.6, fontFamily: 'var(--serif)', marginBottom: 8 }}>
          卷 第 {chapterIdx + 1}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 18, color: ink,
          margin: '0 0 12px', lineHeight: 1.2, letterSpacing: '0.06em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ marginBottom: 36 }}>
          <V40BrushStroke color={ink}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': cinnabar,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ marginTop: 56, opacity: 0.5 }}>
          <V40BrushStroke color={ink}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: 'none', fontFamily: 'var(--serif)', fontSize: 13, letterSpacing: '0.2em' }}>← 上 卷</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: 'none', fontFamily: 'var(--serif)', fontSize: 13, letterSpacing: '0.2em' }}>下 卷 →</button>
        </div>
      </div>
    </main>
  );
}

function V40Footer({ book, chapterIdx, settings }) {
  const tone = V40_BG_TONES[settings.themeColors.v40.bgTone] || V40_BG_TONES.rice;
  const cinnabar = settings.themeColors.v40.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.2em', opacity: 0.7 }}>卷 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: 'currentColor', opacity: 0.18, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.ink, opacity: 0.7 }}/>
      </div>
      <span style={{ color: cinnabar, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V40Reader = V40Reader;
window.V40Footer = V40Footer;
