import QRCode from 'qrcode';

/**
 * Generates a PNG data URL QR code for the storefront URL.
 */
export async function generateStoreQrDataUrl(storeUrl: string): Promise<string> {
  return QRCode.toDataURL(storeUrl, {
    width: 220,
    margin: 2,
    color: { dark: '#000000', light: '#ffffff' },
  });
}

export function buildStorefrontUrl(storePath: string): string {
  if (typeof window === 'undefined') return storePath;
  return `${window.location.origin}${storePath}`;
}
