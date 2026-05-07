import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MenuItemType } from '../data/menu';
import { resolveImagesForProduct } from '../utils/imageLoader';
import useEmblaCarousel from 'embla-carousel-react';
import { useLanguage } from '../context/LanguageContext';
import { useMenu } from '../context/MenuContext';
import { translations } from '../i18n/translations';
import { arsToUsd } from '../utils/dollarRate';

/**
 * Función auxiliar para obtener el emoji representativo de un ítem
 * basándose en su identificador único.
 * 
 * @param {string} id - Identificador del producto.
 * @returns {string} Emoji correspondiente al tipo de comida.
 */
const getEmoji = (id: string): string => {
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
 * @file MenuItemCard.tsx
 * @description Componente de tarjeta (card) que muestra la información detallada
 * de un producto del menú. Incluye un carrusel de imágenes y un selector de 
 * variaciones (tamaños/opciones) del producto.
 */

interface MenuItemCardProps {
  item: MenuItemType;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  // Estado para la opción seleccionada actualmente y el índice del carrusel de imágenes
  const [activeTabId, setActiveTabId] = useState<string>(item.options[0].id);
  const [activeIndex, setActiveIndex] = useState(0);

  const { language } = useLanguage();
  const { siteSettings, usdRate } = useMenu();
  const t = translations[language || 'es'].card;
  const [showUsd, setShowUsd] = useState(false);

  // Derivamos la información clave de la opción actualmente seleccionada
  const activeOption = item.options.find(opt => opt.id === activeTabId) || item.options[0];
  const price = activeOption.price;
  
  // Resolvemos description y tab suffix bi-lingüalmente
  const itemName = language === 'de' && item.nameDe ? item.nameDe : language === 'ru' && item.nameRu ? item.nameRu : language === 'en' && item.nameEn ? item.nameEn : language === 'pt' && item.namePt ? item.namePt : item.name;
  const itemDescription = language === 'de' && item.descriptionDe ? item.descriptionDe : language === 'ru' && item.descriptionRu ? item.descriptionRu : language === 'en' && item.descriptionEn ? item.descriptionEn : language === 'pt' && item.descriptionPt ? item.descriptionPt : item.description;
  const tabDescription = language === 'de' && activeOption.suffixDe ? activeOption.suffixDe : language === 'ru' && activeOption.suffixRu ? activeOption.suffixRu : language === 'en' && activeOption.suffixEn ? activeOption.suffixEn : language === 'pt' && activeOption.suffixPt ? activeOption.suffixPt : activeOption.suffix;
  const activeFeatures = language === 'de' && activeOption.featuresDe ? activeOption.featuresDe : language === 'ru' && activeOption.featuresRu ? activeOption.featuresRu : language === 'en' && activeOption.featuresEn ? activeOption.featuresEn : language === 'pt' && activeOption.featuresPt ? activeOption.featuresPt : activeOption.features;
  
  const numTabs = item.options.length;
  const activeTabIndex = item.options.findIndex(opt => opt.id === activeOption.id);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    const rafId = requestAnimationFrame(() => onSelect());
    
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => cancelAnimationFrame(rafId);
  }, [emblaApi, onSelect]);

  const sliderImages = resolveImagesForProduct(item);

  const showPager = sliderImages.length > 1;
  const numDots = Math.min(sliderImages.length, 3);
  const activeDotIndex = activeIndex % numDots;

  return (
    <div 
      id={`item-${item.id}`} 
      className="bg-brand-white rounded-xl md:rounded-2xl lg:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col scroll-mt-24 md:scroll-mt-32 overflow-hidden group hover:shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-shadow duration-300 h-full"
    >
      <div className="relative w-full aspect-4/3 bg-brand-black shrink-0">
        
        <div className="overflow-hidden w-full h-full" ref={emblaRef}>
          <div className="flex h-full">
            {sliderImages.map((img, idx) => {
              const posData = item.imagePositions?.[img];
              let objPos = 'center';
              let scale = 1;
              let transformOrigin = 'center';

              if (posData) {
                if (posData.startsWith('{')) {
                  try {
                    const parsed = JSON.parse(posData);
                    objPos = `${parsed.x}% ${parsed.y}%`;
                    scale = parsed.z;
                    transformOrigin = `${parsed.x}% ${parsed.y}%`;
                  } catch { /* ignore */ }
                } else {
                  objPos = posData;
                  transformOrigin = posData;
                }
              }

              return (
                <div key={idx} className="flex-[0_0_100%] min-w-0 h-full relative cursor-grab active:cursor-grabbing overflow-hidden">
                  <img 
                    src={img} 
                    alt={`${item.name} image ${idx + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ // NOSONAR
                      objectPosition: objPos,
                      transformOrigin: transformOrigin,
                      transform: scale > 1 ? `scale(${scale})` : 'none'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {showPager && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 z-10 px-3 py-1.5 bg-brand-black/40 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
            {Array.from({ length: numDots }).map((_, idx) => {
              const isActive = activeDotIndex === idx;
              return (
                <motion.div
                  key={idx}
                  layout
                  initial={false}
                  animate={{
                    width: isActive ? 20 : 8,
                    backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.4)",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="h-2 md:h-2.5 rounded-full"
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="p-6 md:p-8 lg:p-6 xl:p-8 flex flex-col flex-1">
        <h3 className="text-3xl md:text-4xl lg:text-2xl xl:text-3xl font-black text-brand-black mb-6 lg:mb-4 flex items-center gap-3">
          <span>{getEmoji(item.id)}</span>
          {itemName}
        </h3>

        <div className="flex bg-gray-100 rounded-full p-1.5 relative items-center mb-6 lg:mb-4 shadow-inner">
          {item.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setActiveTabId(option.id)}
              className={`flex-1 text-center py-2.5 lg:py-1.5 xl:py-2 text-sm md:text-base lg:text-xs xl:text-sm font-bold relative z-10 transition-colors duration-300 ${
                activeOption.id === option.id ? 'text-brand-green' : 'text-brand-gray'
              }`}
            >
              {language === 'de' && option.labelDe ? option.labelDe : language === 'ru' && option.labelRu ? option.labelRu : language === 'en' && option.labelEn ? option.labelEn : language === 'pt' && option.labelPt ? option.labelPt : option.label}
            </button>
          ))}
          
          <motion.div
            layoutId={`pill-${item.id}`}
            className="absolute top-1.5 bottom-1.5 bg-brand-white rounded-full shadow-md z-0"
            animate={{
              width: `calc((100% - 12px) / ${numTabs})`,
              left: `calc(6px + ${activeTabIndex} * ((100% - 12px) / ${numTabs}))`
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <div className="flex-none h-[220px] lg:h-[180px] xl:h-[200px] overflow-hidden mt-0 mb-6 lg:mb-4 flex flex-col pt-2">
          
          <div className="flex-1 overflow-y-auto mb-2 pr-2 hide-scrollbar">
            <p className="text-base md:text-lg lg:text-sm xl:text-base text-brand-gray leading-relaxed font-medium">
              {itemDescription}
              <span className="font-bold text-brand-green">{tabDescription ? ` ${tabDescription}` : ''}</span>
            </p>
          </div>

          <div className="h-[80px] min-h-[80px] w-full border-t border-dashed border-gray-200 pt-3 flex items-start flex-wrap gap-2 content-start">
             {activeFeatures && activeFeatures.length > 0 ? (
                activeFeatures.map((feat, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center text-xs md:text-sm font-black bg-brand-green text-brand-white px-3 py-1.5 rounded-lg shadow-sm tracking-wide"
                  >
                    <svg className="w-3.5 h-3.5 mr-1.5 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {feat}
                  </span>
                ))
             ) : (
                <span className="text-sm font-bold text-gray-400 italic py-1.5">{t.noExtras}</span>
             )}
          </div>
        </div>

        <div className="mt-auto flex flex-col border-t-2 border-dashed border-gray-200 pt-6 lg:pt-5 xl:pt-6 gap-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0">
            <span className="text-sm md:text-base lg:text-xs xl:text-sm font-bold text-gray-400 uppercase tracking-widest">{t.finalPrice}</span>
            <AnimatePresence mode="wait">
              {showUsd && siteSettings.showUsdToggle ? (
                <motion.span
                  key="usd"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-3xl xl:text-4xl font-black text-brand-black"
                >
                  US${arsToUsd(price, usdRate)}
                </motion.span>
              ) : (
                <motion.span
                  key="ars"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-4xl md:text-5xl lg:text-3xl xl:text-4xl font-black text-brand-black"
                >
                  ${price.toLocaleString()}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          {siteSettings.showUsdToggle && (
            <button
              onClick={() => setShowUsd(prev => !prev)}
              className={`self-end flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all border shadow-sm active:scale-95 ${
                showUsd
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-500'
                  : 'bg-brand-green/10 border-brand-green/30 text-brand-green'
              }`}
            >
              {showUsd ? '🇺🇸 USD' : '🇦🇷 ARS'}
              <span className="opacity-50">→</span>
              {showUsd ? '🇦🇷 ARS' : '🇺🇸 USD'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
