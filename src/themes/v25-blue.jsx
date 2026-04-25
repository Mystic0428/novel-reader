// src/themes/v25-blue.jsx — Blue & white porcelain: cobalt vines, white-glaze body
const V25_BG_TONES = {
  classic:  { bg: '#F4EDDC', bg2: '#EDE3C9', porcelain: '#F8F4E8' },
  snow:     { bg: '#F8F3E4', bg2: '#F0EAD6', porcelain: '#FCF9EC' },
  celadon:  { bg: '#E6E9D8', bg2: '#DADDCB', porcelain: '#F2F5E4' },
  dove:     { bg: '#EAEAE0', bg2: '#DEDED4', porcelain: '#F4F4EA' },
  willow:   { bg: '#E9ECD6', bg2: '#DDE0CA', porcelain: '#F3F5E0' },
  shell:    { bg: '#F4EBDF', bg2: '#ECE1D2', porcelain: '#FAF2E6' },
  mist:     { bg: '#EFE9D8', bg2: '#E5DEC5', porcelain: '#F6F0DD' },
  pearl:    { bg: '#F2EAD6', bg2: '#E8DFC2', porcelain: '#F8F2DF' },
  rice:     { bg: '#F4ECD2', bg2: '#ECE2BF', porcelain: '#FAF4DA' },
};

function V25Vine({ color, width = 800 }) {
  return (
    <svg viewBox="0 0 260 50" width={width} height={50 * width / 260} preserveAspectRatio="none" style={{ display: 'block' }}>
      <g fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round">
        <path d="M4,25 C20,8 40,42 58,25 C76,8 96,42 114,25 C132,8 152,42 170,25 C188,8 208,42 226,25 C240,12 250,30 256,25"/>
        {[30, 88, 146, 204].map((x, i) => (
          <g key={i} fill={color} opacity="0.85">
            <path d={`M${x},16 q-6,-6 -2,-12 q6,4 6,10 Z`}/>
            <path d={`M${x + 14},14 q6,-6 12,-4 q-2,8 -10,8 Z`}/>
            <circle cx={x + 6} cy="10" r="2.4"/>
          </g>
        ))}
      </g>
    </svg>
  );
}

function V25Lotus({ color, size = 36 }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <g fill="none" stroke={color} strokeWidth="1.2">
        <circle cx="30" cy="30" r="4" fill={color}/>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x = 30 + Math.cos(a) * 18, y = 30 + Math.sin(a) * 18;
          const cx1 = 30 + Math.cos(a - 0.2) * 10, cy1 = 30 + Math.sin(a - 0.2) * 10;
          const cx2 = 30 + Math.cos(a + 0.2) * 10, cy2 = 30 + Math.sin(a + 0.2) * 10;
          return <path key={i} d={`M30,30 Q${cx1},${cy1} ${x},${y} Q${cx2},${cy2} 30,30 Z`} opacity="0.85"/>;
        })}
        <circle cx="30" cy="30" r="22" opacity="0.4"/>
      </g>
    </svg>
  );
}

function V25Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V25_BG_TONES[settings.themeColors.v25.bgTone] || V25_BG_TONES.classic;
  const blue = settings.themeColors.v25.accent;
  const blueD = darkenHex(blue, 0.35);
  const { bg, bg2, porcelain } = tone;
  const ink = '#1A1A1A', soft = 'rgba(26,26,26,0.82)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`} style={{
      flex: 1, background: `linear-gradient(180deg, ${bg} 0%, ${bg2} 100%)`,
      color: ink, fontFamily: 'var(--serif)', padding: '32px 0',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px' }}>
        {/* top vine strip */}
        <div style={{ marginBottom: 20 }}>
          <V25Vine color={blue} width={720}/>
        </div>
        {/* porcelain panel */}
        <div style={{
          position: 'relative', padding: '40px 48px 48px',
          background: porcelain, border: `1px solid ${blueD}`,
          boxShadow: `inset 0 0 0 6px #fff, inset 0 0 0 7px ${blue}22, 0 6px 18px rgba(30,58,107,0.12)`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <V25Lotus color={blue} size={32}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: settings.tweaks.fontSize + 6, fontWeight: 500, letterSpacing: '0.12em', color: blueD }}>
                第 {chapterIdx + 1} 回
              </div>
              <div style={{ fontSize: settings.tweaks.fontSize - 1, color: soft, letterSpacing: '0.1em', marginTop: 2 }}>
                {stripChapterPrefix(chapterTitle)}
              </div>
            </div>
            <div style={{
              width: 40, height: 40, background: blue, color: '#fff',
              display: 'grid', placeItems: 'center', fontFamily: 'var(--serif)', fontWeight: 700,
              transform: 'rotate(-2deg)', fontSize: 12, letterSpacing: 0,
            }}>青花</div>
          </div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>
        {/* bottom vine strip (mirror) */}
        <div style={{ marginTop: 20, transform: 'scaleY(-1)' }}>
          <V25Vine color={blue} width={720}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 16, borderTop: `0.5px solid ${blue}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: blueD, border: `1px solid ${blue}`, fontFamily: 'var(--serif)' }}>← 前回</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: blueD, border: `1px solid ${blue}`, fontFamily: 'var(--serif)' }}>下回 →</button>
        </div>
      </div>
    </main>
  );
}

function V25Footer({ book, chapterIdx, settings }) {
  const tone = V25_BG_TONES[settings.themeColors.v25.bgTone] || V25_BG_TONES.classic;
  const blue = settings.themeColors.v25.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.porcelain, borderTop: `1px solid ${blue}55`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)',
      fontSize: 11, color: darkenHex(blue, 0.35), letterSpacing: '0.2em',
    }}>
      <span>第 {chapterIdx + 1} 回</span>
      <div style={{ flex: 1, height: 1, background: `${blue}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: blue }}/>
      </div>
      <span>共 {total} 回</span>
    </div>
  );
}

function darkenHex(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.round(((n >> 16) & 255) * (1 - amt)));
  const g = Math.max(0, Math.round(((n >> 8) & 255) * (1 - amt)));
  const b = Math.max(0, Math.round((n & 255) * (1 - amt)));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

window.V25Reader = V25Reader;
window.V25Footer = V25Footer;
