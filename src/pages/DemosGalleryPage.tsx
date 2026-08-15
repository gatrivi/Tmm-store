import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
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
  samplePath: string;
  image: string;
  imageAlt: string;
  tags: string[];
  featured?: boolean;
};

const FILTERS: DemoFilter[] = ['Todos', 'Catálogo', 'Página', 'Tienda'];

const DEMOS: DemoItem[] = [
  {
    name: 'Pizzería G',
    rubro: 'Pizzería',
    kind: 'Tienda',
    description: 'Productos, variantes, carrito y pedido completo desde el celular.',
    samplePath: '/demo/pizzeria',
    image: '/demos/pizzeria/napo.jpg',
    imageAlt: 'Pizza napolitana de la tienda demo Pizzería G',
    tags: ['Carrito', 'Mercado Pago / alias', 'Pedidos'],
    featured: true,
  },
  {
    name: 'Zimba Pet',
    rubro: 'Pet shop · Vicente López',
    kind: 'Tienda',
    description: 'Alimento, reposición, retiro y delivery para que la compra habitual se resuelva en pocos toques.',
    samplePath: '/demo/zimba-pet',
    image: '/demos/presets/petshop/alimento-perro.jpg',
    imageAlt: 'Alimento para mascotas de la muestra conceptual Zimba Pet',
    tags: ['Compra habitual', 'Retiro / delivery', 'Pedidos'],
  },
  {
    name: 'Canavesi',
    rubro: 'Carnicería · Olivos',
    kind: 'Catálogo',
    description: 'Cortes y precios ordenados para dejar de mandar fotos sueltas por WhatsApp.',
    samplePath: '/demo/canavesi',
    image: '/demos/canavesi/hero.jpg',
    imageAlt: 'Catálogo demo Canavesi Carnes Olivos',
    tags: ['Fotos y precios', 'Peso estimado', 'WhatsApp'],
  },
  {
    name: 'Molino Florida',
    rubro: 'Molino · Florida',
    kind: 'Catálogo',
    description: 'Harinas, cereales y formatos mayoristas ordenados para hogar, gastronomía y producción.',
    samplePath: '/demo/molino-florida',
    image: '/demos/molino-florida/card.svg',
    imageAlt: 'Catálogo demo Molino Florida de harinas y cereales',
    tags: ['Harinas', 'Formatos mayoristas', 'WhatsApp'],
  },
  {
    name: 'Mamá Mabel',
    rubro: 'Repostería artesanal',
    kind: 'Página',
    description: 'Portfolio, marca y encargos en una página que presenta el trabajo antes del contacto.',
    samplePath: '/demo/mamabel',
    image: '/demos/mamabel/picked/hero.jpg',
    imageAlt: 'Mamá Mabel con su delantal de repostería',
    tags: ['Portfolio', 'Encargos', 'Marca'],
  },
  {
    name: 'Aguacats',
    rubro: 'Frescos y almacén',
    kind: 'Catálogo',
    description: 'Productos separados, opciones de maduración y una forma clara de consultar o pedir.',
    samplePath: '/demo/aguacats',
    image: '/demos/aguacats/frescura.jpg',
    imageAlt: 'Productos frescos de la demo Aguacats',
    tags: ['Productos', 'Maduración', 'WhatsApp'],
  },
  {
    name: 'La Inmaculada',
    rubro: 'Verdulería',
    kind: 'Tienda',
    description: 'Peso, unidad y total estimado para convertir el pedido semanal en un flujo simple.',
    samplePath: '/demo/verduleria',
    image: '/demos/verduleria/hero.jpg',
    imageAlt: 'Verduras y bolsón de la demo La Inmaculada',
    tags: ['Peso / unidad', 'Total', 'Pedido'],
  },
  {
    name: 'Gabriel',
    rubro: 'Carnicería',
    kind: 'Tienda',
    description: 'Cortes, combos, retiro y delivery con menos ida y vuelta para cerrar el pedido.',
    samplePath: '/demo/carniceria',
    image: '/demos/carniceria/gabriel-hero.jpg',
    imageAlt: 'Cortes de carne de la tienda demo Gabriel',
    tags: ['Cortes', 'Combos', 'Delivery'],
  },
];

export default function DemosGalleryPage() {
  const location = useLocation();
  const [filter, setFilter] = useState<DemoFilter>('Todos');
  const [query, setQuery] = useState('');
  const reserveHref = buildReserveHref({ source: 'demos catalogo — quiero una asi' });

  useEffect(() => {
    captureAttribution(location.search);
  }, [location.search]);

  useEffect(() => {
    document.title = 'Muestras · Catálogo Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Catálogo de muestras de sitios, catálogos y tiendas online para negocios reales. Abrí cada demo y probala como cliente.',
      );
  }, []);

  const visibleDemos = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('es');
    return DEMOS.filter(item => {
      const matchesFilter = filter === 'Todos' || item.kind === filter;
      const haystack = [item.name, item.rubro, item.kind, item.description, ...item.tags]
        .join(' ')
        .toLocaleLowerCase('es');
      const matchesQuery = !normalized || haystack.includes(normalized);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            to={withAttribution('/')}
            className="inline-flex items-center gap-2 text-sm font-black"
            aria-label="Volver a Gatrivi.com"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">GATRIVI.COM</span>
            <span className="sm:hidden">Volver</span>
          </Link>

          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-black/40">Catálogo</p>
            <p className="text-sm font-black tracking-[-0.02em]">Muestras</p>
          </div>

          <a
            href={reserveHref}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white transition hover:-translate-y-0.5"
          >
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
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">
                  Abrí una. Probala.
                </p>
                <h1 className="mt-4 max-w-3xl text-[clamp(3rem,8vw,5.8rem)] font-black leading-[0.88] tracking-[-0.075em]">
                  Nuestros sitios,
                  <span className="block text-[#ff6b35]">en el estante.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-black/55 sm:text-lg">
                  Esto también es una muestra: nuestro catálogo de trabajos usa el mismo criterio que vendemos a un negocio.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-black/10 bg-[#f5f2eb] p-5">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <div>
                    <p className="font-black">Sin screenshots falsos.</p>
                    <p className="mt-1 text-sm leading-relaxed text-black/55">
                      Cada tarjeta abre una demo navegable. Lo que ves es lo que podemos entregar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <label className="relative block">
                <span className="sr-only">Buscar una muestra</span>
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
                />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="Buscar por rubro o función…"
                  className="min-h-12 w-full rounded-full border border-black/10 bg-[#f5f2eb] pl-11 pr-11 text-sm font-bold outline-none transition placeholder:text-black/35 focus:border-black/35"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/45 transition hover:bg-black/5 hover:text-black"
                    aria-label="Limpiar búsqueda"
                  >
                    <X size={16} />
                  </button>
                )}
              </label>

              <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0" aria-label="Filtrar muestras">
                {FILTERS.map(option => {
                  const active = filter === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFilter(option)}
                      className={`min-h-11 shrink-0 rounded-full px-4 text-xs font-black transition ${
                        active
                          ? 'bg-black text-white'
                          : 'border border-black/10 bg-white text-black/55 hover:border-black/25 hover:text-black'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-black/35">Resultados</p>
                <p className="mt-1 text-lg font-black">
                  {visibleDemos.length} {visibleDemos.length === 1 ? 'muestra' : 'muestras'}
                </p>
              </div>
              <p className="hidden text-xs font-bold text-black/40 sm:block">Tocá una tarjeta para abrirla</p>
            </div>

            {visibleDemos.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {visibleDemos.map(item => (
                  <Link
                    key={item.samplePath}
                    to={withAttribution(item.samplePath)}
                    className="group overflow-hidden rounded-[1.75rem] border border-black/10 bg-white shadow-[0_12px_35px_rgba(30,25,15,0.06)] transition hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_20px_45px_rgba(30,25,15,0.11)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                      <img
                        src={item.image}
                        alt={item.imageAlt}
                        loading={item.featured ? 'eager' : 'lazy'}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-black shadow-sm backdrop-blur">
                        {item.kind}
                      </span>
                      {item.featured && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#ff6b35] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-sm">
                          Destacada
                        </span>
                      )}
                      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                        <p className="text-xs font-bold text-white/65">{item.rubro}</p>
                        <h2 className="mt-1 text-2xl font-black tracking-[-0.04em]">{item.name}</h2>
                      </div>
                    </div>

                    <div className="p-5">
                      <p className="min-h-[3rem] text-sm font-medium leading-relaxed text-black/58">
                        {item.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tags.map(tag => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f5f2eb] px-2.5 py-1.5 text-[10px] font-black text-black/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-5 flex items-center justify-between border-t border-black/8 pt-4">
                        <span className="text-xs font-black">Abrir muestra</span>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white transition group-hover:bg-[#ff6b35]">
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-black/20 bg-white px-6 py-16 text-center">
                <p className="text-xl font-black">No encontramos esa muestra.</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-black/50">
                  Probá otra palabra o mirá todas. Si tu rubro no está, podemos armar una muestra específica.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFilter('Todos');
                    setQuery('');
                  }}
                  className="mt-5 rounded-full bg-black px-5 py-3 text-xs font-black text-white"
                >
                  Ver todas
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-black/10 bg-[#171717] py-14 text-white sm:py-18">
          <div className="mx-auto flex max-w-6xl flex-col gap-7 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.15em] text-[#ff8a5c]">¿No está tu rubro?</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                Te mostramos cómo podría verse el tuyo.
              </h2>
            </div>
            <a
              href={reserveHref}
              className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff7d4d]"
            >
              <MessageCircle size={18} />
              Quiero una así
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#171717] px-4 py-7 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 text-xs font-bold text-white/40">
          <span>GATRIVI.COM · de ZengaSoft</span>
          <Link to={withAttribution('/')} className="transition hover:text-white">Inicio</Link>
        </div>
      </footer>
    </div>
  );
}