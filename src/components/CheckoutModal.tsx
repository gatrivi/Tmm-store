import React, { useState, useMemo } from 'react';
import { X, MapPin, User, Phone, CreditCard, FileText, Truck, Store, Send, ClipboardList } from 'lucide-react';

export interface CheckoutData {
  orderId: string;
  name: string;
  phone: string;
  deliveryType: 'pickup' | 'delivery';
  address: string;
  paymentMethod: 'cash' | 'transfer' | 'mercadopago';
  notes: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Array<{
    id: string;
    name: string;
    optionLabel: string;
    price: number;
    qty: number;
  }>;
  total: number;
  whatsappNumber: string;
  bankAlias: string;
}

const generateOrderId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default function CheckoutModal({ isOpen, onClose, cart, total, whatsappNumber, bankAlias }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mercadopago'>('cash');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const orderId = useMemo(() => generateOrderId(), [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Ingresá tu nombre';
    if (!phone.trim()) newErrors.phone = 'Ingresá tu teléfono';
    if (deliveryType === 'delivery' && !address.trim()) newErrors.address = 'Ingresá la dirección de entrega';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const paymentLabel = {
      cash: 'Efectivo',
      transfer: 'Transferencia bancaria',
      mercadopago: 'Mercado Pago',
    }[paymentMethod];

    let message = `🛒 *Pedido #${orderId}*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n\n`;

    message += `👤 *Cliente:* ${name.trim()}\n`;
    message += `📱 *Teléfono:* ${phone.trim()}\n`;
    message += `🚚 *Entrega:* ${deliveryType === 'pickup' ? 'Retiro en local' : 'Delivery'}\n`;
    if (deliveryType === 'delivery') {
      message += `📍 *Dirección:* ${address.trim()}\n`;
    }
    message += `💳 *Pago:* ${paymentLabel}\n`;
    message += `\n━━━━━━━━━━━━━━━━━━\n`;
    message += `*Detalle del pedido:*\n\n`;

    cart.forEach(item => {
      message += `• ${item.qty}x ${item.name} (${item.optionLabel}) — $${(item.price * item.qty).toLocaleString('es-AR')}\n`;
    });

    message += `\n*Total: $${total.toLocaleString('es-AR')}*\n`;
    message += `━━━━━━━━━━━━━━━━━━\n`;

    if (paymentMethod === 'transfer') {
      message += `\n🏦 Alias para transferencia: *${bankAlias}*\n`;
    }

    if (notes.trim()) {
      message += `\n📝 *Notas:* ${notes.trim()}\n`;
    }

    message += `\n¡Gracias por elegirnos! 🙌`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardList size={20} className="text-green-600" />
            <h2 className="text-lg font-black text-gray-900">Confirmar pedido</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Order ID */}
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Número de pedido</span>
            <span className="text-lg font-black text-green-700">#{orderId}</span>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              <User size={12} /> Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
              placeholder="Ej: Juan Pérez"
              className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 transition-shadow placeholder:text-gray-400 ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}`}
            />
            {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              <Phone size={12} /> Teléfono
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(p => { const n = { ...p }; delete n.phone; return n; }); }}
              placeholder="Ej: 11 3184-4469"
              className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 transition-shadow placeholder:text-gray-400 ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}`}
            />
            {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
          </div>

          {/* Delivery Type */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <Truck size={12} /> Tipo de entrega
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryType('pickup')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${deliveryType === 'pickup' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}
              >
                <Store size={16} /> Retiro en local
              </button>
              <button
                onClick={() => setDeliveryType('delivery')}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${deliveryType === 'delivery' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}
              >
                <MapPin size={16} /> Delivery
              </button>
            </div>
          </div>

          {/* Address (conditional) */}
          {deliveryType === 'delivery' && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                <MapPin size={12} /> Dirección de entrega
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors(p => { const n = { ...p }; delete n.address; return n; }); }}
                placeholder="Ej: Dorrego 4045, Palermo"
                className={`w-full bg-gray-50 border rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 transition-shadow placeholder:text-gray-400 ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-green-200'}`}
              />
              {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              <CreditCard size={12} /> Método de pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash' as const, label: 'Efectivo' },
                { id: 'transfer' as const, label: 'Transferencia' },
                { id: 'mercadopago' as const, label: 'Mercado Pago' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setPaymentMethod(opt.id)}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${paymentMethod === opt.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-green-300'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {paymentMethod === 'transfer' && (
              <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
                Alias: <span className="font-black">{bankAlias}</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              <FileText size={12} /> Notas / Adicionales
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Ej: Timbre roto, llamar al llegar..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-green-200 transition-shadow resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Resumen</span>
            {cart.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.qty}x {item.name} ({item.optionLabel})</span>
                <span className="font-bold text-gray-900">${(item.price * item.qty).toLocaleString('es-AR')}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-black text-gray-900">
              <span>Total</span>
              <span>${total.toLocaleString('es-AR')}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-green-200"
          >
            <Send size={18} />
            Enviar pedido por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
