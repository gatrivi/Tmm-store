import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Store,
  Truck,
  X,
} from 'lucide-react';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import type { MenuItemType } from '../data/menu';
import { createDemoOrder } from '../services/demoOrderRepository';
import type { DeliveryType, OrderLineItem, PaymentMethod } from '../types/order';

const PICKUP_SLOTS = ['07:00–07:30', '07:30–08:00', '08:00–08:30', '08:30–09:00', '09:00–09:30'];

const EXTRA_FACTURAS: MenuItemType[] = [
  {
    id: 'bola-fraile-ddl',
    name: 'Bola de fraile',
    category: 'facturas',
    badge: 'Con DDL',
    description: 'Frita, azucarada y bien rellena de dulce de leche.',
    images: ['/demos/panaderia/products/bola-fraile.svg'],
    options: [
      { id: 'unidad', label: 'Unidad', price: 1800 },
      { id: 'media', label: '½ docena', price: 9800 },
    ],
  },
  {
    id: 'vigilantes',
    name: 'Vigilantes',
    category: 'facturas',
    badge: 'Bien porteño',
    description: 'Largos, dorados, con membrillo y crema pastelera.',
    images: ['/demos/panaderia/products/vigilante.svg'],
    options: [
      { id: 'media', label: '½ docena', price: 4700 },
      { id: 'docena', label: 'Docena', price: 8900 },
    ],
  },
  {
    id: 'canoncitos-ddl',
    name: 'Cañoncitos con dulce de leche',
    category: 'facturas',
    badge: 'Hojaldre',
    description: 'Hojaldre crocante, dulce de leche repostero y azúcar impalpable.',
    images: ['/demos/panaderia/products/canoncito-dulce-leche.svg'],
    options: [
      { id: 'cuarto', label: '¼ kg', price: 5200 },
      { id: 'medio', label: '½ kg', price: 9900 },
    ],
  },
];

const PRODUCTS: MenuItemType[] = [...PANADERIA_DEMO.menuItems, ...EXTRA_FACTURAS];
const CATEGORIES = PANADERIA_DEMO.menuCategories;

function orderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

function jumpToCategory(id: string) {
  document.getElementById(`panaderia-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function PanaderiaDemoPage() {
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<OrderLineItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('pickup');
  const [address, setAddress] = useState('');
  const [slot, setSlot] = useState(PICKUP_SLOTS[1]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  const add = (productId: string, optionId: string) => {
    const product = PRODUCTS.find(item => item.id === productId);
    const option = product?.options.find(opt => opt.id === optionId);
    if (!product || !option) return;

    setCart(prev => {
      const idx = prev.findIndex(line => line.id === productId && line.optionId === optionId);
      if (idx >= 0) return prev.map((line, i) => (i === idx ? { ...line, qty: line.qty + 1 } : line));
      return [...prev, {
        id: product.id,
        name: product.name,
        optionId: option.id,
        optionLabel: option.label,
        price: option.price,
        qty: 1,
      }];
    });
  };

  const changeQty = (index: number, delta: number) => {
    setCart(prev => prev.flatMap((line, i) => {
      if (i !== index) return [line];
      const qty = line.qty + delta;
      return qty > 0 ? [{ ...line, qty }] : [];
    }));
  };

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      setError('Completá nombre y teléfono.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      setError('Ingresá la dirección para delivery.');
      return;
    }
    if (!cart.length) return;

    const id = orderId();
    const now = new Date().toISOString();
    createDemoOrder({
      id,
      tenantId: PANADERIA_DEMO.tenantId,
      status: 'new',
      customerName: name.trim(),
      customerPhone: phone.trim(),
      deliveryType,
      address: deliveryType === 'delivery' ? address.trim() : '',
      paymentMethod,
      paymentStatus: 'pending',
      notes: `${deliveryType === 'pickup' ? `Retiro ${slot}` : 'Delivery'}${notes.trim() ? ` · ${notes.trim()}` : ''}`,
      items: cart,
      subtotal: total,
      discount: 0,
      total,
      source: 'demo',
      createdAt: now,
      updatedAt: now,
    }, PANADERIA_DEMO.id);

    setSuccessId(id);
    setCheckoutOpen(false);
    setCartOpen(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#f4f8fb] text-[#0b1f33]">
      <div className="bg-[#0b1f33] px-4 py-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#e8f1f8]">
        Demo · La Magdalena · precios ilustrativos
      </div>

      <header className="sticky top-0 z-40 border-b border-[#0b1f33]/10 bg-[#f4f8fb]/92 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[66px] max-w-6xl items-center justify-between px-4">
          <a href="https://gatrivi.com/" className="flex min-h-11 items-center gap-2 rounded-full px-2 text-xs font-black text-[#0b1f33]/60 transition hover:bg-white hover:text-[#0b1f33]">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Gatrivi.com</span>
          </a>

          <div className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-2.5 transition-all duration-500 ${scrolled ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0 pointer-events-none'}`}>
            <img src="/demos/panaderia/logo-blueprint.png" alt="La Magdalena" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <div className="hidden sm:block">
              <p className="font-serif text-base font-black leading-none">La Magdalena</p>
              <p className="mt-1 text-[8px] font-black uppercase tracking-[0.16em] text-[#2e6fa8]">Panadería artesanal</p>
            </div>
          </div>

          <button type="button" onClick={() => setCartOpen(true)} className="relative flex min-h-11 items-center gap-2 rounded-full bg-[#0b1f33] px-4 text-sm font-black text-white shadow-lg">
            <ShoppingBag size={17} />
            Pedido
            {itemCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5ba3d9] px-1 text-[10px] text-[#0b1f33]">{itemCount}</span>}
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-7 pt-4 md:pt-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#0b1f33] text-white shadow-xl md:grid md:grid-cols-[1.03fr_.97fr]">
            <div className="relative h-[230px] overflow-hidden bg-[#c5d5e4] sm:h-[300px] md:order-2 md:h-full md:min-h-[560px]">
              <img src="/demos/panaderia/products/medialunas.jpg" alt="Medialunas de manteca recién horneadas" className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-center transition-transform duration-1000 hover:scale-[1.07]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f33]/75 via-transparent to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#0b1f33]/25" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-[#0b1f33]/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] backdrop-blur md:bottom-6 md:left-6">Horneado hoy</div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 md:order-1 md:p-10 lg:p-12">
              <div className={`mb-8 flex items-center gap-4 transition-all duration-500 ${scrolled ? 'translate-y-[-8px] opacity-0' : 'translate-y-0 opacity-100'}`}>
                <img src="/demos/panaderia/logo-blueprint.png" alt="La Magdalena" className="h-20 w-20 rounded-[1.35rem] object-cover shadow-xl sm:h-24 sm:w-24" />
                <div>
                  <p className="font-serif text-3xl font-black leading-none sm:text-4xl">La Magdalena</p>
                  <p className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#8ec5e9] sm:text-xs">Panadería artesanal</p>
                </div>
              </div>

              <h1 className="max-w-2xl font-serif text-[clamp(2.7rem,8vw,4.9rem)] font-black leading-[0.9] tracking-[-0.05em]">Lo rico de una panadería de verdad, sin hacer fila.</h1>
              <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-[#c5d5e4] sm:text-base">Medialunas, bolas de fraile, vigilantes, cañoncitos, panes y salados. Elegís, reservás horario y retirás.</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <button type="button" onClick={() => jumpToCategory('facturas')} className="flex min-h-12 items-center gap-2 rounded-full bg-[#e8f1f8] px-5 text-sm font-black text-[#0b1f33] shadow-lg transition hover:-translate-y-0.5">Ver facturas <ArrowRight size={16} /></button>
                <button type="button" onClick={() => jumpToCategory('salados')} className="flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/8 px-5 text-sm font-black text-white transition hover:bg-white/15">Ir a salados ↓</button>
              </div>
            </div>
          </div>
        </section>

        <nav className="sticky top-[66px] z-30 border-y border-[#0b1f33]/10 bg-[#f4f8fb]/94 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {CATEGORIES.map(category => (
              <button key={category.id} type="button" onClick={() => jumpToCategory(category.id)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${category.id === 'salados' ? 'border-[#0b1f33] bg-[#0b1f33] text-white' : 'border-[#0b1f33]/10 bg-white text-[#0b1f33] hover:border-[#2e6fa8]/40'}`}>
                {category.name}
              </button>
            ))}
          </div>
        </nav>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2e6fa8]">Elegí lo que te tienta</p>
            <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] sm:text-4xl">Armá tu pedido</h2>
          </div>

          <div className="space-y-14">
            {CATEGORIES.map(category => {
              const categoryProducts = PRODUCTS.filter(product => product.category === category.id);
              if (!categoryProducts.length) return null;
              return (
                <section key={category.id} id={`panaderia-${category.id}`} className="scroll-mt-32">
                  <div className="mb-5 flex items-end justify-between gap-4 border-b border-[#0b1f33]/10 pb-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#2e6fa8]">La Magdalena</p>
                      <h3 className="mt-1 font-serif text-2xl font-black sm:text-3xl">{category.name}</h3>
                    </div>
                    <span className="text-xs font-bold text-[#0b1f33]/45">{categoryProducts.length} opciones</span>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categoryProducts.map(product => (
                      <article key={product.id} className="group overflow-hidden rounded-[1.6rem] border border-[#0b1f33]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <div className="relative overflow-hidden bg-[#e8f1f8]">
                          <img src={product.images?.[0]} alt={product.name} loading="lazy" className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                          {product.badge && <span className="absolute left-3 top-3 rounded-full bg-[#0b1f33]/88 px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-white backdrop-blur">{product.badge}</span>}
                        </div>
                        <div className="p-5">
                          <h4 className="font-serif text-xl font-black">{product.name}</h4>
                          <p className="mt-1.5 min-h-9 text-xs font-medium leading-relaxed text-[#0b1f33]/55">{product.description}</p>
                          <div className="mt-5 space-y-2">
                            {product.options.map(option => (
                              <button key={option.id} type="button" onClick={() => add(product.id, option.id)} className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#0b1f33]/10 bg-[#f4f8fb] px-3 text-left transition hover:border-[#2e6fa8]/40 hover:bg-[#e8f1f8]">
                                <span className="text-xs font-black">{option.label}</span>
                                <span className="flex items-center gap-2 text-sm font-black text-[#2e6fa8]">${option.price.toLocaleString('es-AR')} <Plus size={15} /></span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#0b1f33]/10 bg-[#0b1f33] px-4 py-8 text-[#e8f1f8]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="font-serif text-xl font-black">La Magdalena</p><p className="mt-1 text-xs text-[#c5d5e4]">Demo de pedidos para panadería · Gatrivi.com</p></div>
          <div className="flex flex-wrap gap-4">
            <a href="https://gatrivi.com/" className="text-xs font-black uppercase tracking-[0.14em] text-[#e8f1f8]">← Volver a Gatrivi</a>
            <Link to="/panaderia/owner" className="text-xs font-black uppercase tracking-[0.14em] text-[#5ba3d9]">Ver panel del local →</Link>
          </div>
        </div>
      </footer>

      {itemCount > 0 && !cartOpen && !checkoutOpen && !successId && (
        <button type="button" onClick={() => setCartOpen(true)} className="fixed bottom-4 left-1/2 z-40 flex min-h-14 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full bg-[#2e6fa8] px-5 text-white shadow-2xl">
          <span className="text-sm font-black">{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</span>
          <span className="flex items-center gap-2 text-sm font-black">${total.toLocaleString('es-AR')} <ArrowRight size={17} /></span>
        </button>
      )}

      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b1f33]/55" onClick={() => setCartOpen(false)}>
          <aside className="ml-auto flex h-full w-full max-w-md flex-col bg-[#f4f8fb] shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#0b1f33]/10 px-5 py-4">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#2e6fa8]">Tu pedido</p><h2 className="font-serif text-2xl font-black">La bolsa</h2></div>
              <button type="button" onClick={() => setCartOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? <p className="py-10 text-center text-sm text-[#0b1f33]/55">Todavía no agregaste nada.</p> : (
                <div className="space-y-3">
                  {cart.map((line, index) => (
                    <div key={`${line.id}-${line.optionId}`} className="rounded-2xl border border-[#0b1f33]/10 bg-white p-4">
                      <div className="flex justify-between gap-4"><div><p className="text-sm font-black">{line.name}</p><p className="mt-1 text-xs text-[#0b1f33]/55">{line.optionLabel}</p></div><p className="text-sm font-black">${(line.price * line.qty).toLocaleString('es-AR')}</p></div>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" onClick={() => changeQty(index, -1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f1f8]"><Minus size={14} /></button>
                        <span className="w-7 text-center text-sm font-black">{line.qty}</span>
                        <button type="button" onClick={() => changeQty(index, 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f1f8]"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="border-t border-[#0b1f33]/10 bg-white p-5">
              <div className="mb-4 flex items-end justify-between"><span className="text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Total</span><span className="font-serif text-3xl font-black">${total.toLocaleString('es-AR')}</span></div>
              <button type="button" disabled={!cart.length} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#2e6fa8] text-sm font-black text-white disabled:opacity-40">Elegir retiro y confirmar <ArrowRight size={17} /></button>
            </div>
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1f33]/60 p-3" onClick={() => setCheckoutOpen(false)}>
          <div className="max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-[2rem] bg-[#f4f8fb] shadow-2xl" onClick={event => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#0b1f33]/10 px-5 py-4">
              <div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#2e6fa8]">Último paso</p><h2 className="font-serif text-2xl font-black">¿Cuándo lo buscás?</h2></div>
              <button type="button" onClick={() => setCheckoutOpen(false)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white"><X size={18} /></button>
            </div>
            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setDeliveryType('pickup')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-black ${deliveryType === 'pickup' ? 'border-[#2e6fa8] bg-[#2e6fa8] text-white' : 'border-[#0b1f33]/10 bg-white'}`}><Store size={16} /> Retiro</button>
                <button type="button" onClick={() => setDeliveryType('delivery')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border text-sm font-black ${deliveryType === 'delivery' ? 'border-[#2e6fa8] bg-[#2e6fa8] text-white' : 'border-[#0b1f33]/10 bg-white'}`}><Truck size={16} /> Delivery</button>
              </div>

              {deliveryType === 'pickup' ? (
                <div>
                  <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Horario de retiro</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {PICKUP_SLOTS.map(value => <button key={value} type="button" onClick={() => setSlot(value)} className={`min-h-11 rounded-xl border text-xs font-black ${slot === value ? 'border-[#2e6fa8] bg-[#e8f1f8] text-[#2e6fa8]' : 'border-[#0b1f33]/10 bg-white'}`}>{value}</button>)}
                  </div>
                </div>
              ) : <div><label className="mb-2 block text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Dirección</label><input value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, altura y localidad" className="min-h-12 w-full rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" /></div>}

              <div className="grid gap-3 sm:grid-cols-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="min-h-12 rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" className="min-h-12 rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Pago</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['cash', 'Efectivo al retirar'], ['transfer', 'Transferencia al confirmar']].map(([id, label]) => <button key={id} type="button" onClick={() => setPaymentMethod(id as PaymentMethod)} className={`min-h-12 rounded-xl border px-3 text-xs font-black ${paymentMethod === id ? 'border-[#2e6fa8] bg-[#e8f1f8] text-[#2e6fa8]' : 'border-[#0b1f33]/10 bg-white'}`}>{label}</button>)}
                </div>
              </div>

              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Opcional · sin azúcar, tocar timbre…" className="w-full rounded-xl border border-[#0b1f33]/10 bg-white px-4 py-3 text-sm outline-none focus:border-[#2e6fa8]" />
              {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-700">{error}</p>}
              <div className="rounded-2xl bg-white p-4"><div className="flex justify-between"><span className="text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Total demo</span><span className="font-serif text-2xl font-black">${total.toLocaleString('es-AR')}</span></div><p className="mt-2 text-xs text-[#0b1f33]/55">No se envía WhatsApp ni se cobra nada. El pedido sí aparece en el panel demo del local.</p></div>
              <button type="button" onClick={submit} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0b1f33] text-sm font-black text-white">Crear pedido de prueba <ArrowRight size={17} /></button>
            </div>
          </div>
        </div>
      )}

      {successId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1f33]/70 p-4">
          <div className="w-full max-w-md rounded-[2rem] bg-[#f4f8fb] p-7 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f1f8] text-[#2e6fa8]"><CheckCircle2 size={30} /></div>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#2e6fa8]">Pedido #{successId}</p>
            <h2 className="mt-2 font-serif text-3xl font-black">La panadería ya lo recibió.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#0b1f33]/60">Abrí la bandeja y vas a ver este mismo pedido listo para preparar.</p>
            <Link to="/panaderia/owner" className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#2e6fa8] text-sm font-black text-white">Ver bandeja del local <ArrowRight size={17} /></Link>
            <Link to={`/panaderia/order/${successId}`} className="mt-2 flex min-h-12 items-center justify-center text-xs font-black uppercase tracking-wide text-[#0b1f33]/60">Ver estado del pedido</Link>
            <button type="button" onClick={() => { setSuccessId(null); setCart([]); setName(''); setPhone(''); setNotes(''); }} className="mt-2 text-xs font-black text-[#2e6fa8]">Seguir mirando</button>
          </div>
        </div>
      )}
    </div>
  );
}
