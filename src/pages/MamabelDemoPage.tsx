/**
 * Full site — Las Tortas de Mamá Mabel
 * Palette from logo + flyer: cream, cake-pink, watercolor teal, ink.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Mail, MapPin, Minus, Phone, Plus, ShoppingCart } from 'lucide-react';
import { AIAssistant } from '../components/AIAssistant';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

/** Logo/flyer tokens — not inventados */
const MM = {
  cream: '#FBF6F0',
  blush: '#F8E4EB',
  pink: '#E87890',
  pinkSoft: '#F0C0D8',
  teal: '#70A8A0',
  tealDeep: '#4A7A74',
  tealSoft: '#88B8B0',
  ink: '#1C1714',
  mustard: '#C9A24B',
  paper: '#FFFCF8',
} as const;

const FONT_SERIF = '"Cormorant Garamond", Georgia, serif';
const FONT_SCRIPT = '"Great Vibes", "Segoe Script", cursive';
const FONT_UI = '"Nunito Sans", system-ui, sans-serif';

const InstagramIcon = ({ size = 18, color }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

type CartLine = {
  id: string;
  name: string;
  optionId: string;
  optionLabel: string;
  price: number;
  qty: number;
};

type CardState = Record<string, { optionId: string; qty: number }>;

const NAV = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'tortas', label: 'Tortas' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'contacto', label: 'Contacto' },
] as const;

/** Soft brand + top-liked IG (likes desc, filtered Mabel) */
const ABOUT_GALLERY = [
  '/demos/mamabel/torta-canasta.jpg',
  '/demos/mamabel/top-07.jpg',   // 55+ — números quince
  '/demos/mamabel/top-08.jpg',   // 54 — tapestry 30
  '/demos/mamabel/top-03.jpg',   // 188 — barco firma
  '/demos/mamabel/top-04.jpg',   // 146 — barco corte
  '/demos/mamabel/top-01.jpg',   // 630 — sorteo mesa dulce
  '/demos/mamabel/ig-10.jpg',
  '/demos/mamabel/curso-egreso.jpg',
  '/demos/mamabel/top-12.jpg',
  '/demos/mamabel/galletas.jpg',
];

function formatArs(n: number): string {
  return `$${n.toLocaleString('es-AR')}`;
}

function priceLabel(item: MenuItemType): string {
  if (item.options.length > 1) return `desde ${formatArs(item.options[0].price)}`;
  const only = item.options[0];
  return only ? formatArs(only.price) : '';
}

export default function MamabelDemoPage() {
  const { menuItems, menuCategories, siteSettings } = useMenu();
  const { tenantId } = usePlan();
  const { setTheme } = useTheme();
  const demo = getDemoByTenantId(tenantId);
  const copy = demo?.copy;

  const inicioRef = useRef<HTMLElement>(null);
  const nosotrosRef = useRef<HTMLElement>(null);
  const tortasRef = useRef<HTMLElement>(null);
  const cursosRef = useRef<HTMLElement>(null);
  const contactoRef = useRef<HTMLElement>(null);

  const sectionRefs = {
    inicio: inicioRef,
    nosotros: nosotrosRef,
    tortas: tortasRef,
    cursos: cursosRef,
    contacto: contactoRef,
  };

  const cartKey = `trufi_cart:${tenantId}`;
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(cartKey);
      if (raw) return JSON.parse(raw) as CartLine[];
    } catch { /* ignore */ }
    return [];
  });
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('pickup');
  const [categoryId, setCategoryId] = useState('decoradas');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cardState, setCardState] = useState<CardState>({});
  const [navOpen, setNavOpen] = useState(false);

  const shopItems = useMemo(() => menuItems.filter(i => i.category !== 'cursos'), [menuItems]);
  const courseItems = useMemo(() => menuItems.filter(i => i.category === 'cursos'), [menuItems]);
  const shopCategories = useMemo(() => menuCategories.filter(c => c.id !== 'cursos'), [menuCategories]);

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Mamá Mabel'} — Sitio`;
    const id = 'mm-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Nunito+Sans:wght@400;600;700;800&display=swap';
      document.head.appendChild(link);
    }
  }, [setTheme, siteSettings.brandName]);

  useEffect(() => {
    try {
      localStorage.setItem(cartKey, JSON.stringify(cart));
    } catch { /* ignore */ }
  }, [cart, cartKey]);

  useEffect(() => {
    if (!menuItems.length) return;
    setCardState(prev => {
      const next = { ...prev };
      for (const item of menuItems) {
        if (!next[item.id]) next[item.id] = { optionId: item.options[0]?.id ?? '', qty: 1 };
      }
      return next;
    });
  }, [menuItems]);

  const visibleItems = useMemo(() => {
    if (categoryId === 'todos') return shopItems;
    return shopItems.filter(i => i.category === categoryId);
  }, [shopItems, categoryId]);

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const cartTotal = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const wsp = siteSettings.whatsappNumber || '';
  const wspHref = wsp ? `https://wa.me/${wsp}` : undefined;

  const scrollTo = (id: keyof typeof sectionRefs) => {
    setNavOpen(false);
    sectionRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const addLine = (item: MenuItemType, option: MenuOption, qty: number) => {
    if (!option || qty < 1) return;
    playAddToCartSound();
    setCart(prev => {
      const idx = prev.findIndex(l => l.id === item.id && l.optionId === option.id);
      if (idx >= 0) return prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
      return [...prev, {
        id: item.id,
        name: item.name,
        optionId: option.id,
        optionLabel: option.label,
        price: option.price,
        qty,
      }];
    });
  };

  const handleAIAddToCart = (itemId: string, optionId: string, qty: number) => {
    const item = menuItems.find(m => m.id === itemId);
    const option = item?.options.find(o => o.id === optionId);
    if (!item || !option) return;
    addLine(item, option, qty || 1);
    setCartOpen(true);
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev =>
      prev.map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l)).filter(l => l.qty > 0),
    );
  };

  if (!demo || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: MM.cream, color: MM.ink }}>
        Demo Mamá Mabel no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todas' },
    ...shopCategories.map(c => ({ id: c.id, label: c.name })),
  ];

  const dotted = `2px dotted ${MM.tealSoft}`;

  const renderProductCard = (item: MenuItemType) => {
    const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
    const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
    const img = item.images[0];
    const sized = item.options.length > 1;

    return (
      <article
        key={item.id}
        className="flex flex-col overflow-hidden bg-white"
        style={{ border: dotted }}
      >
        <div className="aspect-[4/3]" style={{ backgroundColor: MM.blush }}>
          {img ? (
            <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4" style={{ fontFamily: FONT_UI }}>
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold leading-tight" style={{ fontFamily: FONT_SERIF, color: MM.ink }}>
                {item.name}
              </h3>
              {item.badge && (
                <span
                  className="shrink-0 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white"
                  style={{ backgroundColor: MM.pink }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: `${MM.ink}99` }}>{item.description}</p>
            <p className="mt-2 text-xl font-semibold" style={{ fontFamily: FONT_SERIF, color: MM.tealDeep }}>
              {priceLabel(item)}
            </p>
          </div>
          {sized && (
            <div className="flex flex-wrap gap-1.5">
              {item.options.map(opt => {
                const on = state.optionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setCardState(prev => ({
                        ...prev,
                        [item.id]: { optionId: opt.id, qty: prev[item.id]?.qty ?? 1 },
                      }))
                    }
                    className="min-h-9 px-3 text-[11px] font-bold transition"
                    style={
                      on
                        ? { backgroundColor: MM.teal, color: '#fff', border: `1px solid ${MM.teal}` }
                        : { backgroundColor: MM.paper, color: `${MM.ink}99`, border: `1px solid ${MM.tealSoft}` }
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2">
            <div className="flex items-center border" style={{ borderColor: `${MM.teal}55` }}>
              <button
                type="button"
                aria-label="Restar"
                className="flex h-10 w-9 items-center justify-center"
                style={{ color: MM.tealDeep }}
                onClick={() =>
                  setCardState(prev => ({
                    ...prev,
                    [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) },
                  }))
                }
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-sm font-bold">{state.qty}</span>
              <button
                type="button"
                aria-label="Sumar"
                className="flex h-10 w-9 items-center justify-center"
                style={{ color: MM.tealDeep }}
                onClick={() =>
                  setCardState(prev => ({
                    ...prev,
                    [item.id]: { optionId: state.optionId, qty: state.qty + 1 },
                  }))
                }
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => option && addLine(item, option, state.qty)}
              className="flex min-h-10 flex-1 items-center justify-center text-sm font-extrabold text-white"
              style={{ backgroundColor: MM.pink }}
            >
              Agregar
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: MM.cream, color: MM.ink, fontFamily: FONT_UI }}
      data-demo-theme="mamabel"
    >
      <DemoRibbon />

      <header
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{ backgroundColor: `${MM.cream}f2`, borderBottom: `1px solid ${MM.pinkSoft}88` }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button type="button" onClick={() => scrollTo('inicio')} className="flex items-center gap-3 text-left">
            {siteSettings.brandLogo ? (
              <img
                src={siteSettings.brandLogo}
                alt=""
                className="h-12 w-12 object-contain bg-white p-0.5"
                style={{ border: dotted }}
              />
            ) : null}
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: MM.tealDeep }}>
                Las tortas de
              </p>
              <p className="text-2xl leading-none" style={{ fontFamily: FONT_SCRIPT, color: MM.ink }}>
                mamá mabel
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="px-3 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition hover:opacity-70"
                style={{ color: MM.tealDeep }}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-2 text-xs font-bold md:hidden"
              style={{ border: dotted, color: MM.tealDeep }}
              onClick={() => setNavOpen(v => !v)}
            >
              Menú
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Ver pedido"
              className="relative flex h-11 w-11 items-center justify-center text-white"
              style={{ backgroundColor: MM.pink }}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-extrabold"
                  style={{ backgroundColor: MM.teal, color: '#fff' }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="px-4 py-3 md:hidden" style={{ borderTop: `1px solid ${MM.pinkSoft}` }}>
            {NAV.map(n => (
              <button
                key={n.id}
                type="button"
                onClick={() => scrollTo(n.id)}
                className="block w-full px-3 py-3 text-left text-sm font-bold"
                style={{ color: MM.ink }}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Hero — brand first, cream + logo + canasta */}
      <section
        ref={sectionRefs.inicio}
        id="inicio"
        className="relative isolate scroll-mt-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${MM.cream} 0%, ${MM.blush} 45%, ${MM.cream} 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full opacity-40 blur-3xl"
          style={{ background: MM.tealSoft }}
        />
        <div
          className="pointer-events-none absolute -left-10 bottom-0 h-48 w-48 rounded-full opacity-50 blur-3xl"
          style={{ background: MM.pinkSoft }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:py-24">
          <div className="flex flex-col items-start">
            {siteSettings.brandLogo ? (
              <img
                src={siteSettings.brandLogo}
                alt="Las Tortas de Mamá Mabel"
                className="mb-6 h-28 w-auto object-contain sm:h-36"
              />
            ) : null}
            <p
              className="text-[11px] font-bold uppercase tracking-[0.28em]"
              style={{ color: MM.tealDeep }}
            >
              Las tortas de
            </p>
            <h1
              className="mt-1 text-5xl leading-none sm:text-6xl lg:text-7xl"
              style={{ fontFamily: FONT_SCRIPT, color: MM.ink }}
            >
              mamá mabel
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed sm:text-lg" style={{ fontFamily: FONT_SERIF, color: `${MM.ink}cc` }}>
              {copy.heroBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => scrollTo('tortas')}
                className="inline-flex min-h-12 items-center justify-center px-7 text-sm font-extrabold text-white"
                style={{ backgroundColor: MM.pink }}
              >
                Encargar torta
              </button>
              <button
                type="button"
                onClick={() => scrollTo('cursos')}
                className="inline-flex min-h-12 items-center justify-center px-7 text-sm font-extrabold"
                style={{ color: MM.tealDeep, border: `2px solid ${MM.teal}` }}
              >
                Ver cursos
              </button>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-3 opacity-70"
              style={{ border: `3px dotted ${MM.tealSoft}` }}
            />
            <img
              src="/demos/mamabel/torta-canasta.jpg"
              alt="Torta canasta — firma de Mamá Mabel"
              className="relative w-full object-cover"
              style={{ aspectRatio: '4 / 5', maxHeight: 560 }}
            />
            <p
              className="absolute bottom-4 left-4 right-4 px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] text-white"
              style={{ backgroundColor: `${MM.pink}ee` }}
            >
              Firma · glacé & ruffles
            </p>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section ref={sectionRefs.nosotros} id="nosotros" className="scroll-mt-24" style={{ backgroundColor: MM.paper }}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:py-20">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: MM.teal }}>
              Sobre nosotros
            </p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl" style={{ fontFamily: FONT_SERIF, color: MM.ink }}>
              El oficio de mamá, en cada encargue.
            </h2>
            <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: `${MM.ink}aa` }}>
              Pastelería familiar desde 1979: tortas clásicas, decoración artística y talleres.
              Pedís tamaño, fecha y dedicatoria — la familia lo ve ordenado.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-semibold" style={{ color: MM.tealDeep }}>
              <li className="flex items-center gap-2"><Heart size={15} color={MM.pink} /> Decoración a mano</li>
              <li className="flex items-center gap-2"><Heart size={15} color={MM.pink} /> Temáticas y cumpleaños</li>
              <li className="flex items-center gap-2"><Heart size={15} color={MM.pink} /> Cursos con material incluido</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {ABOUT_GALLERY.slice(0, 5).map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`h-36 w-full object-cover sm:h-44 ${i === 0 ? 'col-span-2 h-48 sm:h-56' : ''}`}
                style={{ border: dotted }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {ABOUT_GALLERY.slice(5).map(src => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-28 w-40 shrink-0 object-cover sm:h-32 sm:w-48"
                style={{ border: dotted }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Shop */}
      <section ref={sectionRefs.tortas} id="tortas" className="scroll-mt-24" style={{ backgroundColor: MM.cream }}>
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: MM.teal }}>
                Encargos
              </p>
              <h2 className="mt-2 text-3xl" style={{ fontFamily: FONT_SERIF }}>
                Tortas y regalos
              </h2>
            </div>
            <div className="flex p-1 text-xs font-bold" style={{ border: dotted, background: MM.paper }}>
              {(['pickup', 'delivery'] as const).map(mode => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFulfillment(mode)}
                  className="min-h-9 px-4"
                  style={
                    fulfillment === mode
                      ? { backgroundColor: MM.teal, color: '#fff' }
                      : { color: MM.tealDeep }
                  }
                >
                  {mode === 'pickup' ? 'Retiro' : 'Delivery'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <nav className="mt-6" style={{ backgroundColor: MM.blush, borderTop: dotted, borderBottom: dotted }}>
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
            {filters.map(f => {
              const active = categoryId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryId(f.id)}
                  className="shrink-0 border-b-2 px-3 py-3.5 text-xs font-extrabold uppercase tracking-[0.08em]"
                  style={
                    active
                      ? { borderColor: MM.pink, color: MM.pink }
                      : { borderColor: 'transparent', color: `${MM.ink}66` }
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="mx-auto grid max-w-6xl gap-5 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {visibleItems.map(renderProductCard)}
        </div>
      </section>

      {courseItems.length > 0 && (
        <section
          ref={sectionRefs.cursos}
          id="cursos"
          className="scroll-mt-24"
          style={{ backgroundColor: MM.blush }}
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-start lg:py-20">
            <div className="space-y-4">
              <img src="/demos/mamabel/curso-flyer.jpg" alt="Flyer curso" className="w-full object-cover" style={{ border: dotted }} />
              <img src="/demos/mamabel/curso-ig.jpg" alt="Curso mensual" className="w-full object-cover" style={{ border: dotted }} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: MM.teal }}>
                Cursos
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl" style={{ fontFamily: FONT_SERIF }}>
                Iniciación a la decoración
              </h2>
              <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: `${MM.ink}aa` }}>
                Glasé real, buttercream, picos rusos, drip y canasta de mimbre.
                Se proveen materiales; te llevás la torta hecha por vos.
              </p>
              <div className="mt-8 space-y-4">
                {courseItems.map(item => {
                  const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
                  const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
                  return (
                    <div key={item.id} className="bg-white p-5" style={{ border: dotted }}>
                      <p className="text-xl" style={{ fontFamily: FONT_SERIF }}>{item.name}</p>
                      <p className="mt-1 text-xs" style={{ color: `${MM.ink}88` }}>{item.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.options.map(opt => {
                          const on = state.optionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() =>
                                setCardState(prev => ({
                                  ...prev,
                                  [item.id]: { optionId: opt.id, qty: 1 },
                                }))
                              }
                              className="min-h-9 px-3 text-[11px] font-bold"
                              style={
                                on
                                  ? { backgroundColor: MM.teal, color: '#fff' }
                                  : { border: `1px solid ${MM.tealSoft}`, color: MM.tealDeep }
                              }
                            >
                              {opt.label} · {formatArs(opt.price)}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => option && addLine(item, option, 1)}
                        className="mt-4 flex min-h-11 w-full items-center justify-center text-sm font-extrabold text-white"
                        style={{ backgroundColor: MM.pink }}
                      >
                        Reservar seña de prueba
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      <section ref={sectionRefs.contacto} id="contacto" className="scroll-mt-24" style={{ backgroundColor: MM.paper }}>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: MM.teal }}>
            Contacto
          </p>
          <h2 className="mt-3 text-3xl" style={{ fontFamily: FONT_SERIF }}>
            Hablemos de tu torta
          </h2>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {wspHref && (
              <a href={wspHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4" style={{ border: dotted }}>
                <Phone size={18} color={MM.pink} />
                <span className="text-sm font-bold">11 5619-6941</span>
              </a>
            )}
            <a href="mailto:mabelvallejos.reposteria@hotmail.com" className="flex items-center gap-3 p-4" style={{ border: dotted }}>
              <Mail size={18} color={MM.pink} />
              <span className="text-sm font-bold">Mail</span>
            </a>
            {siteSettings.brandInstagram && (
              <a href={siteSettings.brandInstagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4" style={{ border: dotted }}>
                <InstagramIcon size={18} color={MM.pink} />
                <span className="text-sm font-bold">Instagram</span>
              </a>
            )}
            <a href="https://www.facebook.com/lastortasdemamamabel/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4" style={{ border: dotted }}>
              <MapPin size={18} color={MM.pink} />
              <span className="text-sm font-bold">Facebook</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center" style={{ backgroundColor: MM.tealDeep, color: `${MM.cream}cc` }}>
        <p className="text-3xl" style={{ fontFamily: FONT_SCRIPT, color: MM.cream }}>mamá mabel</p>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em]">Las tortas de · demo Trufi</p>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
          <div className="flex h-full w-full max-w-md flex-col shadow-2xl" style={{ backgroundColor: MM.cream }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: dotted }}>
              <h2 className="text-xl" style={{ fontFamily: FONT_SERIF }}>Tu encargo</h2>
              <button type="button" className="text-sm font-bold" style={{ color: MM.tealDeep }} onClick={() => setCartOpen(false)}>
                Cerrar
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm" style={{ color: `${MM.ink}88` }}>Todavía vacío.</p>
              ) : (
                cart.map((line, idx) => (
                  <div key={`${line.id}-${line.optionId}-${idx}`} className="flex justify-between gap-3 pb-3" style={{ borderBottom: `1px solid ${MM.pinkSoft}` }}>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{line.qty} × {line.name} · {line.optionLabel}</p>
                      <p className="mt-1 text-xs font-bold" style={{ color: MM.pink }}>{formatArs(line.price * line.qty)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-1" style={{ border: dotted }} onClick={() => updateCartQty(idx, -1)}>
                        <Minus size={14} />
                      </button>
                      <button type="button" className="p-1" style={{ border: dotted }} onClick={() => updateCartQty(idx, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-5" style={{ borderTop: dotted }}>
              <div className="mb-1 flex justify-between text-lg font-bold">
                <span>{copy.totalLabel}</span>
                <span>{formatArs(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs" style={{ color: `${MM.ink}88` }}>{copy.totalHint}</p>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="flex min-h-12 w-full items-center justify-center text-sm font-extrabold text-white disabled:opacity-40"
                style={{ backgroundColor: MM.pink }}
              >
                {copy.cartCta}
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        subtotal={cartTotal}
        discount={0}
        whatsappNumber=""
        bankAlias=""
        mpEnabled={false}
        initialDeliveryType={fulfillment}
        onOrderSent={() => setCart([])}
      />

      <AIAssistant onAddToCart={handleAIAddToCart} />
    </div>
  );
}
