import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  LayoutTemplate,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  WandSparkles,
} from 'lucide-react';
import { buildReserveHref, reserveCtaLabel, withAttribution } from '../utils/demoIntake';
import { buildProspectDemoSearch } from '../utils/prospectDemo';
import type { ProspectCategory } from '../utils/prospectDemo';

type DemoCard = {
  name: string;
  detail: string;
  samplePath: string;
  rubro?: ProspectCategory;
};

type DemoGroup = {
  title: string;
  intro: string;
  cards: DemoCard[];
};

type ShowcaseCase = {
  number: string;
  name: string;
  category: string;
  description: string;
  samplePath: string;
  image?: string;
  imageAlt: string;
  tone: 'cream' | 'dark' | 'green' | 'blue';
};

const SOLUTIONS = [
  {
    number: '01',
    title: 'Catálogo',
    copy: 'Tus productos, servicios y precios ordenados en un link fácil de compartir.',
    detail: 'Ideal para empezar a mostrarte mejor sin cambiar cómo vendés.',
    icon: BookOpen,
    href: '#casos',
  },
  {
    number: '02',
    title: 'Página',
    copy: 'Una presencia propia que explica qué hacés y genera confianza antes del WhatsApp.',
    detail: 'Diseño a medida, contenido claro y dominio propio.',
    icon: LayoutTemplate,
    href: '#proceso',
  },
  {
    number: '03',
    title: 'Tienda',
    copy: 'Catálogo, carrito, total, alias y comprobante para recibir pedidos más claros.',
    detail: 'Sin comisión por venta. El negocio sigue siendo tuyo.',
    icon: ShoppingBag,
    href: '/#planes',
  },
] as const;

const SHOWCASE_CASES: ShowcaseCase[] = [
  {
    number: '01',
    name: 'Mamá Mabel',
    category: 'Repostería artesanal',
    description: 'Un portfolio de trabajos reales convertido en una vidriera que invita a encargar.',
    samplePath: '/demo/mamabel',
    image: '/demos/mamabel/picked/hero.jpg',
    imageAlt: 'Mamá Mabel con su delantal de repostería',
    tone: 'cream',
  },
  {
    number: '02',
    name: 'Gabriel',
    category: 'Carnicería',
    description: 'Cortes, combos y pedido por WhatsApp con menos ida y vuelta.',
    samplePath: '/demo/carniceria',
    image: '/demos/carniceria/gabriel-hero.jpg',
    imageAlt: 'Cortes de carne para la demo de Gabriel',
    tone: 'dark',
  },
  {
    number: '03',
    name: 'Aguacats',
    category: 'Almacén y productos frescos',
    description: 'Una marca singular para separar productos, maduración y formas de pedir.',
    samplePath: '/demo/aguacats',
    image: '/demos/aguacats/frescura.jpg',
    imageAlt: 'Productos frescos de Aguacats',
    tone: 'green',
  },
  {
    number: '04',
    name: 'Molino Florida',
    category: 'Mayorista e insumos',
    description: 'Un catálogo pensado para bolsas, bultos, reposición y pedidos repetidos.',
    samplePath: '/demo?rubro=molino-mayorista&negocio=Molino%20Florida',
    image: '/demos/presets/molino-mayorista/harina-000.jpg',
    imageAlt: 'Insumos mayoristas Molino Florida',
    tone: 'blue',
  },
];

const DEMO_GROUPS: DemoGroup[] = [
  {
    title: 'Productos y gastronomía',
    intro: 'Mostrá lo que vendés. Hacé que pedir sea sencillo.',
    cards: [
      { name: 'Carnicería', detail: 'Cortes y combos', samplePath: '/demo/carniceria' },
      { name: 'Panadería', detail: 'Productos y retiro', samplePath: '/demo/panaderia' },
      { name: 'Pizzería', detail: 'Variantes y pedido', samplePath: '/demo/pizzeria' },
      { name: 'Pollería', detail: 'Entero, medio y combos', samplePath: '/demo?rubro=polleria', rubro: 'polleria' },
      { name: 'Cafetería', detail: 'Carta para retirar', samplePath: '/demo?rubro=cafeteria', rubro: 'cafeteria' },
      { name: 'Verdulería', detail: 'Peso, unidad y sustitutos', samplePath: '/demo?rubro=verduleria', rubro: 'verduleria' },
    ],
  },
  {
    title: 'Comercios y servicios',
    intro: 'Una presencia clara para que te encuentren y te consulten mejor.',
    cards: [
      { name: 'Pet shop', detail: 'Alimentos y accesorios', samplePath: '/demo?rubro=petshop', rubro: 'petshop' },
      { name: 'Librería', detail: 'Productos y servicios', samplePath: '/demo?rubro=libreria', rubro: 'libreria' },
      { name: 'Gráfica / imprenta', detail: 'Medidas y cotización', samplePath: '/demo?rubro=grafica', rubro: 'grafica' },
      { name: 'Almacén', detail: 'Catálogo de cercanía', samplePath: '/demo?rubro=almacen', rubro: 'almacen' },
      { name: 'Dietética', detail: 'Productos por formato', samplePath: '/demo?rubro=dietetica', rubro: 'dietetica' },
      { name: 'Rotisería', detail: 'Menú y encargos', samplePath: '/demo?rubro=rotiseria', rubro: 'rotiseria' },
    ],
  },
  {
    title: 'Mayoristas y reposición',
    intro: 'Cuando el pedido necesita formato, cantidad, zona y día.',
    cards: [
      { name: 'Distribuidora de lácteos', detail: 'Pack, caja y reparto', samplePath: '/demo?rubro=distribuidora-lacteos', rubro: 'distribuidora-lacteos' },
      { name: 'Molino / insumos', detail: 'Bolsa, bulto y reposición', samplePath: '/demo?rubro=molino-mayorista&negocio=Molino%20Florida', rubro: 'molino-mayorista' },
      { name: 'Gastronomía', detail: 'Carta y pedido de prueba', samplePath: '/demo?rubro=gastronomia', rubro: 'gastronomia' },
    ],
  },
];

function personalizePath(rubro?: ProspectCategory): string {
  if (!rubro) return withAttribution('/demo/armar');
  const search = buildProspectDemoSearch({
    businessName: 'Tu negocio',
    area: 'Zona Norte',
    category: rubro,
    color: 'carbon',
  });
  return withAttribution(`/demo/armar${search}`);
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mb-5 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#b94335]">
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

function BrowserShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[40rem] lg:mx-0 lg:max-w-none">
      <div className="absolute -right-4 -top-8 h-40 w-40 rounded-full bg-[#d7ff64]/55 blur-3xl sm:-right-8" />
      <div className="relative overflow-hidden rounded-[1.7rem] border border-black/15 bg-[#171814] p-2.5 shadow-[0_32px_80px_rgba(30,25,15,0.22)] sm:p-3">
        <div className="overflow-hidden rounded-[1.15rem] bg-[#f7f1e9]">
          <div className="flex items-center gap-1.5 border-b border-black/10 bg-[#242522] px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef6e55]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#e5be51]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#76a75d]" />
            <div className="mx-auto hidden h-5 w-2/5 rounded-full bg-white/10 sm:block" />
          </div>
          <div className="relative aspect-[1.1] overflow-hidden sm:aspect-[1.35]">
            <img
              src="/demos/mamabel/picked/hero.jpg"
              alt="Mamá Mabel, ejemplo de una tienda personalizada"
              className="absolute inset-0 h-full w-full object-cover object-[center_34%]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241c17]/90 via-[#241c17]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/65">Muestra destacada</p>
              <div className="mt-2 flex items-end justify-between gap-4">
                <div>
                  <p className="font-serif text-3xl leading-none tracking-[-0.04em] sm:text-4xl">Mamá Mabel</p>
                  <p className="mt-2 text-sm text-white/75">Repostería artesanal · Olivos</p>
                </div>
                <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[10px] font-black text-[#241c17] sm:inline-flex">
                  <MessageCircle size={13} /> Encargar
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-black/10 text-[10px] font-bold text-black/55">
            <div className="bg-[#f7f1e9] px-3 py-3 sm:px-4">Portfolio real</div>
            <div className="bg-[#f7f1e9] px-3 py-3 sm:px-4">Pedidos claros</div>
            <div className="bg-[#f7f1e9] px-3 py-3 sm:px-4">WhatsApp listo</div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-7 -left-3 w-[68%] rounded-2xl border border-black/10 bg-white p-3 shadow-[0_20px_45px_rgba(30,25,15,0.15)] sm:-left-8 sm:w-[55%] sm:p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7ff64] text-[#171814]">
            <Check size={17} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-black/40">El resultado</p>
            <p className="mt-0.5 text-xs font-black text-black/80 sm:text-sm">Se entiende en 10 segundos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseImage({ item }: { item: ShowcaseCase }) {
  if (item.image) {
    return (
      <img
        src={item.image}
        alt={item.imageAlt}
        loading="lazy"
        className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div className="flex h-full min-h-64 items-end bg-[radial-gradient(circle_at_75%_20%,rgba(94,151,190,.55),transparent_35%),linear-gradient(135deg,#10283a,#07151f)] p-7 text-white sm:min-h-80">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/50">Muestra conceptual</p>
        <p className="mt-2 font-serif text-5xl leading-none tracking-[-0.06em] sm:text-6xl">MF</p>
        <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#d7ff64]">Molino Florida</p>
      </div>
    </div>
  );
}

export default function DemosGalleryPage() {
  const reserveHref = buildReserveHref({ source: 'demos catálogo' });
  const reserveLabel = reserveCtaLabel();

  useEffect(() => {
    document.title = 'Muestras · Soluciones Web Gatrivi.com';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      'Muestras de catálogos, páginas y tiendas online diseñadas para negocios reales de Zona Norte y CABA.',
    );
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f1ece4] text-[#171814] selection:bg-[#d7ff64] selection:text-[#171814]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#171814]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to={withAttribution('/')} className="flex items-baseline gap-2" aria-label="Volver a Gatrivi.com">
            <span className="font-serif text-xl tracking-[-0.04em]">gatrivi.com</span>
            <span className="hidden text-[9px] font-bold uppercase tracking-[0.16em] text-white/45 sm:inline">de ZengaSoft</span>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-bold text-white/60 md:flex" aria-label="Navegación principal">
            <a href="#soluciones" className="transition hover:text-white">Soluciones</a>
            <a href="#casos" className="transition hover:text-white">Casos</a>
            <a href="#rubros" className="transition hover:text-white">Rubros</a>
            <a href="#proceso" className="transition hover:text-white">Cómo trabajamos</a>
          </nav>

          <a
            href={reserveHref}
            className="group inline-flex items-center gap-2 rounded-full bg-[#ed6848] px-4 py-2.5 text-[10px] font-black uppercase tracking-[0.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#f27a5c] sm:text-xs"
          >
            Ver mi demo <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-black/10">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(#171814_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative mx-auto grid max-w-7xl gap-16 px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-20 lg:px-8 lg:pt-28">
            <div>
              <SectionLabel>Sistemas web para negocios reales</SectionLabel>
              <h1 className="max-w-xl font-serif text-[clamp(3.3rem,7vw,6.8rem)] leading-[0.88] tracking-[-0.075em]">
                Tu negocio,
                <span className="block text-[#b94335]">presentado</span>
                <span className="block">como merece.</span>
              </h1>
              <p className="mt-7 max-w-lg text-base leading-relaxed text-black/65 sm:text-lg">
                Catálogos, páginas y tiendas online con criterio de diseño, contenido claro y un próximo paso obvio para tus clientes.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#soluciones"
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#171814] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#b94335]"
                >
                  Elegir una solución <ArrowDownRight size={17} className="transition group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a href="#casos" className="inline-flex min-h-12 items-center justify-center gap-2 px-2 text-sm font-black text-black/65 transition hover:text-black">
                  Ver casos reales <ArrowRight size={16} />
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3 text-[11px] font-bold text-black/50">
                <span className="inline-flex items-center gap-1.5"><Check size={14} /> Diseño a medida</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} /> WhatsApp integrado</span>
                <span className="inline-flex items-center gap-1.5"><Check size={14} /> Zona Norte · CABA</span>
              </div>
            </div>

            <BrowserShowcase />
          </div>
        </section>

        <section className="border-b border-black/10 bg-[#171814] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            {[
              ['01', 'Una muestra', 'antes de decidir'],
              ['12', 'Rubros', 'para empezar'],
              ['24 h', 'Primera versión', 'personalizada'],
              ['0%', 'Comisión', 'sobre tus ventas'],
            ].map(([number, label, detail]) => (
              <div key={number} className="bg-[#171814] px-4 py-6 sm:px-7 sm:py-7">
                <p className="font-serif text-3xl tracking-[-0.06em] text-[#d7ff64] sm:text-4xl">{number}</p>
                <p className="mt-2 text-xs font-black uppercase tracking-[0.12em]">{label}</p>
                <p className="mt-1 text-[11px] text-white/45">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="soluciones" className="scroll-mt-24 border-b border-black/10 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <SectionLabel>Lo que podés comprar</SectionLabel>
                <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">Una solución para cada momento.</h2>
              </div>
              <p className="max-w-xs text-sm leading-relaxed text-black/55">Empezamos por lo que hoy te hace falta y dejamos el camino listo para crecer.</p>
            </div>

            <div className="mt-12 grid gap-3 lg:grid-cols-3">
              {SOLUTIONS.map(solution => {
                const Icon = solution.icon;
                const featured = solution.number === '03';
                return (
                  <article key={solution.number} className={`group flex min-h-[23rem] flex-col rounded-[1.5rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-8 ${featured ? 'border-[#171814] bg-[#171814] text-white' : 'border-black/10 bg-[#f1ece4]'}`}>
                    <div className="flex items-start justify-between">
                      <span className={`font-serif text-5xl leading-none tracking-[-0.08em] ${featured ? 'text-[#d7ff64]' : 'text-[#b94335]'}`}>{solution.number}</span>
                      <div className={`flex h-11 w-11 items-center justify-center rounded-full ${featured ? 'bg-[#d7ff64] text-[#171814]' : 'bg-white text-[#b94335]'}`}>
                        <Icon size={21} strokeWidth={1.8} />
                      </div>
                    </div>
                    <h3 className="mt-auto font-serif text-4xl tracking-[-0.06em]">{solution.title}</h3>
                    <p className={`mt-4 text-sm leading-relaxed ${featured ? 'text-white/70' : 'text-black/65'}`}>{solution.copy}</p>
                    <div className={`mt-6 border-t pt-4 text-xs font-bold ${featured ? 'border-white/15 text-white/55' : 'border-black/10 text-black/50'}`}>
                      {solution.detail}
                    </div>
                    <a href={solution.href} className={`mt-5 inline-flex items-center gap-2 text-xs font-black ${featured ? 'text-[#d7ff64]' : 'text-[#b94335]'}`}>
                      Ver cómo funciona <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="casos" className="scroll-mt-24 border-b border-black/10 bg-[#f1ece4] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionLabel>Trabajo visible</SectionLabel>
              <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">Una muestra vale más que una promesa.</h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-black/60">Cada demo parte de un problema concreto del rubro. La forma cambia; la claridad no.</p>
            </div>

            <div className="mt-12 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <article className="group overflow-hidden rounded-[1.5rem] border border-black/10 bg-[#fbfaf6]">
                <div className="relative h-[22rem] overflow-hidden sm:h-[31rem]">
                  <CaseImage item={SHOWCASE_CASES[0]} />
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-black/70 backdrop-blur sm:left-7 sm:top-7">
                    <Sparkles size={13} className="text-[#b94335]" /> Caso destacado
                  </div>
                </div>
                <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:p-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#b94335]">{SHOWCASE_CASES[0].category}</p>
                    <h3 className="mt-2 font-serif text-4xl tracking-[-0.06em]">{SHOWCASE_CASES[0].name}</h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-black/60">{SHOWCASE_CASES[0].description}</p>
                  </div>
                  <Link to={withAttribution(SHOWCASE_CASES[0].samplePath)} className="inline-flex h-fit items-center gap-2 text-xs font-black text-[#b94335] sm:mt-auto">
                    Ver muestra <ArrowRight size={15} />
                  </Link>
                </div>
              </article>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {SHOWCASE_CASES.slice(1).map(item => (
                  <article key={item.name} className={`group grid min-h-[16rem] overflow-hidden rounded-[1.5rem] border border-black/10 ${item.tone === 'dark' ? 'bg-[#241d19] text-white' : item.tone === 'green' ? 'bg-[#dce7d2]' : item.tone === 'blue' ? 'bg-[#10283a] text-white' : 'bg-[#fbfaf6]'}`}>
                    <div className="relative min-h-[10rem] overflow-hidden">
                      <CaseImage item={item} />
                    </div>
                    <div className="flex items-end justify-between gap-3 p-5 sm:p-6">
                      <div>
                        <p className={`text-[9px] font-black uppercase tracking-[0.16em] ${item.tone === 'dark' || item.tone === 'blue' ? 'text-white/45' : 'text-black/45'}`}>{item.category}</p>
                        <h3 className="mt-1 font-serif text-2xl tracking-[-0.05em]">{item.name}</h3>
                      </div>
                      <Link to={withAttribution(item.samplePath)} aria-label={`Ver muestra de ${item.name}`} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition group-hover:translate-x-1 ${item.tone === 'dark' || item.tone === 'blue' ? 'bg-white text-[#171814]' : 'bg-[#171814] text-white'}`}>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="rubros" className="scroll-mt-24 border-b border-black/10 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 border-b border-black/10 pb-10 sm:flex-row sm:items-end">
              <div>
                <SectionLabel>El catálogo completo</SectionLabel>
                <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">Elegí el rubro. Probá la muestra.</h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-black/55">No son plantillas cerradas: son puntos de partida para mostrarte cómo podría funcionar tu negocio.</p>
            </div>

            <div className="mt-10 space-y-14">
              {DEMO_GROUPS.map(group => (
                <section key={group.title}>
                  <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="font-serif text-2xl tracking-[-0.04em]">{group.title}</h3>
                    <p className="text-xs text-black/50">{group.intro}</p>
                  </div>
                  <div className="grid gap-x-6 border-t border-black/10 sm:grid-cols-2 lg:grid-cols-3">
                    {group.cards.map(card => (
                      <div key={card.name} className="group flex min-h-[7.5rem] items-center justify-between gap-4 border-b border-black/10 py-5">
                        <div>
                          <p className="text-base font-black tracking-[-0.02em]">{card.name}</p>
                          <p className="mt-1 text-xs text-black/50">{card.detail}</p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <Link to={withAttribution(card.samplePath)} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.08em] text-[#b94335] transition group-hover:translate-x-0.5">
                            Ver muestra <ChevronRight size={14} />
                          </Link>
                          <Link to={personalizePath(card.rubro)} aria-label={`Personalizar muestra de ${card.name}`} className="hidden h-8 w-8 items-center justify-center rounded-full border border-black/15 text-black/50 transition hover:border-black hover:text-black sm:flex">
                            <WandSparkles size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="proceso" className="scroll-mt-24 border-b border-black/10 bg-[#171814] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div>
                <SectionLabel>Cómo trabajamos</SectionLabel>
                <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.06em] sm:text-6xl">Del audio confuso a una página que trabaja.</h2>
                <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">Nos contás qué vendés, qué te preguntan siempre y cómo recibís pedidos. Nosotros lo convertimos en una experiencia que se entiende.</p>
                <a href={reserveHref} className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#d7ff64] px-5 py-3 text-sm font-black text-[#171814] transition hover:-translate-y-0.5">{reserveLabel} <ArrowRight size={16} /></a>
              </div>

              <div className="grid gap-0 border-t border-white/15">
                {[
                  ['01', 'Entendemos tu negocio', 'Rubro, productos, zonas, horarios y el pedido que hoy llega por audio.'],
                  ['02', 'Armamos una muestra', 'Una primera versión con tu nombre, tu tono y un recorrido que puedas probar.'],
                  ['03', 'La dejamos lista', 'Link, QR, WhatsApp y panel preparados para que puedas empezar a usarla.'],
                ].map(([number, title, copy]) => (
                  <div key={number} className="grid gap-4 border-b border-white/15 py-7 sm:grid-cols-[4rem_1fr] sm:gap-8">
                    <span className="font-serif text-3xl tracking-[-0.06em] text-[#d7ff64]">{number}</span>
                    <div>
                      <h3 className="font-serif text-2xl tracking-[-0.04em]">{title}</h3>
                      <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/55">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ed6848] py-20 sm:py-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-9 px-4 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="max-w-3xl">
              <p className="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-white/65">Siguiente paso</p>
              <h2 className="font-serif text-5xl leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl">Traé tu negocio.<br /><span className="text-[#171814]">Hacemos la muestra.</span></h2>
            </div>
            <div className="flex flex-col items-start gap-4">
              <a href={reserveHref} className="group inline-flex items-center gap-3 rounded-full bg-[#171814] px-6 py-4 text-sm font-black text-white transition hover:-translate-y-0.5">
                Quiero ver mi demo <ArrowRight size={17} className="transition group-hover:translate-x-1" />
              </a>
              <p className="text-xs font-bold text-white/70">Respuesta inicial en el día · Zona Norte y CABA</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#171814] py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link to={withAttribution('/')} className="font-serif text-lg text-white">gatrivi.com</Link>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to={withAttribution('/')} className="transition hover:text-white">Inicio</Link>
            <a href="#soluciones" className="transition hover:text-white">Soluciones</a>
            <a href={reserveHref} className="transition hover:text-white">Contacto</a>
            <span>© {new Date().getFullYear()} ZengaSoft</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
