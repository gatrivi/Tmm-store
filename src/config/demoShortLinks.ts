export const GATRIVI_ORIGIN = 'https://gatrivi.com';

export type DemoShortLink = {
  id: string;
  label: string;
  shortPath: string;
  legacyPath: string;
};

/**
 * Public, memorable demo URLs. Legacy /demo/... routes stay valid for links already in circulation.
 */
export const DEMO_SHORT_LINKS: DemoShortLink[] = [
  { id: 'panaderia', label: 'Panadería', shortPath: '/panaderia', legacyPath: '/demo/panaderia' },
  { id: 'heladeria', label: 'Heladería', shortPath: '/heladeria', legacyPath: '/demo/heladeria' },
  { id: 'cafe-roca', label: 'Café / restaurante', shortPath: '/cafe-roca', legacyPath: '/demo/cafe-roca' },
  { id: 'pizzeria', label: 'Pizzería', shortPath: '/pizzeria', legacyPath: '/demo/pizzeria' },
  { id: 'zimba-pet', label: 'Pet shop', shortPath: '/zimba-pet', legacyPath: '/demo/zimba-pet' },
  { id: 'canavesi', label: 'Carnicería Canavesi', shortPath: '/canavesi', legacyPath: '/demo/canavesi' },
  { id: 'carniceria', label: 'Carnicería', shortPath: '/carniceria', legacyPath: '/demo/carniceria' },
  { id: 'molino-florida', label: 'Molino', shortPath: '/molino-florida', legacyPath: '/demo/molino-florida' },
  { id: 'ferreteria', label: 'Ferretería', shortPath: '/ferreteria', legacyPath: '/demo/ferreteria' },
  { id: 'mamabel', label: 'Repostería', shortPath: '/mamabel', legacyPath: '/demo/mamabel' },
  { id: 'aguacats', label: 'Frescos', shortPath: '/aguacats', legacyPath: '/demo/aguacats' },
  { id: 'verduleria', label: 'Verdulería', shortPath: '/verduleria', legacyPath: '/demo/verduleria' },
  { id: 'confiteria-parana', label: 'Confitería', shortPath: '/confiteria-parana', legacyPath: '/demo/confiteria-parana' },
];

function cleanPath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

export function getDemoShortPath(id: string): string | null {
  return DEMO_SHORT_LINKS.find(link => link.id === id)?.shortPath ?? null;
}

export function getDemoShortLinkForPath(pathname: string): DemoShortLink | null {
  const path = cleanPath(pathname);
  return DEMO_SHORT_LINKS.find(link => path === link.shortPath || path === link.legacyPath) ?? null;
}

export function buildShortDemoUrl(link: DemoShortLink): string {
  return `${GATRIVI_ORIGIN}${link.shortPath}`;
}
