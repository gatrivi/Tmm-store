import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Send, Globe, Clock, Share2, Flame, CheckCircle, MessageCircle, Check, Search, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { resolveImagesForProduct } from '../utils/imageLoader';
import { loadBusinessHours, isBusinessOpen, getNextOpeningText } from '../utils/businessHours';
import { startSession, trackPageView } from '../utils/analyticsTracker';
import CheckoutModal from '../components/CheckoutModal';
import ShareModal from '../components/ShareModal';
import { GlobalFooter } from '../components/GlobalFooter';
import { playAddToCartSound } from '../utils/sounds';
import { translations } from '../i18n/translations';

export default function Storefront() {
  const { menuItems, siteSettings, isLoading } = useMenu();
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
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNoteIdx, setEditingNoteIdx] = useState<number | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Detectar retorno de MercadoPago
  const [searchParams, setSearchParams] = useSearchParams();
  const [mpSuccess, setMpSuccess] = useState(false);
  const [mpPendingOrder, setMpPendingOrder] = useState<{ orderId: string; total: number } | null>(null);

  useEffect(() => {
    const status = searchParams.get('mp_status');
    const ref = searchParams.get('mp_ref');
    if (status === 'approved') {
      const pendingRaw = sessionStorage.getItem('elpuestito_mp_pending');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.orderId && (!ref || pending.orderId === ref)) {
            setMpSuccess(true);
            setMpPendingOrder(pending);
          }
        } catch { /* ignore */ }
      }
      // Limpiar query params de la URL sin recargar
      setSearchParams({}, { replace: true });
    } else if (status === 'failure' || status === 'pending') {
      // Limpiar params
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

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
  const nextOpeningText = businessHours.enabled ? getNextOpeningText(businessHours, lang) : '';

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

  const t = translations[lang].storefront;

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
    
    // Feedback visual
    const key = `${item.id}-${option.id}`;
    setAddedItems(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [key]: false }));
    }, 2000);

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
        qty: 1,
        itemNotes: ''
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

  const startEditingNote = (idx: number) => {
    setEditingNoteIdx(idx);
    setNoteDraft(cart[idx]?.itemNotes || '');
  };

  const saveNote = (idx: number) => {
    setCart(prev => prev.map((it, i) => i === idx ? { ...it, itemNotes: noteDraft.trim() } : it));
    setEditingNoteIdx(null);
    setNoteDraft('');
  };

  const cancelNote = () => {
    setEditingNoteIdx(null);
    setNoteDraft('');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const categories = useMemo(() => {
    const cats = new Set(availableItems.map(i => i.category));
    return ['all', ...Array.from(cats)];
  }, [availableItems]);

  const filteredItems = useMemo(() => {
    let items = availableItems;
    if (activeCategory !== 'all') {
      items = items.filter(i => i.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(i =>
        getLocalizedName(i).toLowerCase().includes(q) ||
        getLocalizedDescription(i).toLowerCase().includes(q)
      );
    }
    return items;
  }, [availableItems, activeCategory, searchQuery, getLocalizedName, getLocalizedDescription]);

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
  if (isLoading || !menuItems || menuItems.length === 0) {
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
      {/* MercadoPago Success Banner */}
      {mpSuccess && mpPendingOrder && (
        <>
          {/* Confetti Celebration */}
          <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * window.innerWidth, 
                  rotate: 0,
                  opacity: 1 
                }}
                animate={{ 
                  y: window.innerHeight + 20,
                  x: (Math.random() - 0.5) * 200 + (i * (window.innerWidth / 20)),
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  opacity: 0
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2
                }}
                style={{
                  position: 'absolute',
                  width: Math.random() * 10 + 5,
                  height: Math.random() * 10 + 5,
                  backgroundColor: ['#00bfff', '#00ff7f', '#ffdf00', '#ff69b4', '#7b68ee'][Math.floor(Math.random() * 5)],
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>

          <div className="fixed inset-x-0 top-0 z-50 bg-sky-500 text-white px-4 py-4 shadow-lg">
            <div className="max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} className="shrink-0" />
                <div>
                  <p className="font-bold text-sm">¡Pago aprobado! 🎉</p>
                  <p className="text-xs text-sky-100">
                    Tu pedido #{mpPendingOrder.orderId} por ${mpPendingOrder.total.toLocaleString('es-AR')} fue pagado.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  `Hola, acabo de pagar mi pedido #${mpPendingOrder.orderId} por MercadoPago. Total: $${mpPendingOrder.total.toLocaleString('es-AR')}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 flex items-center gap-2 bg-white text-sky-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-sky-50 transition"
              >
                <MessageCircle size={16} />
                Confirmar por WhatsApp
              </a>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header className={`bg-black text-white p-4 sticky top-0 z-10 shadow-md flex justify-between items-center ${mpSuccess ? 'mt-[88px] sm:mt-[72px]' : ''}`}>
        <div className="flex items-center gap-3">
          {siteSettings.brandLogo ? (
            <img src={siteSettings.brandLogo} alt={siteSettings.brandName || 'Logo'} className="h-8 md:h-10 object-contain" />
          ) : (
            <h1 className="text-xl md:text-2xl font-black tracking-tight">{siteSettings.brandName || 'Tu Negocio'}</h1>
          )}
          <div className="flex items-center gap-2 mt-0.5">
            {businessHours.enabled ? (
              <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full ${isOpenNow ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                {isOpenNow ? t.openNow : t.closed}
              </span>
            ) : null}
            <span className="text-xs md:text-sm text-gray-300">{siteSettings.brandAddress || t.addressDefault}</span>
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
            aria-label={t.share}
          >
            <Share2 size={20} />
          </button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
          >
            <ShoppingCart size={24} />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  <motion.span
                    key={cart.reduce((sum, item) => sum + item.qty, 0)}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    {cart.reduce((sum, item) => sum + item.qty, 0)}
                  </motion.span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
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
      <main className="max-w-5xl mx-auto p-4 space-y-6 mt-4">
        {/* Search + Category Tabs */}
        <div className="space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-green-200 transition-shadow placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          {categories.length > 2 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-bold transition whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat === 'all' ? t.all : t.categories[cat as keyof typeof t.categories] || cat}
                </button>
              ))}
            </div>
          )}
        </div>

        <section>
          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Search size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold px-4">{searchQuery ? `No encontramos resultados para "${searchQuery}"` : 'No hay productos disponibles'}</p>
              <p className="text-gray-400 text-sm mt-1 mb-6 px-4">Probá con otras palabras o explorá las categorías arriba.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition shadow-lg"
              >
                Ver todo el menú
              </button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => {
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
                                  className={`p-2 rounded-md transition shadow-sm relative flex items-center justify-center min-w-[36px] min-h-[36px] ${
                                    addedItems[`${item.id}-${opt.id}`] ? 'bg-green-600 text-white' : 'bg-black text-white hover:bg-gray-800'
                                  }`}
                                  aria-label={t.add}
                                >
                                  <AnimatePresence mode="wait" initial={false}>
                                    {addedItems[`${item.id}-${opt.id}`] ? (
                                      <motion.div
                                        key="check"
                                        initial={{ scale: 0, rotate: -45 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        exit={{ scale: 0, rotate: 45 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Check size={16} />
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="plus"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <Plus size={16} />
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
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
                      {item.itemNotes && (
                        <div className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                          <FileText size={10} />
                          {item.itemNotes}
                        </div>
                      )}
                      {editingNoteIdx === idx ? (
                        <div className="mt-2 space-y-1">
                          <input
                            type="text"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder={t.addNote}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-green-200"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <button onClick={() => saveNote(idx)} className="text-[10px] font-bold text-green-600 hover:text-green-700">Guardar</button>
                            <button onClick={cancelNote} className="text-[10px] font-bold text-gray-400 hover:text-gray-600">Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditingNote(idx)}
                          className="text-[10px] font-bold text-gray-400 hover:text-gray-600 mt-1 flex items-center gap-1 transition"
                        >
                          <FileText size={10} />
                          {item.itemNotes ? t.itemNotes : t.addNote}
                        </button>
                      )}
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
        mpEnabled={siteSettings.mpEnabled}
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
