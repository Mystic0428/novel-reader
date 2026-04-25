// src/themes/v90-iching.jsx — I Ching divination: yang ━━━━ / yin ━━ ━━ lines as chapter sigil, slate paper
const V90_BG_TONES = {
  ink:      { bg: '#1A1A1F', surface: '#262630', card: '#0F0F14', ink: '#E0E0D0', mute: '#9090A0', rule: '#3A3A48', accent: '#C8A848' },
  bamboo:   { bg: '#1A2820', surface: '#243424', card: '#0F140F', ink: '#D8E8C8', mute: '#88A088', rule: '#2A4828', accent: '#A8C868' },
  sand:     { bg: '#E8DCC0', surface: '#D8CCA8', card: '#FFFCEC', ink: '#1A1408', mute: '#5A4828', rule: '#A88858', accent: '#8B5828' },
  mist:     { bg: '#2A2E32', surface: '#383C40', card: '#1F2228', ink: '#E0E4E8', mute: '#9098A0', rule: '#48505A', accent: '#A8B0C0' },
  dusk:     { bg: '#28202A', surface: '#3A2A38', card: '#1A1428', ink: '#E0D8E8', mute: '#9888A0', rule: '#3A2A40', accent: '#C088D0' },
  midnight: { bg: '#0A0F1A', surface: '#141A28', card: '#04080F', ink: '#E0E4F0', mute: '#7088A0', rule: '#1F2840', accent: '#A0B8E8' },
  jade:     { bg: '#0F2218', surface: '#1A302A', card: '#08140F', ink: '#D8E8D8', mute: '#80A088', rule: '#1F3A28', accent: '#88C898' },
  scarlet:  { bg: '#1F0810', surface: '#2A1218', card: '#14040A', ink: '#F0D8DC', mute: '#A07088', rule: '#3A1828', accent: '#E8485C' },
  bone:     { bg: '#E0DCC8', surface: '#D0CCB8', card: '#FFFCEC', ink: '#1A1410', mute: '#5A5448', rule: '#A8A498', accent: '#8B6838' },
};

// Generate hexagram from chapter index — 6 lines, each yang or yin, derived from binary
function hexagramLines(n) {
  const out = [];
  for (let i = 5; i >= 0; i--) {
    out.push((n >> i) & 1); // 1 = yang (solid), 0 = yin (broken)
  }
  return out;
}

function V90Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V90_BG_TONES[settings.themeColors.v90.bgTone] || V90_BG_TONES.ink;
  const accent = settings.themeColors.v90.accent;
  const { bg, surface, card, ink, mute, rule } = tone;
  const total = book.chaptersMeta.length;
  const lines = hexagramLines(chapterIdx + 1);
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Noto Serif TC","Songti TC",serif',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '40px 50px 60px' }}>
        {/* hexagram + title block */}
        <div style={{
          display: 'flex', gap: 28, alignItems: 'center',
          padding: '24px 28px', background: card,
          border: `0.5px solid ${rule}`, marginBottom: 22,
        }}>
          {/* hexagram */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
            {lines.map((y, i) => (
              <div key={i} style={{
                display: 'flex', gap: 8, alignItems: 'center', height: 6,
              }}>
                {y === 1 ? (
                  <div style={{ width: 56, height: 6, background: accent }}/>
                ) : (
                  <>
                    <div style={{ width: 24, height: 6, background: accent }}/>
                    <div style={{ width: 8 }}/>
                    <div style={{ width: 24, height: 6, background: accent }}/>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 11, color: accent, letterSpacing: '0.4em', fontWeight: 700, marginBottom: 4,
            }}>
              ☷ 第 {chapterIdx + 1} 卦 / 共 {total}
            </div>
            <h1 style={{
              fontFamily: '"Noto Serif TC","Songti TC",serif', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
              margin: '4px 0 6px', letterSpacing: '0.04em', color: ink,
            }}>{stripChapterPrefix(chapterTitle)}</h1>
            <div style={{
              fontSize: 12, color: mute, fontStyle: 'italic', letterSpacing: '0.1em',
            }}>
              ─ 卦象推演 · {book.author || '無名氏'} 著 ─
            </div>
          </div>
        </div>

        {/* divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, color: mute,
        }}>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
          <span style={{ fontSize: 12, letterSpacing: '0.5em', color: accent }}>☰ ☷ ☵ ☲ ☱ ☶ ☴ ☳</span>
          <div style={{ flex: 1, height: 0.5, background: rule }}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: '"Noto Serif TC","Songti TC",serif', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify',
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* judgment block */}
        <div style={{
          marginTop: 30, padding: '14px 18px',
          background: surface, borderLeft: `3px solid ${accent}`,
          fontSize: 13, color: ink, lineHeight: 1.7, fontStyle: 'italic',
        }}>
          <div style={{
            color: accent, letterSpacing: '0.4em', fontSize: 10, fontWeight: 700, marginBottom: 4,
            fontStyle: 'normal',
          }}>
            ☷ 判 詞
          </div>
          得卦 {chapterIdx + 1} · 共 {total} 卦待參。已悟 {Math.round((chapterIdx + 1) / total * 100)}%。
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 26, paddingTop: 16, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: 'transparent', color: ink, border: `0.5px solid ${rule}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.4em', fontSize: 12,
          }}>← 前 卦</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px', borderRadius: 0,
            background: accent, color: bg, border: `0.5px solid ${accent}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.4em', fontSize: 12, fontWeight: 700,
          }}>後 卦 →</button>
        </div>
      </article>
    </main>
  );
}

function V90Footer({ book, chapterIdx, settings }) {
  const tone = V90_BG_TONES[settings.themeColors.v90.bgTone] || V90_BG_TONES.ink;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `0.5px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontSize: 12, color: tone.mute, letterSpacing: '0.4em',
    }}>
      <span style={{ color: tone.accent }}>☷ 卦 {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent }}/>
      </div>
      <span>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V90Reader = V90Reader;
window.V90Footer = V90Footer;
