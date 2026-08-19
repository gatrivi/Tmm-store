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
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="font-black tracking-[-0.045em]">
            GATRIVI.COM
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/referidos/como-funciona"
              className="inline-flex min-h-10 items-center px-2 text-xs font-black text-black/60 transition hover:text-black sm:px-3 sm:text-sm"
            >
              Referidos
            </Link>
            <a
              href={buyHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-black text-white transition hover:-translate-y-0.5 sm:px-5"
            >
              Quiero el mío
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <section className="relative isolate overflow-hidden bg-black text-white">
          <img
            src="/demos/pizzeria/muzza.jpg"
            alt="Ejemplo de tienda online para una pizzería"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
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
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-7 text-base font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff7d4d]"
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
            </div>

            <div className="hidden md:block">
              <div className="ml-auto max-w-sm rounded-[2rem] border border-white/15 bg-black/50 p-7 shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Promo 50% · hasta reunir 5 testimonios</p>
                <p className="mt-5 text-sm font-bold text-white/45"><s>$650.000</s></p>
                <p className="text-5xl font-black tracking-[-0.06em] text-[#ff8a5c]">{price}</p>
                <p className="mt-2 text-sm font-bold text-white/60">implementación</p>
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

        <section className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">La experiencia</p>
              <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                Entra. Elige. Pide.
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-black/60">
                Eso es todo lo que debería entender tu cliente.
              </p>
              <ol className="mt-8 space-y-4 text-sm font-bold">
                <li className="flex gap-3"><span className="text-[#d84d1d]">01</span> Ve tus productos y precios.</li>
                <li className="flex gap-3"><span className="text-[#d84d1d]">02</span> Agrega lo que quiere.</li>
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
                loading="lazy"
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

        <section className="border-b border-black/10 bg-[#ff6b35] py-12 text-white sm:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Programa de referidos</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.05em] sm:text-4xl">¿Conocés comercios? Ganá 15% recomendándonos.</h2>
              <p className="mt-3 text-sm font-bold leading-relaxed text-white/75">
                Generá flyers con QR propio y medí qué ubicación termina trayendo clientes.
              </p>
            </div>
            <Link
              to="/referidos/como-funciona"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white"
            >
              Cómo funciona <ArrowRight size={16} />
            </Link>
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
          <div className="flex items-center gap-4">
            <Link to="/referidos/como-funciona" className="text-sm font-black text-white/60">Referidos</Link>
            <a href={buyHref} className="text-sm font-black text-[#ff8a5c]">WhatsApp</a>
          </div>
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
