/** Hero A/B — sticky per session; override con ?hero=a|b */
const HERO_KEY = 'trufi_landing_hero_v1';

export type HeroVariant = 'a' | 'b';

export const HERO_VARIANTS = {
  a: {
    badge: 'Zona Norte · Listo en 3 días',
    headline: ['Dejá de contestar siempre lo mismo.', 'Mostrá tus productos online.'],
    headlineAccentLine: 1,
    subheadline: [
      'Catálogos, landings y tiendas online.',
      'Tu marca, tu dominio, sin comisión por venta.',
    ],
    trust: ['Sin app', 'Sin comisión', 'Dominio propio incluido', 'Panel simple'],
  },
  b: {
    badge: 'Zona Norte · Listo en 3 días',
    headline: ['“Siempre me preguntan lo mismo…”', 'Solucionalo con un link.'],
    headlineAccentLine: 1,
    subheadline: [
      'Catálogo, landing o tienda online completa.',
      'Tus productos claros, actualizados y profesionales.',
    ],
    trust: ['Sin app', 'Sin comisión', 'Dominio propio incluido', 'Panel simple'],
  },
} as const;

export function resolveHeroVariant(search = ''): HeroVariant {
  const q = new URLSearchParams(search).get('hero');
  if (q === 'a' || q === 'b') {
    try {
      sessionStorage.setItem(HERO_KEY, q);
    } catch {
      /* ignore */
    }
    return q;
  }
  try {
    const stored = sessionStorage.getItem(HERO_KEY);
    if (stored === 'a' || stored === 'b') return stored;
  } catch {
    /* ignore */
  }
  const v: HeroVariant = Math.random() < 0.5 ? 'a' : 'b';
  try {
    sessionStorage.setItem(HERO_KEY, v);
  } catch {
    /* ignore */
  }
  return v;
}

export function setHeroVariant(v: HeroVariant): void {
  try {
    sessionStorage.setItem(HERO_KEY, v);
  } catch {
    /* ignore */
  }
}

export function heroContactSource(v: HeroVariant): string {
  return `landing hero ${v}`;
}
