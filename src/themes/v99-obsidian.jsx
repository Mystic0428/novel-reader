// src/themes/v99-obsidian.jsx — Obsidian 黑曜: aristocratic dark fantasy with gold-bordered frame
const V99_BG_TONES = {
  obsidian: { bg: '#0A0B0E', surface: '#14161B', ink: '#D8D0B8', mute: '#7A7868', rule: '#2A2A30' },
  basalt:   { bg: '#0E0F12', surface: '#1A1B1F', ink: '#D4CCB4', mute: '#7A7464', rule: '#2A2B2F' },
  jet:      { bg: '#08080A', surface: '#121214', ink: '#D0CCBC', mute: '#706C5C', rule: '#28282A' },
  ink:      { bg: '#0A0E14', surface: '#141A24', ink: '#D8D4C0', mute: '#787868', rule: '#2A3040' },
  charcoal: { bg: '#1A1A1A', surface: '#262626', ink: '#E0DCC4', mute: '#807868', rule: '#383838' },
  ebony:    { bg: '#100A08', surface: '#1C1410', ink: '#D8C8B0', mute: '#806C58', rule: '#2C2018' },
  midnight: { bg: '#0A0A14', surface: '#141420', ink: '#D8D0BC', mute: '#787868', rule: '#1F1F2A' },
  soot:     { bg: '#0E0E0E', surface: '#1A1A1A', ink: '#D0CCB8', mute: '#706C5C', rule: '#2A2A2A' },
  void:     { bg: '#000000', surface: '#0A0A0A', ink: '#C8C0A8', mute: '#686050', rule: '#1A1A1A' },
};

const V99_ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'];
function v99Roman(n) {
  if (n <= 20) return V99_ROMAN[n];
  // simple fallback for >20
  const mp = [['M',1000],['CM',900],['D',500],['CD',400],['C',100],['XC',90],['L',50],['XL',40],['X',10],['IX',9],['V',5],['IV',4],['I',1]];
  let out = '', m = n;
  for (const [s, v] of mp) { while (m >= v) { out += s; m -= v; } }
  return out;
}

function V99Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V99_BG_TONES[settings.themeColors.v99.bgTone] || V99_BG_TONES.obsidian;
  const { bg, surface, ink, mute, rule } = tone;
  const accent = settings.themeColors.v99.accent;
  const total = book.chaptersMeta.length;
  const isCJKTitle = /[㐀-鿿]/.test((stripChapterPrefix(chapterTitle) || '').slice(0, 1));
  const dropCap = !isCJKTitle ? injectDropCap(html, settings.tweaks.fontSize * 2.6) : html;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, color: ink, padding: '48px 24px',
      background: `radial-gradient(ellipse at center top, ${surface} 0%, ${bg} 70%)`,
    }}>
      <div style={{
        maxWidth: 660, margin: '0 auto',
        border: `1px solid ${accent}`,
        outline: `1px solid ${accent}55`,
        outlineOffset: 4,
        padding: '52px 56px',
      }}>
        {/* Roman numeral folio */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 56, fontWeight: 400, fontStyle: 'italic',
            color: accent, letterSpacing: '0.08em', lineHeight: 1,
          }}>{v99Roman(chapterIdx + 1)}</div>
          <div style={{ fontSize: 9.5, letterSpacing: '0.4em', color: mute, fontWeight: 600, marginTop: 8, textTransform: 'uppercase' }}>
            Cap. {chapterIdx + 1} · ex {total}
          </div>
        </div>

        {/* Centered title with ornament rule */}
        <h1 style={{
          fontFamily: 'var(--serif)', fontWeight: 500,
          fontSize: settings.tweaks.fontSize + 14, color: ink,
          margin: '0 0 18px', lineHeight: 1.25, letterSpacing: '0.04em',
          textAlign: 'center', textTransform: isCJKTitle ? 'none' : 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 36, color: accent }}>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${accent})`, maxWidth: 110 }}/>
          <span style={{ fontSize: 10 }}>✦</span>
          <span style={{ fontSize: 14 }}>◆</span>
          <span style={{ fontSize: 10 }}>✦</span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${accent}, transparent)`, maxWidth: 110 }}/>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: dropCap }}/>

        {/* End ornament */}
        <div style={{ textAlign: 'center', marginTop: 40, color: accent, fontSize: 14, letterSpacing: '0.6em' }}>
          ✦ ◆ ✦
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 36, paddingTop: 22, borderTop: `0.5px solid ${rule}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 18px',
            background: 'transparent', color: ink, border: `1px solid ${accent}66`, borderRadius: 0,
            fontFamily: 'var(--serif)', fontStyle: 'italic', letterSpacing: '0.2em',
          }}>◀ Prior</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 18px',
            background: accent, color: bg, border: `1px solid ${accent}`, borderRadius: 0,
            fontFamily: 'var(--serif)', fontWeight: 700, letterSpacing: '0.2em',
          }}>Sequens ▶</button>
        </div>
      </div>
    </main>
  );
}

function V99Footer({ book, chapterIdx, settings }) {
  const tone = V99_BG_TONES[settings.themeColors.v99.bgTone] || V99_BG_TONES.obsidian;
  const accent = settings.themeColors.v99.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 24px', background: tone.surface, color: tone.mute, borderTop: `1px solid ${tone.rule}`,
      display: 'flex', alignItems: 'center', gap: 14, fontFamily: 'var(--serif)', fontSize: 11, fontStyle: 'italic',
    }}>
      <span style={{ color: accent, letterSpacing: '0.1em' }}>{v99Roman(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 1, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span style={{ color: accent, letterSpacing: '0.1em' }}>{v99Roman(total)}</span>
    </div>
  );
}

window.V99Reader = V99Reader;
window.V99Footer = V99Footer;
