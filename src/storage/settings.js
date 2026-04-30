// src/storage/settings.js — settings with defaults
(function () {
  const DEFAULTS = {
    id: 'global',
    activeTheme: 'v1',
    themeColors: {
      v1:  { accent: '#7A2A2A', paperTone: '#EDE4D2' },
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
      v38: { accent: '#1A1A1A', bg: '#FAF8F3', bgTone: 'bone' },
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
      v2:  { accent: '#4A7B7C', bgTone: 'cream' },
      v3:  { accent: '#FF004D', bgTone: 'nes' },
      v7:  { accent: '#1AB5C2', bgTone: 'cream' },
      v8:  { accent: '#B82820', bgTone: 'newsprint' },
      v12: { accent: '#E8783A', bgTone: 'walnut' },
      v13: { accent: '#B82820', bgTone: 'paper' },
      v14: { accent: '#E83A1F', bgTone: 'yellowed' },
      v15: { accent: '#D4A848', bgTone: 'midnight' },
      v52: { accent: '#5E72E4', bgTone: 'pearl' },
      v53: { accent: '#FF6B9D', bgTone: 'peach' },
      v54: { accent: '#7C3AED', bgTone: 'aurora' },
      v55: { accent: '#7C3AED', bgTone: 'cosmos' },
      v56: { accent: '#C9A368', bgTone: 'walnut' },
      v57: { accent: '#D4AF5C', bgTone: 'forest' },
      v58: { accent: '#C8404A', bgTone: 'black' },
      v59: { accent: '#C8242C', bgTone: 'paper' },
      v60: { accent: '#D4AF37', bgTone: 'ember' },
      v61: { accent: '#C44A36', bgTone: 'crimson' },
      v62: { accent: '#D4C896', bgTone: 'granite' },
      v63: { accent: '#D4AF7C', bgTone: 'mosswood' },
      v64: { accent: '#B8956A', bgTone: 'mourning' },
      v65: { accent: '#B82820', bgTone: 'manila' },
      v66: { accent: '#FFB454', bgTone: 'candlelight' },
      v67: { accent: '#8B1A1A', bgTone: 'vellum' },
      v68: { accent: '#5E9CFF', bgTone: 'finalfantasy' },
      v69: { accent: '#FF98AC', bgTone: 'sakura' },
      v70: { accent: '#C44A2A', bgTone: 'catan' },
      v71: { accent: '#66C0F4', bgTone: 'steam' },
      v72: { accent: '#D4A848', bgTone: 'pine' },
      v73: { accent: '#3C7888', bgTone: 'seafoam' },
      v74: { accent: '#5A7838', bgTone: 'specimen' },
      v75: { accent: '#FF6838', bgTone: 'ember' },
      v76: { accent: '#1A1228', bgTone: 'federal' },
      v77: { accent: '#8B1A1A', bgTone: 'legal' },
      v78: { accent: '#3858A8', bgTone: 'legal' },
      v79: { accent: '#B82820', bgTone: 'card' },
      v80: { accent: '#A82820', bgTone: 'intertitle' },
      v81: { accent: '#4FC97A', bgTone: 'letterboxd' },
      v82: { accent: '#FFD24A', bgTone: 'shaw' },
      v83: { accent: '#D4A848', bgTone: 'nitrate' },
      v84: { accent: '#E8748C', bgTone: 'watercolor' },
      v85: { accent: '#FF4848', bgTone: 'primary' },
      v86: { accent: '#D8141E', bgTone: 'studs' },
      v87: { accent: '#C8683A', bgTone: 'cardboard' },
      v88: { accent: '#FF9038', bgTone: 'saffron' },
      v89: { accent: '#3858E8', bgTone: 'cathedral' },
      v90: { accent: '#C8A848', bgTone: 'ink' },
      v91: { accent: '#FFC848', bgTone: 'nightsky' },
      v92: { accent: '#C84A28', bgTone: 'pages' },
      v93: { accent: '#A82820', bgTone: 'linen' },
      v94: { accent: '#A82820', bgTone: 'patchwork' },
      v95: { accent: '#C8242C', bgTone: 'snow' },
      v96: { bg: '#EAE3D2', accent: '#5A4838', bgTone: 'linen' },
      v97: { bg: '#F0E8D0', accent: '#B82820', bgTone: 'morningprint' },
      v98: { bg: 'teastain', accent: '#5A2A18', bgTone: 'teastain' },
      v99:  { accent: '#C9A961', bgTone: 'obsidian' },
      v100: { accent: '#8AB4D8', bgTone: 'moonstone' },
      v101: { accent: '#5C2818', bgTone: 'bamboo' },
      v102: { accent: '#3A2818', bgTone: 'xuan' },
      v103: { accent: '#C03020', bgTone: 'vermilion' },
      v104: { accent: '#D58FA8', bgTone: 'sakura' },
      v105: { accent: '#7AAA8C', bgTone: 'mint' },
      v106: { accent: '#B89BD0', bgTone: 'twilight' },
      v107: { accent: '#D4A848', bgTone: 'hogwarts' },
      v108: { accent: '#A8281F', bgTone: 'wall' },
      v111: { accent: '#00F0FF', bgTone: 'nightcity' },
      v112: { accent: '#5AC8FF', bgTone: 'cryo' },
      v113: { accent: '#4A6B8E', bgTone: 'coldpress' },
      v114: { accent: '#5A1F0F', bgTone: 'manila' },
      v115: { accent: '#4A6B8E', bgTone: 'grid' },
      v116: { accent: '#C8242C', bgTone: 'pine' },
      v117: { accent: '#FF7728', bgTone: 'witchnight' },
      v118: { accent: '#FFD848', bgTone: 'cny' },
      v119: { accent: '#D88F58', bgTone: 'cream' },
      v120: { accent: '#5AA89A', bgTone: 'abyssgreen' },
      v121: { accent: '#8C2A4A', bgTone: 'cathedral' },
    },
    tweaks: {
      fontSize: 17, lineHeight: 1.9, font: 'sans', texture: true,
      paragraphIndent: 0, paragraphSpacing: 0.6, fontWeight: 400, immersive: true,
    },
    preserveOriginalCssDefault: false,
    sortBy: 'lastRead',
    sortOrder: 'desc',
    filterTag: null,
    filterCollection: null,
    favoriteThemes: [],
    manageSortBy: 'lastRead',
    manageSortOrder: 'desc',
    manageFilter: null,
    manageGridSize: 'md',
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
