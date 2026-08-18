import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { Link, useLocation } from 'react-router-dom';
import {
  buildShortDemoUrl,
  getDemoShortLinkForPath,
} from '../config/demoShortLinks';
import { copyToClipboard } from '../utils/clipboard';

export default function DemoShareFooter() {
  const location = useLocation();
  const demo = useMemo(
    () => getDemoShortLinkForPath(location.pathname),
    [location.pathname],
  );
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const demoUrl = demo ? buildShortDemoUrl(demo) : '';

  useEffect(() => {
    let cancelled = false;
    setQrDataUrl('');
    setCopied(false);
    if (!demo || !demoUrl) return () => { cancelled = true; };

    QRCode.toDataURL(demoUrl, {
      width: 256,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#171814', light: '#ffffff' },
    })
      .then(value => {
        if (!cancelled) setQrDataUrl(value);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });

    return () => { cancelled = true; };
  }, [demo, demoUrl]);

  if (!demo) return null;

  const handleCopy = async () => {
    const ok = await copyToClipboard(demoUrl);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="border-t border-black/10 bg-[#f4f0e7] px-4 py-12 text-[#171814] sm:px-6 sm:py-16">
      <div className="mx-auto grid max-w-5xl gap-8 rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,.08)] sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-white">
            <QrCode size={14} /> Pasala al celular
          </div>
          <h2 className="mt-4 max-w-xl text-3xl font-black leading-[0.95] tracking-[-0.045em] sm:text-4xl">
            Esta demo tiene una dirección fácil de recordar.
          </h2>
          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-black/55 sm:text-base">
            Escaneá el QR o copiá el enlace. Abre siempre esta muestra de {demo.label.toLowerCase()}.
          </p>

          <div className="mt-6 flex max-w-2xl flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCopy}
              className="flex min-h-12 flex-1 items-center justify-between gap-3 rounded-2xl border border-black/10 bg-[#f4f0e7] px-4 text-left text-sm font-black transition hover:border-black/25"
              aria-label={`Copiar ${demoUrl}`}
            >
              <span className="min-w-0 truncate">{demoUrl.replace('https://', '')}</span>
              {copied ? <Check size={18} className="shrink-0" /> : <Copy size={18} className="shrink-0" />}
            </button>
            <Link
              to="/demos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#171814] px-5 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Más demos <ExternalLink size={16} />
            </Link>
          </div>
          {copied && <p className="mt-2 text-xs font-black text-black/55">URL copiada.</p>}
        </div>

        <a
          href={demoUrl}
          className="mx-auto block rounded-[1.6rem] border border-black/10 bg-white p-3 transition hover:-translate-y-1 hover:shadow-lg md:mx-0"
          aria-label={`Abrir ${demoUrl}`}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR para ${demoUrl}`}
              width={220}
              height={220}
              className="h-[190px] w-[190px] sm:h-[220px] sm:w-[220px]"
            />
          ) : (
            <div className="flex h-[190px] w-[190px] items-center justify-center bg-black/[0.03] sm:h-[220px] sm:w-[220px]">
              <QrCode size={48} className="text-black/25" />
            </div>
          )}
        </a>
      </div>
    </footer>
  );
}
