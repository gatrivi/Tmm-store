import type { DeliveryType, OrderStatus } from '../types/order';

const TERMINAL: ReadonlySet<OrderStatus> = new Set([
  'completed',
  'rejected',
  'cancelled',
]);

/** next status for the single primary CTA */
export function nextOperationalStatus(
  status: OrderStatus,
  fulfillment: DeliveryType,
): OrderStatus | null {
  switch (status) {
    case 'new':
      return 'preparing';
    case 'preparing':
      return 'ready';
    case 'ready':
      return fulfillment === 'delivery' ? 'out_for_delivery' : 'completed';
    case 'out_for_delivery':
      return 'completed';
    default:
      return null;
  }
}

export function primaryActionLabel(
  status: OrderStatus,
  fulfillment: DeliveryType,
): string | null {
  switch (status) {
    case 'new':
      return 'Aceptar y preparar';
    case 'preparing':
      return fulfillment === 'delivery'
        ? 'Marcar listo para enviar'
        : 'Marcar listo para retirar';
    case 'ready':
      return fulfillment === 'delivery' ? 'Marcar en camino' : 'Marcar retirado';
    case 'out_for_delivery':
      return 'Marcar entregado';
    default:
      return null;
  }
}

export function canTransition(from: OrderStatus, to: OrderStatus, fulfillment: DeliveryType): boolean {
  if (from === 'new' && to === 'rejected') return true;
  if ((from === 'preparing' || from === 'ready') && to === 'cancelled') return true;
  return nextOperationalStatus(from, fulfillment) === to;
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return TERMINAL.has(status);
}

export function inboxFilterBucket(
  status: OrderStatus,
): 'new' | 'preparing' | 'ready' | 'done' | null {
  if (status === 'new') return 'new';
  if (status === 'preparing') return 'preparing';
  if (status === 'ready' || status === 'out_for_delivery') return 'ready';
  if (status === 'completed' || status === 'rejected' || status === 'cancelled') return 'done';
  return null;
}

/** ponytail: DEV self-check — fails loud if table drifts */
export function assertOrderStateMachine(): void {
  const cases: Array<[OrderStatus, DeliveryType, OrderStatus | null, string | null]> = [
    ['new', 'pickup', 'preparing', 'Aceptar y preparar'],
    ['new', 'delivery', 'preparing', 'Aceptar y preparar'],
    ['preparing', 'pickup', 'ready', 'Marcar listo para retirar'],
    ['preparing', 'delivery', 'ready', 'Marcar listo para enviar'],
    ['ready', 'pickup', 'completed', 'Marcar retirado'],
    ['ready', 'delivery', 'out_for_delivery', 'Marcar en camino'],
    ['out_for_delivery', 'delivery', 'completed', 'Marcar entregado'],
    ['completed', 'pickup', null, null],
    ['rejected', 'pickup', null, null],
  ];
  for (const [status, fulfillment, next, label] of cases) {
    const gotNext = nextOperationalStatus(status, fulfillment);
    const gotLabel = primaryActionLabel(status, fulfillment);
    if (gotNext !== next || gotLabel !== label) {
      throw new Error(
        `orderStateMachine drift: ${status}/${fulfillment} → ${gotNext}/${gotLabel}`,
      );
    }
  }
  if (!canTransition('new', 'rejected', 'pickup')) {
    throw new Error('orderStateMachine: reject from new must be allowed');
  }
}
