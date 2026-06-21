import { useState } from 'react';
import { Cloud, RefreshCw } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { verifyCloudSync } from '../../services/tenantService';
import { CloudSyncBadge } from './CloudSyncBadge';

export function CloudSyncPanel() {
  const { cloudSyncEnabled, cloudSyncStatus, tenantId } = useMenu();
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleVerify = async () => {
    setChecking(true);
    setResult(null);
    const res = await verifyCloudSync(tenantId);
    setResult(res);
    setChecking(false);
  };

  return (
    <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
          <Cloud size={20} className="text-sky-400" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-black text-white block">Sync en la nube</span>
          <span className="text-xs text-gray-400 font-medium">
            Pedidos MVP requiere Firebase — celular y PC deben ver lo mismo.
          </span>
        </div>
        <CloudSyncBadge />
      </div>

      <div className="border-t border-white/5 pt-4 space-y-3 text-xs">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-gray-400">
          <span>Tenant: <code className="text-gray-200 bg-white/10 px-1.5 py-0.5 rounded">{tenantId}</code></span>
          <span>Estado: <span className="text-gray-200 font-bold">{cloudSyncStatus}</span></span>
        </div>

        {!cloudSyncEnabled && (
          <p className="text-amber-400/90 font-medium">
            Configurá VITE_FIREBASE_* y reiniciá dev. Guía: docs/ops/firebase-setup.md
          </p>
        )}

        {cloudSyncEnabled && (
          <>
            <p className="text-gray-500">
              Verificación: abrí admin en otro dispositivo, editá un precio, confirmá que cambia en ambos.
            </p>
            <button
              type="button"
              onClick={handleVerify}
              disabled={checking}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition disabled:opacity-50"
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
              Probar escritura Firestore
            </button>
          </>
        )}

        {result && (
          <p className={`font-bold ${result.ok ? 'text-green-400' : 'text-red-400'}`}>
            {result.message}
          </p>
        )}
      </div>
    </div>
  );
}
