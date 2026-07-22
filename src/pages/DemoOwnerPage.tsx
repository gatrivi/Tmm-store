import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  Bell,
  ChefHat,
  Clock3,
  Search,
  ShoppingBag,
  Store,
  TrendingUp,
  WalletCards,
} from 'lucide-react';
import { DemoRibbon } from '../components/DemoRibbon';
import { OrderCard } from '../components/orders/OrderCard';
import { OrderDetailContent } from '../components/orders/OrderDetailContent';
import { OrderDesktopPanel, OrderDrawer } from '../components/orders/OrderDrawer';
import { OrderPrimaryAction } from '../components/orders/OrderPrimaryAction';
import type { OrderRecord } from '../types/order';
import {
  demoOrderMetrics,
  isProspectDemoOrder,
  subscribeDemoOrders,
  transitionDemoOrder,
} from '../services/demoOrderRepository';
import { buildSalesContactHref } from '../utils/salesContact';
import { parseProspectDemo } from '../utils/prospectDemo';
import {
  assertOrderStateMachine,
  inboxFilterBucket,
} from '../utils/orderStateMachine';
import { resolveDemoFromPath, resolveDemoPaths } from '../utils/demoRegistry';

type Filter = 'todos' | 'new' | 'preparing' | 'ready' | 'done';

export default function DemoOwnerPage() {
  const location = useLocation();
  const vertical = resolveDemoFromPath(location.pathname);
  const paths = resolveDemoPaths(location.pathname);
  const prospect = parseProspectDemo(location.search);
  const businessName = vertical?.siteSettings.brandName || prospect.businessName;
  const ownerTitle = vertical?.copy.ownerTitle || businessName;
  const ownerSubtitle = vertical?.copy.ownerSubtitle || 'Panel del local · demo';
  const totalLabel = vertical?.copy.totalLabel || 'Total';
  const revenueLabel = vertical?.copy.revenueLabel || 'Total sesión';
  const theme = vertical?.theme;
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<Filter>('todos');
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const autoOpenedRef = useRef(false);
  const contactHref = buildSalesContactHref(`demo panel de ${businessName}`);

  useEffect(() => {
    if (import.meta.env.DEV) assertOrderStateMachine();
  }, []);

  useEffect(() => {
    document.title = `${ownerTitle} — Demo del local`;
  }, [ownerTitle]);

  useEffect(() => {
    return subscribeDemoOrders(next => {
      setOrders(next);
      setSelected(prev => {
        if (prev) return next.find(o => o.id === prev.id) ?? prev;
        return prev;
      });
      if (!autoOpenedRef.current) {
        const prospectOrder = next.find(o => isProspectDemoOrder(o.id));
        if (prospectOrder) {
          autoOpenedRef.current = true;
          setSelected(prospectOrder);
        }
      }
    });
  }, []);

  const visibleOrders = useMemo(() => {
    if (filter === 'todos') return orders;
    return orders.filter(o => inboxFilterBucket(o.status) === filter);
  }, [filter, orders]);

  const metrics = useMemo(() => demoOrderMetrics(orders), [orders]);

  const counts = useMemo(() => ({
    new: orders.filter(o => inboxFilterBucket(o.status) === 'new').length,
    preparing: orders.filter(o => inboxFilterBucket(o.status) === 'preparing').length,
    ready: orders.filter(o => inboxFilterBucket(o.status) === 'ready').length,
    done: orders.filter(o => inboxFilterBucket(o.status) === 'done').length,
  }), [orders]);

  const handleAdvance = (order: OrderRecord, next: OrderRecord['status']) => {
    setSaving(true);
    const updated = transitionDemoOrder(order.id, next);
    setSaving(false);
    if (updated) setSelected(updated);
  };

  const selectOrder = (order: OrderRecord) => setSelected(order);

  const detail = selected ? (
    <OrderDetailContent
      order={selected}
      tone="light"
      totalLabel={totalLabel === 'Total estimado' ? 'Estimado' : totalLabel}
      totalHint={vertical?.copy.totalHint}
      pickupLabel={vertical?.copy.pickupLabel}
      deliveryLabel={vertical?.copy.deliveryLabel}
      statusLinkHref={paths.orderPath(selected.id)}
    />
  ) : null;

  const primary = selected ? (
    <OrderPrimaryAction
      status={selected.status}
      fulfillment={selected.deliveryType}
      loading={saving}
      onAdvance={next => handleAdvance(selected, next)}
    />
  ) : null;

  return (
    <div
      className="min-h-screen bg-[#f4f5f1] text-[#151612]"
      style={theme ? { backgroundColor: theme.hueso, color: theme.carbon } : undefined}
    >
      <DemoRibbon />

      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#151612] text-[#d7ff64]"
              style={theme ? { backgroundColor: theme.carbon, color: theme.hueso } : undefined}
            >
              <ChefHat size={22} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/40">
                {ownerSubtitle}
              </p>
              <h1 className="text-lg font-black tracking-[-0.025em]">{ownerTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 rounded-full bg-[#e5f7e9] px-3 py-2 text-xs font-black text-[#197443] sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#2eb36c]" />
              Recibiendo pedidos
            </span>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white" aria-hidden="true">
              <Bell size={17} />
              {counts.new > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#ee6847]" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p
              className="text-xs font-black uppercase tracking-[0.14em] text-[#ee6847]"
              style={theme ? { color: theme.bordo } : undefined}
            >
              Demo en vivo
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">Bandeja de pedidos</h2>
            <p className="mt-2 text-sm font-medium text-black/50">
              Pedidos de esta sesión. Tocá uno para ver el detalle.
            </p>
          </div>
          <Link
            to={paths.customerPath}
            className="flex min-h-11 items-center gap-2 rounded-xl bg-[#151612] px-4 text-sm font-black text-white"
            style={theme ? { backgroundColor: theme.carbon } : undefined}
          >
            <Store size={16} />
            Ver tienda
          </Link>
        </div>

        <section className="grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Pedidos', value: String(metrics.count), icon: ShoppingBag, accent: 'bg-[#d7ff64]' },
            { label: revenueLabel, value: `$${metrics.revenue.toLocaleString('es-AR')}`, icon: WalletCards, accent: 'bg-[#ffd8cc]' },
            { label: 'Ticket medio', value: `$${metrics.ticket.toLocaleString('es-AR')}`, icon: TrendingUp, accent: 'bg-[#dfe2ff]' },
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
            </article>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <section className="overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-black/8 p-4 sm:p-5">
              <div>
                <h3 className="text-xl font-black tracking-[-0.03em]">Pedidos</h3>
                <p className="mt-1 text-sm text-black/45">Una acción primaria por estado.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  ['todos', 'Todos', orders.length],
                  ['new', 'Nuevos', counts.new],
                  ['preparing', 'Preparando', counts.preparing],
                  ['ready', 'Listos', counts.ready],
                  ['done', 'Finalizados', counts.done],
                ] as const).map(([value, label, count]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFilter(value)}
                    className={`min-h-9 rounded-full px-3 text-xs font-black transition ${
                      filter === value ? 'bg-[#151612] text-white' : 'bg-[#f1f2ee] text-black/55 hover:text-black'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>
            </div>

            <div>
              {visibleOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  tone="light"
                  selected={selected?.id === order.id}
                  highlight={isProspectDemoOrder(order.id)}
                  highlightLabel={isProspectDemoOrder(order.id) ? 'Tu pedido de prueba' : undefined}
                  onSelect={selectOrder}
                />
              ))}

              {visibleOrders.length === 0 && (
                <div className="p-12 text-center">
                  <Search className="mx-auto text-black/20" />
                  <p className="mt-3 font-black">No hay pedidos en este filtro.</p>
                  <button type="button" onClick={() => setFilter('todos')} className="mt-2 text-sm font-bold text-[#ee6847]">
                    Ver todos
                  </button>
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-5">
            <OrderDesktopPanel
              open={Boolean(selected)}
              tone="light"
              empty={
                <div className="text-center">
                  <Clock3 className="mx-auto mb-2 opacity-40" />
                  Tocá un pedido de la lista
                </div>
              }
            >
              {selected && (
                <>
                  <div className="flex-1 overflow-y-auto p-5">{detail}</div>
                  <div className="border-t border-black/8 p-4">{primary}</div>
                </>
              )}
            </OrderDesktopPanel>

            <section className="rounded-3xl border border-black/8 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-[#ee6847]" style={theme ? { color: theme.bordo } : undefined}>
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
                style={theme ? { backgroundColor: theme.bordo } : undefined}
              >
                Pedir mi demo <ArrowRight size={16} />
              </a>
            </section>
          </aside>
        </div>
      </main>

      <OrderDrawer
        open={Boolean(selected)}
        title={selected ? `#${selected.id}` : ''}
        onClose={() => setSelected(null)}
        tone="light"
        footer={primary}
      >
        {detail}
      </OrderDrawer>
    </div>
  );
}
