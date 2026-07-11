export type MenuLayoutId = 'grid' | 'list' | 'magazine' | 'compact';

export interface MenuLayoutOption {
  id: MenuLayoutId;
  name: string;
  description: string;
}

export const MENU_LAYOUTS: MenuLayoutOption[] = [
  { id: 'grid', name: 'Grilla', description: 'Tarjetas con foto — ideal para platos con imagen' },
  { id: 'list', name: 'Lista', description: 'Fila horizontal — compacto en celular' },
  { id: 'magazine', name: 'Destacado', description: 'Fotos grandes — estilo revista' },
  { id: 'compact', name: 'Minimal', description: 'Solo texto y precio — menú impreso digital' },
];

export const DEFAULT_MENU_LAYOUT: MenuLayoutId = 'grid';

export function parseMenuLayout(value: unknown): MenuLayoutId {
  if (typeof value === 'string' && MENU_LAYOUTS.some(l => l.id === value)) {
    return value as MenuLayoutId;
  }
  return DEFAULT_MENU_LAYOUT;
}
