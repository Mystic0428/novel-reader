// src/themes/v45-suzhou-garden.jsx — Suzhou garden lattice window: powdered wall, ice-crack pattern, plum/bamboo/stone, plum red seal
const V45_BG_TONES = {
  wall:      { bg1: '#F4EEE0', bg2: '#EBE2CE', bg3: '#D6C9A8', wallS: '#FAF6E8' },
  rice:      { bg1: '#F8F2DA', bg2: '#EFE4C2', bg3: '#D4C28E', wallS: '#FCF8E5' },
  ivory:     { bg1: '#F0E5D0', bg2: '#E5D5B0', bg3: '#CCB880', wallS: '#F8EFD8' },
  hemp:      { bg1: '#E8DCC0', bg2: '#D5C5A0', bg3: '#B8A478', wallS: '#F0E5C8' },
  bamboo:    { bg1: '#E5E5C8', bg2: '#D2D5A8', bg3: '#A8AC78', wallS: '#EFEFD2' },
  willow:    { bg1: '#E0E5D0', bg2: '#C8D2B0', bg3: '#9CAA80', wallS: '#E8EDD8' },
  cloud:     { bg1: '#E8E5DC', bg2: '#D8D2C0', bg3: '#A8A088', wallS: '#F0EDE0' },
  ash:       { bg1: '#DCD5C0', bg2: '#C8BFA0', bg3: '#988E70', wallS: '#E5DEC8' },
  dusk:      { bg1: '#D5CDB5', bg2: '#C0B498', bg3: '#8C8060', wallS: '#DDD5B8' },
};

function V45IceLattice({ size = 200, lattice, sky, stone, stoneD, bamboo, bambooD, plum, plumD, loquat, wallS }) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size}>
      <defs>
        <clipPath id="v45-win">
          <path d="M40,20 L200,20 L220,40 L220,200 L200,220 L40,220 L20,200 L20,40 Z"/>
        </clipPath>
      </defs>
      <g clipPath="url(#v45-win)">
        <rect width="240" height="240" fill={wallS}/>
        <path d="M0,130 L60,90 L110,120 L160,85 L210,115 L240,100 L240,240 L0,240 Z" fill={sky} opacity="0.55"/>
        <g fill={stone} stroke={stoneD} strokeWidth="1">
          <path d="M40,170 Q55,140 75,150 Q90,135 100,155 Q115,150 118,175 L118,210 L40,210 Z"/>
          <circle cx="58" cy="160" r="3" fill={wallS}/>
          <circle cx="82" cy="170" r="2.5" fill={wallS}/>
        </g>
        <g stroke={bambooD} strokeWidth="2.5" fill="none">
          <line x1="150" y1="80" x2="152" y2="200"/>
          <line x1="162" y1="75" x2="164" y2="200"/>
          <line x1="174" y1="85" x2="176" y2="200"/>
        </g>
        <g fill={bamboo}>
          <path d="M145,90 Q135,95 130,105 Q140,102 150,96 Z"/>
          <path d="M155,110 Q170,108 180,102 Q170,118 158,116 Z"/>
          <path d="M167,130 Q150,132 142,140 Q158,142 170,136 Z"/>
        </g>
        <g stroke={lattice} strokeWidth="1.8" fill="none">
          <path d="M30,80 Q60,70 90,60 Q115,55 140,52"/>
        </g>
        <g fill={plum} stroke={plumD} strokeWidth="0.5">
          {[[40, 78], [62, 70], [80, 64], [100, 58], [125, 54]].map(([cx, cy], i) => (
            <g key={i} transform={`translate(${cx},${cy})`}>
              {Array.from({ length: 5 }).map((_, j) => {
                const a = (j / 5) * Math.PI * 2;
                return <circle key={j} cx={Math.cos(a) * 2.5} cy={Math.sin(a) * 2.5} r="2"/>;
              })}
              <circle r="1.4" fill={loquat}/>
            </g>
          ))}
        </g>
      </g>
      {/* lattice frame + ice cracks */}
      <g stroke={lattice} strokeWidth="2" fill="none">
        <path d="M40,20 L200,20 L220,40 L220,200 L200,220 L40,220 L20,200 L20,40 Z"/>
        <path d="M20,80 L90,120 L20,160 M220,80 L150,120 L220,160 M80,20 L120,90 L160,20 M80,220 L120,150 L160,220 M90,120 L150,120 M120,90 L120,150"/>
      </g>
    </svg>
  );
}

function V45Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V45_BG_TONES[settings.themeColors.v45.bgTone] || V45_BG_TONES.wall;
  const { bg1, bg2, bg3, wallS } = tone;
  const lattice = '#3E2E1C';
  const stone = '#C8C0B2', stoneD = '#9A9084';
  const bamboo = '#4A6E3A', bambooD = '#2E4A24';
  const plumD = '#7C1E44';
  const loquat = '#D8A838';
  const sky = '#B8CDD4';
  const plum = settings.themeColors.v45.accent;
  const ink = '#1E1710', soft = 'rgba(30,23,16,0.78)', mute = 'rgba(30,23,16,0.5)';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1,
      background: `linear-gradient(180deg, ${bg1} 0%, ${bg2} 70%, ${bg3} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC",serif', position: 'relative', padding: '28px 0',
    }}>
      {/* powdered wall noise */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.85  0 0 0 0 0.78  0 0 0 0 0.65  0 0 0 0.10 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
        mixBlendMode: 'multiply',
      }}/>

      <header style={{ padding: '24px 60px 8px', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 20 }}>
        <div>
          <div style={{ fontSize: 10, color: plum, letterSpacing: '0.5em', fontWeight: 700 }}>
            蘇 園 清 夢 · 漏 窗 本
          </div>
          <div style={{ fontSize: settings.tweaks.fontSize + 32, color: ink, letterSpacing: '0.16em', margin: '4px 0 2px', fontWeight: 500 }}>
            {book.title.charAt(0)}<span style={{ color: plum }}>{book.title.charAt(1) || ''}</span>{book.title.slice(2)}
          </div>
          <div style={{ fontSize: 11, color: soft, letterSpacing: '0.22em', fontStyle: 'italic' }}>
            窺園 · 聽竹 · 賞石 · 觀梅
          </div>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: soft, letterSpacing: '0.3em', fontWeight: 600 }}>卷 · {chapterIdx + 1}</div>
          <div style={{ fontSize: 10, color: mute, fontStyle: 'italic' }}>Suzhou Edition</div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 22, padding: '18px 60px 60px', position: 'relative' }}>
        <aside style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            padding: 8, background: wallS, border: `1px solid ${bg3}`,
            boxShadow: `inset 0 0 0 1px ${bg2}, 0 2px 8px rgba(0,0,0,0.06)`,
          }}>
            <V45IceLattice size={200} lattice={lattice} sky={sky} stone={stone} stoneD={stoneD} bamboo={bamboo} bambooD={bambooD} plum={plum} plumD={plumD} loquat={loquat} wallS={wallS}/>
          </div>
          <div style={{ fontSize: 10, color: mute, letterSpacing: '0.4em', fontWeight: 700 }}>· 冰 裂 紋 ·</div>
          <div style={{ fontSize: 11, color: soft, fontStyle: 'italic', textAlign: 'center', lineHeight: 1.7, padding: '0 8px' }}>
            窗外有竹，<br/>有石，有一枝梅──<br/>便是整座園。
          </div>
        </aside>

        <div style={{
          padding: '24px 32px', background: wallS, border: `1px solid ${bg3}`,
          boxShadow: `0 2px 12px rgba(0,0,0,0.07), inset 0 0 0 1px ${bg2}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${bg3}` }}>
            <div style={{ width: 12, height: 12, background: plum, transform: 'rotate(45deg)', border: `1px solid ${plumD}` }}/>
            <div style={{ fontSize: settings.tweaks.fontSize + 4, color: ink, letterSpacing: '0.14em', fontWeight: 500 }}>
              第 {chapterIdx + 1} 回　{stripChapterPrefix(chapterTitle)}
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 10, color: mute, letterSpacing: '0.3em', fontStyle: 'italic' }}>through the ice-crack window</div>
          </div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: '"Noto Serif TC",serif', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': plum,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* bottom seal + quote */}
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 12, borderTop: `1px dashed ${bg3}`, paddingTop: 12 }}>
            <div style={{
              width: 32, height: 32, background: plum, color: wallS,
              display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 500,
              border: `1.5px solid ${plumD}`, transform: 'rotate(-3deg)',
            }}>夢</div>
            <div style={{ fontSize: 10, color: mute, letterSpacing: '0.25em', fontStyle: 'italic' }}>
              "滿紙荒唐言，一把辛酸淚。"
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ fontSize: 10, color: soft, letterSpacing: '0.22em' }}>· 卷 {chapterIdx + 1} · 共 {total} ·</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18, paddingTop: 14, borderTop: `1px solid ${bg3}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: plum, border: `1px solid ${plum}55`, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>← 前 卷</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: plum, color: wallS, border: `1px solid ${plumD}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em', fontWeight: 600 }}>下 卷 →</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V45Footer({ book, chapterIdx, settings }) {
  const tone = V45_BG_TONES[settings.themeColors.v45.bgTone] || V45_BG_TONES.wall;
  const plum = settings.themeColors.v45.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg2, color: '#1E1710', borderTop: `1px solid ${tone.bg3}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: '"Noto Serif TC",serif', fontSize: 11,
    }}>
      <span style={{ color: plum, fontWeight: 600, letterSpacing: '0.3em' }}>卷 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${plum}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: plum }}/>
      </div>
      <span style={{ color: plum, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V45Reader = V45Reader;
window.V45Footer = V45Footer;
