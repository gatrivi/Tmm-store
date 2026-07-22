import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore';
import type { OrderRecord, OrderStatus, PaymentStatus } from '../types/order';
import { normalizeOrderRecord } from '../types/order';
import { getFirestoreDb, isFirebaseConfigured } from '../lib/firebase';

const LS_ORDERS_PREFIX = 'trufi_orders_';

function ordersKey(tenantId: string): string {
  return `${LS_ORDERS_PREFIX}${tenantId}`;
}

function loadLocalOrders(tenantId: string): OrderRecord[] {
  try {
    const raw = localStorage.getItem(ordersKey(tenantId));
    if (raw) {
      return (JSON.parse(raw) as OrderRecord[]).map(normalizeOrderRecord);
    }
  } catch {
    /* ignore */
  }
  return [];
}

function saveLocalOrders(tenantId: string, orders: OrderRecord[]): void {
  localStorage.setItem(ordersKey(tenantId), JSON.stringify(orders));
}

export async function createOrder(order: OrderRecord): Promise<void> {
  const db = getFirestoreDb();
  if (db) {
    await setDoc(doc(db, 'tenants', order.tenantId, 'orders', order.id), order);
    return;
  }

  const orders = loadLocalOrders(order.tenantId);
  orders.unshift(order);
  saveLocalOrders(order.tenantId, orders);
}

export async function getOrder(tenantId: string, orderId: string): Promise<OrderRecord | null> {
  const db = getFirestoreDb();
  if (db) {
    const snap = await getDoc(doc(db, 'tenants', tenantId, 'orders', orderId));
    return snap.exists() ? normalizeOrderRecord(snap.data() as OrderRecord) : null;
  }

  return loadLocalOrders(tenantId).find(o => o.id === orderId) ?? null;
}

export async function listOrders(tenantId: string): Promise<OrderRecord[]> {
  const db = getFirestoreDb();
  if (db) {
    const q = query(
      collection(db, 'tenants', tenantId, 'orders'),
      orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => normalizeOrderRecord(d.data() as OrderRecord));
  }

  return loadLocalOrders(tenantId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function subscribeOrders(
  tenantId: string,
  callback: (orders: OrderRecord[]) => void,
): Unsubscribe {
  const db = getFirestoreDb();
  if (db) {
    const q = query(
      collection(db, 'tenants', tenantId, 'orders'),
      orderBy('createdAt', 'desc'),
    );
    return onSnapshot(q, snap => {
      callback(snap.docs.map(d => normalizeOrderRecord(d.data() as OrderRecord)));
    });
  }

  callback(loadLocalOrders(tenantId));
  const interval = window.setInterval(() => callback(loadLocalOrders(tenantId)), 5000);
  return () => window.clearInterval(interval);
}

export async function updateOrderStatus(
  tenantId: string,
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const updatedAt = new Date().toISOString();
  const db = getFirestoreDb();
  if (db) {
    await updateDoc(doc(db, 'tenants', tenantId, 'orders', orderId), { status, updatedAt });
    return;
  }

  const orders = loadLocalOrders(tenantId).map(o =>
    o.id === orderId ? { ...o, status, updatedAt } : o,
  );
  saveLocalOrders(tenantId, orders);
}

export async function updateOrderPaymentStatus(
  tenantId: string,
  orderId: string,
  paymentStatus: PaymentStatus,
  mpPaymentId?: string,
): Promise<void> {
  const updatedAt = new Date().toISOString();
  const patch: Partial<OrderRecord> = { paymentStatus, updatedAt };
  if (mpPaymentId) patch.mpPaymentId = mpPaymentId;

  const db = getFirestoreDb();
  if (db) {
    await updateDoc(doc(db, 'tenants', tenantId, 'orders', orderId), patch);
    return;
  }

  const orders = loadLocalOrders(tenantId).map(o =>
    o.id === orderId ? { ...o, ...patch } : o,
  );
  saveLocalOrders(tenantId, orders);
}

export function isOrderBackendEnabled(): boolean {
  return isFirebaseConfigured() || typeof localStorage !== 'undefined';
}

export function getOrdersForReports(tenantId: string, days = 7): OrderRecord[] {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return loadLocalOrders(tenantId).filter(
    o => new Date(o.createdAt).getTime() >= cutoff && o.status !== 'rejected' && o.status !== 'cancelled',
  );
}

export async function fetchOrdersForReports(tenantId: string, days = 7): Promise<OrderRecord[]> {
  const orders = await listOrders(tenantId);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return orders.filter(
    o => new Date(o.createdAt).getTime() >= cutoff && o.status !== 'rejected' && o.status !== 'cancelled',
  );
}
