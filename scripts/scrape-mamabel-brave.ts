/**
 * One-shot: scrape Mama Mabel assets from Brave (already logged in via CDP :9222).
 * Run: npx --yes tsx scripts/scrape-mamabel-brave.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const FB_PHOTOS = 'https://www.facebook.com/lastortasdemamamabel/photos';
const IG = 'https://www.instagram.com/lastortasdemamamabel/';

async function download(url: string, file: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      redirect: 'follow',
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) return false;
    fs.writeFileSync(file, buf);
    return true;
  } catch {
    return false;
  }
}

function uniq(urls: string[]): string[] {
  return [...new Set(urls.map(u => u.replace(/&amp;/g, '&')))];
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = context.pages()[0] ?? await context.newPage();

  console.log('FB photos…');
  await page.goto(FB_PHOTOS, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  // dismiss login/cookie if any
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(1000);

  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(800);
  }

  const fbUrls = await page.evaluate(() => {
    const out: string[] = [];
    for (const img of Array.from(document.querySelectorAll('img'))) {
      const src = img.currentSrc || img.src || '';
      if (/scontent|fbcdn|instagram/i.test(src) && img.naturalWidth >= 120) out.push(src);
    }
    // also og / background
    for (const el of Array.from(document.querySelectorAll('[style*="background"]'))) {
      const m = String((el as HTMLElement).style.backgroundImage || '').match(/url\("?(https:[^"]+)"?\)/);
      if (m?.[1] && /scontent|fbcdn/i.test(m[1])) out.push(m[1]);
    }
    return out;
  });

  let n = 0;
  for (const url of uniq(fbUrls).slice(0, 40)) {
    n += 1;
    const file = path.join(OUT, `fb_${String(n).padStart(2, '0')}.jpg`);
    const ok = await download(url, file);
    console.log(ok ? `saved ${path.basename(file)}` : `skip fb ${n}`);
  }

  console.log('IG profile…');
  await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  await page.keyboard.press('Escape').catch(() => {});
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(900);
  }

  const igUrls = await page.evaluate(() => {
    const out: string[] = [];
    for (const img of Array.from(document.querySelectorAll('img'))) {
      const src = img.currentSrc || img.src || '';
      if (/cdninstagram|fbcdn|scontent/i.test(src) && img.naturalWidth >= 150) out.push(src);
    }
    return out;
  });

  let m = 0;
  for (const url of uniq(igUrls).slice(0, 40)) {
    m += 1;
    const file = path.join(OUT, `ig_${String(m).padStart(2, '0')}.jpg`);
    const ok = await download(url, file);
    console.log(ok ? `saved ${path.basename(file)}` : `skip ig ${m}`);
  }

  // cover / profile candidates: largest files
  const files = fs.readdirSync(OUT).map(f => {
    const p = path.join(OUT, f);
    return { f, p, size: fs.statSync(p).size };
  }).sort((a, b) => b.size - a.size);

  console.log('top files:');
  for (const x of files.slice(0, 10)) console.log(`  ${x.size}\t${x.f}`);
  console.log(`total scraped: ${files.length} → ${OUT}`);

  // do not close Brave
  await browser.close().catch(() => {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
