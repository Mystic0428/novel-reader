// src/themes/v88-thangka.jsx — Tibetan thangka: deep saffron/maroon, mandala border, gold accents
const V88_BG_TONES = {
  saffron:  { bg: '#3A1808', surface: '#4A2410', ink: '#F8E0B0', mute: '#C89858', rule: '#5A3818', glow: '#FF9038' },
  maroon:   { bg: '#2A0A0E', surface: '#3A1218', ink: '#F0D8B0', mute: '#C09058', rule: '#4A1A28', glow: '#E84838' },
  gold:     { bg: '#241808', surface: '#3A2810', ink: '#FFE4B0', mute: '#C8A058', rule: '#4A3018', glow: '#FFC848' },
  jade:     { bg: '#0F2818', surface: '#1A3A24', ink: '#E8E8B0', mute: '#88A878', rule: '#1F4828', glow: '#88D098' },
  sky:      { bg: '#0A1A2A', surface: '#142A3A', ink: '#E0E8F0', mute: '#7898B8', rule: '#1F3450', glow: '#5898D8' },
  midnight: { bg: '#08081A', surface: '#141A28', ink: '#F0E0B8', mute: '#A88858', rule: '#1F2840', glow: '#FFC848' },
  bone:     { bg: '#E8DCC0', surface: '#D8CCA8', ink: '#1A1408', mute: '#5A4828', rule: '#A88848', glow: '#A85820' },
  charcoal: { bg: '#181818', surface: '#262626', ink: '#F0DCB0', mute: '#A88858', rule: '#383838', glow: '#FFB454' },
  indigo:   { bg: '#1F1438', surface: '#2A1F4A', ink: '#F0E0E8', mute: '#A8A0C0', rule: '#3A2A58', glow: '#A878FF' },
};

function V88Mandala({ glow, opacity }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, pointerEvents: 'none', opacity,
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'><g fill='none' stroke='${encodeURIComponent(glow)}' stroke-width='0.8'><circle cx='200' cy='200' r='180'/><circle cx='200' cy='200' r='150'/><circle cx='200' cy='200' r='110'/><circle cx='200' cy='200' r='70'/><circle cx='200' cy='200' r='30'/><path d='M200 20 L200 380 M20 200 L380 200 M75 75 L325 325 M325 75 L75 325'/><circle cx='200' cy='80' r='10' fill='${encodeURIComponent(glow)}' fill-opacity='0.4'/><circle cx='200' cy='320' r='10' fill='${encodeURIComponent(glow)}' fill-opacity='0.4'/><circle cx='80' cy='200' r='10' fill='${encodeURIComponent(glow)}' fill-opacity='0.4'/><circle cx='320' cy='200' r='10' fill='${encodeURIComponent(glow)}' fill-opacity='0.4'/></g></svg>")`,
      backgroundPosition: 'center 30%', backgroundRepeat: 'no-repeat', backgroundSize: '520px',
    }}/>
  );
}

function V88Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V88_BG_TONES[settings.themeColors.v88.bgTone] || V88_BG_TONES.saffron;
  const accent = settings.themeColors.v88.accent;
  const { bg, surface, ink, mute, rule, glow } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Cormorant Garamond","EB Garamond",var(--serif)',
    }}>
      <V88Mandala glow={glow} opacity={0.06}/>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* outer frame — like a thangka mount */}
        <div style={{
          padding: 14, background: `linear-gradient(135deg, ${glow}, ${accent} 50%, ${glow})`,
          boxShadow: `0 12px 30px rgba(0,0,0,0.4)`,
        }}>
          <div style={{
            padding: '32px 36px', background: surface, color: ink,
            border: `1px solid ${glow}`,
            position: 'relative',
          }}>
            {/* sutra-like prefix */}
            <div style={{
              fontFamily: 'var(--serif)', fontSize: 11, color: glow,
              letterSpacing: '0.5em', fontWeight: 700, textAlign: 'center', marginBottom: 4,
            }}>
              ☸ SŪTRA · CANTO {chapterIdx + 1} ☸
            </div>

            <h1 style={{
              fontFamily: '"Noto Serif TC","Songti TC",serif', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
              textAlign: 'center', margin: '6px 0 10px', letterSpacing: '0.06em', color: ink,
              textShadow: `0 0 14px ${glow}40`,
            }}>{stripChapterPrefix(chapterTitle)}</h1>

            {/* om mani sigil divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26,
            }}>
              <div style={{ flex: 1, height: 0.5, background: glow, opacity: 0.5 }}/>
              <span style={{ color: glow, fontSize: 18, letterSpacing: '0.4em' }}>ॐ ☸ ॐ</span>
              <div style={{ flex: 1, height: 0.5, background: glow, opacity: 0.5 }}/>
            </div>

            <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
              fontFamily: 'var(--serif)', color: ink,
              fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
              textAlign: 'justify',
              '--accent': glow,
            }} dangerouslySetInnerHTML={{ __html: html }}/>

            <div style={{
              textAlign: 'center', marginTop: 30, color: glow, fontSize: 14, letterSpacing: '0.5em',
            }}>
              ☸ ❀ ☸
            </div>
          </div>
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: glow, border: `1.5px solid ${glow}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12,
          }}>← prior canto</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: glow, color: bg, border: `1.5px solid ${glow}`,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.25em', fontSize: 12, fontWeight: 700,
          }}>next canto →</button>
        </div>
      </article>
    </main>
  );
}

function V88Footer({ book, chapterIdx, settings }) {
  const tone = V88_BG_TONES[settings.themeColors.v88.bgTone] || V88_BG_TONES.saffron;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `1px solid ${tone.glow}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: tone.mute, letterSpacing: '0.25em',
    }}>
      <span style={{ color: tone.glow }}>☸ canto {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.glow, boxShadow: `0 0 6px ${tone.glow}80` }}/>
      </div>
      <span style={{ color: tone.glow }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V88Reader = V88Reader;
window.V88Footer = V88Footer;
