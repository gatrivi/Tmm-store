import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';
import { captureAttribution, getDemoPriceLabel, withAttribution } from '../utils/demoIntake';

const SITE_DOMAIN = 'zengasoft.shop';

const included = [
  'Catálogo con tus productos, fotos y precios',
  'Carrito con total automático',
  'Pedido ordenado por WhatsApp',
  'Link y QR listos para compartir',
  'Panel simple para editar productos',
  'Carga inicial y puesta en marcha incluidas',
];

const steps = [
  ['1', 'Mandás el material', 'Fotos, precios, logo y datos del negocio. Nada técnico.'],
  ['2', 'Lo armamos', 'Diseño, productos, carrito, WhatsApp y pruebas desde celular.'],
  ['3', 'Compartís el link', 'Tu cliente entra, elige y te manda el pedido ordenado.'],
];

export default function LandingPage() {
  const location = useLocation();
  const price = getDemoPriceLabel();
  const buyHref = buildSalesContactHref(
    `landing funnel — quiero mi tienda ${price}`,
  );
  const demoHref = withAttribution('/demo/pizzeria');

  useEffect(() => {
    captureAttribution(location.search);
  }, [location.search]);

  useEffect(() => {
    document.title = 'Gatrivi.com — Tu negocio online, listo para vender';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Armamos tu tienda online con catálogo, carrito y WhatsApp. Lista para compartir en 3 días, sin comisión por venta.',
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="font-black tracking-[-0.045em]">
            GATRIVI.COM
          </Link>
          <a
            href={buyHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            Quiero el mío
            <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <main className="pb-24 md:pb-0">
        <section className="relative isolate overflow-hidden border-b border-black/10 bg-black text-white">
          <img
            src="/demos/pizzeria/muzza.jpg"
            alt="Tienda online de ejemplo para una pizzería"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/35" />
          <div className="relative mx-auto grid min-h-[78svh] max-w-6xl items-end gap-10 px-4 pb-14 pt-24 sm:px-6 md:min-h-[720px] md:grid-cols-[1.15fr_.85fr] md:items-center md:pb-20 md:pt-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 text-xs font-black uppercase tracking-[0.14em] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#ff6b35]" />
                Listo en 3 días · sin comisión
              </div>

              <h1 className="mt-6 text-[clamp(3.25rem,10vw,6.4rem)] font-black leading-[0.86] tracking-[-0.075em]">
                Tu negocio online.
                <span className="mt-2 block text-[#ff8a5c]">Listo para vender.</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-white/78 sm:text-xl">
                Mandanos tus fotos y precios. Te entregamos catálogo, carrito y pedidos por WhatsApp en un solo link.
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
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/8 px-7 text-sm font-black text-white backdrop-blur transition hover:bg-white/14"
                >
                  Ver tienda funcionando
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-white/65">
                <span className="flex items-center gap-2"><Check size={16} /> Sin comisión por venta</span>
                <span className="flex items-center gap-2"><Check size={16} /> Carga inicial incluida</span>
                <span className="flex items-center gap-2"><Check size={16} /> No requiere app</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-auto max-w-sm rounded-[2rem] border border-white/15 bg-black/45 p-6 shadow-2xl backdrop-blur-xl">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Promo lanzamiento</p>
                <p className="mt-4 text-sm font-bold text-white/45"><s>$650.000</s></p>
                <p className="text-5xl font-black tracking-[-0.06em] text-[#ff8a5c]">{price}</p>
                <p className="mt-2 text-sm font-bold text-white/60">implementación</p>
                <div className="my-6 h-px bg-white/12" />
                <p className="text-sm font-bold leading-relaxed text-white/80">
                  Planes desde $35.000/mes. Sin porcentaje sobre tus ventas.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Esto recibe tu cliente</p>
                <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.055em] sm:text-5xl">
                  Entra. Elige. Pide.
                </h2>
                <p className="mt-5 max-w-lg text-lg leading-relaxed text-black/60">
                  Sin registrarse, sin descargar nada y sin aprender una plataforma nueva.
                </p>
                <Link
                  to={demoHref}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-black underline decoration-2 underline-offset-4"
                >
                  Abrir la demo de pizzería
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#f5f2eb] shadow-xl">
                <div className="flex items-center gap-2 border-b border-black/10 px-4 py-3 text-xs font-bold text-black/45">
                  <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-black/15" />
                  <span className="ml-2">pizzeria.zengasoft.shop</span>
                </div>
                <div className="grid gap-4 p-5 sm:grid-cols-3">
                  {[
                    ['Muzzarella', '/demos/pizzeria/muzza.jpg'],
                    ['Napolitana', '/demos/pizzeria/napolitana.jpg'],
                    ['Fugazzeta', '/demos/pizzeria/fugazzeta.jpg'],
                  ].map(([name, src]) => (
                    <div key={name} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                      <img src={src} alt={name} className="aspect-square w-full object-cover" loading="lazy" />
                      <div className="p-3">
                        <p className="font-black">{name}</p>
                        <div className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-full bg-black text-xs font-black text-white">
                          Agregar
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Incluido</p>
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

        <section className="border-b border-black/10 bg-[#171717] py-16 text-white sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Cómo funciona</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Tres pasos.</h2>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {steps.map(([number, title, copy]) => (
                <article key={number} className="rounded-[1.75rem] border border-white/12 bg-white/5 p-6">
                  <span className="text-4xl font-black text-[#ff8a5c]">{number}</span>
                  <h3 className="mt-6 text-xl font-black">{title}</h3>
                  <p className="mt-3 leading-relaxed text-white/58">{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Para no hacerte perder tiempo</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Las cuatro preguntas importantes.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  [Smartphone, '¿Necesito instalar algo?', 'No. Vos y tus clientes usan un link normal.'],
                  [ShieldCheck, '¿Cobran por venta?', 'No. Cero comisión sobre tus ventas.'],
                  [Clock3, '¿Cuándo está listo?', 'Objetivo de entrega: 3 días con el material completo.'],
                  [PackageCheck, '¿Tengo que cargar todo?', 'No. La carga inicial viene incluida.'],
                ].map(([Icon, question, answer]) => {
                  const ItemIcon = Icon as typeof Smartphone;
                  return (
                    <div key={question as string} className="rounded-2xl border border-black/10 p-5">
                      <ItemIcon size={22} className="text-[#d84d1d]" />
                      <h3 className="mt-4 font-black">{question as string}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/58">{answer as string}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#ff6b35] p-7 text-white shadow-2xl sm:p-9">
              <div className="flex items-center gap-3">
                <ShoppingBag size={26} />
                <p className="text-xs font-black uppercase tracking-[0.14em]">Primeros 10</p>
              </div>
              <p className="mt-8 text-sm font-bold text-white/65"><s>$650.000</s></p>
              <p className="text-6xl font-black tracking-[-0.07em]">{price}</p>
              <p className="mt-2 font-bold text-white/75">implementación · planes desde $35.000/mes</p>
              <a
                href={buyHref}
                className="mt-8 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-base font-black text-white transition hover:-translate-y-0.5"
              >
                <MessageCircle size={19} />
                Quiero el mío
              </a>
              <p className="mt-4 text-center text-xs font-bold text-white/60">
                Tocás una vez y seguimos por WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f5f2eb] py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl">
              Si tenés productos, ya podemos empezar.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-black/58">
              Mandanos el material. Nosotros resolvemos el resto.
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

      <footer className="border-t border-black/10 bg-[#171717] px-4 py-8 text-white sm:px-6">
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
          className="mx-auto flex min-h-13 max-w-lg items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
        >
          <MessageCircle size={18} />
          Quiero el mío · {price}
        </a>
      </div>
    </div>
  );
}
