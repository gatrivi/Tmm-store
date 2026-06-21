export const SETUP_COMPLETE_KEY = 'elpuestito_setup_complete';

export function isClientSetupComplete(): boolean {
  try {
    return localStorage.getItem(SETUP_COMPLETE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markClientSetupComplete(): void {
  localStorage.setItem(SETUP_COMPLETE_KEY, '1');
}

export function shouldOpenSetupWizard(): boolean {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get('setup') === '1') return true;
  return !isClientSetupComplete();
}

export function resolveStorefrontPath(tenantId: string): string {
  if (tenantId && tenantId !== 'default') return `/s/${tenantId}`;
  return '/';
}
