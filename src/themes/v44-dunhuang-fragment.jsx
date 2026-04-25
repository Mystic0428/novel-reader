// src/themes/v44-dunhuang-fragment.jsx — Mogao MS fragment: weathered wall, cinnabar grid, mineral pigment palette, lacuna marks
const V44_BG_TONES = {
  sand:       { bg1: '#E0C898', bg2: '#C8A878', bg3: '#9A7A48', vermillion: '#B8302A', cinnabar: '#8C2420' },
  ochre:      { bg1: '#E2B898', bg2: '#C49070', bg3: '#925E40', vermillion: '#A8281E', cinnabar: '#7E1A14' },
  rice:       { bg1: '#EDDDB8', bg2: '#D4BE92', bg3: '#A88A5E', vermillion: '#B8302A', cinnabar: '#8C2420' },
  bone:       { bg1: '#E8DCC8', bg2: '#CFC2A8', bg3: '#A09078', vermillion: '#B8302A', cinnabar: '#8C2420' },
  ash:        { bg1: '#D8C8A8', bg2: '#BCAA88', bg3: '#8C7A58', vermillion: '#A0301E', cinnabar: '#742018' },
  mineral:    { bg1: '#C8B898', bg2: '#A89878', bg3: '#766848', vermillion: '#B8302A', cinnabar: '#8C2420' },
  loess:      { bg1: '#DCC58C', bg2: '#BEA868', bg3: '#8E7A40', vermillion: '#B8302A', cinnabar: '#8C2420' },
  ivory:      { bg1: '#F0E2C8', bg2: '#D8C5A0', bg3: '#A88E68', vermillion: '#A82820', cinnabar: '#7C1A12' },
  dusk:       { bg1: '#C8B090', bg2: '#A8906E', bg3: '#7E6840', vermillion: '#A02018', cinnabar: '#6E1410' },
};

function V44Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V44_BG_TONES[settings.themeColors.v44.bgTone] || V44_BG_TONES.sand;
  const { bg1, bg2, bg3, vermillion, cinnabar } = tone;
  const accent = settings.themeColors.v44.accent;
  const ink = '#1E1410', soft = 'rgba(30,20,16,0.78)', mute = 'rgba(30,20,16,0.5)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1,
      background: `radial-gradient(ellipse at 40% 40%, ${bg1} 0%, ${bg2} 55%, ${bg3} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC",serif', position: 'relative', padding: '32px 0',
    }}>
      {/* loess wall noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='4' seed='5'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0.30 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        mixBlendMode: 'multiply',
      }}/>
      {/* cinnabar inset frame */}
      <div style={{
        position: 'absolute', inset: 24, border: `2px solid ${vermillion}`,
        boxShadow: `inset 0 0 0 3px ${bg1}, inset 0 0 0 4px ${cinnabar}`,
        pointerEvents: 'none', opacity: 0.82,
      }}/>

      <header style={{ padding: '20px 56px 0', position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 30 }}>
        <div>
          <div style={{ fontSize: 11, color: vermillion, letterSpacing: '0.5em', fontWeight: 700 }}>
            敦 煌 藏 經 洞 · MS Fragment
          </div>
          <div style={{
            fontSize: settings.tweaks.fontSize + 30, color: ink, letterSpacing: '0.12em', margin: '6px 0 4px',
            fontWeight: 500, textShadow: `1px 1px 0 ${bg1}, -1px -1px 0 ${bg3}`,
          }}>
            {book.title}
          </div>
          <div style={{ fontSize: 12, color: soft, letterSpacing: '0.22em', fontStyle: 'italic' }}>
            殘卷 · {stripChapterPrefix(chapterTitle)}
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{
          display: 'inline-block', padding: '4px 12px', background: vermillion, color: bg1,
          fontSize: 11, letterSpacing: '0.3em', fontWeight: 700,
        }}>
          ✦ FRAGMENT · {chapterIdx + 1} / {total} ✦
        </div>
      </header>

      <div style={{ padding: '20px 56px 50px' }}>
        <div style={{
          padding: '24px 28px',
          background: `linear-gradient(180deg, ${bg1}88 0%, ${bg2}88 100%)`,
          border: `1px solid ${bg3}`,
          boxShadow: `inset 0 0 30px rgba(108,56,24,0.2)`,
          position: 'relative',
        }}>
          {/* cinnabar columns */}
          <div style={{
            position: 'absolute', inset: '24px 28px', pointerEvents: 'none',
            backgroundImage: `repeating-linear-gradient(90deg, transparent 0 80px, ${vermillion}33 80px 81px)`,
            opacity: 0.65,
          }}/>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 14, paddingBottom: 12, borderBottom: `1.5px solid ${vermillion}` }}>
              <div style={{
                width: 36, height: 36, background: vermillion, border: `1px solid ${cinnabar}`, color: bg1,
                display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 500,
              }}>
                {['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'][Math.min(9, chapterIdx)] || (chapterIdx + 1)}
              </div>
              <div>
                <div style={{ fontSize: settings.tweaks.fontSize + 4, color: ink, letterSpacing: '0.14em', fontWeight: 500 }}>
                  {stripChapterPrefix(chapterTitle)}
                </div>
                <div style={{ fontSize: 10, color: vermillion, letterSpacing: '0.3em', fontWeight: 700, marginTop: 2 }}>
                  · 第 {chapterIdx + 1} · 殘 ·
                </div>
              </div>
            </div>

            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: '"Noto Serif TC",serif', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              textAlign: 'justify', textShadow: `0 0.5px 0 ${bg1}`,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            {/* lacuna mark */}
            <div style={{
              color: mute, fontStyle: 'italic', fontSize: settings.tweaks.fontSize - 2,
              letterSpacing: '0.6em', textAlign: 'center', marginTop: 24,
            }}>
              ……　□　□　□　此下闕失　□　□　□　……
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `1px dashed ${vermillion}88` }}>
              <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: vermillion, border: `1.5px solid ${vermillion}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontWeight: 600 }}>← 前 殘 卷</button>
              <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: vermillion, color: bg1, border: `1.5px solid ${cinnabar}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontWeight: 600, textShadow: `1px 1px 0 ${cinnabar}` }}>下 殘 卷 →</button>
            </div>
          </div>
        </div>
      </div>

      {/* mineral pigment swatches floating bottom-right */}
      <div style={{ position: 'absolute', right: 56, bottom: 70, zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', gap: 0 }}>
          {[vermillion, '#2E5A7E', '#4A7856', bg3, accent].map((c, i) => (
            <div key={i} style={{ width: 18, height: 18, background: c, border: `1px solid ${bg3}`, opacity: 0.85 }}/>
          ))}
        </div>
        <div style={{ fontSize: 8, color: mute, letterSpacing: '0.3em', fontWeight: 700 }}>MINERAL PIGMENTS</div>
      </div>
    </main>
  );
}

function V44Footer({ book, chapterIdx, settings }) {
  const tone = V44_BG_TONES[settings.themeColors.v44.bgTone] || V44_BG_TONES.sand;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#1E1410', borderTop: `1px solid ${tone.bg3}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Noto Serif TC",serif', fontSize: 11,
    }}>
      <span style={{ color: tone.vermillion, fontWeight: 700, letterSpacing: '0.3em' }}>殘 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${tone.vermillion}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.vermillion }}/>
      </div>
      <span style={{ color: tone.cinnabar, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V44Reader = V44Reader;
window.V44Footer = V44Footer;
