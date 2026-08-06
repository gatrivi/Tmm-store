/**
 * Runnable: npx --yes tsx src/utils/demoIntake.selfcheck.ts
 */
import assert from 'node:assert/strict';
import { getDemoPreset, listDemoPresets, PRESET_PETSHOP } from '../data/demoPresets';
import { parseProspectDemo, PROSPECT_CATEGORIES } from './prospectDemo';
import { getDemoPriceLabel, withAttribution } from './demoIntake';

function main() {
  assert.ok('petshop' in PROSPECT_CATEGORIES);
  assert.equal(getDemoPreset('petshop')?.id, 'petshop');
  assert.equal(PRESET_PETSHOP.family, 'catalogo');
  assert.equal(PRESET_PETSHOP.menuCategories.length, 3);
  assert.equal(PRESET_PETSHOP.menuItems.length, 8);
  assert.match(PRESET_PETSHOP.copy.cartCta, /Armar pedido/i);
  assert.match(PRESET_PETSHOP.copy.totalLabel, /estimado/i);
  assert.ok(PRESET_PETSHOP.menuItems.every(i => i.images.length >= 1));

  const pet = parseProspectDemo('?rubro=petshop');
  assert.equal(pet.preset?.id, 'petshop');
  assert.equal(pet.color, 'verde');

  assert.equal(listDemoPresets().length, 8);
  assert.ok(getDemoPriceLabel().length > 0);

  const attributed = withAttribution('/demo?rubro=petshop', {
    utm_source: 'recorrida',
    utm_medium: 'qr',
  });
  assert.match(attributed, /rubro=petshop/);
  assert.match(attributed, /utm_source=recorrida/);
  assert.match(attributed, /utm_medium=qr/);

  console.log('demoIntake.selfcheck: ok');
}

main();
