/**
 * Rank IG posts by likes (Brave CDP) + download top media.
 * Run: npx --yes tsx scripts/scrape-mamabel-ig-ranked.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const DEST = path.resolve('public/demos/mamabel');
const IG = 'https://www.instagram.com/lastortasdemamamabel/';

async function download(url: string, file: string): Promise<number> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', Referer: 'https://www.instagram.com/' },
      redirect: 'follow',
    });
    if (!res.ok) return 0;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8_000) return 0;
    fs.writeFileSync(file, buf);
    return buf.length;
  } catch {
    return 0;
  }
}

function parseCount(raw: string): number {
  const t = raw.trim().toLowerCase().replace(/\./g, '').replace(/,/g, '');
  const m = t.match(/([\d.]+)\s*([km])?/);
  if (!m) return 0;
  let n = parseFloat(m[1]);
  if (m[2] === 'k') n *= 1000;
  if (m[2] === 'm') n *= 1_000_000;
  return Math.round(n);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  console.log('IG profile…');
  await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.keyboard.press('Escape').catch(() => {});
  for (const label of ['Not Now', 'Ahora no']) {
    const btn = page.getByRole('button', { name: label });
    if (await btn.count()) await btn.first().click().catch(() => {});
  }

  // scroll to load grid
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 2400);
    await page.waitForTimeout(700);
  }

  // Collect grid cell locators — article imgs that look like posts
  const cells = page.locator('main a').filter({ has: page.locator('img') });
  const n = Math.min(await cells.count(), 36);
  console.log(`grid cells: ${n}`);

  type Ranked = { likes: number; comments: number; alt: string; src: string; i: number };
  const ranked: Ranked[] = [];

  for (let i = 0; i < n; i++) {
    try {
      await cells.nth(i).scrollIntoViewIfNeeded().catch(() => {});
      await cells.nth(i).hover({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(450);

      // IG shows likes/comments overlay on hover
      const stats = await page.evaluate(() => {
        const texts = Array.from(document.querySelectorAll('ul li span, span'))
          .map(el => (el.textContent || '').trim())
          .filter(Boolean);
        // look for nearby visible overlay numbers
        const overlay = document.querySelector('[role="presentation"], article');
        void overlay;
        return texts.slice(0, 80);
      });

      // click open post for reliable like count
      await cells.nth(i).click({ timeout: 4000 });
      await page.waitForTimeout(2200);

      const detail = await page.evaluate(() => {
        const body = document.body?.innerText || '';
        // common: "123 likes" / "123 Me gusta" / section with aria
        const likeMatch =
          body.match(/([\d.,]+[KkMm]?)\s*(likes|me gusta|like)/i)
          || body.match(/Me gusta\s*([\d.,]+[KkMm]?)/i);
        const commentMatch = body.match(/([\d.,]+[KkMm]?)\s*(comments|comentarios)/i);
        let best: { src: string; area: number; alt: string } | null = null;
        for (const img of Array.from(document.querySelectorAll('article img, img'))) {
          const s = img.currentSrc || img.src || '';
          if (!/cdninstagram|fbcdn|scontent/i.test(s)) continue;
          const area = (img.naturalWidth || 0) * (img.naturalHeight || 0);
          if (area < 200 * 200) continue;
          if (!best || area > best.area) {
            best = { src: s, area, alt: (img.alt || '').slice(0, 160) };
          }
        }
        // aria labels on buttons
        const ariaLikes = Array.from(document.querySelectorAll('[aria-label]'))
          .map(el => el.getAttribute('aria-label') || '')
          .find(a => /like|gusta/i.test(a));
        return {
          likeRaw: likeMatch?.[1] || ariaLikes || '',
          commentRaw: commentMatch?.[1] || '',
          src: best?.src || null,
          alt: best?.alt || '',
          snippet: body.slice(0, 400),
        };
      });

      const likes = parseCount(detail.likeRaw);
      const comments = parseCount(detail.commentRaw);
      console.log(`#${i + 1} likes=${likes} comments=${comments} raw=${JSON.stringify(detail.likeRaw)} alt=${detail.alt.slice(0, 40)}`);
      if (detail.src) {
        ranked.push({ likes, comments, alt: detail.alt, src: detail.src, i });
      }

      await page.keyboard.press('Escape').catch(() => {});
      await page.waitForTimeout(500);
      // if still on post, go back
      if (!page.url().includes('/lastortasdemamamabel/?') && page.url() !== IG) {
        await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
        await page.waitForTimeout(2000);
        for (let s = 0; s < Math.min(i, 6); s++) {
          await page.mouse.wheel(0, 1800);
          await page.waitForTimeout(400);
        }
      }
      void stats;
    } catch (e) {
      console.log(`err ${i}: ${(e as Error).message.slice(0, 100)}`);
      await page.keyboard.press('Escape').catch(() => {});
    }
  }

  ranked.sort((a, b) => b.likes - a.likes || b.comments - a.comments);
  console.log('\nTOP by likes:');
  for (const r of ranked.slice(0, 15)) {
    console.log(`  ${r.likes}\t${r.alt.slice(0, 60)}`);
  }

  const manifest = { at: new Date().toISOString(), ranked };
  fs.writeFileSync(path.join(OUT, 'ig-ranked.json'), JSON.stringify(manifest, null, 2));

  // download top 20 unique by src pathname
  const seen = new Set<string>();
  let nSaved = 0;
  for (const r of ranked) {
    let key = r.src;
    try { key = new URL(r.src).pathname; } catch { /* */ }
    if (seen.has(key)) continue;
    seen.add(key);
    nSaved += 1;
    const file = path.join(OUT, `rank_${String(nSaved).padStart(2, '0')}.jpg`);
    const ok = await download(r.src, file);
    console.log(ok ? `saved ${path.basename(file)} likes=${r.likes} (${ok}b)` : `fail rank ${nSaved}`);
    if (nSaved >= 20) break;
  }

  // also copy top 12 to DEST as rank-01…
  for (let i = 1; i <= Math.min(12, nSaved); i++) {
    const src = path.join(OUT, `rank_${String(i).padStart(2, '0')}.jpg`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(DEST, `rank-${String(i).padStart(2, '0')}.jpg`));
    }
  }

  console.log(`done ranked=${ranked.length} saved=${nSaved}`);
  await page.close().catch(() => {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
