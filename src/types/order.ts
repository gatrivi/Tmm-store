export type OrderStatus =
  | 'new'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'rejected'
  | 'cancelled';

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
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Nuevo',
  accepted: 'Aceptado',
  preparing: 'Preparando',
  ready: 'Listo',
  delivered: 'Entregado',
  rejected: 'Rechazado',
  cancelled: 'Cancelado',
};

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'new',
  'accepted',
  'preparing',
  'ready',
  'delivered',
];
