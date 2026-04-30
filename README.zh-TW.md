# Novel Reader

[English](README.md) · **繁體中文**

一個在瀏覽器裡跑、不需編譯、本機優先的桌面小說閱讀器，支援 **EPUB** 與 **TXT**。原本是為了中文連載網路小說（zh-TW / zh-CN）設計的，但其他內容也一樣能讀。

- **以書庫為主的 UX** — Netflix 風格首頁：大張 hero 看板、橫向捲動書列（繼續閱讀 / 有新章節 / 依 tag & collection 分組）、`/` 快捷鍵聚焦搜尋、深色 grid 篩選檢視
- **藏書閣（Library Manage view）** — Rune Stone 配色的全螢幕管理頁：左 sidebar 篩選、grid 檢視、依進度 / 字數 / 拼音 (zh-Hant) 排序、批次改 tag / 移收藏集 / 移除
- **章節內查找** — 閱讀器裡按 `Ctrl+F` 開啟頂端搜尋列，標亮所有命中、用 `Enter` / `Shift+Enter` 跳上一筆 / 下一筆
- **約 120 種閱讀主題**，分 17 個分類（經典 / 復古 / 現代 / 華麗 / 東方 / 武俠 / 奇幻 / 暗黑 / 遊戲 / 自然 / 檔案 / 影視 / 節日 / 童趣 / 柔和 / 靈性 / 手工），每個主題有 4–9 種背景色變體 + 6 種 accent 預設，主題切換器有搜尋框 + ★ 最愛
- **閱讀統計**（📊 modal）— Lv.N reader 等級徽章、連續天數、GitHub 風格 365 天活動熱圖、總章節 / 總字數 / 累計天數
- **書本資訊卡** — 右鍵任一書 → 📋 書本資訊 → 圖書館借閱卡風格的 overlay，含借閱記錄、最近活動、tags、collections、操作列
- **Tachiyomi 式 "+N" 徽章** — EPUB 檔在磁碟上新增章節時，自動顯示紅色數字
- **整個資料夾遞迴掃描**（File System Access API）— 指向爬蟲輸出目錄，可排除子資料夾（`ko`、`raw` 等），所有 `.epub` 自動出現
- **IndexedDB** 持久化 — 書、閱讀位置、設定、tag、collection、閱讀事件都保存本機
- **沉浸式閱讀模式** — toolbar 3 秒不動自動淡出；中文排版控制（段首縮排 / 段距 / 字重）
- **全部在瀏覽器裡跑** — 沒有伺服器、沒有編譯步驟、沒有 bundler

> 這工具最初就是為了讀我自己寫的 [esjzone-scraper](https://github.com/Mystic0428/esjzone-scraper) 抓出來的檔案，所以對「會持續長章節」的連載小說支援特別好。

---

## 前置條件

乾淨電腦上只需要**兩樣**：

| 需要什麼 | 為什麼 | 怎麼裝 |
| -------- | ------ | ------ |
| **Python 3** | 啟動腳本（`start.bat` / `start.sh`）用 `python -m http.server` 啟本機伺服器 | Windows：到 [python.org](https://www.python.org/downloads/) 下載，**記得勾選 "Add Python to PATH"**。<br>macOS：`brew install python`（macOS 12.3+ 已不預裝）。<br>Linux：通常已預裝；沒有的話 `sudo apt install python3`。 |
| **Chromium 系瀏覽器** | 資料夾掃描要用 File System Access API（`showDirectoryPicker`），目前只有 Chromium 支援 | Windows：Edge 已預裝，可直接用；或裝 Chrome / Brave。<br>macOS / Linux：裝 Chrome / Edge / Brave。 |

Firefox 和 Safari 也能跑這個 app，但只能用**單檔模式**（無法掃整個資料夾）。其他功能 — IndexedDB、EPUB 解析、主題 — 在現代瀏覽器都能跑。

不需要 Node.js、不需要 npm、不需要編譯步驟。這是刻意的設計。

---

## 快速開始

沒 build、沒 install，啟動腳本雙擊就跑：

**Windows** — 雙擊 `start.bat`（或從終端機執行）。
**macOS / Linux** — `./start.sh`（第一次要 `chmod +x start.sh`）。

這兩個腳本都會在專案資料夾啟動 `python -m http.server 8080`，然後用預設瀏覽器打開 <http://localhost:8080/novel-reader.html>。

或手動：

```sh
cd novel-reader
python -m http.server 8080
# 然後開 http://localhost:8080/novel-reader.html
```

> 一定要用 `http://` 網址 — File System Access API 在 `file://` 下不能用。

### 加書

- **📁 根目錄**（右上下拉）— 選一個資料夾，底下所有 `.epub`（含子目錄）都會被索引。會問你要排除哪些子資料夾名稱（例如 `ko, raw, ja`）— 在爬蟲輸出同時混了原文 + 翻譯的情境很方便
- **＋ 加檔** — 只加一個 `.epub` 或 `.txt` 檔

書庫每次打開會自動掃描有授權的 root，所以新爬的書會自動出現。EPUB 檔在磁碟上新增章節後，下次打開書會重新解析；卡片亮紅色 **+N** 徽章直到你讀過那些新章為止。

### 快捷鍵

| 按鍵 | 在哪 | 動作 |
| ---- | ---- | ---- |
| `/` | 書庫 / 藏書閣 | focus 搜尋框 |
| `Esc` | 書庫 / 藏書閣搜尋 | 清空搜尋 + blur |
| `Esc` | 藏書閣 | 退批次模式 → 清搜尋 → 回首頁 |
| `←` / `→` | 閱讀器 | 上一章 / 下一章 |
| `PgUp` / `PgDn` / `Space` | 閱讀器 | 翻頁捲動 |
| `T` | 閱讀器 | 開關目錄抽屜 |
| `,` | 閱讀器 | 開關調整面板 |
| `F` | 閱讀器 | 全螢幕 |
| `Ctrl+F` / `Cmd+F` | 閱讀器 | 開啟章節內查找 |
| `Enter` / `Shift+Enter` | 查找列 | 下一筆 / 上一筆 |
| `Esc` | 閱讀器 | 回書庫 |

---

## 主題

約 **120 個閱讀主題**，分 **17 個分類**。每個主題有 **4–9 種背景變體** 和 **6 種 accent 預設**（🎨 顏色面板）。主題切換器有搜尋框（中英 label / 分類名稱都比對）+ ★ 最愛置頂。

| 分類 | 風格 |
| ---- | ---- |
| **經典** (14) | 安靜的預設值 — Warm 書房 / Glass 毛玻璃 / Dark 典藏 / Apple Books 書櫃 / 紙墨 純讀 / Bookshop / Notebook 札記本 / Long-form 長文雜誌 |
| **復古** (9) | 2000 年前的印刷與科技 — Terminal 終端機 / Polaroid 拍立得 / 8-bit 像素 / Diner 50s / Newsprint 老報紙 / Cassette 卡帶 / Typewriter 打字機 / Pulp 廉價小說 / Vinyl 黑膠 |
| **現代** (17) | 當代編輯設計 — Brutalist 野獸派 / Editorial 極黑 / Memphis 80s / Wes 對稱 / Cyberpunk 霓虹 / Riso 印刷 / Swiss 編輯部 / Rams Braun T1000 / Frutiger Aero / Vaporwave / Solarpunk / Neumorphism / Claymorphism / Mesh Aurora / VisionOS |
| **華麗** (15) | 繁複裝飾 — Deco 裝飾藝術 / Baroque 巴洛克 / Arcana 塔羅 / Gothic 哥德 / Art Nouveau / Illuminated 抄本 / First Folio / Byzantine / Ex Libris 維多利亞 / Cloisonné 景泰藍 / Leather & Gilt 燙金皮革 / Marbled / Ivory 象牙雕刻 / 上海 1934 月份牌 / Cathedral 大教堂 |
| **東方** (10) | CJK 美學 — 宋卷 山水 / 青花 瓷器 / 浮世繪 北齋 / 水墨 沉硯 / 直書 線裝古籍 / 雕版 / Rinpa 和風金屏 / 敦煌 殘卷 / 蘇州 漏窗 / 侘寂 殘缺 |
| **武俠** (3) | 江湖／武俠調性 |
| **奇幻** (9) | RPG / 奇幻文學 — Grimoire 魔典 / Adventurer's Codex 冒險者手冊 / Rune Stone 符文石碑 / Fae Codex 精靈卷宗 / Storybook 童話書 |
| **暗黑** (6) | Macabre / 哥德 — Mourning 維多利亞遺照 / Dossier 命案檔案 / Ghost Story 鬼故事筆記 / Bestiary 怪物百科 / Cthulhu 克蘇魯 |
| **遊戲** (4) | 遊戲 UI 仿造 — RPG Textbox 對話框 / Visual Novel 視覺小說 / Board Game 桌遊規則書 / Steam Deck 掌機介面 |
| **自然** (5) | 戶外 / 植物 — Mountain Cabin 山屋木紋 / Tide Pool 潮間 / Pressed Botanical 壓花標本 / Campfire 營火 |
| **檔案** (5) | 官僚 / 法庭 — Bulletin 公報 / Transcript 法庭逐字 / Field Journal 田野筆記 / Library Card 圖書館卡 / Manila 公文夾 |
| **影視** (4) | 電影／影集靈感 |
| **節日** (3) | 節慶 — Christmas / Halloween / 農曆新年 |
| **童趣** (5) | 童書插畫風 |
| **柔和** (2) | 柔和粉彩 |
| **靈性** (4) | 沉思／靈性 |
| **手工** (4) | 手作／織品 — Paperlace / Linen / Coldpress 等 |

主題只會影響**閱讀區**；書庫首頁、目錄抽屜的外觀在所有主題下維持一致。每個主題的 accent 與背景色獨立記在 settings 裡，切換主題時會記得你之前的選擇。

---

## 書庫首頁（Netflix 風）

- **Sticky 上列** — logo、搜尋框（`/` 聚焦 + ✕ 清除）、排序下拉、📚 藏書閣、📊 統計、📁 根目錄、＋ 加檔
- **Hero 看板** — 最近讀的書（或第一本可用的書），模糊封面當背景、進度條、「繼續閱讀」按鈕
- **書列**（橫向捲動，可拖曳帶慣性）：
  - 🔥 有新章節 — 磁碟上章節數超過你上次讀到的書
  - 繼續閱讀 — 你有讀過的書，依 `lastReadAt` 倒序（讀完的書也會留下來，給重讀者一鍵直達）
  - 全部藏書 · {排序} — 依你選的排序顯示所有書
  - 每個有 ≥ 3 本的 `📁` 合集一列
  - 每個有 ≥ 3 本的 `#` tag 一列
- **分類瀏覽** — tag 和 collection 的分類卡；點了就套用 filter
- **搜尋 / 篩選模式** — 切到深色 grid 檢視，上方有 chip 式 tag/collection 篩選；無結果時顯示 empty state + 「清除全部條件」按鈕
- **右鍵任一書封** → 📋 書本資訊、# tags、📁 collection、↺ 清除進度、🗑 移除

### 藏書閣 · The Stacks（📚）

獨立的全螢幕管理頁（首頁上列 → 📚 藏書閣），給書多到橫向 row 找不到時用：

- **左 sidebar** — 狀態（全部 / 正在讀 / 未開始 / 已讀）+ 每個 `#` tag + 每個 `📁` collection 的計數
- **上列** — 回首頁、搜尋（`/` focus）、grid 大小切換（⊞ / ⊟）、批次模式切換、排序下拉（最近讀 / 加入時間 / 書名 / 作者 / 進度 / 字數）
- **中央 grid** — responsive、書封大小可切、hover 看章節數 / 字數 / 上次讀、細進度條、+N 新章 badge
- **右側面板** — 預設書庫概覽（總書數、Donut、今年讀完 / 連續閱讀 / 累積字數）；批次模式時換成**批次工具**（改 tag / 移到 collection / 🗑 移除含確認）
- 視覺：Rune Stone 配色（深褐 + 古金）— 跟 Netflix 首頁、各閱讀主題視覺區隔，一眼就知道自己在哪一頁

### 閱讀統計（📊）

從 design bundle 的 H2 + H7 變體拉來的視覺：

- **Hero ribbon** — `Lv.N READER` 等級徽章（每 10 章 +1 級）、目前連續天數 + XP bar 到下一級、副 tile（最長連讀 / 累計天數 / 總章節）
- **活動熱圖** — GitHub 風 53 週 × 7 天 grid，金色深淺對應當天讀的章節數，hover 顯示日期 + 章數
- **統計 tiles** — 總章節 / 總字數 / 累計天數 / 最長連讀 / 當前等級 / 首次閱讀
- **已讀完條** — 在最後一章 + scroll ≥ 0.9 的書；點了就打開

閱讀事件以 (book, chapter, day) 為唯一鍵 idempotent 記錄 — 同一天重開同一章不會灌水。

### 書本資訊卡（📋）

右鍵 → 書本資訊，開圖書館借閱卡風格的 overlay：

- 封面、標題（大襯線）、作者、tags、collections
- 仿 Dewey decimal 編號（裝飾用）+ BORROWED / FINISHED 蓋章
- 6 格 circulation record：加入 / 上次閱讀 / 狀態 / 章節 / 字數 / 進度
- 有新章節時顯示提示
- 最近活動（從 `readingEvents` 取最後 5 筆）
- 操作列：繼續閱讀 / 從頭開始 / # Tags / 📁 Collections / 🗑 REMOVE

---

## 閱讀體驗

- 每本書自己的「**保留原始 EPUB 排版**」開關 — EPUB 有刻意的排版（詩、漫畫、特殊版型）時打開，會保留內建 CSS。主題外殼仍在，但 inline 的排版保留
- **調整面板**（`,` 鍵）：
  - **排版**：字級（10–32 px）、行距（0.6–2.4）、字體（黑體 / 宋體）、段首縮排（0–4 字）、段距（0–2 em）、字重（300–700）
  - **質感**：紙張紋理開關、**沉浸式** 開關 — 3 秒沒互動就把 topbar/footer 淡出；mouse / key / wheel / touch 喚回。任一面板開啟時強制顯示
- **TOC 目錄**（`T` 鍵）：
  - 搜尋框（章節標題 substring 比對）
  - 開啟時當前章節自動置中
  - 當前章節用 3px accent 左側色條 + 加大加粗強調
- **主題切換器**：
  - 搜尋框（label 跟分類名稱中英都比對）
  - ★ 最愛置頂
  - 開啟時當前主題自動置中
- **章節預載** — 載入章節後，下一章在 idle time 背景解析，翻下一章瞬間切換
- **每次打開都重新解析 EPUB** — 底層檔加了章節，閱讀器會立即看到。讀過新章節後 `lastKnownChapterCount` 遞增，+N 徽章消失
- **Drop-cap 處理** — `injectDropCap` 自動跳過 CJK 字元，只對 Latin 開頭字加大

---

## 自訂分頁圖（favicon）

把 `favicon.png`（任何方形圖檔，至少 32px）丟到 repo 根目錄，重新整理就生效。預設是 inline SVG 的 📚 emoji 作 fallback，`novel-reader.html` 裡有一小段 inline JS 用 `new Image()` 去探 `favicon.png`，載入成功才把 link 換掉。`favicon.png` 已加到 `.gitignore`，不會 commit 到 repo。

---

## 檔案結構

```
novel-reader.html            — 入口點（載入所有 script）
src/
  app.jsx                    — AppContext、根路由（library / manage / reader）
  library.jsx                — Netflix 首頁 + 篩選 grid
  manage.jsx                 — 藏書閣（Rune Stone 書庫管理頁）
  reader.jsx                 — 閱讀器外殼、章節 cache、預載、沉浸式
  storage/
    idb.js                   — IndexedDB 小包裝（per-store config + indexes）
    books.js                 — books store（CRUD、tags、collections）
    roots.js                 — FS-handle 儲存（含 excludeDirs）
    settings.js              — 全域設定（active theme、tweaks、favorites）
    reading-events.js        — 給統計面板的 append-only 事件 log
  parsers/
    epub.js                  — EPUB 解析器（JSZip + preserveOriginalCss 時做 CSS scoping）
    txt.js                   — TXT 解析器（含 CJK 章節標記偵測）
  ui/
    cover.jsx                — 封面 blob 或垂直書名 fallback 方塊
    book-menu.jsx            — 右鍵選單（資訊 / tags / collection / 清除 / 移除）
    book-card.jsx            — 圖書館卡風格的書本詳情 modal
    toc-drawer.jsx           — 滑入式章節目錄（含搜尋 + 自動置中）
    find-in-chapter.jsx      — Ctrl+F 章節內查找（DOM <mark> 注入）
    tweaks-panel.jsx         — 排版 + 沉浸式控制
    stats-panel.jsx          — 閱讀統計 modal（hero + 熱圖 + tiles）
    theme-switcher.jsx       — 分組主題下拉（搜尋 + 最愛）
    color-picker.jsx         — 每主題 accent + 背景 tone 預設
  themes/
    v{N}-{name}.jsx          — 每主題一檔（Reader + Footer 元件）
styles/
  shared.css                 — reading-body、字體、scrollbar、紙張紋理
  v{1,4,5}-*.css             — 需要 CSS 的主題（其他用 JSX inline）
```

非 JSX 的腳本直接被讀入 — 所有 function 都是 top-level（hoisted），需要被共用的會掛到 `window`。`novel-reader.html` 的載入順序：storage → parsers → UI → themes → library → manage → reader → app。

---

## 資料結構（Storage Schema）

IndexedDB object stores（DB version 3）：

- **books** — `{ id, rootId, relPath, fileHandle, sourceType, title, author, coverBlob, chaptersMeta, wordCount, lastChapterId, lastScroll, tags, collections, lastKnownChapterCount, preserveOriginalCss, addedAt, lastReadAt, fileLastModified }`
- **roots** — `{ id, name, dirHandle, excludeDirs, bookCount, lastScannedAt }`
- **settings** — 只有一列，`id: 'global'`，包含 `activeTheme`、`themeColors[v1..v121]`、`tweaks`（fontSize / lineHeight / font / texture / paragraphIndent / paragraphSpacing / fontWeight / immersive）、`favoriteThemes`、首頁 `sortBy` / `sortOrder` / `filterTag` / `filterCollection`、藏書閣 `manageSortBy` / `manageSortOrder` / `manageFilter` / `manageGridSize`
- **readingEvents** — append-only，`{ id (auto), bookId, chapterId, date (YYYY-MM-DD), ts, words }`，索引 `byDate` + `byBook`，由 `openChapter` 寫入，每天每 (book, chapter) 唯一
- **kv** — 通用 key-value 暫存

`chaptersMeta` 只存 metadata（title、href、wordCount）；章節 HTML 是讀到時才由 `getChapter` 解析，存在單次 session 的記憶體 cache。

---

## 瀏覽器支援

| 瀏覽器 | 資料夾掃描 | 單檔 | IndexedDB | 狀態 |
|-------|-----------|------|-----------|------|
| Chrome / Edge / Brave | ✅ | ✅ | ✅ | 完整 |
| Firefox / Safari | ❌ | ✅ | ✅ | 單檔模式 |

資料夾掃描需要 File System Access API 的 `showDirectoryPicker`（目前只有 Chromium 系支援）。

---

## 技術堆疊

- **React 18** via UMD CDN
- **Babel Standalone** — 在瀏覽器裡編譯 JSX（每次載入編譯一次）
- **JSZip** — EPUB 容器解析
- **IndexedDB** — 持久化（自己寫了約 100 行的 wrapper）
- **File System Access API** — 資料夾 handle + 權限續期
- **Noto Serif TC / Noto Sans TC / Inter / EB Garamond / Cormorant Garamond / Caveat / JetBrains Mono / Press Start 2P** — 透過 Google Fonts 載入
- 無 npm dependency。無 build step。

---

## 開發

改任何檔案然後重整。改 JSX 的話，下次載入 Babel Standalone 會重新編譯。

**如果改動沒顯示**：用 **Ctrl+Shift+R** 硬重整（或 DevTools → Network 勾 "Disable cache"）。Babel Standalone 自己不會主動打破 HTTP cache。

新增主題的步驟：

1. 建 `src/themes/vN-name.jsx`，把 `VNReader` + `VNFooter` 掛到 `window`
2. 在 `novel-reader.html` 加 script tag（放在現有主題之後、`library.jsx` 之前）
3. 在 `src/reader.jsx` 的 switch 加 case（`renderThemeContent` 和 `renderThemeFooter` 兩個都要）
4. 在 `src/storage/settings.js` 加 `themeColors.vN` 預設值
5. 在 `src/ui/color-picker.jsx` 加 accent + tone preset
6. 在 `src/ui/theme-switcher.jsx` 的主題陣列加一筆（`group` 設成現有 17 個分類之一，或在 `groups` 加新分類）

**Reader prop 合約**：`{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }`。要尊重 `book.preserveOriginalCss`（true 時跳過 inline 排版）。Drop cap 用全域的 `injectDropCap(html, size)` helper，會自動跳過 CJK。章節標題前綴用全域的 `stripChapterPrefix(title)` 清掉「第N章：」/數字前綴。如果想讓子元素 CSS 讀到 accent，在 root 設 `--accent` CSS var。

---

## License

MIT — 隨便用。

## Credits

- 主題源自一次 Claude Design 的 mock-up session（Novel Reader 首頁 + 閱讀器原型）
- 統計面板 + 書本資訊卡的視覺取自同個 bundle 的 H2（RPG）+ H7（terminal）+ H9（library card）首頁變體
- 跟 Claude Code 協作開發
