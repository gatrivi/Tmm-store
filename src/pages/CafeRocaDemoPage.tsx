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

type Category = 'Café' | 'Brunch' | 'Almuerzo' | 'Dulce' | 'Bebidas';

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  badge?: string;
};

const CATEGORIES: Category[] = ['Café', 'Brunch', 'Almuerzo', 'Dulce', 'Bebidas'];

const MENU: MenuItem[] = [
  {
    id: 'flat-white',
    name: 'Flat white',
    description: 'Doble espresso, leche texturizada. Intenso y corto.',
    price: 5200,
    category: 'Café',
    image: '/demos/panaderia/products/cafe-leche.jpg',
    badge: 'Favorito',
  },
  {
    id: 'cafe-leche',
    name: 'Café con leche',
    description: 'Espresso doble y leche cremosa.',
    price: 4800,
    category: 'Café',
    image: '/demos/panaderia/products/cafe-leche.jpg',
  },
  {
    id: 'medialunas',
    name: 'Medialunas tibias',
    description: 'Tres unidades, manteca y almíbar liviano.',
    price: 4900,
    category: 'Brunch',
    image: '/demos/panaderia/products/medialunas.jpg',
    badge: 'Recién hechas',
  },
  {
    id: 'tostado',
    name: 'Tostado Roca',
    description: 'Jamón cocido, queso, pan de campo y mostaza antigua.',
    price: 9800,
    category: 'Brunch',
    image: '/demos/panaderia/products/mignon.jpg',
  },
  {
    id: 'napolitana',
    name: 'Milanesa napolitana',
    description: 'Papas rústicas, tomate, mozzarella y albahaca.',
    price: 16800,
    category: 'Almuerzo',
    image: '/demos/pizzeria/napo.jpg',
    badge: 'Sale mucho',
  },
  {
    id: 'fugazzeta',
    name: 'Fugazzeta al horno',
    description: 'Mozzarella, cebolla caramelizada y oliva.',
    price: 14200,
    category: 'Almuerzo',
    image: '/demos/pizzeria/fugazzeta.jpg',
  },
  {
    id: 'facturas',
    name: 'Selección de pastelería',
    description: 'Tres piezas del día para compartir o no.',
    price: 6200,
    category: 'Dulce',
    image: '/demos/panaderia/products/facturas-surtidas.jpg',
  },
  {
    id: 'tortita',
    name: 'Torta del día',
    description: 'Porción generosa. Preguntanos cuál salió hoy.',
    price: 6900,
    category: 'Dulce',
    image: '/demos/panaderia/products/tortitas.jpg',
  },
  {
    id: 'gaseosa',
    name: 'Gaseosa 500 ml',
    description: 'Línea Coca-Cola, fría.',
    price: 3900,
    category: 'Bebidas',
    image: '/demos/pizzeria/gaseosa.jpg',
  },
];

const money = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export default function CafeRocaDemoPage() {
  const [category, setCategory] = useState<Category>('Café');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserved, setReserved] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Café Roca · Demo gastro en Olivos';
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        'content',
        'Demo ficticia de café, bar y restaurante en Olivos: carta visual, pedidos desde la mesa, reservas y cuenta.',
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
    <div className="min-h-screen bg-[#f5efe4] text-[#201a16] selection:bg-[#ce542b] selection:text-white">
      <header className="sticky top-0 z-40 border-b border-[#201a16]/10 bg-[#f5efe4]/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/demos" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#201a16]/15 bg-white/60" aria-label="Volver a demos">
            <ArrowLeft size={18} />
          </Link>
          <div className="text-center leading-none">
            <p className="font-serif text-xl font-black tracking-[-0.04em]">CAFÉ ROCA</p>
            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.22em] text-[#201a16]/45">Olivos · demo ficticia</p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex h-10 min-w-10 items-center justify-center rounded-full bg-[#201a16] px-3 text-white"
            aria-label={`Abrir pedido, ${count} productos`}
          >
            <ShoppingBag size={17} />
            {count > 0 && <span className="ml-2 text-xs font-black">{count}</span>}
          </button>
        </div>
      </header>

      <main>
        <section className="border-b border-[#201a16]/10">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-stretch lg:py-10">
            <div className="flex flex-col justify-between rounded-[2rem] bg-[#1f332a] p-6 text-[#fff7e8] sm:p-8 lg:p-10">
              <div>
                <div className="mb-8 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.14em]">
                  <span className="rounded-full bg-[#fff7e8]/10 px-3 py-2">Café de especialidad</span>
                  <span className="rounded-full bg-[#fff7e8]/10 px-3 py-2">Cocina todo el día</span>
                </div>
                <h1 className="max-w-xl font-serif text-[clamp(3.2rem,9vw,6.8rem)] font-black leading-[0.82] tracking-[-0.075em]">
                  Un café de barrio,
                  <span className="block text-[#efb84c]">bien resuelto.</span>
                </h1>
                <p className="mt-6 max-w-lg text-sm font-semibold leading-relaxed text-[#fff7e8]/70 sm:text-base">
                  Desayuno, almuerzo, merienda y una mesa que puede pedir sin perseguir al mozo.
                </p>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={() => setReserveOpen(true)} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#efb84c] px-4 text-sm font-black text-[#201a16]">
                  <CalendarDays size={17} /> Reservar
                </button>
                <a href="#carta" className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-black">
                  <UtensilsCrossed size={17} /> Ver carta
                </a>
                <button type="button" onClick={() => setCartOpen(true)} className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-4 text-sm font-black">
                  <ShoppingBag size={17} /> Pedir
                </button>
              </div>
            </div>

            <div className="grid min-h-[420px] grid-cols-2 grid-rows-2 gap-3">
              <div className="col-span-2 overflow-hidden rounded-[2rem] bg-[#dfc9ad]">
                <img src="/demos/panaderia/products/cafe-leche.jpg" alt="Café con leche" className="h-full w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-[2rem] bg-[#dfc9ad]">
                <img src="/demos/panaderia/products/medialunas.jpg" alt="Medialunas" className="h-full w-full object-cover" />
              </div>
              <div className="relative overflow-hidden rounded-[2rem] bg-[#ce542b] p-5 text-white">
                <div className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full border-[18px] border-white/10" />
                <Coffee size={26} />
                <p className="mt-12 font-serif text-3xl font-black leading-none">Desde las 7:30.</p>
                <p className="mt-2 text-xs font-bold text-white/65">Todos los días.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#201a16]/10 bg-[#fffaf1]">
          <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 sm:grid-cols-3 sm:px-6">
            <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
              <Clock3 size={18} className="text-[#ce542b]" />
              <div><p className="text-xs font-black">Abierto ahora</p><p className="text-xs font-semibold text-[#201a16]/50">07:30 — 00:00</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
              <MapPin size={18} className="text-[#ce542b]" />
              <div><p className="text-xs font-black">Olivos</p><p className="text-xs font-semibold text-[#201a16]/50">Demo comercial · Zona Norte</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-3 py-2">
              <Check size={18} className="text-[#ce542b]" />
              <div><p className="text-xs font-black">Mesa 07 detectada</p><p className="text-xs font-semibold text-[#201a16]/50">QR → pedir, mozo, cuenta</p></div>
            </div>
          </div>
        </section>

        <section id="carta" className="scroll-mt-20 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#ce542b]">Carta</p>
                <h2 className="mt-2 font-serif text-5xl font-black tracking-[-0.055em] sm:text-6xl">Elegí sin esperar.</h2>
              </div>
              <p className="max-w-sm text-sm font-semibold leading-relaxed text-[#201a16]/50">Fotos, descripción, precio y pedido en la misma pantalla. Los precios son ilustrativos.</p>
            </div>

            <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              {CATEGORIES.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  className={`min-h-11 shrink-0 rounded-full px-5 text-xs font-black transition ${category === option ? 'bg-[#201a16] text-white' : 'border border-[#201a16]/12 bg-white/55 text-[#201a16]/55'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map(item => {
                const qty = cart[item.id] || 0;
                return (
                  <article key={item.id} className="overflow-hidden rounded-[1.75rem] border border-[#201a16]/10 bg-[#fffaf1] shadow-[0_12px_35px_rgba(50,35,20,.06)]">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#e9ddcc]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-[1.025]" loading="lazy" />
                      {item.badge && <span className="absolute left-3 top-3 rounded-full bg-[#efb84c] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#201a16]">{item.badge}</span>}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-serif text-2xl font-black tracking-[-0.03em]">{item.name}</h3>
                          <p className="mt-2 text-sm font-semibold leading-relaxed text-[#201a16]/50">{item.description}</p>
                        </div>
                        <p className="shrink-0 text-sm font-black">{money.format(item.price)}</p>
                      </div>
                      <div className="mt-5 flex items-center justify-between">
                        {qty === 0 ? (
                          <button type="button" onClick={() => changeQty(item.id, 1)} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#201a16] px-4 text-xs font-black text-white">
                            Agregar <Plus size={15} />
                          </button>
                        ) : (
                          <div className="flex w-full items-center justify-between rounded-full bg-[#201a16] p-1 text-white">
                            <button type="button" onClick={() => changeQty(item.id, -1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10" aria-label={`Quitar ${item.name}`}><Minus size={15} /></button>
                            <span className="text-xs font-black">{qty} en pedido</span>
                            <button type="button" onClick={() => changeQty(item.id, 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#efb84c] text-[#201a16]" aria-label={`Agregar ${item.name}`}><Plus size={15} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#201a16] py-10 text-[#fff7e8] sm:py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#efb84c]">Mesa 07</p>
            <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <h2 className="font-serif text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl">El QR también trabaja.</h2>
                <p className="mt-4 max-w-xl text-sm font-semibold leading-relaxed text-white/55">El cliente escanea en la mesa. Puede sumar productos, llamar al mozo o pedir la cuenta sin instalar nada.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={() => flash('Mozo avisado · Mesa 07')} className="flex min-h-24 flex-col items-start justify-between rounded-[1.4rem] bg-white/8 p-4 text-left"><Bell size={20} /><span className="text-sm font-black">Llamar mozo</span></button>
                <button type="button" onClick={() => setCartOpen(true)} className="flex min-h-24 flex-col items-start justify-between rounded-[1.4rem] bg-[#efb84c] p-4 text-left text-[#201a16]"><ShoppingBag size={20} /><span className="text-sm font-black">Mi pedido · {count}</span></button>
                <button type="button" onClick={() => flash('Cuenta solicitada · Mesa 07')} className="flex min-h-24 flex-col items-start justify-between rounded-[1.4rem] bg-white/8 p-4 text-left"><ReceiptText size={20} /><span className="text-sm font-black">Pedir cuenta</span></button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#ce542b] py-10 text-white sm:py-14">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/60">La parte que evita llamados</p>
              <h2 className="mt-2 font-serif text-5xl font-black tracking-[-0.055em]">Reservá en 20 segundos.</h2>
            </div>
            <button type="button" onClick={() => setReserveOpen(true)} className="flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-black text-[#201a16]">
              Elegir mesa <ChevronRight size={17} />
            </button>
          </div>
        </section>
      </main>

      {count > 0 && !cartOpen && (
        <button type="button" onClick={() => setCartOpen(true)} className="fixed inset-x-3 bottom-3 z-30 flex min-h-14 items-center justify-between rounded-full bg-[#201a16] px-5 text-sm font-black text-white shadow-2xl sm:left-auto sm:right-5 sm:w-80">
          <span>{count} {count === 1 ? 'producto' : 'productos'}</span>
          <span>{money.format(total)} →</span>
        </button>
      )}

      {notice && (
        <div className="fixed left-1/2 top-20 z-[80] -translate-x-1/2 rounded-full bg-[#201a16] px-5 py-3 text-xs font-black text-white shadow-xl">{notice}</div>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false); }}>
          <div className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-[#fffaf1] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#ce542b]">Mesa 07</p><h3 className="mt-1 font-serif text-3xl font-black">Tu pedido</h3></div>
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
                    <div className="flex items-center gap-2"><button type="button" onClick={() => changeQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5"><Minus size={13} /></button><span className="w-4 text-center text-xs font-black">{cart[item.id]}</span><button type="button" onClick={() => changeQty(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efb84c]"><Plus size={13} /></button></div>
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
                className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#201a16] px-6 text-sm font-black text-white disabled:opacity-35"
              >
                Enviar pedido <ChevronRight size={17} />
              </button>
              <p className="mt-3 text-center text-[10px] font-bold text-black/35">Demo: no genera un pedido real.</p>
            </div>
          </div>
        </div>
      )}

      {reserveOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={event => { if (event.target === event.currentTarget) setReserveOpen(false); }}>
          <div className="w-full max-w-lg rounded-t-[2rem] bg-[#fffaf1] p-5 shadow-2xl sm:rounded-[2rem] sm:p-6">
            <div className="flex items-center justify-between">
              <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#ce542b]">Reserva</p><h3 className="mt-1 font-serif text-3xl font-black">Tu mesa en Roca</h3></div>
              <button type="button" onClick={() => setReserveOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10"><X size={18} /></button>
            </div>

            {reserved ? (
              <div className="py-10 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1f332a] text-white"><Check size={24} /></span>
                <p className="mt-4 font-serif text-3xl font-black">Mesa guardada.</p>
                <p className="mt-2 text-sm font-semibold text-black/45">Demo completa: en producción esto confirma por WhatsApp o panel.</p>
                <button type="button" onClick={() => { setReserved(false); setReserveOpen(false); }} className="mt-6 min-h-12 rounded-full bg-[#201a16] px-6 text-sm font-black text-white">Cerrar</button>
              </div>
            ) : (
              <form className="mt-6 space-y-3" onSubmit={event => { event.preventDefault(); setReserved(true); }}>
                <div className="grid grid-cols-2 gap-3">
                  <label className="text-xs font-black">Personas<select className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-bold"><option>2 personas</option><option>3 personas</option><option>4 personas</option><option>5+ personas</option></select></label>
                  <label className="text-xs font-black">Horario<select className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-bold"><option>20:30</option><option>21:00</option><option>21:30</option><option>22:00</option></select></label>
                </div>
                <label className="block text-xs font-black">Nombre<input required placeholder="Tu nombre" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold outline-none" /></label>
                <label className="block text-xs font-black">WhatsApp<input required inputMode="tel" placeholder="11 5555 5555" className="mt-2 min-h-12 w-full rounded-xl border border-black/10 bg-white px-4 text-sm font-bold outline-none" /></label>
                <button type="submit" className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#ce542b] px-6 text-sm font-black text-white">Confirmar reserva <ChevronRight size={17} /></button>
                <p className="text-center text-[10px] font-bold text-black/35">Demo ficticia · no envía datos.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
