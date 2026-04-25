// src/themes/v3-pixel.jsx — 8-bit pixel art: NES palette, blocky shadow borders, HP-bar progress, monospace headers
const V3_BG_TONES = {
  nes:        { bg: '#2D1B69', ink: '#FAEBD7', surface: '#1A0E40', shadow: '#0A0420' },
  cream:      { bg: '#FAEBD7', ink: '#1A1A1A', surface: '#E8DCC0', shadow: '#A89870' },
  midnight:   { bg: '#0E0E2C', ink: '#A8E0F0', surface: '#1A1A40', shadow: '#040414' },
  forest:     { bg: '#1A3A20', ink: '#C8F0B8', surface: '#0A2810', shadow: '#04140A' },
  sunset:     { bg: '#5A1A1A', ink: '#FFE0A8', surface: '#3A0E0E', shadow: '#1A0404' },
  clay:       { bg: '#7A4A2A', ink: '#FFE0B8', surface: '#5A3818', shadow: '#2A1808' },
  sky:        { bg: '#3A78C8', ink: '#FFF8C8', surface: '#1A4A8A', shadow: '#0A2858' },
  grape:      { bg: '#5A2A78', ink: '#FFC8E8', surface: '#3A1A58', shadow: '#1A0A28' },
  matrix:     { bg: '#0A1A0A', ink: '#33FF66', surface: '#0A2A0A', shadow: '#000400' },
};

function V3PixelHeart({ size = 14, color = '#FF004D' }) {
  // 8-bit heart sprite drawn with rectangles (pixel-perfect)
  const px = size / 7;
  const cells = [
    [0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
  ];
  return (
    <svg width={7 * px} height={6 * px} shapeRendering="crispEdges">
      {cells.map((row, y) => row.map((c, x) =>
        c ? <rect key={`${x},${y}`} x={x * px} y={y * px} width={px} height={px} fill={color}/> : null
      ))}
    </svg>
  );
}

function V3Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V3_BG_TONES[settings.themeColors.v3.bgTone] || V3_BG_TONES.nes;
  const { bg, ink, surface, shadow } = tone;
  const accent = settings.themeColors.v3.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const blocks = 24;
  const filledBlocks = Math.round(progress * blocks);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: '40px 0',
      imageRendering: 'pixelated', fontFamily: '"Press Start 2P","JetBrains Mono","Menlo",monospace',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
        {/* chapter banner with blocky 4px box-shadow border */}
        <div style={{
          background: surface, padding: '16px 18px', marginBottom: 28,
          boxShadow: `4px 4px 0 ${shadow}, 8px 8px 0 ${accent}`,
          border: `2px solid ${ink}`, position: 'relative',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <V3PixelHeart size={16} color={accent}/>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: ink, opacity: 0.85 }}>
              STAGE {String(chapterIdx + 1).padStart(2, '0')}-{String(total).padStart(2, '0')}
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 9, letterSpacing: '0.2em', color: accent }}>×{total - chapterIdx}</div>
          </div>
          {/* HP-style progress bar (discrete blocks) */}
          <div style={{ display: 'flex', gap: 1, height: 8, marginBottom: 12 }}>
            {Array.from({ length: blocks }).map((_, i) => (
              <div key={i} style={{
                flex: 1, background: i < filledBlocks ? accent : `${ink}22`,
                boxShadow: i < filledBlocks ? `inset 0 1px 0 ${accent}88` : 'none',
              }}/>
            ))}
          </div>
          <div style={{ fontSize: settings.tweaks.fontSize - 2, color: ink, lineHeight: 1.4, fontFamily: 'inherit', wordBreak: 'break-word' }}>
            ▶ {stripChapterPrefix(chapterTitle)}
          </div>
        </div>

        {/* body — switch to readable serif/sans (pixel font is unreadable for paragraphs) */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
          color: ink, fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* nav buttons — A/B button style */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 32, paddingTop: 18, borderTop: `2px solid ${ink}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            opacity: canPrev ? 1 : 0.3, padding: '10px 16px', background: surface, color: ink,
            border: `2px solid ${ink}`, borderRadius: 0,
            boxShadow: `3px 3px 0 ${shadow}`,
            fontSize: 11, fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, cursor: canPrev ? 'pointer' : 'default',
          }}>◀ B · BACK</button>
          <button onClick={onNext} disabled={!canNext} style={{
            opacity: canNext ? 1 : 0.3, padding: '10px 16px', background: accent, color: surface,
            border: `2px solid ${ink}`, borderRadius: 0,
            boxShadow: `3px 3px 0 ${shadow}`,
            fontSize: 11, fontFamily: 'inherit', letterSpacing: '0.18em', fontWeight: 700, cursor: canNext ? 'pointer' : 'default',
          }}>A · NEXT ▶</button>
        </div>
      </div>
    </main>
  );
}

function V3Footer({ book, chapterIdx, settings }) {
  const tone = V3_BG_TONES[settings.themeColors.v3.bgTone] || V3_BG_TONES.nes;
  const accent = settings.themeColors.v3.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const blocks = 32;
  const filled = Math.round(progress * blocks);
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, color: tone.ink, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 12, fontFamily: '"Press Start 2P","JetBrains Mono",monospace', fontSize: 9, letterSpacing: '0.18em',
    }}>
      <span>STG {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, display: 'flex', gap: 1, height: 6 }}>
        {Array.from({ length: blocks }).map((_, i) => (
          <div key={i} style={{ flex: 1, background: i < filled ? accent : `${tone.ink}22` }}/>
        ))}
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100).toString().padStart(2, '0')}%</span>
    </div>
  );
}

window.V3Reader = V3Reader;
window.V3Footer = V3Footer;
