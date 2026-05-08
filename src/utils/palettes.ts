export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  dark: string;
  light: string;
  accent: string;
  text: string;
}

export const PRESET_PALETTES: ColorPalette[] = [
  {
    id: 'gourmet',
    name: 'Gourmet Moderno',
    primary: '#4ecdc4',
    dark: '#556270',
    light: '#f0fdfa',
    accent: '#c7f464',
    text: '#2d3748',
  },
  {
    id: 'artesanal',
    name: 'Artesanal Cálido',
    primary: '#cc333f',
    dark: '#6a4a3c',
    light: '#fdf6e3',
    accent: '#edc951',
    text: '#3d2b1f',
  },
  {
    id: 'natural',
    name: 'Natural Fresco',
    primary: '#45ada8',
    dark: '#594f4f',
    light: '#f5f9f0',
    accent: '#9de0ad',
    text: '#3d3434',
  },
];

export const DEFAULT_PALETTE = PRESET_PALETTES[1]; // Artesanal Cálido
