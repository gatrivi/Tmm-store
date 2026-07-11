import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  Clock,
  DollarSign,
  MessageCircle,
  Package,
  Printer,
  RefreshCw,
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
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
} from '../../types/order';
import { printOrderTicket } from '../../utils/printTicket';
import { playNewOrderSound } from '../../utils/sounds';
import {
  openWhatsAppForOrder,
  WHATSAPP_TEMPLATE_LABELS,
  type WhatsAppTemplateId,
} from '../../utils/whatsappTemplates';
import { AdminQuickStock } from './AdminQuickStock';

const WSP_TEMPLATES: WhatsAppTemplateId[] = ['received', 'preparing', 'ready'];

const PAYMENT_LABELS: Record<OrderRecord['paymentMethod'], string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  mercadopago: 'MercadoPago',
};

export function AdminOrders() {
  const { tenantId } = usePlan();
  const { siteSettings } = useMenu();
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [selected, setSelected] = useState<OrderRecord | null>(null);
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
    });
  }, [tenantId, siteSettings.autoPrintOnNewOrder, siteSettings.orderSoundEnabled]);

  const activeStatuses: OrderStatus[] = ['new', 'accepted', 'preparing', 'ready'];
  const visible = filter === 'active'
    ? orders.filter(o => activeStatuses.includes(o.status))
    : orders;

  const todayStats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todayOrders = orders.filter(o => new Date(o.createdAt) >= start);
    return {
      count: todayOrders.length,
      revenue: todayOrders.reduce((sum, o) => sum + o.total, 0),
    };
  }, [orders]);

  const handleStatus = async (order: OrderRecord, status: OrderStatus) => {
    await updateOrderStatus(tenantId, order.id, status);
    setSelected(prev => (prev?.id === order.id ? { ...prev, status } : prev));
  };

  const advanceStatus = (order: OrderRecord) => {
    const idx = ORDER_STATUS_FLOW.indexOf(order.status);
    if (idx >= 0 && idx < ORDER_STATUS_FLOW.length - 1) {
      handleStatus(order, ORDER_STATUS_FLOW[idx + 1]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Pedidos</h2>
          <p className="text-sm text-gray-500 mt-1">Bandeja en tiempo real · imprimir 58mm · WSP rápido</p>
        </div>
        <div className="flex gap-2">
          {(['active', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                filter === f ? 'bg-brand-green text-white' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'active' ? 'Activos' : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-brand-green/10 border border-brand-green/20 rounded-2xl p-4 flex items-center gap-3">
          <ShoppingBag size={22} className="text-brand-green shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Pedidos hoy</p>
            <p className="text-2xl font-black text-white">{todayStats.count}</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
          <DollarSign size={22} className="text-green-400 shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase">Vendido hoy</p>
            <p className="text-2xl font-black text-green-400">${todayStats.revenue.toLocaleString('es-AR')}</p>
          </div>
        </div>
      </div>

      <AdminQuickStock />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-3 max-h-[70vh] overflow-y-auto hide-scrollbar">
          {visible.length === 0 ? (
            <div className="bg-white/3 border border-white/5 rounded-2xl p-8 text-center text-gray-500">
              <Package size={32} className="mx-auto mb-3 opacity-50" />
              No hay pedidos {filter === 'active' ? 'activos' : ''}
            </div>
          ) : (
            visible.map(order => (
              <button
                key={order.id}
                onClick={() => setSelected(order)}
                className={`w-full text-left bg-white/3 border rounded-2xl p-4 transition hover:bg-white/5 ${
                  selected?.id === order.id ? 'border-brand-green' : 'border-white/5'
                } ${order.status === 'new' ? 'ring-1 ring-brand-green/40' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-lg font-black text-white">#{order.id}</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/10 text-gray-300">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-300 font-bold">{order.customerName}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{new Date(order.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="font-black text-green-400">${order.total.toLocaleString('es-AR')}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {selected ? (
          <div className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black text-white">#{selected.id}</h3>
                <p className="text-sm text-gray-400">{selected.customerName} · {selected.customerPhone}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm">
              {selected.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-300">
                  <span>{item.qty}x {item.name} ({item.optionLabel})</span>
                  <span className="font-bold">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                </div>
              ))}
              {selected.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Descuento {selected.promoCode ? `(${selected.promoCode})` : ''}</span>
                  <span>-${selected.discount.toLocaleString('es-AR')}</span>
                </div>
              )}
              <div className="flex justify-between text-white font-black text-base border-t border-white/10 pt-2">
                <span>Total</span>
                <span>${selected.total.toLocaleString('es-AR')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-black/20 rounded-xl px-3 py-2">
                <span className="text-gray-500 block">Entrega</span>
                <span className="font-bold text-white">
                  {selected.deliveryType === 'delivery' ? 'Delivery' : 'Retiro'}
                </span>
              </div>
              <div className="bg-black/20 rounded-xl px-3 py-2">
                <span className="text-gray-500 block">Pago</span>
                <span className="font-bold text-white">{PAYMENT_LABELS[selected.paymentMethod]}</span>
              </div>
            </div>

            {selected.deliveryType === 'delivery' && selected.address && (
              <p className="text-sm text-gray-400 bg-black/20 rounded-xl px-3 py-2">
                📍 {selected.address}
              </p>
            )}

            {selected.notes?.trim() && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Notas del cliente</p>
                <p className="text-sm text-amber-100">{selected.notes}</p>
              </div>
            )}

            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">WhatsApp rápido</p>
              <div className="flex flex-wrap gap-2">
                {WSP_TEMPLATES.map(templateId => (
                  <button
                    key={templateId}
                    type="button"
                    disabled={!selected.customerPhone.replace(/\D/g, '')}
                    onClick={() => {
                      openWhatsAppForOrder(selected.customerPhone.replace(/\D/g, ''), selected, templateId);
                    }}
                    className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-green-600/80 hover:bg-green-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold"
                  >
                    <MessageCircle size={14} />
                    {WHATSAPP_TEMPLATE_LABELS[templateId]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ORDER_STATUS_FLOW.includes(selected.status) && selected.status !== 'delivered' && (
                <button
                  onClick={() => advanceStatus(selected)}
                  className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-brand-green text-white rounded-xl text-xs font-bold"
                >
                  <RefreshCw size={14} />
                  Avanzar estado
                </button>
              )}
              {selected.status === 'new' && (
                <>
                  <button
                    onClick={() => handleStatus(selected, 'accepted')}
                    className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    <Check size={14} /> Aceptar
                  </button>
                  <button
                    onClick={() => handleStatus(selected, 'rejected')}
                    className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-red-600/80 text-white rounded-xl text-xs font-bold"
                  >
                    <X size={14} /> Rechazar
                  </button>
                </>
              )}
              <button
                onClick={() => printOrderTicket(selected)}
                className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-white/10 text-white rounded-xl text-xs font-bold"
              >
                <Printer size={14} /> Ticket 58mm
              </button>
              <button
                type="button"
                onClick={() => playNewOrderSound()}
                className="flex items-center gap-2 px-3 py-2 min-h-[44px] bg-white/5 text-gray-400 rounded-xl text-xs font-bold"
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
        ) : (
          <div className="hidden lg:flex items-center justify-center bg-white/3 border border-white/5 rounded-2xl p-8 text-gray-500">
            Seleccioná un pedido para ver detalle
          </div>
        )}
      </div>
    </div>
  );
}
