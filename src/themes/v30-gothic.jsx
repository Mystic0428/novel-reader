// src/themes/v30-gothic.jsx — Neo-Gothic Penguin Classics: black + fire, coffin cards
const V30_BG_TONES = {
  ash:      { bg: '#0A0A0A', bg2: '#1A1410' },
  crypt:    { bg: '#0C0A10', bg2: '#1A1724' },
  blood:    { bg: '#100606', bg2: '#1C0E0E' },
  moss:     { bg: '#0A1210', bg2: '#141D1A' },
  oxide:    { bg: '#120A06', bg2: '#1E130A' },
  midnight: { bg: '#07081A', bg2: '#0F112A' },
  tomb:     { bg: '#0E0E10', bg2: '#1B1B1F' },
  soot:     { bg: '#0A0908', bg2: '#1A1614' },
  iron:     { bg: '#0E1014', bg2: '#1A1D24' },
};

function V30Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V30_BG_TONES[settings.themeColors.v30.bgTone] || V30_BG_TONES.ash;
  const fire = settings.themeColors.v30.accent;
  const fireL = lightenHex(fire, 0.3);
  const { bg, bg2 } = tone;
  const cream = '#F0E2C4', bone = '#C8B89A';
  const mute = 'rgba(240,226,196,0.55)', soft = 'rgba(240,226,196,0.82)';
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: `radial-gradient(ellipse at 50% 20%, ${bg2} 0%, ${bg} 70%)`,
      color: cream, fontFamily: 'var(--serif)', position: 'relative', overflow: 'auto', padding: 0,
      '--accent': fire,
    }}>
      {/* flame edge */}
      <div style={{
        position: 'sticky', top: 0, left: 0, right: 0, height: 22,
        background: `linear-gradient(0deg, ${fire} 0%, transparent 100%)`, opacity: 0.35,
        clipPath: `polygon(0 100%, 3% 40%, 6% 80%, 10% 30%, 15% 70%, 20% 40%, 26% 85%, 32% 30%,
          38% 60%, 44% 25%, 50% 70%, 56% 35%, 62% 80%, 68% 30%, 74% 65%, 80% 25%, 86% 75%, 92% 40%,
          97% 70%, 100% 30%, 100% 100%)`,
        pointerEvents: 'none', zIndex: 2,
      }}/>

      {/* header: Redwing Classics faux masthead */}
      <header style={{ padding: '22px 40px 16px', borderBottom: `2px solid ${fire}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 42, height: 52, background: fire,
            clipPath: 'polygon(15% 0, 85% 0, 100% 20%, 100% 80%, 85% 100%, 15% 100%, 0 80%, 0 20%)',
            display: 'grid', placeItems: 'center', color: bg, fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700,
          }}>ℜ</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.5em', color: fire, fontWeight: 700 }}>REDWING  CLASSICS</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: cream, letterSpacing: '0.05em', lineHeight: 1, marginTop: 2 }}>
              {book.title}
            </div>
            {book.author && (
              <div style={{ fontSize: 11, color: mute, fontStyle: 'italic', marginTop: 2 }}>
                by {book.author}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: 10, letterSpacing: '0.3em', color: mute, textAlign: 'right', lineHeight: 1.8 }}>
          GOTHIC · VOL {toRomanV30(chapterIdx + 1)}<br/>
          <span style={{ color: fire, fontWeight: 700 }}>№ {String(chapterIdx + 1).padStart(4, '0')}</span>
        </div>
      </header>

      {/* main body */}
      <div style={{ padding: '32px 48px', maxWidth: 780, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.6em', color: fire, fontWeight: 700 }}>
            ✝   CHAPTER  {toRomanV30(chapterIdx + 1)}   ✝
          </div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, color: cream,
            letterSpacing: '0.04em', marginTop: 10, lineHeight: 1.1,
            textShadow: `0 0 18px ${fire}66`,
          }}>
            {stripChapterPrefix(chapterTitle)}
          </div>
          <div style={{ width: 120, height: 1, background: fire, margin: '16px auto' }}/>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: cream,
          textAlign: 'justify', fontFamily: settings.tweaks.font === 'serif' ? 'var(--serif)' : 'var(--sans)',
        }} dangerouslySetInnerHTML={{ __html: book.preserveOriginalCss ? html : injectDropCap(html, settings.tweaks.fontSize * 2.5) }}/>

        <div style={{ textAlign: 'center', color: fire, marginTop: 20, letterSpacing: '0.6em' }}>
          ☩   ☩   ☩
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: `1px solid ${bone}33` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{ ...btnStyle(), opacity: canPrev ? 1 : 0.3, background: 'transparent', color: fireL, border: `1px solid ${fire}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>← PRIOR</button>
          <button onClick={onNext} disabled={!canNext} style={{ ...btnStyle(), opacity: canNext ? 1 : 0.3, background: 'transparent', color: fireL, border: `1px solid ${fire}`, fontFamily: 'var(--serif)', letterSpacing: '0.2em' }}>NEXT →</button>
        </div>
      </div>
    </main>
  );
}

function V30Footer({ book, chapterIdx, settings }) {
  const tone = V30_BG_TONES[settings.themeColors.v30.bgTone] || V30_BG_TONES.ash;
  const fire = settings.themeColors.v30.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', background: tone.bg, borderTop: `2px solid ${fire}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)',
      fontSize: 10, color: 'rgba(240,226,196,0.55)', letterSpacing: '0.4em',
    }}>
      <span>{toRomanV30(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(240,226,196,0.15)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: fire, boxShadow: `0 0 8px ${fire}` }}/>
      </div>
      <span>{toRomanV30(total)}</span>
    </div>
  );
}

function toRomanV30(n) {
  if (!n || n < 1) return '';
  if (n > 3999) return String(n);
  const map = [['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90], ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
  let out = '', x = n;
  for (const [s, v] of map) { while (x >= v) { out += s; x -= v; } }
  return out;
}

function lightenHex(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.round(((n >> 16) & 255) + 255 * amt));
  const g = Math.min(255, Math.round(((n >> 8) & 255) + 255 * amt));
  const b = Math.min(255, Math.round((n & 255) + 255 * amt));
  return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

window.V30Reader = V30Reader;
window.V30Footer = V30Footer;
