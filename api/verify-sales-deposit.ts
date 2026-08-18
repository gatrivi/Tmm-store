import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const DEPOSIT_AMOUNT = 65000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(503).json({ error: 'Mercado Pago no está configurado todavía.' });
  }

  const rawPaymentId = req.query.payment_id;
  const paymentId = Array.isArray(rawPaymentId) ? rawPaymentId[0] : rawPaymentId;
  if (!paymentId || !/^\d+$/.test(paymentId)) {
    return res.status(400).json({ error: 'payment_id inválido.' });
  }

  try {
    const client = new MercadoPagoConfig({ accessToken });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: paymentId });

    const reference = String(payment.external_reference ?? '');
    const amount = Number(payment.transaction_amount ?? 0);
    const currency = String(payment.currency_id ?? '');
    const belongsToSalesDeposit = reference.startsWith('SALE-');
    const amountMatches = amount === DEPOSIT_AMOUNT && currency === 'ARS';
    const approved = payment.status === 'approved' && belongsToSalesDeposit && amountMatches;

    return res.status(200).json({
      verified: approved,
      status: payment.status ?? 'unknown',
      reference,
      amount,
      currency,
    });
  } catch (error) {
    console.error('Sales deposit verification failed:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'No se pudo verificar el pago.',
    });
  }
}
