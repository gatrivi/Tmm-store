/**
 * @file Layout.tsx
 * @description Componente de envoltura principal para las páginas.
 * Proporciona la estructura base y estilos generales (color de fondo, altura mínima,
 * y manejo del scroll horizontal) para asegurar consistencia en la vista.
 */
import { type ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Componente Layout que envuelve el contenido principal de la aplicación.
 * 
 * @param {LayoutProps} props - Propiedades del componente que incluyen los elementos hijos.
 * @returns {JSX.Element} Un contenedor div estilizado con los hijos dentro.
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="w-full min-h-dvh bg-surface relative overflow-x-hidden">
      {children}
    </div>
  );
}
