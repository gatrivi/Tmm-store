import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { isDark, setTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition text-gray-300 hover:text-white"
      aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
      title={isDark ? 'Modo claro' : 'Modo oscuro'}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
