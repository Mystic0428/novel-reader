// src/themes/v116-christmas.jsx — Christmas 聖誕: pine green + wine red + gilded gold
const V116_BG_TONES = {
  pine:     { from: '#1A3A2A', to: '#0E2018', ink: '#F0E8D0', accentAlt: '#D4A848' },
  holly:    { from: '#0F2820', to: '#040F0A', ink: '#F0E8D0', accentAlt: '#D4A848' },
  fir:      { from: '#1A2F22', to: '#0A1A0F', ink: '#F0E8D0', accentAlt: '#D4A848' },
  velvet:   { from: '#3A0F14', to: '#1A0408', ink: '#F0E0C8', accentAlt: '#D4A848' },
  gilded:   { from: '#2A1F0A', to: '#140F04', ink: '#F8E8C0', accentAlt: '#C8242C' },
  noel:     { from: '#142838', to: '#080F1F', ink: '#E8E4F0', accentAlt: '#D4A848' },
  hearth:   { from: '#3A1F0F', to: '#1F0F08', ink: '#F0DCC0', accentAlt: '#D4A848' },
  frost:    { from: '#E0E8EE', to: '#C8D0D8', ink: '#0F1828', accentAlt: '#C8242C' },
  cinnamon: { from: '#3A1F14', to: '#1F0E08', ink: '#F0D8B8', accentAlt: '#D4A848' },
};

function V116Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V116_BG_TONES[settings.themeColors.v116.bgTone] || V116_BG_TONES.pine;
  const { from, to, ink, accentAlt } = tone;
  const accent = settings.themeColors.v116.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px',
      background: `radial-gradient(ellipse at 20% 30%, ${from}, ${to} 80%)`,
    }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.3em', color: accentAlt, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase' }}>
          ❅ Chapter {chapterIdx + 1} · {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 600,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.22, letterSpacing: '0.02em',
          textShadow: `0 0 20px ${accentAlt}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <span style={{ flex: 1, height: 2, background: accent }}/>
          <span style={{ color: accentAlt, fontSize: 14 }}>✦</span>
          <span style={{ flex: 1, height: 2, background: accent }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accentAlt,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `0.5px solid ${accentAlt}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${accentAlt}66`, borderRadius: 4, fontFamily: 'var(--serif)' }}>← 上一章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: '#FAEEDC', border: `0.5px solid ${accent}`, borderRadius: 4, fontFamily: 'var(--serif)', fontWeight: 700 }}>下一章 →</button>
        </div>
      </div>
    </main>
  );
}

function V116Footer({ book, chapterIdx, settings }) {
  const tone = V116_BG_TONES[settings.themeColors.v116.bgTone] || V116_BG_TONES.pine;
  const accent = settings.themeColors.v116.accent;
  const accentAlt = tone.accentAlt;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accentAlt}44`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.15em',
    }}>
      <span style={{ color: accentAlt }}>❅ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accentAlt, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V116Reader = V116Reader;
window.V116Footer = V116Footer;
