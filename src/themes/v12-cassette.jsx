// src/themes/v12-cassette.jsx — 80s Walkman cassette: tape reels, mixtape label, Side A/B, orange/black warm retro
const V12_BG_TONES = {
  walnut:    { bg: '#3A2418', shell: '#5A3828', label: '#F5E6C8', ink: '#1A0E04' },
  ember:     { bg: '#2A1410', shell: '#5E2818', label: '#F8D8A8', ink: '#1A0804' },
  ink:       { bg: '#0E0E0E', shell: '#1F1F1F', label: '#F0E0C0', ink: '#0A0A0A' },
  oxide:     { bg: '#3A2818', shell: '#5A3828', label: '#E8C8A8', ink: '#1A0E04' },
  cream:     { bg: '#F0E2C0', shell: '#1A1A1A', label: '#FAF0DC', ink: '#1A0E04' },
  midnight:  { bg: '#0F1828', shell: '#1A2A40', label: '#F0E2C0', ink: '#0A0F18' },
  forest:    { bg: '#1A2818', shell: '#2A3E20', label: '#F0E2C0', ink: '#0A1408' },
  brick:     { bg: '#3E1A14', shell: '#5A2818', label: '#F4D8B8', ink: '#1A0804' },
  navy:      { bg: '#0F1F38', shell: '#1A2E50', label: '#F0DCBC', ink: '#040818' },
};

function V12Reel({ size = 60, color = '#1A0E04' }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill={color} stroke="rgba(0,0,0,0.4)" strokeWidth="1"/>
      <circle cx="30" cy="30" r="22" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
      <circle cx="30" cy="30" r="16" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5"/>
      {/* spokes */}
      {Array.from({ length: 6 }).map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <line key={i} x1={30 + Math.cos(a) * 6} y1={30 + Math.sin(a) * 6} x2={30 + Math.cos(a) * 24} y2={30 + Math.sin(a) * 24} stroke="rgba(255,255,255,0.12)" strokeWidth="2"/>;
      })}
      <circle cx="30" cy="30" r="6" fill="rgba(255,255,255,0.08)"/>
      <circle cx="30" cy="30" r="3" fill={color}/>
    </svg>
  );
}

function V12Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V12_BG_TONES[settings.themeColors.v12.bgTone] || V12_BG_TONES.walnut;
  const { bg, shell, label, ink } = tone;
  const accent = settings.themeColors.v12.accent;
  const total = book.chaptersMeta.length;
  const sideAB = chapterIdx % 2 === 0 ? 'A' : 'B';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: label, fontFamily: '"Inter","Helvetica Neue",sans-serif', padding: '32px 0',
    }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 32px' }}>
        {/* cassette shell */}
        <div style={{
          background: shell, padding: '20px 24px 24px',
          borderRadius: 8, position: 'relative',
          boxShadow: `inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -2px 0 rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.4)`,
          marginBottom: 28,
        }}>
          {/* reels at top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <V12Reel size={56} color={ink}/>
            {/* magnetic tape strip */}
            <div style={{ flex: 1, height: 8, margin: '0 14px', background: `linear-gradient(180deg, ${accent}cc 0%, ${ink} 60%, ${accent}88 100%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)` }}/>
            <V12Reel size={56} color={ink}/>
          </div>

          {/* mixtape label */}
          <div style={{
            background: label, color: ink, padding: '14px 16px',
            border: `2px solid ${ink}`, position: 'relative',
            backgroundImage: `repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,0,0.06) 22px 23px)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontFamily: '"Caveat","Marker Felt","Brush Script MT",cursive' }}>
              <span style={{ fontSize: 11, letterSpacing: '0.3em', fontWeight: 800, color: accent, fontFamily: '"Inter",sans-serif' }}>
                SIDE {sideAB} · TRACK {String(chapterIdx + 1).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 13, color: ink, opacity: 0.7, fontStyle: 'italic' }}>
                {(book.author || 'V/A').slice(0, 24)}
              </span>
            </div>
            <div style={{
              fontSize: settings.tweaks.fontSize + 14, fontWeight: 600, lineHeight: 1.15, letterSpacing: '0.02em',
              fontFamily: '"Caveat","Marker Felt","Brush Script MT",cursive', color: ink,
            }}>{stripChapterPrefix(chapterTitle)}</div>
            <div style={{ marginTop: 8, fontSize: 11, color: ink, opacity: 0.55, letterSpacing: '0.15em', fontFamily: '"JetBrains Mono",monospace' }}>
              {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')} · 60 MIN · METAL TYPE II
            </div>
          </div>
        </div>

        {/* body — like the printed insert booklet */}
        <div style={{
          background: label, color: ink, padding: '24px 28px',
          border: `1.5px solid ${ink}`,
          boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
        }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            color: ink, fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 14, borderTop: `1px dashed ${ink}66` }}>
            <button onClick={onPrev} disabled={!canPrev} style={{
              ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
              background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
              fontFamily: '"JetBrains Mono",monospace', letterSpacing: '0.18em', fontWeight: 700,
            }}>◄◄ REW</button>
            <button onClick={onNext} disabled={!canNext} style={{
              ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
              background: accent, color: label, border: `1.5px solid ${ink}`,
              fontFamily: '"JetBrains Mono",monospace', letterSpacing: '0.18em', fontWeight: 700,
            }}>FF ►►</button>
          </div>
        </div>
      </div>
    </main>
  );
}

function V12Footer({ book, chapterIdx, settings }) {
  const tone = V12_BG_TONES[settings.themeColors.v12.bgTone] || V12_BG_TONES.walnut;
  const accent = settings.themeColors.v12.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.shell, color: tone.label, borderTop: `1px solid rgba(0,0,0,0.4)`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"JetBrains Mono",monospace', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700,
    }}>
      <span style={{ color: accent }}>TRK {String(chapterIdx + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      <div style={{ flex: 1, height: 6, background: tone.ink, position: 'relative', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: `linear-gradient(180deg, ${accent}cc, ${accent})`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2)` }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V12Reader = V12Reader;
window.V12Footer = V12Footer;
