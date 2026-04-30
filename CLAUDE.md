# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Run / Test / Lint

- **Run**: `start.bat` (Windows) or `./start.sh` (macOS / Linux). Both launch `python -m http.server 8080` in the project folder and open `http://localhost:8080/novel-reader.html`.
- **No build step** — JSX is compiled by Babel Standalone in the browser. Edit a file, refresh the page.
- **No test runner**, **no linter**, **no package.json**. There is nothing to install.
- **Hard-refresh** with `Ctrl+Shift+R` (or DevTools → Network → "Disable cache") if a JSX edit doesn't show — browsers cache the source files aggressively. Babel Standalone doesn't bust HTTP cache.

## Architecture (the non-obvious bits)

### Zero-build, window-global module style
Every file under `src/` is loaded as an individual `<script type="text/babel">` in `novel-reader.html`. There is no module system. Components and helpers must attach themselves to `window` to be reachable by other files (e.g. `window.V37Reader = V37Reader`, `window.idb = { ... }`, `window.booksStore = { ... }`).

The file load order in `novel-reader.html` matters: `storage → parsers → ui → themes → library → manage → reader → app`. A file may use any global declared *earlier in HTML order* by render time — function declarations are hoisted within a script but not across scripts. `manage.jsx` is loaded after `library.jsx` because it reuses `bookProgress`, `relTime`, `sortBooks`, `openBook` etc. that `library.jsx` declares (and `library.jsx` attaches to `window` for cross-file use).

### React state shape
Single `AppContext` in `src/app.jsx`, hydrated once on mount from IndexedDB. The context exposes `{ state, dispatch, chapterCacheRef }`. `state` holds `{ view, activeBookId, settings, books, roots, ready }`. `view` is one of `'library'` (Netflix-style home), `'manage'` (藏書閣 — Rune-Stone-themed dashboard for finding/sorting/bulk-managing books, in `src/manage.jsx`), or `'reader'` — there is no router; the App renders one of three based on `view`.

`chapterCacheRef` is a Map kept across the session (cleared on book switch) so revisiting a chapter doesn't re-parse the EPUB. `parsedRef` (per-Reader-mount) holds the parsed EPUB metadata so prefetch and chapter switches don't re-parse the OPF.

### Theme system (the largest surface)
~120 themes (numbered up to v121) in `src/themes/v{N}-{name}.jsx`. Each exports a `V{N}Reader` and `V{N}Footer` component on `window`. The reader's `renderThemeContent` and `renderThemeFooter` switch on `settings.activeTheme` and dispatch to the right pair.

**Reader component prop contract** (all themes must accept these):
```
{ book, chapterTitle, chapterIdx, html, settings, scrollRef, onScroll,
  onPrev, onNext, canPrev, canNext }
```

**To add a new theme** you must touch six places:
1. `src/themes/vN-name.jsx` — define `VNReader` + `VNFooter` on `window`
2. `novel-reader.html` — add `<script>` tag, after existing themes, before `library.jsx`
3. `src/reader.jsx` — `case 'vN':` in **both** `renderThemeContent` and `renderThemeFooter`
4. `src/storage/settings.js` — `themeColors.vN: { accent, bgTone }` default
5. `src/ui/color-picker.jsx` — `vN: { accentPresets, tonePresets, toneKey }`
6. `src/ui/theme-switcher.jsx` — entry in the `themes` array (set `group` to one of the 17 existing groups in the `groups` array, or append a new group string)

**Theme conventions to respect**:
- `book.preserveOriginalCss` — when `true`, skip your inline typography on `.reading-body`; the reader's injected `<style>` block is also skipped so EPUB-embedded CSS wins.
- Use the global `stripChapterPrefix(title)` helper to clean prefixes like `第N章：` / `001.` / `01-`.
- Use the global `injectDropCap(html, size)` helper if you want a drop cap — it auto-skips CJK characters (CJK glyphs look broken when resized inline).
- Set `--accent: ${accent}` as a CSS var on your reading-body wrapper so child rules can inherit it.
- Each theme has 9 bg-tone variants in a local `V{N}_BG_TONES` map keyed by `bgTone`. Color-picker writes the chosen key into `settings.themeColors.vN.bgTone`.

### IndexedDB schema (DB version 3)
`src/storage/idb.js` is a thin wrapper. Stores defined in `STORE_CONFIG`:
- `books`, `roots`, `settings`, `kv` — keyPath `'id'`
- `readingEvents` — autoIncrement, indexes `byDate` and `byBook`. Append-only event log driving the stats panel. Logged from `openChapter` in `reader.jsx`. **Idempotent per `(bookId, chapterId, date)`** — re-opening the same chapter mid-day doesn't inflate counts.

`settingsStore.save(patch)` uses `mergeDeep` — patch keys overlay defaults. Arrays replace, primitives replace, plain objects merge recursively. Single row keyed `'global'`.

### Inter-component communication shortcut
`src/library.jsx` mounts `window.openBookCard = (book) => setCardBookId(book.id)` so `BookMenu` instances rendered deep inside `RowCard`s can trigger the detail card without prop-drilling through `Library → BookRow → RowCard → BookMenu`. Pragmatic for this self-use single-context tool. `src/manage.jsx` does the same when it's the active view (Library is unmounted during 'manage', so each view owns the global while mounted).

`src/library.jsx` also attaches `bookProgress`, `relTime`, `sortBooks`, `newChapterCount` to `window` for use by `manage.jsx` (and other future views). `sortBooks` supports `sortBy` keys `lastRead | addedAt | title | author | progress | wordCount`; `title`/`author` use `localeCompare(_, 'zh-Hant', { numeric: true })` so Chinese titles sort by pinyin instead of raw Unicode.

### File System Access API + Chrome
Folder scanning relies on `showDirectoryPicker` (Chromium-only). `roots` store keeps `dirHandle` instances; permission must be re-prompted on every page load via `rootsStore.ensurePermission`. Library auto-scans permitted roots on mount; non-permitted ones are silently skipped.

Per-root `excludeDirs` (e.g. `['ko', 'raw']`) filter out subfolders during scan — useful when the underlying scraper output mixes raw + translated copies.

### EPUB re-parse on open
Every time a book is opened, `epubParser.parseMetadata` runs against the live file. This means new chapters appended to an EPUB on disk show up immediately. `lastKnownChapterCount` snapshots what the user has acknowledged — the diff drives the `+N` badge in the library.

### Chinese reader focus
Built primarily for reading zh-TW web-novel EPUBs. Defaults reflect that:
- Heavy use of CJK serif fonts (Noto Serif TC, Songti TC)
- `stripChapterPrefix` regex covers `第十二章：` / `第N回` / `第N話` patterns
- `txtParser` detects CJK chapter markers
- Library default browse mode is dark (Netflix-style), not light

When designing visuals, assume primary content is **vertical Chinese serif text in long flowing paragraphs**, not English columns or short-form web copy.

## Windows-specific gotchas

- **`python -m http.server` + git checkout = stale handles**: rapidly switching branches while the browser is open can leave Python's http.server holding stale file descriptors. The page appears to hang or load partial content; refreshing doesn't help. Fix: restart the python process. If `git checkout` fails with `unable to unlink` because the browser locked a file, write the file content via `node -e "fs.writeFileSync(...)"` to bypass the unlink.
- **Babel Standalone scaling**: at ~95+ separate `<script type="text/babel">` tags in the HTML, the browser handles it fine on its own — the issue described above is *server*-side, not Babel.
