// src/themes/v49-cloisonne.jsx — Cloisonné enamel: cobalt blue + gilded copper wire + lotus scrolls + jewel chapter chips
const V49_BG_TONES = {
  cobalt:    { bg1: '#0B3A5E', bg2: '#05233D', cobaltL: '#2E7EC4' },
  malachite: { bg1: '#1A4A2E', bg2: '#0E2A1A', cobaltL: '#3E7E5A' },
  ruby:      { bg1: '#5E1A1A', bg2: '#3D0A0A', cobaltL: '#A8483A' },
  obsidian:  { bg1: '#1A1424', bg2: '#0E0A18', cobaltL: '#3E2858' },
  jade:      { bg1: '#2A4A4A', bg2: '#142828', cobaltL: '#4FB8B8' },
  bronze:    { bg1: '#3E2820', bg2: '#241A14', cobaltL: '#7A5638' },
  amethyst:  { bg1: '#3A1A4A', bg2: '#1F0E2A', cobaltL: '#7A4FA0' },
  forest:    { bg1: '#1A3A28', bg2: '#0E2418', cobaltL: '#3E6E48' },
  charcoal:  { bg1: '#1F2024', bg2: '#0E1014', cobaltL: '#3E4248' },
};

function V49Lotus({ width = 1100, gold, goldL, goldD, turq, coral, amber, ivory }) {
  const wire = { stroke: gold, strokeWidth: 1.4, fill: 'none', filter: `drop-shadow(0 0.5px 0 ${goldD}) drop-shadow(0 -0.3px 0 ${goldL})` };
  return (
    <svg viewBox="0 0 1200 60" width={width} height={60 * width / 1200} preserveAspectRatio="none" style={{ display: 'block' }}>
      <path d="M0,30 C100,5 200,55 300,30 S500,5 600,30 S800,55 900,30 S1100,5 1200,30" {...wire}/>
      {[150, 450, 750, 1050].map((x, i) => (
        <g key={i} transform={`translate(${x},${i % 2 ? 48 : 12})`}>
          <circle r="11" fill={turq} stroke={gold} strokeWidth="1"/>
          <circle r="6" fill={coral} stroke={gold} strokeWidth="0.8"/>
          <circle r="2.5" fill={amber} stroke={gold} strokeWidth="0.6"/>
          {Array.from({ length: 6 }).map((_, j) => {
            const a = (j / 6) * Math.PI * 2;
            return <ellipse key={j} cx={Math.cos(a) * 9} cy={Math.sin(a) * 9} rx="3.5" ry="1.8" transform={`rotate(${a * 180 / Math.PI} ${Math.cos(a) * 9} ${Math.sin(a) * 9})`} fill={ivory} stroke={gold} strokeWidth="0.5"/>;
          })}
        </g>
      ))}
    </svg>
  );
}

function V49Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V49_BG_TONES[settings.themeColors.v49.bgTone] || V49_BG_TONES.cobalt;
  const { bg1, bg2 } = tone;
  const gold = settings.themeColors.v49.accent;
  const goldL = '#F0C968', goldD = '#8C6820';
  const turq = '#4FB8B8', coral = '#E25A3E', amber = '#E8A83C';
  const ivory = '#F6EFD8';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `radial-gradient(ellipse at 40% 30%, ${bg1} 0%, ${bg2} 100%)`,
      color: ivory, fontFamily: '"Noto Serif TC",serif', padding: 0,
    }}>
      <div style={{ position: 'relative', minHeight: '100%', padding: '32px 40px', boxSizing: 'border-box' }}>
        {/* enamel sheen */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(ellipse at 25% 20%, rgba(120,200,230,0.18) 0%, transparent 40%), radial-gradient(ellipse at 80% 85%, rgba(0,0,0,0.3) 0%, transparent 50%)`,
        }}/>
        {/* gilt frame — inside relative wrapper so it scrolls with content */}
        <div style={{ position: 'absolute', inset: 12, border: `3px solid ${gold}`, boxShadow: `inset 0 0 0 1px ${goldL}, inset 0 0 0 3px ${goldD}, inset 0 0 0 5px ${gold}`, pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', inset: 22, border: `1px solid ${goldL}`, opacity: 0.6, pointerEvents: 'none' }}/>

        {/* top lotus scroll */}
      <div style={{ position: 'relative', margin: '20px 80px 0', height: 50 }}>
        <V49Lotus width={1000} gold={gold} goldL={goldL} goldD={goldD} turq={turq} coral={coral} amber={amber} ivory={ivory}/>
      </div>

      <header style={{ padding: '20px 80px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 11, color: goldL, letterSpacing: '0.6em', fontWeight: 700, textShadow: `0 1px 0 ${goldD}` }}>
          · 景 泰 藍 · CLOISONNÉ ENAMEL ·
        </div>
        <div style={{
          fontSize: settings.tweaks.fontSize + 30, letterSpacing: '0.18em', margin: '10px 0 4px', fontWeight: 500,
          background: `linear-gradient(180deg, ${goldL} 0%, ${gold} 55%, ${goldD} 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 2px 0 ${bg2})`,
        }}>{book.title}</div>
        <div style={{ fontSize: 13, color: turq, letterSpacing: '0.25em', fontStyle: 'italic' }}>
          掐絲琺瑯本 · {(book.author || 'Anonymous')}
        </div>
      </header>

      <div style={{ padding: '14px 80px 12px', display: 'flex', gap: 8 }}>
        {[turq, coral, amber, '#2E7EC4', '#7A4FA0'].slice(0, Math.min(5, total)).map((c, i) => {
          const labels = ['壹', '貳', '參', '肆', '伍'];
          const isActive = i === chapterIdx % 5;
          return (
            <div key={i} style={{
              flex: 1, padding: '8px 10px',
              background: isActive ? c : `${c}55`,
              border: `1.5px solid ${gold}`,
              boxShadow: `inset 0 0 0 1px ${goldL}`,
              opacity: isActive ? 1 : 0.7, position: 'relative',
              fontSize: 14, color: ivory, fontWeight: 500, letterSpacing: '0.12em',
              textShadow: `0 1px 0 rgba(0,0,0,0.4)`, textAlign: 'center',
            }}>
              {labels[i]}
            </div>
          );
        })}
      </div>

      <div style={{
        margin: '8px 80px 12px',
        padding: '24px 30px',
        background: `linear-gradient(180deg, ${tone.cobaltL}66 0%, ${bg2}88 100%)`,
        border: `2px solid ${gold}`,
        boxShadow: `inset 0 0 0 1px ${goldL}, inset 0 0 40px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.5)`,
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: `1px solid ${gold}` }}>
          <div style={{
            width: 40, height: 40, background: coral, border: `1.5px solid ${gold}`, boxShadow: `inset 0 0 0 1px ${goldL}`,
            display: 'grid', placeItems: 'center', fontSize: 18, color: ivory, fontWeight: 500,
          }}>{['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'][Math.min(9, chapterIdx)] || (chapterIdx + 1)}</div>
          <div style={{ fontSize: settings.tweaks.fontSize + 5, color: goldL, letterSpacing: '0.12em' }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{ fontSize: 10, color: turq, letterSpacing: '0.3em' }}>CLOISON · {chapterIdx + 1}</div>
        </div>
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Noto Serif TC",serif', color: ivory,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': gold,
        }} dangerouslySetInnerHTML={{ __html: html }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${gold}55` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: goldL, border: `1px solid ${gold}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>‹ 前 卷</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: gold, color: bg2, border: `1px solid ${goldD}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 700 }}>下 卷 ›</button>
        </div>
      </div>

        {/* bottom lotus scroll, flipped */}
        <div style={{ position: 'relative', margin: '0 80px 20px', height: 50, transform: 'scaleY(-1)' }}>
          <V49Lotus width={1000} gold={gold} goldL={goldL} goldD={goldD} turq={turq} coral={coral} amber={amber} ivory={ivory}/>
        </div>
      </div>
    </main>
  );
}

function V49Footer({ book, chapterIdx, settings }) {
  const tone = V49_BG_TONES[settings.themeColors.v49.bgTone] || V49_BG_TONES.cobalt;
  const gold = settings.themeColors.v49.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#F6EFD8', borderTop: `1px solid ${gold}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: gold, fontWeight: 700, letterSpacing: '0.3em' }}>CLOISON {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 2, background: `${gold}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold }}/>
      </div>
      <span style={{ color: '#F0C968', fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V49Reader = V49Reader;
window.V49Footer = V49Footer;
