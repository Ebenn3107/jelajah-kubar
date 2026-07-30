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
};

export function CategoryChips({ categories, activeCategory, onSelect, counts }: CategoryChipsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => {
                const isActive = category === activeCategory;
                const icon = categoryIcons[category] || '';
                const count = counts?.[category];

                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 md:px-5 md:py-2.5',
                            isActive
                                ? 'bg-[#00685f] text-white shadow-md'
                                : 'bg-white text-neutral-600 shadow-sm hover:bg-teal-50 hover:text-[#00685f]',
                        )}
                    >
                        {icon && <span className="text-base">{icon}</span>}
                        <span>{category}</span>
                        {count !== undefined && (
                            <span className={cn(
                                'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
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
