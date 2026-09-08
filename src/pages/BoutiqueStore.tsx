import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronLeft, MapPin, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { AppVersionStamp } from '../components/AppVersionBadge';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';

type CartLine = {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
};

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});


/**
 * Design tokens — palette from the subject's world (Olivos: vegetación/cemento/cartón),
 * NOT the default cream+terracotta cluster. See .tmp-design-plan.md.
 *   oliva #575D4E · cemento #E9E7E0 · tinta #23261F · etiqueta #F8F6F1 · arena #D8D2C4 · alfiler #B5453C
 */
const TOK = {
  oliva: '#575D4E',
  cemento: '#E9E7E0',
  tinta: '#23261F',
  etiqueta: '#F8F6F1',
  arena: '#D8D2C4',
  alfiler: '#B5453C',
} as const;

type SheetItem = { item: MenuItemType; galleryIndex: number };

/**
 * BoutiqueStore — progressive-disclosure storefront engine for clothing demos.
 * Flow: category rail → product grid (photo + name + price) → product sheet
 * (gallery + talle selector) → cart bar → CheckoutModal (WhatsApp-first, demo-persisted).
 * Data-driven: Manacar today; La Inmaculada/future clothing demos change only demo config.
 */
export default function BoutiqueStore() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId, features } = usePlan();
  const canOrder = features.canOrder;
  const demo = getDemoByTenantId(tenantId);
  const theme = demo?.theme;
  const copy = demo?.copy;

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* ignore */ }
    return [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sheet, setSheet] = useState<SheetItem | null>(null);
  const [sheetGalleryIndex, setSheetGalleryIndex] = useState(0);
  const [sheetTalle, setSheetTalle] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    document.title = siteSettings.brandName
      ? `${siteSettings.brandName} — Tienda online`
      : 'Gatrivi.com — Tienda online';
  }, [siteSettings.brandName]);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, cartKey]);

  const categories = useMemo(
    () => [...menuCategories].sort((a, b) => a.sortOrder - b.sortOrder),
    [menuCategories],
  );

  // Default to first category with items (light theme pages: no dark default)
  useEffect(() => {
    if (selectedCategory) return;
    const first = categories.find(cat => menuItems.some(i => i.category === cat.id));
    if (first) setSelectedCategory(first.id);
  }, [categories, menuItems, selectedCategory]);

  const gridItems = useMemo(() => {
    if (!selectedCategory) return [];
    return menuItems.filter(item => item.category === selectedCategory && item.available !== false);
  }, [menuItems, selectedCategory]);

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const cartTotal = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  const openSheet = (item: MenuItemType) => {
    setSheet({ item, galleryIndex: 0 });
    setSheetGalleryIndex(0);
    setSheetTalle(null);
  };

  const closeSheet = () => setSheet(null);

  const addToCart = (item: MenuItemType, option: MenuOption) => {
    setCart(prev => {
      const index = prev.findIndex(line => line.id === item.id && line.optionId === option.id);
      if (index >= 0) return prev.map((line, i) => (i === index ? { ...line, qty: line.qty + 1 } : line));
      return [...prev, { id: item.id, name: item.name, optionId: option.id, optionLabel: option.label, price: option.price, qty: 1 }];
    });
    setSheet(null);
  };

  const changeQty = (index: number, delta: number) => {
    setCart(prev =>
      prev
        .map((line, i) => (i === index ? { ...line, qty: line.qty + delta } : line))
        .filter(line => line.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface text-text-primary">
        Demo no configurada.
      </div>
    );
  }

  const sheetOption = sheet ? sheet.item.options.find(o => o.id === sheetTalle) ?? null : null;

  const sheetSoldOut = sheetOption ? sheetOption.available === false : false;
  const sheetLowStock = sheet?.item.badge === 'Últimos talles';

  // Hero collage: las 3 primeras prendas con foto del catálogo (la mercadería es el héroe)
  const heroCollage = useMemo(
    () => menuItems.filter(item => item.available !== false && item.images.length > 0).slice(0, 3),
    [menuItems],
  );

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: TOK.cemento, color: TOK.tinta }}>
      <DemoRibbon />

      {/* StoreHeader — sello de boutique, 56px quieto */}
      <header className="sticky top-0 z-20 border-b backdrop-blur" style={{ backgroundColor: `${TOK.cemento}F2`, borderColor: TOK.arena }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            {siteSettings.brandLogo ? (
              <img src={siteSettings.brandLogo} alt="" className="h-10 w-10 rounded-full object-cover" style={{ border: `1px solid ${TOK.arena}` }} />
            ) : (
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta, fontFamily: siteSettings.brandFont }}
              >
                {demo.monogram}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-tight" style={{ fontFamily: siteSettings.brandFont }}>
                {siteSettings.brandName || 'Boutique'}
              </p>
              {!demo.hideAddress && siteSettings.brandAddress ? (
                <p className="mt-0.5 flex items-center gap-1 text-[11px]" style={{ color: `${TOK.tinta}66` }}>
                  <MapPin size={11} /> {siteSettings.brandAddress}
                </p>
              ) : null}
            </div>
          </div>
          {canOrder && cartCount > 0 ? (
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[13px] font-bold"
              style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta }}
            >
              <ShoppingBag size={15} />
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{cartCount}</span>
            </button>
          ) : null}
        </div>
      </header>

      {/* Hero — thesis: la mercadería es el héroe. Collage de 3 fotos reales del catálogo; título corto, display face solo acá. */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
        <div className="grid grid-cols-[1.2fr_1fr] items-end gap-2 sm:gap-3">
          {heroCollage.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openSheet(item)}
              className={`group relative overflow-hidden rounded-xl ${i === 0 ? 'row-span-2 aspect-[3/4]' : 'aspect-[4/3]'}`}
              aria-label={`Ver ${item.name}`}
            >
              <img
                src={item.images[0]}
                alt={item.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                style={{ objectPosition: 'center 30%' }}
              />
              <span
                className="absolute bottom-2 left-2 rounded-full px-2.5 py-1 text-[10px] font-bold backdrop-blur"
                style={{ backgroundColor: `${TOK.etiqueta}E6`, color: TOK.tinta }}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
        <h1 className="mt-6 max-w-xl text-[1.35rem] font-bold leading-[1.15] tracking-[-0.015em] sm:text-4xl" style={{ fontFamily: siteSettings.brandFont }}>
          {copy.heroTitle}
        </h1>
        <p className="mt-2 max-w-lg text-[13px] leading-relaxed sm:text-sm" style={{ color: `${TOK.tinta}99` }}>
          {copy.heroBody}
        </p>
      </section>

      {/* CategoryRail — etiquetas planas, sticky, sin scrollbar visible */}
      <nav aria-label="Categorías" className="sticky top-14 z-10 mt-7 border-y backdrop-blur" style={{ borderColor: TOK.arena, backgroundColor: `${TOK.cemento}F2` }}>
        <div className="scrollbar-none mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2.5 sm:px-6">
          {categories.map(category => {
            const active = category.id === selectedCategory;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className="min-h-9 shrink-0 whitespace-nowrap rounded-full border px-4 text-[13px] font-semibold transition"
                style={active
                  ? { backgroundColor: TOK.oliva, borderColor: TOK.oliva, color: TOK.etiqueta }
                  : { borderColor: TOK.arena, color: `${TOK.tinta}B3` }}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ProductGrid — cards: foto + nombre + precio. Nada más (brief). */}
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6">
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
          {gridItems.map(item => {
            const price = item.options[0]?.price;
            const soldOutAll = item.options.every(o => o.available === false);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openSheet(item)}
                className="group text-left"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg" style={{ backgroundColor: TOK.arena }}>
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  {item.badge ? (
                    <span className="absolute left-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: `${TOK.etiqueta}F0`, color: TOK.tinta }}>
                      {item.badge}
                    </span>
                  ) : null}
                  {soldOutAll ? (
                    <span className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${TOK.etiqueta}F0`, color: TOK.alfiler }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TOK.alfiler }} />
                      Sin stock
                    </span>
                  ) : null}
                </div>
                <div className="mt-2 px-0.5">
                  <p className="truncate text-[13px] font-semibold leading-tight">{item.name}</p>
                  <p className="mt-0.5 text-[13px]" style={{ color: `${TOK.tinta}80`, fontVariantNumeric: 'tabular-nums' }}>
                    {price != null ? money.format(price) : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        {gridItems.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: `${TOK.tinta}66` }}>
            Todavía no subimos fotos de esta línea. Escribinos y te la pasamos.
          </p>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t py-10 text-center" style={{ borderColor: TOK.arena }}>
        <p className="text-sm font-bold" style={{ fontFamily: siteSettings.brandFont }}>{siteSettings.brandName}</p>
        {!demo.hideAddress && siteSettings.brandAddress ? (
          <p className="mt-1 text-xs" style={{ color: `${TOK.tinta}66` }}>{siteSettings.brandAddress}</p>
        ) : null}
        <p className="mt-3 text-xs" style={{ color: `${TOK.tinta}55` }}>
          Demo Gatrivi.com · {copy.ribbonLabel}
        </p>
      </footer>

      {/* CartBar — pill flotante bottom (mobile), aparece tras el primer add */}
      {canOrder && cartCount > 0 && !cartOpen && !checkoutOpen && !sheet ? (
        <div className="fixed bottom-3 left-0 right-0 z-30 px-3 md:hidden">
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="mx-auto flex min-h-13 w-full max-w-md items-center justify-between rounded-full px-5 text-sm font-bold shadow-lg"
            style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta }}
          >
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>
              Llevás {cartCount} {cartCount === 1 ? 'prenda' : 'prendas'} — {money.format(cartTotal)}
            </span>
            <span className="inline-flex items-center gap-1">Ver carrito <ChevronDown size={15} className="-rotate-90" /></span>
          </button>
        </div>
      ) : null}

      {/* Cart drawer */}
      {canOrder && cartOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <div className="flex h-full w-full max-w-md flex-col shadow-2xl" style={{ backgroundColor: TOK.etiqueta }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: `1px solid ${TOK.arena}` }}>
              <h2 className="text-lg font-bold" style={{ fontFamily: siteSettings.brandFont }}>Tu carrito</h2>
              <button type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)} className="rounded-lg border p-1.5" style={{ borderColor: TOK.arena, color: `${TOK.tinta}99` }}>
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm" style={{ color: `${TOK.tinta}66` }}>Todavía no agregaste nada.</p>
              ) : (
                cart.map((line, index) => (
                  <div key={`${line.id}-${line.optionId}`} className="flex items-start justify-between gap-3 pb-3" style={{ borderBottom: `1px solid ${TOK.arena}` }}>
                    <div>
                      <p className="text-sm font-bold">{line.qty} × {line.name}</p>
                      <p className="text-xs" style={{ color: `${TOK.tinta}80` }}>{line.optionLabel}</p>
                      <p className="mt-1 text-sm font-bold" style={{ color: TOK.oliva, fontVariantNumeric: 'tabular-nums' }}>{money.format(line.price * line.qty)}</p>
                    </div>
                    <div className="flex gap-1.5">
                      <button type="button" aria-label="Quitar uno" onClick={() => changeQty(index, -1)} className="rounded-lg border p-1.5" style={{ borderColor: TOK.arena, color: `${TOK.tinta}B3` }}>
                        <Minus size={14} />
                      </button>
                      <button type="button" aria-label="Agregar uno" onClick={() => changeQty(index, +1)} className="rounded-lg border p-1.5" style={{ borderColor: TOK.arena, color: `${TOK.tinta}B3` }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-5" style={{ borderTop: `1px solid ${TOK.arena}` }}>
              <div className="mb-1 flex justify-between text-lg font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span>{copy.totalLabel}</span>
                <span>{money.format(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs" style={{ color: `${TOK.tinta}80` }}>{copy.totalHint}</p>
              <button
                type="button"
                disabled={!cart.length}
                onClick={() => {
                  setCartOpen(false);
                  setCheckoutOpen(true);
                }}
                className="flex min-h-12 w-full items-center justify-center rounded-full text-sm font-bold disabled:opacity-40"
                style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta }}
              >
                {copy.cartCta}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ProductSheet — full-screen mobile / modal desktop. Firma: talles como etiquetas de cartón colgadas. */}
      {sheet ? (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={closeSheet}>
          <div
            className="absolute inset-x-0 bottom-0 flex max-h-[92dvh] flex-col rounded-t-2xl shadow-2xl sm:inset-x-auto sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:max-h-[88dvh] sm:w-[880px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl"
            style={{ backgroundColor: TOK.etiqueta }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6" style={{ borderBottom: `1px solid ${TOK.arena}` }}>
              <button type="button" onClick={closeSheet} className="inline-flex items-center gap-1 text-sm font-semibold sm:hidden" style={{ color: `${TOK.tinta}99` }}>
                <ChevronLeft size={18} /> Volver
              </button>
              <p className="hidden text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: `${TOK.tinta}66` }}>
                {categories.find(cat => cat.id === sheet.item.category)?.name}
              </p>
              <button type="button" aria-label="Cerrar" onClick={closeSheet} className="hidden rounded-lg border p-1.5 sm:block" style={{ borderColor: TOK.arena, color: `${TOK.tinta}99` }}>
                <X size={16} />
              </button>
            </div>

            <div className="grid flex-1 overflow-y-auto sm:grid-cols-2">
              {/* ProductGallery — swipe móvil (snap), grande en desktop */}
              <div style={{ backgroundColor: TOK.arena }} className="sm:rounded-l-2xl">
                <div className="scrollbar-none flex snap-x snap-mandatory overflow-x-auto">
                  {sheet.item.images.map((src, index) => (
                    <img
                      key={src + index}
                      src={src}
                      alt={index === 0 ? sheet.item.name : ''}
                      className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
                    />
                  ))}
                </div>
                {sheet.item.images.length > 1 ? (
                  <div className="flex justify-center gap-1.5 py-2">
                    {sheet.item.images.map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 w-1.5 rounded-full transition"
                        style={{ backgroundColor: index === sheetGalleryIndex ? TOK.tinta : `${TOK.tinta}33` }}
                      />
                    ))}
                  </div>
                ) : null}
              </div>

              {/* VariantSelector + AddToCart */}
              <div className="flex flex-col p-5 sm:p-7">
                {sheet.item.badge && sheetLowStock ? (
                  <span className="mb-2 w-fit rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta }}>
                    {sheet.item.badge}
                  </span>
                ) : null}
                <h2 className="text-2xl font-bold tracking-tight" style={{ fontFamily: siteSettings.brandFont }}>{sheet.item.name}</h2>
                <p className="mt-1 text-xl font-bold" style={{ color: TOK.oliva, fontVariantNumeric: 'tabular-nums' }}>
                  {money.format(sheet.item.options[0]?.price ?? 0)}
                </p>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: `${TOK.tinta}A6` }}>{sheet.item.description}</p>

                {/* Firma: hilo + etiquetas de cartón. El talle elegido rota -3deg como tag agarrado. */}
                <div className="mt-5 flex items-center gap-2">
                  <svg width="26" height="10" viewBox="0 0 26 10" fill="none" aria-hidden="true" className="shrink-0">
                    <path d="M1 9 C 8 9, 12 3, 25 2" stroke={TOK.arena} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: `${TOK.tinta}73` }}>Talle</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {sheet.item.options.map(opt => {
                    const on = opt.id === sheetTalle;
                    const out = opt.available === false;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSheetTalle(opt.id)}
                        disabled={out}
                        title={out ? 'Sin stock' : undefined}
                        aria-pressed={on}
                        className="relative min-h-11 min-w-14 rounded-lg border px-3 text-sm font-bold transition-all duration-200"
                        style={{
                          backgroundColor: on && !out ? TOK.oliva : TOK.etiqueta,
                          borderColor: out ? TOK.arena : on ? TOK.oliva : `${TOK.arena}`,
                          color: out ? `${TOK.tinta}4D` : on ? TOK.etiqueta : `${TOK.tinta}CC`,
                          textDecoration: out ? 'line-through' : undefined,
                          cursor: out ? 'not-allowed' : undefined,
                          transform: on && !out ? 'rotate(-3deg)' : undefined,
                          boxShadow: on && !out ? '0 2px 6px rgba(35,38,31,0.18)' : undefined,
                        }}
                      >
                        {/* ojo de la etiqueta: perforado rojo si sin stock, agujero normal si no */}
                        <span
                          className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: out ? TOK.alfiler : `${TOK.tinta}26` }}
                        />
                        {opt.label.replace(/^Talle\s+/, '')}
                      </button>
                    );
                  })}
                </div>
                {sheetLowStock ? (
                  <p className="mt-2 text-xs font-semibold" style={{ color: TOK.oliva }}>Quedan pocos talles — te lo confirmamos por WhatsApp.</p>
                ) : null}

                <div className="mt-auto pt-6">
                  <button
                    type="button"
                    disabled={!canOrder || !sheetOption || sheetSoldOut}
                    onClick={() => sheetOption && addToCart(sheet.item, sheetOption)}
                    className="flex min-h-13 w-full items-center justify-center rounded-full text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ backgroundColor: TOK.oliva, color: TOK.etiqueta }}
                  >
                    {!canOrder
                      ? 'Consultar por WhatsApp'
                      : sheetSoldOut
                        ? 'Sin stock en este talle'
                        : sheetTalle
                          ? `Agregar al carrito — ${money.format(sheetOption.price)}`
                          : 'Elegí un talle'}
                  </button>
                  <p className="mt-2 text-center text-xs" style={{ color: `${TOK.tinta}73` }}>
                    {canOrder ? '¿Dudas con el talle? Te lo confirmamos por WhatsApp.' : 'En la tienda real este botón abre el WhatsApp del local.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {canOrder ? (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cart={cart}
          total={cartTotal}
          subtotal={cartTotal}
          discount={0}
          whatsappNumber={siteSettings.whatsappNumber ?? ''}
          bankAlias=""
          mpEnabled={false}
          initialDeliveryType="pickup"
          onOrderSent={() => setCart([])}
        />
      ) : null}

      <AppVersionStamp />
    </div>
  );
}
