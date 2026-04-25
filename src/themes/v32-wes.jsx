// src/themes/v32-wes.jsx — Wes Anderson: symmetric pastel, ticket stubs, centered composition
const V32_BG_TONES = {
  cream:    { bg: '#F7ECD8', ink: '#2E1E12' },
  peach:    { bg: '#FBE3D3', ink: '#2E1E12' },
  mint:     { bg: '#E5F0E0', ink: '#1F3525' },
  butter:   { bg: '#FBEFB0', ink: '#2E1E12' },
  blush:    { bg: '#F6D8D8', ink: '#2E1E12' },
  sage:     { bg: '#DDE5C8', ink: '#2E1E12' },
  rose:     { bg: '#F4D2D8', ink: '#2E1E12' },
  sky:      { bg: '#D9E6EE', ink: '#2E1E12' },
  taupe:    { bg: '#E0D5C2', ink: '#2E1E12' },
};

const V32_BORDER_PALETTE = ['#F4A89A', '#9ECFB0', '#D4A02E', '#2E5A5E'];

function V32Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V32_BG_TONES[settings.themeColors.v32.bgTone] || V32_BG_TONES.cream;
  const peachD = settings.themeColors.v32.accent;
  const { bg, ink } = tone;
  const mute = 'rgba(46,30,18,0.55)', teal = '#2E5A5E';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: 'var(--serif)',
      position: 'relative', overflow: 'auto', padding: 0,
    }}>
      {/* top ribbon band */}
      <div style={{ height: 16, background: `repeating-linear-gradient(90deg,
        ${V32_BORDER_PALETTE[0]} 0 24px, ${V32_BORDER_PALETTE[1]} 24px 48px, ${V32_BORDER_PALETTE[2]} 48px 72px, ${V32_BORDER_PALETTE[3]} 72px 96px)`,
        borderBottom: `1px solid ${ink}` }}/>

      <header style={{ padding: '24px 40px 20px', textAlign: 'center', borderBottom: `1px solid ${ink}` }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ color: peachD }}>❋</span><span style={{ color: '#5E9C7B' }}>❋</span><span style={{ color: peachD }}>❋</span>
        </div>
        <div style={{ fontSize: 11, letterSpacing: '0.6em', color: mute, fontWeight: 500 }}>— PRESENTING —</div>
        <div style={{ fontSize: Math.min(44, settings.tweaks.fontSize * 2.2 + 8), color: peachD, fontWeight: 500, letterSpacing: '0.22em', lineHeight: 1.1, margin: '6px 0' }}>
          {book.title}
        </div>
        {book.author && (
          <div style={{ fontSize: 13, fontStyle: 'italic', color: teal, letterSpacing: '0.1em' }}>
            "A chronicle composed by {book.author}"
          </div>
        )}
        <div style={{ fontSize: 11, color: mute, letterSpacing: '0.4em', marginTop: 8 }}>
          CHAPTER · {String(chapterIdx + 1).padStart(2, '0')} · OF · {String(book.chaptersMeta.length).padStart(2, '0')}
        </div>
      </header>

      {/* body */}
      <div style={{ padding: '28px 48px', maxWidth: 720, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'inline-block', padding: '5px 14px', background: peachD, color: '#fff',
          fontFamily: 'var(--serif)', fontSize: 11, fontWeight: 600, letterSpacing: '0.4em',
          border: `1px solid ${ink}`, boxShadow: `inset 0 0 0 3px ${bg}, inset 0 0 0 3.5px ${ink}`,
        }}>
          CHAPTER  {toRomanV32(chapterIdx + 1)}
        </div>
        <div style={{ fontSize: settings.tweaks.fontSize + 10, margin: '18px 0 4px', letterSpacing: '0.1em', color: teal }}>
          {stripChapterPrefix(chapterTitle)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '18px 0 22px', color: mute }}>
          <div style={{ width: 50, height: 1, background: ink }}/>
          <span>❋</span>
          <div style={{ width: 50, height: 1, background: ink }}/>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: settings.tweaks.font === 'sans' ? 'var(--sans)' : 'var(--serif)',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
          textAlign: 'justify', maxWidth: 600, width: '100%',
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        <div style={{ margin: '24px 0 8px', display: 'flex', alignItems: 'center', gap: 10, color: mute }}>
          <div style={{ width: 50, height: 1, background: ink }}/>
          <span style={{ fontSize: 11, letterSpacing: '0.5em' }}>FIN · CHAPTER {toRomanV32(chapterIdx + 1)}</span>
          <div style={{ width: 50, height: 1, background: ink }}/>
        </div>

        <div style={{ display: 'flex', gap: 20, marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: V32_BORDER_PALETTE[1], color: ink, border: `1px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`, fontFamily: 'var(--serif)', letterSpacing: '0.15em' }}>← PRIOR</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: V32_BORDER_PALETTE[0], color: ink, border: `1px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`, fontFamily: 'var(--serif)', letterSpacing: '0.15em' }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V32Footer({ book, chapterIdx, settings }) {
  const tone = V32_BG_TONES[settings.themeColors.v32.bgTone] || V32_BG_TONES.cream;
  const peachD = settings.themeColors.v32.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      height: 34, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', fontSize: 11, letterSpacing: '0.4em', color: 'rgba(46,30,18,0.55)',
      background: tone.bg, borderTop: `1px solid ${tone.ink}`,
    }}>
      <span>PAGE · {toRomanV32(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.ink}33`, margin: '0 20px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: peachD }}/>
      </div>
      <span>OF · {toRomanV32(total)}</span>
    </div>
  );
}

function toRomanV32(n) {
  if (!n || n < 1) return '';
  if (n > 3999) return String(n);
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let out = '', x = n;
  for (const [s, v] of map) { while (x >= v) { out += s; x -= v; } }
  return out;
}

window.V32Reader = V32Reader;
window.V32Footer = V32Footer;
