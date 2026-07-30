import { Loader2, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchHeroProps {
    placeholder?: string;
    onSearch?: (query: string) => void;
    loading?: boolean;
    heroFoto?: string | null;
    totalWisata?: number;
    totalKategori?: number;
}

export function SearchHero({ placeholder = 'Search destinations...', onSearch, loading, heroFoto, totalWisata, totalKategori }: SearchHeroProps) {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        setValue('');
        inputRef.current?.focus();
        if (onSearch) onSearch('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(value);
        }
    };

    return (
        <section className="relative flex h-[45vh] items-center justify-center overflow-hidden md:h-[50vh]">
            {/* Background */}
            {heroFoto ? (
                <img src={heroFoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : null}
            <div className={`absolute inset-0 z-0 ${heroFoto ? 'bg-black/50' : 'bg-gradient-to-br from-[#00685f]/90 to-[#003d38]'}`} />

            <div className="relative z-10 w-full max-w-4xl px-5 text-center">
                <h1 className="mb-3 text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl">
                    Explore Destinations
                </h1>
                <p className="mx-auto mb-6 max-w-2xl text-base text-white/80 md:text-lg">
                    Plan your perfect trip to Kutai Barat with AI-powered recommendations
                </p>

                <div className="mx-auto flex max-w-2xl items-center rounded-full bg-white/95 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.1)] backdrop-blur transition-transform hover:scale-[1.02]">
                    <div className="flex items-center pl-6 pr-3 text-neutral-400">
                        {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
                    </div>
                    <Input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex-grow border-none bg-transparent text-base shadow-none focus-visible:ring-0 placeholder:text-neutral-400"
                        placeholder={placeholder}
                        onKeyDown={handleKeyDown}
                    />
                    {value && (
                        <button
                            onClick={handleClear}
                            className="mr-2 rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                            aria-label="Clear search"
                        >
                            <X className="size-4" />
                        </button>
                    )}
                    <Button
                        className="hidden shrink-0 rounded-full px-8 py-6 text-sm font-semibold sm:block"
                        onClick={() => onSearch?.(value)}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </div>

                {/* Stats */}
                {(totalWisata !== undefined || totalKategori !== undefined) && (
                    <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/80">
                        {totalWisata !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-bold text-white">{totalWisata}</span>
                                <span>Destinations</span>
                            </div>
                        )}
                        <span className="text-white/30">•</span>
                        {totalKategori !== undefined && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-bold text-white">{totalKategori}</span>
                                <span>Categories</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
