import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import {
  buildFlyerQrDataUrl,
  getReferralFlyer,
  getReferralPlacement,
  watchReferralAuth,
  type ReferralFlyer,
  type ReferralPlacement,
} from '../services/referrals';
import { getDemoPriceLabel } from '../utils/demoIntake';

export default function ReferralFlyerPage() {
  const { flyerId = '' } = useParams();
  const [flyer, setFlyer] = useState<ReferralFlyer | null>(null);
  const [placement, setPlacement] = useState<ReferralPlacement | null>(null);
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const price = getDemoPriceLabel();

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = watchReferralAuth(async (user) => {
      if (!user) return;
      try {
        const nextFlyer = await getReferralFlyer(flyerId);
        if (!nextFlyer || nextFlyer.ownerUid !== user.uid) {
          if (!cancelled) setError('No encontramos este volante en tu cuenta.');
          return;
        }
        const [nextPlacement, dataUrl] = await Promise.all([
          getReferralPlacement(flyerId),
          buildFlyerQrDataUrl(flyerId),
        ]);
        if (!cancelled) {
          setFlyer(nextFlyer);
          setPlacement(nextPlacement);
          setQr(dataUrl);
        }
      } catch {
        if (!cancelled) setError('No pudimos preparar el volante.');
      }
    });
    return () => { cancelled = true; unsubscribe(); };
  }, [flyerId]);

  useEffect(() => {
    document.title = flyer ? `${flyer.id} — volante Gatrivi` : 'Volante referido — Gatrivi';
  }, [flyer]);

  return (
    <main className="min-h-screen bg-[#dedbd4] px-4 py-8 text-[#333] print:bg-white print:p-0">
      <style>{`@page{size:A6 portrait;margin:0}@media print{.no-print{display:none!important}.flyer-sheet{box-shadow:none!important;margin:0!important;width:105mm!important;height:148mm!important;border-radius:0!important}}`}</style>
      <div className="no-print mx-auto mb-5 flex max-w-[105mm] items-center justify-between gap-3 text-xs font-black">
        <Link to="/referidos">← Panel</Link>
        <button type="button" onClick={() => window.print()} disabled={!flyer || !qr} className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-white disabled:opacity-40"><Printer size={14} /> Imprimir A6</button>
      </div>

      {error ? (
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-sm font-bold text-red-700">{error}</div>
      ) : (
        <article className="flyer-sheet relative mx-auto flex aspect-[105/148] w-full max-w-[105mm] flex-col overflow-hidden rounded-sm bg-white p-[8mm] shadow-2xl">
          <div className="flex items-center justify-between border-b border-black/15 pb-3 text-[8pt] font-black tracking-[0.16em] text-black/55">
            <span>GATRIVI.COM</span>
            <span>SOLUCIONES WEB</span>
          </div>

          <div className="mt-[8mm]">
            <p className="text-[8pt] font-black uppercase tracking-[0.15em] text-black/50">Tu negocio online</p>
            <h1 className="mt-2 text-[25pt] font-black leading-[0.9] tracking-[-0.06em] text-[#3d3d3d]">Catálogo.<br />Pedidos.<br />Ventas.</h1>
            <p className="mt-4 max-w-[72mm] text-[9.5pt] font-semibold leading-relaxed text-black/65">
              Una web simple para mostrar productos, recibir pedidos y compartir por WhatsApp e Instagram.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-[1fr_31mm] items-end gap-4">
            <div>
              <p className="text-[7.5pt] font-black uppercase tracking-[0.13em] text-black/45">Implementación promo</p>
              <p className="mt-1 text-[20pt] font-black tracking-[-0.04em] text-[#454545]">{price}</p>
              <p className="mt-2 text-[8pt] font-bold leading-relaxed text-black/55">Carga inicial incluida · sin comisión sobre tus ventas.</p>
            </div>
            <div className="text-center">
              {qr ? <img src={qr} alt="QR único del volante" className="mx-auto h-[31mm] w-[31mm]" /> : <div className="h-[31mm] w-[31mm] animate-pulse bg-black/5" />}
              <p className="mt-1 text-[7pt] font-black">ESCANEÁ Y MIRÁ</p>
            </div>
          </div>

          <div className="mt-auto border-t border-black/15 pt-3 text-[6.5pt] font-bold text-black/45">
            <div className="flex justify-between gap-3"><span>{flyer?.id || flyerId}</span><span>{flyer?.referralCode || ''}</span></div>
          </div>
        </article>
      )}

      {placement && <p className="no-print mx-auto mt-4 max-w-[105mm] text-xs font-bold text-black/50">Ubicación registrada: {placement.label}{placement.note ? ` · ${placement.note}` : ''}</p>}
    </main>
  );
}
