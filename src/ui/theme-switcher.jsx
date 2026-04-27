// src/ui/theme-switcher.jsx — refined dropdown theme picker (scales to many themes)
function ThemeSwitcher({ settings, onChange, onSettingsChange, onPreview }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [hoveredKey, setHoveredKey] = React.useState(null);
  const activeRef = React.useRef(null);
  const scrollContainerRef = React.useRef(null);
  const previewTimerRef = React.useRef(null);
  const scrollingUntilRef = React.useRef(0);

  // Schedule a hover preview after 300ms; cancel on mouseleave / select / close.
  // The preview never persists to settings — only the live reader re-renders.
  // Suppress while the dropdown is actively scrolling: wheel/scroll fires
  // mouseenter on rows that pass under a stationary cursor, which would
  // otherwise trigger an unwanted preview.
  function schedulePreview(key) {
    clearTimeout(previewTimerRef.current);
    if (Date.now() < scrollingUntilRef.current) return;
    previewTimerRef.current = setTimeout(() => onPreview && onPreview(key), 300);
  }
  function cancelPreview() {
    clearTimeout(previewTimerRef.current);
    if (onPreview) onPreview(null);
  }
  function handleScroll() {
    scrollingUntilRef.current = Date.now() + 200;
    clearTimeout(previewTimerRef.current);
  }
  React.useEffect(() => {
    if (!open) cancelPreview();
    return () => clearTimeout(previewTimerRef.current);
    // eslint-disable-next-line
  }, [open]);

  // Center the active theme in the dropdown's own scroll container — never the page.
  React.useLayoutEffect(() => {
    if (open && activeRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      const targetTop = (itemRect.top - containerRect.top) + container.scrollTop
        - (container.clientHeight / 2) + (item.offsetHeight / 2);
      container.scrollTop = Math.max(0, targetTop);
    }
  }, [open]);

  const themes = [
    { key: 'v1',  label: 'Warm · 書房',       group: '經典', font: 'serif', sample: '夢幻識通靈　風塵懷閨秀', swatch: { bg: '#EDE4D2' } },
    { key: 'v4',  label: 'Glass · 毛玻璃',    group: '經典', font: 'sans',  sample: '輕霧浮光　穿透書頁',   swatch: { bg: 'linear-gradient(135deg,#F5DEB3,#C9A5D4)' } },
    { key: 'v5',  label: 'Dark · 典藏',       group: '經典', font: 'serif', sample: '夜深人靜　獨對殘卷',   swatch: { bg: '#13201C' } },
    { key: 'v6',  label: 'Terminal · 終端機',  group: '復古', font: 'mono',  sample: '> awaiting input...',  swatch: { bg: '#0C0A06' } },
    { key: 'v9',  label: 'Brutalist · 野獸派', group: '現代', font: 'sans',  sample: '混凝土的詩意稜角',     swatch: { bg: '#EEEBE4' } },
    { key: 'v11', label: 'Apple Books · 書櫃', group: '經典', font: 'serif', sample: '木紋書櫃　光影流轉',   swatch: { bg: 'linear-gradient(135deg,#8B6F47,#6B5237)' } },
    { key: 'v17', label: 'Deco · 裝飾藝術',    group: '華麗', font: 'serif', sample: '黃金時代　幾何華章',   swatch: { bg: '#0A0A0A' } },
    { key: 'v18', label: 'Baroque · 巴洛克',   group: '華麗', font: 'serif', sample: '繁複織錦　紅絲絨幕',   swatch: { bg: 'radial-gradient(circle at 30% 30%,#4A1A1F,#220609)' } },
    { key: 'v19', label: 'Dunhuang · 敦煌',    group: '華麗', font: 'serif', sample: '經卷殘片　佛影斑駁',   swatch: { bg: '#E8D7B5' } },
    { key: 'v20', label: 'Arcana · 塔羅',      group: '華麗', font: 'serif', sample: '星辰陳列　命運擲骰',   swatch: { bg: 'radial-gradient(circle at 50% 20%,#1A1640,#0E0B24)' } },
    { key: 'v21', label: '宋卷 · 山水',        group: '東方', font: 'serif', sample: '遠岫含煙　近水分波',   swatch: { bg: 'linear-gradient(180deg,#DCCFA9,#E9DFC6)' } },
    { key: 'v25', label: '青花 · 瓷器',        group: '東方', font: 'serif', sample: '釉下青花　纖細勾勒',   swatch: { bg: '#F4EDDC' } },
    { key: 'v30', label: 'Gothic · 哥德',      group: '華麗', font: 'serif', sample: '尖塔影下　幽暗誓言',   swatch: { bg: 'radial-gradient(ellipse,#1A1410,#0A0A0A)' } },
    { key: 'v31', label: 'Memphis · 80s',     group: '現代', font: 'sans',  sample: '霓虹幾何　不羈拼貼',   swatch: { bg: '#FFF4E0' } },
    { key: 'v32', label: 'Wes · 對稱',         group: '現代', font: 'serif', sample: '糖果色調　對稱構圖',   swatch: { bg: '#F7ECD8' } },
    { key: 'v33', label: 'Cyberpunk · 霓虹',   group: '現代', font: 'mono',  sample: '霓虹滴雨　義體之夜',   swatch: { bg: 'radial-gradient(ellipse at 20% 20%,#8E3DF033,#050218)' } },
    { key: 'v37', label: 'Editorial · 極黑',   group: '現代', font: 'sans',  sample: 'TYPE AS ARCHITECTURE', swatch: { bg: '#000' } },
    { key: 'v38', label: '紙墨 · 純讀',        group: '經典', font: 'serif', sample: '純白紙頁　墨色字行',   swatch: { bg: '#FAF8F3' } },
    { key: 'v39', label: '浮世繪 · 北齋',      group: '東方', font: 'serif', sample: '富士奇景　藍染浮世',   swatch: { bg: '#F4ECD8' } },
    { key: 'v40', label: '水墨 · 沉硯',        group: '東方', font: 'serif', sample: '硯台沉墨　行雲流水',   swatch: { bg: '#F2EBDB' } },
    { key: 'v41', label: 'Riso · 印刷',         group: '現代', font: 'sans',  sample: '雙色油墨　錯位印製', swatch: { bg: 'linear-gradient(135deg,#FF5F95,#2E5BFF)' } },
    { key: 'v42', label: 'Classics · 經典書系', group: '經典', font: 'serif', sample: '橘黃書脊　懷舊書系', swatch: { bg: 'linear-gradient(180deg,#FF6800 0 30%,#F5F0E0 30% 70%,#FF6800 70%)' } },
    { key: 'v43', label: '侘寂 · 殘缺',         group: '東方', font: 'serif', sample: '不完美中見天真',     swatch: { bg: '#D9D2C5' } },
    { key: 'v10', label: '直書 · 線裝古籍',     group: '東方', font: 'serif', sample: '線裝古籍　直書豎排', swatch: { bg: '#F3E8D0' } },
    { key: 'v16', label: 'Art Nouveau · 新藝術', group: '華麗', font: 'serif', sample: '蔓藤紋飾　花葉曲線', swatch: { bg: '#F0E9D6' } },
    { key: 'v22', label: '雕版 · 明清書版',      group: '東方', font: 'serif', sample: '木刻雕版　明清書頁', swatch: { bg: '#EDE0BE' } },
    { key: 'v23', label: 'Rinpa · 和風金屏',     group: '東方', font: 'serif', sample: '金箔屏風　琳派艷彩', swatch: { bg: 'linear-gradient(135deg,#E8CB68,#8C6E28)' } },
    { key: 'v24', label: '上海 · 1934 月份牌',   group: '華麗', font: 'serif', sample: '月份牌畫　上海舊夢', swatch: { bg: 'radial-gradient(ellipse at top,#F4E6D0,#E8CFA8)' } },
    { key: 'v26', label: 'Illuminated · 抄本',   group: '華麗', font: 'serif', sample: '中世紀抄本　彩繪首字', swatch: { bg: 'radial-gradient(ellipse,#F0E2B8,#E4D29A)' } },
    { key: 'v27', label: 'First Folio · 對開本', group: '華麗', font: 'serif', sample: '莎翁初版　手刻活字', swatch: { bg: '#EDE0C4' } },
    { key: 'v28', label: 'Byzantine · 拜占庭',   group: '華麗', font: 'serif', sample: '金底鑲嵌　聖像光暈', swatch: { bg: 'radial-gradient(circle,#E8CF7A 0,#8C6B1E 90%)' } },
    { key: 'v29', label: 'Ex Libris · 維多利亞', group: '華麗', font: 'serif', sample: '藏書票印　維多利亞', swatch: { bg: 'linear-gradient(135deg,#1A3A2A,#0F2418)' } },
    { key: 'v44', label: '敦煌 · 殘卷',          group: '東方', font: 'serif', sample: '殘卷風蝕　千年沙塵', swatch: { bg: 'radial-gradient(ellipse at 40% 40%,#E0C898,#9A7A48)' } },
    { key: 'v45', label: '蘇州 · 漏窗',          group: '東方', font: 'serif', sample: '蘇州園林　漏窗剪影', swatch: { bg: 'linear-gradient(180deg,#F4EEE0,#D6C9A8)' } },
    { key: 'v46', label: 'Leather & Gilt · 燙金皮革', group: '華麗', font: 'serif', sample: '皮革燙金　書脊華采', swatch: { bg: 'radial-gradient(ellipse at 30% 30%,#5A3020,#2A1308)' } },
    { key: 'v47', label: 'Marbled · 大理石扉頁',  group: '華麗', font: 'serif', sample: '大理石紋　扉頁渦旋', swatch: { bg: 'linear-gradient(135deg,#1A3B6B,#C9A84A)' } },
    { key: 'v48', label: 'Ivory · 象牙雕刻',      group: '華麗', font: 'serif', sample: '象牙細雕　風雅小品', swatch: { bg: 'radial-gradient(ellipse,#FAF4E4,#C7B58A)' } },
    { key: 'v49', label: 'Cloisonné · 景泰藍',    group: '華麗', font: 'serif', sample: '景泰藍釉　琺瑯絲線', swatch: { bg: 'radial-gradient(ellipse at 40% 30%,#0B3A5E,#05233D)' } },
    { key: 'v50', label: 'Swiss · 編輯部',         group: '現代', font: 'sans',  sample: '瑞士排版　網格至上', swatch: { bg: '#F4F2ED' } },
    { key: 'v51', label: 'Rams · Braun T1000',    group: '現代', font: 'sans',  sample: '少即是多　Rams 十誡', swatch: { bg: '#E8E6E1' } },
    { key: 'v34', label: 'Frutiger Aero · Y2K',   group: '現代', font: 'sans',  sample: '千禧光感　水滴泡泡', swatch: { bg: 'linear-gradient(180deg,#B8E3FF,#7BD46B)' } },
    { key: 'v35', label: 'Vaporwave · 1991',       group: '現代', font: 'serif', sample: '蒸汽波　復古錯位', swatch: { bg: 'linear-gradient(180deg,#1B0B3C,#FFB5D9)' } },
    { key: 'v36', label: 'Solarpunk · 共生',       group: '現代', font: 'sans',  sample: '太陽朋克　綠意共生', swatch: { bg: 'linear-gradient(180deg,#F7EBC4,#B8D08A)' } },
    { key: 'v2',  label: 'Polaroid · 拍立得',      group: '復古', font: 'sans',  sample: '拍立得邊框　褪色照', swatch: { bg: '#F5E6C8' } },
    { key: 'v3',  label: '8-bit · 像素',           group: '復古', font: 'mono',  sample: 'PRESS START TO READ', swatch: { bg: '#2D1B69' } },
    { key: 'v7',  label: 'Diner · 50s 餐廳',       group: '復古', font: 'serif', sample: '50 年代餐館　霓虹', swatch: { bg: 'repeating-conic-gradient(#E8443A 0% 25%, #FAF0DC 0% 50%) 50%/14px 14px' } },
    { key: 'v8',  label: 'Newsprint · 老報紙',     group: '復古', font: 'serif', sample: '泛黃舊報　頭條密密', swatch: { bg: '#F2E8D0' } },
    { key: 'v12', label: 'Cassette · 卡帶',         group: '復古', font: 'sans',  sample: '錄音帶　磁性回放', swatch: { bg: 'linear-gradient(180deg,#5A3828 0 30%,#F5E6C8 30% 70%,#5A3828 70%)' } },
    { key: 'v13', label: 'Typewriter · 打字機',    group: '復古', font: 'mono',  sample: '叩叩鍵聲　紙頁斜偏', swatch: { bg: '#F5EAC8' } },
    { key: 'v14', label: 'Pulp · 廉價小說',         group: '復古', font: 'serif', sample: '廉價小說　驚悚封面', swatch: { bg: 'radial-gradient(circle at 70% 30%,#E83A1F 0 28%,#F0DC9C 30%)' } },
    { key: 'v15', label: 'Vinyl · 黑膠唱片',       group: '復古', font: 'serif', sample: '黑膠唱片　封套美學', swatch: { bg: 'radial-gradient(circle,#C8242C 0 35%,#1A1A1A 36%)' } },
    { key: 'v52', label: 'Neumorphism · 軟 UI',    group: '現代', font: 'sans',  sample: '軟陰影 UI　按鍵浮凸', swatch: { bg: '#E8ECF0' } },
    { key: 'v53', label: 'Claymorphism · 黏土',    group: '現代', font: 'sans',  sample: '黏土感塑形　糖果色', swatch: { bg: '#FDBCB4' } },
    { key: 'v54', label: 'Mesh Aurora · 極光',     group: '現代', font: 'sans',  sample: '極光網格　虹彩模糊', swatch: { bg: 'radial-gradient(at 30% 30%,#7C3AED,transparent),radial-gradient(at 70% 70%,#06B6D4,transparent),#EC4899' } },
    { key: 'v55', label: 'VisionOS · 空間',         group: '現代', font: 'sans',  sample: '空間運算　毛玻璃層', swatch: { bg: 'radial-gradient(at 50% 30%,#2A1F4E,#1A0F2E)' } },
    { key: 'v56', label: 'Bookshop · 書店',          group: '經典', font: 'serif', sample: '小書店午後　咖啡香', swatch: { bg: 'radial-gradient(at 30% 20%,#C9A36833,#3E2818)' } },
    { key: 'v57', label: 'Cloth · 布面精裝',         group: '經典', font: 'serif', sample: '布面精裝　書脊燙金', swatch: { bg: 'linear-gradient(135deg,#1A3A28,#0F2418)' } },
    { key: 'v58', label: 'Notebook · 札記本',        group: '經典', font: 'serif', sample: 'Moleskine 札記', swatch: { bg: 'linear-gradient(135deg,#1A1A1A,#0E0E0E)' } },
    { key: 'v59', label: 'Long-form · 長文雜誌',     group: '經典', font: 'serif', sample: '長文雜誌　深度報導', swatch: { bg: '#FAFAF7' } },
    { key: 'v60', label: 'Grimoire · 魔典',          group: '奇幻', font: 'serif', sample: '魔法書頁　燙金符印', swatch: { bg: 'radial-gradient(ellipse,#3A2818,#1F1408)' } },
    { key: 'v61', label: "Adventurer's Codex · 冒險者手冊", group: '奇幻', font: 'serif', sample: 'D&D 戰役手冊', swatch: { bg: 'radial-gradient(ellipse,#5A1F1F,#1F0A0A)' } },
    { key: 'v62', label: 'Rune Stone · 符文石碑',     group: '奇幻', font: 'serif', sample: '符文石碑　古老咒語', swatch: { bg: 'linear-gradient(180deg,#363A40,#2A2D32)' } },
    { key: 'v63', label: 'Fae Codex · 精靈卷宗',      group: '奇幻', font: 'serif', sample: '精靈卷宗　月光手稿', swatch: { bg: 'radial-gradient(ellipse,#1A2D24,#0F1F18)' } },
    { key: 'v64', label: 'Mourning · 維多利亞遺照',     group: '暗黑', font: 'serif', sample: '亡者肖像　維多利亞', swatch: { bg: 'radial-gradient(ellipse,#241522,#1A0F18)' } },
    { key: 'v65', label: 'Dossier · 命案檔案',          group: '暗黑', font: 'sans',  sample: '機密案卷　證物編號', swatch: { bg: '#E8D89C' } },
    { key: 'v66', label: 'Ghost Story · 鬼故事筆記',    group: '暗黑', font: 'serif', sample: '燭火搖曳　鬼話夜談', swatch: { bg: 'radial-gradient(circle,#1A1208 40%,#0F0A05)' } },
    { key: 'v67', label: 'Bestiary · 怪物百科',         group: '暗黑', font: 'serif', sample: '中世紀怪獸圖譜',     swatch: { bg: '#E8DCB8' } },
    { key: 'v68', label: 'RPG Textbox · RPG 對話框',    group: '遊戲', font: 'sans',  sample: '勇者旅程即將開始',   swatch: { bg: 'linear-gradient(135deg,#102050,#0A1638)' } },
    { key: 'v69', label: 'Visual Novel · 視覺小說',     group: '遊戲', font: 'sans',  sample: '視覺小說　告白瞬間', swatch: { bg: 'linear-gradient(180deg,#FFD0E0,#F8C0D0)' } },
    { key: 'v70', label: 'Board Game · 桌遊規則書',     group: '遊戲', font: 'serif', sample: '桌遊規則　翻頁玩家', swatch: { bg: '#E8D8A8' } },
    { key: 'v71', label: 'Steam Deck · 掌機介面',       group: '遊戲', font: 'sans',  sample: 'Steam Deck UI', swatch: { bg: 'linear-gradient(135deg,#2A3F5F,#1B2838)' } },
    { key: 'v72', label: 'Mountain Cabin · 山屋木紋',    group: '自然', font: 'serif', sample: '山屋木紋　爐火劈啪', swatch: { bg: 'repeating-linear-gradient(90deg,#3A2818 0 8px,#2A1808 8px 10px)' } },
    { key: 'v73', label: 'Tide Pool · 潮間',             group: '自然', font: 'serif', sample: '潮間帶　貝殼與浪',   swatch: { bg: 'linear-gradient(180deg,#D0E2DE,#7CB8B0)' } },
    { key: 'v74', label: 'Pressed Botanical · 壓花標本', group: '自然', font: 'serif', sample: '乾燥植物　羊皮紙夾', swatch: { bg: '#F0E8D0' } },
    { key: 'v75', label: 'Campfire · 營火',              group: '自然', font: 'serif', sample: '營火餘燼　煙香瀰漫', swatch: { bg: 'radial-gradient(ellipse at bottom,#FF6838 0%,#1A0F08 70%)' } },
    { key: 'v76', label: 'Bulletin · 公報',              group: '檔案', font: 'serif', sample: '官方公報　告示張貼', swatch: { bg: '#F5EFE0' } },
    { key: 'v77', label: 'Transcript · 法庭逐字',        group: '檔案', font: 'mono',  sample: '法庭速記　逐字筆錄', swatch: { bg: '#F8F4D8' } },
    { key: 'v78', label: 'Field Journal · 田野筆記',     group: '檔案', font: 'serif', sample: '田野日誌　手繪標本', swatch: { bg: '#F8E89C' } },
    { key: 'v79', label: 'Library Card · 圖書館卡',      group: '檔案', font: 'serif', sample: '圖書館借閱卡',     swatch: { bg: '#F4ECD8' } },
    { key: 'v80', label: 'Silent Film · 默片字卡',         group: '影視', font: 'serif', sample: '默片字幕　黑白光影', swatch: { bg: 'linear-gradient(135deg,#08080A 0 50%,#E8DCB8 50%)' } },
    { key: 'v81', label: 'Letterboxd · 影評卡',            group: '影視', font: 'sans',  sample: '看完想寫影評紀錄',   swatch: { bg: 'linear-gradient(135deg,#1C2228,#14181C)' } },
    { key: 'v82', label: 'HK Cinema · 港片海報',           group: '影視', font: 'serif', sample: '港片海報　霓虹武俠', swatch: { bg: 'linear-gradient(135deg,#1A0808 0 60%,#FFD24A 60%)' } },
    { key: 'v83', label: 'Film Reel · 膠卷邊孔',           group: '影視', font: 'serif', sample: '35mm 膠卷　邊孔之間', swatch: { bg: 'repeating-linear-gradient(0deg,#0F0A05 0 8px,#28201A 8px 12px)' } },
    { key: 'v84', label: 'Picture Book · 童書水彩',        group: '童趣', font: 'serif', sample: '童書水彩　清晨故事', swatch: { bg: 'radial-gradient(circle at 30% 30%,#FFD0E0,#FFF4E8)' } },
    { key: 'v85', label: 'Crayon · 蠟筆塗鴉',              group: '童趣', font: 'sans',  sample: '蠟筆亂塗　原色童趣', swatch: { bg: 'linear-gradient(45deg,#FF4848 0 25%,#FFCC00 25% 50%,#4878FF 50% 75%,#48C848 75%)' } },
    { key: 'v86', label: 'LEGO · 樂高說明書',              group: '童趣', font: 'sans',  sample: '樂高說明書　組裝',   swatch: { bg: 'radial-gradient(circle at 50% 50%,#E0E0E0 6px,#FAFAFA 7px)' } },
    { key: 'v87', label: 'Pop-up · 彈跳書',                group: '童趣', font: 'serif', sample: '彈跳書頁　立體驚喜', swatch: { bg: 'linear-gradient(135deg,#FAEEDC,#E8D8B8)' } },
    { key: 'v88', label: 'Thangka · 唐卡',                 group: '靈性', font: 'serif', sample: '唐卡曼陀羅　梵我',   swatch: { bg: 'radial-gradient(ellipse,#FF9038,#3A1808)' } },
    { key: 'v89', label: 'Stained Glass · 教堂彩繪玻璃',   group: '靈性', font: 'serif', sample: '彩繪玻璃　光影聖痕', swatch: { bg: 'linear-gradient(135deg,#3858E8 0 33%,#E848A8 33% 66%,#FFC848 66%)' } },
    { key: 'v90', label: 'I Ching · 易經卦象',             group: '靈性', font: 'serif', sample: '易經卦象　陰陽辯證', swatch: { bg: '#1A1A1F' } },
    { key: 'v91', label: 'Astrology · 占星天宮',           group: '靈性', font: 'serif', sample: '占星天宮　星圖解讀', swatch: { bg: 'radial-gradient(ellipse at top,#FFC848,#04081A 70%)' } },
    { key: 'v92', label: 'Scrapbook · 拼貼剪貼簿',         group: '手工', font: 'serif', sample: '拼貼剪貼　手寫便箋', swatch: { bg: 'linear-gradient(135deg,#FFD848,#FF98AC,#88E0F0)' } },
    { key: 'v93', label: 'Embroidery · 北歐刺繡',          group: '手工', font: 'serif', sample: '北歐刺繡　亞麻基底', swatch: { bg: '#E8DCC0' } },
    { key: 'v94', label: 'Quilt · 美國拼布',                group: '手工', font: 'serif', sample: '美國拼布　幾何織紋', swatch: { bg: 'linear-gradient(135deg,#A85838 0 50%,#3A6B4E 50%)' } },
    { key: 'v95', label: 'Paper Lace · 紙蕾絲剪紙',         group: '手工', font: 'serif', sample: '紙蕾絲剪　窗花精巧', swatch: { bg: 'radial-gradient(circle,#C8242C 30%,#FAFAF4 32%)' } },
    { key: 'v96', label: 'Linen · 亞麻',                    group: '經典', font: 'serif', sample: '亞麻織紋　暖中性灰', swatch: { bg: '#EAE3D2' } },
    { key: 'v97', label: 'Newspaper · 晨報',                group: '檔案', font: 'serif', sample: '晨報頭版　紅線標題', swatch: { bg: '#F0E8D0' } },
    { key: 'v98', label: 'Tea Stained · 茶漬本',            group: '自然', font: 'serif', sample: '茶漬書頁　歲月留香', swatch: { bg: 'radial-gradient(ellipse at 30% 40%,#F0E0BC,#D4B888 80%)' } },
    { key: 'v99',  label: 'Obsidian · 黑曜',                 group: '奇幻', font: 'serif', sample: '黑曜深夜　金箔閃爍', swatch: { bg: 'linear-gradient(180deg,#14161B,#0A0B0E)' } },
    { key: 'v100', label: 'Moonstone · 月長石',              group: '奇幻', font: 'serif', sample: '月長石光　深夜寧靜', swatch: { bg: 'linear-gradient(180deg,#1F2738,#141A28)' } },
    { key: 'v101', label: 'Bamboo Slip · 竹簡',              group: '武俠', font: 'serif', sample: '竹簡刻文　江湖往事', swatch: { bg: 'repeating-linear-gradient(90deg,#D4B782 0,#D4B782 22px,#C8A872 22px,#C8A872 23px)' } },
    { key: 'v102', label: 'Rice Paper · 宣紙',               group: '武俠', font: 'serif', sample: '宣紙水墨　筆走龍蛇', swatch: { bg: '#F2EAD8' } },
    { key: 'v103', label: 'Vermilion · 朱砂',                group: '武俠', font: 'serif', sample: '線裝書頁　朱砂落印', swatch: { bg: '#F0E4C8' } },
    { key: 'v104', label: 'Pastel Sakura · 櫻霞',            group: '柔和', font: 'sans',  sample: '櫻花輕落　午後微光', swatch: { bg: '#FCEFEF' } },
    { key: 'v105', label: 'Mint Cream · 薄荷奶霜',           group: '柔和', font: 'sans',  sample: '薄荷療癒　淡綠輕飄', swatch: { bg: '#EEF6F0' } },
    { key: 'v106', label: 'Twilight · 微光',                 group: '奇幻', font: 'serif', sample: '微光朦朧　紫霧氤氳', swatch: { bg: 'radial-gradient(ellipse at 50% 30%,#2C2438,#15101F 70%)' } },
    { key: 'v107', label: 'Hogwarts · 霍格華茲',             group: '奇幻', font: 'serif', sample: '魔法的本質　堅定的意志', swatch: { bg: 'radial-gradient(ellipse at 30% 30%,#1F3A2A,#0E1F18)' } },
    { key: 'v108', label: 'Wall of Titans · 巨人之壁',       group: '奇幻', font: 'sans',  sample: '城牆之外　從來不是傳說', swatch: { bg: 'linear-gradient(180deg,#2A2620,#1A1714)' } },
    { key: 'v111', label: 'Night City · 夜城',               group: '現代', font: 'sans',  sample: '人格可以被下載　複製刪除', swatch: { bg: 'linear-gradient(135deg,#1A0830,#0A0418)' } },
    { key: 'v112', label: 'Cryogenic · 冷凍艙',              group: '現代', font: 'mono',  sample: 'STATUS · ACTIVE  休眠 247 年', swatch: { bg: 'linear-gradient(180deg,#0A1828,#050E18)' } },
    { key: 'v113', label: 'Cold Press · 冷壓紙',             group: '經典', font: 'serif', sample: '冬日早晨　紙頁潔淨冷靜', swatch: { bg: '#F4F6F8' } },
    { key: 'v114', label: 'Manila · 牛皮',                   group: '經典', font: 'serif', sample: '舊文件袋　時間沉積的厚度', swatch: { bg: '#D4B98C' } },
    { key: 'v115', label: 'Grid · 方格紙',                   group: '經典', font: 'sans',  sample: '從一張方格紙開始　約束帶來自由', swatch: { bg: 'linear-gradient(0deg, transparent 90%, rgba(74,107,142,.2) 100%) 0 0/8px 8px,linear-gradient(90deg, transparent 90%, rgba(74,107,142,.2) 100%) 0 0/8px 8px,#FAFAF7' } },
    { key: 'v116', label: 'Christmas · 聖誕',                group: '節日', font: 'serif', sample: '雪在窗外靜靜落下　爐火劈啪', swatch: { bg: 'radial-gradient(ellipse at 20% 30%,#1A3A2A,#0E2018)' } },
    { key: 'v117', label: 'Halloween · 萬聖',                group: '節日', font: 'serif', sample: '十月最後一夜　影子拉得很長', swatch: { bg: 'linear-gradient(180deg,#1F0F2A,#0E0518)' } },
    { key: 'v118', label: '農曆新年',                        group: '節日', font: 'serif', sample: '春到福臨家門開　爆竹一歲除', swatch: { bg: '#C8242C' } },
    { key: 'v119', label: 'Storybook · 故事書',              group: '童趣', font: 'serif', sample: '從前從前　會做夢的小狐狸', swatch: { bg: '#F8EDD4' } },
    { key: 'v120', label: 'Cthulhu · 克蘇魯',                group: '暗黑', font: 'serif', sample: '我看見的東西　不應存在', swatch: { bg: 'radial-gradient(ellipse at 30% 70%,#0F2828,#050F0F)' } },
    { key: 'v121', label: 'Gothic Cathedral · 哥德教堂',     group: '暗黑', font: 'serif', sample: '尖拱陰影裡　彩繪玻璃黎明亮起', swatch: { bg: 'linear-gradient(180deg,#181420,#0A0814)' } },
  ];
  const active = themes.find(t => t.key === settings.activeTheme) || themes[0];
  const groups = ['經典', '復古', '現代', '華麗', '東方', '武俠', '奇幻', '暗黑', '遊戲', '自然', '檔案', '影視', '節日', '童趣', '柔和', '靈性', '手工'];
  const favs = settings.favoriteThemes || [];
  const activeAccent = (settings.themeColors[active.key] && settings.themeColors[active.key].accent) || '#8C3A2E';

  const q = query.trim().toLowerCase();
  const filtered = q
    ? themes.filter(t => t.label.toLowerCase().includes(q) || t.group.toLowerCase().includes(q))
    : themes;

  function toggleFavorite(key) {
    const next = favs.includes(key) ? favs.filter(k => k !== key) : [...favs, key];
    if (onSettingsChange) onSettingsChange({ favoriteThemes: next });
  }

  function accentOf(t) {
    return (settings.themeColors[t.key] && settings.themeColors[t.key].accent) || 'rgba(0,0,0,0.4)';
  }

  // The dropdown sits on a white panel. Very light accents (e.g. v37 極黑's
  // pure white) become invisible when used for the active row's gradient,
  // left bar, and ✓ tick. Substitute a dark slate when the accent is too
  // bright to read against #fff so the active state stays legible.
  function visibleAccent(accent) {
    const m = /^#([0-9a-f]{6})$/i.exec(accent);
    if (!m) return accent;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma > 220 ? '#1F1F1F' : accent;
  }

  function ThemeRow({ t, attachActiveRef, isFav }) {
    const isActive = t.key === settings.activeTheme;
    const isHovered = hoveredKey === t.key;
    const accent = accentOf(t);
    const uiAccent = visibleAccent(accent);
    return (
      <div
        ref={attachActiveRef && isActive ? activeRef : null}
        onClick={() => { cancelPreview(); onChange(t.key); setOpen(false); setQuery(''); }}
        onMouseEnter={() => { setHoveredKey(t.key); schedulePreview(t.key); }}
        onMouseLeave={() => { setHoveredKey(prev => prev === t.key ? null : prev); cancelPreview(); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '10px 12px', borderRadius: 8,
          background: isActive
            ? `linear-gradient(90deg, ${uiAccent}1F, ${uiAccent}0A)`
            : isHovered ? 'rgba(0,0,0,0.03)' : 'transparent',
          cursor: 'pointer', position: 'relative',
          transition: 'background .12s',
        }}
      >
        {isActive && (
          <span style={{
            position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
            background: uiAccent, borderRadius: 2,
          }}/>
        )}
        <span style={{
          width: 32, height: 32, borderRadius: 16, flexShrink: 0,
          background: t.swatch.bg,
          boxShadow: `inset 0 0 0 3px ${accent}, 0 1px 2px rgba(0,0,0,0.08)`,
        }}/>
        <div style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            fontSize: 13, fontWeight: 500,
            color: isActive ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.82)',
            marginBottom: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{t.label}</div>
          <div style={{
            fontSize: 10.5, lineHeight: 1.3,
            color: 'rgba(0,0,0,0.42)',
            fontFamily: t.font === 'serif' ? "'Noto Serif TC', Georgia, serif"
              : t.font === 'mono' ? "'JetBrains Mono', ui-monospace, monospace"
              : "'Noto Sans TC', system-ui, sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>{t.sample}</div>
        </div>
        <span
          onClick={(e) => { e.stopPropagation(); toggleFavorite(t.key); }}
          title={isFav ? '取消最愛' : '加入最愛'}
          style={{
            fontSize: 14, lineHeight: 1, padding: '4px 6px', borderRadius: 4,
            color: isFav ? '#E8A93A' : 'rgba(0,0,0,0.25)',
            opacity: isFav || isHovered ? 1 : 0,
            transition: 'opacity .12s',
            cursor: 'pointer', flexShrink: 0,
          }}>★</span>
        {isActive && (
          <span style={{ fontSize: 12, color: uiAccent, fontWeight: 600, flexShrink: 0 }}>✓</span>
        )}
      </div>
    );
  }

  function Section({ title, tagAccent, star, children }) {
    return (
      <div style={{ marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 6px' }}>
          <span style={{
            fontSize: 9.5, letterSpacing: '0.22em', fontWeight: 700,
            color: tagAccent || 'rgba(0,0,0,0.45)', textTransform: 'uppercase',
          }}>
            {star && <span style={{ marginRight: 5 }}>★</span>}
            {title}
          </span>
          <span style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.05)' }}/>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(v => !v)} title="切換風格" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        height: 28, padding: '0 10px 0 6px', maxWidth: 220,
        background: '#fff', border: '0.5px solid rgba(0,0,0,0.14)',
        borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--ui)', textAlign: 'left',
        boxShadow: open ? '0 0 0 3px rgba(232,169,58,0.18)' : 'none',
        transition: 'box-shadow .15s',
      }}>
        <span style={{
          width: 18, height: 18, borderRadius: 9, display: 'inline-block', flexShrink: 0,
          background: active.swatch.bg,
          boxShadow: `inset 0 0 0 2px ${activeAccent}, 0 1px 2px rgba(0,0,0,0.08)`,
        }}/>
        <span style={{
          fontSize: 11, fontWeight: 500, color: 'rgba(0,0,0,0.85)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          minWidth: 0,
        }}>{active.label}</span>
        <span style={{
          fontSize: 9, opacity: 0.55, flexShrink: 0,
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s',
        }}>▾</span>
      </button>
      {open && <>
        <div onClick={() => { cancelPreview(); setOpen(false); setQuery(''); }} style={{ position: 'fixed', inset: 0, zIndex: 850 }}/>
        <div onMouseLeave={cancelPreview} style={{
          position: 'absolute', right: 0, top: 'calc(100% + 12px)', width: 340, maxHeight: 540,
          display: 'flex', flexDirection: 'column',
          background: '#fff',
          border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12,
          boxShadow: '0 24px 60px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.04)',
          zIndex: 851, fontFamily: 'var(--ui)', overflow: 'hidden',
        }}>
          <div style={{ padding: 10, borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                fontSize: 12, opacity: 0.35, pointerEvents: 'none',
              }}>⌕</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Escape') { cancelPreview(); setOpen(false); setQuery(''); } }}
                placeholder="搜尋風格…"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '10px 12px 10px 32px', fontSize: 12.5, fontFamily: 'inherit',
                  border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8,
                  background: 'rgba(0,0,0,0.02)', outline: 'none',
                  transition: 'background .15s',
                }}
                onFocus={e => e.target.style.background = '#fff'}
                onBlur={e => e.target.style.background = 'rgba(0,0,0,0.02)'}
              />
            </div>
            <button
              onClick={() => {
                const pool = themes.filter(t => t.key !== settings.activeTheme);
                const pick = pool[Math.floor(Math.random() * pool.length)];
                if (pick) { cancelPreview(); onChange(pick.key); setOpen(false); setQuery(''); }
              }}
              title="隨機挑一個主題"
              style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: 'rgba(0,0,0,0.02)', border: '0.5px solid rgba(0,0,0,0.1)',
                cursor: 'pointer', fontSize: 16, lineHeight: 1,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background .15s, transform .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
              onMouseDown={e => { e.currentTarget.style.transform = 'rotate(-12deg) scale(.92)'; }}
              onMouseUp={e => { e.currentTarget.style.transform = 'none'; }}
            >🎲</button>
          </div>
          <div ref={scrollContainerRef} onScroll={handleScroll} className="scroll-thin" style={{
            flex: 1, overflowY: 'auto', padding: '4px 6px 10px',
          }}>
            {!q && favs.length > 0 && (() => {
              const favItems = favs.map(k => themes.find(t => t.key === k)).filter(Boolean);
              if (favItems.length === 0) return null;
              return (
                <Section title="最愛" tagAccent="#C28A22" star>
                  {favItems.map(t => (
                    <ThemeRow key={'fav-' + t.key} t={t} attachActiveRef={true} isFav={true}/>
                  ))}
                </Section>
              );
            })()}
            {groups.map(g => {
              const items = filtered.filter(t => t.group === g);
              if (!items.length) return null;
              return (
                <Section key={g} title={g}>
                  {items.map(t => (
                    <ThemeRow
                      key={t.key} t={t}
                      attachActiveRef={!favs.includes(t.key)}
                      isFav={favs.includes(t.key)}
                    />
                  ))}
                </Section>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '32px 12px', fontSize: 12, color: 'rgba(0,0,0,0.4)', textAlign: 'center' }}>
                找不到「{query}」相符的風格
              </div>
            )}
          </div>
        </div>
      </>}
    </div>
  );
}
window.ThemeSwitcher = ThemeSwitcher;
