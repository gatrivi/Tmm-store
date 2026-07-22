import type { OrderRecord } from '../types/order';
import type { OrderStatus } from '../types/order';

export type WhatsAppTemplateId = 'received' | 'preparing' | 'ready';

const TEMPLATE_BODIES: Record<WhatsAppTemplateId, (order: OrderRecord, statusUrl: string) => string> = {
  received: (order, statusUrl) =>
    `Hola ${order.customerName}! Recibimos tu pedido *#${order.id}* por $${order.total.toLocaleString('es-AR')}. Lo estamos preparando.\n\nSeguí el estado: ${statusUrl}`,
  preparing: (order, statusUrl) =>
    `Tu pedido *#${order.id}* ya está en preparación. Te avisamos cuando esté listo.\n\n${statusUrl}`,
  ready: (order, statusUrl) =>
    order.deliveryType === 'delivery'
      ? `Tu pedido *#${order.id}* está listo y sale en camino. Gracias!\n\n${statusUrl}`
      : `Tu pedido *#${order.id}* está listo para retirar. Te esperamos!\n\n${statusUrl}`,
};

export function buildWhatsAppTemplateMessage(
  templateId: WhatsAppTemplateId,
  order: OrderRecord,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
): string {
  const statusUrl = `${baseUrl}/order/${order.id}`;
  return TEMPLATE_BODIES[templateId](order, statusUrl);
}

export function openWhatsAppChat(phone: string, message: string): void {
  const normalized = phone.replace(/\D/g, '');
  if (!normalized) return;
  const url = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

export function openWhatsAppForOrder(
  phone: string,
  order: OrderRecord,
  templateId: WhatsAppTemplateId,
): void {
  openWhatsAppChat(phone, buildWhatsAppTemplateMessage(templateId, order));
}

export function templateForStatus(status: OrderStatus): WhatsAppTemplateId | null {
  if (status === 'preparing') return 'received';
  if (status === 'ready' || status === 'out_for_delivery') return 'ready';
  return null;
}

export const WHATSAPP_TEMPLATE_LABELS: Record<WhatsAppTemplateId, string> = {
  received: 'Recibido',
  preparing: 'Preparando',
  ready: 'Listo',
};
