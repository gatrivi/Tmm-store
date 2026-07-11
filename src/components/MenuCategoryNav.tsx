import { useEffect, useRef, useState } from 'react';
import type { MenuCategory } from '../../types/menuCategory';

interface MenuCategoryNavProps {
  categories: MenuCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function MenuCategoryNav({ categories, activeId, onSelect }: MenuCategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-cat="${activeId}"]`);
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeId]);

  return (
    <div className="sticky top-[72px] z-[9] bg-surface/95 backdrop-blur-md border-b border-border -mx-4 px-4 py-2">
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto hide-scrollbar max-w-5xl mx-auto">
        {categories.map(cat => (
          <button
            key={cat.id}
            type="button"
            data-cat={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              activeId === cat.id
                ? 'bg-brand-green text-white shadow-md'
                : 'bg-surface-muted text-text-secondary hover:text-text-primary border border-border'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

interface UseCategoryScrollSpyOptions {
  categories: MenuCategory[];
  headerOffset?: number;
}

export function useCategoryScrollSpy({ categories, headerOffset = 140 }: UseCategoryScrollSpyOptions) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? 'menu');

  useEffect(() => {
    if (categories.length === 0) return;

    const onScroll = () => {
      let current = categories[0].id;
      for (const cat of categories) {
        const el = document.getElementById(`menu-section-${cat.id}`);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= headerOffset) current = cat.id;
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [categories, headerOffset]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(`menu-section-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setActiveId(id);
  };

  return { activeId, scrollToCategory };
}
