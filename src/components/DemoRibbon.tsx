import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Store, UserRound } from 'lucide-react';
import { buildSalesContactHref } from '../utils/salesContact';

export function DemoRibbon() {
  const location = useLocation();
  const ownerActive = location.pathname === '/demo/owner';
  const demoSearch = location.search;
  const prospectName = new URLSearchParams(demoSearch).get('negocio');

  return (
    <div className="relative z-40 border-b border-white/10 bg-[#151612] text-white">
      <div className="mx-auto flex min-h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-white/75 transition hover:text-white"
        >
          <ArrowLeft size={15} />
          <span className="hidden sm:inline">Volver a Trufi</span>
          <span className="sm:hidden">Trufi</span>
        </Link>

        <div className="flex rounded-full bg-white/8 p-1 text-xs font-bold">
          <Link
            to={`/demo${demoSearch}`}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3 transition ${
              !ownerActive ? 'bg-white text-[#151612]' : 'text-white/65 hover:text-white'
            }`}
          >
            <UserRound size={14} />
            Cliente
          </Link>
          <Link
            to={`/demo/owner${demoSearch}`}
            className={`flex min-h-9 items-center gap-1.5 rounded-full px-3 transition ${
              ownerActive ? 'bg-white text-[#151612]' : 'text-white/65 hover:text-white'
            }`}
          >
            <Store size={14} />
            Local
          </Link>
        </div>

        <a
          href={buildSalesContactHref(prospectName ? `demo para ${prospectName}` : 'demo')}
          className="rounded-full bg-[#d7ff64] px-3 py-2 text-xs font-black text-[#151612] transition hover:bg-white sm:px-4"
        >
          <span className="hidden sm:inline">Quiero esto</span>
          <span className="sm:hidden">Lo quiero</span>
        </a>
      </div>
    </div>
  );
}
