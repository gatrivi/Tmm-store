/**
 * @file AdminFileManager.tsx
 * @description Administrador de Archivos V7.
 *
 * Mobile: Lista vertical con @dnd-kit (TouchSensor delay 250ms).
 *         Botón de eliminar siempre visible en cada tarjeta.
 * Desktop: Grid clásico con botones hover (⬅️ ➡️ 🗑️).
 *
 * NO usa Reorder.Group/Item (incompatible con CSS Grid).
 * NO usa React state para posición de arrastre (causa re-renders).
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Save, RotateCcw, Check, Plus, Trash2, ArrowLeft, ArrowRight, AlertTriangle, GripVertical } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { getDynamicImagesForProduct } from '../../utils/imageLoader';
import type { MenuItemType } from '../../data/menu';

// ─── Helpers ───────────────────────────────────────────────────

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

// ─── useIsMobile Hook ──────────────────────────────────────────

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(pointer: coarse)').matches
      : false
  );

  useEffect(() => {
    const mql = window.matchMedia('(pointer: coarse)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return isMobile;
}

// ─── Types ─────────────────────────────────────────────────────

interface ImageEntry {
  id: string;
  isCustom: boolean;
}

// ─── SortableImageItem (Mobile) ────────────────────────────────

function SortableImageItem({
  img,
  index,
  draft,
  onDelete,
}: {
  img: ImageEntry;
  index: number;
  draft: MenuItemType;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: img.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style} // NOSONAR
      className="rounded-xl overflow-hidden bg-black/40 border border-white/5 select-none"
    >
      {/* Image */}
      <div className="relative aspect-video w-full">
        <img
          src={img.id}
          alt={`Imagen ${index + 1}`}
          className="w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: draft.imagePositions?.[img.id] || 'center' }} // NOSONAR
          draggable={false}
        />

        {/* Delete button — always visible */}
        <button
          onClick={() => onDelete(img.id)}
          className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 active:scale-90 transition-all shadow-lg z-10"
          title="Eliminar foto"
        >
          <Trash2 size={16} />
        </button>

        {img.isCustom && (
          <div className="absolute top-2 left-2 text-[8px] font-bold bg-brand-green text-white px-1.5 py-0.5 rounded uppercase tracking-wider pointer-events-none shadow-md">
            Subida
          </div>
        )}
      </div>

      {/* Bottom drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-3 py-2.5 bg-black/60 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-2 text-gray-400">
          <GripVertical size={16} />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {index + 1} · Mantener para mover
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────

export function AdminFileManager() {
  const { menuItems, updateMenuItem } = useMenu();
  const editableItems = menuItems.filter(i => i.id !== 'bebidas');
  const isMobile = useIsMobile();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [draft, setDraft] = useState<MenuItemType>(() => deepClone(editableItems[0]));
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // DndKit: active item for DragOverlay
  const [activeId, setActiveId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── DndKit Sensors ────────────────────────────────────────

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const sensors = useSensors(touchSensor, mouseSensor);

  // ─── Init images ─────────────────────────────────────────────

  const loadImagesForDraft = useCallback((currentDraft: MenuItemType) => {
    const staticImages = getDynamicImagesForProduct(currentDraft.id);
    const customImages = currentDraft.customImages || [];
    const hiddenSet = new Set(currentDraft.hiddenImages || []);

    const workingArray: ImageEntry[] = [
      ...staticImages.filter(url => !hiddenSet.has(url)).map(url => ({ id: url, isCustom: false })),
      ...customImages.map(url => ({ id: url, isCustom: true }))
    ];

    if (currentDraft.imageOrder && currentDraft.imageOrder.length > 0) {
      const orderMap = new Map(currentDraft.imageOrder.map((url, i) => [url, i]));
      workingArray.sort((a, b) => {
        const idxA = orderMap.has(a.id) ? orderMap.get(a.id)! : Infinity;
        const idxB = orderMap.has(b.id) ? orderMap.get(b.id)! : Infinity;
        return idxA - idxB;
      });
    }

    setImages(workingArray);
    setIsDirty(false);
    setErrorMsg(null);
  }, []);

  // Run on mount
  useState(() => {
    loadImagesForDraft(draft);
  });

  // ─── Item selection ──────────────────────────────────────────

  const selectItem = (index: number) => {
    if (isDirty) {
      showToastMsg('⚠️ Guardá o descartá los cambios primero');
      return;
    }
    const newDraft = deepClone(editableItems[index]);
    setSelectedIndex(index);
    setDraft(newDraft);
    loadImagesForDraft(newDraft);
  };

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── Image operations ────────────────────────────────────────

  const deleteImage = useCallback((id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setIsDirty(true);
  }, []);

  const moveImage = useCallback((index: number, direction: -1 | 1) => {
    setImages(prev => {
      if (index + direction < 0 || index + direction >= prev.length) return prev;
      const newArr = [...prev];
      const temp = newArr[index];
      newArr[index] = newArr[index + direction];
      newArr[index + direction] = temp;
      return newArr;
    });
    setIsDirty(true);
  }, []);

  // ─── DndKit handlers ────────────────────────────────────────

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setImages(prev => {
        const oldIndex = prev.findIndex(img => img.id === active.id);
        const newIndex = prev.findIndex(img => img.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
      setIsDirty(true);
    }
  }, []);

  const activeImage = images.find(img => img.id === activeId);

  // ─── Compress & Upload ───────────────────────────────────────

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 1024;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject('No context');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.8));
        };
        img.onerror = reject;
        if (typeof e.target?.result === 'string') img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setErrorMsg(null);

    try {
      setToast('⏳ Comprimiendo imagen...');
      const base64 = await compressImage(file);
      setImages(prev => [...prev, { id: base64, isCustom: true }]);
      setIsDirty(true);
      setToast(null);
    } catch (err) {
      console.error(err);
      setErrorMsg('Error al procesar la imagen.');
      setToast(null);
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Save / Discard ──────────────────────────────────────────

  const handleSave = () => {
    const newCustomImages = images.filter(img => img.isCustom).map(img => img.id);
    const newImageOrder = images.map(img => img.id);

    const staticImages = getDynamicImagesForProduct(draft.id);
    const currentStaticIds = new Set(images.filter(img => !img.isCustom).map(img => img.id));
    const newHiddenImages = staticImages.filter(url => !currentStaticIds.has(url));

    const updatedDraft = {
      ...draft,
      customImages: newCustomImages,
      imageOrder: newImageOrder,
      hiddenImages: newHiddenImages
    };

    try {
      const currentMenuData = deepClone(menuItems);
      const realIdx = currentMenuData.findIndex((i: MenuItemType) => i.id === draft.id);
      if (realIdx !== -1) currentMenuData[realIdx] = updatedDraft;
      const testString = JSON.stringify(currentMenuData);
      localStorage.setItem('__test_quota', testString);
      localStorage.removeItem('__test_quota');
    } catch {
      setErrorMsg('Límite de almacenamiento excedido. Eliminá imágenes subidas antes de guardar.');
      return;
    }

    const realIdx = menuItems.findIndex(i => i.id === draft.id);
    if (realIdx !== -1) updateMenuItem(realIdx, updatedDraft);

    setDraft(updatedDraft);
    setIsDirty(false);
    setErrorMsg(null);
    showToastMsg('✅ Archivos actualizados');
  };

  const handleDiscard = () => {
    loadImagesForDraft(draft);
  };

  // ─── Shared: Upload Card ─────────────────────────────────────

  const uploadCard = (
    <div className="relative rounded-xl overflow-hidden bg-white/4 border border-dashed border-white/20 hover:bg-white/10 hover:border-brand-green/50 transition-all group flex flex-col items-center justify-center cursor-pointer aspect-video md:aspect-4/3">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        title="Añadir nueva foto"
      />
      <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green mb-2 group-hover:scale-110 transition-transform">
        <Plus size={20} />
      </div>
      <span className="text-xs font-bold text-gray-400 group-hover:text-brand-green transition-colors">Añadir foto</span>
    </div>
  );

  // ─── RENDER ──────────────────────────────────────────────────

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-6 left-1/2 z-50 bg-brand-green text-white text-sm font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2"
          >
            {toast.includes('✅') && <Check size={16} />}
            {toast.includes('⏳') && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Administrador de Archivos</h2>
        <p className="text-sm text-gray-400 font-medium">
          {isMobile
            ? 'Mantené presionada una foto para arrastrarla'
            : 'Ordená, ocultá o subí nuevas imágenes a tus platos'}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Item List */}
        <div className="w-full lg:w-64 shrink-0 space-y-1.5 bg-white/3 rounded-xl p-2 border border-white/5 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto hide-scrollbar">
          {editableItems.map((item, index) => (
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
              </div>
            </button>
          ))}
        </div>

        {/* Right: File Manager */}
        <div className="flex-1 min-w-0 bg-white/4 rounded-xl border border-white/5 p-4 md:p-6">
          {/* Item header */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{getEmoji(draft.id)}</span>
            <div>
              <h3 className="text-lg font-black text-white">{draft.name}</h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                {images.length} imágenes
              </span>
            </div>
            {isDirty && (
              <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
                Sin guardar
              </span>
            )}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400 font-medium">
              <AlertTriangle size={18} />
              {errorMsg}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════ */}
          {/*  MOBILE: Vertical list with @dnd-kit               */}
          {/* ═══════════════════════════════════════════════════ */}
          {isMobile ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map(img => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 mb-6">
                  {images.map((img, idx) => (
                    <SortableImageItem
                      key={img.id}
                      img={img}
                      index={idx}
                      draft={draft}
                      onDelete={deleteImage}
                    />
                  ))}

                  {/* Upload */}
                  {uploadCard}
                </div>
              </SortableContext>

              {/* DragOverlay — floats above everything during drag */}
              <DragOverlay adjustScale={false}>
                {activeImage && (
                  <div className="rounded-xl overflow-hidden shadow-2xl border-2 border-brand-green/50 opacity-90 bg-black/60">
                    <div className="aspect-video w-full">
                      <img
                        src={activeImage.id}
                        alt="Arrastrando"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: draft.imagePositions?.[activeImage.id] || 'center' }} // NOSONAR
                        draggable={false}
                      />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/80 text-brand-green">
                      <GripVertical size={16} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Soltá para colocar</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          ) : (
            /* ═══════════════════════════════════════════════════ */
            /*  DESKTOP: Grid with hover buttons                   */
            /* ═══════════════════════════════════════════════════ */
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 mb-6">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  className="relative aspect-4/3 rounded-xl overflow-hidden group bg-black/40 border border-white/5"
                >
                  <img
                    src={img.id}
                    alt={`Imagen ${idx + 1}`}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: draft.imagePositions?.[img.id] || 'center' }} // NOSONAR
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <div className="flex justify-end">
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="p-2 bg-red-500/90 text-white rounded-lg hover:bg-red-500 transition-colors shadow-lg"
                        title="Eliminar foto"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => moveImage(idx, -1)}
                        disabled={idx === 0}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/40 disabled:opacity-30 transition-colors"
                        title="Mover a la izquierda"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <span className="text-xs font-bold text-white/80 bg-black/50 px-2 py-1 rounded-md">{idx + 1}</span>
                      <button
                        onClick={() => moveImage(idx, 1)}
                        disabled={idx === images.length - 1}
                        className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/40 disabled:opacity-30 transition-colors"
                        title="Mover a la derecha"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>

                  {img.isCustom && (
                    <div className="absolute top-2 left-2 text-[8px] font-bold bg-brand-green text-white px-1.5 py-0.5 rounded uppercase tracking-wider pointer-events-none shadow-md">
                      Subida
                    </div>
                  )}
                </div>
              ))}

              {/* Upload card */}
              {uploadCard}
            </div>
          )}

          {/* Help text */}
          <p className="text-[10px] text-gray-500 font-medium mb-4 leading-relaxed">
            {isMobile
              ? '💡 Mantené presionada la barra inferior de una foto para arrastrarla y reordenarla. Usá el ícono 🗑️ para eliminar.'
              : '💡 Usá las flechas para reordenar y el ícono 🗑️ para eliminar. El orden se refleja en el menú público.'}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white font-bold text-sm rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-green/20 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              Guardar Cambios
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
