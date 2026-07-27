import { useEffect } from 'react';
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
  Printer,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Tags,
  UtensilsCrossed,
  Zap,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

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
    copy: 'El cliente compra desde tu link y la relación sigue siendo tuya. Cero comisión por pedido.',
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
    answer: 'Sí para catálogos con variantes y pedidos simples: dietéticas, pet shops, fiambrerías y comercios similares. Primero validamos el flujo.',
  },
];

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

  useEffect(() => {
    document.title = 'Trufi — Pedidos directos para tu negocio';
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute(
      'content',
      'Carta digital y pedidos directos para comercios. Implementación personalizada, sin comisión por venta.',
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
            <a href="#como-funciona" className="transition hover:text-black">Cómo funciona</a>
            <a href="#incluye" className="transition hover:text-black">Qué incluye</a>
            <a href="#planes" className="transition hover:text-black">Planes</a>
          </nav>

          <a
            href={contactHref}
            className="rounded-full bg-[#171814] px-4 py-2.5 text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ee6847] sm:text-sm"
          >
            Pedir demo
          </a>
        </div>
      </header>

      <main>
        <section className="relative border-b border-black/8">
          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(#171814_0.7px,transparent_0.7px)] [background-size:18px_18px]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-20 lg:px-8 lg:py-28">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/65 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#ee6847]" />
                Zona Norte · listo en 48–72 hs
              </div>

              <h1 className="max-w-3xl text-[clamp(3rem,8vw,6.8rem)] font-black leading-[0.89] tracking-[-0.075em]">
                Tus pedidos,
                <span className="block text-[#ee6847]">sin el caos.</span>
              </h1>

              <p className="mt-7 max-w-xl text-lg leading-relaxed text-black/66 sm:text-xl">
                Te armamos una carta con carrito para que tus clientes pidan bien desde el primer mensaje. Tu marca, tu WhatsApp, cero comisión por venta.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/demo/pizzeria"
                  className="group inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#171814] px-6 text-sm font-black text-white transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Probar como cliente
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/demo/pizzeria/owner"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-black/15 bg-white/50 px-6 text-sm font-black transition hover:border-black hover:bg-white"
                >
                  <Store size={18} />
                  Ver panel del local
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-black/55">
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin app</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Sin comisión</span>
                <span className="flex items-center gap-1.5"><Check size={14} /> Soporte humano</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#d7ff64] blur-3xl" />
              <div className="relative rotate-[1.5deg] overflow-hidden rounded-[2rem] border border-black/10 bg-[#171814] p-3 shadow-[0_35px_90px_rgba(30,25,15,0.24)] sm:p-4">
                <div className="rounded-[1.45rem] bg-[#fbfaf6] p-3 sm:p-5">
                  <div className="mb-4 flex items-center justify-between border-b border-black/8 pb-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-black/40">Club Social Olivos</p>
                      <p className="mt-1 text-sm font-black">Pedí directo</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171814] text-white">
                      <UtensilsCrossed size={18} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                      <img
                        src="/Fotos%20menu/choripan/1.JPG"
                        alt="Sándwich del menú de demostración"
                        className="h-32 w-full object-cover sm:h-44"
                      />
                      <div className="p-3">
                        <p className="text-sm font-black">Sándwich de la casa</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-black">$14.500</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171814] text-white">+</span>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-black/8 bg-white">
                      <img
                        src="/Fotos%20menu/hamburguesa/1.JPG"
                        alt="Hamburguesa del menú de demostración"
                        className="h-32 w-full object-cover sm:h-44"
                      />
                      <div className="p-3">
                        <p className="text-sm font-black">Burger completa</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-black">$19.000</span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#171814] text-white">+</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 rounded-2xl bg-[#d7ff64] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/50">Pedido #K7P4</p>
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
                    <p className="truncate text-sm font-black">2 productos · retiro · transferencia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/8 bg-[#171814] text-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 px-4 sm:grid-cols-3 sm:px-6 lg:grid-cols-6 lg:px-8">
            {[
              ['Carta', Smartphone],
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

        <section className="border-b border-black/8 bg-[#171814] py-20 text-white sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <SectionEyebrow>Demo completa</SectionEyebrow>
                <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                  Miralo de los dos lados.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-white/60 lg:justify-self-end">
                Hacé un pedido como cliente. Después pasá al panel del local y mirá cómo deja de ser un chat ambiguo para convertirse en trabajo concreto.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2">
              <Link to="/demo/pizzeria" className="group rounded-[2rem] border border-white/12 bg-white/6 p-7 transition hover:-translate-y-1 hover:bg-white/10 sm:p-9">
                <div className="flex items-start justify-between">
                  <Smartphone size={28} className="text-[#d7ff64]" />
                  <ChevronRight size={24} className="transition group-hover:translate-x-1" />
                </div>
                <p className="mt-12 text-xs font-black uppercase tracking-[0.14em] text-white/40">Vista cliente</p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">Elegí, armá y pedí.</h3>
                <p className="mt-3 text-white/55">Carta real, variantes, carrito y checkout.</p>
              </Link>

              <Link to="/demo/pizzeria/owner" className="group rounded-[2rem] bg-[#d7ff64] p-7 text-[#171814] transition hover:-translate-y-1 hover:bg-white sm:p-9">
                <div className="flex items-start justify-between">
                  <BarChart3 size={28} />
                  <ChevronRight size={24} className="transition group-hover:translate-x-1" />
                </div>
                <p className="mt-12 text-xs font-black uppercase tracking-[0.14em] text-black/40">Vista del local</p>
                <h3 className="mt-2 text-3xl font-black tracking-[-0.04em]">Recibí, prepará y entregá.</h3>
                <p className="mt-3 text-black/55">Pedidos ordenados, estados y métricas básicas.</p>
              </Link>
            </div>
          </div>
        </section>

        <section id="planes" className="scroll-mt-24 border-b border-black/8 bg-[#fbfaf6] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <SectionEyebrow>Oferta de lanzamiento</SectionEyebrow>
              <h2 className="text-4xl font-black leading-[0.98] tracking-[-0.055em] sm:text-6xl">
                Empezá donde duele hoy.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-black/60">
                Todos incluyen armado inicial y soporte directo. Sin comisión por venta. Valores piloto en ARS para Zona Norte.
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
                    href={buildSalesContactHref(`plan ${offer.name}`)}
                    className={`mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-black transition hover:-translate-y-0.5 ${
                      offer.featured
                        ? 'bg-[#d7ff64] text-[#171814] hover:bg-white'
                        : 'bg-[#171814] text-white hover:bg-[#ee6847]'
                    }`}
                  >
                    Pedir demo de mi negocio
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
              Mandanos tu menú o Instagram. Preparamos una primera muestra con tu identidad y vemos juntos si vale la pena avanzar.
            </p>
            <a
              href={contactHref}
              className="mt-9 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#171814] px-7 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-[#d7ff64] hover:text-[#171814]"
            >
              Quiero ver mi negocio
              <ArrowRight size={18} />
            </a>
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
            <Link to="/demo/pizzeria" className="hover:text-white">Demo cliente</Link>
            <Link to="/demo/pizzeria/owner" className="hover:text-white">Demo local</Link>
            <a href="#planes" className="hover:text-white">Planes</a>
            <a href={contactHref} className="hover:text-white">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
