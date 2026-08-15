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
import { CANAVESI_DEMO } from '../data/demos/canavesi';
import { VERDULERIA_DEMO } from '../data/demos/verduleria';

function diskPath(src: string) {
  return join(process.cwd(), 'public', src.replace(/^\//, ''));
}

function assertImages(label: string, items: { id: string; images: string[] }[]) {
  for (const item of items) {
    assert.ok(item.images.length >= 1, `${label}/${item.id} missing images`);
    for (const src of item.images) {
      assert.ok(src.startsWith('/'), `${label}/${item.id} bad path ${src}`);
      assert.ok(existsSync(diskPath(src)), `${label}/${item.id} file missing: ${src}`);
    }
  }
}

function assertPizzeriaIdentity() {
  assert.equal(PIZZERIA_DEMO.siteSettings.brandName, 'Pizza G', 'pizzeria brand identity regressed');
  assert.equal(
    PIZZERIA_DEMO.siteSettings.brandLogo,
    '/demos/pizzeria/gatrivi-badge.svg',
    'pizzeria logo regressed',
  );
  assert.equal(PIZZERIA_DEMO.heroImage, '/demos/pizzeria/napo.jpg', 'pizzeria hero regressed');
  assert.ok(existsSync(diskPath(PIZZERIA_DEMO.siteSettings.brandLogo!)), 'pizzeria logo file missing');
  assert.ok(existsSync(diskPath(PIZZERIA_DEMO.heroImage!)), 'pizzeria hero file missing');
  assert.ok(!/vos recibís|problema que resolvemos/i.test(PIZZERIA_DEMO.copy.heroBody), 'pizzeria hero leaked B2B demo copy');
  assert.ok(!/problema que resolvemos/i.test(PIZZERIA_DEMO.copy.weightNotice), 'pizzeria notice leaked B2B demo copy');

  const expectedImages: Record<string, string> = {
    muzza: '/demos/pizzeria/muzza.jpg',
    napo: '/demos/pizzeria/napo.jpg',
    fugazzeta: '/demos/pizzeria/fugazzeta.jpg',
    'empanada-carne': '/demos/pizzeria/empanada-carne.jpg',
    'empanada-jyq': '/demos/pizzeria/empanada-jyq.jpg',
    'empanada-humita': '/demos/pizzeria/empanada-humita.jpg',
    faina: '/demos/pizzeria/faina.jpg',
    gaseosa: '/demos/pizzeria/gaseosa.jpg',
  };

  for (const [id, expected] of Object.entries(expectedImages)) {
    const product = PIZZERIA_DEMO.menuItems.find(item => item.id === id);
    assert.ok(product, `pizzeria product missing: ${id}`);
    assert.equal(product.images[0], expected, `pizzeria/${id} image mapping regressed`);
  }
}

function main() {
  assertImages('pizzeria', PIZZERIA_DEMO.menuItems);
  assertPizzeriaIdentity();
  assertImages('panaderia', PANADERIA_DEMO.menuItems);
  assertImages('carniceria', CARNICERIA_DEMO.menuItems);
  assertImages('canavesi', CANAVESI_DEMO.menuItems);
  assertImages('verduleria', VERDULERIA_DEMO.menuItems);
  for (const preset of Object.values(DEMO_PRESETS)) {
    assertImages(preset.id, preset.menuItems);
  }
  console.log('demoPhotos.selfcheck: ok');
}

main();
