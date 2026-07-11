import { useEffect, useMemo, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Eye,
  MapPin,
  Palette,
  Store,
  WandSparkles,
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import {
  buildProspectDemoSearch,
  parseProspectDemo,
  PROSPECT_CATEGORIES,
  PROSPECT_COLORS,
  type ProspectCategory,
  type ProspectColor,
} from '../utils/prospectDemo';

type CopiedTarget = 'customer' | 'owner' | 'message' | null;

export default function ProspectDemoBuilderPage() {
  const location = useLocation();
  const initial = useMemo(() => parseProspectDemo(location.search), [location.search]);
  const [businessName, setBusinessName] = useState(initial.customized ? initial.businessName : '');
  const [area, setArea] = useState(initial.customized ? initial.area : 'Olivos');
  const [category, setCategory] = useState<ProspectCategory>(initial.category);
  const [color, setColor] = useState<ProspectColor>(initial.color);
  const [copied, setCopied] = useState<CopiedTarget>(null);

  const ready = businessName.trim().length > 1;
  const normalizedName = businessName.trim() || 'Tu negocio';
  const normalizedArea = area.trim() || 'Zona Norte';
  const search = buildProspectDemoSearch({
    businessName: normalizedName,
    area: normalizedArea,
    category,
    color,
  });
  const customerPath = `/demo${search}`;
  const ownerPath = `/demo/owner${search}`;
  const origin = typeof window === 'undefined' ? '' : window.location.origin;
  const customerUrl = `${origin}${customerPath}`;
  const ownerUrl = `${origin}${ownerPath}`;
  const outreachMessage = `Hola, armé una muestra rápida de cómo podría verse ${normalizedName} con pedidos directos:\n${customerUrl}\n\nEs una demo visual con productos de ejemplo. Si te sirve, la adapto a tu menú real.`;

  useEffect(() => {
    document.title = 'Armar demo para prospecto — Trufi';
  }, []);

  const handleCopy = async (target: Exclude<CopiedTarget, null>, value: string) => {
    if (!ready) return;
    const ok = await copyToClipboard(value);
    if (!ok) return;
    setCopied(target);
    window.setTimeout(() => setCopied(current => current === target ? null : current), 1800);
  };

  const preventUnreadyNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!ready) event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#f2eee6] text-[#171814] selection:bg-[#d7ff64]">
      <header className="border-b border-black/10 bg-[#171814] text-white">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-white/70 hover:text-white">
            <ArrowLeft size={15} /> Trufi
          </Link>
          <p className="text-sm font-black">Demo Express</p>
          <span className="rounded-full bg-[#d7ff64] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#171814]">
            Uso comercial
          </span>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/55 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-black/60">
            <WandSparkles size={15} className="text-[#b94335]" /> Preparación: menos de un minuto
          </div>
          <h1 className="mt-6 max-w-xl text-5xl font-black leading-[0.92] tracking-[-0.065em] sm:text-6xl">
            Que el prospecto vea <span className="text-[#b94335]">su negocio.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-black/60">
            Generá una demo con su nombre, rubro, zona y color. El enlace no guarda datos ni necesita preparar un tenant.
          </p>

          <div className="mt-8 rounded-3xl bg-[#171814] p-6 text-white">
            <p className="text-xs font-black uppercase tracking-[0.13em] text-[#d7ff64]">Cómo usarla</p>
            <ol className="mt-5 space-y-4 text-sm font-bold text-white/70">
              {[
                'Completá los datos públicos del negocio.',
                'Copiá el mensaje y enviá el enlace por WhatsApp.',
                'En la reunión, pasá de Cliente a Local sin perder la personalización.',
              ].map((item, index) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs text-[#d7ff64]">{index + 1}</span>
                  <span className="pt-1">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="rounded-[2rem] border border-black/10 bg-[#fbfaf6] p-5 shadow-[0_24px_70px_rgba(30,25,15,0.12)] sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">Negocio</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 focus-within:border-black/35">
                <Store size={18} className="text-black/35" />
                <input
                  value={businessName}
                  onChange={event => setBusinessName(event.target.value.slice(0, 60))}
                  placeholder="Ej. Morelia Pizza"
                  autoFocus
                  className="min-h-14 w-full bg-transparent text-base font-bold outline-none placeholder:text-black/25"
                />
              </div>
            </label>

            <label>
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">Barrio o zona</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 focus-within:border-black/35">
                <MapPin size={18} className="text-black/35" />
                <input
                  value={area}
                  onChange={event => setArea(event.target.value.slice(0, 60))}
                  placeholder="Olivos"
                  className="min-h-14 w-full bg-transparent font-bold outline-none placeholder:text-black/25"
                />
              </div>
            </label>

            <label>
              <span className="text-xs font-black uppercase tracking-[0.12em] text-black/45">Rubro</span>
              <select
                value={category}
                onChange={event => setCategory(event.target.value as ProspectCategory)}
                className="mt-2 min-h-14 w-full rounded-2xl border border-black/10 bg-white px-4 font-bold outline-none focus:border-black/35"
              >
                {Object.entries(PROSPECT_CATEGORIES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <fieldset className="sm:col-span-2">
              <legend className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-black/45">
                <Palette size={14} /> Color principal
              </legend>
              <div className="mt-3 flex flex-wrap gap-3">
                {Object.entries(PROSPECT_COLORS).map(([value, hex]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setColor(value as ProspectColor)}
                    aria-label={`Usar color ${value}`}
                    aria-pressed={color === value}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-4 transition ${color === value ? 'scale-110 border-white shadow-[0_0_0_2px_#171814]' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: hex }}
                  >
                    {color === value && <Check size={18} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="my-7 h-px bg-black/10" />

          <div className="rounded-2xl border border-black/8 bg-white p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-black/40">Mensaje listo para enviar</p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-black/65">{outreachMessage}</p>
            <button
              type="button"
              disabled={!ready}
              onClick={() => handleCopy('message', outreachMessage)}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#171814] px-4 text-sm font-black text-white transition hover:bg-[#b94335] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {copied === 'message' ? <Check size={17} /> : <Copy size={17} />}
              {copied === 'message' ? 'Mensaje copiado' : 'Copiar mensaje + enlace'}
            </button>
          </div>

          {!ready && (
            <p className="mt-3 text-center text-xs font-bold text-[#b94335]">Escribí el nombre del negocio para habilitar los enlaces.</p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              to={ready ? customerPath : '#'}
              onClick={preventUnreadyNavigation}
              aria-disabled={!ready}
              className={`flex min-h-13 items-center justify-center gap-2 rounded-full px-4 text-sm font-black transition ${ready ? 'bg-[#b94335] text-white hover:-translate-y-0.5 hover:bg-[#171814]' : 'pointer-events-none bg-black/8 text-black/30'}`}
            >
              <Eye size={17} /> Abrir demo cliente
            </Link>
            <Link
              to={ready ? ownerPath : '#'}
              onClick={preventUnreadyNavigation}
              aria-disabled={!ready}
              className={`flex min-h-13 items-center justify-center gap-2 rounded-full border px-4 text-sm font-black transition ${ready ? 'border-black/15 bg-white hover:border-black' : 'pointer-events-none border-black/5 text-black/30'}`}
            >
              <ExternalLink size={17} /> Ver panel local
            </Link>
          </div>

          <div className="mt-4 grid gap-2 text-xs sm:grid-cols-2">
            <button
              type="button"
              disabled={!ready}
              onClick={() => handleCopy('customer', customerUrl)}
              className="flex items-center justify-center gap-1.5 py-2 font-bold text-black/45 hover:text-black disabled:opacity-30"
            >
              {copied === 'customer' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'customer' ? 'Link cliente copiado' : 'Copiar solo link cliente'}
            </button>
            <button
              type="button"
              disabled={!ready}
              onClick={() => handleCopy('owner', ownerUrl)}
              className="flex items-center justify-center gap-1.5 py-2 font-bold text-black/45 hover:text-black disabled:opacity-30"
            >
              {copied === 'owner' ? <Check size={14} /> : <Copy size={14} />}
              {copied === 'owner' ? 'Link panel copiado' : 'Copiar solo link panel'}
            </button>
          </div>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-black/40">
            La carta, los pedidos y las métricas son datos de demostración. El nombre y la zona solo viajan en el enlace.
          </p>
        </section>
      </main>

      <footer className="border-t border-black/8 px-4 py-6 text-center text-xs font-bold text-black/40">
        Demo Express · herramienta comercial de Trufi <ArrowRight size={13} className="ml-1 inline" />
      </footer>
    </div>
  );
}
