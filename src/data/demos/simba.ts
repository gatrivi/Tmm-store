import type { OrderRecord } from '../../types/order';
import type { DemoCopy, DemoDefinition } from './types';
import { PRESET_PETSHOP } from '../demoPresets';

const now = Date.now();
const cleanProductCopy: Record<string, { name: string; description: string }> = {
  'alimento-perro': { name: 'Alimento para perro', description: 'Presentaciones ilustrativas · marca genérica' },
  'alimento-gato': { name: 'Alimento para gato', description: 'Presentación ilustrativa' },
  humedo: { name: 'Alimento húmedo', description: 'Unidad o pack' },
  arena: { name: 'Arena sanitaria', description: 'Presentaciones de 4 kg o 10 kg' },
  shampoo: { name: 'Shampoo', description: 'Higiene y cuidado diario' },
  collar: { name: 'Collar', description: 'Talles ilustrativos' },
  correa: { name: 'Correa', description: 'Corta o larga' },
  snack: { name: 'Snacks y juguetes', description: 'Unidad o pack · compra habitual' },
};
const menuItems = PRESET_PETSHOP.menuItems.map(item => ({
  ...item,
  ...(cleanProductCopy[item.id] ?? {}),
}));

const seedOrders: OrderRecord[] = [{
  id: 'S1M2', tenantId: 'demo-simba', status: 'new', customerName: 'Camila R.', customerPhone: '',
  deliveryType: 'delivery', address: 'Villa Crespo (demo)', paymentMethod: 'cash', paymentStatus: 'pending',
  notes: 'Entregar por la tarde', items: [
    { id: 'alimento-perro', name: 'Alimento para perro', optionId: '3kg', optionLabel: '3 kg', price: 18500, qty: 1 },
    { id: 'snack', name: 'Snacks / juguete', optionId: 'pack', optionLabel: 'Pack', price: 8900, qty: 1 },
  ], subtotal: 27400, discount: 0, total: 27400, source: 'demo',
  createdAt: new Date(now - 8 * 60_000).toISOString(), updatedAt: new Date(now - 8 * 60_000).toISOString(),
}];

const copy: DemoCopy = {
  heroTitle: 'Todo para tu mascota, sin vueltas.', heroBody: 'Elegí alimento, higiene y accesorios. Simba confirma stock, zona y entrega por WhatsApp.',
  checkoutCta: 'Armar pedido', cartCta: 'Armar pedido', totalLabel: 'Total estimado', totalHint: 'Simba confirma stock, cobertura y horario antes de preparar.',
  ownerTitle: 'Pedidos de Simba Petshop', ownerSubtitle: 'Panel del local · hoy', ribbonLabel: 'DEMO · productos, precios y stock ilustrativos',
  pickupLabel: 'Retiro', deliveryLabel: 'Delivery', pickupHint: 'Retiro en el local. Simba confirma horario por WhatsApp.', deliveryHint: 'Indicá barrio y horario; Simba confirma cobertura y costo.',
  cashLabel: 'Efectivo al recibir', transferLabel: 'Transferencia al confirmar', submitLabel: 'Enviar pedido de prueba', reviewTitle: 'Revisá tu pedido de prueba',
  reviewBody: 'No se envió ningún mensaje ni pago real.', addressPlaceholder: 'Barrio, dirección y horario', successEyebrow: 'Pedido de prueba creado',
  transferAliasPending: 'Simba informa el alias al confirmar', successTitle: 'Pedido de prueba creado', successBody: 'Es una simulación: no se envió ningún mensaje ni pago.',
  ownerLinkLabel: 'Ver cómo lo recibe el local', statusLinkLabel: 'Ver estado del pedido', continueLabel: 'Seguir comprando', revenueLabel: 'Pedidos sesión',
  notesPlaceholder: 'Barrio · retiro/delivery · alimento habitual · observaciones', chips: ['Stock a confirmar', 'Compra habitual'],
  weightNotice: 'Muestra conceptual. Productos, precios, stock y condiciones ilustrativas.',
};

export const SIMBA_PETSHOP_DEMO: DemoDefinition = {
  id: 'simba', tenantId: 'demo-simba', customerPath: '/demo/simba', ownerPath: '/demo/simba/owner', orderPath: id => `/demo/simba/order/${id}`,
  plan: 'pedidos', locale: 'es', monogram: 'S', heroImage: '/demos/simba/hero.jpg', heroObjectPosition: 'center',
  hideLanguageSwitcher: true, hideThemeToggle: true, hideShare: true, hideAddress: false, hidePromos: true, forceOpen: true,
  theme: { hueso: '#FFF9EF', bordo: '#D9822B', carbon: '#173F35', papel: '#F2E8D5', salvia: '#F4B942' },
  siteSettings: {
    showUsdToggle: false, whatsappNumber: '', bankAlias: '', brandName: 'Simba Petshop', brandColor: '#D9822B', brandColorDark: '#173F35', brandColorLight: '#FFF9EF', brandAccent: '#F4B942', brandTextColor: '#173F35', brandFont: 'Georgia, "Times New Roman", serif', brandAddress: 'Camargo 906 · Villa Crespo · Buenos Aires', brandInstagram: 'https://www.instagram.com/simbapettshop/', brandGoogleMaps: 'https://www.google.com/maps/search/?api=1&query=Camargo+906+Buenos+Aires', brandLogo: '/demos/simba/logo.svg', menuLayout: 'grid', demoMode: true, mpEnabled: false,
  },
  menuItems, menuCategories: PRESET_PETSHOP.menuCategories, seedOrders, copy,
};
