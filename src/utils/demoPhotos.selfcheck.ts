/**
 * Runnable: npx --yes tsx src/utils/demoPhotos.selfcheck.ts
 * Sales demos must ship with product photos (not empty placeholders).
 */
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { DEMO_PRESETS } from '../data/demoPresets';
import { PIZZERIA_DEMO } from '../data/demos/pizzeria';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { CARNICERIA_DEMO } from '../data/demos/carniceria';

function assertImages(label: string, items: { id: string; images: string[] }[]) {
  for (const item of items) {
    assert.ok(item.images.length >= 1, `${label}/${item.id} missing images`);
    for (const src of item.images) {
      assert.ok(src.startsWith('/'), `${label}/${item.id} bad path ${src}`);
      const disk = join(process.cwd(), 'public', src.replace(/^\//, ''));
      assert.ok(existsSync(disk), `${label}/${item.id} file missing: ${src}`);
    }
  }
}

function main() {
  assertImages('pizzeria', PIZZERIA_DEMO.menuItems);
  assertImages('panaderia', PANADERIA_DEMO.menuItems);
  assertImages('carniceria', CARNICERIA_DEMO.menuItems);
  for (const preset of Object.values(DEMO_PRESETS)) {
    assertImages(preset.id, preset.menuItems);
  }
  console.log('demoPhotos.selfcheck: ok');
}

main();
