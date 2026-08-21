import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { User } from 'firebase/auth';
import {
  createReferralSale,
  getReferralAdminData,
  isReferralAdminUser,
  setReferralSaleStatus,
  watchReferralAuth,
  type ReferralAdminData,
  type ReferralSaleStatus,
} from '../services/referrals';

const emptyData: ReferralAdminData = { profiles: [], flyers: [], placements: [], events: [], sales: [] };
const money = (value: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

export default function ReferralAdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [data, setData] = useState<ReferralAdminData>(emptyData);
  const [flyerId, setFlyerId] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const reload = useCallback(async () => {
    const next = await getReferralAdminData();
    setData(next);
    if (!flyerId && next.flyers.length) setFlyerId(next.flyers[0].id);
  }, [flyerId]);

  useEffect(() => watchReferralAuth((nextUser) => {
    setUser(nextUser);
    void (async () => {
      const allowed = await isReferralAdminUser(nextUser);
      setAdmin(allowed);
      if (allowed) {
        try { await reload(); } catch { setError('No pudimos cargar el ledger de referidos.'); }
      }
      setReady(true);
    })();
  }), [reload]);

  const totals = useMemo(() => ({
    scans: data.events.filter((event) => event.type === 'scan').length,
    contacts: data.events.filter((event) => event.type === 'contact_click').length,
    revenue: data.sales.reduce((sum, sale) => sum + sale.amount, 0),
    approved: data.sales.filter((sale) => sale.status === 'approved').reduce((sum, sale) => sum + sale.commissionAmount, 0),
    paid: data.sales.filter((sale) => sale.status === 'paid').reduce((sum, sale) => sum + sale.commissionAmount, 0),
  }), [data]);

  const locationRows = useMemo(() => data.flyers.map((flyer) => {
    const placement = data.placements.find((item) => item.flyerId === flyer.id);
    const profile = data.profiles.find((item) => item.uid === flyer.ownerUid);
    const events = data.events.filter((event) => event.flyerId === flyer.id);
    const sales = data.sales.filter((sale) => sale.flyerId === flyer.id);
    return {
      flyer,
      placement,
      profile,
      scans: events.filter((event) => event.type === 'scan').length,
      contacts: events.filter((event) => event.type === 'contact_click').length,
      revenue: sales.reduce((sum, sale) => sum + sale.amount, 0),
    };
  }).sort((a, b) => b.revenue - a.revenue || b.contacts - a.contacts || b.scans - a.scans), [data]);

  const submitSale = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const sale = await createReferralSale({ flyerId, amount: Number(amount), reference, status: 'approved' });
      setAmount(''); setReference('');
      setMessage(`Venta cargada: ${money(sale.amount)} · comisión ${money(sale.commissionAmount)}.`);
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos cargar la venta.');
    } finally {
      setBusy(false);
    }
  };

  const updateStatus = async (id: string, status: ReferralSaleStatus) => {
    setBusy(true); setError('');
    try {
      await setReferralSaleStatus(id, status);
      await reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos actualizar el pago.');
    } finally {
      setBusy(false);
    }
  };

  if (!ready) return <Shell><p className="text-sm font-bold text-black/45">Cargando…</p></Shell>;
  if (!user) return <Shell><Notice>Primero iniciá sesión en <Link className="underline" to="/referidos">Referidos</Link>.</Notice></Shell>;
  if (!admin) return <Shell><Notice>Esta cuenta no tiene permisos de administración de referidos.</Notice></Shell>;

  return (
    <Shell>
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.15em] text-[#d84d1d]">Administración</p><h1 className="mt-2 text-4xl font-black tracking-[-0.055em]">Referidos y comisiones</h1></div>
          <Link to="/referidos" className="rounded-full border border-black/15 px-4 py-2 text-xs font-black">Ver mi panel</Link>
        </div>

        {(error || message) && <div className={`mt-6 rounded-2xl p-4 text-sm font-bold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{error || message}</div>}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Stat label="Referidores" value={String(data.profiles.length)} />
          <Stat label="Flyers" value={String(data.flyers.length)} />
          <Stat label="Scans" value={String(totals.scans)} />
          <Stat label="Contactos" value={String(totals.contacts)} />
          <Stat label="Ventas" value={money(totals.revenue)} />
          <Stat label="A pagar" value={money(totals.approved)} note={`${money(totals.paid)} pagado`} />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.75fr_1.25fr]">
          <form onSubmit={submitSale} className="rounded-[2rem] border border-black/10 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-black/40">Validar conversión</p>
            <h2 className="mt-1 text-xl font-black">Cargar venta</h2>
            <label className="mt-5 block text-xs font-black uppercase tracking-[0.08em] text-black/50">Flyer<select value={flyerId} onChange={(e) => setFlyerId(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-black/15 bg-white px-3 text-sm font-bold normal-case tracking-normal">
              {locationRows.map(({ flyer, placement, profile }) => <option key={flyer.id} value={flyer.id}>{placement?.label || flyer.id} — {profile?.name || flyer.referralCode}</option>)}
            </select></label>
            <Field label="Referencia"><input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ej. Tienda estándar #104" /></Field>
            <Field label="Valor de la venta"><input type="number" min="1" step="1000" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="325000" required /></Field>
            <button disabled={busy || !flyerId} className="mt-5 min-h-12 w-full rounded-full bg-black px-5 text-sm font-black text-white disabled:opacity-40">Aprobar venta + comisión</button>
          </form>

          <section className="rounded-[2rem] border border-black/10 bg-white p-6">
            <p className="text-xs font-black uppercase tracking-[0.15em] text-black/40">Ranking físico</p>
            <h2 className="mt-1 text-xl font-black">Dónde rinden los flyers</h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="text-xs uppercase tracking-[0.08em] text-black/40"><tr><th className="pb-3">Lugar</th><th>Referidor</th><th>Scans</th><th>Contactos</th><th>Ventas</th></tr></thead>
                <tbody>{locationRows.map((row) => <tr key={row.flyer.id} className="border-t border-black/10"><td className="py-3 pr-4"><b>{row.placement?.label || 'Sin ubicación'}</b><small className="block text-black/40">{row.flyer.id}</small></td><td className="pr-4">{row.profile?.name || row.flyer.referralCode}</td><td>{row.scans}</td><td>{row.contacts}</td><td className="font-black">{money(row.revenue)}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-black/40">Ledger</p>
          <h2 className="mt-1 text-xl font-black">Comisiones</h2>
          {!data.sales.length ? <p className="mt-5 rounded-2xl bg-black/5 p-5 text-sm font-bold text-black/45">Todavía no hay ventas validadas.</p> : <div className="mt-5 space-y-3">{data.sales.map((sale) => {
            const profile = data.profiles.find((item) => item.uid === sale.ownerUid);
            const placement = data.placements.find((item) => item.flyerId === sale.flyerId);
            return <article key={sale.id} className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center md:justify-between"><div><b>{sale.reference}</b><p className="mt-1 text-xs font-bold text-black/45">{profile?.name || sale.referralCode} · {placement?.label || sale.flyerId}</p></div><div className="md:text-right"><strong>{money(sale.commissionAmount)}</strong><small className="ml-2 text-black/40">de {money(sale.amount)}</small><div className="mt-2 flex flex-wrap gap-2 md:justify-end">{(['pending','approved','paid'] as const).map((status) => <button disabled={busy} key={status} onClick={() => void updateStatus(sale.id, status)} className={`rounded-full px-3 py-1 text-[11px] font-black ${sale.status === status ? 'bg-black text-white' : 'border border-black/15'}`}>{status === 'pending' ? 'Pendiente' : status === 'approved' ? 'Aprobada' : 'Pagada'}</button>)}</div></div></article>;
          })}</div>}
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-[#f5f2eb] px-4 py-8 text-[#171717] sm:px-6 sm:py-12"><div className="mx-auto mb-8 flex max-w-7xl justify-between"><Link to="/" className="font-black tracking-[-0.04em]">GATRIVI.COM</Link><Link to="/referidos" className="text-xs font-black text-black/45">Referidos</Link></div>{children}</main>;
}
function Notice({ children }: { children: React.ReactNode }) { return <div className="mx-auto max-w-lg rounded-[2rem] bg-white p-8 text-sm font-bold shadow-xl">{children}</div>; }
function Stat({ label, value, note }: { label: string; value: string; note?: string }) { return <div className="rounded-2xl border border-black/10 bg-white p-4"><p className="text-[10px] font-black uppercase tracking-[0.1em] text-black/40">{label}</p><strong className="mt-2 block text-lg font-black">{value}</strong>{note && <small className="text-black/40">{note}</small>}</div>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="mt-4 block text-xs font-black uppercase tracking-[0.08em] text-black/50">{label}<div className="mt-2 [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-black/15 [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:font-bold [&_input]:normal-case [&_input]:tracking-normal">{children}</div></label>; }
