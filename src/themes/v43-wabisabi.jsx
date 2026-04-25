// src/themes/v43-wabisabi.jsx — Wabi-Sabi: imperfect natural textures + kintsugi gold cracks
const V43_BG_TONES = {
  linen:     { bg: '#D9D2C5', ink: '#3A3530' },
  moss:      { bg: '#C5C7B0', ink: '#2D3024' },
  clay:      { bg: '#C7B5A0', ink: '#3A2E22' },
  stone:     { bg: '#BAB5A8', ink: '#2E2A24' },
  driftwood: { bg: '#B5A892', ink: '#2E2A22' },
  ash:       { bg: '#C0BAB0', ink: '#2E2A24' },
  tea:       { bg: '#C5AE92', ink: '#3A2E22' },
  sand:      { bg: '#D5CBB5', ink: '#3A3528' },
  dusk:      { bg: '#A8A399', ink: '#1F1C18' },
};

function V43Kintsugi({ color, w = 280 }) {
  // Irregular gold-crack line — 金繼: organic, asymmetric, with branching fragments
  return (
    <svg viewBox="0 0 280 30" width={w} height={30 * w / 280} style={{ display: 'block' }}>
      <g fill="none" stroke={color} strokeLinecap="round">
        <path d="M4,18 Q30,10 56,16 L70,12 Q98,18 130,8 L148,14 Q170,20 200,12 Q230,6 252,14 L268,10" strokeWidth="1.6" opacity="0.85"/>
        <path d="M68,12 L74,8 L78,14" strokeWidth="0.9" opacity="0.65"/>
        <path d="M148,14 L154,18 L160,12" strokeWidth="0.9" opacity="0.65"/>
        <path d="M230,6 L226,2 L232,4" strokeWidth="0.9" opacity="0.5"/>
      </g>
    </svg>
  );
}

function V43Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V43_BG_TONES[settings.themeColors.v43.bgTone] || V43_BG_TONES.linen;
  const { bg, ink } = tone;
  const kintsugi = settings.themeColors.v43.accent;
  const total = book.chaptersMeta.length;
  // Faint linen weave background — overlapping faint horizontal + vertical noise
  const linenTexture = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' seed='5'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0'/></filter><rect width='100%25' height='100%25' filter='url(%23w)'/></svg>")`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '60px 0',
      backgroundImage: linenTexture,
    }}>
      {/* Asymmetric content: narrower column, offset slightly right */}
      <div style={{ maxWidth: 640, margin: '0 0 0 max(50px, calc(50% - 280px))', paddingRight: 50, position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: '0.35em', fontWeight: 500, color: ink, opacity: 0.6, fontFamily: 'var(--serif)', marginBottom: 6, textTransform: 'lowercase' }}>
          chapter · 第 {chapterIdx + 1} 之 {total}
        </div>
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 400,
          fontSize: settings.tweaks.fontSize + 12, color: ink,
          margin: '0 0 14px', lineHeight: 1.25, letterSpacing: '0.02em',
        }}>
          {stripChapterPrefix(chapterTitle)}
        </h1>
        <div style={{ marginBottom: 38, marginLeft: -12 }}>
          <V43Kintsugi color={kintsugi} w={280}/>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': kintsugi,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        {/* Closing kintsugi crack — wider, asymmetric */}
        <div style={{ marginTop: 56, marginLeft: 24, opacity: 0.7 }}>
          <V43Kintsugi color={kintsugi} w={200}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.12em' }}>← 前 章</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: ink, border: `0.5px solid ${ink}33`, borderRadius: 2, fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400, letterSpacing: '0.12em' }}>下 章 →</button>
        </div>
      </div>
    </main>
  );
}

function V43Footer({ book, chapterIdx, settings }) {
  const tone = V43_BG_TONES[settings.themeColors.v43.bgTone] || V43_BG_TONES.linen;
  const kintsugi = settings.themeColors.v43.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.bg, color: tone.ink, borderTop: `0.5px solid ${tone.ink}22`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ fontStyle: 'italic', opacity: 0.7, letterSpacing: '0.12em' }}>第 {chapterIdx + 1} / {total} 章</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}1F`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: kintsugi }}/>
      </div>
      <span style={{ color: kintsugi, fontStyle: 'italic' }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V43Reader = V43Reader;
window.V43Footer = V43Footer;
