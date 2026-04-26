// src/themes/v113-coldpress.jsx — Cold Press 冷壓紙: cool serif, steel blue accent
const V113_BG_TONES = {
  coldpress: { bg: '#F4F6F8', ink: '#1A1F28' },
  snow:      { bg: '#FAFAFA', ink: '#1A1F28' },
  mist:      { bg: '#EFF2F4', ink: '#1A1F28' },
  ice:       { bg: '#EEF2F4', ink: '#0F1828' },
  pearl:     { bg: '#F2F4F6', ink: '#1F242C' },
  cloud:     { bg: '#E8ECEE', ink: '#1F242C' },
  sky:       { bg: '#EEF4F8', ink: '#0F1F2C' },
  silver:    { bg: '#E4E8EA', ink: '#1F242C' },
  paper:     { bg: '#ECEEEF', ink: '#1A1F28' },
};

function V113Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V113_BG_TONES[settings.themeColors.v113.bgTone] || V113_BG_TONES.coldpress;
  const { bg, ink } = tone;
  const accent = settings.themeColors.v113.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', background: bg,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 13, fontStyle: 'italic', color: accent, marginBottom: 14, letterSpacing: '0.1em' }}>
          {chapterIdx + 1 <= 20
            ? ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'][chapterIdx + 1]
            : chapterIdx + 1
          } · 序
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '-0.005em',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ width: 32, height: 1, background: accent, marginBottom: 36 }}/>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${ink}22` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FAFAFA', border: `0.5px solid ${accent}`, borderRadius: 2, fontFamily: 'var(--serif)', fontWeight: 600 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V113Footer({ book, chapterIdx, settings }) {
  const tone = V113_BG_TONES[settings.themeColors.v113.bgTone] || V113_BG_TONES.coldpress;
  const accent = settings.themeColors.v113.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ opacity: 0.7 }}>{chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}1F`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V113Reader = V113Reader;
window.V113Footer = V113Footer;
