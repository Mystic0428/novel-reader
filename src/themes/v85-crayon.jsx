// src/themes/v85-crayon.jsx — kid's crayon doodle: bright primary colors, wonky borders, hand-drawn arrows
const V85_BG_TONES = {
  primary:  { bg: '#FFFFFF', ink: '#1A1A1A', mute: '#7878A0', red: '#FF4848', blue: '#4878FF', yellow: '#FFCC00', green: '#48C848' },
  candy:    { bg: '#FFE0EC', ink: '#3A1F38', mute: '#8B4878', red: '#FF1480', blue: '#9858E8', yellow: '#FFD848', green: '#58C898' },
  sky:      { bg: '#D8ECFF', ink: '#0A1F3A', mute: '#5878A0', red: '#FF5848', blue: '#3858E8', yellow: '#FFD448', green: '#48C8A8' },
  lemon:    { bg: '#FFF8C0', ink: '#3A2F0A', mute: '#8B7818', red: '#E84438', blue: '#5878E8', yellow: '#FFC818', green: '#88C838' },
  mint:     { bg: '#D8F8DC', ink: '#0A2818', mute: '#588868', red: '#FF5858', blue: '#5878E8', yellow: '#FFD448', green: '#38B848' },
  peach:    { bg: '#FFE0D0', ink: '#3A1A14', mute: '#8B5848', red: '#E83828', blue: '#6888E8', yellow: '#FFC848', green: '#58A848' },
  lavender: { bg: '#E8DCFF', ink: '#28184A', mute: '#7858A0', red: '#FF4488', blue: '#7858E8', yellow: '#FFD448', green: '#58C888' },
  charcoal: { bg: '#28282A', ink: '#FFFFFF', mute: '#A0A0B0', red: '#FF6868', blue: '#7898FF', yellow: '#FFE048', green: '#68E878' },
  cream:    { bg: '#FFF8E8', ink: '#3A2818', mute: '#8B6838', red: '#E83828', blue: '#5868E8', yellow: '#FFB818', green: '#68C848' },
};

function V85Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V85_BG_TONES[settings.themeColors.v85.bgTone] || V85_BG_TONES.primary;
  const accent = settings.themeColors.v85.accent;
  const { bg, ink, mute, red, blue, yellow, green } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Patrick Hand","Caveat",cursive',
    }}>
      {/* crayon scribble texture */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.06,
        backgroundImage: `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px 8px),
                          repeating-linear-gradient(-45deg, ${ink} 0 1px, transparent 1px 12px)`,
      }}/>

      <article style={{ maxWidth: 780, margin: '0 auto', padding: '40px 50px 60px' }}>
        {/* sketchy title block */}
        <div style={{
          display: 'inline-block', padding: '8px 18px', marginBottom: 18,
          background: yellow, color: ink, transform: 'rotate(-2deg)',
          border: `3px solid ${ink}`, boxShadow: `4px 4px 0 ${red}`,
          fontSize: 14, fontWeight: 800, letterSpacing: '0.08em',
        }}>
          ✦ CHAPTER {chapterIdx + 1} ✦
        </div>

        <h1 style={{
          fontFamily: '"Patrick Hand","Caveat",cursive',
          fontSize: settings.tweaks.fontSize + 22, fontWeight: 700,
          margin: '0 0 14px', letterSpacing: '0.02em', color: ink,
          lineHeight: 1.05, textShadow: `3px 3px 0 ${yellow}`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* hand-drawn arrows + smiley */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26,
          fontSize: 22, color: blue,
        }}>
          <span style={{ transform: 'rotate(-8deg)', display: 'inline-block' }}>↘</span>
          <span style={{ fontFamily: '"Caveat",cursive', fontSize: 18, color: mute, fontStyle: 'italic' }}>
            by {book.author || 'me!'}
          </span>
          <span style={{ flex: 1 }}/>
          <span style={{ transform: 'rotate(5deg)', display: 'inline-block', color: red }}>♥</span>
          <span style={{ transform: 'rotate(-5deg)', display: 'inline-block', color: green }}>★</span>
          <span style={{ transform: 'rotate(8deg)', display: 'inline-block', color: yellow }}>☀</span>
        </div>

        {/* body — keep readable but warm */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': red,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* margin doodles */}
        <div style={{
          marginTop: 28, padding: '14px 18px',
          border: `3px dashed ${blue}`, borderRadius: 14,
          fontFamily: '"Caveat",cursive', fontSize: 20, color: ink,
          transform: 'rotate(-0.5deg)',
          background: 'rgba(255,255,255,0.5)',
        }}>
          <span style={{ color: red }}>✦</span> The end of page {chapterIdx + 1}!{' '}
          <span style={{ color: green }}>♥</span> {total - chapterIdx - 1} more to go!
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 22px',
            background: blue, color: '#fff',
            border: `3px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`, borderRadius: 12,
            fontFamily: '"Caveat",cursive', fontSize: 22, fontWeight: 700,
            transform: 'rotate(-2deg)',
          }}>← back!</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 22px',
            background: red, color: '#fff',
            border: `3px solid ${ink}`, boxShadow: `3px 3px 0 ${ink}`, borderRadius: 12,
            fontFamily: '"Caveat",cursive', fontSize: 22, fontWeight: 700,
            transform: 'rotate(2deg)',
          }}>next! →</button>
        </div>
      </article>
    </main>
  );
}

function V85Footer({ book, chapterIdx, settings }) {
  const tone = V85_BG_TONES[settings.themeColors.v85.bgTone] || V85_BG_TONES.primary;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, borderTop: `3px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 16, color: tone.mute, fontStyle: 'italic',
    }}>
      <span style={{ color: tone.red }}>✦ page {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 6, background: 'transparent', border: `2px solid ${tone.ink}`, borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.green }}/>
      </div>
      <span style={{ color: tone.blue }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V85Reader = V85Reader;
window.V85Footer = V85Footer;
