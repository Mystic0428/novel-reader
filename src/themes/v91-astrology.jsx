// src/themes/v91-astrology.jsx — astrology natal chart: deep navy starfield, zodiac wheel, Greek glyphs
const V91_BG_TONES = {
  nightsky:  { bg: '#04081A', surface: '#0F1428', card: '#1A1F38', ink: '#F0E8B8', mute: '#9090C0', accent: '#FFC848' },
  midnight:  { bg: '#08081A', surface: '#141828', card: '#1F2440', ink: '#E8E0F0', mute: '#A0A0C8', accent: '#A878FF' },
  twilight:  { bg: '#1A0F2A', surface: '#241838', card: '#2F1F4A', ink: '#F0E0F0', mute: '#A898C0', accent: '#E878D0' },
  dawn:      { bg: '#1F0820', surface: '#2A1228', card: '#3A1F38', ink: '#F8DCE0', mute: '#C098A8', accent: '#FF98AC' },
  goldsky:   { bg: '#1A1208', surface: '#28200F', card: '#3A2F18', ink: '#FFE4B0', mute: '#C8A058', accent: '#FFD448' },
  sunset:    { bg: '#1F0810', surface: '#2A1218', card: '#3F1F2A', ink: '#F8DCC0', mute: '#C09080', accent: '#FF7848' },
  solar:     { bg: '#0A0814', surface: '#141028', card: '#1F1838', ink: '#FFF0B8', mute: '#C8B868', accent: '#FFE048' },
  lunar:     { bg: '#181820', surface: '#262630', card: '#34344A', ink: '#E8E8F0', mute: '#9898B0', accent: '#C0C8F0' },
  abyss:     { bg: '#000000', surface: '#0A0A14', card: '#14142A', ink: '#E8DCC0', mute: '#888098', accent: '#FFC848' },
};

function V91Starfield({ accent, opacity }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `radial-gradient(1px 1px at 12% 18%, ${accent} 0, transparent 100%),
                        radial-gradient(1px 1px at 32% 7%, #FFFFFF 0, transparent 100%),
                        radial-gradient(2px 2px at 65% 22%, ${accent} 0, transparent 100%),
                        radial-gradient(1px 1px at 85% 12%, #FFFFFF 0, transparent 100%),
                        radial-gradient(1px 1px at 22% 45%, #FFFFFF 0, transparent 100%),
                        radial-gradient(2px 2px at 55% 55%, ${accent} 0, transparent 100%),
                        radial-gradient(1px 1px at 78% 68%, #FFFFFF 0, transparent 100%),
                        radial-gradient(1px 1px at 18% 80%, ${accent} 0, transparent 100%),
                        radial-gradient(2px 2px at 92% 88%, #FFFFFF 0, transparent 100%),
                        radial-gradient(1px 1px at 5% 92%, ${accent} 0, transparent 100%)`,
      backgroundSize: '100% 100%',
    }}/>
  );
}

function V91ZodiacWheel({ accent, mute }) {
  const glyphs = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  return (
    <svg width="120" height="120" viewBox="-60 -60 120 120">
      <circle cx="0" cy="0" r="55" fill="none" stroke={accent} strokeWidth="0.6" opacity="0.6"/>
      <circle cx="0" cy="0" r="40" fill="none" stroke={accent} strokeWidth="0.4" opacity="0.4"/>
      <circle cx="0" cy="0" r="6" fill={accent} opacity="0.5"/>
      {glyphs.map((g, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x = Math.cos(angle) * 48;
        const y = Math.sin(angle) * 48;
        return (
          <text key={i} x={x} y={y + 4} textAnchor="middle"
            fontSize="11" fill={accent} fontFamily="serif" opacity="0.85">{g}</text>
        );
      })}
    </svg>
  );
}

function V91Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V91_BG_TONES[settings.themeColors.v91.bgTone] || V91_BG_TONES.nightsky;
  const accent = settings.themeColors.v91.accent;
  const { bg, surface, card, ink, mute } = tone;
  const total = book.chaptersMeta.length;
  const sign = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'][chapterIdx % 12];
  const planet = ['☉','☽','☿','♀','♂','♃','♄','♅','♆','♇'][chapterIdx % 10];
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      <V91Starfield accent={accent} opacity={0.7}/>

      <article style={{ maxWidth: 780, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* zodiac header */}
        <div style={{
          display: 'flex', gap: 24, alignItems: 'center', marginBottom: 24,
          padding: '20px 24px', background: card,
          border: `0.5px solid ${accent}66`,
          boxShadow: `0 0 30px ${accent}22`,
        }}>
          <div style={{ flexShrink: 0 }}>
            <V91ZodiacWheel accent={accent} mute={mute}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 700, marginBottom: 4,
            }}>
              ✦ NATAL CHART · CANTO {String(chapterIdx + 1).padStart(2, '0')} ✦
            </div>
            <h1 style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: settings.tweaks.fontSize + 14, fontWeight: 500,
              margin: '4px 0 6px', letterSpacing: '0.04em', color: ink,
              textShadow: `0 0 12px ${accent}40`,
            }}>{stripChapterPrefix(chapterTitle)}</h1>
            <div style={{
              fontSize: 13, color: mute, fontStyle: 'italic',
              display: 'flex', gap: 14, alignItems: 'center',
            }}>
              <span style={{ color: accent, fontSize: 18 }}>{sign}</span>
              <span style={{ color: accent, fontSize: 16 }}>{planet}</span>
              <span>under the {sign} sign</span>
            </div>
          </div>
        </div>

        {/* sextant divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22,
        }}>
          <div style={{ flex: 1, height: 0.5, background: accent, opacity: 0.4 }}/>
          <span style={{ color: accent, fontSize: 14, letterSpacing: '0.5em', textShadow: `0 0 10px ${accent}80` }}>
            ✦ ☉ ✦
          </span>
          <div style={{ flex: 1, height: 0.5, background: accent, opacity: 0.4 }}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize + 1, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* horoscope footer */}
        <div style={{
          marginTop: 30, padding: '14px 18px', background: surface,
          border: `0.5px dashed ${accent}88`,
          fontSize: 12, color: mute, lineHeight: 1.7, fontStyle: 'italic',
        }}>
          <div style={{
            color: accent, letterSpacing: '0.4em', fontSize: 10, fontWeight: 700, marginBottom: 4,
            fontStyle: 'normal',
          }}>
            ✦ HOUSE {chapterIdx + 1} OF {total}
          </div>
          The {sign} of {chapterIdx + 1} aligns with {planet} in the {Math.floor(progress(chapterIdx + 1, total))}th degree.
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: accent, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12,
          }}>← retrograde</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12, fontWeight: 700,
            boxShadow: `0 0 14px ${accent}66`,
          }}>direct →</button>
        </div>
      </article>
    </main>
  );
}

function progress(cur, total) {
  return total ? Math.round((cur / total) * 100) : 0;
}

function V91Footer({ book, chapterIdx, settings }) {
  const tone = V91_BG_TONES[settings.themeColors.v91.bgTone] || V91_BG_TONES.nightsky;
  const total = book.chaptersMeta.length;
  const prog = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.accent}66`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: tone.mute, letterSpacing: '0.3em',
    }}>
      <span style={{ color: tone.accent }}>✦ canto {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: `${tone.accent}33`, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${prog * 100}%`, background: tone.accent, boxShadow: `0 0 6px ${tone.accent}` }}/>
      </div>
      <span style={{ color: tone.accent }}>{Math.round(prog * 100)}%</span>
    </div>
  );
}

window.V91Reader = V91Reader;
window.V91Footer = V91Footer;
