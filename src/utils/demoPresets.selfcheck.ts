/**
 * Runnable: npx --yes tsx src/utils/demoPresets.selfcheck.ts
 */
import assert from 'node:assert/strict';
import {
  DEMO_PRESETS,
  getDemoPreset,
  listDemoPresets,
  PRESET_DISTRIBUIDORA_LACTEOS,
  PRESET_MOLINO_MAYORISTA,
} from '../data/demoPresets';
import { parseProspectDemo, PROSPECT_CATEGORIES } from './prospectDemo';

function main() {
  const ids = [
    'distribuidora-lacteos',
    'molino-mayorista',
    'polleria',
    'verduleria',
    'cafeteria',
    'libreria',
    'grafica',
    'petshop',
  ] as const;

  for (const id of ids) {
    assert.ok(id in PROSPECT_CATEGORIES, `category ${id}`);
    assert.ok(DEMO_PRESETS[id], `preset ${id}`);
    const p = DEMO_PRESETS[id];
    assert.equal(p.menuCategories.length, 3);
    assert.ok(p.menuItems.length >= 6 && p.menuItems.length <= 8);
    assert.ok(p.copy.cartCta.length > 0);
    assert.ok(p.copy.totalLabel.length > 0);
    assert.ok(p.menuItems.every(i => i.images.length === 0), `${id} editorial placeholders`);
  }

  assert.equal(listDemoPresets().length, 8);
  assert.equal(getDemoPreset('molino-mayorista')?.id, 'molino-mayorista');
  assert.equal(getDemoPreset('nope'), null);

  // Wholesale cut
  assert.ok(PRESET_DISTRIBUIDORA_LACTEOS.menuItems.some(i => i.options.some(o => /pack|caja|horma|balde/i.test(o.label))));
  assert.match(PRESET_DISTRIBUIDORA_LACTEOS.copy.cartCta, /reposición/i);
  assert.match(PRESET_MOLINO_MAYORISTA.copy.ribbonLabel, /conceptual no oficial/i);
  assert.ok(PRESET_MOLINO_MAYORISTA.menuItems.some(i => i.options.some(o => /25 kg|5 kg|1 kg/i.test(o.label))));

  const molino = parseProspectDemo('?rubro=molino-mayorista');
  assert.equal(molino.businessName, 'Molino Florida');
  assert.equal(molino.preset?.id, 'molino-mayorista');
  assert.equal(molino.color, 'carbon');

  const lacteos = parseProspectDemo('?rubro=distribuidora-lacteos&negocio=Acme');
  assert.equal(lacteos.businessName, 'Acme');
  assert.equal(lacteos.preset?.id, 'distribuidora-lacteos');

  // One smoke per family
  assert.equal(getDemoPreset('verduleria')?.family, 'peso');
  assert.equal(getDemoPreset('cafeteria')?.family, 'preparacion');
  assert.equal(getDemoPreset('libreria')?.family, 'catalogo');
  assert.equal(getDemoPreset('petshop')?.family, 'catalogo');
  assert.equal(getDemoPreset('distribuidora-lacteos')?.family, 'mayorista');

  console.log('demoPresets.selfcheck: ok');
}

main();
