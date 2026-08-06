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
      className="flex max-w-[min(100%,16.5rem)] items-center gap-1 overflow-x-auto rounded-full border border-[color:var(--lp-border)] bg-[var(--lp-surface)] px-1.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] shadow-sm sm:max-w-none sm:gap-2 sm:px-2 sm:py-1.5"
      aria-label="Apariencia landing"
    >
      <button
        type="button"
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lp-surface-alt)] text-[var(--lp-text)]"
        aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      >
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>

      {LANDING_PALETTES.map(p => (
        <button
          key={p.id}
          type="button"
          title={p.name}
          onClick={() => {
            writeLandingPalette(p.id);
            onPalette(p.id);
          }}
          className={`h-6 w-6 shrink-0 rounded-full border-2 transition sm:h-7 sm:w-7 ${
            paletteId === p.id ? 'border-[var(--lp-accent)] scale-110' : 'border-transparent'
          }`}
          style={{ backgroundColor: p.swatch }}
          aria-label={p.name}
          aria-pressed={paletteId === p.id}
        />
      ))}

      <span className="mx-0.5 hidden h-4 w-px shrink-0 bg-[color:var(--lp-border)] sm:block" />

      {(['a', 'b'] as HeroVariant[]).map(v => (
        <button
          key={v}
          type="button"
          onClick={() => onHeroVariant(v)}
          className={`shrink-0 rounded-full px-2 py-1 ${
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
