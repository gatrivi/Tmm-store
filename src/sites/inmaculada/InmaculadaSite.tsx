/**
 * La Inmaculada — sitio propio de verdulería (MVP fase 1).
 * Flujo: hero → "Hoy llegó" (pizarra) → bolsones → lista de mercado →
 * carrito sticky → checkout (nombre + teléfono) → WhatsApp → "Pedido enviado".
 * Sin tracking, sin cuenta, sin persistencia de pedidos.
 */
import { useMemo, useState } from 'react';
import { ALL_PRODUCTS, CATEGORIES, HOY_LLEGO, SITE, fmt, type Product } from './site';
import './inmaculada.css';

type CartLine = { productId: string; name: string; optionId: string; optionLabel: string; price: number; qty: number };

type Flow = 'cart' | 'checkout' | 'sent';

const waLink = (text: string) => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

export default function InmaculadaSite() {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [flow, setFlow] = useState<Flow>('cart');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [mode, setMode] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const total = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);

  function addOption(product: Product, optionId: string) {
    const opt = product.options.find((o) => o.id === optionId);
    if (!opt) return;
    setLines((prev) => {
      const found = prev.find((l) => l.productId === product.id && l.optionId === opt.id);
      if (found) return prev.map((l) => (l === found ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { productId: product.id, name: product.name, optionId: opt.id, optionLabel: opt.label, price: opt.price, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(line: CartLine, delta: number) {
    setLines((prev) =>
      prev
        .map((l) => (l === line ? { ...l, qty: l.qty + delta } : l))
        .filter((l) => l.qty > 0),
    );
  }

  function sendToWhatsApp() {
    const items = lines.map((l) => `• ${l.qty} × ${l.name} (${l.optionLabel}) — ${fmt(l.price * l.qty)}`).join('\n');
    const msg = [
      `Pedido — ${SITE.brand}`,
      '',
      items,
      '',
      `Total estimado: ${fmt(total)}`,
      `Entrega: ${mode === 'delivery' ? `Delivery — ${address}` : 'Retiro en el local'}`,
      name ? `Nombre: ${name}` : '',
      phone ? `Teléfono: ${phone}` : '',
      notes ? `Notas: ${notes}` : '',
      '',
      'El peso y el total final se confirman antes de preparar.',
    ]
      .filter(Boolean)
      .join('\n');
    window.open(waLink(msg), '_blank', 'noopener');
    setCartOpen(false);
    setFlow('sent');
  }

  const canSend = lines.length > 0 && (mode === 'pickup' ? name.length > 1 : name.length > 1 && address.length > 4);

  return (
    <div className="inm">
      <a className="inm-skip" href="#carta">Ir a la carta</a>

      {/* Hero */}
      <header className="inm-hero">
        <p className="inm-hero-eyebrow">{SITE.tagline}</p>
        <h1 className="inm-hero-title">
          Fresco de la <em>quinta</em> a tu mesa
        </h1>
        <p className="inm-hero-body">
          Pedí como le hablás al mostrador, pero escrito: elegís por peso o unidad, ves el total estimado y
          nosotros confirmamos el peso antes de preparar. Sin cuenta, sin app.
        </p>
        <div className="inm-hero-cta">
          <a className="inm-btn inm-btn-primary" href="#carta">Armar pedido</a>
          <a className="inm-btn inm-btn-ghost" href="#zona">Zona y horarios</a>
        </div>
        <figure className="inm-hero-photo">
          <img src="/demos/verduleria/hero.jpg" alt="Mostrador de La Inmaculada con frutas y verduras frescas" />
          <figcaption>{SITE.address}</figcaption>
        </figure>
      </header>

      {/* Pizarra: Hoy llegó */}
      <section className="inm-pizarra" aria-label="Hoy llegó al local">
        <p className="inm-pizarra-title">Hoy llegó</p>
        <ul className="inm-pizarra-list">
          {HOY_LLEGO.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Carta: lista de mercado */}
      <main id="carta" className="inm-carta">
        {CATEGORIES.map((cat) => {
          const items = ALL_PRODUCTS.filter((p) => p.category === cat.id);
          if (!items.length) return null;
          return (
            <section key={cat.id} className="inm-cat">
              <h2 className="inm-cat-title">{cat.name}</h2>
              <ul className="inm-cat-list">
                {items.map((p) => (
                  <li key={p.id} className="inm-row">
                    <div className="inm-row-head">
                      <span className="inm-row-name">
                        {p.name}
                        {p.badge && <span className="inm-badge">{p.badge}</span>}
                      </span>
                      {p.note && <span className="inm-row-note">{p.note}</span>}
                    </div>
                    <div className="inm-opts">
                      {p.options.map((o) => (
                        <button key={o.id} type="button" className="inm-pill" onClick={() => addOption(p, o.id)}>
                          <span className="inm-pill-label">{o.label}</span>
                          <span className="inm-pill-price">{fmt(o.price)}</span>
                          <span className="inm-pill-add" aria-hidden="true">+</span>
                          <span className="inm-sr">Agregar {p.name} {o.label} — {fmt(o.price)}</span>
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>

      {/* Zona / horarios */}
      <section id="zona" className="inm-zona">
        <div className="inm-zona-col">
          <h2 className="inm-cat-title">Zona de entrega</h2>
          <p className="inm-zona-text">{SITE.deliveryNote}</p>
          <p className="inm-zona-text">{SITE.minNote}</p>
        </div>
        <div className="inm-zona-col">
          <h2 className="inm-cat-title">Horarios</h2>
          <dl className="inm-hours">
            {SITE.hours.map(([d, h]) => (
              <div key={d} className="inm-hours-row">
                <dt>{d}</dt>
                <dd>{h}</dd>
              </div>
            ))}
          </dl>
          <p className="inm-zona-text">
            Retiro en {SITE.address}. Local: <a className="inm-link" href={waLink('Hola, consulta desde el sitio')}>WhatsApp del local</a>.
          </p>
        </div>
      </section>

      <footer className="inm-footer">
        <p>
          <strong>{SITE.brand}</strong> · {SITE.address}
        </p>
        <p className="inm-footer-demo">{SITE.demoNotice}</p>
      </footer>

      {/* Barra sticky */}
      {lines.length > 0 && (
        <button type="button" className="inm-sticky" onClick={() => { setCartOpen(true); setFlow('cart'); }}>
          <span className="inm-sticky-count">{lines.reduce((s, l) => s + l.qty, 0)}</span>
          <span className="inm-sticky-label">Tu pedido</span>
          <span className="inm-sticky-total">{fmt(total)} <small>estimado</small></span>
        </button>
      )}

      {/* Drawer carrito / checkout */}
      {cartOpen && flow !== 'sent' && (
        <div className="inm-overlay" onClick={() => setCartOpen(false)}>
          <div className="inm-drawer" role="dialog" aria-modal="true" aria-label="Tu pedido" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="inm-close" onClick={() => setCartOpen(false)} aria-label="Cerrar">×</button>
            {flow === 'cart' ? (
              <>
                <h2 className="inm-drawer-title">Tu pedido</h2>
                {lines.length === 0 && <p className="inm-zona-text">Todavía no agregaste nada. Volvé a la carta y tocá un precio.</p>}
                <ul className="inm-cart-list">
                  {lines.map((l) => (
                    <li key={`${l.productId}-${l.optionId}`} className="inm-cart-row">
                      <span className="inm-cart-name">
                        {l.name} <small>({l.optionLabel})</small>
                      </span>
                      <span className="inm-qty">
                        <button type="button" onClick={() => changeQty(l, -1)} aria-label={`Quitar uno: ${l.name}`}>−</button>
                        <span>{l.qty}</span>
                        <button type="button" onClick={() => changeQty(l, 1)} aria-label={`Agregar uno: ${l.name}`}>+</button>
                      </span>
                      <span className="inm-cart-price">{fmt(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="inm-total">
                  Total estimado: <strong>{fmt(total)}</strong>
                  <small>El peso y el total final se confirman antes de preparar.</small>
                </p>
                <button type="button" className="inm-btn inm-btn-primary inm-btn-block" disabled={lines.length === 0} onClick={() => setFlow('checkout')}>
                  Confirmar pedido
                </button>
              </>
            ) : (
              <>
                <h2 className="inm-drawer-title">Tus datos</h2>
                <label className="inm-field">
                  <span>Tu nombre</span>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Clara" autoComplete="name" />
                </label>
                <label className="inm-field">
                  <span>Teléfono</span>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="11 5555 5555" type="tel" autoComplete="tel" />
                </label>
                <div className="inm-modes" role="radiogroup" aria-label="Entrega">
                  <button type="button" className={mode === 'delivery' ? 'inm-mode selected' : 'inm-mode'} onClick={() => setMode('delivery')}>Delivery</button>
                  <button type="button" className={mode === 'pickup' ? 'inm-mode selected' : 'inm-mode'} onClick={() => setMode('pickup')}>Retiro en el local</button>
                </div>
                {mode === 'delivery' && (
                  <label className="inm-field">
                    <span>Dirección</span>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, altura y localidad" autoComplete="street-address" />
                  </label>
                )}
                <label className="inm-field">
                  <span>Notas (opcional)</span>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Madurez de la banana, sustitutos, horario..." />
                </label>
                <p className="inm-total">
                  Total estimado: <strong>{fmt(total)}</strong>
                  <small>Se abre WhatsApp con el pedido armado. Pago al recibir o coordinar.</small>
                </p>
                <button type="button" className="inm-btn inm-btn-primary inm-btn-block" disabled={!canSend} onClick={sendToWhatsApp}>
                  Enviar pedido por WhatsApp
                </button>
                <button type="button" className="inm-btn inm-btn-ghost inm-btn-block" onClick={() => setFlow('cart')}>
                  Volver al pedido
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Pantalla pedido enviado */}
      {flow === 'sent' && (
        <div className="inm-overlay">
          <div className="inm-drawer inm-sent" role="dialog" aria-modal="true" aria-label="Pedido enviado">
            <p className="inm-sent-eyebrow">Listo, salió por WhatsApp</p>
            <h2 className="inm-drawer-title">Pedido enviado</h2>
            <p className="inm-zona-text">
              Te lo confirmamos por WhatsApp con el peso real y el total final. Si falta algo o cambió un precio,
              te escribimos antes de preparar nada.
            </p>
            <button type="button" className="inm-btn inm-btn-primary inm-btn-block" onClick={() => { setFlow('cart'); setLines([]); setCartOpen(false); }}>
              Seguir comprando
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
