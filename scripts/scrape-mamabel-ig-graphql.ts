/**
 * Rank IG media by like_count via GraphQL network sniff (Brave CDP logged-in).
 * Run: npx --yes tsx scripts/scrape-mamabel-ig-graphql.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const OUT = path.resolve('public/demos/mamabel/scraped');
const DEST = path.resolve('public/demos/mamabel');
const IG = 'https://www.instagram.com/lastortasdemamamabel/';

type Media = {
  id: string;
  likes: number;
  comments: number;
  thumb: string;
  display?: string;
  caption?: string;
  shortcode?: string;
};

function walk(obj: unknown, out: Media[]) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) {
    for (const x of obj) walk(x, out);
    return;
  }
  const o = obj as Record<string, unknown>;
  const likes =
    (o.like_count as number | undefined)
    ?? (o.edge_liked_by as { count?: number } | undefined)?.count
    ?? (o.edge_media_preview_like as { count?: number } | undefined)?.count;
  const id = String(o.id || o.pk || '');
  const thumb = String(
    o.display_url
    || o.thumbnail_src
    || (o.image_versions2 as { candidates?: { url: string }[] } | undefined)?.candidates?.[0]?.url
    || '',
  );
  if (id && typeof likes === 'number' && thumb && /cdninstagram|fbcdn|scontent/i.test(thumb)) {
    out.push({
      id,
      likes,
      comments:
        (o.comment_count as number | undefined)
        ?? (o.edge_media_to_comment as { count?: number } | undefined)?.count
        ?? 0,
      thumb,
      display: typeof o.display_url === 'string' ? o.display_url : thumb,
      caption: typeof o.accessibility_caption === 'string'
        ? o.accessibility_caption
        : String((o.edge_media_to_caption as { edges?: { node?: { text?: string } }[] } | undefined)?.edges?.[0]?.node?.text || '').slice(0, 120),
      shortcode: typeof o.shortcode === 'string' ? o.shortcode : undefined,
    });
  }
  for (const v of Object.values(o)) walk(v, out);
}

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

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const found: Media[] = [];
  const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
  const context = browser.contexts()[0] ?? await browser.newContext();
  const page = await context.newPage();

  page.on('response', async res => {
    try {
      const url = res.url();
      if (!/instagram\.com\/(api\/graphql|graphql\/query)/i.test(url) && !/query_id|doc_id/i.test(url)) {
        // also catch /api/v1/
        if (!/instagram\.com\/api\//i.test(url)) return;
      }
      const ct = res.headers()['content-type'] || '';
      if (!/json|javascript/i.test(ct) && !url.includes('graphql')) return;
      const text = await res.text();
      if (!/like_count|edge_liked_by|edge_media_preview_like|thumbnail_src/i.test(text)) return;
      let json: unknown;
      try { json = JSON.parse(text); } catch { return; }
      walk(json, found);
    } catch { /* ignore */ }
  });

  console.log('open profile…');
  await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.keyboard.press('Escape').catch(() => {});

  for (let i = 0; i < 16; i++) {
    await page.mouse.wheel(0, 2800);
    await page.waitForTimeout(900);
  }

  // dedupe by id, keep max likes
  const byId = new Map<string, Media>();
  for (const m of found) {
    const prev = byId.get(m.id);
    if (!prev || m.likes > prev.likes) byId.set(m.id, m);
  }
  const ranked = [...byId.values()].sort((a, b) => b.likes - a.likes || b.comments - a.comments);

  console.log(`unique media with likes: ${ranked.length}`);
  for (const m of ranked.slice(0, 20)) {
    console.log(`  ${m.likes}\t${(m.caption || m.shortcode || m.id).slice(0, 70)}`);
  }

  fs.writeFileSync(path.join(OUT, 'ig-graphql-ranked.json'), JSON.stringify({ at: new Date().toISOString(), ranked }, null, 2));

  if (ranked.length === 0) {
    console.log('no graphql likes — try hover fallback');
    await page.goto(IG, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(3000);
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 2200);
      await page.waitForTimeout(600);
    }
    const hoverStats = await page.evaluate(async () => {
      const links = Array.from(document.querySelectorAll('main a')).filter(a => a.querySelector('img'));
      const out: { likes: number; comments: number; src: string; alt: string }[] = [];
      for (const a of links.slice(0, 40)) {
        const img = a.querySelector('img') as HTMLImageElement | null;
        if (!img) continue;
        const src = img.currentSrc || img.src || '';
        if (!src || img.naturalWidth < 200) continue;
        a.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        a.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        await new Promise(r => setTimeout(r, 200));
        // overlay spans near the link
        const root = a.closest('div') || a;
        const nums = Array.from(root.querySelectorAll('span'))
          .map(s => (s.textContent || '').trim())
          .filter(t => /^[\d.,]+[KkMm]?$/.test(t));
        const likes = nums[0] ? Number(String(nums[0]).replace(/[.,]/g, '').replace(/[Kk]/, '000').replace(/[Mm]/, '000000')) : 0;
        const comments = nums[1] ? Number(String(nums[1]).replace(/[.,]/g, '')) : 0;
        out.push({ likes: Number.isFinite(likes) ? likes : 0, comments: Number.isFinite(comments) ? comments : 0, src, alt: (img.alt || '').slice(0, 120) });
      }
      return out;
    });
    hoverStats.sort((a, b) => b.likes - a.likes);
    console.log('hover top:');
    for (const h of hoverStats.slice(0, 15)) console.log(`  ${h.likes}\t${h.alt.slice(0, 60)}`);
    fs.writeFileSync(path.join(OUT, 'ig-hover-ranked.json'), JSON.stringify(hoverStats, null, 2));

    let n = 0;
    const seen = new Set<string>();
    for (const h of hoverStats) {
      const key = h.src.split('?')[0];
      if (seen.has(key)) continue;
      seen.add(key);
      n += 1;
      const file = path.join(OUT, `rank_${String(n).padStart(2, '0')}.jpg`);
      const ok = await download(h.src, file);
      console.log(ok ? `saved ${path.basename(file)} likes≈${h.likes}` : `fail ${n}`);
      if (ok) fs.copyFileSync(file, path.join(DEST, `rank-${String(n).padStart(2, '0')}.jpg`));
      if (n >= 15) break;
    }
  } else {
    let n = 0;
    for (const m of ranked) {
      n += 1;
      const url = m.display || m.thumb;
      const file = path.join(OUT, `rank_${String(n).padStart(2, '0')}.jpg`);
      const ok = await download(url, file);
      console.log(ok ? `saved ${path.basename(file)} likes=${m.likes}` : `fail ${n}`);
      if (ok) fs.copyFileSync(file, path.join(DEST, `rank-${String(n).padStart(2, '0')}.jpg`));
      if (n >= 15) break;
    }
  }

  await page.close().catch(() => {});
  console.log('done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
