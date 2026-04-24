// src/storage/settings.js — settings with defaults
(function () {
  const DEFAULTS = {
    id: 'global',
    activeTheme: 'v1',
    themeColors: {
      v1: { accent: '#8C3A2E', paperTone: '#EDE4D2' },
      v4: { accent: '#AD4E3B', gradient: 'dawn' },
      v5: { accent: '#C9A86B', bgTone: 'mogreen' },
    },
    tweaks: { fontSize: 17, lineHeight: 1.9, font: 'sans', texture: true },
    preserveOriginalCssDefault: false,
    sortBy: 'lastRead',
    sortOrder: 'desc',
    filterTag: null,
    filterCollection: null,
    filterStatus: 'all',
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
