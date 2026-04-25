// src/themes/v22-woodblock.jsx — Ming/Qing woodblock print: fishtail markers, gridlines, double-line border
const V22_BG_TONES = {
  ricepaper:  { bg: '#EDE0BE', bg2: '#E4D3A6', ink: '#1A140C' },
  cream:      { bg: '#F2E6CC', bg2: '#E9D9B0', ink: '#1A140C' },
  hemp:       { bg: '#E5D7B6', bg2: '#D8C698', ink: '#1A140C' },
  bamboo:     { bg: '#E2D6B0', bg2: '#D5C490', ink: '#1A180C' },
  ash:        { bg: '#DCD0AE', bg2: '#CDC094', ink: '#181410' },
  ivory:      { bg: '#F0E5C8', bg2: '#E5D6A8', ink: '#1A140C' },
  tea:        { bg: '#D8C8A0', bg2: '#C8B582', ink: '#1F140A' },
  ochre:      { bg: '#E0CC9A', bg2: '#D2B97E', ink: '#1A0F08' },
  dusk:       { bg: '#D2C8AE', bg2: '#C5B894', ink: '#180F0A' },
};

function V22FishTail({ color, size = 12 }) {
  return (
    <svg viewBox="0 0 24 12" width={size * 2} height={size}>
      <path d="M0,6 L7,0 L17,0 L24,6 L17,12 L7,12 Z" fill="none" stroke={color} strokeWidth="1.2"/>
      <path d="M7,0 L17,12 M17,0 L7,12" stroke={color} strokeWidth="0.5" opacity="0.4"/>
    </svg>
  );
}

function V22Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V22_BG_TONES[settings.themeColors.v22.bgTone] || V22_BG_TONES.ricepaper;
  const { bg, bg2, ink } = tone;
  const accent = settings.themeColors.v22.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg2, color: ink, fontFamily: 'var(--serif)', padding: 0,
    }}>
      {/* 上書口（魚尾） */}
      <div style={{
        height: 36, background: bg, borderBottom: `2px solid ${ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px',
      }}>
        <div style={{ fontSize: 12, letterSpacing: '0.3em' }}>{book.title || '正文'} · 卷之 {chapterIdx + 1}</div>
        <V22FishTail color={ink} size={14}/>
        <div style={{ fontSize: 12, letterSpacing: '0.3em', opacity: 0.65 }}>程甲本式</div>
      </div>

      {/* 主版面：粗黑體版刻標題 + 行格 */}
      <div style={{
        padding: '24px 32px',
        borderTop: `3px double ${ink}`, borderBottom: `3px double ${ink}`,
        background: bg,
        backgroundImage: `repeating-linear-gradient(90deg, transparent 0 calc(100%/14 - 1px), rgba(26,20,12,0.08) 0 calc(100%/14))`,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            fontSize: settings.tweaks.fontSize + 10, fontWeight: 800, letterSpacing: '0.3em',
            padding: '12px 16px', background: bg2, color: ink, marginBottom: 22, textAlign: 'center',
            border: `1px solid ${ink}`,
          }}>
            第 {chapterIdx + 1} 回　{stripChapterPrefix(chapterTitle)}
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${ink}55` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: bg2, color: ink, border: `1px solid ${ink}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em', borderRadius: 0 }}>← 上 回</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `1px solid ${ink}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em', borderRadius: 0 }}>下 回 →</button>
          </div>
        </div>
      </div>

      {/* 下書口：頁碼 */}
      <div style={{
        height: 32, background: bg, borderTop: `2px solid ${ink}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18,
        fontSize: 12, letterSpacing: '0.3em',
      }}>
        <span>上</span>
        <V22FishTail color={ink} size={12}/>
        <span style={{ fontWeight: 700 }}>{chapterIdx + 1} / {total}</span>
        <V22FishTail color={ink} size={12}/>
        <span>下</span>
      </div>
    </main>
  );
}

function V22Footer({ book, chapterIdx, settings }) {
  const tone = V22_BG_TONES[settings.themeColors.v22.bgTone] || V22_BG_TONES.ricepaper;
  const accent = settings.themeColors.v22.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', borderTop: `2px solid ${tone.ink}`, background: tone.bg2, color: tone.ink,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.24em', fontWeight: 700 }}>卷 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V22Reader = V22Reader;
window.V22Footer = V22Footer;
