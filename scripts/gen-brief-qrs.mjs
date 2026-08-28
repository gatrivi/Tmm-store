/**
 * Generate print-ready QR codes for the sales-kit briefs.
 * Run: node scripts/gen-brief-qrs.mjs
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const QRCode = require('qrcode');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'print', 'briefs');

const BRIEFS = [
  { slug: 'pizzeria', label: 'Pizzería' },
  { slug: 'panaderia', label: 'Panadería' },
  { slug: 'carniceria', label: 'Carnicería' },
  { slug: 'verduleria', label: 'Verdulería' },
  { slug: 'ferreteria', label: 'Ferretería' },
];

mkdirSync(outDir, { recursive: true });

for (const b of BRIEFS) {
  const url = `https://tmm.gatrivi.com/demo/${b.slug}`;
  const png = await QRCode.toBuffer(url, {
    width: 1024,
    margin: 1,
    errorCorrectionLevel: 'M',
    color: { dark: '#24152f', light: '#fff9ef' },
  });
  const out = join(outDir, `qr-${b.slug}.png`);
  writeFileSync(out, png);
  console.log('qr', b.slug, '→', url);
}
