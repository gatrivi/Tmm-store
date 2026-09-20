import { strict as assert } from 'node:assert';
import { createCommerceOrderCreatedEvent } from './commerceEvents';
import type { OrderRecord } from '../types/order';

const order: OrderRecord = {
  id: 'TMM-1234',
  tenantId: 'pizza-g',
  status: 'new',
  customerName: 'Test',
  customerPhone: '11111111',
  deliveryType: 'pickup',
  address: '',
  paymentMethod: 'mercadopago',
  paymentStatus: 'pending',
  notes: '',
  items: [],
  subtotal: 22500,
  discount: 0,
  total: 22500,
  createdAt: '2026-08-17T22:00:00.000Z',
  updatedAt: '2026-08-17T22:00:00.000Z',
  source: 'storefront',
};

const event = createCommerceOrderCreatedEvent(order);

assert.equal(event.specversion, '1.0');
assert.equal(event.type, 'commerce.order.created.v1');
assert.equal(event.id, 'order.created:pizza-g:TMM-1234');
assert.equal(event.subject, 'order/TMM-1234');
assert.equal(event.tenantid, 'pizza-g');
assert.equal(event.data.orderId, 'TMM-1234');
assert.equal(event.data.total, 22500);
assert.equal(event.data.paymentMethod, 'mercadopago');

console.log('commerceEvents.selfcheck: ok');
