export function resolveAdminPath(tenantId: string): string {
  if (tenantId && tenantId !== 'default') return `/s/${tenantId}/admin`;
  return '/admin';
}
