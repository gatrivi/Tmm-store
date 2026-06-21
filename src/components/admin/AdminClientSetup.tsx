import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ClipboardList,
  Copy,
  ExternalLink,
  ImagePlus,
  Lock,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { usePlan } from '../../context/PlanContext';
import type { MenuCategory, MenuImportReviewRow } from '../../types/menuCategory';
import {
  markClientSetupComplete,
  resolveStorefrontPath,
} from '../../utils/clientSetup';
import { compressImageFile } from '../../utils/imageCompress';
import {
  reviewRowsToCategories,
  reviewRowsToMenuItems,
  slugifyId,
} from '../../utils/menuImport';
import { resolveImagesForProduct } from '../../utils/imageLoader';
import { buildStorefrontUrl, generateStoreQrDataUrl } from '../../utils/storeQr';
import { loadBusinessHours, type BusinessHoursSchedule } from '../../utils/businessHours';
import { BusinessHoursFields } from './BusinessHoursFields';

type WizardStep = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ['Negocio', 'Categorías', 'Productos', 'Fotos', 'Listo'];

interface AdminClientSetupProps {
  onOpenImportMenu?: () => void;
  onExitSetup?: () => void;
  onOpenSettings?: () => void;
}

function emptyCategory(): MenuCategory {
  return {
    id: slugifyId(`cat-${Date.now()}`),
    name: '',
    sortOrder: 0,
  };
}

function emptyProductRow(category: MenuCategory, index: number): MenuImportReviewRow {
  return {
    rowId: `row-${Date.now()}-${index}`,
    categoryId: category.id,
    categoryName: category.name,
    name: '',
    description: '',
    price: 0,
    variantLabel: '',
  };
}

export function AdminClientSetup({ onOpenImportMenu, onExitSetup, onOpenSettings }: AdminClientSetupProps) {
  const { tenantId } = usePlan();
  const {
    menuItems,
    setMenuItems,
    menuCategories,
    setMenuCategories,
    siteSettings,
    setSiteSettings,
    updateMenuItem,
  } = useMenu();

  const [step, setStep] = useState<WizardStep>(1);
  const [startEmpty, setStartEmpty] = useState(true);
  const [categories, setCategories] = useState<MenuCategory[]>(() => [
    { id: 'entradas', name: 'Entradas', sortOrder: 0 },
    { id: 'principales', name: 'Principales', sortOrder: 1 },
  ]);
  const [productRows, setProductRows] = useState<MenuImportReviewRow[]>([]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHoursSchedule>(() => loadBusinessHours());
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const activePhotoItemId = useRef<string | null>(null);

  const storePath = resolveStorefrontPath(tenantId);
  const storeUrl = buildStorefrontUrl(storePath);

  useEffect(() => {
    if (step !== 5) return;
    let cancelled = false;
    generateStoreQrDataUrl(storeUrl)
      .then(url => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [step, storeUrl]);

  const copyStoreLink = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      alert(`Copiá este link: ${storeUrl}`);
    }
  };

  const productsWithPhotos = useMemo(
    () => menuItems.filter(item => resolveImagesForProduct(item).length > 0).length,
    [menuItems],
  );

  const updateProductRow = (rowId: string, patch: Partial<MenuImportReviewRow>) => {
    setProductRows(prev => prev.map(r => (r.rowId === rowId ? { ...r, ...patch } : r)));
  };

  const deleteProductRow = (rowId: string) => {
    setProductRows(prev => prev.filter(r => r.rowId !== rowId));
  };

  const addProductForCategory = (cat: MenuCategory) => {
    setProductRows(prev => [...prev, emptyProductRow(cat, prev.length)]);
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const base64 = await compressImageFile(file, { maxSize: 512, quality: 0.85 });
      setSiteSettings(prev => ({ ...prev, brandLogo: base64 }));
    } catch {
      alert('Error al procesar el logo');
    }
  };

  const applyStep1 = () => {
    if (startEmpty) {
      setMenuItems([]);
      setMenuCategories([]);
    }
    setStep(2);
  };

  const applyStep2 = () => {
    const valid = categories.filter(c => c.name.trim());
    if (valid.length === 0) {
      alert('Agregá al menos una categoría');
      return;
    }
    const normalized = valid.map((c, i) => ({
      ...c,
      id: c.id || slugifyId(c.name),
      name: c.name.trim(),
      sortOrder: i,
    }));
    setCategories(normalized);

    if (productRows.length === 0) {
      setProductRows(normalized.flatMap(cat => [emptyProductRow(cat, 0)]));
    } else {
      setProductRows(prev =>
        prev.map(row => {
          const cat = normalized.find(c => c.id === row.categoryId);
          return cat ? { ...row, categoryName: cat.name, categoryId: cat.id } : row;
        }),
      );
    }
    setStep(3);
  };

  const applyStep3 = () => {
    const validRows = productRows.filter(r => r.name.trim() && r.price > 0);
    if (validRows.length === 0) {
      alert('Agregá al menos un producto con nombre y precio');
      return;
    }
    const items = reviewRowsToMenuItems(validRows);
    const cats = reviewRowsToCategories(validRows);
    setMenuItems(items);
    setMenuCategories(cats);
    setStep(4);
  };

  const handlePhotoFile = async (file: File) => {
    const itemId = activePhotoItemId.current;
    if (!itemId) return;

    const index = menuItems.findIndex(i => i.id === itemId);
    if (index === -1) return;

    setPhotoError(null);
    setUploadingId(itemId);

    try {
      const base64 = await compressImageFile(file);
      const item = menuItems[index];
      const customImages = [...(item.customImages || []), base64];
      const imageOrder = [...(item.imageOrder || []), base64];

      try {
        const testPayload = JSON.stringify({ ...item, customImages, imageOrder });
        localStorage.setItem('__test_quota', testPayload);
        localStorage.removeItem('__test_quota');
      } catch {
        setPhotoError('Espacio de almacenamiento lleno. Sacá fotos o usá imágenes más chicas.');
        return;
      }

      updateMenuItem(index, {
        ...item,
        customImages,
        imageOrder,
        images: item.images?.length ? item.images : [],
      });
    } catch {
      setPhotoError('Error al procesar la foto');
    } finally {
      setUploadingId(null);
      activePhotoItemId.current = null;
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const triggerPhotoCapture = (itemId: string, useCamera: boolean) => {
    activePhotoItemId.current = itemId;
    if (photoInputRef.current) {
      if (useCamera) {
        photoInputRef.current.setAttribute('capture', 'environment');
      } else {
        photoInputRef.current.removeAttribute('capture');
      }
      photoInputRef.current.click();
    }
  };

  const finishSetup = useCallback(() => {
    markClientSetupComplete();
    setStep(5);
  }, []);

  const skipPhotos = () => {
    finishSetup();
  };

  const renderStepIndicator = () => (
    <div className="flex gap-1 mb-6">
      {STEP_LABELS.map((label, i) => {
        const n = (i + 1) as WizardStep;
        const active = step === n;
        const done = step > n;
        return (
          <div key={label} className="flex-1 min-w-0">
            <div
              className={`h-1.5 rounded-full mb-1 ${done ? 'bg-brand-green' : active ? 'bg-brand-green/70' : 'bg-white/10'}`}
            />
            <span className={`text-[9px] font-bold uppercase truncate block ${active ? 'text-white' : 'text-gray-600'}`}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0];
          if (file) handlePhotoFile(file);
        }}
      />

      <div>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="text-brand-green" size={28} />
          <h2 className="text-2xl md:text-3xl font-black text-white">Armado de tienda</h2>
        </div>
        <p className="text-sm text-gray-400 font-medium">
          Configurá tu menú paso a paso — ideal para tablet
        </p>
      </div>

      {renderStepIndicator()}

      {step === 1 && (
        <div className="space-y-5">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <label className="block">
              <span className="text-sm font-bold text-white mb-2 block">Nombre del negocio</span>
              <input
                value={siteSettings.brandName}
                onChange={e => setSiteSettings(prev => ({ ...prev, brandName: e.target.value }))}
                placeholder="Ej: Café de la Esquina"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-white mb-2 block">WhatsApp (con código país)</span>
              <input
                value={siteSettings.whatsappNumber}
                onChange={e => setSiteSettings(prev => ({ ...prev, whatsappNumber: e.target.value.replace(/\D/g, '') }))}
                placeholder="5491123456789"
                inputMode="numeric"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-white mb-2 block">Alias / CBU (transferencias)</span>
              <input
                value={siteSettings.bankAlias}
                onChange={e => setSiteSettings(prev => ({ ...prev, bankAlias: e.target.value }))}
                placeholder="mi.cafe.mp"
                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
              />
            </label>

            <div>
              <span className="text-sm font-bold text-white mb-2 block">Logo (opcional)</span>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleLogoUpload(file);
                  e.target.value = '';
                }}
              />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-white/15 rounded-xl text-gray-300 hover:bg-white/5 transition"
              >
                {siteSettings.brandLogo ? (
                  <img src={siteSettings.brandLogo} alt="Logo" className="h-12 object-contain" />
                ) : (
                  <>
                    <Upload size={22} className="text-brand-green" />
                    <span className="font-bold">Subir logo</span>
                  </>
                )}
              </button>
            </div>

            <label className="flex items-start gap-3 p-3 bg-black/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={startEmpty}
                onChange={e => setStartEmpty(e.target.checked)}
                className="mt-1 rounded"
              />
              <span className="text-sm text-gray-300">
                <strong className="text-white">Empezar menú vacío</strong>
                <br />
                <span className="text-xs text-gray-500">Quita el menú demo (choripán, etc.)</span>
              </span>
            </label>

            <div className="bg-black/20 rounded-xl p-4">
              <BusinessHoursFields
                value={businessHours}
                onChange={setBusinessHours}
                compact
              />
            </div>
          </div>

          <button
            type="button"
            onClick={applyStep1}
            className="w-full flex items-center justify-center gap-2 py-4 bg-brand-green text-white font-black rounded-xl text-base"
          >
            Siguiente: Categorías
            <ArrowRight size={20} />
          </button>

          <p className="flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <Lock size={14} className="shrink-0 mt-0.5" />
            <span>
              Antes de entregar la tablet, cambiá la contraseña del admin en{' '}
              {onOpenSettings ? (
                <button type="button" onClick={onOpenSettings} className="underline font-bold text-amber-300">
                  Configuración
                </button>
              ) : (
                'Configuración'
              )}
              {' '}(modo avanzado).
            </span>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Secciones de tu menú impreso (Ej: Bebidas, Postres)</p>

          {categories.map((cat, index) => (
            <div key={cat.id} className="flex gap-2 items-center">
              <input
                value={cat.name}
                onChange={e => {
                  const name = e.target.value;
                  setCategories(prev =>
                    prev.map((c, i) =>
                      i === index ? { ...c, name, id: slugifyId(name) || c.id } : c,
                    ),
                  );
                }}
                placeholder="Nombre de categoría"
                className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-base"
              />
              <button
                type="button"
                onClick={() => setCategories(prev => prev.filter((_, i) => i !== index))}
                disabled={categories.length <= 1}
                className="p-3 rounded-xl bg-red-500/10 text-red-400 disabled:opacity-30"
                aria-label="Eliminar categoría"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setCategories(prev => [...prev, { ...emptyCategory(), sortOrder: prev.length }])
            }
            className="w-full flex items-center justify-center gap-2 py-3 border border-white/10 rounded-xl text-white font-bold"
          >
            <Plus size={18} /> Agregar categoría
          </button>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              type="button"
              onClick={applyStep2}
              className="flex-[2] py-3 bg-brand-green text-white font-black rounded-xl flex items-center justify-center gap-2"
            >
              Siguiente: Productos <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          {onOpenImportMenu && (
            <button
              type="button"
              onClick={onOpenImportMenu}
              className="w-full text-left p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/8"
            >
              <span className="font-bold text-white block mb-1">¿Tenés foto del menú impreso?</span>
              Probar importación automática con IA →
            </button>
          )}

          {categories.map(cat => {
            const rows = productRows.filter(r => r.categoryId === cat.id);
            return (
              <div key={cat.id} className="space-y-3">
                <h3 className="text-lg font-black text-white">{cat.name || 'Sin nombre'}</h3>
                {rows.map(row => (
                  <div
                    key={row.rowId}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                  >
                    <input
                      value={row.name}
                      onChange={e => updateProductRow(row.rowId, { name: e.target.value })}
                      placeholder="Nombre del producto"
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white"
                    />
                    <div className="flex gap-2">
                      <input
                        value={row.price || ''}
                        onChange={e =>
                          updateProductRow(row.rowId, { price: parseInt(e.target.value, 10) || 0 })
                        }
                        placeholder="Precio"
                        inputMode="numeric"
                        className="w-32 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white"
                      />
                      <input
                        value={row.description}
                        onChange={e => updateProductRow(row.rowId, { description: e.target.value })}
                        placeholder="Descripción (opcional)"
                        className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteProductRow(row.rowId)}
                      className="text-xs text-red-400 font-bold flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Quitar
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addProductForCategory(cat)}
                  className="w-full py-2.5 rounded-xl border border-dashed border-white/15 text-sm font-bold text-gray-400"
                >
                  + Agregar producto
                </button>
              </div>
            );
          })}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-gray-300 font-bold flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} /> Atrás
            </button>
            <button
              type="button"
              onClick={applyStep3}
              className="flex-[2] py-3 bg-brand-green text-white font-black rounded-xl flex items-center justify-center gap-2"
            >
              Guardar y continuar <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Sacá fotos de cada plato o saltá este paso — el menú funciona sin fotos.
          </p>

          {photoError && (
            <p className="text-red-400 text-sm font-bold bg-red-500/10 p-3 rounded-xl">{photoError}</p>
          )}

          {menuItems.map(item => {
            const thumbs = resolveImagesForProduct(item);
            const isUploading = uploadingId === item.id;
            return (
              <div
                key={item.id}
                className="flex gap-4 items-center bg-white/5 border border-white/10 rounded-2xl p-4"
              >
                <div className="w-20 h-20 shrink-0 rounded-xl bg-black/40 overflow-hidden flex items-center justify-center">
                  {thumbs[0] ? (
                    <img src={thumbs[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus size={28} className="text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {thumbs.length > 0 ? `${thumbs.length} foto(s)` : 'Sin foto'}
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => triggerPhotoCapture(item.id, true)}
                    className="flex items-center gap-1 px-3 py-2 bg-brand-green/20 text-brand-green rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    <Camera size={14} />
                    {isUploading ? '…' : 'Cámara'}
                  </button>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => triggerPhotoCapture(item.id, false)}
                    className="flex items-center gap-1 px-3 py-2 bg-white/10 text-gray-300 rounded-lg text-xs font-bold disabled:opacity-50"
                  >
                    <Upload size={14} /> Galería
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={finishSetup}
              className="w-full py-4 bg-brand-green text-white font-black rounded-xl"
            >
              Terminar armado
            </button>
            <button
              type="button"
              onClick={skipPhotos}
              className="w-full py-3 text-gray-500 font-bold text-sm"
            >
              Saltar fotos por ahora
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="py-2 text-gray-600 text-sm font-bold flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} /> Editar productos
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-green/20 flex items-center justify-center">
            <Check size={32} className="text-brand-green" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white mb-2">¡Listo!</h3>
            <p className="text-gray-400 text-sm">
              {menuCategories.length} categorías · {menuItems.length} productos · {productsWithPhotos} con foto
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
            <p className="text-sm font-bold text-white">QR para el mostrador</p>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR de la tienda"
                className="mx-auto w-[220px] h-[220px] rounded-xl bg-white p-2"
              />
            ) : (
              <div className="mx-auto w-[220px] h-[220px] rounded-xl bg-white/10 animate-pulse" />
            )}
            <p className="text-[10px] text-gray-500 break-all">{storeUrl}</p>
            <button
              type="button"
              onClick={copyStoreLink}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/10 hover:bg-white/15 rounded-xl text-sm font-bold text-white transition"
            >
              <Copy size={16} />
              {linkCopied ? 'Link copiado' : 'Copiar link de la tienda'}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={storePath}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-green text-white font-black rounded-xl"
            >
              Ver mi tienda
              <ExternalLink size={18} />
            </a>
            <button
              type="button"
              onClick={onExitSetup}
              className="w-full py-3 border border-white/10 text-white font-bold rounded-xl"
            >
              Ir al admin completo
            </button>
          </div>

          <p className="flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-left">
            <Lock size={14} className="shrink-0 mt-0.5" />
            <span>
              Cambiá la contraseña del admin antes de dejar la tablet.{' '}
              {onOpenSettings && (
                <button type="button" onClick={onOpenSettings} className="underline font-bold text-amber-300">
                  Ir a Configuración
                </button>
              )}
            </span>
          </p>

          <p className="text-[10px] text-gray-600 max-w-sm mx-auto">
            Los datos quedan guardados en este dispositivo. Cuando la nube esté activa, se sincronizan solos.
          </p>
        </div>
      )}
    </div>
  );
}
