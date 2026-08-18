import { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { copyToClipboard } from '../utils/clipboard';

export default function PricingShareButton() {
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  if (location.pathname !== '/precios') return null;

  const handleShare = async () => {
    const url = `${window.location.origin}/precios`;
    const copiedOk = await copyToClipboard(url);

    if (copiedOk) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }

    if (!navigator.share) return;

    try {
      await navigator.share({
        title: 'Planes y precios — Gatrivi.com',
        text: 'Elegí cuánto necesitás. Sin abono mensual obligatorio.',
        url,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      // The URL is already on the clipboard, so a failed native share still has a useful fallback.
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="fixed bottom-20 right-4 z-[85] inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/15 bg-black px-4 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 md:bottom-20 md:right-5"
      aria-label="Compartir planes y precios"
      title="Copia el enlace y abre Compartir cuando el dispositivo lo permite"
    >
      {copied ? <Check size={16} /> : <Share2 size={16} />}
      {copied ? 'Link copiado' : 'Compartir'}
    </button>
  );
}
