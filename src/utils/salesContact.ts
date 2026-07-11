const SALES_EMAIL = (
  import.meta.env.VITE_SALES_EMAIL as string | undefined
)?.trim() || 'devtrivi@zengasoft.com';

const SALES_WHATSAPP = (
  import.meta.env.VITE_SALES_WHATSAPP_NUMBER as string | undefined
)?.replace(/\D/g, '') || '';

const DEFAULT_MESSAGE =
  'Hola, vi la demo de Trufi y quiero una versión para mi negocio.';

export function buildSalesContactHref(source = 'sitio'): string {
  const message = `${DEFAULT_MESSAGE}\n\nOrigen: ${source}`;

  if (SALES_WHATSAPP) {
    return `https://wa.me/${SALES_WHATSAPP}?text=${encodeURIComponent(message)}`;
  }

  const subject = 'Quiero una demo de Trufi';
  return `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export function hasSalesWhatsApp(): boolean {
  return Boolean(SALES_WHATSAPP);
}
