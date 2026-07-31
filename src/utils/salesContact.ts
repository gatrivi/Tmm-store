const env = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) as
  | Record<string, string | undefined>
  | undefined;

const DEFAULT_MESSAGE =
  'Hola, vi una demo de Soluciones Web Gatrivi.com y quiero una tienda para mi negocio.';

export interface SalesContactConfig {
  whatsappNumber?: string;
  email?: string;
}

export function buildSalesContactHrefFrom(
  config: SalesContactConfig,
  source = 'sitio',
): string {
  const whatsapp = (config.whatsappNumber || '').replace(/\D/g, '');
  const email = config.email?.trim() || 'devtrivi@zengasoft.com';
  const message = `${DEFAULT_MESSAGE}\n\nOrigen: ${source}`;

  if (whatsapp) {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  }

  const subject = 'Quiero una demo de Gatrivi.com';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export function buildSalesContactHref(source = 'sitio'): string {
  return buildSalesContactHrefFrom(
    { whatsappNumber: env?.VITE_SALES_WHATSAPP_NUMBER, email: env?.VITE_SALES_EMAIL },
    source,
  );
}

export function hasSalesWhatsAppFrom(config: SalesContactConfig): boolean {
  return Boolean((config.whatsappNumber || '').replace(/\D/g, ''));
}

export function hasSalesWhatsApp(): boolean {
  return hasSalesWhatsAppFrom({ whatsappNumber: env?.VITE_SALES_WHATSAPP_NUMBER });
}
