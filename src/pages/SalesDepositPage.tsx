import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Copy,
  CreditCard,
  Landmark,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
} from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

const DEPOSIT_AMOUNT = 65000;
const DEPOSIT_LABEL = '$65.000';
const BRUBANK_ALIAS = 'gatrivi';

const plans = [
  { id: 'basic', name: 'Básico', price: '$400.000', note: 'Catálogo online' },
  { id: 'standard', name: 'Estándar', price: '$325.000 promo', note: 'Tienda con pedidos', recommended: true },
  { id: 'premium', name: 'Premium', price: '$1.200.000', note: 'Comercio completo' },
] as const;

type PlanId = (typeof plans)[number]['id'];

function isPlanId(value: string | null): value is PlanId {
  return plans.some(plan => plan.id === value);
}

export default function SalesDepositPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPlan = searchParams.get('plan');
  const [planId, setPlanId] = useState<PlanId>(isPlanId(initialPlan) ? initialPlan : 'standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const plan = useMemo(() => plans.find(item => item.id === planId) ?? plans[1], [planId]);
  const status = searchParams.get('deposit_status');
  const proofHref = buildSalesContactHref(
    `seña comercial — transferí ${DEPOSIT_LABEL} a Brubank alias ${BRUBANK_ALIAS} — plan ${plan.name}`,
  );

  function selectPlan(nextPlan: PlanId) {
    setPlanId(nextPlan);
    const next = new URLSearchParams(searchParams);
    next.set('plan', nextPlan);
    next.delete('deposit_status');
    next.delete('sale_ref');
    setSearchParams(next, { replace: true });
  }

  async function startMercadoPago() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/create-sales-deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId }),
      });
      const data = (await response.json()) as { init_point?: string; error?: string };

      if (!response.ok || !data.init_point) {
        throw new Error(data.error || 'No se pudo abrir Mercado Pago.');
      }

      window.location.assign(data.init_point);
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : 'No se pudo iniciar el pago.');
      setLoading(false);
    }
  }

  async function copyAlias() {
    try {
      await navigator.clipboard.writeText(BRUBANK_ALIAS);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError(`No pude copiar automáticamente. Alias: ${BRUBANK_ALIAS}`);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#171717] selection:bg-[#ff6b35] selection:text-white">
      <header className="border-b border-black/10 bg-[#f5f2eb]">
        <div className="mx-auto flex min-h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/pricing" className="inline-flex items-center gap-2 text-sm font-black">
            <ArrowLeft size={16} />
            Planes
          </Link>
          <span className="font-black tracking-[-0.04em]">GATRIVI.COM</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {status && (
          <div className="mb-7 rounded-2xl border border-black/10 bg-white p-5 text-sm font-bold leading-relaxed">
            {status === 'approved' && 'Volviste de Mercado Pago. Verificamos la acreditación y seguimos con tu proyecto.'}
            {status === 'pending' && 'El pago quedó pendiente en Mercado Pago. Cuando se acredite, seguimos con la reserva.'}
            {status === 'failure' && 'El pago no se completó. Podés intentarlo otra vez o usar transferencia.'}
          </div>
        )}

        <section className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Reserva de implementación</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl">
              Reservá con {DEPOSIT_LABEL}.
            </h1>
            <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-black/60">
              La seña reserva el trabajo y se descuenta íntegramente del importe final acordado para tu plan.
            </p>

            <div className="mt-8 space-y-3 text-sm font-bold text-black/65">
              <p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d84d1d]" /> Elegís el plan ahora; los detalles finos los cerramos después.</p>
              <p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d84d1d]" /> La seña no es un cargo extra: forma parte del precio.</p>
              <p className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[#d84d1d]" /> No cobramos porcentaje sobre las ventas de tu tienda.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-xl sm:p-7">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">1 · Elegí plan</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {plans.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectPlan(item.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    planId === item.id
                      ? 'border-[#ff6b35] bg-[#ff6b35]/10 ring-2 ring-[#ff6b35]/10'
                      : 'border-black/10 hover:border-black/25'
                  }`}
                >
                  <span className="block font-black">{item.name}</span>
                  <span className="mt-1 block text-xs font-bold text-black/45">{item.note}</span>
                  <span className="mt-3 block text-sm font-black">{item.price}</span>
                </button>
              ))}
            </div>

            <div className="my-7 h-px bg-black/10" />

            <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">2 · Pagá la seña</p>
            <div className="mt-4 rounded-2xl bg-[#f5f2eb] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black">Plan {plan.name}</p>
                  <p className="mt-1 text-sm font-bold text-black/45">Seña descontable</p>
                </div>
                <p className="text-2xl font-black tracking-[-0.04em]">{DEPOSIT_LABEL}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={startMercadoPago}
              disabled={loading}
              className="mt-4 inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#009ee3] px-6 text-base font-black text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65"
            >
              {loading ? <LoaderCircle size={19} className="animate-spin" /> : <CreditCard size={19} />}
              {loading ? 'Abriendo Mercado Pago…' : `Pagar con Mercado Pago · ${DEPOSIT_LABEL}`}
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs font-bold text-black/45">
              <ShieldCheck size={14} /> El pago se procesa en el checkout seguro de Mercado Pago.
            </p>

            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}

            <div className="my-7 flex items-center gap-3 text-xs font-black uppercase tracking-[0.12em] text-black/30">
              <span className="h-px flex-1 bg-black/10" />
              o transferencia
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <div className="rounded-2xl border border-black/10 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"><Landmark size={18} /></span>
                <div>
                  <p className="font-black">Brubank</p>
                  <p className="text-xs font-bold text-black/45">Transferencia bancaria · ARS</p>
                </div>
              </div>

              <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-black/35">Alias</p>
              <div className="mt-2 flex items-center gap-2 rounded-xl bg-[#f5f2eb] p-3">
                <code className="flex-1 text-lg font-black">{BRUBANK_ALIAS}</code>
                <button
                  type="button"
                  onClick={copyAlias}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white"
                >
                  <Copy size={14} />
                  {copied ? 'Copiado' : 'Copiar'}
                </button>
              </div>
              <p className="mt-3 text-sm font-medium leading-relaxed text-black/55">
                Transferí {DEPOSIT_LABEL}. Antes de confirmar, verificá en tu banco los datos del destinatario.
              </p>
              <a
                href={proofHref}
                className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-black/15 px-5 text-sm font-black"
              >
                <MessageCircle size={17} />
                Ya transferí · enviar comprobante
              </a>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs font-bold text-black/40">
          Monto de seña: ARS {DEPOSIT_AMOUNT.toLocaleString('es-AR')}. La reserva queda sujeta a verificación de acreditación.
        </p>
      </main>
    </div>
  );
}
