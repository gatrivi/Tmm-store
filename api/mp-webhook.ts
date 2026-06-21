import type { VercelRequest, VercelResponse } from '@vercel/node';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

function getAdminDb() {
  const config = {
    apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  };
  if (!config.projectId) return null;
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  return getFirestore(app);
}

type MpWebhookBody = {
  type?: string;
  action?: string;
  data?: { id?: string | number; external_reference?: string; status?: string };
};

async function resolvePaymentDetails(body: MpWebhookBody): Promise<{
  orderId: string;
  paymentStatus: 'approved' | 'rejected' | 'pending';
  paymentId: string;
} | null> {
  const paymentId = String(body?.data?.id ?? '');
  let externalRef = String(body?.data?.external_reference ?? '').toUpperCase();
  let status = body?.data?.status;

  if ((!externalRef || !status) && paymentId && process.env.MP_ACCESS_TOKEN) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const paymentApi = new Payment(client);
    const payment = await paymentApi.get({ id: paymentId });
    externalRef = String(payment.external_reference ?? '').toUpperCase();
    status = payment.status;
  }

  if (!externalRef) return null;

  const paymentStatus =
    status === 'approved' ? 'approved' : status === 'rejected' || status === 'cancelled' ? 'rejected' : 'pending';

  return { orderId: externalRef, paymentStatus, paymentId };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const tenantId = (process.env.VITE_TENANT_ID || process.env.TENANT_ID || 'default') as string;

  try {
    const body = req.body as MpWebhookBody;
    const resolved = await resolvePaymentDetails(body);

    if (!resolved) {
      return res.status(200).json({ ok: true, skipped: 'no external_reference' });
    }

    const { orderId, paymentStatus, paymentId } = resolved;
    const db = getAdminDb();
    if (db) {
      const orderRef = doc(db, 'tenants', tenantId, 'orders', orderId);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        await updateDoc(orderRef, {
          paymentStatus,
          mpPaymentId: paymentId,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return res.status(200).json({ ok: true, orderId, paymentStatus });
  } catch (error) {
    console.error('MP webhook error:', error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    });
  }
}
