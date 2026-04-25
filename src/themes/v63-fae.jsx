// src/themes/v63-fae.jsx — elven/Tolkien manuscript: vine borders, italic gold script, fae glow
const V63_BG_TONES = {
  mosswood:  { bg: '#0F1F18', surface: '#1A2D24', ink: '#E8E2C8', mute: '#9CB098', rule: '#1F3A2A' },
  twilight:  { bg: '#0F1224', surface: '#1A1E36', ink: '#E0DCEC', mute: '#A0A0C0', rule: '#1F2A4A' },
  dawn:      { bg: '#2A1A20', surface: '#3A242C', ink: '#F0DCC8', mute: '#C09080', rule: '#4A2A38' },
  autumn:    { bg: '#1F1408', surface: '#2D1F10', ink: '#F0DCA8', mute: '#B89060', rule: '#3A2818' },
  starlight: { bg: '#0A0F1F', surface: '#141828', ink: '#E8E2C8', mute: '#A0A8C8', rule: '#1F2438' },
  mist:      { bg: '#1A2024', surface: '#262E32', ink: '#DCE0D8', mute: '#8898A0', rule: '#384248' },
  bluehour:  { bg: '#0F1A2E', surface: '#1A2540', ink: '#E0E4F0', mute: '#90A0C0', rule: '#1F2F4A' },
  deepwater: { bg: '#0A1A1F', surface: '#142830', ink: '#D8E4DC', mute: '#80A098', rule: '#1F3838' },
  blossom:   { bg: '#F0E4DC', surface: '#E0D4CC', ink: '#2A1A20', mute: '#7A4858', rule: '#B89898' },
};

function V63Vine({ accent, mirror }) {
  return (
    <svg width="100%" height="32" viewBox="0 0 600 32" preserveAspectRatio="none" style={{
      transform: mirror ? 'scaleY(-1)' : 'none', display: 'block',
    }}>
      <g fill="none" stroke={accent} strokeWidth="0.8" strokeLinecap="round">
        <path d="M0 18 Q100 4 200 18 T 400 18 T 600 18"/>
        {/* leaves */}
        <path d="M80 14 q-6 -10 -2 -16 q8 4 4 16 z" fill={accent} fillOpacity="0.4"/>
        <path d="M180 22 q6 10 2 16 q-8 -4 -4 -16 z" fill={accent} fillOpacity="0.4"/>
        <path d="M280 14 q-6 -10 -2 -16 q8 4 4 16 z" fill={accent} fillOpacity="0.4"/>
        <path d="M380 22 q6 10 2 16 q-8 -4 -4 -16 z" fill={accent} fillOpacity="0.4"/>
        <path d="M480 14 q-6 -10 -2 -16 q8 4 4 16 z" fill={accent} fillOpacity="0.4"/>
        <path d="M580 22 q6 10 2 16 q-8 -4 -4 -16 z" fill={accent} fillOpacity="0.4"/>
        {/* small stars */}
        <circle cx="130" cy="18" r="1.2" fill={accent}/>
        <circle cx="330" cy="18" r="1.2" fill={accent}/>
        <circle cx="530" cy="18" r="1.2" fill={accent}/>
      </g>
    </svg>
  );
}

function V63Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V63_BG_TONES[settings.themeColors.v63.bgTone] || V63_BG_TONES.mosswood;
  const accent = settings.themeColors.v63.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const isLight = bg === '#F0E4DC';
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, padding: 0, position: 'relative', color: ink,
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
      background: `radial-gradient(ellipse at top, ${surface} 0%, ${bg} 60%, ${bg} 100%)`,
    }}>
      {/* faint elvish ghost text watermark — abstract curvilinear */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: isLight ? 0.05 : 0.04,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='200' viewBox='0 0 400 200'><g fill='none' stroke='${encodeURIComponent(accent)}' stroke-width='1.2' stroke-linecap='round'><path d='M40 100 q10 -30 30 -10 q15 15 30 -10 q15 -25 30 0 q10 20 25 -5'/><path d='M200 90 q10 -30 30 -10 q15 15 30 -10 q15 -25 30 0'/><circle cx='100' cy='90' r='2' fill='${encodeURIComponent(accent)}'/><circle cx='240' cy='80' r='2' fill='${encodeURIComponent(accent)}'/><circle cx='360' cy='90' r='2' fill='${encodeURIComponent(accent)}'/></g></svg>")`,
        backgroundRepeat: 'repeat',
      }}/>

      {/* fae glow at top */}
      <div style={{
        position: 'fixed', top: -100, left: '50%', transform: 'translateX(-50%)',
        width: 400, height: 300, pointerEvents: 'none',
        background: `radial-gradient(ellipse, ${accent}22, transparent 60%)`,
      }}/>

      <article style={{ maxWidth: 680, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* top vine */}
        <V63Vine accent={accent}/>

        {/* chapter mark */}
        <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
          <div style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic',
            fontSize: 12, color: accent, letterSpacing: '0.4em',
          }}>
            ✦ Tale the {ordinalEn(chapterIdx + 1)} ✦
          </div>
        </div>

        {/* italic title with golden glow */}
        <h1 style={{
          fontFamily: '"Cormorant Garamond",var(--serif)', fontStyle: 'italic',
          fontSize: settings.tweaks.fontSize + 16, fontWeight: 500,
          textAlign: 'center', margin: '6px 0 18px', letterSpacing: '0.02em', color: ink,
          textShadow: isLight ? 'none' : `0 0 18px ${accent}55`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* dedication line */}
        <div style={{
          textAlign: 'center', fontSize: 11, color: mute, fontStyle: 'italic',
          letterSpacing: '0.15em', marginBottom: 28,
        }}>
          ❀  set down by {book.author || 'an elder of the wood'}  ❀
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"EB Garamond",var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize + 1, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* end ornament */}
        <div style={{
          textAlign: 'center', marginTop: 32, fontSize: 16, color: accent,
          letterSpacing: '0.5em', fontStyle: 'italic',
        }}>
          ✦ ❀ ✦
        </div>

        {/* tree-ring progress */}
        <div style={{ margin: '32px auto 24px', textAlign: 'center' }}>
          <V63TreeRings chapterIdx={chapterIdx} total={total} accent={accent} mute={mute}/>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: accent, border: `0.5px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12,
          }}>← prior tale</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: accent, color: bg, border: `0.5px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.18em', fontSize: 12, fontWeight: 600,
          }}>next tale →</button>
        </div>

        {/* bottom vine */}
        <div style={{ marginTop: 28 }}>
          <V63Vine accent={accent} mirror/>
        </div>
      </article>
    </main>
  );
}

function V63TreeRings({ chapterIdx, total, accent, mute }) {
  // Concentric rings — one per ~10% completion, current ring highlighted in accent
  const rings = 8;
  const progress = total ? (chapterIdx + 1) / total : 0;
  const filledRings = Math.round(progress * rings);
  return (
    <svg width="44" height="44" viewBox="-22 -22 44 44">
      {Array.from({ length: rings }).map((_, i) => {
        const r = 2 + i * 2.4;
        const filled = i < filledRings;
        return (
          <circle key={i} cx="0" cy="0" r={r} fill="none"
            stroke={filled ? accent : mute} strokeWidth={filled ? 0.9 : 0.4}
            opacity={filled ? 1 : 0.4}/>
        );
      })}
    </svg>
  );
}

function ordinalEn(n) {
  const ords = ['Zeroth','First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth','Ninth','Tenth',
    'Eleventh','Twelfth','Thirteenth','Fourteenth','Fifteenth','Sixteenth','Seventeenth','Eighteenth','Nineteenth','Twentieth'];
  if (n >= 0 && n < ords.length) return ords[n];
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function V63Footer({ book, chapterIdx, settings }) {
  const tone = V63_BG_TONES[settings.themeColors.v63.bgTone] || V63_BG_TONES.mosswood;
  const accent = settings.themeColors.v63.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.18em',
    }}>
      <span style={{ color: accent }}>❀ tale {chapterIdx + 1} of {total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent, boxShadow: `0 0 6px ${accent}80` }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V63Reader = V63Reader;
window.V63Footer = V63Footer;
