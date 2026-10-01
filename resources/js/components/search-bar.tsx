import { Loader2, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    initialValue?: string;
    loading?: boolean;
    placeholder?: string;
}

export function SearchBar({ onSearch, initialValue = '', loading, placeholder = 'Cari nama, kategori, atau fasilitas' }: SearchBarProps) {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
        setValue('');
        onSearch('');
        inputRef.current?.focus();
    };

    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSearch(value);
            }}
            className="flex w-full items-center rounded-full border border-line bg-white px-4 shadow-[0_4px_20px_rgba(18,28,42,0.05)] focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15"
        >
            {loading ? (
                <Loader2 className="size-5 shrink-0 animate-spin text-ink-muted" aria-hidden="true" />
            ) : (
                <Search className="size-5 shrink-0 text-ink-muted" aria-hidden="true" />
            )}
            <input
                ref={inputRef}
                type="search"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    onSearch(e.target.value);
                }}
                aria-label="Cari destinasi"
                placeholder={placeholder}
                className="min-w-0 grow appearance-none border-none bg-transparent px-3 py-3 text-base text-ink placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Hapus pencarian"
                    className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-surface-low hover:text-ink focus-visible:outline-2 focus-visible:outline-brand"
                >
                    <X className="size-4" aria-hidden="true" />
                </button>
            )}
        </form>
    );
}
