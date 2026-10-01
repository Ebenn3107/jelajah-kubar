import { cn } from '@/lib/utils';

interface CategoryChipsProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
    counts?: Record<string, number>;
}

const categoryIcons: Record<string, string> = {
    'All': '🌟',
    'Alam': '🌿',
    'Budaya': '🏛️',
    'Air Terjun': '💧',
    'Danau': '🏞️',
    'Petualangan': '🧗',
    'Pantai': '🏖️',
    'Religi': '⛪',
    'Sejarah': '🏰',
    'Kuliner': '🍲',
    'Hiburan': '🎭',
};

export function CategoryChips({ categories, activeCategory, onSelect, counts }: CategoryChipsProps) {
    return (
        <div role="group" aria-label="Filter kategori" className="flex gap-3 overflow-x-auto hide-scrollbar whitespace-nowrap">
            {categories.map((category) => {
                const isActive = category === activeCategory;
                const icon = categoryIcons[category] || '';
                const label = category === 'All' ? 'Semua' : category;
                const count = counts?.[category];

                return (
                    <button
                        key={category}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => onSelect(category)}
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-2 focus-visible:outline-brand active:scale-95 md:px-5 md:py-2.5',
                            isActive
                                ? 'bg-brand text-white shadow-md'
                                : 'bg-white text-neutral-600 shadow-sm hover:bg-teal-50 hover:text-brand',
                        )}
                    >
                        {icon && <span aria-hidden="true" className="text-base">{icon}</span>}
                        <span>{label}</span>
                        {count !== undefined && (
                            <span className={cn(
                                'ml-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                                isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-500',
                            )}>
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
