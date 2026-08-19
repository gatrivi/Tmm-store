import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, MapPin, Printer, QrCode, RefreshCw, UserPlus } from 'lucide-react';
import type { User } from 'firebase/auth';
import {
  REFERRAL_COMMISSION_RATE,
  createReferralFlyer,
  getReferralDashboardData,
  getReferralProfile,
  loginReferrer,
  logoutReferrer,
  saveReferralProfile,
  setReferralFlyerStatus,
  signUpReferrer,
  watchReferralAuth,
  type ReferralDashboardData,
  type ReferralProfile,
} from '../services/referrals';

const money = (value: number) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
}).format(value);

const emptyData: ReferralDashboardData = { flyers: [], placements: [], events: [], sales: [] };

export default function ReferralsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [payoutAlias, setPayoutAlias] = useState('');
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [data, setData] = useState<ReferralDashboardData>(emptyData);
  const [campaign, setCampaign] = useState('Volante general');
  const [locationLabel, setLocationLabel] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const reload = useCallback(async (uid: string) => {
    const [nextProfile, nextData] = await Promise.all([
      getReferralProfile(uid),
      getReferralDashboardData(uid),
    ]);
    setProfile(nextProfile);
    setPayoutAlias(nextProfile?.payoutAlias ?? '');
    setData(nextData);
  }, []);

  useEffect(() => watchReferralAuth((next) => {
    setUser(next);
    setAuthReady(true);
    if (next) void reload(next.uid).catch(() => setError('No pudimos cargar tus referidos.'));
    else {
      setProfile(null);
      setData(emptyData);
    }
  }), [reload]);

  const totals = useMemo(() => {
    const scans = data.events.filter((event) => event.type === 'scan').length;
    const contacts = data.events.filter((event) => event.type === 'contact_click').length;
    const approvedCommission = data.sales
      .filter((sale) => sale.status === 'approved' || sale.status === 'paid')
      .reduce((sum, sale) => sum + sale.commissionAmount, 0);
    const paid = data.sales
      .filter((sale) => sale.status === 'paid')
      .reduce((sum, sale) => sum + sale.commissionAmount, 0);
    return { scans, contacts, approvedCommission, paid };
  }, [data]);

  const statsByFlyer = useMemo(() => data.flyers.map((flyer) => {
    const placement = data.placements.find((item) => item.flyerId === flyer.id);
    const events = data.events.filter((event) => event.flyerId === flyer.id);
    const scans = events.filter((event) => event.type === 'scan').length;
    const contacts = events.filter((event) => event.type === 'contact_click').length;
    return { flyer, placement, scans, contacts };
  }).sort((a, b) => b.contacts - a.contacts || b.scans - a.scans), [data]);

  const submitAuth = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      if (mode === 'signup') {
        await signUpReferrer({ name, email, password, payoutAlias });
        setMessage('Cuenta creada. Ya podés generar tu primer volante.');
      } else {
        await loginReferrer(email, password);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos iniciar sesión.');
    } finally {
      setBusy(false);
    }
  };

  const createFlyer = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setMessage('');
    try {
      const created = await createReferralFlyer({
        campaign,
        locationLabel,
        note: locationNote,
        lat: coords?.lat,
        lng: coords?.lng,
      });
      if (user) await reload(user.uid);
      setLocationLabel(''); setLocationNote(''); setCoords(null);
      setMessage(`Volante ${created.flyer.id} creado.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No pudimos crear el volante.');
    } finally {
      setBusy(false);
    }
  };

  const useLocation = () => {
    setError('');
    if (!navigator.geolocation) {
      setError('Este dispositivo no permite obtener ubicación.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        if (!locationLabel) setLocationLabel('Ubicación GPS guardada');
      },
      () => setError('No pudimos obtener la ubicación. Podés escribirla manualmente.'),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const updateAlias = async () => {
    if (!profile) return;
    setBusy(true); setError('');
    try {
      const next = { ...profile, payoutAlias: payoutAlias.trim() };
      await saveReferralProfile(next);
      setProfile(next);
      setMessage('Alias de cobro actualizado.');
    } catch {
      setError('No pudimos guardar el alias.');
    } finally {
      setBusy(false);
    }
  };

  if (!authReady) return <ReferralShell><p className="text-sm font-bold text-black/50">Cargando…</p></ReferralShell>;

  if (!user) {
    return (
      <ReferralShell>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <section>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Programa de referidos</p>
            <h1 className="mt-4 text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-6xl">Repartí volantes. Medí. Cobrá.</h1>
            <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-black/60">
              Cada volante tiene un QR único. Si trae un cliente, queda atribuido a tu cuenta y podés seguir dónde funcionó.
            </p>
            <div className="mt-7 grid gap-3 text-sm font-bold sm:grid-cols-3">
              <MiniStep number="01" text="Creás cuenta" />
              <MiniStep number="02" text="Generás QR" />
              <MiniStep number="03" text="Seguís resultados" />
            </div>
          </section>

          <form onSubmit={submitAuth} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex rounded-full bg-black/5 p-1 text-sm font-black">
              <button type="button" onClick={() => setMode('signup')} className={`flex-1 rounded-full px-4 py-2 ${mode === 'signup' ? 'bg-black text-white' : ''}`}>Crear cuenta</button>
              <button type="button" onClick={() => setMode('login')} className={`flex-1 rounded-full px-4 py-2 ${mode === 'login' ? 'bg-black text-white' : ''}`}>Entrar</button>
            </div>
            <div className="mt-6 space-y-4">
              {mode === 'signup' && <Field label="Nombre"><input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Tu nombre" /></Field>}
              <Field label="Email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vos@email.com" /></Field>
              <Field label="Contraseña"><input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="6 caracteres mínimo" /></Field>
              {mode === 'signup' && <Field label="Alias para cobrar (opcional)"><input value={payoutAlias} onChange={(e) => setPayoutAlias(e.target.value)} placeholder="tu.alias.mp" /></Field>}
            </div>
            {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
            <button disabled={busy} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#ff6b35] px-5 text-sm font-black text-white disabled:opacity-50">
              <UserPlus size={17} /> {busy ? 'Guardando…' : mode === 'signup' ? 'Crear cuenta de referidos' : 'Entrar'}
            </button>
            <p className="mt-4 text-xs leading-relaxed text-black/45">Comisión base configurada hoy: {Math.round(REFERRAL_COMMISSION_RATE * 100)}%. La venta debe ser validada antes de acreditarse.</p>
          </form>
        </div>
      </ReferralShell>
    );
  }

  return (
    <ReferralShell>
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[#d84d1d]">Panel de referidos</p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.055em] sm:text-5xl">{profile?.referralCode ?? 'Tu cuenta'}</h1>
            <p className="mt-2 text-sm font-bold text-black/45">{profile?.name || user.email}</p>
          </div>
          <button type="button" onClick={() => void logoutReferrer()} className="inline-flex items-center gap-2 self-start rounded-full border border-black/15 px-4 py-2 text-sm font-black">
            <LogOut size={16} /> Salir
          </button>
        </div>

        {(message || error) && <div className={`mt-6 rounded-2xl p-4 text-sm font-bold ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'}`}>{error || message}</div>}

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Volantes activos" value={String(data.flyers.filter((item) => item.status === 'active').length)} />
          <Stat label="Escaneos" value={String(totals.scans)} />
          <Stat label="Contactos" value={String(totals.contacts)} />
          <Stat label="Comisión aprobada" value={money(totals.approvedCommission)} note={`${money(totals.paid)} pagado`} />
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <form onSubmit={createFlyer} className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3"><QrCode size={20} /><h2 className="text-xl font-black">Nuevo volante</h2></div>
            <div className="mt-5 space-y-4">
              <Field label="Campaña"><input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="Ej. Comercios Olivos agosto" required /></Field>
              <Field label="Dónde lo dejaste"><input value={locationLabel} onChange={(e) => setLocationLabel(e.target.value)} placeholder="Ej. Kiosco Maipú y Ugarte" required /></Field>
              <Field label="Nota"><input value={locationNote} onChange={(e) => setLocationNote(e.target.value)} placeholder="Vidriera izquierda, permiso del dueño…" /></Field>
            </div>
            <button type="button" onClick={useLocation} className="mt-4 inline-flex items-center gap-2 rounded-full border border-black/15 px-4 py-2 text-xs font-black">
              <MapPin size={15} /> {coords ? 'GPS guardado ✓' : 'Guardar GPS'}
            </button>
            <button disabled={busy} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white disabled:opacity-50">
              <QrCode size={17} /> Generar volante único
            </button>
          </form>

          <section className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="text-xs font-black uppercase tracking-[0.15em] text-black/40">Rendimiento por lugar</p><h2 className="mt-1 text-xl font-black">Qué está funcionando</h2></div>
              <button type="button" onClick={() => user && void reload(user.uid)} className="rounded-full border border-black/10 p-2" title="Actualizar"><RefreshCw size={16} /></button>
            </div>
            <div className="mt-5 space-y-3">
              {!statsByFlyer.length && <p className="rounded-2xl bg-black/5 p-5 text-sm font-bold text-black/45">Todavía no generaste volantes.</p>}
              {statsByFlyer.map(({ flyer, placement, scans, contacts }) => (
                <article key={flyer.id} className="rounded-2xl border border-black/10 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-[#d84d1d]">{flyer.id}</p>
                      <h3 className="mt-1 font-black">{placement?.label || flyer.campaign}</h3>
                      <p className="mt-1 text-xs font-bold text-black/45">{flyer.campaign}{placement?.note ? ` · ${placement.note}` : ''}</p>
                    </div>
                    <div className="text-right text-xs font-black"><div>{scans} scans</div><div>{contacts} contactos</div></div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link to={`/referidos/flyer/${encodeURIComponent(flyer.id)}`} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black text-white"><Printer size={14} /> Imprimir A6</Link>
                    <button type="button" onClick={async () => { await setReferralFlyerStatus(flyer.id, flyer.status === 'active' ? 'retired' : 'active'); if (user) await reload(user.uid); }} className="rounded-full border border-black/15 px-4 py-2 text-xs font-black">
                      {flyer.status === 'active' ? 'Marcar retirado' : 'Reactivar'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black">Cobro</h2>
          <p className="mt-2 text-sm font-medium text-black/50">Cuando una venta atribuida se valida, aparece como comisión pendiente/aprobada/pagada.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <Field label="Alias"><input value={payoutAlias} onChange={(e) => setPayoutAlias(e.target.value)} placeholder="tu.alias.mp" /></Field>
            <button type="button" disabled={busy || !profile} onClick={() => void updateAlias()} className="min-h-11 rounded-full bg-black px-5 text-sm font-black text-white">Guardar alias</button>
          </div>
        </section>
      </div>
    </ReferralShell>
  );
}

function ReferralShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f5f2eb] px-4 py-8 text-[#171717] sm:px-6 sm:py-12">
      <div className="mx-auto mb-8 flex max-w-6xl items-center justify-between">
        <Link to="/" className="font-black tracking-[-0.04em]">GATRIVI.COM</Link>
        <Link to="/" className="text-xs font-black text-black/45 hover:text-black">← Volver al sitio</Link>
      </div>
      {children}
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block flex-1 text-xs font-black uppercase tracking-[0.08em] text-black/50">{label}<div className="mt-2 [&_input]:min-h-11 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-black/15 [&_input]:bg-white [&_input]:px-3 [&_input]:text-sm [&_input]:font-bold [&_input]:normal-case [&_input]:tracking-normal [&_input]:outline-none [&_input]:focus:border-black">{children}</div></label>;
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-5"><p className="text-xs font-black uppercase tracking-[0.1em] text-black/40">{label}</p><strong className="mt-2 block text-2xl font-black tracking-[-0.04em]">{value}</strong>{note && <small className="mt-1 block font-bold text-black/40">{note}</small>}</div>;
}

function MiniStep({ number, text }: { number: string; text: string }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-4"><span className="text-xs text-[#d84d1d]">{number}</span><p className="mt-1">{text}</p></div>;
}
