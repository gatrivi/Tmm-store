import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  MessageCircle,
  PackageCheck,
  PawPrint,
  Printer,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Tags,
  UtensilsCrossed,
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

const outcomes = [
  {
    icon: MessageCircle,
    title: 'Pedidos legibles',
    copy: 'Producto, variante, entrega, pago y observaciones llegan ordenados. Menos ida y vuelta.',
  },
  {
    icon: Tags,
    title: 'Precios al día',
    copy: 'Cambiás precios, disponibilidad y promos sin volver a imprimir ni depender de terceros.',
  },
  {
    icon: CircleDollarSign,
    title: 'Venta directa',
    copy: 'El cliente compra desde tu link y la relación sigue siendo tuya. Cero comisión por venta.',
  },
];

const setupItems = [
  'Cargamos productos, fotos y precios',
  'Adaptamos colores, logo y tono del local',
  'Probamos el recorrido completo en celular',
  'Te dejamos link, QR y panel listos',
  'Te enseñamos a actualizarlo',
];

const offers = [
  {
    name: 'Carta Premium',
    eyebrow: 'Para empezar',
    setup: 'desde $180.000',
    monthly: '$15.000/mes',
    copy: 'Una carta que parece hecha por una agencia, no una plantilla genérica.',
    features: [
      'Carta con fotos y categorías',
      'Link + QR compartible',
      'Branding personalizado',
      'Panel para editar precios',
      'Contacto directo por WhatsApp',
    ],
  },
  {
    name: 'Pedidos Directos',
    eyebrow: 'Recomendado',
    setup: 'desde $320.000',
    monthly: '$25.000/mes',
    copy: 'Para dejar de reconstruir cada pedido entre audios y mensajes sueltos.',
    featured: true,
    features: [
      'Todo Carta Premium',
      'Carrito y checkout guiado',
      'Retiro o delivery',
      'Efectivo, transferencia y Mercado Pago',
      'Pedido ordenado por WhatsApp',
      'Bandeja de pedidos del local',
    ],
  },
  {
    name: 'Operación',
    eyebrow: 'Para crecer',
    setup: 'desde $480.000',
    monthly: '$45.000/mes',
    copy: 'Más control para locales con volumen, cocina o varias personas atendiendo.',
    features: [
      'Todo Pedidos Directos',
      'Estados y seguimiento',
      'Comandas imprimibles',
      'Promociones y reportes',
      'Respuestas rápidas',
      'Asistente de consultas opcional',
    ],
  },
];

const faqs = [
  {
    question: '¿Tengo que cargar todo yo?',
    answer: 'No. La implementación incluye la primera carga, el armado visual y las pruebas. Recibís el sistema listo para usar.',
  },
  {
    question: '¿El cliente necesita una app?',
    answer: 'No. Abre un link normal desde Instagram, Google, WhatsApp o un QR y compra desde el navegador.',
  },
  {
    question: '¿Cobran comisión por venta?',
    answer: 'No. Trufi cobra implementación y mantenimiento. No toma un porcentaje de tus pedidos.',
  },
  {
    question: '¿Puedo cambiar precios?',
    answer: 'Sí. El panel permite editar precios, productos, fotos y disponibilidad sin tocar código.',
  },
  {
    question: '¿Sirve fuera de gastronomía?',
    answer: 'Sí: pet shops, librerías, gráficas, mayoristas y comercios con catálogo y variantes. Primero validamos el flujo con una muestra.',
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
  const contactHref = buildSalesContactHref('landing Trufi');
  const priceLabel = getDemoPriceLabel();
  const reserveHref = buildReserveHref({ source: 'landing reserva' });
  const reserveLabel = reserveCtaLabel();

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
    document.title = 'Trufi — Tu negocio listo para vender online';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      'Catálogo, pedidos o cotizaciones desde un link. Tu marca, tu WhatsApp, cero comisión. Muestra a medida en 24 h.',
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
            <span className="text-xl font-black tracking-[-0.04em]">TRUFI</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">
              por ZengaSoft
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-bold text-black/60 md:flex">
            <a href="#probar" className="transition hover:text-black">Probar</a>
            <Link to={withAttribution('/demos')} className="transition hover:text-black">Muestras</Link>
            <a href="#reserva" className="transition hover:text-black">Reserva</a>
            <a href="#planes" className="transition hover:text-black">Planes</a>
          </nav>

          <a
            href={reserveHref}
            className="rounded-full bg-[#171814] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ee6847] sm:text-sm"
          >
            Reservar
          </a>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <section id="probar" className="relative scroll-mt-24 border-b border-black/8">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(#171814_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20 lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/65 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#ee6847]" />
                Zona Norte · muestra personalizada en 24 h
              </div>

              <h1 className="max-w-3xl text-[clamp(2.6rem,7vw,5.6rem)] font-black leading-[0.92] tracking-[-0.07em]">
                Tu negocio,
                <span className="block text-[#ee6847]">listo para vender online.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-black/66 sm:text-xl">
                Catálogo, pedidos o cotizaciones desde un link. Tu marca, tu WhatsApp y cero comisión por venta.
              </p>

              <form
                className="mt-9 space-y-3 rounded-[1.75rem] border border-black/10 bg-white/70 p-4 shadow-sm sm:p-5"
                onSubmit={event => {
                  event.preventDefault();
                  window.location.assign(samplePath);
                }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">
                  <WandSparkles size={12} className="mr-1 inline" /> Mini muestra al instante
                </p>
                <label className="block">
                  <span className="sr-only">Nombre del negocio</span>
                  <input
                    value={negocio}
                    onChange={e => setNegocio(e.target.value.slice(0, 60))}
                    placeholder="Nombre del negocio"
                    className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none focus:border-black/35"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="sr-only">Rubro</span>
                    <select
                      value={rubro}
                      onChange={e => setRubro(e.target.value as ProspectCategory)}
                      className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none focus:border-black/35"
                    >
                      {HERO_RUBROS.map(id => (
                        <option key={id} value={id}>{PROSPECT_CATEGORIES[id]}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="sr-only">Barrio</span>
                    <input
                      value={barrio}
                      onChange={e => setBarrio(e.target.value.slice(0, 60))}
                      placeholder="Barrio (opcional)"
                      className="min-h-12 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm font-bold outline-none focus:border-black/35"
                    />
                  </label>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="submit"
                    className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#171814] px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ee6847]"
                  >
                    Ver mi muestra
                    <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                  </button>
                  <Link
                    to={withAttribution('/demos')}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/80 px-5 text-sm font-black transition hover:border-black"
                  >
                    Ver las 11 muestras
                  </Link>
                </div>
              </form>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-black/55">
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin app</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin comisión</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Hecho por Trufi</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#d7ff64] blur-3xl" />
              <div className="relative rotate-[1.5deg] overflow-hidden rounded-[2rem] border border-black/10 bg-[#171814] p-3 shadow-[0_35px_90px_rgba(30,25,15,0.24)] sm:p-4">
                <div className="rounded-[1.45rem] bg-[#fbfaf6] p-3 sm:p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-black/8 pb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/40">Tu marca · demo</p>
                      <p className="mt-1 text-sm font-black">Catálogo listo para pedir</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171814] text-white">
                      <Store size={18} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Alimento 15 kg', '$68.900'],
                      ['Arena 10 kg', '$21.500'],
                    ].map(([title, price]) => (
                      <div key={title} className="overflow-hidden rounded-2xl border border-black/8 bg-white p-3">
                        <div className="mb-3 flex h-20 items-center justify-center rounded-xl bg-[#f2eee6] text-[10px] font-black uppercase tracking-wider text-black/35">
                          Foto
                        </div>
                        <p className="text-sm font-black">{title}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-black">{price}</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171814] text-white">+</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-2xl bg-[#d7ff64] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/50">Pedido #P7K2</p>
                        <p className="mt-1 text-sm font-black">Listo para enviar por WhatsApp</p>
                      </div>
                      <CheckCircle2 size={24} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative -mt-6 ml-auto mr-2 w-[82%] -rotate-2 rounded-2xl border border-black/10 bg-white p-4 shadow-2xl sm:mr-8 sm:w-[70%]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25d366]/15 text-[#159447]">
                    <MessageCircle size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/40">El local recibe</p>
                    <p className="truncate text-sm font-black">2 ítems · delivery · transferencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/8 bg-[#171814] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
            {[
              ['Catálogo', Smartphone],
              ['QR + link', QrCode],
              ['Carrito', PackageCheck],
              ['WhatsApp', MessageCircle],
              ['Panel', BarChart3],
              ['Comandas', Printer],
            ].map(([label, Icon]) => {
              const ItemIcon = Icon as typeof Smartphone;
              return (
                <div key={label as string} className="flex items-center justify-center gap-2 bg-[#171814] px-3 py-5 text-xs font-black uppercase tracking-[0.1em] text-white/70">
                  <ItemIcon size={16} className="text-[#d7ff64]" />
                  {label as string}
                </div>
              );
            })}
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>El resultado</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                El WhatsApp queda. El desorden no.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-black/60">
                Trufi prepara el pedido antes de abrir el chat. Vos recibís algo que se puede leer, cobrar y producir.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {outcomes.map(({ icon: Icon, title, copy }, index) => (
                <article key={title} className="group rounded-[1.75rem] border border-black/10 bg-[#f2eee6] p-6 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl sm:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#171814] text-[#d7ff64]">
                      <Icon size={22} />
                    </div>
                    <span className="text-xs font-black text-black/25">0{index + 1}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-black tracking-[-0.035em]">{title}</h3>
                  <p className="mt-3 leading-relaxed text-black/58">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/8 bg-[#171814] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <SectionEyebrow>Prueba visual</SectionEyebrow>
                <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                  Cuatro rubros. Demos reales.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/60 lg:justify-self-end">
                Abrí una muestra funcionando. Después mirá cómo llega el pedido al local.
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { to: '/demo/pizzeria', icon: UtensilsCrossed, label: 'Comida', hint: 'Pizzería Fit A' },
                { to: '/demo?rubro=petshop', icon: PawPrint, label: 'Pet shop', hint: 'Alimento y paseo' },
                { to: '/demo?rubro=molino-mayorista&negocio=Molino%20Florida', icon: Warehouse, label: 'Mayorista', hint: 'Bultos y reposición' },
                { to: '/demo?rubro=grafica', icon: Printer, label: 'Cotización', hint: 'Gráfica / imprenta' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={withAttribution(item.to)}
                  className="group rounded-[1.75rem] border border-white/12 bg-white/6 p-6 transition hover:-translate-y-1 hover:bg-white/10"
                >
                  <item.icon size={26} className="text-[#d7ff64]" />
                  <p className="mt-8 text-xs font-black uppercase tracking-[0.14em] text-white/40">{item.hint}</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.04em]">{item.label}</h3>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#d7ff64]">
                    Ver muestra <ChevronRight size={16} className="transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>

            <Link
              to={withAttribution('/demo/pizzeria/owner')}
              className="mt-4 flex items-center justify-between gap-4 rounded-[1.75rem] bg-[#d7ff64] p-6 text-[#171814] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">Vista del local</p>
                <p className="mt-1 text-xl font-black">Recibí, prepará y entregá el pedido.</p>
              </div>
              <BarChart3 size={28} />
            </Link>
          </div>
        </section>

        <section id="incluye" className="scroll-mt-24 border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
            <div>
              <SectionEyebrow>Hecho por nosotros</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                No te damos una cuenta vacía.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-black/62">
                El producto es el local funcionando, no el acceso a una plataforma. Tomamos tu material actual y lo convertimos en una experiencia lista para vender.
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
                <span className="rounded-full bg-black/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em]">Implementación</span>
                <Clock3 size={22} />
              </div>
              <div className="mt-10 space-y-3">
                {[
                  ['Día 1', 'Recibimos menú, fotos y datos'],
                  ['Día 2', 'Armamos marca, carta y pedidos'],
                  ['Día 3', 'Probamos, ajustamos y entregamos'],
                ].map(([day, task]) => (
                  <div key={day} className="grid grid-cols-[70px_1fr] items-center gap-3 rounded-2xl bg-white/12 p-4">
                    <span className="text-xs font-black uppercase tracking-[0.1em] text-white/65">{day}</span>
                    <span className="font-black">{task}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-2xl bg-[#171814] p-5">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-[#d7ff64]">Entrega real</p>
                <p className="mt-2 text-xl font-black">Link, QR, panel y una prueba completa.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="reserva" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <article className="rounded-[2rem] border-2 border-[#171814] bg-[#171814] p-6 text-white shadow-2xl sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#d7ff64]">Entrada accesible</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-5xl">
                Muestra a medida 24 h
              </h2>
              <p className="mt-4 text-3xl font-black text-[#d7ff64]">{priceLabel}</p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-white/65">
                Reserva descontada 100% si después contratás el proyecto completo. Las 24 h empiezan cuando están completos los materiales.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  'Nombre, colores y logo recibido',
                  'Hasta 8 productos o servicios',
                  'Catálogo móvil compartible',
                  'CTA a tu WhatsApp',
                  'Una ronda breve de cambios',
                  'Demos públicas = conceptuales',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm font-bold text-white/80">
                    <Check size={16} className="mt-0.5 shrink-0 text-[#d7ff64]" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-xs font-bold text-white/45">
                No incluye dominio, panel productivo, Mercado Pago del comercio ni carga masiva.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={buildReserveHref({
                    source: 'landing oferta 24h',
                    demoUrl: typeof window !== 'undefined' ? `${window.location.origin}${samplePath}` : samplePath,
                    rubro,
                    businessName: negocio.trim() || undefined,
                  })}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#d7ff64] px-6 text-sm font-black text-[#171814] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {reserveLabel}
                  <ArrowRight size={16} />
                </a>
                <a
                  href="#probar"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-black text-white transition hover:border-white"
                >
                  Probar gratis primero
                </a>
              </div>
            </article>
          </div>
        </section>

        <section id="planes" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] pb-20 sm:pb-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl pt-4">
              <SectionEyebrow>Siguiente paso</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Planes completos
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-black/60">
                Después de la muestra. Sin comisión por venta. Valores piloto en ARS para Zona Norte.
              </p>
            </div>

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {offers.map(offer => (
                <article
                  key={offer.name}
                  className={`relative flex flex-col rounded-[2rem] border p-6 sm:p-8 ${
                    offer.featured
                      ? 'border-[#171814] bg-[#171814] text-white shadow-2xl lg:-translate-y-3'
                      : 'border-black/10 bg-[#f2eee6]'
                  }`}
                >
                  {offer.featured && (
                    <span className="absolute right-6 top-6 rounded-full bg-[#d7ff64] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-[#171814]">
                      Mejor primer paso
                    </span>
                  )}
                  <p className={`text-xs font-black uppercase tracking-[0.14em] ${offer.featured ? 'text-[#d7ff64]' : 'text-[#ee6847]'}`}>
                    {offer.eyebrow}
                  </p>
                  <h3 className="mt-4 text-3xl font-black tracking-[-0.045em]">{offer.name}</h3>
                  <p className={`mt-3 min-h-20 leading-relaxed ${offer.featured ? 'text-white/58' : 'text-black/58'}`}>
                    {offer.copy}
                  </p>

                  <div className={`my-6 border-y py-5 ${offer.featured ? 'border-white/12' : 'border-black/10'}`}>
                    <p className={`text-xs font-bold ${offer.featured ? 'text-white/45' : 'text-black/45'}`}>Implementación</p>
                    <p className="mt-1 text-2xl font-black">{offer.setup}</p>
                    <p className={`mt-2 text-sm font-bold ${offer.featured ? 'text-white/55' : 'text-black/55'}`}>+ {offer.monthly} de mantenimiento</p>
                  </div>

                  <ul className="flex-1 space-y-3">
                    {offer.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm font-bold">
                        <Check size={16} className={offer.featured ? 'mt-0.5 text-[#d7ff64]' : 'mt-0.5 text-[#ee6847]'} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={reserveHref}
                    className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-black transition hover:-translate-y-0.5 ${
                      offer.featured
                        ? 'bg-[#d7ff64] text-[#171814] hover:bg-white'
                        : 'bg-[#171814] text-white hover:bg-[#ee6847]'
                    }`}
                  >
                    Empezar por la muestra
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="font-bold text-black/60">
                <strong className="text-black">Forma simple:</strong> 50% para empezar, saldo contra entrega. El alcance final depende del menú y las integraciones.
              </p>
              <ShieldCheck className="shrink-0 text-[#ee6847]" />
            </div>
          </div>
        </section>

        <section className="border-b border-black/8 py-20 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
            <div>
              <SectionEyebrow>Preguntas claras</SectionEyebrow>
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

        <section className="bg-[#ee6847] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
            <Sparkles className="mx-auto text-[#d7ff64]" size={34} />
            <h2 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-7xl">
              Primero te mostramos. Después decidís.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
              Probá una muestra gratis o reservá la versión a medida en 24 h. Sin comisión por venta.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={reserveHref}
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#171814] px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#d7ff64] hover:text-[#171814]"
              >
                {reserveLabel}
                <ArrowRight size={18} />
              </a>
              <a
                href="#probar"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/30 px-7 text-sm font-black text-white"
              >
                Probar gratis
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#171814] py-8 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-3">
              <Zap size={18} className="text-[#d7ff64]" />
              <p className="text-sm font-bold text-white/65">
                ¿Manejás varios comercios? También hay implementación marca blanca para agencias y community managers.
              </p>
            </div>
            <a href={buildSalesContactHref('partner white-label')} className="flex shrink-0 items-center gap-2 text-sm font-black text-[#d7ff64] hover:text-white">
              Consultar partners <ChevronRight size={16} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#10110e] px-4 py-10 text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-black tracking-[-0.04em]">TRUFI</p>
            <p className="mt-2 text-sm text-white/45">Pedidos directos para negocios reales · por ZengaSoft</p>
          </div>
          <div className="flex flex-wrap gap-5 text-xs font-bold text-white/55">
            <Link to={withAttribution('/demos')} className="hover:text-white">11 muestras</Link>
            <Link to={withAttribution('/demo/pizzeria')} className="hover:text-white">Demo cliente</Link>
            <Link to={withAttribution('/demo/pizzeria/owner')} className="hover:text-white">Demo local</Link>
            <a href="#reserva" className="hover:text-white">Reserva</a>
            <a href={contactHref} className="hover:text-white">Contacto</a>
          </div>
        </div>
      </footer>

      {/* Mobile sticky CTAs — safe area */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f2eee6]/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-2">
          <a
            href="#probar"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-black"
          >
            Probar
          </a>
          <a
            href={reserveHref}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171814] text-sm font-black text-white"
          >
            Reservar
          </a>
        </div>
      </div>
    </div>
  );
}
