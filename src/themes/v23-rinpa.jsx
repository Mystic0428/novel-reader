// src/themes/v23-rinpa.jsx — Rinpa golden screen: gold gradient + plum branch + tanzaku card + cinnabar seal
const V23_BG_TONES = {
  gold:       { bg1: '#E8CB68', bg2: '#C9A84A', bg3: '#8C6E28', goldD: '#8C6E28' },
  copper:     { bg1: '#E0AC6A', bg2: '#B8843E', bg3: '#7A4E1A', goldD: '#7A4E1A' },
  silver:     { bg1: '#E0DCC8', bg2: '#B8B0A0', bg3: '#6E6856', goldD: '#6E6856' },
  jade:       { bg1: '#C8D8B8', bg2: '#9AB48E', bg3: '#5E7A4E', goldD: '#5E7A4E' },
  plum:       { bg1: '#E8C8C0', bg2: '#C09A92', bg3: '#7A5A52', goldD: '#7A5A52' },
  pine:       { bg1: '#B8C8A8', bg2: '#8AA078', bg3: '#4E5E3E', goldD: '#4E5E3E' },
  vermillion: { bg1: '#E8B098', bg2: '#C0846A', bg3: '#8E4E2E', goldD: '#8E4E2E' },
  cobalt:     { bg1: '#A8B8D8', bg2: '#7A8AB0', bg3: '#3E4E78', goldD: '#3E4E78' },
  charcoal:   { bg1: '#A8A498', bg2: '#7A7668', bg3: '#3E3A2E', goldD: '#3E3A2E' },
};

function V23Plum({ size = 200, ink = '#3A2A1A', petal = '#B4352A', center = '#C9A84A' }) {
  return (
    <svg viewBox="0 0 200 160" width={size} height={size * 0.8}>
      <g stroke={ink} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M10,140 Q60,110 100,80 Q140,50 180,55"/>
        <path d="M100,80 Q120,60 135,30"/>
      </g>
      {[[135, 30], [180, 55], [100, 80], [60, 110], [150, 40]].map(([cx, cy], i) => (
        <g key={i} transform={`translate(${cx},${cy})`}>
          {Array.from({ length: 5 }).map((_, j) => {
            const a = (j / 5) * Math.PI * 2;
            return <circle key={j} cx={Math.cos(a) * 5} cy={Math.sin(a) * 5} r="4.5" fill={petal}/>;
          })}
          <circle r="2.5" fill={center}/>
        </g>
      ))}
    </svg>
  );
}

function V23Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V23_BG_TONES[settings.themeColors.v23.bgTone] || V23_BG_TONES.gold;
  const { bg1, bg2, bg3, goldD } = tone;
  const cinnabar = settings.themeColors.v23.accent;
  const ink = '#1A1412';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1,
      background: `linear-gradient(135deg, ${bg1} 0%, ${bg2} 35%, ${bg3} 75%, ${bg2} 100%)`,
      color: ink, position: 'relative', fontFamily: 'var(--serif)', padding: '40px 0',
    }}>
      {/* gold-leaf grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'overlay',
        backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(139,110,40,0.12) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}/>
      {/* screen folds */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `linear-gradient(90deg, rgba(0,0,0,0.10) 0%, transparent 2%, transparent 33%, rgba(0,0,0,0.10) 35%, transparent 37%, transparent 66%, rgba(0,0,0,0.10) 68%, transparent 70%, transparent 100%)`,
      }}/>

      <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto', padding: '0 56px' }}>
        {/* plum branch decoration */}
        <div style={{ position: 'absolute', left: 30, top: 8, opacity: 0.85 }}>
          <V23Plum size={180} ink={'#3A2A1A'} petal={cinnabar} center={goldD}/>
        </div>

        <header style={{ marginBottom: 30, marginLeft: 60, paddingTop: 20, position: 'relative' }}>
          <div style={{ fontSize: 11, color: 'rgba(26,20,18,0.7)', letterSpacing: '0.4em', marginBottom: 6 }}>
            第 {chapterIdx + 1} 帖
          </div>
          <h1 style={{
            fontSize: settings.tweaks.fontSize + 14, fontWeight: 500, color: ink, letterSpacing: '0.15em', margin: 0, lineHeight: 1.2,
          }}>{stripChapterPrefix(chapterTitle)}</h1>
        </header>

        {/* tanzaku card body */}
        <div style={{
          background: 'rgba(248,236,214,0.94)', border: `1px solid ${goldD}`,
          boxShadow: '0 14px 40px rgba(60,40,10,0.28)', padding: '28px 36px', backdropFilter: 'blur(2px)',
          position: 'relative',
        }}>
          {/* seal top right */}
          <div style={{
            position: 'absolute', top: -14, right: 30, width: 44, height: 44,
            background: cinnabar, color: '#F5E8D5', border: `2px solid ${goldD}`,
            display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 600, transform: 'rotate(-4deg)',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.25)',
          }}>第{(chapterIdx + 1)}</div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': cinnabar,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 18, borderTop: `1px solid ${goldD}55` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: ink, border: `1px solid ${goldD}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>‹ 前帖</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: cinnabar, color: '#F5E8D5', border: `1px solid ${goldD}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>次帖 ›</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V23Footer({ book, chapterIdx, settings }) {
  const tone = V23_BG_TONES[settings.themeColors.v23.bgTone] || V23_BG_TONES.gold;
  const cinnabar = settings.themeColors.v23.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#1A1412', borderTop: `1px solid ${tone.goldD}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ letterSpacing: '0.3em' }}>第 {chapterIdx + 1} / {total} 帖</span>
      <div style={{ flex: 1, height: 2, background: `${tone.goldD}55`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: cinnabar }}/>
      </div>
      <span style={{ color: cinnabar, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V23Reader = V23Reader;
window.V23Footer = V23Footer;
