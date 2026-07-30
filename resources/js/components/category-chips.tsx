import { cn } from '@/lib/utils';

interface CategoryChipsProps {
    categories: string[];
    activeCategory: string;
    onSelect: (category: string) => void;
}

export function CategoryChips({ categories, activeCategory, onSelect }: CategoryChipsProps) {
    return (
        <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
                const isActive = category === activeCategory;
                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        className={cn(
                            'rounded-full px-6 py-2.5 text-sm font-semibold transition-all active:scale-95',
                            isActive
                                ? 'bg-[#00685f] text-white shadow-md'
                                : 'bg-white text-neutral-600 shadow-sm hover:bg-teal-50 hover:text-[#00685f]',
                        )}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}
