/**
 * Site config + catálogo — La Inmaculada (verdulería · Olivos, Ugarte y España).
 * Site propio, aislado de los demos: data-driven, un único lugar para editar
 * productos, precios, horarios y zona. MVP: carrito → WhatsApp → "pedido enviado".
 */

export type ProductOption = { id: string; label: string; price: number };
export type Product = {
  id: string;
  name: string;
  category: 'verduras' | 'frutas' | 'almacen' | 'bolsones';
  note?: string;
  badge?: string;
  options: ProductOption[];
};

/** TODO: reemplazar con el WhatsApp real del local (formato internacional sin +). */
export const SITE = {
  brand: 'La Inmaculada',
  tagline: 'Verdulería de barrio · Olivos',
  address: 'Av. M. Ugarte 2388 · Olivos (Ugarte y España)',
  whatsapp: '5491100000000', // PLACEHOLDER — pedir número real al dueño
  hours: [
    ['Lunes a viernes', '8 a 13:30 y 16:30 a 20'],
    ['Sábados', '8 a 13:30 y 16:30 a 20'],
    ['Domingos', '8 a 13'],
  ] as Array<[string, string]>,
  deliveryNote:
    'Entregamos en Olivos, Vicente López centro, La Lucila y Flores... de acá a la Terminal. Consultá tu cuadra.',
  minNote: 'Pedidos antes de las 17 hs llegan el mismo día. El peso se confirma antes de preparar.',
  demoNotice: 'Sitio de prueba · productos y precios ilustrativos',
};

/** Lista “Hoy llegó” — la pizarra. Editar a mano cada día/semana. */
export const HOY_LLEGO = ['Tomate perita', 'Palta Hass', 'Acelga', 'Banana Ecuador', 'Huevos de campo'];

export const BOLSONES: Product[] = [
  {
    id: 'bolson-semanal',
    name: 'Bolsón semanal',
    category: 'bolsones',
    badge: 'Sugerido',
    note: 'Verduras y frutas para la semana de 2 personas. Lo armamos nosotros, vos lo ajustás en notas.',
    options: [{ id: 'u', label: 'Bolsón', price: 15000 }],
  },
  {
    id: 'bolson-familiar',
    name: 'Bolsón familiar',
    category: 'bolsones',
    note: 'Para 4 o más. Siempre sale de lo más lindo del día.',
    options: [{ id: 'u', label: 'Bolsón', price: 24000 }],
  },
  {
    id: 'bolson-fruta',
    name: 'Bolsón de fruta',
    category: 'bolsones',
    note: 'Fruta lista para la frutera. Indicá lo que no te gusta.',
    options: [{ id: 'u', label: 'Bolsón', price: 18000 }],
  },
];

export const CATALOG: Product[] = [
  // Verduras — por peso
  { id: 'tomate', name: 'Tomate perita', category: 'verduras', note: 'Para salsa y ensalada', options: [{ id: 'half', label: '½ kg', price: 1800 }, { id: 'kilo', label: '1 kg', price: 3400 }] },
  { id: 'tomate-redondo', name: 'Tomate redondo', category: 'verduras', options: [{ id: 'half', label: '½ kg', price: 1600 }, { id: 'kilo', label: '1 kg', price: 3000 }] },
  { id: 'papa', name: 'Papa lavada', category: 'verduras', note: 'Para todos los días', options: [{ id: 'kilo', label: '1 kg', price: 1300 }, { id: '2kg', label: '2 kg', price: 2400 }] },
  { id: 'cebolla', name: 'Cebolla', category: 'verduras', options: [{ id: 'half', label: '½ kg', price: 900 }, { id: 'kilo', label: '1 kg', price: 1600 }] },
  { id: 'zanahoria', name: 'Zanahoria', category: 'verduras', options: [{ id: 'kilo', label: '1 kg', price: 1400 }, { id: '2kg', label: '2 kg', price: 2500 }] },
  { id: 'batata', name: 'Batata', category: 'verduras', options: [{ id: 'kilo', label: '1 kg', price: 2100 }] },
  { id: 'remolacha', name: 'Remolacha', category: 'verduras', options: [{ id: 'kilo', label: '1 kg', price: 1500 }] },
  { id: 'zapallito', name: 'Zapallito', category: 'verduras', options: [{ id: 'u', label: 'Unidad', price: 1200 }] },
  { id: 'morrion', name: 'Morrón', category: 'verduras', note: 'Verde o rojo, lo indicás en notas', options: [{ id: 'u', label: 'Unidad', price: 1500 }] },
  { id: 'choclo', name: 'Choclo', category: 'verduras', badge: 'De estación', options: [{ id: 'u', label: 'Unidad', price: 1400 }] },
  // Verdes — por atado
  { id: 'lechuga', name: 'Lechuga capuchina', category: 'verduras', options: [{ id: 'u', label: 'Unidad', price: 1400 }] },
  { id: 'acelga', name: 'Acelga', category: 'verduras', options: [{ id: 'atado', label: 'Atado', price: 1200 }, { id: 'x2', label: '2 atados', price: 2000 }] },
  { id: 'espinaca', name: 'Espinaca', category: 'verduras', options: [{ id: 'atado', label: 'Atado', price: 1300 }] },
  { id: 'rucula', name: 'Rúcula', category: 'verduras', options: [{ id: 'atado', label: 'Atado', price: 1300 }] },
  // Frutas
  { id: 'banana', name: 'Banana', category: 'frutas', note: 'Indicá el punto en notas: verde, lista o madura', options: [{ id: 'half', label: '½ kg', price: 1500 }, { id: 'kilo', label: '1 kg', price: 2800 }] },
  { id: 'manzana', name: 'Manzana roja', category: 'frutas', options: [{ id: 'half', label: '½ kg', price: 1700 }, { id: 'kilo', label: '1 kg', price: 3200 }] },
  { id: 'naranja', name: 'Naranja jugo', category: 'frutas', options: [{ id: 'kilo', label: '1 kg', price: 1300 }, { id: '3kg', label: '3 kg', price: 3600 }] },
  { id: 'mandarina', name: 'Mandarina', category: 'frutas', options: [{ id: 'kilo', label: '1 kg', price: 1500 }] },
  { id: 'pera', name: 'Pera Packham', category: 'frutas', options: [{ id: 'half', label: '½ kg', price: 1800 }, { id: 'kilo', label: '1 kg', price: 3400 }] },
  { id: 'limon', name: 'Limón', category: 'frutas', options: [{ id: 'kilo', label: '1 kg', price: 1700 }] },
  { id: 'palta', name: 'Palta Hass', category: 'frutas', badge: 'Hoy llegó', options: [{ id: 'u', label: 'Unidad', price: 1700 }, { id: 'pack3', label: 'Pack x3', price: 4800 }] },
  // Almacén ligero
  { id: 'huevos-docena', name: 'Huevos de campo', category: 'almacen', note: 'La docena', options: [{ id: 'doc', label: 'Docena', price: 4500 }] },
  { id: 'maple', name: 'Maple x30', category: 'almacen', options: [{ id: 'maple', label: 'Maple', price: 12500 }] },
];

export const ALL_PRODUCTS: Product[] = [...BOLSONES, ...CATALOG];

export const CATEGORIES: Array<{ id: Product['category']; name: string }> = [
  { id: 'bolsones', name: 'Bolsones' },
  { id: 'verduras', name: 'Verduras y verdes' },
  { id: 'frutas', name: 'Frutas' },
  { id: 'almacen', name: 'Almacén ligero' },
];

export const fmt = (n: number) => '$' + n.toLocaleString('es-AR');