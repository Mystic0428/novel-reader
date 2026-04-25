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
        { key: '#F1E4DC', label: '藕粉' },
        { key: '#E8E0CD', label: '麻色' },
        { key: '#D9CDB0', label: '老宣' },
        { key: '#E5E2DA', label: '雲灰' },
      ],
      toneKey: 'paperTone',
    },
    v4: {
      accentPresets: ['#AD4E3B', '#3D5AFE', '#5D4AAD', '#4A5D3A', '#B88A3A', '#2D5D55'],
      tonePresets: [
        { key: 'dawn',    label: '晨曦' },
        { key: 'dusk',    label: '薄暮' },
        { key: 'sky',     label: '青空' },
        { key: 'ink',     label: '墨染' },
        { key: 'sunset',  label: '黃昏' },
        { key: 'forest',  label: '森靄' },
        { key: 'ocean',   label: '海青' },
        { key: 'rose',    label: '玫瑰' },
      ],
      toneKey: 'gradient',
    },
    v5: {
      accentPresets: ['#C9A86B', '#D4C396', '#B8804A', '#9B6B3A', '#A4B8DC', '#8C3A2E'],
      tonePresets: [
        { key: 'mogreen',   label: '墨綠' },
        { key: 'xuanhei',   label: '玄黑' },
        { key: 'zhehe',     label: '赭褐' },
        { key: 'dianqing',  label: '靛青' },
        { key: 'ganguo',    label: '乾果' },
        { key: 'zaose',     label: '皂色' },
        { key: 'jinghuang', label: '景黃' },
        { key: 'moziju',    label: '紫晶' },
        { key: 'gulan',     label: '古藍' },
      ],
      toneKey: 'bgTone',
    },
    v17: {
      accentPresets: ['#D4AF37', '#F0D274', '#B8860B', '#CFB53B', '#A67C00', '#E5C76B'],
      tonePresets: [
        { key: 'onyx',     label: '瑪瑙' },
        { key: 'navy',     label: '午夜藍' },
        { key: 'wine',     label: '酒紅' },
        { key: 'forest',   label: '森綠' },
        { key: 'plum',     label: '紫李' },
        { key: 'oxblood',  label: '牛血紅' },
        { key: 'graphite', label: '石墨' },
        { key: 'cobalt',   label: '寶藍' },
        { key: 'teal',     label: '深青' },
      ],
      toneKey: 'bgTone',
    },
    v18: {
      accentPresets: ['#D6B371', '#E5C89B', '#B8935E', '#A87C3E', '#C9A36A', '#E8D5A0'],
      tonePresets: [
        { key: 'burgundy', label: '勃艮地' },
        { key: 'forest',   label: '森綠' },
        { key: 'royal',    label: '皇家藍' },
        { key: 'midnight', label: '午夜' },
        { key: 'emerald',  label: '祖母綠' },
        { key: 'amber',    label: '琥珀' },
        { key: 'charcoal', label: '炭金' },
        { key: 'oxblood',  label: '牛血' },
        { key: 'plum',     label: '紫李' },
      ],
      toneKey: 'bgTone',
    },
    v19: {
      accentPresets: ['#A43828', '#8C2A1C', '#C44A36', '#7A2418', '#B04A3A', '#933224'],
      tonePresets: [
        { key: 'masi',      label: '麻紙' },
        { key: 'miyellow',  label: '米黃' },
        { key: 'zhehuang',  label: '赭黃' },
        { key: 'qianjiang', label: '淺絳' },
        { key: 'bajiao',    label: '芭蕉' },
        { key: 'xuebai',    label: '雪白' },
        { key: 'shanhu',    label: '珊瑚' },
        { key: 'tuhuang',   label: '土黃' },
        { key: 'qingshi',   label: '青石' },
      ],
      toneKey: 'bgTone',
    },
    v20: {
      accentPresets: ['#E0C068', '#F5D56E', '#C9A85F', '#D4AF37', '#B89550', '#E8D08A'],
      tonePresets: [
        { key: 'cosmic',    label: '夢紫' },
        { key: 'sapphire',  label: '寶藍' },
        { key: 'emerald',   label: '深林' },
        { key: 'obsidian',  label: '黑曜' },
        { key: 'rubyabyss', label: '紅淵' },
        { key: 'aurora',    label: '極光' },
        { key: 'amethyst',  label: '紫晶' },
        { key: 'twilight',  label: '暮光' },
        { key: 'voidblack', label: '虛空' },
      ],
      toneKey: 'bgTone',
    },
    v6: {
      accentPresets: ['#6FE89B', '#FFB454', '#7FB6FF', '#39FF88', '#D4FB00', '#FF2D9E'],
      tonePresets: [
        { key: 'amber',   label: '琥珀' },
        { key: 'green',   label: '螢幕綠' },
        { key: 'blue',    label: 'IBM 藍' },
        { key: 'paper',   label: '紙本' },
        { key: 'red',     label: '警示紅' },
        { key: 'cyan',    label: '青藍機' },
        { key: 'magenta', label: '洋紅' },
        { key: 'mono',    label: '單色白' },
        { key: 'ivory',   label: '象牙紙' },
      ],
      toneKey: 'bgTone',
    },
    v9: {
      accentPresets: ['#D4FB00', '#FFEA00', '#FF2D9E', '#00F0FF', '#FF6B00', '#000000'],
      tonePresets: [
        { key: 'bone',    label: '素骨' },
        { key: 'cream',   label: '奶油' },
        { key: 'gray',    label: '灰階' },
        { key: 'black',   label: '純黑' },
        { key: 'navy',    label: '午夜藍' },
        { key: 'pink',    label: '粉色' },
        { key: 'olive',   label: '橄欖' },
        { key: 'rust',    label: '鏽紅' },
        { key: 'mustard', label: '芥末' },
      ],
      toneKey: 'bgTone',
    },
    v11: {
      accentPresets: ['#C04A2E', '#B04A3A', '#8B6F47', '#5A2818', '#2C2218', '#D4A674'],
      tonePresets: [
        { key: 'walnut',   label: '胡桃木' },
        { key: 'oak',      label: '橡木' },
        { key: 'mahogany', label: '紅木' },
        { key: 'ebony',    label: '烏木' },
        { key: 'cherry',   label: '櫻桃木' },
        { key: 'maple',    label: '楓木' },
        { key: 'rosewood', label: '玫瑰木' },
        { key: 'birch',    label: '樺木' },
        { key: 'teak',     label: '柚木' },
      ],
      toneKey: 'bgTone',
    },
    v21: {
      accentPresets: ['#A43828', '#8B3A2A', '#6B5237', '#5A6B65', '#2D4A3E', '#7A3B6B'],
      tonePresets: [
        { key: 'silk',    label: '絹本' },
        { key: 'rice',    label: '米紙' },
        { key: 'hemp',    label: '麻紙' },
        { key: 'moss',    label: '苔綠' },
        { key: 'cloud',   label: '雲紋' },
        { key: 'tea',     label: '茶色' },
        { key: 'bamboo',  label: '竹簡' },
        { key: 'antique', label: '古絹' },
        { key: 'ash',     label: '灰宣' },
      ],
      toneKey: 'bgTone',
    },
    v25: {
      accentPresets: ['#1E3A6B', '#0F2348', '#3858A0', '#1A4D5A', '#4A3F85', '#7A3B4E'],
      tonePresets: [
        { key: 'classic', label: '正白' },
        { key: 'snow',    label: '雪釉' },
        { key: 'celadon', label: '青瓷' },
        { key: 'dove',    label: '鴿灰' },
        { key: 'willow',  label: '柳色' },
        { key: 'shell',   label: '貝殼' },
        { key: 'mist',    label: '霧白' },
        { key: 'pearl',   label: '珍珠' },
        { key: 'rice',    label: '米釉' },
      ],
      toneKey: 'bgTone',
    },
    v30: {
      accentPresets: ['#E8432A', '#F58B3A', '#C9261A', '#8E1F10', '#B84A6D', '#6B0F0F'],
      tonePresets: [
        { key: 'ash',      label: '灰燼' },
        { key: 'crypt',    label: '墓穴' },
        { key: 'blood',    label: '血石' },
        { key: 'moss',     label: '苔墓' },
        { key: 'oxide',    label: '氧化' },
        { key: 'midnight', label: '午夜' },
        { key: 'tomb',     label: '墓碑' },
        { key: 'soot',     label: '煤煙' },
        { key: 'iron',     label: '生鐵' },
      ],
      toneKey: 'bgTone',
    },
    v31: {
      accentPresets: ['#FF4E9E', '#FFD21E', '#2EC5E5', '#6EE05A', '#8B4FE8', '#FF6B00'],
      tonePresets: [
        { key: 'cream',  label: '奶白' },
        { key: 'mint',   label: '薄荷' },
        { key: 'peach',  label: '蜜桃' },
        { key: 'sky',    label: '天空' },
        { key: 'lilac',  label: '薰衣草' },
        { key: 'ink',    label: '午夜' },
        { key: 'coral',  label: '珊瑚' },
        { key: 'lemon',  label: '檸檬' },
        { key: 'aqua',   label: '水藍' },
      ],
      toneKey: 'bgTone',
    },
    v32: {
      accentPresets: ['#D87962', '#C7586E', '#5E9C7B', '#2E5A5E', '#D4A02E', '#8B4FE8'],
      tonePresets: [
        { key: 'cream',  label: '奶油' },
        { key: 'peach',  label: '蜜桃' },
        { key: 'mint',   label: '薄荷' },
        { key: 'butter', label: '奶黃' },
        { key: 'blush',  label: '胭脂' },
        { key: 'sage',   label: '鼠尾草' },
        { key: 'rose',   label: '玫瑰' },
        { key: 'sky',    label: '天空' },
        { key: 'taupe',  label: '灰褐' },
      ],
      toneKey: 'bgTone',
    },
    v33: {
      accentPresets: ['#FF2D9E', '#00F0FF', '#8E3DF0', '#FFE838', '#39FF88', '#FF6B00'],
      tonePresets: [
        { key: 'violet',   label: '紫夢' },
        { key: 'midnight', label: '午夜' },
        { key: 'emerald',  label: '綠駭' },
        { key: 'blood',    label: '血脈' },
        { key: 'azure',    label: '深藍' },
        { key: 'smoke',    label: '煙灰' },
        { key: 'neon',     label: '霓黑' },
        { key: 'plasma',   label: '電漿' },
        { key: 'darkrose', label: '玫黑' },
      ],
      toneKey: 'bgTone',
    },
    v37: {
      accentPresets: ['#FFFFFF', '#FF2D9E', '#D4FB00', '#FFE838', '#00F0FF', '#E8432A'],
      tonePresets: [
        { key: 'black',    label: '純黑' },
        { key: 'white',    label: '象牙' },
        { key: 'bone',     label: '骨白' },
        { key: 'rust',     label: '鐵鏽' },
        { key: 'navy',     label: '深海' },
        { key: 'olive',    label: '橄欖' },
        { key: 'forest',   label: '森綠' },
        { key: 'plum',     label: '梅黑' },
        { key: 'concrete', label: '水泥' },
      ],
      toneKey: 'bgTone',
    },
    v38: {
      accentPresets: ['#1A1A1A', '#3D2818', '#2C2C2C', '#5A4A2A', '#4A5D3A', '#8C3A2E'],
      tonePresets: [
        { key: 'bone',     label: '骨白' },
        { key: 'cream',    label: '奶油' },
        { key: 'linen',    label: '亞麻' },
        { key: 'mist',     label: '薄霧' },
        { key: 'ash',      label: '灰燼' },
        { key: 'sepia',    label: '泛黃' },
        { key: 'dusk',     label: '暮光' },
        { key: 'night',    label: '夜墨' },
        { key: 'graphite', label: '石墨' },
      ],
      toneKey: 'bgTone',
    },
    v39: {
      accentPresets: ['#1B3A8C', '#0F2459', '#2C5BB4', '#4A6B96', '#6B3838', '#3E5A38'],
      tonePresets: [
        { key: 'paper',    label: '生成' },
        { key: 'rice',     label: '米色' },
        { key: 'moss',     label: '抹茶' },
        { key: 'sky',      label: '藍染' },
        { key: 'fuji',     label: '富士' },
        { key: 'peach',    label: '桃色' },
        { key: 'pine',     label: '松綠' },
        { key: 'sand',     label: '砂色' },
        { key: 'storm',    label: '雷雲' },
      ],
      toneKey: 'bgTone',
    },
    v40: {
      accentPresets: ['#B22222', '#8B1A1A', '#C44A36', '#7A2418', '#A4391A', '#933224'],
      tonePresets: [
        { key: 'rice',     label: '宣紙' },
        { key: 'cloud',    label: '雲紋' },
        { key: 'ash',      label: '灰宣' },
        { key: 'bamboo',   label: '竹綠' },
        { key: 'ivory',    label: '象牙' },
        { key: 'mist',     label: '薄霧' },
        { key: 'dawn',     label: '晨光' },
        { key: 'dusk',     label: '暮色' },
        { key: 'moon',     label: '月白' },
      ],
      toneKey: 'bgTone',
    },
  };
  const presets = presetsByTheme[theme];
  const hasTones = presets && presets.tonePresets;

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

        {hasTones && <>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {theme === 'v1' ? '紙張底色'
             : theme === 'v4' ? '漸層壁紙'
             : theme === 'v19' ? '紙張底色'
             : '背景色'}
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
        </>}
      </div>
    </>
  );
}
window.ColorPicker = ColorPicker;
