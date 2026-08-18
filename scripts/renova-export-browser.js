/*
 * Renová Tu Vestidor catalog exporter.
 *
 * Run this ON the seller's public vestidor page in the browser DevTools console.
 * It uses the already-authorized browser session, so Cloudflare/CORS do not require
 * credentials or API keys. It auto-scrolls, discovers product URLs, fetches each
 * same-origin product page, and downloads a JSON export.
 */
(async () => {
  const SELLER_ID = '1482248';
  const EXPORT_NAME = 'renova-vintagedealers.json';
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const clean = (value = '') => value.replace(/\s+/g, ' ').trim();
  const meta = (doc, selector, attr = 'content') => clean(doc.querySelector(selector)?.getAttribute(attr) || '');
  const uniq = (values) => [...new Set(values.filter(Boolean))];

  async function revealAllProducts() {
    let lastCount = -1;
    let stableRounds = 0;

    while (stableRounds < 4) {
      const count = document.querySelectorAll('a[href*="/producto/"]').length;
      stableRounds = count === lastCount ? stableRounds + 1 : 0;
      lastCount = count;
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      await sleep(900);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
    return lastCount;
  }

  function parseJsonLd(doc) {
    const entries = [];
    for (const node of doc.querySelectorAll('script[type="application/ld+json"]')) {
      try {
        const parsed = JSON.parse(node.textContent || 'null');
        if (Array.isArray(parsed)) entries.push(...parsed);
        else if (parsed?.['@graph']) entries.push(...parsed['@graph']);
        else if (parsed) entries.push(parsed);
      } catch {
        // Some pages contain malformed analytics JSON. Ignore it.
      }
    }
    return entries;
  }

  function extractPrice(doc, jsonLd) {
    const product = jsonLd.find((entry) => entry?.['@type'] === 'Product');
    const offer = Array.isArray(product?.offers) ? product.offers[0] : product?.offers;
    const structured = Number(offer?.price ?? product?.offers?.lowPrice);
    if (Number.isFinite(structured) && structured > 0) return structured;

    const text = clean(doc.body?.innerText || '');
    const matches = [...text.matchAll(/\$\s*([\d.]+(?:,\d{1,2})?)/g)]
      .map((match) => Number(match[1].replace(/\./g, '').replace(',', '.')))
      .filter((price) => Number.isFinite(price) && price > 0);
    return matches[0] || null;
  }

  function extractImages(doc, jsonLd) {
    const product = jsonLd.find((entry) => entry?.['@type'] === 'Product');
    const structured = Array.isArray(product?.image) ? product.image : [product?.image];
    const og = [meta(doc, 'meta[property="og:image"]')];
    const dom = [...doc.querySelectorAll('img')]
      .flatMap((img) => [img.currentSrc, img.src, img.getAttribute('data-src')])
      .filter((src) => src && !src.startsWith('data:'));

    return uniq([...structured, ...og, ...dom])
      .map((src) => {
        try { return new URL(src, location.origin).href; } catch { return ''; }
      })
      .filter((src) => src.startsWith('http'));
  }

  function extractProduct(html, sourceUrl) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const jsonLd = parseJsonLd(doc);
    const productLd = jsonLd.find((entry) => entry?.['@type'] === 'Product') || {};
    const rawTitle = productLd.name
      || meta(doc, 'meta[property="og:title"]')
      || clean(doc.querySelector('h1')?.textContent || '')
      || clean(doc.title);
    const name = clean(rawTitle.replace(/\s*[|–-]\s*Renova Tu Vestidor.*$/i, ''));
    const description = clean(
      productLd.description
      || meta(doc, 'meta[name="description"]')
      || meta(doc, 'meta[property="og:description"]')
    );
    const rawText = clean(doc.body?.innerText || '').slice(0, 16000);
    const externalId = sourceUrl.match(/\/(\d+)(?:\?|$)/)?.[1] || '';

    return {
      externalId,
      sourceUrl,
      name,
      description,
      price: extractPrice(doc, jsonLd),
      currency: 'ARS',
      images: extractImages(doc, jsonLd),
      rawText,
    };
  }

  console.info('[Renová export] Buscando productos…');
  await revealAllProducts();

  const productUrls = uniq(
    [...document.querySelectorAll('a[href*="/producto/"]')]
      .map((anchor) => anchor.href)
      .filter((href) => href.includes('/producto/'))
  );

  if (!productUrls.length) {
    throw new Error('No encontré links /producto/. Probá abrir el vestidor, esperar a que cargue y volver a ejecutar.');
  }

  const products = [];
  for (let index = 0; index < productUrls.length; index += 1) {
    const sourceUrl = productUrls[index];
    console.info(`[Renová export] ${index + 1}/${productUrls.length}`, sourceUrl);
    try {
      const response = await fetch(sourceUrl, { credentials: 'include' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      products.push(extractProduct(await response.text(), sourceUrl));
    } catch (error) {
      products.push({ sourceUrl, error: String(error) });
    }
    await sleep(120);
  }

  const profileText = clean(document.body?.innerText || '');
  const payload = {
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    sourceProfileUrl: location.href,
    sellerId: SELLER_ID,
    profile: {
      title: clean(document.querySelector('h1')?.textContent || document.title),
      description: meta(document, 'meta[name="description"]') || profileText.slice(0, 2500),
    },
    products,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = EXPORT_NAME;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  const failed = products.filter((product) => product.error).length;
  console.info(`[Renová export] Listo: ${products.length - failed}/${products.length} productos. Archivo: ${EXPORT_NAME}`);
})();
