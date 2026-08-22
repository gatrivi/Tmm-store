/**
 * Record a vertical promo video (390x844) for any demo route.
 *
 * Usage:
 *   node scripts/record-demo-promo.mjs --demo /demo/pizzeria [--owner /demo/pizzeria/owner] [--out pizzeria]
 *
 * Flow (each step is best-effort, failures are skipped and logged):
 *   hero -> catalog scroll -> add products -> open cart -> owner panel -> end card (gatrivi.com/oferta)
 *
 * Output: <repoRoot>/gatrivi_promo_<out>.mp4 (needs ffmpeg on PATH)
 */
import { mkdirSync, rmSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf('--' + k);
  return i >= 0 && args[i + 1] ? args[i + 1] : d;
};

const demoRoute = arg('demo', '/demo/pizzeria');
const ownerRoute = arg('owner', demoRoute.replace(/\/$/, '') + '/owner');
const outName = arg('out', demoRoute.split('/').pop() || 'demo');
const base = arg('base', 'https://tmm.gatrivi.com');
const endUrl = arg('end', 'https://gatrivi.com/oferta/');

const tmp = join(root, '.promo-tmp');
rmSync(tmp, { recursive: true, force: true });
mkdirSync(join(tmp, 'video'), { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = [];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  recordVideo: { dir: join(tmp, 'video'), size: { width: 390, height: 844 } },
});
const page = await ctx.newPage();

try {
  await page.goto(base + demoRoute, { waitUntil: 'networkidle', timeout: 45000 });
  await sleep(2500); // hero hold

  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
    await sleep(500);
  }
  log.push('catalog scroll ok');

  // add buttons: icon-style black squares, or text Agregar/Añadir
  const added = await page.evaluate(() => {
    let bs = [...document.querySelectorAll('button')].filter(
      (b) => (b.className || '').toString().includes('bg-black') || /^\s*(agregar|añadir)\s*$/i.test(b.innerText || ''),
    );
    bs[0] && bs[0].click();
    return bs.length;
  });
  await sleep(600);
  await page.evaluate(() => {
    const bs = [...document.querySelectorAll('button')].filter(
      (b) => (b.className || '').toString().includes('bg-black') || /^\s*(agregar|añadir)\s*$/i.test(b.innerText || ''),
    );
    bs[2] && bs[2].click();
  });
  await sleep(900);
  log.push('add buttons found: ' + added);

  const cartOpened = await page.evaluate(() => {
    const b =
      document.querySelector('button.relative.bg-gray-800') ||
      [...document.querySelectorAll('button, a')].find((x) =>
        /(ver carrito|carrito|tu pedido)/i.test((x.innerText || '') + '|' + (x.getAttribute('aria-label') || '')),
      );
    if (b) {
      b.click();
      return true;
    }
    return false;
  });
  log.push('cart opened: ' + cartOpened);
  await sleep(2000);
} catch (e) {
  log.push('ERR ' + e.message.slice(0, 120));
}
await ctx.close(); // flush webm

const webms = readdirSync(join(tmp, 'video')).filter((f) => f.endsWith('.webm'));
if (!webms.length) {
  console.error('No video captured. Log:', log);
  process.exit(1);
}

// end card screenshot (separate context, no video)
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await ctx2.newPage();
await p2.goto(endUrl, { waitUntil: 'networkidle', timeout: 45000 });
await sleep(2000);
await p2.screenshot({ path: join(tmp, 'endcard.png') });
await ctx2.close();
await browser.close();

// assemble: main video + 3.5s end card
const mp4in = join(tmp, 'main.mp4');
execSync(`ffmpeg -y -v error -i "${join(tmp, 'video', webms[0])}" -vf "scale=390:844,setsar=1,fps=30,format=yuv420p" -an -c:v libx264 -preset medium -crf 21 "${mp4in}"`);
const out = join(root, `gatrivi_promo_${outName}.mp4`);
execSync(
  `ffmpeg -y -v error -i "${mp4in}" -loop 1 -t 3.5 -i "${join(tmp, 'endcard.png')}" ` +
    `-filter_complex "[0:v][1:v]concat=n=2:v=1:a=0,format=yuv420p[v]" -map "[v]" ` +
    `-c:v libx264 -preset medium -crf 21 -movflags +faststart "${out}"`,
);
rmSync(tmp, { recursive: true, force: true });
console.log('wrote', out, '| steps:', log.join(' · '));
