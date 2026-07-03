import { AlertTriangle } from 'lucide-react';
import { isUsingDefaultAdminCredentials } from '../../utils/adminSecurity';

export function AdminSecurityBanner() {
  if (!isUsingDefaultAdminCredentials()) return null;

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm mb-6">
      <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
      <div>
        <p className="font-bold text-amber-100">Contraseña por defecto activa</p>
        <p className="text-xs text-amber-200/80 mt-1">
          Cambiá el login antes de entregar la tablet:{' '}
          <code className="text-amber-100">npm run hash:admin</code> → variables{' '}
          <code className="text-amber-100">VITE_ADMIN_*_HASH</code> en Vercel.
        </p>
      </div>
    </div>
  );
}
