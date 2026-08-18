const env = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) as
  | Record<string, string | undefined>
  | undefined;

const DEFAULT_SALES_WHATSAPP = '5491156199363';
const DEFAULT_SALES_EMAIL = 'devtrivi@zengasoft.com';
const ATTR_KEY = 'trufi_attr_v1';

const DEFAULT_MESSAGE =
  'Hola, vi una demo de Soluciones Web Gatrivi.com y quiero una tienda para mi negocio.';

export interface SalesContactConfig {
  whatsappNumber?: string;
  email?: string;
}

function resolveSalesConfig(overrides: SalesContactConfig = {}): SalesContactConfig {
  return {
    whatsappNumber:
      overrides.whatsappNumber ?? env?.VITE_SALES_WHATSAPP_NUMBER ?? DEFAULT_SALES_WHATSAPP,
    email: overrides.email ?? env?.VITE_SALES_EMAIL ?? DEFAULT_SALES_EMAIL,
  };
}

function getReferralContext(): { ref?: string; flyer?: string } {
  if (typeof window === 'undefined') return {};
  const fromUrl = new URLSearchParams(window.location.search);
  let stored: { ref?: string; flyer?: string } = {};
  try {
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (raw) stored = JSON.parse(raw) as { ref?: string; flyer?: string };
  } catch {
    // Ignore storage failures.
  }
  return {
    ref: fromUrl.get('ref')?.trim() || stored.ref,
    flyer: fromUrl.get('flyer')?.trim() || stored.flyer,
  };
}

export function buildSalesContactHrefFrom(
  config: SalesContactConfig,
  source = 'sitio',
): string {
  const whatsapp = (config.whatsappNumber || '').replace(/\D/g, '');
  const email = config.email?.trim() || DEFAULT_SALES_EMAIL;
  const message = `${DEFAULT_MESSAGE}\n\nOrigen: ${source}`;

  if (whatsapp) {
    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  }

  const subject = 'Quiero una demo de Gatrivi.com';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
}

export function buildSalesContactHref(source = 'sitio'): string {
  const referral = getReferralContext();
  const sourceBits = [
    source,
    referral.ref ? `referido ${referral.ref}` : '',
    referral.flyer ? `flyer ${referral.flyer}` : '',
  ].filter(Boolean);
  const target = buildSalesContactHrefFrom(resolveSalesConfig(), sourceBits.join(' · '));
  if (!referral.flyer || typeof window === 'undefined') return target;
  const params = new URLSearchParams({ flyer: referral.flyer, to: target });
  return `/referido/contact?${params.toString()}`;
}

export function hasSalesWhatsAppFrom(config: SalesContactConfig): boolean {
  return Boolean((config.whatsappNumber || '').replace(/\D/g, ''));
}

export function hasSalesWhatsApp(): boolean {
  return hasSalesWhatsAppFrom(resolveSalesConfig());
}
