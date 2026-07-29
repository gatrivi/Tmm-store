import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Send, Globe, Clock, Share2, Flame, CheckCircle, MessageCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { usePlan } from '../context/PlanContext';
import { resolveImagesForProduct } from '../utils/imageLoader';
import { useBusinessHours } from '../hooks/useBusinessHours';
import { startSession, trackPageView } from '../utils/analyticsTracker';
import CheckoutModal from '../components/CheckoutModal';
import ShareModal from '../components/ShareModal';
import { GlobalFooter } from '../components/GlobalFooter';
import { AIAssistant } from '../components/AIAssistant';
import { ThemeToggle } from '../components/ThemeToggle';
import { MenuCategoryNav, useCategoryScrollSpy } from '../components/MenuCategoryNav';
import { resolveStorefrontCategories } from '../utils/menuImport';
import { playAddToCartSound } from '../utils/sounds';
import { translations } from '../i18n/translations';
import { calculateDiscount } from '../types/promotion';
import { parseMenuLayout } from '../utils/menuLayouts';
import type { MenuLayoutId } from '../utils/menuLayouts';
import { BrandLogoMark } from '../components/BrandLogoMark';
import { useTheme } from '../context/ThemeContext';
import { getDemoByTenantId, isDemoTenant, resolveTenantIdFromPath } from '../utils/demoRegistry';
import { parseProspectDemo } from '../utils/prospectDemo';

export default function Storefront() {
  const { menuItems, menuCategories, siteSettings, promotions } = useMenu();
  const { language, setLanguage } = useLanguage();
  const { features, tenantId } = usePlan();
  const { setTheme } = useTheme();
  const canOrder = features.canOrder;
  const mpEnabled = features.canUseMercadoPago && siteSettings.mpEnabled;
  const vertical = getDemoByTenantId(tenantId);
  const prospect = useMemo(
    () => (tenantId === 'demo' && !vertical ? parseProspectDemo(window.location.search) : null),
    [tenantId, vertical],
  );
  const preset = prospect?.preset ?? null;
  const demoCopy = vertical?.copy ?? preset?.copy;
  const forceOpen = Boolean(vertical?.forceOpen || preset);
  const cartStorageKey = isDemoTenant(tenantId)
    ? `trufi_cart:${tenantId}`
    : 'elpuestito_cart';

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<typeof promotions[0] | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  const [cart, setCart] = useState(() => {
    try {
      const tid = resolveTenantIdFromPath(window.location.pathname);
      const key = isDemoTenant(tid) ? `trufi_cart:${tid}` : 'elpuestito_cart';
      const raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch { /* ignore */ }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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
    if (!canOrder) return;
    try {
      localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, canOrder, cartStorageKey]);

  const WHATSAPP_NUMBER = siteSettings.whatsappNumber || import.meta.env.VITE_WHATSAPP_NUMBER || '';
  const BANK_ALIAS = siteSettings.bankAlias || import.meta.env.VITE_BANK_ALIAS || '';

  // Default language to 'es' if null (avoid blocking modal in this flow)
  const lang = language || 'es';

  const { hours: businessHours, isOpen: isOpenNowRaw, nextOpening: nextOpeningText, summary: hoursSummary } = useBusinessHours(lang);
  const isOpenNow = forceOpen ? true : isOpenNowRaw;

  // Dynamic page title from branding
  useEffect(() => {
    const name = siteSettings.brandName?.trim();
    document.title = name ? `${name} — Menú online` : 'Gatrivi.com — Tienda online';
  }, [siteSettings.brandName]);

  // Carnicería: light only (no restaurante oscuro)
  useEffect(() => {
    if (vertical) setTheme('light');
  }, [vertical, setTheme]);

  // Apply branding CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-brand-green', siteSettings.brandColor);
    root.style.setProperty('--color-brand-black', siteSettings.brandColorDark);
    root.style.setProperty('--color-brand-white', siteSettings.brandColorLight);
    root.style.setProperty('--brand-color', siteSettings.brandColor);
    root.style.setProperty('--brand-color-dark', siteSettings.brandColorDark);
    root.style.setProperty('--brand-color-light', siteSettings.brandColorLight);
    root.style.setProperty('--brand-accent', siteSettings.brandAccent);
    root.style.setProperty('--brand-text', siteSettings.brandTextColor);
    root.style.setProperty('--brand-font', siteSettings.brandFont);
    if (vertical?.theme) {
      root.style.setProperty('--color-surface', vertical.theme.hueso);
      root.style.setProperty('--color-surface-elevated', '#fffdf9');
      root.style.setProperty('--color-surface-muted', vertical.theme.papel);
      root.style.setProperty('--color-text-primary', vertical.theme.carbon);
      root.style.setProperty('--color-brand-green', vertical.theme.bordo);
    }
    return () => {
      if (vertical?.theme) {
        root.style.removeProperty('--color-surface');
        root.style.removeProperty('--color-surface-elevated');
        root.style.removeProperty('--color-surface-muted');
        root.style.removeProperty('--color-text-primary');
      }
    };
  }, [siteSettings, vertical]);

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

  const getLocalizedFeatures = (opt): string[] => {
    if (lang === 'en' && opt.featuresEn) return opt.featuresEn;
    if (lang === 'pt' && opt.featuresPt) return opt.featuresPt;
    if (lang === 'ru' && opt.featuresRu) return opt.featuresRu;
    if (lang === 'de' && opt.featuresDe) return opt.featuresDe;
    return opt.features ?? [];
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = appliedPromo ? calculateDiscount(appliedPromo, subtotal) : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    const promo = promotions.find(p => p.code === code && p.active);
    if (!promo) {
      setPromoError('Código inválido o expirado');
      setAppliedPromo(null);
      return;
    }
    if (subtotal < promo.minOrderTotal) {
      setPromoError(`Mínimo de compra: $${promo.minOrderTotal.toLocaleString('es-AR')}`);
      setAppliedPromo(null);
      return;
    }
    setAppliedPromo(promo);
    setPromoError(null);
  };

  const handleAIAddToCart = (itemId: string, optionId: string, qty: number) => {
    const item = menuItems.find(m => m.id === itemId);
    const option = item?.options.find(o => o.id === optionId);
    if (!item || !option || item.available === false || option.available === false) return;
    for (let i = 0; i < qty; i += 1) addToCart(item, option);
    if (canOrder) setIsCartOpen(true);
  };

  // Filter available items and options
  const availableItems = useMemo(() => {
    return menuItems
      .filter(item => item.available !== false)
      .map(item => ({
        ...item,
        options: (item.options ?? []).filter(opt => opt.available !== false)
      }))
      .filter(item => item.options.length > 0);
  }, [menuItems]);

  const storefrontCategories = useMemo(() => {
    const cats = resolveStorefrontCategories(menuCategories, availableItems);
    return cats.filter(cat => availableItems.some(item => item.category === cat.id));
  }, [menuCategories, availableItems]);

  const { activeId, scrollToCategory } = useCategoryScrollSpy({
    categories: storefrontCategories.length > 0 ? storefrontCategories : [{ id: 'menu', name: 'Menú', sortOrder: 0 }],
  });

  const menuLayout = parseMenuLayout(siteSettings.menuLayout);

  const sectionContainerClass: Record<MenuLayoutId, string> = {
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    list: 'flex flex-col gap-3',
    magazine: 'grid grid-cols-1 md:grid-cols-2 gap-8',
    compact: 'flex flex-col',
  };

  const renderOptionRows = (item: typeof availableItems[0]) => (
    item.options.map(opt => {
      const optUnavailable = opt.available === false;
      const feats = getLocalizedFeatures(opt);
      return (
        <div key={opt.id} className={`flex justify-between items-center p-2 rounded-lg transition border border-border ${optUnavailable ? 'bg-surface-muted opacity-60' : 'bg-surface-muted hover:bg-white/5'}`}>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold">{getLocalizedLabel(opt)}</span>
            {feats.length > 0 && (
              <span className="text-xs text-text-muted">{feats.join(', ')}</span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-black text-green-400">${opt.price.toLocaleString('es-AR')}</span>
            {optUnavailable ? (
              <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">{t.unavailable}</span>
            ) : canOrder ? (
              <button
                onClick={() => addToCart(item, opt)}
                className="bg-black text-white p-2 rounded-md hover:bg-gray-800 transition shadow-sm"
                aria-label={t.add}
              >
                <Plus size={16} />
              </button>
            ) : null}
          </div>
        </div>
      );
    })
  );

  const renderMenuCard = (item: typeof availableItems[0]) => {
    const images = resolveImagesForProduct(item);
    const isUnavailable = item.available === false;
    const primaryOption = item.options[0];
    const primaryPrice = primaryOption?.price;
    const primaryFeats = primaryOption ? getLocalizedFeatures(primaryOption) : [];

    if (menuLayout === 'compact') {
      return (
        <div key={item.id} className={`py-4 px-1 border-b border-border last:border-0 ${isUnavailable ? 'opacity-60' : ''}`}>
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold">{getLocalizedName(item)}</h3>
                {item.badge && (
                  <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                    <Flame size={9} />
                    {item.badge}
                  </span>
                )}
              </div>
              {getLocalizedDescription(item) && (
                <p className="text-text-secondary text-sm leading-relaxed">{getLocalizedDescription(item)}</p>
              )}
              {primaryFeats.length > 0 && (
                <p className="text-xs text-text-muted mt-1">{primaryFeats.join(' · ')}</p>
              )}
            </div>
            {primaryPrice != null && (
              <span className="font-black text-green-400 text-lg shrink-0">${primaryPrice.toLocaleString('es-AR')}</span>
            )}
          </div>
          {item.options.length > 1 && (
            <div className="space-y-1.5 mt-3">{renderOptionRows(item)}</div>
          )}
        </div>
      );
    }

    if (menuLayout === 'list') {
      return (
        <div key={item.id} className={`flex gap-4 bg-surface-elevated rounded-xl border border-border p-3 ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>
          <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-surface-muted">
            {images.length > 0 ? (
              <img src={images[0]} alt={getLocalizedName(item)} loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-text-muted uppercase text-center px-1">
                {getLocalizedName(item)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-base font-bold mb-1">{getLocalizedName(item)}</h3>
            <p className="text-text-secondary text-xs mb-2 line-clamp-2">{getLocalizedDescription(item)}</p>
            <div className="space-y-1.5 mt-auto">{renderOptionRows(item)}</div>
          </div>
        </div>
      );
    }

    const imageHeight = menuLayout === 'magazine' ? 'h-64' : 'h-48';
    const titleClass = menuLayout === 'magazine' ? 'text-2xl' : 'text-xl';

    return (
      <div key={item.id} className={`bg-surface-elevated rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col ${isUnavailable ? 'opacity-60 grayscale' : ''}`}>
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={getLocalizedName(item)}
            loading="lazy"
            className={`w-full ${imageHeight} object-cover bg-white/10`}
          />
        ) : menuLayout !== 'magazine' ? (
          <div className="w-full h-32 bg-surface-muted flex items-center justify-center text-text-muted text-xs font-bold uppercase tracking-wider">
            {getLocalizedName(item)}
          </div>
        ) : null}
        <div className={`p-5 flex flex-col flex-1 justify-between ${menuLayout === 'magazine' ? 'p-6' : ''}`}>
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={`${titleClass} font-bold`}>{getLocalizedName(item)}</h3>
              {item.badge && (
                <span className="shrink-0 inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">
                  <Flame size={10} />
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-3">
              {getLocalizedDescription(item)}
            </p>
          </div>
          <div className="space-y-2 mt-auto">{renderOptionRows(item)}</div>
        </div>
      </div>
    );
  };

  // Empty menu — guide owner instead of infinite skeleton
  if (!menuItems || menuItems.length === 0) {
    const adminPath = resolveAdminPath(tenantId);
    return (
      <div className="min-h-screen bg-surface pb-24 flex flex-col">
        <header className="bg-black text-white p-4 shadow-md">
          <h1 className="text-xl font-black">{siteSettings.brandName || 'Tu Negocio'}</h1>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
          <p className="text-xl font-bold text-text-primary mb-2">Menú en preparación</p>
          <p className="text-text-secondary text-sm mb-6">
            Todavía no hay productos cargados. Configurá tu carta desde el panel de administración.
          </p>
          <Link
            to={adminPath}
            className="px-6 py-3 bg-brand-green text-white font-bold rounded-xl hover:brightness-110 transition"
          >
            Configurar menú
          </Link>
        </main>
        <GlobalFooter
          brandName={siteSettings.brandName}
          brandLogo={siteSettings.brandLogo}
          address={vertical?.hideAddress ? undefined : siteSettings.brandAddress}
          instagram={siteSettings.brandInstagram}
          googleMaps={vertical ? undefined : siteSettings.brandGoogleMaps}
          hoursSummary={vertical ? undefined : (hoursSummary || undefined)}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-surface pb-24 font-sans text-text-primary"
      data-demo-theme={vertical?.id}
      style={vertical?.theme ? {
        ['--demo-bordo' as string]: vertical.theme.bordo,
        ['--demo-carbon' as string]: vertical.theme.carbon,
        ['--demo-salvia' as string]: vertical.theme.salvia,
        fontFamily: 'system-ui, sans-serif',
      } : undefined}
    >
      {/* MercadoPago Success Banner */}
      {mpSuccess && mpPendingOrder && (
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
      )}

      {(vertical || preset) && demoCopy && (
        <div
          className="px-4 py-2 text-center text-[11px] font-black uppercase tracking-[0.12em]"
          style={{
            backgroundColor: vertical?.theme.carbon ?? siteSettings.brandColor ?? '#171814',
            color: vertical?.theme.hueso ?? '#f2eee6',
          }}
        >
          {demoCopy.ribbonLabel}
        </div>
      )}

      {/* Header */}
      <header className={`sticky top-0 z-10 shadow-md flex justify-between items-center p-4 dark:bg-black dark:text-white light:bg-brand-white light:text-text-primary light:border-b light:border-border ${mpSuccess ? 'mt-[88px] sm:mt-[72px]' : ''}`}
        style={vertical?.theme ? { backgroundColor: vertical.theme.carbon, color: vertical.theme.hueso } : undefined}
      >
        <div className="flex items-center gap-3">
          <BrandLogoMark
            src={siteSettings.brandLogo || '/puestito.png'}
            alt={siteSettings.brandName || 'Logo'}
          />
          <div>
            <p
              className="text-sm font-black tracking-[-0.02em]"
              style={vertical ? { fontFamily: siteSettings.brandFont } : undefined}
            >
              {siteSettings.brandName || 'Tu Negocio'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              {businessHours.enabled && !vertical ? (
                <span className={`inline-flex items-center gap-1 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full ${isOpenNow ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                  {isOpenNow ? t.openNow : t.closed}
                </span>
              ) : null}
              {!vertical?.hideAddress && siteSettings.brandAddress ? (
                <span className="text-xs md:text-sm dark:text-gray-300 light:text-text-secondary">{siteSettings.brandAddress}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!vertical?.hideThemeToggle && <ThemeToggle />}
          {/* Language Switcher */}
          {!vertical?.hideLanguageSwitcher && (
          <div className="relative group">
            <button className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-full transition text-sm font-bold">
              <Globe size={14} />
              {lang.toUpperCase()}
            </button>
            <div className="absolute right-0 top-full mt-2 bg-surface-elevated rounded-xl shadow-xl border border-border overflow-hidden hidden group-hover:flex flex-col min-w-[120px]">
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
                  className={`px-4 py-2.5 text-left text-sm font-bold transition hover:bg-white/5 ${lang === l.code ? 'text-green-400 bg-green-500/10' : 'text-text-secondary'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          )}

          {!vertical?.hideShare && (
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            aria-label={t.share}
          >
            <Share2 size={20} />
          </button>
          )}

          {features.showWhatsAppContact && WHATSAPP_NUMBER && !canOrder && (
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola! Quiero consultar sobre el menú.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-full text-xs font-bold transition"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}

          {canOrder && (
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            style={vertical?.theme ? { backgroundColor: 'rgba(255,255,255,0.12)' } : undefined}
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                style={vertical?.theme ? { backgroundColor: vertical.theme.bordo } : undefined}
              >
                {cart.reduce((sum, item) => sum + item.qty, 0)}
              </span>
            )}
          </button>
          )}
        </div>
      </header>

      {/* Closed Banner */}
      {!isOpenNow && businessHours.enabled && !vertical && !preset && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3">
          <div className="max-w-5xl mx-auto flex items-center gap-2 text-red-300 text-sm font-bold">
            <Clock size={16} />
            <span>{t.closedMsg} — {nextOpeningText}</span>
          </div>
        </div>
      )}

      {vertical && demoCopy && (
        <section className="max-w-5xl mx-auto px-4 pt-6 pb-2">
          <div
            className="overflow-hidden rounded-2xl border border-black/8"
            style={{ backgroundColor: vertical.theme.papel }}
          >
            {vertical.heroImage ? (
              <img
                src={vertical.heroImage}
                alt=""
                className="h-40 w-full object-cover sm:h-52"
                style={{ objectPosition: vertical.heroObjectPosition || 'center' }}
              />
            ) : (
              <div
                className="flex h-36 items-center justify-center sm:h-44"
                style={{ backgroundColor: vertical.theme.bordo, color: vertical.theme.hueso }}
                aria-hidden="true"
              >
                <span
                  className="text-5xl font-bold tracking-tight sm:text-6xl"
                  style={{ fontFamily: siteSettings.brandFont }}
                >
                  {vertical.monogram}
                </span>
              </div>
            )}
            <div className="space-y-3 p-5">
              <h1
                className="text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-3xl"
                style={{ fontFamily: siteSettings.brandFont, color: vertical.theme.carbon }}
              >
                {demoCopy.heroTitle}
              </h1>
              <p className="text-sm leading-relaxed" style={{ color: `${vertical.theme.carbon}cc` }}>
                {demoCopy.heroBody}
              </p>
              <div className="flex flex-wrap gap-2">
                {demoCopy.chips.map(chip => (
                  <span
                    key={chip}
                    className="rounded-full border px-3 py-1 text-xs font-bold"
                    style={{
                      borderColor: `${vertical.theme.salvia}66`,
                      color: vertical.theme.salvia,
                      backgroundColor: `${vertical.theme.hueso}`,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="text-xs font-medium" style={{ color: vertical.theme.salvia }}>
                {demoCopy.weightNotice}
              </p>
            </div>
          </div>
        </section>
      )}

      {!vertical && preset && demoCopy && (
        <section className="max-w-5xl mx-auto px-4 pt-6 pb-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-elevated p-5 space-y-3">
            <h1 className="text-2xl font-bold leading-tight tracking-[-0.03em] sm:text-3xl">
              {demoCopy.heroTitle}
            </h1>
            <p className="text-sm leading-relaxed text-text-secondary">{demoCopy.heroBody}</p>
            <div className="flex flex-wrap gap-2">
              {demoCopy.chips.map(chip => (
                <span
                  key={chip}
                  className="rounded-full border border-border px-3 py-1 text-xs font-bold text-text-secondary"
                >
                  {chip}
                </span>
              ))}
            </div>
            <p className="text-xs font-medium text-text-muted">{demoCopy.weightNotice}</p>
          </div>
        </section>
      )}

      {/* Dynamic Menu — category sections */}
      <main className="max-w-5xl mx-auto p-4 space-y-8 mt-6">
        {storefrontCategories.length > 1 && (
          <MenuCategoryNav
            categories={storefrontCategories}
            activeId={activeId}
            onSelect={scrollToCategory}
          />
        )}

        {storefrontCategories.map(cat => {
          const sectionItems = availableItems.filter(item => item.category === cat.id);
          if (sectionItems.length === 0) return null;
          return (
            <section key={cat.id} id={`menu-section-${cat.id}`} className="scroll-mt-36">
              <h2 className="text-lg md:text-xl font-black text-text-primary uppercase tracking-wide mb-4 pb-2 border-b border-border">
                {cat.name}
              </h2>
              <div className={sectionContainerClass[menuLayout]}>
                {sectionItems.map(item => renderMenuCard(item))}
              </div>
            </section>
          );
        })}

        {storefrontCategories.length === 0 && availableItems.length > 0 && (
          <section>
            <div className={sectionContainerClass[menuLayout]}>
              {availableItems.map(item => renderMenuCard(item))}
            </div>
          </section>
        )}
      </main>

{/* Footer */}
      <GlobalFooter
          brandName={siteSettings.brandName}
          brandLogo={siteSettings.brandLogo}
          address={vertical?.hideAddress ? undefined : siteSettings.brandAddress}
          instagram={siteSettings.brandInstagram}
          googleMaps={vertical ? undefined : siteSettings.brandGoogleMaps}
          hoursSummary={vertical ? undefined : (hoursSummary || undefined)}
        />

      {/* Cart Overlay */}
      {canOrder && isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
          <div className="bg-surface-elevated w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-border flex justify-between items-center bg-surface-muted">
              <h2 className="text-xl font-bold">{t.cart}</h2>
              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition"
                  >
                    {t.clear}
                  </button>
                )}
                <button onClick={() => setIsCartOpen(false)} className="text-text-muted hover:text-text-primary p-1">✕</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-text-muted mt-10">{t.empty}</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start border-b border-border pb-4 gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm truncate">
                        {item.qty} × {item.name}{item.optionLabel ? ` · ${item.optionLabel}` : ''}
                      </div>
                      <div className="text-xs font-bold text-green-400 mt-1">${item.price.toLocaleString('es-AR')} c/u</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-sm">${(item.price * item.qty).toLocaleString('es-AR')}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQty(idx, -1)}
                          className="p-1 bg-surface-muted hover:bg-white/10 rounded text-text-secondary transition"
                          aria-label="Restar"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(idx, 1)}
                          className="p-1 bg-surface-muted hover:bg-white/10 rounded text-text-secondary transition"
                          aria-label="Sumar"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="p-1 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition ml-1"
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

            <div className="p-6 border-t border-border bg-surface-muted">
              <div className="flex justify-between items-center text-xl font-black mb-2">
                <span>{demoCopy?.totalLabel ?? t.total}</span>
                <span>${total.toLocaleString('es-AR')}</span>
              </div>
              {demoCopy?.totalHint && (
                <p className="mb-4 text-xs font-medium text-text-secondary">{demoCopy.totalHint}</p>
              )}
              <button
                disabled={cart.length === 0 || !isOpenNow}
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-white/10 disabled:text-text-muted text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition shadow-lg"
                style={vertical?.theme && cart.length > 0 && isOpenNow ? { backgroundColor: vertical.theme.bordo } : undefined}
              >
                <Send size={20} />
                {isOpenNow ? (demoCopy?.cartCta ?? t.order) : t.closed}
              </button>
              {!isOpenNow && cart.length > 0 && (
                <p className="text-xs text-center text-red-400 font-medium mt-2">
                  {t.closedMsg}. {nextOpeningText}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {canOrder && (
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        subtotal={subtotal}
        discount={discount}
        promoCode={appliedPromo?.code || promoInput}
        onPromoCodeChange={vertical?.hidePromos ? undefined : setPromoInput}
        onApplyPromo={vertical?.hidePromos ? undefined : handleApplyPromo}
        promoError={promoError}
        whatsappNumber={WHATSAPP_NUMBER}
        bankAlias={BANK_ALIAS}
        mpEnabled={mpEnabled}
        onOrderSent={() => { setCart([]); setAppliedPromo(null); setPromoInput(''); }}
      />
      )}

      {!vertical && !preset && <AIAssistant onAddToCart={canOrder ? handleAIAddToCart : undefined} />}

      {/* Share Modal */}
      {!vertical?.hideShare && (
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
      )}
    </div>
  );
}
