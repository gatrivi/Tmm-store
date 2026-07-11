/** SHA-256 of default dev credentials (admin / admin123) */
export const DEFAULT_ADMIN_USER_HASH =
  'b6d1bcb9c9ef2ebceab34f1a553e0dedcc758b6b47440b8258f6b4d0bfe72626';
export const DEFAULT_ADMIN_PASS_HASH =
  '75a7fca82df2599b0f619e3db73352cec8ab7e7651c4fcac253ba4e6505e00ac';

export function isUsingDefaultAdminCredentials(): boolean {
  const userHash = import.meta.env.VITE_ADMIN_USER_HASH as string | undefined;
  const passHash = import.meta.env.VITE_ADMIN_PASS_HASH as string | undefined;
  if (!userHash?.trim() || !passHash?.trim()) return true;
  return userHash === DEFAULT_ADMIN_USER_HASH && passHash === DEFAULT_ADMIN_PASS_HASH;
}
