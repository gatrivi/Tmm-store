/**
 * @file SimplifiedMenu.tsx
 * @description Componente de menú en formato de lista simplificada ("vista rápida").
 * Muestra todos los productos y sus precios de forma compacta para una lectura veloz,
 * e incluye enlaces que hacen un scroll suave hacia la tarjeta detallada (MenuItemCard) 
 * de cada producto.
 *
 * Consume datos del menú y extras desde MenuContext (estado reactivo) para que los
 * cambios del panel de administración se reflejen inmediatamente.
 */
import { useCallback } from 'react';
import { useMenu } from '../context/MenuContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

/**
 * Función auxiliar para obtener el emoji representativo de un ítem
 * basándose en su identificador único.
 * 
 * @param {string} id - Identificador del producto.
 * @returns {string} Emoji correspondiente al tipo de comida.
 */
const getEmoji = (id: string): string => {
  if (id === 'bebidas') return '🥤';
  if (id === 'bondiola-popito') return '🥪';
  if (id.includes('choripan')) return '🌭';
  if (id.includes('hamburguesa')) return '🍔';
  if (id.includes('bondiola')) return '🐖';
  if (id.includes('bife')) return '🥩';
  if (id.includes('veggie')) return '🌱';
  if (id.includes('papas')) return '🍟';
  return '🍽️';
};

/**
 * Componente funcional que renderiza una lista de precios compacta.
 * Es ideal para usuarios que ya conocen el menú o quieren ver todos los 
 * precios base de un solo vistazo.
 *
 * @returns {JSX.Element} Bloque de lista de precios rápidos.
 */
export function SimplifiedMenu() {
  /**
   * Manejador de evento para el scroll suave hacia un producto específico.
   * Evita el comportamiento por defecto del enlace <a>.
   */
  const scrollToItem = useCallback((id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const { language } = useLanguage();
  const { menuItems, extrasData } = useMenu();
  const t = translations[language || 'es'].simplifiedMenu;

  return (
    <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto px-0 md:px-6 mb-16 z-30 relative scroll-mt-6" id="menu-rapido">
      <div className="bg-brand-white rounded-none md:rounded-xl lg:rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden">
        
        <div className="pt-8 pb-6 px-4 lg:pt-10">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-black text-center mb-3 font-['Poppins',sans-serif] tracking-tight">
            {t.title}
          </h2>
          <div className="w-16 h-1.5 bg-brand-green mx-auto rounded-full"></div>
        </div>

        <div className="px-4 pb-8">
          <div className="mx-auto max-w-3xl bg-brand-green/10 rounded-2xl p-5 md:px-7 md:py-5 border border-brand-green/30 border-l-4 border-l-brand-green shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">ℹ️</span>
              <h3 className="text-base md:text-lg font-black text-brand-black">{t.comboTitle}</h3>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="text-base md:text-lg text-brand-gray font-medium leading-relaxed flex items-start">
                <span className="inline-flex shrink-0 w-2 h-2 bg-brand-green rounded-full mt-2 mr-2.5"></span>
                <span><strong className="text-brand-green font-black text-lg mr-1">{language === 'de' ? 'Komplett:' : language === 'ru' ? 'Полный:' : language === 'en' ? 'Full:' : 'Completo:'}</strong> {t.completoDesc}</span>
              </div>
              
              <div className="w-full h-px bg-brand-green/20"></div>
              
              <div className="text-base md:text-lg text-brand-gray font-medium leading-relaxed flex items-start">
                <span className="inline-flex shrink-0 w-2 h-2 bg-brand-green rounded-full mt-2 mr-2.5"></span>
                <span><strong className="text-brand-green font-black text-lg mr-1">{language === 'de' ? 'Menü:' : language === 'ru' ? 'Комбо:' : 'Combo:'}</strong> {t.comboDesc}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-dashed border-gray-300">
          {menuItems.map((item, index) => (
            <div 
              key={`simple-${item.id}`} 
              className={`group flex flex-col justify-between p-5 md:p-6 transition-all duration-300 relative border-b border-dashed border-gray-300 ${
                index % 3 !== 2 ? 'lg:border-r lg:border-dashed lg:border-gray-300' : ''
              } ${
                index % 2 !== 1 ? 'md:border-r md:border-dashed md:border-gray-300 lg:border-r-0 lg:border-gray-300' : ''
              } hover:bg-gray-50`}
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl" aria-hidden="true">{getEmoji(item.id)}</span>
                  <h4 className="text-xl font-black text-brand-black leading-none">{language === 'de' && item.nameDe ? item.nameDe : language === 'ru' && item.nameRu ? item.nameRu : language === 'en' && item.nameEn ? item.nameEn : language === 'pt' && item.namePt ? item.namePt : item.name}</h4>
                </div>
                
                <div className="flex flex-col gap-2 mb-5">
                  {item.options.map((option) => (
                    <div key={option.id} className="flex justify-between items-end text-sm md:text-base">
                      <span className="text-brand-gray font-semibold tracking-tight">{language === 'de' && option.labelDe ? option.labelDe : language === 'ru' && option.labelRu ? option.labelRu : language === 'en' && option.labelEn ? option.labelEn : language === 'pt' && option.labelPt ? option.labelPt : option.label}</span>
                      <div className="grow border-b border-dotted border-gray-400 mx-2 opacity-50 mb-1.5"></div>
                      <span className="text-brand-green font-black leading-none">${option.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {item.id !== 'bebidas' && (
                <a 
                  href={`#item-${item.id}`}
                  onClick={(e) => scrollToItem(`item-${item.id}`, e)}
                  className="inline-flex w-max self-end items-center gap-1.5 text-gray-500 font-bold text-xs uppercase tracking-wider py-1.5 px-3 rounded-full hover:bg-brand-black hover:text-brand-white transition-colors"
                  title={`${t.viewMore} ${language === 'de' && item.nameDe ? item.nameDe : language === 'ru' && item.nameRu ? item.nameRu : language === 'en' && item.nameEn ? item.nameEn : language === 'pt' && item.namePt ? item.namePt : item.name}`}
                >
                  <span>{t.viewMore}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              )}
            </div>
          ))}

          {/* Sección Extras — datos reactivos desde MenuContext */}
          <div 
            className="group flex flex-col justify-between p-5 md:p-6 transition-all duration-300 relative border-b border-dashed border-gray-300 lg:border-r lg:border-dashed lg:border-gray-300 hover:bg-gray-50"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl" aria-hidden="true">🍳</span>
                <h4 className="text-xl font-black text-brand-black leading-none">{t.extrasTitle}</h4>
              </div>
              
              <div className="flex flex-col gap-2 mb-5">
                {extrasData.map((option, idx) => (
                  <div key={`extra-${idx}`} className="flex justify-between items-end text-sm md:text-base">
                    <span className="text-brand-gray font-semibold tracking-tight">
                      {language === 'de' && option.labelDe ? option.labelDe : language === 'ru' && option.labelRu ? option.labelRu : language === 'en' && option.labelEn ? option.labelEn : language === 'pt' && option.labelPt ? option.labelPt : option.label}
                      {option.suffix && language === 'es' && <span className="text-brand-green font-black ml-1.5">({option.suffix})</span>}
                      {option.suffixEn && language === 'en' && <span className="text-brand-green font-black ml-1.5">({option.suffixEn})</span>}
                      {option.suffixPt && language === 'pt' && <span className="text-brand-green font-black ml-1.5">({option.suffixPt})</span>}
                      {option.suffixRu && language === 'ru' && <span className="text-brand-green font-black ml-1.5">({option.suffixRu})</span>}
                      {option.suffixDe && language === 'de' && <span className="text-brand-green font-black ml-1.5">({option.suffixDe})</span>}
                    </span>
                    <div className="grow border-b border-dotted border-gray-400 mx-2 opacity-50 mb-1.5"></div>
                    <span className="text-brand-green font-black leading-none">${option.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
