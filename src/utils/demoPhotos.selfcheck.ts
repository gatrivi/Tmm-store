/**
 * Runnable: npx --yes tsx src/utils/demoPhotos.selfcheck.ts
 * Sales demos must ship with usable product imagery, not empty placeholders.
 */
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { DEMO_PRESETS } from '../data/demoPresets';
import { listVerticalDemos } from './demoRegistry';

const PHOTO_EXTENSIONS = new Set(['.avif', '.jpeg', '.jpg', '.png', '.webp']);
const REMOTE_IMAGE_HOSTS = new Set(['images.unsplash.com', 'images.pexels.com']);
const MIN_RASTER_BYTES = 1024;

function isRemote(src: string) {
  return src.startsWith('https://');
}

function isPhotoSource(src: string) {
  if (isRemote(src)) return true;
  return PHOTO_EXTENSIONS.has(extname(src.split('?')[0]).toLowerCase());
}

function assertImageSource(label: string, src: string) {
  if (isRemote(src)) {
    const url = new URL(src);
    assert.ok(REMOTE_IMAGE_HOSTS.has(url.hostname), `${label} unapproved remote image host: ${url.hostname}`);
    return;
  }

  assert.ok(src.startsWith('/'), `${label} bad path ${src}`);
  const disk = join(process.cwd(), 'public', src.replace(/^\//, ''));
  assert.ok(existsSync(disk), `${label} file missing: ${src}`);

  if (isPhotoSource(src)) {
    assert.ok(statSync(disk).size >= MIN_RASTER_BYTES, `${label} raster image too small: ${src}`);
  }
}

function assertImages(label: string, items: { id: string; images: string[] }[]) {
  for (const item of items) {
    const itemLabel = `${label}/${item.id}`;
    assert.ok(item.images.length >= 1, `${itemLabel} missing images`);
    assert.ok(item.images.some(isPhotoSource), `${itemLabel} needs at least one raster/photo source`);

    for (const src of item.images) assertImageSource(itemLabel, src);

    if (item.images.some(isRemote)) {
      assert.ok(
        item.images.some(src => src.startsWith('/')),
        `${itemLabel} remote photo needs a local fallback`,
      );
    }
  }
}

function main() {
  for (const demo of listVerticalDemos()) {
    assertImages(demo.id, demo.menuItems);
    if (demo.heroImage) assertImageSource(`${demo.id}/hero`, demo.heroImage);
    if (demo.siteSettings.brandLogo) assertImageSource(`${demo.id}/logo`, demo.siteSettings.brandLogo);
  }

  for (const preset of Object.values(DEMO_PRESETS)) {
    assertImages(preset.id, preset.menuItems);
  }

  console.log('demoPhotos.selfcheck: ok');
}

main();
