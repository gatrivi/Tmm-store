import type { OrderRecord } from '../types/order';
import { ORDER_STATUS_LABELS } from '../types/order';

export type TicketFormat = 'thermal58' | 'a4';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildTicketHtml(order: OrderRecord, format: TicketFormat): string {
  const lines = order.items
    .map(
      i =>
        `<tr><td>${i.qty}x ${escapeHtml(i.name)}<br/><small>${escapeHtml(i.optionLabel)}</small></td><td style="text-align:right">$${(i.price * i.qty).toLocaleString('es-AR')}</td></tr>`,
    )
    .join('');

  const delivery =
    order.deliveryType === 'delivery'
      ? `Delivery: ${escapeHtml(order.address)}`
      : 'Retiro en local';

  const thermalCss =
    format === 'thermal58'
      ? `@page{size:58mm auto;margin:2mm}body{width:54mm;font-family:monospace;font-size:11px;margin:0;padding:4px}h1{font-size:14px;margin:0 0 4px}table{width:100%;border-collapse:collapse}td{padding:2px 0;vertical-align:top}.meta{font-size:10px;margin:4px 0}.total{font-size:13px;font-weight:bold;margin-top:6px;border-top:1px dashed #000;padding-top:4px}`
      : `@page{margin:12mm}body{font-family:system-ui,sans-serif;max-width:720px;margin:0 auto}table{width:100%;border-collapse:collapse}td,th{padding:6px;border-bottom:1px solid #eee}`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Pedido #${order.id}</title><style>${thermalCss}</style></head><body>
<h1>PEDIDO #${order.id}</h1>
<p class="meta">${new Date(order.createdAt).toLocaleString('es-AR')} · ${ORDER_STATUS_LABELS[order.status]}</p>
<p class="meta"><strong>${escapeHtml(order.customerName)}</strong><br/>${escapeHtml(order.customerPhone)}</p>
<p class="meta">${delivery}</p>
<table>${lines}</table>
${order.discount > 0 ? `<p class="meta">Descuento: -$${order.discount.toLocaleString('es-AR')}</p>` : ''}
<p class="total">TOTAL: $${order.total.toLocaleString('es-AR')} · ${order.paymentMethod}</p>
${order.notes ? `<p class="meta">Notas: ${escapeHtml(order.notes)}</p>` : ''}
</body></html>`;
}

export function printOrderTicket(order: OrderRecord, format: TicketFormat = 'thermal58'): boolean {
  const win = window.open('', '_blank', 'width=400,height=600');
  if (!win) return false;
  win.document.write(buildTicketHtml(order, format));
  win.document.close();
  win.focus();
  win.print();
  return true;
}
