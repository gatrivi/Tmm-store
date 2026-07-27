/**
 * Runnable check: npx --yes tsx src/utils/demoRegistry.selfcheck.ts
 * Fails loud if vertical registry drifts.
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
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { PIZZERIA_DEMO } from '../data/demos/pizzeria';

function main() {
  assert.equal(resolveTenantIdFromPath('/demo'), 'demo');
  assert.equal(resolveTenantIdFromPath('/demo/owner'), 'demo');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria/owner'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/demo/carniceria/order/G7L2'), 'demo-carniceria');
  assert.equal(resolveTenantIdFromPath('/demo/pizzeria'), 'demo-pizzeria');
  assert.equal(resolveTenantIdFromPath('/demo/pizzeria/owner'), 'demo-pizzeria');
  assert.equal(resolveTenantIdFromPath('/demo/pizzeria/order/P8K2'), 'demo-pizzeria');
  assert.equal(resolveTenantIdFromPath('/demo/panaderia'), 'demo-panaderia');
  assert.equal(resolveTenantIdFromPath('/demo/panaderia/owner'), 'demo-panaderia');
  assert.equal(resolveTenantIdFromPath('/demo/panaderia/order/M9A2'), 'demo-panaderia');
  assert.equal(resolveTenantIdFromPath('/s/foo'), 'foo');

  assert.equal(resolveDemoIdFromPath('/demo/carniceria'), 'carniceria');
  assert.equal(resolveDemoIdFromPath('/demo/pizzeria'), 'pizzeria');
  assert.equal(resolveDemoIdFromPath('/demo/panaderia'), 'panaderia');
  assert.equal(resolveDemoStorageKey('demo'), 'trufi_demo_orders_v2');
  assert.equal(resolveDemoStorageKey('carniceria'), 'trufi_demo_orders_v2:carniceria');
  assert.equal(resolveDemoStorageKey('pizzeria'), 'trufi_demo_orders_v2:pizzeria');
  assert.equal(resolveDemoStorageKey('panaderia'), 'trufi_demo_orders_v2:panaderia');

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

  // Pizzería vertical — sizes + packs, no choripán
  const pizza = resolveDemoFromPath('/demo/pizzeria');
  assert.ok(pizza);
  assert.equal(pizza.tenantId, 'demo-pizzeria');
  assert.equal(pizza.plan, 'pedidos');
  assert.ok(!pizza.menuItems.some(i => /chorip/i.test(i.name)));
  assert.ok(pizza.menuItems.some(i => i.id === 'muzza'));
  assert.ok(pizza.menuItems.some(i => i.id === 'empanada-carne'));
  assert.equal(pizza.menuCategories.length, 3);
  assert.equal(pizza.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-pizzeria')?.id, 'pizzeria');
  assert.equal(isDemoTenant('demo-pizzeria'), true);

  const muzza = PIZZERIA_DEMO.menuItems.find(i => i.id === 'muzza')!;
  assert.equal(muzza.options.length, 2);
  assert.ok(muzza.options[0].price < muzza.options[1].price);
  const emp = PIZZERIA_DEMO.menuItems.find(i => i.id === 'empanada-carne')!;
  assert.equal(emp.options.length, 2);

  // Panadería La Magdalena — facturas packs + retiro
  const pan = resolveDemoFromPath('/demo/panaderia');
  assert.ok(pan);
  assert.equal(pan.tenantId, 'demo-panaderia');
  assert.equal(pan.siteSettings.brandName, 'La Magdalena');
  assert.equal(pan.siteSettings.whatsappNumber, '549116563860');
  assert.ok(pan.menuItems.some(i => i.id === 'medialunas'));
  assert.ok(pan.menuItems.some(i => i.id === 'facturas-surtidas'));
  assert.equal(pan.menuCategories.length, 3);
  assert.equal(pan.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-panaderia')?.id, 'panaderia');
  const med = PANADERIA_DEMO.menuItems.find(i => i.id === 'medialunas')!;
  assert.equal(med.options.length, 2);

  // Storage isolation keys must differ
  assert.notEqual(resolveDemoStorageKey('demo'), resolveDemoStorageKey('carniceria'));
  assert.notEqual(resolveDemoStorageKey('pizzeria'), resolveDemoStorageKey('carniceria'));
  assert.notEqual(resolveDemoStorageKey('pizzeria'), resolveDemoStorageKey('demo'));
  assert.notEqual(resolveDemoStorageKey('panaderia'), resolveDemoStorageKey('pizzeria'));

  console.log('demoRegistry.selfcheck: ok');
}

main();
