const ORIGIN = 'https://tmm.gatrivi.com';

const page = (id, paths, title, description, image, options = {}) => ({
  id,
  paths,
  output: `social-${id}.html`,
  title,
  description,
  image: image.startsWith('http') ? image : `${ORIGIN}${image}`,
  url: `${ORIGIN}${options.canonicalPath ?? paths[0]}`,
  robots: options.robots ?? 'index, follow',
  imageAlt: options.imageAlt ?? title,
});

export const socialPages = [
  page('precios', ['/precios'], 'Planes y precios — Gatrivi.com', 'Compará Básico, Estándar y Premium. Implementación desde catálogo hasta tienda completa, sin abono mensual obligatorio.', '/og/precios.png'),
  page('oferta', ['/oferta', '/empezar', '/web', '/sitio', '/tienda', '/catalogo'], 'Tu negocio online — Gatrivi.com', 'Catálogo y tienda online para negocios. Promo lanzamiento, carga inicial incluida y sin comisión sobre tus ventas.', '/og/oferta.png', { canonicalPath: '/oferta' }),
  page('soporte', ['/soporte', '/mantenimiento'], 'Soporte y cambios — Gatrivi.com', 'Soporte opcional para tu web. Sin abono obligatorio o planes mensuales para delegar cambios y mantenimiento.', '/og/soporte.png', { canonicalPath: '/soporte' }),
  page('reservar', ['/reservar'], 'Reservá tu proyecto — Gatrivi.com', 'Reservá la implementación con una seña de $65.000. Elegí el plan y pagá por Mercado Pago o transferencia.', '/og/reservar.png'),
  page('demos', ['/demos'], 'Muestras de catálogos y tiendas — Gatrivi.com', 'Demos navegables de catálogos, páginas y tiendas online. Entrá como cliente y probá cómo funciona cada una.', '/og/demos.png'),
  page('panaderia', ['/panaderia', '/demo/panaderia'], 'La Magdalena — demo de tienda para panaderías', 'Facturas, formatos por media o docena, horarios de retiro y pedido estructurado desde el celular.', '/demos/panaderia/products/medialunas.jpg', { canonicalPath: '/panaderia', robots: 'noindex, follow' }),
  page('heladeria', ['/heladeria', '/demo/heladeria'], 'Helados del Barrio — demo de tienda para heladerías', 'Armá varios cuartos, poneles nombre y elegí sabores por persona desde el celular.', '/og/demo-heladeria.png', { canonicalPath: '/heladeria', robots: 'noindex, follow' }),
  page('cafe-roca', ['/cafe-roca', '/demo/cafe-roca'], 'Café Roca — demo para café y restaurante', 'Carta por categorías, carrito y reserva para un local gastronómico con servicio durante todo el día.', '/demos/panaderia/products/cafe-leche.jpg', { canonicalPath: '/cafe-roca', robots: 'noindex, follow' }),
  page('pizzeria', ['/pizzeria', '/demo/pizzeria'], 'Pizzería G — demo de tienda online', 'Productos, variantes, carrito y pedido completo desde el celular.', '/demos/pizzeria/napo.jpg', { canonicalPath: '/pizzeria', robots: 'noindex, follow' }),
  page('zimba-pet', ['/zimba-pet', '/demo/zimba-pet'], 'Zimba Pet — demo de tienda para pet shops', 'Alimento, reposición, retiro y delivery para resolver la compra habitual en pocos toques.', '/demos/presets/petshop/alimento-perro.jpg', { canonicalPath: '/zimba-pet', robots: 'noindex, follow' }),
  page('canavesi', ['/canavesi', '/demo/canavesi'], 'Canavesi — demo de catálogo para carnicería', 'Cortes y precios ordenados para dejar de mandar fotos sueltas por WhatsApp.', '/demos/canavesi/hero.jpg', { canonicalPath: '/canavesi', robots: 'noindex, follow' }),
  page('carniceria', ['/carniceria', '/demo/carniceria'], 'Gabriel — demo de tienda para carnicerías', 'Cortes, combos, retiro y delivery con un pedido claro y menos ida y vuelta.', '/demos/carniceria/og.png', { canonicalPath: '/carniceria', robots: 'noindex, follow' }),
  page('molino-florida', ['/molino-florida', '/demo/molino-florida'], 'Molino Florida — demo de catálogo online', 'Harinas, cereales y formatos mayoristas ordenados para hogar, gastronomía y producción.', '/og/demo-molino-florida.png', { canonicalPath: '/molino-florida', robots: 'noindex, follow' }),
  page('ferreteria', ['/ferreteria', '/demo/ferreteria'], 'Ferretería Norte — demo de tienda online', 'Herramientas, medidas, presentaciones y pedido armado sin depender de audios o fotos sueltas.', '/og/demo-ferreteria.png', { canonicalPath: '/ferreteria', robots: 'noindex, follow' }),
  page('mamabel', ['/mamabel', '/demo/mamabel'], 'Mamá Mabel — demo de página para repostería', 'Portfolio, marca y encargos en una página que presenta el trabajo antes del contacto.', '/demos/mamabel/picked/hero.jpg', { canonicalPath: '/mamabel', robots: 'noindex, follow' }),
  page('aguacats', ['/aguacats', '/demo/aguacats'], 'Aguacats — demo de catálogo de frescos', 'Productos separados, opciones de maduración y una forma clara de consultar o pedir.', '/demos/aguacats/frescura.jpg', { canonicalPath: '/aguacats', robots: 'noindex, follow' }),
  page('verduleria', ['/verduleria', '/demo/verduleria'], 'La Inmaculada — demo de tienda para verdulerías', 'Peso, unidad y total estimado para convertir el pedido semanal en un flujo simple.', '/demos/verduleria/og.png', { canonicalPath: '/verduleria', robots: 'noindex, follow' }),
];

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}
export function findSocialPage(pathname) {
  const clean = normalizePath(pathname);
  return socialPages.find(item => item.paths.includes(clean));
}
function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}
function replaceOrAppendMeta(html, attribute, key, value) {
  const safe = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matcher = new RegExp(`<meta\\s+${attribute}=["']${safe}["'][^>]*>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(value)}" />`;
  return matcher.test(html) ? html.replace(matcher, tag) : html.replace('</head>', `    ${tag}\n  </head>`);
}
export function injectSocialMetadata(html, meta) {
  let output = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(meta.url)}" />`);
  for (const [attribute, key, value] of [
    ['name','description',meta.description], ['name','robots',meta.robots], ['property','og:type','website'], ['property','og:site_name','Gatrivi.com'], ['property','og:locale','es_AR'], ['property','og:url',meta.url], ['property','og:title',meta.title], ['property','og:description',meta.description], ['property','og:image',meta.image], ['property','og:image:alt',meta.imageAlt], ['property','og:image:width','1200'], ['property','og:image:height','630'], ['name','twitter:card','summary_large_image'], ['name','twitter:title',meta.title], ['name','twitter:description',meta.description], ['name','twitter:image',meta.image], ['name','twitter:image:alt',meta.imageAlt],
  ]) output = replaceOrAppendMeta(output, attribute, key, value);
  return output;
}
