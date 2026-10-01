import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/pagination';

const LABELS: Record<string, string> = {
    '&laquo; Previous': '‹ Sebelumnya',
    'Next &raquo;': 'Berikutnya ›',
};

/** Link paginasi bawaan Laravel; link tanpa URL (ujung halaman) dirender bukan-link. */
export function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    const base = 'rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-brand';

    return (
        <nav aria-label="Paginasi" className="mt-12 flex flex-wrap justify-center gap-2">
            {links.map((link, i) => {
                const label = LABELS[link.label] ?? link.label;

                return link.url ? (
                    <Link
                        key={i}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={`${base} ${link.active ? 'bg-brand text-white' : 'bg-surface-low text-ink-muted hover:bg-surface-high hover:text-ink'}`}
                        preserveState
                        preserveScroll
                    >
                        {label}
                    </Link>
                ) : (
                    <span key={i} aria-disabled="true" className={`${base} cursor-not-allowed text-outline`}>
                        {label}
                    </span>
                );
            })}
        </nav>
    );
}
