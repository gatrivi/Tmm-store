import { useEffect, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MessageCircle } from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';
import { PROPUESTA_PRICE, PRICE_NOTE, PROPUESTAS, getPropuesta } from '../data/propuestas';

export default function PropuestaPage() {
  const { rubro } = useParams();
  const propuesta = getPropuesta(rubro);
  const contactHref = buildSalesContactHref(`propuesta ${rubro ?? ''} — quiero la mía`);

  useEffect(() => {
    document.title = propuesta
      ? `${propuesta.title} online — Gatrivi.com`
      : 'Propuesta — Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        propuesta
          ? `${propuesta.hook} Mirá la demo y pedí la tuya por WhatsApp.`
          : 'Mirá una demo y pedí la tuya por WhatsApp.',
      );
  }, [propuesta]);

  if (!propuesta) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f5f2eb] px-6 text-center text-[#171717]">
        <p className="text-2xl font-black tracking-[-0.04em]">Ese rubro no tiene propuesta todavía.</p>
        <div className="flex flex-col gap-2">
          {PROPUESTAS.map(p => (
            <Link
              key={p.slug}
              to={`/propuesta/${p.slug}`}
              className="min-h-12 rounded-full border border-black/15 bg-white px-6 text-sm font-black leading-[3rem]"
            >
              {p.title}
            </Link>
          ))}
        </div>
        <Link to="/" className="text-sm font-black underline decoration-2 underline-offset-4">
          Volver a Gatrivi.com
        </Link>
      </div>
    );
  }

  const demoLink = (href: string, external: boolean | undefined, className: string, children: ReactNode) =>
    external ? (
      <a key={href} href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    ) : (
      <Link key={href} to={href} className={className}>
        {children}
      </Link>
    );

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="border-b border-black/10 bg-[#f5f2eb]">
        <div className="mx-auto flex min-h-16 max-w-3xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-sm font-black tracking-[-0.045em]">GATRIVI.COM</Link>
          <a href={contactHref} className="text-sm font-black underline decoration-2 underline-offset-4">
            Consultar
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-28 pt-10 sm:px-6 sm:pt-14">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">
          Propuesta · {propuesta.title}
        </p>
        <h1 className="mt-3 text-[clamp(2.4rem,7vw,4rem)] font-black leading-[0.92] tracking-[-0.06em]">
          {propuesta.hook}
        </h1>

        {/* Demo principal: lo primero que se muestra en el celular */}
        <section className="mt-8">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            Probá la demo ahora
          </p>
          {demoLink(
            propuesta.primaryDemo.href,
            propuesta.primaryDemo.external,
            'group mt-3 flex items-center justify-between gap-4 rounded-[1.5rem] bg-black p-5 text-white shadow-[0_18px_45px_rgba(30,25,15,.25)] transition active:scale-[.99]',
            <>
              <span>
                <span className="block text-lg font-black tracking-[-0.03em]">
                  {propuesta.primaryDemo.name}
                </span>
                <span className="mt-1 block text-sm font-medium text-white/60">
                  {propuesta.primaryDemo.description}
                </span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ff6b35]">
                <ArrowRight size={18} />
              </span>
            </>,
          )}
        </section>

        <section className="mt-8 grid gap-3">
          {propuesta.bullets.map(item => (
            <p key={item} className="flex gap-3 text-sm font-bold leading-snug text-black/70">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#ff6b35] text-white">
                <Check size={12} strokeWidth={3} />
              </span>
              {item}
            </p>
          ))}
        </section>

        {/* Precio: mismo que /precios */}
        <section className="mt-8 rounded-[1.75rem] bg-black p-6 text-white">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ff8a5c]">
            Promo lanzamiento · Estándar
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="text-5xl font-black tracking-[-0.06em]">{PROPUESTA_PRICE.sale}</span>
            <s className="pb-1 text-sm font-bold text-white/40">{PROPUESTA_PRICE.list}</s>
          </div>
          <p className="mt-2 text-sm font-bold text-white/55">
            Reservás con {PROPUESTA_PRICE.deposit} · {PRICE_NOTE}
          </p>
          <Link
            to="/reservar?plan=standard"
            className="mt-5 inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-6 text-sm font-black text-white"
          >
            Reservar · {PROPUESTA_PRICE.deposit}
            <ArrowRight size={17} />
          </Link>
        </section>

        {/* Otras demos de respaldo */}
        <section className="mt-10">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">
            Otras muestras
          </p>
          <div className="mt-3 grid gap-3">
            {propuesta.moreDemos.map(d =>
              demoLink(
                d.href,
                d.external,
                'group flex items-center justify-between gap-4 rounded-2xl border border-black/10 bg-white p-4 transition hover:border-black/25',
                <>
                  <span>
                    <span className="block text-sm font-black">{d.name}</span>
                    <span className="mt-0.5 block text-xs font-medium leading-snug text-black/50">
                      {d.description}
                    </span>
                  </span>
                  <ArrowRight size={16} className="shrink-0 text-black/35 transition group-hover:text-[#ff6b35]" />
                </>,
              ),
            )}
          </div>
        </section>

        <section className="mt-10 rounded-[1.75rem] border border-black/10 bg-white p-6">
          <h2 className="text-2xl font-black tracking-[-0.045em]">¿La querés con tus productos?</h2>
          <p className="mt-2 text-sm font-medium leading-relaxed text-black/60">
            Mandanos fotos y precios por WhatsApp. Cargamos todo y te dejamos tu link + QR en 2–3 días.
          </p>
          <a
            href={contactHref}
            className="mt-5 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-black px-6 text-sm font-black text-white"
          >
            <MessageCircle size={17} />
            Escribinos por WhatsApp
          </a>
          <p className="mt-3 text-center text-xs font-bold text-black/40">
            Ver todos los planes ·{' '}
            <Link to="/precios" className="underline decoration-2 underline-offset-2">/precios</Link>
          </p>
        </section>

        <p className="mt-8 text-center">
          <Link to="/demos" className="inline-flex items-center gap-2 text-sm font-black text-black/55">
            <ArrowLeft size={15} />
            Ver todas las demos
          </Link>
        </p>
      </main>

      {/* CTA fijo móvil */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-[#f5f2eb]/95 p-3 pb-[max(.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
        <a
          href={contactHref}
          className="mx-auto flex min-h-12 max-w-lg items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-5 text-sm font-black text-white"
        >
          <MessageCircle size={17} />
          Quiero la mía · WhatsApp
        </a>
      </div>
    </div>
  );
}