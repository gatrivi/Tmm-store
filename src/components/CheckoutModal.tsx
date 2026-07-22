import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, MapPin, User, Phone, CreditCard, FileText, Truck, Store, Send, ClipboardList, CheckCircle, ArrowLeft, MessageCircle, Copy, Check, AlertTriangle, Tag } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { buildWhatsAppMessage } from '../utils/whatsappMessage';
import { useLanguage } from '../context/LanguageContext';
import { usePlan } from '../context/PlanContext';
import { translations } from '../i18n/translations';
import { createOrder } from '../services/orderService';
import { createDemoOrder } from '../services/demoOrderRepository';
import { buildOrderRecord } from '../utils/orderBuilder';
import { getDemoByTenantId, isDemoTenant, resolveDemoPaths } from '../utils/demoRegistry';
import { useLocation } from 'react-router-dom';
import type { OrderRecord } from '../types/order';

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
    optionId: string;
    optionLabel: string;
    price: number;
    qty: number;
  }>;
  total: number;
  whatsappNumber: string;
  bankAlias: string;
  onOrderSent?: () => void;
  mpEnabled?: boolean;
  subtotal?: number;
  discount?: number;
  promoCode?: string;
  onPromoCodeChange?: (code: string) => void;
  onApplyPromo?: () => void;
  promoError?: string | null;
  /** Prefill delivery mode (demo verticals). */
  initialDeliveryType?: 'pickup' | 'delivery';
}

const generateOrderId = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 4; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default function CheckoutModal({ isOpen, onClose, cart, total, whatsappNumber, bankAlias, onOrderSent, mpEnabled, subtotal, discount = 0, promoCode = '', onPromoCodeChange, onApplyPromo, promoError, initialDeliveryType = 'pickup' }: CheckoutModalProps) {
  const { language } = useLanguage();
  const { features, tenantId } = usePlan();
  const location = useLocation();
  const lang = language || 'es';
  const t = translations[lang].checkout;
  const effectiveSubtotal = subtotal ?? total;
  const vertical = getDemoByTenantId(tenantId);
  const demoPaths = resolveDemoPaths(location.pathname);
  const demoMode = isDemoTenant(tenantId);
  const showPromos = features.canUsePromotions && onApplyPromo && !vertical?.hidePromos;
  const totalLabel = vertical?.copy.totalLabel ?? t.total;
  const totalHint = vertical?.copy.totalHint;
  const pickupLabel = vertical?.copy.pickupLabel ?? t.pickup;
  const deliveryLabel = vertical?.copy.deliveryLabel ?? t.delivery;
  const cashLabel = vertical?.copy.cashLabel ?? t.cash;
  const transferLabel = vertical?.copy.transferLabel ?? t.transfer;
  const submitLabel = vertical?.copy.submitLabel ?? t.whatsappSend;
  const notesPlaceholder = vertical?.copy.notesPlaceholder ?? t.notesPlaceholder;

  const [step, setStep] = useState<'form' | 'confirm' | 'demo-success'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>(initialDeliveryType);
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mercadopago'>('cash');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [mpLoading, setMpLoading] = useState(false);
  const [mpError, setMpError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const orderIdRef = useRef<string>(generateOrderId());

  const showCopied = (field: string) => {
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const orderId = orderIdRef.current;

  // Reset when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('form');
      setPopupBlocked(false);
      setMpError(null);
      setMpLoading(false);
      setConfirmedOrder(null);
      setDeliveryType(initialDeliveryType);
      orderIdRef.current = generateOrderId();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialDeliveryType]);

  const resetAndClose = useCallback(() => {
    setStep('form');
    setName('');
    setPhone('');
    setDeliveryType('pickup');
    setAddress('');
    setPaymentMethod('cash');
    setNotes('');
    setErrors({});
    setPopupBlocked(false);
    setMpError(null);
    setMpLoading(false);
    setConfirmedOrder(null);
    orderIdRef.current = generateOrderId();
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') resetAndClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, resetAndClose]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t.nameError;
    if (!phone.trim()) newErrors.phone = t.phoneError;
    if (deliveryType === 'delivery' && !address.trim()) newErrors.address = t.addressError;
    if (paymentMethod === 'transfer' && !bankAlias.trim() && !demoMode) newErrors.bankAlias = t.aliasError;
    if (!whatsappNumber.trim() && !demoMode) newErrors.whatsapp = t.whatsappError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReview = () => {
    if (!validate()) return;
    setStep('confirm');
  };

  const handleSendWhatsApp = async () => {
    const paymentLabel = {
      cash: t.cash,
      transfer: t.transfer,
      mercadopago: t.mp,
    }[paymentMethod];

    const checkoutData = {
      orderId,
      name,
      phone,
      deliveryType,
      address,
      paymentMethod,
      notes,
    };

    const record = buildOrderRecord({
      tenantId,
      checkout: checkoutData,
      cart: cart.map(c => ({
        id: c.id,
        name: c.name,
        optionId: c.optionId || '',
        optionLabel: c.optionLabel,
        price: c.price,
        qty: c.qty,
      })),
      subtotal: effectiveSubtotal,
      discount,
      total,
      promoCode: promoCode || undefined,
    });

    if (demoMode) {
      const persisted = createDemoOrder({ ...record, source: 'demo' });
      setConfirmedOrder(persisted);
      if (onOrderSent) onOrderSent();
      setStep('demo-success');
      return;
    }

    await createOrder(record);

    const message = buildWhatsAppMessage({
      orderId,
      name,
      phone,
      deliveryType,
      address,
      paymentMethod,
      paymentLabel,
      bankAlias,
      notes,
      cart,
      total,
      discount,
      promoCode,
    });

    if (paymentMethod === 'transfer') {
      await copyToClipboard(bankAlias);
      showCopied('alias-auto');
    }

    const encoded = encodeURIComponent(message);
    const win = window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank');

    if (!win || win.closed || typeof win.closed === 'undefined') {
      setPopupBlocked(true);
      await copyToClipboard(message);
      return;
    }

    setPopupBlocked(false);
    if (onOrderSent) onOrderSent();
    resetAndClose();
  };

  const handlePayWithMP = async () => {
    setMpLoading(true);
    setMpError(null);
    try {
      const checkoutData = {
        orderId,
        name,
        phone,
        deliveryType,
        address,
        paymentMethod: 'mercadopago' as const,
        notes,
      };

      await createOrder(buildOrderRecord({
        tenantId,
        checkout: checkoutData,
        cart: cart.map(c => ({
          id: c.id,
          name: c.name,
          optionId: c.optionId || '',
          optionLabel: c.optionLabel,
          price: c.price,
          qty: c.qty,
        })),
        subtotal: effectiveSubtotal,
        discount,
        total,
        promoCode: promoCode || undefined,
      }));

      const items = cart.map(item => ({
        title: `${item.name} (${item.optionLabel})`,
        quantity: item.qty,
        unit_price: item.price,
        currency_id: 'ARS',
      }));

      const origin = window.location.origin;
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          payer: { name, phone },
          external_reference: orderId,
          notification_url: `${origin}/api/mp-webhook`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al crear la preferencia de pago');
      }

      // Guardar en sessionStorage que tenemos un pedido pendiente de MP
      sessionStorage.setItem('elpuestito_mp_pending', JSON.stringify({ orderId, total }));

      // Redirigir a MercadoPago
      window.location.href = data.init_point;
    } catch (err) {
      setMpLoading(false);
      setMpError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const paymentLabel = {
    cash: cashLabel,
    transfer: transferLabel,
    mercadopago: t.mp,
  }[paymentMethod];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
      onClick={resetAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      <div
        className="bg-surface-elevated rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-surface-elevated z-10 px-6 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 'confirm' || step === 'demo-success' ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <ClipboardList size={20} className="text-green-600" />
            )}
            <h2 id="checkout-modal-title" className="text-lg font-black text-text-primary">
              {step === 'demo-success'
                ? (vertical?.copy.successTitle ?? 'Pedido de demostración listo')
                : step === 'confirm'
                  ? t.confirmTitle
                  : t.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-white/5 rounded-full transition"
            aria-label={t.cancel}
          >
            <X size={18} className="text-text-secondary" />
          </button>
        </div>

        {step === 'form' ? (
          <div className="p-6 space-y-5">
            {/* Order ID */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{t.orderNumber}</span>
              <span className="text-lg font-black text-green-700">#{orderId}</span>
            </div>

            {/* Name */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                <User size={12} /> {t.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => { const n = { ...p }; delete n.name; return n; }); }}
                placeholder={t.namePlaceholder}
                className={`w-full bg-surface-muted border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 transition-shadow placeholder:text-text-muted ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-green-200'}`}
              />
              {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                <Phone size={12} /> {t.phoneLabel}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors(p => { const n = { ...p }; delete n.phone; return n; }); }}
                placeholder={t.phonePlaceholder}
                className={`w-full bg-surface-muted border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 transition-shadow placeholder:text-text-muted ${errors.phone ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-green-200'}`}
              />
              {errors.phone && <span className="text-xs text-red-500 mt-1 block">{errors.phone}</span>}
            </div>

            {/* Delivery Type */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                <Truck size={12} /> {t.deliveryType}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryType('pickup')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${deliveryType === 'pickup' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' : 'bg-surface-muted text-text-secondary border-border hover:border-green-500/40'}`}
                >
                  <Store size={16} /> {pickupLabel}
                </button>
                <button
                  onClick={() => setDeliveryType('delivery')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${deliveryType === 'delivery' ? 'bg-green-600 text-white border-green-600 shadow-lg shadow-green-200' : 'bg-surface-muted text-text-secondary border-border hover:border-green-500/40'}`}
                >
                  <MapPin size={16} /> {deliveryLabel}
                </button>
              </div>
              {vertical && (
                <p className="mt-2 text-xs font-medium text-text-secondary">
                  {deliveryType === 'delivery' ? vertical.copy.deliveryHint : vertical.copy.pickupHint}
                </p>
              )}
            </div>

            {/* Address (conditional) */}
            {deliveryType === 'delivery' && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  <MapPin size={12} /> {t.addressLabel}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); if (errors.address) setErrors(p => { const n = { ...p }; delete n.address; return n; }); }}
                  placeholder={t.addressPlaceholder}
                  className={`w-full bg-surface-muted border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 transition-shadow placeholder:text-text-muted ${errors.address ? 'border-red-300 focus:ring-red-200' : 'border-border focus:ring-green-200'}`}
                />
                {errors.address && <span className="text-xs text-red-500 mt-1 block">{errors.address}</span>}
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                <CreditCard size={12} /> {t.paymentMethod}
              </label>
              <div className={`grid gap-2 ${mpEnabled ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {[
                  { id: 'cash' as const, label: cashLabel },
                  { id: 'transfer' as const, label: transferLabel },
                  ...(mpEnabled ? [{ id: 'mercadopago' as const, label: t.mp }] : []),
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all ${paymentMethod === opt.id ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-surface-muted text-text-secondary border-border hover:border-green-500/40'}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {paymentMethod === 'transfer' && bankAlias && (
                <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-medium">
                  {t.aliasLabel}: <span className="font-black">{bankAlias}</span>
                </div>
              )}
              {paymentMethod === 'mercadopago' && (
                <div className="mt-2 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-xs text-sky-700 font-medium">
                  {t.mpDescription}
                </div>
              )}
              {errors.bankAlias && <span className="text-xs text-red-500 mt-1 block">{errors.bankAlias}</span>}
              {errors.whatsapp && <span className="text-xs text-red-500 mt-1 block">{errors.whatsapp}</span>}
            </div>

            {/* Notes */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                <FileText size={12} /> {t.notesLabel}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={notesPlaceholder}
                className="w-full bg-surface-muted border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-text-primary outline-none focus:ring-2 focus:ring-green-200 transition-shadow resize-none placeholder:text-text-muted"
              />
            </div>

            {/* Promo code */}
            {showPromos && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1.5">
                  <Tag size={12} /> Cupón de descuento
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={e => onPromoCodeChange?.(e.target.value.toUpperCase())}
                    placeholder="CÓDIGO"
                    className="flex-1 bg-surface-muted border border-border rounded-xl px-4 py-2.5 text-sm font-bold uppercase"
                  />
                  <button
                    type="button"
                    onClick={onApplyPromo}
                    className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold"
                  >
                    Aplicar
                  </button>
                </div>
                {promoError && <span className="text-xs text-red-500 mt-1 block">{promoError}</span>}
                {discount > 0 && (
                  <span className="text-xs text-green-600 font-bold mt-1 block">
                    Descuento aplicado: -${discount.toLocaleString('es-AR')}
                  </span>
                )}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-surface-muted rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">{t.summary}</span>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-text-primary">{item.qty}x {item.name} ({item.optionLabel})</span>
                  <span className="font-bold text-text-primary">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between items-center text-base font-black text-text-primary">
                <span>{totalLabel}</span>
                <div className="flex flex-col items-end">
                  {discount > 0 && (
                    <span className="text-xs text-text-muted line-through">${effectiveSubtotal.toLocaleString('es-AR')}</span>
                  )}
                  <div className="flex items-center gap-2">
                    <span>${total.toLocaleString('es-AR')}</span>
                    <button
                      onClick={async () => { await copyToClipboard(`$${total.toLocaleString('es-AR')}`); showCopied('total'); }}
                      className="p-1 hover:bg-white/10 rounded transition"
                      title={t.copyTotal}
                    >
                      {copiedField === 'total' ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} className="text-text-secondary" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              {totalHint && (
                <p className="text-xs font-medium text-text-secondary pt-1">{totalHint}</p>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleReview}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition shadow-lg shadow-green-200"
            >
              <Send size={18} />
              {t.submit}
            </button>
          </div>
        ) : step === 'demo-success' ? (
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <p className="mt-5 text-xs font-black uppercase tracking-[0.14em] text-green-700">
                Pedido enviado #{confirmedOrder?.id ?? orderId}
              </p>
              <h3 className="mt-2 text-2xl font-black text-text-primary">
                {vertical?.copy.successTitle ?? 'El local ya lo tiene en la bandeja.'}
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-text-secondary">
                {vertical?.copy.successBody ?? 'Demo segura · no se envió WhatsApp. El ID y el total coinciden con el panel del local.'}
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-green-700">Pedido</p>
                  <p className="mt-1 text-lg font-black text-green-900">
                    #{confirmedOrder?.id ?? orderId} · {totalLabel} $
                    {(confirmedOrder?.total ?? total).toLocaleString('es-AR')}
                  </p>
                  <p className="mt-1 text-xs font-bold text-green-800">Estado: Nuevo</p>
                </div>
                <Store size={24} className="text-green-700" />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <a
                href={demoPaths.ownerPath}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#171814] px-4 py-3.5 text-sm font-black text-white transition hover:bg-[#ee6847]"
              >
                <Store size={18} />
                {vertical?.copy.ownerLinkLabel ?? 'Ver cómo lo recibe el local'}
              </a>
              <a
                href={demoPaths.orderPath(confirmedOrder?.id ?? orderId)}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-black text-text-primary transition hover:bg-white/5"
              >
                {vertical?.copy.statusLinkLabel ?? 'Ver estado del pedido'}
              </a>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full rounded-xl py-3 text-sm font-bold text-text-secondary transition hover:text-text-primary"
              >
                {vertical?.copy.continueLabel ?? 'Seguir viendo la carta'}
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="p-6 space-y-5">
            {/* Success Icon */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-black text-text-primary">{t.successTitle}</h3>
              <p className="text-sm text-text-secondary mt-1">{t.successSubtitle}</p>
            </div>

            {/* Order ID */}
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-bold text-green-700 uppercase tracking-wider">{t.orderNumber}</span>
              <span className="text-lg font-black text-green-700">#{orderId}</span>
            </div>

            {/* Data Summary */}
            <div className="bg-surface-muted rounded-xl p-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">{t.client}</span>
                <span className="font-bold text-text-primary">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t.phoneLabel}</span>
                <span className="font-bold text-text-primary">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{t.deliveryLabel}</span>
                <span className="font-bold text-text-primary">{deliveryType === 'pickup' ? pickupLabel : deliveryLabel}</span>
              </div>
              {deliveryType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">{t.addressLabel}</span>
                  <span className="font-bold text-text-primary text-right max-w-[60%]">{address}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">{t.paymentLabel}</span>
                <span className="font-bold text-text-primary">{paymentLabel}</span>
              </div>
              {paymentMethod === 'transfer' && (
                <div className="flex justify-between items-center bg-blue-50 rounded-lg px-3 py-2">
                  <span className="text-text-secondary text-xs">{t.aliasLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-blue-700">{bankAlias}</span>
                    <button
                      onClick={async () => { await copyToClipboard(bankAlias); showCopied('alias'); }}
                      className="p-1 hover:bg-blue-100 rounded transition"
                      title={t.copyAlias}
                    >
                      {copiedField === 'alias' || copiedField === 'alias-auto' ? (
                        <Check size={14} className="text-green-600" />
                      ) : (
                        <Copy size={14} className="text-blue-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {notes && (
                <div className="pt-2 border-t border-border">
                  <span className="text-text-secondary block text-xs mb-1">{t.notesLabel}</span>
                  <span className="font-medium text-text-primary">{notes}</span>
                </div>
              )}
            </div>

            {/* Cart Summary */}
            <div className="bg-surface-muted rounded-xl p-4 space-y-2">
              <span className="text-xs font-bold text-text-secondary uppercase tracking-wider block mb-2">{t.detail}</span>
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-text-primary">{item.qty}x {item.name} ({item.optionLabel})</span>
                  <span className="font-bold text-text-primary">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex justify-between text-base font-black text-text-primary">
                <span>{totalLabel}</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
              {totalHint && (
                <p className="text-xs font-medium text-text-secondary pt-1">{totalHint}</p>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {popupBlocked && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 text-sm font-bold">
                    <AlertTriangle size={16} />
                    <span>{t.popupBlocked}</span>
                  </div>
                  <p className="text-xs text-amber-600">
                    {t.popupBlockedDesc}
                  </p>
                </div>
              )}
              {mpError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-red-700 text-sm font-bold">
                    <AlertTriangle size={16} />
                    <span>{t.mpError}</span>
                  </div>
                  <p className="text-xs text-red-600">{mpError}</p>
                </div>
              )}
              {paymentMethod === 'mercadopago' ? (
                <button
                  onClick={handlePayWithMP}
                  disabled={mpLoading}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg"
                >
                  <CreditCard size={20} />
                  {mpLoading ? t.mpLoading : t.mpPay}
                </button>
              ) : (
                <button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg"
                >
                  {demoMode ? <Send size={20} /> : <MessageCircle size={20} />}
                  {demoMode ? submitLabel : t.whatsappSend}
                </button>
              )}

              {/* Quick copy buttons for transfer payments */}
              {paymentMethod === 'transfer' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => { await copyToClipboard(`$${total.toLocaleString('es-AR')}`); showCopied('total-btn'); }}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition"
                  >
                    {copiedField === 'total-btn' ? <Check size={14} /> : <Copy size={14} />}
                    {t.copyTotal}
                  </button>
                  <button
                    onClick={async () => { await copyToClipboard(bankAlias); showCopied('alias-btn'); }}
                    className="flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs rounded-xl hover:bg-blue-100 transition"
                  >
                    {copiedField === 'alias-btn' ? <Check size={14} /> : <Copy size={14} />}
                    {t.copyAlias}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full flex items-center justify-center gap-2 py-3 min-h-[44px] text-text-secondary font-bold text-sm hover:text-text-primary transition border border-border rounded-xl"
              >
                <ArrowLeft size={16} />
                {t.back}
              </button>

              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 min-h-[44px] text-text-muted font-bold text-sm hover:text-red-400 transition"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
