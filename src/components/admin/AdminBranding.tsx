import { useState } from 'react';
import { Palette, MapPin, ExternalLink, Type, Check, Upload, X, ImageIcon } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import { PRESET_PALETTES } from '../../utils/palettes';

export function AdminBranding() {
  const { siteSettings, setSiteSettings } = useMenu();
  const [activePalette, setActivePalette] = useState<string>(() => {
    const match = PRESET_PALETTES.find(p =>
      p.primary === siteSettings.brandColor &&
      p.dark === siteSettings.brandColorDark
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

  const updateField = (field: keyof typeof siteSettings, value: string) => {
    setSiteSettings(prev => ({ ...prev, [field]: value }));
  };

  const compressLogo = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_SIZE = 512;

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
          resolve(canvas.toDataURL('image/webp', 0.85));
        };
        img.onerror = reject;
        if (typeof e.target?.result === 'string') img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await compressLogo(file);
      setSiteSettings(prev => ({ ...prev, brandLogo: base64 }));
    } catch {
      alert('Error al procesar el logo');
    }
    e.target.value = '';
  };

  const removeLogo = () => {
    setSiteSettings(prev => ({ ...prev, brandLogo: undefined }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Branding</h2>
        <p className="text-xs sm:text-sm text-gray-400 font-medium">Personalizá la identidad visual de tu tienda</p>
      </div>

      {/* Business Name */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
            <Type size={20} className="text-pink-400" />
          </div>
          <span className="text-sm font-black text-white">Nombre del negocio</span>
        </div>
        <input
          type="text"
          value={siteSettings.brandName}
          onChange={(e) => updateField('brandName', e.target.value)}
          placeholder="Ej: El Puestito del Tío"
          className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-pink-500/40 transition-shadow placeholder:text-gray-600"
        />
      </div>

      {/* Logo */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <ImageIcon size={20} className="text-blue-400" />
          </div>
          <span className="text-sm font-black text-white">Logo del negocio</span>
        </div>

        {siteSettings.brandLogo ? (
          <div className="relative inline-block">
            <img
              src={siteSettings.brandLogo}
              alt="Logo preview"
              className="max-h-32 max-w-full rounded-lg border border-white/10 object-contain bg-white/5"
            />
            <button
              onClick={removeLogo}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition shadow-lg"
              title="Eliminar logo"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed border-white/10 bg-white/4 hover:bg-white/8 hover:border-white/20 transition cursor-pointer">
            <Upload size={24} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-500">Subir logo (PNG, JPG, SVG)</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        )}
        <p className="text-[10px] text-gray-500">Se comprime automáticamente. Si no subís nada, se muestra el nombre como texto.</p>
      </div>

      {/* Palettes */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Palette size={20} className="text-purple-400" />
          </div>
          <span className="text-sm font-black text-white">Paleta de colores</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_PALETTES.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPalette(p.id)}
              className={`relative rounded-xl border p-4 text-left transition-all ${
                activePalette === p.id
                  ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                  : 'border-white/10 bg-white/4 hover:bg-white/8'
              }`}
            >
              {activePalette === p.id && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="flex gap-1.5 mb-3">
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.dark }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.light }} />
              </div>
              <span className="text-xs font-bold text-white block">{p.name}</span>
            </button>
          ))}
        </div>

        {/* Custom colors */}
        {activePalette === 'custom' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/5">
            {[
              { label: 'Primario', field: 'brandColor' as const },
              { label: 'Oscuro', field: 'brandColorDark' as const },
              { label: 'Claro', field: 'brandColorLight' as const },
              { label: 'Acento', field: 'brandAccent' as const },
            ].map((c) => (
              <div key={c.field}>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">{c.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={siteSettings[c.field]}
                    onChange={(e) => updateField(c.field, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="text-xs font-mono text-gray-300">{siteSettings[c.field]}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => applyPalette('custom')}
          className={`text-xs font-bold px-3 py-2 rounded-lg transition ${
            activePalette === 'custom'
              ? 'bg-purple-500 text-white'
              : 'bg-white/6 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          Personalizar colores
        </button>
      </div>

      {/* Contact Info */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
            <MapPin size={20} className="text-orange-400" />
          </div>
          <span className="text-sm font-black text-white">Datos de contacto</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Dirección</label>
            <input
              type="text"
              value={siteSettings.brandAddress}
              onChange={(e) => updateField('brandAddress', e.target.value)}
              placeholder="Ej: Dorrego 4045, Palermo, Buenos Aires"
              className="w-full bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-orange-500/40 transition-shadow placeholder:text-gray-600"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Instagram (solo usuario, sin @)</label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm">@</span>
              <input
                type="text"
                value={siteSettings.brandInstagram}
                onChange={(e) => updateField('brandInstagram', e.target.value)}
                placeholder="elpuestitodeltio"
                className="flex-1 bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-orange-500/40 transition-shadow placeholder:text-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">Google Maps URL</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={siteSettings.brandGoogleMaps}
                onChange={(e) => updateField('brandGoogleMaps', e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
                className="flex-1 bg-white/8 border border-white/10 rounded-lg px-3 py-2.5 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-orange-500/40 transition-shadow placeholder:text-gray-600"
              />
              {siteSettings.brandGoogleMaps && (
                <a
                  href={siteSettings.brandGoogleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/6 rounded-lg text-gray-400 hover:text-white transition"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-6 space-y-4">
        <span className="text-sm font-black text-white block">Vista previa</span>
        <div
          className="rounded-xl overflow-hidden border border-white/10"
          style={{ backgroundColor: siteSettings.brandColorLight, color: siteSettings.brandTextColor, fontFamily: siteSettings.brandFont }}
        >
          <div className="p-4 flex items-center justify-between" style={{ backgroundColor: siteSettings.brandColorDark, color: '#fff' }}>
            {siteSettings.brandLogo ? (
              <img src={siteSettings.brandLogo} alt="Logo" className="h-6 object-contain" />
            ) : (
              <span className="font-black text-sm">{siteSettings.brandName || 'Tu Negocio'}</span>
            )}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: siteSettings.brandColor }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: siteSettings.brandAccent }} />
            </div>
          </div>
          <div className="p-4 space-y-2">
            <div className="h-3 w-3/4 rounded" style={{ backgroundColor: siteSettings.brandColor + '20' }} />
            <div className="h-3 w-1/2 rounded" style={{ backgroundColor: siteSettings.brandColor + '20' }} />
            <button
              className="mt-2 px-4 py-1.5 rounded-lg text-xs font-bold text-white"
              style={{ backgroundColor: siteSettings.brandColor }}
            >
              Confirmar pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
