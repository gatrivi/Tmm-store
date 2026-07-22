import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Clock,
  DollarSign,
  MessageCircle,
  Package,
  Printer,
  ShoppingBag,
  Volume2,
  X,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { usePlan } from '../../context/PlanContext';
import {
  subscribeOrders,
  updateOrderStatus,
} from '../../services/orderService';
import type { OrderRecord, OrderStatus } from '../../types/order';
import { ACTIVE_ORDER_STATUSES } from '../../types/order';
import { OrderCard } from '../orders/OrderCard';
import { OrderDetailContent } from '../orders/OrderDetailContent';
import { OrderDesktopPanel, OrderDrawer } from '../orders/OrderDrawer';
import { OrderPrimaryAction } from '../orders/OrderPrimaryAction';
import { printOrderTicket } from '../../utils/printTicket';
import { playNewOrderSound } from '../../utils/sounds';
import {
  openWhatsAppForOrder,
  WHATSAPP_TEMPLATE_LABELS,
  type WhatsAppTemplateId,
} from '../../utils/whatsappTemplates';
import { AdminQuickStock } from './AdminQuickStock';
import { inboxFilterBucket } from '../../utils/orderStateMachine';

const WSP_TEMPLATES: WhatsAppTemplateId[] = ['received', 'preparing', 'ready'];

type Filter = 'active' | 'new' | 'preparing' | 'ready' | 'done' | 'all';

export function AdminOrders() {
  const { tenantId } = usePlan();
  const { siteSettings } = useMenu();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<Filter>('active');
  const [selected, setSelected] = useState<OrderRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const knownOrderIds = useRef<Set<string>>(new Set());
  const initialLoadDone = useRef(false);

  useEffect(() => {
    return subscribeOrders(tenantId, next => {
      if (initialLoadDone.current) {
        const newOrders = next.filter(
          o => o.status === 'new' && !knownOrderIds.current.has(o.id),
        );
        if (newOrders.length > 0) {
          if (siteSettings.orderSoundEnabled) {
            playNewOrderSound();
          }
          if (siteSettings.autoPrintOnNewOrder) {
            printOrderTicket(newOrders[0]);
          }
        }
      } else {
        initialLoadDone.current = true;
      }
      knownOrderIds.current = new Set(next.map(o => o.id));
      setOrders(next);
      setSelected(prev => (prev ? next.find(o => o.id === prev.id) ?? prev : prev));
    });
  }, [tenantId, siteSettings.autoPrintOnNewOrder, siteSettings.orderSoundEnabled]);

  const visible = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'active') {
      return orders.filter(o => ACTIVE_ORDER_STATUSES.includes(o.status));
    }
    return orders.filter(o => inboxFilterBucket(o.status) === filter);
  }, [filter, orders]);

  const todayStats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(
      o =>
        new Date(o.createdAt) >= start &&
        o.status !== 'rejected' &&
        o.status !== 'cancelled' &&
        o.paymentStatus === 'approved',
    );
    return {
      count: orders.filter(o => new Date(o.createdAt) >= start).length,
      revenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders]);

  const handleStatus = async (order: OrderRecord, status: OrderStatus) => {
    setSaving(true);
    try {
      await updateOrderStatus(tenantId, order.id, status);
      setSelected(prev => (prev?.id === order.id ? { ...prev, status } : prev));
    } finally {
      setSaving(false);
    }
  };

  const secondaryActions = selected ? (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
          Abrir WhatsApp
        </p>
        <div className="flex flex-wrap gap-2">
          {WSP_TEMPLATES.map(templateId => (
            <button
              key={templateId}
              type="button"
              disabled={!selected.customerPhone.replace(/\D/g, '')}
              onClick={() => {
                openWhatsAppForOrder(
                  selected.customerPhone.replace(/\D/g, ''),
                  selected,
                  templateId,
                );
              }}
              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-green-600/80 px-3 py-2 text-xs font-bold text-white hover:bg-green-600 disabled:opacity-40"
            >
              <MessageCircle size={14} />
              {WHATSAPP_TEMPLATE_LABELS[templateId]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {selected.status === 'new' && (
          <button
            type="button"
            onClick={() => handleStatus(selected, 'rejected')}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600/80 px-4 py-2 text-xs font-bold text-white"
          >
            <X size={14} /> Rechazar
          </button>
        )}
        {(selected.status === 'preparing' || selected.status === 'ready') && (
          <button
            type="button"
            onClick={() => handleStatus(selected, 'cancelled')}
            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-red-600/80 px-4 py-2 text-xs font-bold text-white"
          >
            <X size={14} /> Cancelar
          </button>
        )}
        <button
          type="button"
          onClick={() => printOrderTicket(selected)}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white"
        >
          <Printer size={14} /> Ticket 58mm
        </button>
        <button
          type="button"
          onClick={() => playNewOrderSound()}
          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs font-bold text-gray-400"
          title="Probar sonido de pedido nuevo"
        >
          <Volume2 size={14} />
        </button>
      </div>
      <a
        href={`/order/${selected.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-white"
      >
        <Clock size={12} /> Link de estado para el cliente
      </a>
    </div>
  ) : null;

  const detailBody = selected ? (
    <OrderDetailContent
      order={selected}
      tone="dark"
      extraActions={secondaryActions}
    />
  ) : null;

  const primary = selected ? (
    <OrderPrimaryAction
      status={selected.status}
      fulfillment={selected.deliveryType}
      loading={saving}
      onAdvance={next => handleStatus(selected, next)}
      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-black text-white disabled:opacity-50"
    />
  ) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Pedidos</h2>
          <p className="mt-1 text-sm text-gray-500">Bandeja · una acción primaria · WSP</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {([
            ['active', 'Activos'],
            ['new', 'Nuevos'],
            ['preparing', 'Preparando'],
            ['ready', 'Listos'],
            ['done', 'Finalizados'],
            ['all', 'Todos'],
          ] as const).map(([f, label]) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                filter === f ? 'bg-brand-green text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-brand-green/20 bg-brand-green/10 p-4">
          <ShoppingBag size={22} className="shrink-0 text-brand-green" />
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Pedidos hoy</p>
            <p className="text-2xl font-black text-white">{todayStats.count}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <DollarSign size={22} className="shrink-0 text-green-400" />
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-500">Cobrado hoy</p>
            <p className="text-2xl font-black text-green-400">
              ${todayStats.revenue.toLocaleString('es-AR')}
            </p>
          </div>
        </div>
      </div>

      <AdminQuickStock />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="max-h-[70vh] space-y-3 overflow-y-auto hide-scrollbar">
          {visible.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-white/3 p-8 text-center text-gray-500">
              <Package size={32} className="mx-auto mb-3 opacity-50" />
              No hay pedidos {filter === 'active' ? 'activos' : ''}
            </div>
          ) : (
            visible.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                tone="dark"
                selected={selected?.id === order.id}
                onSelect={setSelected}
              />
            ))
          )}
        </div>

        <OrderDesktopPanel
          open={Boolean(selected)}
          tone="dark"
          empty="Seleccioná un pedido para ver detalle"
        >
          {selected && (
            <>
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="font-black text-white">#{selected.id}</h3>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-gray-500 hover:text-white"
                  aria-label="Cerrar"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">{detailBody}</div>
              {primary && <div className="border-t border-white/10 p-4">{primary}</div>}
            </>
          )}
        </OrderDesktopPanel>
      </div>

      <OrderDrawer
        open={Boolean(selected)}
        title={selected ? `#${selected.id}` : ''}
        onClose={() => setSelected(null)}
        tone="dark"
        footer={primary}
      >
        {detailBody}
      </OrderDrawer>
    </div>
  );
}
