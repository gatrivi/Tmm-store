import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  X,
} from 'lucide-react';
import { PANADERIA_DEMO } from '../data/demos/panaderia';
import { createDemoOrder } from '../services/demoOrderRepository';
import type { DeliveryType, OrderLineItem, PaymentMethod } from '../types/order';

const PICKUP_SLOTS = ['07:00–07:30', '07:30–08:00', '08:00–08:30', '08:30–09:00', '09:00–09:30'];
const SHOWCASE_IDS = new Set(['medialunas', 'tortitas', 'facturas-surtidas', 'pan-frances', 'criollitos', 'cafe-leche']);

function orderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

export default function PanaderiaDemoPage() {
  const products = useMemo(
    () => PANADERIA_DEMO.menuItems.filter(item => SHOWCASE_IDS.has(item.id)),
    [],
  );
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

  const itemCount = cart.reduce((sum, line) => sum + line.qty, 0);
  const total = cart.reduce((sum, line) => sum + line.price * line.qty, 0);

  const add = (productId: string, optionId: string) => {
    const product = PANADERIA_DEMO.menuItems.find(item => item.id === productId);
    const option = product?.options.find(opt => opt.id === optionId);
    if (!product || !option) return;

    setCart(prev => {
      const idx = prev.findIndex(line => line.id === productId && line.optionId === optionId);
      if (idx >= 0) {
        return prev.map((line, i) => (i === idx ? { ...line, qty: line.qty + 1 } : line));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          optionId: option.id,
          optionLabel: option.label,
          price: option.price,
          qty: 1,
        },
      ];
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
    if (cart.length === 0) return;

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

      <header className="sticky top-0 z-30 border-b border-[#0b1f33]/10 bg-[#f4f8fb]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/demos/panaderia/logo-blueprint.png" alt="La Magdalena" className="h-11 w-11 rounded-xl object-cover" />
            <div>
              <p className="font-serif text-lg font-black leading-none">La Magdalena</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2e6fa8]">Panadería artesanal</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative flex min-h-11 items-center gap-2 rounded-full bg-[#0b1f33] px-4 text-sm font-black text-white shadow-lg"
          >
            <ShoppingBag size={17} />
            Pedido
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5ba3d9] px-1 text-[10px] text-[#0b1f33]">{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-8 pt-4 md:pt-8">
          <div className="overflow-hidden rounded-[2rem] bg-[#0b1f33] text-white shadow-xl md:grid md:grid-cols-[1.04fr_.96fr]">
            <div className="relative h-[190px] overflow-hidden bg-[#c5d5e4] sm:h-[250px] md:order-2 md:h-full md:min-h-[520px]">
              <img
                src="/demos/panaderia/products/medialunas.jpg"
                alt="Medialunas de manteca recién horneadas"
                className="absolute inset-0 h-full w-full object-cover object-center scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1f33]/70 via-[#0b1f33]/5 to-transparent md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-[#0b1f33]/20" />
              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-[#0b1f33]/75 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-white backdrop-blur-sm md:left-auto md:right-5 md:top-5">
                <span className="h-2 w-2 rounded-full bg-[#9fd3f3]" />
                Horneado hoy
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 rounded-2xl border border-white/15 bg-[#0b1f33]/82 p-4 backdrop-blur-md md:bottom-6 md:left-6 md:right-6">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#9fd3f3]">Más pedidas</p>
                  <p className="mt-1 font-serif text-xl font-black leading-none sm:text-2xl">Medialunas de manteca</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[9px] font-black uppercase tracking-wide text-[#c5d5e4]">Media docena</p>
                  <p className="mt-1 text-base font-black">$4.800</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8 md:order-1 md:p-10 lg:p-12">
              <div className="mb-5 flex flex-wrap gap-2">
                {['Retiro por horario', 'Pedido listo'].map(label => (
                  <span key={label} className="rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-[#c5d5e4]">
                    {label}
                  </span>
                ))}
              </div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-[#5ba3d9]">Tu desayuno, ya encargado</p>
              <h1 className="max-w-2xl font-serif text-[clamp(2.65rem,8vw,4.8rem)] font-black leading-[0.9] tracking-[-0.05em]">
                Facturas de la mañana, ya encargadas.
              </h1>
              <p className="mt-5 max-w-xl text-sm font-medium leading-relaxed text-[#c5d5e4] sm:text-base">
                Elegí media o docena, reservá horario y pasá a buscar. Sin audios a las 7 ni pedidos perdidos en WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => document.getElementById('menu-panaderia')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#e8f1f8] px-6 text-sm font-black text-[#0b1f33] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 sm:w-fit"
              >
                Armar mi pedido <ArrowRight size={17} />
              </button>
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#c5d5e4]/65 sm:text-left">
                Elegís · reservás horario · retirás
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-[#0b1f33]/10 bg-white/70">
          <div className="mx-auto grid max-w-6xl gap-3 px-4 py-5 sm:grid-cols-3">
            {[
              [Clock3, 'Elegí horario', 'Retiro sin espera innecesaria.'],
              [ShoppingBag, 'Pedido claro', 'Producto, cantidad y total en una sola vista.'],
              [Sparkles, 'Menos mensajes', 'El local recibe datos listos para preparar.'],
            ].map(([Icon, title, body]) => {
              const C = Icon as typeof Clock3;
              return (
                <div key={String(title)} className="flex gap-3 rounded-2xl border border-[#0b1f33]/8 bg-white p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f1f8] text-[#2e6fa8]"><C size={18} /></div>
                  <div><p className="text-sm font-black">{String(title)}</p><p className="mt-1 text-xs leading-relaxed text-[#0b1f33]/65">{String(body)}</p></div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="menu-panaderia" className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <div className="mb-7 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#2e6fa8]">Horneado de hoy</p>
              <h2 className="mt-2 font-serif text-3xl font-black tracking-[-0.03em] sm:text-4xl">Armá tu bolsa</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[#0b1f33]/60">Una selección corta para que la demo se entienda en segundos. En producción puede vivir el catálogo completo.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map(product => (
              <article key={product.id} className="overflow-hidden rounded-[1.6rem] border border-[#0b1f33]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={product.images?.[0]} alt={product.name} loading="lazy" className="h-48 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-xl font-black">{product.name}</h3>
                      <p className="mt-1 text-xs font-medium text-[#0b1f33]/55">{product.description}</p>
                    </div>
                    {product.badge && <span className="rounded-full bg-[#e8f1f8] px-2.5 py-1 text-[9px] font-black uppercase tracking-wide text-[#2e6fa8]">{product.badge}</span>}
                  </div>
                  <div className="mt-5 space-y-2">
                    {product.options.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => add(product.id, option.id)}
                        className="flex min-h-11 w-full items-center justify-between rounded-xl border border-[#0b1f33]/10 bg-[#f4f8fb] px-3 text-left transition hover:border-[#2e6fa8]/40 hover:bg-[#e8f1f8]"
                      >
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
      </main>

      <footer className="border-t border-[#0b1f33]/10 bg-[#0b1f33] px-4 py-8 text-[#e8f1f8]">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div><p className="font-serif text-xl font-black">La Magdalena</p><p className="mt-1 text-xs text-[#c5d5e4]">Demo de pedidos para panadería · Gatrivi.com</p></div>
          <Link to="/panaderia/owner" className="text-xs font-black uppercase tracking-[0.14em] text-[#5ba3d9]">Ver panel del local →</Link>
        </div>
      </footer>

      {itemCount > 0 && !cartOpen && !checkoutOpen && !successId && (
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 left-1/2 z-30 flex min-h-14 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full bg-[#2e6fa8] px-5 text-white shadow-2xl"
        >
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
              {cart.length === 0 ? (
                <p className="py-10 text-center text-sm text-[#0b1f33]/55">Todavía no agregaste nada.</p>
              ) : (
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
              ) : (
                <div><label className="mb-2 block text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Dirección</label><input value={address} onChange={e => setAddress(e.target.value)} placeholder="Calle, altura y localidad" className="min-h-12 w-full rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" /></div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" className="min-h-12 rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Teléfono" className="min-h-12 rounded-xl border border-[#0b1f33]/10 bg-white px-4 text-sm outline-none focus:border-[#2e6fa8]" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-black uppercase tracking-wide text-[#0b1f33]/55">Pago</label>
                <div className="grid grid-cols-2 gap-2">
                  {[['cash', 'Efectivo al retirar'], ['transfer', 'Transferencia al confirmar']].map(([id, label]) => (
                    <button key={id} type="button" onClick={() => setPaymentMethod(id as PaymentMethod)} className={`min-h-12 rounded-xl border px-3 text-xs font-black ${paymentMethod === id ? 'border-[#2e6fa8] bg-[#e8f1f8] text-[#2e6fa8]' : 'border-[#0b1f33]/10 bg-white'}`}>{label}</button>
                  ))}
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