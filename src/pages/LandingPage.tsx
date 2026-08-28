import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';
import { captureAttribution, getDemoPriceLabel, withAttribution } from '../utils/demoIntake';

const SITE_DOMAIN = 'zengasoft.shop';

const included = [
  'Catálogo con fotos y precios',
  'Carrito con total automático',
  'Pedido ordenado por WhatsApp',
  'Link y QR para compartir',
  'Panel simple para productos',
  'Carga inicial incluida',
];

const objections = [
  {
    icon: Smartphone,
    title: 'Sin app',
    copy: 'Tu cliente abre un link normal. No se registra ni descarga nada.',
  },
  {
    icon: ShieldCheck,
    title: 'Sin comisión',
    copy: 'Cero porcentaje sobre tus ventas.',
  },
  {
    icon: Clock3,
    title: '3 días',
    copy: 'Objetivo de entrega con el material completo.',
  },
  {
    icon: PackageCheck,
    title: 'Lo cargamos',
    copy: 'No te damos una cuenta vacía. La carga inicial está incluida.',
  },
];

const steps = [
  {
    n: '01',
    title: 'Mandás fotos y precios',
    copy: 'Por WhatsApp, como te resulte. Sin formularios ni cuentas.',
  },
  {
    n: '02',
    title: 'Armamos tu tienda',
    copy: 'Catálogo, carrito y pedidos listos en 3 días con el material completo.',
  },
  {
    n: '03',
    title: 'Compartís y vendés',
    copy: 'Link y QR para pegar en Instagram, el local y cada respuesta.',
  },
];

const stores = [
  {
    name: 'Las Tortas de Mamá Mabel',
    rubro: 'Tortas y pastelería',
    img: '/demos/mamabel/balcarce.jpg',
    href: '/demo/mamabel',
  },
  {
    name: 'Pizza G',
    rubro: 'Pizzería',
    img: '/demos/pizzeria/fugazzeta.jpg',
    href: '/demo/pizzeria',
  },
  {
    name: 'La Magdalena',
    rubro: 'Panadería',
    img: '/demos/panaderia/products/facturas-surtidas.jpg',
    href: '/demo/panaderia',
  },
  {
    name: 'Canavesi',
    rubro: 'Carnicería',
    img: '/demos/canavesi/picada.jpg',
    href: '/demo/canavesi',
  },
];

const faqs = [
  {
    q: '¿Qué necesito para arrancar?',
    a: 'Fotos y precios de tus productos. Con eso cargamos todo y te entregamos el link andando.',
  },
  {
    q: '¿Después puedo cambiar precios o productos?',
    a: 'Sí. El panel abre desde tu celular: cambiás precios, sacás o agregás productos sin pedirnos nada.',
  },
  {
    q: '¿Cómo recibo el pago?',
    a: 'Tu cliente te pasa el pedido por WhatsApp y coordinan el pago directo: efectivo o transferencia. Nosotros no intermediamos ni nos llevamos un peso.',
  },
  {
    q: '¿El link y el QR son míos?',
    a: 'Sí. Link fijo con tu nombre y QR para el mostrador, listos para compartir donde quieras.',
  },
];

export default function LandingPage() {
  const location = useLocation();
  const price = getDemoPriceLabel();
  const demoHref = withAttribution('/demo/pizzeria');
  const demosHref = withAttribution('/demos');
  const pricingHref = withAttribution('/pricing');
  const buyHref = buildSalesContactHref(`landing funnel — quiero mi tienda ${price}`);

  useEffect(() => {
    captureAttribution(location.search);
  }, [location.search]);

  useEffect(() => {
    document.title = 'Gatrivi.com — Tu negocio online, listo para vender';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Armamos tu tienda online con catálogo, carrito y WhatsApp. Lista para compartir en 3 días y sin comisión por venta.',
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="font-black tracking-[-0.045em]">
            GATRIVI.COM
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/para-duenos"
              className="hidden text-sm font-black text-black/60 transition hover:text-black sm:inline"
            >
              Para tu negocio
            </Link>
            <a
              href={buyHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Quiero el mío
              <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <section className="relative isolate overflow-hidden bg-black text-white">
          <img
            src="/demos/pizzeria/muzza.jpg"
            alt="Ejemplo de tienda online para una pizzería"
            className="zs-hero-parallax absolute inset-0 h-full w-full object-cover opacity-45"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />

          <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-end gap-10 px-4 pb-14 pt-24 sm:px-6 md:min-h-[700px] md:grid-cols-[1.2fr_.8fr] md:items-center md:pb-20 md:pt-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ff6b35]" />
                Listo en 3 días · sin comisión
              </div>

              <h1 className="mt-6 text-[clamp(3.15rem,10vw,6.3rem)] font-black leading-[0.87] tracking-[-0.075em]">
                Tu negocio online.
                <span className="mt-2 block text-[#ff8a5c]">Listo para vender.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-white/75 sm:text-xl">
                Mandanos fotos y precios. Te entregamos catálogo, carrito y pedidos por WhatsApp en un solo link.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href={buyHref}
                  className="zs-btn-shine inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-7 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff7d4d]"
                >
                  Quiero el mío · {price}
                  <ArrowRight size={18} />
                </a>
                <Link
                  to={demoHref}
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  Ver tienda funcionando
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/65">
                <span className="flex items-center gap-2"><Check size={16} /> Sin comisión</span>
                <span className="flex items-center gap-2"><Check size={16} /> Carga incluida</span>
                <span className="flex items-center gap-2"><Check size={16} /> Sin app</span>
              </div>
              <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-white/40">
                Pizzerías · Rotiserías · Panaderías · Carnicerías · Despensas
              </p>
            </div>

            <div className="hidden md:block">
              {/* Fotos de productos reales flotando sobre la tarjeta de precio */}
              <div className="relative">
                <img
                  src="/demos/panaderia/products/medialunas.jpg"
                  alt=""
                  aria-hidden="true"
                  className="zs-float absolute -left-10 -top-8 h-28 w-28 rounded-2xl border-4 border-white/90 object-cover shadow-2xl"
                  data-float="0"
                  loading="lazy"
                  decoding="async"
                />
                <img
                  src="/demos/pizzeria/fugazzeta.jpg"
                  alt=""
                  aria-hidden="true"
                  className="zs-float absolute -bottom-10 -left-16 h-32 w-32 rounded-2xl border-4 border-white/90 object-cover shadow-2xl"
                  data-float="1"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="ml-auto max-w-sm rounded-[2rem] border border-white/15 bg-black/50 p-7 shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Promo 50% · hasta reunir 5 testimonios</p>
                <p className="mt-5 text-sm font-bold text-white/45"><s>$650.000</s></p>
                <p className="text-5xl font-black tracking-[-0.06em] text-[#ff8a5c]">{price}</p>
                <p className="mt-2 text-sm font-bold text-white/60">implementación</p>
                <p className="mt-1 text-xs font-bold text-white/45">50% al arrancar · 50% al entregar</p>
                <div className="my-6 h-px bg-white/15" />
                <p className="font-bold leading-relaxed text-white/80">
                  Planes desde $35.000/mes. Sin porcentaje sobre tus ventas.
                </p>
                <Link
                  to={pricingHref}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#ff8a5c] underline decoration-2 underline-offset-4"
                >
                  Ver planes y formas de pago
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="border-b border-black/10 bg-white py-10">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-3 sm:px-6">
            {steps.map((step, i) => (
              <div key={step.n} data-reveal data-delay={i * 90} className="flex gap-4">
                <span className="text-2xl font-black tracking-[-0.04em] text-[#d84d1d]">{step.n}</span>
                <div>
                  <p className="font-black">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-black/55">{step.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">La experiencia</p>
              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                Entra. Elegí. Pedí.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-black/60">
                Eso es todo lo que debería entender tu cliente.
              </p>
              <ol className="mt-8 space-y-4 text-sm font-bold">
                <li className="flex gap-3"><span className="text-[#d84d1d]">01</span> Ve tus productos y precios.</li>
                <li className="flex gap-3"><span className="text-[#d84d1d]">02</span> Agregá lo que querés.</li>
                <li className="flex gap-3"><span className="text-[#d84d1d]">03</span> Te llega el pedido ordenado.</li>
              </ol>
              <div className="mt-8 flex flex-col items-start gap-3">
                <Link
                  to={demoHref}
                  className="inline-flex items-center gap-2 text-sm font-black underline decoration-2 underline-offset-4"
                >
                  Probar la demo real
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to={demosHref}
                  className="inline-flex items-center gap-2 text-sm font-black text-black/45 transition hover:text-black"
                >
                  Ver más ejemplos
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <Link
              to={demoHref}
              className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-black shadow-2xl sm:min-h-[520px]"
            >
              <img
                src="/demos/pizzeria/napo.jpg"
                alt="Pizza napolitana en la tienda de demostración"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                loading="eager"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/60">Demo pizzería</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.04em]">Esto es lo que ve el cliente.</p>
                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black">
                  Abrir tienda <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </section>
        <section className="border-b border-black/10 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Tiendas reales</p>
                <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                  Andando ahora mismo.
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-black/60">
                  Cada una es un link que ya está online. Tocalo y pedí como te pediría tu cliente.
                </p>
              </div>
              <Link
                to={demosHref}
                className="inline-flex items-center gap-2 text-sm font-black underline decoration-2 underline-offset-4"
              >
                Ver todas las demos
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stores.map((store, i) => (
                <Link
                  key={store.name}
                  to={withAttribution(store.href)}
                  data-reveal
                  data-delay={i * 110}
                  className="zs-btn-shine group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-black/5">
                    <img
                      src={store.img}
                      alt={`Tienda online de ${store.name}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 p-4">
                    <div>
                      <p className="font-black leading-tight">{store.name}</p>
                      <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-black/40">{store.rubro}</p>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-[#d84d1d] transition group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Qué recibís</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Lo necesario. Nada raro.</h2>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {included.map(item => (
                <div key={item} className="flex min-h-24 items-start gap-3 rounded-2xl border border-black/10 bg-white p-5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                    <Check size={15} strokeWidth={3} />
                  </span>
                  <p className="font-bold leading-snug">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#171717] py-16 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Sin letra chica rara</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Cuatro cosas que importan.</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {objections.map(item => {
                  const Icon = item.icon;
                  return (
                    <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                      <Icon size={22} className="text-[#ff8a5c]" />
                      <h3 className="mt-4 font-black">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{item.copy}</p>
                    </article>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#ff6b35] p-7 text-white shadow-2xl sm:p-9">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Promo lanzamiento 50% · hasta reunir 5 testimonios</p>
              <p className="mt-8 text-sm font-bold text-white/60"><s>$650.000</s></p>
              <p className="text-6xl font-black tracking-[-0.07em]">{price}</p>
              <p className="mt-2 font-bold text-white/75">implementación · desde $35.000/mes</p>
              <p className="mt-1 text-sm font-bold text-white/60">50% al arrancar · 50% al entregar</p>
              <a
                href={buyHref}
                className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-base font-black text-white transition hover:-translate-y-0.5"
              >
                <MessageCircle size={19} />
                Quiero el mío
              </a>
              <Link
                to={pricingHref}
                className="mt-4 flex min-h-11 items-center justify-center gap-2 text-sm font-black text-white underline decoration-2 underline-offset-4"
              >
                Ver planes y formas de pago
                <ArrowRight size={15} />
              </Link>
              <p className="mt-4 text-center text-xs font-bold text-white/65">
                Un toque. Seguimos por WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Antes de preguntar</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Lo que todos preguntan.</h2>
            <div className="mt-8 divide-y divide-black/10 border-y border-black/10">
              {faqs.map(faq => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-black [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="text-xl font-black text-[#d84d1d] transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-black/60">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f2eb] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
              Si tenés productos, podemos empezar.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-black/60">
              Mandanos fotos y precios. Nosotros resolvemos el resto.
            </p>
            <a
              href={buyHref}
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-black px-8 text-base font-black text-white transition hover:-translate-y-0.5"
            >
              Quiero mi tienda · {price}
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#171717] px-4 py-8 text-white sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-5">
          <div>
            <p className="font-black tracking-[-0.04em]">GATRIVI.COM</p>
            <p className="mt-1 text-xs text-white/40">de ZengaSoft · {SITE_DOMAIN}</p>
          </div>
          <a href={buyHref} className="text-sm font-black text-[#ff8a5c]">WhatsApp</a>
        </div>
      </footer>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f2eb]/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <a
          href={buyHref}
          className="mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
        >
          <MessageCircle size={18} />
          Quiero el mío · {price}
        </a>
      </div>
    </div>
  );
}
