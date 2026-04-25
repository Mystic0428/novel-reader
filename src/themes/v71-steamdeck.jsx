// src/themes/v71-steamdeck.jsx — Steam Deck-style game UI: dark panels, tabs, achievement badges
const V71_BG_TONES = {
  steam:       { bg: '#1B2838', surface: '#2A3F5F', card: '#171A21', ink: '#F0F4F8', mute: '#8F98A0', rule: '#3D5878', accent2: '#66C0F4' },
  valve:       { bg: '#1A1A1A', surface: '#2A2A2A', card: '#0F0F0F', ink: '#F0F0F0', mute: '#A0A0A0', rule: '#3A3A3A', accent2: '#FF6B00' },
  xbox:        { bg: '#101010', surface: '#1F2421', card: '#0A0E0A', ink: '#F0F4F0', mute: '#8FA888', rule: '#2F4030', accent2: '#107C10' },
  playstation: { bg: '#0A0F1A', surface: '#1F2A3D', card: '#040810', ink: '#F0F2F8', mute: '#8898B0', rule: '#2A3855', accent2: '#003791' },
  nintendo:    { bg: '#1A0A0A', surface: '#2A1212', card: '#100808', ink: '#FFF0F0', mute: '#C09898', rule: '#4A2222', accent2: '#E60012' },
  retro:       { bg: '#1A0F08', surface: '#2A1F10', card: '#100804', ink: '#FFB454', mute: '#A07840', rule: '#3A2A18', accent2: '#FF8838' },
  void:        { bg: '#000000', surface: '#0F0F0F', card: '#000000', ink: '#FFFFFF', mute: '#888888', rule: '#222222', accent2: '#00F0FF' },
  arctic:      { bg: '#E8ECF0', surface: '#F8FAFC', card: '#FFFFFF', ink: '#0A1828', mute: '#5878A0', rule: '#A8C0D8', accent2: '#3A6AC0' },
  midnight:    { bg: '#080A14', surface: '#141828', card: '#040608', ink: '#F0F4F8', mute: '#7080A0', rule: '#1F2A40', accent2: '#A0B8FF' },
};

function V71Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V71_BG_TONES[settings.themeColors.v71.bgTone] || V71_BG_TONES.steam;
  const accent = settings.themeColors.v71.accent;
  const { bg, surface, card, ink, mute, rule, accent2 } = tone;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
    }}>
      {/* tab bar */}
      <div style={{
        display: 'flex', gap: 0, padding: '0 30px', background: card,
        borderBottom: `1px solid ${rule}`, alignItems: 'flex-end', height: 38,
      }}>
        {['CHAPTER', 'TROPHIES', 'NOTES'].map((tab, i) => (
          <div key={tab} style={{
            padding: '8px 18px', fontSize: 11, fontWeight: 700, letterSpacing: '0.2em',
            color: i === 0 ? ink : mute,
            borderBottom: i === 0 ? `2px solid ${accent}` : '2px solid transparent',
            cursor: 'pointer',
          }}>{tab}</div>
        ))}
        <div style={{ flex: 1 }}/>
        <div style={{
          padding: '8px 18px', fontSize: 11, color: accent2, fontWeight: 700, letterSpacing: '0.2em',
        }}>● ONLINE</div>
      </div>

      <article style={{ maxWidth: 760, margin: '0 auto', padding: '32px 30px 50px' }}>
        {/* hero card */}
        <div style={{
          background: card, border: `1px solid ${rule}`, borderRadius: 6,
          padding: '20px 24px', marginBottom: 22,
          boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 6, background: accent,
              display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 900, color: bg,
              fontFamily: 'monospace',
            }}>{String(chapterIdx + 1).padStart(2, '0')}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: accent2, letterSpacing: '0.3em', fontWeight: 700 }}>
                CHAPTER {String(chapterIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: 18, fontWeight: 700, color: ink, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{stripChapterPrefix(chapterTitle)}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: mute, letterSpacing: '0.2em' }}>PLAYTIME</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: ink, fontVariantNumeric: 'tabular-nums' }}>
                {Math.floor(chapterIdx * 0.4)}h {(chapterIdx * 13) % 60}m
              </div>
            </div>
          </div>
          {/* progress bar */}
          <div style={{
            height: 6, background: rule, borderRadius: 3, overflow: 'hidden', position: 'relative',
          }}>
            <div style={{
              position: 'absolute', inset: 0, width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${accent}, ${accent2})`,
            }}/>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 6,
            fontSize: 10, color: mute, letterSpacing: '0.2em', fontWeight: 700,
          }}>
            <span>COMPLETION</span>
            <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
          </div>
        </div>

        {/* achievement unlocked toast */}
        <div style={{
          background: card, border: `1px solid ${accent}`, borderLeft: `4px solid ${accent}`, borderRadius: 4,
          padding: '10px 14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%', background: accent,
            display: 'grid', placeItems: 'center', fontSize: 14,
          }}>🏆</div>
          <div>
            <div style={{ fontSize: 9, color: accent, letterSpacing: '0.3em', fontWeight: 800 }}>
              ACHIEVEMENT UNLOCKED
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: ink, marginTop: 2 }}>
              Reached Chapter {chapterIdx + 1}
            </div>
          </div>
          <div style={{ flex: 1 }}/>
          <div style={{
            fontSize: 10, color: mute, letterSpacing: '0.2em', fontWeight: 700,
          }}>{Math.round(progress * 100)}G</div>
        </div>

        {/* body card */}
        <div style={{
          background: card, border: `1px solid ${rule}`, borderRadius: 6,
          padding: '24px 28px',
        }}>
          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--sans)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': accent,
          }} dangerouslySetInnerHTML={{ __html: html }}/>
        </div>

        {/* nav */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 24, gap: 12,
        }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '10px 22px', borderRadius: 4,
            background: card, color: ink, border: `1px solid ${rule}`,
            fontFamily: 'var(--sans)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 700,
          }}>◀ PREVIOUS</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '10px 22px', borderRadius: 4,
            background: accent, color: bg, border: `1px solid ${accent}`,
            fontFamily: 'var(--sans)', letterSpacing: '0.2em', fontSize: 11, fontWeight: 800,
            boxShadow: `0 0 14px ${accent}55`,
          }}>NEXT ▶</button>
        </div>
      </article>
    </main>
  );
}

function V71Footer({ book, chapterIdx, settings }) {
  const tone = V71_BG_TONES[settings.themeColors.v71.bgTone] || V71_BG_TONES.steam;
  const accent = settings.themeColors.v71.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.card, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--sans)', fontSize: 11, color: tone.mute, letterSpacing: '0.2em', fontWeight: 700,
    }}>
      <span style={{ color: tone.accent2 }}>◢ {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 4, background: tone.surface, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${accent}, ${tone.accent2})`,
        }}/>
      </div>
      <span style={{ color: accent }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V71Reader = V71Reader;
window.V71Footer = V71Footer;
