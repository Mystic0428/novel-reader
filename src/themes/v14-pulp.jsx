// src/themes/v14-pulp.jsx — Pulp magazine paperback: yellowed cheap paper, lurid splash banner, foxing stains, "10¢" price tag
const V14_BG_TONES = {
  yellowed:  { bg: '#F0DC9C', ink: '#1A0E04', splash: '#E83A1F', subSplash: '#FFC841' },
  acid:      { bg: '#F8E078', ink: '#1A0E04', splash: '#E8281A', subSplash: '#0E2A78' },
  pulp:      { bg: '#E8C878', ink: '#1A0804', splash: '#D02A1A', subSplash: '#FFB81E' },
  foxed:     { bg: '#DCC890', ink: '#1A0E04', splash: '#C8281A', subSplash: '#F0A828' },
  detective: { bg: '#1A1408', ink: '#F8E078', splash: '#E8281A', subSplash: '#FFC841' },
  scifi:     { bg: '#0E1828', ink: '#F8E078', splash: '#FF382A', subSplash: '#28E0F0' },
  romance:   { bg: '#F4D8B8', ink: '#3A0F18', splash: '#D03250', subSplash: '#FFC841' },
  noir:      { bg: '#1A0F08', ink: '#F0DC9C', splash: '#E84A1F', subSplash: '#FFC841' },
  horror:    { bg: '#0F0F0F', ink: '#F8C840', splash: '#FF1418', subSplash: '#FFE03A' },
};

function V14Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V14_BG_TONES[settings.themeColors.v14.bgTone] || V14_BG_TONES.yellowed;
  const { bg, ink, splash, subSplash } = tone;
  const accent = settings.themeColors.v14.accent;
  const total = book.chaptersMeta.length;
  const isDark = ink === '#F8E078' || ink === '#F0DC9C' || ink === '#F8C840';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, fontFamily: 'var(--serif)', padding: 0, position: 'relative',
    }}>
      {/* foxing stains */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'multiply', opacity: 0.45,
        backgroundImage: `radial-gradient(circle at 12% 18%, rgba(120,80,30,0.20) 0, transparent 4%), radial-gradient(circle at 88% 72%, rgba(120,80,30,0.18) 0, transparent 4%), radial-gradient(circle at 30% 85%, rgba(140,90,40,0.15) 0, transparent 3%), url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.4  0 0 0 0 0.28  0 0 0 0 0.15  0 0 0 0.18 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`,
      }}/>

      <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto', padding: '36px 50px 40px' }}>
        {/* magazine indicia + price tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: ink, opacity: 0.75, letterSpacing: '0.3em', fontWeight: 800, fontFamily: 'var(--serif)' }}>
            VOL. {chapterIdx + 1} · NO. {total} · MARCH 1953
          </div>
          {/* "10¢" price tag — circular splash badge */}
          <div style={{
            width: 64, height: 64, background: splash, color: subSplash,
            display: 'grid', placeItems: 'center', position: 'relative',
            transform: 'rotate(8deg)', fontFamily: 'var(--serif)',
            clipPath: 'polygon(50% 0%, 60% 8%, 70% 2%, 78% 12%, 88% 8%, 92% 20%, 100% 28%, 92% 38%, 100% 50%, 92% 62%, 100% 72%, 92% 80%, 88% 92%, 78% 88%, 70% 98%, 60% 92%, 50% 100%, 40% 92%, 30% 98%, 22% 88%, 12% 92%, 8% 80%, 0 72%, 8% 62%, 0 50%, 8% 38%, 0 28%, 8% 20%, 12% 8%, 22% 12%, 30% 2%, 40% 8%)',
            filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.4))',
          }}>
            <div style={{ textAlign: 'center', lineHeight: 0.95 }}>
              <div style={{ fontSize: 19, fontWeight: 900, fontStyle: 'italic' }}>{chapterIdx + 1}</div>
              <div style={{ fontSize: 8, fontWeight: 800, letterSpacing: '0.1em' }}>OF {total}</div>
            </div>
          </div>
        </div>

        {/* big sensational title */}
        <div style={{ marginBottom: 22, position: 'relative' }}>
          <div style={{
            fontSize: settings.tweaks.fontSize + 10, fontWeight: 900, letterSpacing: '0.05em',
            color: subSplash, fontStyle: 'italic',
            textShadow: `2px 2px 0 ${ink}`, textAlign: 'center',
            transform: 'rotate(-1deg)', display: 'inline-block', width: '100%',
          }}>
            ★ FEATURED IN THIS ISSUE ★
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 26, fontWeight: 900,
            margin: '6px 0 0', lineHeight: 1.05, letterSpacing: '-0.01em',
            color: splash, textAlign: 'center', fontStyle: 'italic',
            textShadow: `3px 3px 0 ${ink}, 6px 6px 0 ${subSplash}`,
            transform: 'rotate(-0.5deg)',
          }}>
            {stripChapterPrefix(chapterTitle).toUpperCase()}
          </h1>
          <div style={{ textAlign: 'center', fontSize: 12, color: ink, opacity: 0.7, fontStyle: 'italic', marginTop: 8, letterSpacing: '0.18em' }}>
            ~ a sensational tale by {(book.author || 'a mysterious correspondent')} ~
          </div>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify', columnRule: `1px solid ${ink}33`,
          '--accent': splash,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* "TO BE CONTINUED..." banner */}
        <div style={{
          marginTop: 24, padding: '8px 14px', background: splash, color: subSplash,
          textAlign: 'center', fontFamily: 'var(--serif)', fontSize: 13, fontWeight: 900,
          letterSpacing: '0.4em', fontStyle: 'italic',
          transform: 'rotate(-1deg)',
          boxShadow: `2px 2px 0 ${ink}`,
        }}>
          ★ TO BE CONTINUED ★
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 22 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: subSplash, color: ink, border: `2px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 800, letterSpacing: '0.15em',
            boxShadow: `3px 3px 0 ${ink}`,
          }}>◄ LAST ISSUE</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: splash, color: subSplash, border: `2px solid ${ink}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 800, letterSpacing: '0.15em',
            boxShadow: `3px 3px 0 ${ink}`,
          }}>NEXT ISSUE ►</button>
        </div>
      </div>
    </main>
  );
}

function V14Footer({ book, chapterIdx, settings }) {
  const tone = V14_BG_TONES[settings.themeColors.v14.bgTone] || V14_BG_TONES.yellowed;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, color: tone.ink, borderTop: `2px solid ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', fontStyle: 'italic',
    }}>
      <span style={{ color: tone.splash }}>★ ISSUE {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 6, background: `${tone.ink}22`, position: 'relative', border: `1px solid ${tone.ink}` }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.splash }}/>
      </div>
      <span style={{ color: tone.subSplash, textShadow: `1px 1px 0 ${tone.ink}` }}>{Math.round(progress * 100)}¢</span>
    </div>
  );
}

window.V14Reader = V14Reader;
window.V14Footer = V14Footer;
