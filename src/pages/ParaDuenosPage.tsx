import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, MessageCircle } from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

/* Página general "qué hacemos / cómo le sirve al dueño" (inbound).
   Distinta de /propuesta/[rubro] (outreach por rubro): esta explica
   el antes→después para cualquier comercio, alrededor del dolor
   "mandan un excel/PDF seco o pierden tiempo buscando fotos". */

const BEFORE = [
  'Cada vez que preguntan "¿qué venden?", hay que mandar capturas o un PDF viejo',
  'Las fotos están sueltas en el celular: hay que parar y buscar',
  'Los pedidos llegan por audio suelto y se pierden en el chat',
  'Los precios se desactualizan y el cliente se entera en caja',
];

const AFTER = [
  'Un link con tu carta real: fotos, precios y variantes al día',
  'El cliente arma solo su pedido desde el celular → te llega ordenado por WhatsApp',
  'Vos confirmás en un panel simple, sin vueltas',
  'Cero comisión por venta — el link y el QR son tuyos',
];

const beneficios = [
  {
    title: 'Dejá de mandar exceles y PDFs secos',
    copy: 'Cada consulta se responde con un link con fotos y precios. Nada de cortar y pegar capturas.',
  },
  {
    title: 'Tu clientela arma el pedido sola',
    copy: 'Elegís, sumás al carrito y marcás retiro o delivery. El pedido llega armado: productos, total y datos.',
  },
  {
    title: 'Nada se pierde en el chat',
    copy: 'Pedidos ordenados por WhatsApp, con su estado. Vos decidís cuándo avanzarlos.',
  },
  {
    title: 'Vos lo controlás todo',
    copy: 'Cambiás precios, sacás o agregás productos desde el celular, sin depender de nadie.',
  },
  {
    title: 'Sin comisión por venta',
    copy: 'A diferencia de las apps, no nos llevamos un porcentaje de cada pedido.',
  },
  {
    title: 'Listo en 2–3 días',
    copy: 'Nos mandás fotos y precios por WhatsApp. Cargamos todo y te dejamos el link + QR andando.',
  },
];

const pasos = [
  'Nos mandás fotos y precios por WhatsApp, como te resulte.',
  'Cargamos tu catálogo y te dejamos el link + QR andando en 2–3 días.',
  'Lo compartís en Instagram, el mostrador y en cada respuesta.',
];
export default function ParaDuenosPage() {
  const contactHref = buildSalesContactHref('para el dueño — quiero mi catálogo');

  useEffect(() => {
    document.title = 'Para tu negocio — catálogo online con pedidos por WhatsApp | Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Dejá de mandar exceles y PDFs: tu carta con fotos y precios en un link, pedidos armados por WhatsApp y sin comisión. Gatrivi.com — de ZengaSoft.',
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="border-b border-black/10 bg-[#f5f2eb]">
        <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-sm font-black tracking-[-0.045em]">GATRIVI.COM</Link>
          <Link to="/demos" className="text-sm font-black underline decoration-2 underline-offset-4">Ver demos</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 sm:px-6 sm:pt-14">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">
          Para tu negocio · Gatrivi.com
        </p>
        <h1 className="mt-3 text-[clamp(2.4rem,7vw,4rem)] font-black leading-[0.92] tracking-[-0.06em]">
          Para de mandar exceles. Mandá un link con tu carta.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-black/60">
          Si te preguntan todo el día <strong>“¿qué venden?”</strong>, hoy lo resolvés con capturas, un PDF seco o
          buscando fotos en el celular. Te armamos un catálogo online con tu nombre: fotos, precios al día y pedidos
          que llegan ordenados a tu WhatsApp. Sin comisión por venta.
        </p>

        {/* Fotos reales de las demos — matan el muro de texto */}
        <div className="mt-8 grid grid-cols-3 gap-3" aria-hidden="true">
          {[
            '/demos/pizzeria/fugazzeta.jpg',
            '/demos/panaderia/products/medialunas.jpg',
            '/demos/carniceria/gabriel-hero.jpg',
          ].map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`zs-float h-24 w-full rounded-2xl border-2 border-white object-cover shadow-md sm:h-32 ${i === 1 ? 'mt-4' : ''}`}
              data-float={i}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>

        {/* Antes → Después */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div data-reveal className="rounded-[1.75rem] border border-black/10 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">Hoy</p>
            <ul className="mt-4 space-y-3">
              {BEFORE.map(item => (
                <li key={item} className="flex gap-3 text-sm font-medium leading-snug text-black/60">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/10 text-black/40">×</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal data-delay={120} className="rounded-[1.75rem] bg-black p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff8a5c]">Con Gatrivi</p>
            <ul className="mt-4 space-y-3">
              {AFTER.map(item => (
                <li key={item} className="flex gap-3 text-sm font-medium leading-snug text-white/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Qué te damos */}
        <section className="mt-12">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Qué incluye</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Una carta viva, no un archivo muerto.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {beneficios.map((b, i) => (
              <div key={b.title} data-reveal data-delay={(i % 2) * 100} className="rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-[15px] font-black leading-snug">{b.title}</p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-black/55">{b.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cómo arrancar */}
        <section className="mt-12 rounded-[1.75rem] bg-white p-6">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">En qué te metés</p>
          <ol className="mt-4 space-y-3">
            {pasos.map((step, i) => (
              <li key={step} data-reveal data-delay={i * 80} className="flex gap-3 text-[15px] font-bold leading-snug text-black/75">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-black text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Mirá antes de hablar */}
        <Link
          to="/demos"
          className="group mt-10 flex items-center justify-between gap-4 rounded-[1.75rem] bg-black p-5 text-white shadow-[0_18px_45px_rgba(30,25,15,.25)] transition active:scale-[.99]"
        >
          <span>
            <span className="block text-lg font-black tracking-[-0.03em]">Mirá una demo andando</span>
            <span className="mt-1 block text-sm font-medium text-white/60">
              Pizzería, panadería, carnicería, verdulería y más — probá el flujo real en 20 segundos.
            </span>
          </span>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff6b35]">
            <ArrowRight size={18} />
          </span>
        </Link>

        {/* CTA */}
        <section className="mt-10 rounded-[1.75rem] border border-black/10 bg-white p-6">
          <h2 className="text-2xl font-black tracking-[-0.045em]">¿La querés con tus productos?</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black/60">
            Mandanos fotos y precios. Cargamos todo y te dejamos tu link + QR en 2–3 días.
          </p>
          <a
            href={contactHref}
            className="zs-btn-shine mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white"
          >
            <MessageCircle size={17} />
            Escribinos por WhatsApp
          </a>
          <p className="mt-3 text-center text-xs font-bold text-black/40">
            Sin comisión por venta ·{' '}
            <Link to="/precios" className="underline decoration-2 underline-offset-2">planes y pagos</Link>
          </p>
        </section>
      </main>

      {/* CTA fijo móvil */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f2eb]/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <a
          href={contactHref}
          className="mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
        >
          <MessageCircle size={17} />
          Quiero mi catálogo · WhatsApp
        </a>
      </div>
    </div>
  );
}