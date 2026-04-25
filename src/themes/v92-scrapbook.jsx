// src/themes/v92-scrapbook.jsx — scrapbook collage: washi tape, sticky notes, mixed handwritten + serif
const V92_BG_TONES = {
  pages:  { bg: '#F4ECD8', card: '#FFFCEC', ink: '#2A1A14', mute: '#8B5A28', accent: '#C84A28', tape1: '#FFD848', tape2: '#FF98AC' },
  pink:   { bg: '#FFE0EC', card: '#FFFCEC', ink: '#3A1828', mute: '#8B4878', accent: '#E8488C', tape1: '#FFD848', tape2: '#88E0F0' },
  blue:   { bg: '#D8ECFF', card: '#FFFCEC', ink: '#0A1A38', mute: '#5878A8', accent: '#3858E8', tape1: '#FFD848', tape2: '#FF98AC' },
  green:  { bg: '#D8F0DC', card: '#FFFCEC', ink: '#0A2818', mute: '#487868', accent: '#48A878', tape1: '#FFD848', tape2: '#FF98AC' },
  butter: { bg: '#FFF8C8', card: '#FFFCEC', ink: '#3A2818', mute: '#8B6818', accent: '#E89838', tape1: '#FF98AC', tape2: '#88E0F0' },
  lilac:  { bg: '#E8DCFF', card: '#FFFCEC', ink: '#28184A', mute: '#7858A0', accent: '#A878E8', tape1: '#FFD848', tape2: '#88FFA8' },
  mint:   { bg: '#D0F0DC', card: '#FFFCEC', ink: '#0A2818', mute: '#487868', accent: '#48A8A8', tape1: '#FF98AC', tape2: '#FFD848' },
  peach:  { bg: '#FFE0D0', card: '#FFFCEC', ink: '#3A1A14', mute: '#8B5848', accent: '#E84838', tape1: '#88FFA8', tape2: '#88E0F0' },
  washi:  { bg: '#E8D8B8', card: '#FFFCEC', ink: '#1A1408', mute: '#5A4828', accent: '#A85820', tape1: '#88FFA8', tape2: '#FF98AC' },
};

function V92Tape({ color, width, rotate, top, left, right }) {
  return (
    <div style={{
      position: 'absolute', width, height: 22, top, left, right,
      transform: `rotate(${rotate}deg)`,
      background: `repeating-linear-gradient(90deg, ${color}cc 0 8px, ${color}88 8px 16px)`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
    }}/>
  );
}

function V92Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V92_BG_TONES[settings.themeColors.v92.bgTone] || V92_BG_TONES.pages;
  const accent = settings.themeColors.v92.accent;
  const { bg, card, ink, mute, tape1, tape2 } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Caveat","Patrick Hand",cursive',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 30px 60px', position: 'relative' }}>
        {/* main scrapbook page */}
        <div style={{
          background: card, padding: '40px 36px 32px', position: 'relative',
          boxShadow: '0 12px 30px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.05)',
          transform: 'rotate(-0.5deg)',
        }}>
          {/* washi tapes at corners */}
          <V92Tape color={tape1} width={100} rotate={-6} top={-10} left={20}/>
          <V92Tape color={tape2} width={80} rotate={4} top={-10} right={30}/>

          {/* date stamp top-right */}
          <div style={{
            position: 'absolute', top: 18, right: 24, transform: 'rotate(4deg)',
            padding: '4px 10px', border: `2px solid ${accent}`,
            color: accent, fontFamily: '"Courier New",monospace', fontWeight: 800,
            fontSize: 10, letterSpacing: '0.25em',
          }}>
            № {String(chapterIdx + 1).padStart(3, '0')}
          </div>

          {/* big handwritten title */}
          <div style={{
            fontFamily: '"Caveat",cursive', fontSize: 22, color: accent,
            marginBottom: 4, fontWeight: 700, transform: 'rotate(-1deg)',
            textAlign: 'left',
          }}>
            ✿ entry {chapterIdx + 1} of {total}
          </div>

          <h1 style={{
            fontFamily: '"Patrick Hand","Caveat",cursive',
            fontSize: settings.tweaks.fontSize + 18, fontWeight: 700,
            margin: '4px 0 12px', letterSpacing: '0.02em', color: ink,
            lineHeight: 1.1,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            fontFamily: '"Caveat",cursive', fontSize: 16, color: mute, fontStyle: 'italic',
            marginBottom: 22,
          }}>
            ✎ from {book.author || 'a friend'}
          </div>

          {/* polaroid-like frame for body — paper underlay */}
          <div style={{
            background: '#FFFEF8', padding: '22px 22px 26px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(0,0,0,0.04)',
            transform: 'rotate(0.3deg)', marginBottom: 14,
          }}>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>
          </div>

          {/* sticky note */}
          <div style={{
            display: 'inline-block',
            background: tape1, padding: '10px 14px',
            transform: 'rotate(-2deg)', marginTop: 8,
            boxShadow: '2px 2px 8px rgba(0,0,0,0.15)',
            fontFamily: '"Caveat",cursive', fontSize: 16, color: ink,
            fontStyle: 'italic', maxWidth: 280,
          }}>
            ✎ to continue — page {chapterIdx + 1} done!
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 30 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 4,
            background: card, color: ink, border: `2px dashed ${ink}`,
            fontFamily: '"Caveat",cursive', fontSize: 18, fontStyle: 'italic',
            transform: 'rotate(-1deg)',
          }}>‹ flip back</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 4,
            background: accent, color: card, border: `2px solid ${accent}`,
            fontFamily: '"Caveat",cursive', fontSize: 18, fontWeight: 700, fontStyle: 'italic',
            transform: 'rotate(1deg)',
          }}>turn page ›</button>
        </div>
      </article>
    </main>
  );
}

function V92Footer({ book, chapterIdx, settings }) {
  const tone = V92_BG_TONES[settings.themeColors.v92.bgTone] || V92_BG_TONES.pages;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.card, borderTop: `1.5px dashed ${tone.accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic', color: tone.mute,
    }}>
      <span style={{ color: tone.accent }}>✿ entry {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.accent}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V92Reader = V92Reader;
window.V92Footer = V92Footer;
