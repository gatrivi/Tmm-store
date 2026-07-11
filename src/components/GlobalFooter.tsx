/**
 * @file GlobalFooter.tsx
 * @description Componente de pie de página (footer) de la aplicación.
 * Contiene información de contacto, ubicación, horarios y enlaces a redes
 * sociales. Este componente se renderiza en la parte inferior de todas las páginas.
 *
 * También contiene la lógica del botón secreto (separador decorativo) que,
 * mediante un patrón de clicks específico, abre el modal de login del
 * panel de administración.
 */
import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock } from 'lucide-react';

/** Icono Instagram inline (lucide-react no incluye logos de marca en algunas versiones) */
const InstagramIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
import { useLanguage } from '../context/LanguageContext';
import { usePlan } from '../context/PlanContext';
import { AppVersionBadge } from './AppVersionBadge';
import { useAdmin } from '../context/AdminContext';
import { resolveAdminPath } from '../utils/adminPath';
import { translations } from '../i18n/translations';

interface GlobalFooterProps {
  brandName?: string;
  brandLogo?: string;
  address?: string;
  instagram?: string;
  googleMaps?: string;
  hoursSummary?: string;
}

/**
 * Renderiza el pie de página global asegurando que la información de la marca, 
 * dirección y redes sociales se muestre consistentemente en toda la app.
 *
 * @returns {JSX.Element} Elemento que representa el pie de página.
 */
export function GlobalFooter({ brandName, brandLogo, address, instagram, googleMaps, hoursSummary }: GlobalFooterProps) {
  const { language } = useLanguage();
  const { tenantId } = usePlan();
  const { triggerLogin } = useAdmin();
  const t = translations[language || 'es'].menuPage;
  const displayName = brandName || 'Tu Negocio';
  const displayAddress = address || '';
  const displayInstagram = instagram || '';
  const displayMaps = googleMaps || '';
  const lang = language || 'es';
  const rightsSuffix: Record<string, string> = {
    es: 'Todos los derechos reservados.',
    en: 'All rights reserved.',
    pt: 'Todos os direitos reservados.',
    ru: 'Все права защищены.',
    de: 'Alle Rechte vorbehalten.',
  };

  // ---- Lógica del patrón secreto ----
  // Usamos useRef para evitar re-renders innecesarios al trackear clicks.
  const clickTimestamps = useRef<number[]>([]);
  const fifthClickTime = useRef<number>(0);
  const patternPhase = useRef<'clicking' | 'waiting'>('clicking');

  /**
   * Manejador de click para el separador secreto.
   * Patrón: 5 clicks rápidos (≤1s entre cada uno) → espera ≥5s → 6º click → abre login.
   */
  const handleSecretClick = useCallback(() => {
    const now = Date.now();

    if (patternPhase.current === 'clicking') {
      const timestamps = clickTimestamps.current;

      // Si hay clicks previos, verificar que el intervalo sea ≤1000ms
      if (timestamps.length > 0) {
        const lastClick = timestamps[timestamps.length - 1];
        if (now - lastClick > 1000) {
          // Timeout: reiniciar patrón
          clickTimestamps.current = [now];
          return;
        }
      }

      timestamps.push(now);

      // Si llegamos a 5 clicks, pasar a fase de espera
      if (timestamps.length >= 5) {
        fifthClickTime.current = now;
        patternPhase.current = 'waiting';
        clickTimestamps.current = [];
      }
    } else if (patternPhase.current === 'waiting') {
      const elapsed = now - fifthClickTime.current;

      if (elapsed >= 5000 && elapsed <= 30000) {
        // Patrón completado exitosamente
        patternPhase.current = 'clicking';
        fifthClickTime.current = 0;
        triggerLogin();
      } else {
        // Muy pronto (<5s) o muy tarde (>30s): reiniciar
        patternPhase.current = 'clicking';
        fifthClickTime.current = 0;
        clickTimestamps.current = [];
      }
    }
  }, [triggerLogin]);

  return (
    <div className="relative block z-30 w-full bg-brand-black text-brand-white py-16 lg:py-24 px-6 mt-0">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12 items-start text-left">
        
        <div className="flex flex-col items-center md:items-start md:justify-center h-full gap-4">
          {/* Separador secreto — funciona como botón invisible */}
          <div
            className="w-16 h-1 bg-brand-white/30 rounded-full mb-1"
            onClick={handleSecretClick}
            role="presentation"
          />
          <div className="flex flex-col items-center md:items-start w-full">
            <img
              src={brandLogo || '/puestito.png'}
              alt={displayName}
              className="h-auto max-h-24 w-auto max-w-[220px] object-contain md:-mt-2"
            />
            <div className="w-full max-w-[200px] h-px bg-brand-white/10 md:hidden mt-4 mx-auto rounded-full" />
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 lg:gap-4">
          <h4 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">{t.footerFindUs}</h4>
          {displayAddress && (
            displayMaps ? (
              <a 
                href={displayMaps}
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-start gap-3 group hover:text-brand-green transition-colors"
                title="Abrir en Google Maps"
              >
                <MapPin size={20} className="shrink-0 mt-0.5 text-brand-green group-hover:text-brand-white transition-colors lg:w-6 lg:h-6" />
                <span 
                  className="text-sm lg:text-base font-medium text-gray-300 group-hover:text-brand-green transition-colors leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: displayAddress.replace(/\n/g, '<br/>') }}
                />
              </a>
            ) : (
              <div className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-0.5 text-brand-green lg:w-6 lg:h-6" />
                <span 
                  className="text-sm lg:text-base font-medium text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: displayAddress.replace(/\n/g, '<br/>') }}
                />
              </div>
            )
          )}
          <div className="flex items-center gap-3 mt-2 lg:mt-3">
            <Clock size={20} className="shrink-0 text-brand-green lg:w-6 lg:h-6" />
            <span className="text-sm lg:text-base font-medium text-gray-300">
              {hoursSummary || t.footerHours}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 lg:gap-5">
          <h4 className="text-lg lg:text-xl font-bold mb-1 lg:mb-2">{t.footerFollowUs}</h4>
          {displayInstagram && (
            <a 
              href={`https://www.instagram.com/${displayInstagram}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 hover:text-brand-green transition-colors"
              aria-label={`Instagram de ${displayName}`}
            >
              <div className="p-2.5 lg:p-3 rounded-full bg-brand-white/10 group-hover:bg-brand-green group-hover:text-brand-black transition-colors">
                <InstagramIcon size={20} className="lg:w-6 lg:h-6" />
              </div>
              <span className="text-sm lg:text-base font-medium text-gray-300 group-hover:text-brand-green transition-colors">@{displayInstagram}</span>
            </a>
          )}
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-brand-white/10 flex flex-col items-center gap-2">
        <div className="text-xs font-medium text-gray-400">
          © {displayName}. {rightsSuffix[lang] || rightsSuffix.es}
        </div>
        <div className="flex items-center gap-3">
          <Link
            to={resolveAdminPath(tenantId)}
            className="text-[10px] text-gray-600 hover:text-gray-400 transition"
          >
            Administrar
          </Link>
          <AppVersionBadge className="text-brand-green/40" />
        </div>
      </div>
    </div>
  );
}
