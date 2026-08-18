import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/95 text-black shadow-lg transition hover:bg-white dark:border-white/15 dark:bg-gray-900/95 dark:text-white dark:hover:bg-gray-800 ${showLabel ? 'px-3' : 'w-10'}`}
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      {showLabel ? <span className="text-xs font-black">{isDark ? 'Día' : 'Noche'}</span> : null}
    </button>
  );
}
