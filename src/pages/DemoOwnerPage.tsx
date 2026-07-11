import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChefHat,
  Clock3,
  MessageCircle,
  PackageCheck,
  Printer,
  Search,
  ShoppingBag,
  Store,
  TrendingUp,
  Truck,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { DemoRibbon } from '../components/DemoRibbon';
import { buildSalesContactHref } from '../utils/salesContact';
import { parseProspectDemo } from '../utils/prospectDemo';

type DemoStatus = 'nuevo' | 'preparando' | 'listo';

interface DemoOrder {
  id: string;
  customer: string;
  initials: string;
  time: string;
  items: string;
  fulfillment: 'Retiro' | 'Delivery';
  payment: string;
  total: number;
  status: DemoStatus;
}

const INITIAL_ORDERS: DemoOrder[] = [
  {
    id: 'K7P4',
    customer: 'Lucía M.',
    initials: 'LM',
    time: '20:41',
    items: '1× Burger completa · 1× Papas',
    fulfillment: 'Retiro',
    payment: 'Transferencia',
    total: 23500,
    status: 'nuevo',
  },
  {
    id: 'R2N8',
    customer: 'Martín R.',
    initials: 'MR',
    time: '20:35',
    items: '2× Choripán combo · sin cebolla',
    fulfillment: 'Delivery',
    payment: 'Efectivo',
    total: 29000,
    status: 'preparando',
  },
  {
    id: 'B9F3',
    customer: 'Ana P.',
    initials: 'AP',
    time: '20:22',
    items: '1× Bondiola completa · 2× Bebida',
    fulfillment: 'Retiro',
    payment: 'Mercado Pago',
    total: 21000,
    status: 'listo',
  },
];

const STATUS_META: Record<DemoStatus, { label: string; className: string }> = {
  nuevo: {
    label: 'Nuevo',
    className: 'bg-[#fff1cd] text-[#8c5a00]',
  },
  preparando: {
    label: 'Preparando',
    className: 'bg-[#e8e6ff] text-[#5148a8]',
  },
  listo: {
    label: 'Listo',
    className: 'bg-[#dff7e9] text-[#197443]',
  },
};

function nextStatus(status: DemoStatus): DemoStatus {
  if (status === 'nuevo') return 'preparando';
  if (status === 'preparando') return 'listo';
  return 'listo';
}

function nextAction(status: DemoStatus): string {
  if (status === 'nuevo') return 'Aceptar pedido';
  if (status === 'preparando') return 'Marcar listo';
  return 'Listo para entregar';
}

export default function DemoOwnerPage() {
  const location = useLocation();
  const prospect = parseProspectDemo(location.search);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [filter, setFilter] = useState<'todos' | DemoStatus>('todos');
  const contactHref = buildSalesContactHref(`demo panel de ${prospect.businessName}`);

  useEffect(() => {
    document.title = `${prospect.businessName} — Demo del local`;
  }, [prospect.businessName]);

  const visibleOrders = useMemo(
    () => filter === 'todos' ? orders : orders.filter(order => order.status === filter),
    [filter, orders],
  );

  const advanceOrder = (id: string) => {
    setOrders(current => current.map(order => (
      order.id === id ? { ...order, status: nextStatus(order.status) } : order
    )));
  };

  return (
    <div className="min-h-screen bg-[#f4f5f1] text-[#151612]">
      <DemoRibbon />

      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#151612] text-[#d7ff64]">
              <ChefHat size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">Panel del local · demo</p>
              <h1 className="text-lg font-black tracking-[-0.025em]">{prospect.businessName}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-[#e5f7e9] px-3 py-2 text-xs font-black text-[#197443] sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2eb36c]" />
              Recibiendo pedidos
            </span>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white" aria-hidden="true">
              <Bell size={17} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ee6847]" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ee6847]">Viernes · turno noche</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Buenas noches, equipo.</h2>
            <p className="mt-2 text-sm font-medium text-black/50">Datos de ejemplo. Podés cambiar el estado de los pedidos.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="flex min-h-11 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-black shadow-sm"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Imprimir resumen</span>
              <span className="sm:hidden">Imprimir</span>
            </button>
            <Link to={`/demo${location.search}`} className="flex min-h-11 items-center gap-2 rounded-xl bg-[#151612] px-4 text-sm font-black text-white">
              <Store size={16} />
              Ver tienda
            </Link>
          </div>
        </div>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Pedidos hoy', value: '18', note: '+4 vs. viernes pasado', icon: ShoppingBag, accent: 'bg-[#d7ff64]' },
            { label: 'Facturación', value: '$462.500', note: '16 pedidos cobrados', icon: WalletCards, accent: 'bg-[#ffd8cc]' },
            { label: 'Ticket medio', value: '$25.694', note: '+8,4% esta semana', icon: TrendingUp, accent: 'bg-[#dfe2ff]' },
            { label: 'Tiempo medio', value: '24 min', note: 'Dentro del objetivo', icon: Clock3, accent: 'bg-[#dff7e9]' },
          ].map(card => (
            <article key={card.label} className="rounded-2xl border border-black/8 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-black/40">{card.label}</p>
                  <p className="mt-2 text-2xl font-black tracking-[-0.035em]">{card.value}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.accent}`}>
                  <card.icon size={18} />
                </div>
              </div>
              <p className="mt-4 text-xs font-bold text-black/45">{card.note}</p>
            </article>
          ))}
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_330px]">
          <section className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/8 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-xl font-black tracking-[-0.03em]">Pedidos activos</h3>
                <p className="mt-1 text-sm text-black/45">La misma información, siempre en el mismo lugar.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  ['todos', 'Todos'],
                  ['nuevo', 'Nuevos'],
                  ['preparando', 'Preparando'],
                  ['listo', 'Listos'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value as typeof filter)}
                    className={`min-h-9 rounded-full px-3 text-xs font-black transition ${
                      filter === value ? 'bg-[#151612] text-white' : 'bg-[#f1f2ee] text-black/55 hover:text-black'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-black/8">
              {visibleOrders.map(order => {
                const status = STATUS_META[order.status];
                return (
                  <article key={order.id} className="p-5 transition hover:bg-[#fafaf7] sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf0e9] text-xs font-black">
                          {order.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-black">#{order.id} · {order.customer}</p>
                            <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] ${status.className}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm font-medium text-black/55">{order.items}</p>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-black/42">
                            <span className="flex items-center gap-1.5"><Clock3 size={13} /> {order.time}</span>
                            <span className="flex items-center gap-1.5">
                              {order.fulfillment === 'Delivery' ? <Truck size={13} /> : <PackageCheck size={13} />}
                              {order.fulfillment}
                            </span>
                            <span className="flex items-center gap-1.5"><WalletCards size={13} /> {order.payment}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-black/8 pt-4 lg:border-0 lg:pt-0">
                        <p className="min-w-24 text-right text-lg font-black">${order.total.toLocaleString('es-AR')}</p>
                        <button
                          onClick={() => advanceOrder(order.id)}
                          disabled={order.status === 'listo'}
                          className="min-h-11 min-w-36 rounded-xl bg-[#151612] px-4 text-xs font-black text-white transition hover:bg-[#ee6847] disabled:bg-[#edf0e9] disabled:text-black/35"
                        >
                          {order.status === 'listo' && <Check size={14} className="mr-1 inline" />}
                          {nextAction(order.status)}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}

              {visibleOrders.length === 0 && (
                <div className="p-12 text-center">
                  <Search className="mx-auto text-black/20" />
                  <p className="mt-3 font-black">No hay pedidos en este estado.</p>
                  <button onClick={() => setFilter('todos')} className="mt-2 text-sm font-bold text-[#ee6847]">Ver todos</button>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <section className="rounded-3xl bg-[#151612] p-6 text-white shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.13em] text-[#d7ff64]">Qué cambia</p>
              <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">Del mensaje al trabajo.</h3>
              <ul className="mt-6 space-y-4">
                {[
                  ['Cliente identificado', UserRound],
                  ['Entrega definida', Truck],
                  ['Pago visible', WalletCards],
                  ['Estado compartible', MessageCircle],
                ].map(([label, Icon]) => {
                  const ItemIcon = Icon as typeof UserRound;
                  return (
                    <li key={label as string} className="flex items-center gap-3 text-sm font-bold text-white/72">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-[#d7ff64]">
                        <ItemIcon size={16} />
                      </span>
                      {label as string}
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[#ee6847]">
                <BarChart3 size={18} />
                <p className="text-xs font-black uppercase tracking-[0.12em]">Siguiente paso</p>
              </div>
              <h3 className="mt-4 text-xl font-black tracking-[-0.035em]">Verlo con tu menú.</h3>
              <p className="mt-2 text-sm leading-relaxed text-black/52">
                Mandanos el material que ya tenés. Armamos una primera muestra con tu marca.
              </p>
              <a
                href={contactHref}
                className="mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#ee6847] px-4 text-sm font-black text-white transition hover:bg-[#151612]"
              >
                Pedir mi demo <ArrowRight size={16} />
              </a>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
