import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Coffee,
  MapPin,
  Minus,
  Plus,
  ReceiptText,
  ShoppingBag,
  UtensilsCrossed,
  X,
} from 'lucide-react';

type Category = 'Cafetería' | 'Desayuno & merienda' | 'Cocina' | 'Dulce' | 'Barra';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  badge?: string;
};

const CATEGORIES: Category[] = ['Cafetería', 'Desayuno & merienda', 'Cocina', 'Dulce', 'Barra'];

const MENU: MenuItem[] = [
  {
    id: 'espresso',
    name: 'Espresso doble',
    description: 'Blend de la casa, cacao y caramelo.',
    price: 4200,
    category: 'Cafetería',
    image: '/demos/panaderia/products/cafe-leche.jpg',
  },
  {
    id: 'flat-white',
    name: 'Flat white',
    description: 'Doble espresso y leche texturizada.',
    price: 5200,
    category: 'Cafetería',
    image: '/demos/panaderia/products/cafe-leche.jpg',
    badge: 'De la casa',
  },
  {
    id: 'medialunas',
    name: 'Medialunas de manteca',
    description: 'Tres unidades, tibias, recién horneadas.',
    price: 4900,
    category: 'Desayuno & merienda',
    image: '/demos/panaderia/products/medialunas.jpg',
  },
  {
    id: 'tostado',
    name: 'Tostado Roca',
    description: 'Jamón natural, queso y pan de campo.',
    price: 9800,
    category: 'Desayuno & merienda',
    image: '/demos/panaderia/products/mignon.jpg',
    badge: 'Clásico',
  },
  {
    id: 'napolitana',
    name: 'Milanesa napolitana',
    description: 'Papas rústicas, tomate, mozzarella y albahaca.',
    price: 16800,
    category: 'Cocina',
    image: '/demos/pizzeria/napo.jpg',
    badge: 'Sale mucho',
  },
  {
    id: 'fugazzeta',
    name: 'Fugazzeta al horno',
    description: 'Mozzarella, cebolla dorada y oliva.',
    price: 14200,
    category: 'Cocina',
    image: '/demos/pizzeria/fugazzeta.jpg',
  },
  {
    id: 'empanadas',
    name: 'Empanadas cortadas a cuchillo',
    description: 'Tres unidades, carne suave y huevo.',
    price: 9600,
    category: 'Cocina',
    image: '/demos/pizzeria/empanada-carne.jpg',
  },
  {
    id: 'facturas',
    name: 'Pastelería del día',
    description: 'Selección de tres piezas de la vitrina.',
    price: 6200,
    category: 'Dulce',
    image: '/demos/panaderia/products/facturas-surtidas.jpg',
  },
  {
    id: 'torta',
    name: 'Torta del día',
    description: 'Porción generosa. Consultá la variedad.',
    price: 6900,
    category: 'Dulce',
    image: '/demos/panaderia/products/tortitas.jpg',
  },
  {
    id: 'vermut',
    name: 'Vermut con soda',
    description: 'Rojo, naranja y aceituna. Bien frío.',
    price: 6500,
    category: 'Barra',
    image: '/demos/pizzeria/gaseosa.jpg',
  },
  {
    id: 'gaseosa',
    name: 'Gaseosa 500 ml',
    description: 'Línea Coca-Cola.',
    price: 3900,
    category: 'Barra',
    image: '/demos/pizzeria/gaseosa.jpg',
  },
];

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function CafeRocaDemoPage() {
  const [category, setCategory] = useState<Category>('Cafetería');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Café Roca · Café & cocina en Olivos';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Café Roca: café, cocina porteña y barra en Olivos. Carta, reservas y pedido desde la mesa.',
      );
  }, []);

  const visibleItems = useMemo(
    () => MENU.filter(item => item.category === category),
    [category],
  );

  const count = Object.values(cart).reduce((total, qty) => total + qty, 0);
  const total = MENU.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
  const selected = MENU.filter(item => cart[item.id]);

  const changeQty = (id: string, delta: number) => {
    setCart(current => {
      const nextQty = Math.max(0, (current[id] || 0) + delta);
      if (nextQty === 0) {
        const next = { ...current };
        delete next[id];
        return next;
      }
      return { ...current, [id]: nextQty };
    });
  };

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  return (
    <div className="min-h-screen bg-[#f2ede3] text-[#191713] selection:bg-[#a23b29] selection:text-white">
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#f2ede3]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/demos"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15"
              aria-label="Volver a demos"
            >
              <ArrowLeft size={17} />
            </Link>
            <a href="#inicio" className="font-serif text-xl font-black tracking-[-0.045em]">ROCA</a>
          </div>

          <nav className="hidden items-center gap-7 text-xs font-black uppercase tracking-[0.1em] md:flex">
            <a href="#carta" className="hover:opacity-55">Carta</a>
            <button type="button" onClick={() => setReserveOpen(true)} className="hover:opacity-55">Reservas</button>
            <a href="#mesa" className="hover:opacity-55">Mesa 07</a>
          </nav>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="flex h-10 items-center gap-2 rounded-full bg-[#191713] px-4 text-xs font-black text-white"
            aria-label={`Abrir pedido, ${count} productos`}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Pedido</span>
            {count > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-black">{count}</span>}
          </button>
        </div>
      </header>

      <main>
        <section id="inicio" className="relative isolate min-h-[78svh] overflow-hidden bg-[#26221d] text-white">
          <img
            src="/demos/panaderia/products/cafe-leche.jpg"
            alt="Café servido en Roca"
            className="absolute inset-0 -z-20 h-full w-full object-cover scale-105"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(20,17,14,.88)_0%,rgba(20,17,14,.55)_48%,rgba(20,17,14,.18)_100%)]" />

          <div className="mx-auto flex min-h-[78svh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:px-6 sm:pb-14 lg:pb-16">
            <div className="max-w-4xl">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.18em] text-white/70">Olivos · café & cocina</p>
              <h1 className="font-serif text-[clamp(4.1rem,12vw,9rem)] font-black leading-[0.78] tracking-[-0.075em]">
                Café temprano.
                <span className="block italic text-[#e9b85c]">Cocina hasta tarde.</span>
              </h1>
              <p className="mt-7 max-w-xl text-base font-semibold leading-relaxed text-white/72 sm:text-lg">
                Café de especialidad, cocina porteña, pastelería y barra. Un lugar de barrio para quedarse un rato más.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#carta" className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#f2ede3] px-6 text-sm font-black text-[#191713]">
                  Ver carta <ChevronRight size={16} />
                </a>
                <button type="button" onClick={() => setReserveOpen(true)} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/15 px-6 text-sm font-black backdrop-blur-sm">
                  Reservar mesa
                </button>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/25 pt-5 text-xs font-bold text-white/72">
              <span className="flex items-center gap-2"><Clock3 size={15} /> Lun–Dom · 07:30—00:00</span>
              <span className="flex items-center gap-2"><MapPin size={15} /> Olivos · Buenos Aires</span>
              <span className="flex items-center gap-2"><Coffee size={15} /> Desayuno · cocina · barra</span>
            </div>
          </div>
        </section>

        <section className="border-b border-black/10 bg-[#f2ede3] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a23b29]">Todo el día</p>
                <h2 className="mt-4 max-w-xl font-serif text-5xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl">
                  Cada hora tiene su mesa.
                </h2>
                <p className="mt-5 max-w-md text-sm font-semibold leading-relaxed text-black/55 sm:text-base">
                  Vení por un café rápido o quedate a comer. La propuesta cambia de ritmo sin cambiar de lugar.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] bg-[#d7c09d] sm:row-span-2 sm:min-h-[620px]">
                  <img src="/demos/panaderia/products/medialunas.jpg" alt="Medialunas y café" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/65">07:30 — 12:00</p>
                    <h3 className="mt-2 font-serif text-4xl font-black">Mañanas en Roca</h3>
                    <p className="mt-2 max-w-sm text-sm font-semibold text-white/70">Café bien hecho, medialunas tibias y desayunos sin apuro.</p>
                  </div>
                </article>

                <article className="relative min-h-[300px] overflow-hidden rounded-[1.5rem] bg-[#c56843]">
                  <img src="/demos/pizzeria/napo.jpg" alt="Cocina porteña" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/65">12:00 — 23:30</p>
                    <h3 className="mt-2 font-serif text-3xl font-black">Cocina porteña</h3>
                    <p className="mt-2 text-sm font-semibold text-white/70">Platos reconocibles, porciones honestas y algún giro de la casa.</p>
                  </div>
                </article>

                <article className="flex min-h-[300px] flex-col justify-between rounded-[1.5rem] bg-[#7d2e22] p-6 text-[#fff7e7]">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/60">Desde las 18:00</span>
                    <span className="h-2 w-2 rounded-full bg-[#e9b85c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-4xl font-black">La barra.</h3>
                    <p className="mt-3 max-w-sm text-sm font-semibold leading-relaxed text-white/70">
                      Vermut, cerveza fría, clásicos simples y algo para picar cuando cae el sol.
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="carta" className="scroll-mt-20 bg-[#fffaf0] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a23b29]">Nuestra carta</p>
                <h2 className="mt-3 font-serif text-6xl font-black tracking-[-0.06em] sm:text-7xl">Comer rico. Punto.</h2>
                <p className="mt-5 max-w-sm text-sm font-semibold leading-relaxed text-black/50">
                  Una carta corta para decidir fácil. Precios ilustrativos para esta muestra.
                </p>
              </div>

              <div>
                <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
                  {CATEGORIES.map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCategory(option)}
                      className={`min-h-11 shrink-0 rounded-full px-5 text-xs font-black transition ${category === option ? 'bg-[#191713] text-white' : 'border border-black/12 bg-transparent text-black/50 hover:text-black'}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-3 divide-y divide-black/10 border-y border-black/10">
                  {visibleItems.map(item => {
                    const qty = cart[item.id] || 0;
                    return (
                      <article key={item.id} className="grid grid-cols-[72px_1fr_auto] gap-4 py-5 sm:grid-cols-[92px_1fr_auto] sm:gap-5">
                        <img src={item.image} alt={item.name} loading="lazy" className="h-[72px] w-[72px] rounded-xl object-cover sm:h-[92px] sm:w-[92px]" />
                        <div className="min-w-0 self-center">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-serif text-xl font-black tracking-[-0.025em] sm:text-2xl">{item.name}</h3>
                            {item.badge && <span className="rounded-full bg-[#e9b85c]/35 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em]">{item.badge}</span>}
                          </div>
                          <p className="mt-1 text-xs font-semibold leading-relaxed text-black/48 sm:text-sm">{item.description}</p>
                          <p className="mt-2 text-xs font-black sm:text-sm">{money.format(item.price)}</p>
                        </div>

                        <div className="flex self-center">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => changeQty(item.id, 1)}
                              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/15 transition hover:bg-black hover:text-white"
                              aria-label={`Agregar ${item.name}`}
                            >
                              <Plus size={16} />
                            </button>
                          ) : (
                            <div className="flex flex-col items-center gap-1 rounded-full bg-[#191713] p-1 text-white sm:flex-row">
                              <button type="button" onClick={() => changeQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10" aria-label={`Quitar ${item.name}`}><Minus size={13} /></button>
                              <span className="w-8 text-center text-xs font-black">{qty}</span>
                              <button type="button" onClick={() => changeQty(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9b85c] text-black" aria-label={`Agregar ${item.name}`}><Plus size={13} /></button>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="mesa" className="scroll-mt-20 border-y border-black/10 bg-[#e6ded0] py-14 sm:py-18">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a23b29]">Estás en Mesa 07</p>
              <h2 className="mt-3 max-w-2xl font-serif text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl">¿Necesitás algo?</h2>
              <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-black/50">
                Desde el QR de la mesa podés sumar algo al pedido, llamar al equipo o pedir la cuenta.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button type="button" onClick={() => flash('Mozo avisado · Mesa 07')} className="flex min-h-28 w-full min-w-0 flex-col items-start justify-between rounded-[1.25rem] border border-black/10 bg-[#fffaf0] p-4 text-left sm:w-36">
                <Bell size={19} /><span className="text-xs font-black sm:text-sm">Llamar mozo</span>
              </button>
              <button type="button" onClick={() => setCartOpen(true)} className="flex min-h-28 w-full min-w-0 flex-col items-start justify-between rounded-[1.25rem] bg-[#191713] p-4 text-left text-white sm:w-36">
                <ShoppingBag size={19} /><span className="text-xs font-black sm:text-sm">Pedido · {count}</span>
              </button>
              <button type="button" onClick={() => flash('Cuenta solicitada · Mesa 07')} className="flex min-h-28 w-full min-w-0 flex-col items-start justify-between rounded-[1.25rem] border border-black/10 bg-[#fffaf0] p-4 text-left sm:w-36">
                <ReceiptText size={19} /><span className="text-xs font-black sm:text-sm">Pedir cuenta</span>
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#7d2e22] py-16 text-[#fff7e7] sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-white/55">Reservas</p>
                <h2 className="mt-3 max-w-4xl font-serif text-6xl font-black leading-[0.88] tracking-[-0.06em] sm:text-8xl">Tu mesa, cuando quieras.</h2>
                <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-xs font-bold text-white/65">
                  <span className="flex items-center gap-2"><Clock3 size={14} /> 07:30—00:00</span>
                  <span className="flex items-center gap-2"><MapPin size={14} /> Olivos</span>
                  <span className="flex items-center gap-2"><CalendarDays size={14} /> Todos los días</span>
                </div>
              </div>
              <button type="button" onClick={() => setReserveOpen(true)} className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#fff7e7] px-7 text-sm font-black text-[#191713]">
                Reservar mesa <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#191713] px-4 py-8 text-white/55 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-xs font-bold sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl font-black text-white">ROCA</p>
            <p className="mt-1">Café & cocina · Olivos</p>
          </div>
          <p>Sitio demostrativo ficticio · Gatrivi.com</p>
        </div>
      </footer>

      {count > 0 && !cartOpen && (
        <button type="button" onClick={() => setCartOpen(true)} className="fixed inset-x-3 bottom-3 z-30 flex min-h-14 items-center justify-between rounded-full bg-[#191713] px-5 text-sm font-black text-white shadow-2xl sm:left-auto sm:right-5 sm:w-80">
          <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
          <span>{money.format(total)} →</span>
        </button>
      )}

      {notice && (
        <div className="fixed left-1/2 top-20 z-[80] -translate-x-1/2 rounded-full bg-[#191713] px-5 py-3 text-xs font-black text-white shadow-xl">{notice}</div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[#fffaf0] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a23b29]">Mesa 07</p><h3 className="mt-1 font-serif text-3xl font-black">Tu pedido</h3></div>
              <button type="button" onClick={() => setCartOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"><X size={18} /></button>
            </div>

            {selected.length === 0 ? (
              <div className="py-14 text-center"><ShoppingBag className="mx-auto text-black/25" /><p className="mt-3 text-sm font-black">Todavía no agregaste nada.</p></div>
            ) : (
              <div className="mt-6 space-y-3">
                {selected.map(item => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-black/8 bg-white p-3">
                    <img src={item.image} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1"><p className="truncate text-sm font-black">{item.name}</p><p className="text-xs font-bold text-black/45">{money.format(item.price)} c/u</p></div>
                    <div className="flex items-center gap-2"><button type="button" onClick={() => changeQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5"><Minus size={13} /></button><span className="w-4 text-center text-xs font-black">{cart[item.id]}</span><button type="button" onClick={() => changeQty(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e9b85c]"><Plus size={13} /></button></div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 border-t border-black/10 pt-5">
              <div className="flex items-center justify-between text-lg font-black"><span>Total</span><span>{money.format(total)}</span></div>
              <button
                type="button"
                disabled={count === 0}
                onClick={() => { setCartOpen(false); flash('Pedido enviado a cocina · Mesa 07'); }}
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#191713] px-6 text-sm font-black text-white disabled:opacity-35"
              >
                Enviar pedido <ChevronRight size={17} />
              </button>
              <p className="mt-3 text-center text-[10px] font-bold text-black/35">Muestra interactiva: no genera un pedido real.</p>
            </div>
          </div>
        </div>
      )}

      {reserveOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) setReserveOpen(false); }}>
          <div className="w-full max-w-lg rounded-t-[2rem] bg-[#fffaf0] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a23b29]">Reserva</p><h3 className="mt-1 font-serif text-3xl font-black">Tu mesa en Roca</h3></div>
              <button type="button" onClick={() => setReserveOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"><X size={18} /></button>
            </div>

            {reserved ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#191713] text-white"><Check size={24} /></span>
                <p className="mt-4 font-serif text-3xl font-black">Mesa guardada.</p>
                <p className="mt-2 text-sm font-semibold text-black/45">En un sitio real, la confirmación puede llegar por WhatsApp o al panel del local.</p>
                <button type="button" onClick={() => { setReserved(false); setReserveOpen(false); }} className="mt-6 min-h-12 rounded-full bg-[#191713] px-6 text-sm font-black text-white">Cerrar</button>
              </div>
            ) : (
              <form className="mt-6 space-y-3" onSubmit={event => { event.preventDefault(); setReserved(true); }}>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-black">Personas<select className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-bold"><option>2 personas</option><option>3 personas</option><option>4 personas</option><option>5+ personas</option></select></label>
                  <label className="text-xs font-black">Horario<select className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-bold"><option>20:30</option><option>21:00</option><option>21:30</option><option>22:00</option></select></label>
                </div>
                <label className="block text-xs font-black">Nombre<input required placeholder="Tu nombre" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold outline-none" /></label>
                <label className="block text-xs font-black">WhatsApp<input required inputMode="tel" placeholder="11 5555 5555" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold outline-none" /></label>
                <button type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#7d2e22] px-6 text-sm font-black text-white">Confirmar reserva <ChevronRight size={17} /></button>
                <p className="text-center text-[10px] font-bold text-black/35">Muestra ficticia · no envía datos.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
