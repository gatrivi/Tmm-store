import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Send, Globe, Clock, Share2, Flame } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveImagesForProduct } from '../utils/imageLoader';
import { loadBusinessHours, isBusinessOpen, getNextOpeningText } from '../utils/businessHours';
import { startSession, trackPageView } from '../utils/analyticsTracker';
import CheckoutModal from '../components/CheckoutModal';
import ShareModal from '../components/ShareModal';
import { GlobalFooter } from '../components/GlobalFooter';
import { playAddToCartSound } from '../utils/sounds';

export default function Storefront() {
  const { menuItems, siteSettings } = useMenu();
  const { language, setLanguage } = useLanguage();

  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('elpuestito_cart');
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Validate cart against current menu on load and when menu changes
  useEffect(() => {
    if (!menuItems || menuItems.length === 0) return;
    setCart(prev => {
      const valid = prev.filter(cartItem => {
        const item = menuItems.find(m => m.id === cartItem.id);
        if (!item || item.available === false) return false;
        const option = item.options.find(o => o.id === cartItem.optionId);
        if (!option || option.available === false) return false;
        return true;
      });
      return valid;
    });
  }, [menuItems]);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('elpuestito_cart', JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart]);

  const WHATSAPP_NUMBER = siteSettings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const BANK_ALIAS = siteSettings.bankAlias || import.meta.env.VITE_BANK_ALIAS || '';

  // Default language to 'es' if null (avoid blocking modal in this flow)
  const lang = language || 'es';

  const [businessHours] = useState(() => loadBusinessHours());
  const isOpenNow = businessHours.enabled ? isBusinessOpen(businessHours) : true;
  const nextOpeningText = businessHours.enabled ? getNextOpeningText(businessHours) : '';

  // Apply branding CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--brand-color', siteSettings.brandColor);
    root.style.setProperty('--brand-color-dark', siteSettings.brandColorDark);
    root.style.setProperty('--brand-color-light', siteSettings.brandColorLight);
    root.style.setProperty('--brand-accent', siteSettings.brandAccent);
    root.style.setProperty('--brand-text', siteSettings.brandTextColor);
    root.style.setProperty('--brand-font', siteSettings.brandFont);
  }, [siteSettings]);

  // Analytics tracking
  useEffect(() => {
    startSession();
    trackPageView('/');
  }, []);

  const t = {
    es: { cart: 'Tu pedido', empty: 'Tu carrito está vacío', total: 'Total', order: 'Confirmar pedido', add: 'Agregar', unavailable: 'No disponible', openNow: 'Abierto ahora', closed: 'Cerrado', address: '4045 Dorrego Ave', closedMsg: 'Momentaneamente cerrados', clear: 'Vaciar', qty: 'Cant' },
    en: { cart: 'Your Order', empty: 'Your cart is empty', total: 'Total', order: 'Confirm order', add: 'Add', unavailable: 'Unavailable', openNow: 'Open now', closed: 'Closed', address: '4045 Dorrego Ave', closedMsg: 'Currently closed', clear: 'Clear', qty: 'Qty' },
    pt: { cart: 'Seu pedido', empty: 'Seu carrinho está vazio', total: 'Total', order: 'Confirmar pedido', add: 'Adicionar', unavailable: 'Indisponível', openNow: 'Aberto agora', closed: 'Fechado', address: '4045 Dorrego Ave', closedMsg: 'Fechado no momento', clear: 'Esvaziar', qty: 'Qtd' },
    ru: { cart: 'Ваш заказ', empty: 'Корзина пуста', total: 'Итого', order: 'Подтвердить заказ', add: 'Добавить', unavailable: 'Недоступно', openNow: 'Открыто', closed: 'Закрыто', address: '4045 Dorrego Ave', closedMsg: 'В данный момент закрыто', clear: 'Очистить', qty: 'Кол' },
    de: { cart: 'Ihre Bestellung', empty: 'Ihr Warenkorb ist leer', total: 'Gesamt', order: 'Bestellung bestätigen', add: 'Hinzufügen', unavailable: 'Nicht verfügbar', openNow: 'Jetzt geöffnet', closed: 'Geschlossen', address: '4045 Dorrego Ave', closedMsg: 'Momentan geschlossen', clear: 'Leeren', qty: 'Menge' },
  }[lang];

  const getLocalizedName = (item) => {
    if (lang === 'en' && item.nameEn) return item.nameEn;
    if (lang === 'pt' && item.namePt) return item.namePt;
    if (lang === 'ru' && item.nameRu) return item.nameRu;
    if (lang === 'de' && item.nameDe) return item.nameDe;
    return item.name;
  };

  const getLocalizedDescription = (item) => {
    if (lang === 'en' && item.descriptionEn) return item.descriptionEn;
    if (lang === 'pt' && item.descriptionPt) return item.descriptionPt;
    if (lang === 'ru' && item.descriptionRu) return item.descriptionRu;
    if (lang === 'de' && item.descriptionDe) return item.descriptionDe;
    return item.description;
  };

  const getLocalizedLabel = (opt) => {
    if (lang === 'en' && opt.labelEn) return opt.labelEn;
    if (lang === 'pt' && opt.labelPt) return opt.labelPt;
    if (lang === 'ru' && opt.labelRu) return opt.labelRu;
    if (lang === 'de' && opt.labelDe) return opt.labelDe;
    return opt.label;
  };

  const getLocalizedFeatures = (opt) => {
    if (lang === 'en' && opt.featuresEn) return opt.featuresEn;
    if (lang === 'pt' && opt.featuresPt) return opt.featuresPt;
    if (lang === 'ru' && opt.featuresRu) return opt.featuresRu;
    if (lang === 'de' && opt.featuresDe) return opt.featuresDe;
    return opt.features;
  };

  const addToCart = (item, option) => {
    playAddToCartSound();
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && i.optionId === option.id);
      if (existing) {
        return prev.map(i => i.id === item.id && i.optionId === option.id
          ? { ...i, qty: i.qty + 1 }
          : i
        );
      }
      return [...prev, {
        id: item.id,
        name: getLocalizedName(item),
        optionId: option.id,
        optionLabel: getLocalizedLabel(option),
        price: option.price,
        qty: 1
      }];
    });
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const updateQty = (index, delta) => {
    setCart(prev => {
      const item = prev[index];
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      return prev.map((it, i) => i === index ? { ...it, qty: newQty } : it);
    });
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // Filter available items and options
  const availableItems = useMemo(() => {
    return menuItems
      .filter(item => item.available !== false)
      .map(item => ({
        ...item,
        options: item.options.filter(opt => opt.available !== false)
      }))
      .filter(item => item.options.length > 0);
  }, [menuItems]);

  // Skeleton loading state
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <header className="bg-black text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
          <div className="h-6 w-40 bg-white/20 rounded animate-pulse" />
          <div className="h-10 w-10 bg-white/20 rounded-full animate-pulse" />
        </header>
        <main className="max-w-5xl mx-auto p-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2 pt-2">
                    <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 font-sans text-gray-900">
      {/* Header */}
      <header className="bg-black text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight">{siteSettings.brandName || 'Tu Negocio'}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {businessHours.enabled ? (
              <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full ${isOpenNow ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isOpenNow ? t.openNow : t.closed}
              </span>
            ) : null}
            <span className="text-xs md:text-sm text-gray-300">{t.address}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-full transition text-sm font-bold">
              <Globe size={14} />
              {lang.toUpperCase()}
            </button>
            <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden hidden group-hover:flex flex-col min-w-[120px]">
              {[
                { code: 'es', label: '🇦🇷 ES' },
                { code: 'en', label: '🇺🇸 EN' },
                { code: 'pt', label: '🇧🇷 PT' },
                { code: 'ru', label: '🇷🇺 RU' },
                { code: 'de', label: '🇩🇪 DE' },
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-4 py-2.5 text-left text-sm font-bold transition hover:bg-gray-50 ${lang === l.code ? 'text-green-600 bg-green-50' : 'text-gray-700'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            aria-label="Compartir"
          >
            <Share2 size={20} />
          </button>

          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Closed Banner */}
      {!isOpenNow && businessHours.enabled && (
        <div className="bg-red-50 border-b border-red-100 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-red-700 text-sm font-bold">
            <Clock size={16} />
            <span>{t.closedMsg} — {nextOpeningText}</span>
          </div>
        </div>
      )}

      {/* Dynamic Menu Grid */}
      <main className="max-w-5xl mx-auto p-4 space-y-8 mt-6">
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableItems.map(item => {
              const images = resolveImagesForProduct(item);
              const isUnavailable = item.available === false;
              return (
                <div key={item.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>

                  {/* Image Section */}
                  {images && images.length > 0 ? (
                    <img
                      src={images[0]}
                      alt={getLocalizedName(item)}
                      loading="lazy"
                      className="w-full h-48 object-cover bg-gray-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold">{getLocalizedName(item)}</h3>
                        {item.badge && (
                          <span className="shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                            <Flame size={10} />
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">
                        {getLocalizedDescription(item)}
                      </p>
                    </div>

                    <div className="space-y-2 mt-auto">
                      {item.options.map((opt) => {
                        const optUnavailable = opt.available === false;
                        return (
                          <div key={opt.id} className={`flex justify-between items-center p-2 rounded-lg transition border border-gray-100 ${optUnavailable ? 'bg-gray-100 opacity-60' : 'bg-gray-50 hover:bg-gray-100'}`}>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold">{getLocalizedLabel(opt)}</span>
                              {getLocalizedFeatures(opt) && (
                                <span className="text-xs text-gray-400">{getLocalizedFeatures(opt).join(', ')}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-black text-green-600">${opt.price.toLocaleString('es-AR')}</span>
                              {optUnavailable ? (
                                <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded">{t.unavailable}</span>
                              ) : (
                                <button
                                  onClick={() => addToCart(item, opt)}
                                  className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition shadow-sm"
                                  aria-label={t.add}
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <GlobalFooter
        brandName={siteSettings.brandName}
        address={siteSettings.brandAddress}
        instagram={siteSettings.brandInstagram}
        googleMaps={siteSettings.brandGoogleMaps}
      />

      {/* Cart Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">{t.cart}</h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition"
                  >
                    {t.clear}
                  </button>
                )}
                <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-black p-1">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">{t.empty}</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b pb-4 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.optionLabel}</div>
                      <div className="text-xs font-bold text-green-600 mt-1">${item.price.toLocaleString('es-AR')} c/u</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-sm">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(idx, -1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition"
                          aria-label="Restar"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          className="p-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition"
                          aria-label="Sumar"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition ml-1"
                          aria-label="Eliminar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center text-xl font-black mb-6">
                <span>{t.total}</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
              <button
                disabled={cart.length === 0 || !isOpenNow}
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg"
              >
                <Send size={20} />
                {isOpenNow ? t.order : t.closed}
              </button>
              {!isOpenNow && cart.length > 0 && (
                <p className="text-xs text-center text-red-500 font-medium mt-2">
                  {t.closedMsg}. {nextOpeningText}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        whatsappNumber={WHATSAPP_NUMBER}
        bankAlias={BANK_ALIAS}
        onOrderSent={() => setCart([])}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
}
