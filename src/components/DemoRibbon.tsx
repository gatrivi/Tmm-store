import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Store, UserRound } from 'lucide-react';
import { buildSalesContactHref, hasSalesWhatsApp } from '../utils/salesContact';
import { resolveDemoFromPath, resolveDemoPaths } from '../utils/demoRegistry';

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
      {vertical?.copy.ribbonLabel && (
        <p
          className="px-3 py-1.5 text-center text-[10px] font-black uppercase tracking-[0.14em]"
          style={{ backgroundColor: theme?.bordo ?? '#ee6847', color: theme?.hueso ?? '#fff' }}
        >
          {vertical.copy.ribbonLabel}
        </p>
      )}
      <div className="mx-auto flex min-h-12 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/75 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver a Gatrivi.com</span>
          <span className="sm:hidden">Gatrivi</span>
        </Link>

        <div className="flex rounded-full bg-white/8 p-1 text-xs font-bold">
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
          className="rounded-full px-3 py-2 text-xs font-black transition sm:px-4"
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
