import type { OrderRecord } from '../types/order';
import { normalizeOrderRecord } from '../types/order';

const STORAGE_KEY = 'trufi_demo_orders_v2';

const SEED_ORDERS: OrderRecord[] = [
  {
    id: 'K7P4',
    tenantId: 'demo',
    status: 'new',
    customerName: 'Lucía M.',
    customerPhone: '1131844469',
    deliveryType: 'pickup',
    address: '',
    paymentMethod: 'transfer',
    paymentStatus: 'pending',
    notes: '',
    items: [
      { id: '1', name: 'Burger completa', optionId: '', optionLabel: 'Única', price: 18000, qty: 1 },
      { id: '2', name: 'Papas', optionId: '', optionLabel: 'Única', price: 5500, qty: 1 },
    ],
    subtotal: 23500,
    discount: 0,
    total: 23500,
    source: 'demo',
    createdAt: new Date(Date.now() - 4 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60_000).toISOString(),
  },
  {
    id: 'R2N8',
    tenantId: 'demo',
    status: 'preparing',
    customerName: 'Martín R.',
    customerPhone: '1144556677',
    deliveryType: 'delivery',
    address: 'Maipú 2200, Olivos',
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    notes: 'sin cebolla',
    items: [
      { id: '3', name: 'Choripán combo', optionId: '', optionLabel: 'Única', price: 14500, qty: 2 },
    ],
    subtotal: 29000,
    discount: 0,
    total: 29000,
    source: 'demo',
    createdAt: new Date(Date.now() - 10 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60_000).toISOString(),
  },
  {
    id: 'B9F3',
    tenantId: 'demo',
    status: 'ready',
    customerName: 'Ana P.',
    customerPhone: '1199887766',
    deliveryType: 'pickup',
    address: '',
    paymentMethod: 'mercadopago',
    paymentStatus: 'approved',
    notes: '',
    items: [
      { id: '4', name: 'Bondiola completa', optionId: '', optionLabel: 'Única', price: 17000, qty: 1 },
      { id: '5', name: 'Bebida', optionId: '', optionLabel: 'Única', price: 2000, qty: 2 },
    ],
    subtotal: 21000,
    discount: 0,
    total: 21000,
    source: 'demo',
    createdAt: new Date(Date.now() - 25 * 60_000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
];

type DemoStore = {
  seeded: boolean;
  /** IDs creados por el prospecto en esta sesión */
  prospectIds: string[];
  orders: OrderRecord[];
};

function readStore(): DemoStore {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoStore;
      return {
        seeded: Boolean(parsed.seeded),
        prospectIds: Array.isArray(parsed.prospectIds) ? parsed.prospectIds : [],
        orders: (parsed.orders ?? []).map(normalizeOrderRecord),
      };
    }
  } catch {
    /* ignore */
  }
  return { seeded: false, prospectIds: [], orders: [] };
}

function writeStore(store: DemoStore): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function ensureSeeded(): DemoStore {
  const store = readStore();
  if (store.seeded && store.orders.length > 0) return store;
  const next: DemoStore = {
    seeded: true,
    prospectIds: store.prospectIds,
    orders: SEED_ORDERS.map(o => ({ ...o })),
  };
  writeStore(next);
  return next;
}

export function listDemoOrders(): OrderRecord[] {
  const store = ensureSeeded();
  return [...store.orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getDemoOrder(orderId: string): OrderRecord | null {
  const id = orderId.toUpperCase();
  return listDemoOrders().find(o => o.id.toUpperCase() === id) ?? null;
}

export function createDemoOrder(order: OrderRecord): OrderRecord {
  const store = ensureSeeded();
  const existing = store.orders.findIndex(o => o.id === order.id);
  const normalized = normalizeOrderRecord({ ...order, tenantId: 'demo', source: 'demo' });
  const orders = [...store.orders];
  if (existing >= 0) {
    orders[existing] = normalized;
  } else {
    orders.unshift(normalized);
  }
  const prospectIds = store.prospectIds.includes(order.id)
    ? store.prospectIds
    : [order.id, ...store.prospectIds];
  writeStore({ seeded: true, prospectIds, orders });
  return normalized;
}

export function transitionDemoOrder(
  orderId: string,
  to: OrderRecord['status'],
): OrderRecord | null {
  const store = ensureSeeded();
  const idx = store.orders.findIndex(o => o.id === orderId);
  if (idx < 0) return null;
  const updated: OrderRecord = {
    ...store.orders[idx],
    status: to,
    updatedAt: new Date().toISOString(),
  };
  const orders = [...store.orders];
  orders[idx] = updated;
  writeStore({ ...store, orders });
  return updated;
}

export function subscribeDemoOrders(callback: (orders: OrderRecord[]) => void): () => void {
  const emit = () => callback(listDemoOrders());
  emit();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) emit();
  };
  window.addEventListener('storage', onStorage);
  // same-tab updates: poll lightly (sessionStorage no dispara storage)
  const interval = window.setInterval(emit, 1500);
  return () => {
    window.removeEventListener('storage', onStorage);
    window.clearInterval(interval);
  };
}

export function isProspectDemoOrder(orderId: string): boolean {
  return readStore().prospectIds.includes(orderId);
}

export function demoOrderMetrics(orders: OrderRecord[]) {
  const active = orders.filter(o => o.status !== 'rejected' && o.status !== 'cancelled');
  const count = active.length;
  const revenue = active.reduce((sum, o) => sum + o.total, 0);
  const ticket = count > 0 ? Math.round(revenue / count) : 0;
  return { count, revenue, ticket };
}
