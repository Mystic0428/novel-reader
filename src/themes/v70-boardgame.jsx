// src/themes/v70-boardgame.jsx — board game rulebook: hex/dice motifs, rule-numbered headers
const V70_BG_TONES = {
  catan:        { bg: '#E8D8A8', surface: '#D8C898', ink: '#1F1408', mute: '#6B5028', rule: '#B89058' },
  carcassonne:  { bg: '#F0E4C8', surface: '#E0D4B8', ink: '#1F1810', mute: '#6B5838', rule: '#A88848' },
  darkforest:   { bg: '#0F1F18', surface: '#1A2D24', ink: '#E0E8C8', mute: '#90A088', rule: '#1F3A2A' },
  pandemic:     { bg: '#F0F4F4', surface: '#FFFFFF', ink: '#0A1820', mute: '#587078', rule: '#2A4A58' },
  spaceopera:   { bg: '#0A1228', surface: '#141E36', ink: '#E0E4F0', mute: '#7088A8', rule: '#1F2F5A' },
  terraforming: { bg: '#1F1408', surface: '#2D1F10', ink: '#E8C8A0', mute: '#A07050', rule: '#3A2418' },
  chess:        { bg: '#F8F8F4', surface: '#E8E8E0', ink: '#0A0A0A', mute: '#787870', rule: '#383830' },
  gloomhaven:   { bg: '#1A1518', surface: '#262024', ink: '#D8D0D0', mute: '#888080', rule: '#383038' },
  monopoly:     { bg: '#FAEAB8', surface: '#EDDA98', ink: '#1A2818', mute: '#586028', rule: '#A88820' },
};

function V70Hex({ accent, fill, label }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <polygon points="22,4 38,13 38,31 22,40 6,31 6,13" fill={fill} stroke={accent} strokeWidth="1.4"/>
      <text x="22" y="27" textAnchor="middle" fontSize="13" fontWeight="800" fill={accent} fontFamily="serif">{label}</text>
    </svg>
  );
}

function V70Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V70_BG_TONES[settings.themeColors.v70.bgTone] || V70_BG_TONES.catan;
  const accent = settings.themeColors.v70.accent;
  const { bg, surface, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
    }}>
      {/* hex pattern overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='70'><polygon points='40,4 76,22 76,54 40,72 4,54 4,22' fill='none' stroke='${encodeURIComponent(accent)}' stroke-width='1'/></svg>")`,
      }}/>

      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 50px 60px', position: 'relative', zIndex: 1 }}>
        {/* manual masthead */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          paddingBottom: 14, marginBottom: 24, borderBottom: `2px solid ${accent}`,
        }}>
          <V70Hex accent={accent} fill={surface} label={String(chapterIdx + 1)}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 800, textTransform: 'uppercase',
            }}>RULES MANUAL</div>
            <div style={{
              fontSize: 13, color: ink, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>{book.title}</div>
          </div>
          <div style={{
            fontSize: 11, color: mute, letterSpacing: '0.2em', fontWeight: 700,
          }}>STAGE {chapterIdx + 1}/{total}</div>
        </div>

        {/* numbered rule heading */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4,
        }}>
          <span style={{
            display: 'inline-block', minWidth: 40, padding: '2px 10px',
            background: accent, color: bg, fontSize: 11, fontWeight: 800,
            letterSpacing: '0.2em', textAlign: 'center',
          }}>§ {String(chapterIdx + 1).padStart(2, '0')}</span>
          <span style={{ fontSize: 11, color: mute, letterSpacing: '0.3em', fontWeight: 700, textTransform: 'uppercase' }}>
            Rule · Setup
          </span>
        </div>
        <h1 style={{
          fontFamily: 'var(--sans)', fontSize: settings.tweaks.fontSize + 10, fontWeight: 800,
          margin: '6px 0 18px', letterSpacing: '-0.01em', color: ink,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* tip-box / sidebar */}
        <div style={{
          marginTop: 32, padding: '14px 18px',
          background: surface, border: `1px solid ${rule}`, borderLeft: `4px solid ${accent}`,
          fontSize: 12, color: ink, lineHeight: 1.6,
        }}>
          <div style={{
            fontSize: 10, color: accent, letterSpacing: '0.3em', fontWeight: 800, marginBottom: 4,
          }}>◆ TURN ORDER</div>
          <div>{chapterIdx + 1} of {total} stages cleared. {total - chapterIdx - 1} remaining.</div>
        </div>

        {/* dice/meeple progress */}
        <div style={{ display: 'flex', gap: 6, marginTop: 28, flexWrap: 'wrap' }}>
          {Array.from({ length: Math.min(total, 30) }).map((_, i) => {
            const isCurrent = i === chapterIdx;
            const isPast = i < chapterIdx;
            return (
              <div key={i} style={{
                width: 18, height: 18, borderRadius: 4,
                background: isCurrent ? accent : isPast ? `${accent}66` : surface,
                border: `1px solid ${isCurrent ? accent : rule}`,
                fontSize: 9, fontWeight: 700, color: isCurrent ? bg : mute,
                display: 'grid', placeItems: 'center',
                fontFamily: 'monospace',
              }}>
                {isCurrent ? '◆' : ''}
              </div>
            );
          })}
          {total > 30 && (
            <div style={{ alignSelf: 'center', fontSize: 11, color: mute, marginLeft: 6 }}>
              … +{total - 30}
            </div>
          )}
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `1px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 4,
            background: surface, color: ink, border: `1px solid ${rule}`,
            fontFamily: 'var(--sans)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>◀ PREVIOUS RULE</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 4,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--sans)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 800,
          }}>NEXT RULE ▶</button>
        </div>
      </article>
    </main>
  );
}

function V70Footer({ book, chapterIdx, settings }) {
  const tone = V70_BG_TONES[settings.themeColors.v70.bgTone] || V70_BG_TONES.catan;
  const accent = settings.themeColors.v70.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.surface, borderTop: `2px solid ${accent}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--sans)', fontSize: 11, color: tone.mute, letterSpacing: '0.2em', fontWeight: 700, textTransform: 'uppercase',
    }}>
      <span style={{ color: accent }}>◆ stage {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 4, background: tone.bg, border: `1px solid ${tone.rule}`, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V70Reader = V70Reader;
window.V70Footer = V70Footer;
