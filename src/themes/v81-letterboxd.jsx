// src/themes/v81-letterboxd.jsx — Letterboxd-style review card: dark UI, star rating, watched-on stamps
const V81_BG_TONES = {
  letterboxd: { bg: '#14181C', surface: '#1C2228', card: '#2C3440', ink: '#E8E8E8', mute: '#9098A0', rule: '#384048', star: '#00C030' },
  midnight:   { bg: '#0A0F1A', surface: '#141A28', card: '#1F2840', ink: '#E0E4F0', mute: '#7088A0', rule: '#1F2840', star: '#5878FF' },
  slate:      { bg: '#1A1A1F', surface: '#262630', card: '#34344A', ink: '#E0DCD0', mute: '#9090A0', rule: '#404050', star: '#FFC844' },
  forest:     { bg: '#0F1A14', surface: '#1A2D24', card: '#243A2F', ink: '#E0E8C8', mute: '#88A088', rule: '#1F3A2A', star: '#88FFAA' },
  plum:       { bg: '#1A0A1A', surface: '#240F24', card: '#3A1A3A', ink: '#F0E0F0', mute: '#A088A0', rule: '#3A1A3A', star: '#FF98DC' },
  amber:      { bg: '#1A1208', surface: '#241808', card: '#3A2418', ink: '#F0DCB8', mute: '#A88858', rule: '#3A2818', star: '#FFB454' },
  crimson:    { bg: '#1A0A0A', surface: '#241010', card: '#3A1818', ink: '#F0DCD0', mute: '#A08080', rule: '#3A1818', star: '#FF6B5C' },
  cream:      { bg: '#F0EEE8', surface: '#E0DED8', card: '#FFFFFF', ink: '#14181C', mute: '#586068', rule: '#A8B0B8', star: '#00A028' },
  paper:      { bg: '#F8F4E8', surface: '#E8E4D8', card: '#FFFCEC', ink: '#1A1408', mute: '#6B5828', rule: '#B89868', star: '#A88828' },
};

function V81StarRow({ filled, color }) {
  return (
    <span style={{ display: 'inline-flex', gap: 1, fontSize: 14, lineHeight: 1, color }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i}>{i < filled ? '★' : '☆'}</span>
      ))}
    </span>
  );
}

function V81Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V81_BG_TONES[settings.themeColors.v81.bgTone] || V81_BG_TONES.letterboxd;
  const accent = settings.themeColors.v81.accent;
  const { bg, surface, card, ink, mute, rule, star } = tone;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  // Pseudo-rating from chapter index for variety
  const rating = ((chapterIdx * 7 + book.id ? book.id.length : 3) % 5) + 1;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"Inter","Helvetica Neue",sans-serif',
    }}>
      <article style={{ maxWidth: 780, margin: '0 auto', padding: '32px 30px 50px' }}>
        {/* user-card header */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
          paddingBottom: 14, borderBottom: `1px solid ${rule}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, ${accent}, ${star})`,
            display: 'grid', placeItems: 'center', fontWeight: 800, color: bg, fontSize: 14,
          }}>{(book.author || 'A')[0].toUpperCase()}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, color: ink, fontWeight: 700 }}>
              {book.author || 'Anonymous'} <span style={{ color: mute, fontWeight: 500 }}>watched</span> {book.title}
            </div>
            <div style={{ fontSize: 11, color: mute, marginTop: 2 }}>
              <V81StarRow filled={rating} color={star}/>
              <span style={{ marginLeft: 8 }}>· chapter {chapterIdx + 1} of {total}</span>
            </div>
          </div>
        </div>

        {/* film-card */}
        <div style={{
          background: card, padding: '20px 22px', borderRadius: 4, marginBottom: 22,
          border: `1px solid ${rule}`, position: 'relative',
        }}>
          <div style={{
            fontSize: 10, color: star, letterSpacing: '0.3em', fontWeight: 800, marginBottom: 4,
          }}>
            ▶ NOW SHOWING · CH {String(chapterIdx + 1).padStart(2, '0')}
          </div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 14, fontWeight: 700,
            margin: '0 0 4px', color: ink, letterSpacing: '-0.01em',
          }}>{stripChapterPrefix(chapterTitle)}</h1>
          <div style={{
            fontSize: 12, color: mute, fontStyle: 'italic',
          }}>
            featuring {book.author || 'an unknown ensemble'} · runtime {Math.floor((book.wordCount || 0) / 250)} min
          </div>
        </div>

        {/* watched-on stamps row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
          <V81Tag label="📅 Watched" value={`Day ${chapterIdx + 1}`} mute={mute} ink={ink} card={surface}/>
          <V81Tag label="⭐ Rating" value={`${rating}/5`} mute={mute} ink={star} card={surface}/>
          <V81Tag label="🎬 Genre" value={(book.tags || ['Fiction'])[0]} mute={mute} ink={ink} card={surface}/>
          <V81Tag label="📖 Progress" value={`${Math.round(progress * 100)}%`} mute={mute} ink={accent} card={surface}/>
        </div>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--sans)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': star,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* review footer */}
        <div style={{
          marginTop: 32, padding: '14px 18px', background: surface,
          borderLeft: `3px solid ${star}`, borderRadius: 4,
          fontSize: 12, color: mute, lineHeight: 1.6, fontStyle: 'italic',
        }}>
          <div style={{ color: star, fontWeight: 700, fontSize: 10, letterSpacing: '0.3em', marginBottom: 4 }}>
            ◆ NOTES
          </div>
          Watched chapter {chapterIdx + 1} of {total}. {progress >= 0.99 ? 'Final reel.' : 'To be continued.'}
        </div>

        {/* like / rewatch / next row */}
        <div style={{ display: 'flex', gap: 8, marginTop: 24, justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8, fontSize: 12, color: mute }}>
            <span style={{ color: star }}>♥ {chapterIdx * 3 + 7} likes</span>
            <span>· {chapterIdx + 2} comments</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onPrev} disabled={!canPrev} style={{
              ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 14px', borderRadius: 4,
              background: surface, color: ink, border: `1px solid ${rule}`,
              fontFamily: 'inherit', letterSpacing: '0.15em', fontSize: 11, fontWeight: 600,
            }}>◀ Prev</button>
            <button onClick={onNext} disabled={!canNext} style={{
              ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 14px', borderRadius: 4,
              background: star, color: bg, border: `1px solid ${star}`,
              fontFamily: 'inherit', letterSpacing: '0.15em', fontSize: 11, fontWeight: 700,
            }}>Next ▶</button>
          </div>
        </div>
      </article>
    </main>
  );
}

function V81Tag({ label, value, mute, ink, card }) {
  return (
    <div style={{
      padding: '6px 10px', background: card, borderRadius: 16,
      fontSize: 11, fontWeight: 600, color: mute,
      display: 'inline-flex', alignItems: 'center', gap: 6,
    }}>
      <span>{label}</span>
      <span style={{ color: ink, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function V81Footer({ book, chapterIdx, settings }) {
  const tone = V81_BG_TONES[settings.themeColors.v81.bgTone] || V81_BG_TONES.letterboxd;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--sans)', fontSize: 11, color: tone.mute, letterSpacing: '0.15em', fontWeight: 700,
    }}>
      <span style={{ color: tone.star }}>★ ch {chapterIdx + 1}/{total}</span>
      <div style={{ flex: 1, height: 4, background: tone.bg, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: tone.star }}/>
      </div>
      <span style={{ color: tone.star }}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

window.V81Reader = V81Reader;
window.V81Footer = V81Footer;
