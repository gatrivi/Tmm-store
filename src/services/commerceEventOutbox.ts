import { doc, writeBatch, type Firestore } from 'firebase/firestore';
import type { OrderRecord } from '../types/order';
import {
  createCommerceOrderCreatedEvent,
  type CommerceOrderCreatedEventV1,
} from '../contracts/commerceEvents';

const LS_EVENT_OUTBOX_PREFIX = 'trufi_event_outbox_';

export interface CommerceOutboxRecord {
  event: CommerceOrderCreatedEventV1;
  status: 'pending';
  createdAt: string;
}

function localOutboxKey(tenantId: string): string {
  return `${LS_EVENT_OUTBOX_PREFIX}${tenantId}`;
}

export function buildOrderCreatedOutboxRecord(order: OrderRecord): CommerceOutboxRecord {
  const event = createCommerceOrderCreatedEvent(order);
  return {
    event,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function addOrderAndEventToBatch(
  db: Firestore,
  order: OrderRecord,
): ReturnType<typeof writeBatch> {
  const batch = writeBatch(db);
  const outbox = buildOrderCreatedOutboxRecord(order);

  batch.set(doc(db, 'tenants', order.tenantId, 'orders', order.id), order);
  batch.set(doc(db, 'tenants', order.tenantId, 'eventOutbox', outbox.event.id), outbox);

  return batch;
}

export function enqueueOrderCreatedEventLocal(order: OrderRecord): void {
  const outbox = buildOrderCreatedOutboxRecord(order);
  const key = localOutboxKey(order.tenantId);

  let records: CommerceOutboxRecord[] = [];
  try {
    const raw = localStorage.getItem(key);
    if (raw) records = JSON.parse(raw) as CommerceOutboxRecord[];
  } catch {
    records = [];
  }

  const withoutDuplicate = records.filter(record => record.event.id !== outbox.event.id);
  localStorage.setItem(key, JSON.stringify([outbox, ...withoutDuplicate]));
}

export function readLocalCommerceEventOutbox(tenantId: string): CommerceOutboxRecord[] {
  try {
    const raw = localStorage.getItem(localOutboxKey(tenantId));
    return raw ? (JSON.parse(raw) as CommerceOutboxRecord[]) : [];
  } catch {
    return [];
  }
}
