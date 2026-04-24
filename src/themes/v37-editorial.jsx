// src/themes/v37-editorial.jsx — Brutalist editorial (Donda-like): giant silhouette, mono body
const V37_BG_TONES = {
  black:    { bg: '#000', ink: '#FFF' },
  white:    { bg: '#FAFAFA', ink: '#0A0A0A' },
  bone:     { bg: '#E8E4D8', ink: '#0A0A0A' },
  rust:     { bg: '#1A0706', ink: '#F0E4D8' },
  navy:     { bg: '#060A1A', ink: '#F0F0F4' },
  olive:    { bg: '#131308', ink: '#F0EEDC' },
};

function V37Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V37_BG_TONES[settings.themeColors.v37.bgTone] || V37_BG_TONES.black;
  const accent = settings.themeColors.v37.accent;
  const { bg, ink } = tone;
  const ghost = ink === '#FFF' ? '#1A1A1A' : 'rgba(0,0,0,0.08)';
  const gray = ink === '#FFF' ? '#888' : 'rgba(10,10,10,0.55)';
  const rawTitle = stripChapterPrefix(chapterTitle) || '';
  const bgWord = rawTitle.slice(0, 2) || (book.title || '').slice(0, 2);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: '"Inter","Helvetica Neue","Noto Sans TC",sans-serif',
      position: 'relative', overflow: 'auto', padding: 0,
    }}>
      {/* giant background word */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
        <div style={{
          fontSize: 520, fontWeight: 900, color: ghost, letterSpacing: '-0.08em', lineHeight: 0.78,
          fontFamily: 'var(--serif)', whiteSpace: 'nowrap',
        }}>{bgWord}</div>
      </div>

      <header style={{ padding: '22px 40px', display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: ink, zIndex: 2, position: 'relative' }}>
        <span>A NOVEL BY {(book.author || 'ANONYMOUS').toUpperCase()}</span>
        <span>— {String(chapterIdx + 1).padStart(2, '0')} / {String(book.chaptersMeta.length).padStart(2, '0')} —</span>
        <span>ALL CAPS. JUST TEXT.</span>
      </header>

      <div style={{ padding: '30px 40px 60px', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 40 }}>
        {/* left: giant chapter slug */}
        <div style={{ borderRight: `1px solid ${ink}`, paddingRight: 30 }}>
          <div style={{ fontSize: Math.min(180, settings.tweaks.fontSize * 9), fontWeight: 900, color: ink, lineHeight: 0.85, letterSpacing: '-0.07em', fontFamily: 'var(--serif)', wordBreak: 'break-word' }}>
            {rawTitle.slice(0, 3)}
          </div>
          <div style={{ fontSize: 12, color: gray, letterSpacing: '0.3em', fontWeight: 700, marginTop: 24 }}>
            § CHAPTER {String(chapterIdx + 1).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.05, color: ink, marginTop: 10 }}>
            {rawTitle}
          </div>
          <div style={{ height: 1, background: accent, width: 80, marginTop: 20 }}/>
        </div>

        {/* right: body */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.4em', color: gray, borderBottom: `1px solid ${ink}`, paddingBottom: 8, marginBottom: 20 }}>
            § UNNUMBERED TEXT
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontSize: settings.tweaks.fontSize + 1, lineHeight: settings.tweaks.lineHeight, color: ink,
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ fontSize: 64, fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.06em', color: accent, marginTop: 24 }}>
            ———
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${ink}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${ink}`, fontWeight: 800, letterSpacing: '0.24em', borderRadius: 0 }}>← PREV</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: ink, color: bg, border: `1px solid ${ink}`, fontWeight: 800, letterSpacing: '0.24em', borderRadius: 0 }}>NEXT →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V37Footer({ book, chapterIdx, settings }) {
  const tone = V37_BG_TONES[settings.themeColors.v37.bgTone] || V37_BG_TONES.black;
  const accent = settings.themeColors.v37.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '12px 40px', borderTop: `1px solid ${tone.ink}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: 11, fontWeight: 700, letterSpacing: '0.3em', color: tone.ink, background: tone.bg,
    }}>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {Array.from({ length: 32 }).map((_, i) => (
          <div key={i} style={{ width: i % 3 ? 1 : 2, height: 18, background: tone.ink, opacity: (i * 7) % 5 === 0 ? 0.3 : 1 }}/>
        ))}
      </div>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}22`, margin: '0 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{String(chapterIdx + 1).padStart(3, '0')}/{String(total).padStart(3, '0')}</span>
    </div>
  );
}

window.V37Reader = V37Reader;
window.V37Footer = V37Footer;
