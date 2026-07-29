const env = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) as
  | Record<string, string | undefined>
  | undefined;

const SALES_EMAIL = env?.VITE_SALES_EMAIL?.trim() || 'devtrivi@zengasoft.com';

const SALES_WHATSAPP = (env?.VITE_SALES_WHATSAPP_NUMBER || '').replace(/\D/g, '');

const DEFAULT_MESSAGE =
  'Hola, vi una demo de Soluciones Web Gatrivi.com y quiero una tienda para mi negocio.';

export function buildSalesContactHref(source = 'sitio'): string {
  const message = `${DEFAULT_MESSAGE}\n\nOrigen: ${source}`;

  if (SALES_WHATSAPP) {
    return `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }

  const subject = 'Quiero una demo de Gatrivi.com';
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export function hasSalesWhatsApp(): boolean {
  return Boolean(SALES_WHATSAPP);
}
