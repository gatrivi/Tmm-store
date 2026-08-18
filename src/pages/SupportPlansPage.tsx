import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

const supportPlans = [
  {
    name: 'Sin abono',
    eyebrow: 'La opción por defecto',
    price: '$0',
    suffix: '/ mes',
    pitch: 'La web es tuya. Si más adelante necesitás un cambio, lo cotizamos cuando aparezca.',
    features: [
      'Sin cuota mensual obligatoria',
      'No pagás por meses en los que no necesitás nada',
      'Cambios y mejoras se cotizan por separado',
    ],
  },
  {
    name: 'Cuidado',
    eyebrow: 'Para delegar lo cotidiano',
    price: '$35.000',
    suffix: '/ mes',
    pitch: 'Para tener a quién escribirle por cambios chicos sin pedir una cotización cada vez.',
    features: [
      'Hasta 1 hora de cambios chicos por mes',
      'Textos, fotos, precios, links y datos de contacto',
      'Revisión técnica mensual',
      'Soporte prioritario por WhatsApp',
    ],
    recommended: true,
  },
  {
    name: 'Prioridad',
    eyebrow: 'Para una web que trabaja todos los días',
    price: '$60.000',
    suffix: '/ mes',
    pitch: 'Para negocios que hacen cambios seguido y quieren tener prioridad cuando algo necesita atención.',
    features: [
      'Todo lo de Cuidado',
      'Hasta 2 horas de cambios chicos por mes',
      'Prioridad ante incidentes técnicos',
      'Chequeo de formularios, pedidos y pagos',
    ],
  },
];

export default function SupportPlansPage() {
  useEffect(() => {
    document.title = 'Soporte y cambios — Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Soporte opcional para tu web Gatrivi.com. Sin abono obligatorio o planes mensuales para delegar cambios y mantenimiento.',
      );
  }, []);

  const contactHref = buildSalesContactHref('soporte — quiero consultar por mantenimiento y cambios');

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/precios" className="inline-flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={16} />
            Planes principales
          </Link>
          <a
            href={contactHref}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
          >
            Consultar
            <MessageCircle size={16} />
          </a>
        </div>
      </header>

      <main>
        <section className="border-b border-black/10 bg-black py-16 text-white sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Después de publicar</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-7xl">
              Si querés, nos seguís llamando.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/65 sm:text-xl">
              No necesitás un abono para tener tu web. Estos planes existen sólo si preferís delegar cambios, mantenimiento y urgencias sin volver a empezar de cero cada vez.
            </p>
          </div>
        </section>

        <section className="border-b border-black/10 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {supportPlans.map(plan => (
                <article
                  key={plan.name}
                  className={`relative flex flex-col rounded-[2rem] border p-6 sm:p-7 ${
                    plan.recommended
                      ? 'border-[#ff6b35] bg-white shadow-xl ring-2 ring-[#ff6b35]/15'
                      : 'border-black/10 bg-white'
                  }`}
                >
                  {plan.recommended && (
                    <span className="absolute right-5 top-5 rounded-full bg-[#ff6b35] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.12em] text-white">
                      Más simple
                    </span>
                  )}
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">{plan.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">{plan.name}</h2>
                  <div className="mt-5 flex items-baseline gap-2 border-y border-black/10 py-5">
                    <span className="text-4xl font-black tracking-[-0.05em]">{plan.price}</span>
                    <span className="text-sm font-bold text-black/40">{plan.suffix}</span>
                  </div>
                  <p className="mt-5 min-h-20 text-sm font-medium leading-relaxed text-black/55">{plan.pitch}</p>
                  <ul className="mt-5 flex-1 space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex gap-3 text-sm font-bold leading-snug text-black/70">
                        <Check size={17} className="mt-0.5 shrink-0 text-[#d84d1d]" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.name !== 'Sin abono' && (
                    <a
                      href={buildSalesContactHref(`soporte — me interesa ${plan.name}`)}
                      className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black ${
                        plan.recommended ? 'bg-[#ff6b35] text-white' : 'bg-black text-white'
                      }`}
                    >
                      Consultar {plan.name}
                      <ArrowRight size={16} />
                    </a>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">La idea</p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Pagás por disponibilidad, no por existir.</h2>
                <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-black/55">
                  El abono tiene sentido cuando querés que conozcamos tu sitio y podamos entrar rápido a resolver cambios habituales. Si no necesitás esa continuidad, no hace falta contratarlo.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-black/10 bg-[#f5f2eb] p-5">
                  <Clock3 size={22} className="text-[#d84d1d]" />
                  <p className="mt-4 text-sm font-black">Prioridad</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/55">Tu pedido entra antes que un trabajo nuevo sin abono.</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/10 bg-[#f5f2eb] p-5">
                  <Wrench size={22} className="text-[#d84d1d]" />
                  <p className="mt-4 text-sm font-black">Cambios chicos</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/55">Contenido y ajustes cotidianos dentro del tiempo incluido.</p>
                </div>
                <div className="rounded-[1.5rem] border border-black/10 bg-[#f5f2eb] p-5">
                  <ShieldCheck size={22} className="text-[#d84d1d]" />
                  <p className="mt-4 text-sm font-black">Continuidad</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-black/55">Ya conocemos tu instalación cuando aparece un problema.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#171717] py-14 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_.85fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Regla simple</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em]">No convierte todo en “incluido”.</h2>
              <div className="mt-6 space-y-3 text-sm font-bold leading-relaxed text-white/70">
                <p>Las horas cubren ajustes chicos sobre lo que ya existe.</p>
                <p>Rediseños, páginas nuevas, integraciones o features nuevas se cotizan aparte.</p>
                <p>El tiempo no usado no se acumula: lo que comprás es disponibilidad y prioridad durante ese mes.</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#ff6b35] p-7 sm:p-9">
              <p className="text-sm font-black uppercase tracking-[0.13em] text-white/70">¿No sabés si lo necesitás?</p>
              <p className="mt-4 text-3xl font-black tracking-[-0.045em]">Empezá sin abono.</p>
              <p className="mt-4 text-sm font-bold leading-relaxed text-white/80">
                Si empezás a pedir cambios seguido, pasamos a Cuidado. No hace falta decidirlo al comprar la web.
              </p>
              <Link
                to="/precios"
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
              >
                Volver a los planes
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
