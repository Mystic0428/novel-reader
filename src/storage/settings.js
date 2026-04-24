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
