import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  MessageCircle,
  ShoppingBag,
  Store,
} from 'lucide-react';
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

function CommerceHeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-[31rem] lg:mx-0">
      <div className="absolute -left-2 top-10 z-20 hidden rounded-2xl border border-black/10 bg-white p-3 shadow-xl sm:block">
        <div className="flex items-center gap-3">
          <img
            src="/demos/pizzeria/empanada-carne.jpg"
            alt="Producto de ejemplo"
            className="h-14 w-14 rounded-xl object-cover"
          />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">Producto</p>
            <p className="mt-1 text-sm font-black">Empanada</p>
            <p className="text-xs font-bold text-black/45">Lista para pedir</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-2 top-20 z-20 rounded-2xl border border-black/10 bg-white p-3 shadow-xl sm:right-0">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ff6b35] text-white">
            <ShoppingBag size={16} strokeWidth={2.7} />
          </span>
          <div>
            <p className="text-xs font-black">Nuevo pedido</p>
            <p className="mt-0.5 text-[11px] font-bold text-black/45">Todo ordenado</p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[2.25rem] border border-black/10 bg-[#e9e1d3] p-5 shadow-[0_30px_80px_rgba(0,0,0,.14)] sm:p-7">
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/[0.06] to-transparent" />

        <div className="relative mx-auto w-[68%] min-w-[220px] max-w-[290px] rounded-[2.4rem] bg-[#171717] p-2.5 shadow-2xl">
          <div className="overflow-hidden rounded-[1.95rem] bg-[#fffaf3]">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <div className="flex items-center gap-2">
                <img src="/demos/pizzeria/monogram.svg" alt="" className="h-7 w-7" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/35">Demo</p>
                  <p className="text-xs font-black">Pizza G</p>
                </div>
              </div>
              <span className="rounded-full bg-black px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.1em] text-white">
                Pedir
              </span>
            </div>

            <div className="p-3">
              <div className="overflow-hidden rounded-2xl bg-black">
                <img
                  src="/demos/pizzeria/muzza.jpg"
                  alt="Pizza en una tienda online de ejemplo"
                  className="aspect-[4/3] w-full object-cover opacity-90"
                />
                <div className="p-3 text-white">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#ff9a73]">Destacado</p>
                  <p className="mt-1 text-lg font-black tracking-[-0.035em]">Muzzarella</p>
                  <p className="mt-1 text-xs font-bold text-white/55">Elegí · sumá · pedí</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ['/demos/pizzeria/fugazzeta.jpg', 'Fugazzeta'],
                  ['/demos/pizzeria/faina.jpg', 'Fainá'],
                ].map(([src, name]) => (
                  <div key={name} className="rounded-xl border border-black/10 bg-white p-2">
                    <img src={src} alt={name} className="aspect-square w-full rounded-lg object-cover" />
                    <p className="mt-2 truncate text-[11px] font-black">{name}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex min-h-11 items-center justify-center rounded-xl bg-[#ff6b35] px-3 text-xs font-black text-white">
                Hacer pedido
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-4 z-20 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-xl sm:left-8">
        <p className="flex items-center gap-2 text-xs font-black">
          <Check size={15} className="text-[#d84d1d]" strokeWidth={3} />
          Sin cuota mensual obligatoria
        </p>
      </div>
    </div>
  );
}

export default function FlyerFunnelPage() {
  const contactHref = buildSalesContactHref('oferta — vi la propuesta y quiero consultar antes de reservar');

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
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="font-black tracking-[-0.045em]">GATRIVI.COM</Link>
          <div className="flex items-center gap-4">
            <Link to="/precios" className="hidden text-sm font-black sm:block">Precios</Link>
            <a href={contactHref} className="text-sm font-black underline decoration-2 underline-offset-4">
              Consultar
            </a>
          </div>
        </div>
      </header>

      <main className="pb-24">
        <section className="mx-auto grid max-w-6xl gap-12 px-4 pb-14 pt-10 sm:px-6 sm:pt-16 lg:grid-cols-[1.03fr_.97fr] lg:items-center lg:gap-10 lg:pb-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em]">
              <Store size={15} />
              Para comercios y emprendimientos
            </div>

            <h1 className="mt-6 text-[clamp(3.2rem,8vw,6.5rem)] font-black leading-[0.86] tracking-[-0.075em]">
              Tu negocio.
              <span className="mt-2 block text-[#d84d1d]">En un link.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-black/60 sm:text-xl">
              Mandanos fotos y precios. Armamos tu catálogo o tienda para que tus clientes vean, elijan y pidan desde el celular.
            </p>

            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm font-black text-black/55">
              <span>Catálogo</span>
              <span className="text-[#d84d1d]">•</span>
              <span>Página</span>
              <span className="text-[#d84d1d]">•</span>
              <span>Tienda</span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/precios"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white"
              >
                Ver precios
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/demo/pizzeria"
                className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 text-sm font-black"
              >
                Ver una tienda
              </Link>
            </div>
          </div>

          <CommerceHeroVisual />
        </section>

        <section className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-black p-6 text-white sm:p-8">
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
                to="/precios"
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
