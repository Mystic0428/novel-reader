// src/themes/v121-cathedral.jsx — Gothic Cathedral 哥德教堂: pointed arches + stained glass glow
const V121_BG_TONES = {
  cathedral: { from: '#181420', to: '#0A0814', ink: '#D8D0E0', accentAlt: '#D4A848' },
  nave:      { from: '#1A141C', to: '#08060E', ink: '#D4CCD8', accentAlt: '#D4A848' },
  crypt:     { from: '#0F0E1A', to: '#06060E', ink: '#C8C0CC', accentAlt: '#D4A848' },
  rose:      { from: '#28142C', to: '#100614', ink: '#E0CCD8', accentAlt: '#FFD848' },
  reliquary: { from: '#1F141C', to: '#0F0810', ink: '#E0D0C0', accentAlt: '#FFD848' },
  pulpit:    { from: '#1A1418', to: '#080608', ink: '#D4C8C8', accentAlt: '#D4A848' },
  requiem:   { from: '#0E0E14', to: '#04040A', ink: '#C8C8D4', accentAlt: '#D4A848' },
  incense:   { from: '#1A1814', to: '#0A0908', ink: '#E0D4C0', accentAlt: '#FFD848' },
  votive:    { from: '#28201A', to: '#14100F', ink: '#F0DCB8', accentAlt: '#FFD848' },
};

function V121Arch({ accent, accentAlt, x, scale = 1 }) {
  // Pointed gothic arch silhouette — decorative
  return (
    <svg viewBox="0 0 60 100" width={60 * scale} height={100 * scale}
      style={{ position: 'absolute', left: x, top: 0, opacity: 0.12, pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="archglow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentAlt} stopOpacity="0.6"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <path d="M5 100 L5 40 Q5 0 30 0 Q55 0 55 40 L55 100 Z" fill="url(#archglow)" stroke={accent} strokeWidth="0.8"/>
    </svg>
  );
}

function V121Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V121_BG_TONES[settings.themeColors.v121.bgTone] || V121_BG_TONES.cathedral;
  const { from, to, ink, accentAlt } = tone;
  const accent = settings.themeColors.v121.accent;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '64px 24px', position: 'relative',
      background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
    }}>
      {/* Twin gothic arches at the top */}
      <V121Arch accent={accent} accentAlt={accentAlt} x="6%" scale={1.4}/>
      <V121Arch accent={accent} accentAlt={accentAlt} x="auto" scale={1.4}/>
      <div style={{ maxWidth: 660, margin: '0 auto', position: 'relative' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.4em', color: accentAlt, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase' }}>
          ✟ In Nomine · 第 {chapterIdx + 1} 鐘
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 700,
          fontSize: settings.tweaks.fontSize + 16, color: ink,
          margin: '0 0 14px', lineHeight: 1.18, letterSpacing: '0.04em', textTransform: 'uppercase',
          textShadow: `0 0 24px ${accent}55, 0 0 48px ${accentAlt}33`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 36 }}>
          <span style={{ flex: 1, height: 1, background: accent }}/>
          <span style={{ color: accentAlt, fontSize: 14 }}>✟</span>
          <span style={{ flex: 1, height: 1, background: accent }}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 56, paddingTop: 20, borderTop: `1px solid ${accent}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${accent}66`, borderRadius: 0, fontFamily: 'var(--serif)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>◀ Ante</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: accent, color: to, border: `1px solid ${accent}`, borderRadius: 0, fontFamily: 'var(--serif)', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: 11, fontWeight: 800 }}>Post ▶</button>
        </div>
      </div>
    </main>
  );
}

function V121Footer({ book, chapterIdx, settings }) {
  const tone = V121_BG_TONES[settings.themeColors.v121.bgTone] || V121_BG_TONES.cathedral;
  const accent = settings.themeColors.v121.accent;
  const accentAlt = tone.accentAlt;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.to, color: tone.ink, borderTop: `1px solid ${accent}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, letterSpacing: '0.2em',
    }}>
      <span style={{ color: accentAlt }}>✟ {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}26`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accentAlt, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V121Reader = V121Reader;
window.V121Footer = V121Footer;
