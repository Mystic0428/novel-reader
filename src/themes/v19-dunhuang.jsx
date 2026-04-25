// src/themes/v19-dunhuang.jsx — Dunhuang: cinnabar + gold, caisson header, seal stamps
function CaissonHeader({ cinnabar, gold, bg2 }) {
  return (
    <svg width="100%" height="70" viewBox="0 0 600 70" preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <pattern id="dh-cloud" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 q5 -6 10 0 q5 6 10 0 q5 -6 10 0 q5 6 10 0" fill="none" stroke={gold} strokeWidth="0.6"/>
        </pattern>
      </defs>
      <rect width="600" height="70" fill={bg2}/>
      <rect width="600" height="70" fill="url(#dh-cloud)" opacity="0.6"/>
      <rect x="0" y="0" width="600" height="2" fill={cinnabar}/>
      <rect x="0" y="68" width="600" height="2" fill={cinnabar}/>
      <g transform="translate(300 35)">
        <rect x="-34" y="-24" width="68" height="48" fill="none" stroke={cinnabar} strokeWidth="1"/>
        <rect x="-28" y="-18" width="56" height="36" fill="none" stroke={gold} strokeWidth="0.6"/>
        <circle r="14" fill={cinnabar} opacity="0.15"/>
        <circle r="10" fill="none" stroke={gold} strokeWidth="0.6"/>
        <path d="M-6 -6 l12 12 M6 -6 l-12 12" stroke={gold} strokeWidth="0.5"/>
        <circle r="2" fill={cinnabar}/>
      </g>
    </svg>
  );
}

const V19_BG_TONES = {
  masi:     { bg: '#E8D7B5', bg2: '#F4E7C8' }, // 麻紙
  miyellow: { bg: '#F0E4C7', bg2: '#F7ECD2' }, // 米黃
  zhehuang: { bg: '#D4BA8E', bg2: '#E3CCA6' }, // 赭黃
  qianjiang:{ bg: '#E8C7AE', bg2: '#F0D5BE' }, // 淺絳
  bajiao:   { bg: '#D8D4B0', bg2: '#E5E0C4' }, // 芭蕉
  xuebai:   { bg: '#F1EBD5', bg2: '#F7F2E1' }, // 雪白
  shanhu:   { bg: '#F0CFB8', bg2: '#F8DDC9' }, // 珊瑚
  tuhuang:  { bg: '#D8B888', bg2: '#E5C9A2' }, // 土黃
  qingshi:  { bg: '#D7D4C2', bg2: '#E2E0CF' }, // 青石
};

function V19Reader({ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }) {
  const colors = settings.themeColors.v19;
  const cinnabar = colors.accent;
  const gold = '#B48138';
  const tone = V19_BG_TONES[colors.bgTone] || V19_BG_TONES.masi;
  const bg = tone.bg, bg2 = tone.bg2;
  const ink = '#2A1810', soft = 'rgba(42,24,16,0.78)', mute = 'rgba(42,24,16,0.55)';
  const initialSize = (settings.tweaks.fontSize + 4) * 2.4;
  return (
    <main ref={scrollRef} onScroll={onScroll} className={`scroll scroll-thin ${settings.tweaks.texture ? 'paper-tex' : ''}`}
      style={{ flex: 1, overflow: 'auto', background: bg, color: ink, padding: 0, fontFamily: 'var(--serif)', '--accent': cinnabar }}>
      <CaissonHeader cinnabar={cinnabar} gold={gold} bg2={bg2}/>
      <div style={{ padding: '30px 60px 48px', maxWidth: 720, margin: '0 auto' }}>
        {/* Cartouche title */}
        <div style={{ textAlign: 'center', margin: '0 auto 28px' }}>
          <div style={{ display: 'inline-block', padding: '10px 36px', background: cinnabar, color: bg2, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 4, border: `0.5px solid ${gold}`, pointerEvents: 'none' }}/>
            <div style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize + 8, letterSpacing: '0.5em', fontWeight: 500 }}>
              {stripChapterPrefix(chapterTitle)}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: settings.tweaks.fontSize - 2, color: soft, letterSpacing: '0.3em', marginTop: 10 }}>
            {chapterNumberZhV19(chapterIdx + 1)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 16 }}>
            <div style={{ width: 40, height: 1, background: gold }}/>
            <div style={{ width: 6, height: 6, background: cinnabar, transform: 'rotate(45deg)' }}/>
            <div style={{ width: 6, height: 6, border: `1px solid ${gold}`, transform: 'rotate(45deg)' }}/>
            <div style={{ width: 6, height: 6, background: cinnabar, transform: 'rotate(45deg)' }}/>
            <div style={{ width: 40, height: 1, background: gold }}/>
          </div>
        </div>

        <div className="reading-body" style={book.preserveOriginalCss ? undefined : {
          fontFamily: 'var(--serif)',
          fontSize: settings.tweaks.fontSize, lineHeight: settings.tweaks.lineHeight, color: ink,
        }} dangerouslySetInnerHTML={{ __html: book.preserveOriginalCss ? html : injectDropCap(html, settings.tweaks.fontSize * 2.2) }}/>

        {/* Seal stamps */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 8 }}>
          <div style={{
            width: 40, height: 40, background: cinnabar, color: bg2,
            display: 'grid', gridTemplate: '1fr 1fr / 1fr 1fr', placeItems: 'center',
            fontFamily: 'var(--serif)', fontSize: 11, fontWeight: 500,
            border: `1.5px solid ${cinnabar}`, outline: '1px solid rgba(255,255,255,0.2)', outlineOffset: -3,
          }}>
            <span>讀</span><span>之</span><span>有</span><span>印</span>
          </div>
          <div style={{
            width: 40, height: 40, background: 'transparent', color: cinnabar,
            border: `1.5px solid ${cinnabar}`,
            display: 'grid', gridTemplate: '1fr 1fr / 1fr 1fr', placeItems: 'center',
            fontFamily: 'var(--serif)', fontSize: 11, fontWeight: 500,
          }}>
            <span>甲</span><span>戌</span><span>重</span><span>評</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: `0.5px dashed rgba(164,56,40,0.3)` }}>
          <button onClick={onPrev} disabled={!canPrev} style={{
            ...btnStyle(), opacity: canPrev ? 1 : 0.3,
            background: 'transparent', color: cinnabar, border: `1px solid ${cinnabar}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.3em',
          }}>← 前回</button>
          <button onClick={onNext} disabled={!canNext} style={{
            ...btnStyle(), opacity: canNext ? 1 : 0.3,
            background: 'transparent', color: cinnabar, border: `1px solid ${cinnabar}`,
            fontFamily: 'var(--serif)', letterSpacing: '0.3em',
          }}>次回 →</button>
        </div>
      </div>
    </main>
  );
}

function V19Footer({ book, chapterIdx, settings }) {
  const colors = settings.themeColors.v19;
  const cinnabar = colors.accent;
  const tone = V19_BG_TONES[colors.bgTone] || V19_BG_TONES.masi;
  const total = book.chaptersMeta.length;
  const progress = total ? (chapterIdx + 1) / total : 0;
  return (
    <div style={{
      padding: '10px 28px', borderTop: `0.5px solid rgba(164,56,40,0.35)`, display: 'flex', alignItems: 'center', gap: 18,
      fontFamily: 'var(--serif)', fontSize: 11, color: 'rgba(42,24,16,0.7)', letterSpacing: '0.3em',
      background: tone.bg2,
    }}>
      <span>第 {chapterIdx + 1} 回</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(164,56,40,0.25)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, width: `${progress * 100}%`, background: cinnabar }}/>
      </div>
      <span>共 {total} 回</span>
    </div>
  );
}

function chapterNumberZhV19(n) {
  const d = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
  if (n <= 10) return `第 ${d[n]} 回`;
  return `第 ${n} 回`;
}

window.V19Reader = V19Reader;
window.V19Footer = V19Footer;
