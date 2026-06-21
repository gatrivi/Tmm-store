import { useCallback, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  ExternalLink,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import type { MenuImportReviewRow, ParsedMenuResult } from '../../types/menuCategory';
import {
  parsedToReviewRows,
  reviewRowsToCategories,
  reviewRowsToMenuItems,
  slugifyId,
} from '../../utils/menuImport';

type Step = 'upload' | 'review' | 'done';

const MAX_BYTES = 4 * 1024 * 1024;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.replace(/^data:[^;]+;base64,/, ''));
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminMenuOnboarding() {
  const { setMenuItems, setMenuCategories, setSiteSettings } = useMenu();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>('upload');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [rows, setRows] = useState<MenuImportReviewRow[]>([]);
  const [replaceMode, setReplaceMode] = useState(true);
  const [importStats, setImportStats] = useState({ categories: 0, items: 0 });

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setWarnings([]);
    if (!file.type.startsWith('image/')) {
      setError('Subí una imagen JPG o PNG del menú impreso');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Imagen muy grande (máx 4MB)');
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setLoading(true);

    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch('/api/parse-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType: file.type }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Error al procesar menú');
      }

      const data = json.data as ParsedMenuResult;
      setWarnings(json.warnings ?? []);
      setRows(parsedToReviewRows(data));

      if (data.businessInfo?.name) {
        setSiteSettings(prev => ({
          ...prev,
          brandName: data.businessInfo!.name || prev.brandName,
          brandInstagram: data.businessInfo!.instagram?.replace('@', '') || prev.brandInstagram,
          whatsappNumber: data.businessInfo!.phone?.replace(/\D/g, '') || prev.whatsappNumber,
        }));
      }

      setStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [setSiteSettings]);

  const updateRow = (rowId: string, patch: Partial<MenuImportReviewRow>) => {
    setRows(prev => prev.map(r => (r.rowId === rowId ? { ...r, ...patch } : r)));
  };

  const deleteRow = (rowId: string) => {
    setRows(prev => prev.filter(r => r.rowId !== rowId));
  };

  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        rowId: `row-${Date.now()}`,
        categoryId: prev[0]?.categoryId ?? 'menu',
        categoryName: prev[0]?.categoryName ?? 'Menú',
        name: '',
        description: '',
        price: 0,
        variantLabel: '',
      },
    ]);
  };

  const handleImport = () => {
    const categories = reviewRowsToCategories(rows);
    const items = reviewRowsToMenuItems(rows);
    if (items.length === 0) {
      setError('Agregá al menos un producto con nombre y precio');
      return;
    }

    if (replaceMode) {
      setMenuCategories(categories);
      setMenuItems(items);
    } else {
      setMenuCategories(prev => {
        const merged = [...prev];
        for (const cat of categories) {
          if (!merged.find(c => c.id === cat.id)) merged.push(cat);
        }
        return merged;
      });
      setMenuItems(prev => [...prev, ...items]);
    }

    setImportStats({ categories: categories.length, items: items.length });
    setStep('done');
    setError(null);
  };

  const resetWizard = () => {
    setStep('upload');
    setPreviewUrl(null);
    setRows([]);
    setWarnings([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Importar menú</h2>
        <p className="text-sm text-gray-400 font-medium">
          Subí una foto del menú impreso — la IA extrae categorías, productos y precios.
        </p>
      </div>

      {step === 'upload' && (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-white/15 rounded-2xl p-8 text-center bg-white/3 hover:bg-white/5 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={e => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {loading ? (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm font-bold">Procesando menú…</p>
              </div>
            ) : (
              <>
                <Upload size={36} className="mx-auto mb-3 text-brand-green" />
                <p className="text-white font-bold mb-1">Arrastrá o tocá para subir</p>
                <p className="text-xs text-gray-500">JPG, PNG · máx 4MB · requiere OPENAI_API_KEY</p>
              </>
            )}
          </div>

          {previewUrl && !loading && (
            <img src={previewUrl} alt="Vista previa menú" className="max-h-64 mx-auto rounded-xl border border-white/10" />
          )}

          {error && (
            <p className="text-red-400 text-sm font-bold flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </p>
          )}
          <p className="text-[10px] text-gray-600">
            En local: usá <code className="bg-white/10 px-1 rounded">vercel dev</code> para que /api/parse-menu funcione.
          </p>
        </div>
      )}

      {step === 'review' && (
        <div className="space-y-4">
          {warnings.map(w => (
            <p key={w} className="text-amber-400 text-xs font-bold flex items-center gap-2">
              <AlertTriangle size={14} /> {w}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={replaceMode}
                onChange={e => setReplaceMode(e.target.checked)}
                className="rounded"
              />
              Reemplazar menú actual
            </label>
            <button
              type="button"
              onClick={addRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-bold text-white"
            >
              <Plus size={14} /> Fila
            </button>
            <button
              type="button"
              onClick={resetWizard}
              className="text-xs text-gray-500 hover:text-white"
            >
              Subir otra foto
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm min-w-[720px]">
              <thead className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-2">Categoría</th>
                  <th className="p-2">Producto</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Variantes</th>
                  <th className="p-2 w-10" />
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={row.rowId} className="border-t border-white/5">
                    <td className="p-2">
                      <input
                        value={row.categoryName}
                        onChange={e => updateRow(row.rowId, {
                          categoryName: e.target.value,
                          categoryId: slugifyId(e.target.value),
                        })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.name}
                        onChange={e => updateRow(row.rowId, { name: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.description}
                        onChange={e => updateRow(row.rowId, { description: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                      />
                    </td>
                    <td className="p-2 w-24">
                      <input
                        type="number"
                        value={row.price || ''}
                        onChange={e => updateRow(row.rowId, { price: parseInt(e.target.value, 10) || 0 })}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={row.variantLabel}
                        onChange={e => updateRow(row.rowId, { variantLabel: e.target.value })}
                        placeholder="Vainilla / Caramel"
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <button type="button" onClick={() => deleteRow(row.rowId)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {error && <p className="text-red-400 text-sm font-bold">{error}</p>}

          <button
            type="button"
            onClick={handleImport}
            className="w-full sm:w-auto px-6 py-3 bg-brand-green text-white font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <ImagePlus size={18} />
            Importar {rows.length} filas
          </button>
        </div>
      )}

      {step === 'done' && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center space-y-4">
          <Check size={40} className="mx-auto text-green-400" />
          <h3 className="text-xl font-black text-white">Menú importado</h3>
          <p className="text-gray-400 text-sm">
            {importStats.categories} categorías · {importStats.items} productos
          </p>
          <p className="text-xs text-gray-500">
            Sumá fotos en Editor de Imágenes. Revisá precios antes de publicar.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-sm font-bold text-white"
            >
              Ver tienda <ExternalLink size={14} />
            </a>
            <button type="button" onClick={resetWizard} className="px-4 py-2 text-sm text-gray-400 hover:text-white">
              Importar otra carta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
