/**
 * Capture FBCDN images from network while scrolling logged-in Brave.
 * Run: npx --yes tsx scripts/scrape-mamabel-network.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const seen = new Set<string>();

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  page.on('response', async (res) => {
    try {
      const url = res.url();
      if (!/scontent|fbcdn|cdninstagram/i.test(url)) return;
      if (!/\.(jpg|jpeg|png|webp)/i.test(url.split('?')[0]) && !/stp=/.test(url)) return;
      const key = url.split('?')[0];
      if (seen.has(key)) return;
      const buf = await res.body().catch(() => null);
      if (!buf || buf.length < 40000) return; // skip thumbs
      seen.add(key);
      const n = seen.size;
      const ext = url.includes('.png') ? 'png' : 'jpg';
      const file = path.join(OUT, `net_${String(n).padStart(2, '0')}.${ext}`);
      fs.writeFileSync(file, buf);
      console.log(`net ${n}: ${buf.length}b`);
    } catch { /* ignore */ }
  });

  for (const url of [
    'https://www.facebook.com/lastortasdemamamabel/photos',
    'https://www.instagram.com/lastortasdemamamabel/',
  ]) {
    console.log('goto', url);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(4000);
    await page.keyboard.press('Escape').catch(() => {});
    for (let i = 0; i < 15; i++) {
      await page.mouse.wheel(0, 2400);
      await page.waitForTimeout(900);
    }
    // click first few visible photos/posts
    const links = await page.$$eval(
      'a[href*="photo"], a[href*="/p/"], a[href*="/reel/"]',
      as => [...new Set(as.map(a => (a as HTMLAnchorElement).href))].slice(0, 12),
    ).catch(() => [] as string[]);
    for (const href of links) {
      await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(2000);
      await page.keyboard.press('Escape').catch(() => {});
    }
  }

  const files = fs.readdirSync(OUT)
    .filter(f => f.startsWith('net_'))
    .map(f => ({ f, size: fs.statSync(path.join(OUT, f)).size }))
    .sort((a, b) => b.size - a.size);
  console.log('net files:', files.length);
  for (const x of files.slice(0, 15)) console.log(`  ${x.size}\t${x.f}`);

  await page.close().catch(() => {});
  await browser.close().catch(() => {});
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
