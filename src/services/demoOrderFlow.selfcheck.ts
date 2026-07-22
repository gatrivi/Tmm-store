/**
 * End-to-end demo order consistency check.
 * Run: npx --yes tsx src/services/demoOrderFlow.selfcheck.ts
 *
 * Asserts create → list/card metrics → transition → tracking
 * all read the same persisted sessionStorage state, with immediate subscribe.
 */
import assert from 'node:assert/strict';
import type { OrderRecord } from '../types/order';
import { inboxFilterBucket } from '../utils/orderStateMachine';
import { resolveDemoStorageKey } from '../utils/demoRegistry';

type StoreMap = Map<string, string>;

function installSessionStorage(): StoreMap {
  const map: StoreMap = new Map();
  const sessionStorage = {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => { map.set(k, v); },
    removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() { return map.size; },
  };
  Object.defineProperty(globalThis, 'sessionStorage', { value: sessionStorage, configurable: true });
  return map;
}

function installWindow(pathname: string) {
  const listeners = new Map<string, Set<EventListener>>();
  const windowMock = {
    location: { pathname },
    addEventListener: (type: string, fn: EventListener) => {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type)!.add(fn);
    },
    removeEventListener: (type: string, fn: EventListener) => {
      listeners.get(type)?.delete(fn);
    },
    dispatchEvent: (event: Event) => {
      const set = listeners.get(event.type);
      if (set) for (const fn of set) fn(event);
      return true;
    },
  };
  Object.defineProperty(globalThis, 'window', { value: windowMock, configurable: true });
  // import.meta.env used by demoRegistry — soft stub
  return windowMock;
}

async function main() {
  installSessionStorage();
  installWindow('/demo/carniceria');

  // Dynamic import after globals exist
  const repo = await import('./demoOrderRepository');
  const { buildOrderRecord } = await import('../utils/orderBuilder');

  const demoId = 'carniceria';
  const key = resolveDemoStorageKey(demoId);
  assert.equal(key, 'trufi_demo_orders_v2:carniceria');

  repo.clearDemoOrders(demoId);

  const snaps: OrderRecord[][] = [];
  const unsub = repo.subscribeDemoOrders(orders => {
    snaps.push(orders.map(o => ({ ...o, items: o.items.map(i => ({ ...i })) })));
  }, demoId);

  // Seed happens on first list/subscribe
  assert.ok(snaps.length >= 1);
  const seedCount = snaps.at(-1)!.length;
  assert.ok(seedCount >= 3, 'carnicería seeds present');

  const cart = [
    { id: 'asado', name: 'Asado del medio', optionId: 'kilo', optionLabel: '1 kg aprox.', price: 18900, qty: 1 },
    { id: 'combo-parrillero', name: 'Combo parrillero', optionId: 'pack', optionLabel: 'Pack 2–3 personas', price: 49900, qty: 1 },
  ];
  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  assert.equal(total, 68800);

  const record = buildOrderRecord({
    tenantId: 'demo-carniceria',
    checkout: {
      orderId: 'T9ST',
      name: 'Prospecto Test',
      phone: '1100000000',
      deliveryType: 'delivery',
      address: 'Olivos demo',
      paymentMethod: 'cash',
      notes: 'corte mediano',
    },
    cart,
    subtotal: total,
    discount: 0,
    total,
  });

  const beforeSnaps = snaps.length;
  const persisted = repo.createDemoOrder({ ...record, source: 'demo' }, demoId);

  // Immediate subscribe (no 1.5s poll)
  assert.ok(snaps.length > beforeSnaps, 'subscribe must emit on create');
  const afterCreate = snaps.at(-1)!;
  const fromList = afterCreate.find(o => o.id === 'T9ST');
  assert.ok(fromList);

  // Persisted === list === get === create return
  const fetched = repo.getDemoOrder('T9ST', demoId);
  assert.ok(fetched);
  assert.equal(fetched!.total, total);
  assert.equal(persisted.total, total);
  assert.equal(fromList!.total, total);
  assert.deepEqual(
    fetched!.items.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
    cart.map(i => ({ id: i.id, qty: i.qty, price: i.price })),
  );
  assert.equal(fetched!.status, 'new');
  assert.equal(fetched!.deliveryType, 'delivery');
  assert.ok(repo.isProspectDemoOrder('T9ST', demoId));

  // Metrics + filter buckets from same list
  const metrics = repo.demoOrderMetrics(afterCreate);
  assert.equal(metrics.count, afterCreate.filter(o => o.status !== 'rejected' && o.status !== 'cancelled').length);
  assert.equal(
    metrics.revenue,
    afterCreate.filter(o => o.status !== 'rejected' && o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
  );
  assert.equal(inboxFilterBucket(fetched!.status), 'new');
  const newBucket = afterCreate.filter(o => inboxFilterBucket(o.status) === 'new');
  assert.ok(newBucket.some(o => o.id === 'T9ST'));

  // Transition → tracking sees same id/total/items, new status, immediate emit
  const beforeTx = snaps.length;
  const updated = repo.transitionDemoOrder('T9ST', 'preparing', demoId);
  assert.ok(updated);
  assert.ok(snaps.length > beforeTx, 'subscribe must emit on transition');
  const tracked = repo.getDemoOrder('t9st', demoId); // case-insensitive
  assert.ok(tracked);
  assert.equal(tracked!.status, 'preparing');
  assert.equal(tracked!.total, total);
  assert.equal(tracked!.items.length, 2);
  assert.equal(inboxFilterBucket(tracked!.status), 'preparing');
  assert.equal(snaps.at(-1)!.find(o => o.id === 'T9ST')?.status, 'preparing');

  // Empty/zero re-submit must not wipe total or reset progressed status
  const wiped = repo.createDemoOrder({
    ...persisted,
    items: [],
    subtotal: 0,
    total: 0,
    status: 'new',
  }, demoId);
  assert.equal(wiped.total, total);
  assert.equal(wiped.status, 'preparing');
  assert.equal(repo.getDemoOrder('T9ST', demoId)!.total, total);
  assert.equal(repo.getDemoOrder('T9ST', demoId)!.status, 'preparing');

  // Case-insensitive transition
  const ready = repo.transitionDemoOrder('t9st', 'ready', demoId);
  assert.ok(ready);
  assert.equal(ready!.status, 'ready');
  assert.equal(repo.getDemoOrder('T9ST', demoId)!.status, 'ready');

  unsub();

  // Gastronomy bucket stays isolated (explicit demoId — no path dependency)
  repo.clearDemoOrders('demo');
  const gastro = repo.listDemoOrders('demo');
  assert.ok(gastro.every(o => o.tenantId === 'demo'));
  assert.equal(repo.getDemoOrder('T9ST', 'demo'), null);
  assert.ok(repo.getDemoOrder('T9ST', 'carniceria'));

  console.log('demoOrderFlow.selfcheck: ok');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
