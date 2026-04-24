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
    const baseDir = base.includes('/') ? base.slice(0, base.lastIndexOf('/')) : '';
    if (!baseDir) return rel.replace(/^\//, '');
    const parts = (baseDir + '/' + rel).split('/');
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

  async function parseMetadata(fileOrBlob) {
    const zip = await JSZip.loadAsync(fileOrBlob);

    // 1. find OPF via container.xml
    const containerXml = await zip.file('META-INF/container.xml').async('text');
    const containerDoc = parseXML(containerXml);
    const opfPath = containerDoc.getElementsByTagName('rootfile')[0].getAttribute('full-path');
    const opfDir = opfPath.includes('/') ? opfPath.slice(0, opfPath.lastIndexOf('/')) : '';

    // 2. parse OPF
    const opfXml = await zip.file(opfPath).async('text');
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
      const navHtml = await zip.file(navPath).async('text');
      const navDoc = new DOMParser().parseFromString(navHtml, 'text/html');
      const tocNav = navDoc.querySelector('nav[*|type="toc"], nav[epub\\:type="toc"], nav[type="toc"], nav');
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
      const ncxXml = await zip.file(ncxPath).async('text');
      const ncx = parseXML(ncxXml);
      const navPoints = ncx.getElementsByTagName('navPoint');
      const items = [];
      for (const np of navPoints) {
        const labelEl = np.getElementsByTagName('text')[0];
        const contentEl = np.getElementsByTagName('content')[0];
        if (!labelEl || !contentEl) continue;
        const absHref = joinPath(ncxPath, contentEl.getAttribute('src').split('#')[0]);
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

  window.epubParser = { parseMetadata };
})();
