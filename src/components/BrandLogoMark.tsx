import { useTheme } from '../context/ThemeContext';

interface BrandLogoMarkProps {
  src: string;
  alt: string;
}

/** Header logo: circle badge (dark) or truck-green curve (light). */
export function BrandLogoMark({ src, alt }: BrandLogoMarkProps) {
  const { isDark } = useTheme();

  if (isDark) {
    return (
      <div className="h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full overflow-hidden bg-puestito-green ring-1 ring-white/15 shadow-sm">
        <img src={src} alt={alt} className="h-full w-full object-cover object-center scale-110" />
      </div>
    );
  }

  return (
    <div className="relative h-10 md:h-11 shrink-0 min-w-[4.5rem] md:min-w-[5rem]">
      <svg
        aria-hidden
        viewBox="0 0 96 48"
        className="absolute -left-2 -bottom-1.5 w-[5.5rem] md:w-24 h-auto pointer-events-none"
        preserveAspectRatio="none"
      >
        <path d="M0,48 Q48,6 96,20 L96,48 Z" className="fill-puestito-green" />
      </svg>
      <img
        src={src}
        alt={alt}
        className="relative h-full w-auto max-w-[5.5rem] md:max-w-[6rem] object-contain object-left pl-0.5"
      />
    </div>
  );
}
