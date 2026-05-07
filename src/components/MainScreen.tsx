/**
 * @file MainScreen.tsx
 * @description Componente principal de presentación que define el encabezado
 * tipo "Hero" de la aplicación. Incluye una imagen de fondo y un separador
 * curvo animado que reacciona al scroll del usuario utilizando Framer Motion.
 */
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface MainScreenProps {
  children: ReactNode;
}

/**
 * Componente MainScreen.
 * 
 * ¿Por qué este enfoque? Se utiliza Framer Motion (`useScroll` y `useTransform`)
 * para crear un efecto parallax interactivo. A medida que el usuario hace scroll hacia abajo,
 * el separador curvo SVG (`curveScaleY`) se aplana sutilmente, proporcionando 
 * una transición suave y dinámica entre el hero de la página y el contenido principal.
 * 
 * @param {MainScreenProps} props - Propiedades que contienen los elementos hijos que irán debajo del hero.
 * @returns {JSX.Element} La estructura del hero visual con animaciones.
 */
export function MainScreen({ children }: MainScreenProps) {
  // Obtenemos el progreso actual del scroll vertical de la ventana.
  const { scrollY } = useScroll();
  
  // Mapeamos el valor del scroll [0px a 400px] para reducir la escala Y del SVG [1 a 0.5].
  // Esto aplana la curva suavemente a medida que la imagen de fondo sube, 
  // creando un fuerte impacto visual sin afectar el rendimiento.
  const curveScaleY = useTransform(scrollY, [0, 400], [1, 0.5]);

  return (
    <div className="relative w-full min-h-screen bg-brand-white">
      {/* Fondo fijo detrás del contenido para efecto parallax base */}
      {/* Fix: Se incrementaron los 'vh' y se aplicó scale-110 origin-top para garantizar un "sobreborde"
          que oculte cualquier franja blanca durante el scroll en diferentes dispositivos. */}
      <div className="fixed top-0 w-full h-[65vh] lg:h-[85vh] z-0 bg-cover bg-center bg-[url('/hero-new.jpg')] scale-110 origin-top" />
      
      <div className="relative z-10 w-full pt-[40vh] lg:pt-[55vh]">
        <motion.div 
          className="w-full h-48 md:h-72 lg:h-96 text-brand-green relative -mb-1 origin-bottom z-10"
          style={{ scaleY: curveScaleY }}
        >
          <svg
            viewBox="0 0 1440 320"
            className="w-full h-full"
            preserveAspectRatio="none"
            fill="currentColor"
          >
            {/* Curva SVG que divide el hero del contenido principal */}
            <path d="M0,0 Q720,240 1440,160 L1440,320 L0,320 Z"></path>
          </svg>
        </motion.div>
        
        {children}
      </div>
    </div>
  );
}
