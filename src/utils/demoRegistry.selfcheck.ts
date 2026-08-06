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
import { AGUACATS_DEMO } from '../data/demos/aguacats';
import { CARNICERIA_DEMO } from '../data/demos/carniceria';
import { MAMABEL_DEMO } from '../data/demos/mamabel';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { PIZZERIA_DEMO } from '../data/demos/pizzeria';
import { VERDULERIA_DEMO } from '../data/demos/verduleria';

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
  assert.equal(resolveTenantIdFromPath('/demo/mamabel'), 'demo-mamabel');
  assert.equal(resolveTenantIdFromPath('/demo/mamabel/owner'), 'demo-mamabel');
  assert.equal(resolveTenantIdFromPath('/demo/mamabel/order/MB12'), 'demo-mamabel');
  assert.equal(resolveTenantIdFromPath('/s/foo'), 'foo');

  assert.equal(resolveDemoIdFromPath('/demo/carniceria'), 'carniceria');
  assert.equal(resolveDemoIdFromPath('/demo/pizzeria'), 'pizzeria');
  assert.equal(resolveDemoIdFromPath('/demo/panaderia'), 'panaderia');
  assert.equal(resolveDemoIdFromPath('/demo/mamabel'), 'mamabel');
  assert.equal(resolveDemoStorageKey('demo'), 'trufi_demo_orders_v2');
  assert.equal(resolveDemoStorageKey('carniceria'), 'trufi_demo_orders_v2:carniceria');
  assert.equal(resolveDemoStorageKey('pizzeria'), 'trufi_demo_orders_v2:pizzeria');
  assert.equal(resolveDemoStorageKey('panaderia'), 'trufi_demo_orders_v2:panaderia');
  assert.equal(resolveDemoStorageKey('mamabel'), 'trufi_demo_orders_v2:mamabel');

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

  // Flagship Mamá Mabel — premium + logo + cakes
  const mm = resolveDemoFromPath('/demo/mamabel');
  assert.ok(mm);
  assert.equal(mm.tenantId, 'demo-mamabel');
  assert.equal(mm.plan, 'premium');
  assert.equal(mm.siteSettings.brandName, 'Las Tortas de Mamá Mabel');
  assert.equal(mm.siteSettings.whatsappNumber, '5491156196941');
  assert.ok(mm.menuItems.some(i => i.id === 'torta-canasta'));
  assert.ok(mm.menuItems.some(i => i.id === 'curso-iniciacion'));
  assert.equal(mm.menuCategories.length, 4);
  assert.equal(mm.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-mamabel')?.id, 'mamabel');
  assert.equal(MAMABEL_DEMO.siteSettings.brandLogo, '/demos/mamabel/logo.jpg');

  // Aguacats (ex Refcurcum) — despensa + fresco, IG assets
  assert.equal(resolveTenantIdFromPath('/demo/aguacats'), 'demo-aguacats');
  assert.equal(resolveTenantIdFromPath('/demo/aguacats/owner'), 'demo-aguacats');
  assert.equal(resolveTenantIdFromPath('/demo/aguacats/order/AC21'), 'demo-aguacats');
  assert.equal(resolveDemoIdFromPath('/demo/aguacats'), 'aguacats');
  assert.equal(resolveDemoStorageKey('aguacats'), 'trufi_demo_orders_v2:aguacats');
  const ac = resolveDemoFromPath('/demo/aguacats');
  assert.ok(ac);
  assert.equal(ac.tenantId, 'demo-aguacats');
  assert.equal(ac.siteSettings.brandName, 'Aguacats');
  assert.equal(ac.siteSettings.whatsappNumber, '541171395174');
  assert.equal(ac.siteSettings.brandInstagram, 'aguacats21');
  assert.ok(ac.menuItems.some(i => i.id === 'palta-hass'));
  assert.ok(ac.menuItems.some(i => i.id === 'combo-frescura'));
  assert.equal(ac.menuCategories[0].id, 'paltas');
  assert.equal(ac.menuCategories.length, 2);
  assert.equal(ac.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-aguacats')?.id, 'aguacats');
  assert.equal(AGUACATS_DEMO.siteSettings.brandLogo, '/demos/aguacats/logo.jpg');

  // Storage isolation keys must differ
  assert.notEqual(resolveDemoStorageKey('demo'), resolveDemoStorageKey('carniceria'));
  assert.notEqual(resolveDemoStorageKey('pizzeria'), resolveDemoStorageKey('carniceria'));
  assert.notEqual(resolveDemoStorageKey('pizzeria'), resolveDemoStorageKey('demo'));
  assert.notEqual(resolveDemoStorageKey('panaderia'), resolveDemoStorageKey('pizzeria'));
  assert.notEqual(resolveDemoStorageKey('mamabel'), resolveDemoStorageKey('panaderia'));
  assert.notEqual(resolveDemoStorageKey('aguacats'), resolveDemoStorageKey('mamabel'));

  // Verdulería La Inmaculada — peso/unidad
  assert.equal(resolveTenantIdFromPath('/demo/verduleria'), 'demo-verduleria');
  assert.equal(resolveTenantIdFromPath('/demo/verduleria/owner'), 'demo-verduleria');
  assert.equal(resolveTenantIdFromPath('/demo/verduleria/order/IM12'), 'demo-verduleria');
  assert.equal(resolveDemoIdFromPath('/demo/verduleria'), 'verduleria');
  assert.equal(resolveDemoStorageKey('verduleria'), 'trufi_demo_orders_v2:verduleria');
  const verd = resolveDemoFromPath('/demo/verduleria');
  assert.ok(verd);
  assert.equal(verd.tenantId, 'demo-verduleria');
  assert.equal(verd.siteSettings.brandName, 'La Inmaculada');
  assert.equal(verd.copy.totalLabel, 'Total estimado');
  assert.ok(verd.menuItems.some(i => i.id === 'tomate'));
  assert.ok(verd.menuItems.some(i => i.id === 'bolson'));
  assert.equal(verd.menuCategories.length, 3);
  assert.equal(verd.seedOrders.length, 3);
  assert.equal(getDemoByTenantId('demo-verduleria')?.id, 'verduleria');
  const tomate = VERDULERIA_DEMO.menuItems.find(i => i.id === 'tomate')!;
  assert.equal(tomate.options.length, 2);
  assert.equal(tomate.options[0].price * 2, tomate.options[1].price);
  assert.notEqual(resolveDemoStorageKey('verduleria'), resolveDemoStorageKey('carniceria'));

  console.log('demoRegistry.selfcheck: ok');
}

main();
