import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react';
import { usePlan } from '../context/PlanContext';
import { getOrder } from '../services/orderService';
import type { OrderRecord } from '../types/order';
import { ORDER_STATUS_LABELS } from '../types/order';

export default function OrderStatusPage() {
  const { tenantId } = usePlan();
  const orderId = window.location.pathname.split('/order/')[1]?.split('/')[0] ?? '';
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    getOrder(tenantId, orderId.toUpperCase())
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [tenantId, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="animate-spin text-green-400" size={32} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
        <XCircle size={48} className="text-red-400 mb-4" />
        <h1 className="text-xl font-black text-text-primary mb-2">Pedido no encontrado</h1>
        <p className="text-text-secondary mb-6">Verificá el número de pedido e intentá de nuevo.</p>
        <Link to="/" className="text-green-400 font-bold hover:underline">Volver al menú</Link>
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-300',
    accepted: 'bg-indigo-500/20 text-indigo-300',
    preparing: 'bg-amber-500/20 text-amber-300',
    ready: 'bg-green-500/20 text-green-300',
    delivered: 'bg-white/10 text-text-secondary',
    rejected: 'bg-red-500/20 text-red-300',
    cancelled: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="min-h-screen bg-surface p-4">
      <div className="max-w-md mx-auto bg-surface-elevated rounded-2xl shadow-lg border border-border overflow-hidden mt-8">
        <div className="bg-black text-white p-6 text-center">
          <h1 className="text-lg font-black">Estado del pedido</h1>
          <p className="text-3xl font-black mt-2">#{order.id}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${statusColor[order.status]}`}>
            {order.status === 'ready' || order.status === 'delivered' ? (
              <CheckCircle size={16} />
            ) : (
              <Clock size={16} />
            )}
            {ORDER_STATUS_LABELS[order.status]}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Cliente</span>
              <span className="font-bold text-text-primary">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Total</span>
              <span className="font-black text-green-400">${order.total.toLocaleString('es-AR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Pago</span>
              <span className="font-bold capitalize text-text-primary">{order.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-text-primary">
                <span>{item.qty}x {item.name}</span>
                <span className="font-bold">${(item.price * item.qty).toLocaleString('es-AR')}</span>
              </div>
            ))}
          </div>

          <Link
            to="/"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
          >
            Volver al menú
          </Link>
        </div>
      </div>
    </div>
  );
}
