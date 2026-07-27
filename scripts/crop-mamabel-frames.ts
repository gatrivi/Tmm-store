/**
 * Crop uniform white / near-white borders from mamabel demo JPGs.
 * Run: npx --yes tsx scripts/crop-mamabel-frames.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// use sharp if present, else sharp via dynamic — fall back to jimp? Check package.json
const DEST = path.resolve('public/demos/mamabel');

async function loadSharp(): Promise<typeof import('sharp') | null> {
  try {
    return await import('sharp');
  } catch {
    return null;
  }
}

/** Find content bbox excluding near-white margins. */
function contentBox(
  data: Buffer,
  w: number,
  h: number,
  channels: number,
  threshold = 245,
  minContentRatio = 0.02,
): { left: number; top: number; width: number; height: number } | null {
  const isWhite = (i: number) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    return r >= threshold && g >= threshold && b >= threshold;
  };

  let top = 0;
  let bottom = h - 1;
  let left = 0;
  let right = w - 1;

  const rowWhite = (y: number) => {
    let white = 0;
    for (let x = 0; x < w; x++) {
      if (isWhite((y * w + x) * channels)) white += 1;
    }
    return white / w >= 1 - minContentRatio;
  };
  const colWhite = (x: number) => {
    let white = 0;
    for (let y = 0; y < h; y++) {
      if (isWhite((y * w + x) * channels)) white += 1;
    }
    return white / h >= 1 - minContentRatio;
  };

  while (top < bottom && rowWhite(top)) top += 1;
  while (bottom > top && rowWhite(bottom)) bottom -= 1;
  while (left < right && colWhite(left)) left += 1;
  while (right > left && colWhite(right)) right -= 1;

  const width = right - left + 1;
  const height = bottom - top + 1;
  // only crop if we removed meaningful border (>= 2% each side or >= 8px)
  const trimmed =
    top > 8 || bottom < h - 9 || left > 8 || right < w - 9
    || top / h > 0.02 || (h - 1 - bottom) / h > 0.02
    || left / w > 0.02 || (w - 1 - right) / w > 0.02;

  if (!trimmed || width < 80 || height < 80) return null;
  return { left, top, width, height };
}

async function main() {
  const sharpMod = await loadSharp();
  if (!sharpMod) {
    console.error('sharp missing — installing…');
    const { execSync } = await import('node:child_process');
    execSync('npm install --no-save --no-package-lock sharp', { stdio: 'inherit' });
  }
  const sharp = (await import('sharp')).default;

  const files = fs.readdirSync(DEST).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
    && !f.startsWith('logo')
    && f !== 'profile.jpg',
  );

  let cropped = 0;
  for (const f of files) {
    const file = path.join(DEST, f);
    const img = sharp(file);
    const meta = await img.metadata();
    if (!meta.width || !meta.height) continue;

    const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    const box = contentBox(data, info.width, info.height, info.channels, 242, 0.015);
    if (!box) {
      console.log(`skip ${f} (no frame)`);
      continue;
    }
    const pct = Math.round((1 - (box.width * box.height) / (info.width * info.height)) * 100);
    await sharp(file)
      .extract(box)
      .jpeg({ quality: 90 })
      .toFile(file + '.tmp');
    fs.renameSync(file + '.tmp', file);
    console.log(`crop ${f} -${pct}% → ${box.width}x${box.height}`);
    cropped += 1;
  }

  // also crop scraped rank_* and ig_* used as sources
  const scraped = path.join(DEST, 'scraped');
  if (fs.existsSync(scraped)) {
    for (const f of fs.readdirSync(scraped).filter(x => /^(rank_|ig_)\d+\.jpg$/i.test(x))) {
      const file = path.join(scraped, f);
      const img = sharp(file);
      const { data, info } = await img.raw().ensureAlpha().toBuffer({ resolveWithObject: true });
      const box = contentBox(data, info.width, info.height, info.channels, 242, 0.015);
      if (!box) continue;
      await sharp(file).extract(box).jpeg({ quality: 90 }).toFile(file + '.tmp');
      fs.renameSync(file + '.tmp', file);
      console.log(`crop scraped/${f}`);
      cropped += 1;
    }
  }

  console.log(`done cropped=${cropped}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
