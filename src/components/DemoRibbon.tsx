import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Store, UserRound } from 'lucide-react';
import { buildSalesContactHref, hasSalesWhatsApp } from '../utils/salesContact';
import { resolveDemoFromPath, resolveDemoPaths } from '../utils/demoRegistry';
import type { Plan } from '../config/plans';
import { useOptionalPlan } from '../context/PlanContext';

const PLAN_OPTIONS: Array<{ plan: Plan; label: string; hint: string }> = [
  { plan: 'menu', label: 'Catálogo', hint: 'Solo carta con consulta por WhatsApp' },
  { plan: 'pedidos', label: 'Tienda WSP', hint: 'Carrito y pedido ordenado por WhatsApp' },
  { plan: 'premium', label: 'Tienda MP', hint: 'Carrito con Mercado Pago / transferencia' },
];

/** Plan preview pills, rendered inside the ribbon row (nothing outside demos). */
function PlanSwitchInline() {
  const ctx = useOptionalPlan();
  if (!ctx?.setDemoPlanOverride) return null;

  const { plan } = ctx;
  return (
    <div className="flex shrink-0 items-center gap-2">
      <span className="hidden text-[10px] font-black uppercase tracking-[0.14em] text-white/45 lg:inline">
        Vista demo
      </span>
      <div className="flex rounded-full bg-white/10 p-0.5">
        {PLAN_OPTIONS.map(opt => {
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
  );
}

export function DemoRibbon() {
  const location = useLocation();
  const paths = resolveDemoPaths(location.pathname);
  const vertical = resolveDemoFromPath(location.pathname);
  const ownerActive = location.pathname === paths.ownerPath;
  const demoSearch = vertical ? '' : location.search;
  const prospectName = new URLSearchParams(demoSearch).get('negocio');
  const salesSource = prospectName
    ? `demo para ${prospectName}`
    : vertical?.id === 'carniceria'
      ? 'demo carnicería'
      : vertical
        ? `demo ${vertical.siteSettings.brandName ?? vertical.id}`
        : 'demo';
  const theme = vertical?.theme;
  const ctaLabel = hasSalesWhatsApp() ? (
    <>
      <span className="hidden sm:inline">Quiero esto</span>
      <span className="sm:hidden">Lo quiero</span>
    </>
  ) : (
    <>
      <span className="hidden sm:inline">Pedí tu demo</span>
      <span className="sm:hidden">Demo</span>
    </>
  );

  return (
    <div
      className="relative z-40 border-b text-white"
      style={{
        backgroundColor: theme?.carbon ?? '#151612',
        borderColor: 'rgba(255,255,255,0.1)',
      }}
    >
      <div className="mx-auto flex min-h-12 max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-3 py-1 sm:px-6">
        <a
          href="https://gatrivi.com/"
          className="flex shrink-0 items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/75 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver a Gatrivi.com</span>
          <span className="sm:hidden">Gatrivi</span>
        </a>

        {vertical?.copy.ribbonLabel && (
          <span
            className="order-last w-full rounded-full px-2.5 py-1 text-center text-[10px] font-black uppercase tracking-[0.12em] sm:order-none sm:w-auto"
            style={{ backgroundColor: theme?.bordo ?? '#ee6847', color: theme?.hueso ?? '#fff' }}
          >
            {vertical.copy.ribbonLabel}
          </span>
        )}

        <PlanSwitchInline />

        <div className="flex shrink-0 rounded-full bg-white/8 p-1 text-xs font-bold">
          <Link
            to={`${paths.customerPath}${demoSearch}`}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3 transition ${
              !ownerActive ? 'bg-white text-[#151612]' : 'text-white/65 hover:text-white'
            }`}
          >
            <UserRound size={14} />
            Cliente
          </Link>
          <Link
            to={`${paths.ownerPath}${demoSearch}`}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3 transition ${
              ownerActive ? 'bg-white text-[#151612]' : 'text-white/65 hover:text-white'
            }`}
          >
            <Store size={14} />
            Local
          </Link>
        </div>

        <a
          href={buildSalesContactHref(salesSource)}
          className="shrink-0 rounded-full px-3 py-2 text-xs font-black transition sm:px-4"
          style={{
            backgroundColor: theme?.hueso ?? '#d7ff64',
            color: theme?.carbon ?? '#151612',
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}
