import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { trackLanguageSelect } from '../utils/analyticsTracker';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  /** Selecciona idioma y registra el evento en analytics */
  const handleSelectLanguage = (lang: 'es' | 'en' | 'pt' | 'ru' | 'de') => {
    setLanguage(lang);
    trackLanguageSelect(lang);
  };

  useEffect(() => {
    // Si el usuario no seleccionó un idioma, el modal se muestra. Bloqueamos el scroll del body.
    if (language === null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup: restaurar el scroll al desmontar o cambiar de ruta
    return () => {
      document.body.style.overflow = '';
    };
  }, [language]);

  if (language !== null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 md:p-8 bg-brand-black/90 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.4 }}
        className="bg-brand-green w-full max-w-2xl rounded-xl md:rounded-2xl p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col items-center"
      >
        <img 
          src="/titulo-blanco.png" 
          alt="El Puestito del Tío" 
          className="w-72 md:w-96 lg:w-[450px] h-auto object-contain mb-4 md:mb-6"
        />

        <div className="flex flex-col md:flex-row w-full gap-4 md:gap-6">
          <button
            onClick={() => handleSelectLanguage('es')}
            className="flex-1 relative w-full py-5 md:py-6 flex items-center justify-center group overflow-hidden bg-white border-2 border-transparent hover:border-brand-green/30 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <span className="absolute left-6 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇦🇷</span>
            <span className="text-lg md:text-xl font-bold text-brand-green tracking-wide">Español</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('en')}
            className="flex-1 relative w-full py-5 md:py-6 flex items-center justify-center group overflow-hidden bg-white border-2 border-transparent hover:border-brand-green/30 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <span className="absolute left-6 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇺🇸</span>
            <span className="text-lg md:text-xl font-bold text-brand-green tracking-wide">English</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('pt')}
            className="flex-1 relative w-full py-5 md:py-6 flex items-center justify-center group overflow-hidden bg-white border-2 border-transparent hover:border-brand-green/30 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <span className="absolute left-6 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇧🇷</span>
            <span className="text-lg md:text-xl font-bold text-brand-green tracking-wide">Português</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('ru')}
            className="flex-1 relative w-full py-5 md:py-6 flex items-center justify-center group overflow-hidden bg-white border-2 border-transparent hover:border-brand-green/30 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <span className="absolute left-6 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇷🇺</span>
            <span className="text-lg md:text-xl font-bold text-brand-green tracking-wide">Русский</span>
          </button>

          <button
            onClick={() => handleSelectLanguage('de')}
            className="flex-1 relative w-full py-5 md:py-6 flex items-center justify-center group overflow-hidden bg-white border-2 border-transparent hover:border-brand-green/30 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:-translate-y-1 shadow-lg"
          >
            <span className="absolute left-6 text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">🇩🇪</span>
            <span className="text-lg md:text-xl font-bold text-brand-green tracking-wide">Deutsch</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
