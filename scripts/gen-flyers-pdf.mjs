/**
 * Build print-ready A4 flyer PDFs from public/print sources.
 *   fronts:  gatrivi_4_frentes_A4.pdf   (4× A6, from flyer-a6.html)
 *   backs:   gatrivi_4_reversos_A4.pdf  (4× A6 demo screenshots)
 * Run: node scripts/gen-flyers-pdf.mjs [--shots-only]
 */
import { mkdirSync, writeFileSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const shotsDir = join(root, 'public', 'print', 'demo-shots');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const DEMOS = [
  { slug: 'pizzeria', label: 'Pizzería' },
  { slug: 'carniceria', label: 'Carnicería' },
  { slug: 'verduleria', label: 'Verdulería' },
  { slug: 'ferreteria', label: 'Ferretería' },
];

// 1) demo screenshots (390×844 @2x, hero view)
mkdirSync(shotsDir, { recursive: true });
{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  for (const d of DEMOS) {
    await page.goto(`https://tmm.gatrivi.com/demo/${d.slug}`, {
      waitUntil: 'networkidle',
      timeout: 45000,
    });
    await sleep(2500);
    await page.screenshot({ path: join(shotsDir, `${d.slug}.png`) });
    console.log('shot', d.slug);
  }
  await browser.close();
}
if (process.argv.includes('--shots-only')) process.exit(0);

// 2) print PDFs (vector text; headless pdf)
{
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // fronts from the canonical print HTML
  await page.goto('file:///' + join(root, 'public', 'print', 'flyer-a6.html').replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  await page.pdf({
    path: join(root, 'gatrivi_4_frentes_A4.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  console.log('wrote gatrivi_4_frentes_A4.pdf');

  // reverso: same grid, one demo screenshot per cell
  const cells = DEMOS.map(
    (d, i) => `
    <article class="flyer">
      <div class="shotwrap"><img class="shot" src="./demo-shots/${d.slug}.png" alt="Demo ${d.label}" /></div>
      <p class="label">${d.label} · <span>demo real</span></p>
      <p class="note">Hecho con los productos reales del negocio.</p>
      <p class="flip">Dale vuelta → escaneá el QR de adelante</p>
      ${i === 3 ? '<p class="brand">Gatrivi.com · ZengaSoft · hecho en Olivos</p>' : ''}
    </article>`,
  ).join('\n');

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8" />
  <link rel="stylesheet" href="./takeshi-palette.css" />
  <style>
    @page { size: A4; margin: 0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, "Times New Roman", serif; color: var(--takeshi-night); background: var(--takeshi-paper); }
    .sheet { width: 210mm; height: 297mm; display: grid; grid-template-columns: 105mm 105mm; grid-template-rows: 148.5mm 148.5mm; }
    .flyer { position: relative; padding: 8mm 9mm 7mm; border: 0.35pt dashed var(--takeshi-plum); display: flex; flex-direction: column; align-items: center; text-align: center; page-break-inside: avoid; }
    .flyer:nth-child(1) { border-top: 0; border-left: 0; }
    .flyer:nth-child(2) { border-top: 0; border-right: 0; }
    .flyer:nth-child(3) { border-bottom: 0; border-left: 0; }
    .flyer:nth-child(4) { border-bottom: 0; border-right: 0; }
    .shotwrap { height: 96mm; display: flex; align-items: flex-start; justify-content: center; overflow: hidden; border-radius: 3mm; box-shadow: 0 1mm 3mm rgba(36,21,47,.25); }
    .shot { width: 62mm; display: block; }
    .label { margin-top: 5mm; font-family: system-ui, sans-serif; font-size: 11.5pt; font-weight: 800; letter-spacing: .02em; }
    .label span { color: var(--takeshi-fuchsia); }
    .note { margin-top: 2.5mm; font-size: 10pt; color: var(--takeshi-plum); }
    .flip { margin-top: auto; padding-top: 3mm; font-family: system-ui, sans-serif; font-size: 8pt; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; color: var(--takeshi-orange); }
    .brand { margin-top: 2mm; font-family: system-ui, sans-serif; font-size: 7.5pt; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  </style></head><body>
  <div class="sheet">${cells}</div>
  </body></html>`;

  const tmp = join(root, 'public', 'print', '.reverso-tmp.html');
  writeFileSync(tmp, html);
  await page.goto('file:///' + tmp.replace(/\\/g, '/'));
  await page.waitForLoadState('networkidle');
  await page.pdf({
    path: join(root, 'gatrivi_4_reversos_A4.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  rmSync(tmp);
  await browser.close();
  console.log('wrote gatrivi_4_reversos_A4.pdf');
}
