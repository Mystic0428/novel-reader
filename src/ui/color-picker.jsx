// src/ui/color-picker.jsx — per-theme accent + preset picker
function ColorPicker({ settings, onChange, open, onClose }) {
  if (!open) return null;
  const theme = settings.activeTheme;
  const themeColors = settings.themeColors[theme];

  const presetsByTheme = {
    v1: {
      accentPresets: ['#8C3A2E', '#B34740', '#5A4A2A', '#4A5D3A', '#2D2D2D', '#6B4A5D'],
      tonePresets: [
        { key: '#EDE4D2', label: '羊皮紙' },
        { key: '#F5F1E8', label: '月白' },
        { key: '#E8DFCC', label: '棉紙' },
        { key: '#E0D4B8', label: '古書' },
        { key: '#F0EBDC', label: '霜白' },
        { key: '#E5DBB9', label: '竹黃' },
      ],
      toneKey: 'paperTone',
    },
    v4: {
      accentPresets: ['#AD4E3B', '#3D5AFE', '#5D4AAD', '#4A5D3A', '#B88A3A', '#2D5D55'],
      tonePresets: [
        { key: 'dawn', label: '晨曦' },
        { key: 'dusk', label: '薄暮' },
        { key: 'sky', label: '青空' },
        { key: 'ink', label: '墨染' },
      ],
      toneKey: 'gradient',
    },
    v5: {
      accentPresets: ['#C9A86B', '#D4C396', '#B8804A', '#9B6B3A', '#A4B8DC', '#8C3A2E'],
      tonePresets: [
        { key: 'mogreen', label: '墨綠' },
        { key: 'xuanhei', label: '玄黑' },
        { key: 'zhehe',   label: '赭褐' },
      ],
      toneKey: 'bgTone',
    },
  };
  const presets = presetsByTheme[theme];

  function setAccent(hex) { onChange({ themeColors: { [theme]: { accent: hex } } }); }
  function setTone(key) { onChange({ themeColors: { [theme]: { [presets.toneKey]: key } } }); }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 800 }}/>
      <div style={{
        position: 'fixed', right: 16, top: 60, width: 280, zIndex: 801,
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
        borderRadius: 12, boxShadow: '0 10px 34px rgba(0,0,0,0.15)',
        padding: 18, fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>主題色</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {presets.accentPresets.map((hex) => (
            <button key={hex} onClick={() => setAccent(hex)} style={{
              width: 28, height: 28, borderRadius: 14, background: hex,
              border: themeColors.accent === hex ? '2px solid #000' : '0.5px solid rgba(0,0,0,0.1)',
              cursor: 'pointer',
            }} title={hex}/>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <input type="color" value={themeColors.accent} onChange={(e) => setAccent(e.target.value)}
            style={{ width: 40, height: 28, border: 'none', padding: 0, background: 'transparent' }}/>
          <input type="text" value={themeColors.accent} onChange={(e) => setAccent(e.target.value)}
            style={{ flex: 1, padding: '4px 8px', fontFamily: 'var(--mono)', fontSize: 11,
              border: '0.5px solid rgba(0,0,0,0.15)', borderRadius: 4 }}/>
        </div>

        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {theme === 'v1' ? '紙張底色' : theme === 'v4' ? '漸層壁紙' : '深色底'}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {presets.tonePresets.map((p) => {
            const active = themeColors[presets.toneKey] === p.key;
            return (
              <button key={p.key} onClick={() => setTone(p.key)} style={{
                padding: '6px 10px', borderRadius: 6, fontSize: 11,
                background: active ? 'rgba(0,0,0,0.08)' : '#fff',
                border: '0.5px solid rgba(0,0,0,0.1)',
                cursor: 'pointer', fontFamily: 'inherit',
              }}>{p.label}</button>
            );
          })}
        </div>
      </div>
    </>
  );
}
window.ColorPicker = ColorPicker;
