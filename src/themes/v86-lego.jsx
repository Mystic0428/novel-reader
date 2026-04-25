// src/themes/v86-lego.jsx — LEGO instruction manual: studs grid, isometric block, step number tile
const V86_BG_TONES = {
  studs:  { bg: '#FAFAFA', stud: '#E0E0E0', card: '#FFFFFF', ink: '#1A1A1A', mute: '#787878', accent2: '#D8141E' },
  yellow: { bg: '#FFD700', stud: '#E8C400', card: '#FFFFFF', ink: '#1A1408', mute: '#7A6818', accent2: '#D8141E' },
  red:    { bg: '#D8141E', stud: '#B80F18', card: '#FFFFFF', ink: '#1A0A0A', mute: '#7A1818', accent2: '#FFD700' },
  blue:   { bg: '#0080D8', stud: '#0070C0', card: '#FFFFFF', ink: '#0A1A2A', mute: '#1F4078', accent2: '#FFD700' },
  green:  { bg: '#28A030', stud: '#208828', card: '#FFFFFF', ink: '#0A1A0A', mute: '#1F4828', accent2: '#FFD700' },
  gray:   { bg: '#9098A0', stud: '#7C8088', card: '#FFFFFF', ink: '#1A1A1A', mute: '#48484A', accent2: '#D8141E' },
  cream:  { bg: '#F8F0E0', stud: '#E8E0CC', card: '#FFFFFF', ink: '#1A1408', mute: '#5A4828', accent2: '#D8141E' },
  dark:   { bg: '#383838', stud: '#282828', card: '#1A1A1A', ink: '#F0F0F0', mute: '#A8A8A8', accent2: '#FFD700' },
  black:  { bg: '#0A0A0A', stud: '#000000', card: '#1A1A1A', ink: '#FFFFFF', mute: '#888888', accent2: '#FFD700' },
};

function V86Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V86_BG_TONES[settings.themeColors.v86.bgTone] || V86_BG_TONES.studs;
  const accent = settings.themeColors.v86.accent;
  const { bg, stud, card, ink, mute, accent2 } = tone;
  const total = book.chaptersMeta.length;
  const isDarkBg = bg === '#0A0A0A' || bg === '#383838';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, padding: 0, position: 'relative',
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
      // stud pattern overlay
      backgroundImage: `radial-gradient(circle at 20px 20px, ${stud} 6px, transparent 7px)`,
      backgroundSize: '40px 40px',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 30px 60px' }}>
        {/* step header — like an instruction page */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18,
          padding: '12px 16px', background: card, color: ink,
          border: `3px solid ${ink}`, borderRadius: 6,
          boxShadow: `4px 4px 0 ${ink}`,
        }}>
          {/* big step number */}
          <div style={{
            width: 56, height: 56,
            background: accent2, color: ink,
            borderRadius: 6, border: `3px solid ${ink}`,
            display: 'grid', placeItems: 'center',
            fontSize: 26, fontWeight: 900, fontFamily: '"Inter",sans-serif',
            fontVariantNumeric: 'tabular-nums',
          }}>{chapterIdx + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 10, color: mute, letterSpacing: '0.3em', fontWeight: 800,
              textTransform: 'uppercase',
            }}>STEP {chapterIdx + 1} OF {total}</div>
            <div style={{
              fontSize: 16, fontWeight: 800, color: ink,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{book.title}</div>
          </div>
          {/* parts count */}
          <div style={{
            padding: '6px 12px', background: ink, color: bg,
            borderRadius: 4, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em',
          }}>{Math.max(1, Math.floor((book.wordCount || 0) / 1000))} pcs</div>
        </div>

        {/* title block — assembled bricks feel */}
        <div style={{
          background: card, color: ink, padding: '28px 30px',
          border: `3px solid ${ink}`, borderRadius: 6,
          boxShadow: `4px 4px 0 ${ink}`,
        }}>
          <div style={{
            fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 900, marginBottom: 6,
            textTransform: 'uppercase',
          }}>
            ◆ INSTRUCTION
          </div>
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 900,
            margin: '0 0 14px', letterSpacing: '-0.01em', color: ink,
            textTransform: 'uppercase',
          }}>{stripChapterPrefix(chapterTitle)}</h1>

          {/* "click" indicator like LEGO uses */}
          <div style={{
            display: 'inline-block', padding: '3px 10px',
            background: accent2, color: ink, fontSize: 10, fontWeight: 900,
            letterSpacing: '0.3em', marginBottom: 18,
          }}>
            ◯ CLICK!
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--sans)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* check icon when done */}
          <div style={{
            marginTop: 24, padding: '10px 14px',
            background: '#28A030', color: '#fff',
            border: `2px solid ${ink}`, borderRadius: 4,
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 12, fontWeight: 800, letterSpacing: '0.2em',
          }}>
            <span style={{ fontSize: 16 }}>✓</span>
            <span>STEP {chapterIdx + 1} COMPLETE — {chapterIdx + 1}/{total}</span>
          </div>
        </div>

        {/* nav — sized like buttons on a brick */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 20px',
            background: card, color: ink, border: `3px solid ${ink}`, borderRadius: 6,
            boxShadow: `3px 3px 0 ${ink}`,
            fontFamily: 'inherit', letterSpacing: '0.25em', fontSize: 11, fontWeight: 900,
          }}>◀ STEP {chapterIdx}</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 20px',
            background: accent, color: isDarkBg ? '#000' : '#fff',
            border: `3px solid ${ink}`, borderRadius: 6,
            boxShadow: `3px 3px 0 ${ink}`,
            fontFamily: 'inherit', letterSpacing: '0.25em', fontSize: 11, fontWeight: 900,
          }}>STEP {chapterIdx + 2} ▶</button>
        </div>
      </article>
    </main>
  );
}

function V86Footer({ book, chapterIdx, settings }) {
  const tone = V86_BG_TONES[settings.themeColors.v86.bgTone] || V86_BG_TONES.studs;
  const accent = settings.themeColors.v86.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `3px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Inter",sans-serif', fontSize: 11, color: tone.mute, letterSpacing: '0.25em', fontWeight: 800, textTransform: 'uppercase',
    }}>
      <span style={{ color: tone.ink }}>STEP {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 8, background: tone.bg, border: `2px solid ${tone.ink}`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V86Reader = V86Reader;
window.V86Footer = V86Footer;
