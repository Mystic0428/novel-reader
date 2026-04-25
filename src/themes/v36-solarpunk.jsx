// src/themes/v36-solarpunk.jsx — Solarpunk: cream + sage + terracotta, sun rays, leaf badges, growing vines
const V36_BG_TONES = {
  cream:      { bg1: '#F7EBC4', bg2: '#EFDD98', sage: '#B8D08A', sageD: '#6E9A4A', moss: '#3A5E28', terracotta: '#C87456', sun: '#E8B64A' },
  ivory:      { bg1: '#FAF2D8', bg2: '#F0E0AC', sage: '#C0D898', sageD: '#789E54', moss: '#3E6228', terracotta: '#C87456', sun: '#E8B64A' },
  sunlit:     { bg1: '#FFF0CC', bg2: '#FAE3A0', sage: '#C8DC9A', sageD: '#80A858', moss: '#3E6428', terracotta: '#C87456', sun: '#F0BE38' },
  mossy:      { bg1: '#E8E5C0', bg2: '#D8D5A8', sage: '#A8C078', sageD: '#5E8A38', moss: '#28461C', terracotta: '#A85838', sun: '#C89838' },
  terracotta: { bg1: '#F0DCBC', bg2: '#E5C898', sage: '#B8C480', sageD: '#789244', moss: '#3A5024', terracotta: '#B85A3A', sun: '#D89030' },
  bamboo:     { bg1: '#EFE8C0', bg2: '#DDD2A0', sage: '#B8C880', sageD: '#7AA050', moss: '#385828', terracotta: '#A85838', sun: '#D8A030' },
  willow:     { bg1: '#E8EAC8', bg2: '#D5D8A8', sage: '#A8C088', sageD: '#5E8848', moss: '#284428', terracotta: '#985830', sun: '#C89838' },
  meadow:     { bg1: '#E0EAA8', bg2: '#C8D88E', sage: '#9CB870', sageD: '#5A8038', moss: '#244018', terracotta: '#985020', sun: '#C8902E' },
  earthen:    { bg1: '#DAC8A0', bg2: '#C8B485', sage: '#A0B070', sageD: '#688048', moss: '#2E441E', terracotta: '#A85028', sun: '#B88030' },
};

function V36Sun({ size, color }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size}>
      <circle cx="50" cy="50" r="22" fill={color}/>
      <g stroke={color} strokeWidth="2.5" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return <line key={i}
            x1={50 + Math.cos(a) * 30} y1={50 + Math.sin(a) * 30}
            x2={50 + Math.cos(a) * 42} y2={50 + Math.sin(a) * 42}/>;
        })}
      </g>
    </svg>
  );
}

function V36Leaf({ color, size = 36, rot = 0, vein }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M30,6 Q54,20 48,46 Q42,56 30,54 Q18,56 12,46 Q6,20 30,6 Z" fill={color}/>
      <path d="M30,8 Q30,54 30,54" stroke={vein} strokeWidth="1" fill="none"/>
      <g stroke={vein} strokeWidth="0.6" fill="none" opacity="0.6">
        <path d="M30,16 Q40,22 44,30 M30,24 Q40,30 42,38 M30,32 Q38,40 40,46 M30,20 Q20,24 16,32 M30,28 Q20,32 18,40"/>
      </g>
    </svg>
  );
}

function V36Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V36_BG_TONES[settings.themeColors.v36.bgTone] || V36_BG_TONES.cream;
  const { bg1, bg2, sage, sageD, moss, terracotta, sun } = tone;
  const accent = settings.themeColors.v36.accent;
  const ink = '#2A3A1C', mute = 'rgba(42,58,28,0.55)', soft = 'rgba(42,58,28,0.82)';
  const cream = bg1;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: `linear-gradient(180deg, ${bg1} 0%, ${bg2} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC",serif', padding: 0, position: 'relative',
    }}>
      <div style={{ position: 'relative', minHeight: '100%', boxSizing: 'border-box', paddingBottom: 70 }}>
        {/* sun top-left */}
        <div style={{ position: 'absolute', left: -30, top: -30, opacity: 0.85, pointerEvents: 'none' }}>
          <V36Sun size={180} color={sun}/>
        </div>
        {/* leaves bottom-left */}
        <div style={{ position: 'absolute', left: 24, bottom: 80, opacity: 0.75, pointerEvents: 'none' }}>
          <V36Leaf color={moss} size={80} rot={-20} vein={cream}/>
        </div>
        <div style={{ position: 'absolute', left: 130, bottom: 30, opacity: 0.85, pointerEvents: 'none' }}>
          <V36Leaf color={sageD} size={56} rot={30} vein={cream}/>
        </div>

        <header style={{ padding: '24px 40px 14px 150px', position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: 11, color: moss, letterSpacing: '0.45em', fontWeight: 700 }}>
            ☀ SOLARPUNK · 共 生 讀 物 ☀
          </div>
          <div style={{ fontSize: settings.tweaks.fontSize + 24, color: moss, letterSpacing: '0.12em', marginTop: 4, fontWeight: 500 }}>
            {book.title}
          </div>
          <div style={{ fontSize: 12, color: soft, fontStyle: 'italic', letterSpacing: '0.1em', marginTop: 2 }}>
            "A garden within a dream, a dream within a garden."
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 22, padding: '12px 40px 30px', position: 'relative', zIndex: 2 }}>
          {/* round chapter badge */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <div style={{
              width: 160, height: 160, borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${sage} 0%, ${sageD} 60%, ${moss} 100%)`,
              boxShadow: `0 6px 20px rgba(60,90,30,0.3), inset 0 0 0 4px ${cream}`,
              display: 'grid', placeItems: 'center', position: 'relative',
            }}>
              <V36Leaf color={cream} size={84} vein={moss}/>
              <div style={{
                position: 'absolute', bottom: 12, fontSize: 10, color: cream, letterSpacing: '0.4em', fontWeight: 700,
              }}>CH · {String(chapterIdx + 1).padStart(2, '0')}</div>
            </div>
            <div style={{
              padding: '8px 14px', background: sage, color: moss, border: `2px solid ${moss}`,
              borderRadius: 18, fontSize: 11, letterSpacing: '0.18em', fontWeight: 700,
            }}>🌱 GROWING · {total ? Math.round(((chapterIdx + 1) / total) * 100) : 0}%</div>
            <div style={{ textAlign: 'center', fontSize: 11, color: mute, lineHeight: 1.7, fontStyle: 'italic' }}>
              harvested from<br/>
              <span style={{ color: terracotta, fontWeight: 700 }}>{book.author || 'Anonymous'}</span>
            </div>
          </aside>

          {/* body */}
          <div style={{
            padding: '22px 28px',
            background: 'rgba(247,235,196,0.7)', border: `1.5px solid ${sageD}`, borderRadius: 18,
            boxShadow: `0 6px 20px rgba(110,154,74,0.18), inset 0 0 0 1px ${cream}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <V36Sun size={36} color={sun}/>
              <div>
                <div style={{ fontSize: settings.tweaks.fontSize + 5, fontWeight: 600, color: moss, letterSpacing: '0.1em' }}>
                  {stripChapterPrefix(chapterTitle)}
                </div>
                <div style={{ fontSize: 11, color: mute, letterSpacing: '0.2em', marginTop: 2 }}>
                  SEEDLING · CH. {chapterIdx + 1} / {total}
                </div>
              </div>
            </div>
            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              '--accent': accent,
            }} dangerouslySetInnerHTML={{ __html: html }}/>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', margin: '20px 0 10px', color: sageD }}>
              <V36Leaf color={sageD} size={18} vein={cream}/>
              <div style={{ flex: 1, height: 1, background: sageD, opacity: 0.5 }}/>
              <span style={{ fontSize: 10, color: moss, letterSpacing: '0.4em', fontWeight: 700 }}>· 種 ·</span>
              <div style={{ flex: 1, height: 1, background: sageD, opacity: 0.5 }}/>
              <V36Leaf color={sageD} size={18} rot={180} vein={cream}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <button onClick={onPrev} disabled={!canPrev} style={{
                ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 18,
                background: 'transparent', color: moss, border: `1.5px solid ${sageD}`, fontFamily: 'inherit',
                letterSpacing: '0.18em', fontWeight: 600,
              }}>‹ 前 種</button>
              <button onClick={onNext} disabled={!canNext} style={{
                ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 18,
                background: sage, color: moss, border: `1.5px solid ${moss}`, fontFamily: 'inherit',
                letterSpacing: '0.18em', fontWeight: 700,
              }}>下 種 ›</button>
            </div>
          </div>
        </div>

        {/* bottom vine */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, opacity: 0.5, pointerEvents: 'none' }}>
          <svg viewBox="0 0 1280 50" width="100%" height="50" preserveAspectRatio="none">
            <path d="M0,25 Q80,8 160,25 T320,25 T480,25 T640,25 T800,25 T960,25 T1120,25 T1280,25" stroke={sageD} strokeWidth="2" fill="none"/>
            {[100, 260, 420, 580, 740, 900, 1060, 1220].map((x, i) => (
              <g key={i} transform={`translate(${x},${i % 2 ? 5 : 45})`}>
                <path d={`M0,0 Q${i % 2 ? 10 : -10},-12 0,-20 Q${i % 2 ? -10 : 10},-12 0,0 Z`} fill={sageD}/>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </main>
  );
}

function V36Footer({ book, chapterIdx, settings }) {
  const tone = V36_BG_TONES[settings.themeColors.v36.bgTone] || V36_BG_TONES.cream;
  const accent = settings.themeColors.v36.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg1, color: '#2A3A1C', borderTop: `1px solid ${tone.sageD}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: tone.moss, fontWeight: 700, letterSpacing: '0.22em' }}>🌱 種 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 999, background: `${tone.sageD}33`, overflow: 'hidden' }}>
        <div style={{ width: `${progress * 100}%`, height: '100%', background: `linear-gradient(90deg, ${tone.sageD} 0%, ${tone.sun} 100%)` }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V36Reader = V36Reader;
window.V36Footer = V36Footer;
