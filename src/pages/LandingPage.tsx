import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Clock3,
  LayoutTemplate,
  Link2,
  MessageCircle,
  PackageCheck,
  PawPrint,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Tags,
  Warehouse,
  WandSparkles,
  Zap,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';
import {
  buildReserveHref,
  captureAttribution,
  getDemoPriceLabel,
  reserveCtaLabel,
  withAttribution,
} from '../utils/demoIntake';
import {
  buildProspectDemoSearch,
  PROSPECT_CATEGORIES,
  type ProspectCategory,
} from '../utils/prospectDemo';

const SITE_DOMAIN = 'zengasoft.shop';
const SITE_DOMAIN_EXAMPLE = `tunegocio.${SITE_DOMAIN}`;

const solutions = [
  {
    id: 'catalogo',
    title: 'Catálogo digital',
    ideal: 'Ideal para: cuando solo necesitás que vean los productos y precios.',
    bullets: [
      'Lista de productos con fotos y precios',
      'Fácil de actualizar',
      'Link o QR para compartir',
      'Sin carrito ni pagos',
    ],
    priceHint: 'Precio orientativo: más económico',
    cta: 'Ver ejemplo de catálogo',
    demoPath: '/demo?rubro=libreria',
    icon: Tags,
  },
  {
    id: 'landing',
    title: 'Landing de producto / negocio',
    ideal: 'Ideal para: página profesional con tu marca + productos destacados.',
    bullets: [
      'Página moderna con tu marca',
      'Secciones de productos, beneficios, contacto',
      'Botón directo a WhatsApp',
      'Perfecta para Instagram y Google',
    ],
    priceHint: null,
    cta: 'Ver ejemplo de landing',
    demoPath: '/demo/mamabel',
    icon: LayoutTemplate,
  },
  {
    id: 'tienda',
    title: 'Tienda online completa',
    ideal: 'Ideal para: cuando querés que el cliente compre solo.',
    bullets: [
      'Catálogo + carrito + total automático',
      'Alias bancario + comprobante por WhatsApp',
      'Panel para administrar productos y stock',
      'Sin comisión por venta',
    ],
    priceHint: null,
    cta: 'Ver demo de tienda',
    demoPath: '/demo/pizzeria',
    icon: Store,
    featured: true,
  },
];

const howItWorks = [
  {
    icon: Smartphone,
    title: 'El cliente ve los productos',
    copy: 'Un solo link en zengasoft.shop. Fotos, precios y variantes claras — sin fotos sueltas por WhatsApp.',
  },
  {
    icon: MessageCircle,
    title: 'Elige o consulta',
    copy: 'Catálogo, landing con CTA o tienda con carrito. El pedido o consulta llega ordenado.',
  },
  {
    icon: PackageCheck,
    title: 'Vos recibís todo claro',
    copy: 'Menos “¿cuánto sale?” repetido. Más tiempo para vender y atender.',
  },
];

const keyMessages = [
  'Quiero que el cliente pueda ver qué productos tenemos porque siempre me preguntan lo mismo.',
  'Dejá de mandar fotos sueltas por WhatsApp.',
  'Un solo link. Todos tus productos. Actualizado.',
  'Empezá simple. Crece cuando quieras.',
];

const sampleShowcase = [
  {
    type: 'Catálogo',
    hint: 'Lista clara de productos',
    to: '/demo?rubro=libreria',
    icon: Tags,
  },
  {
    type: 'Landing',
    hint: 'Marca + productos destacados',
    to: '/demo/mamabel',
    icon: LayoutTemplate,
  },
  {
    type: 'Tienda completa',
    hint: 'Carrito + panel del local',
    to: '/demo/pizzeria',
    icon: Store,
  },
];

const setupItems = [
  'Diseño personalizado con tu marca',
  'Carga inicial de productos según el plan',
  `Dirección en ${SITE_DOMAIN} incluida`,
  'Probamos link, QR y contacto',
  'Te dejamos listo para compartir',
  'Te enseñamos a actualizarlo',
];

const pricingTiers = [
  {
    name: 'Catálogo digital',
    eyebrow: 'Empezá simple',
    setup: 'Consultar',
    monthly: 'Desde $15.000/mes',
    copy: 'Productos y precios en un link. Sin carrito ni pagos online.',
    featured: false,
    features: [
      'Lista con fotos y precios',
      'Link y QR para compartir',
      'Actualización fácil',
      'Dirección en zengasoft.shop',
    ],
    cta: 'Quiero un catálogo',
    contactSource: 'landing catálogo',
  },
  {
    name: 'Landing de negocio',
    eyebrow: 'Presencia profesional',
    setup: 'Consultar',
    monthly: 'Desde $18.000/mes',
    copy: 'Tu marca, productos destacados y WhatsApp en una página.',
    featured: false,
    features: [
      'Diseño a medida',
      'Secciones de productos y beneficios',
      'Botón a WhatsApp',
      'Ideal para Instagram y Google',
    ],
    cta: 'Quiero una landing',
    contactSource: 'landing landing',
  },
  {
    name: 'Tienda online completa',
    eyebrow: '90% OFF · primeros 10',
    previousSetup: '$650.000',
    setup: getDemoPriceLabel(),
    monthly: 'Planes desde $35.000/mes',
    copy: 'Catálogo, carrito, alias y panel. La opción más completa.',
    featured: true,
    features: [
      'Carrito con total automático',
      'Alias y comprobante por WhatsApp',
      'Panel para productos y stock',
      'Dominio propio gratis 1 año (primeros 10)',
      'Sin comisión por venta',
    ],
    cta: reserveCtaLabel(),
    reserve: true,
    contactSource: 'landing tienda completa',
  },
];

const faqs = [
  {
    question: '¿Solo necesito un catálogo, sin carrito?',
    answer: 'Sí. El catálogo digital muestra productos y precios con link o QR. Sin carrito ni pagos. Es la opción más económica.',
  },
  {
    question: '¿Puedo empezar con un catálogo y después pasar a tienda?',
    answer: 'Sí. Empezá simple y subí de nivel cuando quieras. Reutilizamos tu marca y contenido.',
  },
  {
    question: '¿Sirve para mostrar productos aunque no venda online todavía?',
    answer: 'Sí. Muchos clientes arrancan con catálogo o landing para dejar de mandar fotos por WhatsApp.',
  },
  {
    question: '¿El cliente necesita una app?',
    answer: 'No. Abre un link desde Instagram, Google, WhatsApp o un QR.',
  },
  {
    question: '¿Cobran comisión por venta?',
    answer: 'No. Cobramos implementación y plan mensual. Cero porcentaje sobre tus ventas.',
  },
  {
    question: '¿Qué dirección tiene el sitio?',
    answer: `Incluye dirección en ${SITE_DOMAIN} (ej. ${SITE_DOMAIN_EXAMPLE}). Los primeros diez de tienda completa también reciben dominio propio por un año.`,
  },
];

const HERO_RUBROS = (Object.keys(PROSPECT_CATEGORIES) as ProspectCategory[]).filter(id =>
  ['petshop', 'pizzeria', 'polleria', 'verduleria', 'cafeteria', 'libreria', 'grafica', 'distribuidora-lacteos', 'molino-mayorista', 'panaderia', 'gastronomia'].includes(id),
);

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-[#ee6847]">
      {children}
    </p>
  );
}

export default function LandingPage() {
  const location = useLocation();
  const contactHref = buildSalesContactHref('landing consulta Gatrivi.com');
  const priceLabel = getDemoPriceLabel();
  const reserveHref = buildReserveHref({ source: 'landing reserva' });
  const reserveLabel = reserveCtaLabel();
  const consultHref = buildSalesContactHref(
    'landing consulta: catálogo, landing o tienda completa',
  );

  const [negocio, setNegocio] = useState('');
  const [rubro, setRubro] = useState<ProspectCategory>('petshop');
  const [barrio, setBarrio] = useState('Olivos');

  const samplePath = useMemo(() => {
    const name = negocio.trim() || 'Tu negocio';
    const search = buildProspectDemoSearch({
      businessName: name,
      area: barrio.trim() || 'Zona Norte',
      category: rubro,
      color: 'carbon',
    });
    return withAttribution(`/demo${search}`);
  }, [negocio, barrio, rubro]);

  useEffect(() => {
    captureAttribution(location.search);
  }, [location.search]);

  useEffect(() => {
    document.title = 'Gatrivi.com — Catálogo, landing y tienda online';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      'Catálogos, landings y tiendas online en zengasoft.shop. Tu marca, sin comisión por venta.',
    );
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const target = document.querySelector(location.hash);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.hash]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f2eee6] text-[#171814] selection:bg-[#d7ff64] selection:text-[#171814]">
      <header className="sticky top-0 z-50 border-b border-black/8 bg-[#f2eee6]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-[-0.04em]">GATRIVI.COM</span>
            <span className="hidden text-[10px] font-bold uppercase tracking-[0.16em] text-black/45 sm:inline">
              de ZengaSoft
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-bold text-black/60 md:flex">
            <a href="#soluciones" className="transition hover:text-black">Soluciones</a>
            <Link to={withAttribution('/demos')} className="transition hover:text-black">Muestras</Link>
            <a href="#planes" className="transition hover:text-black">Planes</a>
            <a href={contactHref} className="transition hover:text-black">Contacto</a>
          </nav>

          <a
            href={consultHref}
            className="rounded-full bg-[#171814] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ee6847] sm:text-sm"
          >
            Consultar
          </a>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        {/* Hero */}
        <section id="hero" className="relative scroll-mt-24 border-b border-black/8">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(#171814_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/65 shadow-sm">
                Soluciones web para negocios · de ZengaSoft
              </div>

              <h1 className="text-[clamp(2.4rem,6.5vw,5rem)] font-black leading-[0.92] tracking-[-0.07em]">
                Dejá de contestar siempre lo mismo.
                <span className="mt-2 block text-[#ee6847]">Mostrá tus productos online en minutos.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-black/66 sm:text-xl">
                Catálogos, landings y tiendas online listas para vender.
                <br className="hidden sm:block" />
                Tu marca, tu dominio en {SITE_DOMAIN}, sin comisión por venta.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#soluciones"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#171814] px-7 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ee6847]"
                >
                  Ver soluciones
                  <ArrowRight size={18} />
                </a>
                <a
                  href="#probar"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-black/15 bg-white/80 px-7 text-sm font-black transition hover:border-black"
                >
                  Probar una muestra
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-black/55">
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin app</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin comisión</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Listo en 3 días</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Dominio propio incluido</span>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof bar */}
        <section className="border-b border-black/8 bg-[#171814] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-4 sm:grid-cols-4 lg:px-8">
            {[
              ['Catálogo', Tags],
              ['Landing', LayoutTemplate],
              ['Tienda', Store],
              ['zengasoft.shop', Link2],
            ].map(([label, Icon]) => {
              const ItemIcon = Icon as typeof Tags;
              return (
                <div
                  key={label as string}
                  className="flex items-center justify-center gap-2 bg-[#171814] px-3 py-5 text-xs font-black uppercase tracking-[0.1em] text-white/70"
                >
                  <ItemIcon size={16} className="text-[#d7ff64]" />
                  {label as string}
                </div>
              );
            })}
          </div>
        </section>

        {/* Qué ofrecemos */}
        <section id="soluciones" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>Tres soluciones</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Tres formas de mostrar tus productos (y dejar de contestar siempre lo mismo)
              </h2>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {solutions.map(sol => (
                <article
                  key={sol.id}
                  className={`flex flex-col rounded-[2rem] border p-6 sm:p-8 ${
                    sol.featured
                      ? 'border-[#171814] bg-[#171814] text-white shadow-2xl'
                      : 'border-black/10 bg-[#f2eee6]'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      sol.featured ? 'bg-[#d7ff64] text-[#171814]' : 'bg-[#171814] text-[#d7ff64]'
                    }`}
                  >
                    <sol.icon size={24} />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-[-0.04em]">{sol.title}</h3>
                  <p className={`mt-3 text-sm font-bold ${sol.featured ? 'text-white/65' : 'text-black/55'}`}>
                    {sol.ideal}
                  </p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {sol.bullets.map(b => (
                      <li key={b} className="flex items-start gap-2 text-sm font-bold">
                        <Check
                          size={16}
                          className={`mt-0.5 shrink-0 ${sol.featured ? 'text-[#d7ff64]' : 'text-[#ee6847]'}`}
                        />
                        <span className={sol.featured ? 'text-white/80' : 'text-black/70'}>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {sol.priceHint && (
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.12em] text-[#ee6847]">
                      {sol.priceHint}
                    </p>
                  )}
                  <Link
                    to={withAttribution(sol.demoPath)}
                    className={`mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-black transition hover:-translate-y-0.5 ${
                      sol.featured
                        ? 'bg-[#d7ff64] text-[#171814] hover:bg-white'
                        : 'bg-[#171814] text-white hover:bg-[#ee6847]'
                    }`}
                  >
                    {sol.cta}
                    <ArrowRight size={16} />
                  </Link>
                </article>
              ))}
            </div>

            <p className="mt-10 text-center text-sm font-bold text-black/55">
              Empezá por lo que necesitás hoy. Después podés subir de nivel cuando quieras.
            </p>
          </div>
        </section>

        {/* Cómo funciona */}
        <section id="como-funciona" className="scroll-mt-24 border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>Cómo funciona</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Menos preguntas repetidas. Más pedidos claros.
              </h2>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {howItWorks.map(({ icon: Icon, title, copy }, index) => (
                <article
                  key={title}
                  className="rounded-[1.75rem] border border-black/10 bg-[#fbfaf6] p-6 sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171814] text-[#d7ff64]">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-black text-black/25">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-xl font-black tracking-[-0.035em]">{title}</h3>
                  <p className="mt-3 leading-relaxed text-black/58">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Beneficios / mensajes clave */}
        <section id="beneficios" className="scroll-mt-24 border-b border-black/8 bg-[#171814] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2">
              {keyMessages.map(msg => (
                <p
                  key={msg}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-bold leading-relaxed text-white/85"
                >
                  {msg}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Muestras reales */}
        <section id="muestras" className="scroll-mt-24 border-b border-black/8 bg-[#171814] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <SectionEyebrow>Muestras reales</SectionEyebrow>
                <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                  Catálogo, landing y tienda en vivo
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/60 lg:justify-self-end">
                Tres ejemplos distintos. Abrí, probá y elegí el nivel que necesitás.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {sampleShowcase.map(item => (
                <Link
                  key={item.type}
                  to={withAttribution(item.to)}
                  className="group rounded-[1.75rem] border border-white/12 bg-white/6 p-6 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <item.icon size={26} className="text-[#d7ff64]" />
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.14em] text-white/40">{item.hint}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">{item.type}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#d7ff64]">
                    Ver muestra <ChevronRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { to: '/demo?rubro=petshop', icon: PawPrint, label: 'Pet shop', hint: 'Catálogo con variantes' },
                { to: '/demo?rubro=molino-mayorista&negocio=Molino%20Florida', icon: Warehouse, label: 'Mayorista', hint: 'Bultos y reposición' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={withAttribution(item.to)}
                  className="group flex items-center justify-between gap-4 rounded-[1.75rem] border border-white/12 bg-white/6 p-5 transition hover:bg-white/10"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={22} className="text-[#d7ff64]" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.12em] text-white/40">{item.hint}</p>
                      <p className="font-black">{item.label}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#d7ff64] transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <Link
              to={withAttribution('/demo/pizzeria/owner')}
              className="mt-4 flex items-center justify-between gap-4 rounded-[1.75rem] bg-[#d7ff64] p-6 text-[#171814] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">Vista del local</p>
                <p className="mt-1 text-xl font-black">Panel para cargar, editar y pausar productos.</p>
              </div>
              <BarChart3 size={28} />
            </Link>
          </div>
        </section>

        {/* Probar muestra (mini builder) */}
        <section id="probar" className="scroll-mt-24 border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionEyebrow>Probar ahora</SectionEyebrow>
            <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">
              Personalizá una muestra en segundos
            </h2>
            <form
              className="mt-8 space-y-3 rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-sm"
              onSubmit={event => {
                event.preventDefault();
                window.location.assign(samplePath);
              }}
            >
              <label className="block">
                <span className="sr-only">Nombre del negocio</span>
                <input
                  value={negocio}
                  onChange={e => setNegocio(e.target.value.slice(0, 60))}
                  placeholder="Nombre del negocio"
                  className="min-h-12 w-full rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 text-sm font-bold outline-none focus:border-black/35"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={rubro}
                  onChange={e => setRubro(e.target.value as ProspectCategory)}
                  className="min-h-12 w-full rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 text-sm font-bold outline-none"
                >
                  {HERO_RUBROS.map(id => (
                    <option key={id} value={id}>{PROSPECT_CATEGORIES[id]}</option>
                  ))}
                </select>
                <input
                  value={barrio}
                  onChange={e => setBarrio(e.target.value.slice(0, 60))}
                  placeholder="Barrio (opcional)"
                  className="min-h-12 w-full rounded-2xl border border-black/10 bg-[#fbfaf6] px-4 text-sm font-bold outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#171814] text-sm font-black text-white hover:bg-[#ee6847]"
              >
                <WandSparkles size={16} /> Ver mi muestra
              </button>
            </form>
            <p className="mt-4 text-center text-sm font-bold text-black/50">
              O explorá{' '}
              <Link to={withAttribution('/demos')} className="text-[#ee6847] hover:underline">
                las 11 muestras por rubro
              </Link>
            </p>
          </div>
        </section>

        {/* Implementación */}
        <section id="incluye" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
            <div>
              <SectionEyebrow>Hecho por nosotros</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Listo en 3 días
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/62">
                No te damos una cuenta vacía. Armamos tu catálogo, landing o tienda en {SITE_DOMAIN} y te entregamos link y QR.
              </p>
              <ul className="mt-8 space-y-4">
                {setupItems.map(item => (
                  <li key={item} className="flex items-start gap-3 font-bold">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d7ff64]">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] bg-[#ee6847] p-5 text-white shadow-2xl sm:p-8">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-black/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em]">
                  Implementación
                </span>
                <Clock3 size={22} />
              </div>
              <div className="mt-10 space-y-3">
                {[
                  ['Día 1', 'Recibimos productos, fotos y datos'],
                  ['Día 2', 'Armamos marca y contenido'],
                  ['Día 3', 'Probamos, ajustamos y entregamos'],
                ].map(([day, task]) => (
                  <div key={day} className="grid grid-cols-[70px_1fr] items-center gap-3 rounded-2xl bg-white/12 p-4">
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-white/65">{day}</span>
                    <span className="font-black">{task}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#171814] p-5">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#d7ff64]">Entrega</p>
                <p className="mt-2 text-xl font-black">
                  Link en {SITE_DOMAIN}, QR y prueba desde el celular.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Promo primeros 10 */}
        <section id="reserva" className="scroll-mt-24 border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article className="rounded-[2rem] border-2 border-[#171814] bg-[#171814] p-6 text-white shadow-2xl sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7ff64]">Tienda completa · primeros 10</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Promoción tienda online completa
              </h2>
              <p className="mt-4 text-3xl font-black text-[#d7ff64]">{priceLabel}</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/65">
                90% de descuento sobre implementación de $650.000. Catálogo y landing: consultar.
              </p>
              <a
                href={buildReserveHref({
                  source: 'landing primeros 10 tienda',
                  demoUrl: typeof window !== 'undefined' ? `${window.location.origin}${samplePath}` : samplePath,
                  rubro,
                  businessName: negocio.trim() || undefined,
                })}
                className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#d7ff64] px-6 text-sm font-black text-[#171814] transition hover:-translate-y-0.5 hover:bg-white"
              >
                {reserveLabel}
                <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </section>

        {/* Pricing */}
        <section id="planes" className="scroll-mt-24 border-b border-black/8 pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl pt-4">
              <SectionEyebrow>Planes</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Elegí tu nivel
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-black/60">
                Catálogo, landing o tienda completa. Sin comisión por venta.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {pricingTiers.map(tier => (
                <article
                  key={tier.name}
                  className={`relative flex flex-col rounded-[2rem] border p-6 sm:p-8 ${
                    tier.featured
                      ? 'border-[#171814] bg-[#171814] text-white shadow-2xl lg:-translate-y-2'
                      : 'border-black/10 bg-[#f2eee6]'
                  }`}
                >
                  {tier.featured && (
                    <span className="absolute right-6 top-6 rounded-full bg-[#d7ff64] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#171814]">
                      Más completa
                    </span>
                  )}
                  <p
                    className={`text-xs font-black uppercase tracking-[0.14em] ${
                      tier.featured ? 'text-[#d7ff64]' : 'text-[#ee6847]'
                    }`}
                  >
                    {tier.eyebrow}
                  </p>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.045em]">{tier.name}</h3>
                  <p className={`mt-3 leading-relaxed ${tier.featured ? 'text-white/58' : 'text-black/58'}`}>
                    {tier.copy}
                  </p>

                  <div className={`my-6 border-y py-5 ${tier.featured ? 'border-white/12' : 'border-black/10'}`}>
                    <p className={`text-xs font-bold ${tier.featured ? 'text-white/45' : 'text-black/45'}`}>
                      Implementación
                    </p>
                    {'previousSetup' in tier && tier.previousSetup && (
                      <p className={`mt-1 text-sm font-bold ${tier.featured ? 'text-white/45' : 'text-black/45'}`}>
                        <s>{tier.previousSetup}</s>
                      </p>
                    )}
                    <p className="mt-1 text-2xl font-black">{tier.setup}</p>
                    <p className={`mt-2 text-sm font-bold ${tier.featured ? 'text-white/55' : 'text-black/55'}`}>
                      {tier.monthly}
                    </p>
                  </div>

                  <ul className="flex-1 space-y-3">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm font-bold">
                        <Check
                          size={16}
                          className={tier.featured ? 'mt-0.5 text-[#d7ff64]' : 'mt-0.5 text-[#ee6847]'}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={
                      tier.reserve
                        ? reserveHref
                        : buildSalesContactHref(tier.contactSource ?? 'landing plan')
                    }
                    className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-black transition hover:-translate-y-0.5 ${
                      tier.featured
                        ? 'bg-[#d7ff64] text-[#171814] hover:bg-white'
                        : 'bg-[#171814] text-white hover:bg-[#ee6847]'
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-black/60">
                <strong className="text-black">Dirección incluida:</strong> {SITE_DOMAIN_EXAMPLE}. Dominio propio 1 año
                para los primeros diez de tienda completa.
              </p>
              <ShieldCheck className="shrink-0 text-[#ee6847]" />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <SectionEyebrow>Preguntas</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">Antes de hablar.</h2>
            </div>
            <div className="divide-y divide-black/10 border-y border-black/10">
              {faqs.map(item => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                    {item.question}
                    <span className="text-2xl font-light transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="max-w-2xl pr-10 pt-3 leading-relaxed text-black/60">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-[#ee6847] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <Sparkles className="mx-auto text-[#d7ff64]" size={34} />
            <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
              Contanos qué necesitás: catálogo, landing o tienda completa.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              Un solo link en {SITE_DOMAIN}. Sin comisión por venta.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={consultHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#171814] px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#d7ff64] hover:text-[#171814]"
              >
                Hablar por WhatsApp
                <ArrowRight size={18} />
              </a>
              <a
                href="#soluciones"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-sm font-black text-white"
              >
                Ver soluciones
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#171814] py-8 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-[#d7ff64]" />
              <p className="text-sm font-bold text-white/65">
                ¿Manejás varios comercios? Implementación marca blanca para agencias.
              </p>
            </div>
            <a
              href={buildSalesContactHref('partner white-label')}
              className="flex shrink-0 items-center gap-2 text-sm font-black text-[#d7ff64] hover:text-white"
            >
              Consultar partners <ChevronRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#10110e] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-black tracking-[-0.04em]">GATRIVI.COM</p>
            <p className="mt-2 text-sm text-white/45">
              Soluciones web para negocios · de ZengaSoft · {SITE_DOMAIN}
            </p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs font-bold text-white/55">
            <Link to={withAttribution('/demos')} className="hover:text-white">11 muestras</Link>
            <a href="#soluciones" className="hover:text-white">Soluciones</a>
            <a href="#planes" className="hover:text-white">Planes</a>
            <a href={contactHref} className="hover:text-white">Contacto</a>
          </div>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f2eee6]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <a
            href="#soluciones"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-black"
          >
            Soluciones
          </a>
          <a
            href={consultHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171814] text-sm font-black text-white"
          >
            Consultar
          </a>
        </div>
      </div>
    </div>
  );
}
