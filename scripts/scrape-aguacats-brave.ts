/**
 * One-shot: scrape Aguacats (@aguacats21) from Brave CDP :9222.
 * Run: npx --yes tsx scripts/scrape-aguacats-brave.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/aguacats');
const SCRAPED = path.join(OUT, 'scraped');
const IG = 'https://www.instagram.com/aguacats21/';

async function download(url: string, file: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120' },
      redirect: 'follow',
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1500) return false;
    fs.writeFileSync(file, buf);
    return true;
  } catch {
    return false;
  }
}

function uniq(urls: string[]): string[] {
  return [...new Set(urls.map(u => u.replace(/&amp;/g, '&')))];
}

function bumpProfile(url: string): string {
  return url.replace(/s150x150/g, 's320x320').replace(/stp=dst-jpg_s150x150/g, 'stp=dst-jpg_s320x320');
}

async function main() {
  fs.mkdirSync(SCRAPED, { recursive: true });
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = context.pages().find(p => p.url().includes('instagram')) ?? context.pages()[0] ?? await context.newPage();

  await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  await page.keyboard.press('Escape').catch(() => {});
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 1800);
    await page.waitForTimeout(700);
  }

  const collected = await page.evaluate(() => {
    const profile: string[] = [];
    const posts: string[] = [];
    const highlights: string[] = [];
    for (const img of Array.from(document.querySelectorAll('img'))) {
      const src = img.currentSrc || img.src || '';
      if (!/cdninstagram|fbcdn|scontent/i.test(src)) continue;
      const alt = (img.alt || '').toLowerCase();
      if (alt.includes('profile picture')) profile.push(src);
      else if (alt.includes('highlight')) highlights.push(src);
      else if (img.naturalWidth >= 200) posts.push(src);
    }
    return { profile, posts, highlights };
  });

  const manifest: { file: string; kind: string; src: string; bytes?: number }[] = [];

  // logo from profile
  for (const raw of uniq(collected.profile).slice(0, 2)) {
    const hi = bumpProfile(raw);
    const file = path.join(OUT, 'logo.jpg');
    const ok = await download(hi, file) || await download(raw, file);
    if (ok) {
      manifest.push({ file: 'logo.jpg', kind: 'logo', src: hi, bytes: fs.statSync(file).size });
      console.log('logo.jpg');
      break;
    }
  }

  let n = 0;
  for (const url of uniq(collected.posts).slice(0, 16)) {
    n += 1;
    const name = `ig_${String(n).padStart(2, '0')}.jpg`;
    const file = path.join(SCRAPED, name);
    const ok = await download(url, file);
    console.log(ok ? `saved ${name}` : `skip ${name}`);
    if (ok) manifest.push({ file: `scraped/${name}`, kind: 'post', src: url, bytes: fs.statSync(file).size });
  }

  let h = 0;
  for (const url of uniq(collected.highlights).slice(0, 6)) {
    h += 1;
    const name = `hl_${String(h).padStart(2, '0')}.jpg`;
    const file = path.join(SCRAPED, name);
    const ok = await download(url, file);
    if (ok) {
      console.log(`saved ${name}`);
      manifest.push({ file: `scraped/${name}`, kind: 'highlight', src: url, bytes: fs.statSync(file).size });
    }
  }

  // hero = largest post
  const posts = manifest.filter(m => m.kind === 'post').sort((a, b) => (b.bytes || 0) - (a.bytes || 0));
  if (posts[0]) {
    const srcFile = path.join(OUT, posts[0].file);
    const hero = path.join(OUT, 'hero.jpg');
    fs.copyFileSync(srcFile, hero);
    console.log(`hero ← ${posts[0].file}`);
  }

  fs.writeFileSync(path.join(SCRAPED, 'ig-manifest.json'), JSON.stringify({
    handle: 'aguacats21',
    brand: 'Aguacats · Refcurcum',
    scrapedAt: new Date().toISOString(),
    files: manifest,
  }, null, 2));

  console.log(`done → ${OUT} (${manifest.length} files)`);
  await browser.close().catch(() => {});
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
