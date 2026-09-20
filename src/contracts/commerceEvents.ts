import type { OrderRecord, PaymentMethod } from '../types/order';

export const COMMERCE_ORDER_CREATED_V1 = 'commerce.order.created.v1' as const;

export interface CommerceOrderCreatedData {
  orderId: string;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: OrderRecord['paymentStatus'];
  source: NonNullable<OrderRecord['source']> | 'unknown';
}

export interface CommerceOrderCreatedEventV1 {
  specversion: '1.0';
  id: string;
  source: 'tmm-store';
  type: typeof COMMERCE_ORDER_CREATED_V1;
  subject: string;
  tenantid: string;
  time: string;
  datacontenttype: 'application/json';
  data: CommerceOrderCreatedData;
}

export function createCommerceOrderCreatedEvent(
  order: OrderRecord,
): CommerceOrderCreatedEventV1 {
  const event: CommerceOrderCreatedEventV1 = {
    specversion: '1.0',
    id: `order.created:${order.tenantId}:${order.id}`,
    source: 'tmm-store',
    type: COMMERCE_ORDER_CREATED_V1,
    subject: `order/${order.id}`,
    tenantid: order.tenantId,
    time: order.createdAt,
    datacontenttype: 'application/json',
    data: {
      orderId: order.id,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      source: order.source ?? 'unknown',
    },
  };

  assertCommerceOrderCreatedEvent(event);
  return event;
}

export function assertCommerceOrderCreatedEvent(
  event: CommerceOrderCreatedEventV1,
): void {
  if (event.specversion !== '1.0') throw new Error('Invalid CloudEvents specversion');
  if (!event.id) throw new Error('Event id is required');
  if (event.source !== 'tmm-store') throw new Error('Invalid event source');
  if (event.type !== COMMERCE_ORDER_CREATED_V1) throw new Error('Invalid event type');
  if (!event.subject.startsWith('order/')) throw new Error('Invalid event subject');
  if (!event.tenantid) throw new Error('tenantid is required');
  if (Number.isNaN(Date.parse(event.time))) throw new Error('Event time must be ISO-compatible');
  if (!event.data.orderId) throw new Error('orderId is required');
  if (!Number.isFinite(event.data.total) || event.data.total < 0) {
    throw new Error('Order total must be a non-negative finite number');
  }
}
