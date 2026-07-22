import type { OrderRecord, PaymentMethod, PaymentStatus } from '../../types/order';

const LABELS: Record<string, { text: string; className: string }> = {
  'cash:pending': { text: 'Sin cobrar', className: 'bg-amber-100 text-amber-800' },
  'transfer:pending': { text: 'A confirmar', className: 'bg-sky-100 text-sky-800' },
  'mercadopago:pending': { text: 'A confirmar', className: 'bg-sky-100 text-sky-800' },
  approved: { text: 'Pagado', className: 'bg-emerald-100 text-emerald-800' },
  rejected: { text: 'Falló', className: 'bg-red-100 text-red-800' },
};

const LABELS_DARK: Record<string, { text: string; className: string }> = {
  'cash:pending': { text: 'Sin cobrar', className: 'bg-amber-500/20 text-amber-300' },
  'transfer:pending': { text: 'A confirmar', className: 'bg-sky-500/20 text-sky-300' },
  'mercadopago:pending': { text: 'A confirmar', className: 'bg-sky-500/20 text-sky-300' },
  approved: { text: 'Pagado', className: 'bg-emerald-500/20 text-emerald-300' },
  rejected: { text: 'Falló', className: 'bg-red-500/20 text-red-300' },
};

const DEMO_PENDING = {
  light: { text: 'Pago a coordinar', className: 'bg-amber-100 text-amber-900' },
  dark: { text: 'Pago a coordinar', className: 'bg-amber-500/20 text-amber-200' },
};

function paymentBadgeMeta(
  method: PaymentMethod,
  status: PaymentStatus,
  tone: 'light' | 'dark' = 'light',
  demo = false,
) {
  const map = tone === 'dark' ? LABELS_DARK : LABELS;
  if (status === 'approved') return map.approved;
  if (status === 'rejected') return map.rejected;
  if (demo && status === 'pending') return DEMO_PENDING[tone];
  return map[`${method}:pending`] ?? map['cash:pending'];
}

export function PaymentBadge({
  order,
  tone = 'light',
}: {
  order: Pick<OrderRecord, 'paymentMethod' | 'paymentStatus' | 'source'>;
  tone?: 'light' | 'dark';
}) {
  const meta = paymentBadgeMeta(
    order.paymentMethod,
    order.paymentStatus,
    tone,
    order.source === 'demo',
  );
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${meta.className}`}>
      {meta.text}
    </span>
  );
}
