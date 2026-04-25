// src/themes/v51-rams.jsx — Dieter Rams / Braun industrial: cream-grey panels, monospace LCD, orange accent, knob/slider chrome
const V51_BG_TONES = {
  cream:    { bg: '#E8E6E1', panel: '#DFDCD5', panelD: '#C4C1B8', screen: '#2A2E2A', screenInk: '#9EC29E' },
  steel:    { bg: '#D8D6D2', panel: '#CFCCC5', panelD: '#B0ADA5', screen: '#1F2628', screenInk: '#6FB4D8' },
  pearl:    { bg: '#F0EDE5', panel: '#E5E2D8', panelD: '#CFCCC0', screen: '#2A2A2E', screenInk: '#A0C8E0' },
  graphite: { bg: '#3A3A38', panel: '#2E2E2C', panelD: '#1F1F1E', screen: '#0E1410', screenInk: '#6FE89B' },
  matte:    { bg: '#2A2826', panel: '#1F1E1C', panelD: '#141312', screen: '#0A0F0A', screenInk: '#FFB454' },
  sand:     { bg: '#DDD5C4', panel: '#D0C7B5', panelD: '#B5A98E', screen: '#262420', screenInk: '#D4C896' },
  fog:      { bg: '#D8D8D8', panel: '#CCCCCC', panelD: '#A8A8A8', screen: '#202428', screenInk: '#C0E0F0' },
  bone:     { bg: '#E8E0CE', panel: '#DCD2BC', panelD: '#BFB298', screen: '#262420', screenInk: '#E8C896' },
  black:    { bg: '#1A1A1A', panel: '#0E0E0E', panelD: '#040404', screen: '#0A0A0A', screenInk: '#E8C896' },
};

function V51Knob({ size = 44, pos = 0.5, label, ink, panel, panelD, soft }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, #F0EDE6 0%, ${panel} 55%, ${panelD} 100%)`,
        boxShadow: `0 2px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.1)`,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 4, left: '50%', width: 2, height: size * 0.3, background: ink,
          transformOrigin: `1px ${size / 2 - 4}px`, transform: `translateX(-1px) rotate(${pos * 270 - 135}deg)`,
        }}/>
      </div>
      {label && <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', color: ink }}>{label}</div>}
    </div>
  );
}

function V51Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V51_BG_TONES[settings.themeColors.v51.bgTone] || V51_BG_TONES.cream;
  const { bg, panel, panelD, screen, screenInk } = tone;
  const orange = settings.themeColors.v51.accent;
  const ink = bg === '#3A3A38' || bg === '#2A2826' || bg === '#1A1A1A' ? '#E8E6E1' : '#1A1A1A';
  const soft = ink === '#1A1A1A' ? 'rgba(26,26,26,0.7)' : 'rgba(232,230,225,0.7)';
  const mute = ink === '#1A1A1A' ? 'rgba(26,26,26,0.45)' : 'rgba(232,230,225,0.45)';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 26,
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        background: panel, border: `1px solid ${panelD}`, borderRadius: 4,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.08)`,
        padding: '26px 34px',
      }}>
        {/* device header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '-0.02em', color: ink }}>Reader T1000</div>
            <div style={{ fontSize: 9, color: soft, letterSpacing: '0.25em', fontWeight: 500 }}>Literary Playback Unit</div>
          </div>
          <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', color: soft }}>— Less, but better.</div>
        </div>

        {/* LCD screen */}
        <div style={{
          background: screen, border: `1px solid ${ink}`, borderRadius: 2, padding: '12px 14px',
          color: screenInk, fontFamily: '"JetBrains Mono","Menlo",monospace', fontSize: 10, letterSpacing: '0.1em',
          boxShadow: `inset 0 2px 4px rgba(0,0,0,0.4)`, marginBottom: 18,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>CH.{String(chapterIdx + 1).padStart(2, '0')} · {String(total).padStart(3, '0')}</span>
            <span>◄ READ ►</span>
          </div>
          <div style={{ fontSize: 14, margin: '4px 0', fontWeight: 600 }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ display: 'flex', gap: 2, margin: '4px 0' }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 3, background: i < Math.round(progress * 24) ? screenInk : `${screenInk}44` }}/>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9 }}>
            <span>{(progress * 100).toFixed(1)}%</span>
            <span style={{ opacity: 0.5 }}>/ {(book.author || 'Anonymous').toUpperCase()}</span>
          </div>
        </div>

        {/* control bank */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 22 }}>
          <V51Knob size={48} pos={(settings.tweaks.fontSize - 10) / 22} label="SIZE" ink={ink} panel={panel} panelD={panelD} soft={soft}/>
          <V51Knob size={48} pos={(settings.tweaks.lineHeight - 0.6) / 1.8} label="LEAD" ink={ink} panel={panel} panelD={panelD} soft={soft}/>
          <div style={{ flex: 1, height: 28, background: panelD, border: `1px solid ${ink}`, borderRadius: 2, position: 'relative', boxShadow: `inset 0 1px 2px rgba(0,0,0,0.15)` }}>
            <div style={{
              position: 'absolute', left: `${progress * 100}%`, top: -4, width: 18, height: 36,
              background: `linear-gradient(180deg, #F8F6F0 0%, ${panel} 100%)`,
              border: `1px solid ${ink}`, borderRadius: 2, boxShadow: `0 2px 3px rgba(0,0,0,0.2)`,
              transform: 'translateX(-9px)',
            }}>
              <div style={{ position: 'absolute', top: 14, left: 1, right: 1, height: 2, background: ink }}/>
            </div>
          </div>
        </div>

        {/* body */}
        <div style={{ borderTop: `1px solid ${panelD}`, paddingTop: 16, marginTop: 8 }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink,
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : '"Noto Sans TC","Inter",sans-serif',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': orange,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        {/* technical footer */}
        <div style={{
          display: 'flex', gap: 16, fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', color: soft,
          borderTop: `1px solid ${panelD}`, paddingTop: 10, marginTop: 18,
        }}>
          <span>◉ TYPE</span>
          <span>◉ SIZE · {settings.tweaks.fontSize}/{Math.round(settings.tweaks.fontSize * settings.tweaks.lineHeight)}</span>
          <span>◉ MEASURE</span>
          <span style={{ flex: 1 }}/>
          <span style={{ color: orange }}>● REC</span>
        </div>

        {/* transport buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 14 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ padding: '12px 0', background: panelD, color: ink, border: `1px solid ${ink}`, borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: canPrev ? 'pointer' : 'default', opacity: canPrev ? 1 : 0.4, fontFamily: 'inherit' }}>◄◄</button>
          <button disabled style={{ padding: '12px 0', background: panelD, color: ink, border: `1px solid ${ink}`, borderRadius: 2, fontSize: 14, fontWeight: 700, fontFamily: 'inherit' }}>■</button>
          <button disabled style={{ padding: '12px 0', background: orange, color: '#fff', border: `1px solid ${ink}`, borderRadius: 2, fontSize: 14, fontWeight: 700, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.3)`, fontFamily: 'inherit' }}>►</button>
          <button onClick={onNext} disabled={!canNext} style={{ padding: '12px 0', background: panelD, color: ink, border: `1px solid ${ink}`, borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: canNext ? 'pointer' : 'default', opacity: canNext ? 1 : 0.4, fontFamily: 'inherit' }}>►►</button>
        </div>
      </div>
    </main>
  );
}

function V51Footer({ book, chapterIdx, settings }) {
  const tone = V51_BG_TONES[settings.themeColors.v51.bgTone] || V51_BG_TONES.cream;
  const orange = settings.themeColors.v51.accent;
  const ink = tone.bg === '#3A3A38' || tone.bg === '#2A2826' || tone.bg === '#1A1A1A' ? '#E8E6E1' : '#1A1A1A';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: ink, borderTop: `1px solid ${tone.panelD}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"JetBrains Mono","Menlo",monospace', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em',
    }}>
      <span>CH.{String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 2, background: `${ink}22`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: orange }}/>
      </div>
      <span style={{ color: orange, fontWeight: 700 }}>● {Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V51Reader = V51Reader;
window.V51Footer = V51Footer;
