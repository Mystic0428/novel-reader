// src/themes/v76-bulletin.jsx — government bulletin: official seal, ribbon banner, numbered articles
const V76_BG_TONES = {
  federal:  { bg: '#F5EFE0', surface: '#E8E0CC', ink: '#0A1228', mute: '#5878A0', rule: '#3858A8', accent2: '#B82820' },
  archive:  { bg: '#E8DCB8', surface: '#D8CCA8', ink: '#1A140A', mute: '#6B5028', rule: '#9C8048', accent2: '#A03028' },
  soviet:   { bg: '#1F0A0A', surface: '#2A1212', ink: '#F8E8C8', mute: '#A88058', rule: '#5A1F1F', accent2: '#FFD24A' },
  british:  { bg: '#0F1838', surface: '#1A2348', ink: '#F0E4B8', mute: '#9098B8', rule: '#28336A', accent2: '#D4AF5C' },
  imperial: { bg: '#3A1A0A', surface: '#4A2412', ink: '#F8E8C8', mute: '#B88858', rule: '#5A2818', accent2: '#FFD24A' },
  ministry: { bg: '#E0E4E8', surface: '#D0D4D8', ink: '#0A0A0A', mute: '#586068', rule: '#A0A8B0', accent2: '#0F4880' },
  treasury: { bg: '#1A2818', surface: '#243424', ink: '#E8DCB8', mute: '#90A878', rule: '#384828', accent2: '#D4AF5C' },
  judicial: { bg: '#F8F8F4', surface: '#E8E8E0', ink: '#0A0A0A', mute: '#585848', rule: '#A8A898', accent2: '#8B1A1A' },
  royal:    { bg: '#28083A', surface: '#380F4C', ink: '#F0E4B8', mute: '#B098C0', rule: '#4A1F60', accent2: '#FFD24A' },
};

function V76Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const tone = V76_BG_TONES[settings.themeColors.v76.bgTone] || V76_BG_TONES.federal;
  const accent = settings.themeColors.v76.accent;
  const { bg, surface, ink, mute, rule, accent2 } = tone;
  const total = book.chaptersMeta.length;
  return (
    <main ref={scrollRef} onScroll={onScroll} className="scroll scroll-thin" style={{
      flex: 1, background: bg, color: ink, padding: 0, position: 'relative',
      fontFamily: '"EB Garamond","Times New Roman",var(--serif)',
    }}>
      <article style={{ maxWidth: 720, margin: '0 auto', padding: '36px 50px 60px', position: 'relative' }}>
        {/* ribbon banner masthead */}
        <div style={{
          textAlign: 'center', paddingBottom: 14, marginBottom: 8,
          borderBottom: `4px double ${ink}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, marginBottom: 6 }}>
            <span style={{ height: 2, width: 60, background: accent }}/>
            <span style={{ fontSize: 11, color: accent, letterSpacing: '0.5em', fontWeight: 800 }}>★</span>
            <span style={{
              fontSize: 11, color: ink, letterSpacing: '0.45em', fontWeight: 800, textTransform: 'uppercase',
            }}>OFFICIAL BULLETIN</span>
            <span style={{ fontSize: 11, color: accent, letterSpacing: '0.5em', fontWeight: 800 }}>★</span>
            <span style={{ height: 2, width: 60, background: accent }}/>
          </div>
          <div style={{
            fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 800, color: ink,
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>{book.title}</div>
          <div style={{
            fontSize: 10, color: mute, letterSpacing: '0.3em', marginTop: 4, fontStyle: 'italic',
          }}>
            VOL. {Math.floor(chapterIdx / 10) + 1} · NO. {String(chapterIdx + 1).padStart(3, '0')} · BY {(book.author || 'OFFICE OF UNKNOWN').toUpperCase()}
          </div>
        </div>

        {/* official seal corner */}
        <div style={{
          position: 'absolute', top: 30, right: 30,
          width: 56, height: 56, borderRadius: '50%',
          border: `2px solid ${accent}`,
          display: 'grid', placeItems: 'center', textAlign: 'center', lineHeight: 1.1,
          fontSize: 8, fontWeight: 800, color: accent, letterSpacing: '0.15em',
          background: `radial-gradient(circle, ${surface} 60%, ${bg} 100%)`,
        }}>
          OFFICIAL<br/>SEAL<br/>★
        </div>

        {/* article header */}
        <div style={{
          marginTop: 22, marginBottom: 14, display: 'flex', alignItems: 'baseline', gap: 14,
        }}>
          <div style={{
            background: ink, color: bg, padding: '4px 12px',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.3em',
          }}>
            ARTICLE {toRomanV17(chapterIdx + 1)}
          </div>
          <div style={{
            fontSize: 10, color: accent2, letterSpacing: '0.3em', fontWeight: 700, textTransform: 'uppercase',
          }}>
            ◆ Filed of public record ◆
          </div>
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 12, fontWeight: 800,
          margin: '0 0 14px', letterSpacing: '0.02em', color: ink,
          textTransform: 'uppercase',
        }}>{stripChapterPrefix(chapterTitle)}</h1>
        <div style={{ height: 0.5, background: ink, marginBottom: 22 }}/>

        {/* body */}
        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)', color: ink,
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight,
          textAlign: 'justify', columnRule: `1px solid ${rule}`,
          '--accent': accent,
        }} dangerouslySetInnerHTML={{ __html: html }}/>

        {/* attestation block */}
        <div style={{
          marginTop: 32, padding: '14px 18px',
          border: `1.5px solid ${ink}`, background: surface,
          fontSize: 11, color: ink, fontFamily: 'var(--serif)', fontStyle: 'italic',
        }}>
          So filed and witnessed this {chapterIdx + 1}{ordinalSuffix(chapterIdx + 1)} day · by ORDER №{String(chapterIdx + 1).padStart(4, '0')} · {Math.round((chapterIdx + 1) / total * 100)}% of dossier on record.
        </div>

        {/* nav */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 18, borderTop: `4px double ${ink}` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: 'transparent', color: ink, border: `1.5px solid ${ink}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.25em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>◀ Prior Article</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3, padding: '8px 16px', borderRadius: 0,
            background: ink, color: bg, border: `1.5px solid ${ink}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.25em', fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
          }}>Next Article ▶</button>
        </div>
      </article>
    </main>
  );
}

function ordinalSuffix(n) {
  const v = n % 100;
  if (v >= 11 && v <= 13) return 'th';
  switch (n % 10) { case 1: return 'st'; case 2: return 'nd'; case 3: return 'rd'; default: return 'th'; }
}

function V76Footer({ book, chapterIdx, settings }) {
  const tone = V76_BG_TONES[settings.themeColors.v76.bgTone] || V76_BG_TONES.federal;
  const accent = settings.themeColors.v76.accent;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '8px 28px', background: tone.surface, borderTop: `4px double ${tone.ink}`,
      display: 'flex', alignItems: 'center', gap: 14,
      fontFamily: 'var(--serif)', fontSize: 11, color: tone.mute, letterSpacing: '0.3em', fontWeight: 700, textTransform: 'uppercase',
    }}>
      <span style={{ color: accent }}>★ Art. {toRomanV17(chapterIdx + 1)}</span>
      <div style={{ flex: 1, height: 2, background: tone.rule, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: accent }}/>
      </div>
      <span>of {toRomanV17(total)}</span>
    </div>
  );
}

window.V76Reader = V76Reader;
window.V76Footer = V76Footer;
