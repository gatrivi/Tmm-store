import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

const plans = [
  {
    name: 'Básico',
    eyebrow: 'Catálogo online',
    full: '$400.000',
    monthly: '12 × $35.000',
    pitch: 'Para mostrar bien lo que vendés y recibir consultas sin depender de mandar fotos una por una.',
    features: [
      'Catálogo con fotos, precios y categorías',
      'Ficha individual de producto',
      'Contacto directo por WhatsApp',
      'Diseño adaptado a celular',
      'Link y QR para compartir',
      'Carga inicial de productos',
      'Dominio por 1 año',
    ],
  },
  {
    name: 'Estándar',
    eyebrow: 'Tienda con pedidos',
    full: '$650.000',
    monthly: '12 × $60.000',
    promo: '$325.000',
    recommended: true,
    pitch: 'Para que el cliente arme el pedido solo y a vos te llegue claro, con total y forma de pago.',
    features: [
      'Todo lo del Básico',
      'Carrito con total automático',
      'Pedido ordenado por WhatsApp',
      'Pago por alias / transferencia',
      'Envío de comprobante',
      'Panel simple para productos',
      'Hasta 300 productos en la carga inicial',
    ],
  },
  {
    name: 'Premium',
    eyebrow: 'Comercio completo',
    full: '$1.200.000',
    monthly: '12 × $110.000',
    pitch: 'Para negocios que además quieren cobrar online y ordenar la operación desde la misma herramienta.',
    features: [
      'Todo lo del Estándar',
      'Mercado Pago integrado',
      'Gestor de pedidos',
      'Reseñas de clientes',
      'Asistente de IA para consultas frecuentes',
      'Automatizaciones comerciales básicas',
      'Preparado para sumar integraciones',
    ],
  },
];

const paymentModes = [
  {
    title: 'Pago completo',
    icon: CreditCard,
    summary: 'Pagás la implementación una vez.',
    details: [
      'Es la opción más económica en total.',
      'Incluye puesta en marcha y dominio por el primer año.',
      'No cobramos porcentaje sobre tus ventas.',
      'El Estándar tiene hoy promo de lanzamiento: $650.000 → $325.000.',
    ],
  },
  {
    title: 'Modalidad mensual',
    icon: Sparkles,
    summary: 'Menor desembolso inicial, con compromiso de 12 meses.',
    details: [
      'Básico: 12 × $35.000.',
      'Estándar: 12 × $60.000.',
      'Premium: 12 × $110.000.',
      'No son cuotas sin interés: es una modalidad de servicio durante 12 meses.',
    ],
  },
];

export default function PricingPage() {
  const contactHref = buildSalesContactHref('pricing — quiero elegir plan y forma de pago');

  useEffect(() => {
    document.title = 'Planes y formas de pago — Gatrivi.com';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Compará los planes Básico, Estándar y Premium de Gatrivi.com y elegí pago completo o modalidad mensual.',
      );
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f2eb]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={16} />
            GATRIVI.COM
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
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Planes y formas de pago</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl">
              Elegí cuánto necesitás.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/65 sm:text-xl">
              Los tres planes te ponen online. La diferencia es cuánto del proceso de venta querés resolver automáticamente.
            </p>
          </div>
        </section>

        <section className="border-b border-black/10 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-4 lg:grid-cols-3">
              {plans.map(plan => (
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
                      Recomendado
                    </span>
                  )}

                  <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">{plan.eyebrow}</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.045em]">{plan.name}</h2>
                  <p className="mt-4 min-h-20 text-sm font-medium leading-relaxed text-black/55">{plan.pitch}</p>

                  <div className="mt-6 border-y border-black/10 py-5">
                    {plan.promo ? (
                      <>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-[#d84d1d]">Promo lanzamiento · pago completo</p>
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="text-4xl font-black tracking-[-0.05em]">{plan.promo}</span>
                          <s className="text-sm font-bold text-black/35">{plan.full}</s>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-black uppercase tracking-[0.12em] text-black/40">Pago completo</p>
                        <p className="mt-2 text-4xl font-black tracking-[-0.05em]">{plan.full}</p>
                      </>
                    )}
                    <p className="mt-4 text-sm font-black text-black/70">o {plan.monthly}</p>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex gap-3 text-sm font-bold leading-snug text-black/70">
                        <Check size={17} className="mt-0.5 shrink-0 text-[#d84d1d]" strokeWidth={3} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={buildSalesContactHref(`pricing — me interesa el plan ${plan.name}`)}
                    className={`mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-black ${
                      plan.recommended ? 'bg-[#ff6b35] text-white' : 'bg-black text-white'
                    }`}
                  >
                    Consultar {plan.name}
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-white py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Cómo se paga</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em] sm:text-5xl">Dos caminos. Nada escondido.</h2>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2">
              {paymentModes.map(mode => {
                const Icon = mode.icon;
                return (
                  <article key={mode.title} className="rounded-[2rem] border border-black/10 bg-[#f5f2eb] p-6 sm:p-8">
                    <Icon size={24} className="text-[#d84d1d]" />
                    <h3 className="mt-5 text-2xl font-black tracking-[-0.035em]">{mode.title}</h3>
                    <p className="mt-2 font-bold text-black/55">{mode.summary}</p>
                    <ul className="mt-6 space-y-3">
                      {mode.details.map(detail => (
                        <li key={detail} className="flex gap-3 text-sm font-medium leading-relaxed text-black/65">
                          <Check size={16} className="mt-1 shrink-0" strokeWidth={3} />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#171717] py-14 text-white sm:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff8a5c]">Machete rápido</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.055em]">¿Cuál ofrezco?</h2>
              <div className="mt-7 space-y-4 text-sm font-bold leading-relaxed text-white/70">
                <p><strong className="text-white">Básico:</strong> “Quiero que vean mis productos y me escriban.”</p>
                <p><strong className="text-white">Estándar:</strong> “Quiero que armen el pedido solos y me llegue ordenado.”</p>
                <p><strong className="text-white">Premium:</strong> “Quiero cobrar online y gestionar más del negocio desde el sistema.”</p>
              </div>
            </div>

            <div className="rounded-[2rem] bg-[#ff6b35] p-7 sm:p-9">
              <p className="text-sm font-black uppercase tracking-[0.13em] text-white/70">Si no sabés cuál</p>
              <p className="mt-4 text-3xl font-black tracking-[-0.045em]">Empezá por Estándar.</p>
              <p className="mt-4 text-sm font-bold leading-relaxed text-white/75">
                Es el punto donde la web deja de ser sólo una vidriera y empieza a sacarte trabajo repetitivo de encima.
              </p>
              <a
                href={contactHref}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
              >
                Hablar por WhatsApp
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
