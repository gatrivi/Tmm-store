import { APP_VERSION } from '../config/version';

interface AppVersionBadgeProps {
  className?: string;
}

/** Visible build stamp — compare with agent message footer to confirm deploy */
export function AppVersionBadge({ className = '' }: AppVersionBadgeProps) {
  return (
    <span
      className={`inline-block font-mono text-[10px] font-bold tracking-wider uppercase ${className}`}
      title="Trufi build version"
    >
      v{APP_VERSION}
    </span>
  );
}

/** Fixed corner stamp on every route */
export function AppVersionStamp() {
  return (
    <div
      className="fixed bottom-2 left-2 z-[10005] pointer-events-none select-none"
      aria-label={`Versión ${APP_VERSION}`}
    >
      <AppVersionBadge className="px-2 py-1 rounded-md bg-black/50 text-white/80 backdrop-blur-sm border border-white/10" />
    </div>
  );
}
