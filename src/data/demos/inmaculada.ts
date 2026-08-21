import type { MenuItemType } from '../menu';
import type { OrderRecord } from '../../types/order';
import type { DemoDefinition } from './types';

const MENU_ITEMS: MenuItemType[] = [
  { id: 'tomate', name: 'Tomate', category: 'verdura', description: 'Peso aproximado · elegir cantidad', images: [], options: [{ id: 'half', label: '½ kg aprox.', price: 1800 }, { id: 'kilo', label: '1 kg aprox.', price: 3400 }] },
  { id: 'papa', name: 'Papa', category: 'verdura', description: 'Para todos los días', images: [], options: [{ id: 'kilo', label: '1 kg aprox.', price: 1200 }, { id: '2kg', label: '2 kg aprox.', price: 2200 }] },
  { id: 'cebolla', name: 'Cebolla', category: 'verdura', description: 'Peso aproximado', images: [], options: [{ id: 'half', label: '½ kg aprox.', price: 900 }, { id: 'kilo', label: '1 kg aprox.', price: 1600 }] },
  { id: 'banana', name: 'Banana', category: 'fruta', description: 'Indicá el punto en notas', images: [], options: [{ id: 'half', label: '½ kg aprox.', price: 1500 }, { id: 'kilo', label: '1 kg aprox.', price: 2800 }] },
  { id: 'manzana', name: 'Manzana', category: 'fruta', description: 'Para comer o cocinar', images: [], options: [{ id: 'half', label: '½ kg aprox.', price: 1700 }, { id: 'kilo', label: '1 kg aprox.', price: 3200 }] },
  { id: 'palta', name: 'Palta', category: 'fruta', description: 'Unidad o pack', images: [], options: [{ id: 'u', label: 'Unidad', price: 1200 }, { id: 'pack', label: 'Pack x3', price: 3200 }] },
  { id: 'huevos', name: 'Huevos', category: 'otros', description: 'Docena o maple', images: [], options: [{ id: 'doc', label: 'Docena', price: 4500 }, { id: 'maple', label: 'Maple', price: 12500 }] },
  { id: 'bolson', name: 'Bolsón semanal', category: 'otros', badge: 'Sugerido', description: 'Mix ilustrativo de frutas y verduras', images: [], options: [{ id: 'u', label: 'Bolsón', price: 15000 }] },
];

const now = Date.now();
const SEED_ORDERS: OrderRecord[] = [{
  id: 'LI24', tenantId: 'demo-inmaculada', status: 'new', customerName: 'Clara M.', customerPhone: '', deliveryType: 'delivery', address: 'Olivos (demo)', paymentMethod: 'cash', paymentStatus: 'pending', notes: 'Bananas maduras · avisar antes de entregar',
  items: [{ id: 'tomate', name: 'Tomate', optionId: 'kilo', optionLabel: '1 kg aprox.', price: 3400, qty: 1 }, { id: 'banana', name: 'Banana', optionId: 'kilo', optionLabel: '1 kg aprox.', price: 2800, qty: 1 }, { id: 'bolson', name: 'Bolsón semanal', optionId: 'u', optionLabel: 'Bolsón', price: 15000, qty: 1 }], subtotal: 21200, discount: 0, total: 21200, source: 'demo', createdAt: new Date(now - 7 * 60000).toISOString(), updatedAt: new Date(now - 7 * 60000).toISOString(),
}];

export const INMACULADA_DEMO: DemoDefinition = {
  id: 'inmaculada', tenantId: 'demo-inmaculada', customerPath: '/demo/inmaculada', ownerPath: '/demo/inmaculada/owner', orderPath: id => `/demo/inmaculada/order/${id}`,
  plan: 'pedidos', locale: 'es', monogram: 'LI', hideLanguageSwitcher: true, hideThemeToggle: true, hideShare: true, hideAddress: false, hidePromos: true, forceOpen: true,
  theme: { hueso: '#F3F5E8', bordo: '#2E6B3E', carbon: '#1D271D', papel: '#DCE8C8', salvia: '#73924C' },
  siteSettings: { showUsdToggle: false, whatsappNumber: '', bankAlias: '', brandName: 'La Inmaculada', brandColor: '#2E6B3E', brandColorDark: '#1D271D', brandColorLight: '#F3F5E8', brandAccent: '#73924C', brandTextColor: '#1D271D', brandFont: 'Georgia, "Times New Roman", serif', brandAddress: 'Av. M. Ugarte 2388 · Olivos', brandLogo: '', menuLayout: 'compact', demoMode: true, mpEnabled: false },
  menuItems: MENU_ITEMS, menuCategories: [{ id: 'verdura', name: 'Verduras', sortOrder: 0 }, { id: 'fruta', name: 'Frutas', sortOrder: 1 }, { id: 'otros', name: 'Otros', sortOrder: 2 }], seedOrders: SEED_ORDERS,
  copy: { heroTitle: 'Fresco para tu mesa, pedido claro.', heroBody: 'Una forma simple de pedir frutas y verduras por peso, unidad o bolsón.', checkoutCta: 'Coordinar pedido', cartCta: 'Coordinar pedido', totalLabel: 'Total estimado', totalHint: 'Peso, stock y total final se confirman antes de preparar.', ownerTitle: 'Pedidos de La Inmaculada', ownerSubtitle: 'Demo verdulería · hoy', ribbonLabel: 'DEMO · productos y precios ilustrativos', pickupLabel: 'Retiro coordinado', deliveryLabel: 'Delivery', pickupHint: 'Coordiná retiro y horario con el local.', deliveryHint: 'Indicá dirección y horario preferido; confirman cobertura.', cashLabel: 'Efectivo al recibir', transferLabel: 'Transferencia al confirmar', submitLabel: 'Enviar pedido de prueba', reviewTitle: 'Revisá tu pedido de prueba', reviewBody: 'Todavía no se envió ningún mensaje ni pago.', addressPlaceholder: 'Calle, altura y localidad', successEyebrow: 'Pedido de prueba creado', transferAliasPending: 'El local te envía el alias al confirmar', successTitle: 'Pedido de prueba creado', successBody: 'Es una simulación: no se envió ningún mensaje ni pago.', ownerLinkLabel: 'Ver cómo lo recibe el local', statusLinkLabel: 'Ver estado del pedido', continueLabel: 'Seguir comprando', revenueLabel: 'Pedidos estimados', notesPlaceholder: 'Madurez · sustitutos · horario · observaciones', chips: ['½ kg / kg', 'Bolsón semanal'], weightNotice: 'Peso aproximado · total a confirmar.' },
};
