/**
 * Propuestas de outreach por rubro (/propuesta/[rubro]).
 * Una sola página + este config: sin duplicar páginas.
 */

export type PropuestaItem = {
  name: string;
  description: string;
  /** Demo interna (ruta del repo) o sitio real de referencia */
  href: string;
  external?: boolean;
};

export type Propuesta = {
  slug: string;
  /** Nombre del rubro para el título */
  title: string;
  /** Una línea: qué problema resuelve */
  hook: string;
  bullets: string[];
  /** Demo principal para mostrar primero en el celular */
  primaryDemo: PropuestaItem;
  /** Otras demos de respaldo */
  moreDemos: PropuestaItem[];
};

export const PROPUESTA_PRICE = {
  sale: '$325.000',
  list: '$650.000',
  deposit: '$65.000',
};

const PRICE_NOTE = 'Promo lanzamiento · se descuenta del total, sin comisión por venta.';

export const PROPUESTAS: Propuesta[] = [
  {
    slug: 'gastronomia',
    title: 'Gastronomía y panadería',
    hook: 'Tu carta online con fotos y precios: el cliente elige y te llega el pedido armado por WhatsApp.',
    bullets: [
      'Carta con fotos, precios y variantes (media docena, sin talco, etc.)',
      'Pedido ordenado a tu WhatsApp: productos, total y datos del cliente',
      'Sin comisión por pedido — a diferencia de las apps',
      'Cargamos tu menú y quedás listo en 2–3 días',
    ],
    primaryDemo: {
      name: 'Pizzería G',
      description: 'Tienda completa: variantes, carrito y pedido desde el celular.',
      href: '/demo/pizzeria',
    },
    moreDemos: [
      {
        name: 'La Magdalena · Panadería',
        description: 'Facturas por media o docena con horarios de retiro.',
        href: '/demo/panaderia',
      },
      {
        name: 'Pollería del barrio',
        description: 'Spiedo y combos con papas, pedido del domingo sin audios.',
        href: '/demo/polleria',
      },
      {
        name: 'Canavesi · Carnicería',
        description: 'Cortes y precios claros, pedido por WhatsApp.',
        href: '/demo/canavesi',
      },
    ],
  },
  {
    slug: 'indumentaria',
    title: 'Indumentaria',
    hook: 'Catálogo con talles y categorías para que te consulten por prenda, no por foto suelta.',
    bullets: [
      'Ficha por prenda: talles, colores, precio y fotos reales',
      'Consultas y pedidos ordenados por WhatsApp',
      'Actualizás stock y precios sin depender de nadie',
      'Listo en 3 días con el material completo',
    ],
    primaryDemo: {
      name: 'Ricardo Hombres',
      description: 'Tienda real de indumentaria masculina: talles, categorías y contacto.',
      href: 'https://ricardohombres.com.ar/',
      external: true,
    },
    moreDemos: [
      {
        name: 'Zimba Pet',
        description: 'Tienda de barrio: compra habitual con retiro o delivery.',
        href: '/demo/zimba-pet',
      },
      {
        name: 'Catálogo Gatrivi',
        description: 'Catálogo simple con fotos y precios para consultar por WhatsApp.',
        href: '/demo/panaderia',
      },
    ],
  },
  {
    slug: 'calzado',
    title: 'Calzado',
    hook: 'Mostrá cada modelo con talle y stock disponible: menos idas y vueltas antes de la venta.',
    bullets: [
      'Ficha por modelo: talle, color, precio y fotos',
      'El cliente consulta por el modelo exacto, no por foto',
      'Pedidos y consultas ordenadas a tu WhatsApp',
      'Sin comisión por venta',
    ],
    primaryDemo: {
      name: 'Ferretería Norte',
      description: 'Demo de tienda con variantes y medidas — misma lógica que talles de calzado.',
      href: '/demo/ferreteria',
    },
    moreDemos: [
      {
        name: 'Ricardo Hombres',
        description: 'Tienda real de indumentaria con talles y categorías.',
        href: 'https://ricardohombres.com.ar/',
        external: true,
      },
      {
        name: 'Zimba Pet',
        description: 'Retail de barrio con retiro o delivery.',
        href: '/demo/zimba-pet',
      },
    ],
  },
  {
    slug: 'regalos-deco',
    title: 'Regalos y Deco',
    hook: 'Un catálogo lindo y rápido para que te elijan desde el celular y te pidan por WhatsApp.',
    bullets: [
      'Catálogo con fotos, precios y categorías por ocasión',
      'Encargos y consultas ordenadas, sin fotos sueltas',
      'Diseño pensado para celular — donde compra tu cliente',
      'Dominio propio por 1 año incluido',
    ],
    primaryDemo: {
      name: 'Mamá Mabel',
      description: 'Portfolio y encargos de repostería: marca, fotos y contacto.',
      href: '/demo/mamabel',
    },
    moreDemos: [
      {
        name: 'Aguacats',
        description: 'Catálogo de productos con presentación clara.',
        href: '/demo/aguacats',
      },
      {
        name: 'La Inmaculada',
        description: 'Tienda con pedido semanal simple.',
        href: '/demo/verduleria',
      },
    ],
  },
];

export function getPropuesta(slug?: string): Propuesta | null {
  return PROPUESTAS.find(p => p.slug === slug) ?? null;
}


export { PRICE_NOTE };
