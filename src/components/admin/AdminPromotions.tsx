import React, { useState } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import type { Promotion } from '../../types/promotion';

function newPromoId(): string {
  return `promo_${Date.now().toString(36)}`;
}

export function AdminPromotions() {
  const { promotions, setPromotions } = useMenu();
  const [code, setCode] = useState('');
  const [label, setLabel] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [discountValue, setDiscountValue] = useState('10');
  const [minTotal, setMinTotal] = useState('0');

  const handleAdd = () => {
    if (!code.trim() || !label.trim()) return;
    const promo: Promotion = {
      id: newPromoId(),
      code: code.trim().toUpperCase(),
      label: label.trim(),
      discountType,
      discountValue: parseInt(discountValue, 10) || 0,
      minOrderTotal: parseInt(minTotal, 10) || 0,
      active: true,
    };
    setPromotions(prev => [...prev, promo]);
    setCode('');
    setLabel('');
  };

  const toggleActive = (id: string) => {
    setPromotions(prev => prev.map(p => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const removePromo = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-white">Promociones</h2>
        <p className="text-sm text-gray-500 mt-1">Cupones de descuento para checkout</p>
      </div>

      <div className="bg-white/3 border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
          <Tag size={16} /> Nueva promoción
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="Código (ej: VERANO10)"
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
          />
          <input
            value={label}
            onChange={e => setLabel(e.target.value)}
            placeholder="Nombre visible"
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
          />
          <select
            value={discountType}
            onChange={e => setDiscountType(e.target.value as 'percent' | 'fixed')}
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
          >
            <option value="percent">Porcentaje (%)</option>
            <option value="fixed">Monto fijo ($)</option>
          </select>
          <input
            value={discountValue}
            onChange={e => setDiscountValue(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Valor descuento"
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white"
          />
          <input
            value={minTotal}
            onChange={e => setMinTotal(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Mínimo de compra ($)"
            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white md:col-span-2"
          />
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-brand-green text-white px-4 py-2.5 rounded-xl text-sm font-bold"
        >
          <Plus size={16} /> Agregar promoción
        </button>
      </div>

      <div className="space-y-3">
        {promotions.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay promociones configuradas.</p>
        ) : (
          promotions.map(promo => (
            <div
              key={promo.id}
              className="flex flex-wrap items-center justify-between gap-3 bg-white/3 border border-white/5 rounded-xl p-4"
            >
              <div>
                <p className="font-black text-white">{promo.code}</p>
                <p className="text-xs text-gray-400">
                  {promo.label} · {promo.discountType === 'percent' ? `${promo.discountValue}%` : `$${promo.discountValue}`}
                  {promo.minOrderTotal > 0 ? ` · mín. $${promo.minOrderTotal.toLocaleString('es-AR')}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(promo.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    promo.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {promo.active ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => removePromo(promo.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg"
                  aria-label="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
