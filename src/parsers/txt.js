// src/parsers/txt.js — TXT novel parser
(function () {
  const CHAPTER_RE = /^[ \t]*第[一二三四五六七八九十百千零〇0-9]+[章回節卷部篇][ \t]*.*$/mu;
  const CHAPTER_RE_GLOBAL = new RegExp(CHAPTER_RE.source, 'gmu');

  function detectAndDecode(buffer) {
    // UTF-8 BOM
    const bytes = new Uint8Array(buffer);
    if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
      return new TextDecoder('utf-8').decode(buffer.slice(3));
    }
    // Try UTF-8 strict
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Try Big5
    try {
      return new TextDecoder('big5', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Try GB18030
    try {
      return new TextDecoder('gb18030', { fatal: true }).decode(buffer);
    } catch (_) {}
    // Last-resort: UTF-8 replacement mode (will produce  but readable)
    return new TextDecoder('utf-8').decode(buffer);
  }

  function guessTitleAuthor(filename, firstLine) {
    // "書名 - 作者.txt" or "【作者】書名.txt"
    const base = filename.replace(/\.[^.]+$/, '');
    let m = base.match(/^(.+?)\s*[-－─]\s*(.+)$/);
    if (m) return { title: m[1].trim(), author: m[2].trim() };
    m = base.match(/^[【\[](.+?)[】\]]\s*(.+)$/);
    if (m) return { title: m[2].trim(), author: m[1].trim() };
    // Fallback to filename + optional first-line hint
    return { title: base, author: null };
  }

  function splitChapters(text) {
    const headings = [];
    let m;
    while ((m = CHAPTER_RE_GLOBAL.exec(text)) !== null) {
      headings.push({ title: m[0].trim(), index: m.index, end: m.index + m[0].length });
    }
    if (headings.length < 2) {
      return [{ id: 'txt-0', title: '正文', text: text.trim() }];
    }
    const chapters = [];
    for (let i = 0; i < headings.length; i++) {
      const start = headings[i].end;
      const stop = i + 1 < headings.length ? headings[i + 1].index : text.length;
      chapters.push({
        id: `txt-${i}`,
        title: headings[i].title,
        text: text.slice(start, stop).trim(),
      });
    }
    return chapters;
  }

  async function parseMetadata(file) {
    const buffer = await file.arrayBuffer();
    const text = detectAndDecode(buffer);
    const { title, author } = guessTitleAuthor(file.name, text.split(/\r?\n/, 1)[0]);
    const chapters = splitChapters(text);
    const chaptersMeta = chapters.map((c) => ({ id: c.id, title: c.title, wordCount: c.text.length }));
    // Retain full chapter text in a parse result (consumed by getChapter).
    return { title, author, coverBlob: null, chaptersMeta, _internal: { chapters } };
  }

  async function getChapter(_file, parsed, chapterId) {
    const chap = parsed._internal.chapters.find((c) => c.id === chapterId);
    if (!chap) throw new Error(`Chapter not found: ${chapterId}`);
    const paragraphs = chap.text.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
    const html = paragraphs.map((p) => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`).join('');
    return { html, extraCss: '', blobUrls: [] };
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  window.txtParser = { parseMetadata, getChapter };
})();
