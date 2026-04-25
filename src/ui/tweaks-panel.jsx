// src/ui/tweaks-panel.jsx — font/line/texture + per-book CSS toggle
function TweaksPanel({ book, settings, onSettingsChange, onBookChange, open, onClose }) {
  if (!open) return null;
  const tw = settings.tweaks;

  function set(patch) { onSettingsChange({ tweaks: patch }); }

  const styleLabel = { fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' };
  const slider = (min, max, step, val, on) => (
    <input type="range" min={min} max={max} step={step} value={val}
      onChange={(e) => on(Number(e.target.value))}
      style={{ flex: 1 }}/>
  );

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'transparent', zIndex: 800 }}/>
      <div style={{
        position: 'fixed', right: 16, top: 60, width: 300, zIndex: 801,
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.12)',
        borderRadius: 12, boxShadow: '0 10px 34px rgba(0,0,0,0.15)',
        padding: 18, fontFamily: 'var(--ui)', fontSize: 12,
      }}>
        <div style={styleLabel}>排版</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 36, fontSize: 11 }}>字級</span>
          {slider(10, 32, 1, tw.fontSize, (v) => set({ ...tw, fontSize: v }))}
          <span style={{ width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tw.fontSize}px</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ width: 36, fontSize: 11 }}>行距</span>
          {slider(0.6, 2.4, 0.05, tw.lineHeight, (v) => set({ ...tw, lineHeight: Number(v.toFixed(2)) }))}
          <span style={{ width: 36, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{tw.lineHeight.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ width: 36, fontSize: 11 }}>字體</span>
          <button onClick={() => set({ ...tw, font: 'sans' })} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11, background: tw.font === 'sans' ? 'rgba(0,0,0,0.08)' : '#fff' }}>黑體</button>
          <button onClick={() => set({ ...tw, font: 'serif' })} style={{ ...btnStyle(), padding: '4px 10px', fontSize: 11, background: tw.font === 'serif' ? 'rgba(0,0,0,0.08)' : '#fff' }}>宋體</button>
        </div>

        <div style={styleLabel}>質感</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <input type="checkbox" checked={!!tw.texture} onChange={(e) => set({ ...tw, texture: e.target.checked })}/>
          <span>紙張紋理（僅紙質風格主題顯示）</span>
        </label>

        <div style={{ height: 0.5, background: 'rgba(0,0,0,0.08)', margin: '14px -18px' }}/>

        <div style={styleLabel}>這本書</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" checked={!!book.preserveOriginalCss}
            onChange={(e) => onBookChange({ preserveOriginalCss: e.target.checked })}/>
          <span>保留原始 EPUB 排版</span>
        </label>
      </div>
    </>
  );
}
window.TweaksPanel = TweaksPanel;
