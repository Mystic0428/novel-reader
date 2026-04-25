// src/themes/v87-popup.jsx — pop-up book: layered paper depth, fold shadows, bright pastel
const V87_BG_TONES = {
  cardboard: { bg: '#E8D8B8', layer1: '#FAEEDC', layer2: '#FFFCEC', ink: '#3A2818', mute: '#8B6838', accent: '#C8683A' },
  cream:     { bg: '#FFF8E8', layer1: '#FFFCEC', layer2: '#FFFFFF', ink: '#3A1F18', mute: '#8B5828', accent: '#E8784A' },
  sky:       { bg: '#D8ECFF', layer1: '#E8F4FF', layer2: '#FAFCFF', ink: '#0A1A38', mute: '#5878A8', accent: '#3858E8' },
  peach:     { bg: '#FFE0D0', layer1: '#FFE8DC', layer2: '#FFFCEC', ink: '#3A1A14', mute: '#8B5848', accent: '#FF6B5C' },
  lavender:  { bg: '#E8DCFF', layer1: '#F0E4FF', layer2: '#FAF4FF', ink: '#28184A', mute: '#7858A0', accent: '#A878E8' },
  mint:      { bg: '#D0F0DC', layer1: '#E0F8E8', layer2: '#FAFCEC', ink: '#0A2818', mute: '#487868', accent: '#48A878' },
  butter:    { bg: '#FFF0B8', layer1: '#FFF8D0', layer2: '#FFFCEC', ink: '#3A2A08', mute: '#8B6818', accent: '#E89838' },
  blush:     { bg: '#FFD8E8', layer1: '#FFE0EC', layer2: '#FFFCEC', ink: '#3A1828', mute: '#8B4878', accent: '#E84880' },
  cocoa:     { bg: '#3A2A1A', layer1: '#4A3424', layer2: '#5A4232', ink: '#F0DCB8', mute: '#A88858', accent: '#FFB454' },
};

function V87Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V87_BG_TONES[settings.themeColors.v87.bgTone] || V87_BG_TONES.cardboard;
  const accent = settings.themeColors.v87.accent;
  const { bg, layer1, layer2, ink, mute } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Patrick Hand","Caveat",cursive',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 30px 60px' }}>
        {/* layered paper stack — pop-up illusion */}
        <div style={{ position: 'relative', marginBottom: 22 }}>
          {/* back layer */}
          <div style={{
            background: layer1, padding: '36px 30px 22px', borderRadius: 8,
            boxShadow: `0 6px 0 rgba(0,0,0,0.15), 0 12px 24px rgba(0,0,0,0.2)`,
            transform: 'translateY(8px) scale(1.02)',
            position: 'absolute', inset: 0,
          }}/>
          {/* front layer (the actual content) */}
          <div style={{
            position: 'relative', background: layer2, color: ink,
            padding: '32px 36px', borderRadius: 8,
            boxShadow: `0 4px 0 rgba(0,0,0,0.1), 0 8px 18px rgba(0,0,0,0.15)`,
          }}>
            {/* fold marks */}
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1,
              background: `linear-gradient(180deg, transparent, ${accent}30 50%, transparent)`,
              pointerEvents: 'none',
            }}/>

            <div style={{
              fontFamily: '"Caveat",cursive', fontSize: 24, color: accent,
              textAlign: 'center', marginBottom: 4, fontWeight: 700,
              letterSpacing: '0.05em', textShadow: `2px 2px 0 ${layer1}`,
            }}>
              ✦ Pop! Chapter {chapterIdx + 1} ✦
            </div>

            <h1 style={{
              fontFamily: '"Patrick Hand","Caveat",cursive',
              fontSize: settings.tweaks.fontSize + 18, fontWeight: 700,
              textAlign: 'center', margin: '6px 0 14px', letterSpacing: '0.02em', color: ink,
              lineHeight: 1.1, textShadow: `2px 2px 0 ${layer1}`,
            }}>{stripChapterPrefix(chapterTitle)}</h1>

            <div style={{
              textAlign: 'center', fontSize: 14, color: mute, fontStyle: 'italic',
              marginBottom: 22, fontFamily: '"Caveat",cursive',
            }}>
              ~ illustrated by {book.author || 'someone wonderful'} ~
            </div>

            {/* tabbed corner — like the pull-tab on a pop-up */}
            <div style={{
              position: 'absolute', top: 14, right: 14,
              padding: '4px 10px',
              background: accent, color: layer2,
              borderRadius: '0 4px 4px 0',
              fontSize: 11, fontWeight: 800, letterSpacing: '0.2em',
              boxShadow: `2px 2px 0 rgba(0,0,0,0.15)`,
            }}>
              PULL ★
            </div>

            {/* body */}
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            {/* bottom doodle */}
            <div style={{
              marginTop: 24, textAlign: 'center', color: accent, fontSize: 18, letterSpacing: '0.5em',
            }}>
              ✿ ~ ✦ ~ ✿
            </div>
          </div>
        </div>

        {/* nav — pop-up tab style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 20px',
            background: layer2, color: ink, border: `2px solid ${ink}`, borderRadius: 12,
            boxShadow: `0 4px 0 ${ink}`,
            fontFamily: '"Patrick Hand",cursive', fontSize: 16, fontWeight: 700,
            transform: 'translateY(-2px)',
          }}>◀ flip back</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 20px',
            background: accent, color: '#fff', border: `2px solid ${ink}`, borderRadius: 12,
            boxShadow: `0 4px 0 ${ink}`,
            fontFamily: '"Patrick Hand",cursive', fontSize: 16, fontWeight: 700,
            transform: 'translateY(-2px)',
          }}>open next ▶</button>
        </div>
      </article>
    </main>
  );
}

function V87Footer({ book, chapterIdx, settings }) {
  const tone = V87_BG_TONES[settings.themeColors.v87.bgTone] || V87_BG_TONES.cardboard;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.layer2, borderTop: `2px solid ${tone.accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Caveat",cursive', fontSize: 16, fontStyle: 'italic', color: tone.mute,
    }}>
      <span style={{ color: tone.accent }}>✦ pop {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 4, background: tone.bg, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V87Reader = V87Reader;
window.V87Footer = V87Footer;
