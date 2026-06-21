import { Cloud, CloudOff, Loader2, AlertTriangle } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

export function CloudSyncBadge() {
  const { cloudSyncStatus, tenantId } = useMenu();

  if (cloudSyncStatus === 'offline') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold" title="Solo este navegador — configurá Firebase para sync">
        <CloudOff size={12} />
        Local
      </span>
    );
  }

  if (cloudSyncStatus === 'loading') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 text-gray-400 text-[10px] font-bold">
        <Loader2 size={12} className="animate-spin" />
        Sync…
      </span>
    );
  }

  if (cloudSyncStatus === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-500/10 text-red-400 text-[10px] font-bold">
        <AlertTriangle size={12} />
        Sync error
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold" title={`Tenant: ${tenantId}`}>
      <Cloud size={12} />
      Nube
    </span>
  );
}
