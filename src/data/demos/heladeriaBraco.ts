import type { OrderRecord } from '../../types/order';
import type { DemoDefinition } from './types';

const item = (id: string, name: string, category: string, description: string, options: { id: string; label: string; price: number }[], badge?: string) => ({ id, name, category, description, images: [], options, ...(badge ? { badge } : {}) });
const menuItems = [
  item('cuarto', 'Helado por peso', 'helado', 'Elegí tus gustos en el pedido', [{ id: '1-4', label: '¼ kg', price: 6200 }, { id: '1-2', label: '½ kg', price: 10800 }, { id: '1kg', label: '1 kg', price: 19800 }], 'Más pedido'),
  item('balde', 'Balde familiar', 'helado', 'Para compartir en casa', [{ id: '2l', label: '2 litros', price: 22000 }, { id: '3l', label: '3 litros', price: 29500 }]),
  item('cucurucho', 'Cucurucho', 'individual', 'Uno o dos gustos', [{ id: 'simple', label: 'Simple', price: 4200 }, { id: 'doble', label: 'Doble', price: 5600 }]),
  item('vasito', 'Vasito', 'individual', 'Ideal para llevar', [{ id: 'simple', label: 'Simple', price: 3900 }, { id: 'doble', label: 'Doble', price: 5200 }]),
  item('bombon', 'Bombón helado', 'postres', 'Postre individual ilustrativo', [{ id: 'u', label: 'Unidad', price: 5800 }]),
  item('torta', 'Torta helada', 'postres', 'Consultar gustos y disponibilidad', [{ id: '8porciones', label: '8 porciones', price: 28500 }, { id: '12porciones', label: '12 porciones', price: 39000 }], 'Encargo'),
  item('cono-pack', 'Pack de conos', 'extras', 'Para servir en casa', [{ id: 'x6', label: 'Pack x6', price: 2800 }]),
  item('salsa', 'Salsa y toppings', 'extras', 'Sumá algo dulce al pedido', [{ id: 'pack', label: 'Pack', price: 2400 }]),
];

const now = Date.now();
const seedOrders: OrderRecord[] = [{ id: 'BR24', tenantId: 'demo-heladeria-braco', status: 'new', customerName: 'Sofía L.', customerPhone: '', deliveryType: 'pickup', address: 'Retiro en el local (demo)', paymentMethod: 'cash', paymentStatus: 'pending', notes: '½ kg: dulce de leche granizado + frutilla · retirar 20:30', items: [{ id: 'cuarto', name: 'Helado por peso', optionId: '1-2', optionLabel: '½ kg', price: 10800, qty: 1 }, { id: 'cono-pack', name: 'Pack de conos', optionId: 'x6', optionLabel: 'Pack x6', price: 2800, qty: 1 }], subtotal: 13600, discount: 0, total: 13600, source: 'demo', createdAt: new Date(now - 4 * 60000).toISOString(), updatedAt: new Date(now - 4 * 60000).toISOString() }];

export const HELADERIA_BRACO_DEMO: DemoDefinition = {
  id: 'heladeria-braco', tenantId: 'demo-heladeria-braco', customerPath: '/demo/heladeria-braco', ownerPath: '/demo/heladeria-braco/owner', orderPath: id => `/demo/heladeria-braco/order/${id}`,
  plan: 'pedidos', locale: 'es', monogram: 'B', hideLanguageSwitcher: true, hideThemeToggle: true, hideShare: true, hideAddress: false, hidePromos: true, forceOpen: true,
  theme: { hueso: '#FFF7F0', bordo: '#C74B70', carbon: '#382B35', papel: '#F8DCE5', salvia: '#F0A35B' },
  siteSettings: { showUsdToggle: false, whatsappNumber: '', bankAlias: '', brandName: 'Heladería Braco', brandColor: '#C74B70', brandColorDark: '#382B35', brandColorLight: '#FFF7F0', brandAccent: '#F0A35B', brandTextColor: '#382B35', brandFont: 'system-ui, sans-serif', brandAddress: 'Ugarte 2098 · cerca de España · Olivos', brandLogo: '', menuLayout: 'grid', demoMode: true, mpEnabled: false },
  menuItems, menuCategories: [{ id: 'helado', name: 'Helado', sortOrder: 0 }, { id: 'individual', name: 'Para llevar', sortOrder: 1 }, { id: 'postres', name: 'Postres', sortOrder: 2 }, { id: 'extras', name: 'Extras', sortOrder: 3 }], seedOrders,
  copy: { heroTitle: 'Elegí tus gustos y disfrutá el momento', heroBody: 'Armá tu pedido para retirar o coordinar. Gustos, stock y horario se confirman antes de preparar.', checkoutCta: 'Armar pedido', cartCta: 'Armar pedido', totalLabel: 'Total estimado', totalHint: 'Gustos disponibles, stock y precio final se confirman antes de preparar.', ownerTitle: 'Pedidos de Heladería Braco', ownerSubtitle: 'Panel del local · hoy', ribbonLabel: 'DEMO · productos y precios ilustrativos', pickupLabel: 'Retiro en el local', deliveryLabel: 'Envío a coordinar', pickupHint: 'Indicá horario preferido y gustos en notas.', deliveryHint: 'Indicá zona y horario; el local confirma cobertura.', cashLabel: 'Efectivo al retirar', transferLabel: 'Transferencia al confirmar', submitLabel: 'Enviar pedido de prueba', reviewTitle: 'Revisá tu pedido de prueba', reviewBody: 'Todavía no se envió ningún mensaje ni pago.', addressPlaceholder: 'Zona / dirección (si corresponde)', successEyebrow: 'Pedido de prueba creado', transferAliasPending: 'El local informa el alias al confirmar', successTitle: 'Pedido de prueba creado', successBody: 'Es una simulación: no se envió ningún mensaje ni pago.', ownerLinkLabel: 'Ver cómo lo recibe el local', statusLinkLabel: 'Ver estado del pedido', continueLabel: 'Seguir eligiendo', revenueLabel: 'Pedidos estimados', notesPlaceholder: 'Gustos · horario · zona · toppings · consulta', chips: ['¼ kg / ½ kg / kg', 'Retiro en local'], weightNotice: 'Muestra ilustrativa · gustos, stock y precios a confirmar.' },
};
