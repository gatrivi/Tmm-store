/**
 * Runnable check: npx --yes tsx src/utils/demoRegistry.selfcheck.ts
 * Fails loud if carnicería vertical registry drifts.
 */
import assert from 'node:assert/strict';
import {
  getDemoByTenantId,
  isDemoTenant,
  resolveDemoFromPath,
  resolveDemoIdFromPath,
  resolveDemoStorageKey,
  resolveTenantIdFromPath,
} from './demoRegistry';
import { CARNICERIA_DEMO } from '../data/demos/carniceria';

function main() {
  assert.equal(resolveTenantIdFromPath('/demo'), 'demo');
  assert.equal(resolveTenantIdFromPath('/demo/owner'), 'demo');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria/owner'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria/order/G7L2'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/s/foo'), 'foo');

  assert.equal(resolveDemoIdFromPath('/demo/carniceria'), 'carniceria');
  assert.equal(resolveDemoStorageKey('demo'), 'trufi_demo_orders_v2');
  assert.equal(resolveDemoStorageKey('carniceria'), 'trufi_demo_orders_v2:carniceria');

  const demo = resolveDemoFromPath('/demo/carniceria');
  assert.ok(demo);
  assert.equal(demo.tenantId, 'demo-carniceria');
  assert.equal(demo.plan, 'pedidos');
  assert.equal(demo.copy.totalLabel, 'Total estimado');
  assert.ok(!demo.menuItems.some(i => /chorip|burger|hamburguesa de restaurante/i.test(i.name)));
  assert.ok(demo.menuItems.some(i => i.id === 'asado'));
  assert.ok(demo.menuItems.some(i => i.id === 'combo-parrillero'));
  assert.equal(demo.menuCategories.length, 3);
  assert.equal(demo.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-carniceria')?.id, 'carniceria');
  assert.equal(isDemoTenant('demo-carniceria'), true);
  assert.equal(isDemoTenant('demo'), true);
  assert.equal(isDemoTenant('default'), false);

  // Weight options priced; packs fixed
  const asado = CARNICERIA_DEMO.menuItems.find(i => i.id === 'asado')!;
  assert.equal(asado.options.length, 2);
  assert.equal(asado.options[0].price * 2, asado.options[1].price);
  const combo = CARNICERIA_DEMO.menuItems.find(i => i.id === 'combo-parrillero')!;
  assert.equal(combo.options.length, 1);

  // Storage isolation keys must differ
  assert.notEqual(resolveDemoStorageKey('demo'), resolveDemoStorageKey('carniceria'));

  console.log('demoRegistry.selfcheck: ok');
}

main();
