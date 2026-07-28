import { sanitizeWaText } from './whatsappMessage';

export const MAMABEL_WSP = '5491156196941';

export type MamabelFulfillment = 'pickup' | 'delivery';

export type MamabelEncargo = {
  name: string;
  occasion: string;
  portions: string;
  flavor: string;
  filling: string;
  dateNeeded: string;
  fulfillment: MamabelFulfillment;
  idea: string;
  notes: string;
};

export type MamabelEncargoErrors = Partial<
  Record<'portions' | 'dateNeeded', string>
>;

const OCCASION_FALLBACK = 'A definir';
const FLAVOR_FALLBACK = 'A definir';

/** Validate required fields; keep other values intact for correction. */
export function validateMamabelEncargo(e: MamabelEncargo): MamabelEncargoErrors {
  const errors: MamabelEncargoErrors = {};
  const portions = e.portions.trim();
  if (!portions) errors.portions = 'Indicá cantidad aproximada de porciones';
  else if (!/^\d{1,3}$/.test(portions) || Number(portions) < 1) {
    errors.portions = 'Usá un número válido (ej. 20)';
  }
  if (!e.dateNeeded.trim()) errors.dateNeeded = 'Indicá la fecha necesaria';
  return errors;
}

export function buildMamabelEncargoMessage(e: MamabelEncargo): string {
  const fulfillment =
    e.fulfillment === 'delivery' ? 'Delivery (a coordinar)' : 'Retiro';
  const lines = [
    '🎂 *Encargo — Las Tortas de Mamá Mabel*',
    '━━━━━━━━━━━━━━━━━━',
    '',
    e.name.trim()
      ? `👤 *Nombre:* ${sanitizeWaText(e.name.trim())}`
      : null,
    `🎉 *Ocasión:* ${sanitizeWaText(e.occasion.trim() || OCCASION_FALLBACK)}`,
    `🍽 *Porciones:* ${sanitizeWaText(e.portions.trim())}`,
    `🍰 *Sabor:* ${sanitizeWaText(e.flavor.trim() || FLAVOR_FALLBACK)}`,
    `🧁 *Relleno:* ${sanitizeWaText(e.filling.trim() || FLAVOR_FALLBACK)}`,
    `📅 *Fecha:* ${sanitizeWaText(e.dateNeeded.trim())}`,
    `🚚 *Entrega:* ${fulfillment}`,
  ].filter(Boolean) as string[];

  if (e.idea.trim()) {
    lines.push(`💡 *Idea / tema:* ${sanitizeWaText(e.idea.trim())}`);
  }
  if (e.notes.trim()) {
    lines.push(`📝 *Notas:* ${sanitizeWaText(e.notes.trim())}`);
  }

  lines.push(
    '',
    '📎 _Si tenés una foto de referencia, adjuntarla en este chat._',
    '',
    'Cotizar — sin precio cerrado online.',
  );

  return lines.join('\n');
}

export function buildMamabelWaUrl(
  e: MamabelEncargo,
  phone = MAMABEL_WSP,
): string {
  const text = encodeURIComponent(buildMamabelEncargoMessage(e));
  return `https://wa.me/${phone}?text=${text}`;
}
