// src/themes/v82-hkcinema.jsx — Hong Kong 80-90s film poster: bold red/yellow, brush title, bilingual block
const V82_BG_TONES = {
  shaw:      { bg: '#1A0808', accent2: '#F0C848', card: '#FAEEDC', ink: '#1A0808', headline: '#C8242C', mute: '#7A4A2A' },
  golden:    { bg: '#28180A', accent2: '#FFD24A', card: '#FBE8B8', ink: '#1A0F08', headline: '#B8302A', mute: '#7A5818' },
  cantonese: { bg: '#1A0F0F', accent2: '#FFE848', card: '#FAEEDC', ink: '#1A1408', headline: '#D8281C', mute: '#7A4A2A' },
  neon:      { bg: '#0A0010', accent2: '#FF38AC', card: '#FFCCEE', ink: '#28083A', headline: '#FF1480', mute: '#7A2860' },
  jade:      { bg: '#0A1A0A', accent2: '#88C038', card: '#E8F4D0', ink: '#0A1A08', headline: '#388A28', mute: '#5A7838' },
  blood:     { bg: '#1A0408', accent2: '#FFC848', card: '#F8DDDC', ink: '#1A0808', headline: '#C8121C', mute: '#7A2828' },
  midnight:  { bg: '#08081A', accent2: '#FFD24A', card: '#E0DCC8', ink: '#0A1228', headline: '#FF382C', mute: '#586090' },
  pearl:     { bg: '#F8F0E0', accent2: '#FF6B00', card: '#FFFCEC', ink: '#1A0808', headline: '#C8242C', mute: '#8B5828' },
  ink:       { bg: '#000000', accent2: '#FFE048', card: '#F8E8C8', ink: '#1A1408', headline: '#FF1820', mute: '#5A4828' },
};

function V82Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V82_BG_TONES[settings.themeColors.v82.bgTone] || V82_BG_TONES.shaw;
  const accent = settings.themeColors.v82.accent;
  const { bg, accent2, card, ink, headline, mute } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: card, padding: 0, position: 'relative',
      fontFamily: '"Noto Serif TC","Songti TC",serif',
    }}>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '40px 30px 60px' }}>
        {/* studio block */}
        <div style={{
          display: 'inline-block', padding: '4px 14px', background: accent2, color: bg,
          fontSize: 10, fontWeight: 900, letterSpacing: '0.4em', marginBottom: 14,
          fontFamily: '"Inter",sans-serif', textTransform: 'uppercase',
        }}>
          ★ EAST ASIAN FILM CO. PRESENTS · 嘉禾出品 ★
        </div>

        {/* huge brush headline */}
        <h1 style={{
          fontFamily: '"Noto Serif TC","Songti TC",serif', fontWeight: 900,
          fontSize: settings.tweaks.fontSize + 30, color: headline,
          letterSpacing: '0.05em', lineHeight: 1.05, margin: '0 0 6px',
          textShadow: `4px 4px 0 ${accent2}, 6px 6px 0 ${bg}`,
        }}>{stripChapterPrefix(chapterTitle)}</h1>

        <div style={{
          fontFamily: '"Inter",sans-serif', fontSize: 14, color: accent2, fontWeight: 800,
          letterSpacing: '0.3em', marginBottom: 4, textTransform: 'uppercase',
        }}>
          {(book.title || '').toUpperCase()}
        </div>
        <div style={{
          fontSize: 11, color: card, opacity: 0.8, letterSpacing: '0.25em', marginBottom: 24,
          textTransform: 'uppercase',
        }}>
          BY {book.author || 'ANONYMOUS'} · 第 {chapterIdx + 1} 集 / 共 {total} 集
        </div>

        {/* film body — paper-like card on dark bg */}
        <div style={{
          background: card, color: ink, padding: '28px 30px',
          border: `3px solid ${accent2}`,
          boxShadow: `8px 8px 0 ${headline}, 8px 8px 0 4px ${bg}`,
          position: 'relative',
        }}>
          {/* corner stamps */}
          <div style={{
            position: 'absolute', top: 12, right: 12,
            width: 56, height: 56, borderRadius: '50%',
            background: headline, color: card,
            display: 'grid', placeItems: 'center', textAlign: 'center', lineHeight: 1.1,
            fontSize: 11, fontWeight: 900, letterSpacing: '0.1em',
            transform: 'rotate(-12deg)',
            boxShadow: `2px 2px 0 ${ink}`,
          }}>
            集{chapterIdx + 1}<br/>章
          </div>

          <div style={{
            fontFamily: 'var(--serif)', fontSize: 11, color: headline, letterSpacing: '0.3em',
            fontWeight: 800, marginBottom: 8,
          }}>
            ◆ DOUBLE FEATURE · 隆重獻映 ◆
          </div>

          <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
            fontFamily: 'var(--serif)', color: ink,
            fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
            '--accent': headline,
          }} dangerouslySetInnerHTML={{ __html: html }}/>

          {/* tagline */}
          <div style={{
            marginTop: 24, padding: '12px 14px',
            background: bg, color: accent2,
            fontSize: 14, fontWeight: 800, fontStyle: 'italic',
            letterSpacing: '0.05em', textAlign: 'center',
            border: `2px dashed ${accent2}`,
          }}>
            「{chapterIdx % 2 === 0 ? '一場江湖風雨 · 一段傳奇人生' : '正邪不兩立 · 恩怨難了結'}」
          </div>
        </div>

        {/* showtimes / nav */}
        <div style={{
          marginTop: 22, padding: '10px 14px', background: bg,
          border: `2px solid ${accent2}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: '"Inter",sans-serif',
        }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            background: 'transparent', color: canPrev ? accent2 : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: canPrev ? 'pointer' : 'default',
            fontSize: 12, fontWeight: 800, letterSpacing: '0.3em', fontFamily: 'inherit',
          }}>◀ 上集</button>
          <span style={{ fontSize: 11, color: card, letterSpacing: '0.4em', fontWeight: 700 }}>
            ★ DAILY 7:00 PM · 全院公映 ★
          </span>
          <button onClick={onNext} disabled={!canNext} style={{
            background: 'transparent', color: canNext ? accent2 : 'rgba(255,255,255,0.3)',
            border: 'none', cursor: canNext ? 'pointer' : 'default',
            fontSize: 12, fontWeight: 800, letterSpacing: '0.3em', fontFamily: 'inherit',
          }}>下集 ▶</button>
        </div>
      </article>
    </main>
  );
}

function V82Footer({ book, chapterIdx, settings }) {
  const tone = V82_BG_TONES[settings.themeColors.v82.bgTone] || V82_BG_TONES.shaw;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.bg, borderTop: `2px solid ${tone.accent2}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: '"Inter",sans-serif', fontSize: 11, color: tone.card, letterSpacing: '0.3em', fontWeight: 800,
    }}>
      <span style={{ color: tone.headline }}>★ 第 {chapterIdx + 1} 集</span>
      <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.accent2 }}/>
      </div>
      <span style={{ color: tone.accent2 }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V82Reader = V82Reader;
window.V82Footer = V82Footer;
