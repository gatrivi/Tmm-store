import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Loader2, Plus } from 'lucide-react';
import { createTenant, isFirebaseConfigured, listTenants } from '../services/tenantService';
import type { Plan } from '../config/plans';
import { PLAN_LABELS } from '../config/plans';
import type { TenantRecord } from '../types/tenant';

const SUPER_ADMIN_KEY = import.meta.env.VITE_SUPER_ADMIN_KEY as string | undefined;

export default function SuperAdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [tenants, setTenants] = useState<TenantRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [slug, setSlug] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [plan, setPlan] = useState<Plan>('pedidos');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const firebaseReady = isFirebaseConfigured();

  const handleAuth = () => {
    if (!SUPER_ADMIN_KEY) {
      setError('VITE_SUPER_ADMIN_KEY no configurada');
      return;
    }
    if (keyInput === SUPER_ADMIN_KEY) {
      setAuthorized(true);
      setError(null);
      refreshTenants();
    } else {
      setError('Clave incorrecta');
    }
  };

  const refreshTenants = async () => {
    setLoading(true);
    try {
      setTenants(await listTenants());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar tenants');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!slug.trim() || !businessName.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const tenant = await createTenant({
        slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        businessName: businessName.trim(),
        plan,
      });
      setSuccess(`Tenant "${tenant.slug}" creado. URL: /s/${tenant.slug}`);
      setSlug('');
      setBusinessName('');
      await refreshTenants();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear tenant');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseReady) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
        <Building2 size={48} className="text-gray-600 mb-4" />
        <h1 className="text-xl font-black mb-2">Super Admin</h1>
        <p className="text-gray-400 mb-6">Configurá Firebase en .env para provisionar tenants.</p>
        <Link to="/" className="text-green-400 hover:underline">Volver</Link>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-black text-center">Super Admin</h1>
          <input
            type="password"
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
            placeholder="Clave de acceso"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            onClick={handleAuth}
            className="w-full bg-green-600 hover:bg-green-500 py-3 rounded-xl font-bold"
          >
            Ingresar
          </button>
          <Link to="/" className="block text-center text-gray-500 text-sm hover:text-white">Volver</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black">Provisionar tenants</h1>
          <Link to="/" className="text-sm text-gray-400 hover:text-white">← Inicio</Link>
        </div>

        <div className="bg-white/3 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-bold flex items-center gap-2"><Plus size={18} /> Nuevo tenant</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              placeholder="slug (ej: puestito)"
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              value={businessName}
              onChange={e => setBusinessName(e.target.value)}
              placeholder="Nombre del negocio"
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
            />
            <select
              value={plan}
              onChange={e => setPlan(e.target.value as Plan)}
              className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm"
            >
              {(['menu', 'pedidos', 'premium'] as Plan[]).map(p => (
                <option key={p} value={p}>{PLAN_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-2.5 rounded-xl text-sm font-bold"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Crear tenant
          </button>
          {success && <p className="text-green-400 text-sm">{success}</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <div className="space-y-3">
          <h2 className="font-bold">Tenants ({tenants.length})</h2>
          {tenants.map(t => (
            <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 bg-white/3 border border-white/5 rounded-xl p-4">
              <div>
                <p className="font-black">{t.businessName}</p>
                <p className="text-xs text-gray-400">/{t.slug} · Plan {PLAN_LABELS[t.plan]}</p>
              </div>
              <Link to={`/s/${t.slug}`} className="text-xs text-green-400 hover:underline">
                Ver tienda
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
