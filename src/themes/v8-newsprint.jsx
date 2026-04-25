// src/themes/v8-newsprint.jsx — Aged broadsheet newspaper: yellowed paper, halftone dots, towering serif headline, dateline
const V8_BG_TONES = {
  newsprint: { bg: '#F2E8D0', ink: '#1A1408', rule: 'rgba(26,20,8,0.35)' },
  cream:     { bg: '#F5EFD8', ink: '#1A1408', rule: 'rgba(26,20,8,0.30)' },
  ivory:     { bg: '#F8F0DC', ink: '#1A1408', rule: 'rgba(26,20,8,0.30)' },
  yellowed:  { bg: '#E8DCB0', ink: '#1A1004', rule: 'rgba(26,16,4,0.40)' },
  ash:       { bg: '#DDD5BC', ink: '#1A1408', rule: 'rgba(26,20,8,0.40)' },
  parchment: { bg: '#EDE0B8', ink: '#1A0E04', rule: 'rgba(26,14,4,0.35)' },
  hemp:      { bg: '#DCCEA0', ink: '#1A0E04', rule: 'rgba(26,14,4,0.45)' },
  bone:      { bg: '#FAF2E0', ink: '#1A1408', rule: 'rgba(26,20,8,0.25)' },
  smoke:     { bg: '#DCD2C0', ink: '#15100A', rule: 'rgba(21,16,10,0.40)' },
};

function V8Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V8_BG_TONES[settings.themeColors.v8.bgTone] || V8_BG_TONES.newsprint;
  const { bg, ink, rule } = tone;
  const red = settings.themeColors.v8.accent;
  const total = book.chaptersMeta.length;
  // Halftone dot pattern as background
  const halftone = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='6'><circle cx='1.5' cy='1.5' r='0.7' fill='%23000' opacity='0.05'/></svg>")`;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: bg, color: ink, fontFamily: 'var(--serif)', padding: 0,
      backgroundImage: halftone, backgroundSize: '4px 4px',
    }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 50px 40px' }}>
        {/* masthead */}
        <div style={{ borderBottom: `4px double ${ink}`, paddingBottom: 14, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 10, letterSpacing: '0.3em', fontWeight: 700, marginBottom: 8 }}>
            <span>VOL · {String(chapterIdx + 1).padStart(2, '0')}</span>
            <span style={{ color: red }}>★ EVENING EDITION ★</span>
            <span>NO. {String(total).padStart(3, '0')}</span>
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display","Times New Roman","Noto Serif TC",serif',
            fontSize: settings.tweaks.fontSize + 28, fontWeight: 900, margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em',
            color: ink, textAlign: 'center',
          }}>
            {(book.title || 'THE DAILY NOVEL').toUpperCase()}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, color: ink, opacity: 0.7, marginTop: 8, fontStyle: 'italic' }}>
            <span>"All the news that's fit to print"</span>
            <span>{(book.author || 'Anonymous')} · Editor</span>
            <span>· Page {chapterIdx + 1} ·</span>
          </div>
        </div>

        {/* dateline + chapter banner */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.4em', fontWeight: 800, color: red, padding: '2px 8px', border: `1.5px solid ${red}` }}>
            CHAPTER {chapterIdx + 1}
          </span>
          <div style={{ flex: 1, height: 1, background: ink }}/>
          <span style={{ fontSize: 10, color: ink, opacity: 0.55, fontStyle: 'italic' }}>continued from prev. issue</span>
        </div>

        {/* article headline */}
        <h2 style={{
          fontFamily: '"Playfair Display","Times New Roman","Noto Serif TC",serif',
          fontSize: settings.tweaks.fontSize + 14, fontWeight: 800, margin: '14px 0 4px',
          lineHeight: 1.15, letterSpacing: '-0.005em', color: ink,
        }}>
          {stripChapterPrefix(chapterTitle)}
        </h2>
        <div style={{ fontSize: 11, fontStyle: 'italic', color: ink, opacity: 0.6, letterSpacing: '0.05em', marginBottom: 6 }}>
          A correspondent's report · Filed {chapterIdx + 1} of {total}
        </div>
        <div style={{ height: 4, display: 'flex', gap: 1, marginBottom: 18 }}>
          <div style={{ flex: 1, background: ink }}/>
          <div style={{ flex: 1, background: 'transparent' }}/>
          <div style={{ flex: 1, background: ink }}/>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Times New Roman","Noto Serif TC",serif', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': red,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end-of-article mark */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, letterSpacing: '0.4em', color: ink, fontWeight: 700 }}>
          — ★ —
        </div>

        {/* nav buttons styled as newspaper banners */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: `4px double ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink,
            border: `1.5px solid ${ink}`, borderRadius: 0,
            fontFamily: '"Playfair Display","Times New Roman",serif', fontWeight: 800, letterSpacing: '0.2em',
          }}>◄ PRIOR ISSUE</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg,
            border: `1.5px solid ${ink}`, borderRadius: 0,
            fontFamily: '"Playfair Display","Times New Roman",serif', fontWeight: 800, letterSpacing: '0.2em',
          }}>NEXT EDITION ►</button>
        </div>
      </div>
    </main>
  );
}

function V8Footer({ book, chapterIdx, settings }) {
  const tone = V8_BG_TONES[settings.themeColors.v8.bgTone] || V8_BG_TONES.newsprint;
  const red = settings.themeColors.v8.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Playfair Display","Times New Roman",serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
    }}>
      <span>PAGE {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: red }}/>
      </div>
      <span style={{ color: red }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V8Reader = V8Reader;
window.V8Footer = V8Footer;
