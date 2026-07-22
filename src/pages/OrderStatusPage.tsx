import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { getOrder } from '../services/orderService';
import { getDemoOrder, subscribeDemoOrders } from '../services/demoOrderRepository';
import type { OrderRecord } from '../types/order';
import { ORDER_STATUS_LABELS } from '../types/order';
import { isTerminalStatus } from '../utils/orderStateMachine';
import { PaymentBadge } from '../components/orders/PaymentBadge';
import {
  getDemoByTenantId,
  isDemoTenant,
  resolveDemoFromPath,
  resolveDemoPaths,
} from '../utils/demoRegistry';

export default function OrderStatusPage() {
  const { tenantId } = usePlan();
  const location = useLocation();
  const params = useParams();
  const orderId = params.orderId
    ?? window.location.pathname.split('/order/')[1]?.split('/')[0]
    ?? '';
  const vertical = resolveDemoFromPath(location.pathname) ?? getDemoByTenantId(tenantId);
  const paths = resolveDemoPaths(location.pathname);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const id = orderId.toUpperCase();

    const load = async () => {
      if (isDemoTenant(tenantId) || resolveDemoFromPath(location.pathname)) {
        const demo = getDemoOrder(id);
        if (demo) {
          if (!cancelled) {
            setOrder(demo);
            setUpdatedAt(demo.updatedAt);
            setLoading(false);
          }
          return;
        }
      }
      const remote = await getOrder(tenantId, id);
      if (!cancelled) {
        setOrder(remote);
        setUpdatedAt(remote?.updatedAt ?? null);
        setLoading(false);
      }
    };

    void load();

    const unsubDemo = subscribeDemoOrders(list => {
      const found = list.find(o => o.id.toUpperCase() === id);
      if (found) {
        setOrder(found);
        setUpdatedAt(found.updatedAt);
        setLoading(false);
      }
    });

    const demoPath = Boolean(resolveDemoFromPath(location.pathname)) || isDemoTenant(tenantId);
    let poll: number | undefined;
    if (!demoPath) {
      poll = window.setInterval(() => {
        void getOrder(tenantId, id).then(remote => {
          if (!remote) return;
          setOrder(remote);
          setUpdatedAt(remote.updatedAt);
          if (isTerminalStatus(remote.status) && poll) {
            window.clearInterval(poll);
          }
        });
      }, 10_000);
    }

    return () => {
      cancelled = true;
      unsubDemo();
      if (poll) window.clearInterval(poll);
    };
  }, [tenantId, orderId, location.pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="animate-spin text-green-400" size={32} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-6 text-center">
        <XCircle size={48} className="mb-4 text-red-400" />
        <h1 className="mb-2 text-xl font-black text-text-primary">Pedido no encontrado</h1>
        <p className="mb-6 text-text-secondary">Verificá el número de pedido e intentá de nuevo.</p>
        <Link to={paths.customerPath} className="font-bold text-green-400 hover:underline">Volver al menú</Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-300',
    preparing: 'bg-amber-500/20 text-amber-300',
    ready: 'bg-green-500/20 text-green-300',
    out_for_delivery: 'bg-emerald-500/20 text-emerald-300',
    completed: 'bg-white/10 text-text-secondary',
    rejected: 'bg-red-500/20 text-red-300',
    cancelled: 'bg-red-500/20 text-red-300',
  };

  const backHref = isDemoTenant(order.tenantId) || order.source === 'demo'
    ? paths.customerPath
    : '/';
  const totalLabel = vertical?.copy.totalLabel ?? 'Total';
  const totalHint = vertical?.copy.totalHint;
  const deliveryLabel = vertical?.copy.deliveryLabel ?? 'Envío';
  const pickupLabel = vertical?.copy.pickupLabel ?? 'Retiro';

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="mx-auto mt-8 max-w-md overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-lg">
        <div className="bg-black p-6 text-center text-white">
          <h1 className="text-lg font-black">Estado del pedido</h1>
          <p className="mt-2 text-3xl font-black">#{order.id}</p>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${statusColor[order.status]}`}>
              {order.status === 'ready' || order.status === 'completed' || order.status === 'out_for_delivery' ? (
                <CheckCircle size={16} />
              ) : (
                <Clock size={16} />
              )}
              {ORDER_STATUS_LABELS[order.status]}
            </div>
            <PaymentBadge order={order} tone="dark" />
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Cliente</span>
              <span className="font-bold text-text-primary">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Entrega</span>
              <span className="font-bold text-text-primary">
                {order.deliveryType === 'delivery' ? deliveryLabel : pickupLabel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">{totalLabel}</span>
              <span className="font-black text-green-400">${order.total.toLocaleString('es-AR')}</span>
            </div>
            {totalHint && (
              <p className="text-xs text-text-secondary">{totalHint}</p>
            )}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-text-primary">
                <span>{item.qty}× {item.name}{item.optionLabel ? ` · ${item.optionLabel}` : ''}</span>
                <span className="font-bold">${(item.price * item.qty).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>

          {updatedAt && (
            <p className="text-xs text-text-secondary">
              Última actualización:{' '}
              {new Date(updatedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          )}

          <Link
            to={backHref}
            className="block w-full rounded-xl bg-green-600 py-3 text-center font-bold text-white transition hover:bg-green-700"
          >
            Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}
