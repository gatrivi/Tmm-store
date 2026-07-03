import { useState } from 'react';
import { Check, LayoutGrid, Palette } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { PRESET_PALETTES } from '../../utils/palettes';
import { MENU_LAYOUTS, type MenuLayoutId } from '../../utils/menuLayouts';

interface MenuAppearanceSettingsProps {
  compact?: boolean;
}

export function MenuAppearanceSettings({ compact = false }: MenuAppearanceSettingsProps) {
  const { siteSettings, setSiteSettings } = useMenu();
  const [activePalette, setActivePalette] = useState<string>(() => {
    const match = PRESET_PALETTES.find(
      p => p.primary === siteSettings.brandColor && p.dark === siteSettings.brandColorDark,
    );
    return match?.id || 'custom';
  });

  const applyPalette = (paletteId: string) => {
    setActivePalette(paletteId);
    if (paletteId === 'custom') return;
    const p = PRESET_PALETTES.find(x => x.id === paletteId);
    if (!p) return;
    setSiteSettings(prev => ({
      ...prev,
      brandColor: p.primary,
      brandColorDark: p.dark,
      brandColorLight: p.light,
      brandAccent: p.accent,
      brandTextColor: p.text,
    }));
  };

  const setLayout = (layout: MenuLayoutId) => {
    setSiteSettings(prev => ({ ...prev, menuLayout: layout }));
  };

  const paletteGrid = compact ? 'grid-cols-3 gap-2' : 'grid-cols-1 sm:grid-cols-3 gap-3';
  const layoutGrid = compact ? 'grid-cols-2 gap-2' : 'grid-cols-2 sm:grid-cols-4 gap-3';

  return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      <div className={`bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl ${compact ? 'p-4' : 'p-6'} space-y-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Palette size={20} className="text-purple-400" />
          </div>
          <span className="text-sm font-black text-white">Paleta de colores</span>
        </div>

        <div className={`grid ${paletteGrid}`}>
          {PRESET_PALETTES.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => applyPalette(p.id)}
              className={`relative rounded-xl border p-3 text-left transition-all ${
                activePalette === p.id
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                  : 'border-white/10 bg-white/4 hover:bg-white/8'
              }`}
            >
              {activePalette === p.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
              <div className="flex gap-1 mb-2">
                {[p.primary, p.dark, p.accent].map(c => (
                  <div key={c} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                ))}
              </div>
              <span className="text-[10px] font-bold text-white block leading-tight">{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={`bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl ${compact ? 'p-4' : 'p-6'} space-y-4`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center">
            <LayoutGrid size={20} className="text-teal-400" />
          </div>
          <span className="text-sm font-black text-white">Disposición del menú</span>
        </div>

        <div className={`grid ${layoutGrid}`}>
          {MENU_LAYOUTS.map(l => {
            const active = (siteSettings.menuLayout ?? 'grid') === l.id;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? 'border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/30'
                    : 'border-white/10 bg-white/4 hover:bg-white/8'
                }`}
              >
                <span className="text-xs font-bold text-white block">{l.name}</span>
                {!compact && (
                  <span className="text-[10px] text-gray-500 mt-1 block leading-snug">{l.description}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
