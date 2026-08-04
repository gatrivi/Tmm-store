/**
 * IG scrape via Brave CDP — grid imgs (IG no longer exposes /p/ hrefs in DOM).
 * Run: npx --yes tsx scripts/scrape-mamabel-ig.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const IG = 'https://www.instagram.com/lastortasdemamamabel/';
const DEST = path.resolve('public/demos/mamabel');

async function download(url: string, file: string): Promise<number> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.instagram.com/' },
      redirect: 'follow',
    });
    if (!res.ok) return 0;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 12_000) return 0;
    fs.writeFileSync(file, buf);
    return buf.length;
  } catch {
    return 0;
  }
}

/** Prefer larger IG CDN variants when hints exist. */
function variants(url: string): string[] {
  const out = [url];
  out.push(url.replace(/stp=[^&]+&?/g, ''));
  out.push(url.replace(/\/s\d+x\d+\//g, '/'));
  out.push(url.replace(/_s\d+x\d+/g, ''));
  return [...new Set(out)];
}

function fingerprint(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname.replace(/\/$/, '');
  } catch {
    return url.split('?')[0];
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  const seenNet = new Map<string, string>(); // fp → url
  page.on('response', async res => {
    try {
      const url = res.url();
      if (!/cdninstagram|fbcdn|scontent/i.test(url)) return;
      if (!/\.(jpg|jpeg|webp|png)/i.test(url.split('?')[0]) && !/stp=dst-jpg|e35|e15/i.test(url)) return;
      const ct = res.headers()['content-type'] || '';
      if (ct && !/image/i.test(ct)) return;
      const fp = fingerprint(url);
      const prev = seenNet.get(fp);
      // keep longer URL (often higher quality params) or first
      if (!prev || url.length > prev.length) seenNet.set(fp, url);
    } catch { /* ignore */ }
  });

  console.log('IG profile…');
  await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.keyboard.press('Escape').catch(() => {});
  for (const label of ['Not Now', 'Ahora no']) {
    const btn = page.getByRole('button', { name: label });
    if (await btn.count()) await btn.first().click().catch(() => {});
  }

  for (let i = 0; i < 14; i++) {
    await page.mouse.wheel(0, 2600);
    await page.waitForTimeout(900);
  }

  type ImgHit = { src: string; w: number; h: number; alt: string };
  const grid = await page.evaluate(() => {
    const out: ImgHit[] = [];
    for (const img of Array.from(document.querySelectorAll('img'))) {
      const src = img.currentSrc || img.src || '';
      if (!/cdninstagram|fbcdn|scontent/i.test(src)) continue;
      const w = img.naturalWidth || 0;
      const h = img.naturalHeight || 0;
      if (w < 400 || h < 400) continue;
      out.push({ src, w, h, alt: (img.alt || '').slice(0, 120) });
    }
    // unique by pathname
    const map = new Map<string, ImgHit>();
    for (const x of out) {
      let key = x.src;
      try { key = new URL(x.src).pathname; } catch { /* */ }
      const prev = map.get(key);
      if (!prev || x.w * x.h > prev.w * prev.h) map.set(key, x);
    }
    return [...map.values()].sort((a, b) => b.w * b.h - a.w * a.h);
  });

  console.log(`grid large imgs: ${grid.length}`);
  console.log(`network image urls: ${seenNet.size}`);

  let n = 0;
  const savedMeta: { file: string; alt: string; size: number }[] = [];

  async function saveUrl(url: string, alt: string, prefix: string) {
    n += 1;
    const file = path.join(OUT, `${prefix}_${String(n).padStart(2, '0')}.jpg`);
    let ok = 0;
    for (const cand of variants(url)) {
      ok = await download(cand, file);
      if (ok) break;
    }
    if (ok) {
      console.log(`saved ${path.basename(file)} (${ok}b) ${(alt || '').slice(0, 50)}`);
      savedMeta.push({ file: path.basename(file), alt, size: ok });
    } else {
      console.log(`skip ${prefix} ${n}`);
    }
  }

  for (const hit of grid.slice(0, 36)) {
    await saveUrl(hit.src, hit.alt, 'ig');
  }

  // also dump high-value network captures not already saved
  const gridFps = new Set(grid.map(g => fingerprint(g.src)));
  let extra = 0;
  for (const url of seenNet.values()) {
    if (gridFps.has(fingerprint(url))) continue;
    // prefer square-ish large photos
    extra += 1;
    if (extra > 24) break;
    await saveUrl(url, 'network', 'ign');
  }

  // Click first ~12 grid cells to open lightbox / post for hi-res
  console.log('open posts via grid clicks…');
  const cells = page.locator('article a, main a').filter({ has: page.locator('img') });
  const cellCount = Math.min(await cells.count(), 14);
  for (let i = 0; i < cellCount; i++) {
    try {
      await cells.nth(i).click({ timeout: 4000 });
      await page.waitForTimeout(2200);
      const src = await page.evaluate(() => {
        let best: { src: string; area: number } | null = null;
        for (const img of Array.from(document.querySelectorAll('img'))) {
          const s = img.currentSrc || img.src || '';
          if (!/cdninstagram|fbcdn|scontent/i.test(s)) continue;
          const area = (img.naturalWidth || 0) * (img.naturalHeight || 0);
          if (area < 400 * 400) continue;
          if (!best || area > best.area) best = { src: s, area };
        }
        return best?.src ?? null;
      });
      if (src) await saveUrl(src, 'post', 'igp');
      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(600);
    } catch (e) {
      console.log(`click ${i}: ${(e as Error).message.slice(0, 80)}`);
      await page.keyboard.press('Escape').catch(() => {});
    }
  }

  // copy top cakes into public/demos/mamabel for wiring
  const allIg = fs.readdirSync(OUT)
    .filter(f => /^ig(p|n)?_\d+\.jpg$/i.test(f))
    .map(f => ({ f, size: fs.statSync(path.join(OUT, f)).size }))
    .sort((a, b) => b.size - a.size);

  console.log('top IG files:');
  for (const x of allIg.slice(0, 15)) console.log(`  ${x.size}\t${x.f}`);

  // promote unique largest (skip identical byte-size dups)
  const promoted: string[] = [];
  const seenSizes = new Set<number>();
  for (const x of allIg) {
    if (seenSizes.has(x.size)) continue;
    seenSizes.add(x.size);
    const name = `ig-${String(promoted.length + 1).padStart(2, '0')}.jpg`;
    fs.copyFileSync(path.join(OUT, x.f), path.join(DEST, name));
    promoted.push(name);
    console.log(`promoted ${x.f} → ${name}`);
    if (promoted.length >= 15) break;
  }

  fs.writeFileSync(
    path.join(OUT, 'ig-manifest.json'),
    JSON.stringify({ at: new Date().toISOString(), savedMeta, promoted, top: allIg.slice(0, 20) }, null, 2),
  );

  console.log(`done ig files=${allIg.length} promoted=${promoted.length}`);
  await page.close().catch(() => {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
