import React, { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.origin : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'El Puestito del Tío',
          text: 'Mirá el menú de El Puestito del Tío',
          url,
        });
      } catch {
        // user cancelled
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-black text-gray-900">Compartir tienda</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-5">
          {/* QR Code */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
            <img
              src={qrUrl}
              alt="QR Code"
              className="w-48 h-48"
              loading="lazy"
            />
          </div>

          {/* URL + Copy */}
          <div className="w-full flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <span className="flex-1 text-sm text-gray-600 truncate">{url}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>

          {/* Native Share */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleShare}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition shadow-md"
            >
              Compartir enlace
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
