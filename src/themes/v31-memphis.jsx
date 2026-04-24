// src/themes/v31-memphis.jsx — Memphis 80s: neon geometrics on cream, sticker typography
const V31_BG_TONES = {
  cream:    { bg: '#FFF4E0', ink: '#111' },
  mint:     { bg: '#E3F5E8', ink: '#111' },
  peach:    { bg: '#FFE4D0', ink: '#111' },
  sky:      { bg: '#E0F0FC', ink: '#111' },
  lilac:    { bg: '#F0E4F7', ink: '#111' },
  ink:      { bg: '#121212', ink: '#FFF4E0' },
};

const MEMPHIS_COLORS = ['#FF4E9E', '#2EC5E5', '#FFD21E', '#6EE05A', '#8B4FE8'];

function V31Squiggle({ color, w = 80 }) {
  return (
    <svg viewBox="0 0 80 20" width={w} height={w / 4} style={{ display: 'block' }}>
      <path d="M2,10 Q10,2 18,10 T34,10 T50,10 T66,10 T78,10" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function V31Dots({ color, w = 60 }) {
  return (
    <svg viewBox="0 0 60 60" width={w} height={w}>
      {[0, 1, 2, 3, 4].map(r => [0, 1, 2, 3, 4].map(c => (
        <circle key={`${r}-${c}`} cx={8 + c * 11} cy={8 + r * 11} r="2" fill={color}/>
      )))}
    </svg>
  );
}

function V31Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V31_BG_TONES[settings.themeColors.v31.bgTone] || V31_BG_TONES.cream;
  const pink = settings.themeColors.v31.accent;
  const [cyan, yellow, green, purple] = ['#2EC5E5', '#FFD21E', '#6EE05A', '#8B4FE8'];
  const { bg, ink } = tone;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: 'var(--ui)',
      position: 'relative', overflow: 'auto', padding: 0,
    }}>
      {/* decorative shapes */}
      <div style={{ position: 'absolute', left: -20, top: 60, width: 120, height: 120, background: pink, borderRadius: '50%', opacity: 0.85, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: 30, top: 30, width: 100, height: 100, background: yellow, transform: 'rotate(18deg)', border: `3px solid ${ink}`, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', left: '30%', top: 18, width: 0, height: 0,
        borderLeft: '30px solid transparent', borderRight: '30px solid transparent', borderBottom: `52px solid ${cyan}`, pointerEvents: 'none' }}/>
      <div style={{ position: 'absolute', right: '18%', top: 220, pointerEvents: 'none' }}>
        <V31Squiggle color={purple} w={160}/>
      </div>
      <div style={{ position: 'absolute', left: 40, top: 360, pointerEvents: 'none' }}><V31Dots color={green} w={80}/></div>

      {/* header */}
      <header style={{ padding: '32px 40px 22px', display: 'flex', alignItems: 'flex-end', gap: 20, borderBottom: `4px dashed ${ink}`, position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: Math.min(64, settings.tweaks.fontSize * 3 + 10), fontWeight: 900, color: ink, lineHeight: 0.9, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
          {book.title}<span style={{ color: pink }}>✦</span>
        </div>
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <div style={{ padding: '4px 10px', background: cyan, border: `2.5px solid ${ink}`, fontWeight: 800, fontSize: 12, letterSpacing: '0.2em', boxShadow: `3px 3px 0 ${ink}` }}>
            CH · {String(chapterIdx + 1).padStart(2, '0')}
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', fontWeight: 700, color: purple }}>SIDE A ✪ TRACK {chapterIdx + 1}</div>
        </div>
      </header>

      {/* content card */}
      <div style={{ position: 'relative', zIndex: 1, padding: '28px 40px', maxWidth: 820, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ padding: '3px 9px', background: purple, color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '0.15em' }}>§{String(chapterIdx + 1).padStart(2, '0')}</span>
          <span style={{ padding: '3px 9px', background: yellow, border: `2px solid ${ink}`, fontWeight: 800, fontSize: 11 }}>CHAPTER</span>
          <span style={{ padding: '3px 9px', background: pink, color: '#fff', fontWeight: 800, fontSize: 11 }}>POP</span>
        </div>
        <div style={{
          background: ink === '#111' ? '#fff' : '#1A1A1A', border: `3px solid ${ink}`,
          padding: '26px 30px', boxShadow: `8px 8px 0 ${cyan}`,
        }}>
          <h1 style={{
            fontSize: settings.tweaks.fontSize + 14, fontWeight: 900, margin: '0 0 20px',
            letterSpacing: '0.04em', color: ink === '#111' ? '#111' : '#F0E8D4', lineHeight: 1.1,
          }}>{stripChapterPrefix(chapterTitle)}</h1>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            color: ink === '#111' ? '#111' : '#F0E8D4',
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: green, color: ink, border: `3px solid ${ink}`, fontWeight: 800, letterSpacing: '0.1em', boxShadow: `4px 4px 0 ${ink}` }}>← REWIND</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: pink, color: '#fff', border: `3px solid ${ink}`, fontWeight: 800, letterSpacing: '0.1em', boxShadow: `4px 4px 0 ${ink}` }}>FF →</button>
        </div>
      </div>
    </main>
  );
}

function V31Footer({ book, chapterIdx, settings }) {
  const tone = V31_BG_TONES[settings.themeColors.v31.bgTone] || V31_BG_TONES.cream;
  const cyan = '#2EC5E5';
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 40px', borderTop: `4px solid ${tone.ink}`, background: cyan,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontWeight: 800, fontSize: 12, letterSpacing: '0.2em', color: tone.ink,
    }}>
      <span>✦ TRACK {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')} ✦</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.15)', margin: '0 14px', border: `2px solid ${tone.ink}` }}>
        <div style={{ height: '100%', width: `${progress * 100}%`, background: tone.ink }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V31Reader = V31Reader;
window.V31Footer = V31Footer;
