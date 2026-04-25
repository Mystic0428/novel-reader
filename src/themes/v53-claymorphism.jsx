// src/themes/v53-claymorphism.jsx — Chunky 3D clay: thick black borders, dual inner+outer shadows, pastel rounded blobs
const V53_BG_TONES = {
  peach:     { bg: '#FDBCB4', card: '#FFE3D8', ink: '#2A1410' },
  babyblue:  { bg: '#ADD8E6', card: '#D8EEF6', ink: '#0F2638' },
  mint:      { bg: '#98FF98', card: '#D4F8D4', ink: '#0E2810' },
  lilac:     { bg: '#E6E6FA', card: '#F2F2FC', ink: '#28203A' },
  butter:    { bg: '#FFEFA0', card: '#FFF8D0', ink: '#3A2E0A' },
  coral:     { bg: '#FF9988', card: '#FFC8B8', ink: '#3A1A14' },
  sage:      { bg: '#CDE5C5', card: '#E5F2DF', ink: '#1F3018' },
  bubblegum: { bg: '#FFB8DC', card: '#FFD8EA', ink: '#3A1428' },
  midnight:  { bg: '#3F3F5F', card: '#4F4F73', ink: '#F0EFFF' },
};

function V53Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V53_BG_TONES[settings.themeColors.v53.bgTone] || V53_BG_TONES.peach;
  const { bg, card, ink } = tone;
  const accent = settings.themeColors.v53.accent;
  const isDark = ink === '#F0EFFF';
  const total = book.chaptersMeta.length;
  // Clay shadow stack: thick outer + inset highlights
  const clayShadow = `
    0 8px 0 ${ink}, 0 8px 16px rgba(0,0,0,0.18),
    inset 0 -3px 0 rgba(0,0,0,0.12), inset 0 3px 0 rgba(255,255,255,0.4)
  `;
  const buttonShadow = `
    0 4px 0 ${ink}, 0 4px 8px rgba(0,0,0,0.18),
    inset 0 -2px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.4)
  `;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink,
      fontFamily: '"Inter","Noto Sans TC",system-ui,sans-serif', padding: '40px 32px 60px',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* fluffy chapter blob */}
        <div style={{
          padding: '18px 24px', marginBottom: 28, borderRadius: 32,
          background: card, border: `4px solid ${ink}`,
          boxShadow: clayShadow,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 22,
            background: accent, border: `3px solid ${ink}`,
            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.45), 0 3px 0 rgba(0,0,0,0.5)',
            color: isDark ? card : '#FFFFFF', fontSize: 22, fontWeight: 800,
            display: 'grid', placeItems: 'center', textShadow: '0 2px 0 rgba(0,0,0,0.18)',
          }}>{chapterIdx + 1}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 800, color: accent, textTransform: 'uppercase', marginBottom: 2 }}>
              CH {chapterIdx + 1} / {total}
            </div>
            <div style={{ fontSize: settings.tweaks.fontSize + 4, fontWeight: 700, lineHeight: 1.2, color: ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
          </div>
        </div>

        {/* body card */}
        <div style={{
          padding: '32px 36px', borderRadius: 32,
          background: card, border: `4px solid ${ink}`,
          boxShadow: clayShadow,
        }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'inherit',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32 }}>
            <button onClick={onPrev} disabled={!canPrev} style={{
              opacity: canPrev ? 1 : 0.35, padding: '12px 22px', borderRadius: 24,
              background: bg, color: ink, border: `3px solid ${ink}`,
              boxShadow: buttonShadow,
              fontFamily: 'inherit', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', cursor: canPrev ? 'pointer' : 'default',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
            }}
              onMouseDown={(e) => { if (canPrev) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = `0 1px 0 ${ink}, 0 1px 2px rgba(0,0,0,0.18), inset 0 -2px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.4)`; } }}
              onMouseUp={(e) => { if (canPrev) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = buttonShadow; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = buttonShadow; }}
            >← Back</button>
            <button onClick={onNext} disabled={!canNext} style={{
              opacity: canNext ? 1 : 0.35, padding: '12px 22px', borderRadius: 24,
              background: accent, color: isDark ? card : '#FFFFFF', border: `3px solid ${ink}`,
              boxShadow: buttonShadow, textShadow: '0 1px 0 rgba(0,0,0,0.2)',
              fontFamily: 'inherit', fontWeight: 800, fontSize: 13, letterSpacing: '0.1em', cursor: canNext ? 'pointer' : 'default',
              transition: 'transform 80ms ease, box-shadow 80ms ease',
            }}
              onMouseDown={(e) => { if (canNext) { e.currentTarget.style.transform = 'translateY(3px)'; e.currentTarget.style.boxShadow = `0 1px 0 ${ink}, 0 1px 2px rgba(0,0,0,0.18), inset 0 -2px 0 rgba(0,0,0,0.18), inset 0 2px 0 rgba(255,255,255,0.4)`; } }}
              onMouseUp={(e) => { if (canNext) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = buttonShadow; } }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = buttonShadow; }}
            >Next →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V53Footer({ book, chapterIdx, settings }) {
  const tone = V53_BG_TONES[settings.themeColors.v53.bgTone] || V53_BG_TONES.peach;
  const accent = settings.themeColors.v53.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `3px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Inter",system-ui,sans-serif', fontSize: 11, fontWeight: 800,
    }}>
      <span style={{ letterSpacing: '0.2em' }}>CH {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 10, borderRadius: 999, background: tone.card, border: `2px solid ${tone.ink}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: accent, boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.4)' }}/>
      </div>
      <span style={{ color: accent, fontWeight: 800 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V53Reader = V53Reader;
window.V53Footer = V53Footer;
