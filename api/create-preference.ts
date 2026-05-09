/**
 * @file api/create-preference.ts
 * @description Vercel Serverless Function para crear preferencias de pago en MercadoPago.
 * Recibe el carrito desde el frontend, crea una preferencia con monto exacto,
 * y devuelve el link de pago (init_point).
 *
 * Requiere la variable de entorno MP_ACCESS_TOKEN configurada en Vercel.
 */
import { MercadoPagoConfig, Preference } from 'mercadopago';
import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PreferenceItem {
  title: string;
  quantity: number;
  unit_price: number;
  currency_id?: string;
}

interface PreferencePayer {
  name?: string;
  email?: string;
  phone?: { number?: string };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeaders(CORS_HEADERS).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).setHeaders(CORS_HEADERS).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).setHeaders(CORS_HEADERS).json({ error: 'MP_ACCESS_TOKEN not configured' });
  }

  try {
    const { items, payer, external_reference, notification_url } = req.body as {
      items: PreferenceItem[];
      payer?: PreferencePayer;
      external_reference?: string;
      notification_url?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).setHeaders(CORS_HEADERS).json({ error: 'Items are required' });
    }

    const origin = req.headers.origin || `https://${req.headers.host}` || '';

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          currency_id: item.currency_id || 'ARS',
        })),
        payer: payer
          ? {
              name: payer.name,
              email: payer.email,
              phone: payer.phone,
            }
          : undefined,
        external_reference,
        notification_url,
        back_urls: {
          success: `${origin}/?mp_status=approved&mp_ref=${external_reference || ''}`,
          failure: `${origin}/?mp_status=failure&mp_ref=${external_reference || ''}`,
          pending: `${origin}/?mp_status=pending&mp_ref=${external_reference || ''}`,
        },
        auto_return: 'approved',
      },
    });

    return res.status(200).setHeaders(CORS_HEADERS).json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    console.error('MercadoPago preference creation failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).setHeaders(CORS_HEADERS).json({ error: message });
  }
}
