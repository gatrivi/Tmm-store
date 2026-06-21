import type { OrderRecord, OrderLineItem } from '../types/order';
import type { CheckoutData } from '../components/CheckoutModal';

interface BuildOrderInput {
  tenantId: string;
  checkout: CheckoutData;
  cart: OrderLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export function buildOrderRecord(input: BuildOrderInput): OrderRecord {
  const now = new Date().toISOString();
  return {
    id: input.checkout.orderId,
    tenantId: input.tenantId,
    status: 'new',
    customerName: input.checkout.name,
    customerPhone: input.checkout.phone,
    deliveryType: input.checkout.deliveryType,
    address: input.checkout.address,
    paymentMethod: input.checkout.paymentMethod,
    paymentStatus: input.checkout.paymentMethod === 'mercadopago' ? 'pending' : 'pending',
    notes: input.checkout.notes,
    items: input.cart,
    subtotal: input.subtotal,
    discount: input.discount,
    total: input.total,
    promoCode: input.promoCode,
    createdAt: now,
    updatedAt: now,
  };
}
