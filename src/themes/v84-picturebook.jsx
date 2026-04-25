// src/themes/v84-picturebook.jsx — children's picture book watercolor: soft pastels, hand-drawn frames, chubby serif
const V84_BG_TONES = {
  watercolor: { bg: '#FFF4E8', wash: 'radial-gradient(circle at 20% 20%,#FFD0E0 0,transparent 40%),radial-gradient(circle at 80% 30%,#D0E8FF 0,transparent 40%),radial-gradient(circle at 50% 80%,#E8FFD0 0,transparent 40%)', ink: '#3A2818', mute: '#8B5A28', accent: '#E8748C', card: '#FFFCF4' },
  morning:    { bg: '#E8F0FF', wash: 'radial-gradient(circle at 30% 30%,#FFD0E0 0,transparent 50%),radial-gradient(circle at 70% 70%,#D0FFD0 0,transparent 40%)', ink: '#0A1828', mute: '#5A7898', accent: '#5A8AC8', card: '#FFFFFF' },
  meadow:     { bg: '#E8FFD8', wash: 'radial-gradient(circle at 25% 25%,#FFE8C0 0,transparent 50%),radial-gradient(circle at 75% 75%,#D0E8FF 0,transparent 40%)', ink: '#1A2818', mute: '#5A7838', accent: '#588C38', card: '#FFFCEC' },
  sunset:     { bg: '#FFE8D8', wash: 'radial-gradient(circle at 30% 80%,#FFC080 0,transparent 50%),radial-gradient(circle at 70% 30%,#FFE0C0 0,transparent 40%)', ink: '#3A1F18', mute: '#8B4828', accent: '#D8683A', card: '#FFFCEC' },
  peach:      { bg: '#FFE0D0', wash: 'radial-gradient(circle at 30% 30%,#FFD0C8 0,transparent 50%)', ink: '#2A1A14', mute: '#8B5848', accent: '#E8784A', card: '#FFFCEC' },
  lilac:      { bg: '#F0E0FA', wash: 'radial-gradient(circle at 20% 30%,#FFD0E8 0,transparent 50%),radial-gradient(circle at 80% 70%,#D0E8FF 0,transparent 40%)', ink: '#28182A', mute: '#7A5878', accent: '#A878C0', card: '#FFFCEC' },
  mint:       { bg: '#D8F0E8', wash: 'radial-gradient(circle at 30% 30%,#D0FFE0 0,transparent 50%),radial-gradient(circle at 70% 70%,#FFE8D0 0,transparent 40%)', ink: '#0A2820', mute: '#487868', accent: '#3A8A78', card: '#FFFCEC' },
  cream:      { bg: '#FFF4DC', wash: 'radial-gradient(circle at 30% 70%,#FFE8C8 0,transparent 50%)', ink: '#2A1F08', mute: '#8B6828', accent: '#C88828', card: '#FFFCEC' },
  periwinkle: { bg: '#E0E8FF', wash: 'radial-gradient(circle at 30% 30%,#E8E0FF 0,transparent 50%),radial-gradient(circle at 70% 70%,#FFE8E0 0,transparent 40%)', ink: '#0A1428', mute: '#5878A0', accent: '#7888CC', card: '#FFFCEC' },
};

function V84Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V84_BG_TONES[settings.themeColors.v84.bgTone] || V84_BG_TONES.watercolor;
  const accent = settings.themeColors.v84.accent;
  const { bg, wash, ink, mute, card } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Caveat","Patrick Hand",cursive',
    }}>
      {/* watercolor wash */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.6,
        background: wash,
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* hand-drawn frame */}
        <div style={{
          background: card, padding: '32px 36px', borderRadius: 16,
          border: `2px solid ${accent}`,
          boxShadow: `4px 4px 0 ${accent}33, 8px 8px 0 ${accent}22`,
          position: 'relative',
        }}>
          {/* doodle stars at corners */}
          <span style={{ position: 'absolute', top: -10, left: 16, fontSize: 24, transform: 'rotate(-15deg)', display: 'inline-block' }}>✦</span>
          <span style={{ position: 'absolute', top: -8, right: 30, fontSize: 18, transform: 'rotate(20deg)', display: 'inline-block' }}>★</span>
          <span style={{ position: 'absolute', bottom: -8, left: 50, fontSize: 16 }}>❀</span>

          <div style={{
            fontFamily: '"Caveat",cursive', fontSize: 22, color: accent,
            textAlign: 'center', marginBottom: 4, fontWeight: 700,
            letterSpacing: '0.05em', transform: 'rotate(-1deg)',
          }}>
            ✿ Chapter {chapterIdx + 1} ✿
          </div>

          {/* chubby title */}
          <h1 style={{
            fontFamily: '"Patrick Hand","Caveat",cursive',
            fontSize: settings.tweaks.fontSize + 18, fontWeight: 700,
            textAlign: 'center', margin: '4px 0 12px', letterSpacing: '0.02em', color: ink,
            lineHeight: 1.15,
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          <div style={{
            textAlign: 'center', fontSize: 14, color: mute, fontStyle: 'italic',
            marginBottom: 24, fontFamily: '"Caveat",cursive',
          }}>
            ~ a story by {book.author || 'a friend'} ~
          </div>

          {/* doodle divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginBottom: 24, color: accent, fontSize: 18,
          }}>
            <span>❀</span>
            <span style={{ fontSize: 22 }}>~</span>
            <span>✿</span>
            <span style={{ fontSize: 22 }}>~</span>
            <span>❀</span>
          </div>

          {/* body — keep readable serif */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* page corner */}
          <div style={{
            marginTop: 28, textAlign: 'right', fontFamily: '"Caveat",cursive',
            fontSize: 18, color: mute, fontStyle: 'italic',
          }}>
            — page {chapterIdx + 1} of {total} —
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 16,
            background: card, color: ink, border: `2px solid ${ink}`,
            fontFamily: '"Caveat",cursive', fontSize: 18, fontWeight: 600,
            transform: 'rotate(-1deg)',
          }}>◀ go back</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 16,
            background: accent, color: card, border: `2px solid ${accent}`,
            fontFamily: '"Caveat",cursive', fontSize: 18, fontWeight: 600,
            transform: 'rotate(1deg)',
          }}>turn the page ▶</button>
        </div>
      </article>
    </main>
  );
}

function V84Footer({ book, chapterIdx, settings }) {
  const tone = V84_BG_TONES[settings.themeColors.v84.bgTone] || V84_BG_TONES.watercolor;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.card, borderTop: `1.5px dashed ${tone.accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic', color: tone.mute,
    }}>
      <span style={{ color: tone.accent }}>✿ page {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.accent}33`, borderRadius: 1, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent, borderRadius: 1 }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V84Reader = V84Reader;
window.V84Footer = V84Footer;
