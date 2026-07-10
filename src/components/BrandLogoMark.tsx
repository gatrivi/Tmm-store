import { useTheme } from '../context/ThemeContext';

interface BrandLogoMarkProps {
  src: string;
  alt: string;
}

/** Header logo: circle badge in light and dark. */
export function BrandLogoMark({ src, alt }: BrandLogoMarkProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full overflow-hidden bg-puestito-green shadow-sm ring-1 ${
        isDark ? 'ring-white/15' : 'ring-black/10'
      }`}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover object-center scale-110" />
    </div>
  );
}
