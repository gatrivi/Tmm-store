/**
 * Passive-sales intake: Tally + UTM. No backend.
 * @see docs/roadmap/passive-sales-petshop-landing.md
 */
import { buildSalesContactHref, hasSalesWhatsApp } from './salesContact';

const ATTR_KEY = 'trufi_attr_v1';
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

export type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;

function readStored(): Attribution {
  try {
    if (typeof sessionStorage === 'undefined') return {};
    const raw = sessionStorage.getItem(ATTR_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Attribution;
  } catch {
    return {};
  }
}

/** Capture UTM from current URL into sessionStorage (merge, don't wipe). */
export function captureAttribution(search = typeof window !== 'undefined' ? window.location.search : ''): Attribution {
  const params = new URLSearchParams(search);
  const next = { ...readStored() };
  let changed = false;
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      next[key] = value.slice(0, 80);
      changed = true;
    }
  }
  if (changed && typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(ATTR_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
  }
  return next;
}

export function getAttribution(): Attribution {
  return readStored();
}

/** Append stored UTM (+ extras) onto a path or absolute URL. */
export function withAttribution(
  pathOrUrl: string,
  extra: Record<string, string | undefined> = {},
): string {
  const attr = { ...getAttribution(), ...extra };
  const hashIdx = pathOrUrl.indexOf('#');
  const withoutHash = hashIdx >= 0 ? pathOrUrl.slice(0, hashIdx) : pathOrUrl;
  const hash = hashIdx >= 0 ? pathOrUrl.slice(hashIdx) : '';
  const qIdx = withoutHash.indexOf('?');
  const base = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;
  const params = new URLSearchParams(qIdx >= 0 ? withoutHash.slice(qIdx + 1) : '');
  for (const [key, value] of Object.entries(attr)) {
    if (value?.trim()) params.set(key, value.trim());
  }
  const qs = params.toString();
  return `${base}${qs ? `?${qs}` : ''}${hash}`;
}

export function getDemoPriceLabel(): string {
  const env = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) as
    | Record<string, string | undefined>
    | undefined;
  const fromEnv = env?.VITE_DEMO_PRICE_LABEL?.trim();
  return fromEnv || '$325.000';
}

export function getDemoIntakeUrl(): string {
  const env = (typeof import.meta !== 'undefined' ? import.meta.env : undefined) as
    | Record<string, string | undefined>
    | undefined;
  return env?.VITE_DEMO_INTAKE_URL?.trim() || '';
}

export function hasDemoIntake(): boolean {
  return Boolean(getDemoIntakeUrl());
}

/** Primary reserve CTA — Tally with hidden fields, else WhatsApp fallback. */
export function buildReserveHref(opts: {
  source?: string;
  demoUrl?: string;
  rubro?: string;
  businessName?: string;
} = {}): string {
  const intake = getDemoIntakeUrl();
  const source = opts.source || 'landing reserva';
  if (intake) {
    return withAttribution(intake, {
      demo_url: opts.demoUrl,
      rubro_demo: opts.rubro,
      negocio: opts.businessName,
    });
  }
  const bits = [
    'Hola, quiero reservar una tienda de Soluciones Web Gatrivi.com.',
    opts.businessName ? `Negocio: ${opts.businessName}` : '',
    opts.rubro ? `Rubro: ${opts.rubro}` : '',
    opts.demoUrl ? `Demo: ${opts.demoUrl}` : '',
  ].filter(Boolean);
  return buildSalesContactHref(`${source}\n${bits.join('\n')}`);
}

export function reserveCtaLabel(): string {
  return hasDemoIntake() ? 'Reservar mi tienda' : (hasSalesWhatsApp() ? 'Reservar por WhatsApp' : 'Reservar (escribir)');
}
