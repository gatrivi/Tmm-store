export interface ProspectDemoConfig {
  businessName: string;
  area: string;
  category: ProspectCategory;
  categoryLabel: string;
  color: ProspectColor;
  colorValue: string;
  customized: boolean;
}

export type ProspectCategory = keyof typeof PROSPECT_CATEGORIES;
export type ProspectColor = keyof typeof PROSPECT_COLORS;

export const PROSPECT_CATEGORIES = {
  gastronomia: 'Gastronomía',
  pizzeria: 'Pizzería',
  rotiseria: 'Rotisería',
  cafeteria: 'Cafetería',
  panaderia: 'Panadería',
  almacen: 'Almacén',
  dietetica: 'Dietética',
  petshop: 'Pet shop',
} as const;

export const PROSPECT_COLORS = {
  carbon: '#171814',
  coral: '#b94335',
  verde: '#176b4d',
  azul: '#3556a8',
  violeta: '#67439a',
} as const;

const DEFAULT_CONFIG = {
  businessName: 'Club Social Olivos',
  area: 'Olivos · Vicente López',
  category: 'gastronomia' as const,
  color: 'carbon' as const,
};

function cleanText(value: string | null, fallback: string, maxLength: number): string {
  const cleaned = value?.replace(/\s+/g, ' ').trim().slice(0, maxLength);
  return cleaned || fallback;
}

function isCategory(value: string | null): value is ProspectCategory {
  return Boolean(value && value in PROSPECT_CATEGORIES);
}

function isColor(value: string | null): value is ProspectColor {
  return Boolean(value && value in PROSPECT_COLORS);
}

export function parseProspectDemo(search = ''): ProspectDemoConfig {
  const params = new URLSearchParams(search);
  const categoryParam = params.get('rubro');
  const colorParam = params.get('color');
  const category = isCategory(categoryParam) ? categoryParam : DEFAULT_CONFIG.category;
  const color = isColor(colorParam) ? colorParam : DEFAULT_CONFIG.color;

  return {
    businessName: cleanText(params.get('negocio'), DEFAULT_CONFIG.businessName, 60),
    area: cleanText(params.get('barrio'), DEFAULT_CONFIG.area, 60),
    category,
    categoryLabel: PROSPECT_CATEGORIES[category],
    color,
    colorValue: PROSPECT_COLORS[color],
    customized: ['negocio', 'barrio', 'rubro', 'color'].some(key => params.has(key)),
  };
}

export function buildProspectDemoSearch(
  input: Pick<ProspectDemoConfig, 'businessName' | 'area' | 'category' | 'color'>,
): string {
  const params = new URLSearchParams({
    negocio: input.businessName.trim(),
    barrio: input.area.trim(),
    rubro: input.category,
    color: input.color,
  });
  return `?${params.toString()}`;
}

export function getProspectDemoInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'TN';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words.at(-1)?.[0] || ''}`.toUpperCase();
}

export function buildProspectLogoDataUrl(config: ProspectDemoConfig): string {
  const initials = getProspectDemoInitials(config.businessName)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">',
    `<rect width="160" height="160" rx="80" fill="${config.colorValue}"/>`,
    '<circle cx="80" cy="80" r="61" fill="none" stroke="rgba(255,255,255,.72)" stroke-width="3"/>',
    `<text x="80" y="96" fill="#fff" font-family="Arial,sans-serif" font-size="48" font-weight="800" text-anchor="middle">${initials}</text>`,
    '</svg>',
  ].join('');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
