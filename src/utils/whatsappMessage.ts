/**
 * Sanitiza texto para evitar que caracteres Markdown de WhatsApp
 * rompan el formato del mensaje.
 */
export function sanitizeWaText(text: string): string {
  return text
    .replace(/\*/g, '✱')
    .replace(/_/g, '-')
    .replace(/`/g, "'")
    .replace(/~/g, '-');
}

/**
 * Genera el mensaje de WhatsApp formateado.
 */
export function buildWhatsAppMessage(params: {
  orderId: string;
  name: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  address: string;
  paymentMethod: 'cash' | 'transfer' | 'mercadopago';
  paymentLabel: string;
  bankAlias: string;
  notes: string;
  cart: Array<{ qty: number; name: string; optionLabel: string; price: number; itemNotes?: string }>;
  total: number;
  tip: number;
}): string {
  const { orderId, name, phone, deliveryType, address, paymentMethod, paymentLabel, bankAlias, notes, cart, total, tip } = params;

  let message = `🛒 *Pedido #${orderId}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;

  message += `👤 *Cliente:* ${sanitizeWaText(name.trim())}\n`;
  message += `📱 *Teléfono:* ${sanitizeWaText(phone.trim())}\n`;
  message += `🚚 *Entrega:* ${deliveryType === 'pickup' ? 'Retiro en local' : 'Delivery'}\n`;
  if (deliveryType === 'delivery') {
    message += `📍 *Dirección:* ${sanitizeWaText(address.trim())}\n`;
  }
  message += `💳 *Pago:* ${paymentLabel}\n`;
  message += `\n━━━━━━━━━━━━━━━━━━\n`;
  message += `*Detalle del pedido:*\n\n`;

  cart.forEach(item => {
    message += `• ${item.qty}x ${sanitizeWaText(item.name)} (${sanitizeWaText(item.optionLabel)}) — $${(item.price * item.qty).toLocaleString('es-AR')}`;
    if (item.itemNotes) {
      message += `\n  📝 ${sanitizeWaText(item.itemNotes)}`;
    }
    message += `\n`;
  });

  if (tip > 0) {
    message += `\n💰 *Propina:* $${tip.toLocaleString('es-AR')}\n`;
  }

  message += `\n*Total: $${(total + tip).toLocaleString('es-AR')}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;

  if (paymentMethod === 'transfer' && bankAlias) {
    message += `\n🏦 Alias para transferencia: *${sanitizeWaText(bankAlias)}*\n`;
  }

  if (notes.trim()) {
    message += `\n📝 *Notas:* ${sanitizeWaText(notes.trim())}\n`;
  }

  message += `\n¡Gracias por elegirnos! 🙌`;

  return message;
}
