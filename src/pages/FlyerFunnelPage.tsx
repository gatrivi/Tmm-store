import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageCircle, Store } from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

const SALE_PRICE = '$325.000';
const LIST_PRICE = '$650.000';
const DEPOSIT = '$65.000';

const included = [
  'Catálogo con fotos y precios',
  'Carrito y pedido ordenado por WhatsApp',
  'Carga inicial incluida',
  'Diseño para celular',
  'Dominio por 1 año',
  'Listo en 3 días con el material completo',
  'Sin comisión sobre tus ventas',
];

export default function FlyerFunnelPage() {
  const contactHref = buildSalesContactHref('flyer — vi el volante y quiero consultar antes de reservar');

  useEffect(() => {
    document.title = 'Tu negocio online — Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Catálogo y tienda online para negocios. Mirá una demo, reservá con seña o consultá por WhatsApp.',
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="border-b border-black/10 bg-[#f5f2eb]">
        <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="font-black tracking-[-0.045em]">GATRIVI.COM</Link>
          <a href={contactHref} className="text-sm font-black underline decoration-2 underline-offset-4">
            Consultar
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24 pt-10 sm:px-6 sm:pt-16">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em]">
            <Store size={15} />
            Para comercios y emprendimientos
          </div>

          <h1 className="mt-6 text-[clamp(3.2rem,13vw,6rem)] font-black leading-[0.86] tracking-[-0.075em]">
            Tu negocio.
            <span className="mt-2 block text-[#d84d1d]">En un link.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-black/60 sm:text-xl">
            Mandanos fotos y precios. Armamos tu catálogo o tienda para que tus clientes vean, elijan y pidan desde el celular.
          </p>

          <div className="mt-8 rounded-[2rem] bg-black p-6 text-white sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff8a5c]">Promo lanzamiento · Estándar</p>
            <div className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-1">
              <span className="text-5xl font-black tracking-[-0.06em]">{SALE_PRICE}</span>
              <s className="pb-1 text-sm font-bold text-white/40">{LIST_PRICE}</s>
            </div>
            <p className="mt-2 text-sm font-bold text-white/55">Reservás el trabajo con {DEPOSIT}. Se descuenta del total.</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link
                to="/demo/pizzeria"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-black text-black"
              >
                Ver tienda funcionando
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/reservar?plan=standard"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 text-sm font-black text-white"
              >
                Reservar · {DEPOSIT}
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-10 border-y border-black/10 py-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">Qué incluye</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {included.map(item => (
              <p key={item} className="flex gap-3 text-sm font-bold leading-snug text-black/70">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="py-9">
          <h2 className="text-3xl font-black tracking-[-0.045em]">No hace falta decidir todo ahora.</h2>
          <p className="mt-3 max-w-xl font-medium leading-relaxed text-black/60">
            Si necesitás algo más simple o más completo, compará los planes. Si tenés una duda puntual, escribinos.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/pricing"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-sm font-black"
            >
              Ver planes
            </Link>
            <a
              href={contactHref}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-5 text-sm font-black"
            >
              <MessageCircle size={17} />
              WhatsApp
            </a>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f2eb]/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <Link
          to="/reservar?plan=standard"
          className="mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
        >
          Reservar con {DEPOSIT}
          <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  );
}
