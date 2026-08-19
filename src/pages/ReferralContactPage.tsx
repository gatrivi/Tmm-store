import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getReferralFlyer, recordReferralEvent } from '../services/referrals';

function safeTarget(raw: string | null) {
  if (!raw) return '';
  if (raw.startsWith('https://wa.me/')) return raw;
  if (raw.startsWith('mailto:')) return raw;
  return '';
}

export default function ReferralContactPage() {
  const [params] = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function run() {
      const target = safeTarget(params.get('to'));
      const flyerId = params.get('flyer')?.trim() || '';
      if (!target) {
        setError('El destino de contacto no es válido.');
        return;
      }
      try {
        if (flyerId) {
          const flyer = await getReferralFlyer(flyerId);
          if (flyer) await recordReferralEvent(flyer, 'contact_click');
        }
      } catch {
        // Contact must remain available if analytics is down.
      }
      if (!cancelled) window.location.replace(target);
    }
    void run();
    return () => { cancelled = true; };
  }, [params]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f2eb] p-6 text-center text-[#171717]">
      <div className="max-w-sm rounded-[2rem] bg-white p-8 shadow-xl">
        <h1 className="text-xl font-black">Abriendo contacto…</h1>
        <p className="mt-3 text-sm font-bold text-black/45">{error || 'Un segundo.'}</p>
        {error && <Link className="mt-5 inline-block rounded-full bg-black px-5 py-3 text-sm font-black text-white" to="/">Volver</Link>}
      </div>
    </main>
  );
}
