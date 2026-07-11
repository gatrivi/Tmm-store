/**
 * @file MenuList.tsx
 * @description Componente contenedor principal para la visualización del menú.
 * Orquesta la renderización del logo principal, el menú simplificado (vista rápida),
 * el listado detallado de productos (MenuItemCard) y la sección final de salsas.
 * 
 * Consume los datos del menú desde MenuContext (estado reactivo) para que los
 * cambios del panel de administración se reflejen inmediatamente.
 */
import { MenuItemCard } from './MenuItemCard';
import { SimplifiedMenu } from './SimplifiedMenu';
import { useLanguage } from '../context/LanguageContext';
import { useMenu } from '../context/MenuContext';
import { translations } from '../i18n/translations';

/**
 * Componente principal que coordina la visualización de todos los elementos
 * del menú, incluyendo las tarjetas detalladas y la sección final de salsas.
 *
 * @returns {JSX.Element} Lista principal del menú y complementos adjuntos.
 */
export function MenuList() {
  const { language } = useLanguage();
  const { menuItems, siteSettings } = useMenu();
  const t = translations[language || 'es'].menuPage;
  
  return (
    <div className="relative z-20 px-0 lg:px-4 flex flex-col items-center bg-brand-green w-full">
      <img
        src={siteSettings.brandLogo || '/puestito.png'}
        alt={siteSettings.brandName || 'Título'}
        className="w-full md:w-[1200px] relative z-30 h-auto mx-auto mb-3 -mt-32 md:-mt-48 lg:-mt-64 px-4 object-contain"
      />

      {/* Banner "Abierto las 24hs" */}
      <div className="w-full text-center py-2 md:py-4 px-4 relative z-30 mb-16 md:mb-24 -mt-4 md:-mt-10 lg:-mt-14">
        <p className="text-brand-white text-xl md:text-3xl font-black uppercase tracking-widest font-['Poppins',sans-serif]">
          {t.open24}
        </p>
        <p className="text-brand-white/80 text-sm md:text-base font-medium mt-2 font-['Poppins',sans-serif]">
          {t.open24sub}
        </p>
      </div>

      <SimplifiedMenu />

      {/* Título unificado principal */}
      <div className="pt-8 pb-10 bg-transparent relative z-10 px-4 w-full">
        <h2 
          className="text-4xl md:text-6xl lg:text-7xl font-black text-brand-white text-center mb-6 font-['Poppins',sans-serif] tracking-tight leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: t.heroTitle }}
        />
        <div className="w-24 lg:w-32 h-1 lg:h-1.5 bg-brand-white/40 mx-auto rounded-full"></div>
      </div>
      
      <div className="w-full px-4 max-w-4xl lg:max-w-none xl:max-w-none 2xl:max-w-[1600px] mx-auto flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-24 md:gap-32 lg:gap-8 xl:gap-10 pb-20 md:pb-32 lg:pb-40 lg:px-8 xl:px-12">
        {/* Renderiza las tarjetas de menú detalladas, excluyendo temporalmente las bebidas */}
        {menuItems
          .filter((item) => item.id !== 'bebidas')
          .map((item) => (
            <MenuItemCard key={`card-${item.id}`} item={item} />
        ))}
      </div>

      {/* Sección final: Salsas Adicionales */}
      <div className="w-full bg-gray-50 py-16 md:py-24 border-t-2 border-dashed border-gray-200 mt-8 relative">
        <div className="max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-6 md:px-8">
          
          <div className="text-center mb-10 md:mb-12 px-4">
            <h3 className="text-3xl md:text-4xl font-black text-brand-black mb-4 flex items-center justify-center gap-3">
              {t.saucesTitle}
            </h3>
            <div className="w-20 h-1.5 bg-brand-green mx-auto rounded-full mb-6"></div>
          </div>

          <div className="relative w-full overflow-hidden mb-10 md:mb-12 lg:mb-16">
            <div className="flex lg:grid lg:grid-cols-3 overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none gap-4 md:gap-6 lg:gap-8 hide-scrollbar px-4 md:px-[5vw] lg:px-0 lg:max-w-6xl xl:max-w-7xl lg:mx-auto">
              {['1.jpg', '2.jpg', '3.jpg'].map((filename, index) => (
                <div 
                  key={index} 
                  className="relative min-w-[90vw] md:min-w-[600px] lg:min-w-0 lg:w-full aspect-4/3 md:aspect-video lg:aspect-4/3 rounded-2xl md:rounded-[32px] overflow-hidden snap-center lg:snap-align-none shrink-0 lg:shrink shadow-[0_15px_40px_rgba(0,0,0,0.15)] transition-transform duration-300 group hover:-translate-y-2"
                >
                  <img 
                    src={`/Fotos%20menu/salsas/${filename}`} 
                    alt={`Salsa casera ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="text-center px-6 md:px-12">
            <p className="text-base md:text-lg text-brand-gray font-medium max-w-2xl mx-auto leading-relaxed">
              {t.saucesDescPart1}
              <br className="hidden md:block"/>
              <strong className="text-brand-green mt-2 block">{t.saucesDescPart2}</strong>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
