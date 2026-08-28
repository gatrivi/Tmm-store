/**
 * Build print-ready A6 brief PDFs from public/print/briefs/*.html
 * Run: node scripts/gen-briefs-pdf.mjs
 * Output: gatrivi_brief_{slug}_A6.pdf at repo root.
 */
import { readdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const briefsDir = join(root, 'public', 'print', 'briefs');

const files = readdirSync(briefsDir).filter((f) => /^brief-.+\.html$/.test(f));
if (files.length === 0) {
  console.error('No brief-*.html found under public/print/briefs');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();

for (const f of files) {
  const slug = f.replace(/^brief-/, '').replace(/\.html$/, '');
  await page.goto('file:///' + join(briefsDir, f).replace(/\\/g, '/'), {
    waitUntil: 'networkidle',
  });
  await page.pdf({
    path: join(root, `gatrivi_brief_${slug}_A6.pdf`),
    format: 'A6',
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  });
  console.log('wrote', `gatrivi_brief_${slug}_A6.pdf`);
}

await browser.close();
console.log('done.');
