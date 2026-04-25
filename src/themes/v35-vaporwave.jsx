// src/themes/v35-vaporwave.jsx — Vaporwave: gradient sunset, perspective grid, statue chromatic aberration title
const V35_BG_TONES = {
  sunset:    { bg1: '#1B0B3C', bg2: '#4A1E74', bg3: '#E55AA6', bg4: '#FFB5D9' },
  miami:     { bg1: '#0E0E2C', bg2: '#3E1864', bg3: '#FF5AB0', bg4: '#FFD0E5' },
  midnight:  { bg1: '#080820', bg2: '#2A1454', bg3: '#7E3DCC', bg4: '#E0B4F4' },
  glacier:   { bg1: '#0A2840', bg2: '#1A4878', bg3: '#5EBED0', bg4: '#A8E0F0' },
  ember:     { bg1: '#2A0810', bg2: '#5E1828', bg3: '#E04848', bg4: '#FFB89A' },
  ultra:     { bg1: '#0A0A1F', bg2: '#1F1F4A', bg3: '#5E5EE0', bg4: '#B0B0F8' },
  retro:     { bg1: '#1A0A2A', bg2: '#4A2858', bg3: '#FF8838', bg4: '#FFD8A8' },
  jade:      { bg1: '#0A2018', bg2: '#1F4838', bg3: '#5ED8A8', bg4: '#B8F0DC' },
  charcoal:  { bg1: '#080808', bg2: '#1F1F1F', bg3: '#888888', bg4: '#D8D8D8' },
};

function V35Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V35_BG_TONES[settings.themeColors.v35.bgTone] || V35_BG_TONES.sunset;
  const { bg1, bg2, bg3, bg4 } = tone;
  const grid = settings.themeColors.v35.accent;
  const cyan = '#78E6FF', pinkL = '#FFC7E7', pink = '#FF6FC5';
  const ink = '#FFE8F4', mute = 'rgba(255,232,244,0.55)', soft = 'rgba(255,232,244,0.85)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `linear-gradient(180deg, ${bg1} 0%, ${bg2} 35%, ${bg3} 75%, ${bg4} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC","Noto Serif JP",serif', padding: 0, position: 'relative',
    }}>
      <div style={{ position: 'relative', minHeight: '100%', boxSizing: 'border-box', paddingBottom: 80 }}>
        {/* Sun (glitched stripes) */}
        <div style={{
          position: 'absolute', left: '50%', top: 60, transform: 'translateX(-50%)',
          width: 220, height: 220, borderRadius: '50%',
          background: `linear-gradient(180deg, #FFE838 0%, ${pink} 55%, ${bg3} 100%)`,
          boxShadow: `0 0 60px ${pink}88, inset 0 -30px 40px rgba(0,0,0,0.25)`,
          clipPath: `polygon(0 0, 100% 0, 100% 30%, 0 30%, 0 36%, 100% 36%, 100% 42%, 0 42%, 0 50%, 100% 50%, 100% 60%, 0 60%, 0 74%, 100% 74%, 100% 100%, 0 100%)`,
          pointerEvents: 'none', opacity: 0.92,
        }}/>

        {/* Perspective grid (bottom) */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 240, perspective: 400,
          perspectiveOrigin: '50% 0%', pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute', inset: 0, transform: 'rotateX(62deg)', transformOrigin: '50% 0%',
            backgroundImage: `linear-gradient(${grid} 2px, transparent 2px), linear-gradient(90deg, ${grid} 2px, transparent 2px)`,
            backgroundSize: '60px 60px', opacity: 0.85,
          }}/>
        </div>

        <header style={{ padding: '24px 32px 14px', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: pinkL, letterSpacing: '0.6em', fontWeight: 500 }}>
            A E S T H E T I C · {chapterIdx + 1}
          </div>
          <div style={{
            fontSize: settings.tweaks.fontSize + 38, lineHeight: 1, margin: '6px 0',
            background: `linear-gradient(180deg, #fff 0%, ${pink} 55%, ${cyan} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.12em', fontWeight: 400,
          }}>{book.title}</div>
          <div style={{ fontSize: 13, color: cyan, letterSpacing: '0.5em', fontFamily: '"Noto Sans JP",serif' }}>
            ヴェイパー · ドリーム · {chapterIdx + 1} / {total}
          </div>
        </header>

        <div style={{
          position: 'relative', zIndex: 2, margin: '14px auto 36px', maxWidth: 700,
          padding: '24px 30px',
          background: 'rgba(20,10,60,0.55)', border: `1px solid ${cyan}`,
          boxShadow: `0 0 0 2px ${pink}, 0 0 40px rgba(255,45,158,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)`,
          backdropFilter: 'blur(4px)',
        }}>
          {/* scan lines overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'repeating-linear-gradient(0deg, transparent 0 3px, rgba(255,255,255,0.04) 3px 4px)',
          }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative' }}>
            <div style={{ padding: '2px 10px', border: `1px solid ${cyan}`, color: cyan, fontSize: 10, letterSpacing: '0.4em' }}>
              CH·{String(chapterIdx + 1).padStart(2, '0')}
            </div>
            <div style={{ fontSize: 14, color: pinkL, letterSpacing: '0.25em', fontFamily: '"Noto Serif JP",serif' }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 10, color: cyan, letterSpacing: '0.3em' }}>VHS</div>
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
            position: 'relative', zIndex: 1,
            textShadow: `0.6px 0 ${pink}, -0.6px 0 ${cyan}`,
            fontFamily: 'var(--serif)',
            '--accent': grid,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{
            marginTop: 14, paddingTop: 12, borderTop: `1px solid ${cyan}55`,
            display: 'flex', justifyContent: 'space-between', fontSize: 10, color: pinkL, letterSpacing: '0.3em',
          }}>
            <span>FROM TAPE 03/B</span>
            <span style={{ color: cyan }}>◆ 幻 ◆ 夢 ◆ 石 ◆</span>
            <span>MMXCI</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
            <button onClick={onPrev} disabled={!canPrev} style={{
              ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: cyan,
              border: `1px solid ${cyan}`, borderRadius: 0, fontFamily: 'inherit', letterSpacing: '0.2em', fontWeight: 600,
            }}>← REW</button>
            <button onClick={onNext} disabled={!canNext} style={{
              ...btnStyle(), opacity: canNext ? 1 : 0.3, background: pink, color: bg1,
              border: `1px solid ${pink}`, borderRadius: 0, fontFamily: 'inherit', letterSpacing: '0.2em', fontWeight: 700,
              boxShadow: `0 0 16px ${pink}88`,
            }}>FF →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V35Footer({ book, chapterIdx, settings }) {
  const tone = V35_BG_TONES[settings.themeColors.v35.bgTone] || V35_BG_TONES.sunset;
  const grid = settings.themeColors.v35.accent;
  const cyan = '#78E6FF';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg1, color: '#FFE8F4', borderTop: `1px solid ${grid}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Noto Sans JP",monospace', fontSize: 11, letterSpacing: '0.3em',
    }}>
      <span style={{ color: cyan }}>CH·{String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${cyan}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(90deg, ${cyan}, ${grid})` }}/>
      </div>
      <span style={{ color: grid, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V35Reader = V35Reader;
window.V35Footer = V35Footer;
