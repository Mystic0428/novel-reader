// src/ui/theme-switcher.jsx — dropdown theme picker (scales to many themes)
function ThemeSwitcher({ settings, onChange }) {
  const [open, setOpen] = React.useState(false);
  const themes = [
    { key: 'v1',  label: 'Warm · 書房',       group: '經典', swatch: { bg: '#EDE4D2' } },
    { key: 'v4',  label: 'Glass · 毛玻璃',    group: '經典', swatch: { bg: 'linear-gradient(135deg,#F5DEB3,#C9A5D4)' } },
    { key: 'v5',  label: 'Dark · 典藏',       group: '經典', swatch: { bg: '#13201C' } },
    { key: 'v6',  label: 'Terminal · 終端機',  group: '復古', swatch: { bg: '#0C0A06' } },
    { key: 'v9',  label: 'Brutalist · 野獸派', group: '現代', swatch: { bg: '#EEEBE4' } },
    { key: 'v11', label: 'Apple Books · 書櫃', group: '經典', swatch: { bg: 'linear-gradient(135deg,#8B6F47,#6B5237)' } },
    { key: 'v17', label: 'Deco · 裝飾藝術',    group: '華麗', swatch: { bg: '#0A0A0A' } },
    { key: 'v18', label: 'Baroque · 巴洛克',   group: '華麗', swatch: { bg: 'radial-gradient(circle at 30% 30%,#4A1A1F,#220609)' } },
    { key: 'v19', label: 'Dunhuang · 敦煌',    group: '華麗', swatch: { bg: '#E8D7B5' } },
    { key: 'v20', label: 'Arcana · 塔羅',      group: '華麗', swatch: { bg: 'radial-gradient(circle at 50% 20%,#1A1640,#0E0B24)' } },
    { key: 'v21', label: '宋卷 · 山水',        group: '東方', swatch: { bg: 'linear-gradient(180deg,#DCCFA9,#E9DFC6)' } },
    { key: 'v25', label: '青花 · 瓷器',        group: '東方', swatch: { bg: '#F4EDDC' } },
    { key: 'v30', label: 'Gothic · 哥德',      group: '華麗', swatch: { bg: 'radial-gradient(ellipse,#1A1410,#0A0A0A)' } },
    { key: 'v31', label: 'Memphis · 80s',     group: '現代', swatch: { bg: '#FFF4E0' } },
    { key: 'v32', label: 'Wes · 對稱',         group: '現代', swatch: { bg: '#F7ECD8' } },
    { key: 'v33', label: 'Cyberpunk · 霓虹',   group: '現代', swatch: { bg: 'radial-gradient(ellipse at 20% 20%,#8E3DF033,#050218)' } },
    { key: 'v37', label: 'Editorial · 極黑',   group: '現代', swatch: { bg: '#000' } },
    { key: 'v38', label: '紙墨 · 純讀',        group: '經典', swatch: { bg: '#FDFBF7' } },
    { key: 'v39', label: '浮世繪 · 北齋',      group: '東方', swatch: { bg: '#F4ECD8' } },
    { key: 'v40', label: '水墨 · 沉硯',        group: '東方', swatch: { bg: '#F2EBDB' } },
    { key: 'v41', label: 'Riso · 印刷',         group: '現代', swatch: { bg: 'linear-gradient(135deg,#FF5F95,#2E5BFF)' } },
    { key: 'v42', label: 'Classics · 經典書系', group: '經典', swatch: { bg: 'linear-gradient(180deg,#FF6800 0 30%,#F5F0E0 30% 70%,#FF6800 70%)' } },
    { key: 'v43', label: '侘寂 · 殘缺',         group: '東方', swatch: { bg: '#D9D2C5' } },
    { key: 'v10', label: '直書 · 線裝古籍',     group: '東方', swatch: { bg: '#F3E8D0' } },
    { key: 'v16', label: 'Art Nouveau · 新藝術', group: '華麗', swatch: { bg: '#F0E9D6' } },
    { key: 'v22', label: '雕版 · 明清書版',      group: '東方', swatch: { bg: '#EDE0BE' } },
    { key: 'v23', label: 'Rinpa · 和風金屏',     group: '東方', swatch: { bg: 'linear-gradient(135deg,#E8CB68,#8C6E28)' } },
    { key: 'v24', label: '上海 · 1934 月份牌',   group: '華麗', swatch: { bg: 'radial-gradient(ellipse at top,#F4E6D0,#E8CFA8)' } },
    { key: 'v26', label: 'Illuminated · 抄本',   group: '華麗', swatch: { bg: 'radial-gradient(ellipse,#F0E2B8,#E4D29A)' } },
    { key: 'v27', label: 'First Folio · 對開本', group: '華麗', swatch: { bg: '#EDE0C4' } },
    { key: 'v28', label: 'Byzantine · 拜占庭',   group: '華麗', swatch: { bg: 'radial-gradient(circle,#E8CF7A 0,#8C6B1E 90%)' } },
    { key: 'v29', label: 'Ex Libris · 維多利亞', group: '華麗', swatch: { bg: 'linear-gradient(135deg,#1A3A2A,#0F2418)' } },
    { key: 'v44', label: '敦煌 · 殘卷',          group: '東方', swatch: { bg: 'radial-gradient(ellipse at 40% 40%,#E0C898,#9A7A48)' } },
    { key: 'v45', label: '蘇州 · 漏窗',          group: '東方', swatch: { bg: 'linear-gradient(180deg,#F4EEE0,#D6C9A8)' } },
    { key: 'v46', label: 'Leather & Gilt · 燙金皮革', group: '華麗', swatch: { bg: 'radial-gradient(ellipse at 30% 30%,#5A3020,#2A1308)' } },
    { key: 'v47', label: 'Marbled · 大理石扉頁',  group: '華麗', swatch: { bg: 'linear-gradient(135deg,#1A3B6B,#C9A84A)' } },
    { key: 'v48', label: 'Ivory · 象牙雕刻',      group: '華麗', swatch: { bg: 'radial-gradient(ellipse,#FAF4E4,#C7B58A)' } },
    { key: 'v49', label: 'Cloisonné · 景泰藍',    group: '華麗', swatch: { bg: 'radial-gradient(ellipse at 40% 30%,#0B3A5E,#05233D)' } },
    { key: 'v50', label: 'Swiss · 編輯部',         group: '現代', swatch: { bg: '#F4F2ED' } },
    { key: 'v51', label: 'Rams · Braun T1000',    group: '現代', swatch: { bg: '#E8E6E1' } },
    { key: 'v34', label: 'Frutiger Aero · Y2K',   group: '現代', swatch: { bg: 'linear-gradient(180deg,#B8E3FF,#7BD46B)' } },
    { key: 'v35', label: 'Vaporwave · 1991',       group: '現代', swatch: { bg: 'linear-gradient(180deg,#1B0B3C,#FFB5D9)' } },
    { key: 'v36', label: 'Solarpunk · 共生',       group: '現代', swatch: { bg: 'linear-gradient(180deg,#F7EBC4,#B8D08A)' } },
    { key: 'v2',  label: 'Polaroid · 拍立得',      group: '復古', swatch: { bg: '#F5E6C8' } },
    { key: 'v3',  label: '8-bit · 像素',           group: '復古', swatch: { bg: '#2D1B69' } },
    { key: 'v7',  label: 'Diner · 50s 餐廳',       group: '復古', swatch: { bg: 'repeating-conic-gradient(#E8443A 0% 25%, #FAF0DC 0% 50%) 50%/14px 14px' } },
    { key: 'v8',  label: 'Newsprint · 老報紙',     group: '復古', swatch: { bg: '#F2E8D0' } },
  ];
  const active = themes.find(t => t.key === settings.activeTheme) || themes[0];
  const groups = ['經典', '復古', '現代', '華麗', '東方'];

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)} title="切換風格" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, height: 28, padding: '0 10px 0 6px',
        background: 'transparent', border: '0.5px solid rgba(0,0,0,0.18)', borderRadius: 6,
        cursor: 'pointer', fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: 9, display: 'inline-block',
          background: active.swatch.bg,
          boxShadow: `inset 0 0 0 2px ${settings.themeColors[active.key].accent}`,
          flexShrink: 0,
        }}/>
        <span style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{active.label}</span>
        <span style={{ fontSize: 8, opacity: 0.6 }}>▾</span>
      </button>
      {open && <>
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 850 }}/>
        <div style={{
          position: 'absolute', right: 0, top: 34, width: 260, maxHeight: 420,
          overflow: 'auto', background: '#fff',
          border: '0.5px solid rgba(0,0,0,0.12)', borderRadius: 10,
          boxShadow: '0 10px 34px rgba(0,0,0,0.16)',
          padding: 6, zIndex: 851, fontFamily: 'var(--ui)',
        }} className="scroll-thin">
          {groups.map(g => {
            const items = themes.filter(t => t.group === g);
            if (!items.length) return null;
            return (
              <div key={g}>
                <div style={{ padding: '8px 10px 4px', fontSize: 9, letterSpacing: '0.2em', fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>
                  {g.toUpperCase()}
                </div>
                {items.map(t => {
                  const isActive = t.key === settings.activeTheme;
                  return (
                    <button key={t.key} onClick={() => { onChange(t.key); setOpen(false); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '6px 10px', border: 'none', borderRadius: 6,
                      background: isActive ? 'rgba(0,0,0,0.06)' : 'transparent',
                      cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
                      color: 'rgba(0,0,0,0.85)', textAlign: 'left',
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: 10, display: 'inline-block', flexShrink: 0,
                        background: t.swatch.bg,
                        boxShadow: `inset 0 0 0 2px ${settings.themeColors[t.key].accent}`,
                      }}/>
                      <span style={{ flex: 1 }}>{t.label}</span>
                      {isActive && <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>✓</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>}
    </div>
  );
}
window.ThemeSwitcher = ThemeSwitcher;
