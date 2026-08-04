/**
 * Full-res scrape via Brave CDP (logged-in session).
 * Run: npx --yes tsx scripts/scrape-mamabel-brave-hires.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium, type Page } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const FB = 'https://www.facebook.com/lastortasdemamamabel/photos';

async function download(url: string, file: string): Promise<number> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'follow' });
    if (!res.ok) return 0;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) return 0;
    fs.writeFileSync(file, buf);
    return buf.length;
  } catch {
    return 0;
  }
}

/** Bump FB CDN quality hints when present. */
function upscaleCandidate(url: string): string[] {
  const variants = [url];
  variants.push(url.replace(/\/[sp]\d+x\d+\//g, '/'));
  variants.push(url.replace(/_[sp]\./g, '_n.').replace(/_[sp]\d+\./g, '_n.'));
  variants.push(url.replace(/stp=.*?(?=&|$)/, ''));
  return [...new Set(variants)];
}

async function collectPhotoHrefs(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const hrefs: string[] = [];
    for (const a of Array.from(document.querySelectorAll('a[href*="photo"]'))) {
      const href = (a as HTMLAnchorElement).href;
      if (/fbid=|\/photo\/|photo\.php/.test(href)) hrefs.push(href.split('#')[0]);
    }
    return [...new Set(hrefs)];
  });
}

async function largestImgOnPage(page: Page): Promise<string | null> {
  return page.evaluate(() => {
    let best: { src: string; area: number } | null = null;
    for (const img of Array.from(document.querySelectorAll('img'))) {
      const src = img.currentSrc || img.src || '';
      if (!/scontent|fbcdn/i.test(src)) continue;
      const area = (img.naturalWidth || 0) * (img.naturalHeight || 0);
      if (!best || area > best.area) best = { src, area };
    }
    return best?.src ?? null;
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  console.log('open FB photos');
  await page.goto(FB, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.keyboard.press('Escape').catch(() => {});

  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 2200);
    await page.waitForTimeout(700);
  }

  const hrefs = (await collectPhotoHrefs(page)).slice(0, 24);
  console.log(`photo links: ${hrefs.length}`);

  let saved = 0;
  for (let i = 0; i < hrefs.length; i++) {
    const href = hrefs[i];
    try {
      await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.keyboard.press('Escape').catch(() => {});
      const src = await largestImgOnPage(page);
      if (!src) {
        console.log(`no img ${i + 1}`);
        continue;
      }
      let ok = 0;
      let used = src;
      for (const cand of upscaleCandidate(src)) {
        const file = path.join(OUT, `hi_${String(i + 1).padStart(2, '0')}.jpg`);
        ok = await download(cand, file);
        if (ok) {
          used = cand;
          console.log(`saved hi_${String(i + 1).padStart(2, '0')}.jpg (${ok}b)`);
          saved += 1;
          break;
        }
      }
      if (!ok) console.log(`fail ${i + 1} ${used.slice(0, 80)}`);
    } catch (e) {
      console.log(`err ${i + 1}: ${(e as Error).message}`);
    }
  }

  // IG grid
  console.log('IG…');
  const ig = await context.newPage();
  await ig.goto('https://www.instagram.com/lastortasdemamamabel/', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await ig.waitForTimeout(5000);
  await ig.keyboard.press('Escape').catch(() => {});
  for (let i = 0; i < 8; i++) {
    await ig.mouse.wheel(0, 2400);
    await ig.waitForTimeout(800);
  }
  const igPosts = await ig.evaluate(() =>
    [...new Set(
      Array.from(document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]'))
        .map(a => (a as HTMLAnchorElement).href)
        .filter(h => /instagram\.com\/(p|reel)\//.test(h)),
    )].slice(0, 20),
  );
  console.log(`ig posts: ${igPosts.length}`);

  for (let i = 0; i < igPosts.length; i++) {
    try {
      await ig.goto(igPosts[i], { waitUntil: 'domcontentloaded', timeout: 45000 });
      await ig.waitForTimeout(2500);
      const src = await ig.evaluate(() => {
        let best: { src: string; area: number } | null = null;
        for (const img of Array.from(document.querySelectorAll('article img, img'))) {
          const s = img.currentSrc || img.src || '';
          if (!/cdninstagram|fbcdn|scontent/i.test(s)) continue;
          const area = (img.naturalWidth || 0) * (img.naturalHeight || 0);
          if (!best || area > best.area) best = { src: s, area };
        }
        return best?.src ?? null;
      });
      if (!src) continue;
      const file = path.join(OUT, `ig_${String(i + 1).padStart(2, '0')}.jpg`);
      const ok = await download(src, file);
      console.log(ok ? `saved ${path.basename(file)} (${ok}b)` : `skip ig ${i + 1}`);
      if (ok) saved += 1;
    } catch (e) {
      console.log(`ig err ${i + 1}: ${(e as Error).message}`);
    }
  }

  const files = fs.readdirSync(OUT)
    .map(f => ({ f, size: fs.statSync(path.join(OUT, f)).size }))
    .sort((a, b) => b.size - a.size);
  console.log('top:');
  for (const x of files.slice(0, 12)) console.log(`  ${x.size}\t${x.f}`);
  console.log(`done saved≈${saved} files=${files.length}`);

  await page.close().catch(() => {});
  await ig.close().catch(() => {});
  await browser.close().catch(() => {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
