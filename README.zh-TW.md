# Novel Reader

[English](README.md) · **繁體中文**

一個在瀏覽器裡跑、不需編譯、本機優先的桌面小說閱讀器，支援 **EPUB** 與 **TXT**。原本是為了中文連載網路小說（zh-TW / zh-CN）設計的，但其他內容也一樣能讀。

- **以書庫為主的 UX** — Netflix 風格首頁：大張 hero 看板、橫向捲動書列（繼續閱讀 / 有新章節 / 依 tag & collection 分組），搜尋/篩選切換到深色格子檢視
- **17 種氣氛主題**，每個都有自己的 accent 色 + 背景色變體，從樸素（Warm / Dark / Glass）、華麗（Baroque / Deco / Dunhuang）到實驗（Cyberpunk / Memphis / Brutalist）
- **Tachiyomi 式 "+N" 徽章** — EPUB 檔在磁碟上新增章節時，自動顯示紅色數字提示
- **整個資料夾遞迴掃描**（File System Access API）— 指向你的爬蟲輸出目錄，所有 `.epub` 自動出現
- **IndexedDB** 持久化 — 書、閱讀位置、每本書的設定、tag、collection 都保存在本機
- **全部在瀏覽器裡跑** — 沒有伺服器、沒有編譯步驟、沒有 bundler

> 這工具最初就是為了讀我自己寫的 [esjzone-scraper](https://github.com/Mystic0428/esjzone-scraper) 抓出來的檔案，所以對「會持續長章節」的連載小說支援特別好。

---

## 截圖

打開首頁 → 進閱讀器 → 從右上下拉切換主題。
（截圖 TODO —— 暫時直接跑起來看就好。）

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

- **📁 根目錄**（右上下拉）— 選一個資料夾，底下所有 `.epub`（含子目錄）都會被索引進來
- **＋ 加檔** — 只加一個 `.epub` 或 `.txt` 檔

EPUB 檔在磁碟上新增章節後，重新打開書會自動偵測；書庫卡片會亮紅色 **+N** 徽章。

### 閱讀器快捷鍵

| 按鍵 | 動作 |
| ---- | ---- |
| `←` / `→` | 上一章 / 下一章 |
| `PgUp` / `PgDn` / `Space` | 翻頁捲動 |
| `T` | 開關目錄抽屜 |
| `,` | 開關調整面板 |
| `F` | 全螢幕 |
| `Esc` | 回書庫 |

---

## 主題

17 個閱讀主題，每個都有 4–8 種背景變體 + 6 種 accent 預設。

| Key | 名稱 | 風格 |
|-----|------|------|
| `v1`  | Warm · 書房         | 溫暖米白、首字下沉、赭紅點綴 |
| `v4`  | Glass · 毛玻璃       | macOS Sequoia 式漸層壁紙 + 毛玻璃卡片 |
| `v5`  | Dark · 典藏         | 深墨綠 + 金點綴 + 宋體 + 古籍線 |
| `v6`  | Terminal · 終端機    | DOS/CRT、ASCII 邊框、等寬字 |
| `v9`  | Brutalist · 野獸派   | 2px 黑框、螢光綠、巨大章節標題 |
| `v11` | Apple Books · 書櫃   | 木紋底 + 紙頁陰影 + 彩帶書籤 |
| `v17` | Deco · 裝飾藝術      | 黑金幾何、雙線邊框、羅馬章號 |
| `v18` | Baroque · 巴洛克     | 深酒紅 + 燙金、繁複花邊 |
| `v19` | Dunhuang · 敦煌      | 朱砂描金、藻井頭圖、堂號紅印 |
| `v20` | Arcana · 塔羅        | 深紫星輝金、玫瑰角標 |
| `v21` | 宋卷 · 山水         | 卷軸軸頭、遠山水墨、收藏印 |
| `v25` | 青花 · 瓷器         | 白釉 × 鈷藍纏枝、蓮花章首 |
| `v30` | Gothic · 哥德       | 黑底火焰邊 + 哥德字 + ✝ 章節 |
| `v31` | Memphis · 80s       | 螢光粉綠紫、幾何亂拼、SIDE A |
| `v32` | Wes · 對稱          | 粉橘粉綠、全置中、票根標籤 |
| `v33` | Cyberpunk · 霓虹    | 黑底洋紅青藍、scanline、HUD |
| `v37` | Editorial · 極黑    | 純黑 × Helvetica 巨字 |

主題只會影響**閱讀區**；目錄抽屜、書庫的外觀在所有主題下維持一致。

---

## 書庫首頁（Netflix 風）

- **Sticky 上列** — logo、排序下拉、📁 根目錄、＋ 加檔、搜尋
- **Hero 看板** — 最近讀的（或剛加入的）書，模糊封面當背景、進度條、「繼續閱讀」按鈕
- **書列**（橫向捲動，自動產生）：
  - 🔥 有新章節 — 磁碟上章節數超過你上次讀到的書
  - 繼續閱讀 — 進度 < 100% 且有 `lastReadAt` 的書
  - 全部藏書 · {排序} — 依你選的排序顯示所有書
  - 每個有 ≥ 3 本的 `📁` 合集一列
  - 每個有 ≥ 3 本的 `#` tag 一列
- **分類瀏覽** — tag 和 collection 的分類卡；點了就套用 filter
- **搜尋 / 篩選模式** — 切到深色格子檢視，上方有 chip 式 tag/collection 篩選

---

## 閱讀體驗

- 每本書自己的「**保留原始 EPUB 排版**」開關 — EPUB 有刻意的排版（詩、漫畫、特殊版型）時打開，會保留內建 CSS。主題外殼仍在，但 inline 的排版保留
- **調整面板**（`,` 鍵）：字體大小（10–32 px）、行距（0.6–2.4）、字體（黑體 / 宋體）、紙張紋理開關
- **每次打開都重新解析 EPUB** — 底層檔加了章節，閱讀器會立即看到。讀到新章節後 `lastKnownChapterCount` 會遞增，+N 徽章就消失
- **Drop-cap 處理** — `injectDropCap` 自動跳過 CJK 字元，只對 Latin 開頭字加大（CJK 字形放大會破格）
- **右鍵點任一書卡** 可編輯 tag / collection / 移除

---

## 檔案結構

```
novel-reader.html            — 入口點（載入所有 script）
src/
  app.jsx                    — AppContext、根路由（library ↔ reader）
  library.jsx                — Netflix 首頁 + 篩選格子
  reader.jsx                 — 閱讀器外殼、章節 cache、TOC / tweaks 狀態
  storage/
    idb.js                   — IndexedDB 小包裝
    books.js                 — books store（CRUD、tags、collections）
    roots.js                 — FS-handle 儲存（掃描過的資料夾）
    settings.js              — 全域設定（active theme、tweaks、filters）
  parsers/
    epub.js                  — EPUB 解析器（JSZip + preserveOriginalCss 時做 CSS scoping）
    txt.js                   — TXT 解析器（含 CJK 章節標記偵測）
  ui/
    cover.jsx                — 封面 blob 或垂直書名 fallback 方塊
    book-menu.jsx            — 右鍵選單
    toc-drawer.jsx           — 滑入式章節目錄
    tweaks-panel.jsx         — 字體 / 行距 / 字族 / 紋理 sliders
    theme-switcher.jsx       — 17 主題分組下拉
    color-picker.jsx         — 每主題 accent + 背景 tone 預設
  themes/
    v{N}-{name}.jsx          — 每個主題一個檔（Reader + Footer 元件）
styles/
  shared.css                 — reading-body、字體、scrollbar、紙張紋理
  v{1,4,5}-*.css             — 需要 CSS 的主題（其他用 JSX inline）
```

非 JSX 的腳本直接被讀入 — 所有 function 都是 top-level（hoisted），需要被共用的會掛到 `window`。`novel-reader.html` 的載入順序：storage → parsers → UI → themes → library → reader → app。

---

## 資料結構（Storage Schema）

IndexedDB object stores：

- **books** — `{ id, rootId, relPath, fileHandle, sourceType, title, author, coverBlob, chaptersMeta, wordCount, lastChapterId, lastScroll, tags, collections, lastKnownChapterCount, preserveOriginalCss, addedAt, lastReadAt }`
- **roots** — `{ id, name, dirHandle, bookCount, lastScannedAt }`
- **settings** — 只有一列，`id: 'global'`，包含 `activeTheme`、`themeColors[v1..v37]`、`tweaks`、`sortBy`、`sortOrder`、`filterTag`、`filterCollection`

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
- **IndexedDB** — 持久化（自己寫了約 50 行的 wrapper）
- **File System Access API** — 資料夾 handle + 權限續期
- **Noto Serif TC / Noto Sans TC / Inter** — 透過 Google Fonts 載入
- 無 npm dependency。無 build step。

---

## 開發

改任何檔案然後重整。改 JSX 的話，下次載入 Babel Standalone 會重新編譯。

**如果改動沒顯示**：用 **Ctrl+Shift+R** 硬重整（或 DevTools → Network 勾 "Disable cache"）。Babel Standalone 自己不會主動打破 HTTP cache。

新增主題的步驟：

1. 建 `src/themes/vN-name.jsx`，把 `VNReader` + `VNFooter` 掛到 `window`
2. 在 `novel-reader.html` 加 script tag（放在現有主題之後）
3. 在 `src/reader.jsx` 的 switch 加 case（`renderThemeContent` 和 `renderThemeFooter` 兩個都要）
4. 在 `src/storage/settings.js` 加 `themeColors.vN` 預設值
5. 在 `src/ui/color-picker.jsx` 加 accent + tone preset
6. 在 `src/ui/theme-switcher.jsx` 的主題陣列加一筆

Reader prop 合約：`{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll, onPrev, onNext, canPrev, canNext }`。要尊重 `book.preserveOriginalCss`（true 時跳過 inline 排版）。Drop cap 用全域的 `injectDropCap(html, size)` helper，它會自動跳過 CJK。如果想讓子元素 CSS 讀到 accent，在 root 設 `--accent` CSS var。

---

## License

MIT — 隨便用。

## Credits

- 主題源自一次 Claude Design 的 mock-up session（Novel Reader 首頁 + 閱讀器原型）
- 跟 Claude Code 協作開發
