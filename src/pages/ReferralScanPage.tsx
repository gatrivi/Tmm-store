import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReferralFlyer, recordReferralEvent } from '../services/referrals';

export default function ReferralScanPage() {
  const { flyerId = '' } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function resolve() {
      try {
        const flyer = await getReferralFlyer(flyerId);
        if (!flyer || flyer.status !== 'active') {
          if (!cancelled) setError('Este volante ya no está activo.');
          return;
        }
        try {
          await recordReferralEvent(flyer, 'scan');
        } catch {
          // Attribution should still work if analytics is temporarily unavailable.
        }
        if (cancelled) return;
        const params = new URLSearchParams({
          ref: flyer.referralCode,
          flyer: flyer.id,
          utm_source: 'referido',
          utm_medium: 'flyer',
          utm_campaign: flyer.campaign || 'volante',
        });
        navigate(`/?${params.toString()}`, { replace: true });
      } catch {
        if (!cancelled) setError('No pudimos abrir este volante.');
      }
    }
    void resolve();
    return () => { cancelled = true; };
  }, [flyerId, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] px-5 text-[#171717]">
      <div className="max-w-md rounded-[2rem] border border-black/10 bg-white p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 h-3 w-3 animate-pulse rounded-full bg-[#ff6b35]" />
        <h1 className="text-2xl font-black tracking-[-0.04em]">Abriendo Gatrivi.com</h1>
        <p className="mt-3 text-sm font-medium text-black/55">
          {error || 'Registrando el volante para medir qué lugares funcionan mejor…'}
        </p>
        {error && (
          <button
            type="button"
            onClick={() => navigate('/', { replace: true })}
            className="mt-6 rounded-full bg-black px-5 py-3 text-sm font-black text-white"
          >
            Ir al sitio
          </button>
        )}
      </div>
    </main>
  );
}
