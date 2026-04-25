// src/themes/v94-quilt.jsx — American patchwork quilt: square fabric blocks, dashed stitch borders
const V94_BG_TONES = {
  patchwork: { bg: '#F0E4D0', card: '#FFFCEC', ink: '#2A1810', mute: '#8B5828', accent: '#A82820', sq1: '#A85838', sq2: '#3A6B4E', sq3: '#D8A848', sq4: '#7A3A58' },
  navy:      { bg: '#0F1F38', card: '#1A2A48', ink: '#F0DCC8', mute: '#A88858', accent: '#FFB454', sq1: '#3A5A7E', sq2: '#A8888', sq3: '#FFB454', sq4: '#7888B0' },
  red:       { bg: '#3A1814', card: '#4A2420', ink: '#F0DCC8', mute: '#C0908', accent: '#FFD848', sq1: '#FFD848', sq2: '#88283A', sq3: '#D8A848', sq4: '#C09080' },
  green:     { bg: '#2A3A28', card: '#384A38', ink: '#F0DCC8', mute: '#A8B888', accent: '#E89838', sq1: '#5A7838', sq2: '#A8783A', sq3: '#FFD848', sq4: '#C0A8A0' },
  plum:      { bg: '#28182A', card: '#3A283C', ink: '#F0D8E0', mute: '#A888A8', accent: '#FFB838', sq1: '#7A3A58', sq2: '#3A5A7E', sq3: '#FFB454', sq4: '#A878A0' },
  sand:      { bg: '#E0D0A8', card: '#F0E0B8', ink: '#1A1408', mute: '#5A4828', accent: '#A85820', sq1: '#A88848', sq2: '#7A6028', sq3: '#D8A848', sq4: '#5A7838' },
  charcoal:  { bg: '#1A1A1A', card: '#2A2A2A', ink: '#E0DCC0', mute: '#9890', accent: '#FFB454', sq1: '#A85838', sq2: '#3A6B4E', sq3: '#D8A848', sq4: '#7A3A58' },
  country:   { bg: '#F0E0C8', card: '#FFFCEC', ink: '#2A1810', mute: '#8B5828', accent: '#88283A', sq1: '#88283A', sq2: '#3A6B4E', sq3: '#D8A848', sq4: '#A85838' },
  cocoa:     { bg: '#3A2418', card: '#4A3424', ink: '#F0DCB8', mute: '#A88858', accent: '#FFB454', sq1: '#A85838', sq2: '#88683A', sq3: '#D8A848', sq4: '#C09080' },
};

function V94QuiltBlock({ colors }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
      width: 56, height: 56, flexShrink: 0,
      border: `1.5px solid #1A1408`, boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
    }}>
      {[colors[0], colors[1], colors[2], colors[3], colors[1], colors[0], colors[3], colors[2], colors[2], colors[3], colors[0], colors[1], colors[3], colors[2], colors[1], colors[0]].map((c, i) => (
        <div key={i} style={{ background: c, border: '0.5px dashed rgba(0,0,0,0.2)' }}/>
      ))}
    </div>
  );
}

function V94Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V94_BG_TONES[settings.themeColors.v94.bgTone] || V94_BG_TONES.patchwork;
  const accent = settings.themeColors.v94.accent;
  const { bg, card, ink, mute, sq1, sq2, sq3, sq4 } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 30px 60px' }}>
        {/* quilt block + title */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22,
          padding: '20px 22px', background: card, color: ink,
          border: `2px solid ${ink}`,
          boxShadow: `4px 4px 0 ${accent}`,
        }}>
          <V94QuiltBlock colors={[sq1, sq2, sq3, sq4]}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 800, marginBottom: 4,
              textTransform: 'uppercase',
            }}>
              ◆ Block № {chapterIdx + 1} of {total}
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 700,
              margin: '4px 0 4px', letterSpacing: '0.04em', color: ink,
            }}>{stripChapterPrefix(chapterTitle)}</h1>
            <div style={{
              fontSize: 12, color: mute, fontStyle: 'italic',
            }}>
              ─ pieced by {book.author || 'unknown quilter'} ─
            </div>
          </div>
        </div>

        {/* main body card with dashed stitch border */}
        <div style={{
          background: card, color: ink, padding: '28px 30px',
          border: `2px solid ${ink}`,
          backgroundImage: `linear-gradient(${card}, ${card}), repeating-linear-gradient(45deg, transparent 0 8px, ${ink}11 8px 16px)`,
          backgroundClip: 'padding-box, border-box',
          position: 'relative',
        }}>
          {/* pieced corner blocks */}
          <div style={{ position: 'absolute', top: -2, left: -2 }}>
            <div style={{ width: 16, height: 16, background: sq1, border: `2px solid ${ink}` }}/>
          </div>
          <div style={{ position: 'absolute', top: -2, right: -2 }}>
            <div style={{ width: 16, height: 16, background: sq3, border: `2px solid ${ink}` }}/>
          </div>
          <div style={{ position: 'absolute', bottom: -2, left: -2 }}>
            <div style={{ width: 16, height: 16, background: sq4, border: `2px solid ${ink}` }}/>
          </div>
          <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
            <div style={{ width: 16, height: 16, background: sq2, border: `2px solid ${ink}` }}/>
          </div>

          {/* body */}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* end binding */}
          <div style={{
            marginTop: 24, paddingTop: 12, borderTop: `2px dashed ${ink}`,
            textAlign: 'center', fontSize: 11, color: mute, letterSpacing: '0.4em', fontStyle: 'italic',
          }}>
            ◆ block bound · {Math.round((chapterIdx + 1) / total * 100)}% pieced ◆
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: card, color: ink, border: `2px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12,
            boxShadow: `2px 2px 0 ${ink}`,
          }}>◀ prev block</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: accent, color: ink, border: `2px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12, fontWeight: 700,
            boxShadow: `2px 2px 0 ${ink}`,
          }}>next block ▶</button>
        </div>
      </article>
    </main>
  );
}

function V94Footer({ book, chapterIdx, settings }) {
  const tone = V94_BG_TONES[settings.themeColors.v94.bgTone] || V94_BG_TONES.patchwork;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `2px dashed ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.3em',
    }}>
      <span style={{ color: tone.accent }}>◆ block {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 4, background: tone.bg, border: `1px solid ${tone.ink}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V94Reader = V94Reader;
window.V94Footer = V94Footer;
