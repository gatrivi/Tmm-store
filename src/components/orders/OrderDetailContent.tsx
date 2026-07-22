import type { OrderRecord } from '../../types/order';
import { ORDER_STATUS_LABELS } from '../../types/order';
import { PaymentBadge } from './PaymentBadge';

const PAYMENT_METHOD_LABELS: Record<OrderRecord['paymentMethod'], string> = {
  cash: 'Efectivo',
  transfer: 'Transferencia',
  mercadopago: 'Mercado Pago',
};

interface OrderDetailContentProps {
  order: OrderRecord;
  tone?: 'light' | 'dark';
  statusLinkHref?: string;
  extraActions?: React.ReactNode;
  totalLabel?: string;
  totalHint?: string;
  pickupLabel?: string;
  deliveryLabel?: string;
}

export function OrderDetailContent({
  order,
  tone = 'light',
  statusLinkHref,
  extraActions,
  totalLabel = 'Total',
  totalHint,
  pickupLabel = 'Retiro',
  deliveryLabel = 'Envío',
}: OrderDetailContentProps) {
  const isLight = tone === 'light';
  const muted = isLight ? 'text-black/45' : 'text-gray-500';
  const body = isLight ? 'text-[#151612]' : 'text-gray-300';
  const strong = isLight ? 'text-[#151612]' : 'text-white';
  const box = isLight ? 'bg-[#f4f5f1]' : 'bg-black/20';

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h3 className={`text-xl font-black ${strong}`}>#{order.id}</h3>
          <span className={`text-sm font-bold ${muted}`}>{ORDER_STATUS_LABELS[order.status]}</span>
          <PaymentBadge order={order} tone={tone} />
        </div>
        <p className={`mt-1 text-sm ${muted}`}>
          {order.customerName}
          {order.customerPhone ? ` · ${order.customerPhone}` : ''}
        </p>
      </div>

      <div className="space-y-2 text-sm">
        {order.items.map((item, idx) => (
          <div key={idx} className={`flex justify-between gap-3 ${body}`}>
            <span>
              {item.qty}× {item.name}
              {item.optionLabel ? ` · ${item.optionLabel}` : ''}
            </span>
            <span className="font-bold shrink-0">
              ${(item.price * item.qty).toLocaleString('es-AR')}
            </span>
          </div>
        ))}
        {order.discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Descuento{order.promoCode ? ` (${order.promoCode})` : ''}</span>
            <span>-${order.discount.toLocaleString('es-AR')}</span>
          </div>
        )}
        <div className={`flex justify-between border-t pt-2 text-base font-black ${isLight ? 'border-black/8' : 'border-white/10'} ${strong}`}>
          <span>{totalLabel}</span>
          <span>${order.total.toLocaleString('es-AR')}</span>
        </div>
        {totalHint && (
          <p className={`text-xs font-medium ${muted}`}>{totalHint}</p>
        )}
      </div>

      {order.notes?.trim() && (
        <div className={`rounded-xl border px-3 py-2 ${isLight ? 'border-amber-200 bg-amber-50' : 'border-amber-500/20 bg-amber-500/10'}`}>
          <p className={`text-[10px] font-black uppercase tracking-wider ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
            Notas del cliente
          </p>
          <p className={`mt-1 text-sm font-medium ${isLight ? 'text-amber-950' : 'text-amber-100'}`}>
            {order.notes}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`rounded-xl px-3 py-2 ${box}`}>
          <span className={`block ${muted}`}>Entrega</span>
          <span className={`font-bold ${strong}`}>
            {order.deliveryType === 'delivery' ? deliveryLabel : pickupLabel}
          </span>
        </div>
        <div className={`rounded-xl px-3 py-2 ${box}`}>
          <span className={`block ${muted}`}>Pago</span>
          <span className={`font-bold ${strong}`}>
            {PAYMENT_METHOD_LABELS[order.paymentMethod]}
          </span>
        </div>
      </div>

      {order.deliveryType === 'delivery' && order.address && (
        <p className={`rounded-xl px-3 py-2 text-sm ${box} ${body}`}>{order.address}</p>
      )}

      {extraActions}

      {statusLinkHref && (
        <a
          href={statusLinkHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-xs font-bold underline-offset-2 hover:underline ${muted}`}
        >
          Ver seguimiento del cliente
        </a>
      )}
    </div>
  );
}
