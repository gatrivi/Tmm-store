/**
 * @file AdminImageEditor.tsx
 * @description Editor de imágenes V2 para el panel de administración.
 * Visor de una imagen a la vez con drag-to-pan para centrado,
 * cuadrícula de guía tipo Google Fotos, y bloqueo de navegación
 * si hay cambios sin guardar.
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { getDynamicImagesForProduct, resolveImagesForProduct } from '../../utils/imageLoader';
import type { MenuItemType } from '../../data/menu';

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

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function parsePosition(pos: string | undefined): { x: number; y: number; z: number } {
  if (!pos) return { x: 50, y: 50, z: 1 };
  if (pos.startsWith('{')) {
    try {
      const parsed = JSON.parse(pos);
      return { x: parsed.x ?? 50, y: parsed.y ?? 50, z: parsed.z ?? 1 };
    } catch {
      return { x: 50, y: 50, z: 1 };
    }
  }
  const parts = pos.replace(/%/g, '').split(/\s+/).map(Number);
  return {
    x: isNaN(parts[0]) ? 50 : Math.max(0, Math.min(100, parts[0])),
    y: isNaN(parts[1]) ? 50 : Math.max(0, Math.min(100, parts[1])),
    z: 1
  };
}

export function AdminImageEditor() {
  const { menuItems, updateMenuItem } = useMenu();
  const editableItems = menuItems.filter(i => i.id !== 'bebidas' && getDynamicImagesForProduct(i.id).length > 0);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState<MenuItemType>(() => deepClone(editableItems[0]));
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const isPinchingRef = useRef(false);
  const touchStateRef = useRef({ dist: 0, zoom: 1 });
  const startRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const gridTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // All images for current dish from the resolved manifest
  const allImages = resolveImagesForProduct(draft);
  const currentImg = allImages[currentImgIdx] || '';

  // Cleanup grid timer on unmount
  useEffect(() => {
    return () => { if (gridTimerRef.current) clearTimeout(gridTimerRef.current); };
  }, []);

  // Wheel zoom via native event (needs passive:false to preventDefault)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      e.preventDefault();
      setZoom(prev => Math.max(1, Math.min(2.5, prev - e.deltaY * 0.003)));
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const showToastMsg = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadPositionForImage = useCallback((imgUrl: string, item: MenuItemType) => {
    const { x, y, z } = parsePosition(item.imagePositions?.[imgUrl]);
    setPosX(x);
    setPosY(y);
    setZoom(z);
  }, []);

  const selectItem = useCallback((index: number) => {
    const newDraft = deepClone(editableItems[index]);
    setSelectedIndex(index);
    setDraft(newDraft);
    setCurrentImgIdx(0);
    setIsDirty(false);
    const imgs = resolveImagesForProduct(newDraft);
    loadPositionForImage(imgs[0], newDraft);
  }, [editableItems, loadPositionForImage]);

  const goToImage = useCallback((direction: -1 | 1) => {
    if (isDirty) {
      showToastMsg('⚠️ Guardá los cambios antes de cambiar de imagen');
      return;
    }
    const newIdx = currentImgIdx + direction;
    if (newIdx < 0 || newIdx >= allImages.length) return;
    setCurrentImgIdx(newIdx);
    loadPositionForImage(allImages[newIdx], draft);
  }, [isDirty, currentImgIdx, allImages, draft, loadPositionForImage, showToastMsg]);

  // ---- Pointer events for drag-to-pan ----
  // ---- Pointer events for drag-to-pan ----
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isPinchingRef.current) return;
    draggingRef.current = true;
    startRef.current = { x: e.clientX, y: e.clientY, posX, posY };
    setShowGrid(true);
    if (gridTimerRef.current) clearTimeout(gridTimerRef.current);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [posX, posY]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!draggingRef.current || !containerRef.current || isPinchingRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dx = e.clientX - startRef.current.x;
    const dy = e.clientY - startRef.current.y;
    
    // Al dividir por zoom, el paneo se siente natural independientemente de cuánto se haya acercado
    const deltaX = -(dx / rect.width) * 100 / zoom;
    const deltaY = -(dy / rect.height) * 100 / zoom;
    
    setPosX(Math.max(0, Math.min(100, startRef.current.posX + deltaX)));
    setPosY(Math.max(0, Math.min(100, startRef.current.posY + deltaY)));
    setIsDirty(true);
  }, [zoom]);

  const handlePointerUp = useCallback(() => {
    draggingRef.current = false;
    gridTimerRef.current = setTimeout(() => setShowGrid(false), 1500);
  }, []);

  // ---- Touch events for pinch-to-zoom ----
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      draggingRef.current = false;
      setShowGrid(false);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStateRef.current.dist = Math.hypot(dx, dy);
      touchStateRef.current.zoom = zoom;
    }
  }, [zoom]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const scale = dist / touchStateRef.current.dist;
      const newZoom = Math.max(1, Math.min(2.5, touchStateRef.current.zoom * scale));
      setZoom(newZoom);
      setIsDirty(true);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      isPinchingRef.current = false;
    }
  }, []);

  // ---- Save / Discard ----
  const handleSave = useCallback(() => {
    const positions = { ...(draft.imagePositions || {}) };
    if (zoom > 1) {
      positions[currentImg] = JSON.stringify({
        x: Math.round(posX),
        y: Math.round(posY),
        z: Number(zoom.toFixed(2))
      });
    } else {
      positions[currentImg] = `${Math.round(posX)}% ${Math.round(posY)}%`;
    }
    const updated = { ...draft, imagePositions: positions };
    setDraft(updated);
    const realIdx = menuItems.findIndex(i => i.id === draft.id);
    if (realIdx !== -1) updateMenuItem(realIdx, updated);
    setIsDirty(false);
    showToastMsg('✅ Centrado guardado');
  }, [draft, currentImg, posX, posY, zoom, menuItems, updateMenuItem, showToastMsg]);

  const handleDiscard = useCallback(() => {
    loadPositionForImage(currentImg, draft);
    setIsDirty(false);
    showToastMsg('↩️ Cambios descartados');
  }, [currentImg, draft, loadPositionForImage, showToastMsg]);

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-10010 bg-brand-green text-white text-sm font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2"
          >
            <Check size={16} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Editor de Imágenes</h2>
        <p className="text-sm text-gray-400 font-medium">Arrastrá para centrar cada foto — se guarda con el botón</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Item List */}
        <div className="w-full lg:w-64 shrink-0 space-y-1.5 bg-white/3 rounded-xl p-2 border border-white/5 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto hide-scrollbar">
          {editableItems.map((item, index) => {
            const imgCount = getDynamicImagesForProduct(item.id).length;
            return (
              <button
                key={item.id}
                onClick={() => selectItem(index)}
                className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all text-sm ${
                  selectedIndex === index
                    ? 'bg-brand-green text-white font-bold shadow-lg'
                    : 'text-gray-300 hover:bg-white/6 font-medium'
                }`}
              >
                <span className="text-lg">{getEmoji(item.id)}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate">{item.name}</div>
                  <div className="text-[10px] opacity-60 uppercase tracking-wider">{imgCount} fotos</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Image Editor */}
        <div className="flex-1 min-w-0 bg-white/4 rounded-xl border border-white/5 p-4 md:p-6">
          {/* Item header */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{getEmoji(draft.id)}</span>
            <div>
              <h3 className="text-lg font-black text-white">{draft.name}</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Imagen {currentImgIdx + 1} de {allImages.length}
              </span>
            </div>
            {isDirty && (
              <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                Sin guardar
              </span>
            )}
          </div>

          {/* Image Viewer with arrows */}
          <div className="relative select-none mb-4">
            {/* Left arrow */}
            <button
              onClick={() => goToImage(-1)}
              disabled={currentImgIdx === 0 && !isDirty}
              aria-label="Imagen anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Right arrow */}
            <button
              onClick={() => goToImage(1)}
              disabled={currentImgIdx === allImages.length - 1 && !isDirty}
              aria-label="Imagen siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image container */}
            <div
              ref={containerRef}
              className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/40 cursor-grab active:cursor-grabbing touch-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={currentImg}
                alt={`${draft.name} ${currentImgIdx + 1}`}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-75"
                style={{ // NOSONAR
                  objectPosition: `${posX}% ${posY}%`,
                  transformOrigin: `${posX}% ${posY}%`,
                  transform: `scale(${zoom})`,
                }}
                draggable={false}
              />

              {/* Grid overlay (rule of thirds) */}
              <div
                className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 transition-opacity duration-500 ${showGrid ? 'opacity-100' : 'opacity-0'}`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="border border-white/20" />
                ))}
              </div>

              {/* Position indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/60 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-md pointer-events-none">
                {Math.round(posX)}% / {Math.round(posY)}%
              </div>
            </div>
          </div>

          {/* Image counter dots */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {allImages.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImgIdx ? 'w-5 bg-brand-green' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>

          {/* Zoom slider */}
          <div className="flex items-center gap-3 mb-5 bg-white/4 rounded-xl p-3 border border-white/5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Zoom</span>
            <input
              type="range"
              min={100}
              max={250}
              value={Math.round(zoom * 100)}
              onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
              aria-label="Nivel de zoom"
              className="flex-1 h-1.5 accent-brand-green"
            />
            <span className="text-xs font-bold text-gray-400 w-10 text-right">{Math.round(zoom * 100)}%</span>
          </div>

          {/* Help text */}
          <p className="text-[10px] text-gray-500 font-medium mb-4 leading-relaxed">
            💡 <strong className="text-gray-400">Arrastrá</strong> la imagen para mover el encuadre. Usá el <strong className="text-gray-400">zoom</strong> para ver más detalle. Guardá antes de cambiar de foto.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Guardar Centrado
            </button>
            <button
              onClick={handleDiscard}
              disabled={!isDirty}
              className="flex items-center justify-center gap-2 py-3 px-5 bg-white/6 text-gray-300 font-bold text-sm rounded-xl hover:bg-white/10 transition-all border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RotateCcw size={16} />
              <span className="hidden sm:inline">Descartar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
