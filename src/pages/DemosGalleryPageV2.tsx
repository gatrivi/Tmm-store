import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  MessageCircle,
  Search,
  X,
} from 'lucide-react';
import {
  buildReserveHref,
  captureAttribution,
  withAttribution,
} from '../utils/demoIntake';

type DemoKind = 'Catálogo' | 'Página' | 'Tienda';
type DemoFilter = 'Todos' | DemoKind;

type DemoItem = {
  name: string;
  rubro: string;
  kind: DemoKind;
  description: string;
  samplePath?: string;
  externalUrl?: string;
  image: string;
  imageAlt: string;
  tags: string[];
  featured?: boolean;
  realSite?: boolean;
};

const FILTERS: DemoFilter[] = ['Todos', 'Catálogo', 'Página', 'Tienda'];

const DEMOS: DemoItem[] = [
  {
    name: 'La Magdalena',
    rubro: 'Panadería',
    kind: 'Tienda',
    description: 'Facturas, formatos por media o docena, horarios de retiro y pedido estructurado sin audios.',
    samplePath: '/panaderia',
    image: '/demos/panaderia/products/medialunas.jpg',
    imageAlt: 'Medialunas de la demo de panadería La Magdalena',
    tags: ['Horarios', 'Media / docena', 'Pedidos'],
    featured: true,
  },
  {
    name: 'Helados del Barrio',
    rubro: 'Heladería',
    kind: 'Tienda',
    description: 'Armá varios cuartos, poneles nombre y elegí hasta tres sabores por persona desde el celular.',
    samplePath: '/heladeria',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=82',
    imageAlt: 'Helado artesanal de la demo Helados del Barrio',
    tags: ['Sabores', 'Pedido grupal', 'Mobile'],
    featured: true,
  },
  {
    name: 'Café Roca',
    rubro: 'Café · restaurante',
    kind: 'Tienda',
    description: 'Carta por categorías, carrito y reserva para un local gastronómico con servicio durante todo el día.',
    samplePath: '/cafe-roca',
    image: '/demos/panaderia/products/cafe-leche.jpg',
    imageAlt: 'Café con leche de la demo Café Roca',
    tags: ['Carta', 'Reserva', 'Carrito'],
    featured: true,
  },
  {
    name: 'Pizzería G',
    rubro: 'Pizzería',
    kind: 'Tienda',
    description: 'Productos, variantes, carrito y pedido completo desde el celular.',
    samplePath: '/pizzeria',
    image: '/demos/pizzeria/napo.jpg',
    imageAlt: 'Pizza napolitana de la tienda demo Pizzería G',
    tags: ['Carrito', 'Mercado Pago / alias', 'Pedidos'],
  },
  {
    name: 'Zimba Pet',
    rubro: 'Pet shop · Vicente López',
    kind: 'Tienda',
    description: 'Alimento, reposición, retiro y delivery para que la compra habitual se resuelva en pocos toques.',
    samplePath: '/zimba-pet',
    image: '/demos/presets/petshop/alimento-perro.jpg',
    imageAlt: 'Alimento para mascotas de la muestra conceptual Zimba Pet',
    tags: ['Compra habitual', 'Retiro / delivery', 'Pedidos'],
  },
  {
    name: 'Canavesi',
    rubro: 'Carnicería · Olivos',
    kind: 'Catálogo',
    description: 'Cortes y precios ordenados para dejar de mandar fotos sueltas por WhatsApp.',
    samplePath: '/canavesi',
    image: '/demos/canavesi/hero.jpg',
    imageAlt: 'Catálogo demo Canavesi Carnes Olivos',
    tags: ['Fotos y precios', 'Peso estimado', 'WhatsApp'],
  },
  {
    name: 'Gabriel',
    rubro: 'Carnicería',
    kind: 'Tienda',
    description: 'Cortes, combos, retiro y delivery con menos ida y vuelta para cerrar el pedido.',
    samplePath: '/carniceria',
    image: '/demos/carniceria/gabriel-hero.jpg',
    imageAlt: 'Cortes de carne de la tienda demo Gabriel',
    tags: ['Cortes', 'Combos', 'Delivery'],
  },
  {
    name: 'Molino Florida',
    rubro: 'Molino · Florida',
    kind: 'Catálogo',
    description: 'Harinas, cereales y formatos mayoristas ordenados para hogar, gastronomía y producción.',
    samplePath: '/molino-florida',
    image: '/demos/molino-florida/card.svg',
    imageAlt: 'Catálogo demo Molino Florida de harinas y cereales',
    tags: ['Harinas', 'Formatos mayoristas', 'WhatsApp'],
  },
  {
    name: 'Ferretería Norte',
    rubro: 'Ferretería · Zona Norte',
    kind: 'Tienda',
    description: 'Herramientas, medidas, presentaciones y pedido armado sin depender de audios o fotos sueltas.',
    samplePath: '/ferreteria',
    image: '/demos/ferreteria/hero.svg',
    imageAlt: 'Banco de trabajo de la tienda demo Ferretería Norte',
    tags: ['Herramientas', 'Variantes', 'Retiro / envío'],
  },
  {
    name: 'Mamá Mabel',
    rubro: 'Repostería artesanal',
    kind: 'Página',
    description: 'Portfolio, marca y encargos en una página que presenta el trabajo antes del contacto.',
    samplePath: '/mamabel',
    image: '/demos/mamabel/thumbnail.webp',
    imageAlt: 'Portada de Tortas de Mamá Mabel',
    tags: ['Portfolio', 'Encargos', 'Marca'],
  },
  {
    name: 'Aguacats',
    rubro: 'Frescos y almacén',
    kind: 'Catálogo',
    description: 'Productos separados, opciones de maduración y una forma clara de consultar o pedir.',
    samplePath: '/aguacats',
    image: '/demos/aguacats/card.svg',
    imageAlt: 'Portada de Aguacats con identidad de gato y palta',
    tags: ['Productos', 'Maduración', 'WhatsApp'],
  },
  {
    name: 'La Inmaculada',
    rubro: 'Verdulería',
    kind: 'Tienda',
    description: 'Peso, unidad y total estimado para convertir el pedido semanal en un flujo simple.',
    samplePath: '/verduleria',
    image: '/demos/verduleria/hero.jpg',
    imageAlt: 'Verduras y bolsón de la demo La Inmaculada',
    tags: ['Peso / unidad', 'Total', 'Pedido'],
  },
  {
    name: 'El Puestito del Tío',
    rubro: 'Parrilla 24 hs · Palermo',
    kind: 'Catálogo',
    description: 'Menú completo con variantes, precios y platos explicados para decidir antes de llegar o pedir.',
    externalUrl: 'https://elpuestitodeltio.com/',
    image: 'https://elpuestitodeltio.com/hero-new.jpg',
    imageAlt: 'El Puestito del Tío, parrilla 24 horas en Palermo',
    tags: ['Sitio real', 'Menú', 'Variantes y precios'],
    realSite: true,
  },
  {
    name: 'Ricardo Hombres',
    rubro: 'Indumentaria masculina · San Fernando',
    kind: 'Tienda',
    description: 'Catálogo amplio de indumentaria masculina, talles, categorías y contacto comercial.',
    externalUrl: 'https://ricardohombres.com.ar/',
    image: 'https://lirp.cdn-website.com/e46c27d6/dms3rep/multi/opt/pexels-photo-325876-1920w.jpeg',
    imageAlt: 'Indumentaria masculina de Ricardo Hombres',
    tags: ['Sitio real', 'Indumentaria', 'Tienda online'],
    realSite: true,
  },
  {
    name: 'Navarro Vial',
    rubro: 'Construcción e infraestructura',
    kind: 'Página',
    description: 'Sitio corporativo de obra e infraestructura con foco visual en proyectos, capacidad técnica y contacto.',
    externalUrl: 'https://navarrovial.zengasoft.shop/',
    image: 'https://navarrovial.zengasoft.shop/og/default.jpg',
    imageAlt: 'Sitio corporativo Navarro Vial de construcción e infraestructura',
    tags: ['Sitio real', 'Portfolio', 'Obra e infraestructura'],
    realSite: true,
  },
];

export default function DemosGalleryPageV2() {
  const location = useLocation();
  const [filter, setFilter] = useState<DemoFilter>('Todos');
  const [query, setQuery] = useState('');
  const reserveHref = buildReserveHref({ source: 'demos catalogo — quiero una asi' });

  useEffect(() => {
    captureAttribution(location.search);
  }, [location.search]);

  useEffect(() => {
    document.title = 'Muestras · Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Demos navegables de catálogos, páginas y tiendas online. Cada muestra tiene una URL corta y se puede probar como cliente.',
      );
  }, []);

  const visibleDemos = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return DEMOS.filter(item => {
      const matchesFilter = filter === 'Todos' || item.kind === filter;
      const haystack = [item.name, item.rubro, item.kind, item.description, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('es');
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to={withAttribution('/')} className="inline-flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">GATRIVI.COM</span>
            <span className="sm:hidden">Volver</span>
          </Link>
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Catálogo</p>
            <p className="text-sm font-black">Muestras</p>
          </div>
          <a href={reserveHref} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white">
            <span className="hidden sm:inline">Quiero una así</span>
            <MessageCircle size={16} />
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-black/10 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_.72fr] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Abrí una. Usala.</p>
                <h1 className="mt-4 max-w-3xl text-[clamp(3rem,8vw,5.8rem)] font-black leading-[0.88] tracking-[-0.075em]">
                  Demos que se
                  <span className="block text-[#ff6b35]">pueden probar.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-black/55 sm:text-lg">
                  Catálogo, página o tienda. Cada demo interna tiene una URL corta de Gatrivi.com y un QR al final para pasarla de pantalla en pantalla.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-black/10 bg-[#f5f2eb] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-black">No son screenshots.</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">Entrá, tocá productos, armá pedidos y probá los flujos.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <span className="sr-only">Buscar una muestra</span>
                <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35" />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar panadería, restaurante, tienda…"
                  className="min-h-12 w-full rounded-full border border-black/10 bg-[#f5f2eb] pl-11 pr-11 text-sm font-bold outline-none placeholder:text-black/35 focus:border-black/35"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/45 hover:bg-black/5" aria-label="Limpiar búsqueda">
                    <X size={16} />
                  </button>
                )}
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
                {FILTERS.map(option => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setFilter(option)}
                    className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black transition ${filter === option ? 'bg-black text-white' : 'border border-black/10 bg-white text-black/55 hover:border-black/25 hover:text-black'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">Resultados</p>
                <p className="mt-1 text-lg font-black">{visibleDemos.length} {visibleDemos.length === 1 ? 'muestra' : 'muestras'}</p>
              </div>
              <p className="hidden text-xs font-bold text-black/40 sm:block">Tocá una tarjeta para abrirla</p>
            </div>

            {visibleDemos.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDemos.map(item => {
                  const href = withAttribution(item.externalUrl || item.samplePath || '/demos');
                  const body = (
                    <>
                      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                        <img src={item.image} alt={item.imageAlt} loading={item.featured ? 'eager' : 'lazy'} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/75">{item.rubro}</p>
                            <p className="mt-1 text-2xl font-black tracking-[-0.04em]">{item.name}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-black">{item.kind}</span>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-sm font-medium leading-relaxed text-black/55">{item.description}</p>
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {item.tags.map(tag => <span key={tag} className="rounded-full bg-black/[0.045] px-2.5 py-1 text-[10px] font-black text-black/55">{tag}</span>)}
                        </div>
                        <div className="mt-auto pt-5">
                          <p className="truncate text-[11px] font-black text-[#d84d1d]">
                            {item.samplePath ? `gatrivi.com${item.samplePath}` : item.externalUrl?.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </p>
                          <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-black">
                            <span>{item.realSite ? 'Abrir sitio' : 'Probar demo'}</span>
                            {item.realSite ? <ExternalLink size={16} /> : <ArrowRight size={16} />}
                          </div>
                        </div>
                      </div>
                    </>
                  );

                  const classes = 'group flex min-h-full flex-col overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,.05)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,.10)]';
                  return item.externalUrl ? (
                    <a key={item.name} href={href} target="_blank" rel="noreferrer" className={classes}>{body}</a>
                  ) : (
                    <Link key={item.name} to={href} className={classes}>{body}</Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-black/20 bg-white px-6 py-14 text-center">
                <p className="text-lg font-black">No encontré una demo con ese filtro.</p>
                <button type="button" onClick={() => { setFilter('Todos'); setQuery(''); }} className="mt-4 rounded-full bg-black px-4 py-2 text-xs font-black text-white">Ver todas</button>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
