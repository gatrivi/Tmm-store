import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import type { HeroVariant } from '../../utils/landingAb';
import {
  LANDING_PALETTES,
  type LandingPaletteId,
  writeLandingPalette,
} from '../../utils/landingPalettes';

type Props = {
  heroVariant: HeroVariant;
  onHeroVariant: (v: HeroVariant) => void;
  paletteId: LandingPaletteId;
  onPalette: (id: LandingPaletteId) => void;
};

export default function LandingThemeBar({
  heroVariant,
  onHeroVariant,
  paletteId,
  onPalette,
}: Props) {
  const { setTheme, isDark } = useTheme();

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-full border border-[color:var(--lp-border)] bg-[var(--lp-surface)] px-2 py-1.5 text-[10px] font-black uppercase tracking-[0.08em] shadow-sm"
      aria-label="Apariencia landing"
    >
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--lp-surface-alt)] text-[var(--lp-text)]"
        aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      <span className="hidden text-[var(--lp-text-muted)] sm:inline">Paleta</span>
      {LANDING_PALETTES.map(p => (
        <button
          key={p.id}
          type="button"
          title={p.name}
          onClick={() => {
            writeLandingPalette(p.id);
            onPalette(p.id);
          }}
          className={`h-7 w-7 rounded-full border-2 transition ${
            paletteId === p.id ? 'border-[var(--lp-accent)] scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: p.swatch }}
          aria-label={p.name}
          aria-pressed={paletteId === p.id}
        />
      ))}

      <span className="mx-1 hidden h-4 w-px bg-[color:var(--lp-border)] sm:block" />

      <span className="hidden text-[var(--lp-text-muted)] sm:inline">Hero</span>
      {(['a', 'b'] as HeroVariant[]).map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onHeroVariant(v)}
          className={`rounded-full px-2.5 py-1 ${
            heroVariant === v
              ? 'bg-[var(--lp-ink)] text-[var(--lp-on-ink)]'
              : 'text-[var(--lp-text-muted)]'
          }`}
        >
          {v.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

