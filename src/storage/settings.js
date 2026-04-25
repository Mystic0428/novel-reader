// src/storage/settings.js — settings with defaults
(function () {
  const DEFAULTS = {
    id: 'global',
    activeTheme: 'v1',
    themeColors: {
      v1:  { accent: '#8C3A2E', paperTone: '#EDE4D2' },
      v4:  { accent: '#AD4E3B', gradient: 'dawn' },
      v5:  { accent: '#C9A86B', bgTone: 'mogreen' },
      v6:  { accent: '#6FE89B', bgTone: 'amber' },
      v9:  { accent: '#D4FB00', bgTone: 'bone' },
      v11: { accent: '#C04A2E', bgTone: 'walnut' },
      v17: { accent: '#D4AF37', bgTone: 'onyx' },
      v18: { accent: '#D6B371', bgTone: 'burgundy' },
      v19: { accent: '#A43828', bgTone: 'masi' },
      v20: { accent: '#E0C068', bgTone: 'cosmic' },
      v21: { accent: '#A43828', bgTone: 'silk' },
      v25: { accent: '#1E3A6B', bgTone: 'classic' },
      v30: { accent: '#E8432A', bgTone: 'ash' },
      v31: { accent: '#FF4E9E', bgTone: 'cream' },
      v32: { accent: '#D87962', bgTone: 'cream' },
      v33: { accent: '#FF2D9E', bgTone: 'violet' },
      v37: { accent: '#FFFFFF', bgTone: 'black' },
      v38: { accent: '#1A1A1A', bgTone: 'bone' },
      v39: { accent: '#1B3A8C', bgTone: 'paper' },
      v40: { accent: '#B22222', bgTone: 'rice' },
      v41: { accent: '#FF5F95', bgTone: 'oat' },
      v42: { accent: '#FF6800', bgTone: 'orange' },
      v43: { accent: '#B8956A', bgTone: 'linen' },
      v10: { accent: '#8A2A1F', bgTone: 'vermillion' },
      v16: { accent: '#B08A3A', bgTone: 'parchment' },
      v22: { accent: '#1A140C', bgTone: 'ricepaper' },
      v23: { accent: '#B4352A', bgTone: 'gold' },
      v24: { accent: '#C23A2A', bgTone: 'cream' },
      v26: { accent: '#8B1A1A', bgTone: 'vellum' },
      v27: { accent: '#1A1008', bgTone: 'paper' },
      v28: { accent: '#C9A84A', bgTone: 'gold' },
      v29: { accent: '#C9A368', bgTone: 'forest' },
      v44: { accent: '#C89A3E', bgTone: 'sand' },
      v45: { accent: '#A8325E', bgTone: 'wall' },
      v46: { accent: '#D4AF5C', bgTone: 'walnut' },
      v47: { accent: '#C9A84A', bgTone: 'peacock' },
      v48: { accent: '#7A5E34', bgTone: 'cream' },
      v49: { accent: '#D4A843', bgTone: 'cobalt' },
      v50: { accent: '#E53935', bgTone: 'bone' },
      v51: { accent: '#E85B1E', bgTone: 'cream' },
      v34: { accent: '#6EB5F4', bgTone: 'sky' },
      v35: { accent: '#FF2D9E', bgTone: 'sunset' },
      v36: { accent: '#C87456', bgTone: 'cream' },
    },
    tweaks: { fontSize: 17, lineHeight: 1.9, font: 'sans', texture: true },
    preserveOriginalCssDefault: false,
    sortBy: 'lastRead',
    sortOrder: 'desc',
    filterTag: null,
    filterCollection: null,
  };

  function mergeDeep(base, patch) {
    if (!patch || typeof patch !== 'object') return base;
    const out = { ...base };
    for (const k of Object.keys(patch)) {
      if (patch[k] && typeof patch[k] === 'object' && !Array.isArray(patch[k]) && base[k] && typeof base[k] === 'object') {
        out[k] = mergeDeep(base[k], patch[k]);
      } else {
        out[k] = patch[k];
      }
    }
    return out;
  }

  async function load() {
    const stored = await idb.get('settings', 'global');
    return mergeDeep(DEFAULTS, stored || {});
  }

  async function save(patch) {
    const current = await load();
    const merged = mergeDeep(current, patch);
    merged.id = 'global';
    await idb.put('settings', merged);
    return merged;
  }

  window.settingsStore = { load, save, DEFAULTS };
})();
