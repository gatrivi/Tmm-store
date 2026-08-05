export type LandingPaletteId = 'cream' | 'midnight' | 'ocean' | 'forest';

export interface LandingPalette {
  id: LandingPaletteId;
  name: string;
  swatch: string;
  vars: Record<string, string>;
  darkVars: Record<string, string>;
}

const BASE_LIGHT = {
  '--lp-bg': '#f2eee6',
  '--lp-surface': '#fbfaf6',
  '--lp-surface-alt': '#f2eee6',
  '--lp-ink': '#171814',
  '--lp-text': '#171814',
  '--lp-text-muted': 'rgba(23, 24, 20, 0.55)',
  '--lp-border': 'rgba(23, 24, 20, 0.08)',
  '--lp-footer': '#10110e',
  '--lp-on-ink': '#ffffff',
  '--lp-header-bg': 'rgba(242, 238, 230, 0.92)',
};

const BASE_DARK = {
  '--lp-bg': '#0c0d0b',
  '--lp-surface': '#141612',
  '--lp-surface-alt': '#1a1916',
  '--lp-ink': '#f5f2ea',
  '--lp-text': '#f5f2ea',
  '--lp-text-muted': 'rgba(245, 242, 234, 0.58)',
  '--lp-border': 'rgba(255, 255, 255, 0.1)',
  '--lp-footer': '#080807',
  '--lp-on-ink': '#0c0d0b',
  '--lp-header-bg': 'rgba(12, 13, 11, 0.92)',
};

export const LANDING_PALETTES: LandingPalette[] = [
  {
    id: 'cream',
    name: 'Cream & coral',
    swatch: '#ee6847',
    vars: {
      ...BASE_LIGHT,
      '--lp-accent': '#ee6847',
      '--lp-highlight': '#d7ff64',
    },
    darkVars: {
      ...BASE_DARK,
      '--lp-accent': '#ff7b5c',
      '--lp-highlight': '#d7ff64',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight lime',
    swatch: '#5b9fd4',
    vars: {
      ...BASE_LIGHT,
      '--lp-bg': '#e8eef5',
      '--lp-surface': '#f4f7fb',
      '--lp-surface-alt': '#e8eef5',
      '--lp-header-bg': 'rgba(232, 238, 245, 0.92)',
      '--lp-accent': '#2563eb',
      '--lp-highlight': '#a3e635',
    },
    darkVars: {
      ...BASE_DARK,
      '--lp-bg': '#0a1018',
      '--lp-surface': '#111827',
      '--lp-surface-alt': '#0f1623',
      '--lp-header-bg': 'rgba(10, 16, 24, 0.92)',
      '--lp-accent': '#60a5fa',
      '--lp-highlight': '#bef264',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean breeze',
    swatch: '#0077b6',
    vars: {
      ...BASE_LIGHT,
      '--lp-bg': '#e8f4f8',
      '--lp-surface': '#f5fafc',
      '--lp-surface-alt': '#e8f4f8',
      '--lp-header-bg': 'rgba(232, 244, 248, 0.92)',
      '--lp-accent': '#0077b6',
      '--lp-highlight': '#90e0ef',
    },
    darkVars: {
      ...BASE_DARK,
      '--lp-bg': '#051923',
      '--lp-surface': '#0a2433',
      '--lp-surface-alt': '#071a26',
      '--lp-header-bg': 'rgba(5, 25, 35, 0.92)',
      '--lp-accent': '#48cae4',
      '--lp-highlight': '#90e0ef',
    },
  },
  {
    id: 'forest',
    name: 'Forest calm',
    swatch: '#2d6a4f',
    vars: {
      ...BASE_LIGHT,
      '--lp-bg': '#eef3eb',
      '--lp-surface': '#f7faf5',
      '--lp-surface-alt': '#eef3eb',
      '--lp-header-bg': 'rgba(238, 243, 235, 0.92)',
      '--lp-accent': '#2d6a4f',
      '--lp-highlight': '#95d5b2',
    },
    darkVars: {
      ...BASE_DARK,
      '--lp-bg': '#0d1f17',
      '--lp-surface': '#14261c',
      '--lp-surface-alt': '#0f1a13',
      '--lp-header-bg': 'rgba(13, 31, 23, 0.92)',
      '--lp-accent': '#52b788',
      '--lp-highlight': '#95d5b2',
    },
  },
];

export const DEFAULT_LANDING_PALETTE: LandingPaletteId = 'cream';

const PALETTE_KEY = 'trufi_landing_palette_v1';

export function readLandingPalette(): LandingPaletteId {
  try {
    const v = localStorage.getItem(PALETTE_KEY);
    if (v && LANDING_PALETTES.some(p => p.id === v)) return v as LandingPaletteId;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANDING_PALETTE;
}

export function writeLandingPalette(id: LandingPaletteId): void {
  try {
    localStorage.setItem(PALETTE_KEY, id);
  } catch {
    /* ignore */
  }
}

export function paletteStyleVars(id: LandingPaletteId, isDark: boolean): Record<string, string> {
  const p = LANDING_PALETTES.find(x => x.id === id) ?? LANDING_PALETTES[0];
  return isDark ? { ...p.darkVars } : { ...p.vars };
}
