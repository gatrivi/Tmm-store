/**
 * @file imageLoader.ts
 * @description Utilidad para la carga dinámica de imágenes de productos.
 * Las imágenes se encuentran en el directorio public/Fotos menu/ y se
 * sirven como static assets por Vite. Se construyen las URLs directamente
 * ya que import.meta.glob no puede importar archivos de /public.
 */
import type { MenuItemType } from '../data/menu';

/**
 * Diccionario de mapeo entre el ID técnico del producto y el nombre de la 
 * carpeta física donde residen sus imágenes.
 */
const idToFolderMap: Record<string, string> = {
  'choripan': 'choripan',
  'hamburguesa': 'hamburguesa',
  'bondiola': 'bondiola',
  'ojo-bife': 'ojo de bife',
  'bondiola-popito': 'popito',
  'hamburguesa-veggie': 'hamburguesa vegana',
  'milanesa-veggie': 'milanesa vegana',
  'papas': 'papas'
};

/**
 * Mapa de archivos de imagen por carpeta.
 * Se listan explícitamente ya que los archivos de /public no pueden
 * ser escaneados dinámicamente con import.meta.glob en Vite.
 * 
 * Convención: los archivos se nombran numéricamente (1.jpg, 2.JPG, etc.)
 */
const imageManifest: Record<string, string[]> = {
  'choripan': ['1.JPG', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg'],
  'hamburguesa': ['1.JPG', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.JPG'],
  'bondiola': ['3.jpg', '4.JPG', '5.JPG', '6.JPG', '7.jpg', '8.jpg'],
  'ojo de bife': ['1.JPG', '2.JPG', '3.JPG', '4.JPG', '5.JPG', '6.JPG'],
  'popito': ['1.JPG', '2.jpg', '3.jpg', '4.JPG', '5.JPG'],
  'hamburguesa vegana': ['1.JPG', '2.JPG', '3.JPG', '4.jpg', '5.JPG'],
  'milanesa vegana': ['1.JPG', '2.JPG', '3.jpg', '4.JPG', '5.JPG'],
  'papas': ['1.JPG', '2.JPG', '3.JPG', '4.JPG', '5.JPG', '6.JPG', '7.JPG', '8.JPG'],
};

/**
 * Recupera y ordena dinámicamente las rutas de imágenes para un producto específico.
 * 
 * Las imágenes suelen nombrarse numéricamente (ej. '1.jpg', '2.jpg'). 
 * Se ordenan numéricamente para garantizar que la progresión visual 
 * del carrusel sea la prevista (1, 2, 3...).
 *
 * @param {string} productId - ID del producto a buscar.
 * @returns {string[]} Array con las URLs listas para usarse en etiquetas <img>.
 */
export function getDynamicImagesForProduct(productId: string): string[] {
  const folderName = idToFolderMap[productId] || productId;
  const files = imageManifest[folderName];
  
  if (!files || files.length === 0) return [];

  return files
    .sort((a, b) => {
      const numA = parseInt(a.split('.')[0], 10);
      const numB = parseInt(b.split('.')[0], 10);
      const isNumA = !isNaN(numA);
      const isNumB = !isNaN(numB);
      if (isNumA && isNumB) return numA - numB;
      if (isNumA) return -1;
      if (isNumB) return 1;
      return a.localeCompare(b);
    })
    .map(file => `/Fotos%20menu/${encodeURIComponent(folderName)}/${file}`);
}

/**
 * Resuelve las imágenes finales de un producto, combinando imágenes estáticas
 * con imágenes subidas (Base64), aplicando ocultamientos y el orden definido.
 */
export function resolveImagesForProduct(item: MenuItemType): string[] {
  // Obtener imágenes estáticas base
  const staticImages = getDynamicImagesForProduct(item.id);
  
  // Combinar con imágenes subidas
  const allImages = [...staticImages, ...(item.customImages || [])];
  
  // Filtrar ocultas
  const hiddenSet = new Set(item.hiddenImages || []);
  const visibleImages = allImages.filter(img => !hiddenSet.has(img));
  
  // Aplicar orden
  if (item.imageOrder && item.imageOrder.length > 0) {
    const orderMap = new Map(item.imageOrder.map((url, i) => [url, i]));
    
    visibleImages.sort((a, b) => {
      const idxA = orderMap.has(a) ? orderMap.get(a)! : Infinity;
      const idxB = orderMap.has(b) ? orderMap.get(b)! : Infinity;
      return idxA - idxB;
    });
  }
  
  return visibleImages;
}

