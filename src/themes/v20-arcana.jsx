// src/themes/v20-arcana.jsx — Tarot: deep violet/navy + gold, starfield, card reveal
function ArcanaStarfield({ color }) {
  // Deterministic "random" so stars don't shift on every render
  const stars = React.useMemo(() => {
    const rand = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    return Array.from({ length: 40 }).map((_, i) => ({
      x: rand(i * 7.3) * 100,
      y: rand(i * 13.7 + 3) * 100,
      r: rand(i * 2.1 + 5) * 1.2 + 0.3,
      o: rand(i * 19.5 + 11) * 0.7 + 0.3,
    }));
  }, []);
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 100 100" preserveAspectRatio="none">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r / 10} fill={color} opacity={s.o}/>
      ))}
    </svg>
  );
}

const V20_BG_TONES = {
  cosmic:   { bg: '#0E0B24', bg2: '#1A1640', edge: '#05031A' }, // 夢紫
  sapphire: { bg: '#0B1B3B', bg2: '#152A5A', edge: '#040B1F' }, // 寶藍
  emerald:  { bg: '#0B2416', bg2: '#133A22', edge: '#04120A' }, // 深林
  obsidian: { bg: '#0A0B14', bg2: '#14161F', edge: '#050608' }, // 黑曜
  rubyabyss:{ bg: '#240B14', bg2: '#3A1523', edge: '#1A050B' }, // 血紅深淵
  aurora:   { bg: '#0B2833', bg2: '#154554', edge: '#041620' }, // 極光
};

function V20Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v20;
  const gold = colors.accent;
  const tone = V20_BG_TONES[colors.bgTone] || V20_BG_TONES.cosmic;
  const bg = tone.bg, bg2 = tone.bg2;
  const ink = '#E8DCC4', soft = 'rgba(232,220,196,0.78)', mute = 'rgba(232,220,196,0.55)';
  const star = '#F5D56E';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin"
      style={{
        flex: 1, overflow: 'auto', color: ink, fontFamily: 'var(--serif)',
        background: `radial-gradient(ellipse at top, ${bg2} 0%, ${bg} 60%, ${tone.edge} 100%)`,
        padding: '30px 48px 40px', position: 'relative',
      }}>
      <ArcanaStarfield color={star}/>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, position: 'relative' }}>
        {/* Tarot card */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', inset: -30, background: `radial-gradient(circle, ${gold}33, transparent 70%)`, filter: 'blur(20px)' }}/>
          <div style={{
            position: 'relative', width: 180, height: 270,
            background: `linear-gradient(165deg, ${bg2} 0%, #2A1F5C 50%, ${bg} 100%)`,
            border: `1.5px solid ${gold}`, outline: `0.5px solid ${gold}`, outlineOffset: '4px',
            padding: '10px 8px', display: 'flex', flexDirection: 'column',
            boxShadow: `0 20px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(224,192,104,0.1)`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: gold, fontStyle: 'italic', letterSpacing: '0.3em' }}>
              <span>{toRomanV17(chapterIdx + 1)}</span><span>·</span><span>{toRomanV17(chapterIdx + 1)}</span>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="110" height="130" viewBox="0 0 120 140">
                <g fill="none" stroke={gold} strokeWidth="0.8">
                  <circle cx="60" cy="50" r="28" fill={star} fillOpacity="0.15"/>
                  <path d="M60 25 l4 14 h14 l-11 8 l4 14 l-11 -8 l-11 8 l4 -14 l-11 -8 h14 z" fill={star} fillOpacity="0.9" stroke="none"/>
                  <path d="M30 95 q30 -20 60 0"/>
                  <path d="M26 105 q34 -20 68 0" opacity="0.6"/>
                  <path d="M22 115 q38 -20 76 0" opacity="0.4"/>
                  <circle cx="36" cy="20" r="1" fill={star}/>
                  <circle cx="84" cy="16" r="1.2" fill={star}/>
                  <circle cx="100" cy="40" r="0.8" fill={star}/>
                  <circle cx="18" cy="40" r="1" fill={star}/>
                </g>
              </svg>
            </div>
            <div style={{ textAlign: 'center', padding: '6px 0 2px' }}>
              <div style={{ fontSize: 9, color: gold, letterSpacing: '0.3em', fontStyle: 'italic' }}>— ARCANUM {toRomanV17(chapterIdx + 1)} —</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: gold, fontStyle: 'italic', letterSpacing: '0.3em', transform: 'rotate(180deg)' }}>
              <span>{toRomanV17(chapterIdx + 1)}</span><span>·</span><span>{toRomanV17(chapterIdx + 1)}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: 560 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', color: gold, fontStyle: 'italic', marginBottom: 10 }}>
            — ARCANUM {toRomanV17(chapterIdx + 1)} · REVEALED —
          </div>
          <h1 style={{ fontSize: settings.tweaks.fontSize + 10, fontWeight: 500, margin: '0 0 8px', letterSpacing: '0.2em', color: ink }}>
            {stripChapterPrefix(chapterTitle)}
          </h1>
          <div style={{ fontSize: 11, color: soft, fontStyle: 'italic', letterSpacing: '0.15em' }}>
            ✦　{chapterIdx + 1} / {book.chaptersMeta.length}　✦
          </div>
        </div>

        {/* Body panel */}
        <div style={{
          maxWidth: 640, width: '100%',
          padding: '24px 28px',
          background: 'rgba(26,22,64,0.6)', backdropFilter: 'blur(8px)',
          border: `0.5px solid rgba(224,192,104,0.4)`,
          position: 'relative',
        }}>
          {[[6, 6, 'auto', 'auto'], [6, 'auto', 'auto', 6], ['auto', 6, 6, 'auto'], ['auto', 'auto', 6, 6]].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: pos[0] === 'auto' ? 'auto' : pos[0],
              right: pos[1] === 'auto' ? 'auto' : pos[1],
              bottom: pos[2] === 'auto' ? 'auto' : pos[2],
              left: pos[3] === 'auto' ? 'auto' : pos[3],
              width: 10, height: 10,
            }}>
              <svg viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="1.5" fill={gold}/>
                <circle cx="5" cy="5" r="4" fill="none" stroke={gold} strokeWidth="0.3"/>
              </svg>
            </div>
          ))}
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)',
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            color: ink, textAlign: 'left',
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 640, marginTop: 8 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3,
            background: 'rgba(26,22,64,0.6)', color: gold, border: `0.5px solid rgba(224,192,104,0.5)`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em',
          }}>← previous card</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3,
            background: 'rgba(26,22,64,0.6)', color: gold, border: `0.5px solid rgba(224,192,104,0.5)`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em',
          }}>next card →</button>
        </div>
      </div>
    </main>
  );
}

function V20Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v20;
  const gold = colors.accent;
  const tone = V20_BG_TONES[colors.bgTone] || V20_BG_TONES.cosmic;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 32px', borderTop: `1px solid rgba(224,192,104,0.3)`, display: 'flex', alignItems: 'center', gap: 18,
      fontSize: 10, color: 'rgba(232,220,196,0.55)', letterSpacing: '0.3em', fontStyle: 'italic',
      fontFamily: 'var(--serif)', background: tone.edge,
    }}>
      <span>{toRomanV17(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(224,192,104,0.25)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: gold, boxShadow: `0 0 8px ${gold}` }}/>
      </div>
      <span>{toRomanV17(total)}</span>
    </div>
  );
}

window.V20Reader = V20Reader;
window.V20Footer = V20Footer;
