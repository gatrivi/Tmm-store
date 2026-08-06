/**
 * Demo Express presets — data only. No new routes / B2B subsystems.
 * @see docs/roadmap/usd50-tomorrow-demo-plan.md
 */
import type { MenuItemType } from './menu';
import type { MenuCategory } from '../types/menuCategory';
import type { MenuLayoutId } from '../utils/menuLayouts';
import type { DemoCopy } from './demos/types';

export type DemoPresetFamily = 'peso' | 'preparacion' | 'catalogo' | 'mayorista';
/** Matches keys in PROSPECT_COLORS — avoid importing prospectDemo (cycle). */
export type DemoPresetColor = 'carbon' | 'coral' | 'verde' | 'azul' | 'violeta';

export interface DemoPreset {
  id: string;
  label: string;
  family: DemoPresetFamily;
  suggestedColor: DemoPresetColor;
  menuLayout: MenuLayoutId;
  /** Used when `negocio` query is absent */
  defaultBusinessName?: string;
  menuCategories: MenuCategory[];
  menuItems: MenuItemType[];
  copy: DemoCopy;
}

const ILLUSTRATIVE = 'Propuesta conceptual no oficial. Productos, precios y condiciones ilustrativas.';

function baseCopy(partial: Partial<DemoCopy> & Pick<DemoCopy, 'heroTitle' | 'heroBody' | 'checkoutCta' | 'cartCta' | 'totalLabel' | 'totalHint' | 'notesPlaceholder' | 'chips' | 'weightNotice' | 'pickupLabel' | 'deliveryLabel'>): DemoCopy {
  return {
    ownerTitle: '',
    ownerSubtitle: 'Panel del local · demo',
    ribbonLabel: 'Muestra ilustrativa',
    pickupHint: 'Retiro en local · confirmamos por WhatsApp',
    deliveryHint: 'Reparto · zona y día en notas',
    cashLabel: 'Efectivo',
    transferLabel: 'Transferencia',
    submitLabel: 'Enviar pedido de prueba',
    reviewTitle: 'Revisá tu pedido de prueba',
    reviewBody: 'Demo segura · no se envió WhatsApp real.',
    addressPlaceholder: 'Zona / dirección (ilustrativa)',
    successEyebrow: 'Pedido de prueba creado',
    transferAliasPending: 'En producción confirman alias por WhatsApp',
    successTitle: 'Pedido de demostración listo',
    successBody: 'Demo segura · el local lo ve en la bandeja.',
    ownerLinkLabel: 'Ver cómo lo recibe el local',
    statusLinkLabel: 'Ver estado del pedido',
    continueLabel: 'Seguir viendo el catálogo',
    revenueLabel: 'Total sesión',
    ...partial,
  };
}

function cats(...names: [string, string][]): MenuCategory[] {
  return names.map(([id, name], i) => ({ id, name, sortOrder: i }));
}

/** Stock photos live at `/demos/presets/<presetId>/<itemId>.jpg`. */
function itemFor(presetId: string) {
  return function item(
    id: string,
    name: string,
    category: string,
    description: string,
    options: MenuItemType['options'],
    badge?: string,
  ): MenuItemType {
    return {
      id,
      name,
      category,
      description,
      images: [`/demos/presets/${presetId}/${id}.jpg`],
      options,
      ...(badge ? { badge } : {}),
    };
  };
}

/** Wholesale-first cut (Pasada A priority). */
const lacteosItem = itemFor('distribuidora-lacteos');
export const PRESET_DISTRIBUIDORA_LACTEOS: DemoPreset = {
  id: 'distribuidora-lacteos',
  label: 'Distribuidora de lácteos',
  family: 'mayorista',
  suggestedColor: 'azul',
  menuLayout: 'list',
  defaultBusinessName: 'Distribuidora de lácteos',
  menuCategories: cats(['leches', 'Leches y cremas'], ['quesos', 'Quesos'], ['reposicion', 'Reposición']),
  menuItems: [
    lacteosItem('leche-lv', 'Leche larga vida', 'leches', 'Muestra ilustrativa · pedí por unidad, pack o caja', [
      { id: 'u', label: 'Unidad', price: 1200 },
      { id: 'pack', label: 'Pack x6', price: 6800 },
      { id: 'caja', label: 'Caja x12', price: 12800 },
    ], 'Bulto'),
    lacteosItem('crema', 'Crema de leche', 'leches', 'Presentación ilustrativa', [
      { id: 'u', label: 'Unidad', price: 2100 },
      { id: 'pack', label: 'Pack x6', price: 11500 },
    ]),
    lacteosItem('manteca', 'Manteca', 'leches', 'Unidad o caja', [
      { id: 'u', label: 'Unidad', price: 2800 },
      { id: 'caja', label: 'Caja x10', price: 25500 },
    ]),
    lacteosItem('yogur', 'Yogur', 'leches', 'Pack de reposición', [
      { id: 'pack', label: 'Pack x8', price: 7200 },
    ]),
    lacteosItem('queso-cremoso', 'Queso cremoso', 'quesos', 'Media horma / horma', [
      { id: 'media', label: 'Media horma', price: 9800 },
      { id: 'horma', label: 'Horma', price: 18500 },
    ]),
    lacteosItem('mozzarella', 'Mozzarella', 'quesos', 'Barra o horma', [
      { id: 'barra', label: 'Barra', price: 6500 },
      { id: 'horma', label: 'Horma', price: 22000 },
    ]),
    lacteosItem('ddl', 'Dulce de leche', 'quesos', 'Pote o balde', [
      { id: 'pote', label: 'Pote', price: 4200 },
      { id: 'balde', label: 'Balde', price: 18900 },
    ]),
    lacteosItem('combo-repo', 'Combo de reposición', 'reposicion', 'Mix semanal ilustrativo · pedido mínimo a confirmar', [
      { id: 'semanal', label: 'Pedido semanal', price: 85000 },
    ], 'Reposición'),
  ],
  copy: baseCopy({
    heroTitle: 'Reposición de lácteos por WhatsApp',
    heroBody: `${ILLUSTRATIVE} Armá bultos, zona de reparto y repetición sin audios confusos.`,
    checkoutCta: 'Armar reposición',
    cartCta: 'Armar reposición',
    totalLabel: 'Total estimado',
    totalHint: 'Precio y mínimo a confirmar. Indicá zona y día preferido en notas.',
    notesPlaceholder: 'Zona · día preferido · retiro o reparto · observaciones',
    pickupLabel: 'Retiro en depósito',
    deliveryLabel: 'Reparto',
    chips: ['Pack / caja', 'Reparto'],
    weightNotice: ILLUSTRATIVE,
    submitLabel: 'Enviar reposición de prueba',
  }),
};

const molinoItem = itemFor('molino-mayorista');
export const PRESET_MOLINO_MAYORISTA: DemoPreset = {
  id: 'molino-mayorista',
  label: 'Molino / insumos',
  family: 'mayorista',
  suggestedColor: 'carbon',
  menuLayout: 'list',
  defaultBusinessName: 'Molino Florida',
  menuCategories: cats(['harinas', 'Harinas'], ['granos', 'Granos y semillas'], ['panif', 'Insumos panificación']),
  menuItems: [
    molinoItem('harina-000', 'Harina blanca 000', 'harinas', 'Muestra ilustrativa · bolsa / bulto', [
      { id: '1kg', label: '1 kg', price: 1800 },
      { id: '5kg', label: '5 kg', price: 8200 },
      { id: '25kg', label: '25 kg', price: 35500 },
    ], 'Bulto'),
    molinoItem('harina-int', 'Harina integral', 'harinas', '1 / 5 / 25 kg', [
      { id: '1kg', label: '1 kg', price: 2200 },
      { id: '5kg', label: '5 kg', price: 9800 },
      { id: '25kg', label: '25 kg', price: 42000 },
    ]),
    molinoItem('harina-centeno', 'Harina de centeno', 'harinas', '1 / 5 / 25 kg', [
      { id: '1kg', label: '1 kg', price: 2600 },
      { id: '5kg', label: '5 kg', price: 11800 },
      { id: '25kg', label: '25 kg', price: 48000 },
    ]),
    molinoItem('avena', 'Avena', 'granos', '1 kg / 5 kg', [
      { id: '1kg', label: '1 kg', price: 2400 },
      { id: '5kg', label: '5 kg', price: 10500 },
    ]),
    molinoItem('semillas', 'Semillas mix', 'granos', '500 g / 1 kg', [
      { id: '500', label: '500 g', price: 3900 },
      { id: '1kg', label: '1 kg', price: 7200 },
    ]),
    molinoItem('frutos', 'Frutos secos', 'granos', '500 g / 1 kg', [
      { id: '500', label: '500 g', price: 8500 },
      { id: '1kg', label: '1 kg', price: 15800 },
    ]),
    molinoItem('legumbres', 'Legumbres', 'granos', '1 kg / 5 kg', [
      { id: '1kg', label: '1 kg', price: 2800 },
      { id: '5kg', label: '5 kg', price: 12500 },
    ]),
    molinoItem('insumos', 'Insumos de panificación', 'panif', 'Levadura, mejoradores — stock a confirmar', [
      { id: 'kit', label: 'Kit básico', price: 9500 },
    ], 'Mayorista'),
  ],
  copy: baseCopy({
    heroTitle: 'Pedido mayorista por bolsa y bulto',
    heroBody: `${ILLUSTRATIVE} Repetí reposición, elegí formato y mandá zona/día ordenado por WhatsApp.`,
    checkoutCta: 'Armar pedido mayorista',
    cartCta: 'Armar pedido mayorista',
    totalLabel: 'Total estimado',
    totalHint: 'Stock y precio a confirmar. No es tienda oficial ni catálogo completo.',
    notesPlaceholder: 'Zona · día · retiro/reparto · formato preferido',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Reparto',
    chips: ['Bolsa / bulto', 'Reposición'],
    weightNotice: ILLUSTRATIVE,
    submitLabel: 'Enviar pedido mayorista de prueba',
    ribbonLabel: 'Propuesta conceptual no oficial',
  }),
};

const polleriaItem = itemFor('polleria');
export const PRESET_POLLERIA: DemoPreset = {
  id: 'polleria',
  label: 'Pollería',
  family: 'peso',
  suggestedColor: 'coral',
  menuLayout: 'grid',
  defaultBusinessName: 'Pollería del barrio',
  menuCategories: cats(['pollo', 'Pollo'], ['combos', 'Combos'], ['extras', 'Extras']),
  menuItems: [
    polleriaItem('entero', 'Pollo entero', 'pollo', 'Muestra ilustrativa', [
      { id: 'entero', label: 'Entero', price: 8900 },
      { id: 'medio', label: 'Medio', price: 4800 },
    ]),
    polleriaItem('spiedo', 'Pollo al spiedo', 'pollo', 'Listo para llevar', [
      { id: 'u', label: 'Unidad', price: 9500 },
    ], 'Más pedido'),
    polleriaItem('combo-papas', 'Combo pollo + papas', 'combos', 'Para 1–2', [
      { id: 'u', label: 'Combo', price: 12500 },
    ]),
    polleriaItem('combo-fam', 'Combo familiar', 'combos', 'Pollo + papas + ensalada', [
      { id: 'u', label: 'Familiar', price: 18900 },
    ]),
    polleriaItem('papas', 'Papas fritas', 'extras', 'Chicas / grandes', [
      { id: 'ch', label: 'Chicas', price: 3200 },
      { id: 'gr', label: 'Grandes', price: 4800 },
    ]),
    polleriaItem('ensalada', 'Ensalada', 'extras', 'Porción', [
      { id: 'u', label: 'Porción', price: 3500 },
    ]),
    polleriaItem('bebida', 'Bebida', 'extras', 'Lata / 1.5 L', [
      { id: 'lata', label: 'Lata', price: 1800 },
      { id: '15', label: '1.5 L', price: 3200 },
    ]),
  ],
  copy: baseCopy({
    heroTitle: 'Pedí pollo sin audio eterno',
    heroBody: 'Muestra ilustrativa. Entero, spiedo o combo — el local confirma por WhatsApp.',
    checkoutCta: 'Armar pedido',
    cartCta: 'Armar pedido',
    totalLabel: 'Total',
    totalHint: 'En producción confirman stock y horario.',
    notesPlaceholder: 'Horario de retiro · observaciones',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Delivery',
    chips: ['Spiedo', 'Combos'],
    weightNotice: 'Datos de muestra · no es un comercio real.',
  }),
};

const verduleriaItem = itemFor('verduleria');
export const PRESET_VERDULERIA: DemoPreset = {
  id: 'verduleria',
  label: 'Verdulería',
  family: 'peso',
  suggestedColor: 'verde',
  menuLayout: 'list',
  defaultBusinessName: 'Verdulería del barrio',
  menuCategories: cats(['verdura', 'Verdura'], ['fruta', 'Fruta'], ['otros', 'Otros']),
  menuItems: [
    verduleriaItem('tomate', 'Tomate', 'verdura', 'Peso aproximado', [
      { id: 'half', label: '½ kg aprox.', price: 1800 },
      { id: 'kg', label: '1 kg aprox.', price: 3400 },
    ]),
    verduleriaItem('papa', 'Papa', 'verdura', 'Peso aproximado', [
      { id: '1kg', label: '1 kg aprox.', price: 1200 },
      { id: '2kg', label: '2 kg aprox.', price: 2200 },
    ]),
    verduleriaItem('cebolla', 'Cebolla', 'verdura', 'Peso aproximado', [
      { id: 'half', label: '½ kg aprox.', price: 900 },
      { id: 'kg', label: '1 kg aprox.', price: 1600 },
    ]),
    verduleriaItem('banana', 'Banana', 'fruta', 'Peso aproximado', [
      { id: 'half', label: '½ kg aprox.', price: 1500 },
      { id: 'kg', label: '1 kg aprox.', price: 2800 },
    ]),
    verduleriaItem('manzana', 'Manzana', 'fruta', 'Peso aproximado', [
      { id: 'half', label: '½ kg aprox.', price: 1700 },
      { id: 'kg', label: '1 kg aprox.', price: 3200 },
    ]),
    verduleriaItem('palta', 'Palta', 'fruta', 'Unidad o pack', [
      { id: 'u', label: 'Unidad', price: 1200 },
      { id: 'pack', label: 'Pack x3', price: 3200 },
    ]),
    verduleriaItem('huevos', 'Huevos', 'otros', 'Docena / maple', [
      { id: 'doc', label: 'Docena', price: 4500 },
      { id: 'maple', label: 'Maple', price: 12500 },
    ]),
    verduleriaItem('bolson', 'Bolsón semanal', 'otros', 'Mix ilustrativo', [
      { id: 'sem', label: 'Bolsón', price: 15000 },
    ], 'Sugerido'),
  ],
  copy: baseCopy({
    heroTitle: 'Verdura por peso, pedido claro',
    heroBody: 'Muestra ilustrativa. El peso y el total final pueden variar.',
    checkoutCta: 'Armar pedido',
    cartCta: 'Armar pedido',
    totalLabel: 'Total estimado',
    totalHint: 'Peso y total final pueden variar. Confirmamos por WhatsApp.',
    notesPlaceholder: 'Sustitutos · horario · observaciones',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Delivery',
    chips: ['½ kg / kg', 'Bolsón'],
    weightNotice: 'Peso aproximado · total a confirmar.',
  }),
};

const cafeteriaItem = itemFor('cafeteria');
export const PRESET_CAFETERIA: DemoPreset = {
  id: 'cafeteria',
  label: 'Cafetería',
  family: 'preparacion',
  suggestedColor: 'coral',
  menuLayout: 'grid',
  defaultBusinessName: 'Café del barrio',
  menuCategories: cats(['cafe', 'Café'], ['comida', 'Para picar'], ['combos', 'Combos']),
  menuItems: [
    cafeteriaItem('espresso', 'Espresso', 'cafe', 'Simple / doble', [
      { id: 's', label: 'Simple', price: 2200 },
      { id: 'd', label: 'Doble', price: 2800 },
    ]),
    cafeteriaItem('cafe-leche', 'Café con leche', 'cafe', 'Chico / grande', [
      { id: 'ch', label: 'Chico', price: 2800 },
      { id: 'gr', label: 'Grande', price: 3500 },
    ]),
    cafeteriaItem('capuccino', 'Cappuccino', 'cafe', 'Clásico', [
      { id: 'u', label: 'Taza', price: 3800 },
    ]),
    cafeteriaItem('medialuna', 'Medialuna', 'comida', 'Manteca', [
      { id: 'u', label: 'Unidad', price: 1200 },
    ]),
    cafeteriaItem('tostado', 'Tostado', 'comida', 'Jamón y queso', [
      { id: 'u', label: 'Unidad', price: 4500 },
    ]),
    cafeteriaItem('desayuno', 'Combo desayuno', 'combos', 'Café + medialuna', [
      { id: 'u', label: 'Combo', price: 4800 },
    ], 'Más pedido'),
    cafeteriaItem('jugo', 'Jugo', 'comida', 'Exprimido', [
      { id: 'u', label: 'Vaso', price: 3200 },
    ]),
    cafeteriaItem('agua', 'Agua', 'comida', '500 ml', [
      { id: 'u', label: 'Botella', price: 1500 },
    ]),
  ],
  copy: baseCopy({
    heroTitle: 'Pedí para retirar sin filas de audio',
    heroBody: 'Muestra ilustrativa de cafetería de barrio.',
    checkoutCta: 'Pedir para retirar',
    cartCta: 'Pedir para retirar',
    totalLabel: 'Total',
    totalHint: 'Confirmamos horario de retiro por WhatsApp.',
    notesPlaceholder: 'Horario de retiro · observaciones',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Delivery',
    chips: ['Café', 'Retiro'],
    weightNotice: 'Datos de muestra · no es un comercio real.',
  }),
};

const libreriaItem = itemFor('libreria');
export const PRESET_LIBRERIA: DemoPreset = {
  id: 'libreria',
  label: 'Librería',
  family: 'catalogo',
  suggestedColor: 'violeta',
  menuLayout: 'list',
  defaultBusinessName: 'Librería del barrio',
  menuCategories: cats(['papel', 'Papelería'], ['escrit', 'Escritura'], ['servicios', 'Servicios']),
  menuItems: [
    libreriaItem('cuaderno', 'Cuaderno', 'papel', 'A4 / A5', [
      { id: 'a4', label: 'A4', price: 4200 },
      { id: 'a5', label: 'A5', price: 2800 },
    ]),
    libreriaItem('resma', 'Resma A4', 'papel', '500 hojas', [
      { id: 'u', label: 'Resma', price: 6500 },
    ]),
    libreriaItem('lapiceras', 'Lapiceras', 'escrit', 'Pack', [
      { id: 'pack', label: 'Pack x4', price: 3200 },
    ]),
    libreriaItem('marcadores', 'Marcadores', 'escrit', 'Set', [
      { id: 'set', label: 'Set x6', price: 4800 },
    ]),
    libreriaItem('carpeta', 'Carpeta', 'papel', 'Oficio', [
      { id: 'u', label: 'Unidad', price: 2500 },
    ]),
    libreriaItem('fotocopias', 'Fotocopias', 'servicios', 'B/N y color', [
      { id: 'bn', label: 'B/N (hoja)', price: 80 },
      { id: 'color', label: 'Color (hoja)', price: 250 },
    ]),
    libreriaItem('anillado', 'Anillado', 'servicios', 'Hasta 100 hojas', [
      { id: 'u', label: 'Unidad', price: 3500 },
    ]),
    libreriaItem('combo', 'Combo escolar / oficina', 'servicios', 'Mix ilustrativo', [
      { id: 'u', label: 'Combo', price: 18900 },
    ], 'Sugerido'),
  ],
  copy: baseCopy({
    heroTitle: 'Consultá stock sin mensaje eterno',
    heroBody: 'Muestra ilustrativa. Producto, medida y cantidad en un solo pedido.',
    checkoutCta: 'Consultar disponibilidad',
    cartCta: 'Consultar disponibilidad',
    totalLabel: 'Total estimado',
    totalHint: 'Stock y precio a confirmar por WhatsApp.',
    notesPlaceholder: 'Medida · cantidad · fecha necesaria',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Envío',
    chips: ['Stock', 'Servicios'],
    weightNotice: 'Datos de muestra · no es un comercio real.',
  }),
};

const graficaItem = itemFor('grafica');
export const PRESET_GRAFICA: DemoPreset = {
  id: 'grafica',
  label: 'Gráfica / imprenta',
  family: 'catalogo',
  suggestedColor: 'azul',
  menuLayout: 'list',
  defaultBusinessName: 'Gráfica del barrio',
  menuCategories: cats(['impresos', 'Impresos'], ['gran', 'Gran formato'], ['acabado', 'Acabados']),
  menuItems: [
    graficaItem('tarjetas', 'Tarjetas personales', 'impresos', 'Indicá papel en notas', [
      { id: '100', label: '100 u.', price: 18000 },
      { id: '500', label: '500 u.', price: 42000 },
    ]),
    graficaItem('flyers', 'Flyers A5', 'impresos', '100 / 500', [
      { id: '100', label: '100 u.', price: 22000 },
      { id: '500', label: '500 u.', price: 58000 },
    ]),
    graficaItem('stickers', 'Stickers', 'impresos', '50 / 100', [
      { id: '50', label: '50 u.', price: 9500 },
      { id: '100', label: '100 u.', price: 16500 },
    ]),
    graficaItem('banner', 'Banner / lona', 'gran', 'Medida en notas', [
      { id: 'm2', label: 'Por m² (ilustrativo)', price: 12000 },
    ]),
    graficaItem('a4', 'Impresión A4', 'impresos', 'B/N y color', [
      { id: 'bn', label: 'B/N', price: 150 },
      { id: 'color', label: 'Color', price: 400 },
    ]),
    graficaItem('anillado', 'Anillado', 'acabado', 'Hasta 100 hojas', [
      { id: 'u', label: 'Unidad', price: 3500 },
    ]),
    graficaItem('plastificado', 'Plastificado', 'acabado', 'A4', [
      { id: 'u', label: 'Hoja', price: 800 },
    ]),
    graficaItem('diseno', 'Diseño básico (opcional)', 'acabado', 'Sin upload esta noche — coordinar por WSP', [
      { id: 'u', label: 'Consulta', price: 15000 },
    ]),
  ],
  copy: baseCopy({
    heroTitle: 'Cotizá impresión sin ida y vuelta eterna',
    heroBody: 'Muestra ilustrativa. Medida, papel y terminación van en notas. Sin upload esta noche.',
    checkoutCta: 'Pedir cotización',
    cartCta: 'Pedir cotización',
    totalLabel: 'Total estimado',
    totalHint: 'Cotización ilustrativa · confirman papel, medida y fecha por WhatsApp.',
    notesPlaceholder: 'Medida · papel · terminación · fecha',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Envío',
    chips: ['Cotización', 'Notas'],
    weightNotice: 'Datos de muestra · no es un comercio real.',
  }),
};

const petshopItem = itemFor('petshop');
export const PRESET_PETSHOP: DemoPreset = {
  id: 'petshop',
  label: 'Pet shop',
  family: 'catalogo',
  suggestedColor: 'verde',
  menuLayout: 'grid',
  defaultBusinessName: 'Pet shop del barrio',
  menuCategories: cats(['alimento', 'Alimento'], ['higiene', 'Higiene'], ['paseo', 'Paseo y juego']),
  menuItems: [
    petshopItem('alimento-perro', 'Alimento para perro', 'alimento', 'Muestra ilustrativa · marca genérica', [
      { id: '3kg', label: '3 kg', price: 18500 },
      { id: '15kg', label: '15 kg', price: 68900 },
    ], 'Habitual'),
    petshopItem('alimento-gato', 'Alimento para gato', 'alimento', 'Presentación ilustrativa', [
      { id: '15', label: '1,5 kg', price: 14200 },
      { id: '75', label: '7,5 kg', price: 52400 },
    ]),
    petshopItem('humedo', 'Alimento húmedo', 'alimento', 'Unidad o pack', [
      { id: 'u', label: 'Unidad', price: 1800 },
      { id: 'pack', label: 'Pack x12', price: 18900 },
    ]),
    petshopItem('arena', 'Arena sanitaria', 'higiene', '4 kg / 10 kg', [
      { id: '4kg', label: '4 kg', price: 9800 },
      { id: '10kg', label: '10 kg', price: 21500 },
    ]),
    petshopItem('shampoo', 'Shampoo', 'higiene', '250 ml / 500 ml', [
      { id: '250', label: '250 ml', price: 6500 },
      { id: '500', label: '500 ml', price: 9800 },
    ]),
    petshopItem('collar', 'Collar', 'paseo', 'Talles ilustrativos', [
      { id: 's', label: 'S', price: 4200 },
      { id: 'm', label: 'M', price: 4800 },
      { id: 'l', label: 'L', price: 5500 },
    ]),
    petshopItem('correa', 'Correa', 'paseo', 'Corta / larga', [
      { id: 'corta', label: 'Corta', price: 5900 },
      { id: 'larga', label: 'Larga', price: 7800 },
    ]),
    petshopItem('snack', 'Snacks / juguete', 'paseo', 'Unidad o pack · atajo “compra habitual” en notas', [
      { id: 'u', label: 'Unidad', price: 3200 },
      { id: 'pack', label: 'Pack', price: 8900 },
    ]),
  ],
  copy: baseCopy({
    heroTitle: 'Pedí alimento y accesorios sin audio eterno',
    heroBody: 'Muestra conceptual. Productos, precios, stock y condiciones ilustrativas. Confirmamos entrega por WhatsApp.',
    checkoutCta: 'Armar pedido',
    cartCta: 'Armar pedido',
    totalLabel: 'Total estimado',
    totalHint: 'Confirmamos stock y entrega por WhatsApp.',
    notesPlaceholder: 'Barrio · retiro/delivery · repetir compra habitual · observaciones',
    pickupLabel: 'Retiro',
    deliveryLabel: 'Delivery',
    chips: ['Stock', 'Compra habitual'],
    weightNotice: 'Muestra conceptual. Productos, precios, stock y condiciones ilustrativas.',
  }),
};

export const DEMO_PRESETS: Record<string, DemoPreset> = {
  'distribuidora-lacteos': PRESET_DISTRIBUIDORA_LACTEOS,
  'molino-mayorista': PRESET_MOLINO_MAYORISTA,
  polleria: PRESET_POLLERIA,
  verduleria: PRESET_VERDULERIA,
  cafeteria: PRESET_CAFETERIA,
  libreria: PRESET_LIBRERIA,
  grafica: PRESET_GRAFICA,
  petshop: PRESET_PETSHOP,
};

export function getDemoPreset(rubro: string | null | undefined): DemoPreset | null {
  if (!rubro) return null;
  return DEMO_PRESETS[rubro] ?? null;
}

export function listDemoPresets(): DemoPreset[] {
  return Object.values(DEMO_PRESETS);
}
