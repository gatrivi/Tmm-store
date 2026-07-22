export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'completed'
  | 'rejected'
  | 'cancelled';

/** Legado — solo lectura; no volver a escribir. */
export type LegacyOrderStatus = 'accepted' | 'delivered';

export type PaymentMethod = 'cash' | 'transfer' | 'mercadopago';
export type DeliveryType = 'pickup' | 'delivery';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface OrderLineItem {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
}

export interface OrderRecord {
  id: string;
  tenantId: string;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes: string;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  mpPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  /** demo | storefront | admin — opcional hasta Hito 2 */
  source?: 'storefront' | 'demo' | 'admin';
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nuevo',
  preparing: 'Preparando',
  ready: 'Listo',
  out_for_delivery: 'En camino',
  completed: 'Finalizado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

/** Flujo operativo activo (no terminal). */
export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'new',
  'preparing',
  'ready',
  'out_for_delivery',
];

export function normalizeOrderStatus(raw: string): OrderStatus {
  if (raw === 'accepted') return 'preparing';
  if (raw === 'delivered') return 'completed';
  return raw as OrderStatus;
}

export function normalizeOrderRecord(order: OrderRecord): OrderRecord {
  const status = normalizeOrderStatus(order.status as string);
  return status === order.status ? order : { ...order, status };
}
