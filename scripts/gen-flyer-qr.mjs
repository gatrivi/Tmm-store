/** Generate public/print/qr-recorrida.png — run: npx tsx scripts/gen-flyer-qr.mjs */
import QR from 'qrcode';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'print');
const url =
  'https://gatrivi.com/?utm_source=recorrida&utm_medium=qr&utm_campaign=zona_norte&utm_content=petshop';

mkdirSync(outDir, { recursive: true });
const png = await QR.toBuffer(url, {
  type: 'png',
  width: 512,
  margin: 1,
  errorCorrectionLevel: 'M',
  color: { dark: '#000000', light: '#FFFFFF' },
});
writeFileSync(join(outDir, 'qr-recorrida.png'), png);
console.log('wrote public/print/qr-recorrida.png');
