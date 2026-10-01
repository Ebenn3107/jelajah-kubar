import { cn } from '@/lib/utils';

interface CategoryChipsProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
    counts?: Record<string, number>;
}

export function CategoryChips({ categories, activeCategory, onSelect, counts }: CategoryChipsProps) {
    return (
        <div role="group" aria-label="Filter kategori" className="hide-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 py-1 whitespace-nowrap md:mx-0 md:px-0">
            {categories.map((category) => {
                const isActive = category === activeCategory;
                const label = category === 'All' ? 'Semua' : category;
                const count = counts?.[category];

                return (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onSelect(category)}
                        className={cn(
                            'inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:scale-95',
                            isActive ? 'bg-brand text-white' : 'bg-surface-low text-ink-muted hover:bg-surface-high hover:text-ink',
                        )}
                    >
                        <span>{label}</span>
                        {count !== undefined && (
                            <span className={cn('text-xs font-medium', isActive ? 'text-white/80' : 'text-outline')}>{count}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
