/**
 * Full site demo — Las Tortas de Mamá Mabel
 * Sections: hero · nosotros · tortas · cursos (FB material) · contacto · pedidos
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Heart,
  Mail,
  MapPin,
  Minus,
  Phone,
  Plus,
  ShoppingCart,
} from 'lucide-react';
import { AIAssistant } from '../components/AIAssistant';
import CheckoutModal from '../components/CheckoutModal';
import { DemoRibbon } from '../components/DemoRibbon';
import { useMenu } from '../context/MenuContext';
import { usePlan } from '../context/PlanContext';
import { useTheme } from '../context/ThemeContext';
import type { MenuItemType, MenuOption } from '../data/menu';
import { getDemoByTenantId } from '../utils/demoRegistry';
import { playAddToCartSound } from '../utils/sounds';

/** lucide sin logos de marca en esta versión */
const InstagramIcon = ({ size = 18, color }: { size?: number; color?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color || 'currentColor'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
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

const ABOUT_GALLERY = [
  '/demos/mamabel/curso-egreso.jpg',
  '/demos/mamabel/torta-canasta.jpg',
  '/demos/mamabel/torta-violeta.jpg',
  '/demos/mamabel/torta-nemo.jpg',
  '/demos/mamabel/bombones.jpg',
  '/demos/mamabel/fb-gallery-01.jpg',
  '/demos/mamabel/fb-gallery-02.jpg',
  '/demos/mamabel/fb-extra.jpg',
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
  const theme = demo?.theme;
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

  const shopItems = useMemo(
    () => menuItems.filter(i => i.category !== 'cursos'),
    [menuItems],
  );
  const courseItems = useMemo(
    () => menuItems.filter(i => i.category === 'cursos'),
    [menuItems],
  );
  const shopCategories = useMemo(
    () => menuCategories.filter(c => c.id !== 'cursos'),
    [menuCategories],
  );

  useEffect(() => {
    setTheme('light');
    document.title = `${siteSettings.brandName || 'Mamá Mabel'} — Sitio`;
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
        if (!next[item.id]) {
          next[item.id] = { optionId: item.options[0]?.id ?? '', qty: 1 };
        }
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
  const accent = siteSettings.brandAccent || '#E8A0BF';
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
      if (idx >= 0) {
        return prev.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
      }
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
      prev
        .map((l, i) => (i === index ? { ...l, qty: l.qty + delta } : l))
        .filter(l => l.qty > 0),
    );
  };

  if (!demo || !theme || !copy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFBFC] text-[#2C2426]">
        Demo Mamá Mabel no configurada.
      </div>
    );
  }

  const filters = [
    { id: 'todos', label: 'Todas' },
    ...shopCategories.map(c => ({ id: c.id, label: c.name })),
  ];

  const renderProductCard = (item: MenuItemType) => {
    const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
    const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
    const img = item.images[0];
    const sized = item.options.length > 1;

    return (
      <article
        key={item.id}
        className="flex flex-col overflow-hidden rounded-3xl border border-black/8 bg-white shadow-sm"
      >
        <div className="aspect-[4/3]" style={{ backgroundColor: theme.papel }}>
          {img ? (
            <img src={img} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full items-center justify-center">
              {siteSettings.brandLogo ? (
                <img src={siteSettings.brandLogo} alt="" className="h-16 w-16 rounded-full object-cover" />
              ) : null}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-black tracking-[-0.02em]">{item.name}</h3>
              {item.badge && (
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase"
                  style={{ backgroundColor: accent, color: theme.carbon }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-black/50">{item.description}</p>
            <p className="mt-2 text-lg font-black" style={{ color: theme.bordo }}>
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
                    className={`min-h-9 rounded-full border px-3 text-[11px] font-bold transition ${
                      on ? 'text-white' : 'border-black/12 bg-white text-black/60'
                    }`}
                    style={on ? { backgroundColor: theme.bordo, borderColor: theme.bordo } : undefined}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          )}
          <div className="mt-auto flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-black/12 bg-white">
              <button
                type="button"
                aria-label="Restar"
                className="flex h-10 w-9 items-center justify-center text-black/55"
                onClick={() =>
                  setCardState(prev => ({
                    ...prev,
                    [item.id]: { optionId: state.optionId, qty: Math.max(1, state.qty - 1) },
                  }))
                }
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center text-sm font-black">{state.qty}</span>
              <button
                type="button"
                aria-label="Sumar"
                className="flex h-10 w-9 items-center justify-center text-black/55"
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
              className="flex min-h-10 flex-1 items-center justify-center rounded-full text-sm font-black text-white"
              style={{ backgroundColor: theme.bordo }}
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
      style={{ backgroundColor: theme.hueso, color: theme.carbon }}
      data-demo-theme="mamabel"
    >
      <DemoRibbon />

      {/* Site nav */}
      <header className="sticky top-0 z-30 border-b border-black/8 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <button type="button" onClick={() => scrollTo('inicio')} className="flex items-center gap-3 text-left">
            {siteSettings.brandLogo ? (
              <img
                src={siteSettings.brandLogo}
                alt=""
                className="h-11 w-11 rounded-full object-cover ring-2 ring-[#E8A0BF]/70"
              />
            ) : null}
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-black/45">Las tortas de</p>
              <p
                className="text-xl leading-none"
                style={{
                  fontFamily: '"Segoe Script", "Apple Chancery", cursive',
                  color: theme.bordo,
                }}
              >
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
                className="rounded-full px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-black/55 transition hover:bg-black/4 hover:text-black"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-black/10 px-3 py-2 text-xs font-bold md:hidden"
              onClick={() => setNavOpen(v => !v)}
            >
              Menú
            </button>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label="Ver pedido"
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-white"
              style={{ backgroundColor: theme.bordo }}
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black"
                  style={{ backgroundColor: accent, color: theme.carbon }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {navOpen && (
          <div className="border-t border-black/8 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV.map(n => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => scrollTo(n.id)}
                  className="rounded-xl px-3 py-3 text-left text-sm font-bold"
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section ref={sectionRefs.inicio} id="inicio" className="relative isolate overflow-hidden scroll-mt-24">
        <img
          src={demo.heroImage || '/demos/mamabel/hero.jpg'}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: demo.heroObjectPosition || 'center 45%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2C2426]/85 via-[#2C2426]/50 to-transparent" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-5 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
          <p
            className="text-sm tracking-wide text-white/80"
            style={{ fontFamily: '"Segoe Script", "Apple Chancery", cursive' }}
          >
            desde la cocina de mamá
          </p>
          <h1
            className="max-w-xl text-3xl font-bold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl"
            style={{ fontFamily: siteSettings.brandFont }}
          >
            {copy.heroTitle}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
            {copy.heroBody}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollTo('tortas')}
              className="inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-black text-white"
              style={{ backgroundColor: theme.bordo }}
            >
              Ver tortas
            </button>
            <button
              type="button"
              onClick={() => scrollTo('cursos')}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 text-sm font-black text-white backdrop-blur"
            >
              Cursos de decoración
            </button>
          </div>
        </div>
      </section>

      {/* Nosotros */}
      <section ref={sectionRefs.nosotros} id="nosotros" className="scroll-mt-24 border-b border-black/8 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: theme.bordo }}>
              Sobre nosotros
            </p>
            <h2
              className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
              style={{ fontFamily: siteSettings.brandFont }}
            >
              El oficio de mamá Mabel, vivo en cada torta.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-black/65 sm:text-base">
              Pastelería familiar: tortas clásicas, decoración artística y talleres donde se enseña el mismo cuidado
              que va a la mesa. Encargás por acá — sabor, tamaño, fecha y dedicatoria — y lo vemos ordenado en la bandeja.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-medium text-black/70">
              <li className="flex items-center gap-2"><Heart size={15} style={{ color: theme.bordo }} /> Decoración a mano</li>
              <li className="flex items-center gap-2"><Heart size={15} style={{ color: theme.bordo }} /> Temáticas y cumpleaños</li>
              <li className="flex items-center gap-2"><Heart size={15} style={{ color: theme.bordo }} /> Cursos con material incluido</li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {ABOUT_GALLERY.slice(0, 4).map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                className={`h-36 w-full rounded-2xl object-cover sm:h-44 ${i === 0 ? 'col-span-2 h-48 sm:h-56' : ''}`}
                loading="lazy"
              />
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {ABOUT_GALLERY.slice(4).map(src => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-28 w-40 shrink-0 rounded-2xl object-cover sm:h-32 sm:w-48"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tortas / shop */}
      <section ref={sectionRefs.tortas} id="tortas" className="scroll-mt-24">
        <div className="mx-auto max-w-6xl px-4 pt-14 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: theme.bordo }}>
                Encargos
              </p>
              <h2
                className="mt-2 text-3xl font-bold tracking-[-0.03em]"
                style={{ fontFamily: siteSettings.brandFont }}
              >
                Tortas y regalos
              </h2>
            </div>
            <div className="flex rounded-full border border-black/10 bg-white p-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`min-h-9 rounded-full px-3 ${fulfillment === 'pickup' ? 'text-white' : 'text-black/55'}`}
                style={fulfillment === 'pickup' ? { backgroundColor: theme.bordo } : undefined}
              >
                Retiro
              </button>
              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`min-h-9 rounded-full px-3 ${fulfillment === 'delivery' ? 'text-white' : 'text-black/55'}`}
                style={fulfillment === 'delivery' ? { backgroundColor: theme.bordo } : undefined}
              >
                Delivery
              </button>
            </div>
          </div>
        </div>

        <nav className="mt-6 border-y border-black/8 bg-white">
          <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 sm:px-6">
            {filters.map(f => {
              const active = categoryId === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCategoryId(f.id)}
                  className={`shrink-0 border-b-2 px-3 py-3.5 text-xs font-black uppercase tracking-[0.06em] ${
                    active ? '' : 'border-transparent text-black/40'
                  }`}
                  style={active ? { borderColor: theme.bordo, color: theme.bordo } : undefined}
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

      {/* Cursos — only because FB material exists */}
      {courseItems.length > 0 && (
        <section
          ref={sectionRefs.cursos}
          id="cursos"
          className="scroll-mt-24 border-y border-black/8"
          style={{ backgroundColor: `${theme.papel}55` }}
        >
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
            <div className="space-y-4">
              <img
                src="/demos/mamabel/curso-flyer.jpg"
                alt="Curso de iniciación a la decoración de tortas"
                className="w-full rounded-3xl border border-black/8 object-cover shadow-sm"
              />
              <img
                src="/demos/mamabel/curso-egreso.jpg"
                alt="Alumnas con tortas del curso"
                className="w-full rounded-3xl border border-black/8 object-cover shadow-sm"
              />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: theme.bordo }}>
                Cursos
              </p>
              <h2
                className="mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl"
                style={{ fontFamily: siteSettings.brandFont }}
              >
                Iniciación a la decoración
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-black/65 sm:text-base">
                Glasé real, buttercream, picos rusos, drip cake y canasta de mimbre. Se proveen materiales;
                te llevás la torta hecha por vos. Material del Facebook de la familia.
              </p>
              <div className="mt-8 space-y-4">
                {courseItems.map(item => {
                  const state = cardState[item.id] ?? { optionId: item.options[0]?.id ?? '', qty: 1 };
                  const option = item.options.find(o => o.id === state.optionId) ?? item.options[0];
                  return (
                    <div key={item.id} className="rounded-3xl border border-black/8 bg-white p-5">
                      <p className="text-lg font-black">{item.name}</p>
                      <p className="mt-1 text-xs text-black/50">{item.description}</p>
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
                              className={`min-h-9 rounded-full border px-3 text-[11px] font-bold ${
                                on ? 'text-white' : 'border-black/12 text-black/60'
                              }`}
                              style={on ? { backgroundColor: theme.bordo, borderColor: theme.bordo } : undefined}
                            >
                              {opt.label} · {formatArs(opt.price)}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => option && addLine(item, option, 1)}
                        className="mt-4 flex min-h-11 w-full items-center justify-center rounded-full text-sm font-black text-white"
                        style={{ backgroundColor: theme.bordo }}
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

      {/* Contacto */}
      <section ref={sectionRefs.contacto} id="contacto" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <p className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: theme.bordo }}>
            Contacto
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-[-0.03em]"
            style={{ fontFamily: siteSettings.brandFont }}
          >
            Hablemos de tu torta
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {wspHref && (
              <a
                href={wspHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-black/8 p-4 transition hover:border-black/20"
              >
                <Phone size={18} style={{ color: theme.bordo }} />
                <span className="text-sm font-bold">11 5619-6941</span>
              </a>
            )}
            <a
              href="mailto:mabelvallejos.reposteria@hotmail.com"
              className="flex items-center gap-3 rounded-2xl border border-black/8 p-4 transition hover:border-black/20"
            >
              <Mail size={18} style={{ color: theme.bordo }} />
              <span className="text-sm font-bold break-all">Mail</span>
            </a>
            {siteSettings.brandInstagram && (
              <a
                href={siteSettings.brandInstagram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-black/8 p-4 transition hover:border-black/20"
              >
                <InstagramIcon size={18} color={theme.bordo} />
                <span className="text-sm font-bold">Instagram</span>
              </a>
            )}
            <a
              href="https://www.facebook.com/lastortasdemamamabel/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-black/8 p-4 transition hover:border-black/20"
            >
              <MapPin size={18} style={{ color: theme.bordo }} />
              <span className="text-sm font-bold">Facebook</span>
            </a>
          </div>
          <p className="mt-8 text-xs text-black/45">
            Demo Trufi — el checkout no envía WhatsApp real. Panel: /demo/mamabel/owner
          </p>
        </div>
      </section>

      <footer className="border-t border-black/8 bg-[#2C2426] py-8 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">
        Las Tortas de Mamá Mabel · Trufi flagship
      </footer>

      {/* Cart */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex justify-end bg-black/45">
          <div className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/8 px-5 py-4">
              <h2 className="text-lg font-black">Tu encargo</h2>
              <button type="button" className="text-sm font-bold text-black/45" onClick={() => setCartOpen(false)}>
                Cerrar
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <p className="text-sm text-black/45">Todavía vacío.</p>
              ) : (
                cart.map((line, idx) => (
                  <div key={`${line.id}-${line.optionId}-${idx}`} className="flex justify-between gap-3 border-b border-black/6 pb-3">
                    <div className="min-w-0">
                      <p className="text-sm font-bold">
                        {line.qty} × {line.name} · {line.optionLabel}
                      </p>
                      <p className="mt-1 text-xs font-bold" style={{ color: theme.bordo }}>
                        {formatArs(line.price * line.qty)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, -1)}>
                        <Minus size={14} />
                      </button>
                      <button type="button" className="rounded border border-black/10 p-1" onClick={() => updateCartQty(idx, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-black/8 p-5">
              <div className="mb-1 flex justify-between text-lg font-black">
                <span>{copy.totalLabel}</span>
                <span>{formatArs(cartTotal)}</span>
              </div>
              <p className="mb-4 text-xs text-black/45">{copy.totalHint}</p>
              <button
                type="button"
                disabled={cart.length === 0}
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="flex min-h-12 w-full items-center justify-center rounded-full text-sm font-black text-white disabled:opacity-40"
                style={{ backgroundColor: theme.bordo }}
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
