/**
 * @file AdminMenuEditor.tsx
 * @description Editor completo de menú para el panel de administración.
 * Permite al administrador modificar nombres, descripciones, precios,
 * labels de opciones, suffixes y features de cada plato del menú,
 * con soporte multi-idioma. Los precios son universales (cambian para
 * todos los idiomas), los textos son por idioma.
 */
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, RotateCcw, Check, ChevronDown, ChevronUp, Plus, Trash2, Percent } from 'lucide-react';
import { useMenu, type ExtraItem } from '../../context/MenuContext';
import { usePlan } from '../../context/PlanContext';
import type { MenuItemType, MenuOption } from '../../data/menu';

type EditLang = 'es' | 'en' | 'pt' | 'ru' | 'de';

const LANG_OPTIONS: { code: EditLang; flag: string; label: string }[] = [
  { code: 'es', flag: '🇦🇷', label: 'ES' },
  { code: 'en', flag: '🇺🇸', label: 'EN' },
  { code: 'pt', flag: '🇧🇷', label: 'PT' },
  { code: 'ru', flag: '🇷🇺', label: 'RU' },
  { code: 'de', flag: '🇩🇪', label: 'DE' },
];

const getEmoji = (id: string): string => {
  const lower = id.toLowerCase();
  if (lower === 'bebidas') return '🥤';
  if (lower === 'bondiola-popito') return '🥪';
  if (lower.includes('choripan')) return '🌭';
  if (lower.includes('hamburguesa')) return '🍔';
  if (lower.includes('bondiola')) return '🐖';
  if (lower.includes('bife')) return '🥩';
  if (lower.includes('veggie') || lower.includes('vegan')) return '🌱';
  if (lower.includes('papas')) return '🍟';
  if (lower.includes('pizza')) return '🍕';
  if (lower.includes('pasta')) return '🍝';
  if (lower.includes('postre') || lower.includes('cake')) return '🍰';
  return '🍽️';
};

/** Helpers para leer/escribir campos multi-idioma de MenuItemType */
function getItemName(item: MenuItemType, lang: EditLang): string {
  if (lang === 'es') return item.name;
  if (lang === 'en') return item.nameEn || '';
  if (lang === 'pt') return item.namePt || '';
  if (lang === 'ru') return item.nameRu || '';
  if (lang === 'de') return item.nameDe || '';
  return item.name;
}

function setItemName(item: MenuItemType, lang: EditLang, value: string): MenuItemType {
  const clone = { ...item };
  if (lang === 'es') clone.name = value;
  else if (lang === 'en') clone.nameEn = value;
  else if (lang === 'pt') clone.namePt = value;
  else if (lang === 'ru') clone.nameRu = value;
  else if (lang === 'de') clone.nameDe = value;
  return clone;
}

function getItemDescription(item: MenuItemType, lang: EditLang): string {
  if (lang === 'es') return item.description;
  if (lang === 'en') return item.descriptionEn || '';
  if (lang === 'pt') return item.descriptionPt || '';
  if (lang === 'ru') return item.descriptionRu || '';
  if (lang === 'de') return item.descriptionDe || '';
  return item.description;
}

function setItemDescription(item: MenuItemType, lang: EditLang, value: string): MenuItemType {
  const clone = { ...item };
  if (lang === 'es') clone.description = value;
  else if (lang === 'en') clone.descriptionEn = value;
  else if (lang === 'pt') clone.descriptionPt = value;
  else if (lang === 'ru') clone.descriptionRu = value;
  else if (lang === 'de') clone.descriptionDe = value;
  return clone;
}

function getOptionLabel(opt: MenuOption, lang: EditLang): string {
  if (lang === 'es') return opt.label;
  if (lang === 'en') return opt.labelEn || '';
  if (lang === 'pt') return opt.labelPt || '';
  if (lang === 'ru') return opt.labelRu || '';
  if (lang === 'de') return opt.labelDe || '';
  return opt.label;
}

function setOptionLabel(opt: MenuOption, lang: EditLang, value: string): MenuOption {
  const clone = { ...opt };
  if (lang === 'es') clone.label = value;
  else if (lang === 'en') clone.labelEn = value;
  else if (lang === 'pt') clone.labelPt = value;
  else if (lang === 'ru') clone.labelRu = value;
  else if (lang === 'de') clone.labelDe = value;
  return clone;
}

function getOptionSuffix(opt: MenuOption, lang: EditLang): string {
  if (lang === 'es') return opt.suffix || '';
  if (lang === 'en') return opt.suffixEn || '';
  if (lang === 'pt') return opt.suffixPt || '';
  if (lang === 'ru') return opt.suffixRu || '';
  if (lang === 'de') return opt.suffixDe || '';
  return opt.suffix || '';
}

function setOptionSuffix(opt: MenuOption, lang: EditLang, value: string): MenuOption {
  const clone = { ...opt };
  if (lang === 'es') clone.suffix = value;
  else if (lang === 'en') clone.suffixEn = value;
  else if (lang === 'pt') clone.suffixPt = value;
  else if (lang === 'ru') clone.suffixRu = value;
  else if (lang === 'de') clone.suffixDe = value;
  return clone;
}

function getOptionFeatures(opt: MenuOption, lang: EditLang): string[] {
  if (lang === 'es') return opt.features || [];
  if (lang === 'en') return opt.featuresEn || [];
  if (lang === 'pt') return opt.featuresPt || [];
  if (lang === 'ru') return opt.featuresRu || [];
  if (lang === 'de') return opt.featuresDe || [];
  return opt.features || [];
}

function setOptionFeatures(opt: MenuOption, lang: EditLang, value: string[]): MenuOption {
  const clone = { ...opt };
  if (lang === 'es') clone.features = value;
  else if (lang === 'en') clone.featuresEn = value;
  else if (lang === 'pt') clone.featuresPt = value;
  else if (lang === 'ru') clone.featuresRu = value;
  else if (lang === 'de') clone.featuresDe = value;
  return clone;
}

/** Clona un objeto de forma profunda */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function AdminMenuEditor() {
  const { menuItems, setMenuItems, updateMenuItem, deleteMenuItem, extrasData, updateExtraItem } = useMenu();
  const { features } = usePlan();
  const [bulkPercent, setBulkPercent] = useState('10');
  const [bulkDirection, setBulkDirection] = useState<'increase' | 'decrease'>('increase');
  const [selectedLang, setSelectedLang] = useState<EditLang>('es');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [editingExtras, setEditingExtras] = useState(false);
  const [draft, setDraft] = useState<MenuItemType | null>(() => menuItems.length > 0 ? deepClone(menuItems[0]) : null);
  const [extrasDraft, setExtrasDraft] = useState<ExtraItem[]>(() => deepClone(extrasData));
  const [toast, setToast] = useState<string | null>(null);
  const [expandedOptions, setExpandedOptions] = useState<Set<number>>(new Set([0]));

  /** Seleccionar un plato del listado (draft se inicializa en el event handler) */
  const selectItem = useCallback((index: number) => {
    setSelectedItemIndex(index);
    setEditingExtras(false);
    setDraft(deepClone(menuItems[index]));
  }, [menuItems]);

  /** Entrar al modo edición de extras */
  const selectExtras = useCallback(() => {
    setEditingExtras(true);
    setExtrasDraft(deepClone(extrasData));
  }, [extrasData]);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSave = useCallback(() => {
    if (editingExtras) {
      extrasDraft.forEach((extra, i) => updateExtraItem(i, extra));
      showToast('✅ Extras guardados exitosamente');
    } else if (draft) {
      updateMenuItem(selectedItemIndex, draft);
      showToast('✅ Cambios guardados exitosamente');
    }
  }, [editingExtras, extrasDraft, draft, selectedItemIndex, updateMenuItem, updateExtraItem, showToast]);

  const handleDiscard = useCallback(() => {
    if (editingExtras) {
      setExtrasDraft(deepClone(extrasData));
      showToast('↩️ Cambios descartados');
    } else {
      setDraft(menuItems[selectedItemIndex] ? deepClone(menuItems[selectedItemIndex]) : null);
      showToast('↩️ Cambios descartados');
    }
  }, [editingExtras, extrasData, menuItems, selectedItemIndex, showToast]);

  const handleAddNewItem = useCallback(() => {
    const newId = `item-${Date.now()}`;
    const newItem: MenuItemType = {
      id: newId,
      name: 'Nuevo Producto',
      description: 'Descripción del producto...',
      category: 'General',
      available: true,
      options: [
        { id: `${newId}-opt-1`, label: 'Simple', price: 0, available: true }
      ],
      images: []
    };
    
    setMenuItems(prev => [...prev, newItem]);
    setSelectedItemIndex(menuItems.length);
    setDraft(deepClone(newItem));
    setEditingExtras(false);
    showToast('✨ Producto creado. No olvides guardar.');
  }, [menuItems.length, setMenuItems, showToast]);

  const handleDeleteItem = useCallback(() => {
    if (!draft) return;
    if (window.confirm(`¿Estás seguro de eliminar "${draft.name}"?`)) {
      deleteMenuItem(selectedItemIndex);
      setSelectedItemIndex(0);
      setDraft(menuItems[0] ? deepClone(menuItems[0]) : null);
      showToast('🗑️ Producto eliminado');
    }
  }, [deleteMenuItem, draft, menuItems, selectedItemIndex, showToast]);

  const applyBulkPricing = useCallback(() => {
    const pct = parseInt(bulkPercent, 10);
    if (!pct || pct <= 0) return;
    const factor = bulkDirection === 'increase' ? 1 + pct / 100 : 1 - pct / 100;
    setMenuItems(prev =>
      prev.map(item => ({
        ...item,
        options: item.options.map(opt => ({
          ...opt,
          price: Math.max(0, Math.round(opt.price * factor)),
        })),
      })),
    );
    showToast(`💰 Precios ${bulkDirection === 'increase' ? 'aumentados' : 'reducidos'} ${pct}%`);
  }, [bulkPercent, bulkDirection, setMenuItems, showToast]);

  const updateDraftOption = useCallback((optIndex: number, updater: (opt: MenuOption) => MenuOption) => {
    if (!draft) return;
    const newDraft = { ...draft };
    const newOptions = [...newDraft.options];
    newOptions[optIndex] = updater(newOptions[optIndex]);
    newDraft.options = newOptions;
    setDraft(newDraft);
  }, [draft]);

  const toggleOptionExpand = useCallback((i: number) => {
    setExpandedOptions(prev => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  }, []);

  const handleAddOption = useCallback(() => {
    if (!draft) return;
    const optId = `${draft.id}-opt-${draft.options.length + 1}`;
    const newOpt: MenuOption = { id: optId, label: 'Nueva Opción', price: 0, available: true };
    setDraft({ ...draft, options: [...draft.options, newOpt] });
    setExpandedOptions(prev => new Set(prev).add(draft.options.length));
  }, [draft]);

  const handleDeleteOption = useCallback((idx: number) => {
    if (!draft || draft.options.length <= 1) return;
    const newOpts = draft.options.filter((_, i) => i !== idx);
    setDraft({ ...draft, options: newOpts });
  }, [draft]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Editor de Menú</h2>
          <p className="text-sm text-gray-400 font-medium">Modificá precios, descripciones y opciones de cada plato</p>
        </div>
        <button
          onClick={handleAddNewItem}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-green text-white font-bold text-sm rounded-xl hover:brightness-110 transition-all shadow-lg shadow-brand-green/20"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      {features.canUseBulkPricing && (
        <div className="bg-white/3 border border-white/10 rounded-2xl p-4 flex flex-wrap items-end gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Percent size={16} className="text-green-400" />
            Cambio masivo de precios
          </div>
          <select
            value={bulkDirection}
            onChange={e => setBulkDirection(e.target.value as 'increase' | 'decrease')}
            className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
          >
            <option value="increase">Aumentar</option>
            <option value="decrease">Reducir</option>
          </select>
          <input
            value={bulkPercent}
            onChange={e => setBulkPercent(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-20 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
          />
          <span className="text-sm text-gray-400">%</span>
          <button
            onClick={applyBulkPricing}
            className="px-4 py-2 bg-brand-green text-white rounded-xl text-xs font-bold"
          >
            Aplicar a todo el menú
          </button>
        </div>
      )}

      {/* Language Selector */}
      <div className="flex items-center gap-1.5 bg-white/6 backdrop-blur-sm border border-white/10 rounded-xl p-1.5">
        {LANG_OPTIONS.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-bold transition-all ${
              selectedLang === lang.code
                ? 'bg-brand-green text-white shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-white/6'
            }`}
          >
            <span className="text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left: Item List */}
        <div className="w-full lg:w-64 shrink-0 space-y-1.5 bg-white/3 rounded-xl p-2 border border-white/5 max-h-[60vh] lg:max-h-[70vh] overflow-y-auto hide-scrollbar">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => selectItem(index)}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all text-sm ${
                !editingExtras && selectedItemIndex === index
                  ? 'bg-brand-green text-white font-bold shadow-lg'
                  : 'text-gray-300 hover:bg-white/6 font-medium'
              }`}
            >
              <span className="text-lg">{getEmoji(item.id)}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate">{getItemName(item, selectedLang) || item.name}</div>
                <div className="text-[10px] opacity-60 uppercase tracking-wider">{item.category}</div>
              </div>
            </button>
          ))}
          {/* Extras */}
          <button
            onClick={selectExtras}
            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-all text-sm mt-2 border-t border-white/5 pt-3 ${
              editingExtras
                ? 'bg-brand-green text-white font-bold shadow-lg'
                : 'text-gray-300 hover:bg-white/6 font-medium'
            }`}
          >
            <span className="text-lg">🍳</span>
            <div className="min-w-0 flex-1">
              <div className="truncate">Extras</div>
              <div className="text-[10px] opacity-60 uppercase tracking-wider">agregados</div>
            </div>
          </button>
        </div>

        {/* Right: Editor */}
        <div className="flex-1 min-w-0 bg-white/4 rounded-xl border border-white/5 p-4 md:p-6 max-h-[75vh] overflow-y-auto hide-scrollbar">
          {editingExtras ? (
            /* Extras Editor */
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>🍳</span> Precios de Extras
              </h3>
              <p className="text-xs text-gray-400">Los extras aplican a todos los idiomas. Modificá los precios aquí.</p>
              {extrasDraft.map((extra, i) => (
                <div key={i} className="bg-white/4 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{extra.label}</span>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Precio (ARS)</label>
                    <input
                      type="number"
                      value={extrasDraft[i].price}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setExtrasDraft(prev => {
                          const next = [...prev];
                          next[i] = { ...next[i], price: val };
                          return next;
                        });
                      }}
                      aria-label={`Precio de ${extra.label}`}
                      className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-brand-green outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : draft ? (
            /* Item Editor */
            <div className="space-y-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getEmoji(draft.id)}</span>
                  <div>
                    <h3 className="text-lg font-black text-white">{draft.name}</h3>
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{draft.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Delete Button */}
                  <button
                    onClick={handleDeleteItem}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                  {/* Item Availability Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:inline">
                      {draft.available !== false ? 'Disponible' : 'Agotado'}
                    </span>
                    <button
                      onClick={() => setDraft({ ...draft, available: draft.available === false ? true : false })}
                      className={`relative inline-flex h-6 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${draft.available !== false ? 'bg-brand-green' : 'bg-red-500/60'}`}
                      aria-label="Toggle disponibilidad"
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${draft.available !== false ? 'translate-x-4' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  📂 Categoría
                </label>
                <input
                  type="text"
                  value={draft.category || ''}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow placeholder:text-gray-600"
                  placeholder="Ej: Hamburguesas, Bebidas, Postres..."
                />
              </div>

              {/* Badge */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  🏷️ Badge destacado
                </label>
                <input
                  type="text"
                  value={draft.badge || ''}
                  onChange={(e) => setDraft({ ...draft, badge: e.target.value || undefined })}
                  className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow placeholder:text-gray-600"
                  placeholder="Ej: Más pedido, Nuevo, Oferta..."
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Nombre ({selectedLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={getItemName(draft, selectedLang)}
                  onChange={(e) => setDraft(setItemName(draft, selectedLang, e.target.value))}
                  className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow placeholder:text-gray-600"
                  placeholder={`Nombre en ${selectedLang.toUpperCase()}`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
                  Descripción ({selectedLang.toUpperCase()})
                </label>
                <textarea
                  value={getItemDescription(draft, selectedLang)}
                  onChange={(e) => setDraft(setItemDescription(draft, selectedLang, e.target.value))}
                  rows={3}
                  className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow resize-none placeholder:text-gray-600"
                  placeholder={`Descripción en ${selectedLang.toUpperCase()}`}
                />
              </div>

              {/* Options */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                    Opciones / Variaciones
                  </label>
                  <button
                    onClick={handleAddOption}
                    className="text-[10px] font-bold text-brand-green hover:underline flex items-center gap-1"
                  >
                    <Plus size={10} /> Añadir Variación
                  </button>
                </div>
                <div className="space-y-2">
                  {draft.options.map((opt, optIdx) => {
                    const isExpanded = expandedOptions.has(optIdx);
                    return (
                      <div key={optIdx} className="bg-white/4 rounded-xl border border-white/5 overflow-hidden">
                        {/* Option Header */}
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleOptionExpand(optIdx)}
                            className="flex-1 flex items-center justify-between px-4 py-3 text-left hover:bg-white/3 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`text-sm font-bold ${opt.available === false ? 'text-gray-500 line-through' : 'text-white'}`}>{opt.label}</span>
                              <span className="text-sm font-black text-brand-green">${opt.price.toLocaleString()}</span>
                              {opt.available === false && (
                                <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">Agotado</span>
                              )}
                            </div>
                            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                          </button>
                          {draft.options.length > 1 && (
                            <button
                              onClick={() => handleDeleteOption(optIdx)}
                              className="p-3 text-gray-500 hover:text-red-500"
                              title="Eliminar variación"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Option Body */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-1 space-y-3 border-t border-white/5">
                                {/* Option Availability */}
                                <div className="flex items-center justify-between bg-white/3 rounded-lg px-3 py-2">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                                    Disponibilidad
                                  </span>
                                  <button
                                    onClick={() => updateDraftOption(optIdx, o => ({ ...o, available: o.available === false ? true : false }))}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${opt.available !== false ? 'bg-brand-green' : 'bg-red-500/60'}`}
                                    aria-label="Toggle disponibilidad opción"
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${opt.available !== false ? 'translate-x-4' : 'translate-x-0'}`}
                                    />
                                  </button>
                                </div>

                                {/* Label */}
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                    Label ({selectedLang.toUpperCase()})
                                  </label>
                                  <input
                                    type="text"
                                    value={getOptionLabel(opt, selectedLang)}
                                    onChange={(e) => updateDraftOption(optIdx, o => setOptionLabel(o, selectedLang, e.target.value))}
                                    aria-label={`Label de ${opt.label} en ${selectedLang}`}
                                    className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow"
                                  />
                                </div>

                                {/* Price (universal) */}
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                    💲 Precio (ARS) — <span className="text-brand-green">universal, todos los idiomas</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={opt.price}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 0;
                                      updateDraftOption(optIdx, o => ({ ...o, price: val }));
                                    }}
                                    aria-label={`Precio de ${opt.label}`}
                                    className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-brand-green outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow"
                                  />
                                </div>

                                {/* Suffix */}
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                    Descripción de la opción ({selectedLang.toUpperCase()})
                                  </label>
                                  <textarea
                                    value={getOptionSuffix(opt, selectedLang)}
                                    onChange={(e) => updateDraftOption(optIdx, o => setOptionSuffix(o, selectedLang, e.target.value))}
                                    rows={2}
                                    aria-label={`Descripción de ${opt.label} en ${selectedLang}`}
                                    className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow resize-none"
                                  />
                                </div>

                                {/* Features */}
                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                    Ingredientes ({selectedLang.toUpperCase()}) — separar con coma
                                  </label>
                                  <input
                                    type="text"
                                    value={getOptionFeatures(opt, selectedLang).join(', ')}
                                    onChange={(e) => {
                                      const features = e.target.value.split(',').map(f => f.trimStart());
                                      updateDraftOption(optIdx, o => setOptionFeatures(o, selectedLang, features));
                                    }}
                                    className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-brand-green/40 transition-shadow"
                                    placeholder="Ej: Papas, Bebida, Queso"
                                  />
                                  {/* Feature chips preview */}
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {getOptionFeatures(opt, selectedLang).filter(Boolean).map((feat, fi) => (
                                      <span key={fi} className="text-[10px] font-bold bg-brand-green/20 text-brand-green px-2 py-0.5 rounded-md">
                                        {feat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <Plus size={48} className="text-gray-600 mb-4 opacity-20" />
              <p className="text-gray-400 font-medium">No hay productos seleccionados</p>
              <button
                onClick={handleAddNewItem}
                className="mt-4 text-brand-green font-bold hover:underline"
              >
                Crear el primer producto
              </button>
            </div>
          )}

          {/* Action Buttons */}
          {draft && (
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-brand-green text-white font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-brand-green/20"
              >
                <Save size={16} />
                Guardar Cambios
              </button>
              <button
                onClick={handleDiscard}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-white/6 text-gray-300 font-bold text-sm rounded-xl hover:bg-white/10 transition-all border border-white/10"
              >
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Descartar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
