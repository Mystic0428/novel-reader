// src/parsers/epub.js — JSZip-based EPUB parser
(function () {

  // --- helpers ---
  function parseXML(text) {
    const doc = new DOMParser().parseFromString(text, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('XML parse error');
    return doc;
  }
  function joinPath(base, rel) {
    // base: 'OEBPS/content.opf', rel: 'Text/Chapter1.xhtml'
    // Hrefs starting with '/' are ZIP-root-absolute — ignore baseDir.
    if (rel.startsWith('/')) return rel.slice(1);
    const baseDir = base.includes('/') ? base.slice(0, base.lastIndexOf('/')) : '';
    const parts = (baseDir ? baseDir + '/' + rel : rel).split('/');
    const out = [];
    for (const p of parts) {
      if (p === '' || p === '.') continue;
      if (p === '..') out.pop();
      else out.push(p);
    }
    return out.join('/');
  }
  function firstTextByTag(el, local) {
    const n = el.getElementsByTagName(local);
    return n.length ? (n[0].textContent || '').trim() : null;
  }
  function requireEntry(zip, path) {
    const entry = zip.file(path);
    if (!entry) throw new Error(`EPUB missing required entry: ${path}`);
    return entry;
  }

  async function parseMetadata(fileOrBlob) {
    const zip = await JSZip.loadAsync(fileOrBlob);

    // 1. find OPF via container.xml
    const containerXml = await requireEntry(zip, 'META-INF/container.xml').async('text');
    const containerDoc = parseXML(containerXml);
    const rootfileEl = containerDoc.getElementsByTagName('rootfile')[0];
    if (!rootfileEl) throw new Error('EPUB container.xml has no <rootfile>');
    const opfPath = rootfileEl.getAttribute('full-path');
    if (!opfPath) throw new Error('EPUB <rootfile> missing full-path');
    const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/')) : '';

    // 2. parse OPF
    const opfXml = await requireEntry(zip, opfPath).async('text');
    const opf = parseXML(opfXml);

    // metadata
    const metaEl = opf.getElementsByTagName('metadata')[0];
    const title = firstTextByTag(metaEl, 'dc:title') || firstTextByTag(metaEl, 'title') || 'Untitled';
    const author = firstTextByTag(metaEl, 'dc:creator') || firstTextByTag(metaEl, 'creator');
    const publisher = firstTextByTag(metaEl, 'dc:publisher') || firstTextByTag(metaEl, 'publisher');
    const description = firstTextByTag(metaEl, 'dc:description') || firstTextByTag(metaEl, 'description');

    // manifest: id → {href, mediaType, properties}
    const manifestItems = opf.getElementsByTagName('manifest')[0].getElementsByTagName('item');
    const manifest = {};
    for (const item of manifestItems) {
      manifest[item.getAttribute('id')] = {
        href: item.getAttribute('href'),
        mediaType: item.getAttribute('media-type'),
        properties: item.getAttribute('properties') || '',
      };
    }

    // spine
    const spineItems = opf.getElementsByTagName('spine')[0].getElementsByTagName('itemref');
    const spine = [];
    for (const it of spineItems) {
      const idref = it.getAttribute('idref');
      if (manifest[idref]) spine.push({ idref, href: manifest[idref].href });
    }

    // cover
    let coverBlob = null;
    let coverId = null;
    const metaTags = metaEl.getElementsByTagName('meta');
    for (const m of metaTags) {
      if (m.getAttribute('name') === 'cover') coverId = m.getAttribute('content');
    }
    if (!coverId) {
      for (const [id, item] of Object.entries(manifest)) {
        if ((item.properties || '').includes('cover-image')) { coverId = id; break; }
      }
    }
    if (coverId && manifest[coverId]) {
      const coverPath = joinPath(opfPath, manifest[coverId].href);
      const entry = zip.file(coverPath);
      if (entry) coverBlob = await entry.async('blob');
    }

    // TOC
    const chaptersMeta = await parseTOC(zip, opf, opfPath, manifest, spine);

    return {
      title, author, publisher, description,
      coverBlob,
      chaptersMeta,
      // opaque stuff the chapter-getter needs later:
      _internal: { opfPath, opfDir, manifest, spine, zip: null /* zip not retained; re-open per call */ },
    };
  }

  async function parseTOC(zip, opf, opfPath, manifest, spine) {
    // Prefer EPUB 3 nav
    let navId = null;
    for (const [id, item] of Object.entries(manifest)) {
      if ((item.properties || '').includes('nav')) { navId = id; break; }
    }
    if (navId) {
      const navPath = joinPath(opfPath, manifest[navId].href);
      const navHtml = await requireEntry(zip, navPath).async('text');
      const navDoc = new DOMParser().parseFromString(navHtml, 'text/html');
      const allNavs = Array.from(navDoc.querySelectorAll('nav'));
      const hasTocType = (n) => /\btoc\b/.test(n.getAttribute('epub:type') || n.getAttribute('type') || '');
      const tocNav = allNavs.find(hasTocType) || allNavs[0];
      if (tocNav) {
        const links = tocNav.querySelectorAll('a[href]');
        const items = [];
        for (const a of links) {
          const href = a.getAttribute('href');
          const title = a.textContent.trim();
          const absHref = joinPath(navPath, href.split('#')[0]);
          items.push({ id: `toc-${items.length}`, title, href: absHref });
        }
        if (items.length) return items;
      }
    }

    // Fallback NCX
    const ncxRef = opf.getElementsByTagName('spine')[0].getAttribute('toc');
    if (ncxRef && manifest[ncxRef]) {
      const ncxPath = joinPath(opfPath, manifest[ncxRef].href);
      const ncxXml = await requireEntry(zip, ncxPath).async('text');
      const ncx = parseXML(ncxXml);
      const navPoints = ncx.getElementsByTagName('navPoint');
      const items = [];
      for (const np of navPoints) {
        const labelEl = np.getElementsByTagName('text')[0];
        const contentEl = np.getElementsByTagName('content')[0];
        if (!labelEl || !contentEl) continue;
        const src = contentEl.getAttribute('src');
        if (!src) continue;
        const absHref = joinPath(ncxPath, src.split('#')[0]);
        items.push({ id: `toc-${items.length}`, title: (labelEl.textContent || '').trim(), href: absHref });
      }
      if (items.length) return items;
    }

    // Final fallback: infer from spine
    return spine.map((s, i) => ({
      id: `spine-${i}`,
      title: `Chapter ${i + 1}`,
      href: joinPath(opfPath, s.href),
    }));
  }

  // --- sanitization ---
  const ALLOWED_TAGS = new Set([
    'BODY','P','BR','HR','H1','H2','H3','H4','H5','H6','STRONG','B','EM','I',
    'U','S','SMALL','SUP','SUB','BLOCKQUOTE','UL','OL','LI','DL','DT','DD',
    'IMG','FIGURE','FIGCAPTION','SECTION','ARTICLE','DIV','SPAN','A','TABLE',
    'THEAD','TBODY','TR','TH','TD','PRE','CODE',
  ]);
  const ALLOWED_ATTRS = new Set(['href','src','alt','title','width','height','class','id']);
  const STYLE_ATTR = 'style';
  const URL_ATTRS = new Set(['href','src']);

  function safeUrl(value) {
    if (!value) return '';
    const v = String(value).trim();
    if (/^javascript:/i.test(v)) return '';
    if (/^data:(?!image\/)/i.test(v)) return '';  // allow data:image/*
    return v;
  }

  function sanitizeNode(node, { preserveCss, blobUrlMap, chapterDir }) {
    // remove disallowed element
    if (node.nodeType === 1) {
      const tag = node.tagName;
      if (tag === 'SCRIPT' || tag === 'IFRAME' || tag === 'OBJECT' || tag === 'EMBED') {
        node.remove(); return;
      }
      if (!preserveCss && (tag === 'STYLE' || tag === 'LINK')) { node.remove(); return; }
      if (!ALLOWED_TAGS.has(tag) && tag !== 'STYLE') {
        // Unwrap: move children up, recurse on them so they get sanitized, then drop self.
        // Snapshot children before moving; the parent's outer childNodes iteration already
        // captured the current node, not its grandchildren, so without this recursion
        // grandchildren would escape sanitization entirely (e.g. <svg><script>…</script></svg>).
        const parent = node.parentNode;
        const moved = Array.from(node.childNodes);
        while (node.firstChild) parent.insertBefore(node.firstChild, node);
        parent.removeChild(node);
        for (const child of moved) sanitizeNode(child, { preserveCss, blobUrlMap, chapterDir });
        return;
      }
      // strip unsafe attrs
      for (const attr of Array.from(node.attributes)) {
        const n = attr.name.toLowerCase();
        if (n.startsWith('on')) { node.removeAttribute(attr.name); continue; }
        if (n === STYLE_ATTR) {
          if (!preserveCss) node.removeAttribute(attr.name);
          continue;
        }
        if (!ALLOWED_ATTRS.has(n)) { node.removeAttribute(attr.name); continue; }
        if (URL_ATTRS.has(n)) {
          const v = safeUrl(attr.value);
          if (!v) { node.removeAttribute(attr.name); continue; }
          if (n === 'src' && tag === 'IMG') {
            // rewrite to blob URL if in zip
            const resolved = joinPath(chapterDir + '/_', v);  // +/_ so the helper treats chapterDir as file
            if (blobUrlMap[resolved]) node.setAttribute('src', blobUrlMap[resolved]);
            else node.setAttribute('src', '');
          }
          if (n === 'href' && tag === 'A') {
            if (/^(https?:)?\/\//i.test(v)) {
              node.setAttribute('target', '_blank');
              node.setAttribute('rel', 'noopener noreferrer');
            }
          }
        }
      }
    }
    for (const child of Array.from(node.childNodes)) sanitizeNode(child, { preserveCss, blobUrlMap, chapterDir });
  }

  function scopeCss(cssText, scopeSelector) {
    // naive CSS scoper: prefix every rule selector with scopeSelector.
    // handles single-level @media by recursing inside block.
    function scopeBlock(block) {
      let out = '';
      let i = 0;
      while (i < block.length) {
        // skip whitespace
        while (i < block.length && /\s/.test(block[i])) { out += block[i]; i++; }
        if (i >= block.length) break;
        // @rules
        if (block[i] === '@') {
          const semi = block.indexOf(';', i);
          const brace = block.indexOf('{', i);
          if (semi !== -1 && (brace === -1 || semi < brace)) {
            // Semicolon-terminated @-rule (@import, @charset, @namespace).
            // Strip @import so EPUBs can't pull in external stylesheets past the scope.
            const atRule = block.slice(i, semi + 1);
            if (!/^\s*@import\b/i.test(atRule)) out += atRule;
            i = semi + 1; continue;
          }
          // Brace-terminated @-rule. @media / @supports contain nested rule lists that
          // SHOULD be scoped. @keyframes contains percentage-or-keyword selectors
          // (from/to/50%) that MUST NOT be scoped or the animation breaks.
          const close = matchBrace(block, brace);
          const head = block.slice(i, brace + 1);
          const body = block.slice(brace + 1, close);
          const isKeyframes = /^\s*@(-\w+-)?keyframes\b/i.test(head);
          out += head + (isKeyframes ? body : scopeBlock(body)) + '}';
          i = close + 1; continue;
        }
        const brace = block.indexOf('{', i);
        if (brace === -1) { out += block.slice(i); break; }
        const close = matchBrace(block, brace);
        const selectors = block.slice(i, brace).trim();
        const body = block.slice(brace + 1, close);
        const scoped = selectors.split(',').map((s) => s.trim())
          .filter(Boolean)
          .map((s) => `${scopeSelector} ${s}`)
          .join(', ');
        out += `${scoped} {${body}}`;
        i = close + 1;
      }
      return out;
    }
    function matchBrace(s, start) {
      let depth = 0;
      for (let i = start; i < s.length; i++) {
        if (s[i] === '{') depth++;
        else if (s[i] === '}') { depth--; if (depth === 0) return i; }
      }
      return s.length - 1;
    }
    return scopeBlock(cssText);
  }

  async function getChapter(fileOrBlob, parsed, chapterId, opts = {}) {
    const zip = await JSZip.loadAsync(fileOrBlob);
    const meta = parsed.chaptersMeta.find((c) => c.id === chapterId);
    if (!meta) throw new Error(`Chapter not found: ${chapterId}`);

    const xhtmlRaw = await requireEntry(zip, meta.href).async('text');
    const doc = new DOMParser().parseFromString(xhtmlRaw, 'text/html');
    const body = doc.body || doc.documentElement;

    // build blob URL map for all images referenced in this chapter
    const blobUrlMap = {};
    const chapterDir = meta.href.includes('/') ? meta.href.slice(0, meta.href.lastIndexOf('/')) : '';
    const imgs = body.querySelectorAll('img[src]');
    for (const img of imgs) {
      const src = img.getAttribute('src');
      if (!src || /^(https?:|data:)/i.test(src)) continue;
      const resolved = joinPath(chapterDir + '/_', src);
      const entry = zip.file(resolved);
      if (entry) {
        const blob = await entry.async('blob');
        blobUrlMap[resolved] = URL.createObjectURL(blob);
      }
    }

    // Collect preserveCss content BEFORE sanitization — the sanitizer strips <link> from
    // <body> as a disallowed tag, and standard EPUBs put stylesheet links in <head> which
    // the sanitizer never touches. Gathering here means we see both cases.
    let extraCss = '';
    if (opts.preserveCss) {
      const head = doc.head;
      const linkSelector = 'link[rel="stylesheet"][href]';
      const headLinks = head ? head.querySelectorAll(linkSelector) : [];
      const bodyLinks = body.querySelectorAll(linkSelector);
      for (const l of [...headLinks, ...bodyLinks]) {
        const href = l.getAttribute('href');
        if (!href) continue;
        const resolved = joinPath(chapterDir + '/_', href);
        const entry = zip.file(resolved);
        if (entry) {
          const cssText = await entry.async('text');
          extraCss += scopeCss(cssText, '.nr-reading-scope');
        }
      }
      for (const s of body.querySelectorAll('style')) {
        extraCss += scopeCss(s.textContent || '', '.nr-reading-scope');
      }
    }

    // sanitize
    sanitizeNode(body, {
      preserveCss: !!opts.preserveCss,
      blobUrlMap,
      chapterDir,
    });

    return { html: body.innerHTML, extraCss, blobUrls: Object.values(blobUrlMap) };
  }

  window.epubParser = { parseMetadata, getChapter };
})();
