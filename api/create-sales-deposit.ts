import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const DEPOSIT_AMOUNT = 65000;
const PLAN_LABELS = {
  basic: 'Básico',
  standard: 'Estándar',
  premium: 'Premium',
} as const;

type PlanId = keyof typeof PLAN_LABELS;

function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && value in PLAN_LABELS;
}

function resolveSiteOrigin(req: VercelRequest): string {
  const configured = process.env.SALES_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const host = req.headers.host;
  if (host) return `https://${host}`;

  return 'https://tmm.gatrivi.com';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(503).json({ error: 'Mercado Pago no está configurado todavía.' });
  }

  const plan = req.body?.plan as unknown;
  if (!isPlanId(plan)) {
    return res.status(400).json({ error: 'Plan inválido.' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const origin = resolveSiteOrigin(req);
    const reference = `SALE-${plan.toUpperCase()}-${Date.now()}`;
    const planLabel = PLAN_LABELS[plan];

    const result = await preference.create({
      body: {
        items: [
          {
            id: `deposit-${plan}`,
            title: `Seña Gatrivi.com — Plan ${planLabel}`,
            description: 'Reserva de implementación. Se descuenta 100% del precio final.',
            quantity: 1,
            unit_price: DEPOSIT_AMOUNT,
            currency_id: 'ARS',
          },
        ],
        external_reference: reference,
        metadata: {
          kind: 'sales_deposit',
          plan,
          deposit_amount: DEPOSIT_AMOUNT,
        },
        back_urls: {
          success: `${origin}/reservar?plan=${plan}&deposit_status=approved&sale_ref=${reference}`,
          failure: `${origin}/reservar?plan=${plan}&deposit_status=failure&sale_ref=${reference}`,
          pending: `${origin}/reservar?plan=${plan}&deposit_status=pending&sale_ref=${reference}`,
        },
        notification_url: `${origin}/api/mp-webhook`,
        auto_return: 'approved',
      },
    });

    if (!result.init_point) {
      return res.status(502).json({ error: 'Mercado Pago no devolvió un link de pago.' });
    }

    return res.status(200).json({
      init_point: result.init_point,
      reference,
      amount: DEPOSIT_AMOUNT,
      plan,
    });
  } catch (error) {
    console.error('Sales deposit preference failed:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'No se pudo iniciar el pago.',
    });
  }
}
