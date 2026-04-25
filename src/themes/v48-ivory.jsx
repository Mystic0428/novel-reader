// src/themes/v48-ivory.jsx — Ivory carved relief: cream embossed panel + carved flower roundel + crackle veins
const V48_BG_TONES = {
  cream:    { bg1: '#F0E6D0', bg2: '#E4D7B8', bg3: '#FAF4E4', deep: '#7A5E34', mid: '#A48958', d: '#C7B58A' },
  ivory:    { bg1: '#F4EAD2', bg2: '#E8DCBA', bg3: '#FCF5E2', deep: '#8B6E40', mid: '#B59866', d: '#CFBE92' },
  bone:     { bg1: '#F2EAD2', bg2: '#E5D8B5', bg3: '#FAF3DB', deep: '#7A5E34', mid: '#A48958', d: '#C7B58A' },
  hemp:     { bg1: '#E8DCBA', bg2: '#DCCEA0', bg3: '#F2E8C8', deep: '#6E5028', mid: '#967A4A', d: '#B8A878' },
  oat:      { bg1: '#EDE2C0', bg2: '#DFD0A0', bg3: '#F8EFD2', deep: '#7A5E34', mid: '#A48958', d: '#C7B58A' },
  linen:    { bg1: '#E8E0C8', bg2: '#DBD0AE', bg3: '#F0E8D2', deep: '#6E5836', mid: '#9A8260', d: '#BDA988' },
  ash:      { bg1: '#E0D8C8', bg2: '#D0C8B5', bg3: '#EAE2D2', deep: '#6A5A48', mid: '#8E7E68', d: '#B0A088' },
  rice:     { bg1: '#F4EBD0', bg2: '#E8DCB0', bg3: '#FBF4DE', deep: '#7A5E34', mid: '#A48958', d: '#C7B58A' },
  tea:      { bg1: '#DCCC9C', bg2: '#C8B57E', bg3: '#E8DCB0', deep: '#5E481E', mid: '#86683A', d: '#A88E66' },
};

function V48CarvedFlower({ size = 80, deep, mid, ivory, ivory2, ivoryS }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ filter: `drop-shadow(0 1px 0 ${ivoryS}) drop-shadow(0 -0.5px 0 rgba(80,60,30,0.35))` }}>
      <g fill={ivory2} stroke={deep} strokeWidth="0.4">
        <circle cx="50" cy="50" r="46"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke={mid} strokeWidth="0.6"/>
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const cx = 50 + Math.cos(a) * 26, cy = 50 + Math.sin(a) * 26;
          return <ellipse key={i} cx={cx} cy={cy} rx="10" ry="6" transform={`rotate(${a * 180 / Math.PI + 90} ${cx} ${cy})`} fill={ivoryS}/>;
        })}
        <circle cx="50" cy="50" r="14" fill={ivory}/>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return <circle key={i} cx={50 + Math.cos(a) * 8} cy={50 + Math.sin(a) * 8} r="2" fill={deep}/>;
        })}
        <circle cx="50" cy="50" r="3" fill={deep}/>
      </g>
    </svg>
  );
}

function V48Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V48_BG_TONES[settings.themeColors.v48.bgTone] || V48_BG_TONES.cream;
  const { bg1: ivory, bg2: ivory2, bg3: ivoryS, deep, mid, d: ivoryD } = tone;
  const accent = settings.themeColors.v48.accent;
  const ink = '#3A2E18';
  const mute = 'rgba(58,46,24,0.55)', soft = 'rgba(58,46,24,0.82)';
  const shadow = 'rgba(80,60,30,0.35)';
  const relief = { boxShadow: `inset 0 2px 4px ${ivoryS}, inset 0 -2px 4px ${shadow}, 0 1px 0 ${ivoryS}, 0 -1px 0 ${shadow}` };
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `radial-gradient(ellipse at 30% 20%, ${ivoryS} 0%, ${ivory} 50%, ${ivory2} 100%)`,
      color: ink, fontFamily: '"Noto Serif TC",serif', position: 'relative', padding: '32px 0',
    }}>
      {/* ivory grain */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.55,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence baseFrequency='0.6' numOctaves='3'/><feColorMatrix values='0 0 0 0 0.6  0 0 0 0 0.46  0 0 0 0 0.25  0 0 0 0.10 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}/>
      {/* embossed outer frame */}
      <div style={{ position: 'absolute', inset: 18, border: `1px solid ${ivoryD}`, ...relief, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', inset: 26, border: `0.5px solid ${ivoryD}`, pointerEvents: 'none' }}/>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '12px 50px', position: 'relative' }}>
        <header style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 22 }}>
          <V48CarvedFlower size={86} deep={deep} mid={mid} ivory={ivory} ivory2={ivory2} ivoryS={ivoryS}/>
          <div>
            <div style={{ fontSize: 11, color: deep, letterSpacing: '0.5em', fontWeight: 700 }}>
              · 象 牙 雕 刻 · IVORY CARVED ·
            </div>
            <div style={{ fontSize: settings.tweaks.fontSize + 24, color: deep, letterSpacing: '0.14em', margin: '6px 0 2px', fontWeight: 500, textShadow: `0 1px 0 ${ivoryS}, 0 -0.5px 0 ${shadow}` }}>
              {book.title}
            </div>
            <div style={{ fontSize: 12, fontStyle: 'italic', color: soft, letterSpacing: '0.2em' }}>
              Vol. {chapterIdx + 1} · carved relief
            </div>
          </div>
        </header>

        <div style={{ padding: '24px 30px', background: ivoryS, border: `1px solid ${ivoryD}`, ...relief }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 12, borderBottom: `1px solid ${ivoryD}` }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', ...relief, background: ivory, border: `1px solid ${ivoryD}`, display: 'grid', placeItems: 'center', fontSize: 20, color: deep, fontWeight: 500 }}>
              {['壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖', '拾'][Math.min(9, chapterIdx)] || (chapterIdx + 1)}
            </div>
            <div>
              <div style={{ fontSize: settings.tweaks.fontSize + 6, color: deep, letterSpacing: '0.12em', fontWeight: 500, textShadow: `0 1px 0 ${ivoryS}` }}>
                {stripChapterPrefix(chapterTitle)}
              </div>
              <div style={{ fontSize: 11, color: mute, letterSpacing: '0.2em', marginTop: 2 }}>
                CHAPTER {chapterIdx + 1} OF {total}
              </div>
            </div>
          </div>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: '"Noto Serif TC",serif', color: ink, marginTop: 14,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            textAlign: 'justify',
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${ivoryD}` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, ...relief, background: ivory, color: deep, border: `1px solid ${ivoryD}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em' }}>‹ 前 卷</button>
            <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, ...relief, background: ivoryS, color: deep, border: `1px solid ${ivoryD}`, fontFamily: 'var(--serif)', letterSpacing: '0.18em', fontWeight: 600 }}>下 卷 ›</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V48Footer({ book, chapterIdx, settings }) {
  const tone = V48_BG_TONES[settings.themeColors.v48.bgTone] || V48_BG_TONES.cream;
  const accent = settings.themeColors.v48.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg1, color: '#3A2E18', borderTop: `1px solid ${tone.d}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11,
    }}>
      <span style={{ color: tone.deep, fontWeight: 700, letterSpacing: '0.3em' }}>卷 {chapterIdx + 1} / {total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.deep}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, fontWeight: 700 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V48Reader = V48Reader;
window.V48Footer = V48Footer;
