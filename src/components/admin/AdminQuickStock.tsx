import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';

/**
 * Toggle rápido de disponibilidad — para cuando se agota un plato en el servicio.
 */
export function AdminQuickStock() {
  const { menuItems, updateMenuItem } = useMenu();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = menuItems.map((item, index) => ({ item, index }));
    if (!q) return list;
    return list.filter(({ item }) => item.name.toLowerCase().includes(q));
  }, [menuItems, query]);

  const soldOutCount = menuItems.filter(i => i.available === false).length;

  const toggleAvailable = (index: number) => {
    const item = menuItems[index];
    updateMenuItem(index, { ...item, available: item.available === false ? true : false });
  };

  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-white/5 transition"
      >
        <div>
          <p className="text-sm font-black text-white">¿Se acabó algo?</p>
          <p className="text-xs text-gray-500">
            Marcá agotado en un toque — desaparece del menú al instante
            {soldOutCount > 0 ? ` · ${soldOutCount} agotado(s)` : ''}
          </p>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-white/5 p-4 space-y-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar plato..."
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
          />
          <div className="max-h-48 overflow-y-auto hide-scrollbar space-y-2">
            {filtered.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Sin resultados</p>
            ) : (
              filtered.map(({ item, index }) => {
                const available = item.available !== false;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 bg-black/20 rounded-xl px-3 py-2.5"
                  >
                    <span className={`text-sm font-bold truncate ${available ? 'text-white' : 'text-gray-500 line-through'}`}>
                      {item.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleAvailable(index)}
                      className={`shrink-0 min-h-[44px] px-3 rounded-xl text-xs font-black transition ${
                        available
                          ? 'bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-300'
                          : 'bg-brand-green/20 text-brand-green'
                      }`}
                    >
                      {available ? 'Agotado' : 'Disponible'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
