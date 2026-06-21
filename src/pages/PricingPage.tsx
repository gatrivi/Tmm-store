import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { PLAN_LABELS, PLAN_PRICES_ARS, type Plan } from '../config/plans';

const PLANS: Plan[] = ['menu', 'pedidos', 'premium'];

const FEATURES: Record<Plan, string[]> = {
  menu: [
    'Carta digital multi-idioma',
    'QR y link para compartir',
    'Branding personalizado',
    'Horarios de atención',
    'Contacto por WhatsApp',
  ],
  pedidos: [
    'Todo lo de Menu',
    'Carrito y checkout',
    'Pedidos por WhatsApp organizados',
    'Bandeja de pedidos en admin',
    'MercadoPago + transferencia',
    'Promociones y reportes',
  ],
  premium: [
    'Todo lo de Pedidos',
    'Asistente IA en la tienda',
    'Recomendaciones inteligentes',
    'Pedido conversacional',
    'FAQ automatizado en hora pico',
  ],
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between">
        <Link to="/" className="text-xl font-black tracking-tight">Trufi</Link>
        <Link to="/admin" className="text-sm text-gray-400 hover:text-white">Admin</Link>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">Elegí tu plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tres productos, un solo ecosistema. Sin comisiones por pedido. Armado sin cargo incluido.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(plan => (
            <div
              key={plan}
              className={`rounded-3xl border p-6 flex flex-col ${
                plan === 'premium'
                  ? 'border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent'
                  : 'border-white/10 bg-white/3'
              }`}
            >
              <div className="mb-4">
                {plan === 'premium' && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-violet-300 mb-2">
                    <Sparkles size={12} /> Más vendido
                  </span>
                )}
                <h2 className="text-2xl font-black">{PLAN_LABELS[plan]}</h2>
                <p className="text-3xl font-black mt-2 text-green-400">
                  ${PLAN_PRICES_ARS[plan].toLocaleString('es-AR')}
                  <span className="text-sm text-gray-500 font-bold">/mes</span>
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-6">
                {FEATURES[plan].map(feature => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:hola@trufi.app?subject=Plan%20${PLAN_LABELS[plan]}`}
                className={`block text-center py-3 rounded-xl font-bold transition ${
                  plan === 'premium'
                    ? 'bg-violet-600 hover:bg-violet-500 text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Solicitar demo
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          ¿Ya sos cliente? Configurá <code className="text-gray-400">VITE_PLAN=menu|pedidos|premium</code> en tu deploy.
        </p>
      </main>
    </div>
  );
}
