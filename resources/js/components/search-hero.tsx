import { Link } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { login } from '@/routes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchHeroProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
}

export function SearchHero({ placeholder = 'Search for waterfall, lake, or village...', onSearch }: SearchHeroProps) {
    return (
        <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Background overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/90 to-primary/60" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl px-5 text-center">
                <h1 className="mb-8 text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg md:text-5xl">
                    Discover the Beauty of <br className="hidden md:block" /> Kutai Barat
                </h1>

                {/* Search Bar — glassmorphism */}
                <div className="mx-auto flex max-w-2xl items-center rounded-full bg-white/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur transition-transform hover:scale-[1.02]">
                    <div className="flex items-center pl-6 pr-3 text-neutral-500">
                        <Search className="size-5" />
                    </div>
                    <Input
                        className="flex-grow border-none bg-transparent text-base shadow-none focus-visible:ring-0 placeholder:text-neutral-400"
                        placeholder={placeholder}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && onSearch) {
                                onSearch((e.target as HTMLInputElement).value);
                            }
                        }}
                    />
                    <Button
                        className="hidden shrink-0 rounded-full px-8 py-6 text-sm font-semibold sm:block"
                        onClick={() => {
                            const input = document.querySelector<HTMLInputElement>('[data-search-input]');
                            if (input?.value && onSearch) onSearch(input.value);
                        }}
                    >
                        Search
                    </Button>
                </div>
            </div>
        </section>
    );
}
