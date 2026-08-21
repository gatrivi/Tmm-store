import type { Plan } from '../config/plans';
import { usePlan } from '../context/PlanContext';

const OPTIONS: Array<{ plan: Plan; label: string; hint: string }> = [
  { plan: 'menu', label: 'Catálogo', hint: 'Solo carta con consulta por WhatsApp' },
  { plan: 'pedidos', label: 'Tienda WSP', hint: 'Carrito y pedido ordenado por WhatsApp' },
  { plan: 'premium', label: 'Tienda MP', hint: 'Carrito con Mercado Pago / transferencia' },
];

/**
 * Sales preview switch for demos: re-gates the page as catálogo / tienda WSP / tienda MP.
 * Renders nothing outside demos (setDemoPlanOverride is only defined there).
 */
export function DemoPlanSwitch() {
  const { plan, setDemoPlanOverride } = usePlan();
  if (!setDemoPlanOverride) return null;

  return (
    <div className="relative z-40 border-b border-white/10 bg-[#151612] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-3 py-1.5">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-white/45">
          Vista demo
        </span>
        <div className="flex rounded-full bg-white/10 p-0.5">
          {OPTIONS.map(opt => {
            const active = plan === opt.plan;
            return (
              <button
                key={opt.plan}
                type="button"
                title={opt.hint}
                onClick={() => setDemoPlanOverride(opt.plan)}
                className={`min-h-7 rounded-full px-2.5 text-[11px] font-black transition ${
                  active ? 'bg-[#d7ff64] text-[#151612]' : 'text-white/60 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
