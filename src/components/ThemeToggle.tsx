import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-full transition dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white light:bg-surface-muted light:hover:bg-border light:text-text-secondary light:hover:text-text-primary"
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
